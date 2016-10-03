
import $ from  '../bower/jquery/dist/jquery.js';
import blueimp from '../vendor/blueimp-gallery.js';
import '../bower/foundation/js/foundation.js';

import '../bower/lightgallery.js/dist/js/lightgallery.js';
import '../bower/lg-thumbnail.js/dist/lg-thumbnail.js';
import '../bower/lg-fullscreen.js/dist/lg-fullscreen.js';
import '../bower/lg-zoom.js/dist/lg-zoom.js';
console.log(window.lightGallery);


$(window).on('load', () =>  {


  $(".lightbox").each(function() {
    lightGallery(this, {
      thumbnail: true,
      fullscreen: true,
      animateThumb: true,
    });
  });


});
// $('.gallary-image').click(evt => {
//   options = {index: this, event: evt};
//   blueimp.Gallery($('.gallary-image'), options);
// });


// #= require vendor/custom.modernizr
// #= require vendor/foundation.min
// #= require vendor/blueimp-gallery.min
// #= require vendor/lodash.js
// #= require_self
//
// $ ->
//   $("body.docs .side-nav a").each (index, el) =>
//     if el.attributes.href.value == window.location.pathname
//       item = $(el)
//       item.closest("li").addClass("active")
//       item.addClass("active")
//
//   $(".top-bar-section a").each (index, el) =>
//     if el.attributes.href.value == window.location.pathname
//       item = $(el)
//       item.parents("li").addClass("active")
//
//   $('.gallary-image').click (evt) ->
//     options = { index: this, event: evt};
//     blueimp.Gallery($('.gallary-image'), options);
//
//
//   $('[data-download-button]').click (evt) ->
//     label = $(this).data('download-button')
//     ga('send', 'event', 'download', 'download', label)
//
//   $(document).foundation()
