(function () {
var textcolor = (function () {
    'use strict';

    var global = tinymce.util.tools.resolve('tinymce.pluginmanager');

    var getcurrentcolor = function (editor, format) {
      var color;
      editor.dom.getparents(editor.selection.getstart(), function (elm) {
        var value;
        if (value = elm.style[format === 'forecolor' ? 'color' : 'background-color']) {
          color = color ? color : value;
        }
      });
      return color;
    };
    var mapcolors = function (colormap) {
      var i;
      var colors = [];
      for (i = 0; i < colormap.length; i += 2) {
        colors.push({
          text: colormap[i + 1],
          color: '#' + colormap[i]
        });
      }
      return colors;
    };
    var applyformat = function (editor, format, value) {
      editor.undomanager.transact(function () {
        editor.focus();
        editor.formatter.apply(format, { value: value });
        editor.nodechanged();
      });
    };
    var removeformat = function (editor, format) {
      editor.undomanager.transact(function () {
        editor.focus();
        editor.formatter.remove(format, { value: null }, null, true);
        editor.nodechanged();
      });
    };
    var textcolor = {
      getcurrentcolor: getcurrentcolor,
      mapcolors: mapcolors,
      applyformat: applyformat,
      removeformat: removeformat
    };

    var register = function (editor) {
      editor.addcommand('mceapplytextcolor', function (format, value) {
        textcolor.applyformat(editor, format, value);
      });
      editor.addcommand('mceremovetextcolor', function (format) {
        textcolor.removeformat(editor, format);
      });
    };
    var commands = { register: register };

    var global$1 = tinymce.util.tools.resolve('tinymce.dom.domutils');

    var global$2 = tinymce.util.tools.resolve('tinymce.util.tools');

    var defaultcolormap = [
      '000000',
      'black',
      '993300',
      'burnt orange',
      '333300',
      'dark olive',
      '003300',
      'dark green',
      '003366',
      'dark azure',
      '000080',
      'navy blue',
      '333399',
      'indigo',
      '333333',
      'very dark gray',
      '800000',
      'maroon',
      'ff6600',
      'orange',
      '808000',
      'olive',
      '008000',
      'green',
      '008080',
      'teal',
      '0000ff',
      'blue',
      '666699',
      'grayish blue',
      '808080',
      'gray',
      'ff0000',
      'red',
      'ff9900',
      'amber',
      '99cc00',
      'yellow green',
      '339966',
      'sea green',
      '33cccc',
      'turquoise',
      '3366ff',
      'royal blue',
      '800080',
      'purple',
      '999999',
      'medium gray',
      'ff00ff',
      'magenta',
      'ffcc00',
      'gold',
      'ffff00',
      'yellow',
      '00ff00',
      'lime',
      '00ffff',
      'aqua',
      '00ccff',
      'sky blue',
      '993366',
      'red violet',
      'ffffff',
      'white',
      'ff99cc',
      'pink',
      'ffcc99',
      'peach',
      'ffff99',
      'light yellow',
      'ccffcc',
      'pale green',
      'ccffff',
      'pale cyan',
      '99ccff',
      'light sky blue',
      'cc99ff',
      'plum'
    ];
    var gettextcolormap = function (editor) {
      return editor.getparam('textcolor_map', defaultcolormap);
    };
    var getforecolormap = function (editor) {
      return editor.getparam('forecolor_map', gettextcolormap(editor));
    };
    var getbackcolormap = function (editor) {
      return editor.getparam('backcolor_map', gettextcolormap(editor));
    };
    var gettextcolorrows = function (editor) {
      return editor.getparam('textcolor_rows', 5);
    };
    var gettextcolorcols = function (editor) {
      return editor.getparam('textcolor_cols', 8);
    };
    var getforecolorrows = function (editor) {
      return editor.getparam('forecolor_rows', gettextcolorrows(editor));
    };
    var getbackcolorrows = function (editor) {
      return editor.getparam('backcolor_rows', gettextcolorrows(editor));
    };
    var getforecolorcols = function (editor) {
      return editor.getparam('forecolor_cols', gettextcolorcols(editor));
    };
    var getbackcolorcols = function (editor) {
      return editor.getparam('backcolor_cols', gettextcolorcols(editor));
    };
    var getcolorpickercallback = function (editor) {
      return editor.getparam('color_picker_callback', null);
    };
    var hascolorpicker = function (editor) {
      return typeof getcolorpickercallback(editor) === 'function';
    };
    var settings = {
      getforecolormap: getforecolormap,
      getbackcolormap: getbackcolormap,
      getforecolorrows: getforecolorrows,
      getbackcolorrows: getbackcolorrows,
      getforecolorcols: getforecolorcols,
      getbackcolorcols: getbackcolorcols,
      getcolorpickercallback: getcolorpickercallback,
      hascolorpicker: hascolorpicker
    };

    var global$3 = tinymce.util.tools.resolve('tinymce.util.i18n');

    var gethtml = function (cols, rows, colormap, hascolorpicker) {
      var colors, color, html, last, x, y, i, count = 0;
      var id = global$1.dom.uniqueid('mcearia');
      var getcolorcellhtml = function (color, title) {
        var isnocolor = color === 'transparent';
        return '<td class="mce-grid-cell' + (isnocolor ? ' mce-colorbtn-trans' : '') + '">' + '<div id="' + id + '-' + count++ + '"' + ' data-mce-color="' + (color ? color : '') + '"' + ' role="option"' + ' tabindex="-1"' + ' style="' + (color ? 'background-color: ' + color : '') + '"' + ' title="' + global$3.translate(title) + '">' + (isnocolor ? '&#215;' : '') + '</div>' + '</td>';
      };
      colors = textcolor.mapcolors(colormap);
      colors.push({
        text: global$3.translate('no color'),
        color: 'transparent'
      });
      html = '<table class="mce-grid mce-grid-border mce-colorbutton-grid" role="list" cellspacing="0"><tbody>';
      last = colors.length - 1;
      for (y = 0; y < rows; y++) {
        html += '<tr>';
        for (x = 0; x < cols; x++) {
          i = y * cols + x;
          if (i > last) {
            html += '<td></td>';
          } else {
            color = colors[i];
            html += getcolorcellhtml(color.color, color.text);
          }
        }
        html += '</tr>';
      }
      if (hascolorpicker) {
        html += '<tr>' + '<td colspan="' + cols + '" class="mce-custom-color-btn">' + '<div id="' + id + '-c" class="mce-widget mce-btn mce-btn-small mce-btn-flat" ' + 'role="button" tabindex="-1" aria-labelledby="' + id + '-c" style="width: 100%">' + '<button type="button" role="presentation" tabindex="-1">' + global$3.translate('custom...') + '</button>' + '</div>' + '</td>' + '</tr>';
        html += '<tr>';
        for (x = 0; x < cols; x++) {
          html += getcolorcellhtml('', 'custom color');
        }
        html += '</tr>';
      }
      html += '</tbody></table>';
      return html;
    };
    var colorpickerhtml = { gethtml: gethtml };

    var setdivcolor = function setdivcolor(div, value) {
      div.style.background = value;
      div.setattribute('data-mce-color', value);
    };
    var onbuttonclick = function (editor) {
      return function (e) {
        var ctrl = e.control;
        if (ctrl._color) {
          editor.execcommand('mceapplytextcolor', ctrl.settings.format, ctrl._color);
        } else {
          editor.execcommand('mceremovetextcolor', ctrl.settings.format);
        }
      };
    };
    var onpanelclick = function (editor, cols) {
      return function (e) {
        var buttonctrl = this.parent();
        var value;
        var currentcolor = textcolor.getcurrentcolor(editor, buttonctrl.settings.format);
        var selectcolor = function (value) {
          editor.execcommand('mceapplytextcolor', buttonctrl.settings.format, value);
          buttonctrl.hidepanel();
          buttonctrl.color(value);
        };
        var resetcolor = function () {
          editor.execcommand('mceremovetextcolor', buttonctrl.settings.format);
          buttonctrl.hidepanel();
          buttonctrl.resetcolor();
        };
        if (global$1.dom.getparent(e.target, '.mce-custom-color-btn')) {
          buttonctrl.hidepanel();
          var colorpickercallback = settings.getcolorpickercallback(editor);
          colorpickercallback.call(editor, function (value) {
            var tableelm = buttonctrl.panel.getel().getelementsbytagname('table')[0];
            var customcolorcells, div, i;
            customcolorcells = global$2.map(tableelm.rows[tableelm.rows.length - 1].childnodes, function (elm) {
              return elm.firstchild;
            });
            for (i = 0; i < customcolorcells.length; i++) {
              div = customcolorcells[i];
              if (!div.getattribute('data-mce-color')) {
                break;
              }
            }
            if (i === cols) {
              for (i = 0; i < cols - 1; i++) {
                setdivcolor(customcolorcells[i], customcolorcells[i + 1].getattribute('data-mce-color'));
              }
            }
            setdivcolor(div, value);
            selectcolor(value);
          }, currentcolor);
        }
        value = e.target.getattribute('data-mce-color');
        if (value) {
          if (this.lastid) {
            global$1.dom.get(this.lastid).setattribute('aria-selected', 'false');
          }
          e.target.setattribute('aria-selected', true);
          this.lastid = e.target.id;
          if (value === 'transparent') {
            resetcolor();
          } else {
            selectcolor(value);
          }
        } else if (value !== null) {
          buttonctrl.hidepanel();
        }
      };
    };
    var rendercolorpicker = function (editor, forecolor) {
      return function () {
        var cols = forecolor ? settings.getforecolorcols(editor) : settings.getbackcolorcols(editor);
        var rows = forecolor ? settings.getforecolorrows(editor) : settings.getbackcolorrows(editor);
        var colormap = forecolor ? settings.getforecolormap(editor) : settings.getbackcolormap(editor);
        var hascolorpicker = settings.hascolorpicker(editor);
        return colorpickerhtml.gethtml(cols, rows, colormap, hascolorpicker);
      };
    };
    var register$1 = function (editor) {
      editor.addbutton('forecolor', {
        type: 'colorbutton',
        tooltip: 'text color',
        format: 'forecolor',
        panel: {
          role: 'application',
          ariaremember: true,
          html: rendercolorpicker(editor, true),
          onclick: onpanelclick(editor, settings.getforecolorcols(editor))
        },
        onclick: onbuttonclick(editor)
      });
      editor.addbutton('backcolor', {
        type: 'colorbutton',
        tooltip: 'background color',
        format: 'hilitecolor',
        panel: {
          role: 'application',
          ariaremember: true,
          html: rendercolorpicker(editor, false),
          onclick: onpanelclick(editor, settings.getbackcolorcols(editor))
        },
        onclick: onbuttonclick(editor)
      });
    };
    var buttons = { register: register$1 };

    global.add('textcolor', function (editor) {
      commands.register(editor);
      buttons.register(editor);
    });
    function plugin () {
    }

    return plugin;

}());
})();







