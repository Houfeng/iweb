var gulp = require("gulp");
var uglify = require("gulp-uglify");
var cssMinify = require("gulp-minify-css");
var htmlMin = require("gulp-htmlmin");
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var header = require('gulp-header');
var replace = require('gulp-replace');
var del = require('del');
var pkg = require("./package.json");

var banner = ['/**',
    ' * <%= rawName %>.js',
    ' * <%= description %>',
    ' * @version v<%= version %>',
    ' * @link <%= homepage %>',
    ' * @license <%= license %>',
    ' * @author <%= author.name %>',
    ' * @email <%= author.email %>',
    ' */',
    ''
].join('\r\n');

//清理
gulp.task('clear', function(cb) {
    del(['./lib/common/web/target-script.all.js',
        './lib/common/web/target-script.min.js'
    ], cb);
});

//构建
gulp.task('build', ["clear"], function() {
    //target-script.js
    gulp.src(["./lib/common/web/socket-io-client.js",
            "./lib/common/web/target-script.js"
        ])
        .pipe(concat("target-script-all.js"))
        .pipe(header(banner, pkg))
        .pipe(gulp.dest("./lib/common/web/"))
        .pipe(uglify())
        .pipe(header(banner, pkg))
        .pipe(rename("target-script-min.js"))
        .pipe(gulp.dest("./lib/common/web/"));
});

//默认任务
gulp.task('default', ["build"]);

//end