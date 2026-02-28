
/*
 * quicktags
 *
 * this is the html editor in wordpress. it can be attached to any textarea and will
 * append a toolbar above it. this script is self-contained (does not require external libraries).
 *
 * run quicktags(settings) to initialize it, where settings is an object containing up to 3 properties:
 * settings = {
 *   id : 'my_id',          the html id of the textarea, required
 *   buttons: ''            comma separated list of the names of the default buttons to show. optional.
 *                          current list of default button names: 'strong,em,link,block,del,ins,img,ul,ol,li,code,more,close';
 * }
 *
 * the settings can also be a string quicktags_id.
 *
 * quicktags_id string the id of the textarea that will be the editor canvas
 * buttons string comma separated list of the default buttons names that will be shown in that instance.
 *
 * @output wp-includes/js/quicktags.js
 */

// new edit toolbar used with permission
// by alex king
// http://www.alexking.org/

/* global adminpage, wpactiveeditor, quicktagsl10n, wplink, prompt, edbuttons */

window.edbuttons = [];

/* jshint ignore:start */

/**
 * back-compat
 *
 * define all former global functions so plugins that hack quicktags.js directly don't cause fatal errors.
 */
window.edaddtag = function(){};
window.edcheckopentags = function(){};
window.edclosealltags = function(){};
window.edinsertimage = function(){};
window.edinsertlink = function(){};
window.edinserttag = function(){};
window.edlink = function(){};
window.edquicklink = function(){};
window.edremovetag = function(){};
window.edshowbutton = function(){};
window.edshowlinks = function(){};
window.edspell = function(){};
window.edtoolbar = function(){};

/* jshint ignore:end */

(function(){
	// private stuff is prefixed with an underscore.
	var _domready = function(func) {
		var t, i, domcontentloaded, _tryready;

		if ( typeof jquery !== 'undefined' ) {
			jquery( func );
		} else {
			t = _domready;
			t.funcs = [];

			t.ready = function() {
				if ( ! t.isready ) {
					t.isready = true;
					for ( i = 0; i < t.funcs.length; i++ ) {
						t.funcs[i]();
					}
				}
			};

			if ( t.isready ) {
				func();
			} else {
				t.funcs.push(func);
			}

			if ( ! t.eventattached ) {
				if ( document.addeventlistener ) {
					domcontentloaded = function(){document.removeeventlistener('domcontentloaded', domcontentloaded, false);t.ready();};
					document.addeventlistener('domcontentloaded', domcontentloaded, false);
					window.addeventlistener('load', t.ready, false);
				} else if ( document.attachevent ) {
					domcontentloaded = function(){if (document.readystate === 'complete'){ document.detachevent('onreadystatechange', domcontentloaded);t.ready();}};
					document.attachevent('onreadystatechange', domcontentloaded);
					window.attachevent('onload', t.ready);

					_tryready = function() {
						try {
							document.documentelement.doscroll('left');
						} catch(e) {
							settimeout(_tryready, 50);
							return;
						}

						t.ready();
					};
					_tryready();
				}

				t.eventattached = true;
			}
		}
	},

	_datetime = (function() {
		var now = new date(), zeroise;

		zeroise = function(number) {
			var str = number.tostring();

			if ( str.length < 2 ) {
				str = '0' + str;
			}

			return str;
		};

		return now.getutcfullyear() + '-' +
			zeroise( now.getutcmonth() + 1 ) + '-' +
			zeroise( now.getutcdate() ) + 't' +
			zeroise( now.getutchours() ) + ':' +
			zeroise( now.getutcminutes() ) + ':' +
			zeroise( now.getutcseconds() ) +
			'+00:00';
	})();

	var qt = window.qtags = function(settings) {
		if ( typeof(settings) === 'string' ) {
			settings = {id: settings};
		} else if ( typeof(settings) !== 'object' ) {
			return false;
		}

		var t = this,
			id = settings.id,
			canvas = document.getelementbyid(id),
			name = 'qt_' + id,
			tb, onclick, toolbar_id, wrap, setactiveeditor;

		if ( !id || !canvas ) {
			return false;
		}

		t.name = name;
		t.id = id;
		t.canvas = canvas;
		t.settings = settings;

		if ( id === 'content' && typeof(adminpage) === 'string' && ( adminpage === 'post-new-php' || adminpage === 'post-php' ) ) {
			// back compat hack :-(
			window.edcanvas = canvas;
			toolbar_id = 'ed_toolbar';
		} else {
			toolbar_id = name + '_toolbar';
		}

		tb = document.getelementbyid( toolbar_id );

		if ( ! tb ) {
			tb = document.createelement('div');
			tb.id = toolbar_id;
			tb.classname = 'quicktags-toolbar';
		}

		canvas.parentnode.insertbefore(tb, canvas);
		t.toolbar = tb;

		// listen for click events.
		onclick = function(e) {
			e = e || window.event;
			var target = e.target || e.srcelement, visible = target.clientwidth || target.offsetwidth, i;

			// don't call the callback on pressing the accesskey when the button is not visible.
			if ( !visible ) {
				return;
			}

			// as long as it has the class ed_button, execute the callback.
			if ( / ed_button /.test(' ' + target.classname + ' ') ) {
				// we have to reassign canvas here.
				t.canvas = canvas = document.getelementbyid(id);
				i = target.id.replace(name + '_', '');

				if ( t.thebuttons[i] ) {
					t.thebuttons[i].callback.call(t.thebuttons[i], target, canvas, t);
				}
			}
		};

		setactiveeditor = function() {
			window.wpactiveeditor = id;
		};

		wrap = document.getelementbyid( 'wp-' + id + '-wrap' );

		if ( tb.addeventlistener ) {
			tb.addeventlistener( 'click', onclick, false );

			if ( wrap ) {
				wrap.addeventlistener( 'click', setactiveeditor, false );
			}
		} else if ( tb.attachevent ) {
			tb.attachevent( 'onclick', onclick );

			if ( wrap ) {
				wrap.attachevent( 'onclick', setactiveeditor );
			}
		}

		t.getbutton = function(id) {
			return t.thebuttons[id];
		};

		t.getbuttonelement = function(id) {
			return document.getelementbyid(name + '_' + id);
		};

		t.init = function() {
			_domready( function(){ qt._buttonsinit( id ); } );
		};

		t.remove = function() {
			delete qt.instances[id];

			if ( tb && tb.parentnode ) {
				tb.parentnode.removechild( tb );
			}
		};

		qt.instances[id] = t;
		t.init();
	};

	function _escape( text ) {
		text = text || '';
		text = text.replace( /&([^#])(?![a-z1-4]{1,8};)/gi, '&#038;$1' );
		return text.replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' ).replace( /'/g, '&#039;' );
	}

	qt.instances = {};

	qt.getinstance = function(id) {
		return qt.instances[id];
	};

	qt._buttonsinit = function( id ) {
		var t = this;

		function _init( instanceid ) {
			var canvas, name, settings, thebuttons, html, ed, id, i, use,
				defaults = ',strong,em,link,block,del,ins,img,ul,ol,li,code,more,close,';

			ed = t.instances[instanceid];
			canvas = ed.canvas;
			name = ed.name;
			settings = ed.settings;
			html = '';
			thebuttons = {};
			use = '';

			// set buttons.
			if ( settings.buttons ) {
				use = ','+settings.buttons+',';
			}

			for ( i in edbuttons ) {
				if ( ! edbuttons[i] ) {
					continue;
				}

				id = edbuttons[i].id;
				if ( use && defaults.indexof( ',' + id + ',' ) !== -1 && use.indexof( ',' + id + ',' ) === -1 ) {
					continue;
				}

				if ( ! edbuttons[i].instance || edbuttons[i].instance === instanceid ) {
					thebuttons[id] = edbuttons[i];

					if ( edbuttons[i].html ) {
						html += edbuttons[i].html( name + '_' );
					}
				}
			}

			if ( use && use.indexof(',dfw,') !== -1 ) {
				thebuttons.dfw = new qt.dfwbutton();
				html += thebuttons.dfw.html( name + '_' );
			}

			if ( 'rtl' === document.getelementsbytagname( 'html' )[0].dir ) {
				thebuttons.textdirection = new qt.textdirectionbutton();
				html += thebuttons.textdirection.html( name + '_' );
			}

			ed.toolbar.innerhtml = html;
			ed.thebuttons = thebuttons;

			if ( typeof jquery !== 'undefined' ) {
				jquery( document ).triggerhandler( 'quicktags-init', [ ed ] );
			}
		}

		if ( id ) {
			_init( id );
		} else {
			for ( id in t.instances ) {
				_init( id );
			}
		}

		t.buttonsinitdone = true;
	};

	/**
	 * main api function for adding a button to quicktags
	 *
	 * adds qt.button or qt.tagbutton depending on the args. the first three args are always required.
	 * to be able to add button(s) to quicktags, your script should be enqueued as dependent
	 * on "quicktags" and outputted in the footer. if you are echoing js directly from php,
	 * use add_action( 'admin_print_footer_scripts', 'output_my_js', 100 ) or add_action( 'wp_footer', 'output_my_js', 100 )
	 *
	 * minimum required to add a button that calls an external function:
	 *     qtags.addbutton( 'my_id', 'my button', my_callback );
	 *     function my_callback() { alert('yeah!'); }
	 *
	 * minimum required to add a button that inserts a tag:
	 *     qtags.addbutton( 'my_id', 'my button', '<span>', '</span>' );
	 *     qtags.addbutton( 'my_id2', 'my button', '<br />' );
	 *
	 * @param string id required. button html id
	 * @param string display required. button's value="..."
	 * @param string|function arg1 required. either a starting tag to be inserted like "<span>" or a callback that is executed when the button is clicked.
	 * @param string arg2 optional. ending tag like "</span>"
	 * @param string access_key deprecated not used
	 * @param string title optional. button's title="..."
	 * @param int priority optional. number representing the desired position of the button in the toolbar. 1 - 9 = first, 11 - 19 = second, 21 - 29 = third, etc.
	 * @param string instance optional. limit the button to a specific instance of quicktags, add to all instances if not present.
	 * @param attr object optional. used to pass additional attributes. currently supports `arialabel` and `arialabelclose` (for "close tag" state)
	 * @return mixed null or the button object that is needed for back-compat.
	 */
	qt.addbutton = function( id, display, arg1, arg2, access_key, title, priority, instance, attr ) {
		var btn;

		if ( !id || !display ) {
			return;
		}

		priority = priority || 0;
		arg2 = arg2 || '';
		attr = attr || {};

		if ( typeof(arg1) === 'function' ) {
			btn = new qt.button( id, display, access_key, title, instance, attr );
			btn.callback = arg1;
		} else if ( typeof(arg1) === 'string' ) {
			btn = new qt.tagbutton( id, display, arg1, arg2, access_key, title, instance, attr );
		} else {
			return;
		}

		if ( priority === -1 ) { // back-compat.
			return btn;
		}

		if ( priority > 0 ) {
			while ( typeof(edbuttons[priority]) !== 'undefined' ) {
				priority++;
			}

			edbuttons[priority] = btn;
		} else {
			edbuttons[edbuttons.length] = btn;
		}

		if ( this.buttonsinitdone ) {
			this._buttonsinit(); // add the button html to all instances toolbars if addbutton() was called too late.
		}
	};

	qt.insertcontent = function(content) {
		var sel, startpos, endpos, scrolltop, text, canvas = document.getelementbyid(wpactiveeditor), event;

		if ( !canvas ) {
			return false;
		}

		if ( document.selection ) { // ie.
			canvas.focus();
			sel = document.selection.createrange();
			sel.text = content;
			canvas.focus();
		} else if ( canvas.selectionstart || canvas.selectionstart === 0 ) { // ff, webkit, opera.
			text = canvas.value;
			startpos = canvas.selectionstart;
			endpos = canvas.selectionend;
			scrolltop = canvas.scrolltop;

			canvas.value = text.substring(0, startpos) + content + text.substring(endpos, text.length);

			canvas.selectionstart = startpos + content.length;
			canvas.selectionend = startpos + content.length;
			canvas.scrolltop = scrolltop;
			canvas.focus();
		} else {
			canvas.value += content;
			canvas.focus();
		}

		if ( document.createevent ) {
			event = document.createevent( 'htmlevents' );
			event.initevent( 'change', false, true );
			canvas.dispatchevent( event );
		} else if ( canvas.fireevent ) {
			canvas.fireevent( 'onchange' );
		}

		return true;
	};

	// a plain, dumb button.
	qt.button = function( id, display, access, title, instance, attr ) {
		this.id = id;
		this.display = display;
		this.access = '';
		this.title = title || '';
		this.instance = instance || '';
		this.attr = attr || {};
	};
	qt.button.prototype.html = function(idprefix) {
		var active, on, wp,
			title = this.title ? ' title="' + _escape( this.title ) + '"' : '',
			arialabel = this.attr && this.attr.arialabel ? ' aria-label="' + _escape( this.attr.arialabel ) + '"' : '',
			val = this.display ? ' value="' + _escape( this.display ) + '"' : '',
			id = this.id ? ' id="' + _escape( idprefix + this.id ) + '"' : '',
			dfw = ( wp = window.wp ) && wp.editor && wp.editor.dfw;

		if ( this.id === 'fullscreen' ) {
			return '<button type="button"' + id + ' class="ed_button qt-dfw qt-fullscreen"' + title + arialabel + '></button>';
		} else if ( this.id === 'dfw' ) {
			active = dfw && dfw.isactive() ? '' : ' disabled="disabled"';
			on = dfw && dfw.ison() ? ' active' : '';

			return '<button type="button"' + id + ' class="ed_button qt-dfw' + on + '"' + title + arialabel + active + '></button>';
		}

		return '<input type="button"' + id + ' class="ed_button button button-small"' + title + arialabel + val + ' />';
	};
	qt.button.prototype.callback = function(){};

	// a button that inserts html tag.
	qt.tagbutton = function( id, display, tagstart, tagend, access, title, instance, attr ) {
		var t = this;
		qt.button.call( t, id, display, access, title, instance, attr );
		t.tagstart = tagstart;
		t.tagend = tagend;
	};
	qt.tagbutton.prototype = new qt.button();
	qt.tagbutton.prototype.opentag = function( element, ed ) {
		if ( ! ed.opentags ) {
			ed.opentags = [];
		}

		if ( this.tagend ) {
			ed.opentags.push( this.id );
			element.value = '/' + element.value;

			if ( this.attr.arialabelclose ) {
				element.setattribute( 'aria-label', this.attr.arialabelclose );
			}
		}
	};
	qt.tagbutton.prototype.closetag = function( element, ed ) {
		var i = this.isopen(ed);

		if ( i !== false ) {
			ed.opentags.splice( i, 1 );
		}

		element.value = this.display;

		if ( this.attr.arialabel ) {
			element.setattribute( 'aria-label', this.attr.arialabel );
		}
	};
	// whether a tag is open or not. returns false if not open, or current open depth of the tag.
	qt.tagbutton.prototype.isopen = function (ed) {
		var t = this, i = 0, ret = false;
		if ( ed.opentags ) {
			while ( ret === false && i < ed.opentags.length ) {
				ret = ed.opentags[i] === t.id ? i : false;
				i ++;
			}
		} else {
			ret = false;
		}
		return ret;
	};
	qt.tagbutton.prototype.callback = function(element, canvas, ed) {
		var t = this, startpos, endpos, cursorpos, scrolltop, v = canvas.value, l, r, i, sel, endtag = v ? t.tagend : '', event;

		if ( document.selection ) { // ie.
			canvas.focus();
			sel = document.selection.createrange();
			if ( sel.text.length > 0 ) {
				if ( !t.tagend ) {
					sel.text = sel.text + t.tagstart;
				} else {
					sel.text = t.tagstart + sel.text + endtag;
				}
			} else {
				if ( !t.tagend ) {
					sel.text = t.tagstart;
				} else if ( t.isopen(ed) === false ) {
					sel.text = t.tagstart;
					t.opentag(element, ed);
				} else {
					sel.text = endtag;
					t.closetag(element, ed);
				}
			}
			canvas.focus();
		} else if ( canvas.selectionstart || canvas.selectionstart === 0 ) { // ff, webkit, opera.
			startpos = canvas.selectionstart;
			endpos = canvas.selectionend;

			if ( startpos < endpos && v.charat( endpos - 1 ) === '\n' ) {
				endpos -= 1;
			}

			cursorpos = endpos;
			scrolltop = canvas.scrolltop;
			l = v.substring(0, startpos);      // left of the selection.
			r = v.substring(endpos, v.length); // right of the selection.
			i = v.substring(startpos, endpos); // inside the selection.
			if ( startpos !== endpos ) {
				if ( !t.tagend ) {
					canvas.value = l + i + t.tagstart + r; // insert self-closing tags after the selection.
					cursorpos += t.tagstart.length;
				} else {
					canvas.value = l + t.tagstart + i + endtag + r;
					cursorpos += t.tagstart.length + endtag.length;
				}
			} else {
				if ( !t.tagend ) {
					canvas.value = l + t.tagstart + r;
					cursorpos = startpos + t.tagstart.length;
				} else if ( t.isopen(ed) === false ) {
					canvas.value = l + t.tagstart + r;
					t.opentag(element, ed);
					cursorpos = startpos + t.tagstart.length;
				} else {
					canvas.value = l + endtag + r;
					cursorpos = startpos + endtag.length;
					t.closetag(element, ed);
				}
			}

			canvas.selectionstart = cursorpos;
			canvas.selectionend = cursorpos;
			canvas.scrolltop = scrolltop;
			canvas.focus();
		} else { // other browsers?
			if ( !endtag ) {
				canvas.value += t.tagstart;
			} else if ( t.isopen(ed) !== false ) {
				canvas.value += t.tagstart;
				t.opentag(element, ed);
			} else {
				canvas.value += endtag;
				t.closetag(element, ed);
			}
			canvas.focus();
		}

		if ( document.createevent ) {
			event = document.createevent( 'htmlevents' );
			event.initevent( 'change', false, true );
			canvas.dispatchevent( event );
		} else if ( canvas.fireevent ) {
			canvas.fireevent( 'onchange' );
		}
	};

	// removed.
	qt.spellbutton = function() {};

	// the close tags button.
	qt.closebutton = function() {
		qt.button.call( this, 'close', quicktagsl10n.closetags, '', quicktagsl10n.closeallopentags );
	};

	qt.closebutton.prototype = new qt.button();

	qt._close = function(e, c, ed) {
		var button, element, tbo = ed.opentags;

		if ( tbo ) {
			while ( tbo.length > 0 ) {
				button = ed.getbutton(tbo[tbo.length - 1]);
				element = document.getelementbyid(ed.name + '_' + button.id);

				if ( e ) {
					button.callback.call(button, element, c, ed);
				} else {
					button.closetag(element, ed);
				}
			}
		}
	};

	qt.closebutton.prototype.callback = qt._close;

	qt.closealltags = function( editor_id ) {
		var ed = this.getinstance( editor_id );

		if ( ed ) {
			qt._close( '', ed.canvas, ed );
		}
	};

	// the link button.
	qt.linkbutton = function() {
		var attr = {
			arialabel: quicktagsl10n.link
		};

		qt.tagbutton.call( this, 'link', 'link', '', '</a>', '', '', '', attr );
	};
	qt.linkbutton.prototype = new qt.tagbutton();
	qt.linkbutton.prototype.callback = function(e, c, ed, defaultvalue) {
		var url, t = this;

		if ( typeof wplink !== 'undefined' ) {
			wplink.open( ed.id );
			return;
		}

		if ( ! defaultvalue ) {
			defaultvalue = 'http://';
		}

		if ( t.isopen(ed) === false ) {
			url = prompt( quicktagsl10n.enterurl, defaultvalue );
			if ( url ) {
				t.tagstart = '<a href="' + url + '">';
				qt.tagbutton.prototype.callback.call(t, e, c, ed);
			}
		} else {
			qt.tagbutton.prototype.callback.call(t, e, c, ed);
		}
	};

	// the img button.
	qt.imgbutton = function() {
		var attr = {
			arialabel: quicktagsl10n.image
		};

		qt.tagbutton.call( this, 'img', 'img', '', '', '', '', '', attr );
	};
	qt.imgbutton.prototype = new qt.tagbutton();
	qt.imgbutton.prototype.callback = function(e, c, ed, defaultvalue) {
		if ( ! defaultvalue ) {
			defaultvalue = 'http://';
		}
		var src = prompt(quicktagsl10n.enterimageurl, defaultvalue), alt;
		if ( src ) {
			alt = prompt(quicktagsl10n.enterimagedescription, '');
			this.tagstart = '<img src="' + src + '" alt="' + alt + '" />';
			qt.tagbutton.prototype.callback.call(this, e, c, ed);
		}
	};

	qt.dfwbutton = function() {
		qt.button.call( this, 'dfw', '', 'f', quicktagsl10n.dfw );
	};
	qt.dfwbutton.prototype = new qt.button();
	qt.dfwbutton.prototype.callback = function() {
		var wp;

		if ( ! ( wp = window.wp ) || ! wp.editor || ! wp.editor.dfw ) {
			return;
		}

		window.wp.editor.dfw.toggle();
	};

	qt.textdirectionbutton = function() {
		qt.button.call( this, 'textdirection', quicktagsl10n.textdirection, '', quicktagsl10n.toggletextdirection );
	};
	qt.textdirectionbutton.prototype = new qt.button();
	qt.textdirectionbutton.prototype.callback = function(e, c) {
		var isrtl = ( 'rtl' === document.getelementsbytagname('html')[0].dir ),
			currentdirection = c.style.direction;

		if ( ! currentdirection ) {
			currentdirection = ( isrtl ) ? 'rtl' : 'ltr';
		}

		c.style.direction = ( 'rtl' === currentdirection ) ? 'ltr' : 'rtl';
		c.focus();
	};

	// ensure backward compatibility.
	edbuttons[10]  = new qt.tagbutton( 'strong', 'b', '<strong>', '</strong>', '', '', '', { arialabel: quicktagsl10n.strong, arialabelclose: quicktagsl10n.strongclose } );
	edbuttons[20]  = new qt.tagbutton( 'em', 'i', '<em>', '</em>', '', '', '', { arialabel: quicktagsl10n.em, arialabelclose: quicktagsl10n.emclose } );
	edbuttons[30]  = new qt.linkbutton(); // special case.
	edbuttons[40]  = new qt.tagbutton( 'block', 'b-quote', '\n\n<blockquote>', '</blockquote>\n\n', '', '', '', { arialabel: quicktagsl10n.blockquote, arialabelclose: quicktagsl10n.blockquoteclose } );
	edbuttons[50]  = new qt.tagbutton( 'del', 'del', '<del datetime="' + _datetime + '">', '</del>', '', '', '', { arialabel: quicktagsl10n.del, arialabelclose: quicktagsl10n.delclose } );
	edbuttons[60]  = new qt.tagbutton( 'ins', 'ins', '<ins datetime="' + _datetime + '">', '</ins>', '', '', '', { arialabel: quicktagsl10n.ins, arialabelclose: quicktagsl10n.insclose } );
	edbuttons[70]  = new qt.imgbutton();  // special case.
	edbuttons[80]  = new qt.tagbutton( 'ul', 'ul', '<ul>\n', '</ul>\n\n', '', '', '', { arialabel: quicktagsl10n.ul, arialabelclose: quicktagsl10n.ulclose } );
	edbuttons[90]  = new qt.tagbutton( 'ol', 'ol', '<ol>\n', '</ol>\n\n', '', '', '', { arialabel: quicktagsl10n.ol, arialabelclose: quicktagsl10n.olclose } );
	edbuttons[100] = new qt.tagbutton( 'li', 'li', '\t<li>', '</li>\n', '', '', '', { arialabel: quicktagsl10n.li, arialabelclose: quicktagsl10n.liclose } );
	edbuttons[110] = new qt.tagbutton( 'code', 'code', '<code>', '</code>', '', '', '', { arialabel: quicktagsl10n.code, arialabelclose: quicktagsl10n.codeclose } );
	edbuttons[120] = new qt.tagbutton( 'more', 'more', '<!--more-->\n\n', '', '', '', '', { arialabel: quicktagsl10n.more } );
	edbuttons[140] = new qt.closebutton();

})();

/**
 * initialize new instance of the quicktags editor
 */
window.quicktags = function(settings) {
	return new window.qtags(settings);
};

/**
 * inserts content at the caret in the active editor (textarea)
 *
 * added for back compatibility
 * @see qtags.insertcontent()
 */
window.edinsertcontent = function(bah, txt) {
	return window.qtags.insertcontent(txt);
};

/**
 * adds a button to all instances of the editor
 *
 * added for back compatibility, use qtags.addbutton() as it gives more flexibility like type of button, button placement, etc.
 * @see qtags.addbutton()
 */
window.edbutton = function(id, display, tagstart, tagend, access) {
	return window.qtags.addbutton( id, display, tagstart, tagend, access, '', -1 );
};





