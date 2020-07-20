const
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create()
    
function style() {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream())
}
    
function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
    gulp.watch('./scss/**/*.scss', style)
    gulp.watch('./*.html').on('change', browserSync.reload)
    gulp.watch('./js/**/*.js').on('change', browserSync.reload)
}
    
exports.style = style
exports.watch = watch