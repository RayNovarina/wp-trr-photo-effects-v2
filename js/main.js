"use strict";

jQuery( document ).ready(function() {
  console.log( "  ..*1.main.js: documentReady() *" );

  TrrPePlugin = ( function( $, plugin ) {
    console.log( "  ..*1a.main.js: anonFunction() going to call plugin.createGlobals() *" );
    plugin.createGlobals(
    /*1-Resume here when done*/ function( returnObj ) {
    plugin.init(
    /*2-Resume here when done*/ function( returnObj ) {
    if ( !plugin.globals.status.enabled ) {
      console.log( "  ..*1a.main.js: anonFunction() globals.status NOT enabled, terminating. *" );
      return;
    }
    plugin.pageFixups(
    /*3-Resume here when done*/ function( returnObj ) {
    plugin.attachToProfiles(
    /*4-Resume here when done*/ function( returnObj ) {
    plugin.generateAnimationElements(
    /*5-Resume here when done*/ function( returnObj ) {
    plugin.addScrollEvents(
    /*6-Resume here when done*/ function( returnObj ) {
    plugin.statusLog( "  ..*1c.main.js: Init done *" );
    /*6-*/});/*5-*/});/*4-*/});/*3-*/});/*2-*/});/*1-*/});

    return plugin;
  } ( jQuery, TrrPePlugin || {} ) );
});
