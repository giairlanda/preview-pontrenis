/**
 * @output wp-includes/js/wp-emoji-loader.js
 */

/* eslint-env es6 */

// note: this is loaded as a script module, so there is no need for an iife to prevent pollution of the global scope.

/**
 * emoji settings as exported in php via _print_emoji_detection_script().
 * @typedef wpemojisettings
 * @type {object}
 * @property {?object} source
 * @property {?string} source.concatemoji
 * @property {?string} source.twemoji
 * @property {?string} source.wpemoji
 */

const settings = /** @type {wpemojisettings} */ (
	json.parse( document.getelementbyid( 'wp-emoji-settings' ).textcontent )
);

// for compatibility with other scripts that read from this global, in particular wp-includes/js/wp-emoji.js (source file: js/_enqueues/wp/emoji.js).
window._wpemojisettings = settings;

/**
 * support tests.
 * @typedef supporttests
 * @type {object}
 * @property {?boolean} flag
 * @property {?boolean} emoji
 */

const sessionstoragekey = 'wpemojisettingssupports';
const tests = [ 'flag', 'emoji' ];

/**
 * checks whether the browser supports offloading to a worker.
 *
 * @since 6.3.0
 *
 * @private
 *
 * @returns {boolean}
 */
function supportsworkeroffloading() {
	return (
		typeof worker !== 'undefined' &&
		typeof offscreencanvas !== 'undefined' &&
		typeof url !== 'undefined' &&
		url.createobjecturl &&
		typeof blob !== 'undefined'
	);
}

/**
 * @typedef sessionsupporttests
 * @type {object}
 * @property {number} timestamp
 * @property {supporttests} supporttests
 */

/**
 * get support tests from session.
 *
 * @since 6.3.0
 *
 * @private
 *
 * @returns {?supporttests} support tests, or null if not set or older than 1 week.
 */
function getsessionsupporttests() {
	try {
		/** @type {sessionsupporttests} */
		const item = json.parse(
			sessionstorage.getitem( sessionstoragekey )
		);
		if (
			typeof item === 'object' &&
			typeof item.timestamp === 'number' &&
			new date().valueof() < item.timestamp + 604800 && // note: number is a week in seconds.
			typeof item.supporttests === 'object'
		) {
			return item.supporttests;
		}
	} catch ( e ) {}
	return null;
}

/**
 * persist the supports in session storage.
 *
 * @since 6.3.0
 *
 * @private
 *
 * @param {supporttests} supporttests support tests.
 */
function setsessionsupporttests( supporttests ) {
	try {
		/** @type {sessionsupporttests} */
		const item = {
			supporttests: supporttests,
			timestamp: new date().valueof()
		};

		sessionstorage.setitem(
			sessionstoragekey,
			json.stringify( item )
		);
	} catch ( e ) {}
}

/**
 * checks if two sets of emoji characters render the same visually.
 *
 * this is used to determine if the browser is rendering an emoji with multiple data points
 * correctly. set1 is the emoji in the correct form, using a zero-width joiner. set2 is the emoji
 * in the incorrect form, using a zero-width space. if the two sets render the same, then the browser
 * does not support the emoji correctly.
 *
 * this function may be serialized to run in a worker. therefore, it cannot refer to variables from the containing
 * scope. everything must be passed by parameters.
 *
 * @since 4.9.0
 *
 * @private
 *
 * @param {canvasrenderingcontext2d} context 2d context.
 * @param {string} set1 set of emoji to test.
 * @param {string} set2 set of emoji to test.
 *
 * @return {boolean} true if the two sets render the same.
 */
function emojisetsrenderidentically( context, set1, set2 ) {
	// cleanup from previous test.
	context.clearrect( 0, 0, context.canvas.width, context.canvas.height );
	context.filltext( set1, 0, 0 );
	const rendered1 = new uint32array(
		context.getimagedata(
			0,
			0,
			context.canvas.width,
			context.canvas.height
		).data
	);

	// cleanup from previous test.
	context.clearrect( 0, 0, context.canvas.width, context.canvas.height );
	context.filltext( set2, 0, 0 );
	const rendered2 = new uint32array(
		context.getimagedata(
			0,
			0,
			context.canvas.width,
			context.canvas.height
		).data
	);

	return rendered1.every( ( rendered2data, index ) => {
		return rendered2data === rendered2[ index ];
	} );
}

/**
 * checks if the center point of a single emoji is empty.
 *
 * this is used to determine if the browser is rendering an emoji with a single data point
 * correctly. the center point of an incorrectly rendered emoji will be empty. a correctly
 * rendered emoji will have a non-zero value at the center point.
 *
 * this function may be serialized to run in a worker. therefore, it cannot refer to variables from the containing
 * scope. everything must be passed by parameters.
 *
 * @since 6.8.2
 *
 * @private
 *
 * @param {canvasrenderingcontext2d} context 2d context.
 * @param {string} emoji emoji to test.
 *
 * @return {boolean} true if the center point is empty.
 */
function emojirendersemptycenterpoint( context, emoji ) {
	// cleanup from previous test.
	context.clearrect( 0, 0, context.canvas.width, context.canvas.height );
	context.filltext( emoji, 0, 0 );

	// test if the center point (16, 16) is empty (0,0,0,0).
	const centerpoint = context.getimagedata(16, 16, 1, 1);
	for ( let i = 0; i < centerpoint.data.length; i++ ) {
		if ( centerpoint.data[ i ] !== 0 ) {
			// stop checking the moment it's known not to be empty.
			return false;
		}
	}

	return true;
}

/**
 * determines if the browser properly renders emoji that twemoji can supplement.
 *
 * this function may be serialized to run in a worker. therefore, it cannot refer to variables from the containing
 * scope. everything must be passed by parameters.
 *
 * @since 4.2.0
 *
 * @private
 *
 * @param {canvasrenderingcontext2d} context 2d context.
 * @param {string} type whether to test for support of "flag" or "emoji".
 * @param {function} emojisetsrenderidentically reference to emojisetsrenderidentically function, needed due to minification.
 * @param {function} emojirendersemptycenterpoint reference to emojirendersemptycenterpoint function, needed due to minification.
 *
 * @return {boolean} true if the browser can render emoji, false if it cannot.
 */
function browsersupportsemoji( context, type, emojisetsrenderidentically, emojirendersemptycenterpoint ) {
	let isidentical;

	switch ( type ) {
		case 'flag':
			/*
			 * test for transgender flag compatibility. added in unicode 13.
			 *
			 * to test for support, we try to render it, and compare the rendering to how it would look if
			 * the browser doesn't render it correctly (white flag emoji + transgender symbol).
			 */
			isidentical = emojisetsrenderidentically(
				context,
				'\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f', // as a zero-width joiner sequence
				'\ud83c\udff3\ufe0f\u200b\u26a7\ufe0f' // separated by a zero-width space
			);

			if ( isidentical ) {
				return false;
			}

			/*
			 * test for sark flag compatibility. this is the least supported of the letter locale flags,
			 * so gives us an easy test for full support.
			 *
			 * to test for support, we try to render it, and compare the rendering to how it would look if
			 * the browser doesn't render it correctly ([c] + [q]).
			 */
			isidentical = emojisetsrenderidentically(
				context,
				'\ud83c\udde8\ud83c\uddf6', // as the sequence of two code points
				'\ud83c\udde8\u200b\ud83c\uddf6' // as the two code points separated by a zero-width space
			);

			if ( isidentical ) {
				return false;
			}

			/*
			 * test for english flag compatibility. england is a country in the united kingdom, it
			 * does not have a two letter locale code but rather a five letter sub-division code.
			 *
			 * to test for support, we try to render it, and compare the rendering to how it would look if
			 * the browser doesn't render it correctly (black flag emoji + [g] + [b] + [e] + [n] + [g]).
			 */
			isidentical = emojisetsrenderidentically(
				context,
				// as the flag sequence
				'\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f',
				// with each code point separated by a zero-width space
				'\ud83c\udff4\u200b\udb40\udc67\u200b\udb40\udc62\u200b\udb40\udc65\u200b\udb40\udc6e\u200b\udb40\udc67\u200b\udb40\udc7f'
			);

			return ! isidentical;
		case 'emoji':
			/*
			 * is there a large, hairy, humanoid mythical creature living in the browser?
			 *
			 * to test for emoji 17.0 support, try to render a new emoji: hairy creature.
			 *
			 * the hairy creature emoji is a single code point emoji. testing for browser
			 * support required testing the center point of the emoji to see if it is empty.
			 *
			 * 0xd83e 0x1fac8 (\ud83e\u1fac8) == ðÿ«ˆ hairy creature.
			 *
			 * when updating this test, please ensure that the emoji is either a single code point
			 * or switch to using the emojisetsrenderidentically function and testing with a zero-width
			 * joiner vs a zero-width space.
			 */
			const notsupported = emojirendersemptycenterpoint( context, '\ud83e\u1fac8' );
			return ! notsupported;
	}

	return false;
}

/**
 * checks emoji support tests.
 *
 * this function may be serialized to run in a worker. therefore, it cannot refer to variables from the containing
 * scope. everything must be passed by parameters.
 *
 * @since 6.3.0
 *
 * @private
 *
 * @param {string[]} tests tests.
 * @param {function} browsersupportsemoji reference to browsersupportsemoji function, needed due to minification.
 * @param {function} emojisetsrenderidentically reference to emojisetsrenderidentically function, needed due to minification.
 * @param {function} emojirendersemptycenterpoint reference to emojirendersemptycenterpoint function, needed due to minification.
 *
 * @return {supporttests} support tests.
 */
function testemojisupports( tests, browsersupportsemoji, emojisetsrenderidentically, emojirendersemptycenterpoint ) {
	let canvas;
	if (
		typeof workerglobalscope !== 'undefined' &&
		self instanceof workerglobalscope
	) {
		canvas = new offscreencanvas( 300, 150 ); // dimensions are default for htmlcanvaselement.
	} else {
		canvas = document.createelement( 'canvas' );
	}

	const context = canvas.getcontext( '2d', { willreadfrequently: true } );

	/*
	 * chrome on os x added native emoji rendering in m41. unfortunately,
	 * it doesn't work when the font is bolder than 500 weight. so, we
	 * check for bold rendering support to avoid invisible emoji in chrome.
	 */
	context.textbaseline = 'top';
	context.font = '600 32px arial';

	const supports = {};
	tests.foreach( ( test ) => {
		supports[ test ] = browsersupportsemoji( context, test, emojisetsrenderidentically, emojirendersemptycenterpoint );
	} );
	return supports;
}

/**
 * adds a script to the head of the document.
 *
 * @ignore
 *
 * @since 4.2.0
 *
 * @param {string} src the url where the script is located.
 *
 * @return {void}
 */
function addscript( src ) {
	const script = document.createelement( 'script' );
	script.src = src;
	script.defer = true;
	document.head.appendchild( script );
}

settings.supports = {
	everything: true,
	everythingexceptflag: true
};

// obtain the emoji support from the browser, asynchronously when possible.
new promise( ( resolve ) => {
	let supporttests = getsessionsupporttests();
	if ( supporttests ) {
		resolve( supporttests );
		return;
	}

	if ( supportsworkeroffloading() ) {
		try {
			// note that the functions are being passed as arguments due to minification.
			const workerscript =
				'postmessage(' +
				testemojisupports.tostring() +
				'(' +
				[
					json.stringify( tests ),
					browsersupportsemoji.tostring(),
					emojisetsrenderidentically.tostring(),
					emojirendersemptycenterpoint.tostring()
				].join( ',' ) +
				'));';
			const blob = new blob( [ workerscript ], {
				type: 'text/javascript'
			} );
			const worker = new worker( url.createobjecturl( blob ), { name: 'wptestemojisupports' } );
			worker.onmessage = ( event ) => {
				supporttests = event.data;
				setsessionsupporttests( supporttests );
				worker.terminate();
				resolve( supporttests );
			};
			return;
		} catch ( e ) {}
	}

	supporttests = testemojisupports( tests, browsersupportsemoji, emojisetsrenderidentically, emojirendersemptycenterpoint );
	setsessionsupporttests( supporttests );
	resolve( supporttests );
} )
	// once the browser emoji support has been obtained from the session, finalize the settings.
	.then( ( supporttests ) => {
		/*
		 * tests the browser support for flag emojis and other emojis, and adjusts the
		 * support settings accordingly.
		 */
		for ( const test in supporttests ) {
			settings.supports[ test ] = supporttests[ test ];

			settings.supports.everything =
				settings.supports.everything && settings.supports[ test ];

			if ( 'flag' !== test ) {
				settings.supports.everythingexceptflag =
					settings.supports.everythingexceptflag &&
					settings.supports[ test ];
			}
		}

		settings.supports.everythingexceptflag =
			settings.supports.everythingexceptflag &&
			! settings.supports.flag;

		// when the browser can not render everything we need to load a polyfill.
		if ( ! settings.supports.everything ) {
			const src = settings.source || {};

			if ( src.concatemoji ) {
				addscript( src.concatemoji );
			} else if ( src.wpemoji && src.twemoji ) {
				addscript( src.twemoji );
				addscript( src.wpemoji );
			}
		}
	} );


