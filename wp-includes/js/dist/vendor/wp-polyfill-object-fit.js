/*----------------------------------------
 * objectfitpolyfill 2.3.5
 *
 * made by constance chen
 * released under the isc license
 *
 * https://github.com/constancecchen/object-fit-polyfill
 *--------------------------------------*/

(function() {
  'use strict';

  // if the page is being rendered on the server, don't continue
  if (typeof window === 'undefined') return;

  // workaround for edge 16-18, which only implemented object-fit for <img> tags
  var edgematch = window.navigator.useragent.match(/edge\/(\d{2})\./);
  var edgeversion = edgematch ? parseint(edgematch[1], 10) : null;
  var edgepartialsupport = edgeversion
    ? edgeversion >= 16 && edgeversion <= 18
    : false;

  // if the browser does support object-fit, we don't need to continue
  var hassupport = 'objectfit' in document.documentelement.style !== false;
  if (hassupport && !edgepartialsupport) {
    window.objectfitpolyfill = function() {
      return false;
    };
    return;
  }

  /**
   * check the container's parent element to make sure it will
   * correctly handle and clip absolutely positioned children
   *
   * @param {node} $container - parent element
   */
  var checkparentcontainer = function($container) {
    var styles = window.getcomputedstyle($container, null);
    var position = styles.getpropertyvalue('position');
    var overflow = styles.getpropertyvalue('overflow');
    var display = styles.getpropertyvalue('display');

    if (!position || position === 'static') {
      $container.style.position = 'relative';
    }
    if (overflow !== 'hidden') {
      $container.style.overflow = 'hidden';
    }
    // guesstimating that people want the parent to act like full width/height wrapper here.
    // mostly attempts to target <picture> elements, which default to inline.
    if (!display || display === 'inline') {
      $container.style.display = 'block';
    }
    if ($container.clientheight === 0) {
      $container.style.height = '100%';
    }

    // add a css class hook, in case people need to override styles for any reason.
    if ($container.classname.indexof('object-fit-polyfill') === -1) {
      $container.classname = $container.classname + ' object-fit-polyfill';
    }
  };

  /**
   * check for pre-set max-width/height, min-width/height,
   * positioning, or margins, which can mess up image calculations
   *
   * @param {node} $media - img/video element
   */
  var checkmediaproperties = function($media) {
    var styles = window.getcomputedstyle($media, null);
    var constraints = {
      'max-width': 'none',
      'max-height': 'none',
      'min-width': '0px',
      'min-height': '0px',
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto',
      'margin-top': '0px',
      'margin-right': '0px',
      'margin-bottom': '0px',
      'margin-left': '0px',
    };

    for (var property in constraints) {
      var constraint = styles.getpropertyvalue(property);

      if (constraint !== constraints[property]) {
        $media.style[property] = constraints[property];
      }
    }
  };

  /**
   * calculate & set object-position
   *
   * @param {string} axis - either "x" or "y"
   * @param {node} $media - img or video element
   * @param {string} objectposition - e.g. "50% 50%", "top left"
   */
  var setposition = function(axis, $media, objectposition) {
    var position, other, start, end, side;
    objectposition = objectposition.split(' ');

    if (objectposition.length < 2) {
      objectposition[1] = objectposition[0];
    }

    /* istanbul ignore else */
    if (axis === 'x') {
      position = objectposition[0];
      other = objectposition[1];
      start = 'left';
      end = 'right';
      side = $media.clientwidth;
    } else if (axis === 'y') {
      position = objectposition[1];
      other = objectposition[0];
      start = 'top';
      end = 'bottom';
      side = $media.clientheight;
    } else {
      return; // neither x or y axis specified
    }

    if (position === start || other === start) {
      $media.style[start] = '0';
      return;
    }

    if (position === end || other === end) {
      $media.style[end] = '0';
      return;
    }

    if (position === 'center' || position === '50%') {
      $media.style[start] = '50%';
      $media.style['margin-' + start] = side / -2 + 'px';
      return;
    }

    // percentage values (e.g., 30% 10%)
    if (position.indexof('%') >= 0) {
      position = parseint(position, 10);

      if (position < 50) {
        $media.style[start] = position + '%';
        $media.style['margin-' + start] = side * (position / -100) + 'px';
      } else {
        position = 100 - position;
        $media.style[end] = position + '%';
        $media.style['margin-' + end] = side * (position / -100) + 'px';
      }

      return;
    }
    // length-based values (e.g. 10px / 10em)
    else {
      $media.style[start] = position;
    }
  };

  /**
   * calculate & set object-fit
   *
   * @param {node} $media - img/video/picture element
   */
  var objectfit = function($media) {
    // ie 10- data polyfill
    var fit = $media.dataset
      ? $media.dataset.objectfit
      : $media.getattribute('data-object-fit');
    var position = $media.dataset
      ? $media.dataset.objectposition
      : $media.getattribute('data-object-position');

    // default fallbacks
    fit = fit || 'cover';
    position = position || '50% 50%';

    // if necessary, make the parent container work with absolutely positioned elements
    var $container = $media.parentnode;
    checkparentcontainer($container);

    // check for any pre-set css which could mess up image calculations
    checkmediaproperties($media);

    // reset any pre-set width/height css and handle fit positioning
    $media.style.position = 'absolute';
    $media.style.width = 'auto';
    $media.style.height = 'auto';

    // `scale-down` chooses either `none` or `contain`, whichever is smaller
    if (fit === 'scale-down') {
      if (
        $media.clientwidth < $container.clientwidth &&
        $media.clientheight < $container.clientheight
      ) {
        fit = 'none';
      } else {
        fit = 'contain';
      }
    }

    // `none` (width/height auto) and `fill` (100%) and are straightforward
    if (fit === 'none') {
      setposition('x', $media, position);
      setposition('y', $media, position);
      return;
    }

    if (fit === 'fill') {
      $media.style.width = '100%';
      $media.style.height = '100%';
      setposition('x', $media, position);
      setposition('y', $media, position);
      return;
    }

    // `cover` and `contain` must figure out which side needs covering, and add css positioning & centering
    $media.style.height = '100%';

    if (
      (fit === 'cover' && $media.clientwidth > $container.clientwidth) ||
      (fit === 'contain' && $media.clientwidth < $container.clientwidth)
    ) {
      $media.style.top = '0';
      $media.style.margintop = '0';
      setposition('x', $media, position);
    } else {
      $media.style.width = '100%';
      $media.style.height = 'auto';
      $media.style.left = '0';
      $media.style.marginleft = '0';
      setposition('y', $media, position);
    }
  };

  /**
   * initialize plugin
   *
   * @param {node} media - optional specific dom node(s) to be polyfilled
   */
  var objectfitpolyfill = function(media) {
    if (typeof media === 'undefined' || media instanceof event) {
      // if left blank, or a default event, all media on the page will be polyfilled.
      media = document.queryselectorall('[data-object-fit]');
    } else if (media && media.nodename) {
      // if it's a single node, wrap it in an array so it works.
      media = [media];
    } else if (typeof media === 'object' && media.length && media[0].nodename) {
      // if it's an array of dom nodes (e.g. a jquery selector), it's fine as-is.
      media = media;
    } else {
      // otherwise, if it's invalid or an incorrect type, return false to let people know.
      return false;
    }

    for (var i = 0; i < media.length; i++) {
      if (!media[i].nodename) continue;

      var mediatype = media[i].nodename.tolowercase();

      if (mediatype === 'img') {
        if (edgepartialsupport) continue; // edge supports object-fit for images (but nothing else), so no need to polyfill

        if (media[i].complete) {
          objectfit(media[i]);
        } else {
          media[i].addeventlistener('load', function() {
            objectfit(this);
          });
        }
      } else if (mediatype === 'video') {
        if (media[i].readystate > 0) {
          objectfit(media[i]);
        } else {
          media[i].addeventlistener('loadedmetadata', function() {
            objectfit(this);
          });
        }
      } else {
        objectfit(media[i]);
      }
    }

    return true;
  };

  if (document.readystate === 'loading') {
    // loading hasn't finished yet
    document.addeventlistener('domcontentloaded', objectfitpolyfill);
  } else {
    // `domcontentloaded` has already fired
    objectfitpolyfill();
  }

  window.addeventlistener('resize', objectfitpolyfill);

  window.objectfitpolyfill = objectfitpolyfill;
})();







