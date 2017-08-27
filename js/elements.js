"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  console.log( "  ..*5: elements.js: loaded. *" );

  //----------------------------------------------------------------------------
  plugin.generateAnimationElements = function( callback ) {
    //--------------------------------------------------------------------------
    console.log( "  ..*5.1: init.js: plugin.generateAnimationElements() For " + plugin.globals.photos.length + " photos.*" );

    var last_photo = plugin.globals.photos.length - 1;
    $.each( plugin.globals.photos, function( index, el ) {
      var $el = $(el);
      plugin.statusLog( "  ..*5.1a: init.js: plugin.generateAnimationElements() id: '" + $el.data( 'domIdAttr' ) +
                        "'. PhotoTag: '" + $el.data( 'photoTag' ) + "'. *" );

      if ( index == last_photo ) {
        plugin.statusLog( "  ..*5.1b: init.js: plugin.generateAnimationElements() END *" );
        if ( typeof callback == 'function' ) { callback( null ); return; }
        return null;
      }
    }); // end of $.each(photos)
  }; // end: generateAnimationElements()

  return plugin;
} ( jQuery, TrrPePlugin || {} ) );
