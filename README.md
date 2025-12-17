<p align="center">
  <img src="https://raw.githubusercontent.com/ahmomoz/Coding-bit/refs/heads/main/assets/images/logo.svg" alt="Coding-bit logo"/>
 
</p>

# Coding∞bit - 客製化程式教育預約平台

## 線上 Demo
<a href="https://coding-8bit.site">DEMO Link</a>

## 關於此專案
![custom course page screenshot](https://github.com/ahmomoz/Coding-bit/blob/main/assets/images/custom-course-page-screenshot.png)

現今網路科技發達越來越多人會在網路上學習知識，但網路上的資訊學習，缺乏完整性系統性架構、遇到特定小問題常常糾結很久，找不到相關解法。

我們希望可以打造一個環境，除了主題式連貫性的課程影片外，還可以讓學習者發佈學習需求，讓講師針對這個需求提供解答，錄製教學影片。

如果學習者還是不懂，可以再額外預約一對一課程，達到完整的學習體驗。

(此專案為六角學院 2024 React 專題班學員自行規劃開發之專題網站，並非真實營運)

### 相關資料連結
<a href="https://miro.com/app/board/uXjVL5tHg3s=/?share_link_id=342388860444">網站地圖 & 線稿圖 & 流程圖</a>

## Development Guide
<a href="https://hackmd.io/qRg-uB1fRwm8eiczTjfoPA?view">Development Guide Link</a>

## 測試用帳號
已通過所有權限的現成帳號，可直接拿來登入測試

帳號：custommadesite@gmail.com
</br>密碼：Test@1234

## 使用技術
* **前端框架**：React + Vite
* **後端技術**：Node.js
* **資料庫**：PostgreSQL
* **部署平台**：Render + Firebase
* **CSS 技術**：Bootstrap 5 + SCSS

## 使用套件
* Bootstrap 5
* React Router
* React Hook Form
* react-helmet-async
* Redux Toolkit
* Sweetalert2
* Swiper
* Axios
* AOS
* ReactQuill (文字編輯器)
* styled-components (CSS-in-JS)
* clsx
* React Datepicker
* DOMPurify
* react-rating-stars-component (評分星星)
* react-medium-image-zoom (圖片放大)

## 資料夾結構

```
📂 src/ # 主程式碼目錄
├── 📂 api/                      # API 請求管理
│ 
├── 📂 assets/                   # 靜態資源
│ └── 📂 scss/                   # SCSS 樣式
│     ├── 📂 base/               # 基本樣式
│     ├── 📂 components/         # 元件樣式
│     ├── 📂 layout/             # 佈局樣式
│     ├── 📂 pages/              # 頁面樣式
│     ├── 📂 utils/              # 工具類樣式
│     └── 📂 vendors/            # 第三方樣式
│
├── 📂 components/               # 可重複使用的元件
│ ├── 📂 auth/                   # 登入註冊頁面相關元件
│ ├── 📂 common/                 # 公用元件
│ │   ├── 📂 booking-record/     # 預約紀錄元件
│ │   ├── 📂 payment-form/       # 付款表單元件
│ │   └── 📂 profile/            # 個人檔案元件
│ ├── 📂 course/                 # 課程頁面相關元件
│ │   └── 📂 detail-page/        # 課程詳情頁元件
│ ├── 📂 custom-request/          # 客製化課程頁面相關元件
│ ├── 📂 help-center/            # 幫助中心頁面相關元件
│ ├── 📂 layout/                 # 佈局元件
│ ├── 📂 subscription/           # 訂閱頁面相關元件
│ ├── 📂 tutor/                  # 講師頁面相關元件
│ └── 📂 tutor-panel/            # 講師後台
│     ├── 📂 booking/            # 預約管理
│     │   ├── 📂 all-bookings/   # 所有預約
│     │   └── 📂 available-time/ # 可預約時間
│     ├── 📂 course/             # 課程管理
│     │   ├── 📂 add/            # 新增課程
│     │   ├── 📂 course-list/    # 課程列表
│     │   └── 📂 edit/           # 編輯課程
│     └── 📂 profile/            # 講師個人檔案
│
├── 📂 data/              # 存放資料數據的資料夾 (未使用 API 獲取的資料)
│
├── 📂 hooks/                    # React 自訂 Hook
│
├── 📂 pages/                    # 頁面
│ ├── 📂 student/                # 學生專區
│ ├── 📂 tutor/                  # 講師專區
│ │   ├── 📂 bookings/           # 預約管理頁面
│ │   ├── 📂 courses/            # 課程管理頁面
│ │   │   ├── 📂 course/         # 課程
│ │   │   └── 📂 video/          # 影片
│ │   └── 📂 profile/            # 講師個人資料
│ └── 📂 user/                   # 前台使用者相關頁面
│     ├── 📂 auth/               # 登入註冊相關頁面
│     ├── 📂 course/             # 課程相關頁面
│     │   └── 📂 detail-page/    # 課程詳情頁
│     ├── 📂 custom-request/      # 客製化課程相關頁面
│     ├── 📂 subscription/       # 訂閱流程相關頁面
│     └── 📂 tutor/              # 講師相關頁面
│
├── 📂 router/                   # 路由管理
│
└── 📂 utils/                    # 工具函式
    ├── 📂 schema/               # 資料驗證 Schema
    └── 📂 slice/                # Redux 切片
```

## Node.js 版本

- 專案的 Node.js 版本需為 v16 以上
- 查看自己版本指令：`node -v`

## 指令列表

- `npm install` - 初次下載該範例專案後，需要使用 npm install 來安裝套件
- `npm run dev` - 執行開發模式
  - 若沒有自動開啟瀏覽器，可嘗試手動在瀏覽器上輸入
    `http://localhost:5173/<專案名稱>/pages/index.html`
- `npm run build` - 執行編譯模式（不會開啟瀏覽器）
- `npm run deploy` - 自動化部署

### 注意事項

- 已將 pages 資料夾內的 index.html 預設為首頁，建議不要任意修改 index.html 的檔案名稱
- .gitignore 檔案是用來忽略掉不該上傳到 GitHub 的檔案（例如 node_modules），請不要移除 .gitignore

## 開發模式的監聽

vite 專案執行開發模式 `npm run dev` 後即會自動監聽，不需要使用 `Live Sass Compiler` 的 `Watch SCSS` 功能

## 部署 gh-pages 流程說明

### Windows 版本

1. 在 GitHub 建立一個新的 Repository

2. 部署前請務必先將原始碼上傳到 GitHub Repository 也就是初始化 GitHub，因此通常第一步驟會在專案終端機輸入以下指令

```cmd
git init # 若已經初始化過就可以不用輸入
git add .
git commit -m 'first commit'
git branch -M main
git remote add origin [GitHub Repositories Url]
git push -u origin main // 僅限第一次輸入，往後只需要輸入 git push
```

3. 修改 vite.config.js 第 28 行，將你的 Github Repo 的名字填入

4. 初始化完畢後，執行 `npm run deploy` 指令進行自動化部署

## 團隊成員

<table>
  <tbody style="border: none"> 
     <tr style="border: none;">
        <td align="center" valign="top" width="14.28%" style="border:none"><a href="https://github.com/ahmomoz"><img src="https://avatars.githubusercontent.com/u/134830436?v=4" width="100px;" alt="MY"/><br /><sub><b>MY</b></sub></a></td>
        <td align="center" valign="top" width="14.28%" style="border:none"><a href="https://github.com/z111048"><img src="https://avatars.githubusercontent.com/u/147981540?v=4" width="100px;" alt="詹姆士"/><br /><sub><b>詹姆士</b></sub></a></td>
        <td align="center" valign="top" width="14.28%" style="border:none"><a href="https://github.com/joker-cat"><img src="https://avatars.githubusercontent.com/u/67618773?v=4" width="100px;" alt="Chia Pin"/><br /><sub><b>Chia Pin</b></sub></a></td>
        <td align="center" valign="top" width="14.28%" style="border:none"><a href="https://github.com/annnnangan"><img src="https://avatars.githubusercontent.com/u/110728860?v=4" width="100px;" alt="Anna"/><br /><sub><b>Anna</b></sub></a></td>
    <tr>
  </tbody>
</table>

* 主導專題進度規劃與環境建置： MY
* 後端開發： 詹姆士
* 簡報製作： anna
* 資料建構： 詹姆士、Chia Pin
* 教練： Antonio
* UI / UX 設計師： F Selina

## 聯絡方式

- **Email**: custommadesite@gmail.com
- **GitHub**: [GitHub 頁面](https://github.com/ahmomoz/Coding-8bit)

