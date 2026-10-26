const UA = 'VEROBot/1.0 (https://veropol.onrender.com; veropol@proton.me)';
const API = 'https://commons.wikimedia.org/w/api.php';
const TTL = 12 * 3600 * 1000;
const MISS_TTL = 20 * 60 * 1000;

const THEATER_TERMS = {
    ukraine: ['Ukraine war', 'Ukraine'],
    mideast: ['Israel', 'Middle East'],
    yemen: ['Houthi', 'Red Sea', 'Yemen'],
    taiwan: ['Taiwan Strait', 'Taiwan'],
    brics: ['BRICS summit', 'BRICS'],
    korea: ['North Korea', 'Korean Peninsula'],
    sahel: ['Sahel', 'Niger']
};

const TOPICS = [
    [/drone/i, 'drone'],
    [/missile|rocket/i, 'missile'],
    [/typhoon|storm|hurricane|flood/i, 'typhoon'],
    [/tanker|oil|crude/i, 'oil tanker'],
    [/protest|rally|demonstrat/i, 'protest'],
    [/election|vote|ballot/i, 'election'],
    [/summit|talks|negotiat|diplomat/i, 'summit'],
    [/ceasefire|truce/i, 'ceasefire'],
    [/navy|naval|warship|destroyer|carrier|fleet/i, 'warship'],
    [/troops|soldier|army|military/i, 'soldiers'],
    [/airport|flight/i, 'airport'],
    [/refugee|humanitarian|aid/i, 'humanitarian aid'],
    [/earthquake/i, 'earthquake'],
    [/strike|attack|bomb|explosion/i, 'airstrike'],
    [/border|bridge/i, 'border']
];

const STOP = new Set(['the', 'why', 'how', 'what', 'who', 'when', 'where', 'is', 'are', 'was', 'were', 'will', 'would', 'could', 'after', 'over', 'with', 'from', 'into', 'amid', 'says', 'said', 'new', 'and', 'for', 'its', 'his', 'her', 'this', 'that', 'ahead', 'before', 'than', 'but', 'not', 'war', 'news', 'live', 'update', 'breaking', 'report', 'reports', 'three', 'two', 'four', 'five', 'first', 'days', 'day', 'week', 'year', 'years']);
const BAD_TITLE = /logo|flag|map\b|coat of arms|emblem|diagram|chart|poster|screenshot|icon|portrait|stamp|cartoon|banknote|graph|wikimania|infographic|locator|collage|signature|\.svg|book cover|album|tournament|football|soccer|olympic|concert|cosplay/i;

const cache = new Map();
const inflight = new Map();
const recent = {};

function entities(title) {
    const words = String(title || '').replace(/[“”"':;,.!?()\[\]–—|/]/g, ' ').split(/\s+/).filter(Boolean);
    const out = [];
    words.forEach(w => {
        if (w.length < 4 || !/^[A-Z][A-Za-z-]+$/.test(w)) return;
        if (STOP.has(w.toLowerCase())) return;
        out.push(w);
    });
    return [...new Set(out)];
}

function topicOf(title) {
    for (const [re, name] of TOPICS) if (re.test(title)) return name;
    return '';
}

function buildQueries(id, title) {
    const terms = THEATER_TERMS[id] || [];
    const ents = entities(title).filter(e => !terms.some(t => t.toLowerCase().includes(e.toLowerCase())));
    const topic = topicOf(title);
    const qs = [];
    if (ents.length >= 2) qs.push(ents.slice(0, 3).join(' '));
    if (ents.length) qs.push(ents[0] + ' ' + (topic && topic.toLowerCase() !== ents[0].toLowerCase() ? topic : terms[0] || ''));
    if (terms[0] && topic) qs.push(terms[0] + ' ' + topic);
    if (terms[1] && topic) qs.push(terms[1] + ' ' + topic);
    if (terms[0]) qs.push(terms[0]);
    if (terms[1]) qs.push(terms[1]);
    return [...new Set(qs.map(q => q.trim()).filter(Boolean))];
}

function clean(v) {
    return String(v || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

async function search(q) {
    const url = API + '?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=30&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap') +
        '&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1280&iiextmetadatafilter=Artist|LicenseShortName|ImageDescription|DateTimeOriginal|Categories';
    const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' }, signal: AbortSignal.timeout(5000) });
    if (!r.ok) return [];
    const d = await r.json();
    const pages = d && d.query && d.query.pages ? Object.values(d.query.pages) : [];
    return pages;
}

function pick(pages, q, id) {
    const tokens = q.toLowerCase().split(/\s+/).filter(t => t.length >= 3);
    const year = new Date().getFullYear();
    const used = recent[id] || [];
    const scored = [];
    for (const p of pages) {
        const ii = p.imageinfo && p.imageinfo[0];
        if (!ii || !ii.thumburl) continue;
        if (ii.mime !== 'image/jpeg') continue;
        if (ii.width < 1400 || ii.height < 800) continue;
        const ratio = ii.width / ii.height;
        if (ratio < 1.25 || ratio > 2.3) continue;
        if (BAD_TITLE.test(p.title || '')) continue;
        const meta = ii.extmetadata || {};
        const hay = ((p.title || '') + ' ' + clean(meta.ImageDescription && meta.ImageDescription.value) + ' ' + clean(meta.Categories && meta.Categories.value)).toLowerCase();
        const matches = tokens.filter(t => hay.includes(t)).length;
        if (!matches) continue;
        const y = parseInt(String((meta.DateTimeOriginal && meta.DateTimeOriginal.value) || '').slice(0, 4), 10);
        const recency = y >= year - 2 ? 3 : y >= year - 6 ? 2 : y >= 2010 ? 1 : 0;
        scored.push({
            score: matches * 3 + recency + Math.min(ii.width / 4000, 1),
            url: ii.thumburl,
            page: ii.descriptionurl || '',
            credit: clean(meta.Artist && meta.Artist.value).slice(0, 48),
            license: clean(meta.LicenseShortName && meta.LicenseShortName.value).slice(0, 24)
        });
    }
    scored.sort((a, b) => b.score - a.score);
    const fresh = scored.find(x => !used.includes(x.url));
    return fresh || (scored.length ? scored[scored.length - 1] : null);
}

async function compute(id, title) {
    const queries = buildQueries(id, title);
    for (const q of queries) {
        try {
            const pages = await search(q);
            const chosen = pick(pages, q, id);
            if (chosen) {
                recent[id] = (recent[id] || []).concat(chosen.url).slice(-24);
                return { url: chosen.url, page: chosen.page, credit: chosen.credit, license: chosen.license };
            }
        } catch (e) { }
    }
    return null;
}

function resolve(id, title) {
    const key = id + '|' + title;
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < (hit.val ? TTL : MISS_TTL)) return Promise.resolve(hit.val);
    if (inflight.has(key)) return inflight.get(key);
    const job = compute(id, title).then(val => {
        if (cache.size > 300) cache.clear();
        cache.set(key, { at: Date.now(), val });
        return val;
    }).finally(() => { inflight.delete(key); });
    inflight.set(key, job);
    return job;
}

module.exports = { resolve, buildQueries };
