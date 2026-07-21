# レストラン座席予約・管理システム

レストランの座席予約と店舗運営をリアルタイムで管理する Web アプリケーションです。
お客様はオンラインで空席を確認して予約でき、スタッフ・管理者は予約状況やテーブル状態を一元管理できます。

**🔗 デモサイト: [bistro-lumiere.vercel.app](https://bistro-lumiere.vercel.app)**

> 🚧 現在フロントエンド（全19画面）がモックAPIで動作する状態です。バックエンド（Spring Boot）と WebSocket によるリアルタイム連携は開発予定です。

## 主な機能

### お客様（GUEST / CUSTOMER）
- 日付・時間帯・人数を指定して空席検索
- テーブル組み合わせの自動提案（無駄席 ≤ 2、最大3卓）
- 予約の即時確定（1〜8名）／スタッフ承認フロー（9〜16名、10分で自動キャンセル）
- 会員登録・ログイン、マイページ（予約一覧・キャンセル・ポイント履歴）

### スタッフ（STAFF）
- ダッシュボード（稼働率・本日の予約状況）
- 承認待ち予約の承認／拒否（残り時間カウントダウン付き）
- 予約ステータス管理（来店・会計・無断キャンセル）
- テーブル状態ボード（ゾーン別フロアマップ）

### 管理者（ADMIN）
- スタッフアカウント管理
- テーブルマスタ管理
- 営業時間帯マスタ管理

## 技術スタック

| 分類 | 技術 |
|---|---|
| フロントエンド | React 19 / Vite / JavaScript |
| ルーティング | React Router（`React.lazy` によるコード分割） |
| 状態管理 | Zustand |
| UI | Tailwind CSS v4 / shadcn/ui / Lucide Icons |
| HTTP クライアント | Axios（共通クライアント `src/api/client.js`） |
| バックエンド（予定） | Java / Spring Boot / PostgreSQL |
| リアルタイム（予定） | Spring WebSocket（STOMP） |
| 認証（予定） | Spring Security + JWT |

## 画面構成（全19画面）

| 区分 | 画面 |
|---|---|
| お客様 | SC-C01〜C11（予約開始 → 席選択 → 情報入力 → 確認 → 完了／承認待ち、ログイン、新規登録、マイページ、予約一覧、ポイント履歴） |
| スタッフ | SC-S01〜S05（ログイン、ダッシュボード、承認待ち一覧、予約管理、テーブル状態ボード） |
| 管理者 | SC-A01〜A03（スタッフ管理、テーブル管理、時間帯管理） |

## セットアップ

```bash
cd frontend
npm install
npm run dev
```

http://localhost:5173 で起動します（現在はモックAPIのため、バックエンド不要で全画面を確認できます）。

## プロジェクト構成

```
frontend/src/
├── api/          # APIクライアント・モックAPI（// TODO [BACKEND] で接続箇所を明示）
├── store/        # Zustand ストア（認証など）
├── pages/        # 画面（customer / staff / admin）
├── components/   # 共通コンポーネント（Layout, Modal, TableCard など）
│   └── ui/       # shadcn/ui コンポーネント
├── hooks/        # カスタムフック（WebSocket・カウントダウン）
└── styles/       # 共通スタイル
```

## 設計書

日本語の設計書一式をリポジトリ直下に格納しています。

- システム設計書（全体概要）
- API設計書（約30エンドポイント、権限4種、WebSocket トピック）
- DB設計書（7テーブル、テーブル組み合わせアルゴリズム）
- 画面設計書（全19画面）

## 今後の予定

- [ ] Spring Boot による REST API 実装
- [ ] Spring Security + JWT 認証
- [ ] WebSocket（STOMP）によるテーブル状態・予約のリアルタイム同期
- [ ] PostgreSQL スキーマ構築・テーブル組み合わせアルゴリズム実装
