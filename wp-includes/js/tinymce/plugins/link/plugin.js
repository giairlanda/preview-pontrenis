(function () {
var link = (function (domglobals) {
    'use strict';

    var global = tinymce.util.tools.resolve('tinymce.pluginmanager');

    var global$1 = tinymce.util.tools.resolve('tinymce.util.vk');

    var assumeexternaltargets = function (editorsettings) {
      return typeof editorsettings.link_assume_external_targets === 'boolean' ? editorsettings.link_assume_external_targets : false;
    };
    var hascontexttoolbar = function (editorsettings) {
      return typeof editorsettings.link_context_toolbar === 'boolean' ? editorsettings.link_context_toolbar : false;
    };
    var getlinklist = function (editorsettings) {
      return editorsettings.link_list;
    };
    var hasdefaultlinktarget = function (editorsettings) {
      return typeof editorsettings.default_link_target === 'string';
    };
    var getdefaultlinktarget = function (editorsettings) {
      return editorsettings.default_link_target;
    };
    var gettargetlist = function (editorsettings) {
      return editorsettings.target_list;
    };
    var settargetlist = function (editor, list) {
      editor.settings.target_list = list;
    };
    var shouldshowtargetlist = function (editorsettings) {
      return gettargetlist(editorsettings) !== false;
    };
    var getrellist = function (editorsettings) {
      return editorsettings.rel_list;
    };
    var hasrellist = function (editorsettings) {
      return getrellist(editorsettings) !== undefined;
    };
    var getlinkclasslist = function (editorsettings) {
      return editorsettings.link_class_list;
    };
    var haslinkclasslist = function (editorsettings) {
      return getlinkclasslist(editorsettings) !== undefined;
    };
    var shouldshowlinktitle = function (editorsettings) {
      return editorsettings.link_title !== false;
    };
    var allowunsafelinktarget = function (editorsettings) {
      return typeof editorsettings.allow_unsafe_link_target === 'boolean' ? editorsettings.allow_unsafe_link_target : false;
    };
    var settings = {
      assumeexternaltargets: assumeexternaltargets,
      hascontexttoolbar: hascontexttoolbar,
      getlinklist: getlinklist,
      hasdefaultlinktarget: hasdefaultlinktarget,
      getdefaultlinktarget: getdefaultlinktarget,
      gettargetlist: gettargetlist,
      settargetlist: settargetlist,
      shouldshowtargetlist: shouldshowtargetlist,
      getrellist: getrellist,
      hasrellist: hasrellist,
      getlinkclasslist: getlinkclasslist,
      haslinkclasslist: haslinkclasslist,
      shouldshowlinktitle: shouldshowlinktitle,
      allowunsafelinktarget: allowunsafelinktarget
    };

    var global$2 = tinymce.util.tools.resolve('tinymce.dom.domutils');

    var global$3 = tinymce.util.tools.resolve('tinymce.env');

    var appendclickremove = function (link, evt) {
      domglobals.document.body.appendchild(link);
      link.dispatchevent(evt);
      domglobals.document.body.removechild(link);
    };
    var open = function (url) {
      if (!global$3.ie || global$3.ie > 10) {
        var link = domglobals.document.createelement('a');
        link.target = '_blank';
        link.href = url;
        link.rel = 'noreferrer noopener';
        var evt = domglobals.document.createevent('mouseevents');
        evt.initmouseevent('click', true, true, domglobals.window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        appendclickremove(link, evt);
      } else {
        var win = domglobals.window.open('', '_blank');
        if (win) {
          win.opener = null;
          var doc = win.document;
          doc.open();
          doc.write('<meta http-equiv="refresh" content="0; url=' + global$2.dom.encode(url) + '">');
          doc.close();
        }
      }
    };
    var openurl = { open: open };

    var global$4 = tinymce.util.tools.resolve('tinymce.util.tools');

    var toggletargetrules = function (rel, isunsafe) {
      var rules = ['noopener'];
      var newrel = rel ? rel.split(/\s+/) : [];
      var tostring = function (rel) {
        return global$4.trim(rel.sort().join(' '));
      };
      var addtargetrules = function (rel) {
        rel = removetargetrules(rel);
        return rel.length ? rel.concat(rules) : rules;
      };
      var removetargetrules = function (rel) {
        return rel.filter(function (val) {
          return global$4.inarray(rules, val) === -1;
        });
      };
      newrel = isunsafe ? addtargetrules(newrel) : removetargetrules(newrel);
      return newrel.length ? tostring(newrel) : null;
    };
    var trimcaretcontainers = function (text) {
      return text.replace(/\ufeff/g, '');
    };
    var getanchorelement = function (editor, selectedelm) {
      selectedelm = selectedelm || editor.selection.getnode();
      if (isimagefigure(selectedelm)) {
        return editor.dom.select('a[href]', selectedelm)[0];
      } else {
        return editor.dom.getparent(selectedelm, 'a[href]');
      }
    };
    var getanchortext = function (selection, anchorelm) {
      var text = anchorelm ? anchorelm.innertext || anchorelm.textcontent : selection.getcontent({ format: 'text' });
      return trimcaretcontainers(text);
    };
    var islink = function (elm) {
      return elm && elm.nodename === 'a' && elm.href;
    };
    var haslinks = function (elements) {
      return global$4.grep(elements, islink).length > 0;
    };
    var isonlytextselected = function (html) {
      if (/</.test(html) && (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexof('href=') === -1)) {
        return false;
      }
      return true;
    };
    var isimagefigure = function (node) {
      return node && node.nodename === 'figure' && /\bimage\b/i.test(node.classname);
    };
    var link = function (editor, attachstate) {
      return function (data) {
        editor.undomanager.transact(function () {
          var selectedelm = editor.selection.getnode();
          var anchorelm = getanchorelement(editor, selectedelm);
          var linkattrs = {
            href: data.href,
            target: data.target ? data.target : null,
            rel: data.rel ? data.rel : null,
            class: data.class ? data.class : null,
            title: data.title ? data.title : null
          };
          if (!settings.hasrellist(editor.settings) && settings.allowunsafelinktarget(editor.settings) === false) {
            linkattrs.rel = toggletargetrules(linkattrs.rel, linkattrs.target === '_blank');
          }
          if (data.href === attachstate.href) {
            attachstate.attach();
            attachstate = {};
          }
          if (anchorelm) {
            editor.focus();
            if (data.hasownproperty('text')) {
              if ('innertext' in anchorelm) {
                anchorelm.innertext = data.text;
              } else {
                anchorelm.textcontent = data.text;
              }
            }
            editor.dom.setattribs(anchorelm, linkattrs);
            editor.selection.select(anchorelm);
            editor.undomanager.add();
          } else {
            if (isimagefigure(selectedelm)) {
              linkimagefigure(editor, selectedelm, linkattrs);
            } else if (data.hasownproperty('text')) {
              editor.insertcontent(editor.dom.createhtml('a', linkattrs, editor.dom.encode(data.text)));
            } else {
              editor.execcommand('mceinsertlink', false, linkattrs);
            }
          }
        });
      };
    };
    var unlink = function (editor) {
      return function () {
        editor.undomanager.transact(function () {
          var node = editor.selection.getnode();
          if (isimagefigure(node)) {
            unlinkimagefigure(editor, node);
          } else {
            editor.execcommand('unlink');
          }
        });
      };
    };
    var unlinkimagefigure = function (editor, fig) {
      var a, img;
      img = editor.dom.select('img', fig)[0];
      if (img) {
        a = editor.dom.getparents(img, 'a[href]', fig)[0];
        if (a) {
          a.parentnode.insertbefore(img, a);
          editor.dom.remove(a);
        }
      }
    };
    var linkimagefigure = function (editor, fig, attrs) {
      var a, img;
      img = editor.dom.select('img', fig)[0];
      if (img) {
        a = editor.dom.create('a', attrs);
        img.parentnode.insertbefore(a, img);
        a.appendchild(img);
      }
    };
    var utils = {
      link: link,
      unlink: unlink,
      islink: islink,
      haslinks: haslinks,
      isonlytextselected: isonlytextselected,
      getanchorelement: getanchorelement,
      getanchortext: getanchortext,
      toggletargetrules: toggletargetrules
    };

    var global$5 = tinymce.util.tools.resolve('tinymce.util.delay');

    var global$6 = tinymce.util.tools.resolve('tinymce.util.xhr');

    var attachstate = {};
    var createlinklist = function (editor, callback) {
      var linklist = settings.getlinklist(editor.settings);
      if (typeof linklist === 'string') {
        global$6.send({
          url: linklist,
          success: function (text) {
            callback(editor, json.parse(text));
          }
        });
      } else if (typeof linklist === 'function') {
        linklist(function (list) {
          callback(editor, list);
        });
      } else {
        callback(editor, linklist);
      }
    };
    var buildlistitems = function (inputlist, itemcallback, startitems) {
      var appenditems = function (values, output) {
        output = output || [];
        global$4.each(values, function (item) {
          var menuitem = { text: item.text || item.title };
          if (item.menu) {
            menuitem.menu = appenditems(item.menu);
          } else {
            menuitem.value = item.value;
            if (itemcallback) {
              itemcallback(menuitem);
            }
          }
          output.push(menuitem);
        });
        return output;
      };
      return appenditems(inputlist, startitems || []);
    };
    var delayedconfirm = function (editor, message, callback) {
      var rng = editor.selection.getrng();
      global$5.seteditortimeout(editor, function () {
        editor.windowmanager.confirm(message, function (state) {
          editor.selection.setrng(rng);
          callback(state);
        });
      });
    };
    var showdialog = function (editor, linklist) {
      var data = {};
      var selection = editor.selection;
      var dom = editor.dom;
      var anchorelm, initialtext;
      var win, onlytext, textlistctrl, linklistctrl, rellistctrl, targetlistctrl, classlistctrl, linktitlectrl, value;
      var linklistchangehandler = function (e) {
        var textctrl = win.find('#text');
        if (!textctrl.value() || e.lastcontrol && textctrl.value() === e.lastcontrol.text()) {
          textctrl.value(e.control.text());
        }
        win.find('#href').value(e.control.value());
      };
      var buildanchorlistcontrol = function (url) {
        var anchorlist = [];
        global$4.each(editor.dom.select('a:not([href])'), function (anchor) {
          var id = anchor.name || anchor.id;
          if (id) {
            anchorlist.push({
              text: id,
              value: '#' + id,
              selected: url.indexof('#' + id) !== -1
            });
          }
        });
        if (anchorlist.length) {
          anchorlist.unshift({
            text: 'none',
            value: ''
          });
          return {
            name: 'anchor',
            type: 'listbox',
            label: 'anchors',
            values: anchorlist,
            onselect: linklistchangehandler
          };
        }
      };
      var updatetext = function () {
        if (!initialtext && onlytext && !data.text) {
          this.parent().parent().find('#text')[0].value(this.value());
        }
      };
      var urlchange = function (e) {
        var meta = e.meta || {};
        if (linklistctrl) {
          linklistctrl.value(editor.converturl(this.value(), 'href'));
        }
        global$4.each(e.meta, function (value, key) {
          var inp = win.find('#' + key);
          if (key === 'text') {
            if (initialtext.length === 0) {
              inp.value(value);
              data.text = value;
            }
          } else {
            inp.value(value);
          }
        });
        if (meta.attach) {
          attachstate = {
            href: this.value(),
            attach: meta.attach
          };
        }
        if (!meta.text) {
          updatetext.call(this);
        }
      };
      var onbeforecall = function (e) {
        e.meta = win.tojson();
      };
      onlytext = utils.isonlytextselected(selection.getcontent());
      anchorelm = utils.getanchorelement(editor);
      data.text = initialtext = utils.getanchortext(editor.selection, anchorelm);
      data.href = anchorelm ? dom.getattrib(anchorelm, 'href') : '';
      if (anchorelm) {
        data.target = dom.getattrib(anchorelm, 'target');
      } else if (settings.hasdefaultlinktarget(editor.settings)) {
        data.target = settings.getdefaultlinktarget(editor.settings);
      }
      if (value = dom.getattrib(anchorelm, 'rel')) {
        data.rel = value;
      }
      if (value = dom.getattrib(anchorelm, 'class')) {
        data.class = value;
      }
      if (value = dom.getattrib(anchorelm, 'title')) {
        data.title = value;
      }
      if (onlytext) {
        textlistctrl = {
          name: 'text',
          type: 'textbox',
          size: 40,
          label: 'text to display',
          onchange: function () {
            data.text = this.value();
          }
        };
      }
      if (linklist) {
        linklistctrl = {
          type: 'listbox',
          label: 'link list',
          values: buildlistitems(linklist, function (item) {
            item.value = editor.converturl(item.value || item.url, 'href');
          }, [{
              text: 'none',
              value: ''
            }]),
          onselect: linklistchangehandler,
          value: editor.converturl(data.href, 'href'),
          onpostrender: function () {
            linklistctrl = this;
          }
        };
      }
      if (settings.shouldshowtargetlist(editor.settings)) {
        if (settings.gettargetlist(editor.settings) === undefined) {
          settings.settargetlist(editor, [
            {
              text: 'none',
              value: ''
            },
            {
              text: 'new window',
              value: '_blank'
            }
          ]);
        }
        targetlistctrl = {
          name: 'target',
          type: 'listbox',
          label: 'target',
          values: buildlistitems(settings.gettargetlist(editor.settings))
        };
      }
      if (settings.hasrellist(editor.settings)) {
        rellistctrl = {
          name: 'rel',
          type: 'listbox',
          label: 'rel',
          values: buildlistitems(settings.getrellist(editor.settings), function (item) {
            if (settings.allowunsafelinktarget(editor.settings) === false) {
              item.value = utils.toggletargetrules(item.value, data.target === '_blank');
            }
          })
        };
      }
      if (settings.haslinkclasslist(editor.settings)) {
        classlistctrl = {
          name: 'class',
          type: 'listbox',
          label: 'class',
          values: buildlistitems(settings.getlinkclasslist(editor.settings), function (item) {
            if (item.value) {
              item.textstyle = function () {
                return editor.formatter.getcsstext({
                  inline: 'a',
                  classes: [item.value]
                });
              };
            }
          })
        };
      }
      if (settings.shouldshowlinktitle(editor.settings)) {
        linktitlectrl = {
          name: 'title',
          type: 'textbox',
          label: 'title',
          value: data.title
        };
      }
      win = editor.windowmanager.open({
        title: 'insert link',
        data: data,
        body: [
          {
            name: 'href',
            type: 'filepicker',
            filetype: 'file',
            size: 40,
            autofocus: true,
            label: 'url',
            onchange: urlchange,
            onkeyup: updatetext,
            onpaste: updatetext,
            onbeforecall: onbeforecall
          },
          textlistctrl,
          linktitlectrl,
          buildanchorlistcontrol(data.href),
          linklistctrl,
          rellistctrl,
          targetlistctrl,
          classlistctrl
        ],
        onsubmit: function (e) {
          var assumeexternaltargets = settings.assumeexternaltargets(editor.settings);
          var insertlink = utils.link(editor, attachstate);
          var removelink = utils.unlink(editor);
          var resultdata = global$4.extend({}, data, e.data);
          var href = resultdata.href;
          if (!href) {
            removelink();
            return;
          }
          if (!onlytext || resultdata.text === initialtext) {
            delete resultdata.text;
          }
          if (href.indexof('@') > 0 && href.indexof('//') === -1 && href.indexof('mailto:') === -1) {
            delayedconfirm(editor, 'the url you entered seems to be an email address. do you want to add the required mailto: prefix?', function (state) {
              if (state) {
                resultdata.href = 'mailto:' + href;
              }
              insertlink(resultdata);
            });
            return;
          }
          if (assumeexternaltargets === true && !/^\w+:/i.test(href) || assumeexternaltargets === false && /^\s*www[\.|\d\.]/i.test(href)) {
            delayedconfirm(editor, 'the url you entered seems to be an external link. do you want to add the required http:// prefix?', function (state) {
              if (state) {
                resultdata.href = 'http://' + href;
              }
              insertlink(resultdata);
            });
            return;
          }
          insertlink(resultdata);
        }
      });
    };
    var open$1 = function (editor) {
      createlinklist(editor, showdialog);
    };
    var dialog = { open: open$1 };

    var getlink = function (editor, elm) {
      return editor.dom.getparent(elm, 'a[href]');
    };
    var getselectedlink = function (editor) {
      return getlink(editor, editor.selection.getstart());
    };
    var gethref = function (elm) {
      var href = elm.getattribute('data-mce-href');
      return href ? href : elm.getattribute('href');
    };
    var iscontextmenuvisible = function (editor) {
      var contextmenu = editor.plugins.contextmenu;
      return contextmenu ? contextmenu.iscontextmenuvisible() : false;
    };
    var hasonlyaltmodifier = function (e) {
      return e.altkey === true && e.shiftkey === false && e.ctrlkey === false && e.metakey === false;
    };
    var gotolink = function (editor, a) {
      if (a) {
        var href = gethref(a);
        if (/^#/.test(href)) {
          var targetel = editor.$(href);
          if (targetel.length) {
            editor.selection.scrollintoview(targetel[0], true);
          }
        } else {
          openurl.open(a.href);
        }
      }
    };
    var opendialog = function (editor) {
      return function () {
        dialog.open(editor);
      };
    };
    var gotoselectedlink = function (editor) {
      return function () {
        gotolink(editor, getselectedlink(editor));
      };
    };
    var leftclickedonahref = function (editor) {
      return function (elm) {
        var sel, rng, node;
        if (settings.hascontexttoolbar(editor.settings) && !iscontextmenuvisible(editor) && utils.islink(elm)) {
          sel = editor.selection;
          rng = sel.getrng();
          node = rng.startcontainer;
          if (node.nodetype === 3 && sel.iscollapsed() && rng.startoffset > 0 && rng.startoffset < node.data.length) {
            return true;
          }
        }
        return false;
      };
    };
    var setupgotolinks = function (editor) {
      editor.on('click', function (e) {
        var link = getlink(editor, e.target);
        if (link && global$1.metakeypressed(e)) {
          e.preventdefault();
          gotolink(editor, link);
        }
      });
      editor.on('keydown', function (e) {
        var link = getselectedlink(editor);
        if (link && e.keycode === 13 && hasonlyaltmodifier(e)) {
          e.preventdefault();
          gotolink(editor, link);
        }
      });
    };
    var toggleactivestate = function (editor) {
      return function () {
        var self = this;
        editor.on('nodechange', function (e) {
          self.active(!editor.readonly && !!utils.getanchorelement(editor, e.element));
        });
      };
    };
    var toggleviewlinkstate = function (editor) {
      return function () {
        var self = this;
        var togglevisibility = function (e) {
          if (utils.haslinks(e.parents)) {
            self.show();
          } else {
            self.hide();
          }
        };
        if (!utils.haslinks(editor.dom.getparents(editor.selection.getstart()))) {
          self.hide();
        }
        editor.on('nodechange', togglevisibility);
        self.on('remove', function () {
          editor.off('nodechange', togglevisibility);
        });
      };
    };
    var actions = {
      opendialog: opendialog,
      gotoselectedlink: gotoselectedlink,
      leftclickedonahref: leftclickedonahref,
      setupgotolinks: setupgotolinks,
      toggleactivestate: toggleactivestate,
      toggleviewlinkstate: toggleviewlinkstate
    };

    var register = function (editor) {
      editor.addcommand('mcelink', actions.opendialog(editor));
    };
    var commands = { register: register };

    var setup = function (editor) {
      editor.addshortcut('meta+k', '', actions.opendialog(editor));
    };
    var keyboard = { setup: setup };

    var setupbuttons = function (editor) {
      editor.addbutton('link', {
        active: false,
        icon: 'link',
        tooltip: 'insert/edit link',
        onclick: actions.opendialog(editor),
        onpostrender: actions.toggleactivestate(editor)
      });
      editor.addbutton('unlink', {
        active: false,
        icon: 'unlink',
        tooltip: 'remove link',
        onclick: utils.unlink(editor),
        onpostrender: actions.toggleactivestate(editor)
      });
      if (editor.addcontexttoolbar) {
        editor.addbutton('openlink', {
          icon: 'newtab',
          tooltip: 'open link',
          onclick: actions.gotoselectedlink(editor)
        });
      }
    };
    var setupmenuitems = function (editor) {
      editor.addmenuitem('openlink', {
        text: 'open link',
        icon: 'newtab',
        onclick: actions.gotoselectedlink(editor),
        onpostrender: actions.toggleviewlinkstate(editor),
        prependtocontext: true
      });
      editor.addmenuitem('link', {
        icon: 'link',
        text: 'link',
        shortcut: 'meta+k',
        onclick: actions.opendialog(editor),
        stateselector: 'a[href]',
        context: 'insert',
        prependtocontext: true
      });
      editor.addmenuitem('unlink', {
        icon: 'unlink',
        text: 'remove link',
        onclick: utils.unlink(editor),
        stateselector: 'a[href]'
      });
    };
    var setupcontexttoolbars = function (editor) {
      if (editor.addcontexttoolbar) {
        editor.addcontexttoolbar(actions.leftclickedonahref(editor), 'openlink | link unlink');
      }
    };
    var controls = {
      setupbuttons: setupbuttons,
      setupmenuitems: setupmenuitems,
      setupcontexttoolbars: setupcontexttoolbars
    };

    global.add('link', function (editor) {
      controls.setupbuttons(editor);
      controls.setupmenuitems(editor);
      controls.setupcontexttoolbars(editor);
      actions.setupgotolinks(editor);
      commands.register(editor);
      keyboard.setup(editor);
    });
    function plugin () {
    }

    return plugin;

}(window));
})();








