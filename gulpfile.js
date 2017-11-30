var gulp = require('gulp');
// Jade/pug template
var pug = require('gulp-pug');
var htmlbeautify = require('gulp-html-beautify');
// onErrors plugins
var plumber     = require('gulp-plumber');
var notify      = require('gulp-notify');
 // browser sync
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
// css processor
sass = require('gulp-ruby-sass');
sourcemaps = require('gulp-sourcemaps');

// +-------------- tasks -----------------+
// serve - main task
gulp.task('serve',  function() {

    browserSync.init({
      notify: false,
      // Customize the Browsersync console logging prefix
      logPrefix: 'SuperAwesome',
      server: "./docs/"
    });

    gulp.watch("./pug/*.pug", ['pug']);                              // compiled pug files
    gulp.watch("./sass/styles.sass", ['sass']);                     				 // compiled pug files
    gulp.watch("./docs/*.html").on('change', browserSync.reload);   // reload for change .html files
    gulp.watch("./docs/css/*.css").on('change', browserSync.reload);   // reload for change .html files
    // gulp.watch("./docs/*.html", ['htmlbeautify']);                	 // Formatting html files (after compile any pug files)

});

// compile pug
gulp.task('pug', function() {
  return gulp.src("./pug/*.pug")
      .pipe(plumber({
          errorHandler: notify.onError()
      }))
      .pipe(pug({pretty:true, doctype:'HTML'}))
      .pipe(gulp.dest("./docs/"))
      .pipe(htmlbeautify())
      .pipe(browserSync.stream());
});

// Pug (Jade) to HTML.
// gulp.task('pug', () => {
//   return gulp.src([
//     '_includes-pug/**/*.pug'
//   ])
//   .pipe($.plumber())
//   .pipe($.plumberNotifier())
//   .pipe($.cached('pug'))
//   .pipe($.pug({pretty:true, doctype:'HTML'}))
//   .pipe($.size({title: 'html', showFiles: true}))
//   .pipe(gulp.dest('_includes'));
//   });


// process CSS
gulp.task('sass', function () {
    return sass('./sass/styles.sass', {
      sourcemap: true,
      style: 'expanded'
    })
    .pipe(plumber())
    .on('error', function (err) {
        console.error('Error!', err.message);
    })
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./docs/css'));
});

// formatted html files
gulp.task('htmlbeautify', function() {
    var options = {
        indentSize: 2,
        unformatted: [
            // https://www.w3.org/TR/html5/dom.html#phrasing-content
             'abbr', 'area', 'b', 'bdi', 'bdo', 'br', 'cite',
            'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'ins', 'kbd', 'keygen', 'map', 'mark', 'math', 'meter', 'noscript',
            'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'small',
             'strong', 'sub', 'sup', 'template', 'time', 'u', 'var', 'wbr', 'text',
            'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt'
        ]

    };
gulp.src('./docs/*.html')
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest('./docs/'));
});

// default
gulp.task('default', ['sass','serve', 'pug']);

// gulp.task('pug', function () {
// 	gulp.src('./jade/*.jade')
// 	.pipe(pug({
// 		pretty: true
// 	}))
// 	.pipe(gulp.dest('./docs'));
// });