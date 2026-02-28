/*!
csslint v1.0.4
copyright (c) 2016 nicole sullivan and nicholas c. zakas. all rights reserved.

permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'software'), to deal
in the software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the software, and to permit persons to whom the software is
furnished to do so, subject to the following conditions:

the above copyright notice and this permission notice shall be included in
all copies or substantial portions of the software.

the software is provided 'as is', without warranty of any kind, express or
implied, including but not limited to the warranties of merchantability,
fitness for a particular purpose and noninfringement. in no event shall the
authors or copyright holders be liable for any claim, damages or other
liability, whether in an action of contract, tort or otherwise, arising from,
out of or in connection with the software or the use or other dealings in
the software.

*/

var csslint = (function(){
  var module = module || {},
      exports = exports || {};

/*!
parser-lib
copyright (c) 2009-2016 nicholas c. zakas. all rights reserved.

permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "software"), to deal
in the software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the software, and to permit persons to whom the software is
furnished to do so, subject to the following conditions:

the above copyright notice and this permission notice shall be included in
all copies or substantial portions of the software.

the software is provided "as is", without warranty of any kind, express or
implied, including but not limited to the warranties of merchantability,
fitness for a particular purpose and noninfringement. in no event shall the
authors or copyright holders be liable for any claim, damages or other
liability, whether in an action of contract, tort or otherwise, arising from,
out of or in connection with the software or the use or other dealings in
the software.
*/
/* version v1.1.0, build time: 6-december-2016 10:31:29 */
var parserlib = (function () {
var require;
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new error("cannot find module '"+o+"'");throw f.code="module_not_found",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* exported colors */

var colors = module.exports = {
    __proto__       :null,
    aliceblue       :"#f0f8ff",
    antiquewhite    :"#faebd7",
    aqua            :"#00ffff",
    aquamarine      :"#7fffd4",
    azure           :"#f0ffff",
    beige           :"#f5f5dc",
    bisque          :"#ffe4c4",
    black           :"#000000",
    blanchedalmond  :"#ffebcd",
    blue            :"#0000ff",
    blueviolet      :"#8a2be2",
    brown           :"#a52a2a",
    burlywood       :"#deb887",
    cadetblue       :"#5f9ea0",
    chartreuse      :"#7fff00",
    chocolate       :"#d2691e",
    coral           :"#ff7f50",
    cornflowerblue  :"#6495ed",
    cornsilk        :"#fff8dc",
    crimson         :"#dc143c",
    cyan            :"#00ffff",
    darkblue        :"#00008b",
    darkcyan        :"#008b8b",
    darkgoldenrod   :"#b8860b",
    darkgray        :"#a9a9a9",
    darkgrey        :"#a9a9a9",
    darkgreen       :"#006400",
    darkkhaki       :"#bdb76b",
    darkmagenta     :"#8b008b",
    darkolivegreen  :"#556b2f",
    darkorange      :"#ff8c00",
    darkorchid      :"#9932cc",
    darkred         :"#8b0000",
    darksalmon      :"#e9967a",
    darkseagreen    :"#8fbc8f",
    darkslateblue   :"#483d8b",
    darkslategray   :"#2f4f4f",
    darkslategrey   :"#2f4f4f",
    darkturquoise   :"#00ced1",
    darkviolet      :"#9400d3",
    deeppink        :"#ff1493",
    deepskyblue     :"#00bfff",
    dimgray         :"#696969",
    dimgrey         :"#696969",
    dodgerblue      :"#1e90ff",
    firebrick       :"#b22222",
    floralwhite     :"#fffaf0",
    forestgreen     :"#228b22",
    fuchsia         :"#ff00ff",
    gainsboro       :"#dcdcdc",
    ghostwhite      :"#f8f8ff",
    gold            :"#ffd700",
    goldenrod       :"#daa520",
    gray            :"#808080",
    grey            :"#808080",
    green           :"#008000",
    greenyellow     :"#adff2f",
    honeydew        :"#f0fff0",
    hotpink         :"#ff69b4",
    indianred       :"#cd5c5c",
    indigo          :"#4b0082",
    ivory           :"#fffff0",
    khaki           :"#f0e68c",
    lavender        :"#e6e6fa",
    lavenderblush   :"#fff0f5",
    lawngreen       :"#7cfc00",
    lemonchiffon    :"#fffacd",
    lightblue       :"#add8e6",
    lightcoral      :"#f08080",
    lightcyan       :"#e0ffff",
    lightgoldenrodyellow  :"#fafad2",
    lightgray       :"#d3d3d3",
    lightgrey       :"#d3d3d3",
    lightgreen      :"#90ee90",
    lightpink       :"#ffb6c1",
    lightsalmon     :"#ffa07a",
    lightseagreen   :"#20b2aa",
    lightskyblue    :"#87cefa",
    lightslategray  :"#778899",
    lightslategrey  :"#778899",
    lightsteelblue  :"#b0c4de",
    lightyellow     :"#ffffe0",
    lime            :"#00ff00",
    limegreen       :"#32cd32",
    linen           :"#faf0e6",
    magenta         :"#ff00ff",
    maroon          :"#800000",
    mediumaquamarine:"#66cdaa",
    mediumblue      :"#0000cd",
    mediumorchid    :"#ba55d3",
    mediumpurple    :"#9370d8",
    mediumseagreen  :"#3cb371",
    mediumslateblue :"#7b68ee",
    mediumspringgreen   :"#00fa9a",
    mediumturquoise :"#48d1cc",
    mediumvioletred :"#c71585",
    midnightblue    :"#191970",
    mintcream       :"#f5fffa",
    mistyrose       :"#ffe4e1",
    moccasin        :"#ffe4b5",
    navajowhite     :"#ffdead",
    navy            :"#000080",
    oldlace         :"#fdf5e6",
    olive           :"#808000",
    olivedrab       :"#6b8e23",
    orange          :"#ffa500",
    orangered       :"#ff4500",
    orchid          :"#da70d6",
    palegoldenrod   :"#eee8aa",
    palegreen       :"#98fb98",
    paleturquoise   :"#afeeee",
    palevioletred   :"#d87093",
    papayawhip      :"#ffefd5",
    peachpuff       :"#ffdab9",
    peru            :"#cd853f",
    pink            :"#ffc0cb",
    plum            :"#dda0dd",
    powderblue      :"#b0e0e6",
    purple          :"#800080",
    red             :"#ff0000",
    rosybrown       :"#bc8f8f",
    royalblue       :"#4169e1",
    saddlebrown     :"#8b4513",
    salmon          :"#fa8072",
    sandybrown      :"#f4a460",
    seagreen        :"#2e8b57",
    seashell        :"#fff5ee",
    sienna          :"#a0522d",
    silver          :"#c0c0c0",
    skyblue         :"#87ceeb",
    slateblue       :"#6a5acd",
    slategray       :"#708090",
    slategrey       :"#708090",
    snow            :"#fffafa",
    springgreen     :"#00ff7f",
    steelblue       :"#4682b4",
    tan             :"#d2b48c",
    teal            :"#008080",
    thistle         :"#d8bfd8",
    tomato          :"#ff6347",
    turquoise       :"#40e0d0",
    violet          :"#ee82ee",
    wheat           :"#f5deb3",
    white           :"#ffffff",
    whitesmoke      :"#f5f5f5",
    yellow          :"#ffff00",
    yellowgreen     :"#9acd32",
    //'currentcolor' color keyword https://www.w3.org/tr/css3-color/#currentcolor
    currentcolor        :"the value of the 'color' property.",
    //css2 system colors https://www.w3.org/tr/css3-color/#css2-system
    activeborder        :"active window border.",
    activecaption       :"active window caption.",
    appworkspace        :"background color of multiple document interface.",
    background          :"desktop background.",
    buttonface          :"the face background color for 3-d elements that appear 3-d due to one layer of surrounding border.",
    buttonhighlight     :"the color of the border facing the light source for 3-d elements that appear 3-d due to one layer of surrounding border.",
    buttonshadow        :"the color of the border away from the light source for 3-d elements that appear 3-d due to one layer of surrounding border.",
    buttontext          :"text on push buttons.",
    captiontext         :"text in caption, size box, and scrollbar arrow box.",
    graytext            :"grayed (disabled) text. this color is set to #000 if the current display driver does not support a solid gray color.",
    greytext            :"greyed (disabled) text. this color is set to #000 if the current display driver does not support a solid grey color.",
    highlight           :"item(s) selected in a control.",
    highlighttext       :"text of item(s) selected in a control.",
    inactiveborder      :"inactive window border.",
    inactivecaption     :"inactive window caption.",
    inactivecaptiontext :"color of text in an inactive caption.",
    infobackground      :"background color for tooltip controls.",
    infotext            :"text color for tooltip controls.",
    menu                :"menu background.",
    menutext            :"text in menus.",
    scrollbar           :"scroll bar gray area.",
    threeddarkshadow    :"the color of the darker (generally outer) of the two borders away from the light source for 3-d elements that appear 3-d due to two concentric layers of surrounding border.",
    threedface          :"the face background color for 3-d elements that appear 3-d due to two concentric layers of surrounding border.",
    threedhighlight     :"the color of the lighter (generally outer) of the two borders facing the light source for 3-d elements that appear 3-d due to two concentric layers of surrounding border.",
    threedlightshadow   :"the color of the darker (generally inner) of the two borders facing the light source for 3-d elements that appear 3-d due to two concentric layers of surrounding border.",
    threedshadow        :"the color of the lighter (generally inner) of the two borders away from the light source for 3-d elements that appear 3-d due to two concentric layers of surrounding border.",
    window              :"window background.",
    windowframe         :"window frame.",
    windowtext          :"text in windows."
};

},{}],2:[function(require,module,exports){
"use strict";

module.exports = combinator;

var syntaxunit = require("../util/syntaxunit");

var parser = require("./parser");

/**
 * represents a selector combinator (whitespace, +, >).
 * @namespace parserlib.css
 * @class combinator
 * @extends parserlib.util.syntaxunit
 * @constructor
 * @param {string} text the text representation of the unit.
 * @param {int} line the line of text on which the unit resides.
 * @param {int} col the column of text on which the unit resides.
 */
function combinator(text, line, col) {

    syntaxunit.call(this, text, line, col, parser.combinator_type);

    /**
     * the type of modifier.
     * @type string
     * @property type
     */
    this.type = "unknown";

    //pretty simple
    if (/^\s+$/.test(text)) {
        this.type = "descendant";
    } else if (text === ">") {
        this.type = "child";
    } else if (text === "+") {
        this.type = "adjacent-sibling";
    } else if (text === "~") {
        this.type = "sibling";
    }

}

combinator.prototype = new syntaxunit();
combinator.prototype.constructor = combinator;


},{"../util/syntaxunit":26,"./parser":6}],3:[function(require,module,exports){
"use strict";

module.exports = matcher;

var stringreader = require("../util/stringreader");
var syntaxerror = require("../util/syntaxerror");

/**
 * this class implements a combinator library for matcher functions.
 * the combinators are described at:
 * https://developer.mozilla.org/en-us/docs/web/css/value_definition_syntax#component_value_combinators
 */
function matcher(matchfunc, tostring) {
    this.match = function(expression) {
        // save/restore marks to ensure that failed matches always restore
        // the original location in the expression.
        var result;
        expression.mark();
        result = matchfunc(expression);
        if (result) {
            expression.drop();
        } else {
            expression.restore();
        }
        return result;
    };
    this.tostring = typeof tostring === "function" ? tostring : function() {
        return tostring;
    };
}

/** precedence table of combinators. */
matcher.prec = {
    mod:    5,
    seq:    4,
    andand: 3,
    oror:   2,
    alt:    1
};

/** simple recursive-descent grammar to build matchers from strings. */
matcher.parse = function(str) {
    var reader, eat, expr, oror, andand, seq, mod, term, result;
    reader = new stringreader(str);
    eat = function(matcher) {
        var result = reader.readmatch(matcher);
        if (result === null) {
            throw new syntaxerror(
                "expected "+matcher, reader.getline(), reader.getcol());
        }
        return result;
    };
    expr = function() {
        // expr = oror (" | " oror)*
        var m = [ oror() ];
        while (reader.readmatch(" | ") !== null) {
            m.push(oror());
        }
        return m.length === 1 ? m[0] : matcher.alt.apply(matcher, m);
    };
    oror = function() {
        // oror = andand ( " || " andand)*
        var m = [ andand() ];
        while (reader.readmatch(" || ") !== null) {
            m.push(andand());
        }
        return m.length === 1 ? m[0] : matcher.oror.apply(matcher, m);
    };
    andand = function() {
        // andand = seq ( " && " seq)*
        var m = [ seq() ];
        while (reader.readmatch(" && ") !== null) {
            m.push(seq());
        }
        return m.length === 1 ? m[0] : matcher.andand.apply(matcher, m);
    };
    seq = function() {
        // seq = mod ( " " mod)*
        var m = [ mod() ];
        while (reader.readmatch(/^ (?![&|\]])/) !== null) {
            m.push(mod());
        }
        return m.length === 1 ? m[0] : matcher.seq.apply(matcher, m);
    };
    mod = function() {
        // mod = term ( "?" | "*" | "+" | "#" | "{<num>,<num>}" )?
        var m = term();
        if (reader.readmatch("?") !== null) {
            return m.question();
        } else if (reader.readmatch("*") !== null) {
            return m.star();
        } else if (reader.readmatch("+") !== null) {
            return m.plus();
        } else if (reader.readmatch("#") !== null) {
            return m.hash();
        } else if (reader.readmatch(/^\{\s*/) !== null) {
            var min = eat(/^\d+/);
            eat(/^\s*,\s*/);
            var max = eat(/^\d+/);
            eat(/^\s*\}/);
            return m.braces(+min, +max);
        }
        return m;
    };
    term = function() {
        // term = <nt> | literal | "[ " expression " ]"
        if (reader.readmatch("[ ") !== null) {
            var m = expr();
            eat(" ]");
            return m;
        }
        return matcher.fromtype(eat(/^[^ ?*+#{]+/));
    };
    result = expr();
    if (!reader.eof()) {
        throw new syntaxerror(
            "expected end of string", reader.getline(), reader.getcol());
    }
    return result;
};

/**
 * convert a string to a matcher (parsing simple alternations),
 * or do nothing if the argument is already a matcher.
 */
matcher.cast = function(m) {
    if (m instanceof matcher) {
        return m;
    }
    return matcher.parse(m);
};

/**
 * create a matcher for a single type.
 */
matcher.fromtype = function(type) {
    // late require of validationtypes to break a dependency cycle.
    var validationtypes = require("./validationtypes");
    return new matcher(function(expression) {
        return expression.hasnext() && validationtypes.istype(expression, type);
    }, type);
};

/**
 * create a matcher for one or more juxtaposed words, which all must
 * occur, in the given order.
 */
matcher.seq = function() {
    var ms = array.prototype.slice.call(arguments).map(matcher.cast);
    if (ms.length === 1) {
        return ms[0];
    }
    return new matcher(function(expression) {
        var i, result = true;
        for (i = 0; result && i < ms.length; i++) {
            result = ms[i].match(expression);
        }
        return result;
    }, function(prec) {
        var p = matcher.prec.seq;
        var s = ms.map(function(m) {
            return m.tostring(p);
        }).join(" ");
        if (prec > p) {
            s = "[ " + s + " ]";
        }
        return s;
    });
};

/**
 * create a matcher for one or more alternatives, where exactly one
 * must occur.
 */
matcher.alt = function() {
    var ms = array.prototype.slice.call(arguments).map(matcher.cast);
    if (ms.length === 1) {
        return ms[0];
    }
    return new matcher(function(expression) {
        var i, result = false;
        for (i = 0; !result && i < ms.length; i++) {
            result = ms[i].match(expression);
        }
        return result;
    }, function(prec) {
        var p = matcher.prec.alt;
        var s = ms.map(function(m) {
            return m.tostring(p);
        }).join(" | ");
        if (prec > p) {
            s = "[ " + s + " ]";
        }
        return s;
    });
};

/**
 * create a matcher for two or more options.  this implements the
 * double bar (||) and double ampersand (&&) operators, as well as
 * variants of && where some of the alternatives are optional.
 * this will backtrack through even successful matches to try to
 * maximize the number of items matched.
 */
matcher.many = function(required) {
    var ms = array.prototype.slice.call(arguments, 1).reduce(function(acc, v) {
        if (v.expand) {
            // insert all of the options for the given complex rule as
            // individual options.
            var validationtypes = require("./validationtypes");
            acc.push.apply(acc, validationtypes.complex[v.expand].options);
        } else {
            acc.push(matcher.cast(v));
        }
        return acc;
    }, []);

    if (required === true) {
        required = ms.map(function() {
            return true;
        });
    }

    var result = new matcher(function(expression) {
        var seen = [], max = 0, pass = 0;
        var success = function(matchcount) {
            if (pass === 0) {
                max = math.max(matchcount, max);
                return matchcount === ms.length;
            } else {
                return matchcount === max;
            }
        };
        var trymatch = function(matchcount) {
            for (var i = 0; i < ms.length; i++) {
                if (seen[i]) {
                    continue;
                }
                expression.mark();
                if (ms[i].match(expression)) {
                    seen[i] = true;
                    // increase matchcount iff this was a required element
                    // (or if all the elements are optional)
                    if (trymatch(matchcount + ((required === false || required[i]) ? 1 : 0))) {
                        expression.drop();
                        return true;
                    }
                    // backtrack: try *not* matching using this rule, and
                    // let's see if it leads to a better overall match.
                    expression.restore();
                    seen[i] = false;
                } else {
                    expression.drop();
                }
            }
            return success(matchcount);
        };
        if (!trymatch(0)) {
            // couldn't get a complete match, retrace our steps to make the
            // match with the maximum # of required elements.
            pass++;
            trymatch(0);
        }

        if (required === false) {
            return max > 0;
        }
        // use finer-grained specification of which matchers are required.
        for (var i = 0; i < ms.length; i++) {
            if (required[i] && !seen[i]) {
                return false;
            }
        }
        return true;
    }, function(prec) {
        var p = required === false ? matcher.prec.oror : matcher.prec.andand;
        var s = ms.map(function(m, i) {
            if (required !== false && !required[i]) {
                return m.tostring(matcher.prec.mod) + "?";
            }
            return m.tostring(p);
        }).join(required === false ? " || " : " && ");
        if (prec > p) {
            s = "[ " + s + " ]";
        }
        return s;
    });
    result.options = ms;
    return result;
};

/**
 * create a matcher for two or more options, where all options are
 * mandatory but they may appear in any order.
 */
matcher.andand = function() {
    var args = array.prototype.slice.call(arguments);
    args.unshift(true);
    return matcher.many.apply(matcher, args);
};

/**
 * create a matcher for two or more options, where options are
 * optional and may appear in any order, but at least one must be
 * present.
 */
matcher.oror = function() {
    var args = array.prototype.slice.call(arguments);
    args.unshift(false);
    return matcher.many.apply(matcher, args);
};

/** instance methods on matchers. */
matcher.prototype = {
    constructor: matcher,
    // these are expected to be overridden in every instance.
    match: function() { throw new error("unimplemented"); },
    tostring: function() { throw new error("unimplemented"); },
    // this returns a standalone function to do the matching.
    func: function() { return this.match.bind(this); },
    // basic combinators
    then: function(m) { return matcher.seq(this, m); },
    or: function(m) { return matcher.alt(this, m); },
    andand: function(m) { return matcher.many(true, this, m); },
    oror: function(m) { return matcher.many(false, this, m); },
    // component value multipliers
    star: function() { return this.braces(0, infinity, "*"); },
    plus: function() { return this.braces(1, infinity, "+"); },
    question: function() { return this.braces(0, 1, "?"); },
    hash: function() {
        return this.braces(1, infinity, "#", matcher.cast(","));
    },
    braces: function(min, max, marker, optsep) {
        var m1 = this, m2 = optsep ? optsep.then(this) : this;
        if (!marker) {
            marker = "{" + min + "," + max + "}";
        }
        return new matcher(function(expression) {
            var result = true, i;
            for (i = 0; i < max; i++) {
                if (i > 0 && optsep) {
                    result = m2.match(expression);
                } else {
                    result = m1.match(expression);
                }
                if (!result) {
                    break;
                }
            }
            return i >= min;
        }, function() {
            return m1.tostring(matcher.prec.mod) + marker;
        });
    }
};

},{"../util/stringreader":24,"../util/syntaxerror":25,"./validationtypes":21}],4:[function(require,module,exports){
"use strict";

module.exports = mediafeature;

var syntaxunit = require("../util/syntaxunit");

var parser = require("./parser");

/**
 * represents a media feature, such as max-width:500.
 * @namespace parserlib.css
 * @class mediafeature
 * @extends parserlib.util.syntaxunit
 * @constructor
 * @param {syntaxunit} name the name of the feature.
 * @param {syntaxunit} value the value of the feature or null if none.
 */
function mediafeature(name, value) {

    syntaxunit.call(this, "(" + name + (value !== null ? ":" + value : "") + ")", name.startline, name.startcol, parser.media_feature_type);

    /**
     * the name of the media feature
     * @type string
     * @property name
     */
    this.name = name;

    /**
     * the value for the feature or null if there is none.
     * @type syntaxunit
     * @property value
     */
    this.value = value;
}

mediafeature.prototype = new syntaxunit();
mediafeature.prototype.constructor = mediafeature;


},{"../util/syntaxunit":26,"./parser":6}],5:[function(require,module,exports){
"use strict";

module.exports = mediaquery;

var syntaxunit = require("../util/syntaxunit");

var parser = require("./parser");

/**
 * represents an individual media query.
 * @namespace parserlib.css
 * @class mediaquery
 * @extends parserlib.util.syntaxunit
 * @constructor
 * @param {string} modifier the modifier "not" or "only" (or null).
 * @param {string} mediatype the type of media (i.e., "print").
 * @param {array} parts array of selectors parts making up this selector.
 * @param {int} line the line of text on which the unit resides.
 * @param {int} col the column of text on which the unit resides.
 */
function mediaquery(modifier, mediatype, features, line, col) {

    syntaxunit.call(this, (modifier ? modifier + " ": "") + (mediatype ? mediatype : "") + (mediatype && features.length > 0 ? " and " : "") + features.join(" and "), line, col, parser.media_query_type);

    /**
     * the media modifier ("not" or "only")
     * @type string
     * @property modifier
     */
    this.modifier = modifier;

    /**
     * the mediatype (i.e., "print")
     * @type string
     * @property mediatype
     */
    this.mediatype = mediatype;

    /**
     * the parts that make up the selector.
     * @type array
     * @property features
     */
    this.features = features;

}

mediaquery.prototype = new syntaxunit();
mediaquery.prototype.constructor = mediaquery;


},{"../util/syntaxunit":26,"./parser":6}],6:[function(require,module,exports){
"use strict";

module.exports = parser;

var eventtarget = require("../util/eventtarget");
var syntaxerror = require("../util/syntaxerror");
var syntaxunit = require("../util/syntaxunit");

var combinator = require("./combinator");
var mediafeature = require("./mediafeature");
var mediaquery = require("./mediaquery");
var propertyname = require("./propertyname");
var propertyvalue = require("./propertyvalue");
var propertyvaluepart = require("./propertyvaluepart");
var selector = require("./selector");
var selectorpart = require("./selectorpart");
var selectorsubpart = require("./selectorsubpart");
var tokenstream = require("./tokenstream");
var tokens = require("./tokens");
var validation = require("./validation");

/**
 * a css3 parser.
 * @namespace parserlib.css
 * @class parser
 * @constructor
 * @param {object} options (optional) various options for the parser:
 *      starhack (true|false) to allow ie6 star hack as valid,
 *      underscorehack (true|false) to interpret leading underscores
 *      as ie6-7 targeting for known properties, iefilters (true|false)
 *      to indicate that ie < 8 filters should be accepted and not throw
 *      syntax errors.
 */
function parser(options) {

    //inherit event functionality
    eventtarget.call(this);


    this.options = options || {};

    this._tokenstream = null;
}

//static constants
parser.default_type = 0;
parser.combinator_type = 1;
parser.media_feature_type = 2;
parser.media_query_type = 3;
parser.property_name_type = 4;
parser.property_value_type = 5;
parser.property_value_part_type = 6;
parser.selector_type = 7;
parser.selector_part_type = 8;
parser.selector_sub_part_type = 9;

parser.prototype = function() {

    var proto = new eventtarget(),  //new prototype
        prop,
        additions =  {
            __proto__: null,

            //restore constructor
            constructor: parser,

            //instance constants - yuck
            default_type : 0,
            combinator_type : 1,
            media_feature_type : 2,
            media_query_type : 3,
            property_name_type : 4,
            property_value_type : 5,
            property_value_part_type : 6,
            selector_type : 7,
            selector_part_type : 8,
            selector_sub_part_type : 9,

            //-----------------------------------------------------------------
            // grammar
            //-----------------------------------------------------------------

            _stylesheet: function() {

                /*
                 * stylesheet
                 *  : [ charset_sym s* string s* ';' ]?
                 *    [s|cdo|cdc]* [ import [s|cdo|cdc]* ]*
                 *    [ namespace [s|cdo|cdc]* ]*
                 *    [ [ ruleset | media | page | font_face | keyframes_rule | supports_rule ] [s|cdo|cdc]* ]*
                 *  ;
                 */

                var tokenstream = this._tokenstream,
                    count,
                    token,
                    tt;

                this.fire("startstylesheet");

                //try to read character set
                this._charset();

                this._skipcruft();

                //try to read imports - may be more than one
                while (tokenstream.peek() === tokens.import_sym) {
                    this._import();
                    this._skipcruft();
                }

                //try to read namespaces - may be more than one
                while (tokenstream.peek() === tokens.namespace_sym) {
                    this._namespace();
                    this._skipcruft();
                }

                //get the next token
                tt = tokenstream.peek();

                //try to read the rest
                while (tt > tokens.eof) {

                    try {

                        switch (tt) {
                            case tokens.media_sym:
                                this._media();
                                this._skipcruft();
                                break;
                            case tokens.page_sym:
                                this._page();
                                this._skipcruft();
                                break;
                            case tokens.font_face_sym:
                                this._font_face();
                                this._skipcruft();
                                break;
                            case tokens.keyframes_sym:
                                this._keyframes();
                                this._skipcruft();
                                break;
                            case tokens.viewport_sym:
                                this._viewport();
                                this._skipcruft();
                                break;
                            case tokens.document_sym:
                                this._document();
                                this._skipcruft();
                                break;
                            case tokens.supports_sym:
                                this._supports();
                                this._skipcruft();
                                break;
                            case tokens.unknown_sym:  //unknown @ rule
                                tokenstream.get();
                                if (!this.options.strict) {

                                    //fire error event
                                    this.fire({
                                        type:       "error",
                                        error:      null,
                                        message:    "unknown @ rule: " + tokenstream.lt(0).value + ".",
                                        line:       tokenstream.lt(0).startline,
                                        col:        tokenstream.lt(0).startcol
                                    });

                                    //skip braces
                                    count=0;
                                    while (tokenstream.advance([tokens.lbrace, tokens.rbrace]) === tokens.lbrace) {
                                        count++;    //keep track of nesting depth
                                    }

                                    while (count) {
                                        tokenstream.advance([tokens.rbrace]);
                                        count--;
                                    }

                                } else {
                                    //not a syntax error, rethrow it
                                    throw new syntaxerror("unknown @ rule.", tokenstream.lt(0).startline, tokenstream.lt(0).startcol);
                                }
                                break;
                            case tokens.s:
                                this._readwhitespace();
                                break;
                            default:
                                if (!this._ruleset()) {

                                    //error handling for known issues
                                    switch (tt) {
                                        case tokens.charset_sym:
                                            token = tokenstream.lt(1);
                                            this._charset(false);
                                            throw new syntaxerror("@charset not allowed here.", token.startline, token.startcol);
                                        case tokens.import_sym:
                                            token = tokenstream.lt(1);
                                            this._import(false);
                                            throw new syntaxerror("@import not allowed here.", token.startline, token.startcol);
                                        case tokens.namespace_sym:
                                            token = tokenstream.lt(1);
                                            this._namespace(false);
                                            throw new syntaxerror("@namespace not allowed here.", token.startline, token.startcol);
                                        default:
                                            tokenstream.get();  //get the last token
                                            this._unexpectedtoken(tokenstream.token());
                                    }

                                }
                        }
                    } catch (ex) {
                        if (ex instanceof syntaxerror && !this.options.strict) {
                            this.fire({
                                type:       "error",
                                error:      ex,
                                message:    ex.message,
                                line:       ex.line,
                                col:        ex.col
                            });
                        } else {
                            throw ex;
                        }
                    }

                    tt = tokenstream.peek();
                }

                if (tt !== tokens.eof) {
                    this._unexpectedtoken(tokenstream.token());
                }

                this.fire("endstylesheet");
            },

            _charset: function(emit) {
                var tokenstream = this._tokenstream,
                    charset,
                    token,
                    line,
                    col;

                if (tokenstream.match(tokens.charset_sym)) {
                    line = tokenstream.token().startline;
                    col = tokenstream.token().startcol;

                    this._readwhitespace();
                    tokenstream.mustmatch(tokens.string);

                    token = tokenstream.token();
                    charset = token.value;

                    this._readwhitespace();
                    tokenstream.mustmatch(tokens.semicolon);

                    if (emit !== false) {
                        this.fire({
                            type:   "charset",
                            charset:charset,
                            line:   line,
                            col:    col
                        });
                    }
                }
            },

            _import: function(emit) {
                /*
                 * import
                 *   : import_sym s*
                 *    [string|uri] s* media_query_list? ';' s*
                 */

                var tokenstream = this._tokenstream,
                    uri,
                    importtoken,
                    medialist   = [];

                //read import symbol
                tokenstream.mustmatch(tokens.import_sym);
                importtoken = tokenstream.token();
                this._readwhitespace();

                tokenstream.mustmatch([tokens.string, tokens.uri]);

                //grab the uri value
                uri = tokenstream.token().value.replace(/^(?:url\()?["']?([^"']+?)["']?\)?$/, "$1");

                this._readwhitespace();

                medialist = this._media_query_list();

                //must end with a semicolon
                tokenstream.mustmatch(tokens.semicolon);
                this._readwhitespace();

                if (emit !== false) {
                    this.fire({
                        type:   "import",
                        uri:    uri,
                        media:  medialist,
                        line:   importtoken.startline,
                        col:    importtoken.startcol
                    });
                }

            },

            _namespace: function(emit) {
                /*
                 * namespace
                 *   : namespace_sym s* [namespace_prefix s*]? [string|uri] s* ';' s*
                 */

                var tokenstream = this._tokenstream,
                    line,
                    col,
                    prefix,
                    uri;

                //read import symbol
                tokenstream.mustmatch(tokens.namespace_sym);
                line = tokenstream.token().startline;
                col = tokenstream.token().startcol;
                this._readwhitespace();

                //it's a namespace prefix - no _namespace_prefix() method because it's just an ident
                if (tokenstream.match(tokens.ident)) {
                    prefix = tokenstream.token().value;
                    this._readwhitespace();
                }

                tokenstream.mustmatch([tokens.string, tokens.uri]);
                /*if (!tokenstream.match(tokens.string)){
                    tokenstream.mustmatch(tokens.uri);
                }*/

                //grab the uri value
                uri = tokenstream.token().value.replace(/(?:url\()?["']([^"']+)["']\)?/, "$1");

                this._readwhitespace();

                //must end with a semicolon
                tokenstream.mustmatch(tokens.semicolon);
                this._readwhitespace();

                if (emit !== false) {
                    this.fire({
                        type:   "namespace",
                        prefix: prefix,
                        uri:    uri,
                        line:   line,
                        col:    col
                    });
                }

            },

            _supports: function(emit) {
                /*
                 * supports_rule
                 *  : supports_sym s* supports_condition s* group_rule_body
                 *  ;
                 */
                var tokenstream = this._tokenstream,
                    line,
                    col;

                if (tokenstream.match(tokens.supports_sym)) {
                    line = tokenstream.token().startline;
                    col = tokenstream.token().startcol;

                    this._readwhitespace();
                    this._supports_condition();
                    this._readwhitespace();

                    tokenstream.mustmatch(tokens.lbrace);
                    this._readwhitespace();

                    if (emit !== false) {
                        this.fire({
                            type:   "startsupports",
                            line:   line,
                            col:    col
                        });
                    }

                    while (true) {
                        if (!this._ruleset()) {
                            break;
                        }
                    }

                    tokenstream.mustmatch(tokens.rbrace);
                    this._readwhitespace();

                    this.fire({
                        type:   "endsupports",
                        line:   line,
                        col:    col
                    });
                }
            },

            _supports_condition: function() {
                /*
                 * supports_condition
                 *  : supports_negation | supports_conjunction | supports_disjunction |
                 *    supports_condition_in_parens
                 *  ;
                 */
                var tokenstream = this._tokenstream,
                    ident;

                if (tokenstream.match(tokens.ident)) {
                    ident = tokenstream.token().value.tolowercase();

                    if (ident === "not") {
                        tokenstream.mustmatch(tokens.s);
                        this._supports_condition_in_parens();
                    } else {
                        tokenstream.unget();
                    }
                } else {
                    this._supports_condition_in_parens();
                    this._readwhitespace();

                    while (tokenstream.peek() === tokens.ident) {
                        ident = tokenstream.lt(1).value.tolowercase();
                        if (ident === "and" || ident === "or") {
                            tokenstream.mustmatch(tokens.ident);
                            this._readwhitespace();
                            this._supports_condition_in_parens();
                            this._readwhitespace();
                        }
                    }
                }
            },

            _supports_condition_in_parens: function() {
                /*
                 * supports_condition_in_parens
                 *  : ( '(' s* supports_condition s* ')' ) | supports_declaration_condition |
                 *    general_enclosed
                 *  ;
                 */
                var tokenstream = this._tokenstream,
                    ident;

                if (tokenstream.match(tokens.lparen)) {
                    this._readwhitespace();
                    if (tokenstream.match(tokens.ident)) {
                        // look ahead for not keyword, if not given, continue with declaration condition.
                        ident = tokenstream.token().value.tolowercase();
                        if (ident === "not") {
                            this._readwhitespace();
                            this._supports_condition();
                            this._readwhitespace();
                            tokenstream.mustmatch(tokens.rparen);
                        } else {
                            tokenstream.unget();
                            this._supports_declaration_condition(false);
                        }
                    } else {
                        this._supports_condition();
                        this._readwhitespace();
                        tokenstream.mustmatch(tokens.rparen);
                    }
                } else {
                    this._supports_declaration_condition();
                }
            },

            _supports_declaration_condition: function(requirestartparen) {
                /*
                 * supports_declaration_condition
                 *  : '(' s* declaration ')'
                 *  ;
                 */
                var tokenstream = this._tokenstream;

                if (requirestartparen !== false) {
                    tokenstream.mustmatch(tokens.lparen);
                }
                this._readwhitespace();
                this._declaration();
                tokenstream.mustmatch(tokens.rparen);
            },

            _media: function() {
                /*
                 * media
                 *   : media_sym s* media_query_list s* '{' s* ruleset* '}' s*
                 *   ;
                 */
                var tokenstream     = this._tokenstream,
                    line,
                    col,
                    medialist;//       = [];

                //look for @media
                tokenstream.mustmatch(tokens.media_sym);
                line = tokenstream.token().startline;
                col = tokenstream.token().startcol;

                this._readwhitespace();

                medialist = this._media_query_list();

                tokenstream.mustmatch(tokens.lbrace);
                this._readwhitespace();

                this.fire({
                    type:   "startmedia",
                    media:  medialist,
                    line:   line,
                    col:    col
                });

                while (true) {
                    if (tokenstream.peek() === tokens.page_sym) {
                        this._page();
                    } else if (tokenstream.peek() === tokens.font_face_sym) {
                        this._font_face();
                    } else if (tokenstream.peek() === tokens.viewport_sym) {
                        this._viewport();
                    } else if (tokenstream.peek() === tokens.document_sym) {
                        this._document();
                    } else if (tokenstream.peek() === tokens.supports_sym) {
                        this._supports();
                    } else if (tokenstream.peek() === tokens.media_sym) {
                        this._media();
                    } else if (!this._ruleset()) {
                        break;
                    }
                }

                tokenstream.mustmatch(tokens.rbrace);
                this._readwhitespace();

                this.fire({
                    type:   "endmedia",
                    media:  medialist,
                    line:   line,
                    col:    col
                });
            },


            //css3 media queries
            _media_query_list: function() {
                /*
                 * media_query_list
                 *   : s* [media_query [ ',' s* media_query ]* ]?
                 *   ;
                 */
                var tokenstream = this._tokenstream,
                    medialist   = [];


                this._readwhitespace();

                if (tokenstream.peek() === tokens.ident || tokenstream.peek() === tokens.lparen) {
                    medialist.push(this._media_query());
                }

                while (tokenstream.match(tokens.comma)) {
                    this._readwhitespace();
                    medialist.push(this._media_query());
                }

                return medialist;
            },

            /*
             * note: "expression" in the grammar maps to the _media_expression
             * method.

             */
            _media_query: function() {
                /*
                 * media_query
                 *   : [only | not]? s* media_type s* [ and s* expression ]*
                 *   | expression [ and s* expression ]*
                 *   ;
                 */
                var tokenstream = this._tokenstream,
                    type        = null,
                    ident       = null,
                    token       = null,
                    expressions = [];

                if (tokenstream.match(tokens.ident)) {
                    ident = tokenstream.token().value.tolowercase();

                    //since there's no custom tokens for these, need to manually check
                    if (ident !== "only" && ident !== "not") {
                        tokenstream.unget();
                        ident = null;
                    } else {
                        token = tokenstream.token();
                    }
                }

                this._readwhitespace();

                if (tokenstream.peek() === tokens.ident) {
                    type = this._media_type();
                    if (token === null) {
                        token = tokenstream.token();
                    }
                } else if (tokenstream.peek() === tokens.lparen) {
                    if (token === null) {
                        token = tokenstream.lt(1);
                    }
                    expressions.push(this._media_expression());
                }

                if (type === null && expressions.length === 0) {
                    return null;
                } else {
                    this._readwhitespace();
                    while (tokenstream.match(tokens.ident)) {
                        if (tokenstream.token().value.tolowercase() !== "and") {
                            this._unexpectedtoken(tokenstream.token());
                        }

                        this._readwhitespace();
                        expressions.push(this._media_expression());
                    }
                }

                return new mediaquery(ident, type, expressions, token.startline, token.startcol);
            },

            //css3 media queries
            _media_type: function() {
                /*
                 * media_type
                 *   : ident
                 *   ;
                 */
                return this._media_feature();
            },

            /**
             * note: in css3 media queries, this is called "expression".
             * renamed here to avoid conflict with css3 selectors
             * definition of "expression". also note that "expr" in the
             * grammar now maps to "expression" from css3 selectors.
             * @method _media_expression
             * @private
             */
            _media_expression: function() {
                /*
                 * expression
                 *  : '(' s* media_feature s* [ ':' s* expr ]? ')' s*
                 *  ;
                 */
                var tokenstream = this._tokenstream,
                    feature     = null,
                    token,
                    expression  = null;

                tokenstream.mustmatch(tokens.lparen);

                feature = this._media_feature();
                this._readwhitespace();

                if (tokenstream.match(tokens.colon)) {
                    this._readwhitespace();
                    token = tokenstream.lt(1);
                    expression = this._expression();
                }

                tokenstream.mustmatch(tokens.rparen);
                this._readwhitespace();

                return new mediafeature(feature, expression ? new syntaxunit(expression, token.startline, token.startcol) : null);
            },

            //css3 media queries
            _media_feature: function() {
                /*
                 * media_feature
                 *   : ident
                 *   ;
                 */
                var tokenstream = this._tokenstream;

                this._readwhitespace();

                tokenstream.mustmatch(tokens.ident);

                return syntaxunit.fromtoken(tokenstream.token());
            },

            //css3 paged media
            _page: function() {
                /*
                 * page:
                 *    page_sym s* ident? pseudo_page? s*
                 *    '{' s* [ declaration | margin ]? [ ';' s* [ declaration | margin ]? ]* '}' s*
                 *    ;
                 */
                var tokenstream = this._tokenstream,
                    line,
                    col,
                    identifier  = null,
                    pseudopage  = null;

                //look for @page
                tokenstream.mustmatch(tokens.page_sym);
                line = tokenstream.token().startline;
                col = tokenstream.token().startcol;

                this._readwhitespace();

                if (tokenstream.match(tokens.ident)) {
                    identifier = tokenstream.token().value;

                    //the value 'auto' may not be used as a page name and must be treated as a syntax error.
                    if (identifier.tolowercase() === "auto") {
                        this._unexpectedtoken(tokenstream.token());
                    }
                }

                //see if there's a colon upcoming
                if (tokenstream.peek() === tokens.colon) {
                    pseudopage = this._pseudo_page();
                }

                this._readwhitespace();

                this.fire({
                    type:   "startpage",
                    id:     identifier,
                    pseudo: pseudopage,
                    line:   line,
                    col:    col
                });

                this._readdeclarations(true, true);

                this.fire({
                    type:   "endpage",
                    id:     identifier,
                    pseudo: pseudopage,
                    line:   line,
                    col:    col
                });

            },

            //css3 paged media
            _margin: function() {
                /*
                 * margin :
                 *    margin_sym s* '{' declaration [ ';' s* declaration? ]* '}' s*
                 *    ;
                 */
                var tokenstream = this._tokenstream,
                    line,
                    col,
                    marginsym   = this._margin_sym();

                if (marginsym) {
                    line = tokenstream.token().startline;
                    col = tokenstream.token().startcol;

                    this.fire({
                        type: "startpagemargin",
                        margin: marginsym,
                        line:   line,
                        col:    col
                    });

                    this._readdeclarations(true);

                    this.fire({
                        type: "endpagemargin",
                        margin: marginsym,
                        line:   line,
                        col:    col
                    });
                    return true;
                } else {
                    return false;
                }
            },

            //css3 paged media
            _margin_sym: function() {

                /*
                 * margin_sym :
                 *    topleftcorner_sym |
                 *    topleft_sym |
                 *    topcenter_sym |
                 *    topright_sym |
                 *    toprightcorner_sym |
                 *    bottomleftcorner_sym |
                 *    bottomleft_sym |
                 *    bottomcenter_sym |
                 *    bottomright_sym |
                 *    bottomrightcorner_sym |
                 *    lefttop_sym |
                 *    leftmiddle_sym |
                 *    leftbottom_sym |
                 *    righttop_sym |
                 *    rightmiddle_sym |
                 *    rightbottom_sym
                 *    ;
                 */

                var tokenstream = this._tokenstream;

                if (tokenstream.match([tokens.topleftcorner_sym, tokens.topleft_sym,
                        tokens.topcenter_sym, tokens.topright_sym, tokens.toprightcorner_sym,
                        tokens.bottomleftcorner_sym, tokens.bottomleft_sym,
                        tokens.bottomcenter_sym, tokens.bottomright_sym,
                        tokens.bottomrightcorner_sym, tokens.lefttop_sym,
                        tokens.leftmiddle_sym, tokens.leftbottom_sym, tokens.righttop_sym,
                        tokens.rightmiddle_sym, tokens.rightbottom_sym])) {
                    return syntaxunit.fromtoken(tokenstream.token());
                } else {
                    return null;
                }

            },

            _pseudo_page: function() {
                /*
                 * pseudo_page
                 *   : ':' ident
                 *   ;
                 */

                var tokenstream = this._tokenstream;

                tokenstream.mustmatch(tokens.colon);
                tokenstream.mustmatch(tokens.ident);

                //todo: css3 paged media says only "left", "center", and "right" are allowed

                return tokenstream.token().value;
            },

            _font_face: function() {
                /*
                 * font_face
                 *   : font_face_sym s*
                 *     '{' s* declaration [ ';' s* declaration ]* '}' s*
                 *   ;
                 */
                var tokenstream = this._tokenstream,
                    line,
                    col;

                //look for @page
                tokenstream.mustmatch(tokens.font_face_sym);
                line = tokenstream.token().startline;
                col = tokenstream.token().startcol;

                this._readwhitespace();

                this.fire({
                    type:   "startfontface",
                    line:   line,
                    col:    col
                });

                this._readdeclarations(true);

                this.fire({
                    type:   "endfontface",
                    line:   line,
                    col:    col
                });
            },

            _viewport: function() {
                /*
                 * viewport
                 *   : viewport_sym s*
                 *     '{' s* declaration? [ ';' s* declaration? ]* '}' s*
                 *   ;
                 */
                var tokenstream = this._tokenstream,
                    line,
                    col;

                tokenstream.mustmatch(tokens.viewport_sym);
                line = tokenstream.token().startline;
                col = tokenstream.token().startcol;

                this._readwhitespace();

                this.fire({
                    type:   "startviewport",
                    line:   line,
                    col:    col
                });

                this._readdeclarations(true);

                this.fire({
                    type:   "endviewport",
                    line:   line,
                    col:    col
                });

            },

            _document: function() {
                /*
                 * document
                 *   : document_sym s*
                 *     _document_function [ ',' s* _document_function ]* s*
                 *     '{' s* ruleset* '}'
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    token,
                    functions = [],
                    prefix = "";

                tokenstream.mustmatch(tokens.document_sym);
                token = tokenstream.token();
                if (/^@\-([^\-]+)\-/.test(token.value)) {
                    prefix = regexp.$1;
                }

                this._readwhitespace();
                functions.push(this._document_function());

                while (tokenstream.match(tokens.comma)) {
                    this._readwhitespace();
                    functions.push(this._document_function());
                }

                tokenstream.mustmatch(tokens.lbrace);
                this._readwhitespace();

                this.fire({
                    type:      "startdocument",
                    functions: functions,
                    prefix:    prefix,
                    line:      token.startline,
                    col:       token.startcol
                });

                var ok = true;
                while (ok) {
                    switch (tokenstream.peek()) {
                        case tokens.page_sym:
                            this._page();
                            break;
                        case tokens.font_face_sym:
                            this._font_face();
                            break;
                        case tokens.viewport_sym:
                            this._viewport();
                            break;
                        case tokens.media_sym:
                            this._media();
                            break;
                        case tokens.keyframes_sym:
                            this._keyframes();
                            break;
                        case tokens.document_sym:
                            this._document();
                            break;
                        default:
                            ok = boolean(this._ruleset());
                    }
                }

                tokenstream.mustmatch(tokens.rbrace);
                token = tokenstream.token();
                this._readwhitespace();

                this.fire({
                    type:      "enddocument",
                    functions: functions,
                    prefix:    prefix,
                    line:      token.startline,
                    col:       token.startcol
                });
            },

            _document_function: function() {
                /*
                 * document_function
                 *   : function | uri s*
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    value;

                if (tokenstream.match(tokens.uri)) {
                    value = tokenstream.token().value;
                    this._readwhitespace();
                } else {
                    value = this._function();
                }

                return value;
            },

            _operator: function(infunction) {

                /*
                 * operator (outside function)
                 *  : '/' s* | ',' s* | /( empty )/
                 * operator (inside function)
                 *  : '/' s* | '+' s* | '*' s* | '-' s* /( empty )/
                 *  ;
                 */

                var tokenstream = this._tokenstream,
                    token       = null;

                if (tokenstream.match([tokens.slash, tokens.comma]) ||
                    (infunction && tokenstream.match([tokens.plus, tokens.star, tokens.minus]))) {
                    token =  tokenstream.token();
                    this._readwhitespace();
                }
                return token ? propertyvaluepart.fromtoken(token) : null;

            },

            _combinator: function() {

                /*
                 * combinator
                 *  : plus s* | greater s* | tilde s* | s+
                 *  ;
                 */

                var tokenstream = this._tokenstream,
                    value       = null,
                    token;

                if (tokenstream.match([tokens.plus, tokens.greater, tokens.tilde])) {
                    token = tokenstream.token();
                    value = new combinator(token.value, token.startline, token.startcol);
                    this._readwhitespace();
                }

                return value;
            },

            _unary_operator: function() {

                /*
                 * unary_operator
                 *  : '-' | '+'
                 *  ;
                 */

                var tokenstream = this._tokenstream;

                if (tokenstream.match([tokens.minus, tokens.plus])) {
                    return tokenstream.token().value;
                } else {
                    return null;
                }
            },

            _property: function() {

                /*
                 * property
                 *   : ident s*
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    value       = null,
                    hack        = null,
                    tokenvalue,
                    token,
                    line,
                    col;

                //check for star hack - throws error if not allowed
                if (tokenstream.peek() === tokens.star && this.options.starhack) {
                    tokenstream.get();
                    token = tokenstream.token();
                    hack = token.value;
                    line = token.startline;
                    col = token.startcol;
                }

                if (tokenstream.match(tokens.ident)) {
                    token = tokenstream.token();
                    tokenvalue = token.value;

                    //check for underscore hack - no error if not allowed because it's valid css syntax
                    if (tokenvalue.charat(0) === "_" && this.options.underscorehack) {
                        hack = "_";
                        tokenvalue = tokenvalue.substring(1);
                    }

                    value = new propertyname(tokenvalue, hack, (line||token.startline), (col||token.startcol));
                    this._readwhitespace();
                }

                return value;
            },

            //augmented with css3 selectors
            _ruleset: function() {
                /*
                 * ruleset
                 *   : selectors_group
                 *     '{' s* declaration? [ ';' s* declaration? ]* '}' s*
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    tt,
                    selectors;


                /*
                 * error recovery: if even a single selector fails to parse,
                 * then the entire ruleset should be thrown away.
                 */
                try {
                    selectors = this._selectors_group();
                } catch (ex) {
                    if (ex instanceof syntaxerror && !this.options.strict) {

                        //fire error event
                        this.fire({
                            type:       "error",
                            error:      ex,
                            message:    ex.message,
                            line:       ex.line,
                            col:        ex.col
                        });

                        //skip over everything until closing brace
                        tt = tokenstream.advance([tokens.rbrace]);
                        if (tt === tokens.rbrace) {
                            //if there's a right brace, the rule is finished so don't do anything
                        } else {
                            //otherwise, rethrow the error because it wasn't handled properly
                            throw ex;
                        }

                    } else {
                        //not a syntax error, rethrow it
                        throw ex;
                    }

                    //trigger parser to continue
                    return true;
                }

                //if it got here, all selectors parsed
                if (selectors) {

                    this.fire({
                        type:       "startrule",
                        selectors:  selectors,
                        line:       selectors[0].line,
                        col:        selectors[0].col
                    });

                    this._readdeclarations(true);

                    this.fire({
                        type:       "endrule",
                        selectors:  selectors,
                        line:       selectors[0].line,
                        col:        selectors[0].col
                    });

                }

                return selectors;

            },

            //css3 selectors
            _selectors_group: function() {

                /*
                 * selectors_group
                 *   : selector [ comma s* selector ]*
                 *   ;
                 */
                var tokenstream = this._tokenstream,
                    selectors   = [],
                    selector;

                selector = this._selector();
                if (selector !== null) {

                    selectors.push(selector);
                    while (tokenstream.match(tokens.comma)) {
                        this._readwhitespace();
                        selector = this._selector();
                        if (selector !== null) {
                            selectors.push(selector);
                        } else {
                            this._unexpectedtoken(tokenstream.lt(1));
                        }
                    }
                }

                return selectors.length ? selectors : null;
            },

            //css3 selectors
            _selector: function() {
                /*
                 * selector
                 *   : simple_selector_sequence [ combinator simple_selector_sequence ]*
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    selector    = [],
                    nextselector = null,
                    combinator  = null,
                    ws          = null;

                //if there's no simple selector, then there's no selector
                nextselector = this._simple_selector_sequence();
                if (nextselector === null) {
                    return null;
                }

                selector.push(nextselector);

                do {

                    //look for a combinator
                    combinator = this._combinator();

                    if (combinator !== null) {
                        selector.push(combinator);
                        nextselector = this._simple_selector_sequence();

                        //there must be a next selector
                        if (nextselector === null) {
                            this._unexpectedtoken(tokenstream.lt(1));
                        } else {

                            //nextselector is an instance of selectorpart
                            selector.push(nextselector);
                        }
                    } else {

                        //if there's not whitespace, we're done
                        if (this._readwhitespace()) {

                            //add whitespace separator
                            ws = new combinator(tokenstream.token().value, tokenstream.token().startline, tokenstream.token().startcol);

                            //combinator is not required
                            combinator = this._combinator();

                            //selector is required if there's a combinator
                            nextselector = this._simple_selector_sequence();
                            if (nextselector === null) {
                                if (combinator !== null) {
                                    this._unexpectedtoken(tokenstream.lt(1));
                                }
                            } else {

                                if (combinator !== null) {
                                    selector.push(combinator);
                                } else {
                                    selector.push(ws);
                                }

                                selector.push(nextselector);
                            }
                        } else {
                            break;
                        }

                    }
                } while (true);

                return new selector(selector, selector[0].line, selector[0].col);
            },

            //css3 selectors
            _simple_selector_sequence: function() {
                /*
                 * simple_selector_sequence
                 *   : [ type_selector | universal ]
                 *     [ hash | class | attrib | pseudo | negation ]*
                 *   | [ hash | class | attrib | pseudo | negation ]+
                 *   ;
                 */

                var tokenstream = this._tokenstream,

                    //parts of a simple selector
                    elementname = null,
                    modifiers   = [],

                    //complete selector text
                    selectortext= "",

                    //the different parts after the element name to search for
                    components  = [
                        //hash
                        function() {
                            return tokenstream.match(tokens.hash) ?
                                    new selectorsubpart(tokenstream.token().value, "id", tokenstream.token().startline, tokenstream.token().startcol) :
                                    null;
                        },
                        this._class,
                        this._attrib,
                        this._pseudo,
                        this._negation
                    ],
                    i           = 0,
                    len         = components.length,
                    component   = null,
                    line,
                    col;


                //get starting line and column for the selector
                line = tokenstream.lt(1).startline;
                col = tokenstream.lt(1).startcol;

                elementname = this._type_selector();
                if (!elementname) {
                    elementname = this._universal();
                }

                if (elementname !== null) {
                    selectortext += elementname;
                }

                while (true) {

                    //whitespace means we're done
                    if (tokenstream.peek() === tokens.s) {
                        break;
                    }

                    //check for each component
                    while (i < len && component === null) {
                        component = components[i++].call(this);
                    }

                    if (component === null) {

                        //we don't have a selector
                        if (selectortext === "") {
                            return null;
                        } else {
                            break;
                        }
                    } else {
                        i = 0;
                        modifiers.push(component);
                        selectortext += component.tostring();
                        component = null;
                    }
                }


                return selectortext !== "" ?
                        new selectorpart(elementname, modifiers, selectortext, line, col) :
                        null;
            },

            //css3 selectors
            _type_selector: function() {
                /*
                 * type_selector
                 *   : [ namespace_prefix ]? element_name
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    ns          = this._namespace_prefix(),
                    elementname = this._element_name();

                if (!elementname) {
                    /*
                     * need to back out the namespace that was read due to both
                     * type_selector and universal reading namespace_prefix
                     * first. kind of hacky, but only way i can figure out
                     * right now how to not change the grammar.
                     */
                    if (ns) {
                        tokenstream.unget();
                        if (ns.length > 1) {
                            tokenstream.unget();
                        }
                    }

                    return null;
                } else {
                    if (ns) {
                        elementname.text = ns + elementname.text;
                        elementname.col -= ns.length;
                    }
                    return elementname;
                }
            },

            //css3 selectors
            _class: function() {
                /*
                 * class
                 *   : '.' ident
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    token;

                if (tokenstream.match(tokens.dot)) {
                    tokenstream.mustmatch(tokens.ident);
                    token = tokenstream.token();
                    return new selectorsubpart("." + token.value, "class", token.startline, token.startcol - 1);
                } else {
                    return null;
                }

            },

            //css3 selectors
            _element_name: function() {
                /*
                 * element_name
                 *   : ident
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    token;

                if (tokenstream.match(tokens.ident)) {
                    token = tokenstream.token();
                    return new selectorsubpart(token.value, "elementname", token.startline, token.startcol);

                } else {
                    return null;
                }
            },

            //css3 selectors
            _namespace_prefix: function() {
                /*
                 * namespace_prefix
                 *   : [ ident | '*' ]? '|'
                 *   ;
                 */
                var tokenstream = this._tokenstream,
                    value       = "";

                //verify that this is a namespace prefix
                if (tokenstream.la(1) === tokens.pipe || tokenstream.la(2) === tokens.pipe) {

                    if (tokenstream.match([tokens.ident, tokens.star])) {
                        value += tokenstream.token().value;
                    }

                    tokenstream.mustmatch(tokens.pipe);
                    value += "|";

                }

                return value.length ? value : null;
            },

            //css3 selectors
            _universal: function() {
                /*
                 * universal
                 *   : [ namespace_prefix ]? '*'
                 *   ;
                 */
                var tokenstream = this._tokenstream,
                    value       = "",
                    ns;

                ns = this._namespace_prefix();
                if (ns) {
                    value += ns;
                }

                if (tokenstream.match(tokens.star)) {
                    value += "*";
                }

                return value.length ? value : null;

            },

            //css3 selectors
            _attrib: function() {
                /*
                 * attrib
                 *   : '[' s* [ namespace_prefix ]? ident s*
                 *         [ [ prefixmatch |
                 *             suffixmatch |
                 *             substringmatch |
                 *             '=' |
                 *             includes |
                 *             dashmatch ] s* [ ident | string ] s*
                 *         ]? ']'
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    value       = null,
                    ns,
                    token;

                if (tokenstream.match(tokens.lbracket)) {
                    token = tokenstream.token();
                    value = token.value;
                    value += this._readwhitespace();

                    ns = this._namespace_prefix();

                    if (ns) {
                        value += ns;
                    }

                    tokenstream.mustmatch(tokens.ident);
                    value += tokenstream.token().value;
                    value += this._readwhitespace();

                    if (tokenstream.match([tokens.prefixmatch, tokens.suffixmatch, tokens.substringmatch,
                            tokens.equals, tokens.includes, tokens.dashmatch])) {

                        value += tokenstream.token().value;
                        value += this._readwhitespace();

                        tokenstream.mustmatch([tokens.ident, tokens.string]);
                        value += tokenstream.token().value;
                        value += this._readwhitespace();
                    }

                    tokenstream.mustmatch(tokens.rbracket);

                    return new selectorsubpart(value + "]", "attribute", token.startline, token.startcol);
                } else {
                    return null;
                }
            },

            //css3 selectors
            _pseudo: function() {

                /*
                 * pseudo
                 *   : ':' ':'? [ ident | functional_pseudo ]
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    pseudo      = null,
                    colons      = ":",
                    line,
                    col;

                if (tokenstream.match(tokens.colon)) {

                    if (tokenstream.match(tokens.colon)) {
                        colons += ":";
                    }

                    if (tokenstream.match(tokens.ident)) {
                        pseudo = tokenstream.token().value;
                        line = tokenstream.token().startline;
                        col = tokenstream.token().startcol - colons.length;
                    } else if (tokenstream.peek() === tokens.function) {
                        line = tokenstream.lt(1).startline;
                        col = tokenstream.lt(1).startcol - colons.length;
                        pseudo = this._functional_pseudo();
                    }

                    if (pseudo) {
                        pseudo = new selectorsubpart(colons + pseudo, "pseudo", line, col);
                    } else {
                        var startline = tokenstream.lt(1).startline,
                            startcol  = tokenstream.lt(0).startcol;
                        throw new syntaxerror("expected a `function` or `ident` after colon at line " + startline + ", col " + startcol + ".", startline, startcol);
                    }
                }

                return pseudo;
            },

            //css3 selectors
            _functional_pseudo: function() {
                /*
                 * functional_pseudo
                 *   : function s* expression ')'
                 *   ;
                */

                var tokenstream = this._tokenstream,
                    value = null;

                if (tokenstream.match(tokens.function)) {
                    value = tokenstream.token().value;
                    value += this._readwhitespace();
                    value += this._expression();
                    tokenstream.mustmatch(tokens.rparen);
                    value += ")";
                }

                return value;
            },

            //css3 selectors
            _expression: function() {
                /*
                 * expression
                 *   : [ [ plus | '-' | dimension | number | string | ident ] s* ]+
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    value       = "";

                while (tokenstream.match([tokens.plus, tokens.minus, tokens.dimension,
                        tokens.number, tokens.string, tokens.ident, tokens.length,
                        tokens.freq, tokens.angle, tokens.time,
                        tokens.resolution, tokens.slash])) {

                    value += tokenstream.token().value;
                    value += this._readwhitespace();
                }

                return value.length ? value : null;

            },

            //css3 selectors
            _negation: function() {
                /*
                 * negation
                 *   : not s* negation_arg s* ')'
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    line,
                    col,
                    value       = "",
                    arg,
                    subpart     = null;

                if (tokenstream.match(tokens.not)) {
                    value = tokenstream.token().value;
                    line = tokenstream.token().startline;
                    col = tokenstream.token().startcol;
                    value += this._readwhitespace();
                    arg = this._negation_arg();
                    value += arg;
                    value += this._readwhitespace();
                    tokenstream.match(tokens.rparen);
                    value += tokenstream.token().value;

                    subpart = new selectorsubpart(value, "not", line, col);
                    subpart.args.push(arg);
                }

                return subpart;
            },

            //css3 selectors
            _negation_arg: function() {
                /*
                 * negation_arg
                 *   : type_selector | universal | hash | class | attrib | pseudo
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    args        = [
                        this._type_selector,
                        this._universal,
                        function() {
                            return tokenstream.match(tokens.hash) ?
                                    new selectorsubpart(tokenstream.token().value, "id", tokenstream.token().startline, tokenstream.token().startcol) :
                                    null;
                        },
                        this._class,
                        this._attrib,
                        this._pseudo
                    ],
                    arg         = null,
                    i           = 0,
                    len         = args.length,
                    line,
                    col,
                    part;

                line = tokenstream.lt(1).startline;
                col = tokenstream.lt(1).startcol;

                while (i < len && arg === null) {

                    arg = args[i].call(this);
                    i++;
                }

                //must be a negation arg
                if (arg === null) {
                    this._unexpectedtoken(tokenstream.lt(1));
                }

                //it's an element name
                if (arg.type === "elementname") {
                    part = new selectorpart(arg, [], arg.tostring(), line, col);
                } else {
                    part = new selectorpart(null, [arg], arg.tostring(), line, col);
                }

                return part;
            },

            _declaration: function() {

                /*
                 * declaration
                 *   : property ':' s* expr prio?
                 *   | /( empty )/
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    property    = null,
                    expr        = null,
                    prio        = null,
                    invalid     = null,
                    propertyname= "";

                property = this._property();
                if (property !== null) {

                    tokenstream.mustmatch(tokens.colon);
                    this._readwhitespace();

                    expr = this._expr();

                    //if there's no parts for the value, it's an error
                    if (!expr || expr.length === 0) {
                        this._unexpectedtoken(tokenstream.lt(1));
                    }

                    prio = this._prio();

                    /*
                     * if hacks should be allowed, then only check the root
                     * property. if hacks should not be allowed, treat
                     * _property or *property as invalid properties.
                     */
                    propertyname = property.tostring();
                    if (this.options.starhack && property.hack === "*" ||
                            this.options.underscorehack && property.hack === "_") {

                        propertyname = property.text;
                    }

                    try {
                        this._validateproperty(propertyname, expr);
                    } catch (ex) {
                        invalid = ex;
                    }

                    this.fire({
                        type:       "property",
                        property:   property,
                        value:      expr,
                        important:  prio,
                        line:       property.line,
                        col:        property.col,
                        invalid:    invalid
                    });

                    return true;
                } else {
                    return false;
                }
            },

            _prio: function() {
                /*
                 * prio
                 *   : important_sym s*
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    result      = tokenstream.match(tokens.important_sym);

                this._readwhitespace();
                return result;
            },

            _expr: function(infunction) {
                /*
                 * expr
                 *   : term [ operator term ]*
                 *   ;
                 */

                var values      = [],
                    //valueparts    = [],
                    value       = null,
                    operator    = null;

                value = this._term(infunction);
                if (value !== null) {

                    values.push(value);

                    do {
                        operator = this._operator(infunction);

                        //if there's an operator, keep building up the value parts
                        if (operator) {
                            values.push(operator);
                        } /*else {
                            //if there's not an operator, you have a full value
                            values.push(new propertyvalue(valueparts, valueparts[0].line, valueparts[0].col));
                            valueparts = [];
                        }*/

                        value = this._term(infunction);

                        if (value === null) {
                            break;
                        } else {
                            values.push(value);
                        }
                    } while (true);
                }

                //cleanup
                /*if (valueparts.length) {
                    values.push(new propertyvalue(valueparts, valueparts[0].line, valueparts[0].col));
                }*/

                return values.length > 0 ? new propertyvalue(values, values[0].line, values[0].col) : null;
            },

            _term: function(infunction) {

                /*
                 * term
                 *   : unary_operator?
                 *     [ number s* | percentage s* | length s* | angle s* |
                 *       time s* | freq s* | function | ie_function ]
                 *   | string s* | ident s* | uri s* | unicoderange s* | hexcolor
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    unary       = null,
                    value       = null,
                    endchar     = null,
                    part        = null,
                    token,
                    line,
                    col;

                //returns the operator or null
                unary = this._unary_operator();
                if (unary !== null) {
                    line = tokenstream.token().startline;
                    col = tokenstream.token().startcol;
                }

                //exception for ie filters
                if (tokenstream.peek() === tokens.ie_function && this.options.iefilters) {

                    value = this._ie_function();
                    if (unary === null) {
                        line = tokenstream.token().startline;
                        col = tokenstream.token().startcol;
                    }

                //see if it's a simple block
                } else if (infunction && tokenstream.match([tokens.lparen, tokens.lbrace, tokens.lbracket])) {

                    token = tokenstream.token();
                    endchar = token.endchar;
                    value = token.value + this._expr(infunction).text;
                    if (unary === null) {
                        line = tokenstream.token().startline;
                        col = tokenstream.token().startcol;
                    }
                    tokenstream.mustmatch(tokens.type(endchar));
                    value += endchar;
                    this._readwhitespace();

                //see if there's a simple match
                } else if (tokenstream.match([tokens.number, tokens.percentage, tokens.length,
                        tokens.angle, tokens.time,
                        tokens.freq, tokens.string, tokens.ident, tokens.uri, tokens.unicode_range])) {

                    value = tokenstream.token().value;
                    if (unary === null) {
                        line = tokenstream.token().startline;
                        col = tokenstream.token().startcol;
                        // correct potentially-inaccurate ident parsing in
                        // propertyvaluepart constructor.
                        part = propertyvaluepart.fromtoken(tokenstream.token());
                    }
                    this._readwhitespace();
                } else {

                    //see if it's a color
                    token = this._hexcolor();
                    if (token === null) {

                        //if there's no unary, get the start of the next token for line/col info
                        if (unary === null) {
                            line = tokenstream.lt(1).startline;
                            col = tokenstream.lt(1).startcol;
                        }

                        //has to be a function
                        if (value === null) {

                            /*
                             * this checks for alpha(opacity=0) style of ie
                             * functions. ie_function only presents progid: style.
                             */
                            if (tokenstream.la(3) === tokens.equals && this.options.iefilters) {
                                value = this._ie_function();
                            } else {
                                value = this._function();
                            }
                        }

                        /*if (value === null) {
                            return null;
                            //throw new error("expected identifier at line " + tokenstream.token().startline + ", character " +  tokenstream.token().startcol + ".");
                        }*/

                    } else {
                        value = token.value;
                        if (unary === null) {
                            line = token.startline;
                            col = token.startcol;
                        }
                    }

                }

                return part !== null ? part : value !== null ?
                        new propertyvaluepart(unary !== null ? unary + value : value, line, col) :
                        null;

            },

            _function: function() {

                /*
                 * function
                 *   : function s* expr ')' s*
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    functiontext = null,
                    expr        = null,
                    lt;

                if (tokenstream.match(tokens.function)) {
                    functiontext = tokenstream.token().value;
                    this._readwhitespace();
                    expr = this._expr(true);
                    functiontext += expr;

                    //start: horrible hack in case it's an ie filter
                    if (this.options.iefilters && tokenstream.peek() === tokens.equals) {
                        do {

                            if (this._readwhitespace()) {
                                functiontext += tokenstream.token().value;
                            }

                            //might be second time in the loop
                            if (tokenstream.la(0) === tokens.comma) {
                                functiontext += tokenstream.token().value;
                            }

                            tokenstream.match(tokens.ident);
                            functiontext += tokenstream.token().value;

                            tokenstream.match(tokens.equals);
                            functiontext += tokenstream.token().value;

                            //functiontext += this._term();
                            lt = tokenstream.peek();
                            while (lt !== tokens.comma && lt !== tokens.s && lt !== tokens.rparen) {
                                tokenstream.get();
                                functiontext += tokenstream.token().value;
                                lt = tokenstream.peek();
                            }
                        } while (tokenstream.match([tokens.comma, tokens.s]));
                    }

                    //end: horrible hack

                    tokenstream.match(tokens.rparen);
                    functiontext += ")";
                    this._readwhitespace();
                }

                return functiontext;
            },

            _ie_function: function() {

                /* (my own extension)
                 * ie_function
                 *   : ie_function s* ident '=' term [s* ','? ident '=' term]+ ')' s*
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    functiontext = null,
                    lt;

                //ie function can begin like a regular function, too
                if (tokenstream.match([tokens.ie_function, tokens.function])) {
                    functiontext = tokenstream.token().value;

                    do {

                        if (this._readwhitespace()) {
                            functiontext += tokenstream.token().value;
                        }

                        //might be second time in the loop
                        if (tokenstream.la(0) === tokens.comma) {
                            functiontext += tokenstream.token().value;
                        }

                        tokenstream.match(tokens.ident);
                        functiontext += tokenstream.token().value;

                        tokenstream.match(tokens.equals);
                        functiontext += tokenstream.token().value;

                        //functiontext += this._term();
                        lt = tokenstream.peek();
                        while (lt !== tokens.comma && lt !== tokens.s && lt !== tokens.rparen) {
                            tokenstream.get();
                            functiontext += tokenstream.token().value;
                            lt = tokenstream.peek();
                        }
                    } while (tokenstream.match([tokens.comma, tokens.s]));

                    tokenstream.match(tokens.rparen);
                    functiontext += ")";
                    this._readwhitespace();
                }

                return functiontext;
            },

            _hexcolor: function() {
                /*
                 * there is a constraint on the color that it must
                 * have either 3 or 6 hex-digits (i.e., [0-9a-fa-f])
                 * after the "#"; e.g., "#000" is ok, but "#abcd" is not.
                 *
                 * hexcolor
                 *   : hash s*
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    token = null,
                    color;

                if (tokenstream.match(tokens.hash)) {

                    //need to do some validation here

                    token = tokenstream.token();
                    color = token.value;
                    if (!/#[a-f0-9]{3,6}/i.test(color)) {
                        throw new syntaxerror("expected a hex color but found '" + color + "' at line " + token.startline + ", col " + token.startcol + ".", token.startline, token.startcol);
                    }
                    this._readwhitespace();
                }

                return token;
            },

            //-----------------------------------------------------------------
            // animations methods
            //-----------------------------------------------------------------

            _keyframes: function() {

                /*
                 * keyframes:
                 *   : keyframes_sym s* keyframe_name s* '{' s* keyframe_rule* '}' {
                 *   ;
                 */
                var tokenstream = this._tokenstream,
                    token,
                    tt,
                    name,
                    prefix = "";

                tokenstream.mustmatch(tokens.keyframes_sym);
                token = tokenstream.token();
                if (/^@\-([^\-]+)\-/.test(token.value)) {
                    prefix = regexp.$1;
                }

                this._readwhitespace();
                name = this._keyframe_name();

                this._readwhitespace();
                tokenstream.mustmatch(tokens.lbrace);

                this.fire({
                    type:   "startkeyframes",
                    name:   name,
                    prefix: prefix,
                    line:   token.startline,
                    col:    token.startcol
                });

                this._readwhitespace();
                tt = tokenstream.peek();

                //check for key
                while (tt === tokens.ident || tt === tokens.percentage) {
                    this._keyframe_rule();
                    this._readwhitespace();
                    tt = tokenstream.peek();
                }

                this.fire({
                    type:   "endkeyframes",
                    name:   name,
                    prefix: prefix,
                    line:   token.startline,
                    col:    token.startcol
                });

                this._readwhitespace();
                tokenstream.mustmatch(tokens.rbrace);
                this._readwhitespace();

            },

            _keyframe_name: function() {

                /*
                 * keyframe_name:
                 *   : ident
                 *   | string
                 *   ;
                 */
                var tokenstream = this._tokenstream;

                tokenstream.mustmatch([tokens.ident, tokens.string]);
                return syntaxunit.fromtoken(tokenstream.token());
            },

            _keyframe_rule: function() {

                /*
                 * keyframe_rule:
                 *   : key_list s*
                 *     '{' s* declaration [ ';' s* declaration ]* '}' s*
                 *   ;
                 */
                var keylist = this._key_list();

                this.fire({
                    type:   "startkeyframerule",
                    keys:   keylist,
                    line:   keylist[0].line,
                    col:    keylist[0].col
                });

                this._readdeclarations(true);

                this.fire({
                    type:   "endkeyframerule",
                    keys:   keylist,
                    line:   keylist[0].line,
                    col:    keylist[0].col
                });

            },

            _key_list: function() {

                /*
                 * key_list:
                 *   : key [ s* ',' s* key]*
                 *   ;
                 */
                var tokenstream = this._tokenstream,
                    keylist = [];

                //must be least one key
                keylist.push(this._key());

                this._readwhitespace();

                while (tokenstream.match(tokens.comma)) {
                    this._readwhitespace();
                    keylist.push(this._key());
                    this._readwhitespace();
                }

                return keylist;
            },

            _key: function() {
                /*
                 * there is a restriction that ident can be only "from" or "to".
                 *
                 * key
                 *   : percentage
                 *   | ident
                 *   ;
                 */

                var tokenstream = this._tokenstream,
                    token;

                if (tokenstream.match(tokens.percentage)) {
                    return syntaxunit.fromtoken(tokenstream.token());
                } else if (tokenstream.match(tokens.ident)) {
                    token = tokenstream.token();

                    if (/from|to/i.test(token.value)) {
                        return syntaxunit.fromtoken(token);
                    }

                    tokenstream.unget();
                }

                //if it gets here, there wasn't a valid token, so time to explode
                this._unexpectedtoken(tokenstream.lt(1));
            },

            //-----------------------------------------------------------------
            // helper methods
            //-----------------------------------------------------------------

            /**
             * not part of css grammar, but useful for skipping over
             * combination of white space and html-style comments.
             * @return {void}
             * @method _skipcruft
             * @private
             */
            _skipcruft: function() {
                while (this._tokenstream.match([tokens.s, tokens.cdo, tokens.cdc])) {
                    //noop
                }
            },

            /**
             * not part of css grammar, but this pattern occurs frequently
             * in the official css grammar. split out here to eliminate
             * duplicate code.
             * @param {boolean} checkstart indicates if the rule should check
             *      for the left brace at the beginning.
             * @param {boolean} readmargins indicates if the rule should check
             *      for margin patterns.
             * @return {void}
             * @method _readdeclarations
             * @private
             */
            _readdeclarations: function(checkstart, readmargins) {
                /*
                 * reads the pattern
                 * s* '{' s* declaration [ ';' s* declaration ]* '}' s*
                 * or
                 * s* '{' s* [ declaration | margin ]? [ ';' s* [ declaration | margin ]? ]* '}' s*
                 * note that this is how it is described in css3 paged media, but is actually incorrect.
                 * a semicolon is only necessary following a declaration if there's another declaration
                 * or margin afterwards.
                 */
                var tokenstream = this._tokenstream,
                    tt;


                this._readwhitespace();

                if (checkstart) {
                    tokenstream.mustmatch(tokens.lbrace);
                }

                this._readwhitespace();

                try {

                    while (true) {

                        if (tokenstream.match(tokens.semicolon) || (readmargins && this._margin())) {
                            //noop
                        } else if (this._declaration()) {
                            if (!tokenstream.match(tokens.semicolon)) {
                                break;
                            }
                        } else {
                            break;
                        }

                        //if ((!this._margin() && !this._declaration()) || !tokenstream.match(tokens.semicolon)){
                        //    break;
                        //}
                        this._readwhitespace();
                    }

                    tokenstream.mustmatch(tokens.rbrace);
                    this._readwhitespace();

                } catch (ex) {
                    if (ex instanceof syntaxerror && !this.options.strict) {

                        //fire error event
                        this.fire({
                            type:       "error",
                            error:      ex,
                            message:    ex.message,
                            line:       ex.line,
                            col:        ex.col
                        });

                        //see if there's another declaration
                        tt = tokenstream.advance([tokens.semicolon, tokens.rbrace]);
                        if (tt === tokens.semicolon) {
                            //if there's a semicolon, then there might be another declaration
                            this._readdeclarations(false, readmargins);
                        } else if (tt !== tokens.rbrace) {
                            //if there's a right brace, the rule is finished so don't do anything
                            //otherwise, rethrow the error because it wasn't handled properly
                            throw ex;
                        }

                    } else {
                        //not a syntax error, rethrow it
                        throw ex;
                    }
                }

            },

            /**
             * in some cases, you can end up with two white space tokens in a
             * row. instead of making a change in every function that looks for
             * white space, this function is used to match as much white space
             * as necessary.
             * @method _readwhitespace
             * @return {string} the white space if found, empty string if not.
             * @private
             */
            _readwhitespace: function() {

                var tokenstream = this._tokenstream,
                    ws = "";

                while (tokenstream.match(tokens.s)) {
                    ws += tokenstream.token().value;
                }

                return ws;
            },


            /**
             * throws an error when an unexpected token is found.
             * @param {object} token the token that was found.
             * @method _unexpectedtoken
             * @return {void}
             * @private
             */
            _unexpectedtoken: function(token) {
                throw new syntaxerror("unexpected token '" + token.value + "' at line " + token.startline + ", col " + token.startcol + ".", token.startline, token.startcol);
            },

            /**
             * helper method used for parsing subparts of a style sheet.
             * @return {void}
             * @method _verifyend
             * @private
             */
            _verifyend: function() {
                if (this._tokenstream.la(1) !== tokens.eof) {
                    this._unexpectedtoken(this._tokenstream.lt(1));
                }
            },

            //-----------------------------------------------------------------
            // validation methods
            //-----------------------------------------------------------------
            _validateproperty: function(property, value) {
                validation.validate(property, value);
            },

            //-----------------------------------------------------------------
            // parsing methods
            //-----------------------------------------------------------------

            parse: function(input) {
                this._tokenstream = new tokenstream(input, tokens);
                this._stylesheet();
            },

            parsestylesheet: function(input) {
                //just passthrough
                return this.parse(input);
            },

            parsemediaquery: function(input) {
                this._tokenstream = new tokenstream(input, tokens);
                var result = this._media_query();

                //if there's anything more, then it's an invalid selector
                this._verifyend();

                //otherwise return result
                return result;
            },

            /**
             * parses a property value (everything after the semicolon).
             * @return {parserlib.css.propertyvalue} the property value.
             * @throws parserlib.util.syntaxerror if an unexpected token is found.
             * @method parserpropertyvalue
             */
            parsepropertyvalue: function(input) {

                this._tokenstream = new tokenstream(input, tokens);
                this._readwhitespace();

                var result = this._expr();

                //okay to have a trailing white space
                this._readwhitespace();

                //if there's anything more, then it's an invalid selector
                this._verifyend();

                //otherwise return result
                return result;
            },

            /**
             * parses a complete css rule, including selectors and
             * properties.
             * @param {string} input the text to parser.
             * @return {boolean} true if the parse completed successfully, false if not.
             * @method parserule
             */
            parserule: function(input) {
                this._tokenstream = new tokenstream(input, tokens);

                //skip any leading white space
                this._readwhitespace();

                var result = this._ruleset();

                //skip any trailing white space
                this._readwhitespace();

                //if there's anything more, then it's an invalid selector
                this._verifyend();

                //otherwise return result
                return result;
            },

            /**
             * parses a single css selector (no comma)
             * @param {string} input the text to parse as a css selector.
             * @return {selector} an object representing the selector.
             * @throws parserlib.util.syntaxerror if an unexpected token is found.
             * @method parseselector
             */
            parseselector: function(input) {

                this._tokenstream = new tokenstream(input, tokens);

                //skip any leading white space
                this._readwhitespace();

                var result = this._selector();

                //skip any trailing white space
                this._readwhitespace();

                //if there's anything more, then it's an invalid selector
                this._verifyend();

                //otherwise return result
                return result;
            },

            /**
             * parses an html style attribute: a set of css declarations
             * separated by semicolons.
             * @param {string} input the text to parse as a style attribute
             * @return {void}
             * @method parsestyleattribute
             */
            parsestyleattribute: function(input) {
                input += "}"; // for error recovery in _readdeclarations()
                this._tokenstream = new tokenstream(input, tokens);
                this._readdeclarations();
            }
        };

    //copy over onto prototype
    for (prop in additions) {
        if (object.prototype.hasownproperty.call(additions, prop)) {
            proto[prop] = additions[prop];
        }
    }

    return proto;
}();


/*
nth
  : s* [ ['-'|'+']? integer? {n} [ s* ['-'|'+'] s* integer ]? |
         ['-'|'+']? integer | {o}{d}{d} | {e}{v}{e}{n} ] s*
  ;
*/

},{"../util/eventtarget":23,"../util/syntaxerror":25,"../util/syntaxunit":26,"./combinator":2,"./mediafeature":4,"./mediaquery":5,"./propertyname":8,"./propertyvalue":9,"./propertyvaluepart":11,"./selector":13,"./selectorpart":14,"./selectorsubpart":15,"./tokenstream":17,"./tokens":18,"./validation":19}],7:[function(require,module,exports){
"use strict";

/* exported properties */

var properties = module.exports = {
    __proto__: null,

    //a
    "align-items"                   : "flex-start | flex-end | center | baseline | stretch",
    "align-content"                 : "flex-start | flex-end | center | space-between | space-around | stretch",
    "align-self"                    : "auto | flex-start | flex-end | center | baseline | stretch",
    "all"                           : "initial | inherit | unset",
    "-webkit-align-items"           : "flex-start | flex-end | center | baseline | stretch",
    "-webkit-align-content"         : "flex-start | flex-end | center | space-between | space-around | stretch",
    "-webkit-align-self"            : "auto | flex-start | flex-end | center | baseline | stretch",
    "alignment-adjust"              : "auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical | <percentage> | <length>",
    "alignment-baseline"            : "auto | baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical",
    "animation"                     : 1,
    "animation-delay"               : "<time>#",
    "animation-direction"           : "<single-animation-direction>#",
    "animation-duration"            : "<time>#",
    "animation-fill-mode"           : "[ none | forwards | backwards | both ]#",
    "animation-iteration-count"     : "[ <number> | infinite ]#",
    "animation-name"                : "[ none | <single-animation-name> ]#",
    "animation-play-state"          : "[ running | paused ]#",
    "animation-timing-function"     : 1,

    //vendor prefixed
    "-moz-animation-delay"               : "<time>#",
    "-moz-animation-direction"           : "[ normal | alternate ]#",
    "-moz-animation-duration"            : "<time>#",
    "-moz-animation-iteration-count"     : "[ <number> | infinite ]#",
    "-moz-animation-name"                : "[ none | <single-animation-name> ]#",
    "-moz-animation-play-state"          : "[ running | paused ]#",

    "-ms-animation-delay"               : "<time>#",
    "-ms-animation-direction"           : "[ normal | alternate ]#",
    "-ms-animation-duration"            : "<time>#",
    "-ms-animation-iteration-count"     : "[ <number> | infinite ]#",
    "-ms-animation-name"                : "[ none | <single-animation-name> ]#",
    "-ms-animation-play-state"          : "[ running | paused ]#",

    "-webkit-animation-delay"               : "<time>#",
    "-webkit-animation-direction"           : "[ normal | alternate ]#",
    "-webkit-animation-duration"            : "<time>#",
    "-webkit-animation-fill-mode"           : "[ none | forwards | backwards | both ]#",
    "-webkit-animation-iteration-count"     : "[ <number> | infinite ]#",
    "-webkit-animation-name"                : "[ none | <single-animation-name> ]#",
    "-webkit-animation-play-state"          : "[ running | paused ]#",

    "-o-animation-delay"               : "<time>#",
    "-o-animation-direction"           : "[ normal | alternate ]#",
    "-o-animation-duration"            : "<time>#",
    "-o-animation-iteration-count"     : "[ <number> | infinite ]#",
    "-o-animation-name"                : "[ none | <single-animation-name> ]#",
    "-o-animation-play-state"          : "[ running | paused ]#",

    "appearance"                    : "none | auto",
    "-moz-appearance"               : "none | button | button-arrow-down | button-arrow-next | button-arrow-previous | button-arrow-up | button-bevel | button-focus | caret | checkbox | checkbox-container | checkbox-label | checkmenuitem | dualbutton | groupbox | listbox | listitem | menuarrow | menubar | menucheckbox | menuimage | menuitem | menuitemtext | menulist | menulist-button | menulist-text | menulist-textfield | menupopup | menuradio | menuseparator | meterbar | meterchunk | progressbar | progressbar-vertical | progresschunk | progresschunk-vertical | radio | radio-container | radio-label | radiomenuitem | range | range-thumb | resizer | resizerpanel | scale-horizontal | scalethumbend | scalethumb-horizontal | scalethumbstart | scalethumbtick | scalethumb-vertical | scale-vertical | scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical | searchfield | separator | sheet | spinner | spinner-downbutton | spinner-textfield | spinner-upbutton | splitter | statusbar | statusbarpanel | tab | tabpanel | tabpanels | tab-scroll-arrow-back | tab-scroll-arrow-forward | textfield | textfield-multiline | toolbar | toolbarbutton | toolbarbutton-dropdown | toolbargripper | toolbox | tooltip | treeheader | treeheadercell | treeheadersortarrow | treeitem | treeline | treetwisty | treetwistyopen | treeview | -moz-mac-unified-toolbar | -moz-win-borderless-glass | -moz-win-browsertabbar-toolbox | -moz-win-communicationstext | -moz-win-communications-toolbox | -moz-win-exclude-glass | -moz-win-glass | -moz-win-mediatext | -moz-win-media-toolbox | -moz-window-button-box | -moz-window-button-box-maximized | -moz-window-button-close | -moz-window-button-maximize | -moz-window-button-minimize | -moz-window-button-restore | -moz-window-frame-bottom | -moz-window-frame-left | -moz-window-frame-right | -moz-window-titlebar | -moz-window-titlebar-maximized",
    "-ms-appearance"                : "none | icon | window | desktop | workspace | document | tooltip | dialog | button | push-button | hyperlink | radio | radio-button | checkbox | menu-item | tab | menu | menubar | pull-down-menu | pop-up-menu | list-menu | radio-group | checkbox-group | outline-tree | range | field | combo-box | signature | password | normal",
    "-webkit-appearance"            : "none | button | button-bevel | caps-lock-indicator | caret | checkbox | default-button | listbox	| listitem | media-fullscreen-button | media-mute-button | media-play-button | media-seek-back-button	| media-seek-forward-button	| media-slider | media-sliderthumb | menulist	| menulist-button	| menulist-text	| menulist-textfield | push-button	| radio	| searchfield	| searchfield-cancel-button	| searchfield-decoration | searchfield-results-button | searchfield-results-decoration | slider-horizontal | slider-vertical | sliderthumb-horizontal | sliderthumb-vertical	| square-button	| textarea	| textfield	| scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbargripper-horizontal | scrollbargripper-vertical | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical",
    "-o-appearance"                 : "none | window | desktop | workspace | document | tooltip | dialog | button | push-button | hyperlink | radio | radio-button | checkbox | menu-item | tab | menu | menubar | pull-down-menu | pop-up-menu | list-menu | radio-group | checkbox-group | outline-tree | range | field | combo-box | signature | password | normal",

    "azimuth"                       : "<azimuth>",

    //b
    "backface-visibility"           : "visible | hidden",
    "background"                    : 1,
    "background-attachment"         : "<attachment>#",
    "background-clip"               : "<box>#",
    "background-color"              : "<color>",
    "background-image"              : "<bg-image>#",
    "background-origin"             : "<box>#",
    "background-position"           : "<bg-position>",
    "background-repeat"             : "<repeat-style>#",
    "background-size"               : "<bg-size>#",
    "baseline-shift"                : "baseline | sub | super | <percentage> | <length>",
    "behavior"                      : 1,
    "binding"                       : 1,
    "bleed"                         : "<length>",
    "bookmark-label"                : "<content> | <attr> | <string>",
    "bookmark-level"                : "none | <integer>",
    "bookmark-state"                : "open | closed",
    "bookmark-target"               : "none | <uri> | <attr>",
    "border"                        : "<border-width> || <border-style> || <color>",
    "border-bottom"                 : "<border-width> || <border-style> || <color>",
    "border-bottom-color"           : "<color>",
    "border-bottom-left-radius"     :  "<x-one-radius>",
    "border-bottom-right-radius"    :  "<x-one-radius>",
    "border-bottom-style"           : "<border-style>",
    "border-bottom-width"           : "<border-width>",
    "border-collapse"               : "collapse | separate",
    "border-color"                  : "<color>{1,4}",
    "border-image"                  : 1,
    "border-image-outset"           : "[ <length> | <number> ]{1,4}",
    "border-image-repeat"           : "[ stretch | repeat | round ]{1,2}",
    "border-image-slice"            : "<border-image-slice>",
    "border-image-source"           : "<image> | none",
    "border-image-width"            : "[ <length> | <percentage> | <number> | auto ]{1,4}",
    "border-left"                   : "<border-width> || <border-style> || <color>",
    "border-left-color"             : "<color>",
    "border-left-style"             : "<border-style>",
    "border-left-width"             : "<border-width>",
    "border-radius"                 : "<border-radius>",
    "border-right"                  : "<border-width> || <border-style> || <color>",
    "border-right-color"            : "<color>",
    "border-right-style"            : "<border-style>",
    "border-right-width"            : "<border-width>",
    "border-spacing"                : "<length>{1,2}",
    "border-style"                  : "<border-style>{1,4}",
    "border-top"                    : "<border-width> || <border-style> || <color>",
    "border-top-color"              : "<color>",
    "border-top-left-radius"        : "<x-one-radius>",
    "border-top-right-radius"       : "<x-one-radius>",
    "border-top-style"              : "<border-style>",
    "border-top-width"              : "<border-width>",
    "border-width"                  : "<border-width>{1,4}",
    "bottom"                        : "<margin-width>",
    "-moz-box-align"                : "start | end | center | baseline | stretch",
    "-moz-box-decoration-break"     : "slice | clone",
    "-moz-box-direction"            : "normal | reverse",
    "-moz-box-flex"                 : "<number>",
    "-moz-box-flex-group"           : "<integer>",
    "-moz-box-lines"                : "single | multiple",
    "-moz-box-ordinal-group"        : "<integer>",
    "-moz-box-orient"               : "horizontal | vertical | inline-axis | block-axis",
    "-moz-box-pack"                 : "start | end | center | justify",
    "-o-box-decoration-break"       : "slice | clone",
    "-webkit-box-align"             : "start | end | center | baseline | stretch",
    "-webkit-box-decoration-break"  : "slice | clone",
    "-webkit-box-direction"         : "normal | reverse",
    "-webkit-box-flex"              : "<number>",
    "-webkit-box-flex-group"        : "<integer>",
    "-webkit-box-lines"             : "single | multiple",
    "-webkit-box-ordinal-group"     : "<integer>",
    "-webkit-box-orient"            : "horizontal | vertical | inline-axis | block-axis",
    "-webkit-box-pack"              : "start | end | center | justify",
    "box-decoration-break"          : "slice | clone",
    "box-shadow"                    : "<box-shadow>",
    "box-sizing"                    : "content-box | border-box",
    "break-after"                   : "auto | always | avoid | left | right | page | column | avoid-page | avoid-column",
    "break-before"                  : "auto | always | avoid | left | right | page | column | avoid-page | avoid-column",
    "break-inside"                  : "auto | avoid | avoid-page | avoid-column",

    //c
    "caption-side"                  : "top | bottom",
    "clear"                         : "none | right | left | both",
    "clip"                          : "<shape> | auto",
    "-webkit-clip-path"             : "<clip-source> | <clip-path> | none",
    "clip-path"                     : "<clip-source> | <clip-path> | none",
    "clip-rule"                     : "nonzero | evenodd",
    "color"                         : "<color>",
    "color-interpolation"           : "auto | srgb | linearrgb",
    "color-interpolation-filters"   : "auto | srgb | linearrgb",
    "color-profile"                 : 1,
    "color-rendering"               : "auto | optimizespeed | optimizequality",
    "column-count"                  : "<integer> | auto",                      //https://www.w3.org/tr/css3-multicol/
    "column-fill"                   : "auto | balance",
    "column-gap"                    : "<length> | normal",
    "column-rule"                   : "<border-width> || <border-style> || <color>",
    "column-rule-color"             : "<color>",
    "column-rule-style"             : "<border-style>",
    "column-rule-width"             : "<border-width>",
    "column-span"                   : "none | all",
    "column-width"                  : "<length> | auto",
    "columns"                       : 1,
    "content"                       : 1,
    "counter-increment"             : 1,
    "counter-reset"                 : 1,
    "crop"                          : "<shape> | auto",
    "cue"                           : "cue-after | cue-before",
    "cue-after"                     : 1,
    "cue-before"                    : 1,
    "cursor"                        : 1,

    //d
    "direction"                     : "ltr | rtl",
    "display"                       : "inline | block | list-item | inline-block | table | inline-table | table-row-group | table-header-group | table-footer-group | table-row | table-column-group | table-column | table-cell | table-caption | grid | inline-grid | run-in | ruby | ruby-base | ruby-text | ruby-base-container | ruby-text-container | contents | none | -moz-box | -moz-inline-block | -moz-inline-box | -moz-inline-grid | -moz-inline-stack | -moz-inline-table | -moz-grid | -moz-grid-group | -moz-grid-line | -moz-groupbox | -moz-deck | -moz-popup | -moz-stack | -moz-marker | -webkit-box | -webkit-inline-box | -ms-flexbox | -ms-inline-flexbox | flex | -webkit-flex | inline-flex | -webkit-inline-flex",
    "dominant-baseline"             : "auto | use-script | no-change | reset-size | ideographic | alphabetic | hanging | mathematical | central | middle | text-after-edge | text-before-edge",
    "drop-initial-after-adjust"     : "central | middle | after-edge | text-after-edge | ideographic | alphabetic | mathematical | <percentage> | <length>",
    "drop-initial-after-align"      : "baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical",
    "drop-initial-before-adjust"    : "before-edge | text-before-edge | central | middle | hanging | mathematical | <percentage> | <length>",
    "drop-initial-before-align"     : "caps-height | baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical",
    "drop-initial-size"             : "auto | line | <length> | <percentage>",
    "drop-initial-value"            : "<integer>",

    //e
    "elevation"                     : "<angle> | below | level | above | higher | lower",
    "empty-cells"                   : "show | hide",
    "enable-background"             : 1,

    //f
    "fill"                          : "<paint>",
    "fill-opacity"                  : "<opacity-value>",
    "fill-rule"                     : "nonzero | evenodd",
    "filter"                        : "<filter-function-list> | none",
    "fit"                           : "fill | hidden | meet | slice",
    "fit-position"                  : 1,
    "flex"                          : "<flex>",
    "flex-basis"                    : "<width>",
    "flex-direction"                : "row | row-reverse | column | column-reverse",
    "flex-flow"                     : "<flex-direction> || <flex-wrap>",
    "flex-grow"                     : "<number>",
    "flex-shrink"                   : "<number>",
    "flex-wrap"                     : "nowrap | wrap | wrap-reverse",
    "-webkit-flex"                  : "<flex>",
    "-webkit-flex-basis"            : "<width>",
    "-webkit-flex-direction"        : "row | row-reverse | column | column-reverse",
    "-webkit-flex-flow"             : "<flex-direction> || <flex-wrap>",
    "-webkit-flex-grow"             : "<number>",
    "-webkit-flex-shrink"           : "<number>",
    "-webkit-flex-wrap"             : "nowrap | wrap | wrap-reverse",
    "-ms-flex"                      : "<flex>",
    "-ms-flex-align"                : "start | end | center | stretch | baseline",
    "-ms-flex-direction"            : "row | row-reverse | column | column-reverse",
    "-ms-flex-order"                : "<number>",
    "-ms-flex-pack"                 : "start | end | center | justify",
    "-ms-flex-wrap"                 : "nowrap | wrap | wrap-reverse",
    "float"                         : "left | right | none",
    "float-offset"                  : 1,
    "flood-color"                   : 1,
    "flood-opacity"                 : "<opacity-value>",
    "font"                          : "<font-shorthand> | caption | icon | menu | message-box | small-caption | status-bar",
    "font-family"                   : "<font-family>",
    "font-feature-settings"         : "<feature-tag-value> | normal",
    "font-kerning"                  : "auto | normal | none",
    "font-size"                     : "<font-size>",
    "font-size-adjust"              : "<number> | none",
    "font-stretch"                  : "<font-stretch>",
    "font-style"                    : "<font-style>",
    "font-variant"                  : "<font-variant> | normal | none",
    "font-variant-alternates"       : "<font-variant-alternates> | normal",
    "font-variant-caps"             : "<font-variant-caps> | normal",
    "font-variant-east-asian"       : "<font-variant-east-asian> | normal",
    "font-variant-ligatures"        : "<font-variant-ligatures> | normal | none",
    "font-variant-numeric"          : "<font-variant-numeric> | normal",
    "font-variant-position"         : "normal | sub | super",
    "font-weight"                   : "<font-weight>",

    //g
    "glyph-orientation-horizontal"  : "<glyph-angle>",
    "glyph-orientation-vertical"    : "auto | <glyph-angle>",
    "grid"                          : 1,
    "grid-area"                     : 1,
    "grid-auto-columns"             : 1,
    "grid-auto-flow"                : 1,
    "grid-auto-position"            : 1,
    "grid-auto-rows"                : 1,
    "grid-cell-stacking"            : "columns | rows | layer",
    "grid-column"                   : 1,
    "grid-columns"                  : 1,
    "grid-column-align"             : "start | end | center | stretch",
    "grid-column-sizing"            : 1,
    "grid-column-start"             : 1,
    "grid-column-end"               : 1,
    "grid-column-span"              : "<integer>",
    "grid-flow"                     : "none | rows | columns",
    "grid-layer"                    : "<integer>",
    "grid-row"                      : 1,
    "grid-rows"                     : 1,
    "grid-row-align"                : "start | end | center | stretch",
    "grid-row-start"                : 1,
    "grid-row-end"                  : 1,
    "grid-row-span"                 : "<integer>",
    "grid-row-sizing"               : 1,
    "grid-template"                 : 1,
    "grid-template-areas"           : 1,
    "grid-template-columns"         : 1,
    "grid-template-rows"            : 1,

    //h
    "hanging-punctuation"           : 1,
    "height"                        : "<margin-width> | <content-sizing>",
    "hyphenate-after"               : "<integer> | auto",
    "hyphenate-before"              : "<integer> | auto",
    "hyphenate-character"           : "<string> | auto",
    "hyphenate-lines"               : "no-limit | <integer>",
    "hyphenate-resource"            : 1,
    "hyphens"                       : "none | manual | auto",

    //i
    "icon"                          : 1,
    "image-orientation"             : "angle | auto",
    "image-rendering"               : "auto | optimizespeed | optimizequality",
    "image-resolution"              : 1,
    "ime-mode"                      : "auto | normal | active | inactive | disabled",
    "inline-box-align"              : "last | <integer>",

    //j
    "justify-content"               : "flex-start | flex-end | center | space-between | space-around",
    "-webkit-justify-content"       : "flex-start | flex-end | center | space-between | space-around",

    //k
    "kerning"                       : "auto | <length>",

    //l
    "left"                          : "<margin-width>",
    "letter-spacing"                : "<length> | normal",
    "line-height"                   : "<line-height>",
    "line-break"                    : "auto | loose | normal | strict",
    "line-stacking"                 : 1,
    "line-stacking-ruby"            : "exclude-ruby | include-ruby",
    "line-stacking-shift"           : "consider-shifts | disregard-shifts",
    "line-stacking-strategy"        : "inline-line-height | block-line-height | max-height | grid-height",
    "list-style"                    : 1,
    "list-style-image"              : "<uri> | none",
    "list-style-position"           : "inside | outside",
    "list-style-type"               : "disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-latin | upper-latin | armenian | georgian | lower-alpha | upper-alpha | none",

    //m
    "margin"                        : "<margin-width>{1,4}",
    "margin-bottom"                 : "<margin-width>",
    "margin-left"                   : "<margin-width>",
    "margin-right"                  : "<margin-width>",
    "margin-top"                    : "<margin-width>",
    "mark"                          : 1,
    "mark-after"                    : 1,
    "mark-before"                   : 1,
    "marker"                        : 1,
    "marker-end"                    : 1,
    "marker-mid"                    : 1,
    "marker-start"                  : 1,
    "marks"                         : 1,
    "marquee-direction"             : 1,
    "marquee-play-count"            : 1,
    "marquee-speed"                 : 1,
    "marquee-style"                 : 1,
    "mask"                          : 1,
    "max-height"                    : "<length> | <percentage> | <content-sizing> | none",
    "max-width"                     : "<length> | <percentage> | <content-sizing> | none",
    "min-height"                    : "<length> | <percentage> | <content-sizing> | contain-floats | -moz-contain-floats | -webkit-contain-floats",
    "min-width"                     : "<length> | <percentage> | <content-sizing> | contain-floats | -moz-contain-floats | -webkit-contain-floats",
    "move-to"                       : 1,

    //n
    "nav-down"                      : 1,
    "nav-index"                     : 1,
    "nav-left"                      : 1,
    "nav-right"                     : 1,
    "nav-up"                        : 1,

    //o
    "object-fit"                    : "fill | contain | cover | none | scale-down",
    "object-position"               : "<position>",
    "opacity"                       : "<opacity-value>",
    "order"                         : "<integer>",
    "-webkit-order"                 : "<integer>",
    "orphans"                       : "<integer>",
    "outline"                       : 1,
    "outline-color"                 : "<color> | invert",
    "outline-offset"                : 1,
    "outline-style"                 : "<border-style>",
    "outline-width"                 : "<border-width>",
    "overflow"                      : "visible | hidden | scroll | auto",
    "overflow-style"                : 1,
    "overflow-wrap"                 : "normal | break-word",
    "overflow-x"                    : 1,
    "overflow-y"                    : 1,

    //p
    "padding"                       : "<padding-width>{1,4}",
    "padding-bottom"                : "<padding-width>",
    "padding-left"                  : "<padding-width>",
    "padding-right"                 : "<padding-width>",
    "padding-top"                   : "<padding-width>",
    "page"                          : 1,
    "page-break-after"              : "auto | always | avoid | left | right",
    "page-break-before"             : "auto | always | avoid | left | right",
    "page-break-inside"             : "auto | avoid",
    "page-policy"                   : 1,
    "pause"                         : 1,
    "pause-after"                   : 1,
    "pause-before"                  : 1,
    "perspective"                   : 1,
    "perspective-origin"            : 1,
    "phonemes"                      : 1,
    "pitch"                         : 1,
    "pitch-range"                   : 1,
    "play-during"                   : 1,
    "pointer-events"                : "auto | none | visiblepainted | visiblefill | visiblestroke | visible | painted | fill | stroke | all",
    "position"                      : "static | relative | absolute | fixed",
    "presentation-level"            : 1,
    "punctuation-trim"              : 1,

    //q
    "quotes"                        : 1,

    //r
    "rendering-intent"              : 1,
    "resize"                        : 1,
    "rest"                          : 1,
    "rest-after"                    : 1,
    "rest-before"                   : 1,
    "richness"                      : 1,
    "right"                         : "<margin-width>",
    "rotation"                      : 1,
    "rotation-point"                : 1,
    "ruby-align"                    : 1,
    "ruby-overhang"                 : 1,
    "ruby-position"                 : 1,
    "ruby-span"                     : 1,

    //s
    "shape-rendering"               : "auto | optimizespeed | crispedges | geometricprecision",
    "size"                          : 1,
    "speak"                         : "normal | none | spell-out",
    "speak-header"                  : "once | always",
    "speak-numeral"                 : "digits | continuous",
    "speak-punctuation"             : "code | none",
    "speech-rate"                   : 1,
    "src"                           : 1,
    "stop-color"                    : 1,
    "stop-opacity"                  : "<opacity-value>",
    "stress"                        : 1,
    "string-set"                    : 1,
    "stroke"                        : "<paint>",
    "stroke-dasharray"              : "none | <dasharray>",
    "stroke-dashoffset"             : "<percentage> | <length>",
    "stroke-linecap"                : "butt | round | square",
    "stroke-linejoin"               : "miter | round | bevel",
    "stroke-miterlimit"             : "<miterlimit>",
    "stroke-opacity"                : "<opacity-value>",
    "stroke-width"                  : "<percentage> | <length>",

    "table-layout"                  : "auto | fixed",
    "tab-size"                      : "<integer> | <length>",
    "target"                        : 1,
    "target-name"                   : 1,
    "target-new"                    : 1,
    "target-position"               : 1,
    "text-align"                    : "left | right | center | justify | match-parent | start | end",
    "text-align-last"               : 1,
    "text-anchor"                   : "start | middle | end",
    "text-decoration"               : "<text-decoration-line> || <text-decoration-style> || <text-decoration-color>",
    "text-decoration-color"         : "<text-decoration-color>",
    "text-decoration-line"          : "<text-decoration-line>",
    "text-decoration-style"         : "<text-decoration-style>",
    "text-emphasis"                 : 1,
    "text-height"                   : 1,
    "text-indent"                   : "<length> | <percentage>",
    "text-justify"                  : "auto | none | inter-word | inter-ideograph | inter-cluster | distribute | kashida",
    "text-outline"                  : 1,
    "text-overflow"                 : 1,
    "text-rendering"                : "auto | optimizespeed | optimizelegibility | geometricprecision",
    "text-shadow"                   : 1,
    "text-transform"                : "capitalize | uppercase | lowercase | none",
    "text-wrap"                     : "normal | none | avoid",
    "top"                           : "<margin-width>",
    "-ms-touch-action"              : "auto | none | pan-x | pan-y | pan-left | pan-right | pan-up | pan-down | manipulation",
    "touch-action"                  : "auto | none | pan-x | pan-y | pan-left | pan-right | pan-up | pan-down | manipulation",
    "transform"                     : 1,
    "transform-origin"              : 1,
    "transform-style"               : 1,
    "transition"                    : 1,
    "transition-delay"              : 1,
    "transition-duration"           : 1,
    "transition-property"           : 1,
    "transition-timing-function"    : 1,

    //u
    "unicode-bidi"                  : "normal | embed | isolate | bidi-override | isolate-override | plaintext",
    "user-modify"                   : "read-only | read-write | write-only",
    "user-select"                   : "none | text | toggle | element | elements | all",

    //v
    "vertical-align"                : "auto | use-script | baseline | sub | super | top | text-top | central | middle | bottom | text-bottom | <percentage> | <length>",
    "visibility"                    : "visible | hidden | collapse",
    "voice-balance"                 : 1,
    "voice-duration"                : 1,
    "voice-family"                  : 1,
    "voice-pitch"                   : 1,
    "voice-pitch-range"             : 1,
    "voice-rate"                    : 1,
    "voice-stress"                  : 1,
    "voice-volume"                  : 1,
    "volume"                        : 1,

    //w
    "white-space"                   : "normal | pre | nowrap | pre-wrap | pre-line | -pre-wrap | -o-pre-wrap | -moz-pre-wrap | -hp-pre-wrap",   // https://perishablepress.com/wrapping-content/
    "white-space-collapse"          : 1,
    "widows"                        : "<integer>",
    "width"                         : "<length> | <percentage> | <content-sizing> | auto",
    "will-change"                   : "<will-change>",
    "word-break"                    : "normal | keep-all | break-all",
    "word-spacing"                  : "<length> | normal",
    "word-wrap"                     : "normal | break-word",
    "writing-mode"                  : "horizontal-tb | vertical-rl | vertical-lr | lr-tb | rl-tb | tb-rl | bt-rl | tb-lr | bt-lr | lr-bt | rl-bt | lr | rl | tb",

    //z
    "z-index"                       : "<integer> | auto",
    "zoom"                          : "<number> | <percentage> | normal"
};

},{}],8:[function(require,module,exports){
"use strict";

module.exports = propertyname;

var syntaxunit = require("../util/syntaxunit");

var parser = require("./parser");

/**
 * represents a selector combinator (whitespace, +, >).
 * @namespace parserlib.css
 * @class propertyname
 * @extends parserlib.util.syntaxunit
 * @constructor
 * @param {string} text the text representation of the unit.
 * @param {string} hack the type of ie hack applied ("*", "_", or null).
 * @param {int} line the line of text on which the unit resides.
 * @param {int} col the column of text on which the unit resides.
 */
function propertyname(text, hack, line, col) {

    syntaxunit.call(this, text, line, col, parser.property_name_type);

    /**
     * the type of ie hack applied ("*", "_", or null).
     * @type string
     * @property hack
     */
    this.hack = hack;

}

propertyname.prototype = new syntaxunit();
propertyname.prototype.constructor = propertyname;
propertyname.prototype.tostring = function() {
    return (this.hack ? this.hack : "") + this.text;
};

},{"../util/syntaxunit":26,"./parser":6}],9:[function(require,module,exports){
"use strict";

module.exports = propertyvalue;

var syntaxunit = require("../util/syntaxunit");

var parser = require("./parser");

/**
 * represents a single part of a css property value, meaning that it represents
 * just everything single part between ":" and ";". if there are multiple values
 * separated by commas, this type represents just one of the values.
 * @param {string[]} parts an array of value parts making up this value.
 * @param {int} line the line of text on which the unit resides.
 * @param {int} col the column of text on which the unit resides.
 * @namespace parserlib.css
 * @class propertyvalue
 * @extends parserlib.util.syntaxunit
 * @constructor
 */
function propertyvalue(parts, line, col) {

    syntaxunit.call(this, parts.join(" "), line, col, parser.property_value_type);

    /**
     * the parts that make up the selector.
     * @type array
     * @property parts
     */
    this.parts = parts;

}

propertyvalue.prototype = new syntaxunit();
propertyvalue.prototype.constructor = propertyvalue;


},{"../util/syntaxunit":26,"./parser":6}],10:[function(require,module,exports){
"use strict";

module.exports = propertyvalueiterator;

/**
 * a utility class that allows for easy iteration over the various parts of a
 * property value.
 * @param {parserlib.css.propertyvalue} value the property value to iterate over.
 * @namespace parserlib.css
 * @class propertyvalueiterator
 * @constructor
 */
function propertyvalueiterator(value) {

    /**
     * iterator value
     * @type int
     * @property _i
     * @private
     */
    this._i = 0;

    /**
     * the parts that make up the value.
     * @type array
     * @property _parts
     * @private
     */
    this._parts = value.parts;

    /**
     * keeps track of bookmarks along the way.
     * @type array
     * @property _marks
     * @private
     */
    this._marks = [];

    /**
     * holds the original property value.
     * @type parserlib.css.propertyvalue
     * @property value
     */
    this.value = value;

}

/**
 * returns the total number of parts in the value.
 * @return {int} the total number of parts in the value.
 * @method count
 */
propertyvalueiterator.prototype.count = function() {
    return this._parts.length;
};

/**
 * indicates if the iterator is positioned at the first item.
 * @return {boolean} true if positioned at first item, false if not.
 * @method isfirst
 */
propertyvalueiterator.prototype.isfirst = function() {
    return this._i === 0;
};

/**
 * indicates if there are more parts of the property value.
 * @return {boolean} true if there are more parts, false if not.
 * @method hasnext
 */
propertyvalueiterator.prototype.hasnext = function() {
    return this._i < this._parts.length;
};

/**
 * marks the current spot in the iteration so it can be restored to
 * later on.
 * @return {void}
 * @method mark
 */
propertyvalueiterator.prototype.mark = function() {
    this._marks.push(this._i);
};

/**
 * returns the next part of the property value or null if there is no next
 * part. does not move the internal counter forward.
 * @return {parserlib.css.propertyvaluepart} the next part of the property value or null if there is no next
 * part.
 * @method peek
 */
propertyvalueiterator.prototype.peek = function(count) {
    return this.hasnext() ? this._parts[this._i + (count || 0)] : null;
};

/**
 * returns the next part of the property value or null if there is no next
 * part.
 * @return {parserlib.css.propertyvaluepart} the next part of the property value or null if there is no next
 * part.
 * @method next
 */
propertyvalueiterator.prototype.next = function() {
    return this.hasnext() ? this._parts[this._i++] : null;
};

/**
 * returns the previous part of the property value or null if there is no
 * previous part.
 * @return {parserlib.css.propertyvaluepart} the previous part of the
 * property value or null if there is no previous part.
 * @method previous
 */
propertyvalueiterator.prototype.previous = function() {
    return this._i > 0 ? this._parts[--this._i] : null;
};

/**
 * restores the last saved bookmark.
 * @return {void}
 * @method restore
 */
propertyvalueiterator.prototype.restore = function() {
    if (this._marks.length) {
        this._i = this._marks.pop();
    }
};

/**
 * drops the last saved bookmark.
 * @return {void}
 * @method drop
 */
propertyvalueiterator.prototype.drop = function() {
    this._marks.pop();
};

},{}],11:[function(require,module,exports){
"use strict";

module.exports = propertyvaluepart;

var syntaxunit = require("../util/syntaxunit");

var colors = require("./colors");
var parser = require("./parser");
var tokens = require("./tokens");

/**
 * represents a single part of a css property value, meaning that it represents
 * just one part of the data between ":" and ";".
 * @param {string} text the text representation of the unit.
 * @param {int} line the line of text on which the unit resides.
 * @param {int} col the column of text on which the unit resides.
 * @namespace parserlib.css
 * @class propertyvaluepart
 * @extends parserlib.util.syntaxunit
 * @constructor
 */
function propertyvaluepart(text, line, col, optionalhint) {
    var hint = optionalhint || {};

    syntaxunit.call(this, text, line, col, parser.property_value_part_type);

    /**
     * indicates the type of value unit.
     * @type string
     * @property type
     */
    this.type = "unknown";

    //figure out what type of data it is

    var temp;

    //it is a measurement?
    if (/^([+\-]?[\d\.]+)([a-z]+)$/i.test(text)) {  //dimension
        this.type = "dimension";
        this.value = +regexp.$1;
        this.units = regexp.$2;

        //try to narrow down
        switch (this.units.tolowercase()) {

            case "em":
            case "rem":
            case "ex":
            case "px":
            case "cm":
            case "mm":
            case "in":
            case "pt":
            case "pc":
            case "ch":
            case "vh":
            case "vw":
            case "vmax":
            case "vmin":
                this.type = "length";
                break;

            case "fr":
                this.type = "grid";
                break;

            case "deg":
            case "rad":
            case "grad":
            case "turn":
                this.type = "angle";
                break;

            case "ms":
            case "s":
                this.type = "time";
                break;

            case "hz":
            case "khz":
                this.type = "frequency";
                break;

            case "dpi":
            case "dpcm":
                this.type = "resolution";
                break;

            //default

        }

    } else if (/^([+\-]?[\d\.]+)%$/i.test(text)) {  //percentage
        this.type = "percentage";
        this.value = +regexp.$1;
    } else if (/^([+\-]?\d+)$/i.test(text)) {  //integer
        this.type = "integer";
        this.value = +regexp.$1;
    } else if (/^([+\-]?[\d\.]+)$/i.test(text)) {  //number
        this.type = "number";
        this.value = +regexp.$1;

    } else if (/^#([a-f0-9]{3,6})/i.test(text)) {  //hexcolor
        this.type = "color";
        temp = regexp.$1;
        if (temp.length === 3) {
            this.red    = parseint(temp.charat(0)+temp.charat(0), 16);
            this.green  = parseint(temp.charat(1)+temp.charat(1), 16);
            this.blue   = parseint(temp.charat(2)+temp.charat(2), 16);
        } else {
            this.red    = parseint(temp.substring(0, 2), 16);
            this.green  = parseint(temp.substring(2, 4), 16);
            this.blue   = parseint(temp.substring(4, 6), 16);
        }
    } else if (/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i.test(text)) { //rgb() color with absolute numbers
        this.type   = "color";
        this.red    = +regexp.$1;
        this.green  = +regexp.$2;
        this.blue   = +regexp.$3;
    } else if (/^rgb\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(text)) { //rgb() color with percentages
        this.type   = "color";
        this.red    = +regexp.$1 * 255 / 100;
        this.green  = +regexp.$2 * 255 / 100;
        this.blue   = +regexp.$3 * 255 / 100;
    } else if (/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/i.test(text)) { //rgba() color with absolute numbers
        this.type   = "color";
        this.red    = +regexp.$1;
        this.green  = +regexp.$2;
        this.blue   = +regexp.$3;
        this.alpha  = +regexp.$4;
    } else if (/^rgba\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d\.]+)\s*\)/i.test(text)) { //rgba() color with percentages
        this.type   = "color";
        this.red    = +regexp.$1 * 255 / 100;
        this.green  = +regexp.$2 * 255 / 100;
        this.blue   = +regexp.$3 * 255 / 100;
        this.alpha  = +regexp.$4;
    } else if (/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(text)) { //hsl()
        this.type   = "color";
        this.hue    = +regexp.$1;
        this.saturation = +regexp.$2 / 100;
        this.lightness  = +regexp.$3 / 100;
    } else if (/^hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d\.]+)\s*\)/i.test(text)) { //hsla() color with percentages
        this.type   = "color";
        this.hue    = +regexp.$1;
        this.saturation = +regexp.$2 / 100;
        this.lightness  = +regexp.$3 / 100;
        this.alpha  = +regexp.$4;
    } else if (/^url\(("([^\\"]|\\.)*")\)/i.test(text)) { //uri
        // generated by tokenstream.readuri, so always double-quoted.
        this.type   = "uri";
        this.uri    = propertyvaluepart.parsestring(regexp.$1);
    } else if (/^([^\(]+)\(/i.test(text)) {
        this.type   = "function";
        this.name   = regexp.$1;
        this.value  = text;
    } else if (/^"([^\n\r\f\\"]|\\\r\n|\\[^\r0-9a-f]|\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)*"/i.test(text)) {    //double-quoted string
        this.type   = "string";
        this.value  = propertyvaluepart.parsestring(text);
    } else if (/^'([^\n\r\f\\']|\\\r\n|\\[^\r0-9a-f]|\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)*'/i.test(text)) {    //single-quoted string
        this.type   = "string";
        this.value  = propertyvaluepart.parsestring(text);
    } else if (colors[text.tolowercase()]) {  //named color
        this.type   = "color";
        temp        = colors[text.tolowercase()].substring(1);
        this.red    = parseint(temp.substring(0, 2), 16);
        this.green  = parseint(temp.substring(2, 4), 16);
        this.blue   = parseint(temp.substring(4, 6), 16);
    } else if (/^[,\/]$/.test(text)) {
        this.type   = "operator";
        this.value  = text;
    } else if (/^-?[a-z_\u00a0-\uffff][a-z0-9\-_\u00a0-\uffff]*$/i.test(text)) {
        this.type   = "identifier";
        this.value  = text;
    }

    // there can be ambiguity with escape sequences in identifiers, as
    // well as with "color" parts which are also "identifiers", so record
    // an explicit hint when the token generating this propertyvaluepart
    // was an identifier.
    this.wasident = boolean(hint.ident);

}

propertyvaluepart.prototype = new syntaxunit();
propertyvaluepart.prototype.constructor = propertyvaluepart;

/**
 * helper method to parse a css string.
 */
propertyvaluepart.parsestring = function(str) {
    str = str.slice(1, -1); // strip surrounding single/double quotes
    var replacer = function(match, esc) {
        if (/^(\n|\r\n|\r|\f)$/.test(esc)) {
            return "";
        }
        var m = /^[0-9a-f]{1,6}/i.exec(esc);
        if (m) {
            var codepoint = parseint(m[0], 16);
            if (string.fromcodepoint) {
                return string.fromcodepoint(codepoint);
            } else {
                // xxx no support for surrogates on old javascript engines.
                return string.fromcharcode(codepoint);
            }
        }
        return esc;
    };
    return str.replace(/\\(\r\n|[^\r0-9a-f]|[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)/ig,
                       replacer);
};

/**
 * helper method to serialize a css string.
 */
propertyvaluepart.serializestring = function(value) {
    var replacer = function(match, c) {
        if (c === "\"") {
            return "\\" + c;
        }
        var cp = string.codepointat ? string.codepointat(0) :
            // we only escape non-surrogate chars, so using charcodeat
            // is harmless here.
            string.charcodeat(0);
        return "\\" + cp.tostring(16) + " ";
    };
    return "\"" + value.replace(/["\r\n\f]/g, replacer) + "\"";
};

/**
 * create a new syntax unit based solely on the given token.
 * convenience method for creating a new syntax unit when
 * it represents a single token instead of multiple.
 * @param {object} token the token object to represent.
 * @return {parserlib.css.propertyvaluepart} the object representing the token.
 * @static
 * @method fromtoken
 */
propertyvaluepart.fromtoken = function(token) {
    var part = new propertyvaluepart(token.value, token.startline, token.startcol, {
        // tokens can have escaped characters that would fool the type
        // identification in the propertyvaluepart constructor, so pass
        // in a hint if this was an identifier.
        ident: token.type === tokens.ident
    });
    return part;
};

},{"../util/syntaxunit":26,"./colors":1,"./parser":6,"./tokens":18}],12:[function(require,module,exports){
"use strict";

var pseudos = module.exports = {
    __proto__:       null,
    ":first-letter": 1,
    ":first-line":   1,
    ":before":       1,
    ":after":        1
};

pseudos.element = 1;
pseudos.class = 2;

pseudos.iselement = function(pseudo) {
    return pseudo.indexof("::") === 0 || pseudos[pseudo.tolowercase()] === pseudos.element;
};

},{}],13:[function(require,module,exports){
"use strict";

module.exports = selector;

var syntaxunit = require("../util/syntaxunit");

var parser = require("./parser");
var specificity = require("./specificity");

/**
 * represents an entire single selector, including all parts but not
 * including multiple selectors (those separated by commas).
 * @namespace parserlib.css
 * @class selector
 * @extends parserlib.util.syntaxunit
 * @constructor
 * @param {array} parts array of selectors parts making up this selector.
 * @param {int} line the line of text on which the unit resides.
 * @param {int} col the column of text on which the unit resides.
 */
function selector(parts, line, col) {

    syntaxunit.call(this, parts.join(" "), line, col, parser.selector_type);

    /**
     * the parts that make up the selector.
     * @type array
     * @property parts
     */
    this.parts = parts;

    /**
     * the specificity of the selector.
     * @type parserlib.css.specificity
     * @property specificity
     */
    this.specificity = specificity.calculate(this);

}

selector.prototype = new syntaxunit();
selector.prototype.constructor = selector;


},{"../util/syntaxunit":26,"./parser":6,"./specificity":16}],14:[function(require,module,exports){
"use strict";

module.exports = selectorpart;

var syntaxunit = require("../util/syntaxunit");

var parser = require("./parser");

/**
 * represents a single part of a selector string, meaning a single set of
 * element name and modifiers. this does not include combinators such as
 * spaces, +, >, etc.
 * @namespace parserlib.css
 * @class selectorpart
 * @extends parserlib.util.syntaxunit
 * @constructor
 * @param {string} elementname the element name in the selector or null
 *      if there is no element name.
 * @param {array} modifiers array of individual modifiers for the element.
 *      may be empty if there are none.
 * @param {string} text the text representation of the unit.
 * @param {int} line the line of text on which the unit resides.
 * @param {int} col the column of text on which the unit resides.
 */
function selectorpart(elementname, modifiers, text, line, col) {

    syntaxunit.call(this, text, line, col, parser.selector_part_type);

    /**
     * the tag name of the element to which this part
     * of the selector affects.
     * @type string
     * @property elementname
     */
    this.elementname = elementname;

    /**
     * the parts that come after the element name, such as class names, ids,
     * pseudo classes/elements, etc.
     * @type array
     * @property modifiers
     */
    this.modifiers = modifiers;

}

selectorpart.prototype = new syntaxunit();
selectorpart.prototype.constructor = selectorpart;


},{"../util/syntaxunit":26,"./parser":6}],15:[function(require,module,exports){
"use strict";

module.exports = selectorsubpart;

var syntaxunit = require("../util/syntaxunit");

var parser = require("./parser");

/**
 * represents a selector modifier string, meaning a class name, element name,
 * element id, pseudo rule, etc.
 * @namespace parserlib.css
 * @class selectorsubpart
 * @extends parserlib.util.syntaxunit
 * @constructor
 * @param {string} text the text representation of the unit.
 * @param {string} type the type of selector modifier.
 * @param {int} line the line of text on which the unit resides.
 * @param {int} col the column of text on which the unit resides.
 */
function selectorsubpart(text, type, line, col) {

    syntaxunit.call(this, text, line, col, parser.selector_sub_part_type);

    /**
     * the type of modifier.
     * @type string
     * @property type
     */
    this.type = type;

    /**
     * some subparts have arguments, this represents them.
     * @type array
     * @property args
     */
    this.args = [];

}

selectorsubpart.prototype = new syntaxunit();
selectorsubpart.prototype.constructor = selectorsubpart;


},{"../util/syntaxunit":26,"./parser":6}],16:[function(require,module,exports){
"use strict";

module.exports = specificity;

var pseudos = require("./pseudos");
var selectorpart = require("./selectorpart");

/**
 * represents a selector's specificity.
 * @namespace parserlib.css
 * @class specificity
 * @constructor
 * @param {int} a should be 1 for inline styles, zero for stylesheet styles
 * @param {int} b number of id selectors
 * @param {int} c number of classes and pseudo classes
 * @param {int} d number of element names and pseudo elements
 */
function specificity(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
}

specificity.prototype = {
    constructor: specificity,

    /**
     * compare this specificity to another.
     * @param {specificity} other the other specificity to compare to.
     * @return {int} -1 if the other specificity is larger, 1 if smaller, 0 if equal.
     * @method compare
     */
    compare: function(other) {
        var comps = ["a", "b", "c", "d"],
            i, len;

        for (i=0, len=comps.length; i < len; i++) {
            if (this[comps[i]] < other[comps[i]]) {
                return -1;
            } else if (this[comps[i]] > other[comps[i]]) {
                return 1;
            }
        }

        return 0;
    },

    /**
     * creates a numeric value for the specificity.
     * @return {int} the numeric value for the specificity.
     * @method valueof
     */
    valueof: function() {
        return (this.a * 1000) + (this.b * 100) + (this.c * 10) + this.d;
    },

    /**
     * returns a string representation for specificity.
     * @return {string} the string representation of specificity.
     * @method tostring
     */
    tostring: function() {
        return this.a + "," + this.b + "," + this.c + "," + this.d;
    }

};

/**
 * calculates the specificity of the given selector.
 * @param {parserlib.css.selector} the selector to calculate specificity for.
 * @return {parserlib.css.specificity} the specificity of the selector.
 * @static
 * @method calculate
 */
specificity.calculate = function(selector) {

    var i, len,
        part,
        b=0, c=0, d=0;

    function updatevalues(part) {

        var i, j, len, num,
            elementname = part.elementname ? part.elementname.text : "",
            modifier;

        if (elementname && elementname.charat(elementname.length-1) !== "*") {
            d++;
        }

        for (i=0, len=part.modifiers.length; i < len; i++) {
            modifier = part.modifiers[i];
            switch (modifier.type) {
                case "class":
                case "attribute":
                    c++;
                    break;

                case "id":
                    b++;
                    break;

                case "pseudo":
                    if (pseudos.iselement(modifier.text)) {
                        d++;
                    } else {
                        c++;
                    }
                    break;

                case "not":
                    for (j=0, num=modifier.args.length; j < num; j++) {
                        updatevalues(modifier.args[j]);
                    }
            }
        }
    }

    for (i=0, len=selector.parts.length; i < len; i++) {
        part = selector.parts[i];

        if (part instanceof selectorpart) {
            updatevalues(part);
        }
    }

    return new specificity(0, b, c, d);
};

},{"./pseudos":12,"./selectorpart":14}],17:[function(require,module,exports){
"use strict";

module.exports = tokenstream;

var tokenstreambase = require("../util/tokenstreambase");

var propertyvaluepart = require("./propertyvaluepart");
var tokens = require("./tokens");

var h = /^[0-9a-fa-f]$/,
    nonascii = /^[\u00a0-\uffff]$/,
    nl = /\n|\r\n|\r|\f/,
    whitespace = /\u0009|\u000a|\u000c|\u000d|\u0020/;

//-----------------------------------------------------------------------------
// helper functions
//-----------------------------------------------------------------------------


function ishexdigit(c) {
    return c !== null && h.test(c);
}

function isdigit(c) {
    return c !== null && /\d/.test(c);
}

function iswhitespace(c) {
    return c !== null && whitespace.test(c);
}

function isnewline(c) {
    return c !== null && nl.test(c);
}

function isnamestart(c) {
    return c !== null && /[a-z_\u00a0-\uffff\\]/i.test(c);
}

function isnamechar(c) {
    return c !== null && (isnamestart(c) || /[0-9\-\\]/.test(c));
}

function isidentstart(c) {
    return c !== null && (isnamestart(c) || /\-\\/.test(c));
}

function mix(receiver, supplier) {
    for (var prop in supplier) {
        if (object.prototype.hasownproperty.call(supplier, prop)) {
            receiver[prop] = supplier[prop];
        }
    }
    return receiver;
}

//-----------------------------------------------------------------------------
// css token stream
//-----------------------------------------------------------------------------


/**
 * a token stream that produces css tokens.
 * @param {string|reader} input the source of text to tokenize.
 * @constructor
 * @class tokenstream
 * @namespace parserlib.css
 */
function tokenstream(input) {
    tokenstreambase.call(this, input, tokens);
}

tokenstream.prototype = mix(new tokenstreambase(), {

    /**
     * overrides the tokenstreambase method of the same name
     * to produce css tokens.
     * @return {object} a token object representing the next token.
     * @method _gettoken
     * @private
     */
    _gettoken: function() {

        var c,
            reader = this._reader,
            token   = null,
            startline   = reader.getline(),
            startcol    = reader.getcol();

        c = reader.read();


        while (c) {
            switch (c) {

                /*
                 * potential tokens:
                 * - comment
                 * - slash
                 * - char
                 */
                case "/":

                    if (reader.peek() === "*") {
                        token = this.commenttoken(c, startline, startcol);
                    } else {
                        token = this.chartoken(c, startline, startcol);
                    }
                    break;

                /*
                 * potential tokens:
                 * - dashmatch
                 * - includes
                 * - prefixmatch
                 * - suffixmatch
                 * - substringmatch
                 * - char
                 */
                case "|":
                case "~":
                case "^":
                case "$":
                case "*":
                    if (reader.peek() === "=") {
                        token = this.comparisontoken(c, startline, startcol);
                    } else {
                        token = this.chartoken(c, startline, startcol);
                    }
                    break;

                /*
                 * potential tokens:
                 * - string
                 * - invalid
                 */
                case "\"":
                case "'":
                    token = this.stringtoken(c, startline, startcol);
                    break;

                /*
                 * potential tokens:
                 * - hash
                 * - char
                 */
                case "#":
                    if (isnamechar(reader.peek())) {
                        token = this.hashtoken(c, startline, startcol);
                    } else {
                        token = this.chartoken(c, startline, startcol);
                    }
                    break;

                /*
                 * potential tokens:
                 * - dot
                 * - number
                 * - dimension
                 * - percentage
                 */
                case ".":
                    if (isdigit(reader.peek())) {
                        token = this.numbertoken(c, startline, startcol);
                    } else {
                        token = this.chartoken(c, startline, startcol);
                    }
                    break;

                /*
                 * potential tokens:
                 * - cdc
                 * - minus
                 * - number
                 * - dimension
                 * - percentage
                 */
                case "-":
                    if (reader.peek() === "-") {  //could be closing html-style comment
                        token = this.htmlcommentendtoken(c, startline, startcol);
                    } else if (isnamestart(reader.peek())) {
                        token = this.identorfunctiontoken(c, startline, startcol);
                    } else {
                        token = this.chartoken(c, startline, startcol);
                    }
                    break;

                /*
                 * potential tokens:
                 * - important_sym
                 * - char
                 */
                case "!":
                    token = this.importanttoken(c, startline, startcol);
                    break;

                /*
                 * any at-keyword or char
                 */
                case "@":
                    token = this.atruletoken(c, startline, startcol);
                    break;

                /*
                 * potential tokens:
                 * - not
                 * - char
                 */
                case ":":
                    token = this.nottoken(c, startline, startcol);
                    break;

                /*
                 * potential tokens:
                 * - cdo
                 * - char
                 */
                case "<":
                    token = this.htmlcommentstarttoken(c, startline, startcol);
                    break;

                /*
                 * potential tokens:
                 * - ident
                 * - char
                 */
                case "\\":
                    if (/[^\r\n\f]/.test(reader.peek())) {
                        token = this.identorfunctiontoken(this.readescape(c, true), startline, startcol);
                    } else {
                        token = this.chartoken(c, startline, startcol);
                    }
                    break;

                /*
                 * potential tokens:
                 * - unicode_range
                 * - url
                 * - char
                 */
                case "u":
                case "u":
                    if (reader.peek() === "+") {
                        token = this.unicoderangetoken(c, startline, startcol);
                        break;
                    }
                    /* falls through */
                default:

                    /*
                     * potential tokens:
                     * - number
                     * - dimension
                     * - length
                     * - freq
                     * - time
                     * - ems
                     * - exs
                     * - angle
                     */
                    if (isdigit(c)) {
                        token = this.numbertoken(c, startline, startcol);
                    } else

                    /*
                     * potential tokens:
                     * - s
                     */
                    if (iswhitespace(c)) {
                        token = this.whitespacetoken(c, startline, startcol);
                    } else

                    /*
                     * potential tokens:
                     * - ident
                     */
                    if (isidentstart(c)) {
                        token = this.identorfunctiontoken(c, startline, startcol);
                    } else {
                       /*
                        * potential tokens:
                        * - char
                        * - plus
                        */
                        token = this.chartoken(c, startline, startcol);
                    }

            }

            //make sure this token is wanted
            //todo: check channel
            break;
        }

        if (!token && c === null) {
            token = this.createtoken(tokens.eof, null, startline, startcol);
        }

        return token;
    },

    //-------------------------------------------------------------------------
    // methods to create tokens
    //-------------------------------------------------------------------------

    /**
     * produces a token based on available data and the current
     * reader position information. this method is called by other
     * private methods to create tokens and is never called directly.
     * @param {int} tt the token type.
     * @param {string} value the text value of the token.
     * @param {int} startline the beginning line for the character.
     * @param {int} startcol the beginning column for the character.
     * @param {object} options (optional) specifies a channel property
     *      to indicate that a different channel should be scanned
     *      and/or a hide property indicating that the token should
     *      be hidden.
     * @return {object} a token object.
     * @method createtoken
     */
    createtoken: function(tt, value, startline, startcol, options) {
        var reader = this._reader;
        options = options || {};

        return {
            value:      value,
            type:       tt,
            channel:    options.channel,
            endchar:    options.endchar,
            hide:       options.hide || false,
            startline:  startline,
            startcol:   startcol,
            endline:    reader.getline(),
            endcol:     reader.getcol()
        };
    },

    //-------------------------------------------------------------------------
    // methods to create specific tokens
    //-------------------------------------------------------------------------

    /**
     * produces a token for any at-rule. if the at-rule is unknown, then
     * the token is for a single "@" character.
     * @param {string} first the first character for the token.
     * @param {int} startline the beginning line for the character.
     * @param {int} startcol the beginning column for the character.
     * @return {object} a token object.
     * @method atruletoken
     */
    atruletoken: function(first, startline, startcol) {
        var rule    = first,
            reader  = this._reader,
            tt      = tokens.char,
            ident;

        /*
         * first, mark where we are. there are only four @ rules,
         * so anything else is really just an invalid token.
         * basically, if this doesn't match one of the known @
         * rules, just return '@' as an unknown token and allow
         * parsing to continue after that point.
         */
        reader.mark();

        //try to find the at-keyword
        ident = this.readname();
        rule = first + ident;
        tt = tokens.type(rule.tolowercase());

        //if it's not valid, use the first character only and reset the reader
        if (tt === tokens.char || tt === tokens.unknown) {
            if (rule.length > 1) {
                tt = tokens.unknown_sym;
            } else {
                tt = tokens.char;
                rule = first;
                reader.reset();
            }
        }

        return this.createtoken(tt, rule, startline, startcol);
    },

    /**
     * produces a character token based on the given character
     * and location in the stream. if there's a special (non-standard)
     * token name, this is used; otherwise char is used.
     * @param {string} c the character for the token.
     * @param {int} startline the beginning line for the character.
     * @param {int} startcol the beginning column for the character.
     * @return {object} a token object.
     * @method chartoken
     */
    chartoken: function(c, startline, startcol) {
        var tt = tokens.type(c);
        var opts = {};

        if (tt === -1) {
            tt = tokens.char;
        } else {
            opts.endchar = tokens[tt].endchar;
        }

        return this.createtoken(tt, c, startline, startcol, opts);
    },

    /**
     * produces a character token based on the given character
     * and location in the stream. if there's a special (non-standard)
     * token name, this is used; otherwise char is used.
     * @param {string} first the first character for the token.
     * @param {int} startline the beginning line for the character.
     * @param {int} startcol the beginning column for the character.
     * @return {object} a token object.
     * @method commenttoken
     */
    commenttoken: function(first, startline, startcol) {
        var comment = this.readcomment(first);

        return this.createtoken(tokens.comment, comment, startline, startcol);
    },

    /**
     * produces a comparison token based on the given character
     * and location in the stream. the next character must be
     * read and is already known to be an equals sign.
     * @param {string} c the character for the token.
     * @param {int} startline the beginning line for the character.
     * @param {int} startcol the beginning column for the character.
     * @return {object} a token object.
     * @method comparisontoken
     */
    comparisontoken: function(c, startline, startcol) {
        var reader  = this._reader,
            comparison  = c + reader.read(),
            tt      = tokens.type(comparison) || tokens.char;

        return this.createtoken(tt, comparison, startline, startcol);
    },

    /**
     * produces a hash token based on the specified information. the
     * first character provided is the pound sign (#) and then this
     * method reads a name afterward.
     * @param {string} first the first character (#) in the hash name.
     * @param {int} startline the beginning line for the character.
     * @param {int} startcol the beginning column for the character.
     * @return {object} a token object.
     * @method hashtoken
     */
    hashtoken: function(first, startline, startcol) {
        var name    = this.readname(first);

        return this.createtoken(tokens.hash, name, startline, startcol);
    },

    /**
     * produces a cdo or char token based on the specified information. the
     * first character is provided and the rest is read by the function to determine
     * the correct token to create.
     * @param {string} first the first character in the token.
     * @param {int} startline the beginning line for the character.
     * @param {int} startcol the beginning column for the character.
     * @return {object} a token object.
     * @method htmlcommentstarttoken
     */
    htmlcommentstarttoken: function(first, startline, startcol) {
        var reader      = this._reader,
            text        = first;

        reader.mark();
        text += reader.readcount(3);

        if (text === "<!--") {
            return this.createtoken(tokens.cdo, text, startline, startcol);
        } else {
            reader.reset();
            return this.chartoken(first, startline, startcol);
        }
    },

    /**
     * produces a cdc or char token based on the specified information. the
     * first character is provided and the rest is read by the function to determine
     * the correct token to create.
     * @param {string} first the first character in the token.
     * @param {int} startline the beginning line for the character.
     * @param {int} startcol the beginning column for the character.
     * @return {object} a token object.
     * @method htmlcommentendtoken
     */
    htmlcommentendtoken: function(first, startline, startcol) {
        var reader      = this._reader,
            text        = first;

        reader.mark();
        text += reader.readcount(2);

        if (text === "-->") {
            return this.createtoken(tokens.cdc, text, startline, startcol);
        } else {
            reader.reset();
            return this.chartoken(first, startline, startcol);
        }
    },

    /**
     * produces an ident or function token based on the specified information. the
     * first character is provided and the rest is read by the function to determine
     * the correct token to create.
     * @param {string} first the first character in the identifier.
     * @param {int} startline the beginning line for the character.
     * @param {int} startcol the beginning column for the character.
     * @return {object} a token object.
     * @method identorfunctiontoken
     */
    identorfunctiontoken: function(first, startline, startcol) {
        var reader  = this._reader,
            ident   = this.readname(first),
            tt      = tokens.ident,
            urifns  = ["url(", "url-prefix(", "domain("],
            uri;

        //if there's a left paren immediately after, it's a uri or function
        if (reader.peek() === "(") {
            ident += reader.read();
            if (urifns.indexof(ident.tolowercase()) > -1) {
                reader.mark();
                uri = this.readuri(ident);
                if (uri === null) {
                    //didn't find a valid url or there's no closing paren
                    reader.reset();
                    tt = tokens.function;
                } else {
                    tt = tokens.uri;
                    ident = uri;
                }
            } else {
                tt = tokens.function;
            }
        } else if (reader.peek() === ":") {  //might be an ie function

            //ie-specific functions always being with progid:
            if (ident.tolowercase() === "progid") {
                ident += reader.readto("(");
                tt = tokens.ie_function;
            }
        }

        return this.createtoken(tt, ident, startline, startcol);
    },

    /**
     * produces an important_sym or char token based on the specified information. the
     * first character is provided and the rest is read by the function to determine
     * the correct token to create.
     * @param {string} first the first character in the token.
     * @param {int} startline the beginning line for the character.
     * @param {int} startcol the beginning column for the character.
     * @return {object} a token object.
     * @method importanttoken
     */
    importanttoken: function(first, startline, startcol) {
        var reader      = this._reader,
            important   = first,
            tt          = tokens.char,
            temp,
            c;

        reader.mark();
        c = reader.read();

        while (c) {

            //there can be a comment in here
            if (c === "/") {

                //if the next character isn't a star, then this isn't a valid !important token
                if (reader.peek() !== "*") {
                    break;
                } else {
                    temp = this.readcomment(c);
                    if (temp === "") {    //broken!
                        break;
                    }
                }
            } else if (iswhitespace(c)) {
                important += c + this.readwhitespace();
            } else if (/i/i.test(c)) {
                temp = reader.readcount(8);
                if (/mportant/i.test(temp)) {
                    important += c + temp;
                    tt = tokens.important_sym;

                }
                break;  //we're done
            } else {
                break;
            }

            c = reader.read();
        }

        if (tt === tokens.char) {
            reader.reset();
            return this.chartoken(first, startline, startcol);
        } else {
            return this.createtoken(tt, important, startline, startcol);
        }


    },

    /**
     * produces a not or char token based on the specified information. the
     * first character is provided and the rest is read by the function to determine
     * the correct token to create.
     * @param {string} first the first character in the token.
     * @param {int} startline the beginning line for the character.
     * @param {int} startcol the beginning column for the character.
     * @return {object} a token object.
     * @method nottoken
     */
    nottoken: function(first, startline, startcol) {
        var reader      = this._reader,
            text        = first;

        reader.mark();
        text += reader.readcount(4);

        if (text.tolowercase() === ":not(") {
            return this.createtoken(tokens.not, text, startline, startcol);
        } else {
            reader.reset();
            return this.chartoken(first, startline, startcol);
        }
    },

    /**
     * produces a number token based on the given character
     * and location in the stream. this may return a token of
     * number, ems, exs, length, angle, time, freq, dimension,
     * or percentage.
     * @param {string} first the first character for the token.
     * @param {int} startline the beginning line for the character.
     * @param {int} startcol the beginning column for the character.
     * @return {object} a token object.
     * @method numbertoken
     */
    numbertoken: function(first, startline, startcol) {
        var reader  = this._reader,
            value   = this.readnumber(first),
            ident,
            tt      = tokens.number,
            c       = reader.peek();

        if (isidentstart(c)) {
            ident = this.readname(reader.read());
            value += ident;

            if (/^em$|^ex$|^px$|^gd$|^rem$|^vw$|^vh$|^vmax$|^vmin$|^ch$|^cm$|^mm$|^in$|^pt$|^pc$/i.test(ident)) {
                tt = tokens.length;
            } else if (/^deg|^rad$|^grad$|^turn$/i.test(ident)) {
                tt = tokens.angle;
            } else if (/^ms$|^s$/i.test(ident)) {
                tt = tokens.time;
            } else if (/^hz$|^khz$/i.test(ident)) {
                tt = tokens.freq;
            } else if (/^dpi$|^dpcm$/i.test(ident)) {
                tt = tokens.resolution;
            } else {
                tt = tokens.dimension;
            }

        } else if (c === "%") {
            value += reader.read();
            tt = tokens.percentage;
        }

        return this.createtoken(tt, value, startline, startcol);
    },

    /**
     * produces a string token based on the given character
     * and location in the stream. since strings may be indicated
     * by single or double quotes, a failure to match starting
     * and ending quotes results in an invalid token being generated.
     * the first character in the string is passed in and then
     * the rest are read up to and including the final quotation mark.
     * @param {string} first the first character in the string.
     * @param {int} startline the beginning line for the character.
     * @param {int} startcol the beginning column for the character.
     * @return {object} a token object.
     * @method stringtoken
     */
    stringtoken: function(first, startline, startcol) {
        var delim   = first,
            string  = first,
            reader  = this._reader,
            tt      = tokens.string,
            c       = reader.read(),
            i;

        while (c) {
            string += c;

            if (c === "\\") {
                c = reader.read();
                if (c === null) {
                    break; // premature eof after backslash
                } else if (/[^\r\n\f0-9a-f]/i.test(c)) {
                    // single-character escape
                    string += c;
                } else {
                    // read up to six hex digits
                    for (i=0; ishexdigit(c) && i<6; i++) {
                        string += c;
                        c = reader.read();
                    }
                    // swallow trailing newline or space
                    if (c === "\r" && reader.peek() === "\n") {
                        string += c;
                        c = reader.read();
                    }
                    if (iswhitespace(c)) {
                        string += c;
                    } else {
                        // this character is null or not part of the escape;
                        // jump back to the top to process it.
                        continue;
                    }
                }
            } else if (c === delim) {
                break; // delimiter found.
            } else if (isnewline(reader.peek())) {
                // newline without an escapement: it's an invalid string
                tt = tokens.invalid;
                break;
            }
            c = reader.read();
        }

        //if c is null, that means we're out of input and the string was never closed
        if (c === null) {
            tt = tokens.invalid;
        }

        return this.createtoken(tt, string, startline, startcol);
    },

    unicoderangetoken: function(first, startline, startcol) {
        var reader  = this._reader,
            value   = first,
            temp,
            tt      = tokens.char;

        //then it should be a unicode range
        if (reader.peek() === "+") {
            reader.mark();
            value += reader.read();
            value += this.readunicoderangepart(true);

            //ensure there's an actual unicode range here
            if (value.length === 2) {
                reader.reset();
            } else {

                tt = tokens.unicode_range;

                //if there's a ? in the first part, there can't be a second part
                if (value.indexof("?") === -1) {

                    if (reader.peek() === "-") {
                        reader.mark();
                        temp = reader.read();
                        temp += this.readunicoderangepart(false);

                        //if there's not another value, back up and just take the first
                        if (temp.length === 1) {
                            reader.reset();
                        } else {
                            value += temp;
                        }
                    }

                }
            }
        }

        return this.createtoken(tt, value, startline, startcol);
    },

    /**
     * produces a s token based on the specified information. since whitespace
     * may have multiple characters, this consumes all whitespace characters
     * into a single token.
     * @param {string} first the first character in the token.
     * @param {int} startline the beginning line for the character.
     * @param {int} startcol the beginning column for the character.
     * @return {object} a token object.
     * @method whitespacetoken
     */
    whitespacetoken: function(first, startline, startcol) {
        var value   = first + this.readwhitespace();
        return this.createtoken(tokens.s, value, startline, startcol);
    },


    //-------------------------------------------------------------------------
    // methods to read values from the string stream
    //-------------------------------------------------------------------------

    readunicoderangepart: function(allowquestionmark) {
        var reader  = this._reader,
            part = "",
            c       = reader.peek();

        //first read hex digits
        while (ishexdigit(c) && part.length < 6) {
            reader.read();
            part += c;
            c = reader.peek();
        }

        //then read question marks if allowed
        if (allowquestionmark) {
            while (c === "?" && part.length < 6) {
                reader.read();
                part += c;
                c = reader.peek();
            }
        }

        //there can't be any other characters after this point

        return part;
    },

    readwhitespace: function() {
        var reader  = this._reader,
            whitespace = "",
            c       = reader.peek();

        while (iswhitespace(c)) {
            reader.read();
            whitespace += c;
            c = reader.peek();
        }

        return whitespace;
    },
    readnumber: function(first) {
        var reader  = this._reader,
            number  = first,
            hasdot  = (first === "."),
            c       = reader.peek();


        while (c) {
            if (isdigit(c)) {
                number += reader.read();
            } else if (c === ".") {
                if (hasdot) {
                    break;
                } else {
                    hasdot = true;
                    number += reader.read();
                }
            } else {
                break;
            }

            c = reader.peek();
        }

        return number;
    },

    // returns null w/o resetting reader if string is invalid.
    readstring: function() {
        var token = this.stringtoken(this._reader.read(), 0, 0);
        return token.type === tokens.invalid ? null : token.value;
    },

    // returns null w/o resetting reader if uri is invalid.
    readuri: function(first) {
        var reader  = this._reader,
            uri     = first,
            inner   = "",
            c       = reader.peek();

        //skip whitespace before
        while (c && iswhitespace(c)) {
            reader.read();
            c = reader.peek();
        }

        //it's a string
        if (c === "'" || c === "\"") {
            inner = this.readstring();
            if (inner !== null) {
                inner = propertyvaluepart.parsestring(inner);
            }
        } else {
            inner = this.readunquotedurl();
        }

        c = reader.peek();

        //skip whitespace after
        while (c && iswhitespace(c)) {
            reader.read();
            c = reader.peek();
        }

        //if there was no inner value or the next character isn't closing paren, it's not a uri
        if (inner === null || c !== ")") {
            uri = null;
        } else {
            // ensure argument to url is always double-quoted
            // (this simplifies later processing in propertyvaluepart.)
            uri += propertyvaluepart.serializestring(inner) + reader.read();
        }

        return uri;
    },
    // this method never fails, although it may return an empty string.
    readunquotedurl: function(first) {
        var reader  = this._reader,
            url     = first || "",
            c;

        for (c = reader.peek(); c; c = reader.peek()) {
            // note that the grammar at
            // https://www.w3.org/tr/css2/grammar.html#scanner
            // incorrectly includes the backslash character in the
            // `url` production, although it is correctly omitted in
            // the `baduri1` production.
            if (nonascii.test(c) || /^[\-!#$%&*-\[\]-~]$/.test(c)) {
                url += c;
                reader.read();
            } else if (c === "\\") {
                if (/^[^\r\n\f]$/.test(reader.peek(2))) {
                    url += this.readescape(reader.read(), true);
                } else {
                    break; // bad escape sequence.
                }
            } else {
                break; // bad character
            }
        }

        return url;
    },

    readname: function(first) {
        var reader  = this._reader,
            ident   = first || "",
            c;

        for (c = reader.peek(); c; c = reader.peek()) {
            if (c === "\\") {
                if (/^[^\r\n\f]$/.test(reader.peek(2))) {
                    ident += this.readescape(reader.read(), true);
                } else {
                    // bad escape sequence.
                    break;
                }
            } else if (isnamechar(c)) {
                ident += reader.read();
            } else {
                break;
            }
        }

        return ident;
    },

    readescape: function(first, unescape) {
        var reader  = this._reader,
            cssescape = first || "",
            i       = 0,
            c       = reader.peek();

        if (ishexdigit(c)) {
            do {
                cssescape += reader.read();
                c = reader.peek();
            } while (c && ishexdigit(c) && ++i < 6);
        }

        if (cssescape.length === 1) {
            if (/^[^\r\n\f0-9a-f]$/.test(c)) {
                reader.read();
                if (unescape) {
                    return c;
                }
            } else {
                // we should never get here (readname won't call readescape
                // if the escape sequence is bad).
                throw new error("bad escape sequence.");
            }
        } else if (c === "\r") {
            reader.read();
            if (reader.peek() === "\n") {
                c += reader.read();
            }
        } else if (/^[ \t\n\f]$/.test(c)) {
            reader.read();
        } else {
            c = "";
        }

        if (unescape) {
            var cp = parseint(cssescape.slice(first.length), 16);
            return string.fromcodepoint ? string.fromcodepoint(cp) :
                string.fromcharcode(cp);
        }
        return cssescape + c;
    },

    readcomment: function(first) {
        var reader  = this._reader,
            comment = first || "",
            c       = reader.read();

        if (c === "*") {
            while (c) {
                comment += c;

                //look for end of comment
                if (comment.length > 2 && c === "*" && reader.peek() === "/") {
                    comment += reader.read();
                    break;
                }

                c = reader.read();
            }

            return comment;
        } else {
            return "";
        }

    }
});

},{"../util/tokenstreambase":27,"./propertyvaluepart":11,"./tokens":18}],18:[function(require,module,exports){
"use strict";

var tokens = module.exports = [

    /*
     * the following token names are defined in css3 grammar: https://www.w3.org/tr/css3-syntax/#lexical
     */

    // html-style comments
    { name: "cdo" },
    { name: "cdc" },

    // ignorables
    { name: "s", whitespace: true/*, channel: "ws"*/ },
    { name: "comment", comment: true, hide: true, channel: "comment" },

    // attribute equality
    { name: "includes", text: "~=" },
    { name: "dashmatch", text: "|=" },
    { name: "prefixmatch", text: "^=" },
    { name: "suffixmatch", text: "$=" },
    { name: "substringmatch", text: "*=" },

    // identifier types
    { name: "string" },
    { name: "ident" },
    { name: "hash" },

    // at-keywords
    { name: "import_sym", text: "@import" },
    { name: "page_sym", text: "@page" },
    { name: "media_sym", text: "@media" },
    { name: "font_face_sym", text: "@font-face" },
    { name: "charset_sym", text: "@charset" },
    { name: "namespace_sym", text: "@namespace" },
    { name: "supports_sym", text: "@supports" },
    { name: "viewport_sym", text: ["@viewport", "@-ms-viewport", "@-o-viewport"] },
    { name: "document_sym", text: ["@document", "@-moz-document"] },
    { name: "unknown_sym" },
    //{ name: "atkeyword"},

    // css3 animations
    { name: "keyframes_sym", text: [ "@keyframes", "@-webkit-keyframes", "@-moz-keyframes", "@-o-keyframes" ] },

    // important symbol
    { name: "important_sym" },

    // measurements
    { name: "length" },
    { name: "angle" },
    { name: "time" },
    { name: "freq" },
    { name: "dimension" },
    { name: "percentage" },
    { name: "number" },

    // functions
    { name: "uri" },
    { name: "function" },

    // unicode ranges
    { name: "unicode_range" },

    /*
     * the following token names are defined in css3 selectors: https://www.w3.org/tr/css3-selectors/#selector-syntax
     */

    // invalid string
    { name: "invalid" },

    // combinators
    { name: "plus", text: "+" },
    { name: "greater", text: ">" },
    { name: "comma", text: "," },
    { name: "tilde", text: "~" },

    // modifier
    { name: "not" },

    /*
     * defined in css3 paged media
     */
    { name: "topleftcorner_sym", text: "@top-left-corner" },
    { name: "topleft_sym", text: "@top-left" },
    { name: "topcenter_sym", text: "@top-center" },
    { name: "topright_sym", text: "@top-right" },
    { name: "toprightcorner_sym", text: "@top-right-corner" },
    { name: "bottomleftcorner_sym", text: "@bottom-left-corner" },
    { name: "bottomleft_sym", text: "@bottom-left" },
    { name: "bottomcenter_sym", text: "@bottom-center" },
    { name: "bottomright_sym", text: "@bottom-right" },
    { name: "bottomrightcorner_sym", text: "@bottom-right-corner" },
    { name: "lefttop_sym", text: "@left-top" },
    { name: "leftmiddle_sym", text: "@left-middle" },
    { name: "leftbottom_sym", text: "@left-bottom" },
    { name: "righttop_sym", text: "@right-top" },
    { name: "rightmiddle_sym", text: "@right-middle" },
    { name: "rightbottom_sym", text: "@right-bottom" },

    /*
     * the following token names are defined in css3 media queries: https://www.w3.org/tr/css3-mediaqueries/#syntax
     */
    /*{ name: "media_only", state: "media"},
    { name: "media_not", state: "media"},
    { name: "media_and", state: "media"},*/
    { name: "resolution", state: "media" },

    /*
     * the following token names are not defined in any css specification but are used by the lexer.
     */

    // not a real token, but useful for stupid ie filters
    { name: "ie_function" },

    // part of css3 grammar but not the flex code
    { name: "char" },

    // todo: needed?
    // not defined as tokens, but might as well be
    {
        name: "pipe",
        text: "|"
    },
    {
        name: "slash",
        text: "/"
    },
    {
        name: "minus",
        text: "-"
    },
    {
        name: "star",
        text: "*"
    },

    {
        name: "lbrace",
        endchar: "}",
        text: "{"
    },
    {
        name: "rbrace",
        text: "}"
    },
    {
        name: "lbracket",
        endchar: "]",
        text: "["
    },
    {
        name: "rbracket",
        text: "]"
    },
    {
        name: "equals",
        text: "="
    },
    {
        name: "colon",
        text: ":"
    },
    {
        name: "semicolon",
        text: ";"
    },
    {
        name: "lparen",
        endchar: ")",
        text: "("
    },
    {
        name: "rparen",
        text: ")"
    },
    {
        name: "dot",
        text: "."
    }
];

(function() {
    var namemap = [],
        typemap = object.create(null);

    tokens.unknown = -1;
    tokens.unshift({ name:"eof" });
    for (var i=0, len = tokens.length; i < len; i++) {
        namemap.push(tokens[i].name);
        tokens[tokens[i].name] = i;
        if (tokens[i].text) {
            if (tokens[i].text instanceof array) {
                for (var j=0; j < tokens[i].text.length; j++) {
                    typemap[tokens[i].text[j]] = i;
                }
            } else {
                typemap[tokens[i].text] = i;
            }
        }
    }

    tokens.name = function(tt) {
        return namemap[tt];
    };

    tokens.type = function(c) {
        return typemap[c] || -1;
    };
})();

},{}],19:[function(require,module,exports){
"use strict";

/* exported validation */

var matcher = require("./matcher");
var properties = require("./properties");
var validationtypes = require("./validationtypes");
var validationerror = require("./validationerror");
var propertyvalueiterator = require("./propertyvalueiterator");

var validation = module.exports = {

    validate: function(property, value) {

        //normalize name
        var name        = property.tostring().tolowercase(),
            expression  = new propertyvalueiterator(value),
            spec        = properties[name],
            part;

        if (!spec) {
            if (name.indexof("-") !== 0) {    //vendor prefixed are ok
                throw new validationerror("unknown property '" + property + "'.", property.line, property.col);
            }
        } else if (typeof spec !== "number") {

            // all properties accept some css-wide values.
            // https://drafts.csswg.org/css-values-3/#common-keywords
            if (validationtypes.isany(expression, "inherit | initial | unset")) {
                if (expression.hasnext()) {
                    part = expression.next();
                    throw new validationerror("expected end of value but found '" + part + "'.", part.line, part.col);
                }
                return;
            }

            // property-specific validation.
            this.singleproperty(spec, expression);

        }

    },

    singleproperty: function(types, expression) {

        var result      = false,
            value       = expression.value,
            part;

        result = matcher.parse(types).match(expression);

        if (!result) {
            if (expression.hasnext() && !expression.isfirst()) {
                part = expression.peek();
                throw new validationerror("expected end of value but found '" + part + "'.", part.line, part.col);
            } else {
                throw new validationerror("expected (" + validationtypes.describe(types) + ") but found '" + value + "'.", value.line, value.col);
            }
        } else if (expression.hasnext()) {
            part = expression.next();
            throw new validationerror("expected end of value but found '" + part + "'.", part.line, part.col);
        }

    }

};

},{"./matcher":3,"./properties":7,"./propertyvalueiterator":10,"./validationerror":20,"./validationtypes":21}],20:[function(require,module,exports){
"use strict";

module.exports = validationerror;

/**
 * type to use when a validation error occurs.
 * @class validationerror
 * @namespace parserlib.util
 * @constructor
 * @param {string} message the error message.
 * @param {int} line the line at which the error occurred.
 * @param {int} col the column at which the error occurred.
 */
function validationerror(message, line, col) {

    /**
     * the column at which the error occurred.
     * @type int
     * @property col
     */
    this.col = col;

    /**
     * the line at which the error occurred.
     * @type int
     * @property line
     */
    this.line = line;

    /**
     * the text representation of the unit.
     * @type string
     * @property text
     */
    this.message = message;

}

//inherit from error
validationerror.prototype = new error();

},{}],21:[function(require,module,exports){
"use strict";

var validationtypes = module.exports;

var matcher = require("./matcher");

function copy(to, from) {
    object.keys(from).foreach(function(prop) {
        to[prop] = from[prop];
    });
}
copy(validationtypes, {

    isliteral: function (part, literals) {
        var text = part.text.tostring().tolowercase(),
            args = literals.split(" | "),
            i, len, found = false;

        for (i=0, len=args.length; i < len && !found; i++) {
            if (args[i].charat(0) === "<") {
                found = this.simple[args[i]](part);
            } else if (args[i].slice(-2) === "()") {
                found = (part.type === "function" &&
                         part.name === args[i].slice(0, -2));
            } else if (text === args[i].tolowercase()) {
                found = true;
            }
        }

        return found;
    },

    issimple: function(type) {
        return boolean(this.simple[type]);
    },

    iscomplex: function(type) {
        return boolean(this.complex[type]);
    },

    describe: function(type) {
        if (this.complex[type] instanceof matcher) {
            return this.complex[type].tostring(0);
        }
        return type;
    },

    /**
     * determines if the next part(s) of the given expression
     * are any of the given types.
     */
    isany: function (expression, types) {
        var args = types.split(" | "),
            i, len, found = false;

        for (i=0, len=args.length; i < len && !found && expression.hasnext(); i++) {
            found = this.istype(expression, args[i]);
        }

        return found;
    },

    /**
     * determines if the next part(s) of the given expression
     * are one of a group.
     */
    isanyofgroup: function(expression, types) {
        var args = types.split(" || "),
            i, len, found = false;

        for (i=0, len=args.length; i < len && !found; i++) {
            found = this.istype(expression, args[i]);
        }

        return found ? args[i-1] : false;
    },

    /**
     * determines if the next part(s) of the given expression
     * are of a given type.
     */
    istype: function (expression, type) {
        var part = expression.peek(),
            result = false;

        if (type.charat(0) !== "<") {
            result = this.isliteral(part, type);
            if (result) {
                expression.next();
            }
        } else if (this.simple[type]) {
            result = this.simple[type](part);
            if (result) {
                expression.next();
            }
        } else if (this.complex[type] instanceof matcher) {
            result = this.complex[type].match(expression);
        } else {
            result = this.complex[type](expression);
        }

        return result;
    },


    simple: {
        __proto__: null,

        "<absolute-size>":
            "xx-small | x-small | small | medium | large | x-large | xx-large",

        "<animateable-feature>":
            "scroll-position | contents | <animateable-feature-name>",

        "<animateable-feature-name>": function(part) {
            return this["<ident>"](part) &&
                !/^(unset|initial|inherit|will-change|auto|scroll-position|contents)$/i.test(part);
        },

        "<angle>": function(part) {
            return part.type === "angle";
        },

        "<attachment>": "scroll | fixed | local",

        "<attr>": "attr()",

        // inset() = inset( <shape-arg>{1,4} [round <border-radius>]? )
        // circle() = circle( [<shape-radius>]? [at <position>]? )
        // ellipse() = ellipse( [<shape-radius>{2}]? [at <position>]? )
        // polygon() = polygon( [<fill-rule>,]? [<shape-arg> <shape-arg>]# )
        "<basic-shape>": "inset() | circle() | ellipse() | polygon()",

        "<bg-image>": "<image> | <gradient> | none",

        "<border-style>":
            "none | hidden | dotted | dashed | solid | double | groove | " +
            "ridge | inset | outset",

        "<border-width>": "<length> | thin | medium | thick",

        "<box>": "padding-box | border-box | content-box",

        "<clip-source>": "<uri>",

        "<color>": function(part) {
            return part.type === "color" || string(part) === "transparent" || string(part) === "currentcolor";
        },

        // the svg <color> spec doesn't include "currentcolor" or "transparent" as a color.
        "<color-svg>": function(part) {
            return part.type === "color";
        },

        "<content>": "content()",

        // https://www.w3.org/tr/css3-sizing/#width-height-keywords
        "<content-sizing>":
            "fill-available | -moz-available | -webkit-fill-available | " +
            "max-content | -moz-max-content | -webkit-max-content | " +
            "min-content | -moz-min-content | -webkit-min-content | " +
            "fit-content | -moz-fit-content | -webkit-fit-content",

        "<feature-tag-value>": function(part) {
            return part.type === "function" && /^[a-z0-9]{4}$/i.test(part);
        },

        // custom() isn't actually in the spec
        "<filter-function>":
            "blur() | brightness() | contrast() | custom() | " +
            "drop-shadow() | grayscale() | hue-rotate() | invert() | " +
            "opacity() | saturate() | sepia()",

        "<flex-basis>": "<width>",

        "<flex-direction>": "row | row-reverse | column | column-reverse",

        "<flex-grow>": "<number>",

        "<flex-shrink>": "<number>",

        "<flex-wrap>": "nowrap | wrap | wrap-reverse",

        "<font-size>":
            "<absolute-size> | <relative-size> | <length> | <percentage>",

        "<font-stretch>":
            "normal | ultra-condensed | extra-condensed | condensed | " +
            "semi-condensed | semi-expanded | expanded | extra-expanded | " +
            "ultra-expanded",

        "<font-style>": "normal | italic | oblique",

        "<font-variant-caps>":
            "small-caps | all-small-caps | petite-caps | all-petite-caps | " +
            "unicase | titling-caps",

        "<font-variant-css21>": "normal | small-caps",

        "<font-weight>":
            "normal | bold | bolder | lighter | " +
            "100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900",

        "<generic-family>":
            "serif | sans-serif | cursive | fantasy | monospace",

        "<geometry-box>": "<shape-box> | fill-box | stroke-box | view-box",

        "<glyph-angle>": function(part) {
            return part.type === "angle" && part.units === "deg";
        },

        "<gradient>": function(part) {
            return part.type === "function" && /^(?:\-(?:ms|moz|o|webkit)\-)?(?:repeating\-)?(?:radial\-|linear\-)?gradient/i.test(part);
        },

        "<icccolor>":
            "cielab() | cielch() | cielchab() | " +
            "icc-color() | icc-named-color()",

        //any identifier
        "<ident>": function(part) {
            return part.type === "identifier" || part.wasident;
        },

        "<ident-not-generic-family>": function(part) {
            return this["<ident>"](part) && !this["<generic-family>"](part);
        },

        "<image>": "<uri>",

        "<integer>": function(part) {
            return part.type === "integer";
        },

        "<length>": function(part) {
            if (part.type === "function" && /^(?:\-(?:ms|moz|o|webkit)\-)?calc/i.test(part)) {
                return true;
            } else {
                return part.type === "length" || part.type === "number" || part.type === "integer" || string(part) === "0";
            }
        },

        "<line>": function(part) {
            return part.type === "integer";
        },

        "<line-height>": "<number> | <length> | <percentage> | normal",

        "<margin-width>": "<length> | <percentage> | auto",

        "<miterlimit>": function(part) {
            return this["<number>"](part) && part.value >= 1;
        },

        "<nonnegative-length-or-percentage>": function(part) {
            return (this["<length>"](part) || this["<percentage>"](part)) &&
                (string(part) === "0" || part.type === "function" || (part.value) >= 0);
        },

        "<nonnegative-number-or-percentage>": function(part) {
            return (this["<number>"](part) || this["<percentage>"](part)) &&
                (string(part) === "0" || part.type === "function" || (part.value) >= 0);
        },

        "<number>": function(part) {
            return part.type === "number" || this["<integer>"](part);
        },

        "<opacity-value>": function(part) {
            return this["<number>"](part) && part.value >= 0 && part.value <= 1;
        },

        "<padding-width>": "<nonnegative-length-or-percentage>",

        "<percentage>": function(part) {
            return part.type === "percentage" || string(part) === "0";
        },

        "<relative-size>": "smaller | larger",

        "<shape>": "rect() | inset-rect()",

        "<shape-box>": "<box> | margin-box",

        "<single-animation-direction>":
            "normal | reverse | alternate | alternate-reverse",

        "<single-animation-name>": function(part) {
            return this["<ident>"](part) &&
                /^-?[a-z_][-a-z0-9_]+$/i.test(part) &&
                !/^(none|unset|initial|inherit)$/i.test(part);
        },

        "<string>": function(part) {
            return part.type === "string";
        },

        "<time>": function(part) {
            return part.type === "time";
        },

        "<uri>": function(part) {
            return part.type === "uri";
        },

        "<width>": "<margin-width>"
    },

    complex: {
        __proto__: null,

        "<azimuth>":
            "<angle>" +
            " | " +
            "[ [ left-side | far-left | left | center-left | center | " +
            "center-right | right | far-right | right-side ] || behind ]" +
            " | "+
            "leftwards | rightwards",

        "<bg-position>": "<position>#",

        "<bg-size>":
            "[ <length> | <percentage> | auto ]{1,2} | cover | contain",

        "<border-image-slice>":
        // [<number> | <percentage>]{1,4} && fill?
        // *but* fill can appear between any of the numbers
        matcher.many([true /* first element is required */],
                     matcher.cast("<nonnegative-number-or-percentage>"),
                     matcher.cast("<nonnegative-number-or-percentage>"),
                     matcher.cast("<nonnegative-number-or-percentage>"),
                     matcher.cast("<nonnegative-number-or-percentage>"),
                     "fill"),

        "<border-radius>":
            "<nonnegative-length-or-percentage>{1,4} " +
            "[ / <nonnegative-length-or-percentage>{1,4} ]?",

        "<box-shadow>": "none | <shadow>#",

        "<clip-path>": "<basic-shape> || <geometry-box>",

        "<dasharray>":
        // "list of comma and/or white space separated <length>s and
        // <percentage>s".  there is a non-negative constraint.
        matcher.cast("<nonnegative-length-or-percentage>")
            .braces(1, infinity, "#", matcher.cast(",").question()),

        "<family-name>":
            // <string> | <ident>+
            "<string> | <ident-not-generic-family> <ident>*",

        "<filter-function-list>": "[ <filter-function> | <uri> ]+",

        // https://www.w3.org/tr/2014/wd-css-flexbox-1-20140325/#flex-property
        "<flex>":
            "none | [ <flex-grow> <flex-shrink>? || <flex-basis> ]",

        "<font-family>": "[ <generic-family> | <family-name> ]#",

        "<font-shorthand>":
            "[ <font-style> || <font-variant-css21> || " +
            "<font-weight> || <font-stretch> ]? <font-size> " +
            "[ / <line-height> ]? <font-family>",

        "<font-variant-alternates>":
            // stylistic(<feature-value-name>)
            "stylistic() || " +
            "historical-forms || " +
            // styleset(<feature-value-name> #)
            "styleset() || " +
            // character-variant(<feature-value-name> #)
            "character-variant() || " +
            // swash(<feature-value-name>)
            "swash() || " +
            // ornaments(<feature-value-name>)
            "ornaments() || " +
            // annotation(<feature-value-name>)
            "annotation()",

        "<font-variant-ligatures>":
            // <common-lig-values>
            "[ common-ligatures | no-common-ligatures ] || " +
            // <discretionary-lig-values>
            "[ discretionary-ligatures | no-discretionary-ligatures ] || " +
            // <historical-lig-values>
            "[ historical-ligatures | no-historical-ligatures ] || " +
            // <contextual-alt-values>
            "[ contextual | no-contextual ]",

        "<font-variant-numeric>":
            // <numeric-figure-values>
            "[ lining-nums | oldstyle-nums ] || " +
            // <numeric-spacing-values>
            "[ proportional-nums | tabular-nums ] || " +
            // <numeric-fraction-values>
            "[ diagonal-fractions | stacked-fractions ] || " +
            "ordinal || slashed-zero",

        "<font-variant-east-asian>":
            // <east-asian-variant-values>
            "[ jis78 | jis83 | jis90 | jis04 | simplified | traditional ] || " +
            // <east-asian-width-values>
            "[ full-width | proportional-width ] || " +
            "ruby",

        // note that <color> here is "as defined in the svg spec", which
        // is more restrictive that the <color> defined in the css spec.
        // none | currentcolor | <color> [<icccolor>]? |
        // <funciri> [ none | currentcolor | <color> [<icccolor>]? ]?
        "<paint>": "<paint-basic> | <uri> <paint-basic>?",

        // helper definition for <paint> above.
        "<paint-basic>": "none | currentcolor | <color-svg> <icccolor>?",

        "<position>":
            // because our `alt` combinator is ordered, we need to test these
            // in order from longest possible match to shortest.
            "[ center | [ left | right ] [ <percentage> | <length> ]? ] && " +
            "[ center | [ top | bottom ] [ <percentage> | <length> ]? ]" +
            " | " +
            "[ left | center | right | <percentage> | <length> ] " +
            "[ top | center | bottom | <percentage> | <length> ]" +
            " | " +
            "[ left | center | right | top | bottom | <percentage> | <length> ]",

        "<repeat-style>":
            "repeat-x | repeat-y | [ repeat | space | round | no-repeat ]{1,2}",

        "<shadow>":
        //inset? && [ <length>{2,4} && <color>? ]
        matcher.many([true /* length is required */],
                     matcher.cast("<length>").braces(2, 4), "inset", "<color>"),

        "<text-decoration-color>":
           "<color>",

        "<text-decoration-line>":
            "none | [ underline || overline || line-through || blink ]",

        "<text-decoration-style>":
            "solid | double | dotted | dashed | wavy",

        "<will-change>":
            "auto | <animateable-feature>#",

        "<x-one-radius>":
            //[ <length> | <percentage> ] [ <length> | <percentage> ]?
            "[ <length> | <percentage> ]{1,2}"
    }
});

object.keys(validationtypes.simple).foreach(function(nt) {
    var rule = validationtypes.simple[nt];
    if (typeof rule === "string") {
        validationtypes.simple[nt] = function(part) {
            return validationtypes.isliteral(part, rule);
        };
    }
});

object.keys(validationtypes.complex).foreach(function(nt) {
    var rule = validationtypes.complex[nt];
    if (typeof rule === "string") {
        validationtypes.complex[nt] = matcher.parse(rule);
    }
});

// because this is defined relative to other complex validation types,
// we need to define it *after* the rest of the types are initialized.
validationtypes.complex["<font-variant>"] =
    matcher.oror({ expand: "<font-variant-ligatures>" },
                 { expand: "<font-variant-alternates>" },
                 "<font-variant-caps>",
                 { expand: "<font-variant-numeric>" },
                 { expand: "<font-variant-east-asian>" });

},{"./matcher":3}],22:[function(require,module,exports){
"use strict";

module.exports = {
    colors            : require("./colors"),
    combinator        : require("./combinator"),
    parser            : require("./parser"),
    propertyname      : require("./propertyname"),
    propertyvalue     : require("./propertyvalue"),
    propertyvaluepart : require("./propertyvaluepart"),
    matcher           : require("./matcher"),
    mediafeature      : require("./mediafeature"),
    mediaquery        : require("./mediaquery"),
    selector          : require("./selector"),
    selectorpart      : require("./selectorpart"),
    selectorsubpart   : require("./selectorsubpart"),
    specificity       : require("./specificity"),
    tokenstream       : require("./tokenstream"),
    tokens            : require("./tokens"),
    validationerror   : require("./validationerror")
};

},{"./colors":1,"./combinator":2,"./matcher":3,"./mediafeature":4,"./mediaquery":5,"./parser":6,"./propertyname":8,"./propertyvalue":9,"./propertyvaluepart":11,"./selector":13,"./selectorpart":14,"./selectorsubpart":15,"./specificity":16,"./tokenstream":17,"./tokens":18,"./validationerror":20}],23:[function(require,module,exports){
"use strict";

module.exports = eventtarget;

/**
 * a generic base to inherit from for any object
 * that needs event handling.
 * @class eventtarget
 * @constructor
 */
function eventtarget() {

    /**
     * the array of listeners for various events.
     * @type object
     * @property _listeners
     * @private
     */
    this._listeners = object.create(null);
}

eventtarget.prototype = {

    //restore constructor
    constructor: eventtarget,

    /**
     * adds a listener for a given event type.
     * @param {string} type the type of event to add a listener for.
     * @param {function} listener the function to call when the event occurs.
     * @return {void}
     * @method addlistener
     */
    addlistener: function(type, listener) {
        if (!this._listeners[type]) {
            this._listeners[type] = [];
        }

        this._listeners[type].push(listener);
    },

    /**
     * fires an event based on the passed-in object.
     * @param {object|string} event an object with at least a 'type' attribute
     *      or a string indicating the event name.
     * @return {void}
     * @method fire
     */
    fire: function(event) {
        if (typeof event === "string") {
            event = { type: event };
        }
        if (typeof event.target !== "undefined") {
            event.target = this;
        }

        if (typeof event.type === "undefined") {
            throw new error("event object missing 'type' property.");
        }

        if (this._listeners[event.type]) {

            //create a copy of the array and use that so listeners can't chane
            var listeners = this._listeners[event.type].concat();
            for (var i=0, len=listeners.length; i < len; i++) {
                listeners[i].call(this, event);
            }
        }
    },

    /**
     * removes a listener for a given event type.
     * @param {string} type the type of event to remove a listener from.
     * @param {function} listener the function to remove from the event.
     * @return {void}
     * @method removelistener
     */
    removelistener: function(type, listener) {
        if (this._listeners[type]) {
            var listeners = this._listeners[type];
            for (var i=0, len=listeners.length; i < len; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }


        }
    }
};

},{}],24:[function(require,module,exports){
"use strict";

module.exports = stringreader;

/**
 * convenient way to read through strings.
 * @namespace parserlib.util
 * @class stringreader
 * @constructor
 * @param {string} text the text to read.
 */
function stringreader(text) {

    /**
     * the input text with line endings normalized.
     * @property _input
     * @type string
     * @private
     */
    this._input = text.replace(/(\r\n?|\n)/g, "\n");


    /**
     * the row for the character to be read next.
     * @property _line
     * @type int
     * @private
     */
    this._line = 1;


    /**
     * the column for the character to be read next.
     * @property _col
     * @type int
     * @private
     */
    this._col = 1;

    /**
     * the index of the character in the input to be read next.
     * @property _cursor
     * @type int
     * @private
     */
    this._cursor = 0;
}

stringreader.prototype = {

    // restore constructor
    constructor: stringreader,

    //-------------------------------------------------------------------------
    // position info
    //-------------------------------------------------------------------------

    /**
     * returns the column of the character to be read next.
     * @return {int} the column of the character to be read next.
     * @method getcol
     */
    getcol: function() {
        return this._col;
    },

    /**
     * returns the row of the character to be read next.
     * @return {int} the row of the character to be read next.
     * @method getline
     */
    getline: function() {
        return this._line;
    },

    /**
     * determines if you're at the end of the input.
     * @return {boolean} true if there's no more input, false otherwise.
     * @method eof
     */
    eof: function() {
        return this._cursor === this._input.length;
    },

    //-------------------------------------------------------------------------
    // basic reading
    //-------------------------------------------------------------------------

    /**
     * reads the next character without advancing the cursor.
     * @param {int} count how many characters to look ahead (default is 1).
     * @return {string} the next character or null if there is no next character.
     * @method peek
     */
    peek: function(count) {
        var c = null;
        count = typeof count === "undefined" ? 1 : count;

        // if we're not at the end of the input...
        if (this._cursor < this._input.length) {

            // get character and increment cursor and column
            c = this._input.charat(this._cursor + count - 1);
        }

        return c;
    },

    /**
     * reads the next character from the input and adjusts the row and column
     * accordingly.
     * @return {string} the next character or null if there is no next character.
     * @method read
     */
    read: function() {
        var c = null;

        // if we're not at the end of the input...
        if (this._cursor < this._input.length) {

            // if the last character was a newline, increment row count
            // and reset column count
            if (this._input.charat(this._cursor) === "\n") {
                this._line++;
                this._col=1;
            } else {
                this._col++;
            }

            // get character and increment cursor and column
            c = this._input.charat(this._cursor++);
        }

        return c;
    },

    //-------------------------------------------------------------------------
    // misc
    //-------------------------------------------------------------------------

    /**
     * saves the current location so it can be returned to later.
     * @method mark
     * @return {void}
     */
    mark: function() {
        this._bookmark = {
            cursor: this._cursor,
            line:   this._line,
            col:    this._col
        };
    },

    reset: function() {
        if (this._bookmark) {
            this._cursor = this._bookmark.cursor;
            this._line = this._bookmark.line;
            this._col = this._bookmark.col;
            delete this._bookmark;
        }
    },

    //-------------------------------------------------------------------------
    // advanced reading
    //-------------------------------------------------------------------------

    /**
     * reads up to and including the given string. throws an error if that
     * string is not found.
     * @param {string} pattern the string to read.
     * @return {string} the string when it is found.
     * @throws error when the string pattern is not found.
     * @method readto
     */
    readto: function(pattern) {

        var buffer = "",
            c;

        /*
         * first, buffer must be the same length as the pattern.
         * then, buffer must end with the pattern or else reach the
         * end of the input.
         */
        while (buffer.length < pattern.length || buffer.lastindexof(pattern) !== buffer.length - pattern.length) {
            c = this.read();
            if (c) {
                buffer += c;
            } else {
                throw new error("expected \"" + pattern + "\" at line " + this._line  + ", col " + this._col + ".");
            }
        }

        return buffer;

    },

    /**
     * reads characters while each character causes the given
     * filter function to return true. the function is passed
     * in each character and either returns true to continue
     * reading or false to stop.
     * @param {function} filter the function to read on each character.
     * @return {string} the string made up of all characters that passed the
     *      filter check.
     * @method readwhile
     */
    readwhile: function(filter) {

        var buffer = "",
            c = this.peek();

        while (c !== null && filter(c)) {
            buffer += this.read();
            c = this.peek();
        }

        return buffer;

    },

    /**
     * reads characters that match either text or a regular expression and
     * returns those characters. if a match is found, the row and column
     * are adjusted; if no match is found, the reader's state is unchanged.
     * reading or false to stop.
     * @param {string|regexp} matcher if a string, then the literal string
     *      value is searched for. if a regular expression, then any string
     *      matching the pattern is search for.
     * @return {string} the string made up of all characters that matched or
     *      null if there was no match.
     * @method readmatch
     */
    readmatch: function(matcher) {

        var source = this._input.substring(this._cursor),
            value = null;

        // if it's a string, just do a straight match
        if (typeof matcher === "string") {
            if (source.slice(0, matcher.length) === matcher) {
                value = this.readcount(matcher.length);
            }
        } else if (matcher instanceof regexp) {
            if (matcher.test(source)) {
                value = this.readcount(regexp.lastmatch.length);
            }
        }

        return value;
    },


    /**
     * reads a given number of characters. if the end of the input is reached,
     * it reads only the remaining characters and does not throw an error.
     * @param {int} count the number of characters to read.
     * @return {string} the string made up the read characters.
     * @method readcount
     */
    readcount: function(count) {
        var buffer = "";

        while (count--) {
            buffer += this.read();
        }

        return buffer;
    }

};

},{}],25:[function(require,module,exports){
"use strict";

module.exports = syntaxerror;

/**
 * type to use when a syntax error occurs.
 * @class syntaxerror
 * @namespace parserlib.util
 * @constructor
 * @param {string} message the error message.
 * @param {int} line the line at which the error occurred.
 * @param {int} col the column at which the error occurred.
 */
function syntaxerror(message, line, col) {
    error.call(this);
    this.name = this.constructor.name;

    /**
     * the column at which the error occurred.
     * @type int
     * @property col
     */
    this.col = col;

    /**
     * the line at which the error occurred.
     * @type int
     * @property line
     */
    this.line = line;

    /**
     * the text representation of the unit.
     * @type string
     * @property text
     */
    this.message = message;

}

//inherit from error
syntaxerror.prototype = object.create(error.prototype); // jshint ignore:line
syntaxerror.prototype.constructor = syntaxerror; // jshint ignore:line

},{}],26:[function(require,module,exports){
"use strict";

module.exports = syntaxunit;

/**
 * base type to represent a single syntactic unit.
 * @class syntaxunit
 * @namespace parserlib.util
 * @constructor
 * @param {string} text the text of the unit.
 * @param {int} line the line of text on which the unit resides.
 * @param {int} col the column of text on which the unit resides.
 */
function syntaxunit(text, line, col, type) {


    /**
     * the column of text on which the unit resides.
     * @type int
     * @property col
     */
    this.col = col;

    /**
     * the line of text on which the unit resides.
     * @type int
     * @property line
     */
    this.line = line;

    /**
     * the text representation of the unit.
     * @type string
     * @property text
     */
    this.text = text;

    /**
     * the type of syntax unit.
     * @type int
     * @property type
     */
    this.type = type;
}

/**
 * create a new syntax unit based solely on the given token.
 * convenience method for creating a new syntax unit when
 * it represents a single token instead of multiple.
 * @param {object} token the token object to represent.
 * @return {parserlib.util.syntaxunit} the object representing the token.
 * @static
 * @method fromtoken
 */
syntaxunit.fromtoken = function(token) {
    return new syntaxunit(token.value, token.startline, token.startcol);
};

syntaxunit.prototype = {

    //restore constructor
    constructor: syntaxunit,

    /**
     * returns the text representation of the unit.
     * @return {string} the text representation of the unit.
     * @method valueof
     */
    valueof: function() {
        return this.tostring();
    },

    /**
     * returns the text representation of the unit.
     * @return {string} the text representation of the unit.
     * @method tostring
     */
    tostring: function() {
        return this.text;
    }

};

},{}],27:[function(require,module,exports){
"use strict";

module.exports = tokenstreambase;

var stringreader = require("./stringreader");
var syntaxerror = require("./syntaxerror");

/**
 * generic tokenstream providing base functionality.
 * @class tokenstreambase
 * @namespace parserlib.util
 * @constructor
 * @param {string|stringreader} input the text to tokenize or a reader from
 *      which to read the input.
 */
function tokenstreambase(input, tokendata) {

    /**
     * the string reader for easy access to the text.
     * @type stringreader
     * @property _reader
     * @private
     */
    this._reader = new stringreader(input ? input.tostring() : "");

    /**
     * token object for the last consumed token.
     * @type token
     * @property _token
     * @private
     */
    this._token = null;

    /**
     * the array of token information.
     * @type array
     * @property _tokendata
     * @private
     */
    this._tokendata = tokendata;

    /**
     * lookahead token buffer.
     * @type array
     * @property _lt
     * @private
     */
    this._lt = [];

    /**
     * lookahead token buffer index.
     * @type int
     * @property _ltindex
     * @private
     */
    this._ltindex = 0;

    this._ltindexcache = [];
}

/**
 * accepts an array of token information and outputs
 * an array of token data containing key-value mappings
 * and matching functions that the tokenstream needs.
 * @param {array} tokens an array of token descriptors.
 * @return {array} an array of processed token data.
 * @method createtokendata
 * @static
 */
tokenstreambase.createtokendata = function(tokens) {

    var namemap     = [],
        typemap     = object.create(null),
        tokendata     = tokens.concat([]),
        i            = 0,
        len            = tokendata.length+1;

    tokendata.unknown = -1;
    tokendata.unshift({ name:"eof" });

    for (; i < len; i++) {
        namemap.push(tokendata[i].name);
        tokendata[tokendata[i].name] = i;
        if (tokendata[i].text) {
            typemap[tokendata[i].text] = i;
        }
    }

    tokendata.name = function(tt) {
        return namemap[tt];
    };

    tokendata.type = function(c) {
        return typemap[c];
    };

    return tokendata;
};

tokenstreambase.prototype = {

    //restore constructor
    constructor: tokenstreambase,

    //-------------------------------------------------------------------------
    // matching methods
    //-------------------------------------------------------------------------

    /**
     * determines if the next token matches the given token type.
     * if so, that token is consumed; if not, the token is placed
     * back onto the token stream. you can pass in any number of
     * token types and this will return true if any of the token
     * types is found.
     * @param {int|int[]} tokentypes either a single token type or an array of
     *      token types that the next token might be. if an array is passed,
     *      it's assumed that the token can be any of these.
     * @param {variant} channel (optional) the channel to read from. if not
     *      provided, reads from the default (unnamed) channel.
     * @return {boolean} true if the token type matches, false if not.
     * @method match
     */
    match: function(tokentypes, channel) {

        //always convert to an array, makes things easier
        if (!(tokentypes instanceof array)) {
            tokentypes = [tokentypes];
        }

        var tt  = this.get(channel),
            i   = 0,
            len = tokentypes.length;

        while (i < len) {
            if (tt === tokentypes[i++]) {
                return true;
            }
        }

        //no match found, put the token back
        this.unget();
        return false;
    },

    /**
     * determines if the next token matches the given token type.
     * if so, that token is consumed; if not, an error is thrown.
     * @param {int|int[]} tokentypes either a single token type or an array of
     *      token types that the next token should be. if an array is passed,
     *      it's assumed that the token must be one of these.
     * @return {void}
     * @method mustmatch
     */
    mustmatch: function(tokentypes) {

        var token;

        //always convert to an array, makes things easier
        if (!(tokentypes instanceof array)) {
            tokentypes = [tokentypes];
        }

        if (!this.match.apply(this, arguments)) {
            token = this.lt(1);
            throw new syntaxerror("expected " + this._tokendata[tokentypes[0]].name +
                " at line " + token.startline + ", col " + token.startcol + ".", token.startline, token.startcol);
        }
    },

    //-------------------------------------------------------------------------
    // consuming methods
    //-------------------------------------------------------------------------

    /**
     * keeps reading from the token stream until either one of the specified
     * token types is found or until the end of the input is reached.
     * @param {int|int[]} tokentypes either a single token type or an array of
     *      token types that the next token should be. if an array is passed,
     *      it's assumed that the token must be one of these.
     * @param {variant} channel (optional) the channel to read from. if not
     *      provided, reads from the default (unnamed) channel.
     * @return {void}
     * @method advance
     */
    advance: function(tokentypes, channel) {

        while (this.la(0) !== 0 && !this.match(tokentypes, channel)) {
            this.get();
        }

        return this.la(0);
    },

    /**
     * consumes the next token from the token stream.
     * @return {int} the token type of the token that was just consumed.
     * @method get
     */
    get: function(channel) {

        var tokeninfo   = this._tokendata,
            i           =0,
            token,
            info;

        //check the lookahead buffer first
        if (this._lt.length && this._ltindex >= 0 && this._ltindex < this._lt.length) {

            i++;
            this._token = this._lt[this._ltindex++];
            info = tokeninfo[this._token.type];

            //obey channels logic
            while ((info.channel !== undefined && channel !== info.channel) &&
                    this._ltindex < this._lt.length) {
                this._token = this._lt[this._ltindex++];
                info = tokeninfo[this._token.type];
                i++;
            }

            //here be dragons
            if ((info.channel === undefined || channel === info.channel) &&
                    this._ltindex <= this._lt.length) {
                this._ltindexcache.push(i);
                return this._token.type;
            }
        }

        //call token retriever method
        token = this._gettoken();

        //if it should be hidden, don't save a token
        if (token.type > -1 && !tokeninfo[token.type].hide) {

            //apply token channel
            token.channel = tokeninfo[token.type].channel;

            //save for later
            this._token = token;
            this._lt.push(token);

            //save space that will be moved (must be done before array is truncated)
            this._ltindexcache.push(this._lt.length - this._ltindex + i);

            //keep the buffer under 5 items
            if (this._lt.length > 5) {
                this._lt.shift();
            }

            //also keep the shift buffer under 5 items
            if (this._ltindexcache.length > 5) {
                this._ltindexcache.shift();
            }

            //update lookahead index
            this._ltindex = this._lt.length;
        }

        /*
         * skip to the next token if:
         * 1. the token type is marked as hidden.
         * 2. the token type has a channel specified and it isn't the current channel.
         */
        info = tokeninfo[token.type];
        if (info &&
                (info.hide ||
                (info.channel !== undefined && channel !== info.channel))) {
            return this.get(channel);
        } else {
            //return just the type
            return token.type;
        }
    },

    /**
     * looks ahead a certain number of tokens and returns the token type at
     * that position. this will throw an error if you lookahead past the
     * end of input, past the size of the lookahead buffer, or back past
     * the first token in the lookahead buffer.
     * @param {int} the index of the token type to retrieve. 0 for the
     *      current token, 1 for the next, -1 for the previous, etc.
     * @return {int} the token type of the token in the given position.
     * @method la
     */
    la: function(index) {
        var total = index,
            tt;
        if (index > 0) {
            //todo: store 5 somewhere
            if (index > 5) {
                throw new error("too much lookahead.");
            }

            //get all those tokens
            while (total) {
                tt = this.get();
                total--;
            }

            //unget all those tokens
            while (total < index) {
                this.unget();
                total++;
            }
        } else if (index < 0) {

            if (this._lt[this._ltindex+index]) {
                tt = this._lt[this._ltindex+index].type;
            } else {
                throw new error("too much lookbehind.");
            }

        } else {
            tt = this._token.type;
        }

        return tt;

    },

    /**
     * looks ahead a certain number of tokens and returns the token at
     * that position. this will throw an error if you lookahead past the
     * end of input, past the size of the lookahead buffer, or back past
     * the first token in the lookahead buffer.
     * @param {int} the index of the token type to retrieve. 0 for the
     *      current token, 1 for the next, -1 for the previous, etc.
     * @return {object} the token of the token in the given position.
     * @method la
     */
    lt: function(index) {

        //lookahead first to prime the token buffer
        this.la(index);

        //now find the token, subtract one because _ltindex is already at the next index
        return this._lt[this._ltindex+index-1];
    },

    /**
     * returns the token type for the next token in the stream without
     * consuming it.
     * @return {int} the token type of the next token in the stream.
     * @method peek
     */
    peek: function() {
        return this.la(1);
    },

    /**
     * returns the actual token object for the last consumed token.
     * @return {token} the token object for the last consumed token.
     * @method token
     */
    token: function() {
        return this._token;
    },

    /**
     * returns the name of the token for the given token type.
     * @param {int} tokentype the type of token to get the name of.
     * @return {string} the name of the token or "unknown_token" for any
     *      invalid token type.
     * @method tokenname
     */
    tokenname: function(tokentype) {
        if (tokentype < 0 || tokentype > this._tokendata.length) {
            return "unknown_token";
        } else {
            return this._tokendata[tokentype].name;
        }
    },

    /**
     * returns the token type value for the given token name.
     * @param {string} tokenname the name of the token whose value should be returned.
     * @return {int} the token type value for the given token name or -1
     *      for an unknown token.
     * @method tokenname
     */
    tokentype: function(tokenname) {
        return this._tokendata[tokenname] || -1;
    },

    /**
     * returns the last consumed token to the token stream.
     * @method unget
     */
    unget: function() {
        //if (this._ltindex > -1) {
        if (this._ltindexcache.length) {
            this._ltindex -= this._ltindexcache.pop();//--;
            this._token = this._lt[this._ltindex - 1];
        } else {
            throw new error("too much lookahead.");
        }
    }

};


},{"./stringreader":24,"./syntaxerror":25}],28:[function(require,module,exports){
"use strict";

module.exports = {
    stringreader    : require("./stringreader"),
    syntaxerror     : require("./syntaxerror"),
    syntaxunit      : require("./syntaxunit"),
    eventtarget     : require("./eventtarget"),
    tokenstreambase : require("./tokenstreambase")
};

},{"./eventtarget":23,"./stringreader":24,"./syntaxerror":25,"./syntaxunit":26,"./tokenstreambase":27}],"parserlib":[function(require,module,exports){
"use strict";

module.exports = {
    css  : require("./css"),
    util : require("./util")
};

},{"./css":22,"./util":28}]},{},[]);

return require('parserlib');
})();
var clone = (function() {
'use strict';

var nativemap;
try {
  nativemap = map;
} catch(_) {
  // maybe a reference error because no `map`. give it a dummy value that no
  // value will ever be an instanceof.
  nativemap = function() {};
}

var nativeset;
try {
  nativeset = set;
} catch(_) {
  nativeset = function() {};
}

var nativepromise;
try {
  nativepromise = promise;
} catch(_) {
  nativepromise = function() {};
}

/**
 * clones (copies) an object using deep copying.
 *
 * this function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some cpu time
 * by calling clone(obj, false).
 *
 * caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
 * @param `includenonenumerable` - set to true if the non-enumerable properties
 *    should be cloned as well. non-enumerable properties on the prototype
 *    chain will be ignored. (optional - false by default)
*/
function clone(parent, circular, depth, prototype, includenonenumerable) {
  if (typeof circular === 'object') {
    depth = circular.depth;
    prototype = circular.prototype;
    includenonenumerable = circular.includenonenumerable;
    circular = circular.circular;
  }
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allparents = [];
  var allchildren = [];

  var usebuffer = typeof buffer != 'undefined';

  if (typeof circular == 'undefined')
    circular = true;

  if (typeof depth == 'undefined')
    depth = infinity;

  // recurse this function so we don't reset allparents and allchildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      return null;

    if (depth === 0)
      return parent;

    var child;
    var proto;
    if (typeof parent != 'object') {
      return parent;
    }

    if (parent instanceof nativemap) {
      child = new nativemap();
    } else if (parent instanceof nativeset) {
      child = new nativeset();
    } else if (parent instanceof nativepromise) {
      child = new nativepromise(function (resolve, reject) {
        parent.then(function(value) {
          resolve(_clone(value, depth - 1));
        }, function(err) {
          reject(_clone(err, depth - 1));
        });
      });
    } else if (clone.__isarray(parent)) {
      child = [];
    } else if (clone.__isregexp(parent)) {
      child = new regexp(parent.source, __getregexpflags(parent));
      if (parent.lastindex) child.lastindex = parent.lastindex;
    } else if (clone.__isdate(parent)) {
      child = new date(parent.gettime());
    } else if (usebuffer && buffer.isbuffer(parent)) {
      child = new buffer(parent.length);
      parent.copy(child);
      return child;
    } else if (parent instanceof error) {
      child = object.create(parent);
    } else {
      if (typeof prototype == 'undefined') {
        proto = object.getprototypeof(parent);
        child = object.create(proto);
      }
      else {
        child = object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allparents.indexof(parent);

      if (index != -1) {
        return allchildren[index];
      }
      allparents.push(parent);
      allchildren.push(child);
    }

    if (parent instanceof nativemap) {
      var keyiterator = parent.keys();
      while(true) {
        var next = keyiterator.next();
        if (next.done) {
          break;
        }
        var keychild = _clone(next.value, depth - 1);
        var valuechild = _clone(parent.get(next.value), depth - 1);
        child.set(keychild, valuechild);
      }
    }
    if (parent instanceof nativeset) {
      var iterator = parent.keys();
      while(true) {
        var next = iterator.next();
        if (next.done) {
          break;
        }
        var entrychild = _clone(next.value, depth - 1);
        child.add(entrychild);
      }
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = object.getownpropertydescriptor(proto, i);
      }

      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    if (object.getownpropertysymbols) {
      var symbols = object.getownpropertysymbols(parent);
      for (var i = 0; i < symbols.length; i++) {
        // don't need to worry about cloning a symbol because it is a primitive,
        // like a number or string.
        var symbol = symbols[i];
        var descriptor = object.getownpropertydescriptor(parent, symbol);
        if (descriptor && !descriptor.enumerable && !includenonenumerable) {
          continue;
        }
        child[symbol] = _clone(parent[symbol], depth - 1);
        if (!descriptor.enumerable) {
          object.defineproperty(child, symbol, {
            enumerable: false
          });
        }
      }
    }

    if (includenonenumerable) {
      var allpropertynames = object.getownpropertynames(parent);
      for (var i = 0; i < allpropertynames.length; i++) {
        var propertyname = allpropertynames[i];
        var descriptor = object.getownpropertydescriptor(parent, propertyname);
        if (descriptor && descriptor.enumerable) {
          continue;
        }
        child[propertyname] = _clone(parent[propertyname], depth - 1);
        object.defineproperty(child, propertyname, {
          enumerable: false
        });
      }
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * simple flat clone using prototype, accepts only objects, usefull for property
 * override on flat configuration object (no nested props).
 *
 * use with caution! this may not behave as you wish if you do not know how this
 * works.
 */
clone.cloneprototype = function cloneprototype(parent) {
  if (parent === null)
    return null;

  var c = function () {};
  c.prototype = parent;
  return new c();
};

// private utility functions

function __objtostr(o) {
  return object.prototype.tostring.call(o);
}
clone.__objtostr = __objtostr;

function __isdate(o) {
  return typeof o === 'object' && __objtostr(o) === '[object date]';
}
clone.__isdate = __isdate;

function __isarray(o) {
  return typeof o === 'object' && __objtostr(o) === '[object array]';
}
clone.__isarray = __isarray;

function __isregexp(o) {
  return typeof o === 'object' && __objtostr(o) === '[object regexp]';
}
clone.__isregexp = __isregexp;

function __getregexpflags(re) {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignorecase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
}
clone.__getregexpflags = __getregexpflags;

return clone;
})();

if (typeof module === 'object' && module.exports) {
  module.exports = clone;
}

/**
 * main csslint object.
 * @class csslint
 * @static
 * @extends parserlib.util.eventtarget
 */

/* global parserlib, clone, reporter */
/* exported csslint */

var csslint = (function() {
    "use strict";

    var rules           = [],
        formatters      = [],
        embeddedruleset = /\/\*\s*csslint([^\*]*)\*\//,
        api             = new parserlib.util.eventtarget();

    api.version = "1.0.4";

    //-------------------------------------------------------------------------
    // rule management
    //-------------------------------------------------------------------------

    /**
     * adds a new rule to the engine.
     * @param {object} rule the rule to add.
     * @method addrule
     */
    api.addrule = function(rule) {
        rules.push(rule);
        rules[rule.id] = rule;
    };

    /**
     * clears all rule from the engine.
     * @method clearrules
     */
    api.clearrules = function() {
        rules = [];
    };

    /**
     * returns the rule objects.
     * @return an array of rule objects.
     * @method getrules
     */
    api.getrules = function() {
        return [].concat(rules).sort(function(a, b) {
            return a.id > b.id ? 1 : 0;
        });
    };

    /**
     * returns a ruleset configuration object with all current rules.
     * @return a ruleset object.
     * @method getruleset
     */
    api.getruleset = function() {
        var ruleset = {},
            i = 0,
            len = rules.length;

        while (i < len) {
            ruleset[rules[i++].id] = 1;    // by default, everything is a warning
        }

        return ruleset;
    };

    /**
     * returns a ruleset object based on embedded rules.
     * @param {string} text a string of css containing embedded rules.
     * @param {object} ruleset a ruleset object to modify.
     * @return {object} a ruleset object.
     * @method getembeddedruleset
     */
    function applyembeddedruleset(text, ruleset) {
        var valuemap,
            embedded = text && text.match(embeddedruleset),
            rules = embedded && embedded[1];

        if (rules) {
            valuemap = {
                "true": 2,  // true is error
                "": 1,      // blank is warning
                "false": 0, // false is ignore

                "2": 2,     // explicit error
                "1": 1,     // explicit warning
                "0": 0      // explicit ignore
            };

            rules.tolowercase().split(",").foreach(function(rule) {
                var pair = rule.split(":"),
                    property = pair[0] || "",
                    value = pair[1] || "";

                ruleset[property.trim()] = valuemap[value.trim()];
            });
        }

        return ruleset;
    }

    //-------------------------------------------------------------------------
    // formatters
    //-------------------------------------------------------------------------

    /**
     * adds a new formatter to the engine.
     * @param {object} formatter the formatter to add.
     * @method addformatter
     */
    api.addformatter = function(formatter) {
        // formatters.push(formatter);
        formatters[formatter.id] = formatter;
    };

    /**
     * retrieves a formatter for use.
     * @param {string} formatid the name of the format to retrieve.
     * @return {object} the formatter or undefined.
     * @method getformatter
     */
    api.getformatter = function(formatid) {
        return formatters[formatid];
    };

    /**
     * formats the results in a particular format for a single file.
     * @param {object} result the results returned from csslint.verify().
     * @param {string} filename the filename for which the results apply.
     * @param {string} formatid the name of the formatter to use.
     * @param {object} options (optional) for special output handling.
     * @return {string} a formatted string for the results.
     * @method format
     */
    api.format = function(results, filename, formatid, options) {
        var formatter = this.getformatter(formatid),
            result = null;

        if (formatter) {
            result = formatter.startformat();
            result += formatter.formatresults(results, filename, options || {});
            result += formatter.endformat();
        }

        return result;
    };

    /**
     * indicates if the given format is supported.
     * @param {string} formatid the id of the format to check.
     * @return {boolean} true if the format exists, false if not.
     * @method hasformat
     */
    api.hasformat = function(formatid) {
        return formatters.hasownproperty(formatid);
    };

    //-------------------------------------------------------------------------
    // verification
    //-------------------------------------------------------------------------

    /**
     * starts the verification process for the given css text.
     * @param {string} text the css text to verify.
     * @param {object} ruleset (optional) list of rules to apply. if null, then
     *      all rules are used. if a rule has a value of 1 then it's a warning,
     *      a value of 2 means it's an error.
     * @return {object} results of the verification.
     * @method verify
     */
    api.verify = function(text, ruleset) {

        var i = 0,
            reporter,
            lines,
            allow = {},
            ignore = [],
            report,
            parser = new parserlib.css.parser({
                starhack: true,
                iefilters: true,
                underscorehack: true,
                strict: false
            });

        // normalize line endings
        lines = text.replace(/\n\r?/g, "$split$").split("$split$");

        // find 'allow' comments
        csslint.util.foreach(lines, function (line, lineno) {
            var allowline = line && line.match(/\/\*[ \t]*csslint[ \t]+allow:[ \t]*([^\*]*)\*\//i),
                allowrules = allowline && allowline[1],
                allowruleset = {};

            if (allowrules) {
                allowrules.tolowercase().split(",").foreach(function(allowrule) {
                    allowruleset[allowrule.trim()] = true;
                });
                if (object.keys(allowruleset).length > 0) {
                    allow[lineno + 1] = allowruleset;
                }
            }
        });

        var ignorestart = null,
            ignoreend = null;
        csslint.util.foreach(lines, function (line, lineno) {
            // keep oldest, "unclosest" ignore:start
            if (ignorestart === null && line.match(/\/\*[ \t]*csslint[ \t]+ignore:start[ \t]*\*\//i)) {
                ignorestart = lineno;
            }

            if (line.match(/\/\*[ \t]*csslint[ \t]+ignore:end[ \t]*\*\//i)) {
                ignoreend = lineno;
            }

            if (ignorestart !== null && ignoreend !== null) {
                ignore.push([ignorestart, ignoreend]);
                ignorestart = ignoreend = null;
            }
        });

        // close remaining ignore block, if any
        if (ignorestart !== null) {
            ignore.push([ignorestart, lines.length]);
        }

        if (!ruleset) {
            ruleset = this.getruleset();
        }

        if (embeddedruleset.test(text)) {
            // defensively copy so that caller's version does not get modified
            ruleset = clone(ruleset);
            ruleset = applyembeddedruleset(text, ruleset);
        }

        reporter = new reporter(lines, ruleset, allow, ignore);

        ruleset.errors = 2;       // always report parsing errors as errors
        for (i in ruleset) {
            if (ruleset.hasownproperty(i) && ruleset[i]) {
                if (rules[i]) {
                    rules[i].init(parser, reporter);
                }
            }
        }


        // capture most horrible error type
        try {
            parser.parse(text);
        } catch (ex) {
            reporter.error("fatal error, cannot continue: " + ex.message, ex.line, ex.col, {});
        }

        report = {
            messages    : reporter.messages,
            stats       : reporter.stats,
            ruleset     : reporter.ruleset,
            allow       : reporter.allow,
            ignore      : reporter.ignore
        };

        // sort by line numbers, rollups at the bottom
        report.messages.sort(function (a, b) {
            if (a.rollup && !b.rollup) {
                return 1;
            } else if (!a.rollup && b.rollup) {
                return -1;
            } else {
                return a.line - b.line;
            }
        });

        return report;
    };

    //-------------------------------------------------------------------------
    // publish the api
    //-------------------------------------------------------------------------

    return api;

})();

/**
 * an instance of report is used to report results of the
 * verification back to the main api.
 * @class reporter
 * @constructor
 * @param {string[]} lines the text lines of the source.
 * @param {object} ruleset the set of rules to work with, including if
 *      they are errors or warnings.
 * @param {object} explicitly allowed lines
 * @param {[][]} ingore list of line ranges to be ignored
 */
function reporter(lines, ruleset, allow, ignore) {
    "use strict";

    /**
     * list of messages being reported.
     * @property messages
     * @type string[]
     */
    this.messages = [];

    /**
     * list of statistics being reported.
     * @property stats
     * @type string[]
     */
    this.stats = [];

    /**
     * lines of code being reported on. used to provide contextual information
     * for messages.
     * @property lines
     * @type string[]
     */
    this.lines = lines;

    /**
     * information about the rules. used to determine whether an issue is an
     * error or warning.
     * @property ruleset
     * @type object
     */
    this.ruleset = ruleset;

    /**
     * lines with specific rule messages to leave out of the report.
     * @property allow
     * @type object
     */
    this.allow = allow;
    if (!this.allow) {
        this.allow = {};
    }

    /**
     * linesets not to include in the report.
     * @property ignore
     * @type [][]
     */
    this.ignore = ignore;
    if (!this.ignore) {
        this.ignore = [];
    }
}

reporter.prototype = {

    // restore constructor
    constructor: reporter,

    /**
     * report an error.
     * @param {string} message the message to store.
     * @param {int} line the line number.
     * @param {int} col the column number.
     * @param {object} rule the rule this message relates to.
     * @method error
     */
    error: function(message, line, col, rule) {
        "use strict";
        this.messages.push({
            type    : "error",
            line    : line,
            col     : col,
            message : message,
            evidence: this.lines[line-1],
            rule    : rule || {}
        });
    },

    /**
     * report an warning.
     * @param {string} message the message to store.
     * @param {int} line the line number.
     * @param {int} col the column number.
     * @param {object} rule the rule this message relates to.
     * @method warn
     * @deprecated use report instead.
     */
    warn: function(message, line, col, rule) {
        "use strict";
        this.report(message, line, col, rule);
    },

    /**
     * report an issue.
     * @param {string} message the message to store.
     * @param {int} line the line number.
     * @param {int} col the column number.
     * @param {object} rule the rule this message relates to.
     * @method report
     */
    report: function(message, line, col, rule) {
        "use strict";

        // check if rule violation should be allowed
        if (this.allow.hasownproperty(line) && this.allow[line].hasownproperty(rule.id)) {
            return;
        }

        var ignore = false;
        csslint.util.foreach(this.ignore, function (range) {
            if (range[0] <= line && line <= range[1]) {
                ignore = true;
            }
        });
        if (ignore) {
            return;
        }

        this.messages.push({
            type    : this.ruleset[rule.id] === 2 ? "error" : "warning",
            line    : line,
            col     : col,
            message : message,
            evidence: this.lines[line-1],
            rule    : rule
        });
    },

    /**
     * report some informational text.
     * @param {string} message the message to store.
     * @param {int} line the line number.
     * @param {int} col the column number.
     * @param {object} rule the rule this message relates to.
     * @method info
     */
    info: function(message, line, col, rule) {
        "use strict";
        this.messages.push({
            type    : "info",
            line    : line,
            col     : col,
            message : message,
            evidence: this.lines[line-1],
            rule    : rule
        });
    },

    /**
     * report some rollup error information.
     * @param {string} message the message to store.
     * @param {object} rule the rule this message relates to.
     * @method rolluperror
     */
    rolluperror: function(message, rule) {
        "use strict";
        this.messages.push({
            type    : "error",
            rollup  : true,
            message : message,
            rule    : rule
        });
    },

    /**
     * report some rollup warning information.
     * @param {string} message the message to store.
     * @param {object} rule the rule this message relates to.
     * @method rollupwarn
     */
    rollupwarn: function(message, rule) {
        "use strict";
        this.messages.push({
            type    : "warning",
            rollup  : true,
            message : message,
            rule    : rule
        });
    },

    /**
     * report a statistic.
     * @param {string} name the name of the stat to store.
     * @param {variant} value the value of the stat.
     * @method stat
     */
    stat: function(name, value) {
        "use strict";
        this.stats[name] = value;
    }
};

// expose for testing purposes
csslint._reporter = reporter;

/*
 * utility functions that make life easier.
 */
csslint.util = {
    /*
     * adds all properties from supplier onto receiver,
     * overwriting if the same name already exists on
     * receiver.
     * @param {object} the object to receive the properties.
     * @param {object} the object to provide the properties.
     * @return {object} the receiver
     */
    mix: function(receiver, supplier) {
        "use strict";
        var prop;

        for (prop in supplier) {
            if (supplier.hasownproperty(prop)) {
                receiver[prop] = supplier[prop];
            }
        }

        return prop;
    },

    /*
     * polyfill for array indexof() method.
     * @param {array} values the array to search.
     * @param {variant} value the value to search for.
     * @return {int} the index of the value if found, -1 if not.
     */
    indexof: function(values, value) {
        "use strict";
        if (values.indexof) {
            return values.indexof(value);
        } else {
            for (var i=0, len=values.length; i < len; i++) {
                if (values[i] === value) {
                    return i;
                }
            }
            return -1;
        }
    },

    /*
     * polyfill for array foreach() method.
     * @param {array} values the array to operate on.
     * @param {function} func the function to call on each item.
     * @return {void}
     */
    foreach: function(values, func) {
        "use strict";
        if (values.foreach) {
            return values.foreach(func);
        } else {
            for (var i=0, len=values.length; i < len; i++) {
                func(values[i], i, values);
            }
        }
    }
};

/*
 * rule: don't use adjoining classes (.foo.bar).
 */

csslint.addrule({

    // rule information
    id: "adjoining-classes",
    name: "disallow adjoining classes",
    desc: "don't use adjoining classes.",
    url: "https://github.com/csslint/csslint/wiki/disallow-adjoining-classes",
    browsers: "ie6",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;
        parser.addlistener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                modifier,
                classcount,
                i, j, k;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];
                for (j=0; j < selector.parts.length; j++) {
                    part = selector.parts[j];
                    if (part.type === parser.selector_part_type) {
                        classcount = 0;
                        for (k=0; k < part.modifiers.length; k++) {
                            modifier = part.modifiers[k];
                            if (modifier.type === "class") {
                                classcount++;
                            }
                            if (classcount > 1){
                                reporter.report("adjoining classes: "+selectors[i].text, part.line, part.col, rule);
                            }
                        }
                    }
                }
            }
        });
    }

});

/*
 * rule: don't use width or height when using padding or border.
 */
csslint.addrule({

    // rule information
    id: "box-model",
    name: "beware of broken box size",
    desc: "don't use width or height when using padding or border.",
    url: "https://github.com/csslint/csslint/wiki/beware-of-box-model-size",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            widthproperties = {
                border: 1,
                "border-left": 1,
                "border-right": 1,
                padding: 1,
                "padding-left": 1,
                "padding-right": 1
            },
            heightproperties = {
                border: 1,
                "border-bottom": 1,
                "border-top": 1,
                padding: 1,
                "padding-bottom": 1,
                "padding-top": 1
            },
            properties,
            boxsizing = false;

        function startrule() {
            properties = {};
            boxsizing = false;
        }

        function endrule() {
            var prop, value;

            if (!boxsizing) {
                if (properties.height) {
                    for (prop in heightproperties) {
                        if (heightproperties.hasownproperty(prop) && properties[prop]) {
                            value = properties[prop].value;
                            // special case for padding
                            if (!(prop === "padding" && value.parts.length === 2 && value.parts[0].value === 0)) {
                                reporter.report("using height with " + prop + " can sometimes make elements larger than you expect.", properties[prop].line, properties[prop].col, rule);
                            }
                        }
                    }
                }

                if (properties.width) {
                    for (prop in widthproperties) {
                        if (widthproperties.hasownproperty(prop) && properties[prop]) {
                            value = properties[prop].value;

                            if (!(prop === "padding" && value.parts.length === 2 && value.parts[1].value === 0)) {
                                reporter.report("using width with " + prop + " can sometimes make elements larger than you expect.", properties[prop].line, properties[prop].col, rule);
                            }
                        }
                    }
                }
            }
        }

        parser.addlistener("startrule", startrule);
        parser.addlistener("startfontface", startrule);
        parser.addlistener("startpage", startrule);
        parser.addlistener("startpagemargin", startrule);
        parser.addlistener("startkeyframerule", startrule);
        parser.addlistener("startviewport", startrule);

        parser.addlistener("property", function(event) {
            var name = event.property.text.tolowercase();

            if (heightproperties[name] || widthproperties[name]) {
                if (!/^0\s*$/.test(event.value) && !(name === "border" && event.value.tostring() === "none")) {
                    properties[name] = {
                        line: event.property.line,
                        col: event.property.col,
                        value: event.value
                    };
                }
            } else {
                if (/^(width|height)/i.test(name) && /^(length|percentage)/.test(event.value.parts[0].type)) {
                    properties[name] = 1;
                } else if (name === "box-sizing") {
                    boxsizing = true;
                }
            }

        });

        parser.addlistener("endrule", endrule);
        parser.addlistener("endfontface", endrule);
        parser.addlistener("endpage", endrule);
        parser.addlistener("endpagemargin", endrule);
        parser.addlistener("endkeyframerule", endrule);
        parser.addlistener("endviewport", endrule);
    }

});

/*
 * rule: box-sizing doesn't work in ie6 and ie7.
 */

csslint.addrule({

    // rule information
    id: "box-sizing",
    name: "disallow use of box-sizing",
    desc: "the box-sizing properties isn't supported in ie6 and ie7.",
    url: "https://github.com/csslint/csslint/wiki/disallow-box-sizing",
    browsers: "ie6, ie7",
    tags: ["compatibility"],

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addlistener("property", function(event) {
            var name = event.property.text.tolowercase();

            if (name === "box-sizing") {
                reporter.report("the box-sizing property isn't supported in ie6 and ie7.", event.line, event.col, rule);
            }
        });
    }

});

/*
 * rule: use the bulletproof @font-face syntax to avoid 404's in old ie
 * (http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax)
 */

csslint.addrule({

    // rule information
    id: "bulletproof-font-face",
    name: "use the bulletproof @font-face syntax",
    desc: "use the bulletproof @font-face syntax to avoid 404's in old ie (http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax).",
    url: "https://github.com/csslint/csslint/wiki/bulletproof-font-face",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            fontfacerule = false,
            firstsrc = true,
            rulefailed = false,
            line, col;

        // mark the start of a @font-face declaration so we only test properties inside it
        parser.addlistener("startfontface", function() {
            fontfacerule = true;
        });

        parser.addlistener("property", function(event) {
            // if we aren't inside an @font-face declaration then just return
            if (!fontfacerule) {
                return;
            }

            var propertyname = event.property.tostring().tolowercase(),
                value = event.value.tostring();

            // set the line and col numbers for use in the endfontface listener
            line = event.line;
            col = event.col;

            // this is the property that we care about, we can ignore the rest
            if (propertyname === "src") {
                var regex = /^\s?url\(['"].+\.eot\?.*['"]\)\s*format\(['"]embedded-opentype['"]\).*$/i;

                // we need to handle the advanced syntax with two src properties
                if (!value.match(regex) && firstsrc) {
                    rulefailed = true;
                    firstsrc = false;
                } else if (value.match(regex) && !firstsrc) {
                    rulefailed = false;
                }
            }


        });

        // back to normal rules that we don't need to test
        parser.addlistener("endfontface", function() {
            fontfacerule = false;

            if (rulefailed) {
                reporter.report("@font-face declaration doesn't follow the fontspring bulletproof syntax.", line, col, rule);
            }
        });
    }
});

/*
 * rule: include all compatible vendor prefixes to reach a wider
 * range of users.
 */

csslint.addrule({

    // rule information
    id: "compatible-vendor-prefixes",
    name: "require compatible vendor prefixes",
    desc: "include all compatible vendor prefixes to reach a wider range of users.",
    url: "https://github.com/csslint/csslint/wiki/require-compatible-vendor-prefixes",
    browsers: "all",

    // initialization
    init: function (parser, reporter) {
        "use strict";
        var rule = this,
            compatibleprefixes,
            properties,
            prop,
            variations,
            prefixed,
            i,
            len,
            inkeyframe = false,
            arraypush = array.prototype.push,
            applyto = [];

        // see http://peter.sh/experiments/vendor-prefixed-css-property-overview/ for details
        compatibleprefixes = {
            "animation"                  : "webkit",
            "animation-delay"            : "webkit",
            "animation-direction"        : "webkit",
            "animation-duration"         : "webkit",
            "animation-fill-mode"        : "webkit",
            "animation-iteration-count"  : "webkit",
            "animation-name"             : "webkit",
            "animation-play-state"       : "webkit",
            "animation-timing-function"  : "webkit",
            "appearance"                 : "webkit moz",
            "border-end"                 : "webkit moz",
            "border-end-color"           : "webkit moz",
            "border-end-style"           : "webkit moz",
            "border-end-width"           : "webkit moz",
            "border-image"               : "webkit moz o",
            "border-radius"              : "webkit",
            "border-start"               : "webkit moz",
            "border-start-color"         : "webkit moz",
            "border-start-style"         : "webkit moz",
            "border-start-width"         : "webkit moz",
            "box-align"                  : "webkit moz ms",
            "box-direction"              : "webkit moz ms",
            "box-flex"                   : "webkit moz ms",
            "box-lines"                  : "webkit ms",
            "box-ordinal-group"          : "webkit moz ms",
            "box-orient"                 : "webkit moz ms",
            "box-pack"                   : "webkit moz ms",
            "box-sizing"                 : "",
            "box-shadow"                 : "",
            "column-count"               : "webkit moz ms",
            "column-gap"                 : "webkit moz ms",
            "column-rule"                : "webkit moz ms",
            "column-rule-color"          : "webkit moz ms",
            "column-rule-style"          : "webkit moz ms",
            "column-rule-width"          : "webkit moz ms",
            "column-width"               : "webkit moz ms",
            "hyphens"                    : "epub moz",
            "line-break"                 : "webkit ms",
            "margin-end"                 : "webkit moz",
            "margin-start"               : "webkit moz",
            "marquee-speed"              : "webkit wap",
            "marquee-style"              : "webkit wap",
            "padding-end"                : "webkit moz",
            "padding-start"              : "webkit moz",
            "tab-size"                   : "moz o",
            "text-size-adjust"           : "webkit ms",
            "transform"                  : "webkit ms",
            "transform-origin"           : "webkit ms",
            "transition"                 : "",
            "transition-delay"           : "",
            "transition-duration"        : "",
            "transition-property"        : "",
            "transition-timing-function" : "",
            "user-modify"                : "webkit moz",
            "user-select"                : "webkit moz ms",
            "word-break"                 : "epub ms",
            "writing-mode"               : "epub ms"
        };


        for (prop in compatibleprefixes) {
            if (compatibleprefixes.hasownproperty(prop)) {
                variations = [];
                prefixed = compatibleprefixes[prop].split(" ");
                for (i = 0, len = prefixed.length; i < len; i++) {
                    variations.push("-" + prefixed[i] + "-" + prop);
                }
                compatibleprefixes[prop] = variations;
                arraypush.apply(applyto, variations);
            }
        }

        parser.addlistener("startrule", function () {
            properties = [];
        });

        parser.addlistener("startkeyframes", function (event) {
            inkeyframe = event.prefix || true;
        });

        parser.addlistener("endkeyframes", function () {
            inkeyframe = false;
        });

        parser.addlistener("property", function (event) {
            var name = event.property;
            if (csslint.util.indexof(applyto, name.text) > -1) {

                // e.g., -moz-transform is okay to be alone in @-moz-keyframes
                if (!inkeyframe || typeof inkeyframe !== "string" ||
                        name.text.indexof("-" + inkeyframe + "-") !== 0) {
                    properties.push(name);
                }
            }
        });

        parser.addlistener("endrule", function () {
            if (!properties.length) {
                return;
            }

            var propertygroups = {},
                i,
                len,
                name,
                prop,
                variations,
                value,
                full,
                actual,
                item,
                propertiesspecified;

            for (i = 0, len = properties.length; i < len; i++) {
                name = properties[i];

                for (prop in compatibleprefixes) {
                    if (compatibleprefixes.hasownproperty(prop)) {
                        variations = compatibleprefixes[prop];
                        if (csslint.util.indexof(variations, name.text) > -1) {
                            if (!propertygroups[prop]) {
                                propertygroups[prop] = {
                                    full: variations.slice(0),
                                    actual: [],
                                    actualnodes: []
                                };
                            }
                            if (csslint.util.indexof(propertygroups[prop].actual, name.text) === -1) {
                                propertygroups[prop].actual.push(name.text);
                                propertygroups[prop].actualnodes.push(name);
                            }
                        }
                    }
                }
            }

            for (prop in propertygroups) {
                if (propertygroups.hasownproperty(prop)) {
                    value = propertygroups[prop];
                    full = value.full;
                    actual = value.actual;

                    if (full.length > actual.length) {
                        for (i = 0, len = full.length; i < len; i++) {
                            item = full[i];
                            if (csslint.util.indexof(actual, item) === -1) {
                                propertiesspecified = (actual.length === 1) ? actual[0] : (actual.length === 2) ? actual.join(" and ") : actual.join(", ");
                                reporter.report("the property " + item + " is compatible with " + propertiesspecified + " and should be included as well.", value.actualnodes[0].line, value.actualnodes[0].col, rule);
                            }
                        }

                    }
                }
            }
        });
    }
});

/*
 * rule: certain properties don't play well with certain display values.
 * - float should not be used with inline-block
 * - height, width, margin-top, margin-bottom, float should not be used with inline
 * - vertical-align should not be used with block
 * - margin, float should not be used with table-*
 */

csslint.addrule({

    // rule information
    id: "display-property-grouping",
    name: "require properties appropriate for display",
    desc: "certain properties shouldn't be used with certain display property values.",
    url: "https://github.com/csslint/csslint/wiki/require-properties-appropriate-for-display",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        var propertiestocheck = {
                display: 1,
                "float": "none",
                height: 1,
                width: 1,
                margin: 1,
                "margin-left": 1,
                "margin-right": 1,
                "margin-bottom": 1,
                "margin-top": 1,
                padding: 1,
                "padding-left": 1,
                "padding-right": 1,
                "padding-bottom": 1,
                "padding-top": 1,
                "vertical-align": 1
            },
            properties;

        function reportproperty(name, display, msg) {
            if (properties[name]) {
                if (typeof propertiestocheck[name] !== "string" || properties[name].value.tolowercase() !== propertiestocheck[name]) {
                    reporter.report(msg || name + " can't be used with display: " + display + ".", properties[name].line, properties[name].col, rule);
                }
            }
        }

        function startrule() {
            properties = {};
        }

        function endrule() {

            var display = properties.display ? properties.display.value : null;
            if (display) {
                switch (display) {

                    case "inline":
                        // height, width, margin-top, margin-bottom, float should not be used with inline
                        reportproperty("height", display);
                        reportproperty("width", display);
                        reportproperty("margin", display);
                        reportproperty("margin-top", display);
                        reportproperty("margin-bottom", display);
                        reportproperty("float", display, "display:inline has no effect on floated elements (but may be used to fix the ie6 double-margin bug).");
                        break;

                    case "block":
                        // vertical-align should not be used with block
                        reportproperty("vertical-align", display);
                        break;

                    case "inline-block":
                        // float should not be used with inline-block
                        reportproperty("float", display);
                        break;

                    default:
                        // margin, float should not be used with table
                        if (display.indexof("table-") === 0) {
                            reportproperty("margin", display);
                            reportproperty("margin-left", display);
                            reportproperty("margin-right", display);
                            reportproperty("margin-top", display);
                            reportproperty("margin-bottom", display);
                            reportproperty("float", display);
                        }

                        // otherwise do nothing
                }
            }

        }

        parser.addlistener("startrule", startrule);
        parser.addlistener("startfontface", startrule);
        parser.addlistener("startkeyframerule", startrule);
        parser.addlistener("startpagemargin", startrule);
        parser.addlistener("startpage", startrule);
        parser.addlistener("startviewport", startrule);

        parser.addlistener("property", function(event) {
            var name = event.property.text.tolowercase();

            if (propertiestocheck[name]) {
                properties[name] = {
                    value: event.value.text,
                    line: event.property.line,
                    col: event.property.col
                };
            }
        });

        parser.addlistener("endrule", endrule);
        parser.addlistener("endfontface", endrule);
        parser.addlistener("endkeyframerule", endrule);
        parser.addlistener("endpagemargin", endrule);
        parser.addlistener("endpage", endrule);
        parser.addlistener("endviewport", endrule);

    }

});

/*
 * rule: disallow duplicate background-images (using url).
 */

csslint.addrule({

    // rule information
    id: "duplicate-background-images",
    name: "disallow duplicate background images",
    desc: "every background-image should be unique. use a common class for e.g. sprites.",
    url: "https://github.com/csslint/csslint/wiki/disallow-duplicate-background-images",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            stack = {};

        parser.addlistener("property", function(event) {
            var name = event.property.text,
                value = event.value,
                i, len;

            if (name.match(/background/i)) {
                for (i=0, len=value.parts.length; i < len; i++) {
                    if (value.parts[i].type === "uri") {
                        if (typeof stack[value.parts[i].uri] === "undefined") {
                            stack[value.parts[i].uri] = event;
                        } else {
                            reporter.report("background image '" + value.parts[i].uri + "' was used multiple times, first declared at line " + stack[value.parts[i].uri].line + ", col " + stack[value.parts[i].uri].col + ".", event.line, event.col, rule);
                        }
                    }
                }
            }
        });
    }
});

/*
 * rule: duplicate properties must appear one after the other. if an already-defined
 * property appears somewhere else in the rule, then it's likely an error.
 */

csslint.addrule({

    // rule information
    id: "duplicate-properties",
    name: "disallow duplicate properties",
    desc: "duplicate properties must appear one after the other.",
    url: "https://github.com/csslint/csslint/wiki/disallow-duplicate-properties",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            properties,
            lastproperty;

        function startrule() {
            properties = {};
        }

        parser.addlistener("startrule", startrule);
        parser.addlistener("startfontface", startrule);
        parser.addlistener("startpage", startrule);
        parser.addlistener("startpagemargin", startrule);
        parser.addlistener("startkeyframerule", startrule);
        parser.addlistener("startviewport", startrule);

        parser.addlistener("property", function(event) {
            var property = event.property,
                name = property.text.tolowercase();

            if (properties[name] && (lastproperty !== name || properties[name] === event.value.text)) {
                reporter.report("duplicate property '" + event.property + "' found.", event.line, event.col, rule);
            }

            properties[name] = event.value.text;
            lastproperty = name;

        });


    }

});

/*
 * rule: style rules without any properties defined should be removed.
 */

csslint.addrule({

    // rule information
    id: "empty-rules",
    name: "disallow empty rules",
    desc: "rules without any properties specified should be removed.",
    url: "https://github.com/csslint/csslint/wiki/disallow-empty-rules",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            count = 0;

        parser.addlistener("startrule", function() {
            count=0;
        });

        parser.addlistener("property", function() {
            count++;
        });

        parser.addlistener("endrule", function(event) {
            var selectors = event.selectors;
            if (count === 0) {
                reporter.report("rule is empty.", selectors[0].line, selectors[0].col, rule);
            }
        });
    }

});

/*
 * rule: there should be no syntax errors. (duh.)
 */

csslint.addrule({

    // rule information
    id: "errors",
    name: "parsing errors",
    desc: "this rule looks for recoverable syntax errors.",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addlistener("error", function(event) {
            reporter.error(event.message, event.line, event.col, rule);
        });

    }

});

csslint.addrule({

    // rule information
    id: "fallback-colors",
    name: "require fallback colors",
    desc: "for older browsers that don't support rgba, hsl, or hsla, provide a fallback color.",
    url: "https://github.com/csslint/csslint/wiki/require-fallback-colors",
    browsers: "ie6,ie7,ie8",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            lastproperty,
            propertiestocheck = {
                color: 1,
                background: 1,
                "border-color": 1,
                "border-top-color": 1,
                "border-right-color": 1,
                "border-bottom-color": 1,
                "border-left-color": 1,
                border: 1,
                "border-top": 1,
                "border-right": 1,
                "border-bottom": 1,
                "border-left": 1,
                "background-color": 1
            };

        function startrule() {
            lastproperty = null;
        }

        parser.addlistener("startrule", startrule);
        parser.addlistener("startfontface", startrule);
        parser.addlistener("startpage", startrule);
        parser.addlistener("startpagemargin", startrule);
        parser.addlistener("startkeyframerule", startrule);
        parser.addlistener("startviewport", startrule);

        parser.addlistener("property", function(event) {
            var property = event.property,
                name = property.text.tolowercase(),
                parts = event.value.parts,
                i = 0,
                colortype = "",
                len = parts.length;

            if (propertiestocheck[name]) {
                while (i < len) {
                    if (parts[i].type === "color") {
                        if ("alpha" in parts[i] || "hue" in parts[i]) {

                            if (/([^\)]+)\(/.test(parts[i])) {
                                colortype = regexp.$1.touppercase();
                            }

                            if (!lastproperty || (lastproperty.property.text.tolowercase() !== name || lastproperty.colortype !== "compat")) {
                                reporter.report("fallback " + name + " (hex or rgb) should precede " + colortype + " " + name + ".", event.line, event.col, rule);
                            }
                        } else {
                            event.colortype = "compat";
                        }
                    }

                    i++;
                }
            }

            lastproperty = event;
        });

    }

});

/*
 * rule: you shouldn't use more than 10 floats. if you do, there's probably
 * room for some abstraction.
 */

csslint.addrule({

    // rule information
    id: "floats",
    name: "disallow too many floats",
    desc: "this rule tests if the float property is used too many times",
    url: "https://github.com/csslint/csslint/wiki/disallow-too-many-floats",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;
        var count = 0;

        // count how many times "float" is used
        parser.addlistener("property", function(event) {
            if (event.property.text.tolowercase() === "float" &&
                    event.value.text.tolowercase() !== "none") {
                count++;
            }
        });

        // report the results
        parser.addlistener("endstylesheet", function() {
            reporter.stat("floats", count);
            if (count >= 10) {
                reporter.rollupwarn("too many floats (" + count + "), you're probably using them for layout. consider using a grid system instead.", rule);
            }
        });
    }

});

/*
 * rule: avoid too many @font-face declarations in the same stylesheet.
 */

csslint.addrule({

    // rule information
    id: "font-faces",
    name: "don't use too many web fonts",
    desc: "too many different web fonts in the same stylesheet.",
    url: "https://github.com/csslint/csslint/wiki/don%27t-use-too-many-web-fonts",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            count = 0;


        parser.addlistener("startfontface", function() {
            count++;
        });

        parser.addlistener("endstylesheet", function() {
            if (count > 5) {
                reporter.rollupwarn("too many @font-face declarations (" + count + ").", rule);
            }
        });
    }

});

/*
 * rule: you shouldn't need more than 9 font-size declarations.
 */

csslint.addrule({

    // rule information
    id: "font-sizes",
    name: "disallow too many font sizes",
    desc: "checks the number of font-size declarations.",
    url: "https://github.com/csslint/csslint/wiki/don%27t-use-too-many-font-size-declarations",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            count = 0;

        // check for use of "font-size"
        parser.addlistener("property", function(event) {
            if (event.property.tostring() === "font-size") {
                count++;
            }
        });

        // report the results
        parser.addlistener("endstylesheet", function() {
            reporter.stat("font-sizes", count);
            if (count >= 10) {
                reporter.rollupwarn("too many font-size declarations (" + count + "), abstraction needed.", rule);
            }
        });
    }

});

/*
 * rule: when using a vendor-prefixed gradient, make sure to use them all.
 */

csslint.addrule({

    // rule information
    id: "gradients",
    name: "require all gradient definitions",
    desc: "when using a vendor-prefixed gradient, make sure to use them all.",
    url: "https://github.com/csslint/csslint/wiki/require-all-gradient-definitions",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            gradients;

        parser.addlistener("startrule", function() {
            gradients = {
                moz: 0,
                webkit: 0,
                oldwebkit: 0,
                o: 0
            };
        });

        parser.addlistener("property", function(event) {

            if (/\-(moz|o|webkit)(?:\-(?:linear|radial))\-gradient/i.test(event.value)) {
                gradients[regexp.$1] = 1;
            } else if (/\-webkit\-gradient/i.test(event.value)) {
                gradients.oldwebkit = 1;
            }

        });

        parser.addlistener("endrule", function(event) {
            var missing = [];

            if (!gradients.moz) {
                missing.push("firefox 3.6+");
            }

            if (!gradients.webkit) {
                missing.push("webkit (safari 5+, chrome)");
            }

            if (!gradients.oldwebkit) {
                missing.push("old webkit (safari 4+, chrome)");
            }

            if (!gradients.o) {
                missing.push("opera 11.1+");
            }

            if (missing.length && missing.length < 4) {
                reporter.report("missing vendor-prefixed css gradients for " + missing.join(", ") + ".", event.selectors[0].line, event.selectors[0].col, rule);
            }

        });

    }

});

/*
 * rule: don't use ids for selectors.
 */

csslint.addrule({

    // rule information
    id: "ids",
    name: "disallow ids in selectors",
    desc: "selectors should not contain ids.",
    url: "https://github.com/csslint/csslint/wiki/disallow-ids-in-selectors",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;
        parser.addlistener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                modifier,
                idcount,
                i, j, k;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];
                idcount = 0;

                for (j=0; j < selector.parts.length; j++) {
                    part = selector.parts[j];
                    if (part.type === parser.selector_part_type) {
                        for (k=0; k < part.modifiers.length; k++) {
                            modifier = part.modifiers[k];
                            if (modifier.type === "id") {
                                idcount++;
                            }
                        }
                    }
                }

                if (idcount === 1) {
                    reporter.report("don't use ids in selectors.", selector.line, selector.col, rule);
                } else if (idcount > 1) {
                    reporter.report(idcount + " ids in the selector, really?", selector.line, selector.col, rule);
                }
            }

        });
    }

});

/*
 * rule: ie6-9 supports up to 31 stylesheet import.
 * reference:
 * http://blogs.msdn.com/b/ieinternals/archive/2011/05/14/internet-explorer-stylesheet-rule-selector-import-sheet-limit-maximum.aspx
 */

csslint.addrule({

    // rule information
    id: "import-ie-limit",
    name: "@import limit on ie6-ie9",
    desc: "ie6-9 supports up to 31 @import per stylesheet",
    browsers: "ie6, ie7, ie8, ie9",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            max_import_count = 31,
            count = 0;

        function startpage() {
            count = 0;
        }

        parser.addlistener("startpage", startpage);

        parser.addlistener("import", function() {
            count++;
        });

        parser.addlistener("endstylesheet", function() {
            if (count > max_import_count) {
                reporter.rolluperror(
                    "too many @import rules (" + count + "). ie6-9 supports up to 31 import per stylesheet.",
                    rule
                );
            }
        });
    }

});

/*
 * rule: don't use @import, use <link> instead.
 */

csslint.addrule({

    // rule information
    id: "import",
    name: "disallow @import",
    desc: "don't use @import, use <link> instead.",
    url: "https://github.com/csslint/csslint/wiki/disallow-%40import",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addlistener("import", function(event) {
            reporter.report("@import prevents parallel downloads, use <link> instead.", event.line, event.col, rule);
        });

    }

});

/*
 * rule: make sure !important is not overused, this could lead to specificity
 * war. display a warning on !important declarations, an error if it's
 * used more at least 10 times.
 */

csslint.addrule({

    // rule information
    id: "important",
    name: "disallow !important",
    desc: "be careful when using !important declaration",
    url: "https://github.com/csslint/csslint/wiki/disallow-%21important",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            count = 0;

        // warn that important is used and increment the declaration counter
        parser.addlistener("property", function(event) {
            if (event.important === true) {
                count++;
                reporter.report("use of !important", event.line, event.col, rule);
            }
        });

        // if there are more than 10, show an error
        parser.addlistener("endstylesheet", function() {
            reporter.stat("important", count);
            if (count >= 10) {
                reporter.rollupwarn("too many !important declarations (" + count + "), try to use less than 10 to avoid specificity issues.", rule);
            }
        });
    }

});

/*
 * rule: properties should be known (listed in css3 specification) or
 * be a vendor-prefixed property.
 */

csslint.addrule({

    // rule information
    id: "known-properties",
    name: "require use of known properties",
    desc: "properties should be known (listed in css3 specification) or be a vendor-prefixed property.",
    url: "https://github.com/csslint/csslint/wiki/require-use-of-known-properties",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addlistener("property", function(event) {

            // the check is handled entirely by the parser-lib (https://github.com/nzakas/parser-lib)
            if (event.invalid) {
                reporter.report(event.invalid.message, event.line, event.col, rule);
            }

        });
    }

});

/*
 * rule: all properties should be in alphabetical order.
 */

csslint.addrule({

    // rule information
    id: "order-alphabetical",
    name: "alphabetical order",
    desc: "assure properties are in alphabetical order",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            properties;

        var startrule = function () {
            properties = [];
        };

        var endrule = function(event) {
            var currentproperties = properties.join(","),
                expectedproperties = properties.sort().join(",");

            if (currentproperties !== expectedproperties) {
                reporter.report("rule doesn't have all its properties in alphabetical order.", event.line, event.col, rule);
            }
        };

        parser.addlistener("startrule", startrule);
        parser.addlistener("startfontface", startrule);
        parser.addlistener("startpage", startrule);
        parser.addlistener("startpagemargin", startrule);
        parser.addlistener("startkeyframerule", startrule);
        parser.addlistener("startviewport", startrule);

        parser.addlistener("property", function(event) {
            var name = event.property.text,
                lowercaseprefixlessname = name.tolowercase().replace(/^-.*?-/, "");

            properties.push(lowercaseprefixlessname);
        });

        parser.addlistener("endrule", endrule);
        parser.addlistener("endfontface", endrule);
        parser.addlistener("endpage", endrule);
        parser.addlistener("endpagemargin", endrule);
        parser.addlistener("endkeyframerule", endrule);
        parser.addlistener("endviewport", endrule);
    }

});

/*
 * rule: outline: none or outline: 0 should only be used in a :focus rule
 *       and only if there are other properties in the same rule.
 */

csslint.addrule({

    // rule information
    id: "outline-none",
    name: "disallow outline: none",
    desc: "use of outline: none or outline: 0 should be limited to :focus rules.",
    url: "https://github.com/csslint/csslint/wiki/disallow-outline%3anone",
    browsers: "all",
    tags: ["accessibility"],

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            lastrule;

        function startrule(event) {
            if (event.selectors) {
                lastrule = {
                    line: event.line,
                    col: event.col,
                    selectors: event.selectors,
                    propcount: 0,
                    outline: false
                };
            } else {
                lastrule = null;
            }
        }

        function endrule() {
            if (lastrule) {
                if (lastrule.outline) {
                    if (lastrule.selectors.tostring().tolowercase().indexof(":focus") === -1) {
                        reporter.report("outlines should only be modified using :focus.", lastrule.line, lastrule.col, rule);
                    } else if (lastrule.propcount === 1) {
                        reporter.report("outlines shouldn't be hidden unless other visual changes are made.", lastrule.line, lastrule.col, rule);
                    }
                }
            }
        }

        parser.addlistener("startrule", startrule);
        parser.addlistener("startfontface", startrule);
        parser.addlistener("startpage", startrule);
        parser.addlistener("startpagemargin", startrule);
        parser.addlistener("startkeyframerule", startrule);
        parser.addlistener("startviewport", startrule);

        parser.addlistener("property", function(event) {
            var name = event.property.text.tolowercase(),
                value = event.value;

            if (lastrule) {
                lastrule.propcount++;
                if (name === "outline" && (value.tostring() === "none" || value.tostring() === "0")) {
                    lastrule.outline = true;
                }
            }

        });

        parser.addlistener("endrule", endrule);
        parser.addlistener("endfontface", endrule);
        parser.addlistener("endpage", endrule);
        parser.addlistener("endpagemargin", endrule);
        parser.addlistener("endkeyframerule", endrule);
        parser.addlistener("endviewport", endrule);

    }

});

/*
 * rule: don't use classes or ids with elements (a.foo or a#foo).
 */

csslint.addrule({

    // rule information
    id: "overqualified-elements",
    name: "disallow overqualified elements",
    desc: "don't use classes or ids with elements (a.foo or a#foo).",
    url: "https://github.com/csslint/csslint/wiki/disallow-overqualified-elements",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            classes = {};

        parser.addlistener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                modifier,
                i, j, k;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];

                for (j=0; j < selector.parts.length; j++) {
                    part = selector.parts[j];
                    if (part.type === parser.selector_part_type) {
                        for (k=0; k < part.modifiers.length; k++) {
                            modifier = part.modifiers[k];
                            if (part.elementname && modifier.type === "id") {
                                reporter.report("element (" + part + ") is overqualified, just use " + modifier + " without element name.", part.line, part.col, rule);
                            } else if (modifier.type === "class") {

                                if (!classes[modifier]) {
                                    classes[modifier] = [];
                                }
                                classes[modifier].push({
                                    modifier: modifier,
                                    part: part
                                });
                            }
                        }
                    }
                }
            }
        });

        parser.addlistener("endstylesheet", function() {

            var prop;
            for (prop in classes) {
                if (classes.hasownproperty(prop)) {

                    // one use means that this is overqualified
                    if (classes[prop].length === 1 && classes[prop][0].part.elementname) {
                        reporter.report("element (" + classes[prop][0].part + ") is overqualified, just use " + classes[prop][0].modifier + " without element name.", classes[prop][0].part.line, classes[prop][0].part.col, rule);
                    }
                }
            }
        });
    }

});

/*
 * rule: headings (h1-h6) should not be qualified (namespaced).
 */

csslint.addrule({

    // rule information
    id: "qualified-headings",
    name: "disallow qualified headings",
    desc: "headings should not be qualified (namespaced).",
    url: "https://github.com/csslint/csslint/wiki/disallow-qualified-headings",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addlistener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                i, j;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];

                for (j=0; j < selector.parts.length; j++) {
                    part = selector.parts[j];
                    if (part.type === parser.selector_part_type) {
                        if (part.elementname && /h[1-6]/.test(part.elementname.tostring()) && j > 0) {
                            reporter.report("heading (" + part.elementname + ") should not be qualified.", part.line, part.col, rule);
                        }
                    }
                }
            }
        });
    }

});

/*
 * rule: selectors that look like regular expressions are slow and should be avoided.
 */

csslint.addrule({

    // rule information
    id: "regex-selectors",
    name: "disallow selectors that look like regexs",
    desc: "selectors that look like regular expressions are slow and should be avoided.",
    url: "https://github.com/csslint/csslint/wiki/disallow-selectors-that-look-like-regular-expressions",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addlistener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                modifier,
                i, j, k;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];
                for (j=0; j < selector.parts.length; j++) {
                    part = selector.parts[j];
                    if (part.type === parser.selector_part_type) {
                        for (k=0; k < part.modifiers.length; k++) {
                            modifier = part.modifiers[k];
                            if (modifier.type === "attribute") {
                                if (/([~\|\^\$\*]=)/.test(modifier)) {
                                    reporter.report("attribute selectors with " + regexp.$1 + " are slow!", modifier.line, modifier.col, rule);
                                }
                            }

                        }
                    }
                }
            }
        });
    }

});

/*
 * rule: total number of rules should not exceed x.
 */

csslint.addrule({

    // rule information
    id: "rules-count",
    name: "rules count",
    desc: "track how many rules there are.",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var count = 0;

        // count each rule
        parser.addlistener("startrule", function() {
            count++;
        });

        parser.addlistener("endstylesheet", function() {
            reporter.stat("rule-count", count);
        });
    }

});

/*
 * rule: warn people with approaching the ie 4095 limit
 */

csslint.addrule({

    // rule information
    id: "selector-max-approaching",
    name: "warn when approaching the 4095 selector limit for ie",
    desc: "will warn when selector count is >= 3800 selectors.",
    browsers: "ie",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this, count = 0;

        parser.addlistener("startrule", function(event) {
            count += event.selectors.length;
        });

        parser.addlistener("endstylesheet", function() {
            if (count >= 3800) {
                reporter.report("you have " + count + " selectors. internet explorer supports a maximum of 4095 selectors per stylesheet. consider refactoring.", 0, 0, rule);
            }
        });
    }

});

/*
 * rule: warn people past the ie 4095 limit
 */

csslint.addrule({

    // rule information
    id: "selector-max",
    name: "error when past the 4095 selector limit for ie",
    desc: "will error when selector count is > 4095.",
    browsers: "ie",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this, count = 0;

        parser.addlistener("startrule", function(event) {
            count += event.selectors.length;
        });

        parser.addlistener("endstylesheet", function() {
            if (count > 4095) {
                reporter.report("you have " + count + " selectors. internet explorer supports a maximum of 4095 selectors per stylesheet. consider refactoring.", 0, 0, rule);
            }
        });
    }

});

/*
 * rule: avoid new-line characters in selectors.
 */

csslint.addrule({

    // rule information
    id: "selector-newline",
    name: "disallow new-line characters in selectors",
    desc: "new-line characters in selectors are usually a forgotten comma and not a descendant combinator.",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        function startrule(event) {
            var i, len, selector, p, n, plen, part, part2, type, currentline, nextline,
                selectors = event.selectors;

            for (i = 0, len = selectors.length; i < len; i++) {
                selector = selectors[i];
                for (p = 0, plen = selector.parts.length; p < plen; p++) {
                    for (n = p + 1; n < plen; n++) {
                        part = selector.parts[p];
                        part2 = selector.parts[n];
                        type = part.type;
                        currentline = part.line;
                        nextline = part2.line;

                        if (type === "descendant" && nextline > currentline) {
                            reporter.report("newline character found in selector (forgot a comma?)", currentline, selectors[i].parts[0].col, rule);
                        }
                    }
                }

            }
        }

        parser.addlistener("startrule", startrule);

    }
});

/*
 * rule: use shorthand properties where possible.
 *
 */

csslint.addrule({

    // rule information
    id: "shorthand",
    name: "require shorthand properties",
    desc: "use shorthand properties where possible.",
    url: "https://github.com/csslint/csslint/wiki/require-shorthand-properties",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            prop, i, len,
            propertiestocheck = {},
            properties,
            mapping = {
                "margin": [
                    "margin-top",
                    "margin-bottom",
                    "margin-left",
                    "margin-right"
                ],
                "padding": [
                    "padding-top",
                    "padding-bottom",
                    "padding-left",
                    "padding-right"
                ]
            };

        // initialize propertiestocheck
        for (prop in mapping) {
            if (mapping.hasownproperty(prop)) {
                for (i=0, len=mapping[prop].length; i < len; i++) {
                    propertiestocheck[mapping[prop][i]] = prop;
                }
            }
        }

        function startrule() {
            properties = {};
        }

        // event handler for end of rules
        function endrule(event) {

            var prop, i, len, total;

            // check which properties this rule has
            for (prop in mapping) {
                if (mapping.hasownproperty(prop)) {
                    total=0;

                    for (i=0, len=mapping[prop].length; i < len; i++) {
                        total += properties[mapping[prop][i]] ? 1 : 0;
                    }

                    if (total === mapping[prop].length) {
                        reporter.report("the properties " + mapping[prop].join(", ") + " can be replaced by " + prop + ".", event.line, event.col, rule);
                    }
                }
            }
        }

        parser.addlistener("startrule", startrule);
        parser.addlistener("startfontface", startrule);

        // check for use of "font-size"
        parser.addlistener("property", function(event) {
            var name = event.property.tostring().tolowercase();

            if (propertiestocheck[name]) {
                properties[name] = 1;
            }
        });

        parser.addlistener("endrule", endrule);
        parser.addlistener("endfontface", endrule);

    }

});

/*
 * rule: don't use properties with a star prefix.
 *
 */

csslint.addrule({

    // rule information
    id: "star-property-hack",
    name: "disallow properties with a star prefix",
    desc: "checks for the star property hack (targets ie6/7)",
    url: "https://github.com/csslint/csslint/wiki/disallow-star-hack",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        // check if property name starts with "*"
        parser.addlistener("property", function(event) {
            var property = event.property;

            if (property.hack === "*") {
                reporter.report("property with star prefix found.", event.property.line, event.property.col, rule);
            }
        });
    }
});

/*
 * rule: don't use text-indent for image replacement if you need to support rtl.
 *
 */

csslint.addrule({

    // rule information
    id: "text-indent",
    name: "disallow negative text-indent",
    desc: "checks for text indent less than -99px",
    url: "https://github.com/csslint/csslint/wiki/disallow-negative-text-indent",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            textindent,
            direction;


        function startrule() {
            textindent = false;
            direction = "inherit";
        }

        // event handler for end of rules
        function endrule() {
            if (textindent && direction !== "ltr") {
                reporter.report("negative text-indent doesn't work well with rtl. if you use text-indent for image replacement explicitly set direction for that item to ltr.", textindent.line, textindent.col, rule);
            }
        }

        parser.addlistener("startrule", startrule);
        parser.addlistener("startfontface", startrule);

        // check for use of "font-size"
        parser.addlistener("property", function(event) {
            var name = event.property.tostring().tolowercase(),
                value = event.value;

            if (name === "text-indent" && value.parts[0].value < -99) {
                textindent = event.property;
            } else if (name === "direction" && value.tostring() === "ltr") {
                direction = "ltr";
            }
        });

        parser.addlistener("endrule", endrule);
        parser.addlistener("endfontface", endrule);

    }

});

/*
 * rule: don't use properties with a underscore prefix.
 *
 */

csslint.addrule({

    // rule information
    id: "underscore-property-hack",
    name: "disallow properties with an underscore prefix",
    desc: "checks for the underscore property hack (targets ie6)",
    url: "https://github.com/csslint/csslint/wiki/disallow-underscore-hack",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        // check if property name starts with "_"
        parser.addlistener("property", function(event) {
            var property = event.property;

            if (property.hack === "_") {
                reporter.report("property with underscore prefix found.", event.property.line, event.property.col, rule);
            }
        });
    }
});

/*
 * rule: headings (h1-h6) should be defined only once.
 */

csslint.addrule({

    // rule information
    id: "unique-headings",
    name: "headings should only be defined once",
    desc: "headings should be defined only once.",
    url: "https://github.com/csslint/csslint/wiki/headings-should-only-be-defined-once",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        var headings = {
            h1: 0,
            h2: 0,
            h3: 0,
            h4: 0,
            h5: 0,
            h6: 0
        };

        parser.addlistener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                pseudo,
                i, j;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];
                part = selector.parts[selector.parts.length-1];

                if (part.elementname && /(h[1-6])/i.test(part.elementname.tostring())) {

                    for (j=0; j < part.modifiers.length; j++) {
                        if (part.modifiers[j].type === "pseudo") {
                            pseudo = true;
                            break;
                        }
                    }

                    if (!pseudo) {
                        headings[regexp.$1]++;
                        if (headings[regexp.$1] > 1) {
                            reporter.report("heading (" + part.elementname + ") has already been defined.", part.line, part.col, rule);
                        }
                    }
                }
            }
        });

        parser.addlistener("endstylesheet", function() {
            var prop,
                messages = [];

            for (prop in headings) {
                if (headings.hasownproperty(prop)) {
                    if (headings[prop] > 1) {
                        messages.push(headings[prop] + " " + prop + "s");
                    }
                }
            }

            if (messages.length) {
                reporter.rollupwarn("you have " + messages.join(", ") + " defined in this stylesheet.", rule);
            }
        });
    }

});

/*
 * rule: don't use universal selector because it's slow.
 */

csslint.addrule({

    // rule information
    id: "universal-selector",
    name: "disallow universal selector",
    desc: "the universal selector (*) is known to be slow.",
    url: "https://github.com/csslint/csslint/wiki/disallow-universal-selector",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addlistener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                i;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];

                part = selector.parts[selector.parts.length-1];
                if (part.elementname === "*") {
                    reporter.report(rule.desc, part.line, part.col, rule);
                }
            }
        });
    }

});

/*
 * rule: don't use unqualified attribute selectors because they're just like universal selectors.
 */

csslint.addrule({

    // rule information
    id: "unqualified-attributes",
    name: "disallow unqualified attribute selectors",
    desc: "unqualified attribute selectors are known to be slow.",
    url: "https://github.com/csslint/csslint/wiki/disallow-unqualified-attribute-selectors",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";

        var rule = this;

        parser.addlistener("startrule", function(event) {

            var selectors = event.selectors,
                selectorcontainsclassorid = false,
                selector,
                part,
                modifier,
                i, k;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];

                part = selector.parts[selector.parts.length-1];
                if (part.type === parser.selector_part_type) {
                    for (k=0; k < part.modifiers.length; k++) {
                        modifier = part.modifiers[k];

                        if (modifier.type === "class" || modifier.type === "id") {
                            selectorcontainsclassorid = true;
                            break;
                        }
                    }

                    if (!selectorcontainsclassorid) {
                        for (k=0; k < part.modifiers.length; k++) {
                            modifier = part.modifiers[k];
                            if (modifier.type === "attribute" && (!part.elementname || part.elementname === "*")) {
                                reporter.report(rule.desc, part.line, part.col, rule);
                            }
                        }
                    }
                }

            }
        });
    }

});

/*
 * rule: when using a vendor-prefixed property, make sure to
 * include the standard one.
 */

csslint.addrule({

    // rule information
    id: "vendor-prefix",
    name: "require standard property with vendor prefix",
    desc: "when using a vendor-prefixed property, make sure to include the standard one.",
    url: "https://github.com/csslint/csslint/wiki/require-standard-property-with-vendor-prefix",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            properties,
            num,
            propertiestocheck = {
                "-webkit-border-radius": "border-radius",
                "-webkit-border-top-left-radius": "border-top-left-radius",
                "-webkit-border-top-right-radius": "border-top-right-radius",
                "-webkit-border-bottom-left-radius": "border-bottom-left-radius",
                "-webkit-border-bottom-right-radius": "border-bottom-right-radius",

                "-o-border-radius": "border-radius",
                "-o-border-top-left-radius": "border-top-left-radius",
                "-o-border-top-right-radius": "border-top-right-radius",
                "-o-border-bottom-left-radius": "border-bottom-left-radius",
                "-o-border-bottom-right-radius": "border-bottom-right-radius",

                "-moz-border-radius": "border-radius",
                "-moz-border-radius-topleft": "border-top-left-radius",
                "-moz-border-radius-topright": "border-top-right-radius",
                "-moz-border-radius-bottomleft": "border-bottom-left-radius",
                "-moz-border-radius-bottomright": "border-bottom-right-radius",

                "-moz-column-count": "column-count",
                "-webkit-column-count": "column-count",

                "-moz-column-gap": "column-gap",
                "-webkit-column-gap": "column-gap",

                "-moz-column-rule": "column-rule",
                "-webkit-column-rule": "column-rule",

                "-moz-column-rule-style": "column-rule-style",
                "-webkit-column-rule-style": "column-rule-style",

                "-moz-column-rule-color": "column-rule-color",
                "-webkit-column-rule-color": "column-rule-color",

                "-moz-column-rule-width": "column-rule-width",
                "-webkit-column-rule-width": "column-rule-width",

                "-moz-column-width": "column-width",
                "-webkit-column-width": "column-width",

                "-webkit-column-span": "column-span",
                "-webkit-columns": "columns",

                "-moz-box-shadow": "box-shadow",
                "-webkit-box-shadow": "box-shadow",

                "-moz-transform": "transform",
                "-webkit-transform": "transform",
                "-o-transform": "transform",
                "-ms-transform": "transform",

                "-moz-transform-origin": "transform-origin",
                "-webkit-transform-origin": "transform-origin",
                "-o-transform-origin": "transform-origin",
                "-ms-transform-origin": "transform-origin",

                "-moz-box-sizing": "box-sizing",
                "-webkit-box-sizing": "box-sizing"
            };

        // event handler for beginning of rules
        function startrule() {
            properties = {};
            num = 1;
        }

        // event handler for end of rules
        function endrule() {
            var prop,
                i,
                len,
                needed,
                actual,
                needsstandard = [];

            for (prop in properties) {
                if (propertiestocheck[prop]) {
                    needsstandard.push({
                        actual: prop,
                        needed: propertiestocheck[prop]
                    });
                }
            }

            for (i=0, len=needsstandard.length; i < len; i++) {
                needed = needsstandard[i].needed;
                actual = needsstandard[i].actual;

                if (!properties[needed]) {
                    reporter.report("missing standard property '" + needed + "' to go along with '" + actual + "'.", properties[actual][0].name.line, properties[actual][0].name.col, rule);
                } else {
                    // make sure standard property is last
                    if (properties[needed][0].pos < properties[actual][0].pos) {
                        reporter.report("standard property '" + needed + "' should come after vendor-prefixed property '" + actual + "'.", properties[actual][0].name.line, properties[actual][0].name.col, rule);
                    }
                }
            }

        }

        parser.addlistener("startrule", startrule);
        parser.addlistener("startfontface", startrule);
        parser.addlistener("startpage", startrule);
        parser.addlistener("startpagemargin", startrule);
        parser.addlistener("startkeyframerule", startrule);
        parser.addlistener("startviewport", startrule);

        parser.addlistener("property", function(event) {
            var name = event.property.text.tolowercase();

            if (!properties[name]) {
                properties[name] = [];
            }

            properties[name].push({
                name: event.property,
                value: event.value,
                pos: num++
            });
        });

        parser.addlistener("endrule", endrule);
        parser.addlistener("endfontface", endrule);
        parser.addlistener("endpage", endrule);
        parser.addlistener("endpagemargin", endrule);
        parser.addlistener("endkeyframerule", endrule);
        parser.addlistener("endviewport", endrule);
    }

});

/*
 * rule: you don't need to specify units when a value is 0.
 */

csslint.addrule({

    // rule information
    id: "zero-units",
    name: "disallow units for 0 values",
    desc: "you don't need to specify units when a value is 0.",
    url: "https://github.com/csslint/csslint/wiki/disallow-units-for-zero-values",
    browsers: "all",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        // count how many times "float" is used
        parser.addlistener("property", function(event) {
            var parts = event.value.parts,
                i = 0,
                len = parts.length;

            while (i < len) {
                if ((parts[i].units || parts[i].type === "percentage") && parts[i].value === 0 && parts[i].type !== "time") {
                    reporter.report("values of 0 shouldn't have units specified.", parts[i].line, parts[i].col, rule);
                }
                i++;
            }

        });

    }

});

(function() {
    "use strict";

    /**
     * replace special characters before write to output.
     *
     * rules:
     *  - single quotes is the escape sequence for double-quotes
     *  - &amp; is the escape sequence for &
     *  - &lt; is the escape sequence for <
     *  - &gt; is the escape sequence for >
     *
     * @param {string} message to escape
     * @return escaped message as {string}
     */
    var xmlescape = function(str) {
        if (!str || str.constructor !== string) {
            return "";
        }

        return str.replace(/["&><]/g, function(match) {
            switch (match) {
                case "\"":
                    return "&quot;";
                case "&":
                    return "&amp;";
                case "<":
                    return "&lt;";
                case ">":
                    return "&gt;";
            }
        });
    };

    csslint.addformatter({
        // format information
        id: "checkstyle-xml",
        name: "checkstyle xml format",

        /**
         * return opening root xml tag.
         * @return {string} to prepend before all results
         */
        startformat: function() {
            return "<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle>";
        },

        /**
         * return closing root xml tag.
         * @return {string} to append after all results
         */
        endformat: function() {
            return "</checkstyle>";
        },

        /**
         * returns message when there is a file read error.
         * @param {string} filename the name of the file that caused the error.
         * @param {string} message the error message
         * @return {string} the error message.
         */
        readerror: function(filename, message) {
            return "<file name=\"" + xmlescape(filename) + "\"><error line=\"0\" column=\"0\" severty=\"error\" message=\"" + xmlescape(message) + "\"></error></file>";
        },

        /**
         * given css lint results for a file, return output for this format.
         * @param results {object} with error and warning messages
         * @param filename {string} relative file path
         * @param options {object} (unused for now) specifies special handling of output
         * @return {string} output for results
         */
        formatresults: function(results, filename/*, options*/) {
            var messages = results.messages,
                output = [];

            /**
             * generate a source string for a rule.
             * checkstyle source strings usually resemble java class names e.g
             * net.csslint.somerulename
             * @param {object} rule
             * @return rule source as {string}
             */
            var generatesource = function(rule) {
                if (!rule || !("name" in rule)) {
                    return "";
                }
                return "net.csslint." + rule.name.replace(/\s/g, "");
            };


            if (messages.length > 0) {
                output.push("<file name=\""+filename+"\">");
                csslint.util.foreach(messages, function (message) {
                    // ignore rollups for now
                    if (!message.rollup) {
                        output.push("<error line=\"" + message.line + "\" column=\"" + message.col + "\" severity=\"" + message.type + "\"" +
                          " message=\"" + xmlescape(message.message) + "\" source=\"" + generatesource(message.rule) +"\"/>");
                    }
                });
                output.push("</file>");
            }

            return output.join("");
        }
    });

}());

csslint.addformatter({
    // format information
    id: "compact",
    name: "compact, 'porcelain' format",

    /**
     * return content to be printed before all file results.
     * @return {string} to prepend before all results
     */
    startformat: function() {
        "use strict";
        return "";
    },

    /**
     * return content to be printed after all file results.
     * @return {string} to append after all results
     */
    endformat: function() {
        "use strict";
        return "";
    },

    /**
     * given css lint results for a file, return output for this format.
     * @param results {object} with error and warning messages
     * @param filename {string} relative file path
     * @param options {object} (optional) specifies special handling of output
     * @return {string} output for results
     */
    formatresults: function(results, filename, options) {
        "use strict";
        var messages = results.messages,
            output = "";
        options = options || {};

        /**
         * capitalize and return given string.
         * @param str {string} to capitalize
         * @return {string} capitalized
         */
        var capitalize = function(str) {
            return str.charat(0).touppercase() + str.slice(1);
        };

        if (messages.length === 0) {
            return options.quiet ? "" : filename + ": lint free!";
        }

        csslint.util.foreach(messages, function(message) {
            if (message.rollup) {
                output += filename + ": " + capitalize(message.type) + " - " + message.message + " (" + message.rule.id + ")\n";
            } else {
                output += filename + ": line " + message.line +
                    ", col " + message.col + ", " + capitalize(message.type) + " - " + message.message + " (" + message.rule.id + ")\n";
            }
        });

        return output;
    }
});

csslint.addformatter({
    // format information
    id: "csslint-xml",
    name: "csslint xml format",

    /**
     * return opening root xml tag.
     * @return {string} to prepend before all results
     */
    startformat: function() {
        "use strict";
        return "<?xml version=\"1.0\" encoding=\"utf-8\"?><csslint>";
    },

    /**
     * return closing root xml tag.
     * @return {string} to append after all results
     */
    endformat: function() {
        "use strict";
        return "</csslint>";
    },

    /**
     * given css lint results for a file, return output for this format.
     * @param results {object} with error and warning messages
     * @param filename {string} relative file path
     * @param options {object} (unused for now) specifies special handling of output
     * @return {string} output for results
     */
    formatresults: function(results, filename/*, options*/) {
        "use strict";
        var messages = results.messages,
            output = [];

        /**
         * replace special characters before write to output.
         *
         * rules:
         *  - single quotes is the escape sequence for double-quotes
         *  - &amp; is the escape sequence for &
         *  - &lt; is the escape sequence for <
         *  - &gt; is the escape sequence for >
         *
         * @param {string} message to escape
         * @return escaped message as {string}
         */
        var escapespecialcharacters = function(str) {
            if (!str || str.constructor !== string) {
                return "";
            }
            return str.replace(/"/g, "'").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };

        if (messages.length > 0) {
            output.push("<file name=\""+filename+"\">");
            csslint.util.foreach(messages, function (message) {
                if (message.rollup) {
                    output.push("<issue severity=\"" + message.type + "\" reason=\"" + escapespecialcharacters(message.message) + "\" evidence=\"" + escapespecialcharacters(message.evidence) + "\"/>");
                } else {
                    output.push("<issue line=\"" + message.line + "\" char=\"" + message.col + "\" severity=\"" + message.type + "\"" +
                        " reason=\"" + escapespecialcharacters(message.message) + "\" evidence=\"" + escapespecialcharacters(message.evidence) + "\"/>");
                }
            });
            output.push("</file>");
        }

        return output.join("");
    }
});

/* globals json: true */

csslint.addformatter({
    // format information
    id: "json",
    name: "json",

    /**
     * return content to be printed before all file results.
     * @return {string} to prepend before all results
     */
    startformat: function() {
        "use strict";
        this.json = [];
        return "";
    },

    /**
     * return content to be printed after all file results.
     * @return {string} to append after all results
     */
    endformat: function() {
        "use strict";
        var ret = "";
        if (this.json.length > 0) {
            if (this.json.length === 1) {
                ret = json.stringify(this.json[0]);
            } else {
                ret = json.stringify(this.json);
            }
        }
        return ret;
    },

    /**
     * given css lint results for a file, return output for this format.
     * @param results {object} with error and warning messages
     * @param filename {string} relative file path (unused)
     * @return {string} output for results
     */
    formatresults: function(results, filename, options) {
        "use strict";
        if (results.messages.length > 0 || !options.quiet) {
            this.json.push({
                filename: filename,
                messages: results.messages,
                stats: results.stats
            });
        }
        return "";
    }
});

csslint.addformatter({
    // format information
    id: "junit-xml",
    name: "junit xml format",

    /**
     * return opening root xml tag.
     * @return {string} to prepend before all results
     */
    startformat: function() {
        "use strict";
        return "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites>";
    },

    /**
     * return closing root xml tag.
     * @return {string} to append after all results
     */
    endformat: function() {
        "use strict";
        return "</testsuites>";
    },

    /**
     * given css lint results for a file, return output for this format.
     * @param results {object} with error and warning messages
     * @param filename {string} relative file path
     * @param options {object} (unused for now) specifies special handling of output
     * @return {string} output for results
     */
    formatresults: function(results, filename/*, options*/) {
        "use strict";

        var messages = results.messages,
            output = [],
            tests = {
                "error": 0,
                "failure": 0
            };

        /**
         * generate a source string for a rule.
         * junit source strings usually resemble java class names e.g
         * net.csslint.somerulename
         * @param {object} rule
         * @return rule source as {string}
         */
        var generatesource = function(rule) {
            if (!rule || !("name" in rule)) {
                return "";
            }
            return "net.csslint." + rule.name.replace(/\s/g, "");
        };

        /**
         * replace special characters before write to output.
         *
         * rules:
         *  - single quotes is the escape sequence for double-quotes
         *  - &lt; is the escape sequence for <
         *  - &gt; is the escape sequence for >
         *
         * @param {string} message to escape
         * @return escaped message as {string}
         */
        var escapespecialcharacters = function(str) {

            if (!str || str.constructor !== string) {
                return "";
            }

            return str.replace(/"/g, "'").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        };

        if (messages.length > 0) {

            messages.foreach(function (message) {

                // since junit has no warning class
                // all issues as errors
                var type = message.type === "warning" ? "error" : message.type;

                // ignore rollups for now
                if (!message.rollup) {

                    // build the test case separately, once joined
                    // we'll add it to a custom array filtered by type
                    output.push("<testcase time=\"0\" name=\"" + generatesource(message.rule) + "\">");
                    output.push("<" + type + " message=\"" + escapespecialcharacters(message.message) + "\"><![cdata[" + message.line + ":" + message.col + ":" + escapespecialcharacters(message.evidence) + "]]></" + type + ">");
                    output.push("</testcase>");

                    tests[type] += 1;

                }

            });

            output.unshift("<testsuite time=\"0\" tests=\"" + messages.length + "\" skipped=\"0\" errors=\"" + tests.error + "\" failures=\"" + tests.failure + "\" package=\"net.csslint\" name=\"" + filename + "\">");
            output.push("</testsuite>");

        }

        return output.join("");

    }
});

csslint.addformatter({
    // format information
    id: "lint-xml",
    name: "lint xml format",

    /**
     * return opening root xml tag.
     * @return {string} to prepend before all results
     */
    startformat: function() {
        "use strict";
        return "<?xml version=\"1.0\" encoding=\"utf-8\"?><lint>";
    },

    /**
     * return closing root xml tag.
     * @return {string} to append after all results
     */
    endformat: function() {
        "use strict";
        return "</lint>";
    },

    /**
     * given css lint results for a file, return output for this format.
     * @param results {object} with error and warning messages
     * @param filename {string} relative file path
     * @param options {object} (unused for now) specifies special handling of output
     * @return {string} output for results
     */
    formatresults: function(results, filename/*, options*/) {
        "use strict";
        var messages = results.messages,
            output = [];

        /**
         * replace special characters before write to output.
         *
         * rules:
         *  - single quotes is the escape sequence for double-quotes
         *  - &amp; is the escape sequence for &
         *  - &lt; is the escape sequence for <
         *  - &gt; is the escape sequence for >
         *
         * @param {string} message to escape
         * @return escaped message as {string}
         */
        var escapespecialcharacters = function(str) {
            if (!str || str.constructor !== string) {
                return "";
            }
            return str.replace(/"/g, "'").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };

        if (messages.length > 0) {

            output.push("<file name=\""+filename+"\">");
            csslint.util.foreach(messages, function (message) {
                if (message.rollup) {
                    output.push("<issue severity=\"" + message.type + "\" reason=\"" + escapespecialcharacters(message.message) + "\" evidence=\"" + escapespecialcharacters(message.evidence) + "\"/>");
                } else {
                    var rule = "";
                    if (message.rule && message.rule.id) {
                        rule = "rule=\"" + escapespecialcharacters(message.rule.id) + "\" ";
                    }
                    output.push("<issue " + rule + "line=\"" + message.line + "\" char=\"" + message.col + "\" severity=\"" + message.type + "\"" +
                        " reason=\"" + escapespecialcharacters(message.message) + "\" evidence=\"" + escapespecialcharacters(message.evidence) + "\"/>");
                }
            });
            output.push("</file>");
        }

        return output.join("");
    }
});

csslint.addformatter({
    // format information
    id: "text",
    name: "plain text",

    /**
     * return content to be printed before all file results.
     * @return {string} to prepend before all results
     */
    startformat: function() {
        "use strict";
        return "";
    },

    /**
     * return content to be printed after all file results.
     * @return {string} to append after all results
     */
    endformat: function() {
        "use strict";
        return "";
    },

    /**
     * given css lint results for a file, return output for this format.
     * @param results {object} with error and warning messages
     * @param filename {string} relative file path
     * @param options {object} (optional) specifies special handling of output
     * @return {string} output for results
     */
    formatresults: function(results, filename, options) {
        "use strict";
        var messages = results.messages,
            output = "";
        options = options || {};

        if (messages.length === 0) {
            return options.quiet ? "" : "\n\ncsslint: no errors in " + filename + ".";
        }

        output = "\n\ncsslint: there ";
        if (messages.length === 1) {
            output += "is 1 problem";
        } else {
            output += "are " + messages.length + " problems";
        }
        output += " in " + filename + ".";

        var pos = filename.lastindexof("/"),
            shortfilename = filename;

        if (pos === -1) {
            pos = filename.lastindexof("\\");
        }
        if (pos > -1) {
            shortfilename = filename.substring(pos+1);
        }

        csslint.util.foreach(messages, function (message, i) {
            output = output + "\n\n" + shortfilename;
            if (message.rollup) {
                output += "\n" + (i+1) + ": " + message.type;
                output += "\n" + message.message;
            } else {
                output += "\n" + (i+1) + ": " + message.type + " at line " + message.line + ", col " + message.col;
                output += "\n" + message.message;
                output += "\n" + message.evidence;
            }
        });

        return output;
    }
});

return csslint;
})();







