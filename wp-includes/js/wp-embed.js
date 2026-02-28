/**
 * wordpress inline html embed
 *
 * @since 4.4.0
 * @output wp-includes/js/wp-embed.js
 *
 * single line comments should not be used since they will break
 * the script when inlined in get_post_embed_html(), specifically
 * when the comments are not stripped out due to script_debug
 * being turned on.
 */
(function ( window, document ) {
	'use strict';

	/* abort for ancient browsers. */
	if ( ! document.queryselector || ! window.addeventlistener || typeof url === 'undefined' ) {
		return;
	}

	/** @namespace wp */
	window.wp = window.wp || {};

	/* abort if script was already executed. */
	if ( !! window.wp.receiveembedmessage ) {
		return;
	}

	/**
	 * receive embed message.
	 *
	 * @param {messageevent} e
	 */
	window.wp.receiveembedmessage = function( e ) {
		var data = e.data;

		/* verify shape of message. */
		if (
			! ( data || data.secret || data.message || data.value ) ||
			/[^a-za-z0-9]/.test( data.secret )
		) {
			return;
		}

		var iframes = document.queryselectorall( 'iframe[data-secret="' + data.secret + '"]' ),
			blockquotes = document.queryselectorall( 'blockquote[data-secret="' + data.secret + '"]' ),
			allowedprotocols = new regexp( '^https?:$', 'i' ),
			i, source, height, sourceurl, targeturl;

		for ( i = 0; i < blockquotes.length; i++ ) {
			blockquotes[ i ].style.display = 'none';
		}

		for ( i = 0; i < iframes.length; i++ ) {
			source = iframes[ i ];

			if ( e.source !== source.contentwindow ) {
				continue;
			}

			source.removeattribute( 'style' );

			if ( 'height' === data.message ) {
				/* resize the iframe on request. */
				height = parseint( data.value, 10 );
				if ( height > 1000 ) {
					height = 1000;
				} else if ( ~~height < 200 ) {
					height = 200;
				}

				source.height = height;
			} else if ( 'link' === data.message ) {
				/* link to a specific url on request. */
				sourceurl = new url( source.getattribute( 'src' ) );
				targeturl = new url( data.value );

				if (
					allowedprotocols.test( targeturl.protocol ) &&
					targeturl.host === sourceurl.host &&
					document.activeelement === source
				) {
					window.top.location.href = data.value;
				}
			}
		}
	};

	function onload() {
		var iframes = document.queryselectorall( 'iframe.wp-embedded-content' ),
			i, source, secret;

		for ( i = 0; i < iframes.length; i++ ) {
			/** @var {iframeelement} */
			source = iframes[ i ];

			secret = source.getattribute( 'data-secret' );
			if ( ! secret ) {
				/* add secret to iframe */
				secret = math.random().tostring( 36 ).substring( 2, 12 );
				source.src += '#?secret=' + secret;
				source.setattribute( 'data-secret', secret );
			}

			/*
			 * let post embed window know that the parent is ready for receiving the height message, in case the iframe
			 * loaded before wp-embed.js was loaded. when the ready message is received by the post embed window, the
			 * window will then (re-)send the height message right away.
			 */
			source.contentwindow.postmessage( {
				message: 'ready',
				secret: secret
			}, '*' );
		}
	}

	window.addeventlistener( 'message', window.wp.receiveembedmessage, false );
	document.addeventlistener( 'domcontentloaded', onload, false );
})( window, document );





