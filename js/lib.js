"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  console.log( "  ..*0: lib.js: loaded. *" );

  //----------------------------------------------------------------------------
  plugin.libFunc = function() {
    //--------------------------------------------------------------------------
    console.log( "  ..*0.1: lib.js: plugin.libFunc() *" );

  }; // end: libFunc()

  return plugin;
} ( jQuery, TrrPePlugin || {} ) );
