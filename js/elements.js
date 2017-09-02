"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  if(plugin.globals.logging){plugin.statusLog( "  ..*5: elements.js: loaded. *" );}

  //----------------------------------------------------------------------------
  plugin.generateAnimationElements = function( callback ) {
    //--------------------------------------------------------------------------
    plugin.globals.nextParticleMethod = 'nextParticleFromHashArray';

    plugin.globals.isShowElementsImage = false;
    plugin.globals.isStartImageCollapsed = true;
    plugin.globals.isStartImageExpanded = false;
    plugin.globals.createPositionedElementMethod = plugin.globals.isStartImageCollapsed
        ? 'createCollapsedPositionSVGelement' : 'createExpandedPositionSVGelement';
    plugin.globals.elementTweenMethod = plugin.globals.isStartImageCollapsed
        ? 'tweenCollapsedPositionSVGelement' : 'tweenExpandedPositionSVGelement';
    plugin.globals.isElementVisible = false;
    plugin.globals.isRandomizeCollapsedCore = true;
    plugin.globals.tweenDuration = 3;
    plugin.globals.isCreateElementsObjArray = false;
    plugin.globals.animationContainerBackgroundColor = '#E7F1F7'; // Climate Corp "halftone background blue"
    plugin.globals.animationContainerOffsetX = '51%';

    plugin.globals.animationContainerOffsetY = '2%';
    plugin.globals.animationElementsType = 'SvgCircle';
    plugin.globals.animationElementColor = '#0099cc';
    plugin.globals.collapsedCoreX = 100;
    plugin.globals.collapsedCoreY = 100;

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
    if ( plugin.globals.isShowElementsImage ) {
      // make our container visible before we start filling it up.
      plugin.openSceneContainer( $el );
    }
    if ( plugin.globals.isRandomizeCollapsedCore ) {
      plugin.setAnimationBoundaries( $el );
    }

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
  plugin.tweenCollapsedPositionSVGelement = function( timelineMax, results ) {
    //--------------------------------------------------------------------------
    // NOTE: particles(xy) image is currently Collapsed,
    //       we move em to a expanded/home position.
    // ---------------------------------------------------
    return TweenMax.to(
      results.element, plugin.globals.tweenDuration,
      // At this point the <circle> has a cx/cy of the particle's image
      // 'collapsed' position.  So we move em to a expanded/home position.
      { attr: { cx: results.homeX,
                cy: results.homeY,
                opacity: 1,
              },
              // autoAlpha - the same thing as "opacity" except that when the
              // value hits "0", the "visibility" property will be set to "hidden",
              // i.e. fade.
              //autoAlpha: 0,
              ease: Power2.easeOut,
      }
    ); // end TweenMax.to()
  }; // end tweenCollapsedPositionSVGelement()

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
  plugin.createCollapsedPositionSVGelement = function( particle, coreX, coreY ) {
    //--------------------------------------------------------------------------
    // Create elements to start at their 'home position' which will recreate the
    // photo image.
    return $( plugin.makeSvgElementNS( 'circle' ) )
        .attr( 'cx', coreX )
        .attr( 'cy', coreY )
        .attr( 'r', particle.props.r )
        .attr( 'fill', plugin.globals.animationElementColor );
  }; // end createCollapsedPositionSVGelement()

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
  plugin.calcCoreX = function() {
    //--------------------------------------------------------------------------
    if ( plugin.globals.isRandomizeCollapsedCore ) {
      return plugin.getRandom( plugin.globals.animationPanelLeftBoundaryX, plugin.globals.animationPanelRightBoundaryX );
    }
    return plugin.globals.collapsedCoreX;
  }; // end calcCoreX()

  //----------------------------------------------------------------------------
  plugin.calcCoreY = function() {
    //--------------------------------------------------------------------------
    if ( plugin.globals.isRandomizeCollapsedCore ) {
      return plugin.getRandom( plugin.globals.animationPanelTopBoundary, plugin.globals.animationPanelBottomBoundary );
    }
    return plugin.globals.collapsedCoreY;
  }; // end calcCoreY()

  //----------------------------------------------------------------------------
  plugin.makeSvgElementNS = function( tag ) {
    //--------------------------------------------------------------------------
    // per: http://chubao4ever.github.io/tech/2015/07/16/jquerys-append-not-working-with-svg-element.html
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  }; // end makeSvgElementNS()

  //----------------------------------------------------------------------------
  plugin.setAnimationBoundaries = function( $el ) {
    //--------------------------------------------------------------------------
    var $container = plugin.globals.$animationContainer,
        container_bottom = $container.height(),
        container_width = $container.width(),
        container_half_width = container_width / 2;
    // Set boundaries for "collapsed" view.
    plugin.globals.animationPanelTop = 0;
    plugin.globals.animationPanelTopBoundary = Math.round( container_bottom * .25 );
    plugin.globals.animationPanelBottomBoundary = container_bottom - 80;
    plugin.globals.animationPanelWidth = container_width;
    plugin.globals.animationPanelLeftBoundaryX = Math.round( container_half_width * .42 );
    plugin.globals.animationPanelRightBoundaryX = Math.round( container_half_width - plugin.globals.animationPanelLeftBoundaryX );
  }; // end setAnimationBoundaries()

  //----------------------------------------------------------------------------
  plugin.add_scroll_event = function( $el, callback ) {
    //--------------------------------------------------------------------------
    if(plugin.globals.logging){plugin.statusLog( "  ..*7a: scroll_events.js add_scroll_event() for photo: '" + $el.data( 'photoTag' ) + ":" + $el.attr( 'id' ) + "'. *" );}
    var img_position = $el.position(),
        img_height = $el.height(),
        triggerElement_offset_y = img_height * 2,
        triggerElement_selector = "#" + $el.attr( 'id' );
    $el.data( 'delayMsToWaitForPartialCollapsedState', plugin.globals.tweenDuration * 950 ); // 95% of 2 seconds.
    $el.data( 'delayMsToWaitForPartialExpandedState', plugin.globals.tweenDuration * 200 ); // 20% of 2 seconds.
    // if startExpanded appearMethod = 'playTimelineBackwards'
    $el.data( 'appearMethod', plugin.globals.isStartImageExpanded ? 'playTimelineBackwards' : 'playTimelineForwards' );
    // if startExpanded appearMethod = 'playTimelineForwards'
    $el.data( 'disappearMethod', plugin.globals.isStartImageExpanded ? 'playTimelineForwards' : 'playTimelineBackwards' );

    if(plugin.globals.logging){plugin.statusLog( "  ..*7a.1: scroll_events.js add_scroll_event() photo.position.top: '" + img_position.top +
                      "'.  photo.height: '" + img_height +
                      "'.  triggerElement_selector: '" + triggerElement_selector +
                      "'.  triggerElement_offset_y: '" + triggerElement_offset_y +
                      "'.  elementTweenMethod: '" + plugin.globals.elementTweenMethod +
                      "'.  appearMethod: '" + $el.data( 'appearMethod' ) +
                      "'.  disappearMethod: '" + $el.data( 'disappearMethod' ) +
                      "'.  delayMsToWaitForPartialExpandedState: '" + $el.data( 'delayMsToWaitForPartialExpandedState' ) +
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
