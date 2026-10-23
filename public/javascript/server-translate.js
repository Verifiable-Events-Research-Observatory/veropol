const crypto = require('crypto');

const SUPPORTED_LANGS = { en: 'en', fr: 'fr', es: 'es', ru: 'ru', ar: 'ar', zh: 'zh-CN', tr: 'tr' };
const MS_LANGS = { en: 'en', fr: 'fr', es: 'es', ru: 'ru', ar: 'ar', 'zh-CN': 'zh-Hans', tr: 'tr' };
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const CACHE_SALT = 'v2';

const escapeHtml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const prepare = t => escapeHtml(t).replace(/\bVERO\b/g, '<span class="notranslate">VERO</span>');
const clean = s => String(s)
    .replace(/<[^>]+>/g, '')
    .replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const GLOSS = {
    tr: {
        'Feed': 'Haber Akışı', 'Articles': 'Makaleler', 'Methodology': 'Metodoloji', 'Strategic Theaters': 'Stratejik Cepheler',
        'Feedback': 'Geri Bildirim', 'Load Intelligence': 'İstihbaratı Yükle', 'Live Map': 'Canlı Harita', 'Breaking News': 'Son Dakika',
        'Analysis': 'Analiz', 'Global Overview': 'Genel Bakış', 'Diplomacy': 'Diplomasi', 'Military': 'Askeri', 'Economy': 'Ekonomi',
        'Energy': 'Enerji', 'Humanitarian': 'İnsani Durum', 'Security': 'Güvenlik', 'Cyber & Tech': 'Siber ve Teknoloji',
        'Middle East': 'Orta Doğu', 'Europe': 'Avrupa', 'Asia-Pacific': 'Asya-Pasifik', 'Africa': 'Afrika', 'Americas': 'Amerika Kıtası',
        'Any time': 'Tüm zamanlar', 'Timeframe': 'Zaman aralığı', 'Live feed': 'Canlı akış', 'Situation rooms': 'Durum odaları',
        'Vetted sources': 'Doğrulanmış kaynaklar', 'Active theaters': 'Aktif cepheler', 'Read at source': 'Kaynakta oku',
        'Open desk': 'Açık Kürsü', 'New': 'Yeni', 'Latest': 'Güncel', 'VERO Overview': 'VERO Özeti', 'Reports (24h)': 'Haber (24 sa)',
        'Sources': 'Kaynaklar', 'Intelligence': 'İstihbarat', 'Languages': 'Diller'
    },
    ar: {
        'Feed': 'آخر الأخبار', 'Articles': 'مقالات', 'Methodology': 'المنهجية', 'Strategic Theaters': 'ساحات الصراع الاستراتيجية',
        'Feedback': 'ملاحظاتك', 'Load Intelligence': 'تحميل المعلومات', 'Live Map': 'الخريطة المباشرة', 'Breaking News': 'عاجل',
        'Analysis': 'تحليل', 'Global Overview': 'نظرة عامة', 'Diplomacy': 'الدبلوماسية', 'Military': 'العسكرية', 'Economy': 'الاقتصاد',
        'Energy': 'الطاقة', 'Humanitarian': 'الشأن الإنساني', 'Security': 'الأمن', 'Cyber & Tech': 'السيبراني والتقنية',
        'Middle East': 'الشرق الأوسط', 'Europe': 'أوروبا', 'Asia-Pacific': 'آسيا والمحيط الهادئ', 'Africa': 'أفريقيا', 'Americas': 'الأمريكتان',
        'Any time': 'في أي وقت', 'Timeframe': 'الفترة الزمنية', 'Live feed': 'بث مباشر', 'Situation rooms': 'غرف المتابعة',
        'Vetted sources': 'مصادر موثّقة', 'Active theaters': 'جبهات نشطة', 'Read at source': 'اقرأ في المصدر',
        'Open desk': 'منبر مفتوح', 'New': 'جديد', 'Latest': 'الأحدث', 'VERO Overview': 'ملخص VERO', 'Reports (24h)': 'تقارير (24 ساعة)',
        'Sources': 'المصادر', 'Intelligence': 'استخبارات', 'Languages': 'اللغات'
    },
    ru: {
        'Feed': 'Лента', 'Articles': 'Статьи', 'Methodology': 'Методология', 'Strategic Theaters': 'Театры военных действий',
        'Feedback': 'Обратная связь', 'Load Intelligence': 'Загрузить сводки', 'Live Map': 'Живая карта', 'Breaking News': 'Срочно',
        'Analysis': 'Анализ', 'Global Overview': 'Общий обзор', 'Diplomacy': 'Дипломатия', 'Military': 'Военные', 'Economy': 'Экономика',
        'Energy': 'Энергетика', 'Humanitarian': 'Гуманитарная ситуация', 'Security': 'Безопасность', 'Cyber & Tech': 'Кибербезопасность и технологии',
        'Middle East': 'Ближний Восток', 'Europe': 'Европа', 'Asia-Pacific': 'Азиатско-Тихоокеанский регион', 'Africa': 'Африка', 'Americas': 'Америка',
        'Any time': 'За всё время', 'Timeframe': 'Период', 'Live feed': 'Прямая лента', 'Situation rooms': 'Ситуационные центры',
        'Vetted sources': 'Проверенные источники', 'Active theaters': 'Активные театры', 'Read at source': 'Читать в источнике',
        'Open desk': 'Открытая трибуна', 'New': 'Новое', 'Latest': 'Последнее', 'VERO Overview': 'Обзор VERO', 'Reports (24h)': 'Сообщений за 24 ч',
        'Sources': 'Источники', 'Intelligence': 'Разведка', 'Languages': 'Языки'
    },
    fr: {
        'Feed': 'Fil d’actualité', 'Articles': 'Articles', 'Methodology': 'Méthodologie', 'Strategic Theaters': 'Théâtres stratégiques',
        'Feedback': 'Votre avis', 'Load Intelligence': 'Charger le renseignement', 'Live Map': 'Carte en direct', 'Breaking News': 'Dernière minute',
        'Analysis': 'Analyse', 'Global Overview': 'Vue d’ensemble', 'Diplomacy': 'Diplomatie', 'Military': 'Militaire', 'Economy': 'Économie',
        'Energy': 'Énergie', 'Humanitarian': 'Humanitaire', 'Security': 'Sécurité', 'Cyber & Tech': 'Cyber et tech',
        'Middle East': 'Moyen-Orient', 'Europe': 'Europe', 'Asia-Pacific': 'Asie-Pacifique', 'Africa': 'Afrique', 'Americas': 'Amériques',
        'Any time': 'Toute période', 'Timeframe': 'Période', 'Live feed': 'Flux en direct', 'Situation rooms': 'Salles de situation',
        'Vetted sources': 'Sources vérifiées', 'Active theaters': 'Théâtres actifs', 'Read at source': 'Lire à la source',
        'Open desk': 'Tribune libre', 'New': 'Nouveau', 'Latest': 'Dernières', 'VERO Overview': 'Synthèse VERO', 'Reports (24h)': 'Reportages (24 h)',
        'Sources': 'Sources', 'Intelligence': 'Renseignement', 'Languages': 'Langues'
    },
    es: {
        'Feed': 'Noticias', 'Articles': 'Artículos', 'Methodology': 'Metodología', 'Strategic Theaters': 'Teatros estratégicos',
        'Feedback': 'Comentarios', 'Load Intelligence': 'Cargar inteligencia', 'Live Map': 'Mapa en vivo', 'Breaking News': 'Última hora',
        'Analysis': 'Análisis', 'Global Overview': 'Panorama global', 'Diplomacy': 'Diplomacia', 'Military': 'Militar', 'Economy': 'Economía',
        'Energy': 'Energía', 'Humanitarian': 'Humanitario', 'Security': 'Seguridad', 'Cyber & Tech': 'Ciberseguridad y tecnología',
        'Middle East': 'Oriente Medio', 'Europe': 'Europa', 'Asia-Pacific': 'Asia-Pacífico', 'Africa': 'África', 'Americas': 'América',
        'Any time': 'Cualquier fecha', 'Timeframe': 'Periodo', 'Live feed': 'En directo', 'Situation rooms': 'Salas de situación',
        'Vetted sources': 'Fuentes verificadas', 'Active theaters': 'Teatros activos', 'Read at source': 'Leer en la fuente',
        'Open desk': 'Tribuna abierta', 'New': 'Nuevo', 'Latest': 'Lo último', 'VERO Overview': 'Resumen de VERO', 'Reports (24h)': 'Informes (24 h)',
        'Sources': 'Fuentes', 'Intelligence': 'Inteligencia', 'Languages': 'Idiomas'
    },
    zh: {
        'Feed': '动态', 'Articles': '文章', 'Methodology': '方法论', 'Strategic Theaters': '战略战区',
        'Feedback': '反馈', 'Load Intelligence': '加载情报', 'Live Map': '实时地图', 'Breaking News': '突发新闻',
        'Analysis': '分析', 'Global Overview': '全球概览', 'Diplomacy': '外交', 'Military': '军事', 'Economy': '经济',
        'Energy': '能源', 'Humanitarian': '人道主义', 'Security': '安全', 'Cyber & Tech': '网络与科技',
        'Middle East': '中东', 'Europe': '欧洲', 'Asia-Pacific': '亚太', 'Africa': '非洲', 'Americas': '美洲',
        'Any time': '不限时间', 'Timeframe': '时间范围', 'Live feed': '实时动态', 'Situation rooms': '态势室',
        'Vetted sources': '已审核来源', 'Active theaters': '活跃战区', 'Read at source': '阅读原文',
        'Open desk': '开放专栏', 'New': '最新', 'Latest': '近期', 'VERO Overview': 'VERO 概览', 'Reports (24h)': '24小时报道',
        'Sources': '来源', 'Intelligence': '情报', 'Languages': '语言'
    }
};

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
    let msToken = { v: '', exp: 0 };

    const note = (name, ok, info) => {
        const s = stats[name] || (stats[name] = { ok: 0, fail: 0, last: '' });
        if (ok) s.ok++;
        else s.fail++;
        s.last = info || '';
    };

    const keyOf = (src, target, text) => crypto.createHash('sha1').update(CACHE_SALT + '|' + src + '|' + target + '|' + text).digest('hex');

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

    async function msAuth(force) {
        if (!force && msToken.v && msToken.exp > Date.now()) return msToken.v;
        const response = await fetch('https://edge.microsoft.com/translate/auth', { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(7000) });
        if (!response.ok) throw new Error('auth HTTP ' + response.status);
        const v = (await response.text()).trim();
        if (!v) throw new Error('empty token');
        msToken = { v, exp: Date.now() + 8 * 60 * 1000 };
        return v;
    }

    async function msCall(slice, target, source, retry) {
        const to = MS_LANGS[target] || target;
        let url = 'https://api-edge.cognitive.microsofttranslator.com/translate?api-version=3.0&textType=html&to=' + encodeURIComponent(to);
        if (source) url += '&from=' + encodeURIComponent(MS_LANGS[source] || source);
        const token = await msAuth(retry);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token, 'User-Agent': UA },
            body: JSON.stringify(slice.map(t => ({ Text: prepare(t) }))),
            signal: AbortSignal.timeout(12000)
        });
        if ((response.status === 401 || response.status === 403) && !retry) return msCall(slice, target, source, true);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        if (!Array.isArray(data) || data.length !== slice.length) throw new Error('bad format');
        return data.map(item => {
            const t = item && item.translations && item.translations[0];
            if (!t || !t.text) return null;
            const det = item.detectedLanguage && item.detectedLanguage.language;
            return { v: clean(t.text), d: det || null };
        });
    }

    async function msBatch(texts, target, source) {
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
            try {
                const res = await msCall(texts.slice(start, end), target, source, false);
                res.forEach((r, k) => { out[start + k] = r; });
                note('microsoft', true, 'ok');
            } catch (e) {
                note('microsoft', false, String(e.message || e));
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
        const gloss = (source === 'en' && GLOSS[lang]) || null;
        const src = source || 'auto';
        const keys = texts.map(t => keyOf(src, target, String(t)));
        const pending = [];
        texts.forEach((t, i) => {
            if (!t || !String(t).trim()) {
                out[i] = { v: t, d: null };
                return;
            }
            if (gloss && gloss[String(t).trim()]) {
                out[i] = { v: gloss[String(t).trim()], d: 'en' };
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
            let missing = results.map((r, k) => (r ? -1 : k)).filter(k => k >= 0);
            if (missing.length && process.env.DISABLE_MS_TRANSLATE !== '1') {
                const sub = await msBatch(missing.map(k => list[k]), target, source);
                missing.forEach((k, n) => { results[k] = sub[n]; });
                missing = results.map((r, k) => (r ? -1 : k)).filter(k => k >= 0);
            }
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
        try {
            const r = await msCall(['Feed'], 'tr', 'en', false);
            report.providers.microsoft = { ok: true, sample: r[0] && r[0].v };
        } catch (e) {
            report.providers.microsoft = { ok: false, error: String(e.message || e) };
        }
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
