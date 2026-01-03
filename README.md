# CoolCal Pro - ASHRAE Standard Calculator

專為空調工程設計的 ASHRAE 標準負載計算工具。

## 功能特點

- **雙語支持**: 提供繁體中文與法文界面。
- **ASHRAE 標準**: 內建各種空間類型的基準負載係數。
- **環境因素調整**: 考慮日照、隔熱、人員及電子設備負載。
- **多單位輸出**: 同時顯示 kW, BTU, HP 計算結果。
- **AI 輔助分析**: 整合 Google Gemini 提供專業建議 (開發中)。

## 開發指南

### 環境準備

確保您的電腦已安裝 [Node.js](https://nodejs.org/) (建議版本 v20+)。

### 快速開始

1. **安裝套件**:
   ```bash
   npm install
   ```

2. **本地開發**:
   ```bash
   npm run dev
   ```

3. **專案打包**:
   ```bash
   npm run build
   ```

## 部署與 CI/CD

本專案已設定 GitHub Actions。當代碼推送到 `main` 分支時，會自動觸發部署至 GitHub Pages。

### 首次部署設定 (重要)

由於使用了 GitHub Actions 進行部署，您需要手動在 GitHub 儲存庫中開啟權限：

1. 進入 GitHub Repository 的 **Settings**。
2. 點擊左側選單的 **Pages**。
3. 在 **Build and deployment** > **Source** 下方，將選項從 `Deploy from a branch` 改為 **`GitHub Actions`**。
4. (選填) 如果您使用的是多層目錄或自定義域名，請在該頁面進行相應設定。

### 設定密鑰

請在 GitHub Repository 的 Settings > Secrets and variables > Actions 中新增以下密鑰：
- `GEMINI_API_KEY`: 用於 AI 分析功能的 Google Gemini API Key。

## 技術棧

- **Core**: React 19, TypeScript
- **Tooling**: Vite
- **Styling**: Tailwind CSS
- **AI**: @google/genai (Gemini SDK)

## 授權

MIT License 
