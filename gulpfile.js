"use strict";

// プラグイン ======================
const {src, dest, parallel, series, watch} = require("gulp");
const concat = require("gulp-concat");
const {spawn} = require("child_process");
const browserSync = require("browser-sync").create();
// css関連
const sass = require("gulp-dart-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
// js関連
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

// 変数 ============================
const srcPath = {
  css: ["_css/foundation.scss", "_css/**/*.scss"],
  js: "_js/**/*.js",
  html: "_site/**/*.html",
};
const siteRoot = "_site";

// 処理 ============================
// CSSの処理
const compileSass = () => {
  return (
    src(srcPath.css, {sourcemaps: true})
      .pipe(sass({
        outputStyle: "compressed",
      }).on("error", sass.logError))
      .pipe(concat("style.css"))
      .pipe(postcss([
        autoprefixer({
          cascade: false,
        }),
      ]))
      .pipe(dest("assets/css", {sourcemaps: "./map"}))
  );
};

// JavaScriptの処理
const compileJs = () => {
  return (
    src(srcPath.js, {sourcemaps: true})
      .pipe(babel({
        presets: ["@babel/preset-env"],
      }))
      .pipe(concat("app.js"))
      .pipe(uglify())
      .pipe(dest("assets/js", {sourcemaps: "./map"}))
  );
};

// Jekyllサーバーの起動
const jekyllServe = (callback) => {
  spawn("bundle", ["exec", "jekyll", "serve"], {
    stdio: "inherit",
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
    console.log("spawn Error *********");
  }),
  proc.stdout.on("data", (data) => {
    console.log(data.toString().split(/\n/));
    console.log("prettier Success!");
  });
};

const delayPrettier = (callback) => {
  setTimeout(prettier, 3000);
  callback();
};

// 監視 ============================
const watcher = () => {
  browserSync.init({
    files: [siteRoot + "/**"],
    port: 4000,
    server: {
      baseDir: siteRoot,
      serveStaticOptions: {
        extensions: ["html"],
      },
    },
  });
  watch(srcPath.css, compileSass);
  watch(srcPath.js, compileJs);
  watch(srcPath.html, prettier);
};

// 実行 ============================
exports.default = series(
  parallel(
    compileSass,
    compileJs,
  ),
  parallel(
    jekyllServe,
    watcher,
  ),
);

exports.build = series(
  parallel(
    compileSass,
    compileJs,
  ),
  jekyllBuild,
  delayPrettier,
);

exports.jekyllServe = jekyllServe;
exports.compileSass = compileSass;
exports.compileJs = compileJs;
exports.prettier = prettier;
