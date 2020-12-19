const {src, dest, series} = require('gulp');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const csso = require('gulp-csso');
const del = require('del');

function cleanTask() {
  return del('dist');
}

function htmlTask(){
  return src('src/*html')
  .pipe(dest('dist'))
}

function scriptsTask(){
  return src('src/js/*.js')
  .pipe(babel({presets: ["@babel/env"]}))
  .pipe(sourcemaps.init())
  .pipe(terser())
  .pipe(sourcemaps.write())
  .pipe(dest('dist/js'))
}

function stylesTask(){
  return src(['src/css/*'])
  .pipe(sourcemaps.init())
  .pipe(autoprefixer())
  .pipe(csso())
  .pipe(sourcemaps.write())
  .pipe(dest('dist/css'))
}

exports.html = htmlTask;
exports.scripts = scriptsTask;
exports.styles = stylesTask;
exports.default = series(cleanTask, htmlTask, scriptsTask, stylesTask);