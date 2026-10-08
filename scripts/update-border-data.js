#!/usr/bin/env node
// 自動從衛生福利部食品藥物管理署「邊境檢驗不符合食品資訊查詢」
// (https://www.fda.gov.tw/UnsafeFood/UnsafeFood.aspx) 抓取最新公告，
// 補進 data.js 的 BORDER_DATA。此頁無公開 RSS/JSON API，但清單與明細頁
// 皆可用一般 GET 取得（清單頁用 ?idx=N 分頁，由新到舊排序）。
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const LIST_URL = 'https://www.fda.gov.tw/UnsafeFood/UnsafeFood.aspx';
const DETAIL_URL = 'https://www.fda.gov.tw/UnsafeFood/UnsafeFoodContent.aspx?id=';
const DATA_JS_PATH = path.join(__dirname, '..', 'data.js');
const MAX_LIST_PAGES = 40; // 安全上限，避免資料來源異常時無限爬取
const REQUEST_DELAY_MS = 500; // 禮貌性延遲，避免對官網造成負擔
const MAX_RETRIES = 4;

// 已知分類顏色（與 data.js 的 BORDER_CAT_COLORS 需保持一致）
const CATEGORY_COLORS = {
  '農藥殘留': '#e07b00', '重金屬': '#8e24aa', '溶出試驗': '#00838f', '甜味劑': '#c2185b',
  '防腐劑': '#5e35b1', '螢光增白劑': '#1565c0', '漂白劑': '#0277bd', '著色劑': '#d81b60',
  '動物用藥': '#6d4c41', '微生物': '#c62828', '戴奧辛': '#37474f', '衛生項目': '#455a64',
  '真菌毒素': '#ad1457', '保水劑': '#00695c', '食品添加物': '#7b1fa2', '防腐劑/抗氧化劑': '#5e35b1',
};
// 長分類名稱 → 既有短分類（維持與歷史資料一致的命名）
const CATEGORY_ALIASES = {
  '戴奧辛及戴奧辛類多氯聯苯': '戴奧辛',
  '動物用藥殘留': '動物用藥',
  '微生物衛生標準': '微生物',
  '衛生標準': '衛生項目',
  '其他衛生項目': '衛生項目',
};
const FALLBACK_COLORS = ['#546e7a', '#8d6e63', '#558b2f', '#00796b', '#5d4037', '#304ffe'];

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; QA-FoodSafetyBot/1.0)' },
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(httpGet(new URL(res.headers.location, url).toString()));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error('timeout')));
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function httpGetRetry(url) {
  let lastErr;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await httpGet(url);
    } catch (err) {
      lastErr = err;
      console.warn(`請求失敗（第 ${attempt} 次）：${url} — ${err.message}`);
      await sleep(1500 * attempt);
    }
  }
  throw lastErr;
}

function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTags(s) {
  return decodeEntities(s.replace(/<[^>]*>/g, ''));
}

// 品項名稱尾端常附英文/重複品名，例如「哈密瓜(FRESH MELON)」或「湯勺((MELAMINE) SOUP SPOON 湯勺)」，
// 去除結尾的「整段括號」以符合既有資料風格（只在括號內含英文字母時才視為附加說明而移除）
function stripTrailingEnglishParen(item) {
  let s = item.trim();
  for (let guard = 0; guard < 3; guard++) {
    if (!s.endsWith(')')) break;
    let depth = 0, start = -1;
    for (let i = s.length - 1; i >= 0; i--) {
      if (s[i] === ')') depth++;
      else if (s[i] === '(') { depth--; if (depth === 0) { start = i; break; } }
    }
    if (start === -1) break;
    const inner = s.slice(start + 1, s.length - 1);
    if (!/[A-Za-z]/.test(inner)) break;
    s = s.slice(0, start).trim();
  }
  return s;
}

// ===== 清單頁：取得 {id, title, date} =====
function parseListPage(html) {
  const rows = [];
  const re = /href="\/UnsafeFood\/UnsafeFoodContent\.aspx\?id=(\d+)"[^>]*>([\s\S]*?)<\/a><\/td><td class=&#39;txt_C&#39; >(\d{4}-\d{2}-\d{2})/g;
  let m;
  while ((m = re.exec(html))) {
    rows.push({ id: m[1], title: decodeEntities(m[2]), date: m[3] });
  }
  return rows;
}

// ===== 明細頁：取得國家/品項/違規內容/法規標準 =====
function parseDetailPage(html, title) {
  const h3Match = html.match(/<h3>([\s\S]*?)<\/h3>/);
  const h3 = h3Match ? decodeEntities(h3Match[1]) : title;

  const field = label => {
    const re = new RegExp(`<p class="RL-th">${label}<\\/p>\\s*<p class="RL-td">([\\s\\S]*?)<\\/p>`);
    const mm = html.match(re);
    return mm ? stripTags(mm[1]) : '';
  };

  const violation = field('不合格原因暨檢出量詳細說明');
  const standard = field('法規限量標準');

  // 標題格式：{國家}出口「{品項}」{分類1}[不符規定][ & {分類2}不符規定]
  // 分類片語不一定有「不符規定」結尾（例如單純著色劑違規），且可能以「 & 」併列多個分類
  const titleMatch = h3.match(/^(.+?)出口「(.+?)」(.+)$/);
  let country = '', item = '', categoryTail = '';
  if (titleMatch) {
    country = titleMatch[1].trim();
    item = stripTrailingEnglishParen(titleMatch[2]);
    categoryTail = titleMatch[3].trim();
  } else {
    item = h3;
  }

  const normalizePhrase = raw => {
    let c = raw.trim();
    let prev;
    do {
      prev = c;
      c = c
        .replace(/^容器具-/, '')
        .replace(/^檢出/, '')
        .replace(/^含非法定/, '')
        .replace(/^含/, '')
        .replace(/含量$/, '')
        .trim();
    } while (c !== prev);
    return CATEGORY_ALIASES[c] || c || '其他';
  };

  const category = categoryTail
    .replace(/不符規定$/, '')
    .trim()
    .split(/\s*&\s*/)
    .filter(Boolean)
    .map(normalizePhrase)
    .join('、') || '其他';

  return { country, item, category, violation, standard };
}

function categoryColor(cat, usedColors) {
  if (CATEGORY_COLORS[cat]) return CATEGORY_COLORS[cat];
  const idx = Object.keys(usedColors).length % FALLBACK_COLORS.length;
  return FALLBACK_COLORS[idx];
}

// ===== 讀取 data.js，找出目前 BORDER_DATA 的最新日期與既有筆數（去重用） =====
function loadExisting(dataJs) {
  const m = dataJs.match(/const BORDER_DATA = \[([\s\S]*?)\n\];/);
  if (!m) throw new Error('找不到 data.js 中的 BORDER_DATA 區塊');
  const body = m[1];
  const entryRe = /\{ month:(\d+), date:"([^"]+)", country:"((?:[^"\\]|\\.)*)", item:"((?:[^"\\]|\\.)*)", category:"((?:[^"\\]|\\.)*)", violation:"((?:[^"\\]|\\.)*)", standard:"((?:[^"\\]|\\.)*)" \}/g;
  const existing = [];
  let em;
  while ((em = entryRe.exec(body))) {
    existing.push({
      month: parseInt(em[1], 10), date: em[2],
      country: JSON.parse('"' + em[3] + '"'),
      item: JSON.parse('"' + em[4] + '"'),
      category: JSON.parse('"' + em[5] + '"'),
      violation: JSON.parse('"' + em[6] + '"'),
      standard: JSON.parse('"' + em[7] + '"'),
    });
  }
  const latestDate = existing.reduce((max, e) => (e.date > max ? e.date : max), '0000-00-00');
  return { existing, latestDate, blockStart: m.index + m[0].indexOf('['), raw: m[0] };
}

function entryKey(e) {
  return `${e.date}|${e.country}|${e.item}|${e.violation}`;
}

async function main() {
  const dataJs = fs.readFileSync(DATA_JS_PATH, 'utf8');
  const { existing, latestDate } = loadExisting(dataJs);
  const existingKeys = new Set(existing.map(entryKey));
  console.log(`現有 BORDER_DATA 筆數：${existing.length}，最新日期：${latestDate}`);

  const newRows = [];
  let page = 0;
  outer:
  for (; page < MAX_LIST_PAGES; page++) {
    const url = page === 0 ? LIST_URL : `${LIST_URL}?idx=${page}`;
    const html = await httpGetRetry(url);
    const rows = parseListPage(html);
    if (rows.length === 0) break;
    for (const row of rows) {
      if (row.date <= latestDate) break outer; // 清單已由新到舊排序，遇到舊資料即可停止
      newRows.push(row);
    }
    await sleep(REQUEST_DELAY_MS);
  }

  console.log(`發現 ${newRows.length} 筆候選新資料（日期 > ${latestDate}）`);

  const newEntries = [];
  for (const row of newRows) {
    await sleep(REQUEST_DELAY_MS);
    const html = await httpGetRetry(DETAIL_URL + row.id);
    const detail = parseDetailPage(html, row.title);
    const month = parseInt(row.date.slice(5, 7), 10);
    const entry = {
      month, date: row.date,
      country: detail.country, item: detail.item,
      category: detail.category, violation: detail.violation, standard: detail.standard,
    };
    const key = entryKey(entry);
    if (existingKeys.has(key)) continue; // 已存在（例如重複公告），跳過
    existingKeys.add(key);
    newEntries.push(entry);
  }

  if (newEntries.length === 0) {
    console.log('沒有新資料，無需更新 data.js。');
    return;
  }

  // 依日期舊到新排序（與現有每月區塊內的排序慣例一致）
  newEntries.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  const usedColors = { ...CATEGORY_COLORS };
  const colorAdditions = {};
  for (const e of newEntries) {
    if (!usedColors[e.category]) {
      const c = categoryColor(e.category, usedColors);
      usedColors[e.category] = c;
      colorAdditions[e.category] = c;
    }
  }

  // data.js 使用 CRLF 換行，產生的內容與插入點都要配合，否則 regex 比對不到
  const eol = dataJs.includes('\r\n') ? '\r\n' : '\n';
  const lines = newEntries.map(e => {
    const f = v => JSON.stringify(v);
    return `  { month:${e.month}, date:${f(e.date)}, country:${f(e.country)}, item:${f(e.item)}, category:${f(e.category)}, violation:${f(e.violation)}, standard:${f(e.standard)} },`;
  });

  // 新資料月份較新，依現有慣例插入在陣列最前面（維持月份新到舊排序）
  let updated = dataJs.replace(
    /const BORDER_DATA = \[\r?\n/,
    `const BORDER_DATA = [${eol}${lines.join(eol)}${eol}`
  );
  if (updated === dataJs) {
    throw new Error('插入 BORDER_DATA 失敗：找不到比對位置，data.js 格式可能已變更');
  }

  if (Object.keys(colorAdditions).length > 0) {
    const additionsStr = Object.entries(colorAdditions)
      .map(([k, v]) => `'${k}': '${v}'`).join(', ');
    updated = updated.replace(
      /const BORDER_CAT_COLORS = \{\r?\n/,
      `const BORDER_CAT_COLORS = {${eol}  ${additionsStr},${eol}`
    );
    console.log('新增分類顏色：', colorAdditions);
  }

  fs.writeFileSync(DATA_JS_PATH, updated, 'utf8');
  console.log(`已新增 ${newEntries.length} 筆資料到 BORDER_DATA。`);
}

main().catch(err => {
  console.error('更新邊境查驗資料失敗：', err);
  process.exit(1);
});
