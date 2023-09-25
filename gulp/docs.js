const gulp = require("gulp");

// HTML
const fileInclude = require("gulp-file-include");
const htmlclean = require("gulp-htmlclean");
const webpHTML = require("gulp-webp-html-fixed");
const htmlBeautify = require("gulp-html-beautify");
const gulpPrettier = require("gulp-prettier");

// SASS
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const webpCss = require("gulp-webp-css");

const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");
const sourceMaps = require("gulp-sourcemaps");
const groupMedia = require("gulp-group-css-media-queries");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const webpack = require("webpack-stream");
const babel = require("gulp-babel");
const changed = require("gulp-changed");

const docs = "./docs";

// Images
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");

gulp.task("clean:docs", function (done) {
  if (fs.existsSync(docs)) {
    return gulp.src(docs, { read: false }).pipe(clean({ force: true }));
  }
  done();
});

const fileIncludeSetting = {
  prefix: "@@",
  basepath: "@file",
};

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      // message: "Error <%= error.message %>",
      message: "Error <%= error %>",
      sound: false,
    }),
  };
};

const htmlBeautifyOptions = {
  indent_size: 2,
  jslint_happy: true,
  space_after_anon_function: true,
  keep_array_indentation: true,
  keep_function_indentation: true,
  space_before_conditional: true,
  break_chained_methods: true,
  wrap_line_length: 100,
  wrap_attributes_indent_size: 2,
};

gulp.task("html:docs", function () {
  return (
    gulp
      // .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
      .src("./src/html/pages/**/*.html")
      .pipe(changed(docs))
      .pipe(plumber(plumberNotify("HTML")))
      .pipe(fileInclude(fileIncludeSetting))
      .pipe(webpHTML())
      .pipe(htmlBeautify(htmlBeautifyOptions))
      // .pipe(htmlclean())
      .pipe(gulpPrettier())
      .pipe(gulp.dest(docs))
  );
});

gulp.task("sass:docs", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(changed("./docs/css/"))
    .pipe(plumber(plumberNotify("SCSS")))
    .pipe(sourceMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    .pipe(webpCss())
    .pipe(groupMedia())
    .pipe(sass())
    .pipe(csso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./docs/css/"));
});

gulp.task("images:docs", function () {
  return gulp
    .src("./src/img/**/*")
    .pipe(changed("./docs/img/"))
    .pipe(webp())
    .pipe(gulp.dest("./docs/img/"))
    .pipe(gulp.src("./src/img/**/*"))
    .pipe(changed("./docs/img/"))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest("./docs/img/"));
});

gulp.task("fonts:docs", function () {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./docs/fonts/"))
    .pipe(gulp.dest("./docs/fonts/"));
});

gulp.task("files:docs", function () {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./docs/files/"))
    .pipe(gulp.dest("./docs/files/"));
});

gulp.task("js:docs", function () {
  return gulp
    .src("./src/js/*.js")
    .pipe(changed("./docs/js/"))
    .pipe(plumber(plumberNotify("JS")))
    .pipe(babel())
    .pipe(webpack(require("./../webpack.config.js")))
    .pipe(gulp.dest("./docs/js/"));
});

const serverOptions = {
  livereload: true,
  open: true,
  host: "192.168.1.79", // Используйте ваш IP-адрес
  port: 8001, // Используйте порт, который не блокируется
};

gulp.task("server:docs", function () {
  return gulp.src(docs).pipe(server(serverOptions));
});
