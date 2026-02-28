/******/ (() => { // webpackbootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 175:
/***/ ((module) => {

var mediadetails = wp.media.view.mediaframe.mediadetails,
	medialibrary = wp.media.controller.medialibrary,

	l10n = wp.media.view.l10n,
	audiodetails;

/**
 * wp.media.view.mediaframe.audiodetails
 *
 * @memberof wp.media.view.mediaframe
 *
 * @class
 * @augments wp.media.view.mediaframe.mediadetails
 * @augments wp.media.view.mediaframe.select
 * @augments wp.media.view.mediaframe
 * @augments wp.media.view.frame
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 * @mixes wp.media.controller.statemachine
 */
audiodetails = mediadetails.extend(/** @lends wp.media.view.mediaframe.audiodetails.prototype */{
	defaults: {
		id:      'audio',
		url:     '',
		menu:    'audio-details',
		content: 'audio-details',
		toolbar: 'audio-details',
		type:    'link',
		title:    l10n.audiodetailstitle,
		priority: 120
	},

	initialize: function( options ) {
		options.detailsview = wp.media.view.audiodetails;
		options.canceltext = l10n.audiodetailscancel;
		options.addtext = l10n.audioaddsourcetitle;

		mediadetails.prototype.initialize.call( this, options );
	},

	bindhandlers: function() {
		mediadetails.prototype.bindhandlers.apply( this, arguments );

		this.on( 'toolbar:render:replace-audio', this.renderreplacetoolbar, this );
		this.on( 'toolbar:render:add-audio-source', this.renderaddsourcetoolbar, this );
	},

	createstates: function() {
		this.states.add([
			new wp.media.controller.audiodetails( {
				media: this.media
			} ),

			new medialibrary( {
				type: 'audio',
				id: 'replace-audio',
				title: l10n.audioreplacetitle,
				toolbar: 'replace-audio',
				media: this.media,
				menu: 'audio-details'
			} ),

			new medialibrary( {
				type: 'audio',
				id: 'add-audio-source',
				title: l10n.audioaddsourcetitle,
				toolbar: 'add-audio-source',
				media: this.media,
				menu: false
			} )
		]);
	}
});

module.exports = audiodetails;


/***/ }),

/***/ 241:
/***/ ((module) => {

/**
 * wp.media.model.postmedia
 *
 * shared model class for audio and video. updates the model after
 *   "add audio|video source" and "replace audio|video" states return
 *
 * @memberof wp.media.model
 *
 * @class
 * @augments backbone.model
 */
var postmedia = backbone.model.extend(/** @lends wp.media.model.postmedia.prototype */{
	initialize: function() {
		this.attachment = false;
	},

	setsource: function( attachment ) {
		this.attachment = attachment;
		this.extension = attachment.get( 'filename' ).split('.').pop();

		if ( this.get( 'src' ) && this.extension === this.get( 'src' ).split('.').pop() ) {
			this.unset( 'src' );
		}

		if ( _.contains( wp.media.view.settings.embedexts, this.extension ) ) {
			this.set( this.extension, this.attachment.get( 'url' ) );
		} else {
			this.unset( this.extension );
		}
	},

	changeattachment: function( attachment ) {
		this.setsource( attachment );

		this.unset( 'src' );
		_.each( _.without( wp.media.view.settings.embedexts, this.extension ), function( ext ) {
			this.unset( ext );
		}, this );
	}
});

module.exports = postmedia;


/***/ }),

/***/ 741:
/***/ ((module) => {

var select = wp.media.view.mediaframe.select,
	l10n = wp.media.view.l10n,
	mediadetails;

/**
 * wp.media.view.mediaframe.mediadetails
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
mediadetails = select.extend(/** @lends wp.media.view.mediaframe.mediadetails.prototype */{
	defaults: {
		id:      'media',
		url:     '',
		menu:    'media-details',
		content: 'media-details',
		toolbar: 'media-details',
		type:    'link',
		priority: 120
	},

	initialize: function( options ) {
		this.detailsview = options.detailsview;
		this.canceltext = options.canceltext;
		this.addtext = options.addtext;

		this.media = new wp.media.model.postmedia( options.metadata );
		this.options.selection = new wp.media.model.selection( this.media.attachment, { multiple: false } );
		select.prototype.initialize.apply( this, arguments );
	},

	bindhandlers: function() {
		var menu = this.defaults.menu;

		select.prototype.bindhandlers.apply( this, arguments );

		this.on( 'menu:create:' + menu, this.createmenu, this );
		this.on( 'content:render:' + menu, this.renderdetailscontent, this );
		this.on( 'menu:render:' + menu, this.rendermenu, this );
		this.on( 'toolbar:render:' + menu, this.renderdetailstoolbar, this );
	},

	renderdetailscontent: function() {
		var view = new this.detailsview({
			controller: this,
			model: this.state().media,
			attachment: this.state().media.attachment
		}).render();

		this.content.set( view );
	},

	rendermenu: function( view ) {
		var laststate = this.laststate(),
			previous = laststate && laststate.id,
			frame = this;

		view.set({
			cancel: {
				text:     this.canceltext,
				priority: 20,
				click:    function() {
					if ( previous ) {
						frame.setstate( previous );
					} else {
						frame.close();
					}
				}
			},
			separatecancel: new wp.media.view({
				classname: 'separator',
				priority: 40
			})
		});

	},

	setprimarybutton: function(text, handler) {
		this.toolbar.set( new wp.media.view.toolbar({
			controller: this,
			items: {
				button: {
					style:    'primary',
					text:     text,
					priority: 80,
					click:    function() {
						var controller = this.controller;
						handler.call( this, controller, controller.state() );
						// restore and reset the default state.
						controller.setstate( controller.options.state );
						controller.reset();
					}
				}
			}
		}) );
	},

	renderdetailstoolbar: function() {
		this.setprimarybutton( l10n.update, function( controller, state ) {
			controller.close();
			state.trigger( 'update', controller.media.tojson() );
		} );
	},

	renderreplacetoolbar: function() {
		this.setprimarybutton( l10n.replace, function( controller, state ) {
			var attachment = state.get( 'selection' ).single();
			controller.media.changeattachment( attachment );
			state.trigger( 'replace', controller.media.tojson() );
		} );
	},

	renderaddsourcetoolbar: function() {
		this.setprimarybutton( this.addtext, function( controller, state ) {
			var attachment = state.get( 'selection' ).single();
			controller.media.setsource( attachment );
			state.trigger( 'add-source', controller.media.tojson() );
		} );
	}
});

module.exports = mediadetails;


/***/ }),

/***/ 1206:
/***/ ((module) => {

var state = wp.media.controller.state,
	l10n = wp.media.view.l10n,
	audiodetails;

/**
 * wp.media.controller.audiodetails
 *
 * the controller for the audio details state
 *
 * @memberof wp.media.controller
 *
 * @class
 * @augments wp.media.controller.state
 * @augments backbone.model
 */
audiodetails = state.extend(/** @lends wp.media.controller.audiodetails.prototype */{
	defaults: {
		id: 'audio-details',
		toolbar: 'audio-details',
		title: l10n.audiodetailstitle,
		content: 'audio-details',
		menu: 'audio-details',
		router: false,
		priority: 60
	},

	initialize: function( options ) {
		this.media = options.media;
		state.prototype.initialize.apply( this, arguments );
	}
});

module.exports = audiodetails;


/***/ }),

/***/ 3713:
/***/ ((module) => {

var mediadetails = wp.media.view.mediadetails,
	audiodetails;

/**
 * wp.media.view.audiodetails
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view.mediadetails
 * @augments wp.media.view.settings.attachmentdisplay
 * @augments wp.media.view.settings
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
audiodetails = mediadetails.extend(/** @lends wp.media.view.audiodetails.prototype */{
	classname: 'audio-details',
	template:  wp.template('audio-details'),

	setmedia: function() {
		var audio = this.$('.wp-audio-shortcode');

		if ( audio.find( 'source' ).length ) {
			if ( audio.is(':hidden') ) {
				audio.show();
			}
			this.media = mediadetails.preparesrc( audio.get(0) );
		} else {
			audio.hide();
			this.media = false;
		}

		return this;
	}
});

module.exports = audiodetails;


/***/ }),

/***/ 5039:
/***/ ((module) => {

/**
 * wp.media.controller.videodetails
 *
 * the controller for the video details state
 *
 * @memberof wp.media.controller
 *
 * @class
 * @augments wp.media.controller.state
 * @augments backbone.model
 */
var state = wp.media.controller.state,
	l10n = wp.media.view.l10n,
	videodetails;

videodetails = state.extend(/** @lends wp.media.controller.videodetails.prototype */{
	defaults: {
		id: 'video-details',
		toolbar: 'video-details',
		title: l10n.videodetailstitle,
		content: 'video-details',
		menu: 'video-details',
		router: false,
		priority: 60
	},

	initialize: function( options ) {
		this.media = options.media;
		state.prototype.initialize.apply( this, arguments );
	}
});

module.exports = videodetails;


/***/ }),

/***/ 5836:
/***/ ((module) => {

var mediadetails = wp.media.view.mediadetails,
	videodetails;

/**
 * wp.media.view.videodetails
 *
 * @memberof wp.media.view
 *
 * @class
 * @augments wp.media.view.mediadetails
 * @augments wp.media.view.settings.attachmentdisplay
 * @augments wp.media.view.settings
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 */
videodetails = mediadetails.extend(/** @lends wp.media.view.videodetails.prototype */{
	classname: 'video-details',
	template:  wp.template('video-details'),

	setmedia: function() {
		var video = this.$('.wp-video-shortcode');

		if ( video.find( 'source' ).length ) {
			if ( video.is(':hidden') ) {
				video.show();
			}

			if ( ! video.hasclass( 'youtube-video' ) && ! video.hasclass( 'vimeo-video' ) ) {
				this.media = mediadetails.preparesrc( video.get(0) );
			} else {
				this.media = video.get(0);
			}
		} else {
			video.hide();
			this.media = false;
		}

		return this;
	}
});

module.exports = videodetails;


/***/ }),

/***/ 8646:
/***/ ((module) => {

var mediadetails = wp.media.view.mediaframe.mediadetails,
	medialibrary = wp.media.controller.medialibrary,
	l10n = wp.media.view.l10n,
	videodetails;

/**
 * wp.media.view.mediaframe.videodetails
 *
 * @memberof wp.media.view.mediaframe
 *
 * @class
 * @augments wp.media.view.mediaframe.mediadetails
 * @augments wp.media.view.mediaframe.select
 * @augments wp.media.view.mediaframe
 * @augments wp.media.view.frame
 * @augments wp.media.view
 * @augments wp.backbone.view
 * @augments backbone.view
 * @mixes wp.media.controller.statemachine
 */
videodetails = mediadetails.extend(/** @lends wp.media.view.mediaframe.videodetails.prototype */{
	defaults: {
		id:      'video',
		url:     '',
		menu:    'video-details',
		content: 'video-details',
		toolbar: 'video-details',
		type:    'link',
		title:    l10n.videodetailstitle,
		priority: 120
	},

	initialize: function( options ) {
		options.detailsview = wp.media.view.videodetails;
		options.canceltext = l10n.videodetailscancel;
		options.addtext = l10n.videoaddsourcetitle;

		mediadetails.prototype.initialize.call( this, options );
	},

	bindhandlers: function() {
		mediadetails.prototype.bindhandlers.apply( this, arguments );

		this.on( 'toolbar:render:replace-video', this.renderreplacetoolbar, this );
		this.on( 'toolbar:render:add-video-source', this.renderaddsourcetoolbar, this );
		this.on( 'toolbar:render:select-poster-image', this.renderselectposterimagetoolbar, this );
		this.on( 'toolbar:render:add-track', this.renderaddtracktoolbar, this );
	},

	createstates: function() {
		this.states.add([
			new wp.media.controller.videodetails({
				media: this.media
			}),

			new medialibrary( {
				type: 'video',
				id: 'replace-video',
				title: l10n.videoreplacetitle,
				toolbar: 'replace-video',
				media: this.media,
				menu: 'video-details'
			} ),

			new medialibrary( {
				type: 'video',
				id: 'add-video-source',
				title: l10n.videoaddsourcetitle,
				toolbar: 'add-video-source',
				media: this.media,
				menu: false
			} ),

			new medialibrary( {
				type: 'image',
				id: 'select-poster-image',
				title: l10n.videoselectposterimagetitle,
				toolbar: 'select-poster-image',
				media: this.media,
				menu: 'video-details'
			} ),

			new medialibrary( {
				type: 'text',
				id: 'add-track',
				title: l10n.videoaddtracktitle,
				toolbar: 'add-track',
				media: this.media,
				menu: 'video-details'
			} )
		]);
	},

	renderselectposterimagetoolbar: function() {
		this.setprimarybutton( l10n.videoselectposterimagetitle, function( controller, state ) {
			var urls = [], attachment = state.get( 'selection' ).single();

			controller.media.set( 'poster', attachment.get( 'url' ) );
			state.trigger( 'set-poster-image', controller.media.tojson() );

			_.each( wp.media.view.settings.embedexts, function (ext) {
				if ( controller.media.get( ext ) ) {
					urls.push( controller.media.get( ext ) );
				}
			} );

			wp.ajax.send( 'set-attachment-thumbnail', {
				data : {
					_ajax_nonce: wp.media.view.settings.nonce.setattachmentthumbnail,
					urls: urls,
					thumbnail_id: attachment.get( 'id' )
				}
			} );
		} );
	},

	renderaddtracktoolbar: function() {
		this.setprimarybutton( l10n.videoaddtracktitle, function( controller, state ) {
			var attachment = state.get( 'selection' ).single(),
				content = controller.media.get( 'content' );

			if ( -1 === content.indexof( attachment.get( 'url' ) ) ) {
				content += [
					'<track srclang="en" label="english" kind="subtitles" src="',
					attachment.get( 'url' ),
					'" />'
				].join('');

				controller.media.set( 'content', content );
			}
			state.trigger( 'add-track', controller.media.tojson() );
		} );
	}
});

module.exports = videodetails;


/***/ }),

/***/ 9467:
/***/ ((module) => {

/* global mediaelementplayer */
var attachmentdisplay = wp.media.view.settings.attachmentdisplay,
	$ = jquery,
	mediadetails;

/**
 * wp.media.view.mediadetails
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
mediadetails = attachmentdisplay.extend(/** @lends wp.media.view.mediadetails.prototype */{
	initialize: function() {
		_.bindall(this, 'success');
		this.players = [];
		this.listento( this.controller.states, 'close', wp.media.mixin.unsetplayers );
		this.on( 'ready', this.setplayer );
		this.on( 'media:setting:remove', wp.media.mixin.unsetplayers, this );
		this.on( 'media:setting:remove', this.render );
		this.on( 'media:setting:remove', this.setplayer );

		attachmentdisplay.prototype.initialize.apply( this, arguments );
	},

	events: function(){
		return _.extend( {
			'click .remove-setting' : 'removesetting',
			'change .content-track' : 'settracks',
			'click .remove-track' : 'settracks',
			'click .add-media-source' : 'addsource'
		}, attachmentdisplay.prototype.events );
	},

	prepare: function() {
		return _.defaults({
			model: this.model.tojson()
		}, this.options );
	},

	/**
	 * remove a setting's ui when the model unsets it
	 *
	 * @fires wp.media.view.mediadetails#media:setting:remove
	 *
	 * @param {event} e
	 */
	removesetting : function(e) {
		var wrap = $( e.currenttarget ).parent(), setting;
		setting = wrap.find( 'input' ).data( 'setting' );

		if ( setting ) {
			this.model.unset( setting );
			this.trigger( 'media:setting:remove', this );
		}

		wrap.remove();
	},

	/**
	 *
	 * @fires wp.media.view.mediadetails#media:setting:remove
	 */
	settracks : function() {
		var tracks = '';

		_.each( this.$('.content-track'), function(track) {
			tracks += $( track ).val();
		} );

		this.model.set( 'content', tracks );
		this.trigger( 'media:setting:remove', this );
	},

	addsource : function( e ) {
		this.controller.lastmime = $( e.currenttarget ).data( 'mime' );
		this.controller.setstate( 'add-' + this.controller.defaults.id + '-source' );
	},

	loadplayer: function () {
		this.players.push( new mediaelementplayer( this.media, this.settings ) );
		this.scriptxhr = false;
	},

	setplayer : function() {
		var src;

		if ( this.players.length || ! this.media || this.scriptxhr ) {
			return;
		}

		src = this.model.get( 'src' );

		if ( src && src.indexof( 'vimeo' ) > -1 && ! ( 'vimeo' in window ) ) {
			this.scriptxhr = $.getscript( 'https://player.vimeo.com/api/player.js', _.bind( this.loadplayer, this ) );
		} else {
			this.loadplayer();
		}
	},

	/**
	 * @abstract
	 */
	setmedia : function() {
		return this;
	},

	success : function(mejs) {
		var autoplay = mejs.attributes.autoplay && 'false' !== mejs.attributes.autoplay;

		if ( 'flash' === mejs.plugintype && autoplay ) {
			mejs.addeventlistener( 'canplay', function() {
				mejs.play();
			}, false );
		}

		this.mejs = mejs;
	},

	/**
	 * @return {media.view.mediadetails} returns itself to allow chaining.
	 */
	render: function() {
		attachmentdisplay.prototype.render.apply( this, arguments );

		settimeout( _.bind( function() {
			this.scrolltotop();
		}, this ), 10 );

		this.settings = _.defaults( {
			success : this.success
		}, wp.media.mixin.mejssettings );

		return this.setmedia();
	},

	scrolltotop: function() {
		this.$( '.embed-media-settings' ).scrolltop( 0 );
	}
},/** @lends wp.media.view.mediadetails */{
	instances : 0,
	/**
	 * when multiple players in the dom contain the same src, things get weird.
	 *
	 * @param {htmlelement} elem
	 * @return {htmlelement}
	 */
	preparesrc : function( elem ) {
		var i = mediadetails.instances++;
		_.each( $( elem ).find( 'source' ), function( source ) {
			source.src = [
				source.src,
				source.src.indexof('?') > -1 ? '&' : '?',
				'_=',
				i
			].join('');
		} );

		return elem;
	}
});

module.exports = mediadetails;


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
 * @output wp-includes/js/media-audiovideo.js
 */

var media = wp.media,
	basesettings = window._wpmejssettings || {},
	l10n = window._wpmediaviewsl10n || {};

/**
 *
 * defines the wp.media.mixin object.
 *
 * @mixin
 *
 * @since 4.2.0
 */
wp.media.mixin = {
	mejssettings: basesettings,

	/**
	 * pauses and removes all players.
	 *
	 * @since 4.2.0
	 *
	 * @return {void}
	 */
	removeallplayers: function() {
		var p;

		if ( window.mejs && window.mejs.players ) {
			for ( p in window.mejs.players ) {
				window.mejs.players[p].pause();
				this.removeplayer( window.mejs.players[p] );
			}
		}
	},

	/**
	 * removes the player.
	 *
	 * override the mediaelement method for removing a player.
	 * mediaelement tries to pull the audio/video tag out of
	 * its container and re-add it to the dom.
	 *
	 * @since 4.2.0
	 *
	 * @return {void}
	 */
	removeplayer: function(t) {
		var featureindex, feature;

		if ( ! t.options ) {
			return;
		}

		// invoke features cleanup.
		for ( featureindex in t.options.features ) {
			feature = t.options.features[featureindex];
			if ( t['clean' + feature] ) {
				try {
					t['clean' + feature](t);
				} catch (e) {}
			}
		}

		if ( ! t.isdynamic ) {
			t.node.remove();
		}

		if ( 'html5' !== t.media.renderername ) {
			t.media.remove();
		}

		delete window.mejs.players[t.id];

		t.container.remove();
		t.globalunbind('resize', t.globalresizecallback);
		t.globalunbind('keydown', t.globalkeydowncallback);
		t.globalunbind('click', t.globalclickcallback);
		delete t.media.player;
	},

	/**
	 *
	 * removes and resets all players.
	 *
	 * allows any class that has set 'player' to a mediaelementplayer
	 * instance to remove the player when listening to events.
	 *
	 * examples: modal closes, shortcode properties are removed, etc.
	 *
	 * @since 4.2.0
	 */
	unsetplayers : function() {
		if ( this.players && this.players.length ) {
			_.each( this.players, function (player) {
				player.pause();
				wp.media.mixin.removeplayer( player );
			} );
			this.players = [];
		}
	}
};

/**
 * shortcode modeling for playlists.
 *
 * @since 4.2.0
 */
wp.media.playlist = new wp.media.collection({
	tag: 'playlist',
	edittitle : l10n.editplaylisttitle,
	defaults : {
		id: wp.media.view.settings.post.id,
		style: 'light',
		tracklist: true,
		tracknumbers: true,
		images: true,
		artists: true,
		type: 'audio'
	}
});

/**
 * shortcode modeling for audio.
 *
 * `edit()` prepares the shortcode for the media modal.
 * `shortcode()` builds the new shortcode after an update.
 *
 * @namespace
 *
 * @since 4.2.0
 */
wp.media.audio = {
	coerce : wp.media.coerce,

	defaults : {
		id : wp.media.view.settings.post.id,
		src : '',
		loop : false,
		autoplay : false,
		preload : 'none',
		width : 400
	},

	/**
	 * instantiates a new media object with the next matching shortcode.
	 *
	 * @since 4.2.0
	 *
	 * @param {string} data the text to apply the shortcode on.
	 * @return {wp.media} the media object.
	 */
	edit : function( data ) {
		var frame, shortcode = wp.shortcode.next( 'audio', data ).shortcode;

		frame = wp.media({
			frame: 'audio',
			state: 'audio-details',
			metadata: _.defaults( shortcode.attrs.named, this.defaults )
		});

		return frame;
	},

	/**
	 * generates an audio shortcode.
	 *
	 * @since 4.2.0
	 *
	 * @param {array} model array with attributes for the shortcode.
	 * @return {wp.shortcode} the audio shortcode object.
	 */
	shortcode : function( model ) {
		var content;

		_.each( this.defaults, function( value, key ) {
			model[ key ] = this.coerce( model, key );

			if ( value === model[ key ] ) {
				delete model[ key ];
			}
		}, this );

		content = model.content;
		delete model.content;

		return new wp.shortcode({
			tag: 'audio',
			attrs: model,
			content: content
		});
	}
};

/**
 * shortcode modeling for video.
 *
 *  `edit()` prepares the shortcode for the media modal.
 *  `shortcode()` builds the new shortcode after update.
 *
 * @since 4.2.0
 *
 * @namespace
 */
wp.media.video = {
	coerce : wp.media.coerce,

	defaults : {
		id : wp.media.view.settings.post.id,
		src : '',
		poster : '',
		loop : false,
		autoplay : false,
		preload : 'metadata',
		content : '',
		width : 640,
		height : 360
	},

	/**
	 * instantiates a new media object with the next matching shortcode.
	 *
	 * @since 4.2.0
	 *
	 * @param {string} data the text to apply the shortcode on.
	 * @return {wp.media} the media object.
	 */
	edit : function( data ) {
		var frame,
			shortcode = wp.shortcode.next( 'video', data ).shortcode,
			attrs;

		attrs = shortcode.attrs.named;
		attrs.content = shortcode.content;

		frame = wp.media({
			frame: 'video',
			state: 'video-details',
			metadata: _.defaults( attrs, this.defaults )
		});

		return frame;
	},

	/**
	 * generates an video shortcode.
	 *
	 * @since 4.2.0
	 *
	 * @param {array} model array with attributes for the shortcode.
	 * @return {wp.shortcode} the video shortcode object.
	 */
	shortcode : function( model ) {
		var content;

		_.each( this.defaults, function( value, key ) {
			model[ key ] = this.coerce( model, key );

			if ( value === model[ key ] ) {
				delete model[ key ];
			}
		}, this );

		content = model.content;
		delete model.content;

		return new wp.shortcode({
			tag: 'video',
			attrs: model,
			content: content
		});
	}
};

media.model.postmedia = __webpack_require__( 241 );
media.controller.audiodetails = __webpack_require__( 1206 );
media.controller.videodetails = __webpack_require__( 5039 );
media.view.mediaframe.mediadetails = __webpack_require__( 741 );
media.view.mediaframe.audiodetails = __webpack_require__( 175 );
media.view.mediaframe.videodetails = __webpack_require__( 8646 );
media.view.mediadetails = __webpack_require__( 9467 );
media.view.audiodetails = __webpack_require__( 3713 );
media.view.videodetails = __webpack_require__( 5836 );

/******/ })()
;







