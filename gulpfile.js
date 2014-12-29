'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var to5 = require('gulp-6to5');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var htmlmin = require('gulp-htmlmin');
var clean = require('gulp-clean');
var gulpif = require('gulp-if');
var useref = require('gulp-useref');
var rev  = require('gulp-rev');
var revReplace  = require('gulp-rev-replace');
var connect = require('gulp-connect');

gulp.task('javascript', function () {
  return gulp.src('app/src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(to5())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/_build/src'));
});

gulp.task('sass', function () {
  return gulp.src('app/styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({errLogToConsole: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/_build/styles'));
});

gulp.task('reload', function () {
  gulp.src('app/**/*')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch('app/styles/**/*.scss', ['sass']);
  gulp.watch('app/src/**/*.js', ['javascript']);
  gulp.watch(['app/**/*'], ['reload']);
});

gulp.task('server', ['sass', 'javascript'], function() {
  connect.server({
    root: '.',
    livereload: true
  });
});

gulp.task('assets', function () {
  return gulp.src('app/assets/**/*')
    .pipe(gulp.dest('_dist/assets'));
});

gulp.task('dist', ['sass', 'javascript', 'assets'], function () {
  var assets = useref.assets();
  return gulp.src('app/**/*.html')
    .pipe(assets)
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCSS()))
    .pipe(rev())
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(revReplace())
    .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('_dist'))
});

gulp.task('default', ['watch', 'sass', 'javascript', 'server']);