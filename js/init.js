"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  console.log( "  ..*3: init.js: loaded. *" );
  //alert( 'init.js: from TrrPePlugin init.js' );

  //----------------------------------------------------------------------------
  plugin.init = function( callback ) {
    //--------------------------------------------------------------------------
    console.log( "  ..*3: init.js: plugin.init() *" );
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
      plugin.globals.scrollMagic_controller = new ScrollMagic.Controller();
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

    plugin.statusLog( "  ..*3a: init.js: plugin.init(): host domain '" +
                      plugin.globals.window_location_origin + "' " +
                      "  fixups_target_page_class_ref '" + target_page_class_ref +
                      "'. References to target_page_id = " + plugin.globals.target_page_references.length +
                      ". plugin class ref '" + plugin_class_ref +
                      "'. References to plugin class = " + plugin.globals.plugin_references.length + "*");

    if ( plugin.globals.target_page_references.length == 0 ||
         plugin.globals.plugin_references.length == 0 ) {
      plugin.statusLog( "  ..*3a.2: init.js: plugin.init(): Plugin not enabled for this page. WP page class or plugin references NOT FOUND. Nothing to do.'*");
      plugin.globals.status.enabled = false;
      if ( typeof callback == 'function' ) { callback( null ); return; }
      return null;
    }
    // We are wanted.
    plugin.globals.status.enabled = true;
    plugin.globals.photos = $( plugin.globals.photo_effect_class_ref ).toArray();
    // HACK:
    plugin.globals.photoTags = [ "laura", "chris", "gary", "curt" ];

    // Determine which extensions are enabled.
    var effect_class_ref = plugin.globals.photo_effect_class_ref + plugin.globals.dots_effect.photo_effect_class_ref;
    plugin.globals.dots_effect.photos = $( effect_class_ref );
    if ( plugin.globals.dots_effect.photos.length == 0 ) {
      plugin.statusLog( "  ..*3a.3: init.js: plugin.init(): dots photo effect not enabled for this page. " + effect_class_ref + " references NOT FOUND. Nothing to do.'*");
      plugin.globals.dots_effect.enabled = false;
    } else {
      plugin.globals.dots_effect.enabled = true;
      plugin.statusLog( "  ..*3a.4: init.js: plugin.init(): dots photo effect enabled for this page. effect class ref '" + effect_class_ref +
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

  //----------------------------------------------------------------------------
  plugin.attachToProfiles = function( callback ) {
    //----------------------------------------------------------------------------
    console.log( "  ..*3b: init.js: plugin.attachToProfiles() For " + plugin.globals.photos.length + " photos.*" );

    var last_photo = plugin.globals.photos.length - 1;
    $.each( plugin.globals.photos, function( index, el ) {
      var $el = $(el),
          photoTag = plugin.globals.photoTags[ index ],
          domIdAttr = 'trr-pe-photo-' + (index + '');
      $el.attr( 'id', domIdAttr )
         .attr( 'trr-pe-photo-idx', index + '' )
         .attr( 'trr-pe-tag', photoTag )
         .data( 'domIdAttr', domIdAttr )
         .data( 'photoIndex', index )
         .data( 'photoTag', photoTag )
         .data( 'previousProfile', ( index == 0 ? undefined : plugin.globals.photos[ index - 1 ] ) )
         .data( 'previousProfileTag', ( index == 0 ? undefined : plugin.globals.photoTags[ index - 1 ] ) )
         .data( 'nextProfile', ( index == last_photo ? undefined : plugin.globals.photos[ index + 1 ] ) )
         .data( 'nextProfileTag', ( index == last_photo ? undefined : plugin.globals.photoTags[ index + 1 ] ) );
      plugin.statusLog( "  ..*3b.2: init.js: plugin.attachToProfiles() id: '" + $el.data( 'domIdAttr' ) +
                        "'. PhotoTag: '" + photoTag +
                        "'. previousProfileTag: '" + ($el.data( 'previousProfile' ) ? plugin.globals.photoTags[ index - 1 ] : '*none*') +
                        "'. nextProfileTag: '" + ($el.data( 'nextProfile' ) ? plugin.globals.photoTags[ index + 1 ] : '*none*') +
                        "'. *" );
      plugin.add_scroll_event( index, $el, photoTag,
      /*3a-Resume here when done*/ function() {
      if ( index == last_photo ) {
        plugin.statusLog( "  ..*3b.3: init.js: plugin.attachToProfiles() END *" );
        if ( typeof callback == 'function' ) { callback( null ); return; }
        return null;
      }
      /*3a-*/});
    }); // end of $.each(photos)
  }; // end: attachToProfiles()

  return plugin;
} ( jQuery, TrrPePlugin || {} ) );
