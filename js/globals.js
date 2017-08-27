"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  console.log( "  ..*1a: globals.js: loaded. *" );
  plugin.createGlobals = function( callback ) {
    console.log( "  ..*1a: globals.js: plugin.createGlobals() *" );

    plugin.statusLog = function( msg ) {
      //console.log( "  ..*1a: init.js: plugin.statusLog()*" );
      if ( msg == 'init-done') {
        console.log(' ');
        console.log('******************************************');
        console.log('************* INIT DONE ******************');
        console.log('******************************************');
        return;

      } else if (msg.indexOf('..*8:') != -1) {
        console.log(' ');
        console.log('******************************************');
        console.log('********* Start CLICK Event **************');
        console.log('******************************************');

      } else if (msg.indexOf('..*7:') != -1) {
        console.log(' ');
        console.log('******************************************');
        console.log('******** Start SCROLL Event **************');
        console.log('******************************************');
      }
      console.log(msg);
    }; // end: statusLog()

    plugin.globals = {
      status: {
        enabled: false,
      },
      photo_effect_class: 'trr-photo-effect',
      photo_effect_class_ref: '.trr-photo-effect',
      photo_effect_elem_def: '<img class="trr-photo-effect trr-pe-canvas-dots trr-pe-pixellate title="photo_ur"/>',

      window_location_origin: '',
      window_width: '',
      window_height: '',
      fixups_target_page_num: '',
      fixups_target_page_class_ref: '', // '.page-id-874',

      dots_effect: {
        loaded: true,
        enabled: false,
        photo_effect_class: 'trr-pe-canvas-dots',
        photo_effect_class_ref: '.trr-pe-canvas-dots',
        photo_effect_elem_def: '<img class="trr-photo-effect trr-pe-canvas-dots title="photo_ur"/>',
      },
    };
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }; // end: createGlobals()

  return plugin;
} ( jQuery, TrrPePlugin || {} ) );
