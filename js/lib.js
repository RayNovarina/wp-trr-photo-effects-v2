"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  if(plugin.globals.logging){plugin.statusLog( "  ..*9: lib.js: loaded. *" );}

  //----------------------------------------------------------------------------
  plugin.getParticlesFromDataFile = function( $el, callback ) {
    //----------------------------------------------------------------------------
    if(plugin.globals.logging){plugin.statusLog( " ..*9.2: lib.js: plugin.getParticlesFromDataFile() for '" + $el.data( 'photoTag' ) +
                      "'. From data file: '" + $el.data( 'photoTag' ) + '_2000_stipples_data' + "'. *");}

    // NOTE: .js file contains a string that was evaluated by javascript when the
    // file loaded. Example:
    //    var meg_2000_stipples_data='{"tag":"laura","type":"HashArray","data":[{"x":22,"y":580,"r":2.8062433825913184}]}';

    var particles_data_file_var = window[ $el.data( 'photoTag' ) + '_2000_stipples_data' ];

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
    if(plugin.globals.logging){plugin.statusLog( " ..*9.3: lib.js: plugin.createParticlesInfoFromDataTypeHashArray() *");}
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
         ( (pcb.nextIndex == 0) || !(pcb.nextIndex == pcb.eof) ) ) {
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

  return plugin;
} ( jQuery, TrrPePlugin || {} ) );
