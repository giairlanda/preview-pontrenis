/* global tinymce */
/**
 * included for back-compat.
 * the default windowmanager in tinymce 4.0 supports three types of dialogs:
 *	- with html created from js.
 *	- with inline html (like wpwindowmanager).
 *	- old type iframe based dialogs.
 * for examples see the default plugins: https://github.com/tinymce/tinymce/tree/master/js/tinymce/plugins
 */
tinymce.wpwindowmanager = tinymce.inlinewindowmanager = function( editor ) {
	if ( this.wp ) {
		return this;
	}

	this.wp = {};
	this.parent = editor.windowmanager;
	this.editor = editor;

	tinymce.extend( this, this.parent );

	this.open = function( args, params ) {
		var $element,
			self = this,
			wp = this.wp;

		if ( ! args.wpdialog ) {
			return this.parent.open.apply( this, arguments );
		} else if ( ! args.id ) {
			return;
		}

		if ( typeof jquery === 'undefined' || ! jquery.wp || ! jquery.wp.wpdialog ) {
			// wpdialog.js is not loaded.
			if ( window.console && window.console.error ) {
				window.console.error('wpdialog.js is not loaded. please set "wpdialogs" as dependency for your script when calling wp_enqueue_script(). you may also want to enqueue the "wp-jquery-ui-dialog" stylesheet.');
			}

			return;
		}

		wp.$element = $element = jquery( '#' + args.id );

		if ( ! $element.length ) {
			return;
		}

		if ( window.console && window.console.log ) {
			window.console.log('tinymce.wpwindowmanager is deprecated. use the default editor.windowmanager to open dialogs with inline html.');
		}

		wp.features = args;
		wp.params = params;

		// store selection. takes a snapshot in the focusmanager of the selection before focus is moved to the dialog.
		editor.nodechanged();

		// create the dialog if necessary.
		if ( ! $element.data('wpdialog') ) {
			$element.wpdialog({
				title: args.title,
				width: args.width,
				height: args.height,
				modal: true,
				dialogclass: 'wp-dialog',
				zindex: 300000
			});
		}

		$element.wpdialog('open');

		$element.on( 'wpdialogclose', function() {
			if ( self.wp.$element ) {
				self.wp = {};
			}
		});
	};

	this.close = function() {
		if ( ! this.wp.features || ! this.wp.features.wpdialog ) {
			return this.parent.close.apply( this, arguments );
		}

		this.wp.$element.wpdialog('close');
	};
};

tinymce.pluginmanager.add( 'wpdialogs', function( editor ) {
	// replace window manager.
	editor.on( 'init', function() {
		editor.windowmanager = new tinymce.wpwindowmanager( editor );
	});
});




