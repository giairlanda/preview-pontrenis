/* global _wpmejssettings, mediaelementplayer */

(function ($, _, backbone) {
	'use strict';

	/** @namespace wp */
	window.wp = window.wp || {};

	var wpplaylistview = backbone.view.extend(/** @lends wpplaylistview.prototype */{
		/**
		 * @constructs
		 *
		 * @param {object} options          the options to create this playlist view with.
		 * @param {object} options.metadata the metadata
		 */
		initialize : function (options) {
			this.index = 0;
			this.settings = {};
			this.data = options.metadata || $.parsejson( this.$('script.wp-playlist-script').html() );
			this.playernode = this.$( this.data.type );

			this.tracks = new backbone.collection( this.data.tracks );
			this.current = this.tracks.first();

			if ( 'audio' === this.data.type ) {
				this.currenttemplate = wp.template( 'wp-playlist-current-item' );
				this.currentnode = this.$( '.wp-playlist-current-item' );
			}

			this.rendercurrent();

			if ( this.data.tracklist ) {
				this.itemtemplate = wp.template( 'wp-playlist-item' );
				this.playingclass = 'wp-playlist-playing';
				this.rendertracks();
			}

			this.playernode.attr( 'src', this.current.get( 'src' ) );

			_.bindall( this, 'bindplayer', 'bindresetplayer', 'setplayer', 'ended', 'clicktrack' );

			if ( ! _.isundefined( window._wpmejssettings ) ) {
				this.settings = _.clone( _wpmejssettings );
			}
			this.settings.success = this.bindplayer;
			this.setplayer();
		},

		bindplayer : function (mejs) {
			this.mejs = mejs;
			this.mejs.addeventlistener( 'ended', this.ended );
		},

		bindresetplayer : function (mejs) {
			this.bindplayer( mejs );
			this.playcurrentsrc();
		},

		setplayer: function (force) {
			if ( this.player ) {
				this.player.pause();
				this.player.remove();
				this.playernode = this.$( this.data.type );
			}

			if (force) {
				this.playernode.attr( 'src', this.current.get( 'src' ) );
				this.settings.success = this.bindresetplayer;
			}

			// this is also our bridge to the outside world.
			this.player = new mediaelementplayer( this.playernode.get(0), this.settings );
		},

		playcurrentsrc : function () {
			this.rendercurrent();
			this.mejs.setsrc( this.playernode.attr( 'src' ) );
			this.mejs.load();
			this.mejs.play();
		},

		rendercurrent : function () {
			var dimensions, defaultimage = 'wp-includes/images/media/video.svg';
			if ( 'video' === this.data.type ) {
				if ( this.data.images && this.current.get( 'image' ) && -1 === this.current.get( 'image' ).src.indexof( defaultimage ) ) {
					this.playernode.attr( 'poster', this.current.get( 'image' ).src );
				}
				dimensions = this.current.get( 'dimensions' );
				if ( dimensions && dimensions.resized ) {
					this.playernode.attr( dimensions.resized );
				}
			} else {
				if ( ! this.data.images ) {
					this.current.set( 'image', false );
				}
				this.currentnode.html( this.currenttemplate( this.current.tojson() ) );
			}
		},

		rendertracks : function () {
			var self = this, i = 1, tracklist = $( '<div class="wp-playlist-tracks"></div>' );
			this.tracks.each(function (model) {
				if ( ! self.data.images ) {
					model.set( 'image', false );
				}
				model.set( 'artists', self.data.artists );
				model.set( 'index', self.data.tracknumbers ? i : false );
				tracklist.append( self.itemtemplate( model.tojson() ) );
				i += 1;
			});
			this.$el.append( tracklist );

			this.$( '.wp-playlist-item' ).eq(0).addclass( this.playingclass );
		},

		events : {
			'click .wp-playlist-item' : 'clicktrack',
			'click .wp-playlist-next' : 'next',
			'click .wp-playlist-prev' : 'prev'
		},

		clicktrack : function (e) {
			e.preventdefault();

			this.index = this.$( '.wp-playlist-item' ).index( e.currenttarget );
			this.setcurrent();
		},

		ended : function () {
			if ( this.index + 1 < this.tracks.length ) {
				this.next();
			} else {
				this.index = 0;
				this.setcurrent();
			}
		},

		next : function () {
			this.index = this.index + 1 >= this.tracks.length ? 0 : this.index + 1;
			this.setcurrent();
		},

		prev : function () {
			this.index = this.index - 1 < 0 ? this.tracks.length - 1 : this.index - 1;
			this.setcurrent();
		},

		loadcurrent : function () {
			var last = this.playernode.attr( 'src' ) && this.playernode.attr( 'src' ).split('.').pop(),
				current = this.current.get( 'src' ).split('.').pop();

			this.mejs && this.mejs.pause();

			if ( last !== current ) {
				this.setplayer( true );
			} else {
				this.playernode.attr( 'src', this.current.get( 'src' ) );
				this.playcurrentsrc();
			}
		},

		setcurrent : function () {
			this.current = this.tracks.at( this.index );

			if ( this.data.tracklist ) {
				this.$( '.wp-playlist-item' )
					.removeclass( this.playingclass )
					.eq( this.index )
						.addclass( this.playingclass );
			}

			this.loadcurrent();
		}
	});

	/**
	 * initialize media playlists in the document.
	 *
	 * only initializes new playlists not previously-initialized.
	 *
	 * @since 4.9.3
	 * @return {void}
	 */
	function initialize() {
		$( '.wp-playlist:not(:has(.mejs-container))' ).each( function() {
			new wpplaylistview( { el: this } );
		} );
	}

	/**
	 * expose the api publicly on window.wp.playlist.
	 *
	 * @namespace wp.playlist
	 * @since 4.9.3
	 * @type {object}
	 */
	window.wp.playlist = {
		initialize: initialize
	};

	$( document ).ready( initialize );

	window.wpplaylistview = wpplaylistview;

}(jquery, _, backbone));






