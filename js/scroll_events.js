"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  console.log( "  ..*1a: scroll_events.js: loaded. *" );
  plugin.addScrollEvents = function( callback ) {
    console.log( "  ..*1a: scroll_events.js: plugin.addScrollEvents() *" );

    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }; // end: addScrollEvents()

  return plugin;
} ( jQuery, TrrPePlugin || {} ) );
