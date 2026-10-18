(function () {
    const TXT = {
        loading: 'Loading articles...',
        empty: 'No articles have been published here yet. Be the first to contribute.',
        error: 'Articles could not be loaded. Please try again.',
        notFound: 'This article could not be found.',
        prev: 'Previous page',
        next: 'Next page',
        showOriginal: 'Show original',
        showTranslation: 'Show translation',
        copied: 'Link copied to clipboard.',
        share: 'Share',
        needName: 'Please enter your first and last name.',
        needAge: 'Please enter your age.',
        minor: 'You must be 18 or older to contribute.',
        badEmail: 'Please enter a valid email address.',
        needCountry: 'Please enter your nationality and country of residence.',
        needTitle: 'The headline needs at least 10 characters.',
        needSummary: 'The summary needs at least 40 characters.',
        needBody: 'The article needs at least 600 characters.',
        needConsent: 'Please tick all three confirmations.',
        tooMany: 'Too many submissions. Please try again later.',
        unavailable: 'Submissions are temporarily unavailable. Please try again later.',
        failed: 'Something went wrong. Please check your details and try again.',
        sending: 'Sending...',
        submitLabel: 'Submit for review',
        Diplomacy: 'Diplomacy',
        Military: 'Military',
        Economy: 'Economy',
        Regional: 'Regional',
        Analysis: 'Analysis',
        Opinion: 'Opinion'
    };

    const CAT_ICONS = { diplomacy: 'ph-handshake', military: 'ph-crosshair', economy: 'ph-chart-line-up', regional: 'ph-map-trifold', analysis: 'ph-magnifying-glass', opinion: 'ph-chat-teardrop-text' };
    const CAT_LABEL = { diplomacy: 'Diplomacy', military: 'Military', economy: 'Economy', regional: 'Regional', analysis: 'Analysis', opinion: 'Opinion' };
    const DRAFT_KEY = 'vero_draft';

    const views = { list: document.getElementById('view-list'), read: document.getElementById('view-read'), write: document.getElementById('view-write') };
    const grid = document.getElementById('articlesGrid');
    const pager = document.getElementById('artPagination');
    const state = { view: 'list', cat: 'all', page: 1, step: 1, booted: false };
    const read = { slug: null, original: null, translated: null, showing: 'original' };
    let listId = 0;

    const T = key => VT.s(TXT[key]);
    const preload = () => VT.load(Object.values(TXT));
    const $ = id => document.getElementById(id);

    function show(name) {
        state.view = name;
        Object.keys(views).forEach(k => { views[k].hidden = k !== name; });
        window.scrollTo({ top: 0 });
    }

    function node(tag, cls, text) {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text !== undefined) n.textContent = text;
        return n;
    }

    function fmtDate(iso) {
        if (!iso) return '';
        try {
            return new Date(iso).toLocaleDateString(VT.LANGS[VT.lang].locale, { month: 'long', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return '';
        }
    }

    function go(path) {
        history.pushState(null, '', path);
        route();
    }

    function message(cls, icon, text) {
        grid.innerHTML = '';
        const p = node('div', cls);
        if (icon) p.appendChild(node('i', 'ph ' + icon));
        p.appendChild(document.createTextNode(text));
        grid.appendChild(p);
    }

    async function loadList() {
        const id = ++listId;
        show('list');
        await preload();
        message('grid-msg', 'ph-spinner ph-spin', ' ' + T('loading'));
        pager.hidden = true;
        try {
            const params = new URLSearchParams({ page: state.page, size: 9, lang: VT.lang });
            if (state.cat !== 'all') params.set('category', state.cat);
            const r = await fetch('/api/articles?' + params);
            if (!r.ok) throw new Error('status');
            const d = await r.json();
            if (id !== listId) return;
            const items = d.articles || [];
            const mins = [...new Set(items.map(a => a.readMinutes || 1))];
            await VT.load(mins.map(m => m + ' min read'));
            if (!items.length) {
                message('empty-art', 'ph-newspaper', T('empty'));
                return;
            }
            grid.innerHTML = '';
            items.forEach(a => {
                const card = document.createElement('a');
                card.className = 'card art-card';
                card.dataset.cat = a.category;
                card.href = '/articles/' + encodeURIComponent(a.slug);
                card.addEventListener('click', e => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                    e.preventDefault();
                    go(card.getAttribute('href'));
                });
                const top = node('div', 'art-top');
                const tag = node('div', 'card-tag');
                tag.appendChild(node('i', 'ph ' + (CAT_ICONS[a.category] || 'ph-globe')));
                tag.appendChild(document.createTextNode(' ' + VT.s(CAT_LABEL[a.category] || 'Analysis')));
                top.appendChild(tag);
                top.appendChild(node('span', 'lang-badge', (a.language || 'en').toUpperCase()));
                const content = node('div', 'card-content');
                content.appendChild(node('span', 'card-date', fmtDate(a.publishedAt)));
                const h = node('h3', 'card-title', a.title);
                h.setAttribute('dir', 'auto');
                const s = node('p', 'card-desc', a.summary);
                s.setAttribute('dir', 'auto');
                content.appendChild(h);
                content.appendChild(s);
                const foot = node('div', 'card-footer');
                const by = node('div', 'art-by');
                by.appendChild(node('span', 'avatar', (a.authorName || '?').charAt(0).toUpperCase()));
                by.appendChild(node('span', '', a.authorName + ' · ' + a.nationality));
                const more = node('div', 'read-more', VT.s((a.readMinutes || 1) + ' min read'));
                foot.appendChild(by);
                foot.appendChild(more);
                content.appendChild(foot);
                card.appendChild(top);
                card.appendChild(content);
                grid.appendChild(card);
            });
            renderPager(d.page || 1, d.totalPages || 1);
        } catch (e) {
            if (id !== listId) return;
            message('grid-msg error', '', T('error'));
        }
    }

    function renderPager(page, total) {
        if (total <= 1) {
            pager.hidden = true;
            pager.innerHTML = '';
            return;
        }
        pager.innerHTML =
            '<button type="button" class="page-arrow" data-page="' + (page - 1) + '" aria-label="' + T('prev') + '"' + (page <= 1 ? ' disabled' : '') + '><i class="ph ph-caret-left"></i></button>' +
            '<div class="page-center"><div class="page-numbers"><span class="page-num active">' + page + ' / ' + total + '</span></div></div>' +
            '<button type="button" class="page-arrow" data-page="' + (page + 1) + '" aria-label="' + T('next') + '"' + (page >= total ? ' disabled' : '') + '><i class="ph ph-caret-right"></i></button>';
        pager.hidden = false;
        if (document.documentElement.dir === 'rtl') pager.querySelectorAll('.page-arrow i').forEach(i => { i.style.transform = 'scaleX(-1)'; });
    }

    pager.addEventListener('click', e => {
        const b = e.target.closest('[data-page]');
        if (!b || b.disabled) return;
        state.page = parseInt(b.dataset.page, 10);
        loadList();
    });

    document.querySelectorAll('#catFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#catFilters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.cat = btn.dataset.cat;
            state.page = 1;
            loadList();
        });
    });

    async function paintArticle(which) {
        const a = which === 'translated' && read.translated ? read.translated : read.original;
        read.showing = a === read.translated ? 'translated' : 'original';
        const tag = $('rdTag');
        tag.innerHTML = '';
        tag.appendChild(node('i', 'ph ' + (CAT_ICONS[a.category] || 'ph-globe')));
        tag.appendChild(document.createTextNode(' ' + VT.s(CAT_LABEL[a.category] || 'Analysis')));
        $('rdTitle').textContent = a.title;
        $('rdSummary').textContent = a.summary;
        $('rdAvatar').textContent = (a.authorName || '?').charAt(0).toUpperCase();
        $('rdAuthor').textContent = a.authorName + ' · ' + a.nationality;
        $('rdMeta').textContent = fmtDate(a.publishedAt) + ' · ' + VT.s((a.readMinutes || 1) + ' min read');
        const body = $('rdBody');
        body.innerHTML = '';
        (a.body || '').split(/\n{2,}/).forEach(p => {
            if (!p.trim()) return;
            const el = node('p', '', p.trim());
            el.setAttribute('dir', 'auto');
            body.appendChild(el);
        });
        document.title = read.original.title + ' | VERO';
        const notice = $('rdNotice');
        if (read.translated) {
            notice.hidden = false;
            const srcName = VT.LANGS[read.original.language] ? VT.LANGS[read.original.language].name : read.original.language;
            if (read.showing === 'translated') {
                $('rdNoticeText').textContent = await VT.t('Machine-translated from ' + srcName + '. The original may read differently.');
                $('rdToggle').textContent = T('showOriginal');
            } else {
                $('rdNoticeText').textContent = await VT.t('Showing the original text in ' + srcName + '.');
                $('rdToggle').textContent = T('showTranslation');
            }
        } else {
            notice.hidden = true;
        }
    }

    async function openArticle(slug) {
        show('read');
        await preload();
        read.slug = slug;
        read.translated = null;
        let orig = window.__ARTICLE__ && window.__ARTICLE__.slug === slug ? window.__ARTICLE__ : null;
        try {
            if (!orig) {
                const r = await fetch('/api/articles/' + encodeURIComponent(slug));
                if (!r.ok) throw new Error('nf');
                orig = (await r.json()).article;
            }
            read.original = orig;
            if (VT.lang !== orig.language) {
                const r2 = await fetch('/api/articles/' + encodeURIComponent(slug) + '?lang=' + VT.lang);
                if (r2.ok) {
                    const t = (await r2.json()).article;
                    if (t && t.translatedFrom) read.translated = t;
                }
            }
            await VT.load([(orig.readMinutes || 1) + ' min read']);
            await paintArticle(read.translated ? 'translated' : 'original');
        } catch (e) {
            $('rdTitle').textContent = T('notFound');
            $('rdSummary').textContent = '';
            $('rdBody').innerHTML = '';
            $('rdNotice').hidden = true;
        }
    }

    $('rdToggle').addEventListener('click', () => paintArticle(read.showing === 'translated' ? 'original' : 'translated'));

    $('shareBtn').addEventListener('click', async () => {
        const url = location.href;
        const title = read.original ? read.original.title : document.title;
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
                return;
            } catch (e) { }
        }
        try {
            await navigator.clipboard.writeText(url);
            VT.toast(T('copied'), 'ph-check-circle');
        } catch (e) { }
    });

    function showWrite() {
        show('write');
        setStep(1);
    }

    function setStep(n) {
        state.step = n;
        document.querySelectorAll('#writeForm .pane').forEach(p => { p.hidden = parseInt(p.dataset.pane, 10) !== n; });
        document.querySelectorAll('#stepper li').forEach(li => {
            const s = parseInt(li.dataset.step, 10);
            li.classList.toggle('active', s === n);
            li.classList.toggle('done', s < n);
        });
        if (n === 3) {
            const first = $('wFirst').value.trim();
            const last = $('wLast').value.trim();
            $('rvName').textContent = first + ' ' + last.charAt(0).toUpperCase() + '. · ' + $('wNationality').value.trim();
        }
        $('wError').hidden = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function fail(text) {
        const el = $('wError');
        el.textContent = text;
        el.hidden = false;
        return false;
    }

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function validate(step) {
        if (step === 1) {
            if (!$('wFirst').value.trim() || !$('wLast').value.trim()) return fail(T('needName'));
            const age = parseInt($('wAge').value, 10);
            if (!age) return fail(T('needAge'));
            if (age < 18) return fail(T('minor'));
            if (!EMAIL_RE.test($('wEmail').value.trim())) return fail(T('badEmail'));
            if (!$('wNationality').value.trim() || !$('wResidence').value.trim()) return fail(T('needCountry'));
        }
        if (step === 2) {
            if ($('wTitle').value.trim().length < 10) return fail(T('needTitle'));
            if ($('wSummary').value.trim().length < 40) return fail(T('needSummary'));
            if ($('wBody').value.trim().length < 600) return fail(T('needBody'));
        }
        if (step === 3) {
            if (!$('cAge').checked || !$('cOriginal').checked || !$('cTerms').checked) return fail(T('needConsent'));
        }
        $('wError').hidden = true;
        return true;
    }

    document.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', async () => {
        await preload();
        if (validate(state.step)) setStep(state.step + 1);
    }));
    document.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => setStep(state.step - 1)));

    function saveDraft() {
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify({
                title: $('wTitle').value,
                summary: $('wSummary').value,
                body: $('wBody').value,
                category: $('wCategory').value,
                lang: $('wLang').value
            }));
        } catch (e) { }
    }

    function updateCounters() {
        $('sumCount').textContent = $('wSummary').value.length + ' / 320';
        $('bodyCount').textContent = $('wBody').value.length + ' / 20000';
    }

    ['wTitle', 'wSummary', 'wBody', 'wCategory', 'wLang'].forEach(id => {
        $(id).addEventListener('input', () => {
            updateCounters();
            saveDraft();
        });
    });

    try {
        const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
        if (d) {
            $('wTitle').value = d.title || '';
            $('wSummary').value = d.summary || '';
            $('wBody').value = d.body || '';
            if (d.category) $('wCategory').value = d.category;
            if (d.lang) $('wLang').value = d.lang;
            updateCounters();
        }
    } catch (e) { }

    $('writeForm').addEventListener('submit', async e => {
        e.preventDefault();
        await preload();
        if (!validate(1)) return setStep(1);
        if (!validate(2)) return setStep(2);
        if (!validate(3)) return;
        const btn = $('wSubmit');
        const label = btn.querySelector('span');
        btn.disabled = true;
        label.removeAttribute('data-tr');
        label.textContent = T('sending');
        try {
            const r = await fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    author: {
                        firstName: $('wFirst').value,
                        lastName: $('wLast').value,
                        age: parseInt($('wAge').value, 10),
                        nationality: $('wNationality').value,
                        residence: $('wResidence').value,
                        email: $('wEmail').value,
                        idDocs: [...document.querySelectorAll('input[name="idDocs"]:checked')].map(x => x.value)
                    },
                    article: {
                        title: $('wTitle').value,
                        summary: $('wSummary').value,
                        category: $('wCategory').value,
                        language: $('wLang').value,
                        body: $('wBody').value
                    },
                    consent: true,
                    website: $('wWebsite').value
                })
            });
            if (r.ok) {
                try { localStorage.removeItem(DRAFT_KEY); } catch (x) { }
                $('writeForm').reset();
                updateCounters();
                $('writeForm').hidden = true;
                $('stepper').hidden = true;
                $('wDone').hidden = false;
            } else if (r.status === 429) {
                fail(T('tooMany'));
            } else if (r.status === 503) {
                fail(T('unavailable'));
            } else {
                const d = await r.json().catch(() => ({}));
                fail(d.error === 'age' ? T('minor') : T('failed'));
            }
        } catch (x) {
            fail(T('failed'));
        }
        btn.disabled = false;
        label.setAttribute('data-tr', '');
        label.textContent = VT.s(label._en || TXT.submitLabel);
    });

    function route() {
        const m = location.pathname.match(/^\/articles\/([^/]+)/);
        if (m) return openArticle(decodeURIComponent(m[1]));
        if (location.hash === '#write') return showWrite();
        document.title = 'Articles & Analysis | VERO';
        return loadList();
    }

    window.addEventListener('popstate', route);

    $('goWrite').addEventListener('click', e => {
        e.preventDefault();
        go('/articles#write');
    });
    ['backLink', 'backLink2'].forEach(id => {
        $(id).addEventListener('click', e => {
            e.preventDefault();
            go('/articles');
        });
    });

    window.addEventListener('vero:lang', async () => {
        if (!state.booted) return;
        await preload();
        if (state.view === 'list') loadList();
        else if (state.view === 'read' && read.slug) openArticle(read.slug);
    });

    VT.ready.then(() => {
        state.booted = true;
        route();
    });
})();
