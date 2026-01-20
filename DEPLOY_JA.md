# Docker デプロイメントガイド

[中文](DEPLOY.md) | [日本語](DEPLOY_JA.md) | [English](DEPLOY_EN.md)

このガイドでは、Fuel & Maintenance Tracker アプリケーションをパッケージ化し、Docker Hub に公開して、NAS やその他のサーバーにデプロイする方法について説明します。

## 前提条件

1.  **Docker Desktop** がインストールされ、実行されていること。
    *   **Windows 用ダウンロード**: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
    *   *注意: インストール中に "Use WSL 2 instead of Hyper-V" が選択されていることを確認してください。インストール後に再起動が必要になる場合があります。*
2.  **Docker Hub** アカウントを持っていること（[hub.docker.com](https://hub.docker.com/) で登録してください）。
3.  ターミナル/コマンドプロンプトが使用できること。

## ステップ 1: Docker Hub にログイン

ターミナルを開き、Docker Hub アカウントにログインします。

```bash
docker login
```

プロンプトが表示されたら、ユーザー名とパスワード（またはアクセストークン）を入力します。

## ステップ 2: イメージのビルド

プロジェクトのルートディレクトリで以下のコマンドを実行します。`your-username` を実際の Docker Hub ユーザー名に置き換えてください。

```bash
# タグ（version 1.0 および latest）を付けてビルド
docker build -t your-username/fuel-tracker:1.0 -t your-username/fuel-tracker:latest .
```

*   `your-username`: あなたの Docker Hub ユーザー名。
*   `fuel-tracker`: リポジトリに付けたい名前。
*   `.`: Dockerfile が現在のディレクトリにあることを示します。

## ステップ 3: Docker Hub へプッシュ

ビルドしたイメージをレジストリにプッシュします。

```bash
docker push your-username/fuel-tracker:1.0
docker push your-username/fuel-tracker:latest
```

完了すると、`https://hub.docker.com/r/your-username/fuel-tracker` でリポジトリを確認できます。

## ステップ 4: デプロイ (実行)

アプリケーションを実行する（例：NAS 上で）には、以下の `docker run` コマンドを使用します。

**重要**: SQLite データベースを永続化するためにボリュームをマウントする必要があります。そうしないと、コンテナが再起動したときにデータが失われます。

```bash
docker run -d \
  --name fuel-tracker \
  -p 9521:9521 \
  -v ./data:/app/prisma/db \
  -e DATABASE_URL="file:/app/prisma/db/dev.db" \
  --restart unless-stopped \
  your-username/fuel-tracker:latest
```

*   `-p 9521:9521`: コンテナのポート 9521 をホストのポート 9521 にマッピングします。
*   `-v ./data:/app/prisma/db`: ローカルフォルダ `./data` をコンテナのデータベースフォルダにマッピングします。**ローカルに `./data` フォルダが存在することを確認してください。**
*   `-e DATABASE_URL=...`: コンテナ内のどこでデータベースファイルを探すかを Prisma に指示します。

## アーキテクチャとポート

*   **ポート**: アプリケーションはデフォルトでポート `9521` で実行されます。
*   **データベース**: SQLite を使用します。データベースファイルはデフォルトで `prisma/dev.db` にありますが、永続化のために `DATABASE_URL` でオーバーライドしています。

## トラブルシューティング

NAS 上でデータベースファイルの権限エラーが発生した場合:
1.  マウントされたローカルディレクトリに書き込み権限があることを確認してください。
2.  ディレクトリの権限を調整する必要がある場合があります（例: `chmod 777 ./data`）。
