'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const pump = require('pump');
const annotate = require('gulp-ng-annotate');
const del = require('del');

// gulp.task()  --> define tasks
// gulp.src()   --> 'source'  -- input files
// gulp.dest()  --> 'destination' -- output/write files
// .pipe()      --> used to chain commands together
// gulp.watch() --> watch files for changes, to trigger behavior

let paths = {
  js: {
    input: 'client/js/**/*.js',
    output: 'public/js'
  }
}

gulp.task('default', ['develop', 'angular-parts', 'sass', 'watch']);

// nodemon
gulp.task('develop', function() {
  nodemon({
      script: 'app.js',
      ext: 'html js',
    })
    .on('restart', function() {
      console.log('restarted!');
    })
});

gulp.task('angular-parts',['clean:js'], function(cb) {
  pump([
    gulp.src(paths.js.input),
    concat('angular-parts.js'),
    babel({
      presets: ['es2015']
    }),
    annotate(),
    uglify(),
    gulp.dest(paths.js.output)
  ], cb);
});

gulp.task('clean:js', function() {
  return del([paths.js.output]);
})

gulp.task('sass', function() {
  return gulp.src('./client/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function() {
  gulp.watch('./client/js/**/*.js', ['angular-parts']);
  gulp.watch('./client/sass/**/*.scss', ['sass']);
});
