// Glossary Page JavaScript with Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    initGlossary();
});

// Glossary data - comprehensive collection of Kagai terms
const GLOSSARY_DATA = [
    {
        term: '芸者',
        reading: 'げいしゃ',
        category: 'person',
        description: '日本の伝統芸能を身につけ、お客様をおもてなしするプロフェッショナルな女性。長年の修練を積み、日本舞踊、三味線、茶道などの様々な芸事に精通している。',
        examples: '「芸者さんの美しい舞踊に感動しました」「一流の芸者さんは話術にも長けています」',
        related: ['舞妓', 'お茶屋', '花街', 'お座敷']
    },
    {
        term: '舞妓',
        reading: 'まいこ',
        category: 'person',
        description: '京都特有の呼び方で、芸者になるための修行中の女性を指す。華やかな着物と独特の髪型、化粧が特徴で、通常15歳から20歳頃まで舞妓として活動する。',
        examples: '「舞妓さんの艶やかな着物姿が印象的でした」「舞妓時代の厳しい修行を経て一人前の芸者になります」',
        related: ['芸者', '花街', 'だらり帯', 'つまみ簪']
    },
    {
        term: 'お茶屋',
        reading: 'おちゃや',
        category: 'place',
        description: '芸者さんとの宴席を楽しむ伝統的な料亭。「一見さんお断り」という制度があり、通常は紹介が必要。格式の高い建物と上質なおもてなしが特徴。',
        examples: '「老舗のお茶屋で本格的なお座敷遊びを体験しました」「お茶屋の女将さんが温かく迎えてくださいました」',
        related: ['花街', '芸者', 'お座敷', '女将']
    },
    {
        term: '花街',
        reading: 'かがい・はなまち',
        category: 'place',
        description: '芸者や舞妓が在籍し、お茶屋が集まった地域。京都の祇園、先斗町、宮川町、上七軒、東京の新橋、神楽坂、浅草などが有名。日本の伝統文化が色濃く残る特別な街。',
        examples: '「京都の花街を散策して伝統の美しさに触れました」「花街には独特の情緒と格式があります」',
        related: ['芸者', 'お茶屋', '置屋', '祇園']
    },
    {
        term: 'お座敷',
        reading: 'おざしき',
        category: 'place',
        description: '芸者さんとの宴席が行われる和室。畳敷きの部屋で、お客様と芸者さんが食事や芸事鑑賞、遊戯を楽しむ空間。日本の「おもてなし」文化の象徴的な場所。',
        examples: '「お座敷での芸者さんの三味線演奏は素晴らしかったです」「お座敷遊びで日本文化の奥深さを学びました」',
        related: ['芸者', 'お茶屋', 'お座敷遊び', '宴席']
    },
    {
        term: 'お座敷遊び',
        reading: 'おざしきあそび',
        category: 'event',
        description: '芸者さんやお客様同士のコミュニケーションを楽しむ伝統的な遊び。「とらとら」「金毘羅船船」「投扇興」などがある。言葉の壁を越えて楽しめる日本独特の娯楽。',
        examples: '「とらとらで芸者さんと勝負して盛り上がりました」「お座敷遊びは日本の粋な文化です」',
        related: ['お座敷', '芸者', 'とらとら', '投扇興']
    },
    {
        term: '置屋',
        reading: 'おきや',
        category: 'place',
        description: '芸者や舞妓が所属する事務所のような場所。芸者の住まいであり、修行の場でもある。お茶屋からの依頼に応じて芸者を派遣する役割も担う。',
        examples: '「置屋のお母さんが芸者さんたちを温かく見守っています」「置屋では厳しい芸事の稽古が行われます」',
        related: ['芸者', '舞妓', 'お茶屋', '女将']
    },
    {
        term: '女将',
        reading: 'おかみ',
        category: 'person',
        description: 'お茶屋や置屋を経営・管理する女性。豊富な経験と人脈を持ち、芸者の育成やお客様との関係構築に重要な役割を果たす。花街の伝統を支える存在。',
        examples: '「女将さんの心配りでとても居心地の良い時間を過ごせました」「ベテランの女将さんから花街の歴史を教えていただきました」',
        related: ['お茶屋', '置屋', '芸者', '花街']
    },
    {
        term: '三味線',
        reading: 'しゃみせん',
        category: 'tool',
        description: '3本の弦を持つ日本の伝統的な弦楽器。花街では芸者の重要な芸事の一つ。長唄、清元、常磐津など様々な音楽ジャンルで使用される。',
        examples: '「芸者さんの三味線の音色に心が癒されました」「三味線の撥さばきが見事でした」',
        related: ['芸者', '日本舞踊', '長唄', '撥']
    },
    {
        term: '日本舞踊',
        reading: 'にほんぶよう',
        category: 'art',
        description: '日本の伝統的な舞踊芸術。扇子や手ぬぐいを使い、季節や情景、物語を優美に表現する。花柳流、藤間流、若柳流など多数の流派がある。',
        examples: '「芸者さんの日本舞踊で四季の美しさを表現していただきました」「舞踊の型一つ一つに深い意味が込められています」',
        related: ['芸者', '扇子', '三味線', '着物']
    },
    {
        term: '長唄',
        reading: 'ながうた',
        category: 'art',
        description: '三味線音楽の一ジャンル。歌舞伎の伴奏音楽として発達し、花街でも重要な芸事の一つ。力強く劇的な表現が特徴で、日本舞踊の伴奏としても用いられる。',
        examples: '「長唄の勇壮な調べに合わせた舞踊が印象的でした」「芸者さんの長唄の歌声が美しく響きました」',
        related: ['三味線', '日本舞踊', '歌舞伎', '芸者']
    },
    {
        term: '着物',
        reading: 'きもの',
        category: 'costume',
        description: '日本の伝統的な衣服。花街では季節に応じた美しい着物が着用される。格や場面に応じて留袖、訪問着、小紋など様々な種類がある。',
        examples: '「芸者さんの季節感あふれる着物が素晴らしかったです」「着物の柄一つ一つに意味があることを知りました」',
        related: ['帯', '草履', '芸者', '舞妓']
    },
    {
        term: '帯',
        reading: 'おび',
        category: 'costume',
        description: '着物を着る際に腰に巻く幅広の布。丸帯、袋帯、名古屋帯など種類があり、結び方も多様。芸者の帯は特に豪華で芸術的な価値が高い。',
        examples: '「芸者さんの帯の結び方がとても美しかったです」「金糸を使った豪華な帯に目を奪われました」',
        related: ['着物', '芸者', 'だらり帯', '帯締め']
    },
    {
        term: 'だらり帯',
        reading: 'だらりおび',
        category: 'costume',
        description: '舞妓が着用する特徴的な帯。長い帯の端が足元まで垂れ下がっている。京都の舞妓の象徴的な装いで、一人前の芸者になると締めなくなる。',
        examples: '「舞妓さんのだらり帯が歩くたびに美しく揺れていました」「だらり帯は舞妓の若々しさの象徴です」',
        related: ['舞妓', '帯', '着物', '京都']
    },
    {
        term: '簪',
        reading: 'かんざし',
        category: 'costume',
        description: '髪に挿す装飾具。芸者や舞妓の髪飾りとして重要な役割を持つ。季節に応じて桜、菊、梅など様々なデザインがあり、格調高い美しさを演出する。',
        examples: '「舞妓さんの桜の簪が春の訪れを感じさせました」「べっ甲の簪が上品な印象を与えていました」',
        related: ['髪型', '舞妓', '芸者', '季節感']
    },
    {
        term: '髪型',
        reading: 'かみがた',
        category: 'costume',
        description: '芸者や舞妓の伝統的なヘアスタイル。舞妓は「われしのぶ」「おふく」など年齢に応じた髪型がある。芸者は「つぶし島田」などを結う。',
        examples: '「舞妓さんの髪型の美しさに見とれました」「伝統的な髪型には長い歴史と技術が込められています」',
        related: ['簪', '舞妓', '芸者', '島田髷']
    },
    {
        term: '化粧',
        reading: 'けしょう',
        category: 'costume',
        description: '芸者や舞妓の伝統的な白粉化粧。白い肌に赤い口紅、目元の化粧で日本古来の美意識を表現。舞妓の方がより華やかで、芸者は上品で洗練された化粧。',
        examples: '「舞妓さんの白粉化粧の美しさに息を呑みました」「芸者さんの上品な化粧に品格を感じました」',
        related: ['舞妓', '芸者', '白粉', '紅']
    },
    {
        term: '白粉',
        reading: 'おしろい',
        category: 'costume',
        description: '顔や首筋に塗る白い化粧料。芸者や舞妓の化粧に欠かせない。美しい白さで肌を覆い、日本古来の美の基準を表現する重要な化粧品。',
        examples: '「白粉の美しい白さが印象的でした」「丁寧に塗られた白粉が芸者さんの品格を高めています」',
        related: ['化粧', '芸者', '舞妓', '紅']
    },
    {
        term: '扇子',
        reading: 'せんす',
        category: 'tool',
        description: '日本舞踊で使用される小道具。開閉することで様々な表現が可能。花、月、酒杯、刀など多様なものを表現し、舞踊に華を添える重要な道具。',
        examples: '「芸者さんの扇子を使った舞踊が優雅でした」「扇子一つで様々な情景を表現する技術に感動しました」',
        related: ['日本舞踊', '芸者', '舞踊', '小道具']
    },
    {
        term: '茶道',
        reading: 'さどう・ちゃどう',
        category: 'art',
        description: '日本の伝統的な茶の湯の作法。芸者の重要な芸事の一つ。お客様をもてなす心と美しい所作を学ぶ。わび・さび・和・敬・清・寂の精神を重んじる。',
        examples: '「芸者さんのお茶の点て方に心の静寂を感じました」「茶道の精神性の深さを教えていただきました」',
        related: ['芸者', '茶碗', '茶筅', 'おもてなし']
    },
    {
        term: '華道',
        reading: 'かどう',
        category: 'art',
        description: '花を生ける日本の伝統芸術。季節の花材を使い、自然の美しさと調和を表現する。芸者も華道を学び、お座敷に季節感を演出する技術を身につける。',
        examples: '「芸者さんが生けたお花で部屋が華やかになりました」「華道の精神性と美意識を学ばせていただきました」',
        related: ['芸者', '季節感', '花材', '生け花']
    },
    {
        term: 'とらとら',
        reading: 'とらとら',
        category: 'event',
        description: '代表的なお座敷遊びの一つ。じゃんけんに似たゲームで、虎・和藤内・おばあさんの3つのポーズで勝負する。言葉が分からなくても楽しめる遊び。',
        examples: '「とらとらで芸者さんと楽しい勝負をしました」「外国の方もとらとらで盛り上がっていました」',
        related: ['お座敷遊び', '芸者', 'お座敷', '遊戯']
    },
    {
        term: '投扇興',
        reading: 'とうせんきょう',
        category: 'event',
        description: '扇子を投げて的を倒すお座敷遊び。江戸時代から続く雅な遊戯で、扇子の投げ方や的の倒れ方に名前が付けられている。技術と運の両方が必要な奥深いゲーム。',
        examples: '「投扇興の優雅さと奥深さに感動しました」「的を見事に倒せた時の爽快感は格別でした」',
        related: ['お座敷遊び', '扇子', 'お座敷', '雅遊']
    },
    {
        term: '一見さん',
        reading: 'いちげんさん',
        category: 'manner',
        description: '初めて訪れるお客様のこと。多くのお茶屋では「一見さんお断り」の制度があり、常連客や信頼できる人からの紹介が必要。伝統と格式を守るための慣習。',
        examples: '「一見さんお断りの制度に花街の格式を感じました」「紹介していただいて初めてお茶屋に伺うことができました」',
        related: ['お茶屋', '花街', '紹介制度', 'おもてなし']
    },
    {
        term: '花代',
        reading: 'はなだい',
        category: 'manner',
        description: '芸者さんへの謝礼のこと。芸者さんの時間や芸に対する対価として支払われる。金額は格や時間によって決まり、花街の伝統的な料金システム。',
        examples: '「花代は芸者さんの芸への敬意を表すものです」「適切な花代をお支払いすることが大切です」',
        related: ['芸者', 'お茶屋', '謝礼', 'マナー']
    },
    {
        term: '心付け',
        reading: 'こころづけ',
        category: 'manner',
        description: '特別なサービスや心遣いに対する感謝の気持ちを込めた謝礼。必須ではないが、特に良いおもてなしを受けた場合に渡すことがある日本の習慣。',
        examples: '「素晴らしいおもてなしに心付けをお渡ししました」「心付けは感謝の気持ちの表現です」',
        related: ['おもてなし', '謝礼', 'マナー', '感謝']
    },
    {
        term: '贔屓',
        reading: 'ひいき',
        category: 'manner',
        description: '特定の芸者さんを応援し、定期的にお座敷に呼ぶお客様のこと。芸者さんにとって重要な支援者であり、花街の文化を支える存在。',
        examples: '「贔屓のお客様に支えられて芸者さんは成長します」「長年の贔屓筋との関係は花街の宝です」',
        related: ['芸者', 'お客様', '支援', '花街']
    },
    {
        term: 'お見世出し',
        reading: 'おみせだし',
        category: 'event',
        description: '新人の舞妓や芸者が正式にデビューすること。お客様や関係者に披露される重要な儀式。花街にとって新しい才能の紹介となる特別な日。',
        examples: '「お見世出しの舞妓さんの初々しさが印象的でした」「お見世出しは花街の新しい希望です」',
        related: ['舞妓', '芸者', 'デビュー', '花街']
    },
    {
        term: '衿替え',
        reading: 'えりかえ',
        category: 'event',
        description: '舞妓が芸者になる際の儀式。赤い衿から白い衿に変わることから呼ばれる。舞妓時代の終わりと一人前の芸者としての始まりを意味する重要な節目。',
        examples: '「衿替えの儀式で舞妓さんが芸者さんになられました」「衿替えは花街の美しい伝統です」',
        related: ['舞妓', '芸者', '成長', '儀式']
    },
    {
        term: '稽古',
        reading: 'けいこ',
        category: 'art',
        description: '芸事の練習や修行のこと。芸者や舞妓は日々様々な芸事の稽古を続け、技術と精神性を磨いている。一生涯続く学びの過程。',
        examples: '「毎日の厳しい稽古が美しい芸を生み出します」「稽古に励む舞妓さんの姿勢に感銘を受けました」',
        related: ['芸者', '舞妓', '芸事', '修行']
    },
    {
        term: '師匠',
        reading: 'ししょう',
        category: 'person',
        description: '芸事を教える先生のこと。日本舞踊、三味線、茶道などそれぞれに師匠がいて、芸者や舞妓の技術向上を指導する。花街文化の継承者。',
        examples: '「師匠から厳しく指導を受けて技術が向上しました」「師匠の教えが芸者さんの基礎を作ります」',
        related: ['稽古', '芸事', '指導', '伝承']
    },
    {
        term: '見番',
        reading: 'けんばん',
        category: 'place',
        description: '花街の芸者や舞妓を統括する組合事務所。スケジュール管理、料金設定、教育などを行う。花街の秩序と伝統を維持する重要な組織。',
        examples: '「見番で芸者さんのスケジュールが管理されています」「見番は花街の運営の要です」',
        related: ['花街', '芸者', '舞妓', '組合']
    },
    {
        term: '祇園',
        reading: 'ぎおん',
        category: 'place',
        description: '京都で最も有名な花街の一つ。祇園甲部と祇園東に分かれる。古い町並みと伝統的な茶屋が立ち並び、多くの観光客が訪れる日本文化の象徴的な場所。',
        examples: '「祇園の石畳を歩いて古い京都の情緒を味わいました」「祇園は日本の花街文化の代表格です」',
        related: ['花街', '京都', 'お茶屋', '伝統']
    },
    {
        term: '先斗町',
        reading: 'ぽんとちょう',
        category: 'place',
        description: '京都の花街の一つ。鴨川と木屋町通りに挟まれた細い路地に茶屋が軒を連ねる。「川床」で有名で、夏には涼しい川の上での宴席が楽しめる。',
        examples: '「先斗町の川床で涼しい夏の夜を過ごしました」「狭い路地に情緒ある茶屋が並んでいます」',
        related: ['花街', '京都', '川床', 'お茶屋']
    },
    {
        term: '新橋',
        reading: 'しんばし',
        category: 'place',
        description: '東京を代表する花街の一つ。明治時代から続く伝統があり、政財界の要人なども訪れる格式高い花街。江戸の粋な文化を今に伝える。',
        examples: '「新橋の花街で江戸の粋を感じました」「新橋は東京の花街文化の中心地です」',
        related: ['花街', '東京', '芸者', '江戸文化']
    },
    {
        term: '神楽坂',
        reading: 'かぐらざか',
        category: 'place',
        description: '東京の花街の一つ。坂道と路地が織りなす情緒ある街並み。フランス料理店なども多く、国際的な雰囲気と伝統が調和した独特の魅力がある。',
        examples: '「神楽坂の坂道を歩いて東京の隠れた魅力を発見しました」「伝統と国際性が融合した神楽坂の文化」',
        related: ['花街', '東京', '坂道', '国際的']
    }
];

// Category labels for display
const CATEGORY_LABELS = {
    'person': '人・役職',
    'place': '場所・建物',
    'art': '芸事・技芸',
    'costume': '衣装・装身具',
    'event': '行事・イベント',
    'tool': '道具・用具',
    'manner': 'マナー・作法',
    'other': 'その他'
};

// Global variables
let filteredTerms = [...GLOSSARY_DATA];
let displayedTerms = [];
let currentPage = 0;
const ITEMS_PER_PAGE = 20;

// Main initialization function
function initGlossary() {
    initSearchFunctionality();
    initFilterFunctionality();
    initAlphabetNavigation();
    initModalFunctionality();
    initFeaturedTerms();
    initAccessibilityFeatures();
    
    // Initial display
    displayTerms();
    updateResultCount();
}

// Search functionality
function initSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton');
    
    // Real-time search
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });
    
    // Search button click
    searchButton.addEventListener('click', handleSearch);
    
    // Clear button
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        clearButton.style.display = 'none';
        filteredTerms = [...GLOSSARY_DATA];
        resetFiltersAndDisplay();
    });
    
    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query === '') {
            filteredTerms = [...GLOSSARY_DATA];
            clearButton.style.display = 'none';
        } else {
            filteredTerms = GLOSSARY_DATA.filter(term => 
                term.term.toLowerCase().includes(query) ||
                term.reading.toLowerCase().includes(query) ||
                term.description.toLowerCase().includes(query) ||
                term.examples.toLowerCase().includes(query) ||
                term.related.some(related => related.toLowerCase().includes(query))
            );
            clearButton.style.display = 'block';
        }
        
        resetFiltersAndDisplay();
        announceSearchResults(filteredTerms.length);
    }
}

// Filter functionality
function initFilterFunctionality() {
    const categorySelect = document.getElementById('categorySelect');
    const sortSelect = document.getElementById('sortSelect');
    
    categorySelect.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
    
    function applyFilters() {
        const category = categorySelect.value;
        const sortBy = sortSelect.value;
        
        // Apply category filter
        let filtered = [...filteredTerms];
        if (category) {
            filtered = filtered.filter(term => term.category === category);
        }
        
        // Apply sorting
        switch (sortBy) {
            case 'alphabetical':
                filtered.sort((a, b) => a.reading.localeCompare(b.reading, 'ja'));
                break;
            case 'category':
                filtered.sort((a, b) => a.category.localeCompare(b.category) || a.reading.localeCompare(b.reading, 'ja'));
                break;
            case 'length':
                filtered.sort((a, b) => a.term.length - b.term.length || a.reading.localeCompare(b.reading, 'ja'));
                break;
        }
        
        displayedTerms = filtered;
        currentPage = 0;
        displayTerms();
        updateResultCount();
    }
}

// Alphabet navigation
function initAlphabetNavigation() {
    const alphabetButtons = document.querySelectorAll('.alphabet-btn');
    
    alphabetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const letter = this.dataset.letter;
            
            // Update active button
            alphabetButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter terms
            if (letter === 'all') {
                displayedTerms = [...filteredTerms];
            } else {
                displayedTerms = filteredTerms.filter(term => {
                    const firstChar = term.reading.charAt(0);
                    return getHiraganaGroup(firstChar) === letter;
                });
            }
            
            currentPage = 0;
            displayTerms();
            updateResultCount();
            
            // Announce filter change
            announceFilterChange(letter);
        });
    });
}

// Get hiragana group for alphabet navigation
function getHiraganaGroup(char) {
    const groups = {
        'あ': ['あ', 'い', 'う', 'え', 'お'],
        'か': ['か', 'が', 'き', 'ぎ', 'く', 'ぐ', 'け', 'げ', 'こ', 'ご'],
        'さ': ['さ', 'ざ', 'し', 'じ', 'す', 'ず', 'せ', 'ぜ', 'そ', 'ぞ'],
        'た': ['た', 'だ', 'ち', 'ぢ', 'つ', 'づ', 'て', 'で', 'と', 'ど'],
        'な': ['な', 'に', 'ぬ', 'ね', 'の'],
        'は': ['は', 'ば', 'ぱ', 'ひ', 'び', 'ぴ', 'ふ', 'ぶ', 'ぷ', 'へ', 'べ', 'ぺ', 'ほ', 'ぼ', 'ぽ'],
        'ま': ['ま', 'み', 'む', 'め', 'も'],
        'や': ['や', 'ゆ', 'よ'],
        'ら': ['ら', 'り', 'る', 'れ', 'ろ'],
        'わ': ['わ', 'ゐ', 'ゑ', 'を', 'ん']
    };
    
    for (const [group, chars] of Object.entries(groups)) {
        if (chars.includes(char)) {
            return group;
        }
    }
    return 'あ'; // Default fallback
}

// Display terms
function displayTerms() {
    const container = document.getElementById('termsContainer');
    const noResults = document.getElementById('noResults');
    const loadMoreContainer = document.querySelector('.load-more-container');
    
    // Apply current filters and sorting
    applyCurrentFilters();
    
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, displayedTerms.length);
    const termsToShow = displayedTerms.slice(0, endIndex);
    
    if (displayedTerms.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'block';
        loadMoreContainer.style.display = 'none';
        return;
    }
    
    container.style.display = 'grid';
    noResults.style.display = 'none';
    
    // Clear container if starting fresh
    if (currentPage === 0) {
        container.innerHTML = '';
    }
    
    // Add new terms
    const newTerms = displayedTerms.slice(startIndex, endIndex);
    newTerms.forEach((term, index) => {
        const termCard = createTermCard(term, startIndex + index);
        container.appendChild(termCard);
        
        // Animate card appearance
        setTimeout(() => {
            termCard.style.opacity = '1';
            termCard.style.transform = 'translateY(0)';
        }, index * 50);
    });
    
    // Update load more button
    const remaining = displayedTerms.length - endIndex;
    if (remaining > 0) {
        loadMoreContainer.style.display = 'block';
        document.getElementById('remainingCount').textContent = remaining;
        
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        loadMoreBtn.onclick = function() {
            currentPage++;
            displayTerms();
        };
    } else {
        loadMoreContainer.style.display = 'none';
    }
}

// Apply current filters and sorting
function applyCurrentFilters() {
    const categorySelect = document.getElementById('categorySelect');
    const sortSelect = document.getElementById('sortSelect');
    
    const category = categorySelect.value;
    const sortBy = sortSelect.value;
    
    // Start with filtered terms from search
    let filtered = [...filteredTerms];
    
    // Apply category filter
    if (category) {
        filtered = filtered.filter(term => term.category === category);
    }
    
    // Apply alphabet filter
    const activeAlphabetBtn = document.querySelector('.alphabet-btn.active');
    if (activeAlphabetBtn && activeAlphabetBtn.dataset.letter !== 'all') {
        const letter = activeAlphabetBtn.dataset.letter;
        filtered = filtered.filter(term => {
            const firstChar = term.reading.charAt(0);
            return getHiraganaGroup(firstChar) === letter;
        });
    }
    
    // Apply sorting
    switch (sortBy) {
        case 'alphabetical':
            filtered.sort((a, b) => a.reading.localeCompare(b.reading, 'ja'));
            break;
        case 'category':
            filtered.sort((a, b) => a.category.localeCompare(b.category) || a.reading.localeCompare(b.reading, 'ja'));
            break;
        case 'length':
            filtered.sort((a, b) => a.term.length - b.term.length || a.reading.localeCompare(b.reading, 'ja'));
            break;
    }
    
    displayedTerms = filtered;
}

// Create term card element
function createTermCard(term, index) {
    const card = document.createElement('div');
    card.className = 'term-card';
    card.setAttribute('data-category', term.category);
    card.setAttribute('data-term', term.term);
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    
    card.innerHTML = `
        <div class="term-header">
            <div>
                <h3 class="term-name">${term.term}</h3>
                <span class="term-reading">(${term.reading})</span>
            </div>
            <span class="term-category">${CATEGORY_LABELS[term.category]}</span>
        </div>
        <p class="term-description">${term.description}</p>
        <div class="term-footer">
            <span class="term-examples">${term.examples.substring(0, 50)}...</span>
            <button class="view-detail-btn" data-term="${term.term}">詳しく見る</button>
        </div>
    `;
    
    // Add click event for modal
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('view-detail-btn')) {
            showTermModal(term);
        }
    });
    
    // Add keyboard support
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showTermModal(term);
        }
    });
    
    return card;
}

// Modal functionality
function initModalFunctionality() {
    const modal = document.getElementById('termModal');
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');
    const shareBtn = document.getElementById('shareTermBtn');
    
    // Close modal events
    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    shareBtn.addEventListener('click', shareCurrentTerm);
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // View detail button events (event delegation)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-detail-btn')) {
            const termName = e.target.dataset.term;
            const term = GLOSSARY_DATA.find(t => t.term === termName);
            if (term) {
                showTermModal(term);
            }
        }
    });
}

// Show term modal
function showTermModal(term) {
    const modal = document.getElementById('termModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalReading = modal.querySelector('.modal-reading');
    const modalCategory = modal.querySelector('.modal-category');
    const modalDescription = document.getElementById('modalDescription');
    const modalExamples = modal.querySelector('.modal-examples');
    const modalRelated = modal.querySelector('.modal-related');
    
    // Populate modal content
    modalTitle.textContent = term.term;
    modalReading.textContent = `(${term.reading})`;
    modalCategory.textContent = CATEGORY_LABELS[term.category];
    modalDescription.textContent = term.description;
    modalExamples.textContent = term.examples;
    
    // Populate related terms
    modalRelated.innerHTML = '';
    term.related.forEach(relatedTerm => {
        const relatedButton = document.createElement('button');
        relatedButton.className = 'related-term';
        relatedButton.textContent = relatedTerm;
        relatedButton.addEventListener('click', function() {
            const relatedTermData = GLOSSARY_DATA.find(t => t.term === relatedTerm);
            if (relatedTermData) {
                showTermModal(relatedTermData);
            }
        });
        modalRelated.appendChild(relatedButton);
    });
    
    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus management
    const firstFocusable = modal.querySelector('.modal-close');
    firstFocusable.focus();
    
    // Store current term for sharing
    modal.setAttribute('data-current-term', term.term);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('termModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Return focus to trigger element
    const currentTerm = modal.getAttribute('data-current-term');
    const termCard = document.querySelector(`[data-term="${currentTerm}"]`);
    if (termCard) {
        termCard.focus();
    }
}

// Share current term
function shareCurrentTerm() {
    const modal = document.getElementById('termModal');
    const currentTerm = modal.getAttribute('data-current-term');
    const term = GLOSSARY_DATA.find(t => t.term === currentTerm);
    
    if (term && navigator.share) {
        navigator.share({
            title: `花街用語: ${term.term}`,
            text: `${term.term}(${term.reading}): ${term.description}`,
            url: window.location.href + `#${term.term}`
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        const shareText = `${term.term}(${term.reading}): ${term.description}\n\n全国花街ポータルサイト: ${window.location.href}`;
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('用語の詳細をクリップボードにコピーしました');
        }).catch(() => {
            showNotification('シェア機能はサポートされていません');
        });
    }
}

// Featured terms functionality
function initFeaturedTerms() {
    const viewTermBtns = document.querySelectorAll('.view-term-btn');
    
    viewTermBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const termName = this.dataset.term;
            const term = GLOSSARY_DATA.find(t => t.term === termName);
            if (term) {
                showTermModal(term);
            }
        });
    });
}

// Accessibility features
function initAccessibilityFeatures() {
    // Add ARIA labels
    const searchInput = document.getElementById('searchInput');
    searchInput.setAttribute('aria-describedby', 'search-help');
    
    // Add search help text
    const searchHelp = document.createElement('div');
    searchHelp.id = 'search-help';
    searchHelp.className = 'sr-only';
    searchHelp.textContent = '用語名、読み方、説明文で検索できます';
    searchInput.parentNode.appendChild(searchHelp);
    
    // Enhanced focus indicators
    const focusableElements = document.querySelectorAll(
        'button, input, select, .term-card, .alphabet-btn'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--accent-color)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'liveRegion';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(liveRegion);
}

// Helper functions
function resetFiltersAndDisplay() {
    // Reset alphabet navigation
    const alphabetButtons = document.querySelectorAll('.alphabet-btn');
    alphabetButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-letter="all"]').classList.add('active');
    
    // Reset page
    currentPage = 0;
    
    // Display terms
    displayTerms();
    updateResultCount();
}

function updateResultCount() {
    const resultCount = document.getElementById('resultCount');
    const count = displayedTerms.length;
    resultCount.innerHTML = `全 <strong>${count}</strong> 件の用語`;
}

function announceSearchResults(count) {
    const liveRegion = document.getElementById('liveRegion');
    if (liveRegion) {
        liveRegion.textContent = `検索結果: ${count}件の用語が見つかりました`;
    }
}

function announceFilterChange(letter) {
    const liveRegion = document.getElementById('liveRegion');
    if (liveRegion) {
        const message = letter === 'all' ? 'すべての用語を表示しています' : `「${letter}」で始まる用語を表示しています`;
        liveRegion.textContent = message;
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        z-index: 3000;
        box-shadow: var(--shadow-hover);
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .sr-only {
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        }
        
        .notification {
            font-family: 'Noto Serif JP', serif;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize glossary
    initGlossary();
});

// Handle URL hash for direct term linking
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const term = GLOSSARY_DATA.find(t => t.term === decodeURIComponent(hash));
        if (term) {
            showTermModal(term);
        }
    }
});

// Check for hash on page load
if (window.location.hash) {
    window.addEventListener('load', function() {
        const hash = window.location.hash.slice(1);
        const term = GLOSSARY_DATA.find(t => t.term === decodeURIComponent(hash));
        if (term) {
            setTimeout(() => showTermModal(term), 500);
        }
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Glossary page error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
    });
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GLOSSARY_DATA,
        initGlossary,
        showTermModal,
        getHiraganaGroup
    };
}