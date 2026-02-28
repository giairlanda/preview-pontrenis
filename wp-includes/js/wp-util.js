/**
 * @output wp-includes/js/wp-util.js
 */

/* global _wputilsettings */

/** @namespace wp */
window.wp = window.wp || {};

(function ($) {
	// check for the utility settings.
	var settings = typeof _wputilsettings === 'undefined' ? {} : _wputilsettings;

	/**
	 * wp.template( id )
	 *
	 * fetch a javascript template for an id, and return a templating function for it.
	 *
	 * @param {string} id a string that corresponds to a dom element with an id prefixed with "tmpl-".
	 *                    for example, "attachment" maps to "tmpl-attachment".
	 * @return {function} a function that lazily-compiles the template requested.
	 */
	wp.template = _.memoize(function ( id ) {
		var compiled,
			/*
			 * underscore's default erb-style templates are incompatible with php
			 * when asp_tags is enabled, so wordpress uses mustache-inspired templating syntax.
			 *
			 * @see trac ticket #22344.
			 */
			options = {
				evaluate:    /<#([\s\s]+?)#>/g,
				interpolate: /\{\{\{([\s\s]+?)\}\}\}/g,
				escape:      /\{\{([^\}]+?)\}\}(?!\})/g,
				variable:    'data'
			};

		return function ( data ) {
			if ( ! document.getelementbyid( 'tmpl-' + id ) ) {
				throw new error( 'template not found: ' + '#tmpl-' + id );
			}
			compiled = compiled || _.template( $( '#tmpl-' + id ).html(),  options );
			return compiled( data );
		};
	});

	/*
	 * wp.ajax
	 * ------
	 *
	 * tools for sending ajax requests with json responses and built in error handling.
	 * mirrors and wraps jquery's ajax apis.
	 */
	wp.ajax = {
		settings: settings.ajax || {},

		/**
		 * wp.ajax.post( [action], [data] )
		 *
		 * sends a post request to wordpress.
		 *
		 * @param {(string|object)} action the slug of the action to fire in wordpress or options passed
		 *                                 to jquery.ajax.
		 * @param {object=}         data   optional. the data to populate $_post with.
		 * @return {$.promise} a jquery promise that represents the request,
		 *                     decorated with an abort() method.
		 */
		post: function( action, data ) {
			return wp.ajax.send({
				data: _.isobject( action ) ? action : _.extend( data || {}, { action: action })
			});
		},

		/**
		 * wp.ajax.send( [action], [options] )
		 *
		 * sends a post request to wordpress.
		 *
		 * @param {(string|object)} action  the slug of the action to fire in wordpress or options passed
		 *                                  to jquery.ajax.
		 * @param {object=}         options optional. the options passed to jquery.ajax.
		 * @return {$.promise} a jquery promise that represents the request,
		 *                     decorated with an abort() method.
		 */
		send: function( action, options ) {
			var promise, deferred;
			if ( _.isobject( action ) ) {
				options = action;
			} else {
				options = options || {};
				options.data = _.extend( options.data || {}, { action: action });
			}

			options = _.defaults( options || {}, {
				type:    'post',
				url:     wp.ajax.settings.url,
				context: this
			});

			deferred = $.deferred( function( deferred ) {
				// transfer success/error callbacks.
				if ( options.success ) {
					deferred.done( options.success );
				}

				if ( options.error ) {
					deferred.fail( options.error );
				}

				delete options.success;
				delete options.error;

				// use with php's wp_send_json_success() and wp_send_json_error().
				deferred.jqxhr = $.ajax( options ).done( function( response ) {
					// treat a response of 1 as successful for backward compatibility with existing handlers.
					if ( response === '1' || response === 1 ) {
						response = { success: true };
					}

					if ( _.isobject( response ) && ! _.isundefined( response.success ) ) {

						// when handling a media attachments request, get the total attachments from response headers.
						var context = this;
						deferred.done( function() {
							if (
								action &&
								action.data &&
								'query-attachments' === action.data.action &&
								deferred.jqxhr.hasownproperty( 'getresponseheader' ) &&
								deferred.jqxhr.getresponseheader( 'x-wp-total' )
							) {
								context.totalattachments = parseint( deferred.jqxhr.getresponseheader( 'x-wp-total' ), 10 );
							} else {
								context.totalattachments = 0;
							}
						} );
						deferred[ response.success ? 'resolvewith' : 'rejectwith' ]( this, [response.data] );
					} else {
						deferred.rejectwith( this, [response] );
					}
				}).fail( function() {
					deferred.rejectwith( this, arguments );
				});
			});

			promise = deferred.promise();
			promise.abort = function() {
				deferred.jqxhr.abort();
				return this;
			};

			return promise;
		}
	};

}(jquery));







