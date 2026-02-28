/*!
 * jquery javascript library v3.7.1
 * https://jquery.com/
 *
 * copyright openjs foundation and other contributors
 * released under the mit license
 * https://jquery.org/license
 *
 * date: 2023-08-28t13:37z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// for commonjs and commonjs-like environments where a proper `window`
		// is present, execute the factory and get jquery.
		// for environments that do not have a `window` with a `document`
		// (such as node.js), expose a factory as module.exports.
		// this accentuates the need for the creation of a real `window`.
		// e.g. var jquery = require("jquery")(window);
		// see ticket trac-14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new error( "jquery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noglobal ) {

// edge <= 12 - 13+, firefox <=18 - 45+, ie 10 - 11, safari 5.1 - 9+, ios 6 - 9.1
// throw exceptions when non-strict code (e.g., asp.net 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). but as of jquery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getproto = object.getprototypeof;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexof = arr.indexof;

var class2type = {};

var tostring = class2type.tostring;

var hasown = class2type.hasownproperty;

var fntostring = hasown.tostring;

var objectfunctionstring = fntostring.call( object );

var support = {};

var isfunction = function isfunction( obj ) {

		// support: chrome <=57, firefox <=52
		// in some browsers, typeof returns "function" for html <object> elements
		// (i.e., `typeof document.createelement( "object" ) === "function"`).
		// we don't want to classify *any* dom node as a function.
		// support: qtweb <=3.8.5, webkit <=534.34, wkhtmltopdf tool <=0.12.5
		// plus for old webkit, typeof returns "function" for html collections
		// (e.g., `typeof document.getelementsbytagname("div") === "function"`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodetype !== "number" &&
			typeof obj.item !== "function";
	};


var iswindow = function iswindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedscriptattributes = {
		type: true,
		src: true,
		nonce: true,
		nomodule: true
	};

	function domeval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createelement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedscriptattributes ) {

				// support: firefox 64+, edge 18+
				// some browsers don't support the "nonce" property on scripts.
				// on the other hand, just using `getattribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// see https://github.com/whatwg/html/issues/2369
				// see https://html.spec.whatwg.org/#nonce-attributes
				// the `node.getattribute` check was added for the sake of
				// `jquery.globaleval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getattribute && node.getattribute( i );
				if ( val ) {
					script.setattribute( i, val );
				}
			}
		}
		doc.head.appendchild( script ).parentnode.removechild( script );
	}


function totype( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// support: android <=2.3 only (functionish regexp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ tostring.call( obj ) ] || "object" :
		typeof obj;
}
/* global symbol */
// defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var version = "3.7.1",

	rhtmlsuffix = /html$/i,

	// define a local copy of jquery
	jquery = function( selector, context ) {

		// the jquery object is actually just the init constructor 'enhanced'
		// need init if jquery is called (just allow error to be thrown if not included)
		return new jquery.fn.init( selector, context );
	};

jquery.fn = jquery.prototype = {

	// the current version of jquery being used
	jquery: version,

	constructor: jquery,

	// the default length of a jquery object is 0
	length: 0,

	toarray: function() {
		return slice.call( this );
	},

	// get the nth element in the matched element set or
	// get the whole matched element set as a clean array
	get: function( num ) {

		// return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushstack: function( elems ) {

		// build a new jquery matched element set
		var ret = jquery.merge( this.constructor(), elems );

		// add the old object onto the stack (as a reference)
		ret.prevobject = this;

		// return the newly-formed element set
		return ret;
	},

	// execute a callback for every element in the matched set.
	each: function( callback ) {
		return jquery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushstack( jquery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushstack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushstack( jquery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushstack( jquery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushstack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevobject || this.constructor();
	},

	// for internal use only.
	// behaves like an array's method, not like a jquery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jquery.extend = jquery.fn.extend = function() {
	var options, name, src, copy, copyisarray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isfunction( target ) ) {
		target = {};
	}

	// extend jquery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// prevent object.prototype pollution
				// prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jquery.isplainobject( copy ) ||
					( copyisarray = array.isarray( copy ) ) ) ) {
					src = target[ name ];

					// ensure proper type for the source value
					if ( copyisarray && !array.isarray( src ) ) {
						clone = [];
					} else if ( !copyisarray && !jquery.isplainobject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyisarray = false;

					// never move original objects, clone them
					target[ name ] = jquery.extend( deep, clone, copy );

				// don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// return the modified object
	return target;
};

jquery.extend( {

	// unique for each copy of jquery on the page
	expando: "jquery" + ( version + math.random() ).replace( /\d/g, "" ),

	// assume jquery is ready without the ready module
	isready: true,

	error: function( msg ) {
		throw new error( msg );
	},

	noop: function() {},

	isplainobject: function( obj ) {
		var proto, ctor;

		// detect obvious negatives
		// use tostring instead of jquery.type to catch host objects
		if ( !obj || tostring.call( obj ) !== "[object object]" ) {
			return false;
		}

		proto = getproto( obj );

		// objects with no prototype (e.g., `object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// objects with prototype are plain iff they were constructed by a global object function
		ctor = hasown.call( proto, "constructor" ) && proto.constructor;
		return typeof ctor === "function" && fntostring.call( ctor ) === objectfunctionstring;
	},

	isemptyobject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globaleval: function( code, options, doc ) {
		domeval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isarraylike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},


	// retrieve the text value of an array of dom nodes
	text: function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodetype = elem.nodetype;

		if ( !nodetype ) {

			// if no nodetype, this is expected to be an array
			while ( ( node = elem[ i++ ] ) ) {

				// do not traverse comment nodes
				ret += jquery.text( node );
			}
		}
		if ( nodetype === 1 || nodetype === 11 ) {
			return elem.textcontent;
		}
		if ( nodetype === 9 ) {
			return elem.documentelement.textcontent;
		}
		if ( nodetype === 3 || nodetype === 4 ) {
			return elem.nodevalue;
		}

		// do not include comment or processing instruction nodes

		return ret;
	},

	// results is for internal usage only
	makearray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isarraylike( object( arr ) ) ) {
				jquery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inarray: function( elem, arr, i ) {
		return arr == null ? -1 : indexof.call( arr, elem, i );
	},

	isxmldoc: function( elem ) {
		var namespace = elem && elem.namespaceuri,
			docelem = elem && ( elem.ownerdocument || elem ).documentelement;

		// assume html when documentelement doesn't yet exist, such as inside
		// document fragments.
		return !rhtmlsuffix.test( namespace || docelem && docelem.nodename || "html" );
	},

	// support: android <=4.0 only, phantomjs 1 only
	// push.apply(_, arraylike) throws on ancient webkit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackinverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackexpect = !invert;

		// go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackinverse = !callback( elems[ i ], i );
			if ( callbackinverse !== callbackexpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// go through the array, translating each of the items to their new values
		if ( isarraylike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// flatten any nested arrays
		return flat( ret );
	},

	// a global guid counter for objects
	guid: 1,

	// jquery.support is not used in core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof symbol === "function" ) {
	jquery.fn[ symbol.iterator ] = arr[ symbol.iterator ];
}

// populate the class2type map
jquery.each( "boolean number string function array date regexp object error symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.tolowercase();
	} );

function isarraylike( obj ) {

	// support: real ios 8.2 only (not reproducible in simulator)
	// `in` check used to prevent jit error (gh-2145)
	// hasown isn't used here due to false negatives
	// regarding nodelist length in ie
	var length = !!obj && "length" in obj && obj.length,
		type = totype( obj );

	if ( isfunction( obj ) || iswindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}


function nodename( elem, name ) {

	return elem.nodename && elem.nodename.tolowercase() === name.tolowercase();

}
var pop = arr.pop;


var sort = arr.sort;


var splice = arr.splice;


var whitespace = "[\\x20\\t\\r\\n\\f]";


var rtrimcss = new regexp(
	"^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
	"g"
);




// note: an element does not contain itself
jquery.contains = function( a, b ) {
	var bup = b && b.parentnode;

	return a === bup || !!( bup && bup.nodetype === 1 && (

		// support: ie 9 - 11+
		// ie doesn't have `contains` on svg.
		a.contains ?
			a.contains( bup ) :
			a.comparedocumentposition && a.comparedocumentposition( bup ) & 16
	) );
};




// css string/identifier serialization
// https://drafts.csswg.org/cssom/#common-serializing-idioms
var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uffff\w-]/g;

function fcssescape( ch, ascodepoint ) {
	if ( ascodepoint ) {

		// u+0000 null becomes u+fffd replacement character
		if ( ch === "\0" ) {
			return "\ufffd";
		}

		// control characters and (dependent upon position) numbers get escaped as code points
		return ch.slice( 0, -1 ) + "\\" + ch.charcodeat( ch.length - 1 ).tostring( 16 ) + " ";
	}

	// other potentially-special ascii characters get backslash-escaped
	return "\\" + ch;
}

jquery.escapeselector = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};




var preferreddoc = document,
	pushnative = push;

( function() {

var i,
	expr,
	outermostcontext,
	sortinput,
	hasduplicate,
	push = pushnative,

	// local document vars
	document,
	documentelement,
	documentishtml,
	rbuggyqsa,
	matches,

	// instance-specific data
	expando = jquery.expando,
	dirruns = 0,
	done = 0,
	classcache = createcache(),
	tokencache = createcache(),
	compilercache = createcache(),
	nonnativeselectorcache = createcache(),
	sortorder = function( a, b ) {
		if ( a === b ) {
			hasduplicate = true;
		}
		return 0;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|" +
		"loop|multiple|open|readonly|required|scoped",

	// regular expressions

	// https://www.w3.org/tr/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fa-f]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// attribute selectors: https://www.w3.org/tr/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "attribute values must be css identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// to reduce the number of selectors needing tokenize in the prefilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new regexp( whitespace + "+", "g" ),

	rcomma = new regexp( "^" + whitespace + "*," + whitespace + "*" ),
	rleadingcombinator = new regexp( "^" + whitespace + "*([>+~]|" + whitespace + ")" +
		whitespace + "*" ),
	rdescend = new regexp( whitespace + "|>" ),

	rpseudo = new regexp( pseudos ),
	ridentifier = new regexp( "^" + identifier + "$" ),

	matchexpr = {
		id: new regexp( "^#(" + identifier + ")" ),
		class: new regexp( "^\\.(" + identifier + ")" ),
		tag: new regexp( "^(" + identifier + "|[*])" ),
		attr: new regexp( "^" + attributes ),
		pseudo: new regexp( "^" + pseudos ),
		child: new regexp(
			"^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
				whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
				whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		bool: new regexp( "^(?:" + booleans + ")$", "i" ),

		// for use in libraries implementing .is()
		// we use this for pos matching in `select`
		needscontext: new regexp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	// easily-parseable/retrievable id or tag or class selectors
	rquickexpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// css escapes
	// https://www.w3.org/tr/css21/syndata.html#escaped-characters
	runescape = new regexp( "\\\\[\\da-fa-f]{1,6}" + whitespace +
		"?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonhex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		if ( nonhex ) {

			// strip the backslash prefix from a non-hex escape sequence
			return nonhex;
		}

		// replace a hexadecimal escape sequence with the encoded unicode code point
		// support: ie <=11+
		// for values outside the basic multilingual plane (bmp), manually construct a
		// surrogate pair
		return high < 0 ?
			string.fromcharcode( high + 0x10000 ) :
			string.fromcharcode( high >> 10 | 0xd800, high & 0x3ff | 0xdc00 );
	},

	// used for iframes; see `setdocument`.
	// support: ie 9 - 11+, edge 12 - 18+
	// removing the function wrapper causes a "permission denied"
	// error in ie/edge.
	unloadhandler = function() {
		setdocument();
	},

	indisabledfieldset = addcombinator(
		function( elem ) {
			return elem.disabled === true && nodename( elem, "fieldset" );
		},
		{ dir: "parentnode", next: "legend" }
	);

// support: ie <=9 only
// accessing document.activeelement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeactiveelement() {
	try {
		return document.activeelement;
	} catch ( err ) { }
}

// optimize for push.apply( _, nodelist )
try {
	push.apply(
		( arr = slice.call( preferreddoc.childnodes ) ),
		preferreddoc.childnodes
	);

	// support: android <=4.0
	// detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferreddoc.childnodes.length ].nodetype;
} catch ( e ) {
	push = {
		apply: function( target, els ) {
			pushnative.apply( target, slice.call( els ) );
		},
		call: function( target ) {
			pushnative.apply( target, slice.call( arguments, 1 ) );
		}
	};
}

function find( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newselector,
		newcontext = context && context.ownerdocument,

		// nodetype defaults to 9, since context defaults to document
		nodetype = context ? context.nodetype : 9;

	results = results || [];

	// return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodetype !== 1 && nodetype !== 9 && nodetype !== 11 ) {

		return results;
	}

	// try to shortcut find operations (as opposed to filters) in html documents
	if ( !seed ) {
		setdocument( context );
		context = context || document;

		if ( documentishtml ) {

			// if the selector is sufficiently simple, try using a "get*by*" dom method
			// (excepting documentfragment context, where the methods don't exist)
			if ( nodetype !== 11 && ( match = rquickexpr.exec( selector ) ) ) {

				// id selector
				if ( ( m = match[ 1 ] ) ) {

					// document context
					if ( nodetype === 9 ) {
						if ( ( elem = context.getelementbyid( m ) ) ) {

							// support: ie 9 only
							// getelementbyid can match elements by name instead of id
							if ( elem.id === m ) {
								push.call( results, elem );
								return results;
							}
						} else {
							return results;
						}

					// element context
					} else {

						// support: ie 9 only
						// getelementbyid can match elements by name instead of id
						if ( newcontext && ( elem = newcontext.getelementbyid( m ) ) &&
							find.contains( context, elem ) &&
							elem.id === m ) {

							push.call( results, elem );
							return results;
						}
					}

				// type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getelementsbytagname( selector ) );
					return results;

				// class selector
				} else if ( ( m = match[ 3 ] ) && context.getelementsbyclassname ) {
					push.apply( results, context.getelementsbyclassname( m ) );
					return results;
				}
			}

			// take advantage of queryselectorall
			if ( !nonnativeselectorcache[ selector + " " ] &&
				( !rbuggyqsa || !rbuggyqsa.test( selector ) ) ) {

				newselector = selector;
				newcontext = context;

				// qsa considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// in such cases, we work around the behavior by prefixing every selector in the
				// list with an id selector referencing the scope context.
				// the technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by queryselectorall.
				// thanks to andrew dupont for this technique.
				if ( nodetype === 1 &&
					( rdescend.test( selector ) || rleadingcombinator.test( selector ) ) ) {

					// expand context for sibling selectors
					newcontext = rsibling.test( selector ) && testcontext( context.parentnode ) ||
						context;

					// we can use :scope instead of the id hack if the browser
					// supports it & if we're not changing the context.
					// support: ie 11+, edge 17 - 18+
					// ie/edge sometimes throw a "permission denied" error when
					// strict-comparing two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( newcontext != context || !support.scope ) {

						// capture the context id, setting it first if necessary
						if ( ( nid = context.getattribute( "id" ) ) ) {
							nid = jquery.escapeselector( nid );
						} else {
							context.setattribute( "id", ( nid = expando ) );
						}
					}

					// prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toselector( groups[ i ] );
					}
					newselector = groups.join( "," );
				}

				try {
					push.apply( results,
						newcontext.queryselectorall( newselector )
					);
					return results;
				} catch ( qsaerror ) {
					nonnativeselectorcache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeattribute( "id" );
					}
				}
			}
		}
	}

	// all others
	return select( selector.replace( rtrimcss, "$1" ), context, results, seed );
}

/**
 * create key-value caches of limited size
 * @returns {function(string, object)} returns the object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than expr.cachelength)
 *	deleting the oldest entry
 */
function createcache() {
	var keys = [];

	function cache( key, value ) {

		// use (key + " ") to avoid collision with native prototype properties
		// (see https://github.com/jquery/sizzle/issues/157)
		if ( keys.push( key + " " ) > expr.cachelength ) {

			// only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * mark a function for special use by jquery selector module
 * @param {function} fn the function to mark
 */
function markfunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * support testing using an element
 * @param {function} fn passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createelement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// remove from its parent by default
		if ( el.parentnode ) {
			el.parentnode.removechild( el );
		}

		// release memory in ie
		el = null;
	}
}

/**
 * returns a function to use in pseudos for input types
 * @param {string} type
 */
function createinputpseudo( type ) {
	return function( elem ) {
		return nodename( elem, "input" ) && elem.type === type;
	};
}

/**
 * returns a function to use in pseudos for buttons
 * @param {string} type
 */
function createbuttonpseudo( type ) {
	return function( elem ) {
		return ( nodename( elem, "input" ) || nodename( elem, "button" ) ) &&
			elem.type === type;
	};
}

/**
 * returns a function to use in pseudos for :enabled/:disabled
 * @param {boolean} disabled true for :disabled; false for :enabled
 */
function createdisabledpseudo( disabled ) {

	// known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// all such elements have a "form" property.
			if ( elem.parentnode && elem.disabled === false ) {

				// option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentnode ) {
						return elem.parentnode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// support: ie 6 - 11+
				// use the isdisabled shortcut property to check for disabled fieldset ancestors
				return elem.isdisabled === disabled ||

					// where there is no isdisabled, check manually
					elem.isdisabled !== !disabled &&
						indisabledfieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// try to winnow out elements that can't be disabled before trusting the disabled property.
		// some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * returns a function to use in pseudos for positionals
 * @param {function} fn
 */
function createpositionalpseudo( fn ) {
	return markfunction( function( argument ) {
		argument = +argument;
		return markfunction( function( seed, matches ) {
			var j,
				matchindexes = fn( [], seed.length, argument ),
				i = matchindexes.length;

			// match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchindexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * checks a node for validity as a jquery selector context
 * @param {element|object=} context
 * @returns {element|object|boolean} the input node if acceptable, otherwise a falsy value
 */
function testcontext( context ) {
	return context && typeof context.getelementsbytagname !== "undefined" && context;
}

/**
 * sets document-related variables once based on the current document
 * @param {element|object} [node] an element or document object to use to set the document
 * @returns {object} returns the current document
 */
function setdocument( node ) {
	var subwindow,
		doc = node ? node.ownerdocument || node : preferreddoc;

	// return early if doc is invalid or already selected
	// support: ie 11+, edge 17 - 18+
	// ie/edge sometimes throw a "permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodetype !== 9 || !doc.documentelement ) {
		return document;
	}

	// update global variables
	document = doc;
	documentelement = document.documentelement;
	documentishtml = !jquery.isxmldoc( document );

	// support: ios 7 only, ie 9 - 11+
	// older browsers didn't support unprefixed `matches`.
	matches = documentelement.matches ||
		documentelement.webkitmatchesselector ||
		documentelement.msmatchesselector;

	// support: ie 9 - 11+, edge 12 - 18+
	// accessing iframe documents after unload throws "permission denied" errors
	// (see trac-13936).
	// limit the fix to ie & edge legacy; despite edge 15+ implementing `matches`,
	// all ie 9+ and edge legacy versions implement `msmatchesselector` as well.
	if ( documentelement.msmatchesselector &&

		// support: ie 11+, edge 17 - 18+
		// ie/edge sometimes throw a "permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		preferreddoc != document &&
		( subwindow = document.defaultview ) && subwindow.top !== subwindow ) {

		// support: ie 9 - 11+, edge 12 - 18+
		subwindow.addeventlistener( "unload", unloadhandler );
	}

	// support: ie <10
	// check if getelementbyid returns elements by name
	// the broken getelementbyid methods don't pick up programmatically-set names,
	// so use a roundabout getelementsbyname test
	support.getbyid = assert( function( el ) {
		documentelement.appendchild( el ).id = jquery.expando;
		return !document.getelementsbyname ||
			!document.getelementsbyname( jquery.expando ).length;
	} );

	// support: ie 9 only
	// check to see if it's possible to do matchesselector
	// on a disconnected node.
	support.disconnectedmatch = assert( function( el ) {
		return matches.call( el, "*" );
	} );

	// support: ie 9 - 11+, edge 12 - 18+
	// ie/edge don't support the :scope pseudo-class.
	support.scope = assert( function() {
		return document.queryselectorall( ":scope" );
	} );

	// support: chrome 105 - 111 only, safari 15.4 - 16.3 only
	// make sure the `:has()` argument is parsed unforgivingly.
	// we include `*` in the test to detect buggy implementations that are
	// _selectively_ forgiving (specifically when the list includes at least
	// one valid selector).
	// note that we treat complete lack of support for `:has()` as if it were
	// spec-compliant support, which is fine because use of `:has()` in such
	// environments will fail in the qsa path and fall back to jquery traversal
	// anyway.
	support.csshas = assert( function() {
		try {
			document.queryselector( ":has(*,:jqfake)" );
			return false;
		} catch ( e ) {
			return true;
		}
	} );

	// id filter and find
	if ( support.getbyid ) {
		expr.filter.id = function( id ) {
			var attrid = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getattribute( "id" ) === attrid;
			};
		};
		expr.find.id = function( id, context ) {
			if ( typeof context.getelementbyid !== "undefined" && documentishtml ) {
				var elem = context.getelementbyid( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		expr.filter.id =  function( id ) {
			var attrid = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getattributenode !== "undefined" &&
					elem.getattributenode( "id" );
				return node && node.value === attrid;
			};
		};

		// support: ie 6 - 7 only
		// getelementbyid is not reliable as a find shortcut
		expr.find.id = function( id, context ) {
			if ( typeof context.getelementbyid !== "undefined" && documentishtml ) {
				var node, i, elems,
					elem = context.getelementbyid( id );

				if ( elem ) {

					// verify the id attribute
					node = elem.getattributenode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// fall back on getelementsbyname
					elems = context.getelementsbyname( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getattributenode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// tag
	expr.find.tag = function( tag, context ) {
		if ( typeof context.getelementsbytagname !== "undefined" ) {
			return context.getelementsbytagname( tag );

		// documentfragment nodes don't have gebtn
		} else {
			return context.queryselectorall( tag );
		}
	};

	// class
	expr.find.class = function( classname, context ) {
		if ( typeof context.getelementsbyclassname !== "undefined" && documentishtml ) {
			return context.getelementsbyclassname( classname );
		}
	};

	/* qsa/matchesselector
	---------------------------------------------------------------------- */

	// qsa and matchesselector support

	rbuggyqsa = [];

	// build qsa regex
	// regex strategy adopted from diego perini
	assert( function( el ) {

		var input;

		documentelement.appendchild( el ).innerhtml =
			"<a id='" + expando + "' href='' disabled='disabled'></a>" +
			"<select id='" + expando + "-\r\\' disabled='disabled'>" +
			"<option selected=''></option></select>";

		// support: ios <=7 - 8 only
		// boolean attributes and "value" are not treated correctly in some xml documents
		if ( !el.queryselectorall( "[selected]" ).length ) {
			rbuggyqsa.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
		}

		// support: ios <=7 - 8 only
		if ( !el.queryselectorall( "[id~=" + expando + "-]" ).length ) {
			rbuggyqsa.push( "~=" );
		}

		// support: ios 8 only
		// https://bugs.webkit.org/show_bug.cgi?id=136851
		// in-page `selector#id sibling-combinator selector` fails
		if ( !el.queryselectorall( "a#" + expando + "+*" ).length ) {
			rbuggyqsa.push( ".#.+[+~]" );
		}

		// support: chrome <=105+, firefox <=104+, safari <=15.4+
		// in some of the document kinds, these selectors wouldn't work natively.
		// this is probably ok but for backwards compatibility we want to maintain
		// handling them through jquery traversal in jquery 3.x.
		if ( !el.queryselectorall( ":checked" ).length ) {
			rbuggyqsa.push( ":checked" );
		}

		// support: windows 8 native apps
		// the type and name attributes are restricted during .innerhtml assignment
		input = document.createelement( "input" );
		input.setattribute( "type", "hidden" );
		el.appendchild( input ).setattribute( "name", "d" );

		// support: ie 9 - 11+
		// ie's :disabled selector does not pick up the children of disabled fieldsets
		// support: chrome <=105+, firefox <=104+, safari <=15.4+
		// in some of the document kinds, these selectors wouldn't work natively.
		// this is probably ok but for backwards compatibility we want to maintain
		// handling them through jquery traversal in jquery 3.x.
		documentelement.appendchild( el ).disabled = true;
		if ( el.queryselectorall( ":disabled" ).length !== 2 ) {
			rbuggyqsa.push( ":enabled", ":disabled" );
		}

		// support: ie 11+, edge 15 - 18+
		// ie 11/edge don't find elements on a `[name='']` query in some cases.
		// adding a temporary attribute to the document before the selection works
		// around the issue.
		// interestingly, ie 10 & older don't seem to have the issue.
		input = document.createelement( "input" );
		input.setattribute( "name", "" );
		el.appendchild( input );
		if ( !el.queryselectorall( "[name='']" ).length ) {
			rbuggyqsa.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
				whitespace + "*(?:''|\"\")" );
		}
	} );

	if ( !support.csshas ) {

		// support: chrome 105 - 110+, safari 15.4 - 16.3+
		// our regular `try-catch` mechanism fails to detect natively-unsupported
		// pseudo-classes inside `:has()` (such as `:has(:contains("foo"))`)
		// in browsers that parse the `:has()` argument as a forgiving selector list.
		// https://drafts.csswg.org/selectors/#relational now requires the argument
		// to be parsed unforgivingly, but browsers have not yet fully adjusted.
		rbuggyqsa.push( ":has" );
	}

	rbuggyqsa = rbuggyqsa.length && new regexp( rbuggyqsa.join( "|" ) );

	/* sorting
	---------------------------------------------------------------------- */

	// document order sorting
	sortorder = function( a, b ) {

		// flag for duplicate removal
		if ( a === b ) {
			hasduplicate = true;
			return 0;
		}

		// sort on method existence if only one input has comparedocumentposition
		var compare = !a.comparedocumentposition - !b.comparedocumentposition;
		if ( compare ) {
			return compare;
		}

		// calculate position if both inputs belong to the same document
		// support: ie 11+, edge 17 - 18+
		// ie/edge sometimes throw a "permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerdocument || a ) == ( b.ownerdocument || b ) ?
			a.comparedocumentposition( b ) :

			// otherwise we know they are disconnected
			1;

		// disconnected nodes
		if ( compare & 1 ||
			( !support.sortdetached && b.comparedocumentposition( a ) === compare ) ) {

			// choose the first element that is related to our preferred document
			// support: ie 11+, edge 17 - 18+
			// ie/edge sometimes throw a "permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a === document || a.ownerdocument == preferreddoc &&
				find.contains( preferreddoc, a ) ) {
				return -1;
			}

			// support: ie 11+, edge 17 - 18+
			// ie/edge sometimes throw a "permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b === document || b.ownerdocument == preferreddoc &&
				find.contains( preferreddoc, b ) ) {
				return 1;
			}

			// maintain original order
			return sortinput ?
				( indexof.call( sortinput, a ) - indexof.call( sortinput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	};

	return document;
}

find.matches = function( expr, elements ) {
	return find( expr, null, null, elements );
};

find.matchesselector = function( elem, expr ) {
	setdocument( elem );

	if ( documentishtml &&
		!nonnativeselectorcache[ expr + " " ] &&
		( !rbuggyqsa || !rbuggyqsa.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// ie 9's matchesselector returns false on disconnected nodes
			if ( ret || support.disconnectedmatch ||

					// as well, disconnected nodes are said to be in a document
					// fragment in ie 9
					elem.document && elem.document.nodetype !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeselectorcache( expr, true );
		}
	}

	return find( expr, document, null, [ elem ] ).length > 0;
};

find.contains = function( context, elem ) {

	// set document vars if needed
	// support: ie 11+, edge 17 - 18+
	// ie/edge sometimes throw a "permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerdocument || context ) != document ) {
		setdocument( context );
	}
	return jquery.contains( context, elem );
};


find.attr = function( elem, name ) {

	// set document vars if needed
	// support: ie 11+, edge 17 - 18+
	// ie/edge sometimes throw a "permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerdocument || elem ) != document ) {
		setdocument( elem );
	}

	var fn = expr.attrhandle[ name.tolowercase() ],

		// don't get fooled by object.prototype properties (see trac-13807)
		val = fn && hasown.call( expr.attrhandle, name.tolowercase() ) ?
			fn( elem, name, !documentishtml ) :
			undefined;

	if ( val !== undefined ) {
		return val;
	}

	return elem.getattribute( name );
};

find.error = function( msg ) {
	throw new error( "syntax error, unrecognized expression: " + msg );
};

/**
 * document sorting and removing duplicates
 * @param {arraylike} results
 */
jquery.uniquesort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// unless we *know* we can detect duplicates, assume their presence
	//
	// support: android <=4.0+
	// testing for detecting duplicates is unpredictable so instead assume we can't
	// depend on duplicate detection in all browsers without a stable sort.
	hasduplicate = !support.sortstable;
	sortinput = !support.sortstable && slice.call( results, 0 );
	sort.call( results, sortorder );

	if ( hasduplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			splice.call( results, duplicates[ j ], 1 );
		}
	}

	// clear input after sorting to release objects
	// see https://github.com/jquery/sizzle/pull/225
	sortinput = null;

	return results;
};

jquery.fn.uniquesort = function() {
	return this.pushstack( jquery.uniquesort( slice.apply( this ) ) );
};

expr = jquery.expr = {

	// can be adjusted by the user
	cachelength: 50,

	createpseudo: markfunction,

	match: matchexpr,

	attrhandle: {},

	find: {},

	relative: {
		">": { dir: "parentnode", first: true },
		" ": { dir: "parentnode" },
		"+": { dir: "previoussibling", first: true },
		"~": { dir: "previoussibling" }
	},

	prefilter: {
		attr: function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] || match[ 5 ] || "" )
				.replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		child: function( match ) {

			/* matches from matchexpr["child"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].tolowercase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					find.error( match[ 0 ] );
				}

				// numeric x and y parameters for expr.filter.child
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" )
				);
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

			// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				find.error( match[ 0 ] );
			}

			return match;
		},

		pseudo: function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchexpr.child.test( match[ 0 ] ) ) {
				return null;
			}

			// accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexof( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		tag: function( nodenameselector ) {
			var expectednodename = nodenameselector.replace( runescape, funescape ).tolowercase();
			return nodenameselector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return nodename( elem, expectednodename );
				};
		},

		class: function( classname ) {
			var pattern = classcache[ classname + " " ];

			return pattern ||
				( pattern = new regexp( "(^|" + whitespace + ")" + classname +
					"(" + whitespace + "|$)" ) ) &&
				classcache( classname, function( elem ) {
					return pattern.test(
						typeof elem.classname === "string" && elem.classname ||
							typeof elem.getattribute !== "undefined" &&
								elem.getattribute( "class" ) ||
							""
					);
				} );
		},

		attr: function( name, operator, check ) {
			return function( elem ) {
				var result = find.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				if ( operator === "=" ) {
					return result === check;
				}
				if ( operator === "!=" ) {
					return result !== check;
				}
				if ( operator === "^=" ) {
					return check && result.indexof( check ) === 0;
				}
				if ( operator === "*=" ) {
					return check && result.indexof( check ) > -1;
				}
				if ( operator === "$=" ) {
					return check && result.slice( -check.length ) === check;
				}
				if ( operator === "~=" ) {
					return ( " " + result.replace( rwhitespace, " " ) + " " )
						.indexof( check ) > -1;
				}
				if ( operator === "|=" ) {
					return result === check || result.slice( 0, check.length + 1 ) === check + "-";
				}

				return false;
			};
		},

		child: function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				oftype = what === "of-type";

			return first === 1 && last === 0 ?

				// shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentnode;
				} :

				function( elem, _context, xml ) {
					var cache, outercache, node, nodeindex, start,
						dir = simple !== forward ? "nextsibling" : "previoussibling",
						parent = elem.parentnode,
						name = oftype && elem.nodename.tolowercase(),
						usecache = !xml && !oftype,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( oftype ?
										nodename( node, name ) :
										node.nodetype === 1 ) {

										return false;
									}
								}

								// reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextsibling";
							}
							return true;
						}

						start = [ forward ? parent.firstchild : parent.lastchild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && usecache ) {

							// seek `elem` from a previously-cached index
							outercache = parent[ expando ] || ( parent[ expando ] = {} );
							cache = outercache[ type ] || [];
							nodeindex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeindex && cache[ 2 ];
							node = nodeindex && parent.childnodes[ nodeindex ];

							while ( ( node = ++nodeindex && node && node[ dir ] ||

								// fallback to seeking `elem` from the start
								( diff = nodeindex = 0 ) || start.pop() ) ) {

								// when found, cache indexes on `parent` and break
								if ( node.nodetype === 1 && ++diff && node === elem ) {
									outercache[ type ] = [ dirruns, nodeindex, diff ];
									break;
								}
							}

						} else {

							// use previously-cached element index if available
							if ( usecache ) {
								outercache = elem[ expando ] || ( elem[ expando ] = {} );
								cache = outercache[ type ] || [];
								nodeindex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeindex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeindex && node && node[ dir ] ||
									( diff = nodeindex = 0 ) || start.pop() ) ) {

									if ( ( oftype ?
										nodename( node, name ) :
										node.nodetype === 1 ) &&
										++diff ) {

										// cache the index of each encountered element
										if ( usecache ) {
											outercache = node[ expando ] ||
												( node[ expando ] = {} );
											outercache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		pseudo: function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// https://www.w3.org/tr/selectors/#pseudo-classes
			// prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// remember that setfilters inherits from pseudos
			var args,
				fn = expr.pseudos[ pseudo ] || expr.setfilters[ pseudo.tolowercase() ] ||
					find.error( "unsupported pseudo: " + pseudo );

			// the user may use createpseudo to indicate that
			// arguments are needed to create the filter function
			// just as jquery does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// but maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return expr.setfilters.hasownproperty( pseudo.tolowercase() ) ?
					markfunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexof.call( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// potentially complex pseudos
		not: markfunction( function( selector ) {

			// trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrimcss, "$1" ) );

			return matcher[ expando ] ?
				markfunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// don't keep the element
					// (see https://github.com/jquery/sizzle/issues/299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		has: markfunction( function( selector ) {
			return function( elem ) {
				return find( selector, elem ).length > 0;
			};
		} ),

		contains: markfunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textcontent || jquery.text( elem ) ).indexof( text ) > -1;
			};
		} ),

		// "whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier c,
		// or beginning with the identifier c immediately followed by "-".
		// the matching of c against the element's language value is performed case-insensitively.
		// the identifier c does not have to be a valid language name."
		// https://www.w3.org/tr/selectors/#lang-pseudo
		lang: markfunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				find.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).tolowercase();
			return function( elem ) {
				var elemlang;
				do {
					if ( ( elemlang = documentishtml ?
						elem.lang :
						elem.getattribute( "xml:lang" ) || elem.getattribute( "lang" ) ) ) {

						elemlang = elemlang.tolowercase();
						return elemlang === lang || elemlang.indexof( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentnode ) && elem.nodetype === 1 );
				return false;
			};
		} ),

		// miscellaneous
		target: function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		root: function( elem ) {
			return elem === documentelement;
		},

		focus: function( elem ) {
			return elem === safeactiveelement() &&
				document.hasfocus() &&
				!!( elem.type || elem.href || ~elem.tabindex );
		},

		// boolean properties
		enabled: createdisabledpseudo( false ),
		disabled: createdisabledpseudo( true ),

		checked: function( elem ) {

			// in css3, :checked should return both checked and selected elements
			// https://www.w3.org/tr/2011/rec-css3-selectors-20110929/#checked
			return ( nodename( elem, "input" ) && !!elem.checked ) ||
				( nodename( elem, "option" ) && !!elem.selected );
		},

		selected: function( elem ) {

			// support: ie <=11+
			// accessing the selectedindex property
			// forces the browser to treat the default option as
			// selected when in an optgroup.
			if ( elem.parentnode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentnode.selectedindex;
			}

			return elem.selected === true;
		},

		// contents
		empty: function( elem ) {

			// https://www.w3.org/tr/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodetype < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstchild; elem; elem = elem.nextsibling ) {
				if ( elem.nodetype < 6 ) {
					return false;
				}
			}
			return true;
		},

		parent: function( elem ) {
			return !expr.pseudos.empty( elem );
		},

		// element/input types
		header: function( elem ) {
			return rheader.test( elem.nodename );
		},

		input: function( elem ) {
			return rinputs.test( elem.nodename );
		},

		button: function( elem ) {
			return nodename( elem, "input" ) && elem.type === "button" ||
				nodename( elem, "button" );
		},

		text: function( elem ) {
			var attr;
			return nodename( elem, "input" ) && elem.type === "text" &&

				// support: ie <10 only
				// new html5 attribute values (e.g., "search") appear
				// with elem.type === "text"
				( ( attr = elem.getattribute( "type" ) ) == null ||
					attr.tolowercase() === "text" );
		},

		// position-in-collection
		first: createpositionalpseudo( function() {
			return [ 0 ];
		} ),

		last: createpositionalpseudo( function( _matchindexes, length ) {
			return [ length - 1 ];
		} ),

		eq: createpositionalpseudo( function( _matchindexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		even: createpositionalpseudo( function( matchindexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchindexes.push( i );
			}
			return matchindexes;
		} ),

		odd: createpositionalpseudo( function( matchindexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchindexes.push( i );
			}
			return matchindexes;
		} ),

		lt: createpositionalpseudo( function( matchindexes, length, argument ) {
			var i;

			if ( argument < 0 ) {
				i = argument + length;
			} else if ( argument > length ) {
				i = length;
			} else {
				i = argument;
			}

			for ( ; --i >= 0; ) {
				matchindexes.push( i );
			}
			return matchindexes;
		} ),

		gt: createpositionalpseudo( function( matchindexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchindexes.push( i );
			}
			return matchindexes;
		} )
	}
};

expr.pseudos.nth = expr.pseudos.eq;

// add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	expr.pseudos[ i ] = createinputpseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	expr.pseudos[ i ] = createbuttonpseudo( i );
}

// easy api for creating new setfilters
function setfilters() {}
setfilters.prototype = expr.filters = expr.pseudos;
expr.setfilters = new setfilters();

function tokenize( selector, parseonly ) {
	var matched, match, tokens, type,
		sofar, groups, prefilters,
		cached = tokencache[ selector + " " ];

	if ( cached ) {
		return parseonly ? 0 : cached.slice( 0 );
	}

	sofar = selector;
	groups = [];
	prefilters = expr.prefilter;

	while ( sofar ) {

		// comma and first run
		if ( !matched || ( match = rcomma.exec( sofar ) ) ) {
			if ( match ) {

				// don't consume trailing commas as valid
				sofar = sofar.slice( match[ 0 ].length ) || sofar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// combinators
		if ( ( match = rleadingcombinator.exec( sofar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// cast descendant combinators to space
				type: match[ 0 ].replace( rtrimcss, " " )
			} );
			sofar = sofar.slice( matched.length );
		}

		// filters
		for ( type in expr.filter ) {
			if ( ( match = matchexpr[ type ].exec( sofar ) ) && ( !prefilters[ type ] ||
				( match = prefilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				sofar = sofar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// return the length of the invalid excess
	// if we're just parsing
	// otherwise, throw an error or return tokens
	if ( parseonly ) {
		return sofar.length;
	}

	return sofar ?
		find.error( selector ) :

		// cache the tokens
		tokencache( selector, groups ).slice( 0 );
}

function toselector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addcombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checknonelements = base && key === "parentnode",
		donename = done++;

	return combinator.first ?

		// check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodetype === 1 || checknonelements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldcache, outercache,
				newcache = [ dirruns, donename ];

			// we can't set arbitrary data on xml nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodetype === 1 || checknonelements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodetype === 1 || checknonelements ) {
						outercache = elem[ expando ] || ( elem[ expando ] = {} );

						if ( skip && nodename( elem, skip ) ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldcache = outercache[ key ] ) &&
							oldcache[ 0 ] === dirruns && oldcache[ 1 ] === donename ) {

							// assign to newcache so results back-propagate to previous elements
							return ( newcache[ 2 ] = oldcache[ 2 ] );
						} else {

							// reuse newcache so results back-propagate to previous elements
							outercache[ key ] = newcache;

							// a match means we're done; a fail means we have to keep checking
							if ( ( newcache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementmatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multiplecontexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		find( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newunmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newunmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newunmatched;
}

function setmatcher( prefilter, selector, matcher, postfilter, postfinder, postselector ) {
	if ( postfilter && !postfilter[ expando ] ) {
		postfilter = setmatcher( postfilter );
	}
	if ( postfinder && !postfinder[ expando ] ) {
		postfinder = setmatcher( postfinder, postselector );
	}
	return markfunction( function( seed, results, context, xml ) {
		var temp, i, elem, matcherout,
			premap = [],
			postmap = [],
			preexisting = results.length,

			// get initial elements from seed or context
			elems = seed ||
				multiplecontexts( selector || "*",
					context.nodetype ? [ context ] : context, [] ),

			// prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherin = prefilter && ( seed || !selector ) ?
				condense( elems, premap, prefilter, context, xml ) :
				elems;

		if ( matcher ) {

			// if we have a postfinder, or filtered seed, or non-seed postfilter
			// or preexisting results,
			matcherout = postfinder || ( seed ? prefilter : preexisting || postfilter ) ?

				// ...intermediate processing is necessary
				[] :

				// ...otherwise use results directly
				results;

			// find primary matches
			matcher( matcherin, matcherout, context, xml );
		} else {
			matcherout = matcherin;
		}

		// apply postfilter
		if ( postfilter ) {
			temp = condense( matcherout, postmap );
			postfilter( temp, [], context, xml );

			// un-match failing elements by moving them back to matcherin
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherout[ postmap[ i ] ] = !( matcherin[ postmap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postfinder || prefilter ) {
				if ( postfinder ) {

					// get the final matcherout by condensing this intermediate into postfinder contexts
					temp = [];
					i = matcherout.length;
					while ( i-- ) {
						if ( ( elem = matcherout[ i ] ) ) {

							// restore matcherin since elem is not yet a final match
							temp.push( ( matcherin[ i ] = elem ) );
						}
					}
					postfinder( null, ( matcherout = [] ), temp, xml );
				}

				// move matched elements from seed to results to keep them synchronized
				i = matcherout.length;
				while ( i-- ) {
					if ( ( elem = matcherout[ i ] ) &&
						( temp = postfinder ? indexof.call( seed, elem ) : premap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// add elements to results, through postfinder if defined
		} else {
			matcherout = condense(
				matcherout === results ?
					matcherout.splice( preexisting, matcherout.length ) :
					matcherout
			);
			if ( postfinder ) {
				postfinder( null, results, matcherout, xml );
			} else {
				push.apply( results, matcherout );
			}
		}
	} );
}

function matcherfromtokens( tokens ) {
	var checkcontext, matcher, j,
		len = tokens.length,
		leadingrelative = expr.relative[ tokens[ 0 ].type ],
		implicitrelative = leadingrelative || expr.relative[ " " ],
		i = leadingrelative ? 1 : 0,

		// the foundational matcher ensures that elements are reachable from top-level context(s)
		matchcontext = addcombinator( function( elem ) {
			return elem === checkcontext;
		}, implicitrelative, true ),
		matchanycontext = addcombinator( function( elem ) {
			return indexof.call( checkcontext, elem ) > -1;
		}, implicitrelative, true ),
		matchers = [ function( elem, context, xml ) {

			// support: ie 11+, edge 17 - 18+
			// ie/edge sometimes throw a "permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			var ret = ( !leadingrelative && ( xml || context != outermostcontext ) ) || (
				( checkcontext = context ).nodetype ?
					matchcontext( elem, context, xml ) :
					matchanycontext( elem, context, xml ) );

			// avoid hanging onto element
			// (see https://github.com/jquery/sizzle/issues/299)
			checkcontext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addcombinator( elementmatcher( matchers ), matcher ) ];
		} else {
			matcher = expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setmatcher(
					i > 1 && elementmatcher( matchers ),
					i > 1 && toselector(

						// if the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 )
							.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrimcss, "$1" ),
					matcher,
					i < j && matcherfromtokens( tokens.slice( i, j ) ),
					j < len && matcherfromtokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toselector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementmatcher( matchers );
}

function matcherfromgroupmatchers( elementmatchers, setmatchers ) {
	var byset = setmatchers.length > 0,
		byelement = elementmatchers.length > 0,
		supermatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedcount = 0,
				i = "0",
				unmatched = seed && [],
				setmatched = [],
				contextbackup = outermostcontext,

				// we must always have either seed elements or outermost context
				elems = seed || byelement && expr.find.tag( "*", outermost ),

				// use integer dirruns iff this is the outermost matcher
				dirrunsunique = ( dirruns += contextbackup == null ? 1 : math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// support: ie 11+, edge 17 - 18+
				// ie/edge sometimes throw a "permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostcontext = context == document || context || outermost;
			}

			// add elements passing elementmatchers directly to results
			// support: ios <=7 - 9 only
			// tolerate nodelist properties (ie: "length"; safari: <number>) matching
			// elements by id. (see trac-14142)
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byelement && elem ) {
					j = 0;

					// support: ie 11+, edge 17 - 18+
					// ie/edge sometimes throw a "permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerdocument != document ) {
						setdocument( elem );
						xml = !documentishtml;
					}
					while ( ( matcher = elementmatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							push.call( results, elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsunique;
					}
				}

				// track unmatched elements for set filters
				if ( byset ) {

					// they will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedcount--;
					}

					// lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedcount`
			// makes the latter nonnegative.
			matchedcount += i;

			// apply set filters to unmatched elements
			// note: this can be skipped if there are no unmatched elements (i.e., `matchedcount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedcount` that differs from `i` but is also
			// numerically zero.
			if ( byset && i !== matchedcount ) {
				j = 0;
				while ( ( matcher = setmatchers[ j++ ] ) ) {
					matcher( unmatched, setmatched, context, xml );
				}

				if ( seed ) {

					// reintegrate element matches to eliminate the need for sorting
					if ( matchedcount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setmatched[ i ] ) ) {
								setmatched[ i ] = pop.call( results );
							}
						}
					}

					// discard index placeholder values to get only actual matches
					setmatched = condense( setmatched );
				}

				// add matches to results
				push.apply( results, setmatched );

				// seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setmatched.length > 0 &&
					( matchedcount + setmatchers.length ) > 1 ) {

					jquery.uniquesort( results );
				}
			}

			// override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsunique;
				outermostcontext = contextbackup;
			}

			return unmatched;
		};

	return byset ?
		markfunction( supermatcher ) :
		supermatcher;
}

function compile( selector, match /* internal use only */ ) {
	var i,
		setmatchers = [],
		elementmatchers = [],
		cached = compilercache[ selector + " " ];

	if ( !cached ) {

		// generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherfromtokens( match[ i ] );
			if ( cached[ expando ] ) {
				setmatchers.push( cached );
			} else {
				elementmatchers.push( cached );
			}
		}

		// cache the compiled function
		cached = compilercache( selector,
			matcherfromgroupmatchers( elementmatchers, setmatchers ) );

		// save selector and tokenization
		cached.selector = selector;
	}
	return cached;
}

/**
 * a low-level selection function that works with jquery's compiled
 *  selector functions
 * @param {string|function} selector a selector or a pre-compiled
 *  selector function built with jquery selector compile
 * @param {element} context
 * @param {array} [results]
 * @param {array} [seed] a set of elements to match against
 */
function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// reduce context if the leading compound selector is an id
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "id" &&
				context.nodetype === 9 && documentishtml && expr.relative[ tokens[ 1 ].type ] ) {

			context = ( expr.find.id(
				token.matches[ 0 ].replace( runescape, funescape ),
				context
			) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentnode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// fetch a seed set for right-to-left matching
		i = matchexpr.needscontext.test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// abort if we hit a combinator
			if ( expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = expr.find[ type ] ) ) {

				// search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) &&
						testcontext( context.parentnode ) || context
				) ) ) {

					// if seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toselector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// compile and execute a filtering function if one is not provided
	// provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentishtml,
		results,
		!context || rsibling.test( selector ) && testcontext( context.parentnode ) || context
	);
	return results;
}

// one-time assignments

// support: android <=4.0 - 4.1+
// sort stability
support.sortstable = expando.split( "" ).sort( sortorder ).join( "" ) === expando;

// initialize against the default document
setdocument();

// support: android <=4.0 - 4.1+
// detached nodes confoundingly follow *each other*
support.sortdetached = assert( function( el ) {

	// should return 1, but returns 4 (following)
	return el.comparedocumentposition( document.createelement( "fieldset" ) ) & 1;
} );

jquery.find = find;

// deprecated
jquery.expr[ ":" ] = jquery.expr.pseudos;
jquery.unique = jquery.uniquesort;

// these have always been private, but they used to be documented as part of
// sizzle so let's maintain them for now for backwards compatibility purposes.
find.compile = compile;
find.select = select;
find.setdocument = setdocument;
find.tokenize = tokenize;

find.escape = jquery.escapeselector;
find.gettext = jquery.text;
find.isxml = jquery.isxmldoc;
find.selectors = jquery.expr;
find.support = jquery.support;
find.uniquesort = jquery.uniquesort;

	/* eslint-enable */

} )();


var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodetype !== 9 ) {
		if ( elem.nodetype === 1 ) {
			if ( truncate && jquery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextsibling ) {
		if ( n.nodetype === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedscontext = jquery.expr.match.needscontext;

var rsingletag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isfunction( qualifier ) ) {
		return jquery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// single element
	if ( qualifier.nodetype ) {
		return jquery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// arraylike of elements (jquery, arguments, array)
	if ( typeof qualifier !== "string" ) {
		return jquery.grep( elements, function( elem ) {
			return ( indexof.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// filtered directly for both simple and complex selectors
	return jquery.filter( qualifier, elements, not );
}

jquery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodetype === 1 ) {
		return jquery.find.matchesselector( elem, expr ) ? [ elem ] : [];
	}

	return jquery.find.matches( expr, jquery.grep( elems, function( elem ) {
		return elem.nodetype === 1;
	} ) );
};

jquery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushstack( jquery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jquery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushstack( [] );

		for ( i = 0; i < len; i++ ) {
			jquery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jquery.uniquesort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushstack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushstack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// if this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedscontext.test( selector ) ?
				jquery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// initialize a jquery object


// a central reference to the root jquery(document)
var rootjquery,

	// a simple way to check for html strings
	// prioritize #id over <tag> to avoid xss via location.hash (trac-9521)
	// strict html recognition (trac-11290: must start with <)
	// shortcut simple #id case for speed
	rquickexpr = /^(?:\s*(<[\w\w]+>)[^>]*|#([\w-]+))$/,

	init = jquery.fn.init = function( selector, context, root ) {
		var match, elem;

		// handle: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// method init() accepts an alternate rootjquery
		// so migrate can support jquery.sub (gh-2101)
		root = root || rootjquery;

		// handle html strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// assume that strings that start and end with <> are html and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickexpr.exec( selector );
			}

			// match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// handle: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jquery ? context[ 0 ] : context;

					// option to run scripts is true for back-compat
					// intentionally let the error be thrown if parsehtml is not present
					jquery.merge( this, jquery.parsehtml(
						match[ 1 ],
						context && context.nodetype ? context.ownerdocument || context : document,
						true
					) );

					// handle: $(html, props)
					if ( rsingletag.test( match[ 1 ] ) && jquery.isplainobject( context ) ) {
						for ( match in context ) {

							// properties of context are called as methods if possible
							if ( isfunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// handle: $(#id)
				} else {
					elem = document.getelementbyid( match[ 2 ] );

					if ( elem ) {

						// inject the element directly into the jquery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// handle: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// handle: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// handle: $(domelement)
		} else if ( selector.nodetype ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// handle: $(function)
		// shortcut for document ready
		} else if ( isfunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// execute immediately if ready is not present
				selector( jquery );
		}

		return jquery.makearray( selector, this );
	};

// give the init function the jquery prototype for later instantiation
init.prototype = jquery.fn;

// initialize central reference
rootjquery = jquery( document );


var rparentsprev = /^(?:parents|prev(?:until|all))/,

	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedunique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jquery.fn.extend( {
	has: function( target ) {
		var targets = jquery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jquery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jquery( selectors );

		// positional selectors never match, since there's no _selection_ context
		if ( !rneedscontext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentnode ) {

					// always skip document fragments
					if ( cur.nodetype < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// don't pass non-elements to jquery#find
						cur.nodetype === 1 &&
							jquery.find.matchesselector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushstack( matched.length > 1 ? jquery.uniquesort( matched ) : matched );
	},

	// determine the position of an element within the set
	index: function( elem ) {

		// no argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentnode ) ? this.first().prevall().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return indexof.call( jquery( elem ), this[ 0 ] );
		}

		// locate the position of the desired element
		return indexof.call( this,

			// if it receives a jquery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushstack(
			jquery.uniquesort(
				jquery.merge( this.get(), jquery( selector, context ) )
			)
		);
	},

	addback: function( selector ) {
		return this.add( selector == null ?
			this.prevobject : this.prevobject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodetype !== 1 ) {}
	return cur;
}

jquery.each( {
	parent: function( elem ) {
		var parent = elem.parentnode;
		return parent && parent.nodetype !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentnode" );
	},
	parentsuntil: function( elem, _i, until ) {
		return dir( elem, "parentnode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextsibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previoussibling" );
	},
	nextall: function( elem ) {
		return dir( elem, "nextsibling" );
	},
	prevall: function( elem ) {
		return dir( elem, "previoussibling" );
	},
	nextuntil: function( elem, _i, until ) {
		return dir( elem, "nextsibling", until );
	},
	prevuntil: function( elem, _i, until ) {
		return dir( elem, "previoussibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentnode || {} ).firstchild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstchild );
	},
	contents: function( elem ) {
		if ( elem.contentdocument != null &&

			// support: ie 11+
			// <object> elements with no `data` attribute has an object
			// `contentdocument` with a `null` prototype.
			getproto( elem.contentdocument ) ) {

			return elem.contentdocument;
		}

		// support: ie 9 - 11 only, ios 7 only, android browser <=4.3 only
		// treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodename( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jquery.merge( [], elem.childnodes );
	}
}, function( name, fn ) {
	jquery.fn[ name ] = function( until, selector ) {
		var matched = jquery.map( this, fn, until );

		if ( name.slice( -5 ) !== "until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jquery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// remove duplicates
			if ( !guaranteedunique[ name ] ) {
				jquery.uniquesort( matched );
			}

			// reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushstack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// convert string-formatted options into object-formatted ones
function createoptions( options ) {
	var object = {};
	jquery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * by default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stoponfalse:	interrupt callings when a callback returns false
 *
 */
jquery.callbacks = function( options ) {

	// convert options from string-formatted to object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createoptions( options ) :
		jquery.extend( {}, options );

	var // flag to know if list is currently firing
		firing,

		// last fire value for non-forgettable lists
		memory,

		// flag to know if list was already fired
		fired,

		// flag to prevent firing
		locked,

		// actual callback list
		list = [],

		// queue of execution data for repeatable lists
		queue = [],

		// index of currently firing callback (modified by add/remove as needed)
		firingindex = -1,

		// fire callbacks
		fire = function() {

			// enforce single-firing
			locked = locked || options.once;

			// execute callbacks for all pending executions,
			// respecting firingindex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingindex = -1 ) {
				memory = queue.shift();
				while ( ++firingindex < list.length ) {

					// run callback and check for early termination
					if ( list[ firingindex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stoponfalse ) {

						// jump to end and forget the data so .add doesn't re-fire
						firingindex = list.length;
						memory = false;
					}
				}
			}

			// forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// clean up if we're done firing for good
			if ( locked ) {

				// keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// actual callbacks object
		self = {

			// add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// if we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingindex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jquery.each( args, function( _, arg ) {
							if ( isfunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && totype( arg ) !== "string" ) {

								// inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// remove a callback from the list
			remove: function() {
				jquery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jquery.inarray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// handle firing indexes
						if ( index <= firingindex ) {
							firingindex--;
						}
					}
				} );
				return this;
			},

			// check if a given callback is in the list.
			// if no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jquery.inarray( fn, list ) > -1 :
					list.length > 0;
			},

			// remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// disable .fire and .add
			// abort any current/pending executions
			// clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// disable .fire
			// also disable .add unless we have memory (since it would have no effect)
			// abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// call all callbacks with the given context and arguments
			firewith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// call all the callbacks with the given arguments
			fire: function() {
				self.firewith( this, arguments );
				return this;
			},

			// to know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function identity( v ) {
	return v;
}
function thrower( ex ) {
	throw ex;
}

function adoptvalue( value, resolve, reject, novalue ) {
	var method;

	try {

		// check for promise aspect first to privilege synchronous behavior
		if ( value && isfunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// other thenables
		} else if ( value && isfunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// other non-thenables
		} else {

			// control `resolve` arguments by letting array#slice cast boolean `novalue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( novalue ) );
		}

	// for promises/a+, convert exceptions into rejections
	// since jquery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// support: android 4.0 only
		// strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jquery.extend( {

	deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jquery.callbacks( "memory" ),
					jquery.callbacks( "memory" ), 2 ],
				[ "resolve", "done", jquery.callbacks( "once memory" ),
					jquery.callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jquery.callbacks( "once memory" ),
					jquery.callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// keep pipe for back-compat
				pipe: function( /* fndone, fnfail, fnprogress */ ) {
					var fns = arguments;

					return jquery.deferred( function( newdefer ) {
						jquery.each( tuples, function( _i, tuple ) {

							// map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isfunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newdefer or newdefer.notify })
							// deferred.done(function() { bind to newdefer or newdefer.resolve })
							// deferred.fail(function() { bind to newdefer or newdefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isfunction( returned.promise ) ) {
									returned.promise()
										.progress( newdefer.notify )
										.done( newdefer.resolve )
										.fail( newdefer.reject );
								} else {
									newdefer[ tuple[ 0 ] + "with" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onfulfilled, onrejected, onprogress ) {
					var maxdepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightthrow = function() {
									var returned, then;

									// support: promises/a+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// ignore double-resolution attempts
									if ( depth < maxdepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// support: promises/a+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new typeerror( "thenable self-resolution" );
									}

									// support: promises/a+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// retrieve `then` only once
									then = returned &&

										// support: promises/a+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// handle a returned thenable
									if ( isfunction( then ) ) {

										// special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxdepth, deferred, identity, special ),
												resolve( maxdepth, deferred, thrower, special )
											);

										// normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxdepth++;

											then.call(
												returned,
												resolve( maxdepth, deferred, identity, special ),
												resolve( maxdepth, deferred, thrower, special ),
												resolve( maxdepth, deferred, identity,
													deferred.notifywith )
											);
										}

									// handle all other returned values
									} else {

										// only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== identity ) {
											that = undefined;
											args = [ returned ];
										}

										// process the value(s)
										// default process is resolve
										( special || deferred.resolvewith )( that, args );
									}
								},

								// only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightthrow :
									function() {
										try {
											mightthrow();
										} catch ( e ) {

											if ( jquery.deferred.exceptionhook ) {
												jquery.deferred.exceptionhook( e,
													process.error );
											}

											// support: promises/a+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// ignore post-resolution exceptions
											if ( depth + 1 >= maxdepth ) {

												// only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectwith( that, args );
											}
										}
									};

							// support: promises/a+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// call an optional hook to record the error, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jquery.deferred.geterrorhook ) {
									process.error = jquery.deferred.geterrorhook();

								// the deprecated alias of the above. while the name suggests
								// returning the stack, not an error instance, jquery just passes
								// it directly to `console.warn` so both will work; an instance
								// just better cooperates with source maps.
								} else if ( jquery.deferred.getstackhook ) {
									process.error = jquery.deferred.getstackhook();
								}
								window.settimeout( process );
							}
						};
					}

					return jquery.deferred( function( newdefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newdefer,
								isfunction( onprogress ) ?
									onprogress :
									identity,
								newdefer.notifywith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newdefer,
								isfunction( onfulfilled ) ?
									onfulfilled :
									identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newdefer,
								isfunction( onrejected ) ?
									onrejected :
									thrower
							)
						);
					} ).promise();
				},

				// get a promise for this deferred
				// if obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jquery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// add list-specific methods
		jquery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				statestring = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// handle state
			if ( statestring ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = statestring;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifywith(...) }
			// deferred.resolve = function() { deferred.resolvewith(...) }
			// deferred.reject = function() { deferred.rejectwith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "with" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifywith = list.firewith
			// deferred.resolvewith = list.firewith
			// deferred.rejectwith = list.firewith
			deferred[ tuple[ 0 ] + "with" ] = list.firewith;
		} );

		// make the deferred a promise
		promise.promise( deferred );

		// call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// all done!
		return deferred;
	},

	// deferred helper
	when: function( singlevalue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolvecontexts = array( i ),
			resolvevalues = slice.call( arguments ),

			// the primary deferred
			primary = jquery.deferred(),

			// subordinate callback factory
			updatefunc = function( i ) {
				return function( value ) {
					resolvecontexts[ i ] = this;
					resolvevalues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolvewith( resolvecontexts, resolvevalues );
					}
				};
			};

		// single- and empty arguments are adopted like promise.resolve
		if ( remaining <= 1 ) {
			adoptvalue( singlevalue, primary.done( updatefunc( i ) ).resolve, primary.reject,
				!remaining );

			// use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isfunction( resolvevalues[ i ] && resolvevalues[ i ].then ) ) {

				return primary.then();
			}
		}

		// multiple arguments are aggregated like promise.all array elements
		while ( i-- ) {
			adoptvalue( resolvevalues[ i ], updatefunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// these usually indicate a programmer mistake during development,
// warn about them asap rather than swallowing them by default.
var rerrornames = /^(eval|internal|range|reference|syntax|type|uri)error$/;

// if `jquery.deferred.geterrorhook` is defined, `asyncerror` is an error
// captured before the async barrier to get the original error cause
// which may otherwise be hidden.
jquery.deferred.exceptionhook = function( error, asyncerror ) {

	// support: ie 8 - 9 only
	// console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrornames.test( error.name ) ) {
		window.console.warn( "jquery.deferred exception: " + error.message,
			error.stack, asyncerror );
	}
};




jquery.readyexception = function( error ) {
	window.settimeout( function() {
		throw error;
	} );
};




// the deferred used on dom ready
var readylist = jquery.deferred();

jquery.fn.ready = function( fn ) {

	readylist
		.then( fn )

		// wrap jquery.readyexception in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jquery.readyexception( error );
		} );

	return this;
};

jquery.extend( {

	// is the dom ready to be used? set to true once it occurs.
	isready: false,

	// a counter to track how many items to wait for before
	// the ready event fires. see trac-6781
	readywait: 1,

	// handle when the dom is ready
	ready: function( wait ) {

		// abort if there are pending holds or we're already ready
		if ( wait === true ? --jquery.readywait : jquery.isready ) {
			return;
		}

		// remember that the dom is ready
		jquery.isready = true;

		// if a normal dom ready event fired, decrement, and wait if need be
		if ( wait !== true && --jquery.readywait > 0 ) {
			return;
		}

		// if there are functions bound, to execute
		readylist.resolvewith( document, [ jquery ] );
	}
} );

jquery.ready.then = readylist.then;

// the ready event handler and self cleanup method
function completed() {
	document.removeeventlistener( "domcontentloaded", completed );
	window.removeeventlistener( "load", completed );
	jquery.ready();
}

// catch cases where $(document).ready() is called
// after the browser event has already occurred.
// support: ie <=9 - 10 only
// older ie sometimes signals "interactive" too soon
if ( document.readystate === "complete" ||
	( document.readystate !== "loading" && !document.documentelement.doscroll ) ) {

	// handle it asynchronously to allow scripts the opportunity to delay ready
	window.settimeout( jquery.ready );

} else {

	// use the handy event callback
	document.addeventlistener( "domcontentloaded", completed );

	// a fallback to window.onload, that will always work
	window.addeventlistener( "load", completed );
}




// multifunctional method to get and set values of a collection
// the value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyget, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// sets many values
	if ( totype( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyget, raw );
		}

	// sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isfunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jquery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyget;
};


// matches dashed string for camelizing
var rmsprefix = /^-ms-/,
	rdashalpha = /-([a-z])/g;

// used by camelcase as callback to replace()
function fcamelcase( _all, letter ) {
	return letter.touppercase();
}

// convert dashed to camelcase; used by the css and data modules
// support: ie <=9 - 11, edge 12 - 15
// microsoft forgot to hump their vendor prefix (trac-9572)
function camelcase( string ) {
	return string.replace( rmsprefix, "ms-" ).replace( rdashalpha, fcamelcase );
}
var acceptdata = function( owner ) {

	// accepts only:
	//  - node
	//    - node.element_node
	//    - node.document_node
	//  - object
	//    - any
	return owner.nodetype === 1 || owner.nodetype === 9 || !( +owner.nodetype );
};




function data() {
	this.expando = jquery.expando + data.uid++;
}

data.uid = 1;

data.prototype = {

	cache: function( owner ) {

		// check if the owner object already has a cache
		var value = owner[ this.expando ];

		// if not, create one
		if ( !value ) {
			value = {};

			// we can accept data for non-element nodes in modern browsers,
			// but we should not, see trac-8335.
			// always return an empty object.
			if ( acceptdata( owner ) ) {

				// if it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodetype ) {
					owner[ this.expando ] = value;

				// otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					object.defineproperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// handle: [ owner, key, value ] args
		// always use camelcase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelcase( data ) ] = value;

		// handle: [ owner, { properties } ] args
		} else {

			// copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelcase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// always use camelcase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelcase( key ) ];
	},
	access: function( owner, key, value ) {

		// in cases where either:
		//
		//   1. no key was specified
		//   2. a string key was specified, but no value provided
		//
		// take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. the entire cache object
		//   2. the data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// when the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. an object of properties
		//   2. a key and value
		//
		this.set( owner, key, value );

		// since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// support array or space separated string of keys
			if ( array.isarray( key ) ) {

				// if key is an array of keys...
				// we always set camelcase keys, so remove that.
				key = key.map( camelcase );
			} else {
				key = camelcase( key );

				// if a key with the spaces exists, use it.
				// otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// remove the expando if there's no more data
		if ( key === undefined || jquery.isemptyobject( cache ) ) {

			// support: chrome <=35 - 45
			// webkit & blink performance suffers when deleting properties
			// from dom nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodetype ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasdata: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jquery.isemptyobject( cache );
	}
};
var datapriv = new data();

var datauser = new data();



//	implementation summary
//
//	1. enforce api surface and semantic compatibility with 1.9.x branch
//	2. improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. use the same single mechanism to support "private" and "user" data.
//	4. _never_ expose "private" data to user code (todo: drop _data, _removedata)
//	5. avoid exposing implementation details on user objects (eg. expando properties)
//	6. provide a clear path for implementation upgrade to weakmap in 2014

var rbrace = /^(?:\{[\w\w]*\}|\[[\w\w]*\])$/,
	rmultidash = /[a-z]/g;

function getdata( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return json.parse( data );
	}

	return data;
}

function dataattr( elem, key, data ) {
	var name;

	// if nothing was found internally, try to fetch any
	// data from the html5 data-* attribute
	if ( data === undefined && elem.nodetype === 1 ) {
		name = "data-" + key.replace( rmultidash, "-$&" ).tolowercase();
		data = elem.getattribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getdata( data );
			} catch ( e ) {}

			// make sure we set the data so it isn't changed later
			datauser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jquery.extend( {
	hasdata: function( elem ) {
		return datauser.hasdata( elem ) || datapriv.hasdata( elem );
	},

	data: function( elem, name, data ) {
		return datauser.access( elem, name, data );
	},

	removedata: function( elem, name ) {
		datauser.remove( elem, name );
	},

	// todo: now that all calls to _data and _removedata have been replaced
	// with direct calls to datapriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return datapriv.access( elem, name, data );
	},

	_removedata: function( elem, name ) {
		datapriv.remove( elem, name );
	}
} );

jquery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = datauser.get( elem );

				if ( elem.nodetype === 1 && !datapriv.get( elem, "hasdataattrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// support: ie 11 only
						// the attrs elements can be null (trac-14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexof( "data-" ) === 0 ) {
								name = camelcase( name.slice( 5 ) );
								dataattr( elem, name, data[ name ] );
							}
						}
					}
					datapriv.set( elem, "hasdataattrs", true );
				}
			}

			return data;
		}

		// sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				datauser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// the calling jquery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. an empty jquery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// attempt to get data from the cache
				// the key will always be camelcased in data
				data = datauser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// attempt to "discover" the data in
				// html5 custom data-* attrs
				data = dataattr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// we tried really hard, but the data doesn't exist.
				return;
			}

			// set the data...
			this.each( function() {

				// we always store the camelcased key
				datauser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removedata: function( key ) {
		return this.each( function() {
			datauser.remove( this, key );
		} );
	}
} );


jquery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = datapriv.get( elem, type );

			// speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || array.isarray( data ) ) {
					queue = datapriv.access( elem, type, jquery.makearray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jquery.queue( elem, type ),
			startlength = queue.length,
			fn = queue.shift(),
			hooks = jquery._queuehooks( elem, type ),
			next = function() {
				jquery.dequeue( elem, type );
			};

		// if the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startlength--;
		}

		if ( fn ) {

			// add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startlength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not public - generate a queuehooks object, or return the current one
	_queuehooks: function( elem, type ) {
		var key = type + "queuehooks";
		return datapriv.get( elem, key ) || datapriv.access( elem, key, {
			empty: jquery.callbacks( "once memory" ).add( function() {
				datapriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jquery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jquery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jquery.queue( this, type, data );

				// ensure a hooks for this queue
				jquery._queuehooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jquery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jquery.dequeue( this, type );
		} );
	},
	clearqueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jquery.deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolvewith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = datapriv.get( elements[ i ], type + "queuehooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[ee][+-]?\d+|)/ ).source;

var rcssnum = new regexp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssexpand = [ "top", "right", "bottom", "left" ];

var documentelement = document.documentelement;



	var isattached = function( elem ) {
			return jquery.contains( elem.ownerdocument, elem );
		},
		composed = { composed: true };

	// support: ie 9 - 11+, edge 12 - 18+, ios 10.0 - 10.2 only
	// check attachment across shadow dom boundaries when possible (gh-3504)
	// support: ios 10.0-10.2 only
	// early ios 10 versions support `attachshadow` but not `getrootnode`,
	// leading to errors. we need to check for `getrootnode`.
	if ( documentelement.getrootnode ) {
		isattached = function( elem ) {
			return jquery.contains( elem.ownerdocument, elem ) ||
				elem.getrootnode( composed ) === elem.ownerdocument;
		};
	}
var ishiddenwithintree = function( elem, el ) {

		// ishiddenwithintree might be called from jquery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// otherwise, check computed style
			// support: firefox <=43 - 45
			// disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isattached( elem ) &&

			jquery.css( elem, "display" ) === "none";
	};



function adjustcss( elem, prop, valueparts, tween ) {
	var adjusted, scale,
		maxiterations = 20,
		currentvalue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jquery.css( elem, prop, "" );
			},
		initial = currentvalue(),
		unit = valueparts && valueparts[ 3 ] || ( jquery.cssnumber[ prop ] ? "" : "px" ),

		// starting value computation is required for potential unit mismatches
		initialinunit = elem.nodetype &&
			( jquery.cssnumber[ prop ] || unit !== "px" && +initial ) &&
			rcssnum.exec( jquery.css( elem, prop ) );

	if ( initialinunit && initialinunit[ 3 ] !== unit ) {

		// support: firefox <=54
		// halve the iteration target value to prevent interference from css upper bounds (gh-2144)
		initial = initial / 2;

		// trust units reported by jquery.css
		unit = unit || initialinunit[ 3 ];

		// iteratively approximate from a nonzero starting point
		initialinunit = +initial || 1;

		while ( maxiterations-- ) {

			// evaluate and update our best guess (doubling guesses that zero out).
			// finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jquery.style( elem, prop, initialinunit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentvalue() / initial || 0.5 ) ) <= 0 ) {
				maxiterations = 0;
			}
			initialinunit = initialinunit / scale;

		}

		initialinunit = initialinunit * 2;
		jquery.style( elem, prop, initialinunit + unit );

		// make sure we update the tween properties later on
		valueparts = valueparts || [];
	}

	if ( valueparts ) {
		initialinunit = +initialinunit || +initial || 0;

		// apply relative offset (+=/-=) if specified
		adjusted = valueparts[ 1 ] ?
			initialinunit + ( valueparts[ 1 ] + 1 ) * valueparts[ 2 ] :
			+valueparts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialinunit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultdisplaymap = {};

function getdefaultdisplay( elem ) {
	var temp,
		doc = elem.ownerdocument,
		nodename = elem.nodename,
		display = defaultdisplaymap[ nodename ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendchild( doc.createelement( nodename ) );
	display = jquery.css( temp, "display" );

	temp.parentnode.removechild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultdisplaymap[ nodename ] = display;

	return display;
}

function showhide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = datapriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && ishiddenwithintree( elem ) ) {
				values[ index ] = getdefaultdisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// remember what we're overwriting
				datapriv.set( elem, "display", display );
			}
		}
	}

	// set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jquery.fn.extend( {
	show: function() {
		return showhide( this, true );
	},
	hide: function() {
		return showhide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( ishiddenwithintree( this ) ) {
				jquery( this ).show();
			} else {
				jquery( this ).hide();
			}
		} );
	}
} );
var rcheckabletype = ( /^(?:checkbox|radio)$/i );

var rtagname = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscripttype = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createdocumentfragment(),
		div = fragment.appendchild( document.createelement( "div" ) ),
		input = document.createelement( "input" );

	// support: android 4.0 - 4.3 only
	// check state lost if the name is set (trac-11217)
	// support: windows web apps (wwa)
	// `name` and `type` must use .setattribute for wwa (trac-14901)
	input.setattribute( "type", "radio" );
	input.setattribute( "checked", "checked" );
	input.setattribute( "name", "t" );

	div.appendchild( input );

	// support: android <=4.1 only
	// older webkit doesn't clone checked state correctly in fragments
	support.checkclone = div.clonenode( true ).clonenode( true ).lastchild.checked;

	// support: ie <=11 only
	// make sure textarea (and checkbox) defaultvalue is properly cloned
	div.innerhtml = "<textarea>x</textarea>";
	support.noclonechecked = !!div.clonenode( true ).lastchild.defaultvalue;

	// support: ie <=9 only
	// ie <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerhtml = "<option></option>";
	support.option = !!div.lastchild;
} )();


// we have to close these tags to support xhtml (trac-13200)
var wrapmap = {

	// xhtml parsers do not magically insert elements in the
	// same way that tag soup parsers do. so we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapmap.tbody = wrapmap.tfoot = wrapmap.colgroup = wrapmap.caption = wrapmap.thead;
wrapmap.th = wrapmap.td;

// support: ie <=9 only
if ( !support.option ) {
	wrapmap.optgroup = wrapmap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getall( context, tag ) {

	// support: ie <=9 - 11 only
	// use typeof to avoid zero-argument method invocation on host objects (trac-15151)
	var ret;

	if ( typeof context.getelementsbytagname !== "undefined" ) {
		ret = context.getelementsbytagname( tag || "*" );

	} else if ( typeof context.queryselectorall !== "undefined" ) {
		ret = context.queryselectorall( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodename( context, tag ) ) {
		return jquery.merge( [ context ], ret );
	}

	return ret;
}


// mark scripts as having already been evaluated
function setglobaleval( elems, refelements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		datapriv.set(
			elems[ i ],
			"globaleval",
			!refelements || datapriv.get( refelements[ i ], "globaleval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildfragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createdocumentfragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// add nodes directly
			if ( totype( elem ) === "object" ) {

				// support: android <=4.0 only, phantomjs 1 only
				// push.apply(_, arraylike) throws on ancient webkit
				jquery.merge( nodes, elem.nodetype ? [ elem ] : elem );

			// convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createtextnode( elem ) );

			// convert html into dom nodes
			} else {
				tmp = tmp || fragment.appendchild( context.createelement( "div" ) );

				// deserialize a standard representation
				tag = ( rtagname.exec( elem ) || [ "", "" ] )[ 1 ].tolowercase();
				wrap = wrapmap[ tag ] || wrapmap._default;
				tmp.innerhtml = wrap[ 1 ] + jquery.htmlprefilter( elem ) + wrap[ 2 ];

				// descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastchild;
				}

				// support: android <=4.0 only, phantomjs 1 only
				// push.apply(_, arraylike) throws on ancient webkit
				jquery.merge( nodes, tmp.childnodes );

				// remember the top-level container
				tmp = fragment.firstchild;

				// ensure the created nodes are orphaned (trac-12392)
				tmp.textcontent = "";
			}
		}
	}

	// remove wrapper from fragment
	fragment.textcontent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// skip elements already in the context collection (trac-4087)
		if ( selection && jquery.inarray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isattached( elem );

		// append to fragment
		tmp = getall( fragment.appendchild( elem ), "script" );

		// preserve script evaluation history
		if ( attached ) {
			setglobaleval( tmp );
		}

		// capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscripttype.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returntrue() {
	return true;
}

function returnfalse() {
	return false;
}

function on( elem, types, selector, data, fn, one ) {
	var origfn, type;

	// types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnfalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origfn = fn;
		fn = function( event ) {

			// can use an empty set, since event contains the info
			jquery().off( event );
			return origfn.apply( this, arguments );
		};

		// use same guid so caller can remove using origfn
		fn.guid = origfn.guid || ( origfn.guid = jquery.guid++ );
	}
	return elem.each( function() {
		jquery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * helper functions for managing events -- not part of the public interface.
 * props to dean edwards' addevent library for many of the ideas.
 */
jquery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleobjin, eventhandle, tmp,
			events, t, handleobj,
			special, handlers, type, namespaces, origtype,
			elemdata = datapriv.get( elem );

		// only attach events to objects that accept data
		if ( !acceptdata( elem ) ) {
			return;
		}

		// caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleobjin = handler;
			handler = handleobjin.handler;
			selector = handleobjin.selector;
		}

		// ensure that invalid selectors throw exceptions at attach time
		// evaluate against documentelement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jquery.find.matchesselector( documentelement, selector );
		}

		// make sure that the handler has a unique id, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jquery.guid++;
		}

		// init the element's event structure and main handler, if this is the first
		if ( !( events = elemdata.events ) ) {
			events = elemdata.events = object.create( null );
		}
		if ( !( eventhandle = elemdata.handle ) ) {
			eventhandle = elemdata.handle = function( e ) {

				// discard the second event of a jquery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jquery !== "undefined" && jquery.event.triggered !== e.type ?
					jquery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origtype = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// there *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// if event changes its type, use the special event handlers for the changed type
			special = jquery.event.special[ type ] || {};

			// if selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegatetype : special.bindtype ) || type;

			// update special based on newly reset type
			special = jquery.event.special[ type ] || {};

			// handleobj is passed to all event handlers
			handleobj = jquery.extend( {
				type: type,
				origtype: origtype,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needscontext: selector && jquery.expr.match.needscontext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleobjin );

			// init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegatecount = 0;

				// only use addeventlistener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventhandle ) === false ) {

					if ( elem.addeventlistener ) {
						elem.addeventlistener( type, eventhandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleobj );

				if ( !handleobj.handler.guid ) {
					handleobj.handler.guid = handler.guid;
				}
			}

			// add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegatecount++, 0, handleobj );
			} else {
				handlers.push( handleobj );
			}

			// keep track of which events have ever been used, for event optimization
			jquery.event.global[ type ] = true;
		}

	},

	// detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedtypes ) {

		var j, origcount, tmp,
			events, t, handleobj,
			special, handlers, type, namespaces, origtype,
			elemdata = datapriv.hasdata( elem ) && datapriv.get( elem );

		if ( !elemdata || !( events = elemdata.events ) ) {
			return;
		}

		// once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origtype = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jquery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jquery.event.special[ type ] || {};
			type = ( selector ? special.delegatetype : special.bindtype ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new regexp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// remove matching events
			origcount = j = handlers.length;
			while ( j-- ) {
				handleobj = handlers[ j ];

				if ( ( mappedtypes || origtype === handleobj.origtype ) &&
					( !handler || handler.guid === handleobj.guid ) &&
					( !tmp || tmp.test( handleobj.namespace ) ) &&
					( !selector || selector === handleobj.selector ||
						selector === "**" && handleobj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleobj.selector ) {
						handlers.delegatecount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleobj );
					}
				}
			}

			// remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origcount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemdata.handle ) === false ) {

					jquery.removeevent( elem, type, elemdata.handle );
				}

				delete events[ type ];
			}
		}

		// remove data and the expando if it's no longer used
		if ( jquery.isemptyobject( events ) ) {
			datapriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeevent ) {

		var i, j, ret, matched, handleobj, handlerqueue,
			args = new array( arguments.length ),

			// make a writable jquery.event from the native event object
			event = jquery.event.fix( nativeevent ),

			handlers = (
				datapriv.get( this, "events" ) || object.create( null )
			)[ event.type ] || [],
			special = jquery.event.special[ event.type ] || {};

		// use the fix-ed jquery.event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegatetarget = this;

		// call the predispatch hook for the mapped type, and let it bail if desired
		if ( special.predispatch && special.predispatch.call( this, event ) === false ) {
			return;
		}

		// determine handlers
		handlerqueue = jquery.event.handlers.call( this, event, handlers );

		// run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerqueue[ i++ ] ) && !event.ispropagationstopped() ) {
			event.currenttarget = matched.elem;

			j = 0;
			while ( ( handleobj = matched.handlers[ j++ ] ) &&
				!event.isimmediatepropagationstopped() ) {

				// if the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleobj.namespace === false ||
					event.rnamespace.test( handleobj.namespace ) ) {

					event.handleobj = handleobj;
					event.data = handleobj.data;

					ret = ( ( jquery.event.special[ handleobj.origtype ] || {} ).handle ||
						handleobj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventdefault();
							event.stoppropagation();
						}
					}
				}
			}
		}

		// call the postdispatch hook for the mapped type
		if ( special.postdispatch ) {
			special.postdispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleobj, sel, matchedhandlers, matchedselectors,
			handlerqueue = [],
			delegatecount = handlers.delegatecount,
			cur = event.target;

		// find delegate handlers
		if ( delegatecount &&

			// support: ie <=9
			// black-hole svg <use> instance trees (trac-13180)
			cur.nodetype &&

			// support: firefox <=42
			// suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/tr/dom-level-3-events/#event-type-click
			// support: ie 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentnode || this ) {

				// don't check non-elements (trac-13208)
				// don't process clicks on disabled elements (trac-6911, trac-8165, trac-11382, trac-11764)
				if ( cur.nodetype === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedhandlers = [];
					matchedselectors = {};
					for ( i = 0; i < delegatecount; i++ ) {
						handleobj = handlers[ i ];

						// don't conflict with object.prototype properties (trac-13203)
						sel = handleobj.selector + " ";

						if ( matchedselectors[ sel ] === undefined ) {
							matchedselectors[ sel ] = handleobj.needscontext ?
								jquery( sel, this ).index( cur ) > -1 :
								jquery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedselectors[ sel ] ) {
							matchedhandlers.push( handleobj );
						}
					}
					if ( matchedhandlers.length ) {
						handlerqueue.push( { elem: cur, handlers: matchedhandlers } );
					}
				}
			}
		}

		// add the remaining (directly-bound) handlers
		cur = this;
		if ( delegatecount < handlers.length ) {
			handlerqueue.push( { elem: cur, handlers: handlers.slice( delegatecount ) } );
		}

		return handlerqueue;
	},

	addprop: function( name, hook ) {
		object.defineproperty( jquery.event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isfunction( hook ) ?
				function() {
					if ( this.originalevent ) {
						return hook( this.originalevent );
					}
				} :
				function() {
					if ( this.originalevent ) {
						return this.originalevent[ name ];
					}
				},

			set: function( value ) {
				object.defineproperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalevent ) {
		return originalevent[ jquery.expando ] ?
			originalevent :
			new jquery.event( originalevent );
	},

	special: {
		load: {

			// prevent triggered image.load events from bubbling to window.load
			nobubble: true
		},
		click: {

			// utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// for mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// claim the first handler
				if ( rcheckabletype.test( el.type ) &&
					el.click && nodename( el, "input" ) ) {

					// datapriv.set( el, "click", ... )
					leveragenative( el, "click", true );
				}

				// return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// for mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// force setup before triggering a click
				if ( rcheckabletype.test( el.type ) &&
					el.click && nodename( el, "input" ) ) {

					leveragenative( el, "click" );
				}

				// return non-false to allow normal event-path propagation
				return true;
			},

			// for cross-browser consistency, suppress native .click() on links
			// also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckabletype.test( target.type ) &&
					target.click && nodename( target, "input" ) &&
					datapriv.get( target, "click" ) ||
					nodename( target, "a" );
			}
		},

		beforeunload: {
			postdispatch: function( event ) {

				// support: firefox 20+
				// firefox doesn't alert if the returnvalue field is not set.
				if ( event.result !== undefined && event.originalevent ) {
					event.originalevent.returnvalue = event.result;
				}
			}
		}
	}
};

// ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leveragenative( el, type, issetup ) {

	// missing `issetup` indicates a trigger call, which must force setup through jquery.event.add
	if ( !issetup ) {
		if ( datapriv.get( el, type ) === undefined ) {
			jquery.event.add( el, type, returntrue );
		}
		return;
	}

	// register the controller as a special universal handler for all event namespaces
	datapriv.set( el, type, false );
	jquery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var result,
				saved = datapriv.get( this, type );

			if ( ( event.istrigger & 1 ) && this[ type ] ) {

				// interrupt processing of the outer synthetic .trigger()ed event
				if ( !saved ) {

					// store arguments for use when handling the inner native event
					// there will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					datapriv.set( this, type, saved );

					// trigger the native event and capture its result
					this[ type ]();
					result = datapriv.get( this, type );
					datapriv.set( this, type, false );

					if ( saved !== result ) {

						// cancel the outer synthetic event
						event.stopimmediatepropagation();
						event.preventdefault();

						return result;
					}

				// if this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering
				// the native event and prevent that from happening again here.
				// this technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jquery.event.special[ type ] || {} ).delegatetype ) {
					event.stoppropagation();
				}

			// if this is a native event triggered above, everything is now in order
			// fire an inner synthetic event with the original arguments
			} else if ( saved ) {

				// ...and capture the result
				datapriv.set( this, type, jquery.event.trigger(
					saved[ 0 ],
					saved.slice( 1 ),
					this
				) );

				// abort handling of the native event by all jquery handlers while allowing
				// native handlers on the same element to run. on target, this is achieved
				// by stopping immediate propagation just on the jquery event. however,
				// the native event is re-wrapped by a jquery one on each level of the
				// propagation so the only way to stop it for jquery is to stop it for
				// everyone via native `stoppropagation()`. this is not a problem for
				// focus/blur which don't bubble, but it does also stop click on checkboxes
				// and radios. we accept this limitation.
				event.stoppropagation();
				event.isimmediatepropagationstopped = returntrue;
			}
		}
	} );
}

jquery.removeevent = function( elem, type, handle ) {

	// this "if" is needed for plain objects
	if ( elem.removeeventlistener ) {
		elem.removeeventlistener( type, handle );
	}
};

jquery.event = function( src, props ) {

	// allow instantiation without the 'new' keyword
	if ( !( this instanceof jquery.event ) ) {
		return new jquery.event( src, props );
	}

	// event object
	if ( src && src.type ) {
		this.originalevent = src;
		this.type = src.type;

		// events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isdefaultprevented = src.defaultprevented ||
				src.defaultprevented === undefined &&

				// support: android <=2.3 only
				src.returnvalue === false ?
			returntrue :
			returnfalse;

		// create target properties
		// support: safari <=6 - 7 only
		// target should not be a text node (trac-504, trac-13143)
		this.target = ( src.target && src.target.nodetype === 3 ) ?
			src.target.parentnode :
			src.target;

		this.currenttarget = src.currenttarget;
		this.relatedtarget = src.relatedtarget;

	// event type
	} else {
		this.type = src;
	}

	// put explicitly provided properties onto the event object
	if ( props ) {
		jquery.extend( this, props );
	}

	// create a timestamp if incoming event doesn't have one
	this.timestamp = src && src.timestamp || date.now();

	// mark it as fixed
	this[ jquery.expando ] = true;
};

// jquery.event is based on dom3 events as specified by the ecmascript language binding
// https://www.w3.org/tr/2003/wd-dom-level-3-events-20030331/ecma-script-binding.html
jquery.event.prototype = {
	constructor: jquery.event,
	isdefaultprevented: returnfalse,
	ispropagationstopped: returnfalse,
	isimmediatepropagationstopped: returnfalse,
	issimulated: false,

	preventdefault: function() {
		var e = this.originalevent;

		this.isdefaultprevented = returntrue;

		if ( e && !this.issimulated ) {
			e.preventdefault();
		}
	},
	stoppropagation: function() {
		var e = this.originalevent;

		this.ispropagationstopped = returntrue;

		if ( e && !this.issimulated ) {
			e.stoppropagation();
		}
	},
	stopimmediatepropagation: function() {
		var e = this.originalevent;

		this.isimmediatepropagationstopped = returntrue;

		if ( e && !this.issimulated ) {
			e.stopimmediatepropagation();
		}

		this.stoppropagation();
	}
};

// includes all common event props including keyevent and mouseevent specific props
jquery.each( {
	altkey: true,
	bubbles: true,
	cancelable: true,
	changedtouches: true,
	ctrlkey: true,
	detail: true,
	eventphase: true,
	metakey: true,
	pagex: true,
	pagey: true,
	shiftkey: true,
	view: true,
	"char": true,
	code: true,
	charcode: true,
	key: true,
	keycode: true,
	button: true,
	buttons: true,
	clientx: true,
	clienty: true,
	offsetx: true,
	offsety: true,
	pointerid: true,
	pointertype: true,
	screenx: true,
	screeny: true,
	targettouches: true,
	toelement: true,
	touches: true,
	which: true
}, jquery.event.addprop );

jquery.each( { focus: "focusin", blur: "focusout" }, function( type, delegatetype ) {

	function focusmappedhandler( nativeevent ) {
		if ( document.documentmode ) {

			// support: ie 11+
			// attach a single focusin/focusout handler on the document while someone wants
			// focus/blur. this is because the former are synchronous in ie while the latter
			// are async. in other browsers, all those handlers are invoked synchronously.

			// `handle` from private data would already wrap the event, but we need
			// to change the `type` here.
			var handle = datapriv.get( this, "handle" ),
				event = jquery.event.fix( nativeevent );
			event.type = nativeevent.type === "focusin" ? "focus" : "blur";
			event.issimulated = true;

			// first, handle focusin/focusout
			handle( nativeevent );

			// ...then, handle focus/blur
			//
			// focus/blur don't bubble while focusin/focusout do; simulate the former by only
			// invoking the handler at the lower level.
			if ( event.target === event.currenttarget ) {

				// the setup part calls `leveragenative`, which, in turn, calls
				// `jquery.event.add`, so event handle will already have been set
				// by this point.
				handle( event );
			}
		} else {

			// for non-ie browsers, attach a single capturing handler on the document
			// while someone wants focusin/focusout.
			jquery.event.simulate( delegatetype, nativeevent.target,
				jquery.event.fix( nativeevent ) );
		}
	}

	jquery.event.special[ type ] = {

		// utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			var attaches;

			// claim the first handler
			// datapriv.set( this, "focus", ... )
			// datapriv.set( this, "blur", ... )
			leveragenative( this, type, true );

			if ( document.documentmode ) {

				// support: ie 9 - 11+
				// we use the same native handler for focusin & focus (and focusout & blur)
				// so we need to coordinate setup & teardown parts between those events.
				// use `delegatetype` as the key as `type` is already used by `leveragenative`.
				attaches = datapriv.get( this, delegatetype );
				if ( !attaches ) {
					this.addeventlistener( delegatetype, focusmappedhandler );
				}
				datapriv.set( this, delegatetype, ( attaches || 0 ) + 1 );
			} else {

				// return false to allow normal processing in the caller
				return false;
			}
		},
		trigger: function() {

			// force setup before trigger
			leveragenative( this, type );

			// return non-false to allow normal event-path propagation
			return true;
		},

		teardown: function() {
			var attaches;

			if ( document.documentmode ) {
				attaches = datapriv.get( this, delegatetype ) - 1;
				if ( !attaches ) {
					this.removeeventlistener( delegatetype, focusmappedhandler );
					datapriv.remove( this, delegatetype );
				} else {
					datapriv.set( this, delegatetype, attaches );
				}
			} else {

				// return false to indicate standard teardown should be applied
				return false;
			}
		},

		// suppress native focus or blur if we're currently inside
		// a leveraged native-event stack
		_default: function( event ) {
			return datapriv.get( event.target, type );
		},

		delegatetype: delegatetype
	};

	// support: firefox <=44
	// firefox doesn't have focus(in | out) events
	// related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// support: chrome <=48 - 49, safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/tr/dom-level-3-events/#events-focusevent-event-order
	// related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	//
	// support: ie 9 - 11+
	// to preserve relative focusin/focus & focusout/blur event order guaranteed on the 3.x branch,
	// attach a single handler for both events in ie.
	jquery.event.special[ delegatetype ] = {
		setup: function() {

			// handle: regular nodes (via `this.ownerdocument`), window
			// (via `this.document`) & document (via `this`).
			var doc = this.ownerdocument || this.document || this,
				dataholder = document.documentmode ? this : doc,
				attaches = datapriv.get( dataholder, delegatetype );

			// support: ie 9 - 11+
			// we use the same native handler for focusin & focus (and focusout & blur)
			// so we need to coordinate setup & teardown parts between those events.
			// use `delegatetype` as the key as `type` is already used by `leveragenative`.
			if ( !attaches ) {
				if ( document.documentmode ) {
					this.addeventlistener( delegatetype, focusmappedhandler );
				} else {
					doc.addeventlistener( type, focusmappedhandler, true );
				}
			}
			datapriv.set( dataholder, delegatetype, ( attaches || 0 ) + 1 );
		},
		teardown: function() {
			var doc = this.ownerdocument || this.document || this,
				dataholder = document.documentmode ? this : doc,
				attaches = datapriv.get( dataholder, delegatetype ) - 1;

			if ( !attaches ) {
				if ( document.documentmode ) {
					this.removeeventlistener( delegatetype, focusmappedhandler );
				} else {
					doc.removeeventlistener( type, focusmappedhandler, true );
				}
				datapriv.remove( dataholder, delegatetype );
			} else {
				datapriv.set( dataholder, delegatetype, attaches );
			}
		}
	};
} );

// create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jquery.
// do the same for pointerenter/pointerleave and pointerover/pointerout
//
// support: safari 7 only
// safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older chrome versions as well).
jquery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jquery.event.special[ orig ] = {
		delegatetype: fix,
		bindtype: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedtarget,
				handleobj = event.handleobj;

			// for mouseenter/leave call the handler if related is outside the target.
			// nb: no relatedtarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jquery.contains( target, related ) ) ) {
				event.type = handleobj.origtype;
				ret = handleobj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jquery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleobj, type;
		if ( types && types.preventdefault && types.handleobj ) {

			// ( event )  dispatched jquery.event
			handleobj = types.handleobj;
			jquery( types.delegatetarget ).off(
				handleobj.namespace ?
					handleobj.origtype + "." + handleobj.namespace :
					handleobj.origtype,
				handleobj.selector,
				handleobj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnfalse;
		}
		return this.each( function() {
			jquery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// support: ie <=10 - 11, edge 12 - 13 only
	// in ie/edge using regex groups here causes severe slowdowns.
	// see https://connect.microsoft.com/ie/feedback/details/1736512/
	rnoinnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,

	rcleanscript = /^\s*<!\[cdata\[|\]\]>\s*$/g;

// prefer a tbody over its parent table for containing new rows
function manipulationtarget( elem, content ) {
	if ( nodename( elem, "table" ) &&
		nodename( content.nodetype !== 11 ? content : content.firstchild, "tr" ) ) {

		return jquery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// replace/restore the type attribute of script elements for safe dom manipulation
function disablescript( elem ) {
	elem.type = ( elem.getattribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restorescript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeattribute( "type" );
	}

	return elem;
}

function clonecopyevent( src, dest ) {
	var i, l, type, pdataold, udataold, udatacur, events;

	if ( dest.nodetype !== 1 ) {
		return;
	}

	// 1. copy private data: events, handlers, etc.
	if ( datapriv.hasdata( src ) ) {
		pdataold = datapriv.get( src );
		events = pdataold.events;

		if ( events ) {
			datapriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jquery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. copy user data
	if ( datauser.hasdata( src ) ) {
		udataold = datauser.access( src );
		udatacur = jquery.extend( {}, udataold );

		datauser.set( dest, udatacur );
	}
}

// fix ie bugs, see support tests
function fixinput( src, dest ) {
	var nodename = dest.nodename.tolowercase();

	// fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodename === "input" && rcheckabletype.test( src.type ) ) {
		dest.checked = src.checked;

	// fails to return the selected option to the default selected state when cloning options
	} else if ( nodename === "input" || nodename === "textarea" ) {
		dest.defaultvalue = src.defaultvalue;
	}
}

function dommanip( collection, args, callback, ignored ) {

	// flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasscripts, node, doc,
		i = 0,
		l = collection.length,
		inoclone = l - 1,
		value = args[ 0 ],
		valueisfunction = isfunction( value );

	// we can't clonenode fragments that contain checked, in webkit
	if ( valueisfunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkclone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueisfunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			dommanip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildfragment( args, collection[ 0 ].ownerdocument, false, collection, ignored );
		first = fragment.firstchild;

		if ( fragment.childnodes.length === 1 ) {
			fragment = first;
		}

		// require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jquery.map( getall( fragment, "script" ), disablescript );
			hasscripts = scripts.length;

			// use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (trac-8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== inoclone ) {
					node = jquery.clone( node, true, true );

					// keep references to cloned scripts for later restoration
					if ( hasscripts ) {

						// support: android <=4.0 only, phantomjs 1 only
						// push.apply(_, arraylike) throws on ancient webkit
						jquery.merge( scripts, getall( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasscripts ) {
				doc = scripts[ scripts.length - 1 ].ownerdocument;

				// re-enable scripts
				jquery.map( scripts, restorescript );

				// evaluate executable scripts on first document insertion
				for ( i = 0; i < hasscripts; i++ ) {
					node = scripts[ i ];
					if ( rscripttype.test( node.type || "" ) &&
						!datapriv.access( node, "globaleval" ) &&
						jquery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).tolowercase()  !== "module" ) {

							// optional ajax dependency, but won't run scripts if not present
							if ( jquery._evalurl && !node.nomodule ) {
								jquery._evalurl( node.src, {
									nonce: node.nonce || node.getattribute( "nonce" )
								}, doc );
							}
						} else {

							// unwrap a cdata section containing script contents. this shouldn't be
							// needed as in xml documents they're already not visible when
							// inspecting element contents and in html documents they have no
							// meaning but we're preserving that logic for backwards compatibility.
							// this will be removed completely in 4.0. see gh-4904.
							domeval( node.textcontent.replace( rcleanscript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepdata ) {
	var node,
		nodes = selector ? jquery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepdata && node.nodetype === 1 ) {
			jquery.cleandata( getall( node ) );
		}

		if ( node.parentnode ) {
			if ( keepdata && isattached( node ) ) {
				setglobaleval( getall( node, "script" ) );
			}
			node.parentnode.removechild( node );
		}
	}

	return elem;
}

jquery.extend( {
	htmlprefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataandevents, deepdataandevents ) {
		var i, l, srcelements, destelements,
			clone = elem.clonenode( true ),
			inpage = isattached( elem );

		// fix ie cloning issues
		if ( !support.noclonechecked && ( elem.nodetype === 1 || elem.nodetype === 11 ) &&
				!jquery.isxmldoc( elem ) ) {

			// we eschew jquery#find here for performance reasons:
			// https://jsperf.com/getall-vs-sizzle/2
			destelements = getall( clone );
			srcelements = getall( elem );

			for ( i = 0, l = srcelements.length; i < l; i++ ) {
				fixinput( srcelements[ i ], destelements[ i ] );
			}
		}

		// copy the events from the original to the clone
		if ( dataandevents ) {
			if ( deepdataandevents ) {
				srcelements = srcelements || getall( elem );
				destelements = destelements || getall( clone );

				for ( i = 0, l = srcelements.length; i < l; i++ ) {
					clonecopyevent( srcelements[ i ], destelements[ i ] );
				}
			} else {
				clonecopyevent( elem, clone );
			}
		}

		// preserve script evaluation history
		destelements = getall( clone, "script" );
		if ( destelements.length > 0 ) {
			setglobaleval( destelements, !inpage && getall( elem, "script" ) );
		}

		// return the cloned set
		return clone;
	},

	cleandata: function( elems ) {
		var data, elem, type,
			special = jquery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptdata( elem ) ) {
				if ( ( data = elem[ datapriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jquery.event.remove( elem, type );

							// this is a shortcut to avoid jquery.event.remove's overhead
							} else {
								jquery.removeevent( elem, type, data.handle );
							}
						}
					}

					// support: chrome <=35 - 45+
					// assign undefined instead of using delete, see data#remove
					elem[ datapriv.expando ] = undefined;
				}
				if ( elem[ datauser.expando ] ) {

					// support: chrome <=35 - 45+
					// assign undefined instead of using delete, see data#remove
					elem[ datauser.expando ] = undefined;
				}
			}
		}
	}
} );

jquery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jquery.text( this ) :
				this.empty().each( function() {
					if ( this.nodetype === 1 || this.nodetype === 11 || this.nodetype === 9 ) {
						this.textcontent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return dommanip( this, arguments, function( elem ) {
			if ( this.nodetype === 1 || this.nodetype === 11 || this.nodetype === 9 ) {
				var target = manipulationtarget( this, elem );
				target.appendchild( elem );
			}
		} );
	},

	prepend: function() {
		return dommanip( this, arguments, function( elem ) {
			if ( this.nodetype === 1 || this.nodetype === 11 || this.nodetype === 9 ) {
				var target = manipulationtarget( this, elem );
				target.insertbefore( elem, target.firstchild );
			}
		} );
	},

	before: function() {
		return dommanip( this, arguments, function( elem ) {
			if ( this.parentnode ) {
				this.parentnode.insertbefore( elem, this );
			}
		} );
	},

	after: function() {
		return dommanip( this, arguments, function( elem ) {
			if ( this.parentnode ) {
				this.parentnode.insertbefore( elem, this.nextsibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodetype === 1 ) {

				// prevent memory leaks
				jquery.cleandata( getall( elem, false ) );

				// remove any remaining nodes
				elem.textcontent = "";
			}
		}

		return this;
	},

	clone: function( dataandevents, deepdataandevents ) {
		dataandevents = dataandevents == null ? false : dataandevents;
		deepdataandevents = deepdataandevents == null ? dataandevents : deepdataandevents;

		return this.map( function() {
			return jquery.clone( this, dataandevents, deepdataandevents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodetype === 1 ) {
				return elem.innerhtml;
			}

			// see if we can take a shortcut and just use innerhtml
			if ( typeof value === "string" && !rnoinnerhtml.test( value ) &&
				!wrapmap[ ( rtagname.exec( value ) || [ "", "" ] )[ 1 ].tolowercase() ] ) {

				value = jquery.htmlprefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// remove element nodes and prevent memory leaks
						if ( elem.nodetype === 1 ) {
							jquery.cleandata( getall( elem, false ) );
							elem.innerhtml = value;
						}
					}

					elem = 0;

				// if using innerhtml throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replacewith: function() {
		var ignored = [];

		// make the changes, replacing each non-ignored context element with the new content
		return dommanip( this, arguments, function( elem ) {
			var parent = this.parentnode;

			if ( jquery.inarray( this, ignored ) < 0 ) {
				jquery.cleandata( getall( this ) );
				if ( parent ) {
					parent.replacechild( elem, this );
				}
			}

		// force callback invocation
		}, ignored );
	}
} );

jquery.each( {
	appendto: "append",
	prependto: "prepend",
	insertbefore: "before",
	insertafter: "after",
	replaceall: "replacewith"
}, function( name, original ) {
	jquery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jquery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jquery( insert[ i ] )[ original ]( elems );

			// support: android <=4.0 only, phantomjs 1 only
			// .get() because push.apply(_, arraylike) throws on ancient webkit
			push.apply( ret, elems.get() );
		}

		return this.pushstack( ret );
	};
} );
var rnumnonpx = new regexp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var rcustomprop = /^--/;


var getstyles = function( elem ) {

		// support: ie <=11 only, firefox <=30 (trac-15098, trac-14150)
		// ie throws on elements created in popups
		// ff meanwhile throws on frame elements through "defaultview.getcomputedstyle"
		var view = elem.ownerdocument.defaultview;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getcomputedstyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxstyle = new regexp( cssexpand.join( "|" ), "i" );



( function() {

	// executing both pixelposition & boxsizingreliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computestyletests() {

		// this is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.csstext = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.csstext =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentelement.appendchild( container ).appendchild( div );

		var divstyle = window.getcomputedstyle( div );
		pixelpositionval = divstyle.top !== "1%";

		// support: android 4.0 - 4.3 only, firefox <=3 - 44
		reliablemarginleftval = roundpixelmeasures( divstyle.marginleft ) === 12;

		// support: android 4.0 - 4.3 only, safari <=9.1 - 10.1, ios <=7.0 - 9.3
		// some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelboxstylesval = roundpixelmeasures( divstyle.right ) === 36;

		// support: ie 9 - 11 only
		// detect misreporting of content dimensions for box-sizing:border-box elements
		boxsizingreliableval = roundpixelmeasures( divstyle.width ) === 36;

		// support: ie 9 only
		// detect overflow:scroll screwiness (gh-3699)
		// support: chrome <=64
		// don't get tricked when zoom affects offsetwidth (gh-4029)
		div.style.position = "absolute";
		scrollboxsizeval = roundpixelmeasures( div.offsetwidth / 3 ) === 12;

		documentelement.removechild( container );

		// nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundpixelmeasures( measure ) {
		return math.round( parsefloat( measure ) );
	}

	var pixelpositionval, boxsizingreliableval, scrollboxsizeval, pixelboxstylesval,
		reliabletrdimensionsval, reliablemarginleftval,
		container = document.createelement( "div" ),
		div = document.createelement( "div" );

	// finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// support: ie <=9 - 11 only
	// style of cloned element affects source element cloned (trac-8908)
	div.style.backgroundclip = "content-box";
	div.clonenode( true ).style.backgroundclip = "";
	support.clearclonestyle = div.style.backgroundclip === "content-box";

	jquery.extend( support, {
		boxsizingreliable: function() {
			computestyletests();
			return boxsizingreliableval;
		},
		pixelboxstyles: function() {
			computestyletests();
			return pixelboxstylesval;
		},
		pixelposition: function() {
			computestyletests();
			return pixelpositionval;
		},
		reliablemarginleft: function() {
			computestyletests();
			return reliablemarginleftval;
		},
		scrollboxsize: function() {
			computestyletests();
			return scrollboxsizeval;
		},

		// support: ie 9 - 11+, edge 15 - 18+
		// ie/edge misreport `getcomputedstyle` of table rows with width/height
		// set in css while `offset*` properties report correct values.
		// behavior in ie 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// support: firefox 70+
		// only firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliabletrdimensions: function() {
			var table, tr, trchild, trstyle;
			if ( reliabletrdimensionsval == null ) {
				table = document.createelement( "table" );
				tr = document.createelement( "tr" );
				trchild = document.createelement( "div" );

				table.style.csstext = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.csstext = "box-sizing:content-box;border:1px solid";

				// support: chrome 86+
				// height set through csstext does not get applied.
				// computed height then comes back as 0.
				tr.style.height = "1px";
				trchild.style.height = "9px";

				// support: android 8 chrome 86+
				// in our bodybackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in android 8 chrome 86.
				// ensuring the div is `display: block`
				// gets around this issue.
				trchild.style.display = "block";

				documentelement
					.appendchild( table )
					.appendchild( tr )
					.appendchild( trchild );

				trstyle = window.getcomputedstyle( tr );
				reliabletrdimensionsval = ( parseint( trstyle.height, 10 ) +
					parseint( trstyle.bordertopwidth, 10 ) +
					parseint( trstyle.borderbottomwidth, 10 ) ) === tr.offsetheight;

				documentelement.removechild( table );
			}
			return reliabletrdimensionsval;
		}
	} );
} )();


function curcss( elem, name, computed ) {
	var width, minwidth, maxwidth, ret,
		iscustomprop = rcustomprop.test( name ),

		// support: firefox 51+
		// retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getstyles( elem );

	// getpropertyvalue is needed for:
	//   .css('filter') (ie 9 only, trac-12537)
	//   .css('--customproperty) (gh-3144)
	if ( computed ) {

		// support: ie <=9 - 11+
		// ie only supports `"float"` in `getpropertyvalue`; in computed styles
		// it's only available as `"cssfloat"`. we no longer modify properties
		// sent to `.css()` apart from camelcasing, so we need to check both.
		// normally, this would create difference in behavior: if
		// `getpropertyvalue` returns an empty string, the value returned
		// by `.css()` would be `undefined`. this is usually the case for
		// disconnected elements. however, in ie even disconnected elements
		// with no styles return `"none"` for `getpropertyvalue( "float" )`
		ret = computed.getpropertyvalue( name ) || computed[ name ];

		if ( iscustomprop && ret ) {

			// support: firefox 105+, chrome <=105+
			// spec requires trimming whitespace for custom properties (gh-4926).
			// firefox only trims leading whitespace. chrome just collapses
			// both leading & trailing whitespace to a single space.
			//
			// fall back to `undefined` if empty string returned.
			// this collapses a missing definition with property defined
			// and set to an empty string but there's no standard api
			// allowing us to differentiate them without a performance penalty
			// and returning `undefined` aligns with older jquery.
			//
			// rtrimcss treats u+000d carriage return and u+000c form feed
			// as whitespace while css does not, but this is not a problem
			// because css preprocessing replaces them with u+000a line feed
			// (which *is* css whitespace)
			// https://www.w3.org/tr/css-syntax-3/#input-preprocessing
			ret = ret.replace( rtrimcss, "$1" ) || undefined;
		}

		if ( ret === "" && !isattached( elem ) ) {
			ret = jquery.style( elem, name );
		}

		// a tribute to the "awesome hack by dean edwards"
		// android browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// this is against the cssom draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelboxstyles() && rnumnonpx.test( ret ) && rboxstyle.test( name ) ) {

			// remember the original values
			width = style.width;
			minwidth = style.minwidth;
			maxwidth = style.maxwidth;

			// put in the new values to get a computed value out
			style.minwidth = style.maxwidth = style.width = ret;
			ret = computed.width;

			// revert the changed values
			style.width = width;
			style.minwidth = minwidth;
			style.maxwidth = maxwidth;
		}
	}

	return ret !== undefined ?

		// support: ie <=9 - 11 only
		// ie returns zindex value as an integer.
		ret + "" :
		ret;
}


function addgethookif( conditionfn, hookfn ) {

	// define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionfn() ) {

				// hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookfn ).apply( this, arguments );
		}
	};
}


var cssprefixes = [ "webkit", "moz", "ms" ],
	emptystyle = document.createelement( "div" ).style,
	vendorprops = {};

// return a vendor-prefixed property or undefined
function vendorpropname( name ) {

	// check for vendor prefixed names
	var capname = name[ 0 ].touppercase() + name.slice( 1 ),
		i = cssprefixes.length;

	while ( i-- ) {
		name = cssprefixes[ i ] + capname;
		if ( name in emptystyle ) {
			return name;
		}
	}
}

// return a potentially-mapped jquery.cssprops or vendor prefixed property
function finalpropname( name ) {
	var final = jquery.cssprops[ name ] || vendorprops[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptystyle ) {
		return name;
	}
	return vendorprops[ name ] = vendorpropname( name ) || name;
}


var

	// swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-us/docs/css/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	cssshow = { position: "absolute", visibility: "hidden", display: "block" },
	cssnormaltransform = {
		letterspacing: "0",
		fontweight: "400"
	};

function setpositivenumber( _elem, value, subtract ) {

	// any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssnum.exec( value );
	return matches ?

		// guard against undefined "subtract", e.g., when used as in csshooks
		math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxmodeladjustment( elem, dimension, box, isborderbox, styles, computedval ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0,
		margindelta = 0;

	// adjustment may not be necessary
	if ( box === ( isborderbox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// both box models exclude margin
		// count margin delta separately to only add it after scroll gutter adjustment.
		// this is needed to make negative margins work with `outerheight( true )` (gh-3982).
		if ( box === "margin" ) {
			margindelta += jquery.css( elem, box + cssexpand[ i ], true, styles );
		}

		// if we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isborderbox ) {

			// add padding
			delta += jquery.css( elem, "padding" + cssexpand[ i ], true, styles );

			// for "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jquery.css( elem, "border" + cssexpand[ i ] + "width", true, styles );

			// but still keep track of it otherwise
			} else {
				extra += jquery.css( elem, "border" + cssexpand[ i ] + "width", true, styles );
			}

		// if we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// for "content", subtract padding
			if ( box === "content" ) {
				delta -= jquery.css( elem, "padding" + cssexpand[ i ], true, styles );
			}

			// for "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jquery.css( elem, "border" + cssexpand[ i ] + "width", true, styles );
			}
		}
	}

	// account for positive content-box scroll gutter when requested by providing computedval
	if ( !isborderbox && computedval >= 0 ) {

		// offsetwidth/offsetheight is a rounded sum of content, padding, scroll gutter, and border
		// assuming integer scroll gutter, subtract the rest and round down
		delta += math.max( 0, math.ceil(
			elem[ "offset" + dimension[ 0 ].touppercase() + dimension.slice( 1 ) ] -
			computedval -
			delta -
			extra -
			0.5

		// if offsetwidth/offsetheight is unknown, then we can't determine content-box scroll gutter
		// use an explicit zero to avoid nan (gh-3964)
		) ) || 0;
	}

	return delta + margindelta;
}

function getwidthorheight( elem, dimension, extra ) {

	// start with computed style
	var styles = getstyles( elem ),

		// to avoid forcing a reflow, only fetch boxsizing if we need it (gh-4322).
		// fake content-box until we know it's needed to know the true value.
		boxsizingneeded = !support.boxsizingreliable() || extra,
		isborderbox = boxsizingneeded &&
			jquery.css( elem, "boxsizing", false, styles ) === "border-box",
		valueisborderbox = isborderbox,

		val = curcss( elem, dimension, styles ),
		offsetprop = "offset" + dimension[ 0 ].touppercase() + dimension.slice( 1 );

	// support: firefox <=54
	// return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// support: ie 9 - 11 only
	// use offsetwidth/offsetheight for when box sizing is unreliable.
	// in those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxsizingreliable() && isborderbox ||

		// support: ie 10 - 11+, edge 15 - 18+
		// ie/edge misreport `getcomputedstyle` of table rows with width/height
		// set in css while `offset*` properties report correct values.
		// interestingly, in some cases ie 9 doesn't suffer from this issue.
		!support.reliabletrdimensions() && nodename( elem, "tr" ) ||

		// fall back to offsetwidth/offsetheight when value is "auto"
		// this happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// support: android <=4.1 - 4.3 only
		// also use offsetwidth/offsetheight for misreported inline dimensions (gh-3602)
		!parsefloat( val ) && jquery.css( elem, "display", false, styles ) === "inline" ) &&

		// make sure the element is visible & connected
		elem.getclientrects().length ) {

		isborderbox = jquery.css( elem, "boxsizing", false, styles ) === "border-box";

		// where available, offsetwidth/offsetheight approximate border box dimensions.
		// where not available (e.g., svg), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueisborderbox = offsetprop in elem;
		if ( valueisborderbox ) {
			val = elem[ offsetprop ];
		}
	}

	// normalize "" and auto
	val = parsefloat( val ) || 0;

	// adjust for the element's box model
	return ( val +
		boxmodeladjustment(
			elem,
			dimension,
			extra || ( isborderbox ? "border" : "content" ),
			valueisborderbox,
			styles,

			// provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jquery.extend( {

	// add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	csshooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// we should always get a number back from opacity
					var ret = curcss( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// don't automatically add "px" to these possibly-unitless properties
	cssnumber: {
		animationiterationcount: true,
		aspectratio: true,
		borderimageslice: true,
		columncount: true,
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
		scale: true,
		widows: true,
		zindex: true,
		zoom: true,

		// svg-related
		fillopacity: true,
		floodopacity: true,
		stopopacity: true,
		strokemiterlimit: true,
		strokeopacity: true
	},

	// add in properties whose names you wish to fix before
	// setting or getting the value
	cssprops: {},

	// get and set the style property on a dom node
	style: function( elem, name, value, extra ) {

		// don't set styles on text and comment nodes
		if ( !elem || elem.nodetype === 3 || elem.nodetype === 8 || !elem.style ) {
			return;
		}

		// make sure that we're working with the right name
		var ret, type, hooks,
			origname = camelcase( name ),
			iscustomprop = rcustomprop.test( name ),
			style = elem.style;

		// make sure that we're working with the right name. we don't
		// want to query the value if it is a css custom property
		// since they are user-defined.
		if ( !iscustomprop ) {
			name = finalpropname( origname );
		}

		// gets hook for the prefixed version, then unprefixed version
		hooks = jquery.csshooks[ name ] || jquery.csshooks[ origname ];

		// check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert "+=" or "-=" to relative numbers (trac-7345)
			if ( type === "string" && ( ret = rcssnum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustcss( elem, name, ret );

				// fixes bug trac-9237
				type = "number";
			}

			// make sure that null and nan values aren't set (trac-7116)
			if ( value == null || value !== value ) {
				return;
			}

			// if a number was passed in, add the unit (except for certain css properties)
			// the iscustomprop check can be removed in jquery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !iscustomprop ) {
				value += ret && ret[ 3 ] || ( jquery.cssnumber[ origname ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearclonestyle && value === "" && name.indexof( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// if a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( iscustomprop ) {
					style.setproperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// if a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origname = camelcase( name ),
			iscustomprop = rcustomprop.test( name );

		// make sure that we're working with the right name. we don't
		// want to modify the value if it is a css custom property
		// since they are user-defined.
		if ( !iscustomprop ) {
			name = finalpropname( origname );
		}

		// try prefixed name followed by the unprefixed name
		hooks = jquery.csshooks[ name ] || jquery.csshooks[ origname ];

		// if a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curcss( elem, name, styles );
		}

		// convert "normal" to computed value
		if ( val === "normal" && name in cssnormaltransform ) {
			val = cssnormaltransform[ name ];
		}

		// make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parsefloat( val );
			return extra === true || isfinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jquery.each( [ "height", "width" ], function( _i, dimension ) {
	jquery.csshooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jquery.css( elem, "display" ) ) &&

					// support: safari 8+
					// table columns in safari have non-zero offsetwidth & zero
					// getboundingclientrect().width unless display is changed.
					// support: ie <=11 only
					// running getboundingclientrect on a disconnected node
					// in ie throws an error.
					( !elem.getclientrects().length || !elem.getboundingclientrect().width ) ?
					swap( elem, cssshow, function() {
						return getwidthorheight( elem, dimension, extra );
					} ) :
					getwidthorheight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getstyles( elem ),

				// only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxsizebuggy = !support.scrollboxsize() &&
					styles.position === "absolute",

				// to avoid forcing a reflow, only fetch boxsizing if we need it (gh-3991)
				boxsizingneeded = scrollboxsizebuggy || extra,
				isborderbox = boxsizingneeded &&
					jquery.css( elem, "boxsizing", false, styles ) === "border-box",
				subtract = extra ?
					boxmodeladjustment(
						elem,
						dimension,
						extra,
						isborderbox,
						styles
					) :
					0;

			// account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isborderbox && scrollboxsizebuggy ) {
				subtract -= math.ceil(
					elem[ "offset" + dimension[ 0 ].touppercase() + dimension.slice( 1 ) ] -
					parsefloat( styles[ dimension ] ) -
					boxmodeladjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssnum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jquery.css( elem, dimension );
			}

			return setpositivenumber( elem, value, subtract );
		}
	};
} );

jquery.csshooks.marginleft = addgethookif( support.reliablemarginleft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parsefloat( curcss( elem, "marginleft" ) ) ||
				elem.getboundingclientrect().left -
					swap( elem, { marginleft: 0 }, function() {
						return elem.getboundingclientrect().left;
					} )
			) + "px";
		}
	}
);

// these hooks are used by animate to expand properties
jquery.each( {
	margin: "",
	padding: "",
	border: "width"
}, function( prefix, suffix ) {
	jquery.csshooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssexpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jquery.csshooks[ prefix + suffix ].set = setpositivenumber;
	}
} );

jquery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( array.isarray( name ) ) {
				styles = getstyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jquery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jquery.style( elem, name, value ) :
				jquery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function tween( elem, options, prop, end, easing ) {
	return new tween.prototype.init( elem, options, prop, end, easing );
}
jquery.tween = tween;

tween.prototype = {
	constructor: tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jquery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jquery.cssnumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = tween.prophooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			tween.prophooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = tween.prophooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jquery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			tween.prophooks._default.set( this );
		}
		return this;
	}
};

tween.prototype.init.prototype = tween.prototype;

tween.prophooks = {
	_default: {
		get: function( tween ) {
			var result;

			// use a property on the element directly when it is not a dom element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodetype !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parsefloat and fallback to a string if the parse fails.
			// simple values such as "10px" are parsed to float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jquery.css( tween.elem, tween.prop, "" );

			// empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// use step hook for back compat.
			// use csshook if its there.
			// use .style if available and use plain properties where available.
			if ( jquery.fx.step[ tween.prop ] ) {
				jquery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodetype === 1 && (
				jquery.csshooks[ tween.prop ] ||
					tween.elem.style[ finalpropname( tween.prop ) ] != null ) ) {
				jquery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// support: ie <=9 only
// panic based approach to setting things on disconnected nodes
tween.prophooks.scrolltop = tween.prophooks.scrollleft = {
	set: function( tween ) {
		if ( tween.elem.nodetype && tween.elem.parentnode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jquery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - math.cos( p * math.pi ) / 2;
	},
	_default: "swing"
};

jquery.fx = tween.prototype.init;

// back compat <1.8 extension point
jquery.fx.step = {};




var
	fxnow, inprogress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queuehooks$/;

function schedule() {
	if ( inprogress ) {
		if ( document.hidden === false && window.requestanimationframe ) {
			window.requestanimationframe( schedule );
		} else {
			window.settimeout( schedule, jquery.fx.interval );
		}

		jquery.fx.tick();
	}
}

// animations created synchronously will run synchronously
function createfxnow() {
	window.settimeout( function() {
		fxnow = undefined;
	} );
	return ( fxnow = date.now() );
}

// generate parameters to create a standard animation
function genfx( type, includewidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// if we include width, step value is 1 to do all cssexpand values,
	// otherwise step value is 2 to skip over left and right
	includewidth = includewidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includewidth ) {
		which = cssexpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includewidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createtween( value, prop, animation ) {
	var tween,
		collection = ( animation.tweeners[ prop ] || [] ).concat( animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultprefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, proptween, restoredisplay, display,
		isbox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodetype && ishiddenwithintree( elem ),
		datashow = datapriv.get( elem, "fxshow" );

	// queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jquery._queuehooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jquery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && datashow && datashow[ prop ] !== undefined ) {
					hidden = true;

				// ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = datashow && datashow[ prop ] || jquery.style( elem, prop );
		}
	}

	// bail out if this is a no-op like .hide().hide()
	proptween = !jquery.isemptyobject( props );
	if ( !proptween && jquery.isemptyobject( orig ) ) {
		return;
	}

	// restrict "overflow" and "display" styles during box animations
	if ( isbox && elem.nodetype === 1 ) {

		// support: ie <=9 - 11, edge 12 - 15
		// record all 3 overflow attributes because ie does not infer the shorthand
		// from identically-valued overflowx and overflowy and edge just mirrors
		// the overflowx value there.
		opts.overflow = [ style.overflow, style.overflowx, style.overflowy ];

		// identify a display type, preferring old show/hide data over the css cascade
		restoredisplay = datashow && datashow.display;
		if ( restoredisplay == null ) {
			restoredisplay = datapriv.get( elem, "display" );
		}
		display = jquery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoredisplay ) {
				display = restoredisplay;
			} else {

				// get nonempty value(s) by temporarily forcing visibility
				showhide( [ elem ], true );
				restoredisplay = elem.style.display || restoredisplay;
				display = jquery.css( elem, "display" );
				showhide( [ elem ] );
			}
		}

		// animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoredisplay != null ) {
			if ( jquery.css( elem, "float" ) === "none" ) {

				// restore the original display value at the end of pure show/hide animations
				if ( !proptween ) {
					anim.done( function() {
						style.display = restoredisplay;
					} );
					if ( restoredisplay == null ) {
						display = style.display;
						restoredisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowx = opts.overflow[ 1 ];
			style.overflowy = opts.overflow[ 2 ];
		} );
	}

	// implement show/hide animations
	proptween = false;
	for ( prop in orig ) {

		// general show/hide setup for this element animation
		if ( !proptween ) {
			if ( datashow ) {
				if ( "hidden" in datashow ) {
					hidden = datashow.hidden;
				}
			} else {
				datashow = datapriv.access( elem, "fxshow", { display: restoredisplay } );
			}

			// store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				datashow.hidden = !hidden;
			}

			// show elements before animating them
			if ( hidden ) {
				showhide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

				/* eslint-enable no-loop-func */

				// the final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showhide( [ elem ] );
				}
				datapriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jquery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// per-property setup
		proptween = createtween( hidden ? datashow[ prop ] : 0, prop, anim );
		if ( !( prop in datashow ) ) {
			datashow[ prop ] = proptween.start;
			if ( hidden ) {
				proptween.end = proptween.start;
				proptween.start = 0;
			}
		}
	}
}

function propfilter( props, specialeasing ) {
	var index, name, easing, value, hooks;

	// camelcase, specialeasing and expand csshook pass
	for ( index in props ) {
		name = camelcase( index );
		easing = specialeasing[ name ];
		value = props[ index ];
		if ( array.isarray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jquery.csshooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this won't overwrite existing keys.
			// reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialeasing[ index ] = easing;
				}
			}
		} else {
			specialeasing[ name ] = easing;
		}
	}
}

function animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animation.prefilters.length,
		deferred = jquery.deferred().always( function() {

			// don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currenttime = fxnow || createfxnow(),
				remaining = math.max( 0, animation.starttime + animation.duration - currenttime ),

				// support: android 2.3 only
				// archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (trac-12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifywith( elem, [ animation, percent, remaining ] );

			// if there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// if this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifywith( elem, [ animation, 1, 0 ] );
			}

			// resolve the animation and report its conclusion
			deferred.resolvewith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jquery.extend( {}, properties ),
			opts: jquery.extend( true, {
				specialeasing: {},
				easing: jquery.easing._default
			}, options ),
			originalproperties: properties,
			originaloptions: options,
			starttime: fxnow || createfxnow(),
			duration: options.duration,
			tweens: [],
			createtween: function( prop, end ) {
				var tween = jquery.tween( elem, animation.opts, prop, end,
					animation.opts.specialeasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoend ) {
				var index = 0,

					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoend ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame; otherwise, reject
				if ( gotoend ) {
					deferred.notifywith( elem, [ animation, 1, 0 ] );
					deferred.resolvewith( elem, [ animation, gotoend ] );
				} else {
					deferred.rejectwith( elem, [ animation, gotoend ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propfilter( props, animation.opts.specialeasing );

	for ( ; index < length; index++ ) {
		result = animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isfunction( result.stop ) ) {
				jquery._queuehooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jquery.map( props, createtween, animation );

	if ( isfunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jquery.fx.timer(
		jquery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jquery.animation = jquery.extend( animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createtween( prop, value );
			adjustcss( tween.elem, prop, rcssnum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isfunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			animation.tweeners[ prop ] = animation.tweeners[ prop ] || [];
			animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultprefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animation.prefilters.unshift( callback );
		} else {
			animation.prefilters.push( callback );
		}
	}
} );

jquery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jquery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isfunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isfunction( easing ) && easing
	};

	// go to the end state if fx are off
	if ( jquery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jquery.fx.speeds ) {
				opt.duration = jquery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jquery.fx.speeds._default;
			}
		}
	}

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isfunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jquery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jquery.fn.extend( {
	fadeto: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( ishiddenwithintree ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jquery.isemptyobject( prop ),
			optall = jquery.speed( speed, easing, callback ),
			doanimation = function() {

				// operate on a copy of prop so per-property easing won't be lost
				var anim = animation( this, jquery.extend( {}, prop ), optall );

				// empty animations, or finishing resolves immediately
				if ( empty || datapriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};

		doanimation.finish = doanimation;

		return empty || optall.queue === false ?
			this.each( doanimation ) :
			this.queue( optall.queue, doanimation );
	},
	stop: function( type, clearqueue, gotoend ) {
		var stopqueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoend );
		};

		if ( typeof type !== "string" ) {
			gotoend = clearqueue;
			clearqueue = type;
			type = undefined;
		}
		if ( clearqueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queuehooks",
				timers = jquery.timers,
				data = datapriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopqueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopqueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoend );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced.
			// timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoend.
			if ( dequeue || !gotoend ) {
				jquery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = datapriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queuehooks" ],
				timers = jquery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jquery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		} );
	}
} );

jquery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssfn = jquery.fn[ name ];
	jquery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssfn.apply( this, arguments ) :
			this.animate( genfx( name, true ), speed, easing, callback );
	};
} );

// generate shortcuts for custom animations
jquery.each( {
	slidedown: genfx( "show" ),
	slideup: genfx( "hide" ),
	slidetoggle: genfx( "toggle" ),
	fadein: { opacity: "show" },
	fadeout: { opacity: "hide" },
	fadetoggle: { opacity: "toggle" }
}, function( name, props ) {
	jquery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jquery.timers = [];
jquery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jquery.timers;

	fxnow = date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jquery.fx.stop();
	}
	fxnow = undefined;
};

jquery.fx.timer = function( timer ) {
	jquery.timers.push( timer );
	jquery.fx.start();
};

jquery.fx.interval = 13;
jquery.fx.start = function() {
	if ( inprogress ) {
		return;
	}

	inprogress = true;
	schedule();
};

jquery.fx.stop = function() {
	inprogress = null;
};

jquery.fx.speeds = {
	slow: 600,
	fast: 200,

	// default speed
	_default: 400
};


// based off of the plugin by clint helfers, with permission.
jquery.fn.delay = function( time, type ) {
	time = jquery.fx ? jquery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.settimeout( next, time );
		hooks.stop = function() {
			window.cleartimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createelement( "input" ),
		select = document.createelement( "select" ),
		opt = select.appendchild( document.createelement( "option" ) );

	input.type = "checkbox";

	// support: android <=4.3 only
	// default value for a checkbox should be "on"
	support.checkon = input.value !== "";

	// support: ie <=11 only
	// must access selectedindex to make default options select
	support.optselected = opt.selected;

	// support: ie <=11 only
	// an input loses its value after becoming a radio
	input = document.createelement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radiovalue = input.value === "t";
} )();


var boolhook,
	attrhandle = jquery.expr.attrhandle;

jquery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jquery.attr, name, value, arguments.length > 1 );
	},

	removeattr: function( name ) {
		return this.each( function() {
			jquery.removeattr( this, name );
		} );
	}
} );

jquery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			ntype = elem.nodetype;

		// don't get/set attributes on text, comment and attribute nodes
		if ( ntype === 3 || ntype === 8 || ntype === 2 ) {
			return;
		}

		// fallback to prop when attributes are not supported
		if ( typeof elem.getattribute === "undefined" ) {
			return jquery.prop( elem, name, value );
		}

		// attribute hooks are determined by the lowercase version
		// grab necessary hook if one is defined
		if ( ntype !== 1 || !jquery.isxmldoc( elem ) ) {
			hooks = jquery.attrhooks[ name.tolowercase() ] ||
				( jquery.expr.match.bool.test( name ) ? boolhook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jquery.removeattr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setattribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jquery.find.attr( elem, name );

		// non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrhooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radiovalue && value === "radio" &&
					nodename( elem, "input" ) ) {
					var val = elem.value;
					elem.setattribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeattr: function( elem, value ) {
		var name,
			i = 0,

			// attribute names can contain non-html whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrnames = value && value.match( rnothtmlwhite );

		if ( attrnames && elem.nodetype === 1 ) {
			while ( ( name = attrnames[ i++ ] ) ) {
				elem.removeattribute( name );
			}
		}
	}
} );

// hooks for boolean attributes
boolhook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// remove boolean attributes when set to false
			jquery.removeattr( elem, name );
		} else {
			elem.setattribute( name, name );
		}
		return name;
	}
};

jquery.each( jquery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrhandle[ name ] || jquery.find.attr;

	attrhandle[ name ] = function( elem, name, isxml ) {
		var ret, handle,
			lowercasename = name.tolowercase();

		if ( !isxml ) {

			// avoid an infinite loop by temporarily removing this function from the getter
			handle = attrhandle[ lowercasename ];
			attrhandle[ lowercasename ] = ret;
			ret = getter( elem, name, isxml ) != null ?
				lowercasename :
				null;
			attrhandle[ lowercasename ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jquery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jquery.prop, name, value, arguments.length > 1 );
	},

	removeprop: function( name ) {
		return this.each( function() {
			delete this[ jquery.propfix[ name ] || name ];
		} );
	}
} );

jquery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			ntype = elem.nodetype;

		// don't get/set properties on text, comment and attribute nodes
		if ( ntype === 3 || ntype === 8 || ntype === 2 ) {
			return;
		}

		if ( ntype !== 1 || !jquery.isxmldoc( elem ) ) {

			// fix name and attach hooks
			name = jquery.propfix[ name ] || name;
			hooks = jquery.prophooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	prophooks: {
		tabindex: {
			get: function( elem ) {

				// support: ie <=9 - 11 only
				// elem.tabindex doesn't always return the
				// correct value when it hasn't been explicitly set
				// use proper attribute retrieval (trac-12072)
				var tabindex = jquery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseint( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodename ) ||
					rclickable.test( elem.nodename ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propfix: {
		"for": "htmlfor",
		"class": "classname"
	}
} );

// support: ie <=11 only
// accessing the selectedindex property
// forces the browser to respect setting selected
// on the option
// the getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optselected ) {
	jquery.prophooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentnode;
			if ( parent && parent.parentnode ) {
				parent.parentnode.selectedindex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentnode;
			if ( parent ) {
				parent.selectedindex;

				if ( parent.parentnode ) {
					parent.parentnode.selectedindex;
				}
			}
		}
	};
}

jquery.each( [
	"tabindex",
	"readonly",
	"maxlength",
	"cellspacing",
	"cellpadding",
	"rowspan",
	"colspan",
	"usemap",
	"frameborder",
	"contenteditable"
], function() {
	jquery.propfix[ this.tolowercase() ] = this;
} );




	// strip and collapse whitespace according to html spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripandcollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getclass( elem ) {
	return elem.getattribute && elem.getattribute( "class" ) || "";
}

function classestoarray( value ) {
	if ( array.isarray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jquery.fn.extend( {
	addclass: function( value ) {
		var classnames, cur, curvalue, classname, i, finalvalue;

		if ( isfunction( value ) ) {
			return this.each( function( j ) {
				jquery( this ).addclass( value.call( this, j, getclass( this ) ) );
			} );
		}

		classnames = classestoarray( value );

		if ( classnames.length ) {
			return this.each( function() {
				curvalue = getclass( this );
				cur = this.nodetype === 1 && ( " " + stripandcollapse( curvalue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classnames.length; i++ ) {
						classname = classnames[ i ];
						if ( cur.indexof( " " + classname + " " ) < 0 ) {
							cur += classname + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalvalue = stripandcollapse( cur );
					if ( curvalue !== finalvalue ) {
						this.setattribute( "class", finalvalue );
					}
				}
			} );
		}

		return this;
	},

	removeclass: function( value ) {
		var classnames, cur, curvalue, classname, i, finalvalue;

		if ( isfunction( value ) ) {
			return this.each( function( j ) {
				jquery( this ).removeclass( value.call( this, j, getclass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classnames = classestoarray( value );

		if ( classnames.length ) {
			return this.each( function() {
				curvalue = getclass( this );

				// this expression is here for better compressibility (see addclass)
				cur = this.nodetype === 1 && ( " " + stripandcollapse( curvalue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classnames.length; i++ ) {
						classname = classnames[ i ];

						// remove *all* instances
						while ( cur.indexof( " " + classname + " " ) > -1 ) {
							cur = cur.replace( " " + classname + " ", " " );
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalvalue = stripandcollapse( cur );
					if ( curvalue !== finalvalue ) {
						this.setattribute( "class", finalvalue );
					}
				}
			} );
		}

		return this;
	},

	toggleclass: function( value, stateval ) {
		var classnames, classname, i, self,
			type = typeof value,
			isvalidvalue = type === "string" || array.isarray( value );

		if ( isfunction( value ) ) {
			return this.each( function( i ) {
				jquery( this ).toggleclass(
					value.call( this, i, getclass( this ), stateval ),
					stateval
				);
			} );
		}

		if ( typeof stateval === "boolean" && isvalidvalue ) {
			return stateval ? this.addclass( value ) : this.removeclass( value );
		}

		classnames = classestoarray( value );

		return this.each( function() {
			if ( isvalidvalue ) {

				// toggle individual class names
				self = jquery( this );

				for ( i = 0; i < classnames.length; i++ ) {
					classname = classnames[ i ];

					// check each classname given, space separated list
					if ( self.hasclass( classname ) ) {
						self.removeclass( classname );
					} else {
						self.addclass( classname );
					}
				}

			// toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				classname = getclass( this );
				if ( classname ) {

					// store classname if set
					datapriv.set( this, "__classname__", classname );
				}

				// if the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setattribute ) {
					this.setattribute( "class",
						classname || value === false ?
							"" :
							datapriv.get( this, "__classname__" ) || ""
					);
				}
			}
		} );
	},

	hasclass: function( selector ) {
		var classname, elem,
			i = 0;

		classname = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodetype === 1 &&
				( " " + stripandcollapse( getclass( elem ) ) + " " ).indexof( classname ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jquery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueisfunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jquery.valhooks[ elem.type ] ||
					jquery.valhooks[ elem.nodename.tolowercase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueisfunction = isfunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodetype !== 1 ) {
				return;
			}

			if ( valueisfunction ) {
				val = value.call( this, i, jquery( this ).val() );
			} else {
				val = value;
			}

			// treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( array.isarray( val ) ) {
				val = jquery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jquery.valhooks[ this.type ] || jquery.valhooks[ this.nodename.tolowercase() ];

			// if set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jquery.extend( {
	valhooks: {
		option: {
			get: function( elem ) {

				var val = jquery.find.attr( elem, "value" );
				return val != null ?
					val :

					// support: ie <=10 - 11 only
					// option.text throws exceptions (trac-14686, trac-14858)
					// strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripandcollapse( jquery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedindex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// support: ie <=9 only
					// ie8-9 doesn't update selected after form reset (trac-2551)
					if ( ( option.selected || i === index ) &&

							// don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentnode.disabled ||
								!nodename( option.parentnode, "optgroup" ) ) ) {

						// get the specific value for the option
						value = jquery( option ).val();

						// we don't need an array for one selects
						if ( one ) {
							return value;
						}

						// multi-selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionset, option,
					options = elem.options,
					values = jquery.makearray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jquery.inarray( jquery.valhooks.option.get( option ), values ) > -1
					) {
						optionset = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionset ) {
					elem.selectedindex = -1;
				}
				return values;
			}
		}
	}
} );

// radios and checkboxes getter/setter
jquery.each( [ "radio", "checkbox" ], function() {
	jquery.valhooks[ this ] = {
		set: function( elem, value ) {
			if ( array.isarray( value ) ) {
				return ( elem.checked = jquery.inarray( jquery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkon ) {
		jquery.valhooks[ this ].get = function( elem ) {
			return elem.getattribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// return jquery for attributes-only inclusion
var location = window.location;

var nonce = { guid: date.now() };

var rquery = ( /\?/ );



// cross-browser xml parsing
jquery.parsexml = function( data ) {
	var xml, parsererrorelem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// support: ie 9 - 11 only
	// ie throws on parsefromstring with invalid input.
	try {
		xml = ( new window.domparser() ).parsefromstring( data, "text/xml" );
	} catch ( e ) {}

	parsererrorelem = xml && xml.getelementsbytagname( "parsererror" )[ 0 ];
	if ( !xml || parsererrorelem ) {
		jquery.error( "invalid xml: " + (
			parsererrorelem ?
				jquery.map( parsererrorelem.childnodes, function( el ) {
					return el.textcontent;
				} ).join( "\n" ) :
				data
		) );
	}
	return xml;
};


var rfocusmorph = /^(?:focusinfocus|focusoutblur)$/,
	stoppropagationcallback = function( e ) {
		e.stoppropagation();
	};

jquery.extend( jquery.event, {

	trigger: function( event, data, elem, onlyhandlers ) {

		var i, cur, tmp, bubbletype, ontype, handle, special, lastelement,
			eventpath = [ elem || document ],
			type = hasown.call( event, "type" ) ? event.type : event,
			namespaces = hasown.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastelement = tmp = elem = elem || document;

		// don't do events on text and comment nodes
		if ( elem.nodetype === 3 || elem.nodetype === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusmorph.test( type + jquery.event.triggered ) ) {
			return;
		}

		if ( type.indexof( "." ) > -1 ) {

			// namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexof( ":" ) < 0 && "on" + type;

		// caller can pass in a jquery.event object, object, or just an event type string
		event = event[ jquery.expando ] ?
			event :
			new jquery.event( type, typeof event === "object" && event );

		// trigger bitmask: & 1 for native handlers; & 2 for jquery (always true)
		event.istrigger = onlyhandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new regexp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jquery.makearray( data, [ event ] );

		// allow special events to draw outside the lines
		special = jquery.event.special[ type ] || {};
		if ( !onlyhandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// determine event propagation path in advance, per w3c events spec (trac-9951)
		// bubble up to document, then to window; watch for a global ownerdocument var (trac-9724)
		if ( !onlyhandlers && !special.nobubble && !iswindow( elem ) ) {

			bubbletype = special.delegatetype || type;
			if ( !rfocusmorph.test( bubbletype + type ) ) {
				cur = cur.parentnode;
			}
			for ( ; cur; cur = cur.parentnode ) {
				eventpath.push( cur );
				tmp = cur;
			}

			// only add window if we got to document (e.g., not plain obj or detached dom)
			if ( tmp === ( elem.ownerdocument || document ) ) {
				eventpath.push( tmp.defaultview || tmp.parentwindow || window );
			}
		}

		// fire handlers on the event path
		i = 0;
		while ( ( cur = eventpath[ i++ ] ) && !event.ispropagationstopped() ) {
			lastelement = cur;
			event.type = i > 1 ?
				bubbletype :
				special.bindtype || type;

			// jquery handler
			handle = ( datapriv.get( cur, "events" ) || object.create( null ) )[ event.type ] &&
				datapriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptdata( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventdefault();
				}
			}
		}
		event.type = type;

		// if nobody prevented the default action, do it now
		if ( !onlyhandlers && !event.isdefaultprevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventpath.pop(), data ) === false ) &&
				acceptdata( elem ) ) {

				// call a native dom method on the target with the same name as the event.
				// don't do default actions on window, that's where global variables be (trac-6170)
				if ( ontype && isfunction( elem[ type ] ) && !iswindow( elem ) ) {

					// don't re-trigger an onfoo event when we call its foo() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// prevent re-triggering of the same event, since we already bubbled it above
					jquery.event.triggered = type;

					if ( event.ispropagationstopped() ) {
						lastelement.addeventlistener( type, stoppropagationcallback );
					}

					elem[ type ]();

					if ( event.ispropagationstopped() ) {
						lastelement.removeeventlistener( type, stoppropagationcallback );
					}

					jquery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// piggyback on a donor event to simulate a different one
	// used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jquery.extend(
			new jquery.event(),
			event,
			{
				type: type,
				issimulated: true
			}
		);

		jquery.event.trigger( e, null, elem );
	}

} );

jquery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jquery.event.trigger( type, data, this );
		} );
	},
	triggerhandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jquery.event.trigger( type, data, elem, true );
		}
	}
} );


var
	rbracket = /\[\]$/,
	rcrlf = /\r?\n/g,
	rsubmittertypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildparams( prefix, obj, traditional, add ) {
	var name;

	if ( array.isarray( obj ) ) {

		// serialize array item.
		jquery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// treat each array item as a scalar.
				add( prefix, v );

			} else {

				// item is non-scalar (array or object), encode its numeric index.
				buildparams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && totype( obj ) === "object" ) {

		// serialize object item.
		for ( name in obj ) {
			buildparams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// serialize scalar item.
		add( prefix, obj );
	}
}

// serialize an array of form elements or a set of
// key/values into a query string
jquery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueorfunction ) {

			// if value is a function, invoke it and use its return value
			var value = isfunction( valueorfunction ) ?
				valueorfunction() :
				valueorfunction;

			s[ s.length ] = encodeuricomponent( key ) + "=" +
				encodeuricomponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// if an array was passed in, assume that it is an array of form elements.
	if ( array.isarray( a ) || ( a.jquery && !jquery.isplainobject( a ) ) ) {

		// serialize the form elements
		jquery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// if traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildparams( prefix, a[ prefix ], traditional, add );
		}
	}

	// return the resulting serialization
	return s.join( "&" );
};

jquery.fn.extend( {
	serialize: function() {
		return jquery.param( this.serializearray() );
	},
	serializearray: function() {
		return this.map( function() {

			// can add prophook for "elements" to filter or add form elements
			var elements = jquery.prop( this, "elements" );
			return elements ? jquery.makearray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jquery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodename ) && !rsubmittertypes.test( type ) &&
				( this.checked || !rcheckabletype.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jquery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( array.isarray( val ) ) {
				return jquery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rcrlf, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rcrlf, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	ranticache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// trac-7653, trac-8125, trac-8152: local protocol detection
	rlocalprotocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnocontent = /^(?:get|head)$/,
	rprotocol = /^\/\//,

	/* prefilters
	 * 1) they are useful to introduce custom datatypes (see ajax/jsonp.js for an example)
	 * 2) these are called:
	 *    - before asking for a transport
	 *    - after param serialization (s.data is a string if s.processdata is true)
	 * 3) key is the datatype
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport datatype and then continue down to "*" if needed
	 */
	prefilters = {},

	/* transports bindings
	 * 1) key is the datatype
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport datatype and then go to "*" if needed
	 */
	transports = {},

	// avoid comment-prolog char sequence (trac-10098); must appease lint and evade compression
	alltypes = "*/".concat( "*" ),

	// anchor tag for parsing the document origin
	originanchor = document.createelement( "a" );

originanchor.href = location.href;

// base "constructor" for jquery.ajaxprefilter and jquery.ajaxtransport
function addtoprefiltersortransports( structure ) {

	// datatypeexpression is optional and defaults to "*"
	return function( datatypeexpression, func ) {

		if ( typeof datatypeexpression !== "string" ) {
			func = datatypeexpression;
			datatypeexpression = "*";
		}

		var datatype,
			i = 0,
			datatypes = datatypeexpression.tolowercase().match( rnothtmlwhite ) || [];

		if ( isfunction( func ) ) {

			// for each datatype in the datatypeexpression
			while ( ( datatype = datatypes[ i++ ] ) ) {

				// prepend if requested
				if ( datatype[ 0 ] === "+" ) {
					datatype = datatype.slice( 1 ) || "*";
					( structure[ datatype ] = structure[ datatype ] || [] ).unshift( func );

				// otherwise append
				} else {
					( structure[ datatype ] = structure[ datatype ] || [] ).push( func );
				}
			}
		}
	};
}

// base inspection function for prefilters and transports
function inspectprefiltersortransports( structure, options, originaloptions, jqxhr ) {

	var inspected = {},
		seekingtransport = ( structure === transports );

	function inspect( datatype ) {
		var selected;
		inspected[ datatype ] = true;
		jquery.each( structure[ datatype ] || [], function( _, prefilterorfactory ) {
			var datatypeortransport = prefilterorfactory( options, originaloptions, jqxhr );
			if ( typeof datatypeortransport === "string" &&
				!seekingtransport && !inspected[ datatypeortransport ] ) {

				options.datatypes.unshift( datatypeortransport );
				inspect( datatypeortransport );
				return false;
			} else if ( seekingtransport ) {
				return !( selected = datatypeortransport );
			}
		} );
		return selected;
	}

	return inspect( options.datatypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// a special extend for ajax options
// that takes "flat" options (not to be deep extended)
// fixes trac-9887
function ajaxextend( target, src ) {
	var key, deep,
		flatoptions = jquery.ajaxsettings.flatoptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatoptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jquery.extend( true, target, deep );
	}

	return target;
}

/* handles responses to an ajax request:
 * - finds the right datatype (mediates between content-type and expected datatype)
 * - returns the corresponding response
 */
function ajaxhandleresponses( s, jqxhr, responses ) {

	var ct, type, finaldatatype, firstdatatype,
		contents = s.contents,
		datatypes = s.datatypes;

	// remove auto datatype and get content-type in the process
	while ( datatypes[ 0 ] === "*" ) {
		datatypes.shift();
		if ( ct === undefined ) {
			ct = s.mimetype || jqxhr.getresponseheader( "content-type" );
		}
	}

	// check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				datatypes.unshift( type );
				break;
			}
		}
	}

	// check to see if we have a response for the expected datatype
	if ( datatypes[ 0 ] in responses ) {
		finaldatatype = datatypes[ 0 ];
	} else {

		// try convertible datatypes
		for ( type in responses ) {
			if ( !datatypes[ 0 ] || s.converters[ type + " " + datatypes[ 0 ] ] ) {
				finaldatatype = type;
				break;
			}
			if ( !firstdatatype ) {
				firstdatatype = type;
			}
		}

		// or just use first one
		finaldatatype = finaldatatype || firstdatatype;
	}

	// if we found a datatype
	// we add the datatype to the list if needed
	// and return the corresponding response
	if ( finaldatatype ) {
		if ( finaldatatype !== datatypes[ 0 ] ) {
			datatypes.unshift( finaldatatype );
		}
		return responses[ finaldatatype ];
	}
}

/* chain conversions given the request and the original response
 * also sets the responsexxx fields on the jqxhr instance
 */
function ajaxconvert( s, response, jqxhr, issuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// work with a copy of datatypes in case we need to modify it for conversion
		datatypes = s.datatypes.slice();

	// create converters map with lowercased keys
	if ( datatypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.tolowercase() ] = s.converters[ conv ];
		}
	}

	current = datatypes.shift();

	// convert to each sequential datatype
	while ( current ) {

		if ( s.responsefields[ current ] ) {
			jqxhr[ s.responsefields[ current ] ] = response;
		}

		// apply the datafilter if provided
		if ( !prev && issuccess && s.datafilter ) {
			response = s.datafilter( response, s.datatype );
		}

		prev = current;
		current = datatypes.shift();

		if ( current ) {

			// there's only work to do if current datatype is non-auto
			if ( current === "*" ) {

				current = prev;

			// convert response if prev datatype is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// if none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// if conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// if prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// otherwise, insert the intermediate datatype
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									datatypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// apply converter (if not an equivalence)
				if ( conv !== true ) {

					// unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "no conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jquery.extend( {

	// counter for holding the number of active queries
	active: 0,

	// last-modified header cache for next request
	lastmodified: {},
	etag: {},

	ajaxsettings: {
		url: location.href,
		type: "get",
		islocal: rlocalprotocol.test( location.protocol ),
		global: true,
		processdata: true,
		async: true,
		contenttype: "application/x-www-form-urlencoded; charset=utf-8",

		/*
		timeout: 0,
		data: null,
		datatype: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": alltypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responsefields: {
			xml: "responsexml",
			text: "responsetext",
			json: "responsejson"
		},

		// data converters
		// keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// convert anything to text
			"* text": string,

			// text to html (true = no transformation)
			"text html": true,

			// evaluate text as a json expression
			"text json": json.parse,

			// parse text as xml
			"text xml": jquery.parsexml
		},

		// for options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxextend)
		flatoptions: {
			url: true,
			context: true
		}
	},

	// creates a full fledged settings object into target
	// with both ajaxsettings and settings fields.
	// if target is omitted, writes into ajaxsettings.
	ajaxsetup: function( target, settings ) {
		return settings ?

			// building a settings object
			ajaxextend( ajaxextend( target, jquery.ajaxsettings ), settings ) :

			// extending ajaxsettings
			ajaxextend( jquery.ajaxsettings, target );
	},

	ajaxprefilter: addtoprefiltersortransports( prefilters ),
	ajaxtransport: addtoprefiltersortransports( transports ),

	// main method
	ajax: function( url, options ) {

		// if url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// force options to be an object
		options = options || {};

		var transport,

			// url without anti-cache param
			cacheurl,

			// response headers
			responseheadersstring,
			responseheaders,

			// timeout handle
			timeouttimer,

			// url cleanup var
			urlanchor,

			// request state (becomes false upon send and true upon completion)
			completed,

			// to know if global events are to be dispatched
			fireglobals,

			// loop variable
			i,

			// uncached part of the url
			uncached,

			// create the final options object
			s = jquery.ajaxsetup( {}, options ),

			// callbacks context
			callbackcontext = s.context || s,

			// context for global events is callbackcontext if it is a dom node or jquery collection
			globaleventcontext = s.context &&
				( callbackcontext.nodetype || callbackcontext.jquery ) ?
				jquery( callbackcontext ) :
				jquery.event,

			// deferreds
			deferred = jquery.deferred(),
			completedeferred = jquery.callbacks( "once memory" ),

			// status-dependent callbacks
			statuscode = s.statuscode || {},

			// headers (they are sent all at once)
			requestheaders = {},
			requestheadersnames = {},

			// default abort message
			strabort = "canceled",

			// fake xhr
			jqxhr = {
				readystate: 0,

				// builds headers hashtable if needed
				getresponseheader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseheaders ) {
							responseheaders = {};
							while ( ( match = rheaders.exec( responseheadersstring ) ) ) {
								responseheaders[ match[ 1 ].tolowercase() + " " ] =
									( responseheaders[ match[ 1 ].tolowercase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseheaders[ key.tolowercase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// raw string
				getallresponseheaders: function() {
					return completed ? responseheadersstring : null;
				},

				// caches the header
				setrequestheader: function( name, value ) {
					if ( completed == null ) {
						name = requestheadersnames[ name.tolowercase() ] =
							requestheadersnames[ name.tolowercase() ] || name;
						requestheaders[ name ] = value;
					}
					return this;
				},

				// overrides response content-type header
				overridemimetype: function( type ) {
					if ( completed == null ) {
						s.mimetype = type;
					}
					return this;
				},

				// status-dependent callbacks
				statuscode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// execute the appropriate callbacks
							jqxhr.always( map[ jqxhr.status ] );
						} else {

							// lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statuscode[ code ] = [ statuscode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// cancel the request
				abort: function( statustext ) {
					var finaltext = statustext || strabort;
					if ( transport ) {
						transport.abort( finaltext );
					}
					done( 0, finaltext );
					return this;
				}
			};

		// attach deferreds
		deferred.promise( jqxhr );

		// add protocol if not provided (prefilters might expect it)
		// handle falsy url in the settings object (trac-10093: consistency with old signature)
		// we also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// alias method option to type as per ticket trac-12004
		s.type = options.method || options.type || s.method || s.type;

		// extract datatypes list
		s.datatypes = ( s.datatype || "*" ).tolowercase().match( rnothtmlwhite ) || [ "" ];

		// a cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossdomain == null ) {
			urlanchor = document.createelement( "a" );

			// support: ie <=8 - 11, edge 12 - 15
			// ie throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlanchor.href = s.url;

				// support: ie <=8 - 11 only
				// anchor's host property isn't correctly set when s.url is relative
				urlanchor.href = urlanchor.href;
				s.crossdomain = originanchor.protocol + "//" + originanchor.host !==
					urlanchor.protocol + "//" + urlanchor.host;
			} catch ( e ) {

				// if there is an error parsing the url, assume it is crossdomain,
				// it can be rejected by the transport if it is invalid
				s.crossdomain = true;
			}
		}

		// convert data if not already a string
		if ( s.data && s.processdata && typeof s.data !== "string" ) {
			s.data = jquery.param( s.data, s.traditional );
		}

		// apply prefilters
		inspectprefiltersortransports( prefilters, s, options, jqxhr );

		// if request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqxhr;
		}

		// we can fire global events as of now if asked to
		// don't fire events if jquery.event is undefined in an amd-usage scenario (trac-15118)
		fireglobals = jquery.event && s.global;

		// watch for a new set of requests
		if ( fireglobals && jquery.active++ === 0 ) {
			jquery.event.trigger( "ajaxstart" );
		}

		// uppercase the type
		s.type = s.type.touppercase();

		// determine if request has content
		s.hascontent = !rnocontent.test( s.type );

		// save the url in case we're toying with the if-modified-since
		// and/or if-none-match header later on
		// remove hash to simplify url manipulation
		cacheurl = s.url.replace( rhash, "" );

		// more options handling for requests with no content
		if ( !s.hascontent ) {

			// remember the hash so we can put it back
			uncached = s.url.slice( cacheurl.length );

			// if data is available and should be processed, append data to url
			if ( s.data && ( s.processdata || typeof s.data === "string" ) ) {
				cacheurl += ( rquery.test( cacheurl ) ? "&" : "?" ) + s.data;

				// trac-9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheurl = cacheurl.replace( ranticache, "$1" );
				uncached = ( rquery.test( cacheurl ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// put hash and anti-cache on the url that will be requested (gh-1732)
			s.url = cacheurl + uncached;

		// change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processdata &&
			( s.contenttype || "" ).indexof( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// set the if-modified-since and/or if-none-match header, if in ifmodified mode.
		if ( s.ifmodified ) {
			if ( jquery.lastmodified[ cacheurl ] ) {
				jqxhr.setrequestheader( "if-modified-since", jquery.lastmodified[ cacheurl ] );
			}
			if ( jquery.etag[ cacheurl ] ) {
				jqxhr.setrequestheader( "if-none-match", jquery.etag[ cacheurl ] );
			}
		}

		// set the correct header, if data is being sent
		if ( s.data && s.hascontent && s.contenttype !== false || options.contenttype ) {
			jqxhr.setrequestheader( "content-type", s.contenttype );
		}

		// set the accepts header for the server, depending on the datatype
		jqxhr.setrequestheader(
			"accept",
			s.datatypes[ 0 ] && s.accepts[ s.datatypes[ 0 ] ] ?
				s.accepts[ s.datatypes[ 0 ] ] +
					( s.datatypes[ 0 ] !== "*" ? ", " + alltypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// check for headers option
		for ( i in s.headers ) {
			jqxhr.setrequestheader( i, s.headers[ i ] );
		}

		// allow custom headers/mimetypes and early abort
		if ( s.beforesend &&
			( s.beforesend.call( callbackcontext, jqxhr, s ) === false || completed ) ) {

			// abort if not done already and return
			return jqxhr.abort();
		}

		// aborting is no longer a cancellation
		strabort = "abort";

		// install callbacks on deferreds
		completedeferred.add( s.complete );
		jqxhr.done( s.success );
		jqxhr.fail( s.error );

		// get transport
		transport = inspectprefiltersortransports( transports, s, options, jqxhr );

		// if no transport, we auto-abort
		if ( !transport ) {
			done( -1, "no transport" );
		} else {
			jqxhr.readystate = 1;

			// send global event
			if ( fireglobals ) {
				globaleventcontext.trigger( "ajaxsend", [ jqxhr, s ] );
			}

			// if request was aborted inside ajaxsend, stop there
			if ( completed ) {
				return jqxhr;
			}

			// timeout
			if ( s.async && s.timeout > 0 ) {
				timeouttimer = window.settimeout( function() {
					jqxhr.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestheaders, done );
			} catch ( e ) {

				// rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// propagate others as results
				done( -1, e );
			}
		}

		// callback for when everything is done
		function done( status, nativestatustext, responses, headers ) {
			var issuccess, success, error, response, modified,
				statustext = nativestatustext;

			// ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// clear timeout if it exists
			if ( timeouttimer ) {
				window.cleartimeout( timeouttimer );
			}

			// dereference transport for early garbage collection
			// (no matter how long the jqxhr object will be used)
			transport = undefined;

			// cache response headers
			responseheadersstring = headers || "";

			// set readystate
			jqxhr.readystate = status > 0 ? 4 : 0;

			// determine if successful
			issuccess = status >= 200 && status < 300 || status === 304;

			// get response data
			if ( responses ) {
				response = ajaxhandleresponses( s, jqxhr, responses );
			}

			// use a noop converter for missing script but not if jsonp
			if ( !issuccess &&
				jquery.inarray( "script", s.datatypes ) > -1 &&
				jquery.inarray( "json", s.datatypes ) < 0 ) {
				s.converters[ "text script" ] = function() {};
			}

			// convert no matter what (that way responsexxx fields are always set)
			response = ajaxconvert( s, response, jqxhr, issuccess );

			// if successful, handle type chaining
			if ( issuccess ) {

				// set the if-modified-since and/or if-none-match header, if in ifmodified mode.
				if ( s.ifmodified ) {
					modified = jqxhr.getresponseheader( "last-modified" );
					if ( modified ) {
						jquery.lastmodified[ cacheurl ] = modified;
					}
					modified = jqxhr.getresponseheader( "etag" );
					if ( modified ) {
						jquery.etag[ cacheurl ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "head" ) {
					statustext = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statustext = "notmodified";

				// if we have data, let's convert it
				} else {
					statustext = response.state;
					success = response.data;
					error = response.error;
					issuccess = !error;
				}
			} else {

				// extract error from statustext and normalize for non-aborts
				error = statustext;
				if ( status || !statustext ) {
					statustext = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// set data for the fake xhr object
			jqxhr.status = status;
			jqxhr.statustext = ( nativestatustext || statustext ) + "";

			// success/error
			if ( issuccess ) {
				deferred.resolvewith( callbackcontext, [ success, statustext, jqxhr ] );
			} else {
				deferred.rejectwith( callbackcontext, [ jqxhr, statustext, error ] );
			}

			// status-dependent callbacks
			jqxhr.statuscode( statuscode );
			statuscode = undefined;

			if ( fireglobals ) {
				globaleventcontext.trigger( issuccess ? "ajaxsuccess" : "ajaxerror",
					[ jqxhr, s, issuccess ? success : error ] );
			}

			// complete
			completedeferred.firewith( callbackcontext, [ jqxhr, statustext ] );

			if ( fireglobals ) {
				globaleventcontext.trigger( "ajaxcomplete", [ jqxhr, s ] );

				// handle the global ajax counter
				if ( !( --jquery.active ) ) {
					jquery.event.trigger( "ajaxstop" );
				}
			}
		}

		return jqxhr;
	},

	getjson: function( url, data, callback ) {
		return jquery.get( url, data, callback, "json" );
	},

	getscript: function( url, callback ) {
		return jquery.get( url, undefined, callback, "script" );
	}
} );

jquery.each( [ "get", "post" ], function( _i, method ) {
	jquery[ method ] = function( url, data, callback, type ) {

		// shift arguments if data argument was omitted
		if ( isfunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// the url can be an options object (which then must have .url)
		return jquery.ajax( jquery.extend( {
			url: url,
			type: method,
			datatype: type,
			data: data,
			success: callback
		}, jquery.isplainobject( url ) && url ) );
	};
} );

jquery.ajaxprefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.tolowercase() === "content-type" ) {
			s.contenttype = s.headers[ i ] || "";
		}
	}
} );


jquery._evalurl = function( url, options, doc ) {
	return jquery.ajax( {
		url: url,

		// make this explicit, since user can override this through ajaxsetup (trac-11264)
		type: "get",
		datatype: "script",
		cache: true,
		async: false,
		global: false,

		// only evaluate the response if it is successful (gh-4126)
		// datafilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		datafilter: function( response ) {
			jquery.globaleval( response, options, doc );
		}
	} );
};


jquery.fn.extend( {
	wrapall: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isfunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// the elements to wrap the target around
			wrap = jquery( html, this[ 0 ].ownerdocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentnode ) {
				wrap.insertbefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstelementchild ) {
					elem = elem.firstelementchild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapinner: function( html ) {
		if ( isfunction( html ) ) {
			return this.each( function( i ) {
				jquery( this ).wrapinner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jquery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapall( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlisfunction = isfunction( html );

		return this.each( function( i ) {
			jquery( this ).wrapall( htmlisfunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jquery( this ).replacewith( this.childnodes );
		} );
		return this;
	}
} );


jquery.expr.pseudos.hidden = function( elem ) {
	return !jquery.expr.pseudos.visible( elem );
};
jquery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetwidth || elem.offsetheight || elem.getclientrects().length );
};




jquery.ajaxsettings.xhr = function() {
	try {
		return new window.xmlhttprequest();
	} catch ( e ) {}
};

var xhrsuccessstatus = {

		// file protocol always yields status code 0, assume 200
		0: 200,

		// support: ie <=9 only
		// trac-1450: sometimes ie returns 1223 when it should be 204
		1223: 204
	},
	xhrsupported = jquery.ajaxsettings.xhr();

support.cors = !!xhrsupported && ( "withcredentials" in xhrsupported );
support.ajax = xhrsupported = !!xhrsupported;

jquery.ajaxtransport( function( options ) {
	var callback, errorcallback;

	// cross domain only allowed if supported through xmlhttprequest
	if ( support.cors || xhrsupported && !options.crossdomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// apply custom fields if provided
				if ( options.xhrfields ) {
					for ( i in options.xhrfields ) {
						xhr[ i ] = options.xhrfields[ i ];
					}
				}

				// override mime type if needed
				if ( options.mimetype && xhr.overridemimetype ) {
					xhr.overridemimetype( options.mimetype );
				}

				// x-requested-with header
				// for cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxsetup)
				// for same-domain requests, won't change header if already provided.
				if ( !options.crossdomain && !headers[ "x-requested-with" ] ) {
					headers[ "x-requested-with" ] = "xmlhttprequest";
				}

				// set headers
				for ( i in headers ) {
					xhr.setrequestheader( i, headers[ i ] );
				}

				// callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorcallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// support: ie <=9 only
								// on a manual native abort, ie9 throws
								// errors on any property access that is not readystate
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// file: protocol always yields status 0; see trac-8605, trac-14207
										xhr.status,
										xhr.statustext
									);
								}
							} else {
								complete(
									xhrsuccessstatus[ xhr.status ] || xhr.status,
									xhr.statustext,

									// support: ie <=9 only
									// ie9 has no xhr2 but throws on binary (trac-11426)
									// for xhr2 non-text, let the caller handle it (gh-2498)
									( xhr.responsetype || "text" ) !== "text"  ||
									typeof xhr.responsetext !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responsetext },
									xhr.getallresponseheaders()
								);
							}
						}
					};
				};

				// listen to events
				xhr.onload = callback();
				errorcallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// support: ie 9 only
				// use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorcallback;
				} else {
					xhr.onreadystatechange = function() {

						// check readystate before timeout as it changes
						if ( xhr.readystate === 4 ) {

							// allow onerror to be called first,
							// but that will not handle a native abort
							// also, save errorcallback to a variable
							// as xhr.onerror cannot be accessed
							window.settimeout( function() {
								if ( callback ) {
									errorcallback();
								}
							} );
						}
					};
				}

				// create the abort callback
				callback = callback( "abort" );

				try {

					// do send the request (this may raise an exception)
					xhr.send( options.hascontent && options.data || null );
				} catch ( e ) {

					// trac-14683: only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// prevent auto-execution of scripts when no explicit datatype was provided (see gh-2432)
jquery.ajaxprefilter( function( s ) {
	if ( s.crossdomain ) {
		s.contents.script = false;
	}
} );

// install script datatype
jquery.ajaxsetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jquery.globaleval( text );
			return text;
		}
	}
} );

// handle cache's special case and crossdomain
jquery.ajaxprefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossdomain ) {
		s.type = "get";
	}
} );

// bind script tag hack transport
jquery.ajaxtransport( "script", function( s ) {

	// this transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossdomain || s.scriptattrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jquery( "<script>" )
					.attr( s.scriptattrs || {} )
					.prop( { charset: s.scriptcharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// use native dom manipulation to avoid our dommanip ajax trickery
				document.head.appendchild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldcallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// default jsonp settings
jquery.ajaxsetup( {
	jsonp: "callback",
	jsonpcallback: function() {
		var callback = oldcallbacks.pop() || ( jquery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// detect, normalize options and install callbacks for jsonp requests
jquery.ajaxprefilter( "json jsonp", function( s, originalsettings, jqxhr ) {

	var callbackname, overwritten, responsecontainer,
		jsonprop = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contenttype || "" )
					.indexof( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonprop || s.datatypes[ 0 ] === "jsonp" ) {

		// get callback name, remembering preexisting value associated with it
		callbackname = s.jsonpcallback = isfunction( s.jsonpcallback ) ?
			s.jsonpcallback() :
			s.jsonpcallback;

		// insert callback into url or form data
		if ( jsonprop ) {
			s[ jsonprop ] = s[ jsonprop ].replace( rjsonp, "$1" + callbackname );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackname;
		}

		// use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responsecontainer ) {
				jquery.error( callbackname + " was not called" );
			}
			return responsecontainer[ 0 ];
		};

		// force json datatype
		s.datatypes[ 0 ] = "json";

		// install callback
		overwritten = window[ callbackname ];
		window[ callbackname ] = function() {
			responsecontainer = arguments;
		};

		// clean-up function (fires after converters)
		jqxhr.always( function() {

			// if previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jquery( window ).removeprop( callbackname );

			// otherwise restore preexisting value
			} else {
				window[ callbackname ] = overwritten;
			}

			// save back as free
			if ( s[ callbackname ] ) {

				// make sure that re-using the options doesn't screw things around
				s.jsonpcallback = originalsettings.jsonpcallback;

				// save the callback name for future use
				oldcallbacks.push( callbackname );
			}

			// call if it was a function and we have a response
			if ( responsecontainer && isfunction( overwritten ) ) {
				overwritten( responsecontainer[ 0 ] );
			}

			responsecontainer = overwritten = undefined;
		} );

		// delegate to script
		return "script";
	}
} );




// support: safari 8 only
// in safari 8 documents created via document.implementation.createhtmldocument
// collapse sibling forms: the second one becomes a child of the first one.
// because of that, this security measure has to be disabled in safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createhtmldocument = ( function() {
	var body = document.implementation.createhtmldocument( "" ).body;
	body.innerhtml = "<form></form><form></form>";
	return body.childnodes.length === 2;
} )();


// argument "data" should be string of html
// context (optional): if specified, the fragment will be created in this context,
// defaults to document
// keepscripts (optional): if true, will include scripts passed in the html string
jquery.parsehtml = function( data, context, keepscripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepscripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createhtmldocument ) {
			context = document.implementation.createhtmldocument( "" );

			// set the base href for the created document
			// so any parsed elements with urls
			// are based on the document's url (gh-2965)
			base = context.createelement( "base" );
			base.href = document.location.href;
			context.head.appendchild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingletag.exec( data );
	scripts = !keepscripts && [];

	// single tag
	if ( parsed ) {
		return [ context.createelement( parsed[ 1 ] ) ];
	}

	parsed = buildfragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jquery( scripts ).remove();
	}

	return jquery.merge( [], parsed.childnodes );
};


/**
 * load a url into a page
 */
jquery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexof( " " );

	if ( off > -1 ) {
		selector = stripandcollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// if it's a function
	if ( isfunction( params ) ) {

		// we assume that it's the callback
		callback = params;
		params = undefined;

	// otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "post";
	}

	// if we have elements to modify, make the request
	if ( self.length > 0 ) {
		jquery.ajax( {
			url: url,

			// if "type" variable is undefined, then "get" method will be used.
			// make value of this field explicit since
			// user can override it through ajaxsetup method
			type: type || "get",
			datatype: "html",
			data: params
		} ).done( function( responsetext ) {

			// save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// if a selector was specified, locate the right elements in a dummy div
				// exclude scripts to avoid ie 'permission denied' errors
				jquery( "<div>" ).append( jquery.parsehtml( responsetext ) ).find( selector ) :

				// otherwise use the full result
				responsetext );

		// if the request succeeds, this function gets "data", "status", "jqxhr"
		// but they are ignored because response was set above.
		// if it fails, this function gets "jqxhr", "status", "error"
		} ).always( callback && function( jqxhr, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqxhr.responsetext, status, jqxhr ] );
			} );
		} );
	}

	return this;
};




jquery.expr.pseudos.animated = function( elem ) {
	return jquery.grep( jquery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jquery.offset = {
	setoffset: function( elem, options, i ) {
		var curposition, curleft, curcsstop, curtop, curoffset, curcssleft, calculateposition,
			position = jquery.css( elem, "position" ),
			curelem = jquery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curoffset = curelem.offset();
		curcsstop = jquery.css( elem, "top" );
		curcssleft = jquery.css( elem, "left" );
		calculateposition = ( position === "absolute" || position === "fixed" ) &&
			( curcsstop + curcssleft ).indexof( "auto" ) > -1;

		// need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculateposition ) {
			curposition = curelem.position();
			curtop = curposition.top;
			curleft = curposition.left;

		} else {
			curtop = parsefloat( curcsstop ) || 0;
			curleft = parsefloat( curcssleft ) || 0;
		}

		if ( isfunction( options ) ) {

			// use jquery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jquery.extend( {}, curoffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curoffset.top ) + curtop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curoffset.left ) + curleft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curelem.css( props );
		}
	}
};

jquery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jquery.offset.setoffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// support: ie <=11 only
		// running getboundingclientrect on a
		// disconnected node in ie throws an error
		if ( !elem.getclientrects().length ) {
			return { top: 0, left: 0 };
		}

		// get document-relative position by adding viewport scroll to viewport-relative gbcr
		rect = elem.getboundingclientrect();
		win = elem.ownerdocument.defaultview;
		return {
			top: rect.top + win.pageyoffset,
			left: rect.left + win.pagexoffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// this corresponds to the behavior of css absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetparent, offset, doc,
			elem = this[ 0 ],
			parentoffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jquery.css( elem, "position" ) === "fixed" ) {

			// assume position:fixed implies availability of getboundingclientrect
			offset = elem.getboundingclientrect();

		} else {
			offset = this.offset();

			// account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerdocument;
			offsetparent = elem.offsetparent || doc.documentelement;
			while ( offsetparent &&
				( offsetparent === doc.body || offsetparent === doc.documentelement ) &&
				jquery.css( offsetparent, "position" ) === "static" ) {

				offsetparent = offsetparent.parentnode;
			}
			if ( offsetparent && offsetparent !== elem && offsetparent.nodetype === 1 ) {

				// incorporate borders into its offset, since they are outside its content origin
				parentoffset = jquery( offsetparent ).offset();
				parentoffset.top += jquery.css( offsetparent, "bordertopwidth", true );
				parentoffset.left += jquery.css( offsetparent, "borderleftwidth", true );
			}
		}

		// subtract parent offsets and element margins
		return {
			top: offset.top - parentoffset.top - jquery.css( elem, "margintop", true ),
			left: offset.left - parentoffset.left - jquery.css( elem, "marginleft", true )
		};
	},

	// this method will return documentelement in the following cases:
	// 1) for the element inside the iframe without offsetparent, this method will return
	//    documentelement of the parent window
	// 2) for the hidden or detached element
	// 3) for body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// this logic, however, is not guaranteed and can change at any point in the future
	offsetparent: function() {
		return this.map( function() {
			var offsetparent = this.offsetparent;

			while ( offsetparent && jquery.css( offsetparent, "position" ) === "static" ) {
				offsetparent = offsetparent.offsetparent;
			}

			return offsetparent || documentelement;
		} );
	}
} );

// create scrollleft and scrolltop methods
jquery.each( { scrollleft: "pagexoffset", scrolltop: "pageyoffset" }, function( method, prop ) {
	var top = "pageyoffset" === prop;

	jquery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// coalesce documents and windows
			var win;
			if ( iswindow( elem ) ) {
				win = elem;
			} else if ( elem.nodetype === 9 ) {
				win = elem.defaultview;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollto(
					!top ? val : win.pagexoffset,
					top ? val : win.pageyoffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// support: safari <=7 - 9.1, chrome <=37 - 49
// add the top/left csshooks using jquery.fn.position
// webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getcomputedstyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jquery.each( [ "top", "left" ], function( _i, prop ) {
	jquery.csshooks[ prop ] = addgethookif( support.pixelposition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curcss( elem, prop );

				// if curcss returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jquery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// create innerheight, innerwidth, height, width, outerheight and outerwidth methods
jquery.each( { height: "height", width: "width" }, function( name, type ) {
	jquery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultextra, funcname ) {

		// margin is only for outerheight, outerwidth
		jquery.fn[ funcname ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultextra || typeof margin !== "boolean" ),
				extra = defaultextra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( iswindow( elem ) ) {

					// $( window ).outerwidth/height return w/h including scrollbars (gh-1729)
					return funcname.indexof( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentelement[ "client" + name ];
				}

				// get document width or height
				if ( elem.nodetype === 9 ) {
					doc = elem.documentelement;

					// either scroll[width/height] or offset[width/height] or client[width/height],
					// whichever is greatest
					return math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// get width or height on the element, requesting but not forcing parsefloat
					jquery.css( elem, type, extra ) :

					// set width or height on the element
					jquery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jquery.each( [
	"ajaxstart",
	"ajaxstop",
	"ajaxcomplete",
	"ajaxerror",
	"ajaxsuccess",
	"ajaxsend"
], function( _i, type ) {
	jquery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jquery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnover, fnout ) {
		return this
			.on( "mouseenter", fnover )
			.on( "mouseleave", fnout || fnover );
	}
} );

jquery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// handle event binding
		jquery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// support: android <=4.0 only
// make sure we trim bom and nbsp
// require that the "whitespace run" starts from a non-whitespace
// to avoid o(n^2) behavior when the engine would try matching "\s+$" at each space position.
var rtrim = /^[\s\ufeff\xa0]+|([^\s\ufeff\xa0])[\s\ufeff\xa0]+$/g;

// bind a function to a context, optionally partially applying any
// arguments.
// jquery.proxy is deprecated to promote standards (specifically function#bind)
// however, it is not slated for removal any time soon
jquery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// quick check to determine if target is callable, in the spec
	// this throws a typeerror, but we will just return undefined.
	if ( !isfunction( fn ) ) {
		return undefined;
	}

	// simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jquery.guid++;

	return proxy;
};

jquery.holdready = function( hold ) {
	if ( hold ) {
		jquery.readywait++;
	} else {
		jquery.ready( true );
	}
};
jquery.isarray = array.isarray;
jquery.parsejson = json.parse;
jquery.nodename = nodename;
jquery.isfunction = isfunction;
jquery.iswindow = iswindow;
jquery.camelcase = camelcase;
jquery.type = totype;

jquery.now = date.now;

jquery.isnumeric = function( obj ) {

	// as of jquery 3.0, isnumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jquery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parsefloat nans numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to nan
		!isnan( obj - parsefloat( obj ) );
};

jquery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "$1" );
};



// register as a named amd module, since jquery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous amd modules. a named amd is safest and most robust
// way to register. lowercase jquery is used because amd module names are
// derived from file names, and jquery is normally delivered in a lowercase
// file name. do this after creating the global so that if an amd module wants
// to call noconflict to hide this version of jquery, it will work.

// note that for maximum portability, libraries that are not jquery should
// declare themselves as anonymous modules, and avoid setting a global if an
// amd loader is present. jquery is a special case. for more information, see
// https://github.com/jrburke/requirejs/wiki/updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jquery;
	} );
}




var

	// map over jquery in case of overwrite
	_jquery = window.jquery,

	// map over the $ in case of overwrite
	_$ = window.$;

jquery.noconflict = function( deep ) {
	if ( window.$ === jquery ) {
		window.$ = _$;
	}

	if ( deep && window.jquery === jquery ) {
		window.jquery = _jquery;
	}

	return jquery;
};

// expose jquery and $ identifiers, even in amd
// (trac-7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and commonjs for browser emulators (trac-13566)
if ( typeof noglobal === "undefined" ) {
	window.jquery = window.$ = jquery;
}




return jquery;
} );
jquery.noconflict();

