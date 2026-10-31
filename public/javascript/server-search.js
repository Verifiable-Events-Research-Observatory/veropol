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
    syria: mk(
        ['syria', 'syrian', 'damascus', 'druze', 'suwayda', 'sweida', 'sharaa', 'golan', 'syrie', 'siria', 'suriye', 'süveyda', 'dürzi'],
        ['سوريا', 'سوري', 'دمشق', 'الدروز', 'السويداء', 'الجولان', 'الشرع', 'сири', 'дамаск', 'друз', 'сувейд', 'голан', '叙利亚', '大马士革', '德鲁兹', '戈兰']
    ),
    lebanon: mk(
        ['lebanon', 'lebanese', 'beirut', 'hezbollah', 'hizbullah', 'litani', 'nabatieh', 'south lebanon', 'liban\\b', 'líbano', 'lübnan', 'hizbullah'],
        ['لبنان', 'لبناني', 'بيروت', 'حزب الله', 'الليطاني', 'جنوب لبنان', 'ливан', 'бейрут', 'хезболл', '黎巴嫩', '贝鲁特', '真主党']
    ),
    sudan: mk(
        ['sudan\\b', 'sudanese', 'khartoum', 'darfur', 'rsf\\b', 'rapid support forces', 'el fasher', 'al fashir', 'omdurman', 'soudan', 'sudán', 'sudan ordusu'],
        ['السودان', 'سوداني', 'الخرطوم', 'دارفور', 'الدعم السريع', 'الفاشر', 'أم درمان', 'судан', 'хартум', 'дарфур', '苏丹', '喀土穆', '达尔富尔']
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
const THEATER_ORDER = ['yemen', 'ukraine', 'syria', 'lebanon', 'sudan', 'taiwan', 'korea', 'sahel', 'brics', 'mideast'];

const ENTITY_WORDS = ['afghanistan', 'africa', 'algeria', 'america', 'argentina', 'armenia', 'assad', 'azerbaijan', 'bahrain', 'baghdad', 'beijing', 'beirut', 'belarus', 'biden', 'brazil', 'brics', 'britain', 'canada', 'china', 'council', 'crimea', 'cuba', 'cyprus', 'damascus', 'donbas', 'egypt', 'erdogan', 'ethiopia', 'europe', 'france', 'gaza', 'germany', 'greece', 'hamas', 'hezbollah', 'houthi', 'india', 'indonesia', 'iran', 'iraq', 'israel', 'italy', 'japan', 'jerusalem', 'jordan', 'kashmir', 'khamenei', 'korea', 'kremlin', 'kuwait', 'lebanon', 'libya', 'macron', 'mexico', 'morocco', 'moscow', 'myanmar', 'nato', 'netanyahu', 'nigeria', 'north', 'opec', 'pakistan', 'palestine', 'pentagon', 'poland', 'putin', 'pyongyang', 'qatar', 'russia', 'sahel', 'saudi', 'security', 'sharaa', 'somalia', 'south', 'strait', 'strip', 'sudan', 'syria', 'taiwan', 'tehran', 'trump', 'tunisia', 'turkey', 'turkiye', 'ukraine', 'vietnam', 'yemen', 'zelensky', 'zelenskyy'];
const ENTITY_TOKENS = new Set(ENTITY_WORDS);



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

function upgradeImage(u) {
    if (!u) return u;
    return u.replace(/(\/ace\/standard\/|\/news\/)\d{2,4}\//, '$1800/');
}

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
            image: /^https?:\/\//.test(image) ? upgradeImage(image) : null,
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
    const imageSet = new Set();
    const knownUrls = new Set();
    const ogCache = new Map();
    const ogUses = new Map();
    const entityCache = new Map();
    const suggestCache = new Map();
    const webCache = new Map();
    const devState = new Map();
    let trending = [];

    function allowImage(u) {
        if (!u) return;
        if (imageSet.size > 6000) imageSet.clear();
        imageSet.add(u);
    }

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
        corpus.forEach(it => { allowImage(it.image); knownUrls.add(it.url); });
        if (knownUrls.size > 12000) knownUrls.clear();
        trending = computeTrending();
        const v = new Map();
        for (const it of corpus) {
            for (const t of it._tl) if (t.length >= 4 && !isCJK(t)) v.set(t, (v.get(t) || 0) + 2);
            for (const t of it._dl) if (t.length >= 4 && !isCJK(t)) v.set(t, (v.get(t) || 0) + 1);
        }
        COUNTRIES.forEach(c => v.set(c, (v.get(c) || 0) + 5));
        vocab = v;
        lastRefresh = Date.now();
    }

    const CAP_STOP = new Set(['the', 'why', 'how', 'what', 'who', 'when', 'where', 'after', 'amid', 'over', 'with', 'from', 'into', 'new', 'says', 'said', 'will', 'live', 'news', 'update', 'watch', 'video', 'photos', 'here', 'this', 'that', 'its', 'his', 'her', 'and', 'for', 'but', 'not', 'are', 'was', 'were', 'has', 'have', 'could', 'would', 'should', 'more', 'than', 'first', 'last', 'one', 'two', 'three', 'four', 'five', 'all', 'now', 'day', 'week', 'year', 'years', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']);

    function phrases(title) {
        const words = String(title).replace(/[“”"':;,.!?()\[\]–—|/]/g, ' ').split(/\s+/).filter(Boolean);
        const out = [];
        let cur = [];
        const flush = () => {
            if (cur.length) out.push(cur.join(' '));
            cur = [];
        };
        words.forEach(w => {
            if (/^[A-Z][A-Za-z-]{2,}$/.test(w) && !CAP_STOP.has(w.toLowerCase())) cur.push(w);
            else flush();
        });
        flush();
        return out.filter(p => p.split(' ').length <= 3 && p.length >= 4);
    }

    function computeTrending() {
        const now = Date.now();
        const counts = new Map();
        for (const it of corpus) {
            if (it.lang !== 'en' || now - it.ts > 48 * 3600000) continue;
            const seen = new Set(phrases(it.title));
            seen.forEach(p => {
                const e = counts.get(p) || { n: 0, src: new Set() };
                e.n++;
                e.src.add(it.source);
                counts.set(p, e);
            });
        }
        return [...counts.entries()]
            .filter(([p, e]) => e.src.size >= 2 && !/^(Al|The)\s/.test(p))
            .sort((a, b) => b[1].src.size - a[1].src.size || b[1].n - a[1].n)
            .slice(0, 40)
            .map(([p]) => p);
    }

    function relatedFor(list, exclude) {
        const counts = new Map();
        const ex = new Set(exclude.map(x => x.toLowerCase()));
        list.slice(0, 30).forEach(r => {
            if (r.it.lang !== 'en') return;
            new Set(phrases(r.it.title)).forEach(p => {
                const low = p.toLowerCase();
                if ([...ex].some(e => low.includes(e) || e.includes(low))) return;
                counts.set(p, (counts.get(p) || 0) + 1);
            });
        });
        return [...counts.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([p]) => p);
    }

    const LANG_SCRIPT = q => (/[\u0600-\u06FF]/.test(q) ? 'ar' : /[\u0400-\u04FF]/.test(q) ? 'ru' : /[\u3400-\u9FFF]/.test(q) ? 'zh' : null);
    const WD = 'https://www.wikidata.org/w/api.php';
    const WD_HEADERS = { 'User-Agent': UA, Accept: 'application/json' };
    const KIND_RULES = [
        ['Leader', /\b(president|prime minister|head of state|head of government|chancellor|monarch|king of|queen of|emir|sultan|supreme leader|dictator|minister of|governor|mayor|politician|statesman|leader of)\b/i],
        ['Company', /\b(company|corporation|conglomerate|manufacturer|startup|retailer|bank|airline|firm|brand|publisher|studio|enterprise)\b/i],
        ['Market', /\b(stock exchange|stock market|stock index|securities exchange|currency|cryptocurrency|commodity|index of|financial market)\b/i],
        ['Software', /\b(software|operating system|chatbot|language model|artificial intelligence|programming language|framework|library for|web browser|search engine|application|mobile app|platform|online service|distribution service|website|social network|messaging)\b/i],
        ['Game', /\b(video game|mobile game|board game|computer game|game series|esports|role-playing|strategy game)\b/i],
        ['Country', /\b(sovereign state|country in|country of|nation state|federal republic|kingdom in|republic in|emirate)\b/i],
        ['Place', /\b(city|town|village|river|mountain|range|region|territory|island|sea|strait|capital|province|county|desert|lake|peninsula|plateau|municipality|district|valley|bay|gulf|ocean|continent|canal|port|airport|state of|area in|neighbourhood|border)\b/i],
        ['Organization', /\b(organization|organisation|alliance|union|political party|agency|movement|group|council|militant|army|armed forces|association|institution|committee|ministry|court|university)\b/i],
        ['Event', /\b(election|war|battle|conflict|summit|crisis|disaster|earthquake|treaty|revolution|attack|protest|referendum|pandemic|hurricane|siege)\b/i],
        ['Person', /\b(businessman|entrepreneur|actor|actress|singer|rapper|footballer|player|journalist|activist|scientist|writer|author|engineer|billionaire|investor|born|philosopher|physicist|astronaut|youtuber|streamer|comedian|director|producer|musician|artist|economist|general|commander)\b/i]
    ];

    function kindOf(description) {
        const d = String(description || '');
        for (const [kind, re] of KIND_RULES) if (re.test(d)) return kind;
        return 'Topic';
    }

    async function wdFetch(params) {
        const r = await fetch(WD + '?format=json&origin=*&' + params, { headers: WD_HEADERS, signal: AbortSignal.timeout(4500) });
        if (!r.ok) throw new Error('wd');
        return r.json();
    }

    async function resolveEntity(q) {
        const text = String(q || '').trim();
        const nq = norm(text);
        if (!nq || nq.length < 2 || text.length > 60 || text.split(/\s+/).length > 5 || /[0-9]{3,}/.test(text)) return null;
        const hit = entityCache.get(nq);
        if (hit && hit.exp > Date.now()) return hit.v;
        let value = null;
        try {
            const lang = LANG_SCRIPT(text) || 'en';
            const found = await wdFetch('action=wbsearchentities&type=item&limit=6&language=' + lang + '&uselang=en&search=' + encodeURIComponent(text));
            const list = Array.isArray(found.search) ? found.search : [];
            const exact = list.find(e => {
                const label = norm(e.label || '');
                const alias = norm((e.match && e.match.text) || '');
                if (label === nq || alias === nq) return true;
                if (!isCJK(nq) && nq.length >= 6 && !nq.includes(' ') && (dist(nq, label, 1) <= 1 || dist(nq, alias, 1) <= 1)) return true;
                return false;
            });
            if (exact && (exact.description || '').length) {
                const info = await wdFetch('action=wbgetentities&props=labels|aliases&languages=en|ar|tr|fr|es|ru|zh&ids=' + exact.id);
                const ent = info.entities && info.entities[exact.id];
                const labels = ent && ent.labels ? Object.values(ent.labels).map(l => l.value) : [exact.label];
                const aliases = ent && ent.aliases ? [].concat(...Object.values(ent.aliases).map(a => a.map(x => x.value))) : [];
                const names = [...new Set([exact.label].concat(labels, aliases, [text]))].slice(0, 60);
                const kind = kindOf(exact.description);
                const ctx = [...new Set(String(exact.description).toLowerCase().replace(/[^a-z\s-]/g, ' ').split(/\s+/).filter(w => w.length >= 5 && !STOP.has(w) && !['which', 'since', 'their', 'between', 'known', 'former', 'current', 'country', 'american'].includes(w)))].slice(0, 6);
                value = { en: exact.label, keys: [...new Set(names.map(n => norm(n)).filter(Boolean))], vars: names.filter(n => n.length <= 60).slice(0, 14), ctx, person: kind === 'Leader' || kind === 'Person', kind, desc: exact.description };
            }
        } catch (e) {
            value = null;
        }
        if (entityCache.size > 600) entityCache.clear();
        entityCache.set(nq, { v: value, exp: Date.now() + (value ? 24 * 3600000 : 30 * 60000) });
        return value;
    }

    async function suggestAsync(q, uiLang) {
        const text = String(q || '').trim().slice(0, 60);
        const key = norm(text) + '|' + (LANG_SCRIPT(text) || 'x');
        const hit = suggestCache.get(key);
        if (hit && hit.exp > Date.now()) return hit.v;
        const out = [];
        const add = (item, front) => {
            if (out.length >= 8 || out.some(o => o.text.toLowerCase() === item.text.toLowerCase())) return;
            if (front) out.unshift(item);
            else out.push(item);
        };
        const nq = norm(text);
        if (!nq) {
            trending.slice(0, 8).forEach(t => add({ text: t, type: 'Trending', desc: '' }));
            return out;
        }
        const tasks = [];
        const lang = LANG_SCRIPT(text) || 'en';
        tasks.push(wdFetch('action=wbsearchentities&type=item&limit=7&language=' + lang + '&uselang=en&search=' + encodeURIComponent(text)).then(d => d.search || []).catch(() => []));
        if (lang !== 'en' || /[^\x00-\x7f]/.test(text)) tasks.push(Promise.resolve([]));
        const [entities] = await Promise.all(tasks);
        entities.forEach(e => {
            if (!e.label || !(e.description || '').length) return;
            add({ text: e.label, type: kindOf(e.description), desc: e.description.slice(0, 64) });
        });
        trending.forEach(t => {
            const n = norm(t);
            if (n.startsWith(nq) || n.split(' ').some(w => w.startsWith(nq))) add({ text: t, type: 'Trending', desc: '' });
        });
        if (out.length < 3 && nq.length >= 4 && !isCJK(nq) && !/[^\x00-\x7f]/.test(nq)) {
            const fix = correct(nq);
            if (fix && fix !== nq) add({ text: fix.charAt(0).toUpperCase() + fix.slice(1), type: 'Topic', desc: '' });
        }
        if (suggestCache.size > 400) suggestCache.clear();
        suggestCache.set(key, { v: out, exp: Date.now() + 10 * 60000 });
        return out;
    }

    const WEB_LOCALES = { en: ['en-US', 'US', 'en'], tr: ['tr-TR', 'TR', 'tr'], ar: ['ar-SA', 'SA', 'ar'], fr: ['fr-FR', 'FR', 'fr'], es: ['es-ES', 'ES', 'es'], ru: ['ru-RU', 'RU', 'ru'], zh: ['zh-CN', 'CN', 'zh-Hans'] };

    function xmlText(block, tag) {
        const m = block.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>', 'i'));
        if (!m) return '';
        return decodeEntities(m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')).trim();
    }

    function webItem(title, description, url, image, source, when, lang) {
        const t = stripHtml(title);
        const d = stripHtml(description || '');
        const ts = Number.isFinite(new Date(when).getTime()) ? new Date(when).getTime() : Date.now();
        if (!t || !url || ts > Date.now() + 3600000) return null;
        knownUrls.add(url);
        const item = {
            title: t,
            description: d,
            url,
            image: image && /^https?:\/\//.test(image) ? image : null,
            publishedAt: new Date(ts).toISOString(),
            ts,
            source: source || new URL(url).hostname.replace(/^www\./, ''),
            lang,
            _tl: tokensOf(t),
            _dl: tokensOf(d),
            _t: new Set(tokensOf(t)),
            _d: new Set(tokensOf(d)),
            _tn: norm(t),
            _dn: norm(d),
            web: true
        };
        return annotate(item);
    }

    async function bingNews(query, uiLang) {
        const [mkt, , setlang] = WEB_LOCALES[uiLang] || WEB_LOCALES.en;
        const r = await fetch('https://www.bing.com/news/search?q=' + encodeURIComponent(query) + '&format=rss&mkt=' + mkt + '&setlang=' + setlang, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36', 'Accept-Language': mkt }, signal: AbortSignal.timeout(6000) });
        if (!r.ok) return [];
        const xml = await r.text();
        const out = [];
        (xml.match(/<item>[\s\S]*?<\/item>/gi) || []).slice(0, 20).forEach(block => {
            const link = xmlText(block, 'link');
            let real = link;
            try {
                const u = new URL(link);
                real = u.searchParams.get('url') || link;
            } catch (e) { }
            const item = webItem(xmlText(block, 'title'), xmlText(block, 'description'), real, xmlText(block, 'News:Image'), xmlText(block, 'News:Source'), xmlText(block, 'pubDate'), uiLang);
            if (item) out.push(item);
        });
        return out;
    }

    async function googleNews(query, uiLang) {
        const [hl, gl, ceidLang] = WEB_LOCALES[uiLang] || WEB_LOCALES.en;
        const r = await fetch('https://news.google.com/rss/search?q=' + encodeURIComponent(query) + '&hl=' + hl + '&gl=' + gl + '&ceid=' + gl + ':' + ceidLang, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(6000) });
        if (!r.ok) return [];
        const xml = await r.text();
        const out = [];
        (xml.match(/<item>[\s\S]*?<\/item>/gi) || []).slice(0, 20).forEach(block => {
            const source = xmlText(block, 'source');
            let title = xmlText(block, 'title');
            if (source && title.endsWith(' - ' + source)) title = title.slice(0, -(source.length + 3));
            const item = webItem(title, '', xmlText(block, 'link'), null, source, xmlText(block, 'pubDate'), uiLang);
            if (item) out.push(item);
        });
        return out;
    }

    async function webNews(query, uiLang) {
        const q = String(query || '').trim().slice(0, 100);
        if (!q) return [];
        const key = q.toLowerCase() + '|' + uiLang;
        const hit = webCache.get(key);
        if (hit && hit.exp > Date.now()) return hit.v;
        let list = [];
        try {
            list = await bingNews(q, uiLang);
        } catch (e) { }
        if (list.length < 5) {
            try {
                list = list.concat(await googleNews(q, uiLang));
            } catch (e) { }
        }
        const seen = new Set();
        list = list.filter(it => {
            const k = it._tn.slice(0, 80);
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
        });
        if (webCache.size > 200) webCache.clear();
        webCache.set(key, { v: list, exp: Date.now() + (list.length ? 20 : 3) * 60000 });
        return list;
    }

    const GENERIC_WORDS = new Set(['after', 'about', 'their', 'would', 'could', 'people', 'government', 'president', 'minister', 'officials', 'police', 'killed', 'attack', 'attacks', 'country', 'report', 'reports', 'says', 'said', 'news', 'latest', 'world', 'years', 'since', 'first', 'second', 'amid', 'where', 'while', 'during', 'against', 'between', 'under', 'ahead', 'without', 'within', 'three', 'several', 'another', 'other', 'there', 'these', 'those', 'being', 'become', 'becomes', 'across', 'update', 'live', 'video', 'photos', 'watch', 'week', 'month', 'today', 'tonight', 'yesterday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'military', 'forces', 'troops', 'state', 'states', 'united', 'foreign', 'national', 'international', 'american', 'russian', 'israeli', 'iranian', 'ukrainian', 'chinese', 'european', 'british', 'french', 'german', 'trump', 'putin']);

    function developing(now) {
        const recent = [];
        const older = [];
        for (const it of corpus) {
            if (it.lang !== 'en') continue;
            const age = now - it.ts;
            if (age <= 12 * 3600000) recent.push(it);
            else if (age <= 60 * 3600000) older.push(it);
        }
        const termsOf = it => {
            const set = new Set();
            phrases(it.title).forEach(p => { if (p.split(' ').length >= 1 && !GENERIC_WORDS.has(p.toLowerCase())) set.add(p.toLowerCase()); });
            tokensOf(it.title).forEach(t => { if (t.length >= 6 && !STOP.has(t) && !GENERIC_WORDS.has(t) && /^[a-z]+$/.test(t)) set.add(t); });
            return set;
        };
        const recentMap = new Map();
        recent.forEach(it => termsOf(it).forEach(t => {
            if (!recentMap.has(t)) recentMap.set(t, { sources: new Set(), items: [] });
            const e = recentMap.get(t);
            e.sources.add(it.source);
            e.items.push(it);
        }));
        const baseMap = new Map();
        older.forEach(it => termsOf(it).forEach(t => {
            if (!baseMap.has(t)) baseMap.set(t, new Set());
            baseMap.get(t).add(it.source);
        }));
        const candidates = [];
        recentMap.forEach((e, t) => {
            const sources = e.sources.size;
            if (sources < 7 || e.items.length < 8) return;
            const base = (baseMap.get(t) ? baseMap.get(t).size : 0) / 4;
            const burst = sources / (base + 1);
            if (burst >= 2.2) candidates.push({ term: t, sources, burst, items: e.items });
        });
        candidates.sort((a, b) => b.burst * b.sources - a.burst * a.sources);
        const chosen = [];
        for (const c of candidates) {
            const urls = new Set(c.items.map(i => i.url));
            const overlap = chosen.some(x => {
                let shared = 0;
                x.items.forEach(i => { if (urls.has(i.url)) shared++; });
                return shared / Math.min(urls.size, x.items.length) >= 0.5;
            });
            if (!overlap) chosen.push(c);
            if (chosen.length >= 3) break;
        }
        const out = [];
        const capital = w => w.replace(/\b[a-z]/g, m => m.toUpperCase());
        chosen.forEach(c => {
            const counts = new Map();
            c.items.forEach(it => new Set(phrases(it.title)).forEach(p => {
                const low = p.toLowerCase();
                if (low === c.term || c.term.includes(low) || low.includes(c.term) || GENERIC_WORDS.has(low)) return;
                counts.set(p, (counts.get(p) || 0) + 1);
            }));
            const co = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
            const isEntity = c.items.some(it => phrases(it.title).some(p => p.toLowerCase() === c.term));
            const title = isEntity ? capital(c.term) : (co && co[1] >= 2 ? co[0] + ' ' + capital(c.term) : capital(c.term));
            const id = 'dev-' + c.term.replace(/[^a-z0-9]+/g, '-');
            devState.set(id, { title, term: c.term, at: now, query: (co && co[1] >= 2 && !isEntity ? co[0] + ' ' : '') + c.term });
            out.push(id);
        });
        const keep = [];
        devState.forEach((st, id) => {
            if (out.includes(id)) keep.push(id);
            else if (now - st.at < 3 * 3600000 && keep.length + out.length < 3) keep.push(id);
            else if (now - st.at >= 3 * 3600000) devState.delete(id);
        });
        const cards = [];
        keep.slice(0, 3).forEach(id => {
            const st = devState.get(id);
            const list = corpus.filter(it => now - it.ts <= 72 * 3600000 && it._tn.includes(st.term)).sort((a, b) => b.ts - a.ts);
            if (!list.length) return;
            const day = list.filter(it => now - it.ts <= 24 * 3600000);
            const lead = list[0];
            const h = (now - lead.ts) / 3600000;
            cards.push({ id, title: st.title, query: st.query, lead: pub(lead), more: list.slice(1, 3).map(pub), tag: h < 1.5 ? 'breaking' : h < 8 ? 'new' : 'latest', count24h: day.length, sources24h: new Set(day.map(it => it.source)).size });
        });
        return cards;
    }

    async function ogImage(u) {
        if (!u || !knownUrls.has(u)) return null;
        const hit = ogCache.get(u);
        if (hit && hit.exp > Date.now()) return hit.v;
        let v = null;
        try {
            const r = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 VEROBot/1.0', Accept: 'text/html,application/xhtml+xml', 'Accept-Language': 'en-US,en;q=0.9' }, redirect: 'follow', signal: AbortSignal.timeout(6500) });
            if (r.ok) {
                const html = (await r.text()).slice(0, 400000);
                const metas = html.match(/<meta\s[^>]*>/gi) || [];
                let best = null;
                for (const m of metas) {
                    const key = (m.match(/(?:property|name)=["']([^"']+)["']/i) || [])[1];
                    if (!key || !/^(og:image(:secure_url)?|twitter:image(:src)?)$/i.test(key)) continue;
                    const content = (m.match(/content=["']([^"']+)["']/i) || [])[1];
                    if (!content) continue;
                    try {
                        const abs = new URL(decodeEntities(content), r.url || u).href;
                        if (/^https?:\/\//.test(abs) && !/logo|favicon|placeholder|default[-_]|sprite|blank|1x1|share[-_]?(image|img)|social[-_]|og[-_]?(default|image)\\.|brand|fallback|generic/i.test(abs)) {
                            if (/^og:image/i.test(key)) { best = abs; break; }
                            if (!best) best = abs;
                        }
                    } catch (e) { }
                }
                v = best ? upgradeImage(best) : null;
            }
        } catch (e) { }
        if (v) {
            const uses = (ogUses.get(v) || 0) + 1;
            ogUses.set(v, uses);
            if (ogUses.size > 4000) ogUses.clear();
            if (uses >= 3) v = null;
        }
        if (ogCache.size > 1500) ogCache.clear();
        ogCache.set(u, { v, exp: Date.now() + (v ? 24 * 3600000 : 20 * 60000) });
        if (v) allowImage(v);
        return v;
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

    async function expand(q, client) {
        const found = { exact: await resolveEntity(q), partial: null };
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
        return { english, detected, ok, variants, concept: !!found.exact, conceptObj: found.exact || null };
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

    async function gnews(english, from, key, phrase) {
        const tokens = tokensOf(english).filter(t => t.length >= 3 && !STOP.has(t) && !/[^\x00-\x7f]/.test(t)).slice(0, 6);
        if (!tokens.length || !key) return [];
        const query = phrase ? '"' + phrase + '"' : tokens.join(' OR ');
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
                    knownUrls.add(a.url);
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
        if (script) return script;
        const words = q.trim().split(/\s+/).length;
        const changed = english.trim().toLowerCase() !== q.trim().toLowerCase();
        const latinUi = !['ar', 'ru', 'zh'].includes(ui);
        if (detected && detected !== 'en' && (words >= 2 || changed)) return detected;
        if (detected === 'en' && words >= 2) return 'en';
        return latinUi ? ui : 'en';
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
        let focusInfo = null;
        let broadened = false;

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
            if (ex.conceptObj) {
                const c = ex.conceptObj;
                const aliases = [...new Set([c.en, ...c.vars, ...c.keys].map(norm).filter(a => a.length >= 3))];
                const ctx = c.ctx || [];
                const from0 = cutoffHours ? new Date(Math.floor((now - cutoffHours * 3600000) / 3600000) * 3600000).toISOString() : null;
                const extra0 = await gnews(c.en, from0, process.env.GNEWS_API_KEY, c.en);
                const pool0 = dedupe(corpus.concat(extra0)).filter(it => it.ts >= cutoff && catOk(it));
                const wb = (text, a) => !!text && (' ' + text + ' ').includes(' ' + a + ' ');
                const rows = pool0.map(it => {
                    let t = 0;
                    let d = 0;
                    let cx = 0;
                    for (const a of aliases) {
                        if (isCJK(a)) {
                            if (it._tn.includes(a)) t++;
                            if (it._dn.includes(a)) d++;
                        } else {
                            if (wb(it._tn, a)) t++;
                            if (wb(it._dn, a)) d++;
                        }
                    }
                    for (const k of ctx) if (wb(it._tn, k) || wb(it._dn, k)) cx++;
                    return { it, t, d, cx };
                });
                let tier = 'exact';
                let picked = rows.filter(r => r.t > 0);
                if (picked.length < 6) {
                    tier = 'broad';
                    picked = rows.filter(r => r.t > 0 || r.d >= 2 || (r.d >= 1 && r.cx >= 1));
                }
                if (picked.length < 6) {
                    tier = 'related';
                    picked = rows.filter(r => r.t > 0 || r.d >= 1 || r.cx >= 2);
                }
                focusInfo = { name: c.en, tier, person: !!c.person };
                picked.forEach(r => {
                    const score = r.t * 10 + r.d * 3 + Math.min(r.cx, 3) * 1.5 + recency(r.it) + catBoost(r.it) + (r.it.lang === uiLang ? 1.5 : 0) + (r.it.image ? 0.3 : 0);
                    results.push({ it: r.it, score });
                });
            }
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
            if (!focusInfo) {
                const key = process.env.GNEWS_API_KEY;
                const from = cutoffHours ? new Date(Math.floor((now - cutoffHours * 3600000) / 3600000) * 3600000).toISOString() : null;
                const extra = await gnews(english, from, key);
                const pool = dedupe(corpus.concat(extra));
                const collect = need => {
                    const found = [];
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
                        found.push({ it, score });
                    });
                    return found;
                };
                const strictNeed = groups.length >= 2 ? groups.length : 0;
                results = collect(strictNeed);
                if (strictNeed && results.length < 6) {
                    broadened = true;
                    results = collect(Math.max(1, Math.ceil(groups.length / 2)));
                }
            }
        }

        if (q) {
            const webQ = focusInfo ? focusInfo.name : english;
            if (webQ && results.length < 18) {
                const editions = [webQ];
                let web = await webNews(webQ, uiLang).catch(() => []);
                if (uiLang !== 'en' && !web.length) web = await webNews(webQ, 'en').catch(() => []);
                const seenTitles = new Set(results.map(r => r.it._tn.slice(0, 80)));
                const want = tokensOf(editions[0]).filter(t => t.length >= 3 && !STOP.has(t));
                let added = 0;
                web.forEach(it => {
                    if (it.ts < cutoff || !catOk(it)) return;
                    const key = it._tn.slice(0, 80);
                    if (seenTitles.has(key)) return;
                    const hay = it._tn + ' ' + it._dn;
                    const matched = want.filter(t => hay.includes(t)).length;
                    if (want.length && !matched) return;
                    seenTitles.add(key);
                    results.push({ it, score: 1.5 + matched * 1.5 + recency(it) + (it.image ? 0.3 : 0) });
                    added++;
                });
                if (focusInfo && added && results.length - added < 3) focusInfo = { ...focusInfo, tier: 'web' };
                if (!focusInfo && added && results.length === added) broadened = false;
            }
        }

        results.sort((a, b) => b.score - a.score || b.it.ts - a.it.ts);
        const total = results.length;
        const totalPages = Math.max(1, Math.ceil(total / size));
        const page = Math.min(Math.max(opts.page, 1), totalPages);
        const articles = results.slice((page - 1) * size, page * size).map(r => (allowImage(r.it.image), {
            title: r.it.title,
            description: r.it.description,
            url: r.it.url,
            image: r.it.image,
            publishedAt: r.it.publishedAt,
            source: r.it.source,
            lang: r.it.lang,
            cat: r.it._cat,
            web: !!r.it.web
        }));
        const exclude = q ? tokensOf(english).concat(tokensOf(q)).concat(focusInfo ? [focusInfo.name] : []) : [];
        const related = q ? relatedFor(results, exclude) : [];
        return { articles, page, totalPages, total, lang: uiLang, queryEnglish: english, needsExpansion, focus: focusInfo, broadened, related };
    }

    function pub(it) {
        allowImage(it.image);
        return { title: it.title, description: it.description, url: it.url, image: it.image, publishedAt: it.publishedAt, source: it.source, lang: it.lang, web: !!it.web };
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
        theaterCache = { at: now, data: { theaters: out, developing: developing(now), updatedAt: lastRefresh ? new Date(lastRefresh).toISOString() : null } };
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

    return { search, suggest: suggestAsync, og: ogImage, feedHealth, warm, theaters: theatersLive, imageAllowed: u => imageSet.has(u) };
};
