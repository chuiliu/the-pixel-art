var gulp = require('gulp');
var browserSync = require('browser-sync').create();


gulp.task('browser-sync', function() {

    browserSync.init({
        files: ['index.html', 'css/*.css', 'js/*.js'],
        server: {
            baseDir: '.'
        }
    });
});

gulp.task('default', ['browser-sync']);
