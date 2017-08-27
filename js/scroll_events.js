"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  console.log( "  ..*1a: scroll_events.js: loaded. *" );

  //----------------------------------------------------------------------------
  plugin.add_scroll_event = function( index, $el, photoTag, callback ) {
    //--------------------------------------------------------------------------
    plugin.statusLog( "  ..*1a: scroll_events.js add_scroll_event() for photo: '" + photoTag + ":" + $el.attr( 'id' ) + "'. *" );
    var img_position = $el.position(),
        img_height = $el.height(),
        triggerElement_offset_y = img_height * 2,
        triggerElement_selector = "#" + $el.attr( 'id' );

    plugin.statusLog( "  ..*1a: scroll_events.js add_scroll_event() photo_idx: " + index +
                      " photo.position.top: '" + img_position.top + "' photo.height: '" + img_height +
                      "'.  triggerElement_selector: '" + triggerElement_selector +
                      "'.  triggerElement_offset_y: '" + triggerElement_offset_y + "'. *" );

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
        var scrolledToProfile = event.currentTarget.triggerElement(), // i.e. the <img> tag.
            $scrolledToProfile = $( scrolledToProfile );
        plugin.statusLog( "  ..*7: scroll_events.js ScrollMagic event: '" +
                          event.scrollDirection + ": " + event.state +
                          "'. toPhotoTag: '" + $scrolledToProfile.data( 'photoTag' ) +
                          "'. previousProfile.photoTag: '" + ($scrolledToProfile.data( 'previousProfileTag' ) || '*none*') +
                          "'. nextProfileTag: '" + ($scrolledToProfile.data( 'nextProfileTag' ) || '*none*') +
                          "'. *" );

        // showing laura. scroll down to gary. Scroll event is for gary (me), laura is previous.
        if ( event.state == 'DURING' ) {
          // 'moving_up_into_view'
          disappear( $scrolledToProfile.data( 'previousProfile' ) );
          appear( scrolledToProfile );
        } else { // event.state == 'BEFORE' which means 'moving_down_out_of_view'
          disappear( scrolledToProfile );
          appear( $scrolledToProfile.data( 'previousProfile' ) );
        }
    })
    .addTo( plugin.globals.scrollMagic_controller ); // assign the scene to the controller
  };// end: add_scroll_event()

  //----------------------------------------------------------------------------
  function appear( profile ) {
    //--------------------------------------------------------------------------
    if ( !profile ||
         !$(profile).data( 'collapseTimeline' ) ) {
      plugin.statusLog( "  ..*8a: scroll_events.js appear() no profile or profile.collapseTimeline. IGNORED *");
      return;
    }
    plugin.statusLog( "  ..*8a.1: scroll_events.js appear() For photoTag: '" + $(profile).data( 'photoTag' ) +
                      "'. REVERSING profile.collapseTimeline. *");
    $(profile).data( 'collapseTimeline' ).reverse();
    $(profile).data( 'collapseTimelineIsReversed', false );
  }; // end: appear()

  //----------------------------------------------------------------------------
  function disappear( profile ) {
    //--------------------------------------------------------------------------
    if ( !profile ||
         !$(profile).data( 'collapseTimeline' ) ) {
      plugin.statusLog( "  ..*8b: scroll_events.js disappear() no profile or profile.collapseTimeline. IGNORED *");
      return;
    }
    plugin.statusLog( "  ..*8b.1: scroll_events.js disappear() For photoTag: '" + $(profile).data( 'photoTag' ) +
                      "'. PLAYING profile.collapseTimeline. *");
    $(profile).data( 'collapseTimeline' ).play();
    $(profile).data( 'collapseTimelineIsReversed', true );
  }; // end: disappear()

  return plugin;
} ( jQuery, TrrPePlugin || {} ) );
