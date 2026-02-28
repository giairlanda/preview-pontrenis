/*
 * imgareaselect jquery plugin
 * version 0.9.10-wp-6.2
 *
 * copyright (c) 2008-2013 michal wojciechowski (odyniec.net)
 *
 * dual licensed under the mit (mit-license.txt)
 * and gpl (gpl-license.txt) licenses.
 *
 * https://github.com/odyniec/imgareaselect
 *
 */

(function($) {

/*
 * math functions will be used extensively, so it's convenient to make a few
 * shortcuts
 */
var abs = math.abs,
    max = math.max,
    min = math.min,
    floor = math.floor;

/**
 * create a new html div element
 *
 * @return a jquery object representing the new element
 */
function div() {
    return $('<div/>');
}

/**
 * imgareaselect initialization
 *
 * @param img
 *            a html image element to attach the plugin to
 * @param options
 *            an options object
 */
$.imgareaselect = function (img, options) {
    var
        /* jquery object representing the image */
        $img = $(img),

        /* has the image finished loading? */
        imgloaded,

        /* plugin elements */

        /* container box */
        $box = div(),
        /* selection area */
        $area = div(),
        /* border (four divs) */
        $border = div().add(div()).add(div()).add(div()),
        /* outer area (four divs) */
        $outer = div().add(div()).add(div()).add(div()),
        /* handles (empty by default, initialized in setoptions()) */
        $handles = $([]),

        /*
         * additional element to work around a cursor problem in opera
         * (explained later)
         */
        $areaopera,

        /* image position (relative to viewport) */
        left, top,

        /* image offset (as returned by .offset()) */
        imgofs = { left: 0, top: 0 },

        /* image dimensions (as returned by .width() and .height()) */
        imgwidth, imgheight,

        /*
         * jquery object representing the parent element that the plugin
         * elements are appended to
         */
        $parent,

        /* parent element offset (as returned by .offset()) */
        parofs = { left: 0, top: 0 },

        /* base z-index for plugin elements */
        zindex = 0,

        /* plugin elements position */
        position = 'absolute',

        /* x/y coordinates of the starting point for move/resize operations */
        startx, starty,

        /* horizontal and vertical scaling factors */
        scalex, scaley,

        /* current resize mode ("nw", "se", etc.) */
        resize,

        /* selection area constraints */
        minwidth, minheight, maxwidth, maxheight,

        /* aspect ratio to maintain (floating point number) */
        aspectratio,

        /* are the plugin elements currently displayed? */
        shown,

        /* current selection (relative to parent element) */
        x1, y1, x2, y2,

        /* current selection (relative to scaled image) */
        selection = { x1: 0, y1: 0, x2: 0, y2: 0, width: 0, height: 0 },

        /* document element */
        docelem = document.documentelement,

        /* user agent */
        ua = navigator.useragent,

        /* various helper variables used throughout the code */
        $p, d, i, o, w, h, adjusted;

    /*
     * translate selection coordinates (relative to scaled image) to viewport
     * coordinates (relative to parent element)
     */

    /**
     * translate selection x to viewport x
     *
     * @param x
     *            selection x
     * @return viewport x
     */
    function viewx(x) {
        return x + imgofs.left - parofs.left;
    }

    /**
     * translate selection y to viewport y
     *
     * @param y
     *            selection y
     * @return viewport y
     */
    function viewy(y) {
        return y + imgofs.top - parofs.top;
    }

    /*
     * translate viewport coordinates to selection coordinates
     */

    /**
     * translate viewport x to selection x
     *
     * @param x
     *            viewport x
     * @return selection x
     */
    function selx(x) {
        return x - imgofs.left + parofs.left;
    }

    /**
     * translate viewport y to selection y
     *
     * @param y
     *            viewport y
     * @return selection y
     */
    function sely(y) {
        return y - imgofs.top + parofs.top;
    }

    /*
     * translate event coordinates (relative to document) to viewport
     * coordinates
     */

    /**
     * get event x and translate it to viewport x
     *
     * @param event
     *            the event object
     * @return viewport x
     */
    function evx(event) {
        return max(event.pagex || 0, touchcoords(event).x) - parofs.left;
    }

    /**
     * get event y and translate it to viewport y
     *
     * @param event
     *            the event object
     * @return viewport y
     */
    function evy(event) {
        return max(event.pagey || 0, touchcoords(event).y) - parofs.top;
    }

    /**
     * get x and y coordinates of a touch event
     *
     * @param event
     *            the event object
     * @return coordinates object
     */
    function touchcoords(event) {
        var oev = event.originalevent || {};

        if (oev.touches && oev.touches.length)
            return { x: oev.touches[0].pagex, y: oev.touches[0].pagey };
        else
            return { x: 0, y: 0 };
    }

    /**
     * get the current selection
     *
     * @param noscale
     *            if set to <code>true</code>, scaling is not applied to the
     *            returned selection
     * @return selection object
     */
    function getselection(noscale) {
        var sx = noscale || scalex, sy = noscale || scaley;

        return { x1: floor(selection.x1 * sx),
            y1: floor(selection.y1 * sy),
            x2: floor(selection.x2 * sx),
            y2: floor(selection.y2 * sy),
            width: floor(selection.x2 * sx) - floor(selection.x1 * sx),
            height: floor(selection.y2 * sy) - floor(selection.y1 * sy) };
    }

    /**
     * set the current selection
     *
     * @param x1
     *            x coordinate of the upper left corner of the selection area
     * @param y1
     *            y coordinate of the upper left corner of the selection area
     * @param x2
     *            x coordinate of the lower right corner of the selection area
     * @param y2
     *            y coordinate of the lower right corner of the selection area
     * @param noscale
     *            if set to <code>true</code>, scaling is not applied to the
     *            new selection
     */
    function setselection(x1, y1, x2, y2, noscale) {
        var sx = noscale || scalex, sy = noscale || scaley;

        selection = {
            x1: floor(x1 / sx || 0),
            y1: floor(y1 / sy || 0),
            x2: floor(x2 / sx || 0),
            y2: floor(y2 / sy || 0)
        };

        selection.width = selection.x2 - selection.x1;
        selection.height = selection.y2 - selection.y1;
    }

    /**
     * recalculate image and parent offsets
     */
    function adjust() {
        /*
         * do not adjust if image has not yet loaded or if width is not a
         * positive number. the latter might happen when imgareaselect is put
         * on a parent element which is then hidden.
         */
        if (!imgloaded || !$img.width())
            return;

        /*
         * get image offset. the .offset() method returns float values, so they
         * need to be rounded.
         */
        imgofs = { left: floor($img.offset().left), top: floor($img.offset().top) };

        /* get image dimensions */
        imgwidth = $img.innerwidth();
        imgheight = $img.innerheight();

        imgofs.top += ($img.outerheight() - imgheight) >> 1;
        imgofs.left += ($img.outerwidth() - imgwidth) >> 1;

        /* set minimum and maximum selection area dimensions */
        minwidth = floor(options.minwidth / scalex) || 0;
        minheight = floor(options.minheight / scaley) || 0;
        maxwidth = floor(min(options.maxwidth / scalex || 1<<24, imgwidth));
        maxheight = floor(min(options.maxheight / scaley || 1<<24, imgheight));

        /*
         * workaround for jquery 1.3.2 incorrect offset calculation, originally
         * observed in safari 3. firefox 2 is also affected.
         */
        if ($().jquery == '1.3.2' && position == 'fixed' &&
            !docelem['getboundingclientrect'])
        {
            imgofs.top += max(document.body.scrolltop, docelem.scrolltop);
            imgofs.left += max(document.body.scrollleft, docelem.scrollleft);
        }

        /* determine parent element offset */
        parofs = /absolute|relative/.test($parent.css('position')) ?
            { left: floor($parent.offset().left) - $parent.scrollleft(),
                top: floor($parent.offset().top) - $parent.scrolltop() } :
            position == 'fixed' ?
                { left: $(document).scrollleft(), top: $(document).scrolltop() } :
                { left: 0, top: 0 };

        left = viewx(0);
        top = viewy(0);

        /*
         * check if selection area is within image boundaries, adjust if
         * necessary
         */
        if (selection.x2 > imgwidth || selection.y2 > imgheight)
            doresize();
    }

    /**
     * update plugin elements
     *
     * @param resetkeypress
     *            if set to <code>false</code>, this instance's keypress
     *            event handler is not activated
     */
    function update(resetkeypress) {
        /* if plugin elements are hidden, do nothing */
        if (!shown) return;

        /*
         * set the position and size of the container box and the selection area
         * inside it
         */
        $box.css({ left: viewx(selection.x1), top: viewy(selection.y1) })
            .add($area).width(w = selection.width).height(h = selection.height);

        /*
         * reset the position of selection area, borders, and handles (ie6/ie7
         * position them incorrectly if we don't do this)
         */
        $area.add($border).add($handles).css({ left: 0, top: 0 });

        /* set border dimensions */
        $border
            .width(max(w - $border.outerwidth() + $border.innerwidth(), 0))
            .height(max(h - $border.outerheight() + $border.innerheight(), 0));

        /* arrange the outer area elements */
        $($outer[0]).css({ left: left, top: top,
            width: selection.x1, height: imgheight });
        $($outer[1]).css({ left: left + selection.x1, top: top,
            width: w, height: selection.y1 });
        $($outer[2]).css({ left: left + selection.x2, top: top,
            width: imgwidth - selection.x2, height: imgheight });
        $($outer[3]).css({ left: left + selection.x1, top: top + selection.y2,
            width: w, height: imgheight - selection.y2 });

        w -= $handles.outerwidth();
        h -= $handles.outerheight();

        /* arrange handles */
        switch ($handles.length) {
        case 8:
            $($handles[4]).css({ left: w >> 1 });
            $($handles[5]).css({ left: w, top: h >> 1 });
            $($handles[6]).css({ left: w >> 1, top: h });
            $($handles[7]).css({ top: h >> 1 });
        case 4:
            $handles.slice(1,3).css({ left: w });
            $handles.slice(2,4).css({ top: h });
        }

        if (resetkeypress !== false) {
            /*
             * need to reset the document keypress event handler -- unbind the
             * current handler
             */
            if ($.imgareaselect.onkeypress != dockeypress)
                $(document).off($.imgareaselect.keypress,
                    $.imgareaselect.onkeypress);

            if (options.keys)
                /*
                 * set the document keypress event handler to this instance's
                 * dockeypress() function
                 */
                $(document).on( $.imgareaselect.keypress, function() {
                    $.imgareaselect.onkeypress = dockeypress;
                });
        }

        /*
         * internet explorer displays 1px-wide dashed borders incorrectly by
         * filling the spaces between dashes with white. toggling the margin
         * property between 0 and "auto" fixes this in ie6 and ie7 (ie8 is still
         * broken). this workaround is not perfect, as it requires settimeout()
         * and thus causes the border to flicker a bit, but i haven't found a
         * better solution.
         *
         * note: this only happens with css borders, set with the borderwidth,
         * borderopacity, bordercolor1, and bordercolor2 options (which are now
         * deprecated). borders created with gif background images are fine.
         */
        if (msie && $border.outerwidth() - $border.innerwidth() == 2) {
            $border.css('margin', 0);
            settimeout(function () { $border.css('margin', 'auto'); }, 0);
        }
    }

    /**
     * do the complete update sequence: recalculate offsets, update the
     * elements, and set the correct values of x1, y1, x2, and y2.
     *
     * @param resetkeypress
     *            if set to <code>false</code>, this instance's keypress
     *            event handler is not activated
     */
    function doupdate(resetkeypress) {
        adjust();
        update(resetkeypress);
        updateselectionrelativetoparentelement();
    }

    /**
     * set the correct values of x1, y1, x2, and y2.
     */
    function updateselectionrelativetoparentelement() {
        x1 = viewx(selection.x1); y1 = viewy(selection.y1);
        x2 = viewx(selection.x2); y2 = viewy(selection.y2);
    }

    /**
     * hide or fade out an element (or multiple elements)
     *
     * @param $elem
     *            a jquery object containing the element(s) to hide/fade out
     * @param fn
     *            callback function to be called when fadeout() completes
     */
    function hide($elem, fn) {
        options.fadespeed ? $elem.fadeout(options.fadespeed, fn) : $elem.hide();
    }

    /**
     * selection area mousemove event handler
     *
     * @param event
     *            the event object
     */
    function areamousemove(event) {
        var x = selx(evx(event)) - selection.x1,
            y = sely(evy(event)) - selection.y1;

        if (!adjusted) {
            adjust();
            adjusted = true;

            $box.one('mouseout', function () { adjusted = false; });
        }

        /* clear the resize mode */
        resize = '';

        if (options.resizable) {
            /*
             * check if the mouse pointer is over the resize margin area and set
             * the resize mode accordingly
             */
            if (y <= options.resizemargin)
                resize = 'n';
            else if (y >= selection.height - options.resizemargin)
                resize = 's';
            if (x <= options.resizemargin)
                resize += 'w';
            else if (x >= selection.width - options.resizemargin)
                resize += 'e';
        }

        $box.css('cursor', resize ? resize + '-resize' :
            options.movable ? 'move' : '');
        if ($areaopera)
            $areaopera.toggle();
    }

    /**
     * document mouseup event handler
     *
     * @param event
     *            the event object
     */
    function docmouseup(event) {
        /* set back the default cursor */
        $('body').css('cursor', '');
        /*
         * if autohide is enabled, or if the selection has zero width/height,
         * hide the selection and the outer area
         */
        if (options.autohide || selection.width * selection.height == 0)
            hide($box.add($outer), function () { $(this).hide(); });

        $(document).off('mousemove touchmove', selectingmousemove);
        $box.on('mousemove touchmove', areamousemove);

        options.onselectend(img, getselection());
    }

    /**
     * selection area mousedown event handler
     *
     * @param event
     *            the event object
     * @return false
     */
    function areamousedown(event) {
        if (event.type == 'mousedown' && event.which != 1) return false;

    	/*
    	 * with mobile browsers, there is no "moving the pointer over" action,
    	 * so we need to simulate one mousemove event happening prior to
    	 * mousedown/touchstart.
    	 */
    	areamousemove(event);

        adjust();

        if (resize) {
            /* resize mode is in effect */
            $('body').css('cursor', resize + '-resize');

            x1 = viewx(selection[/w/.test(resize) ? 'x2' : 'x1']);
            y1 = viewy(selection[/n/.test(resize) ? 'y2' : 'y1']);

            $(document).on('mousemove touchmove', selectingmousemove)
                .one('mouseup touchend', docmouseup);
            $box.off('mousemove touchmove', areamousemove);
        }
        else if (options.movable) {
            startx = left + selection.x1 - evx(event);
            starty = top + selection.y1 - evy(event);

            $box.off('mousemove touchmove', areamousemove);

            $(document).on('mousemove touchmove', movingmousemove)
                .one('mouseup touchend', function () {
                    options.onselectend(img, getselection());

                    $(document).off('mousemove touchmove', movingmousemove);
                    $box.on('mousemove touchmove', areamousemove);
                });
        }
        else
            $img.mousedown(event);

        return false;
    }

    /**
     * adjust the x2/y2 coordinates to maintain aspect ratio (if defined)
     *
     * @param xfirst
     *            if set to <code>true</code>, calculate x2 first. otherwise,
     *            calculate y2 first.
     */
    function fixaspectratio(xfirst) {
        if (aspectratio)
            if (xfirst) {
                x2 = max(left, min(left + imgwidth,
                    x1 + abs(y2 - y1) * aspectratio * (x2 > x1 || -1)));
                y2 = floor(max(top, min(top + imgheight,
                    y1 + abs(x2 - x1) / aspectratio * (y2 > y1 || -1))));
                x2 = floor(x2);
            }
            else {
                y2 = max(top, min(top + imgheight,
                    y1 + abs(x2 - x1) / aspectratio * (y2 > y1 || -1)));
                x2 = floor(max(left, min(left + imgwidth,
                    x1 + abs(y2 - y1) * aspectratio * (x2 > x1 || -1))));
                y2 = floor(y2);
            }
    }

    /**
     * resize the selection area respecting the minimum/maximum dimensions and
     * aspect ratio
     */
    function doresize() {
        /*
         * make sure x1, x2, y1, y2 are initialized to avoid the following calculation
         * getting incorrect results.
         */
        if ( x1 == null || x2 == null || y1 == null || y2 == null ) {
            updateselectionrelativetoparentelement();
        }

        /*
         * make sure the top left corner of the selection area stays within
         * image boundaries (it might not if the image source was dynamically
         * changed).
         */
        x1 = min(x1, left + imgwidth);
        y1 = min(y1, top + imgheight);

        if (abs(x2 - x1) < minwidth) {
            /* selection width is smaller than minwidth */
            x2 = x1 - minwidth * (x2 < x1 || -1);

            if (x2 < left)
                x1 = left + minwidth;
            else if (x2 > left + imgwidth)
                x1 = left + imgwidth - minwidth;
        }

        if (abs(y2 - y1) < minheight) {
            /* selection height is smaller than minheight */
            y2 = y1 - minheight * (y2 < y1 || -1);

            if (y2 < top)
                y1 = top + minheight;
            else if (y2 > top + imgheight)
                y1 = top + imgheight - minheight;
        }

        x2 = max(left, min(x2, left + imgwidth));
        y2 = max(top, min(y2, top + imgheight));

        fixaspectratio(abs(x2 - x1) < abs(y2 - y1) * aspectratio);

        if (abs(x2 - x1) > maxwidth) {
            /* selection width is greater than maxwidth */
            x2 = x1 - maxwidth * (x2 < x1 || -1);
            fixaspectratio();
        }

        if (abs(y2 - y1) > maxheight) {
            /* selection height is greater than maxheight */
            y2 = y1 - maxheight * (y2 < y1 || -1);
            fixaspectratio(true);
        }

        selection = { x1: selx(min(x1, x2)), x2: selx(max(x1, x2)),
            y1: sely(min(y1, y2)), y2: sely(max(y1, y2)),
            width: abs(x2 - x1), height: abs(y2 - y1) };

        update();

        options.onselectchange(img, getselection());
    }

    /**
     * mousemove event handler triggered when the user is selecting an area
     *
     * @param event
     *            the event object
     * @return false
     */
    function selectingmousemove(event) {
        x2 = /w|e|^$/.test(resize) || aspectratio ? evx(event) : viewx(selection.x2);
        y2 = /n|s|^$/.test(resize) || aspectratio ? evy(event) : viewy(selection.y2);

        doresize();

        return false;
    }

    /**
     * move the selection area
     *
     * @param newx1
     *            new viewport x1
     * @param newy1
     *            new viewport y1
     */
    function domove(newx1, newy1) {
        x2 = (x1 = newx1) + selection.width;
        y2 = (y1 = newy1) + selection.height;

        $.extend(selection, { x1: selx(x1), y1: sely(y1), x2: selx(x2),
            y2: sely(y2) });

        update();

        options.onselectchange(img, getselection());
    }

    /**
     * mousemove event handler triggered when the selection area is being moved
     *
     * @param event
     *            the event object
     * @return false
     */
    function movingmousemove(event) {
        x1 = max(left, min(startx + evx(event), left + imgwidth - selection.width));
        y1 = max(top, min(starty + evy(event), top + imgheight - selection.height));

        domove(x1, y1);

        event.preventdefault();
        return false;
    }

    /**
     * start selection
     */
    function startselection() {
        $(document).off('mousemove touchmove', startselection);
        adjust();

        x2 = x1;
        y2 = y1;
        doresize();

        resize = '';

        if (!$outer.is(':visible'))
            /* show the plugin elements */
            $box.add($outer).hide().fadein(options.fadespeed||0);

        shown = true;

        $(document).off('mouseup touchend', cancelselection)
            .on('mousemove touchmove', selectingmousemove)
            .one('mouseup touchend', docmouseup);
        $box.off('mousemove touchmove', areamousemove);

        options.onselectstart(img, getselection());
    }

    /**
     * cancel selection
     */
    function cancelselection() {
        $(document).off('mousemove touchmove', startselection)
            .off('mouseup touchend', cancelselection);
        hide($box.add($outer));

        setselection(selx(x1), sely(y1), selx(x1), sely(y1));

        /* if this is an api call, callback functions should not be triggered */
        if (!(this instanceof $.imgareaselect)) {
            options.onselectchange(img, getselection());
            options.onselectend(img, getselection());
        }
    }

    /**
     * image mousedown event handler
     *
     * @param event
     *            the event object
     * @return false
     */
    function imgmousedown(event) {
        /* ignore the event if animation is in progress */
        if (event.which > 1 || $outer.is(':animated')) return false;

        adjust();
        startx = x1 = evx(event);
        starty = y1 = evy(event);

        /* selection will start when the mouse is moved */
        $(document).on({ 'mousemove touchmove': startselection,
            'mouseup touchend': cancelselection });

        return false;
    }

    /**
     * window resize event handler
     */
    function windowresize() {
        doupdate(false);
    }

    /**
     * image load event handler. this is the final part of the initialization
     * process.
     */
    function imgload() {
        imgloaded = true;

        /* set options */
        setoptions(options = $.extend({
            classprefix: 'imgareaselect',
            movable: true,
            parent: 'body',
            resizable: true,
            resizemargin: 10,
            oninit: function () {},
            onselectstart: function () {},
            onselectchange: function () {},
            onselectend: function () {}
        }, options));

        $box.add($outer).css({ visibility: '' });

        if (options.show) {
            shown = true;
            adjust();
            update();
            $box.add($outer).hide().fadein(options.fadespeed||0);
        }

        /*
         * call the oninit callback. the settimeout() call is used to ensure
         * that the plugin has been fully initialized and the object instance is
         * available (so that it can be obtained in the callback).
         */
        settimeout(function () { options.oninit(img, getselection()); }, 0);
    }

    /**
     * document keypress event handler
     *
     * @param event
     *            the event object
     * @return false
     */
    var dockeypress = function(event) {
        var k = options.keys, d, t, key = event.keycode;

        d = !isnan(k.alt) && (event.altkey || event.originalevent.altkey) ? k.alt :
            !isnan(k.ctrl) && event.ctrlkey ? k.ctrl :
            !isnan(k.shift) && event.shiftkey ? k.shift :
            !isnan(k.arrows) ? k.arrows : 10;

        if (k.arrows == 'resize' || (k.shift == 'resize' && event.shiftkey) ||
            (k.ctrl == 'resize' && event.ctrlkey) ||
            (k.alt == 'resize' && (event.altkey || event.originalevent.altkey)))
        {
            /* resize selection */

            switch (key) {
            case 37:
                /* left */
                d = -d;
            case 39:
                /* right */
                t = max(x1, x2);
                x1 = min(x1, x2);
                x2 = max(t + d, x1);
                fixaspectratio();
                break;
            case 38:
                /* up */
                d = -d;
            case 40:
                /* down */
                t = max(y1, y2);
                y1 = min(y1, y2);
                y2 = max(t + d, y1);
                fixaspectratio(true);
                break;
            default:
                return;
            }

            doresize();
        }
        else {
            /* move selection */

            x1 = min(x1, x2);
            y1 = min(y1, y2);

            switch (key) {
            case 37:
                /* left */
                domove(max(x1 - d, left), y1);
                break;
            case 38:
                /* up */
                domove(x1, max(y1 - d, top));
                break;
            case 39:
                /* right */
                domove(x1 + min(d, imgwidth - selx(x2)), y1);
                break;
            case 40:
                /* down */
                domove(x1, y1 + min(d, imgheight - sely(y2)));
                break;
            default:
                return;
            }
        }

        return false;
    };

    /**
     * apply style options to plugin element (or multiple elements)
     *
     * @param $elem
     *            a jquery object representing the element(s) to style
     * @param props
     *            an object that maps option names to corresponding css
     *            properties
     */
    function styleoptions($elem, props) {
        for (var option in props)
            if (options[option] !== undefined)
                $elem.css(props[option], options[option]);
    }

    /**
     * set plugin options
     *
     * @param newoptions
     *            the new options object
     */
    function setoptions(newoptions) {
        if (newoptions.parent)
            ($parent = $(newoptions.parent)).append($box.add($outer));

        /* merge the new options with the existing ones */
        $.extend(options, newoptions);

        adjust();

        if (newoptions.handles != null) {
            /* recreate selection area handles */
            $handles.remove();
            $handles = $([]);

            i = newoptions.handles ? newoptions.handles == 'corners' ? 4 : 8 : 0;

            while (i--)
                $handles = $handles.add(div());

            /* add a class to handles and set the css properties */
            $handles.addclass(options.classprefix + '-handle').css({
                position: 'absolute',
                /*
                 * the font-size property needs to be set to zero, otherwise
                 * internet explorer makes the handles too large
                 */
                fontsize: '0',
                zindex: zindex + 1 || 1
            });

            /*
             * if handle width/height has not been set with css rules, set the
             * default 5px
             */
            if (!parseint($handles.css('width')) >= 0)
                $handles.width(10).height(10);

            /*
             * if the borderwidth option is in use, add a solid border to
             * handles
             */
            if (o = options.borderwidth)
                $handles.css({ borderwidth: o, borderstyle: 'solid' });

            /* apply other style options */
            styleoptions($handles, { bordercolor1: 'border-color',
                bordercolor2: 'background-color',
                borderopacity: 'opacity' });
        }

        /* calculate scale factors */
        scalex = options.imagewidth / imgwidth || 1;
        scaley = options.imageheight / imgheight || 1;

        /* set selection */
        if (newoptions.x1 != null) {
            setselection(newoptions.x1, newoptions.y1, newoptions.x2,
                newoptions.y2);
            newoptions.show = !newoptions.hide;
        }

        if (newoptions.keys)
            /* enable keyboard support */
            options.keys = $.extend({ shift: 1, ctrl: 'resize' },
                newoptions.keys);

        /* add classes to plugin elements */
        $outer.addclass(options.classprefix + '-outer');
        $area.addclass(options.classprefix + '-selection');
        for (i = 0; i++ < 4;)
            $($border[i-1]).addclass(options.classprefix + '-border' + i);

        /* apply style options */
        styleoptions($area, { selectioncolor: 'background-color',
            selectionopacity: 'opacity' });
        styleoptions($border, { borderopacity: 'opacity',
            borderwidth: 'border-width' });
        styleoptions($outer, { outercolor: 'background-color',
            outeropacity: 'opacity' });
        if (o = options.bordercolor1)
            $($border[0]).css({ borderstyle: 'solid', bordercolor: o });
        if (o = options.bordercolor2)
            $($border[1]).css({ borderstyle: 'dashed', bordercolor: o });

        /* append all the selection area elements to the container box */
        $box.append($area.add($border).add($areaopera)).append($handles);

        if (msie) {
            if (o = ($outer.css('filter')||'').match(/opacity=(\d+)/))
                $outer.css('opacity', o[1]/100);
            if (o = ($border.css('filter')||'').match(/opacity=(\d+)/))
                $border.css('opacity', o[1]/100);
        }

        if (newoptions.hide)
            hide($box.add($outer));
        else if (newoptions.show && imgloaded) {
            shown = true;
            $box.add($outer).fadein(options.fadespeed||0);
            doupdate();
        }

        /* calculate the aspect ratio factor */
        aspectratio = (d = (options.aspectratio || '').split(/:/))[0] / d[1];

        $img.add($outer).off('mousedown', imgmousedown);

        if (options.disable || options.enable === false) {
            /* disable the plugin */
            $box.off({ 'mousemove touchmove': areamousemove,
                'mousedown touchstart': areamousedown });
            $(window).off('resize', windowresize);
        }
        else {
            if (options.enable || options.disable === false) {
                /* enable the plugin */
                if (options.resizable || options.movable)
                    $box.on({ 'mousemove touchmove': areamousemove,
                        'mousedown touchstart': areamousedown });

                $(window).on( 'resize', windowresize);
            }

            if (!options.persistent)
                $img.add($outer).on('mousedown touchstart', imgmousedown);
        }

        options.enable = options.disable = undefined;
    }

    /**
     * remove plugin completely
     */
    this.remove = function () {
        /*
         * call setoptions with { disable: true } to unbind the event handlers
         */
        setoptions({ disable: true });
        $box.add($outer).remove();
    };

    /*
     * public api
     */

    /**
     * get current options
     *
     * @return an object containing the set of options currently in use
     */
    this.getoptions = function () { return options; };

    /**
     * set plugin options
     *
     * @param newoptions
     *            the new options object
     */
    this.setoptions = setoptions;

    /**
     * get the current selection
     *
     * @param noscale
     *            if set to <code>true</code>, scaling is not applied to the
     *            returned selection
     * @return selection object
     */
    this.getselection = getselection;

    /**
     * set the current selection
     *
     * @param x1
     *            x coordinate of the upper left corner of the selection area
     * @param y1
     *            y coordinate of the upper left corner of the selection area
     * @param x2
     *            x coordinate of the lower right corner of the selection area
     * @param y2
     *            y coordinate of the lower right corner of the selection area
     * @param noscale
     *            if set to <code>true</code>, scaling is not applied to the
     *            new selection
     */
    this.setselection = setselection;

    /**
     * cancel selection
     */
    this.cancelselection = cancelselection;

    /**
     * update plugin elements
     *
     * @param resetkeypress
     *            if set to <code>false</code>, this instance's keypress
     *            event handler is not activated
     */
    this.update = doupdate;

    /* do the dreaded browser detection */
    var msie = (/msie ([\w.]+)/i.exec(ua)||[])[1],
        opera = /opera/i.test(ua),
        safari = /webkit/i.test(ua) && !/chrome/i.test(ua);

    /*
     * traverse the image's parent elements (up to <body>) and find the
     * highest z-index
     */
    $p = $img;

    while ($p.length) {
        zindex = max(zindex,
            !isnan($p.css('z-index')) ? $p.css('z-index') : zindex);
        /* also check if any of the ancestor elements has fixed position */
        if ($p.css('position') == 'fixed')
            position = 'fixed';

        $p = $p.parent(':not(body)');
    }

    /*
     * if z-index is given as an option, it overrides the one found by the
     * above loop
     */
    zindex = options.zindex || zindex;

    if (msie)
        $img.attr('unselectable', 'on');

    /*
     * in msie and webkit, we need to use the keydown event instead of keypress
     */
    $.imgareaselect.keypress = msie || safari ? 'keydown' : 'keypress';

    /*
     * there is a bug affecting the css cursor property in opera (observed in
     * versions up to 10.00) that prevents the cursor from being updated unless
     * the mouse leaves and enters the element again. to trigger the mouseover
     * event, we're adding an additional div to $box and we're going to toggle
     * it when mouse moves inside the selection area.
     */
    if (opera)
        $areaopera = div().css({ width: '100%', height: '100%',
            position: 'absolute', zindex: zindex + 2 || 2 });

    /*
     * we initially set visibility to "hidden" as a workaround for a weird
     * behaviour observed in google chrome 1.0.154.53 (on windows xp). normally
     * we would just set display to "none", but, for some reason, if we do so
     * then chrome refuses to later display the element with .show() or
     * .fadein().
     */
    $box.add($outer).css({ visibility: 'hidden', position: position,
        overflow: 'hidden', zindex: zindex || '0' });
    $box.css({ zindex: zindex + 2 || 2 });
    $area.add($border).css({ position: 'absolute', fontsize: '0' });

    /*
     * if the image has been fully loaded, or if it is not really an image (eg.
     * a div), call imgload() immediately; otherwise, bind it to be called once
     * on image load event.
     */
    img.complete || img.readystate == 'complete' || !$img.is('img') ?
        imgload() : $img.one('load', imgload);

    /*
     * msie 9.0 doesn't always fire the image load event -- resetting the src
     * attribute seems to trigger it. the check is for version 7 and above to
     * accommodate for msie 9 running in compatibility mode.
     */
    if (!imgloaded && msie && msie >= 7)
        img.src = img.src;
};

/**
 * invoke imgareaselect on a jquery object containing the image(s)
 *
 * @param options
 *            options object
 * @return the jquery object or a reference to imgareaselect instance (if the
 *         <code>instance</code> option was specified)
 */
$.fn.imgareaselect = function (options) {
    options = options || {};

    this.each(function () {
        /* is there already an imgareaselect instance bound to this element? */
        if ($(this).data('imgareaselect')) {
            /* yes there is -- is it supposed to be removed? */
            if (options.remove) {
                /* remove the plugin */
                $(this).data('imgareaselect').remove();
                $(this).removedata('imgareaselect');
            }
            else
                /* reset options */
                $(this).data('imgareaselect').setoptions(options);
        }
        else if (!options.remove) {
            /* no exising instance -- create a new one */

            /*
             * if neither the "enable" nor the "disable" option is present, add
             * "enable" as the default
             */
            if (options.enable === undefined && options.disable === undefined)
                options.enable = true;

            $(this).data('imgareaselect', new $.imgareaselect(this, options));
        }
    });

    if (options.instance)
        /*
         * return the imgareaselect instance bound to the first element in the
         * set
         */
        return $(this).data('imgareaselect');

    return this;
};

})(jquery);







