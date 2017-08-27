"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  console.log( "  ..*1a: elements.js: loaded. *" );
  plugin.generateAnimationElements = function( callback ) {
    console.log( "  ..*1a: elements.js: plugin.generateAnimationElements() *" );

    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }; // end: generateAnimationElements()

  return plugin;
} ( jQuery, TrrPePlugin || {} ) );
