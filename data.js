// ===== 新聞來源定義 =====
const SOURCES = {
  // 國內
  udn:         { name:'聯合新聞網', short:'UDN',      region:'domestic',      color:'#d62828', bg:'#fff0f0', url:'https://udn.com/search/word/2/%E9%A3%9F%E5%AE%89' },
  ltn:         { name:'自由時報',   short:'自由',      region:'domestic',      color:'#006400', bg:'#f0fff0', url:'https://search.ltn.com.tw/list?keyword=%E9%A3%9F%E5%AE%89' },
  ettoday:     { name:'ETtoday',   short:'ET',        region:'domestic',      color:'#e07b00', bg:'#fff8f0', url:'https://www.ettoday.net/tag/%E9%A3%9F%E5%AE%89/' },
  chinatimes:  { name:'中時新聞網', short:'中時',      region:'domestic',      color:'#1a4b8c', bg:'#f0f4ff', url:'https://www.chinatimes.com/search/%E9%A3%9F%E5%AE%89' },
  storm:       { name:'風傳媒',     short:'Storm',     region:'domestic',      color:'#2d6a4f', bg:'#f0fff8', url:'https://www.storm.mg/search?q=%E9%A3%9F%E5%AE%89' },
  // 國際
  bbc:         { name:'BBC News',  short:'BBC',       region:'international', color:'#bb1919', bg:'#fff0f0', url:'https://www.bbc.com/news/topics/cg41ylwvgnxt' },
  nyt:         { name:'紐約時報',   short:'NYT',       region:'international', color:'#000000', bg:'#f8f8f8', url:'https://www.nytimes.com/search?query=food+safety' },
  reuters:     { name:'路透社',     short:'Reuters',   region:'international', color:'#ff7f00', bg:'#fff8f0', url:'https://www.reuters.com/search/news?blob=food+safety' },
  cnn:         { name:'CNN',       short:'CNN',       region:'international', color:'#cc0001', bg:'#fff0f0', url:'https://edition.cnn.com/search?q=food+safety' },
  guardian:    { name:'衛報',       short:'Guardian',  region:'international', color:'#005689', bg:'#f0f6ff', url:'https://www.theguardian.com/environment/food' },
  // Google
  gnews_tw:    { name:'Google新聞(台灣)', short:'G新聞TW',  region:'domestic',      color:'#4285f4', bg:'#f0f4ff', url:'https://news.google.com/rss/search?q=%E9%A3%9F%E5%AE%89&hl=zh-TW&gl=TW&ceid=TW:zh-Hant' },
  gnews_en:    { name:'Google News',     short:'G News',   region:'international', color:'#34a853', bg:'#f0fff4', url:'https://news.google.com/rss/search?q=food+safety&hl=en-US&gl=US&ceid=US:en' },
  gtrends:     { name:'Google Trends',   short:'Trends',   region:'domestic',      color:'#ea4335', bg:'#fff5f5', url:'https://trends.google.com/trends/trendingsearches/daily/rss?geo=TW' },
};

// ===== 新聞資料 =====
const NEWS_DATA = [
  // 聯合新聞網
  {
    id:1, cat:'domestic', source:'udn',
    title:'北市抽查手搖飲料含糖量　3成超標需限期改善',
    summary:'台北市衛生局針對全市500家手搖飲料店進行含糖量抽驗，結果顯示約3成業者糖量標示與實際不符，已要求限期改善並列入追蹤。',
    date:'2026-04-28', views:3421,
    url:'https://udn.com/search/word/2/%E9%A3%9F%E5%AE%89',
  },
  {
    id:2, cat:'policy', source:'udn',
    title:'食安法修正草案出爐　業者違規罰鍰上限提高三倍',
    summary:'行政院送審食品安全衛生管理法修正草案，針對重大違規業者罰鍰上限由新台幣6億元提高至18億元，並增訂吹哨者保護條款。',
    date:'2026-04-20', views:4562,
    url:'https://udn.com/search/word/2/%E9%A3%9F%E5%AE%89%E6%B3%95',
  },
  // 自由時報
  {
    id:3, cat:'domestic', source:'ltn',
    title:'食藥署公布食品添加物使用新規　防腐劑上限調降',
    summary:'食品藥物管理署修正食品添加物使用規範，苯甲酸等5種常見防腐劑允許上限調降10%，新規將於2026年7月1日正式施行。',
    date:'2026-04-25', views:2108,
    url:'https://search.ltn.com.tw/list?keyword=%E9%A3%9F%E5%93%81%E6%B7%BB%E5%8A%A0%E7%89%A9',
  },
  {
    id:4, cat:'domestic', source:'ltn',
    title:'雞蛋場登記制上路　掃QR Code可查農場履歷',
    summary:'農業部推行蛋雞場登記制度全面上路，消費者掃描包裝QR Code即可查詢雞蛋從農場到門市的完整履歷，提升食品溯源透明度。',
    date:'2026-04-18', views:2930,
    url:'https://search.ltn.com.tw/list?keyword=%E9%9B%9E%E8%9B%8B%E5%B1%A5%E6%AD%B7',
  },
  // ETtoday
  {
    id:5, cat:'domestic', source:'ettoday',
    title:'傳統市場生魚片抽查出爐　寄生蟲檢出率偏高',
    summary:'衛生單位針對傳統市場生食水產品進行抽查，共抽驗120件，其中8件檢出寄生蟲卵，已要求業者加強冷凍處理並暫停販售。',
    date:'2026-04-23', views:5120,
    url:'https://www.ettoday.net/tag/%E9%A3%9F%E5%AE%89/',
  },
  {
    id:6, cat:'domestic', source:'ettoday',
    title:'網紅推薦炸物店被稽查　廢油重複使用遭停業',
    summary:'某知名網紅多次推薦的炸物攤位遭衛生局突擊稽查，現場發現使用廢食用油、超標酸價，依法開罰並命令停業至完成改善。',
    date:'2026-04-16', views:8830,
    url:'https://www.ettoday.net/tag/%E9%A3%9F%E5%AE%89/',
  },
  // 中時新聞網
  {
    id:7, cat:'policy', source:'chinatimes',
    title:'立院三讀通過　基因改造食品強制標示範圍擴大',
    summary:'立法院三讀通過食品安全衛生管理法部分條文修正案，基因改造原料含量超過0.9%即須強制標示，並溯及現行販售產品。',
    date:'2026-04-21', views:3105,
    url:'https://www.chinatimes.com/search/%E9%A3%9F%E5%AE%89%E6%B3%95',
  },
  {
    id:8, cat:'domestic', source:'chinatimes',
    title:'中南部醬油工廠稽查　2家檢出致癌物超標',
    summary:'衛生福利部食藥署針對醬油製造業者進行專案稽查，共稽查36家，2家業者檢出黃麴毒素超標，已封存問題品批次並開罰。',
    date:'2026-04-12', views:2756,
    url:'https://www.chinatimes.com/search/%E9%A3%9F%E5%93%81%E7%A8%BD%E6%9F%A5',
  },
  // 風傳媒
  {
    id:9, cat:'policy', source:'storm',
    title:'深度分析：台灣食安稽查人力嚴重不足的結構困境',
    summary:'全台食品業者逾20萬家，但衛生稽查員僅約800人，平均每人需負責250家。本文深入剖析人力缺口如何讓食安漏洞難以填補。',
    date:'2026-04-26', views:4211,
    url:'https://www.storm.mg/search?q=%E9%A3%9F%E5%AE%89%E7%A8%BD%E6%9F%A5',
  },
  {
    id:10, cat:'policy', source:'storm',
    title:'從源頭到餐桌：台灣食安溯源系統的建置與挑戰',
    summary:'政府推動食品雲端履歷平台多年，但業者申報率仍不足六成。風傳媒專訪農委會官員與食安學者，拆解溯源系統的核心障礙。',
    date:'2026-04-10', views:3688,
    url:'https://www.storm.mg/search?q=%E9%A3%9F%E5%93%81%E6%BA%AF%E6%BA%90',
  },
  // BBC
  {
    id:11, cat:'international', source:'bbc',
    title:'BBC：歐盟禁止4種農藥　台灣跟進修訂輸入標準',
    summary:'歐盟宣布禁止4種農藥在食品中殘留，台灣衛福部已啟動修訂程序，預計年底前完成公告，影響蔬果進口規範。BBC報導此波禁令的全球連鎖反應。',
    date:'2026-04-22', views:1875,
    url:'https://www.bbc.com/news/topics/cg41ylwvgnxt',
  },
  {
    id:12, cat:'international', source:'bbc',
    title:'BBC：英國速食業者因食品標示不實遭重罰　掀監管風潮',
    summary:'英國食品標準局對多家速食連鎖業者祭出重罰，原因是過敏原標示不實導致消費者住院，此案已引發多國食安主管機關的關注。',
    date:'2026-04-14', views:2340,
    url:'https://www.bbc.com/news/topics/cg41ylwvgnxt',
  },
  // 紐約時報
  {
    id:13, cat:'international', source:'nyt',
    title:'NYT深度報導：美國加工食品含糖量監管長期失靈',
    summary:'紐約時報調查發現，美國FDA對加工食品含糖量的規範存在重大漏洞，製造商得以利用多種糖類分拆標示以規避總量揭露義務。',
    date:'2026-04-19', views:6102,
    url:'https://www.nytimes.com/search?query=food+safety+sugar',
  },
  {
    id:14, cat:'international', source:'nyt',
    title:'NYT：全球食品供應鏈脆弱性　氣候變遷加劇污染風險',
    summary:'隨著極端氣候頻率增加，穀物運輸與儲存條件惡化，黃麴毒素與農藥殘留問題在多個發展中國家顯著上升，引發全球食安警報。',
    date:'2026-04-07', views:4523,
    url:'https://www.nytimes.com/search?query=food+safety+climate',
  },
  // 路透社
  {
    id:15, cat:'international', source:'reuters',
    title:'路透社：WHO發布新版食品安全五大要點指引',
    summary:'世界衛生組織更新食品安全手冊，新增對網購生鮮食品的冷鏈要求指引，並特別強調家庭廚房的交叉污染預防為降低全球食因性疾病的關鍵。',
    date:'2026-04-24', views:3287,
    url:'https://www.reuters.com/search/news?blob=food+safety+WHO',
  },
  {
    id:16, cat:'international', source:'reuters',
    title:'路透社：東南亞爆發沙門氏菌集體感染　追查源頭至雞蛋農場',
    summary:'路透社報導，東南亞多國出現沙門氏菌集體感染事件，溯源調查指向同一跨國雞蛋供應商，已導致三國啟動緊急下架程序。',
    date:'2026-04-17', views:5012,
    url:'https://www.reuters.com/search/news?blob=salmonella+food+safety',
  },
  // CNN
  {
    id:17, cat:'international', source:'cnn',
    title:'CNN：美國即食沙拉遭李斯特菌污染　多州聯合下架',
    summary:'美國疾管署與FDA聯合調查後確認，某品牌即食沙拉產品遭李斯特菌污染，已波及12州，12人住院、1人死亡，製造商全面召回。',
    date:'2026-04-27', views:7890,
    url:'https://edition.cnn.com/search?q=food+recall+listeria',
  },
  {
    id:18, cat:'international', source:'cnn',
    title:'CNN：超加工食品與慢性病關聯性研究再度引發政策辯論',
    summary:'刊載於《柳葉刀》的最新研究顯示，超加工食品攝取量與代謝症候群風險呈顯著正相關，CNN採訪多位營養學家，探討政府是否應立法限制廣告。',
    date:'2026-04-13', views:6231,
    url:'https://edition.cnn.com/search?q=ultra-processed+food+health',
  },
  // 衛報
  {
    id:19, cat:'international', source:'guardian',
    title:'衛報：農藥使用量創20年新高　蜂群崩潰威脅食品安全',
    summary:'《衛報》調查報告指出，全球農藥使用量較2005年上升42%，新型菸鹼類農藥對蜂群的傷害導致授粉危機，間接威脅全球糧食供應穩定性。',
    date:'2026-04-25', views:4108,
    url:'https://www.theguardian.com/environment/food',
  },
  {
    id:20, cat:'international', source:'guardian',
    title:'衛報：塑膠微粒進入食物鏈　多國海鮮樣本驗出超標',
    summary:'衛報獨家報導，橫跨歐亞16國的聯合研究在市售貝類、魚類樣本中均檢出微塑膠顆粒，引發科學界對長期食用安全性的嚴重擔憂。',
    date:'2026-04-09', views:5643,
    url:'https://www.theguardian.com/environment/microplastics',
  },
];

// ===== 稽查報告資料 =====
const INSPECTION_DATA = [
  { date:'2026-04-28', name:'幸福小吃部', type:'restaurant', items:'衛生環境、食材溫度', result:'pass', action:'無' },
  { date:'2026-04-27', name:'新鮮生機股份有限公司', type:'factory', items:'農藥殘留、添加物', result:'warn', action:'限期改善' },
  { date:'2026-04-26', name:'台北東門市場', type:'market', items:'生熟食分離、溫控', result:'pass', action:'無' },
  { date:'2026-04-25', name:'大潤發中和店', type:'supermarket', items:'標示查核、效期管理', result:'warn', action:'限期改善' },
  { date:'2026-04-24', name:'美味廚坊餐廳', type:'restaurant', items:'廚房衛生、員工健康', result:'pass', action:'無' },
  { date:'2026-04-23', name:'金農食品股份有限公司', type:'factory', items:'防腐劑殘留、重金屬', result:'fail', action:'停業改善+罰鍰' },
  { date:'2026-04-22', name:'南門市場', type:'market', items:'生鮮食材保存溫度', result:'pass', action:'無' },
  { date:'2026-04-21', name:'全聯福利中心士林店', type:'supermarket', items:'效期標示、冷藏溫度', result:'pass', action:'無' },
];

// ===== 食安知識資料 =====
const TIPS_DATA = [
  {
    id:1, icon:'🌡️', cat:'冷鏈保存', catColor:'#ebf8ff', catTextColor:'#2b6cb0',
    title:'食物保存溫度全攻略',
    body:'冷藏室應維持0–7°C，冷凍室維持-18°C以下。熟食存放超過2小時需丟棄或加熱至中心溫度75°C以上，避免細菌繁殖。',
  },
  {
    id:2, icon:'🧼', cat:'個人衛生', catColor:'#f0fff4', catTextColor:'#276749',
    title:'正確洗手五步驟防食安風險',
    body:'處理食材前後務必以肥皂搓洗雙手20秒以上，包括指縫、大拇指及手腕。流動清水沖洗後以乾淨紙巾擦乾，可有效降低交叉污染。',
  },
  {
    id:3, icon:'🏷️', cat:'標示判讀', catColor:'#faf5ff', catTextColor:'#6b46c1',
    title:'看懂食品標示　效期不踩雷',
    body:'「有效日期」是品質保證期限；「賞味期限」前風味最佳但未必不可食；「製造日期」需自行計算。開封後效期縮短，應儘速食用。',
  },
  {
    id:4, icon:'🥦', cat:'農藥殘留', catColor:'#fffff0', catTextColor:'#744210',
    title:'蔬菜水洗去農藥正確方式',
    body:'流水沖洗比浸泡更有效：先沖洗整顆蔬菜表面，再去除外葉，切段後再次沖洗。高麗菜、花椰菜等葉菜類建議浸泡清水10分鐘再沖洗。',
  },
  {
    id:5, icon:'🐟', cat:'生食安全', catColor:'#fff5f5', catTextColor:'#c53030',
    title:'生食水產品　免疫力不佳者應避免',
    body:'生魚片等生食水產含有寄生蟲風險，兒童、孕婦、老人及免疫低下者應避免食用。選購時注意是否標示「供生食用」及低溫保存。',
  },
  {
    id:6, icon:'🫙', cat:'添加物', catColor:'#ebf8ff', catTextColor:'#2b6cb0',
    title:'常見食品添加物一覽與安全評估',
    body:'合法添加物如磷酸鹽、亞硝酸鹽在法定用量下安全無虞。消費者若有疑慮，可選購「無添加」或「有機認證」產品，並養成閱讀成分表的習慣。',
  },
];

// ===== 下架召回資料 =====
const RECALL_DATA = [
  {
    name:'XXX牌香腸（300g）', brand:'XX食品股份有限公司',
    reason:'亞硝酸鹽超標（實測值：200 mg/kg，限量70 mg/kg）',
    date:'2026-04-27', batch:'批號：2026-03-15', status:'open',
  },
  {
    name:'進口義大利奶酪（200g）', brand:'YY進口貿易商',
    reason:'檢出李斯特菌，可能導致食物中毒',
    date:'2026-04-24', batch:'效期：2026-06-30以前', status:'open',
  },
  {
    name:'花生奶油麵包（6入）', brand:'ZZ烘焙坊',
    reason:'成分標示未揭露花生過敏原，可能危害過敏族群',
    date:'2026-04-20', batch:'全批次', status:'open',
  },
  {
    name:'有機黑豆醬油（500ml）', brand:'WW有機農場',
    reason:'防腐劑苯甲酸超標（實測值：1.2 g/kg，限量1.0 g/kg）',
    date:'2026-04-15', batch:'批號：B2026041', status:'closed',
  },
  {
    name:'冷凍蝦仁（1kg）', brand:'AA水產股份有限公司',
    reason:'檢出氯霉素殘留，禁用於食用水產品',
    date:'2026-04-10', batch:'效期2026-12前全批', status:'closed',
  },
];

// ===== 跑馬燈 =====
const MARQUEE_ITEMS = [
  '【公告】4月份市場專項稽查結果公布，合格率96.4%，詳情請見稽查報告。',
  '【警示】XXX牌香腸亞硝酸鹽超標，請立即停止食用並退貨。',
  '【提醒】5月份將加強手搖飲料店衛生稽查，業者請確認標示合規。',
  '【活動】食安知識月：4月28日至5月31日參加線上測驗即可獲得電子證書。',
  '【法規】食品添加物新規7月1日施行，業者請儘速完成調整。',
];
