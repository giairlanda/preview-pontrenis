/*!
 * jquery migrate - v3.4.1 - 2023-02-23t15:31z
 * copyright openjs foundation and other contributors
 */
( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// amd. register as an anonymous module.
		define( [ "jquery" ], function( jquery ) {
			return factory( jquery, window );
		} );
	} else if ( typeof module === "object" && module.exports ) {

		// node/commonjs
		// eslint-disable-next-line no-undef
		module.exports = factory( require( "jquery" ), window );
	} else {

		// browser globals
		factory( jquery, window );
	}
} )( function( jquery, window ) {
"use strict";

jquery.migrateversion = "3.4.1";

// returns 0 if v1 == v2, -1 if v1 < v2, 1 if v1 > v2
function compareversions( v1, v2 ) {
	var i,
		rversionparts = /^(\d+)\.(\d+)\.(\d+)/,
		v1p = rversionparts.exec( v1 ) || [ ],
		v2p = rversionparts.exec( v2 ) || [ ];

	for ( i = 1; i <= 3; i++ ) {
		if ( +v1p[ i ] > +v2p[ i ] ) {
			return 1;
		}
		if ( +v1p[ i ] < +v2p[ i ] ) {
			return -1;
		}
	}
	return 0;
}

function jqueryversionsince( version ) {
	return compareversions( jquery.fn.jquery, version ) >= 0;
}

// a map from disabled patch codes to `true`. this should really
// be a `set` but those are unsupported in ie.
var disabledpatches = object.create( null );

// don't apply patches for specified codes. helpful for code bases
// where some migrate warnings have been addressed and it's desirable
// to avoid needless patches or false positives.
jquery.migratedisablepatches = function() {
	var i;
	for ( i = 0; i < arguments.length; i++ ) {
		disabledpatches[ arguments[ i ] ] = true;
	}
};

// allow enabling patches disabled via `jquery.migratedisablepatches`.
// helpful if you want to disable a patch only for some code that won't
// be updated soon to be able to focus on other warnings - and enable it
// immediately after such a call:
// ```js
// jquery.migratedisablepatches( "workarounda" );
// elem.pluginviolatingwarninga( "pluginmethod" );
// jquery.migrateenablepatches( "workarounda" );
// ```
jquery.migrateenablepatches = function() {
	var i;
	for ( i = 0; i < arguments.length; i++ ) {
		delete disabledpatches[ arguments[ i ] ];
	}
};

jquery.migrateispatchenabled = function( patchcode ) {
	return !disabledpatches[ patchcode ];
};

( function() {

	// support: ie9 only
	// ie9 only creates console object when dev tools are first opened
	// ie9 console is a host object, callable but doesn't have .apply()
	if ( !window.console || !window.console.log ) {
		return;
	}

	// need jquery 3.x-4.x and no older migrate loaded
	if ( !jquery || !jqueryversionsince( "3.0.0" ) ||
			jqueryversionsince( "5.0.0" ) ) {
		window.console.log( "jqmigrate: jquery 3.x-4.x required" );
	}
	if ( jquery.migratewarnings ) {
		window.console.log( "jqmigrate: migrate plugin loaded multiple times" );
	}

	// show a message on the console so devs know we're active
	window.console.log( "jqmigrate: migrate is installed" +
		( jquery.migratemute ? "" : " with logging active" ) +
		", version " + jquery.migrateversion );

} )();

var warnedabout = {};

// by default each warning is only reported once.
jquery.migratededuplicatewarnings = true;

// list of warnings already given; public read only
jquery.migratewarnings = [];

// set to false to disable traces that appear with warnings
if ( jquery.migratetrace === undefined ) {
	jquery.migratetrace = true;
}

// forget any warnings we've already given; public
jquery.migratereset = function() {
	warnedabout = {};
	jquery.migratewarnings.length = 0;
};

function migratewarn( code, msg ) {
	var console = window.console;
	if ( jquery.migrateispatchenabled( code ) &&
		( !jquery.migratededuplicatewarnings || !warnedabout[ msg ] ) ) {
		warnedabout[ msg ] = true;
		jquery.migratewarnings.push( msg + " [" + code + "]" );
		if ( console && console.warn && !jquery.migratemute ) {
			console.warn( "jqmigrate: " + msg );
			if ( jquery.migratetrace && console.trace ) {
				console.trace();
			}
		}
	}
}

function migratewarnprop( obj, prop, value, code, msg ) {
	object.defineproperty( obj, prop, {
		configurable: true,
		enumerable: true,
		get: function() {
			migratewarn( code, msg );
			return value;
		},
		set: function( newvalue ) {
			migratewarn( code, msg );
			value = newvalue;
		}
	} );
}

function migratewarnfuncinternal( obj, prop, newfunc, code, msg ) {
	var finalfunc,
		origfunc = obj[ prop ];

	obj[ prop ] = function() {

		// if `msg` not provided, do not warn; more sophisticated warnings
		// logic is most likely embedded in `newfunc`, in that case here
		// we just care about the logic choosing the proper implementation
		// based on whether the patch is disabled or not.
		if ( msg ) {
			migratewarn( code, msg );
		}

		// since patches can be disabled & enabled dynamically, we
		// need to decide which implementation to run on each invocation.
		finalfunc = jquery.migrateispatchenabled( code ) ?
			newfunc :

			// the function may not have existed originally so we need a fallback.
			( origfunc || jquery.noop );

		return finalfunc.apply( this, arguments );
	};
}

function migratepatchandwarnfunc( obj, prop, newfunc, code, msg ) {
	if ( !msg ) {
		throw new error( "no warning message provided" );
	}
	return migratewarnfuncinternal( obj, prop, newfunc, code, msg );
}

function migratepatchfunc( obj, prop, newfunc, code ) {
	return migratewarnfuncinternal( obj, prop, newfunc, code );
}

if ( window.document.compatmode === "backcompat" ) {

	// jquery has never supported or tested quirks mode
	migratewarn( "quirks", "jquery is not compatible with quirks mode" );
}

var findprop,
	class2type = {},
	oldinit = jquery.fn.init,
	oldfind = jquery.find,

	rattrhashtest = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/,
	rattrhashglob = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/g,

	// require that the "whitespace run" starts from a non-whitespace
	// to avoid o(n^2) behavior when the engine would try matching "\s+$" at each space position.
	rtrim = /^[\s\ufeff\xa0]+|([^\s\ufeff\xa0])[\s\ufeff\xa0]+$/g;

migratepatchfunc( jquery.fn, "init", function( arg1 ) {
	var args = array.prototype.slice.call( arguments );

	if ( jquery.migrateispatchenabled( "selector-empty-id" ) &&
		typeof arg1 === "string" && arg1 === "#" ) {

		// jquery( "#" ) is a bogus id selector, but it returned an empty set
		// before jquery 3.0
		migratewarn( "selector-empty-id", "jquery( '#' ) is not a valid selector" );
		args[ 0 ] = [];
	}

	return oldinit.apply( this, args );
}, "selector-empty-id" );

// this is already done in core but the above patch will lose this assignment
// so we need to redo it. it doesn't matter whether the patch is enabled or not
// as the method is always going to be a migrate-created wrapper.
jquery.fn.init.prototype = jquery.fn;

migratepatchfunc( jquery, "find", function( selector ) {
	var args = array.prototype.slice.call( arguments );

	// support: phantomjs 1.x
	// string#match fails to match when used with a //g regexp, only on some strings
	if ( typeof selector === "string" && rattrhashtest.test( selector ) ) {

		// the nonstandard and undocumented unquoted-hash was removed in jquery 1.12.0
		// first see if qs thinks it's a valid selector, if so avoid a false positive
		try {
			window.document.queryselector( selector );
		} catch ( err1 ) {

			// didn't *look* valid to qsa, warn and try quoting what we think is the value
			selector = selector.replace( rattrhashglob, function( _, attr, op, value ) {
				return "[" + attr + op + "\"" + value + "\"]";
			} );

			// if the regexp *may* have created an invalid selector, don't update it
			// note that there may be false alarms if selector uses jquery extensions
			try {
				window.document.queryselector( selector );
				migratewarn( "selector-hash",
					"attribute selector with '#' must be quoted: " + args[ 0 ] );
				args[ 0 ] = selector;
			} catch ( err2 ) {
				migratewarn( "selector-hash",
					"attribute selector with '#' was not fixed: " + args[ 0 ] );
			}
		}
	}

	return oldfind.apply( this, args );
}, "selector-hash" );

// copy properties attached to original jquery.find method (e.g. .attr, .isxml)
for ( findprop in oldfind ) {
	if ( object.prototype.hasownproperty.call( oldfind, findprop ) ) {
		jquery.find[ findprop ] = oldfind[ findprop ];
	}
}

// the number of elements contained in the matched element set
migratepatchandwarnfunc( jquery.fn, "size", function() {
	return this.length;
}, "size",
"jquery.fn.size() is deprecated and removed; use the .length property" );

migratepatchandwarnfunc( jquery, "parsejson", function() {
	return json.parse.apply( null, arguments );
}, "parsejson",
"jquery.parsejson is deprecated; use json.parse" );

migratepatchandwarnfunc( jquery, "holdready", jquery.holdready,
	"holdready", "jquery.holdready is deprecated" );

migratepatchandwarnfunc( jquery, "unique", jquery.uniquesort,
	"unique", "jquery.unique is deprecated; use jquery.uniquesort" );

// now jquery.expr.pseudos is the standard incantation
migratewarnprop( jquery.expr, "filters", jquery.expr.pseudos, "expr-pre-pseudos",
	"jquery.expr.filters is deprecated; use jquery.expr.pseudos" );
migratewarnprop( jquery.expr, ":", jquery.expr.pseudos, "expr-pre-pseudos",
	"jquery.expr[':'] is deprecated; use jquery.expr.pseudos" );

// prior to jquery 3.1.1 there were internal refs so we don't warn there
if ( jqueryversionsince( "3.1.1" ) ) {
	migratepatchandwarnfunc( jquery, "trim", function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "$1" );
	}, "trim",
	"jquery.trim is deprecated; use string.prototype.trim" );
}

// prior to jquery 3.2 there were internal refs so we don't warn there
if ( jqueryversionsince( "3.2.0" ) ) {
	migratepatchandwarnfunc( jquery, "nodename", function( elem, name ) {
		return elem.nodename && elem.nodename.tolowercase() === name.tolowercase();
	}, "nodename",
	"jquery.nodename is deprecated" );

	migratepatchandwarnfunc( jquery, "isarray", array.isarray, "isarray",
		"jquery.isarray is deprecated; use array.isarray"
	);
}

if ( jqueryversionsince( "3.3.0" ) ) {

	migratepatchandwarnfunc( jquery, "isnumeric", function( obj ) {

			// as of jquery 3.0, isnumeric is limited to
			// strings and numbers (primitives or objects)
			// that can be coerced to finite numbers (gh-2662)
			var type = typeof obj;
			return ( type === "number" || type === "string" ) &&

				// parsefloat nans numeric-cast false positives ("")
				// ...but misinterprets leading-number strings, e.g. hex literals ("0x...")
				// subtraction forces infinities to nan
				!isnan( obj - parsefloat( obj ) );
		}, "isnumeric",
		"jquery.isnumeric() is deprecated"
	);

	// populate the class2type map
	jquery.each( "boolean number string function array date regexp object error symbol".
		split( " " ),
	function( _, name ) {
		class2type[ "[object " + name + "]" ] = name.tolowercase();
	} );

	migratepatchandwarnfunc( jquery, "type", function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// support: android <=2.3 only (functionish regexp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ object.prototype.tostring.call( obj ) ] || "object" :
			typeof obj;
	}, "type",
	"jquery.type is deprecated" );

	migratepatchandwarnfunc( jquery, "isfunction",
		function( obj ) {
			return typeof obj === "function";
		}, "isfunction",
		"jquery.isfunction() is deprecated" );

	migratepatchandwarnfunc( jquery, "iswindow",
		function( obj ) {
			return obj != null && obj === obj.window;
		}, "iswindow",
		"jquery.iswindow() is deprecated"
	);
}

// support jquery slim which excludes the ajax module
if ( jquery.ajax ) {

var oldajax = jquery.ajax,
	rjsonp = /(=)\?(?=&|$)|\?\?/;

migratepatchfunc( jquery, "ajax", function() {
	var jqxhr = oldajax.apply( this, arguments );

	// be sure we got a jqxhr (e.g., not sync)
	if ( jqxhr.promise ) {
		migratepatchandwarnfunc( jqxhr, "success", jqxhr.done, "jqxhr-methods",
			"jqxhr.success is deprecated and removed" );
		migratepatchandwarnfunc( jqxhr, "error", jqxhr.fail, "jqxhr-methods",
			"jqxhr.error is deprecated and removed" );
		migratepatchandwarnfunc( jqxhr, "complete", jqxhr.always, "jqxhr-methods",
			"jqxhr.complete is deprecated and removed" );
	}

	return jqxhr;
}, "jqxhr-methods" );

// only trigger the logic in jquery <4 as the json-to-jsonp auto-promotion
// behavior is gone in jquery 4.0 and as it has security implications, we don't
// want to restore the legacy behavior.
if ( !jqueryversionsince( "4.0.0" ) ) {

	// register this prefilter before the jquery one. otherwise, a promoted
	// request is transformed into one with the script datatype and we can't
	// catch it anymore.
	jquery.ajaxprefilter( "+json", function( s ) {

		// warn if json-to-jsonp auto-promotion happens.
		if ( s.jsonp !== false && ( rjsonp.test( s.url ) ||
				typeof s.data === "string" &&
				( s.contenttype || "" )
					.indexof( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data )
		) ) {
			migratewarn( "jsonp-promotion", "json-to-jsonp auto-promotion is deprecated" );
		}
	} );
}

}

var oldremoveattr = jquery.fn.removeattr,
	oldtoggleclass = jquery.fn.toggleclass,
	rmatchnonspace = /\s+/g;

migratepatchfunc( jquery.fn, "removeattr", function( name ) {
	var self = this,
		patchneeded = false;

	jquery.each( name.match( rmatchnonspace ), function( _i, attr ) {
		if ( jquery.expr.match.bool.test( attr ) ) {

			// only warn if at least a single node had the property set to
			// something else than `false`. otherwise, this migrate patch
			// doesn't influence the behavior and there's no need to set or warn.
			self.each( function() {
				if ( jquery( this ).prop( attr ) !== false ) {
					patchneeded = true;
					return false;
				}
			} );
		}

		if ( patchneeded ) {
			migratewarn( "removeattr-bool",
				"jquery.fn.removeattr no longer sets boolean properties: " + attr );
			self.prop( attr, false );
		}
	} );

	return oldremoveattr.apply( this, arguments );
}, "removeattr-bool" );

migratepatchfunc( jquery.fn, "toggleclass", function( state ) {

	// only deprecating no-args or single boolean arg
	if ( state !== undefined && typeof state !== "boolean" ) {

		return oldtoggleclass.apply( this, arguments );
	}

	migratewarn( "toggleclass-bool", "jquery.fn.toggleclass( boolean ) is deprecated" );

	// toggle entire class name of each element
	return this.each( function() {
		var classname = this.getattribute && this.getattribute( "class" ) || "";

		if ( classname ) {
			jquery.data( this, "__classname__", classname );
		}

		// if the element has a class name or if we're passed `false`,
		// then remove the whole classname (if there was one, the above saved it).
		// otherwise bring back whatever was previously saved (if anything),
		// falling back to the empty string if nothing was stored.
		if ( this.setattribute ) {
			this.setattribute( "class",
				classname || state === false ?
				"" :
				jquery.data( this, "__classname__" ) || ""
			);
		}
	} );
}, "toggleclass-bool" );

function camelcase( string ) {
	return string.replace( /-([a-z])/g, function( _, letter ) {
		return letter.touppercase();
	} );
}

var origfncss, internalcssnumber,
	internalswapcall = false,
	ralphastart = /^[a-z]/,

	// the regex visualized:
	//
	//                         /----------\
	//                        |            |    /-------\
	//                        |  / top  \  |   |         |
	//         /--- border ---+-| right  |-+---+- width -+---\
	//        |                 | bottom |                    |
	//        |                  \ left /                     |
	//        |                                               |
	//        |                              /----------\     |
	//        |          /-------------\    |            |    |- end
	//        |         |               |   |  / top  \  |    |
	//        |         |  / margin  \  |   | | right  | |    |
	//        |---------+-|           |-+---+-| bottom |-+----|
	//        |            \ padding /         \ left /       |
	// begin -|                                               |
	//        |                /---------\                    |
	//        |               |           |                   |
	//        |               |  / min \  |    / width  \     |
	//         \--------------+-|       |-+---|          |---/
	//                           \ max /       \ height /
	rautopx = /^(?:border(?:top|right|bottom|left)?(?:width|)|(?:margin|padding)?(?:top|right|bottom|left)?|(?:min|max)?(?:width|height))$/;

// if this version of jquery has .swap(), don't false-alarm on internal uses
if ( jquery.swap ) {
	jquery.each( [ "height", "width", "reliablemarginright" ], function( _, name ) {
		var oldhook = jquery.csshooks[ name ] && jquery.csshooks[ name ].get;

		if ( oldhook ) {
			jquery.csshooks[ name ].get = function() {
				var ret;

				internalswapcall = true;
				ret = oldhook.apply( this, arguments );
				internalswapcall = false;
				return ret;
			};
		}
	} );
}

migratepatchfunc( jquery, "swap", function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	if ( !internalswapcall ) {
		migratewarn( "swap", "jquery.swap() is undocumented and deprecated" );
	}

	// remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
}, "swap" );

if ( jqueryversionsince( "3.4.0" ) && typeof proxy !== "undefined" ) {
	jquery.cssprops = new proxy( jquery.cssprops || {}, {
		set: function() {
			migratewarn( "cssprops", "jquery.cssprops is deprecated" );
			return reflect.set.apply( this, arguments );
		}
	} );
}

// in jquery >=4 where jquery.cssnumber is missing fill it with the latest 3.x version:
// https://github.com/jquery/jquery/blob/3.6.0/src/css.js#l212-l233
// this way, number values for the css properties below won't start triggering
// migrate warnings when jquery gets updated to >=4.0.0 (gh-438).
if ( jqueryversionsince( "4.0.0" ) ) {

	// we need to keep this as a local variable as we need it internally
	// in a `jquery.fn.css` patch and this usage shouldn't warn.
	internalcssnumber = {
		animationiterationcount: true,
		columncount: true,
		fillopacity: true,
		flexgrow: true,
		flexshrink: true,
		fontweight: true,
		gridarea: true,
		gridcolumn: true,
		gridcolumnend: true,
		gridcolumnstart: true,
		gridrow: true,
		gridrowend: true,
		gridrowstart: true,
		lineheight: true,
		opacity: true,
		order: true,
		orphans: true,
		widows: true,
		zindex: true,
		zoom: true
	};

	if ( typeof proxy !== "undefined" ) {
		jquery.cssnumber = new proxy( internalcssnumber, {
			get: function() {
				migratewarn( "css-number", "jquery.cssnumber is deprecated" );
				return reflect.get.apply( this, arguments );
			},
			set: function() {
				migratewarn( "css-number", "jquery.cssnumber is deprecated" );
				return reflect.set.apply( this, arguments );
			}
		} );
	} else {

		// support: ie 9-11+
		// ie doesn't support proxies, but we still want to restore the legacy
		// jquery.cssnumber there.
		jquery.cssnumber = internalcssnumber;
	}
} else {

	// make `internalcssnumber` defined for jquery <4 as well as it's needed
	// in the `jquery.fn.css` patch below.
	internalcssnumber = jquery.cssnumber;
}

function isautopx( prop ) {

	// the first test is used to ensure that:
	// 1. the prop starts with a lowercase letter (as we uppercase it for the second regex).
	// 2. the prop is not empty.
	return ralphastart.test( prop ) &&
		rautopx.test( prop[ 0 ].touppercase() + prop.slice( 1 ) );
}

origfncss = jquery.fn.css;

migratepatchfunc( jquery.fn, "css", function( name, value ) {
	var camelname,
		origthis = this;

	if ( name && typeof name === "object" && !array.isarray( name ) ) {
		jquery.each( name, function( n, v ) {
			jquery.fn.css.call( origthis, n, v );
		} );
		return this;
	}

	if ( typeof value === "number" ) {
		camelname = camelcase( name );

		// use `internalcssnumber` to avoid triggering our warnings in this
		// internal check.
		if ( !isautopx( camelname ) && !internalcssnumber[ camelname ] ) {
			migratewarn( "css-number",
				"number-typed values are deprecated for jquery.fn.css( \"" +
				name + "\", value )" );
		}
	}

	return origfncss.apply( this, arguments );
}, "css-number" );

var origdata = jquery.data;

migratepatchfunc( jquery, "data", function( elem, name, value ) {
	var curdata, samekeys, key;

	// name can be an object, and each entry in the object is meant to be set as data
	if ( name && typeof name === "object" && arguments.length === 2 ) {

		curdata = jquery.hasdata( elem ) && origdata.call( this, elem );
		samekeys = {};
		for ( key in name ) {
			if ( key !== camelcase( key ) ) {
				migratewarn( "data-camelcase",
					"jquery.data() always sets/gets camelcased names: " + key );
				curdata[ key ] = name[ key ];
			} else {
				samekeys[ key ] = name[ key ];
			}
		}

		origdata.call( this, elem, samekeys );

		return name;
	}

	// if the name is transformed, look for the un-transformed name in the data object
	if ( name && typeof name === "string" && name !== camelcase( name ) ) {

		curdata = jquery.hasdata( elem ) && origdata.call( this, elem );
		if ( curdata && name in curdata ) {
			migratewarn( "data-camelcase",
				"jquery.data() always sets/gets camelcased names: " + name );
			if ( arguments.length > 2 ) {
				curdata[ name ] = value;
			}
			return curdata[ name ];
		}
	}

	return origdata.apply( this, arguments );
}, "data-camelcase" );

// support jquery slim which excludes the effects module
if ( jquery.fx ) {

var intervalvalue, intervalmsg,
	oldtweenrun = jquery.tween.prototype.run,
	lineareasing = function( pct ) {
		return pct;
	};

migratepatchfunc( jquery.tween.prototype, "run", function( ) {
	if ( jquery.easing[ this.easing ].length > 1 ) {
		migratewarn(
			"easing-one-arg",
			"'jquery.easing." + this.easing.tostring() + "' should use only one argument"
		);

		jquery.easing[ this.easing ] = lineareasing;
	}

	oldtweenrun.apply( this, arguments );
}, "easing-one-arg" );

intervalvalue = jquery.fx.interval;
intervalmsg = "jquery.fx.interval is deprecated";

// support: ie9, android <=4.4
// avoid false positives on browsers that lack raf
// don't warn if document is hidden, jquery uses settimeout (#292)
if ( window.requestanimationframe ) {
	object.defineproperty( jquery.fx, "interval", {
		configurable: true,
		enumerable: true,
		get: function() {
			if ( !window.document.hidden ) {
				migratewarn( "fx-interval", intervalmsg );
			}

			// only fallback to the default if patch is enabled
			if ( !jquery.migrateispatchenabled( "fx-interval" ) ) {
				return intervalvalue;
			}
			return intervalvalue === undefined ? 13 : intervalvalue;
		},
		set: function( newvalue ) {
			migratewarn( "fx-interval", intervalmsg );
			intervalvalue = newvalue;
		}
	} );
}

}

var oldload = jquery.fn.load,
	oldeventadd = jquery.event.add,
	originalfix = jquery.event.fix;

jquery.event.props = [];
jquery.event.fixhooks = {};

migratewarnprop( jquery.event.props, "concat", jquery.event.props.concat,
	"event-old-patch",
	"jquery.event.props.concat() is deprecated and removed" );

migratepatchfunc( jquery.event, "fix", function( originalevent ) {
	var event,
		type = originalevent.type,
		fixhook = this.fixhooks[ type ],
		props = jquery.event.props;

	if ( props.length ) {
		migratewarn( "event-old-patch",
			"jquery.event.props are deprecated and removed: " + props.join() );
		while ( props.length ) {
			jquery.event.addprop( props.pop() );
		}
	}

	if ( fixhook && !fixhook._migrated_ ) {
		fixhook._migrated_ = true;
		migratewarn( "event-old-patch",
			"jquery.event.fixhooks are deprecated and removed: " + type );
		if ( ( props = fixhook.props ) && props.length ) {
			while ( props.length ) {
				jquery.event.addprop( props.pop() );
			}
		}
	}

	event = originalfix.call( this, originalevent );

	return fixhook && fixhook.filter ?
		fixhook.filter( event, originalevent ) :
		event;
}, "event-old-patch" );

migratepatchfunc( jquery.event, "add", function( elem, types ) {

	// this misses the multiple-types case but that seems awfully rare
	if ( elem === window && types === "load" && window.document.readystate === "complete" ) {
		migratewarn( "load-after-event",
			"jquery(window).on('load'...) called after load event occurred" );
	}
	return oldeventadd.apply( this, arguments );
}, "load-after-event" );

jquery.each( [ "load", "unload", "error" ], function( _, name ) {

	migratepatchfunc( jquery.fn, name, function() {
		var args = array.prototype.slice.call( arguments, 0 );

		// if this is an ajax load() the first arg should be the string url;
		// technically this could also be the "anything" arg of the event .load()
		// which just goes to show why this dumb signature has been deprecated!
		// jquery custom builds that exclude the ajax module justifiably die here.
		if ( name === "load" && typeof args[ 0 ] === "string" ) {
			return oldload.apply( this, args );
		}

		migratewarn( "shorthand-removed-v3",
			"jquery.fn." + name + "() is deprecated" );

		args.splice( 0, 0, name );
		if ( arguments.length ) {
			return this.on.apply( this, args );
		}

		// use .triggerhandler here because:
		// - load and unload events don't need to bubble, only applied to window or image
		// - error event should not bubble to window, although it does pre-1.7
		// see http://bugs.jquery.com/ticket/11820
		this.triggerhandler.apply( this, args );
		return this;
	}, "shorthand-removed-v3" );

} );

jquery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

	// handle event binding
	migratepatchandwarnfunc( jquery.fn, name, function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
		},
		"shorthand-deprecated-v3",
		"jquery.fn." + name + "() event shorthand is deprecated" );
} );

// trigger "ready" event only once, on document ready
jquery( function() {
	jquery( window.document ).triggerhandler( "ready" );
} );

jquery.event.special.ready = {
	setup: function() {
		if ( this === window.document ) {
			migratewarn( "ready-event", "'ready' event is deprecated" );
		}
	}
};

migratepatchandwarnfunc( jquery.fn, "bind", function( types, data, fn ) {
	return this.on( types, null, data, fn );
}, "pre-on-methods", "jquery.fn.bind() is deprecated" );
migratepatchandwarnfunc( jquery.fn, "unbind", function( types, fn ) {
	return this.off( types, null, fn );
}, "pre-on-methods", "jquery.fn.unbind() is deprecated" );
migratepatchandwarnfunc( jquery.fn, "delegate", function( selector, types, data, fn ) {
	return this.on( types, selector, data, fn );
}, "pre-on-methods", "jquery.fn.delegate() is deprecated" );
migratepatchandwarnfunc( jquery.fn, "undelegate", function( selector, types, fn ) {
	return arguments.length === 1 ?
		this.off( selector, "**" ) :
		this.off( types, selector || "**", fn );
}, "pre-on-methods", "jquery.fn.undelegate() is deprecated" );
migratepatchandwarnfunc( jquery.fn, "hover", function( fnover, fnout ) {
	return this.on( "mouseenter", fnover ).on( "mouseleave", fnout || fnover );
}, "pre-on-methods", "jquery.fn.hover() is deprecated" );

var rxhtmltag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
	makemarkup = function( html ) {
		var doc = window.document.implementation.createhtmldocument( "" );
		doc.body.innerhtml = html;
		return doc.body && doc.body.innerhtml;
	},
	warnifchanged = function( html ) {
		var changed = html.replace( rxhtmltag, "<$1></$2>" );
		if ( changed !== html && makemarkup( html ) !== makemarkup( changed ) ) {
			migratewarn( "self-closed-tags",
				"html tags must be properly nested and closed: " + html );
		}
	};

/**
 * deprecated, please use `jquery.migratedisablepatches( "self-closed-tags" )` instead.
 * @deprecated
 */
jquery.unsafe_restorelegacyhtmlprefilter = function() {
	jquery.migrateenablepatches( "self-closed-tags" );
};

migratepatchfunc( jquery, "htmlprefilter", function( html ) {
	warnifchanged( html );
	return html.replace( rxhtmltag, "<$1></$2>" );
}, "self-closed-tags" );

// this patch needs to be disabled by default as it re-introduces
// security issues (cve-2020-11022, cve-2020-11023).
jquery.migratedisablepatches( "self-closed-tags" );

var origoffset = jquery.fn.offset;

migratepatchfunc( jquery.fn, "offset", function() {
	var elem = this[ 0 ];

	if ( elem && ( !elem.nodetype || !elem.getboundingclientrect ) ) {
		migratewarn( "offset-valid-elem", "jquery.fn.offset() requires a valid dom element" );
		return arguments.length ? this : undefined;
	}

	return origoffset.apply( this, arguments );
}, "offset-valid-elem" );

// support jquery slim which excludes the ajax module
// the jquery.param patch is about respecting `jquery.ajaxsettings.traditional`
// so it doesn't make sense for the slim build.
if ( jquery.ajax ) {

var origparam = jquery.param;

migratepatchfunc( jquery, "param", function( data, traditional ) {
	var ajaxtraditional = jquery.ajaxsettings && jquery.ajaxsettings.traditional;

	if ( traditional === undefined && ajaxtraditional ) {

		migratewarn( "param-ajax-traditional",
			"jquery.param() no longer uses jquery.ajaxsettings.traditional" );
		traditional = ajaxtraditional;
	}

	return origparam.call( this, data, traditional );
}, "param-ajax-traditional" );

}

migratepatchandwarnfunc( jquery.fn, "andself", jquery.fn.addback, "andself",
	"jquery.fn.andself() is deprecated and removed, use jquery.fn.addback()" );

// support jquery slim which excludes the deferred module in jquery 4.0+
if ( jquery.deferred ) {

var olddeferred = jquery.deferred,
	tuples = [

		// action, add listener, callbacks, .then handlers, final state
		[ "resolve", "done", jquery.callbacks( "once memory" ),
			jquery.callbacks( "once memory" ), "resolved" ],
		[ "reject", "fail", jquery.callbacks( "once memory" ),
			jquery.callbacks( "once memory" ), "rejected" ],
		[ "notify", "progress", jquery.callbacks( "memory" ),
			jquery.callbacks( "memory" ) ]
	];

migratepatchfunc( jquery, "deferred", function( func ) {
	var deferred = olddeferred(),
		promise = deferred.promise();

	function newdeferredpipe( /* fndone, fnfail, fnprogress */ ) {
		var fns = arguments;

		return jquery.deferred( function( newdefer ) {
			jquery.each( tuples, function( i, tuple ) {
				var fn = typeof fns[ i ] === "function" && fns[ i ];

				// deferred.done(function() { bind to newdefer or newdefer.resolve })
				// deferred.fail(function() { bind to newdefer or newdefer.reject })
				// deferred.progress(function() { bind to newdefer or newdefer.notify })
				deferred[ tuple[ 1 ] ]( function() {
					var returned = fn && fn.apply( this, arguments );
					if ( returned && typeof returned.promise === "function" ) {
						returned.promise()
							.done( newdefer.resolve )
							.fail( newdefer.reject )
							.progress( newdefer.notify );
					} else {
						newdefer[ tuple[ 0 ] + "with" ](
							this === promise ? newdefer.promise() : this,
							fn ? [ returned ] : arguments
						);
					}
				} );
			} );
			fns = null;
		} ).promise();
	}

	migratepatchandwarnfunc( deferred, "pipe", newdeferredpipe, "deferred-pipe",
		"deferred.pipe() is deprecated" );
	migratepatchandwarnfunc( promise, "pipe", newdeferredpipe, "deferred-pipe",
		"deferred.pipe() is deprecated" );

	if ( func ) {
		func.call( deferred, deferred );
	}

	return deferred;
}, "deferred-pipe" );

// preserve handler of uncaught exceptions in promise chains
jquery.deferred.exceptionhook = olddeferred.exceptionhook;

}

return jquery;
} );




