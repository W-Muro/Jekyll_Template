# Jekyll開発環境テンプレート
以下の順に説明した内容になっています。  
（主に自分用の記録です。）

1. [使い方](#how-to-use)
2. [ディレクトリ構成と説明](#directory-structure)
3. [CSS設計](#css-design)
4. [Gulp](#gulp)

Jekyllについて詳しくはこちら  
[Jekyll公式](https://jekyllrb.com/)  
[日本語版サイト](http://jekyllrb-ja.github.io/)

<br>
<br>
<br>
<h2 id="how-to-use">使い方</h2>

### ダウンロード
GitHubからzipファイルをダウンロードするか、以下のコードでクローン

```tcl
$ git clone git@github.com:W-Muro/Jekyll_Template.git <DIRECTORY_NAME>
```

### Gemの確認
WindowsかJRubyを使用している場合と、GitHub Pagesを使用する場合は、Gemfileで必要なGemの確認をしてください。

### 準備
作成したディレクトリへ移動し、必要なライブラリのインストール

```tcl
  # gemfileを元にgemのインストール
$ bundle update

  # package.jsonを元にローカルにパッケージをインストール
$ npm install -D
```

### 動作確認
JekyllサーバーとGulpが正常に動作するか確認します。

```tcl
  # Jekyllサーバーが起動するかの確認
$ bundle exec jekyll server

  # Gulpが機能するかの確認
$ npx gulp
```

### Gitの初期化

```tcl
  # Gitの初期化
$ git init

  # リモートリポジトリの確認
$ git remote -v
origin	git@github.com:W-Muro/Jekyll_Template.git (fetch)
origin	git@github.com:W-Muro/Jekyll_Template.git (push)

  # 新しいリモートリポジトリのセット
$ git remote set-url origin git@github.com:NEW_REPOSITORY

  # リモートリポジトリ変更の確認
$ git remote -v
origin	git@github.com:NEW_REPOSITORY (fetch)
origin	git@github.com:NEW_REPOSITORY (push)
```


<br>
<br>
<br>
<h2 id="directory-structure">ディレクトリ構成</h2>

当テンプレートの構成は以下の通りです。  
詳細は`*1`の形で示した数字の項で説明しています。  
[Jekyllの基本ディレクトリ構成はこちら](http://jekyllrb-ja.github.io/docs/structure/)

```
.
├── _data *1
│   └── accounts.yml
│   └── navigation.yml
├── _drafts *2
│   └── unpublished_post.md
├── _gulp-css *3
│   ├── global
│   │   └── _index.scss
│   │   └── _mixin.scss
│   │   └── _variables.scss
│   ├── foundation
│   │   └── _base.scss
│   │   └── _destyle.scss
│   ├── layout
│   │   └── header.scss
│   │   └── footer.scss
│   │   └── main.scss
│   │   └── default.scss
│   │   └── post.scss
│   ├── component
│   ├── project
│   ├── utility
│   ├── libraries
│   └── foundation.scss
├── _gulp-js *4
│   ├── libraries
│   ├── test.js
│   └── test2.js
├── _includes *5
│   ├── layout
│   │   ├── head.html
│   │   ├── footer.html
│   │   └── header.html
│   ├── component
│   ├── project
│   └── utility
├── _layouts
│   ├── default.html
│   └── post.html
├── _pages *6
│   ├── blog
│   │   └── latest.html
│   ├── index.html
│   └── 404.html
├── _posts
│   └── 2020-01-01-published_post.md
├── assets *7
│   ├── css
│   │   ├── style.css
│   │   └── map
│   │       └── style.css.map
│   └── js
│       ├── app.css
│       └── map
│           └── app.js.map
├── _config.yml *8
├── .eslintrc.js *9
├── .gitignore *10
├── .prettierrc.yml *11
├── Gemfile *12
├── Gemfile.look
├── gulpfile.js *13
├── package.json *14
├── package-look.json
└── README.md
```

### 1. _data
形式化したデータの格納場所。  
主に、変数としてHTMLで使用したいものをカテゴリーごとにファイル分けして定義する。  
navigation.ymlの場合、`site.data.navigation`でアクセスできる。  
`_config.yml`でも`site.`でアクセスできるデータを作れるが、設定との切り分けのために`_config.yml`で**定義しなければならないもの以外**はここを活用する。

```html
<!-- 例 -->
<nav>
  {% for item in site.data.navigation %}
    <a href="{{ item.link }}" {% if page.url == item.link %}style="color: red;"{% endif %}>
      {{ item.name }}
    </a>
  {% endfor %}
</nav>
```

### 2. _drafts
未公開のポストの格納場所。  
ファイル名に日付を加える必要がない。  
通常は無視されるが、`jekyll server --drafts`、`jekyll build --drafts` とすると日付が与えられ最新のポストとしてプレビューされる。

### 3. _css
CSSソースの格納場所。
配下の構成など詳しくは「[CSS設計](#css-design)」に記載。  
このディレクトリ配下のファイルでCSSを定義し、Gulpによって処理が加えられたものが`assets/css`へ保存される。

### 4. _js
JavsScriptソースの格納場所。  
配下のファイルはGulpによって1ファイルにまとめられて`assets/js`へ保存される。  
新規ディレクトリ配下にファイルを作成した場合も同様に処理される。  
1ファイルにまとめられる手順は、「ソースのまま1ファイルにまとめる => babelでトランスパイル => uglifyで圧縮」の順なので、以下のような振る舞いをする。
1. 別ファイルで同じ変数を使用している場合、変数の再定義がエラーとして報告される。
2. 1によるエラーを回避したい場合は、ファイルごとに{}でスコープを作れば同一の変数を別ファイルで宣言していてもエラーにならない。
3. 2の方法をとった場合、同一の変数が多数存在することになるが、それはbabelによるトランスパイル時にそれぞれ別の変数名に変換される。

#### librariesディレクトリ
外部ライブラリのコードを格納するディレクトリとして、`assets/js/libraries`を用意している。  
assetsディレクトリのファイルはそのままビルドされるため、コンパイルされた`app.js`とは別に、個別に読み込ませる必要がある。  
まとめて読み込ませたい場合は`_js/libraries`を作成してもいいが、その場合自分で書いたコードと同じファイルにまとめられるので、思わぬ不具合につながる可能性を多分に含んでおり、おすすめしない。  

#### 個人的規約
1. `_js`配下に機能ごとに分割したファイルでコードを書く。  
2. ファイル名は、略語を使用せず、コードの中身が推測できる**文章**で、**ケバブケース**を使用する。  
3. 各ファイルごとに{}で全てのコードを囲うようにする。（ファイルごとにスコープを作る）  
4. ES2015(ES6)以降の構文を使用する。  
5. 外部ライブラリを使用する場合はminファイルを`assets/js/libraries`へ格納し、**必要なページでのみ読み込ませる**。  
6. ESLintの構文チェックに基づいたコーディングをする。  

### 5. _includes
HTMLのパーツの格納場所。  
配下のフォルダは`_css`に対応する。  
詳しくは「[CSS設計](#css-design)」を参照。  
配下フォルダにはHTMLから以下の形式でアクセスできる。  

```html
{% include layout/head.html %}
```

パラメーターの受け渡しも可能。  
includeについての詳細はこちら。  
[Includes（インクルード）](http://jekyllrb-ja.github.io/docs/includes/)

### 6. _pages
メインとなるHTMの格納場所。  
パーマリンクごとに1ファイルを作成する。  
デフォルト設定に無いディレクトリなので、`_config.yml`でインクルードが必要。  

### 7. assets
ビルド時に使用される、CSS、JavaScript、Imageの格納場所。  
CSSとJavScriptは、`_css`、`_js`で記述したコードがGulpによって処理されてここに保存されるため、主に画像とJavaScriptライブラリの追加に使用する。  

### 8. _config.yml
Jekyllの設定ファイル。  
`site.title`のようにHTMLからアクセスできる。  

#### metadata
```yaml
title: #サイトのタイトル
email: #メールアドレス
description: >- # >-で、次のハッシュキー(url:)まで改行を無視"
  サイトの説明。pc120文字、スマホ50字程度が目安
url: "" # サイトのホスト名とプロトコル 例:http://example.com
baseurl: "" # サイトのサブパス（サブディレクトリ） 例: /blog, /jp
```

#### repository
`jekyll-github-metadata`の関連で必要
ローカルからGitでアクセスしていれば問題ないが、GitHub Action経由でビルドしているなどの場合、
`JEKYLL_ENV=production bundle exec jekyll build`するとエラーになる
[GitHub Metadata](http://jekyll.github.io/github-metadata/configuration/)


#### timezone
GitHub PagesやGitHub Actionsなどを使用した際に、日本時間を基準に記事を投稿するために必要。  
JST（日本標準時）のつもりで記事を投稿した場合に、UTC（協定世界時）が使用されると、未来の時間を指定しているので投稿が反映されない場合がある。  


#### excerpt_separator
有効にすると、`{{ post.excerpt }}`で記事の抜粋をHTMLに表示させることができる。  
記事のファイルで`<!--more-->`を挿入すると、冒頭から`<!--more-->`までの範囲が表示される。(デフォルトは最初の段落)  
`<!--more-->`は好きな文字に変更可能。  


#### defaults
Front Matterのデフォルト値を設定できる。  
[Front Matterのデフォルト](http://jekyllrb-ja.github.io/docs/configuration/front-matter-defaults/)


#### sass
Sassのコンパイル設定。  
このテンプレートでは、Gulpで処理してCSSにしているので必要ない。

`sass_dir:`でSassディレクトリの位置を指定。
`style:`でSassがサポートする出力スタイルオプションを指定。(compressedはコメントや余白を取り除き1行にまとめる圧縮設定)  

>これらはSassに渡されるので、Sassがサポートする出力スタイルオプションはすべて、ここでも有効です。  
> [Jekyll Assets](http://jekyllrb-ja.github.io/docs/assets/)


#### plugins
Jekyllプラグインを追加できる。  
Gemfileに`group: :jekyll_plugins`と記述すれば通常Configへ記述する必要はないが、
GitHub PagesはBundler経由でGemをインストールしないので、GitHub Pagesを使用する場合はConfigにも記述する必要がある。  
[GitHub Docs](https://docs.github.com/ja/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll)  
[Jekyll テーマ](http://jekyllrb-ja.github.io/docs/themes/)

```yaml
plugins:
  - jekyll-feed # フィードの作成
  - jekyll-seo-tag # SEOデータの作成
  - jekyll-sitemap # sitemap.xmlの作成
  - jekyll-paginate-v2 # ページネーションを可能にする
  # - github-pages
  # GitHub Pagesを使用する場合は使用が推奨されている
  # 詳しくは「12. Gemfile」の「github-pages」を参照
```

[jekyll-paginate-v2](https://github.com/sverrirs/jekyll-paginate-v2/blob/master/README-GENERATOR.md#site-configuration)
```yaml
# jekyll-paginate-v2の設定
pagination:
  enabled: true # ページネーションの有効化 記述されていないと実行されない
  per_page: 8 # 1ページに含める記事数
  permalink: '/:num/' # ページネーションのパーマリンク構造
  title: ':title - page :num' # 2ページ目以降のタイトル形式 {{page.title}}に反映される
  limit: 0 # ページネーションされた最大ページ数 0は無限
  sort_reverse: true # ソート方向 trueで逆順（新しい順）
  sort_field: 'date' # ソート基準 デフォルトはdateで省略化
  trail: # paginator.page_trailで取得されるtrail数
    before: 2
    after: 2
```

#### include
.や_から始まり、デフォルトのディレクトリ構成に含まれていないディレクトリやファイルを扱うにはこのリストへ追加する。
[Jekyll ディレクトリ構成](http://jekyllrb-ja.github.io/docs/structure/)


#### exclude
処理から除外したいファイルやフォルダはこのリストに追加する。  
コメントアウトしてあるものはデフォルトで除外されている項目。  


### 9. .eslintrc.js
ESLintの設定ファイル。  
エディターでESLintを使用している場合はこの設定を元に検証が行われる。  


### 10. .gitignore
Gitの管理に含めないファイルを指定するためのファイル。  
ここへ記述することで、commitされなくなり、pushした際にリモートリポジトリへも保存されない。  


### 11. .prettierrc.yml
Prettierの設定ファイル。  
このテンプレートではHTMLの整形に使用しており、Gulpからのコマンドで実行される。  


### 12. Gemfile
RubyのGemの依存関係を管理する。
`jekyll_plugins`については「8項 _config.yaml」の「plugins」で説明しているため省略する。  

#### github-pages
GitHubPagesを使用する場合は有効にし、`gem 'jekyll'`をgemfileから削除（無効に）する。  

GitHubPagesと同期したローカル環境を構築し、ローカルとの差異がないビルド結果を担保する。  
JekyllのバージョンがGemに依存するため、一部変数などが使用できなくなる。  
依存関係バージョンの確認 `bundle exec github-pages versions`  
URL: https://github.com/github/pages-gem


### 13. gulpfile.js
Gulpの設定ファイル。  
詳しくは[Gulp](#gulp)に記載。  

### 14. package.json
npmの管理ファイル。  
Gulpなど、npmでインストールしたライブラリの情報が記載されている。  
編集が必要な可能性があるのは`browserslist`の項目のみ。  
他は、`npm install`や`npm update`した際に自動的に書き換えられる。  

### browserslist
AutoprefixerとBabelから参照されるリスト。  
トランスパイルやベンダープレフィックスを追加する際に、カバーするブラウザの範囲を指定できる。  

```yaml
"browserslist": [
  "last 2 versions", # 各ブラウザの最新2バージョン
  "ie >= 11",        # Internet Explorer11以上のバージョン
  "Android >= 4"     # アンドロイド4以上のバージョン
],
```

<br>
<br>
<br>
<h2 id="css-design">CSS設計</h2>

`_css`配下のディレクトリ及びファイルと、規定したルールの解説。   
ルールは、FLOCSSをベースに先人達の知恵を借りながら、Jekyllと個人的な好みに当てはめて規定。  

参考:  
[破綻しにくい CSS 設計手法と命名規則](https://murashun.jp/article/programming/css/css-design.html)  
[[CSS設計] 私のためのFLOCSSまとめ](https://qiita.com/super-mana-chan/items/644c6827be954c8db2c0)  
[【暫定】コーダー歴3年で辿り着いた保守しやすいコーディング手法](https://zenn.dev/haniwaman/articles/bf392f397c8db7341881)  
[俺流レスポンシブコーディング](https://zenn.dev/tak_dcxi/articles/690caf6e9c4e26)

### global
CSS全体で使用する変数やmixinを定義する。  
`_mixin.scss`にmixin、`_variables.scss`に変数とプレースホルダーセレクタを記述する。  

#### _global.scss
CSS全体でを読み込むために、globalのファイルを`@forward`でまとめる。  
このファイルによって`@use "../global/global" as g;`と各スタイルシートに記載するだけでglobalにある全てのファイルの変数などをそれぞれのファイルで使用可能になる。  

### Fooundation
サイト全体のデフォルトスタイルを定義。
読み込み順を固定する必要があるため、`_css/foundation.scss`で読み込んで使用する。  

#### _destyle.scss
リセットCSSとして採用。  
ブラウザー間の差異やデフォルトで指定されているスタイルがリセットされる。  
[destyle.css](https://github.com/nicolas-cusan/destyle.css/)

#### _base.scss
HTMLタグに直接定義するようなスタイルを記述するデフォルト設定。  


### Layout
ヘッダー、フッター、サイドバーなど、各ページを構成するサイト全体で共通したエリアのスタイルを定義。  
具体的には、`_layout`と`include/layout`ディレクトリにあるHTMLのスタイルを定義する。

プレフィックスは`l-`。  


### Component
再利用できるもっとも小さなモジュールを定義。
ボタンやカードなど。  
最低限のスタイル定義を行い、幅・高さ、色などモジュール固有の特色は持たせない。  

プレフィックスは"c-"


### Project
Componentを組み込むなどした、より具体的な再利用できるパターン。  
幅・高さ、色や疑似要素のスタイルなどを定義。  
記事一覧、ユーザプロフィール、画像ギャラリーなど。  

プレフィックスは"p-"  

### Utility
ComponentやProjectでは解決できない調整のための便利クラスなどを定義する。  
color, marginなど。  

プレフィックスは"u-"  


### Libraries
外部ライブラリファイルの格納場所。  


### ルール
1. むやみにUtilityを追加しない
詳細なスタイルを定義する場合、コンテナとなるLayoutから、結合子（>, ~など）やネストを利用して定義し、むやみにUtilityを追加しない。  

2. ファイル名、クラス名は省略しない(buttonをbtnなどとしない)
第三者や**未来の自分**が少しでも混乱する可能性は排除する
variablesのみ、コメントを書くことを前提に許可

4. ケースの指定
プレフィックス以外の複合語はロウワーキャメルケースを使用。  
class nameというクラスをProjectで定義する場合、p-classNameとする。   
p--class-nameなどとはしない。  

variablesのプレースホルダーセレクタは、説明文になりがちなので可読性を重視してロウワースネークケースにする。  

5. JavaScriptによる操作
JavaScriptからの操作専用に`js-`プレフィックスをもつクラスを使用する。  
`js-`クラスにはスタイルを定義しない。  
toggleで変化をさせる場合も、`js-`に定義するのではなく、`c-button.js-open`のようにスタイルを定義する。  

5. IDは使用しない


<br>
<br>
<br>
<h2 id="gulp">Gulp</h2>
npmからインストールしたNode.jsライブラリを実行するために使用しているタスクランナー。  
`npm i -D libraryName`でインストールし、`gulpfile.js`で`require()`して使用する。  

処理の概要は次の通り。  
**HTML**
1. 子プロセスを生成してGulpからコマンドを実行し、Pretterを実行
2. HTMLのコードを`.prettierrc.yml`に従い整形

**CSS**
1. Sass（Dart Sass構文可）をCSSへコンパイル
2. CSSファイルの圧縮
3. 複数のSassファイルを結合して1ファイルに結合
4. browserslistに従い、ベンダープレフィックスを付与

**JavaScript**
1. 複数のJavaScriptファイルを1ファイルに結合
2. browserslistに従い、Babelでトランスパイル
3. ファイルの圧縮

**Jekyllサーバーの起動**
1. 子プロセスを生成してGulpからコマンドを実行し、Jekyllサーバーを起動する

**Browser Sync**
ローカルIPアドレスでサーバーを立ち上げるプラグイン。  
コードを監視し、自動でブラウザの更新をしてくれる。  
また、同一LANネットワーク内（同じWifiに繋いでいるなど）の端末からアクセスできるので、PCとスマホからリアルタイムに表示を確認できる。  

**監視**
1. HTML、CSS、JavsScriptのソースコードを監視し、変更があると自動的に処理を実行
2. Jekyllサーバー起動中はソースに変更があると自動でビルドする
3. ビルドによってコードの変更を検知するとブラウザを自動で更新


```javascript
// プラグイン ======================
const {src, dest, parallel, series, watch} = require("gulp"); // gulpプラグインの読み込み(必要なものだけ)
const concat = require("gulp-concat");                        // ファイルの連結
const {spawn} = require("child_process");                     // コマンドの実行に使用
const browserSync = require("browser-sync").create();         // ブラウザの自動更新とリンク
// css関連
const sass = require("gulp-dart-sass");                       // "Sassをコンパイルするプラグインの読み込み
const postcss = require("gulp-postcss");                      // cssプラグインへのパイプ
const autoprefixer = require("autoprefixer");                 // ベンダープレフィックス追加(package.jsonのbrowserslistで対応範囲指定)
// js関連
const babel = require("gulp-babel");                          // jsのトランスパイル(package.jsonのbrowserslistで対応範囲指定)
const uglify = require("gulp-uglify");                        // jsの圧縮

// 変数 ============================
const srcPath = {
  css: ["_css/foundation.scss", "_gulp-css/**/*.scss"],
  js: "_js/**/*.js",
  html: "_site/**/*.html",
};
const siteRoot = "_site";

// 処理 ============================
// CSSの処理
const compileSass = () => {
  return (
    src(srcPath.css, {sourcemaps: true})  // 変換元ファイル 配列で読み込み順制御
      .pipe(sass({                        // Sassのコンパイルを実行
        outputStyle: "compressed",        // コンパイル方式 "compressed" or "expanded"
      }).on("error", sass.logError))      // エラーログ表示
      .pipe(concat("style.css"))          // ファイルの結合
      .pipe(postcss([autoprefixer({       // ベンダープレフィックスの追加
        cascade: false,                   // 整形 圧縮するのであれば必要ない デフォルトtrue
      }),
      ]))
      .pipe(dest("assets/css", {sourcemaps: "./map"})) // 出力場所
  );
};

// JavaScriptの処理
const compileJs = () => {
  return (
    src(srcPath.js, {sourcemaps: true}) // 変換元フォルダ
      .pipe(concat("app.js"))           // ファイルの結合
      .pipe(babel({                     // babelでトランスパイル
        presets: ["@babel/preset-env"], // トランスパイルの条件設定 package.jsのbrowserslist参照
      }))
      .pipe(uglify())                   // ファイルの圧縮
      .pipe(dest("assets/js", {sourcemaps: "./map"})) // 出力場所
  );
};

// Jekyllサーバーの起動
const jekyll = (callback) => {
  spawn("jekyll", ["serve"], {
    stdio: "inherit",           // 標準入出力/エラーの制御
  });
  callback();
};

// Jekyllのビルド
const jekyllBuild = (callback) => {
  spawn("jekyll", ["build"], {
    stdio: "inherit",
  });
  callback();
};

// HTMLの整形
const prettier = () => {
  const proc = spawn("npx", ["prettier", "--write", srcPath.html]);
  proc.stderr.on("data", (err) => {
    console.error(err.toString().split(/\n/));
    console.log("Prettier Error");
  }),
  proc.stdout.on("data", (data) => {
    console.log(data.toString().split(/\n/));
    console.log("Prettier Success");
  });
};

const delayPrettier = (callback) => {             // ビルド完了前に実行されないように遅延措置
  setTimeout(prettier, 3000);
  callback();
};

// 監視 ============================
const watcher = () => {
  browserSync.init({               // browserSyncの環境設定
    files: [siteRoot + "/**"],
    port: 4000,
    server: {
      baseDir: siteRoot,
    },
  });
  watch(srcPath.css, compileSass); // 変更の監視
  watch(srcPath.js, compileJs);
  watch(srcPath.html, prettier);
};

// 実行 ============================
exports.default = series(           // デフォルト(npx gulp)の実行内容, サーバーの起動と監視, seriesで実行順管理
  parallel(                         // 処理の即時実行
    compileSass,
    compileJs,
  ),
  parallel(
    watcher,                        // 変更の監視
    jekyll,                         // Jekyllサーバーの起動
  ),
);

exports.build = series(             // ビルドの実行(npx gulp build)
  parallel(
    compileSass,
    compileJs,
  ),
  jekyllBuild,
  delayPrettier,                      // そのままprettierを実行するとビルドが間に合わないので遅延措置
);

exports.jekyll = jekyll;            // 個別で実行するためのエクスポート(npx gulp jekyll)
exports.compileSass = compileSass;
exports.compileJs = compileJs;
exports.prettier = prettier;
```
