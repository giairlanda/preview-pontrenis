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
  __: () => (/* reexport */ __),
  _n: () => (/* reexport */ _n),
  _nx: () => (/* reexport */ _nx),
  _x: () => (/* reexport */ _x),
  createi18n: () => (/* reexport */ createi18n),
  defaulti18n: () => (/* reexport */ default_i18n_default),
  getlocaledata: () => (/* reexport */ getlocaledata),
  hastranslation: () => (/* reexport */ hastranslation),
  isrtl: () => (/* reexport */ isrtl),
  resetlocaledata: () => (/* reexport */ resetlocaledata),
  setlocaledata: () => (/* reexport */ setlocaledata),
  sprintf: () => (/* reexport */ sprintf_sprintf),
  subscribe: () => (/* reexport */ subscribe)
});

;// ./node_modules/@tannin/sprintf/src/index.js
/**
 * regular expression matching format placeholder syntax.
 *
 * the pattern for matching named arguments is a naive and incomplete matcher
 * against valid javascript identifier names.
 *
 * via mathias bynens:
 *
 * >an identifier must start with $, _, or any character in the unicode
 * >categories “uppercase letter (lu)”, “lowercase letter (ll)”, “titlecase
 * >letter (lt)”, “modifier letter (lm)”, “other letter (lo)”, or “letter
 * >number (nl)”.
 * >
 * >the rest of the string can contain the same characters, plus any u+200c zero
 * >width non-joiner characters, u+200d zero width joiner characters, and
 * >characters in the unicode categories “non-spacing mark (mn)”, “spacing
 * >combining mark (mc)”, “decimal digit number (nd)”, or “connector
 * >punctuation (pc)”.
 *
 * if browser support is constrained to those supporting es2015, this could be
 * made more accurate using the `u` flag:
 *
 * ```
 * /^[$_\p{l}\p{nl}][$_\p{l}\p{nl}\u200c\u200d\p{mn}\p{mc}\p{nd}\p{pc}]*$/u;
 * ```
 *
 * @see http://www.pixelbeat.org/programming/gcc/format_specs.html
 * @see https://mathiasbynens.be/notes/javascript-identifiers#valid-identifier-names
 *
 * @type {regexp}
 */
var pattern =
	/%(((\d+)\$)|(\(([$_a-za-z][$_a-za-z0-9]*)\)))?[ +0#-]*\d*(\.(\d+|\*))?(ll|[lhql])?([cduxxefgsp%])/g;
//               ▲         ▲                    ▲       ▲  ▲            ▲           ▲ type
//               │         │                    │       │  │            └ length (unsupported)
//               │         │                    │       │  └ precision / max width
//               │         │                    │       └ min width (unsupported)
//               │         │                    └ flags (unsupported)
//               └ index   └ name (for named arguments)
/**
 * given a format string, returns string with arguments interpolatation.
 * arguments can either be provided directly via function arguments spread, or
 * with an array as the second argument.
 *
 * @see https://en.wikipedia.org/wiki/printf_format_string
 *
 * @example
 *
 * ```js
 * import sprintf from '@tannin/sprintf';
 *
 * sprintf( 'hello %s!', 'world' );
 * // ⇒ 'hello world!'
 * ```
 * @template {string} t
 * @overload
 * @param {t} string - string printf format string
 * @param {...import('../types').sprintfargs<t>} args - arguments to interpolate
 *
 * @return {string} formatted string.
 */

/**
 * given a format string, returns string with arguments interpolatation.
 * arguments can either be provided directly via function arguments spread, or
 * with an array as the second argument.
 *
 * @see https://en.wikipedia.org/wiki/printf_format_string
 *
 * @example
 *
 * ```js
 * import sprintf from '@tannin/sprintf';
 *
 * sprintf( 'hello %s!', 'world' );
 * // ⇒ 'hello world!'
 * ```
 * @template {string} t
 * @overload
 * @param {t} string - string printf format string
 * @param {import('../types').sprintfargs<t>} args - arguments to interpolate
 *
 * @return {string} formatted string.
 */

/**
 * given a format string, returns string with arguments interpolatation.
 * arguments can either be provided directly via function arguments spread, or
 * with an array as the second argument.
 *
 * @see https://en.wikipedia.org/wiki/printf_format_string
 *
 * @example
 *
 * ```js
 * import sprintf from '@tannin/sprintf';
 *
 * sprintf( 'hello %s!', 'world' );
 * // ⇒ 'hello world!'
 * ```
 * @template {string} t
 * @param {t} string - string printf format string
 * @param {...import('../types').sprintfargs<t>} args - arguments to interpolate
 *
 * @return {string} formatted string.
 */
function sprintf(string, ...args) {
	var i = 0;
	if (array.isarray(args[0])) {
		args = /** @type {import('../types').sprintfargs<t>[]} */ (
			/** @type {unknown} */ args[0]
		);
	}

	return string.replace(pattern, function () {
		var index,
			// name needs to be documented as `string | undefined` else value will have tpye unknown.
			/**
			 * name of the argument to substitute, if any.
			 *
			 * @type {string | undefined}
			 */
			name,
			precision,
			type,
			value;

		index = arguments[3];
		name = arguments[5];
		precision = arguments[7];
		type = arguments[9];

		// there's no placeholder substitution in the explicit "%", meaning it
		// is not necessary to increment argument index.
		if (type === '%') {
			return '%';
		}

		// asterisk precision determined by peeking / shifting next argument.
		if (precision === '*') {
			precision = args[i];
			i++;
		}

		if (name === undefined) {
			// if not a positional argument, use counter value.
			if (index === undefined) {
				index = i + 1;
			}

			i++;

			// positional argument.
			value = args[index - 1];
		} else if (
			args[0] &&
			typeof args[0] === 'object' &&
			args[0].hasownproperty(name)
		) {
			// if it's a named argument, use name.
			value = args[0][name];
		}

		// parse as type.
		if (type === 'f') {
			value = parsefloat(value) || 0;
		} else if (type === 'd') {
			value = parseint(value) || 0;
		}

		// apply precision.
		if (precision !== undefined) {
			if (type === 'f') {
				value = value.tofixed(precision);
			} else if (type === 's') {
				value = value.substr(0, precision);
			}
		}

		// to avoid "undefined" concatenation, return empty string if no
		// placeholder substitution can be performed.
		return value !== undefined && value !== null ? value : '';
	});
}

;// ./node_modules/@wordpress/i18n/build-module/sprintf.js

function sprintf_sprintf(format, ...args) {
  return sprintf(format, ...args);
}


;// ./node_modules/@tannin/postfix/index.js
var precedence, openers, terminators, postfix_pattern;

/**
 * operator precedence mapping.
 *
 * @type {object}
 */
precedence = {
	'(': 9,
	'!': 8,
	'*': 7,
	'/': 7,
	'%': 7,
	'+': 6,
	'-': 6,
	'<': 5,
	'<=': 5,
	'>': 5,
	'>=': 5,
	'==': 4,
	'!=': 4,
	'&&': 3,
	'||': 2,
	'?': 1,
	'?:': 1,
};

/**
 * characters which signal pair opening, to be terminated by terminators.
 *
 * @type {string[]}
 */
openers = [ '(', '?' ];

/**
 * characters which signal pair termination, the value an array with the
 * opener as its first member. the second member is an optional operator
 * replacement to push to the stack.
 *
 * @type {string[]}
 */
terminators = {
	')': [ '(' ],
	':': [ '?', '?:' ],
};

/**
 * pattern matching operators and openers.
 *
 * @type {regexp}
 */
postfix_pattern = /<=|>=|==|!=|&&|\|\||\?:|\(|!|\*|\/|%|\+|-|<|>|\?|\)|:/;

/**
 * given a c expression, returns the equivalent postfix (reverse polish)
 * notation terms as an array.
 *
 * if a postfix string is desired, simply `.join( ' ' )` the result.
 *
 * @example
 *
 * ```js
 * import postfix from '@tannin/postfix';
 *
 * postfix( 'n > 1' );
 * // ⇒ [ 'n', '1', '>' ]
 * ```
 *
 * @param {string} expression c expression.
 *
 * @return {string[]} postfix terms.
 */
function postfix( expression ) {
	var terms = [],
		stack = [],
		match, operator, term, element;

	while ( ( match = expression.match( postfix_pattern ) ) ) {
		operator = match[ 0 ];

		// term is the string preceding the operator match. it may contain
		// whitespace, and may be empty (if operator is at beginning).
		term = expression.substr( 0, match.index ).trim();
		if ( term ) {
			terms.push( term );
		}

		while ( ( element = stack.pop() ) ) {
			if ( terminators[ operator ] ) {
				if ( terminators[ operator ][ 0 ] === element ) {
					// substitution works here under assumption that because
					// the assigned operator will no longer be a terminator, it
					// will be pushed to the stack during the condition below.
					operator = terminators[ operator ][ 1 ] || operator;
					break;
				}
			} else if ( openers.indexof( element ) >= 0 || precedence[ element ] < precedence[ operator ] ) {
				// push to stack if either an opener or when pop reveals an
				// element of lower precedence.
				stack.push( element );
				break;
			}

			// for each popped from stack, push to terms.
			terms.push( element );
		}

		if ( ! terminators[ operator ] ) {
			stack.push( operator );
		}

		// slice matched fragment from expression to continue match.
		expression = expression.substr( match.index + operator.length );
	}

	// push remainder of operand, if exists, to terms.
	expression = expression.trim();
	if ( expression ) {
		terms.push( expression );
	}

	// pop remaining items from stack into terms.
	return terms.concat( stack.reverse() );
}

;// ./node_modules/@tannin/evaluate/index.js
/**
 * operator callback functions.
 *
 * @type {object}
 */
var operators = {
	'!': function( a ) {
		return ! a;
	},
	'*': function( a, b ) {
		return a * b;
	},
	'/': function( a, b ) {
		return a / b;
	},
	'%': function( a, b ) {
		return a % b;
	},
	'+': function( a, b ) {
		return a + b;
	},
	'-': function( a, b ) {
		return a - b;
	},
	'<': function( a, b ) {
		return a < b;
	},
	'<=': function( a, b ) {
		return a <= b;
	},
	'>': function( a, b ) {
		return a > b;
	},
	'>=': function( a, b ) {
		return a >= b;
	},
	'==': function( a, b ) {
		return a === b;
	},
	'!=': function( a, b ) {
		return a !== b;
	},
	'&&': function( a, b ) {
		return a && b;
	},
	'||': function( a, b ) {
		return a || b;
	},
	'?:': function( a, b, c ) {
		if ( a ) {
			throw b;
		}

		return c;
	},
};

/**
 * given an array of postfix terms and operand variables, returns the result of
 * the postfix evaluation.
 *
 * @example
 *
 * ```js
 * import evaluate from '@tannin/evaluate';
 *
 * // 3 + 4 * 5 / 6 ⇒ '3 4 5 * 6 / +'
 * const terms = [ '3', '4', '5', '*', '6', '/', '+' ];
 *
 * evaluate( terms, {} );
 * // ⇒ 6.333333333333334
 * ```
 *
 * @param {string[]} postfix   postfix terms.
 * @param {object}   variables operand variables.
 *
 * @return {*} result of evaluation.
 */
function evaluate( postfix, variables ) {
	var stack = [],
		i, j, args, getoperatorresult, term, value;

	for ( i = 0; i < postfix.length; i++ ) {
		term = postfix[ i ];

		getoperatorresult = operators[ term ];
		if ( getoperatorresult ) {
			// pop from stack by number of function arguments.
			j = getoperatorresult.length;
			args = array( j );
			while ( j-- ) {
				args[ j ] = stack.pop();
			}

			try {
				value = getoperatorresult.apply( null, args );
			} catch ( earlyreturn ) {
				return earlyreturn;
			}
		} else if ( variables.hasownproperty( term ) ) {
			value = variables[ term ];
		} else {
			value = +term;
		}

		stack.push( value );
	}

	return stack[ 0 ];
}

;// ./node_modules/@tannin/compile/index.js



/**
 * given a c expression, returns a function which can be called to evaluate its
 * result.
 *
 * @example
 *
 * ```js
 * import compile from '@tannin/compile';
 *
 * const evaluate = compile( 'n > 1' );
 *
 * evaluate( { n: 2 } );
 * // ⇒ true
 * ```
 *
 * @param {string} expression c expression.
 *
 * @return {(variables?:{[variable:string]:*})=>*} compiled evaluator.
 */
function compile( expression ) {
	var terms = postfix( expression );

	return function( variables ) {
		return evaluate( terms, variables );
	};
}

;// ./node_modules/@tannin/plural-forms/index.js


/**
 * given a c expression, returns a function which, when called with a value,
 * evaluates the result with the value assumed to be the "n" variable of the
 * expression. the result will be coerced to its numeric equivalent.
 *
 * @param {string} expression c expression.
 *
 * @return {function} evaluator function.
 */
function pluralforms( expression ) {
	var evaluate = compile( expression );

	return function( n ) {
		return +evaluate( { n: n } );
	};
}

;// ./node_modules/tannin/index.js


/**
 * tannin constructor options.
 *
 * @typedef {object} tanninoptions
 *
 * @property {string}   [contextdelimiter] joiner in string lookup with context.
 * @property {function} [onmissingkey]     callback to invoke when key missing.
 */

/**
 * domain metadata.
 *
 * @typedef {object} tannindomainmetadata
 *
 * @property {string}            [domain]       domain name.
 * @property {string}            [lang]         language code.
 * @property {(string|function)} [plural_forms] plural forms expression or
 *                                              function evaluator.
 */

/**
 * domain translation pair respectively representing the singular and plural
 * translation.
 *
 * @typedef {[string,string]} tannintranslation
 */

/**
 * locale data domain. the key is used as reference for lookup, the value an
 * array of two string entries respectively representing the singular and plural
 * translation.
 *
 * @typedef {{[key:string]:tannindomainmetadata|tannintranslation,'':tannindomainmetadata|tannintranslation}} tanninlocaledomain
 */

/**
 * jed-formatted locale data.
 *
 * @see http://messageformat.github.io/jed/
 *
 * @typedef {{[domain:string]:tanninlocaledomain}} tanninlocaledata
 */

/**
 * default tannin constructor options.
 *
 * @type {tanninoptions}
 */
var default_options = {
	contextdelimiter: '\u0004',
	onmissingkey: null,
};

/**
 * given a specific locale data's config `plural_forms` value, returns the
 * expression.
 *
 * @example
 *
 * ```
 * getpluralexpression( 'nplurals=2; plural=(n != 1);' ) === '(n != 1)'
 * ```
 *
 * @param {string} pf locale data plural forms.
 *
 * @return {string} plural forms expression.
 */
function getpluralexpression( pf ) {
	var parts, i, part;

	parts = pf.split( ';' );

	for ( i = 0; i < parts.length; i++ ) {
		part = parts[ i ].trim();
		if ( part.indexof( 'plural=' ) === 0 ) {
			return part.substr( 7 );
		}
	}
}

/**
 * tannin constructor.
 *
 * @class
 *
 * @param {tanninlocaledata} data      jed-formatted locale data.
 * @param {tanninoptions}    [options] tannin options.
 */
function tannin( data, options ) {
	var key;

	/**
	 * jed-formatted locale data.
	 *
	 * @name tannin#data
	 * @type {tanninlocaledata}
	 */
	this.data = data;

	/**
	 * plural forms function cache, keyed by plural forms string.
	 *
	 * @name tannin#pluralforms
	 * @type {object<string,function>}
	 */
	this.pluralforms = {};

	/**
	 * effective options for instance, including defaults.
	 *
	 * @name tannin#options
	 * @type {tanninoptions}
	 */
	this.options = {};

	for ( key in default_options ) {
		this.options[ key ] = options !== undefined && key in options
			? options[ key ]
			: default_options[ key ];
	}
}

/**
 * returns the plural form index for the given domain and value.
 *
 * @param {string} domain domain on which to calculate plural form.
 * @param {number} n      value for which plural form is to be calculated.
 *
 * @return {number} plural form index.
 */
tannin.prototype.getpluralform = function( domain, n ) {
	var getpluralform = this.pluralforms[ domain ],
		config, plural, pf;

	if ( ! getpluralform ) {
		config = this.data[ domain ][ '' ];

		pf = (
			config[ 'plural-forms' ] ||
			config[ 'plural-forms' ] ||
			// ignore reason: as known, there's no way to document the empty
			// string property on a key to guarantee this as metadata.
			// @ts-ignore
			config.plural_forms
		);

		if ( typeof pf !== 'function' ) {
			plural = getpluralexpression(
				config[ 'plural-forms' ] ||
				config[ 'plural-forms' ] ||
				// ignore reason: as known, there's no way to document the empty
				// string property on a key to guarantee this as metadata.
				// @ts-ignore
				config.plural_forms
			);

			pf = pluralforms( plural );
		}

		getpluralform = this.pluralforms[ domain ] = pf;
	}

	return getpluralform( n );
};

/**
 * translate a string.
 *
 * @param {string}      domain   translation domain.
 * @param {string|void} context  context distinguishing terms of the same name.
 * @param {string}      singular primary key for translation lookup.
 * @param {string=}     plural   fallback value used for non-zero plural
 *                               form index.
 * @param {number=}     n        value to use in calculating plural form.
 *
 * @return {string} translated string.
 */
tannin.prototype.dcnpgettext = function( domain, context, singular, plural, n ) {
	var index, key, entry;

	if ( n === undefined ) {
		// default to singular.
		index = 0;
	} else {
		// find index by evaluating plural form for value.
		index = this.getpluralform( domain, n );
	}

	key = singular;

	// if provided, context is prepended to key with delimiter.
	if ( context ) {
		key = context + this.options.contextdelimiter + singular;
	}

	entry = this.data[ domain ][ key ];

	// verify not only that entry exists, but that the intended index is within
	// range and non-empty.
	if ( entry && entry[ index ] ) {
		return entry[ index ];
	}

	if ( this.options.onmissingkey ) {
		this.options.onmissingkey( singular, domain );
	}

	// if entry not found, fall back to singular vs. plural with zero index
	// representing the singular value.
	return index === 0 ? singular : plural;
};

;// ./node_modules/@wordpress/i18n/build-module/create-i18n.js

const default_locale_data = {
  "": {
    plural_forms(n) {
      return n === 1 ? 0 : 1;
    }
  }
};
const i18n_hook_regexp = /^i18n\.(n?gettext|has_translation)(_|$)/;
const createi18n = (initialdata, initialdomain, hooks) => {
  const tannin = new tannin({});
  const listeners = /* @__pure__ */ new set();
  const notifylisteners = () => {
    listeners.foreach((listener) => listener());
  };
  const subscribe = (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };
  const getlocaledata = (domain = "default") => tannin.data[domain];
  const dosetlocaledata = (data, domain = "default") => {
    tannin.data[domain] = {
      ...tannin.data[domain],
      ...data
    };
    tannin.data[domain][""] = {
      ...default_locale_data[""],
      ...tannin.data[domain]?.[""]
    };
    delete tannin.pluralforms[domain];
  };
  const setlocaledata = (data, domain) => {
    dosetlocaledata(data, domain);
    notifylisteners();
  };
  const addlocaledata = (data, domain = "default") => {
    tannin.data[domain] = {
      ...tannin.data[domain],
      ...data,
      // populate default domain configuration (supported locale date which omits
      // a plural forms expression).
      "": {
        ...default_locale_data[""],
        ...tannin.data[domain]?.[""],
        ...data?.[""]
      }
    };
    delete tannin.pluralforms[domain];
    notifylisteners();
  };
  const resetlocaledata = (data, domain) => {
    tannin.data = {};
    tannin.pluralforms = {};
    setlocaledata(data, domain);
  };
  const dcnpgettext = (domain = "default", context, single, plural, number) => {
    if (!tannin.data[domain]) {
      dosetlocaledata(void 0, domain);
    }
    return tannin.dcnpgettext(domain, context, single, plural, number);
  };
  const getfilterdomain = (domain) => domain || "default";
  const __ = (text, domain) => {
    let translation = dcnpgettext(domain, void 0, text);
    if (!hooks) {
      return translation;
    }
    translation = hooks.applyfilters(
      "i18n.gettext",
      translation,
      text,
      domain
    );
    return hooks.applyfilters(
      "i18n.gettext_" + getfilterdomain(domain),
      translation,
      text,
      domain
    );
  };
  const _x = (text, context, domain) => {
    let translation = dcnpgettext(domain, context, text);
    if (!hooks) {
      return translation;
    }
    translation = hooks.applyfilters(
      "i18n.gettext_with_context",
      translation,
      text,
      context,
      domain
    );
    return hooks.applyfilters(
      "i18n.gettext_with_context_" + getfilterdomain(domain),
      translation,
      text,
      context,
      domain
    );
  };
  const _n = (single, plural, number, domain) => {
    let translation = dcnpgettext(
      domain,
      void 0,
      single,
      plural,
      number
    );
    if (!hooks) {
      return translation;
    }
    translation = hooks.applyfilters(
      "i18n.ngettext",
      translation,
      single,
      plural,
      number,
      domain
    );
    return hooks.applyfilters(
      "i18n.ngettext_" + getfilterdomain(domain),
      translation,
      single,
      plural,
      number,
      domain
    );
  };
  const _nx = (single, plural, number, context, domain) => {
    let translation = dcnpgettext(
      domain,
      context,
      single,
      plural,
      number
    );
    if (!hooks) {
      return translation;
    }
    translation = hooks.applyfilters(
      "i18n.ngettext_with_context",
      translation,
      single,
      plural,
      number,
      context,
      domain
    );
    return hooks.applyfilters(
      "i18n.ngettext_with_context_" + getfilterdomain(domain),
      translation,
      single,
      plural,
      number,
      context,
      domain
    );
  };
  const isrtl = () => {
    return "rtl" === _x("ltr", "text direction");
  };
  const hastranslation = (single, context, domain) => {
    const key = context ? context + "" + single : single;
    let result = !!tannin.data?.[domain ?? "default"]?.[key];
    if (hooks) {
      result = hooks.applyfilters(
        "i18n.has_translation",
        result,
        single,
        context,
        domain
      );
      result = hooks.applyfilters(
        "i18n.has_translation_" + getfilterdomain(domain),
        result,
        single,
        context,
        domain
      );
    }
    return result;
  };
  if (initialdata) {
    setlocaledata(initialdata, initialdomain);
  }
  if (hooks) {
    const onhookaddedorremoved = (hookname) => {
      if (i18n_hook_regexp.test(hookname)) {
        notifylisteners();
      }
    };
    hooks.addaction("hookadded", "core/i18n", onhookaddedorremoved);
    hooks.addaction("hookremoved", "core/i18n", onhookaddedorremoved);
  }
  return {
    getlocaledata,
    setlocaledata,
    addlocaledata,
    resetlocaledata,
    subscribe,
    __,
    _x,
    _n,
    _nx,
    isrtl,
    hastranslation
  };
};


;// external ["wp","hooks"]
const external_wp_hooks_namespaceobject = window["wp"]["hooks"];
;// ./node_modules/@wordpress/i18n/build-module/default-i18n.js


const i18n = createi18n(void 0, void 0, external_wp_hooks_namespaceobject.defaulthooks);
var default_i18n_default = i18n;
const getlocaledata = i18n.getlocaledata.bind(i18n);
const setlocaledata = i18n.setlocaledata.bind(i18n);
const resetlocaledata = i18n.resetlocaledata.bind(i18n);
const subscribe = i18n.subscribe.bind(i18n);
const __ = i18n.__.bind(i18n);
const _x = i18n._x.bind(i18n);
const _n = i18n._n.bind(i18n);
const _nx = i18n._nx.bind(i18n);
const isrtl = i18n.isrtl.bind(i18n);
const hastranslation = i18n.hastranslation.bind(i18n);


;// ./node_modules/@wordpress/i18n/build-module/index.js





(window.wp = window.wp || {}).i18n = __webpack_exports__;
/******/ })()
;






