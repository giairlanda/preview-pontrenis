(function () {
var paste = (function (domglobals) {
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

    var global$1 = tinymce.util.tools.resolve('tinymce.pluginmanager');

    var hasproplugin = function (editor) {
      if (/(^|[ ,])powerpaste([, ]|$)/.test(editor.settings.plugins) && global$1.get('powerpaste')) {
        if (typeof domglobals.window.console !== 'undefined' && domglobals.window.console.log) {
          domglobals.window.console.log('powerpaste is incompatible with paste plugin! remove \'paste\' from the \'plugins\' option.');
        }
        return true;
      } else {
        return false;
      }
    };
    var detectproplugin = { hasproplugin: hasproplugin };

    var get = function (clipboard, quirks) {
      return {
        clipboard: clipboard,
        quirks: quirks
      };
    };
    var api = { get: get };

    var firepastepreprocess = function (editor, html, internal, iswordhtml) {
      return editor.fire('pastepreprocess', {
        content: html,
        internal: internal,
        wordcontent: iswordhtml
      });
    };
    var firepastepostprocess = function (editor, node, internal, iswordhtml) {
      return editor.fire('pastepostprocess', {
        node: node,
        internal: internal,
        wordcontent: iswordhtml
      });
    };
    var firepasteplaintexttoggle = function (editor, state) {
      return editor.fire('pasteplaintexttoggle', { state: state });
    };
    var firepaste = function (editor, iefake) {
      return editor.fire('paste', { iefake: iefake });
    };
    var events = {
      firepastepreprocess: firepastepreprocess,
      firepastepostprocess: firepastepostprocess,
      firepasteplaintexttoggle: firepasteplaintexttoggle,
      firepaste: firepaste
    };

    var shouldplaintextinform = function (editor) {
      return editor.getparam('paste_plaintext_inform', true);
    };
    var shouldblockdrop = function (editor) {
      return editor.getparam('paste_block_drop', false);
    };
    var shouldpastedataimages = function (editor) {
      return editor.getparam('paste_data_images', false);
    };
    var shouldfilterdrop = function (editor) {
      return editor.getparam('paste_filter_drop', true);
    };
    var getpreprocess = function (editor) {
      return editor.getparam('paste_preprocess');
    };
    var getpostprocess = function (editor) {
      return editor.getparam('paste_postprocess');
    };
    var getwebkitstyles = function (editor) {
      return editor.getparam('paste_webkit_styles');
    };
    var shouldremovewebkitstyles = function (editor) {
      return editor.getparam('paste_remove_styles_if_webkit', true);
    };
    var shouldmergeformats = function (editor) {
      return editor.getparam('paste_merge_formats', true);
    };
    var issmartpasteenabled = function (editor) {
      return editor.getparam('smart_paste', true);
    };
    var ispasteastextenabled = function (editor) {
      return editor.getparam('paste_as_text', false);
    };
    var getretainstyleprops = function (editor) {
      return editor.getparam('paste_retain_style_properties');
    };
    var getwordvalidelements = function (editor) {
      var defaultvalidelements = '-strong/b,-em/i,-u,-span,-p,-ol,-ul,-li,-h1,-h2,-h3,-h4,-h5,-h6,' + '-p/div,-a[href|name],sub,sup,strike,br,del,table[width],tr,' + 'td[colspan|rowspan|width],th[colspan|rowspan|width],thead,tfoot,tbody';
      return editor.getparam('paste_word_valid_elements', defaultvalidelements);
    };
    var shouldconvertwordfakelists = function (editor) {
      return editor.getparam('paste_convert_word_fake_lists', true);
    };
    var shouldusedefaultfilters = function (editor) {
      return editor.getparam('paste_enable_default_filters', true);
    };
    var settings = {
      shouldplaintextinform: shouldplaintextinform,
      shouldblockdrop: shouldblockdrop,
      shouldpastedataimages: shouldpastedataimages,
      shouldfilterdrop: shouldfilterdrop,
      getpreprocess: getpreprocess,
      getpostprocess: getpostprocess,
      getwebkitstyles: getwebkitstyles,
      shouldremovewebkitstyles: shouldremovewebkitstyles,
      shouldmergeformats: shouldmergeformats,
      issmartpasteenabled: issmartpasteenabled,
      ispasteastextenabled: ispasteastextenabled,
      getretainstyleprops: getretainstyleprops,
      getwordvalidelements: getwordvalidelements,
      shouldconvertwordfakelists: shouldconvertwordfakelists,
      shouldusedefaultfilters: shouldusedefaultfilters
    };

    var shouldinformuseraboutplaintext = function (editor, userisinformedstate) {
      return userisinformedstate.get() === false && settings.shouldplaintextinform(editor);
    };
    var displaynotification = function (editor, message) {
      editor.notificationmanager.open({
        text: editor.translate(message),
        type: 'info'
      });
    };
    var toggleplaintextpaste = function (editor, clipboard, userisinformedstate) {
      if (clipboard.pasteformat.get() === 'text') {
        clipboard.pasteformat.set('html');
        events.firepasteplaintexttoggle(editor, false);
      } else {
        clipboard.pasteformat.set('text');
        events.firepasteplaintexttoggle(editor, true);
        if (shouldinformuseraboutplaintext(editor, userisinformedstate)) {
          displaynotification(editor, 'paste is now in plain text mode. contents will now be pasted as plain text until you toggle this option off.');
          userisinformedstate.set(true);
        }
      }
      editor.focus();
    };
    var actions = { toggleplaintextpaste: toggleplaintextpaste };

    var register = function (editor, clipboard, userisinformedstate) {
      editor.addcommand('mcetoggleplaintextpaste', function () {
        actions.toggleplaintextpaste(editor, clipboard, userisinformedstate);
      });
      editor.addcommand('mceinsertclipboardcontent', function (ui, value) {
        if (value.content) {
          clipboard.pastehtml(value.content, value.internal);
        }
        if (value.text) {
          clipboard.pastetext(value.text);
        }
      });
    };
    var commands = { register: register };

    var global$2 = tinymce.util.tools.resolve('tinymce.env');

    var global$3 = tinymce.util.tools.resolve('tinymce.util.delay');

    var global$4 = tinymce.util.tools.resolve('tinymce.util.tools');

    var global$5 = tinymce.util.tools.resolve('tinymce.util.vk');

    var internalmimetype = 'x-tinymce/html';
    var internalmark = '<!-- ' + internalmimetype + ' -->';
    var mark = function (html) {
      return internalmark + html;
    };
    var unmark = function (html) {
      return html.replace(internalmark, '');
    };
    var ismarked = function (html) {
      return html.indexof(internalmark) !== -1;
    };
    var internalhtml = {
      mark: mark,
      unmark: unmark,
      ismarked: ismarked,
      internalhtmlmime: function () {
        return internalmimetype;
      }
    };

    var global$6 = tinymce.util.tools.resolve('tinymce.html.entities');

    var isplaintext = function (text) {
      return !/<(?:\/?(?!(?:div|p|br|span)>)\w+|(?:(?!(?:span style="white-space:\s?pre;?">)|br\s?\/>))\w+\s[^>]+)>/i.test(text);
    };
    var tobrs = function (text) {
      return text.replace(/\r?\n/g, '<br>');
    };
    var opencontainer = function (roottag, rootattrs) {
      var key;
      var attrs = [];
      var tag = '<' + roottag;
      if (typeof rootattrs === 'object') {
        for (key in rootattrs) {
          if (rootattrs.hasownproperty(key)) {
            attrs.push(key + '="' + global$6.encodeallraw(rootattrs[key]) + '"');
          }
        }
        if (attrs.length) {
          tag += ' ' + attrs.join(' ');
        }
      }
      return tag + '>';
    };
    var toblockelements = function (text, roottag, rootattrs) {
      var blocks = text.split(/\n\n/);
      var tagopen = opencontainer(roottag, rootattrs);
      var tagclose = '</' + roottag + '>';
      var paragraphs = global$4.map(blocks, function (p) {
        return p.split(/\n/).join('<br />');
      });
      var stitch = function (p) {
        return tagopen + p + tagclose;
      };
      return paragraphs.length === 1 ? paragraphs[0] : global$4.map(paragraphs, stitch).join('');
    };
    var convert = function (text, roottag, rootattrs) {
      return roottag ? toblockelements(text, roottag, rootattrs) : tobrs(text);
    };
    var newlines = {
      isplaintext: isplaintext,
      convert: convert,
      tobrs: tobrs,
      toblockelements: toblockelements
    };

    var global$7 = tinymce.util.tools.resolve('tinymce.html.domparser');

    var global$8 = tinymce.util.tools.resolve('tinymce.html.serializer');

    var global$9 = tinymce.util.tools.resolve('tinymce.html.node');

    var global$a = tinymce.util.tools.resolve('tinymce.html.schema');

    function filter(content, items) {
      global$4.each(items, function (v) {
        if (v.constructor === regexp) {
          content = content.replace(v, '');
        } else {
          content = content.replace(v[0], v[1]);
        }
      });
      return content;
    }
    function innertext(html) {
      var schema = global$a();
      var domparser = global$7({}, schema);
      var text = '';
      var shortendedelements = schema.getshortendedelements();
      var ignoreelements = global$4.makemap('script noscript style textarea video audio iframe object', ' ');
      var blockelements = schema.getblockelements();
      function walk(node) {
        var name = node.name, currentnode = node;
        if (name === 'br') {
          text += '\n';
          return;
        }
        if (name === 'wbr') {
          return;
        }
        if (shortendedelements[name]) {
          text += ' ';
        }
        if (ignoreelements[name]) {
          text += ' ';
          return;
        }
        if (node.type === 3) {
          text += node.value;
        }
        if (!node.shortended) {
          if (node = node.firstchild) {
            do {
              walk(node);
            } while (node = node.next);
          }
        }
        if (blockelements[name] && currentnode.next) {
          text += '\n';
          if (name === 'p') {
            text += '\n';
          }
        }
      }
      html = filter(html, [/<!\[[^\]]+\]>/g]);
      walk(domparser.parse(html));
      return text;
    }
    function trimhtml(html) {
      function trimspaces(all, s1, s2) {
        if (!s1 && !s2) {
          return ' ';
        }
        return '\xa0';
      }
      html = filter(html, [
        /^[\s\s]*<body[^>]*>\s*|\s*<\/body[^>]*>[\s\s]*$/ig,
        /<!--startfragment-->|<!--endfragment-->/g,
        [
          /( ?)<span class="apple-converted-space">\u00a0<\/span>( ?)/g,
          trimspaces
        ],
        /<br class="apple-interchange-newline">/g,
        /<br>$/i
      ]);
      return html;
    }
    function createidgenerator(prefix) {
      var count = 0;
      return function () {
        return prefix + count++;
      };
    }
    var ismsedge = function () {
      return domglobals.navigator.useragent.indexof(' edge/') !== -1;
    };
    var utils = {
      filter: filter,
      innertext: innertext,
      trimhtml: trimhtml,
      createidgenerator: createidgenerator,
      ismsedge: ismsedge
    };

    function iswordcontent(content) {
      return /<font face="times new roman"|class="?mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:worddocument/i.test(content) || /class="outlineelement/.test(content) || /id="?docs\-internal\-guid\-/.test(content);
    }
    function isnumericlist(text) {
      var found, patterns;
      patterns = [
        /^[ivxlmcd]{1,2}\.[ \u00a0]/,
        /^[ivxlmcd]{1,2}\.[ \u00a0]/,
        /^[a-z]{1,2}[\.\)][ \u00a0]/,
        /^[a-z]{1,2}[\.\)][ \u00a0]/,
        /^[0-9]+\.[ \u00a0]/,
        /^[\u3007\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d]+\.[ \u00a0]/,
        /^[\u58f1\u5f10\u53c2\u56db\u4f0d\u516d\u4e03\u516b\u4e5d\u62fe]+\.[ \u00a0]/
      ];
      text = text.replace(/^[\u00a0 ]+/, '');
      global$4.each(patterns, function (pattern) {
        if (pattern.test(text)) {
          found = true;
          return false;
        }
      });
      return found;
    }
    function isbulletlist(text) {
      return /^[\s\u00a0]*[\u2022\u00b7\u00a7\u25cf]\s*/.test(text);
    }
    function convertfakeliststoproperlists(node) {
      var currentlistnode, prevlistnode, lastlevel = 1;
      function gettext(node) {
        var txt = '';
        if (node.type === 3) {
          return node.value;
        }
        if (node = node.firstchild) {
          do {
            txt += gettext(node);
          } while (node = node.next);
        }
        return txt;
      }
      function trimliststart(node, regexp) {
        if (node.type === 3) {
          if (regexp.test(node.value)) {
            node.value = node.value.replace(regexp, '');
            return false;
          }
        }
        if (node = node.firstchild) {
          do {
            if (!trimliststart(node, regexp)) {
              return false;
            }
          } while (node = node.next);
        }
        return true;
      }
      function removeignorednodes(node) {
        if (node._listignore) {
          node.remove();
          return;
        }
        if (node = node.firstchild) {
          do {
            removeignorednodes(node);
          } while (node = node.next);
        }
      }
      function convertparagraphtoli(paragraphnode, listname, start) {
        var level = paragraphnode._listlevel || lastlevel;
        if (level !== lastlevel) {
          if (level < lastlevel) {
            if (currentlistnode) {
              currentlistnode = currentlistnode.parent.parent;
            }
          } else {
            prevlistnode = currentlistnode;
            currentlistnode = null;
          }
        }
        if (!currentlistnode || currentlistnode.name !== listname) {
          prevlistnode = prevlistnode || currentlistnode;
          currentlistnode = new global$9(listname, 1);
          if (start > 1) {
            currentlistnode.attr('start', '' + start);
          }
          paragraphnode.wrap(currentlistnode);
        } else {
          currentlistnode.append(paragraphnode);
        }
        paragraphnode.name = 'li';
        if (level > lastlevel && prevlistnode) {
          prevlistnode.lastchild.append(currentlistnode);
        }
        lastlevel = level;
        removeignorednodes(paragraphnode);
        trimliststart(paragraphnode, /^\u00a0+/);
        trimliststart(paragraphnode, /^\s*([\u2022\u00b7\u00a7\u25cf]|\w+\.)/);
        trimliststart(paragraphnode, /^\u00a0+/);
      }
      var elements = [];
      var child = node.firstchild;
      while (typeof child !== 'undefined' && child !== null) {
        elements.push(child);
        child = child.walk();
        if (child !== null) {
          while (typeof child !== 'undefined' && child.parent !== node) {
            child = child.walk();
          }
        }
      }
      for (var i = 0; i < elements.length; i++) {
        node = elements[i];
        if (node.name === 'p' && node.firstchild) {
          var nodetext = gettext(node);
          if (isbulletlist(nodetext)) {
            convertparagraphtoli(node, 'ul');
            continue;
          }
          if (isnumericlist(nodetext)) {
            var matches = /([0-9]+)\./.exec(nodetext);
            var start = 1;
            if (matches) {
              start = parseint(matches[1], 10);
            }
            convertparagraphtoli(node, 'ol', start);
            continue;
          }
          if (node._listlevel) {
            convertparagraphtoli(node, 'ul', 1);
            continue;
          }
          currentlistnode = null;
        } else {
          prevlistnode = currentlistnode;
          currentlistnode = null;
        }
      }
    }
    function filterstyles(editor, validstyles, node, stylevalue) {
      var outputstyles = {}, matches;
      var styles = editor.dom.parsestyle(stylevalue);
      global$4.each(styles, function (value, name) {
        switch (name) {
        case 'mso-list':
          matches = /\w+ \w+([0-9]+)/i.exec(stylevalue);
          if (matches) {
            node._listlevel = parseint(matches[1], 10);
          }
          if (/ignore/i.test(value) && node.firstchild) {
            node._listignore = true;
            node.firstchild._listignore = true;
          }
          break;
        case 'horiz-align':
          name = 'text-align';
          break;
        case 'vert-align':
          name = 'vertical-align';
          break;
        case 'font-color':
        case 'mso-foreground':
          name = 'color';
          break;
        case 'mso-background':
        case 'mso-highlight':
          name = 'background';
          break;
        case 'font-weight':
        case 'font-style':
          if (value !== 'normal') {
            outputstyles[name] = value;
          }
          return;
        case 'mso-element':
          if (/^(comment|comment-list)$/i.test(value)) {
            node.remove();
            return;
          }
          break;
        }
        if (name.indexof('mso-comment') === 0) {
          node.remove();
          return;
        }
        if (name.indexof('mso-') === 0) {
          return;
        }
        if (settings.getretainstyleprops(editor) === 'all' || validstyles && validstyles[name]) {
          outputstyles[name] = value;
        }
      });
      if (/(bold)/i.test(outputstyles['font-weight'])) {
        delete outputstyles['font-weight'];
        node.wrap(new global$9('b', 1));
      }
      if (/(italic)/i.test(outputstyles['font-style'])) {
        delete outputstyles['font-style'];
        node.wrap(new global$9('i', 1));
      }
      outputstyles = editor.dom.serializestyle(outputstyles, node.name);
      if (outputstyles) {
        return outputstyles;
      }
      return null;
    }
    var filterwordcontent = function (editor, content) {
      var retainstyleproperties, validstyles;
      retainstyleproperties = settings.getretainstyleprops(editor);
      if (retainstyleproperties) {
        validstyles = global$4.makemap(retainstyleproperties.split(/[, ]/));
      }
      content = utils.filter(content, [
        /<br class="?apple-interchange-newline"?>/gi,
        /<b[^>]+id="?docs-internal-[^>]*>/gi,
        /<!--[\s\s]+?-->/gi,
        /<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|img|meta|link|style|\w:\w+)(?=[\s\/>]))[^>]*>/gi,
        [
          /<(\/?)s>/gi,
          '<$1strike>'
        ],
        [
          /&nbsp;/gi,
          '\xa0'
        ],
        [
          /<span\s+style\s*=\s*"\s*mso-spacerun\s*:\s*yes\s*;?\s*"\s*>([\s\u00a0]*)<\/span>/gi,
          function (str, spaces) {
            return spaces.length > 0 ? spaces.replace(/./, ' ').slice(math.floor(spaces.length / 2)).split('').join('\xa0') : '';
          }
        ]
      ]);
      var validelements = settings.getwordvalidelements(editor);
      var schema = global$a({
        valid_elements: validelements,
        valid_children: '-li[p]'
      });
      global$4.each(schema.elements, function (rule) {
        if (!rule.attributes.class) {
          rule.attributes.class = {};
          rule.attributesorder.push('class');
        }
        if (!rule.attributes.style) {
          rule.attributes.style = {};
          rule.attributesorder.push('style');
        }
      });
      var domparser = global$7({}, schema);
      domparser.addattributefilter('style', function (nodes) {
        var i = nodes.length, node;
        while (i--) {
          node = nodes[i];
          node.attr('style', filterstyles(editor, validstyles, node, node.attr('style')));
          if (node.name === 'span' && node.parent && !node.attributes.length) {
            node.unwrap();
          }
        }
      });
      domparser.addattributefilter('class', function (nodes) {
        var i = nodes.length, node, classname;
        while (i--) {
          node = nodes[i];
          classname = node.attr('class');
          if (/^(msocommentreference|msocommenttext|msodel)$/i.test(classname)) {
            node.remove();
          }
          node.attr('class', null);
        }
      });
      domparser.addnodefilter('del', function (nodes) {
        var i = nodes.length;
        while (i--) {
          nodes[i].remove();
        }
      });
      domparser.addnodefilter('a', function (nodes) {
        var i = nodes.length, node, href, name;
        while (i--) {
          node = nodes[i];
          href = node.attr('href');
          name = node.attr('name');
          if (href && href.indexof('#_msocom_') !== -1) {
            node.remove();
            continue;
          }
          if (href && href.indexof('file://') === 0) {
            href = href.split('#')[1];
            if (href) {
              href = '#' + href;
            }
          }
          if (!href && !name) {
            node.unwrap();
          } else {
            if (name && !/^_?(?:toc|edn|ftn)/i.test(name)) {
              node.unwrap();
              continue;
            }
            node.attr({
              href: href,
              name: name
            });
          }
        }
      });
      var rootnode = domparser.parse(content);
      if (settings.shouldconvertwordfakelists(editor)) {
        convertfakeliststoproperlists(rootnode);
      }
      content = global$8({ validate: editor.settings.validate }, schema).serialize(rootnode);
      return content;
    };
    var preprocess = function (editor, content) {
      return settings.shouldusedefaultfilters(editor) ? filterwordcontent(editor, content) : content;
    };
    var wordfilter = {
      preprocess: preprocess,
      iswordcontent: iswordcontent
    };

    var preprocess$1 = function (editor, html) {
      var parser = global$7({}, editor.schema);
      parser.addnodefilter('meta', function (nodes) {
        global$4.each(nodes, function (node) {
          return node.remove();
        });
      });
      var fragment = parser.parse(html, {
        forced_root_block: false,
        isrootcontent: true
      });
      return global$8({ validate: editor.settings.validate }, editor.schema).serialize(fragment);
    };
    var processresult = function (content, cancelled) {
      return {
        content: content,
        cancelled: cancelled
      };
    };
    var postprocessfilter = function (editor, html, internal, iswordhtml) {
      var tempbody = editor.dom.create('div', { style: 'display:none' }, html);
      var postprocessargs = events.firepastepostprocess(editor, tempbody, internal, iswordhtml);
      return processresult(postprocessargs.node.innerhtml, postprocessargs.isdefaultprevented());
    };
    var filtercontent = function (editor, content, internal, iswordhtml) {
      var preprocessargs = events.firepastepreprocess(editor, content, internal, iswordhtml);
      var filteredcontent = preprocess$1(editor, preprocessargs.content);
      if (editor.haseventlisteners('pastepostprocess') && !preprocessargs.isdefaultprevented()) {
        return postprocessfilter(editor, filteredcontent, internal, iswordhtml);
      } else {
        return processresult(filteredcontent, preprocessargs.isdefaultprevented());
      }
    };
    var process = function (editor, html, internal) {
      var iswordhtml = wordfilter.iswordcontent(html);
      var content = iswordhtml ? wordfilter.preprocess(editor, html) : html;
      return filtercontent(editor, content, internal, iswordhtml);
    };
    var processfilters = { process: process };

    var pastehtml = function (editor, html) {
      editor.insertcontent(html, {
        merge: settings.shouldmergeformats(editor),
        paste: true
      });
      return true;
    };
    var isabsoluteurl = function (url) {
      return /^https?:\/\/[\w\?\-\/+=.&%@~#]+$/i.test(url);
    };
    var isimageurl = function (url) {
      return isabsoluteurl(url) && /.(gif|jpe?g|png)$/.test(url);
    };
    var createimage = function (editor, url, pastehtmlfn) {
      editor.undomanager.extra(function () {
        pastehtmlfn(editor, url);
      }, function () {
        editor.insertcontent('<img src="' + url + '">');
      });
      return true;
    };
    var createlink = function (editor, url, pastehtmlfn) {
      editor.undomanager.extra(function () {
        pastehtmlfn(editor, url);
      }, function () {
        editor.execcommand('mceinsertlink', false, url);
      });
      return true;
    };
    var linkselection = function (editor, html, pastehtmlfn) {
      return editor.selection.iscollapsed() === false && isabsoluteurl(html) ? createlink(editor, html, pastehtmlfn) : false;
    };
    var insertimage = function (editor, html, pastehtmlfn) {
      return isimageurl(html) ? createimage(editor, html, pastehtmlfn) : false;
    };
    var smartinsertcontent = function (editor, html) {
      global$4.each([
        linkselection,
        insertimage,
        pastehtml
      ], function (action) {
        return action(editor, html, pastehtml) !== true;
      });
    };
    var insertcontent = function (editor, html) {
      if (settings.issmartpasteenabled(editor) === false) {
        pastehtml(editor, html);
      } else {
        smartinsertcontent(editor, html);
      }
    };
    var smartpaste = {
      isimageurl: isimageurl,
      isabsoluteurl: isabsoluteurl,
      insertcontent: insertcontent
    };

    var noop = function () {
    };
    var constant = function (value) {
      return function () {
        return value;
      };
    };
    function curry(fn) {
      var initialargs = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        initialargs[_i - 1] = arguments[_i];
      }
      return function () {
        var restargs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          restargs[_i] = arguments[_i];
        }
        var all = initialargs.concat(restargs);
        return fn.apply(null, all);
      };
    }
    var never = constant(false);
    var always = constant(true);

    var none = function () {
      return none;
    };
    var none = function () {
      var eq = function (o) {
        return o.isnone();
      };
      var call = function (thunk) {
        return thunk();
      };
      var id = function (n) {
        return n;
      };
      var me = {
        fold: function (n, s) {
          return n();
        },
        is: never,
        issome: never,
        isnone: always,
        getor: id,
        getorthunk: call,
        getordie: function (msg) {
          throw new error(msg || 'error: getordie called on none.');
        },
        getornull: constant(null),
        getorundefined: constant(undefined),
        or: id,
        orthunk: call,
        map: none,
        each: noop,
        bind: none,
        exists: never,
        forall: always,
        filter: none,
        equals: eq,
        equals_: eq,
        toarray: function () {
          return [];
        },
        tostring: constant('none()')
      };
      if (object.freeze) {
        object.freeze(me);
      }
      return me;
    }();
    var some = function (a) {
      var constant_a = constant(a);
      var self = function () {
        return me;
      };
      var bind = function (f) {
        return f(a);
      };
      var me = {
        fold: function (n, s) {
          return s(a);
        },
        is: function (v) {
          return a === v;
        },
        issome: always,
        isnone: never,
        getor: constant_a,
        getorthunk: constant_a,
        getordie: constant_a,
        getornull: constant_a,
        getorundefined: constant_a,
        or: self,
        orthunk: self,
        map: function (f) {
          return some(f(a));
        },
        each: function (f) {
          f(a);
        },
        bind: bind,
        exists: bind,
        forall: bind,
        filter: function (f) {
          return f(a) ? me : none;
        },
        toarray: function () {
          return [a];
        },
        tostring: function () {
          return 'some(' + a + ')';
        },
        equals: function (o) {
          return o.is(a);
        },
        equals_: function (o, elementeq) {
          return o.fold(never, function (b) {
            return elementeq(a, b);
          });
        }
      };
      return me;
    };
    var from = function (value) {
      return value === null || value === undefined ? none : some(value);
    };
    var option = {
      some: some,
      none: none,
      from: from
    };

    var typeof = function (x) {
      if (x === null) {
        return 'null';
      }
      var t = typeof x;
      if (t === 'object' && (array.prototype.isprototypeof(x) || x.constructor && x.constructor.name === 'array')) {
        return 'array';
      }
      if (t === 'object' && (string.prototype.isprototypeof(x) || x.constructor && x.constructor.name === 'string')) {
        return 'string';
      }
      return t;
    };
    var istype = function (type) {
      return function (value) {
        return typeof(value) === type;
      };
    };
    var isfunction = istype('function');

    var nativeslice = array.prototype.slice;
    var map = function (xs, f) {
      var len = xs.length;
      var r = new array(len);
      for (var i = 0; i < len; i++) {
        var x = xs[i];
        r[i] = f(x, i);
      }
      return r;
    };
    var each = function (xs, f) {
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        f(x, i);
      }
    };
    var filter$1 = function (xs, pred) {
      var r = [];
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        if (pred(x, i)) {
          r.push(x);
        }
      }
      return r;
    };
    var from$1 = isfunction(array.from) ? array.from : function (x) {
      return nativeslice.call(x);
    };

    var exports$1 = {}, module = { exports: exports$1 };
    (function (define, exports, module, require) {
      (function (f) {
        if (typeof exports === 'object' && typeof module !== 'undefined') {
          module.exports = f();
        } else if (typeof define === 'function' && define.amd) {
          define([], f);
        } else {
          var g;
          if (typeof window !== 'undefined') {
            g = window;
          } else if (typeof global !== 'undefined') {
            g = global;
          } else if (typeof self !== 'undefined') {
            g = self;
          } else {
            g = this;
          }
          g.ephoxcontactwrapper = f();
        }
      }(function () {
        return function () {
          function r(e, n, t) {
            function o(i, f) {
              if (!n[i]) {
                if (!e[i]) {
                  var c = 'function' == typeof require && require;
                  if (!f && c)
                    return c(i, !0);
                  if (u)
                    return u(i, !0);
                  var a = new error('cannot find module \'' + i + '\'');
                  throw a.code = 'module_not_found', a;
                }
                var p = n[i] = { exports: {} };
                e[i][0].call(p.exports, function (r) {
                  var n = e[i][1][r];
                  return o(n || r);
                }, p, p.exports, r, e, n, t);
              }
              return n[i].exports;
            }
            for (var u = 'function' == typeof require && require, i = 0; i < t.length; i++)
              o(t[i]);
            return o;
          }
          return r;
        }()({
          1: [
            function (require, module, exports) {
              var process = module.exports = {};
              var cachedsettimeout;
              var cachedcleartimeout;
              function defaultsettimout() {
                throw new error('settimeout has not been defined');
              }
              function defaultcleartimeout() {
                throw new error('cleartimeout has not been defined');
              }
              (function () {
                try {
                  if (typeof settimeout === 'function') {
                    cachedsettimeout = settimeout;
                  } else {
                    cachedsettimeout = defaultsettimout;
                  }
                } catch (e) {
                  cachedsettimeout = defaultsettimout;
                }
                try {
                  if (typeof cleartimeout === 'function') {
                    cachedcleartimeout = cleartimeout;
                  } else {
                    cachedcleartimeout = defaultcleartimeout;
                  }
                } catch (e) {
                  cachedcleartimeout = defaultcleartimeout;
                }
              }());
              function runtimeout(fun) {
                if (cachedsettimeout === settimeout) {
                  return settimeout(fun, 0);
                }
                if ((cachedsettimeout === defaultsettimout || !cachedsettimeout) && settimeout) {
                  cachedsettimeout = settimeout;
                  return settimeout(fun, 0);
                }
                try {
                  return cachedsettimeout(fun, 0);
                } catch (e) {
                  try {
                    return cachedsettimeout.call(null, fun, 0);
                  } catch (e) {
                    return cachedsettimeout.call(this, fun, 0);
                  }
                }
              }
              function runcleartimeout(marker) {
                if (cachedcleartimeout === cleartimeout) {
                  return cleartimeout(marker);
                }
                if ((cachedcleartimeout === defaultcleartimeout || !cachedcleartimeout) && cleartimeout) {
                  cachedcleartimeout = cleartimeout;
                  return cleartimeout(marker);
                }
                try {
                  return cachedcleartimeout(marker);
                } catch (e) {
                  try {
                    return cachedcleartimeout.call(null, marker);
                  } catch (e) {
                    return cachedcleartimeout.call(this, marker);
                  }
                }
              }
              var queue = [];
              var draining = false;
              var currentqueue;
              var queueindex = -1;
              function cleanupnexttick() {
                if (!draining || !currentqueue) {
                  return;
                }
                draining = false;
                if (currentqueue.length) {
                  queue = currentqueue.concat(queue);
                } else {
                  queueindex = -1;
                }
                if (queue.length) {
                  drainqueue();
                }
              }
              function drainqueue() {
                if (draining) {
                  return;
                }
                var timeout = runtimeout(cleanupnexttick);
                draining = true;
                var len = queue.length;
                while (len) {
                  currentqueue = queue;
                  queue = [];
                  while (++queueindex < len) {
                    if (currentqueue) {
                      currentqueue[queueindex].run();
                    }
                  }
                  queueindex = -1;
                  len = queue.length;
                }
                currentqueue = null;
                draining = false;
                runcleartimeout(timeout);
              }
              process.nexttick = function (fun) {
                var args = new array(arguments.length - 1);
                if (arguments.length > 1) {
                  for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                  }
                }
                queue.push(new item(fun, args));
                if (queue.length === 1 && !draining) {
                  runtimeout(drainqueue);
                }
              };
              function item(fun, array) {
                this.fun = fun;
                this.array = array;
              }
              item.prototype.run = function () {
                this.fun.apply(null, this.array);
              };
              process.title = 'browser';
              process.browser = true;
              process.env = {};
              process.argv = [];
              process.version = '';
              process.versions = {};
              function noop() {
              }
              process.on = noop;
              process.addlistener = noop;
              process.once = noop;
              process.off = noop;
              process.removelistener = noop;
              process.removealllisteners = noop;
              process.emit = noop;
              process.prependlistener = noop;
              process.prependoncelistener = noop;
              process.listeners = function (name) {
                return [];
              };
              process.binding = function (name) {
                throw new error('process.binding is not supported');
              };
              process.cwd = function () {
                return '/';
              };
              process.chdir = function (dir) {
                throw new error('process.chdir is not supported');
              };
              process.umask = function () {
                return 0;
              };
            },
            {}
          ],
          2: [
            function (require, module, exports) {
              (function (setimmediate) {
                (function (root) {
                  var settimeoutfunc = settimeout;
                  function noop() {
                  }
                  function bind(fn, thisarg) {
                    return function () {
                      fn.apply(thisarg, arguments);
                    };
                  }
                  function promise(fn) {
                    if (typeof this !== 'object')
                      throw new typeerror('promises must be constructed via new');
                    if (typeof fn !== 'function')
                      throw new typeerror('not a function');
                    this._state = 0;
                    this._handled = false;
                    this._value = undefined;
                    this._deferreds = [];
                    doresolve(fn, this);
                  }
                  function handle(self, deferred) {
                    while (self._state === 3) {
                      self = self._value;
                    }
                    if (self._state === 0) {
                      self._deferreds.push(deferred);
                      return;
                    }
                    self._handled = true;
                    promise._immediatefn(function () {
                      var cb = self._state === 1 ? deferred.onfulfilled : deferred.onrejected;
                      if (cb === null) {
                        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
                        return;
                      }
                      var ret;
                      try {
                        ret = cb(self._value);
                      } catch (e) {
                        reject(deferred.promise, e);
                        return;
                      }
                      resolve(deferred.promise, ret);
                    });
                  }
                  function resolve(self, newvalue) {
                    try {
                      if (newvalue === self)
                        throw new typeerror('a promise cannot be resolved with itself.');
                      if (newvalue && (typeof newvalue === 'object' || typeof newvalue === 'function')) {
                        var then = newvalue.then;
                        if (newvalue instanceof promise) {
                          self._state = 3;
                          self._value = newvalue;
                          finale(self);
                          return;
                        } else if (typeof then === 'function') {
                          doresolve(bind(then, newvalue), self);
                          return;
                        }
                      }
                      self._state = 1;
                      self._value = newvalue;
                      finale(self);
                    } catch (e) {
                      reject(self, e);
                    }
                  }
                  function reject(self, newvalue) {
                    self._state = 2;
                    self._value = newvalue;
                    finale(self);
                  }
                  function finale(self) {
                    if (self._state === 2 && self._deferreds.length === 0) {
                      promise._immediatefn(function () {
                        if (!self._handled) {
                          promise._unhandledrejectionfn(self._value);
                        }
                      });
                    }
                    for (var i = 0, len = self._deferreds.length; i < len; i++) {
                      handle(self, self._deferreds[i]);
                    }
                    self._deferreds = null;
                  }
                  function handler(onfulfilled, onrejected, promise) {
                    this.onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : null;
                    this.onrejected = typeof onrejected === 'function' ? onrejected : null;
                    this.promise = promise;
                  }
                  function doresolve(fn, self) {
                    var done = false;
                    try {
                      fn(function (value) {
                        if (done)
                          return;
                        done = true;
                        resolve(self, value);
                      }, function (reason) {
                        if (done)
                          return;
                        done = true;
                        reject(self, reason);
                      });
                    } catch (ex) {
                      if (done)
                        return;
                      done = true;
                      reject(self, ex);
                    }
                  }
                  promise.prototype['catch'] = function (onrejected) {
                    return this.then(null, onrejected);
                  };
                  promise.prototype.then = function (onfulfilled, onrejected) {
                    var prom = new this.constructor(noop);
                    handle(this, new handler(onfulfilled, onrejected, prom));
                    return prom;
                  };
                  promise.all = function (arr) {
                    var args = array.prototype.slice.call(arr);
                    return new promise(function (resolve, reject) {
                      if (args.length === 0)
                        return resolve([]);
                      var remaining = args.length;
                      function res(i, val) {
                        try {
                          if (val && (typeof val === 'object' || typeof val === 'function')) {
                            var then = val.then;
                            if (typeof then === 'function') {
                              then.call(val, function (val) {
                                res(i, val);
                              }, reject);
                              return;
                            }
                          }
                          args[i] = val;
                          if (--remaining === 0) {
                            resolve(args);
                          }
                        } catch (ex) {
                          reject(ex);
                        }
                      }
                      for (var i = 0; i < args.length; i++) {
                        res(i, args[i]);
                      }
                    });
                  };
                  promise.resolve = function (value) {
                    if (value && typeof value === 'object' && value.constructor === promise) {
                      return value;
                    }
                    return new promise(function (resolve) {
                      resolve(value);
                    });
                  };
                  promise.reject = function (value) {
                    return new promise(function (resolve, reject) {
                      reject(value);
                    });
                  };
                  promise.race = function (values) {
                    return new promise(function (resolve, reject) {
                      for (var i = 0, len = values.length; i < len; i++) {
                        values[i].then(resolve, reject);
                      }
                    });
                  };
                  promise._immediatefn = typeof setimmediate === 'function' ? function (fn) {
                    setimmediate(fn);
                  } : function (fn) {
                    settimeoutfunc(fn, 0);
                  };
                  promise._unhandledrejectionfn = function _unhandledrejectionfn(err) {
                    if (typeof console !== 'undefined' && console) {
                      console.warn('possible unhandled promise rejection:', err);
                    }
                  };
                  promise._setimmediatefn = function _setimmediatefn(fn) {
                    promise._immediatefn = fn;
                  };
                  promise._setunhandledrejectionfn = function _setunhandledrejectionfn(fn) {
                    promise._unhandledrejectionfn = fn;
                  };
                  if (typeof module !== 'undefined' && module.exports) {
                    module.exports = promise;
                  } else if (!root.promise) {
                    root.promise = promise;
                  }
                }(this));
              }.call(this, require('timers').setimmediate));
            },
            { 'timers': 3 }
          ],
          3: [
            function (require, module, exports) {
              (function (setimmediate, clearimmediate) {
                var nexttick = require('process/browser.js').nexttick;
                var apply = function.prototype.apply;
                var slice = array.prototype.slice;
                var immediateids = {};
                var nextimmediateid = 0;
                exports.settimeout = function () {
                  return new timeout(apply.call(settimeout, window, arguments), cleartimeout);
                };
                exports.setinterval = function () {
                  return new timeout(apply.call(setinterval, window, arguments), clearinterval);
                };
                exports.cleartimeout = exports.clearinterval = function (timeout) {
                  timeout.close();
                };
                function timeout(id, clearfn) {
                  this._id = id;
                  this._clearfn = clearfn;
                }
                timeout.prototype.unref = timeout.prototype.ref = function () {
                };
                timeout.prototype.close = function () {
                  this._clearfn.call(window, this._id);
                };
                exports.enroll = function (item, msecs) {
                  cleartimeout(item._idletimeoutid);
                  item._idletimeout = msecs;
                };
                exports.unenroll = function (item) {
                  cleartimeout(item._idletimeoutid);
                  item._idletimeout = -1;
                };
                exports._unrefactive = exports.active = function (item) {
                  cleartimeout(item._idletimeoutid);
                  var msecs = item._idletimeout;
                  if (msecs >= 0) {
                    item._idletimeoutid = settimeout(function ontimeout() {
                      if (item._ontimeout)
                        item._ontimeout();
                    }, msecs);
                  }
                };
                exports.setimmediate = typeof setimmediate === 'function' ? setimmediate : function (fn) {
                  var id = nextimmediateid++;
                  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
                  immediateids[id] = true;
                  nexttick(function onnexttick() {
                    if (immediateids[id]) {
                      if (args) {
                        fn.apply(null, args);
                      } else {
                        fn.call(null);
                      }
                      exports.clearimmediate(id);
                    }
                  });
                  return id;
                };
                exports.clearimmediate = typeof clearimmediate === 'function' ? clearimmediate : function (id) {
                  delete immediateids[id];
                };
              }.call(this, require('timers').setimmediate, require('timers').clearimmediate));
            },
            {
              'process/browser.js': 1,
              'timers': 3
            }
          ],
          4: [
            function (require, module, exports) {
              var promisepolyfill = require('promise-polyfill');
              var global = function () {
                if (typeof window !== 'undefined') {
                  return window;
                } else {
                  return function('return this;')();
                }
              }();
              module.exports = { boltexport: global.promise || promisepolyfill };
            },
            { 'promise-polyfill': 2 }
          ]
        }, {}, [4])(4);
      }));
    }(undefined, exports$1, module, undefined));
    var promise = module.exports.boltexport;

    var nu = function (basefn) {
      var data = option.none();
      var callbacks = [];
      var map = function (f) {
        return nu(function (ncallback) {
          get(function (data) {
            ncallback(f(data));
          });
        });
      };
      var get = function (ncallback) {
        if (isready()) {
          call(ncallback);
        } else {
          callbacks.push(ncallback);
        }
      };
      var set = function (x) {
        data = option.some(x);
        run(callbacks);
        callbacks = [];
      };
      var isready = function () {
        return data.issome();
      };
      var run = function (cbs) {
        each(cbs, call);
      };
      var call = function (cb) {
        data.each(function (x) {
          domglobals.settimeout(function () {
            cb(x);
          }, 0);
        });
      };
      basefn(set);
      return {
        get: get,
        map: map,
        isready: isready
      };
    };
    var pure = function (a) {
      return nu(function (callback) {
        callback(a);
      });
    };
    var lazyvalue = {
      nu: nu,
      pure: pure
    };

    var errorreporter = function (err) {
      domglobals.settimeout(function () {
        throw err;
      }, 0);
    };
    var make = function (run) {
      var get = function (callback) {
        run().then(callback, errorreporter);
      };
      var map = function (fab) {
        return make(function () {
          return run().then(fab);
        });
      };
      var bind = function (afutureb) {
        return make(function () {
          return run().then(function (v) {
            return afutureb(v).topromise();
          });
        });
      };
      var anonbind = function (futureb) {
        return make(function () {
          return run().then(function () {
            return futureb.topromise();
          });
        });
      };
      var tolazy = function () {
        return lazyvalue.nu(get);
      };
      var tocached = function () {
        var cache = null;
        return make(function () {
          if (cache === null) {
            cache = run();
          }
          return cache;
        });
      };
      var topromise = run;
      return {
        map: map,
        bind: bind,
        anonbind: anonbind,
        tolazy: tolazy,
        tocached: tocached,
        topromise: topromise,
        get: get
      };
    };
    var nu$1 = function (basefn) {
      return make(function () {
        return new promise(basefn);
      });
    };
    var pure$1 = function (a) {
      return make(function () {
        return promise.resolve(a);
      });
    };
    var future = {
      nu: nu$1,
      pure: pure$1
    };

    var par = function (asyncvalues, nu) {
      return nu(function (callback) {
        var r = [];
        var count = 0;
        var cb = function (i) {
          return function (value) {
            r[i] = value;
            count++;
            if (count >= asyncvalues.length) {
              callback(r);
            }
          };
        };
        if (asyncvalues.length === 0) {
          callback([]);
        } else {
          each(asyncvalues, function (asyncvalue, i) {
            asyncvalue.get(cb(i));
          });
        }
      });
    };

    var par$1 = function (futures) {
      return par(futures, future.nu);
    };
    var traverse = function (array, fn) {
      return par$1(map(array, fn));
    };
    var mapm = traverse;

    var value = function () {
      var subject = cell(option.none());
      var clear = function () {
        subject.set(option.none());
      };
      var set = function (s) {
        subject.set(option.some(s));
      };
      var on = function (f) {
        subject.get().each(f);
      };
      var isset = function () {
        return subject.get().issome();
      };
      return {
        clear: clear,
        set: set,
        isset: isset,
        on: on
      };
    };

    var pastehtml$1 = function (editor, html, internalflag) {
      var internal = internalflag ? internalflag : internalhtml.ismarked(html);
      var args = processfilters.process(editor, internalhtml.unmark(html), internal);
      if (args.cancelled === false) {
        smartpaste.insertcontent(editor, args.content);
      }
    };
    var pastetext = function (editor, text) {
      text = editor.dom.encode(text).replace(/\r\n/g, '\n');
      text = newlines.convert(text, editor.settings.forced_root_block, editor.settings.forced_root_block_attrs);
      pastehtml$1(editor, text, false);
    };
    var getdatatransferitems = function (datatransfer) {
      var items = {};
      var mceinternalurlprefix = 'data:text/mce-internal,';
      if (datatransfer) {
        if (datatransfer.getdata) {
          var legacytext = datatransfer.getdata('text');
          if (legacytext && legacytext.length > 0) {
            if (legacytext.indexof(mceinternalurlprefix) === -1) {
              items['text/plain'] = legacytext;
            }
          }
        }
        if (datatransfer.types) {
          for (var i = 0; i < datatransfer.types.length; i++) {
            var contenttype = datatransfer.types[i];
            try {
              items[contenttype] = datatransfer.getdata(contenttype);
            } catch (ex) {
              items[contenttype] = '';
            }
          }
        }
      }
      return items;
    };
    var getclipboardcontent = function (editor, clipboardevent) {
      var content = getdatatransferitems(clipboardevent.clipboarddata || editor.getdoc().datatransfer);
      return utils.ismsedge() ? global$4.extend(content, { 'text/html': '' }) : content;
    };
    var hascontenttype = function (clipboardcontent, mimetype) {
      return mimetype in clipboardcontent && clipboardcontent[mimetype].length > 0;
    };
    var hashtmlortext = function (content) {
      return hascontenttype(content, 'text/html') || hascontenttype(content, 'text/plain');
    };
    var getbase64fromuri = function (uri) {
      var idx;
      idx = uri.indexof(',');
      if (idx !== -1) {
        return uri.substr(idx + 1);
      }
      return null;
    };
    var isvaliddatauriimage = function (settings, imgelm) {
      return settings.images_dataimg_filter ? settings.images_dataimg_filter(imgelm) : true;
    };
    var extractfilename = function (editor, str) {
      var m = str.match(/([\s\s]+?)\.(?:jpeg|jpg|png|gif)$/i);
      return m ? editor.dom.encode(m[1]) : null;
    };
    var uniqueid = utils.createidgenerator('mceclip');
    var pasteimage = function (editor, imageitem) {
      var base64 = getbase64fromuri(imageitem.uri);
      var id = uniqueid();
      var name = editor.settings.images_reuse_filename && imageitem.blob.name ? extractfilename(editor, imageitem.blob.name) : id;
      var img = new domglobals.image();
      img.src = imageitem.uri;
      if (isvaliddatauriimage(editor.settings, img)) {
        var blobcache = editor.editorupload.blobcache;
        var blobinfo = void 0, existingblobinfo = void 0;
        existingblobinfo = blobcache.findfirst(function (cachedblobinfo) {
          return cachedblobinfo.base64() === base64;
        });
        if (!existingblobinfo) {
          blobinfo = blobcache.create(id, imageitem.blob, base64, name);
          blobcache.add(blobinfo);
        } else {
          blobinfo = existingblobinfo;
        }
        pastehtml$1(editor, '<img src="' + blobinfo.bloburi() + '">', false);
      } else {
        pastehtml$1(editor, '<img src="' + imageitem.uri + '">', false);
      }
    };
    var isclipboardevent = function (event) {
      return event.type === 'paste';
    };
    var readblobsasdatauris = function (items) {
      return mapm(items, function (item) {
        return future.nu(function (resolve) {
          var blob = item.getasfile ? item.getasfile() : item;
          var reader = new window.filereader();
          reader.onload = function () {
            resolve({
              blob: blob,
              uri: reader.result
            });
          };
          reader.readasdataurl(blob);
        });
      });
    };
    var getimagesfromdatatransfer = function (datatransfer) {
      var items = datatransfer.items ? map(from$1(datatransfer.items), function (item) {
        return item.getasfile();
      }) : [];
      var files = datatransfer.files ? from$1(datatransfer.files) : [];
      var images = filter$1(items.length > 0 ? items : files, function (file) {
        return /^image\/(jpeg|png|gif|bmp)$/.test(file.type);
      });
      return images;
    };
    var pasteimagedata = function (editor, e, rng) {
      var datatransfer = isclipboardevent(e) ? e.clipboarddata : e.datatransfer;
      if (editor.settings.paste_data_images && datatransfer) {
        var images = getimagesfromdatatransfer(datatransfer);
        if (images.length > 0) {
          e.preventdefault();
          readblobsasdatauris(images).get(function (blobresults) {
            if (rng) {
              editor.selection.setrng(rng);
            }
            each(blobresults, function (result) {
              pasteimage(editor, result);
            });
          });
          return true;
        }
      }
      return false;
    };
    var isbrokenandroidclipboardevent = function (e) {
      var clipboarddata = e.clipboarddata;
      return domglobals.navigator.useragent.indexof('android') !== -1 && clipboarddata && clipboarddata.items && clipboarddata.items.length === 0;
    };
    var iskeyboardpasteevent = function (e) {
      return global$5.metakeypressed(e) && e.keycode === 86 || e.shiftkey && e.keycode === 45;
    };
    var registereventhandlers = function (editor, pastebin, pasteformat) {
      var keyboardpasteevent = value();
      var keyboardpasteplaintextstate;
      editor.on('keydown', function (e) {
        function removepastebinonkeyup(e) {
          if (iskeyboardpasteevent(e) && !e.isdefaultprevented()) {
            pastebin.remove();
          }
        }
        if (iskeyboardpasteevent(e) && !e.isdefaultprevented()) {
          keyboardpasteplaintextstate = e.shiftkey && e.keycode === 86;
          if (keyboardpasteplaintextstate && global$2.webkit && domglobals.navigator.useragent.indexof('version/') !== -1) {
            return;
          }
          e.stopimmediatepropagation();
          keyboardpasteevent.set(e);
          window.settimeout(function () {
            keyboardpasteevent.clear();
          }, 100);
          if (global$2.ie && keyboardpasteplaintextstate) {
            e.preventdefault();
            events.firepaste(editor, true);
            return;
          }
          pastebin.remove();
          pastebin.create();
          editor.once('keyup', removepastebinonkeyup);
          editor.once('paste', function () {
            editor.off('keyup', removepastebinonkeyup);
          });
        }
      });
      function insertclipboardcontent(clipboardcontent, iskeyboardpaste, plaintextmode, internal) {
        var content, isplaintexthtml;
        if (hascontenttype(clipboardcontent, 'text/html')) {
          content = clipboardcontent['text/html'];
        } else {
          content = pastebin.gethtml();
          internal = internal ? internal : internalhtml.ismarked(content);
          if (pastebin.isdefaultcontent(content)) {
            plaintextmode = true;
          }
        }
        content = utils.trimhtml(content);
        pastebin.remove();
        isplaintexthtml = internal === false && newlines.isplaintext(content);
        if (!content.length || isplaintexthtml) {
          plaintextmode = true;
        }
        if (plaintextmode) {
          if (hascontenttype(clipboardcontent, 'text/plain') && isplaintexthtml) {
            content = clipboardcontent['text/plain'];
          } else {
            content = utils.innertext(content);
          }
        }
        if (pastebin.isdefaultcontent(content)) {
          if (!iskeyboardpaste) {
            editor.windowmanager.alert('please use ctrl+v/cmd+v keyboard shortcuts to paste contents.');
          }
          return;
        }
        if (plaintextmode) {
          pastetext(editor, content);
        } else {
          pastehtml$1(editor, content, internal);
        }
      }
      var getlastrng = function () {
        return pastebin.getlastrng() || editor.selection.getrng();
      };
      editor.on('paste', function (e) {
        var iskeyboardpaste = keyboardpasteevent.isset();
        var clipboardcontent = getclipboardcontent(editor, e);
        var plaintextmode = pasteformat.get() === 'text' || keyboardpasteplaintextstate;
        var internal = hascontenttype(clipboardcontent, internalhtml.internalhtmlmime());
        keyboardpasteplaintextstate = false;
        if (e.isdefaultprevented() || isbrokenandroidclipboardevent(e)) {
          pastebin.remove();
          return;
        }
        if (!hashtmlortext(clipboardcontent) && pasteimagedata(editor, e, getlastrng())) {
          pastebin.remove();
          return;
        }
        if (!iskeyboardpaste) {
          e.preventdefault();
        }
        if (global$2.ie && (!iskeyboardpaste || e.iefake) && !hascontenttype(clipboardcontent, 'text/html')) {
          pastebin.create();
          editor.dom.bind(pastebin.getel(), 'paste', function (e) {
            e.stoppropagation();
          });
          editor.getdoc().execcommand('paste', false, null);
          clipboardcontent['text/html'] = pastebin.gethtml();
        }
        if (hascontenttype(clipboardcontent, 'text/html')) {
          e.preventdefault();
          if (!internal) {
            internal = internalhtml.ismarked(clipboardcontent['text/html']);
          }
          insertclipboardcontent(clipboardcontent, iskeyboardpaste, plaintextmode, internal);
        } else {
          global$3.seteditortimeout(editor, function () {
            insertclipboardcontent(clipboardcontent, iskeyboardpaste, plaintextmode, internal);
          }, 0);
        }
      });
    };
    var registereventsandfilters = function (editor, pastebin, pasteformat) {
      registereventhandlers(editor, pastebin, pasteformat);
      var src;
      editor.parser.addnodefilter('img', function (nodes, name, args) {
        var ispasteinsert = function (args) {
          return args.data && args.data.paste === true;
        };
        var remove = function (node) {
          if (!node.attr('data-mce-object') && src !== global$2.transparentsrc) {
            node.remove();
          }
        };
        var iswebkitfakeurl = function (src) {
          return src.indexof('webkit-fake-url') === 0;
        };
        var isdatauri = function (src) {
          return src.indexof('data:') === 0;
        };
        if (!editor.settings.paste_data_images && ispasteinsert(args)) {
          var i = nodes.length;
          while (i--) {
            src = nodes[i].attributes.map.src;
            if (!src) {
              continue;
            }
            if (iswebkitfakeurl(src)) {
              remove(nodes[i]);
            } else if (!editor.settings.allow_html_data_urls && isdatauri(src)) {
              remove(nodes[i]);
            }
          }
        }
      });
    };

    var getpastebinparent = function (editor) {
      return global$2.ie && editor.inline ? domglobals.document.body : editor.getbody();
    };
    var isexternalpastebin = function (editor) {
      return getpastebinparent(editor) !== editor.getbody();
    };
    var delegatepasteevents = function (editor, pastebinelm, pastebindefaultcontent) {
      if (isexternalpastebin(editor)) {
        editor.dom.bind(pastebinelm, 'paste keyup', function (e) {
          if (!isdefault(editor, pastebindefaultcontent)) {
            editor.fire('paste');
          }
        });
      }
    };
    var create = function (editor, lastrngcell, pastebindefaultcontent) {
      var dom = editor.dom, body = editor.getbody();
      var pastebinelm;
      lastrngcell.set(editor.selection.getrng());
      pastebinelm = editor.dom.add(getpastebinparent(editor), 'div', {
        'id': 'mcepastebin',
        'class': 'mce-pastebin',
        'contenteditable': true,
        'data-mce-bogus': 'all',
        'style': 'position: fixed; top: 50%; width: 10px; height: 10px; overflow: hidden; opacity: 0'
      }, pastebindefaultcontent);
      if (global$2.ie || global$2.gecko) {
        dom.setstyle(pastebinelm, 'left', dom.getstyle(body, 'direction', true) === 'rtl' ? 65535 : -65535);
      }
      dom.bind(pastebinelm, 'beforedeactivate focusin focusout', function (e) {
        e.stoppropagation();
      });
      delegatepasteevents(editor, pastebinelm, pastebindefaultcontent);
      pastebinelm.focus();
      editor.selection.select(pastebinelm, true);
    };
    var remove = function (editor, lastrngcell) {
      if (getel(editor)) {
        var pastebinclone = void 0;
        var lastrng = lastrngcell.get();
        while (pastebinclone = editor.dom.get('mcepastebin')) {
          editor.dom.remove(pastebinclone);
          editor.dom.unbind(pastebinclone);
        }
        if (lastrng) {
          editor.selection.setrng(lastrng);
        }
      }
      lastrngcell.set(null);
    };
    var getel = function (editor) {
      return editor.dom.get('mcepastebin');
    };
    var gethtml = function (editor) {
      var pastebinelm, pastebinclones, i, dirtywrappers, cleanwrapper;
      var copyandremove = function (toelm, fromelm) {
        toelm.appendchild(fromelm);
        editor.dom.remove(fromelm, true);
      };
      pastebinclones = global$4.grep(getpastebinparent(editor).childnodes, function (elm) {
        return elm.id === 'mcepastebin';
      });
      pastebinelm = pastebinclones.shift();
      global$4.each(pastebinclones, function (pastebinclone) {
        copyandremove(pastebinelm, pastebinclone);
      });
      dirtywrappers = editor.dom.select('div[id=mcepastebin]', pastebinelm);
      for (i = dirtywrappers.length - 1; i >= 0; i--) {
        cleanwrapper = editor.dom.create('div');
        pastebinelm.insertbefore(cleanwrapper, dirtywrappers[i]);
        copyandremove(cleanwrapper, dirtywrappers[i]);
      }
      return pastebinelm ? pastebinelm.innerhtml : '';
    };
    var getlastrng = function (lastrng) {
      return lastrng.get();
    };
    var isdefaultcontent = function (pastebindefaultcontent, content) {
      return content === pastebindefaultcontent;
    };
    var ispastebin = function (elm) {
      return elm && elm.id === 'mcepastebin';
    };
    var isdefault = function (editor, pastebindefaultcontent) {
      var pastebinelm = getel(editor);
      return ispastebin(pastebinelm) && isdefaultcontent(pastebindefaultcontent, pastebinelm.innerhtml);
    };
    var pastebin = function (editor) {
      var lastrng = cell(null);
      var pastebindefaultcontent = '%mcepastebin%';
      return {
        create: function () {
          return create(editor, lastrng, pastebindefaultcontent);
        },
        remove: function () {
          return remove(editor, lastrng);
        },
        getel: function () {
          return getel(editor);
        },
        gethtml: function () {
          return gethtml(editor);
        },
        getlastrng: function () {
          return getlastrng(lastrng);
        },
        isdefault: function () {
          return isdefault(editor, pastebindefaultcontent);
        },
        isdefaultcontent: function (content) {
          return isdefaultcontent(pastebindefaultcontent, content);
        }
      };
    };

    var clipboard = function (editor, pasteformat) {
      var pastebin = pastebin(editor);
      editor.on('preinit', function () {
        return registereventsandfilters(editor, pastebin, pasteformat);
      });
      return {
        pasteformat: pasteformat,
        pastehtml: function (html, internalflag) {
          return pastehtml$1(editor, html, internalflag);
        },
        pastetext: function (text) {
          return pastetext(editor, text);
        },
        pasteimagedata: function (e, rng) {
          return pasteimagedata(editor, e, rng);
        },
        getdatatransferitems: getdatatransferitems,
        hashtmlortext: hashtmlortext,
        hascontenttype: hascontenttype
      };
    };

    var noop$1 = function () {
    };
    var hasworkingclipboardapi = function (clipboarddata) {
      return global$2.ios === false && clipboarddata !== undefined && typeof clipboarddata.setdata === 'function' && utils.ismsedge() !== true;
    };
    var sethtml5clipboard = function (clipboarddata, html, text) {
      if (hasworkingclipboardapi(clipboarddata)) {
        try {
          clipboarddata.cleardata();
          clipboarddata.setdata('text/html', html);
          clipboarddata.setdata('text/plain', text);
          clipboarddata.setdata(internalhtml.internalhtmlmime(), html);
          return true;
        } catch (e) {
          return false;
        }
      } else {
        return false;
      }
    };
    var setclipboarddata = function (evt, data, fallback, done) {
      if (sethtml5clipboard(evt.clipboarddata, data.html, data.text)) {
        evt.preventdefault();
        done();
      } else {
        fallback(data.html, done);
      }
    };
    var fallback = function (editor) {
      return function (html, done) {
        var markedhtml = internalhtml.mark(html);
        var outer = editor.dom.create('div', {
          'contenteditable': 'false',
          'data-mce-bogus': 'all'
        });
        var inner = editor.dom.create('div', { contenteditable: 'true' }, markedhtml);
        editor.dom.setstyles(outer, {
          position: 'fixed',
          top: '0',
          left: '-3000px',
          width: '1000px',
          overflow: 'hidden'
        });
        outer.appendchild(inner);
        editor.dom.add(editor.getbody(), outer);
        var range = editor.selection.getrng();
        inner.focus();
        var offscreenrange = editor.dom.createrng();
        offscreenrange.selectnodecontents(inner);
        editor.selection.setrng(offscreenrange);
        settimeout(function () {
          editor.selection.setrng(range);
          outer.parentnode.removechild(outer);
          done();
        }, 0);
      };
    };
    var getdata = function (editor) {
      return {
        html: editor.selection.getcontent({ contextual: true }),
        text: editor.selection.getcontent({ format: 'text' })
      };
    };
    var istableselection = function (editor) {
      return !!editor.dom.getparent(editor.selection.getstart(), 'td[data-mce-selected],th[data-mce-selected]', editor.getbody());
    };
    var hasselectedcontent = function (editor) {
      return !editor.selection.iscollapsed() || istableselection(editor);
    };
    var cut = function (editor) {
      return function (evt) {
        if (hasselectedcontent(editor)) {
          setclipboarddata(evt, getdata(editor), fallback(editor), function () {
            settimeout(function () {
              editor.execcommand('delete');
            }, 0);
          });
        }
      };
    };
    var copy = function (editor) {
      return function (evt) {
        if (hasselectedcontent(editor)) {
          setclipboarddata(evt, getdata(editor), fallback(editor), noop$1);
        }
      };
    };
    var register$1 = function (editor) {
      editor.on('cut', cut(editor));
      editor.on('copy', copy(editor));
    };
    var cutcopy = { register: register$1 };

    var global$b = tinymce.util.tools.resolve('tinymce.dom.rangeutils');

    var getcaretrangefromevent = function (editor, e) {
      return global$b.getcaretrangefrompoint(e.clientx, e.clienty, editor.getdoc());
    };
    var isplaintextfileurl = function (content) {
      var plaintextcontent = content['text/plain'];
      return plaintextcontent ? plaintextcontent.indexof('file://') === 0 : false;
    };
    var setfocusedrange = function (editor, rng) {
      editor.focus();
      editor.selection.setrng(rng);
    };
    var setup = function (editor, clipboard, dragginginternallystate) {
      if (settings.shouldblockdrop(editor)) {
        editor.on('dragend dragover draggesture dragdrop drop drag', function (e) {
          e.preventdefault();
          e.stoppropagation();
        });
      }
      if (!settings.shouldpastedataimages(editor)) {
        editor.on('drop', function (e) {
          var datatransfer = e.datatransfer;
          if (datatransfer && datatransfer.files && datatransfer.files.length > 0) {
            e.preventdefault();
          }
        });
      }
      editor.on('drop', function (e) {
        var dropcontent, rng;
        rng = getcaretrangefromevent(editor, e);
        if (e.isdefaultprevented() || dragginginternallystate.get()) {
          return;
        }
        dropcontent = clipboard.getdatatransferitems(e.datatransfer);
        var internal = clipboard.hascontenttype(dropcontent, internalhtml.internalhtmlmime());
        if ((!clipboard.hashtmlortext(dropcontent) || isplaintextfileurl(dropcontent)) && clipboard.pasteimagedata(e, rng)) {
          return;
        }
        if (rng && settings.shouldfilterdrop(editor)) {
          var content_1 = dropcontent['mce-internal'] || dropcontent['text/html'] || dropcontent['text/plain'];
          if (content_1) {
            e.preventdefault();
            global$3.seteditortimeout(editor, function () {
              editor.undomanager.transact(function () {
                if (dropcontent['mce-internal']) {
                  editor.execcommand('delete');
                }
                setfocusedrange(editor, rng);
                content_1 = utils.trimhtml(content_1);
                if (!dropcontent['text/html']) {
                  clipboard.pastetext(content_1);
                } else {
                  clipboard.pastehtml(content_1, internal);
                }
              });
            });
          }
        }
      });
      editor.on('dragstart', function (e) {
        dragginginternallystate.set(true);
      });
      editor.on('dragover dragend', function (e) {
        if (settings.shouldpastedataimages(editor) && dragginginternallystate.get() === false) {
          e.preventdefault();
          setfocusedrange(editor, getcaretrangefromevent(editor, e));
        }
        if (e.type === 'dragend') {
          dragginginternallystate.set(false);
        }
      });
    };
    var dragdrop = { setup: setup };

    var setup$1 = function (editor) {
      var plugin = editor.plugins.paste;
      var preprocess = settings.getpreprocess(editor);
      if (preprocess) {
        editor.on('pastepreprocess', function (e) {
          preprocess.call(plugin, plugin, e);
        });
      }
      var postprocess = settings.getpostprocess(editor);
      if (postprocess) {
        editor.on('pastepostprocess', function (e) {
          postprocess.call(plugin, plugin, e);
        });
      }
    };
    var prepostprocess = { setup: setup$1 };

    function addpreprocessfilter(editor, filterfunc) {
      editor.on('pastepreprocess', function (e) {
        e.content = filterfunc(editor, e.content, e.internal, e.wordcontent);
      });
    }
    function addpostprocessfilter(editor, filterfunc) {
      editor.on('pastepostprocess', function (e) {
        filterfunc(editor, e.node);
      });
    }
    function removeexplorerbrelementsafterblocks(editor, html) {
      if (!wordfilter.iswordcontent(html)) {
        return html;
      }
      var blockelements = [];
      global$4.each(editor.schema.getblockelements(), function (block, blockname) {
        blockelements.push(blockname);
      });
      var explorerblocksregexp = new regexp('(?:<br>&nbsp;[\\s\\r\\n]+|<br>)*(<\\/?(' + blockelements.join('|') + ')[^>]*>)(?:<br>&nbsp;[\\s\\r\\n]+|<br>)*', 'g');
      html = utils.filter(html, [[
          explorerblocksregexp,
          '$1'
        ]]);
      html = utils.filter(html, [
        [
          /<br><br>/g,
          '<br><br>'
        ],
        [
          /<br>/g,
          ' '
        ],
        [
          /<br><br>/g,
          '<br>'
        ]
      ]);
      return html;
    }
    function removewebkitstyles(editor, content, internal, iswordhtml) {
      if (iswordhtml || internal) {
        return content;
      }
      var webkitstylessetting = settings.getwebkitstyles(editor);
      var webkitstyles;
      if (settings.shouldremovewebkitstyles(editor) === false || webkitstylessetting === 'all') {
        return content;
      }
      if (webkitstylessetting) {
        webkitstyles = webkitstylessetting.split(/[, ]/);
      }
      if (webkitstyles) {
        var dom_1 = editor.dom, node_1 = editor.selection.getnode();
        content = content.replace(/(<[^>]+) style="([^"]*)"([^>]*>)/gi, function (all, before, value, after) {
          var inputstyles = dom_1.parsestyle(dom_1.decode(value));
          var outputstyles = {};
          if (webkitstyles === 'none') {
            return before + after;
          }
          for (var i = 0; i < webkitstyles.length; i++) {
            var inputvalue = inputstyles[webkitstyles[i]], currentvalue = dom_1.getstyle(node_1, webkitstyles[i], true);
            if (/color/.test(webkitstyles[i])) {
              inputvalue = dom_1.tohex(inputvalue);
              currentvalue = dom_1.tohex(currentvalue);
            }
            if (currentvalue !== inputvalue) {
              outputstyles[webkitstyles[i]] = inputvalue;
            }
          }
          outputstyles = dom_1.serializestyle(outputstyles, 'span');
          if (outputstyles) {
            return before + ' style="' + outputstyles + '"' + after;
          }
          return before + after;
        });
      } else {
        content = content.replace(/(<[^>]+) style="([^"]*)"([^>]*>)/gi, '$1$3');
      }
      content = content.replace(/(<[^>]+) data-mce-style="([^"]+)"([^>]*>)/gi, function (all, before, value, after) {
        return before + ' style="' + value + '"' + after;
      });
      return content;
    }
    function removeunderlineandfontinanchor(editor, root) {
      editor.$('a', root).find('font,u').each(function (i, node) {
        editor.dom.remove(node, true);
      });
    }
    var setup$2 = function (editor) {
      if (global$2.webkit) {
        addpreprocessfilter(editor, removewebkitstyles);
      }
      if (global$2.ie) {
        addpreprocessfilter(editor, removeexplorerbrelementsafterblocks);
        addpostprocessfilter(editor, removeunderlineandfontinanchor);
      }
    };
    var quirks = { setup: setup$2 };

    var statechange = function (editor, clipboard, e) {
      var ctrl = e.control;
      ctrl.active(clipboard.pasteformat.get() === 'text');
      editor.on('pasteplaintexttoggle', function (e) {
        ctrl.active(e.state);
      });
    };
    var register$2 = function (editor, clipboard) {
      var postrender = curry(statechange, editor, clipboard);
      editor.addbutton('pastetext', {
        active: false,
        icon: 'pastetext',
        tooltip: 'paste as text',
        cmd: 'mcetoggleplaintextpaste',
        onpostrender: postrender
      });
      editor.addmenuitem('pastetext', {
        text: 'paste as text',
        selectable: true,
        active: clipboard.pasteformat,
        cmd: 'mcetoggleplaintextpaste',
        onpostrender: postrender
      });
    };
    var buttons = { register: register$2 };

    global$1.add('paste', function (editor) {
      if (detectproplugin.hasproplugin(editor) === false) {
        var userisinformedstate = cell(false);
        var dragginginternallystate = cell(false);
        var pasteformat = cell(settings.ispasteastextenabled(editor) ? 'text' : 'html');
        var clipboard = clipboard(editor, pasteformat);
        var quirks = quirks.setup(editor);
        buttons.register(editor, clipboard);
        commands.register(editor, clipboard, userisinformedstate);
        prepostprocess.setup(editor);
        cutcopy.register(editor);
        dragdrop.setup(editor, clipboard, dragginginternallystate);
        return api.get(clipboard, quirks);
      }
    });
    function plugin () {
    }

    return plugin;

}(window));
})();




