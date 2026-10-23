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
        needTitle: 'The headline needs at least 10 characters.',
        needSummary: 'The summary needs at least 40 characters.',
        needBody: 'The article needs at least 600 characters.',
        needConsent: 'Please tick both confirmations.',
        tooMany: 'Too many attempts. Please try again later.',
        unavailable: 'The service is temporarily unavailable. Please try again later.',
        failed: 'Something went wrong. Please check your details and try again.',
        sending: 'Sending...',
        submitLabel: 'Submit for review',
        badLogin: 'Incorrect email or password.',
        banned: 'This account has been suspended.',
        exists: 'An account with this email already exists.',
        needName: 'Please enter your first and last name.',
        needAge: 'Please enter your age.',
        minor: 'You must be 18 or older to create an account.',
        badEmail: 'Please enter a valid email address.',
        shortPass: 'The password must have at least 8 characters.',
        needCountry: 'Please enter your nationality and country of residence.',
        needRegConsent: 'Please confirm that you are 18 or older and accept the terms.',
        badImage: 'This image is not supported or is too large. Try a different one.',
        needAvatar: 'Please upload a profile photo or choose an avatar.',
        pendingLimit: 'You already have 5 articles waiting for review.',
        confirmDelete: 'Delete this article permanently?',
        statusPending: 'Pending review',
        statusApproved: 'Published',
        statusRejected: 'Rejected',
        noArticles: 'You have not written any articles yet.',
        view: 'View',
        remove: 'Delete',
        wrongPassword: 'The password is incorrect.',
        needPassword: 'Enter your password to confirm.',
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
    const NAMES = ['list', 'read', 'auth', 'account', 'write'];
    const views = {};
    NAMES.forEach(n => { views[n] = document.getElementById('view-' + n); });
    const grid = document.getElementById('articlesGrid');
    const pager = document.getElementById('artPagination');
    const state = { view: 'list', cat: 'all', page: 1, step: 1, booted: false, after: 'write' };
    const read = { slug: null, original: null, translated: null, showing: 'original' };
    const media = { regAvatar: null, cover: null };
    const PRESET_BG = [['#D9431A', '#F08A24'], ['#0B7F7A', '#2FC48D'], ['#2F3A8F', '#4C8DFF'], ['#5B2A86', '#B07CFF'], ['#1F2937', '#475569'], ['#8A5A00', '#FFB04D'], ['#7A1F3D', '#E0527A'], ['#14532D', '#4ADE80'], ['#0F4C5C', '#5EE6DB'], ['#3B2F2F', '#A47148'], ['#312E81', '#818CF8'], ['#7C2D12', '#FB923C']];
    const PRESET_ICONS = ["<circle cx='64' cy='64' r='34'/><path d='M82 46L71 71L46 82L57 57Z' fill='#fff'/>", "<circle cx='64' cy='64' r='34'/><ellipse cx='64' cy='64' rx='14' ry='34'/><path d='M32 52H96M32 76H96'/>", "<path d='M64 28L94 40V66C94 84 80 96 64 102C48 96 34 84 34 66V40Z'/><path d='M50 64L60 74L80 52'/>", "<path d='M28 62L102 30L82 100L62 76Z'/><path d='M102 30L62 76'/>", "<circle cx='44' cy='64' r='16'/><path d='M60 64H104M92 64V78M80 64V74'/>", "<path d='M22 64C36 44 52 36 64 36S92 44 106 64C92 84 76 92 64 92S36 84 22 64Z'/><circle cx='64' cy='64' r='12' fill='#fff'/>", "<circle cx='64' cy='36' r='8'/><path d='M64 44V100M44 60H84M30 80C32 94 48 102 64 102S96 94 98 80'/>", "<path d='M64 26L96 44V82L64 100L32 82V44Z'/><path d='M64 62V100M32 44L64 62L96 44'/>", "<path d='M74 24L40 72H62L54 104L88 56H66Z'/>", "<path d='M30 84L36 42L54 62L64 36L74 62L92 42L98 84Z'/><path d='M30 98H98'/>", "<path d='M34 38L50 50H78L94 38V80C94 94 80 104 64 104S34 94 34 80Z'/><circle cx='52' cy='68' r='8'/><circle cx='76' cy='68' r='8'/><path d='M60 84L64 92L68 84'/>", "<path d='M26 84C40 80 50 70 56 58C62 46 72 38 86 40L104 34L94 48C94 66 84 84 66 92C54 97 40 96 30 90Z'/><path d='M56 60C60 74 70 82 82 84'/>"];
    let listId = 0;

    const T = key => VT.s(TXT[key]);
    const preload = () => VT.load(Object.values(TXT));
    const $ = id => document.getElementById(id);
    const user = () => VT.me.user;

    function show(name) {
        state.view = name;
        NAMES.forEach(k => { views[k].hidden = k !== name; });
        window.scrollTo({ top: 0 });
    }

    function node(tag, cls, text) {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text !== undefined) n.textContent = text;
        return n;
    }

    function avatarImg(url, cls) {
        const img = node('img', cls || 'avatar-img');
        img.alt = '';
        img.width = 36;
        img.height = 36;
        img.src = url || VT.DEFAULT_AVATAR;
        return img;
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

    async function api(path, method, body) {
        try {
            const r = await fetch(path, {
                method: method || 'GET',
                credentials: 'same-origin',
                headers: body ? { 'Content-Type': 'application/json' } : undefined,
                body: body ? JSON.stringify(body) : undefined
            });
            let data = {};
            try { data = await r.json(); } catch (e) { }
            return { ok: r.ok, status: r.status, data };
        } catch (e) {
            return { ok: false, status: 0, data: {} };
        }
    }

    function showError(el, text) {
        el.textContent = text;
        el.hidden = false;
        return false;
    }

    function resizeImage(file, w, h, crop) {
        return new Promise((resolve, reject) => {
            if (!file || !/^image\//.test(file.type) || file.size > 15 * 1024 * 1024) {
                reject(new Error('image'));
                return;
            }
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(url);
                let sx = 0;
                let sy = 0;
                let sw = img.width;
                let sh = img.height;
                let dw;
                let dh;
                if (crop) {
                    dw = w;
                    dh = h;
                    const target = w / h;
                    if (sw / sh > target) {
                        sw = sh * target;
                        sx = (img.width - sw) / 2;
                    } else {
                        sh = sw / target;
                        sy = (img.height - sh) / 2;
                    }
                } else {
                    const sc = Math.min(1, w / img.width, h / img.height);
                    dw = Math.round(img.width * sc);
                    dh = Math.round(img.height * sc);
                }
                const c = document.createElement('canvas');
                c.width = dw;
                c.height = dh;
                c.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
                let q = 0.86;
                let type = 'image/webp';
                let out = c.toDataURL(type, q);
                if (out.indexOf('data:image/webp') !== 0) {
                    type = 'image/jpeg';
                    out = c.toDataURL(type, q);
                }
                while (out.length * 0.75 > 200000 && q > 0.35) {
                    q -= 0.1;
                    out = c.toDataURL(type, q);
                }
                if (out.length * 0.75 > 225000) reject(new Error('big'));
                else resolve(out);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('image'));
            };
            img.src = url;
        });
    }

    async function uploadMedia(dataUrl, kind) {
        const r = await api('/api/media', 'POST', { dataUrl, kind });
        return r.ok ? r.data : null;
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
                if (a.coverUrl) {
                    top.classList.add('has-cover');
                    const cover = node('img', 'art-cover');
                    cover.alt = '';
                    cover.loading = 'lazy';
                    cover.decoding = 'async';
                    cover.src = a.coverUrl;
                    top.appendChild(cover);
                }
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
                by.appendChild(avatarImg(a.avatarUrl));
                by.appendChild(node('span', '', a.authorName + ' · ' + a.nationality));
                if (a.verified) by.appendChild(node('i', 'ph-fill ph-seal-check verified-icon'));
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
        const cover = $('rdCover');
        if (a.coverUrl) {
            cover.src = a.coverUrl;
            cover.hidden = false;
        } else {
            cover.hidden = true;
        }
        $('rdAvatar').src = a.avatarUrl || VT.DEFAULT_AVATAR;
        $('rdVerified').hidden = !a.verified;
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
            $('rdCover').hidden = true;
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

    function showAuth(after) {
        state.after = after;
        show('auth');
        $('lError').hidden = true;
        $('rError').hidden = true;
    }

    document.querySelectorAll('#authTabs button').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('#authTabs button').forEach(x => x.classList.toggle('active', x === b));
            $('loginForm').hidden = b.dataset.tab !== 'login';
            $('registerForm').hidden = b.dataset.tab !== 'register';
        });
    });

    function afterAuth() {
        go('/articles#' + state.after);
    }

    $('loginForm').addEventListener('submit', async e => {
        e.preventDefault();
        await preload();
        const err = $('lError');
        err.hidden = true;
        const email = $('lEmail').value.trim();
        const password = $('lPass').value;
        if (!email || !password) return showError(err, T('badLogin'));
        const btn = $('lSubmit');
        btn.disabled = true;
        const r = await api('/api/auth/login', 'POST', { email, password });
        btn.disabled = false;
        if (r.ok) {
            await VT.refreshMe();
            $('lPass').value = '';
            afterAuth();
        } else if (r.status === 429) showError(err, T('tooMany'));
        else if (r.status === 503) showError(err, T('unavailable'));
        else if (r.data.error === 'banned') showError(err, T('banned'));
        else showError(err, T('badLogin'));
    });

    function bindPhotoPicker(input, onData) {
        input.addEventListener('change', async () => {
            const file = input.files && input.files[0];
            input.value = '';
            if (!file) return;
            try {
                await onData(await resizeImage(file, 256, 256, true));
            } catch (e) {
                await preload();
                VT.toast(T('badImage'), 'ph-warning');
            }
        });
    }

    function presetSvg(i) {
        const c = PRESET_BG[i];
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="256" height="256"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs><rect width="128" height="128" fill="url(#g)"/><g fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">' + PRESET_ICONS[i] + '</g></svg>';
    }

    function presetUrl(i) {
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(presetSvg(i));
    }

    function rasterPreset(i) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const c = document.createElement('canvas');
                c.width = 256;
                c.height = 256;
                c.getContext('2d').drawImage(img, 0, 0, 256, 256);
                let out = c.toDataURL('image/webp', 0.92);
                if (out.indexOf('data:image/webp') !== 0) out = c.toDataURL('image/jpeg', 0.92);
                resolve(out);
            };
            img.onerror = () => reject(new Error('preset'));
            img.src = presetUrl(i);
        });
    }

    function buildPresets(box, onPick) {
        box.innerHTML = '';
        PRESET_BG.forEach((x, i) => {
            const b = node('button', 'preset');
            b.type = 'button';
            const im = node('img');
            im.alt = '';
            im.width = 56;
            im.height = 56;
            im.src = presetUrl(i);
            b.appendChild(im);
            b.addEventListener('click', async () => {
                box.querySelectorAll('.preset').forEach(p => p.classList.toggle('on', p === b));
                try {
                    await onPick(await rasterPreset(i));
                } catch (e) {
                    await preload();
                    VT.toast(T('badImage'), 'ph-warning');
                }
            });
            box.appendChild(b);
        });
    }

    function setRegAvatar(data) {
        media.regAvatar = data;
        $('regAvatarPreview').src = data || VT.DEFAULT_AVATAR;
        $('regAvatarPreview').classList.toggle('required', !data);
        if (!data) $('regPresets').querySelectorAll('.preset').forEach(p => p.classList.remove('on'));
    }

    bindPhotoPicker($('regAvatar'), async data => {
        $('regPresets').querySelectorAll('.preset').forEach(p => p.classList.remove('on'));
        setRegAvatar(data);
    });
    buildPresets($('regPresets'), async data => setRegAvatar(data));
    $('regAvatarPreview').src = VT.DEFAULT_AVATAR;

    $('registerForm').addEventListener('submit', async e => {
        e.preventDefault();
        await preload();
        const err = $('rError');
        err.hidden = true;
        const age = parseInt($('rAge').value, 10);
        if (!$('rFirst').value.trim() || !$('rLast').value.trim()) return showError(err, T('needName'));
        if (!age) return showError(err, T('needAge'));
        if (age < 18) return showError(err, T('minor'));
        if (!EMAIL_RE.test($('rEmail').value.trim())) return showError(err, T('badEmail'));
        if ($('rPass').value.length < 8) return showError(err, T('shortPass'));
        if (!$('rNationality').value.trim() || !$('rResidence').value.trim()) return showError(err, T('needCountry'));
        if (!media.regAvatar) return showError(err, T('needAvatar'));
        if (!$('rConsent').checked) return showError(err, T('needRegConsent'));
        const btn = $('rSubmit');
        btn.disabled = true;
        const r = await api('/api/auth/register', 'POST', {
            firstName: $('rFirst').value,
            lastName: $('rLast').value,
            age,
            email: $('rEmail').value,
            password: $('rPass').value,
            nationality: $('rNationality').value,
            residence: $('rResidence').value,
            avatar: media.regAvatar,
            consent: true,
            website: $('rWebsite').value
        });
        if (!r.ok) {
            btn.disabled = false;
            if (r.status === 429) return showError(err, T('tooMany'));
            if (r.status === 503) return showError(err, T('unavailable'));
            if (r.data.error === 'exists') return showError(err, T('exists'));
            if (r.data.error === 'age') return showError(err, T('minor'));
            if (r.data.error === 'password') return showError(err, T('shortPass'));
            if (r.data.error === 'avatar') return showError(err, T('badImage'));
            return showError(err, T('failed'));
        }
        btn.disabled = false;
        $('registerForm').reset();
        setRegAvatar(null);
        await VT.refreshMe();
        afterAuth();
    });

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    async function showAccount() {
        show('account');
        await preload();
        const u = user();
        $('acAvatar').src = u.avatarUrl || VT.DEFAULT_AVATAR;
        $('acName').textContent = u.firstName + ' ' + u.lastName;
        $('acMeta').textContent = u.email + ' · ' + u.nationality;
        $('acVerified').hidden = !u.verified;
        $('acAdmin').hidden = !u.isAdmin;
        $('acError').hidden = true;
        const list = $('acArticles');
        list.innerHTML = '';
        const r = await api('/api/me/articles');
        const items = r.ok ? r.data.articles || [] : [];
        if (!items.length) {
            list.appendChild(node('li', 'my-empty', T('noArticles')));
            return;
        }
        items.forEach(a => {
            const li = node('li', 'my-article');
            const info = node('div', 'my-info');
            const t = node('strong', '', a.title);
            t.setAttribute('dir', 'auto');
            info.appendChild(t);
            const key = a.status === 'approved' ? 'statusApproved' : a.status === 'rejected' ? 'statusRejected' : 'statusPending';
            info.appendChild(node('span', 'status-chip ' + a.status, T(key)));
            li.appendChild(info);
            const actions = node('div', 'my-actions');
            if (a.status === 'approved') {
                const v = node('a', 'link-btn', T('view'));
                v.href = '/articles/' + encodeURIComponent(a.slug);
                v.addEventListener('click', ev => {
                    ev.preventDefault();
                    go(v.getAttribute('href'));
                });
                actions.appendChild(v);
            }
            const d = node('button', 'link-btn danger', T('remove'));
            d.type = 'button';
            d.addEventListener('click', async () => {
                if (!window.confirm(T('confirmDelete'))) return;
                const res = await api('/api/articles/' + a.id, 'DELETE');
                if (res.ok) showAccount();
            });
            actions.appendChild(d);
            li.appendChild(actions);
            list.appendChild(li);
        });
    }

    bindPhotoPicker($('acPhoto'), async data => {
        const up = await uploadMedia(data, 'avatar');
        if (!up) throw new Error('upload');
        await api('/api/me', 'PATCH', { avatarId: up.id });
        await VT.refreshMe();
        showAccount();
    });

    buildPresets($('acPresets'), async data => {
        const up = await uploadMedia(data, 'avatar');
        if (!up) throw new Error('upload');
        await api('/api/me', 'PATCH', { avatarId: up.id });
        await VT.refreshMe();
        showAccount();
    });

    $('acLogout').addEventListener('click', async () => {
        await api('/api/auth/logout', 'POST', {});
        await VT.refreshMe();
        go('/articles');
    });

    $('acDelete').addEventListener('click', async () => {
        await preload();
        const err = $('acError');
        err.hidden = true;
        const pw = $('acDelPw').value;
        if (!pw) return showError(err, T('needPassword'));
        const r = await api('/api/me', 'DELETE', { password: pw });
        if (r.ok) {
            $('acDelPw').value = '';
            await VT.refreshMe();
            go('/articles');
        } else showError(err, r.status === 401 ? T('wrongPassword') : T('failed'));
    });

    function showWrite() {
        show('write');
        const u = user();
        $('rvAvatar').src = u.avatarUrl || VT.DEFAULT_AVATAR;
        $('rvName').textContent = u.firstName + ' ' + String(u.lastName).charAt(0).toUpperCase() + '. · ' + u.nationality;
        $('writeForm').hidden = false;
        $('stepper').hidden = false;
        $('wDone').hidden = true;
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
        $('wError').hidden = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function validate(step) {
        const err = $('wError');
        err.hidden = true;
        if (step === 1) {
            if ($('wTitle').value.trim().length < 10) return showError(err, T('needTitle'));
            if ($('wSummary').value.trim().length < 40) return showError(err, T('needSummary'));
            if ($('wBody').value.trim().length < 600) return showError(err, T('needBody'));
        }
        if (step === 3) {
            if (!$('cOriginal').checked || !$('cTerms').checked) return showError(err, T('needConsent'));
        }
        return true;
    }

    document.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', async () => {
        await preload();
        if (validate(state.step)) setStep(state.step + 1);
    }));
    document.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', () => setStep(state.step - 1)));

    function setCover(data) {
        media.cover = data;
        const prev = $('coverPreview');
        prev.hidden = !data;
        if (data) prev.src = data;
        $('coverDrop').hidden = !!data;
        $('coverClear').hidden = !data;
    }

    $('wCover').addEventListener('change', async () => {
        const file = $('wCover').files && $('wCover').files[0];
        $('wCover').value = '';
        if (!file) return;
        try {
            setCover(await resizeImage(file, 1280, 720, false));
        } catch (e) {
            await preload();
            showError($('wError'), T('badImage'));
        }
    });
    $('coverClear').addEventListener('click', () => setCover(null));

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
        if (!validate(3)) return;
        const btn = $('wSubmit');
        const label = btn.querySelector('span');
        btn.disabled = true;
        label.removeAttribute('data-tr');
        label.textContent = T('sending');
        let coverId = '';
        let ok = true;
        if (media.cover) {
            const up = await uploadMedia(media.cover, 'cover');
            if (up) coverId = up.id;
            else {
                ok = false;
                showError($('wError'), T('badImage'));
            }
        }
        if (ok) {
            const r = await api('/api/articles', 'POST', {
                article: {
                    title: $('wTitle').value,
                    summary: $('wSummary').value,
                    category: $('wCategory').value,
                    language: $('wLang').value,
                    body: $('wBody').value,
                    coverId
                },
                consent: true,
                website: $('wWebsite').value
            });
            if (r.ok) {
                try { localStorage.removeItem(DRAFT_KEY); } catch (x) { }
                $('writeForm').reset();
                updateCounters();
                setCover(null);
                $('writeForm').hidden = true;
                $('stepper').hidden = true;
                $('wDone').hidden = false;
            } else if (r.status === 401) {
                await VT.refreshMe();
                showAuth('write');
            } else if (r.status === 429) {
                showError($('wError'), r.data.error === 'pending' ? T('pendingLimit') : T('tooMany'));
            } else if (r.status === 503) {
                showError($('wError'), T('unavailable'));
            } else {
                showError($('wError'), T('failed'));
            }
        }
        btn.disabled = false;
        label.setAttribute('data-tr', '');
        label.textContent = VT.s(label._en || TXT.submitLabel);
    });

    async function route() {
        const m = location.pathname.match(/^\/articles\/([^/]+)/);
        if (m) return openArticle(decodeURIComponent(m[1]));
        const hash = location.hash;
        if (hash === '#write' || hash === '#account') {
            await VT.meReady;
            const target = hash.slice(1);
            if (!user()) return showAuth(target);
            return target === 'write' ? showWrite() : showAccount();
        }
        document.title = 'Articles & Analysis | VERO';
        return loadList();
    }

    window.addEventListener('popstate', route);

    $('goWrite').addEventListener('click', e => {
        e.preventDefault();
        go('/articles#write');
    });
    $('acWrite').addEventListener('click', e => {
        e.preventDefault();
        go('/articles#write');
    });
    document.querySelectorAll('[data-back], #backLink').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            go('/articles');
        });
    });
    document.addEventListener('click', e => {
        const a = e.target.closest('#accountBtn');
        if (!a) return;
        e.preventDefault();
        go('/articles#account');
    });

    window.addEventListener('vero:lang', async () => {
        if (!state.booted) return;
        await preload();
        if (state.view === 'list') loadList();
        else if (state.view === 'read' && read.slug) openArticle(read.slug);
        else if (state.view === 'account') showAccount();
    });

    VT.ready.then(() => {
        state.booted = true;
        route();
    });
})();
