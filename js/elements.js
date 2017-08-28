"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  console.log( "  ..*5: elements.js: loaded. *" );

  //----------------------------------------------------------------------------
  plugin.generateAnimationElements = function( callback ) {
    //--------------------------------------------------------------------------
    plugin.globals.nextParticleMethod = 'nextParticleFromHashArray';
    plugin.globals.isRenderElementsImage = true;
    plugin.globals.isRandomizeCollapsedCore = true;
    plugin.globals.tweenDuration = 2;
    plugin.globals.isCreateElementsObjArray = false;
    plugin.globals.animationContainerBackgroundColor = '#E7F1F7'; // Climate Corp "halftone background blue"
    plugin.globals.animationContainerOffsetX = '50%';
    plugin.globals.animationContainerOffsetY = '5%';
    plugin.globals.animationElementsType = 'SvgCircle';
    plugin.globals.animationElementColor = '#0099cc';
    plugin.globals.collapsedCoreX = 100;
    plugin.globals.collapsedCoreY = 100;

    plugin.statusLog( "  ..*5.1: elements.js: plugin.generateAnimationElements() For " + plugin.globals.photos.length + " photos.*" );
    // Create and append enclosing <div> to Wordpress theme's <body><div id='content'><article>
    // Profile text will scroll over our animated photos.
    plugin.globals.$animationContainer = $( plugin.createAnimationContainer() );
    var last_photo = plugin.globals.photos.length - 1;
    $.each( plugin.globals.photos, function( index, el ) {
      var $el = $(el);
      plugin.statusLog( "  ..*5.1a: elements.js: plugin.generateAnimationElements() id: '" + $el.data( 'domIdAttr' ) +
                        "'. PhotoTag: '" + $el.data( 'photoTag' ) + "'. *" );

      $el.data( 'sceneContainer', plugin.createSceneContainer( $el ) );
      $el.data( '$sceneContainer', $( $el.data( 'sceneContainer' ) ) );
      // NOTE: container.style.display = 'none'. Will be enabled during animation.
      plugin.globals.$animationContainer.append( $el.data( 'sceneContainer' ) );
      plugin.getParticlesFromDataFile( $el,
      /*1a-Resume here when done*/ function( particlesInfo ) {
      $el.data( 'particlesInfo', particlesInfo );
      // NOTE: for each photo a <svg> container enclosing an array of SVG <circle> elements.
      plugin.createSvgElementsFromParticles( $el,
      /*1b-Resume here when done*/ function( results ) {
      // New <svg>[<circle>]</svg> has been appended to the sceneContainer.
      // We now have a GSAP timeline to attach to a scroll event.
      plugin.add_scroll_event( $el,
      /*1c-Resume here when done*/ function() {
      if ( index == last_photo ) {
        plugin.statusLog( "  ..*5.1b: elements.js: plugin.generateAnimationElements() END *" );
        if ( typeof callback == 'function' ) { callback( null ); return; }
        return null;
      }
      /*1c-*/});/*1b-*/});/*1a-*/});
    }); // end of $.each(photos)
  }; // end: generateAnimationElements()

  //----------------------------------------------------------------------------
  plugin.createAnimationContainer = function() {
    //----------------------------------------------------------------------------
    plugin.statusLog( " ..*9.1: lib.js: plugin.createAnimationContainer() *" );
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
    //----------------------------------------------------------------------------
    var particlesInfo = $el.data( 'particlesInfo' ),
        domElementsObjsArray = [];
    // NOTE: particlesInfo == undefined if file not found.
    if ( !particlesInfo ) {
      if ( typeof callback == 'function' ) { callback( null ); return; }
      return null;
    }
    plugin.statusLog( " ..*5.2: elements.js: createSvgElementsFromParticleMap() Particles source: '" + particlesInfo.source +
                 "'. numParticles = '" + particlesInfo.numParticles +
                 "'. nextParticleMethod: '" + plugin.globals.nextParticleMethod +
                 "'. RenderElementsImage: '" + plugin.globals.isRenderElementsImage +
                 "'. RandomizeCollapsedCore: '" + plugin.globals.isRandomizeCollapsedCore +
                 "'. collapseTimeline.tweenDuration: '" + plugin.globals.tweenDuration +
                 ". *");

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
    if ( plugin.globals.isRenderElementsImage ) {
      // make our container visible before we start filling it up.
      plugin.openSceneContainer( $el );
    }
    if ( plugin.globals.isRandomizeCollapsedCore ) {
      plugin.setAnimationBoundaries( $el );
    }

    var numElements = 0;
    var collapseTimeline = new TimelineMax(
            { repeat: 0, yoyo: false, repeatDelay: 0, delay: 0, paused: true,
              //onComplete: collapseTimelineCompleteCallback
              //onComplete: function( timeline ) {
              //  _this = window.trrPlugin;
              //  alert( "collapseTimeline animation is complete for '" + _this.activeStory.tag +
              //  "'. collapseTimelineIsReversed = '" + _this.activeStory.timelines.collapseTimelineIsReversed + "'. " );
              //}
            } );

    // Create element (svg <circle> in the particle's "expanded/home position".
    var results = null; // { element: circle, coreX: coreXY.coreX, coreY: coreXY.coreY };
    while ( (results = plugin.createCollapsedPositionSVGelement( $el )) ) {
      $elementsContainer.append( results.element );
      if ( plugin.globals.isCreateElementsObjArray ) {
        domElementsObjsArray.push( results.element );
      }

      // Create timeline of tweens that "collapse" the halftone image to a shrunken
      // core.
      collapseTimeline.insert(
        TweenMax.to(
          results.element, plugin.globals.tweenDuration,
          // NOTE: we don't want to do math calculations when creating DOM elements.
          //       So require that all adjustments were made when the particle
          //       map was created.
          // At this point the <circle> has a cx/cy of the particle's image 'home' position.
          { attr: { cx: results.coreX,
                    cy: results.coreY,
                  },
            autoAlpha: 0,
            ease: Power0.easeInOut, // will cause fade-out
          }
        ) // end TweenMax.to()
      ); // end collapseTimeline.insert()
      numElements += 1;
    }; // end while ( results )
    // Resume here when all elements created.
    $el.data( 'numElements', numElements );
    $el.data( '$elementsContainer', $elementsContainer );
    $el.data( 'collapseTimeline', collapseTimeline );
    var results = {
      animationElementsContainerElem: $elementsContainer,
      domElementsObjsArray: domElementsObjsArray,
      timelineProps: {
        sceneTag: $el.data( 'photoTag' ),
        gsapTimeline: collapseTimeline,
        isReversed: false,
      },
    };
    plugin.statusLog( " ..*5.2a: elements.js: createSvgElementsFromParticleMap(): Made " + $el.data( 'numElements' ) +
                 " " + plugin.globals.animationElementsType + " AnimationElements. *");

    if ( typeof callback == 'function' ) { callback( results ); return; }
    return results;
  }; // end createSvgElementsFromParticles()

  //----------------------------------------------------------------------------
  plugin.createCollapsedPositionSVGelement = function( $el ) {
    //----------------------------------------------------------------------------
    var results = null,
        particle = null;
    if ( (particle = plugin.getNextParticle( $el )) ) {
      // Create elements to start at their 'home position' which will recreate the
      // photo image.
      var circle = $( plugin.makeSvgElementNS( 'circle' ) )
          .attr( 'cx', particle.props.x )
          .attr( 'cy', particle.props.y )
          .attr( 'r', particle.props.r )
          .attr( 'fill', plugin.globals.animationElementColor );
      var coreXY = plugin.calcCoreXY( $el, particle );
      results = { element: circle, coreX: coreXY.coreX, coreY: coreXY.coreY };
    }
    return results;
  }; // end createCollapsedPositionSVGelement()

  //----------------------------------------------------------------------------
  plugin.calcCoreXY = function( $el, particle ) {
    //----------------------------------------------------------------------------
    var coreX = plugin.globals.collapsedCoreX,
        coreY = plugin.globals.collapsedCoreY;
    if ( plugin.globals.isRandomizeCollapsedCore ) {
      coreX = plugin.getRandom( plugin.globals.animationPanelLeftBoundaryX, plugin.globals.animationPanelRightBoundaryX );
      coreY = plugin.getRandom( plugin.globals.animationPanelTopBoundary, plugin.globals.animationPanelBottom );
    }
    return {
      coreX: coreX,
      coreY: coreY
    };
  }; // end calcCoreXY()
  //------------------------------------------------------------------------------
  plugin.makeSvgElementNS = function( tag ) {
    //----------------------------------------------------------------------------
    // per: http://chubao4ever.github.io/tech/2015/07/16/jquerys-append-not-working-with-svg-element.html
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }; // end makeSvgElementNS()

  //----------------------------------------------------------------------------
  plugin.setAnimationBoundaries = function( $el ) {
    //----------------------------------------------------------------------------
    // NOTE: options.sceneTag = scene id.
    var $sceneContainer = $el.data( '$sceneContainer' ),
        panel_bottom = $sceneContainer.height(),
        panel_width = $sceneContainer.width();
    // Set boundaries for "collapsed" view.
    plugin.globals.animationPanelTop = 0;
    plugin.globals.animationPanelTopBoundary = Math.round( panel_bottom * .45 );
    plugin.globals.animationPanelBottom = panel_bottom;
    plugin.globals.animationPanelWidth = panel_width;
    plugin.globals.animationPanelLeftBoundaryX = Math.round( panel_width * .45 );
    plugin.globals.animationPanelRightBoundaryX = Math.round( panel_width - plugin.globals.animationPanelLeftBoundaryX );
  }; // end setAnimationBoundaries()

  return plugin;
} ( jQuery, TrrPePlugin || {} ) );


    /*
1) create centerPanel?
  <article id="page-874" class="row-fluid post-874 page type-page status-publish hentry" style="opacity: 0.8;">

    <canvas id="trr-pe-animation-container-for-trr-pe-photo-0"
            class="trr-pe-animation-container-for-trr-pe-photo-0"
            style="display: block; width: 1127px; height: 692px; padding: 0px; margin: 0px;
            overflow: hidden; position: fixed; z-index: -1; top: 0px; left: 0px;" width="1127" height="692">
    </canvas>

    <canvas id="trr-pe-animation-container-for-trr-pe-photo-1"
            class="trr-pe-animation-container-for-trr-pe-photo-1" style="display: none; width: 1127px; height: 692px; padding: 0px; margin: 0px; overflow: hidden; position: fixed; z-index: -1; top: 0px; left: 0px;" width="1127" height="692"></canvas><canvas id="trr-pe-animation-container-for-trr-pe-photo-2" class="trr-pe-animation-container-for-trr-pe-photo-2" style="display: none; width: 1127px; height: 692px; padding: 0px; margin: 0px; overflow: hidden; position: fixed; z-index: -1; top: 0px; left: 0px;" width="1127" height="692">
    </canvas>

  </article>

  var animation_container_dom_id = 'trr-pe-animation-container-for-' + $el.attr('id');

  var $animation_container =
    jQuery( '<canvas  id="' + animation_container_dom_id + '" ' +
                      'class="' + animation_container_dom_id + '" ' +
                      'style="' +
                          'display: none; ' +
                          'width: 100%; ' + //44
                          'height: 100%; ' + //84
                          'padding: 0; ' +
                          'margin: 0; ' +
                          'overflow: hidden; ' +
                          'position: fixed; ' +
                          'z-index: -1; ' +
                          'top: 0; ' + // 15%;
                          'left: 0; ' + // 54%; ' +
                          //'border: 2px solid red;' +
                          '" ' +
            '></canvas>')
    .insertBefore( jQuery( '.entry-header' ) );

  $el.data('$animation_container', $animation_container );
  $el.data('animation_container_dom_id', animation_container_dom_id );

2) per photo: create antimationContainer
3)            create array of <circle> elements.
4)            create timeline.
     */
/*
$el.data( 'domIdAttr' )
.data( 'photoIndex' )
.data( 'photoTag' )
.data( 'previousProfile' )
.data( 'previousProfileTag' )
.data( 'nextProfile' )
.data( 'nextProfileTag')
*/
