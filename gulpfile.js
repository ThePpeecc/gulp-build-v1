//getting our gulp parts
const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    map = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    webserver = require('gulp-webserver'),
    eslint = require('gulp-eslint');

//compile and minify our js scripts
gulp.task('scripts', ['lint'], function() {
    return gulp.src(['js/*.js', 'js/**/*.js'])
        .pipe(map.init())
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(map.write('./'))
        .pipe(gulp.dest('dist/scripts'));
});

//run a linter on our js code, except for autogrow, since it has allready been minifyed and therefore will be full of error's
gulp.task('lint', function() {
    return gulp.src(['js/*.js', 'js/**/*.js', '!js/circle/autogrow.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

//We compile and minify our sass files here
gulp.task('styles', ['scripts'], function() {
    gulp.src(['sass/*.scss', 'js/**/*.scss'])
        .pipe(map.init())
        .pipe(sass())
        .pipe(concat('all.min.css'))
        .pipe(cssnano())
        .pipe(map.write('./'))
        .pipe(gulp.dest('dist/styles'));
});

//We compress our images
gulp.task('images', ['styles'], function() {
    gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/content'));
});

//We delete the dist folder
gulp.task('clean', function() {
    return del('dist');
});

//We build our front end project
gulp.task('build', ['clean'], function() {
    gulp.start(['images']);
});

//Default is just build
gulp.task('default', ['build']);


//The watch task compiles our js files every time our scripts files
gulp.task('watch', function() {
    gulp.watch('js/**/*', ['scripts']);
});

//We serve a webserver that autoloads the page everytime our files change
gulp.task('serve', ['watch'], function() {
    gulp.src('./')
        .pipe(webserver({
            fallback: 'index.html',
            livereload: true,
            open: true
        }));
});
