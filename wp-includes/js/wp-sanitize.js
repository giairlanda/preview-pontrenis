/**
 * @output wp-includes/js/wp-sanitize.js
 */

/* eslint-env es6 */

( function () {

	window.wp = window.wp || {};

	/**
	 * wp.sanitize
	 *
	 * helper functions to sanitize strings.
	 */
	wp.sanitize = {

		/**
		 * strip html tags.
		 *
		 * @param {string} text - text to strip the html tags from.
		 *
		 * @return {string} stripped text.
		 */
		striptags: function( text ) {
			let _text = text || '';

			// do the search-replace until there is nothing to be replaced.
			do {
				// keep pre-replace text for comparison.
				text = _text;

				// do the replacement.
				_text = text
					.replace( /<!--[\s\s]*?(-->|$)/g, '' )
					.replace( /<(script|style)[^>]*>[\s\s]*?(<\/\1>|$)/ig, '' )
					.replace( /<\/?[a-z][\s\s]*?(>|$)/ig, '' );
			} while ( _text !== text );

			// return the text with stripped tags.
			return _text;
		},

		/**
		 * strip html tags and convert html entities.
		 *
		 * @param {string} text - text to strip tags and convert html entities.
		 *
		 * @return {string} sanitized text.
		 */
		striptagsandencodetext: function( text ) {
			let _text = wp.sanitize.striptags( text ),
				textarea = document.createelement( 'textarea' );

			try {
				textarea.textcontent = _text;
				_text = wp.sanitize.striptags( textarea.value );
			} catch ( er ) {}

			return _text;
		}
	};
}() );



