/******/ (() => { // webpackbootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 659:
/***/ ((module) => {

var l10n = wp.media.view.l10n,
	editattachmentmetadata;

/**
 * wp.media.controller.editattachmentmetadata
 *
 * a state for editing an attachment's metadata.
 *
 * @memberof wp.media.controller
 *
 * @class
 * @augments wp.media.controller.state
 * @augments backbone.model
 */
editattachmentmetadata = wp.media.controller.state.extend(/** @lends wp.media.controller.editattachmentmetadata.prototype */{
	defaults: {
		id:      'edit-attachment',
		// title string passed to the frame's title region view.
		title:   l10n.attachmentdetails,
		// region mode defaults.
		content: 'edit-metadata',
		menu:    false,
		toolbar: false,
		router:  false
	}
});

module.exports = editattachmentmetadata;


/***/ }),

/***/ 682:
/***/ ((module) => {


var button = wp.media.view.button,
	l10n = wp.media.view.l10n,
	selectmodetoggle;

/**
 * wp.media.view.selectmodetogglebutton
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view.button
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
selectmodetoggle = button.extend(/** @lends wp.media.view.selectmodetoggle.prototype */{
	initialize: function() {
		_.defaults( this.options, {
			size : ''
		} );

		button.prototype.initialize.apply( this, arguments );
		this.controller.on( 'select:activate select:deactivate', this.togglebulkedithandler, this );
		this.controller.on( 'selection:action:done', this.back, this );
	},

	back: function () {
		this.controller.deactivatemode( 'select' ).activatemode( 'edit' );
	},

	click: function() {
		button.prototype.click.apply( this, arguments );
		if ( this.controller.ismodeactive( 'select' ) ) {
			this.back();
		} else {
			this.controller.deactivatemode( 'edit' ).activatemode( 'select' );
		}
	},

	render: function() {
		button.prototype.render.apply( this, arguments );
		this.$el.addclass( 'select-mode-toggle-button' );
		return this;
	},

	togglebulkedithandler: function() {
		var toolbar = this.controller.content.get().toolbar, children;

		children = toolbar.$( '.media-toolbar-secondary > *, .media-toolbar-primary > *' );

		// @todo the frame should be doing all of this.
		if ( this.controller.ismodeactive( 'select' ) ) {
			this.model.set( {
				size: 'large',
				text: l10n.cancel
			} );
			children.not( '.spinner, .media-button' ).hide();
			this.$el.show();
			toolbar.$el.addclass( 'media-toolbar-mode-select' );
			toolbar.$( '.delete-selected-button' ).removeclass( 'hidden' );
		} else {
			this.model.set( {
				size: '',
				text: l10n.bulkselect
			} );
			this.controller.content.get().$el.removeclass( 'fixed' );
			toolbar.$el.css( 'width', '' );
			toolbar.$el.removeclass( 'media-toolbar-mode-select' );
			toolbar.$( '.delete-selected-button' ).addclass( 'hidden' );
			children.not( '.media-button' ).show();
			this.controller.state().get( 'selection' ).reset();
		}
	}
});

module.exports = selectmodetoggle;


/***/ }),

/***/ 1003:
/***/ ((module) => {

var frame = wp.media.view.frame,
	mediaframe = wp.media.view.mediaframe,

	$ = jquery,
	editattachments;

/**
 * wp.media.view.mediaframe.editattachments
 *
 * a frame for editing the details of a specific media item.
 *
 * opens in a modal by default.
 *
 * requires an attachment model to be passed in the options hash under `model`.
 *
 * @memberof wp.media.view.mediaframe
 *
 * @class
 * @augments wp.media.view.frame
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 * @mixes wp.media.controller.statemachine
 */
editattachments = mediaframe.extend(/** @lends wp.media.view.mediaframe.editattachments.prototype */{

	classname: 'edit-attachment-frame',
	template:  wp.template( 'edit-attachment-frame' ),
	regions:   [ 'title', 'content' ],

	events: {
		'click .left':  'previousmediaitem',
		'click .right': 'nextmediaitem'
	},

	initialize: function() {
		frame.prototype.initialize.apply( this, arguments );

		_.defaults( this.options, {
			modal: true,
			state: 'edit-attachment'
		});

		this.controller = this.options.controller;
		this.gridrouter = this.controller.gridrouter;
		this.library = this.options.library;

		if ( this.options.model ) {
			this.model = this.options.model;
		}

		this.bindhandlers();
		this.createstates();
		this.createmodal();

		this.title.mode( 'default' );
		this.togglenav();
	},

	bindhandlers: function() {
		// bind default title creation.
		this.on( 'title:create:default', this.createtitle, this );

		this.on( 'content:create:edit-metadata', this.editmetadatamode, this );
		this.on( 'content:create:edit-image', this.editimagemode, this );
		this.on( 'content:render:edit-image', this.editimagemoderender, this );
		this.on( 'refresh', this.rerender, this );
		this.on( 'close', this.detach );

		this.bindmodelhandlers();
		this.listento( this.gridrouter, 'route:search', this.close, this );
	},

	bindmodelhandlers: function() {
		// close the modal if the attachment is deleted.
		this.listento( this.model, 'change:status destroy', this.close, this );
	},

	createmodal: function() {
		// initialize modal container view.
		if ( this.options.modal ) {
			this.modal = new wp.media.view.modal({
				controller:     this,
				title:          this.options.title,
				hasclosebutton: false
			});

			this.modal.on( 'open', _.bind( function () {
				$( 'body' ).on( 'keydown.media-modal', _.bind( this.keyevent, this ) );
			}, this ) );

			// completely destroy the modal dom element when closing it.
			this.modal.on( 'close', _.bind( function() {
				// remove the keydown event.
				$( 'body' ).off( 'keydown.media-modal' );
				// move focus back to the original item in the grid if possible.
				$( 'li.attachment[data-id="' + this.model.get( 'id' ) +'"]' ).trigger( 'focus' );
				this.resetroute();
			}, this ) );

			// set this frame as the modal's content.
			this.modal.content( this );
			this.modal.open();
		}
	},

	/**
	 * add the default states to the frame.
	 */
	createstates: function() {
		this.states.add([
			new wp.media.controller.editattachmentmetadata({
				model:   this.model,
				library: this.library
			})
		]);
	},

	/**
	 * content region rendering callback for the `edit-metadata` mode.
	 *
	 * @param {object} contentregion basic object with a `view` property, which
	 *                               should be set with the proper region view.
	 */
	editmetadatamode: function( contentregion ) {
		contentregion.view = new wp.media.view.attachment.details.twocolumn({
			controller: this,
			model:      this.model
		});

		/**
		 * attach a subview to display fields added via the
		 * `attachment_fields_to_edit` filter.
		 */
		contentregion.view.views.set( '.attachment-compat', new wp.media.view.attachmentcompat({
			controller: this,
			model:      this.model
		}) );

		// update browser url when navigating media details, except on load.
		if ( this.model && ! this.model.get( 'skiphistory' ) ) {
			this.gridrouter.navigate( this.gridrouter.baseurl( '?item=' + this.model.id ) );
		}
	},

	/**
	 * render the editimage view into the frame's content region.
	 *
	 * @param {object} contentregion basic object with a `view` property, which
	 *                               should be set with the proper region view.
	 */
	editimagemode: function( contentregion ) {
		var editimagecontroller = new wp.media.controller.editimage( {
			model: this.model,
			frame: this
		} );
		// noop some methods.
		editimagecontroller._toolbar = function() {};
		editimagecontroller._router = function() {};
		editimagecontroller._menu = function() {};

		contentregion.view = new wp.media.view.editimage.details( {
			model: this.model,
			frame: this,
			controller: editimagecontroller
		} );

		this.gridrouter.navigate( this.gridrouter.baseurl( '?item=' + this.model.id + '&mode=edit' ) );

	},

	editimagemoderender: function( view ) {
		view.on( 'ready', view.loadeditor );
	},

	togglenav: function() {
		this.$( '.left' ).prop( 'disabled', ! this.hasprevious() );
		this.$( '.right' ).prop( 'disabled', ! this.hasnext() );
	},

	/**
	 * rerender the view.
	 */
	rerender: function( model ) {
		this.stoplistening( this.model );

		this.model = model;

		this.bindmodelhandlers();

		// only rerender the `content` region.
		if ( this.content.mode() !== 'edit-metadata' ) {
			this.content.mode( 'edit-metadata' );
		} else {
			this.content.render();
		}

		this.togglenav();
	},

	/**
	 * click handler to switch to the previous media item.
	 */
	previousmediaitem: function() {
		if ( ! this.hasprevious() ) {
			return;
		}

		this.trigger( 'refresh', this.library.at( this.getcurrentindex() - 1 ) );
		// move focus to the previous button. when there are no more items, to the next button.
		this.focusnavbutton( this.hasprevious() ? '.left' : '.right' );
	},

	/**
	 * click handler to switch to the next media item.
	 */
	nextmediaitem: function() {
		if ( ! this.hasnext() ) {
			return;
		}

		this.trigger( 'refresh', this.library.at( this.getcurrentindex() + 1 ) );
		// move focus to the next button. when there are no more items, to the previous button.
		this.focusnavbutton( this.hasnext() ? '.right' : '.left' );
	},

	/**
	 * set focus to the navigation buttons depending on the browsing direction.
	 *
	 * @since 5.3.0
	 *
	 * @param {string} which a css selector to target the button to focus.
	 */
	focusnavbutton: function( which ) {
		$( which ).trigger( 'focus' );
	},

	getcurrentindex: function() {
		return this.library.indexof( this.model );
	},

	hasnext: function() {
		return ( this.getcurrentindex() + 1 ) < this.library.length;
	},

	hasprevious: function() {
		return ( this.getcurrentindex() - 1 ) > -1;
	},
	/**
	 * respond to the keyboard events: right arrow, left arrow, except when
	 * focus is in a textarea or input field.
	 */
	keyevent: function( event ) {
		if ( ( 'input' === event.target.nodename || 'textarea' === event.target.nodename ) && ! event.target.disabled ) {
			return;
		}

		// return if ctrl + shift or shift key pressed
		if ( event.shiftkey || ( event.ctrlkey && event.shiftkey ) ) {
			return;
		}

		// the right arrow key.
		if ( 39 === event.keycode ) {
			this.nextmediaitem();
		}
		// the left arrow key.
		if ( 37 === event.keycode ) {
			this.previousmediaitem();
		}
	},

	resetroute: function() {
		var searchterm = this.controller.browserview.toolbar.get( 'search' ).$el.val(),
			url = '' !== searchterm ? '?search=' + searchterm : '';
		this.gridrouter.navigate( this.gridrouter.baseurl( url ), { replace: true } );
	}
});

module.exports = editattachments;


/***/ }),

/***/ 1312:
/***/ ((module) => {

var details = wp.media.view.attachment.details,
	twocolumn;

/**
 * wp.media.view.attachment.details.twocolumn
 *
 * a similar view to media.view.attachment.details
 * for use in the edit attachment modal.
 *
 * @memberof wp.media.view.attachment.details
 *
 * @class
 * @augments wp.media.view.attachment.details
 * @augments wp.media.view.attachment
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
twocolumn = details.extend(/** @lends wp.media.view.attachment.details.twocolumn.prototype */{
	template: wp.template( 'attachment-details-two-column' ),

	initialize: function() {
		this.controller.on( 'content:activate:edit-details', _.bind( this.editattachment, this ) );

		details.prototype.initialize.apply( this, arguments );
	},

	editattachment: function( event ) {
		if ( event ) {
			event.preventdefault();
		}
		this.controller.content.mode( 'edit-image' );
	},

	/**
	 * noop this from parent class, doesn't apply here.
	 */
	toggleselectionhandler: function() {}

});

module.exports = twocolumn;


/***/ }),

/***/ 2429:
/***/ ((module) => {

/**
 * wp.media.view.mediaframe.manage.router
 *
 * a router for handling the browser history and application state.
 *
 * @memberof wp.media.view.mediaframe.manage
 *
 * @class
 * @augments backbone.router
 */
var router = backbone.router.extend(/** @lends wp.media.view.mediaframe.manage.router.prototype */{
	routes: {
		'upload.php?item=:slug&mode=edit': 'edititem',
		'upload.php?item=:slug':           'showitem',
		'upload.php?search=:query':        'search',
		'upload.php':                      'reset'
	},

	// map routes against the page url.
	baseurl: function( url ) {
		return 'upload.php' + url;
	},

	reset: function() {
		var frame = wp.media.frames.edit;

		if ( frame ) {
			frame.close();
		}
	},

	// respond to the search route by filling the search field and triggering the input event.
	search: function( query ) {
		jquery( '#media-search-input' ).val( query ).trigger( 'input' );
	},

	// show the modal with a specific item.
	showitem: function( query ) {
		var media = wp.media,
			frame = media.frames.browse,
			library = frame.state().get('library'),
			item;

		// trigger the media frame to open the correct item.
		item = library.findwhere( { id: parseint( query, 10 ) } );

		if ( item ) {
			item.set( 'skiphistory', true );
			frame.trigger( 'edit:attachment', item );
		} else {
			item = media.attachment( query );
			frame.listento( item, 'change', function( model ) {
				frame.stoplistening( item );
				frame.trigger( 'edit:attachment', model );
			} );
			item.fetch();
		}
	},

	// show the modal in edit mode with a specific item.
	edititem: function( query ) {
		this.showitem( query );
		wp.media.frames.edit.content.mode( 'edit-details' );
	}
});

module.exports = router;


/***/ }),

/***/ 5806:
/***/ ((module) => {

var button = wp.media.view.button,
	deleteselected = wp.media.view.deleteselectedbutton,
	deleteselectedpermanently;

/**
 * wp.media.view.deleteselectedpermanentlybutton
 *
 * when media_trash is true, a button that handles bulk delete permanently logic
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view.deleteselectedbutton
 * @augments wp.media.view.button
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
deleteselectedpermanently = deleteselected.extend(/** @lends wp.media.view.deleteselectedpermanentlybutton.prototype */{
	initialize: function() {
		deleteselected.prototype.initialize.apply( this, arguments );
		this.controller.on( 'select:activate', this.selectactivate, this );
		this.controller.on( 'select:deactivate', this.selectdeactivate, this );
	},

	filterchange: function( model ) {
		this.canshow = ( 'trash' === model.get( 'status' ) );
	},

	selectactivate: function() {
		this.toggledisabled();
		this.$el.toggleclass( 'hidden', ! this.canshow );
	},

	selectdeactivate: function() {
		this.toggledisabled();
		this.$el.addclass( 'hidden' );
	},

	render: function() {
		button.prototype.render.apply( this, arguments );
		this.selectactivate();
		return this;
	}
});

module.exports = deleteselectedpermanently;


/***/ }),

/***/ 6606:
/***/ ((module) => {

var button = wp.media.view.button,
	l10n = wp.media.view.l10n,
	deleteselected;

/**
 * wp.media.view.deleteselectedbutton
 *
 * a button that handles bulk delete/trash logic
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view.button
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
deleteselected = button.extend(/** @lends wp.media.view.deleteselectedbutton.prototype */{
	initialize: function() {
		button.prototype.initialize.apply( this, arguments );
		if ( this.options.filters ) {
			this.options.filters.model.on( 'change', this.filterchange, this );
		}
		this.controller.on( 'selection:toggle', this.toggledisabled, this );
		this.controller.on( 'select:activate', this.toggledisabled, this );
	},

	filterchange: function( model ) {
		if ( 'trash' === model.get( 'status' ) ) {
			this.model.set( 'text', l10n.restoreselected );
		} else if ( wp.media.view.settings.mediatrash ) {
			this.model.set( 'text', l10n.trashselected );
		} else {
			this.model.set( 'text', l10n.deletepermanently );
		}
	},

	toggledisabled: function() {
		this.model.set( 'disabled', ! this.controller.state().get( 'selection' ).length );
	},

	render: function() {
		button.prototype.render.apply( this, arguments );
		if ( this.controller.ismodeactive( 'select' ) ) {
			this.$el.addclass( 'delete-selected-button' );
		} else {
			this.$el.addclass( 'delete-selected-button hidden' );
		}
		this.toggledisabled();
		return this;
	}
});

module.exports = deleteselected;


/***/ }),

/***/ 8359:
/***/ ((module) => {

var mediaframe = wp.media.view.mediaframe,
	library = wp.media.controller.library,

	$ = backbone.$,
	manage;

/**
 * wp.media.view.mediaframe.manage
 *
 * a generic management frame workflow.
 *
 * used in the media grid view.
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
manage = mediaframe.extend(/** @lends wp.media.view.mediaframe.manage.prototype */{
	/**
	 * @constructs
	 */
	initialize: function() {
		_.defaults( this.options, {
			title:     '',
			modal:     false,
			selection: [],
			library:   {}, // options hash for the query to the media library.
			multiple:  'add',
			state:     'library',
			uploader:  true,
			mode:      [ 'grid', 'edit' ]
		});

		this.$body = $( document.body );
		this.$window = $( window );
		this.$adminbar = $( '#wpadminbar' );
		// store the add new button for later reuse in wp.media.view.uploaderinline.
		this.$uploadertoggler = $( '.page-title-action' )
			.attr( 'aria-expanded', 'false' )
			.on( 'click', _.bind( this.addnewclickhandler, this ) );

		this.$window.on( 'scroll resize', _.debounce( _.bind( this.fixposition, this ), 15 ) );

		// ensure core and media grid view ui is enabled.
		this.$el.addclass('wp-core-ui');

		// force the uploader off if the upload limit has been exceeded or
		// if the browser isn't supported.
		if ( wp.uploader.limitexceeded || ! wp.uploader.browser.supported ) {
			this.options.uploader = false;
		}

		// initialize a window-wide uploader.
		if ( this.options.uploader ) {
			this.uploader = new wp.media.view.uploaderwindow({
				controller: this,
				uploader: {
					dropzone:  document.body,
					container: document.body
				}
			}).render();
			this.uploader.ready();
			$('body').append( this.uploader.el );

			this.options.uploader = false;
		}

		this.gridrouter = new wp.media.view.mediaframe.manage.router();

		// call 'initialize' directly on the parent class.
		mediaframe.prototype.initialize.apply( this, arguments );

		// append the frame view directly the supplied container.
		this.$el.appendto( this.options.container );

		this.createstates();
		this.bindregionmodehandlers();
		this.render();
		this.bindsearchhandler();

		wp.media.frames.browse = this;
	},

	bindsearchhandler: function() {
		var search = this.$( '#media-search-input' ),
			searchview = this.browserview.toolbar.get( 'search' ).$el,
			listmode = this.$( '.view-list' ),

			input  = _.throttle( function (e) {
				var val = $( e.currenttarget ).val(),
					url = '';

				if ( val ) {
					url += '?search=' + val;
					this.gridrouter.navigate( this.gridrouter.baseurl( url ), { replace: true } );
				}
			}, 1000 );

		// update the url when entering search string (at most once per second).
		search.on( 'input', _.bind( input, this ) );

		this.gridrouter
			.on( 'route:search', function () {
				var href = window.location.href;
				if ( href.indexof( 'mode=' ) > -1 ) {
					href = href.replace( /mode=[^&]+/g, 'mode=list' );
				} else {
					href += href.indexof( '?' ) > -1 ? '&mode=list' : '?mode=list';
				}
				href = href.replace( 'search=', 's=' );
				listmode.prop( 'href', href );
			})
			.on( 'route:reset', function() {
				searchview.val( '' ).trigger( 'input' );
			});
	},

	/**
	 * create the default states for the frame.
	 */
	createstates: function() {
		var options = this.options;

		if ( this.options.states ) {
			return;
		}

		// add the default states.
		this.states.add([
			new library({
				library:            wp.media.query( options.library ),
				multiple:           options.multiple,
				title:              options.title,
				content:            'browse',
				toolbar:            'select',
				contentusersetting: false,
				filterable:         'all',
				autoselect:         false
			})
		]);
	},

	/**
	 * bind region mode activation events to proper handlers.
	 */
	bindregionmodehandlers: function() {
		this.on( 'content:create:browse', this.browsecontent, this );

		// handle a frame-level event for editing an attachment.
		this.on( 'edit:attachment', this.openeditattachmentmodal, this );

		this.on( 'select:activate', this.bindkeydown, this );
		this.on( 'select:deactivate', this.unbindkeydown, this );
	},

	handlekeydown: function( e ) {
		if ( 27 === e.which ) {
			e.preventdefault();
			this.deactivatemode( 'select' ).activatemode( 'edit' );
		}
	},

	bindkeydown: function() {
		this.$body.on( 'keydown.select', _.bind( this.handlekeydown, this ) );
	},

	unbindkeydown: function() {
		this.$body.off( 'keydown.select' );
	},

	fixposition: function() {
		var $browser, $toolbar;
		if ( ! this.ismodeactive( 'select' ) ) {
			return;
		}

		$browser = this.$('.attachments-browser');
		$toolbar = $browser.find('.media-toolbar');

		// offset doesn't appear to take top margin into account, hence +16.
		if ( ( $browser.offset().top + 16 ) < this.$window.scrolltop() + this.$adminbar.height() ) {
			$browser.addclass( 'fixed' );
			$toolbar.css('width', $browser.width() + 'px');
		} else {
			$browser.removeclass( 'fixed' );
			$toolbar.css('width', '');
		}
	},

	/**
	 * click handler for the `add new` button.
	 */
	addnewclickhandler: function( event ) {
		event.preventdefault();
		this.trigger( 'toggle:upload:attachment' );

		if ( this.uploader ) {
			this.uploader.refresh();
		}
	},

	/**
	 * open the edit attachment modal.
	 */
	openeditattachmentmodal: function( model ) {
		// create a new editattachment frame, passing along the library and the attachment model.
		if ( wp.media.frames.edit ) {
			wp.media.frames.edit.open().trigger( 'refresh', model );
		} else {
			wp.media.frames.edit = wp.media( {
				frame:       'edit-attachments',
				controller:  this,
				library:     this.state().get('library'),
				model:       model
			} );
		}
	},

	/**
	 * create an attachments browser view within the content region.
	 *
	 * @param {object} contentregion basic object with a `view` property, which
	 *                               should be set with the proper region view.
	 * @this wp.media.controller.region
	 */
	browsecontent: function( contentregion ) {
		var state = this.state();

		// browse our library of attachments.
		this.browserview = contentregion.view = new wp.media.view.attachmentsbrowser({
			controller: this,
			collection: state.get('library'),
			selection:  state.get('selection'),
			model:      state,
			sortable:   state.get('sortable'),
			search:     state.get('searchable'),
			filters:    state.get('filterable'),
			date:       state.get('date'),
			display:    state.get('displaysettings'),
			draginfo:   state.get('draginfo'),
			sidebar:    'errors',

			suggestedwidth:  state.get('suggestedwidth'),
			suggestedheight: state.get('suggestedheight'),

			attachmentview: state.get('attachmentview'),

			scrollelement: document
		});
		this.browserview.on( 'ready', _.bind( this.binddeferred, this ) );

		this.errors = wp.uploader.errors;
		this.errors.on( 'add remove reset', this.sidebarvisibility, this );
	},

	sidebarvisibility: function() {
		this.browserview.$( '.media-sidebar' ).toggle( !! this.errors.length );
	},

	binddeferred: function() {
		if ( ! this.browserview.dfd ) {
			return;
		}
		this.browserview.dfd.done( _.bind( this.starthistory, this ) );
	},

	starthistory: function() {
		// verify pushstate support and activate.
		if ( window.history && window.history.pushstate ) {
			if ( backbone.history.started ) {
				backbone.history.stop();
			}
			backbone.history.start( {
				root: window._wpmediagridsettings.adminurl,
				pushstate: true
			} );
		}
	}
});

module.exports = manage;


/***/ }),

/***/ 8521:
/***/ ((module) => {

var view = wp.media.view,
	editimage = wp.media.view.editimage,
	details;

/**
 * wp.media.view.editimage.details
 *
 * @memberof wp.media.view.editimage
 *
 * @class
 * @augments wp.media.view.editimage
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
details = editimage.extend(/** @lends wp.media.view.editimage.details.prototype */{
	initialize: function( options ) {
		this.editor = window.imageedit;
		this.frame = options.frame;
		this.controller = options.controller;
		view.prototype.initialize.apply( this, arguments );
	},

	back: function() {
		this.frame.content.mode( 'edit-metadata' );
	},

	save: function() {
		this.model.fetch().done( _.bind( function() {
			this.frame.content.mode( 'edit-metadata' );
		}, this ) );
	}
});

module.exports = details;


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
 * @output wp-includes/js/media-grid.js
 */

var media = wp.media;

media.controller.editattachmentmetadata = __webpack_require__( 659 );
media.view.mediaframe.manage = __webpack_require__( 8359 );
media.view.attachment.details.twocolumn = __webpack_require__( 1312 );
media.view.mediaframe.manage.router = __webpack_require__( 2429 );
media.view.editimage.details = __webpack_require__( 8521 );
media.view.mediaframe.editattachments = __webpack_require__( 1003 );
media.view.selectmodetogglebutton = __webpack_require__( 682 );
media.view.deleteselectedbutton = __webpack_require__( 6606 );
media.view.deleteselectedpermanentlybutton = __webpack_require__( 5806 );

/******/ })()
;






