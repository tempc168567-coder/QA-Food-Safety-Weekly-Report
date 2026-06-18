// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  setHeaderDate();
  initNav();
  renderMarquee();
  renderLatestNews();
  renderInspectionSummary();
  renderTipCard();
  renderHomeRecall();
  renderSourceDirectory();
  renderNewsGrid();
  initCatFilterBtns();
  initSourceFilterBtns();
  renderInspectionTable();
  initInspectionFilters();
  drawCharts();
  renderTips('all');
  renderTipCategories();
  renderRecallFull();
  // 顯示實際 RSS 來源數量（RSS_FEEDS 在此時已定義）
  const fc = document.getElementById('feedCount');
  if (fc) fc.textContent = RSS_FEEDS.length;
});

// ===== 日期 =====
function setHeaderDate() {
  const d = new Date();
  const days = ['日','一','二','三','四','五','六'];
  document.getElementById('headerDate').textContent =
    `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日（週${days[d.getDay()]}）`;
}

// ===== 導覽 =====
function initNav() {
  document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      goPage(a.dataset.page);
    });
  });
}

function goPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
  const el = document.getElementById('page-' + page);
  if (el) {
    el.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ===== 跑馬燈 =====
function renderMarquee() {
  document.getElementById('marqueeText').textContent = MARQUEE_ITEMS.join('　　　　');
}

// ===== 首頁：最新消息 =====
function renderLatestNews() {
  const ul = document.getElementById('latestNewsList');
  NEWS_DATA.slice(0, 5).forEach(n => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="news-cat cat-${n.cat}">${catLabel(n.cat)}</span>${n.title}
      <span class="news-date">${n.date}</span>
    `;
    li.onclick = () => goPage('news');
    ul.appendChild(li);
  });
}

// ===== 首頁：稽查快報 =====
function renderInspectionSummary() {
  const container = document.getElementById('inspectionSummary');
  INSPECTION_DATA.slice(0, 5).forEach(r => {
    const div = document.createElement('div');
    div.className = 'insp-item';
    div.innerHTML = `
      <span>${r.name}</span>
      <span class="badge badge-${r.result}">${resultLabel(r.result)}</span>
    `;
    container.appendChild(div);
  });
}

// ===== 首頁：食安知識卡 =====
function renderTipCard() {
  const tip = TIPS_DATA[Math.floor(Math.random() * TIPS_DATA.length)];
  document.getElementById('tipCard').innerHTML = `
    <span class="tip-icon">${tip.icon}</span>
    <div class="tip-title">${tip.title}</div>
    <div>${tip.body}</div>
  `;
}

// ===== 首頁：下架召回 =====
function renderHomeRecall() {
  const container = document.getElementById('homeRecallList');
  RECALL_DATA.filter(r => r.status === 'open').slice(0, 4).forEach(r => {
    const div = document.createElement('div');
    div.className = 'recall-item';
    div.innerHTML = `
      <div class="recall-name">${r.name}</div>
      <div class="recall-brand">${r.brand}</div>
      <div class="recall-reason">${r.reason}</div>
      <div class="recall-date">公告日期：${r.date}</div>
    `;
    container.appendChild(div);
  });
}

// ===== 新聞來源目錄 =====
function renderSourceDirectory() {
  const domesticEl = document.getElementById('sourceDomestic');
  const intlEl     = document.getElementById('sourceInternational');
  if (!domesticEl || !intlEl) return;

  const sourceCounts = {};
  NEWS_DATA.forEach(n => { sourceCounts[n.source] = (sourceCounts[n.source] || 0) + 1; });

  Object.entries(SOURCES).forEach(([key, s]) => {
    const count = sourceCounts[key] || 0;
    const card = document.createElement('a');
    card.className = 'source-dir-card';
    card.href = s.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.style.background = s.bg;
    card.style.color = s.color;
    card.innerHTML = `
      <span class="sd-dot" style="background:${s.color}"></span>
      ${s.name}
      <span class="sd-count">(${count}則)</span>
    `;
    (s.region === 'domestic' ? domesticEl : intlEl).appendChild(card);
  });
}

// ===== 食安新聞 =====
let activeCat = 'all';
let activeSrc = 'all';
let newsQuery = '';

function filterNews() {
  newsQuery = (document.getElementById('newsSearch')?.value || '').toLowerCase().trim();
  renderNewsGrid();
}

function renderNewsGrid() {
  const grid = document.getElementById('newsGrid');
  const countEl = document.getElementById('newsResultCount');
  grid.innerHTML = '';

  const list = NEWS_DATA.filter(n => {
    const matchCat = activeCat === 'all' || n.cat === activeCat;
    const matchSrc = activeSrc === 'all' || n.source === activeSrc;
    const matchQ = !newsQuery || n.title.toLowerCase().includes(newsQuery) || n.summary.toLowerCase().includes(newsQuery);
    return matchCat && matchSrc && matchQ;
  });

  if (countEl) countEl.textContent = `共 ${list.length} 則新聞`;

  list.forEach(n => {
    const src = SOURCES[n.source] || {};
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      <div class="news-card-source-bar" style="background:${src.color || '#ccc'}"></div>
      <div class="news-card-body">
        <div class="news-card-meta">
          <span class="source-badge" style="background:${src.bg};color:${src.color}">${src.short || n.source}</span>
          <span class="news-cat cat-${n.cat}">${catLabel(n.cat)}</span>
        </div>
        <div class="news-card-title">${n.title}</div>
        <div class="news-card-summary">${n.summary}</div>
      </div>
      <div class="news-card-footer">
        <span>${n.date} &nbsp;&#128065; ${n.views.toLocaleString()}</span>
        <a class="news-card-link" href="${n.url}" target="_blank" rel="noopener noreferrer"
           onclick="event.stopPropagation()">前往原文 &rsaquo;</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initCatFilterBtns() {
  document.querySelectorAll('#catFilterBar .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#catFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      renderNewsGrid();
    });
  });
}

function initSourceFilterBtns() {
  const bar = document.getElementById('sourceFilterBar');
  if (!bar) return;

  // 動態建立各媒體篩選按鈕
  Object.entries(SOURCES).forEach(([key, s]) => {
    const btn = document.createElement('button');
    btn.className = 'source-filter-btn';
    btn.dataset.src = key;
    btn.textContent = s.short;
    btn.style.setProperty('--src-color', s.color);
    btn.addEventListener('click', () => {
      document.querySelectorAll('#sourceFilterBar .source-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSrc = key;
      renderNewsGrid();
    });
    bar.appendChild(btn);
  });

  // FIX #4：「全部」按鈕改用 onclick 指定，避免多次初始化時重複綁定
  const allBtn = bar.querySelector('[data-src="all"]');
  allBtn.onclick = () => {
    document.querySelectorAll('#sourceFilterBar .source-filter-btn').forEach(b => b.classList.remove('active'));
    allBtn.classList.add('active');
    activeSrc = 'all';
    renderNewsGrid();
  };
}

// ===== 稽查報告 =====
function renderInspectionTable() {
  const tbody = document.getElementById('inspectionBody');
  const year  = document.getElementById('inspectionYear')?.value  || 'all';
  const month = document.getElementById('inspectionMonth')?.value || 'all';
  const type  = document.getElementById('inspectionType')?.value  || 'all';

  const list = INSPECTION_DATA.filter(r => {
    const [y, m] = r.date.split('-');
    const matchY = year  === 'all' || y === year;
    const matchM = month === 'all' || parseInt(m, 10) === parseInt(month, 10);
    const matchT = type  === 'all' || r.type === type;
    return matchY && matchM && matchT;
  });

  tbody.innerHTML = '';
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#a0aec0;padding:24px">無符合條件的稽查記錄</td></tr>';
    return;
  }
  list.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.date}</td>
      <td>${r.name}</td>
      <td>${typeLabel(r.type)}</td>
      <td>${r.items}</td>
      <td><span class="badge badge-${r.result}">${resultLabel(r.result)}</span></td>
      <td>${r.action}</td>
    `;
    tbody.appendChild(tr);
  });
}

function initInspectionFilters() {
  ['inspectionYear', 'inspectionMonth', 'inspectionType'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', renderInspectionTable);
  });
}

// ===== 圖表 =====
function drawCharts() {
  drawPassChart();
  drawTrendChart();
}

function drawPassChart() {
  const canvas = document.getElementById('passChart');
  const ctx = canvas.getContext('2d');
  const data = [
    { label: '餐廳/小吃', pass: 88, color: '#38a169' },
    { label: '食品工廠', pass: 94, color: '#3182ce' },
    { label: '傳統市場', pass: 91, color: '#d69e2e' },
    { label: '超市/量販', pass: 97, color: '#805ad5' },
  ];
  const barH = 36, gap = 16, padL = 90, padR = 60, padT = 20;
  canvas.height = data.length * (barH + gap) + padT + 20;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const maxW = canvas.width - padL - padR;
  data.forEach((d, i) => {
    const y = padT + i * (barH + gap);
    // label
    ctx.fillStyle = '#4a5568';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(d.label, padL - 8, y + barH / 2 + 5);
    // bg bar
    ctx.fillStyle = '#edf2f7';
    ctx.beginPath();
    ctx.roundRect(padL, y, maxW, barH, 6);
    ctx.fill();
    // fill bar
    const fillW = maxW * d.pass / 100;
    ctx.fillStyle = d.color;
    ctx.beginPath();
    ctx.roundRect(padL, y, fillW, barH, 6);
    ctx.fill();
    // value
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'right';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(d.pass + '%', padL + fillW - 8, y + barH / 2 + 5);
  });
}

function drawTrendChart() {
  const canvas = document.getElementById('trendChart');
  const ctx = canvas.getContext('2d');
  const labels = ['1月','2月','3月','4月','5月','6月'];
  const values = [180, 210, 195, 248, 0, 0];
  const padL = 40, padR = 20, padT = 20, padB = 30;
  const W = canvas.width - padL - padR;
  const H = canvas.height - padT - padB;
  const maxV = 300;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // grid
  ctx.strokeStyle = '#edf2f7';
  ctx.lineWidth = 1;
  [0, 0.25, 0.5, 0.75, 1].forEach(t => {
    const y = padT + H * (1 - t);
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + W, y); ctx.stroke();
    ctx.fillStyle = '#a0aec0';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxV * t), padL - 4, y + 4);
  });

  // 計算所有點座標
  const pts = values.map((v, i) => ({
    x: padL + (W / (labels.length - 1)) * i,
    y: padT + H * (1 - v / maxV),
  }));

  // 只取有資料（非0）的點
  const validPts = pts.filter((_, i) => values[i] > 0);

  // FIX #2：折線只連有資料的點
  if (validPts.length > 0) {
    ctx.strokeStyle = '#38a169';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    validPts.forEach((p, i) => {
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // FIX #2：fill 區域正確封閉：左下 → 各有效點 → 右下 → 閉合
    ctx.fillStyle = 'rgba(56,161,105,.12)';
    ctx.beginPath();
    ctx.moveTo(validPts[0].x, padT + H);                       // 左下基準
    validPts.forEach(p => ctx.lineTo(p.x, p.y));               // 沿折線頂部
    ctx.lineTo(validPts[validPts.length - 1].x, padT + H);     // 右下基準
    ctx.closePath();
    ctx.fill();
  }

  // dots & labels（僅有資料的點）
  pts.forEach((p, i) => {
    if (values[i] === 0) return;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#38a169'; ctx.fill();
    ctx.fillStyle = '#2d3748';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(values[i], p.x, p.y - 8);
  });

  // x labels（全部月份都顯示）
  ctx.fillStyle = '#718096';
  ctx.font = '12px sans-serif';
  labels.forEach((l, i) => {
    const x = padL + (W / (labels.length - 1)) * i;
    ctx.textAlign = 'center';
    ctx.fillText(l, x, padT + H + 18);
  });
}

// ===== 食安知識 =====
const TIP_CATS = ['all', '冷鏈保存', '個人衛生', '標示判讀', '農藥殘留', '生食安全', '添加物'];
let activeTipCat = 'all';

function renderTipCategories() {
  // FIX #1：每次重繪前清除容器，防止按鈕重複疊加
  const container = document.getElementById('tipsCategories');
  container.innerHTML = '';
  const colors = ['#2d3748','#2b6cb0','#276749','#6b46c1','#744210','#c53030','#2b6cb0'];
  TIP_CATS.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'tip-cat-btn';
    btn.textContent = c === 'all' ? '全部' : c;
    btn.style.background = c === activeTipCat ? colors[i] : '#edf2f7';
    btn.style.color = c === activeTipCat ? '#fff' : '#4a5568';
    btn.onclick = () => {
      activeTipCat = c;
      renderTipCategories();
      renderTips(c);
    };
    container.appendChild(btn);
  });
}

function renderTips(cat) {
  const grid = document.getElementById('tipsGrid');
  grid.innerHTML = '';
  const query = document.getElementById('tipsSearch')?.value.toLowerCase() || '';
  const list = TIPS_DATA.filter(t => {
    const matchCat = cat === 'all' || t.cat === cat;
    const matchQ = !query || t.title.toLowerCase().includes(query) || t.body.toLowerCase().includes(query);
    return matchCat && matchQ;
  });
  list.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tip-knowledge-card';
    card.innerHTML = `
      <div class="tk-icon">${t.icon}</div>
      <div class="tk-cat" style="color:${t.catTextColor}">${t.cat}</div>
      <div class="tk-title">${t.title}</div>
      <div class="tk-body">${t.body}</div>
    `;
    grid.appendChild(card);
  });
}

function filterTips() {
  renderTips(activeTipCat);
}

// ===== 下架召回 =====
function renderRecallFull() {
  const container = document.getElementById('recallFullList');
  RECALL_DATA.forEach(r => {
    const card = document.createElement('div');
    card.className = 'recall-full-card';
    card.innerHTML = `
      <div class="rf-name">${r.name}</div>
      <div class="rf-row"><strong>業者：</strong>${r.brand}</div>
      <div class="rf-row"><strong>原因：</strong>${r.reason}</div>
      <div class="rf-row"><strong>批次：</strong>${r.batch}</div>
      <div class="rf-row"><strong>公告日期：</strong>${r.date}</div>
      <span class="rf-status ${r.status}">${r.status === 'open' ? '處理中' : '已結案'}</span>
    `;
    container.appendChild(card);
  });
}

// ===== 聯絡表單 =====
// FIX #3：請將 YOUR_FORM_ID 替換為實際的 Formspree ID，例如 'xpwzabcd'
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

async function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById('formMsg');
  const btn = form.querySelector('.submit-btn');

  // 檢查是否已設定 Formspree ID
  if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
    msg.textContent = '表單尚未設定，請聯絡品保處：tsuiting@chimeifood.com.tw';
    msg.className = 'form-msg error';
    return;
  }

  btn.disabled = true;
  msg.textContent = '送出中…';
  msg.className = 'form-msg';

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      msg.textContent = '您的意見已送出，我們將於3個工作天內回覆，感謝您的回饋！';
      msg.className = 'form-msg success';
      form.reset();
    } else {
      const data = await res.json();
      msg.textContent = data.errors?.[0]?.message || '送出失敗，請稍後再試。';
      msg.className = 'form-msg error';
    }
  } catch {
    msg.textContent = '網路錯誤，請確認連線後再試。';
    msg.className = 'form-msg error';
  } finally {
    btn.disabled = false;
  }
}

// ===== 輔助函數 =====
function catLabel(cat) {
  return { domestic:'國內', international:'國際', policy:'政策法規' }[cat] || cat;
}
function resultLabel(r) {
  return { pass:'合格', warn:'警告', fail:'不合格' }[r] || r;
}
function typeLabel(t) {
  return { restaurant:'餐廳/小吃', factory:'食品工廠', market:'傳統市場', supermarket:'超市/量販' }[t] || t;
}

// ===== 即時抓取近7日食安新聞 =====

// foodFocused=true 的頻道本身即為食品專屬，跳過關鍵字篩選
// 已驗證可用（2026-06-18）：udn, ltn, bbc, nyt, guardian, gnews_tw, gnews_en, gtrends, heho, yahoo_health, who
// 已移除失效來源：ettoday(回傳HTML), chinatimes(404), storm(404), reuters(DNS不存在), cnn(連線拒絕)
const RSS_FEEDS = [
  // 國內媒體
  { key:'udn',          url:'https://udn.com/rssfeed/news/2/6638?ch=news',            foodFocused:true  }, // UDN 食安專區，不需關鍵字篩選
  { key:'ltn',          url:'https://news.ltn.com.tw/rss/life.xml',                    foodFocused:false },
  { key:'heho',         url:'https://heho.com.tw/feed',                                foodFocused:false },
  // 國際媒體
  { key:'bbc',          url:'https://feeds.bbci.co.uk/news/health/rss.xml',            foodFocused:false },
  { key:'nyt',          url:'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml', foodFocused:false },
  { key:'guardian',     url:'https://www.theguardian.com/environment/food/rss',        foodFocused:true  },
  { key:'yahoo_health', url:'https://news.yahoo.com/rss/health',                       foodFocused:false },
  { key:'who',          url:'https://www.who.int/rss-feeds/news-english.xml',          foodFocused:false },
  // Google News — 以關鍵字搜尋，結果已篩選故 foodFocused:true
  { key:'gnews_tw',     url:'https://news.google.com/rss/search?q=%E9%A3%9F%E5%AE%89+OR+%E9%A3%9F%E5%93%81%E5%AE%89%E5%85%A8+OR+%E9%A3%9F%E7%89%A9%E4%B8%AD%E6%AF%92+OR+%E8%BE%B2%E8%97%A5%E6%AE%98%E7%95%99+OR+%E4%B8%8B%E6%9E%B6+OR+%E5%8F%AC%E5%9B%9E&hl=zh-TW&gl=TW&ceid=TW:zh-Hant', foodFocused:true },
  { key:'gnews_en',     url:'https://news.google.com/rss/search?q=food+safety+OR+food+recall+OR+food+poisoning+OR+food+contamination&hl=en-US&gl=US&ceid=US:en', foodFocused:true },
  // Google Trends Taiwan（舊URL已失效，改用新版路徑）
  { key:'gtrends',      url:'https://trends.google.com/trending/rss?geo=TW',           foodFocused:false },
];

const FOOD_KW = [
  // 中文
  '食安','食品安全','農藥','食物中毒','下架','召回','添加物','污染','殘留',
  '毒素','過敏原','防腐劑','細菌','衛生','黃麴','沙門氏','李斯特','大腸桿菌',
  '重金屬','亞硝','食品','飲食','食材','食物','飲料','餐廳','外食',
  // 英文（精確）
  'food safety','food recall','contamination','pesticide','bacteria',
  'salmonella','listeria','foodborne','e. coli','ecoli','food poisoning',
  'allergen','pathogen','food hazard','food-borne','fda recall',
  // 英文（寬鬆，適用食品頻道）
  'food','eating','diet','nutrition','restaurant','ingredient','meal',
];

function matchesFoodSafety(text, foodFocused) {
  if (foodFocused) return true;
  const lower = (text || '').toLowerCase();
  return FOOD_KW.some(kw => lower.includes(kw));
}

// 日期無法解析時納入（寬鬆策略，避免因格式異常漏掉新聞）
function isWithin7Days(dateStr) {
  if (!dateStr) return true;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return true;
  const diffDays = (Date.now() - d.getTime()) / 86400000;
  return diffDays >= -1 && diffDays <= 7;
}

async function fetchWithTimeout(url, ms = 10000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

// ===== RSS 格式正規化 — 各 API 輸出統一為 {title,desc,link,pubDate,srcName} =====
function _normRss2Json(items, feedUrl) {
  return (items || []).map(i => ({
    title:   (i.title  || '').trim() || '(無標題)',
    desc:    stripHtml(i.description || i.content || ''),
    link:    i.link    || feedUrl,
    pubDate: i.pubDate || '',
    srcName: '',
  }));
}
function _normFeedrapp(entries, feedUrl) {
  return (entries || []).map(e => ({
    title:   (e.title  || '').trim() || '(無標題)',
    desc:    stripHtml(e.content || e.contentSnippet || ''),
    link:    e.link    || feedUrl,
    pubDate: e.publishedDate || '',
    srcName: '',
  }));
}
function _normFeed2Json(items, feedUrl) {
  return (items || []).map(i => ({
    title:   (i.title  || '').trim() || '(無標題)',
    desc:    stripHtml(i.content_html || i.summary || ''),
    link:    i.url     || feedUrl,
    pubDate: i.date_published || '',
    srcName: '',
  }));
}
function _normXml(xmlItems, feedUrl) {
  return xmlItems.map(item => {
    const title = item.querySelector('title')?.textContent?.trim() || '';
    const desc  = stripHtml(item.querySelector('description, summary, content\\:encoded, content')?.textContent || '');
    const link  = item.querySelector('link')?.getAttribute('href') ||
                  item.querySelector('link')?.textContent?.trim() ||
                  item.querySelector('origLink')?.textContent?.trim() ||
                  item.querySelector('source')?.getAttribute('url') || feedUrl;
    const pubDate = item.querySelector('pubDate, published, updated, dc\\:date, date')?.textContent?.trim() || '';
    return {
      title:   item.querySelector('news_item_title')?.textContent?.trim() || title || '(無標題)',
      desc,
      link:    item.querySelector('news_item_url')?.textContent?.trim() || link,
      pubDate,
      srcName: item.querySelector('source')?.textContent?.trim() || '',
    };
  });
}

// ===== 四路並行競速策略 =====

// 路徑 A：rss2json.com（最快，專為 RSS 設計）
async function _fetchA(feedUrl) {
  const r = await fetchWithTimeout(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`, 12000);
  if (!r.ok) throw new Error(`A:${r.status}`);
  const j = await r.json();
  if (j.status !== 'ok' || !j.items?.length) throw new Error('A:empty');
  return _normRss2Json(j.items, feedUrl);
}

// 路徑 B：feedrapp.info（第二家 RSS 解析服務）
async function _fetchB(feedUrl) {
  const r = await fetchWithTimeout(`https://feedrapp.info/api?q=${encodeURIComponent(feedUrl)}`, 12000);
  if (!r.ok) throw new Error(`B:${r.status}`);
  const j = await r.json();
  const entries = j.responseData?.feed?.entries;
  if (!entries?.length) throw new Error('B:empty');
  return _normFeedrapp(entries, feedUrl);
}

// 路徑 C：feed2json.org（第三家 RSS 解析服務）
async function _fetchC(feedUrl) {
  const r = await fetchWithTimeout(`https://feed2json.org/convert?url=${encodeURIComponent(feedUrl)}`, 14000);
  if (!r.ok) throw new Error(`C:${r.status}`);
  const j = await r.json();
  if (!j.items?.length) throw new Error('C:empty');
  return _normFeed2Json(j.items, feedUrl);
}

// 路徑 D：5個 CORS Proxy 並行競速 + XML 解析（終極備援）
async function _fetchD(feedUrl) {
  const ok = t => t && (t.includes('<item') || t.includes('<entry'));
  const tryP = fn => fn().then(t => { if (!ok(t)) throw new Error('D:no xml'); return t; });
  const xml = await Promise.any([
    tryP(async () => { const r = await fetchWithTimeout(`https://corsproxy.io/?${encodeURIComponent(feedUrl)}`,             10000); if (!r.ok) throw new Error(r.status); return r.text(); }),
    tryP(async () => { const r = await fetchWithTimeout(`https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`, 10000); if (!r.ok) throw new Error(r.status); return r.text(); }),
    tryP(async () => { const r = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`, 12000); if (!r.ok) throw new Error(r.status); const j = await r.json(); return j.contents || ''; }),
    tryP(async () => { const r = await fetchWithTimeout(`https://cors.eu.org/${feedUrl}`,                                   10000); if (!r.ok) throw new Error(r.status); return r.text(); }),
    tryP(async () => { const r = await fetchWithTimeout(`https://corsproxy.org/?${encodeURIComponent(feedUrl)}`,            10000); if (!r.ok) throw new Error(r.status); return r.text(); }),
  ]);
  const items = (() => {
    const p = new DOMParser();
    let doc = p.parseFromString(xml, 'text/xml');
    if (!doc.querySelector('parsererror')) {
      const its = [...doc.querySelectorAll('item, entry')];
      if (its.length) return its;
    }
    return [...p.parseFromString(xml, 'text/html').querySelectorAll('item, entry')];
  })();
  if (!items.length) throw new Error('D:parse empty');
  return _normXml(items, feedUrl);
}

async function fetchSingleRSS(feed) {
  // A/B/C/D 四路同時發出，取最快成功的那一路
  const raw = await Promise.any([
    _fetchA(feed.url),
    _fetchB(feed.url),
    _fetchC(feed.url),
    _fetchD(feed.url),
  ]);
  return raw
    .filter(a => matchesFoodSafety(a.title + ' ' + a.desc, feed.foodFocused) && isWithin7Days(a.pubDate))
    .map(a => ({ ...a, source: feed.key }));
}

// FIX #5：移除無效的 chip.querySelector('.chip-dot').className 操作，
// 直接在 innerHTML 中設定正確的 class，保持邏輯清晰
function updateChip(key, state, count) {
  const chip = document.getElementById('chip-' + key);
  if (!chip) return;
  chip.className = `src-chip ${state}`;
  const dotClass = (count === 0 && state === 'ok') ? 'warn' : state;
  const label = SOURCES[key]?.short || key;
  let labelHtml = label;
  if (state === 'ok')   labelHtml += ` <span style="opacity:.65">(${count})</span>`;
  if (state === 'fail') labelHtml += ' ✕';
  chip.innerHTML = `<span class="chip-dot ${dotClass}"></span>${labelHtml}`;
  chip.title = state === 'ok'
    ? `找到 ${count} 則食安新聞`
    : state === 'fail' ? '抓取失敗' : '抓取中…';
}

let _liveCache = null;
let _liveCacheAt = 0;
const LIVE_CACHE_TTL = 30 * 1000; // 30秒防雙擊，「重新更新」按鈕可強制略過

function renderLiveCards(articles, grid, emptyEl) {
  grid.innerHTML = '';
  emptyEl.style.display = 'none';
  if (articles.length === 0) {
    emptyEl.style.display = 'block';
    emptyEl.innerHTML = `
      <div style="font-size:2rem;margin-bottom:12px">📭</div>
      未找到近7日食安相關新聞。<br/>
      <small>可能原因：① 各媒體 RSS 伺服器暫時無回應（最常見）② 網路限制了對外連線 ③ 本周確實無食安重大事件。<br/>請稍後再按「重新更新」重試。</small>
    `;
    return;
  }
  articles.forEach(a => {
    const src = SOURCES[a.source] || {};
    const isGoogle = a.source.startsWith('gnews') || a.source === 'gtrends';
    const subLabel = isGoogle && a.srcName
      ? `<span class="gnews-sub">${escHtml(a.srcName)}</span>` : '';
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      <div class="news-card-source-bar" style="background:${src.color || '#aaa'}"></div>
      <div class="news-card-body">
        <div class="news-card-meta">
          <span class="source-badge" style="background:${src.bg||'#eee'};color:${src.color||'#333'}">${src.short || a.source}</span>
          ${subLabel}
          <span class="live-tag-sm">LIVE</span>
        </div>
        <div class="news-card-title">${escHtml(a.title)}</div>
        <div class="news-card-summary">${escHtml(a.desc.slice(0, 130))}${a.desc.length > 130 ? '…' : ''}</div>
      </div>
      <div class="news-card-footer">
        <span>${formatPubDate(a.pubDate)}</span>
        <a class="news-card-link" href="${escHtml(a.link)}" target="_blank" rel="noopener noreferrer"
           onclick="event.stopPropagation()">前往原文 &rsaquo;</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

async function fetchLiveNews(forceRefresh = false) {
  const btn      = document.getElementById('liveFetchBtn');
  const section  = document.getElementById('liveNewsSection');
  const statusEl = document.getElementById('liveFetchStatus');
  const grid     = document.getElementById('liveNewsGrid');
  const titleEl  = document.getElementById('liveNewsTitle');
  const timeEl   = document.getElementById('liveFetchTime');
  const emptyEl  = document.getElementById('liveEmpty');

  section.style.display = 'block';

  // 未強制更新時，30秒內使用快取（防止連續快速點擊）
  if (!forceRefresh && _liveCache && Date.now() - _liveCacheAt < LIVE_CACHE_TTL) {
    const { articles, titleText, timeText } = _liveCache;
    titleEl.textContent = titleText;
    timeEl.textContent = timeText + '（快取）';
    statusEl.innerHTML = '';
    renderLiveCards(articles, grid, emptyEl);
    return;
  }

  // Loading state
  btn.disabled = true;
  btn.querySelector('.lf-icon').style.display = 'none';
  btn.querySelector('.lf-spinner').style.display = 'inline-block';
  btn.querySelector('.lf-text').textContent = '抓取中…';
  grid.innerHTML = '';
  emptyEl.style.display = 'none';
  titleEl.textContent = '正在連線抓取…';
  timeEl.textContent = '';

  // Build status chips
  statusEl.innerHTML = RSS_FEEDS.map(f => {
    const s = SOURCES[f.key] || {};
    return `<div class="src-chip" id="chip-${f.key}">
      <span class="chip-dot loading"></span>${s.short || f.key}
    </div>`;
  }).join('');

  // Fetch all sources in parallel，回傳 {ok, articles} 以區分「連線失敗」vs「無食安新聞」
  const settled = await Promise.allSettled(
    RSS_FEEDS.map(async feed => {
      try {
        const articles = await fetchSingleRSS(feed);
        updateChip(feed.key, 'ok', articles.length);
        return { ok: true, articles };
      } catch {
        updateChip(feed.key, 'fail', 0);
        return { ok: false, articles: [] };
      }
    })
  );

  const results     = settled.map(r => r.value || { ok: false, articles: [] });
  const allArticles = results
    .flatMap(r => r.articles)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  const hitSources   = results.filter(r => r.ok && r.articles.length > 0).length;
  const failSources  = results.filter(r => !r.ok).length;
  const emptySources = results.filter(r => r.ok && r.articles.length === 0).length;

  const now = new Date();
  const nowStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  const titleText = allArticles.length > 0
    ? `近7日食安新聞 — 共 ${allArticles.length} 則（${hitSources} 個來源有新聞）`
    : '未找到符合條件的近7日食安新聞';

  const notes = [];
  if (failSources  > 0) notes.push(`${failSources} 個來源連線失敗`);
  if (emptySources > 0) notes.push(`${emptySources} 個來源本週無食安新聞`);
  const timeText = `更新：${nowStr}${notes.length ? '　' + notes.join('，') : ''}`;

  titleEl.textContent = titleText;
  timeEl.textContent = timeText;

  // 儲存快取
  _liveCache = { articles: allArticles, titleText, timeText };
  _liveCacheAt = Date.now();

  renderLiveCards(allArticles, grid, emptyEl);

  // Reset button
  btn.disabled = false;
  btn.querySelector('.lf-icon').style.display = 'inline';
  btn.querySelector('.lf-spinner').style.display = 'none';
  btn.querySelector('.lf-text').textContent = '重新更新';
}

function closeLiveNews() {
  document.getElementById('liveNewsSection').style.display = 'none';
  const btn = document.getElementById('liveFetchBtn');
  btn.querySelector('.lf-text').textContent = '更新近7日食安新聞';
}

function stripHtml(html) {
  return (html || '').replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').replace(/&[a-z#\d]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

function escHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatPubDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr || '';
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
