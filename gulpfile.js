'use strict'

const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const concat = require('gulp-concat')
// const uglify = require('gulp-uglify-es').default
// const babel = require('gulp-babel')
// const include = require('gulp-include')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const mmq = require('gulp-merge-media-queries')
const cleancss = require('gulp-clean-css')
// const imagemin = require('gulp-imagemin')
// const newer = require('gulp-newer')
// const svgSprite = require('gulp-svg-sprite')
// const svgmin = require('gulp-svgmin')
const del = require('del')
// const nunjucksRender = require('gulp-nunjucks-render')
// const data = require('gulp-data')
// const fs = require('fs')
// const removeHtmlComments = require('gulp-remove-html-comments')
// const beautify = require('gulp-beautify')
// const rename = require('gulp-rename')

sass.compiler = require('node-sass')

gulp.task('browser-sync', () => {
  browserSync.init({
    server: { baseDir: '.' },
    notify: false,
    open: false
    // online: false, // Work Offline Without Internet Connection
    // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
  })
})

gulp.task('style', () => {
  return gulp
    .src('./stalk.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(concat('stalk.min.css'))
    .pipe(
      autoprefixer({ overrideBrowserslist: ['last 3 versions'], grid: true })
    )
    .pipe(mmq())
    .pipe(
      cleancss({
        compatibility: 'ie11',
        level: 2
      })
    )
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream())
})

gulp.task('clean', () => {
  return del('./dist/')
})

gulp.task('html', () => {
  return (
    gulp
      .src('./index.html')
      .pipe(browserSync.reload({ stream: true }))
  )
})

gulp.task(
  'build',
  gulp.series(
    'clean',
    'style',
  )
)

gulp.task('watch', () => {
  gulp.watch('./**/*.scss', gulp.parallel('style'))
  gulp.watch('./index.html', gulp.parallel('html'))
})

gulp.task(
  'default',
  gulp.series('build', gulp.parallel('browser-sync', 'watch'))
)