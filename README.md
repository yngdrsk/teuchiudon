
### **モノレポ構成のセットアップとデプロイ手順（最小構成）**

---

### ステップ1: AWS EC2インスタンスの準備

学習用バックエンドサーバーを無料で構築します。

- [ ] **EC2インスタンスの作成**
  - **AWS マネジメントコンソール**にログインし、EC2ダッシュボードへ移動します。
  - 「インスタンスを起動」をクリックします。
  - **名前**: `learning-laravel-api`
  - **AMI**: 「無料利用枠の対象」である `Ubuntu 22.04 LTS` を選択します。
  - **インスタンスタイプ**: `t2.micro` または `t3.micro` を選択します。
  - **キーペア**: 新しいキーペアを作成し、`.pem` ファイルをダウンロードして**安全な場所**に保管します。これがSSH接続に必要な鍵です。
  - **ネットワーク設定**:
    - `新しいセキュリティグループを作成`を選択。
    - **インバウンドルール**に以下を追加します。
      - SSH (ポート22): `自分のIP`
      - HTTP (ポート80): `どこからでも`
      - HTTPS (ポート443): `どこからでも`

- [ ] **SSH接続の確認**
  - `chmod 400 your-key.pem` でキーファイルの権限を変更します。
  - `ssh -i your-key.pem ubuntu@<EC2パブリックIP>` で接続できることを確認します。

- [ ] **Elastic IPの割り当て**
  - EC2ダッシュボードの左メニューから「Elastic IP」を選択し、「Elastic IPアドレスの割り当て」をクリックします。
  - 作成したElastic IPを、先ほど作成したEC2インスタンスに関連付けます。これにより、インスタンスを再起動してもIPアドレスが変わりません。

### ステップ2: EC2サーバー環境の構築

SSH接続したEC2上で、Laravelを動作させるための環境を整えます。

- [ ] **システムアップデート**
  - `sudo apt update && sudo apt upgrade -y`

- [ ] **必要ソフトウェアのインストール**
  - `sudo apt install -y nginx php-fpm php-cli php-mbstring php-xml php-zip php-mysql php-curl php-json composer git`
  - DBとしてPostgresを使う場合は、`postgresql`と`php-pgsql`もインストールします。

- [ ] **Nginx設定**
  - `/etc/nginx/sites-available/default` を編集し、`root` ディレクティブをLaravelの `public` ディレクトリ（例: `/var/www/my-app/backend/public`）に設定します。
  - `sudo service nginx restart` でNginxを再起動します。

### ステップ3: GitHub Actionsのセットアップ

GitHub Actionsを使用して、Laravelバックエンドのデプロイを自動化します。

- [ ] **GitHub Secretsの設定**
  - GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」へ移動します。
  - 「New repository secret」をクリックし、以下の2つを追加します。
    - `EC2_HOST`: EC2インスタンスの**Elastic IP**
    - `EC2_SSH_KEY`: **EC2キーペアの秘密鍵（.pemファイルの中身全体）**をコピーして貼り付けます。

- [ ] **デプロイワークフローファイルの作成**
  - Monorepoのルートディレクトリに `.github/workflows/deploy.yml` ファイルを作成し、ご提示いただいたYAMLコードを貼り付けます。

- [ ] **SSH接続先のディレクトリ作成**
  - EC2にSSH接続し、`sudo mkdir -p /var/www/my-app` でプロジェクトを配置するディレクトリを作成します。

- [ ] **EC2でのGit設定**
  - EC2ユーザー（`ubuntu`）にSSHキーを登録し、GitHubからクローンできるように設定します。
  - `ssh-keygen -t ed25519 -C "github-ec2"` で鍵を生成し、公開鍵をGitHubのデプロイキーとして設定します。

ステップ3まで完了し、まだLaravelプロジェクトがローカルにない状態を踏まえて、ステップ4以降の進め方を整理。

これまでの作業は「AWS EC2という箱と、GitHub Actionsという自動デプロイの仕組み」を準備した段階です。ここからは、実際にその箱の中身（Laravel/Reactプロジェクト）を作り、準備した仕組みを使ってクラウドに展開する作業に入ります。

-----

承知しました。ローカル開発環境にLaravel Sailを使用することを前提に、手順を再構成します。

-----

### ステップ4: ローカルでのプロジェクト作成と開発 (Laravel Sail / PostgreSQL対応版)

Sailを使うことで、Dockerの知識がなくてもローカルでLaravelとPostgreSQLの環境を簡単に構築できます。

  - [ ] **モノレポのディレクトリを完成させる**

      - **`my-app`ディレクトリ**に移動します。
      - 以下のコマンドで、Laravelプロジェクトを`backend`ディレクトリに作成します。
        ```bash
        composer create-project "laravel/laravel=10.*" backend
        ```
      - 次に、Reactプロジェクトを`frontend`ディレクトリに作成します。
        ```bash
        npm create vite@latest frontend -- --template react
        ```
      - backendディレクトリに移動して、postgreSQLなど必要そうなパッケージをインストールしておきます。
        ```bash
        cd backend
        php artisan sail:install --with=pgsql,redis,meilisearch,mailpit,selenium
        ```

  - [ ] **Laravel Sailのセットアップ**

      - `backend`ディレクトリに移動し、Sailを起動します。これにより、PostgreSQLを含むDockerコンテナが立ち上がります。
        ```bash
        cd backend
        ./vendor/bin/sail up -d
        ```
          * `-d`オプションは、バックグラウンドでコンテナを実行するものです。
      - `.env`ファイルを確認すると、DB接続情報がすでにPostgreSQL用に設定されているはずです。
        ```ini
        DB_CONNECTION=pgsql
        DB_HOST=pgsql
        DB_PORT=5432
        DB_DATABASE=laravel
        DB_USERNAME=sail
        DB_PASSWORD=password
        ```

  - [ ] **API連携の設定**

      - `frontend`ディレクトリに移動し、`.env.local`ファイルを作成して以下の内容を記述します。
        ```ini
        VITE_API_URL=http://localhost/api
        ```
          * Sailは、LaravelのAPIを`localhost`のルート（ポート80）で提供するため、`http://localhost`を指定します。

-----

### ステップ5: GitHub ActionsとVercelへのデプロイ準備

ローカルのプロジェクトができたので、次にクラウドへのデプロイ準備をします。

  - [ ] **GitHubへのコミットとプッシュ**

      - `my-app`ディレクトリに戻り、新しく作成した`backend`と`frontend`をコミットしてGitHubにプッシュします。

  - [ ] **Vercelプロジェクトの設定**

      - **Vercelにログイン**し、GitHubリポジトリをインポートします。
      - **Root Directory**に`frontend`を選択します。
      - **環境変数 `VITE_API_URL`** を設定します。
          - **Name**: `VITE_API_URL`
          - **Value**: `http://<EC2 Elastic IPアドレス>/api`
      - Vercelが自動でビルド＆デプロイを開始します。

-----

### ステップ6: PostgreSQLとLaravelのサーバー設定（EC2上）

GitHub Actionsのデプロイが完了したら、EC2インスタンス上で最終的な設定を行います。

  - [ ] **EC2にSSH接続しPostgreSQLをインストール**

      - EC2インスタンスのターミナルで、PostgreSQLをインストールします。
        ```bash
        sudo apt update
        sudo apt install -y postgresql postgresql-contrib
        ```

  - [ ] **PostgreSQLのユーザーとデータベースを作成**

      - **`sudo -i -u postgres`** で`postgres`ユーザーに切り替えます。
      - `psql`でPostgreSQLのプロンプトに入り、データベースとユーザーを作成します。
      - `\q`でプロンプトを終了し、`exit`で`ubuntu`ユーザーに戻ります。

  - [ ] **Nginxの設定を最終調整**

      - `/etc/nginx/sites-available/default`を編集し、`root`ディレクティブを`/var/www/teuchiudon/backend/public`に設定します。
      - `sudo service nginx restart`でNginxを再起動します。

  - [ ] **Laravelの`.env`ファイル設定**

      - EC2の`backend`ディレクトリ内に、アプリケーションの環境設定を行う`.env`ファイルを作成します。
      - **PostgreSQL接続情報**と`APP_KEY`を設定します。
      - **`php artisan migrate --force`** を手動で実行し、データベースを初期化します。

  - [ ] **LaravelのCORS設定**

      - `config/cors.php`を編集し、Vercelのドメインからのアクセスを許可します。


## ここまででの状況

### アクセス可能なURL：
1. Laravel バックエンド: http://localhost
   + Laravelのメインアプリケーション
   + APIエンドポイント: http://localhost/api/*
2. フロントエンド（Vite）: http://localhost:5173
   + Reactアプリケーション
3. その他のサービス:
   + Mailpit (メール確認): http://localhost:8025
   + Meilisearch: http://localhost:7700
   + PostgreSQL: localhost:5432
   + Redis: localhost:6379
### 推奨アクセス順序：
1. まず http://localhost でLaravelバックエンドが正常に動作することを確認
2. 次に http://localhost:5173 でReactフロントエンドにアクセス

これで、フロントエンドとバックエンドの両方がDocker環境で動作しているはずです。

1. /backendo ディレクトリで
    + sail up -d
    + http://localhost でアクセス

2. /frontendディレクトリで（ターミナルは別タブで）
   + npm run dev -- --port 3000
   + http://localhost:3000でアクセス

