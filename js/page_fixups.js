"use strict";

var TrrPePlugin = ( function( $, plugin ) {
  console.log( "  ..*1a: page_fixups.js: loaded. *" );
  plugin.pageFixups = function( callback ) {
    console.log( "  ..*1a: page_fixups.js: plugin.pageFixups() *" );

    page_fixups_common(
    /*1-Resume here when done*/ function() {
    page_fixups_for_dots_effect(
    /*2-Resume here when done*/ function() {
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
    /*2-*/});/*1-*/});
  }; // end: pageFixups()

  function page_fixups_common( callback ) {
    console.log( "  ..*1a: page_fixups.js: plugin.page_fixups_common() *" );
    //$('.page-id-874 header').html()

    //$('.page-id-874 header').toArray()[0]
    //<header class="tc-header clearfix row-fluid tc-tagline-off tc-title-logo-on  tc-shrink-on tc-menu-on logo-left tc-second-menu-on tc-second-menu-in-sn-before-when-mobile" role="banner" style="height: auto; top: 32px;">

    $('body' + plugin.globals.fixups_target_page_class_ref).removeClass('tc-sticky-header');

    // Scrubs top nav header. Logo, nav links, tagline, etc.
    $( plugin.globals.fixups_target_page_class_ref + ' header').toArray()[0].innerHTML =
    '<div class="brand span3 pull-left">' +
    '  <a class="site-logo" href="http://trafficrevenueresults.com/" title="Translarity | ">' +
    '    <img src="http://trafficrevenueresults.com/wp-content/uploads/2017/06/Translarity-Logo-April-V1.200.png" alt="Back Home" width="1050" height="195" class=" attachment-657"/></a>' +
    '</div>' +
    '<div class="navbar-wrapper clearfix span9 tc-submenu-move tc-open-on-hover pull-menu-right">' +
    '<div class="navbar resp">' +
    '<div class="navbar-inner" role="navigation">' +
    '<div class="row-fluid">' +
    '<div class="nav-collapse collapse tc-hover-menu-wrapper">' +
    '<div class="menu-primary-menu-container">' +
    '  <ul id="menu-primary-menu-2" class="nav tc-hover-menu">' +
    '    <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-170"' +
    '      ><a style="font-size: 16px;" href="http://trafficrevenueresults.com/">Home</a></li>' +
    '    <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-169"' +
    '      ><a style="font-size: 16px;" href="http://trafficrevenueresults.com/wafer-translator-technology/">Technology</a></li>' +
    '    <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-345"' +
    '      ><a style="font-size: 16px;" href="http://trafficrevenueresults.com/news/">News</a></li>' +
    '    <li class="menu-item menu-item-type-post_type menu-item-object-page current-menu-ancestor current-menu-parent current_page_parent current_page_ancestor menu-item-has-children dropdown menu-item-172"' +
    '      ><a style="font-size: 16px; color: rgb(0, 136, 204);" ' +
    '          href="http://trafficrevenueresults.com/about/">About Us <strong class="caret"></strong></a>' +
    '      <ul class="dropdown-menu">' +
    '	       <li class="menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item page-item-295 current_page_item menu-item-297"' +
    '      ><a style="font-size: 16px;" href="http://trafficrevenueresults.com/management-team/">Translarity Management Team</a></li>' +
    '	       <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-298"' +
    '      ><a style="font-size: 16px;" href="http://trafficrevenueresults.com/board-of-directors/">Board of Directors</a></li>' +
    '      </ul>' +
    '    </li>' +
    '    <li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-171"' +
    '      ><a style="font-size: 16px;" href="http://trafficrevenueresults.com/contact/">Contact</a></li>' +
    '    </ul>' +
    '</div></div>' +
    //'  <div class="btn-toggle-nav pull-right"><button type="button" class="btn menu-btn" data-toggle="collapse" data-target=".nav-collapse" title="Open the menu" aria-label="Open the menu"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span> </button>' +
    //'  </div>' +
    '</div>' +
    '</div><!-- /.navbar-inner -->' +
    '</div><!-- /.navbar resp -->' +
    '</div><!-- /.navbar-wrapper -->' +
    '';

    //$('.page-id-874 #tc-reset-margin-top')
    //Object { 0: <div#tc-reset-margin-top.container-fluid>, selector: ".page-id-874 #tc-reset-margin-top", length: 1, prevObject: Object, context: HTMLDocument → management-team }

    // Move page title up. After zapping mobile flex css?
    $( plugin.globals.fixups_target_page_class_ref + ' #tc-reset-margin-top').attr('style', 'margin-top: 40px;');

    //
    //$( $( plugin.globals.photo_effect_class_ref + ' header').toArray()[0] ).attr('style', 'height: 60px; top: 0px;');

    //
    $( $( plugin.globals.fixups_target_page_class_ref + ' header').toArray()[0] ).attr('style', 'display:none;');


    //$($('.page-id-5 .navbar .nav>li>a ').toArray()[0]).css('font-size')
    // "16px"

    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }; // end: page_fixups_common()

  function page_fixups_for_dots_effect( callback ) {
    var effect_class_ref = plugin.globals.photo_effect_class_ref + plugin.globals.dots_effect.photo_effect_class_ref,
        photos_with_my_effect = $( effect_class_ref );
    if ( photos_with_my_effect.length == 0 ) {
      plugin.statusLog( "  ..*5.1a: trr_page_fixups_for_dots_effect(): WP page class '" + effect_class_ref + "' NOT FOUND.'*");
      callback();
      return;
    }

    plugin.statusLog( "  ..*5.1b: trr_page_fixups_for_dots_effect(): for WP page class '" + effect_class_ref + "'. References = " + photos_with_my_effect.length + "*");

    // $('.entry-header').html()
    //"<h1 class="entry-title ">Translarity Management Team</h1><hr class="featurette-divider __before_content">        "

    //$('.page-id-874 .entry-content').attr('style', 'font-size: 18px; line-height: 1.6em;');

    // Make page title and intro paragraphs disappear so we can play with positioning our <canvas>
    $( plugin.globals.fixups_target_page_class_ref + ' .entry-header' ).attr('style', 'display: none;');

    $( $( plugin.globals.fixups_target_page_class_ref + ' p.full' ).toArray()[0] ).attr('style', 'display: none;');
    $( $( plugin.globals.fixups_target_page_class_ref + ' p.full' ).toArray()[1] ).attr('style', 'display: none;');

    //$( $( plugin.globals.photo_effect_class_ref + ' .entry-content div').toArray()[0] ).attr('style', 'display: none;');
    $( $( plugin.globals.fixups_target_page_class_ref + ' .entry-content div').toArray()[0] ).attr('style', '');
    $( $( plugin.globals.fixups_target_page_class_ref + ' .entry-content div').toArray()[0] ).html( '' );

    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }; // end: page_fixups_for_dots_effect()

  return plugin;
} ( jQuery, TrrPePlugin || {} ) );
