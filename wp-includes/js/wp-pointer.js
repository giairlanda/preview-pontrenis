/**
 * @output wp-includes/js/wp-pointer.js
 */

/**
 * initializes the wp-pointer widget using jquery ui widget factory.
 */
(function($){
	var identifier = 0,
		zindex = 9999;

	$.widget('wp.pointer',/** @lends $.widget.wp.pointer.prototype */{
		options: {
			pointerclass: 'wp-pointer',
			pointerwidth: 320,
			content: function() {
				return $(this).text();
			},
			buttons: function( event, t ) {
				var button = $('<a class="close" href="#"></a>').text( wp.i18n.__( 'dismiss' ) );

				return button.on( 'click.pointer', function(e) {
					e.preventdefault();
					t.element.pointer('close');
				});
			},
			position: 'top',
			show: function( event, t ) {
				t.pointer.show();
				t.opened();
			},
			hide: function( event, t ) {
				t.pointer.hide();
				t.closed();
			},
			document: document
		},

		/**
		 * a class that represents a wordpress pointer.
		 *
		 * @since 3.3.0
		 * @private
		 *
		 * @constructs $.widget.wp.pointer
		 */
		_create: function() {
			var positioning,
				family;

			this.content = $('<div class="wp-pointer-content"></div>');
			this.arrow   = $('<div class="wp-pointer-arrow"><div class="wp-pointer-arrow-inner"></div></div>');

			family = this.element.parents().add( this.element );
			positioning = 'absolute';

			if ( family.filter(function(){ return 'fixed' === $(this).css('position'); }).length )
				positioning = 'fixed';

			this.pointer = $('<div />')
				.append( this.content )
				.append( this.arrow )
				.attr('id', 'wp-pointer-' + identifier++)
				.addclass( this.options.pointerclass )
				.css({'position': positioning, 'width': this.options.pointerwidth+'px', 'display': 'none'})
				.appendto( this.options.document.body );
		},

		/**
		 * sets an option on the pointer instance.
		 *
		 * there are 4 special values that do something extra:
		 *
		 * - `document`     will transfer the pointer to the body of the new document
		 *                  specified by the value.
		 * - `pointerclass` will change the class of the pointer element.
		 * - `position`     will reposition the pointer.
		 * - `content`      will update the content of the pointer.
		 *
		 * @since 3.3.0
		 * @private
		 *
		 * @param {string} key   the key of the option to set.
		 * @param {*}      value the value to set the option to.
		 */
		_setoption: function( key, value ) {
			var o   = this.options,
				tip = this.pointer;

			// handle document transfer.
			if ( key === 'document' && value !== o.document ) {
				tip.detach().appendto( value.body );

			// handle class change.
			} else if ( key === 'pointerclass' ) {
				tip.removeclass( o.pointerclass ).addclass( value );
			}

			// call super method.
			$.widget.prototype._setoption.apply( this, arguments );

			// reposition automatically.
			if ( key === 'position' ) {
				this.reposition();

			// update content automatically if pointer is open.
			} else if ( key === 'content' && this.active ) {
				this.update();
			}
		},

		/**
		 * removes the pointer element from of the dom.
		 *
		 * makes sure that the widget and all associated bindings are destroyed.
		 *
		 * @since 3.3.0
		 */
		destroy: function() {
			this.pointer.remove();
			$.widget.prototype.destroy.call( this );
		},

		/**
		 * returns the pointer element.
		 *
		 * @since 3.3.0
		 *
		 * @return {object} pointer the pointer object.
		 */
		widget: function() {
			return this.pointer;
		},

		/**
		 * updates the content of the pointer.
		 *
		 * this function doesn't update the content of the pointer itself. that is done
		 * by the `_update` method. this method will make sure that the `_update` method
		 * is called with the right content.
		 *
		 * the content in the options can either be a string or a callback. if it is a
		 * callback the result of this callback is used as the content.
		 *
		 * @since 3.3.0
		 *
		 * @param {object} event the event that caused the update.
		 *
		 * @return {promise} resolves when the update has been executed.
		 */
		update: function( event ) {
			var self = this,
				o    = this.options,
				dfd  = $.deferred(),
				content;

			if ( o.disabled )
				return;

			dfd.done( function( content ) {
				self._update( event, content );
			});

			// either o.content is a string...
			if ( typeof o.content === 'string' ) {
				content = o.content;

			// ...or o.content is a callback.
			} else {
				content = o.content.call( this.element[0], dfd.resolve, event, this._handoff() );
			}

			// if content is set, then complete the update.
			if ( content )
				dfd.resolve( content );

			return dfd.promise();
		},

		/**
		 * updates the content of the pointer.
		 *
		 * will make sure that the pointer is correctly positioned.
		 *
		 * @since 3.3.0
		 * @private
		 *
		 * @param {object} event   the event that caused the update.
		 * @param {*}      content the content object. either a string or a jquery tree.
		 */
		_update: function( event, content ) {
			var buttons,
				o = this.options;

			if ( ! content )
				return;

			// kill any animations on the pointer.
			this.pointer.stop();
			this.content.html( content );

			buttons = o.buttons.call( this.element[0], event, this._handoff() );
			if ( buttons ) {
				buttons.wrap('<div class="wp-pointer-buttons" />').parent().appendto( this.content );
			}

			this.reposition();
		},

		/**
		 * repositions the pointer.
		 *
		 * makes sure the pointer is the correct size for its content and makes sure it
		 * is positioned to point to the right element.
		 *
		 * @since 3.3.0
		 */
		reposition: function() {
			var position;

			if ( this.options.disabled )
				return;

			position = this._processposition( this.options.position );

			// reposition pointer.
			this.pointer.css({
				top: 0,
				left: 0,
				zindex: zindex++ // increment the z-index so that it shows above other opened pointers.
			}).show().position($.extend({
				of: this.element,
				collision: 'fit none'
			}, position )); // the object comes before this.options.position so the user can override position.of.

			this.repoint();
		},

		/**
		 * sets the arrow of the pointer to the correct side of the pointer element.
		 *
		 * @since 3.3.0
		 */
		repoint: function() {
			var o = this.options,
				edge;

			if ( o.disabled )
				return;

			edge = ( typeof o.position == 'string' ) ? o.position : o.position.edge;

			// remove arrow classes.
			this.pointer[0].classname = this.pointer[0].classname.replace( /wp-pointer-[^\s'"]*/, '' );

			// add arrow class.
			this.pointer.addclass( 'wp-pointer-' + edge );
		},

		/**
		 * calculates the correct position based on a position in the settings.
		 *
		 * @since 3.3.0
		 * @private
		 *
		 * @param {string|object} position either a side of a pointer or an object
		 *                                 containing a pointer.
		 *
		 * @return {object} result  an object containing position related data.
		 */
		_processposition: function( position ) {
			var opposite = {
					top: 'bottom',
					bottom: 'top',
					left: 'right',
					right: 'left'
				},
				result;

			// if the position object is a string, it is shorthand for position.edge.
			if ( typeof position == 'string' ) {
				result = {
					edge: position + ''
				};
			} else {
				result = $.extend( {}, position );
			}

			if ( ! result.edge )
				return result;

			if ( result.edge == 'top' || result.edge == 'bottom' ) {
				result.align = result.align || 'left';

				result.at = result.at || result.align + ' ' + opposite[ result.edge ];
				result.my = result.my || result.align + ' ' + result.edge;
			} else {
				result.align = result.align || 'top';

				result.at = result.at || opposite[ result.edge ] + ' ' + result.align;
				result.my = result.my || result.edge + ' ' + result.align;
			}

			return result;
		},

		/**
		 * opens the pointer.
		 *
		 * only opens the pointer widget in case it is closed and not disabled, and
		 * calls 'update' before doing so. calling update makes sure that the pointer
		 * is correctly sized and positioned.
		 *
		 * @since 3.3.0
		 *
		 * @param {object} event the event that triggered the opening of this pointer.
		 */
		open: function( event ) {
			var self = this,
				o    = this.options;

			if ( this.active || o.disabled || this.element.is(':hidden') )
				return;

			this.update().done( function() {
				self._open( event );
			});
		},

		/**
		 * opens and shows the pointer element.
		 *
		 * @since 3.3.0
		 * @private
		 *
		 * @param {object} event an event object.
		 */
		_open: function( event ) {
			var self = this,
				o    = this.options;

			if ( this.active || o.disabled || this.element.is(':hidden') )
				return;

			this.active = true;

			this._trigger( 'open', event, this._handoff() );

			this._trigger( 'show', event, this._handoff({
				opened: function() {
					self._trigger( 'opened', event, self._handoff() );
				}
			}));
		},

		/**
		 * closes and hides the pointer element.
		 *
		 * @since 3.3.0
		 *
		 * @param {object} event an event object.
		 */
		close: function( event ) {
			if ( !this.active || this.options.disabled )
				return;

			var self = this;
			this.active = false;

			this._trigger( 'close', event, this._handoff() );
			this._trigger( 'hide', event, this._handoff({
				closed: function() {
					self._trigger( 'closed', event, self._handoff() );
				}
			}));
		},

		/**
		 * puts the pointer on top by increasing the z-index.
		 *
		 * @since 3.3.0
		 */
		sendtotop: function() {
			if ( this.active )
				this.pointer.css( 'z-index', zindex++ );
		},

		/**
		 * toggles the element between shown and hidden.
		 *
		 * @since 3.3.0
		 *
		 * @param {object} event an event object.
		 */
		toggle: function( event ) {
			if ( this.pointer.is(':hidden') )
				this.open( event );
			else
				this.close( event );
		},

		/**
		 * extends the pointer and the widget element with the supplied parameter, which
		 * is either an element or a function.
		 *
		 * @since 3.3.0
		 * @private
		 *
		 * @param {object} extend the object to be merged into the original object.
		 *
		 * @return {object} the extended object.
		 */
		_handoff: function( extend ) {
			return $.extend({
				pointer: this.pointer,
				element: this.element
			}, extend);
		}
	});
})(jquery);





