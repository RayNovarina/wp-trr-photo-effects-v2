cd /Applications/MAMP/htdocs/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects-v2
//---------------------------------------------------
based on:
    AtomProjects/harp/gsap-sandbox-halftone/
    per: https://greensock.com/jump-start-js
         https://greensock.com/get-started-js#intro
    javascript module pattern per: http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html

local dev path for this file:
  /Applications/MAMP/htdocs/Sites/wordpress-5-trr-staging/wp-content/plugins/trr-photo-effects-v2/README.txt

browser access: start OSX Mamp. Apache server at localhost:8888
  browser only access: http://localhost:8888/Sites/wordpress-5-exploding-profiles/management-team/

github repository:
  https://github.com/RayNovarina/wp-trr-photo-effects-v2.git
staging site:
  http://trafficrevenueresults.com/management-team/

login: http://localhost:8888/Sites/wordpress-5-exploding-profiles/management-team/wp-login.php

===================
$ cd /Applications/MAMP/htdocs/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects
$ npm and gulp notes:
npm config set prefix /usr/local
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
npm install gulp -g
npm install --save-dev gulp
sudo npm install --save-dev gulp-uglify
sudo npm install gulp-minify --save-dev
sudo npm install gulp-minify-html --save-dev
sudo npm install browser-sync --save-dev

create gulpfile.js:
  // including plugins
  var gulp = require('gulp')
      , minifyHtml = require("gulp-minify-html");
  // task
  gulp.task('minify-html', function () {
      gulp.src('./Html/*.html') // path to your files
      .pipe(minifyHtml())
      .pipe(gulp.dest('path/to/destination'));
  });

Verify:
$ gulp
  [21:05:43] Using gulpfile /Applications/MAMP/htdocs/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects/gulpfile.js
  [21:05:43] Task 'default' is not in your gulpfile

Run from command line using the gulp.task name:
$ gulp minify-html

=========================

original canvas-dots-cat:
per: https://codepen.io/Mamboleoo/pen/wKqwPN
     https://codepen.io/Mamboleoo/post/how-to-convert-an-image-into-particles

Tutorial:

In this tutorial I will just explain how to generate an array filled with
coordinates from the pixels of our image. Those pens above are using ThreeJs
to create a depth effect but I won't get into 3D over here. I will just use
the Canvas API ;)

You need a basic canvas tag in your HTML
<canvas id="scene"></canvas>

We will use some CSS to make our result nicer
body, html{
  width:100%;
  height:100%;
  overflow: hidden;
  background: black;
}
canvas{
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
}

And finally you need your image
CodePen logo: 100x100 .png 72 DPI Color mode RGB

Get the infos of your image
Now that we have our basic scene we need to convert our image into an array of data.

Create a new image element and execute the 'drawScene' function when it is loaded.
var png = new Image();
png.onload = drawScene;
png.src = "codepen.png";
Now that our image is loaded, we can init our canvas scene.
var canvas    = document.getElementById("scene");
var ctx       = canvas.getContext("2d");

canvas.width = png.width;
canvas.height = png.height;
The next step is to draw the image, get the data from the scene and finally
clearing it. To get the data we will use the getImageData method from the
Canvas API.
This method returns an object with an array in it that contains 4 values for
each pixel: one for each color (RGB) and a last one for the Alpha.
You can find more infos about the getImageData method here

ctx.drawImage(png, 0, 0);
var data = ctx.getImageData(0, 0, png.width, png.height);
ctx.clearRect(0,0,canvas.width, canvas.height);

We now have an array with the data of every pixel from the image. But we only
want specific pixels. In this case I will select only the pixel with no
transparency (but you can target all the blue pixels, the darker
pixels [...] It's up to you !).

To select the pixels we need, we will loop through the Y and the X axis of
our image. That's why we have a loop into another one.
I check if it's four value (Alpha) is over than 128, the average value.
(Each value is between 0 and 255).
If the Alpha is over 128, I push the pixel into my particles array.

var particles = [];
for (var y = 0, y2 = data.height; y < y2; y++) {
    for (var x = 0, x2 = data.width; x < x2; x++) {
        if (data.data[(x * 4 + y * 4 * data.width) + 3] > 128) {
            var particle = {
                x : x,
                y : y
            };
            particles.push(particle);
        }
    }
}
#Check if the array is correct
We can do a quick check by drawing every particle on our scene.

Set the fillStyle to white.
Loop through all the particles.
Draw each particle with its coordinates.
And voila !
ctx.fillStyle = "white";
for(var i=0, j=particles.length;i<j;i++){
    var particle = particles[i];
    ctx.fillRect(particle.x, particle.y, 1, 1);
}

=================================
NOTES:
=================================
* Add to each photo attribs:
  - ImageOffsetX and Y.
  Not all base photos are "centered".
  Use to "center" home position, i.e. expanded image.
* Add to Each particles file:
  - ImageOffsetX and Y.
  Use to "center" the collapsed cores of the collapsing and expanding images.
  Apply to animation boundaries when
  calculating RandomizeCollapsedCore
  values.


=================================
boneyard snippets:
=================================

<!-- -->
<div style="display: none;"><script src="http://localhost:8888/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects-v2/js/gsap/src/minified/TweenMax.min.js"></script><script src="http://localhost:8888/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects-v2/js/gsap/src/minified/TimelineMax.min.js"></script><script src="http://localhost:8888/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects-v2/js/ScrollMagic/src/minified/ScrollMagic.min.js"></script><script src="http://localhost:8888/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects-v2/js/globals.js"></script><script src="http://localhost:8888/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects-v2/js/init.js"></script><script src="http://localhost:8888/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects-v2/js/page_fixups.js"></script><script src="http://localhost:8888/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects-v2/js/lib.js"></script><script src="http://localhost:8888/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects-v2/js/elements.js"></script><script src="http://localhost:8888/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects-v2/js/scroll_events.js"></script>
<script src="http://localhost:8888/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects-v2/images/laura_particles.js">
</script><script src="http://localhost:8888/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects-v2/js/main.js"></script></div>


===============================================
// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function scrollTo( _this, options, callback ) {
  //----------------------------------------------------------------------------
  var $scrolledToElem = ( options.toPhotoTag ? null : $( options.event.currentTarget ) ),
      toPhotoTag = options.toPhotoTag || $scrolledToElem.attr( 'photoTag' ),
      $toPhotoImg = $( '#' + 'newPhoto' + toPhotoTag.charAt( 0 ).toUpperCase() + toPhotoTag.slice(1).toLowerCase() ),
      fromPhotoTag = _this.activeStory.tag;
  //alert( "Clicked on ScrollTo '" + $scrolledToElem.attr( 'photoTag' ) + ".  Active halftone profile: '" + _this.activeStory.tag + "'. *" );
  console.log( " ..*4.5) scrollTo() Scroll To: '" + toPhotoTag + ".  Scroll From: '" + fromPhotoTag + "'. *" );

  var fromStory = _this.activeStory;
  if ( !fromStory.timelines ||
       !fromStory.timelines.main ) {
    alert( "Scroll From: '" + fromPhotoTag + "'. A story has not been created for this photo yet! You MUST create animationElements first via the 'Particles, Elements' links." );
    if ( typeof callback == 'function' ) { callback( toPhotoTag ); return; }
    return toPhotoTag;
  }

  photoTagToStory( _this, toPhotoTag,
  /*1-Resume here when done*/ function( results ) {
  if ( !results.isFound ||
       !results.item.timelines ||
       !results.item.timelines.main ) {
    alert( "Scroll To: '" + toPhotoTag + "'. A story has not been created for this photo yet! You MUST create animationElements first via the 'Particles, Elements' links." );
    if ( typeof callback == 'function' ) { callback( toPhotoTag ); return; }
    return toPhotoTag;
  }
  var toStory = results.item;

  //----------------------------------------------------------------------------
  // 1) Make sure selected photo animation Stage shows an expanded image.
  //    Then start its collapse.
  //----------------------------------------------------------------------------
  var story = fromStory;
  // NOTE: after elements are built they form an expanded image.
  var delayMsToWaitForStartState = 0;
  console.log( " ..*4.5) scrollTo() From Story: Halftone image for '" + fromPhotoTag + "' is CURRENTLY '" + (story.timelines.main.isReversed ? 'expanded' : 'collapsed' ) + "'. *" );
  // Note: collapse.isReversed means "image is expanded"
  if ( !story.timelines.main.isReversed ) {
    delayMsToWaitForStartState = 2000;
    console.log( " ..*4.5) scrollTo() From Story: Halftone image for '" + fromPhotoTag + "' IS NOW collapsed. Start expanding it. *" );
    story.timelines.main.gsapTimeline.reverse();
    story.timelines.main.isReversed = true;
  }
  console.log( " ..*4.5) scrollTo() Waiting '" + delayMsToWaitForStartState + "'ms for From Story Halftone image for '" + fromPhotoTag + "' to expand. *" );
  setTimeout(function() {
  /*1a-Resume here when WaitForStartState Timeout done*/
  console.log( " ..*4.5) scrollTo() From Story: Halftone image for '" + fromPhotoTag + "' IS NOW expanded. Start collapsing it. *" );
  story.timelines.main.gsapTimeline.play();
  story.timelines.main.isReversed = false;
  var delayMsToWaitForCollapsedState = 2000;
  console.log( " ..*4.5) scrollTo() Waiting '" + delayMsToWaitForCollapsedState + "'ms for From Story Halftone image for '" + fromPhotoTag + "' to collapse. *" );
  setTimeout(function() {
  /*1b-Resume here when WaitForCollapsedState Timeout done*/
  console.log( " ..*4.5) scrollTo() From Story: Halftone image for '" + fromPhotoTag + "' IS NOW collapsed. " +
               "Select, display photo we are scrolling to ('" + toPhotoTag + "'). *" );

  //----------------------------------------------------------------------------
  // 2) Select, display photo we are scrolling to.
  //    Make sure selected photo animation Stage shows a collapsed image.
  //    Then start its expansion.
  //----------------------------------------------------------------------------
  // Select, display photo we are scrolling to. NOTE: set new _this.activeStory.
  newPhoto( _this, { photoTag: toPhotoTag, photoType: $toPhotoImg.attr('photoType'), imgSrc: $toPhotoImg.attr('data-src') },
  /*1c-Resume here when newPhoto(toPhotoTag) done*/ function( image ) {
  story = toStory;
  console.log( " ..*4.5) scrollTo() To Story: Photo for '" + toPhotoTag + "' IS NOW being displayed as a '" +
               (story.timelines.main.isReversed ? 'expanded' : 'collapsed' ) + "' Halftone image. *" );

  delayMsToWaitForCollapsedState = 0;
  if ( story.timelines.main.isReversed ) {
    delayMsToWaitForCollapsedState = 2000;
    console.log( " ..*4.5) scrollTo() To Story: Halftone image for '" + toPhotoTag + "' is now expanded. Start collapsing it. *" );
    story.timelines.main.gsapTimeline.play();
    story.timelines.main.isReversed = false;
  }
  console.log( " ..*4.5) scrollTo() Waiting '" + delayMsToWaitForCollapsedState + "'ms for To Story Halftone image for '" + fromPhotoTag + "' to collapse. *" );
  setTimeout(function() {
  /*1d-Resume here when WaitForCollapsedState Timeout done*/
  console.log( " ..*4.5) scrollTo() To Story: Halftone image for '" + toPhotoTag + "' IS NOW collapsed. Start expanding it. *" );
  story.timelines.main.gsapTimeline.reverse();
  story.timelines.main.isReversed = true;
  delayMsToWaitForExpandedState = 2000;
  console.log( " ..*4.5) scrollTo() Waiting '" + delayMsToWaitForExpandedState + "'ms for To Story Halftone image for '" + fromPhotoTag + "' to expand. *" );
  setTimeout(function() {
  /*1e-Resume here when WaitForExpandedState Timeout done*/
  console.log( " ..*4.5) scrollTo() To Story: Halftone image for '" + toPhotoTag + "' IS NOW expanded. *" );
  // To Story:
  }, delayMsToWaitForExpandedState); // end /*1e-timeout*/
  }, delayMsToWaitForCollapsedState); // end /*1d-timeout*/

  // From Story:
  /*1c-*/}); }, delayMsToWaitForCollapsedState); // end /*1b-timeout*/
  }, delayMsToWaitForStartState); // end /*1a-timeout*/
  if ( typeof callback == 'function' ) { callback( toPhotoTag ); return; }
  return toPhotoTag;
  /*1-*/});
}; // end: scrollTo()

======================================

//----------------------------------------------------------------------------
function calcCoreXY( _this, options, particle ) {
  //----------------------------------------------------------------------------
  var coreX = _this.settings.createAnimationElementsParams.collapsedCoreX,
      coreY = _this.settings.createAnimationElementsParams.collapsedCoreY;
  if ( _this.settings.createAnimationElementsParams.isRandomizeCollapsedCore ) {
    coreX = getRandom( _this.settings.animationPanelLeftBoundaryX, _this.settings.animationPanelRightBoundaryX );
    coreY = getRandom( _this.settings.animationPanelTopBoundary, _this.settings.animationPanelBottom );
  }
  return {
    coreX: coreX,
    coreY: coreY
  };
}; // end calcCoreXY()

===============================
// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function playSelectedStory( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) playSelectedStory() for activeStory: '" + _this.activeStory.tag + "' *");

  // Hide the active/visible sceneContainer, we will replace it with ours.
  closeActiveSceneContainer( _this,
  /*1-Resume here when done*/ function( activeScene ) {
  tagToScene( _this, 'elements', _this.activeStory,
  /*2-Resume here when done*/ function( result ) {
  openSceneContainer( _this, result.item );

  // Play story for active/selectedPhoto. All scenes, i.e. expand and collapse.
  playStory( _this, _this.activeStory.tag, options,
  /*3-Resume here when done*/ function( story ) {
  if ( typeof callback == 'function' ) { callback( story ); return; }
  return story;
  /*3-*/});/*2-*/});/*1-*/});
}; // end: playSelectedStory()

//----------------------------------------------------------------------------
function playFullStory( _this, photoTag, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) playFullStory() create ParticleMap, animation elements, play story for '" + photoTag + "'. All scenes, i.e. expand and collapse. *");

  elements( _this, {
    isOnlyIfNewParticleMap: false,
    isRenderElementsImage: true,
    isCreateElementsObjArray: false,
    tweenDuration: 3,
    isCreateSceneInCenterPanel: true,
  },
  /*1-Resume here when done*/ function( activeScene ) {
  // Play story for active/selectedPhoto. All scenes, i.e. expand and collapse.
  playStory( _this, photoTag, options,
  /*2-Resume here when done*/ function( story ) {
  if ( typeof callback == 'function' ) { callback( story ); return; }
  return story;
  /*1-*/});
  /*1-*/});
}; // end: playFullStory()

//----------------------------------------------------------------------------
function playStory( _this, photoTag, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) playStory() Play story for '" + photoTag + "'. All scenes, i.e. expand and collapse. *");

  photoTagToStory( _this, photoTag,
  /*1-Resume here when done*/ function( result ) {
  if ( !result.isFound ||
       (!result.item.timelines ||
        !result.item.timelines.main ) ) {
    alert( "photoTag: '" + photoTag + "'. A story has not been created for this photo yet! You MUST create animationElements first via the 'Elements' link." );
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }
  // NOTE: after elements are built they form an expanded image.
  var story = result.item;
  var delayMsToWaitForStartState = 0;
  // Note: collapse.isReversed means "image is expanded"
  if ( !story.timelines.main.isReversed ) {
    delayMsToWaitForStartState = 2000;
    story.timelines.main.gsapTimeline.reverse();
    story.timelines.main.isReversed = true;
  }
  // Wait for image to get into start position.
  setTimeout(function() {
  /*1a-Resume here when Timeout done*/
  // Collapse the image.
  story.timelines.main.gsapTimeline.play();
  story.timelines.main.isReversed = false;
  // Wait for collapse to complete.
  var delayMsToWaitForCollapsedState = 2500;
  setTimeout(function() {
  /*1b-Resume here when Timeout done*/
  // Expand the collapse image back to a full image.
  story.timelines.main.gsapTimeline.reverse();
  story.timelines.main.isReversed = true;
  // Wait for expand to complete.
  var delayMsToWaitForExpandedState = 1000;
  setTimeout(function() {
  /*1c-Resume here when Timeout done*/
  if ( typeof callback == 'function' ) { callback( story ); return; }
  return story;
  }, delayMsToWaitForExpandedState); // end /*1c-timeout*/
  }, delayMsToWaitForCollapsedState); // end /*1b-timeout*/
  }, delayMsToWaitForStartState); // end /*1a-timeout*/
  /*1-*/});
}; // end: playStory()


================================
  //----------------------------------------------------------------------------
  plugin.addScrollEvents = function( callback ) {
    //--------------------------------------------------------------------------
    console.log( "  ..*1a: scroll_events.js: plugin.addScrollEvents() For " + plugin.globals.photos.length + " photos.*" );

    var last_photo = plugin.globals.photos.length - 1;
    $.each( plugin.globals.photos, function( index, el ) {
      var $el = $(el),
          photoTag = plugin.globals.photoTags[ index ];
      $el.attr( 'id', ('trr-pe-photo-' + (index + '') ) )
         .attr( 'trr-pe-photo-idx', index + '' )
         .attr( 'trr-pe-tag', photoTag );
      $el.data( 'previousProfile', ( index == 0 ? undefined : plugin.globals.photos[ index - 1 ]) );
      $el.data( 'previousProfileTag', ( index == 0 ? undefined : plugin.globals.photoTags[ index - 1 ]) );
      $el.data( 'nextProfile', ( index == last_photo ? undefined : plugin.globals.photos[ index + 1 ]) );
      $el.data( 'nextProfile', ( index == last_photo ? undefined : plugin.globals.photos[ index + 1 ]) );
      add_scroll_event( index, $el, plugin.globals.photoTags[ index ],
      /*1a-Resume here when done*/ function() {
      if ( index == last_photo ) {
        plugin.statusLog( "  ..*1a: scroll_events.js: END data to html conversion.*" );
        if ( typeof callback == 'function' ) { callback( null ); return; }
        return null;
      }
      /*1a-*/});
    }); // end of $.each(photos)
  }; // end: addScrollEvents()
