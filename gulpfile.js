const gulp = require("gulp");
const babel = require("gulp-babel");
const header = require("gulp-header");
// using data from package.json 
var pkg = require("./package.json");
var banner = ["/**",
    " * <%= pkg.name %>",
    " * @version v<%= pkg.version %>",
    " * @link <%= pkg.homepage %>",
    " * @license <%= pkg.license %>",
    " */",""].join("\n");
gulp.task("default", () => {
    return gulp.src([
        "src/*.js",
        "src/**/*.js"])
        .pipe(babel({
            presets: ["env"],
            minified: true,
            comments: false
        }))
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest("dest"))
        .pipe(gulp.dest("docs"));
});
gulp.task("debug", () => {
    return gulp.src([
        "src/*.js",
        "src/**/*.js"])
        .pipe(babel({
            presets: ["env"],
            minified: false,
            comments: true
        }))
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest("dest"))
        .pipe(gulp.dest("docs"));
});