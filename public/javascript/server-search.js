const UA = 'Mozilla/5.0 (compatible; VEROBot/1.0; +https://veropol.onrender.com)';
const BBC = 'https://feeds.bbci.co.uk/news/';
const GU = 'https://www.theguardian.com/';

const FEEDS = [
    { u: 'https://www.aljazeera.com/xml/rss/all.xml', s: 'Al Jazeera', l: 'en' },
    { u: 'https://www.aljazeera.net/aljazeerarss/a7c186be-1baa-4bd4-9d80-a84db769f779/73d0e1b4-532f-45ef-b135-bfdff8b8cab9', s: 'Al Jazeera', l: 'ar' },
    { u: 'https://english.alarabiya.net/tools/rss', s: 'Al Arabiya', l: 'en' },
    { u: 'https://www.al-monitor.com/rss', s: 'Al-Monitor', l: 'en' },
    { u: 'https://www.aa.com.tr/en/rss/default?cat=world', s: 'Anadolu Agency', l: 'en' },
    { u: 'https://www.aa.com.tr/ar/rss/default?cat=world', s: 'Anadolu Agency', l: 'ar' },
    { u: 'https://www.aa.com.tr/tr/rss/default?cat=dunya', s: 'Anadolu Agency', l: 'tr' },
    { u: BBC + 'world/rss.xml', s: 'BBC News', l: 'en' },
    { u: BBC + 'world/middle_east/rss.xml', s: 'BBC News', l: 'en' },
    { u: BBC + 'world/asia/rss.xml', s: 'BBC News', l: 'en' },
    { u: BBC + 'world/africa/rss.xml', s: 'BBC News', l: 'en' },
    { u: BBC + 'world/europe/rss.xml', s: 'BBC News', l: 'en' },
    { u: BBC + 'world/us_and_canada/rss.xml', s: 'BBC News', l: 'en' },
    { u: BBC + 'world/latin_america/rss.xml', s: 'BBC News', l: 'en' },
    { u: BBC + 'business/rss.xml', s: 'BBC News', l: 'en' },
    { u: 'https://feeds.bbci.co.uk/arabic/rss.xml', s: 'BBC News', l: 'ar' },
    { u: 'https://feeds.bbci.co.uk/turkce/rss.xml', s: 'BBC News', l: 'tr' },
    { u: 'https://feeds.bbci.co.uk/russian/rss.xml', s: 'BBC News', l: 'ru' },
    { u: 'https://feeds.bbci.co.uk/zhongwen/simp/rss.xml', s: 'BBC News', l: 'zh' },
    { u: 'https://feeds.bbci.co.uk/mundo/rss.xml', s: 'BBC News', l: 'es' },
    { u: GU + 'world/rss', s: 'The Guardian', l: 'en' },
    { u: GU + 'world/middleeast/rss', s: 'The Guardian', l: 'en' },
    { u: GU + 'world/europe-news/rss', s: 'The Guardian', l: 'en' },
    { u: GU + 'world/africa/rss', s: 'The Guardian', l: 'en' },
    { u: GU + 'world/asia-pacific/rss', s: 'The Guardian', l: 'en' },
    { u: GU + 'world/americas/rss', s: 'The Guardian', l: 'en' },
    { u: GU + 'business/rss', s: 'The Guardian', l: 'en' },
    { u: 'https://www.france24.com/en/rss', s: 'France 24', l: 'en' },
    { u: 'https://www.france24.com/fr/rss', s: 'France 24', l: 'fr' },
    { u: 'https://www.france24.com/es/rss', s: 'France 24', l: 'es' },
    { u: 'https://www.france24.com/ar/rss', s: 'France 24', l: 'ar' },
    { u: 'https://www.lemonde.fr/international/rss_full.xml', s: 'Le Monde', l: 'fr' },
    { u: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada', s: 'El País', l: 'es' },
    { u: 'https://rss.dw.com/rdf/rss-en-world', s: 'Deutsche Welle', l: 'en' },
    { u: 'https://rss.dw.com/rdf/rss-ar-all', s: 'Deutsche Welle', l: 'ar' },
    { u: 'https://rss.dw.com/rdf/rss-es-all', s: 'Deutsche Welle', l: 'es' },
    { u: 'https://rss.dw.com/rdf/rss-ru-all', s: 'Deutsche Welle', l: 'ru' },
    { u: 'https://rss.dw.com/rdf/rss-tr-all', s: 'Deutsche Welle', l: 'tr' },
    { u: 'https://www.euronews.com/rss?format=mrss', s: 'Euronews', l: 'en' },
    { u: 'https://fr.euronews.com/rss?format=mrss', s: 'Euronews', l: 'fr' },
    { u: 'https://arabic.euronews.com/rss?format=mrss', s: 'Euronews', l: 'ar' },
    { u: 'https://www.swissinfo.ch/eng/rss/top-news', s: 'SWI swissinfo.ch', l: 'en' },
    { u: 'https://news.un.org/feed/subscribe/en/news/all/rss.xml', s: 'UN News', l: 'en' },
    { u: 'https://news.un.org/feed/subscribe/ar/news/all/rss.xml', s: 'UN News', l: 'ar' },
    { u: 'https://news.un.org/feed/subscribe/fr/news/all/rss.xml', s: 'UN News', l: 'fr' },
    { u: 'https://news.un.org/feed/subscribe/es/news/all/rss.xml', s: 'UN News', l: 'es' },
    { u: 'https://news.un.org/feed/subscribe/ru/news/all/rss.xml', s: 'UN News', l: 'ru' },
    { u: 'https://news.un.org/feed/subscribe/zh/news/all/rss.xml', s: 'UN News', l: 'zh' },
    { u: 'https://feeds.npr.org/1004/rss.xml', s: 'NPR', l: 'en' },
    { u: 'https://www.pbs.org/newshour/feeds/rss/world', s: 'PBS NewsHour', l: 'en' },
    { u: 'https://rss.csmonitor.com/feeds/world', s: 'The Christian Science Monitor', l: 'en' }
];

const COUNTRIES = ['afghanistan', 'algeria', 'america', 'argentina', 'armenia', 'australia', 'austria', 'azerbaijan', 'bahrain', 'bangladesh', 'belarus', 'belgium', 'bolivia', 'brazil', 'britain', 'bulgaria', 'canada', 'chad', 'chile', 'china', 'colombia', 'congo', 'cuba', 'cyprus', 'denmark', 'ecuador', 'egypt', 'england', 'estonia', 'ethiopia', 'finland', 'france', 'georgia', 'germany', 'ghana', 'greece', 'hungary', 'iceland', 'india', 'indonesia', 'iran', 'iraq', 'ireland', 'israel', 'italy', 'japan', 'jordan', 'kazakhstan', 'kenya', 'korea', 'kosovo', 'kuwait', 'latvia', 'lebanon', 'libya', 'lithuania', 'malaysia', 'mali', 'mexico', 'moldova', 'morocco', 'myanmar', 'nepal', 'netherlands', 'niger', 'nigeria', 'norway', 'oman', 'pakistan', 'palestine', 'peru', 'philippines', 'poland', 'portugal', 'qatar', 'romania', 'russia', 'rwanda', 'saudi', 'serbia', 'singapore', 'slovakia', 'somalia', 'spain', 'sudan', 'sweden', 'switzerland', 'syria', 'taiwan', 'thailand', 'tunisia', 'turkey', 'turkiye', 'uganda', 'ukraine', 'emirates', 'venezuela', 'vietnam', 'yemen', 'zimbabwe', 'gaza', 'europe', 'africa', 'asia', 'nato', 'brics', 'opec'];

const ALIASES = [
    ['usa', 'us', 'america', 'american', 'americans', 'washington', 'united states'],
    ['uk', 'britain', 'british', 'london', 'united kingdom'],
    ['uae', 'emirates', 'emirati', 'dubai', 'abu dhabi'],
    ['russia', 'russian', 'moscow', 'kremlin'],
    ['china', 'chinese', 'beijing'],
    ['turkey', 'turkiye', 'turkish', 'ankara'],
    ['israel', 'israeli', 'tel aviv'],
    ['palestine', 'palestinian', 'palestinians'],
    ['iran', 'iranian', 'tehran'],
    ['ukraine', 'ukrainian', 'kyiv', 'kiev'],
    ['syria', 'syrian', 'damascus'],
    ['saudi', 'saudi arabia', 'riyadh'],
    ['eu', 'european union', 'brussels']
];

const STOP = new Set(['al', 'el', 'de', 'la', 'le', 'les', 'des', 'du', 'der', 'di', 'the', 'and', 'for', 'with', 'from', 'about', 'into', 'over', 'that', 'this', 'news', 'latest', 'of', 'in', 'on', 'to', 'an', 'is', 'are', 'was', 'what', 'who', 'how']);

const GEO = /geopolit|diplomat|sanction|military|defen[cs]e|troops|missile|navy|army|\bwar\b|conflict|ceasefire|treaty|summit|nato|security council|foreign (policy|minister)|embassy|alliance|nuclear|tariff|border|insurg|coup|junta|ukrain|russia|china|taiwan|iran|israel|gaza|syria|korea|sahel|brics|opec|airstrike|drone|президент|война|حرب|رئيس|وزير|guerre|guerra|savaş|战争/i;

const mk = (latin, other) => new RegExp('\\b(?:' + latin.join('|') + ')' + (other.length ? '|' + other.join('|') : ''), 'giu');

const CAT_DEFS = {
    military: mk(
        ['wars?\\b', 'warfare', 'wartime', 'militar', 'army\\b', 'armies', 'armée', 'ejército', 'ordu', 'troops?\\b', 'soldiers?\\b', 'soldat', 'soldado', 'asker', 'navy\\b', 'naval\\b', 'warships?', 'airstrikes?', 'air strikes?', 'missiles?', 'drones?\\b', 'artillery', 'bombing', 'shelling', 'offensive', 'front ?line', 'battles?\\b', 'combat', 'weapons?\\b', 'arms\\b', 'nato\\b', 'pentagon', 'idf\\b', 'rebels?\\b', 'insurgen', 'militia', 'fighters?\\b', 'defen[cs]e (?:minister|ministry|forces|budget)', 'guerre', 'frappes?\\b', 'misil', 'guerra', 'saldırı', 'savaş', 'füze', 'ceasefire violat'],
        ['حرب', 'عسكري', 'جيش', 'صاروخ', 'قصف', 'هجوم', 'غارة', 'مسيرة', 'معركة', 'سلاح', 'войн', 'военн', 'армия', 'армии', 'ракет', 'обстрел', 'беспилотник', 'оборон', 'наступлен', '战争', '军事', '军队', '导弹', '袭击', '国防', '空袭', '无人机', '战斗']
    ),
    diplomacy: mk(
        ['diplomat', 'summit', 'talks\\b', 'treaty', 'envoy', 'ambassador', 'embassy', 'negotiat', 'ceasefire', 'truce', 'accord\\b', 'foreign (?:minister|ministry|policy|affairs)', 'security council', 'general assembly', 'mediat', 'peace (?:deal|plan|talks|process)', 'sommet', 'négociat', 'ambassad', 'cessez', 'cumbre', 'negociaci', 'embajad', 'alto el fuego', 'zirve', 'müzakere', 'büyükelçi', 'ateşkes', 'diplomasi'],
        ['دبلوماس', 'قمة', 'محادثات', 'مفاوضات', 'معاهدة', 'مبعوث', 'سفير', 'سفارة', 'وقف إطلاق', 'هدنة', 'وساطة', 'дипломат', 'саммит', 'перегов', 'посол', 'посольств', 'перемири', '外交', '峰会', '谈判', '条约', '大使', '停火', '会谈', '和平']
    ),
    economy: mk(
        ['econom', 'trade\\b', 'tariffs?', 'inflation', 'markets?\\b', 'stocks?\\b', 'currenc', 'gdp\\b', 'bank', 'invest', 'financ', 'budget', 'debt\\b', 'recession', 'exports?\\b', 'imports?\\b', 'sanctions?', 'dollar', 'imf\\b', 'world bank', 'prices?\\b', 'économie', 'commerce', 'marché', 'economía', 'comercio', 'mercado', 'ekonomi', 'ticaret', 'piyasa', 'enflasyon', 'yaptırım'],
        ['اقتصاد', 'تجارة', 'تضخم', 'سوق', 'عقوبات', 'بنك', 'ميزانية', 'ديون', 'استثمار', 'عملة', 'دولار', 'эконом', 'торгов', 'инфляц', 'рынок', 'санкци', 'банк', 'бюджет', 'инвест', 'валют', 'пошлин', '经济', '贸易', '通胀', '市场', '制裁', '银行', '关税', '投资', '货币']
    ),
    energy: mk(
        ['oil\\b', 'gas\\b', 'lng\\b', 'pipelines?', 'opec', 'crude', 'petrol', 'energy', 'fuel', 'refiner', 'nuclear power', 'electricity', 'power grid', 'solar\\b', 'coal\\b', 'énergie', 'pétrole', 'gaz\\b', 'energía', 'gas natural', 'enerji', 'doğalgaz', 'akaryakıt'],
        ['نفط', 'غاز', 'طاقة', 'أوبك', 'بترول', 'أنابيب', 'كهرباء', 'нефт', 'газопровод', 'природный газ', 'энерг', 'опек', 'топлив', '石油', '天然气', '能源', '欧佩克', '管道', '电力']
    ),
    humanitarian: mk(
        ['humanitarian', 'refugees?\\b', 'famine', 'hunger', 'relief\\b', 'displace', 'asylum', 'migrants?\\b', 'migration', 'civilians?\\b', 'casualt', 'unicef', 'unhcr', 'red cross', 'red crescent', 'wfp\\b', 'cholera', 'epidemic', 'earthquake', 'floods?\\b', 'genocide', 'war crimes?', 'human rights', 'humanitaire', 'réfugi', 'humanitari', 'refugiad', 'insani', 'mülteci', 'açlık', 'deprem'],
        ['إنساني', 'لاجئ', 'مجاعة', 'إغاثة', 'نازح', 'مساعدات', 'ضحايا', 'مدني', 'حقوق الإنسان', 'كارثة', 'زلزال', 'فيضان', 'гуманитар', 'беженц', 'голод', 'эвакуац', 'мирные жител', 'жертв', 'права человека', 'катастроф', 'землетряс', 'наводнен', '人道', '难民', '饥荒', '援助', '平民', '伤亡', '人权', '灾难', '地震', '洪水']
    ),
    security: mk(
        ['terror', 'extremis', 'jihad', 'isis\\b', 'islamic state', 'daesh', 'al-?qaeda', 'taliban', 'hostages?\\b', 'kidnap', 'assassinat', 'espionage', 'spy\\b', 'spies\\b', 'intelligence (?:agency|service|chief)', 'mossad', 'shin bet', 'cia\\b', 'fbi\\b', 'mi6\\b', 'coup\\b', 'militants?\\b', 'crackdown', 'riots?\\b', 'unrest', 'attentat', 'secuestr', 'terrorismo', 'terör', 'casus', 'suikast', 'rehine'],
        ['إرهاب', 'إرهابي', 'داعش', 'القاعدة', 'رهائن', 'اختطاف', 'اغتيال', 'تجسس', 'استخبارات', 'انقلاب', 'اضطرابات', 'متشدد', 'террор', 'теракт', 'игил', 'заложник', 'похищен', 'убийств', 'шпион', 'разведк', 'переворот', 'беспорядк', 'экстремис', '恐怖', '极端', '人质', '绑架', '暗杀', '间谍', '情报', '政变', '骚乱']
    ),
    cyber: mk(
        ['cyber', 'hack', 'ransomware', 'malware', 'spyware', 'data breach', 'surveillance', 'artificial intelligence', 'ai\\b', 'chips?\\b', 'semiconductor', 'satellite', 'space\\b', 'quantum', '5g\\b', 'technolog', 'tech\\b', 'internet shutdown', 'disinformation', 'cybersécurité', 'piratage', 'ciberseguridad', 'hackeo', 'siber', 'yapay zeka', 'uydu', 'yarı iletken'],
        ['سيبراني', 'اختراق', 'قرصنة', 'برمجيات خبيثة', 'ذكاء اصطناعي', 'قمر صناعي', 'أقمار', 'فضاء', 'رقائق', 'تقنية', 'تكنولوجيا', 'кибер', 'хакер', 'взлом', 'искусственн', 'спутник', 'космос', 'чип', 'полупроводник', 'технолог', '网络', '黑客', '勒索', '人工智能', '卫星', '太空', '芯片', '半导体', '科技', '量子']
    ),
    middleeast: mk(
        ['israel', 'gaza', 'palestin', 'west bank', 'hamas', 'hezbollah', 'lebanon', 'beirut', 'syria', 'damascus', 'iraq', 'baghdad', 'iran\\b', 'iranian', 'tehran', 'yemen', 'houthi', 'saudi', 'riyadh', 'emirates', 'uae\\b', 'dubai', 'qatar', 'doha', 'kuwait', 'bahrain', 'oman\\b', 'jordan\\b', 'amman', 'egypt', 'cairo', 'red sea', 'persian gulf', 'jerusalem', 'tel aviv', 'golan', 'middle east', 'moyen-orient', 'oriente medio', 'orta doğu', 'israël', 'liban\\b', 'líbano', 'irak\\b', 'siria', 'suriye', 'filistin', 'lübnan', 'israil', 'égypte', 'egipto', 'mısır', 'katar'],
        ['إسرائيل', 'غزة', 'فلسطين', 'الضفة', 'حماس', 'حزب الله', 'لبنان', 'بيروت', 'سوريا', 'دمشق', 'العراق', 'بغداد', 'إيران', 'طهران', 'اليمن', 'الحوثي', 'السعودية', 'الرياض', 'الإمارات', 'قطر', 'الكويت', 'البحرين', 'الأردن', 'مصر', 'القاهرة', 'البحر الأحمر', 'الخليج', 'القدس', 'الشرق الأوسط', 'израил', 'сектор.? газа', 'палестин', 'хамас', 'хезболл', 'ливан', 'иран', 'тегеран', 'сири', 'дамаск', 'ирак', 'йемен', 'хуси', 'саудов', 'катар', 'египет', 'ближн\\S* восток', '以色列', '加沙', '巴勒斯坦', '哈马斯', '真主党', '黎巴嫩', '伊朗', '叙利亚', '伊拉克', '也门', '胡塞', '沙特', '卡塔尔', '埃及', '中东']
    ),
    europe: mk(
        ['europe', 'european', 'eu\\b', 'brussels', 'germany', 'berlin', 'france\\b', 'paris', 'macron', 'britain', 'london', 'italy', 'rome\\b', 'spain\\b', 'madrid', 'poland', 'warsaw', 'ukrain', 'kyiv', 'kiev', 'russia', 'moscow', 'kremlin', 'putin', 'baltic', 'finland', 'sweden', 'norway', 'denmark', 'netherlands', 'belgium', 'austria', 'switzerland', 'greece', 'hungary', 'orban', 'romania', 'serbia', 'balkans', 'allemagne', 'royaume-uni', 'alemania', 'reino unido', 'avrupa', 'almanya', 'fransa', 'rusya', 'ukrayna'],
        ['أوروبا', 'الاتحاد الأوروبي', 'بروكسل', 'ألمانيا', 'فرنسا', 'بريطانيا', 'إيطاليا', 'إسبانيا', 'بولندا', 'أوكرانيا', 'روسيا', 'موسكو', 'بوتين', 'كييف', 'европ', 'евросоюз', 'брюссел', 'герман', 'франци', 'британи', 'италия', 'испани', 'польш', 'украин', 'росси', 'москв', 'путин', 'киев', '欧洲', '欧盟', '德国', '法国', '英国', '意大利', '西班牙', '波兰', '乌克兰', '俄罗斯', '莫斯科', '普京', '基辅']
    ),
    asia: mk(
        ['china\\b', 'chinese', 'beijing', 'xi jinping', 'taiwan', 'taipei', 'japan', 'tokyo', 'korea', 'pyongyang', 'seoul', 'india\\b', 'delhi', 'modi\\b', 'pakistan', 'islamabad', 'afghanistan', 'kabul', 'bangladesh', 'myanmar', 'indonesia', 'jakarta', 'philippines', 'manila', 'vietnam', 'thailand', 'malaysia', 'singapore', 'asean', 'south china sea', 'indo-pacific', 'kazakhstan', 'central asia', 'chine\\b', 'japon', 'inde\\b', 'corée', 'japón', 'çin\\b', 'japonya', 'hindistan', 'kore\\b', 'tayvan'],
        ['الصين', 'بكين', 'تايوان', 'اليابان', 'طوكيو', 'كوريا', 'الهند', 'باكستان', 'أفغانستان', 'كابول', 'بنغلاديش', 'ميانمار', 'إندونيسيا', 'الفلبين', 'فيتنام', 'آسيا', 'китай', 'пекин', 'тайван', 'япони', 'токио', 'коре', 'индия', 'индии', 'пакистан', 'афганистан', 'мьянм', 'индонез', 'филиппин', 'вьетнам', 'азии', '中国', '北京', '台湾', '日本', '东京', '朝鲜', '韩国', '印度', '巴基斯坦', '阿富汗', '缅甸', '印尼', '菲律宾', '越南', '亚洲', '南海', '印太']
    ),
    africa: mk(
        ['africa', 'sahel', 'sudan', 'khartoum', 'ethiopia', 'addis', 'somalia', 'kenya', 'nairobi', 'nigeria', 'lagos', 'congo', 'kinshasa', 'rwanda', 'uganda', 'mali\\b', 'niger\\b', 'burkina', 'chad\\b', 'libya', 'tripoli', 'tunisia', 'algeria', 'morocco', 'mozambique', 'tigray', 'darfur', 'ghana', 'senegal', 'cameroon', 'afrique', 'soudan', 'éthiopie', 'libye', 'algérie', 'maroc', 'áfrica', 'sudán', 'libia', 'afrika', 'etiyopya', 'cezayir'],
        ['أفريقيا', 'إفريقيا', 'الساحل', 'السودان', 'الخرطوم', 'إثيوبيا', 'الصومال', 'كينيا', 'نيجيريا', 'الكونغو', 'رواندا', 'مالي', 'النيجر', 'بوركينا', 'تشاد', 'ليبيا', 'طرابلس', 'تونس', 'الجزائر', 'المغرب', 'موزمبيق', 'دارفور', 'африк', 'сахел', 'судан', 'хартум', 'эфиопи', 'сомали', 'кени', 'нигери', 'конго', 'руанд', 'мали', 'буркина', 'ливи', 'тунис', 'алжир', 'марокко', '非洲', '萨赫勒', '苏丹', '埃塞俄比亚', '索马里', '肯尼亚', '尼日利亚', '刚果', '卢旺达', '马里', '尼日尔', '布基纳', '乍得', '利比亚', '突尼斯', '阿尔及利亚', '摩洛哥']
    ),
    americas: mk(
        ['united states', 'u\\.s\\.', 'washington', 'white house', 'trump', 'biden', 'congress', 'canada', 'ottawa', 'mexico', 'brazil', 'lula\\b', 'argentina', 'milei', 'venezuela', 'maduro', 'colombia', 'cuba\\b', 'peru\\b', 'chile\\b', 'latin america', 'caribbean', 'panama', 'haiti', 'ecuador', 'bolivia', 'états-unis', 'etats-unis', 'estados unidos', 'amerika birleşik', 'abd\\b', 'kanada', 'meksika', 'brezilya', 'brésil', 'brasil', 'méxico'],
        ['الولايات المتحدة', 'واشنطن', 'البيت الأبيض', 'ترامب', 'بايدن', 'الكونغرس', 'كندا', 'المكسيك', 'البرازيل', 'الأرجنتين', 'فنزويلا', 'مادورو', 'كولومبيا', 'كوبا', 'أمريكا', 'сша', 'вашингтон', 'белый дом', 'трамп', 'байден', 'конгресс', 'канад', 'мексик', 'бразил', 'аргентин', 'венесуэл', 'мадуро', 'колумби', 'америк', '美国', '华盛顿', '白宫', '特朗普', '拜登', '国会', '加拿大', '墨西哥', '巴西', '阿根廷', '委内瑞拉', '马杜罗', '哥伦比亚', '古巴', '秘鲁', '智利', '美洲']
    )
};

const CAT_KEYS = Object.keys(CAT_DEFS);
const TOPIC_KEYS = ['military', 'diplomacy', 'economy', 'energy', 'humanitarian', 'security', 'cyber'];
const REGION_KEYS = ['middleeast', 'europe', 'asia', 'africa', 'americas'];

const THEATER_DEFS = {
    yemen: mk(
        ['yemen', 'houthi', 'red sea', 'sanaa', 'sana\'a', 'aden\\b', 'bab el-mandeb', 'bab al-mandab', 'yémen', 'mer rouge', 'hutíes', 'kızıldeniz'],
        ['اليمن', 'الحوثي', 'البحر الأحمر', 'صنعاء', 'йемен', 'хуси', 'хути', 'красное море', '也门', '胡塞', '红海']
    ),
    ukraine: mk(
        ['ukrain', 'kyiv', 'kiev', 'zelensk', 'donbas', 'donetsk', 'kharkiv', 'kherson', 'zaporizh', 'crimea', 'odesa', 'odessa', 'kremlin', 'moscow', 'putin', 'poutine', 'ucrania', 'ukrayna'],
        ['украин', 'киев', 'зеленск', 'донбас', 'донецк', 'харьков', 'херсон', 'запорож', 'крым', 'одесс', 'кремл', 'москв', 'путин', 'أوكرانيا', 'كييف', 'زيلينسكي', 'دونباس', 'القرم', 'الكرملين', 'موسكو', 'بوتين', '乌克兰', '基辅', '泽连斯基', '顿巴斯', '克里米亚', '克里姆林', '莫斯科', '普京']
    ),
    taiwan: mk(
        ['taiwan', 'taipei', 'taïwan', 'tayvan', 'south china sea', 'pla\\b', 'indo-pacific', 'senkaku', 'philippine sea', 'mer de chine', 'mar de china'],
        ['台湾', '台海', '南海', '解放军', '印太', 'тайван', 'южно-китайск', 'تايوان', 'بحر الصين الجنوبي']
    ),
    korea: mk(
        ['north korea', 'south korea', 'pyongyang', 'seoul', 'kim jong', 'korean peninsula', 'dmz\\b', 'corée', 'corea', 'kuzey kore', 'güney kore'],
        ['朝鲜', '韩国', '平壤', '首尔', '金正恩', 'северная коре', 'южная коре', 'пхеньян', 'сеул', 'ким чен', 'كوريا الشمالية', 'كوريا الجنوبية', 'بيونغ يانغ', 'سيول']
    ),
    sahel: mk(
        ['sahel', 'mali\\b', 'niger\\b', 'burkina', 'chad\\b', 'bamako', 'niamey', 'ouagadougou', 'jnim', 'africa corps', 'wagner', 'mauritania'],
        ['الساحل', 'مالي', 'النيجر', 'بوركينا', 'تشاد', 'باماكو', 'сахел', 'мали', 'буркина', '萨赫勒', '马里', '尼日尔', '布基纳', '乍得']
    ),
    brics: mk(
        ['brics', 'de-?dollari[sz]', 'opec', 'oil price', 'petrodollar', 'new development bank', 'shanghai cooperation', 'g20\\b', 'g7\\b', 'imf\\b', 'world bank'],
        ['بريكس', 'أوبك', 'سعر النفط', 'брикс', 'опек', '金砖', '欧佩克', '去美元化']
    ),
    mideast: mk(
        ['israel', 'gaza', 'hamas', 'hezbollah', 'lebanon', 'beirut', 'iran\\b', 'iranian', 'tehran', 'syria', 'damascus', 'iraq', 'baghdad', 'west bank', 'palestin', 'idf\\b', 'jerusalem', 'tel aviv', 'golan', 'middle east', 'moyen-orient', 'oriente medio', 'orta doğu', 'israël', 'liban\\b', 'líbano', 'irak\\b', 'siria', 'suriye', 'filistin', 'lübnan', 'israil'],
        ['إسرائيل', 'غزة', 'حماس', 'حزب الله', 'لبنان', 'بيروت', 'إيران', 'طهران', 'سوريا', 'دمشق', 'العراق', 'بغداد', 'الضفة', 'فلسطين', 'القدس', 'الشرق الأوسط', 'израил', 'сектор.? газа', 'хамас', 'хезболл', 'ливан', 'иран', 'тегеран', 'сири', 'дамаск', 'ирак', 'ближн\\S* восток', '以色列', '加沙', '哈马斯', '真主党', '黎巴嫩', '伊朗', '叙利亚', '伊拉克', '中东']
    )
};
const THEATER_ORDER = ['yemen', 'ukraine', 'taiwan', 'korea', 'sahel', 'brics', 'mideast'];

const ENTITY_WORDS = ['afghanistan', 'africa', 'algeria', 'america', 'argentina', 'armenia', 'assad', 'azerbaijan', 'bahrain', 'baghdad', 'beijing', 'beirut', 'belarus', 'biden', 'brazil', 'brics', 'britain', 'canada', 'china', 'council', 'crimea', 'cuba', 'cyprus', 'damascus', 'donbas', 'egypt', 'erdogan', 'ethiopia', 'europe', 'france', 'gaza', 'germany', 'greece', 'hamas', 'hezbollah', 'houthi', 'india', 'indonesia', 'iran', 'iraq', 'israel', 'italy', 'japan', 'jerusalem', 'jordan', 'kashmir', 'khamenei', 'korea', 'kremlin', 'kuwait', 'lebanon', 'libya', 'macron', 'mexico', 'morocco', 'moscow', 'myanmar', 'nato', 'netanyahu', 'nigeria', 'north', 'opec', 'pakistan', 'palestine', 'pentagon', 'poland', 'putin', 'pyongyang', 'qatar', 'russia', 'sahel', 'saudi', 'security', 'sharaa', 'somalia', 'south', 'strait', 'strip', 'sudan', 'syria', 'taiwan', 'tehran', 'trump', 'tunisia', 'turkey', 'turkiye', 'ukraine', 'vietnam', 'yemen', 'zelensky', 'zelenskyy'];
const ENTITY_TOKENS = new Set(ENTITY_WORDS);

const CONCEPTS = [
    { keys: ['الاسد', 'بشار الاسد', 'assad', 'al assad', 'alassad', 'asad', 'al asad', 'esad', 'esed', 'bashar al assad', 'bashar', 'bachar', 'эсад', 'асад', 'башар', '阿萨德'], en: 'Bashar al-Assad', vars: ['Assad', 'Syria', 'الأسد'] },
    { keys: ['الجولاني', 'الشرع', 'احمد الشرع', 'jolani', 'julani', 'golani', 'al sharaa', 'sharaa', 'şara', 'шараа', 'джулани', '朱拉尼'], en: 'Ahmed al-Sharaa', vars: ['Sharaa', 'Jolani', 'Syria', 'الشرع'] },
    { keys: ['حزب الله', 'hezbollah', 'hizbullah', 'hizballah', 'hizbollah', 'hezbolah', 'hizbullah', 'хезболла', 'хизбалла', '真主党'], en: 'Hezbollah', vars: ['Hezbollah', 'Lebanon', 'حزب الله'] },
    { keys: ['حماس', 'hamas', 'hamaz', 'hammas', 'хамас', '哈马斯'], en: 'Hamas', vars: ['Hamas', 'Gaza', 'حماس'] },
    { keys: ['الحوثي', 'الحوثيين', 'houthi', 'houthis', 'houti', 'husi', 'hutiler', 'хуситы', 'хуси', '胡塞'], en: 'Houthi', vars: ['Houthi', 'Yemen', 'الحوثي'] },
    { keys: ['زيلينسكي', 'zelensky', 'zelenskyy', 'zelenski', 'zelenskiy', 'zelenskyi', 'зеленский', '泽连斯基'], en: 'Zelensky', vars: ['Zelensky', 'Ukraine', 'زيلينسكي'] },
    { keys: ['نتنياهو', 'netanyahu', 'netanyau', 'natanyahu', 'nethanyahu', 'netanyahou', 'нетаньяху', '内塔尼亚胡'], en: 'Netanyahu', vars: ['Netanyahu', 'Israel', 'نتنياهو'] },
    { keys: ['اردوغان', 'erdogan', 'erdoğan', 'erdowan', 'erdoan', 'эрдоган', '埃尔多安'], en: 'Erdogan', vars: ['Erdogan', 'Turkey', 'أردوغان'] },
    { keys: ['خامنئي', 'khamenei', 'khamanei', 'hamaney', 'хаменеи', '哈梅内伊'], en: 'Khamenei', vars: ['Khamenei', 'Iran', 'خامنئي'] },
    { keys: ['السيسي', 'sisi', 'el sisi', 'al sisi', 'сиси', '塞西'], en: 'Sisi', vars: ['Sisi', 'Egypt', 'السيسي'] }
].map(c => ({ ...c, keys: c.keys.map(k => norm(k)) }));

function hits(re, text) {
    if (!text) return 0;
    const m = String(text).match(re);
    if (!m) return 0;
    return new Set(m.map(x => x.toLowerCase())).size;
}

function annotate(it) {
    const cs = {};
    for (const k of CAT_KEYS) {
        const th = hits(CAT_DEFS[k], it.title);
        const dh = hits(CAT_DEFS[k], it.description);
        if (th >= 1 || dh >= 2) cs[k] = th * 3 + dh;
    }
    it._cs = cs;
    let best = null;
    let bs = 0;
    for (const k of TOPIC_KEYS) if (cs[k] > bs) { best = k; bs = cs[k]; }
    if (!best) for (const k of REGION_KEYS) if (cs[k] > bs) { best = k; bs = cs[k]; }
    it._cat = best || 'intel';
    return it;
}

const RANGE_HOURS = { '24h': 24, '7d': 168, '30d': 720 };
const FEED_TTL = 5 * 60 * 1000;

function decodeEntities(s) {
    return s
        .replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n))
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

function stripHtml(s) {
    let t = String(s || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
    t = decodeEntities(t);
    t = t.replace(/<[^>]+>/g, ' ');
    t = decodeEntities(t);
    return t.replace(/\s+/g, ' ').trim();
}

function tag(block, name) {
    const m = block.match(new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + name + '>', 'i'));
    return m ? m[1] : '';
}

function attr(block, name, a) {
    const m = block.match(new RegExp('<' + name + '\\s[^>]*?' + a + '="([^"]+)"', 'i'));
    return m ? decodeEntities(m[1]) : '';
}

function norm(s) {
    return String(s).toLowerCase().normalize('NFKD')
        .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
        .replace(/\p{M}/gu, '')
        .replace(/[أإآٱ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/ı/g, 'i')
        .replace(/ß/g, 'ss')
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .trim();
}

const isCJK = s => /[\u3400-\u9FFF]/.test(s);
const stemAr = t => (t.length > 4 ? t.replace(/^ال/, '') : t);
const tokensOf = s => norm(s).split(' ').filter(Boolean).map(stemAr);

function dist(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    const al = a.length;
    const bl = b.length;
    const d = [];
    for (let i = 0; i <= al; i++) d[i] = [i];
    for (let j = 1; j <= bl; j++) d[0][j] = j;
    for (let i = 1; i <= al; i++) {
        for (let j = 1; j <= bl; j++) {
            const c = a[i - 1] === b[j - 1] ? 0 : 1;
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        }
    }
    return d[al][bl];
}

function parseFeed(xml, feed) {
    const blocks = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || [];
    const items = [];
    for (const b of blocks.slice(0, 60)) {
        const title = stripHtml(tag(b, 'title'));
        if (!title) continue;
        let url = stripHtml(tag(b, 'link'));
        if (!url) url = attr(b, 'link', 'href');
        if (!/^https?:\/\//.test(url)) url = stripHtml(tag(b, 'guid'));
        if (!/^https?:\/\//.test(url)) continue;
        const rawDesc = tag(b, 'description') || tag(b, 'summary') || tag(b, 'content:encoded') || tag(b, 'content');
        const desc = stripHtml(rawDesc).slice(0, 320);
        let image = attr(b, 'media:content', 'url') || attr(b, 'media:thumbnail', 'url');
        if (!image) {
            const enc = b.match(/<enclosure\s[^>]*>/i);
            if (enc && /image/i.test(enc[0])) {
                const m = enc[0].match(/url="([^"]+)"/i);
                if (m) image = decodeEntities(m[1]);
            }
        }
        if (!image) {
            const html = decodeEntities(String(rawDesc).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') + tag(b, 'content:encoded'));
            const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (m) image = m[1];
        }
        const dateRaw = stripHtml(tag(b, 'pubDate') || tag(b, 'dc:date') || tag(b, 'published') || tag(b, 'updated'));
        let when = new Date(dateRaw);
        if (isNaN(when.getTime())) when = new Date();
        const tl = tokensOf(title);
        const dl = tokensOf(desc);
        items.push({
            title,
            description: desc,
            url,
            image: /^https?:\/\//.test(image) ? image : null,
            publishedAt: when.toISOString(),
            ts: when.getTime(),
            source: feed.s,
            lang: feed.l,
            _tl: tl,
            _dl: dl,
            _t: new Set(tl),
            _d: new Set(dl),
            _tn: norm(title),
            _dn: norm(desc)
        });
    }
    items.forEach(annotate);
    return items;
}

function dedupe(list) {
    const seen = new Set();
    const seenTok = [];
    const out = [];
    for (const it of list) {
        const key = norm(it.title).slice(0, 48) + '|' + it.lang;
        if (seen.has(key) || seen.has(it.url) || (it.image && seen.has(it.image))) continue;
        const tok = new Set(norm(it.title).split(' ').filter(w => w.length > 3));
        let dup = false;
        if (tok.size >= 4) {
            for (const o of seenTok) {
                let n = 0;
                tok.forEach(w => { if (o.has(w)) n++; });
                if (n / Math.min(tok.size, o.size) >= 0.7) { dup = true; break; }
            }
        }
        if (dup) continue;
        seen.add(key);
        seen.add(it.url);
        if (it.image) seen.add(it.image);
        seenTok.push(tok);
        out.push(it);
    }
    return out;
}

module.exports = function createSearch({ translator, matchSource }) {
    const store = new Map();
    let corpus = [];
    let vocab = new Map();
    let refreshing = null;
    let lastRefresh = 0;
    const gnewsCache = new Map();

    async function pull(feed) {
        try {
            const response = await fetch(feed.u, {
                headers: { 'User-Agent': UA, 'Accept': 'application/rss+xml, application/xml, text/xml, */*' },
                signal: AbortSignal.timeout(9000),
                redirect: 'follow'
            });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const xml = await response.text();
            const items = parseFeed(xml, feed);
            if (!items.length) throw new Error('no items');
            store.set(feed.u, { items, at: Date.now(), ok: true, error: '' });
        } catch (e) {
            const prev = store.get(feed.u);
            store.set(feed.u, { items: prev ? prev.items : [], at: Date.now(), ok: false, error: String(e.message || e) });
        }
    }

    async function refresh() {
        let i = 0;
        await Promise.all(Array.from({ length: 8 }, async () => {
            while (i < FEEDS.length) await pull(FEEDS[i++]);
        }));
        const all = [];
        store.forEach(v => all.push(...v.items));
        corpus = dedupe(all);
        const v = new Map();
        for (const it of corpus) {
            for (const t of it._tl) if (t.length >= 4 && !isCJK(t)) v.set(t, (v.get(t) || 0) + 2);
            for (const t of it._dl) if (t.length >= 4 && !isCJK(t)) v.set(t, (v.get(t) || 0) + 1);
        }
        COUNTRIES.forEach(c => v.set(c, (v.get(c) || 0) + 5));
        vocab = v;
        lastRefresh = Date.now();
    }

    async function ensure() {
        if (corpus.length && Date.now() - lastRefresh < FEED_TTL) return;
        if (!refreshing) refreshing = refresh().finally(() => { refreshing = null; });
        if (!corpus.length) await refreshing;
    }

    function nearest(token, source, max) {
        let best = null;
        let bestD = max + 1;
        let bestW = -1;
        const weight = source instanceof Map ? c => source.get(c) : () => 1;
        for (const cand of (source instanceof Map ? source.keys() : source)) {
            if (cand[0] !== token[0] || Math.abs(cand.length - token.length) > max) continue;
            const d = dist(token, cand, max);
            const w = weight(cand);
            if (d <= max && d > 0 && (d < bestD || (d === bestD && w > bestW))) {
                best = cand;
                bestD = d;
                bestW = w;
            }
        }
        return best;
    }

    function correct(token) {
        if (token.length < 4 || isCJK(token) || /[^\x00-\x7f]/.test(token) || ENTITY_TOKENS.has(token)) return null;
        const known = vocab.get(token) || 0;
        if (known < 4) {
            const e = nearest(token, ENTITY_TOKENS, token.length >= 7 ? 2 : 1);
            if (e) return e;
        }
        if (known) return null;
        return nearest(token, vocab, token.length >= 5 ? 2 : 1);
    }

    function findConcept(q) {
        const nq = norm(q);
        if (!nq) return { exact: null, partial: null };
        const arabic = /[\u0600-\u06FF]/.test(nq);
        const tokens = nq.split(' ');
        let partial = null;
        for (const c of CONCEPTS) {
            for (const k of c.keys) {
                if (nq === k) return { exact: c, partial: null };
                if (!arabic && k.length >= 5 && !k.includes(' ') && Math.abs(nq.length - k.length) <= 1 && dist(nq, k, 1) <= 1) return { exact: c, partial: null };
                if (!partial && tokens.length > 1 && !k.includes(' ') && tokens.includes(k)) partial = c;
            }
        }
        return { exact: null, partial };
    }

    async function expand(q, client) {
        const found = findConcept(q);
        const d = await translator.detectToEnglish(q);
        let english = q;
        let detected = null;
        let ok = false;
        if (d) {
            english = d.text || q;
            detected = d.detected;
            ok = true;
        } else if (client && client.english) {
            english = String(client.english).slice(0, 120);
            detected = translator.normalizeLang(client.detected);
            ok = true;
        }
        if (found.exact) {
            english = found.exact.en;
            ok = true;
            if (!detected) detected = /[\u0600-\u06FF]/.test(q) ? 'ar' : /[\u0400-\u04FF]/.test(q) ? 'ru' : /[\u3400-\u9FFF]/.test(q) ? 'zh' : null;
        }
        const variants = new Map();
        variants.set(q, 1);
        variants.set(english, 1);
        const concept = found.exact || found.partial;
        if (concept) {
            variants.set(concept.en, 1);
            concept.vars.forEach(v => variants.set(v, 0.9));
        }
        if (client && Array.isArray(client.vars) && !found.exact) client.vars.slice(0, 12).forEach(v => variants.set(String(v).slice(0, 80), 0.9));
        if (ok && !(client && client.vars && client.vars.length && !found.exact)) {
            const langs = ['ar', 'fr', 'es', 'ru', 'zh', 'tr'];
            const res = await Promise.all(langs.map(l => translator.translateTexts([english], l, 'en').catch(() => [null])));
            res.forEach(r => { if (r && r[0]) variants.set(r[0], 0.9); });
        }
        return { english, detected, ok, variants, concept: !!found.exact };
    }

    function buildTerms(q, ex) {
        const terms = new Map();
        terms.exact = new Set();
        const put = (t, w) => {
            if (!t || t.length < 2 || STOP.has(t)) return;
            if (!terms.has(t) || terms.get(t) < w) terms.set(t, w);
        };
        ex.variants.forEach((w, text) => tokensOf(text).forEach(t => put(t, w)));
        const joined = norm(ex.english);
        ALIASES.forEach(group => {
            const hit = group.some(g => joined === g || tokensOf(ex.english).includes(g));
            if (hit) group.forEach(g => g.split(' ').forEach(p => put(p, 0.8)));
        });
        tokensOf(q).concat(tokensOf(ex.english)).forEach(t => {
            const fix = correct(t);
            if (!fix) return;
            put(fix, 0.9);
            terms.exact.add(fix);
            if (ENTITY_TOKENS.has(fix) && (vocab.get(t) || 0) < 4) terms.delete(t);
        });
        return terms;
    }

    function matchTerm(term, it, exact) {
        if (isCJK(term)) {
            if (it._tn.includes(term)) return 4;
            if (it._dn.includes(term)) return 2;
            return 0;
        }
        if (it._t.has(term)) return 4;
        if (it._d.has(term)) return 2;
        if (term.length >= 4 && !exact) {
            for (const t of it._tl) if (t.length >= 4 && (t.startsWith(term) || term.startsWith(t))) return 3;
            for (const t of it._dl) if (t.length >= 4 && (t.startsWith(term) || term.startsWith(t))) return 1.5;
        }
        return 0;
    }

    async function gnews(english, from, key) {
        const tokens = tokensOf(english).filter(t => t.length >= 3 && !STOP.has(t) && !/[^\x00-\x7f]/.test(t)).slice(0, 6);
        if (!tokens.length || !key) return [];
        const query = tokens.join(' OR ');
        const ck = query + '|' + (from || '');
        const hit = gnewsCache.get(ck);
        if (hit && hit.exp > Date.now()) return hit.items;
        const out = [];
        for (let p = 1; p <= 2; p++) {
            try {
                let url = 'https://gnews.io/api/v4/search?q=' + encodeURIComponent(query) + '&lang=en&max=10&in=title,description&apikey=' + key;
                if (p > 1) url += '&page=' + p;
                if (from) url += '&from=' + encodeURIComponent(from);
                const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
                if (!response.ok) break;
                const data = await response.json();
                const list = data && Array.isArray(data.articles) ? data.articles : [];
                list.forEach(a => {
                    const src = matchSource(a.source && a.source.url ? a.source.url : a.url);
                    if (!src || !a.title) return;
                    const t = stripHtml(a.title);
                    const dsc = stripHtml(a.description || '');
                    const ts = new Date(a.publishedAt || Date.now()).getTime();
                    out.push({
                        title: t,
                        description: dsc,
                        url: a.url,
                        image: a.image && /^https?:\/\//.test(a.image) ? a.image : null,
                        publishedAt: new Date(ts).toISOString(),
                        ts,
                        source: src.name,
                        lang: 'en',
                        _tl: tokensOf(t),
                        _dl: tokensOf(dsc),
                        _t: new Set(tokensOf(t)),
                        _d: new Set(tokensOf(dsc)),
                        _tn: norm(t),
                        _dn: norm(dsc),
                        gnews: true
                    });
                });
                if (list.length < 10) break;
            } catch (e) {
                break;
            }
        }
        out.forEach(annotate);
        if (gnewsCache.size > 120) gnewsCache.delete(gnewsCache.keys().next().value);
        gnewsCache.set(ck, { items: out, exp: Date.now() + 30 * 60 * 1000 });
        return out;
    }

    function decideLang(q, english, detected, ui) {
        const script = /[\u0600-\u06FF]/.test(q) ? 'ar' : /[\u0400-\u04FF]/.test(q) ? 'ru' : /[\u3400-\u9FFF]/.test(q) ? 'zh' : null;
        const lang = detected || script;
        if (!lang) return ui;
        if (lang === 'en') {
            const words = q.trim().split(/\s+/).length;
            return words >= 2 && !script ? 'en' : ui;
        }
        if (!script && english.trim().toLowerCase() === q.trim().toLowerCase()) return ui;
        return lang;
    }

    async function search(opts) {
        await ensure();
        const q = (opts.q || '').trim();
        const size = opts.size;
        const cutoffHours = RANGE_HOURS[opts.range];
        const cutoff = cutoffHours ? Date.now() - cutoffHours * 3600000 : 0;
        const cat = CAT_DEFS[opts.category] ? opts.category : 'all';
        const catOk = it => cat === 'all' || !!(it._cs && it._cs[cat]);
        const catBoost = it => (cat === 'all' ? 0 : Math.min(3, (it._cs[cat] || 0) / 3));
        const now = Date.now();
        let uiLang = opts.uiLang;
        let english = q;
        let needsExpansion = false;
        let results = [];

        const recency = it => {
            const h = (now - it.ts) / 3600000;
            return h < 24 ? 1.5 : h < 72 ? 1 : h < 168 ? 0.5 : 0;
        };

        if (!q) {
            results = corpus
                .filter(it => it.ts >= cutoff && catOk(it))
                .map(it => ({ it, score: (GEO.test(it.title) ? 2 : 0) + (GEO.test(it.description) ? 1 : 0) + recency(it) + catBoost(it) + (it.lang === uiLang ? 1.5 : 0) + (it.image ? 0.3 : 0) }));
        } else {
            const ex = await expand(q, opts.client);
            english = ex.english;
            needsExpansion = !ex.ok && !(opts.client && opts.client.english);
            if (opts.detect) uiLang = decideLang(q, english, ex.detected, uiLang);
            const terms = buildTerms(q, ex);
            const groups = [];
            if (!ex.concept) {
                tokensOf(ex.english).forEach(t => {
                    if (t.length < 2 || STOP.has(t) || isCJK(t) || /[^\x00-\x7f]/.test(t)) return;
                    const g = new Set([t]);
                    const fix = correct(t);
                    if (fix) g.add(fix);
                    ALIASES.forEach(group => { if (group.includes(t)) group.forEach(x => { if (!x.includes(' ')) g.add(x); }); });
                    groups.push(g);
                });
            }
            const need = groups.length >= 3 ? Math.ceil(groups.length / 2) : 0;
            const key = process.env.GNEWS_API_KEY;
            const from = cutoffHours ? new Date(Math.floor((now - cutoffHours * 3600000) / 3600000) * 3600000).toISOString() : null;
            const extra = await gnews(english, from, key);
            const pool = dedupe(corpus.concat(extra));
            pool.forEach(it => {
                if (it.ts < cutoff) return;
                if (!catOk(it)) return;
                let score = 0;
                terms.forEach((w, term) => { score += w * matchTerm(term, it, terms.exact.has(term)); });
                if (score <= 0) return;
                if (groups.length && it.lang === 'en') {
                    let covered = 0;
                    groups.forEach(g => { for (const t of g) { if (matchTerm(t, it) > 0) { covered++; break; } } });
                    if (need && covered < need) return;
                    score += covered * 2;
                }
                score += recency(it) + catBoost(it) + (it.lang === uiLang ? 1.5 : 0) + (it.image ? 0.3 : 0);
                results.push({ it, score });
            });
        }

        results.sort((a, b) => b.score - a.score || b.it.ts - a.it.ts);
        const total = results.length;
        const totalPages = Math.max(1, Math.ceil(total / size));
        const page = Math.min(Math.max(opts.page, 1), totalPages);
        const articles = results.slice((page - 1) * size, page * size).map(r => ({
            title: r.it.title,
            description: r.it.description,
            url: r.it.url,
            image: r.it.image,
            publishedAt: r.it.publishedAt,
            source: r.it.source,
            lang: r.it.lang,
            cat: r.it._cat
        }));
        return { articles, page, totalPages, total, lang: uiLang, queryEnglish: english, needsExpansion };
    }

    function pub(it) {
        return { title: it.title, description: it.description, url: it.url, image: it.image, publishedAt: it.publishedAt, source: it.source, lang: it.lang };
    }

    let theaterCache = { at: 0, data: null };

    function theaters() {
        const now = Date.now();
        if (theaterCache.data && now - theaterCache.at < 45000) return theaterCache.data;
        const buckets = {};
        THEATER_ORDER.forEach(id => { buckets[id] = []; });
        for (const it of corpus) {
            if (now - it.ts > 72 * 3600000) continue;
            const id = THEATER_ORDER.find(k => hits(THEATER_DEFS[k], it.title) >= 1 || hits(THEATER_DEFS[k], it.description) >= 2);
            if (id) buckets[id].push(it);
        }
        const out = {};
        THEATER_ORDER.forEach(id => {
            const list = buckets[id].sort((a, b) => b.ts - a.ts);
            const day = list.filter(it => now - it.ts <= 24 * 3600000);
            const lead = list[0] || null;
            let tag = 'latest';
            if (lead) {
                const h = (now - lead.ts) / 3600000;
                tag = h < 1.5 ? 'breaking' : h < 8 ? 'new' : 'latest';
            }
            out[id] = {
                lead: lead ? pub(lead) : null,
                more: list.slice(1, 3).map(pub),
                tag,
                count24h: day.length,
                sources24h: new Set(day.map(it => it.source)).size
            };
        });
        theaterCache = { at: now, data: { theaters: out, updatedAt: lastRefresh ? new Date(lastRefresh).toISOString() : null } };
        return theaterCache.data;
    }

    function feedHealth() {
        const feeds = FEEDS.map(f => {
            const s = store.get(f.u);
            return { source: f.s, lang: f.l, url: f.u, ok: s ? s.ok : null, items: s ? s.items.length : 0, error: s ? s.error : 'not fetched yet' };
        });
        return { corpus: corpus.length, vocabulary: vocab.size, working: feeds.filter(f => f.ok).length, total: feeds.length, feeds };
    }

    function warm() {
        ensure().catch(() => { });
        setInterval(() => {
            if (!refreshing) refreshing = refresh().finally(() => { refreshing = null; });
        }, FEED_TTL).unref();
    }

    async function theatersLive() {
        await ensure();
        return theaters();
    }

    return { search, feedHealth, warm, theaters: theatersLive };
};
