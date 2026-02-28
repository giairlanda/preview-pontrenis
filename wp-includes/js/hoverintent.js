/*!
 * hoverintent v1.10.2 // 2020.04.28 // jquery v1.7.0+
 * http://briancherne.github.io/jquery-hoverintent/
 *
 * you may use hoverintent under the terms of the mit license. basically that
 * means you are free to use hoverintent as long as this header is left intact.
 * copyright 2007-2019 brian cherne
 */

/**
 * hoverintent is similar to jquery's built-in "hover" method except that
 * instead of firing the handlerin function immediately, hoverintent checks
 * to see if the user's mouse has slowed down (beneath the sensitivity
 * threshold) before firing the event. the handlerout function is only
 * called after a matching handlerin.
 *
 * // basic usage ... just like .hover()
 * .hoverintent( handlerin, handlerout )
 * .hoverintent( handlerinout )
 *
 * // basic usage ... with event delegation!
 * .hoverintent( handlerin, handlerout, selector )
 * .hoverintent( handlerinout, selector )
 *
 * // using a basic configuration object
 * .hoverintent( config )
 *
 * @param  handlerin   function or configuration object
 * @param  handlerout  function or selector for delegation or undefined
 * @param  selector    selector or undefined
 * @author brian cherne <brian(at)cherne(dot)net>
 */

;(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else if (jquery && !jquery.fn.hoverintent) {
        factory(jquery);
    }
})(function($) {
    'use strict';

    // default configuration values
    var _cfg = {
        interval: 100,
        sensitivity: 6,
        timeout: 0
    };

    // counter used to generate an id for each instance
    var instance_count = 0;

    // current x and y position of mouse, updated during mousemove tracking (shared across instances)
    var cx, cy;

    // saves the current pointer position coordinates based on the given mousemove event
    var track = function(ev) {
        cx = ev.pagex;
        cy = ev.pagey;
    };

    // compares current and previous mouse positions
    var compare = function(ev,$el,s,cfg) {
        // compare mouse positions to see if pointer has slowed enough to trigger `over` function
        if ( math.sqrt( (s.px-cx)*(s.px-cx) + (s.py-cy)*(s.py-cy) ) < cfg.sensitivity ) {
            $el.off(s.event,track);
            delete s.timeoutid;
            // set hoverintent state as active for this element (permits `out` handler to trigger)
            s.isactive = true;
            // overwrite old mouseenter event coordinates with most recent pointer position
            ev.pagex = cx; ev.pagey = cy;
            // clear coordinate data from state object
            delete s.px; delete s.py;
            return cfg.over.apply($el[0],[ev]);
        } else {
            // set previous coordinates for next comparison
            s.px = cx; s.py = cy;
            // use self-calling timeout, guarantees intervals are spaced out properly (avoids javascript timer bugs)
            s.timeoutid = settimeout( function(){compare(ev, $el, s, cfg);} , cfg.interval );
        }
    };

    // triggers given `out` function at configured `timeout` after a mouseleave and clears state
    var delay = function(ev,$el,s,out) {
        var data = $el.data('hoverintent');
        if (data) {
            delete data[s.id];
        }
        return out.apply($el[0],[ev]);
    };

    // checks if `value` is a function
    var isfunction = function(value) {
        return typeof value === 'function';
    };

    $.fn.hoverintent = function(handlerin,handlerout,selector) {
        // instance id, used as a key to store and retrieve state information on an element
        var instanceid = instance_count++;

        // extend the default configuration and parse parameters
        var cfg = $.extend({}, _cfg);
        if ( $.isplainobject(handlerin) ) {
            cfg = $.extend(cfg, handlerin);
            if ( !isfunction(cfg.out) ) {
                cfg.out = cfg.over;
            }
        } else if ( isfunction(handlerout) ) {
            cfg = $.extend(cfg, { over: handlerin, out: handlerout, selector: selector } );
        } else {
            cfg = $.extend(cfg, { over: handlerin, out: handlerin, selector: handlerout } );
        }

        // a private function for handling mouse 'hovering'
        var handlehover = function(e) {
            // cloned event to pass to handlers (copy required for event object to be passed in ie)
            var ev = $.extend({},e);

            // the current target of the mouse event, wrapped in a jquery object
            var $el = $(this);

            // read hoverintent data from element (or initialize if not present)
            var hoverintentdata = $el.data('hoverintent');
            if (!hoverintentdata) { $el.data('hoverintent', (hoverintentdata = {})); }

            // read per-instance state from element (or initialize if not present)
            var state = hoverintentdata[instanceid];
            if (!state) { hoverintentdata[instanceid] = state = { id: instanceid }; }

            // state properties:
            // id = instance id, used to clean up data
            // timeoutid = timeout id, reused for tracking mouse position and delaying "out" handler
            // isactive = plugin state, true after `over` is called just until `out` is called
            // px, py = previously-measured pointer coordinates, updated at each polling interval
            // event = string representing the namespaced event used for mouse tracking

            // clear any existing timeout
            if (state.timeoutid) { state.timeoutid = cleartimeout(state.timeoutid); }

            // namespaced event used to register and unregister mousemove tracking
            var mousemove = state.event = 'mousemove.hoverintent.hoverintent'+instanceid;

            // handle the event, based on its type
            if (e.type === 'mouseenter') {
                // do nothing if already active
                if (state.isactive) { return; }
                // set "previous" x and y position based on initial entry point
                state.px = ev.pagex; state.py = ev.pagey;
                // update "current" x and y position based on mousemove
                $el.off(mousemove,track).on(mousemove,track);
                // start polling interval (self-calling timeout) to compare mouse coordinates over time
                state.timeoutid = settimeout( function(){compare(ev,$el,state,cfg);} , cfg.interval );
            } else { // "mouseleave"
                // do nothing if not already active
                if (!state.isactive) { return; }
                // unbind expensive mousemove event
                $el.off(mousemove,track);
                // if hoverintent state is true, then call the mouseout function after the specified delay
                state.timeoutid = settimeout( function(){delay(ev,$el,state,cfg.out);} , cfg.timeout );
            }
        };

        // listen for mouseenter and mouseleave
        return this.on({'mouseenter.hoverintent':handlehover,'mouseleave.hoverintent':handlehover}, cfg.selector);
    };
});


