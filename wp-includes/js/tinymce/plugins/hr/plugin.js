(function () {
var hr = (function () {
    'use strict';

    var global = tinymce.util.tools.resolve('tinymce.pluginmanager');

    var register = function (editor) {
      editor.addcommand('inserthorizontalrule', function () {
        editor.execcommand('mceinsertcontent', false, '<hr />');
      });
    };
    var commands = { register: register };

    var register$1 = function (editor) {
      editor.addbutton('hr', {
        icon: 'hr',
        tooltip: 'horizontal line',
        cmd: 'inserthorizontalrule'
      });
      editor.addmenuitem('hr', {
        icon: 'hr',
        text: 'horizontal line',
        cmd: 'inserthorizontalrule',
        context: 'insert'
      });
    };
    var buttons = { register: register$1 };

    global.add('hr', function (editor) {
      commands.register(editor);
      buttons.register(editor);
    });
    function plugin () {
    }

    return plugin;

}());
})();




