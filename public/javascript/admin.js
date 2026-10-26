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

    function badgeToggles(userId, owned) {
        const wrap = node('div', 'badge-toggles');
        ['verified', 'expert', 'editor'].forEach(id => {
            const meta2 = VT.BADGES.find(b => b.id === id);
            const has = (owned || []).includes(id);
            const b = button((has ? 'Remove ' : 'Give ') + meta2.label, 'badge-toggle' + (has ? ' on' : ''), () => userFlag(userId, { badge: id, on: !has }));
            b.style.setProperty('--bc', meta2.color);
            wrap.appendChild(b);
        });
        return wrap;
    }

    function ageText(age) {
        return age === null || age === undefined ? '' : ' · age ' + age;
    }

    function articleCard(a) {
        const card = node('article', 'admin-card');
        card.appendChild(node('h3', '', a.title));
        card.appendChild(meta([
            { text: a.category },
            { text: a.language.toUpperCase() },
            { text: new Date(a.createdAt).toLocaleString() },
            { text: a.status, cls: a.status === 'approved' ? 'ok' : a.status === 'rejected' ? 'bad' : '' },
            { text: a.likeCount + ' likes · ' + a.dislikeCount + ' dislikes · ' + a.commentCount + ' comments' }
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
            info.appendChild(node('b', '', au.name + ' (@' + au.username + ')' + ((au.badges || []).length ? ' [' + au.badges.join(', ') + ']' : '') + (au.banned ? ' (banned)' : '')));
            info.appendChild(document.createTextNode(au.email + ageText(au.age)));
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
            if (!au.isAdmin) {
                actions.appendChild(button(au.banned ? 'Unban author' : 'Ban author and reject their articles', 'danger', () => userFlag(au.id, { banned: !au.banned }, au.banned ? '' : 'Ban this author and reject all of their articles?')));
                card.appendChild(actions);
                card.appendChild(badgeToggles(au.id, au.badges));
                return card;
            }
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
        info.appendChild(node('b', '', u.name + ' (@' + u.username + ')' + ((u.badges || []).length ? ' [' + u.badges.join(', ') + ']' : '') + (u.banned ? ' (banned)' : '') + (u.isAdmin ? ' (admin)' : '')));
        info.appendChild(document.createTextNode(u.email + ageText(u.age) + (u.isMinor ? ' · minor' : '')));
        row.appendChild(info);
        card.appendChild(row);
        if (!u.isAdmin) {
            const actions = node('div', 'admin-actions');
            actions.appendChild(button(u.banned ? 'Unban' : 'Ban and reject their articles', 'danger', () => userFlag(u.id, { banned: !u.banned }, u.banned ? '' : 'Ban this user and reject all of their articles?')));
            card.appendChild(actions);
            card.appendChild(badgeToggles(u.id, u.badges));
        }
        return card;
    }

    function feedbackCard(f) {
        const card = node('article', 'admin-card' + (f.read ? ' is-read' : ''));
        card.appendChild(meta([
            { text: f.topic + (f.otherTopic ? ': ' + f.otherTopic : '') },
            { text: new Date(f.date).toLocaleString() },
            { text: f.page || '-' },
            { text: f.mailed ? 'emailed' : 'not emailed', cls: f.mailed ? 'ok' : 'bad' },
            { text: f.read ? 'read' : 'new', cls: f.read ? '' : 'ok' }
        ]));
        const who = node('div', 'admin-author');
        const info = node('div');
        info.appendChild(node('b', '', f.name || 'Anonymous'));
        info.appendChild(document.createTextNode(f.email || 'no email left'));
        who.appendChild(info);
        card.appendChild(who);
        const body = node('div', 'admin-body', f.message);
        body.setAttribute('dir', 'auto');
        card.appendChild(body);
        const actions = node('div', 'admin-actions');
        actions.appendChild(button(f.read ? 'Mark as new' : 'Mark as read', f.read ? '' : 'good', async () => {
            await api('/api/admin/feedback/' + f.id, 'POST', { read: !f.read });
            load();
        }));
        if (f.email) {
            const reply = node('a', 'link-btn', 'Reply by email');
            reply.href = 'mailto:' + f.email + '?subject=' + encodeURIComponent('Re: VERO feedback');
            actions.appendChild(reply);
        }
        actions.appendChild(button('Delete', 'danger', async () => {
            if (!window.confirm('Delete this feedback permanently?')) return;
            await api('/api/admin/feedback/' + f.id, 'DELETE');
            load();
        }));
        card.appendChild(actions);
        return card;
    }

    function grantTool() {
        const box = node('div', 'admin-tool');
        box.appendChild(node('h3', '', 'Give or remove a badge by username'));
        const row = node('div', 'admin-tool-row');
        const input = node('input');
        input.type = 'text';
        input.placeholder = '@username';
        input.autocapitalize = 'none';
        const select = node('select');
        ['verified', 'expert', 'editor'].forEach(id => {
            const o = node('option', '', VT.BADGES.find(b => b.id === id).label);
            o.value = id;
            select.appendChild(o);
        });
        const out = node('p', 'admin-note', '');
        const run = on => async () => {
            const name = input.value.trim().replace(/^@/, '').toLowerCase();
            if (!name) return;
            const r = await api('/api/admin/badges', 'POST', { username: name, badge: select.value, on });
            out.textContent = r.ok ? (on ? 'Badge given to @' : 'Badge removed from @') + name : r.status === 404 ? 'No user with that username.' : 'Could not update the badge.';
            if (r.ok) load();
        };
        row.appendChild(input);
        row.appendChild(select);
        row.appendChild(button('Give', 'good', run(true)));
        row.appendChild(button('Remove', 'danger', run(false)));
        box.appendChild(row);
        box.appendChild(out);
        return box;
    }

    function broadcastTool() {
        const box = node('div', 'admin-tool');
        box.appendChild(node('h3', '', 'Send a notification to every user'));
        box.appendChild(node('p', 'admin-note', 'Use it for breaking updates and official announcements. Users who turned announcements off will not receive it.'));
        const row = node('div', 'admin-tool-row');
        const title = node('input');
        title.type = 'text';
        title.maxLength = 120;
        title.placeholder = 'Title (required)';
        const link = node('input');
        link.type = 'text';
        link.maxLength = 300;
        link.placeholder = 'Link (optional, e.g. /articles)';
        const text = node('textarea');
        text.rows = 3;
        text.maxLength = 280;
        text.placeholder = 'Short message (optional)';
        const out = node('p', 'admin-note', '');
        row.appendChild(title);
        row.appendChild(link);
        row.appendChild(text);
        row.appendChild(button('Send to everyone', 'good', async () => {
            if (title.value.trim().length < 3) {
                out.textContent = 'The title needs at least 3 characters.';
                return;
            }
            if (!window.confirm('Send this notification to all users?')) return;
            const r = await api('/api/admin/broadcast', 'POST', { title: title.value, text: text.value, link: link.value });
            out.textContent = r.ok ? 'Sent to ' + r.data.sent + ' users.' : r.status === 429 ? 'Too many broadcasts. Try again later.' : 'Could not send the notification.';
            if (r.ok) {
                title.value = '';
                text.value = '';
                link.value = '';
            }
        }));
        box.appendChild(row);
        box.appendChild(out);
        return box;
    }

    async function load() {
        message('Loading...');
        if (state.tab === 'broadcast') {
            root.innerHTML = '';
            root.appendChild(broadcastTool());
            return;
        }
        if (state.tab === 'feedback') {
            const r = await api('/api/admin/feedback');
            if (!r.ok) return message('Could not load feedback.');
            root.innerHTML = '';
            const list = node('div', 'admin-list');
            r.data.items.forEach(f => list.appendChild(feedbackCard(f)));
            if (!r.data.items.length) list.appendChild(node('div', 'admin-msg', 'No feedback yet.'));
            root.appendChild(list);
            return;
        }
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
            root.appendChild(grantTool());
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
        if (!u.isAdmin) return message('Not found.', { href: '/', label: 'Back to home' });
        document.getElementById('adminWho').textContent = u.email;
        load();
    });
})();
