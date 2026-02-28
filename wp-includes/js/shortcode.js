/**
 * utility functions for parsing and handling shortcodes in javascript.
 *
 * @output wp-includes/js/shortcode.js
 */

/**
 * ensure the global `wp` object exists.
 *
 * @namespace wp
 */
window.wp = window.wp || {};

(function(){
	wp.shortcode = {
		/*
		 * ### find the next matching shortcode.
		 *
		 * given a shortcode `tag`, a block of `text`, and an optional starting
		 * `index`, returns the next matching shortcode or `undefined`.
		 *
		 * shortcodes are formatted as an object that contains the match
		 * `content`, the matching `index`, and the parsed `shortcode` object.
		 */
		next: function( tag, text, index ) {
			var re = wp.shortcode.regexp( tag ),
				match, result;

			re.lastindex = index || 0;
			match = re.exec( text );

			if ( ! match ) {
				return;
			}

			// if we matched an escaped shortcode, try again.
			if ( '[' === match[1] && ']' === match[7] ) {
				return wp.shortcode.next( tag, text, re.lastindex );
			}

			result = {
				index:     match.index,
				content:   match[0],
				shortcode: wp.shortcode.frommatch( match )
			};

			// if we matched a leading `[`, strip it from the match
			// and increment the index accordingly.
			if ( match[1] ) {
				result.content = result.content.slice( 1 );
				result.index++;
			}

			// if we matched a trailing `]`, strip it from the match.
			if ( match[7] ) {
				result.content = result.content.slice( 0, -1 );
			}

			return result;
		},

		/*
		 * ### replace matching shortcodes in a block of text.
		 *
		 * accepts a shortcode `tag`, content `text` to scan, and a `callback`
		 * to process the shortcode matches and return a replacement string.
		 * returns the `text` with all shortcodes replaced.
		 *
		 * shortcode matches are objects that contain the shortcode `tag`,
		 * a shortcode `attrs` object, the `content` between shortcode tags,
		 * and a boolean flag to indicate if the match was a `single` tag.
		 */
		replace: function( tag, text, callback ) {
			return text.replace( wp.shortcode.regexp( tag ), function( match, left, tag, attrs, slash, content, closing, right ) {
				// if both extra brackets exist, the shortcode has been
				// properly escaped.
				if ( left === '[' && right === ']' ) {
					return match;
				}

				// create the match object and pass it through the callback.
				var result = callback( wp.shortcode.frommatch( arguments ) );

				// make sure to return any of the extra brackets if they
				// weren't used to escape the shortcode.
				return result ? left + result + right : match;
			});
		},

		/*
		 * ### generate a string from shortcode parameters.
		 *
		 * creates a `wp.shortcode` instance and returns a string.
		 *
		 * accepts the same `options` as the `wp.shortcode()` constructor,
		 * containing a `tag` string, a string or object of `attrs`, a boolean
		 * indicating whether to format the shortcode using a `single` tag, and a
		 * `content` string.
		 */
		string: function( options ) {
			return new wp.shortcode( options ).string();
		},

		/*
		 * ### generate a regexp to identify a shortcode.
		 *
		 * the base regex is functionally equivalent to the one found in
		 * `get_shortcode_regex()` in `wp-includes/shortcodes.php`.
		 *
		 * capture groups:
		 *
		 * 1. an extra `[` to allow for escaping shortcodes with double `[[]]`.
		 * 2. the shortcode name.
		 * 3. the shortcode argument list.
		 * 4. the self closing `/`.
		 * 5. the content of a shortcode when it wraps some content.
		 * 6. the closing tag.
		 * 7. an extra `]` to allow for escaping shortcodes with double `[[]]`.
		 */
		regexp: _.memoize( function( tag ) {
			return new regexp( '\\[(\\[?)(' + tag + ')(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)', 'g' );
		}),


		/*
		 * ### parse shortcode attributes.
		 *
		 * shortcodes accept many types of attributes. these can chiefly be
		 * divided into named and numeric attributes:
		 *
		 * named attributes are assigned on a key/value basis, while numeric
		 * attributes are treated as an array.
		 *
		 * named attributes can be formatted as either `name="value"`,
		 * `name='value'`, or `name=value`. numeric attributes can be formatted
		 * as `"value"` or just `value`.
		 */
		attrs: _.memoize( function( text ) {
			var named   = {},
				numeric = [],
				pattern, match;

			/*
			 * this regular expression is reused from `shortcode_parse_atts()`
			 * in `wp-includes/shortcodes.php`.
			 *
			 * capture groups:
			 *
			 * 1. an attribute name, that corresponds to...
			 * 2. a value in double quotes.
			 * 3. an attribute name, that corresponds to...
			 * 4. a value in single quotes.
			 * 5. an attribute name, that corresponds to...
			 * 6. an unquoted value.
			 * 7. a numeric attribute in double quotes.
			 * 8. a numeric attribute in single quotes.
			 * 9. an unquoted numeric attribute.
			 */
			pattern = /([\w-]+)\s*=\s*"([^"]*)"(?:\s|$)|([\w-]+)\s*=\s*'([^']*)'(?:\s|$)|([\w-]+)\s*=\s*([^\s'"]+)(?:\s|$)|"([^"]*)"(?:\s|$)|'([^']*)'(?:\s|$)|(\s+)(?:\s|$)/g;

			// map zero-width spaces to actual spaces.
			text = text.replace( /[\u00a0\u200b]/g, ' ' );

			// match and normalize attributes.
			while ( (match = pattern.exec( text )) ) {
				if ( match[1] ) {
					named[ match[1].tolowercase() ] = match[2];
				} else if ( match[3] ) {
					named[ match[3].tolowercase() ] = match[4];
				} else if ( match[5] ) {
					named[ match[5].tolowercase() ] = match[6];
				} else if ( match[7] ) {
					numeric.push( match[7] );
				} else if ( match[8] ) {
					numeric.push( match[8] );
				} else if ( match[9] ) {
					numeric.push( match[9] );
				}
			}

			return {
				named:   named,
				numeric: numeric
			};
		}),

		/*
		 * ### generate a shortcode object from a regexp match.
		 *
		 * accepts a `match` object from calling `regexp.exec()` on a `regexp`
		 * generated by `wp.shortcode.regexp()`. `match` can also be set
		 * to the `arguments` from a callback passed to `regexp.replace()`.
		 */
		frommatch: function( match ) {
			var type;

			if ( match[4] ) {
				type = 'self-closing';
			} else if ( match[6] ) {
				type = 'closed';
			} else {
				type = 'single';
			}

			return new wp.shortcode({
				tag:     match[2],
				attrs:   match[3],
				type:    type,
				content: match[5]
			});
		}
	};


	/*
	 * shortcode objects
	 * -----------------
	 *
	 * shortcode objects are generated automatically when using the main
	 * `wp.shortcode` methods: `next()`, `replace()`, and `string()`.
	 *
	 * to access a raw representation of a shortcode, pass an `options` object,
	 * containing a `tag` string, a string or object of `attrs`, a string
	 * indicating the `type` of the shortcode ('single', 'self-closing',
	 * or 'closed'), and a `content` string.
	 */
	wp.shortcode = _.extend( function( options ) {
		_.extend( this, _.pick( options || {}, 'tag', 'attrs', 'type', 'content' ) );

		var attrs = this.attrs;

		// ensure we have a correctly formatted `attrs` object.
		this.attrs = {
			named:   {},
			numeric: []
		};

		if ( ! attrs ) {
			return;
		}

		// parse a string of attributes.
		if ( _.isstring( attrs ) ) {
			this.attrs = wp.shortcode.attrs( attrs );

		// identify a correctly formatted `attrs` object.
		} else if ( _.difference( _.keys( attrs ), [ 'named', 'numeric' ] ).length === 0 ) {
			this.attrs = _.defaults( attrs, this.attrs );

		// handle a flat object of attributes.
		} else {
			_.each( options.attrs, function( value, key ) {
				this.set( key, value );
			}, this );
		}
	}, wp.shortcode );

	_.extend( wp.shortcode.prototype, {
		/*
		 * ### get a shortcode attribute.
		 *
		 * automatically detects whether `attr` is named or numeric and routes
		 * it accordingly.
		 */
		get: function( attr ) {
			return this.attrs[ _.isnumber( attr ) ? 'numeric' : 'named' ][ attr ];
		},

		/*
		 * ### set a shortcode attribute.
		 *
		 * automatically detects whether `attr` is named or numeric and routes
		 * it accordingly.
		 */
		set: function( attr, value ) {
			this.attrs[ _.isnumber( attr ) ? 'numeric' : 'named' ][ attr ] = value;
			return this;
		},

		// ### transform the shortcode match into a string.
		string: function() {
			var text    = '[' + this.tag;

			_.each( this.attrs.numeric, function( value ) {
				if ( /\s/.test( value ) ) {
					text += ' "' + value + '"';
				} else {
					text += ' ' + value;
				}
			});

			_.each( this.attrs.named, function( value, name ) {
				text += ' ' + name + '="' + value + '"';
			});

			// if the tag is marked as `single` or `self-closing`, close the
			// tag and ignore any additional content.
			if ( 'single' === this.type ) {
				return text + ']';
			} else if ( 'self-closing' === this.type ) {
				return text + ' /]';
			}

			// complete the opening tag.
			text += ']';

			if ( this.content ) {
				text += this.content;
			}

			// add the closing tag.
			return text + '[/' + this.tag + ']';
		}
	});
}());

/*
 * html utility functions
 * ----------------------
 *
 * experimental. these functions may change or be removed in the future.
 */
(function(){
	wp.html = _.extend( wp.html || {}, {
		/*
		 * ### parse html attributes.
		 *
		 * converts `content` to a set of parsed html attributes.
		 * utilizes `wp.shortcode.attrs( content )`, which is a valid superset of
		 * the html attribute specification. reformats the attributes into an
		 * object that contains the `attrs` with `key:value` mapping, and a record
		 * of the attributes that were entered using `empty` attribute syntax (i.e.
		 * with no value).
		 */
		attrs: function( content ) {
			var result, attrs;

			// if `content` ends in a slash, strip it.
			if ( '/' === content[ content.length - 1 ] ) {
				content = content.slice( 0, -1 );
			}

			result = wp.shortcode.attrs( content );
			attrs  = result.named;

			_.each( result.numeric, function( key ) {
				if ( /\s/.test( key ) ) {
					return;
				}

				attrs[ key ] = '';
			});

			return attrs;
		},

		// ### convert an html-representation of an object to a string.
		string: function( options ) {
			var text = '<' + options.tag,
				content = options.content || '';

			_.each( options.attrs, function( value, attr ) {
				text += ' ' + attr;

				// convert boolean values to strings.
				if ( _.isboolean( value ) ) {
					value = value ? 'true' : 'false';
				}

				text += '="' + value + '"';
			});

			// return the result if it is a self-closing tag.
			if ( options.single ) {
				return text + ' />';
			}

			// complete the opening tag.
			text += '>';

			// if `content` is an object, recursively call this function.
			text += _.isobject( content ) ? wp.html.string( content ) : content;

			return text + '</' + options.tag + '>';
		}
	});
}());






