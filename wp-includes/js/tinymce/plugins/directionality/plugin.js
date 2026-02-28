(function () {
var directionality = (function () {
    'use strict';

    var global = tinymce.util.tools.resolve('tinymce.pluginmanager');

    var global$1 = tinymce.util.tools.resolve('tinymce.util.tools');

    var setdir = function (editor, dir) {
      var dom = editor.dom;
      var curdir;
      var blocks = editor.selection.getselectedblocks();
      if (blocks.length) {
        curdir = dom.getattrib(blocks[0], 'dir');
        global$1.each(blocks, function (block) {
          if (!dom.getparent(block.parentnode, '*[dir="' + dir + '"]', dom.getroot())) {
            dom.setattrib(block, 'dir', curdir !== dir ? dir : null);
          }
        });
        editor.nodechanged();
      }
    };
    var direction = { setdir: setdir };

    var register = function (editor) {
      editor.addcommand('mcedirectionltr', function () {
        direction.setdir(editor, 'ltr');
      });
      editor.addcommand('mcedirectionrtl', function () {
        direction.setdir(editor, 'rtl');
      });
    };
    var commands = { register: register };

    var generateselector = function (dir) {
      var selector = [];
      global$1.each('h1 h2 h3 h4 h5 h6 div p'.split(' '), function (name) {
        selector.push(name + '[dir=' + dir + ']');
      });
      return selector.join(',');
    };
    var register$1 = function (editor) {
      editor.addbutton('ltr', {
        title: 'left to right',
        cmd: 'mcedirectionltr',
        stateselector: generateselector('ltr')
      });
      editor.addbutton('rtl', {
        title: 'right to left',
        cmd: 'mcedirectionrtl',
        stateselector: generateselector('rtl')
      });
    };
    var buttons = { register: register$1 };

    global.add('directionality', function (editor) {
      commands.register(editor);
      buttons.register(editor);
    });
    function plugin () {
    }

    return plugin;

}());
})();








