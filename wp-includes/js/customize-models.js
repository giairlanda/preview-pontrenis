/**
 * @output wp-includes/js/customize-models.js
 */

/* global _wpcustomizeheader */
(function( $, wp ) {
	var api = wp.customize;
	/** @namespace wp.customize.headertool */
	api.headertool = {};


	/**
	 * wp.customize.headertool.imagemodel
	 *
	 * a header image. this is where saves via the customizer api are
	 * abstracted away, plus our own ajax calls to add images to and remove
	 * images from the user's recently uploaded images setting on the server.
	 * these calls are made regardless of whether the user actually saves new
	 * customizer settings.
	 *
	 * @memberof wp.customize.headertool
	 * @alias wp.customize.headertool.imagemodel
	 *
	 * @constructor
	 * @augments backbone.model
	 */
	api.headertool.imagemodel = backbone.model.extend(/** @lends wp.customize.headertool.imagemodel.prototype */{
		defaults: function() {
			return {
				header: {
					attachment_id: 0,
					url: '',
					timestamp: _.now(),
					thumbnail_url: ''
				},
				choice: '',
				selected: false,
				random: false
			};
		},

		initialize: function() {
			this.on('hide', this.hide, this);
		},

		hide: function() {
			this.set('choice', '');
			api('header_image').set('remove-header');
			api('header_image_data').set('remove-header');
		},

		destroy: function() {
			var data = this.get('header'),
				curr = api.headertool.currentheader.get('header').attachment_id;

			// if the image we're removing is also the current header,
			// unset the latter.
			if (curr && data.attachment_id === curr) {
				api.headertool.currentheader.trigger('hide');
			}

			wp.ajax.post( 'custom-header-remove', {
				nonce: _wpcustomizeheader.nonces.remove,
				wp_customize: 'on',
				theme: api.settings.theme.stylesheet,
				attachment_id: data.attachment_id
			});

			this.trigger('destroy', this, this.collection);
		},

		save: function() {
			if (this.get('random')) {
				api('header_image').set(this.get('header').random);
				api('header_image_data').set(this.get('header').random);
			} else {
				if (this.get('header').defaultname) {
					api('header_image').set(this.get('header').url);
					api('header_image_data').set(this.get('header').defaultname);
				} else {
					api('header_image').set(this.get('header').url);
					api('header_image_data').set(this.get('header'));
				}
			}

			api.headertool.combinedlist.trigger('control:setimage', this);
		},

		importimage: function() {
			var data = this.get('header');
			if (data.attachment_id === undefined) {
				return;
			}

			wp.ajax.post( 'custom-header-add', {
				nonce: _wpcustomizeheader.nonces.add,
				wp_customize: 'on',
				theme: api.settings.theme.stylesheet,
				attachment_id: data.attachment_id
			} );
		},

		shouldbecropped: function() {
			if (this.get('themeflexwidth') === true &&
						this.get('themeflexheight') === true) {
				return false;
			}

			if (this.get('themeflexwidth') === true &&
				this.get('themeheight') === this.get('imageheight')) {
				return false;
			}

			if (this.get('themeflexheight') === true &&
				this.get('themewidth') === this.get('imagewidth')) {
				return false;
			}

			if (this.get('themewidth') === this.get('imagewidth') &&
				this.get('themeheight') === this.get('imageheight')) {
				return false;
			}

			if (this.get('imagewidth') <= this.get('themewidth')) {
				return false;
			}

			return true;
		}
	});


	/**
	 * wp.customize.headertool.choicelist
	 *
	 * @memberof wp.customize.headertool
	 * @alias wp.customize.headertool.choicelist
	 *
	 * @constructor
	 * @augments backbone.collection
	 */
	api.headertool.choicelist = backbone.collection.extend({
		model: api.headertool.imagemodel,

		// ordered from most recently used to least.
		comparator: function(model) {
			return -model.get('header').timestamp;
		},

		initialize: function() {
			var current = api.headertool.currentheader.get('choice').replace(/^https?:\/\//, ''),
				israndom = this.israndomchoice(api.get().header_image);

			// overridable by an extending class.
			if (!this.type) {
				this.type = 'uploaded';
			}

			// overridable by an extending class.
			if (typeof this.data === 'undefined') {
				this.data = _wpcustomizeheader.uploads;
			}

			if (israndom) {
				// so that when adding data we don't hide regular images.
				current = api.get().header_image;
			}

			this.on('control:setimage', this.setimage, this);
			this.on('control:removeimage', this.removeimage, this);
			this.on('add', this.mayberemoveoldcrop, this);
			this.on('add', this.maybeaddrandomchoice, this);

			_.each(this.data, function(elt, index) {
				if (!elt.attachment_id) {
					elt.defaultname = index;
				}

				if (typeof elt.timestamp === 'undefined') {
					elt.timestamp = 0;
				}

				this.add({
					header: elt,
					choice: elt.url.split('/').pop(),
					selected: current === elt.url.replace(/^https?:\/\//, '')
				}, { silent: true });
			}, this);

			if (this.size() > 0) {
				this.addrandomchoice(current);
			}
		},

		mayberemoveoldcrop: function( model ) {
			var newid = model.get( 'header' ).attachment_id || false,
			 	oldcrop;

			// bail early if we don't have a new attachment id.
			if ( ! newid ) {
				return;
			}

			oldcrop = this.find( function( item ) {
				return ( item.cid !== model.cid && item.get( 'header' ).attachment_id === newid );
			} );

			// if we found an old crop, remove it from the collection.
			if ( oldcrop ) {
				this.remove( oldcrop );
			}
		},

		maybeaddrandomchoice: function() {
			if (this.size() === 1) {
				this.addrandomchoice();
			}
		},

		addrandomchoice: function(initialchoice) {
			var israndomsametype = regexp(this.type).test(initialchoice),
				randomchoice = 'random-' + this.type + '-image';

			this.add({
				header: {
					timestamp: 0,
					random: randomchoice,
					width: 245,
					height: 41
				},
				choice: randomchoice,
				random: true,
				selected: israndomsametype
			});
		},

		israndomchoice: function(choice) {
			return (/^random-(uploaded|default)-image$/).test(choice);
		},

		shouldhidetitle: function() {
			return this.size() < 2;
		},

		setimage: function(model) {
			this.each(function(m) {
				m.set('selected', false);
			});

			if (model) {
				model.set('selected', true);
			}
		},

		removeimage: function() {
			this.each(function(m) {
				m.set('selected', false);
			});
		}
	});


	/**
	 * wp.customize.headertool.defaultslist
	 *
	 * @memberof wp.customize.headertool
	 * @alias wp.customize.headertool.defaultslist
	 *
	 * @constructor
	 * @augments wp.customize.headertool.choicelist
	 * @augments backbone.collection
	 */
	api.headertool.defaultslist = api.headertool.choicelist.extend({
		initialize: function() {
			this.type = 'default';
			this.data = _wpcustomizeheader.defaults;
			api.headertool.choicelist.prototype.initialize.apply(this);
		}
	});

})( jquery, window.wp );







