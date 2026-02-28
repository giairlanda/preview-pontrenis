(function () {
var tabfocus = (function (domglobals) {
    'use strict';

    var global = tinymce.util.tools.resolve('tinymce.pluginmanager');

    var global$1 = tinymce.util.tools.resolve('tinymce.dom.domutils');

    var global$2 = tinymce.util.tools.resolve('tinymce.editormanager');

    var global$3 = tinymce.util.tools.resolve('tinymce.env');

    var global$4 = tinymce.util.tools.resolve('tinymce.util.delay');

    var global$5 = tinymce.util.tools.resolve('tinymce.util.tools');

    var global$6 = tinymce.util.tools.resolve('tinymce.util.vk');

    var gettabfocuselements = function (editor) {
      return editor.getparam('tabfocus_elements', ':prev,:next');
    };
    var gettabfocus = function (editor) {
      return editor.getparam('tab_focus', gettabfocuselements(editor));
    };
    var settings = { gettabfocus: gettabfocus };

    var dom = global$1.dom;
    var tabcancel = function (e) {
      if (e.keycode === global$6.tab && !e.ctrlkey && !e.altkey && !e.metakey) {
        e.preventdefault();
      }
    };
    var setup = function (editor) {
      function tabhandler(e) {
        var x, el, v, i;
        if (e.keycode !== global$6.tab || e.ctrlkey || e.altkey || e.metakey || e.isdefaultprevented()) {
          return;
        }
        function find(direction) {
          el = dom.select(':input:enabled,*[tabindex]:not(iframe)');
          function canselectrecursive(e) {
            return e.nodename === 'body' || e.type !== 'hidden' && e.style.display !== 'none' && e.style.visibility !== 'hidden' && canselectrecursive(e.parentnode);
          }
          function canselect(el) {
            return /input|textarea|button/.test(el.tagname) && global$2.get(e.id) && el.tabindex !== -1 && canselectrecursive(el);
          }
          global$5.each(el, function (e, i) {
            if (e.id === editor.id) {
              x = i;
              return false;
            }
          });
          if (direction > 0) {
            for (i = x + 1; i < el.length; i++) {
              if (canselect(el[i])) {
                return el[i];
              }
            }
          } else {
            for (i = x - 1; i >= 0; i--) {
              if (canselect(el[i])) {
                return el[i];
              }
            }
          }
          return null;
        }
        v = global$5.explode(settings.gettabfocus(editor));
        if (v.length === 1) {
          v[1] = v[0];
          v[0] = ':prev';
        }
        if (e.shiftkey) {
          if (v[0] === ':prev') {
            el = find(-1);
          } else {
            el = dom.get(v[0]);
          }
        } else {
          if (v[1] === ':next') {
            el = find(1);
          } else {
            el = dom.get(v[1]);
          }
        }
        if (el) {
          var focuseditor = global$2.get(el.id || el.name);
          if (el.id && focuseditor) {
            focuseditor.focus();
          } else {
            global$4.settimeout(function () {
              if (!global$3.webkit) {
                domglobals.window.focus();
              }
              el.focus();
            }, 10);
          }
          e.preventdefault();
        }
      }
      editor.on('init', function () {
        if (editor.inline) {
          dom.setattrib(editor.getbody(), 'tabindex', null);
        }
        editor.on('keyup', tabcancel);
        if (global$3.gecko) {
          editor.on('keypress keydown', tabhandler);
        } else {
          editor.on('keydown', tabhandler);
        }
      });
    };
    var keyboard = { setup: setup };

    global.add('tabfocus', function (editor) {
      keyboard.setup(editor);
    });
    function plugin () {
    }

    return plugin;

}(window));
})();


