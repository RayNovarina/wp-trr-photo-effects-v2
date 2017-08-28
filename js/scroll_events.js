"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  console.log( "  ..*1a: scroll_events.js: loaded. *" );

  //----------------------------------------------------------------------------
  plugin.add_scroll_event = function( $el, callback ) {
    //--------------------------------------------------------------------------
    plugin.statusLog( "  ..*1a: scroll_events.js add_scroll_event() for photo: '" + $el.data( 'photoTag' ) + ":" + $el.attr( 'id' ) + "'. *" );
    var img_position = $el.position(),
        img_height = $el.height(),
        triggerElement_offset_y = img_height * 2,
        triggerElement_selector = "#" + $el.attr( 'id' );
        $el.data( 'delayMsToWaitForPartialCollapsedState', plugin.globals.tweenDuration * 950 ); // 95% of 2 seconds.
        $el.data( 'delayMsToWaitForPartialExpandedState', plugin.globals.tweenDuration * 200 ); // 20% of 2 seconds.

    plugin.statusLog( "  ..*1a: scroll_events.js add_scroll_event() photo.position.top: '" + img_position.top +
                      "'.  photo.height: '" + img_height +
                      "'.  triggerElement_selector: '" + triggerElement_selector +
                      "'.  triggerElement_offset_y: '" + triggerElement_offset_y +
                      "'.  delayMsToWaitForPartialCollapsedState: '" + $el.data( 'delayMsToWaitForPartialCollapsedState' ) +
                      "'.  delayMsToWaitForPartialExpandedState: '" + $el.data( 'delayMsToWaitForPartialExpandedState' ) +
                      "'. *" );

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
        // event.scrollDirection:
        //    PAUSED:
        // event.state:
        //    DURING  - scroll down
        //    BEFORE  - scroll up
        var $scrolledToProfile = $( event.currentTarget.triggerElement() ); // i.e. the <img> tag.
        plugin.statusLog( "  ..*7: scroll_events.js ScrollMagic event: '" +
                          event.scrollDirection + ": " + event.state +
                          "'. toPhotoTag: '" + $scrolledToProfile.data( 'photoTag' ) +
                          "'. previousProfile.photoTag: '" + ($scrolledToProfile.data( 'previousProfileTag' ) || '*none*') +
                          "'. nextProfileTag: '" + ($scrolledToProfile.data( 'nextProfileTag' ) || '*none*') +
                          "'. *" );

        // showing laura. scroll down to gary. Scroll event is for gary (me), laura is previous.
        if ( event.state == 'DURING' ) {
          // 'moving_up_into_view'
          disappear( $scrolledToProfile.data( '$previousProfile' ),
          /*1-Resume here when done*/ function() {
          appear( $scrolledToProfile,
          /*1a-Resume here when done*/ function() {
          return;
          /*1a-*/});/*1-*/});
        } else { // event.state == 'BEFORE' which means 'moving_down_out_of_view'
          disappear( $scrolledToProfile,
          /*2-Resume here when done*/ function() {
          appear( $scrolledToProfile.data( '$previousProfile' ),
          /*2a-Resume here when done*/ function() {
          return;
          /*2a-*/});/*2-*/});
        }
    })
    .addTo( plugin.globals.scrollMagic_controller ); // assign the scene to the controller

    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  };// end: add_scroll_event()

  //----------------------------------------------------------------------------
  function appear( $profile, callback ) {
    //--------------------------------------------------------------------------
    if ( !$profile || !$profile.data ||
         !$profile.data( 'collapseTimeline' ) ) {
      plugin.statusLog( "  ..*8a: scroll_events.js appear() no profile or profile.collapseTimeline. IGNORED *");
      if ( typeof callback == 'function' ) { callback( null ); return; }
      return null;
    }

    plugin.statusLog( "  ..*8a.1: scroll_events.js appear() For photoTag: '" + $profile.data( 'photoTag' ) +
                      "'. REVERSING profile.collapseTimeline. *");
    $profile.data( 'collapseTimeline' ).reverse();
    //$profile.data( 'collapseTimelineIsReversed', true );

    plugin.statusLog( " ..*8a.2: scroll_events.js appear() Waiting '" + $profile.data( 'delayMsToWaitForPartialExpandedState' ) + "'ms for Halftone image for '" + $profile.data( 'photoTag' ) + "' to PARTIALLY expand. *" );
    setTimeout(function() {
    /*1a-Resume here when WaitForPartialExpandedState Timeout done*/
    plugin.statusLog( " ..*8a.3: scroll_events.js appear() Halftone image for '" + $profile.data( 'photoTag' ) + "' IS NOW PARTIALLY expanded. *" );
    //plugin.openSceneContainer( $profile );
    $profile.data( '$sceneContainer' ).css( 'display', 'block' );
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
    }, $profile.data( 'delayMsToWaitForPartialExpandedState' )); // end /*1a-timeout*/
  }; // end: appear()

  //----------------------------------------------------------------------------
  function disappear( $profile, callback ) {
    //--------------------------------------------------------------------------
    if ( !$profile || !$profile.data ||
         !$profile.data( 'collapseTimeline' ) ) {
      plugin.statusLog( "  ..*8b: scroll_events.js disappear() no profile or profile.collapseTimeline. IGNORED *");
      if ( typeof callback == 'function' ) { callback( null ); return; }
      return null;
    }
    plugin.statusLog( "  ..*8b.1: scroll_events.js disappear() Halftone image for '" + $profile.data( 'photoTag' ) + "' IS NOW expanded. Start collapsing it. *" );

    $profile.data( 'collapseTimeline' ).play();
    //$profile.data( 'collapseTimelineIsReversed', false );

    plugin.statusLog( " ..*8b.2: scroll_events.js disappear() Waiting '" + $profile.data( 'delayMsToWaitForPartialCollapsedState' ) + "'ms for Halftone image for '" + $profile.data( 'photoTag' ) + "' to PARTIALLY collapse. *" );
    setTimeout(function() {
    /*1a-Resume here when WaitForPartialCollapsedState Timeout done*/
    plugin.statusLog( " ..*8b.3: scroll_events.js disappear() Halftone image for '" + $profile.data( 'photoTag' ) + "' IS NOW PARTIALLY collapsed. *" );
    //plugin.closeSceneContainer( $profile );
    $profile.data( '$sceneContainer' ).css( 'display', 'none' );
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }, $profile.data( 'delayMsToWaitForPartialCollapsedState' )); // end /*1a-timeout*/
  }; // end: disappear()

  return plugin;
} ( jQuery, TrrPePlugin || {} ) );
