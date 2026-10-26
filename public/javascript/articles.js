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
        badLogin: 'Incorrect email, username or password.',
        banned: 'This account has been suspended.',
        exists: 'An account with this email already exists.',
        needName: 'Please enter your name (at least 2 characters).',
        nameShort: 'The name needs at least 2 characters.',
        profileSaved: 'Profile saved.',
        notifySaved: 'Notification settings updated.',
        browserOn: 'Browser alerts enabled.',
        browserDenied: 'Notifications are blocked in this browser. Allow them in the site settings to enable alerts.',
        browserUnsupported: 'This browser does not support notifications.',
        earned: 'Earned',
        locked: 'Not earned yet',
        tNotifyAll: 'All notifications',
        tNotifyAllD: 'Master switch for every notification below.',
        tFollow: 'New followers',
        tFollowD: 'When someone starts following you.',
        tArticle: 'Articles from authors you follow',
        tArticleD: 'When a followed author publishes a new article.',
        tComment: 'Comments on your articles',
        tCommentD: 'When someone comments on one of your articles.',
        tLike: 'Likes on your articles',
        tLikeD: 'When someone likes one of your articles.',
        tAnnounce: 'VERO announcements and breaking updates',
        tAnnounceD: 'Official announcements from the VERO team.',
        needUsername: 'Please choose a username.',
        badUsername: 'Use 3 to 20 characters: lowercase letters, numbers and underscores.',
        usernameTaken: 'This username is already taken.',
        usernameFree: 'This username is available.',
        usernameChecking: 'Checking availability...',
        usernameUnavailable: 'This username is not available.',
        needBirth: 'Please enter your date of birth as DD/MM/YYYY.',
        badBirth: 'Please enter a real date of birth.',
        birthFuture: 'This date is in the future.',
        birthOld: 'This date is too far in the past.',
        tooYoung: 'VERO accounts require a minimum age of 13.',
        birthAdult: 'Adult account: reading, reacting, commenting and writing.',
        birthMinor: 'Account under 18: reading, reacting, commenting and following. Writing opens at 18.',
        badEmail: 'Please enter a valid email address.',
        shortPass: 'The password must have at least 8 characters.',
        needRegConsent: 'Please accept the terms and the privacy policy.',
        badImage: 'This image is not supported or is too large. Try a different one.',
        pendingLimit: 'You already have 5 articles waiting for review.',
        confirmDelete: 'Delete this article permanently?',
        confirmDeleteComment: 'Delete this comment?',
        statusPending: 'Pending review',
        statusApproved: 'Published',
        statusRejected: 'Rejected',
        noArticles: 'You have not written any articles yet.',
        view: 'View',
        remove: 'Delete',
        wrongPassword: 'The password is incorrect.',
        needPassword: 'Enter your password to confirm.',
        follow: 'Follow',
        following: 'Following',
        profileMissing: 'This profile does not exist.',
        profileEmpty: 'No articles yet',
        profileEmptySelf: 'Your published articles will appear here.',
        profileEmptyOther: 'This author has not published any articles yet.',
        commentShort: 'Write at least 2 characters.',
        commentFailed: 'The comment could not be posted. Please try again.',
        commentsEmpty: 'No comments yet. Start the conversation.',
        needLogin: 'Sign in to continue.',
        bioSaved: 'Profile updated.',
        avatarSaved: 'Profile picture updated.',
        Diplomacy: 'Diplomacy',
        Military: 'Military',
        Economy: 'Economy',
        Regional: 'Regional',
        Analysis: 'Analysis',
        Opinion: 'Opinion',
        Announcement: 'Announcement'
    };

    const CAT_ICONS = { diplomacy: 'ph-handshake', military: 'ph-crosshair', economy: 'ph-chart-line-up', regional: 'ph-map-trifold', analysis: 'ph-magnifying-glass', opinion: 'ph-chat-teardrop-text', announcement: 'ph-megaphone' };
    const CAT_LABEL = { diplomacy: 'Diplomacy', military: 'Military', economy: 'Economy', regional: 'Regional', analysis: 'Analysis', opinion: 'Opinion', announcement: 'Announcement' };
    const DRAFT_KEY = 'vero_draft';
    const NAMES = ['list', 'read', 'profile', 'auth', 'account', 'settings', 'write'];
    const views = {};
    NAMES.forEach(n => { views[n] = document.getElementById('view-' + n); });
    const grid = document.getElementById('articlesGrid');
    const pager = document.getElementById('artPagination');
    const state = { view: 'list', cat: 'all', page: 1, step: 1, booted: false, after: 'write', returnTo: '' };
    const read = { slug: null, original: null, translated: null, showing: 'original', article: null, myReaction: 0, commentPage: 1, commentPages: 1 };
    const media = { regAvatar: null, regPreset: null, cover: null };
    const profileState = { username: '', data: null };
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    let listId = 0;
    let userCheckTimer = 0;
    let userCheckSeq = 0;
    let birthInfo = null;

    const T = key => VT.s(TXT[key]);
    const codeOf = r => (r.data && r.data.code ? ' (' + r.data.code + ')' : '');
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

    function icon(name) {
        return node('i', 'ph ' + name);
    }

    function avatarImg(url, cls, size) {
        const img = node('img', cls || 'avatar-img');
        img.alt = '';
        img.width = size || 36;
        img.height = size || 36;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = url || VT.DEFAULT_AVATAR;
        img.addEventListener('error', () => {
            if (img.src !== VT.DEFAULT_AVATAR) img.src = VT.DEFAULT_AVATAR;
        });
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
                const ctx = c.getContext('2d');
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
                let q = 0.88;
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

    function message(target, cls, iconName, text) {
        target.innerHTML = '';
        const p = node('div', cls);
        if (iconName) p.appendChild(node('i', 'ph ' + iconName));
        p.appendChild(document.createTextNode(text));
        target.appendChild(p);
    }

    function userLink(username, className) {
        const a = node('a', className || '');
        a.href = '/u/' + encodeURIComponent(username);
        a.setAttribute('data-link', '');
        return a;
    }

    function renderCards(target, items) {
        target.innerHTML = '';
        items.forEach(a => {
            const card = node('article', 'card art-card');
            card.dataset.cat = a.category;
            const href = '/articles/' + encodeURIComponent(a.slug);
            card.addEventListener('click', e => {
                if (e.target.closest('a')) return;
                go(href);
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
            tag.appendChild(icon(CAT_ICONS[a.category] || 'ph-globe'));
            tag.appendChild(document.createTextNode(' ' + VT.s(CAT_LABEL[a.category] || 'Analysis')));
            top.appendChild(tag);
            top.appendChild(node('span', 'lang-badge', (a.language || 'en').toUpperCase()));
            const content = node('div', 'card-content');
            content.appendChild(node('span', 'card-date', fmtDate(a.publishedAt)));
            const h = node('h3', 'card-title');
            const link = node('a', 'card-title-link', a.title);
            link.href = href;
            link.setAttribute('data-link', '');
            h.appendChild(link);
            h.setAttribute('dir', 'auto');
            const s = node('p', 'card-desc', a.summary);
            s.setAttribute('dir', 'auto');
            content.appendChild(h);
            content.appendChild(s);
            const foot = node('div', 'card-footer art-foot');
            let by;
            if (a.username) {
                by = userLink(a.username, 'art-by');
                by.title = '@' + a.username;
            } else by = node('div', 'art-by');
            by.appendChild(avatarImg(a.avatarUrl, 'avatar-img', 36));
            const who = node('span', 'art-who');
            who.appendChild(node('b', '', a.authorName));
            who.appendChild(node('small', '', a.username ? '@' + a.username : ''));
            by.appendChild(who);
            by.appendChild(VT.badgeRow(a.badges));
            const stats = node('div', 'art-stats');
            const likes = node('span', 'stat');
            likes.appendChild(icon('ph-thumbs-up'));
            likes.appendChild(document.createTextNode(' ' + (a.likeCount || 0)));
            const comments = node('span', 'stat');
            comments.appendChild(icon('ph-chat-circle-text'));
            comments.appendChild(document.createTextNode(' ' + (a.commentCount || 0)));
            const mins = node('span', 'stat mins', VT.s((a.readMinutes || 1) + ' min read'));
            stats.appendChild(likes);
            stats.appendChild(comments);
            stats.appendChild(mins);
            foot.appendChild(by);
            foot.appendChild(stats);
            content.appendChild(foot);
            card.appendChild(top);
            card.appendChild(content);
            target.appendChild(card);
        });
    }

    async function loadList() {
        const id = ++listId;
        show('list');
        await preload();
        message(grid, 'grid-msg', 'ph-spinner ph-spin', ' ' + T('loading'));
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
                message(grid, 'empty-art', 'ph-newspaper', T('empty'));
                return;
            }
            renderCards(grid, items);
            renderPager(d.page || 1, d.totalPages || 1);
        } catch (e) {
            if (id !== listId) return;
            message(grid, 'grid-msg error', '', T('error'));
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

    function paintEngage() {
        const a = read.article;
        if (!a) return;
        $('likeCount').textContent = a.likeCount || 0;
        $('dislikeCount').textContent = a.dislikeCount || 0;
        $('commentTotal').textContent = a.commentCount || 0;
        $('likeBtn').classList.toggle('on', read.myReaction === 1);
        $('dislikeBtn').classList.toggle('on', read.myReaction === -1);
        $('likeBtn').setAttribute('aria-pressed', read.myReaction === 1 ? 'true' : 'false');
        $('dislikeBtn').setAttribute('aria-pressed', read.myReaction === -1 ? 'true' : 'false');
        $('likeBtn').firstElementChild.className = read.myReaction === 1 ? 'ph-fill ph-thumbs-up' : 'ph ph-thumbs-up';
        $('dislikeBtn').firstElementChild.className = read.myReaction === -1 ? 'ph-fill ph-thumbs-down' : 'ph ph-thumbs-down';
    }

    function paintCommentAccess() {
        const u = user();
        $('commentForm').hidden = !u;
        $('commentLogin').hidden = !!u;
    }

    async function requireLogin() {
        if (user()) return true;
        await preload();
        VT.toast(T('needLogin'), 'ph-lock-simple');
        state.returnTo = location.pathname;
        showAuth('write');
        return false;
    }

    async function react(value) {
        if (!(await requireLogin()) || !read.article) return;
        const next = read.myReaction === value ? 0 : value;
        const r = await api('/api/articles/' + read.article.id + '/react', 'POST', { value: next });
        if (!r.ok) {
            await preload();
            VT.toast(r.status === 429 ? T('tooMany') : T('failed'), 'ph-warning');
            return;
        }
        read.myReaction = r.data.myReaction;
        read.article.likeCount = r.data.likeCount;
        read.article.dislikeCount = r.data.dislikeCount;
        paintEngage();
    }

    $('likeBtn').addEventListener('click', () => react(1));
    $('dislikeBtn').addEventListener('click', () => react(-1));

    function commentItem(c) {
        const li = node('li', 'comment');
        li.dataset.id = c.id;
        const left = c.username ? userLink(c.username, 'comment-avatar') : node('span', 'comment-avatar');
        left.appendChild(avatarImg(c.avatarUrl, 'avatar-img', 40));
        li.appendChild(left);
        const body = node('div', 'comment-main');
        const head = node('div', 'comment-head');
        const name = c.username ? userLink(c.username, 'comment-name') : node('span', 'comment-name');
        name.appendChild(node('b', '', c.name));
        name.appendChild(VT.badgeRow(c.badges));
        if (c.username) name.appendChild(node('small', '', '@' + c.username));
        head.appendChild(name);
        const time = node('span', 'comment-time', VT.ago(c.createdAt));
        time.dataset.t = c.createdAt;
        head.appendChild(time);
        body.appendChild(head);
        const text = node('p', 'comment-body', c.body);
        text.setAttribute('dir', 'auto');
        body.appendChild(text);
        if (c.canDelete) {
            const del = node('button', 'link-btn danger', T('remove'));
            del.type = 'button';
            del.addEventListener('click', async () => {
                if (!window.confirm(T('confirmDeleteComment'))) return;
                const r = await api('/api/comments/' + c.id, 'DELETE');
                if (r.ok) {
                    li.remove();
                    if (read.article) {
                        read.article.commentCount = Math.max(0, (read.article.commentCount || 1) - 1);
                        paintEngage();
                    }
                    if (!$('commentList').children.length) $('commentList').appendChild(node('li', 'my-empty', T('commentsEmpty')));
                }
            });
            body.appendChild(del);
        }
        li.appendChild(body);
        return li;
    }

    async function loadComments(reset) {
        if (!read.article) return;
        const list = $('commentList');
        if (reset) {
            read.commentPage = 1;
            list.innerHTML = '';
        }
        const r = await api('/api/articles/' + read.article.id + '/comments?page=' + read.commentPage);
        if (!r.ok) return;
        const items = r.data.comments || [];
        read.commentPages = r.data.totalPages || 1;
        if (reset && !items.length) list.appendChild(node('li', 'my-empty', T('commentsEmpty')));
        items.forEach(c => list.appendChild(commentItem(c)));
        $('commentMore').hidden = read.commentPage >= read.commentPages;
    }

    $('commentMore').addEventListener('click', async () => {
        read.commentPage++;
        await loadComments(false);
    });

    $('cBody').addEventListener('input', () => { $('cCount').textContent = $('cBody').value.length + ' / 1000'; });

    $('commentForm').addEventListener('submit', async e => {
        e.preventDefault();
        await preload();
        const err = $('cError');
        err.hidden = true;
        const text = $('cBody').value.trim();
        if (text.length < 2) return showError(err, T('commentShort'));
        if (!read.article) return;
        const btn = $('cSubmit');
        btn.disabled = true;
        const r = await api('/api/articles/' + read.article.id + '/comments', 'POST', { body: text });
        btn.disabled = false;
        if (!r.ok) return showError(err, r.status === 429 ? T('tooMany') : r.status === 401 ? T('needLogin') : T('commentFailed'));
        const list = $('commentList');
        const empty = list.querySelector('.my-empty');
        if (empty) empty.remove();
        list.insertBefore(commentItem(r.data.comment), list.firstChild);
        read.article.commentCount = (read.article.commentCount || 0) + 1;
        paintEngage();
        $('cBody').value = '';
        $('cCount').textContent = '0 / 1000';
    });

    async function paintArticle(which) {
        const a = which === 'translated' && read.translated ? read.translated : read.original;
        read.showing = a === read.translated ? 'translated' : 'original';
        const tag = $('rdTag');
        tag.innerHTML = '';
        tag.appendChild(icon(CAT_ICONS[a.category] || 'ph-globe'));
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
        const link = $('rdUserLink');
        if (a.username) {
            link.href = '/u/' + encodeURIComponent(a.username);
            link.setAttribute('data-link', '');
        } else {
            link.removeAttribute('href');
            link.removeAttribute('data-link');
        }
        $('rdAvatar').src = a.avatarUrl || VT.DEFAULT_AVATAR;
        const rb = $('rdBadges');
        rb.innerHTML = '';
        rb.appendChild(VT.badgeRow(a.badges));
        $('rdAuthor').textContent = a.authorName;
        $('rdHandle').textContent = a.username ? '@' + a.username : '';
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
        await VT.meReady;
        read.slug = slug;
        read.translated = null;
        read.article = null;
        $('commentList').innerHTML = '';
        $('commentMore').hidden = true;
        try {
            const r = await fetch('/api/articles/' + encodeURIComponent(slug), { credentials: 'same-origin' });
            if (!r.ok) throw new Error('nf');
            const orig = (await r.json()).article;
            read.original = orig;
            read.article = { id: orig.id, likeCount: orig.likeCount, dislikeCount: orig.dislikeCount, commentCount: orig.commentCount };
            read.myReaction = orig.myReaction || 0;
            if (VT.lang !== orig.language) {
                const r2 = await fetch('/api/articles/' + encodeURIComponent(slug) + '?lang=' + VT.lang, { credentials: 'same-origin' });
                if (r2.ok) {
                    const t = (await r2.json()).article;
                    if (t && t.translatedFrom) read.translated = t;
                }
            }
            await VT.load([(orig.readMinutes || 1) + ' min read']);
            await paintArticle(read.translated ? 'translated' : 'original');
            $('engage').hidden = false;
            $('comments').hidden = false;
            paintEngage();
            paintCommentAccess();
            loadComments(true);
        } catch (e) {
            $('rdTitle').textContent = T('notFound');
            $('rdSummary').textContent = '';
            $('rdBody').innerHTML = '';
            $('rdCover').hidden = true;
            $('rdNotice').hidden = true;
            $('engage').hidden = true;
            $('comments').hidden = true;
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

    function profileEmpty(target, self) {
        target.innerHTML = '';
        const box = node('div', 'profile-empty');
        const ring = node('div', 'empty-ring');
        ring.appendChild(icon('ph-article'));
        box.appendChild(ring);
        box.appendChild(node('h3', '', T('profileEmpty')));
        box.appendChild(node('p', '', self ? T('profileEmptySelf') : T('profileEmptyOther')));
        target.appendChild(box);
    }

    function paintFollow(p) {
        const btn = $('pfFollow');
        btn.hidden = p.isSelf;
        $('pfEdit').hidden = !p.isSelf;
        btn.classList.toggle('active', p.isFollowing);
        btn.innerHTML = '';
        btn.appendChild(icon(p.isFollowing ? 'ph-user-check' : 'ph-user-plus'));
        btn.appendChild(document.createTextNode(' '));
        btn.appendChild(node('span', '', p.isFollowing ? T('following') : T('follow')));
        $('pfFollowers').textContent = p.followers;
    }

    async function showProfile(name) {
        show('profile');
        await preload();
        await VT.meReady;
        profileState.username = name;
        const grid2 = $('profileGrid');
        message(grid2, 'grid-msg', 'ph-spinner ph-spin', ' ' + T('loading'));
        const r = await api('/api/users/' + encodeURIComponent(name));
        if (!r.ok) {
            document.querySelector('#view-profile .profile-card').hidden = true;
            grid2.innerHTML = '';
            const box = node('div', 'profile-empty');
            const ring = node('div', 'empty-ring');
            ring.appendChild(icon('ph-user-circle-dashed'));
            box.appendChild(ring);
            box.appendChild(node('h3', '', r.status === 404 ? T('profileMissing') : T('unavailable') + codeOf(r)));
            grid2.appendChild(box);
            return;
        }
        document.querySelector('#view-profile .profile-card').hidden = false;
        const p = r.data.profile;
        profileState.data = p;
        $('pfAvatar').src = p.avatarUrl || VT.DEFAULT_AVATAR;
        $('pfName').textContent = p.name;
        $('pfHandle').textContent = '@' + p.username;
        const pb = $('pfBadges');
        pb.innerHTML = '';
        pb.appendChild(VT.badgeRow(p.badges, true));
        $('pfBio').textContent = p.bio || '';
        $('pfBio').hidden = !p.bio;
        $('pfArticles').textContent = p.articleCount;
        $('pfFollowing').textContent = p.following;
        paintFollow(p);
        document.title = '@' + p.username + ' | VERO';
        const items = r.data.articles || [];
        if (!items.length) profileEmpty(grid2, p.isSelf);
        else renderCards(grid2, items);
    }

    $('pfFollow').addEventListener('click', async () => {
        const p = profileState.data;
        if (!p) return;
        if (!(await requireLogin())) return;
        const btn = $('pfFollow');
        btn.disabled = true;
        const r = await api('/api/users/' + encodeURIComponent(p.username) + '/follow', 'POST', { follow: !p.isFollowing });
        btn.disabled = false;
        if (!r.ok) {
            await preload();
            VT.toast(T('failed'), 'ph-warning');
            return;
        }
        p.isFollowing = r.data.isFollowing;
        p.followers = r.data.followers;
        paintFollow(p);
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
        if (state.returnTo) {
            const target = state.returnTo;
            state.returnTo = '';
            go(target);
        } else go('/articles#' + (state.after === 'write' && user() && user().isMinor ? 'account' : state.after));
    }

    $('loginForm').addEventListener('submit', async e => {
        e.preventDefault();
        await preload();
        const err = $('lError');
        err.hidden = true;
        const login = $('lEmail').value.trim();
        const password = $('lPass').value;
        if (!login || !password) return showError(err, T('badLogin'));
        const btn = $('lSubmit');
        btn.disabled = true;
        const r = await api('/api/auth/login', 'POST', { login, password });
        btn.disabled = false;
        if (r.ok) {
            await VT.refreshMe();
            $('lPass').value = '';
            afterAuth();
        } else if (r.status === 429) showError(err, T('tooMany'));
        else if (r.status === 503) showError(err, T('unavailable') + codeOf(r));
        else if (r.data.error === 'banned') showError(err, T('banned'));
        else showError(err, T('badLogin'));
    });

    function bindPhotoPicker(input, onData) {
        input.addEventListener('change', async () => {
            const file = input.files && input.files[0];
            input.value = '';
            if (!file) return;
            try {
                await onData(await resizeImage(file, 512, 512, true));
            } catch (e) {
                await preload();
                VT.toast(T('badImage'), 'ph-warning');
            }
        });
    }

    function presetUrl(id) {
        return '/assets/avatars/' + id + '.webp';
    }

    function buildPresets(box, onPick) {
        box.innerHTML = '';
        VT.AVATAR_PRESETS.forEach(id => {
            const b = node('button', 'preset');
            b.type = 'button';
            b.dataset.id = id;
            const im = node('img');
            im.alt = '';
            im.width = 64;
            im.height = 64;
            im.decoding = 'async';
            im.src = presetUrl(id);
            b.appendChild(im);
            b.addEventListener('click', async () => {
                box.querySelectorAll('.preset').forEach(p => p.classList.toggle('on', p === b));
                try {
                    await onPick(id);
                } catch (e) {
                    await preload();
                    VT.toast(T('badImage'), 'ph-warning');
                }
            });
            box.appendChild(b);
        });
    }

    function clearPresetMarks(box) {
        box.querySelectorAll('.preset').forEach(p => p.classList.remove('on'));
    }

    function setRegAvatar(data, preset) {
        media.regAvatar = data;
        media.regPreset = preset;
        $('regAvatarPreview').src = data || (preset ? presetUrl(preset) : VT.DEFAULT_AVATAR);
    }

    bindPhotoPicker($('regAvatar'), async data => {
        clearPresetMarks($('regPresets'));
        setRegAvatar(data, null);
    });
    buildPresets($('regPresets'), async id => setRegAvatar(null, id));
    $('regAvatarPreview').src = VT.DEFAULT_AVATAR;

    function setStatus(el, kind, text) {
        if (!text) {
            el.hidden = true;
            el.textContent = '';
            return;
        }
        el.hidden = false;
        el.className = 'field-status ' + kind;
        el.textContent = text;
    }

    function parseBirthText(v) {
        const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
        if (!m) return { error: 'needBirth' };
        const d = parseInt(m[1], 10);
        const mo = parseInt(m[2], 10);
        const y = parseInt(m[3], 10);
        const now = new Date();
        if (mo < 1 || mo > 12 || d < 1 || d > 31) return { error: 'badBirth' };
        const date = new Date(Date.UTC(y, mo - 1, d));
        if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return { error: 'badBirth' };
        if (date.getTime() > now.getTime()) return { error: 'birthFuture' };
        if (y < now.getUTCFullYear() - 110) return { error: 'birthOld' };
        let age = now.getUTCFullYear() - y;
        const dm = now.getUTCMonth() - (mo - 1);
        if (dm < 0 || (dm === 0 && now.getUTCDate() < d)) age--;
        if (age > 110) return { error: 'birthOld' };
        if (age < 13) return { error: 'tooYoung', age };
        return { d, m: mo, y, age };
    }

    async function checkBirth(final) {
        await preload();
        const v = $('rBirth').value;
        if (v.length < 10) {
            birthInfo = null;
            setStatus($('rBirthStatus'), 'bad', final && v ? T('needBirth') : '');
            return null;
        }
        const r = parseBirthText(v);
        if (r.error) {
            birthInfo = null;
            setStatus($('rBirthStatus'), 'bad', T(r.error));
            return null;
        }
        birthInfo = r;
        setStatus($('rBirthStatus'), 'ok', r.age >= 18 ? T('birthAdult') : T('birthMinor'));
        return r;
    }

    $('rBirth').addEventListener('input', () => {
        const digits = $('rBirth').value.replace(/\D/g, '').slice(0, 8);
        let out = digits;
        if (digits.length > 4) out = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
        else if (digits.length > 2) out = digits.slice(0, 2) + '/' + digits.slice(2);
        $('rBirth').value = out;
        checkBirth(false);
    });
    $('rBirth').addEventListener('blur', () => checkBirth(true));

    $('rUsername').addEventListener('input', () => {
        const el = $('rUsername');
        el.value = el.value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20);
        clearTimeout(userCheckTimer);
        const v = el.value;
        const status = $('rUserStatus');
        if (!v) {
            setStatus(status, '', '');
            return;
        }
        if (v.length < 3) {
            preload().then(() => setStatus(status, 'bad', T('badUsername')));
            return;
        }
        const seq = ++userCheckSeq;
        preload().then(() => setStatus(status, 'pending', T('usernameChecking')));
        userCheckTimer = setTimeout(async () => {
            const r = await api('/api/auth/username?u=' + encodeURIComponent(v));
            if (seq !== userCheckSeq) return;
            await preload();
            if (r.status === 503) return setStatus(status, 'bad', T('unavailable') + codeOf(r));
            if (!r.ok) return setStatus(status, '', '');
            if (!r.data.valid) return setStatus(status, 'bad', T('usernameUnavailable'));
            setStatus(status, r.data.available ? 'ok' : 'bad', r.data.available ? T('usernameFree') : T('usernameTaken'));
        }, 420);
    });

    $('registerForm').addEventListener('submit', async e => {
        e.preventDefault();
        await preload();
        const err = $('rError');
        err.hidden = true;
        const username = $('rUsername').value.trim();
        if (!username) return showError(err, T('needUsername'));
        if (!/^[a-z0-9_]{3,20}$/.test(username)) return showError(err, T('badUsername'));
        if ($('rFirst').value.trim().length < 2) return showError(err, T('needName'));
        const birth = await checkBirth(true);
        if (!birth) {
            const parsed = parseBirthText($('rBirth').value);
            return showError(err, T(parsed.error || 'needBirth'));
        }
        if (!EMAIL_RE.test($('rEmail').value.trim())) return showError(err, T('badEmail'));
        if ($('rPass').value.length < 8) return showError(err, T('shortPass'));
        if (!$('rConsent').checked) return showError(err, T('needRegConsent'));
        const btn = $('rSubmit');
        btn.disabled = true;
        const payload = {
            username,
            name: $('rFirst').value,
            birth: { d: birth.d, m: birth.m, y: birth.y },
            email: $('rEmail').value,
            password: $('rPass').value,
            consent: true,
            website: $('rWebsite').value
        };
        if (media.regAvatar) payload.avatar = media.regAvatar;
        else if (media.regPreset) payload.avatarPreset = media.regPreset;
        const r = await api('/api/auth/register', 'POST', payload);
        btn.disabled = false;
        if (!r.ok) {
            if (r.status === 429) return showError(err, T('tooMany'));
            if (r.status === 503) return showError(err, T('unavailable') + codeOf(r));
            const code = r.data.error;
            if (code === 'exists') return showError(err, T('exists'));
            if (code === 'username_taken') return showError(err, T('usernameTaken'));
            if (code === 'username') return showError(err, T('usernameUnavailable'));
            if (code === 'too_young') return showError(err, T('tooYoung'));
            if (code === 'birth') return showError(err, T('badBirth'));
            if (code === 'password') return showError(err, T('shortPass'));
            if (code === 'avatar') return showError(err, T('badImage'));
            return showError(err, T('failed'));
        }
        $('registerForm').reset();
        clearPresetMarks($('regPresets'));
        setRegAvatar(null, null);
        setStatus($('rUserStatus'), '', '');
        setStatus($('rBirthStatus'), '', '');
        await VT.refreshMe();
        afterAuth();
    });

    function paintBadgesInto(target, ids, big) {
        target.innerHTML = '';
        target.appendChild(VT.badgeRow(ids, big));
    }

    async function showAccount() {
        show('account');
        await preload();
        const u = user();
        $('acAvatar').src = u.avatarUrl || VT.DEFAULT_AVATAR;
        $('acName').textContent = u.name;
        paintBadgesInto($('acBadges'), u.badges, true);
        $('acMeta').textContent = '@' + u.username + ' · ' + u.email;
        $('acAdmin').hidden = !u.isAdmin;
        $('acProfile').href = '/u/' + encodeURIComponent(u.username);
        $('acProfile').setAttribute('data-link', '');
        $('acEdit').setAttribute('data-link', '');
        $('acWrite').hidden = !!u.isMinor;
        $('acMinorNote').hidden = !u.isMinor;
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
                v.setAttribute('data-link', '');
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

    const settings = { tab: 'profile' };
    const NOTIFY_ROWS = [
        ['all', 'tNotifyAll', 'tNotifyAllD'],
        ['follow', 'tFollow', 'tFollowD'],
        ['article', 'tArticle', 'tArticleD'],
        ['comment', 'tComment', 'tCommentD'],
        ['like', 'tLike', 'tLikeD'],
        ['announce', 'tAnnounce', 'tAnnounceD']
    ];

    function autoGrow(el) {
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight + 2, 260) + 'px';
    }

    function setSwitch(btn, on) {
        btn.classList.toggle('on', !!on);
        btn.setAttribute('aria-checked', on ? 'true' : 'false');
    }

    async function saveNotify(patch) {
        const r = await api('/api/me', 'PATCH', { notify: patch });
        if (r.ok) {
            await VT.refreshMe();
            VT.toast(T('notifySaved'), 'ph-check-circle');
        } else VT.toast(T('failed'), 'ph-warning');
        return r.ok;
    }

    function paintNotify() {
        const u = user();
        const prefs = u.notify || {};
        const box = $('notifyToggles');
        box.innerHTML = '';
        NOTIFY_ROWS.forEach(([key, tk, dk]) => {
            const row = node('div', 'toggle-row');
            if (key !== 'all' && prefs.all === false) row.classList.add('dim');
            const text = node('span', 'toggle-text');
            text.appendChild(node('b', '', T(tk)));
            text.appendChild(node('small', '', T(dk)));
            row.appendChild(text);
            const sw = node('button', 'switch');
            sw.type = 'button';
            sw.setAttribute('role', 'switch');
            sw.appendChild(node('span'));
            setSwitch(sw, prefs[key] !== false);
            sw.addEventListener('click', async () => {
                const next = !sw.classList.contains('on');
                setSwitch(sw, next);
                const ok = await saveNotify({ [key]: next });
                if (!ok) setSwitch(sw, !next);
                else paintNotify();
            });
            row.appendChild(sw);
            box.appendChild(row);
        });
        const supported = 'Notification' in window;
        const granted = supported && Notification.permission === 'granted';
        setSwitch($('browserSwitch'), !!prefs.browser && granted);
        const help = $('browserHelp');
        help.hidden = true;
        if (!supported) {
            help.hidden = false;
            help.textContent = T('browserUnsupported');
        } else if (Notification.permission === 'denied') {
            help.hidden = false;
            help.textContent = T('browserDenied');
        }
    }

    $('browserSwitch').addEventListener('click', async () => {
        await preload();
        const sw = $('browserSwitch');
        const turnOn = !sw.classList.contains('on');
        if (!turnOn) {
            setSwitch(sw, false);
            await saveNotify({ browser: false });
            return paintNotify();
        }
        if (!('Notification' in window)) {
            VT.toast(T('browserUnsupported'), 'ph-warning');
            return;
        }
        let perm = Notification.permission;
        if (perm === 'default') perm = await Notification.requestPermission();
        if (perm !== 'granted') {
            VT.toast(T('browserDenied'), 'ph-warning');
            return paintNotify();
        }
        setSwitch(sw, true);
        await saveNotify({ browser: true });
        VT.toast(T('browserOn'), 'ph-bell-ringing');
        paintNotify();
    });

    function paintBadgeGrid() {
        const mine = new Set(user().badges || []);
        const grid3 = $('badgeGrid');
        grid3.innerHTML = '';
        VT.BADGES.forEach(b => {
            const have = mine.has(b.id);
            const card = node('button', 'badge-card' + (have ? ' got' : ' lock'));
            card.type = 'button';
            card.style.setProperty('--bc', b.color);
            const art = node('span', 'badge-art');
            const e = VT.badgeEl(b.id, true);
            art.appendChild(e);
            card.appendChild(art);
            card.appendChild(node('b', '', VT.s(b.label)));
            card.appendChild(node('small', '', have ? T('earned') : T('locked')));
            const tip = node('span', 'badge-tip');
            tip.appendChild(node('b', '', VT.s(b.label)));
            tip.appendChild(node('span', '', VT.s(b.how)));
            card.appendChild(tip);
            grid3.appendChild(card);
        });
    }

    function setSettingsTab(name) {
        settings.tab = name;
        document.querySelectorAll('#settingsTabs button').forEach(b => b.classList.toggle('active', b.dataset.stab === name));
        document.querySelectorAll('.spane').forEach(p => { p.hidden = p.dataset.spane !== name; });
    }

    document.querySelectorAll('#settingsTabs button').forEach(b => b.addEventListener('click', () => setSettingsTab(b.dataset.stab)));

    async function showSettings() {
        show('settings');
        await preload();
        await VT.load(VT.BADGES.map(b => b.label).concat(VT.BADGES.map(b => b.how)));
        const u = user();
        $('stAvatar').src = u.avatarUrl || VT.DEFAULT_AVATAR;
        $('stName').value = u.name;
        $('stUsername').value = u.username;
        $('stBio').value = u.bio || '';
        $('stBioCount').textContent = (u.bio || '').length + ' / 160';
        $('stEmail').textContent = u.email;
        $('stView').href = '/u/' + encodeURIComponent(u.username);
        $('stView').setAttribute('data-link', '');
        $('stError').hidden = true;
        $('acError').hidden = true;
        const marked = $('stPresets').querySelectorAll('.preset');
        marked.forEach(p => p.classList.toggle('on', !!u.avatarUrl && u.avatarUrl.indexOf(p.dataset.id) !== -1));
        autoGrow($('stBio'));
        paintBadgeGrid();
        paintNotify();
        setSettingsTab(settings.tab);
    }

    $('stBio').addEventListener('input', () => {
        $('stBioCount').textContent = $('stBio').value.length + ' / 160';
        autoGrow($('stBio'));
    });

    $('profileForm').addEventListener('submit', async e => {
        e.preventDefault();
        await preload();
        const err = $('stError');
        err.hidden = true;
        const name = $('stName').value.trim();
        if (name.length < 2) return showError(err, T('nameShort'));
        const btn = $('stSave');
        btn.disabled = true;
        const r = await api('/api/me', 'PATCH', { name, bio: $('stBio').value });
        btn.disabled = false;
        if (!r.ok) return showError(err, T('failed'));
        await VT.refreshMe();
        VT.toast(T('profileSaved'), 'ph-check-circle');
    });

    async function saveAvatar(patch) {
        const r = await api('/api/me', 'PATCH', patch);
        if (!r.ok) throw new Error('save');
        await VT.refreshMe();
        await showSettings();
        VT.toast(T('avatarSaved'), 'ph-check-circle');
    }

    bindPhotoPicker($('stPhoto'), async data => {
        const up = await uploadMedia(data, 'avatar');
        if (!up) throw new Error('upload');
        await saveAvatar({ avatarId: up.id });
    });

    buildPresets($('stPresets'), async id => saveAvatar({ avatarPreset: id }));

    $('stLogout').addEventListener('click', async () => {
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
        if (u.isMinor) {
            $('minorPanel').hidden = false;
            $('writeForm').hidden = true;
            $('stepper').hidden = true;
            $('wDone').hidden = true;
            return;
        }
        $('minorPanel').hidden = true;
        $('rvAvatar').src = u.avatarUrl || VT.DEFAULT_AVATAR;
        $('rvName').textContent = u.name + ' · @' + u.username;
        const opt = $('optAnnouncement');
        opt.hidden = !u.isOfficial;
        opt.disabled = !u.isOfficial;
        if (!u.isOfficial && $('wCategory').value === 'announcement') $('wCategory').value = 'analysis';
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
            } else if (r.status === 403 && r.data.error === 'minor') {
                await VT.refreshMe();
                showWrite();
            } else if (r.status === 429) {
                showError($('wError'), r.data.error === 'pending' ? T('pendingLimit') : T('tooMany'));
            } else if (r.status === 503) {
                showError($('wError'), T('unavailable') + codeOf(r));
            } else {
                showError($('wError'), T('failed'));
            }
        }
        btn.disabled = false;
        label.setAttribute('data-tr', '');
        label.textContent = VT.s(label._en || TXT.submitLabel);
    });

    async function route() {
        const art = location.pathname.match(/^\/articles\/([^/]+)/);
        if (art) return openArticle(decodeURIComponent(art[1]));
        const prof = location.pathname.match(/^\/u\/([^/]+)/);
        if (prof) return showProfile(decodeURIComponent(prof[1]).replace(/^@/, '').toLowerCase());
        const hash = location.hash;
        if (hash === '#write' || hash === '#account' || hash === '#settings') {
            await VT.meReady;
            const target = hash.slice(1);
            if (!user()) {
                state.returnTo = '';
                return showAuth(target);
            }
            if (target === 'settings') return showSettings();
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
    $('goComments').addEventListener('click', e => {
        e.preventDefault();
        $('comments').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.querySelectorAll('[data-back-account]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            go('/articles#account');
        });
    });
    document.querySelectorAll('[data-back], #backLink').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            go('/articles');
        });
    });
    document.addEventListener('click', e => {
        const acc = e.target.closest('#accountBtn');
        if (acc) {
            e.preventDefault();
            go('/articles#account');
            return;
        }
        const a = e.target.closest('a[data-link]');
        if (!a || !a.getAttribute('href') || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(a.getAttribute('href'));
    });

    window.addEventListener('vero:me', () => {
        if (!state.booted) return;
        if (state.view === 'read') {
            paintCommentAccess();
            if (read.article) loadComments(true);
        }
    });

    window.addEventListener('vero:lang', async () => {
        if (!state.booted) return;
        await preload();
        if (state.view === 'list') loadList();
        else if (state.view === 'read' && read.slug) openArticle(read.slug);
        else if (state.view === 'account') showAccount();
        else if (state.view === 'settings') showSettings();
        else if (state.view === 'profile' && profileState.username) showProfile(profileState.username);
    });

    setInterval(() => {
        document.querySelectorAll('.comment-time[data-t]').forEach(n => { n.textContent = VT.ago(n.dataset.t); });
    }, 60000);

    VT.ready.then(() => {
        state.booted = true;
        route();
    });
})();
