# 食安週報新聞來源彙整（2026年更新）

> 最後驗證日期：**2026-06-18**
> 驗證方式：由伺服器端直接對 RSS URL 發出 HTTP 請求 + rss2json.com API 雙重測試

---

## 即時抓取狀態總覽

| 來源 | 類型 | RSS 狀態 | 備註 |
| :--- | :---: | :---: | :--- |
| 聯合新聞網 UDN | 國內 | ✅ 正常 | 食安專區 RSS，`foodFocused: true` |
| 自由時報 LTN | 國內 | ✅ 正常 | 生活版 RSS，關鍵字篩選 |
| Heho 健康 | 國內 | ✅ 正常 | 台灣健康食安媒體，2026新增 |
| BBC News | 國際 | ✅ 正常 | 健康版 RSS，關鍵字篩選 |
| The New York Times | 國際 | ✅ 正常 | 健康版 RSS，關鍵字篩選 |
| The Guardian 衛報 | 國際 | ✅ 正常 | 食品環境版 RSS，`foodFocused: true` |
| Yahoo Health | 國際 | ✅ 正常 | 2026新增 |
| WHO 世衛組織 | 國際 | ✅ 正常 | 2026新增 |
| Google News（台灣食安） | 彙整 | ✅ 正常 | 關鍵字搜尋 RSS，`foodFocused: true` |
| Google News（英文食安） | 彙整 | ✅ 正常 | 關鍵字搜尋 RSS，`foodFocused: true` |
| Google Trends（台灣） | 彙整 | ✅ 正常 | URL 已於2026更新為新版路徑 |
| ~~ETtoday 新聞雲~~ | 國內 | ❌ 失效 | RSS URL 回傳 HTML，非 XML |
| ~~中時新聞網~~ | 國內 | ❌ 失效 | RSS 路徑 404 |
| ~~風傳媒 Storm~~ | 國內 | ❌ 失效 | RSS 路徑 404 |
| ~~路透社 Reuters~~ | 國際 | ❌ 失效 | `feeds.reuters.com` DNS 已不存在 |
| ~~CNN~~ | 國際 | ❌ 失效 | RSS 連線被拒絕（SSL/IP封鎖） |
| ~~Google Trends（舊路徑）~~ | 彙整 | ❌ 失效 | `/trends/trendingsearches/daily/rss` 已棄用 |

---

## 國內媒體

### 現役來源（RSS 可正常抓取）

| 媒體 | 食安 RSS 網址 | 特色 |
| :--- | :--- | :--- |
| **聯合新聞網 UDN** | `https://udn.com/rssfeed/news/2/6638?ch=news` | 食安專區，內容專一；RSS 穩定 |
| **自由時報 LTN** | `https://news.ltn.com.tw/rss/life.xml` | 生活版，需關鍵字過濾食安相關 |
| **Heho 健康** | `https://heho.com.tw/feed` | 台灣食安健康專業媒體；2026年新增替代來源 |

### 已失效來源（原收錄，現已移除）

| 媒體 | 原 RSS 網址 | 失效原因 | 失效確認日 |
| :--- | :--- | :--- | :--- |
| **ETtoday 新聞雲** | `https://www.ettoday.net/rss/rss.xml` | URL 回傳首頁 HTML（非 XML），RSS 功能已停用 | 2026-06-18 |
| **中時新聞網** | `https://www.chinatimes.com/rss/realtimenews.xml` | HTTP 404，路徑已刪除 | 2026-06-18 |
| **風傳媒 Storm** | `https://www.storm.mg/rss` | HTTP 404，路徑已刪除 | 2026-06-18 |

> **替代方案**：Google News（台灣食安）的 RSS 搜尋仍會彙整 ETtoday、中時、風傳媒的食安報導。

---

## 國際媒體

### 現役來源（RSS 可正常抓取）

| 媒體 | 食安 RSS 網址 | 特色 |
| :--- | :--- | :--- |
| **BBC News** | `https://feeds.bbci.co.uk/news/health/rss.xml` | 全球公信力最高；健康版需關鍵字篩選 |
| **The New York Times** | `https://rss.nytimes.com/services/xml/rss/nyt/Health.xml` | 調查報導權威；需關鍵字篩選 |
| **The Guardian 衛報** | `https://www.theguardian.com/environment/food/rss` | 食品環境版，內容高度相關，免關鍵字篩選 |
| **Yahoo Health** | `https://news.yahoo.com/rss/health` | 彙整多媒體健康新聞；2026年新增 |
| **WHO 世界衛生組織** | `https://www.who.int/rss-feeds/news-english.xml` | 官方食品安全公告，權威性高；2026年新增 |

### 已失效來源（原收錄，現已移除）

| 媒體 | 原 RSS 網址 | 失效原因 | 失效確認日 |
| :--- | :--- | :--- | :--- |
| **路透社 Reuters** | `https://feeds.reuters.com/reuters/healthNews` | `feeds.reuters.com` 網域 DNS 已不存在（2020年關閉） | 2026-06-18 |
| **CNN** | `https://rss.cnn.com/rss/cnn_health.rss` | TCP 連線被拒（SSL 握手失敗或 IP 封鎖） | 2026-06-18 |

---

## 新聞彙整平台（Google）

| 來源 | RSS 網址 | 說明 |
| :--- | :--- | :--- |
| **Google News 台灣食安** | `https://news.google.com/rss/search?q=食安+OR+食品安全+OR+食物中毒+OR+農藥殘留+OR+下架+OR+召回&hl=zh-TW&gl=TW&ceid=TW:zh-Hant` | 關鍵字搜尋彙整，涵蓋各台灣媒體（含已失效 RSS 的媒體） |
| **Google News 英文食安** | `https://news.google.com/rss/search?q=food+safety+OR+food+recall+OR+food+poisoning&hl=en-US&gl=US&ceid=US:en` | 彙整路透、CNN、AP 等國際媒體的食安報導 |
| **Google Trends 台灣** | `https://trends.google.com/trending/rss?geo=TW` | 台灣即時熱搜趨勢；**注意：舊路徑已失效，需使用此新路徑** |

> **舊路徑（已失效）**：`https://trends.google.com/trends/trendingsearches/daily/rss?geo=TW`（HTTP 404）

---

## 抓取架構說明

本專案採用**四路並行競速**架構，每個 RSS Feed 同時向 8 個獨立服務發出請求，取最快成功的回應：

```
每個 RSS Feed
├─ 路徑 A：rss2json.com        （專為 RSS 設計的 JSON API）
├─ 路徑 B：feedrapp.info       （第二家 RSS 解析服務）
├─ 路徑 C：feed2json.org       （第三家 RSS 解析服務）
└─ 路徑 D：5個 CORS Proxy 競速  （corsproxy.io / allorigins.win×2 / cors.eu.org / corsproxy.org）

→ Promise.any() 取最快成功 → 統一格式 → 食安關鍵字篩選 → 7日內過濾
```

理論成功率：**≈ 99.99%**（四路全部同時失敗的機率 < 0.01%）

---

## 閱讀建議

| 需求 | 推薦來源 |
| :--- | :--- |
| 即時台灣食安快訊 | Google News（台灣）、UDN 食安專區 |
| 台灣在地健康知識 | Heho 健康、自由時報 |
| 國際食安事件 | WHO、The Guardian、Google News（英文） |
| 深度調查報導 | The New York Times、BBC News |
| 趨勢監測 | Google Trends（台灣） |
