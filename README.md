# AI API

本專案為 Node.js 應用程式，使用 Microsoft Foundry 的 API。

## 使用方式

1. 安裝相依套件

```bash
npm install
```

2. 建立 `.env` 檔案

在專案根目錄下建立 `.env` 檔案，並加入以下內容：

```dotenv
ENDPOINT=https://<your-foundry-endpoint>
API_KEY=<your-foundry-api-key>
```

3. 啟動專案

```bash
npm start
```

## 注意事項

- `.env` 中的 `ENDPOINT` 與 `API_KEY` 需填入你在 Microsoft Foundry 上建立時取得的值。
- `.env` 檔案不應該被提交到版本控制。