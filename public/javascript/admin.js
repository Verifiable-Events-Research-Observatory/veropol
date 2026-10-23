(function () {
    const root = document.getElementById('adminRoot');
    const state = { tab: 'pending', q: '' };

    function node(tag, cls, text) {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text !== undefined) n.textContent = text;
        return n;
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

    function message(text, link) {
        root.innerHTML = '';
        const p = node('div', 'admin-msg', text);
        if (link) {
            p.appendChild(document.createElement('br'));
            const a = node('a', 'link-btn', link.label);
            a.href = link.href;
            p.appendChild(a);
        }
        root.appendChild(p);
    }

    function button(label, cls, fn) {
        const b = node('button', cls || '', label);
        b.type = 'button';
        b.addEventListener('click', async () => {
            b.disabled = true;
            await fn();
            b.disabled = false;
        });
        return b;
    }

    function meta(list) {
        const wrap = node('div', 'admin-meta');
        list.forEach(m => wrap.appendChild(node('span', m.cls || '', m.text)));
        return wrap;
    }

    async function setStatus(id, status) {
        await api('/api/admin/articles/' + id + '/status', 'POST', { status });
        load();
    }

    async function userFlag(id, flags, ask) {
        if (ask && !window.confirm(ask)) return;
        await api('/api/admin/users/' + id, 'POST', flags);
        load();
    }

    function articleCard(a) {
        const card = node('article', 'admin-card');
        card.appendChild(node('h3', '', a.title));
        card.appendChild(meta([
            { text: a.category },
            { text: a.language.toUpperCase() },
            { text: new Date(a.createdAt).toLocaleString() },
            { text: a.status, cls: a.status === 'approved' ? 'ok' : a.status === 'rejected' ? 'bad' : '' }
        ]));
        card.appendChild(node('p', '', a.summary));
        if (a.coverUrl) {
            const img = node('img', 'admin-cover');
            img.src = a.coverUrl;
            img.alt = '';
            card.appendChild(img);
        }
        const body = node('div', 'admin-body', a.body);
        body.hidden = true;
        body.setAttribute('dir', 'auto');
        card.appendChild(body);
        const au = a.author;
        if (au) {
            const box = node('div', 'admin-author');
            const av = node('img', 'avatar-img');
            av.src = au.avatarUrl || VT.DEFAULT_AVATAR;
            av.alt = '';
            box.appendChild(av);
            const info = node('div');
            info.appendChild(node('b', '', au.name + (au.verified ? ' (verified)' : '') + (au.banned ? ' (banned)' : '')));
            info.appendChild(document.createTextNode(au.email + ' · ' + au.age + ' · ' + au.nationality + ' · lives in ' + au.residence));
            box.appendChild(info);
            card.appendChild(box);
        }
        const actions = node('div', 'admin-actions');
        actions.appendChild(button('Read full text', '', async () => { body.hidden = !body.hidden; }));
        if (a.status !== 'approved') actions.appendChild(button('Approve', 'good', () => setStatus(a.id, 'approved')));
        if (a.status !== 'rejected') actions.appendChild(button('Reject', '', () => setStatus(a.id, 'rejected')));
        if (a.status === 'approved') {
            const view = node('a', 'link-btn', 'Open');
            view.href = '/articles/' + encodeURIComponent(a.slug);
            view.target = '_blank';
            actions.appendChild(view);
        }
        actions.appendChild(button('Delete', 'danger', async () => {
            if (!window.confirm('Delete this article permanently?')) return;
            await api('/api/articles/' + a.id, 'DELETE');
            load();
        }));
        if (au) {
            actions.appendChild(button(au.verified ? 'Remove verified badge' : 'Mark author verified', '', () => userFlag(au.id, { verified: !au.verified })));
            actions.appendChild(button(au.banned ? 'Unban author' : 'Ban author and reject their articles', 'danger', () => userFlag(au.id, { banned: !au.banned }, au.banned ? '' : 'Ban this author and reject all of their articles?')));
        }
        card.appendChild(actions);
        return card;
    }

    function userCard(u) {
        const card = node('article', 'admin-card');
        const row = node('div', 'admin-author');
        const av = node('img', 'avatar-img');
        av.src = u.avatarUrl || VT.DEFAULT_AVATAR;
        av.alt = '';
        row.appendChild(av);
        const info = node('div');
        info.appendChild(node('b', '', u.firstName + ' ' + u.lastName + (u.verified ? ' (verified)' : '') + (u.banned ? ' (banned)' : '') + (u.isAdmin ? ' (admin)' : '')));
        info.appendChild(document.createTextNode(u.email + ' · ' + u.age + ' · ' + u.nationality + ' · lives in ' + u.residence));
        row.appendChild(info);
        card.appendChild(row);
        if (!u.isAdmin) {
            const actions = node('div', 'admin-actions');
            actions.appendChild(button(u.verified ? 'Remove verified badge' : 'Mark verified', '', () => userFlag(u.id, { verified: !u.verified })));
            actions.appendChild(button(u.banned ? 'Unban' : 'Ban and reject their articles', 'danger', () => userFlag(u.id, { banned: !u.banned }, u.banned ? '' : 'Ban this user and reject all of their articles?')));
            card.appendChild(actions);
        }
        return card;
    }

    async function load() {
        message('Loading...');
        if (state.tab === 'users') {
            const r = await api('/api/admin/users?q=' + encodeURIComponent(state.q));
            if (!r.ok) return message('Could not load users.');
            root.innerHTML = '';
            const search = node('input', 'admin-search');
            search.type = 'search';
            search.placeholder = 'Search by name or email';
            search.value = state.q;
            search.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    state.q = search.value.trim();
                    load();
                }
            });
            root.appendChild(search);
            const list = node('div', 'admin-list');
            r.data.users.forEach(u => list.appendChild(userCard(u)));
            if (!r.data.users.length) list.appendChild(node('div', 'admin-msg', 'No users found.'));
            root.appendChild(list);
            return;
        }
        const r = await api('/api/admin/articles?status=' + state.tab);
        if (!r.ok) return message('Could not load articles.');
        root.innerHTML = '';
        const list = node('div', 'admin-list');
        r.data.articles.forEach(a => list.appendChild(articleCard(a)));
        if (!r.data.articles.length) list.appendChild(node('div', 'admin-msg', 'Nothing here.'));
        root.appendChild(list);
    }

    document.querySelectorAll('#adminTabs button').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('#adminTabs button').forEach(x => x.classList.toggle('active', x === b));
            state.tab = b.dataset.tab;
            load();
        });
    });

    VT.ready.then(() => VT.meReady).then(() => {
        const u = VT.me.user;
        if (!u) return message('Please sign in first.', { href: '/articles#account', label: 'Go to sign in' });
        if (!u.isAdmin) return message('This account is not an administrator.', { href: '/articles', label: 'Back to articles' });
        document.getElementById('adminWho').textContent = u.email;
        load();
    });
})();
