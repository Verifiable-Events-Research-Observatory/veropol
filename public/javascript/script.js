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
        energy: 'Energy',
        humanitarian: 'Humanitarian',
        security: 'Security',
        cyber: 'Cyber & Tech',
        middleeast: 'Middle East',
        europe: 'Europe',
        asia: 'Asia-Pacific',
        africa: 'Africa',
        americas: 'Americas',
        breaking: 'Breaking News',
        fresh: 'New',
        latest: 'Latest',
        reports24: 'Reports (24h)',
        sources: 'Sources',
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
        unavailable: 'Feedback is temporarily unavailable. Please write to veropol@proton.me instead.',
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

    const picked = [...SUGGESTIONS].sort(() => 0.5 - Math.random()).slice(0, 3);

    const PAGE_SIZE = 9;
    const RECENT_KEY = 'vero_recent';
    const state = { activeQuery: '', client: null, category: 'all', range: 'all', page: 1, switching: false, booted: false };
    let requestId = 0;
    let gridMode = 'loading';
    let currentData = [];
    let lastPagination = null;
    let lastMeta = null;

    const searchInput = document.getElementById('searchInput');
    const dock = document.getElementById('searchDock');
    const dockInput = document.getElementById('dockInput');
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

    const CATMETA = {
        military: 'ph-crosshair', economy: 'ph-chart-line-up', diplomacy: 'ph-handshake', energy: 'ph-gas-pump',
        humanitarian: 'ph-first-aid-kit', security: 'ph-shield-warning', cyber: 'ph-cpu', middleeast: 'ph-mosque',
        europe: 'ph-castle-turret', asia: 'ph-buildings', africa: 'ph-compass', americas: 'ph-flag', intel: 'ph-globe'
    };

    function tagFor(item) {
        const k = item.cat && CATMETA[item.cat] ? item.cat : analyzeTag(item.title, item.description || '').key;
        return { key: k, icon: CATMETA[k] || 'ph-globe' };
    }

    function proxiedImage(url) {
        return '/img?u=' + encodeURIComponent(url);
    }

    function giveUpCover(banner, img) {
        if (img) img.remove();
        banner.classList.remove('loading');
        banner.classList.add('noimg');
        if (!banner.querySelector('.cover-fallback')) {
            const i = el('i', 'ph ph-globe-hemisphere-west cover-fallback');
            i.setAttribute('aria-hidden', 'true');
            banner.appendChild(i);
        }
    }

    function attachCover(banner, sources, index) {
        const img = new Image();
        img.alt = T('coverAlt');
        img.decoding = 'async';
        img.referrerPolicy = 'no-referrer';
        if (!sources.length) {
            giveUpCover(banner, null);
            return;
        }
        img.loading = index < 6 ? 'eager' : 'lazy';
        let step = 0;
        let timer;
        const advance = () => {
            clearTimeout(timer);
            step++;
            if (step < sources.length) load();
            else giveUpCover(banner, img);
        };
        const load = () => {
            img.src = sources[step];
            if (step < sources.length - 1) timer = setTimeout(advance, 9000);
        };
        img.onload = () => {
            clearTimeout(timer);
            if (img.naturalWidth && img.naturalWidth < 360) {
                giveUpCover(banner, img);
                return;
            }
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

    function shortDesc(item) {
        return item.description.length > 150 ? item.description.slice(0, 150) : item.description;
    }

    async function translateCards() {
        const cards = [...newsGrid.querySelectorAll('.card')];
        const jobs = [];
        cards.forEach((c, i) => {
            const it = currentData[i];
            if (it && it.lang && it.lang !== VT.lang) jobs.push({ c, it });
        });
        if (!jobs.length) return;
        const mine = requestId;
        const texts = [];
        jobs.forEach(j => {
            texts.push(j.it.title);
            if (j.it.description) texts.push(shortDesc(j.it));
        });
        await VT.load(texts, VT.lang, true);
        if (mine !== requestId) return;
        jobs.forEach(j => {
            const title = j.c.querySelector('.card-title');
            const desc = j.c.querySelector('.card-desc');
            if (title) title.textContent = VT.tx(j.it.title);
            if (desc && j.it.description) desc.textContent = VT.tx(shortDesc(j.it)) + (j.it.description.length > 150 ? '...' : '');
        });
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
            const tag = tagFor(item);
            let date = T('recentDate');
            if (item.publishedAt) {
                try {
                    date = new Date(item.publishedAt).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
                } catch (e) { }
            }
            const img = item.image;
            const invalid = !img || !img.startsWith('http') || ['generic', 'business', 'placeholder', 'logo', 'avatar', 'default', 'icon', 'stock'].some(k => img.toLowerCase().includes(k));
            const sources = invalid ? [] : [proxiedImage(img), img];
            const desc = item.description ? shortDesc(item) + (item.description.length > 150 ? '...' : '') : T('fallbackDesc');

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

    async function requestNews(page, detect) {
        const params = new URLSearchParams({
            q: state.activeQuery,
            category: state.category,
            range: state.range,
            lang: VT.lang,
            page,
            size: PAGE_SIZE
        });
        if (detect) params.set('detect', '1');
        if (state.client) {
            params.set('eng', state.client.english);
            params.set('det', state.client.detected || '');
            params.set('vars', JSON.stringify(state.client.vars || []));
        }
        const response = await fetch('/api/news?' + params);
        if (!response.ok) throw new Error('status');
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data;
    }

    async function fetchNews(opts) {
        const o = opts || {};
        const page = o.page || 1;
        const detect = !!o.detect;
        const id = ++requestId;
        if (o.q !== undefined) {
            state.activeQuery = o.q;
            state.client = null;
        }
        showMessage('loading');
        if (pagination) pagination.hidden = true;
        if (o.scroll) document.getElementById('intelligence')?.scrollIntoView({ behavior: 'smooth' });
        try {
            let data = await requestNews(page, detect);
            if (id !== requestId) return;
            if (data.needsExpansion && state.activeQuery) {
                const ex = await VT.expandBrowser(state.activeQuery);
                if (id !== requestId) return;
                if (ex) {
                    state.client = ex;
                    data = await requestNews(page, detect);
                    if (id !== requestId) return;
                }
            }
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
            translateCards();
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
        if (dockInput) dockInput.value = q;
        saveRecent(q);
        state.category = currentCategory();
        fetchNews({ q, scroll: true, detect: false });
    }

    let popupTimer;

    function hidePopup() {
        const p = document.getElementById('searchPopup');
        if (p) p.classList.remove('show');
    }

    function showPopup() {
        const bar = document.querySelector('.search-bar');
        if (bar) {
            bar.classList.remove('shake');
            void bar.offsetWidth;
            bar.classList.add('shake');
        }
        if (searchInput) searchInput.focus();
    }

    function runSearch() {
        const q = searchInput ? searchInput.value.trim() : '';
        if (!q) {
            showPopup();
            return;
        }
        hidePopup();
        saveRecent(q);
        state.category = currentCategory();
        fetchNews({ q, scroll: true, detect: true });
    }

    if (searchInput) {
        searchInput.addEventListener('input', hidePopup);
        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                runSearch();
            } else if (e.key === 'Escape') {
                searchInput.blur();
            }
        });
    }

    if (dock && dockInput && searchInput) {
        const heroBar = document.querySelector('.search-hero-container .search-bar');
        if (heroBar && 'IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
                const e = entries[0];
                dock.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0);
            }).observe(heroBar);
        }
        searchInput.addEventListener('input', () => { dockInput.value = searchInput.value; });
        dockInput.addEventListener('input', () => {
            searchInput.value = dockInput.value;
            hidePopup();
        });
        dockInput.addEventListener('keydown', e => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            if (!dockInput.value.trim()) {
                dock.classList.remove('shake');
                void dock.offsetWidth;
                dock.classList.add('shake');
                return;
            }
            runSearch();
        });
        document.getElementById('dockTrigger').addEventListener('click', () => {
            if (!dockInput.value.trim()) dockInput.focus();
            else runSearch();
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

    const THEATER_REFRESH = 5 * 60 * 1000;
    let theaterData = null;
    let theaterLoadedAt = 0;
    let theaterTitles = [];

    function renderTheaters() {
        if (!theaterData) return;
        theaterTitles = [];
        document.querySelectorAll('.theater-card[data-theater]').forEach(card => {
            const d = theaterData.theaters[card.dataset.theater];
            const box = card.querySelector('.theater-live');
            if (!box) return;
            if (!d || !d.lead) {
                box.hidden = true;
                return;
            }
            const lead = d.lead;
            box.hidden = false;
            box.href = lead.url;
            box.innerHTML = '';
            const head = el('div', 'live-head');
            const tagKey = d.tag === 'breaking' ? 'breaking' : d.tag === 'new' ? 'fresh' : 'latest';
            head.appendChild(el('span', 'live-tag ' + d.tag, T(tagKey)));
            const time = el('span', 'live-time', VT.ago(lead.publishedAt));
            time.dataset.t = lead.publishedAt;
            head.appendChild(time);
            box.appendChild(head);
            const title = el('span', 'live-title', lead.title);
            title.setAttribute('dir', 'auto');
            box.appendChild(title);
            if (lead.lang && lead.lang !== VT.lang) theaterTitles.push({ node: title, text: lead.title });
            const foot = el('div', 'live-foot');
            foot.appendChild(el('span', '', lead.source || ''));
            const go = el('span', 'go');
            go.appendChild(document.createTextNode(T('readSource') + ' '));
            go.appendChild(el('i', 'ph ph-arrow-up-right'));
            foot.appendChild(go);
            box.appendChild(foot);
            const meta = el('div', 'live-meta');
            const a = el('span', '', T('reports24') + ': ');
            a.appendChild(el('b', '', String(d.count24h)));
            const b = el('span', '', T('sources') + ': ');
            b.appendChild(el('b', '', String(d.sources24h)));
            meta.appendChild(a);
            meta.appendChild(b);
            box.appendChild(meta);
        });
    }

    async function translateTheaters() {
        const jobs = theaterTitles.slice();
        if (!jobs.length) return;
        await VT.load(jobs.map(j => j.text), VT.lang, true);
        jobs.forEach(j => {
            if (j.node.isConnected) j.node.textContent = VT.tx(j.text);
        });
    }

    async function loadTheaters() {
        try {
            const r = await fetch('/api/theaters');
            if (!r.ok) return;
            theaterData = await r.json();
            theaterLoadedAt = Date.now();
            await preload();
            renderTheaters();
            translateTheaters();
        } catch (e) { }
    }

    function tickTheaterTimes() {
        document.querySelectorAll('.live-time[data-t]').forEach(n => { n.textContent = VT.ago(n.dataset.t); });
    }

    setInterval(() => {
        if (!document.hidden) loadTheaters();
    }, THEATER_REFRESH);
    setInterval(tickTheaterTimes, 60000);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && Date.now() - theaterLoadedAt > THEATER_REFRESH) loadTheaters();
    });

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
                        topic: topic ? topic.value : 'other',
                        otherTopic: document.getElementById('otherTopic').value,
                        name: document.getElementById('fbName').value,
                        email,
                        message,
                        website: document.getElementById('fbWebsite').value,
                        page: location.pathname
                    })
                });
                if (r.status === 503) {
                    let info = {};
                    try { info = await r.json(); } catch (z) { }
                    fail(T('unavailable') + (info.code ? ' (' + info.code + ')' : ''));
                }
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
        renderTheaters();
        translateTheaters();
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
        loadTheaters();
        fetchNews({ q: '' });
    });
})();
