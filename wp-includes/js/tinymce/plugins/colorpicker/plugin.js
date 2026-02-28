(function () {
var colorpicker = (function () {
    'use strict';

    var global = tinymce.util.tools.resolve('tinymce.pluginmanager');

    var global$1 = tinymce.util.tools.resolve('tinymce.util.color');

    var showpreview = function (win, hexcolor) {
      win.find('#preview')[0].getel().style.background = hexcolor;
    };
    var setcolor = function (win, value) {
      var color = global$1(value), rgb = color.torgb();
      win.fromjson({
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        hex: color.tohex().substr(1)
      });
      showpreview(win, color.tohex());
    };
    var open = function (editor, callback, value) {
      var win = editor.windowmanager.open({
        title: 'color',
        items: {
          type: 'container',
          layout: 'flex',
          direction: 'row',
          align: 'stretch',
          padding: 5,
          spacing: 10,
          items: [
            {
              type: 'colorpicker',
              value: value,
              onchange: function () {
                var rgb = this.rgb();
                if (win) {
                  win.find('#r').value(rgb.r);
                  win.find('#g').value(rgb.g);
                  win.find('#b').value(rgb.b);
                  win.find('#hex').value(this.value().substr(1));
                  showpreview(win, this.value());
                }
              }
            },
            {
              type: 'form',
              padding: 0,
              labelgap: 5,
              defaults: {
                type: 'textbox',
                size: 7,
                value: '0',
                flex: 1,
                spellcheck: false,
                onchange: function () {
                  var colorpickerctrl = win.find('colorpicker')[0];
                  var name, value;
                  name = this.name();
                  value = this.value();
                  if (name === 'hex') {
                    value = '#' + value;
                    setcolor(win, value);
                    colorpickerctrl.value(value);
                    return;
                  }
                  value = {
                    r: win.find('#r').value(),
                    g: win.find('#g').value(),
                    b: win.find('#b').value()
                  };
                  colorpickerctrl.value(value);
                  setcolor(win, value);
                }
              },
              items: [
                {
                  name: 'r',
                  label: 'r',
                  autofocus: 1
                },
                {
                  name: 'g',
                  label: 'g'
                },
                {
                  name: 'b',
                  label: 'b'
                },
                {
                  name: 'hex',
                  label: '#',
                  value: '000000'
                },
                {
                  name: 'preview',
                  type: 'container',
                  border: 1
                }
              ]
            }
          ]
        },
        onsubmit: function () {
          callback('#' + win.tojson().hex);
        }
      });
      setcolor(win, value);
    };
    var dialog = { open: open };

    global.add('colorpicker', function (editor) {
      if (!editor.settings.color_picker_callback) {
        editor.settings.color_picker_callback = function (callback, value) {
          dialog.open(editor, callback, value);
        };
      }
    });
    function plugin () {
    }

    return plugin;

}());
})();



