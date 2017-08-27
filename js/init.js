"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  console.log( "  ..*1a: init.js: loaded. *" );
  //alert( 'init.js: from TrrPePlugin init.js' );
  plugin.init = function( callback ) {
    console.log( "  ..*1a: init.js: plugin.init() *" );
    // $:
    if (typeof jQuery !== 'undefined') {
      // jQuery is loaded
      console.debug( "jQuery "+ jQuery.fn.jquery +" loaded" );
    } //else {
    //  console.debug("$ NOT loaded");
    //}

    // ScrollMagic:
    if (typeof ScrollMagic !== 'undefined') {
      console.log( "ScrollMagic v%s loaded", ScrollMagic.version );
      plugin.scrollMagic_controller = new ScrollMagic.Controller();
    } //else {
    //  console.debug("ScrollMagic NOT loaded");
    //}

    // TweenMax:
    if (typeof TweenMax !== 'undefined') {
      console.log( "TweenMax v%s loaded", TweenMax.version );
    } //else {
    //  console.debug("TweenMax NOT loaded");
    //}

    // ScrollToPlugin:
    //if (typeof ScrollToPlugin !== 'undefined') {
    //  console.log("ScrollToPlugin v%s loaded", ScrollToPlugin.version);
    //} //else {
    //  console.debug("ScrollToPlugin NOT loaded");
    //}

    plugin.globals.window_location_origin = window.location.origin,
    plugin.globals.window_width           = window.innerWidth,
    plugin.globals.window_height          = window.innerHeight;

    var classes = $( 'body' ).attr( 'class' );
    var page_num_begin = classes.indexOf( 'page-id-' );
    plugin.globals.wp_page_id = classes.slice( (page_num_begin + 'page-id-'.length), (page_num_begin + classes.slice(page_num_begin).indexOf(' ')) );
    plugin.globals.fixups_target_page_class_ref = '.page-id-' + plugin.globals.wp_page_id; // '.page-id-874',

    var target_page_class_ref = plugin.globals.fixups_target_page_class_ref, // i.e. '.page-id-874'
        plugin_class_ref = plugin.globals.photo_effect_class_ref; // i.e. '.trr-photo-effect'
    plugin.globals.target_page_references = $( target_page_class_ref );
    plugin.globals.plugin_references = $( plugin_class_ref );

    plugin.statusLog( "  ..*1a: init.js: plugin.init(): host domain '" +
                      plugin.globals.window_location_origin + "' " +
                      "  fixups_target_page_class_ref '" + target_page_class_ref +
                      "'. References to target_page_id = " + plugin.globals.target_page_references.length +
                      ". plugin class ref '" + plugin_class_ref +
                      "'. References to plugin class = " + plugin.globals.plugin_references.length + "*");

    if ( plugin.globals.target_page_references.length == 0 ||
         plugin.globals.plugin_references.length == 0 ) {
      plugin.statusLog( "  ..*1a: init.js: plugin.init(): Plugin not enabled for this page. WP page class or plugin references NOT FOUND. Nothing to do.'*");
      plugin.globals.status.enabled = false;
      if ( typeof callback == 'function' ) { callback( null ); return; }
      return null;
    }
    // We are wanted.
    plugin.globals.status.enabled = true;
    plugin.globals.photos = $( plugin.globals.photo_effect_class_ref ).toArray();

    // Determine which extensions are enabled.
    var effect_class_ref = plugin.globals.photo_effect_class_ref + plugin.globals.dots_effect.photo_effect_class_ref;
    plugin.globals.dots_effect.photos = $( effect_class_ref );
    if ( plugin.globals.dots_effect.photos.length == 0 ) {
      plugin.statusLog( "  ..*1a: init.js: plugin.init(): dots photo effect not enabled for this page. " + effect_class_ref + " references NOT FOUND. Nothing to do.'*");
      plugin.globals.dots_effect.enabled = false;
    } else {
      plugin.globals.dots_effect.enabled = true;
      plugin.statusLog( "  ..*1a: init.js: plugin.init(): dots photo effect enabled for this page. effect class ref '" + effect_class_ref +
                         "'. References to dots photo effect = " + plugin.globals.dots_effect.photos.length +
                         " *");
    }

    //----------------------------------------------------------------------------
    // NOTE: code goes where? I guess we need a short code to indicate begin of bio area?
    // Make the background of the bio text transparent so that we can scoll over the canvas animation.
    // NOTE: also assumes WP template Custom CSS changes? if so, put this override there?
    $( 'article' ).css( 'opacity', '0.8' );

    window.scrollTo(0,0);

    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }; // end: init()

  plugin.attachToProfiles = function( callback ) {
    console.log( "  ..*1a: init.js: plugin.attachToProfiles()*" );
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }; // end: attachToProfiles()

  return plugin;
} ( jQuery, TrrPePlugin || {} ) );


/*
function add_scroll_event( options ) {
  plugin.statusLog( "  ..*4m: add_scroll_event() for photoTag: " + options.photoTag + ".*" );

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
      triggerElement: options.triggerElement_selector, // point of execution
      triggerHook: 'onEnter', // on enter from the bottom.
      offset: options.triggerElement_offset_y
  })
  .on('start', function (event) {
      // event.scrollDirection:
      //    PAUSED:
      // event.state:
      //    DURING  - scroll down
      //    BEFORE  - scroll up
      console.log( 'event: ' + event.scrollDirection + ': ' + event.state );
      // showing laura. scroll down to gary. Scroll event is for gary (me), laura is previous.
      var $scrolledToProfile = $(event.currentTarget);
      if ( event.state == 'DURING' ) {
        // 'moving_up_into_view'
        disappear( $scrolledToProfile.$previousProfile );
        appear( $scrolledToProfile );
      } else { // event.state == 'BEFORE' which means 'moving_down_out_of_view'
        disappear( $scrolledToProfile );
        appear( $scrolledToProfile.$previousProfile );
      }
  })
  .addTo(plugin.globals.scrollMagic_controller); // assign the scene to the controller
};

function appear( $profile ) {
  $profile.collapseTimeline.reverse();
};

function disappear( $profile ) {
  $profile.collapseTimeline.play();
};
*/
