(function () {
    const TXT = {
        loading: 'Scanning verified sources...',
        empty: 'No verified reports found for this search. Try another term or timeframe.',
        error: 'The connection to the intelligence feed failed. Please try again.',
        readSource: 'Read at source',
        untitled: 'Untitled report',
        fallbackDesc: 'Open the source to read the full report.',
        recentDate: 'Recent',
        military: 'Military',
        economy: 'Economy',
        diplomacy: 'Diplomacy',
        intel: 'Intelligence',
        goTo: 'Go to',
        goToAria: 'Go to page',
        recent: 'Recent',
        clearRecent: 'Clear recent searches',
        prev: 'Previous page',
        next: 'Next page',
        coverAlt: 'Report cover image',
        greetMorning: 'Good morning, strategist.',
        greetAfternoon: 'Good afternoon, strategist.',
        greetEvening: 'Good evening, strategist.',
        sending: 'Sending...',
        sent: 'Thank you. Your feedback was sent.',
        failed: 'Something went wrong. Please try again.',
        unavailable: 'Feedback is temporarily unavailable. Please email us instead.',
        needTopic: 'Please choose a topic.',
        needMessage: 'Please write at least 10 characters.',
        badEmail: 'Please enter a valid email address.',
        send: 'Send feedback'
    };

    const SUGGESTIONS = [
        { label: 'Taiwan Strait', q: 'Taiwan Strait' },
        { label: 'BRICS', q: 'BRICS' },
        { label: 'Nuclear deterrence', q: 'Nuclear Deterrence' },
        { label: 'OPEC+', q: 'OPEC+' },
        { label: 'NATO expansion', q: 'NATO Expansion' },
        { label: 'Sahel juntas', q: 'Sahel Juntas' },
        { label: 'Cyber warfare', q: 'Cyber Warfare' },
        { label: 'Red Sea security', q: 'Red Sea Security' },
        { label: 'UN Security Council', q: 'UN Security Council' }
    ];

    const DEFAULT_TOPICS = ['geopolitics', 'global defense', 'international diplomacy', 'sanctions policy', 'global security', 'strategic alliance'];
    const picked = [...SUGGESTIONS].sort(() => 0.5 - Math.random()).slice(0, 3);
    const defaultTopic = DEFAULT_TOPICS[Math.floor(Math.random() * DEFAULT_TOPICS.length)];

    const WM = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';
    const coverFallbacks = {
        military: WM + 'b/b2/USS_Gerald_R._Ford_%28CVN-78%29_underway_on_8_April_2017.JPG/960px-USS_Gerald_R._Ford_%28CVN-78%29_underway_on_8_April_2017.JPG',
        economy: WM + 'd/df/Pudong_Shanghai_November_2017_panorama.jpg/960px-Pudong_Shanghai_November_2017_panorama.jpg',
        diplomacy: WM + '4/4e/P5%2B1_negotiation_hall_in_Geneva%2C_2013.jpg/960px-P5%2B1_negotiation_hall_in_Geneva%2C_2013.jpg',
        intel: WM + '0/08/NASA_Visible_Earth_satellite_map_of_Earth.jpg/960px-NASA_Visible_Earth_satellite_map_of_Earth.jpg'
    };

    const PAGE_SIZE = 9;
    const RECENT_KEY = 'vero_recent';
    const state = { activeQuery: defaultTopic, category: 'all', range: 'all', page: 1, switching: false, booted: false };
    let requestId = 0;
    let gridMode = 'loading';
    let currentData = [];
    let lastPagination = null;
    let lastMeta = null;

    const searchInput = document.getElementById('searchInput');
    const newsGrid = document.getElementById('newsGrid');
    const pagination = document.getElementById('pagination');
    const resultsMeta = document.getElementById('resultsMeta');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const rangeBtns = document.querySelectorAll('.range-btn');

    const T = key => VT.s(TXT[key]);
    const preload = () => VT.load(Object.values(TXT).concat(SUGGESTIONS.map(s => s.label)));

    function setGreeting() {
        const el = document.getElementById('greetingHeader');
        if (!el) return;
        const hour = new Date().getHours();
        const key = hour >= 5 && hour < 12 ? 'greetMorning' : hour >= 12 && hour < 18 ? 'greetAfternoon' : 'greetEvening';
        el._en = TXT[key];
        el.textContent = T(key);
    }

    function loadSuggestions() {
        const el = document.getElementById('searchSuggestions');
        if (!el) return;
        el.innerHTML = '';
        picked.forEach(item => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'suggestion-pill';
            b.textContent = VT.s(item.label);
            b.addEventListener('click', () => quickFetch(item.q));
            el.appendChild(b);
        });
    }

    function getRecent() {
        try {
            return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function renderRecent() {
        const el = document.getElementById('recentSearches');
        if (!el) return;
        el.innerHTML = '';
        const list = getRecent();
        if (!list.length) return;
        const label = document.createElement('span');
        label.className = 'recent-label';
        label.textContent = T('recent');
        el.appendChild(label);
        list.forEach(term => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'suggestion-pill recent-pill';
            b.textContent = term;
            b.addEventListener('click', () => {
                if (searchInput) searchInput.value = term;
                runSearch();
            });
            el.appendChild(b);
        });
        const clear = document.createElement('button');
        clear.type = 'button';
        clear.className = 'recent-clear';
        clear.setAttribute('aria-label', T('clearRecent'));
        clear.innerHTML = '&times;';
        clear.addEventListener('click', () => {
            try { localStorage.removeItem(RECENT_KEY); } catch (e) { }
            renderRecent();
        });
        el.appendChild(clear);
    }

    function saveRecent(term) {
        const clean = (term || '').trim();
        if (!clean) return;
        const list = [clean, ...getRecent().filter(x => x.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
        try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch (e) { return; }
        renderRecent();
    }

    function analyzeTag(title, desc) {
        const c = (title + ' ' + (desc || '')).toLowerCase();
        if (/war|military|defense|defence|troops|weapon|missile|navy|army|conflict|strike|fighter|artillery|drone|escalation|nuclear|pentagon|nato|rebel|junta|combat|tactical/.test(c)) return { key: 'military', icon: 'ph-crosshair' };
        if (/economy|market|bank|trade|inflation|sanction|currency|brics|stocks|tariff|financial|oil|gas|export|import|gdp|invest/.test(c)) return { key: 'economy', icon: 'ph-chart-line-up' };
        if (/president|minister|diplomat|summit|embassy|treaty|council|policy|envoy|talks|pact|diplomacy|ambassador|geopolitics|alliance/.test(c)) return { key: 'diplomacy', icon: 'ph-handshake' };
        return { key: 'intel', icon: 'ph-globe' };
    }

    function proxiedImage(url) {
        return 'https://wsrv.nl/?url=' + encodeURIComponent(url) + '&w=720&h=400&fit=cover&a=attention&output=webp&q=78';
    }

    function attachCover(banner, sources, index) {
        const img = new Image();
        img.alt = T('coverAlt');
        img.decoding = 'async';
        img.referrerPolicy = 'no-referrer';
        img.loading = index < 6 ? 'eager' : 'lazy';
        let step = 0;
        let timer;
        const advance = () => {
            clearTimeout(timer);
            step++;
            if (step < sources.length) load();
            else {
                img.remove();
                banner.classList.remove('loading');
            }
        };
        const load = () => {
            img.src = sources[step];
            if (step < sources.length - 1) timer = setTimeout(advance, 4500);
        };
        img.onload = () => {
            clearTimeout(timer);
            img.classList.add('ready');
            banner.classList.remove('loading');
        };
        img.onerror = advance;
        banner.appendChild(img);
        load();
    }

    function showMessage(mode) {
        gridMode = mode;
        const p = document.createElement('p');
        p.className = 'grid-msg' + (mode === 'error' ? ' error' : '');
        if (mode === 'loading') {
            const i = document.createElement('i');
            i.className = 'ph ph-spinner ph-spin';
            p.appendChild(i);
            p.appendChild(document.createTextNode(' ' + T('loading')));
        } else {
            p.textContent = T(mode === 'error' ? 'error' : 'empty');
        }
        newsGrid.innerHTML = '';
        newsGrid.appendChild(p);
    }

    function el(tag, cls, text) {
        const node = document.createElement(tag);
        if (cls) node.className = cls;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function renderCards(data) {
        newsGrid.innerHTML = '';
        if (!data || !data.length) {
            showMessage('empty');
            return;
        }
        gridMode = 'cards';
        const locale = VT.LANGS[VT.lang].locale;
        data.forEach((item, index) => {
            const card = document.createElement('a');
            card.className = 'card';
            card.href = item.url && item.url.startsWith('http') ? item.url : '#';
            card.target = '_blank';
            card.rel = 'noopener noreferrer';

            const title = item.title === 'Untitled Report' ? T('untitled') : item.title;
            const tag = analyzeTag(item.title, item.description || '');
            let date = T('recentDate');
            if (item.publishedAt) {
                try {
                    date = new Date(item.publishedAt).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
                } catch (e) { }
            }
            const img = item.image;
            const invalid = !img || !img.startsWith('http') || ['generic', 'business', 'placeholder', 'logo', 'avatar', 'default', 'icon', 'stock'].some(k => img.toLowerCase().includes(k));
            const sources = invalid ? [coverFallbacks[tag.key]] : [proxiedImage(img), img, coverFallbacks[tag.key]];
            const desc = item.description ? (item.description.length > 150 ? item.description.slice(0, 150) + '...' : item.description) : T('fallbackDesc');

            const banner = el('div', 'card-banner loading');
            const tagEl = el('div', 'card-tag');
            const tagIcon = el('i', 'ph ' + tag.icon);
            tagEl.appendChild(tagIcon);
            tagEl.appendChild(document.createTextNode(' ' + T(tag.key)));
            banner.appendChild(tagEl);

            const content = el('div', 'card-content');
            content.appendChild(el('span', 'card-date', date));
            const h = el('h3', 'card-title', title);
            h.setAttribute('dir', 'auto');
            content.appendChild(h);
            const d = el('p', 'card-desc', desc);
            d.setAttribute('dir', 'auto');
            content.appendChild(d);

            const footer = el('div', 'card-footer');
            const src = el('div', 'source-info');
            src.appendChild(el('i', 'ph ph-newspaper-clipping'));
            src.appendChild(el('span', '', item.source || ''));
            const more = el('div', 'read-more');
            more.appendChild(document.createTextNode(T('readSource') + ' '));
            more.appendChild(el('i', 'ph ph-arrow-up-right'));
            footer.appendChild(src);
            footer.appendChild(more);
            content.appendChild(footer);

            card.appendChild(banner);
            card.appendChild(content);
            newsGrid.appendChild(card);
            attachCover(banner, sources, index);
        });
    }

    function pageSequence(current, total) {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        const pages = [...new Set([1, 2, current - 1, current, current + 1, total - 1, total])].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
        const out = [];
        pages.forEach((p, i) => {
            if (i > 0 && p - pages[i - 1] > 1) out.push('gap');
            out.push(p);
        });
        return out;
    }

    function renderPagination(page, totalPages) {
        lastPagination = { page, totalPages };
        if (!pagination) return;
        if (totalPages <= 1) {
            pagination.hidden = true;
            pagination.innerHTML = '';
            return;
        }
        const numbers = pageSequence(page, totalPages).map(p => p === 'gap'
            ? '<span class="page-gap">&hellip;</span>'
            : '<button type="button" class="page-num' + (p === page ? ' active' : '') + '" data-page="' + p + '"' + (p === page ? ' aria-current="page"' : '') + '>' + p + '</button>'
        ).join('');
        pagination.innerHTML =
            '<button type="button" class="page-arrow" data-page="' + (page - 1) + '" aria-label="' + T('prev') + '"' + (page <= 1 ? ' disabled' : '') + '><i class="ph ph-caret-left"></i></button>' +
            '<div class="page-center"><div class="page-numbers">' + numbers + '</div>' +
            '<label class="page-jump">' + T('goTo') + ' <input type="text" id="pageJump" inputmode="numeric" maxlength="3" placeholder="' + page + '" aria-label="' + T('goToAria') + '" autocomplete="off"><span>/ ' + totalPages + '</span></label></div>' +
            '<button type="button" class="page-arrow" data-page="' + (page + 1) + '" aria-label="' + T('next') + '"' + (page >= totalPages ? ' disabled' : '') + '><i class="ph ph-caret-right"></i></button>';
        pagination.hidden = false;
        pagination.dataset.total = totalPages;
        if (document.documentElement.dir === 'rtl') pagination.querySelectorAll('.page-arrow i').forEach(i => { i.style.transform = 'scaleX(-1)'; });
    }

    async function renderMeta() {
        if (!resultsMeta) return;
        if (!lastMeta) {
            resultsMeta.textContent = '';
            return;
        }
        const start = (lastMeta.page - 1) * PAGE_SIZE + 1;
        const end = Math.min(lastMeta.page * PAGE_SIZE, lastMeta.total);
        resultsMeta.textContent = await VT.t('Showing ' + start + '-' + end + ' of ' + lastMeta.total + ' reports');
    }

    async function fetchNews(opts) {
        const o = opts || {};
        const page = o.page || 1;
        const detect = !!o.detect;
        const id = ++requestId;
        if (o.q !== undefined) state.activeQuery = o.q;
        showMessage('loading');
        if (pagination) pagination.hidden = true;
        if (o.scroll) document.getElementById('intelligence')?.scrollIntoView({ behavior: 'smooth' });
        try {
            const params = new URLSearchParams({
                q: state.activeQuery,
                category: state.category,
                range: state.range,
                lang: VT.lang,
                page,
                size: PAGE_SIZE
            });
            if (detect) params.set('detect', '1');
            const response = await fetch('/api/news?' + params);
            if (!response.ok) throw new Error('status');
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            if (id !== requestId) return;

            if (detect && data.lang && data.lang !== VT.lang) {
                state.switching = true;
                const name = VT.LANGS[data.lang].name;
                await VT.setLang(data.lang);
                state.switching = false;
                if (id !== requestId) return;
                VT.t('Language switched to ' + name + ' to match your search').then(msg => VT.toast(msg));
            }
            await preload();

            state.page = data.page || 1;
            currentData = data.articles || [];
            renderCards(currentData);
            renderPagination(state.page, data.totalPages || 1);
            lastMeta = data.total ? { page: state.page, total: data.total } : null;
            renderMeta();
        } catch (e) {
            state.switching = false;
            if (id !== requestId) return;
            lastMeta = null;
            lastPagination = null;
            renderMeta();
            showMessage('error');
        }
    }

    function currentCategory() {
        return document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    }

    function quickFetch(q) {
        if (searchInput) searchInput.value = q;
        saveRecent(q);
        state.category = currentCategory();
        fetchNews({ q, scroll: true, detect: false });
    }

    function runSearch() {
        const q = searchInput ? searchInput.value.trim() : '';
        saveRecent(q);
        state.category = currentCategory();
        fetchNews({ q: q || defaultTopic, scroll: true, detect: !!q });
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                runSearch();
            } else if (e.key === 'Escape') {
                searchInput.blur();
            }
        });
    }

    const trigger = document.getElementById('searchTrigger');
    if (trigger) trigger.addEventListener('click', runSearch);

    document.querySelectorAll('[data-quick]').forEach(btn => {
        btn.addEventListener('click', () => quickFetch(btn.dataset.quick));
    });

    document.addEventListener('keydown', e => {
        if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (searchInput) searchInput.focus();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            state.category = e.currentTarget.dataset.filter;
            fetchNews({ page: 1 });
        });
    });

    rangeBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            rangeBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            state.range = e.currentTarget.dataset.range;
            fetchNews({ page: 1 });
        });
    });

    if (pagination) {
        pagination.addEventListener('click', e => {
            const btn = e.target.closest('[data-page]');
            if (!btn || btn.disabled) return;
            const p = parseInt(btn.dataset.page, 10);
            if (p && p !== state.page) fetchNews({ page: p, scroll: true });
        });
        pagination.addEventListener('input', e => {
            if (e.target.id === 'pageJump') e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
        });
        pagination.addEventListener('keydown', e => {
            if (e.target.id !== 'pageJump' || e.key !== 'Enter') return;
            e.preventDefault();
            const total = parseInt(pagination.dataset.total, 10) || 1;
            const v = parseInt(e.target.value, 10);
            if (v) fetchNews({ page: Math.min(Math.max(v, 1), total), scroll: true });
        });
    }

    const form = document.getElementById('feedbackForm');
    if (form) {
        const otherWrap = document.getElementById('otherWrap');
        const msg = document.getElementById('fbMessage');
        const count = document.getElementById('fbCount');
        const err = document.getElementById('fbError');
        const submit = form.querySelector('.btn-submit');
        const submitLabel = submit.querySelector('span');

        form.querySelectorAll('input[name="topic"]').forEach(r => {
            r.addEventListener('change', () => otherWrap.classList.toggle('hidden', r.value !== 'other' || !r.checked));
        });
        msg.addEventListener('input', () => { count.textContent = msg.value.length + ' / 2000'; });

        const fail = text => {
            err.textContent = text;
            err.hidden = false;
        };

        form.addEventListener('submit', async e => {
            e.preventDefault();
            err.hidden = true;
            await preload();
            const topic = form.querySelector('input[name="topic"]:checked');
            const email = document.getElementById('fbEmail').value.trim();
            const message = msg.value.trim();
            if (!topic) return fail(T('needTopic'));
            if (message.length < 10) return fail(T('needMessage'));
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail(T('badEmail'));

            submit.disabled = true;
            submitLabel.removeAttribute('data-tr');
            submitLabel.textContent = T('sending');
            try {
                const r = await fetch('/api/feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        topic: topic.value,
                        otherTopic: document.getElementById('otherTopic').value,
                        name: document.getElementById('fbName').value,
                        email,
                        message,
                        website: document.getElementById('fbWebsite').value,
                        page: location.pathname
                    })
                });
                if (r.status === 503) fail(T('unavailable'));
                else if (!r.ok) fail(T('failed'));
                else {
                    VT.toast(T('sent'), 'ph-check-circle');
                    form.reset();
                    otherWrap.classList.add('hidden');
                    count.textContent = '0 / 2000';
                }
            } catch (x) {
                fail(T('failed'));
            }
            submit.disabled = false;
            submitLabel.setAttribute('data-tr', '');
            submitLabel.textContent = VT.s(submitLabel._en || TXT.send);
        });
    }

    window.addEventListener('vero:lang', async () => {
        if (!state.booted || state.switching) return;
        await preload();
        setGreeting();
        loadSuggestions();
        renderRecent();
        if (lastPagination) renderPagination(lastPagination.page, lastPagination.totalPages);
        fetchNews({ page: state.page });
    });

    VT.ready.then(async () => {
        await preload();
        setGreeting();
        loadSuggestions();
        renderRecent();
        setInterval(setGreeting, 60000);
        state.booted = true;
        fetchNews({ q: defaultTopic });
    });
})();
