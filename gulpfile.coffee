gulp = require 'gulp'
jade = require 'gulp-jade'
webserver = require 'gulp-webserver'

port = 3003

src =
  jade: 'src/jade/*.jade'
  js: 'src/js/*.js'
  data: 'src/data/*.json'

dist =
  jade: 'dist/'
  js: 'dist/js'
  data: 'dist/data'

gulp.task 'jade', =>
  gulp.src src.jade
    .pipe jade
      pretty: true
    .pipe gulp.dest dist.jade

gulp.task 'js', =>
  gulp.src src.js
    .pipe gulp.dest dist.js

gulp.task 'data', =>
  gulp.src src.data
    .pipe gulp.dest dist.data

gulp.task 'webserver', =>
  gulp.src 'dist'
    .pipe webserver
        host: 'localhost'
        port: port
        livereload: true

gulp.task 'watch', =>
  gulp.watch(src.jade, ['jade'])
  gulp.watch(src.js, ['js'])

gulp.task 'default' ,['js', 'jade', 'data', 'webserver', 'watch']
