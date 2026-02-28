/**
 * @output wp-includes/js/wp-api.js
 */

(function( window, undefined ) {

	'use strict';

	/**
	 * initialize the wp_api.
	 */
	function wp_api() {
		/** @namespace wp.api.models */
		this.models = {};
		/** @namespace wp.api.collections */
		this.collections = {};
		/** @namespace wp.api.views */
		this.views = {};
	}

	/** @namespace wp */
	window.wp            = window.wp || {};
	/** @namespace wp.api */
	wp.api               = wp.api || new wp_api();
	wp.api.versionstring = wp.api.versionstring || 'wp/v2/';

	// alias _includes to _.contains, ensuring it is available if lodash is used.
	if ( ! _.isfunction( _.includes ) && _.isfunction( _.contains ) ) {
	  _.includes = _.contains;
	}

})( window );

(function( window, undefined ) {

	'use strict';

	var pad, r;

	/** @namespace wp */
	window.wp = window.wp || {};
	/** @namespace wp.api */
	wp.api = wp.api || {};
	/** @namespace wp.api.utils */
	wp.api.utils = wp.api.utils || {};

	/**
	 * determine model based on api route.
	 *
	 * @param {string} route    the api route.
	 *
	 * @return {backbone model} the model found at given route. undefined if not found.
	 */
	wp.api.getmodelbyroute = function( route ) {
		return _.find( wp.api.models, function( model ) {
			return model.prototype.route && route === model.prototype.route.index;
		} );
	};

	/**
	 * determine collection based on api route.
	 *
	 * @param {string} route    the api route.
	 *
	 * @return {backbone model} the collection found at given route. undefined if not found.
	 */
	wp.api.getcollectionbyroute = function( route ) {
		return _.find( wp.api.collections, function( collection ) {
			return collection.prototype.route && route === collection.prototype.route.index;
		} );
	};


	/**
	 * ecmascript 5 shim, adapted from mdn.
	 * @link https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/date/toisostring
	 */
	if ( ! date.prototype.toisostring ) {
		pad = function( number ) {
			r = string( number );
			if ( 1 === r.length ) {
				r = '0' + r;
			}

			return r;
		};

		date.prototype.toisostring = function() {
			return this.getutcfullyear() +
				'-' + pad( this.getutcmonth() + 1 ) +
				'-' + pad( this.getutcdate() ) +
				't' + pad( this.getutchours() ) +
				':' + pad( this.getutcminutes() ) +
				':' + pad( this.getutcseconds() ) +
				'.' + string( ( this.getutcmilliseconds() / 1000 ).tofixed( 3 ) ).slice( 2, 5 ) +
				'z';
		};
	}

	/**
	 * parse date into iso8601 format.
	 *
	 * @param {date} date.
	 */
	wp.api.utils.parseiso8601 = function( date ) {
		var timestamp, struct, i, k,
			minutesoffset = 0,
			numerickeys = [ 1, 4, 5, 6, 7, 10, 11 ];

		/*
		 * es5 �15.9.4.2 states that the string should attempt to be parsed as a date time string format string
		 * before falling back to any implementation-specific date parsing, so that’s what we do, even if native
		 * implementations could be faster.
		 */
		//              1 yyyy                2 mm       3 dd           4 hh    5 mm       6 ss        7 msec        8 z 9 �    10 tzhh    11 tzmm
		if ( ( struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:t(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec( date ) ) ) {

			// avoid nan timestamps caused by “undefined” values being passed to date.utc.
			for ( i = 0; ( k = numerickeys[i] ); ++i ) {
				struct[k] = +struct[k] || 0;
			}

			// allow undefined days and months.
			struct[2] = ( +struct[2] || 1 ) - 1;
			struct[3] = +struct[3] || 1;

			if ( 'z' !== struct[8]  && undefined !== struct[9] ) {
				minutesoffset = struct[10] * 60 + struct[11];

				if ( '+' === struct[9] ) {
					minutesoffset = 0 - minutesoffset;
				}
			}

			timestamp = date.utc( struct[1], struct[2], struct[3], struct[4], struct[5] + minutesoffset, struct[6], struct[7] );
		} else {
			timestamp = date.parse ? date.parse( date ) : nan;
		}

		return timestamp;
	};

	/**
	 * helper function for getting the root url.
	 * @return {[type]} [description]
	 */
	wp.api.utils.getrooturl = function() {
		return window.location.origin ?
			window.location.origin + '/' :
			window.location.protocol + '//' + window.location.host + '/';
	};

	/**
	 * helper for capitalizing strings.
	 */
	wp.api.utils.capitalize = function( str ) {
		if ( _.isundefined( str ) ) {
			return str;
		}
		return str.charat( 0 ).touppercase() + str.slice( 1 );
	};

	/**
	 * helper function that capitalizes the first word and camel cases any words starting
	 * after dashes, removing the dashes.
	 */
	wp.api.utils.capitalizeandcamelcasedashes = function( str ) {
		if ( _.isundefined( str ) ) {
			return str;
		}
		str = wp.api.utils.capitalize( str );

		return wp.api.utils.camelcasedashes( str );
	};

	/**
	 * helper function to camel case the letter after dashes, removing the dashes.
	 */
	wp.api.utils.camelcasedashes = function( str ) {
		return str.replace( /-([a-z])/g, function( g ) {
			return g[ 1 ].touppercase();
		} );
	};

	/**
	 * extract a route part based on negative index.
	 *
	 * @param {string}   route          the endpoint route.
	 * @param {number}   part           the number of parts from the end of the route to retrieve. default 1.
	 *                                  example route `/a/b/c`: part 1 is `c`, part 2 is `b`, part 3 is `a`.
	 * @param {string}  [versionstring] version string, defaults to `wp.api.versionstring`.
	 * @param {boolean} [reverse]       whether to reverse the order when extracting the route part. optional, default false.
	 */
	wp.api.utils.extractroutepart = function( route, part, versionstring, reverse ) {
		var routeparts;

		part = part || 1;
		versionstring = versionstring || wp.api.versionstring;

		// remove versions string from route to avoid returning it.
		if ( 0 === route.indexof( '/' + versionstring ) ) {
			route = route.substr( versionstring.length + 1 );
		}

		routeparts = route.split( '/' );
		if ( reverse ) {
			routeparts = routeparts.reverse();
		}
		if ( _.isundefined( routeparts[ --part ] ) ) {
			return '';
		}
		return routeparts[ part ];
	};

	/**
	 * extract a parent name from a passed route.
	 *
	 * @param {string} route the route to extract a name from.
	 */
	wp.api.utils.extractparentname = function( route ) {
		var name,
			lastslash = route.lastindexof( '_id>[\\d]+)/' );

		if ( lastslash < 0 ) {
			return '';
		}
		name = route.substr( 0, lastslash - 1 );
		name = name.split( '/' );
		name.pop();
		name = name.pop();
		return name;
	};

	/**
	 * add args and options to a model prototype from a route's endpoints.
	 *
	 * @param {array}  routeendpoints array of route endpoints.
	 * @param {object} modelinstance  an instance of the model (or collection)
	 *                                to add the args to.
	 */
	wp.api.utils.decoratefromroute = function( routeendpoints, modelinstance ) {

		/**
		 * build the args based on route endpoint data.
		 */
		_.each( routeendpoints, function( routeendpoint ) {

			// add post and edit endpoints as model args.
			if ( _.includes( routeendpoint.methods, 'post' ) || _.includes( routeendpoint.methods, 'put' ) ) {

				// add any non-empty args, merging them into the args object.
				if ( ! _.isempty( routeendpoint.args ) ) {

					// set as default if no args yet.
					if ( _.isempty( modelinstance.prototype.args ) ) {
						modelinstance.prototype.args = routeendpoint.args;
					} else {

						// we already have args, merge these new args in.
						modelinstance.prototype.args = _.extend( modelinstance.prototype.args, routeendpoint.args );
					}
				}
			} else {

				// add get method as model options.
				if ( _.includes( routeendpoint.methods, 'get' ) ) {

					// add any non-empty args, merging them into the defaults object.
					if ( ! _.isempty( routeendpoint.args ) ) {

						// set as default if no defaults yet.
						if ( _.isempty( modelinstance.prototype.options ) ) {
							modelinstance.prototype.options = routeendpoint.args;
						} else {

							// we already have options, merge these new args in.
							modelinstance.prototype.options = _.extend( modelinstance.prototype.options, routeendpoint.args );
						}
					}

				}
			}

		} );

	};

	/**
	 * add mixins and helpers to models depending on their defaults.
	 *
	 * @param {backbone model} model          the model to attach helpers and mixins to.
	 * @param {string}         modelclassname the classname of the constructed model.
	 * @param {object} 	       loadingobjects an object containing the models and collections we are building.
	 */
	wp.api.utils.addmixinsandhelpers = function( model, modelclassname, loadingobjects ) {

		var hasdate = false,

			/**
			 * array of parseable dates.
			 *
			 * @type {string[]}.
			 */
			parseabledates = [ 'date', 'modified', 'date_gmt', 'modified_gmt' ],

			/**
			 * mixin for all content that is time stamped.
			 *
			 * this mixin converts between mysql timestamps and javascript dates when syncing a model
			 * to or from the server. for example, a date stored as `2015-12-27t21:22:24` on the server
			 * gets expanded to `sun dec 27 2015 14:22:24 gmt-0700 (mst)` when the model is fetched.
			 *
			 * @type {{tojson: tojson, parse: parse}}.
			 */
			timestampedmixin = {

				/**
				 * prepare a javascript date for transmitting to the server.
				 *
				 * this helper function accepts a field and date object. it converts the passed date
				 * to an iso string and sets that on the model field.
				 *
				 * @param {date}   date   a javascript date object. wordpress expects dates in utc.
				 * @param {string} field  the date field to set. one of 'date', 'date_gmt', 'date_modified'
				 *                        or 'date_modified_gmt'. optional, defaults to 'date'.
				 */
				setdate: function( date, field ) {
					var thefield = field || 'date';

					// don't alter non-parsable date fields.
					if ( _.indexof( parseabledates, thefield ) < 0 ) {
						return false;
					}

					this.set( thefield, date.toisostring() );
				},

				/**
				 * get a javascript date from the passed field.
				 *
				 * wordpress returns 'date' and 'date_modified' in the timezone of the server as well as
				 * utc dates as 'date_gmt' and 'date_modified_gmt'. draft posts do not include utc dates.
				 *
				 * @param {string} field  the date field to set. one of 'date', 'date_gmt', 'date_modified'
				 *                        or 'date_modified_gmt'. optional, defaults to 'date'.
				 */
				getdate: function( field ) {
					var thefield   = field || 'date',
						theisodate = this.get( thefield );

					// only get date fields and non-null values.
					if ( _.indexof( parseabledates, thefield ) < 0 || _.isnull( theisodate ) ) {
						return false;
					}

					return new date( wp.api.utils.parseiso8601( theisodate ) );
				}
			},

			/**
			 * build a helper function to retrieve related model.
			 *
			 * @param {string} parentmodel      the parent model.
			 * @param {number} modelid          the model id if the object to request
			 * @param {string} modelname        the model name to use when constructing the model.
			 * @param {string} embedsourcepoint where to check the embedded object for _embed data.
			 * @param {string} embedcheckfield  which model field to check to see if the model has data.
			 *
			 * @return {deferred.promise}        a promise which resolves to the constructed model.
			 */
			buildmodelgetter = function( parentmodel, modelid, modelname, embedsourcepoint, embedcheckfield ) {
				var getmodel, embeddedobjects, attributes, deferred;

				deferred        = jquery.deferred();
				embeddedobjects = parentmodel.get( '_embedded' ) || {};

				// verify that we have a valid object id.
				if ( ! _.isnumber( modelid ) || 0 === modelid ) {
					deferred.reject();
					return deferred;
				}

				// if we have embedded object data, use that when constructing the getmodel.
				if ( embeddedobjects[ embedsourcepoint ] ) {
					attributes = _.findwhere( embeddedobjects[ embedsourcepoint ], { id: modelid } );
				}

				// otherwise use the modelid.
				if ( ! attributes ) {
					attributes = { id: modelid };
				}

				// create the new getmodel model.
				getmodel = new wp.api.models[ modelname ]( attributes );

				if ( ! getmodel.get( embedcheckfield ) ) {
					getmodel.fetch( {
						success: function( getmodel ) {
							deferred.resolve( getmodel );
						},
						error: function( getmodel, response ) {
							deferred.reject( response );
						}
					} );
				} else {
					// resolve with the embedded model.
					deferred.resolve( getmodel );
				}

				// return a promise.
				return deferred.promise();
			},

			/**
			 * build a helper to retrieve a collection.
			 *
			 * @param {string} parentmodel      the parent model.
			 * @param {string} collectionname   the name to use when constructing the collection.
			 * @param {string} embedsourcepoint where to check the embedded object for _embed data.
			 * @param {string} embedindex       an additional optional index for the _embed data.
			 *
			 * @return {deferred.promise} a promise which resolves to the constructed collection.
			 */
			buildcollectiongetter = function( parentmodel, collectionname, embedsourcepoint, embedindex ) {
				/**
				 * returns a promise that resolves to the requested collection
				 *
				 * uses the embedded data if available, otherwise fetches the
				 * data from the server.
				 *
				 * @return {deferred.promise} promise resolves to a wp.api.collections[ collectionname ]
				 * collection.
				 */
				var postid, embeddedobjects, getobjects,
					classproperties = '',
					properties      = '',
					deferred        = jquery.deferred();

				postid          = parentmodel.get( 'id' );
				embeddedobjects = parentmodel.get( '_embedded' ) || {};

				// verify that we have a valid post id.
				if ( ! _.isnumber( postid ) || 0 === postid ) {
					deferred.reject();
					return deferred;
				}

				// if we have embedded getobjects data, use that when constructing the getobjects.
				if ( ! _.isundefined( embedsourcepoint ) && ! _.isundefined( embeddedobjects[ embedsourcepoint ] ) ) {

					// some embeds also include an index offset, check for that.
					if ( _.isundefined( embedindex ) ) {

						// use the embed source point directly.
						properties = embeddedobjects[ embedsourcepoint ];
					} else {

						// add the index to the embed source point.
						properties = embeddedobjects[ embedsourcepoint ][ embedindex ];
					}
				} else {

					// otherwise use the postid.
					classproperties = { parent: postid };
				}

				// create the new getobjects collection.
				getobjects = new wp.api.collections[ collectionname ]( properties, classproperties );

				// if we didn’t have embedded getobjects, fetch the getobjects data.
				if ( _.isundefined( getobjects.models[0] ) ) {
					getobjects.fetch( {
						success: function( getobjects ) {

							// add a helper 'parent_post' attribute onto the model.
							sethelperparentpost( getobjects, postid );
							deferred.resolve( getobjects );
						},
						error: function( getmodel, response ) {
							deferred.reject( response );
						}
					} );
				} else {

					// add a helper 'parent_post' attribute onto the model.
					sethelperparentpost( getobjects, postid );
					deferred.resolve( getobjects );
				}

				// return a promise.
				return deferred.promise();

			},

			/**
			 * set the model post parent.
			 */
			sethelperparentpost = function( collection, postid ) {

				// attach post_parent id to the collection.
				_.each( collection.models, function( model ) {
					model.set( 'parent_post', postid );
				} );
			},

			/**
			 * add a helper function to handle post meta.
			 */
			metamixin = {

				/**
				 * get meta by key for a post.
				 *
				 * @param {string} key the meta key.
				 *
				 * @return {object} the post meta value.
				 */
				getmeta: function( key ) {
					var metas = this.get( 'meta' );
					return metas[ key ];
				},

				/**
				 * get all meta key/values for a post.
				 *
				 * @return {object} the post metas, as a key value pair object.
				 */
				getmetas: function() {
					return this.get( 'meta' );
				},

				/**
				 * set a group of meta key/values for a post.
				 *
				 * @param {object} meta the post meta to set, as key/value pairs.
				 */
				setmetas: function( meta ) {
					var metas = this.get( 'meta' );
					_.extend( metas, meta );
					this.set( 'meta', metas );
				},

				/**
				 * set a single meta value for a post, by key.
				 *
				 * @param {string} key   the meta key.
				 * @param {object} value the meta value.
				 */
				setmeta: function( key, value ) {
					var metas = this.get( 'meta' );
					metas[ key ] = value;
					this.set( 'meta', metas );
				}
			},

			/**
			 * add a helper function to handle post revisions.
			 */
			revisionsmixin = {
				getrevisions: function() {
					return buildcollectiongetter( this, 'postrevisions' );
				}
			},

			/**
			 * add a helper function to handle post tags.
			 */
			tagsmixin = {

				/**
				 * get the tags for a post.
				 *
				 * @return {deferred.promise} promise resolves to an array of tags.
				 */
				gettags: function() {
					var tagids = this.get( 'tags' ),
						tags  = new wp.api.collections.tags();

					// resolve with an empty array if no tags.
					if ( _.isempty( tagids ) ) {
						return jquery.deferred().resolve( [] );
					}

					return tags.fetch( { data: { include: tagids } } );
				},

				/**
				 * set the tags for a post.
				 *
				 * accepts an array of tag slugs, or a tags collection.
				 *
				 * @param {array|backbone.collection} tags the tags to set on the post.
				 *
				 */
				settags: function( tags ) {
					var alltags, newtag,
						self = this,
						newtags = [];

					if ( _.isstring( tags ) ) {
						return false;
					}

					// if this is an array of slugs, build a collection.
					if ( _.isarray( tags ) ) {

						// get all the tags.
						alltags = new wp.api.collections.tags();
						alltags.fetch( {
							data:    { per_page: 100 },
							success: function( alltags ) {

								// find the passed tags and set them up.
								_.each( tags, function( tag ) {
									newtag = new wp.api.models.tag( alltags.findwhere( { slug: tag } ) );

									// tie the new tag to the post.
									newtag.set( 'parent_post', self.get( 'id' ) );

									// add the new tag to the collection.
									newtags.push( newtag );
								} );
								tags = new wp.api.collections.tags( newtags );
								self.settagswithcollection( tags );
							}
						} );

					} else {
						this.settagswithcollection( tags );
					}
				},

				/**
				 * set the tags for a post.
				 *
				 * accepts a tags collection.
				 *
				 * @param {array|backbone.collection} tags the tags to set on the post.
				 *
				 */
				settagswithcollection: function( tags ) {

					// pluck out the category ids.
					this.set( 'tags', tags.pluck( 'id' ) );
					return this.save();
				}
			},

			/**
			 * add a helper function to handle post categories.
			 */
			categoriesmixin = {

				/**
				 * get a the categories for a post.
				 *
				 * @return {deferred.promise} promise resolves to an array of categories.
				 */
				getcategories: function() {
					var categoryids = this.get( 'categories' ),
						categories  = new wp.api.collections.categories();

					// resolve with an empty array if no categories.
					if ( _.isempty( categoryids ) ) {
						return jquery.deferred().resolve( [] );
					}

					return categories.fetch( { data: { include: categoryids } } );
				},

				/**
				 * set the categories for a post.
				 *
				 * accepts an array of category slugs, or a categories collection.
				 *
				 * @param {array|backbone.collection} categories the categories to set on the post.
				 *
				 */
				setcategories: function( categories ) {
					var allcategories, newcategory,
						self = this,
						newcategories = [];

					if ( _.isstring( categories ) ) {
						return false;
					}

					// if this is an array of slugs, build a collection.
					if ( _.isarray( categories ) ) {

						// get all the categories.
						allcategories = new wp.api.collections.categories();
						allcategories.fetch( {
							data:    { per_page: 100 },
							success: function( allcats ) {

								// find the passed categories and set them up.
								_.each( categories, function( category ) {
									newcategory = new wp.api.models.category( allcats.findwhere( { slug: category } ) );

									// tie the new category to the post.
									newcategory.set( 'parent_post', self.get( 'id' ) );

									// add the new category to the collection.
									newcategories.push( newcategory );
								} );
								categories = new wp.api.collections.categories( newcategories );
								self.setcategorieswithcollection( categories );
							}
						} );

					} else {
						this.setcategorieswithcollection( categories );
					}

				},

				/**
				 * set the categories for a post.
				 *
				 * accepts categories collection.
				 *
				 * @param {array|backbone.collection} categories the categories to set on the post.
				 *
				 */
				setcategorieswithcollection: function( categories ) {

					// pluck out the category ids.
					this.set( 'categories', categories.pluck( 'id' ) );
					return this.save();
				}
			},

			/**
			 * add a helper function to retrieve the author user model.
			 */
			authormixin = {
				getauthoruser: function() {
					return buildmodelgetter( this, this.get( 'author' ), 'user', 'author', 'name' );
				}
			},

			/**
			 * add a helper function to retrieve the featured media.
			 */
			featuredmediamixin = {
				getfeaturedmedia: function() {
					return buildmodelgetter( this, this.get( 'featured_media' ), 'media', 'wp:featuredmedia', 'source_url' );
				}
			};

		// exit if we don't have valid model defaults.
		if ( _.isundefined( model.prototype.args ) ) {
			return model;
		}

		// go thru the parsable date fields, if our model contains any of them it gets the timestampedmixin.
		_.each( parseabledates, function( thedatekey ) {
			if ( ! _.isundefined( model.prototype.args[ thedatekey ] ) ) {
				hasdate = true;
			}
		} );

		// add the timestampedmixin for models that contain a date field.
		if ( hasdate ) {
			model = model.extend( timestampedmixin );
		}

		// add the authormixin for models that contain an author.
		if ( ! _.isundefined( model.prototype.args.author ) ) {
			model = model.extend( authormixin );
		}

		// add the featuredmediamixin for models that contain a featured_media.
		if ( ! _.isundefined( model.prototype.args.featured_media ) ) {
			model = model.extend( featuredmediamixin );
		}

		// add the categoriesmixin for models that support categories collections.
		if ( ! _.isundefined( model.prototype.args.categories ) ) {
			model = model.extend( categoriesmixin );
		}

		// add the metamixin for models that support meta.
		if ( ! _.isundefined( model.prototype.args.meta ) ) {
			model = model.extend( metamixin );
		}

		// add the tagsmixin for models that support tags collections.
		if ( ! _.isundefined( model.prototype.args.tags ) ) {
			model = model.extend( tagsmixin );
		}

		// add the revisionsmixin for models that support revisions collections.
		if ( ! _.isundefined( loadingobjects.collections[ modelclassname + 'revisions' ] ) ) {
			model = model.extend( revisionsmixin );
		}

		return model;
	};

})( window );

/* global wpapisettings:false */

// suppress warning about parse function's unused "options" argument:
/* jshint unused:false */
(function() {

	'use strict';

	var wpapisettings = window.wpapisettings || {},
	trashabletypes    = [ 'comment', 'media', 'comment', 'post', 'page', 'status', 'taxonomy', 'type' ];

	/**
	 * backbone base model for all models.
	 */
	wp.api.wpapibasemodel = backbone.model.extend(
		/** @lends wpapibasemodel.prototype  */
		{

			// initialize the model.
			initialize: function() {

				/**
				* types that don't support trashing require passing ?force=true to delete.
				*
				*/
				if ( -1 === _.indexof( trashabletypes, this.name ) ) {
					this.requireforcefordelete = true;
				}
			},

			/**
			 * set nonce header before every backbone sync.
			 *
			 * @param {string} method.
			 * @param {backbone.model} model.
			 * @param {{beforesend}, *} options.
			 * @return {*}.
			 */
			sync: function( method, model, options ) {
				var beforesend;

				options = options || {};

				// remove date_gmt if null.
				if ( _.isnull( model.get( 'date_gmt' ) ) ) {
					model.unset( 'date_gmt' );
				}

				// remove slug if empty.
				if ( _.isempty( model.get( 'slug' ) ) ) {
					model.unset( 'slug' );
				}

				if ( _.isfunction( model.nonce ) && ! _.isempty( model.nonce() ) ) {
					beforesend = options.beforesend;

					// @todo enable option for jsonp endpoints.
					// options.datatype = 'jsonp';

					// include the nonce with requests.
					options.beforesend = function( xhr ) {
						xhr.setrequestheader( 'x-wp-nonce', model.nonce() );

						if ( beforesend ) {
							return beforesend.apply( this, arguments );
						}
					};

					// update the nonce when a new nonce is returned with the response.
					options.complete = function( xhr ) {
						var returnednonce = xhr.getresponseheader( 'x-wp-nonce' );

						if ( returnednonce && _.isfunction( model.nonce ) && model.nonce() !== returnednonce ) {
							model.endpointmodel.set( 'nonce', returnednonce );
						}
					};
				}

				// add '?force=true' to use delete method when required.
				if ( this.requireforcefordelete && 'delete' === method ) {
					model.url = model.url() + '?force=true';
				}
				return backbone.sync( method, model, options );
			},

			/**
			 * save is only allowed when the put or post methods are available for the endpoint.
			 */
			save: function( attrs, options ) {

				// do we have the put method, then execute the save.
				if ( _.includes( this.methods, 'put' ) || _.includes( this.methods, 'post' ) ) {

					// proxy the call to the original save function.
					return backbone.model.prototype.save.call( this, attrs, options );
				} else {

					// otherwise bail, disallowing action.
					return false;
				}
			},

			/**
			 * delete is only allowed when the delete method is available for the endpoint.
			 */
			destroy: function( options ) {

				// do we have the delete method, then execute the destroy.
				if ( _.includes( this.methods, 'delete' ) ) {

					// proxy the call to the original save function.
					return backbone.model.prototype.destroy.call( this, options );
				} else {

					// otherwise bail, disallowing action.
					return false;
				}
			}

		}
	);

	/**
	 * api schema model. contains meta information about the api.
	 */
	wp.api.models.schema = wp.api.wpapibasemodel.extend(
		/** @lends schema.prototype  */
		{
			defaults: {
				_links: {},
				namespace: null,
				routes: {}
			},

			initialize: function( attributes, options ) {
				var model = this;
				options = options || {};

				wp.api.wpapibasemodel.prototype.initialize.call( model, attributes, options );

				model.apiroot = options.apiroot || wpapisettings.root;
				model.versionstring = options.versionstring || wpapisettings.versionstring;
			},

			url: function() {
				return this.apiroot + this.versionstring;
			}
		}
	);
})();

( function() {

	'use strict';

	var wpapisettings = window.wpapisettings || {};

	/**
	 * contains basic collection functionality such as pagination.
	 */
	wp.api.wpapibasecollection = backbone.collection.extend(
		/** @lends basecollection.prototype  */
		{

			/**
			 * setup default state.
			 */
			initialize: function( models, options ) {
				this.state = {
					data: {},
					currentpage: null,
					totalpages: null,
					totalobjects: null
				};
				if ( _.isundefined( options ) ) {
					this.parent = '';
				} else {
					this.parent = options.parent;
				}
			},

			/**
			 * extend backbone.collection.sync to add nince and pagination support.
			 *
			 * set nonce header before every backbone sync.
			 *
			 * @param {string} method.
			 * @param {backbone.model} model.
			 * @param {{success}, *} options.
			 * @return {*}.
			 */
			sync: function( method, model, options ) {
				var beforesend, success,
					self = this;

				options = options || {};

				if ( _.isfunction( model.nonce ) && ! _.isempty( model.nonce() ) ) {
					beforesend = options.beforesend;

					// include the nonce with requests.
					options.beforesend = function( xhr ) {
						xhr.setrequestheader( 'x-wp-nonce', model.nonce() );

						if ( beforesend ) {
							return beforesend.apply( self, arguments );
						}
					};

					// update the nonce when a new nonce is returned with the response.
					options.complete = function( xhr ) {
						var returnednonce = xhr.getresponseheader( 'x-wp-nonce' );

						if ( returnednonce && _.isfunction( model.nonce ) && model.nonce() !== returnednonce ) {
							model.endpointmodel.set( 'nonce', returnednonce );
						}
					};
				}

				// when reading, add pagination data.
				if ( 'read' === method ) {
					if ( options.data ) {
						self.state.data = _.clone( options.data );

						delete self.state.data.page;
					} else {
						self.state.data = options.data = {};
					}

					if ( 'undefined' === typeof options.data.page ) {
						self.state.currentpage  = null;
						self.state.totalpages   = null;
						self.state.totalobjects = null;
					} else {
						self.state.currentpage = options.data.page - 1;
					}

					success = options.success;
					options.success = function( data, textstatus, request ) {
						if ( ! _.isundefined( request ) ) {
							self.state.totalpages   = parseint( request.getresponseheader( 'x-wp-totalpages' ), 10 );
							self.state.totalobjects = parseint( request.getresponseheader( 'x-wp-total' ), 10 );
						}

						if ( null === self.state.currentpage ) {
							self.state.currentpage = 1;
						} else {
							self.state.currentpage++;
						}

						if ( success ) {
							return success.apply( this, arguments );
						}
					};
				}

				// continue by calling backbone's sync.
				return backbone.sync( method, model, options );
			},

			/**
			 * fetches the next page of objects if a new page exists.
			 *
			 * @param {data: {page}} options.
			 * @return {*}.
			 */
			more: function( options ) {
				options = options || {};
				options.data = options.data || {};

				_.extend( options.data, this.state.data );

				if ( 'undefined' === typeof options.data.page ) {
					if ( ! this.hasmore() ) {
						return false;
					}

					if ( null === this.state.currentpage || this.state.currentpage <= 1 ) {
						options.data.page = 2;
					} else {
						options.data.page = this.state.currentpage + 1;
					}
				}

				return this.fetch( options );
			},

			/**
			 * returns true if there are more pages of objects available.
			 *
			 * @return {null|boolean}
			 */
			hasmore: function() {
				if ( null === this.state.totalpages ||
					 null === this.state.totalobjects ||
					 null === this.state.currentpage ) {
					return null;
				} else {
					return ( this.state.currentpage < this.state.totalpages );
				}
			}
		}
	);

} )();

( function() {

	'use strict';

	var endpoint, initializeddeferreds = {},
		wpapisettings = window.wpapisettings || {};

	/** @namespace wp */
	window.wp = window.wp || {};

	/** @namespace wp.api */
	wp.api    = wp.api || {};

	// if wpapisettings is unavailable, try the default.
	if ( _.isempty( wpapisettings ) ) {
		wpapisettings.root = window.location.origin + '/wp-json/';
	}

	endpoint = backbone.model.extend(/** @lends endpoint.prototype */{
		defaults: {
			apiroot: wpapisettings.root,
			versionstring: wp.api.versionstring,
			nonce: null,
			schema: null,
			models: {},
			collections: {}
		},

		/**
		 * initialize the endpoint model.
		 */
		initialize: function() {
			var model = this, deferred;

			backbone.model.prototype.initialize.apply( model, arguments );

			deferred = jquery.deferred();
			model.schemaconstructed = deferred.promise();

			model.schemamodel = new wp.api.models.schema( null, {
				apiroot:       model.get( 'apiroot' ),
				versionstring: model.get( 'versionstring' ),
				nonce:         model.get( 'nonce' )
			} );

			// when the model loads, resolve the promise.
			model.schemamodel.once( 'change', function() {
				model.constructfromschema();
				deferred.resolve( model );
			} );

			if ( model.get( 'schema' ) ) {

				// use schema supplied as model attribute.
				model.schemamodel.set( model.schemamodel.parse( model.get( 'schema' ) ) );
			} else if (
				! _.isundefined( sessionstorage ) &&
				( _.isundefined( wpapisettings.cacheschema ) || wpapisettings.cacheschema ) &&
				sessionstorage.getitem( 'wp-api-schema-model' + model.get( 'apiroot' ) + model.get( 'versionstring' ) )
			) {

				// used a cached copy of the schema model if available.
				model.schemamodel.set( model.schemamodel.parse( json.parse( sessionstorage.getitem( 'wp-api-schema-model' + model.get( 'apiroot' ) + model.get( 'versionstring' ) ) ) ) );
			} else {
				model.schemamodel.fetch( {
					/**
					 * when the server returns the schema model data, store the data in a sessioncache so we don't
					 * have to retrieve it again for this session. then, construct the models and collections based
					 * on the schema model data.
					 *
					 * @ignore
					 */
					success: function( newschemamodel ) {

						// store a copy of the schema model in the session cache if available.
						if ( ! _.isundefined( sessionstorage ) && ( _.isundefined( wpapisettings.cacheschema ) || wpapisettings.cacheschema ) ) {
							try {
								sessionstorage.setitem( 'wp-api-schema-model' + model.get( 'apiroot' ) + model.get( 'versionstring' ), json.stringify( newschemamodel ) );
							} catch ( error ) {

								// fail silently, fixes errors in safari private mode.
							}
						}
					},

					// log the error condition.
					error: function( err ) {
						window.console.log( err );
					}
				} );
			}
		},

		constructfromschema: function() {
			var routemodel = this, modelroutes, collectionroutes, schemaroot, loadingobjects,

			/**
			 * set up the model and collection name mapping options. as the schema is built, the
			 * model and collection names will be adjusted if they are found in the mapping object.
			 *
			 * localizing a variable wpapisettings.mapping will over-ride the default mapping options.
			 *
			 */
			mapping = wpapisettings.mapping || {
				models: {
					'categories':      'category',
					'comments':        'comment',
					'pages':           'page',
					'pagesmeta':       'pagemeta',
					'pagesrevisions':  'pagerevision',
					'posts':           'post',
					'postscategories': 'postcategory',
					'postsrevisions':  'postrevision',
					'poststags':       'posttag',
					'schema':          'schema',
					'statuses':        'status',
					'tags':            'tag',
					'taxonomies':      'taxonomy',
					'types':           'type',
					'users':           'user'
				},
				collections: {
					'pagesmeta':       'pagemeta',
					'pagesrevisions':  'pagerevisions',
					'postscategories': 'postcategories',
					'postsmeta':       'postmeta',
					'postsrevisions':  'postrevisions',
					'poststags':       'posttags'
				}
			},

			modelendpoints = routemodel.get( 'modelendpoints' ),
			modelregex     = new regexp( '(?:.*[+)]|\/(' + modelendpoints.join( '|' ) + '))$' );

			/**
			 * iterate thru the routes, picking up models and collections to build. builds two arrays,
			 * one for models and one for collections.
			 */
			modelroutes      = [];
			collectionroutes = [];
			schemaroot       = routemodel.get( 'apiroot' ).replace( wp.api.utils.getrooturl(), '' );
			loadingobjects   = {};

			/**
			 * tracking objects for models and collections.
			 */
			loadingobjects.models      = {};
			loadingobjects.collections = {};

			_.each( routemodel.schemamodel.get( 'routes' ), function( route, index ) {

				// skip the schema root if included in the schema.
				if ( index !== routemodel.get( ' versionstring' ) &&
						index !== schemaroot &&
						index !== ( '/' + routemodel.get( 'versionstring' ).slice( 0, -1 ) )
				) {

					// single items end with a regex, or a special case word.
					if ( modelregex.test( index ) ) {
						modelroutes.push( { index: index, route: route } );
					} else {

						// collections end in a name.
						collectionroutes.push( { index: index, route: route } );
					}
				}
			} );

			/**
			 * construct the models.
			 *
			 * base the class name on the route endpoint.
			 */
			_.each( modelroutes, function( modelroute ) {

				// extract the name and any parent from the route.
				var modelclassname,
					routename  = wp.api.utils.extractroutepart( modelroute.index, 2, routemodel.get( 'versionstring' ), true ),
					parentname = wp.api.utils.extractroutepart( modelroute.index, 1, routemodel.get( 'versionstring' ), false ),
					routeend   = wp.api.utils.extractroutepart( modelroute.index, 1, routemodel.get( 'versionstring' ), true );

				// clear the parent part of the rouite if its actually the version string.
				if ( parentname === routemodel.get( 'versionstring' ) ) {
					parentname = '';
				}

				// handle the special case of the 'me' route.
				if ( 'me' === routeend ) {
					routename = 'me';
				}

				// if the model has a parent in its route, add that to its class name.
				if ( '' !== parentname && parentname !== routename ) {
					modelclassname = wp.api.utils.capitalizeandcamelcasedashes( parentname ) + wp.api.utils.capitalizeandcamelcasedashes( routename );
					modelclassname = mapping.models[ modelclassname ] || modelclassname;
					loadingobjects.models[ modelclassname ] = wp.api.wpapibasemodel.extend( {

						// return a constructed url based on the parent and id.
						url: function() {
							var url =
								routemodel.get( 'apiroot' ) +
								routemodel.get( 'versionstring' ) +
								parentname +  '/' +
									( ( _.isundefined( this.get( 'parent' ) ) || 0 === this.get( 'parent' ) ) ?
										( _.isundefined( this.get( 'parent_post' ) ) ? '' : this.get( 'parent_post' ) + '/' ) :
										this.get( 'parent' ) + '/' ) +
								routename;

							if ( ! _.isundefined( this.get( 'id' ) ) ) {
								url +=  '/' + this.get( 'id' );
							}
							return url;
						},

						// track nonces on the endpoint 'routemodel'.
						nonce: function() {
							return routemodel.get( 'nonce' );
						},

						endpointmodel: routemodel,

						// include a reference to the original route object.
						route: modelroute,

						// include a reference to the original class name.
						name: modelclassname,

						// include the array of route methods for easy reference.
						methods: modelroute.route.methods,

						// include the array of route endpoints for easy reference.
						endpoints: modelroute.route.endpoints
					} );
				} else {

					// this is a model without a parent in its route.
					modelclassname = wp.api.utils.capitalizeandcamelcasedashes( routename );
					modelclassname = mapping.models[ modelclassname ] || modelclassname;
					loadingobjects.models[ modelclassname ] = wp.api.wpapibasemodel.extend( {

						// function that returns a constructed url based on the id.
						url: function() {
							var url = routemodel.get( 'apiroot' ) +
								routemodel.get( 'versionstring' ) +
								( ( 'me' === routename ) ? 'users/me' : routename );

							if ( ! _.isundefined( this.get( 'id' ) ) ) {
								url +=  '/' + this.get( 'id' );
							}
							return url;
						},

						// track nonces at the endpoint level.
						nonce: function() {
							return routemodel.get( 'nonce' );
						},

						endpointmodel: routemodel,

						// include a reference to the original route object.
						route: modelroute,

						// include a reference to the original class name.
						name: modelclassname,

						// include the array of route methods for easy reference.
						methods: modelroute.route.methods,

						// include the array of route endpoints for easy reference.
						endpoints: modelroute.route.endpoints
					} );
				}

				// add defaults to the new model, pulled form the endpoint.
				wp.api.utils.decoratefromroute(
					modelroute.route.endpoints,
					loadingobjects.models[ modelclassname ],
					routemodel.get( 'versionstring' )
				);

			} );

			/**
			 * construct the collections.
			 *
			 * base the class name on the route endpoint.
			 */
			_.each( collectionroutes, function( collectionroute ) {

				// extract the name and any parent from the route.
				var collectionclassname, modelclassname,
						routename  = collectionroute.index.slice( collectionroute.index.lastindexof( '/' ) + 1 ),
						parentname = wp.api.utils.extractroutepart( collectionroute.index, 1, routemodel.get( 'versionstring' ), false );

				// if the collection has a parent in its route, add that to its class name.
				if ( '' !== parentname && parentname !== routename && routemodel.get( 'versionstring' ) !== parentname ) {

					collectionclassname = wp.api.utils.capitalizeandcamelcasedashes( parentname ) + wp.api.utils.capitalizeandcamelcasedashes( routename );
					modelclassname      = mapping.models[ collectionclassname ] || collectionclassname;
					collectionclassname = mapping.collections[ collectionclassname ] || collectionclassname;
					loadingobjects.collections[ collectionclassname ] = wp.api.wpapibasecollection.extend( {

						// function that returns a constructed url passed on the parent.
						url: function() {
							return routemodel.get( 'apiroot' ) + routemodel.get( 'versionstring' ) +
								parentname + '/' +
								( ( _.isundefined( this.parent ) || '' === this.parent ) ?
									( _.isundefined( this.get( 'parent_post' ) ) ? '' : this.get( 'parent_post' ) + '/' ) :
									this.parent + '/' ) +
								routename;
						},

						// specify the model that this collection contains.
						model: function( attrs, options ) {
							return new loadingobjects.models[ modelclassname ]( attrs, options );
						},

						// track nonces at the endpoint level.
						nonce: function() {
							return routemodel.get( 'nonce' );
						},

						endpointmodel: routemodel,

						// include a reference to the original class name.
						name: collectionclassname,

						// include a reference to the original route object.
						route: collectionroute,

						// include the array of route methods for easy reference.
						methods: collectionroute.route.methods
					} );
				} else {

					// this is a collection without a parent in its route.
					collectionclassname = wp.api.utils.capitalizeandcamelcasedashes( routename );
					modelclassname      = mapping.models[ collectionclassname ] || collectionclassname;
					collectionclassname = mapping.collections[ collectionclassname ] || collectionclassname;
					loadingobjects.collections[ collectionclassname ] = wp.api.wpapibasecollection.extend( {

						// for the url of a root level collection, use a string.
						url: function() {
							return routemodel.get( 'apiroot' ) + routemodel.get( 'versionstring' ) + routename;
						},

						// specify the model that this collection contains.
						model: function( attrs, options ) {
							return new loadingobjects.models[ modelclassname ]( attrs, options );
						},

						// track nonces at the endpoint level.
						nonce: function() {
							return routemodel.get( 'nonce' );
						},

						endpointmodel: routemodel,

						// include a reference to the original class name.
						name: collectionclassname,

						// include a reference to the original route object.
						route: collectionroute,

						// include the array of route methods for easy reference.
						methods: collectionroute.route.methods
					} );
				}

				// add defaults to the new model, pulled form the endpoint.
				wp.api.utils.decoratefromroute( collectionroute.route.endpoints, loadingobjects.collections[ collectionclassname ] );
			} );

			// add mixins and helpers for each of the models.
			_.each( loadingobjects.models, function( model, index ) {
				loadingobjects.models[ index ] = wp.api.utils.addmixinsandhelpers( model, index, loadingobjects );
			} );

			// set the routemodel models and collections.
			routemodel.set( 'models', loadingobjects.models );
			routemodel.set( 'collections', loadingobjects.collections );

		}

	} );

	wp.api.endpoints = new backbone.collection();

	/**
	 * initialize the wp-api, optionally passing the api root.
	 *
	 * @param {object} [args]
	 * @param {string} [args.nonce] the nonce. optional, defaults to wpapisettings.nonce.
	 * @param {string} [args.apiroot] the api root. optional, defaults to wpapisettings.root.
	 * @param {string} [args.versionstring] the version string. optional, defaults to wpapisettings.root.
	 * @param {object} [args.schema] the schema. optional, will be fetched from api if not provided.
	 */
	wp.api.init = function( args ) {
		var endpoint, attributes = {}, deferred, promise;

		args                      = args || {};
		attributes.nonce          = _.isstring( args.nonce ) ? args.nonce : ( wpapisettings.nonce || '' );
		attributes.apiroot        = args.apiroot || wpapisettings.root || '/wp-json';
		attributes.versionstring  = args.versionstring || wpapisettings.versionstring || 'wp/v2/';
		attributes.schema         = args.schema || null;
		attributes.modelendpoints = args.modelendpoints || [ 'me', 'settings' ];
		if ( ! attributes.schema && attributes.apiroot === wpapisettings.root && attributes.versionstring === wpapisettings.versionstring ) {
			attributes.schema = wpapisettings.schema;
		}

		if ( ! initializeddeferreds[ attributes.apiroot + attributes.versionstring ] ) {

			// look for an existing copy of this endpoint.
			endpoint = wp.api.endpoints.findwhere( { 'apiroot': attributes.apiroot, 'versionstring': attributes.versionstring } );
			if ( ! endpoint ) {
				endpoint = new endpoint( attributes );
			}
			deferred = jquery.deferred();
			promise = deferred.promise();

			endpoint.schemaconstructed.done( function( resolvedendpoint ) {
				wp.api.endpoints.add( resolvedendpoint );

				// map the default endpoints, extending any already present items (including schema model).
				wp.api.models      = _.extend( wp.api.models, resolvedendpoint.get( 'models' ) );
				wp.api.collections = _.extend( wp.api.collections, resolvedendpoint.get( 'collections' ) );
				deferred.resolve( resolvedendpoint );
			} );
			initializeddeferreds[ attributes.apiroot + attributes.versionstring ] = promise;
		}
		return initializeddeferreds[ attributes.apiroot + attributes.versionstring ];
	};

	/**
	 * construct the default endpoints and add to an endpoints collection.
	 */

	// the wp.api.init function returns a promise that will resolve with the endpoint once it is ready.
	wp.api.loadpromise = wp.api.init();

} )();







