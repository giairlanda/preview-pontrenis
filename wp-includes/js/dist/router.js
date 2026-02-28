/******/ (() => { // webpackbootstrap
/******/ 	"use strict";
/******/ 	// the require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					object.defineproperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasownproperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (object.prototype.hasownproperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esmodule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof symbol !== 'undefined' && symbol.tostringtag) {
/******/ 				object.defineproperty(exports, symbol.tostringtag, { value: 'module' });
/******/ 			}
/******/ 			object.defineproperty(exports, '__esmodule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// esm compat flag
__webpack_require__.r(__webpack_exports__);

// exports
__webpack_require__.d(__webpack_exports__, {
  privateapis: () => (/* reexport */ privateapis)
});

;// external "reactjsxruntime"
const external_reactjsxruntime_namespaceobject = window["reactjsxruntime"];
;// ./node_modules/route-recognizer/dist/route-recognizer.es.js
var createobject = object.create;
function createmap() {
    var map = createobject(null);
    map["__"] = undefined;
    delete map["__"];
    return map;
}

var target = function target(path, matcher, delegate) {
    this.path = path;
    this.matcher = matcher;
    this.delegate = delegate;
};
target.prototype.to = function to (target, callback) {
    var delegate = this.delegate;
    if (delegate && delegate.willaddroute) {
        target = delegate.willaddroute(this.matcher.target, target);
    }
    this.matcher.add(this.path, target);
    if (callback) {
        if (callback.length === 0) {
            throw new error("you must have an argument in the function passed to `to`");
        }
        this.matcher.addchild(this.path, target, callback, this.delegate);
    }
};
var matcher = function matcher(target) {
    this.routes = createmap();
    this.children = createmap();
    this.target = target;
};
matcher.prototype.add = function add (path, target) {
    this.routes[path] = target;
};
matcher.prototype.addchild = function addchild (path, target, callback, delegate) {
    var matcher = new matcher(target);
    this.children[path] = matcher;
    var match = generatematch(path, matcher, delegate);
    if (delegate && delegate.contextentered) {
        delegate.contextentered(target, match);
    }
    callback(match);
};
function generatematch(startingpath, matcher, delegate) {
    function match(path, callback) {
        var fullpath = startingpath + path;
        if (callback) {
            callback(generatematch(fullpath, matcher, delegate));
        }
        else {
            return new target(fullpath, matcher, delegate);
        }
    }
    
    return match;
}
function addroute(routearray, path, handler) {
    var len = 0;
    for (var i = 0; i < routearray.length; i++) {
        len += routearray[i].path.length;
    }
    path = path.substr(len);
    var route = { path: path, handler: handler };
    routearray.push(route);
}
function eachroute(baseroute, matcher, callback, binding) {
    var routes = matcher.routes;
    var paths = object.keys(routes);
    for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        var routearray = baseroute.slice();
        addroute(routearray, path, routes[path]);
        var nested = matcher.children[path];
        if (nested) {
            eachroute(routearray, nested, callback, binding);
        }
        else {
            callback.call(binding, routearray);
        }
    }
}
var map = function (callback, addroutecallback) {
    var matcher = new matcher();
    callback(generatematch("", matcher, this.delegate));
    eachroute([], matcher, function (routes) {
        if (addroutecallback) {
            addroutecallback(this, routes);
        }
        else {
            this.add(routes);
        }
    }, this);
};

// normalizes percent-encoded values in `path` to upper-case and decodes percent-encoded
// values that are not reserved (i.e., unicode characters, emoji, etc). the reserved
// chars are "/" and "%".
// safe to call multiple times on the same path.
// normalizes percent-encoded values in `path` to upper-case and decodes percent-encoded
function normalizepath(path) {
    return path.split("/")
        .map(normalizesegment)
        .join("/");
}
// we want to ensure the characters "%" and "/" remain in percent-encoded
// form when normalizing paths, so replace them with their encoded form after
// decoding the rest of the path
var segment_reserved_chars = /%|\//g;
function normalizesegment(segment) {
    if (segment.length < 3 || segment.indexof("%") === -1)
        { return segment; }
    return decodeuricomponent(segment).replace(segment_reserved_chars, encodeuricomponent);
}
// we do not want to encode these characters when generating dynamic path segments
// see https://tools.ietf.org/html/rfc3986#section-3.3
// sub-delims: "!", "$", "&", "'", "(", ")", "*", "+", ",", ";", "="
// others allowed by rfc 3986: ":", "@"
//
// first encode the entire path segment, then decode any of the encoded special chars.
//
// the chars "!", "'", "(", ")", "*" do not get changed by `encodeuricomponent`,
// so the possible encoded chars are:
// ['%24', '%26', '%2b', '%2c', '%3b', '%3d', '%3a', '%40'].
var path_segment_encodings = /%(?:2(?:4|6|b|c)|3(?:b|d|a)|40)/g;
function encodepathsegment(str) {
    return encodeuricomponent(str).replace(path_segment_encodings, decodeuricomponent);
}

var escaperegex = /(\/|\.|\*|\+|\?|\||\(|\)|\[|\]|\{|\}|\\)/g;
var isarray = array.isarray;
var route_recognizer_es_hasownproperty = object.prototype.hasownproperty;
function getparam(params, key) {
    if (typeof params !== "object" || params === null) {
        throw new error("you must pass an object as the second argument to `generate`.");
    }
    if (!route_recognizer_es_hasownproperty.call(params, key)) {
        throw new error("you must provide param `" + key + "` to `generate`.");
    }
    var value = params[key];
    var str = typeof value === "string" ? value : "" + value;
    if (str.length === 0) {
        throw new error("you must provide a param `" + key + "`.");
    }
    return str;
}
var eachchar = [];
eachchar[0 /* static */] = function (segment, currentstate) {
    var state = currentstate;
    var value = segment.value;
    for (var i = 0; i < value.length; i++) {
        var ch = value.charcodeat(i);
        state = state.put(ch, false, false);
    }
    return state;
};
eachchar[1 /* dynamic */] = function (_, currentstate) {
    return currentstate.put(47 /* slash */, true, true);
};
eachchar[2 /* star */] = function (_, currentstate) {
    return currentstate.put(-1 /* any */, false, true);
};
eachchar[4 /* epsilon */] = function (_, currentstate) {
    return currentstate;
};
var regex = [];
regex[0 /* static */] = function (segment) {
    return segment.value.replace(escaperegex, "\\$1");
};
regex[1 /* dynamic */] = function () {
    return "([^/]+)";
};
regex[2 /* star */] = function () {
    return "(.+)";
};
regex[4 /* epsilon */] = function () {
    return "";
};
var generate = [];
generate[0 /* static */] = function (segment) {
    return segment.value;
};
generate[1 /* dynamic */] = function (segment, params) {
    var value = getparam(params, segment.value);
    if (routerecognizer.encode_and_decode_path_segments) {
        return encodepathsegment(value);
    }
    else {
        return value;
    }
};
generate[2 /* star */] = function (segment, params) {
    return getparam(params, segment.value);
};
generate[4 /* epsilon */] = function () {
    return "";
};
var emptyobject = object.freeze({});
var emptyarray = object.freeze([]);
// the `names` will be populated with the paramter name for each dynamic/star
// segment. `shoulddecodes` will be populated with a boolean for each dyanamic/star
// segment, indicating whether it should be decoded during recognition.
function parse(segments, route, types) {
    // normalize route as not starting with a "/". recognition will
    // also normalize.
    if (route.length > 0 && route.charcodeat(0) === 47 /* slash */) {
        route = route.substr(1);
    }
    var parts = route.split("/");
    var names = undefined;
    var shoulddecodes = undefined;
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        var flags = 0;
        var type = 0;
        if (part === "") {
            type = 4 /* epsilon */;
        }
        else if (part.charcodeat(0) === 58 /* colon */) {
            type = 1 /* dynamic */;
        }
        else if (part.charcodeat(0) === 42 /* star */) {
            type = 2 /* star */;
        }
        else {
            type = 0 /* static */;
        }
        flags = 2 << type;
        if (flags & 12 /* named */) {
            part = part.slice(1);
            names = names || [];
            names.push(part);
            shoulddecodes = shoulddecodes || [];
            shoulddecodes.push((flags & 4 /* decoded */) !== 0);
        }
        if (flags & 14 /* counted */) {
            types[type]++;
        }
        segments.push({
            type: type,
            value: normalizesegment(part)
        });
    }
    return {
        names: names || emptyarray,
        shoulddecodes: shoulddecodes || emptyarray,
    };
}
function isequalcharspec(spec, char, negate) {
    return spec.char === char && spec.negate === negate;
}
// a state has a character specification and (`charspec`) and a list of possible
// subsequent states (`nextstates`).
//
// if a state is an accepting state, it will also have several additional
// properties:
//
// * `regex`: a regular expression that is used to extract parameters from paths
//   that reached this accepting state.
// * `handlers`: information on how to convert the list of captures into calls
//   to registered handlers with the specified parameters
// * `types`: how many static, dynamic or star segments in this route. used to
//   decide which route to use if multiple registered routes match a path.
//
// currently, state is implemented naively by looping over `nextstates` and
// comparing a character specification against a character. a more efficient
// implementation would use a hash of keys pointing at one or more next states.
var state = function state(states, id, char, negate, repeat) {
    this.states = states;
    this.id = id;
    this.char = char;
    this.negate = negate;
    this.nextstates = repeat ? id : null;
    this.pattern = "";
    this._regex = undefined;
    this.handlers = undefined;
    this.types = undefined;
};
state.prototype.regex = function regex$1 () {
    if (!this._regex) {
        this._regex = new regexp(this.pattern);
    }
    return this._regex;
};
state.prototype.get = function get (char, negate) {
        var this$1 = this;

    var nextstates = this.nextstates;
    if (nextstates === null)
        { return; }
    if (isarray(nextstates)) {
        for (var i = 0; i < nextstates.length; i++) {
            var child = this$1.states[nextstates[i]];
            if (isequalcharspec(child, char, negate)) {
                return child;
            }
        }
    }
    else {
        var child$1 = this.states[nextstates];
        if (isequalcharspec(child$1, char, negate)) {
            return child$1;
        }
    }
};
state.prototype.put = function put (char, negate, repeat) {
    var state;
    // if the character specification already exists in a child of the current
    // state, just return that state.
    if (state = this.get(char, negate)) {
        return state;
    }
    // make a new state for the character spec
    var states = this.states;
    state = new state(states, states.length, char, negate, repeat);
    states[states.length] = state;
    // insert the new state as a child of the current state
    if (this.nextstates == null) {
        this.nextstates = state.id;
    }
    else if (isarray(this.nextstates)) {
        this.nextstates.push(state.id);
    }
    else {
        this.nextstates = [this.nextstates, state.id];
    }
    // return the new state
    return state;
};
// find a list of child states matching the next character
state.prototype.match = function match (ch) {
        var this$1 = this;

    var nextstates = this.nextstates;
    if (!nextstates)
        { return []; }
    var returned = [];
    if (isarray(nextstates)) {
        for (var i = 0; i < nextstates.length; i++) {
            var child = this$1.states[nextstates[i]];
            if (ismatch(child, ch)) {
                returned.push(child);
            }
        }
    }
    else {
        var child$1 = this.states[nextstates];
        if (ismatch(child$1, ch)) {
            returned.push(child$1);
        }
    }
    return returned;
};
function ismatch(spec, char) {
    return spec.negate ? spec.char !== char && spec.char !== -1 /* any */ : spec.char === char || spec.char === -1 /* any */;
}
// this is a somewhat naive strategy, but should work in a lot of cases
// a better strategy would properly resolve /posts/:id/new and /posts/edit/:id.
//
// this strategy generally prefers more static and less dynamic matching.
// specifically, it
//
//  * prefers fewer stars to more, then
//  * prefers using stars for less of the match to more, then
//  * prefers fewer dynamic segments to more, then
//  * prefers more static segments to more
function sortsolutions(states) {
    return states.sort(function (a, b) {
        var ref = a.types || [0, 0, 0];
        var astatics = ref[0];
        var adynamics = ref[1];
        var astars = ref[2];
        var ref$1 = b.types || [0, 0, 0];
        var bstatics = ref$1[0];
        var bdynamics = ref$1[1];
        var bstars = ref$1[2];
        if (astars !== bstars) {
            return astars - bstars;
        }
        if (astars) {
            if (astatics !== bstatics) {
                return bstatics - astatics;
            }
            if (adynamics !== bdynamics) {
                return bdynamics - adynamics;
            }
        }
        if (adynamics !== bdynamics) {
            return adynamics - bdynamics;
        }
        if (astatics !== bstatics) {
            return bstatics - astatics;
        }
        return 0;
    });
}
function recognizechar(states, ch) {
    var nextstates = [];
    for (var i = 0, l = states.length; i < l; i++) {
        var state = states[i];
        nextstates = nextstates.concat(state.match(ch));
    }
    return nextstates;
}
var recognizeresults = function recognizeresults(queryparams) {
    this.length = 0;
    this.queryparams = queryparams || {};
};

recognizeresults.prototype.splice = array.prototype.splice;
recognizeresults.prototype.slice = array.prototype.slice;
recognizeresults.prototype.push = array.prototype.push;
function findhandler(state, originalpath, queryparams) {
    var handlers = state.handlers;
    var regex = state.regex();
    if (!regex || !handlers)
        { throw new error("state not initialized"); }
    var captures = originalpath.match(regex);
    var currentcapture = 1;
    var result = new recognizeresults(queryparams);
    result.length = handlers.length;
    for (var i = 0; i < handlers.length; i++) {
        var handler = handlers[i];
        var names = handler.names;
        var shoulddecodes = handler.shoulddecodes;
        var params = emptyobject;
        var isdynamic = false;
        if (names !== emptyarray && shoulddecodes !== emptyarray) {
            for (var j = 0; j < names.length; j++) {
                isdynamic = true;
                var name = names[j];
                var capture = captures && captures[currentcapture++];
                if (params === emptyobject) {
                    params = {};
                }
                if (routerecognizer.encode_and_decode_path_segments && shoulddecodes[j]) {
                    params[name] = capture && decodeuricomponent(capture);
                }
                else {
                    params[name] = capture;
                }
            }
        }
        result[i] = {
            handler: handler.handler,
            params: params,
            isdynamic: isdynamic
        };
    }
    return result;
}
function decodequeryparampart(part) {
    // http://www.w3.org/tr/html401/interact/forms.html#h-17.13.4.1
    part = part.replace(/\+/gm, "%20");
    var result;
    try {
        result = decodeuricomponent(part);
    }
    catch (error) {
        result = "";
    }
    return result;
}
var routerecognizer = function routerecognizer() {
    this.names = createmap();
    var states = [];
    var state = new state(states, 0, -1 /* any */, true, false);
    states[0] = state;
    this.states = states;
    this.rootstate = state;
};
routerecognizer.prototype.add = function add (routes, options) {
    var currentstate = this.rootstate;
    var pattern = "^";
    var types = [0, 0, 0];
    var handlers = new array(routes.length);
    var allsegments = [];
    var isempty = true;
    var j = 0;
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        var ref = parse(allsegments, route.path, types);
            var names = ref.names;
            var shoulddecodes = ref.shoulddecodes;
        // preserve j so it points to the start of newly added segments
        for (; j < allsegments.length; j++) {
            var segment = allsegments[j];
            if (segment.type === 4 /* epsilon */) {
                continue;
            }
            isempty = false;
            // add a "/" for the new segment
            currentstate = currentstate.put(47 /* slash */, false, false);
            pattern += "/";
            // add a representation of the segment to the nfa and regex
            currentstate = eachchar[segment.type](segment, currentstate);
            pattern += regex[segment.type](segment);
        }
        handlers[i] = {
            handler: route.handler,
            names: names,
            shoulddecodes: shoulddecodes
        };
    }
    if (isempty) {
        currentstate = currentstate.put(47 /* slash */, false, false);
        pattern += "/";
    }
    currentstate.handlers = handlers;
    currentstate.pattern = pattern + "$";
    currentstate.types = types;
    var name;
    if (typeof options === "object" && options !== null && options.as) {
        name = options.as;
    }
    if (name) {
        // if (this.names[name]) {
        //   throw new error("you may not add a duplicate route named `" + name + "`.");
        // }
        this.names[name] = {
            segments: allsegments,
            handlers: handlers
        };
    }
};
routerecognizer.prototype.handlersfor = function handlersfor (name) {
    var route = this.names[name];
    if (!route) {
        throw new error("there is no route named " + name);
    }
    var result = new array(route.handlers.length);
    for (var i = 0; i < route.handlers.length; i++) {
        var handler = route.handlers[i];
        result[i] = handler;
    }
    return result;
};
routerecognizer.prototype.hasroute = function hasroute (name) {
    return !!this.names[name];
};
routerecognizer.prototype.generate = function generate$1 (name, params) {
    var route = this.names[name];
    var output = "";
    if (!route) {
        throw new error("there is no route named " + name);
    }
    var segments = route.segments;
    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];
        if (segment.type === 4 /* epsilon */) {
            continue;
        }
        output += "/";
        output += generate[segment.type](segment, params);
    }
    if (output.charat(0) !== "/") {
        output = "/" + output;
    }
    if (params && params.queryparams) {
        output += this.generatequerystring(params.queryparams);
    }
    return output;
};
routerecognizer.prototype.generatequerystring = function generatequerystring (params) {
    var pairs = [];
    var keys = object.keys(params);
    keys.sort();
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = params[key];
        if (value == null) {
            continue;
        }
        var pair = encodeuricomponent(key);
        if (isarray(value)) {
            for (var j = 0; j < value.length; j++) {
                var arraypair = key + "[]" + "=" + encodeuricomponent(value[j]);
                pairs.push(arraypair);
            }
        }
        else {
            pair += "=" + encodeuricomponent(value);
            pairs.push(pair);
        }
    }
    if (pairs.length === 0) {
        return "";
    }
    return "?" + pairs.join("&");
};
routerecognizer.prototype.parsequerystring = function parsequerystring (querystring) {
    var pairs = querystring.split("&");
    var queryparams = {};
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("="), key = decodequeryparampart(pair[0]), keylength = key.length, isarray = false, value = (void 0);
        if (pair.length === 1) {
            value = "true";
        }
        else {
            // handle arrays
            if (keylength > 2 && key.slice(keylength - 2) === "[]") {
                isarray = true;
                key = key.slice(0, keylength - 2);
                if (!queryparams[key]) {
                    queryparams[key] = [];
                }
            }
            value = pair[1] ? decodequeryparampart(pair[1]) : "";
        }
        if (isarray) {
            queryparams[key].push(value);
        }
        else {
            queryparams[key] = value;
        }
    }
    return queryparams;
};
routerecognizer.prototype.recognize = function recognize (path) {
    var results;
    var states = [this.rootstate];
    var queryparams = {};
    var isslashdropped = false;
    var hashstart = path.indexof("#");
    if (hashstart !== -1) {
        path = path.substr(0, hashstart);
    }
    var querystart = path.indexof("?");
    if (querystart !== -1) {
        var querystring = path.substr(querystart + 1, path.length);
        path = path.substr(0, querystart);
        queryparams = this.parsequerystring(querystring);
    }
    if (path.charat(0) !== "/") {
        path = "/" + path;
    }
    var originalpath = path;
    if (routerecognizer.encode_and_decode_path_segments) {
        path = normalizepath(path);
    }
    else {
        path = decodeuri(path);
        originalpath = decodeuri(originalpath);
    }
    var pathlen = path.length;
    if (pathlen > 1 && path.charat(pathlen - 1) === "/") {
        path = path.substr(0, pathlen - 1);
        originalpath = originalpath.substr(0, originalpath.length - 1);
        isslashdropped = true;
    }
    for (var i = 0; i < path.length; i++) {
        states = recognizechar(states, path.charcodeat(i));
        if (!states.length) {
            break;
        }
    }
    var solutions = [];
    for (var i$1 = 0; i$1 < states.length; i$1++) {
        if (states[i$1].handlers) {
            solutions.push(states[i$1]);
        }
    }
    states = sortsolutions(solutions);
    var state = solutions[0];
    if (state && state.handlers) {
        // if a trailing slash was dropped and a star segment is the last segment
        // specified, put the trailing slash back
        if (isslashdropped && state.pattern && state.pattern.slice(-5) === "(.+)$") {
            originalpath = originalpath + "/";
        }
        results = findhandler(state, originalpath, queryparams);
    }
    return results;
};
routerecognizer.version = "0.3.4";
// set to false to opt-out of encoding and decoding path segments.
// see https://github.com/tildeio/route-recognizer/pull/55
routerecognizer.encode_and_decode_path_segments = true;
routerecognizer.normalizer = {
    normalizesegment: normalizesegment, normalizepath: normalizepath, encodepathsegment: encodepathsegment
};
routerecognizer.prototype.map = map;

/* harmony default export */ const route_recognizer_es = (routerecognizer);


;// ./node_modules/@babel/runtime/helpers/esm/extends.js
function extends_extends() {
  return extends_extends = object.assign ? object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasownproperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, extends_extends.apply(null, arguments);
}

;// ./node_modules/history/index.js


/**
 * actions represent the type of change to a location value.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#action
 */
var action;

(function (action) {
  /**
   * a pop indicates a change to an arbitrary index in the history stack, such
   * as a back or forward navigation. it does not describe the direction of the
   * navigation, only that the current index changed.
   *
   * note: this is the default action for newly created history objects.
   */
  action["pop"] = "pop";
  /**
   * a push indicates a new entry being added to the history stack, such as when
   * a link is clicked and a new page loads. when this happens, all subsequent
   * entries in the stack are lost.
   */

  action["push"] = "push";
  /**
   * a replace indicates the entry at the current index in the history stack
   * being replaced by a new one.
   */

  action["replace"] = "replace";
})(action || (action = {}));

var readonly =  false ? 0 : function (obj) {
  return obj;
};

function warning(cond, message) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== 'undefined') console.warn(message);

    try {
      // welcome to debugging history!
      //
      // this error is thrown as a convenience so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your javascript debugger.
      throw new error(message); // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

var beforeunloadeventtype = 'beforeunload';
var hashchangeeventtype = 'hashchange';
var popstateeventtype = 'popstate';
/**
 * browser history stores the location in regular urls. this is the standard for
 * most web apps, but it requires some configuration on the server to ensure you
 * serve the same app at multiple urls.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createbrowserhistory
 */

function createbrowserhistory(options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$window = _options.window,
      window = _options$window === void 0 ? document.defaultview : _options$window;
  var globalhistory = window.history;

  function getindexandlocation() {
    var _window$location = window.location,
        pathname = _window$location.pathname,
        search = _window$location.search,
        hash = _window$location.hash;
    var state = globalhistory.state || {};
    return [state.idx, readonly({
      pathname: pathname,
      search: search,
      hash: hash,
      state: state.usr || null,
      key: state.key || 'default'
    })];
  }

  var blockedpoptx = null;

  function handlepop() {
    if (blockedpoptx) {
      blockers.call(blockedpoptx);
      blockedpoptx = null;
    } else {
      var nextaction = action.pop;

      var _getindexandlocation = getindexandlocation(),
          nextindex = _getindexandlocation[0],
          nextlocation = _getindexandlocation[1];

      if (blockers.length) {
        if (nextindex != null) {
          var delta = index - nextindex;

          if (delta) {
            // revert the pop
            blockedpoptx = {
              action: nextaction,
              location: nextlocation,
              retry: function retry() {
                go(delta * -1);
              }
            };
            go(delta);
          }
        } else {
          // trying to pop to a location with no index. we did not create
          // this location, so we can't effectively block the navigation.
           false ? 0 : void 0;
        }
      } else {
        applytx(nextaction);
      }
    }
  }

  window.addeventlistener(popstateeventtype, handlepop);
  var action = action.pop;

  var _getindexandlocation2 = getindexandlocation(),
      index = _getindexandlocation2[0],
      location = _getindexandlocation2[1];

  var listeners = createevents();
  var blockers = createevents();

  if (index == null) {
    index = 0;
    globalhistory.replacestate(extends_extends({}, globalhistory.state, {
      idx: index
    }), '');
  }

  function createhref(to) {
    return typeof to === 'string' ? to : createpath(to);
  } // state defaults to `null` because `window.history.state` does


  function getnextlocation(to, state) {
    if (state === void 0) {
      state = null;
    }

    return readonly(extends_extends({
      pathname: location.pathname,
      hash: '',
      search: ''
    }, typeof to === 'string' ? parsepath(to) : to, {
      state: state,
      key: createkey()
    }));
  }

  function gethistorystateandurl(nextlocation, index) {
    return [{
      usr: nextlocation.state,
      key: nextlocation.key,
      idx: index
    }, createhref(nextlocation)];
  }

  function allowtx(action, location, retry) {
    return !blockers.length || (blockers.call({
      action: action,
      location: location,
      retry: retry
    }), false);
  }

  function applytx(nextaction) {
    action = nextaction;

    var _getindexandlocation3 = getindexandlocation();

    index = _getindexandlocation3[0];
    location = _getindexandlocation3[1];
    listeners.call({
      action: action,
      location: location
    });
  }

  function push(to, state) {
    var nextaction = action.push;
    var nextlocation = getnextlocation(to, state);

    function retry() {
      push(to, state);
    }

    if (allowtx(nextaction, nextlocation, retry)) {
      var _gethistorystateandur = gethistorystateandurl(nextlocation, index + 1),
          historystate = _gethistorystateandur[0],
          url = _gethistorystateandur[1]; // todo: support forced reloading
      // try...catch because ios limits us to 100 pushstate calls :/


      try {
        globalhistory.pushstate(historystate, '', url);
      } catch (error) {
        // they are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applytx(nextaction);
    }
  }

  function replace(to, state) {
    var nextaction = action.replace;
    var nextlocation = getnextlocation(to, state);

    function retry() {
      replace(to, state);
    }

    if (allowtx(nextaction, nextlocation, retry)) {
      var _gethistorystateandur2 = gethistorystateandurl(nextlocation, index),
          historystate = _gethistorystateandur2[0],
          url = _gethistorystateandur2[1]; // todo: support forced reloading


      globalhistory.replacestate(historystate, '', url);
      applytx(nextaction);
    }
  }

  function go(delta) {
    globalhistory.go(delta);
  }

  var history = {
    get action() {
      return action;
    },

    get location() {
      return location;
    },

    createhref: createhref,
    push: push,
    replace: replace,
    go: go,
    back: function back() {
      go(-1);
    },
    forward: function forward() {
      go(1);
    },
    listen: function listen(listener) {
      return listeners.push(listener);
    },
    block: function block(blocker) {
      var unblock = blockers.push(blocker);

      if (blockers.length === 1) {
        window.addeventlistener(beforeunloadeventtype, promptbeforeunload);
      }

      return function () {
        unblock(); // remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // see https://html.spec.whatwg.org/#unloading-documents

        if (!blockers.length) {
          window.removeeventlistener(beforeunloadeventtype, promptbeforeunload);
        }
      };
    }
  };
  return history;
}
/**
 * hash history stores the location in window.location.hash. this makes it ideal
 * for situations where you don't want to send the location to the server for
 * some reason, either because you do cannot configure it or the url space is
 * reserved for something else.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createhashhistory
 */

function createhashhistory(options) {
  if (options === void 0) {
    options = {};
  }

  var _options2 = options,
      _options2$window = _options2.window,
      window = _options2$window === void 0 ? document.defaultview : _options2$window;
  var globalhistory = window.history;

  function getindexandlocation() {
    var _parsepath = parsepath(window.location.hash.substr(1)),
        _parsepath$pathname = _parsepath.pathname,
        pathname = _parsepath$pathname === void 0 ? '/' : _parsepath$pathname,
        _parsepath$search = _parsepath.search,
        search = _parsepath$search === void 0 ? '' : _parsepath$search,
        _parsepath$hash = _parsepath.hash,
        hash = _parsepath$hash === void 0 ? '' : _parsepath$hash;

    var state = globalhistory.state || {};
    return [state.idx, readonly({
      pathname: pathname,
      search: search,
      hash: hash,
      state: state.usr || null,
      key: state.key || 'default'
    })];
  }

  var blockedpoptx = null;

  function handlepop() {
    if (blockedpoptx) {
      blockers.call(blockedpoptx);
      blockedpoptx = null;
    } else {
      var nextaction = action.pop;

      var _getindexandlocation4 = getindexandlocation(),
          nextindex = _getindexandlocation4[0],
          nextlocation = _getindexandlocation4[1];

      if (blockers.length) {
        if (nextindex != null) {
          var delta = index - nextindex;

          if (delta) {
            // revert the pop
            blockedpoptx = {
              action: nextaction,
              location: nextlocation,
              retry: function retry() {
                go(delta * -1);
              }
            };
            go(delta);
          }
        } else {
          // trying to pop to a location with no index. we did not create
          // this location, so we can't effectively block the navigation.
           false ? 0 : void 0;
        }
      } else {
        applytx(nextaction);
      }
    }
  }

  window.addeventlistener(popstateeventtype, handlepop); // popstate does not fire on hashchange in ie 11 and old (trident) edge
  // https://developer.mozilla.org/de/docs/web/api/window/popstate_event

  window.addeventlistener(hashchangeeventtype, function () {
    var _getindexandlocation5 = getindexandlocation(),
        nextlocation = _getindexandlocation5[1]; // ignore extraneous hashchange events.


    if (createpath(nextlocation) !== createpath(location)) {
      handlepop();
    }
  });
  var action = action.pop;

  var _getindexandlocation6 = getindexandlocation(),
      index = _getindexandlocation6[0],
      location = _getindexandlocation6[1];

  var listeners = createevents();
  var blockers = createevents();

  if (index == null) {
    index = 0;
    globalhistory.replacestate(_extends({}, globalhistory.state, {
      idx: index
    }), '');
  }

  function getbasehref() {
    var base = document.queryselector('base');
    var href = '';

    if (base && base.getattribute('href')) {
      var url = window.location.href;
      var hashindex = url.indexof('#');
      href = hashindex === -1 ? url : url.slice(0, hashindex);
    }

    return href;
  }

  function createhref(to) {
    return getbasehref() + '#' + (typeof to === 'string' ? to : createpath(to));
  }

  function getnextlocation(to, state) {
    if (state === void 0) {
      state = null;
    }

    return readonly(_extends({
      pathname: location.pathname,
      hash: '',
      search: ''
    }, typeof to === 'string' ? parsepath(to) : to, {
      state: state,
      key: createkey()
    }));
  }

  function gethistorystateandurl(nextlocation, index) {
    return [{
      usr: nextlocation.state,
      key: nextlocation.key,
      idx: index
    }, createhref(nextlocation)];
  }

  function allowtx(action, location, retry) {
    return !blockers.length || (blockers.call({
      action: action,
      location: location,
      retry: retry
    }), false);
  }

  function applytx(nextaction) {
    action = nextaction;

    var _getindexandlocation7 = getindexandlocation();

    index = _getindexandlocation7[0];
    location = _getindexandlocation7[1];
    listeners.call({
      action: action,
      location: location
    });
  }

  function push(to, state) {
    var nextaction = action.push;
    var nextlocation = getnextlocation(to, state);

    function retry() {
      push(to, state);
    }

     false ? 0 : void 0;

    if (allowtx(nextaction, nextlocation, retry)) {
      var _gethistorystateandur3 = gethistorystateandurl(nextlocation, index + 1),
          historystate = _gethistorystateandur3[0],
          url = _gethistorystateandur3[1]; // todo: support forced reloading
      // try...catch because ios limits us to 100 pushstate calls :/


      try {
        globalhistory.pushstate(historystate, '', url);
      } catch (error) {
        // they are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applytx(nextaction);
    }
  }

  function replace(to, state) {
    var nextaction = action.replace;
    var nextlocation = getnextlocation(to, state);

    function retry() {
      replace(to, state);
    }

     false ? 0 : void 0;

    if (allowtx(nextaction, nextlocation, retry)) {
      var _gethistorystateandur4 = gethistorystateandurl(nextlocation, index),
          historystate = _gethistorystateandur4[0],
          url = _gethistorystateandur4[1]; // todo: support forced reloading


      globalhistory.replacestate(historystate, '', url);
      applytx(nextaction);
    }
  }

  function go(delta) {
    globalhistory.go(delta);
  }

  var history = {
    get action() {
      return action;
    },

    get location() {
      return location;
    },

    createhref: createhref,
    push: push,
    replace: replace,
    go: go,
    back: function back() {
      go(-1);
    },
    forward: function forward() {
      go(1);
    },
    listen: function listen(listener) {
      return listeners.push(listener);
    },
    block: function block(blocker) {
      var unblock = blockers.push(blocker);

      if (blockers.length === 1) {
        window.addeventlistener(beforeunloadeventtype, promptbeforeunload);
      }

      return function () {
        unblock(); // remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // see https://html.spec.whatwg.org/#unloading-documents

        if (!blockers.length) {
          window.removeeventlistener(beforeunloadeventtype, promptbeforeunload);
        }
      };
    }
  };
  return history;
}
/**
 * memory history stores the current location in memory. it is designed for use
 * in stateful non-browser environments like tests and react native.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#creatememoryhistory
 */

function creatememoryhistory(options) {
  if (options === void 0) {
    options = {};
  }

  var _options3 = options,
      _options3$initialentr = _options3.initialentries,
      initialentries = _options3$initialentr === void 0 ? ['/'] : _options3$initialentr,
      initialindex = _options3.initialindex;
  var entries = initialentries.map(function (entry) {
    var location = readonly(_extends({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: createkey()
    }, typeof entry === 'string' ? parsepath(entry) : entry));
     false ? 0 : void 0;
    return location;
  });
  var index = clamp(initialindex == null ? entries.length - 1 : initialindex, 0, entries.length - 1);
  var action = action.pop;
  var location = entries[index];
  var listeners = createevents();
  var blockers = createevents();

  function createhref(to) {
    return typeof to === 'string' ? to : createpath(to);
  }

  function getnextlocation(to, state) {
    if (state === void 0) {
      state = null;
    }

    return readonly(_extends({
      pathname: location.pathname,
      search: '',
      hash: ''
    }, typeof to === 'string' ? parsepath(to) : to, {
      state: state,
      key: createkey()
    }));
  }

  function allowtx(action, location, retry) {
    return !blockers.length || (blockers.call({
      action: action,
      location: location,
      retry: retry
    }), false);
  }

  function applytx(nextaction, nextlocation) {
    action = nextaction;
    location = nextlocation;
    listeners.call({
      action: action,
      location: location
    });
  }

  function push(to, state) {
    var nextaction = action.push;
    var nextlocation = getnextlocation(to, state);

    function retry() {
      push(to, state);
    }

     false ? 0 : void 0;

    if (allowtx(nextaction, nextlocation, retry)) {
      index += 1;
      entries.splice(index, entries.length, nextlocation);
      applytx(nextaction, nextlocation);
    }
  }

  function replace(to, state) {
    var nextaction = action.replace;
    var nextlocation = getnextlocation(to, state);

    function retry() {
      replace(to, state);
    }

     false ? 0 : void 0;

    if (allowtx(nextaction, nextlocation, retry)) {
      entries[index] = nextlocation;
      applytx(nextaction, nextlocation);
    }
  }

  function go(delta) {
    var nextindex = clamp(index + delta, 0, entries.length - 1);
    var nextaction = action.pop;
    var nextlocation = entries[nextindex];

    function retry() {
      go(delta);
    }

    if (allowtx(nextaction, nextlocation, retry)) {
      index = nextindex;
      applytx(nextaction, nextlocation);
    }
  }

  var history = {
    get index() {
      return index;
    },

    get action() {
      return action;
    },

    get location() {
      return location;
    },

    createhref: createhref,
    push: push,
    replace: replace,
    go: go,
    back: function back() {
      go(-1);
    },
    forward: function forward() {
      go(1);
    },
    listen: function listen(listener) {
      return listeners.push(listener);
    },
    block: function block(blocker) {
      return blockers.push(blocker);
    }
  };
  return history;
} ////////////////////////////////////////////////////////////////////////////////
// utils
////////////////////////////////////////////////////////////////////////////////

function clamp(n, lowerbound, upperbound) {
  return math.min(math.max(n, lowerbound), upperbound);
}

function promptbeforeunload(event) {
  // cancel the event.
  event.preventdefault(); // chrome (and legacy ie) requires returnvalue to be set.

  event.returnvalue = '';
}

function createevents() {
  var handlers = [];
  return {
    get length() {
      return handlers.length;
    },

    push: function push(fn) {
      handlers.push(fn);
      return function () {
        handlers = handlers.filter(function (handler) {
          return handler !== fn;
        });
      };
    },
    call: function call(arg) {
      handlers.foreach(function (fn) {
        return fn && fn(arg);
      });
    }
  };
}

function createkey() {
  return math.random().tostring(36).substr(2, 8);
}
/**
 * creates a string url path from the given pathname, search, and hash components.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createpath
 */


function createpath(_ref) {
  var _ref$pathname = _ref.pathname,
      pathname = _ref$pathname === void 0 ? '/' : _ref$pathname,
      _ref$search = _ref.search,
      search = _ref$search === void 0 ? '' : _ref$search,
      _ref$hash = _ref.hash,
      hash = _ref$hash === void 0 ? '' : _ref$hash;
  if (search && search !== '?') pathname += search.charat(0) === '?' ? search : '?' + search;
  if (hash && hash !== '#') pathname += hash.charat(0) === '#' ? hash : '#' + hash;
  return pathname;
}
/**
 * parses a string url path into its separate pathname, search, and hash components.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#parsepath
 */

function parsepath(path) {
  var parsedpath = {};

  if (path) {
    var hashindex = path.indexof('#');

    if (hashindex >= 0) {
      parsedpath.hash = path.substr(hashindex);
      path = path.substr(0, hashindex);
    }

    var searchindex = path.indexof('?');

    if (searchindex >= 0) {
      parsedpath.search = path.substr(searchindex);
      path = path.substr(0, searchindex);
    }

    if (path) {
      parsedpath.pathname = path;
    }
  }

  return parsedpath;
}



;// external ["wp","element"]
const external_wp_element_namespaceobject = window["wp"]["element"];
;// external ["wp","url"]
const external_wp_url_namespaceobject = window["wp"]["url"];
;// external ["wp","compose"]
const external_wp_compose_namespaceobject = window["wp"]["compose"];
;// ./node_modules/@wordpress/router/build-module/router.js






const router_history = createbrowserhistory();
const routescontext = (0,external_wp_element_namespaceobject.createcontext)(null);
routescontext.displayname = "routescontext";
const configcontext = (0,external_wp_element_namespaceobject.createcontext)({ patharg: "p" });
configcontext.displayname = "configcontext";
const locationmemo = /* @__pure__ */ new weakmap();
function getlocationwithquery() {
  const location = router_history.location;
  let locationwithquery = locationmemo.get(location);
  if (!locationwithquery) {
    locationwithquery = {
      ...location,
      query: object.fromentries(new urlsearchparams(location.search))
    };
    locationmemo.set(location, locationwithquery);
  }
  return locationwithquery;
}
function uselocation() {
  const context = (0,external_wp_element_namespaceobject.usecontext)(routescontext);
  if (!context) {
    throw new error("uselocation must be used within a routerprovider");
  }
  return context;
}
function usehistory() {
  const { patharg, beforenavigate } = (0,external_wp_element_namespaceobject.usecontext)(configcontext);
  const navigate = (0,external_wp_compose_namespaceobject.useevent)(
    async (rawpath, options = {}) => {
      const query = (0,external_wp_url_namespaceobject.getqueryargs)(rawpath);
      const path = (0,external_wp_url_namespaceobject.getpath)("http://domain.com/" + rawpath) ?? "";
      const performpush = () => {
        const result = beforenavigate ? beforenavigate({ path, query }) : { path, query };
        return router_history.push(
          {
            search: (0,external_wp_url_namespaceobject.buildquerystring)({
              [patharg]: result.path,
              ...result.query
            })
          },
          options.state
        );
      };
      const ismediumorbigger = window.matchmedia("(min-width: 782px)").matches;
      if (!ismediumorbigger || !document.startviewtransition || !options.transition) {
        performpush();
        return;
      }
      await new promise((resolve) => {
        const classname = options.transition ?? "";
        document.documentelement.classlist.add(classname);
        const transition = document.startviewtransition(
          () => performpush()
        );
        transition.finished.finally(() => {
          document.documentelement.classlist.remove(classname);
          resolve();
        });
      });
    }
  );
  return (0,external_wp_element_namespaceobject.usememo)(
    () => ({
      navigate,
      back: router_history.back,
      invalidate: () => {
        router_history.replace({
          search: router_history.location.search
        });
      }
    }),
    [navigate]
  );
}
function usematch(location, matcher, patharg, matchresolverargs) {
  const { query: rawquery = {} } = location;
  const [resolvedmatch, setmatch] = (0,external_wp_element_namespaceobject.usestate)();
  (0,external_wp_element_namespaceobject.useeffect)(() => {
    const { [patharg]: path = "/", ...query } = rawquery;
    const ret = matcher.recognize(path)?.[0];
    async function resolvematch(result) {
      const matchedroute = result.handler;
      const resolvefunctions = async (record = {}) => {
        const entries = await promise.all(
          object.entries(record).map(async ([key, value]) => {
            if (typeof value === "function") {
              return [
                key,
                await value({
                  query,
                  params: result.params,
                  ...matchresolverargs
                })
              ];
            }
            return [key, value];
          })
        );
        return object.fromentries(entries);
      };
      const [resolvedareas, resolvedwidths] = await promise.all([
        resolvefunctions(matchedroute.areas),
        resolvefunctions(matchedroute.widths)
      ]);
      setmatch({
        name: matchedroute.name,
        areas: resolvedareas,
        widths: resolvedwidths,
        params: result.params,
        query,
        path: (0,external_wp_url_namespaceobject.addqueryargs)(path, query)
      });
    }
    if (!ret) {
      setmatch({
        name: "404",
        path: (0,external_wp_url_namespaceobject.addqueryargs)(path, query),
        areas: {},
        widths: {},
        query,
        params: {}
      });
    } else {
      resolvematch(ret);
    }
    return () => setmatch(void 0);
  }, [matcher, rawquery, patharg, matchresolverargs]);
  return resolvedmatch;
}
function routerprovider({
  routes,
  patharg,
  beforenavigate,
  children,
  matchresolverargs
}) {
  const location = (0,external_wp_element_namespaceobject.usesyncexternalstore)(
    router_history.listen,
    getlocationwithquery,
    getlocationwithquery
  );
  const matcher = (0,external_wp_element_namespaceobject.usememo)(() => {
    const ret = new route_recognizer_es();
    (routes ?? []).foreach((route) => {
      ret.add([{ path: route.path, handler: route }], {
        as: route.name
      });
    });
    return ret;
  }, [routes]);
  const match = usematch(location, matcher, patharg, matchresolverargs);
  const previousmatch = (0,external_wp_compose_namespaceobject.useprevious)(match);
  const config = (0,external_wp_element_namespaceobject.usememo)(
    () => ({ beforenavigate, patharg }),
    [beforenavigate, patharg]
  );
  const renderedmatch = match || previousmatch;
  if (!renderedmatch) {
    return null;
  }
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(configcontext.provider, { value: config, children: /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)(routescontext.provider, { value: renderedmatch, children }) });
}


;// ./node_modules/@wordpress/router/build-module/link.js




function uselink(to, options = {}) {
  const history = usehistory();
  const { patharg, beforenavigate } = (0,external_wp_element_namespaceobject.usecontext)(configcontext);
  function onclick(event) {
    event?.preventdefault();
    history.navigate(to, options);
  }
  const query = (0,external_wp_url_namespaceobject.getqueryargs)(to);
  const path = (0,external_wp_url_namespaceobject.getpath)("http://domain.com/" + to) ?? "";
  const link = (0,external_wp_element_namespaceobject.usememo)(() => {
    return beforenavigate ? beforenavigate({ path, query }) : { path, query };
  }, [path, query, beforenavigate]);
  const [before] = window.location.href.split("?");
  return {
    href: `${before}?${(0,external_wp_url_namespaceobject.buildquerystring)({
      [patharg]: link.path,
      ...link.query
    })}`,
    onclick
  };
}
function link({
  to,
  options,
  children,
  ...props
}) {
  const { href, onclick } = uselink(to, options);
  return /* @__pure__ */ (0,external_reactjsxruntime_namespaceobject.jsx)("a", { href, onclick, ...props, children });
}


;// external ["wp","privateapis"]
const external_wp_privateapis_namespaceobject = window["wp"]["privateapis"];
;// ./node_modules/@wordpress/router/build-module/lock-unlock.js

const { lock, unlock } = (0,external_wp_privateapis_namespaceobject.__dangerousoptintounstableapisonlyforcoremodules)(
  "i acknowledge private features are not for use in themes or plugins and doing so will break in the next version of wordpress.",
  "@wordpress/router"
);


;// ./node_modules/@wordpress/router/build-module/private-apis.js



const privateapis = {};
lock(privateapis, {
  usehistory: usehistory,
  uselocation: uselocation,
  routerprovider: routerprovider,
  uselink: uselink,
  link: link
});


;// ./node_modules/@wordpress/router/build-module/index.js



(window.wp = window.wp || {}).router = __webpack_exports__;
/******/ })()
;






