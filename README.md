# Week09 Lab：報名 API + 測試流程
## 環境需求
- Node.js 20.x（LTS）
- npm
- VS Code
- Postman
## 啟動步驟
- 進入server資料夾：
cd server

- 安裝套件：
npm install

- 建立.env檔案：
PORT=3001
ALLOWED_ORIGIN=http://127.0.0.1:5500,http://localhost:5173,*

- 開發模式啟動伺服器：
npm run dev

# 測試指令
GET http://localhost:3001/health

