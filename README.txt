cd /Applications/MAMP/htdocs/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects-v2
//---------------------------------------------------
based on:
    AtomProjects/harp/greensock-getting-started/
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

"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  if(plugin.globals.logging){plugin.statusLog( "  ..*5: elements.js: loaded. *" );}

  //----------------------------------------------------------------------------
  plugin.generateAnimationElements = function( callback ) {
    //--------------------------------------------------------------------------
    plugin.globals.nextParticleMethod = 'nextParticleFromHashArray';

    plugin.globals.createPositionedElementMethod = plugin.globals.isStartImageCollapsed
        ? 'createCollapsedPositionSVGelement' : 'createExpandedPositionSVGelement';
    plugin.globals.elementTweenMethod = plugin.globals.isStartImageCollapsed
        ? 'tweenCollapsedPositionSVGelement' : 'tweenExpandedPositionSVGelement';
    plugin.globals.tweenDuration = 3;
    plugin.globals.isCreateElementsObjArray = false;
    plugin.globals.animationContainerBackgroundColor = '#E7F1F7'; // Climate Corp "halftone background blue"
    plugin.globals.animationContainerOffsetX = '51%';

    plugin.globals.animationContainerOffsetY = '2%';
    plugin.globals.animationElementsType = 'SvgCircle';
    plugin.globals.animationElementColor = '#0099cc';

    if(plugin.globals.logging){plugin.statusLog( "  ..*5.1: elements.js: plugin.generateAnimationElements() For " + plugin.globals.photos.length + " photos.*" );}
    // Create and append enclosing <div> to Wordpress theme's <body><div id='content'><article>
    // Profile text will scroll over our animated photos.
    plugin.globals.$animationContainer = $( plugin.createAnimationContainer() );
    var last_photo = plugin.globals.photos.length - 1;
    $.each( plugin.globals.photos, function( index, el ) {
      var $el = $(el);
      if(plugin.globals.logging){plugin.statusLog( "  ..*5.1a: elements.js: plugin.generateAnimationElements() id: '" + $el.data( 'domIdAttr' ) +
                        "'. PhotoTag: '" + $el.data( 'photoTag' ) + "'. *" );}

      $el.data( 'sceneContainer', plugin.createSceneContainer( $el ) );
      $el.data( '$sceneContainer', $( $el.data( 'sceneContainer' ) ) );
      // NOTE: container.style.display = 'none'. Will be enabled during animation.
      plugin.globals.$animationContainer.append( $el.data( 'sceneContainer' ) );
      plugin.getParticlesFromDataFile( $el,
      /*1a-Resume here when done*/ function( particlesInfo ) {
      $el.data( 'particlesInfo', particlesInfo );
      // NOTE: for each photo a <svg> container enclosing an array of SVG <circle> elements.
      plugin.createSvgElementsFromParticles( $el,
      /*1b-Resume here when done*/ function() {
      // New <svg>[<circle>]</svg> has been appended to the sceneContainer.
      // We now have a GSAP timeline to attach to a scroll event.
      plugin.add_scroll_event( $el,
      /*1c-Resume here when done*/ function() {
      // Release memory?
      particlesInfo.particles.obj = [];
      if ( index == last_photo ) {
        if(plugin.globals.logging){plugin.statusLog( "  ..*5.1b: elements.js: plugin.generateAnimationElements() END *" );}
        if ( typeof callback == 'function' ) { callback( null ); return; }
        return null;
      }
      /*1c-*/});/*1b-*/});/*1a-*/});
    }); // end of $.each(photos)
  }; // end: generateAnimationElements()

  //----------------------------------------------------------------------------
  plugin.createAnimationContainer = function() {
    //--------------------------------------------------------------------------
    if(plugin.globals.logging){plugin.statusLog( " ..*5.2: elements.js: plugin.createAnimationContainer() *" );}
    // We will use the Wordpress theme's <body><div id='content'><article>
    // Dom element. It is the width of the WP content "body" where the profile
    // text and photos are. So we make a <div> after '.entry-header' and before
    // the page's '.entry-content'.
    return $( '<div/>' )
        .attr( 'id', 'trr_ani_Container_' )
        .css( 'width', 'inherit' )
        .css( 'height', '600' )
        .css( 'padding', '0' )
        .css( 'margin', '0' )
        .css( 'overflow', 'hidden' )
        .css( 'position', 'fixed' )
        .css( 'z-index', '-1' )
        .css( 'top', plugin.globals.animationContainerOffsetY )
        .css( 'left', plugin.globals.animationContainerOffsetX )
      .insertBefore( $( '.entry-header' ) );
  }; // end: createAnimationContainer()

  //----------------------------------------------------------------------------
  plugin.createSvgElementsFromParticles = function( $el, callback ) {
    //--------------------------------------------------------------------------
    var particlesInfo = $el.data( 'particlesInfo' ),
        domElementsObjsArray = [];
    // NOTE: particlesInfo == undefined if file not found.
    if ( !particlesInfo ) {
      if ( typeof callback == 'function' ) { callback(); return; }
      return;
    }
    if(plugin.globals.logging){plugin.statusLog( " ..*5.3: elements.js: createSvgElementsFromParticleMap() Particles source: '" + particlesInfo.source +
                 "'. numParticles = '" + particlesInfo.numParticles +
                 "'. nextParticleMethod: '" + plugin.globals.nextParticleMethod +
                 "'. ShowElementsImage: '" + plugin.globals.isShowElementsImage +
                 "'. StartImageCollapsed: '" + plugin.globals.isStartImageCollapsed +
                 "'. RandomizeCollapsedCore: '" + plugin.globals.isRandomizeCollapsedCore +
                 "'. timeline.tweenDuration: '" + plugin.globals.tweenDuration +
                 "'. createPositionedElementMethod: '" + plugin.globals.createPositionedElementMethod +
                 "'. elementTweenMethod: '" + plugin.globals.elementTweenMethod +
                 ". *");}

    // Insert the REQUIRED <svg> tag within the sceneContainer to contain the svg <circle> elements.
    // NOTE: browser can not directly add <svg> or <circle> tags, need to use "w3.org namespace".
    var $elementsContainer =
      $( plugin.makeSvgElementNS('svg') )
        .attr( 'id', 'aniElems_Con_' )
        .attr( 'width', '600' )
        .attr( 'height', '600' )
        .attr( 'trr-ani-elem-type', 'circle' )
        .addClass( 'trr-ani-elems-container' );

    // Insert into our sceneContainer.
    $el.data( '$sceneContainer' ).append( $elementsContainer );
    // Assume activeScene container was made invisible.


    var numElements = 0;
    var mainTimeline = new TimelineMax(
            { repeat: 0, yoyo: false, repeatDelay: 0, delay: 0, paused: true, } );

    // Create element (svg <circle> in the particle's "expanded/home position" or
    // its "collapsed/core position". In any case we will need the coreXY values.
    var results = null;
    // results = { element: <circle>, particle: particle,
    //             homeX: particle.props.x, homeY: particle.props.y,
    //             coreX: coreX, coreY: coreY, }
    while ( (results = plugin.createPositionedSVGelement( $el )) ) {
      $elementsContainer.append( results.element );
      if ( plugin.globals.isCreateElementsObjArray ) {
        domElementsObjsArray.push( results.element );
      }
      // Create timeline of tweens that either:
      //    "collapses" the halftone image to a shrunken core.
      //    or "expands" the halftone image from a shrunken core to a full image.
      mainTimeline.insert( plugin[ plugin.globals.elementTweenMethod ]( mainTimeline, results ) );
      numElements += 1;
    }; // end while ( results )

    // Resume here when all elements created.
    $el.data( 'numElements', numElements );
    $el.data( '$elementsContainer', $elementsContainer );
    $el.data( 'mainTimeline', mainTimeline );
    $el.data( 'mainTimelineIsReversed', true );

    if(plugin.globals.logging){plugin.statusLog( " ..*5.3a: elements.js: createSvgElementsFromParticleMap(): Made " + $el.data( 'numElements' ) +
                 " " + plugin.globals.animationElementsType + " AnimationElements. *");}

    if ( typeof callback == 'function' ) { callback(); return; }
    return;
  }; // end createSvgElementsFromParticles()

  //----------------------------------------------------------------------------
  plugin.tweenExpandedPositionSVGelement = function( timelineMax, results ) {
    //--------------------------------------------------------------------------
    // NOTE: particles(xy) image is currently EXPANDED,
    //       move em to a collapsed position.
    // ---------------------------------------------------
    return TweenMax.to(
      results.element, plugin.globals.tweenDuration,
      // At this point the <circle> has a cx/cy of the particle's image
      // 'home' position. Create timeline of tweens that "collapse" the
      // halftone image to a shrunken core.
      { attr: { cx: results.coreX,
                cy: results.coreY,
              },
        // autoAlpha - the same thing as "opacity" except that when the
        // value hits "0", the "visibility" property will be set to "hidden",
        // i.e. fade.
        autoAlpha: 0,
        //ease: Power0.easeInOut,
      }
    ); // end TweenMax.to()
  }; // end tweenExpandedPositionSVGelement()

  //----------------------------------------------------------------------------
  plugin.createPositionedSVGelement = function( $el ) {
    //--------------------------------------------------------------------------
    var results = null,
        particle = null,
        element = null,
        coreX = plugin.calcCoreX(),
        coreY = plugin.calcCoreY();
    if ( (particle = plugin.getNextParticle( $el )) ) {
      element = plugin[ plugin.globals.createPositionedElementMethod ]( particle, coreX, coreY );
    } else {
      return null;
    }
    if ( plugin.globals.isStartImageCollapsed &&
        !plugin.globals.isElementVisible ) {
      $( element ).attr( 'opacity', 0 );
    }
    return {
      element: element, particle: particle,
      homeX: particle.props.x, homeY: particle.props.y,
      coreX: coreX, coreY: coreY,
    };
  }; // end createPositionedSVGelement()

  //----------------------------------------------------------------------------
  plugin.createExpandedPositionSVGelement = function( particle, coreX, coreY ) {
    //--------------------------------------------------------------------------
    // Create elements to start at their 'home position' which will recreate the
    // photo image.
    return $( plugin.makeSvgElementNS( 'circle' ) )
              .attr( 'cx', particle.props.x )
              .attr( 'cy', particle.props.y )
              .attr( 'r', particle.props.r )
              .attr( 'fill', plugin.globals.animationElementColor );
  }; // end createExpandedPositionSVGelement()

  //----------------------------------------------------------------------------
  plugin.makeSvgElementNS = function( tag ) {
    //--------------------------------------------------------------------------
    // per: http://chubao4ever.github.io/tech/2015/07/16/jquerys-append-not-working-with-svg-element.html
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }; // end makeSvgElementNS()

  //----------------------------------------------------------------------------
  plugin.add_scroll_event = function( $el, callback ) {
    //--------------------------------------------------------------------------
    if(plugin.globals.logging){plugin.statusLog( "  ..*7a: scroll_events.js add_scroll_event() for photo: '" + $el.data( 'photoTag' ) + ":" + $el.attr( 'id' ) + "'. *" );}
    var img_position = $el.position(),
        img_height = $el.height(),
        triggerElement_offset_y = img_height * 2,
        triggerElement_selector = "#" + $el.attr( 'id' );
    if(plugin.globals.logging){plugin.statusLog( "  ..*7a.1: scroll_events.js add_scroll_event() photo.position.top: '" + img_position.top +
                      "'.  photo.height: '" + img_height +
                      "'.  triggerElement_selector: '" + triggerElement_selector +
                      "'.  triggerElement_offset_y: '" + triggerElement_offset_y +
                      "'. *" );}

    // Add scrollMagic hook for this photo.
    // create a scene
    // trigger position:
    //   default: element CROSSES THE MIDDLE of the viewport
    //   onEnter: element CROSSES THE BOTTOM of the viewport - either scroll up or down.
    //   onLeave: element
    //
    new ScrollMagic.Scene({
        // trigger point is the bio Title line.
        // triggerElement: '.bio-container-for-' + $(el).attr( 'id')
        //+ ' .info' + ' .title', // point of execution
        triggerElement: triggerElement_selector, // point of execution
        triggerHook: 'onEnter', // on enter from the bottom.
        offset: triggerElement_offset_y
    })
    .on('start', function (event) {
        plugin.scrollTo( event );
    })
    .addTo( plugin.globals.scrollMagic_controller ); // assign the scene to the controller

    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  };// end: add_scroll_event()

  return plugin;
} ( jQuery, TrrPePlugin || {} ) );


========================================

var $scrolledToProfile = $( event.currentTarget.triggerElement() ); // i.e. the <img> tag.
if(plugin.globals.logging){plugin.statusLog( "  ..*7a.2: scroll_events.js ScrollMagic event: '" +
                  event.scrollDirection + ": " + event.state +
                  "'. toPhotoTag: '" + $scrolledToProfile.data( 'photoTag' ) +
                  "'. previousProfile.photoTag: '" + ($scrolledToProfile.data( 'previousProfileTag' ) || '*none*') +
                  "'. nextProfileTag: '" + ($scrolledToProfile.data( 'nextProfileTag' ) || '*none*') +
                  "'. *" );}

if ( !$profile || !$profile.data ||
     !$profile.data( 'mainTimeline' ) ) {
                    if(plugin.globals.logging){plugin.statusLog( "  ..*7b.1: scroll_events.js appear() no profile or profile.mainTimeline. IGNORED *");}
                    if ( typeof callback == 'function' ) { callback( null ); return; }
                    return null;
                  }
if (forwards) {
  console.log( " ..*4.5) scrollTo() will execute: 'window[ " + ('to' + scrolledToShapeTag) + "].play();' *" );
  $profile.data( 'mainTimeline' ).play();
} else {
  console.log( " ..*4.5) scrollTo() will execute: 'window[ " + ('to' + scrolledToNextShapeTag) + "].reverse();' *" );
  $profile.data( 'mainTimeline' ).reverse();
}

// showing laura. scroll down to gary. Scroll event is for gary (me), laura is previous.
if ( event.state == 'DURING' ) {
  // 'moving_up_into_view'
  morphToNextPhoto( event, $scrolledToProfile );

  $scrolledToProfile.data( 'mainTimeline' ).play();
  return;
  /*1a-*/});/*1-*/});
} else { // event.state == 'BEFORE' which means 'moving_down_out_of_view'
  plugin.disappear( $scrolledToProfile,
  /*2-Resume here when done*/ function() {
  plugin.appear( $scrolledToProfile.data( '$previousProfile' ),
  morphToPreviousPhoto( event, $scrolledToProfile );
  $scrolledToProfile.data( '$previousProfile' ).data( 'mainTimeline' ).reverse();
  return;
  /*2a-*/});/*2-*/});
}
};// end: scrollTo()

//----------------------------------------------------------------------------
plugin.appear = function( $profile, callback ) {
//--------------------------------------------------------------------------
if ( !$profile || !$profile.data ||
     !$profile.data( 'mainTimeline' ) ) {
  if(plugin.globals.logging){plugin.statusLog( "  ..*7b.1: scroll_events.js appear() no profile or profile.mainTimeline. IGNORED *");}
  if ( typeof callback == 'function' ) { callback( null ); return; }
  return null;
}

if(plugin.globals.logging){plugin.statusLog( "  ..*7b.2: scroll_events.js appear() For '" + $profile.data( 'photoTag' ) + "' appearMethod: '" + $profile.data( 'appearMethod' ) + "'. *");}

// NOTE: refactor to eliminate if branch, redundant callbacks as:
//  plugin[ $profile.data( 'appearMethod' ) ]( $profile, 'isInCollapsedPosition'
//  /*1-Resume here when done*/ function() {
//  $profile.data( '$sceneContainer' ).css( 'display', 'block' );
//  if ( typeof callback == 'function' ) { callback( null ); return; }
//  return null;
// /*1-*/});
// And in appearMethod( $profile, testMethod )
// if testMethod fails, just call back.

// NOTE: upon init we get a scroll event and sceneContainer may not be visible.
$profile.data( '$sceneContainer' ).css( 'display', 'block' );
if ( plugin.isInCollapsedPosition( $profile ) ) {
  // if startExpanded appearMethod = 'playTimelineBackwards
  plugin[ $profile.data( 'appearMethod' ) ]( $profile,
  /*1-Resume here when done*/ function() {
  if ( typeof callback == 'function' ) { callback( null ); return; }
  return null;
  /*1-*/});
} else {
  if(plugin.globals.logging){plugin.statusLog( "  ..*7b.3: scroll_events.js appear(): '" + $profile.data( 'photoTag' ) + "' is are already in an expanded position, nothing to do. *");}
  if ( typeof callback == 'function' ) { callback( null ); return; }
  return null;
}
}; // end: appear()

//----------------------------------------------------------------------------
plugin.disappear = function( $profile, callback ) {
//--------------------------------------------------------------------------
if ( !$profile || !$profile.data ||
     !$profile.data( 'mainTimeline' ) ) {
  if(plugin.globals.logging){plugin.statusLog( "  ..*7c.1: scroll_events.js disappear() no profile or profile.mainTimeline. IGNORED *");}
  if ( typeof callback == 'function' ) { callback( null ); return; }
  return null;
}

if(plugin.globals.logging){plugin.statusLog( "  ..*7c.2: scroll_events.js disappear() For '" + $profile.data( 'photoTag' ) + "' disappearMethod: '" + $profile.data( 'disappearMethod' ) + "'. *");}
if ( plugin.isInExpandedPosition( $profile ) ) {
  // if startExpanded appearMethod = 'playTimelineForwards'
  plugin[ $profile.data( 'disappearMethod' ) ]( $profile,
  /*1-Resume here when done*/ function() {
  $profile.data( '$sceneContainer' ).css( 'display', 'none' );
  if ( typeof callback == 'function' ) { callback( null ); return; }
  return null;
  /*1-*/});
} else {
  if(plugin.globals.logging){plugin.statusLog( "  ..*7c.3: scroll_events.js disappear(): '" + $profile.data( 'photoTag' ) + "' is are already in a collapsed position, nothing to do. *");}
  if ( typeof callback == 'function' ) { callback( null ); return; }
  return null;
}
}; // end: disappear()

//----------------------------------------------------------------------------
plugin.playTimelineForwards = function(  $profile, callback  ) {
//----------------------------------------------------------------------------
if(plugin.globals.logging){plugin.statusLog( "  ..*5.4: elements.js playTimelineForwards() Halftone image for '" + $profile.data( 'photoTag' ) +
                                             "' IS NOW expanded. Start collapsing it. *" );}
//tcb.gsapTimeline.play(); //pause(5);
//tcb.isReversed = false;
$profile.data( 'mainTimeline' ).play();
$profile.data( 'mainTimelineIsReversed', false );
if(plugin.globals.logging){plugin.statusLog( " ..*5.4a: elements.js playTimelineForwards() Waiting '" +
                                             $profile.data( 'delayMsToWaitForPartialCollapsedState' ) +
                                             "'ms for Halftone image for '" + $profile.data( 'photoTag' ) +
                                             "' to PARTIALLY collapse. *" );}
setTimeout(function() {
/*1-Resume here when WaitForPartialCollapsedState Timeout done*/
if(plugin.globals.logging){plugin.statusLog( " ..*5.4b: elements.js playTimelineForwards() Halftone image for '" +
                                             $profile.data( 'photoTag' ) + "' IS NOW PARTIALLY collapsed. *" );}
if ( typeof callback == 'function' ) { callback( null ); return; }
return null;
}, $profile.data( 'delayMsToWaitForPartialCollapsedState' )); // end /*1-timeout*/
}; // end: playTimelineForwards()

//----------------------------------------------------------------------------
plugin.playTimelineBackwards = function( $profile, callback ) {
//----------------------------------------------------------------------------
if(plugin.globals.logging){plugin.statusLog( "  ..*5.5: elements.js playTimelineBackwards() For photoTag: '" +
                                             $profile.data( 'photoTag' ) + "'. REVERSING profile.mainTimeline. *");}
//tcb.gsapTimeline.reverse();
//tcb.isReversed = true;
$profile.data( 'mainTimeline' ).reverse();
$profile.data( 'mainTimelineIsReversed', true );
if(plugin.globals.logging){plugin.statusLog( " ..*5.5a: elements.js playTimelineBackwards() Waiting '" +
                                             $profile.data( 'delayMsToWaitForPartialExpandedState' ) +
                                             "'ms for Halftone image for '" + $profile.data( 'photoTag' ) +
                                             "' to PARTIALLY expand. *" );}
setTimeout(function() {
/*1-Resume here when WaitForPartialExpandedState Timeout done*/
if(plugin.globals.logging){plugin.statusLog( " ..*5.5b: elements.js playTimelineBackwards() Halftone image for '" +
                                             $profile.data( 'photoTag' ) + "' IS NOW PARTIALLY expanded. *" );}
if ( typeof callback == 'function' ) { callback( null ); return; }
return null;
}, $profile.data( 'delayMsToWaitForPartialExpandedState' )); // end /*1-timeout*/
}; // end: playTimelineBackwards()

//----------------------------------------------------------------------------
plugin.isInExpandedPosition = function( $profile ) {
//----------------------------------------------------------------------------
if(plugin.globals.logging){plugin.statusLog( " ..*5.6: elements.js isInExpandedPosition(): " +
             "StartImageExpanded: '" + plugin.globals.isStartImageExpanded +
             "'. Will return: '" + ( plugin.globals.isStartImageExpanded
                  ? $profile.data( 'mainTimelineIsReversed' ) : !$profile.data( 'mainTimelineIsReversed' ) ) + "'*");}
if ( plugin.globals.isStartImageExpanded ) {
  // Note: isReversed means "image is expanded"
  return $profile.data( 'mainTimelineIsReversed' );
}
// if ( _this.settings.isStartImageCollapsed ) {
// Note: isReversed means "image is collapsed"
return !$profile.data( 'mainTimelineIsReversed' );
}; // end: isInExpandedPosition()

//----------------------------------------------------------------------------
plugin.isInCollapsedPosition = function( $profile ) {
//----------------------------------------------------------------------------
if(plugin.globals.logging){plugin.statusLog( " ..*5.7: elements.js isInCollapsedPosition(): " +
             "StartImageExpanded: '" + plugin.globals.isStartImageExpanded +
             "'. Will return: '" + !plugin.isInExpandedPosition( $profile ) + "'*");}
return !plugin.isInExpandedPosition( $profile );
}; // end: isInCollapsedPosition()

return plugin;
} ( jQuery, TrrPePlugin || {} ) );
=================================
