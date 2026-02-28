(function () {
var fullscreen = (function (domglobals) {
    'use strict';

    var cell = function (initial) {
      var value = initial;
      var get = function () {
        return value;
      };
      var set = function (v) {
        value = v;
      };
      var clone = function () {
        return cell(get());
      };
      return {
        get: get,
        set: set,
        clone: clone
      };
    };

    var global = tinymce.util.tools.resolve('tinymce.pluginmanager');

    var get = function (fullscreenstate) {
      return {
        isfullscreen: function () {
          return fullscreenstate.get() !== null;
        }
      };
    };
    var api = { get: get };

    var global$1 = tinymce.util.tools.resolve('tinymce.dom.domutils');

    var firefullscreenstatechanged = function (editor, state) {
      editor.fire('fullscreenstatechanged', { state: state });
    };
    var events = { firefullscreenstatechanged: firefullscreenstatechanged };

    var dom = global$1.dom;
    var getwindowsize = function () {
      var w;
      var h;
      var win = domglobals.window;
      var doc = domglobals.document;
      var body = doc.body;
      if (body.offsetwidth) {
        w = body.offsetwidth;
        h = body.offsetheight;
      }
      if (win.innerwidth && win.innerheight) {
        w = win.innerwidth;
        h = win.innerheight;
      }
      return {
        w: w,
        h: h
      };
    };
    var getscrollpos = function () {
      var vp = dom.getviewport();
      return {
        x: vp.x,
        y: vp.y
      };
    };
    var setscrollpos = function (pos) {
      domglobals.window.scrollto(pos.x, pos.y);
    };
    var togglefullscreen = function (editor, fullscreenstate) {
      var body = domglobals.document.body;
      var documentelement = domglobals.document.documentelement;
      var editorcontainerstyle;
      var editorcontainer, iframe, iframestyle;
      var fullscreeninfo = fullscreenstate.get();
      var resize = function () {
        dom.setstyle(iframe, 'height', getwindowsize().h - (editorcontainer.clientheight - iframe.clientheight));
      };
      var removeresize = function () {
        dom.unbind(domglobals.window, 'resize', resize);
      };
      editorcontainer = editor.getcontainer();
      editorcontainerstyle = editorcontainer.style;
      iframe = editor.getcontentareacontainer().firstchild;
      iframestyle = iframe.style;
      if (!fullscreeninfo) {
        var newfullscreeninfo = {
          scrollpos: getscrollpos(),
          containerwidth: editorcontainerstyle.width,
          containerheight: editorcontainerstyle.height,
          iframewidth: iframestyle.width,
          iframeheight: iframestyle.height,
          resizehandler: resize,
          removehandler: removeresize
        };
        iframestyle.width = iframestyle.height = '100%';
        editorcontainerstyle.width = editorcontainerstyle.height = '';
        dom.addclass(body, 'mce-fullscreen');
        dom.addclass(documentelement, 'mce-fullscreen');
        dom.addclass(editorcontainer, 'mce-fullscreen');
        dom.bind(domglobals.window, 'resize', resize);
        editor.on('remove', removeresize);
        resize();
        fullscreenstate.set(newfullscreeninfo);
        events.firefullscreenstatechanged(editor, true);
      } else {
        iframestyle.width = fullscreeninfo.iframewidth;
        iframestyle.height = fullscreeninfo.iframeheight;
        if (fullscreeninfo.containerwidth) {
          editorcontainerstyle.width = fullscreeninfo.containerwidth;
        }
        if (fullscreeninfo.containerheight) {
          editorcontainerstyle.height = fullscreeninfo.containerheight;
        }
        dom.removeclass(body, 'mce-fullscreen');
        dom.removeclass(documentelement, 'mce-fullscreen');
        dom.removeclass(editorcontainer, 'mce-fullscreen');
        setscrollpos(fullscreeninfo.scrollpos);
        dom.unbind(domglobals.window, 'resize', fullscreeninfo.resizehandler);
        editor.off('remove', fullscreeninfo.removehandler);
        fullscreenstate.set(null);
        events.firefullscreenstatechanged(editor, false);
      }
    };
    var actions = { togglefullscreen: togglefullscreen };

    var register = function (editor, fullscreenstate) {
      editor.addcommand('mcefullscreen', function () {
        actions.togglefullscreen(editor, fullscreenstate);
      });
    };
    var commands = { register: register };

    var postrender = function (editor) {
      return function (e) {
        var ctrl = e.control;
        editor.on('fullscreenstatechanged', function (e) {
          ctrl.active(e.state);
        });
      };
    };
    var register$1 = function (editor) {
      editor.addmenuitem('fullscreen', {
        text: 'fullscreen',
        shortcut: 'ctrl+shift+f',
        selectable: true,
        cmd: 'mcefullscreen',
        onpostrender: postrender(editor),
        context: 'view'
      });
      editor.addbutton('fullscreen', {
        active: false,
        tooltip: 'fullscreen',
        cmd: 'mcefullscreen',
        onpostrender: postrender(editor)
      });
    };
    var buttons = { register: register$1 };

    global.add('fullscreen', function (editor) {
      var fullscreenstate = cell(null);
      if (editor.settings.inline) {
        return api.get(fullscreenstate);
      }
      commands.register(editor, fullscreenstate);
      buttons.register(editor);
      editor.addshortcut('ctrl+shift+f', '', 'mcefullscreen');
      return api.get(fullscreenstate);
    });
    function plugin () {
    }

    return plugin;

}(window));
})();





