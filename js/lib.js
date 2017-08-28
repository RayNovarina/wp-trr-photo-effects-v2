"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  console.log( "  ..*9: lib.js: loaded. *" );

  //----------------------------------------------------------------------------
  plugin.createSceneContainer = function( $el ) {
    //----------------------------------------------------------------------------
    // We will use the Wordpress theme's <body><div id='content'><article>
    // Dom element. It is the width of the WP content "body" where the profile
    // text and photos are. So we make a <div> after '.entry-header' and before
    // the page's '.entry-content'.
    $el.data( 'sceneContainer',
      $( '<div/>' )
        .attr( 'id', 'trr_scene_Container_' + $el.data( 'photoTag' ) )
        .css( 'width', 'inherit' )
        .css( 'height', 'inherit' )
        .css( 'padding', '0' )
        .css( 'margin', '0' )
        .css( 'position', 'absolute' )
        .css( 'top', '0' )
        .css( 'left', '0' )
      .insertBefore( $( '.entry-header' ) )
    );
    var $sceneContainer = $( $el.data( 'sceneContainer' ) );
    plugin.statusLog( " ..*9.2: lib.js: plugin.createSceneContainer() <div> NOW: id: '" + $sceneContainer.attr( 'id' ) +
                 "'.  width: '" + $sceneContainer.css( 'width' ) +
                 "'.  height: '" + $sceneContainer.css( 'height' ) +
                 "'. Offset left: '" + $sceneContainer.css( 'left' ) +
                 "'. top: '" + $sceneContainer.css( 'top' ) + "'. *");
  }; // end: createSceneContainer()

  //----------------------------------------------------------------------------
  plugin.getParticlesFromDataFile = function( $el, callback ) {
    //----------------------------------------------------------------------------
    plugin.statusLog( " ..*9.3: lib.js: plugin.getParticlesFromDataFile() for '" + $el.data( 'photoTag' ) +
                      "'. From data file: '" + $el.data( 'photoTag' ) + '_particles_data' + "'. *");

    // NOTE: .js file contains a string that was evaluated by javascript when the
    // file loaded. Example:
    //    var laura_particles_data='{"tag":"laura","type":"HashArray","data":[{"x":22,"y":580,"r":2.8062433825913184}]}';

    var particles_data_file_var = window[ $el.data( 'photoTag' ) + '_particles_data' ];

    // NOTE: particles_data_file_var NOW = JSON String as follows:
    // {"tag":"laura","type": "HashArray","data":[{"x":22,"y":580,"r":2.8062433825913184}]}
    particles_data_file_var = JSON.parse( particles_data_file_var );
    // NOTE: particles_data_file_contents NOW = hash object as follows:
    // { tag:  "laura",
    //   type: "HashArray",
    //   data: "[ {x:22,y:580,r:2.8062433825913184} ]"
    // }
    // NOTE: particles_data_file_contents.data = javascript object of type array of hashes.

    plugin.createParticlesInfoFromDataTypeHashArray( $el, particles_data_file_var,
    /*1-Resume here when done*/ function( particlesInfo ) {
    if ( typeof callback == 'function' ) { callback( particlesInfo ); return; }
    return particlesInfo;
    /*1-*/});
  }; // end getParticlesFromDataFile()

  //----------------------------------------------------------------------------
  plugin.createParticlesInfoFromDataTypeHashArray = function( $el, data_file_var, callback ) {
    //----------------------------------------------------------------------------
    plugin.statusLog( " ..*9.4: lib.js: plugin.createParticlesInfoFromDataTypeHashArray() *");
    // TypeHashArray: convert from JSON string of hash objects. Each hash object
    // already is of our format pixel(x,y,r), so nothing more to reformat.
    var particlesHashArray = data_file_var.data;
    var particlesInfo = {
      source: 'file',
      particles: {
        type: 'HashArray',
        obj: particlesHashArray,
      },
      numParticles: particlesHashArray.length,
      eof: particlesHashArray.length - 1,
      nextIndex: 0,
      nextParticleMethod: 'nextParticleFromHashArray',
    };
    if ( typeof callback == 'function' ) { callback( particlesInfo ); return; }
    return particlesInfo;
  }; // createParticlesInfoFromDataTypeHashArray()

  //----------------------------------------------------------------------------
  plugin.getNextParticle = function( $el ) {
    //----------------------------------------------------------------------------
    var particle = null,
        particleProps = null,
        pcb = $el.data( 'particlesInfo' );
    if ( !(pcb.eof == -1) &&
         !(pcb.nextIndex == pcb.eof) ) {
      particleProps = plugin[ pcb.nextParticleMethod ]( pcb );
      pcb.nextIndex += 1;
      particle = {
        props: particleProps,
      };
    }
    return particle;
  }; // end getNextParticle()

  //----------------------------------------------------------------------------
  plugin.nextParticleFromHashArray = function( pcb ) {
    //----------------------------------------------------------------------------
    return pcb.particles.obj[ pcb.nextIndex ];
  }; // end nextParticleFromHashArray()

  //------------------------------------------------------------------------------
  plugin.getRandom = function( max, min ) {
    //----------------------------------------------------------------------------
    return Math.floor( Math.random() * ( 1 + max - min ) + min );
  } // end function getRandom()

  //----------------------------------------------------------------------------
  plugin.openSceneContainer = function( $el ) {
    //----------------------------------------------------------------------------
    console.log( " ..*9.5: lib.js: openSceneContainer() sceneTag: '" +
                 ( $el.data( '$sceneContainer' ) ? ($el.data( 'photoTag' ) + "'. sceneContainer.id: '" + $el.data( '$sceneContainer' ).attr('id'))
                           : '*none' ) + "'. *");
    if ( !$el.data( '$sceneContainer' ) ) {
      return;
    }
    $el.data( '$sceneContainer' ).css( 'display', 'block' );
  };// end: openSceneContainer()

  //----------------------------------------------------------------------------
  plugin.closeSceneContainer = function( $el ) {
    //----------------------------------------------------------------------------
    console.log( " ..*9.6: lib.js: closeSceneContainer() sceneTag: '" +
                 ( $el.data( '$sceneContainer' ) ? ($el.data( 'photoTag' ) + "'. sceneContainer.id: '" + $el.data( '$sceneContainer' ).attr('id'))
                         : '*none' ) + "'. *");
    if ( !$el.data( '$sceneContainer' ) ) {
      return;
    }
    $el.data( '$sceneContainer' ).css( 'display', 'none' );
  };// end: closeSceneContainer()

  return plugin;
} ( jQuery, TrrPePlugin || {} ) );
