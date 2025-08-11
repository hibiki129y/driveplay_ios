# DrivePlay - React Native iOS App

ドライブ中に2〜6名が安全に・短時間で・盛り上がれるモバイルゲーム集

## 概要

DrivePlayは運転中の同乗者向けエンターテイメントアプリです。3つのゲーム（Talk Dice、Ito、Insider）とゲームレコメンド機能を提供し、安全性を重視したUI設計となっています。

## 機能

### ゲーム
- **Talk Dice（話題サイコロ）**: 200+の会話トピック
- **Ito（簡易版）**: 1-100の数字当てゲーム
- **Insider（内通者）**: 推理ゲーム、300+の日本語単語

### その他機能
- ゲームレコメンドシステム（4基準による重み付け）
- シングル端末オフラインプレイ
- マルチ端末同期プレイ（β版）
- 安全重視UI（大ボタン、ダークテーマ、運転手操作禁止警告）

## セットアップ

### 前提条件
- Node.js 18+
- npm
- iOS開発環境（Xcode）
- Expo CLI

### インストール
```bash
git clone https://github.com/hibiki129y/driveplay_ios.git
cd driveplay_ios
npm install
```

### 開発サーバー起動
```bash
npm start
```

### iOS実機/シミュレーター
```bash
npm run ios
```

## EAS Build

### iOS Preview Build
```bash
eas build --platform ios --profile preview
```

### 本番Build
```bash
eas build --platform ios --profile production
```

## 環境変数

マルチ端末同期機能を使用する場合は、`.env`ファイルを作成してください：

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## ブランチ戦略

- `main`: 本番ブランチ（直接pushは禁止）
- `old.main`: 旧メインブランチ
- `devin/*`: 機能開発ブランチ

## 安全性について

⚠️ **重要**: 運転手の方は操作をしないでください。同乗者の方が操作してください。

## ライセンス

MIT License
