/**
 * Events Data Loader
 * 全国花街ポータルサイト_東京_仮行事スケ_上半期_20250907.xlsxからイベントデータを読み込み
 */

class EventsDataLoader {
  constructor() {
    this.xlsxPath = '../assets/全国花街ポータルサイト_東京_仮行事スケ_上半期_20250907.xlsx';
    this.eventsData = [];
    this.monthlyData = [];
  }

  async init() {
    try {
      await this.loadExcelData();
      this.renderTimeline();
      this.renderMonthlyEvents();
      this.renderCalendar();
    } catch (error) {
      console.error('イベントデータの読み込みに失敗しました:', error);
      this.showFallbackData();
    }
  }

  async loadExcelData() {
    // SheetJSを使用してExcelファイルを読み込み
    const response = await fetch(this.xlsxPath);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    
    // 最初のシートを読み込み
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    this.processEventData(jsonData);
  }

  processEventData(rawData) {
    // Excelデータを整形してイベント情報に変換
    this.eventsData = rawData.map((row, index) => ({
      id: index + 1,
      date: this.parseDate(row['日程'] || row['開催日']),
      title: row['行事名'] || row['イベント名'] || 'イベント',
      description: row['内容'] || row['詳細'] || '詳細は後日お知らせいたします。',
      location: this.getLocation(row['場所'] || row['会場']),
      time: row['時間'] || '詳細は主催者にお問い合わせください',
      price: row['料金'] || row['参加費'] || '未定',
      category: this.getCategory(row['種別'] || row['カテゴリ']),
      image: `../images/${(index % 4) + 1}.jpg`
    })).filter(event => event.date && event.title);

    // 月間データを生成
    this.generateMonthlyData();
  }

  parseDate(dateStr) {
    if (!dateStr) return null;
    
    // 様々な日付フォーマットに対応
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      // 日本語形式の日付を処理
      const match = String(dateStr).match(/(\d{1,2})[月\/](\d{1,2})/);
      if (match) {
        const month = parseInt(match[1]);
        const day = parseInt(match[2]);
        return new Date(2025, month - 1, day);
      }
      return null;
    }
    return date;
  }

  getLocation(locationStr) {
    if (!locationStr) return '東京都内花街';
    
    // 場所情報を整形
    const locations = {
      '新橋': '東京・新橋',
      '赤坂': '東京・赤坂',
      '芳町': '東京・芳町',
      '向嶋': '東京・向嶋'
    };
    
    for (const [key, value] of Object.entries(locations)) {
      if (String(locationStr).includes(key)) {
        return value;
      }
    }
    
    return String(locationStr).includes('東京') ? locationStr : `東京・${locationStr}`;
  }

  getCategory(categoryStr) {
    if (!categoryStr) return 'event';
    
    const categories = {
      '公演': 'performance',
      '体験': 'experience',
      'お知らせ': 'news',
      'イベント': 'event'
    };
    
    for (const [key, value] of Object.entries(categories)) {
      if (String(categoryStr).includes(key)) {
        return value;
      }
    }
    
    return 'event';
  }

  generateMonthlyData() {
    const monthlyEvents = {};
    
    this.eventsData.forEach(event => {
      if (!event.date) return;
      
      const month = event.date.getMonth() + 1;
      if (!monthlyEvents[month]) {
        monthlyEvents[month] = [];
      }
      monthlyEvents[month].push(event);
    });

    this.monthlyData = Object.keys(monthlyEvents).map(month => {
      const monthNum = parseInt(month);
      const events = monthlyEvents[month];
      
      return {
        month: monthNum,
        monthName: `${monthNum}月`,
        theme: this.getMonthTheme(monthNum),
        events: events.slice(0, 3), // 主要イベント3つまで
        seasonDescription: this.getSeasonDescription(monthNum)
      };
    }).sort((a, b) => a.month - b.month);
  }

  getMonthTheme(month) {
    const themes = {
      1: '新春の始まり',
      2: '梅の季節',
      3: '春の訪れ',
      4: '桜満開',
      5: '新緑の季節',
      6: '初夏の風情'
    };
    return themes[month] || '花街の四季';
  }

  getSeasonDescription(month) {
    const descriptions = {
      1: '新年を祝う華やかな行事が多く開催される季節です。伝統的な新春の舞踊や茶事をお楽しみください。',
      2: '早春の梅をテーマにした優美な公演が特徴的な時期です。寒い中にも春の兆しを感じる演目をご堪能ください。',
      3: '桜の開花とともに春らしい演目が増える季節です。新人芸者のお披露目なども行われる華やかな時期です。',
      4: '桜が満開となり、最も華やかで美しい季節を迎えます。花見と合わせた特別な公演も開催されます。',
      5: '新緑が美しく、爽やかな初夏の演目が楽しめる季節です。端午の節句にちなんだ伝統行事も行われます。',
      6: '初夏の風情を楽しむ涼やかな演目が特徴の季節です。暑さを和らげる涼しげな舞踊をお楽しみください。'
    };
    return descriptions[month] || '季節の移ろいとともに変化する花街の魅力をお楽しみください。';
  }

  renderTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    if (this.eventsData.length === 0) {
      this.showFallbackTimeline(container);
      return;
    }

    // 日付順にソート
    const sortedEvents = [...this.eventsData]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6); // 最新6件

    const timelineHTML = sortedEvents.map(event => this.createTimelineItem(event)).join('');
    container.innerHTML = timelineHTML;
  }

  createTimelineItem(event) {
    const date = new Date(event.date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const categoryLabels = {
      'event': 'イベント',
      'performance': '公演',
      'experience': '体験',
      'news': 'お知らせ'
    };

    return `
      <article class="timeline-item" data-category="${event.category}">
        <div class="timeline-date">
          <span class="date-day">${day}</span>
          <span class="date-month">${month}月</span>
          <span class="date-year">${year}</span>
        </div>
        <div class="timeline-content">
          <div class="timeline-badge ${event.category}">${categoryLabels[event.category] || 'イベント'}</div>
          <h3 class="timeline-title">${event.title}</h3>
          <p class="timeline-description">${event.description}</p>
          <div class="timeline-meta">
            <span class="meta-location">📍 ${event.location}</span>
            <span class="meta-time">🕐 ${event.time}</span>
            ${event.price !== '未定' ? `<span class="meta-price">💴 ${event.price}</span>` : ''}
          </div>
          <a href="#event-${event.id}" class="timeline-link">詳細を見る</a>
        </div>
        <div class="timeline-image">
          <img src="${event.image}" alt="${event.title}">
        </div>
      </article>
    `;
  }

  renderMonthlyEvents() {
    const container = document.getElementById('monthly-container');
    if (!container) return;

    if (this.monthlyData.length === 0) {
      this.showFallbackMonthly(container);
      return;
    }

    const monthlyHTML = this.monthlyData.slice(0, 3).map(month => this.createMonthlyCard(month)).join('');
    container.innerHTML = monthlyHTML;
  }

  createMonthlyCard(monthData) {
    const eventsList = monthData.events.map(event => `<li>${event.title}（${event.date.getDate()}日）</li>`).join('');

    return `
      <div class="monthly-card">
        <div class="monthly-header">
          <h3 class="monthly-month">${monthData.monthName}</h3>
          <p class="monthly-theme">${monthData.theme}</p>
        </div>
        <div class="monthly-content">
          <div class="monthly-highlight">
            <h4>注目イベント</h4>
            <ul>
              ${eventsList || '<li>準備中</li>'}
            </ul>
          </div>
          <div class="monthly-season">
            <h4>季節の特色</h4>
            <p>${monthData.seasonDescription}</p>
          </div>
        </div>
      </div>
    `;
  }

  renderCalendar() {
    // カレンダーにイベント情報をマッピング
    const calendarDays = document.querySelectorAll('.calendar-day');
    
    this.eventsData.forEach(event => {
      if (!event.date) return;
      
      const day = event.date.getDate();
      const month = event.date.getMonth() + 1;
      
      // 現在表示中の月と一致するイベントのみ
      if (month === 3) { // 3月のカレンダーを表示している場合
        const dayElement = Array.from(calendarDays).find(el => 
          parseInt(el.textContent) === day && !el.classList.contains('prev-month') && !el.classList.contains('next-month')
        );
        
        if (dayElement) {
          dayElement.classList.add('has-event');
          dayElement.setAttribute('data-event', event.title);
        }
      }
    });
  }

  showFallbackData() {
    this.showFallbackTimeline(document.getElementById('timeline-container'));
    this.showFallbackMonthly(document.getElementById('monthly-container'));
  }

  showFallbackTimeline(container) {
    if (!container) return;
    
    // フォールバック用のイベントデータ
    const fallbackEvents = [
      {
        id: 1,
        date: new Date(2025, 1, 2), // 2月2日
        title: '浅草観音文化芸能人節分会',
        description: '浅草芸者衆が浅草寺境内より豆まきを行います。',
        location: '浅草寺本堂 東側特設舞台',
        time: '14:30～17:15（芸者衆による豆まきは17:00～）',
        price: '観覧無料',
        category: 'event',
        image: '../images/2月/0202_浅草_節分1.JPG',
        contact: '浅草観光連盟（TEL：03-3844-1221）',
        link: 'https://e-asakusa.jp/'
      },
      {
        id: 2,
        date: new Date(2025, 1, 2), // 2月2日
        title: '高尾山節分会追儺式',
        description: '八王子芸妓衆が境内より豆まきを行います。',
        location: '高尾山薬王院 境内（東京都八王子市高尾町2177）',
        time: '9:00/10:30/12:00/13:30/14:30(各回異なる芸妓衆が修行予定)',
        price: '観覧無料',
        category: 'event',
        image: null, // グレーのダミー画像
        contact: '高尾山薬王院（TEL：０４２-６６１-１１１５）',
        link: 'https://takaosan.or.jp/setsubun/'
      },
      {
        id: 3,
        date: new Date(2025, 1, 3), // 2月3日
        title: '節分豆まき式',
        description: '毘沙門様の愛称で地元の人々に親しまれる善國寺にて芸者衆が豆まきを行います。',
        location: '善國寺 境内（東京都新宿区神楽坂5-36）',
        time: '15:00～',
        price: '観覧無料',
        category: 'event',
        image: '../images/2月/0202_神楽坂_節分1.JPG',
        contact: '善國寺（TEL：03-3269-0641）',
        link: 'https://kagurazaka-bishamonten.com/event/'
      },
      {
        id: 4,
        date: new Date(2025, 1, 9), // 2月9日
        title: '「さかのうえの大宴会」節分お化け',
        description: '古民家風のしつらえで、様々な芸能とともに円山芸者衆の芸をご堪能いただきます。',
        location: 'つくね侍 さかのうえ（東京都渋谷区円山町２０－１ 新大宗丸山ビル１階）',
        time: '18:00～21:30',
        price: '15,000円（お食事お飲み物付き）',
        category: 'event',
        image: '../images/2月/0209_渋谷円山町_節分1.jpeg',
        contact: 'つくね侍 さかのうえ（TEL：03-6809-0450）',
        link: 'https://tsukunesamurai-sakanoue.owst.jp/blogs/3431914'
      },
      {
        id: 5,
        date: new Date(2025, 1, 15), // 2月15日
        title: 'かぐら坂への誘い',
        description: '「特製懐石弁当」をお召上がりいただきながら、神楽坂芸者衆の踊りをお楽しみいただきます。',
        location: '神楽坂 東京大神宮内 マツヤサロン（東京都千代田区富士見2-4-1）',
        time: '第一部：12:00～/15:30（各回、開場は３０分前・所要時間約1時間30分予定/演目は両回同様）',
        price: '22,000円（全席指定・御飲食料込）',
        category: 'event',
        image: '../images/2月/0215_神楽坂_かぐら坂への誘い.JPG',
        contact: '東京神楽坂組合 見番事務所（TEL：03-3260-3291）',
        link: 'https://kagurazaka-kumiai.com/news/192/'
      },
      {
        id: 6,
        date: new Date(2025, 2, 22), // 3月22日
        title: '「Tokyo Creative Salon 2025」AKASAKA GEISHA PARADE',
        description: '赤坂芸者衆と赤坂24町会の方々が、赤坂の街を練り歩きます。',
        location: '赤坂一ツ木通り、エスプラナード赤坂、みすじ通り、赤坂通り（東京都港区赤坂）',
        time: '12:00～（約１時間予定）',
        price: '観覧無料',
        category: 'event',
        image: '../images/3月/0322_赤坂_TCS_1.JPG',
        contact: 'TBS（TEL：03-3746-1111）',
        link: 'https://www.tbs.co.jp/tcs-akasaka/#geisha'
      },
      {
        id: 7,
        date: new Date(2025, 2, 27), // 3月27日
        title: '墨堤さくらまつり「芸妓茶屋」',
        description: '隅田公園に期間限定で「芸妓茶屋」を設置。お団子等をご購入いただきますと、お席まで芸者衆がお運びします。',
        location: '向嶋 桜橋デッキスクエア（東京都墨田区向島5-1-1）',
        time: '平日11:30～15:30/土日11:30～16:00（雨天強風は中止）',
        price: '茶屋の飲食は有料',
        category: 'event',
        image: '../images/3月/0327-0406_向嶋_芸妓茶屋_1.JPG',
        contact: '墨田区観光協会（TEL：03-6657-5160）',
        link: 'https://visit-sumida.jp/event/sakuramatsuri2025/'
      },
      {
        id: 8,
        date: new Date(2025, 2, 30), // 3月30日
        title: '浅草花街「お花見会」',
        description: '浅草芸者衆と幇間衆が勢ぞろいし、お客様を春の味覚と踊りでおもてなしいたします。',
        location: '浅草 浅草ビューホテル3階【祥雲の間】（東京都台東区西浅草3-17-1）',
        time: '16:00～（15:30開場）',
        price: '27,500円（お食事・お飲み物付き）',
        category: 'event',
        image: '../images/3月/0330_浅草_花見の会_2.JPG',
        contact: '東京浅草組合 浅草見番（TEL：03-3874-3131）',
        link: 'https://asakusakenban.com/information/'
      },
      {
        id: 9,
        date: new Date(2025, 3, 12), // 4月12日
        title: '「さかのうえの大宴会」春爛漫さかのうえのお花見大宴会',
        description: '古民家風のしつらえで、様々な芸能とともに円山芸者衆の芸をご堪能いただきます。',
        location: '渋谷 つくね侍 さかのうえ（東京都渋谷区円山町２０－１ 新大宗丸山ビル１階）',
        time: '18:00～21:30',
        price: '13,000円（お食事お飲み物付き）',
        category: 'event',
        image: '../images/4月/0412_渋谷円山町.JPG',
        contact: 'つくね侍 さかのうえ（TEL：03-6809-0450）',
        link: 'https://tsukunesamurai-sakanoue.owst.jp/blogs/3436064'
      },
      {
        id: 10,
        date: new Date(2025, 3, 18), // 4月18日
        title: '第4回 八王子をどり',
        description: '2021年の開催から5年ぶりの開催、桑都に舞う艶姿をお楽しみください。',
        location: '八王子 いちょうホール 大ホール 八王子市芸術文化会館（八王子市本町24-1）',
        time: '〈昼の部〉13:00開演・〈夜の部〉17時開演（開場は各回1時間前）',
        price: '8,000円（全席指定、プログラム・イヤホンガイド付）',
        category: 'event',
        image: '../images/4月/0418-0419_八王子_八王子をどり2.jpeg',
        contact: 'いちょうホール（TEL：042-621-3001）',
        link: 'https://www.hachiojibunka.or.jp/icho/archives/eventinfo/10018/'
      },
      {
        id: 11,
        date: new Date(2025, 3, 19), // 4月19日
        title: '第4回 八王子をどり',
        description: '2021年の開催から5年ぶりの開催、桑都に舞う艶姿をお楽しみください。',
        location: '八王子 いちょうホール 大ホール 八王子市芸術文化会館（八王子市本町24-1）',
        time: '〈昼の部〉13:00開演・〈夜の部〉17時開演（開場は各回1時間前）',
        price: '8,000円（全席指定、プログラム・イヤホンガイド付）',
        category: 'event',
        image: '../images/4月/0418-0419_八王子_八王子をどり2.jpeg',
        contact: 'いちょうホール（TEL：042-621-3001）',
        link: 'https://www.hachiojibunka.or.jp/icho/archives/eventinfo/10018/'
      },
      {
        id: 12,
        date: new Date(2025, 3, 24), // 4月24日
        title: '第40回 特別公演 神楽坂をどり',
        description: '今回は「東急歌舞伎町タワー・THEATER MILANO-Za」に移し、特別公演として開催いたします。',
        location: '神楽坂 東急歌舞伎町タワー THEATER MILANO-Za（東京都新宿区歌舞伎町1-29-1）',
        time: '17：00開演（16：15開場）',
        price: '○○○○円※11月下旬発売開始予定',
        category: 'event',
        image: '../images/4月/0424-0425_神楽坂_神楽坂をどり1.JPG',
        contact: '東京神楽坂組合 見番事務所（TEL：03-3260-3291）',
        link: 'https://kagurazaka-kumiai.com/news/215/'
      },
      {
        id: 13,
        date: new Date(2025, 3, 25), // 4月25日
        title: '第40回 特別公演 神楽坂をどり',
        description: '今回は「東急歌舞伎町タワー・THEATER MILANO-Za」に移し、特別公演として開催いたします。',
        location: '神楽坂 東急歌舞伎町タワー THEATER MILANO-Za（東京都新宿区歌舞伎町1-29-1）',
        time: '12：30開演（11：45開場）・16：00開演（15：15開場）',
        price: '○○○○円※11月下旬発売開始予定',
        category: 'event',
        image: '../images/4月/0424-0425_神楽坂_神楽坂をどり1.JPG',
        contact: '東京神楽坂組合 見番事務所（TEL：03-3260-3291）',
        link: 'https://kagurazaka-kumiai.com/news/215/'
      },
      {
        id: 14,
        date: new Date(2025, 4, 16), // 5月16日
        title: '三社祭「大行列」',
        description: 'お囃子屋台・鳶頭木遣り・びんざさら舞・白鷺の舞とともに、浅草芸者衆・幇間衆が浅草の町を練り歩きます。',
        location: '浅草 【西廻り】柳通り→千束通り→ひさご通り→浅草六区→雷門通り→雷門→仲見世→浅草神社',
        time: '13:00浅草見番前出発（雨天中止）',
        price: '観覧無料',
        category: 'event',
        image: '../images/5月/0517_浅草_三社祭「大行列」1.JPG',
        contact: '浅草神社社々務所（TEL：03-3844-1575）',
        link: 'https://www.asakusajinja.jp/sanjamatsuri/schedule/index.html'
      },
      {
        id: 15,
        date: new Date(2025, 4, 17), // 5月17日
        title: '三社祭「くみ踊り鑑賞の集い」',
        description: '芸者衆が数人ずつ組になり踊るほか、幇間衆も出演する賑やかな会をお届けします。',
        location: '浅草 浅草三業会館（浅草見番：東京都台東区浅草3-33-5）',
        time: '13:00開演（12:30開場）',
        price: '5,500円（自由席・定員150名）',
        category: 'event',
        image: '../images/5月/0518_浅草_三社祭「くみ踊り鑑賞の集い」2.JPG',
        contact: '東京浅草組合（見番）（TEL：03-3874-3131）/カンフェティ（TEL：0120-240-540）',
        link: 'https://asakusakenban.com/information/'
      },
      {
        id: 16,
        date: new Date(2025, 4, 18), // 5月18日
        title: '三社祭「くみ踊り鑑賞の集い」',
        description: '芸者衆が数人ずつ組になり踊るほか、幇間衆も出演する賑やかな会をお届けします。',
        location: '浅草 浅草三業会館（浅草見番：東京都台東区浅草3-33-5）',
        time: '13:00開演（12:30開場）',
        price: '5,500円（自由席・定員150名）',
        category: 'event',
        image: '../images/5月/0518_浅草_三社祭「くみ踊り鑑賞の集い」2.JPG',
        contact: '東京浅草組合（見番）（TEL：03-3874-3131）/カンフェティ（TEL：0120-240-540）',
        link: 'https://asakusakenban.com/information/'
      },
      {
        id: 17,
        date: new Date(2025, 4, 18), // 5月18日
        title: '三社祭「奉納舞踊」',
        description: '浅草神社内の神楽殿にて、浅草芸者衆・幇間衆が踊りと幇間芸を奉納します。',
        location: '浅草 浅草神社内の神楽殿（東京都台東区浅草2-3-1）',
        time: '15:00～',
        price: '観覧無料',
        category: 'event',
        image: '../images/5月/0518_浅草_三社祭奉納踊り」1.jpeg',
        contact: '浅草神社社々務所（TEL：03-3844-1575）',
        link: 'https://www.asakusajinja.jp/sanjamatsuri/schedule/index.html'
      },
      {
        id: 18,
        date: new Date(2025, 4, 18), // 5月18日
        title: '華のおどり',
        description: '赤坂花街の伝統文化を継承する取り組みとして、赤坂芸者衆による踊「華のおどり」をお届けします。',
        location: '赤坂 きらぼし銀行本店8階（東京都港区南青山3-10-43）',
        time: '15:30～開演（15:00開場）',
        price: '観賞無料（※港区在住・在勤・在学者限定、事前申込・先着順/応募締め切り4/11）',
        category: 'event',
        image: '../images/5月/0518_赤坂_華のおどり3.JPG',
        contact: '㈱東京きらぼしフィナンシャルグループ事業戦略部（TEL：03-6447-5891）',
        link: 'https://dp700d203kaax.cloudfront.net/zyouhousi/back-number/pdf/Kissport_25-04.pdf'
      },
      {
        id: 19,
        date: new Date(2025, 4, 21), // 5月21日
        title: '第100回 東をどり',
        description: '普段は一見お断りと閉ざす新橋花柳界の門。年一度の東をどりにその扉が開き、百回を迎え 新橋芸者に華を添えます。',
        location: '新橋 新橋演舞場（東京都中央区銀座6-18-2）',
        time: '〈昼の回〉 12:30開演/〈夕の回〉 16:00開演（開場は各回30分前）',
        price: '桟敷席：12,000円/雪席：10,000円（1階/2階前方）/月席：6,000円（2階後方/2階左右）/花席：2,000円（3階自由席）※学生割引：当日会場窓口販売の当日券に限り、学生証ご提示で全席半額',
        category: 'event',
        image: '../images/5月/0521_新橋_東をどり1.JPG',
        contact: 'チケットホン松竹（TEL：0570-000-489 / 03-6745-0888）',
        link: 'https://azuma-odori.net/'
      },
      {
        id: 20,
        date: new Date(2025, 4, 25), // 5月25日
        title: '茜まつり',
        description: '赤坂の歴史と伝統を紡いできた「赤坂芸者」は、赤坂のシンボルの一つ。普段はなかなか見ることのできない、赤坂芸者衆の踊りをトークショーをお届けします。赤坂の味、文化、歴史、人を伝えるこのおまつりの目玉イベントです。',
        location: '赤坂 赤坂サカス広場（東京都港区赤坂5-3-1）',
        time: '18:00～',
        price: '観覧無料（※天候によりイベントは予告なく変更・終了する可能性あり）',
        category: 'event',
        image: '../images/5月/0525_赤坂_茜まつり1.JPG',
        contact: '茜まつり実行委員会（TEL：XXXXXXX）',
        link: 'https://akanematsuri.com/'
      },
      {
        id: 21,
        date: new Date(2025, 4, 28), // 5月28日
        title: '渋谷和芸「四季の宴―雨―」',
        description: '渋谷に残る花街・円山町の芸者衆の芸とともに、花柳寿世晶による日本舞踊で、雨をテーマに江戸の情緒をお楽しみください。',
        location: '渋谷 料亭 三長（東京都渋谷区円山町6-1）',
        time: '18:00開宴（17:30開場）',
        price: '22,000円（お食事・お飲み物代含む）',
        category: 'event',
        image: null,
        contact: '渋谷和芸 運営事務局（TEL：090-3232-1943）',
        link: 'https://shibuya-wagei.com/'
      },
      {
        id: 22,
        date: new Date(2025, 5, 1), // 6月1日
        title: '幇間大競演',
        description: '宴席で踊りや幇間芸などで場を盛り上げる幇間衆。日本で唯一、幇間衆が活躍している花街は浅草のみ。今回は所属する幇間全員が集い、様々な芸をお届けする、またとない機会です。',
        location: '浅草 浅草三業会館（浅草見番：東京都台東区浅草3-33-5）',
        time: '13:00開演（12:30開場）',
        price: '5,000円',
        category: 'event',
        image: '../images/6月/0601_浅草_幇間大競演2.JPG',
        contact: '東京浅草組合 浅草見番（TEL：03-3874-3131）',
        link: 'https://asakusakenban.com/information/'
      },
      {
        id: 23,
        date: new Date(2025, 5, 14), // 6月14日
        title: 'さかのうえの大宴会',
        description: '古民家風のしつらえで、様々な芸能とともに円山芸者衆の芸をご堪能いただきます。',
        location: '渋谷 つくね侍 さかのうえ（東京都渋谷区円山町20-1 新大宗丸山ビル1階）',
        time: '18:00～21:30',
        price: '13,000円（お食事お飲み物付き）',
        category: 'event',
        image: '../images/6月/0614_渋谷円山町.JPG',
        contact: 'つくね侍 さかのうえ（TEL：03-6809-0450）',
        link: 'https://tsukunesamurai-sakanoue.owst.jp/blogs/3438657'
      },
      {
        id: 24,
        date: new Date(2025, 5, 22), // 6月22日
        title: '第一回札幌をどり',
        description: 'さっぽろ名妓連の芸者衆、初めてのをどりに、新橋芸者衆・赤坂芸者衆が賛助出演いたします。',
        location: '新橋・赤坂 道新ホール（札幌市中央区大通西3-6 道新ビル大通館8階）',
        time: '11:00～/18:00～（各回30分前開場）',
        price: '7,000円（全席指定）',
        category: 'event',
        image: '../images/6月/0622_赤坂・新橋_札幌をどり2.JPG',
        contact: 'さっぽろ名妓連事務局（TEL：070-4385-4397）',
        link: 'https://www.sapporo-cci.or.jp/web/motion/details/post_46.html'
      },
      {
        id: 25,
        date: new Date(2025, 6, 5), // 7月5日
        title: '伝承のたまてばこ 多摩伝統文化フェスティバル「八王子芸妓衆の華と粋 ～艶やかにおもてなし～」',
        description: '八王子芸者衆が趣向を凝らした見目で、桑都の文化を発信します。',
        location: '八王子 いちょうホール 大ホール（八王子市本町24-1）',
        time: '14:30～15:00',
        price: '観賞無料',
        category: 'event',
        image: '../images/7月/0705-6_八王子_伝承のたまてばこ仮.jpeg',
        contact: '伝承のたまてばこ事務局 公益財団法人八王子市学園都市文化ふれあい財団（TEL：042-621-3005）',
        link: 'https://denshonotamatebako.tokyo/'
      },
      {
        id: 26,
        date: new Date(2025, 6, 6), // 7月6日
        title: '伝承のたまてばこ 多摩伝統文化フェスティバル「八王子芸妓衆の華と粋 ～艶やかにおもてなし～」',
        description: '八王子芸者衆が趣向を凝らした見目で、桑都の文化を発信します。',
        location: '八王子 いちょうホール 大ホール（八王子市本町24-1）',
        time: '14:30～15:00',
        price: '観賞無料',
        category: 'event',
        image: '../images/7月/0705-6_八王子_伝承のたまてばこ仮.jpeg',
        contact: '伝承のたまてばこ事務局 公益財団法人八王子市学園都市文化ふれあい財団（TEL：042-621-3005）',
        link: 'https://denshonotamatebako.tokyo/'
      },
      {
        id: 27,
        date: new Date(2025, 6, 6), // 7月6日
        title: 'ビア座敷',
        description: '浴衣姿の浅草芸者衆と幇間衆とご一緒に、ビールとともに暑い夏を乗り切るひとときをお過ごしください。',
        location: '浅草 浅草三業会館（浅草見番：東京都台東区浅草3-33-5）',
        time: '16:00～18:00',
        price: '15,000円（フリードリンク・オードブル付き）',
        category: 'event',
        image: '../images/7月/0706_浅草_ビア座敷3.JPG',
        contact: '東京浅草組合 浅草見番（TEL：03-3874-3131）',
        link: 'https://asakusakenban.com/information/'
      },
      {
        id: 28,
        date: new Date(2025, 6, 19), // 7月19日
        title: '朝顔市',
        description: '八王子芸者衆による朝顔の販売を（数量限定）いたします。夏の風物詩の涼やかなひとときをお楽しみください。',
        location: '八王子 八王子三業組合 見番（東京都八王子市南町1-7）',
        time: '12:00～15:00',
        price: '参加無料',
        category: 'event',
        image: '../images/7月/0719_八王子_朝顔市1.jpeg',
        contact: '八王子三業組合 見番（TEL：042-622-5191）',
        link: 'https://japan-heritage-soto.jp/calendar/%e3%80%90%e5%85%ab%e7%8e%8b%e5%ad%90%e8%8a%b8%e5%a6%93%e3%80%91%e8%a6%8b%e7%95%aa%e3%81%a7%e6%9c%9d%e9%a1%94%e5%b8%82/'
      },
      {
        id: 29,
        date: new Date(2025, 7, 1), // 8月1日
        title: '八王子まつり「柳遊まつり」',
        description: '八王子芸者衆の踊りを、お稽古場である見番にて間近でお楽しみいただけます。',
        location: '八王子 八王子三業組合 見番（東京都八王子市南町1-7）',
        time: '16:00～',
        price: '入場券：3,000円（定員40名）',
        category: 'event',
        image: '../images/8月/0801_八王子_八王子まつり「柳遊まつり」.JPG',
        contact: '八王子三業組合 見番（TEL：042-622-5191）',
        link: '#'
      },
      {
        id: 30,
        date: new Date(2025, 7, 1), // 8月1日
        title: '八王子まつり「宵宮の舞」',
        description: '日本遺産「桑都物語」の構成文化財の１つである八王子芸妓が踊りを披露します。',
        location: '八王子 西放射線ユーロード中町公園',
        time: '18:30～19:00',
        price: '観覧無料',
        category: 'event',
        image: '../images/8月/0801_八王子_八王子まつり「宵宮の舞」1.JPG',
        contact: '八王子まつり実行委員会（(公財) 八王子市学園都市文化ふれあい財団コミュニティ振興課内）（TEL：042-686-0611）',
        link: 'https://www.hachiojimatsuri.jp/'
      },
      {
        id: 31,
        date: new Date(2025, 7, 2), // 8月2日
        title: 'ほおずき会',
        description: '浅草、上野、隅田川界隈の邦楽愛好家の旦那衆と浅草芸者衆が芸を通じて親睦を深め、地域と花街の繁栄を目指して始まった催しです。日頃の稽古の成果をお楽しみください。',
        location: '浅草 雷５６５６会館 ときわホール（東京都台東区浅草3-6-1）',
        time: '13:00開演',
        price: '観覧無料',
        category: 'event',
        image: '../images/8月/0802_浅草_ほおずき会1.JPG',
        contact: 'ほおずき会（浅草観光連盟気付/TEL：03-2844-1221）',
        link: 'https://e-asakusa.jp/movies/106080'
      },
      {
        id: 32,
        date: new Date(2025, 7, 2), // 8月2日
        title: '八王子まつり「俄山車巡行」',
        description: '八王子芸者衆が所属する中町の俄山車に乗って、唄や三味線を演奏しながら、手古舞姿の芸者衆を先導に街を巡行します。',
        location: '八王子 八王子三業組合 見番（東京都八王子市南町1-7）出発',
        time: '17:20出発',
        price: '観覧無料',
        category: 'event',
        image: '../images/8月/0802-03_八王子_八王子まつり「俄山車巡行」1.JPG',
        contact: '八王子まつり実行委員会（(公財) 八王子市学園都市文化ふれあい財団コミュニティ振興課内）（TEL：042-686-0611）',
        link: 'https://www.hachiojimatsuri.jp/'
      },
      {
        id: 33,
        date: new Date(2025, 7, 3), // 8月3日
        title: '八王子まつり「俄山車巡行」',
        description: '八王子芸者衆が所属する中町の俄山車に乗って、唄や三味線を演奏しながら、手古舞姿の芸者衆を先導に街を巡行します。',
        location: '八王子 八王子三業組合 見番（東京都八王子市南町1-7）出発',
        time: '17:20出発',
        price: '観覧無料',
        category: 'event',
        image: '../images/8月/0802-03_八王子_八王子まつり「俄山車巡行」1.JPG',
        contact: '八王子まつり実行委員会（(公財) 八王子市学園都市文化ふれあい財団コミュニティ振興課内）（TEL：042-686-0611）',
        link: 'https://www.hachiojimatsuri.jp/'
      },
      {
        id: 34,
        date: new Date(2025, 7, 9), // 8月9日
        title: '「さかのうえの大宴会」夏の果てまで盛夏の大宴会！！',
        description: '古民家風のしつらえで、様々な芸能とともに円山芸者衆の芸をご堪能いただきます。',
        location: '渋谷 つくね侍 さかのうえ（東京都渋谷区円山町２０－１ 新大宗丸山ビル１階）',
        time: '18:00～21:30',
        price: '13,000円（お食事お飲み物付き）',
        category: 'event',
        image: '../images/8月/0809_渋谷円山町.JPG',
        contact: 'つくね侍 さかのうえ（TEL：03-6809-0450）',
        link: 'https://tsukunesamurai-sakanoue.owst.jp/blogs/3438657'
      },
      {
        id: 35,
        date: new Date(2025, 7, 23), // 8月23日
        title: '浅草花街・ビア座敷',
        description: '浴衣姿の浅草芸者衆と幇間衆とご一緒に、ビールとともに暑い夏を乗り切るひとときをお過ごしください。',
        location: '浅草 浅草ビューホテル アネックス 六区（東京都台東区浅草2丁目9-10）',
        time: '16:00～18:00',
        price: '20,000円（フリードリンク・オードブル付き）',
        category: 'event',
        image: '../images/8月/0823_浅草_ビア座敷ANNEX1.JPG',
        contact: '東京浅草組合 浅草見番（TEL：03-3874-3131）',
        link: 'https://asakusakenban.com/information/'
      },
      {
        id: 36,
        date: new Date(2025, 8, 6), // 9月6日
        title: '夕涼みビア処in見番',
        description: '八王子芸者衆総出で、お酒やおいしいお弁当、お座敷遊びなど楽しいひとときをお届けします。',
        location: '八王子 八王子三業組合 見番（東京都八王子市南町1-7）',
        time: '17:00～19:00',
        price: '15,000円（フリードリンク・お弁当付き）',
        category: 'event',
        image: '../images/9月/0906_八王子_ビア処in見番1.jpeg',
        contact: '八王子三業組合 見番（TEL：042-622-5191）',
        link: '#'
      },
      {
        id: 37,
        date: new Date(2025, 8, 13), // 9月13日
        title: '成田伝統芸能まつり 秋の陣',
        description: '「歌舞伎のまち成田」の地にて、赤坂芸者衆が踊りを披露します。',
        location: '赤坂 成田市文化芸術センター なごみの米屋 スカイタウンホール（千葉県成田市花崎町 828-11 スカイタウン成田）',
        time: '14:00～',
        price: '観賞無料',
        category: 'event',
        image: '../images/9月/0913_赤坂_成田伝統芸能まつり1.JPG',
        contact: '成田伝統芸能まつり実行委員会（成田市観光プロモーション課内）（TEL：0476-20-1540）',
        link: 'https://www.nrtk.jp/enjoy/shikisaisai/traditional-performing-arts.html'
      },
      {
        id: 38,
        date: new Date(2025, 8, 15), // 9月15日
        title: '牛嶋神社例大祭',
        description: '5年に一度の大祭にて、向嶋芸者衆が手古舞を奉納します。',
        location: '向嶋 牛嶋神社（東京都墨田区向島1-4-5）',
        time: '12:00～',
        price: '観覧無料',
        category: 'event',
        image: '../images/9月/0915_向嶋_牛嶋神社例大祭1.jpg',
        contact: '牛嶋神社（TEL：03-3622-0973）',
        link: 'https://visit-sumida.jp/event/ushijimajinjya_taisai091417/'
      },
      {
        id: 39,
        date: new Date(2025, 8, 19), // 9月19日
        title: '夕涼みビア処in見番',
        description: '八王子芸者衆総出で、お酒やおいしいお弁当、お座敷遊びなど楽しいひとときをお届けします。',
        location: '八王子 八王子三業組合 見番（東京都八王子市南町1-7）',
        time: '18:00～20:00',
        price: '15,000円（フリードリンク・お弁当付き）',
        category: 'event',
        image: '../images/9月/0919_八王子_ビア処in見番1.jpeg',
        contact: '八王子三業組合 見番（TEL：042-622-5191）',
        link: '#'
      },
      {
        id: 40,
        date: new Date(2025, 8, 21), // 9月21日
        title: '赤坂氷川祭',
        description: '豪華絢爛な山車や神輿が渡御する神幸祭にて、赤坂芸者衆がともに赤坂の街を練り歩きます。',
        location: '赤坂 赤坂氷川神社出発',
        time: '10:00～氷川神社出発',
        price: '観覧無料',
        category: 'event',
        image: '../images/9月/0921_赤坂_赤坂氷川祭8.JPG',
        contact: '赤坂氷川神社（TEL：03-3583-1935）',
        link: 'https://www.akasakahikawa.or.jp/hikawasai-r07/'
      },
      {
        id: 41,
        date: new Date(2025, 9, 4), // 10月4日
        title: '「さかのうえの大宴会」さかのうえの大宴会',
        description: '古民家風のしつらえで、様々な芸能とともに円山芸者衆の芸をご堪能いただきます。',
        location: '渋谷 つくね侍 さかのうえ（東京都渋谷区円山町２０－１ 新大宗丸山ビル１階）',
        time: '18:00～21:30',
        price: '13,000円（お食事お飲み物付き）',
        category: 'event',
        image: '../images/10月/1004_渋谷円山町.JPG',
        contact: 'つくね侍 さかのうえ（TEL：03-6809-0450）',
        link: 'https://tsukunesamurai-sakanoue.owst.jp/blogs/3438657'
      },
      {
        id: 42,
        date: new Date(2025, 9, 5), // 10月5日
        title: '浅草おどり',
        description: '江戸情緒が残る花街・浅草にて、浅草芸者衆や幇間衆が伝承してきた芸をお楽しみいただきます。',
        location: '浅草 台東区生涯学習センター ミレニアムホール（台東区西浅草3-25-16）',
        time: '第一部：13時/第二部：16時',
        price: '6,000円',
        category: 'event',
        image: '../images/10月/1005_浅草_浅草おどり3.JPG',
        contact: '浅草おどり公演事務局（TEL：03-3874-3131）',
        link: 'https://asakusakenban.com/odori/'
      },
      {
        id: 43,
        date: new Date(2025, 9, 5), // 10月5日
        title: 'すみだまつり',
        description: '向嶋芸者衆が四季折々の踊りを披露します。',
        location: '向嶋 ひがしんアリーナ（墨田区総合体育館）（東京都墨田区錦糸4-15-1）',
        time: '16:15～17:00',
        price: '観覧無料',
        category: 'event',
        image: '../images/10月/1005_向嶋_すみだまつり.JPG',
        contact: 'すみだまつり実行委員会（墨田区役所文化芸術振興課内）（TEL：03-5608-6181）',
        link: 'https://sumidamatsuri.com/'
      },
      {
        id: 44,
        date: new Date(2025, 10, 5), // 11月5日
        title: '「渋谷和芸の会―面―」',
        description: '渋谷に残る花街・円山町の芸者衆の芸とともに、花柳寿世晶による日本舞踊と、清元國惠太・清元志一朗師をお迎えして、和芸を身近にお楽しみいただくひとときをお届けします。',
        location: '渋谷 料亭 三長（東京都渋谷区円山町6-1）',
        time: '18:00開宴（17:30開場）',
        price: '22,000円（お食事・お飲み物代含む）',
        category: 'event',
        image: '../images/11月/1105_渋谷円山町.JPG',
        contact: '渋谷和芸 運営事務局（TEL：090-3232-1943）',
        link: 'https://shibuya-wagei.com/'
      },
      {
        id: 45,
        date: new Date(2025, 10, 9), // 11月9日
        title: '第二回 札幌をどり',
        description: 'さっぽろ名妓連の芸者衆の会に、東京・赤坂から育子と、京都・祇園甲部の芸妓・舞妓が賛助出演いたします。',
        location: '赤坂 札幌市教育文化会館 大ホール（北海道札幌市中央区北1条西13丁目）',
        time: '15:00開演（14:30開場）',
        price: 'S席：10,000円/A席：7,000円',
        category: 'event',
        image: '../images/11月/1109_赤坂_札幌をどり3.JPG',
        contact: 'さっぽろ名妓連事務所（TEL：070-4385-4397）',
        link: 'https://www.kyobun.org/event_schedule.html?id=11095'
      },
      {
        id: 46,
        date: new Date(2025, 10, 14), // 11月14日
        title: '水穂会',
        description: '「水穂会」は、「舞踊勉強会 花みずか会」を前身とした神楽坂芸者衆による、日頃の稽古の成果を披露する秋の公演です。（※演目は14日(金)と15日(土)で内容が異なります）',
        location: '神楽坂 四谷区民ホール9階（東京都新宿区内藤町87）',
        time: '15:30開演（15:00開場）',
        price: '1階席：4,000円（指定席）/2階席：2,000円（自由席）',
        category: 'event',
        image: '../images/11月/1114-15_神楽坂_水穂会.jpeg',
        contact: '東京神楽坂組合 見番事務所（TEL：03-3260-3291）',
        link: 'tel:03-3260-3291'
      },
      {
        id: 47,
        date: new Date(2025, 10, 15), // 11月15日
        title: '水穂会',
        description: '「水穂会」は、「舞踊勉強会 花みずか会」を前身とした神楽坂芸者衆による、日頃の稽古の成果を披露する秋の公演です。（※演目は14日(金)と15日(土)で内容が異なります）',
        location: '神楽坂 四谷区民ホール9階（東京都新宿区内藤町87）',
        time: '15:30開演（15:00開場）',
        price: '1階席：4,000円（指定席）/2階席：2,000円（自由席）',
        category: 'event',
        image: '../images/11月/1114-15_神楽坂_水穂会.jpeg',
        contact: '東京神楽坂組合 見番事務所（TEL：03-3260-3291）',
        link: 'tel:03-3260-3291'
      },
      {
        id: 48,
        date: new Date(2025, 10, 21), // 11月21日
        title: '三人会（赤坂 育子・新橋 加津代・先斗町 市園）',
        description: '赤坂 育子、新橋 加津代、先斗町 市園 による「三人会」です。',
        location: '赤坂・新橋 日本製鉄紀尾井ホール 小ホール（東京都千代田区紀尾井町6-5）',
        time: '1回目：13:00開演/2回目：16:30開演（開場は各回30分前）',
        price: '10,000円（全席指定）',
        category: 'event',
        image: '../images/11月/1121_赤坂・新橋・先斗町_三人会1.JPG',
        contact: '日本製鉄紀尾井ホール（TEL：03-5276-4500）',
        link: 'https://kioihall.jp/'
      },
      {
        id: 49,
        date: new Date(2025, 10, 29), // 11月29日
        title: '向嶋をどり',
        description: '日頃のお稽古の成果を、向嶋ならではの演目とともにお届けします。',
        location: '向嶋 曳舟文化センター（東京都墨田区京島1-38-11）',
        time: '第一部：12:00開演/第二部：15:00開演（※第一部、第二部同じ演目）',
        price: '指定席6,000円/自由席5,000円',
        category: 'event',
        image: '../images/11月/1129_向嶋_向嶋をどり3.JPG',
        contact: '向嶋墨堤組合（TEL：03-3623-6368）',
        link: 'tel:03-3623-6368'
      },
      {
        id: 50,
        date: new Date(2025, 10, 30), // 11月30日
        title: '伊東旧見番 百二十周年記念公演',
        description: '静岡・伊東の見番120周年を記念して、赤坂芸者衆が友情出演いたします。',
        location: '赤坂 伊東市観光会館（静岡県伊東市和田1-16-1）',
        time: '14:00開演（13:30開場）',
        price: '5,000円（自由席）',
        category: 'event',
        image: '../images/11月/1130_赤坂_伊東旧見番　百二十周年記念公演.JPG',
        contact: '伊東旧見番（TEL：0557-29-6607）',
        link: 'https://www.facebook.com/p/%E4%BC%8A%E6%9D%B1%E8%8A%B8%E5%A6%93%E7%BD%AE%E5%B1%8B%E5%8D%94%E5%90%8C%E7%B5%84%E5%90%88-%E6%97%A7%E8%A6%8B%E7%95%AA-100057152092651/?locale=ja_JP'
      },
      {
        id: 51,
        date: new Date(2025, 11, 6), // 12月6日
        title: 'さかのうえの大宴会',
        description: '古民家風のしつらえで、様々な芸能とともに円山芸者衆の芸をご堪能いただきます。',
        location: '渋谷 つくね侍 さかのうえ（東京都渋谷区円山町２０－１ 新大宗丸山ビル１階）',
        time: '18:00～21:30',
        price: '13,000円（お食事お飲み物付き）',
        category: 'event',
        image: '../images/11月/1105_渋谷円山町.JPG',
        contact: 'つくね侍 さかのうえ（TEL：03-6809-0450）',
        link: 'https://tsukunesamurai-sakanoue.owst.jp/blogs/3438657'
      },
      {
        id: 52,
        date: new Date(2025, 11, 14), // 12月14日
        title: '年忘れ日本酒会',
        description: '八海山の美味しいお酒とおつまみを、浅草芸者衆と幇間衆とともにお楽しみください。',
        location: '浅草 浅草三業会館（浅草見番：東京都台東区浅草3-33-5）',
        time: '16:00～',
        price: '25,000円（軽食付き）',
        category: 'event',
        image: '../images/12月/1214_浅草_年忘れ日本酒会.JPG',
        contact: '東京浅草組合 浅草見番（TEL：03-3874-3131）',
        link: 'https://asakusakenban.com/information/'
      },
      {
        id: 53,
        date: new Date(2025, 11, 18), // 12月18日
        title: '伝統文化まつり おもてなし舞 浅草芸妓連',
        description: '羽子板市である「歳の市」に合わせて開催される伝統文化まつりで、浅草芸者衆が踊りを披露いたします。',
        location: '浅草 伝統芸能ステージ（浅草壱福小路「大黒家別館4F」：東京都台東区浅草1-31-10）',
        time: '11:20～11:40（10:30～浅草壱福小路のイベント本部テントにて整理券配布）',
        price: '観覧無料（要整理券）',
        category: 'event',
        image: '../images/12月/1218_浅草_伝統文化まつり.JPG',
        contact: 'イベント事務局（（株）アド・インターフェース内）（TEL：03-5811-1929）',
        link: 'http://www.asakusa-ichifuku.com/information/archive/flyer2023dentobunka.pdf'
      }
    ];

    // イベントデータをタイムライン用に設定
    this.eventsData = fallbackEvents;
    this.generateMonthlyData();
    
    const timelineHTML = fallbackEvents.map(event => this.createTimelineItem(event)).join('');
    container.innerHTML = timelineHTML;
  }

  showFallbackMonthly(container) {
    if (!container) return;
    
    // フォールバック用の月別データ
    const fallbackMonthlyData = [
      {
        month: 2,
        monthName: '2月',
        theme: '梅の季節',
        events: [
          {
            id: 1,
            date: new Date(2025, 1, 2),
            title: '浅草観音文化芸能人節分会',
            description: '浅草芸者衆が浅草寺境内より豆まきを行います。',
            location: '浅草寺本堂 東側特設舞台',
            time: '14:30～17:15（芸者衆による豆まきは17:00～）',
            price: '観覧無料',
            category: 'event'
          },
          {
            id: 2,
            date: new Date(2025, 1, 2),
            title: '高尾山節分会追儺式',
            description: '八王子芸妓衆が境内より豆まきを行います。',
            location: '高尾山薬王院 境内（東京都八王子市高尾町2177）',
            time: '9:00/10:30/12:00/13:30/14:30(各回異なる芸妓衆が修行予定)',
            price: '観覧無料',
            category: 'event'
          },
          {
            id: 3,
            date: new Date(2025, 1, 3),
            title: '節分豆まき式',
            description: '毘沙門様の愛称で地元の人々に親しまれる善國寺にて芸者衆が豆まきを行います。',
            location: '善國寺 境内（東京都新宿区神楽坂5-36）',
            time: '15:00～',
            price: '観覧無料',
            category: 'event'
          },
          {
            id: 4,
            date: new Date(2025, 1, 9),
            title: '「さかのうえの大宴会」節分お化け',
            description: '古民家風のしつらえで、様々な芸能とともに円山芸者衆の芸をご堪能いただきます。',
            location: 'つくね侍 さかのうえ（東京都渋谷区円山町２０－１ 新大宗丸山ビル１階）',
            time: '18:00～21:30',
            price: '15,000円（お食事お飲み物付き）',
            category: 'event'
          },
          {
            id: 5,
            date: new Date(2025, 1, 15),
            title: 'かぐら坂への誘い',
            description: '「特製懐石弁当」をお召上がりいただきながら、神楽坂芸者衆の踊りをお楽しみいただきます。',
            location: '神楽坂 東京大神宮内 マツヤサロン（東京都千代田区富士見2-4-1）',
            time: '第一部：12:00～/15:30（各回、開場は３０分前・所要時間約1時間30分予定/演目は両回同様）',
            price: '22,000円（全席指定・御飲食料込）',
            category: 'event'
          },
          {
            id: 6,
            date: new Date(2025, 2, 22),
            title: '「Tokyo Creative Salon 2025」AKASAKA GEISHA PARADE',
            description: '赤坂芸者衆と赤坂24町会の方々が、赤坂の街を練り歩きます。',
            location: '赤坂一ツ木通り、エスプラナード赤坂、みすじ通り、赤坂通り（東京都港区赤坂）',
            time: '12:00～（約１時間予定）',
            price: '観覧無料',
            category: 'event'
          },
          {
            id: 7,
            date: new Date(2025, 2, 27),
            title: '墨堤さくらまつり「芸妓茶屋」',
            description: '隅田公園に期間限定で「芸妓茶屋」を設置。お団子等をご購入いただきますと、お席まで芸者衆がお運びします。',
            location: '向嶋 桜橋デッキスクエア（東京都墨田区向島5-1-1）',
            time: '平日11:30～15:30/土日11:30～16:00（雨天強風は中止）',
            price: '茶屋の飲食は有料',
            category: 'event'
          },
          {
            id: 8,
            date: new Date(2025, 2, 30),
            title: '浅草花街「お花見会」',
            description: '浅草芸者衆と幇間衆が勢ぞろいし、お客様を春の味覚と踊りでおもてなしいたします。',
            location: '浅草 浅草ビューホテル3階【祥雲の間】（東京都台東区西浅草3-17-1）',
            time: '16:00～（15:30開場）',
            price: '27,500円（お食事・お飲み物付き）',
            category: 'event'
          },
          {
            id: 9,
            date: new Date(2025, 3, 12),
            title: '「さかのうえの大宴会」春爛漫さかのうえのお花見大宴会',
            description: '古民家風のしつらえで、様々な芸能とともに円山芸者衆の芸をご堪能いただきます。',
            location: '渋谷 つくね侍 さかのうえ（東京都渋谷区円山町２０－１ 新大宗丸山ビル１階）',
            time: '18:00～21:30',
            price: '13,000円（お食事お飲み物付き）',
            category: 'event'
          },
          {
            id: 10,
            date: new Date(2025, 3, 18),
            title: '第4回 八王子をどり',
            description: '2021年の開催から5年ぶりの開催、桑都に舞う艶姿をお楽しみください。',
            location: '八王子 いちょうホール 大ホール 八王子市芸術文化会館（八王子市本町24-1）',
            time: '〈昼の部〉13:00開演・〈夜の部〉17時開演（開場は各回1時間前）',
            price: '8,000円（全席指定、プログラム・イヤホンガイド付）',
            category: 'event'
          },
          {
            id: 11,
            date: new Date(2025, 3, 19),
            title: '第4回 八王子をどり',
            description: '2021年の開催から5年ぶりの開催、桑都に舞う艶姿をお楽しみください。',
            location: '八王子 いちょうホール 大ホール 八王子市芸術文化会館（八王子市本町24-1）',
            time: '〈昼の部〉13:00開演・〈夜の部〉17時開演（開場は各回1時間前）',
            price: '8,000円（全席指定、プログラム・イヤホンガイド付）',
            category: 'event'
          },
          {
            id: 12,
            date: new Date(2025, 3, 24),
            title: '第40回 特別公演 神楽坂をどり',
            description: '今回は「東急歌舞伎町タワー・THEATER MILANO-Za」に移し、特別公演として開催いたします。',
            location: '神楽坂 東急歌舞伎町タワー THEATER MILANO-Za（東京都新宿区歌舞伎町1-29-1）',
            time: '17：00開演（16：15開場）',
            price: '○○○○円※11月下旬発売開始予定',
            category: 'event'
          },
          {
            id: 13,
            date: new Date(2025, 3, 25),
            title: '第40回 特別公演 神楽坂をどり',
            description: '今回は「東急歌舞伎町タワー・THEATER MILANO-Za」に移し、特別公演として開催いたします。',
            location: '神楽坂 東急歌舞伎町タワー THEATER MILANO-Za（東京都新宿区歌舞伎町1-29-1）',
            time: '12：30開演（11：45開場）・16：00開演（15：15開場）',
            price: '○○○○円※11月下旬発売開始予定',
            category: 'event'
          },
          {
            id: 14,
            date: new Date(2025, 4, 16),
            title: '三社祭「大行列」',
            description: 'お囃子屋台・鳶頭木遣り・びんざさら舞・白鷺の舞とともに、浅草芸者衆・幇間衆が浅草の町を練り歩きます。',
            location: '浅草 【西廻り】柳通り→千束通り→ひさご通り→浅草六区→雷門通り→雷門→仲見世→浅草神社',
            time: '13:00浅草見番前出発（雨天中止）',
            price: '観覧無料',
            category: 'event'
          },
          {
            id: 15,
            date: new Date(2025, 4, 17),
            title: '三社祭「くみ踊り鑑賞の集い」',
            description: '芸者衆が数人ずつ組になり踊るほか、幇間衆も出演する賑やかな会をお届けします。',
            location: '浅草 浅草三業会館（浅草見番：東京都台東区浅草3-33-5）',
            time: '13:00開演（12:30開場）',
            price: '5,500円（自由席・定員150名）',
            category: 'event'
          },
          {
            id: 16,
            date: new Date(2025, 4, 18),
            title: '三社祭「くみ踊り鑑賞の集い」',
            description: '芸者衆が数人ずつ組になり踊るほか、幇間衆も出演する賑やかな会をお届けします。',
            location: '浅草 浅草三業会館（浅草見番：東京都台東区浅草3-33-5）',
            time: '13:00開演（12:30開場）',
            price: '5,500円（自由席・定員150名）',
            category: 'event'
          },
          {
            id: 17,
            date: new Date(2025, 4, 18),
            title: '三社祭「奉納舞踊」',
            description: '浅草神社内の神楽殿にて、浅草芸者衆・幇間衆が踊りと幇間芸を奉納します。',
            location: '浅草 浅草神社内の神楽殿（東京都台東区浅草2-3-1）',
            time: '15:00～',
            price: '観覧無料',
            category: 'event'
          },
          {
            id: 18,
            date: new Date(2025, 4, 18),
            title: '華のおどり',
            description: '赤坂花街の伝統文化を継承する取り組みとして、赤坂芸者衆による踊「華のおどり」をお届けします。',
            location: '赤坂 きらぼし銀行本店8階（東京都港区南青山3-10-43）',
            time: '15:30～開演（15:00開場）',
            price: '観賞無料（※港区在住・在勤・在学者限定、事前申込・先着順/応募締め切り4/11）',
            category: 'event'
          },
          {
            id: 19,
            date: new Date(2025, 4, 21),
            title: '第100回 東をどり',
            description: '普段は一見お断りと閉ざす新橋花柳界の門。年一度の東をどりにその扉が開き、百回を迎え 新橋芸者に華を添えます。',
            location: '新橋 新橋演舞場（東京都中央区銀座6-18-2）',
            time: '〈昼の回〉 12:30開演/〈夕の回〉 16:00開演（開場は各回30分前）',
            price: '桟敷席：12,000円/雪席：10,000円（1階/2階前方）/月席：6,000円（2階後方/2階左右）/花席：2,000円（3階自由席）※学生割引：当日会場窓口販売の当日券に限り、学生証ご提示で全席半額',
            category: 'event'
          },
          {
            id: 20,
            date: new Date(2025, 4, 25),
            title: '茜まつり',
            description: '赤坂の歴史と伝統を紡いできた「赤坂芸者」は、赤坂のシンボルの一つ。普段はなかなか見ることのできない、赤坂芸者衆の踊りをトークショーをお届けします。赤坂の味、文化、歴史、人を伝えるこのおまつりの目玉イベントです。',
            location: '赤坂 赤坂サカス広場（東京都港区赤坂5-3-1）',
            time: '18:00～',
            price: '観覧無料（※天候によりイベントは予告なく変更・終了する可能性あり）',
            category: 'event'
          },
          {
            id: 21,
            date: new Date(2025, 4, 28),
            title: '渋谷和芸「四季の宴―雨―」',
            description: '渋谷に残る花街・円山町の芸者衆の芸とともに、花柳寿世晶による日本舞踊で、雨をテーマに江戸の情緒をお楽しみください。',
            location: '渋谷 料亭 三長（東京都渋谷区円山町6-1）',
            time: '18:00開宴（17:30開場）',
            price: '22,000円（お食事・お飲み物代含む）',
            category: 'event'
          },
          {
            id: 22,
            date: new Date(2025, 5, 1),
            title: '幇間大競演',
            description: '宴席で踊りや幇間芸などで場を盛り上げる幇間衆。日本で唯一、幇間衆が活躍している花街は浅草のみ。今回は所属する幇間全員が集い、様々な芸をお届けする、またとない機会です。',
            location: '浅草 浅草三業会館（浅草見番：東京都台東区浅草3-33-5）',
            time: '13:00開演（12:30開場）',
            price: '5,000円',
            category: 'event'
          },
          {
            id: 23,
            date: new Date(2025, 5, 14),
            title: 'さかのうえの大宴会',
            description: '古民家風のしつらえで、様々な芸能とともに円山芸者衆の芸をご堪能いただきます。',
            location: '渋谷 つくね侍 さかのうえ（東京都渋谷区円山町20-1 新大宗丸山ビル1階）',
            time: '18:00～21:30',
            price: '13,000円（お食事お飲み物付き）',
            category: 'event'
          },
          {
            id: 24,
            date: new Date(2025, 5, 22),
            title: '第一回札幌をどり',
            description: 'さっぽろ名妓連の芸者衆、初めてのをどりに、新橋芸者衆・赤坂芸者衆が賛助出演いたします。',
            location: '新橋・赤坂 道新ホール（札幌市中央区大通西3-6 道新ビル大通館8階）',
            time: '11:00～/18:00～（各回30分前開場）',
            price: '7,000円（全席指定）',
            category: 'event'
          }
        ],
        seasonDescription: '早春の梅をテーマにした優美な公演が特徴的な時期です。節分行事なども行われます。'
      }
    ];

    this.monthlyData = fallbackMonthlyData;
    const monthlyHTML = fallbackMonthlyData.map(month => this.createMonthlyCard(month)).join('');
    container.innerHTML = monthlyHTML;
  }
}

// ページ読み込み後に初期化
document.addEventListener('DOMContentLoaded', () => {
  const eventsLoader = new EventsDataLoader();
  eventsLoader.init();
});