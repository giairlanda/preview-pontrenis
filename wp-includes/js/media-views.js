/******/ (() => { // webpackbootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 1:
/***/ ((module) => {

var menuitem = wp.media.view.menuitem,
	prioritylist = wp.media.view.prioritylist,
	menu;

/**
 * wp.media.view.menu
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view.prioritylist
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
menu = prioritylist.extend(/** @lends wp.media.view.menu.prototype */{
	tagname:   'div',
	classname: 'media-menu',
	property:  'state',
	itemview:  menuitem,
	region:    'menu',

	attributes: {
		role:               'tablist',
		'aria-orientation': 'horizontal'
	},

	initialize: function() {
		this._views = {};

		this.set( _.extend( {}, this._views, this.options.views ), { silent: true });
		delete this.options.views;

		if ( ! this.options.silent ) {
			this.render();
		}

		// initialize the focus manager.
		this.focusmanager = new wp.media.view.focusmanager( {
			el:   this.el,
			mode: 'tabsnavigation'
		} );

		// the menu is always rendered and can be visible or hidden on some frames.
		this.isvisible = true;
	},

	/**
	 * @param {object} options
	 * @param {string} id
	 * @return {wp.media.view}
	 */
	toview: function( options, id ) {
		options = options || {};
		options[ this.property ] = options[ this.property ] || id;
		return new this.itemview( options ).render();
	},

	ready: function() {
		/**
		 * call 'ready' directly on the parent class
		 */
		prioritylist.prototype.ready.apply( this, arguments );
		this.visibility();

		// set up aria tabs initial attributes.
		this.focusmanager.setupariatabs();
	},

	set: function() {
		/**
		 * call 'set' directly on the parent class
		 */
		prioritylist.prototype.set.apply( this, arguments );
		this.visibility();
	},

	unset: function() {
		/**
		 * call 'unset' directly on the parent class
		 */
		prioritylist.prototype.unset.apply( this, arguments );
		this.visibility();
	},

	visibility: function() {
		var region = this.region,
			view = this.controller[ region ].get(),
			views = this.views.get(),
			hide = ! views || views.length < 2;

		if ( this === view ) {
			// flag this menu as hidden or visible.
			this.isvisible = ! hide;
			// set or remove a css class to hide the menu.
			this.controller.$el.toggleclass( 'hide-' + region, hide );
		}
	},
	/**
	 * @param {string} id
	 */
	select: function( id ) {
		var view = this.get( id );

		if ( ! view ) {
			return;
		}

		this.deselect();
		view.$el.addclass('active');

		// set up again the aria tabs initial attributes after the menu updates.
		this.focusmanager.setupariatabs();
	},

	deselect: function() {
		this.$el.children().removeclass('active');
	},

	hide: function( id ) {
		var view = this.get( id );

		if ( ! view ) {
			return;
		}

		view.$el.addclass('hidden');
	},

	show: function( id ) {
		var view = this.get( id );

		if ( ! view ) {
			return;
		}

		view.$el.removeclass('hidden');
	}
});

module.exports = menu;


/***/ }),

/***/ 168:
/***/ ((module) => {

var $ = backbone.$,
	buttongroup;

/**
 * wp.media.view.buttongroup
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
buttongroup = wp.media.view.extend(/** @lends wp.media.view.buttongroup.prototype */{
	tagname:   'div',
	classname: 'button-group button-large media-button-group',

	initialize: function() {
		/**
		 * @member {wp.media.view.button[]}
		 */
		this.buttons = _.map( this.options.buttons || [], function( button ) {
			if ( button instanceof backbone.view ) {
				return button;
			} else {
				return new wp.media.view.button( button ).render();
			}
		});

		delete this.options.buttons;

		if ( this.options.classes ) {
			this.$el.addclass( this.options.classes );
		}
	},

	/**
	 * @return {wp.media.view.buttongroup}
	 */
	render: function() {
		this.$el.html( $( _.pluck( this.buttons, 'el' ) ).detach() );
		return this;
	}
});

module.exports = buttongroup;


/***/ }),

/***/ 170:
/***/ ((module) => {

/**
 * wp.media.view.heading
 *
 * a reusable heading component for the media library
 *
 * used to add accessibility friendly headers in the media library/modal.
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var heading = wp.media.view.extend( {
	tagname: function() {
		return this.options.level || 'h1';
	},
	classname: 'media-views-heading',

	initialize: function() {

		if ( this.options.classname ) {
			this.$el.addclass( this.options.classname );
		}

		this.text = this.options.text;
	},

	render: function() {
		this.$el.html( this.text );
		return this;
	}
} );

module.exports = heading;


/***/ }),

/***/ 397:
/***/ ((module) => {

var select = wp.media.view.toolbar.select,
	l10n = wp.media.view.l10n,
	embed;

/**
 * wp.media.view.toolbar.embed
 *
 * @memberof wp.media.view.toolbar
 *
 * @class
 * @augments wp.media.view.toolbar.select
 * @augments wp.media.view.toolbar
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
embed = select.extend(/** @lends wp.media.view.toolbar.embed.prototype */{
	initialize: function() {
		_.defaults( this.options, {
			text: l10n.insertintopost,
			requires: false
		});
		// call 'initialize' directly on the parent class.
		select.prototype.initialize.apply( this, arguments );
	},

	refresh: function() {
		var url = this.controller.state().props.get('url');
		this.get('select').model.set( 'disabled', ! url || url === 'http://' );
		/**
		 * call 'refresh' directly on the parent class
		 */
		select.prototype.refresh.apply( this, arguments );
	}
});

module.exports = embed;


/***/ }),

/***/ 443:
/***/ ((module) => {

var view = wp.media.view,
	siteiconcropper;

/**
 * wp.media.view.siteiconcropper
 *
 * uses the imgareaselect plugin to allow a user to crop a site icon.
 *
 * takes imgareaselect options from
 * wp.customize.siteiconcontrol.calculateimageselectoptions.
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view.cropper
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
siteiconcropper = view.cropper.extend(/** @lends wp.media.view.siteiconcropper.prototype */{
	classname: 'crop-content site-icon',

	ready: function () {
		view.cropper.prototype.ready.apply( this, arguments );

		this.$( '.crop-image' ).on( 'load', _.bind( this.addsidebar, this ) );
	},

	addsidebar: function() {
		this.sidebar = new wp.media.view.sidebar({
			controller: this.controller
		});

		this.sidebar.set( 'preview', new wp.media.view.siteiconpreview({
			controller: this.controller,
			attachment: this.options.attachment
		}) );

		this.controller.cropperview.views.add( this.sidebar );
	}
});

module.exports = siteiconcropper;


/***/ }),

/***/ 455:
/***/ ((module) => {

var mediaframe = wp.media.view.mediaframe,
	l10n = wp.media.view.l10n,
	select;

/**
 * wp.media.view.mediaframe.select
 *
 * a frame for selecting an item or items from the media library.
 *
 * @memberof wp.media.view.mediaframe
 *
 * @class
 * @augments wp.media.view.mediaframe
 * @augments wp.media.view.frame
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 * @mixes wp.media.controller.statemachine
 */
select = mediaframe.extend(/** @lends wp.media.view.mediaframe.select.prototype */{
	initialize: function() {
		// call 'initialize' directly on the parent class.
		mediaframe.prototype.initialize.apply( this, arguments );

		_.defaults( this.options, {
			selection: [],
			library:   {},
			multiple:  false,
			state:    'library'
		});

		this.createselection();
		this.createstates();
		this.bindhandlers();
	},

	/**
	 * attach a selection collection to the frame.
	 *
	 * a selection is a collection of attachments used for a specific purpose
	 * by a media frame. e.g. selecting an attachment (or many) to insert into
	 * post content.
	 *
	 * @see media.model.selection
	 */
	createselection: function() {
		var selection = this.options.selection;

		if ( ! (selection instanceof wp.media.model.selection) ) {
			this.options.selection = new wp.media.model.selection( selection, {
				multiple: this.options.multiple
			});
		}

		this._selection = {
			attachments: new wp.media.model.attachments(),
			difference: []
		};
	},

	editimagecontent: function() {
		var image = this.state().get('image'),
			view = new wp.media.view.editimage( { model: image, controller: this } ).render();

		this.content.set( view );

		// after creating the wrapper view, load the actual editor via an ajax call.
		view.loadeditor();
	},

	/**
	 * create the default states on the frame.
	 */
	createstates: function() {
		var options = this.options;

		if ( this.options.states ) {
			return;
		}

		// add the default states.
		this.states.add([
			// main states.
			new wp.media.controller.library({
				library:   wp.media.query( options.library ),
				multiple:  options.multiple,
				title:     options.title,
				priority:  20
			}),
			new wp.media.controller.editimage( { model: options.editimage } )
		]);
	},

	/**
	 * bind region mode event callbacks.
	 *
	 * @see media.controller.region.render
	 */
	bindhandlers: function() {
		this.on( 'router:create:browse', this.createrouter, this );
		this.on( 'router:render:browse', this.browserouter, this );
		this.on( 'content:create:browse', this.browsecontent, this );
		this.on( 'content:render:upload', this.uploadcontent, this );
		this.on( 'toolbar:create:select', this.createselecttoolbar, this );
		this.on( 'content:render:edit-image', this.editimagecontent, this );
	},

	/**
	 * render callback for the router region in the `browse` mode.
	 *
	 * @param {wp.media.view.router} routerview
	 */
	browserouter: function( routerview ) {
		routerview.set({
			upload: {
				text:     l10n.uploadfilestitle,
				priority: 20
			},
			browse: {
				text:     l10n.medialibrarytitle,
				priority: 40
			}
		});
	},

	/**
	 * render callback for the content region in the `browse` mode.
	 *
	 * @param {wp.media.controller.region} contentregion
	 */
	browsecontent: function( contentregion ) {
		var state = this.state();

		this.$el.removeclass('hide-toolbar');

		// browse our library of attachments.
		contentregion.view = new wp.media.view.attachmentsbrowser({
			controller: this,
			collection: state.get('library'),
			selection:  state.get('selection'),
			model:      state,
			sortable:   state.get('sortable'),
			search:     state.get('searchable'),
			filters:    state.get('filterable'),
			date:       state.get('date'),
			display:    state.has('display') ? state.get('display') : state.get('displaysettings'),
			draginfo:   state.get('draginfo'),

			idealcolumnwidth: state.get('idealcolumnwidth'),
			suggestedwidth:   state.get('suggestedwidth'),
			suggestedheight:  state.get('suggestedheight'),

			attachmentview: state.get('attachmentview')
		});
	},

	/**
	 * render callback for the content region in the `upload` mode.
	 */
	uploadcontent: function() {
		this.$el.removeclass( 'hide-toolbar' );
		this.content.set( new wp.media.view.uploaderinline({
			controller: this
		}) );
	},

	/**
	 * toolbars
	 *
	 * @param {object} toolbar
	 * @param {object} [options={}]
	 * @this wp.media.controller.region
	 */
	createselecttoolbar: function( toolbar, options ) {
		options = options || this.options.button || {};
		options.controller = this;

		toolbar.view = new wp.media.view.toolbar.select( options );
	}
});

module.exports = select;


/***/ }),

/***/ 472:
/***/ ((module) => {

var l10n = wp.media.view.l10n,
	getusersetting = window.getusersetting,
	setusersetting = window.setusersetting,
	library;

/**
 * wp.media.controller.library
 *
 * a state for choosing an attachment or group of attachments from the media library.
 *
 * @memberof wp.media.controller
 *
 * @class
 * @augments wp.media.controller.state
 * @augments backbone.model
 * @mixes media.selectionsync
 *
 * @param {object}                          [attributes]                         the attributes hash passed to the state.
 * @param {string}                          [attributes.id=library]              unique identifier.
 * @param {string}                          [attributes.title=media library]     title for the state. displays in the media menu and the frame's title region.
 * @param {wp.media.model.attachments}      [attributes.library]                 the attachments collection to browse.
 *                                                                               if one is not supplied, a collection of all attachments will be created.
 * @param {wp.media.model.selection|object} [attributes.selection]               a collection to contain attachment selections within the state.
 *                                                                               if the 'selection' attribute is a plain js object,
 *                                                                               a selection will be created using its values as the selection instance's `props` model.
 *                                                                               otherwise, it will copy the library's `props` model.
 * @param {boolean}                         [attributes.multiple=false]          whether multi-select is enabled.
 * @param {string}                          [attributes.content=upload]          initial mode for the content region.
 *                                                                               overridden by persistent user setting if 'contentusersetting' is true.
 * @param {string}                          [attributes.menu=default]            initial mode for the menu region.
 * @param {string}                          [attributes.router=browse]           initial mode for the router region.
 * @param {string}                          [attributes.toolbar=select]          initial mode for the toolbar region.
 * @param {boolean}                         [attributes.searchable=true]         whether the library is searchable.
 * @param {boolean|string}                  [attributes.filterable=false]        whether the library is filterable, and if so what filters should be shown.
 *                                                                               accepts 'all', 'uploaded', or 'unattached'.
 * @param {boolean}                         [attributes.sortable=true]           whether the attachments should be sortable. depends on the orderby property being set to menuorder on the attachments collection.
 * @param {boolean}                         [attributes.autoselect=true]         whether an uploaded attachment should be automatically added to the selection.
 * @param {boolean}                         [attributes.describe=false]          whether to offer ui to describe attachments - e.g. captioning images in a gallery.
 * @param {boolean}                         [attributes.contentusersetting=true] whether the content region's mode should be set and persisted per user.
 * @param {boolean}                         [attributes.syncselection=true]      whether the attachments selection should be persisted from the last state.
 */
library = wp.media.controller.state.extend(/** @lends wp.media.controller.library.prototype */{
	defaults: {
		id:                 'library',
		title:              l10n.medialibrarytitle,
		multiple:           false,
		content:            'upload',
		menu:               'default',
		router:             'browse',
		toolbar:            'select',
		searchable:         true,
		filterable:         false,
		sortable:           true,
		autoselect:         true,
		describe:           false,
		contentusersetting: true,
		syncselection:      true
	},

	/**
	 * if a library isn't provided, query all media items.
	 * if a selection instance isn't provided, create one.
	 *
	 * @since 3.5.0
	 */
	initialize: function() {
		var selection = this.get('selection'),
			props;

		if ( ! this.get('library') ) {
			this.set( 'library', wp.media.query() );
		}

		if ( ! ( selection instanceof wp.media.model.selection ) ) {
			props = selection;

			if ( ! props ) {
				props = this.get('library').props.tojson();
				props = _.omit( props, 'orderby', 'query' );
			}

			this.set( 'selection', new wp.media.model.selection( null, {
				multiple: this.get('multiple'),
				props: props
			}) );
		}

		this.resetdisplays();
	},

	/**
	 * @since 3.5.0
	 */
	activate: function() {
		this.syncselection();

		wp.uploader.queue.on( 'add', this.uploading, this );

		this.get('selection').on( 'add remove reset', this.refreshcontent, this );

		if ( this.get( 'router' ) && this.get('contentusersetting') ) {
			this.frame.on( 'content:activate', this.savecontentmode, this );
			this.set( 'content', getusersetting( 'librarycontent', this.get('content') ) );
		}
	},

	/**
	 * @since 3.5.0
	 */
	deactivate: function() {
		this.recordselection();

		this.frame.off( 'content:activate', this.savecontentmode, this );

		// unbind all event handlers that use this state as the context
		// from the selection.
		this.get('selection').off( null, null, this );

		wp.uploader.queue.off( null, null, this );
	},

	/**
	 * reset the library to its initial state.
	 *
	 * @since 3.5.0
	 */
	reset: function() {
		this.get('selection').reset();
		this.resetdisplays();
		this.refreshcontent();
	},

	/**
	 * reset the attachment display settings defaults to the site options.
	 *
	 * if site options don't define them, fall back to a persistent user setting.
	 *
	 * @since 3.5.0
	 */
	resetdisplays: function() {
		var defaultprops = wp.media.view.settings.defaultprops;
		this._displays = [];
		this._defaultdisplaysettings = {
			align: getusersetting( 'align', defaultprops.align ) || 'none',
			size:  getusersetting( 'imgsize', defaultprops.size ) || 'medium',
			link:  getusersetting( 'urlbutton', defaultprops.link ) || 'none'
		};
	},

	/**
	 * create a model to represent display settings (alignment, etc.) for an attachment.
	 *
	 * @since 3.5.0
	 *
	 * @param {wp.media.model.attachment} attachment
	 * @return {backbone.model}
	 */
	display: function( attachment ) {
		var displays = this._displays;

		if ( ! displays[ attachment.cid ] ) {
			displays[ attachment.cid ] = new backbone.model( this.defaultdisplaysettings( attachment ) );
		}
		return displays[ attachment.cid ];
	},

	/**
	 * given an attachment, create attachment display settings properties.
	 *
	 * @since 3.6.0
	 *
	 * @param {wp.media.model.attachment} attachment
	 * @return {object}
	 */
	defaultdisplaysettings: function( attachment ) {
		var settings = _.clone( this._defaultdisplaysettings );

		settings.canembed = this.canembed( attachment );
		if ( settings.canembed ) {
			settings.link = 'embed';
		} else if ( ! this.isimageattachment( attachment ) && settings.link === 'none' ) {
			settings.link = 'file';
		}

		return settings;
	},

	/**
	 * whether an attachment is image.
	 *
	 * @since 4.4.1
	 *
	 * @param {wp.media.model.attachment} attachment
	 * @return {boolean}
	 */
	isimageattachment: function( attachment ) {
		// if uploading, we know the filename but not the mime type.
		if ( attachment.get('uploading') ) {
			return /\.(jpe?g|png|gif|webp|avif|heic|heif)$/i.test( attachment.get('filename') );
		}

		return attachment.get('type') === 'image';
	},

	/**
	 * whether an attachment can be embedded (audio or video).
	 *
	 * @since 3.6.0
	 *
	 * @param {wp.media.model.attachment} attachment
	 * @return {boolean}
	 */
	canembed: function( attachment ) {
		// if uploading, we know the filename but not the mime type.
		if ( ! attachment.get('uploading') ) {
			var type = attachment.get('type');
			if ( type !== 'audio' && type !== 'video' ) {
				return false;
			}
		}

		return _.contains( wp.media.view.settings.embedexts, attachment.get('filename').split('.').pop() );
	},


	/**
	 * if the state is active, no items are selected, and the current
	 * content mode is not an option in the state's router (provided
	 * the state has a router), reset the content mode to the default.
	 *
	 * @since 3.5.0
	 */
	refreshcontent: function() {
		var selection = this.get('selection'),
			frame = this.frame,
			router = frame.router.get(),
			mode = frame.content.mode();

		if ( this.active && ! selection.length && router && ! router.get( mode ) ) {
			this.frame.content.render( this.get('content') );
		}
	},

	/**
	 * callback handler when an attachment is uploaded.
	 *
	 * switch to the media library if uploaded from the 'upload files' tab.
	 *
	 * adds any uploading attachments to the selection.
	 *
	 * if the state only supports one attachment to be selected and multiple
	 * attachments are uploaded, the last attachment in the upload queue will
	 * be selected.
	 *
	 * @since 3.5.0
	 *
	 * @param {wp.media.model.attachment} attachment
	 */
	uploading: function( attachment ) {
		var content = this.frame.content;

		if ( 'upload' === content.mode() ) {
			this.frame.content.mode('browse');
		}

		if ( this.get( 'autoselect' ) ) {
			this.get('selection').add( attachment );
			this.frame.trigger( 'library:selection:add' );
		}
	},

	/**
	 * persist the mode of the content region as a user setting.
	 *
	 * @since 3.5.0
	 */
	savecontentmode: function() {
		if ( 'browse' !== this.get('router') ) {
			return;
		}

		var mode = this.frame.content.mode(),
			view = this.frame.router.get();

		if ( view && view.get( mode ) ) {
			setusersetting( 'librarycontent', mode );
		}
	}

});

// make selectionsync available on any media library state.
_.extend( library.prototype, wp.media.selectionsync );

module.exports = library;


/***/ }),

/***/ 705:
/***/ ((module) => {

var state = wp.media.controller.state,
	library = wp.media.controller.library,
	l10n = wp.media.view.l10n,
	imagedetails;

/**
 * wp.media.controller.imagedetails
 *
 * a state for editing the attachment display settings of an image that's been
 * inserted into the editor.
 *
 * @memberof wp.media.controller
 *
 * @class
 * @augments wp.media.controller.state
 * @augments backbone.model
 *
 * @param {object}                    [attributes]                       the attributes hash passed to the state.
 * @param {string}                    [attributes.id=image-details]      unique identifier.
 * @param {string}                    [attributes.title=image details]   title for the state. displays in the frame's title region.
 * @param {wp.media.model.attachment} attributes.image                   the image's model.
 * @param {string|false}              [attributes.content=image-details] initial mode for the content region.
 * @param {string|false}              [attributes.menu=false]            initial mode for the menu region.
 * @param {string|false}              [attributes.router=false]          initial mode for the router region.
 * @param {string|false}              [attributes.toolbar=image-details] initial mode for the toolbar region.
 * @param {boolean}                   [attributes.editing=false]         unused.
 * @param {int}                       [attributes.priority=60]           unused.
 *
 * @todo this state inherits some defaults from media.controller.library.prototype.defaults,
 *       however this may not do anything.
 */
imagedetails = state.extend(/** @lends wp.media.controller.imagedetails.prototype */{
	defaults: _.defaults({
		id:       'image-details',
		title:    l10n.imagedetailstitle,
		content:  'image-details',
		menu:     false,
		router:   false,
		toolbar:  'image-details',
		editing:  false,
		priority: 60
	}, library.prototype.defaults ),

	/**
	 * @since 3.9.0
	 *
	 * @param options attributes
	 */
	initialize: function( options ) {
		this.image = options.image;
		state.prototype.initialize.apply( this, arguments );
	},

	/**
	 * @since 3.9.0
	 */
	activate: function() {
		this.frame.modal.$el.addclass('image-details');
	}
});

module.exports = imagedetails;


/***/ }),

/***/ 718:
/***/ ((module) => {

var $ = jquery;

/**
 * wp.media.view.focusmanager
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var focusmanager = wp.media.view.extend(/** @lends wp.media.view.focusmanager.prototype */{

	events: {
		'keydown': 'focusmanagementmode'
	},

	/**
	 * initializes the focus manager.
	 *
	 * @param {object} options the focus manager options.
	 *
	 * @since 5.3.0
	 *
	 * @return {void}
	 */
	initialize: function( options ) {
		this.mode                    = options.mode || 'constraintabbing';
		this.tabsautomaticactivation = options.tabsautomaticactivation || false;
	},

 	/**
	 * determines which focus management mode to use.
	 *
	 * @since 5.3.0
	 *
	 * @param {object} event jquery event object.
	 *
	 * @return {void}
	 */
	focusmanagementmode: function( event ) {
		if ( this.mode === 'constraintabbing' ) {
			this.constraintabbing( event );
		}

		if ( this.mode === 'tabsnavigation' ) {
			this.tabsnavigation( event );
		}
	},

	/**
	 * gets all the tabbable elements.
	 *
	 * @since 5.3.0
	 *
	 * @return {object} a jquery collection of tabbable elements.
	 */
	gettabbables: function() {
		// skip the file input added by plupload.
		return this.$( ':tabbable' ).not( '.moxie-shim input[type="file"]' );
	},

	/**
	 * moves focus to the modal dialog.
	 *
	 * @since 3.5.0
	 *
	 * @return {void}
	 */
	focus: function() {
		this.$( '.media-modal' ).trigger( 'focus' );
	},

	/**
	 * constrains navigation with the tab key within the media view element.
	 *
	 * @since 4.0.0
	 *
	 * @param {object} event a keydown jquery event.
	 *
	 * @return {void}
	 */
	constraintabbing: function( event ) {
		var tabbables;

		// look for the tab key.
		if ( 9 !== event.keycode ) {
			return;
		}

		tabbables = this.gettabbables();

		// keep tab focus within media modal while it's open.
		if ( tabbables.last()[0] === event.target && ! event.shiftkey ) {
			tabbables.first().focus();
			return false;
		} else if ( tabbables.first()[0] === event.target && event.shiftkey ) {
			tabbables.last().focus();
			return false;
		}
	},

	/**
	 * hides from assistive technologies all the body children.
	 *
	 * sets an `aria-hidden="true"` attribute on all the body children except
	 * the provided element and other elements that should not be hidden.
	 *
	 * the reason why we use `aria-hidden` is that `aria-modal="true"` is buggy
	 * in safari 11.1 and support is spotty in other browsers. also, `aria-modal="true"`
	 * prevents the `wp.a11y.speak()` aria live regions to work as they're outside
	 * of the modal dialog and get hidden from assistive technologies.
	 *
	 * @since 5.2.3
	 *
	 * @param {object} visibleelement the jquery object representing the element that should not be hidden.
	 *
	 * @return {void}
	 */
	setariahiddenonbodychildren: function( visibleelement ) {
		var bodychildren,
			self = this;

		if ( this.isbodyariahidden ) {
			return;
		}

		// get all the body children.
		bodychildren = document.body.children;

		// loop through the body children and hide the ones that should be hidden.
		_.each( bodychildren, function( element ) {
			// don't hide the modal element.
			if ( element === visibleelement[0] ) {
				return;
			}

			// determine the body children to hide.
			if ( self.elementshouldbehidden( element ) ) {
				element.setattribute( 'aria-hidden', 'true' );
				// store the hidden elements.
				self.ariahiddenelements.push( element );
			}
		} );

		this.isbodyariahidden = true;
	},

	/**
	 * unhides from assistive technologies all the body children.
	 *
	 * makes visible again to assistive technologies all the body children
	 * previously hidden and stored in this.ariahiddenelements.
	 *
	 * @since 5.2.3
	 *
	 * @return {void}
	 */
	removeariahiddenfrombodychildren: function() {
		_.each( this.ariahiddenelements, function( element ) {
			element.removeattribute( 'aria-hidden' );
		} );

		this.ariahiddenelements = [];
		this.isbodyariahidden   = false;
	},

	/**
	 * determines if the passed element should not be hidden from assistive technologies.
	 *
	 * @since 5.2.3
	 *
	 * @param {object} element the dom element that should be checked.
	 *
	 * @return {boolean} whether the element should not be hidden from assistive technologies.
	 */
	elementshouldbehidden: function( element ) {
		var role = element.getattribute( 'role' ),
			liveregionsroles = [ 'alert', 'status', 'log', 'marquee', 'timer' ];

		/*
		 * don't hide scripts, elements that already have `aria-hidden`, and
		 * aria live regions.
		 */
		return ! (
			element.tagname === 'script' ||
			element.hasattribute( 'aria-hidden' ) ||
			element.hasattribute( 'aria-live' ) ||
			liveregionsroles.indexof( role ) !== -1
		);
	},

	/**
	 * whether the body children are hidden from assistive technologies.
	 *
	 * @since 5.2.3
	 */
	isbodyariahidden: false,

	/**
	 * stores an array of dom elements that should be hidden from assistive
	 * technologies, for example when the media modal dialog opens.
	 *
	 * @since 5.2.3
	 */
	ariahiddenelements: [],

	/**
	 * holds the jquery collection of aria tabs.
	 *
	 * @since 5.3.0
	 */
	tabs: $(),

	/**
	 * sets up tabs in an aria tabbed interface.
	 *
	 * @since 5.3.0
	 *
	 * @param {object} event jquery event object.
	 *
	 * @return {void}
	 */
	setupariatabs: function() {
		this.tabs = this.$( '[role="tab"]' );

		// set up initial attributes.
		this.tabs.attr( {
			'aria-selected': 'false',
			tabindex: '-1'
		} );

		// set up attributes on the initially active tab.
		this.tabs.filter( '.active' )
			.removeattr( 'tabindex' )
			.attr( 'aria-selected', 'true' );
	},

	/**
	 * enables arrows navigation within the aria tabbed interface.
	 *
	 * @since 5.3.0
	 *
	 * @param {object} event jquery event object.
	 *
	 * @return {void}
	 */
	tabsnavigation: function( event ) {
		var orientation = 'horizontal',
			keys = [ 32, 35, 36, 37, 38, 39, 40 ];

		// return if not spacebar, end, home, or arrow keys.
		if ( keys.indexof( event.which ) === -1 ) {
			return;
		}

		// determine navigation direction.
		if ( this.$el.attr( 'aria-orientation' ) === 'vertical' ) {
			orientation = 'vertical';
		}

		// make up and down arrow keys do nothing with horizontal tabs.
		if ( orientation === 'horizontal' && [ 38, 40 ].indexof( event.which ) !== -1 ) {
			return;
		}

		// make left and right arrow keys do nothing with vertical tabs.
		if ( orientation === 'vertical' && [ 37, 39 ].indexof( event.which ) !== -1 ) {
			return;
		}

		this.switchtabs( event, this.tabs );
	},

	/**
	 * switches tabs in the aria tabbed interface.
	 *
	 * @since 5.3.0
	 *
	 * @param {object} event jquery event object.
	 *
	 * @return {void}
	 */
	switchtabs: function( event ) {
		var key   = event.which,
			index = this.tabs.index( $( event.target ) ),
			newindex;

		switch ( key ) {
			// space bar: activate current targeted tab.
			case 32: {
				this.activatetab( this.tabs[ index ] );
				break;
			}
			// end key: activate last tab.
			case 35: {
				event.preventdefault();
				this.activatetab( this.tabs[ this.tabs.length - 1 ] );
				break;
			}
			// home key: activate first tab.
			case 36: {
				event.preventdefault();
				this.activatetab( this.tabs[ 0 ] );
				break;
			}
			// left and up keys: activate previous tab.
			case 37:
			case 38: {
				event.preventdefault();
				newindex = ( index - 1 ) < 0 ? this.tabs.length - 1 : index - 1;
				this.activatetab( this.tabs[ newindex ] );
				break;
			}
			// right and down keys: activate next tab.
			case 39:
			case 40: {
				event.preventdefault();
				newindex = ( index + 1 ) === this.tabs.length ? 0 : index + 1;
				this.activatetab( this.tabs[ newindex ] );
				break;
			}
		}
	},

	/**
	 * sets a single tab to be focusable and semantically selected.
	 *
	 * @since 5.3.0
	 *
	 * @param {object} tab the tab dom element.
	 *
	 * @return {void}
	 */
	activatetab: function( tab ) {
		if ( ! tab ) {
			return;
		}

		// the tab is a dom element: no need for jquery methods.
		tab.focus();

		// handle automatic activation.
		if ( this.tabsautomaticactivation ) {
			tab.removeattribute( 'tabindex' );
			tab.setattribute( 'aria-selected', 'true' );
			tab.click();

			return;
		}

		// handle manual activation.
		$( tab ).on( 'click', function() {
			tab.removeattribute( 'tabindex' );
			tab.setattribute( 'aria-selected', 'true' );
		} );
 	}
});

module.exports = focusmanager;


/***/ }),

/***/ 846:
/***/ ((module) => {

/**
 * wp.media.view.button
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var button = wp.media.view.extend(/** @lends wp.media.view.button.prototype */{
	tagname:    'button',
	classname:  'media-button',
	attributes: { type: 'button' },

	events: {
		'click': 'click'
	},

	defaults: {
		text:     '',
		style:    '',
		size:     'large',
		disabled: false
	},

	initialize: function() {
		/**
		 * create a model with the provided `defaults`.
		 *
		 * @member {backbone.model}
		 */
		this.model = new backbone.model( this.defaults );

		// if any of the `options` have a key from `defaults`, apply its
		// value to the `model` and remove it from the `options` object.
		_.each( this.defaults, function( def, key ) {
			var value = this.options[ key ];
			if ( _.isundefined( value ) ) {
				return;
			}

			this.model.set( key, value );
			delete this.options[ key ];
		}, this );

		this.listento( this.model, 'change', this.render );
	},
	/**
	 * @return {wp.media.view.button} returns itself to allow chaining.
	 */
	render: function() {
		var classes = [ 'button', this.classname ],
			model = this.model.tojson();

		if ( model.style ) {
			classes.push( 'button-' + model.style );
		}

		if ( model.size ) {
			classes.push( 'button-' + model.size );
		}

		classes = _.uniq( classes.concat( this.options.classes ) );
		this.el.classname = classes.join(' ');

		this.$el.attr( 'disabled', model.disabled );
		this.$el.text( this.model.get('text') );

		return this;
	},
	/**
	 * @param {object} event
	 */
	click: function( event ) {
		if ( '#' === this.attributes.href ) {
			event.preventdefault();
		}

		if ( this.options.click && ! this.model.get('disabled') ) {
			this.options.click.apply( this, arguments );
		}
	}
});

module.exports = button;


/***/ }),

/***/ 1061:
/***/ ((module) => {

/**
 * wp.media.view.frame
 *
 * a frame is a composite view consisting of one or more regions and one or more
 * states.
 *
 * @memberof wp.media.view
 *
 * @see wp.media.controller.state
 * @see wp.media.controller.region
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 * @mixes wp.media.controller.statemachine
 */
var frame = wp.media.view.extend(/** @lends wp.media.view.frame.prototype */{
	initialize: function() {
		_.defaults( this.options, {
			mode: [ 'select' ]
		});
		this._createregions();
		this._createstates();
		this._createmodes();
	},

	_createregions: function() {
		// clone the regions array.
		this.regions = this.regions ? this.regions.slice() : [];

		// initialize regions.
		_.each( this.regions, function( region ) {
			this[ region ] = new wp.media.controller.region({
				view:     this,
				id:       region,
				selector: '.media-frame-' + region
			});
		}, this );
	},
	/**
	 * create the frame's states.
	 *
	 * @see wp.media.controller.state
	 * @see wp.media.controller.statemachine
	 *
	 * @fires wp.media.controller.state#ready
	 */
	_createstates: function() {
		// create the default `states` collection.
		this.states = new backbone.collection( null, {
			model: wp.media.controller.state
		});

		// ensure states have a reference to the frame.
		this.states.on( 'add', function( model ) {
			model.frame = this;
			model.trigger('ready');
		}, this );

		if ( this.options.states ) {
			this.states.add( this.options.states );
		}
	},

	/**
	 * a frame can be in a mode or multiple modes at one time.
	 *
	 * for example, the manage media frame can be in the `bulk select` or `edit` mode.
	 */
	_createmodes: function() {
		// store active "modes" that the frame is in. unrelated to region modes.
		this.activemodes = new backbone.collection();
		this.activemodes.on( 'add remove reset', _.bind( this.triggermodeevents, this ) );

		_.each( this.options.mode, function( mode ) {
			this.activatemode( mode );
		}, this );
	},
	/**
	 * reset all states on the frame to their defaults.
	 *
	 * @return {wp.media.view.frame} returns itself to allow chaining.
	 */
	reset: function() {
		this.states.invoke( 'trigger', 'reset' );
		return this;
	},
	/**
	 * map activemode collection events to the frame.
	 */
	triggermodeevents: function( model, collection, options ) {
		var collectionevent,
			modeeventmap = {
				add: 'activate',
				remove: 'deactivate'
			},
			eventtotrigger;
		// probably a better way to do this.
		_.each( options, function( value, key ) {
			if ( value ) {
				collectionevent = key;
			}
		} );

		if ( ! _.has( modeeventmap, collectionevent ) ) {
			return;
		}

		eventtotrigger = model.get('id') + ':' + modeeventmap[collectionevent];
		this.trigger( eventtotrigger );
	},
	/**
	 * activate a mode on the frame.
	 *
	 * @param string mode mode id.
	 * @return {this} returns itself to allow chaining.
	 */
	activatemode: function( mode ) {
		// bail if the mode is already active.
		if ( this.ismodeactive( mode ) ) {
			return;
		}
		this.activemodes.add( [ { id: mode } ] );
		// add a css class to the frame so elements can be styled for the mode.
		this.$el.addclass( 'mode-' + mode );

		return this;
	},
	/**
	 * deactivate a mode on the frame.
	 *
	 * @param string mode mode id.
	 * @return {this} returns itself to allow chaining.
	 */
	deactivatemode: function( mode ) {
		// bail if the mode isn't active.
		if ( ! this.ismodeactive( mode ) ) {
			return this;
		}
		this.activemodes.remove( this.activemodes.where( { id: mode } ) );
		this.$el.removeclass( 'mode-' + mode );
		/**
		 * frame mode deactivation event.
		 *
		 * @event wp.media.view.frame#{mode}:deactivate
		 */
		this.trigger( mode + ':deactivate' );

		return this;
	},
	/**
	 * check if a mode is enabled on the frame.
	 *
	 * @param string mode mode id.
	 * @return bool
	 */
	ismodeactive: function( mode ) {
		return boolean( this.activemodes.where( { id: mode } ).length );
	}
});

// make the `frame` a `statemachine`.
_.extend( frame.prototype, wp.media.controller.statemachine.prototype );

module.exports = frame;


/***/ }),

/***/ 1169:
/***/ ((module) => {

var attachment = wp.media.model.attachment,
	library = wp.media.controller.library,
	l10n = wp.media.view.l10n,
	featuredimage;

/**
 * wp.media.controller.featuredimage
 *
 * a state for selecting a featured image for a post.
 *
 * @memberof wp.media.controller
 *
 * @class
 * @augments wp.media.controller.library
 * @augments wp.media.controller.state
 * @augments backbone.model
 *
 * @param {object}                     [attributes]                          the attributes hash passed to the state.
 * @param {string}                     [attributes.id=featured-image]        unique identifier.
 * @param {string}                     [attributes.title=set featured image] title for the state. displays in the media menu and the frame's title region.
 * @param {wp.media.model.attachments} [attributes.library]                  the attachments collection to browse.
 *                                                                           if one is not supplied, a collection of all images will be created.
 * @param {boolean}                    [attributes.multiple=false]           whether multi-select is enabled.
 * @param {string}                     [attributes.content=upload]           initial mode for the content region.
 *                                                                           overridden by persistent user setting if 'contentusersetting' is true.
 * @param {string}                     [attributes.menu=default]             initial mode for the menu region.
 * @param {string}                     [attributes.router=browse]            initial mode for the router region.
 * @param {string}                     [attributes.toolbar=featured-image]   initial mode for the toolbar region.
 * @param {int}                        [attributes.priority=60]              the priority for the state link in the media menu.
 * @param {boolean}                    [attributes.searchable=true]          whether the library is searchable.
 * @param {boolean|string}             [attributes.filterable=false]         whether the library is filterable, and if so what filters should be shown.
 *                                                                           accepts 'all', 'uploaded', or 'unattached'.
 * @param {boolean}                    [attributes.sortable=true]            whether the attachments should be sortable. depends on the orderby property being set to menuorder on the attachments collection.
 * @param {boolean}                    [attributes.autoselect=true]          whether an uploaded attachment should be automatically added to the selection.
 * @param {boolean}                    [attributes.describe=false]           whether to offer ui to describe attachments - e.g. captioning images in a gallery.
 * @param {boolean}                    [attributes.contentusersetting=true]  whether the content region's mode should be set and persisted per user.
 * @param {boolean}                    [attributes.syncselection=true]       whether the attachments selection should be persisted from the last state.
 */
featuredimage = library.extend(/** @lends wp.media.controller.featuredimage.prototype */{
	defaults: _.defaults({
		id:            'featured-image',
		title:         l10n.setfeaturedimagetitle,
		multiple:      false,
		filterable:    'uploaded',
		toolbar:       'featured-image',
		priority:      60,
		syncselection: true
	}, library.prototype.defaults ),

	/**
	 * @since 3.5.0
	 */
	initialize: function() {
		var library, comparator;

		// if we haven't been provided a `library`, create a `selection`.
		if ( ! this.get('library') ) {
			this.set( 'library', wp.media.query({ type: 'image' }) );
		}

		library.prototype.initialize.apply( this, arguments );

		library    = this.get('library');
		comparator = library.comparator;

		// overload the library's comparator to push items that are not in
		// the mirrored query to the front of the aggregate collection.
		library.comparator = function( a, b ) {
			var ainquery = !! this.mirroring.get( a.cid ),
				binquery = !! this.mirroring.get( b.cid );

			if ( ! ainquery && binquery ) {
				return -1;
			} else if ( ainquery && ! binquery ) {
				return 1;
			} else {
				return comparator.apply( this, arguments );
			}
		};

		// add all items in the selection to the library, so any featured
		// images that are not initially loaded still appear.
		library.observe( this.get('selection') );
	},

	/**
	 * @since 3.5.0
	 */
	activate: function() {
		this.frame.on( 'open', this.updateselection, this );

		library.prototype.activate.apply( this, arguments );
	},

	/**
	 * @since 3.5.0
	 */
	deactivate: function() {
		this.frame.off( 'open', this.updateselection, this );

		library.prototype.deactivate.apply( this, arguments );
	},

	/**
	 * @since 3.5.0
	 */
	updateselection: function() {
		var selection = this.get('selection'),
			id = wp.media.view.settings.post.featuredimageid,
			attachment;

		if ( '' !== id && -1 !== id ) {
			attachment = attachment.get( id );
			attachment.fetch();
		}

		selection.reset( attachment ? [ attachment ] : [] );
	}
});

module.exports = featuredimage;


/***/ }),

/***/ 1368:
/***/ ((module) => {

var l10n = wp.media.view.l10n,
	uploaded;

/**
 * wp.media.view.attachmentfilters.uploaded
 *
 * @memberof wp.media.view.attachmentfilters
 *
 * @class
 * @augments wp.media.view.attachmentfilters
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
uploaded = wp.media.view.attachmentfilters.extend(/** @lends wp.media.view.attachmentfilters.uploaded.prototype */{
	createfilters: function() {
		var type = this.model.get('type'),
			types = wp.media.view.settings.mimetypes,
			uid = window.usersettings ? parseint( window.usersettings.uid, 10 ) : 0,
			text;

		if ( types && type ) {
			text = types[ type ];
		}

		this.filters = {
			all: {
				text:  text || l10n.allmediaitems,
				props: {
					uploadedto: null,
					orderby: 'date',
					order:   'desc',
					author:	 null
				},
				priority: 10
			},

			uploaded: {
				text:  l10n.uploadedtothispost,
				props: {
					uploadedto: wp.media.view.settings.post.id,
					orderby: 'menuorder',
					order:   'asc',
					author:	 null
				},
				priority: 20
			},

			unattached: {
				text:  l10n.unattached,
				props: {
					uploadedto: 0,
					orderby: 'menuorder',
					order:   'asc',
					author:	 null
				},
				priority: 50
			}
		};

		if ( uid ) {
			this.filters.mine = {
				text:  l10n.mine,
				props: {
					orderby: 'date',
					order:   'desc',
					author:  uid
				},
				priority: 50
			};
		}
	}
});

module.exports = uploaded;


/***/ }),

/***/ 1753:
/***/ ((module) => {

var view = wp.media.view,
	uploaderinline;

/**
 * wp.media.view.uploaderinline
 *
 * the inline uploader that shows up in the 'upload files' tab.
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
uploaderinline = view.extend(/** @lends wp.media.view.uploaderinline.prototype */{
	tagname:   'div',
	classname: 'uploader-inline',
	template:  wp.template('uploader-inline'),

	events: {
		'click .close': 'hide'
	},

	initialize: function() {
		_.defaults( this.options, {
			message: '',
			status:  true,
			canclose: false
		});

		if ( ! this.options.$browser && this.controller.uploader ) {
			this.options.$browser = this.controller.uploader.$browser;
		}

		if ( _.isundefined( this.options.postid ) ) {
			this.options.postid = wp.media.view.settings.post.id;
		}

		if ( this.options.status ) {
			this.views.set( '.upload-inline-status', new wp.media.view.uploaderstatus({
				controller: this.controller
			}) );
		}
	},

	prepare: function() {
		var suggestedwidth = this.controller.state().get('suggestedwidth'),
			suggestedheight = this.controller.state().get('suggestedheight'),
			data = {};

		data.message = this.options.message;
		data.canclose = this.options.canclose;

		if ( suggestedwidth && suggestedheight ) {
			data.suggestedwidth = suggestedwidth;
			data.suggestedheight = suggestedheight;
		}

		return data;
	},
	/**
	 * @return {wp.media.view.uploaderinline} returns itself to allow chaining.
	 */
	dispose: function() {
		if ( this.disposing ) {
			/**
			 * call 'dispose' directly on the parent class
			 */
			return view.prototype.dispose.apply( this, arguments );
		}

		/*
		 * run remove on `dispose`, so we can be sure to refresh the
		 * uploader with a view-less dom. track whether we're disposing
		 * so we don't trigger an infinite loop.
		 */
		this.disposing = true;
		return this.remove();
	},
	/**
	 * @return {wp.media.view.uploaderinline} returns itself to allow chaining.
	 */
	remove: function() {
		/**
		 * call 'remove' directly on the parent class
		 */
		var result = view.prototype.remove.apply( this, arguments );

		_.defer( _.bind( this.refresh, this ) );
		return result;
	},

	refresh: function() {
		var uploader = this.controller.uploader;

		if ( uploader ) {
			uploader.refresh();
		}
	},
	/**
	 * @return {wp.media.view.uploaderinline}
	 */
	ready: function() {
		var $browser = this.options.$browser,
			$placeholder;

		if ( this.controller.uploader ) {
			$placeholder = this.$('.browser');

			// check if we've already replaced the placeholder.
			if ( $placeholder[0] === $browser[0] ) {
				return;
			}

			$browser.detach().text( $placeholder.text() );
			$browser[0].classname = $placeholder[0].classname;
			$browser[0].setattribute( 'aria-labelledby', $browser[0].id + ' ' + $placeholder[0].getattribute('aria-labelledby') );
			$placeholder.replacewith( $browser.show() );
		}

		this.refresh();
		return this;
	},
	show: function() {
		this.$el.removeclass( 'hidden' );
		if ( this.controller.$uploadertoggler && this.controller.$uploadertoggler.length ) {
			this.controller.$uploadertoggler.attr( 'aria-expanded', 'true' );
		}
	},
	hide: function() {
		this.$el.addclass( 'hidden' );
		if ( this.controller.$uploadertoggler && this.controller.$uploadertoggler.length ) {
			this.controller.$uploadertoggler
				.attr( 'aria-expanded', 'false' )
				// move focus back to the toggle button when closing the uploader.
				.trigger( 'focus' );
		}
	}

});

module.exports = uploaderinline;


/***/ }),

/***/ 1915:
/***/ ((module) => {

var view = wp.media.view,
	$ = backbone.$,
	settings;

/**
 * wp.media.view.settings
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
settings = view.extend(/** @lends wp.media.view.settings.prototype */{
	events: {
		'click button':    'updatehandler',
		'change input':    'updatehandler',
		'change select':   'updatehandler',
		'change textarea': 'updatehandler'
	},

	initialize: function() {
		this.model = this.model || new backbone.model();
		this.listento( this.model, 'change', this.updatechanges );
	},

	prepare: function() {
		return _.defaults({
			model: this.model.tojson()
		}, this.options );
	},
	/**
	 * @return {wp.media.view.settings} returns itself to allow chaining.
	 */
	render: function() {
		view.prototype.render.apply( this, arguments );
		// select the correct values.
		_( this.model.attributes ).chain().keys().each( this.update, this );
		return this;
	},
	/**
	 * @param {string} key
	 */
	update: function( key ) {
		var value = this.model.get( key ),
			$setting = this.$('[data-setting="' + key + '"]'),
			$buttons, $value;

		// bail if we didn't find a matching setting.
		if ( ! $setting.length ) {
			return;
		}

		// attempt to determine how the setting is rendered and update
		// the selected value.

		// handle dropdowns.
		if ( $setting.is('select') ) {
			$value = $setting.find('[value="' + value + '"]');

			if ( $value.length ) {
				$setting.find('option').prop( 'selected', false );
				$value.prop( 'selected', true );
			} else {
				// if we can't find the desired value, record what *is* selected.
				this.model.set( key, $setting.find(':selected').val() );
			}

		// handle button groups.
		} else if ( $setting.hasclass('button-group') ) {
			$buttons = $setting.find( 'button' )
				.removeclass( 'active' )
				.attr( 'aria-pressed', 'false' );
			$buttons.filter( '[value="' + value + '"]' )
				.addclass( 'active' )
				.attr( 'aria-pressed', 'true' );

		// handle text inputs and textareas.
		} else if ( $setting.is('input[type="text"], textarea') ) {
			if ( ! $setting.is(':focus') ) {
				$setting.val( value );
			}
		// handle checkboxes.
		} else if ( $setting.is('input[type="checkbox"]') ) {
			$setting.prop( 'checked', !! value && 'false' !== value );
		}
	},
	/**
	 * @param {object} event
	 */
	updatehandler: function( event ) {
		var $setting = $( event.target ).closest('[data-setting]'),
			value = event.target.value,
			usersetting;

		event.preventdefault();

		if ( ! $setting.length ) {
			return;
		}

		// use the correct value for checkboxes.
		if ( $setting.is('input[type="checkbox"]') ) {
			value = $setting[0].checked;
		}

		// update the corresponding setting.
		this.model.set( $setting.data('setting'), value );

		// if the setting has a corresponding user setting,
		// update that as well.
		usersetting = $setting.data('usersetting');
		if ( usersetting ) {
			window.setusersetting( usersetting, value );
		}
	},

	updatechanges: function( model ) {
		if ( model.haschanged() ) {
			_( model.changed ).chain().keys().each( this.update, this );
		}
	}
});

module.exports = settings;


/***/ }),

/***/ 1982:
/***/ ((module) => {

/**
 * wp.media.view.iframe
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var iframe = wp.media.view.extend(/** @lends wp.media.view.iframe.prototype */{
	classname: 'media-iframe',
	/**
	 * @return {wp.media.view.iframe} returns itself to allow chaining.
	 */
	render: function() {
		this.views.detach();
		this.$el.html( '<iframe src="' + this.controller.state().get('src') + '" />' );
		this.views.render();
		return this;
	}
});

module.exports = iframe;


/***/ }),

/***/ 1992:
/***/ ((module) => {

/**
 * wp.media.view.sidebar
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view.prioritylist
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var sidebar = wp.media.view.prioritylist.extend(/** @lends wp.media.view.sidebar.prototype */{
	classname: 'media-sidebar'
});

module.exports = sidebar;


/***/ }),

/***/ 2038:
/***/ ((module) => {

var library = wp.media.controller.library,
	l10n = wp.media.view.l10n,
	galleryedit;

/**
 * wp.media.controller.galleryedit
 *
 * a state for editing a gallery's images and settings.
 *
 * @since 3.5.0
 *
 * @class
 * @augments wp.media.controller.library
 * @augments wp.media.controller.state
 * @augments backbone.model
 *
 * @memberof wp.media.controller
 *
 * @param {object}                     [attributes]                       the attributes hash passed to the state.
 * @param {string}                     [attributes.id=gallery-edit]       unique identifier.
 * @param {string}                     [attributes.title=edit gallery]    title for the state. displays in the frame's title region.
 * @param {wp.media.model.attachments} [attributes.library]               the collection of attachments in the gallery.
 *                                                                        if one is not supplied, an empty media.model.selection collection is created.
 * @param {boolean}                    [attributes.multiple=false]        whether multi-select is enabled.
 * @param {boolean}                    [attributes.searchable=false]      whether the library is searchable.
 * @param {boolean}                    [attributes.sortable=true]         whether the attachments should be sortable. depends on the orderby property being set to menuorder on the attachments collection.
 * @param {boolean}                    [attributes.date=true]             whether to show the date filter in the browser's toolbar.
 * @param {string|false}               [attributes.content=browse]        initial mode for the content region.
 * @param {string|false}               [attributes.toolbar=image-details] initial mode for the toolbar region.
 * @param {boolean}                    [attributes.describe=true]         whether to offer ui to describe attachments - e.g. captioning images in a gallery.
 * @param {boolean}                    [attributes.displaysettings=true]  whether to show the attachment display settings interface.
 * @param {boolean}                    [attributes.draginfo=true]         whether to show instructional text about the attachments being sortable.
 * @param {number}                     [attributes.idealcolumnwidth=170]  the ideal column width in pixels for attachments.
 * @param {boolean}                    [attributes.editing=false]         whether the gallery is being created, or editing an existing instance.
 * @param {number}                     [attributes.priority=60]           the priority for the state link in the media menu.
 * @param {boolean}                    [attributes.syncselection=false]   whether the attachments selection should be persisted from the last state.
 *                                                                        defaults to false for this state, because the library passed in  *is* the selection.
 * @param {view}                       [attributes.attachmentview]        the single `attachment` view to be used in the `attachments`.
 *                                                                        if none supplied, defaults to wp.media.view.attachment.editlibrary.
 */
galleryedit = library.extend(/** @lends wp.media.controller.galleryedit.prototype */{
	defaults: {
		id:               'gallery-edit',
		title:            l10n.editgallerytitle,
		multiple:         false,
		searchable:       false,
		sortable:         true,
		date:             false,
		display:          false,
		content:          'browse',
		toolbar:          'gallery-edit',
		describe:         true,
		displaysettings:  true,
		draginfo:         true,
		idealcolumnwidth: 170,
		editing:          false,
		priority:         60,
		syncselection:    false
	},

	/**
	 * initializes the library.
	 *
	 * creates a selection if a library isn't supplied and creates an attachment
	 * view if no attachment view is supplied.
	 *
	 * @since 3.5.0
	 *
	 * @return {void}
	 */
	initialize: function() {
		// if we haven't been provided a `library`, create a `selection`.
		if ( ! this.get('library') ) {
			this.set( 'library', new wp.media.model.selection() );
		}

		// the single `attachment` view to be used in the `attachments` view.
		if ( ! this.get('attachmentview') ) {
			this.set( 'attachmentview', wp.media.view.attachment.editlibrary );
		}

		library.prototype.initialize.apply( this, arguments );
	},

	/**
	 * activates the library.
	 *
	 * limits the library to images, watches for uploaded attachments. watches for
	 * the browse event on the frame and binds it to gallerysettings.
	 *
	 * @since 3.5.0
	 *
	 * @return {void}
	 */
	activate: function() {
		var library = this.get('library');

		// limit the library to images only.
		library.props.set( 'type', 'image' );

		// watch for uploaded attachments.
		this.get('library').observe( wp.uploader.queue );

		this.frame.on( 'content:render:browse', this.gallerysettings, this );

		library.prototype.activate.apply( this, arguments );
	},

	/**
	 * deactivates the library.
	 *
	 * stops watching for uploaded attachments and browse events.
	 *
	 * @since 3.5.0
	 *
	 * @return {void}
	 */
	deactivate: function() {
		// stop watching for uploaded attachments.
		this.get('library').unobserve( wp.uploader.queue );

		this.frame.off( 'content:render:browse', this.gallerysettings, this );

		library.prototype.deactivate.apply( this, arguments );
	},

	/**
	 * adds the gallery settings to the sidebar and adds a reverse button to the
	 * toolbar.
	 *
	 * @since 3.5.0
	 *
	 * @param {wp.media.view.frame} browser the file browser.
	 *
	 * @return {void}
	 */
	gallerysettings: function( browser ) {
		if ( ! this.get('displaysettings') ) {
			return;
		}

		var library = this.get('library');

		if ( ! library || ! browser ) {
			return;
		}

		library.gallery = library.gallery || new backbone.model();

		browser.sidebar.set({
			gallery: new wp.media.view.settings.gallery({
				controller: this,
				model:      library.gallery,
				priority:   40
			})
		});

		browser.toolbar.set( 'reverse', {
			text:     l10n.reverseorder,
			priority: 80,

			click: function() {
				library.reset( library.toarray().reverse() );
			}
		});
	}
});

module.exports = galleryedit;


/***/ }),

/***/ 2102:
/***/ ((module) => {

var search;

/**
 * wp.media.view.search
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
search = wp.media.view.extend(/** @lends wp.media.view.search.prototype */{
	tagname:   'input',
	classname: 'search',
	id:        'media-search-input',

	attributes: {
		type: 'search'
	},

	events: {
		'input': 'search'
	},

	/**
	 * @return {wp.media.view.search} returns itself to allow chaining.
	 */
	render: function() {
		this.el.value = this.model.escape('search');
		return this;
	},

	search: _.debounce( function( event ) {
		var searchterm = event.target.value.trim();

		// trigger the search only after 2 ascii characters.
		if ( searchterm && searchterm.length > 1 ) {
			this.model.set( 'search', searchterm );
		} else {
			this.model.unset( 'search' );
		}
	}, 500 )
});

module.exports = search;


/***/ }),

/***/ 2275:
/***/ ((module) => {

var library = wp.media.controller.library,
	l10n = wp.media.view.l10n,
	replaceimage;

/**
 * wp.media.controller.replaceimage
 *
 * a state for replacing an image.
 *
 * @memberof wp.media.controller
 *
 * @class
 * @augments wp.media.controller.library
 * @augments wp.media.controller.state
 * @augments backbone.model
 *
 * @param {object}                     [attributes]                         the attributes hash passed to the state.
 * @param {string}                     [attributes.id=replace-image]        unique identifier.
 * @param {string}                     [attributes.title=replace image]     title for the state. displays in the media menu and the frame's title region.
 * @param {wp.media.model.attachments} [attributes.library]                 the attachments collection to browse.
 *                                                                          if one is not supplied, a collection of all images will be created.
 * @param {boolean}                    [attributes.multiple=false]          whether multi-select is enabled.
 * @param {string}                     [attributes.content=upload]          initial mode for the content region.
 *                                                                          overridden by persistent user setting if 'contentusersetting' is true.
 * @param {string}                     [attributes.menu=default]            initial mode for the menu region.
 * @param {string}                     [attributes.router=browse]           initial mode for the router region.
 * @param {string}                     [attributes.toolbar=replace]         initial mode for the toolbar region.
 * @param {int}                        [attributes.priority=60]             the priority for the state link in the media menu.
 * @param {boolean}                    [attributes.searchable=true]         whether the library is searchable.
 * @param {boolean|string}             [attributes.filterable=uploaded]     whether the library is filterable, and if so what filters should be shown.
 *                                                                          accepts 'all', 'uploaded', or 'unattached'.
 * @param {boolean}                    [attributes.sortable=true]           whether the attachments should be sortable. depends on the orderby property being set to menuorder on the attachments collection.
 * @param {boolean}                    [attributes.autoselect=true]         whether an uploaded attachment should be automatically added to the selection.
 * @param {boolean}                    [attributes.describe=false]          whether to offer ui to describe attachments - e.g. captioning images in a gallery.
 * @param {boolean}                    [attributes.contentusersetting=true] whether the content region's mode should be set and persisted per user.
 * @param {boolean}                    [attributes.syncselection=true]      whether the attachments selection should be persisted from the last state.
 */
replaceimage = library.extend(/** @lends wp.media.controller.replaceimage.prototype */{
	defaults: _.defaults({
		id:            'replace-image',
		title:         l10n.replaceimagetitle,
		multiple:      false,
		filterable:    'uploaded',
		toolbar:       'replace',
		menu:          false,
		priority:      60,
		syncselection: true
	}, library.prototype.defaults ),

	/**
	 * @since 3.9.0
	 *
	 * @param options
	 */
	initialize: function( options ) {
		var library, comparator;

		this.image = options.image;
		// if we haven't been provided a `library`, create a `selection`.
		if ( ! this.get('library') ) {
			this.set( 'library', wp.media.query({ type: 'image' }) );
		}

		library.prototype.initialize.apply( this, arguments );

		library    = this.get('library');
		comparator = library.comparator;

		// overload the library's comparator to push items that are not in
		// the mirrored query to the front of the aggregate collection.
		library.comparator = function( a, b ) {
			var ainquery = !! this.mirroring.get( a.cid ),
				binquery = !! this.mirroring.get( b.cid );

			if ( ! ainquery && binquery ) {
				return -1;
			} else if ( ainquery && ! binquery ) {
				return 1;
			} else {
				return comparator.apply( this, arguments );
			}
		};

		// add all items in the selection to the library, so any featured
		// images that are not initially loaded still appear.
		library.observe( this.get('selection') );
	},

	/**
	 * @since 3.9.0
	 */
	activate: function() {
		this.frame.on( 'content:render:browse', this.updateselection, this );

		library.prototype.activate.apply( this, arguments );
	},

	/**
	 * @since 5.9.0
	 */
	deactivate: function() {
		this.frame.off( 'content:render:browse', this.updateselection, this );

		library.prototype.deactivate.apply( this, arguments );
	},

	/**
	 * @since 3.9.0
	 */
	updateselection: function() {
		var selection = this.get('selection'),
			attachment = this.image.attachment;

		selection.reset( attachment ? [ attachment ] : [] );
	}
});

module.exports = replaceimage;


/***/ }),

/***/ 2356:
/***/ ((module) => {

/**
 * wp.media.view.settings.playlist
 *
 * @memberof wp.media.view.settings
 *
 * @class
 * @augments wp.media.view.settings
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var playlist = wp.media.view.settings.extend(/** @lends wp.media.view.settings.playlist.prototype */{
	classname: 'collection-settings playlist-settings',
	template:  wp.template('playlist-settings')
});

module.exports = playlist;


/***/ }),

/***/ 2395:
/***/ ((module) => {

var attachmentdisplay = wp.media.view.settings.attachmentdisplay,
	embedimage;

/**
 * wp.media.view.embedimage
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view.settings.attachmentdisplay
 * @augments wp.media.view.settings
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
embedimage = attachmentdisplay.extend(/** @lends wp.media.view.embedimage.prototype */{
	classname: 'embed-media-settings',
	template:  wp.template('embed-image-settings'),

	initialize: function() {
		/**
		 * call `initialize` directly on parent class with passed arguments
		 */
		attachmentdisplay.prototype.initialize.apply( this, arguments );
		this.listento( this.model, 'change:url', this.updateimage );
	},

	updateimage: function() {
		this.$('img').attr( 'src', this.model.get('url') );
	}
});

module.exports = embedimage;


/***/ }),

/***/ 2621:
/***/ ((module) => {

var $ = jquery,
	modal;

/**
 * wp.media.view.modal
 *
 * a modal view, which the media modal uses as its default container.
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
modal = wp.media.view.extend(/** @lends wp.media.view.modal.prototype */{
	tagname:  'div',
	template: wp.template('media-modal'),

	events: {
		'click .media-modal-backdrop, .media-modal-close': 'escapehandler',
		'keydown': 'keydown'
	},

	clickedopenerel: null,

	initialize: function() {
		_.defaults( this.options, {
			container:      document.body,
			title:          '',
			propagate:      true,
			hasclosebutton: true
		});

		this.focusmanager = new wp.media.view.focusmanager({
			el: this.el
		});
	},
	/**
	 * @return {object}
	 */
	prepare: function() {
		return {
			title:          this.options.title,
			hasclosebutton: this.options.hasclosebutton
		};
	},

	/**
	 * @return {wp.media.view.modal} returns itself to allow chaining.
	 */
	attach: function() {
		if ( this.views.attached ) {
			return this;
		}

		if ( ! this.views.rendered ) {
			this.render();
		}

		this.$el.appendto( this.options.container );

		// manually mark the view as attached and trigger ready.
		this.views.attached = true;
		this.views.ready();

		return this.propagate('attach');
	},

	/**
	 * @return {wp.media.view.modal} returns itself to allow chaining.
	 */
	detach: function() {
		if ( this.$el.is(':visible') ) {
			this.close();
		}

		this.$el.detach();
		this.views.attached = false;
		return this.propagate('detach');
	},

	/**
	 * @return {wp.media.view.modal} returns itself to allow chaining.
	 */
	open: function() {
		var $el = this.$el,
			mceeditor;

		if ( $el.is(':visible') ) {
			return this;
		}

		this.clickedopenerel = document.activeelement;

		if ( ! this.views.attached ) {
			this.attach();
		}

		// disable page scrolling.
		$( 'body' ).addclass( 'modal-open' );

		$el.show();

		// try to close the onscreen keyboard.
		if ( 'ontouchend' in document ) {
			if ( ( mceeditor = window.tinymce && window.tinymce.activeeditor ) && ! mceeditor.ishidden() && mceeditor.iframeelement ) {
				mceeditor.iframeelement.focus();
				mceeditor.iframeelement.blur();

				settimeout( function() {
					mceeditor.iframeelement.blur();
				}, 100 );
			}
		}

		// set initial focus on the content instead of this view element, to avoid page scrolling.
		this.$( '.media-modal' ).trigger( 'focus' );

		// hide the page content from assistive technologies.
		this.focusmanager.setariahiddenonbodychildren( $el );

		return this.propagate('open');
	},

	/**
	 * @param {object} options
	 * @return {wp.media.view.modal} returns itself to allow chaining.
	 */
	close: function( options ) {
		if ( ! this.views.attached || ! this.$el.is(':visible') ) {
			return this;
		}

		// pause current audio/video even after closing the modal.
		$( '.mejs-pause button' ).trigger( 'click' );

		// enable page scrolling.
		$( 'body' ).removeclass( 'modal-open' );

		// hide the modal element by adding display:none.
		this.$el.hide();

		/*
		 * make visible again to assistive technologies all body children that
		 * have been made hidden when the modal opened.
		 */
		this.focusmanager.removeariahiddenfrombodychildren();

		// move focus back in useful location once modal is closed.
		if ( null !== this.clickedopenerel ) {
			// move focus back to the element that opened the modal.
			this.clickedopenerel.focus();
		} else {
			// fallback to the admin page main element.
			$( '#wpbody-content' )
				.attr( 'tabindex', '-1' )
				.trigger( 'focus' );
		}

		this.propagate('close');

		if ( options && options.escape ) {
			this.propagate('escape');
		}

		return this;
	},
	/**
	 * @return {wp.media.view.modal} returns itself to allow chaining.
	 */
	escape: function() {
		return this.close({ escape: true });
	},
	/**
	 * @param {object} event
	 */
	escapehandler: function( event ) {
		event.preventdefault();
		this.escape();
	},

	/**
	 * handles the selection of attachments when the command or control key is pressed with the enter key.
	 *
	 * @since 6.7
	 *
	 * @param {object} event the keydown event object.
	 */
	selecthandler: function( event ) {
		var selection = this.controller.state().get( 'selection' );

		if ( selection.length <= 0 ) {
			return;
		}

		if ( 'insert' === this.controller.options.state ) {
			this.controller.trigger( 'insert', selection );
		} else {
			this.controller.trigger( 'select', selection );
			event.preventdefault();
			this.escape();
		}
	},

	/**
	 * @param {array|object} content views to register to '.media-modal-content'
	 * @return {wp.media.view.modal} returns itself to allow chaining.
	 */
	content: function( content ) {
		this.views.set( '.media-modal-content', content );
		return this;
	},

	/**
	 * triggers a modal event and if the `propagate` option is set,
	 * forwards events to the modal's controller.
	 *
	 * @param {string} id
	 * @return {wp.media.view.modal} returns itself to allow chaining.
	 */
	propagate: function( id ) {
		this.trigger( id );

		if ( this.options.propagate ) {
			this.controller.trigger( id );
		}

		return this;
	},
	/**
	 * @param {object} event
	 */
	keydown: function( event ) {
		// close the modal when escape is pressed.
		if ( 27 === event.which && this.$el.is(':visible') ) {
			this.escape();
			event.stopimmediatepropagation();
		}

		// select the attachment when command or control and enter are pressed.
		if ( ( 13 === event.which || 10 === event.which ) && ( event.metakey || event.ctrlkey ) ) {
			this.selecthandler( event );
			event.stopimmediatepropagation();
		}

	}
});

module.exports = modal;


/***/ }),

/***/ 2650:
/***/ ((module) => {

var attachmentdisplay = wp.media.view.settings.attachmentdisplay,
	$ = jquery,
	imagedetails;

/**
 * wp.media.view.imagedetails
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view.settings.attachmentdisplay
 * @augments wp.media.view.settings
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
imagedetails = attachmentdisplay.extend(/** @lends wp.media.view.imagedetails.prototype */{
	classname: 'image-details',
	template:  wp.template('image-details'),
	events: _.defaults( attachmentdisplay.prototype.events, {
		'click .edit-attachment': 'editattachment',
		'click .replace-attachment': 'replaceattachment',
		'click .advanced-toggle': 'ontoggleadvanced',
		'change [data-setting="customwidth"]': 'oncustomsize',
		'change [data-setting="customheight"]': 'oncustomsize',
		'keyup [data-setting="customwidth"]': 'oncustomsize',
		'keyup [data-setting="customheight"]': 'oncustomsize'
	} ),
	initialize: function() {
		// used in attachmentdisplay.prototype.updatelinkto.
		this.options.attachment = this.model.attachment;
		this.listento( this.model, 'change:url', this.updateurl );
		this.listento( this.model, 'change:link', this.togglelinksettings );
		this.listento( this.model, 'change:size', this.togglecustomsize );

		attachmentdisplay.prototype.initialize.apply( this, arguments );
	},

	prepare: function() {
		var attachment = false;

		if ( this.model.attachment ) {
			attachment = this.model.attachment.tojson();
		}
		return _.defaults({
			model: this.model.tojson(),
			attachment: attachment
		}, this.options );
	},

	render: function() {
		var args = arguments;

		if ( this.model.attachment && 'pending' === this.model.dfd.state() ) {
			this.model.dfd
				.done( _.bind( function() {
					attachmentdisplay.prototype.render.apply( this, args );
					this.postrender();
				}, this ) )
				.fail( _.bind( function() {
					this.model.attachment = false;
					attachmentdisplay.prototype.render.apply( this, args );
					this.postrender();
				}, this ) );
		} else {
			attachmentdisplay.prototype.render.apply( this, arguments );
			this.postrender();
		}

		return this;
	},

	postrender: function() {
		settimeout( _.bind( this.scrolltotop, this ), 10 );
		this.togglelinksettings();
		if ( window.getusersetting( 'advimgdetails' ) === 'show' ) {
			this.toggleadvanced( true );
		}
		this.trigger( 'post-render' );
	},

	scrolltotop: function() {
		this.$( '.embed-media-settings' ).scrolltop( 0 );
	},

	updateurl: function() {
		this.$( '.image img' ).attr( 'src', this.model.get( 'url' ) );
		this.$( '.url' ).val( this.model.get( 'url' ) );
	},

	togglelinksettings: function() {
		if ( this.model.get( 'link' ) === 'none' ) {
			this.$( '.link-settings' ).addclass('hidden');
		} else {
			this.$( '.link-settings' ).removeclass('hidden');
		}
	},

	togglecustomsize: function() {
		if ( this.model.get( 'size' ) !== 'custom' ) {
			this.$( '.custom-size' ).addclass('hidden');
		} else {
			this.$( '.custom-size' ).removeclass('hidden');
		}
	},

	oncustomsize: function( event ) {
		var dimension = $( event.target ).data('setting'),
			num = $( event.target ).val(),
			value;

		// ignore bogus input.
		if ( ! /^\d+/.test( num ) || parseint( num, 10 ) < 1 ) {
			event.preventdefault();
			return;
		}

		if ( dimension === 'customwidth' ) {
			value = math.round( 1 / this.model.get( 'aspectratio' ) * num );
			this.model.set( 'customheight', value, { silent: true } );
			this.$( '[data-setting="customheight"]' ).val( value );
		} else {
			value = math.round( this.model.get( 'aspectratio' ) * num );
			this.model.set( 'customwidth', value, { silent: true  } );
			this.$( '[data-setting="customwidth"]' ).val( value );
		}
	},

	ontoggleadvanced: function( event ) {
		event.preventdefault();
		this.toggleadvanced();
	},

	toggleadvanced: function( show ) {
		var $advanced = this.$el.find( '.advanced-section' ),
			mode;

		if ( $advanced.hasclass('advanced-visible') || show === false ) {
			$advanced.removeclass('advanced-visible');
			$advanced.find('.advanced-settings').addclass('hidden');
			mode = 'hide';
		} else {
			$advanced.addclass('advanced-visible');
			$advanced.find('.advanced-settings').removeclass('hidden');
			mode = 'show';
		}

		window.setusersetting( 'advimgdetails', mode );
	},

	editattachment: function( event ) {
		var editstate = this.controller.states.get( 'edit-image' );

		if ( window.imageedit && editstate ) {
			event.preventdefault();
			editstate.set( 'image', this.model.attachment );
			this.controller.setstate( 'edit-image' );
		}
	},

	replaceattachment: function( event ) {
		event.preventdefault();
		this.controller.setstate( 'replace-image' );
	}
});

module.exports = imagedetails;


/***/ }),

/***/ 2836:
/***/ ((module) => {

var frame = wp.media.view.frame,
	l10n = wp.media.view.l10n,
	$ = jquery,
	mediaframe;

/**
 * wp.media.view.mediaframe
 *
 * the frame used to create the media modal.
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view.frame
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 * @mixes wp.media.controller.statemachine
 */
mediaframe = frame.extend(/** @lends wp.media.view.mediaframe.prototype */{
	classname: 'media-frame',
	template:  wp.template('media-frame'),
	regions:   ['menu','title','content','toolbar','router'],

	events: {
		'click .media-frame-menu-toggle': 'togglemenu'
	},

	/**
	 * @constructs
	 */
	initialize: function() {
		frame.prototype.initialize.apply( this, arguments );

		_.defaults( this.options, {
			title:    l10n.mediaframedefaulttitle,
			modal:    true,
			uploader: true
		});

		// ensure core ui is enabled.
		this.$el.addclass('wp-core-ui');

		// initialize modal container view.
		if ( this.options.modal ) {
			this.modal = new wp.media.view.modal({
				controller: this,
				title:      this.options.title
			});

			this.modal.content( this );
		}

		// force the uploader off if the upload limit has been exceeded or
		// if the browser isn't supported.
		if ( wp.uploader.limitexceeded || ! wp.uploader.browser.supported ) {
			this.options.uploader = false;
		}

		// initialize window-wide uploader.
		if ( this.options.uploader ) {
			this.uploader = new wp.media.view.uploaderwindow({
				controller: this,
				uploader: {
					dropzone:  this.modal ? this.modal.$el : this.$el,
					container: this.$el
				}
			});
			this.views.set( '.media-frame-uploader', this.uploader );
		}

		this.on( 'attach', _.bind( this.views.ready, this.views ), this );

		// bind default title creation.
		this.on( 'title:create:default', this.createtitle, this );
		this.title.mode('default');

		// bind default menu.
		this.on( 'menu:create:default', this.createmenu, this );

		// set the menu aria tab panel attributes when the modal opens.
		this.on( 'open', this.setmenutabpanelariaattributes, this );
		// set the router aria tab panel attributes when the modal opens.
		this.on( 'open', this.setroutertabpanelariaattributes, this );

		// update the menu aria tab panel attributes when the content updates.
		this.on( 'content:render', this.setmenutabpanelariaattributes, this );
		// update the router aria tab panel attributes when the content updates.
		this.on( 'content:render', this.setroutertabpanelariaattributes, this );
	},

	/**
	 * sets the attributes to be used on the menu aria tab panel.
	 *
	 * @since 5.3.0
	 *
	 * @return {void}
	 */
	setmenutabpanelariaattributes: function() {
		var stateid = this.state().get( 'id' ),
			tabpanelel = this.$el.find( '.media-frame-tab-panel' ),
			arialabelledby;

		tabpanelel.removeattr( 'role aria-labelledby tabindex' );

		if ( this.state().get( 'menu' ) && this.menuview && this.menuview.isvisible ) {
			arialabelledby = 'menu-item-' + stateid;

			// set the tab panel attributes only if the tabs are visible.
			tabpanelel
				.attr( {
					role: 'tabpanel',
					'aria-labelledby': arialabelledby,
					tabindex: '0'
				} );
		}
	},

	/**
	 * sets the attributes to be used on the router aria tab panel.
	 *
	 * @since 5.3.0
	 *
	 * @return {void}
	 */
	setroutertabpanelariaattributes: function() {
		var tabpanelel = this.$el.find( '.media-frame-content' ),
			arialabelledby;

		tabpanelel.removeattr( 'role aria-labelledby tabindex' );

		// set the tab panel attributes only if the tabs are visible.
		if ( this.state().get( 'router' ) && this.routerview && this.routerview.isvisible && this.content._mode ) {
			arialabelledby = 'menu-item-' + this.content._mode;

			tabpanelel
				.attr( {
					role: 'tabpanel',
					'aria-labelledby': arialabelledby,
					tabindex: '0'
				} );
		}
	},

	/**
	 * @return {wp.media.view.mediaframe} returns itself to allow chaining.
	 */
	render: function() {
		// activate the default state if no active state exists.
		if ( ! this.state() && this.options.state ) {
			this.setstate( this.options.state );
		}
		/**
		 * call 'render' directly on the parent class
		 */
		return frame.prototype.render.apply( this, arguments );
	},
	/**
	 * @param {object} title
	 * @this wp.media.controller.region
	 */
	createtitle: function( title ) {
		title.view = new wp.media.view({
			controller: this,
			tagname: 'h1'
		});
	},
	/**
	 * @param {object} menu
	 * @this wp.media.controller.region
	 */
	createmenu: function( menu ) {
		menu.view = new wp.media.view.menu({
			controller: this,

			attributes: {
				role:               'tablist',
				'aria-orientation': 'vertical'
			}
		});

		this.menuview = menu.view;
	},

	togglemenu: function( event ) {
		var menu = this.$el.find( '.media-menu' );

		menu.toggleclass( 'visible' );
		$( event.target ).attr( 'aria-expanded', menu.hasclass( 'visible' ) );
	},

	/**
	 * @param {object} toolbar
	 * @this wp.media.controller.region
	 */
	createtoolbar: function( toolbar ) {
		toolbar.view = new wp.media.view.toolbar({
			controller: this
		});
	},
	/**
	 * @param {object} router
	 * @this wp.media.controller.region
	 */
	createrouter: function( router ) {
		router.view = new wp.media.view.router({
			controller: this,

			attributes: {
				role:               'tablist',
				'aria-orientation': 'horizontal'
			}
		});

		this.routerview = router.view;
	},
	/**
	 * @param {object} options
	 */
	createiframestates: function( options ) {
		var settings = wp.media.view.settings,
			tabs = settings.tabs,
			taburl = settings.taburl,
			$postid;

		if ( ! tabs || ! taburl ) {
			return;
		}

		// add the post id to the tab url if it exists.
		$postid = $('#post_id');
		if ( $postid.length ) {
			taburl += '&post_id=' + $postid.val();
		}

		// generate the tab states.
		_.each( tabs, function( title, id ) {
			this.state( 'iframe:' + id ).set( _.defaults({
				tab:     id,
				src:     taburl + '&tab=' + id,
				title:   title,
				content: 'iframe',
				menu:    'default'
			}, options ) );
		}, this );

		this.on( 'content:create:iframe', this.iframecontent, this );
		this.on( 'content:deactivate:iframe', this.iframecontentcleanup, this );
		this.on( 'menu:render:default', this.iframemenu, this );
		this.on( 'open', this.hijackthickbox, this );
		this.on( 'close', this.restorethickbox, this );
	},

	/**
	 * @param {object} content
	 * @this wp.media.controller.region
	 */
	iframecontent: function( content ) {
		this.$el.addclass('hide-toolbar');
		content.view = new wp.media.view.iframe({
			controller: this
		});
	},

	iframecontentcleanup: function() {
		this.$el.removeclass('hide-toolbar');
	},

	iframemenu: function( view ) {
		var views = {};

		if ( ! view ) {
			return;
		}

		_.each( wp.media.view.settings.tabs, function( title, id ) {
			views[ 'iframe:' + id ] = {
				text: this.state( 'iframe:' + id ).get('title'),
				priority: 200
			};
		}, this );

		view.set( views );
	},

	hijackthickbox: function() {
		var frame = this;

		if ( ! window.tb_remove || this._tb_remove ) {
			return;
		}

		this._tb_remove = window.tb_remove;
		window.tb_remove = function() {
			frame.close();
			frame.reset();
			frame.setstate( frame.options.state );
			frame._tb_remove.call( window );
		};
	},

	restorethickbox: function() {
		if ( ! this._tb_remove ) {
			return;
		}

		window.tb_remove = this._tb_remove;
		delete this._tb_remove;
	}
});

// map some of the modal's methods to the frame.
_.each(['open','close','attach','detach','escape'], function( method ) {
	/**
	 * @function open
	 * @memberof wp.media.view.mediaframe
	 * @instance
	 *
	 * @return {wp.media.view.mediaframe} returns itself to allow chaining.
	 */
	/**
	 * @function close
	 * @memberof wp.media.view.mediaframe
	 * @instance
	 *
	 * @return {wp.media.view.mediaframe} returns itself to allow chaining.
	 */
	/**
	 * @function attach
	 * @memberof wp.media.view.mediaframe
	 * @instance
	 *
	 * @return {wp.media.view.mediaframe} returns itself to allow chaining.
	 */
	/**
	 * @function detach
	 * @memberof wp.media.view.mediaframe
	 * @instance
	 *
	 * @return {wp.media.view.mediaframe} returns itself to allow chaining.
	 */
	/**
	 * @function escape
	 * @memberof wp.media.view.mediaframe
	 * @instance
	 *
	 * @return {wp.media.view.mediaframe} returns itself to allow chaining.
	 */
	mediaframe.prototype[ method ] = function() {
		if ( this.modal ) {
			this.modal[ method ].apply( this.modal, arguments );
		}
		return this;
	};
});

module.exports = mediaframe;


/***/ }),

/***/ 2982:
/***/ ((module) => {

var view = wp.media.view,
	attachmentcompat;

/**
 * wp.media.view.attachmentcompat
 *
 * a view to display fields added via the `attachment_fields_to_edit` filter.
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
attachmentcompat = view.extend(/** @lends wp.media.view.attachmentcompat.prototype */{
	tagname:   'form',
	classname: 'compat-item',

	events: {
		'submit':          'preventdefault',
		'change input':    'save',
		'change select':   'save',
		'change textarea': 'save'
	},

	initialize: function() {
		// render the view when a new item is added.
		this.listento( this.model, 'add', this.render );
	},

	/**
	 * @return {wp.media.view.attachmentcompat} returns itself to allow chaining.
	 */
	dispose: function() {
		if ( this.$(':focus').length ) {
			this.save();
		}
		/**
		 * call 'dispose' directly on the parent class
		 */
		return view.prototype.dispose.apply( this, arguments );
	},
	/**
	 * @return {wp.media.view.attachmentcompat} returns itself to allow chaining.
	 */
	render: function() {
		var compat = this.model.get('compat');
		if ( ! compat || ! compat.item ) {
			return;
		}

		this.views.detach();
		this.$el.html( compat.item );
		this.views.render();
		return this;
	},
	/**
	 * @param {object} event
	 */
	preventdefault: function( event ) {
		event.preventdefault();
	},
	/**
	 * @param {object} event
	 */
	save: function( event ) {
		var data = {};

		if ( event ) {
			event.preventdefault();
		}

		_.each( this.$el.serializearray(), function( pair ) {
			data[ pair.name ] = pair.value;
		});

		this.controller.trigger( 'attachment:compat:waiting', ['waiting'] );
		this.model.savecompat( data ).always( _.bind( this.postsave, this ) );
	},

	postsave: function() {
		this.controller.trigger( 'attachment:compat:ready', ['ready'] );
	}
});

module.exports = attachmentcompat;


/***/ }),

/***/ 3443:
/***/ ((module) => {

/**
 * wp.media.view.attachment.library
 *
 * @memberof wp.media.view.attachment
 *
 * @class
 * @augments wp.media.view.attachment
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var library = wp.media.view.attachment.extend(/** @lends wp.media.view.attachment.library.prototype */{
	buttons: {
		check: true
	}
});

module.exports = library;


/***/ }),

/***/ 3479:
/***/ ((module) => {

var attachments = wp.media.view.attachments,
	selection;

/**
 * wp.media.view.attachments.selection
 *
 * @memberof wp.media.view.attachments
 *
 * @class
 * @augments wp.media.view.attachments
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
selection = attachments.extend(/** @lends wp.media.view.attachments.selection.prototype */{
	events: {},
	initialize: function() {
		_.defaults( this.options, {
			sortable:   false,
			resize:     false,

			// the single `attachment` view to be used in the `attachments` view.
			attachmentview: wp.media.view.attachment.selection
		});
		// call 'initialize' directly on the parent class.
		return attachments.prototype.initialize.apply( this, arguments );
	}
});

module.exports = selection;


/***/ }),

/***/ 3674:
/***/ ((module) => {

var view = wp.media.view,
	l10n = wp.media.view.l10n,
	$ = jquery,
	editoruploader;

/**
 * creates a dropzone on wp editor instances (elements with .wp-editor-wrap)
 * and relays drag'n'dropped files to a media workflow.
 *
 * wp.media.view.editoruploader
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
editoruploader = view.extend(/** @lends wp.media.view.editoruploader.prototype */{
	tagname:   'div',
	classname: 'uploader-editor',
	template:  wp.template( 'uploader-editor' ),

	localdrag: false,
	overcontainer: false,
	overdropzone: false,
	draggingfile: null,

	/**
	 * bind drag'n'drop events to callbacks.
	 */
	initialize: function() {
		this.initialized = false;

		// bail if not enabled or ua does not support drag'n'drop or file api.
		if ( ! window.tinymcepreinit || ! window.tinymcepreinit.dragdropupload || ! this.browsersupport() ) {
			return this;
		}

		this.$document = $(document);
		this.dropzones = [];
		this.files = [];

		this.$document.on( 'drop', '.uploader-editor', _.bind( this.drop, this ) );
		this.$document.on( 'dragover', '.uploader-editor', _.bind( this.dropzonedragover, this ) );
		this.$document.on( 'dragleave', '.uploader-editor', _.bind( this.dropzonedragleave, this ) );
		this.$document.on( 'click', '.uploader-editor', _.bind( this.click, this ) );

		this.$document.on( 'dragover', _.bind( this.containerdragover, this ) );
		this.$document.on( 'dragleave', _.bind( this.containerdragleave, this ) );

		this.$document.on( 'dragstart dragend drop', _.bind( function( event ) {
			this.localdrag = event.type === 'dragstart';

			if ( event.type === 'drop' ) {
				this.containerdragleave();
			}
		}, this ) );

		this.initialized = true;
		return this;
	},

	/**
	 * check browser support for drag'n'drop.
	 *
	 * @return {boolean}
	 */
	browsersupport: function() {
		var supports = false, div = document.createelement('div');

		supports = ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div );
		supports = supports && !! ( window.file && window.filelist && window.filereader );
		return supports;
	},

	isdraggingfile: function( event ) {
		if ( this.draggingfile !== null ) {
			return this.draggingfile;
		}

		if ( _.isundefined( event.originalevent ) || _.isundefined( event.originalevent.datatransfer ) ) {
			return false;
		}

		this.draggingfile = _.indexof( event.originalevent.datatransfer.types, 'files' ) > -1 &&
			_.indexof( event.originalevent.datatransfer.types, 'text/plain' ) === -1;

		return this.draggingfile;
	},

	refresh: function( e ) {
		var dropzone_id;
		for ( dropzone_id in this.dropzones ) {
			// hide the dropzones only if dragging has left the screen.
			this.dropzones[ dropzone_id ].toggle( this.overcontainer || this.overdropzone );
		}

		if ( ! _.isundefined( e ) ) {
			$( e.target ).closest( '.uploader-editor' ).toggleclass( 'droppable', this.overdropzone );
		}

		if ( ! this.overcontainer && ! this.overdropzone ) {
			this.draggingfile = null;
		}

		return this;
	},

	render: function() {
		if ( ! this.initialized ) {
			return this;
		}

		view.prototype.render.apply( this, arguments );
		$( '.wp-editor-wrap' ).each( _.bind( this.attach, this ) );
		return this;
	},

	attach: function( index, editor ) {
		// attach a dropzone to an editor.
		var dropzone = this.$el.clone();
		this.dropzones.push( dropzone );
		$( editor ).append( dropzone );
		return this;
	},

	/**
	 * when a file is dropped on the editor uploader, open up an editor media workflow
	 * and upload the file immediately.
	 *
	 * @param {jquery.event} event the 'drop' event.
	 */
	drop: function( event ) {
		var $wrap, uploadview;

		this.containerdragleave( event );
		this.dropzonedragleave( event );

		this.files = event.originalevent.datatransfer.files;
		if ( this.files.length < 1 ) {
			return;
		}

		// set the active editor to the drop target.
		$wrap = $( event.target ).parents( '.wp-editor-wrap' );
		if ( $wrap.length > 0 && $wrap[0].id ) {
			window.wpactiveeditor = $wrap[0].id.slice( 3, -5 );
		}

		if ( ! this.workflow ) {
			this.workflow = wp.media.editor.open( window.wpactiveeditor, {
				frame:    'post',
				state:    'insert',
				title:    l10n.addmedia,
				multiple: true
			});

			uploadview = this.workflow.uploader;

			if ( uploadview.uploader && uploadview.uploader.ready ) {
				this.addfiles.apply( this );
			} else {
				this.workflow.on( 'uploader:ready', this.addfiles, this );
			}
		} else {
			this.workflow.state().reset();
			this.addfiles.apply( this );
			this.workflow.open();
		}

		return false;
	},

	/**
	 * add the files to the uploader.
	 */
	addfiles: function() {
		if ( this.files.length ) {
			this.workflow.uploader.uploader.uploader.addfile( _.toarray( this.files ) );
			this.files = [];
		}
		return this;
	},

	containerdragover: function( event ) {
		if ( this.localdrag || ! this.isdraggingfile( event ) ) {
			return;
		}

		this.overcontainer = true;
		this.refresh();
	},

	containerdragleave: function() {
		this.overcontainer = false;

		// throttle dragleave because it's called when bouncing from some elements to others.
		_.delay( _.bind( this.refresh, this ), 50 );
	},

	dropzonedragover: function( event ) {
		if ( this.localdrag || ! this.isdraggingfile( event ) ) {
			return;
		}

		this.overdropzone = true;
		this.refresh( event );
		return false;
	},

	dropzonedragleave: function( e ) {
		this.overdropzone = false;
		_.delay( _.bind( this.refresh, this, e ), 50 );
	},

	click: function( e ) {
		// in the rare case where the dropzone gets stuck, hide it on click.
		this.containerdragleave( e );
		this.dropzonedragleave( e );
		this.localdrag = false;
	}
});

module.exports = editoruploader;


/***/ }),

/***/ 3962:
/***/ ((module) => {

/**
 * wp.media.view.attachment.selection
 *
 * @memberof wp.media.view.attachment
 *
 * @class
 * @augments wp.media.view.attachment
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var selection = wp.media.view.attachment.extend(/** @lends wp.media.view.attachment.selection.prototype */{
	classname: 'attachment selection',

	// on click, just select the model, instead of removing the model from
	// the selection.
	toggleselection: function() {
		this.options.selection.single( this.model );
	}
});

module.exports = selection;


/***/ }),

/***/ 4075:
/***/ ((module) => {

var view = wp.media.view,
	$ = jquery,
	attachment;

/**
 * wp.media.view.attachment
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
attachment = view.extend(/** @lends wp.media.view.attachment.prototype */{
	tagname:   'li',
	classname: 'attachment',
	template:  wp.template('attachment'),

	attributes: function() {
		return {
			'tabindex':     0,
			'role':         'checkbox',
			'aria-label':   this.model.get( 'title' ),
			'aria-checked': false,
			'data-id':      this.model.get( 'id' )
		};
	},

	events: {
		'click':                          'toggleselectionhandler',
		'change [data-setting]':          'updatesetting',
		'change [data-setting] input':    'updatesetting',
		'change [data-setting] select':   'updatesetting',
		'change [data-setting] textarea': 'updatesetting',
		'click .attachment-close':        'removefromlibrary',
		'click .check':                   'checkclickhandler',
		'keydown':                        'toggleselectionhandler'
	},

	buttons: {},

	initialize: function() {
		var selection = this.options.selection,
			options = _.defaults( this.options, {
				rerenderonmodelchange: true
			} );

		if ( options.rerenderonmodelchange ) {
			this.listento( this.model, 'change', this.render );
		} else {
			this.listento( this.model, 'change:percent', this.progress );
		}
		this.listento( this.model, 'change:title', this._synctitle );
		this.listento( this.model, 'change:caption', this._synccaption );
		this.listento( this.model, 'change:artist', this._syncartist );
		this.listento( this.model, 'change:album', this._syncalbum );

		// update the selection.
		this.listento( this.model, 'add', this.select );
		this.listento( this.model, 'remove', this.deselect );
		if ( selection ) {
			selection.on( 'reset', this.updateselect, this );
			// update the model's details view.
			this.listento( this.model, 'selection:single selection:unsingle', this.details );
			this.details( this.model, this.controller.state().get('selection') );
		}

		this.listento( this.controller.states, 'attachment:compat:waiting attachment:compat:ready', this.updatesave );
	},
	/**
	 * @return {wp.media.view.attachment} returns itself to allow chaining.
	 */
	dispose: function() {
		var selection = this.options.selection;

		// make sure all settings are saved before removing the view.
		this.updateall();

		if ( selection ) {
			selection.off( null, null, this );
		}
		/**
		 * call 'dispose' directly on the parent class
		 */
		view.prototype.dispose.apply( this, arguments );
		return this;
	},
	/**
	 * @return {wp.media.view.attachment} returns itself to allow chaining.
	 */
	render: function() {
		var options = _.defaults( this.model.tojson(), {
				orientation:   'landscape',
				uploading:     false,
				type:          '',
				subtype:       '',
				icon:          '',
				filename:      '',
				caption:       '',
				title:         '',
				dateformatted: '',
				width:         '',
				height:        '',
				compat:        false,
				alt:           '',
				description:   ''
			}, this.options );

		options.buttons  = this.buttons;
		options.describe = this.controller.state().get('describe');

		if ( 'image' === options.type ) {
			options.size = this.imagesize();
		}

		options.can = {};
		if ( options.nonces ) {
			options.can.remove = !! options.nonces['delete'];
			options.can.save = !! options.nonces.update;
		}

		if ( this.controller.state().get('allowlocaledits') && ! options.uploading ) {
			options.allowlocaledits = true;
		}

		if ( options.uploading && ! options.percent ) {
			options.percent = 0;
		}

		this.views.detach();
		this.$el.html( this.template( options ) );

		this.$el.toggleclass( 'uploading', options.uploading );

		if ( options.uploading ) {
			this.$bar = this.$('.media-progress-bar div');
		} else {
			delete this.$bar;
		}

		// check if the model is selected.
		this.updateselect();

		// update the save status.
		this.updatesave();

		this.views.render();

		return this;
	},

	progress: function() {
		if ( this.$bar && this.$bar.length ) {
			this.$bar.width( this.model.get('percent') + '%' );
		}
	},

	/**
	 * @param {object} event
	 */
	toggleselectionhandler: function( event ) {
		var method;

		// don't do anything inside inputs and on the attachment check and remove buttons.
		if ( 'input' === event.target.nodename || 'button' === event.target.nodename ) {
			return;
		}

		// catch arrow events.
		if ( 37 === event.keycode || 38 === event.keycode || 39 === event.keycode || 40 === event.keycode ) {
			this.controller.trigger( 'attachment:keydown:arrow', event );
			return;
		}

		// catch enter and space events.
		if ( 'keydown' === event.type && 13 !== event.keycode && 32 !== event.keycode ) {
			return;
		}

		event.preventdefault();

		// in the grid view, bubble up an edit:attachment event to the controller.
		if ( this.controller.ismodeactive( 'grid' ) ) {
			if ( this.controller.ismodeactive( 'edit' ) ) {
				// pass the current target to restore focus when closing.
				this.controller.trigger( 'edit:attachment', this.model, event.currenttarget );
				return;
			}

			if ( this.controller.ismodeactive( 'select' ) ) {
				method = 'toggle';
			}
		}

		if ( event.shiftkey ) {
			method = 'between';
		} else if ( event.ctrlkey || event.metakey ) {
			method = 'toggle';
		}

		// avoid toggles when the command or control key is pressed with the enter key to prevent deselecting the last selected attachment.
		if ( ( event.metakey || event.ctrlkey ) && ( 13 === event.keycode || 10 === event.keycode ) ) {
			return;
		}

		this.toggleselection({
			method: method
		});

		this.controller.trigger( 'selection:toggle' );
	},
	/**
	 * @param {object} options
	 */
	toggleselection: function( options ) {
		var collection = this.collection,
			selection = this.options.selection,
			model = this.model,
			method = options && options.method,
			single, models, singleindex, modelindex;

		if ( ! selection ) {
			return;
		}

		single = selection.single();
		method = _.isundefined( method ) ? selection.multiple : method;

		// if the `method` is set to `between`, select all models that
		// exist between the current and the selected model.
		if ( 'between' === method && single && selection.multiple ) {
			// if the models are the same, short-circuit.
			if ( single === model ) {
				return;
			}

			singleindex = collection.indexof( single );
			modelindex  = collection.indexof( this.model );

			if ( singleindex < modelindex ) {
				models = collection.models.slice( singleindex, modelindex + 1 );
			} else {
				models = collection.models.slice( modelindex, singleindex + 1 );
			}

			selection.add( models );
			selection.single( model );
			return;

		// if the `method` is set to `toggle`, just flip the selection
		// status, regardless of whether the model is the single model.
		} else if ( 'toggle' === method ) {
			selection[ this.selected() ? 'remove' : 'add' ]( model );
			selection.single( model );
			return;
		} else if ( 'add' === method ) {
			selection.add( model );
			selection.single( model );
			return;
		}

		// fixes bug that loses focus when selecting a featured image.
		if ( ! method ) {
			method = 'add';
		}

		if ( method !== 'add' ) {
			method = 'reset';
		}

		if ( this.selected() ) {
			/*
			 * if the model is the single model, remove it.
			 * if it is not the same as the single model,
			 * it now becomes the single model.
			 */
			selection[ single === model ? 'remove' : 'single' ]( model );
		} else {
			/*
			 * if the model is not selected, run the `method` on the
			 * selection. by default, we `reset` the selection, but the
			 * `method` can be set to `add` the model to the selection.
			 */
			selection[ method ]( model );
			selection.single( model );
		}
	},

	updateselect: function() {
		this[ this.selected() ? 'select' : 'deselect' ]();
	},
	/**
	 * @return {unresolved|boolean}
	 */
	selected: function() {
		var selection = this.options.selection;
		if ( selection ) {
			return !! selection.get( this.model.cid );
		}
	},
	/**
	 * @param {backbone.model} model
	 * @param {backbone.collection} collection
	 */
	select: function( model, collection ) {
		var selection = this.options.selection,
			controller = this.controller;

		/*
		 * check if a selection exists and if it's the collection provided.
		 * if they're not the same collection, bail; we're in another
		 * selection's event loop.
		 */
		if ( ! selection || ( collection && collection !== selection ) ) {
			return;
		}

		// bail if the model is already selected.
		if ( this.$el.hasclass( 'selected' ) ) {
			return;
		}

		// add 'selected' class to model, set aria-checked to true.
		this.$el.addclass( 'selected' ).attr( 'aria-checked', true );
		//  make the checkbox tabable, except in media grid (bulk select mode).
		if ( ! ( controller.ismodeactive( 'grid' ) && controller.ismodeactive( 'select' ) ) ) {
			this.$( '.check' ).attr( 'tabindex', '0' );
		}
	},
	/**
	 * @param {backbone.model} model
	 * @param {backbone.collection} collection
	 */
	deselect: function( model, collection ) {
		var selection = this.options.selection;

		/*
		 * check if a selection exists and if it's the collection provided.
		 * if they're not the same collection, bail; we're in another
		 * selection's event loop.
		 */
		if ( ! selection || ( collection && collection !== selection ) ) {
			return;
		}
		this.$el.removeclass( 'selected' ).attr( 'aria-checked', false )
			.find( '.check' ).attr( 'tabindex', '-1' );
	},
	/**
	 * @param {backbone.model} model
	 * @param {backbone.collection} collection
	 */
	details: function( model, collection ) {
		var selection = this.options.selection,
			details;

		if ( selection !== collection ) {
			return;
		}

		details = selection.single();
		this.$el.toggleclass( 'details', details === this.model );
	},
	/**
	 * @param {string} size
	 * @return {object}
	 */
	imagesize: function( size ) {
		var sizes = this.model.get('sizes'), matched = false;

		size = size || 'medium';

		// use the provided image size if possible.
		if ( sizes ) {
			if ( sizes[ size ] ) {
				matched = sizes[ size ];
			} else if ( sizes.large ) {
				matched = sizes.large;
			} else if ( sizes.thumbnail ) {
				matched = sizes.thumbnail;
			} else if ( sizes.full ) {
				matched = sizes.full;
			}

			if ( matched ) {
				return _.clone( matched );
			}
		}

		return {
			url:         this.model.get('url'),
			width:       this.model.get('width'),
			height:      this.model.get('height'),
			orientation: this.model.get('orientation')
		};
	},
	/**
	 * @param {object} event
	 */
	updatesetting: function( event ) {
		var $setting = $( event.target ).closest('[data-setting]'),
			setting, value;

		if ( ! $setting.length ) {
			return;
		}

		setting = $setting.data('setting');
		value   = event.target.value;

		if ( this.model.get( setting ) !== value ) {
			this.save( setting, value );
		}
	},

	/**
	 * pass all the arguments to the model's save method.
	 *
	 * records the aggregate status of all save requests and updates the
	 * view's classes accordingly.
	 */
	save: function() {
		var view = this,
			save = this._save = this._save || { status: 'ready' },
			request = this.model.save.apply( this.model, arguments ),
			requests = save.requests ? $.when( request, save.requests ) : request;

		// if we're waiting to remove 'saved.', stop.
		if ( save.savedtimer ) {
			cleartimeout( save.savedtimer );
		}

		this.updatesave('waiting');
		save.requests = requests;
		requests.always( function() {
			// if we've performed another request since this one, bail.
			if ( save.requests !== requests ) {
				return;
			}

			view.updatesave( requests.state() === 'resolved' ? 'complete' : 'error' );
			save.savedtimer = settimeout( function() {
				view.updatesave('ready');
				delete save.savedtimer;
			}, 2000 );
		});
	},
	/**
	 * @param {string} status
	 * @return {wp.media.view.attachment} returns itself to allow chaining.
	 */
	updatesave: function( status ) {
		var save = this._save = this._save || { status: 'ready' };

		if ( status && status !== save.status ) {
			this.$el.removeclass( 'save-' + save.status );
			save.status = status;
		}

		this.$el.addclass( 'save-' + save.status );
		return this;
	},

	updateall: function() {
		var $settings = this.$('[data-setting]'),
			model = this.model,
			changed;

		changed = _.chain( $settings ).map( function( el ) {
			var $input = $('input, textarea, select, [value]', el ),
				setting, value;

			if ( ! $input.length ) {
				return;
			}

			setting = $(el).data('setting');
			value = $input.val();

			// record the value if it changed.
			if ( model.get( setting ) !== value ) {
				return [ setting, value ];
			}
		}).compact().object().value();

		if ( ! _.isempty( changed ) ) {
			model.save( changed );
		}
	},
	/**
	 * @param {object} event
	 */
	removefromlibrary: function( event ) {
		// catch enter and space events.
		if ( 'keydown' === event.type && 13 !== event.keycode && 32 !== event.keycode ) {
			return;
		}

		// stop propagation so the model isn't selected.
		event.stoppropagation();

		this.collection.remove( this.model );
	},

	/**
	 * add the model if it isn't in the selection, if it is in the selection,
	 * remove it.
	 *
	 * @param {[type]} event [description]
	 * @return {[type]} [description]
	 */
	checkclickhandler: function ( event ) {
		var selection = this.options.selection;
		if ( ! selection ) {
			return;
		}
		event.stoppropagation();
		if ( selection.where( { id: this.model.get( 'id' ) } ).length ) {
			selection.remove( this.model );
			// move focus back to the attachment tile (from the check).
			this.$el.focus();
		} else {
			selection.add( this.model );
		}

		// trigger an action button update.
		this.controller.trigger( 'selection:toggle' );
	}
});

// ensure settings remain in sync between attachment views.
_.each({
	caption: '_synccaption',
	title:   '_synctitle',
	artist:  '_syncartist',
	album:   '_syncalbum'
}, function( method, setting ) {
	/**
	 * @function _synccaption
	 * @memberof wp.media.view.attachment
	 * @instance
	 *
	 * @param {backbone.model} model
	 * @param {string} value
	 * @return {wp.media.view.attachment} returns itself to allow chaining.
	 */
	/**
	 * @function _synctitle
	 * @memberof wp.media.view.attachment
	 * @instance
	 *
	 * @param {backbone.model} model
	 * @param {string} value
	 * @return {wp.media.view.attachment} returns itself to allow chaining.
	 */
	/**
	 * @function _syncartist
	 * @memberof wp.media.view.attachment
	 * @instance
	 *
	 * @param {backbone.model} model
	 * @param {string} value
	 * @return {wp.media.view.attachment} returns itself to allow chaining.
	 */
	/**
	 * @function _syncalbum
	 * @memberof wp.media.view.attachment
	 * @instance
	 *
	 * @param {backbone.model} model
	 * @param {string} value
	 * @return {wp.media.view.attachment} returns itself to allow chaining.
	 */
	attachment.prototype[ method ] = function( model, value ) {
		var $setting = this.$('[data-setting="' + setting + '"]');

		if ( ! $setting.length ) {
			return this;
		}

		/*
		 * if the updated value is in sync with the value in the dom, there
		 * is no need to re-render. if we're currently editing the value,
		 * it will automatically be in sync, suppressing the re-render for
		 * the view we're editing, while updating any others.
		 */
		if ( value === $setting.find('input, textarea, select, [value]').val() ) {
			return this;
		}

		return this.render();
	};
});

module.exports = attachment;


/***/ }),

/***/ 4181:
/***/ ((module) => {

/**
 * wp.media.selectionsync
 *
 * sync an attachments selection in a state with another state.
 *
 * allows for selecting multiple images in the add media workflow, and then
 * switching to the insert gallery workflow while preserving the attachments selection.
 *
 * @memberof wp.media
 *
 * @mixin
 */
var selectionsync = {
	/**
	 * @since 3.5.0
	 */
	syncselection: function() {
		var selection = this.get('selection'),
			manager = this.frame._selection;

		if ( ! this.get('syncselection') || ! manager || ! selection ) {
			return;
		}

		/*
		 * if the selection supports multiple items, validate the stored
		 * attachments based on the new selection's conditions. record
		 * the attachments that are not included; we'll maintain a
		 * reference to those. other attachments are considered in flux.
		 */
		if ( selection.multiple ) {
			selection.reset( [], { silent: true });
			selection.validateall( manager.attachments );
			manager.difference = _.difference( manager.attachments.models, selection.models );
		}

		// sync the selection's single item with the master.
		selection.single( manager.single );
	},

	/**
	 * record the currently active attachments, which is a combination
	 * of the selection's attachments and the set of selected
	 * attachments that this specific selection considered invalid.
	 * reset the difference and record the single attachment.
	 *
	 * @since 3.5.0
	 */
	recordselection: function() {
		var selection = this.get('selection'),
			manager = this.frame._selection;

		if ( ! this.get('syncselection') || ! manager || ! selection ) {
			return;
		}

		if ( selection.multiple ) {
			manager.attachments.reset( selection.toarray().concat( manager.difference ) );
			manager.difference = [];
		} else {
			manager.attachments.add( selection.toarray() );
		}

		manager.single = selection._single;
	}
};

module.exports = selectionsync;


/***/ }),

/***/ 4274:
/***/ ((module) => {

var select = wp.media.view.mediaframe.select,
	library = wp.media.controller.library,
	l10n = wp.media.view.l10n,
	post;

/**
 * wp.media.view.mediaframe.post
 *
 * the frame for manipulating media on the edit post page.
 *
 * @memberof wp.media.view.mediaframe
 *
 * @class
 * @augments wp.media.view.mediaframe.select
 * @augments wp.media.view.mediaframe
 * @augments wp.media.view.frame
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 * @mixes wp.media.controller.statemachine
 */
post = select.extend(/** @lends wp.media.view.mediaframe.post.prototype */{
	initialize: function() {
		this.counts = {
			audio: {
				count: wp.media.view.settings.attachmentcounts.audio,
				state: 'playlist'
			},
			video: {
				count: wp.media.view.settings.attachmentcounts.video,
				state: 'video-playlist'
			}
		};

		_.defaults( this.options, {
			multiple:  true,
			editing:   false,
			state:    'insert',
			metadata:  {}
		});

		// call 'initialize' directly on the parent class.
		select.prototype.initialize.apply( this, arguments );
		this.createiframestates();

	},

	/**
	 * create the default states.
	 */
	createstates: function() {
		var options = this.options;

		this.states.add([
			// main states.
			new library({
				id:         'insert',
				title:      l10n.insertmediatitle,
				priority:   20,
				toolbar:    'main-insert',
				filterable: 'all',
				library:    wp.media.query( options.library ),
				multiple:   options.multiple ? 'reset' : false,
				editable:   true,

				// if the user isn't allowed to edit fields,
				// can they still edit it locally?
				allowlocaledits: true,

				// show the attachment display settings.
				displaysettings: true,
				// update user settings when users adjust the
				// attachment display settings.
				displayusersettings: true
			}),

			new library({
				id:         'gallery',
				title:      l10n.creategallerytitle,
				priority:   40,
				toolbar:    'main-gallery',
				filterable: 'uploaded',
				multiple:   'add',
				editable:   false,

				library:  wp.media.query( _.defaults({
					type: 'image'
				}, options.library ) )
			}),

			// embed states.
			new wp.media.controller.embed( { metadata: options.metadata } ),

			new wp.media.controller.editimage( { model: options.editimage } ),

			// gallery states.
			new wp.media.controller.galleryedit({
				library: options.selection,
				editing: options.editing,
				menu:    'gallery'
			}),

			new wp.media.controller.galleryadd(),

			new library({
				id:         'playlist',
				title:      l10n.createplaylisttitle,
				priority:   60,
				toolbar:    'main-playlist',
				filterable: 'uploaded',
				multiple:   'add',
				editable:   false,

				library:  wp.media.query( _.defaults({
					type: 'audio'
				}, options.library ) )
			}),

			// playlist states.
			new wp.media.controller.collectionedit({
				type: 'audio',
				collectiontype: 'playlist',
				title:          l10n.editplaylisttitle,
				settingsview:   wp.media.view.settings.playlist,
				library:        options.selection,
				editing:        options.editing,
				menu:           'playlist',
				draginfotext:   l10n.playlistdraginfo,
				draginfo:       false
			}),

			new wp.media.controller.collectionadd({
				type: 'audio',
				collectiontype: 'playlist',
				title: l10n.addtoplaylisttitle
			}),

			new library({
				id:         'video-playlist',
				title:      l10n.createvideoplaylisttitle,
				priority:   60,
				toolbar:    'main-video-playlist',
				filterable: 'uploaded',
				multiple:   'add',
				editable:   false,

				library:  wp.media.query( _.defaults({
					type: 'video'
				}, options.library ) )
			}),

			new wp.media.controller.collectionedit({
				type: 'video',
				collectiontype: 'playlist',
				title:          l10n.editvideoplaylisttitle,
				settingsview:   wp.media.view.settings.playlist,
				library:        options.selection,
				editing:        options.editing,
				menu:           'video-playlist',
				draginfotext:   l10n.videoplaylistdraginfo,
				draginfo:       false
			}),

			new wp.media.controller.collectionadd({
				type: 'video',
				collectiontype: 'playlist',
				title: l10n.addtovideoplaylisttitle
			})
		]);

		if ( wp.media.view.settings.post.featuredimageid ) {
			this.states.add( new wp.media.controller.featuredimage() );
		}
	},

	bindhandlers: function() {
		var handlers, checkcounts;

		select.prototype.bindhandlers.apply( this, arguments );

		this.on( 'activate', this.activate, this );

		// only bother checking media type counts if one of the counts is zero.
		checkcounts = _.find( this.counts, function( type ) {
			return type.count === 0;
		} );

		if ( typeof checkcounts !== 'undefined' ) {
			this.listento( wp.media.model.attachments.all, 'change:type', this.mediatypecounts );
		}

		this.on( 'menu:create:gallery', this.createmenu, this );
		this.on( 'menu:create:playlist', this.createmenu, this );
		this.on( 'menu:create:video-playlist', this.createmenu, this );
		this.on( 'toolbar:create:main-insert', this.createtoolbar, this );
		this.on( 'toolbar:create:main-gallery', this.createtoolbar, this );
		this.on( 'toolbar:create:main-playlist', this.createtoolbar, this );
		this.on( 'toolbar:create:main-video-playlist', this.createtoolbar, this );
		this.on( 'toolbar:create:featured-image', this.featuredimagetoolbar, this );
		this.on( 'toolbar:create:main-embed', this.mainembedtoolbar, this );

		handlers = {
			menu: {
				'default': 'mainmenu',
				'gallery': 'gallerymenu',
				'playlist': 'playlistmenu',
				'video-playlist': 'videoplaylistmenu'
			},

			content: {
				'embed':          'embedcontent',
				'edit-image':     'editimagecontent',
				'edit-selection': 'editselectioncontent'
			},

			toolbar: {
				'main-insert':      'maininserttoolbar',
				'main-gallery':     'maingallerytoolbar',
				'gallery-edit':     'galleryedittoolbar',
				'gallery-add':      'galleryaddtoolbar',
				'main-playlist':	'mainplaylisttoolbar',
				'playlist-edit':	'playlistedittoolbar',
				'playlist-add':		'playlistaddtoolbar',
				'main-video-playlist': 'mainvideoplaylisttoolbar',
				'video-playlist-edit': 'videoplaylistedittoolbar',
				'video-playlist-add': 'videoplaylistaddtoolbar'
			}
		};

		_.each( handlers, function( regionhandlers, region ) {
			_.each( regionhandlers, function( callback, handler ) {
				this.on( region + ':render:' + handler, this[ callback ], this );
			}, this );
		}, this );
	},

	activate: function() {
		// hide menu items for states tied to particular media types if there are no items.
		_.each( this.counts, function( type ) {
			if ( type.count < 1 ) {
				this.menuitemvisibility( type.state, 'hide' );
			}
		}, this );
	},

	mediatypecounts: function( model, attr ) {
		if ( typeof this.counts[ attr ] !== 'undefined' && this.counts[ attr ].count < 1 ) {
			this.counts[ attr ].count++;
			this.menuitemvisibility( this.counts[ attr ].state, 'show' );
		}
	},

	// menus.
	/**
	 * @param {wp.backbone.view} view
	 */
	mainmenu: function( view ) {
		view.set({
			'library-separator': new wp.media.view({
				classname:  'separator',
				priority:   100,
				attributes: {
					role: 'presentation'
				}
			})
		});
	},

	menuitemvisibility: function( state, visibility ) {
		var menu = this.menu.get();
		if ( visibility === 'hide' ) {
			menu.hide( state );
		} else if ( visibility === 'show' ) {
			menu.show( state );
		}
	},
	/**
	 * @param {wp.backbone.view} view
	 */
	gallerymenu: function( view ) {
		var laststate = this.laststate(),
			previous = laststate && laststate.id,
			frame = this;

		view.set({
			cancel: {
				text:     l10n.cancelgallerytitle,
				priority: 20,
				click:    function() {
					if ( previous ) {
						frame.setstate( previous );
					} else {
						frame.close();
					}

					// move focus to the modal after canceling a gallery.
					this.controller.modal.focusmanager.focus();
				}
			},
			separatecancel: new wp.media.view({
				classname: 'separator',
				priority: 40
			})
		});
	},

	playlistmenu: function( view ) {
		var laststate = this.laststate(),
			previous = laststate && laststate.id,
			frame = this;

		view.set({
			cancel: {
				text:     l10n.cancelplaylisttitle,
				priority: 20,
				click:    function() {
					if ( previous ) {
						frame.setstate( previous );
					} else {
						frame.close();
					}

					// move focus to the modal after canceling an audio playlist.
					this.controller.modal.focusmanager.focus();
				}
			},
			separatecancel: new wp.media.view({
				classname: 'separator',
				priority: 40
			})
		});
	},

	videoplaylistmenu: function( view ) {
		var laststate = this.laststate(),
			previous = laststate && laststate.id,
			frame = this;

		view.set({
			cancel: {
				text:     l10n.cancelvideoplaylisttitle,
				priority: 20,
				click:    function() {
					if ( previous ) {
						frame.setstate( previous );
					} else {
						frame.close();
					}

					// move focus to the modal after canceling a video playlist.
					this.controller.modal.focusmanager.focus();
				}
			},
			separatecancel: new wp.media.view({
				classname: 'separator',
				priority: 40
			})
		});
	},

	// content.
	embedcontent: function() {
		var view = new wp.media.view.embed({
			controller: this,
			model:      this.state()
		}).render();

		this.content.set( view );
	},

	editselectioncontent: function() {
		var state = this.state(),
			selection = state.get('selection'),
			view;

		view = new wp.media.view.attachmentsbrowser({
			controller: this,
			collection: selection,
			selection:  selection,
			model:      state,
			sortable:   true,
			search:     false,
			date:       false,
			draginfo:   true,

			attachmentview: wp.media.view.attachments.editselection
		}).render();

		view.toolbar.set( 'backtolibrary', {
			text:     l10n.returntolibrary,
			priority: -100,

			click: function() {
				this.controller.content.mode('browse');
				// move focus to the modal when jumping back from edit selection to add media view.
				this.controller.modal.focusmanager.focus();
			}
		});

		// browse our library of attachments.
		this.content.set( view );

		// trigger the controller to set focus.
		this.trigger( 'edit:selection', this );
	},

	editimagecontent: function() {
		var image = this.state().get('image'),
			view = new wp.media.view.editimage( { model: image, controller: this } ).render();

		this.content.set( view );

		// after creating the wrapper view, load the actual editor via an ajax call.
		view.loadeditor();

	},

	// toolbars.

	/**
	 * @param {wp.backbone.view} view
	 */
	selectionstatustoolbar: function( view ) {
		var editable = this.state().get('editable');

		view.set( 'selection', new wp.media.view.selection({
			controller: this,
			collection: this.state().get('selection'),
			priority:   -40,

			// if the selection is editable, pass the callback to
			// switch the content mode.
			editable: editable && function() {
				this.controller.content.mode('edit-selection');
			}
		}).render() );
	},

	/**
	 * @param {wp.backbone.view} view
	 */
	maininserttoolbar: function( view ) {
		var controller = this;

		this.selectionstatustoolbar( view );

		view.set( 'insert', {
			style:    'primary',
			priority: 80,
			text:     l10n.insertintopost,
			requires: { selection: true },

			/**
			 * @ignore
			 *
			 * @fires wp.media.controller.state#insert
			 */
			click: function() {
				var state = controller.state(),
					selection = state.get('selection');

				controller.close();
				state.trigger( 'insert', selection ).reset();
			}
		});
	},

	/**
	 * @param {wp.backbone.view} view
	 */
	maingallerytoolbar: function( view ) {
		var controller = this;

		this.selectionstatustoolbar( view );

		view.set( 'gallery', {
			style:    'primary',
			text:     l10n.createnewgallery,
			priority: 60,
			requires: { selection: true },

			click: function() {
				var selection = controller.state().get('selection'),
					edit = controller.state('gallery-edit'),
					models = selection.where({ type: 'image' });

				edit.set( 'library', new wp.media.model.selection( models, {
					props:    selection.props.tojson(),
					multiple: true
				}) );

				// jump to edit gallery view.
				this.controller.setstate( 'gallery-edit' );

				// move focus to the modal after jumping to edit gallery view.
				this.controller.modal.focusmanager.focus();
			}
		});
	},

	mainplaylisttoolbar: function( view ) {
		var controller = this;

		this.selectionstatustoolbar( view );

		view.set( 'playlist', {
			style:    'primary',
			text:     l10n.createnewplaylist,
			priority: 100,
			requires: { selection: true },

			click: function() {
				var selection = controller.state().get('selection'),
					edit = controller.state('playlist-edit'),
					models = selection.where({ type: 'audio' });

				edit.set( 'library', new wp.media.model.selection( models, {
					props:    selection.props.tojson(),
					multiple: true
				}) );

				// jump to edit audio playlist view.
				this.controller.setstate( 'playlist-edit' );

				// move focus to the modal after jumping to edit audio playlist view.
				this.controller.modal.focusmanager.focus();
			}
		});
	},

	mainvideoplaylisttoolbar: function( view ) {
		var controller = this;

		this.selectionstatustoolbar( view );

		view.set( 'video-playlist', {
			style:    'primary',
			text:     l10n.createnewvideoplaylist,
			priority: 100,
			requires: { selection: true },

			click: function() {
				var selection = controller.state().get('selection'),
					edit = controller.state('video-playlist-edit'),
					models = selection.where({ type: 'video' });

				edit.set( 'library', new wp.media.model.selection( models, {
					props:    selection.props.tojson(),
					multiple: true
				}) );

				// jump to edit video playlist view.
				this.controller.setstate( 'video-playlist-edit' );

				// move focus to the modal after jumping to edit video playlist view.
				this.controller.modal.focusmanager.focus();
			}
		});
	},

	featuredimagetoolbar: function( toolbar ) {
		this.createselecttoolbar( toolbar, {
			text:  l10n.setfeaturedimage,
			state: this.options.state
		});
	},

	mainembedtoolbar: function( toolbar ) {
		toolbar.view = new wp.media.view.toolbar.embed({
			controller: this
		});
	},

	galleryedittoolbar: function() {
		var editing = this.state().get('editing');
		this.toolbar.set( new wp.media.view.toolbar({
			controller: this,
			items: {
				insert: {
					style:    'primary',
					text:     editing ? l10n.updategallery : l10n.insertgallery,
					priority: 80,
					requires: { library: true, uploadingcomplete: true },

					/**
					 * @fires wp.media.controller.state#update
					 */
					click: function() {
						var controller = this.controller,
							state = controller.state();

						controller.close();
						state.trigger( 'update', state.get('library') );

						// restore and reset the default state.
						controller.setstate( controller.options.state );
						controller.reset();
					}
				}
			}
		}) );
	},

	galleryaddtoolbar: function() {
		this.toolbar.set( new wp.media.view.toolbar({
			controller: this,
			items: {
				insert: {
					style:    'primary',
					text:     l10n.addtogallery,
					priority: 80,
					requires: { selection: true },

					/**
					 * @fires wp.media.controller.state#reset
					 */
					click: function() {
						var controller = this.controller,
							state = controller.state(),
							edit = controller.state('gallery-edit');

						edit.get('library').add( state.get('selection').models );
						state.trigger('reset');
						controller.setstate('gallery-edit');
						// move focus to the modal when jumping back from add to gallery to edit gallery view.
						this.controller.modal.focusmanager.focus();
					}
				}
			}
		}) );
	},

	playlistedittoolbar: function() {
		var editing = this.state().get('editing');
		this.toolbar.set( new wp.media.view.toolbar({
			controller: this,
			items: {
				insert: {
					style:    'primary',
					text:     editing ? l10n.updateplaylist : l10n.insertplaylist,
					priority: 80,
					requires: { library: true },

					/**
					 * @fires wp.media.controller.state#update
					 */
					click: function() {
						var controller = this.controller,
							state = controller.state();

						controller.close();
						state.trigger( 'update', state.get('library') );

						// restore and reset the default state.
						controller.setstate( controller.options.state );
						controller.reset();
					}
				}
			}
		}) );
	},

	playlistaddtoolbar: function() {
		this.toolbar.set( new wp.media.view.toolbar({
			controller: this,
			items: {
				insert: {
					style:    'primary',
					text:     l10n.addtoplaylist,
					priority: 80,
					requires: { selection: true },

					/**
					 * @fires wp.media.controller.state#reset
					 */
					click: function() {
						var controller = this.controller,
							state = controller.state(),
							edit = controller.state('playlist-edit');

						edit.get('library').add( state.get('selection').models );
						state.trigger('reset');
						controller.setstate('playlist-edit');
						// move focus to the modal when jumping back from add to audio playlist to edit audio playlist view.
						this.controller.modal.focusmanager.focus();
					}
				}
			}
		}) );
	},

	videoplaylistedittoolbar: function() {
		var editing = this.state().get('editing');
		this.toolbar.set( new wp.media.view.toolbar({
			controller: this,
			items: {
				insert: {
					style:    'primary',
					text:     editing ? l10n.updatevideoplaylist : l10n.insertvideoplaylist,
					priority: 140,
					requires: { library: true },

					click: function() {
						var controller = this.controller,
							state = controller.state(),
							library = state.get('library');

						library.type = 'video';

						controller.close();
						state.trigger( 'update', library );

						// restore and reset the default state.
						controller.setstate( controller.options.state );
						controller.reset();
					}
				}
			}
		}) );
	},

	videoplaylistaddtoolbar: function() {
		this.toolbar.set( new wp.media.view.toolbar({
			controller: this,
			items: {
				insert: {
					style:    'primary',
					text:     l10n.addtovideoplaylist,
					priority: 140,
					requires: { selection: true },

					click: function() {
						var controller = this.controller,
							state = controller.state(),
							edit = controller.state('video-playlist-edit');

						edit.get('library').add( state.get('selection').models );
						state.trigger('reset');
						controller.setstate('video-playlist-edit');
						// move focus to the modal when jumping back from add to video playlist to edit video playlist view.
						this.controller.modal.focusmanager.focus();
					}
				}
			}
		}) );
	}
});

module.exports = post;


/***/ }),

/***/ 4338:
/***/ ((module) => {

/**
 * wp.media.view.label
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var label = wp.media.view.extend(/** @lends wp.media.view.label.prototype */{
	tagname: 'label',
	classname: 'screen-reader-text',

	initialize: function() {
		this.value = this.options.value;
	},

	render: function() {
		this.$el.html( this.value );

		return this;
	}
});

module.exports = label;


/***/ }),

/***/ 4593:
/***/ ((module) => {

/**
 * wp.media.view.attachment.editselection
 *
 * @memberof wp.media.view.attachment
 *
 * @class
 * @augments wp.media.view.attachment.selection
 * @augments wp.media.view.attachment
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var editselection = wp.media.view.attachment.selection.extend(/** @lends wp.media.view.attachment.editselection.prototype */{
	buttons: {
		close: true
	}
});

module.exports = editselection;


/***/ }),

/***/ 4747:
/***/ ((module) => {

/**
 * wp.media.view
 *
 * the base view class for media.
 *
 * undelegating events, removing events from the model, and
 * removing events from the controller mirror the code for
 * `backbone.view.dispose` in backbone 0.9.8 development.
 *
 * this behavior has since been removed, and should not be used
 * outside of the media manager.
 *
 * @memberof wp.media
 *
 * @class
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var view = wp.backbone.view.extend(/** @lends wp.media.view.prototype */{
	constructor: function( options ) {
		if ( options && options.controller ) {
			this.controller = options.controller;
		}
		wp.backbone.view.apply( this, arguments );
	},
	/**
	 * @todo the internal comment mentions this might have been a stop-gap
	 *       before backbone 0.9.8 came out. figure out if backbone core takes
	 *       care of this in backbone.view now.
	 *
	 * @return {wp.media.view} returns itself to allow chaining.
	 */
	dispose: function() {
		/*
		 * undelegating events, removing events from the model, and
		 * removing events from the controller mirror the code for
		 * `backbone.view.dispose` in backbone 0.9.8 development.
		 */
		this.undelegateevents();

		if ( this.model && this.model.off ) {
			this.model.off( null, null, this );
		}

		if ( this.collection && this.collection.off ) {
			this.collection.off( null, null, this );
		}

		// unbind controller events.
		if ( this.controller && this.controller.off ) {
			this.controller.off( null, null, this );
		}

		return this;
	},
	/**
	 * @return {wp.media.view} returns itself to allow chaining.
	 */
	remove: function() {
		this.dispose();
		/**
		 * call 'remove' directly on the parent class
		 */
		return wp.backbone.view.prototype.remove.apply( this, arguments );
	}
});

module.exports = view;


/***/ }),

/***/ 4783:
/***/ ((module) => {

var menu = wp.media.view.menu,
	router;

/**
 * wp.media.view.router
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view.menu
 * @augments wp.media.view.prioritylist
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
router = menu.extend(/** @lends wp.media.view.router.prototype */{
	tagname:   'div',
	classname: 'media-router',
	property:  'contentmode',
	itemview:  wp.media.view.routeritem,
	region:    'router',

	attributes: {
		role:               'tablist',
		'aria-orientation': 'horizontal'
	},

	initialize: function() {
		this.controller.on( 'content:render', this.update, this );
		// call 'initialize' directly on the parent class.
		menu.prototype.initialize.apply( this, arguments );
	},

	update: function() {
		var mode = this.controller.content.mode();
		if ( mode ) {
			this.select( mode );
		}
	}
});

module.exports = router;


/***/ }),

/***/ 4910:
/***/ ((module) => {

var l10n = wp.media.view.l10n,
	$ = backbone.$,
	embed;

/**
 * wp.media.controller.embed
 *
 * a state for embedding media from a url.
 *
 * @memberof wp.media.controller
 *
 * @class
 * @augments wp.media.controller.state
 * @augments backbone.model
 *
 * @param {object} attributes                         the attributes hash passed to the state.
 * @param {string} [attributes.id=embed]              unique identifier.
 * @param {string} [attributes.title=insert from url] title for the state. displays in the media menu and the frame's title region.
 * @param {string} [attributes.content=embed]         initial mode for the content region.
 * @param {string} [attributes.menu=default]          initial mode for the menu region.
 * @param {string} [attributes.toolbar=main-embed]    initial mode for the toolbar region.
 * @param {string} [attributes.menu=false]            initial mode for the menu region.
 * @param {int}    [attributes.priority=120]          the priority for the state link in the media menu.
 * @param {string} [attributes.type=link]             the type of embed. currently only link is supported.
 * @param {string} [attributes.url]                   the embed url.
 * @param {object} [attributes.metadata={}]           properties of the embed, which will override attributes.url if set.
 */
embed = wp.media.controller.state.extend(/** @lends wp.media.controller.embed.prototype */{
	defaults: {
		id:       'embed',
		title:    l10n.insertfromurltitle,
		content:  'embed',
		menu:     'default',
		toolbar:  'main-embed',
		priority: 120,
		type:     'link',
		url:      '',
		metadata: {}
	},

	// the amount of time used when debouncing the scan.
	sensitivity: 400,

	initialize: function(options) {
		this.metadata = options.metadata;
		this.debouncedscan = _.debounce( _.bind( this.scan, this ), this.sensitivity );
		this.props = new backbone.model( this.metadata || { url: '' });
		this.props.on( 'change:url', this.debouncedscan, this );
		this.props.on( 'change:url', this.refresh, this );
		this.on( 'scan', this.scanimage, this );
	},

	/**
	 * trigger a scan of the embedded url's content for metadata required to embed.
	 *
	 * @fires wp.media.controller.embed#scan
	 */
	scan: function() {
		var scanners,
			embed = this,
			attributes = {
				type: 'link',
				scanners: []
			};

		/*
		 * scan is triggered with the list of `attributes` to set on the
		 * state, useful for the 'type' attribute and 'scanners' attribute,
		 * an array of promise objects for asynchronous scan operations.
		 */
		if ( this.props.get('url') ) {
			this.trigger( 'scan', attributes );
		}

		if ( attributes.scanners.length ) {
			scanners = attributes.scanners = $.when.apply( $, attributes.scanners );
			scanners.always( function() {
				if ( embed.get('scanners') === scanners ) {
					embed.set( 'loading', false );
				}
			});
		} else {
			attributes.scanners = null;
		}

		attributes.loading = !! attributes.scanners;
		this.set( attributes );
	},
	/**
	 * try scanning the embed as an image to discover its dimensions.
	 *
	 * @param {object} attributes
	 */
	scanimage: function( attributes ) {
		var frame = this.frame,
			state = this,
			url = this.props.get('url'),
			image = new image(),
			deferred = $.deferred();

		attributes.scanners.push( deferred.promise() );

		// try to load the image and find its width/height.
		image.onload = function() {
			deferred.resolve();

			if ( state !== frame.state() || url !== state.props.get('url') ) {
				return;
			}

			state.set({
				type: 'image'
			});

			state.props.set({
				width:  image.width,
				height: image.height
			});
		};

		image.onerror = deferred.reject;
		image.src = url;
	},

	refresh: function() {
		this.frame.toolbar.get().refresh();
	},

	reset: function() {
		this.props.clear().set({ url: '' });

		if ( this.active ) {
			this.refresh();
		}
	}
});

module.exports = embed;


/***/ }),

/***/ 5232:
/***/ ((module) => {

/**
 * wp.media.view.attachment.editlibrary
 *
 * @memberof wp.media.view.attachment
 *
 * @class
 * @augments wp.media.view.attachment
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var editlibrary = wp.media.view.attachment.extend(/** @lends wp.media.view.attachment.editlibrary.prototype */{
	buttons: {
		close: true
	}
});

module.exports = editlibrary;


/***/ }),

/***/ 5275:
/***/ ((module) => {

var view = wp.media.view,
	toolbar;

/**
 * wp.media.view.toolbar
 *
 * a toolbar which consists of a primary and a secondary section. each sections
 * can be filled with views.
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
toolbar = view.extend(/** @lends wp.media.view.toolbar.prototype */{
	tagname:   'div',
	classname: 'media-toolbar',

	initialize: function() {
		var state = this.controller.state(),
			selection = this.selection = state.get('selection'),
			library = this.library = state.get('library');

		this._views = {};

		// the toolbar is composed of two `prioritylist` views.
		this.primary   = new wp.media.view.prioritylist();
		this.secondary = new wp.media.view.prioritylist();
		this.tertiary  = new wp.media.view.prioritylist();
		this.primary.$el.addclass('media-toolbar-primary search-form');
		this.secondary.$el.addclass('media-toolbar-secondary');
		this.tertiary.$el.addclass('media-bg-overlay');

		this.views.set([ this.secondary, this.primary, this.tertiary ]);

		if ( this.options.items ) {
			this.set( this.options.items, { silent: true });
		}

		if ( ! this.options.silent ) {
			this.render();
		}

		if ( selection ) {
			selection.on( 'add remove reset', this.refresh, this );
		}

		if ( library ) {
			library.on( 'add remove reset', this.refresh, this );
		}
	},
	/**
	 * @return {wp.media.view.toolbar} returns itself to allow chaining
	 */
	dispose: function() {
		if ( this.selection ) {
			this.selection.off( null, null, this );
		}

		if ( this.library ) {
			this.library.off( null, null, this );
		}
		/**
		 * call 'dispose' directly on the parent class
		 */
		return view.prototype.dispose.apply( this, arguments );
	},

	ready: function() {
		this.refresh();
	},

	/**
	 * @param {string} id
	 * @param {backbone.view|object} view
	 * @param {object} [options={}]
	 * @return {wp.media.view.toolbar} returns itself to allow chaining.
	 */
	set: function( id, view, options ) {
		var list;
		options = options || {};

		// accept an object with an `id` : `view` mapping.
		if ( _.isobject( id ) ) {
			_.each( id, function( view, id ) {
				this.set( id, view, { silent: true });
			}, this );

		} else {
			if ( ! ( view instanceof backbone.view ) ) {
				view.classes = [ 'media-button-' + id ].concat( view.classes || [] );
				view = new wp.media.view.button( view ).render();
			}

			view.controller = view.controller || this.controller;

			this._views[ id ] = view;

			list = view.options.priority < 0 ? 'secondary' : 'primary';
			this[ list ].set( id, view, options );
		}

		if ( ! options.silent ) {
			this.refresh();
		}

		return this;
	},
	/**
	 * @param {string} id
	 * @return {wp.media.view.button}
	 */
	get: function( id ) {
		return this._views[ id ];
	},
	/**
	 * @param {string} id
	 * @param {object} options
	 * @return {wp.media.view.toolbar} returns itself to allow chaining.
	 */
	unset: function( id, options ) {
		delete this._views[ id ];
		this.primary.unset( id, options );
		this.secondary.unset( id, options );
		this.tertiary.unset( id, options );

		if ( ! options || ! options.silent ) {
			this.refresh();
		}
		return this;
	},

	refresh: function() {
		var state = this.controller.state(),
			library = state.get('library'),
			selection = state.get('selection');

		_.each( this._views, function( button ) {
			if ( ! button.model || ! button.options || ! button.options.requires ) {
				return;
			}

			var requires = button.options.requires,
				disabled = false,
				modelsuploading = library && ! _.isempty( library.findwhere( { 'uploading': true } ) );

			// prevent insertion of attachments if any of them are still uploading.
			if ( selection && selection.models ) {
				disabled = _.some( selection.models, function( attachment ) {
					return attachment.get('uploading') === true;
				});
			}
			if ( requires.uploadingcomplete && modelsuploading ) {
				disabled = true;
			}

			if ( requires.selection && selection && ! selection.length ) {
				disabled = true;
			} else if ( requires.library && library && ! library.length ) {
				disabled = true;
			}
			button.model.set( 'disabled', disabled );
		});
	}
});

module.exports = toolbar;


/***/ }),

/***/ 5422:
/***/ ((module) => {

var l10n = wp.media.view.l10n,
	cropper;

/**
 * wp.media.controller.cropper
 *
 * a class for cropping an image when called from the header media customization panel.
 *
 * @memberof wp.media.controller
 *
 * @class
 * @augments wp.media.controller.state
 * @augments backbone.model
 */
cropper = wp.media.controller.state.extend(/** @lends wp.media.controller.cropper.prototype */{
	defaults: {
		id:          'cropper',
		title:       l10n.cropimage,
		// region mode defaults.
		toolbar:     'crop',
		content:     'crop',
		router:      false,
		canskipcrop: false,

		// default docrop ajax arguments to allow the customizer (for example) to inject state.
		docropargs: {}
	},

	/**
	 * shows the crop image window when called from the add new image button.
	 *
	 * @since 4.2.0
	 *
	 * @return {void}
	 */
	activate: function() {
		this.frame.on( 'content:create:crop', this.createcropcontent, this );
		this.frame.on( 'close', this.removecropper, this );
		this.set('selection', new backbone.collection(this.frame._selection.single));
	},

	/**
	 * changes the state of the toolbar window to browse mode.
	 *
	 * @since 4.2.0
	 *
	 * @return {void}
	 */
	deactivate: function() {
		this.frame.toolbar.mode('browse');
	},

	/**
	 * creates the crop image window.
	 *
	 * initialized when clicking on the select and crop button.
	 *
	 * @since 4.2.0
	 *
	 * @fires crop window
	 *
	 * @return {void}
	 */
	createcropcontent: function() {
		this.cropperview = new wp.media.view.cropper({
			controller: this,
			attachment: this.get('selection').first()
		});
		this.cropperview.on('image-loaded', this.createcroptoolbar, this);
		this.frame.content.set(this.cropperview);

	},

	/**
	 * removes the image selection and closes the cropping window.
	 *
	 * @since 4.2.0
	 *
	 * @return {void}
	 */
	removecropper: function() {
		this.imgselect.cancelselection();
		this.imgselect.setoptions({remove: true});
		this.imgselect.update();
		this.cropperview.remove();
	},

	/**
	 * checks if cropping can be skipped and creates crop toolbar accordingly.
	 *
	 * @since 4.2.0
	 *
	 * @return {void}
	 */
	createcroptoolbar: function() {
		var canskipcrop, hasrequiredaspectratio, suggestedcropsize, toolbaroptions;

		suggestedcropsize      = this.get( 'suggestedcropsize' );
		hasrequiredaspectratio = this.get( 'hasrequiredaspectratio' );
		canskipcrop            = this.get( 'canskipcrop' ) || false;

		toolbaroptions = {
			controller: this.frame,
			items: {
				insert: {
					style:    'primary',
					text:     l10n.cropimage,
					priority: 80,
					requires: { library: false, selection: false },

					click: function() {
						var controller = this.controller,
							selection;

						selection = controller.state().get('selection').first();
						selection.set({cropdetails: controller.state().imgselect.getselection()});

						this.$el.text(l10n.cropping);
						this.$el.attr('disabled', true);

						controller.state().docrop( selection ).done( function( croppedimage ) {
							controller.trigger('cropped', croppedimage );
							controller.close();
						}).fail( function() {
							controller.trigger('content:error:crop');
						});
					}
				}
			}
		};

		if ( canskipcrop || hasrequiredaspectratio ) {
			_.extend( toolbaroptions.items, {
				skip: {
					style:      'secondary',
					text:       l10n.skipcropping,
					priority:   70,
					requires:   { library: false, selection: false },
					click:      function() {
						var controller = this.controller,
							selection = controller.state().get( 'selection' ).first();

						controller.state().cropperview.remove();

						// apply the suggested crop size.
						if ( hasrequiredaspectratio && !canskipcrop ) {
							selection.set({cropdetails: suggestedcropsize});
							controller.state().docrop( selection ).done( function( croppedimage ) {
								controller.trigger( 'cropped', croppedimage );
								controller.close();
							}).fail( function() {
								controller.trigger( 'content:error:crop' );
							});
							return;
						}

						// skip the cropping process.
						controller.trigger( 'skippedcrop', selection );
						controller.close();
					}
				}
			});
		}

		this.frame.toolbar.set( new wp.media.view.toolbar(toolbaroptions) );
	},

	/**
	 * creates an object with the image attachment and crop properties.
	 *
	 * @since 4.2.0
	 *
	 * @return {$.promise} a jquery promise with the custom header crop details.
	 */
	docrop: function( attachment ) {
		return wp.ajax.post( 'custom-header-crop', _.extend(
			{},
			this.defaults.docropargs,
			{
				nonce: attachment.get( 'nonces' ).edit,
				id: attachment.get( 'id' ),
				cropdetails: attachment.get( 'cropdetails' )
			}
		) );
	}
});

module.exports = cropper;


/***/ }),

/***/ 5424:
/***/ ((module) => {

var select = wp.media.view.mediaframe.select,
	l10n = wp.media.view.l10n,
	imagedetails;

/**
 * wp.media.view.mediaframe.imagedetails
 *
 * a media frame for manipulating an image that's already been inserted
 * into a post.
 *
 * @memberof wp.media.view.mediaframe
 *
 * @class
 * @augments wp.media.view.mediaframe.select
 * @augments wp.media.view.mediaframe
 * @augments wp.media.view.frame
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 * @mixes wp.media.controller.statemachine
 */
imagedetails = select.extend(/** @lends wp.media.view.mediaframe.imagedetails.prototype */{
	defaults: {
		id:      'image',
		url:     '',
		menu:    'image-details',
		content: 'image-details',
		toolbar: 'image-details',
		type:    'link',
		title:    l10n.imagedetailstitle,
		priority: 120
	},

	initialize: function( options ) {
		this.image = new wp.media.model.postimage( options.metadata );
		this.options.selection = new wp.media.model.selection( this.image.attachment, { multiple: false } );
		select.prototype.initialize.apply( this, arguments );
	},

	bindhandlers: function() {
		select.prototype.bindhandlers.apply( this, arguments );
		this.on( 'menu:create:image-details', this.createmenu, this );
		this.on( 'content:create:image-details', this.imagedetailscontent, this );
		this.on( 'content:render:edit-image', this.editimagecontent, this );
		this.on( 'toolbar:render:image-details', this.renderimagedetailstoolbar, this );
		// override the select toolbar.
		this.on( 'toolbar:render:replace', this.renderreplaceimagetoolbar, this );
	},

	createstates: function() {
		this.states.add([
			new wp.media.controller.imagedetails({
				image: this.image,
				editable: false
			}),
			new wp.media.controller.replaceimage({
				id: 'replace-image',
				library: wp.media.query( { type: 'image' } ),
				image: this.image,
				multiple:  false,
				title:     l10n.imagereplacetitle,
				toolbar: 'replace',
				priority:  80,
				displaysettings: true
			}),
			new wp.media.controller.editimage( {
				image: this.image,
				selection: this.options.selection
			} )
		]);
	},

	imagedetailscontent: function( options ) {
		options.view = new wp.media.view.imagedetails({
			controller: this,
			model: this.state().image,
			attachment: this.state().image.attachment
		});
	},

	editimagecontent: function() {
		var state = this.state(),
			model = state.get('image'),
			view;

		if ( ! model ) {
			return;
		}

		view = new wp.media.view.editimage( { model: model, controller: this } ).render();

		this.content.set( view );

		// after bringing in the frame, load the actual editor via an ajax call.
		view.loadeditor();

	},

	renderimagedetailstoolbar: function() {
		this.toolbar.set( new wp.media.view.toolbar({
			controller: this,
			items: {
				select: {
					style:    'primary',
					text:     l10n.update,
					priority: 80,

					click: function() {
						var controller = this.controller,
							state = controller.state();

						controller.close();

						// not sure if we want to use wp.media.string.image which will create a shortcode or
						// perhaps wp.html.string to at least to build the <img />.
						state.trigger( 'update', controller.image.tojson() );

						// restore and reset the default state.
						controller.setstate( controller.options.state );
						controller.reset();
					}
				}
			}
		}) );
	},

	renderreplaceimagetoolbar: function() {
		var frame = this,
			laststate = frame.laststate(),
			previous = laststate && laststate.id;

		this.toolbar.set( new wp.media.view.toolbar({
			controller: this,
			items: {
				back: {
					text:     l10n.back,
					priority: 80,
					click:    function() {
						if ( previous ) {
							frame.setstate( previous );
						} else {
							frame.close();
						}
					}
				},

				replace: {
					style:    'primary',
					text:     l10n.replace,
					priority: 20,
					requires: { selection: true },

					click: function() {
						var controller = this.controller,
							state = controller.state(),
							selection = state.get( 'selection' ),
							attachment = selection.single();

						controller.close();

						controller.image.changeattachment( attachment, state.display( attachment ) );

						// not sure if we want to use wp.media.string.image which will create a shortcode or
						// perhaps wp.html.string to at least to build the <img />.
						state.trigger( 'replace', controller.image.tojson() );

						// restore and reset the default state.
						controller.setstate( controller.options.state );
						controller.reset();
					}
				}
			}
		}) );
	}

});

module.exports = imagedetails;


/***/ }),

/***/ 5663:
/***/ ((module) => {

var l10n = wp.media.view.l10n,
	editimage;

/**
 * wp.media.controller.editimage
 *
 * a state for editing (cropping, etc.) an image.
 *
 * @memberof wp.media.controller
 *
 * @class
 * @augments wp.media.controller.state
 * @augments backbone.model
 *
 * @param {object}                    attributes                      the attributes hash passed to the state.
 * @param {wp.media.model.attachment} attributes.model                the attachment.
 * @param {string}                    [attributes.id=edit-image]      unique identifier.
 * @param {string}                    [attributes.title=edit image]   title for the state. displays in the media menu and the frame's title region.
 * @param {string}                    [attributes.content=edit-image] initial mode for the content region.
 * @param {string}                    [attributes.toolbar=edit-image] initial mode for the toolbar region.
 * @param {string}                    [attributes.menu=false]         initial mode for the menu region.
 * @param {string}                    [attributes.url]                unused. @todo consider removal.
 */
editimage = wp.media.controller.state.extend(/** @lends wp.media.controller.editimage.prototype */{
	defaults: {
		id:      'edit-image',
		title:   l10n.editimage,
		menu:    false,
		toolbar: 'edit-image',
		content: 'edit-image',
		url:     ''
	},

	/**
	 * activates a frame for editing a featured image.
	 *
	 * @since 3.9.0
	 *
	 * @return {void}
	 */
	activate: function() {
		this.frame.on( 'toolbar:render:edit-image', _.bind( this.toolbar, this ) );
	},

	/**
	 * deactivates a frame for editing a featured image.
	 *
	 * @since 3.9.0
	 *
	 * @return {void}
	 */
	deactivate: function() {
		this.frame.off( 'toolbar:render:edit-image' );
	},

	/**
	 * adds a toolbar with a back button.
	 *
	 * when the back button is pressed it checks whether there is a previous state.
	 * in case there is a previous state it sets that previous state otherwise it
	 * closes the frame.
	 *
	 * @since 3.9.0
	 *
	 * @return {void}
	 */
	toolbar: function() {
		var frame = this.frame,
			laststate = frame.laststate(),
			previous = laststate && laststate.id;

		frame.toolbar.set( new wp.media.view.toolbar({
			controller: frame,
			items: {
				back: {
					style: 'primary',
					text:     l10n.back,
					priority: 20,
					click:    function() {
						if ( previous ) {
							frame.setstate( previous );
						} else {
							frame.close();
						}
					}
				}
			}
		}) );
	}
});

module.exports = editimage;


/***/ }),

/***/ 5694:
/***/ ((module) => {

/**
 * wp.media.controller.state
 *
 * a state is a step in a workflow that when set will trigger the controllers
 * for the regions to be updated as specified in the frame.
 *
 * a state has an event-driven lifecycle:
 *
 *     'ready'      triggers when a state is added to a state machine's collection.
 *     'activate'   triggers when a state is activated by a state machine.
 *     'deactivate' triggers when a state is deactivated by a state machine.
 *     'reset'      is not triggered automatically. it should be invoked by the
 *                  proper controller to reset the state to its default.
 *
 * @memberof wp.media.controller
 *
 * @class
 * @augments backbone.model
 */
var state = backbone.model.extend(/** @lends wp.media.controller.state.prototype */{
	/**
	 * constructor.
	 *
	 * @since 3.5.0
	 */
	constructor: function() {
		this.on( 'activate', this._preactivate, this );
		this.on( 'activate', this.activate, this );
		this.on( 'activate', this._postactivate, this );
		this.on( 'deactivate', this._deactivate, this );
		this.on( 'deactivate', this.deactivate, this );
		this.on( 'reset', this.reset, this );
		this.on( 'ready', this._ready, this );
		this.on( 'ready', this.ready, this );
		/**
		 * call parent constructor with passed arguments
		 */
		backbone.model.apply( this, arguments );
		this.on( 'change:menu', this._updatemenu, this );
	},
	/**
	 * ready event callback.
	 *
	 * @abstract
	 * @since 3.5.0
	 */
	ready: function() {},

	/**
	 * activate event callback.
	 *
	 * @abstract
	 * @since 3.5.0
	 */
	activate: function() {},

	/**
	 * deactivate event callback.
	 *
	 * @abstract
	 * @since 3.5.0
	 */
	deactivate: function() {},

	/**
	 * reset event callback.
	 *
	 * @abstract
	 * @since 3.5.0
	 */
	reset: function() {},

	/**
	 * @since 3.5.0
	 * @access private
	 */
	_ready: function() {
		this._updatemenu();
	},

	/**
	 * @since 3.5.0
	 * @access private
	*/
	_preactivate: function() {
		this.active = true;
	},

	/**
	 * @since 3.5.0
	 * @access private
	 */
	_postactivate: function() {
		this.on( 'change:menu', this._menu, this );
		this.on( 'change:titlemode', this._title, this );
		this.on( 'change:content', this._content, this );
		this.on( 'change:toolbar', this._toolbar, this );

		this.frame.on( 'title:render:default', this._rendertitle, this );

		this._title();
		this._menu();
		this._toolbar();
		this._content();
		this._router();
	},

	/**
	 * @since 3.5.0
	 * @access private
	 */
	_deactivate: function() {
		this.active = false;

		this.frame.off( 'title:render:default', this._rendertitle, this );

		this.off( 'change:menu', this._menu, this );
		this.off( 'change:titlemode', this._title, this );
		this.off( 'change:content', this._content, this );
		this.off( 'change:toolbar', this._toolbar, this );
	},

	/**
	 * @since 3.5.0
	 * @access private
	 */
	_title: function() {
		this.frame.title.render( this.get('titlemode') || 'default' );
	},

	/**
	 * @since 3.5.0
	 * @access private
	 */
	_rendertitle: function( view ) {
		view.$el.text( this.get('title') || '' );
	},

	/**
	 * @since 3.5.0
	 * @access private
	 */
	_router: function() {
		var router = this.frame.router,
			mode = this.get('router'),
			view;

		this.frame.$el.toggleclass( 'hide-router', ! mode );
		if ( ! mode ) {
			return;
		}

		this.frame.router.render( mode );

		view = router.get();
		if ( view && view.select ) {
			view.select( this.frame.content.mode() );
		}
	},

	/**
	 * @since 3.5.0
	 * @access private
	 */
	_menu: function() {
		var menu = this.frame.menu,
			mode = this.get('menu'),
			actionmenuitems,
			actionmenulength,
			view;

		if ( this.frame.menu ) {
			actionmenuitems = this.frame.menu.get('views'),
			actionmenulength = actionmenuitems ? actionmenuitems.views.get().length : 0,
			// show action menu only if it is active and has more than one default element.
			this.frame.$el.toggleclass( 'hide-menu', ! mode || actionmenulength < 2 );
		}
		if ( ! mode ) {
			return;
		}

		menu.mode( mode );

		view = menu.get();
		if ( view && view.select ) {
			view.select( this.id );
		}
	},

	/**
	 * @since 3.5.0
	 * @access private
	 */
	_updatemenu: function() {
		var previous = this.previous('menu'),
			menu = this.get('menu');

		if ( previous ) {
			this.frame.off( 'menu:render:' + previous, this._rendermenu, this );
		}

		if ( menu ) {
			this.frame.on( 'menu:render:' + menu, this._rendermenu, this );
		}
	},

	/**
	 * create a view in the media menu for the state.
	 *
	 * @since 3.5.0
	 * @access private
	 *
	 * @param {media.view.menu} view the menu view.
	 */
	_rendermenu: function( view ) {
		var menuitem = this.get('menuitem'),
			title = this.get('title'),
			priority = this.get('priority');

		if ( ! menuitem && title ) {
			menuitem = { text: title };

			if ( priority ) {
				menuitem.priority = priority;
			}
		}

		if ( ! menuitem ) {
			return;
		}

		view.set( this.id, menuitem );
	}
});

_.each(['toolbar','content'], function( region ) {
	/**
	 * @access private
	 */
	state.prototype[ '_' + region ] = function() {
		var mode = this.get( region );
		if ( mode ) {
			this.frame[ region ].render( mode );
		}
	};
});

module.exports = state;


/***/ }),

/***/ 5741:
/***/ ((module) => {

/**
 * wp.media.view.embed
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var embed = wp.media.view.extend(/** @lends wp.media.view.ember.prototype */{
	classname: 'media-embed',

	initialize: function() {
		/**
		 * @member {wp.media.view.embedurl}
		 */
		this.url = new wp.media.view.embedurl({
			controller: this.controller,
			model:      this.model.props
		}).render();

		this.views.set([ this.url ]);
		this.refresh();
		this.listento( this.model, 'change:type', this.refresh );
		this.listento( this.model, 'change:loading', this.loading );
	},

	/**
	 * @param {object} view
	 */
	settings: function( view ) {
		if ( this._settings ) {
			this._settings.remove();
		}
		this._settings = view;
		this.views.add( view );
	},

	refresh: function() {
		var type = this.model.get('type'),
			constructor;

		if ( 'image' === type ) {
			constructor = wp.media.view.embedimage;
		} else if ( 'link' === type ) {
			constructor = wp.media.view.embedlink;
		} else {
			return;
		}

		this.settings( new constructor({
			controller: this.controller,
			model:      this.model.props,
			priority:   40
		}) );
	},

	loading: function() {
		this.$el.toggleclass( 'embed-loading', this.model.get('loading') );
	}
});

module.exports = embed;


/***/ }),

/***/ 6090:
/***/ ((module) => {

/* global clipboardjs */
var attachment = wp.media.view.attachment,
	l10n = wp.media.view.l10n,
	$ = jquery,
	details,
	__ = wp.i18n.__;

details = attachment.extend(/** @lends wp.media.view.attachment.details.prototype */{
	tagname:   'div',
	classname: 'attachment-details',
	template:  wp.template('attachment-details'),

	/*
	 * reset all the attributes inherited from attachment including role=checkbox,
	 * tabindex, etc., as they are inappropriate for this view. see #47458 and [30483] / #30390.
	 */
	attributes: {},

	events: {
		'change [data-setting]':          'updatesetting',
		'change [data-setting] input':    'updatesetting',
		'change [data-setting] select':   'updatesetting',
		'change [data-setting] textarea': 'updatesetting',
		'click .delete-attachment':       'deleteattachment',
		'click .trash-attachment':        'trashattachment',
		'click .untrash-attachment':      'untrashattachment',
		'click .edit-attachment':         'editattachment',
		'keydown':                        'toggleselectionhandler'
	},

	/**
	 * copies the attachment url to the clipboard.
	 *
	 * @since 5.5.0
	 *
	 * @param {mouseevent} event a click event.
	 *
	 * @return {void}
	 */
	 copyattachmentdetailsurlclipboard: function() {
		var clipboard = new clipboardjs( '.copy-attachment-url' ),
			successtimeout;

		clipboard.on( 'success', function( event ) {
			var triggerelement = $( event.trigger ),
				successelement = $( '.success', triggerelement.closest( '.copy-to-clipboard-container' ) );

			// clear the selection and move focus back to the trigger.
			event.clearselection();

			// show success visual feedback.
			cleartimeout( successtimeout );
			successelement.removeclass( 'hidden' );

			// hide success visual feedback after 3 seconds since last success.
			successtimeout = settimeout( function() {
				successelement.addclass( 'hidden' );
			}, 3000 );

			// handle success audible feedback.
			wp.a11y.speak( __( 'the file url has been copied to your clipboard' ) );
		} );
	 },

	/**
	 * shows the details of an attachment.
	 *
	 * @since 3.5.0
	 *
	 * @constructs wp.media.view.attachment.details
	 * @augments wp.media.view.attachment
	 *
	 * @return {void}
	 */
	initialize: function() {
		this.options = _.defaults( this.options, {
			rerenderonmodelchange: false
		});

		// call 'initialize' directly on the parent class.
		attachment.prototype.initialize.apply( this, arguments );

		this.copyattachmentdetailsurlclipboard();
	},

	/**
	 * gets the focusable elements to move focus to.
	 *
	 * @since 5.3.0
	 */
	getfocusableelements: function() {
		var editedattachment = $( 'li[data-id="' + this.model.id + '"]' );

		this.previousattachment = editedattachment.prev();
		this.nextattachment = editedattachment.next();
	},

	/**
	 * moves focus to the previous or next attachment in the grid.
	 * fallbacks to the upload button or media frame when there are no attachments.
	 *
	 * @since 5.3.0
	 */
	movefocus: function() {
		if ( this.previousattachment.length ) {
			this.previousattachment.trigger( 'focus' );
			return;
		}

		if ( this.nextattachment.length ) {
			this.nextattachment.trigger( 'focus' );
			return;
		}

		// fallback: move focus to the "select files" button in the media modal.
		if ( this.controller.uploader && this.controller.uploader.$browser ) {
			this.controller.uploader.$browser.trigger( 'focus' );
			return;
		}

		// last fallback.
		this.movefocustolastfallback();
	},

	/**
	 * moves focus to the media frame as last fallback.
	 *
	 * @since 5.3.0
	 */
	movefocustolastfallback: function() {
		// last fallback: make the frame focusable and move focus to it.
		$( '.media-frame' )
			.attr( 'tabindex', '-1' )
			.trigger( 'focus' );
	},

	/**
	 * deletes an attachment.
	 *
	 * deletes an attachment after asking for confirmation. after deletion,
	 * keeps focus in the modal.
	 *
	 * @since 3.5.0
	 *
	 * @param {mouseevent} event a click event.
	 *
	 * @return {void}
	 */
	deleteattachment: function( event ) {
		event.preventdefault();

		this.getfocusableelements();

		if ( window.confirm( l10n.warndelete ) ) {
			this.model.destroy( {
				wait: true,
				error: function() {
					window.alert( l10n.errordeleting );
				}
			} );

			this.movefocus();
		}
	},

	/**
	 * sets the trash state on an attachment, or destroys the model itself.
	 *
	 * if the mediatrash setting is set to true, trashes the attachment.
	 * otherwise, the model itself is destroyed.
	 *
	 * @since 3.9.0
	 *
	 * @param {mouseevent} event a click event.
	 *
	 * @return {void}
	 */
	trashattachment: function( event ) {
		var library = this.controller.library,
			self = this;
		event.preventdefault();

		this.getfocusableelements();

		// when in the media library and the media trash is enabled.
		if ( wp.media.view.settings.mediatrash &&
			'edit-metadata' === this.controller.content.mode() ) {

			this.model.set( 'status', 'trash' );
			this.model.save().done( function() {
				library._requery( true );
				/*
				 * @todo we need to move focus back to the previous, next, or first
				 * attachment but the library gets re-queried and refreshed.
				 * thus, the references to the previous attachments are lost.
				 * we need an alternate method.
				 */
				self.movefocustolastfallback();
			} );
		} else {
			this.model.destroy();
			this.movefocus();
		}
	},

	/**
	 * untrashes an attachment.
	 *
	 * @since 4.0.0
	 *
	 * @param {mouseevent} event a click event.
	 *
	 * @return {void}
	 */
	untrashattachment: function( event ) {
		var library = this.controller.library;
		event.preventdefault();

		this.model.set( 'status', 'inherit' );
		this.model.save().done( function() {
			library._requery( true );
		} );
	},

	/**
	 * opens the edit page for a specific attachment.
	 *
	 * @since 3.5.0
	 *
	 * @param {mouseevent} event a click event.
	 *
	 * @return {void}
	 */
	editattachment: function( event ) {
		var editstate = this.controller.states.get( 'edit-image' );
		if ( window.imageedit && editstate ) {
			event.preventdefault();

			editstate.set( 'image', this.model );
			this.controller.setstate( 'edit-image' );
		} else {
			this.$el.addclass('needs-refresh');
		}
	},

	/**
	 * triggers an event on the controller when reverse tabbing (shift+tab).
	 *
	 * this event can be used to make sure to move the focus correctly.
	 *
	 * @since 4.0.0
	 *
	 * @fires wp.media.controller.medialibrary#attachment:details:shift-tab
	 * @fires wp.media.controller.medialibrary#attachment:keydown:arrow
	 *
	 * @param {keyboardevent} event a keyboard event.
	 *
	 * @return {boolean|void} returns false or undefined.
	 */
	toggleselectionhandler: function( event ) {
		if ( 'keydown' === event.type && 9 === event.keycode && event.shiftkey && event.target === this.$( ':tabbable' ).get( 0 ) ) {
			this.controller.trigger( 'attachment:details:shift-tab', event );
			return false;
		}
	},

	render: function() {
		attachment.prototype.render.apply( this, arguments );

		wp.media.mixin.removeallplayers();
		this.$( 'audio, video' ).each( function (i, elem) {
			var el = wp.media.view.mediadetails.preparesrc( elem );
			new window.mediaelementplayer( el, wp.media.mixin.mejssettings );
		} );
	}
});

module.exports = details;


/***/ }),

/***/ 6126:
/***/ ((module) => {

var view = wp.media.view,
	editimage;

/**
 * wp.media.view.editimage
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
editimage = view.extend(/** @lends wp.media.view.editimage.prototype */{
	classname: 'image-editor',
	template: wp.template('image-editor'),

	initialize: function( options ) {
		this.editor = window.imageedit;
		this.controller = options.controller;
		view.prototype.initialize.apply( this, arguments );
	},

	prepare: function() {
		return this.model.tojson();
	},

	loadeditor: function() {
		this.editor.open( this.model.get( 'id' ), this.model.get( 'nonces' ).edit, this );
	},

	back: function() {
		var laststate = this.controller.laststate();
		this.controller.setstate( laststate );
	},

	refresh: function() {
		this.model.fetch();
	},

	save: function() {
		var laststate = this.controller.laststate();

		this.model.fetch().done( _.bind( function() {
			this.controller.setstate( laststate );
		}, this ) );
	}

});

module.exports = editimage;


/***/ }),

/***/ 6150:
/***/ ((module) => {

/**
 * wp.media.controller.statemachine
 *
 * a state machine keeps track of state. it is in one state at a time,
 * and can change from one state to another.
 *
 * states are stored as models in a backbone collection.
 *
 * @memberof wp.media.controller
 *
 * @since 3.5.0
 *
 * @class
 * @augments backbone.model
 * @mixin
 * @mixes backbone.events
 */
var statemachine = function() {
	return {
		// use backbone's self-propagating `extend` inheritance method.
		extend: backbone.model.extend
	};
};

_.extend( statemachine.prototype, backbone.events,/** @lends wp.media.controller.statemachine.prototype */{
	/**
	 * fetch a state.
	 *
	 * if no `id` is provided, returns the active state.
	 *
	 * implicitly creates states.
	 *
	 * ensure that the `states` collection exists so the `statemachine`
	 * can be used as a mixin.
	 *
	 * @since 3.5.0
	 *
	 * @param {string} id
	 * @return {wp.media.controller.state} returns a state model from
	 *                                     the statemachine collection.
	 */
	state: function( id ) {
		this.states = this.states || new backbone.collection();

		// default to the active state.
		id = id || this._state;

		if ( id && ! this.states.get( id ) ) {
			this.states.add({ id: id });
		}
		return this.states.get( id );
	},

	/**
	 * sets the active state.
	 *
	 * bail if we're trying to select the current state, if we haven't
	 * created the `states` collection, or are trying to select a state
	 * that does not exist.
	 *
	 * @since 3.5.0
	 *
	 * @param {string} id
	 *
	 * @fires wp.media.controller.state#deactivate
	 * @fires wp.media.controller.state#activate
	 *
	 * @return {wp.media.controller.statemachine} returns itself to allow chaining.
	 */
	setstate: function( id ) {
		var previous = this.state();

		if ( ( previous && id === previous.id ) || ! this.states || ! this.states.get( id ) ) {
			return this;
		}

		if ( previous ) {
			previous.trigger('deactivate');
			this._laststate = previous.id;
		}

		this._state = id;
		this.state().trigger('activate');

		return this;
	},

	/**
	 * returns the previous active state.
	 *
	 * call the `state()` method with no parameters to retrieve the current
	 * active state.
	 *
	 * @since 3.5.0
	 *
	 * @return {wp.media.controller.state} returns a state model from
	 *                                     the statemachine collection.
	 */
	laststate: function() {
		if ( this._laststate ) {
			return this.state( this._laststate );
		}
	}
});

// map all event binding and triggering on a statemachine to its `states` collection.
_.each([ 'on', 'off', 'trigger' ], function( method ) {
	/**
	 * @function on
	 * @memberof wp.media.controller.statemachine
	 * @instance
	 * @return {wp.media.controller.statemachine} returns itself to allow chaining.
	 */
	/**
	 * @function off
	 * @memberof wp.media.controller.statemachine
	 * @instance
	 * @return {wp.media.controller.statemachine} returns itself to allow chaining.
	 */
	/**
	 * @function trigger
	 * @memberof wp.media.controller.statemachine
	 * @instance
	 * @return {wp.media.controller.statemachine} returns itself to allow chaining.
	 */
	statemachine.prototype[ method ] = function() {
		// ensure that the `states` collection exists so the `statemachine`
		// can be used as a mixin.
		this.states = this.states || new backbone.collection();
		// forward the method to the `states` collection.
		this.states[ method ].apply( this.states, arguments );
		return this;
	};
});

module.exports = statemachine;


/***/ }),

/***/ 6172:
/***/ ((module) => {

var controller = wp.media.controller,
	siteiconcropper;

/**
 * wp.media.controller.siteiconcropper
 *
 * a state for cropping a site icon.
 *
 * @memberof wp.media.controller
 *
 * @class
 * @augments wp.media.controller.cropper
 * @augments wp.media.controller.state
 * @augments backbone.model
 */
siteiconcropper = controller.cropper.extend(/** @lends wp.media.controller.siteiconcropper.prototype */{
	activate: function() {
		this.frame.on( 'content:create:crop', this.createcropcontent, this );
		this.frame.on( 'close', this.removecropper, this );
		this.set('selection', new backbone.collection(this.frame._selection.single));
	},

	createcropcontent: function() {
		this.cropperview = new wp.media.view.siteiconcropper({
			controller: this,
			attachment: this.get('selection').first()
		});
		this.cropperview.on('image-loaded', this.createcroptoolbar, this);
		this.frame.content.set(this.cropperview);

	},

	docrop: function( attachment ) {
		var cropdetails = attachment.get( 'cropdetails' ),
			control = this.get( 'control' );

		cropdetails.dst_width  = control.params.width;
		cropdetails.dst_height = control.params.height;

		return wp.ajax.post( 'crop-image', {
			nonce: attachment.get( 'nonces' ).edit,
			id: attachment.get( 'id' ),
			context: 'site-icon',
			cropdetails: cropdetails
		} );
	}
});

module.exports = siteiconcropper;


/***/ }),

/***/ 6327:
/***/ ((module) => {

/**
 * wp.media.view.routeritem
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view.menuitem
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var routeritem = wp.media.view.menuitem.extend(/** @lends wp.media.view.routeritem.prototype */{
	/**
	 * on click handler to activate the content region's corresponding mode.
	 */
	click: function() {
		var contentmode = this.options.contentmode;
		if ( contentmode ) {
			this.controller.content.mode( contentmode );
		}
	}
});

module.exports = routeritem;


/***/ }),

/***/ 6442:
/***/ ((module) => {

/**
 * wp.media.view.uploaderstatuserror
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var uploaderstatuserror = wp.media.view.extend(/** @lends wp.media.view.uploaderstatuserror.prototype */{
	classname: 'upload-error',
	template:  wp.template('uploader-status-error')
});

module.exports = uploaderstatuserror;


/***/ }),

/***/ 6472:
/***/ ((module) => {

var l10n = wp.media.view.l10n,
	datefilter;

/**
 * a filter dropdown for month/dates.
 *
 * @memberof wp.media.view.attachmentfilters
 *
 * @class
 * @augments wp.media.view.attachmentfilters
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
datefilter = wp.media.view.attachmentfilters.extend(/** @lends wp.media.view.attachmentfilters.date.prototype */{
	id: 'media-attachment-date-filters',

	createfilters: function() {
		var filters = {};
		_.each( wp.media.view.settings.months || {}, function( value, index ) {
			filters[ index ] = {
				text: value.text,
				props: {
					year: value.year,
					monthnum: value.month
				}
			};
		});
		filters.all = {
			text:  l10n.alldates,
			props: {
				monthnum: false,
				year:  false
			},
			priority: 10
		};
		this.filters = filters;
	}
});

module.exports = datefilter;


/***/ }),

/***/ 6829:
/***/ ((module) => {

var view = wp.media.view,
	mediatrash = wp.media.view.settings.mediatrash,
	l10n = wp.media.view.l10n,
	$ = jquery,
	attachmentsbrowser,
	infinitescrolling = wp.media.view.settings.infinitescrolling,
	__ = wp.i18n.__,
	sprintf = wp.i18n.sprintf;

/**
 * wp.media.view.attachmentsbrowser
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 *
 * @param {object}         [options]               the options hash passed to the view.
 * @param {boolean|string} [options.filters=false] which filters to show in the browser's toolbar.
 *                                                 accepts 'uploaded' and 'all'.
 * @param {boolean}        [options.search=true]   whether to show the search interface in the
 *                                                 browser's toolbar.
 * @param {boolean}        [options.date=true]     whether to show the date filter in the
 *                                                 browser's toolbar.
 * @param {boolean}        [options.display=false] whether to show the attachments display settings
 *                                                 view in the sidebar.
 * @param {boolean|string} [options.sidebar=true]  whether to create a sidebar for the browser.
 *                                                 accepts true, false, and 'errors'.
 */
attachmentsbrowser = view.extend(/** @lends wp.media.view.attachmentsbrowser.prototype */{
	tagname:   'div',
	classname: 'attachments-browser',

	initialize: function() {
		_.defaults( this.options, {
			filters: false,
			search:  true,
			date:    true,
			display: false,
			sidebar: true,
			attachmentview: wp.media.view.attachment.library
		});

		this.controller.on( 'toggle:upload:attachment', this.toggleuploader, this );
		this.controller.on( 'edit:selection', this.editselection );

		// in the media library, the sidebar is used to display errors before the attachments grid.
		if ( this.options.sidebar && 'errors' === this.options.sidebar ) {
			this.createsidebar();
		}

		/*
		 * in the grid mode (the media library), place the inline uploader before
		 * other sections so that the visual order and the dom order match. this way,
		 * the inline uploader in the media library is right after the "add new"
		 * button, see ticket #37188.
		 */
		if ( this.controller.ismodeactive( 'grid' ) ) {
			this.createuploader();

			/*
			 * create a multi-purpose toolbar. used as main toolbar in the media library
			 * and also for other things, for example the "drag and drop to reorder" and
			 * "suggested dimensions" info in the media modal.
			 */
			this.createtoolbar();
		} else {
			this.createtoolbar();
			this.createuploader();
		}

		// add a heading before the attachments list.
		this.createattachmentsheading();

		// create the attachments wrapper view.
		this.createattachmentswrapperview();

		if ( ! infinitescrolling ) {
			this.$el.addclass( 'has-load-more' );
			this.createloadmoreview();
		}

		// for accessibility reasons, place the normal sidebar after the attachments, see ticket #36909.
		if ( this.options.sidebar && 'errors' !== this.options.sidebar ) {
			this.createsidebar();
		}

		this.updatecontent();

		if ( ! infinitescrolling ) {
			this.updateloadmoreview();
		}

		if ( ! this.options.sidebar || 'errors' === this.options.sidebar ) {
			this.$el.addclass( 'hide-sidebar' );

			if ( 'errors' === this.options.sidebar ) {
				this.$el.addclass( 'sidebar-for-errors' );
			}
		}

		this.collection.on( 'add remove reset', this.updatecontent, this );

		if ( ! infinitescrolling ) {
			this.collection.on( 'add remove reset', this.updateloadmoreview, this );
		}

		// the non-cached or cached attachments query has completed.
		this.collection.on( 'attachments:received', this.announcesearchresults, this );
	},

	/**
	 * updates the `wp.a11y.speak()` aria live region with a message to communicate
	 * the number of search results to screen reader users. this function is
	 * debounced because the collection updates multiple times.
	 *
	 * @since 5.3.0
	 *
	 * @return {void}
	 */
	announcesearchresults: _.debounce( function() {
		var count,
			/* translators: accessibility text. %d: number of attachments found in a search. */
			mediafoundhasmoreresultsmessage = __( 'number of media items displayed: %d. click load more for more results.' );

		if ( infinitescrolling ) {
			/* translators: accessibility text. %d: number of attachments found in a search. */
			mediafoundhasmoreresultsmessage = __( 'number of media items displayed: %d. scroll the page for more results.' );
		}

		if ( this.collection.mirroring && this.collection.mirroring.args.s ) {
			count = this.collection.length;

			if ( 0 === count ) {
				wp.a11y.speak( l10n.nomediatrynewsearch );
				return;
			}

			if ( this.collection.hasmore() ) {
				wp.a11y.speak( mediafoundhasmoreresultsmessage.replace( '%d', count ) );
				return;
			}

			wp.a11y.speak( l10n.mediafound.replace( '%d', count ) );
		}
	}, 200 ),

	editselection: function( modal ) {
		// when editing a selection, move focus to the "go to library" button.
		modal.$( '.media-button-backtolibrary' ).focus();
	},

	/**
	 * @return {wp.media.view.attachmentsbrowser} returns itself to allow chaining.
	 */
	dispose: function() {
		this.options.selection.off( null, null, this );
		view.prototype.dispose.apply( this, arguments );
		return this;
	},

	createtoolbar: function() {
		var libraryviewswitcher, filters, toolbaroptions,
			showfilterbytype = -1 !== $.inarray( this.options.filters, [ 'uploaded', 'all' ] );

		toolbaroptions = {
			controller: this.controller
		};

		if ( this.controller.ismodeactive( 'grid' ) ) {
			toolbaroptions.classname = 'media-toolbar wp-filter';
		}

		/**
		* @member {wp.media.view.toolbar}
		*/
		this.toolbar = new wp.media.view.toolbar( toolbaroptions );

		this.views.add( this.toolbar );

		this.toolbar.set( 'spinner', new wp.media.view.spinner({
			priority: -20
		}) );

		if ( showfilterbytype || this.options.date ) {
			/*
			 * create a h2 heading before the select elements that filter attachments.
			 * this heading is visible in the modal and visually hidden in the grid.
			 */
			this.toolbar.set( 'filters-heading', new wp.media.view.heading( {
				priority:   -100,
				text:       l10n.filterattachments,
				level:      'h2',
				classname:  'media-attachments-filter-heading'
			}).render() );
		}

		if ( showfilterbytype ) {
			// "filters" is a <select>, a visually hidden label element needs to be rendered before.
			this.toolbar.set( 'filterslabel', new wp.media.view.label({
				value: l10n.filterbytype,
				attributes: {
					'for':  'media-attachment-filters'
				},
				priority:   -80
			}).render() );

			if ( 'uploaded' === this.options.filters ) {
				this.toolbar.set( 'filters', new wp.media.view.attachmentfilters.uploaded({
					controller: this.controller,
					model:      this.collection.props,
					priority:   -80
				}).render() );
			} else {
				filters = new wp.media.view.attachmentfilters.all({
					controller: this.controller,
					model:      this.collection.props,
					priority:   -80
				});

				this.toolbar.set( 'filters', filters.render() );
			}
		}

		/*
		 * feels odd to bring the global media library switcher into the attachment browser view.
		 * is this a use case for doaction( 'add:toolbar-items:attachments-browser', this.toolbar );
		 * which the controller can tap into and add this view?
		 */
		if ( this.controller.ismodeactive( 'grid' ) ) {
			libraryviewswitcher = view.extend({
				classname: 'view-switch media-grid-view-switch',
				template: wp.template( 'media-library-view-switcher')
			});

			this.toolbar.set( 'libraryviewswitcher', new libraryviewswitcher({
				controller: this.controller,
				priority: -90
			}).render() );

			// datefilter is a <select>, a visually hidden label element needs to be rendered before.
			this.toolbar.set( 'datefilterlabel', new wp.media.view.label({
				value: l10n.filterbydate,
				attributes: {
					'for': 'media-attachment-date-filters'
				},
				priority: -75
			}).render() );
			this.toolbar.set( 'datefilter', new wp.media.view.datefilter({
				controller: this.controller,
				model:      this.collection.props,
				priority: -75
			}).render() );

			// bulkselection is a <div> with subviews, including screen reader text.
			this.toolbar.set( 'selectmodetogglebutton', new wp.media.view.selectmodetogglebutton({
				text: l10n.bulkselect,
				controller: this.controller,
				priority: -70
			}).render() );

			this.toolbar.set( 'deleteselectedbutton', new wp.media.view.deleteselectedbutton({
				filters: filters,
				style: 'primary',
				disabled: true,
				text: mediatrash ? l10n.trashselected : l10n.deletepermanently,
				controller: this.controller,
				priority: -80,
				click: function() {
					var changed = [], removed = [],
						selection = this.controller.state().get( 'selection' ),
						library = this.controller.state().get( 'library' );

					if ( ! selection.length ) {
						return;
					}

					if ( ! mediatrash && ! window.confirm( l10n.warnbulkdelete ) ) {
						return;
					}

					if ( mediatrash &&
						'trash' !== selection.at( 0 ).get( 'status' ) &&
						! window.confirm( l10n.warnbulktrash ) ) {

						return;
					}

					selection.each( function( model ) {
						if ( ! model.get( 'nonces' )['delete'] ) {
							removed.push( model );
							return;
						}

						if ( mediatrash && 'trash' === model.get( 'status' ) ) {
							model.set( 'status', 'inherit' );
							changed.push( model.save() );
							removed.push( model );
						} else if ( mediatrash ) {
							model.set( 'status', 'trash' );
							changed.push( model.save() );
							removed.push( model );
						} else {
							model.destroy({wait: true});
						}
					} );

					if ( changed.length ) {
						selection.remove( removed );

						$.when.apply( null, changed ).then( _.bind( function() {
							library._requery( true );
							this.controller.trigger( 'selection:action:done' );
						}, this ) );
					} else {
						this.controller.trigger( 'selection:action:done' );
					}
				}
			}).render() );

			if ( mediatrash ) {
				this.toolbar.set( 'deleteselectedpermanentlybutton', new wp.media.view.deleteselectedpermanentlybutton({
					filters: filters,
					style: 'link button-link-delete',
					disabled: true,
					text: l10n.deletepermanently,
					controller: this.controller,
					priority: -55,
					click: function() {
						var removed = [],
							destroy = [],
							selection = this.controller.state().get( 'selection' );

						if ( ! selection.length || ! window.confirm( l10n.warnbulkdelete ) ) {
							return;
						}

						selection.each( function( model ) {
							if ( ! model.get( 'nonces' )['delete'] ) {
								removed.push( model );
								return;
							}

							destroy.push( model );
						} );

						if ( removed.length ) {
							selection.remove( removed );
						}

						if ( destroy.length ) {
							$.when.apply( null, destroy.map( function (item) {
								return item.destroy();
							} ) ).then( _.bind( function() {
								this.controller.trigger( 'selection:action:done' );
							}, this ) );
						}
					}
				}).render() );
			}

		} else if ( this.options.date ) {
			// datefilter is a <select>, a visually hidden label element needs to be rendered before.
			this.toolbar.set( 'datefilterlabel', new wp.media.view.label({
				value: l10n.filterbydate,
				attributes: {
					'for': 'media-attachment-date-filters'
				},
				priority: -75
			}).render() );
			this.toolbar.set( 'datefilter', new wp.media.view.datefilter({
				controller: this.controller,
				model:      this.collection.props,
				priority: -75
			}).render() );
		}

		if ( this.options.search ) {
			// search is an input, a label element needs to be rendered before.
			this.toolbar.set( 'searchlabel', new wp.media.view.label({
				value: l10n.searchlabel,
				classname: 'media-search-input-label',
				attributes: {
					'for': 'media-search-input'
				},
				priority:   60
			}).render() );
			this.toolbar.set( 'search', new wp.media.view.search({
				controller: this.controller,
				model:      this.collection.props,
				priority:   60
			}).render() );
		}

		if ( this.options.draginfo ) {
			this.toolbar.set( 'draginfo', new view({
				el: $( '<div class="instructions">' + l10n.draginfo + '</div>' )[0],
				priority: -40
			}) );
		}

		if ( this.options.suggestedwidth && this.options.suggestedheight ) {
			this.toolbar.set( 'suggesteddimensions', new view({
				el: $( '<div class="instructions">' + l10n.suggesteddimensions.replace( '%1$s', this.options.suggestedwidth ).replace( '%2$s', this.options.suggestedheight ) + '</div>' )[0],
				priority: -40
			}) );
		}
	},

	updatecontent: function() {
		var view = this,
			noitemsview;

		if ( this.controller.ismodeactive( 'grid' ) ) {
			// usually the media library.
			noitemsview = view.attachmentsnoresults;
		} else {
			// usually the media modal.
			noitemsview = view.uploader;
		}

		if ( ! this.collection.length ) {
			this.toolbar.get( 'spinner' ).show();
			this.toolbar.$( '.media-bg-overlay' ).show();
			this.dfd = this.collection.more().done( function() {
				if ( ! view.collection.length ) {
					noitemsview.$el.removeclass( 'hidden' );
				} else {
					noitemsview.$el.addclass( 'hidden' );
				}
				view.toolbar.get( 'spinner' ).hide();
				view.toolbar.$( '.media-bg-overlay' ).hide();
			} );
		} else {
			noitemsview.$el.addclass( 'hidden' );
			view.toolbar.get( 'spinner' ).hide();
			this.toolbar.$( '.media-bg-overlay' ).hide();
		}
	},

	createuploader: function() {
		this.uploader = new wp.media.view.uploaderinline({
			controller: this.controller,
			status:     false,
			message:    this.controller.ismodeactive( 'grid' ) ? '' : l10n.noitemsfound,
			canclose:   this.controller.ismodeactive( 'grid' )
		});

		this.uploader.$el.addclass( 'hidden' );
		this.views.add( this.uploader );
	},

	toggleuploader: function() {
		if ( this.uploader.$el.hasclass( 'hidden' ) ) {
			this.uploader.show();
		} else {
			this.uploader.hide();
		}
	},

	/**
	 * creates the attachments wrapper view.
	 *
	 * @since 5.8.0
	 *
	 * @return {void}
	 */
	createattachmentswrapperview: function() {
		this.attachmentswrapper = new wp.media.view( {
			classname: 'attachments-wrapper'
		} );

		// create the list of attachments.
		this.views.add( this.attachmentswrapper );
		this.createattachments();
	},

	createattachments: function() {
		this.attachments = new wp.media.view.attachments({
			controller:           this.controller,
			collection:           this.collection,
			selection:            this.options.selection,
			model:                this.model,
			sortable:             this.options.sortable,
			scrollelement:        this.options.scrollelement,
			idealcolumnwidth:     this.options.idealcolumnwidth,

			// the single `attachment` view to be used in the `attachments` view.
			attachmentview: this.options.attachmentview
		});

		// add keydown listener to the instance of the attachments view.
		this.controller.on( 'attachment:keydown:arrow',     _.bind( this.attachments.arrowevent, this.attachments ) );
		this.controller.on( 'attachment:details:shift-tab', _.bind( this.attachments.restorefocus, this.attachments ) );

		this.views.add( '.attachments-wrapper', this.attachments );

		if ( this.controller.ismodeactive( 'grid' ) ) {
			this.attachmentsnoresults = new view({
				controller: this.controller,
				tagname: 'p'
			});

			this.attachmentsnoresults.$el.addclass( 'hidden no-media' );
			this.attachmentsnoresults.$el.html( l10n.nomedia );

			this.views.add( this.attachmentsnoresults );
		}
	},

	/**
	 * creates the load more button and attachments counter view.
	 *
	 * @since 5.8.0
	 *
	 * @return {void}
	 */
	createloadmoreview: function() {
		var view = this;

		this.loadmorewrapper = new view( {
			controller: this.controller,
			classname: 'load-more-wrapper'
		} );

		this.loadmorecount = new view( {
			controller: this.controller,
			tagname: 'p',
			classname: 'load-more-count hidden'
		} );

		this.loadmorebutton = new wp.media.view.button( {
			text: __( 'load more' ),
			classname: 'load-more hidden',
			style: 'primary',
			size: '',
			click: function() {
				view.loadmoreattachments();
			}
		} );

		this.loadmorespinner = new wp.media.view.spinner();

		this.loadmorejumptofirst = new wp.media.view.button( {
			text: __( 'jump to first loaded item' ),
			classname: 'load-more-jump hidden',
			size: '',
			click: function() {
				view.jumptofirstaddeditem();
			}
		} );

		this.views.add( '.attachments-wrapper', this.loadmorewrapper );
		this.views.add( '.load-more-wrapper', this.loadmorespinner );
		this.views.add( '.load-more-wrapper', this.loadmorecount );
		this.views.add( '.load-more-wrapper', this.loadmorebutton );
		this.views.add( '.load-more-wrapper', this.loadmorejumptofirst );
	},

	/**
	 * updates the load more view. this function is debounced because the
	 * collection updates multiple times at the add, remove, and reset events.
	 * we need it to run only once, after all attachments are added or removed.
	 *
	 * @since 5.8.0
	 *
	 * @return {void}
	 */
	updateloadmoreview: _.debounce( function() {
		// ensure the load more view elements are initially hidden at each update.
		this.loadmorebutton.$el.addclass( 'hidden' );
		this.loadmorecount.$el.addclass( 'hidden' );
		this.loadmorejumptofirst.$el.addclass( 'hidden' ).prop( 'disabled', true );

		if ( ! this.collection.gettotalattachments() ) {
			return;
		}

		if ( this.collection.length ) {
			this.loadmorecount.$el.text(
				/* translators: 1: number of displayed attachments, 2: number of total attachments. */
				sprintf(
					__( 'showing %1$s of %2$s media items' ),
					this.collection.length,
					this.collection.gettotalattachments()
				)
			);

			this.loadmorecount.$el.removeclass( 'hidden' );
		}

		/*
		 * notice that while the collection updates multiple times hasmore() may
		 * return true when it's actually not true.
		 */
		if ( this.collection.hasmore() ) {
			this.loadmorebutton.$el.removeclass( 'hidden' );
		}

		// find the media item to move focus to. the jquery `eq()` index is zero-based.
		this.firstaddedmediaitem = this.$el.find( '.attachment' ).eq( this.firstaddedmediaitemindex );

		// if there's a media item to move focus to, make the "jump to" button available.
		if ( this.firstaddedmediaitem.length ) {
			this.firstaddedmediaitem.addclass( 'new-media' );
			this.loadmorejumptofirst.$el.removeclass( 'hidden' ).prop( 'disabled', false );
		}

		// if there are new items added, but no more to be added, move focus to jump button.
		if ( this.firstaddedmediaitem.length && ! this.collection.hasmore() ) {
			this.loadmorejumptofirst.$el.trigger( 'focus' );
		}
	}, 10 ),

	/**
	 * loads more attachments.
	 *
	 * @since 5.8.0
	 *
	 * @return {void}
	 */
	loadmoreattachments: function() {
		var view = this;

		if ( ! this.collection.hasmore() ) {
			return;
		}

		/*
		 * the collection index is zero-based while the length counts the actual
		 * amount of items. thus the length is equivalent to the position of the
		 * first added item.
		 */
		this.firstaddedmediaitemindex = this.collection.length;

		this.$el.addclass( 'more-loaded' );
		this.collection.each( function( attachment ) {
			var attach_id = attachment.attributes.id;
			$( '[data-id="' + attach_id + '"]' ).addclass( 'found-media' );
		});

		view.loadmorespinner.show();
		this.collection.once( 'attachments:received', function() {
			view.loadmorespinner.hide();
		} );
		this.collection.more();
	},

	/**
	 * moves focus to the first new added item.	.
	 *
	 * @since 5.8.0
	 *
	 * @return {void}
	 */
	jumptofirstaddeditem: function() {
		// set focus on first added item.
		this.firstaddedmediaitem.focus();
	},

	createattachmentsheading: function() {
		this.attachmentsheading = new wp.media.view.heading( {
			text: l10n.attachmentslist,
			level: 'h2',
			classname: 'media-views-heading screen-reader-text'
		} );
		this.views.add( this.attachmentsheading );
	},

	createsidebar: function() {
		var options = this.options,
			selection = options.selection,
			sidebar = this.sidebar = new wp.media.view.sidebar({
				controller: this.controller
			});

		this.views.add( sidebar );

		if ( this.controller.uploader ) {
			sidebar.set( 'uploads', new wp.media.view.uploaderstatus({
				controller: this.controller,
				priority:   40
			}) );
		}

		selection.on( 'selection:single', this.createsingle, this );
		selection.on( 'selection:unsingle', this.disposesingle, this );

		if ( selection.single() ) {
			this.createsingle();
		}
	},

	createsingle: function() {
		var sidebar = this.sidebar,
			single = this.options.selection.single();

		sidebar.set( 'details', new wp.media.view.attachment.details({
			controller: this.controller,
			model:      single,
			priority:   80
		}) );

		sidebar.set( 'compat', new wp.media.view.attachmentcompat({
			controller: this.controller,
			model:      single,
			priority:   120
		}) );

		if ( this.options.display ) {
			sidebar.set( 'display', new wp.media.view.settings.attachmentdisplay({
				controller:   this.controller,
				model:        this.model.display( single ),
				attachment:   single,
				priority:     160,
				usersettings: this.model.get('displayusersettings')
			}) );
		}

		// show the sidebar on mobile.
		if ( this.model.id === 'insert' ) {
			sidebar.$el.addclass( 'visible' );
		}
	},

	disposesingle: function() {
		var sidebar = this.sidebar;
		sidebar.unset('details');
		sidebar.unset('compat');
		sidebar.unset('display');
		// hide the sidebar on mobile.
		sidebar.$el.removeclass( 'visible' );
	}
});

module.exports = attachmentsbrowser;


/***/ }),

/***/ 7127:
/***/ ((module) => {

var selection = wp.media.model.selection,
	library = wp.media.controller.library,
	l10n = wp.media.view.l10n,
	galleryadd;

/**
 * wp.media.controller.galleryadd
 *
 * a state for selecting more images to add to a gallery.
 *
 * @since 3.5.0
 *
 * @class
 * @augments wp.media.controller.library
 * @augments wp.media.controller.state
 * @augments backbone.model
 *
 * @memberof wp.media.controller
 *
 * @param {object}                     [attributes]                         the attributes hash passed to the state.
 * @param {string}                     [attributes.id=gallery-library]      unique identifier.
 * @param {string}                     [attributes.title=add to gallery]    title for the state. displays in the frame's title region.
 * @param {boolean}                    [attributes.multiple=add]            whether multi-select is enabled. @todo 'add' doesn't seem do anything special, and gets used as a boolean.
 * @param {wp.media.model.attachments} [attributes.library]                 the attachments collection to browse.
 *                                                                          if one is not supplied, a collection of all images will be created.
 * @param {boolean|string}             [attributes.filterable=uploaded]     whether the library is filterable, and if so what filters should be shown.
 *                                                                          accepts 'all', 'uploaded', or 'unattached'.
 * @param {string}                     [attributes.menu=gallery]            initial mode for the menu region.
 * @param {string}                     [attributes.content=upload]          initial mode for the content region.
 *                                                                          overridden by persistent user setting if 'contentusersetting' is true.
 * @param {string}                     [attributes.router=browse]           initial mode for the router region.
 * @param {string}                     [attributes.toolbar=gallery-add]     initial mode for the toolbar region.
 * @param {boolean}                    [attributes.searchable=true]         whether the library is searchable.
 * @param {boolean}                    [attributes.sortable=true]           whether the attachments should be sortable. depends on the orderby property being set to menuorder on the attachments collection.
 * @param {boolean}                    [attributes.autoselect=true]         whether an uploaded attachment should be automatically added to the selection.
 * @param {boolean}                    [attributes.contentusersetting=true] whether the content region's mode should be set and persisted per user.
 * @param {number}                     [attributes.priority=100]            the priority for the state link in the media menu.
 * @param {boolean}                    [attributes.syncselection=false]     whether the attachments selection should be persisted from the last state.
 *                                                                          defaults to false because for this state, because the library of the edit gallery state is the selection.
 */
galleryadd = library.extend(/** @lends wp.media.controller.galleryadd.prototype */{
	defaults: _.defaults({
		id:            'gallery-library',
		title:         l10n.addtogallerytitle,
		multiple:      'add',
		filterable:    'uploaded',
		menu:          'gallery',
		toolbar:       'gallery-add',
		priority:      100,
		syncselection: false
	}, library.prototype.defaults ),

	/**
	 * initializes the library. creates a library of images if a library isn't supplied.
	 *
	 * @since 3.5.0
	 *
	 * @return {void}
	 */
	initialize: function() {
		if ( ! this.get('library') ) {
			this.set( 'library', wp.media.query({ type: 'image' }) );
		}

		library.prototype.initialize.apply( this, arguments );
	},

	/**
	 * activates the library.
	 *
	 * removes all event listeners if in edit mode. creates a validator to check an attachment.
	 * resets library and re-enables event listeners. activates edit mode. calls the parent's activate method.
	 *
	 * @since 3.5.0
	 *
	 * @return {void}
	 */
	activate: function() {
		var library = this.get('library'),
			edit    = this.frame.state('gallery-edit').get('library');

		if ( this.editlibrary && this.editlibrary !== edit ) {
			library.unobserve( this.editlibrary );
		}

		/*
		 * accept attachments that exist in the original library but
		 * that do not exist in gallery's library yet.
		 */
		library.validator = function( attachment ) {
			return !! this.mirroring.get( attachment.cid ) && ! edit.get( attachment.cid ) && selection.prototype.validator.apply( this, arguments );
		};

		/*
		 * reset the library to ensure that all attachments are re-added
		 * to the collection. do so silently, as calling `observe` will
		 * trigger the `reset` event.
		 */
		library.reset( library.mirroring.models, { silent: true });
		library.observe( edit );
		this.editlibrary = edit;

		library.prototype.activate.apply( this, arguments );
	}
});

module.exports = galleryadd;


/***/ }),

/***/ 7145:
/***/ ((module) => {

var selection = wp.media.model.selection,
	library = wp.media.controller.library,
	collectionadd;

/**
 * wp.media.controller.collectionadd
 *
 * a state for adding attachments to a collection (e.g. video playlist).
 *
 * @memberof wp.media.controller
 *
 * @class
 * @augments wp.media.controller.library
 * @augments wp.media.controller.state
 * @augments backbone.model
 *
 * @param {object}                     [attributes]                         the attributes hash passed to the state.
 * @param {string}                     [attributes.id=library]              unique identifier.
 * @param {string}                     attributes.title                     title for the state. displays in the frame's title region.
 * @param {boolean}                    [attributes.multiple=add]            whether multi-select is enabled. @todo 'add' doesn't seem do anything special, and gets used as a boolean.
 * @param {wp.media.model.attachments} [attributes.library]                 the attachments collection to browse.
 *                                                                          if one is not supplied, a collection of attachments of the specified type will be created.
 * @param {boolean|string}             [attributes.filterable=uploaded]     whether the library is filterable, and if so what filters should be shown.
 *                                                                          accepts 'all', 'uploaded', or 'unattached'.
 * @param {string}                     [attributes.menu=gallery]            initial mode for the menu region.
 * @param {string}                     [attributes.content=upload]          initial mode for the content region.
 *                                                                          overridden by persistent user setting if 'contentusersetting' is true.
 * @param {string}                     [attributes.router=browse]           initial mode for the router region.
 * @param {string}                     [attributes.toolbar=gallery-add]     initial mode for the toolbar region.
 * @param {boolean}                    [attributes.searchable=true]         whether the library is searchable.
 * @param {boolean}                    [attributes.sortable=true]           whether the attachments should be sortable. depends on the orderby property being set to menuorder on the attachments collection.
 * @param {boolean}                    [attributes.autoselect=true]         whether an uploaded attachment should be automatically added to the selection.
 * @param {boolean}                    [attributes.contentusersetting=true] whether the content region's mode should be set and persisted per user.
 * @param {int}                        [attributes.priority=100]            the priority for the state link in the media menu.
 * @param {boolean}                    [attributes.syncselection=false]     whether the attachments selection should be persisted from the last state.
 *                                                                          defaults to false because for this state, because the library of the edit gallery state is the selection.
 * @param {string}                     attributes.type                      the collection's media type. (e.g. 'video').
 * @param {string}                     attributes.collectiontype            the collection type. (e.g. 'playlist').
 */
collectionadd = library.extend(/** @lends wp.media.controller.collectionadd.prototype */{
	defaults: _.defaults( {
		// selection defaults. @see media.model.selection
		multiple:      'add',
		// attachments browser defaults. @see media.view.attachmentsbrowser
		filterable:    'uploaded',

		priority:      100,
		syncselection: false
	}, library.prototype.defaults ),

	/**
	 * @since 3.9.0
	 */
	initialize: function() {
		var collectiontype = this.get('collectiontype');

		if ( 'video' === this.get( 'type' ) ) {
			collectiontype = 'video-' + collectiontype;
		}

		this.set( 'id', collectiontype + '-library' );
		this.set( 'toolbar', collectiontype + '-add' );
		this.set( 'menu', collectiontype );

		// if we haven't been provided a `library`, create a `selection`.
		if ( ! this.get('library') ) {
			this.set( 'library', wp.media.query({ type: this.get('type') }) );
		}
		library.prototype.initialize.apply( this, arguments );
	},

	/**
	 * @since 3.9.0
	 */
	activate: function() {
		var library = this.get('library'),
			editlibrary = this.get('editlibrary'),
			edit = this.frame.state( this.get('collectiontype') + '-edit' ).get('library');

		if ( editlibrary && editlibrary !== edit ) {
			library.unobserve( editlibrary );
		}

		// accepts attachments that exist in the original library and
		// that do not exist in gallery's library.
		library.validator = function( attachment ) {
			return !! this.mirroring.get( attachment.cid ) && ! edit.get( attachment.cid ) && selection.prototype.validator.apply( this, arguments );
		};

		/*
		 * reset the library to ensure that all attachments are re-added
		 * to the collection. do so silently, as calling `observe` will
		 * trigger the `reset` event.
		 */
		library.reset( library.mirroring.models, { silent: true });
		library.observe( edit );
		this.set('editlibrary', edit);

		library.prototype.activate.apply( this, arguments );
	}
});

module.exports = collectionadd;


/***/ }),

/***/ 7266:
/***/ ((module) => {

/**
 * wp.media.view.settings.gallery
 *
 * @memberof wp.media.view.settings
 *
 * @class
 * @augments wp.media.view.settings
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var gallery = wp.media.view.settings.extend(/** @lends wp.media.view.settings.gallery.prototype */{
	classname: 'collection-settings gallery-settings',
	template:  wp.template('gallery-settings')
});

module.exports = gallery;


/***/ }),

/***/ 7327:
/***/ ((module) => {

var view = wp.media.view,
	$ = jquery,
	l10n = wp.media.view.l10n,
	embedurl;

/**
 * wp.media.view.embedurl
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
embedurl = view.extend(/** @lends wp.media.view.embedurl.prototype */{
	tagname:   'span',
	classname: 'embed-url',

	events: {
		'input': 'url'
	},

	initialize: function() {
		this.$input = $( '<input id="embed-url-field" type="url" />' )
			.attr( 'aria-label', l10n.insertfromurltitle )
			.val( this.model.get('url') );
		this.input = this.$input[0];

		this.spinner = $('<span class="spinner" />')[0];
		this.$el.append([ this.input, this.spinner ]);

		this.listento( this.model, 'change:url', this.render );

		if ( this.model.get( 'url' ) ) {
			_.delay( _.bind( function () {
				this.model.trigger( 'change:url' );
			}, this ), 500 );
		}
	},
	/**
	 * @return {wp.media.view.embedurl} returns itself to allow chaining.
	 */
	render: function() {
		var $input = this.$input;

		if ( $input.is(':focus') ) {
			return;
		}

		if ( this.model.get( 'url' ) ) {
			this.input.value = this.model.get('url');
		} else {
			this.input.setattribute( 'placeholder', 'https://' );
		}

		/**
		 * call `render` directly on parent class with passed arguments
		 */
		view.prototype.render.apply( this, arguments );
		return this;
	},

	url: function( event ) {
		var url = event.target.value || '';
		this.model.set( 'url', url.trim() );
	}
});

module.exports = embedurl;


/***/ }),

/***/ 7349:
/***/ ((module) => {

var l10n = wp.media.view.l10n,
	all;

/**
 * wp.media.view.attachmentfilters.all
 *
 * @memberof wp.media.view.attachmentfilters
 *
 * @class
 * @augments wp.media.view.attachmentfilters
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
all = wp.media.view.attachmentfilters.extend(/** @lends wp.media.view.attachmentfilters.all.prototype */{
	createfilters: function() {
		var filters = {},
			uid = window.usersettings ? parseint( window.usersettings.uid, 10 ) : 0;

		_.each( wp.media.view.settings.mimetypes || {}, function( text, key ) {
			filters[ key ] = {
				text: text,
				props: {
					status:  null,
					type:    key,
					uploadedto: null,
					orderby: 'date',
					order:   'desc',
					author:  null
				}
			};
		});

		filters.all = {
			text:  l10n.allmediaitems,
			props: {
				status:  null,
				type:    null,
				uploadedto: null,
				orderby: 'date',
				order:   'desc',
				author:  null
			},
			priority: 10
		};

		if ( wp.media.view.settings.post.id ) {
			filters.uploaded = {
				text:  l10n.uploadedtothispost,
				props: {
					status:  null,
					type:    null,
					uploadedto: wp.media.view.settings.post.id,
					orderby: 'menuorder',
					order:   'asc',
					author:  null
				},
				priority: 20
			};
		}

		filters.unattached = {
			text:  l10n.unattached,
			props: {
				status:     null,
				uploadedto: 0,
				type:       null,
				orderby:    'menuorder',
				order:      'asc',
				author:     null
			},
			priority: 50
		};

		if ( uid ) {
			filters.mine = {
				text:  l10n.mine,
				props: {
					status:		null,
					type:		null,
					uploadedto:	null,
					orderby:	'date',
					order:		'desc',
					author:		uid
				},
				priority: 50
			};
		}

		if ( wp.media.view.settings.mediatrash &&
			this.controller.ismodeactive( 'grid' ) ) {

			filters.trash = {
				text:  l10n.trash,
				props: {
					uploadedto: null,
					status:     'trash',
					type:       null,
					orderby:    'date',
					order:      'desc',
					author:     null
				},
				priority: 50
			};
		}

		this.filters = filters;
	}
});

module.exports = all;


/***/ }),

/***/ 7637:
/***/ ((module) => {

var view = wp.media.view,
	uploaderstatus = wp.media.view.uploaderstatus,
	l10n = wp.media.view.l10n,
	$ = jquery,
	cropper;

/**
 * wp.media.view.cropper
 *
 * uses the imgareaselect plugin to allow a user to crop an image.
 *
 * takes imgareaselect options from
 * wp.customize.headercontrol.calculateimageselectoptions via
 * wp.customize.headercontrol.openmm.
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
cropper = view.extend(/** @lends wp.media.view.cropper.prototype */{
	classname: 'crop-content',
	template: wp.template('crop-content'),
	initialize: function() {
		_.bindall(this, 'onimageload');
	},
	ready: function() {
		this.controller.frame.on('content:error:crop', this.onerror, this);
		this.$image = this.$el.find('.crop-image');
		this.$image.on('load', this.onimageload);
		$(window).on('resize.cropper', _.debounce(this.onimageload, 250));
	},
	remove: function() {
		$(window).off('resize.cropper');
		this.$el.remove();
		this.$el.off();
		view.prototype.remove.apply(this, arguments);
	},
	prepare: function() {
		return {
			title: l10n.cropyourimage,
			url: this.options.attachment.get('url')
		};
	},
	onimageload: function() {
		var imgoptions = this.controller.get('imgselectoptions'),
			imgselect;

		if (typeof imgoptions === 'function') {
			imgoptions = imgoptions(this.options.attachment, this.controller);
		}

		imgoptions = _.extend(imgoptions, {
			parent: this.$el,
			oninit: function() {

				// store the set ratio.
				var setratio = imgselect.getoptions().aspectratio;

				// on mousedown, if no ratio is set and the shift key is down, use a 1:1 ratio.
				this.parent.children().on( 'mousedown touchstart', function( e ) {

					// if no ratio is set and the shift key is down, use a 1:1 ratio.
					if ( ! setratio && e.shiftkey ) {
						imgselect.setoptions( {
							aspectratio: '1:1'
						} );
					}
				} );

				this.parent.children().on( 'mouseup touchend', function() {

					// restore the set ratio.
					imgselect.setoptions( {
						aspectratio: setratio ? setratio : false
					} );
				} );
			}
		} );
		this.trigger('image-loaded');
		imgselect = this.controller.imgselect = this.$image.imgareaselect(imgoptions);
	},
	onerror: function() {
		var filename = this.options.attachment.get('filename');

		this.views.add( '.upload-errors', new wp.media.view.uploaderstatuserror({
			filename: uploaderstatus.prototype.filename(filename),
			message: window._wpmediaviewsl10n.croperror
		}), { at: 0 });
	}
});

module.exports = cropper;


/***/ }),

/***/ 7656:
/***/ ((module) => {

var settings = wp.media.view.settings,
	attachmentdisplay;

/**
 * wp.media.view.settings.attachmentdisplay
 *
 * @memberof wp.media.view.settings
 *
 * @class
 * @augments wp.media.view.settings
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
attachmentdisplay = settings.extend(/** @lends wp.media.view.settings.attachmentdisplay.prototype */{
	classname: 'attachment-display-settings',
	template:  wp.template('attachment-display-settings'),

	initialize: function() {
		var attachment = this.options.attachment;

		_.defaults( this.options, {
			usersettings: false
		});
		// call 'initialize' directly on the parent class.
		settings.prototype.initialize.apply( this, arguments );
		this.listento( this.model, 'change:link', this.updatelinkto );

		if ( attachment ) {
			attachment.on( 'change:uploading', this.render, this );
		}
	},

	dispose: function() {
		var attachment = this.options.attachment;
		if ( attachment ) {
			attachment.off( null, null, this );
		}
		/**
		 * call 'dispose' directly on the parent class
		 */
		settings.prototype.dispose.apply( this, arguments );
	},
	/**
	 * @return {wp.media.view.attachmentdisplay} returns itself to allow chaining.
	 */
	render: function() {
		var attachment = this.options.attachment;
		if ( attachment ) {
			_.extend( this.options, {
				sizes: attachment.get('sizes'),
				type:  attachment.get('type')
			});
		}
		/**
		 * call 'render' directly on the parent class
		 */
		settings.prototype.render.call( this );
		this.updatelinkto();
		return this;
	},

	updatelinkto: function() {
		var linkto = this.model.get('link'),
			$input = this.$('.link-to-custom'),
			attachment = this.options.attachment;

		if ( 'none' === linkto || 'embed' === linkto || ( ! attachment && 'custom' !== linkto ) ) {
			$input.closest( '.setting' ).addclass( 'hidden' );
			return;
		}

		if ( attachment ) {
			if ( 'post' === linkto ) {
				$input.val( attachment.get('link') );
			} else if ( 'file' === linkto ) {
				$input.val( attachment.get('url') );
			} else if ( ! this.model.get('linkurl') ) {
				$input.val('http://');
			}

			$input.prop( 'readonly', 'custom' !== linkto );
		}

		$input.closest( '.setting' ).removeclass( 'hidden' );
		if ( $input.length ) {
			$input[0].scrollintoview();
		}
	}
});

module.exports = attachmentdisplay;


/***/ }),

/***/ 7709:
/***/ ((module) => {

var $ = jquery,
	attachmentfilters;

/**
 * wp.media.view.attachmentfilters
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
attachmentfilters = wp.media.view.extend(/** @lends wp.media.view.attachmentfilters.prototype */{
	tagname:   'select',
	classname: 'attachment-filters',
	id:        'media-attachment-filters',

	events: {
		change: 'change'
	},

	keys: [],

	initialize: function() {
		this.createfilters();
		_.extend( this.filters, this.options.filters );

		// build `<option>` elements.
		this.$el.html( _.chain( this.filters ).map( function( filter, value ) {
			return {
				el: $( '<option></option>' ).val( value ).html( filter.text )[0],
				priority: filter.priority || 50
			};
		}, this ).sortby('priority').pluck('el').value() );

		this.listento( this.model, 'change', this.select );
		this.select();
	},

	/**
	 * @abstract
	 */
	createfilters: function() {
		this.filters = {};
	},

	/**
	 * when the selected filter changes, update the attachment query properties to match.
	 */
	change: function() {
		var filter = this.filters[ this.el.value ];
		if ( filter ) {
			this.model.set( filter.props );
		}
	},

	select: function() {
		var model = this.model,
			value = 'all',
			props = model.tojson();

		_.find( this.filters, function( filter, id ) {
			var equal = _.all( filter.props, function( prop, key ) {
				return prop === ( _.isundefined( props[ key ] ) ? null : props[ key ] );
			});

			if ( equal ) {
				return value = id;
			}
		});

		this.$el.val( value );
	}
});

module.exports = attachmentfilters;


/***/ }),

/***/ 7810:
/***/ ((module) => {

var view = wp.media.view,
	$ = jquery,
	siteiconpreview;

/**
 * wp.media.view.siteiconpreview
 *
 * shows a preview of the site icon as a favicon and app icon while cropping.
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
siteiconpreview = view.extend(/** @lends wp.media.view.siteiconpreview.prototype */{
	classname: 'site-icon-preview-crop-modal',
	template: wp.template( 'site-icon-preview-crop' ),

	ready: function() {
		this.controller.imgselect.setoptions({
			oninit: this.updatepreview,
			onselectchange: this.updatepreview
		});
	},

	prepare: function() {
		return {
			url: this.options.attachment.get( 'url' )
		};
	},

	updatepreview: function( img, coords ) {
		var rx = 64 / coords.width,
			ry = 64 / coords.height,
			preview_rx = 24 / coords.width,
			preview_ry = 24 / coords.height;

		$( '#preview-app-icon' ).css({
			width: math.round(rx * this.imagewidth ) + 'px',
			height: math.round(ry * this.imageheight ) + 'px',
			marginleft: '-' + math.round(rx * coords.x1) + 'px',
			margintop: '-' + math.round(ry * coords.y1) + 'px'
		});

		$( '#preview-favicon' ).css({
			width: math.round( preview_rx * this.imagewidth ) + 'px',
			height: math.round( preview_ry * this.imageheight ) + 'px',
			marginleft: '-' + math.round( preview_rx * coords.x1 ) + 'px',
			margintop: '-' + math.floor( preview_ry* coords.y1 ) + 'px'
		});
	}
});

module.exports = siteiconpreview;


/***/ }),

/***/ 8065:
/***/ ((module) => {

/**
 * wp.media.controller.medialibrary
 *
 * @memberof wp.media.controller
 *
 * @class
 * @augments wp.media.controller.library
 * @augments wp.media.controller.state
 * @augments backbone.model
 */
var library = wp.media.controller.library,
	medialibrary;

medialibrary = library.extend(/** @lends wp.media.controller.medialibrary.prototype */{
	defaults: _.defaults({
		// attachments browser defaults. @see media.view.attachmentsbrowser
		filterable:      'uploaded',

		displaysettings: false,
		priority:        80,
		syncselection:   false
	}, library.prototype.defaults ),

	/**
	 * @since 3.9.0
	 *
	 * @param options
	 */
	initialize: function( options ) {
		this.media = options.media;
		this.type = options.type;
		this.set( 'library', wp.media.query({ type: this.type }) );

		library.prototype.initialize.apply( this, arguments );
	},

	/**
	 * @since 3.9.0
	 */
	activate: function() {
		// @todo this should use this.frame.
		if ( wp.media.frame.lastmime ) {
			this.set( 'library', wp.media.query({ type: wp.media.frame.lastmime }) );
			delete wp.media.frame.lastmime;
		}
		library.prototype.activate.apply( this, arguments );
	}
});

module.exports = medialibrary;


/***/ }),

/***/ 8142:
/***/ ((module) => {

var view = wp.media.view,
	$ = jquery,
	attachments,
	infinitescrolling = wp.media.view.settings.infinitescrolling;

attachments = view.extend(/** @lends wp.media.view.attachments.prototype */{
	tagname:   'ul',
	classname: 'attachments',

	attributes: {
		tabindex: -1
	},

	/**
	 * represents the overview of attachments in the media library.
	 *
	 * the constructor binds events to the collection this view represents when
	 * adding or removing attachments or resetting the entire collection.
	 *
	 * @since 3.5.0
	 *
	 * @constructs
	 * @memberof wp.media.view
	 *
	 * @augments wp.media.view
	 *
	 * @listens collection:add
	 * @listens collection:remove
	 * @listens collection:reset
	 * @listens controller:library:selection:add
	 * @listens scrollelement:scroll
	 * @listens this:ready
	 * @listens controller:open
	 */
	initialize: function() {
		this.el.id = _.uniqueid('__attachments-view-');

		/**
		 * @since 5.8.0 added the `infinitescrolling` parameter.
		 *
		 * @param infinitescrolling  whether to enable infinite scrolling or use
		 *                           the default "load more" button.
		 * @param refreshsensitivity the time in milliseconds to throttle the scroll
		 *                           handler.
		 * @param refreshthreshold   the amount of pixels that should be scrolled before
		 *                           loading more attachments from the server.
		 * @param attachmentview     the view class to be used for models in the
		 *                           collection.
		 * @param sortable           a jquery sortable options object
		 *                           ( http://api.jqueryui.com/sortable/ ).
		 * @param resize             a boolean indicating whether or not to listen to
		 *                           resize events.
		 * @param idealcolumnwidth   the width in pixels which a column should have when
		 *                           calculating the total number of columns.
		 */
		_.defaults( this.options, {
			infinitescrolling:  infinitescrolling || false,
			refreshsensitivity: wp.media.istouchdevice ? 300 : 200,
			refreshthreshold:   3,
			attachmentview:     wp.media.view.attachment,
			sortable:           false,
			resize:             true,
			idealcolumnwidth:   $( window ).width() < 640 ? 135 : 150
		});

		this._viewsbycid = {};
		this.$window = $( window );
		this.resizeevent = 'resize.media-modal-columns';

		this.collection.on( 'add', function( attachment ) {
			this.views.add( this.createattachmentview( attachment ), {
				at: this.collection.indexof( attachment )
			});
		}, this );

		/*
		 * find the view to be removed, delete it and call the remove function to clear
		 * any set event handlers.
		 */
		this.collection.on( 'remove', function( attachment ) {
			var view = this._viewsbycid[ attachment.cid ];
			delete this._viewsbycid[ attachment.cid ];

			if ( view ) {
				view.remove();
			}
		}, this );

		this.collection.on( 'reset', this.render, this );

		this.controller.on( 'library:selection:add', this.attachmentfocus, this );

		if ( this.options.infinitescrolling ) {
			// throttle the scroll handler and bind this.
			this.scroll = _.chain( this.scroll ).bind( this ).throttle( this.options.refreshsensitivity ).value();

			this.options.scrollelement = this.options.scrollelement || this.el;
			$( this.options.scrollelement ).on( 'scroll', this.scroll );
		}

		this.initsortable();

		_.bindall( this, 'setcolumns' );

		if ( this.options.resize ) {
			this.on( 'ready', this.bindevents );
			this.controller.on( 'open', this.setcolumns );

			/*
			 * call this.setcolumns() after this view has been rendered in the
			 * dom so attachments get proper width applied.
			 */
			_.defer( this.setcolumns, this );
		}
	},

	/**
	 * listens to the resizeevent on the window.
	 *
	 * adjusts the amount of columns accordingly. first removes any existing event
	 * handlers to prevent duplicate listeners.
	 *
	 * @since 4.0.0
	 *
	 * @listens window:resize
	 *
	 * @return {void}
	 */
	bindevents: function() {
		this.$window.off( this.resizeevent ).on( this.resizeevent, _.debounce( this.setcolumns, 50 ) );
	},

	/**
	 * focuses the first item in the collection.
	 *
	 * @since 4.0.0
	 *
	 * @return {void}
	 */
	attachmentfocus: function() {
		/*
		 * @todo when uploading new attachments, this tries to move focus to
		 * the attachments grid. actually, a progress bar gets initially displayed
		 * and then updated when uploading completes, so focus is lost.
		 * additionally: this view is used for both the attachments list and
		 * the list of selected attachments in the bottom media toolbar. thus, when
		 * uploading attachments, it is called twice and returns two different `this`.
		 * `this.columns` is truthy within the modal.
		 */
		if ( this.columns ) {
			// move focus to the grid list within the modal.
			this.$el.focus();
		}
	},

	/**
	 * restores focus to the selected item in the collection.
	 *
	 * moves focus back to the first selected attachment in the grid. used when
	 * tabbing backwards from the attachment details sidebar.
	 * see media.view.attachmentsbrowser.
	 *
	 * @since 4.0.0
	 *
	 * @return {void}
	 */
	restorefocus: function() {
		this.$( 'li.selected:first' ).focus();
	},

	/**
	 * handles events for arrow key presses.
	 *
	 * focuses the attachment in the direction of the used arrow key if it exists.
	 *
	 * @since 4.0.0
	 *
	 * @param {keyboardevent} event the keyboard event that triggered this function.
	 *
	 * @return {void}
	 */
	arrowevent: function( event ) {
		var attachments = this.$el.children( 'li' ),
			perrow = this.columns,
			index = attachments.filter( ':focus' ).index(),
			row = ( index + 1 ) <= perrow ? 1 : math.ceil( ( index + 1 ) / perrow );

		if ( index === -1 ) {
			return;
		}

		// left arrow = 37.
		if ( 37 === event.keycode ) {
			if ( 0 === index ) {
				return;
			}
			attachments.eq( index - 1 ).focus();
		}

		// up arrow = 38.
		if ( 38 === event.keycode ) {
			if ( 1 === row ) {
				return;
			}
			attachments.eq( index - perrow ).focus();
		}

		// right arrow = 39.
		if ( 39 === event.keycode ) {
			if ( attachments.length === index ) {
				return;
			}
			attachments.eq( index + 1 ).focus();
		}

		// down arrow = 40.
		if ( 40 === event.keycode ) {
			if ( math.ceil( attachments.length / perrow ) === row ) {
				return;
			}
			attachments.eq( index + perrow ).focus();
		}
	},

	/**
	 * clears any set event handlers.
	 *
	 * @since 3.5.0
	 *
	 * @return {void}
	 */
	dispose: function() {
		this.collection.props.off( null, null, this );
		if ( this.options.resize ) {
			this.$window.off( this.resizeevent );
		}

		// call 'dispose' directly on the parent class.
		view.prototype.dispose.apply( this, arguments );
	},

	/**
	 * calculates the amount of columns.
	 *
	 * calculates the amount of columns and sets it on the data-columns attribute
	 * of .media-frame-content.
	 *
	 * @since 4.0.0
	 *
	 * @return {void}
	 */
	setcolumns: function() {
		var prev = this.columns,
			width = this.$el.width();

		if ( width ) {
			this.columns = math.min( math.round( width / this.options.idealcolumnwidth ), 12 ) || 1;

			if ( ! prev || prev !== this.columns ) {
				this.$el.closest( '.media-frame-content' ).attr( 'data-columns', this.columns );
			}
		}
	},

	/**
	 * initializes jquery sortable on the attachment list.
	 *
	 * fails gracefully if jquery sortable doesn't exist or isn't passed
	 * in the options.
	 *
	 * @since 3.5.0
	 *
	 * @fires collection:reset
	 *
	 * @return {void}
	 */
	initsortable: function() {
		var collection = this.collection;

		if ( ! this.options.sortable || ! $.fn.sortable ) {
			return;
		}

		this.$el.sortable( _.extend({
			// if the `collection` has a `comparator`, disable sorting.
			disabled: !! collection.comparator,

			/*
			 * change the position of the attachment as soon as the mouse pointer
			 * overlaps a thumbnail.
			 */
			tolerance: 'pointer',

			// record the initial `index` of the dragged model.
			start: function( event, ui ) {
				ui.item.data('sortableindexstart', ui.item.index());
			},

			/*
			 * update the model's index in the collection. do so silently, as the view
			 * is already accurate.
			 */
			update: function( event, ui ) {
				var model = collection.at( ui.item.data('sortableindexstart') ),
					comparator = collection.comparator;

				// temporarily disable the comparator to prevent `add`
				// from re-sorting.
				delete collection.comparator;

				// silently shift the model to its new index.
				collection.remove( model, {
					silent: true
				});
				collection.add( model, {
					silent: true,
					at:     ui.item.index()
				});

				// restore the comparator.
				collection.comparator = comparator;

				// fire the `reset` event to ensure other collections sync.
				collection.trigger( 'reset', collection );

				// if the collection is sorted by menu order, update the menu order.
				collection.savemenuorder();
			}
		}, this.options.sortable ) );

		/*
		 * if the `orderby` property is changed on the `collection`,
		 * check to see if we have a `comparator`. if so, disable sorting.
		 */
		collection.props.on( 'change:orderby', function() {
			this.$el.sortable( 'option', 'disabled', !! collection.comparator );
		}, this );

		this.collection.props.on( 'change:orderby', this.refreshsortable, this );
		this.refreshsortable();
	},

	/**
	 * disables jquery sortable if collection has a comparator or collection.orderby
	 * equals menuorder.
	 *
	 * @since 3.5.0
	 *
	 * @return {void}
	 */
	refreshsortable: function() {
		if ( ! this.options.sortable || ! $.fn.sortable ) {
			return;
		}

		var collection = this.collection,
			orderby = collection.props.get('orderby'),
			enabled = 'menuorder' === orderby || ! collection.comparator;

		this.$el.sortable( 'option', 'disabled', ! enabled );
	},

	/**
	 * creates a new view for an attachment and adds it to _viewsbycid.
	 *
	 * @since 3.5.0
	 *
	 * @param {wp.media.model.attachment} attachment
	 *
	 * @return {wp.media.view} the created view.
	 */
	createattachmentview: function( attachment ) {
		var view = new this.options.attachmentview({
			controller:           this.controller,
			model:                attachment,
			collection:           this.collection,
			selection:            this.options.selection
		});

		return this._viewsbycid[ attachment.cid ] = view;
	},

	/**
	 * prepares view for display.
	 *
	 * creates views for every attachment in collection if the collection is not
	 * empty, otherwise clears all views and loads more attachments.
	 *
	 * @since 3.5.0
	 *
	 * @return {void}
	 */
	prepare: function() {
		if ( this.collection.length ) {
			this.views.set( this.collection.map( this.createattachmentview, this ) );
		} else {
			this.views.unset();
			if ( this.options.infinitescrolling ) {
				this.collection.more().done( this.scroll );
			}
		}
	},

	/**
	 * triggers the scroll function to check if we should query for additional
	 * attachments right away.
	 *
	 * @since 3.5.0
	 *
	 * @return {void}
	 */
	ready: function() {
		if ( this.options.infinitescrolling ) {
			this.scroll();
		}
	},

	/**
	 * handles scroll events.
	 *
	 * shows the spinner if we're close to the bottom. loads more attachments from
	 * server if we're {refreshthreshold} times away from the bottom.
	 *
	 * @since 3.5.0
	 *
	 * @return {void}
	 */
	scroll: function() {
		var view = this,
			el = this.options.scrollelement,
			scrolltop = el.scrolltop,
			toolbar;

		/*
		 * the scroll event occurs on the document, but the element that should be
		 * checked is the document body.
		 */
		if ( el === document ) {
			el = document.body;
			scrolltop = $(document).scrolltop();
		}

		if ( ! $(el).is(':visible') || ! this.collection.hasmore() ) {
			return;
		}

		toolbar = this.views.parent.toolbar;

		// show the spinner only if we are close to the bottom.
		if ( el.scrollheight - ( scrolltop + el.clientheight ) < el.clientheight / 3 ) {
			toolbar.get('spinner').show();
		}

		if ( el.scrollheight < scrolltop + ( el.clientheight * this.options.refreshthreshold ) ) {
			this.collection.more().done(function() {
				view.scroll();
				toolbar.get('spinner').hide();
			});
		}
	}
});

module.exports = attachments;


/***/ }),

/***/ 8197:
/***/ ((module) => {

var view = wp.media.view,
	uploaderstatus;

/**
 * wp.media.view.uploaderstatus
 *
 * an uploader status for on-going uploads.
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
uploaderstatus = view.extend(/** @lends wp.media.view.uploaderstatus.prototype */{
	classname: 'media-uploader-status',
	template:  wp.template('uploader-status'),

	events: {
		'click .upload-dismiss-errors': 'dismiss'
	},

	initialize: function() {
		this.queue = wp.uploader.queue;
		this.queue.on( 'add remove reset', this.visibility, this );
		this.queue.on( 'add remove reset change:percent', this.progress, this );
		this.queue.on( 'add remove reset change:uploading', this.info, this );

		this.errors = wp.uploader.errors;
		this.errors.reset();
		this.errors.on( 'add remove reset', this.visibility, this );
		this.errors.on( 'add', this.error, this );
	},
	/**
	 * @return {wp.media.view.uploaderstatus}
	 */
	dispose: function() {
		wp.uploader.queue.off( null, null, this );
		/**
		 * call 'dispose' directly on the parent class
		 */
		view.prototype.dispose.apply( this, arguments );
		return this;
	},

	visibility: function() {
		this.$el.toggleclass( 'uploading', !! this.queue.length );
		this.$el.toggleclass( 'errors', !! this.errors.length );
		this.$el.toggle( !! this.queue.length || !! this.errors.length );
	},

	ready: function() {
		_.each({
			'$bar':      '.media-progress-bar div',
			'$index':    '.upload-index',
			'$total':    '.upload-total',
			'$filename': '.upload-filename'
		}, function( selector, key ) {
			this[ key ] = this.$( selector );
		}, this );

		this.visibility();
		this.progress();
		this.info();
	},

	progress: function() {
		var queue = this.queue,
			$bar = this.$bar;

		if ( ! $bar || ! queue.length ) {
			return;
		}

		$bar.width( ( queue.reduce( function( memo, attachment ) {
			if ( ! attachment.get('uploading') ) {
				return memo + 100;
			}

			var percent = attachment.get('percent');
			return memo + ( _.isnumber( percent ) ? percent : 100 );
		}, 0 ) / queue.length ) + '%' );
	},

	info: function() {
		var queue = this.queue,
			index = 0, active;

		if ( ! queue.length ) {
			return;
		}

		active = this.queue.find( function( attachment, i ) {
			index = i;
			return attachment.get('uploading');
		});

		if ( this.$index && this.$total && this.$filename ) {
			this.$index.text( index + 1 );
			this.$total.text( queue.length );
			this.$filename.html( active ? this.filename( active.get('filename') ) : '' );
		}
	},
	/**
	 * @param {string} filename
	 * @return {string}
	 */
	filename: function( filename ) {
		return _.escape( filename );
	},
	/**
	 * @param {backbone.model} error
	 */
	error: function( error ) {
		var statuserror = new wp.media.view.uploaderstatuserror( {
			filename: this.filename( error.get( 'file' ).name ),
			message:  error.get( 'message' )
		} );

		var buttonclose = this.$el.find( 'button' );

		// can show additional info here while retrying to create image sub-sizes.
		this.views.add( '.upload-errors', statuserror, { at: 0 } );
		_.delay( function() {
			buttonclose.trigger( 'focus' );
		}, 1000 );

		_.delay( function() {
			wp.a11y.speak( error.get( 'message' ) );
		}, 1500 );
	},

	dismiss: function() {
		var errors = this.views.get('.upload-errors');

		if ( errors ) {
			_.invoke( errors, 'remove' );
		}
		wp.uploader.errors.reset();
		wp.a11y.speak( wp.i18n.__( 'error dismissed.' ) );
		// move focus to the modal after the dismiss button gets removed from the dom.
		if ( this.controller.modal ) {
			this.controller.modal.focusmanager.focus();
		}
	}
});

module.exports = uploaderstatus;


/***/ }),

/***/ 8232:
/***/ ((module) => {

var $ = jquery,
	embedlink;

/**
 * wp.media.view.embedlink
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view.settings
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
embedlink = wp.media.view.settings.extend(/** @lends wp.media.view.embedlink.prototype */{
	classname: 'embed-link-settings',
	template:  wp.template('embed-link-settings'),

	initialize: function() {
		this.listento( this.model, 'change:url', this.updateoembed );
	},

	updateoembed: _.debounce( function() {
		var url = this.model.get( 'url' );

		// clear out previous results.
		this.$('.embed-container').hide().find('.embed-preview').empty();
		this.$( '.setting' ).hide();

		// only proceed with embed if the field contains more than 11 characters.
		// example: http://a.io is 11 chars
		if ( url && ( url.length < 11 || ! url.match(/^http(s)?:\/\//) ) ) {
			return;
		}

		this.fetch();
	}, wp.media.controller.embed.sensitivity ),

	fetch: function() {
		var url = this.model.get( 'url' ), re, youtubeembedmatch;

		// check if they haven't typed in 500 ms.
		if ( $('#embed-url-field').val() !== url ) {
			return;
		}

		if ( this.dfd && 'pending' === this.dfd.state() ) {
			this.dfd.abort();
		}

		// support youtube embed urls, since they work once in the editor.
		re = /https?:\/\/www\.youtube\.com\/embed\/([^/]+)/;
		youtubeembedmatch = re.exec( url );
		if ( youtubeembedmatch ) {
			url = 'https://www.youtube.com/watch?v=' + youtubeembedmatch[ 1 ];
		}

		this.dfd = wp.apirequest({
			url: wp.media.view.settings.oembedproxyurl,
			data: {
				url: url,
				maxwidth: this.model.get( 'width' ),
				maxheight: this.model.get( 'height' )
			},
			type: 'get',
			datatype: 'json',
			context: this
		})
			.done( function( response ) {
				this.renderoembed( {
					data: {
						body: response.html || ''
					}
				} );
			} )
			.fail( this.renderfail );
	},

	renderfail: function ( response, status ) {
		if ( 'abort' === status ) {
			return;
		}
		this.$( '.link-text' ).show();
	},

	renderoembed: function( response ) {
		var html = ( response && response.data && response.data.body ) || '';

		if ( html ) {
			this.$('.embed-container').show().find('.embed-preview').html( html );
		} else {
			this.renderfail();
		}
	}
});

module.exports = embedlink;


/***/ }),

/***/ 8282:
/***/ ((module) => {

var _n = wp.i18n._n,
	sprintf = wp.i18n.sprintf,
	selection;

/**
 * wp.media.view.selection
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
selection = wp.media.view.extend(/** @lends wp.media.view.selection.prototype */{
	tagname:   'div',
	classname: 'media-selection',
	template:  wp.template('media-selection'),

	events: {
		'click .edit-selection':  'edit',
		'click .clear-selection': 'clear'
	},

	initialize: function() {
		_.defaults( this.options, {
			editable:  false,
			clearable: true
		});

		/**
		 * @member {wp.media.view.attachments.selection}
		 */
		this.attachments = new wp.media.view.attachments.selection({
			controller: this.controller,
			collection: this.collection,
			selection:  this.collection,
			model:      new backbone.model()
		});

		this.views.set( '.selection-view', this.attachments );
		this.collection.on( 'add remove reset', this.refresh, this );
		this.controller.on( 'content:activate', this.refresh, this );
	},

	ready: function() {
		this.refresh();
	},

	refresh: function() {
		// if the selection hasn't been rendered, bail.
		if ( ! this.$el.children().length ) {
			return;
		}

		var collection = this.collection,
			editing = 'edit-selection' === this.controller.content.mode();

		// if nothing is selected, display nothing.
		this.$el.toggleclass( 'empty', ! collection.length );
		this.$el.toggleclass( 'one', 1 === collection.length );
		this.$el.toggleclass( 'editing', editing );

		this.$( '.count' ).text(
			/* translators: %s: number of selected media attachments. */
			sprintf( _n( '%s item selected', '%s items selected', collection.length ), collection.length )
		);
	},

	edit: function( event ) {
		event.preventdefault();
		if ( this.options.editable ) {
			this.options.editable.call( this, this.collection );
		}
	},

	clear: function( event ) {
		event.preventdefault();
		this.collection.reset();

		// move focus to the modal.
		this.controller.modal.focusmanager.focus();
	}
});

module.exports = selection;


/***/ }),

/***/ 8291:
/***/ ((module) => {

var $ = jquery,
	uploaderwindow;

/**
 * wp.media.view.uploaderwindow
 *
 * an uploader window that allows for dragging and dropping media.
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 *
 * @param {object} [options]                   options hash passed to the view.
 * @param {object} [options.uploader]          uploader properties.
 * @param {jquery} [options.uploader.browser]
 * @param {jquery} [options.uploader.dropzone] jquery collection of the dropzone.
 * @param {object} [options.uploader.params]
 */
uploaderwindow = wp.media.view.extend(/** @lends wp.media.view.uploaderwindow.prototype */{
	tagname:   'div',
	classname: 'uploader-window',
	template:  wp.template('uploader-window'),

	initialize: function() {
		var uploader;

		this.$browser = $( '<button type="button" class="browser" />' ).hide().appendto( 'body' );

		uploader = this.options.uploader = _.defaults( this.options.uploader || {}, {
			dropzone:  this.$el,
			browser:   this.$browser,
			params:    {}
		});

		// ensure the dropzone is a jquery collection.
		if ( uploader.dropzone && ! (uploader.dropzone instanceof $) ) {
			uploader.dropzone = $( uploader.dropzone );
		}

		this.controller.on( 'activate', this.refresh, this );

		this.controller.on( 'detach', function() {
			this.$browser.remove();
		}, this );
	},

	refresh: function() {
		if ( this.uploader ) {
			this.uploader.refresh();
		}
	},

	ready: function() {
		var postid = wp.media.view.settings.post.id,
			dropzone;

		// if the uploader already exists, bail.
		if ( this.uploader ) {
			return;
		}

		if ( postid ) {
			this.options.uploader.params.post_id = postid;
		}
		this.uploader = new wp.uploader( this.options.uploader );

		dropzone = this.uploader.dropzone;
		dropzone.on( 'dropzone:enter', _.bind( this.show, this ) );
		dropzone.on( 'dropzone:leave', _.bind( this.hide, this ) );

		$( this.uploader ).on( 'uploader:ready', _.bind( this._ready, this ) );
	},

	_ready: function() {
		this.controller.trigger( 'uploader:ready' );
	},

	show: function() {
		var $el = this.$el.show();

		// ensure that the animation is triggered by waiting until
		// the transparent element is painted into the dom.
		_.defer( function() {
			$el.css({ opacity: 1 });
		});
	},

	hide: function() {
		var $el = this.$el.css({ opacity: 0 });

		wp.media.transition( $el ).done( function() {
			// transition end events are subject to race conditions.
			// make sure that the value is set as intended.
			if ( '0' === $el.css('opacity') ) {
				$el.hide();
			}
		});

		// https://core.trac.wordpress.org/ticket/27341
		_.delay( function() {
			if ( '0' === $el.css('opacity') && $el.is(':visible') ) {
				$el.hide();
			}
		}, 500 );
	}
});

module.exports = uploaderwindow;


/***/ }),

/***/ 8612:
/***/ ((module) => {

var library = wp.media.controller.library,
	l10n = wp.media.view.l10n,
	$ = jquery,
	collectionedit;

/**
 * wp.media.controller.collectionedit
 *
 * a state for editing a collection, which is used by audio and video playlists,
 * and can be used for other collections.
 *
 * @memberof wp.media.controller
 *
 * @class
 * @augments wp.media.controller.library
 * @augments wp.media.controller.state
 * @augments backbone.model
 *
 * @param {object}                     [attributes]                      the attributes hash passed to the state.
 * @param {string}                     attributes.title                  title for the state. displays in the media menu and the frame's title region.
 * @param {wp.media.model.attachments} [attributes.library]              the attachments collection to edit.
 *                                                                       if one is not supplied, an empty media.model.selection collection is created.
 * @param {boolean}                    [attributes.multiple=false]       whether multi-select is enabled.
 * @param {string}                     [attributes.content=browse]       initial mode for the content region.
 * @param {string}                     attributes.menu                   initial mode for the menu region. @todo this needs a better explanation.
 * @param {boolean}                    [attributes.searchable=false]     whether the library is searchable.
 * @param {boolean}                    [attributes.sortable=true]        whether the attachments should be sortable. depends on the orderby property being set to menuorder on the attachments collection.
 * @param {boolean}                    [attributes.date=true]            whether to show the date filter in the browser's toolbar.
 * @param {boolean}                    [attributes.describe=true]        whether to offer ui to describe the attachments - e.g. captioning images in a gallery.
 * @param {boolean}                    [attributes.draginfo=true]        whether to show instructional text about the attachments being sortable.
 * @param {boolean}                    [attributes.draginfotext]         instructional text about the attachments being sortable.
 * @param {int}                        [attributes.idealcolumnwidth=170] the ideal column width in pixels for attachments.
 * @param {boolean}                    [attributes.editing=false]        whether the gallery is being created, or editing an existing instance.
 * @param {int}                        [attributes.priority=60]          the priority for the state link in the media menu.
 * @param {boolean}                    [attributes.syncselection=false]  whether the attachments selection should be persisted from the last state.
 *                                                                       defaults to false for this state, because the library passed in  *is* the selection.
 * @param {view}                       [attributes.settingsview]         the view to edit the collection instance settings (e.g. playlist settings with "show tracklist" checkbox).
 * @param {view}                       [attributes.attachmentview]       the single `attachment` view to be used in the `attachments`.
 *                                                                       if none supplied, defaults to wp.media.view.attachment.editlibrary.
 * @param {string}                     attributes.type                   the collection's media type. (e.g. 'video').
 * @param {string}                     attributes.collectiontype         the collection type. (e.g. 'playlist').
 */
collectionedit = library.extend(/** @lends wp.media.controller.collectionedit.prototype */{
	defaults: {
		multiple:         false,
		sortable:         true,
		date:             false,
		searchable:       false,
		content:          'browse',
		describe:         true,
		draginfo:         true,
		idealcolumnwidth: 170,
		editing:          false,
		priority:         60,
		settingsview:     false,
		syncselection:    false
	},

	/**
	 * @since 3.9.0
	 */
	initialize: function() {
		var collectiontype = this.get('collectiontype');

		if ( 'video' === this.get( 'type' ) ) {
			collectiontype = 'video-' + collectiontype;
		}

		this.set( 'id', collectiontype + '-edit' );
		this.set( 'toolbar', collectiontype + '-edit' );

		// if we haven't been provided a `library`, create a `selection`.
		if ( ! this.get('library') ) {
			this.set( 'library', new wp.media.model.selection() );
		}
		// the single `attachment` view to be used in the `attachments` view.
		if ( ! this.get('attachmentview') ) {
			this.set( 'attachmentview', wp.media.view.attachment.editlibrary );
		}
		library.prototype.initialize.apply( this, arguments );
	},

	/**
	 * @since 3.9.0
	 */
	activate: function() {
		var library = this.get('library');

		// limit the library to images only.
		library.props.set( 'type', this.get( 'type' ) );

		// watch for uploaded attachments.
		this.get('library').observe( wp.uploader.queue );

		this.frame.on( 'content:render:browse', this.rendersettings, this );

		library.prototype.activate.apply( this, arguments );
	},

	/**
	 * @since 3.9.0
	 */
	deactivate: function() {
		// stop watching for uploaded attachments.
		this.get('library').unobserve( wp.uploader.queue );

		this.frame.off( 'content:render:browse', this.rendersettings, this );

		library.prototype.deactivate.apply( this, arguments );
	},

	/**
	 * render the collection embed settings view in the browser sidebar.
	 *
	 * @todo this is against the pattern elsewhere in media. typically the frame
	 *       is responsible for adding region mode callbacks. explain.
	 *
	 * @since 3.9.0
	 *
	 * @param {wp.media.view.attachmentsbrowser} the attachments browser view.
	 */
	rendersettings: function( attachmentsbrowserview ) {
		var library = this.get('library'),
			collectiontype = this.get('collectiontype'),
			draginfotext = this.get('draginfotext'),
			settingsview = this.get('settingsview'),
			obj = {};

		if ( ! library || ! attachmentsbrowserview ) {
			return;
		}

		library[ collectiontype ] = library[ collectiontype ] || new backbone.model();

		obj[ collectiontype ] = new settingsview({
			controller: this,
			model:      library[ collectiontype ],
			priority:   40
		});

		attachmentsbrowserview.sidebar.set( obj );

		if ( draginfotext ) {
			attachmentsbrowserview.toolbar.set( 'draginfo', new wp.media.view({
				el: $( '<div class="instructions">' + draginfotext + '</div>' )[0],
				priority: -40
			}) );
		}

		// add the 'reverse order' button to the toolbar.
		attachmentsbrowserview.toolbar.set( 'reverse', {
			text:     l10n.reverseorder,
			priority: 80,

			click: function() {
				library.reset( library.toarray().reverse() );
			}
		});
	}
});

module.exports = collectionedit;


/***/ }),

/***/ 8815:
/***/ ((module) => {

/**
 * wp.media.view.prioritylist
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var prioritylist = wp.media.view.extend(/** @lends wp.media.view.prioritylist.prototype */{
	tagname:   'div',

	initialize: function() {
		this._views = {};

		this.set( _.extend( {}, this._views, this.options.views ), { silent: true });
		delete this.options.views;

		if ( ! this.options.silent ) {
			this.render();
		}
	},
	/**
	 * @param {string} id
	 * @param {wp.media.view|object} view
	 * @param {object} options
	 * @return {wp.media.view.prioritylist} returns itself to allow chaining.
	 */
	set: function( id, view, options ) {
		var priority, views, index;

		options = options || {};

		// accept an object with an `id` : `view` mapping.
		if ( _.isobject( id ) ) {
			_.each( id, function( view, id ) {
				this.set( id, view );
			}, this );
			return this;
		}

		if ( ! (view instanceof backbone.view) ) {
			view = this.toview( view, id, options );
		}
		view.controller = view.controller || this.controller;

		this.unset( id );

		priority = view.options.priority || 10;
		views = this.views.get() || [];

		_.find( views, function( existing, i ) {
			if ( existing.options.priority > priority ) {
				index = i;
				return true;
			}
		});

		this._views[ id ] = view;
		this.views.add( view, {
			at: _.isnumber( index ) ? index : views.length || 0
		});

		return this;
	},
	/**
	 * @param {string} id
	 * @return {wp.media.view}
	 */
	get: function( id ) {
		return this._views[ id ];
	},
	/**
	 * @param {string} id
	 * @return {wp.media.view.prioritylist}
	 */
	unset: function( id ) {
		var view = this.get( id );

		if ( view ) {
			view.remove();
		}

		delete this._views[ id ];
		return this;
	},
	/**
	 * @param {object} options
	 * @return {wp.media.view}
	 */
	toview: function( options ) {
		return new wp.media.view( options );
	}
});

module.exports = prioritylist;


/***/ }),

/***/ 9013:
/***/ ((module) => {

var menuitem;

/**
 * wp.media.view.menuitem
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
menuitem = wp.media.view.extend(/** @lends wp.media.view.menuitem.prototype */{
	tagname:   'button',
	classname: 'media-menu-item',

	attributes: {
		type: 'button',
		role: 'tab'
	},

	events: {
		'click': '_click'
	},

	/**
	 * allows to override the click event.
	 */
	_click: function() {
		var clickoverride = this.options.click;

		if ( clickoverride ) {
			clickoverride.call( this );
		} else {
			this.click();
		}
	},

	click: function() {
		var state = this.options.state;

		if ( state ) {
			this.controller.setstate( state );
			// toggle the menu visibility in the responsive view.
			this.views.parent.$el.removeclass( 'visible' ); // @todo or hide on any click, see below.
		}
	},

	/**
	 * @return {wp.media.view.menuitem} returns itself to allow chaining.
	 */
	render: function() {
		var options = this.options,
			menuproperty = options.state || options.contentmode;

		if ( options.text ) {
			this.$el.text( options.text );
		} else if ( options.html ) {
			this.$el.html( options.html );
		}

		// set the menu item id based on the frame state associated to the menu item.
		this.$el.attr( 'id', 'menu-item-' + menuproperty );

		return this;
	}
});

module.exports = menuitem;


/***/ }),

/***/ 9141:
/***/ ((module) => {

/**
 * wp.media.view.spinner
 *
 * represents a spinner in the media library.
 *
 * @since 3.9.0
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
var spinner = wp.media.view.extend(/** @lends wp.media.view.spinner.prototype */{
	tagname:   'span',
	classname: 'spinner',
	spinnertimeout: false,
	delay: 400,

	/**
	 * shows the spinner. delays the visibility by the configured amount.
	 *
	 * @since 3.9.0
	 *
	 * @return {wp.media.view.spinner} the spinner.
	 */
	show: function() {
		if ( ! this.spinnertimeout ) {
			this.spinnertimeout = _.delay(function( $el ) {
				$el.addclass( 'is-active' );
			}, this.delay, this.$el );
		}

		return this;
	},

	/**
	 * hides the spinner.
	 *
	 * @since 3.9.0
	 *
	 * @return {wp.media.view.spinner} the spinner.
	 */
	hide: function() {
		this.$el.removeclass( 'is-active' );
		this.spinnertimeout = cleartimeout( this.spinnertimeout );

		return this;
	}
});

module.exports = spinner;


/***/ }),

/***/ 9458:
/***/ ((module) => {

var toolbar = wp.media.view.toolbar,
	l10n = wp.media.view.l10n,
	select;

/**
 * wp.media.view.toolbar.select
 *
 * @memberof wp.media.view.toolbar
 *
 * @class
 * @augments wp.media.view.toolbar
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
select = toolbar.extend(/** @lends wp.media.view.toolbar.select.prototype */{
	initialize: function() {
		var options = this.options;

		_.bindall( this, 'clickselect' );

		_.defaults( options, {
			event: 'select',
			state: false,
			reset: true,
			close: true,
			text:  l10n.select,

			// does the button rely on the selection?
			requires: {
				selection: true
			}
		});

		options.items = _.defaults( options.items || {}, {
			select: {
				style:    'primary',
				text:     options.text,
				priority: 80,
				click:    this.clickselect,
				requires: options.requires
			}
		});
		// call 'initialize' directly on the parent class.
		toolbar.prototype.initialize.apply( this, arguments );
	},

	clickselect: function() {
		var options = this.options,
			controller = this.controller;

		if ( options.close ) {
			controller.close();
		}

		if ( options.event ) {
			controller.state().trigger( options.event );
		}

		if ( options.state ) {
			controller.setstate( options.state );
		}

		if ( options.reset ) {
			controller.reset();
		}
	}
});

module.exports = select;


/***/ }),

/***/ 9660:
/***/ ((module) => {

var controller = wp.media.controller,
	customizeimagecropper;

/**
 * a state for cropping an image in the customizer.
 *
 * @since 4.3.0
 *
 * @constructs wp.media.controller.customizeimagecropper
 * @memberof wp.media.controller
 * @augments wp.media.controller.customizeimagecropper.cropper
 * @inheritdoc
 */
customizeimagecropper = controller.cropper.extend(/** @lends wp.media.controller.customizeimagecropper.prototype */{
	/**
	 * posts the crop details to the admin.
	 *
	 * uses crop measurements when flexible in both directions.
	 * constrains flexible side based on image ratio and size of the fixed side.
	 *
	 * @since 4.3.0
	 *
	 * @param {object} attachment the attachment to crop.
	 *
	 * @return {$.promise} a jquery promise that represents the crop image request.
	 */
	docrop: function( attachment ) {
		var cropdetails = attachment.get( 'cropdetails' ),
			control = this.get( 'control' ),
			ratio = cropdetails.width / cropdetails.height;

		// use crop measurements when flexible in both directions.
		if ( control.params.flex_width && control.params.flex_height ) {
			cropdetails.dst_width  = cropdetails.width;
			cropdetails.dst_height = cropdetails.height;

		// constrain flexible side based on image ratio and size of the fixed side.
		} else {
			cropdetails.dst_width  = control.params.flex_width  ? control.params.height * ratio : control.params.width;
			cropdetails.dst_height = control.params.flex_height ? control.params.width  / ratio : control.params.height;
		}

		return wp.ajax.post( 'crop-image', {
			wp_customize: 'on',
			nonce: attachment.get( 'nonces' ).edit,
			id: attachment.get( 'id' ),
			context: control.id,
			cropdetails: cropdetails
		} );
	}
});

module.exports = customizeimagecropper;


/***/ }),

/***/ 9875:
/***/ ((module) => {

/**
 * wp.media.controller.region
 *
 * a region is a persistent application layout area.
 *
 * a region assumes one mode at any time, and can be switched to another.
 *
 * when mode changes, events are triggered on the region's parent view.
 * the parent view will listen to specific events and fill the region with an
 * appropriate view depending on mode. for example, a frame listens for the
 * 'browse' mode t be activated on the 'content' view and then fills the region
 * with an attachmentsbrowser view.
 *
 * @memberof wp.media.controller
 *
 * @class
 *
 * @param {object}        options          options hash for the region.
 * @param {string}        options.id       unique identifier for the region.
 * @param {backbone.view} options.view     a parent view the region exists within.
 * @param {string}        options.selector jquery selector for the region within the parent view.
 */
var region = function( options ) {
	_.extend( this, _.pick( options || {}, 'id', 'view', 'selector' ) );
};

// use backbone's self-propagating `extend` inheritance method.
region.extend = backbone.model.extend;

_.extend( region.prototype,/** @lends wp.media.controller.region.prototype */{
	/**
	 * activate a mode.
	 *
	 * @since 3.5.0
	 *
	 * @param {string} mode
	 *
	 * @fires region#activate
	 * @fires region#deactivate
	 *
	 * @return {wp.media.controller.region} returns itself to allow chaining.
	 */
	mode: function( mode ) {
		if ( ! mode ) {
			return this._mode;
		}
		// bail if we're trying to change to the current mode.
		if ( mode === this._mode ) {
			return this;
		}

		/**
		 * region mode deactivation event.
		 *
		 * @event wp.media.controller.region#deactivate
		 */
		this.trigger('deactivate');

		this._mode = mode;
		this.render( mode );

		/**
		 * region mode activation event.
		 *
		 * @event wp.media.controller.region#activate
		 */
		this.trigger('activate');
		return this;
	},
	/**
	 * render a mode.
	 *
	 * @since 3.5.0
	 *
	 * @param {string} mode
	 *
	 * @fires region#create
	 * @fires region#render
	 *
	 * @return {wp.media.controller.region} returns itself to allow chaining.
	 */
	render: function( mode ) {
		// if the mode isn't active, activate it.
		if ( mode && mode !== this._mode ) {
			return this.mode( mode );
		}

		var set = { view: null },
			view;

		/**
		 * create region view event.
		 *
		 * region view creation takes place in an event callback on the frame.
		 *
		 * @event wp.media.controller.region#create
		 * @type {object}
		 * @property {object} view
		 */
		this.trigger( 'create', set );
		view = set.view;

		/**
		 * render region view event.
		 *
		 * region view creation takes place in an event callback on the frame.
		 *
		 * @event wp.media.controller.region#render
		 * @type {object}
		 */
		this.trigger( 'render', view );
		if ( view ) {
			this.set( view );
		}
		return this;
	},

	/**
	 * get the region's view.
	 *
	 * @since 3.5.0
	 *
	 * @return {wp.media.view}
	 */
	get: function() {
		return this.view.views.first( this.selector );
	},

	/**
	 * set the region's view as a subview of the frame.
	 *
	 * @since 3.5.0
	 *
	 * @param {array|object} views
	 * @param {object} [options={}]
	 * @return {wp.backbone.subviews} subviews is returned to allow chaining.
	 */
	set: function( views, options ) {
		if ( options ) {
			options.add = false;
		}
		return this.view.views.set( this.selector, views, options );
	},

	/**
	 * trigger regional view events on the frame.
	 *
	 * @since 3.5.0
	 *
	 * @param {string} event
	 * @return {undefined|wp.media.controller.region} returns itself to allow chaining.
	 */
	trigger: function( event ) {
		var base, args;

		if ( ! this._mode ) {
			return;
		}

		args = _.toarray( arguments );
		base = this.id + ':' + event;

		// trigger `{this.id}:{event}:{this._mode}` event on the frame.
		args[0] = base + ':' + this._mode;
		this.view.trigger.apply( this.view, args );

		// trigger `{this.id}:{event}` event on the frame.
		args[0] = base;
		this.view.trigger.apply( this.view, args );
		return this;
	}
});

module.exports = region;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// the module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// the require function
/******/ 	function __webpack_require__(moduleid) {
/******/ 		// check if module is in cache
/******/ 		var cachedmodule = __webpack_module_cache__[moduleid];
/******/ 		if (cachedmodule !== undefined) {
/******/ 			return cachedmodule.exports;
/******/ 		}
/******/ 		// create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleid] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// execute the module function
/******/ 		__webpack_modules__[moduleid](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/**
 * @output wp-includes/js/media-views.js
 */

var media = wp.media,
	$ = jquery,
	l10n;

media.istouchdevice = ( 'ontouchend' in document );

// link any localized strings.
l10n = media.view.l10n = window._wpmediaviewsl10n || {};

// link any settings.
media.view.settings = l10n.settings || {};
delete l10n.settings;

// copy the `post` setting over to the model settings.
media.model.settings.post = media.view.settings.post;

// check if the browser supports css 3.0 transitions.
$.support.transition = (function(){
	var style = document.documentelement.style,
		transitions = {
			webkittransition: 'webkittransitionend',
			moztransition:    'transitionend',
			otransition:      'otransitionend otransitionend',
			transition:       'transitionend'
		}, transition;

	transition = _.find( _.keys( transitions ), function( transition ) {
		return ! _.isundefined( style[ transition ] );
	});

	return transition && {
		end: transitions[ transition ]
	};
}());

/**
 * a shared event bus used to provide events into
 * the media workflows that 3rd-party devs can use to hook
 * in.
 */
media.events = _.extend( {}, backbone.events );

/**
 * makes it easier to bind events using transitions.
 *
 * @param {string} selector
 * @param {number} sensitivity
 * @return {promise}
 */
media.transition = function( selector, sensitivity ) {
	var deferred = $.deferred();

	sensitivity = sensitivity || 2000;

	if ( $.support.transition ) {
		if ( ! (selector instanceof $) ) {
			selector = $( selector );
		}

		// resolve the deferred when the first element finishes animating.
		selector.first().one( $.support.transition.end, deferred.resolve );

		// just in case the event doesn't trigger, fire a callback.
		_.delay( deferred.resolve, sensitivity );

	// otherwise, execute on the spot.
	} else {
		deferred.resolve();
	}

	return deferred.promise();
};

media.controller.region = __webpack_require__( 9875 );
media.controller.statemachine = __webpack_require__( 6150 );
media.controller.state = __webpack_require__( 5694 );

media.selectionsync = __webpack_require__( 4181 );
media.controller.library = __webpack_require__( 472 );
media.controller.imagedetails = __webpack_require__( 705 );
media.controller.galleryedit = __webpack_require__( 2038 );
media.controller.galleryadd = __webpack_require__( 7127 );
media.controller.collectionedit = __webpack_require__( 8612 );
media.controller.collectionadd = __webpack_require__( 7145 );
media.controller.featuredimage = __webpack_require__( 1169 );
media.controller.replaceimage = __webpack_require__( 2275 );
media.controller.editimage = __webpack_require__( 5663 );
media.controller.medialibrary = __webpack_require__( 8065 );
media.controller.embed = __webpack_require__( 4910 );
media.controller.cropper = __webpack_require__( 5422 );
media.controller.customizeimagecropper = __webpack_require__( 9660 );
media.controller.siteiconcropper = __webpack_require__( 6172 );

media.view = __webpack_require__( 4747 );
media.view.frame = __webpack_require__( 1061 );
media.view.mediaframe = __webpack_require__( 2836 );
media.view.mediaframe.select = __webpack_require__( 455 );
media.view.mediaframe.post = __webpack_require__( 4274 );
media.view.mediaframe.imagedetails = __webpack_require__( 5424 );
media.view.modal = __webpack_require__( 2621 );
media.view.focusmanager = __webpack_require__( 718 );
media.view.uploaderwindow = __webpack_require__( 8291 );
media.view.editoruploader = __webpack_require__( 3674 );
media.view.uploaderinline = __webpack_require__( 1753 );
media.view.uploaderstatus = __webpack_require__( 8197 );
media.view.uploaderstatuserror = __webpack_require__( 6442 );
media.view.toolbar = __webpack_require__( 5275 );
media.view.toolbar.select = __webpack_require__( 9458 );
media.view.toolbar.embed = __webpack_require__( 397 );
media.view.button = __webpack_require__( 846 );
media.view.buttongroup = __webpack_require__( 168 );
media.view.prioritylist = __webpack_require__( 8815 );
media.view.menuitem = __webpack_require__( 9013 );
media.view.menu = __webpack_require__( 1 );
media.view.routeritem = __webpack_require__( 6327 );
media.view.router = __webpack_require__( 4783 );
media.view.sidebar = __webpack_require__( 1992 );
media.view.attachment = __webpack_require__( 4075 );
media.view.attachment.library = __webpack_require__( 3443 );
media.view.attachment.editlibrary = __webpack_require__( 5232 );
media.view.attachments = __webpack_require__( 8142 );
media.view.search = __webpack_require__( 2102 );
media.view.attachmentfilters = __webpack_require__( 7709 );
media.view.datefilter = __webpack_require__( 6472 );
media.view.attachmentfilters.uploaded = __webpack_require__( 1368 );
media.view.attachmentfilters.all = __webpack_require__( 7349 );
media.view.attachmentsbrowser = __webpack_require__( 6829 );
media.view.selection = __webpack_require__( 8282 );
media.view.attachment.selection = __webpack_require__( 3962 );
media.view.attachments.selection = __webpack_require__( 3479 );
media.view.attachment.editselection = __webpack_require__( 4593 );
media.view.settings = __webpack_require__( 1915 );
media.view.settings.attachmentdisplay = __webpack_require__( 7656 );
media.view.settings.gallery = __webpack_require__( 7266 );
media.view.settings.playlist = __webpack_require__( 2356 );
media.view.attachment.details = __webpack_require__( 6090 );
media.view.attachmentcompat = __webpack_require__( 2982 );
media.view.iframe = __webpack_require__( 1982 );
media.view.embed = __webpack_require__( 5741 );
media.view.label = __webpack_require__( 4338 );
media.view.embedurl = __webpack_require__( 7327 );
media.view.embedlink = __webpack_require__( 8232 );
media.view.embedimage = __webpack_require__( 2395 );
media.view.imagedetails = __webpack_require__( 2650 );
media.view.cropper = __webpack_require__( 7637 );
media.view.siteiconcropper = __webpack_require__( 443 );
media.view.siteiconpreview = __webpack_require__( 7810 );
media.view.editimage = __webpack_require__( 6126 );
media.view.spinner = __webpack_require__( 9141 );
media.view.heading = __webpack_require__( 170 );

/******/ })()
;






