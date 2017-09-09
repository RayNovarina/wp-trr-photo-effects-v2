"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  if(plugin.globals.logging){plugin.statusLog( "  ..*7: scroll_events.js: loaded. *" );}

  //----------------------------------------------------------------------------
  plugin.scrollTo = function( event ) {
    //--------------------------------------------------------------------------
    // event.scrollDirection:
    //    PAUSED:
    // event.state:
    //    DURING  - scroll down
    //    BEFORE  - scroll up
    var $scrolledToProfile = $( event.currentTarget.triggerElement() ); // i.e. the <img> tag.
    if(plugin.globals.logging){plugin.statusLog( "  ..*7a.2: scroll_events.js ScrollMagic event: '" +
                      event.scrollDirection + ": " + event.state +
                      "'. scrolledToPhotoTag: '" + $scrolledToProfile.data( 'photoTag' ) +
                      "'. previousProfile.photoTag: '" + ($scrolledToProfile.data( 'previousProfileTag' ) || '*none*') +
                      "'. nextProfileTag: '" + ($scrolledToProfile.data( 'nextProfileTag' ) || '*none*') +
                      "'. *" );}

    // showing laura. scroll down to gary. Scroll event is for gary (me), laura is previous.
    if ( event.state == 'DURING' ) {
      // 'moving_up_into_view'
      plugin.morphToNextPhoto( event, $scrolledToProfile );
    } else { // event.state == 'BEFORE' which means 'moving_down_out_of_view'
      plugin.morphToPreviousPhoto( event, $scrolledToProfile ); //.data( '$previousProfile' ) );
    }
  };// end: scrollTo()

  //----------------------------------------------------------------------------
  plugin.morphToNextPhoto = function( event, $profile ) {
    //--------------------------------------------------------------------------
    if ( plugin.isNoProfileData($profile, 'morphToNextPhoto') ) {return;}
    if(plugin.globals.logging){plugin.statusLog( "  ..*7b.2: scroll_events.js morphToNextPhoto() For '" + $profile.data( 'photoTag' ) + "': playing Timeline 'Forwards'. * ");}

    $profile.data( 'timeline' ).play();
  }; // end: morphToNextPhoto()

  //----------------------------------------------------------------------------
  plugin.morphToPreviousPhoto = function( event, $profile ) {
    //--------------------------------------------------------------------------
    if ( plugin.isNoProfileData($profile, 'morphToPreviousPhoto') ) {return;}
    if(plugin.globals.logging){plugin.statusLog( "  ..*7c.2: scroll_events.js morphToPreviousPhoto() For '" + $profile.data( 'photoTag' ) + "': playing Timeline 'in Reverse'. * ");}

    $profile.data( 'timeline' ).reverse();
  }; // end: morphToPreviousPhoto()

  //----------------------------------------------------------------------------
  plugin.isNoProfileData = function( $profile, caller_id ) {
    //----------------------------------------------------------------------------
    if ( !$profile || !$profile.data ||
         !$profile.data( 'timeline' ) ) {
      if(plugin.globals.logging){plugin.statusLog( "  ..*7b.1: scroll_events.js " + caller_id + ".isNoProfileData() no profile or profile.timeline. IGNORED *");}
      return true;
    }
    return false;
  }; // end: isNoProfileData()

  return plugin;
} ( jQuery, TrrPePlugin || {} ) );
