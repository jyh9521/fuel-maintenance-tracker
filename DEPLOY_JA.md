# 🐳 Docker デプロイメントガイド

[中文](DEPLOY.md) | [日本語](DEPLOY_JA.md) | [English](DEPLOY_EN.md)

このガイドでは、Docker を使用して Fuel & Maintenance Tracker アプリケーションをデプロイする方法を説明します。Docker Hub から既成のイメージをプルするか、独自にビルドして公開することができます。

## 📦 方法 1: Docker Hub イメージを使用（推奨）

### クイックスタート

```bash
# データディレクトリを作成
mkdir -p ./data

# コンテナを実行
docker run -d \
  --name fuel-tracker \
  -p 9521:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  jyh9521/fuel-tracker:latest
```

### アプリケーションへのアクセス

デプロイが成功したら、ブラウザでアクセスします：
- ローカルアクセス：`http://localhost:9521`
- ネットワークアクセス：`http://サーバーのIP:9521`

### Docker Compose を使用

`docker-compose.yml` ファイルを作成します：

```yaml
version: '3.8'

services:
  fuel-tracker:
    image: jyh9521/fuel-tracker:latest
    container_name: fuel-tracker
    ports:
      - "9521:9521"
    volumes:
      - ./data:/app/prisma/db
    environment:
      - DATABASE_URL=file:/app/prisma/db/dev.db
      - NODE_ENV=production
    restart: unless-stopped
```

次に実行します：
```bash
docker-compose up -d
```

## 🛠️ 方法 2: 独自のイメージをビルド

### 前提条件

1. **Docker Desktop** がインストールされ、実行されていること
   - **Windows 用ダウンロード**: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - *注意: インストール時に「Use WSL 2 instead of Hyper-V」を選択してください。再起動が必要な場合があります*
2. **Docker Hub** アカウントを持っていること（[hub.docker.com](https://hub.docker.com/) で登録）
3. ターミナル/コマンドプロンプトが使用できること

### ステップ 1: Docker Hub にログイン

```bash
docker login
```

プロンプトが表示されたら、ユーザー名とパスワード（またはアクセストークン）を入力します。

### ステップ 2: イメージのビルド

プロジェクトのルートディレクトリで以下のコマンドを実行します。`your-username` を実際の Docker Hub ユーザー名に置き換えてください。

```bash
# タグ（version 1.0 および latest）を付けてビルド
docker build -t your-username/fuel-tracker:1.0 -t your-username/fuel-tracker:latest .
```

**パラメータの説明**：
- `your-username`: Docker Hub ユーザー名
- `fuel-tracker`: イメージのリポジトリ名
- `.`: Dockerfile が現在のディレクトリにあることを示します

### ステップ 3: Docker Hub へプッシュ

```bash
docker push your-username/fuel-tracker:1.0
docker push your-username/fuel-tracker:latest
```

完了すると、`https://hub.docker.com/r/your-username/fuel-tracker` でリポジトリを確認できます。

### ステップ 4: デプロイと実行

```bash
docker run -d \
  --name fuel-tracker \
  -p 9521:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  your-username/fuel-tracker:latest
```

## 📋 環境変数

| 変数名 | 説明 | デフォルト値 | 必須 |
|--------|------|--------------|------|
| `DATABASE_URL` | SQLite データベースファイルのパス | `file:./dev.db` | はい |
| `PORT` | アプリケーションポート | `9521` | いいえ |
| `NODE_ENV` | 実行環境 | `production` | いいえ |

## 💾 データの永続化

**重要**: データを永続化するために必ずボリュームをマウントしてください！

```bash
-v ./data:/app/prisma/db
```

これにより、SQLite データベースファイルがホストの `./data` ディレクトリに保存され、コンテナの再起動後もデータが保持されます。

**推奨**: `./data` ディレクトリ内のデータベースファイルを定期的にバックアップしてください。

## 🔧 よく使うコマンド

```bash
# コンテナログを表示
docker logs fuel-tracker

# ログをリアルタイムで表示
docker logs -f fuel-tracker

# コンテナの状態を確認
docker ps | grep fuel-tracker

# コンテナを再起動
docker restart fuel-tracker

# コンテナを停止
docker stop fuel-tracker

# コンテナを起動
docker start fuel-tracker

# コンテナを削除
docker rm -f fuel-tracker
```

## 🔄 アプリケーションの更新

```bash
# 1. 最新のイメージをプル
docker pull jyh9521/fuel-tracker:latest

# 2. 古いコンテナを停止して削除
docker stop fuel-tracker
docker rm fuel-tracker

# 3. 新しいイメージでコンテナを起動
docker run -d \
  --name fuel-tracker \
  -p 9521:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  jyh9521/fuel-tracker:latest
```

## 🐛 トラブルシューティング

### データベースの権限エラー

NAS でデータベースファイルの権限エラーが発生した場合：

```bash
# マウントされたディレクトリに書き込み権限があることを確認
chmod 777 ./data
```

### ポートの競合

ポート 9521 が既に使用されている場合、別のポートにマッピングできます：

```bash
docker run -d \
  --name fuel-tracker \
  -p 8080:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  jyh9521/fuel-tracker:latest
```

その後、`http://localhost:8080` でアクセスします。

### コンテナが起動しない

詳細なログを確認して問題を診断します：

```bash
docker logs fuel-tracker
```

### データベースファイルの破損

データベースファイルが破損した場合、削除して再初期化できます：

```bash
# コンテナを停止
docker stop fuel-tracker

# 古いデータをバックアップ（オプション）
cp ./data/dev.db ./data/dev.db.backup

# データベースファイルを削除
rm ./data/dev.db

# コンテナを再起動 - アプリが自動的に新しいデータベースを作成
docker start fuel-tracker
```

## 🏗️ アーキテクチャ

- **フレームワーク**: Next.js 16 (App Router)
- **データベース**: Prisma + SQLite
- **ランタイム**: Node.js 20
- **ポート**: 9521（カスタマイズ可能）
- **データストレージ**: SQLite ファイルデータベース

## 💡 ベストプラクティス

1. **データバックアップ**: `./data` ディレクトリを定期的にバックアップ
2. **Docker Compose を使用**: 管理とバージョン管理が容易
3. **リバースプロキシ**: Nginx または Traefik を使用して HTTPS サポートを追加
4. **リソース制限**: 本番環境ではメモリと CPU の制限を設定
5. **ログ管理**: ログローテーションを設定して大きなログファイルを防ぐ

## 📱 サポートされているプラットフォーム

- ✅ Docker (Linux/amd64)
- ✅ NAS デバイス (Synology, QNAP など)
- ✅ クラウドサーバー (AWS, Azure, GCP など)
- ✅ ローカル開発環境

## 📄 ライセンス

MIT License
