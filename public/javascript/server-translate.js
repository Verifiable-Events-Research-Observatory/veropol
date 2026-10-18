const crypto = require('crypto');

const SUPPORTED_LANGS = { en: 'en', fr: 'fr', es: 'es', ru: 'ru', ar: 'ar', zh: 'zh-CN', tr: 'tr' };
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const escapeHtml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const prepare = t => escapeHtml(t).replace(/\bVERO\b/g, '<span class="notranslate">VERO</span>');
const clean = s => String(s)
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

function normalizeLang(code) {
    if (!code) return null;
    const c = String(code).toLowerCase();
    if (c.startsWith('zh')) return 'zh';
    return SUPPORTED_LANGS[c] ? c : null;
}

async function pool(items, limit, fn) {
    const out = new Array(items.length);
    let i = 0;
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (i < items.length) {
            const k = i++;
            out[k] = await fn(items[k]);
        }
    }));
    return out;
}

module.exports = function createTranslator({ TransCache, dbReady }) {
    const mem = new Map();
    const stats = {};
    const MAX_MEM = 8000;

    const note = (name, ok, info) => {
        const s = stats[name] || (stats[name] = { ok: 0, fail: 0, last: '' });
        if (ok) s.ok++;
        else s.fail++;
        s.last = info || '';
    };

    const keyOf = (src, target, text) => crypto.createHash('sha1').update(src + '|' + target + '|' + text).digest('hex');

    async function officialBatch(texts, target, source, key) {
        const out = new Array(texts.length).fill(null);
        let start = 0;
        while (start < texts.length) {
            let end = start;
            let chars = 0;
            while (end < texts.length && end - start < 100 && chars + texts[end].length <= 18000) {
                chars += texts[end].length;
                end++;
            }
            if (end === start) end++;
            const slice = texts.slice(start, end);
            try {
                const body = { q: slice.map(prepare), target, format: 'html' };
                if (source) body.source = source;
                const response = await fetch('https://translation.googleapis.com/language/translate/v2?key=' + key, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                    signal: AbortSignal.timeout(12000)
                });
                if (response.ok) {
                    const data = await response.json();
                    const list = data && data.data && data.data.translations;
                    if (Array.isArray(list) && list.length === slice.length) {
                        list.forEach((item, k) => {
                            out[start + k] = { v: clean(item.translatedText), d: item.detectedSourceLanguage || null };
                        });
                        note('official', true, 'ok');
                    }
                } else {
                    note('official', false, 'HTTP ' + response.status);
                }
            } catch (e) {
                note('official', false, String(e.message || e));
            }
            start = end;
        }
        return out;
    }

    function gtxProvider(name, base) {
        return async (text, target, source) => {
            const url = base + '?client=gtx&sl=' + encodeURIComponent(source || 'auto') + '&tl=' + encodeURIComponent(target) + '&dt=t&q=' + encodeURIComponent(text);
            const response = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json,text/plain,*/*' }, signal: AbortSignal.timeout(7000) });
            if (!response.ok) {
                const err = new Error('HTTP ' + response.status);
                err.status = response.status;
                throw err;
            }
            const data = await response.json();
            if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error('bad format');
            return { v: data[0].map(p => (p && p[0]) ? p[0] : '').join(''), d: typeof data[2] === 'string' ? data[2] : null };
        };
    }

    async function dictChrome(text, target, source) {
        const url = 'https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=' + encodeURIComponent(source || 'auto') + '&tl=' + encodeURIComponent(target) + '&q=' + encodeURIComponent(text);
        const response = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(7000) });
        if (!response.ok) {
            const err = new Error('HTTP ' + response.status);
            err.status = response.status;
            throw err;
        }
        const data = await response.json();
        const first = Array.isArray(data) ? data[0] : null;
        if (typeof first === 'string') return { v: first, d: null };
        if (Array.isArray(first) && typeof first[0] === 'string') return { v: first[0], d: typeof first[1] === 'string' ? first[1] : null };
        throw new Error('bad format');
    }

    const providers = [
        { name: 'gtx', run: gtxProvider('gtx', 'https://translate.googleapis.com/translate_a/single'), until: 0 },
        { name: 'dict-chrome', run: dictChrome, until: 0 },
        { name: 'gtx-web', run: gtxProvider('gtx-web', 'https://translate.google.com/translate_a/single'), until: 0 }
    ];

    async function freeTranslate(text, target, source) {
        for (const p of providers) {
            if (p.until > Date.now()) continue;
            try {
                const r = await p.run(text, target, source);
                if (r && r.v) {
                    note(p.name, true, 'ok');
                    return r;
                }
            } catch (e) {
                note(p.name, false, String(e.message || e));
                if (e.status === 429 || e.status === 403) p.until = Date.now() + 60000;
            }
        }
        return null;
    }

    function remember(k, value) {
        if (mem.size >= MAX_MEM) mem.delete(mem.keys().next().value);
        mem.set(k, value);
    }

    async function core(texts, lang, source) {
        const target = SUPPORTED_LANGS[lang];
        const out = new Array(texts.length).fill(null);
        if (!target) return out;
        const src = source || 'auto';
        const keys = texts.map(t => keyOf(src, target, String(t)));
        const pending = [];
        texts.forEach((t, i) => {
            if (!t || !String(t).trim()) {
                out[i] = { v: t, d: null };
                return;
            }
            const hit = mem.get(keys[i]);
            if (hit) out[i] = hit;
            else pending.push(i);
        });
        if (pending.length && dbReady()) {
            try {
                const docs = await TransCache.find({ k: { $in: pending.map(i => keys[i]) } }).lean();
                const found = new Map(docs.map(d => [d.k, d]));
                for (let n = pending.length - 1; n >= 0; n--) {
                    const i = pending[n];
                    const d = found.get(keys[i]);
                    if (d) {
                        const value = { v: d.v, d: d.d || null };
                        out[i] = value;
                        remember(keys[i], value);
                        pending.splice(n, 1);
                    }
                }
            } catch (e) { }
        }
        if (pending.length) {
            const list = pending.map(i => String(texts[i]));
            let results = new Array(list.length).fill(null);
            const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
            if (apiKey) results = await officialBatch(list, target, source, apiKey);
            const missing = results.map((r, k) => (r ? -1 : k)).filter(k => k >= 0);
            if (missing.length) {
                const free = await pool(missing, 6, k => freeTranslate(list[k], target, source));
                missing.forEach((k, n) => { results[k] = free[n]; });
            }
            const fresh = [];
            pending.forEach((index, k) => {
                const r = results[k];
                if (r && r.v) {
                    out[index] = r;
                    remember(keys[index], r);
                    fresh.push({ k: keys[index], v: r.v, d: r.d || null });
                }
            });
            if (fresh.length && dbReady()) TransCache.insertMany(fresh, { ordered: false }).catch(() => { });
        }
        return out;
    }

    async function translateTexts(texts, lang, source = 'en') {
        const res = await core(texts, lang, source);
        return res.map(r => (r ? r.v : null));
    }

    async function detectToEnglish(q) {
        const res = await core([q], 'en', null);
        const r = res[0];
        if (!r) return null;
        return { text: r.v, detected: normalizeLang(r.d) };
    }

    async function health() {
        const report = { official: process.env.GOOGLE_TRANSLATE_API_KEY ? 'key set' : 'no key', providers: {}, stats };
        for (const p of providers) {
            try {
                const r = await p.run('Hello world', 'tr', 'en');
                report.providers[p.name] = { ok: true, sample: r.v };
            } catch (e) {
                report.providers[p.name] = { ok: false, error: String(e.message || e) };
            }
        }
        return report;
    }

    return { SUPPORTED_LANGS, normalizeLang, translateTexts, detectToEnglish, health };
};
