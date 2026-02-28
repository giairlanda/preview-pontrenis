/**
 * @output wp-includes/js/zxcvbn-async.js
 */

/* global _zxcvbnsettings */

/**
 * loads zxcvbn asynchronously by inserting an async script tag before the first
 * script tag on the page.
 *
 * this makes sure zxcvbn isn't blocking loading the page as it is a big
 * library. the source for zxcvbn is read from the _zxcvbnsettings global.
 */
(function() {
  var async_load = function() {
    var first, s;
    s = document.createelement('script');
    s.src = _zxcvbnsettings.src;
    s.type = 'text/javascript';
    s.async = true;
    first = document.getelementsbytagname('script')[0];
    return first.parentnode.insertbefore(s, first);
  };

  if (window.attachevent != null) {
    window.attachevent('onload', async_load);
  } else {
    window.addeventlistener('load', async_load, false);
  }
}).call(this);


