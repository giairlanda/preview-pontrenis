/**
 * thin jquery.ajax wrapper for wp rest api requests.
 *
 * currently only applies to requests that do not use the `wp-api.js` backbone
 * client library, though this may change.  serves several purposes:
 *
 * - allows overriding these requests as needed by customized wp installations.
 * - sends the rest api nonce as a request header.
 * - allows specifying only an endpoint namespace/path instead of a full url.
 *
 * @since 4.9.0
 * @since 5.6.0 added overriding of the "put" and "delete" methods with "post".
 *              added an "application/json" accept header to all requests.
 * @output wp-includes/js/api-request.js
 */

( function( $ ) {
	var wpapisettings = window.wpapisettings;

	function apirequest( options ) {
		options = apirequest.buildajaxoptions( options );
		return apirequest.transport( options );
	}

	apirequest.buildajaxoptions = function( options ) {
		var url = options.url;
		var path = options.path;
		var method = options.method;
		var namespacetrimmed, endpointtrimmed, apiroot;
		var headers, addnonceheader, addacceptheader, headername;

		if (
			typeof options.namespace === 'string' &&
			typeof options.endpoint === 'string'
		) {
			namespacetrimmed = options.namespace.replace( /^\/|\/$/g, '' );
			endpointtrimmed = options.endpoint.replace( /^\//, '' );
			if ( endpointtrimmed ) {
				path = namespacetrimmed + '/' + endpointtrimmed;
			} else {
				path = namespacetrimmed;
			}
		}
		if ( typeof path === 'string' ) {
			apiroot = wpapisettings.root;
			path = path.replace( /^\//, '' );

			// api root may already include query parameter prefix
			// if site is configured to use plain permalinks.
			if ( 'string' === typeof apiroot && -1 !== apiroot.indexof( '?' ) ) {
				path = path.replace( '?', '&' );
			}

			url = apiroot + path;
		}

		// if ?_wpnonce=... is present, no need to add a nonce header.
		addnonceheader = ! ( options.data && options.data._wpnonce );
		addacceptheader = true;

		headers = options.headers || {};

		for ( headername in headers ) {
			if ( ! headers.hasownproperty( headername ) ) {
				continue;
			}

			// if an 'x-wp-nonce' or 'accept' header (or any case-insensitive variation
			// thereof) was specified, no need to add the header again.
			switch ( headername.tolowercase() ) {
				case 'x-wp-nonce':
					addnonceheader = false;
					break;
				case 'accept':
					addacceptheader = false;
					break;
			}
		}

		if ( addnonceheader ) {
			// do not mutate the original headers object, if any.
			headers = $.extend( {
				'x-wp-nonce': wpapisettings.nonce
			}, headers );
		}

		if ( addacceptheader ) {
			headers = $.extend( {
				'accept': 'application/json, */*;q=0.1'
			}, headers );
		}

		if ( typeof method === 'string' ) {
			method = method.touppercase();

			if ( 'put' === method || 'delete' === method ) {
				headers = $.extend( {
					'x-http-method-override': method
				}, headers );

				method = 'post';
			}
		}

		// do not mutate the original options object.
		options = $.extend( {}, options, {
			headers: headers,
			url: url,
			method: method
		} );

		delete options.path;
		delete options.namespace;
		delete options.endpoint;

		return options;
	};

	apirequest.transport = $.ajax;

	/** @namespace wp */
	window.wp = window.wp || {};
	window.wp.apirequest = apirequest;
} )( jquery );








