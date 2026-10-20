const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

let compression = null;
try { compression = require('compression'); } catch (e) { }

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;
const SITE = 'https://veropol.onrender.com';
const ROOT = path.join(__dirname, '../');
const ADMIN_EMAILS = new Set((process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean));

if (compression) app.use(compression());
app.use(express.json({ limit: '400kb' }));

app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

app.use('/api', (req, res, next) => {
    res.set('X-Robots-Tag', 'noindex');
    res.set('Cache-Control', 'no-store');
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const origin = req.get('origin');
        if (origin) {
            try {
                if (new URL(origin).host !== req.get('host')) return res.status(403).json({ error: 'origin' });
            } catch (e) {
                return res.status(403).json({ error: 'origin' });
            }
        }
    }
    next();
});

app.use('/javascript', (req, res, next) => (/^\/server/.test(req.path) ? res.status(404).type('text/plain').send('Not Found') : next()));
app.use('/assets', express.static(path.join(ROOT, 'assets'), { maxAge: '7d' }));
app.use('/css', express.static(path.join(ROOT, 'css'), { maxAge: '7d' }));
app.use('/javascript', express.static(path.join(ROOT, 'javascript'), { maxAge: '7d' }));

['robots.txt', 'favicon.ico'].forEach(file => {
    app.get('/' + file, (req, res) => {
        res.set('Cache-Control', 'public, max-age=86400');
        res.sendFile(path.join(ROOT, file));
    });
});

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI).catch(() => { });
}
const dbReady = () => mongoose.connection.readyState === 1;
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', new Schema({
    topic: String,
    otherTopic: String,
    name: String,
    email: String,
    message: String,
    page: String,
    date: { type: Date, default: Date.now }
}));

const TransCache = mongoose.models.TransCache || mongoose.model('TransCache', new Schema({
    k: { type: String, unique: true, index: true },
    v: String,
    d: String,
    createdAt: { type: Date, default: Date.now, expires: 60 * 86400 }
}));

const User = mongoose.models.User || mongoose.model('User', new Schema({
    email: { type: String, unique: true, index: true },
    passHash: String,
    firstName: String,
    lastName: String,
    age: Number,
    nationality: String,
    residence: String,
    idDocs: [String],
    avatarId: String,
    verified: { type: Boolean, default: false },
    banned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}));

const Session = mongoose.models.Session || mongoose.model('Session', new Schema({
    th: { type: String, unique: true, index: true },
    userId: ObjectId,
    expiresAt: { type: Date, expires: 0 }
}));

const Media = mongoose.models.Media || mongoose.model('Media', new Schema({
    owner: { type: ObjectId, index: true },
    kind: String,
    contentType: String,
    data: Buffer,
    createdAt: { type: Date, default: Date.now }
}));

const Article = mongoose.models.Article || mongoose.model('Article', new Schema({
    slug: { type: String, unique: true, index: true },
    title: String,
    summary: String,
    body: String,
    category: String,
    language: String,
    readMinutes: Number,
    coverId: String,
    userId: { type: ObjectId, ref: 'User', index: true },
    status: { type: String, default: 'pending', index: true },
    createdAt: { type: Date, default: Date.now },
    publishedAt: Date
}));

const translator = require('./server-translate')({ TransCache, dbReady });
const { SUPPORTED_LANGS } = translator;

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

const search = require('./server-search')({ translator, matchSource });

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const cut = (v, n) => String(v || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n);
const escapeHtml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const isHexId = v => /^[a-f0-9]{24}$/i.test(String(v || ''));
const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const scrypt = (pw, salt) => new Promise((resolve, reject) => crypto.scrypt(pw, salt, 64, (e, k) => (e ? reject(e) : resolve(k))));

async function hashPw(pw) {
    const salt = crypto.randomBytes(16);
    const k = await scrypt(pw, salt);
    return salt.toString('hex') + ':' + k.toString('hex');
}

async function checkPw(pw, stored) {
    const parts = String(stored || '').split(':');
    if (parts.length !== 2) return false;
    const k = await scrypt(pw, Buffer.from(parts[0], 'hex'));
    const h = Buffer.from(parts[1], 'hex');
    return h.length === k.length && crypto.timingSafeEqual(h, k);
}

function readCookie(req, name) {
    const raw = req.headers.cookie || '';
    for (const part of raw.split(';')) {
        const i = part.indexOf('=');
        if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
    }
    return '';
}

const SESSION_DAYS = 30;
const sha = s => crypto.createHash('sha256').update(s).digest('hex');

function setSessionCookie(req, res, token, maxAgeSec) {
    const flags = ['vero_sid=' + token, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=' + maxAgeSec];
    if (req.secure) flags.push('Secure');
    res.append('Set-Cookie', flags.join('; '));
}

async function startSession(req, res, userId) {
    const token = crypto.randomBytes(32).toString('hex');
    await Session.create({ th: sha(token), userId, expiresAt: new Date(Date.now() + SESSION_DAYS * 86400000) });
    setSessionCookie(req, res, token, SESSION_DAYS * 86400);
}

const isAdmin = u => !!u && ADMIN_EMAILS.has(String(u.email).toLowerCase());

async function auth(req, res, next) {
    req.user = null;
    const token = readCookie(req, 'vero_sid');
    if (token && dbReady()) {
        try {
            const s = await Session.findOne({ th: sha(token) }).lean();
            if (s && s.expiresAt > new Date()) {
                const u = await User.findById(s.userId).lean();
                if (u && !u.banned) req.user = u;
            }
        } catch (e) { }
    }
    next();
}

app.use('/api', auth);

const requireUser = (req, res, next) => (req.user ? next() : res.status(401).json({ error: 'login' }));
const requireAdmin = (req, res, next) => (isAdmin(req.user) ? next() : res.status(403).json({ error: 'forbidden' }));

function publicUser(u) {
    return {
        id: String(u._id),
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        age: u.age,
        nationality: u.nationality,
        residence: u.residence,
        idDocs: u.idDocs || [],
        avatarUrl: u.avatarId ? '/media/' + u.avatarId : null,
        verified: !!u.verified,
        isAdmin: isAdmin(u)
    };
}

const ID_DOCS = ['passport', 'drivers_license', 'national_id'];

app.post('/api/auth/register', limiter(6, 60 * 60 * 1000), async (req, res) => {
    const b = req.body || {};
    if (b.website) return res.status(200).json({ success: true });
    if (!dbReady()) return res.status(503).json({ error: 'unavailable' });
    const age = parseInt(b.age, 10);
    const email = cut(b.email, 120).toLowerCase();
    const password = String(b.password || '');
    const user = {
        firstName: cut(b.firstName, 60),
        lastName: cut(b.lastName, 60),
        nationality: cut(b.nationality, 80),
        residence: cut(b.residence, 80),
        idDocs: Array.isArray(b.idDocs) ? b.idDocs.filter(d => ID_DOCS.includes(d)) : [],
        age,
        email
    };
    if (!Number.isInteger(age) || age < 18 || age > 110) return res.status(400).json({ error: 'age' });
    if (!user.firstName || !user.lastName || !user.nationality || !user.residence) return res.status(400).json({ error: 'identity' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'email' });
    if (password.length < 8 || password.length > 128) return res.status(400).json({ error: 'password' });
    if (b.consent !== true) return res.status(400).json({ error: 'consent' });
    try {
        if (await User.findOne({ email }).lean()) return res.status(409).json({ error: 'exists' });
        const created = await User.create({ ...user, passHash: await hashPw(password) });
        await startSession(req, res, created._id);
        res.json({ user: publicUser(created.toObject()) });
    } catch (e) {
        res.status(500).json({ error: 'save' });
    }
});

app.post('/api/auth/login', limiter(12, 10 * 60 * 1000), async (req, res) => {
    if (!dbReady()) return res.status(503).json({ error: 'unavailable' });
    const email = cut(req.body && req.body.email, 120).toLowerCase();
    const password = String((req.body && req.body.password) || '');
    try {
        const u = await User.findOne({ email }).lean();
        const ok = u ? await checkPw(password, u.passHash) : false;
        if (!ok) return res.status(401).json({ error: 'credentials' });
        if (u.banned) return res.status(403).json({ error: 'banned' });
        await startSession(req, res, u._id);
        res.json({ user: publicUser(u) });
    } catch (e) {
        res.status(500).json({ error: 'login' });
    }
});

app.post('/api/auth/logout', async (req, res) => {
    const token = readCookie(req, 'vero_sid');
    if (token && dbReady()) await Session.deleteOne({ th: sha(token) }).catch(() => { });
    setSessionCookie(req, res, '', 0);
    res.json({ success: true });
});

app.get('/api/me', (req, res) => res.json({ user: req.user ? publicUser(req.user) : null }));

function decodeImage(dataUrl) {
    const m = /^data:image\/(webp|jpeg|png);base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ''));
    if (!m) return null;
    const buf = Buffer.from(m[2], 'base64');
    if (buf.length < 200 || buf.length > 230000) return null;
    const ok = m[1] === 'webp'
        ? buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP'
        : m[1] === 'jpeg' ? buf[0] === 0xFF && buf[1] === 0xD8 : buf.slice(1, 4).toString() === 'PNG';
    return ok ? { buf, type: 'image/' + m[1] } : null;
}

app.post('/api/media', requireUser, limiter(30, 60 * 60 * 1000), async (req, res) => {
    const kind = req.body && req.body.kind === 'cover' ? 'cover' : 'avatar';
    const img = decodeImage(req.body && req.body.dataUrl);
    if (!img) return res.status(400).json({ error: 'image' });
    try {
        const count = await Media.countDocuments({ owner: req.user._id });
        if (count >= 40) return res.status(429).json({ error: 'quota' });
        const doc = await Media.create({ owner: req.user._id, kind, contentType: img.type, data: img.buf });
        res.json({ id: String(doc._id), url: '/media/' + doc._id });
    } catch (e) {
        res.status(500).json({ error: 'save' });
    }
});

app.get('/media/:id', async (req, res) => {
    if (!isHexId(req.params.id) || !dbReady()) return res.status(404).end();
    try {
        const m = await Media.findById(req.params.id).lean();
        if (!m) return res.status(404).end();
        res.set('Content-Type', m.contentType);
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        res.set('X-Content-Type-Options', 'nosniff');
        res.send(Buffer.from(m.data.buffer ? m.data.buffer : m.data));
    } catch (e) {
        res.status(404).end();
    }
});

app.patch('/api/me', requireUser, async (req, res) => {
    const b = req.body || {};
    const set = {};
    try {
        if (b.removeAvatar) {
            if (req.user.avatarId) await Media.deleteOne({ _id: req.user.avatarId, owner: req.user._id }).catch(() => { });
            set.avatarId = '';
        } else if (b.avatarId) {
            if (!isHexId(b.avatarId)) return res.status(400).json({ error: 'media' });
            const m = await Media.findOne({ _id: b.avatarId, owner: req.user._id, kind: 'avatar' }).lean();
            if (!m) return res.status(400).json({ error: 'media' });
            if (req.user.avatarId && req.user.avatarId !== b.avatarId) await Media.deleteOne({ _id: req.user.avatarId, owner: req.user._id }).catch(() => { });
            set.avatarId = b.avatarId;
        }
        if (b.nationality) set.nationality = cut(b.nationality, 80);
        if (b.residence) set.residence = cut(b.residence, 80);
        const u = await User.findByIdAndUpdate(req.user._id, set, { new: true }).lean();
        res.json({ user: publicUser(u) });
    } catch (e) {
        res.status(500).json({ error: 'save' });
    }
});

async function purgeArticle(a) {
    if (a.coverId && isHexId(a.coverId)) await Media.deleteOne({ _id: a.coverId }).catch(() => { });
    await Article.deleteOne({ _id: a._id });
}

app.delete('/api/me', requireUser, limiter(5, 60 * 60 * 1000), async (req, res) => {
    const ok = await checkPw(String((req.body && req.body.password) || ''), req.user.passHash);
    if (!ok) return res.status(401).json({ error: 'credentials' });
    try {
        const arts = await Article.find({ userId: req.user._id }).lean();
        for (const a of arts) await purgeArticle(a);
        await Media.deleteMany({ owner: req.user._id });
        await Session.deleteMany({ userId: req.user._id });
        await User.deleteOne({ _id: req.user._id });
        setSessionCookie(req, res, '', 0);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'delete' });
    }
});

function authorOf(a) {
    const u = a.userId && a.userId.firstName ? a.userId : null;
    return {
        authorName: u ? u.firstName + ' ' + String(u.lastName || '').charAt(0).toUpperCase() + '.' : 'VERO',
        nationality: u ? u.nationality : '',
        avatarUrl: u && u.avatarId ? '/media/' + u.avatarId : null,
        verified: !!(u && u.verified)
    };
}

function publicArticle(a, full) {
    const out = {
        id: String(a._id),
        slug: a.slug,
        title: a.title,
        summary: a.summary,
        category: a.category,
        language: a.language,
        readMinutes: a.readMinutes,
        coverUrl: a.coverId ? '/media/' + a.coverId : null,
        publishedAt: a.publishedAt,
        ...authorOf(a)
    };
    if (full) out.body = a.body;
    return out;
}

const AUTHOR_FIELDS = 'firstName lastName nationality avatarId verified';

function chunkParagraph(p, max = 1200) {
    if (p.length <= max) return [p];
    const parts = [];
    let rest = p;
    while (rest.length > max) {
        let at = rest.lastIndexOf('. ', max);
        if (at < max * 0.4) at = rest.lastIndexOf(' ', max);
        if (at < 1) at = max;
        parts.push(rest.slice(0, at + 1).trim());
        rest = rest.slice(at + 1).trim();
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
    const tr = await translator.translateTexts(flat, lang, source);
    if (!tr[0]) return item;
    const out = { ...item, title: tr[0], summary: tr[1] || item.summary, translatedFrom: item.language };
    if (item.body !== undefined) {
        out.body = map.map(m => tr.slice(m.start, m.start + m.count).map((x, k) => x || flat[m.start + k]).join(' ')).join('\n\n');
    }
    return out;
}

app.get('/api/news', limiter(40, 60 * 1000), async (req, res) => {
    const q = req.query.q ? String(req.query.q).trim().slice(0, 120) : '';
    let vars = [];
    try { vars = JSON.parse(req.query.vars || '[]'); } catch (e) { vars = []; }
    try {
        const result = await search.search({
            q,
            category: String(req.query.category || 'all').toLowerCase(),
            range: String(req.query.range || 'all'),
            page: parseInt(req.query.page, 10) || 1,
            size: Math.min(Math.max(parseInt(req.query.size, 10) || 9, 1), 30),
            uiLang: SUPPORTED_LANGS[req.query.lang] ? req.query.lang : 'en',
            detect: req.query.detect === '1',
            client: req.query.eng ? { english: String(req.query.eng), detected: String(req.query.det || ''), vars: Array.isArray(vars) ? vars : [] } : null
        });
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch live intelligence data' });
    }
});

app.post('/api/translate', limiter(90, 60 * 1000), async (req, res) => {
    const { texts, lang, auto } = req.body || {};
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
        const translations = await translator.translateTexts(texts, lang, auto ? null : 'en');
        res.json({ translations });
    } catch (e) {
        res.status(500).json({ error: 'Translation failed' });
    }
});

app.get('/api/sources', (req, res) => {
    res.json({ sources: TRUSTED_SOURCES.map(s => ({ name: s.name, region: s.region, domain: s.domains[0] })) });
});

app.get('/api/health/translate', async (req, res) => res.json(await translator.health()));
app.get('/api/health/feeds', (req, res) => res.json(search.feedHealth()));

const FEEDBACK_TOPICS = ['feature', 'bug', 'data', 'source', 'translation', 'press', 'other'];

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

function slugify(title) {
    const base = title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 60);
    return (base || 'article') + '-' + crypto.randomBytes(3).toString('hex');
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
        const docs = await Article.find(filter).sort({ publishedAt: -1 }).skip((page - 1) * size).limit(size).populate('userId', AUTHOR_FIELDS).lean();
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
        const doc = await Article.findOne({ slug: req.params.slug, status: 'approved' }).populate('userId', AUTHOR_FIELDS).lean();
        if (!doc) return res.status(404).json({ error: 'not_found' });
        const lang = SUPPORTED_LANGS[req.query.lang] ? req.query.lang : null;
        let item = publicArticle(doc, true);
        if (lang) item = await localizeArticle(item, lang);
        res.json({ article: item });
    } catch (e) {
        res.status(500).json({ error: 'read' });
    }
});

app.get('/api/me/articles', requireUser, async (req, res) => {
    const docs = await Article.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ articles: docs.map(d => ({ id: String(d._id), slug: d.slug, title: d.title, status: d.status, createdAt: d.createdAt })) });
});

app.post('/api/articles', requireUser, limiter(8, 60 * 60 * 1000), async (req, res) => {
    const b = req.body || {};
    if (b.website) return res.status(200).json({ success: true });
    const x = b.article || {};
    if (b.consent !== true) return res.status(400).json({ error: 'consent' });
    const title = cut(x.title, 140);
    const summary = cut(x.summary, 320);
    const body = String(x.body || '').replace(/\r/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
    const language = SUPPORTED_LANGS[x.language] ? x.language : 'en';
    const category = ARTICLE_CATEGORIES.includes(x.category) ? x.category : 'analysis';
    if (title.length < 10 || summary.length < 40 || body.length < 600 || body.length > 20000) return res.status(400).json({ error: 'content' });
    if (!dbReady()) return res.status(503).json({ error: 'unavailable' });
    try {
        let coverId = '';
        if (x.coverId) {
            if (!isHexId(x.coverId)) return res.status(400).json({ error: 'media' });
            const m = await Media.findOne({ _id: x.coverId, owner: req.user._id, kind: 'cover' }).lean();
            if (!m) return res.status(400).json({ error: 'media' });
            coverId = x.coverId;
        }
        const admin = isAdmin(req.user);
        if (!admin && (await Article.countDocuments({ userId: req.user._id, status: 'pending' })) >= 5) return res.status(429).json({ error: 'pending' });
        const words = body.split(/\s+/).length;
        const cjk = (body.match(/[\u4E00-\u9FFF]/g) || []).length;
        await Article.create({
            slug: slugify(title),
            title,
            summary,
            body,
            category,
            language,
            coverId,
            userId: req.user._id,
            readMinutes: Math.max(1, Math.round((words + cjk / 2) / 200)),
            status: admin ? 'approved' : 'pending',
            publishedAt: admin ? new Date() : undefined
        });
        res.json({ success: true, status: admin ? 'approved' : 'pending' });
    } catch (e) {
        res.status(500).json({ error: 'save' });
    }
});

app.delete('/api/articles/:id', requireUser, async (req, res) => {
    if (!isHexId(req.params.id)) return res.status(400).json({ error: 'id' });
    try {
        const a = await Article.findById(req.params.id).lean();
        if (!a) return res.status(404).json({ error: 'not_found' });
        if (String(a.userId) !== String(req.user._id) && !isAdmin(req.user)) return res.status(403).json({ error: 'forbidden' });
        await purgeArticle(a);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'delete' });
    }
});

app.get('/api/admin/articles', requireAdmin, async (req, res) => {
    const status = ['pending', 'approved', 'rejected'].includes(req.query.status) ? req.query.status : 'pending';
    const docs = await Article.find({ status }).sort({ createdAt: -1 }).limit(100).populate('userId').lean();
    res.json({
        articles: docs.map(d => ({
            id: String(d._id),
            slug: d.slug,
            title: d.title,
            summary: d.summary,
            body: d.body,
            category: d.category,
            language: d.language,
            coverUrl: d.coverId ? '/media/' + d.coverId : null,
            status: d.status,
            createdAt: d.createdAt,
            author: d.userId ? {
                id: String(d.userId._id),
                name: d.userId.firstName + ' ' + d.userId.lastName,
                email: d.userId.email,
                age: d.userId.age,
                nationality: d.userId.nationality,
                residence: d.userId.residence,
                idDocs: d.userId.idDocs || [],
                verified: !!d.userId.verified,
                banned: !!d.userId.banned,
                avatarUrl: d.userId.avatarId ? '/media/' + d.userId.avatarId : null
            } : null
        }))
    });
});

app.post('/api/admin/articles/:id/status', requireAdmin, async (req, res) => {
    const status = req.body && req.body.status;
    if (!isHexId(req.params.id) || !['approved', 'rejected', 'pending'].includes(status)) return res.status(400).json({ error: 'status' });
    const update = { status };
    if (status === 'approved') update.publishedAt = new Date();
    const doc = await Article.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
    if (!doc) return res.status(404).json({ error: 'not_found' });
    res.json({ success: true });
});

app.get('/api/admin/users', requireAdmin, async (req, res) => {
    const q = cut(req.query.q, 80);
    const re = q ? new RegExp(escapeRe(q), 'i') : null;
    const filter = re ? { $or: [{ email: re }, { lastName: re }, { firstName: re }] } : {};
    const docs = await User.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ users: docs.map(u => ({ ...publicUser(u), banned: !!u.banned, createdAt: u.createdAt })) });
});

app.post('/api/admin/users/:id', requireAdmin, async (req, res) => {
    if (!isHexId(req.params.id)) return res.status(400).json({ error: 'id' });
    const set = {};
    if (typeof req.body.banned === 'boolean') set.banned = req.body.banned;
    if (typeof req.body.verified === 'boolean') set.verified = req.body.verified;
    const u = await User.findByIdAndUpdate(req.params.id, set, { new: true }).lean();
    if (!u) return res.status(404).json({ error: 'not_found' });
    if (set.banned) {
        await Article.updateMany({ userId: u._id, status: { $ne: 'rejected' } }, { status: 'rejected' });
        await Session.deleteMany({ userId: u._id });
    }
    res.json({ success: true });
});

const articlesTemplate = fs.readFileSync(path.join(ROOT, 'articles.html'), 'utf8');

function jsonForScript(value) {
    return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

function renderArticlesPage(article) {
    const url = article ? SITE + '/articles/' + encodeURIComponent(article.slug) : SITE + '/articles';
    const title = article ? article.title + ' | VERO' : 'Articles & Analysis | VERO';
    const desc = article ? article.summary : 'Signed analysis and reporting from independent contributors on diplomacy, security and the global economy, published on VERO.';
    const image = article && article.coverUrl ? SITE + article.coverUrl : SITE + '/assets/BANNER.png';
    const parts = [
        '<title>' + escapeHtml(title) + '</title>',
        '<meta name="description" content="' + escapeHtml(desc) + '">',
        '<link rel="canonical" href="' + url + '">',
        '<meta property="og:type" content="' + (article ? 'article' : 'website') + '">',
        '<meta property="og:site_name" content="VERO">',
        '<meta property="og:title" content="' + escapeHtml(title) + '">',
        '<meta property="og:description" content="' + escapeHtml(desc) + '">',
        '<meta property="og:url" content="' + url + '">',
        '<meta property="og:image" content="' + image + '">',
        '<meta name="twitter:card" content="summary_large_image">'
    ];
    let ssr = '';
    if (article) {
        parts.push('<script type="application/ld+json">' + jsonForScript({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title,
            description: article.summary,
            inLanguage: article.language,
            datePublished: article.publishedAt,
            image: [image],
            author: { '@type': 'Person', name: article.authorName },
            publisher: { '@type': 'Organization', name: 'VERO', url: SITE + '/' },
            mainEntityOfPage: url
        }) + '</script>');
        parts.push('<script>window.__ARTICLE__=' + jsonForScript(article) + ';</script>');
        ssr = '<article class="ssr-article"><h1>' + escapeHtml(article.title) + '</h1><p>' + escapeHtml(article.summary) + '</p>' + article.body.split(/\n{2,}/).map(p => '<p>' + escapeHtml(p) + '</p>').join('') + '</article>';
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
        const doc = await Article.findOne({ slug: req.params.slug, status: 'approved' }).populate('userId', AUTHOR_FIELDS).lean();
        if (!doc) return res.status(404).type('html').send(renderArticlesPage(null));
        res.type('html').send(renderArticlesPage(publicArticle(doc, true)));
    } catch (e) {
        res.type('html').send(renderArticlesPage(null));
    }
});

app.get('/admin', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow');
    res.sendFile(path.join(ROOT, 'admin.html'));
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
                loc: SITE + '/articles/' + encodeURIComponent(d.slug),
                lastmod: (d.publishedAt || new Date()).toISOString().slice(0, 10),
                freq: 'monthly',
                priority: '0.6'
            }));
        } catch (e) { }
    }
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls.map(u => '  <url>\n    <loc>' + escapeHtml(u.loc) + '</loc>\n    <lastmod>' + u.lastmod + '</lastmod>\n    <changefreq>' + u.freq + '</changefreq>\n    <priority>' + u.priority + '</priority>\n  </url>').join('\n') +
        '\n</urlset>';
    res.set('Cache-Control', 'public, max-age=3600');
    res.type('application/xml').send(xml);
});

app.get(['/', '/index.html'], (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(ROOT, 'index.html'));
});

app.get('/ping', (req, res) => res.status(200).send('OK'));

app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    res.status(err.status === 413 ? 413 : 400).json({ error: 'bad_request' });
});

app.use((req, res) => {
    res.status(404).type('text/plain').send('Not Found');
});

app.listen(PORT, () => {
    search.warm();
});