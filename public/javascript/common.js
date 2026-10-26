(function () {
    const LANGS = {
        en: { code: 'EN', flag: 'gb', dir: 'ltr', locale: 'en-US', name: 'English' },
        fr: { code: 'FR', flag: 'fr', dir: 'ltr', locale: 'fr-FR', name: 'Français' },
        es: { code: 'ES', flag: 'es', dir: 'ltr', locale: 'es-ES', name: 'Español' },
        ru: { code: 'RU', flag: 'ru', dir: 'ltr', locale: 'ru-RU', name: 'Русский' },
        ar: { code: 'AR', flag: 'sa', dir: 'rtl', locale: 'ar-u-ca-gregory-nu-latn', name: 'العربية' },
        zh: { code: 'ZH', flag: 'cn', dir: 'ltr', locale: 'zh-CN', name: '中文' },
        tr: { code: 'TR', flag: 'tr', dir: 'ltr', locale: 'tr-TR', name: 'Türkçe' }
    };
    const TARGETS = { zh: 'zh-CN' };
    const FONT_URLS = {
        ar: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap',
        zh: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap'
    };
    const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='%23262630'/><circle cx='32' cy='25' r='11' fill='%238D8984'/><path d='M10 64c2-14 12-22 22-22s20 8 22 22z' fill='%238D8984'/></svg>";
    const NOI18N = document.documentElement.hasAttribute('data-noi18n');
    const LANG_KEY = 'vero_lang';
    const CACHE_KEY = 'vero_tc5';
    const ATTRS = { 'data-tr-ph': 'placeholder', 'data-tr-aria': 'aria-label', 'data-tr-alt': 'alt', 'data-tr-title': 'title' };
    const mem = new Map();
    const tried = new Set();
    const fontsLoaded = new Set();
    let lang = 'en';
    let saveTimer;
    let auroraRGB = '255,138,76';

    function initLogos() {
        document.querySelectorAll('img.brand-logo').forEach(img => {
            img.dataset.vl = '1';
            img.addEventListener('error', () => {
                if (!img.dataset.f) {
                    img.dataset.f = '1';
                    img.removeAttribute('srcset');
                    img.src = '/assets/icon-192.png';
                } else img.style.display = 'none';
            });
            if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event('error'));
        });
    }

    function ago(iso) {
        try {
            const rtf = new Intl.RelativeTimeFormat(LANGS[lang].locale, { numeric: 'auto' });
            const m = Math.round((Date.parse(iso) - Date.now()) / 60000);
            if (Math.abs(m) < 60) return rtf.format(Math.min(m, -1), 'minute');
            const h = Math.round(m / 60);
            if (Math.abs(h) < 48) return rtf.format(h, 'hour');
            return rtf.format(Math.round(h / 24), 'day');
        } catch (e) {
            return '';
        }
    }

    try {
        const stored = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        Object.keys(stored).forEach(k => mem.set(k, stored[k]));
    } catch (e) { }

    function saveCache() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            try {
                const o = {};
                [...mem.keys()].slice(-2500).forEach(k => { o[k] = mem.get(k); });
                localStorage.setItem(CACHE_KEY, JSON.stringify(o));
            } catch (e) { }
        }, 600);
    }

    async function browserOne(text, target, source) {
        try {
            const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + encodeURIComponent(source || 'auto') + '&tl=' + encodeURIComponent(TARGETS[target] || target) + '&dt=t&q=' + encodeURIComponent(text);
            const r = await fetch(url);
            if (!r.ok) return null;
            const d = await r.json();
            if (!Array.isArray(d) || !Array.isArray(d[0])) return null;
            return { text: d[0].map(p => (p && p[0]) ? p[0] : '').join(''), detected: typeof d[2] === 'string' ? d[2] : null };
        } catch (e) {
            return null;
        }
    }

    async function browserFill(list, target, source) {
        let i = 0;
        await Promise.all(Array.from({ length: Math.min(4, list.length) }, async () => {
            while (i < list.length) {
                const t = list[i++];
                const r = await browserOne(t, target, source);
                if (r && r.text && r.text !== t) mem.set(target + '|' + t, r.text);
            }
        }));
    }

    async function load(texts, l, auto) {
        const target = l || lang;
        if (target === 'en' && !auto) return;
        const need = [...new Set(texts.filter(x => x && x.trim() && x.length <= 1500 && !mem.has(target + '|' + x) && !tried.has(target + '|' + x)))];
        if (!need.length) return;
        need.forEach(x => tried.add(target + '|' + x));
        const batches = [];
        let cur = [];
        let chars = 0;
        need.forEach(x => {
            if (cur.length >= 100 || chars + x.length > 30000) {
                batches.push(cur);
                cur = [];
                chars = 0;
            }
            cur.push(x);
            chars += x.length;
        });
        if (cur.length) batches.push(cur);
        const failed = [];
        for (let i = 0; i < batches.length; i += 3) {
            await Promise.all(batches.slice(i, i + 3).map(async b => {
                try {
                    const r = await fetch('/api/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ texts: b, lang: target, auto: !!auto })
                    });
                    if (!r.ok) {
                        failed.push(...b);
                        return;
                    }
                    const d = await r.json();
                    if (!Array.isArray(d.translations) || d.translations.length !== b.length) {
                        failed.push(...b);
                        return;
                    }
                    b.forEach((x, k) => {
                        const v = d.translations[k];
                        if (v === null || v === undefined) failed.push(x);
                        else if (v !== x) mem.set(target + '|' + x, v);
                    });
                } catch (e) {
                    failed.push(...b);
                }
            }));
        }
        if (failed.length) await browserFill(failed, target, auto ? null : 'en');
        saveCache();
    }

    function s(text) {
        if (lang === 'en' || !text) return text;
        return mem.get(lang + '|' + text) || text;
    }

    function tx(text) {
        if (!text) return text;
        return mem.get(lang + '|' + text) || text;
    }

    async function t(text) {
        await load([text]);
        return s(text);
    }

    async function expandBrowser(q) {
        const d = await browserOne(q, 'en', null);
        if (!d) return null;
        const english = d.text || q;
        const vars = [];
        await Promise.all(['ar', 'fr', 'es', 'ru', 'zh', 'tr'].map(async l => {
            const r = await browserOne(english, l, 'en');
            if (r && r.text) vars.push(r.text);
        }));
        return { english, detected: d.detected, vars };
    }

    function collect(root) {
        const items = [];
        root.querySelectorAll('[data-tr]').forEach(el => {
            if (el._en === undefined) el._en = el.textContent.trim();
            items.push({ el, attr: null, en: el._en });
        });
        Object.keys(ATTRS).forEach(sel => {
            root.querySelectorAll('[' + sel + ']').forEach(el => {
                const attr = ATTRS[sel];
                el._enA = el._enA || {};
                if (el._enA[attr] === undefined) el._enA[attr] = el.getAttribute(attr) || '';
                items.push({ el, attr, en: el._enA[attr] });
            });
        });
        return items;
    }

    async function apply(root) {
        const scope = root || document;
        const items = collect(scope);
        const current = lang;
        const withTitle = scope === document && document.documentElement.hasAttribute('data-tr-title');
        if (withTitle && document._enTitle === undefined) document._enTitle = document.title;
        if (current !== 'en') await load(items.map(i => i.en).concat(withTitle ? [document._enTitle] : []), current);
        if (current !== lang) return;
        items.forEach(i => {
            const value = current === 'en' ? i.en : (mem.get(current + '|' + i.en) || i.en);
            if (i.attr) i.el.setAttribute(i.attr, value);
            else i.el.textContent = value;
        });
        if (withTitle) document.title = current === 'en' ? document._enTitle : s(document._enTitle);
    }

    function ensureFonts(l) {
        if (!FONT_URLS[l] || fontsLoaded.has(l)) return;
        fontsLoaded.add(l);
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = FONT_URLS[l];
        document.head.appendChild(link);
    }

    function flagUrl(code) {
        return 'https://hatscripts.github.io/circle-flags/flags/' + code + '.svg';
    }

    async function setLang(l) {
        if (!LANGS[l]) l = 'en';
        const prev = lang;
        lang = l;
        if (!NOI18N) {
            try { localStorage.setItem(LANG_KEY, l); } catch (e) { }
        }
        const m = LANGS[l];
        ensureFonts(l);
        document.documentElement.lang = l;
        document.documentElement.dir = m.dir;
        const flag = document.getElementById('langFlag');
        const code = document.getElementById('langCode');
        if (flag) {
            delete flag.dataset.fallback;
            flag.src = flagUrl(m.flag);
        }
        if (code) code.textContent = m.code;
        document.querySelectorAll('.lang-item').forEach(item => item.classList.toggle('active', item.dataset.lang === l));
        document.body.classList.add('vt-busy');
        await apply(document);
        document.body.classList.remove('vt-busy');
        window.dispatchEvent(new CustomEvent('vero:lang', { detail: { lang: l, prev } }));
    }

    function toast(text, icon) {
        let box = document.getElementById('toastBox');
        if (!box) {
            box = document.createElement('div');
            box.id = 'toastBox';
            box.className = 'toast-box';
            box.setAttribute('role', 'status');
            document.body.appendChild(box);
        }
        const el = document.createElement('div');
        el.className = 'toast';
        el.innerHTML = '<i class="ph ' + (icon || 'ph-translate') + '"></i><span></span>';
        el.querySelector('span').textContent = text;
        box.appendChild(el);
        requestAnimationFrame(() => el.classList.add('show'));
        setTimeout(() => {
            el.classList.remove('show');
            setTimeout(() => el.remove(), 400);
        }, 3600);
    }

    function initTheme() {
        const icon = document.getElementById('themeIcon');
        const btn = document.getElementById('themeToggle');
        const paint = theme => {
            document.documentElement.setAttribute('data-theme', theme);
            auroraRGB = theme === 'dark' ? '255,138,76' : '196,64,24';
            try { localStorage.setItem('vero_theme', theme); } catch (e) { }
            if (icon) icon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
        };
        paint(document.documentElement.getAttribute('data-theme') || 'dark');
        if (btn) btn.addEventListener('click', () => paint(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
    }

    function initLangMenu() {
        const btn = document.getElementById('langToggle');
        const menu = document.getElementById('langMenu');
        if (!btn || !menu) return;
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const open = menu.classList.toggle('show');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        menu.addEventListener('click', e => {
            const item = e.target.closest('.lang-item');
            if (!item) return;
            e.stopPropagation();
            menu.classList.remove('show');
            setLang(item.dataset.lang);
        });
        document.addEventListener('click', e => {
            if (!menu.contains(e.target) && !btn.contains(e.target)) menu.classList.remove('show');
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') menu.classList.remove('show');
        });
        document.querySelectorAll('.flag-icon').forEach(img => {
            img.addEventListener('error', () => {
                const match = img.src.match(/flags\/([a-z]+)\.svg/);
                if (match && !img.dataset.fallback) {
                    img.dataset.fallback = '1';
                    img.src = 'https://flagcdn.com/w80/' + match[1] + '.png';
                }
            });
        });
    }

    function initNav() {
        const nav = document.getElementById('navbar');
        const burger = document.getElementById('navBurger');
        const links = document.getElementById('navLinks');
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
                ticking = false;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        if (burger && links) {
            burger.addEventListener('click', () => {
                const open = links.classList.toggle('open');
                burger.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            links.addEventListener('click', e => {
                if (e.target.closest('a')) links.classList.remove('open');
            });
        }
    }

    let sourcesLoaded = false;
    async function loadSources() {
        if (sourcesLoaded) return;
        const list = document.getElementById('sourcesList');
        if (!list) return;
        try {
            const r = await fetch('/api/sources');
            if (!r.ok) return;
            const d = await r.json();
            list.innerHTML = '';
            d.sources.forEach(src => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = 'https://' + src.domain;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = src.name;
                const reg = document.createElement('span');
                reg.setAttribute('data-tr', '');
                reg.textContent = src.region;
                li.appendChild(a);
                li.appendChild(reg);
                list.appendChild(li);
            });
            sourcesLoaded = true;
            apply(list);
        } catch (e) { }
    }

    function initModals() {
        const close = overlay => overlay.classList.remove('active');
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                const overlay = document.getElementById('modal-' + btn.dataset.modal);
                if (!overlay) return;
                overlay.classList.add('active');
                if (btn.dataset.modal === 'methodology') loadSources();
            });
        });
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', e => {
                if (e.target === overlay || e.target.closest('[data-close]')) close(overlay);
            });
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.active').forEach(close);
        });
        if (location.hash.startsWith('#modal-')) {
            const overlay = document.getElementById(location.hash.slice(1));
            if (overlay) {
                overlay.classList.add('active');
                if (overlay.id === 'modal-methodology') loadSources();
            }
        }
    }

    function initReveal() {
        const nodes = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window)) {
            nodes.forEach(n => n.classList.add('in'));
            return;
        }
        const io = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (en.isIntersecting) {
                    en.target.classList.add('in');
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
        nodes.forEach(n => io.observe(n));
    }

    function initAurora() {
        const canvas = document.getElementById('aurora');
        if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = canvas.getContext('2d');
        const weak = (navigator.hardwareConcurrency || 4) <= 4 || window.innerWidth < 700;
        const count = weak ? 26 : 44;
        const link = weak ? 140 : 170;
        const frame = 1000 / 30;
        const nodes = Array.from({ length: count }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.0003, vy: (Math.random() - 0.5) * 0.0003 }));
        let w = 0;
        let h = 0;
        let raf = 0;
        let last = 0;
        let visible = true;
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        const draw = now => {
            raf = 0;
            if (!visible || document.hidden) return;
            raf = requestAnimationFrame(draw);
            if (now - last < frame) return;
            const step = Math.min(now - last, 100);
            last = now;
            ctx.clearRect(0, 0, w, h);
            const lim = link * link;
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.x += n.vx * step;
                n.y += n.vy * step;
                if (n.x < 0 || n.x > 1) n.vx *= -1;
                if (n.y < 0 || n.y > 1) n.vy *= -1;
            }
            ctx.lineWidth = 1;
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i];
                const ax = a.x * w;
                const ay = a.y * h;
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = ax - nodes[j].x * w;
                    const dy = ay - nodes[j].y * h;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < lim) {
                        ctx.strokeStyle = 'rgba(' + auroraRGB + ',' + (0.2 * (1 - d2 / lim)).toFixed(3) + ')';
                        ctx.beginPath();
                        ctx.moveTo(ax, ay);
                        ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
                        ctx.stroke();
                    }
                }
                ctx.fillStyle = 'rgba(' + auroraRGB + ',0.55)';
                ctx.beginPath();
                ctx.arc(ax, ay, 1.6, 0, 6.2832);
                ctx.fill();
            }
        };
        const start = () => {
            if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw);
        };
        resize();
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 150);
        });
        document.addEventListener('visibilitychange', start);
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
                visible = entries[0].isIntersecting;
                start();
            }).observe(canvas);
        }
        start();
    }

    const USER_SVG = '<svg class="user-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8.2" r="3.7"/><path d="M5 20c.9-4 3.6-6.2 7-6.2s6.1 2.2 7 6.2"/></svg>';
    const AVATAR_PRESETS = Array.from({ length: 12 }, (_, i) => 'nature-' + String(i + 1).padStart(2, '0'));
    const BADGES = [
        { id: 'official', label: 'VERO Official', icon: 'ph-fill ph-seal-check', color: '#ff8a4c', how: 'Reserved for the official VERO account. It cannot be requested or earned.' },
        { id: 'verified', label: 'Verified Author', icon: 'ph-fill ph-seal-check', color: '#38bdf8', how: 'Granted by the VERO editorial team after an identity and quality review of an author. It cannot be purchased.' },
        { id: 'expert', label: 'Subject Expert', icon: 'ph-fill ph-graduation-cap', color: '#a78bfa', how: 'Awarded by the editorial team to contributors with proven expertise in a region or field.' },
        { id: 'editor', label: 'Editors Pick', icon: 'ph-fill ph-star', color: '#fbbf24', how: 'Awarded by the editorial team to authors whose articles are regularly featured for their quality.' },
        { id: 'early', label: 'Early Member', icon: 'ph-fill ph-rocket-launch', color: '#34d399', how: 'Granted automatically to the first 100 accounts created on VERO.' },
        { id: 'author', label: 'Published Author', icon: 'ph-fill ph-pen-nib', color: '#f472b6', how: 'Granted automatically when your first article is approved and published.' }
    ];
    const BADGE_MAP = {};
    BADGES.forEach(b => { BADGE_MAP[b.id] = b; });

    function badgeEl(id, big) {
        const b = BADGE_MAP[id];
        if (!b) return null;
        const el = document.createElement('span');
        el.className = 'badge-ico' + (big ? ' big' : '') + (id === 'official' ? ' official' : '');
        el.style.setProperty('--bc', b.color);
        el.title = s(b.label);
        if (id === 'official') {
            const im = document.createElement('img');
            im.src = '/assets/logo-96.webp';
            im.alt = '';
            im.width = big ? 28 : 16;
            im.height = big ? 28 : 16;
            el.appendChild(im);
        } else {
            const i = document.createElement('i');
            i.className = b.icon;
            el.appendChild(i);
        }
        return el;
    }

    function badgeRow(ids, big) {
        const row = document.createElement('span');
        row.className = 'badge-row';
        (ids || []).filter(x => x === 'official' || x === 'verified' || x === 'expert' || x === 'editor').forEach(x => {
            const e = badgeEl(x, big);
            if (e) row.appendChild(e);
        });
        return row;
    }

    const me = { user: null };

    function paintAccount() {
        document.querySelectorAll('#accountBtn').forEach(btn => {
            btn.innerHTML = '';
            if (me.user) {
                const img = document.createElement('img');
                img.className = 'nav-avatar';
                img.alt = '';
                img.width = 40;
                img.height = 40;
                img.decoding = 'async';
                img.src = me.user.avatarUrl || DEFAULT_AVATAR;
                img.addEventListener('error', () => { img.src = DEFAULT_AVATAR; });
                btn.appendChild(img);
                btn.classList.add('signed');
                btn.title = '@' + (me.user.username || me.user.name);
            } else {
                btn.insertAdjacentHTML('beforeend', USER_SVG);
                btn.classList.remove('signed');
                btn.removeAttribute('title');
            }
        });
        paintBell();
    }

    const bell = { timer: 0, open: false, items: [], unread: 0, lastSeen: '' };
    const NOTE_TXT = {
        follow: '{n} started following you',
        article: '{n} published a new article',
        comment: '{n} commented on your article',
        like: '{n} liked your article',
        announce: 'VERO announcement',
        empty: 'No notifications yet.',
        markAll: 'Mark all as read',
        settings: 'Notification settings',
        title: 'Notifications',
        clear: 'Clear all'
    };

    function noteText(n) {
        if (n.type === 'announce') return n.title || s(NOTE_TXT.announce);
        return s(NOTE_TXT[n.type] || NOTE_TXT.announce).replace('{n}', n.actorName || 'VERO');
    }

    function noteIcon(type) {
        return { follow: 'ph-user-plus', article: 'ph-newspaper', comment: 'ph-chat-circle-text', like: 'ph-thumbs-up', announce: 'ph-megaphone' }[type] || 'ph-bell';
    }

    function bellCount(n) {
        bell.unread = n;
        const b = document.getElementById('notifBadge');
        if (!b) return;
        b.textContent = n > 99 ? '99+' : String(n);
        b.hidden = !n;
    }

    function paintBell() {
        const nav = document.getElementById('navLinks');
        const acc = document.getElementById('accountBtn');
        let btn = document.getElementById('notifBtn');
        if (!me.user || !nav || !acc) {
            if (btn) btn.remove();
            const panel = document.getElementById('notifPanel');
            if (panel) panel.remove();
            clearInterval(bell.timer);
            bell.timer = 0;
            return;
        }
        if (btn) return;
        btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'notifBtn';
        btn.className = 'icon-btn notif-btn';
        btn.setAttribute('aria-label', 'Notifications');
        btn.innerHTML = '<i class="ph ph-bell"></i><span class="notif-badge" id="notifBadge" hidden>0</span>';
        acc.parentNode.insertBefore(btn, acc);
        btn.addEventListener('click', e => {
            e.stopPropagation();
            toggleBell();
        });
        document.addEventListener('click', e => {
            const panel = document.getElementById('notifPanel');
            if (panel && !panel.hidden && !panel.contains(e.target) && !e.target.closest('#notifBtn')) closeBell();
        });
        pollBell(true);
        bell.timer = setInterval(() => { if (!document.hidden) pollBell(false); }, 45000);
    }

    async function pollBell(first) {
        if (!me.user) return;
        try {
            const r = await fetch('/api/notifications?count=1', { credentials: 'same-origin' });
            if (!r.ok) return;
            const d = await r.json();
            bellCount(d.unread || 0);
            const latest = d.latest;
            if (latest && latest.id !== bell.lastSeen) {
                const fresh = bell.lastSeen !== '' && !first;
                bell.lastSeen = latest.id;
                if (fresh && me.user.notify && me.user.notify.browser && 'Notification' in window && Notification.permission === 'granted') {
                    try {
                        const n = new Notification('VERO', { body: noteText(latest), icon: '/assets/icon-192.png', tag: latest.id });
                        n.onclick = () => {
                            window.focus();
                            if (latest.link) location.href = latest.link;
                        };
                    } catch (e) { }
                }
                if (bell.open) loadBell();
            } else if (!latest) bell.lastSeen = bell.lastSeen || '-';
        } catch (e) { }
    }

    function closeBell() {
        const panel = document.getElementById('notifPanel');
        if (panel) panel.hidden = true;
        bell.open = false;
    }

    async function toggleBell() {
        let panel = document.getElementById('notifPanel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'notifPanel';
            panel.className = 'notif-panel';
            document.body.appendChild(panel);
        }
        if (!panel.hidden && bell.open) return closeBell();
        panel.hidden = false;
        bell.open = true;
        await load(Object.values(NOTE_TXT));
        loadBell();
    }

    async function loadBell() {
        const panel = document.getElementById('notifPanel');
        if (!panel) return;
        let d = { items: [], unread: 0 };
        try {
            const r = await fetch('/api/notifications', { credentials: 'same-origin' });
            if (r.ok) d = await r.json();
        } catch (e) { }
        bell.items = d.items || [];
        bellCount(d.unread || 0);
        panel.innerHTML = '';
        const head = document.createElement('div');
        head.className = 'notif-head';
        const h = document.createElement('strong');
        h.textContent = s(NOTE_TXT.title);
        head.appendChild(h);
        const actions = document.createElement('div');
        actions.className = 'notif-actions';
        const mark = document.createElement('button');
        mark.type = 'button';
        mark.textContent = s(NOTE_TXT.markAll);
        mark.addEventListener('click', async () => {
            await fetch('/api/notifications/read', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}' });
            loadBell();
        });
        actions.appendChild(mark);
        const set = document.createElement('a');
        set.href = '/articles#settings';
        set.setAttribute('aria-label', s(NOTE_TXT.settings));
        set.title = s(NOTE_TXT.settings);
        set.innerHTML = '<i class="ph ph-gear-six"></i>';
        actions.appendChild(set);
        head.appendChild(actions);
        panel.appendChild(head);
        const list = document.createElement('div');
        list.className = 'notif-list';
        if (!bell.items.length) {
            const e = document.createElement('p');
            e.className = 'notif-empty';
            e.textContent = s(NOTE_TXT.empty);
            list.appendChild(e);
        }
        bell.items.forEach(n => {
            const row = document.createElement(n.link ? 'a' : 'div');
            row.className = 'notif-item' + (n.read ? '' : ' unread');
            if (n.link) row.href = n.link;
            const ico = document.createElement('span');
            ico.className = 'notif-ico';
            if (n.actorAvatar && n.type !== 'announce') {
                const im = document.createElement('img');
                im.src = n.actorAvatar;
                im.alt = '';
                im.width = 40;
                im.height = 40;
                ico.appendChild(im);
            } else ico.innerHTML = '<i class="ph-fill ' + noteIcon(n.type) + '"></i>';
            row.appendChild(ico);
            const body = document.createElement('span');
            body.className = 'notif-body';
            const t = document.createElement('b');
            t.textContent = noteText(n);
            body.appendChild(t);
            const sub = n.type === 'announce' ? n.text : (n.title || n.text);
            if (sub) {
                const sp = document.createElement('small');
                sp.textContent = sub;
                body.appendChild(sp);
            }
            const when = document.createElement('em');
            when.textContent = ago(n.createdAt);
            body.appendChild(when);
            row.appendChild(body);
            row.addEventListener('click', () => {
                if (!n.read) fetch('/api/notifications/read', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: n.id }) });
            });
            list.appendChild(row);
        });
        panel.appendChild(list);
    }

    async function refreshMe() {
        try {
            const r = await fetch('/api/me', { credentials: 'same-origin' });
            const d = r.ok ? await r.json() : { user: null };
            me.user = d.user || null;
        } catch (e) {
            me.user = null;
        }
        paintAccount();
        window.dispatchEvent(new CustomEvent('vero:me', { detail: me.user }));
        return me.user;
    }

    function boot() {
        initTheme();
        initLogos();
        initLangMenu();
        initNav();
        initModals();
        initReveal();
        initAurora();
        let start = 'en';
        if (!NOI18N) {
            try { start = localStorage.getItem(LANG_KEY) || ''; } catch (e) { }
            if (!start) {
                const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
                start = LANGS[nav] ? nav : 'en';
            }
        }
        window.VT.ready = setLang(start);
        window.VT.meReady = refreshMe();
    }

    window.VT = {
        LANGS,
        DEFAULT_AVATAR,
        AVATAR_PRESETS,
        BADGES,
        badgeEl,
        badgeRow,
        me,
        get lang() { return lang; },
        load,
        s,
        tx,
        t,
        apply,
        setLang,
        toast,
        ago,
        expandBrowser,
        refreshMe,
        ready: null,
        meReady: null
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
