/**
 * Interactive Calendar for News & Events Page
 * Handles calendar navigation, event display, and modal interactions
 */

class EventCalendar {
    constructor() {
        // 現在の日付に設定
        this.currentDate = new Date(); // 現在の日付
        this.today = new Date(); // 今日の日付
        this.isSubpage = window.location.pathname.includes('/pages/');
        this.events = this.loadDefaultEvents();
        this.normalizeEventAssetPaths();
        this.init();
        // Excelからのイベント読み込みを無効化（デフォルトイベントのみ使用）
        // this.loadExcelAndRender();
    }

    init() {
        this.monthElement = document.querySelector('.calendar-month');
        this.yearElement = document.querySelector('.calendar-year');
        this.prevButton = document.querySelector('.prev-month');
        this.nextButton = document.querySelector('.next-month');
        this.calendarGrid = document.querySelector('.calendar-grid');
        this.modal = document.getElementById('event-modal');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        this.bindEvents();
        this.renderCalendar();
        this.setupFilters();
    }

    bindEvents() {
        // Calendar navigation
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.previousMonth());
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextMonth());
        }

        // Modal events
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal || e.target.classList.contains('modal-close')) {
                    this.closeModal();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }
    }

    loadDefaultEvents() {
        // 2025年のイベントデータ（フォールバック）
        return {
            // 1月のイベント
            '2025-1-7': [{
                title: '初春の舞',
                type: 'performance',
                time: '13:30',
                location: '中町公園(八王子市中町9)',
                price: '観覧無料',
                description: '新年を寿ぎ、八王子芸妓が踊りを披露いたします。',
                contact: '八王子芸妓組合 TEL: 042-xxx-xxxx',
                image: '../images/1月/0107_八王子・新春の舞1（仮）.jpeg'
            }],
            // 2月のイベント
            '2025-2-2': [
                {
                    title: '浅草観音文化芸能人節分会',
                    type: 'ceremony',
                    time: '14:30～17:15（芸者衆による豆まきは17:00～）',
                    location: '浅草寺本堂 東側特設舞台',
                    price: '観覧無料',
                    description: '浅草芸者衆が浅草寺境内より豆まきを行います。',
                    contact: '浅草観光連盟（TEL：03-3844-1221）',
                    image: '../images/2月/0202_浅草_節分1.JPG',
                    link: 'https://e-asakusa.jp/'
                },
                {
                    title: '高尾山節分会追儺式',
                    type: 'ceremony',
                    time: '9:00/10:30/12:00/13:30/14:30(各回異なる芸妓衆が修行予定)',
                    location: '高尾山薬王院 境内（東京都八王子市高尾町2177）',
                    price: '観覧無料',
                    description: '八王子芸妓衆が境内より豆まきを行います。',
                    contact: '高尾山薬王院（TEL：０４２-６６１-１１１５）',
                    image: null, // グレーのダミー画像
                    link: 'https://takaosan.or.jp/setsubun/'
                }
            ],
            '2025-2-3': [{
                title: '節分豆まき式',
                type: 'ceremony',
                time: '15:00～',
                location: '善國寺 境内（東京都新宿区神楽坂5-36）',
                price: '観覧無料',
                description: '毘沙門様の愛称で地元の人々に親しまれる善國寺にて芸者衆が豆まきを行います。',
                contact: '善國寺（TEL：03-3269-0641）',
                image: '../images/2月/0202_神楽坂_節分1.JPG',
                link: 'https://kagurazaka-bishamonten.com/event/'
            }],
            '2025-2-9': [{
                title: '「さかのうえの大宴会」節分お化け',
                type: 'banquet',
                time: '18:00～21:30',
                location: 'つくね侍 さかのうえ（東京都渋谷区円山町２０－１ 新大宗丸山ビル１階）',
                price: '15,000円（お食事お飲み物付き）',
                description: '古民家風のしつらえで、様々な芸能とともに円山芸者衆の芸をご堪能いただきます。',
                contact: 'つくね侍 さかのうえ（TEL：03-6809-0450）',
                image: '../images/2月/0209_渋谷円山町_節分1.jpeg',
                link: 'https://tsukunesamurai-sakanoue.owst.jp/blogs/3431914'
            }],
            '2025-2-15': [{
                title: 'かぐら坂への誘い',
                type: 'performance',
                time: '第一部：12:00～/15:30（各回、開場は３０分前・所要時間約1時間30分予定/演目は両回同様）',
                location: '神楽坂 東京大神宮内 マツヤサロン（東京都千代田区富士見2-4-1）',
                price: '22,000円（全席指定・御飲食料込）',
                description: '「特製懐石弁当」をお召上がりいただきながら、神楽坂芸者衆の踊りをお楽しみいただきます。',
                contact: '東京神楽坂組合 見番事務所（TEL：03-3260-3291）',
                image: '../images/2月/0215_神楽坂_かぐら坂への誘い.JPG',
                link: 'https://kagurazaka-kumiai.com/news/192/'
            }],
            '2025-3-22': [{
                title: '「Tokyo Creative Salon 2025」AKASAKA GEISHA PARADE',
                type: 'parade',
                time: '12:00～（約１時間予定）',
                location: '赤坂一ツ木通り、エスプラナード赤坂、みすじ通り、赤坂通り（東京都港区赤坂）',
                price: '観覧無料',
                description: '赤坂芸者衆と赤坂24町会の方々が、赤坂の街を練り歩きます。',
                contact: 'TBS（TEL：03-3746-1111）',
                image: '../images/3月/0322_赤坂_TCS_1.JPG',
                link: 'https://www.tbs.co.jp/tcs-akasaka/#geisha'
            }],
            '2025-3-27': [{
                title: '墨堤さくらまつり「芸妓茶屋」',
                type: 'tea_house',
                time: '平日11:30～15:30/土日11:30～16:00（雨天強風は中止）',
                location: '向嶋 桜橋デッキスクエア（東京都墨田区向島5-1-1）',
                price: '茶屋の飲食は有料',
                description: '隅田公園に期間限定で「芸妓茶屋」を設置。お団子等をご購入いただきますと、お席まで芸者衆がお運びします。',
                contact: '墨田区観光協会（TEL：03-6657-5160）',
                image: '../images/3月/0327-0406_向嶋_芸妓茶屋_1.JPG',
                link: 'https://visit-sumida.jp/event/sakuramatsuri2025/'
            }],
            '2025-3-28': [{
                title: '墨堤さくらまつり「芸妓茶屋」',
                type: 'tea_house',
                time: '平日11:30～15:30/土日11:30～16:00（雨天強風は中止）',
                location: '向嶋 桜橋デッキスクエア（東京都墨田区向島5-1-1）',
                price: '茶屋の飲食は有料',
                description: '隅田公園に期間限定で「芸妓茶屋」を設置。お団子等をご購入いただきますと、お席まで芸者衆がお運びします。',
                contact: '墨田区観光協会（TEL：03-6657-5160）',
                image: '../images/3月/0327-0406_向嶋_芸妓茶屋_1.JPG',
                link: 'https://visit-sumida.jp/event/sakuramatsuri2025/'
            }],
            '2025-3-29': [{
                title: '墨堤さくらまつり「芸妓茶屋」',
                type: 'tea_house',
                time: '平日11:30～15:30/土日11:30～16:00（雨天強風は中止）',
                location: '向嶋 桜橋デッキスクエア（東京都墨田区向島5-1-1）',
                price: '茶屋の飲食は有料',
                description: '隅田公園に期間限定で「芸妓茶屋」を設置。お団子等をご購入いただきますと、お席まで芸者衆がお運びします。',
                contact: '墨田区観光協会（TEL：03-6657-5160）',
                image: '../images/3月/0327-0406_向嶋_芸妓茶屋_1.JPG',
                link: 'https://visit-sumida.jp/event/sakuramatsuri2025/'
            }],
            '2025-3-30': [{
                title: '墨堤さくらまつり「芸妓茶屋」',
                type: 'tea_house',
                time: '平日11:30～15:30/土日11:30～16:00（雨天強風は中止）',
                location: '向嶋 桜橋デッキスクエア（東京都墨田区向島5-1-1）',
                price: '茶屋の飲食は有料',
                description: '隅田公園に期間限定で「芸妓茶屋」を設置。お団子等をご購入いただきますと、お席まで芸者衆がお運びします。',
                contact: '墨田区観光協会（TEL：03-6657-5160）',
                image: '../images/3月/0327-0406_向嶋_芸妓茶屋_1.JPG',
                link: 'https://visit-sumida.jp/event/sakuramatsuri2025/'
            }, {
                title: '浅草花街「お花見会」',
                type: 'hanami',
                time: '16:00～（15:30開場）',
                location: '浅草 浅草ビューホテル3階【祥雲の間】（東京都台東区西浅草3-17-1）',
                price: '27,500円（お食事・お飲み物付き）',
                description: '浅草芸者衆と幇間衆が勢ぞろいし、お客様を春の味覚と踊りでおもてなしいたします。',
                contact: '東京浅草組合 浅草見番（TEL：03-3874-3131）',
                image: '../images/3月/0330_浅草_花見の会_2.JPG',
                link: 'https://asakusakenban.com/information/'
            }],
            '2025-3-31': [{
                title: '墨堤さくらまつり「芸妓茶屋」',
                type: 'tea_house',
                time: '平日11:30～15:30/土日11:30～16:00（雨天強風は中止）',
                location: '向嶋 桜橋デッキスクエア（東京都墨田区向島5-1-1）',
                price: '茶屋の飲食は有料',
                description: '隅田公園に期間限定で「芸妓茶屋」を設置。お団子等をご購入いただきますと、お席まで芸者衆がお運びします。',
                contact: '墨田区観光協会（TEL：03-6657-5160）',
                image: '../images/3月/0327-0406_向嶋_芸妓茶屋_1.JPG',
                link: 'https://visit-sumida.jp/event/sakuramatsuri2025/'
            }],
            '2025-4-1': [{
                title: '墨堤さくらまつり「芸妓茶屋」',
                type: 'tea_house',
                time: '平日11:30～15:30/土日11:30～16:00（雨天強風は中止）',
                location: '向嶋 桜橋デッキスクエア（東京都墨田区向島5-1-1）',
                price: '茶屋の飲食は有料',
                description: '隅田公園に期間限定で「芸妓茶屋」を設置。お団子等をご購入いただきますと、お席まで芸者衆がお運びします。',
                contact: '墨田区観光協会（TEL：03-6657-5160）',
                image: '../images/3月/0327-0406_向嶋_芸妓茶屋_1.JPG',
                link: 'https://visit-sumida.jp/event/sakuramatsuri2025/'
            }],
            '2025-4-2': [{
                title: '墨堤さくらまつり「芸妓茶屋」',
                type: 'tea_house',
                time: '平日11:30～15:30/土日11:30～16:00（雨天強風は中止）',
                location: '向嶋 桜橋デッキスクエア（東京都墨田区向島5-1-1）',
                price: '茶屋の飲食は有料',
                description: '隅田公園に期間限定で「芸妓茶屋」を設置。お団子等をご購入いただきますと、お席まで芸者衆がお運びします。',
                contact: '墨田区観光協会（TEL：03-6657-5160）',
                image: '../images/3月/0327-0406_向嶋_芸妓茶屋_1.JPG',
                link: 'https://visit-sumida.jp/event/sakuramatsuri2025/'
            }],
            '2025-4-3': [{
                title: '墨堤さくらまつり「芸妓茶屋」',
                type: 'tea_house',
                time: '平日11:30～15:30/土日11:30～16:00（雨天強風は中止）',
                location: '向嶋 桜橋デッキスクエア（東京都墨田区向島5-1-1）',
                price: '茶屋の飲食は有料',
                description: '隅田公園に期間限定で「芸妓茶屋」を設置。お団子等をご購入いただきますと、お席まで芸者衆がお運びします。',
                contact: '墨田区観光協会（TEL：03-6657-5160）',
                image: '../images/3月/0327-0406_向嶋_芸妓茶屋_1.JPG',
                link: 'https://visit-sumida.jp/event/sakuramatsuri2025/'
            }],
            '2025-4-4': [{
                title: '墨堤さくらまつり「芸妓茶屋」',
                type: 'tea_house',
                time: '平日11:30～15:30/土日11:30～16:00（雨天強風は中止）',
                location: '向嶋 桜橋デッキスクエア（東京都墨田区向島5-1-1）',
                price: '茶屋の飲食は有料',
                description: '隅田公園に期間限定で「芸妓茶屋」を設置。お団子等をご購入いただきますと、お席まで芸者衆がお運びします。',
                contact: '墨田区観光協会（TEL：03-6657-5160）',
                image: '../images/3月/0327-0406_向嶋_芸妓茶屋_1.JPG',
                link: 'https://visit-sumida.jp/event/sakuramatsuri2025/'
            }],
            '2025-4-5': [{
                title: '墨堤さくらまつり「芸妓茶屋」',
                type: 'tea_house',
                time: '平日11:30～15:30/土日11:30～16:00（雨天強風は中止）',
                location: '向嶋 桜橋デッキスクエア（東京都墨田区向島5-1-1）',
                price: '茶屋の飲食は有料',
                description: '隅田公園に期間限定で「芸妓茶屋」を設置。お団子等をご購入いただきますと、お席まで芸者衆がお運びします。',
                contact: '墨田区観光協会（TEL：03-6657-5160）',
                image: '../images/3月/0327-0406_向嶋_芸妓茶屋_1.JPG',
                link: 'https://visit-sumida.jp/event/sakuramatsuri2025/'
            }],
            '2025-4-6': [{
                title: '墨堤さくらまつり「芸妓茶屋」',
                type: 'tea_house',
                time: '平日11:30～15:30/土日11:30～16:00（雨天強風は中止）',
                location: '向嶋 桜橋デッキスクエア（東京都墨田区向島5-1-1）',
                price: '茶屋の飲食は有料',
                description: '隅田公園に期間限定で「芸妓茶屋」を設置。お団子等をご購入いただきますと、お席まで芸者衆がお運びします。',
                contact: '墨田区観光協会（TEL：03-6657-5160）',
                image: '../images/3月/0327-0406_向嶋_芸妓茶屋_1.JPG',
                link: 'https://visit-sumida.jp/event/sakuramatsuri2025/'
            }],
            '2025-4-12': [{
                title: '「さかのうえの大宴会」春爛漫さかのうえのお花見大宴会',
                type: 'banquet',
                time: '18:00～21:30',
                location: '渋谷 つくね侍 さかのうえ（東京都渋谷区円山町２０－１ 新大宗丸山ビル１階）',
                price: '13,000円（お食事お飲み物付き）',
                description: '古民家風のしつらえで、様々な芸能とともに円山芸者衆の芸をご堪能いただきます。',
                contact: 'つくね侍 さかのうえ（TEL：03-6809-0450）',
                image: '../images/4月/0412_渋谷円山町.JPG',
                link: 'https://tsukunesamurai-sakanoue.owst.jp/blogs/3436064'
            }],
            '2025-4-18': [{
                title: '第4回 八王子をどり',
                type: 'dance',
                time: '〈昼の部〉13:00開演・〈夜の部〉17時開演（開場は各回1時間前）',
                location: '八王子 いちょうホール 大ホール 八王子市芸術文化会館（八王子市本町24-1）',
                price: '8,000円（全席指定、プログラム・イヤホンガイド付）',
                description: '2021年の開催から5年ぶりの開催、桑都に舞う艶姿をお楽しみください。',
                contact: 'いちょうホール（TEL：042-621-3001）',
                image: '../images/4月/0418-0419_八王子_八王子をどり2.jpeg',
                link: 'https://www.hachiojibunka.or.jp/icho/archives/eventinfo/10018/'
            }],
            '2025-4-19': [{
                title: '第4回 八王子をどり',
                type: 'dance',
                time: '〈昼の部〉13:00開演・〈夜の部〉17時開演（開場は各回1時間前）',
                location: '八王子 いちょうホール 大ホール 八王子市芸術文化会館（八王子市本町24-1）',
                price: '8,000円（全席指定、プログラム・イヤホンガイド付）',
                description: '2021年の開催から5年ぶりの開催、桑都に舞う艶姿をお楽しみください。',
                contact: 'いちょうホール（TEL：042-621-3001）',
                image: '../images/4月/0418-0419_八王子_八王子をどり2.jpeg',
                link: 'https://www.hachiojibunka.or.jp/icho/archives/eventinfo/10018/'
            }],
            '2025-4-24': [{
                title: '第40回 特別公演 神楽坂をどり',
                type: 'dance',
                time: '17：00開演（16：15開場）',
                location: '神楽坂 東急歌舞伎町タワー THEATER MILANO-Za（東京都新宿区歌舞伎町1-29-1）',
                price: '○○○○円※11月下旬発売開始予定',
                description: '今回は「東急歌舞伎町タワー・THEATER MILANO-Za」に移し、特別公演として開催いたします。',
                contact: '東京神楽坂組合 見番事務所（TEL：03-3260-3291）',
                image: '../images/4月/0424-0425_神楽坂_神楽坂をどり1.JPG',
                link: 'https://kagurazaka-kumiai.com/news/215/'
            }],
            '2025-4-25': [{
                title: '第40回 特別公演 神楽坂をどり',
                type: 'dance',
                time: '12：30開演（11：45開場）・16：00開演（15：15開場）',
                location: '神楽坂 東急歌舞伎町タワー THEATER MILANO-Za（東京都新宿区歌舞伎町1-29-1）',
                price: '○○○○円※11月下旬発売開始予定',
                description: '今回は「東急歌舞伎町タワー・THEATER MILANO-Za」に移し、特別公演として開催いたします。',
                contact: '東京神楽坂組合 見番事務所（TEL：03-3260-3291）',
                image: '../images/4月/0424-0425_神楽坂_神楽坂をどり1.JPG',
                link: 'https://kagurazaka-kumiai.com/news/215/'
            }],
            '2025-5-16': [{
                title: '三社祭「大行列」',
                type: 'parade',
                time: '13:00浅草見番前出発（雨天中止）',
                location: '浅草 【西廻り】柳通り→千束通り→ひさご通り→浅草六区→雷門通り→雷門→仲見世→浅草神社',
                price: '観覧無料',
                description: 'お囃子屋台・鳶頭木遣り・びんざさら舞・白鷺の舞とともに、浅草芸者衆・幇間衆が浅草の町を練り歩きます。',
                contact: '浅草神社社々務所（TEL：03-3844-1575）',
                image: '../images/5月/0517_浅草_三社祭「大行列」1.JPG',
                link: 'https://www.asakusajinja.jp/sanjamatsuri/schedule/index.html'
            }],
            '2025-5-17': [{
                title: '三社祭「くみ踊り鑑賞の集い」',
                type: 'dance',
                time: '13:00開演（12:30開場）',
                location: '浅草 浅草三業会館（浅草見番：東京都台東区浅草3-33-5）',
                price: '5,500円（自由席・定員150名）',
                description: '芸者衆が数人ずつ組になり踊るほか、幇間衆も出演する賑やかな会をお届けします。',
                contact: '東京浅草組合（見番）（TEL：03-3874-3131）/カンフェティ（TEL：0120-240-540）',
                image: '../images/5月/0518_浅草_三社祭「くみ踊り鑑賞の集い」2.JPG',
                link: 'https://asakusakenban.com/information/'
            }],
            '2025-5-18': [{
                title: '三社祭「くみ踊り鑑賞の集い」',
                type: 'dance',
                time: '13:00開演（12:30開場）',
                location: '浅草 浅草三業会館（浅草見番：東京都台東区浅草3-33-5）',
                price: '5,500円（自由席・定員150名）',
                description: '芸者衆が数人ずつ組になり踊るほか、幇間衆も出演する賑やかな会をお届けします。',
                contact: '東京浅草組合（見番）（TEL：03-3874-3131）/カンフェティ（TEL：0120-240-540）',
                image: '../images/5月/0518_浅草_三社祭「くみ踊り鑑賞の集い」2.JPG',
                link: 'https://asakusakenban.com/information/'
            }, {
                title: '三社祭「奉納舞踊」',
                type: 'dance',
                time: '15:00～',
                location: '浅草 浅草神社内の神楽殿（東京都台東区浅草2-3-1）',
                price: '観覧無料',
                description: '浅草神社内の神楽殿にて、浅草芸者衆・幇間衆が踊りと幇間芸を奉納します。',
                contact: '浅草神社社々務所（TEL：03-3844-1575）',
                image: '../images/5月/0518_浅草_三社祭奉納踊り」1.jpeg',
                link: 'https://www.asakusajinja.jp/sanjamatsuri/schedule/index.html'
            }, {
                title: '華のおどり',
                type: 'dance',
                time: '15:30～開演（15:00開場）',
                location: '赤坂 きらぼし銀行本店8階（東京都港区南青山3-10-43）',
                price: '観賞無料（※港区在住・在勤・在学者限定、事前申込・先着順/応募締め切り4/11）',
                description: '赤坂花街の伝統文化を継承する取り組みとして、赤坂芸者衆による踊「華のおどり」をお届けします。',
                contact: '㈱東京きらぼしフィナンシャルグループ事業戦略部（TEL：03-6447-5891）',
                image: '../images/5月/0518_赤坂_華のおどり3.JPG',
                link: 'https://dp700d203kaax.cloudfront.net/zyouhousi/back-number/pdf/Kissport_25-04.pdf'
            }],
            '2025-5-21': [{
                title: '第100回 東をどり',
                type: 'dance',
                time: '〈昼の回〉 12:30開演/〈夕の回〉 16:00開演（開場は各回30分前）',
                location: '新橋 新橋演舞場（東京都中央区銀座6-18-2）',
                price: '桟敷席：12,000円/雪席：10,000円（1階/2階前方）/月席：6,000円（2階後方/2階左右）/花席：2,000円（3階自由席）※学生割引：当日会場窓口販売の当日券に限り、学生証ご提示で全席半額',
                description: '普段は一見お断りと閉ざす新橋花柳界の門。年一度の東をどりにその扉が開き、百回を迎え 新橋芸者に華を添えます。',
                contact: 'チケットホン松竹（TEL：0570-000-489 / 03-6745-0888）',
                image: '../images/5月/0521_新橋_東をどり1.JPG',
                link: 'https://azuma-odori.net/'
            }],
            '2025-5-22': [{
                title: '第100回 東をどり',
                type: 'dance',
                time: '〈昼の回〉 12:30開演/〈夕の回〉 16:00開演（開場は各回30分前）',
                location: '新橋 新橋演舞場（東京都中央区銀座6-18-2）',
                price: '桟敷席：12,000円/雪席：10,000円（1階/2階前方）/月席：6,000円（2階後方/2階左右）/花席：2,000円（3階自由席）※学生割引：当日会場窓口販売の当日券に限り、学生証ご提示で全席半額',
                description: '普段は一見お断りと閉ざす新橋花柳界の門。年一度の東をどりにその扉が開き、百回を迎え 新橋芸者に華を添えます。',
                contact: 'チケットホン松竹（TEL：0570-000-489 / 03-6745-0888）',
                image: '../images/5月/0521_新橋_東をどり1.JPG',
                link: 'https://azuma-odori.net/'
            }],
            '2025-5-23': [{
                title: '第100回 東をどり',
                type: 'dance',
                time: '〈昼の回〉 12:30開演/〈夕の回〉 16:00開演（開場は各回30分前）',
                location: '新橋 新橋演舞場（東京都中央区銀座6-18-2）',
                price: '桟敷席：12,000円/雪席：10,000円（1階/2階前方）/月席：6,000円（2階後方/2階左右）/花席：2,000円（3階自由席）※学生割引：当日会場窓口販売の当日券に限り、学生証ご提示で全席半額',
                description: '普段は一見お断りと閉ざす新橋花柳界の門。年一度の東をどりにその扉が開き、百回を迎え 新橋芸者に華を添えます。',
                contact: 'チケットホン松竹（TEL：0570-000-489 / 03-6745-0888）',
                image: '../images/5月/0521_新橋_東をどり1.JPG',
                link: 'https://azuma-odori.net/'
            }],
            '2025-5-24': [{
                title: '第100回 東をどり',
                type: 'dance',
                time: '〈昼の回〉 12:30開演/〈夕の回〉 16:00開演（開場は各回30分前）',
                location: '新橋 新橋演舞場（東京都中央区銀座6-18-2）',
                price: '桟敷席：12,000円/雪席：10,000円（1階/2階前方）/月席：6,000円（2階後方/2階左右）/花席：2,000円（3階自由席）※学生割引：当日会場窓口販売の当日券に限り、学生証ご提示で全席半額',
                description: '普段は一見お断りと閉ざす新橋花柳界の門。年一度の東をどりにその扉が開き、百回を迎え 新橋芸者に華を添えます。',
                contact: 'チケットホン松竹（TEL：0570-000-489 / 03-6745-0888）',
                image: '../images/5月/0521_新橋_東をどり1.JPG',
                link: 'https://azuma-odori.net/'
            }],
            '2025-5-25': [{
                title: '第100回 東をどり',
                type: 'dance',
                time: '〈昼の回〉 12:30開演/〈夕の回〉 16:00開演（開場は各回30分前）',
                location: '新橋 新橋演舞場（東京都中央区銀座6-18-2）',
                price: '桟敷席：12,000円/雪席：10,000円（1階/2階前方）/月席：6,000円（2階後方/2階左右）/花席：2,000円（3階自由席）※学生割引：当日会場窓口販売の当日券に限り、学生証ご提示で全席半額',
                description: '普段は一見お断りと閉ざす新橋花柳界の門。年一度の東をどりにその扉が開き、百回を迎え 新橋芸者に華を添えます。',
                contact: 'チケットホン松竹（TEL：0570-000-489 / 03-6745-0888）',
                image: '../images/5月/0521_新橋_東をどり1.JPG',
                link: 'https://azuma-odori.net/'
            }, {
                title: '茜まつり',
                type: 'festival',
                time: '18:00～',
                location: '赤坂 赤坂サカス広場（東京都港区赤坂5-3-1）',
                price: '観覧無料（※天候によりイベントは予告なく変更・終了する可能性あり）',
                description: '赤坂の歴史と伝統を紡いできた「赤坂芸者」は、赤坂のシンボルの一つ。普段はなかなか見ることのできない、赤坂芸者衆の踊りをトークショーをお届けします。赤坂の味、文化、歴史、人を伝えるこのおまつりの目玉イベントです。',
                contact: '茜まつり実行委員会（TEL：XXXXXXX）',
                image: '../images/5月/0525_赤坂_茜まつり1.JPG',
                link: 'https://akanematsuri.com/'
            }],
            '2025-5-26': [{
                title: '第100回 東をどり',
                type: 'dance',
                time: '〈昼の回〉 12:30開演/〈夕の回〉 16:00開演（開場は各回30分前）',
                location: '新橋 新橋演舞場（東京都中央区銀座6-18-2）',
                price: '桟敷席：12,000円/雪席：10,000円（1階/2階前方）/月席：6,000円（2階後方/2階左右）/花席：2,000円（3階自由席）※学生割引：当日会場窓口販売の当日券に限り、学生証ご提示で全席半額',
                description: '普段は一見お断りと閉ざす新橋花柳界の門。年一度の東をどりにその扉が開き、百回を迎え 新橋芸者に華を添えます。',
                contact: 'チケットホン松竹（TEL：0570-000-489 / 03-6745-0888）',
                image: '../images/5月/0521_新橋_東をどり1.JPG',
                link: 'https://azuma-odori.net/'
            }],
            '2025-5-27': [{
                title: '第100回 東をどり',
                type: 'dance',
                time: '〈昼の回〉 12:30開演/〈夕の回〉 16:00開演（開場は各回30分前）',
                location: '新橋 新橋演舞場（東京都中央区銀座6-18-2）',
                price: '桟敷席：12,000円/雪席：10,000円（1階/2階前方）/月席：6,000円（2階後方/2階左右）/花席：2,000円（3階自由席）※学生割引：当日会場窓口販売の当日券に限り、学生証ご提示で全席半額',
                description: '普段は一見お断りと閉ざす新橋花柳界の門。年一度の東をどりにその扉が開き、百回を迎え 新橋芸者に華を添えます。',
                contact: 'チケットホン松竹（TEL：0570-000-489 / 03-6745-0888）',
                image: '../images/5月/0521_新橋_東をどり1.JPG',
                link: 'https://azuma-odori.net/'
            }],
            '2025-5-28': [{
                title: '渋谷和芸「四季の宴―雨―」',
                type: 'dance',
                time: '18:00開宴（17:30開場）',
                location: '渋谷 料亭 三長（東京都渋谷区円山町6-1）',
                price: '22,000円（お食事・お飲み物代含む）',
                description: '渋谷に残る花街・円山町の芸者衆の芸とともに、花柳寿世晶による日本舞踊で、雨をテーマに江戸の情緒をお楽しみください。',
                contact: '渋谷和芸 運営事務局（TEL：090-3232-1943）',
                image: null,
                link: 'https://shibuya-wagei.com/'
            }],
            '2025-6-1': [{
                title: '幇間大競演',
                type: 'dance',
                time: '13:00開演（12:30開場）',
                location: '浅草 浅草三業会館（浅草見番：東京都台東区浅草3-33-5）',
                price: '5,000円',
                description: '宴席で踊りや幇間芸などで場を盛り上げる幇間衆。日本で唯一、幇間衆が活躍している花街は浅草のみ。今回は所属する幇間全員が集い、様々な芸をお届けする、またとない機会です。',
                contact: '東京浅草組合 浅草見番（TEL：03-3874-3131）',
                image: '../images/6月/0601_浅草_幇間大競演2.JPG',
                link: 'https://asakusakenban.com/information/'
            }],
            '2025-6-14': [{
                title: 'さかのうえの大宴会',
                type: 'dance',
                time: '18:00～21:30',
                location: '渋谷 つくね侍 さかのうえ（東京都渋谷区円山町20-1 新大宗丸山ビル1階）',
                price: '13,000円（お食事お飲み物付き）',
                description: '古民家風のしつらえで、様々な芸能とともに円山芸者衆の芸をご堪能いただきます。',
                contact: 'つくね侍 さかのうえ（TEL：03-6809-0450）',
                image: '../images/6月/0614_渋谷円山町.JPG',
                link: 'https://tsukunesamurai-sakanoue.owst.jp/blogs/3438657'
            }],
            '2025-6-22': [{
                title: '第一回札幌をどり',
                type: 'dance',
                time: '11:00～/18:00～（各回30分前開場）',
                location: '新橋・赤坂 道新ホール（札幌市中央区大通西3-6 道新ビル大通館8階）',
                price: '7,000円（全席指定）',
                description: 'さっぽろ名妓連の芸者衆、初めてのをどりに、新橋芸者衆・赤坂芸者衆が賛助出演いたします。',
                contact: 'さっぽろ名妓連事務局（TEL：070-4385-4397）',
                image: '../images/6月/0622_赤坂・新橋_札幌をどり2.JPG',
                link: 'https://www.sapporo-cci.or.jp/web/motion/details/post_46.html'
            }],
            '2025-7-5': [{
                title: '伝承のたまてばこ 多摩伝統文化フェスティバル「八王子芸妓衆の華と粋 ～艶やかにおもてなし～」',
                type: 'festival',
                time: '14:30～15:00',
                location: '八王子 いちょうホール 大ホール（八王子市本町24-1）',
                price: '観賞無料',
                description: '八王子芸者衆が趣向を凝らした見目で、桑都の文化を発信します。',
                contact: '伝承のたまてばこ事務局 公益財団法人八王子市学園都市文化ふれあい財団（TEL：042-621-3005）',
                image: '../images/7月/0705-6_八王子_伝承のたまてばこ仮.jpeg',
                link: 'https://denshonotamatebako.tokyo/'
            }],
            '2025-7-6': [{
                title: '伝承のたまてばこ 多摩伝統文化フェスティバル「八王子芸妓衆の華と粋 ～艶やかにおもてなし～」',
                type: 'festival',
                time: '14:30～15:00',
                location: '八王子 いちょうホール 大ホール（八王子市本町24-1）',
                price: '観賞無料',
                description: '八王子芸者衆が趣向を凝らした見目で、桑都の文化を発信します。',
                contact: '伝承のたまてばこ事務局 公益財団法人八王子市学園都市文化ふれあい財団（TEL：042-621-3005）',
                image: '../images/7月/0705-6_八王子_伝承のたまてばこ仮.jpeg',
                link: 'https://denshonotamatebako.tokyo/'
            }],
            '2025-7-6': [{
                title: 'ビア座敷',
                type: 'event',
                time: '16:00～18:00',
                location: '浅草 浅草三業会館（浅草見番：東京都台東区浅草3-33-5）',
                price: '15,000円（フリードリンク・オードブル付き）',
                description: '浴衣姿の浅草芸者衆と幇間衆とご一緒に、ビールとともに暑い夏を乗り切るひとときをお過ごしください。',
                contact: '東京浅草組合 浅草見番（TEL：03-3874-3131）',
                image: '../images/7月/0706_浅草_ビア座敷3.JPG',
                link: 'https://asakusakenban.com/information/'
            }],
            '2025-7-19': [{
                title: '朝顔市',
                type: 'event',
                time: '12:00～15:00',
                location: '八王子 八王子三業組合 見番（東京都八王子市南町1-7）',
                price: '参加無料',
                description: '八王子芸者衆による朝顔の販売を（数量限定）いたします。夏の風物詩の涼やかなひとときをお楽しみください。',
                contact: '八王子三業組合 見番（TEL：042-622-5191）',
                image: '../images/7月/0719_八王子_朝顔市1.jpeg',
                link: 'https://japan-heritage-soto.jp/calendar/%e3%80%90%e5%85%ab%e7%8e%8b%e5%ad%90%e8%8a%b8%e5%a6%93%e3%80%91%e8%a6%8b%e7%95%aa%e3%81%a7%e6%9c%9d%e9%a1%94%e5%b8%82/'
            }],
            '2025-8-1': [{
                title: '八王子まつり「柳遊まつり」',
                type: 'event',
                time: '16:00～',
                location: '八王子 八王子三業組合 見番（東京都八王子市南町1-7）',
                price: '入場券：3,000円（定員40名）',
                description: '八王子芸者衆の踊りを、お稽古場である見番にて間近でお楽しみいただけます。',
                contact: '八王子三業組合 見番（TEL：042-622-5191）',
                image: '../images/8月/0801_八王子_八王子まつり「柳遊まつり」.JPG',
                link: '#'
            }, {
                title: '八王子まつり「宵宮の舞」',
                type: 'event',
                time: '18:30～19:00',
                location: '八王子 西放射線ユーロード中町公園',
                price: '観覧無料',
                description: '日本遺産「桑都物語」の構成文化財の１つである八王子芸妓が踊りを披露します。',
                contact: '八王子まつり実行委員会（(公財) 八王子市学園都市文化ふれあい財団コミュニティ振興課内）（TEL：042-686-0611）',
                image: '../images/8月/0801_八王子_八王子まつり「宵宮の舞」1.JPG',
                link: 'https://www.hachiojimatsuri.jp/'
            }],
            '2025-8-2': [{
                title: 'ほおずき会',
                type: 'event',
                time: '13:00開演',
                location: '浅草 雷５６５６会館 ときわホール（東京都台東区浅草3-6-1）',
                price: '観覧無料',
                description: '浅草、上野、隅田川界隈の邦楽愛好家の旦那衆と浅草芸者衆が芸を通じて親睦を深め、地域と花街の繁栄を目指して始まった催しです。日頃の稽古の成果をお楽しみください。',
                contact: 'ほおずき会（浅草観光連盟気付/TEL：03-2844-1221）',
                image: '../images/8月/0802_浅草_ほおずき会1.JPG',
                link: 'https://e-asakusa.jp/movies/106080'
            }, {
                title: '八王子まつり「俄山車巡行」',
                type: 'event',
                time: '17:20出発',
                location: '八王子 八王子三業組合 見番（東京都八王子市南町1-7）出発',
                price: '観覧無料',
                description: '八王子芸者衆が所属する中町の俄山車に乗って、唄や三味線を演奏しながら、手古舞姿の芸者衆を先導に街を巡行します。',
                contact: '八王子まつり実行委員会（(公財) 八王子市学園都市文化ふれあい財団コミュニティ振興課内）（TEL：042-686-0611）',
                image: '../images/8月/0802-03_八王子_八王子まつり「俄山車巡行」1.JPG',
                link: 'https://www.hachiojimatsuri.jp/'
            }],
            '2025-8-3': [{
                title: '八王子まつり「俄山車巡行」',
                type: 'event',
                time: '17:20出発',
                location: '八王子 八王子三業組合 見番（東京都八王子市南町1-7）出発',
                price: '観覧無料',
                description: '八王子芸者衆が所属する中町の俄山車に乗って、唄や三味線を演奏しながら、手古舞姿の芸者衆を先導に街を巡行します。',
                contact: '八王子まつり実行委員会（(公財) 八王子市学園都市文化ふれあい財団コミュニティ振興課内）（TEL：042-686-0611）',
                image: '../images/8月/0802-03_八王子_八王子まつり「俄山車巡行」1.JPG',
                link: 'https://www.hachiojimatsuri.jp/'
            }],
            '2025-8-9': [{
                title: '「さかのうえの大宴会」夏の果てまで盛夏の大宴会！！',
                type: 'event',
                time: '18:00～21:30',
                location: '渋谷 つくね侍 さかのうえ（東京都渋谷区円山町２０－１ 新大宗丸山ビル１階）',
                price: '13,000円（お食事お飲み物付き）',
                description: '古民家風のしつらえで、様々な芸能とともに円山芸者衆の芸をご堪能いただきます。',
                contact: 'つくね侍 さかのうえ（TEL：03-6809-0450）',
                image: '../images/8月/0809_渋谷円山町.JPG',
                link: 'https://tsukunesamurai-sakanoue.owst.jp/blogs/3438657'
            }],
            '2025-8-23': [{
                title: '浅草花街・ビア座敷',
                type: 'event',
                time: '16:00～18:00',
                location: '浅草 浅草ビューホテル アネックス 六区（東京都台東区浅草2丁目9-10）',
                price: '20,000円（フリードリンク・オードブル付き）',
                description: '浴衣姿の浅草芸者衆と幇間衆とご一緒に、ビールとともに暑い夏を乗り切るひとときをお過ごしください。',
                contact: '東京浅草組合 浅草見番（TEL：03-3874-3131）',
                image: '../images/8月/0823_浅草_ビア座敷ANNEX1.JPG',
                link: 'https://asakusakenban.com/information/'
            }],
            '2025-9-6': [{
                title: '夕涼みビア処in見番',
                type: 'event',
                time: '17:00～19:00',
                location: '八王子 八王子三業組合 見番（東京都八王子市南町1-7）',
                price: '15,000円（フリードリンク・お弁当付き）',
                description: '八王子芸者衆総出で、お酒やおいしいお弁当、お座敷遊びなど楽しいひとときをお届けします。',
                contact: '八王子三業組合 見番（TEL：042-622-5191）',
                image: '../images/9月/0906_八王子_ビア処in見番1.jpeg',
                link: '#'
            }],
            '2025-9-13': [{
                title: '成田伝統芸能まつり 秋の陣',
                type: 'event',
                time: '14:00～',
                location: '赤坂 成田市文化芸術センター なごみの米屋 スカイタウンホール（千葉県成田市花崎町 828-11 スカイタウン成田）',
                price: '観賞無料',
                description: '「歌舞伎のまち成田」の地にて、赤坂芸者衆が踊りを披露します。',
                contact: '成田伝統芸能まつり実行委員会（成田市観光プロモーション課内）（TEL：0476-20-1540）',
                image: '../images/9月/0913_赤坂_成田伝統芸能まつり1.JPG',
                link: 'https://www.nrtk.jp/enjoy/shikisaisai/traditional-performing-arts.html'
            }],
            '2025-9-15': [{
                title: '牛嶋神社例大祭',
                type: 'event',
                time: '12:00～',
                location: '向嶋 牛嶋神社（東京都墨田区向島1-4-5）',
                price: '観覧無料',
                description: '5年に一度の大祭にて、向嶋芸者衆が手古舞を奉納します。',
                contact: '牛嶋神社（TEL：03-3622-0973）',
                image: '../images/9月/0915_向嶋_牛嶋神社例大祭1.jpg',
                link: 'https://visit-sumida.jp/event/ushijimajinjya_taisai091417/'
            }],
            '2025-9-19': [{
                title: '夕涼みビア処in見番',
                type: 'event',
                time: '18:00～20:00',
                location: '八王子 八王子三業組合 見番（東京都八王子市南町1-7）',
                price: '15,000円（フリードリンク・お弁当付き）',
                description: '八王子芸者衆総出で、お酒やおいしいお弁当、お座敷遊びなど楽しいひとときをお届けします。',
                contact: '八王子三業組合 見番（TEL：042-622-5191）',
                image: '../images/9月/0919_八王子_ビア処in見番1.jpeg',
                link: '#'
            }],
            '2025-9-21': [{
                title: '赤坂氷川祭',
                type: 'event',
                time: '10:00～氷川神社出発',
                location: '赤坂 赤坂氷川神社出発',
                price: '観覧無料',
                description: '豪華絢爛な山車や神輿が渡御する神幸祭にて、赤坂芸者衆がともに赤坂の街を練り歩きます。',
                contact: '赤坂氷川神社（TEL：03-3583-1935）',
                image: '../images/9月/0921_赤坂_赤坂氷川祭8.JPG',
                link: 'https://www.akasakahikawa.or.jp/hikawasai-r07/'
            }],
            '2025-10-4': [{
                title: '「さかのうえの大宴会」さかのうえの大宴会',
                type: 'event',
                time: '18:00～21:30',
                location: '渋谷 つくね侍 さかのうえ（東京都渋谷区円山町２０－１ 新大宗丸山ビル１階）',
                price: '13,000円（お食事お飲み物付き）',
                description: '古民家風のしつらえで、様々な芸能とともに円山芸者衆の芸をご堪能いただきます。',
                contact: 'つくね侍 さかのうえ（TEL：03-6809-0450）',
                image: '../images/10月/1004_渋谷円山町.JPG',
                link: 'https://tsukunesamurai-sakanoue.owst.jp/blogs/3438657'
            }],
            '2025-10-5': [{
                title: '浅草おどり',
                type: 'event',
                time: '第一部：13時/第二部：16時',
                location: '浅草 台東区生涯学習センター ミレニアムホール（台東区西浅草3-25-16）',
                price: '6,000円',
                description: '江戸情緒が残る花街・浅草にて、浅草芸者衆や幇間衆が伝承してきた芸をお楽しみいただきます。',
                contact: '浅草おどり公演事務局（TEL：03-3874-3131）',
                image: '../images/10月/1005_浅草_浅草おどり3.JPG',
                link: 'https://asakusakenban.com/odori/'
            }, {
                title: 'すみだまつり',
                type: 'event',
                time: '16:15～17:00',
                location: '向嶋 ひがしんアリーナ（墨田区総合体育館）（東京都墨田区錦糸4-15-1）',
                price: '観覧無料',
                description: '向嶋芸者衆が四季折々の踊りを披露します。',
                contact: 'すみだまつり実行委員会（墨田区役所文化芸術振興課内）（TEL：03-5608-6181）',
                image: '../images/10月/1005_向嶋_すみだまつり.JPG',
                link: 'https://sumidamatsuri.com/'
            }],
            '2025-11-5': [{
                title: '「渋谷和芸の会―面―」',
                type: 'event',
                time: '18:00開宴（17:30開場）',
                location: '渋谷 料亭 三長（東京都渋谷区円山町6-1）',
                price: '22,000円（お食事・お飲み物代含む）',
                description: '渋谷に残る花街・円山町の芸者衆の芸とともに、花柳寿世晶による日本舞踊と、清元國惠太・清元志一朗師をお迎えして、和芸を身近にお楽しみいただくひとときをお届けします。',
                contact: '渋谷和芸 運営事務局（TEL：090-3232-1943）',
                image: '../images/11月/1105_渋谷円山町.JPG',
                link: 'https://shibuya-wagei.com/'
            }],
            '2025-11-9': [{
                title: '第二回 札幌をどり',
                type: 'event',
                time: '15:00開演（14:30開場）',
                location: '赤坂 札幌市教育文化会館 大ホール（北海道札幌市中央区北1条西13丁目）',
                price: 'S席：10,000円/A席：7,000円',
                description: 'さっぽろ名妓連の芸者衆の会に、東京・赤坂から育子と、京都・祇園甲部の芸妓・舞妓が賛助出演いたします。',
                contact: 'さっぽろ名妓連事務所（TEL：070-4385-4397）',
                image: '../images/11月/1109_赤坂_札幌をどり3.JPG',
                link: 'https://www.kyobun.org/event_schedule.html?id=11095'
            }],
            '2025-11-14': [{
                title: '水穂会',
                type: 'event',
                time: '15:30開演（15:00開場）',
                location: '神楽坂 四谷区民ホール9階（東京都新宿区内藤町87）',
                price: '1階席：4,000円（指定席）/2階席：2,000円（自由席）',
                description: '「水穂会」は、「舞踊勉強会 花みずか会」を前身とした神楽坂芸者衆による、日頃の稽古の成果を披露する秋の公演です。（※演目は14日(金)と15日(土)で内容が異なります）',
                contact: '東京神楽坂組合 見番事務所（TEL：03-3260-3291）',
                image: '../images/11月/1114-15_神楽坂_水穂会.jpeg',
                link: 'tel:03-3260-3291'
            }],
            '2025-11-15': [{
                title: '水穂会',
                type: 'event',
                time: '15:30開演（15:00開場）',
                location: '神楽坂 四谷区民ホール9階（東京都新宿区内藤町87）',
                price: '1階席：4,000円（指定席）/2階席：2,000円（自由席）',
                description: '「水穂会」は、「舞踊勉強会 花みずか会」を前身とした神楽坂芸者衆による、日頃の稽古の成果を披露する秋の公演です。（※演目は14日(金)と15日(土)で内容が異なります）',
                contact: '東京神楽坂組合 見番事務所（TEL：03-3260-3291）',
                image: '../images/11月/1114-15_神楽坂_水穂会.jpeg',
                link: 'tel:03-3260-3291'
            }],
            '2025-11-21': [{
                title: '三人会（赤坂 育子・新橋 加津代・先斗町 市園）',
                type: 'event',
                time: '1回目：13:00開演/2回目：16:30開演（開場は各回30分前）',
                location: '赤坂・新橋 日本製鉄紀尾井ホール 小ホール（東京都千代田区紀尾井町6-5）',
                price: '10,000円（全席指定）',
                description: '赤坂 育子、新橋 加津代、先斗町 市園 による「三人会」です。',
                contact: '日本製鉄紀尾井ホール（TEL：03-5276-4500）',
                image: '../images/11月/1121_赤坂・新橋・先斗町_三人会1.JPG',
                link: 'https://kioihall.jp/'
            }],
            '2025-11-29': [{
                title: '向嶋をどり',
                type: 'event',
                time: '第一部：12:00開演/第二部：15:00開演（※第一部、第二部同じ演目）',
                location: '向嶋 曳舟文化センター（東京都墨田区京島1-38-11）',
                price: '指定席6,000円/自由席5,000円',
                description: '日頃のお稽古の成果を、向嶋ならではの演目とともにお届けします。',
                contact: '向嶋墨堤組合（TEL：03-3623-6368）',
                image: '../images/11月/1129_向嶋_向嶋をどり3.JPG',
                link: 'tel:03-3623-6368'
            }],
            '2025-11-30': [{
                title: '伊東旧見番 百二十周年記念公演',
                type: 'event',
                time: '14:00開演（13:30開場）',
                location: '赤坂 伊東市観光会館（静岡県伊東市和田1-16-1）',
                price: '5,000円（自由席）',
                description: '静岡・伊東の見番120周年を記念して、赤坂芸者衆が友情出演いたします。',
                contact: '伊東旧見番（TEL：0557-29-6607）',
                image: '../images/11月/1130_赤坂_伊東旧見番　百二十周年記念公演.JPG',
                link: 'https://www.facebook.com/p/%E4%BC%8A%E6%9D%B1%E8%8A%B8%E5%A6%93%E7%BD%AE%E5%B1%8B%E5%8D%94%E5%90%8C%E7%B5%84%E5%90%88-%E6%97%A7%E8%A6%8B%E7%95%AA-100057152092651/?locale=ja_JP'
            }],
            '2025-12-6': [{
                title: 'さかのうえの大宴会',
                type: 'event',
                time: '18:00～21:30',
                location: '渋谷 つくね侍 さかのうえ（東京都渋谷区円山町２０－１ 新大宗丸山ビル１階）',
                price: '13,000円（お食事お飲み物付き）',
                description: '古民家風のしつらえで、様々な芸能とともに円山芸者衆の芸をご堪能いただきます。',
                contact: 'つくね侍 さかのうえ（TEL：03-6809-0450）',
                image: '../images/11月/1105_渋谷円山町.JPG',
                link: 'https://tsukunesamurai-sakanoue.owst.jp/blogs/3438657'
            }],
            '2025-12-14': [{
                title: '年忘れ日本酒会',
                type: 'event',
                time: '16:00～',
                location: '浅草 浅草三業会館（浅草見番：東京都台東区浅草3-33-5）',
                price: '25,000円（軽食付き）',
                description: '八海山の美味しいお酒とおつまみを、浅草芸者衆と幇間衆とともにお楽しみください。',
                contact: '東京浅草組合 浅草見番（TEL：03-3874-3131）',
                image: '../images/12月/1214_浅草_年忘れ日本酒会.JPG',
                link: 'https://asakusakenban.com/information/'
            }],
            '2025-12-18': [{
                title: '伝統文化まつり おもてなし舞 浅草芸妓連',
                type: 'event',
                time: '11:20～11:40（10:30～浅草壱福小路のイベント本部テントにて整理券配布）',
                location: '浅草 伝統芸能ステージ（浅草壱福小路「大黒家別館4F」：東京都台東区浅草1-31-10）',
                price: '観覧無料（要整理券）',
                description: '羽子板市である「歳の市」に合わせて開催される伝統文化まつりで、浅草芸者衆が踊りを披露いたします。',
                contact: 'イベント事務局（（株）アド・インターフェース内）（TEL：03-5811-1929）',
                image: '../images/12月/1218_浅草_伝統文化まつり.JPG',
                link: 'http://www.asakusa-ichifuku.com/information/archive/flyer2023dentobunka.pdf'
            }]
        };
    }

    normalizeEventAssetPaths() {
        if (!this.events || typeof this.events !== 'object') return;

        const adjustPath = (path) => this.resolveAssetPath(path);

        Object.values(this.events).forEach(eventList => {
            if (!Array.isArray(eventList)) return;
            eventList.forEach(event => {
                if (!event || typeof event !== 'object') return;
                event.image = adjustPath(event.image);
            });
        });
    }

    resolveAssetPath(path) {
        if (!path) return path;
        if (/^(?:https?:|data:|mailto:|tel:|\/)/i.test(path)) {
            return path;
        }

        let normalized = String(path).replace(/\\/g, '/');

        if (this.isSubpage) {
            if (normalized.startsWith('../')) {
                return normalized;
            }
            if (normalized.startsWith('./')) {
                return normalized.substring(2);
            }
            return `../${normalized}`;
        }

        if (normalized.startsWith('../')) {
            normalized = normalized.replace(/^\.\.\//, '');
        } else if (normalized.startsWith('./')) {
            normalized = normalized.substring(2);
        }

        return normalized;
    }

    async loadExcelAndRender() {
        try {
            const excelEvents = await this.fetchExcelEvents();
            if (excelEvents && Object.keys(excelEvents).length > 0) {
                this.events = excelEvents;
                this.normalizeEventAssetPaths();
                this.renderCalendar();
            }
        } catch (e) {
            console.error('Excel読み込み失敗:', e);
        }
    }

    async fetchExcelEvents() {
        try {
            // XLSXライブラリを遅延読込
            const XLSX = await window.loadXLSXLibrary();

            const isSubpage = location.pathname.includes('/pages/');
            const excelPath = `${isSubpage ? '..' : '.'}/assets/全国花街ポータルサイト_東京_仮行事スケ_上半期_20250907.xlsx`;
            const url = encodeURI(excelPath);

            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const buf = await res.arrayBuffer();
            const wb = XLSX.read(buf, { type: 'array' });
            const sheet = wb.Sheets[wb.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

            const byDate = {};
            for (const row of rows) {
                const parsed = await this.parseExcelRowToEvent(row);
                if (!parsed) continue;
                const { dateKey, event } = parsed;
                if (!byDate[dateKey]) byDate[dateKey] = [];
                byDate[dateKey].push(event);
            }
            return byDate;
        } catch (error) {
            console.error('Excelファイルの読み込みに失敗しました:', error);
            return null;
        }
    }

    async parseExcelRowToEvent(row) {
        const get = (keys) => {
            for (const k of keys) {
                if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
                    return String(row[k]).trim();
                }
            }
            return '';
        };

        const dateRaw = get(['日付', '日時', '開催日', 'DATE', 'date']);
        const title = get(['タイトル', '件名', 'イベント名', '名称', 'title', '題名']);
        const locationName = get(['場所', '会場', 'エリア', '所在地', 'location']);
        const time = get(['時間', '開演', '開場', 'start', 'time']);
        const price = get(['料金', '価格', '金額', 'price']);
        const description = get(['説明', '概要', '詳細', 'description', '解説']);
        const typeRaw = get(['種別', 'カテゴリ', '分類', 'type', 'カテゴリ1']);
        const image = get(['画像', 'image', 'サムネイル']);
        const idRaw = get(['ID', 'id', 'イベントID']);

        // 日付処理
        let date;
        if (dateRaw instanceof Date) {
            date = dateRaw;
        } else if (dateRaw) {
            // Excelシリアル対応
            if (!isNaN(Number(dateRaw))) {
                try {
                    const XLSX = await window.loadXLSXLibrary();
                    const parsed = XLSX.SSF.parse_date_code(Number(dateRaw));
                    if (parsed) date = new Date(parsed.y, parsed.m - 1, parsed.d);
                } catch (error) {
                    console.warn('XLSXライブラリの読み込みに失敗しました:', error);
                }
            }
            if (!date && !isNaN(Date.parse(dateRaw))) {
                date = new Date(dateRaw);
            }
        }
        if (!(date instanceof Date) || isNaN(date.getTime())) return null;

        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const dateKey = `${y}-${m}-${d}`;

        const type = this.normalizeEventType(typeRaw);
        const eventId = this.generateEventId({ idRaw, title, year: y, month: m, day: d });

        const detailBase = location.pathname.includes('/pages/') ? 'event-detail.html' : 'pages/event-detail.html';
        const detailUrl = `${detailBase}?id=${encodeURIComponent(eventId)}`;

        const event = {
            id: eventId,
            title: title || `${y}/${m}/${d} イベント`,
            type,
            time: time || '',
            location: locationName || '',
            price: price || '',
            description: description || '',
            image: this.resolveAssetPath(image || 'images/1.jpg'),
            detailUrl
        };

        return { dateKey, event };
    }

    normalizeEventType(tRaw) {
        const t = String(tRaw || '').toLowerCase();
        if (t.includes('公演') || t.includes('performance')) return 'performance';
        if (t.includes('体験') || t.includes('workshop') || t.includes('experience')) return 'experience';
        return 'event';
    }

    generateEventId({ idRaw, title, year, month, day }) {
        if (idRaw) return String(idRaw);
        const base = `${year}-${month}-${day}-${title}`.toLowerCase();
        return base
            .replace(/\s+/g, '-')
            .replace(/[\u3000]/g, '-')
            .replace(/[^a-z0-9\-ぁ-んァ-ン一-龯]/g, '')
            .slice(0, 96);
    }

    renderCalendar() {
        if (!this.monthElement || !this.yearElement) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month and year display
        const monthNames = [
            '1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'
        ];
        this.monthElement.textContent = monthNames[month];
        this.yearElement.textContent = year.toString();

        // Clear existing calendar days (except weekdays)
        const existingDays = this.calendarGrid.querySelectorAll('.calendar-day');
        existingDays.forEach(day => day.remove());

        // Generate calendar days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();

        // Add previous month's trailing days
        const prevMonth = new Date(year, month - 1, 0);
        const prevMonthDays = prevMonth.getDate();
        
        for (let i = startDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            const dayElement = this.createDayElement(day, 'prev-month');
            this.calendarGrid.appendChild(dayElement);
        }

        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = this.createDayElement(day, 'current-month', year, month);
            this.calendarGrid.appendChild(dayElement);
        }

        // Add next month's leading days
        const totalCells = this.calendarGrid.children.length - 7; // Subtract weekday headers
        const remainingCells = 42 - totalCells; // 6 rows × 7 days
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(day, 'next-month');
            this.calendarGrid.appendChild(dayElement);
        }
    }

    createDayElement(day, monthType, year = null, month = null) {
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${monthType}`;
        
        // 日付数字を別要素として追加
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);

        if (monthType === 'current-month') {
            // Check if this is today
            if (year === this.today.getFullYear() && 
                month === this.today.getMonth() && 
                day === this.today.getDate()) {
                dayElement.classList.add('today');
            }

            // Check for events
            const dateString = `${year}-${month + 1}-${day}`;
            const events = this.events[dateString];
            
            if (events && events.length > 0) {
                dayElement.classList.add('has-event');
                dayElement.dataset.event = events[0].title;
                
                // イベント種類による背景色分け
                const eventType = events[0].type;
                if (eventType === 'traditional') {
                    dayElement.classList.add('event-type-traditional');
                } else if (eventType === 'modern') {
                    dayElement.classList.add('event-type-modern');
                } else if (eventType === 'festival') {
                    dayElement.classList.add('event-type-festival');
                } else if (eventType === 'ceremony') {
                    dayElement.classList.add('event-type-ceremony');
                } else if (eventType === 'performance') {
                    dayElement.classList.add('event-type-performance');
                }

                // イベント名（先頭1件＋「ほかN件」）を表示
                const titleElement = document.createElement('div');
                titleElement.className = 'event-title';
                const extraCount = events.length > 1 ? ` ほか${events.length - 1}件` : '';
                titleElement.textContent = `${events[0].title}${extraCount}`;
                titleElement.title = events.map(ev => ev.title).join(' / ');
                dayElement.appendChild(titleElement);

                // クリックで詳細へ遷移（Excel連携時）。フォールバックはモーダル表示
                dayElement.addEventListener('click', () => {
                    if (events[0].detailUrl) {
                        window.location.href = events[0].detailUrl;
                    } else {
                        this.showEventModal(events, dateString);
                    }
                });
                
                dayElement.style.cursor = 'pointer';
            }
        }

        return dayElement;
    }

    showEventModal(events, dateString) {
        if (!this.modal || !events || events.length === 0) return;

        const modalTitle = document.getElementById('modal-title');
        const modalDate = document.getElementById('modal-date');
        const modalEventsList = document.getElementById('modal-events-list');

        // モーダルタイトルと日付を設定
        if (modalTitle) {
            modalTitle.textContent = events.length === 1 ? 'イベント詳細' : `${events.length}件のイベント`;
        }
        
        if (modalDate) {
            modalDate.textContent = this.formatDate(dateString);
        }

        // イベントリストを生成
        if (modalEventsList) {
            modalEventsList.innerHTML = events.map((event, index) => `
                <div class="modal-event-item">
                    <div class="modal-event-header">
                        <div class="modal-event-tags">
                            ${this.getEventTags(event).map(tag => 
                                `<div class="modal-event-tag ${tag.class}">${tag.name}</div>`
                            ).join('')}
                        </div>
                        <h4 class="modal-event-title">${event.title}</h4>
                    </div>
                    <div class="modal-event-content">
                        ${event.image ? `
                        <div class="modal-event-image">
                            <img src="${event.image}" alt="${event.title}" loading="lazy">
                        </div>
                        ` : `
                        <div class="modal-event-image placeholder-gray">
                            <div class="placeholder-text">画像準備中</div>
                        </div>
                        `}
                        <div class="modal-event-details">
                            <div class="modal-detail-item">
                                <div class="modal-detail-icon">🕐</div>
                                <div class="modal-detail-content">
                                    <div class="modal-detail-label">開催時間</div>
                                    <div class="modal-detail-value">${event.time}</div>
                                </div>
                            </div>
                            <div class="modal-detail-item">
                                <div class="modal-detail-icon">📍</div>
                                <div class="modal-detail-content">
                                    <div class="modal-detail-label">開催場所</div>
                                    <div class="modal-detail-value">${event.location}</div>
                                </div>
                            </div>
                            ${event.price ? `
                            <div class="modal-detail-item">
                                <div class="modal-detail-icon">💴</div>
                                <div class="modal-detail-content">
                                    <div class="modal-detail-label">参加費用</div>
                                    <div class="modal-detail-value">${event.price}</div>
                                </div>
                            </div>` : ''}
                            ${event.description ? `
                            <div class="modal-detail-item">
                                <div class="modal-detail-icon">📝</div>
                                <div class="modal-detail-content">
                                    <div class="modal-detail-label">詳細</div>
                                    <div class="modal-detail-value">${event.description}</div>
                                </div>
                            </div>` : ''}
                            ${event.contact ? `
                            <div class="modal-detail-item">
                                <div class="modal-detail-icon">📞</div>
                                <div class="modal-detail-content">
                                    <div class="modal-detail-label">お問い合わせ</div>
                                    <div class="modal-detail-value">${event.contact}</div>
                                </div>
                            </div>` : ''}
                            ${event.link ? `
                            <div class="modal-detail-item">
                                <div class="modal-detail-icon">🔗</div>
                                <div class="modal-detail-content">
                                    <div class="modal-detail-label">詳細情報</div>
                                    <div class="modal-detail-value">
                                        <a href="${event.link}" target="_blank" rel="noopener noreferrer">公式サイトで詳細を見る</a>
                                    </div>
                                </div>
                            </div>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // モバイルでのスクロール位置をリセット
        const modalContent = this.modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }

        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // アクセシビリティ改善
        this.modal.setAttribute('aria-hidden', 'false');
        const closeButton = this.modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.focus();
        }
    }

    getEventTags(event) {
        // イベントの場所からタグとクラスのペアを生成（複数タグ対応）
        const tagMap = {
            '葭町': 'tag-yoshicho',
            '新橋': 'tag-shinbashi',
            '赤坂': 'tag-akasaka',
            '神楽坂': 'tag-kagurazaka',
            '浅草': 'tag-asakusa',
            '向嶋': 'tag-mukojima',
            '八王子': 'tag-hachioji',
            '渋谷': 'tag-shibuya'
        };
        
        const tags = [];
        for (const [tagName, tagClass] of Object.entries(tagMap)) {
            if (event.location.includes(tagName)) {
                tags.push({ name: tagName, class: tagClass });
            }
        }
        
        console.log('Event location:', event.location, 'Tags:', tags);
        return tags.length > 0 ? tags : [{ name: '花街', class: '' }];
    }

    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
            
            // アクセシビリティ改善
            this.modal.setAttribute('aria-hidden', 'true');
        }
    }

    formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${year}年${month}月${day}日`;
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    setupFilters() {
        if (!this.filterButtons.length) return;

        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active filter
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Get filter value
                const filter = button.dataset.filter;
                this.applyFilter(filter);
            });
        });
    }

    applyFilter(filter) {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
            const category = item.dataset.category;
            
            if (filter === 'all' || category === filter) {
                item.style.display = '';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                // Animate in
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                // Animate out
                item.style.opacity = '0';
                item.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const emailInput = e.target.querySelector('input[type="email"]');
        const submitButton = e.target.querySelector('button[type="submit"]');
        
        if (!emailInput || !emailInput.value) return;

        // Show loading state
        const originalText = submitButton.textContent;
        submitButton.textContent = '登録中...';
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Show success message
            if (window.kagaiPortal) {
                window.kagaiPortal.showNotification(
                    'ニュースレターの登録が完了しました。ありがとうございます！',
                    'success'
                );
            }
            
            // Reset form
            emailInput.value = '';
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    }

    // Public API methods
    goToMonth(year, month) {
        this.currentDate = new Date(year, month - 1);
        this.renderCalendar();
    }

    addEvent(dateString, event) {
        if (!this.events[dateString]) {
            this.events[dateString] = [];
        }
        this.events[dateString].push(event);
        this.renderCalendar();
    }

    getEventsForDate(dateString) {
        return this.events[dateString] || [];
    }
}

// Additional utility functions for calendar
function getJapaneseMonthName(monthIndex) {
    const months = [
        '1月', '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月'
    ];
    return months[monthIndex];
}

function getJapaneseDayName(dayIndex) {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[dayIndex];
}

function formatJapaneseDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

// Initialize calendar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the news page
    if (document.querySelector('.calendar-container')) {
        window.eventCalendar = new EventCalendar();
    }
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventCalendar;
}
