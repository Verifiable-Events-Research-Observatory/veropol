const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;
const SITE = 'https://veropol.onrender.com';
const ROOT = path.join(__dirname, '../');

app.use(express.json({ limit: '200kb' }));

app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

app.use('/api', (req, res, next) => {
    res.set('X-Robots-Tag', 'noindex');
    res.set('Cache-Control', 'no-store');
    next();
});

app.get('/javascript/server.js', (req, res) => res.status(404).type('text/plain').send('Not Found'));
app.use('/assets', express.static(path.join(ROOT, 'assets'), { maxAge: '7d' }));
app.use('/css', express.static(path.join(ROOT, 'css'), { maxAge: '1d' }));
app.use('/javascript', express.static(path.join(ROOT, 'javascript'), { maxAge: '1d' }));

['robots.txt', 'favicon.ico'].forEach(file => {
    app.get('/' + file, (req, res) => {
        res.set('Cache-Control', 'public, max-age=86400');
        res.sendFile(path.join(ROOT, file));
    });
});


app.get('/.well-known/discord', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.type('text/plain').send('dh=b646c3f52446820d5104e44cae97c6f624323997');
});

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI).catch(() => { });
}
const dbReady = () => mongoose.connection.readyState === 1;

const FeedbackSchema = new mongoose.Schema({
    topic: String,
    otherTopic: String,
    name: String,
    email: String,
    message: String,
    page: String,
    date: { type: Date, default: Date.now }
});
const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);

const ArticleSchema = new mongoose.Schema({
    slug: { type: String, unique: true, index: true },
    title: String,
    summary: String,
    body: String,
    category: String,
    language: String,
    readMinutes: Number,
    author: {
        firstName: String,
        lastName: String,
        age: Number,
        nationality: String,
        residence: String,
        email: String,
        idDocs: [String]
    },
    status: { type: String, default: 'pending', index: true },
    createdAt: { type: Date, default: Date.now },
    publishedAt: Date
});
const Article = mongoose.models.Article || mongoose.model('Article', ArticleSchema);

function limiter(max, windowMs) {
    const hits = new Map();
    setInterval(() => {
        const now = Date.now();
        for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    }, windowMs).unref();
    return (req, res, next) => {
        const now = Date.now();
        let h = hits.get(req.ip);
        if (!h || h.reset < now) {
            h = { count: 0, reset: now + windowMs };
            hits.set(req.ip, h);
        }
        h.count++;
        if (h.count > max) return res.status(429).json({ error: 'Too many requests' });
        next();
    };
}

const SUPPORTED_LANGS = { en: 'en', fr: 'fr', es: 'es', ru: 'ru', ar: 'ar', zh: 'zh-CN', tr: 'tr' };

const TRUSTED_SOURCES = [
    { name: 'Al Jazeera', domains: ['aljazeera.com', 'aljazeera.net'], region: 'Qatar' },
    { name: 'Al Arabiya', domains: ['alarabiya.net'], region: 'Saudi Arabia / UAE' },
    { name: 'Al-Monitor', domains: ['al-monitor.com'], region: 'United States' },
    { name: 'Anadolu Agency', domains: ['aa.com.tr'], region: 'Türkiye' },
    { name: 'Reuters', domains: ['reuters.com'], region: 'United Kingdom' },
    { name: 'Associated Press', domains: ['apnews.com'], region: 'United States' },
    { name: 'BBC News', domains: ['bbc.com', 'bbc.co.uk'], region: 'United Kingdom' },
    { name: 'The Guardian', domains: ['theguardian.com'], region: 'United Kingdom' },
    { name: 'France 24', domains: ['france24.com'], region: 'France' },
    { name: 'Le Monde', domains: ['lemonde.fr'], region: 'France' },
    { name: 'Deutsche Welle', domains: ['dw.com'], region: 'Germany' },
    { name: 'Euronews', domains: ['euronews.com'], region: 'European Union' },
    { name: 'El País', domains: ['elpais.com'], region: 'Spain' },
    { name: 'SWI swissinfo.ch', domains: ['swissinfo.ch'], region: 'Switzerland' },
    { name: 'UN News', domains: ['news.un.org', 'un.org'], region: 'United Nations' },
    { name: 'NPR', domains: ['npr.org'], region: 'United States' },
    { name: 'PBS NewsHour', domains: ['pbs.org'], region: 'United States' },
    { name: 'The Christian Science Monitor', domains: ['csmonitor.com'], region: 'United States' }
];

function matchSource(url) {
    let host = '';
    try { host = new URL(url).hostname.replace(/^www\./, '').toLowerCase(); } catch (e) { return null; }
    for (const s of TRUSTED_SOURCES) {
        if (s.domains.some(d => host === d || host.endsWith('.' + d))) return s;
    }
    return null;
}

const MAX_TRANSLATION_CACHE = 6000;
const translationCache = new Map();
function cacheTranslation(key, value) {
    if (translationCache.size >= MAX_TRANSLATION_CACHE) translationCache.delete(translationCache.keys().next().value);
    translationCache.set(key, value);
}

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

function scriptLang(q) {
    if (/[\u0600-\u06FF]/.test(q)) return 'ar';
    if (/[\u0400-\u04FF]/.test(q)) return 'ru';
    if (/[\u4E00-\u9FFF]/.test(q)) return 'zh';
    return null;
}

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
            const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${key}`, {
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
                        out[start + k] = { text: clean(item.translatedText), detected: item.detectedSourceLanguage || null };
                    });
                }
            }
        } catch (e) { }
        start = end;
    }
    return out;
}

async function freeOne(text, target, source) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(source || 'auto')}&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(text)}`;
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(7000) });
        if (!response.ok) return null;
        const data = await response.json();
        if (!Array.isArray(data) || !Array.isArray(data[0])) return null;
        return {
            text: data[0].map(part => (part && part[0]) ? part[0] : '').join(''),
            detected: typeof data[2] === 'string' ? data[2] : null
        };
    } catch (e) {
        return null;
    }
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

async function translateTexts(texts, lang, source = 'en') {
    const target = SUPPORTED_LANGS[lang];
    if (!target) return texts;
    const src = source || 'auto';
    const out = new Array(texts.length);
    const pending = [];
    texts.forEach((text, i) => {
        if (!text || !String(text).trim()) {
            out[i] = text;
            return;
        }
        const hit = translationCache.get(`${src}|${target}|${text}`);
        if (hit !== undefined) out[i] = hit;
        else pending.push(i);
    });
    if (pending.length) {
        const list = pending.map(i => String(texts[i]));
        let results = new Array(list.length).fill(null);
        const key = process.env.GOOGLE_TRANSLATE_API_KEY;
        if (key) results = await officialBatch(list, target, source, key);
        const missing = results.map((r, k) => (r ? -1 : k)).filter(k => k >= 0);
        if (missing.length) {
            const free = await pool(missing, 6, k => freeOne(list[k], target, source));
            missing.forEach((k, n) => { results[k] = free[n]; });
        }
        pending.forEach((index, k) => {
            const value = results[k] && results[k].text;
            if (value) {
                cacheTranslation(`${src}|${target}|${texts[index]}`, value);
                out[index] = value;
            } else {
                out[index] = texts[index];
            }
        });
    }
    return out;
}

const queryCache = new Map();
async function queryToEnglish(q) {
    const k = q.toLowerCase();
    if (queryCache.has(k)) return queryCache.get(k);
    let r = null;
    const key = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (key) {
        const o = await officialBatch([q], 'en', null, key);
        r = o[0];
    }
    if (!r) r = await freeOne(q, 'en', null);
    const res = { text: r && r.text ? r.text : q, detected: r ? normalizeLang(r.detected) : null };
    if (queryCache.size > 1500) queryCache.delete(queryCache.keys().next().value);
    queryCache.set(k, res);
    return res;
}

function decideLang(q, english, detected, ui) {
    const script = scriptLang(q);
    const lang = detected || script;
    if (!lang) return ui;
    if (lang === 'en') {
        const words = q.trim().split(/\s+/).length;
        return words >= 2 && !script ? 'en' : ui;
    }
    if (!script && english.trim().toLowerCase() === q.trim().toLowerCase()) return ui;
    return lang;
}

const STOP_WORDS = new Set(['the', 'and', 'for', 'with', 'from', 'about', 'into', 'over', 'that', 'this', 'news', 'latest']);

const CATEGORY_TERMS = {
    military: ['military', 'defense', 'troops', 'missile', 'navy', 'army', 'weapons', 'drone', 'airstrike', 'nato'],
    economy: ['economy', 'sanctions', 'trade', 'tariffs', 'inflation', 'oil', 'markets', 'currency', 'gdp'],
    diplomacy: ['diplomacy', 'summit', 'talks', 'treaty', 'envoy', 'ministers', 'ceasefire', 'negotiations', 'embassy']
};

const GEO_PATTERN = /geopolit|diplomat|sanction|military|defen[cs]e|troops|missile|navy|army|\bwar\b|conflict|ceasefire|treaty|summit|nato|security council|foreign (policy|minister)|embassy|alliance|nuclear|tariff|border|insurg|coup|junta|ukrain|russia|china|taiwan|iran|israel|gaza|syria|korea|sahel|brics|opec|airstrike|drone/i;

const DEFAULT_TOPICS = ['geopolitics', 'global defense', 'international diplomacy', 'sanctions policy', 'global security', 'strategic alliance'];

function tokenize(text) {
    return [...new Set(
        text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(t => t.length >= 3 && !STOP_WORDS.has(t))
    )].slice(0, 8);
}

function scoreArticle(art, terms) {
    const title = (art.title || '').toLowerCase();
    const desc = (art.description || '').toLowerCase();
    let score = 0;
    for (const term of terms) {
        const re = new RegExp('\\b' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        if (re.test(title)) score += 4;
        if (re.test(desc)) score += 2;
    }
    if (GEO_PATTERN.test(title)) score += 2;
    if (GEO_PATTERN.test(desc)) score += 1;
    if (art.image) score += 0.5;
    return score;
}

const MAX_SOURCE_PAGES = 6;
const CACHE_TTL = 10 * 60 * 1000;
const MAX_CACHE_ENTRIES = 80;
const RANGE_HOURS = { '24h': 24, '7d': 168, '30d': 720 };
const newsCache = new Map();

async function fetchGNewsPage(searchQuery, page, from, apiKey) {
    let url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&max=10&in=title,description&apikey=${apiKey}`;
    if (page > 1) url += `&page=${page}`;
    if (from) url += `&from=${encodeURIComponent(from)}`;
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (!response.ok) return null;
        const data = await response.json();
        return data && Array.isArray(data.articles) ? data : null;
    } catch (e) {
        return null;
    }
}

function rankArticles(rawArticles, queryTerms) {
    const seenTitles = new Set();
    const seenImages = new Set();
    const candidates = [];
    for (const art of rawArticles) {
        const source = matchSource(art.source && art.source.url ? art.source.url : art.url);
        if (!source) continue;
        const rawTitle = art.title || 'Untitled Report';
        const normalizedTitle = rawTitle.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 35);
        if (seenTitles.has(normalizedTitle)) continue;
        seenTitles.add(normalizedTitle);
        let image = art.image && /^https?:\/\//.test(art.image) ? art.image : null;
        if (image && seenImages.has(image)) image = null;
        if (image) seenImages.add(image);
        const article = {
            title: rawTitle,
            description: art.description || '',
            url: art.url || '#',
            image,
            publishedAt: art.publishedAt || new Date().toISOString(),
            source: source.name
        };
        const score = scoreArticle(article, queryTerms);
        if (score > 0) candidates.push({ article, score });
    }
    candidates.sort((x, y) => y.score - x.score || new Date(y.article.publishedAt) - new Date(x.article.publishedAt));
    return candidates.map(c => c.article);
}

async function getRankedArticles(searchQuery, queryTerms, range, apiKey) {
    const cacheKey = `${searchQuery}|${range}`;
    const cached = newsCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) return cached.articles;
    const hours = RANGE_HOURS[range];
    const from = hours ? new Date(Math.floor((Date.now() - hours * 3600000) / 3600000) * 3600000).toISOString() : null;
    const first = await fetchGNewsPage(searchQuery, 1, from, apiKey);
    if (!first) return null;
    const collected = [...first.articles];
    const total = first.totalArticles || collected.length;
    for (let p = 2; p <= MAX_SOURCE_PAGES && collected.length < total; p++) {
        const next = await fetchGNewsPage(searchQuery, p, from, apiKey);
        if (!next || next.articles.length === 0) break;
        collected.push(...next.articles);
    }
    const articles = rankArticles(collected, queryTerms);
    if (newsCache.size >= MAX_CACHE_ENTRIES) newsCache.delete(newsCache.keys().next().value);
    newsCache.set(cacheKey, { articles, expires: Date.now() + CACHE_TTL });
    return articles;
}

async function localizeArticles(articles, lang) {
    if (lang === 'en' || !articles.length) return articles;
    const texts = [];
    articles.forEach(art => {
        texts.push(art.title === 'Untitled Report' ? '' : art.title);
        texts.push(art.description);
    });
    const translated = await translateTexts(texts, lang, 'en');
    return articles.map((art, i) => ({
        ...art,
        title: translated[i * 2] || art.title,
        description: translated[i * 2 + 1] || art.description
    }));
}

app.get('/ping', (req, res) => res.status(200).send('OK'));

app.post('/api/translate', limiter(60, 60 * 1000), async (req, res) => {
    const { texts, lang } = req.body || {};
    if (!SUPPORTED_LANGS[lang] || !Array.isArray(texts) || texts.length === 0 || texts.length > 150) {
        return res.status(400).json({ error: 'Invalid request' });
    }
    let total = 0;
    for (const t of texts) {
        if (typeof t !== 'string' || t.length > 1500) return res.status(400).json({ error: 'Invalid text' });
        total += t.length;
    }
    if (total > 40000) return res.status(413).json({ error: 'Payload too large' });
    try {
        const translations = await translateTexts(texts, lang, 'en');
        res.json({ translations });
    } catch (e) {
        res.status(500).json({ error: 'Translation failed' });
    }
});

app.get('/api/sources', (req, res) => {
    res.json({ sources: TRUSTED_SOURCES.map(s => ({ name: s.name, region: s.region, domain: s.domains[0] })) });
});

app.get('/api/news', limiter(40, 60 * 1000), async (req, res) => {
    const rawQuery = req.query.q ? String(req.query.q).trim().slice(0, 120) : '';
    const category = String(req.query.category || 'all').toLowerCase();
    const range = RANGE_HOURS[req.query.range] ? req.query.range : 'all';
    const size = Math.min(Math.max(parseInt(req.query.size, 10) || 9, 1), 30);
    const requestedPage = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const uiLang = SUPPORTED_LANGS[req.query.lang] ? req.query.lang : 'en';
    const detect = req.query.detect === '1';
    const apiKey = process.env.GNEWS_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'API key is missing' });

    try {
        let english = rawQuery || DEFAULT_TOPICS[Math.floor(Math.random() * DEFAULT_TOPICS.length)];
        let lang = uiLang;
        if (rawQuery) {
            const d = await queryToEnglish(rawQuery);
            english = d.text || rawQuery;
            if (detect) lang = decideLang(rawQuery, english, d.detected, uiLang);
        }

        const terms = tokenize(english);
        const queryTerms = terms.length ? terms : [english.replace(/["()]/g, '')];
        let searchQuery = queryTerms.join(' OR ');
        if (CATEGORY_TERMS[category]) {
            searchQuery = `(${searchQuery}) AND (${CATEGORY_TERMS[category].join(' OR ')})`;
        } else if (queryTerms.length === 1 && queryTerms[0].length >= 3) {
            searchQuery = `(${searchQuery}) AND (military OR geopolitics OR election OR economy OR conflict OR sanction OR crisis OR government OR policy)`;
        }

        const ranked = await getRankedArticles(searchQuery, queryTerms, range, apiKey);
        if (!ranked) return res.json({ articles: [], page: 1, totalPages: 1, total: 0, lang, queryEnglish: english });

        const totalPages = Math.max(1, Math.ceil(ranked.length / size));
        const page = Math.min(requestedPage, totalPages);
        const articles = await localizeArticles(ranked.slice((page - 1) * size, page * size), lang);
        res.json({ articles, page, totalPages, total: ranked.length, lang, queryEnglish: english });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch live intelligence data' });
    }
});

const FEEDBACK_TOPICS = ['feature', 'bug', 'data', 'source', 'translation', 'press', 'other'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const cut = (v, n) => String(v || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n);

app.post('/api/feedback', limiter(5, 10 * 60 * 1000), async (req, res) => {
    const b = req.body || {};
    if (b.website) return res.status(200).json({ success: true });
    const topic = cut(b.topic, 20);
    const message = cut(b.message, 2000);
    const email = cut(b.email, 120);
    if (!FEEDBACK_TOPICS.includes(topic)) return res.status(400).json({ error: 'topic' });
    if (message.length < 10) return res.status(400).json({ error: 'message' });
    if (email && !EMAIL_RE.test(email)) return res.status(400).json({ error: 'email' });
    if (!dbReady()) return res.status(503).json({ error: 'unavailable' });
    try {
        await new Feedback({
            topic,
            otherTopic: topic === 'other' ? cut(b.otherTopic, 80) : '',
            name: cut(b.name, 80),
            email,
            message,
            page: cut(b.page, 200)
        }).save();
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'save' });
    }
});

const ARTICLE_CATEGORIES = ['diplomacy', 'military', 'economy', 'regional', 'analysis', 'opinion'];
const ID_DOCS = ['passport', 'drivers_license', 'national_id'];

function slugify(title) {
    const base = title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 60);
    return (base || 'article') + '-' + crypto.randomBytes(3).toString('hex');
}

function publicArticle(a, full) {
    const first = a.author.firstName;
    const last = a.author.lastName;
    const out = {
        slug: a.slug,
        title: a.title,
        summary: a.summary,
        category: a.category,
        language: a.language,
        readMinutes: a.readMinutes,
        authorName: `${first} ${last.charAt(0).toUpperCase()}.`,
        nationality: a.author.nationality,
        publishedAt: a.publishedAt
    };
    if (full) out.body = a.body;
    return out;
}

function chunkParagraph(p, max = 1200) {
    if (p.length <= max) return [p];
    const parts = [];
    let rest = p;
    while (rest.length > max) {
        let cutAt = rest.lastIndexOf('. ', max);
        if (cutAt < max * 0.4) cutAt = rest.lastIndexOf(' ', max);
        if (cutAt < 1) cutAt = max;
        parts.push(rest.slice(0, cutAt + 1).trim());
        rest = rest.slice(cutAt + 1).trim();
    }
    if (rest) parts.push(rest);
    return parts;
}

async function localizeArticle(item, lang) {
    if (!SUPPORTED_LANGS[lang] || lang === item.language) return item;
    const source = SUPPORTED_LANGS[item.language] || null;
    const flat = [item.title, item.summary];
    const map = [];
    if (item.body !== undefined) {
        item.body.split(/\n{2,}/).forEach(p => {
            const pieces = chunkParagraph(p.trim());
            map.push({ start: flat.length, count: pieces.length });
            pieces.forEach(x => flat.push(x));
        });
    }
    const tr = await translateTexts(flat, lang, source);
    const out = { ...item, title: tr[0], summary: tr[1], translatedFrom: item.language };
    if (item.body !== undefined) {
        out.body = map.map(m => tr.slice(m.start, m.start + m.count).join(' ')).join('\n\n');
    }
    return out;
}

app.get('/api/articles', limiter(60, 60 * 1000), async (req, res) => {
    if (!dbReady()) return res.json({ articles: [], page: 1, totalPages: 1, total: 0 });
    const size = Math.min(Math.max(parseInt(req.query.size, 10) || 9, 1), 24);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const filter = { status: 'approved' };
    if (ARTICLE_CATEGORIES.includes(req.query.category)) filter.category = req.query.category;
    const lang = SUPPORTED_LANGS[req.query.lang] ? req.query.lang : null;
    try {
        const total = await Article.countDocuments(filter);
        const docs = await Article.find(filter).sort({ publishedAt: -1 }).skip((page - 1) * size).limit(size).lean();
        let articles = docs.map(d => publicArticle(d, false));
        if (lang) articles = await Promise.all(articles.map(a => localizeArticle(a, lang)));
        res.json({ articles, page, totalPages: Math.max(1, Math.ceil(total / size)), total });
    } catch (e) {
        res.status(500).json({ error: 'list' });
    }
});

app.get('/api/articles/:slug', limiter(60, 60 * 1000), async (req, res) => {
    if (!dbReady()) return res.status(503).json({ error: 'unavailable' });
    try {
        const doc = await Article.findOne({ slug: req.params.slug, status: 'approved' }).lean();
        if (!doc) return res.status(404).json({ error: 'not_found' });
        const lang = SUPPORTED_LANGS[req.query.lang] ? req.query.lang : null;
        let item = publicArticle(doc, true);
        if (lang) item = await localizeArticle(item, lang);
        res.json({ article: item });
    } catch (e) {
        res.status(500).json({ error: 'read' });
    }
});

app.post('/api/articles', limiter(3, 60 * 60 * 1000), async (req, res) => {
    const b = req.body || {};
    if (b.website) return res.status(200).json({ success: true });
    const a = b.author || {};
    const x = b.article || {};
    const age = parseInt(a.age, 10);
    if (!Number.isInteger(age) || age < 18 || age > 110) return res.status(400).json({ error: 'age' });
    const author = {
        firstName: cut(a.firstName, 60),
        lastName: cut(a.lastName, 60),
        age,
        nationality: cut(a.nationality, 80),
        residence: cut(a.residence, 80),
        email: cut(a.email, 120),
        idDocs: Array.isArray(a.idDocs) ? a.idDocs.filter(d => ID_DOCS.includes(d)) : []
    };
    if (!author.firstName || !author.lastName || !author.nationality || !author.residence) return res.status(400).json({ error: 'identity' });
    if (!EMAIL_RE.test(author.email)) return res.status(400).json({ error: 'email' });
    if (b.consent !== true) return res.status(400).json({ error: 'consent' });
    const title = cut(x.title, 140);
    const summary = cut(x.summary, 320);
    const body = String(x.body || '').replace(/\r/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
    const language = SUPPORTED_LANGS[x.language] ? x.language : 'en';
    const category = ARTICLE_CATEGORIES.includes(x.category) ? x.category : 'analysis';
    if (title.length < 10 || summary.length < 40 || body.length < 600 || body.length > 20000) return res.status(400).json({ error: 'content' });
    if (!dbReady()) return res.status(503).json({ error: 'unavailable' });
    try {
        const words = body.split(/\s+/).length;
        const cjk = (body.match(/[\u4E00-\u9FFF]/g) || []).length;
        await new Article({
            slug: slugify(title),
            title,
            summary,
            body,
            category,
            language,
            readMinutes: Math.max(1, Math.round((words + cjk / 2) / 200)),
            author
        }).save();
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'save' });
    }
});

function requireAdmin(req, res, next) {
    const expected = process.env.ADMIN_TOKEN || '';
    const given = String(req.get('x-admin-token') || '');
    const a = Buffer.from(expected);
    const g = Buffer.from(given);
    if (!expected || a.length !== g.length || !crypto.timingSafeEqual(a, g)) return res.status(401).json({ error: 'unauthorized' });
    next();
}

app.get('/api/admin/articles', requireAdmin, async (req, res) => {
    if (!dbReady()) return res.status(503).json({ error: 'unavailable' });
    const status = ['pending', 'approved', 'rejected'].includes(req.query.status) ? req.query.status : 'pending';
    const docs = await Article.find({ status }).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ articles: docs });
});

app.post('/api/admin/articles/:id/status', requireAdmin, async (req, res) => {
    if (!dbReady()) return res.status(503).json({ error: 'unavailable' });
    const status = req.body && req.body.status;
    if (!['approved', 'rejected', 'pending'].includes(status)) return res.status(400).json({ error: 'status' });
    try {
        const update = { status };
        if (status === 'approved') update.publishedAt = new Date();
        const doc = await Article.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
        if (!doc) return res.status(404).json({ error: 'not_found' });
        res.json({ success: true, slug: doc.slug, status: doc.status });
    } catch (e) {
        res.status(400).json({ error: 'id' });
    }
});

const articlesTemplate = fs.readFileSync(path.join(ROOT, 'articles.html'), 'utf8');

function jsonForScript(value) {
    return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

function renderArticlesPage(article) {
    const url = article ? `${SITE}/articles/${encodeURIComponent(article.slug)}` : `${SITE}/articles`;
    const title = article ? `${article.title} | VERO` : 'Articles & Analysis | VERO';
    const desc = article ? article.summary : 'Signed analysis and reporting from independent contributors on diplomacy, security and the global economy, published on VERO.';
    const parts = [
        `<title>${escapeHtml(title)}</title>`,
        `<meta name="description" content="${escapeHtml(desc)}">`,
        `<link rel="canonical" href="${url}">`,
        `<meta property="og:type" content="${article ? 'article' : 'website'}">`,
        `<meta property="og:site_name" content="VERO">`,
        `<meta property="og:title" content="${escapeHtml(title)}">`,
        `<meta property="og:description" content="${escapeHtml(desc)}">`,
        `<meta property="og:url" content="${url}">`,
        `<meta property="og:image" content="${SITE}/assets/BANNER.png">`,
        `<meta name="twitter:card" content="summary_large_image">`
    ];
    let ssr = '';
    if (article) {
        parts.push(`<script type="application/ld+json">${jsonForScript({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title,
            description: article.summary,
            inLanguage: article.language,
            datePublished: article.publishedAt,
            author: { '@type': 'Person', name: article.authorName },
            publisher: { '@type': 'Organization', name: 'VERO', url: SITE + '/' },
            mainEntityOfPage: url
        })}</script>`);
        parts.push(`<script>window.__ARTICLE__=${jsonForScript(article)};</script>`);
        ssr = `<article class="ssr-article"><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.summary)}</p>${article.body.split(/\n{2,}/).map(p => `<p>${escapeHtml(p)}</p>`).join('')}</article>`;
    }
    return articlesTemplate.replace('<!--SEO-->', parts.join('\n')).replace('<!--SSR-->', ssr);
}

app.get('/articles.html', (req, res) => res.redirect(301, '/articles'));

app.get('/articles', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.type('html').send(renderArticlesPage(null));
});

app.get('/articles/:slug', async (req, res) => {
    res.set('Cache-Control', 'no-cache');
    if (!dbReady()) return res.type('html').send(renderArticlesPage(null));
    try {
        const doc = await Article.findOne({ slug: req.params.slug, status: 'approved' }).lean();
        if (!doc) return res.status(404).type('html').send(renderArticlesPage(null));
        res.type('html').send(renderArticlesPage(publicArticle(doc, true)));
    } catch (e) {
        res.type('html').send(renderArticlesPage(null));
    }
});

app.get('/sitemap.xml', async (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    const urls = [
        { loc: SITE + '/', lastmod: today, freq: 'daily', priority: '1.0' },
        { loc: SITE + '/articles', lastmod: today, freq: 'daily', priority: '0.8' }
    ];
    if (dbReady()) {
        try {
            const docs = await Article.find({ status: 'approved' }).sort({ publishedAt: -1 }).limit(2000).select('slug publishedAt').lean();
            docs.forEach(d => urls.push({
                loc: `${SITE}/articles/${encodeURIComponent(d.slug)}`,
                lastmod: (d.publishedAt || new Date()).toISOString().slice(0, 10),
                freq: 'monthly',
                priority: '0.6'
            }));
        } catch (e) { }
    }
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls.map(u => `  <url>\n    <loc>${escapeHtml(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n') +
        '\n</urlset>';
    res.set('Cache-Control', 'public, max-age=3600');
    res.type('application/xml').send(xml);
});

app.get(['/', '/index.html'], (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(ROOT, 'index.html'));
});

app.use((req, res) => {
    res.status(404).type('text/plain').send('Not Found');
});

app.listen(PORT);
