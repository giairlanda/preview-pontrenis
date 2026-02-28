/**
 * plugin.js
 *
 * released under lgpl license.
 * copyright (c) 1999-2017 ephox corp. all rights reserved
 *
 * license: http://www.tinymce.com/license
 * contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true, console:true */
/*eslint no-console:0, new-cap:0 */

/**
 * this plugin adds missing events form the 4.x api back. not every event is
 * properly supported but most things should work.
 *
 * unsupported things:
 *  - no editor.onevent
 *  - can't cancel execcommands with beforeexeccommand
 */
(function (tinymce) {
  var reported;

  function noop() {
  }

  function log(apicall) {
    if (!reported && window && window.console) {
      reported = true;
      console.log("deprecated tinymce api call: " + apicall);
    }
  }

  function dispatcher(target, neweventname, argsmap, defaultscope) {
    target = target || this;
    var cbs = [];

    if (!neweventname) {
      this.add = this.addtotop = this.remove = this.dispatch = noop;
      return;
    }

    this.add = function (callback, scope, prepend) {
      log('<target>.on' + neweventname + ".add(..)");

      // convert callback({arg1:x, arg2:x}) -> callback(arg1, arg2)
      function patchedeventcallback(e) {
        var callbackargs = [];

        if (typeof argsmap == "string") {
          argsmap = argsmap.split(" ");
        }

        if (argsmap && typeof argsmap !== "function") {
          for (var i = 0; i < argsmap.length; i++) {
            callbackargs.push(e[argsmap[i]]);
          }
        }

        if (typeof argsmap == "function") {
          callbackargs = argsmap(neweventname, e, target);
          if (!callbackargs) {
            return;
          }
        }

        if (!argsmap) {
          callbackargs = [e];
        }

        callbackargs.unshift(defaultscope || target);

        if (callback.apply(scope || defaultscope || target, callbackargs) === false) {
          e.stopimmediatepropagation();
        }
      }

      target.on(neweventname, patchedeventcallback, prepend);

      var handlers = {
        original: callback,
        patched: patchedeventcallback
      };

      cbs.push(handlers);
      return patchedeventcallback;
    };

    this.addtotop = function (callback, scope) {
      this.add(callback, scope, true);
    };

    this.remove = function (callback) {
      cbs.foreach(function (item, i) {
        if (item.original === callback) {
          cbs.splice(i, 1);
          return target.off(neweventname, item.patched);
        }
      });

      return target.off(neweventname, callback);
    };

    this.dispatch = function () {
      target.fire(neweventname);
      return true;
    };
  }

  tinymce.util.dispatcher = dispatcher;
  tinymce.onbeforeunload = new dispatcher(tinymce, "beforeunload");
  tinymce.onaddeditor = new dispatcher(tinymce, "addeditor", "editor");
  tinymce.onremoveeditor = new dispatcher(tinymce, "removeeditor", "editor");

  tinymce.util.cookie = {
    get: noop, gethash: noop, remove: noop, set: noop, sethash: noop
  };

  function patcheditor(editor) {

    function translate(str) {
      var prefix = editor.settings.language || "en";
      var prefixedstr = [prefix, str].join('.');
      var translatedstr = tinymce.i18n.translate(prefixedstr);

      return prefixedstr !== translatedstr ? translatedstr : tinymce.i18n.translate(str);
    }

    function patcheditorevents(oldeventnames, argsmap) {
      tinymce.each(oldeventnames.split(" "), function (oldname) {
        editor["on" + oldname] = new dispatcher(editor, oldname, argsmap);
      });
    }

    function convertundoeventargs(type, event, target) {
      return [
        event.level,
        target
      ];
    }

    function filterselectionevents(needsselection) {
      return function (type, e) {
        if ((!e.selection && !needsselection) || e.selection == needsselection) {
          return [e];
        }
      };
    }

    if (editor.controlmanager) {
      return;
    }

    function cmnoop() {
      var obj = {}, methods = 'add addmenu addseparator collapse createmenu destroy displaycolor expand focus ' +
        'getlength hasmenus hidemenu isactive iscollapsed isdisabled isrendered isselected mark ' +
        'postrender remove removeall renderhtml rendermenu rendernode renderto select selectbyindex ' +
        'setactive setariaproperty setcolor setdisabled setselected setstate showmenu update';

      log('editor.controlmanager.*');

      function _noop() {
        return cmnoop();
      }

      tinymce.each(methods.split(' '), function (method) {
        obj[method] = _noop;
      });

      return obj;
    }

    editor.controlmanager = {
      buttons: {},

      setdisabled: function (name, state) {
        log("controlmanager.setdisabled(..)");

        if (this.buttons[name]) {
          this.buttons[name].disabled(state);
        }
      },

      setactive: function (name, state) {
        log("controlmanager.setactive(..)");

        if (this.buttons[name]) {
          this.buttons[name].active(state);
        }
      },

      onadd: new dispatcher(),
      onpostrender: new dispatcher(),

      add: function (obj) {
        return obj;
      },
      createbutton: cmnoop,
      createcolorsplitbutton: cmnoop,
      createcontrol: cmnoop,
      createdropmenu: cmnoop,
      createlistbox: cmnoop,
      createmenubutton: cmnoop,
      createseparator: cmnoop,
      createsplitbutton: cmnoop,
      createtoolbar: cmnoop,
      createtoolbargroup: cmnoop,
      destroy: noop,
      get: noop,
      setcontroltype: cmnoop
    };

    patcheditorevents("preinit beforerenderui postrender load init remove activate deactivate", "editor");
    patcheditorevents("click mouseup mousedown dblclick keydown keyup keypress contextmenu paste submit reset");
    patcheditorevents("beforeexeccommand execcommand", "command ui value args"); // args.terminate not supported
    patcheditorevents("preprocess postprocess loadcontent savecontent change");
    patcheditorevents("beforesetcontent beforegetcontent setcontent getcontent", filterselectionevents(false));
    patcheditorevents("setprogressstate", "state time");
    patcheditorevents("visualaid", "element hasvisual");
    patcheditorevents("undo redo", convertundoeventargs);

    patcheditorevents("nodechange", function (type, e) {
      return [
        editor.controlmanager,
        e.element,
        editor.selection.iscollapsed(),
        e
      ];
    });

    var originaladdbutton = editor.addbutton;
    editor.addbutton = function (name, settings) {
      var originalonpostrender;

      function patchedpostrender() {
        editor.controlmanager.buttons[name] = this;

        if (originalonpostrender) {
          return originalonpostrender.apply(this, arguments);
        }
      }

      for (var key in settings) {
        if (key.tolowercase() === "onpostrender") {
          originalonpostrender = settings[key];
          settings.onpostrender = patchedpostrender;
        }
      }

      if (!originalonpostrender) {
        settings.onpostrender = patchedpostrender;
      }

      if (settings.title) {
        settings.title = translate(settings.title);
      }

      return originaladdbutton.call(this, name, settings);
    };

    editor.on('init', function () {
      var undomanager = editor.undomanager, selection = editor.selection;

      undomanager.onundo = new dispatcher(editor, "undo", convertundoeventargs, null, undomanager);
      undomanager.onredo = new dispatcher(editor, "redo", convertundoeventargs, null, undomanager);
      undomanager.onbeforeadd = new dispatcher(editor, "beforeaddundo", null, undomanager);
      undomanager.onadd = new dispatcher(editor, "addundo", null, undomanager);

      selection.onbeforegetcontent = new dispatcher(editor, "beforegetcontent", filterselectionevents(true), selection);
      selection.ongetcontent = new dispatcher(editor, "getcontent", filterselectionevents(true), selection);
      selection.onbeforesetcontent = new dispatcher(editor, "beforesetcontent", filterselectionevents(true), selection);
      selection.onsetcontent = new dispatcher(editor, "setcontent", filterselectionevents(true), selection);
    });

    editor.on('beforerenderui', function () {
      var windowmanager = editor.windowmanager;

      windowmanager.onopen = new dispatcher();
      windowmanager.onclose = new dispatcher();
      windowmanager.createinstance = function (classname, a, b, c, d, e) {
        log("windowmanager.createinstance(..)");

        var constr = tinymce.resolve(classname);
        return new constr(a, b, c, d, e);
      };
    });
  }

  tinymce.on('setupeditor', function (e) {
    patcheditor(e.editor);
  });

  tinymce.pluginmanager.add("compat3x", patcheditor);

  tinymce.addi18n = function (prefix, o) {
    var i18n = tinymce.util.i18n, each = tinymce.each;

    if (typeof prefix == "string" && prefix.indexof('.') === -1) {
      i18n.add(prefix, o);
      return;
    }

    if (!tinymce.is(prefix, 'string')) {
      each(prefix, function (o, lc) {
        each(o, function (o, g) {
          each(o, function (o, k) {
            if (g === 'common') {
              i18n.data[lc + '.' + k] = o;
            } else {
              i18n.data[lc + '.' + g + '.' + k] = o;
            }
          });
        });
      });
    } else {
      each(o, function (o, k) {
        i18n.data[prefix + '.' + k] = o;
      });
    }
  };
})(tinymce);







