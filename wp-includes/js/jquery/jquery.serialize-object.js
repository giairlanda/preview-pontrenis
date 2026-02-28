/*!
 * jquery serializeobject - v0.2-wp - 1/20/2010
 * http://benalman.com/projects/jquery-misc-plugins/
 *
 * copyright (c) 2010 "cowboy" ben alman
 * dual licensed under the mit and gpl licenses.
 * http://benalman.com/about/license/
 */

// whereas .serializearray() serializes a form into an array, .serializeobject()
// serializes a form into an (arguably more useful) object.

(function($,undefined){
  '$:nomunge'; // used by yui compressor.

  $.fn.serializeobject = function(){
    var obj = {};

    $.each( this.serializearray(), function(i,o){
      var n = o.name,
        v = o.value;

        obj[n] = obj[n] === undefined ? v
          : array.isarray( obj[n] ) ? obj[n].concat( v )
          : [ obj[n], v ];
    });

    return obj;
  };

})(jquery);







