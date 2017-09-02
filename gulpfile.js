// including plugins
// gulp refs:
//   1) 10 things to know about Gulp: https://engineroom.teamwork.com/10-things-to-know-about-gulp/
//   2) Gulp for Beginners: https://css-tricks.com/gulp-for-beginners/
// note: to add more plugins:
// $ sudo npm install gulp-debug --save-dev

// including plugins
var gulp =        require( 'gulp' ),
    util =        require( 'gulp-util' ),
    concat =      require( 'gulp-concat' ),
    uglify =      require( 'gulp-uglify' ),
    minify =      require( 'gulp-minify' ),
    minifyHtml =  require( 'gulp-minify-html' ),
    debug =       require( 'gulp-debug' );
//var $ = require('gulp-load-plugins')();

//util.log("./dist/0.0.2/trr_photo_effects.min.js");
gulp.task( 'default', function() {
  gulp.src([
    // "dev/src/*.js",

    // 3rd party libs.
    './js/ScrollMagic/src/minified/ScrollMagic.min.js',
    './js/gsap/src/minified/TweenMax.min.js',
    './js/gsap/src/minified/TimelineMax.min.js',

    // Plugin core libs.
    './js/main.js',
    './js/globals.js',
    './js/lib.js',
    './js/init.js',
    './js/elements.js',
    './js/scroll_events.js',

    // other
    './js/page_fixups.js',
    
    // for the canvas-dots effect extensions.
    './images/laura_particles.js',
    './images/gary_particles.js',
    './images/chris_particles.js',
    './images/curt_particles.js',

    ])
    .pipe(debug({title: 'Loaded:'}))
    .pipe(concat( 'trr_photo_effects.0.2.2.min.js' ))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/v02'))
    .pipe(debug());
});
