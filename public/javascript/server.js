const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const dns = require('dns').promises;
const net = require('net');
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
app.use(express.json({ limit: '700kb' }));

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

app.use(['/admin', '/javascript/admin.js', '/css/admin.css'], (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow');
    auth(req, res, () => {
        if (isAdmin(req.user)) return next();
        res.status(404).type('text/plain').send('Not Found');
    });
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

let dbError = '';
mongoose.connection.on('error', e => {
    dbError = String((e && e.message) || e);
    console.error('MongoDB error:', dbError);
});
mongoose.connection.on('disconnected', () => console.error('MongoDB disconnected'));

async function connectDb() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI is not set. Accounts, articles and feedback storage are disabled.');
        return;
    }
    for (; ;) {
        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, maxPoolSize: 10 });
            dbError = '';
            console.log('MongoDB connected');
            migrateUsers().catch(e => console.error('migrate failed:', e && e.message));
            return;
        } catch (e) {
            dbError = String((e && e.message) || e);
            console.error('MongoDB connection failed:', dbError);
            await new Promise(resolve => setTimeout(resolve, 15000));
        }
    }
}
connectDb();

const dbReady = () => mongoose.connection.readyState === 1;

function dbCode() {
    if (!process.env.MONGODB_URI) return 'no_uri';
    if (dbReady()) return 'db_write';
    const e = dbError;
    if (/bad auth|authentication failed/i.test(e)) return 'db_auth';
    if (/Invalid scheme|Invalid connection string|URI|escaped/i.test(e)) return 'db_uri';
    if (/Server selection timed out|ReplicaSetNoPrimary|whitelist|not authorized/i.test(e)) return 'db_network';
    if (/ENOTFOUND|querySrv|ECONNREFUSED/i.test(e)) return 'db_dns';
    return 'db_connecting';
}

function dbReason() {
    if (!process.env.MONGODB_URI) return 'MONGODB_URI is not set in the Render environment variables';
    if (dbReady()) return 'ok';
    const e = dbError;
    if (/bad auth|authentication failed/i.test(e)) return 'wrong database username or password';
    if (/Invalid scheme|Invalid connection string|URI|escaped/i.test(e)) return 'MONGODB_URI is malformed, special characters in the password must be URL-encoded';
    if (/Server selection timed out|ReplicaSetNoPrimary|whitelist|not authorized/i.test(e)) return 'Atlas is refusing Render, add 0.0.0.0/0 under Atlas Network Access';
    if (/ENOTFOUND|querySrv|ECONNREFUSED/i.test(e)) return 'the cluster address inside MONGODB_URI is wrong';
    return e ? 'connection failed, read the Render logs' : 'still connecting';
}
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', new Schema({
    topic: String,
    otherTopic: String,
    name: String,
    email: String,
    message: String,
    page: String,
    mailed: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
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
    username: { type: String, unique: true, sparse: true, index: true },
    passHash: String,
    firstName: String,
    lastName: String,
    birthDate: Date,
    age: Number,
    bio: { type: String, default: '' },
    avatarId: String,
    avatarPreset: String,
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
    likeCount: { type: Number, default: 0 },
    dislikeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    publishedAt: Date
}));

const reactionSchema = new Schema({
    articleId: { type: ObjectId, index: true },
    userId: { type: ObjectId, index: true },
    value: Number,
    createdAt: { type: Date, default: Date.now }
});
reactionSchema.index({ articleId: 1, userId: 1 }, { unique: true });
const Reaction = mongoose.models.Reaction || mongoose.model('Reaction', reactionSchema);

const Comment = mongoose.models.Comment || mongoose.model('Comment', new Schema({
    articleId: { type: ObjectId, index: true },
    userId: { type: ObjectId, index: true },
    body: String,
    createdAt: { type: Date, default: Date.now }
}));

const followSchema = new Schema({
    follower: { type: ObjectId, index: true },
    following: { type: ObjectId, index: true },
    createdAt: { type: Date, default: Date.now }
});
followSchema.index({ follower: 1, following: 1 }, { unique: true });
const Follow = mongoose.models.Follow || mongoose.model('Follow', followSchema);

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

const AVATAR_PRESETS = Array.from({ length: 12 }, (_, i) => 'nature-' + String(i + 1).padStart(2, '0'));
const RESERVED_NAMES = new Set(['admin', 'administrator', 'vero', 'veropol', 'support', 'staff', 'moderator', 'mod', 'root', 'system', 'official', 'editor', 'editors', 'help', 'press', 'security', 'null', 'undefined', 'api', 'www']);
const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
const MIN_AGE = 13;

function ageOf(birth) {
    if (!birth) return null;
    const b = new Date(birth);
    const now = new Date();
    let a = now.getUTCFullYear() - b.getUTCFullYear();
    const m = now.getUTCMonth() - b.getUTCMonth();
    if (m < 0 || (m === 0 && now.getUTCDate() < b.getUTCDate())) a--;
    return a;
}

function isMinorUser(u) {
    if (!u || !u.birthDate) return false;
    return ageOf(u.birthDate) < 18;
}

function parseBirth(b) {
    if (!b || typeof b !== 'object') return { error: 'birth' };
    const d = parseInt(b.d, 10);
    const m = parseInt(b.m, 10);
    const y = parseInt(b.y, 10);
    if (![d, m, y].every(Number.isInteger)) return { error: 'birth' };
    const now = new Date();
    if (y < now.getUTCFullYear() - 110 || y > now.getUTCFullYear()) return { error: 'birth' };
    if (m < 1 || m > 12 || d < 1 || d > 31) return { error: 'birth' };
    const date = new Date(Date.UTC(y, m - 1, d));
    if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return { error: 'birth' };
    if (date.getTime() > Date.now()) return { error: 'birth' };
    const age = ageOf(date);
    if (age > 110) return { error: 'birth' };
    if (age < MIN_AGE) return { error: 'too_young' };
    return { date, age };
}

async function migrateUsers() {
    const list = await User.find({ $or: [{ username: { $exists: false } }, { username: null }, { username: '' }] }).select('email').lean();
    for (const u of list) {
        const base = String(u.email || 'user').split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 14) || 'user';
        for (let i = 0; i < 12; i++) {
            const name = base + Math.floor(1000 + Math.random() * 9000);
            try {
                await User.updateOne({ _id: u._id }, { username: name });
                break;
            } catch (e) { }
        }
    }
}

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

function avatarUrlOf(u) {
    if (u.avatarId) return '/media/' + u.avatarId;
    if (u.avatarPreset && AVATAR_PRESETS.includes(u.avatarPreset)) return '/assets/avatars/' + u.avatarPreset + '.webp';
    return null;
}

function publicUser(u) {
    return {
        id: String(u._id),
        email: u.email,
        username: u.username || '',
        firstName: u.firstName,
        lastName: u.lastName,
        bio: u.bio || '',
        avatarUrl: avatarUrlOf(u),
        verified: !!u.verified,
        isAdmin: isAdmin(u),
        isMinor: isMinorUser(u),
        canWrite: !isMinorUser(u)
    };
}

app.get('/api/auth/username', limiter(60, 60 * 1000), async (req, res) => {
    const name = cut(req.query.u, 30).toLowerCase();
    if (!USERNAME_RE.test(name) || RESERVED_NAMES.has(name)) return res.json({ available: false, valid: false });
    if (!dbReady()) return res.status(503).json({ error: 'unavailable', code: dbCode() });
    try {
        const taken = await User.exists({ username: name });
        res.json({ available: !taken, valid: true });
    } catch (e) {
        res.status(500).json({ error: 'check' });
    }
});

app.post('/api/auth/register', limiter(8, 60 * 60 * 1000), async (req, res) => {
    const b = req.body || {};
    if (b.website) return res.status(200).json({ success: true });
    if (!dbReady()) return res.status(503).json({ error: 'unavailable', code: dbCode() });
    const email = cut(b.email, 120).toLowerCase();
    const username = cut(b.username, 30).toLowerCase();
    const password = String(b.password || '');
    const firstName = cut(b.firstName, 60);
    const lastName = cut(b.lastName, 60);
    if (!USERNAME_RE.test(username) || RESERVED_NAMES.has(username)) return res.status(400).json({ error: 'username' });
    if (!firstName || !lastName) return res.status(400).json({ error: 'identity' });
    const birth = parseBirth(b.birth);
    if (birth.error) return res.status(400).json({ error: birth.error });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'email' });
    if (password.length < 8 || password.length > 128) return res.status(400).json({ error: 'password' });
    if (b.consent !== true) return res.status(400).json({ error: 'consent' });
    let img = null;
    if (b.avatar) {
        img = decodeImage(b.avatar);
        if (!img) return res.status(400).json({ error: 'avatar' });
    }
    const preset = AVATAR_PRESETS.includes(b.avatarPreset) ? b.avatarPreset : AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)];
    try {
        if (await User.findOne({ email }).lean()) return res.status(409).json({ error: 'exists' });
        if (await User.findOne({ username }).lean()) return res.status(409).json({ error: 'username_taken' });
        const created = await User.create({
            email,
            username,
            firstName,
            lastName,
            birthDate: birth.date,
            age: birth.age,
            avatarPreset: img ? undefined : preset,
            passHash: await hashPw(password)
        });
        let doc = created.toObject();
        if (img) {
            const media = await Media.create({ owner: created._id, kind: 'avatar', contentType: img.type, data: img.buf });
            const avatarId = String(media._id);
            await User.updateOne({ _id: created._id }, { avatarId });
            doc = { ...doc, avatarId };
        }
        await startSession(req, res, created._id);
        res.json({ user: publicUser(doc) });
    } catch (e) {
        console.error('register failed:', e && e.message);
        if (e && e.code === 11000) return res.status(409).json({ error: /username/.test(String(e.message)) ? 'username_taken' : 'exists' });
        res.status(500).json({ error: 'save' });
    }
});

app.post('/api/auth/login', limiter(15, 10 * 60 * 1000), async (req, res) => {
    if (!dbReady()) return res.status(503).json({ error: 'unavailable', code: dbCode() });
    const b = req.body || {};
    const ident = cut(b.login || b.email, 120).toLowerCase().replace(/^@/, '');
    const password = String(b.password || '');
    if (!ident || !password) return res.status(401).json({ error: 'credentials' });
    try {
        const u = await User.findOne(ident.includes('@') ? { email: ident } : { username: ident }).lean();
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
        if (b.avatarId) {
            if (!isHexId(b.avatarId)) return res.status(400).json({ error: 'media' });
            const m = await Media.findOne({ _id: b.avatarId, owner: req.user._id, kind: 'avatar' }).lean();
            if (!m) return res.status(400).json({ error: 'media' });
            if (req.user.avatarId && req.user.avatarId !== b.avatarId) await Media.deleteOne({ _id: req.user.avatarId, owner: req.user._id }).catch(() => { });
            set.avatarId = b.avatarId;
        }
        if (b.avatarPreset) {
            if (!AVATAR_PRESETS.includes(b.avatarPreset)) return res.status(400).json({ error: 'media' });
            if (req.user.avatarId) await Media.deleteOne({ _id: req.user.avatarId, owner: req.user._id }).catch(() => { });
            set.avatarPreset = b.avatarPreset;
            set.avatarId = '';
        }
        if (typeof b.bio === 'string') set.bio = cut(b.bio, 160);
        const u = await User.findByIdAndUpdate(req.user._id, set, { new: true }).lean();
        res.json({ user: publicUser(u) });
    } catch (e) {
        res.status(500).json({ error: 'save' });
    }
});

async function purgeArticle(a) {
    if (a.coverId && isHexId(a.coverId)) await Media.deleteOne({ _id: a.coverId }).catch(() => { });
    await Comment.deleteMany({ articleId: a._id });
    await Reaction.deleteMany({ articleId: a._id });
    await Article.deleteOne({ _id: a._id });
}

async function unwindEngagement(userId) {
    const comments = await Comment.aggregate([{ $match: { userId } }, { $group: { _id: '$articleId', n: { $sum: 1 } } }]);
    for (const c of comments) await Article.updateOne({ _id: c._id }, { $inc: { commentCount: -c.n } });
    const reactions = await Reaction.find({ userId }).lean();
    for (const r of reactions) await Article.updateOne({ _id: r.articleId }, { $inc: r.value === 1 ? { likeCount: -1 } : { dislikeCount: -1 } });
    await Comment.deleteMany({ userId });
    await Reaction.deleteMany({ userId });
    await Follow.deleteMany({ $or: [{ follower: userId }, { following: userId }] });
}

app.delete('/api/me', requireUser, limiter(5, 60 * 60 * 1000), async (req, res) => {
    const ok = await checkPw(String((req.body && req.body.password) || ''), req.user.passHash);
    if (!ok) return res.status(401).json({ error: 'credentials' });
    try {
        const arts = await Article.find({ userId: req.user._id }).lean();
        for (const a of arts) await purgeArticle(a);
        await unwindEngagement(req.user._id);
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
        authorId: u ? String(u._id) : '',
        authorName: u ? u.firstName + ' ' + String(u.lastName || '').charAt(0).toUpperCase() + '.' : 'VERO',
        username: u ? u.username || '' : '',
        avatarUrl: u ? avatarUrlOf(u) : null,
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
        likeCount: a.likeCount || 0,
        dislikeCount: a.dislikeCount || 0,
        commentCount: a.commentCount || 0,
        ...authorOf(a)
    };
    if (full) out.body = a.body;
    return out;
}

const AUTHOR_FIELDS = 'firstName lastName username avatarId avatarPreset verified banned';

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
const Health = mongoose.models.Health || mongoose.model('Health', new Schema({ k: String, at: Date }));

app.get('/api/health/db', async (req, res) => {
    const out = {
        configured: !!process.env.MONGODB_URI,
        connected: dbReady(),
        reason: dbReason(),
        mail: process.env.RESEND_API_KEY ? 'resend' : process.env.BREVO_API_KEY ? 'brevo' : 'not configured',
        mailTo: process.env.MAIL_TO || 'veropol@proton.me',
        admins: ADMIN_EMAILS.size
    };
    if (dbReady()) {
        try {
            await Health.updateOne({ k: 'ping' }, { k: 'ping', at: new Date() }, { upsert: true });
            out.write = 'ok';
        } catch (e) {
            out.write = 'failed: ' + String((e && e.message) || e).slice(0, 140);
        }
    }
    res.json(out);
});

const imgCache = new Map();
let imgBytes = 0;
const IMG_LIMIT = 70 * 1024 * 1024;
const IMG_UA = 'Mozilla/5.0 (compatible; VEROBot/1.0; +https://veropol.onrender.com; veropol@proton.me)';

function privateAddress(ip) {
    if (net.isIPv4(ip)) {
        const p = ip.split('.').map(Number);
        return p[0] === 10 || p[0] === 127 || p[0] === 0 || (p[0] === 169 && p[1] === 254) || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) || (p[0] === 192 && p[1] === 168) || (p[0] === 100 && p[1] >= 64 && p[1] <= 127);
    }
    const v = ip.toLowerCase();
    return v === '::1' || v === '::' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe80') || v.startsWith('::ffff:');
}

async function safeHost(hostname) {
    const list = await dns.lookup(hostname, { all: true });
    return list.length > 0 && list.every(a => !privateAddress(a.address));
}

async function pullImage(u, hops) {
    const url = new URL(u);
    if (!/^https?:$/.test(url.protocol) || !(await safeHost(url.hostname))) throw new Error('blocked');
    const response = await fetch(u, {
        headers: { 'User-Agent': IMG_UA, 'Accept': 'image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8', 'Referer': url.origin + '/' },
        redirect: 'manual',
        signal: AbortSignal.timeout(10000)
    });
    if (response.status >= 300 && response.status < 400 && response.headers.get('location') && hops < 3) {
        return pullImage(new URL(response.headers.get('location'), u).toString(), hops + 1);
    }
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const type = String(response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!/^image\/(jpeg|png|webp|gif|avif)$/.test(type)) throw new Error('type');
    const len = parseInt(response.headers.get('content-length') || '0', 10);
    if (len > 6 * 1024 * 1024) throw new Error('big');
    const buf = Buffer.from(await response.arrayBuffer());
    if (buf.length < 200 || buf.length > 6 * 1024 * 1024) throw new Error('size');
    return { buf, type };
}

function remember(key, value, size) {
    imgCache.set(key, value);
    imgBytes += size;
    while (imgBytes > IMG_LIMIT && imgCache.size) {
        const k = imgCache.keys().next().value;
        const v = imgCache.get(k);
        imgBytes -= v.buf ? v.buf.length : 0;
        imgCache.delete(k);
    }
}

app.get('/img', limiter(400, 60 * 1000), async (req, res) => {
    const u = String(req.query.u || '').slice(0, 1500);
    let url;
    try { url = new URL(u); } catch (e) { return res.status(400).end(); }
    const wiki = url.hostname === 'upload.wikimedia.org' || url.hostname === 'commons.wikimedia.org';
    if (!wiki && !search.imageAllowed(u)) return res.status(403).end();
    let hit = imgCache.get(u);
    if (hit && hit.fail && hit.exp < Date.now()) {
        imgCache.delete(u);
        hit = null;
    }
    if (!hit) {
        try {
            const got = await pullImage(u, 0);
            hit = { buf: got.buf, type: got.type };
            remember(u, hit, got.buf.length);
        } catch (e) {
            remember(u, { fail: true, exp: Date.now() + 10 * 60 * 1000 }, 0);
            return res.status(502).end();
        }
    }
    if (hit.fail) return res.status(502).end();
    res.set('Content-Type', hit.type);
    res.set('Cache-Control', 'public, max-age=604800');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Content-Security-Policy', "default-src 'none'; sandbox");
    res.send(hit.buf);
});

app.get('/api/theaters', limiter(60, 60 * 1000), async (req, res) => {
    try {
        res.json(await search.theaters());
    } catch (e) {
        res.status(500).json({ error: 'theaters' });
    }
});
app.get('/api/health/feeds', (req, res) => res.json(search.feedHealth()));

const FEEDBACK_TOPICS = ['feature', 'bug', 'data', 'source', 'translation', 'press', 'other'];

async function sendMail({ subject, text, replyTo }) {
    const to = process.env.MAIL_TO || 'veropol@proton.me';
    try {
        if (process.env.RESEND_API_KEY) {
            const body = { from: process.env.MAIL_FROM || 'VERO <onboarding@resend.dev>', to: [to], subject, text };
            if (replyTo) body.reply_to = replyTo;
            const r = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(12000)
            });
            if (!r.ok) console.error('Resend failed:', r.status, await r.text().catch(() => ''));
            return r.ok;
        }
        if (process.env.BREVO_API_KEY) {
            const body = { sender: { name: 'VERO', email: process.env.MAIL_FROM || to }, to: [{ email: to }], subject, textContent: text };
            if (replyTo) body.replyTo = { email: replyTo };
            const r = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(12000)
            });
            if (!r.ok) console.error('Brevo failed:', r.status, await r.text().catch(() => ''));
            return r.ok;
        }
    } catch (e) {
        console.error('Mail failed:', e && e.message);
    }
    return false;
}

app.post('/api/feedback', limiter(6, 10 * 60 * 1000), async (req, res) => {
    const b = req.body || {};
    if (b.website) return res.status(200).json({ success: true });
    const rawTopic = cut(b.topic, 20);
    const topic = FEEDBACK_TOPICS.includes(rawTopic) ? rawTopic : 'other';
    const message = cut(b.message, 2000);
    const email = cut(b.email, 120);
    const name = cut(b.name, 80);
    const otherTopic = topic === 'other' ? cut(b.otherTopic, 80) : '';
    const page = cut(b.page, 200);
    if (message.length < 10) return res.status(400).json({ error: 'message' });
    const validEmail = email && EMAIL_RE.test(email) ? email : '';
    const lines = ['Topic: ' + topic + (otherTopic ? ' (' + otherTopic + ')' : ''), 'Name: ' + (name || '-'), 'Email: ' + (validEmail || '-'), 'Page: ' + (page || '-'), 'Time: ' + new Date().toISOString(), '', message];
    const mailed = await sendMail({ subject: '[VERO feedback] ' + topic + (otherTopic ? ': ' + otherTopic : ''), text: lines.join('\n'), replyTo: validEmail });
    let saved = false;
    if (dbReady()) {
        try {
            await new Feedback({ topic, otherTopic, name, email: validEmail, message, page, mailed }).save();
            saved = true;
        } catch (e) {
            console.error('Feedback save failed:', e && e.message);
        }
    }
    if (!saved && !mailed) {
        console.error('FEEDBACK NOT DELIVERED:', JSON.stringify({ topic, otherTopic, name, email: validEmail, page, message }));
        return res.status(503).json({ error: 'unavailable', code: dbCode() === 'db_write' ? 'mail_not_configured' : dbCode() });
    }
    res.status(200).json({ success: true });
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
        let articles = docs.filter(d => !(d.userId && d.userId.banned)).map(d => publicArticle(d, false));
        if (lang) articles = await Promise.all(articles.map(a => localizeArticle(a, lang)));
        res.json({ articles, page, totalPages: Math.max(1, Math.ceil(total / size)), total });
    } catch (e) {
        res.status(500).json({ error: 'list' });
    }
});

app.get('/api/articles/:slug', limiter(60, 60 * 1000), async (req, res) => {
    if (!dbReady()) return res.status(503).json({ error: 'unavailable', code: dbCode() });
    try {
        const doc = await Article.findOne({ slug: req.params.slug, status: 'approved' }).populate('userId', AUTHOR_FIELDS).lean();
        if (!doc) return res.status(404).json({ error: 'not_found' });
        const lang = SUPPORTED_LANGS[req.query.lang] ? req.query.lang : null;
        let item = publicArticle(doc, true);
        if (req.user) {
            const r = await Reaction.findOne({ articleId: doc._id, userId: req.user._id }).lean();
            item.myReaction = r ? r.value : 0;
        } else item.myReaction = 0;
        if (lang) item = await localizeArticle(item, lang);
        res.json({ article: item });
    } catch (e) {
        res.status(500).json({ error: 'read' });
    }
});

app.get('/api/me/articles', requireUser, async (req, res) => {
    const docs = await Article.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ articles: docs.map(d => ({ id: String(d._id), slug: d.slug, title: d.title, status: d.status, createdAt: d.createdAt, likeCount: d.likeCount || 0, commentCount: d.commentCount || 0 })) });
});

app.post('/api/articles', requireUser, limiter(8, 60 * 60 * 1000), async (req, res) => {
    const b = req.body || {};
    if (b.website) return res.status(200).json({ success: true });
    if (isMinorUser(req.user)) return res.status(403).json({ error: 'minor' });
    const x = b.article || {};
    if (b.consent !== true) return res.status(400).json({ error: 'consent' });
    const title = cut(x.title, 140);
    const summary = cut(x.summary, 320);
    const body = String(x.body || '').replace(/\r/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
    const language = SUPPORTED_LANGS[x.language] ? x.language : 'en';
    const category = ARTICLE_CATEGORIES.includes(x.category) ? x.category : 'analysis';
    if (title.length < 10 || summary.length < 40 || body.length < 600 || body.length > 20000) return res.status(400).json({ error: 'content' });
    if (!dbReady()) return res.status(503).json({ error: 'unavailable', code: dbCode() });
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

app.post('/api/articles/:id/react', requireUser, limiter(60, 10 * 60 * 1000), async (req, res) => {
    if (!isHexId(req.params.id)) return res.status(400).json({ error: 'id' });
    const value = parseInt(req.body && req.body.value, 10);
    if (![1, -1, 0].includes(value)) return res.status(400).json({ error: 'value' });
    try {
        const art = await Article.findOne({ _id: req.params.id, status: 'approved' }).lean();
        if (!art) return res.status(404).json({ error: 'not_found' });
        const prev = await Reaction.findOne({ articleId: art._id, userId: req.user._id }).lean();
        const was = prev ? prev.value : 0;
        if (was !== value) {
            const inc = {};
            if (was === 1) inc.likeCount = -1;
            if (was === -1) inc.dislikeCount = -1;
            if (value === 1) inc.likeCount = (inc.likeCount || 0) + 1;
            if (value === -1) inc.dislikeCount = (inc.dislikeCount || 0) + 1;
            if (value === 0) await Reaction.deleteOne({ _id: prev._id });
            else await Reaction.updateOne({ articleId: art._id, userId: req.user._id }, { value, createdAt: new Date() }, { upsert: true });
            await Article.updateOne({ _id: art._id }, { $inc: inc });
        }
        const fresh = await Article.findById(art._id).select('likeCount dislikeCount').lean();
        res.json({ likeCount: Math.max(0, fresh.likeCount || 0), dislikeCount: Math.max(0, fresh.dislikeCount || 0), myReaction: value });
    } catch (e) {
        res.status(500).json({ error: 'react' });
    }
});

function publicComment(c, viewer) {
    const u = c.userId && c.userId.firstName ? c.userId : null;
    return {
        id: String(c._id),
        body: c.body,
        createdAt: c.createdAt,
        username: u ? u.username || '' : '',
        name: u ? u.firstName + ' ' + String(u.lastName || '').charAt(0).toUpperCase() + '.' : 'VERO',
        avatarUrl: u ? avatarUrlOf(u) : null,
        verified: !!(u && u.verified),
        canDelete: !!viewer && (isAdmin(viewer) || (u && String(u._id) === String(viewer._id)))
    };
}

app.get('/api/articles/:id/comments', limiter(90, 60 * 1000), async (req, res) => {
    if (!isHexId(req.params.id)) return res.status(400).json({ error: 'id' });
    if (!dbReady()) return res.status(503).json({ error: 'unavailable', code: dbCode() });
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const size = 20;
    try {
        const total = await Comment.countDocuments({ articleId: req.params.id });
        const docs = await Comment.find({ articleId: req.params.id }).sort({ createdAt: -1 }).skip((page - 1) * size).limit(size).populate('userId', AUTHOR_FIELDS).lean();
        res.json({ comments: docs.filter(d => !(d.userId && d.userId.banned)).map(d => publicComment(d, req.user)), page, totalPages: Math.max(1, Math.ceil(total / size)), total });
    } catch (e) {
        res.status(500).json({ error: 'comments' });
    }
});

app.post('/api/articles/:id/comments', requireUser, limiter(20, 10 * 60 * 1000), async (req, res) => {
    if (!isHexId(req.params.id)) return res.status(400).json({ error: 'id' });
    const body = String((req.body && req.body.body) || '').replace(/\r/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, 1000);
    if (body.length < 2) return res.status(400).json({ error: 'comment' });
    try {
        const art = await Article.findOne({ _id: req.params.id, status: 'approved' }).lean();
        if (!art) return res.status(404).json({ error: 'not_found' });
        const c = await Comment.create({ articleId: art._id, userId: req.user._id, body });
        await Article.updateOne({ _id: art._id }, { $inc: { commentCount: 1 } });
        const populated = await Comment.findById(c._id).populate('userId', AUTHOR_FIELDS).lean();
        res.json({ comment: publicComment(populated, req.user) });
    } catch (e) {
        res.status(500).json({ error: 'comment' });
    }
});

app.delete('/api/comments/:id', requireUser, async (req, res) => {
    if (!isHexId(req.params.id)) return res.status(400).json({ error: 'id' });
    try {
        const c = await Comment.findById(req.params.id).lean();
        if (!c) return res.status(404).json({ error: 'not_found' });
        if (String(c.userId) !== String(req.user._id) && !isAdmin(req.user)) return res.status(403).json({ error: 'forbidden' });
        await Comment.deleteOne({ _id: c._id });
        await Article.updateOne({ _id: c.articleId }, { $inc: { commentCount: -1 } });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'delete' });
    }
});

app.get('/api/users/:username', limiter(90, 60 * 1000), async (req, res) => {
    if (!dbReady()) return res.status(503).json({ error: 'unavailable', code: dbCode() });
    const name = cut(req.params.username, 30).toLowerCase().replace(/^@/, '');
    if (!USERNAME_RE.test(name)) return res.status(404).json({ error: 'not_found' });
    try {
        const u = await User.findOne({ username: name }).lean();
        if (!u || u.banned) return res.status(404).json({ error: 'not_found' });
        const [followers, following, docs, rel] = await Promise.all([
            Follow.countDocuments({ following: u._id }),
            Follow.countDocuments({ follower: u._id }),
            Article.find({ userId: u._id, status: 'approved' }).sort({ publishedAt: -1 }).limit(60).populate('userId', AUTHOR_FIELDS).lean(),
            req.user ? Follow.exists({ follower: req.user._id, following: u._id }) : null
        ]);
        res.json({
            profile: {
                id: String(u._id),
                username: u.username,
                name: u.firstName + ' ' + String(u.lastName || '').charAt(0).toUpperCase() + '.',
                bio: u.bio || '',
                avatarUrl: avatarUrlOf(u),
                verified: !!u.verified,
                joinedAt: u.createdAt,
                followers,
                following,
                articleCount: docs.length,
                isFollowing: !!rel,
                isSelf: !!req.user && String(req.user._id) === String(u._id)
            },
            articles: docs.map(d => publicArticle(d, false))
        });
    } catch (e) {
        res.status(500).json({ error: 'profile' });
    }
});

app.post('/api/users/:username/follow', requireUser, limiter(60, 10 * 60 * 1000), async (req, res) => {
    const name = cut(req.params.username, 30).toLowerCase().replace(/^@/, '');
    const on = !(req.body && req.body.follow === false);
    try {
        const u = await User.findOne({ username: name }).lean();
        if (!u || u.banned) return res.status(404).json({ error: 'not_found' });
        if (String(u._id) === String(req.user._id)) return res.status(400).json({ error: 'self' });
        if (on) await Follow.updateOne({ follower: req.user._id, following: u._id }, { $setOnInsert: { createdAt: new Date() } }, { upsert: true });
        else await Follow.deleteOne({ follower: req.user._id, following: u._id });
        const followers = await Follow.countDocuments({ following: u._id });
        res.json({ isFollowing: on, followers });
    } catch (e) {
        res.status(500).json({ error: 'follow' });
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
            likeCount: d.likeCount || 0,
            dislikeCount: d.dislikeCount || 0,
            commentCount: d.commentCount || 0,
            author: d.userId ? {
                id: String(d.userId._id),
                name: d.userId.firstName + ' ' + d.userId.lastName,
                username: d.userId.username || '',
                email: d.userId.email,
                age: ageOf(d.userId.birthDate) !== null ? ageOf(d.userId.birthDate) : d.userId.age,
                verified: !!d.userId.verified,
                banned: !!d.userId.banned,
                avatarUrl: avatarUrlOf(d.userId)
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
    const filter = re ? { $or: [{ email: re }, { username: re }, { lastName: re }, { firstName: re }] } : {};
    const docs = await User.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ users: docs.map(u => ({ ...publicUser(u), age: ageOf(u.birthDate) !== null ? ageOf(u.birthDate) : u.age, banned: !!u.banned, createdAt: u.createdAt })) });
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

app.get('/api/admin/feedback', requireAdmin, async (req, res) => {
    const filter = req.query.unread === '1' ? { read: false } : {};
    const docs = await Feedback.find(filter).sort({ date: -1 }).limit(150).lean();
    res.json({ items: docs.map(d => ({ id: String(d._id), topic: d.topic, otherTopic: d.otherTopic, name: d.name, email: d.email, message: d.message, page: d.page, mailed: !!d.mailed, read: !!d.read, date: d.date })) });
});

app.post('/api/admin/feedback/:id', requireAdmin, async (req, res) => {
    if (!isHexId(req.params.id)) return res.status(400).json({ error: 'id' });
    await Feedback.updateOne({ _id: req.params.id }, { read: !!(req.body && req.body.read) });
    res.json({ success: true });
});

app.delete('/api/admin/feedback/:id', requireAdmin, async (req, res) => {
    if (!isHexId(req.params.id)) return res.status(400).json({ error: 'id' });
    await Feedback.deleteOne({ _id: req.params.id });
    res.json({ success: true });
});

const articlesTemplate = fs.readFileSync(path.join(ROOT, 'articles.html'), 'utf8');

function jsonForScript(value) {
    return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

function renderArticlesPage(article, override) {
    const o = override || {};
    const url = o.url || (article ? SITE + '/articles/' + encodeURIComponent(article.slug) : SITE + '/articles');
    const title = o.title || (article ? article.title + ' | VERO' : 'Articles & Analysis | VERO');
    const desc = o.desc || (article ? article.summary : 'Signed analysis and reporting from independent contributors on diplomacy, security and the global economy, published on VERO.');
    const image = o.image || (article && article.coverUrl ? SITE + article.coverUrl : SITE + '/assets/BANNER.png');
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
            author: { '@type': 'Person', name: article.authorName, url: article.username ? SITE + '/u/' + article.username : undefined },
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

app.get('/u/:username', async (req, res) => {
    res.set('Cache-Control', 'no-cache');
    const name = cut(req.params.username, 30).toLowerCase().replace(/^@/, '');
    if (!dbReady() || !USERNAME_RE.test(name)) return res.type('html').send(renderArticlesPage(null));
    try {
        const u = await User.findOne({ username: name }).lean();
        if (!u || u.banned) return res.status(404).type('html').send(renderArticlesPage(null));
        res.type('html').send(renderArticlesPage(null, {
            title: '@' + u.username + ' | VERO',
            desc: u.bio || ('Articles by @' + u.username + ' on VERO.'),
            url: SITE + '/u/' + u.username,
            image: avatarUrlOf(u) ? SITE + avatarUrlOf(u) : undefined
        }));
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
