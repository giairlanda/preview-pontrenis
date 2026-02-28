/**
 * @output wp-includes/js/wpdialog.js
 */

/*
 * wrap the jquery ui dialog open function remove focus from tinymce.
 */
( function($) {
	$.widget('wp.wpdialog', $.ui.dialog, {
		open: function() {
			// add beforeopen event.
			if ( this.isopen() || false === this._trigger('beforeopen') ) {
				return;
			}

			// open the dialog.
			this._super();

			// webkit leaves focus in the tinymce editor unless we shift focus.
			this.element.trigger('focus');
			this._trigger('refresh');
		}
	});

	$.wp.wpdialog.prototype.options.closeonescape = false;

})(jquery);




