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
    const LANG_KEY = 'vero_lang';
    const CACHE_KEY = 'vero_tc3';
    const ATTRS = { 'data-tr-ph': 'placeholder', 'data-tr-aria': 'aria-label', 'data-tr-alt': 'alt', 'data-tr-title': 'title' };
    const mem = new Map();
    let lang = 'en';
    let saveTimer;

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
        }, 400);
    }

    async function load(texts, l) {
        const target = l || lang;
        if (target === 'en') return;
        const need = [...new Set(texts.filter(x => x && x.trim() && x.length <= 1500 && !mem.has(target + '|' + x)))];
        if (!need.length) return;
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
        for (let i = 0; i < batches.length; i += 3) {
            await Promise.all(batches.slice(i, i + 3).map(async b => {
                try {
                    const r = await fetch('/api/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ texts: b, lang: target })
                    });
                    if (!r.ok) return;
                    const d = await r.json();
                    if (Array.isArray(d.translations) && d.translations.length === b.length) {
                        b.forEach((x, k) => {
                            const v = d.translations[k];
                            if (v && v !== x) mem.set(target + '|' + x, v);
                        });
                    }
                } catch (e) { }
            }));
        }
        saveCache();
    }

    function s(text) {
        if (lang === 'en' || !text) return text;
        return mem.get(lang + '|' + text) || text;
    }

    async function t(text) {
        await load([text]);
        return s(text);
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
        if (current !== 'en') await load(items.map(i => i.en), current);
        if (current !== lang) return;
        items.forEach(i => {
            const value = current === 'en' ? i.en : (mem.get(current + '|' + i.en) || i.en);
            if (i.attr) i.el.setAttribute(i.attr, value);
            else i.el.textContent = value;
        });
        if (scope === document && document.documentElement.hasAttribute('data-tr-title')) {
            if (document._enTitle === undefined) document._enTitle = document.title;
            document.title = current === 'en' ? document._enTitle : s(document._enTitle);
            if (current !== 'en' && document.title === document._enTitle) {
                await load([document._enTitle], current);
                document.title = s(document._enTitle);
            }
        }
    }

    function flagUrl(code) {
        return 'https://hatscripts.github.io/circle-flags/flags/' + code + '.svg';
    }

    async function setLang(l) {
        if (!LANGS[l]) l = 'en';
        const prev = lang;
        lang = l;
        try { localStorage.setItem(LANG_KEY, l); } catch (e) { }
        const m = LANGS[l];
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
        const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 40);
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
        }, { threshold: 0.08 });
        nodes.forEach(n => io.observe(n));
    }

    function initAurora() {
        const canvas = document.getElementById('aurora');
        if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = canvas.getContext('2d');
        let w = 0;
        let h = 0;
        let raf = 0;
        const nodes = Array.from({ length: 46 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.00022, vy: (Math.random() - 0.5) * 0.00022 }));
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            const dark = document.documentElement.getAttribute('data-theme') === 'dark';
            const rgb = dark ? '255,138,76' : '196,64,24';
            nodes.forEach(n => {
                n.x += n.vx * 16;
                n.y += n.vy * 16;
                if (n.x < 0 || n.x > 1) n.vx *= -1;
                if (n.y < 0 || n.y > 1) n.vy *= -1;
            });
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = (nodes[i].x - nodes[j].x) * w;
                    const dy = (nodes[i].y - nodes[j].y) * h;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 170) {
                        ctx.strokeStyle = 'rgba(' + rgb + ',' + (0.2 * (1 - d / 170)) + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
                        ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
                        ctx.stroke();
                    }
                }
                ctx.fillStyle = 'rgba(' + rgb + ',0.55)';
                ctx.beginPath();
                ctx.arc(nodes[i].x * w, nodes[i].y * h, 1.6, 0, Math.PI * 2);
                ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        };
        resize();
        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) cancelAnimationFrame(raf);
            else raf = requestAnimationFrame(draw);
        });
        raf = requestAnimationFrame(draw);
    }

    function boot() {
        initTheme();
        initLangMenu();
        initNav();
        initModals();
        initReveal();
        initAurora();
        let start = 'en';
        try {
            start = localStorage.getItem(LANG_KEY) || '';
        } catch (e) { }
        if (!start) {
            const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
            start = LANGS[nav] ? nav : 'en';
        }
        window.VT.ready = setLang(start);
    }

    window.VT = {
        LANGS,
        get lang() { return lang; },
        load,
        s,
        t,
        apply,
        setLang,
        toast,
        ready: null
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
