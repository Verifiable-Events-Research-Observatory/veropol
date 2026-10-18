const UA = 'Mozilla/5.0 (compatible; VEROBot/1.0; +https://veropol.onrender.com)';
const BBC = 'https://feeds.bbci.co.uk/news/';
const GU = 'https://www.theguardian.com/';

const FEEDS = [
    { u: 'https://www.aljazeera.com/xml/rss/all.xml', s: 'Al Jazeera', l: 'en' },
    { u: 'https://www.aljazeera.net/aljazeerarss/a7c186be-1baa-4bd4-9d80-a84db769f779/73d0e1b4-532f-45ef-b135-bfdff8b8cab9', s: 'Al Jazeera', l: 'ar' },
    { u: 'https://english.alarabiya.net/tools/rss', s: 'Al Arabiya', l: 'en' },
    { u: 'https://www.al-monitor.com/rss', s: 'Al-Monitor', l: 'en' },
    { u: 'https://www.aa.com.tr/en/rss/default?cat=world', s: 'Anadolu Agency', l: 'en' },
    { u: 'https://www.aa.com.tr/ar/rss/default?cat=world', s: 'Anadolu Agency', l: 'ar' },
    { u: 'https://www.aa.com.tr/tr/rss/default?cat=dunya', s: 'Anadolu Agency', l: 'tr' },
    { u: BBC + 'world/rss.xml', s: 'BBC News', l: 'en' },
    { u: BBC + 'world/middle_east/rss.xml', s: 'BBC News', l: 'en' },
    { u: BBC + 'world/asia/rss.xml', s: 'BBC News', l: 'en' },
    { u: BBC + 'world/africa/rss.xml', s: 'BBC News', l: 'en' },
    { u: BBC + 'world/europe/rss.xml', s: 'BBC News', l: 'en' },
    { u: BBC + 'world/us_and_canada/rss.xml', s: 'BBC News', l: 'en' },
    { u: BBC + 'world/latin_america/rss.xml', s: 'BBC News', l: 'en' },
    { u: BBC + 'business/rss.xml', s: 'BBC News', l: 'en' },
    { u: 'https://feeds.bbci.co.uk/arabic/rss.xml', s: 'BBC News', l: 'ar' },
    { u: 'https://feeds.bbci.co.uk/turkce/rss.xml', s: 'BBC News', l: 'tr' },
    { u: 'https://feeds.bbci.co.uk/russian/rss.xml', s: 'BBC News', l: 'ru' },
    { u: 'https://feeds.bbci.co.uk/zhongwen/simp/rss.xml', s: 'BBC News', l: 'zh' },
    { u: 'https://feeds.bbci.co.uk/mundo/rss.xml', s: 'BBC News', l: 'es' },
    { u: GU + 'world/rss', s: 'The Guardian', l: 'en' },
    { u: GU + 'world/middleeast/rss', s: 'The Guardian', l: 'en' },
    { u: GU + 'world/europe-news/rss', s: 'The Guardian', l: 'en' },
    { u: GU + 'world/africa/rss', s: 'The Guardian', l: 'en' },
    { u: GU + 'world/asia-pacific/rss', s: 'The Guardian', l: 'en' },
    { u: GU + 'world/americas/rss', s: 'The Guardian', l: 'en' },
    { u: GU + 'business/rss', s: 'The Guardian', l: 'en' },
    { u: 'https://www.france24.com/en/rss', s: 'France 24', l: 'en' },
    { u: 'https://www.france24.com/fr/rss', s: 'France 24', l: 'fr' },
    { u: 'https://www.france24.com/es/rss', s: 'France 24', l: 'es' },
    { u: 'https://www.france24.com/ar/rss', s: 'France 24', l: 'ar' },
    { u: 'https://www.lemonde.fr/international/rss_full.xml', s: 'Le Monde', l: 'fr' },
    { u: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada', s: 'El País', l: 'es' },
    { u: 'https://rss.dw.com/rdf/rss-en-world', s: 'Deutsche Welle', l: 'en' },
    { u: 'https://rss.dw.com/rdf/rss-ar-all', s: 'Deutsche Welle', l: 'ar' },
    { u: 'https://rss.dw.com/rdf/rss-es-all', s: 'Deutsche Welle', l: 'es' },
    { u: 'https://rss.dw.com/rdf/rss-ru-all', s: 'Deutsche Welle', l: 'ru' },
    { u: 'https://rss.dw.com/rdf/rss-tr-all', s: 'Deutsche Welle', l: 'tr' },
    { u: 'https://www.euronews.com/rss?format=mrss', s: 'Euronews', l: 'en' },
    { u: 'https://fr.euronews.com/rss?format=mrss', s: 'Euronews', l: 'fr' },
    { u: 'https://arabic.euronews.com/rss?format=mrss', s: 'Euronews', l: 'ar' },
    { u: 'https://www.swissinfo.ch/eng/rss/top-news', s: 'SWI swissinfo.ch', l: 'en' },
    { u: 'https://news.un.org/feed/subscribe/en/news/all/rss.xml', s: 'UN News', l: 'en' },
    { u: 'https://news.un.org/feed/subscribe/ar/news/all/rss.xml', s: 'UN News', l: 'ar' },
    { u: 'https://news.un.org/feed/subscribe/fr/news/all/rss.xml', s: 'UN News', l: 'fr' },
    { u: 'https://news.un.org/feed/subscribe/es/news/all/rss.xml', s: 'UN News', l: 'es' },
    { u: 'https://news.un.org/feed/subscribe/ru/news/all/rss.xml', s: 'UN News', l: 'ru' },
    { u: 'https://news.un.org/feed/subscribe/zh/news/all/rss.xml', s: 'UN News', l: 'zh' },
    { u: 'https://feeds.npr.org/1004/rss.xml', s: 'NPR', l: 'en' },
    { u: 'https://www.pbs.org/newshour/feeds/rss/world', s: 'PBS NewsHour', l: 'en' },
    { u: 'https://rss.csmonitor.com/feeds/world', s: 'The Christian Science Monitor', l: 'en' }
];

const COUNTRIES = ['afghanistan', 'algeria', 'america', 'argentina', 'armenia', 'australia', 'austria', 'azerbaijan', 'bahrain', 'bangladesh', 'belarus', 'belgium', 'bolivia', 'brazil', 'britain', 'bulgaria', 'canada', 'chad', 'chile', 'china', 'colombia', 'congo', 'cuba', 'cyprus', 'denmark', 'ecuador', 'egypt', 'england', 'estonia', 'ethiopia', 'finland', 'france', 'georgia', 'germany', 'ghana', 'greece', 'hungary', 'iceland', 'india', 'indonesia', 'iran', 'iraq', 'ireland', 'israel', 'italy', 'japan', 'jordan', 'kazakhstan', 'kenya', 'korea', 'kosovo', 'kuwait', 'latvia', 'lebanon', 'libya', 'lithuania', 'malaysia', 'mali', 'mexico', 'moldova', 'morocco', 'myanmar', 'nepal', 'netherlands', 'niger', 'nigeria', 'norway', 'oman', 'pakistan', 'palestine', 'peru', 'philippines', 'poland', 'portugal', 'qatar', 'romania', 'russia', 'rwanda', 'saudi', 'serbia', 'singapore', 'slovakia', 'somalia', 'spain', 'sudan', 'sweden', 'switzerland', 'syria', 'taiwan', 'thailand', 'tunisia', 'turkey', 'turkiye', 'uganda', 'ukraine', 'emirates', 'venezuela', 'vietnam', 'yemen', 'zimbabwe', 'gaza', 'europe', 'africa', 'asia', 'nato', 'brics', 'opec'];

const ALIASES = [
    ['usa', 'us', 'america', 'american', 'americans', 'washington', 'united states'],
    ['uk', 'britain', 'british', 'london', 'united kingdom'],
    ['uae', 'emirates', 'emirati', 'dubai', 'abu dhabi'],
    ['russia', 'russian', 'moscow', 'kremlin'],
    ['china', 'chinese', 'beijing'],
    ['turkey', 'turkiye', 'turkish', 'ankara'],
    ['israel', 'israeli', 'tel aviv'],
    ['palestine', 'palestinian', 'palestinians'],
    ['iran', 'iranian', 'tehran'],
    ['ukraine', 'ukrainian', 'kyiv', 'kiev'],
    ['syria', 'syrian', 'damascus'],
    ['saudi', 'saudi arabia', 'riyadh'],
    ['eu', 'european union', 'brussels']
];

const STOP = new Set(['the', 'and', 'for', 'with', 'from', 'about', 'into', 'over', 'that', 'this', 'news', 'latest', 'of', 'in', 'on', 'to', 'an', 'is', 'are', 'was', 'what', 'who', 'how']);

const GEO = /geopolit|diplomat|sanction|military|defen[cs]e|troops|missile|navy|army|\bwar\b|conflict|ceasefire|treaty|summit|nato|security council|foreign (policy|minister)|embassy|alliance|nuclear|tariff|border|insurg|coup|junta|ukrain|russia|china|taiwan|iran|israel|gaza|syria|korea|sahel|brics|opec|airstrike|drone|президент|война|حرب|رئيس|وزير|guerre|guerra|savaş|战争/i;

const CATS = {
    military: /war|military|defen[cs]e|troops|missile|navy|army|weapon|drone|airstrike|nato|armed|soldier|attack|strike|bomb|حرب|عسكري|جيش|صاروخ|قصف|هجوم|دفاع|guerre|militaire|armée|frappe|defensa|guerra|militar|ejército|ataque|война|военн|армия|ракет|удар|оборон|savaş|askeri|ordu|füze|saldırı|战争|军事|军队|导弹|袭击|国防/i,
    economy: /econom|trade|tariff|inflation|oil|market|currency|gdp|bank|sanction|price|invest|اقتصاد|تجارة|نفط|عقوبات|تضخم|سوق|économie|commerce|pétrole|marché|economía|comercio|petróleo|sanciones|mercado|эконом|торгов|нефть|санкци|рынок|ekonomi|ticaret|petrol|yaptırım|piyasa|经济|贸易|石油|制裁|市场|关税/i,
    diplomacy: /diplomat|summit|talks|treaty|envoy|minister|ceasefire|negotiat|embassy|ambassador|accord|دبلوماس|قمة|محادثات|معاهدة|مبعوث|وزير|وقف إطلاق|سفير|sommet|négociation|ambassad|cessez|cumbre|negociaci|embajad|alto el fuego|саммит|перегов|посол|перемири|zirve|müzakere|büyükelçi|ateşkes|外交|峰会|谈判|条约|大使|停火/i
};

const RANGE_HOURS = { '24h': 24, '7d': 168, '30d': 720 };
const FEED_TTL = 10 * 60 * 1000;

function decodeEntities(s) {
    return s
        .replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n))
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

function stripHtml(s) {
    let t = String(s || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
    t = decodeEntities(t);
    t = t.replace(/<[^>]+>/g, ' ');
    t = decodeEntities(t);
    return t.replace(/\s+/g, ' ').trim();
}

function tag(block, name) {
    const m = block.match(new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + name + '>', 'i'));
    return m ? m[1] : '';
}

function attr(block, name, a) {
    const m = block.match(new RegExp('<' + name + '\\s[^>]*?' + a + '="([^"]+)"', 'i'));
    return m ? decodeEntities(m[1]) : '';
}

function norm(s) {
    return String(s).toLowerCase().normalize('NFKD')
        .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
        .replace(/\p{M}/gu, '')
        .replace(/[أإآٱ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/ı/g, 'i')
        .replace(/ß/g, 'ss')
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .trim();
}

const isCJK = s => /[\u3400-\u9FFF]/.test(s);
const stemAr = t => (t.length > 4 ? t.replace(/^ال/, '') : t);
const tokensOf = s => norm(s).split(' ').filter(Boolean).map(stemAr);

function dist(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    const al = a.length;
    const bl = b.length;
    const d = [];
    for (let i = 0; i <= al; i++) d[i] = [i];
    for (let j = 1; j <= bl; j++) d[0][j] = j;
    for (let i = 1; i <= al; i++) {
        for (let j = 1; j <= bl; j++) {
            const c = a[i - 1] === b[j - 1] ? 0 : 1;
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        }
    }
    return d[al][bl];
}

function parseFeed(xml, feed) {
    const blocks = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || [];
    const items = [];
    for (const b of blocks.slice(0, 60)) {
        const title = stripHtml(tag(b, 'title'));
        if (!title) continue;
        let url = stripHtml(tag(b, 'link'));
        if (!url) url = attr(b, 'link', 'href');
        if (!/^https?:\/\//.test(url)) url = stripHtml(tag(b, 'guid'));
        if (!/^https?:\/\//.test(url)) continue;
        const rawDesc = tag(b, 'description') || tag(b, 'summary') || tag(b, 'content:encoded') || tag(b, 'content');
        const desc = stripHtml(rawDesc).slice(0, 320);
        let image = attr(b, 'media:content', 'url') || attr(b, 'media:thumbnail', 'url');
        if (!image) {
            const enc = b.match(/<enclosure\s[^>]*>/i);
            if (enc && /image/i.test(enc[0])) {
                const m = enc[0].match(/url="([^"]+)"/i);
                if (m) image = decodeEntities(m[1]);
            }
        }
        if (!image) {
            const html = decodeEntities(String(rawDesc).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') + tag(b, 'content:encoded'));
            const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (m) image = m[1];
        }
        const dateRaw = stripHtml(tag(b, 'pubDate') || tag(b, 'dc:date') || tag(b, 'published') || tag(b, 'updated'));
        let when = new Date(dateRaw);
        if (isNaN(when.getTime())) when = new Date();
        const tl = tokensOf(title);
        const dl = tokensOf(desc);
        items.push({
            title,
            description: desc,
            url,
            image: /^https?:\/\//.test(image) ? image : null,
            publishedAt: when.toISOString(),
            ts: when.getTime(),
            source: feed.s,
            lang: feed.l,
            _tl: tl,
            _dl: dl,
            _t: new Set(tl),
            _d: new Set(dl),
            _tn: norm(title),
            _dn: norm(desc)
        });
    }
    return items;
}

function dedupe(list) {
    const seen = new Set();
    const out = [];
    for (const it of list) {
        const key = norm(it.title).slice(0, 48) + '|' + it.lang;
        if (seen.has(key) || seen.has(it.url)) continue;
        seen.add(key);
        seen.add(it.url);
        out.push(it);
    }
    return out;
}

module.exports = function createSearch({ translator, matchSource }) {
    const store = new Map();
    let corpus = [];
    let vocab = new Map();
    let refreshing = null;
    let lastRefresh = 0;
    const gnewsCache = new Map();

    async function pull(feed) {
        try {
            const response = await fetch(feed.u, {
                headers: { 'User-Agent': UA, 'Accept': 'application/rss+xml, application/xml, text/xml, */*' },
                signal: AbortSignal.timeout(9000),
                redirect: 'follow'
            });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const xml = await response.text();
            const items = parseFeed(xml, feed);
            if (!items.length) throw new Error('no items');
            store.set(feed.u, { items, at: Date.now(), ok: true, error: '' });
        } catch (e) {
            const prev = store.get(feed.u);
            store.set(feed.u, { items: prev ? prev.items : [], at: Date.now(), ok: false, error: String(e.message || e) });
        }
    }

    async function refresh() {
        let i = 0;
        await Promise.all(Array.from({ length: 8 }, async () => {
            while (i < FEEDS.length) await pull(FEEDS[i++]);
        }));
        const all = [];
        store.forEach(v => all.push(...v.items));
        corpus = dedupe(all);
        const v = new Map();
        for (const it of corpus) {
            for (const t of it._tl) if (t.length >= 4 && !isCJK(t)) v.set(t, (v.get(t) || 0) + 2);
            for (const t of it._dl) if (t.length >= 4 && !isCJK(t)) v.set(t, (v.get(t) || 0) + 1);
        }
        COUNTRIES.forEach(c => v.set(c, (v.get(c) || 0) + 5));
        vocab = v;
        lastRefresh = Date.now();
    }

    async function ensure() {
        if (corpus.length && Date.now() - lastRefresh < FEED_TTL) return;
        if (!refreshing) refreshing = refresh().finally(() => { refreshing = null; });
        if (!corpus.length) await refreshing;
    }

    function correct(token) {
        if (token.length < 4 || isCJK(token) || /[^\x00-\x7f]/.test(token) || vocab.has(token)) return null;
        const max = token.length >= 5 ? 2 : 1;
        let best = null;
        let bestD = max + 1;
        let bestW = -1;
        for (const [cand, w] of vocab) {
            if (cand[0] !== token[0] || Math.abs(cand.length - token.length) > max) continue;
            const d = dist(token, cand, max);
            if (d <= max && (d < bestD || (d === bestD && w > bestW))) {
                best = cand;
                bestD = d;
                bestW = w;
            }
        }
        return best;
    }

    async function expand(q, client) {
        const d = await translator.detectToEnglish(q);
        let english = q;
        let detected = null;
        let ok = false;
        if (d) {
            english = d.text || q;
            detected = d.detected;
            ok = true;
        } else if (client && client.english) {
            english = String(client.english).slice(0, 120);
            detected = translator.normalizeLang(client.detected);
            ok = true;
        }
        const variants = new Map();
        variants.set(q, 1);
        variants.set(english, 1);
        if (client && Array.isArray(client.vars)) client.vars.slice(0, 12).forEach(v => variants.set(String(v).slice(0, 80), 0.9));
        if (ok && !(client && client.vars && client.vars.length)) {
            const langs = ['ar', 'fr', 'es', 'ru', 'zh', 'tr'];
            const res = await Promise.all(langs.map(l => translator.translateTexts([english], l, 'en').catch(() => [null])));
            res.forEach(r => { if (r && r[0]) variants.set(r[0], 0.9); });
        }
        return { english, detected, ok, variants };
    }

    function buildTerms(q, ex) {
        const terms = new Map();
        const put = (t, w) => {
            if (!t || t.length < 2 || STOP.has(t)) return;
            if (!terms.has(t) || terms.get(t) < w) terms.set(t, w);
        };
        ex.variants.forEach((w, text) => tokensOf(text).forEach(t => put(t, w)));
        const joined = norm(ex.english);
        ALIASES.forEach(group => {
            const hit = group.some(g => joined === g || tokensOf(ex.english).includes(g));
            if (hit) group.forEach(g => g.split(' ').forEach(p => put(p, 0.8)));
        });
        tokensOf(q).concat(tokensOf(ex.english)).forEach(t => {
            const fix = correct(t);
            if (fix) put(fix, 0.9);
        });
        return terms;
    }

    function matchTerm(term, it) {
        if (isCJK(term)) {
            if (it._tn.includes(term)) return 4;
            if (it._dn.includes(term)) return 2;
            return 0;
        }
        if (it._t.has(term)) return 4;
        if (it._d.has(term)) return 2;
        if (term.length >= 4) {
            for (const t of it._tl) if (t.length >= 4 && (t.startsWith(term) || term.startsWith(t))) return 3;
            for (const t of it._dl) if (t.length >= 4 && (t.startsWith(term) || term.startsWith(t))) return 1.5;
        }
        return 0;
    }

    async function gnews(english, from, key) {
        const tokens = tokensOf(english).filter(t => t.length >= 3 && !STOP.has(t) && !/[^\x00-\x7f]/.test(t)).slice(0, 6);
        if (!tokens.length || !key) return [];
        const query = tokens.join(' OR ');
        const ck = query + '|' + (from || '');
        const hit = gnewsCache.get(ck);
        if (hit && hit.exp > Date.now()) return hit.items;
        const out = [];
        for (let p = 1; p <= 2; p++) {
            try {
                let url = 'https://gnews.io/api/v4/search?q=' + encodeURIComponent(query) + '&lang=en&max=10&in=title,description&apikey=' + key;
                if (p > 1) url += '&page=' + p;
                if (from) url += '&from=' + encodeURIComponent(from);
                const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
                if (!response.ok) break;
                const data = await response.json();
                const list = data && Array.isArray(data.articles) ? data.articles : [];
                list.forEach(a => {
                    const src = matchSource(a.source && a.source.url ? a.source.url : a.url);
                    if (!src || !a.title) return;
                    const t = stripHtml(a.title);
                    const dsc = stripHtml(a.description || '');
                    const ts = new Date(a.publishedAt || Date.now()).getTime();
                    out.push({
                        title: t,
                        description: dsc,
                        url: a.url,
                        image: a.image && /^https?:\/\//.test(a.image) ? a.image : null,
                        publishedAt: new Date(ts).toISOString(),
                        ts,
                        source: src.name,
                        lang: 'en',
                        _tl: tokensOf(t),
                        _dl: tokensOf(dsc),
                        _t: new Set(tokensOf(t)),
                        _d: new Set(tokensOf(dsc)),
                        _tn: norm(t),
                        _dn: norm(dsc),
                        gnews: true
                    });
                });
                if (list.length < 10) break;
            } catch (e) {
                break;
            }
        }
        if (gnewsCache.size > 120) gnewsCache.delete(gnewsCache.keys().next().value);
        gnewsCache.set(ck, { items: out, exp: Date.now() + 30 * 60 * 1000 });
        return out;
    }

    function decideLang(q, english, detected, ui) {
        const script = /[\u0600-\u06FF]/.test(q) ? 'ar' : /[\u0400-\u04FF]/.test(q) ? 'ru' : /[\u3400-\u9FFF]/.test(q) ? 'zh' : null;
        const lang = detected || script;
        if (!lang) return ui;
        if (lang === 'en') {
            const words = q.trim().split(/\s+/).length;
            return words >= 2 && !script ? 'en' : ui;
        }
        if (!script && english.trim().toLowerCase() === q.trim().toLowerCase()) return ui;
        return lang;
    }

    async function search(opts) {
        await ensure();
        const q = (opts.q || '').trim();
        const size = opts.size;
        const cutoffHours = RANGE_HOURS[opts.range];
        const cutoff = cutoffHours ? Date.now() - cutoffHours * 3600000 : 0;
        const catRe = CATS[opts.category] || null;
        const now = Date.now();
        let uiLang = opts.uiLang;
        let english = q;
        let needsExpansion = false;
        let results = [];

        const recency = it => {
            const h = (now - it.ts) / 3600000;
            return h < 24 ? 1.5 : h < 72 ? 1 : h < 168 ? 0.5 : 0;
        };

        if (!q) {
            results = corpus
                .filter(it => it.ts >= cutoff && (!catRe || catRe.test(it.title + ' ' + it.description)))
                .map(it => ({ it, score: (GEO.test(it.title) ? 2 : 0) + (GEO.test(it.description) ? 1 : 0) + recency(it) + (it.lang === uiLang ? 1.5 : 0) + (it.image ? 0.3 : 0) }));
        } else {
            const ex = await expand(q, opts.client);
            english = ex.english;
            needsExpansion = !ex.ok && !(opts.client && opts.client.english);
            if (opts.detect) uiLang = decideLang(q, english, ex.detected, uiLang);
            const terms = buildTerms(q, ex);
            const key = process.env.GNEWS_API_KEY;
            const from = cutoffHours ? new Date(Math.floor((now - cutoffHours * 3600000) / 3600000) * 3600000).toISOString() : null;
            const extra = await gnews(english, from, key);
            const pool = dedupe(corpus.concat(extra));
            pool.forEach(it => {
                if (it.ts < cutoff) return;
                if (catRe && !catRe.test(it.title + ' ' + it.description)) return;
                let score = 0;
                terms.forEach((w, term) => { score += w * matchTerm(term, it); });
                if (it.gnews) score = Math.max(score, 2);
                if (score <= 0) return;
                score += recency(it) + (it.lang === uiLang ? 1.5 : 0) + (it.image ? 0.3 : 0);
                results.push({ it, score });
            });
        }

        results.sort((a, b) => b.score - a.score || b.it.ts - a.it.ts);
        const total = results.length;
        const totalPages = Math.max(1, Math.ceil(total / size));
        const page = Math.min(Math.max(opts.page, 1), totalPages);
        const articles = results.slice((page - 1) * size, page * size).map(r => ({
            title: r.it.title,
            description: r.it.description,
            url: r.it.url,
            image: r.it.image,
            publishedAt: r.it.publishedAt,
            source: r.it.source,
            lang: r.it.lang
        }));
        return { articles, page, totalPages, total, lang: uiLang, queryEnglish: english, needsExpansion };
    }

    function feedHealth() {
        const feeds = FEEDS.map(f => {
            const s = store.get(f.u);
            return { source: f.s, lang: f.l, url: f.u, ok: s ? s.ok : null, items: s ? s.items.length : 0, error: s ? s.error : 'not fetched yet' };
        });
        return { corpus: corpus.length, vocabulary: vocab.size, working: feeds.filter(f => f.ok).length, total: feeds.length, feeds };
    }

    return { search, feedHealth, warm: () => ensure().catch(() => { }) };
};
