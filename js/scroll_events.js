"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  if(plugin.globals.logging){plugin.statusLog( "  ..*7: scroll_events.js: loaded. *" );}

  //----------------------------------------------------------------------------
  plugin.scrollTo = function( event ) {
    //--------------------------------------------------------------------------
    // event.scrollDirection:
    //    PAUSED:
    // event.state:
    //    DURING  - scroll down
    //    BEFORE  - scroll up
    var $scrolledToProfile = $( event.currentTarget.triggerElement() ); // i.e. the <img> tag.
    if(plugin.globals.logging){plugin.statusLog( "  ..*7a.2: scroll_events.js ScrollMagic event: '" +
                      event.scrollDirection + ": " + event.state +
                      "'. toPhotoTag: '" + $scrolledToProfile.data( 'photoTag' ) +
                      "'. previousProfile.photoTag: '" + ($scrolledToProfile.data( 'previousProfileTag' ) || '*none*') +
                      "'. nextProfileTag: '" + ($scrolledToProfile.data( 'nextProfileTag' ) || '*none*') +
                      "'. StartImageCollapsed: '" + plugin.globals.isStartImageCollapsed +
                      "'. *" );}

    // showing laura. scroll down to gary. Scroll event is for gary (me), laura is previous.
    if ( event.state == 'DURING' ) {
      // 'moving_up_into_view'
      plugin.disappear( $scrolledToProfile.data( '$previousProfile' ),
      /*1-Resume here when done*/ function() {
      plugin.appear( $scrolledToProfile,
      /*1a-Resume here when done*/ function() {
      return;
      /*1a-*/});/*1-*/});
    } else { // event.state == 'BEFORE' which means 'moving_down_out_of_view'
      plugin.disappear( $scrolledToProfile,
      /*2-Resume here when done*/ function() {
      plugin.appear( $scrolledToProfile.data( '$previousProfile' ),
      /*2a-Resume here when done*/ function() {
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
