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
  drawCharts();
  renderTips('all');
  renderTipCategories();
  renderRecallFull();
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

  Object.entries(SOURCES).forEach(([key, s]) => {
    const count = NEWS_DATA.filter(n => n.source === key).length;
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

function renderNewsGrid() {
  const grid = document.getElementById('newsGrid');
  const countEl = document.getElementById('newsResultCount');
  grid.innerHTML = '';

  const list = NEWS_DATA.filter(n => {
    const matchCat = activeCat === 'all' || n.cat === activeCat;
    const matchSrc = activeSrc === 'all' || n.source === activeSrc;
    return matchCat && matchSrc;
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

  // 「全部」按鈕事件
  bar.querySelector('[data-src="all"]').addEventListener('click', () => {
    document.querySelectorAll('#sourceFilterBar .source-filter-btn').forEach(b => b.classList.remove('active'));
    bar.querySelector('[data-src="all"]').classList.add('active');
    activeSrc = 'all';
    renderNewsGrid();
  });
}

// ===== 稽查報告 =====
function renderInspectionTable() {
  const tbody = document.getElementById('inspectionBody');
  tbody.innerHTML = '';
  INSPECTION_DATA.forEach(r => {
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
  // line
  const pts = values.map((v, i) => ({
    x: padL + (W / (labels.length - 1)) * i,
    y: padT + H * (1 - v / maxV),
  }));
  ctx.strokeStyle = '#38a169';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  pts.forEach((p, i) => {
    if (values[i] === 0) return;
    i === 0 || values[i-1] === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();
  // fill
  const validPts = pts.filter((_, i) => values[i] > 0);
  ctx.fillStyle = 'rgba(56,161,105,.12)';
  ctx.beginPath();
  ctx.moveTo(validPts[0].x, padT + H);
  validPts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(validPts[validPts.length-1].x, padT + H);
  ctx.closePath(); ctx.fill();
  // dots
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
  // x labels
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
  const container = document.getElementById('tipsCategories');
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
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

async function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById('formMsg');
  const btn = form.querySelector('.submit-btn');

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
const RSS_FEEDS = [
  { key:'udn',        url:'https://udn.com/rssfeed/news/2/6638?ch=news',            foodFocused:false },
  { key:'ltn',        url:'https://news.ltn.com.tw/rss/life.xml',                    foodFocused:false },
  { key:'ettoday',    url:'https://www.ettoday.net/rss/rss.xml',                     foodFocused:false },
  { key:'chinatimes', url:'https://www.chinatimes.com/rss/realtimenews.xml',          foodFocused:false },
  { key:'storm',      url:'https://www.storm.mg/rss',                                foodFocused:false },
  { key:'bbc',        url:'https://feeds.bbci.co.uk/news/health/rss.xml',            foodFocused:false },
  { key:'nyt',        url:'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml', foodFocused:false },
  { key:'reuters',    url:'https://feeds.reuters.com/reuters/healthNews',            foodFocused:false },
  { key:'guardian',   url:'https://www.theguardian.com/environment/food/rss',        foodFocused:true  },
  { key:'cnn',        url:'http://rss.cnn.com/rss/cnn_health.rss',                   foodFocused:false },
  // Google News — 以關鍵字搜尋，結果已篩選故 foodFocused:true
  { key:'gnews_tw',   url:'https://news.google.com/rss/search?q=%E9%A3%9F%E5%AE%89+OR+%E9%A3%9F%E5%93%81%E5%AE%89%E5%85%A8+OR+%E9%A3%9F%E7%89%A9%E4%B8%AD%E6%AF%92+OR+%E8%BE%B2%E8%97%A5%E6%AE%98%E7%95%99+OR+%E4%B8%8B%E6%9E%B6+OR+%E5%8F%AC%E5%9B%9E&hl=zh-TW&gl=TW&ceid=TW:zh-Hant', foodFocused:true },
  { key:'gnews_en',   url:'https://news.google.com/rss/search?q=food+safety+OR+food+recall+OR+food+poisoning+OR+food+contamination&hl=en-US&gl=US&ceid=US:en', foodFocused:true },
  // Google Trends Taiwan — 熱搜趨勢，保留關鍵字篩選
  { key:'gtrends',    url:'https://trends.google.com/trends/trendingsearches/daily/rss?geo=TW', foodFocused:false },
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

// 依序嘗試三個 CORS Proxy，任一成功即返回 XML 文字
async function fetchViaProxy(feedUrl) {
  const proxies = [
    async () => {
      const r = await fetchWithTimeout(`https://corsproxy.io/?${encodeURIComponent(feedUrl)}`, 10000);
      if (!r.ok) throw new Error(`${r.status}`);
      return r.text();
    },
    async () => {
      const r = await fetchWithTimeout(`https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`, 10000);
      if (!r.ok) throw new Error(`${r.status}`);
      return r.text();
    },
    async () => {
      const r = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`, 12000);
      if (!r.ok) throw new Error(`${r.status}`);
      const j = await r.json();
      return j.contents || '';
    },
  ];
  for (const tryProxy of proxies) {
    try {
      const text = await tryProxy();
      if (text && (text.includes('<item') || text.includes('<entry'))) return text;
    } catch { /* 嘗試下一個 */ }
  }
  throw new Error('all proxies failed');
}

// 先以 text/xml 解析，失敗再用 text/html（容錯）
function parseRSSItems(xmlText) {
  const p = new DOMParser();
  let doc = p.parseFromString(xmlText, 'text/xml');
  if (!doc.querySelector('parsererror')) {
    const items = [...doc.querySelectorAll('item, entry')];
    if (items.length > 0) return items;
  }
  doc = p.parseFromString(xmlText, 'text/html');
  return [...doc.querySelectorAll('item, entry')];
}

async function fetchSingleRSS(feed) {
  const xmlText = await fetchViaProxy(feed.url);
  const items   = parseRSSItems(xmlText);

  const results = [];
  for (const item of items) {
    const title = item.querySelector('title')?.textContent?.trim() || '';
    const rawDesc = item.querySelector('description, summary, content\\:encoded, content')?.textContent || '';
    const desc  = stripHtml(rawDesc);
    // <link>: RSS 2.0 為文字節點；Atom 用 href 屬性；Google News 有時是 <source url="...">
    const link  = item.querySelector('link')?.getAttribute('href') ||
                  item.querySelector('link')?.textContent?.trim() ||
                  item.querySelector('origLink')?.textContent?.trim() ||
                  item.querySelector('source')?.getAttribute('url') || feed.url;
    const pubDate = item.querySelector('pubDate, published, updated, dc\\:date, date, approx_traffic')?.textContent?.trim() || '';

    // Google Trends 的 <title> 是關鍵字本身，附帶 <ht:news_item_title> 作為真實標題
    const displayTitle = item.querySelector('news_item_title')?.textContent?.trim() || title;
    const displayLink  = item.querySelector('news_item_url')?.textContent?.trim() || link;

    if (matchesFoodSafety(displayTitle + ' ' + title + ' ' + desc, feed.foodFocused) && isWithin7Days(pubDate)) {
      results.push({
        title:   displayTitle || title || '(無標題)',
        desc,
        link:    displayLink || link,
        pubDate,
        source:  feed.key,
        // Google News 文章帶原始來源名稱，顯示用
        srcName: item.querySelector('source')?.textContent?.trim() || '',
      });
    }
  }
  return results;
}

function updateChip(key, state, count) {
  const chip = document.getElementById('chip-' + key);
  if (!chip) return;
  chip.className = `src-chip ${state}`;
  chip.querySelector('.chip-dot').className = `chip-dot ${count === 0 && state === 'ok' ? 'warn' : state}`;
  const label = SOURCES[key]?.short || key;
  chip.innerHTML = `<span class="chip-dot ${count === 0 && state === 'ok' ? 'warn' : state}"></span>${label}${state === 'ok' ? ` <span style="opacity:.65">(${count})</span>` : state === 'fail' ? ' ✕' : ''}`;
  chip.title = state === 'ok' ? `找到 ${count} 則食安新聞` : state === 'fail' ? '抓取失敗' : '抓取中…';
}

async function fetchLiveNews() {
  const btn      = document.getElementById('liveFetchBtn');
  const section  = document.getElementById('liveNewsSection');
  const statusEl = document.getElementById('liveFetchStatus');
  const grid     = document.getElementById('liveNewsGrid');
  const titleEl  = document.getElementById('liveNewsTitle');
  const timeEl   = document.getElementById('liveFetchTime');
  const emptyEl  = document.getElementById('liveEmpty');

  // Loading state
  btn.disabled = true;
  btn.querySelector('.lf-icon').style.display = 'none';
  btn.querySelector('.lf-spinner').style.display = 'inline-block';
  btn.querySelector('.lf-text').textContent = '抓取中…';
  section.style.display = 'block';
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

  // Fetch all sources in parallel
  const settled = await Promise.allSettled(
    RSS_FEEDS.map(async feed => {
      try {
        const articles = await fetchSingleRSS(feed);
        updateChip(feed.key, 'ok', articles.length);
        return articles;
      } catch {
        updateChip(feed.key, 'fail', 0);
        return [];
      }
    })
  );

  const allArticles = settled
    .flatMap(r => r.value || [])
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  const successSources = settled.filter(r => r.value?.length > 0).length;
  const now = new Date();
  const nowStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  titleEl.textContent = allArticles.length > 0
    ? `近7日食安新聞 — 共 ${allArticles.length} 則（${successSources} 個來源）`
    : '未找到符合條件的近7日食安新聞';
  timeEl.textContent = `更新：${nowStr}`;

  if (allArticles.length === 0) {
    emptyEl.style.display = 'block';
    emptyEl.innerHTML = `
      <div style="font-size:2rem;margin-bottom:12px">📭</div>
      未找到近7日食安相關新聞。<br/>
      <small>可能原因：媒體RSS格式調整、網路CORS限制，或本周確實無食安重大事件。</small>
    `;
  } else {
    allArticles.forEach(a => {
      const src = SOURCES[a.source] || {};
      // Google News / Trends 顯示原始來源名稱
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
