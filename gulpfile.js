'use strict'

const gulp = require('gulp')
const tsLint = require('gulp-tslint')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')
const config = {
  ts: {
    source: 'src/**/*.ts',
    destination: 'dist'
  },
  pub: {
    source: 'public/**/*',
    destination: 'dist/public'
  },
  views: {
    source: 'views/**/*.pug',
    destination: 'dist/views'
  }
}

gulp.task('lint', () => {
  return gulp.src(config.ts.source)
    .pipe(tsLint({}))
    .pipe(tsLint.report({summarizeFailureOutput: true}))
})

gulp.task('copy', () => {
  gulp.src(config.pub.source)
    .pipe(gulp.dest(config.pub.destination))
  gulp.src(config.views.source)
    .pipe(gulp.dest(config.views.destination))
})

gulp.task('build', () => {
  return gulp.src(config.ts.source)
    .pipe(tsProject()).js
    .pipe(gulp.dest(config.ts.destination))
})

gulp.task('default', ['lint', 'build', 'copy'])
