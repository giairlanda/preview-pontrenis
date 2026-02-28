(function () {
var charmap = (function () {
    'use strict';

    var global = tinymce.util.tools.resolve('tinymce.pluginmanager');

    var fireinsertcustomchar = function (editor, chr) {
      return editor.fire('insertcustomchar', { chr: chr });
    };
    var events = { fireinsertcustomchar: fireinsertcustomchar };

    var insertchar = function (editor, chr) {
      var evtchr = events.fireinsertcustomchar(editor, chr).chr;
      editor.execcommand('mceinsertcontent', false, evtchr);
    };
    var actions = { insertchar: insertchar };

    var global$1 = tinymce.util.tools.resolve('tinymce.util.tools');

    var getcharmap = function (editor) {
      return editor.settings.charmap;
    };
    var getcharmapappend = function (editor) {
      return editor.settings.charmap_append;
    };
    var settings = {
      getcharmap: getcharmap,
      getcharmapappend: getcharmapappend
    };

    var isarray = global$1.isarray;
    var getdefaultcharmap = function () {
      return [
        [
          '160',
          'no-break space'
        ],
        [
          '173',
          'soft hyphen'
        ],
        [
          '34',
          'quotation mark'
        ],
        [
          '162',
          'cent sign'
        ],
        [
          '8364',
          'euro sign'
        ],
        [
          '163',
          'pound sign'
        ],
        [
          '165',
          'yen sign'
        ],
        [
          '169',
          'copyright sign'
        ],
        [
          '174',
          'registered sign'
        ],
        [
          '8482',
          'trade mark sign'
        ],
        [
          '8240',
          'per mille sign'
        ],
        [
          '181',
          'micro sign'
        ],
        [
          '183',
          'middle dot'
        ],
        [
          '8226',
          'bullet'
        ],
        [
          '8230',
          'three dot leader'
        ],
        [
          '8242',
          'minutes / feet'
        ],
        [
          '8243',
          'seconds / inches'
        ],
        [
          '167',
          'section sign'
        ],
        [
          '182',
          'paragraph sign'
        ],
        [
          '223',
          'sharp s / ess-zed'
        ],
        [
          '8249',
          'single left-pointing angle quotation mark'
        ],
        [
          '8250',
          'single right-pointing angle quotation mark'
        ],
        [
          '171',
          'left pointing guillemet'
        ],
        [
          '187',
          'right pointing guillemet'
        ],
        [
          '8216',
          'left single quotation mark'
        ],
        [
          '8217',
          'right single quotation mark'
        ],
        [
          '8220',
          'left double quotation mark'
        ],
        [
          '8221',
          'right double quotation mark'
        ],
        [
          '8218',
          'single low-9 quotation mark'
        ],
        [
          '8222',
          'double low-9 quotation mark'
        ],
        [
          '60',
          'less-than sign'
        ],
        [
          '62',
          'greater-than sign'
        ],
        [
          '8804',
          'less-than or equal to'
        ],
        [
          '8805',
          'greater-than or equal to'
        ],
        [
          '8211',
          'en dash'
        ],
        [
          '8212',
          'em dash'
        ],
        [
          '175',
          'macron'
        ],
        [
          '8254',
          'overline'
        ],
        [
          '164',
          'currency sign'
        ],
        [
          '166',
          'broken bar'
        ],
        [
          '168',
          'diaeresis'
        ],
        [
          '161',
          'inverted exclamation mark'
        ],
        [
          '191',
          'turned question mark'
        ],
        [
          '710',
          'circumflex accent'
        ],
        [
          '732',
          'small tilde'
        ],
        [
          '176',
          'degree sign'
        ],
        [
          '8722',
          'minus sign'
        ],
        [
          '177',
          'plus-minus sign'
        ],
        [
          '247',
          'division sign'
        ],
        [
          '8260',
          'fraction slash'
        ],
        [
          '215',
          'multiplication sign'
        ],
        [
          '185',
          'superscript one'
        ],
        [
          '178',
          'superscript two'
        ],
        [
          '179',
          'superscript three'
        ],
        [
          '188',
          'fraction one quarter'
        ],
        [
          '189',
          'fraction one half'
        ],
        [
          '190',
          'fraction three quarters'
        ],
        [
          '402',
          'function / florin'
        ],
        [
          '8747',
          'integral'
        ],
        [
          '8721',
          'n-ary sumation'
        ],
        [
          '8734',
          'infinity'
        ],
        [
          '8730',
          'square root'
        ],
        [
          '8764',
          'similar to'
        ],
        [
          '8773',
          'approximately equal to'
        ],
        [
          '8776',
          'almost equal to'
        ],
        [
          '8800',
          'not equal to'
        ],
        [
          '8801',
          'identical to'
        ],
        [
          '8712',
          'element of'
        ],
        [
          '8713',
          'not an element of'
        ],
        [
          '8715',
          'contains as member'
        ],
        [
          '8719',
          'n-ary product'
        ],
        [
          '8743',
          'logical and'
        ],
        [
          '8744',
          'logical or'
        ],
        [
          '172',
          'not sign'
        ],
        [
          '8745',
          'intersection'
        ],
        [
          '8746',
          'union'
        ],
        [
          '8706',
          'partial differential'
        ],
        [
          '8704',
          'for all'
        ],
        [
          '8707',
          'there exists'
        ],
        [
          '8709',
          'diameter'
        ],
        [
          '8711',
          'backward difference'
        ],
        [
          '8727',
          'asterisk operator'
        ],
        [
          '8733',
          'proportional to'
        ],
        [
          '8736',
          'angle'
        ],
        [
          '180',
          'acute accent'
        ],
        [
          '184',
          'cedilla'
        ],
        [
          '170',
          'feminine ordinal indicator'
        ],
        [
          '186',
          'masculine ordinal indicator'
        ],
        [
          '8224',
          'dagger'
        ],
        [
          '8225',
          'double dagger'
        ],
        [
          '192',
          'a - grave'
        ],
        [
          '193',
          'a - acute'
        ],
        [
          '194',
          'a - circumflex'
        ],
        [
          '195',
          'a - tilde'
        ],
        [
          '196',
          'a - diaeresis'
        ],
        [
          '197',
          'a - ring above'
        ],
        [
          '256',
          'a - macron'
        ],
        [
          '198',
          'ligature ae'
        ],
        [
          '199',
          'c - cedilla'
        ],
        [
          '200',
          'e - grave'
        ],
        [
          '201',
          'e - acute'
        ],
        [
          '202',
          'e - circumflex'
        ],
        [
          '203',
          'e - diaeresis'
        ],
        [
          '274',
          'e - macron'
        ],
        [
          '204',
          'i - grave'
        ],
        [
          '205',
          'i - acute'
        ],
        [
          '206',
          'i - circumflex'
        ],
        [
          '207',
          'i - diaeresis'
        ],
        [
          '298',
          'i - macron'
        ],
        [
          '208',
          'eth'
        ],
        [
          '209',
          'n - tilde'
        ],
        [
          '210',
          'o - grave'
        ],
        [
          '211',
          'o - acute'
        ],
        [
          '212',
          'o - circumflex'
        ],
        [
          '213',
          'o - tilde'
        ],
        [
          '214',
          'o - diaeresis'
        ],
        [
          '216',
          'o - slash'
        ],
        [
          '332',
          'o - macron'
        ],
        [
          '338',
          'ligature oe'
        ],
        [
          '352',
          's - caron'
        ],
        [
          '217',
          'u - grave'
        ],
        [
          '218',
          'u - acute'
        ],
        [
          '219',
          'u - circumflex'
        ],
        [
          '220',
          'u - diaeresis'
        ],
        [
          '362',
          'u - macron'
        ],
        [
          '221',
          'y - acute'
        ],
        [
          '376',
          'y - diaeresis'
        ],
        [
          '562',
          'y - macron'
        ],
        [
          '222',
          'thorn'
        ],
        [
          '224',
          'a - grave'
        ],
        [
          '225',
          'a - acute'
        ],
        [
          '226',
          'a - circumflex'
        ],
        [
          '227',
          'a - tilde'
        ],
        [
          '228',
          'a - diaeresis'
        ],
        [
          '229',
          'a - ring above'
        ],
        [
          '257',
          'a - macron'
        ],
        [
          '230',
          'ligature ae'
        ],
        [
          '231',
          'c - cedilla'
        ],
        [
          '232',
          'e - grave'
        ],
        [
          '233',
          'e - acute'
        ],
        [
          '234',
          'e - circumflex'
        ],
        [
          '235',
          'e - diaeresis'
        ],
        [
          '275',
          'e - macron'
        ],
        [
          '236',
          'i - grave'
        ],
        [
          '237',
          'i - acute'
        ],
        [
          '238',
          'i - circumflex'
        ],
        [
          '239',
          'i - diaeresis'
        ],
        [
          '299',
          'i - macron'
        ],
        [
          '240',
          'eth'
        ],
        [
          '241',
          'n - tilde'
        ],
        [
          '242',
          'o - grave'
        ],
        [
          '243',
          'o - acute'
        ],
        [
          '244',
          'o - circumflex'
        ],
        [
          '245',
          'o - tilde'
        ],
        [
          '246',
          'o - diaeresis'
        ],
        [
          '248',
          'o slash'
        ],
        [
          '333',
          'o macron'
        ],
        [
          '339',
          'ligature oe'
        ],
        [
          '353',
          's - caron'
        ],
        [
          '249',
          'u - grave'
        ],
        [
          '250',
          'u - acute'
        ],
        [
          '251',
          'u - circumflex'
        ],
        [
          '252',
          'u - diaeresis'
        ],
        [
          '363',
          'u - macron'
        ],
        [
          '253',
          'y - acute'
        ],
        [
          '254',
          'thorn'
        ],
        [
          '255',
          'y - diaeresis'
        ],
        [
          '563',
          'y - macron'
        ],
        [
          '913',
          'alpha'
        ],
        [
          '914',
          'beta'
        ],
        [
          '915',
          'gamma'
        ],
        [
          '916',
          'delta'
        ],
        [
          '917',
          'epsilon'
        ],
        [
          '918',
          'zeta'
        ],
        [
          '919',
          'eta'
        ],
        [
          '920',
          'theta'
        ],
        [
          '921',
          'iota'
        ],
        [
          '922',
          'kappa'
        ],
        [
          '923',
          'lambda'
        ],
        [
          '924',
          'mu'
        ],
        [
          '925',
          'nu'
        ],
        [
          '926',
          'xi'
        ],
        [
          '927',
          'omicron'
        ],
        [
          '928',
          'pi'
        ],
        [
          '929',
          'rho'
        ],
        [
          '931',
          'sigma'
        ],
        [
          '932',
          'tau'
        ],
        [
          '933',
          'upsilon'
        ],
        [
          '934',
          'phi'
        ],
        [
          '935',
          'chi'
        ],
        [
          '936',
          'psi'
        ],
        [
          '937',
          'omega'
        ],
        [
          '945',
          'alpha'
        ],
        [
          '946',
          'beta'
        ],
        [
          '947',
          'gamma'
        ],
        [
          '948',
          'delta'
        ],
        [
          '949',
          'epsilon'
        ],
        [
          '950',
          'zeta'
        ],
        [
          '951',
          'eta'
        ],
        [
          '952',
          'theta'
        ],
        [
          '953',
          'iota'
        ],
        [
          '954',
          'kappa'
        ],
        [
          '955',
          'lambda'
        ],
        [
          '956',
          'mu'
        ],
        [
          '957',
          'nu'
        ],
        [
          '958',
          'xi'
        ],
        [
          '959',
          'omicron'
        ],
        [
          '960',
          'pi'
        ],
        [
          '961',
          'rho'
        ],
        [
          '962',
          'final sigma'
        ],
        [
          '963',
          'sigma'
        ],
        [
          '964',
          'tau'
        ],
        [
          '965',
          'upsilon'
        ],
        [
          '966',
          'phi'
        ],
        [
          '967',
          'chi'
        ],
        [
          '968',
          'psi'
        ],
        [
          '969',
          'omega'
        ],
        [
          '8501',
          'alef symbol'
        ],
        [
          '982',
          'pi symbol'
        ],
        [
          '8476',
          'real part symbol'
        ],
        [
          '978',
          'upsilon - hook symbol'
        ],
        [
          '8472',
          'weierstrass p'
        ],
        [
          '8465',
          'imaginary part'
        ],
        [
          '8592',
          'leftwards arrow'
        ],
        [
          '8593',
          'upwards arrow'
        ],
        [
          '8594',
          'rightwards arrow'
        ],
        [
          '8595',
          'downwards arrow'
        ],
        [
          '8596',
          'left right arrow'
        ],
        [
          '8629',
          'carriage return'
        ],
        [
          '8656',
          'leftwards double arrow'
        ],
        [
          '8657',
          'upwards double arrow'
        ],
        [
          '8658',
          'rightwards double arrow'
        ],
        [
          '8659',
          'downwards double arrow'
        ],
        [
          '8660',
          'left right double arrow'
        ],
        [
          '8756',
          'therefore'
        ],
        [
          '8834',
          'subset of'
        ],
        [
          '8835',
          'superset of'
        ],
        [
          '8836',
          'not a subset of'
        ],
        [
          '8838',
          'subset of or equal to'
        ],
        [
          '8839',
          'superset of or equal to'
        ],
        [
          '8853',
          'circled plus'
        ],
        [
          '8855',
          'circled times'
        ],
        [
          '8869',
          'perpendicular'
        ],
        [
          '8901',
          'dot operator'
        ],
        [
          '8968',
          'left ceiling'
        ],
        [
          '8969',
          'right ceiling'
        ],
        [
          '8970',
          'left floor'
        ],
        [
          '8971',
          'right floor'
        ],
        [
          '9001',
          'left-pointing angle bracket'
        ],
        [
          '9002',
          'right-pointing angle bracket'
        ],
        [
          '9674',
          'lozenge'
        ],
        [
          '9824',
          'black spade suit'
        ],
        [
          '9827',
          'black club suit'
        ],
        [
          '9829',
          'black heart suit'
        ],
        [
          '9830',
          'black diamond suit'
        ],
        [
          '8194',
          'en space'
        ],
        [
          '8195',
          'em space'
        ],
        [
          '8201',
          'thin space'
        ],
        [
          '8204',
          'zero width non-joiner'
        ],
        [
          '8205',
          'zero width joiner'
        ],
        [
          '8206',
          'left-to-right mark'
        ],
        [
          '8207',
          'right-to-left mark'
        ]
      ];
    };
    var charmapfilter = function (charmap) {
      return global$1.grep(charmap, function (item) {
        return isarray(item) && item.length === 2;
      });
    };
    var getcharsfromsetting = function (settingvalue) {
      if (isarray(settingvalue)) {
        return [].concat(charmapfilter(settingvalue));
      }
      if (typeof settingvalue === 'function') {
        return settingvalue();
      }
      return [];
    };
    var extendcharmap = function (editor, charmap) {
      var usercharmap = settings.getcharmap(editor);
      if (usercharmap) {
        charmap = getcharsfromsetting(usercharmap);
      }
      var usercharmapappend = settings.getcharmapappend(editor);
      if (usercharmapappend) {
        return [].concat(charmap).concat(getcharsfromsetting(usercharmapappend));
      }
      return charmap;
    };
    var getcharmap$1 = function (editor) {
      return extendcharmap(editor, getdefaultcharmap());
    };
    var charmap = { getcharmap: getcharmap$1 };

    var get = function (editor) {
      var getcharmap = function () {
        return charmap.getcharmap(editor);
      };
      var insertchar = function (chr) {
        actions.insertchar(editor, chr);
      };
      return {
        getcharmap: getcharmap,
        insertchar: insertchar
      };
    };
    var api = { get: get };

    var gethtml = function (charmap) {
      var gridhtml, x, y;
      var width = math.min(charmap.length, 25);
      var height = math.ceil(charmap.length / width);
      gridhtml = '<table role="presentation" cellspacing="0" class="mce-charmap"><tbody>';
      for (y = 0; y < height; y++) {
        gridhtml += '<tr>';
        for (x = 0; x < width; x++) {
          var index = y * width + x;
          if (index < charmap.length) {
            var chr = charmap[index];
            var charcode = parseint(chr[0], 10);
            var chrtext = chr ? string.fromcharcode(charcode) : '&nbsp;';
            gridhtml += '<td title="' + chr[1] + '">' + '<div tabindex="-1" title="' + chr[1] + '" role="button" data-chr="' + charcode + '">' + chrtext + '</div>' + '</td>';
          } else {
            gridhtml += '<td />';
          }
        }
        gridhtml += '</tr>';
      }
      gridhtml += '</tbody></table>';
      return gridhtml;
    };
    var gridhtml = { gethtml: gethtml };

    var getparenttd = function (elm) {
      while (elm) {
        if (elm.nodename === 'td') {
          return elm;
        }
        elm = elm.parentnode;
      }
    };
    var open = function (editor) {
      var win;
      var charmappanel = {
        type: 'container',
        html: gridhtml.gethtml(charmap.getcharmap(editor)),
        onclick: function (e) {
          var target = e.target;
          if (/^(td|div)$/.test(target.nodename)) {
            var chardiv = getparenttd(target).firstchild;
            if (chardiv && chardiv.hasattribute('data-chr')) {
              var charcodestring = chardiv.getattribute('data-chr');
              var charcode = parseint(charcodestring, 10);
              if (!isnan(charcode)) {
                actions.insertchar(editor, string.fromcharcode(charcode));
              }
              if (!e.ctrlkey) {
                win.close();
              }
            }
          }
        },
        onmouseover: function (e) {
          var td = getparenttd(e.target);
          if (td && td.firstchild) {
            win.find('#preview').text(td.firstchild.firstchild.data);
            win.find('#previewtitle').text(td.title);
          } else {
            win.find('#preview').text(' ');
            win.find('#previewtitle').text(' ');
          }
        }
      };
      win = editor.windowmanager.open({
        title: 'special character',
        spacing: 10,
        padding: 10,
        items: [
          charmappanel,
          {
            type: 'container',
            layout: 'flex',
            direction: 'column',
            align: 'center',
            spacing: 5,
            minwidth: 160,
            minheight: 160,
            items: [
              {
                type: 'label',
                name: 'preview',
                text: ' ',
                style: 'font-size: 40px; text-align: center',
                border: 1,
                minwidth: 140,
                minheight: 80
              },
              {
                type: 'spacer',
                minheight: 20
              },
              {
                type: 'label',
                name: 'previewtitle',
                text: ' ',
                style: 'white-space: pre-wrap;',
                border: 1,
                minwidth: 140
              }
            ]
          }
        ],
        buttons: [{
            text: 'close',
            onclick: function () {
              win.close();
            }
          }]
      });
    };
    var dialog = { open: open };

    var register = function (editor) {
      editor.addcommand('mceshowcharmap', function () {
        dialog.open(editor);
      });
    };
    var commands = { register: register };

    var register$1 = function (editor) {
      editor.addbutton('charmap', {
        icon: 'charmap',
        tooltip: 'special character',
        cmd: 'mceshowcharmap'
      });
      editor.addmenuitem('charmap', {
        icon: 'charmap',
        text: 'special character',
        cmd: 'mceshowcharmap',
        context: 'insert'
      });
    };
    var buttons = { register: register$1 };

    global.add('charmap', function (editor) {
      commands.register(editor);
      buttons.register(editor);
      return api.get(editor);
    });
    function plugin () {
    }

    return plugin;

}());
})();








