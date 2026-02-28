/* global console, mediaelementplayer, mejs */
(function ( window, $ ) {
	// reintegrate `plugins` since they don't exist in mejs anymore; it won't affect anything in the player
	if (mejs.plugins === undefined) {
		mejs.plugins = {};
		mejs.plugins.silverlight = [];
		mejs.plugins.silverlight.push({
			types: []
		});
	}

	// inclusion of old `htmlmediaelementshim` if it doesn't exist
	mejs.htmlmediaelementshim = mejs.htmlmediaelementshim || {
		gettypefromfile: mejs.utils.gettypefromfile
	};

	// add missing global variables for backward compatibility
	if (mejs.mediafeatures === undefined) {
		mejs.mediafeatures = mejs.features;
	}
	if (mejs.utility === undefined) {
		mejs.utility = mejs.utils;
	}

	/**
	 * create missing variables and have default `classprefix` overridden to avoid issues.
	 *
	 * `media` is now a fake wrapper needed to simplify manipulation of various media types,
	 * so in order to access the `video` or `audio` tag, use `media.originalnode` or `player.node`;
	 * `player.container` used to be jquery but now is a html element, and many elements inside
	 * the player rely on it being a html now, so its conversion is difficult; however, a
	 * `player.$container` new variable has been added to be used as jquery object
	 */
	var init = mediaelementplayer.prototype.init;
	mediaelementplayer.prototype.init = function () {
		this.options.classprefix = 'mejs-';
		this.$media = this.$node = $( this.node );
		init.call( this );
	};

	var ready = mediaelementplayer.prototype._meready;
	mediaelementplayer.prototype._meready = function () {
		this.container = $( this.container) ;
		this.controls = $( this.controls );
		this.layers = $( this.layers );
		ready.apply( this, arguments );
	};

	// override method so certain elements can be called with jquery
	mediaelementplayer.prototype.getelement = function ( el ) {
		return $ !== undefined && el instanceof $ ? el[0] : el;
	};

	// add jquery only to most of custom features' arguments for backward compatibility; default features rely 100%
	// on the arguments being html elements to work properly
	mediaelementplayer.prototype.buildfeatures = function ( player, controls, layers, media ) {
		var defaultfeatures = [
			'playpause',
			'current',
			'progress',
			'duration',
			'tracks',
			'volume',
			'fullscreen'
		];
		for (var i = 0, total = this.options.features.length; i < total; i++) {
			var feature = this.options.features[i];
			if (this['build' + feature]) {
				try {
					// use jquery for non-default features
					if (defaultfeatures.indexof(feature) === -1) {
						this['build' + feature]( player, $(controls), $(layers), media );
					} else {
						this['build' + feature]( player, controls, layers, media );
					}

				} catch (e) {
					console.error( 'error building ' + feature, e );
				}
			}
		}
	};

})( window, jquery );





