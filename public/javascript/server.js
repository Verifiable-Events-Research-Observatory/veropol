const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const ROOT = path.join(__dirname, '../');

app.use('/api', (req, res, next) => {
    res.set('X-Robots-Tag', 'noindex');
    next();
});

app.use('/assets', express.static(path.join(ROOT, 'assets'), { maxAge: '7d' }));
app.use('/css', express.static(path.join(ROOT, 'css'), { maxAge: '1d' }));
app.use('/javascript', express.static(path.join(ROOT, 'javascript'), { maxAge: '1d' }));

['robots.txt', 'sitemap.xml', 'favicon.ico'].forEach(file => {
    app.get('/' + file, (req, res) => {
        res.set('Cache-Control', 'public, max-age=86400');
        res.sendFile(path.join(ROOT, file));
    });
});

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .catch(() => { });
}

const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    topic: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

app.get('/ping', (req, res) => {
    res.status(200).send('OK');
});

const STOP_WORDS = new Set(['the', 'and', 'for', 'with', 'from', 'about', 'into', 'over', 'that', 'this', 'news', 'latest']);

const CATEGORY_TERMS = {
    military: ['military', 'defense', 'troops', 'missile', 'navy', 'army', 'weapons', 'drone', 'airstrike', 'nato'],
    economy: ['economy', 'sanctions', 'trade', 'tariffs', 'inflation', 'oil', 'markets', 'currency', 'gdp'],
    diplomacy: ['diplomacy', 'summit', 'talks', 'treaty', 'envoy', 'ministers', 'ceasefire', 'negotiations', 'embassy']
};

const GEO_PATTERN = /geopolit|diplomat|sanction|military|defen[cs]e|troops|missile|navy|army|\bwar\b|conflict|ceasefire|treaty|summit|nato|security council|foreign (policy|minister)|embassy|alliance|nuclear|tariff|border|insurg|coup|junta|ukrain|russia|china|taiwan|iran|israel|gaza|syria|korea|sahel|brics|opec|airstrike|drone/i;

function tokenize(text) {
    return [...new Set(
        text.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(t => t.length >= 3 && !STOP_WORDS.has(t))
    )].slice(0, 8);
}

function scoreArticle(art, terms) {
    const title = (art.title || '').toLowerCase();
    const desc = (art.description || '').toLowerCase();
    let matched = 0;
    let score = 0;
    for (const term of terms) {
        const re = new RegExp('\\b' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const inTitle = re.test(title);
        const inDesc = re.test(desc);
        if (inTitle || inDesc) matched++;
        if (inTitle) score += 4;
        if (inDesc) score += 2;
    }
    if (GEO_PATTERN.test(title)) score += 2;
    if (GEO_PATTERN.test(desc)) score += 1;
    if (art.image) score += 0.5;
    return { matched, score };
}

const MAX_SOURCE_PAGES = 10;
const CACHE_TTL = 10 * 60 * 1000;
const MAX_CACHE_ENTRIES = 60;
const RANGE_HOURS = { '24h': 24, '7d': 168, '30d': 720 };
const newsCache = new Map();

const SUPPORTED_LANGS = { en: 'en', fr: 'fr', es: 'es', ru: 'ru', ar: 'ar', zh: 'zh-CN', tr: 'tr' };
const MAX_TRANSLATION_CACHE = 4000;
const translationCache = new Map();

function cacheTranslation(key, value) {
    if (translationCache.size >= MAX_TRANSLATION_CACHE) translationCache.delete(translationCache.keys().next().value);
    translationCache.set(key, value);
}

async function translateOfficial(texts, target, apiKey) {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: texts, source: 'en', target, format: 'text' }),
        signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) return null;
    const data = await response.json();
    const list = data && data.data && data.data.translations;
    return Array.isArray(list) && list.length === texts.length ? list.map(item => item.translatedText) : null;
}

async function translateFree(text, target) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) return null;
    const data = await response.json();
    if (!Array.isArray(data) || !Array.isArray(data[0])) return null;
    return data[0].map(part => (part && part[0]) ? part[0] : '').join('');
}

async function translateTexts(texts, lang) {
    const target = SUPPORTED_LANGS[lang];
    if (!target || lang === 'en') return texts;

    const result = new Array(texts.length);
    const pending = [];
    texts.forEach((text, i) => {
        if (!text) {
            result[i] = text;
            return;
        }
        const hit = translationCache.get(`${target}|${text}`);
        if (hit !== undefined) result[i] = hit;
        else pending.push(i);
    });

    if (pending.length) {
        const pendingTexts = pending.map(i => texts[i]);
        let translated = null;
        try {
            if (process.env.GOOGLE_TRANSLATE_API_KEY) {
                translated = await translateOfficial(pendingTexts, target, process.env.GOOGLE_TRANSLATE_API_KEY);
            } else {
                translated = await Promise.all(pendingTexts.map(text => translateFree(text, target).catch(() => null)));
            }
        } catch (err) {
            translated = null;
        }
        pending.forEach((index, k) => {
            const value = translated && translated[k];
            if (value) {
                cacheTranslation(`${target}|${texts[index]}`, value);
                result[index] = value;
            } else {
                result[index] = texts[index];
            }
        });
    }
    return result;
}

async function localizeArticles(articles, lang) {
    if (lang === 'en' || !articles.length) return articles;
    const texts = [];
    articles.forEach(art => {
        texts.push(art.title === 'Untitled Report' ? '' : art.title);
        texts.push(art.description);
    });
    const translated = await translateTexts(texts, lang);
    return articles.map((art, i) => ({
        ...art,
        title: translated[i * 2] || art.title,
        description: translated[i * 2 + 1] || art.description
    }));
}

async function fetchGNewsPage(searchQuery, page, from, apiKey) {
    let url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&max=10&in=title,description&apikey=${apiKey}`;
    if (page > 1) url += `&page=${page}`;
    if (from) url += `&from=${encodeURIComponent(from)}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data && Array.isArray(data.articles) ? data : null;
}

function rankArticles(rawArticles, queryTerms) {
    const seenTitles = new Set();
    const seenImages = new Set();
    const candidates = [];

    for (const art of rawArticles) {
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
            source: art.source ? art.source.name : 'Verified Source'
        };
        const scored = scoreArticle(article, queryTerms);
        if (scored.score > 0) candidates.push({ article, ...scored });
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

app.get('/api/news', async (req, res) => {
    const rawQuery = req.query.q ? req.query.q.trim() : '';
    const query = rawQuery !== '' ? rawQuery : 'geopolitics';
    const category = (req.query.category || 'all').toLowerCase();
    const range = RANGE_HOURS[req.query.range] ? req.query.range : 'all';
    const size = Math.min(Math.max(parseInt(req.query.size, 10) || 9, 1), 30);
    const requestedPage = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const lang = SUPPORTED_LANGS[req.query.lang] ? req.query.lang : 'en';
    const apiKey = process.env.GNEWS_API_KEY;

    if (!apiKey) return res.status(500).json({ error: "API key is missing" });

    const terms = tokenize(query);
    const queryTerms = terms.length ? terms : [query.replace(/["()]/g, '')];

    let searchQuery = queryTerms.join(' OR ');

    if (CATEGORY_TERMS[category]) {
        searchQuery = `(${searchQuery}) AND (${CATEGORY_TERMS[category].join(' OR ')})`;
    } else if (queryTerms.length === 1 && queryTerms[0].length >= 3) {
        searchQuery = `(${searchQuery}) AND (military OR geopolitics OR election OR economy OR conflict OR sanction OR crisis OR government OR policy)`;
    }

    try {
        const ranked = await getRankedArticles(searchQuery, queryTerms, range, apiKey);
        if (!ranked) return res.json({ articles: [], page: 1, totalPages: 1, total: 0 });

        const totalPages = Math.max(1, Math.ceil(ranked.length / size));
        const page = Math.min(requestedPage, totalPages);
        const articles = await localizeArticles(ranked.slice((page - 1) * size, page * size), lang);
        res.json({
            articles,
            page,
            totalPages,
            total: ranked.length
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch live intelligence data" });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const newContact = new Contact(req.body);
            await newContact.save();
        }
        res.status(200).json({ success: true, message: "Transmission received." });
    } catch (err) {
        res.status(500).json({ error: "Failed to save transmission." });
    }
});

app.get(['/', '/index.html'], (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(ROOT, 'index.html'));
});

app.use((req, res) => {
    res.status(404).type('text/plain').send('Not Found');
});

app.listen(PORT, () => {
});
