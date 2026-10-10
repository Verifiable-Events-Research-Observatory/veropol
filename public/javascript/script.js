const LANGS = {
    en: { code: 'EN', flag: 'gb', dir: 'ltr', locale: 'en-US' },
    fr: { code: 'FR', flag: 'fr', dir: 'ltr', locale: 'fr-FR' },
    es: { code: 'ES', flag: 'es', dir: 'ltr', locale: 'es-ES' },
    ru: { code: 'RU', flag: 'ru', dir: 'ltr', locale: 'ru-RU' },
    ar: { code: 'AR', flag: 'sa', dir: 'rtl', locale: 'ar-u-ca-gregory-nu-latn' },
    zh: { code: 'ZH', flag: 'cn', dir: 'ltr', locale: 'zh-CN' },
    tr: { code: 'TR', flag: 'tr', dir: 'ltr', locale: 'tr-TR' }
};

const I18N = {};

I18N.en = {
    title: "VERO | Global Intelligence & Strategic Analysis",
    logoAlt: "VERO Logo",
    bannerAlt: "VERO Banner",
    navTheaters: "Strategic Theaters",
    navFeed: "Feed",
    navContact: "Contact",
    themeToggle: "Toggle Theme",
    langToggle: "Change language",
    greetMorning: "Good Morning, Strategist.",
    greetAfternoon: "Good Afternoon, Strategist.",
    greetEvening: "Good Evening, Strategist.",
    s1: "Unfiltered Global Signals. Zero Noise.",
    s2: "Tactical Intelligence Before the Headlines.",
    s3: "Decrypting Geopolitics in Real Time.",
    s4: "High-Fidelity Threat & Policy Monitoring.",
    s5: "Raw Data. Strategic Clarity. Global Reach.",
    heroTitle: "Global Operations & Policy Briefing",
    p0: "Initialize global scan...",
    p1: "Scan global defense news...",
    p2: "Analyze economic sanctions...",
    p3: "Monitor diplomatic summits...",
    p4: "Search conflict theaters...",
    p5: "Initialize tactical briefing...",
    searchAria: "Search",
    radarAria: "Search Radar",
    sg1: "Taiwan Strait",
    sg2: "BRICS",
    sg3: "Nuclear Deterrence",
    sg4: "OPEC+",
    sg5: "NATO Expansion",
    sg6: "Sahel Juntas",
    sg7: "Cyber Warfare",
    sg8: "Red Sea Security",
    sg9: "UN Security Council",
    recent: "Recent",
    clearRecent: "Clear recent searches",
    theatersTitle: "Active Conflict Theaters & Strategic Analysis",
    theatersSub: "Real-time situation maps, theater breakdowns, and dynamic operational monitoring.",
    loadIntel: "Load Intelligence",
    liveMap: "Live Map",
    ukBadge: "Active War Zone",
    ukTitle: "Russo-Ukrainian Conflict",
    ukDesc: "Frontline monitoring, territory changes, and tactical air/artillery activity.",
    ukL1: "Artillery Posture",
    ukL2: "Air Defense",
    meBadge: "Escalation Index",
    meTitle: "Middle East Conflict",
    meDesc: "US-Israeli military stance, Lebanese front, Iranian proxy strikes, and naval security.",
    meL1: "Interceptions",
    meL2: "Naval Posture",
    yeBadge: "Chokepoint Crisis",
    yeTitle: "Yemeni Civil War & Red Sea",
    yeDesc: "Houthi anti-ship ballistic missile strikes, naval coalition defenses, and maritime trade disruption.",
    yeL1: "Shipping Risk",
    yeL2: "Naval Escort",
    twBadge: "Indo-Pacific Watch",
    twTitle: "China - Taiwan Strait",
    twDesc: "PLA naval encirclement exercises, ADIZ incursions, and US deterrence shifts.",
    twL1: "ADIZ Incursions",
    twL2: "Chokepoint",
    brBadge: "Geo-Economics",
    brTitle: "BRICS & Multipolarity",
    brDesc: "De-dollarization initiatives, alternative payment routing, and resource corridors.",
    brL1: "Trade Currency",
    brL2: "Sanctions",
    koBadge: "East Asia Watch",
    koTitle: "Korean Peninsula",
    koDesc: "Ballistic missile tests, demilitarized zone tensions, and trilateral defense pacts.",
    koL1: "Missile Tests",
    koL2: "Border Status",
    saBadge: "High Instability",
    saTitle: "Sahel Region Crisis",
    saDesc: "Military juntas, insurgent expansions, and shifts in foreign military influence.",
    saL1: "Regime Status",
    saL2: "Insurgency",
    vHeavy: "Heavy",
    vActive: "Active",
    vCsg: "CSG Deployed",
    vCritical: "Critical",
    vElevated: "Elevated",
    vMonitored: "Monitored",
    vLocalPivot: "Local Pivot",
    vSystemic: "Systemic",
    vFrequent: "Frequent",
    vTense: "Tense",
    vTransitional: "Transitional",
    vExpanding: "Expanding",
    fAll: "Global Overview",
    fDiplomacy: "Diplomacy",
    fMilitary: "Military",
    fEconomy: "Economy",
    timeframe: "Timeframe",
    rAny: "Any time",
    r24: "24h",
    r7: "7 days",
    r30: "30 days",
    archivesTitle: "Intelligence Feed & Archives",
    archivesSub: "Click on any intelligence card to access verified reporting at source.",
    metaShowing: "Showing {start}\u2013{end} of {total} reports",
    noResults: "No operational intelligence matching your criteria at this moment.",
    loading: "Fetching real-time global intelligence...",
    errorMsg: "Transmission standby. Verify connection or query parameters.",
    tagMilitary: "Military",
    tagEconomy: "Economy",
    tagDiplomacy: "Diplomacy",
    tagIntel: "Global Intel",
    coverAlt: "Intelligence Cover",
    recentDate: "Recent",
    fallbackDesc: "Access restricted. Click to view full encrypted briefing at the source.",
    defaultSource: "Intelligence Feed",
    verifiedSource: "Verified Source",
    untitled: "Untitled Report",
    readSource: "Read Source",
    pagAria: "Pagination",
    prevPage: "Previous page",
    nextPage: "Next page",
    goTo: "Go to",
    goToAria: "Go to page",
    contactTitle: "Establish Secure Channel",
    contactDesc: "Request data access, report anomalies, or contact our operations team directly.",
    emailLabel: "Secure Email",
    devEmailLabel: "Developer Email",
    repoLabel: "Organization Repository",
    devLabel: "Lead Developer",
    fName: "Full Name / Callsign",
    fEmail: "Secure Email",
    fTopic: "Select Transmission Topic",
    optData: "Data Access Request",
    optReport: "Intelligence Report",
    optPress: "Press & Media",
    fMessage: "Transmission Body",
    submit: "Transmit Encrypted",
    transmitting: "Transmitting...",
    sent: "Securely Transmitted",
    failed: "Transmission Failed",
    footerDesc: "Independent global intelligence and diplomatic monitoring observatory.",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    maintainer: "Maintainer",
    closeAria: "Close",
    privTitle: "Privacy Policy",
    privP1T: "Zero Tracking Guarantee:",
    privP1: "VERO operates under a strict privacy-first architecture. We do not track user IP addresses, install cookies, or sell telemetric usage data.",
    privP2T: "Data Handling:",
    privP2: "Transmissions are processed solely to respond to inquiries and stored on encrypted infrastructure.",
    termsTitle: "Terms of Service",
    termsP1T: "Open Intelligence:",
    termsP1: "Information is aggregated from open public feeds for monitoring and research. VERO does not alter source materials."
};

I18N.fr = {
    title: "VERO | Renseignement mondial et analyse stratégique",
    logoAlt: "Logo VERO",
    bannerAlt: "Bannière VERO",
    navTheaters: "Théâtres stratégiques",
    navFeed: "Flux",
    navContact: "Contact",
    themeToggle: "Changer de thème",
    langToggle: "Changer de langue",
    greetMorning: "Bonjour, Stratège.",
    greetAfternoon: "Bon après-midi, Stratège.",
    greetEvening: "Bonsoir, Stratège.",
    s1: "Signaux mondiaux bruts. Zéro bruit.",
    s2: "Du renseignement tactique avant les gros titres.",
    s3: "Décrypter la géopolitique en temps réel.",
    s4: "Veille haute fidélité des menaces et des politiques.",
    s5: "Données brutes. Clarté stratégique. Portée mondiale.",
    heroTitle: "Briefing mondial sur les opérations et les politiques",
    p0: "Lancer l'analyse mondiale...",
    p1: "Scanner l'actualité mondiale de la défense...",
    p2: "Analyser les sanctions économiques...",
    p3: "Suivre les sommets diplomatiques...",
    p4: "Rechercher des théâtres de conflit...",
    p5: "Lancer le briefing tactique...",
    searchAria: "Rechercher",
    radarAria: "Lancer la recherche",
    sg1: "Détroit de Taïwan",
    sg2: "BRICS",
    sg3: "Dissuasion nucléaire",
    sg4: "OPEP+",
    sg5: "Élargissement de l'OTAN",
    sg6: "Juntes du Sahel",
    sg7: "Cyberguerre",
    sg8: "Sécurité en mer Rouge",
    sg9: "Conseil de sécurité de l'ONU",
    recent: "Récent",
    clearRecent: "Effacer les recherches récentes",
    theatersTitle: "Théâtres de conflit actifs et analyse stratégique",
    theatersSub: "Cartes de situation en temps réel, analyses par théâtre et suivi opérationnel dynamique.",
    loadIntel: "Charger le renseignement",
    liveMap: "Carte en direct",
    ukBadge: "Zone de guerre active",
    ukTitle: "Conflit russo-ukrainien",
    ukDesc: "Suivi de la ligne de front, changements territoriaux et activité aérienne et d'artillerie tactique.",
    ukL1: "Posture d'artillerie",
    ukL2: "Défense aérienne",
    meBadge: "Indice d'escalade",
    meTitle: "Conflit au Moyen-Orient",
    meDesc: "Posture militaire américano-israélienne, front libanais, frappes des supplétifs iraniens et sécurité navale.",
    meL1: "Interceptions",
    meL2: "Posture navale",
    yeBadge: "Crise du goulet d'étranglement",
    yeTitle: "Guerre civile yéménite et mer Rouge",
    yeDesc: "Frappes de missiles balistiques antinavires houthistes, défenses de la coalition navale et perturbation du commerce maritime.",
    yeL1: "Risque maritime",
    yeL2: "Escorte navale",
    twBadge: "Veille Indo-Pacifique",
    twTitle: "Chine – détroit de Taïwan",
    twDesc: "Exercices d'encerclement naval de l'APL, incursions dans l'ADIZ et évolution de la dissuasion américaine.",
    twL1: "Incursions dans l'ADIZ",
    twL2: "Point de passage",
    brBadge: "Géo-économie",
    brTitle: "BRICS et multipolarité",
    brDesc: "Initiatives de dédollarisation, routage de paiements alternatif et corridors de ressources.",
    brL1: "Monnaie d'échange",
    brL2: "Sanctions",
    koBadge: "Veille Asie de l'Est",
    koTitle: "Péninsule coréenne",
    koDesc: "Tirs de missiles balistiques, tensions dans la zone démilitarisée et pactes de défense trilatéraux.",
    koL1: "Tirs de missiles",
    koL2: "Statut de la frontière",
    saBadge: "Forte instabilité",
    saTitle: "Crise de la région du Sahel",
    saDesc: "Juntes militaires, expansion des insurgés et évolution de l'influence militaire étrangère.",
    saL1: "Statut du régime",
    saL2: "Insurrection",
    vHeavy: "Lourde",
    vActive: "Active",
    vCsg: "Groupe aéronaval déployé",
    vCritical: "Critique",
    vElevated: "Élevées",
    vMonitored: "Surveillé",
    vLocalPivot: "Pivot local",
    vSystemic: "Systémiques",
    vFrequent: "Fréquents",
    vTense: "Tendue",
    vTransitional: "Transitoire",
    vExpanding: "En expansion",
    fAll: "Vue d'ensemble mondiale",
    fDiplomacy: "Diplomatie",
    fMilitary: "Militaire",
    fEconomy: "Économie",
    timeframe: "Période",
    rAny: "Toute période",
    r24: "24 h",
    r7: "7 jours",
    r30: "30 jours",
    archivesTitle: "Flux de renseignement et archives",
    archivesSub: "Cliquez sur une carte pour accéder au reportage vérifié à la source.",
    metaShowing: "Affichage de {start}\u2013{end} sur {total} rapports",
    noResults: "Aucun renseignement opérationnel ne correspond à vos critères pour le moment.",
    loading: "Récupération du renseignement mondial en temps réel...",
    errorMsg: "Transmission en attente. Vérifiez la connexion ou les paramètres de recherche.",
    tagMilitary: "Militaire",
    tagEconomy: "Économie",
    tagDiplomacy: "Diplomatie",
    tagIntel: "Renseignement mondial",
    coverAlt: "Couverture du renseignement",
    recentDate: "Récent",
    fallbackDesc: "Accès restreint. Cliquez pour consulter le briefing complet chiffré à la source.",
    defaultSource: "Flux de renseignement",
    verifiedSource: "Source vérifiée",
    untitled: "Rapport sans titre",
    readSource: "Lire la source",
    pagAria: "Pagination",
    prevPage: "Page précédente",
    nextPage: "Page suivante",
    goTo: "Aller à",
    goToAria: "Aller à la page",
    contactTitle: "Établir un canal sécurisé",
    contactDesc: "Demandez un accès aux données, signalez des anomalies ou contactez directement notre équipe des opérations.",
    emailLabel: "E-mail sécurisé",
    devEmailLabel: "E-mail développeur",
    repoLabel: "Dépôt de l'organisation",
    devLabel: "Développeur principal",
    fName: "Nom complet / Indicatif",
    fEmail: "E-mail sécurisé",
    fTopic: "Choisir le sujet de la transmission",
    optData: "Demande d'accès aux données",
    optReport: "Rapport de renseignement",
    optPress: "Presse et médias",
    fMessage: "Corps de la transmission",
    submit: "Transmettre (chiffré)",
    transmitting: "Transmission...",
    sent: "Transmis en toute sécurité",
    failed: "Échec de la transmission",
    footerDesc: "Observatoire indépendant de renseignement mondial et de veille diplomatique.",
    privacy: "Politique de confidentialité",
    terms: "Conditions d'utilisation",
    maintainer: "Mainteneur",
    closeAria: "Fermer",
    privTitle: "Politique de confidentialité",
    privP1T: "Garantie zéro traçage :",
    privP1: "VERO fonctionne selon une architecture strictement axée sur la vie privée. Nous ne suivons pas les adresses IP, n'installons aucun cookie et ne vendons aucune donnée télémétrique d'utilisation.",
    privP2T: "Traitement des données :",
    privP2: "Les transmissions sont traitées uniquement pour répondre aux demandes et stockées sur une infrastructure chiffrée.",
    termsTitle: "Conditions d'utilisation",
    termsP1T: "Renseignement ouvert :",
    termsP1: "Les informations sont agrégées à partir de flux publics ouverts à des fins de veille et de recherche. VERO ne modifie pas les contenus sources."
};

I18N.es = {
    title: "VERO | Inteligencia global y análisis estratégico",
    logoAlt: "Logotipo de VERO",
    bannerAlt: "Banner de VERO",
    navTheaters: "Teatros estratégicos",
    navFeed: "Noticias",
    navContact: "Contacto",
    themeToggle: "Cambiar tema",
    langToggle: "Cambiar idioma",
    greetMorning: "Buenos días, Estratega.",
    greetAfternoon: "Buenas tardes, Estratega.",
    greetEvening: "Buenas noches, Estratega.",
    s1: "Señales globales sin filtro. Cero ruido.",
    s2: "Inteligencia táctica antes que los titulares.",
    s3: "Descifrando la geopolítica en tiempo real.",
    s4: "Monitoreo de amenazas y políticas de alta fidelidad.",
    s5: "Datos en bruto. Claridad estratégica. Alcance global.",
    heroTitle: "Informe global de operaciones y políticas",
    p0: "Iniciar escaneo global...",
    p1: "Escanear noticias de defensa global...",
    p2: "Analizar sanciones económicas...",
    p3: "Monitorear cumbres diplomáticas...",
    p4: "Buscar teatros de conflicto...",
    p5: "Iniciar informe táctico...",
    searchAria: "Buscar",
    radarAria: "Iniciar búsqueda",
    sg1: "Estrecho de Taiwán",
    sg2: "BRICS",
    sg3: "Disuasión nuclear",
    sg4: "OPEP+",
    sg5: "Expansión de la OTAN",
    sg6: "Juntas del Sahel",
    sg7: "Guerra cibernética",
    sg8: "Seguridad en el mar Rojo",
    sg9: "Consejo de Seguridad de la ONU",
    recent: "Recientes",
    clearRecent: "Borrar búsquedas recientes",
    theatersTitle: "Teatros de conflicto activos y análisis estratégico",
    theatersSub: "Mapas de situación en tiempo real, desglose por teatro y monitoreo operativo dinámico.",
    loadIntel: "Cargar inteligencia",
    liveMap: "Mapa en vivo",
    ukBadge: "Zona de guerra activa",
    ukTitle: "Conflicto ruso-ucraniano",
    ukDesc: "Monitoreo del frente, cambios territoriales y actividad táctica aérea y de artillería.",
    ukL1: "Postura de artillería",
    ukL2: "Defensa aérea",
    meBadge: "Índice de escalada",
    meTitle: "Conflicto en Oriente Medio",
    meDesc: "Postura militar de EE. UU. e Israel, frente libanés, ataques de apoderados iraníes y seguridad naval.",
    meL1: "Intercepciones",
    meL2: "Postura naval",
    yeBadge: "Crisis de punto de estrangulamiento",
    yeTitle: "Guerra civil yemení y mar Rojo",
    yeDesc: "Ataques hutíes con misiles balísticos antibuque, defensas de la coalición naval e interrupción del comercio marítimo.",
    yeL1: "Riesgo marítimo",
    yeL2: "Escolta naval",
    twBadge: "Vigilancia Indo-Pacífico",
    twTitle: "China – Estrecho de Taiwán",
    twDesc: "Ejercicios de cerco naval del EPL, incursiones en la ADIZ y cambios en la disuasión de EE. UU.",
    twL1: "Incursiones en la ADIZ",
    twL2: "Punto de estrangulamiento",
    brBadge: "Geoeconomía",
    brTitle: "BRICS y multipolaridad",
    brDesc: "Iniciativas de desdolarización, rutas alternativas de pago y corredores de recursos.",
    brL1: "Moneda comercial",
    brL2: "Sanciones",
    koBadge: "Vigilancia Asia Oriental",
    koTitle: "Península de Corea",
    koDesc: "Pruebas de misiles balísticos, tensiones en la zona desmilitarizada y pactos de defensa trilaterales.",
    koL1: "Pruebas de misiles",
    koL2: "Estado de la frontera",
    saBadge: "Alta inestabilidad",
    saTitle: "Crisis en la región del Sahel",
    saDesc: "Juntas militares, expansión de insurgentes y cambios en la influencia militar extranjera.",
    saL1: "Estado del régimen",
    saL2: "Insurgencia",
    vHeavy: "Intensa",
    vActive: "Activa",
    vCsg: "Grupo de combate desplegado",
    vCritical: "Crítico",
    vElevated: "Elevadas",
    vMonitored: "Vigilado",
    vLocalPivot: "Giro local",
    vSystemic: "Sistémicas",
    vFrequent: "Frecuentes",
    vTense: "Tensa",
    vTransitional: "Transitorio",
    vExpanding: "En expansión",
    fAll: "Panorama global",
    fDiplomacy: "Diplomacia",
    fMilitary: "Militar",
    fEconomy: "Economía",
    timeframe: "Periodo",
    rAny: "Cualquier fecha",
    r24: "24 h",
    r7: "7 días",
    r30: "30 días",
    archivesTitle: "Flujo de inteligencia y archivos",
    archivesSub: "Haz clic en cualquier tarjeta para acceder al reportaje verificado en su fuente.",
    metaShowing: "Mostrando {start}\u2013{end} de {total} informes",
    noResults: "No hay inteligencia operativa que coincida con tus criterios en este momento.",
    loading: "Obteniendo inteligencia global en tiempo real...",
    errorMsg: "Transmisión en espera. Verifica la conexión o los parámetros de búsqueda.",
    tagMilitary: "Militar",
    tagEconomy: "Economía",
    tagDiplomacy: "Diplomacia",
    tagIntel: "Inteligencia global",
    coverAlt: "Portada de inteligencia",
    recentDate: "Reciente",
    fallbackDesc: "Acceso restringido. Haz clic para ver el informe cifrado completo en la fuente.",
    defaultSource: "Flujo de inteligencia",
    verifiedSource: "Fuente verificada",
    untitled: "Informe sin título",
    readSource: "Leer fuente",
    pagAria: "Paginación",
    prevPage: "Página anterior",
    nextPage: "Página siguiente",
    goTo: "Ir a",
    goToAria: "Ir a la página",
    contactTitle: "Establecer canal seguro",
    contactDesc: "Solicita acceso a datos, reporta anomalías o contacta directamente con nuestro equipo de operaciones.",
    emailLabel: "Correo seguro",
    devEmailLabel: "Correo del desarrollador",
    repoLabel: "Repositorio de la organización",
    devLabel: "Desarrollador principal",
    fName: "Nombre completo / Indicativo",
    fEmail: "Correo seguro",
    fTopic: "Selecciona el tema de la transmisión",
    optData: "Solicitud de acceso a datos",
    optReport: "Informe de inteligencia",
    optPress: "Prensa y medios",
    fMessage: "Cuerpo de la transmisión",
    submit: "Transmitir cifrado",
    transmitting: "Transmitiendo...",
    sent: "Transmitido de forma segura",
    failed: "Error en la transmisión",
    footerDesc: "Observatorio independiente de inteligencia global y monitoreo diplomático.",
    privacy: "Política de privacidad",
    terms: "Términos del servicio",
    maintainer: "Mantenedor",
    closeAria: "Cerrar",
    privTitle: "Política de privacidad",
    privP1T: "Garantía de cero rastreo:",
    privP1: "VERO opera con una arquitectura estricta de privacidad ante todo. No rastreamos direcciones IP, no instalamos cookies ni vendemos datos telemétricos de uso.",
    privP2T: "Manejo de datos:",
    privP2: "Las transmisiones se procesan únicamente para responder consultas y se almacenan en infraestructura cifrada.",
    termsTitle: "Términos del servicio",
    termsP1T: "Inteligencia abierta:",
    termsP1: "La información se agrega a partir de fuentes públicas abiertas con fines de monitoreo e investigación. VERO no altera los materiales de origen."
};

I18N.ru = {
    title: "VERO | Глобальная разведка и стратегический анализ",
    logoAlt: "Логотип VERO",
    bannerAlt: "Баннер VERO",
    navTheaters: "Стратегические театры",
    navFeed: "Лента",
    navContact: "Контакты",
    themeToggle: "Сменить тему",
    langToggle: "Сменить язык",
    greetMorning: "Доброе утро, стратег.",
    greetAfternoon: "Добрый день, стратег.",
    greetEvening: "Добрый вечер, стратег.",
    s1: "Неотфильтрованные мировые сигналы. Ноль шума.",
    s2: "Тактическая разведка раньше заголовков.",
    s3: "Расшифровка геополитики в реальном времени.",
    s4: "Высокоточный мониторинг угроз и политики.",
    s5: "Сырые данные. Стратегическая ясность. Глобальный охват.",
    heroTitle: "Глобальный брифинг по операциям и политике",
    p0: "Запустить глобальное сканирование...",
    p1: "Сканировать мировые новости обороны...",
    p2: "Анализировать экономические санкции...",
    p3: "Следить за дипломатическими саммитами...",
    p4: "Искать театры конфликтов...",
    p5: "Запустить тактический брифинг...",
    searchAria: "Поиск",
    radarAria: "Запустить поиск",
    sg1: "Тайваньский пролив",
    sg2: "БРИКС",
    sg3: "Ядерное сдерживание",
    sg4: "ОПЕК+",
    sg5: "Расширение НАТО",
    sg6: "Хунты Сахеля",
    sg7: "Кибервойна",
    sg8: "Безопасность Красного моря",
    sg9: "Совет Безопасности ООН",
    recent: "Недавние",
    clearRecent: "Очистить недавние запросы",
    theatersTitle: "Активные театры конфликтов и стратегический анализ",
    theatersSub: "Карты обстановки в реальном времени, обзоры театров и динамический оперативный мониторинг.",
    loadIntel: "Загрузить данные",
    liveMap: "Карта онлайн",
    ukBadge: "Зона активных боевых действий",
    ukTitle: "Российско-украинский конфликт",
    ukDesc: "Мониторинг линии фронта, территориальных изменений и тактической авиационной и артиллерийской активности.",
    ukL1: "Артиллерийская активность",
    ukL2: "ПВО",
    meBadge: "Индекс эскалации",
    meTitle: "Конфликт на Ближнем Востоке",
    meDesc: "Военная позиция США и Израиля, ливанский фронт, удары прокси Ирана и морская безопасность.",
    meL1: "Перехваты",
    meL2: "Морская группировка",
    yeBadge: "Кризис узкого прохода",
    yeTitle: "Гражданская война в Йемене и Красное море",
    yeDesc: "Удары хуситов противокорабельными баллистическими ракетами, оборона военно-морской коалиции и нарушение морской торговли.",
    yeL1: "Риск для судоходства",
    yeL2: "Морское сопровождение",
    twBadge: "Индо-Тихоокеанский мониторинг",
    twTitle: "Китай — Тайваньский пролив",
    twDesc: "Учения НОАК по морскому окружению, вторжения в ЗОПВО и изменения в сдерживании со стороны США.",
    twL1: "Вторжения в ЗОПВО",
    twL2: "Узкий проход",
    brBadge: "Геоэкономика",
    brTitle: "БРИКС и многополярность",
    brDesc: "Инициативы по дедолларизации, альтернативные платёжные маршруты и ресурсные коридоры.",
    brL1: "Торговая валюта",
    brL2: "Санкции",
    koBadge: "Мониторинг Восточной Азии",
    koTitle: "Корейский полуостров",
    koDesc: "Испытания баллистических ракет, напряжённость в демилитаризованной зоне и трёхсторонние оборонные пакты.",
    koL1: "Пуски ракет",
    koL2: "Состояние границы",
    saBadge: "Высокая нестабильность",
    saTitle: "Кризис в регионе Сахель",
    saDesc: "Военные хунты, расширение деятельности повстанцев и сдвиги во влиянии иностранных военных.",
    saL1: "Статус режима",
    saL2: "Повстанческая активность",
    vHeavy: "Интенсивная",
    vActive: "Активно",
    vCsg: "Развёрнута авианосная группа",
    vCritical: "Критический",
    vElevated: "Повышенные",
    vMonitored: "Под наблюдением",
    vLocalPivot: "Местный разворот",
    vSystemic: "Системные",
    vFrequent: "Частые",
    vTense: "Напряжённая",
    vTransitional: "Переходный",
    vExpanding: "Расширяется",
    fAll: "Мировой обзор",
    fDiplomacy: "Дипломатия",
    fMilitary: "Военное",
    fEconomy: "Экономика",
    timeframe: "Период",
    rAny: "За всё время",
    r24: "24 ч",
    r7: "7 дней",
    r30: "30 дней",
    archivesTitle: "Лента разведданных и архивы",
    archivesSub: "Нажмите на любую карточку, чтобы перейти к проверенному материалу в источнике.",
    metaShowing: "Показано {start}\u2013{end} из {total} отчётов",
    noResults: "В данный момент нет оперативных данных, соответствующих вашим критериям.",
    loading: "Получение мировых разведданных в реальном времени...",
    errorMsg: "Передача в режиме ожидания. Проверьте соединение или параметры запроса.",
    tagMilitary: "Военное",
    tagEconomy: "Экономика",
    tagDiplomacy: "Дипломатия",
    tagIntel: "Мировая разведка",
    coverAlt: "Обложка материала",
    recentDate: "Недавно",
    fallbackDesc: "Доступ ограничен. Нажмите, чтобы открыть полный зашифрованный брифинг в источнике.",
    defaultSource: "Лента разведданных",
    verifiedSource: "Проверенный источник",
    untitled: "Отчёт без названия",
    readSource: "Читать источник",
    pagAria: "Постраничная навигация",
    prevPage: "Предыдущая страница",
    nextPage: "Следующая страница",
    goTo: "Перейти на",
    goToAria: "Перейти на страницу",
    contactTitle: "Установить защищённый канал",
    contactDesc: "Запросите доступ к данным, сообщите об аномалиях или свяжитесь напрямую с нашей оперативной командой.",
    emailLabel: "Защищённая почта",
    devEmailLabel: "Почта разработчика",
    repoLabel: "Репозиторий организации",
    devLabel: "Ведущий разработчик",
    fName: "Полное имя / Позывной",
    fEmail: "Защищённая почта",
    fTopic: "Выберите тему сообщения",
    optData: "Запрос доступа к данным",
    optReport: "Разведывательный отчёт",
    optPress: "Пресса и СМИ",
    fMessage: "Текст сообщения",
    submit: "Отправить зашифрованно",
    transmitting: "Отправка...",
    sent: "Безопасно отправлено",
    failed: "Ошибка отправки",
    footerDesc: "Независимая обсерватория глобальной разведки и дипломатического мониторинга.",
    privacy: "Политика конфиденциальности",
    terms: "Условия использования",
    maintainer: "Мейнтейнер",
    closeAria: "Закрыть",
    privTitle: "Политика конфиденциальности",
    privP1T: "Гарантия отсутствия слежки:",
    privP1: "VERO работает на основе строгой архитектуры приоритета конфиденциальности. Мы не отслеживаем IP-адреса пользователей, не устанавливаем файлы cookie и не продаём телеметрические данные об использовании.",
    privP2T: "Обработка данных:",
    privP2: "Сообщения обрабатываются исключительно для ответа на запросы и хранятся на зашифрованной инфраструктуре.",
    termsTitle: "Условия использования",
    termsP1T: "Открытая разведка:",
    termsP1: "Информация собирается из открытых публичных источников для мониторинга и исследований. VERO не изменяет исходные материалы."
};

I18N.ar = {
    title: "VERO | الاستخبارات العالمية والتحليل الاستراتيجي",
    logoAlt: "شعار VERO",
    bannerAlt: "لافتة VERO",
    navTheaters: "المسارح الاستراتيجية",
    navFeed: "الأخبار",
    navContact: "اتصل بنا",
    themeToggle: "تبديل المظهر",
    langToggle: "تغيير اللغة",
    greetMorning: "صباح الخير أيها الاستراتيجي.",
    greetAfternoon: "طاب يومك أيها الاستراتيجي.",
    greetEvening: "مساء الخير أيها الاستراتيجي.",
    s1: "إشارات عالمية بلا تصفية. بلا ضجيج.",
    s2: "استخبارات تكتيكية قبل العناوين الرئيسية.",
    s3: "فكّ شفرة الجيوسياسة في الوقت الفعلي.",
    s4: "رصد عالي الدقة للتهديدات والسياسات.",
    s5: "بيانات خام. وضوح استراتيجي. نطاق عالمي.",
    heroTitle: "إحاطة عالمية حول العمليات والسياسات",
    p0: "ابدأ المسح العالمي...",
    p1: "امسح أخبار الدفاع العالمية...",
    p2: "حلّل العقوبات الاقتصادية...",
    p3: "راقب القمم الدبلوماسية...",
    p4: "ابحث في مسارح الصراع...",
    p5: "ابدأ الإحاطة التكتيكية...",
    searchAria: "بحث",
    radarAria: "بدء البحث",
    sg1: "مضيق تايوان",
    sg2: "بريكس",
    sg3: "الردع النووي",
    sg4: "أوبك+",
    sg5: "توسع الناتو",
    sg6: "الأنظمة العسكرية في الساحل",
    sg7: "الحرب السيبرانية",
    sg8: "أمن البحر الأحمر",
    sg9: "مجلس الأمن الدولي",
    recent: "الأخيرة",
    clearRecent: "مسح عمليات البحث الأخيرة",
    theatersTitle: "مسارح الصراع النشطة والتحليل الاستراتيجي",
    theatersSub: "خرائط الوضع الفورية وتفصيل المسارح والمراقبة العملياتية الديناميكية.",
    loadIntel: "تحميل المعلومات",
    liveMap: "الخريطة المباشرة",
    ukBadge: "منطقة حرب نشطة",
    ukTitle: "الصراع الروسي الأوكراني",
    ukDesc: "رصد خطوط الجبهة والتغيرات الإقليمية والنشاط الجوي والمدفعي التكتيكي.",
    ukL1: "الوضع المدفعي",
    ukL2: "الدفاع الجوي",
    meBadge: "مؤشر التصعيد",
    meTitle: "صراع الشرق الأوسط",
    meDesc: "الموقف العسكري الأمريكي الإسرائيلي، والجبهة اللبنانية، وضربات الوكلاء الإيرانيين، والأمن البحري.",
    meL1: "الاعتراضات",
    meL2: "الوضع البحري",
    yeBadge: "أزمة نقطة اختناق",
    yeTitle: "الحرب الأهلية اليمنية والبحر الأحمر",
    yeDesc: "ضربات الحوثيين بالصواريخ الباليستية المضادة للسفن، ودفاعات التحالف البحري، وتعطّل التجارة البحرية.",
    yeL1: "مخاطر الشحن",
    yeL2: "المرافقة البحرية",
    twBadge: "مراقبة المحيطين الهندي والهادئ",
    twTitle: "الصين – مضيق تايوان",
    twDesc: "تدريبات الحصار البحري لجيش التحرير الشعبي، وانتهاكات منطقة تحديد الدفاع الجوي، وتحولات الردع الأمريكي.",
    twL1: "انتهاكات منطقة الدفاع الجوي",
    twL2: "نقطة الاختناق",
    brBadge: "الاقتصاد الجيوسياسي",
    brTitle: "بريكس وتعدد الأقطاب",
    brDesc: "مبادرات إنهاء الدولرة، ومسارات الدفع البديلة، وممرات الموارد.",
    brL1: "عملة التجارة",
    brL2: "العقوبات",
    koBadge: "مراقبة شرق آسيا",
    koTitle: "شبه الجزيرة الكورية",
    koDesc: "تجارب الصواريخ الباليستية، وتوترات المنطقة منزوعة السلاح، والاتفاقيات الدفاعية الثلاثية.",
    koL1: "تجارب الصواريخ",
    koL2: "وضع الحدود",
    saBadge: "عدم استقرار مرتفع",
    saTitle: "أزمة منطقة الساحل",
    saDesc: "الأنظمة العسكرية، وتوسع المتمردين، وتحولات النفوذ العسكري الأجنبي.",
    saL1: "وضع النظام",
    saL2: "التمرد",
    vHeavy: "مكثف",
    vActive: "نشط",
    vCsg: "مجموعة حاملة طائرات منتشرة",
    vCritical: "حرج",
    vElevated: "مرتفعة",
    vMonitored: "تحت المراقبة",
    vLocalPivot: "تحوّل محلي",
    vSystemic: "منهجية",
    vFrequent: "متكررة",
    vTense: "متوترة",
    vTransitional: "انتقالي",
    vExpanding: "متوسع",
    fAll: "نظرة عالمية",
    fDiplomacy: "الدبلوماسية",
    fMilitary: "عسكري",
    fEconomy: "اقتصاد",
    timeframe: "الإطار الزمني",
    rAny: "أي وقت",
    r24: "24 ساعة",
    r7: "7 أيام",
    r30: "30 يومًا",
    archivesTitle: "موجز الاستخبارات والأرشيف",
    archivesSub: "انقر على أي بطاقة للوصول إلى التقرير الموثّق من مصدره.",
    metaShowing: "عرض {start}\u2013{end} من أصل {total} تقريرًا",
    noResults: "لا توجد معلومات عملياتية تطابق معاييرك في الوقت الحالي.",
    loading: "جارٍ جلب المعلومات العالمية في الوقت الفعلي...",
    errorMsg: "الإرسال في وضع الانتظار. تحقق من الاتصال أو معاملات البحث.",
    tagMilitary: "عسكري",
    tagEconomy: "اقتصاد",
    tagDiplomacy: "دبلوماسية",
    tagIntel: "استخبارات عالمية",
    coverAlt: "غلاف الاستخبارات",
    recentDate: "حديثًا",
    fallbackDesc: "الوصول مقيّد. انقر لعرض الإحاطة المشفّرة الكاملة في المصدر.",
    defaultSource: "موجز الاستخبارات",
    verifiedSource: "مصدر موثّق",
    untitled: "تقرير بلا عنوان",
    readSource: "اقرأ المصدر",
    pagAria: "ترقيم الصفحات",
    prevPage: "الصفحة السابقة",
    nextPage: "الصفحة التالية",
    goTo: "انتقل إلى",
    goToAria: "انتقل إلى الصفحة",
    contactTitle: "إنشاء قناة آمنة",
    contactDesc: "اطلب الوصول إلى البيانات، أو أبلغ عن حالات شاذة، أو تواصل مع فريق العمليات لدينا مباشرة.",
    emailLabel: "بريد آمن",
    devEmailLabel: "بريد المطوّر",
    repoLabel: "مستودع المؤسسة",
    devLabel: "المطوّر الرئيسي",
    fName: "الاسم الكامل / الاسم الرمزي",
    fEmail: "البريد الآمن",
    fTopic: "اختر موضوع الإرسال",
    optData: "طلب الوصول إلى البيانات",
    optReport: "تقرير استخباراتي",
    optPress: "الصحافة والإعلام",
    fMessage: "نص الرسالة",
    submit: "إرسال مشفّر",
    transmitting: "جارٍ الإرسال...",
    sent: "تم الإرسال بأمان",
    failed: "فشل الإرسال",
    footerDesc: "مرصد مستقل للاستخبارات العالمية والمراقبة الدبلوماسية.",
    privacy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
    maintainer: "المشرف على المشروع",
    closeAria: "إغلاق",
    privTitle: "سياسة الخصوصية",
    privP1T: "ضمان عدم التتبع:",
    privP1: "تعمل VERO وفق بنية صارمة تعطي الأولوية للخصوصية. لا نتتبع عناوين IP للمستخدمين، ولا نثبّت ملفات تعريف الارتباط، ولا نبيع بيانات الاستخدام عن بُعد.",
    privP2T: "التعامل مع البيانات:",
    privP2: "تُعالج الرسائل فقط للرد على الاستفسارات وتُخزَّن على بنية تحتية مشفّرة.",
    termsTitle: "شروط الخدمة",
    termsP1T: "الاستخبارات المفتوحة:",
    termsP1: "تُجمَع المعلومات من مصادر عامة مفتوحة لأغراض المراقبة والبحث. لا تقوم VERO بتعديل المواد المصدرية."
};

I18N.zh = {
    title: "VERO | 全球情报与战略分析",
    logoAlt: "VERO 标志",
    bannerAlt: "VERO 横幅",
    navTheaters: "战略战区",
    navFeed: "动态",
    navContact: "联系我们",
    themeToggle: "切换主题",
    langToggle: "切换语言",
    greetMorning: "早上好，战略家。",
    greetAfternoon: "下午好，战略家。",
    greetEvening: "晚上好，战略家。",
    s1: "未经过滤的全球信号，零噪音。",
    s2: "先于头条的战术情报。",
    s3: "实时解码地缘政治。",
    s4: "高保真威胁与政策监测。",
    s5: "原始数据，战略清晰，全球覆盖。",
    heroTitle: "全球行动与政策简报",
    p0: "启动全球扫描...",
    p1: "扫描全球国防新闻...",
    p2: "分析经济制裁...",
    p3: "监测外交峰会...",
    p4: "搜索冲突战区...",
    p5: "启动战术简报...",
    searchAria: "搜索",
    radarAria: "开始搜索",
    sg1: "台湾海峡",
    sg2: "金砖国家",
    sg3: "核威慑",
    sg4: "欧佩克+",
    sg5: "北约东扩",
    sg6: "萨赫勒军政府",
    sg7: "网络战",
    sg8: "红海安全",
    sg9: "联合国安理会",
    recent: "最近",
    clearRecent: "清除最近搜索",
    theatersTitle: "活跃冲突战区与战略分析",
    theatersSub: "实时态势地图、战区详情与动态作战监测。",
    loadIntel: "加载情报",
    liveMap: "实时地图",
    ukBadge: "活跃战区",
    ukTitle: "俄乌冲突",
    ukDesc: "前线监测、领土变化以及战术空中与炮兵活动。",
    ukL1: "炮兵态势",
    ukL2: "防空",
    meBadge: "升级指数",
    meTitle: "中东冲突",
    meDesc: "美以军事态势、黎巴嫩前线、伊朗代理人打击与海上安全。",
    meL1: "拦截",
    meL2: "海军态势",
    yeBadge: "咽喉要道危机",
    yeTitle: "也门内战与红海",
    yeDesc: "胡塞武装反舰弹道导弹袭击、海军联盟防御与海上贸易中断。",
    yeL1: "航运风险",
    yeL2: "海军护航",
    twBadge: "印太观察",
    twTitle: "中国–台湾海峡",
    twDesc: "解放军海上围困演习、防空识别区侵入以及美国威慑态势的变化。",
    twL1: "防空识别区侵入",
    twL2: "咽喉要道",
    brBadge: "地缘经济",
    brTitle: "金砖国家与多极化",
    brDesc: "去美元化举措、替代性支付路径与资源通道。",
    brL1: "贸易货币",
    brL2: "制裁",
    koBadge: "东亚观察",
    koTitle: "朝鲜半岛",
    koDesc: "弹道导弹试射、非军事区紧张局势与三方防务协定。",
    koL1: "导弹试射",
    koL2: "边境状态",
    saBadge: "高度不稳定",
    saTitle: "萨赫勒地区危机",
    saDesc: "军政府、叛乱势力扩张以及外国军事影响力的变化。",
    saL1: "政权状态",
    saL2: "叛乱",
    vHeavy: "密集",
    vActive: "活跃",
    vCsg: "航母战斗群已部署",
    vCritical: "严重",
    vElevated: "上升",
    vMonitored: "受监控",
    vLocalPivot: "本币转向",
    vSystemic: "系统性",
    vFrequent: "频繁",
    vTense: "紧张",
    vTransitional: "过渡中",
    vExpanding: "扩大中",
    fAll: "全球概览",
    fDiplomacy: "外交",
    fMilitary: "军事",
    fEconomy: "经济",
    timeframe: "时间范围",
    rAny: "不限时间",
    r24: "24小时",
    r7: "7天",
    r30: "30天",
    archivesTitle: "情报动态与档案",
    archivesSub: "点击任意情报卡片即可前往来源查看经核实的报道。",
    metaShowing: "显示第 {start}\u2013{end} 条，共 {total} 份报告",
    noResults: "目前没有符合您条件的作战情报。",
    loading: "正在获取实时全球情报...",
    errorMsg: "传输待命中。请检查网络连接或查询参数。",
    tagMilitary: "军事",
    tagEconomy: "经济",
    tagDiplomacy: "外交",
    tagIntel: "全球情报",
    coverAlt: "情报封面",
    recentDate: "近期",
    fallbackDesc: "访问受限。点击前往来源查看完整加密简报。",
    defaultSource: "情报动态",
    verifiedSource: "已核实来源",
    untitled: "无标题报告",
    readSource: "阅读原文",
    pagAria: "分页",
    prevPage: "上一页",
    nextPage: "下一页",
    goTo: "跳转至",
    goToAria: "跳转到页码",
    contactTitle: "建立安全通道",
    contactDesc: "申请数据访问、报告异常，或直接联系我们的运营团队。",
    emailLabel: "安全邮箱",
    devEmailLabel: "开发者邮箱",
    repoLabel: "组织代码仓库",
    devLabel: "首席开发者",
    fName: "全名 / 呼号",
    fEmail: "安全邮箱",
    fTopic: "选择传输主题",
    optData: "数据访问申请",
    optReport: "情报报告",
    optPress: "新闻与媒体",
    fMessage: "传输内容",
    submit: "加密发送",
    transmitting: "发送中...",
    sent: "已安全发送",
    failed: "发送失败",
    footerDesc: "独立的全球情报与外交监测观察站。",
    privacy: "隐私政策",
    terms: "服务条款",
    maintainer: "维护者",
    closeAria: "关闭",
    privTitle: "隐私政策",
    privP1T: "零追踪保证：",
    privP1: "VERO 采用严格的隐私优先架构。我们不追踪用户 IP 地址，不安装 Cookie，也不出售遥测使用数据。",
    privP2T: "数据处理：",
    privP2: "传输内容仅用于回复咨询，并存储在加密基础设施上。",
    termsTitle: "服务条款",
    termsP1T: "开放情报：",
    termsP1: "信息汇总自公开渠道，用于监测与研究。VERO 不会改动来源材料。"
};

I18N.tr = {
    title: "VERO | Küresel İstihbarat ve Stratejik Analiz",
    logoAlt: "VERO Logosu",
    bannerAlt: "VERO Bannerı",
    navTheaters: "Stratejik Cepheler",
    navFeed: "Akış",
    navContact: "İletişim",
    themeToggle: "Temayı Değiştir",
    langToggle: "Dili Değiştir",
    greetMorning: "Günaydın, Stratejist.",
    greetAfternoon: "İyi Günler, Stratejist.",
    greetEvening: "İyi Akşamlar, Stratejist.",
    s1: "Filtresiz Küresel Sinyaller. Sıfır Gürültü.",
    s2: "Manşetlerden Önce Taktik İstihbarat.",
    s3: "Jeopolitiği Gerçek Zamanlı Çözümlüyoruz.",
    s4: "Yüksek Doğrulukta Tehdit ve Politika İzleme.",
    s5: "Ham Veri. Stratejik Netlik. Küresel Erişim.",
    heroTitle: "Küresel Operasyon ve Politika Brifingi",
    p0: "Küresel taramayı başlat...",
    p1: "Küresel savunma haberlerini tara...",
    p2: "Ekonomik yaptırımları analiz et...",
    p3: "Diplomatik zirveleri izle...",
    p4: "Çatışma bölgelerini ara...",
    p5: "Taktik brifingi başlat...",
    searchAria: "Ara",
    radarAria: "Aramayı başlat",
    sg1: "Tayvan Boğazı",
    sg2: "BRICS",
    sg3: "Nükleer Caydırıcılık",
    sg4: "OPEC+",
    sg5: "NATO Genişlemesi",
    sg6: "Sahel Cuntaları",
    sg7: "Siber Savaş",
    sg8: "Kızıldeniz Güvenliği",
    sg9: "BM Güvenlik Konseyi",
    recent: "Son Aramalar",
    clearRecent: "Son aramaları temizle",
    theatersTitle: "Aktif Çatışma Bölgeleri ve Stratejik Analiz",
    theatersSub: "Gerçek zamanlı durum haritaları, bölge analizleri ve dinamik operasyonel izleme.",
    loadIntel: "İstihbaratı Yükle",
    liveMap: "Canlı Harita",
    ukBadge: "Aktif Savaş Bölgesi",
    ukTitle: "Rusya-Ukrayna Çatışması",
    ukDesc: "Cephe hattı izleme, toprak değişimleri ve taktik hava/topçu faaliyetleri.",
    ukL1: "Topçu Durumu",
    ukL2: "Hava Savunması",
    meBadge: "Gerilim Endeksi",
    meTitle: "Orta Doğu Çatışması",
    meDesc: "ABD-İsrail askeri duruşu, Lübnan cephesi, İran vekil saldırıları ve deniz güvenliği.",
    meL1: "Önlemeler",
    meL2: "Deniz Duruşu",
    yeBadge: "Kritik Geçit Krizi",
    yeTitle: "Yemen İç Savaşı ve Kızıldeniz",
    yeDesc: "Husilerin gemi karşıtı balistik füze saldırıları, deniz koalisyonu savunması ve deniz ticaretindeki aksamalar.",
    yeL1: "Nakliye Riski",
    yeL2: "Deniz Refakati",
    twBadge: "Hint-Pasifik İzleme",
    twTitle: "Çin - Tayvan Boğazı",
    twDesc: "Çin Halk Kurtuluş Ordusu'nun deniz kuşatma tatbikatları, hava savunma kimlik bölgesi ihlalleri ve ABD caydırıcılığındaki kaymalar.",
    twL1: "ADIZ İhlalleri",
    twL2: "Kritik Geçit",
    brBadge: "Jeoekonomi",
    brTitle: "BRICS ve Çok Kutupluluk",
    brDesc: "Dolarsızlaşma girişimleri, alternatif ödeme yönlendirmesi ve kaynak koridorları.",
    brL1: "Ticaret Para Birimi",
    brL2: "Yaptırımlar",
    koBadge: "Doğu Asya İzleme",
    koTitle: "Kore Yarımadası",
    koDesc: "Balistik füze denemeleri, silahsızlandırılmış bölge gerginlikleri ve üçlü savunma anlaşmaları.",
    koL1: "Füze Denemeleri",
    koL2: "Sınır Durumu",
    saBadge: "Yüksek İstikrarsızlık",
    saTitle: "Sahel Bölgesi Krizi",
    saDesc: "Askeri cuntalar, isyancı yayılmaları ve yabancı askeri nüfuzdaki kaymalar.",
    saL1: "Rejim Durumu",
    saL2: "İsyan",
    vHeavy: "Yoğun",
    vActive: "Aktif",
    vCsg: "Uçak Gemisi Grubu Konuşlu",
    vCritical: "Kritik",
    vElevated: "Yüksek",
    vMonitored: "İzleniyor",
    vLocalPivot: "Yerel Para Dönüşü",
    vSystemic: "Sistemik",
    vFrequent: "Sık",
    vTense: "Gergin",
    vTransitional: "Geçiş Sürecinde",
    vExpanding: "Genişliyor",
    fAll: "Küresel Genel Bakış",
    fDiplomacy: "Diplomasi",
    fMilitary: "Askeri",
    fEconomy: "Ekonomi",
    timeframe: "Zaman Aralığı",
    rAny: "Her Zaman",
    r24: "24 sa",
    r7: "7 gün",
    r30: "30 gün",
    archivesTitle: "İstihbarat Akışı ve Arşivler",
    archivesSub: "Kaynağındaki doğrulanmış habere ulaşmak için herhangi bir istihbarat kartına tıklayın.",
    metaShowing: "{total} rapordan {start}\u2013{end} arası gösteriliyor",
    noResults: "Şu anda kriterlerinize uyan operasyonel istihbarat bulunmuyor.",
    loading: "Gerçek zamanlı küresel istihbarat alınıyor...",
    errorMsg: "İletim beklemede. Bağlantıyı veya sorgu parametrelerini kontrol edin.",
    tagMilitary: "Askeri",
    tagEconomy: "Ekonomi",
    tagDiplomacy: "Diplomasi",
    tagIntel: "Küresel İstihbarat",
    coverAlt: "İstihbarat Kapağı",
    recentDate: "Yakın zamanda",
    fallbackDesc: "Erişim kısıtlı. Şifreli brifingin tamamını kaynağında görmek için tıklayın.",
    defaultSource: "İstihbarat Akışı",
    verifiedSource: "Doğrulanmış Kaynak",
    untitled: "Başlıksız Rapor",
    readSource: "Kaynağı Oku",
    pagAria: "Sayfalama",
    prevPage: "Önceki sayfa",
    nextPage: "Sonraki sayfa",
    goTo: "Git:",
    goToAria: "Sayfaya git",
    contactTitle: "Güvenli Kanal Kur",
    contactDesc: "Veri erişimi talep edin, anormallikleri bildirin veya operasyon ekibimizle doğrudan iletişime geçin.",
    emailLabel: "Güvenli E-posta",
    devEmailLabel: "Geliştirici E-postası",
    repoLabel: "Organizasyon Deposu",
    devLabel: "Baş Geliştirici",
    fName: "Ad Soyad / Çağrı Adı",
    fEmail: "Güvenli E-posta",
    fTopic: "İletim Konusunu Seçin",
    optData: "Veri Erişim Talebi",
    optReport: "İstihbarat Raporu",
    optPress: "Basın ve Medya",
    fMessage: "İletim Metni",
    submit: "Şifreli Gönder",
    transmitting: "Gönderiliyor...",
    sent: "Güvenle İletildi",
    failed: "İletim Başarısız",
    footerDesc: "Bağımsız küresel istihbarat ve diplomatik izleme gözlemevi.",
    privacy: "Gizlilik Politikası",
    terms: "Hizmet Şartları",
    maintainer: "Bakımcı",
    closeAria: "Kapat",
    privTitle: "Gizlilik Politikası",
    privP1T: "Sıfır İzleme Garantisi:",
    privP1: "VERO, gizliliği öncelikli sıkı bir mimariyle çalışır. Kullanıcı IP adreslerini izlemez, çerez yüklemez ve telemetri kullanım verilerini satmaz.",
    privP2T: "Veri İşleme:",
    privP2: "İletiler yalnızca taleplere yanıt vermek amacıyla işlenir ve şifreli altyapıda saklanır.",
    termsTitle: "Hizmet Şartları",
    termsP1T: "Açık İstihbarat:",
    termsP1: "Bilgiler, izleme ve araştırma amacıyla açık kamuya ait akışlardan derlenir. VERO kaynak materyalleri değiştirmez."
};

const LANG_KEY = 'vero_lang';
let currentLang = 'en';
let initialized = false;

function t(key, params) {
    const dict = I18N[currentLang] || I18N.en;
    let value = dict[key];
    if (value === undefined) value = I18N.en[key];
    if (value === undefined) return key;
    if (params) {
        Object.keys(params).forEach(name => {
            value = value.split('{' + name + '}').join(params[name]);
        });
    }
    return value;
}

function flagSrc(code) {
    return 'https://hatscripts.github.io/circle-flags/flags/' + code + '.svg';
}

function translateNode(root) {
    root.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    root.querySelectorAll('[data-i18n-aria]').forEach(el => {
        el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });
    root.querySelectorAll('[data-i18n-alt]').forEach(el => {
        el.setAttribute('alt', t(el.dataset.i18nAlt));
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
    });
}

const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const langBtn = document.getElementById('langToggle');
const langMenu = document.getElementById('langMenu');
const langFlag = document.getElementById('langFlag');
const langCode = document.getElementById('langCode');
const navbar = document.getElementById('navbar');
const heroSloganEl = document.getElementById('heroSlogan');
const searchInput = document.getElementById('searchInput');
const newsGrid = document.getElementById('newsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const pagination = document.getElementById('pagination');
const resultsMeta = document.getElementById('resultsMeta');
const rangeBtns = document.querySelectorAll('.range-btn');

const PAGE_SIZE = 9;
const state = { query: '', activeQuery: '', category: 'all', range: 'all', page: 1 };
let requestId = 0;
let currentNewsData = [];
let gridMode = 'loading';
let lastMeta = null;
let lastPagination = null;

function initTheme() {
    const savedTheme = localStorage.getItem('vero_theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 19 || currentHour < 6;
        setTheme(isNight ? 'dark' : 'light');
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vero_theme', theme);
    if (theme === 'dark') {
        themeIcon.className = 'ph ph-sun';
    } else {
        themeIcon.className = 'ph ph-moon';
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
}

initTheme();

if (langBtn && langMenu) {
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langMenu.classList.toggle('show');
    });

    langMenu.addEventListener('click', (e) => {
        const item = e.target.closest('.lang-item');
        if (!item) return;
        e.preventDefault();
        e.stopPropagation();
        applyLanguage(item.dataset.lang);
        langMenu.classList.remove('show');
    });

    document.addEventListener('click', (e) => {
        if (!langMenu.contains(e.target) && !langBtn.contains(e.target)) {
            langMenu.classList.remove('show');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') langMenu.classList.remove('show');
    });
}

function flagFallback(img) {
    const match = img.src.match(/flags\/([a-z]+)\.svg/);
    if (match && !img.dataset.fallback) {
        img.dataset.fallback = '1';
        img.src = 'https://flagcdn.com/w80/' + match[1] + '.png';
    }
}

document.querySelectorAll('.flag-icon').forEach(img => {
    img.addEventListener('error', () => flagFallback(img));
    if (img.complete && img.naturalWidth === 0 && img.src) flagFallback(img);
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

function setGreeting() {
    const hour = new Date().getHours();
    const greetingEl = document.getElementById('greetingHeader');
    if (!greetingEl) return;
    let text;
    if (hour >= 5 && hour < 12) {
        text = t('greetMorning');
    } else if (hour >= 12 && hour < 18) {
        text = t('greetAfternoon');
    } else {
        text = t('greetEvening');
    }
    greetingEl.innerHTML = `<h2>${text}</h2>`;
}
setInterval(setGreeting, 60000);

const sloganKeys = ['s1', 's2', 's3', 's4', 's5'];
const sloganIndex = Math.floor(Math.random() * sloganKeys.length);

function setSlogan() {
    if (heroSloganEl) heroSloganEl.textContent = t(sloganKeys[sloganIndex]);
}

const placeholderKeys = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5'];
let pIndex = 0;

function setPlaceholder() {
    if (searchInput) searchInput.setAttribute('placeholder', t(placeholderKeys[pIndex]));
}

if (searchInput) {
    setInterval(() => {
        pIndex = (pIndex + 1) % placeholderKeys.length;
        setPlaceholder();
    }, 3500);
}

const suggestionPool = [
    { key: 'sg1', q: 'Taiwan Strait' },
    { key: 'sg2', q: 'BRICS' },
    { key: 'sg3', q: 'Nuclear Deterrence' },
    { key: 'sg4', q: 'OPEC+' },
    { key: 'sg5', q: 'NATO Expansion' },
    { key: 'sg6', q: 'Sahel Juntas' },
    { key: 'sg7', q: 'Cyber Warfare' },
    { key: 'sg8', q: 'Red Sea Security' },
    { key: 'sg9', q: 'UN Security Council' }
];
const selectedSuggestions = [...suggestionPool].sort(() => 0.5 - Math.random()).slice(0, 3);

function loadSuggestions() {
    const suggestEl = document.getElementById('searchSuggestions');
    if (!suggestEl) return;
    suggestEl.innerHTML = '';
    selectedSuggestions.forEach(item => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'suggestion-pill';
        b.textContent = t(item.key);
        b.addEventListener('click', () => quickFetch(item.q));
        suggestEl.appendChild(b);
    });
}

const defaultTopics = [
    'geopolitics', 'global defense', 'international diplomacy',
    'sanctions policy', 'global security', 'strategic alliance'
];

function getRandomDefaultTopic() {
    return defaultTopics[Math.floor(Math.random() * defaultTopics.length)];
}

const WM = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';
const coverFallbacks = {
    military: WM + 'b/b2/USS_Gerald_R._Ford_%28CVN-78%29_underway_on_8_April_2017.JPG/960px-USS_Gerald_R._Ford_%28CVN-78%29_underway_on_8_April_2017.JPG',
    economy: WM + 'd/df/Pudong_Shanghai_November_2017_panorama.jpg/960px-Pudong_Shanghai_November_2017_panorama.jpg',
    diplomacy: WM + '4/4e/P5%2B1_negotiation_hall_in_Geneva%2C_2013.jpg/960px-P5%2B1_negotiation_hall_in_Geneva%2C_2013.jpg',
    intel: WM + '0/08/NASA_Visible_Earth_satellite_map_of_Earth.jpg/960px-NASA_Visible_Earth_satellite_map_of_Earth.jpg'
};

function analyzeContentTag(title, desc) {
    const content = (title + ' ' + (desc || '')).toLowerCase();
    if (content.match(/war|military|defense|troops|weapon|missile|navy|army|conflict|strike|fighter|artillery|drone|escalation|nuclear|pentagon|nato|pla|rebel|junta|combat|tactical/)) {
        return { nameKey: 'tagMilitary', icon: 'ph-crosshair', key: 'military' };
    }
    if (content.match(/economy|market|bank|trade|inflation|sanction|currency|brics|stocks|tariff|financial|oil|gas|export|import|gdp|invest/)) {
        return { nameKey: 'tagEconomy', icon: 'ph-chart-line-up', key: 'economy' };
    }
    if (content.match(/president|minister|diplomat|summit|embassy|treaty|un|council|policy|envoy|talks|pact|diplomacy|ambassador|geopolitics|alliance/)) {
        return { nameKey: 'tagDiplomacy', icon: 'ph-handshake', key: 'diplomacy' };
    }
    return { nameKey: 'tagIntel', icon: 'ph-globe', key: 'intel' };
}

function proxiedImage(url) {
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=720&h=400&fit=cover&a=attention&output=webp&q=78`;
}

function attachCover(banner, sources, index) {
    const img = new Image();
    img.alt = t('coverAlt');
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.loading = index < 6 ? 'eager' : 'lazy';
    if (index < 3) img.fetchPriority = 'high';

    let step = 0;
    let timer;

    const advance = () => {
        clearTimeout(timer);
        step++;
        if (step < sources.length) {
            load();
        } else {
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

function gridMessageHTML(mode) {
    if (mode === 'loading') {
        return `<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted); font-weight:600; padding: 60px 0;"><i class="ph ph-spinner ph-spin" style="font-size: 1.8rem; vertical-align: middle; margin-inline-end: 8px;"></i> ${t('loading')}</p>`;
    }
    if (mode === 'error') {
        return `<p style="grid-column: 1/-1; text-align:center; color: var(--danger); font-weight:600; padding: 40px 0;">${t('errorMsg')}</p>`;
    }
    return `<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted); font-weight:600; padding: 40px 0;">${t('noResults')}</p>`;
}

function showGridMessage(mode) {
    gridMode = mode;
    newsGrid.innerHTML = gridMessageHTML(mode);
}

function renderCards(data) {
    newsGrid.innerHTML = '';

    if (!data || data.length === 0) {
        showGridMessage('empty');
        return;
    }

    gridMode = 'cards';

    data.forEach((item, index) => {
        const targetUrl = (item.url && item.url.startsWith('http')) ? item.url : '#';
        const card = document.createElement('a');
        card.className = 'card';
        card.href = targetUrl;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';

        const rawTitle = item.title === 'Untitled Report' ? t('untitled') : item.title;
        const tagData = analyzeContentTag(item.title, item.description || '');
        const formattedDate = item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString(LANGS[currentLang].locale, { month: 'short', day: 'numeric', year: 'numeric' })
            : t('recentDate');

        const coverImg = item.image;
        const invalidImg = !coverImg || !coverImg.startsWith('http') || ['generic', 'business', 'placeholder', 'logo', 'avatar', 'default', 'icon', 'stock'].some(kw => coverImg.toLowerCase().includes(kw));
        const sources = invalidImg ? [coverFallbacks[tagData.key]] : [proxiedImage(coverImg), coverImg, coverFallbacks[tagData.key]];

        const cleanDesc = item.description ? (item.description.length > 120 ? item.description.substring(0, 120) + '...' : item.description) : t('fallbackDesc');
        const sourceName = item.source === 'Verified Source' ? t('verifiedSource') : (item.source || t('defaultSource'));

        card.innerHTML = `
            <div class="card-banner loading">
                <div class="card-tag"><i class="ph ${tagData.icon}"></i> ${t(tagData.nameKey)}</div>
            </div>
            <div class="card-content">
                <span class="card-date">${formattedDate}</span>
                <h3 class="card-title">${rawTitle}</h3>
                <p class="card-desc">${cleanDesc}</p>
                <div class="card-footer">
                    <div class="source-info">
                        <i class="ph ph-newspaper-clipping"></i>
                        <span>${sourceName}</span>
                    </div>
                    <div class="read-more">
                        ${t('readSource')} <i class="ph ph-arrow-up-right"></i>
                    </div>
                </div>
            </div>
        `;
        attachCover(card.querySelector('.card-banner'), sources, index);
        newsGrid.appendChild(card);
    });
}

function pageSequence(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [...new Set([1, 2, current - 1, current, current + 1, total - 1, total])]
        .filter(p => p >= 1 && p <= total)
        .sort((x, y) => x - y);
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
        : `<button type="button" class="page-num${p === page ? ' active' : ''}" data-page="${p}" ${p === page ? 'aria-current="page"' : ''}>${p}</button>`
    ).join('');

    pagination.innerHTML = `
        <button type="button" class="page-arrow" data-page="${page - 1}" aria-label="${t('prevPage')}" ${page <= 1 ? 'disabled' : ''}><i class="ph ph-caret-left"></i></button>
        <div class="page-center">
            <div class="page-numbers">${numbers}</div>
            <label class="page-jump">${t('goTo')}
                <input type="text" id="pageJump" inputmode="numeric" maxlength="3" placeholder="${page}" aria-label="${t('goToAria')}" autocomplete="off">
                <span>/ ${totalPages}</span>
            </label>
        </div>
        <button type="button" class="page-arrow" data-page="${page + 1}" aria-label="${t('nextPage')}" ${page >= totalPages ? 'disabled' : ''}><i class="ph ph-caret-right"></i></button>
    `;
    pagination.hidden = false;
    pagination.dataset.total = totalPages;
}

if (pagination) {
    pagination.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-page]');
        if (!btn || btn.disabled) return;
        goToPage(parseInt(btn.dataset.page, 10));
    });

    pagination.addEventListener('input', (e) => {
        if (e.target.id === 'pageJump') e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });

    pagination.addEventListener('keydown', (e) => {
        if (e.target.id !== 'pageJump' || e.key !== 'Enter') return;
        e.preventDefault();
        const total = parseInt(pagination.dataset.total, 10) || 1;
        const value = parseInt(e.target.value, 10);
        if (!value) return;
        goToPage(Math.min(Math.max(value, 1), total));
    });
}

function goToPage(page) {
    if (!page || page === state.page) return;
    fetchLiveNews(state.query, state.category, page, true);
}

function updateMeta(data) {
    lastMeta = data && data.total ? { page: data.page, total: data.total } : null;
    renderMeta();
}

function renderMeta() {
    if (!resultsMeta) return;
    if (!lastMeta) {
        resultsMeta.textContent = '';
        return;
    }
    const start = (lastMeta.page - 1) * PAGE_SIZE + 1;
    const end = Math.min(lastMeta.page * PAGE_SIZE, lastMeta.total);
    resultsMeta.textContent = t('metaShowing', { start, end, total: lastMeta.total });
}

async function fetchLiveNews(query = '', category = 'all', page = 1, scrollToFeed = false, keepQuery = false) {
    const id = ++requestId;
    state.query = query;
    state.category = category;
    if (page === 1 && !keepQuery) state.activeQuery = query.trim() !== '' ? query.trim() : getRandomDefaultTopic();

    showGridMessage('loading');
    if (pagination) pagination.hidden = true;
    if (scrollToFeed) document.getElementById('archives')?.scrollIntoView({ behavior: 'smooth' });

    try {
        const params = new URLSearchParams({
            q: state.activeQuery,
            category,
            range: state.range,
            lang: currentLang,
            page,
            size: PAGE_SIZE
        });
        const response = await fetch(`/api/news?${params}`);
        if (!response.ok) throw new Error(`Server returned status ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        if (id !== requestId) return;

        state.page = data.page || 1;
        currentNewsData = data.articles || [];
        renderCards(currentNewsData);
        renderPagination(state.page, data.totalPages || 1);
        updateMeta(data);
    } catch (error) {
        if (id !== requestId) return;
        updateMeta(null);
        lastPagination = null;
        showGridMessage('error');
    }
}

const RECENT_KEY = 'vero_recent';

function getRecent() {
    try {
        return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
    } catch (err) {
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
    label.textContent = t('recent');
    el.appendChild(label);

    list.forEach(term => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'suggestion-pill recent-pill';
        b.textContent = term;
        b.addEventListener('click', () => quickFetch(term));
        el.appendChild(b);
    });

    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'recent-clear';
    clear.setAttribute('aria-label', t('clearRecent'));
    clear.innerHTML = '&times;';
    clear.addEventListener('click', () => {
        localStorage.removeItem(RECENT_KEY);
        renderRecent();
    });
    el.appendChild(clear);
}

function saveRecent(term) {
    const clean = (term || '').trim();
    if (!clean) return;
    const list = [clean, ...getRecent().filter(x => x.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    } catch (err) {
        return;
    }
    renderRecent();
}

function currentCategory() {
    return document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
}

function quickFetch(topicQuery) {
    if (searchInput) searchInput.value = topicQuery;
    saveRecent(topicQuery);
    fetchLiveNews(topicQuery, currentCategory());
    document.getElementById('archives')?.scrollIntoView({ behavior: 'smooth' });
}

function runSearch() {
    clearTimeout(searchDebounce);
    const query = searchInput ? searchInput.value.trim() : '';
    saveRecent(query);
    fetchLiveNews(query, currentCategory());
    document.getElementById('archives')?.scrollIntoView({ behavior: 'smooth' });
}

let searchDebounce;
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            fetchLiveNews(e.target.value.trim(), currentCategory());
        }, 500);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            runSearch();
        } else if (e.key === 'Escape') {
            searchInput.blur();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    searchInput?.focus();
});

const searchTrigger = document.getElementById('searchTrigger');
if (searchTrigger) searchTrigger.addEventListener('click', runSearch);

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        fetchLiveNews(searchInput ? searchInput.value.trim() : '', e.currentTarget.dataset.filter);
    });
});

rangeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        rangeBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.range = e.currentTarget.dataset.range;
        fetchLiveNews(searchInput ? searchInput.value.trim() : '', currentCategory());
    });
});

const SUBMIT_MARKUP = '<span data-i18n="submit"></span> <i class="ph ph-paper-plane-right"></i>';

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('.btn-submit');
        btn.innerHTML = `<i class="ph ph-spinner ph-spin"></i> ${t('transmitting')}`;

        const payload = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            topic: document.getElementById('topic').value,
            message: document.getElementById('message').value
        };

        try {
            await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            btn.innerHTML = `<i class="ph ph-check-circle"></i> ${t('sent')}`;
            btn.style.background = 'var(--success)';
            e.target.reset();
        } catch (err) {
            btn.innerHTML = `<i class="ph ph-warning-circle"></i> ${t('failed')}`;
            btn.style.background = 'var(--danger)';
        }
        setTimeout(() => {
            btn.innerHTML = SUBMIT_MARKUP;
            translateNode(btn);
            btn.style.background = '';
        }, 3000);
    });
}

const openPrivacy = document.getElementById('openPrivacy');
const openTerms = document.getElementById('openTerms');
const modalPrivacy = document.getElementById('modalPrivacy');
const modalTerms = document.getElementById('modalTerms');
const closePrivacy = document.getElementById('closePrivacy');
const closeTerms = document.getElementById('closeTerms');

if (openPrivacy) openPrivacy.addEventListener('click', () => modalPrivacy.classList.add('active'));
if (openTerms) openTerms.addEventListener('click', () => modalTerms.classList.add('active'));
if (closePrivacy) closePrivacy.addEventListener('click', () => modalPrivacy.classList.remove('active'));
if (closeTerms) closeTerms.addEventListener('click', () => modalTerms.classList.remove('active'));
window.addEventListener('click', (e) => {
    if (e.target === modalPrivacy) modalPrivacy.classList.remove('active');
    if (e.target === modalTerms) modalTerms.classList.remove('active');
});

function applyLanguage(lang) {
    if (!I18N[lang]) lang = 'en';
    const previousLang = currentLang;
    currentLang = lang;
    try {
        localStorage.setItem(LANG_KEY, lang);
    } catch (err) {
        currentLang = lang;
    }
    const meta = LANGS[lang];

    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
    document.title = t('title');

    translateNode(document);

    if (langFlag) {
        delete langFlag.dataset.fallback;
        langFlag.src = flagSrc(meta.flag);
    }
    if (langCode) langCode.textContent = meta.code;

    document.querySelectorAll('.lang-item').forEach(item => {
        item.classList.toggle('active', item.dataset.lang === lang);
    });

    setGreeting();
    setSlogan();
    setPlaceholder();
    loadSuggestions();
    renderRecent();
    renderMeta();

    if (lastPagination) renderPagination(lastPagination.page, lastPagination.totalPages);

    if (!initialized) {
        initialized = true;
        return;
    }

    if (previousLang !== lang) {
        fetchLiveNews(state.query, state.category, state.page, false, true);
        return;
    }

    if (gridMode === 'cards') {
        renderCards(currentNewsData);
    } else {
        newsGrid.innerHTML = gridMessageHTML(gridMode);
    }

}

let savedLang = 'en';
try {
    savedLang = localStorage.getItem(LANG_KEY) || 'en';
} catch (err) {
    savedLang = 'en';
}

applyLanguage(savedLang);
fetchLiveNews('', 'all');
