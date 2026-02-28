/**
 * tinymce_mce_popup.js
 *
 * released under lgpl license.
 * copyright (c) 1999-2017 ephox corp. all rights reserved
 *
 * license: http://www.tinymce.com/license
 * contributing: http://www.tinymce.com/contributing
 */

var tinymce, tinymce;

/**
 * tinymce popup/dialog helper class. this gives you easy access to the
 * parent editor instance and a bunch of other things. it's higly recommended
 * that you load this script into your dialogs.
 *
 * @static
 * @class tinymcepopup
 */
var tinymcepopup = {
  /**
   * initializes the popup this will be called automatically.
   *
   * @method init
   */
  init: function () {
    var self = this, parentwin, settings, uiwindow;

    // find window & api
    parentwin = self.getwin();
    tinymce = tinymce = parentwin.tinymce;
    self.editor = tinymce.editormanager.activeeditor;
    self.params = self.editor.windowmanager.getparams();

    uiwindow = self.editor.windowmanager.windows[self.editor.windowmanager.windows.length - 1];
    self.features = uiwindow.features;
    self.uiwindow = uiwindow;

    settings = self.editor.settings;

    // setup popup css path(s)
    if (settings.popup_css !== false) {
      if (settings.popup_css) {
        settings.popup_css = self.editor.documentbaseuri.toabsolute(settings.popup_css);
      } else {
        settings.popup_css = self.editor.baseuri.toabsolute("plugins/compat3x/css/dialog.css");
      }
    }

    if (settings.popup_css_add) {
      settings.popup_css += ',' + self.editor.documentbaseuri.toabsolute(settings.popup_css_add);
    }

    // setup local dom
    self.dom = self.editor.windowmanager.createinstance('tinymce.dom.domutils', document, {
      ownevents: true,
      proxy: tinymcepopup._eventproxy
    });

    self.dom.bind(window, 'ready', self._ondomloaded, self);

    // enables you to skip loading the default css
    if (self.features.popup_css !== false) {
      self.dom.loadcss(self.features.popup_css || self.editor.settings.popup_css);
    }

    // setup on init listeners
    self.listeners = [];

    /**
     * fires when the popup is initialized.
     *
     * @event oninit
     * @param {tinymce.editor} editor editor instance.
     * @example
     * // alerts the selected contents when the dialog is loaded
     * tinymcepopup.oninit.add(function(ed) {
     *     alert(ed.selection.getcontent());
     * });
     *
     * // executes the init method on page load in some object using the someobject scope
     * tinymcepopup.oninit.add(someobject.init, someobject);
     */
    self.oninit = {
      add: function (func, scope) {
        self.listeners.push({ func: func, scope: scope });
      }
    };

    self.iswindow = !self.getwindowarg('mce_inline');
    self.id = self.getwindowarg('mce_window_id');
  },

  /**
   * returns the reference to the parent window that opened the dialog.
   *
   * @method getwin
   * @return {window} reference to the parent window that opened the dialog.
   */
  getwin: function () {
    // added frameelement check to fix bug: #2817583
    return (!window.frameelement && window.dialogarguments) || opener || parent || top;
  },

  /**
   * returns a window argument/parameter by name.
   *
   * @method getwindowarg
   * @param {string} name name of the window argument to retrieve.
   * @param {string} defaultvalue optional default value to return.
   * @return {string} argument value or default value if it wasn't found.
   */
  getwindowarg: function (name, defaultvalue) {
    var value = this.params[name];

    return tinymce.is(value) ? value : defaultvalue;
  },

  /**
   * returns a editor parameter/config option value.
   *
   * @method getparam
   * @param {string} name name of the editor config option to retrieve.
   * @param {string} defaultvalue optional default value to return.
   * @return {string} parameter value or default value if it wasn't found.
   */
  getparam: function (name, defaultvalue) {
    return this.editor.getparam(name, defaultvalue);
  },

  /**
   * returns a language item by key.
   *
   * @method getlang
   * @param {string} name language item like mydialog.something.
   * @param {string} defaultvalue optional default value to return.
   * @return {string} language value for the item like "my string" or the default value if it wasn't found.
   */
  getlang: function (name, defaultvalue) {
    return this.editor.getlang(name, defaultvalue);
  },

  /**
   * executed a command on editor that opened the dialog/popup.
   *
   * @method execcommand
   * @param {string} cmd command to execute.
   * @param {boolean} ui optional boolean value if the ui for the command should be presented or not.
   * @param {object} val optional value to pass with the comman like an url.
   * @param {object} a optional arguments object.
   */
  execcommand: function (cmd, ui, val, args) {
    args = args || {};
    args.skip_focus = 1;

    this.restoreselection();
    return this.editor.execcommand(cmd, ui, val, args);
  },

  /**
   * resizes the dialog to the inner size of the window. this is needed since various browsers
   * have different border sizes on windows.
   *
   * @method resizetoinnersize
   */
  resizetoinnersize: function () {
    /*var self = this;

    // detach it to workaround a chrome specific bug
    // https://sourceforge.net/tracker/?func=detail&atid=635682&aid=2926339&group_id=103281
    settimeout(function() {
      var vp = self.dom.getviewport(window);

      self.editor.windowmanager.resizeby(
        self.getwindowarg('mce_width') - vp.w,
        self.getwindowarg('mce_height') - vp.h,
        self.id || window
      );
    }, 10);*/
  },

  /**
   * will executed the specified string when the page has been loaded. this function
   * was added for compatibility with the 2.x branch.
   *
   * @method executeonload
   * @param {string} evil string to evalutate on init.
   */
  executeonload: function (evil) {
    this.oninit.add(function () {
      eval(evil);
    });
  },

  /**
   * stores the current editor selection for later restoration. this can be useful since some browsers
   * looses it's selection if a control element is selected/focused inside the dialogs.
   *
   * @method storeselection
   */
  storeselection: function () {
    this.editor.windowmanager.bookmark = tinymcepopup.editor.selection.getbookmark(1);
  },

  /**
   * restores any stored selection. this can be useful since some browsers
   * looses it's selection if a control element is selected/focused inside the dialogs.
   *
   * @method restoreselection
   */
  restoreselection: function () {
    var self = tinymcepopup;

    if (!self.iswindow && tinymce.isie) {
      self.editor.selection.movetobookmark(self.editor.windowmanager.bookmark);
    }
  },

  /**
   * loads a specific dialog language pack. if you pass in plugin_url as a argument
   * when you open the window it will load the <plugin url>/langs/<code>_dlg.js lang pack file.
   *
   * @method requirelangpack
   */
  requirelangpack: function () {
    var self = this, url = self.getwindowarg('plugin_url') || self.getwindowarg('theme_url'), settings = self.editor.settings, lang;

    if (settings.language !== false) {
      lang = settings.language || "en";
    }

    if (url && lang && self.features.translate_i18n !== false && settings.language_load !== false) {
      url += '/langs/' + lang + '_dlg.js';

      if (!tinymce.scriptloader.isdone(url)) {
        document.write('<script type="text/javascript" src="' + url + '"></script>');
        tinymce.scriptloader.markdone(url);
      }
    }
  },

  /**
   * executes a color picker on the specified element id. when the user
   * then selects a color it will be set as the value of the specified element.
   *
   * @method pickcolor
   * @param {domevent} e dom event object.
   * @param {string} element_id element id to be filled with the color value from the picker.
   */
  pickcolor: function (e, element_id) {
    var el = document.getelementbyid(element_id), colorpickercallback = this.editor.settings.color_picker_callback;
    if (colorpickercallback) {
      colorpickercallback.call(
        this.editor,
        function (value) {
          el.value = value;
          try {
            el.onchange();
          } catch (ex) {
            // try fire event, ignore errors
          }
        },
        el.value
      );
    }
  },

  /**
   * opens a filebrowser/imagebrowser this will set the output value from
   * the browser as a value on the specified element.
   *
   * @method openbrowser
   * @param {string} element_id id of the element to set value in.
   * @param {string} type type of browser to open image/file/flash.
   * @param {string} option option name to get the file_broswer_callback function name from.
   */
  openbrowser: function (element_id, type) {
    tinymcepopup.restoreselection();
    this.editor.execcallback('file_browser_callback', element_id, document.getelementbyid(element_id).value, type, window);
  },

  /**
   * creates a confirm dialog. please don't use the blocking behavior of this
   * native version use the callback method instead then it can be extended.
   *
   * @method confirm
   * @param {string} t title for the new confirm dialog.
   * @param {function} cb callback function to be executed after the user has selected ok or cancel.
   * @param {object} s optional scope to execute the callback in.
   */
  confirm: function (t, cb, s) {
    this.editor.windowmanager.confirm(t, cb, s, window);
  },

  /**
   * creates a alert dialog. please don't use the blocking behavior of this
   * native version use the callback method instead then it can be extended.
   *
   * @method alert
   * @param {string} tx title for the new alert dialog.
   * @param {function} cb callback function to be executed after the user has selected ok.
   * @param {object} s optional scope to execute the callback in.
   */
  alert: function (tx, cb, s) {
    this.editor.windowmanager.alert(tx, cb, s, window);
  },

  /**
   * closes the current window.
   *
   * @method close
   */
  close: function () {
    var t = this;

    // to avoid domain relaxing issue in opera
    function close() {
      t.editor.windowmanager.close(window);
      tinymce = tinymce = t.editor = t.params = t.dom = t.dom.doc = null; // cleanup
    }

    if (tinymce.isopera) {
      t.getwin().settimeout(close, 0);
    } else {
      close();
    }
  },

  // internal functions

  _restoreselection: function () {
    var e = window.event.srcelement;

    if (e.nodename == 'input' && (e.type == 'submit' || e.type == 'button')) {
      tinymcepopup.restoreselection();
    }
  },

  /* _restoreselection : function() {
      var e = window.event.srcelement;

      // if user focus a non text input or textarea
      if ((e.nodename != 'input' && e.nodename != 'textarea') || e.type != 'text')
        tinymcepopup.restoreselection();
    },*/

  _ondomloaded: function () {
    var t = tinymcepopup, ti = document.title, h, nv;

    // translate page
    if (t.features.translate_i18n !== false) {
      var map = {
        "update": "ok",
        "insert": "ok",
        "cancel": "cancel",
        "not_set": "--",
        "class_name": "class name",
        "browse": "browse"
      };

      var langcode = (tinymce.settings ? tinymce.settings : t.editor.settings).language || 'en';
      for (var key in map) {
        tinymce.i18n.data[langcode + "." + key] = tinymce.i18n.translate(map[key]);
      }

      h = document.body.innerhtml;

      // replace a=x with a="x" in ie
      if (tinymce.isie) {
        h = h.replace(/ (value|title|alt)=([^"][^\s>]+)/gi, ' $1="$2"');
      }

      document.dir = t.editor.getparam('directionality', '');

      if ((nv = t.editor.translate(h)) && nv != h) {
        document.body.innerhtml = nv;
      }

      if ((nv = t.editor.translate(ti)) && nv != ti) {
        document.title = ti = nv;
      }
    }

    if (!t.editor.getparam('browser_preferred_colors', false) || !t.iswindow) {
      t.dom.addclass(document.body, 'forcecolors');
    }

    document.body.style.display = '';

    // restore selection in ie when focus is placed on a non textarea or input element of the type text
    if (tinymce.env.ie) {
      if (tinymce.env.ie < 11) {
        document.attachevent('onmouseup', tinymcepopup._restoreselection);

        // add base target element for it since it would fail with modal dialogs
        t.dom.add(t.dom.select('head')[0], 'base', { target: '_self' });
      } else {
        document.addeventlistener('mouseup', tinymcepopup._restoreselection, false);
      }
    }

    t.restoreselection();
    t.resizetoinnersize();

    // set inline title
    if (!t.iswindow) {
      t.editor.windowmanager.settitle(window, ti);
    } else {
      window.focus();
    }

    if (!tinymce.isie && !t.iswindow) {
      t.dom.bind(document, 'focus', function () {
        t.editor.windowmanager.focus(t.id);
      });
    }

    // patch for accessibility
    tinymce.each(t.dom.select('select'), function (e) {
      e.onkeydown = tinymcepopup._accesshandler;
    });

    // call oninit
    // init must be called before focus so the selection won't get lost by the focus call
    tinymce.each(t.listeners, function (o) {
      o.func.call(o.scope, t.editor);
    });

    // move focus to window
    if (t.getwindowarg('mce_auto_focus', true)) {
      window.focus();

      // focus element with mcefocus class
      tinymce.each(document.forms, function (f) {
        tinymce.each(f.elements, function (e) {
          if (t.dom.hasclass(e, 'mcefocus') && !e.disabled) {
            e.focus();
            return false; // break loop
          }
        });
      });
    }

    document.onkeyup = tinymcepopup._closewinkeyhandler;

    if ('textcontent' in document) {
      t.uiwindow.getel('head').firstchild.textcontent = document.title;
    } else {
      t.uiwindow.getel('head').firstchild.innertext = document.title;
    }
  },

  _accesshandler: function (e) {
    e = e || window.event;

    if (e.keycode == 13 || e.keycode == 32) {
      var elm = e.target || e.srcelement;

      if (elm.onchange) {
        elm.onchange();
      }

      return tinymce.dom.event.cancel(e);
    }
  },

  _closewinkeyhandler: function (e) {
    e = e || window.event;

    if (e.keycode == 27) {
      tinymcepopup.close();
    }
  },

  _eventproxy: function (id) {
    return function (evt) {
      tinymcepopup.dom.events.callnativehandler(id, evt);
    };
  }
};

tinymcepopup.init();

tinymce.util.dispatcher = function (scope) {
  this.scope = scope || this;
  this.listeners = [];

  this.add = function (callback, scope) {
    this.listeners.push({ cb: callback, scope: scope || this.scope });

    return callback;
  };

  this.addtotop = function (callback, scope) {
    var self = this, listener = { cb: callback, scope: scope || self.scope };

    // create new listeners if addtotop is executed in a dispatch loop
    if (self.indispatch) {
      self.listeners = [listener].concat(self.listeners);
    } else {
      self.listeners.unshift(listener);
    }

    return callback;
  };

  this.remove = function (callback) {
    var listeners = this.listeners, output = null;

    tinymce.each(listeners, function (listener, i) {
      if (callback == listener.cb) {
        output = listener;
        listeners.splice(i, 1);
        return false;
      }
    });

    return output;
  };

  this.dispatch = function () {
    var self = this, returnvalue, args = arguments, i, listeners = self.listeners, listener;

    self.indispatch = true;

    // needs to be a real loop since the listener count might change while looping
    // and this is also more efficient
    for (i = 0; i < listeners.length; i++) {
      listener = listeners[i];
      returnvalue = listener.cb.apply(listener.scope, args.length > 0 ? args : [listener.scope]);

      if (returnvalue === false) {
        break;
      }
    }

    self.indispatch = false;

    return returnvalue;
  };
};




