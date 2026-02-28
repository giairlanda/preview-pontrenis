(function () {
var inlite = (function (domglobals) {
    'use strict';

    var global = tinymce.util.tools.resolve('tinymce.thememanager');

    var global$1 = tinymce.util.tools.resolve('tinymce.env');

    var global$2 = tinymce.util.tools.resolve('tinymce.dom.domutils');

    var global$3 = tinymce.util.tools.resolve('tinymce.util.delay');

    var flatten = function (arr) {
      return arr.reduce(function (results, item) {
        return array.isarray(item) ? results.concat(flatten(item)) : results.concat(item);
      }, []);
    };
    var deepflatten = { flatten: flatten };

    var result = function (id, rect) {
      return {
        id: id,
        rect: rect
      };
    };
    var match = function (editor, matchers) {
      for (var i = 0; i < matchers.length; i++) {
        var f = matchers[i];
        var result_1 = f(editor);
        if (result_1) {
          return result_1;
        }
      }
      return null;
    };
    var matcher = {
      match: match,
      result: result
    };

    var fromclientrect = function (clientrect) {
      return {
        x: clientrect.left,
        y: clientrect.top,
        w: clientrect.width,
        h: clientrect.height
      };
    };
    var toclientrect = function (geomrect) {
      return {
        left: geomrect.x,
        top: geomrect.y,
        width: geomrect.w,
        height: geomrect.h,
        right: geomrect.x + geomrect.w,
        bottom: geomrect.y + geomrect.h
      };
    };
    var convert = {
      fromclientrect: fromclientrect,
      toclientrect: toclientrect
    };

    var toabsolute = function (rect) {
      var vp = global$2.dom.getviewport();
      return {
        x: rect.x + vp.x,
        y: rect.y + vp.y,
        w: rect.w,
        h: rect.h
      };
    };
    var measureelement = function (elm) {
      var clientrect = elm.getboundingclientrect();
      return toabsolute({
        x: clientrect.left,
        y: clientrect.top,
        w: math.max(elm.clientwidth, elm.offsetwidth),
        h: math.max(elm.clientheight, elm.offsetheight)
      });
    };
    var getelementrect = function (editor, elm) {
      return measureelement(elm);
    };
    var getpagearearect = function (editor) {
      return measureelement(editor.getelement().ownerdocument.body);
    };
    var getcontentarearect = function (editor) {
      return measureelement(editor.getcontentareacontainer() || editor.getbody());
    };
    var getselectionrect = function (editor) {
      var clientrect = editor.selection.getboundingclientrect();
      return clientrect ? toabsolute(convert.fromclientrect(clientrect)) : null;
    };
    var measure = {
      getelementrect: getelementrect,
      getpagearearect: getpagearearect,
      getcontentarearect: getcontentarearect,
      getselectionrect: getselectionrect
    };

    var element = function (element, predicateids) {
      return function (editor) {
        for (var i = 0; i < predicateids.length; i++) {
          if (predicateids[i].predicate(element)) {
            var result = matcher.result(predicateids[i].id, measure.getelementrect(editor, element));
            return result;
          }
        }
        return null;
      };
    };
    var parent = function (elements, predicateids) {
      return function (editor) {
        for (var i = 0; i < elements.length; i++) {
          for (var x = 0; x < predicateids.length; x++) {
            if (predicateids[x].predicate(elements[i])) {
              return matcher.result(predicateids[x].id, measure.getelementrect(editor, elements[i]));
            }
          }
        }
        return null;
      };
    };
    var elementmatcher = {
      element: element,
      parent: parent
    };

    var global$4 = tinymce.util.tools.resolve('tinymce.util.tools');

    var create = function (id, predicate) {
      return {
        id: id,
        predicate: predicate
      };
    };
    var fromcontexttoolbars = function (toolbars) {
      return global$4.map(toolbars, function (toolbar) {
        return create(toolbar.id, toolbar.predicate);
      });
    };
    var predicateid = {
      create: create,
      fromcontexttoolbars: fromcontexttoolbars
    };

    var textselection = function (id) {
      return function (editor) {
        if (!editor.selection.iscollapsed()) {
          var result = matcher.result(id, measure.getselectionrect(editor));
          return result;
        }
        return null;
      };
    };
    var emptytextblock = function (elements, id) {
      return function (editor) {
        var i;
        var textblockelementsmap = editor.schema.gettextblockelements();
        for (i = 0; i < elements.length; i++) {
          if (elements[i].nodename === 'table') {
            return null;
          }
        }
        for (i = 0; i < elements.length; i++) {
          if (elements[i].nodename in textblockelementsmap) {
            if (editor.dom.isempty(elements[i])) {
              return matcher.result(id, measure.getselectionrect(editor));
            }
            return null;
          }
        }
        return null;
      };
    };
    var selectionmatcher = {
      textselection: textselection,
      emptytextblock: emptytextblock
    };

    var fireskinloaded = function (editor) {
      editor.fire('skinloaded');
    };
    var firebeforerenderui = function (editor) {
      return editor.fire('beforerenderui');
    };
    var events = {
      fireskinloaded: fireskinloaded,
      firebeforerenderui: firebeforerenderui
    };

    var global$5 = tinymce.util.tools.resolve('tinymce.editormanager');

    var istype = function (type) {
      return function (value) {
        return typeof value === type;
      };
    };
    var isarray = function (value) {
      return array.isarray(value);
    };
    var isnull = function (value) {
      return value === null;
    };
    var isobject = function (predicate) {
      return function (value) {
        return !isnull(value) && !isarray(value) && predicate(value);
      };
    };
    var isstring = function (value) {
      return istype('string')(value);
    };
    var isnumber = function (value) {
      return istype('number')(value);
    };
    var isfunction = function (value) {
      return istype('function')(value);
    };
    var isboolean = function (value) {
      return istype('boolean')(value);
    };
    var type = {
      isstring: isstring,
      isnumber: isnumber,
      isboolean: isboolean,
      isfunction: isfunction,
      isobject: isobject(istype('object')),
      isnull: isnull,
      isarray: isarray
    };

    var validdefaultordie = function (value, predicate) {
      if (predicate(value)) {
        return true;
      }
      throw new error('default value doesn\'t match requested type.');
    };
    var getbytypeor = function (predicate) {
      return function (editor, name, defaultvalue) {
        var settings = editor.settings;
        validdefaultordie(defaultvalue, predicate);
        return name in settings && predicate(settings[name]) ? settings[name] : defaultvalue;
      };
    };
    var splitnoempty = function (str, delim) {
      return str.split(delim).filter(function (item) {
        return item.length > 0;
      });
    };
    var itemstoarray = function (value, defaultvalue) {
      var stringtoitemsarray = function (value) {
        return typeof value === 'string' ? splitnoempty(value, /[ ,]/) : value;
      };
      var booltoitemsarray = function (value, defaultvalue) {
        return value === false ? [] : defaultvalue;
      };
      if (type.isarray(value)) {
        return value;
      } else if (type.isstring(value)) {
        return stringtoitemsarray(value);
      } else if (type.isboolean(value)) {
        return booltoitemsarray(value, defaultvalue);
      }
      return defaultvalue;
    };
    var gettoolbaritemsor = function (predicate) {
      return function (editor, name, defaultvalue) {
        var value = name in editor.settings ? editor.settings[name] : defaultvalue;
        validdefaultordie(defaultvalue, predicate);
        return itemstoarray(value, defaultvalue);
      };
    };
    var editorsettings = {
      getstringor: getbytypeor(type.isstring),
      getboolor: getbytypeor(type.isboolean),
      getnumberor: getbytypeor(type.isnumber),
      gethandleror: getbytypeor(type.isfunction),
      gettoolbaritemsor: gettoolbaritemsor(type.isarray)
    };

    var global$6 = tinymce.util.tools.resolve('tinymce.geom.rect');

    var result$1 = function (rect, position) {
      return {
        rect: rect,
        position: position
      };
    };
    var moveto = function (rect, torect) {
      return {
        x: torect.x,
        y: torect.y,
        w: rect.w,
        h: rect.h
      };
    };
    var calcbypositions = function (testpositions1, testpositions2, targetrect, contentarearect, panelrect) {
      var relpos, relrect, outputpanelrect;
      var paddedcontentrect = {
        x: contentarearect.x,
        y: contentarearect.y,
        w: contentarearect.w + (contentarearect.w < panelrect.w + targetrect.w ? panelrect.w : 0),
        h: contentarearect.h + (contentarearect.h < panelrect.h + targetrect.h ? panelrect.h : 0)
      };
      relpos = global$6.findbestrelativeposition(panelrect, targetrect, paddedcontentrect, testpositions1);
      targetrect = global$6.clamp(targetrect, paddedcontentrect);
      if (relpos) {
        relrect = global$6.relativeposition(panelrect, targetrect, relpos);
        outputpanelrect = moveto(panelrect, relrect);
        return result$1(outputpanelrect, relpos);
      }
      targetrect = global$6.intersect(paddedcontentrect, targetrect);
      if (targetrect) {
        relpos = global$6.findbestrelativeposition(panelrect, targetrect, paddedcontentrect, testpositions2);
        if (relpos) {
          relrect = global$6.relativeposition(panelrect, targetrect, relpos);
          outputpanelrect = moveto(panelrect, relrect);
          return result$1(outputpanelrect, relpos);
        }
        outputpanelrect = moveto(panelrect, targetrect);
        return result$1(outputpanelrect, relpos);
      }
      return null;
    };
    var calcinsert = function (targetrect, contentarearect, panelrect) {
      return calcbypositions([
        'cr-cl',
        'cl-cr'
      ], [
        'bc-tc',
        'bl-tl',
        'br-tr'
      ], targetrect, contentarearect, panelrect);
    };
    var calc = function (targetrect, contentarearect, panelrect) {
      return calcbypositions([
        'tc-bc',
        'bc-tc',
        'tl-bl',
        'bl-tl',
        'tr-br',
        'br-tr',
        'cr-cl',
        'cl-cr'
      ], [
        'bc-tc',
        'bl-tl',
        'br-tr',
        'cr-cl'
      ], targetrect, contentarearect, panelrect);
    };
    var userconstrain = function (handler, targetrect, contentarearect, panelrect) {
      var userconstrainedpanelrect;
      if (typeof handler === 'function') {
        userconstrainedpanelrect = handler({
          elementrect: convert.toclientrect(targetrect),
          contentarearect: convert.toclientrect(contentarearect),
          panelrect: convert.toclientrect(panelrect)
        });
        return convert.fromclientrect(userconstrainedpanelrect);
      }
      return panelrect;
    };
    var defaulthandler = function (rects) {
      return rects.panelrect;
    };
    var layout = {
      calcinsert: calcinsert,
      calc: calc,
      userconstrain: userconstrain,
      defaulthandler: defaulthandler
    };

    var toabsoluteurl = function (editor, url) {
      return editor.documentbaseuri.toabsolute(url);
    };
    var urlfromname = function (name) {
      var prefix = global$5.baseurl + '/skins/';
      return name ? prefix + name : prefix + 'lightgray';
    };
    var gettextselectiontoolbaritems = function (editor) {
      return editorsettings.gettoolbaritemsor(editor, 'selection_toolbar', [
        'bold',
        'italic',
        '|',
        'quicklink',
        'h2',
        'h3',
        'blockquote'
      ]);
    };
    var getinserttoolbaritems = function (editor) {
      return editorsettings.gettoolbaritemsor(editor, 'insert_toolbar', [
        'quickimage',
        'quicktable'
      ]);
    };
    var getpositionhandler = function (editor) {
      return editorsettings.gethandleror(editor, 'inline_toolbar_position_handler', layout.defaulthandler);
    };
    var getskinurl = function (editor) {
      var settings = editor.settings;
      return settings.skin_url ? toabsoluteurl(editor, settings.skin_url) : urlfromname(settings.skin);
    };
    var isskindisabled = function (editor) {
      return editor.settings.skin === false;
    };
    var settings = {
      gettextselectiontoolbaritems: gettextselectiontoolbaritems,
      getinserttoolbaritems: getinserttoolbaritems,
      getpositionhandler: getpositionhandler,
      getskinurl: getskinurl,
      isskindisabled: isskindisabled
    };

    var fireskinloaded$1 = function (editor, callback) {
      var done = function () {
        editor._skinloaded = true;
        events.fireskinloaded(editor);
        callback();
      };
      if (editor.initialized) {
        done();
      } else {
        editor.on('init', done);
      }
    };
    var load = function (editor, callback) {
      var skinurl = settings.getskinurl(editor);
      var done = function () {
        fireskinloaded$1(editor, callback);
      };
      if (settings.isskindisabled(editor)) {
        done();
      } else {
        global$2.dom.stylesheetloader.load(skinurl + '/skin.min.css', done);
        editor.contentcss.push(skinurl + '/content.inline.min.css');
      }
    };
    var skinloader = { load: load };

    var getselectionelements = function (editor) {
      var node = editor.selection.getnode();
      var elms = editor.dom.getparents(node, '*');
      return elms;
    };
    var createtoolbar = function (editor, selector, id, items) {
      var selectorpredicate = function (elm) {
        return editor.dom.is(elm, selector);
      };
      return {
        predicate: selectorpredicate,
        id: id,
        items: items
      };
    };
    var gettoolbars = function (editor) {
      var contexttoolbars = editor.contexttoolbars;
      return deepflatten.flatten([
        contexttoolbars ? contexttoolbars : [],
        createtoolbar(editor, 'img', 'image', 'alignleft aligncenter alignright')
      ]);
    };
    var findmatchresult = function (editor, toolbars) {
      var result, elements, contexttoolbarspredicateids;
      elements = getselectionelements(editor);
      contexttoolbarspredicateids = predicateid.fromcontexttoolbars(toolbars);
      result = matcher.match(editor, [
        elementmatcher.element(elements[0], contexttoolbarspredicateids),
        selectionmatcher.textselection('text'),
        selectionmatcher.emptytextblock(elements, 'insert'),
        elementmatcher.parent(elements, contexttoolbarspredicateids)
      ]);
      return result && result.rect ? result : null;
    };
    var editorhasfocus = function (editor) {
      return domglobals.document.activeelement === editor.getbody();
    };
    var togglepanel = function (editor, panel) {
      var toggle = function () {
        var toolbars = gettoolbars(editor);
        var result = findmatchresult(editor, toolbars);
        if (result) {
          panel.show(editor, result.id, result.rect, toolbars);
        } else {
          panel.hide();
        }
      };
      return function () {
        if (!editor.removed && editorhasfocus(editor)) {
          toggle();
        }
      };
    };
    var repositionpanel = function (editor, panel) {
      return function () {
        var toolbars = gettoolbars(editor);
        var result = findmatchresult(editor, toolbars);
        if (result) {
          panel.reposition(editor, result.id, result.rect);
        }
      };
    };
    var ignorewhenformisvisible = function (editor, panel, f) {
      return function () {
        if (!editor.removed && !panel.inform()) {
          f();
        }
      };
    };
    var bindcontextualtoolbarsevents = function (editor, panel) {
      var throttledtogglepanel = global$3.throttle(togglepanel(editor, panel), 0);
      var throttledtogglepanelwhennotinform = global$3.throttle(ignorewhenformisvisible(editor, panel, togglepanel(editor, panel)), 0);
      var reposition = repositionpanel(editor, panel);
      editor.on('blur hide objectresizestart', panel.hide);
      editor.on('click', throttledtogglepanel);
      editor.on('nodechange mouseup', throttledtogglepanelwhennotinform);
      editor.on('resizeeditor keyup', throttledtogglepanel);
      editor.on('resizewindow', reposition);
      global$2.dom.bind(global$1.container, 'scroll', reposition);
      editor.on('remove', function () {
        global$2.dom.unbind(global$1.container, 'scroll', reposition);
        panel.remove();
      });
      editor.shortcuts.add('alt+f10,f10', '', panel.focus);
    };
    var overridelinkshortcut = function (editor, panel) {
      editor.shortcuts.remove('meta+k');
      editor.shortcuts.add('meta+k', '', function () {
        var toolbars = gettoolbars(editor);
        var result = matcher.match(editor, [selectionmatcher.textselection('quicklink')]);
        if (result) {
          panel.show(editor, result.id, result.rect, toolbars);
        }
      });
    };
    var renderinlineui = function (editor, panel) {
      skinloader.load(editor, function () {
        bindcontextualtoolbarsevents(editor, panel);
        overridelinkshortcut(editor, panel);
      });
      return {};
    };
    var fail = function (message) {
      throw new error(message);
    };
    var renderui = function (editor, panel) {
      return editor.inline ? renderinlineui(editor, panel) : fail('inlite theme only supports inline mode.');
    };
    var render = { renderui: renderui };

    var noop = function () {
    };
    var constant = function (value) {
      return function () {
        return value;
      };
    };
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
    var istype$1 = function (type) {
      return function (value) {
        return typeof(value) === type;
      };
    };
    var isarray$1 = istype$1('array');
    var isfunction$1 = istype$1('function');
    var isnumber$1 = istype$1('number');

    var nativeslice = array.prototype.slice;
    var nativeindexof = array.prototype.indexof;
    var nativepush = array.prototype.push;
    var rawindexof = function (ts, t) {
      return nativeindexof.call(ts, t);
    };
    var indexof = function (xs, x) {
      var r = rawindexof(xs, x);
      return r === -1 ? option.none() : option.some(r);
    };
    var exists = function (xs, pred) {
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        if (pred(x, i)) {
          return true;
        }
      }
      return false;
    };
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
    var filter = function (xs, pred) {
      var r = [];
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        if (pred(x, i)) {
          r.push(x);
        }
      }
      return r;
    };
    var foldl = function (xs, f, acc) {
      each(xs, function (x) {
        acc = f(acc, x);
      });
      return acc;
    };
    var find = function (xs, pred) {
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        if (pred(x, i)) {
          return option.some(x);
        }
      }
      return option.none();
    };
    var flatten$1 = function (xs) {
      var r = [];
      for (var i = 0, len = xs.length; i < len; ++i) {
        if (!isarray$1(xs[i])) {
          throw new error('arr.flatten item ' + i + ' was not an array, input: ' + xs);
        }
        nativepush.apply(r, xs[i]);
      }
      return r;
    };
    var from$1 = isfunction$1(array.from) ? array.from : function (x) {
      return nativeslice.call(x);
    };

    var count = 0;
    var funcs = {
      id: function () {
        return 'mceu_' + count++;
      },
      create: function (name, attrs, children) {
        var elm = domglobals.document.createelement(name);
        global$2.dom.setattribs(elm, attrs);
        if (typeof children === 'string') {
          elm.innerhtml = children;
        } else {
          global$4.each(children, function (child) {
            if (child.nodetype) {
              elm.appendchild(child);
            }
          });
        }
        return elm;
      },
      createfragment: function (html) {
        return global$2.dom.createfragment(html);
      },
      getwindowsize: function () {
        return global$2.dom.getviewport();
      },
      getsize: function (elm) {
        var width, height;
        if (elm.getboundingclientrect) {
          var rect = elm.getboundingclientrect();
          width = math.max(rect.width || rect.right - rect.left, elm.offsetwidth);
          height = math.max(rect.height || rect.bottom - rect.bottom, elm.offsetheight);
        } else {
          width = elm.offsetwidth;
          height = elm.offsetheight;
        }
        return {
          width: width,
          height: height
        };
      },
      getpos: function (elm, root) {
        return global$2.dom.getpos(elm, root || funcs.getcontainer());
      },
      getcontainer: function () {
        return global$1.container ? global$1.container : domglobals.document.body;
      },
      getviewport: function (win) {
        return global$2.dom.getviewport(win);
      },
      get: function (id) {
        return domglobals.document.getelementbyid(id);
      },
      addclass: function (elm, cls) {
        return global$2.dom.addclass(elm, cls);
      },
      removeclass: function (elm, cls) {
        return global$2.dom.removeclass(elm, cls);
      },
      hasclass: function (elm, cls) {
        return global$2.dom.hasclass(elm, cls);
      },
      toggleclass: function (elm, cls, state) {
        return global$2.dom.toggleclass(elm, cls, state);
      },
      css: function (elm, name, value) {
        return global$2.dom.setstyle(elm, name, value);
      },
      getruntimestyle: function (elm, name) {
        return global$2.dom.getstyle(elm, name, true);
      },
      on: function (target, name, callback, scope) {
        return global$2.dom.bind(target, name, callback, scope);
      },
      off: function (target, name, callback) {
        return global$2.dom.unbind(target, name, callback);
      },
      fire: function (target, name, args) {
        return global$2.dom.fire(target, name, args);
      },
      innerhtml: function (elm, html) {
        global$2.dom.sethtml(elm, html);
      }
    };

    var global$7 = tinymce.util.tools.resolve('tinymce.dom.domquery');

    var global$8 = tinymce.util.tools.resolve('tinymce.util.class');

    var global$9 = tinymce.util.tools.resolve('tinymce.util.eventdispatcher');

    var boxutils = {
      parsebox: function (value) {
        var len;
        var radix = 10;
        if (!value) {
          return;
        }
        if (typeof value === 'number') {
          value = value || 0;
          return {
            top: value,
            left: value,
            bottom: value,
            right: value
          };
        }
        value = value.split(' ');
        len = value.length;
        if (len === 1) {
          value[1] = value[2] = value[3] = value[0];
        } else if (len === 2) {
          value[2] = value[0];
          value[3] = value[1];
        } else if (len === 3) {
          value[3] = value[1];
        }
        return {
          top: parseint(value[0], radix) || 0,
          right: parseint(value[1], radix) || 0,
          bottom: parseint(value[2], radix) || 0,
          left: parseint(value[3], radix) || 0
        };
      },
      measurebox: function (elm, prefix) {
        function getstyle(name) {
          var defaultview = elm.ownerdocument.defaultview;
          if (defaultview) {
            var computedstyle = defaultview.getcomputedstyle(elm, null);
            if (computedstyle) {
              name = name.replace(/[a-z]/g, function (a) {
                return '-' + a;
              });
              return computedstyle.getpropertyvalue(name);
            } else {
              return null;
            }
          }
          return elm.currentstyle[name];
        }
        function getside(name) {
          var val = parsefloat(getstyle(name));
          return isnan(val) ? 0 : val;
        }
        return {
          top: getside(prefix + 'topwidth'),
          right: getside(prefix + 'rightwidth'),
          bottom: getside(prefix + 'bottomwidth'),
          left: getside(prefix + 'leftwidth')
        };
      }
    };

    function noop$1() {
    }
    function classlist(onchange) {
      this.cls = [];
      this.cls._map = {};
      this.onchange = onchange || noop$1;
      this.prefix = '';
    }
    global$4.extend(classlist.prototype, {
      add: function (cls) {
        if (cls && !this.contains(cls)) {
          this.cls._map[cls] = true;
          this.cls.push(cls);
          this._change();
        }
        return this;
      },
      remove: function (cls) {
        if (this.contains(cls)) {
          var i = void 0;
          for (i = 0; i < this.cls.length; i++) {
            if (this.cls[i] === cls) {
              break;
            }
          }
          this.cls.splice(i, 1);
          delete this.cls._map[cls];
          this._change();
        }
        return this;
      },
      toggle: function (cls, state) {
        var curstate = this.contains(cls);
        if (curstate !== state) {
          if (curstate) {
            this.remove(cls);
          } else {
            this.add(cls);
          }
          this._change();
        }
        return this;
      },
      contains: function (cls) {
        return !!this.cls._map[cls];
      },
      _change: function () {
        delete this.clsvalue;
        this.onchange.call(this);
      }
    });
    classlist.prototype.tostring = function () {
      var value;
      if (this.clsvalue) {
        return this.clsvalue;
      }
      value = '';
      for (var i = 0; i < this.cls.length; i++) {
        if (i > 0) {
          value += ' ';
        }
        value += this.prefix + this.cls[i];
      }
      return value;
    };

    function unique(array) {
      var uniqueitems = [];
      var i = array.length, item;
      while (i--) {
        item = array[i];
        if (!item.__checked) {
          uniqueitems.push(item);
          item.__checked = 1;
        }
      }
      i = uniqueitems.length;
      while (i--) {
        delete uniqueitems[i].__checked;
      }
      return uniqueitems;
    }
    var expression = /^([\w\\*]+)?(?:#([\w\-\\]+))?(?:\.([\w\\\.]+))?(?:\[\@?([\w\\]+)([\^\$\*!~]?=)([\w\\]+)\])?(?:\:(.+))?/i;
    var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;
    var whitespace = /^\s*|\s*$/g;
    var collection;
    var selector = global$8.extend({
      init: function (selector) {
        var match = this.match;
        function compilenamefilter(name) {
          if (name) {
            name = name.tolowercase();
            return function (item) {
              return name === '*' || item.type === name;
            };
          }
        }
        function compileidfilter(id) {
          if (id) {
            return function (item) {
              return item._name === id;
            };
          }
        }
        function compileclassesfilter(classes) {
          if (classes) {
            classes = classes.split('.');
            return function (item) {
              var i = classes.length;
              while (i--) {
                if (!item.classes.contains(classes[i])) {
                  return false;
                }
              }
              return true;
            };
          }
        }
        function compileattrfilter(name, cmp, check) {
          if (name) {
            return function (item) {
              var value = item[name] ? item[name]() : '';
              return !cmp ? !!check : cmp === '=' ? value === check : cmp === '*=' ? value.indexof(check) >= 0 : cmp === '~=' ? (' ' + value + ' ').indexof(' ' + check + ' ') >= 0 : cmp === '!=' ? value !== check : cmp === '^=' ? value.indexof(check) === 0 : cmp === '$=' ? value.substr(value.length - check.length) === check : false;
            };
          }
        }
        function compilepsuedofilter(name) {
          var notselectors;
          if (name) {
            name = /(?:not\((.+)\))|(.+)/i.exec(name);
            if (!name[1]) {
              name = name[2];
              return function (item, index, length) {
                return name === 'first' ? index === 0 : name === 'last' ? index === length - 1 : name === 'even' ? index % 2 === 0 : name === 'odd' ? index % 2 === 1 : item[name] ? item[name]() : false;
              };
            }
            notselectors = parsechunks(name[1], []);
            return function (item) {
              return !match(item, notselectors);
            };
          }
        }
        function compile(selector, filters, direct) {
          var parts;
          function add(filter) {
            if (filter) {
              filters.push(filter);
            }
          }
          parts = expression.exec(selector.replace(whitespace, ''));
          add(compilenamefilter(parts[1]));
          add(compileidfilter(parts[2]));
          add(compileclassesfilter(parts[3]));
          add(compileattrfilter(parts[4], parts[5], parts[6]));
          add(compilepsuedofilter(parts[7]));
          filters.pseudo = !!parts[7];
          filters.direct = direct;
          return filters;
        }
        function parsechunks(selector, selectors) {
          var parts = [];
          var extra, matches, i;
          do {
            chunker.exec('');
            matches = chunker.exec(selector);
            if (matches) {
              selector = matches[3];
              parts.push(matches[1]);
              if (matches[2]) {
                extra = matches[3];
                break;
              }
            }
          } while (matches);
          if (extra) {
            parsechunks(extra, selectors);
          }
          selector = [];
          for (i = 0; i < parts.length; i++) {
            if (parts[i] !== '>') {
              selector.push(compile(parts[i], [], parts[i - 1] === '>'));
            }
          }
          selectors.push(selector);
          return selectors;
        }
        this._selectors = parsechunks(selector, []);
      },
      match: function (control, selectors) {
        var i, l, si, sl, selector, fi, fl, filters, index, length, siblings, count, item;
        selectors = selectors || this._selectors;
        for (i = 0, l = selectors.length; i < l; i++) {
          selector = selectors[i];
          sl = selector.length;
          item = control;
          count = 0;
          for (si = sl - 1; si >= 0; si--) {
            filters = selector[si];
            while (item) {
              if (filters.pseudo) {
                siblings = item.parent().items();
                index = length = siblings.length;
                while (index--) {
                  if (siblings[index] === item) {
                    break;
                  }
                }
              }
              for (fi = 0, fl = filters.length; fi < fl; fi++) {
                if (!filters[fi](item, index, length)) {
                  fi = fl + 1;
                  break;
                }
              }
              if (fi === fl) {
                count++;
                break;
              } else {
                if (si === sl - 1) {
                  break;
                }
              }
              item = item.parent();
            }
          }
          if (count === sl) {
            return true;
          }
        }
        return false;
      },
      find: function (container) {
        var matches = [], i, l;
        var selectors = this._selectors;
        function collect(items, selector, index) {
          var i, l, fi, fl, item;
          var filters = selector[index];
          for (i = 0, l = items.length; i < l; i++) {
            item = items[i];
            for (fi = 0, fl = filters.length; fi < fl; fi++) {
              if (!filters[fi](item, i, l)) {
                fi = fl + 1;
                break;
              }
            }
            if (fi === fl) {
              if (index === selector.length - 1) {
                matches.push(item);
              } else {
                if (item.items) {
                  collect(item.items(), selector, index + 1);
                }
              }
            } else if (filters.direct) {
              return;
            }
            if (item.items) {
              collect(item.items(), selector, index);
            }
          }
        }
        if (container.items) {
          for (i = 0, l = selectors.length; i < l; i++) {
            collect(container.items(), selectors[i], 0);
          }
          if (l > 1) {
            matches = unique(matches);
          }
        }
        if (!collection) {
          collection = selector.collection;
        }
        return new collection(matches);
      }
    });

    var collection$1, proto;
    var push = array.prototype.push, slice = array.prototype.slice;
    proto = {
      length: 0,
      init: function (items) {
        if (items) {
          this.add(items);
        }
      },
      add: function (items) {
        var self = this;
        if (!global$4.isarray(items)) {
          if (items instanceof collection$1) {
            self.add(items.toarray());
          } else {
            push.call(self, items);
          }
        } else {
          push.apply(self, items);
        }
        return self;
      },
      set: function (items) {
        var self = this;
        var len = self.length;
        var i;
        self.length = 0;
        self.add(items);
        for (i = self.length; i < len; i++) {
          delete self[i];
        }
        return self;
      },
      filter: function (selector) {
        var self = this;
        var i, l;
        var matches = [];
        var item, match;
        if (typeof selector === 'string') {
          selector = new selector(selector);
          match = function (item) {
            return selector.match(item);
          };
        } else {
          match = selector;
        }
        for (i = 0, l = self.length; i < l; i++) {
          item = self[i];
          if (match(item)) {
            matches.push(item);
          }
        }
        return new collection$1(matches);
      },
      slice: function () {
        return new collection$1(slice.apply(this, arguments));
      },
      eq: function (index) {
        return index === -1 ? this.slice(index) : this.slice(index, +index + 1);
      },
      each: function (callback) {
        global$4.each(this, callback);
        return this;
      },
      toarray: function () {
        return global$4.toarray(this);
      },
      indexof: function (ctrl) {
        var self = this;
        var i = self.length;
        while (i--) {
          if (self[i] === ctrl) {
            break;
          }
        }
        return i;
      },
      reverse: function () {
        return new collection$1(global$4.toarray(this).reverse());
      },
      hasclass: function (cls) {
        return this[0] ? this[0].classes.contains(cls) : false;
      },
      prop: function (name, value) {
        var self = this;
        var item;
        if (value !== undefined) {
          self.each(function (item) {
            if (item[name]) {
              item[name](value);
            }
          });
          return self;
        }
        item = self[0];
        if (item && item[name]) {
          return item[name]();
        }
      },
      exec: function (name) {
        var self = this, args = global$4.toarray(arguments).slice(1);
        self.each(function (item) {
          if (item[name]) {
            item[name].apply(item, args);
          }
        });
        return self;
      },
      remove: function () {
        var i = this.length;
        while (i--) {
          this[i].remove();
        }
        return this;
      },
      addclass: function (cls) {
        return this.each(function (item) {
          item.classes.add(cls);
        });
      },
      removeclass: function (cls) {
        return this.each(function (item) {
          item.classes.remove(cls);
        });
      }
    };
    global$4.each('fire on off show hide append prepend before after reflow'.split(' '), function (name) {
      proto[name] = function () {
        var args = global$4.toarray(arguments);
        this.each(function (ctrl) {
          if (name in ctrl) {
            ctrl[name].apply(ctrl, args);
          }
        });
        return this;
      };
    });
    global$4.each('text name disabled active selected checked visible parent value data'.split(' '), function (name) {
      proto[name] = function (value) {
        return this.prop(name, value);
      };
    });
    collection$1 = global$8.extend(proto);
    selector.collection = collection$1;
    var collection$2 = collection$1;

    var binding = function (settings) {
      this.create = settings.create;
    };
    binding.create = function (model, name) {
      return new binding({
        create: function (othermodel, othername) {
          var bindings;
          var fromselftoother = function (e) {
            othermodel.set(othername, e.value);
          };
          var fromothertoself = function (e) {
            model.set(name, e.value);
          };
          othermodel.on('change:' + othername, fromothertoself);
          model.on('change:' + name, fromselftoother);
          bindings = othermodel._bindings;
          if (!bindings) {
            bindings = othermodel._bindings = [];
            othermodel.on('destroy', function () {
              var i = bindings.length;
              while (i--) {
                bindings[i]();
              }
            });
          }
          bindings.push(function () {
            model.off('change:' + name, fromselftoother);
          });
          return model.get(name);
        }
      });
    };

    var global$a = tinymce.util.tools.resolve('tinymce.util.observable');

    function isnode(node) {
      return node.nodetype > 0;
    }
    function isequal(a, b) {
      var k, checked;
      if (a === b) {
        return true;
      }
      if (a === null || b === null) {
        return a === b;
      }
      if (typeof a !== 'object' || typeof b !== 'object') {
        return a === b;
      }
      if (global$4.isarray(b)) {
        if (a.length !== b.length) {
          return false;
        }
        k = a.length;
        while (k--) {
          if (!isequal(a[k], b[k])) {
            return false;
          }
        }
      }
      if (isnode(a) || isnode(b)) {
        return a === b;
      }
      checked = {};
      for (k in b) {
        if (!isequal(a[k], b[k])) {
          return false;
        }
        checked[k] = true;
      }
      for (k in a) {
        if (!checked[k] && !isequal(a[k], b[k])) {
          return false;
        }
      }
      return true;
    }
    var observableobject = global$8.extend({
      mixins: [global$a],
      init: function (data) {
        var name, value;
        data = data || {};
        for (name in data) {
          value = data[name];
          if (value instanceof binding) {
            data[name] = value.create(this, name);
          }
        }
        this.data = data;
      },
      set: function (name, value) {
        var key, args;
        var oldvalue = this.data[name];
        if (value instanceof binding) {
          value = value.create(this, name);
        }
        if (typeof name === 'object') {
          for (key in name) {
            this.set(key, name[key]);
          }
          return this;
        }
        if (!isequal(oldvalue, value)) {
          this.data[name] = value;
          args = {
            target: this,
            name: name,
            value: value,
            oldvalue: oldvalue
          };
          this.fire('change:' + name, args);
          this.fire('change', args);
        }
        return this;
      },
      get: function (name) {
        return this.data[name];
      },
      has: function (name) {
        return name in this.data;
      },
      bind: function (name) {
        return binding.create(this, name);
      },
      destroy: function () {
        this.fire('destroy');
      }
    });

    var dirtyctrls = {}, animationframerequested;
    var reflowqueue = {
      add: function (ctrl) {
        var parent = ctrl.parent();
        if (parent) {
          if (!parent._layout || parent._layout.isnative()) {
            return;
          }
          if (!dirtyctrls[parent._id]) {
            dirtyctrls[parent._id] = parent;
          }
          if (!animationframerequested) {
            animationframerequested = true;
            global$3.requestanimationframe(function () {
              var id, ctrl;
              animationframerequested = false;
              for (id in dirtyctrls) {
                ctrl = dirtyctrls[id];
                if (ctrl.state.get('rendered')) {
                  ctrl.reflow();
                }
              }
              dirtyctrls = {};
            }, domglobals.document.body);
          }
        }
      },
      remove: function (ctrl) {
        if (dirtyctrls[ctrl._id]) {
          delete dirtyctrls[ctrl._id];
        }
      }
    };

    var getuicontainerdelta = function (ctrl) {
      var uicontainer = getuicontainer(ctrl);
      if (uicontainer && global$2.dom.getstyle(uicontainer, 'position', true) !== 'static') {
        var containerpos = global$2.dom.getpos(uicontainer);
        var dx = uicontainer.scrollleft - containerpos.x;
        var dy = uicontainer.scrolltop - containerpos.y;
        return option.some({
          x: dx,
          y: dy
        });
      } else {
        return option.none();
      }
    };
    var setuicontainer = function (editor, ctrl) {
      var uicontainer = global$2.dom.select(editor.settings.ui_container)[0];
      ctrl.getroot().uicontainer = uicontainer;
    };
    var getuicontainer = function (ctrl) {
      return ctrl ? ctrl.getroot().uicontainer : null;
    };
    var inherituicontainer = function (fromctrl, toctrl) {
      return toctrl.uicontainer = getuicontainer(fromctrl);
    };
    var uicontainer = {
      getuicontainerdelta: getuicontainerdelta,
      setuicontainer: setuicontainer,
      getuicontainer: getuicontainer,
      inherituicontainer: inherituicontainer
    };

    var hasmousewheeleventsupport = 'onmousewheel' in domglobals.document;
    var haswheeleventsupport = false;
    var classprefix = 'mce-';
    var control, idcounter = 0;
    var proto$1 = {
      statics: { classprefix: classprefix },
      isrtl: function () {
        return control.rtl;
      },
      classprefix: classprefix,
      init: function (settings) {
        var self = this;
        var classes, defaultclasses;
        function applyclasses(classes) {
          var i;
          classes = classes.split(' ');
          for (i = 0; i < classes.length; i++) {
            self.classes.add(classes[i]);
          }
        }
        self.settings = settings = global$4.extend({}, self.defaults, settings);
        self._id = settings.id || 'mceu_' + idcounter++;
        self._aria = { role: settings.role };
        self._elmcache = {};
        self.$ = global$7;
        self.state = new observableobject({
          visible: true,
          active: false,
          disabled: false,
          value: ''
        });
        self.data = new observableobject(settings.data);
        self.classes = new classlist(function () {
          if (self.state.get('rendered')) {
            self.getel().classname = this.tostring();
          }
        });
        self.classes.prefix = self.classprefix;
        classes = settings.classes;
        if (classes) {
          if (self.defaults) {
            defaultclasses = self.defaults.classes;
            if (defaultclasses && classes !== defaultclasses) {
              applyclasses(defaultclasses);
            }
          }
          applyclasses(classes);
        }
        global$4.each('title text name visible disabled active value'.split(' '), function (name) {
          if (name in settings) {
            self[name](settings[name]);
          }
        });
        self.on('click', function () {
          if (self.disabled()) {
            return false;
          }
        });
        self.settings = settings;
        self.borderbox = boxutils.parsebox(settings.border);
        self.paddingbox = boxutils.parsebox(settings.padding);
        self.marginbox = boxutils.parsebox(settings.margin);
        if (settings.hidden) {
          self.hide();
        }
      },
      properties: 'parent,name',
      getcontainerelm: function () {
        var uicontainer = uicontainer.getuicontainer(this);
        return uicontainer ? uicontainer : funcs.getcontainer();
      },
      getparentctrl: function (elm) {
        var ctrl;
        var lookup = this.getroot().controlidlookup;
        while (elm && lookup) {
          ctrl = lookup[elm.id];
          if (ctrl) {
            break;
          }
          elm = elm.parentnode;
        }
        return ctrl;
      },
      initlayoutrect: function () {
        var self = this;
        var settings = self.settings;
        var borderbox, layoutrect;
        var elm = self.getel();
        var width, height, minwidth, minheight, autoresize;
        var startminwidth, startminheight, initialsize;
        borderbox = self.borderbox = self.borderbox || boxutils.measurebox(elm, 'border');
        self.paddingbox = self.paddingbox || boxutils.measurebox(elm, 'padding');
        self.marginbox = self.marginbox || boxutils.measurebox(elm, 'margin');
        initialsize = funcs.getsize(elm);
        startminwidth = settings.minwidth;
        startminheight = settings.minheight;
        minwidth = startminwidth || initialsize.width;
        minheight = startminheight || initialsize.height;
        width = settings.width;
        height = settings.height;
        autoresize = settings.autoresize;
        autoresize = typeof autoresize !== 'undefined' ? autoresize : !width && !height;
        width = width || minwidth;
        height = height || minheight;
        var deltaw = borderbox.left + borderbox.right;
        var deltah = borderbox.top + borderbox.bottom;
        var maxw = settings.maxwidth || 65535;
        var maxh = settings.maxheight || 65535;
        self._layoutrect = layoutrect = {
          x: settings.x || 0,
          y: settings.y || 0,
          w: width,
          h: height,
          deltaw: deltaw,
          deltah: deltah,
          contentw: width - deltaw,
          contenth: height - deltah,
          innerw: width - deltaw,
          innerh: height - deltah,
          startminwidth: startminwidth || 0,
          startminheight: startminheight || 0,
          minw: math.min(minwidth, maxw),
          minh: math.min(minheight, maxh),
          maxw: maxw,
          maxh: maxh,
          autoresize: autoresize,
          scrollw: 0
        };
        self._lastlayoutrect = {};
        return layoutrect;
      },
      layoutrect: function (newrect) {
        var self = this;
        var currect = self._layoutrect, lastlayoutrect, size, deltawidth, deltaheight, repaintcontrols;
        if (!currect) {
          currect = self.initlayoutrect();
        }
        if (newrect) {
          deltawidth = currect.deltaw;
          deltaheight = currect.deltah;
          if (newrect.x !== undefined) {
            currect.x = newrect.x;
          }
          if (newrect.y !== undefined) {
            currect.y = newrect.y;
          }
          if (newrect.minw !== undefined) {
            currect.minw = newrect.minw;
          }
          if (newrect.minh !== undefined) {
            currect.minh = newrect.minh;
          }
          size = newrect.w;
          if (size !== undefined) {
            size = size < currect.minw ? currect.minw : size;
            size = size > currect.maxw ? currect.maxw : size;
            currect.w = size;
            currect.innerw = size - deltawidth;
          }
          size = newrect.h;
          if (size !== undefined) {
            size = size < currect.minh ? currect.minh : size;
            size = size > currect.maxh ? currect.maxh : size;
            currect.h = size;
            currect.innerh = size - deltaheight;
          }
          size = newrect.innerw;
          if (size !== undefined) {
            size = size < currect.minw - deltawidth ? currect.minw - deltawidth : size;
            size = size > currect.maxw - deltawidth ? currect.maxw - deltawidth : size;
            currect.innerw = size;
            currect.w = size + deltawidth;
          }
          size = newrect.innerh;
          if (size !== undefined) {
            size = size < currect.minh - deltaheight ? currect.minh - deltaheight : size;
            size = size > currect.maxh - deltaheight ? currect.maxh - deltaheight : size;
            currect.innerh = size;
            currect.h = size + deltaheight;
          }
          if (newrect.contentw !== undefined) {
            currect.contentw = newrect.contentw;
          }
          if (newrect.contenth !== undefined) {
            currect.contenth = newrect.contenth;
          }
          lastlayoutrect = self._lastlayoutrect;
          if (lastlayoutrect.x !== currect.x || lastlayoutrect.y !== currect.y || lastlayoutrect.w !== currect.w || lastlayoutrect.h !== currect.h) {
            repaintcontrols = control.repaintcontrols;
            if (repaintcontrols) {
              if (repaintcontrols.map && !repaintcontrols.map[self._id]) {
                repaintcontrols.push(self);
                repaintcontrols.map[self._id] = true;
              }
            }
            lastlayoutrect.x = currect.x;
            lastlayoutrect.y = currect.y;
            lastlayoutrect.w = currect.w;
            lastlayoutrect.h = currect.h;
          }
          return self;
        }
        return currect;
      },
      repaint: function () {
        var self = this;
        var style, bodystyle, bodyelm, rect, borderbox;
        var borderw, borderh, lastrepaintrect, round, value;
        round = !domglobals.document.createrange ? math.round : function (value) {
          return value;
        };
        style = self.getel().style;
        rect = self._layoutrect;
        lastrepaintrect = self._lastrepaintrect || {};
        borderbox = self.borderbox;
        borderw = borderbox.left + borderbox.right;
        borderh = borderbox.top + borderbox.bottom;
        if (rect.x !== lastrepaintrect.x) {
          style.left = round(rect.x) + 'px';
          lastrepaintrect.x = rect.x;
        }
        if (rect.y !== lastrepaintrect.y) {
          style.top = round(rect.y) + 'px';
          lastrepaintrect.y = rect.y;
        }
        if (rect.w !== lastrepaintrect.w) {
          value = round(rect.w - borderw);
          style.width = (value >= 0 ? value : 0) + 'px';
          lastrepaintrect.w = rect.w;
        }
        if (rect.h !== lastrepaintrect.h) {
          value = round(rect.h - borderh);
          style.height = (value >= 0 ? value : 0) + 'px';
          lastrepaintrect.h = rect.h;
        }
        if (self._hasbody && rect.innerw !== lastrepaintrect.innerw) {
          value = round(rect.innerw);
          bodyelm = self.getel('body');
          if (bodyelm) {
            bodystyle = bodyelm.style;
            bodystyle.width = (value >= 0 ? value : 0) + 'px';
          }
          lastrepaintrect.innerw = rect.innerw;
        }
        if (self._hasbody && rect.innerh !== lastrepaintrect.innerh) {
          value = round(rect.innerh);
          bodyelm = bodyelm || self.getel('body');
          if (bodyelm) {
            bodystyle = bodystyle || bodyelm.style;
            bodystyle.height = (value >= 0 ? value : 0) + 'px';
          }
          lastrepaintrect.innerh = rect.innerh;
        }
        self._lastrepaintrect = lastrepaintrect;
        self.fire('repaint', {}, false);
      },
      updatelayoutrect: function () {
        var self = this;
        self.parent()._lastrect = null;
        funcs.css(self.getel(), {
          width: '',
          height: ''
        });
        self._layoutrect = self._lastrepaintrect = self._lastlayoutrect = null;
        self.initlayoutrect();
      },
      on: function (name, callback) {
        var self = this;
        function resolvecallbackname(name) {
          var callback, scope;
          if (typeof name !== 'string') {
            return name;
          }
          return function (e) {
            if (!callback) {
              self.parentsandself().each(function (ctrl) {
                var callbacks = ctrl.settings.callbacks;
                if (callbacks && (callback = callbacks[name])) {
                  scope = ctrl;
                  return false;
                }
              });
            }
            if (!callback) {
              e.action = name;
              this.fire('execute', e);
              return;
            }
            return callback.call(scope, e);
          };
        }
        geteventdispatcher(self).on(name, resolvecallbackname(callback));
        return self;
      },
      off: function (name, callback) {
        geteventdispatcher(this).off(name, callback);
        return this;
      },
      fire: function (name, args, bubble) {
        var self = this;
        args = args || {};
        if (!args.control) {
          args.control = self;
        }
        args = geteventdispatcher(self).fire(name, args);
        if (bubble !== false && self.parent) {
          var parent = self.parent();
          while (parent && !args.ispropagationstopped()) {
            parent.fire(name, args, false);
            parent = parent.parent();
          }
        }
        return args;
      },
      haseventlisteners: function (name) {
        return geteventdispatcher(this).has(name);
      },
      parents: function (selector) {
        var self = this;
        var ctrl, parents = new collection$2();
        for (ctrl = self.parent(); ctrl; ctrl = ctrl.parent()) {
          parents.add(ctrl);
        }
        if (selector) {
          parents = parents.filter(selector);
        }
        return parents;
      },
      parentsandself: function (selector) {
        return new collection$2(this).add(this.parents(selector));
      },
      next: function () {
        var parentcontrols = this.parent().items();
        return parentcontrols[parentcontrols.indexof(this) + 1];
      },
      prev: function () {
        var parentcontrols = this.parent().items();
        return parentcontrols[parentcontrols.indexof(this) - 1];
      },
      innerhtml: function (html) {
        this.$el.html(html);
        return this;
      },
      getel: function (suffix) {
        var id = suffix ? this._id + '-' + suffix : this._id;
        if (!this._elmcache[id]) {
          this._elmcache[id] = global$7('#' + id)[0];
        }
        return this._elmcache[id];
      },
      show: function () {
        return this.visible(true);
      },
      hide: function () {
        return this.visible(false);
      },
      focus: function () {
        try {
          this.getel().focus();
        } catch (ex) {
        }
        return this;
      },
      blur: function () {
        this.getel().blur();
        return this;
      },
      aria: function (name, value) {
        var self = this, elm = self.getel(self.ariatarget);
        if (typeof value === 'undefined') {
          return self._aria[name];
        }
        self._aria[name] = value;
        if (self.state.get('rendered')) {
          elm.setattribute(name === 'role' ? name : 'aria-' + name, value);
        }
        return self;
      },
      encode: function (text, translate) {
        if (translate !== false) {
          text = this.translate(text);
        }
        return (text || '').replace(/[&<>"]/g, function (match) {
          return '&#' + match.charcodeat(0) + ';';
        });
      },
      translate: function (text) {
        return control.translate ? control.translate(text) : text;
      },
      before: function (items) {
        var self = this, parent = self.parent();
        if (parent) {
          parent.insert(items, parent.items().indexof(self), true);
        }
        return self;
      },
      after: function (items) {
        var self = this, parent = self.parent();
        if (parent) {
          parent.insert(items, parent.items().indexof(self));
        }
        return self;
      },
      remove: function () {
        var self = this;
        var elm = self.getel();
        var parent = self.parent();
        var newitems, i;
        if (self.items) {
          var controls = self.items().toarray();
          i = controls.length;
          while (i--) {
            controls[i].remove();
          }
        }
        if (parent && parent.items) {
          newitems = [];
          parent.items().each(function (item) {
            if (item !== self) {
              newitems.push(item);
            }
          });
          parent.items().set(newitems);
          parent._lastrect = null;
        }
        if (self._eventsroot && self._eventsroot === self) {
          global$7(elm).off();
        }
        var lookup = self.getroot().controlidlookup;
        if (lookup) {
          delete lookup[self._id];
        }
        if (elm && elm.parentnode) {
          elm.parentnode.removechild(elm);
        }
        self.state.set('rendered', false);
        self.state.destroy();
        self.fire('remove');
        return self;
      },
      renderbefore: function (elm) {
        global$7(elm).before(this.renderhtml());
        this.postrender();
        return this;
      },
      renderto: function (elm) {
        global$7(elm || this.getcontainerelm()).append(this.renderhtml());
        this.postrender();
        return this;
      },
      prerender: function () {
      },
      render: function () {
      },
      renderhtml: function () {
        return '<div id="' + this._id + '" class="' + this.classes + '"></div>';
      },
      postrender: function () {
        var self = this;
        var settings = self.settings;
        var elm, box, parent, name, parenteventsroot;
        self.$el = global$7(self.getel());
        self.state.set('rendered', true);
        for (name in settings) {
          if (name.indexof('on') === 0) {
            self.on(name.substr(2), settings[name]);
          }
        }
        if (self._eventsroot) {
          for (parent = self.parent(); !parenteventsroot && parent; parent = parent.parent()) {
            parenteventsroot = parent._eventsroot;
          }
          if (parenteventsroot) {
            for (name in parenteventsroot._nativeevents) {
              self._nativeevents[name] = true;
            }
          }
        }
        bindpendingevents(self);
        if (settings.style) {
          elm = self.getel();
          if (elm) {
            elm.setattribute('style', settings.style);
            elm.style.csstext = settings.style;
          }
        }
        if (self.settings.border) {
          box = self.borderbox;
          self.$el.css({
            'border-top-width': box.top,
            'border-right-width': box.right,
            'border-bottom-width': box.bottom,
            'border-left-width': box.left
          });
        }
        var root = self.getroot();
        if (!root.controlidlookup) {
          root.controlidlookup = {};
        }
        root.controlidlookup[self._id] = self;
        for (var key in self._aria) {
          self.aria(key, self._aria[key]);
        }
        if (self.state.get('visible') === false) {
          self.getel().style.display = 'none';
        }
        self.bindstates();
        self.state.on('change:visible', function (e) {
          var state = e.value;
          var parentctrl;
          if (self.state.get('rendered')) {
            self.getel().style.display = state === false ? 'none' : '';
            self.getel().getboundingclientrect();
          }
          parentctrl = self.parent();
          if (parentctrl) {
            parentctrl._lastrect = null;
          }
          self.fire(state ? 'show' : 'hide');
          reflowqueue.add(self);
        });
        self.fire('postrender', {}, false);
      },
      bindstates: function () {
      },
      scrollintoview: function (align) {
        function getoffset(elm, rootelm) {
          var x, y, parent = elm;
          x = y = 0;
          while (parent && parent !== rootelm && parent.nodetype) {
            x += parent.offsetleft || 0;
            y += parent.offsettop || 0;
            parent = parent.offsetparent;
          }
          return {
            x: x,
            y: y
          };
        }
        var elm = this.getel(), parentelm = elm.parentnode;
        var x, y, width, height, parentwidth, parentheight;
        var pos = getoffset(elm, parentelm);
        x = pos.x;
        y = pos.y;
        width = elm.offsetwidth;
        height = elm.offsetheight;
        parentwidth = parentelm.clientwidth;
        parentheight = parentelm.clientheight;
        if (align === 'end') {
          x -= parentwidth - width;
          y -= parentheight - height;
        } else if (align === 'center') {
          x -= parentwidth / 2 - width / 2;
          y -= parentheight / 2 - height / 2;
        }
        parentelm.scrollleft = x;
        parentelm.scrolltop = y;
        return this;
      },
      getroot: function () {
        var ctrl = this, rootcontrol;
        var parents = [];
        while (ctrl) {
          if (ctrl.rootcontrol) {
            rootcontrol = ctrl.rootcontrol;
            break;
          }
          parents.push(ctrl);
          rootcontrol = ctrl;
          ctrl = ctrl.parent();
        }
        if (!rootcontrol) {
          rootcontrol = this;
        }
        var i = parents.length;
        while (i--) {
          parents[i].rootcontrol = rootcontrol;
        }
        return rootcontrol;
      },
      reflow: function () {
        reflowqueue.remove(this);
        var parent = this.parent();
        if (parent && parent._layout && !parent._layout.isnative()) {
          parent.reflow();
        }
        return this;
      }
    };
    global$4.each('text title visible disabled active value'.split(' '), function (name) {
      proto$1[name] = function (value) {
        if (arguments.length === 0) {
          return this.state.get(name);
        }
        if (typeof value !== 'undefined') {
          this.state.set(name, value);
        }
        return this;
      };
    });
    control = global$8.extend(proto$1);
    function geteventdispatcher(obj) {
      if (!obj._eventdispatcher) {
        obj._eventdispatcher = new global$9({
          scope: obj,
          toggleevent: function (name, state) {
            if (state && global$9.isnative(name)) {
              if (!obj._nativeevents) {
                obj._nativeevents = {};
              }
              obj._nativeevents[name] = true;
              if (obj.state.get('rendered')) {
                bindpendingevents(obj);
              }
            }
          }
        });
      }
      return obj._eventdispatcher;
    }
    function bindpendingevents(eventctrl) {
      var i, l, parents, eventrootctrl, nativeevents, name;
      function delegate(e) {
        var control = eventctrl.getparentctrl(e.target);
        if (control) {
          control.fire(e.type, e);
        }
      }
      function mouseleavehandler() {
        var ctrl = eventrootctrl._lasthoverctrl;
        if (ctrl) {
          ctrl.fire('mouseleave', { target: ctrl.getel() });
          ctrl.parents().each(function (ctrl) {
            ctrl.fire('mouseleave', { target: ctrl.getel() });
          });
          eventrootctrl._lasthoverctrl = null;
        }
      }
      function mouseenterhandler(e) {
        var ctrl = eventctrl.getparentctrl(e.target), lastctrl = eventrootctrl._lasthoverctrl, idx = 0, i, parents, lastparents;
        if (ctrl !== lastctrl) {
          eventrootctrl._lasthoverctrl = ctrl;
          parents = ctrl.parents().toarray().reverse();
          parents.push(ctrl);
          if (lastctrl) {
            lastparents = lastctrl.parents().toarray().reverse();
            lastparents.push(lastctrl);
            for (idx = 0; idx < lastparents.length; idx++) {
              if (parents[idx] !== lastparents[idx]) {
                break;
              }
            }
            for (i = lastparents.length - 1; i >= idx; i--) {
              lastctrl = lastparents[i];
              lastctrl.fire('mouseleave', { target: lastctrl.getel() });
            }
          }
          for (i = idx; i < parents.length; i++) {
            ctrl = parents[i];
            ctrl.fire('mouseenter', { target: ctrl.getel() });
          }
        }
      }
      function fixwheelevent(e) {
        e.preventdefault();
        if (e.type === 'mousewheel') {
          e.deltay = -1 / 40 * e.wheeldelta;
          if (e.wheeldeltax) {
            e.deltax = -1 / 40 * e.wheeldeltax;
          }
        } else {
          e.deltax = 0;
          e.deltay = e.detail;
        }
        e = eventctrl.fire('wheel', e);
      }
      nativeevents = eventctrl._nativeevents;
      if (nativeevents) {
        parents = eventctrl.parents().toarray();
        parents.unshift(eventctrl);
        for (i = 0, l = parents.length; !eventrootctrl && i < l; i++) {
          eventrootctrl = parents[i]._eventsroot;
        }
        if (!eventrootctrl) {
          eventrootctrl = parents[parents.length - 1] || eventctrl;
        }
        eventctrl._eventsroot = eventrootctrl;
        for (l = i, i = 0; i < l; i++) {
          parents[i]._eventsroot = eventrootctrl;
        }
        var eventrootdelegates = eventrootctrl._delegates;
        if (!eventrootdelegates) {
          eventrootdelegates = eventrootctrl._delegates = {};
        }
        for (name in nativeevents) {
          if (!nativeevents) {
            return false;
          }
          if (name === 'wheel' && !haswheeleventsupport) {
            if (hasmousewheeleventsupport) {
              global$7(eventctrl.getel()).on('mousewheel', fixwheelevent);
            } else {
              global$7(eventctrl.getel()).on('dommousescroll', fixwheelevent);
            }
            continue;
          }
          if (name === 'mouseenter' || name === 'mouseleave') {
            if (!eventrootctrl._hasmouseenter) {
              global$7(eventrootctrl.getel()).on('mouseleave', mouseleavehandler).on('mouseover', mouseenterhandler);
              eventrootctrl._hasmouseenter = 1;
            }
          } else if (!eventrootdelegates[name]) {
            global$7(eventrootctrl.getel()).on(name, delegate);
            eventrootdelegates[name] = true;
          }
          nativeevents[name] = false;
        }
      }
    }
    var control$1 = control;

    var isstatic = function (elm) {
      return funcs.getruntimestyle(elm, 'position') === 'static';
    };
    var isfixed = function (ctrl) {
      return ctrl.state.get('fixed');
    };
    function calculaterelativeposition(ctrl, targetelm, rel) {
      var ctrlelm, pos, x, y, selfw, selfh, targetw, targeth, viewport, size;
      viewport = getwindowviewport();
      pos = funcs.getpos(targetelm, uicontainer.getuicontainer(ctrl));
      x = pos.x;
      y = pos.y;
      if (isfixed(ctrl) && isstatic(domglobals.document.body)) {
        x -= viewport.x;
        y -= viewport.y;
      }
      ctrlelm = ctrl.getel();
      size = funcs.getsize(ctrlelm);
      selfw = size.width;
      selfh = size.height;
      size = funcs.getsize(targetelm);
      targetw = size.width;
      targeth = size.height;
      rel = (rel || '').split('');
      if (rel[0] === 'b') {
        y += targeth;
      }
      if (rel[1] === 'r') {
        x += targetw;
      }
      if (rel[0] === 'c') {
        y += math.round(targeth / 2);
      }
      if (rel[1] === 'c') {
        x += math.round(targetw / 2);
      }
      if (rel[3] === 'b') {
        y -= selfh;
      }
      if (rel[4] === 'r') {
        x -= selfw;
      }
      if (rel[3] === 'c') {
        y -= math.round(selfh / 2);
      }
      if (rel[4] === 'c') {
        x -= math.round(selfw / 2);
      }
      return {
        x: x,
        y: y,
        w: selfw,
        h: selfh
      };
    }
    var getuicontainerviewport = function (customuicontainer) {
      return {
        x: 0,
        y: 0,
        w: customuicontainer.scrollwidth - 1,
        h: customuicontainer.scrollheight - 1
      };
    };
    var getwindowviewport = function () {
      var win = domglobals.window;
      var x = math.max(win.pagexoffset, domglobals.document.body.scrollleft, domglobals.document.documentelement.scrollleft);
      var y = math.max(win.pageyoffset, domglobals.document.body.scrolltop, domglobals.document.documentelement.scrolltop);
      var w = win.innerwidth || domglobals.document.documentelement.clientwidth;
      var h = win.innerheight || domglobals.document.documentelement.clientheight;
      return {
        x: x,
        y: y,
        w: w,
        h: h
      };
    };
    var getviewportrect = function (ctrl) {
      var customuicontainer = uicontainer.getuicontainer(ctrl);
      return customuicontainer && !isfixed(ctrl) ? getuicontainerviewport(customuicontainer) : getwindowviewport();
    };
    var movable = {
      testmoverel: function (elm, rels) {
        var viewportrect = getviewportrect(this);
        for (var i = 0; i < rels.length; i++) {
          var pos = calculaterelativeposition(this, elm, rels[i]);
          if (isfixed(this)) {
            if (pos.x > 0 && pos.x + pos.w < viewportrect.w && pos.y > 0 && pos.y + pos.h < viewportrect.h) {
              return rels[i];
            }
          } else {
            if (pos.x > viewportrect.x && pos.x + pos.w < viewportrect.w + viewportrect.x && pos.y > viewportrect.y && pos.y + pos.h < viewportrect.h + viewportrect.y) {
              return rels[i];
            }
          }
        }
        return rels[0];
      },
      moverel: function (elm, rel) {
        if (typeof rel !== 'string') {
          rel = this.testmoverel(elm, rel);
        }
        var pos = calculaterelativeposition(this, elm, rel);
        return this.moveto(pos.x, pos.y);
      },
      moveby: function (dx, dy) {
        var self = this, rect = self.layoutrect();
        self.moveto(rect.x + dx, rect.y + dy);
        return self;
      },
      moveto: function (x, y) {
        var self = this;
        function constrain(value, max, size) {
          if (value < 0) {
            return 0;
          }
          if (value + size > max) {
            value = max - size;
            return value < 0 ? 0 : value;
          }
          return value;
        }
        if (self.settings.constraintoviewport) {
          var viewportrect = getviewportrect(this);
          var layoutrect = self.layoutrect();
          x = constrain(x, viewportrect.w + viewportrect.x, layoutrect.w);
          y = constrain(y, viewportrect.h + viewportrect.y, layoutrect.h);
        }
        var uicontainer = uicontainer.getuicontainer(self);
        if (uicontainer && isstatic(uicontainer) && !isfixed(self)) {
          x -= uicontainer.scrollleft;
          y -= uicontainer.scrolltop;
        }
        if (uicontainer) {
          x += 1;
          y += 1;
        }
        if (self.state.get('rendered')) {
          self.layoutrect({
            x: x,
            y: y
          }).repaint();
        } else {
          self.settings.x = x;
          self.settings.y = y;
        }
        self.fire('move', {
          x: x,
          y: y
        });
        return self;
      }
    };

    var tooltip = control$1.extend({
      mixins: [movable],
      defaults: { classes: 'widget tooltip tooltip-n' },
      renderhtml: function () {
        var self = this, prefix = self.classprefix;
        return '<div id="' + self._id + '" class="' + self.classes + '" role="presentation">' + '<div class="' + prefix + 'tooltip-arrow"></div>' + '<div class="' + prefix + 'tooltip-inner">' + self.encode(self.state.get('text')) + '</div>' + '</div>';
      },
      bindstates: function () {
        var self = this;
        self.state.on('change:text', function (e) {
          self.getel().lastchild.innerhtml = self.encode(e.value);
        });
        return self._super();
      },
      repaint: function () {
        var self = this;
        var style, rect;
        style = self.getel().style;
        rect = self._layoutrect;
        style.left = rect.x + 'px';
        style.top = rect.y + 'px';
        style.zindex = 65535 + 65535;
      }
    });

    var widget = control$1.extend({
      init: function (settings) {
        var self = this;
        self._super(settings);
        settings = self.settings;
        self.canfocus = true;
        if (settings.tooltip && widget.tooltips !== false) {
          self.on('mouseenter', function (e) {
            var tooltip = self.tooltip().moveto(-65535);
            if (e.control === self) {
              var rel = tooltip.text(settings.tooltip).show().testmoverel(self.getel(), [
                'bc-tc',
                'bc-tl',
                'bc-tr'
              ]);
              tooltip.classes.toggle('tooltip-n', rel === 'bc-tc');
              tooltip.classes.toggle('tooltip-nw', rel === 'bc-tl');
              tooltip.classes.toggle('tooltip-ne', rel === 'bc-tr');
              tooltip.moverel(self.getel(), rel);
            } else {
              tooltip.hide();
            }
          });
          self.on('mouseleave mousedown click', function () {
            self.tooltip().remove();
            self._tooltip = null;
          });
        }
        self.aria('label', settings.arialabel || settings.tooltip);
      },
      tooltip: function () {
        if (!this._tooltip) {
          this._tooltip = new tooltip({ type: 'tooltip' });
          uicontainer.inherituicontainer(this, this._tooltip);
          this._tooltip.renderto();
        }
        return this._tooltip;
      },
      postrender: function () {
        var self = this, settings = self.settings;
        self._super();
        if (!self.parent() && (settings.width || settings.height)) {
          self.initlayoutrect();
          self.repaint();
        }
        if (settings.autofocus) {
          self.focus();
        }
      },
      bindstates: function () {
        var self = this;
        function disable(state) {
          self.aria('disabled', state);
          self.classes.toggle('disabled', state);
        }
        function active(state) {
          self.aria('pressed', state);
          self.classes.toggle('active', state);
        }
        self.state.on('change:disabled', function (e) {
          disable(e.value);
        });
        self.state.on('change:active', function (e) {
          active(e.value);
        });
        if (self.state.get('disabled')) {
          disable(true);
        }
        if (self.state.get('active')) {
          active(true);
        }
        return self._super();
      },
      remove: function () {
        this._super();
        if (this._tooltip) {
          this._tooltip.remove();
          this._tooltip = null;
        }
      }
    });

    var progress = widget.extend({
      defaults: { value: 0 },
      init: function (settings) {
        var self = this;
        self._super(settings);
        self.classes.add('progress');
        if (!self.settings.filter) {
          self.settings.filter = function (value) {
            return math.round(value);
          };
        }
      },
      renderhtml: function () {
        var self = this, id = self._id, prefix = this.classprefix;
        return '<div id="' + id + '" class="' + self.classes + '">' + '<div class="' + prefix + 'bar-container">' + '<div class="' + prefix + 'bar"></div>' + '</div>' + '<div class="' + prefix + 'text">0%</div>' + '</div>';
      },
      postrender: function () {
        var self = this;
        self._super();
        self.value(self.settings.value);
        return self;
      },
      bindstates: function () {
        var self = this;
        function setvalue(value) {
          value = self.settings.filter(value);
          self.getel().lastchild.innerhtml = value + '%';
          self.getel().firstchild.firstchild.style.width = value + '%';
        }
        self.state.on('change:value', function (e) {
          setvalue(e.value);
        });
        setvalue(self.state.get('value'));
        return self._super();
      }
    });

    var updateliveregion = function (ctx, text) {
      ctx.getel().lastchild.textcontent = text + (ctx.progressbar ? ' ' + ctx.progressbar.value() + '%' : '');
    };
    var notification = control$1.extend({
      mixins: [movable],
      defaults: { classes: 'widget notification' },
      init: function (settings) {
        var self = this;
        self._super(settings);
        self.maxwidth = settings.maxwidth;
        if (settings.text) {
          self.text(settings.text);
        }
        if (settings.icon) {
          self.icon = settings.icon;
        }
        if (settings.color) {
          self.color = settings.color;
        }
        if (settings.type) {
          self.classes.add('notification-' + settings.type);
        }
        if (settings.timeout && (settings.timeout < 0 || settings.timeout > 0) && !settings.closebutton) {
          self.closebutton = false;
        } else {
          self.classes.add('has-close');
          self.closebutton = true;
        }
        if (settings.progressbar) {
          self.progressbar = new progress();
        }
        self.on('click', function (e) {
          if (e.target.classname.indexof(self.classprefix + 'close') !== -1) {
            self.close();
          }
        });
      },
      renderhtml: function () {
        var self = this;
        var prefix = self.classprefix;
        var icon = '', closebutton = '', progressbar = '', notificationstyle = '';
        if (self.icon) {
          icon = '<i class="' + prefix + 'ico' + ' ' + prefix + 'i-' + self.icon + '"></i>';
        }
        notificationstyle = ' style="max-width: ' + self.maxwidth + 'px;' + (self.color ? 'background-color: ' + self.color + ';"' : '"');
        if (self.closebutton) {
          closebutton = '<button type="button" class="' + prefix + 'close" aria-hidden="true">\xd7</button>';
        }
        if (self.progressbar) {
          progressbar = self.progressbar.renderhtml();
        }
        return '<div id="' + self._id + '" class="' + self.classes + '"' + notificationstyle + ' role="presentation">' + icon + '<div class="' + prefix + 'notification-inner">' + self.state.get('text') + '</div>' + progressbar + closebutton + '<div style="clip: rect(1px, 1px, 1px, 1px);height: 1px;overflow: hidden;position: absolute;width: 1px;"' + ' aria-live="assertive" aria-relevant="additions" aria-atomic="true"></div>' + '</div>';
      },
      postrender: function () {
        var self = this;
        global$3.settimeout(function () {
          self.$el.addclass(self.classprefix + 'in');
          updateliveregion(self, self.state.get('text'));
        }, 100);
        return self._super();
      },
      bindstates: function () {
        var self = this;
        self.state.on('change:text', function (e) {
          self.getel().firstchild.innerhtml = e.value;
          updateliveregion(self, e.value);
        });
        if (self.progressbar) {
          self.progressbar.bindstates();
          self.progressbar.state.on('change:value', function (e) {
            updateliveregion(self, self.state.get('text'));
          });
        }
        return self._super();
      },
      close: function () {
        var self = this;
        if (!self.fire('close').isdefaultprevented()) {
          self.remove();
        }
        return self;
      },
      repaint: function () {
        var self = this;
        var style, rect;
        style = self.getel().style;
        rect = self._layoutrect;
        style.left = rect.x + 'px';
        style.top = rect.y + 'px';
        style.zindex = 65535 - 1;
      }
    });

    function notificationmanagerimpl (editor) {
      var geteditorcontainer = function (editor) {
        return editor.inline ? editor.getelement() : editor.getcontentareacontainer();
      };
      var getcontainerwidth = function () {
        var container = geteditorcontainer(editor);
        return funcs.getsize(container).width;
      };
      var prepositionnotifications = function (notifications) {
        each(notifications, function (notification) {
          notification.moveto(0, 0);
        });
      };
      var positionnotifications = function (notifications) {
        if (notifications.length > 0) {
          var firstitem = notifications.slice(0, 1)[0];
          var container = geteditorcontainer(editor);
          firstitem.moverel(container, 'tc-tc');
          each(notifications, function (notification, index) {
            if (index > 0) {
              notification.moverel(notifications[index - 1].getel(), 'bc-tc');
            }
          });
        }
      };
      var reposition = function (notifications) {
        prepositionnotifications(notifications);
        positionnotifications(notifications);
      };
      var open = function (args, closecallback) {
        var extendedargs = global$4.extend(args, { maxwidth: getcontainerwidth() });
        var notif = new notification(extendedargs);
        notif.args = extendedargs;
        if (extendedargs.timeout > 0) {
          notif.timer = settimeout(function () {
            notif.close();
            closecallback();
          }, extendedargs.timeout);
        }
        notif.on('close', function () {
          closecallback();
        });
        notif.renderto();
        return notif;
      };
      var close = function (notification) {
        notification.close();
      };
      var getargs = function (notification) {
        return notification.args;
      };
      return {
        open: open,
        close: close,
        reposition: reposition,
        getargs: getargs
      };
    }

    function getdocumentsize(doc) {
      var documentelement, body, scrollwidth, clientwidth;
      var offsetwidth, scrollheight, clientheight, offsetheight;
      var max = math.max;
      documentelement = doc.documentelement;
      body = doc.body;
      scrollwidth = max(documentelement.scrollwidth, body.scrollwidth);
      clientwidth = max(documentelement.clientwidth, body.clientwidth);
      offsetwidth = max(documentelement.offsetwidth, body.offsetwidth);
      scrollheight = max(documentelement.scrollheight, body.scrollheight);
      clientheight = max(documentelement.clientheight, body.clientheight);
      offsetheight = max(documentelement.offsetheight, body.offsetheight);
      return {
        width: scrollwidth < offsetwidth ? clientwidth : scrollwidth,
        height: scrollheight < offsetheight ? clientheight : scrollheight
      };
    }
    function updatewithtouchdata(e) {
      var keys, i;
      if (e.changedtouches) {
        keys = 'screenx screeny pagex pagey clientx clienty'.split(' ');
        for (i = 0; i < keys.length; i++) {
          e[keys[i]] = e.changedtouches[0][keys[i]];
        }
      }
    }
    function draghelper (id, settings) {
      var $eventoverlay;
      var doc = settings.document || domglobals.document;
      var downbutton;
      var start, stop, drag, startx, starty;
      settings = settings || {};
      var handleelement = doc.getelementbyid(settings.handle || id);
      start = function (e) {
        var docsize = getdocumentsize(doc);
        var handleelm, cursor;
        updatewithtouchdata(e);
        e.preventdefault();
        downbutton = e.button;
        handleelm = handleelement;
        startx = e.screenx;
        starty = e.screeny;
        if (domglobals.window.getcomputedstyle) {
          cursor = domglobals.window.getcomputedstyle(handleelm, null).getpropertyvalue('cursor');
        } else {
          cursor = handleelm.runtimestyle.cursor;
        }
        $eventoverlay = global$7('<div></div>').css({
          position: 'absolute',
          top: 0,
          left: 0,
          width: docsize.width,
          height: docsize.height,
          zindex: 2147483647,
          opacity: 0.0001,
          cursor: cursor
        }).appendto(doc.body);
        global$7(doc).on('mousemove touchmove', drag).on('mouseup touchend', stop);
        settings.start(e);
      };
      drag = function (e) {
        updatewithtouchdata(e);
        if (e.button !== downbutton) {
          return stop(e);
        }
        e.deltax = e.screenx - startx;
        e.deltay = e.screeny - starty;
        e.preventdefault();
        settings.drag(e);
      };
      stop = function (e) {
        updatewithtouchdata(e);
        global$7(doc).off('mousemove touchmove', drag).off('mouseup touchend', stop);
        $eventoverlay.remove();
        if (settings.stop) {
          settings.stop(e);
        }
      };
      this.destroy = function () {
        global$7(handleelement).off();
      };
      global$7(handleelement).on('mousedown touchstart', start);
    }

    var global$b = tinymce.util.tools.resolve('tinymce.ui.factory');

    var hastabstopdata = function (elm) {
      return elm.getattribute('data-mce-tabstop') ? true : false;
    };
    function keyboardnavigation (settings) {
      var root = settings.root;
      var focusedelement, focusedcontrol;
      function iselement(node) {
        return node && node.nodetype === 1;
      }
      try {
        focusedelement = domglobals.document.activeelement;
      } catch (ex) {
        focusedelement = domglobals.document.body;
      }
      focusedcontrol = root.getparentctrl(focusedelement);
      function getrole(elm) {
        elm = elm || focusedelement;
        if (iselement(elm)) {
          return elm.getattribute('role');
        }
        return null;
      }
      function getparentrole(elm) {
        var role, parent = elm || focusedelement;
        while (parent = parent.parentnode) {
          if (role = getrole(parent)) {
            return role;
          }
        }
      }
      function getariaprop(name) {
        var elm = focusedelement;
        if (iselement(elm)) {
          return elm.getattribute('aria-' + name);
        }
      }
      function istextinputelement(elm) {
        var tagname = elm.tagname.touppercase();
        return tagname === 'input' || tagname === 'textarea' || tagname === 'select';
      }
      function canfocus(elm) {
        if (istextinputelement(elm) && !elm.hidden) {
          return true;
        }
        if (hastabstopdata(elm)) {
          return true;
        }
        if (/^(button|menuitem|checkbox|tab|menuitemcheckbox|option|gridcell|slider)$/.test(getrole(elm))) {
          return true;
        }
        return false;
      }
      function getfocuselements(elm) {
        var elements = [];
        function collect(elm) {
          if (elm.nodetype !== 1 || elm.style.display === 'none' || elm.disabled) {
            return;
          }
          if (canfocus(elm)) {
            elements.push(elm);
          }
          for (var i = 0; i < elm.childnodes.length; i++) {
            collect(elm.childnodes[i]);
          }
        }
        collect(elm || root.getel());
        return elements;
      }
      function getnavigationroot(targetcontrol) {
        var navigationroot, controls;
        targetcontrol = targetcontrol || focusedcontrol;
        controls = targetcontrol.parents().toarray();
        controls.unshift(targetcontrol);
        for (var i = 0; i < controls.length; i++) {
          navigationroot = controls[i];
          if (navigationroot.settings.ariaroot) {
            break;
          }
        }
        return navigationroot;
      }
      function focusfirst(targetcontrol) {
        var navigationroot = getnavigationroot(targetcontrol);
        var focuselements = getfocuselements(navigationroot.getel());
        if (navigationroot.settings.ariaremember && 'lastariaindex' in navigationroot) {
          movefocustoindex(navigationroot.lastariaindex, focuselements);
        } else {
          movefocustoindex(0, focuselements);
        }
      }
      function movefocustoindex(idx, elements) {
        if (idx < 0) {
          idx = elements.length - 1;
        } else if (idx >= elements.length) {
          idx = 0;
        }
        if (elements[idx]) {
          elements[idx].focus();
        }
        return idx;
      }
      function movefocus(dir, elements) {
        var idx = -1;
        var navigationroot = getnavigationroot();
        elements = elements || getfocuselements(navigationroot.getel());
        for (var i = 0; i < elements.length; i++) {
          if (elements[i] === focusedelement) {
            idx = i;
          }
        }
        idx += dir;
        navigationroot.lastariaindex = movefocustoindex(idx, elements);
      }
      function left() {
        var parentrole = getparentrole();
        if (parentrole === 'tablist') {
          movefocus(-1, getfocuselements(focusedelement.parentnode));
        } else if (focusedcontrol.parent().submenu) {
          cancel();
        } else {
          movefocus(-1);
        }
      }
      function right() {
        var role = getrole(), parentrole = getparentrole();
        if (parentrole === 'tablist') {
          movefocus(1, getfocuselements(focusedelement.parentnode));
        } else if (role === 'menuitem' && parentrole === 'menu' && getariaprop('haspopup')) {
          enter();
        } else {
          movefocus(1);
        }
      }
      function up() {
        movefocus(-1);
      }
      function down() {
        var role = getrole(), parentrole = getparentrole();
        if (role === 'menuitem' && parentrole === 'menubar') {
          enter();
        } else if (role === 'button' && getariaprop('haspopup')) {
          enter({ key: 'down' });
        } else {
          movefocus(1);
        }
      }
      function tab(e) {
        var parentrole = getparentrole();
        if (parentrole === 'tablist') {
          var elm = getfocuselements(focusedcontrol.getel('body'))[0];
          if (elm) {
            elm.focus();
          }
        } else {
          movefocus(e.shiftkey ? -1 : 1);
        }
      }
      function cancel() {
        focusedcontrol.fire('cancel');
      }
      function enter(aria) {
        aria = aria || {};
        focusedcontrol.fire('click', {
          target: focusedelement,
          aria: aria
        });
      }
      root.on('keydown', function (e) {
        function handlenontaborescevent(e, handler) {
          if (istextinputelement(focusedelement) || hastabstopdata(focusedelement)) {
            return;
          }
          if (getrole(focusedelement) === 'slider') {
            return;
          }
          if (handler(e) !== false) {
            e.preventdefault();
          }
        }
        if (e.isdefaultprevented()) {
          return;
        }
        switch (e.keycode) {
        case 37:
          handlenontaborescevent(e, left);
          break;
        case 39:
          handlenontaborescevent(e, right);
          break;
        case 38:
          handlenontaborescevent(e, up);
          break;
        case 40:
          handlenontaborescevent(e, down);
          break;
        case 27:
          cancel();
          break;
        case 14:
        case 13:
        case 32:
          handlenontaborescevent(e, enter);
          break;
        case 9:
          tab(e);
          e.preventdefault();
          break;
        }
      });
      root.on('focusin', function (e) {
        focusedelement = e.target;
        focusedcontrol = e.control;
      });
      return { focusfirst: focusfirst };
    }

    var selectorcache = {};
    var container = control$1.extend({
      init: function (settings) {
        var self = this;
        self._super(settings);
        settings = self.settings;
        if (settings.fixed) {
          self.state.set('fixed', true);
        }
        self._items = new collection$2();
        if (self.isrtl()) {
          self.classes.add('rtl');
        }
        self.bodyclasses = new classlist(function () {
          if (self.state.get('rendered')) {
            self.getel('body').classname = this.tostring();
          }
        });
        self.bodyclasses.prefix = self.classprefix;
        self.classes.add('container');
        self.bodyclasses.add('container-body');
        if (settings.containercls) {
          self.classes.add(settings.containercls);
        }
        self._layout = global$b.create((settings.layout || '') + 'layout');
        if (self.settings.items) {
          self.add(self.settings.items);
        } else {
          self.add(self.render());
        }
        self._hasbody = true;
      },
      items: function () {
        return this._items;
      },
      find: function (selector) {
        selector = selectorcache[selector] = selectorcache[selector] || new selector(selector);
        return selector.find(this);
      },
      add: function (items) {
        var self = this;
        self.items().add(self.create(items)).parent(self);
        return self;
      },
      focus: function (keyboard) {
        var self = this;
        var focusctrl, keyboardnav, items;
        if (keyboard) {
          keyboardnav = self.keyboardnav || self.parents().eq(-1)[0].keyboardnav;
          if (keyboardnav) {
            keyboardnav.focusfirst(self);
            return;
          }
        }
        items = self.find('*');
        if (self.statusbar) {
          items.add(self.statusbar.items());
        }
        items.each(function (ctrl) {
          if (ctrl.settings.autofocus) {
            focusctrl = null;
            return false;
          }
          if (ctrl.canfocus) {
            focusctrl = focusctrl || ctrl;
          }
        });
        if (focusctrl) {
          focusctrl.focus();
        }
        return self;
      },
      replace: function (olditem, newitem) {
        var ctrlelm;
        var items = this.items();
        var i = items.length;
        while (i--) {
          if (items[i] === olditem) {
            items[i] = newitem;
            break;
          }
        }
        if (i >= 0) {
          ctrlelm = newitem.getel();
          if (ctrlelm) {
            ctrlelm.parentnode.removechild(ctrlelm);
          }
          ctrlelm = olditem.getel();
          if (ctrlelm) {
            ctrlelm.parentnode.removechild(ctrlelm);
          }
        }
        newitem.parent(this);
      },
      create: function (items) {
        var self = this;
        var settings;
        var ctrlitems = [];
        if (!global$4.isarray(items)) {
          items = [items];
        }
        global$4.each(items, function (item) {
          if (item) {
            if (!(item instanceof control$1)) {
              if (typeof item === 'string') {
                item = { type: item };
              }
              settings = global$4.extend({}, self.settings.defaults, item);
              item.type = settings.type = settings.type || item.type || self.settings.defaulttype || (settings.defaults ? settings.defaults.type : null);
              item = global$b.create(settings);
            }
            ctrlitems.push(item);
          }
        });
        return ctrlitems;
      },
      rendernew: function () {
        var self = this;
        self.items().each(function (ctrl, index) {
          var containerelm;
          ctrl.parent(self);
          if (!ctrl.state.get('rendered')) {
            containerelm = self.getel('body');
            if (containerelm.haschildnodes() && index <= containerelm.childnodes.length - 1) {
              global$7(containerelm.childnodes[index]).before(ctrl.renderhtml());
            } else {
              global$7(containerelm).append(ctrl.renderhtml());
            }
            ctrl.postrender();
            reflowqueue.add(ctrl);
          }
        });
        self._layout.applyclasses(self.items().filter(':visible'));
        self._lastrect = null;
        return self;
      },
      append: function (items) {
        return this.add(items).rendernew();
      },
      prepend: function (items) {
        var self = this;
        self.items().set(self.create(items).concat(self.items().toarray()));
        return self.rendernew();
      },
      insert: function (items, index, before) {
        var self = this;
        var curitems, beforeitems, afteritems;
        items = self.create(items);
        curitems = self.items();
        if (!before && index < curitems.length - 1) {
          index += 1;
        }
        if (index >= 0 && index < curitems.length) {
          beforeitems = curitems.slice(0, index).toarray();
          afteritems = curitems.slice(index).toarray();
          curitems.set(beforeitems.concat(items, afteritems));
        }
        return self.rendernew();
      },
      fromjson: function (data) {
        var self = this;
        for (var name in data) {
          self.find('#' + name).value(data[name]);
        }
        return self;
      },
      tojson: function () {
        var self = this, data = {};
        self.find('*').each(function (ctrl) {
          var name = ctrl.name(), value = ctrl.value();
          if (name && typeof value !== 'undefined') {
            data[name] = value;
          }
        });
        return data;
      },
      renderhtml: function () {
        var self = this, layout = self._layout, role = this.settings.role;
        self.prerender();
        layout.prerender(self);
        return '<div id="' + self._id + '" class="' + self.classes + '"' + (role ? ' role="' + this.settings.role + '"' : '') + '>' + '<div id="' + self._id + '-body" class="' + self.bodyclasses + '">' + (self.settings.html || '') + layout.renderhtml(self) + '</div>' + '</div>';
      },
      postrender: function () {
        var self = this;
        var box;
        self.items().exec('postrender');
        self._super();
        self._layout.postrender(self);
        self.state.set('rendered', true);
        if (self.settings.style) {
          self.$el.css(self.settings.style);
        }
        if (self.settings.border) {
          box = self.borderbox;
          self.$el.css({
            'border-top-width': box.top,
            'border-right-width': box.right,
            'border-bottom-width': box.bottom,
            'border-left-width': box.left
          });
        }
        if (!self.parent()) {
          self.keyboardnav = keyboardnavigation({ root: self });
        }
        return self;
      },
      initlayoutrect: function () {
        var self = this, layoutrect = self._super();
        self._layout.recalc(self);
        return layoutrect;
      },
      recalc: function () {
        var self = this;
        var rect = self._layoutrect;
        var lastrect = self._lastrect;
        if (!lastrect || lastrect.w !== rect.w || lastrect.h !== rect.h) {
          self._layout.recalc(self);
          rect = self.layoutrect();
          self._lastrect = {
            x: rect.x,
            y: rect.y,
            w: rect.w,
            h: rect.h
          };
          return true;
        }
      },
      reflow: function () {
        var i;
        reflowqueue.remove(this);
        if (this.visible()) {
          control$1.repaintcontrols = [];
          control$1.repaintcontrols.map = {};
          this.recalc();
          i = control$1.repaintcontrols.length;
          while (i--) {
            control$1.repaintcontrols[i].repaint();
          }
          if (this.settings.layout !== 'flow' && this.settings.layout !== 'stack') {
            this.repaint();
          }
          control$1.repaintcontrols = [];
        }
        return this;
      }
    });

    var scrollable = {
      init: function () {
        var self = this;
        self.on('repaint', self.renderscroll);
      },
      renderscroll: function () {
        var self = this, margin = 2;
        function repaintscroll() {
          var hasscrollh, hasscrollv, bodyelm;
          function repaintaxis(axisname, posname, sizename, contentsizename, hasscroll, ax) {
            var containerelm, scrollbarelm, scrollthumbelm;
            var containersize, scrollsize, ratio, rect;
            var posnamelower, sizenamelower;
            scrollbarelm = self.getel('scroll' + axisname);
            if (scrollbarelm) {
              posnamelower = posname.tolowercase();
              sizenamelower = sizename.tolowercase();
              global$7(self.getel('absend')).css(posnamelower, self.layoutrect()[contentsizename] - 1);
              if (!hasscroll) {
                global$7(scrollbarelm).css('display', 'none');
                return;
              }
              global$7(scrollbarelm).css('display', 'block');
              containerelm = self.getel('body');
              scrollthumbelm = self.getel('scroll' + axisname + 't');
              containersize = containerelm['client' + sizename] - margin * 2;
              containersize -= hasscrollh && hasscrollv ? scrollbarelm['client' + ax] : 0;
              scrollsize = containerelm['scroll' + sizename];
              ratio = containersize / scrollsize;
              rect = {};
              rect[posnamelower] = containerelm['offset' + posname] + margin;
              rect[sizenamelower] = containersize;
              global$7(scrollbarelm).css(rect);
              rect = {};
              rect[posnamelower] = containerelm['scroll' + posname] * ratio;
              rect[sizenamelower] = containersize * ratio;
              global$7(scrollthumbelm).css(rect);
            }
          }
          bodyelm = self.getel('body');
          hasscrollh = bodyelm.scrollwidth > bodyelm.clientwidth;
          hasscrollv = bodyelm.scrollheight > bodyelm.clientheight;
          repaintaxis('h', 'left', 'width', 'contentw', hasscrollh, 'height');
          repaintaxis('v', 'top', 'height', 'contenth', hasscrollv, 'width');
        }
        function addscroll() {
          function addscrollaxis(axisname, posname, sizename, deltaposname, ax) {
            var scrollstart;
            var axisid = self._id + '-scroll' + axisname, prefix = self.classprefix;
            global$7(self.getel()).append('<div id="' + axisid + '" class="' + prefix + 'scrollbar ' + prefix + 'scrollbar-' + axisname + '">' + '<div id="' + axisid + 't" class="' + prefix + 'scrollbar-thumb"></div>' + '</div>');
            self.draghelper = new draghelper(axisid + 't', {
              start: function () {
                scrollstart = self.getel('body')['scroll' + posname];
                global$7('#' + axisid).addclass(prefix + 'active');
              },
              drag: function (e) {
                var ratio, hasscrollh, hasscrollv, containersize;
                var layoutrect = self.layoutrect();
                hasscrollh = layoutrect.contentw > layoutrect.innerw;
                hasscrollv = layoutrect.contenth > layoutrect.innerh;
                containersize = self.getel('body')['client' + sizename] - margin * 2;
                containersize -= hasscrollh && hasscrollv ? self.getel('scroll' + axisname)['client' + ax] : 0;
                ratio = containersize / self.getel('body')['scroll' + sizename];
                self.getel('body')['scroll' + posname] = scrollstart + e['delta' + deltaposname] / ratio;
              },
              stop: function () {
                global$7('#' + axisid).removeclass(prefix + 'active');
              }
            });
          }
          self.classes.add('scroll');
          addscrollaxis('v', 'top', 'height', 'y', 'width');
          addscrollaxis('h', 'left', 'width', 'x', 'height');
        }
        if (self.settings.autoscroll) {
          if (!self._hasscroll) {
            self._hasscroll = true;
            addscroll();
            self.on('wheel', function (e) {
              var bodyel = self.getel('body');
              bodyel.scrollleft += (e.deltax || 0) * 10;
              bodyel.scrolltop += e.deltay * 10;
              repaintscroll();
            });
            global$7(self.getel('body')).on('scroll', repaintscroll);
          }
          repaintscroll();
        }
      }
    };

    var panel = container.extend({
      defaults: {
        layout: 'fit',
        containercls: 'panel'
      },
      mixins: [scrollable],
      renderhtml: function () {
        var self = this;
        var layout = self._layout;
        var innerhtml = self.settings.html;
        self.prerender();
        layout.prerender(self);
        if (typeof innerhtml === 'undefined') {
          innerhtml = '<div id="' + self._id + '-body" class="' + self.bodyclasses + '">' + layout.renderhtml(self) + '</div>';
        } else {
          if (typeof innerhtml === 'function') {
            innerhtml = innerhtml.call(self);
          }
          self._hasbody = false;
        }
        return '<div id="' + self._id + '" class="' + self.classes + '" hidefocus="1" tabindex="-1" role="group">' + (self._prebodyhtml || '') + innerhtml + '</div>';
      }
    });

    var resizable = {
      resizetocontent: function () {
        this._layoutrect.autoresize = true;
        this._lastrect = null;
        this.reflow();
      },
      resizeto: function (w, h) {
        if (w <= 1 || h <= 1) {
          var rect = funcs.getwindowsize();
          w = w <= 1 ? w * rect.w : w;
          h = h <= 1 ? h * rect.h : h;
        }
        this._layoutrect.autoresize = false;
        return this.layoutrect({
          minw: w,
          minh: h,
          w: w,
          h: h
        }).reflow();
      },
      resizeby: function (dw, dh) {
        var self = this, rect = self.layoutrect();
        return self.resizeto(rect.w + dw, rect.h + dh);
      }
    };

    var documentclickhandler, documentscrollhandler, windowresizehandler;
    var visiblepanels = [];
    var zorder = [];
    var hasmodal;
    function ischildof(ctrl, parent) {
      while (ctrl) {
        if (ctrl === parent) {
          return true;
        }
        ctrl = ctrl.parent();
      }
    }
    function skiporhidepanels(e) {
      var i = visiblepanels.length;
      while (i--) {
        var panel = visiblepanels[i], clickctrl = panel.getparentctrl(e.target);
        if (panel.settings.autohide) {
          if (clickctrl) {
            if (ischildof(clickctrl, panel) || panel.parent() === clickctrl) {
              continue;
            }
          }
          e = panel.fire('autohide', { target: e.target });
          if (!e.isdefaultprevented()) {
            panel.hide();
          }
        }
      }
    }
    function binddocumentclickhandler() {
      if (!documentclickhandler) {
        documentclickhandler = function (e) {
          if (e.button === 2) {
            return;
          }
          skiporhidepanels(e);
        };
        global$7(domglobals.document).on('click touchstart', documentclickhandler);
      }
    }
    function binddocumentscrollhandler() {
      if (!documentscrollhandler) {
        documentscrollhandler = function () {
          var i;
          i = visiblepanels.length;
          while (i--) {
            repositionpanel$1(visiblepanels[i]);
          }
        };
        global$7(domglobals.window).on('scroll', documentscrollhandler);
      }
    }
    function bindwindowresizehandler() {
      if (!windowresizehandler) {
        var docelm_1 = domglobals.document.documentelement;
        var clientwidth_1 = docelm_1.clientwidth, clientheight_1 = docelm_1.clientheight;
        windowresizehandler = function () {
          if (!domglobals.document.all || clientwidth_1 !== docelm_1.clientwidth || clientheight_1 !== docelm_1.clientheight) {
            clientwidth_1 = docelm_1.clientwidth;
            clientheight_1 = docelm_1.clientheight;
            floatpanel.hideall();
          }
        };
        global$7(domglobals.window).on('resize', windowresizehandler);
      }
    }
    function repositionpanel$1(panel) {
      var scrolly = funcs.getviewport().y;
      function togglefixedchildpanels(fixed, deltay) {
        var parent;
        for (var i = 0; i < visiblepanels.length; i++) {
          if (visiblepanels[i] !== panel) {
            parent = visiblepanels[i].parent();
            while (parent && (parent = parent.parent())) {
              if (parent === panel) {
                visiblepanels[i].fixed(fixed).moveby(0, deltay).repaint();
              }
            }
          }
        }
      }
      if (panel.settings.autofix) {
        if (!panel.state.get('fixed')) {
          panel._autofixy = panel.layoutrect().y;
          if (panel._autofixy < scrolly) {
            panel.fixed(true).layoutrect({ y: 0 }).repaint();
            togglefixedchildpanels(true, scrolly - panel._autofixy);
          }
        } else {
          if (panel._autofixy > scrolly) {
            panel.fixed(false).layoutrect({ y: panel._autofixy }).repaint();
            togglefixedchildpanels(false, panel._autofixy - scrolly);
          }
        }
      }
    }
    function addremove(add, ctrl) {
      var i, zindex = floatpanel.zindex || 65535, topmodal;
      if (add) {
        zorder.push(ctrl);
      } else {
        i = zorder.length;
        while (i--) {
          if (zorder[i] === ctrl) {
            zorder.splice(i, 1);
          }
        }
      }
      if (zorder.length) {
        for (i = 0; i < zorder.length; i++) {
          if (zorder[i].modal) {
            zindex++;
            topmodal = zorder[i];
          }
          zorder[i].getel().style.zindex = zindex;
          zorder[i].zindex = zindex;
          zindex++;
        }
      }
      var modalblockel = global$7('#' + ctrl.classprefix + 'modal-block', ctrl.getcontainerelm())[0];
      if (topmodal) {
        global$7(modalblockel).css('z-index', topmodal.zindex - 1);
      } else if (modalblockel) {
        modalblockel.parentnode.removechild(modalblockel);
        hasmodal = false;
      }
      floatpanel.currentzindex = zindex;
    }
    var floatpanel = panel.extend({
      mixins: [
        movable,
        resizable
      ],
      init: function (settings) {
        var self = this;
        self._super(settings);
        self._eventsroot = self;
        self.classes.add('floatpanel');
        if (settings.autohide) {
          binddocumentclickhandler();
          bindwindowresizehandler();
          visiblepanels.push(self);
        }
        if (settings.autofix) {
          binddocumentscrollhandler();
          self.on('move', function () {
            repositionpanel$1(this);
          });
        }
        self.on('postrender show', function (e) {
          if (e.control === self) {
            var $modalblockel_1;
            var prefix_1 = self.classprefix;
            if (self.modal && !hasmodal) {
              $modalblockel_1 = global$7('#' + prefix_1 + 'modal-block', self.getcontainerelm());
              if (!$modalblockel_1[0]) {
                $modalblockel_1 = global$7('<div id="' + prefix_1 + 'modal-block" class="' + prefix_1 + 'reset ' + prefix_1 + 'fade"></div>').appendto(self.getcontainerelm());
              }
              global$3.settimeout(function () {
                $modalblockel_1.addclass(prefix_1 + 'in');
                global$7(self.getel()).addclass(prefix_1 + 'in');
              });
              hasmodal = true;
            }
            addremove(true, self);
          }
        });
        self.on('show', function () {
          self.parents().each(function (ctrl) {
            if (ctrl.state.get('fixed')) {
              self.fixed(true);
              return false;
            }
          });
        });
        if (settings.popover) {
          self._prebodyhtml = '<div class="' + self.classprefix + 'arrow"></div>';
          self.classes.add('popover').add('bottom').add(self.isrtl() ? 'end' : 'start');
        }
        self.aria('label', settings.arialabel);
        self.aria('labelledby', self._id);
        self.aria('describedby', self.describedby || self._id + '-none');
      },
      fixed: function (state) {
        var self = this;
        if (self.state.get('fixed') !== state) {
          if (self.state.get('rendered')) {
            var viewport = funcs.getviewport();
            if (state) {
              self.layoutrect().y -= viewport.y;
            } else {
              self.layoutrect().y += viewport.y;
            }
          }
          self.classes.toggle('fixed', state);
          self.state.set('fixed', state);
        }
        return self;
      },
      show: function () {
        var self = this;
        var i;
        var state = self._super();
        i = visiblepanels.length;
        while (i--) {
          if (visiblepanels[i] === self) {
            break;
          }
        }
        if (i === -1) {
          visiblepanels.push(self);
        }
        return state;
      },
      hide: function () {
        removevisiblepanel(this);
        addremove(false, this);
        return this._super();
      },
      hideall: function () {
        floatpanel.hideall();
      },
      close: function () {
        var self = this;
        if (!self.fire('close').isdefaultprevented()) {
          self.remove();
          addremove(false, self);
        }
        return self;
      },
      remove: function () {
        removevisiblepanel(this);
        this._super();
      },
      postrender: function () {
        var self = this;
        if (self.settings.bodyrole) {
          this.getel('body').setattribute('role', self.settings.bodyrole);
        }
        return self._super();
      }
    });
    floatpanel.hideall = function () {
      var i = visiblepanels.length;
      while (i--) {
        var panel = visiblepanels[i];
        if (panel && panel.settings.autohide) {
          panel.hide();
          visiblepanels.splice(i, 1);
        }
      }
    };
    function removevisiblepanel(panel) {
      var i;
      i = visiblepanels.length;
      while (i--) {
        if (visiblepanels[i] === panel) {
          visiblepanels.splice(i, 1);
        }
      }
      i = zorder.length;
      while (i--) {
        if (zorder[i] === panel) {
          zorder.splice(i, 1);
        }
      }
    }

    var windows = [];
    var oldmetavalue = '';
    function togglefullscreenstate(state) {
      var noscalemetavalue = 'width=device-width,initial-scale=1.0,user-scalable=0,minimum-scale=1.0,maximum-scale=1.0';
      var viewport = global$7('meta[name=viewport]')[0], contentvalue;
      if (global$1.overrideviewport === false) {
        return;
      }
      if (!viewport) {
        viewport = domglobals.document.createelement('meta');
        viewport.setattribute('name', 'viewport');
        domglobals.document.getelementsbytagname('head')[0].appendchild(viewport);
      }
      contentvalue = viewport.getattribute('content');
      if (contentvalue && typeof oldmetavalue !== 'undefined') {
        oldmetavalue = contentvalue;
      }
      viewport.setattribute('content', state ? noscalemetavalue : oldmetavalue);
    }
    function togglebodyfullscreenclasses(classprefix, state) {
      if (checkfullscreenwindows() && state === false) {
        global$7([
          domglobals.document.documentelement,
          domglobals.document.body
        ]).removeclass(classprefix + 'fullscreen');
      }
    }
    function checkfullscreenwindows() {
      for (var i = 0; i < windows.length; i++) {
        if (windows[i]._fullscreen) {
          return true;
        }
      }
      return false;
    }
    function handlewindowresize() {
      if (!global$1.desktop) {
        var lastsize_1 = {
          w: domglobals.window.innerwidth,
          h: domglobals.window.innerheight
        };
        global$3.setinterval(function () {
          var w = domglobals.window.innerwidth, h = domglobals.window.innerheight;
          if (lastsize_1.w !== w || lastsize_1.h !== h) {
            lastsize_1 = {
              w: w,
              h: h
            };
            global$7(domglobals.window).trigger('resize');
          }
        }, 100);
      }
      function reposition() {
        var i;
        var rect = funcs.getwindowsize();
        var layoutrect;
        for (i = 0; i < windows.length; i++) {
          layoutrect = windows[i].layoutrect();
          windows[i].moveto(windows[i].settings.x || math.max(0, rect.w / 2 - layoutrect.w / 2), windows[i].settings.y || math.max(0, rect.h / 2 - layoutrect.h / 2));
        }
      }
      global$7(domglobals.window).on('resize', reposition);
    }
    var window = floatpanel.extend({
      modal: true,
      defaults: {
        border: 1,
        layout: 'flex',
        containercls: 'panel',
        role: 'dialog',
        callbacks: {
          submit: function () {
            this.fire('submit', { data: this.tojson() });
          },
          close: function () {
            this.close();
          }
        }
      },
      init: function (settings) {
        var self = this;
        self._super(settings);
        if (self.isrtl()) {
          self.classes.add('rtl');
        }
        self.classes.add('window');
        self.bodyclasses.add('window-body');
        self.state.set('fixed', true);
        if (settings.buttons) {
          self.statusbar = new panel({
            layout: 'flex',
            border: '1 0 0 0',
            spacing: 3,
            padding: 10,
            align: 'center',
            pack: self.isrtl() ? 'start' : 'end',
            defaults: { type: 'button' },
            items: settings.buttons
          });
          self.statusbar.classes.add('foot');
          self.statusbar.parent(self);
        }
        self.on('click', function (e) {
          var closeclass = self.classprefix + 'close';
          if (funcs.hasclass(e.target, closeclass) || funcs.hasclass(e.target.parentnode, closeclass)) {
            self.close();
          }
        });
        self.on('cancel', function () {
          self.close();
        });
        self.on('move', function (e) {
          if (e.control === self) {
            floatpanel.hideall();
          }
        });
        self.aria('describedby', self.describedby || self._id + '-none');
        self.aria('label', settings.title);
        self._fullscreen = false;
      },
      recalc: function () {
        var self = this;
        var statusbar = self.statusbar;
        var layoutrect, width, x, needsrecalc;
        if (self._fullscreen) {
          self.layoutrect(funcs.getwindowsize());
          self.layoutrect().contenth = self.layoutrect().innerh;
        }
        self._super();
        layoutrect = self.layoutrect();
        if (self.settings.title && !self._fullscreen) {
          width = layoutrect.headerw;
          if (width > layoutrect.w) {
            x = layoutrect.x - math.max(0, width / 2);
            self.layoutrect({
              w: width,
              x: x
            });
            needsrecalc = true;
          }
        }
        if (statusbar) {
          statusbar.layoutrect({ w: self.layoutrect().innerw }).recalc();
          width = statusbar.layoutrect().minw + layoutrect.deltaw;
          if (width > layoutrect.w) {
            x = layoutrect.x - math.max(0, width - layoutrect.w);
            self.layoutrect({
              w: width,
              x: x
            });
            needsrecalc = true;
          }
        }
        if (needsrecalc) {
          self.recalc();
        }
      },
      initlayoutrect: function () {
        var self = this;
        var layoutrect = self._super();
        var deltah = 0, headel;
        if (self.settings.title && !self._fullscreen) {
          headel = self.getel('head');
          var size = funcs.getsize(headel);
          layoutrect.headerw = size.width;
          layoutrect.headerh = size.height;
          deltah += layoutrect.headerh;
        }
        if (self.statusbar) {
          deltah += self.statusbar.layoutrect().h;
        }
        layoutrect.deltah += deltah;
        layoutrect.minh += deltah;
        layoutrect.h += deltah;
        var rect = funcs.getwindowsize();
        layoutrect.x = self.settings.x || math.max(0, rect.w / 2 - layoutrect.w / 2);
        layoutrect.y = self.settings.y || math.max(0, rect.h / 2 - layoutrect.h / 2);
        return layoutrect;
      },
      renderhtml: function () {
        var self = this, layout = self._layout, id = self._id, prefix = self.classprefix;
        var settings = self.settings;
        var headerhtml = '', footerhtml = '', html = settings.html;
        self.prerender();
        layout.prerender(self);
        if (settings.title) {
          headerhtml = '<div id="' + id + '-head" class="' + prefix + 'window-head">' + '<div id="' + id + '-title" class="' + prefix + 'title">' + self.encode(settings.title) + '</div>' + '<div id="' + id + '-dragh" class="' + prefix + 'dragh"></div>' + '<button type="button" class="' + prefix + 'close" aria-hidden="true">' + '<i class="mce-ico mce-i-remove"></i>' + '</button>' + '</div>';
        }
        if (settings.url) {
          html = '<iframe src="' + settings.url + '" tabindex="-1"></iframe>';
        }
        if (typeof html === 'undefined') {
          html = layout.renderhtml(self);
        }
        if (self.statusbar) {
          footerhtml = self.statusbar.renderhtml();
        }
        return '<div id="' + id + '" class="' + self.classes + '" hidefocus="1">' + '<div class="' + self.classprefix + 'reset" role="application">' + headerhtml + '<div id="' + id + '-body" class="' + self.bodyclasses + '">' + html + '</div>' + footerhtml + '</div>' + '</div>';
      },
      fullscreen: function (state) {
        var self = this;
        var documentelement = domglobals.document.documentelement;
        var slowrendering;
        var prefix = self.classprefix;
        var layoutrect;
        if (state !== self._fullscreen) {
          global$7(domglobals.window).on('resize', function () {
            var time;
            if (self._fullscreen) {
              if (!slowrendering) {
                time = new date().gettime();
                var rect = funcs.getwindowsize();
                self.moveto(0, 0).resizeto(rect.w, rect.h);
                if (new date().gettime() - time > 50) {
                  slowrendering = true;
                }
              } else {
                if (!self._timer) {
                  self._timer = global$3.settimeout(function () {
                    var rect = funcs.getwindowsize();
                    self.moveto(0, 0).resizeto(rect.w, rect.h);
                    self._timer = 0;
                  }, 50);
                }
              }
            }
          });
          layoutrect = self.layoutrect();
          self._fullscreen = state;
          if (!state) {
            self.borderbox = boxutils.parsebox(self.settings.border);
            self.getel('head').style.display = '';
            layoutrect.deltah += layoutrect.headerh;
            global$7([
              documentelement,
              domglobals.document.body
            ]).removeclass(prefix + 'fullscreen');
            self.classes.remove('fullscreen');
            self.moveto(self._initial.x, self._initial.y).resizeto(self._initial.w, self._initial.h);
          } else {
            self._initial = {
              x: layoutrect.x,
              y: layoutrect.y,
              w: layoutrect.w,
              h: layoutrect.h
            };
            self.borderbox = boxutils.parsebox('0');
            self.getel('head').style.display = 'none';
            layoutrect.deltah -= layoutrect.headerh + 2;
            global$7([
              documentelement,
              domglobals.document.body
            ]).addclass(prefix + 'fullscreen');
            self.classes.add('fullscreen');
            var rect = funcs.getwindowsize();
            self.moveto(0, 0).resizeto(rect.w, rect.h);
          }
        }
        return self.reflow();
      },
      postrender: function () {
        var self = this;
        var startpos;
        settimeout(function () {
          self.classes.add('in');
          self.fire('open');
        }, 0);
        self._super();
        if (self.statusbar) {
          self.statusbar.postrender();
        }
        self.focus();
        this.draghelper = new draghelper(self._id + '-dragh', {
          start: function () {
            startpos = {
              x: self.layoutrect().x,
              y: self.layoutrect().y
            };
          },
          drag: function (e) {
            self.moveto(startpos.x + e.deltax, startpos.y + e.deltay);
          }
        });
        self.on('submit', function (e) {
          if (!e.isdefaultprevented()) {
            self.close();
          }
        });
        windows.push(self);
        togglefullscreenstate(true);
      },
      submit: function () {
        return this.fire('submit', { data: this.tojson() });
      },
      remove: function () {
        var self = this;
        var i;
        self.draghelper.destroy();
        self._super();
        if (self.statusbar) {
          this.statusbar.remove();
        }
        togglebodyfullscreenclasses(self.classprefix, false);
        i = windows.length;
        while (i--) {
          if (windows[i] === self) {
            windows.splice(i, 1);
          }
        }
        togglefullscreenstate(windows.length > 0);
      },
      getcontentwindow: function () {
        var ifr = this.getel().getelementsbytagname('iframe')[0];
        return ifr ? ifr.contentwindow : null;
      }
    });
    handlewindowresize();

    var messagebox = window.extend({
      init: function (settings) {
        settings = {
          border: 1,
          padding: 20,
          layout: 'flex',
          pack: 'center',
          align: 'center',
          containercls: 'panel',
          autoscroll: true,
          buttons: {
            type: 'button',
            text: 'ok',
            action: 'ok'
          },
          items: {
            type: 'label',
            multiline: true,
            maxwidth: 500,
            maxheight: 200
          }
        };
        this._super(settings);
      },
      statics: {
        ok: 1,
        ok_cancel: 2,
        yes_no: 3,
        yes_no_cancel: 4,
        msgbox: function (settings) {
          var buttons;
          var callback = settings.callback || function () {
          };
          function createbutton(text, status, primary) {
            return {
              type: 'button',
              text: text,
              subtype: primary ? 'primary' : '',
              onclick: function (e) {
                e.control.parents()[1].close();
                callback(status);
              }
            };
          }
          switch (settings.buttons) {
          case messagebox.ok_cancel:
            buttons = [
              createbutton('ok', true, true),
              createbutton('cancel', false)
            ];
            break;
          case messagebox.yes_no:
          case messagebox.yes_no_cancel:
            buttons = [
              createbutton('yes', 1, true),
              createbutton('no', 0)
            ];
            if (settings.buttons === messagebox.yes_no_cancel) {
              buttons.push(createbutton('cancel', -1));
            }
            break;
          default:
            buttons = [createbutton('ok', true, true)];
            break;
          }
          return new window({
            padding: 20,
            x: settings.x,
            y: settings.y,
            minwidth: 300,
            minheight: 100,
            layout: 'flex',
            pack: 'center',
            align: 'center',
            buttons: buttons,
            title: settings.title,
            role: 'alertdialog',
            items: {
              type: 'label',
              multiline: true,
              maxwidth: 500,
              maxheight: 200,
              text: settings.text
            },
            onpostrender: function () {
              this.aria('describedby', this.items()[0]._id);
            },
            onclose: settings.onclose,
            oncancel: function () {
              callback(false);
            }
          }).renderto(domglobals.document.body).reflow();
        },
        alert: function (settings, callback) {
          if (typeof settings === 'string') {
            settings = { text: settings };
          }
          settings.callback = callback;
          return messagebox.msgbox(settings);
        },
        confirm: function (settings, callback) {
          if (typeof settings === 'string') {
            settings = { text: settings };
          }
          settings.callback = callback;
          settings.buttons = messagebox.ok_cancel;
          return messagebox.msgbox(settings);
        }
      }
    });

    function windowmanagerimpl (editor) {
      var open = function (args, params, closecallback) {
        var win;
        args.title = args.title || ' ';
        args.url = args.url || args.file;
        if (args.url) {
          args.width = parseint(args.width || 320, 10);
          args.height = parseint(args.height || 240, 10);
        }
        if (args.body) {
          args.items = {
            defaults: args.defaults,
            type: args.bodytype || 'form',
            items: args.body,
            data: args.data,
            callbacks: args.commands
          };
        }
        if (!args.url && !args.buttons) {
          args.buttons = [
            {
              text: 'ok',
              subtype: 'primary',
              onclick: function () {
                win.find('form')[0].submit();
              }
            },
            {
              text: 'cancel',
              onclick: function () {
                win.close();
              }
            }
          ];
        }
        win = new window(args);
        win.on('close', function () {
          closecallback(win);
        });
        if (args.data) {
          win.on('postrender', function () {
            this.find('*').each(function (ctrl) {
              var name = ctrl.name();
              if (name in args.data) {
                ctrl.value(args.data[name]);
              }
            });
          });
        }
        win.features = args || {};
        win.params = params || {};
        win = win.renderto(domglobals.document.body).reflow();
        return win;
      };
      var alert = function (message, choicecallback, closecallback) {
        var win;
        win = messagebox.alert(message, function () {
          choicecallback();
        });
        win.on('close', function () {
          closecallback(win);
        });
        return win;
      };
      var confirm = function (message, choicecallback, closecallback) {
        var win;
        win = messagebox.confirm(message, function (state) {
          choicecallback(state);
        });
        win.on('close', function () {
          closecallback(win);
        });
        return win;
      };
      var close = function (window) {
        window.close();
      };
      var getparams = function (window) {
        return window.params;
      };
      var setparams = function (window, params) {
        window.params = params;
      };
      return {
        open: open,
        alert: alert,
        confirm: confirm,
        close: close,
        getparams: getparams,
        setparams: setparams
      };
    }

    var get = function (editor, panel) {
      var renderui = function () {
        return render.renderui(editor, panel);
      };
      return {
        renderui: renderui,
        getnotificationmanagerimpl: function () {
          return notificationmanagerimpl(editor);
        },
        getwindowmanagerimpl: function () {
          return windowmanagerimpl();
        }
      };
    };
    var themeapi = { get: get };

    var global = typeof domglobals.window !== 'undefined' ? domglobals.window : function('return this;')();

    var path = function (parts, scope) {
      var o = scope !== undefined && scope !== null ? scope : global;
      for (var i = 0; i < parts.length && o !== undefined && o !== null; ++i) {
        o = o[parts[i]];
      }
      return o;
    };
    var resolve = function (p, scope) {
      var parts = p.split('.');
      return path(parts, scope);
    };

    var unsafe = function (name, scope) {
      return resolve(name, scope);
    };
    var getordie = function (name, scope) {
      var actual = unsafe(name, scope);
      if (actual === undefined || actual === null) {
        throw new error(name + ' not available on this browser');
      }
      return actual;
    };
    var global$1 = { getordie: getordie };

    function filereader () {
      var f = global$1.getordie('filereader');
      return new f();
    }

    var global$c = tinymce.util.tools.resolve('tinymce.util.promise');

    var blobtobase64 = function (blob) {
      return new global$c(function (resolve) {
        var reader = filereader();
        reader.onloadend = function () {
          resolve(reader.result.split(',')[1]);
        };
        reader.readasdataurl(blob);
      });
    };
    var conversions = { blobtobase64: blobtobase64 };

    var pickfile = function () {
      return new global$c(function (resolve) {
        var fileinput;
        fileinput = domglobals.document.createelement('input');
        fileinput.type = 'file';
        fileinput.style.position = 'fixed';
        fileinput.style.left = 0;
        fileinput.style.top = 0;
        fileinput.style.opacity = 0.001;
        domglobals.document.body.appendchild(fileinput);
        fileinput.onchange = function (e) {
          resolve(array.prototype.slice.call(e.target.files));
        };
        fileinput.click();
        fileinput.parentnode.removechild(fileinput);
      });
    };
    var picker = { pickfile: pickfile };

    var count$1 = 0;
    var seed = function () {
      var rnd = function () {
        return math.round(math.random() * 4294967295).tostring(36);
      };
      return 's' + date.now().tostring(36) + rnd() + rnd() + rnd();
    };
    var uuid = function (prefix) {
      return prefix + count$1++ + seed();
    };
    var uuid = { uuid: uuid };

    var create$1 = function (dom, rng) {
      var bookmark = {};
      function setupendpoint(start) {
        var offsetnode, container, offset;
        container = rng[start ? 'startcontainer' : 'endcontainer'];
        offset = rng[start ? 'startoffset' : 'endoffset'];
        if (container.nodetype === 1) {
          offsetnode = dom.create('span', { 'data-mce-type': 'bookmark' });
          if (container.haschildnodes()) {
            offset = math.min(offset, container.childnodes.length - 1);
            if (start) {
              container.insertbefore(offsetnode, container.childnodes[offset]);
            } else {
              dom.insertafter(offsetnode, container.childnodes[offset]);
            }
          } else {
            container.appendchild(offsetnode);
          }
          container = offsetnode;
          offset = 0;
        }
        bookmark[start ? 'startcontainer' : 'endcontainer'] = container;
        bookmark[start ? 'startoffset' : 'endoffset'] = offset;
      }
      setupendpoint(true);
      if (!rng.collapsed) {
        setupendpoint();
      }
      return bookmark;
    };
    var resolve$1 = function (dom, bookmark) {
      function restoreendpoint(start) {
        var container, offset, node;
        function nodeindex(container) {
          var node = container.parentnode.firstchild, idx = 0;
          while (node) {
            if (node === container) {
              return idx;
            }
            if (node.nodetype !== 1 || node.getattribute('data-mce-type') !== 'bookmark') {
              idx++;
            }
            node = node.nextsibling;
          }
          return -1;
        }
        container = node = bookmark[start ? 'startcontainer' : 'endcontainer'];
        offset = bookmark[start ? 'startoffset' : 'endoffset'];
        if (!container) {
          return;
        }
        if (container.nodetype === 1) {
          offset = nodeindex(container);
          container = container.parentnode;
          dom.remove(node);
        }
        bookmark[start ? 'startcontainer' : 'endcontainer'] = container;
        bookmark[start ? 'startoffset' : 'endoffset'] = offset;
      }
      restoreendpoint(true);
      restoreendpoint();
      var rng = dom.createrng();
      rng.setstart(bookmark.startcontainer, bookmark.startoffset);
      if (bookmark.endcontainer) {
        rng.setend(bookmark.endcontainer, bookmark.endoffset);
      }
      return rng;
    };
    var bookmark = {
      create: create$1,
      resolve: resolve$1
    };

    var global$d = tinymce.util.tools.resolve('tinymce.dom.treewalker');

    var global$e = tinymce.util.tools.resolve('tinymce.dom.rangeutils');

    var getselectedelements = function (rootelm, startnode, endnode) {
      var walker, node;
      var elms = [];
      walker = new global$d(startnode, rootelm);
      for (node = startnode; node; node = walker.next()) {
        if (node.nodetype === 1) {
          elms.push(node);
        }
        if (node === endnode) {
          break;
        }
      }
      return elms;
    };
    var unwrapelements = function (editor, elms) {
      var bookmark, dom, selection;
      dom = editor.dom;
      selection = editor.selection;
      bookmark = bookmark.create(dom, selection.getrng());
      global$4.each(elms, function (elm) {
        editor.dom.remove(elm, true);
      });
      selection.setrng(bookmark.resolve(dom, bookmark));
    };
    var islink = function (elm) {
      return elm.nodename === 'a' && elm.hasattribute('href');
    };
    var getparentanchororself = function (dom, elm) {
      var anchorelm = dom.getparent(elm, islink);
      return anchorelm ? anchorelm : elm;
    };
    var getselectedanchors = function (editor) {
      var startelm, endelm, rootelm, anchorelms, selection, dom, rng;
      selection = editor.selection;
      dom = editor.dom;
      rng = selection.getrng();
      startelm = getparentanchororself(dom, global$e.getnode(rng.startcontainer, rng.startoffset));
      endelm = global$e.getnode(rng.endcontainer, rng.endoffset);
      rootelm = editor.getbody();
      anchorelms = global$4.grep(getselectedelements(rootelm, startelm, endelm), islink);
      return anchorelms;
    };
    var unlinkselection = function (editor) {
      unwrapelements(editor, getselectedanchors(editor));
    };
    var unlink = { unlinkselection: unlinkselection };

    var createtablehtml = function (cols, rows) {
      var x, y, html;
      html = '<table data-mce-id="mce" style="width: 100%">';
      html += '<tbody>';
      for (y = 0; y < rows; y++) {
        html += '<tr>';
        for (x = 0; x < cols; x++) {
          html += '<td><br></td>';
        }
        html += '</tr>';
      }
      html += '</tbody>';
      html += '</table>';
      return html;
    };
    var getinsertedelement = function (editor) {
      var elms = editor.dom.select('*[data-mce-id]');
      return elms[0];
    };
    var inserttablehtml = function (editor, cols, rows) {
      editor.undomanager.transact(function () {
        var tableelm, cellelm;
        editor.insertcontent(createtablehtml(cols, rows));
        tableelm = getinsertedelement(editor);
        tableelm.removeattribute('data-mce-id');
        cellelm = editor.dom.select('td,th', tableelm);
        editor.selection.setcursorlocation(cellelm[0], 0);
      });
    };
    var inserttable = function (editor, cols, rows) {
      editor.plugins.table ? editor.plugins.table.inserttable(cols, rows) : inserttablehtml(editor, cols, rows);
    };
    var formatblock = function (editor, formatname) {
      editor.execcommand('formatblock', false, formatname);
    };
    var insertblob = function (editor, base64, blob) {
      var blobcache, blobinfo;
      blobcache = editor.editorupload.blobcache;
      blobinfo = blobcache.create(uuid.uuid('mceu'), blob, base64);
      blobcache.add(blobinfo);
      editor.insertcontent(editor.dom.createhtml('img', { src: blobinfo.bloburi() }));
    };
    var collapseselectiontoend = function (editor) {
      editor.selection.collapse(false);
    };
    var unlink = function (editor) {
      editor.focus();
      unlink.unlinkselection(editor);
      collapseselectiontoend(editor);
    };
    var changehref = function (editor, elm, url) {
      editor.focus();
      editor.dom.setattrib(elm, 'href', url);
      collapseselectiontoend(editor);
    };
    var insertlink = function (editor, url) {
      editor.execcommand('mceinsertlink', false, { href: url });
      collapseselectiontoend(editor);
    };
    var updateorinsertlink = function (editor, url) {
      var elm = editor.dom.getparent(editor.selection.getstart(), 'a[href]');
      elm ? changehref(editor, elm, url) : insertlink(editor, url);
    };
    var createlink = function (editor, url) {
      url.trim().length === 0 ? unlink(editor) : updateorinsertlink(editor, url);
    };
    var actions = {
      inserttable: inserttable,
      formatblock: formatblock,
      insertblob: insertblob,
      createlink: createlink,
      unlink: unlink
    };

    var addheaderbuttons = function (editor) {
      var formatblock = function (name) {
        return function () {
          actions.formatblock(editor, name);
        };
      };
      for (var i = 1; i < 6; i++) {
        var name = 'h' + i;
        editor.addbutton(name, {
          text: name.touppercase(),
          tooltip: 'heading ' + i,
          stateselector: name,
          onclick: formatblock(name),
          onpostrender: function () {
            var span = this.getel().firstchild.firstchild;
            span.style.fontweight = 'bold';
          }
        });
      }
    };
    var addtoeditor = function (editor, panel) {
      editor.addbutton('quicklink', {
        icon: 'link',
        tooltip: 'insert/edit link',
        stateselector: 'a[href]',
        onclick: function () {
          panel.showform(editor, 'quicklink');
        }
      });
      editor.addbutton('quickimage', {
        icon: 'image',
        tooltip: 'insert image',
        onclick: function () {
          picker.pickfile().then(function (files) {
            var blob = files[0];
            conversions.blobtobase64(blob).then(function (base64) {
              actions.insertblob(editor, base64, blob);
            });
          });
        }
      });
      editor.addbutton('quicktable', {
        icon: 'table',
        tooltip: 'insert table',
        onclick: function () {
          panel.hide();
          actions.inserttable(editor, 2, 2);
        }
      });
      addheaderbuttons(editor);
    };
    var buttons = { addtoeditor: addtoeditor };

    var getuicontainerdelta$1 = function () {
      var uicontainer = global$1.container;
      if (uicontainer && global$2.dom.getstyle(uicontainer, 'position', true) !== 'static') {
        var containerpos = global$2.dom.getpos(uicontainer);
        var dx = containerpos.x - uicontainer.scrollleft;
        var dy = containerpos.y - uicontainer.scrolltop;
        return option.some({
          x: dx,
          y: dy
        });
      } else {
        return option.none();
      }
    };
    var uicontainer$1 = { getuicontainerdelta: getuicontainerdelta$1 };

    var isdomainlike = function (href) {
      return /^www\.|\.(com|org|edu|gov|uk|net|ca|de|jp|fr|au|us|ru|ch|it|nl|se|no|es|mil)$/i.test(href.trim());
    };
    var isabsolute = function (href) {
      return /^https?:\/\//.test(href.trim());
    };
    var urltype = {
      isdomainlike: isdomainlike,
      isabsolute: isabsolute
    };

    var focusfirsttextbox = function (form) {
      form.find('textbox').eq(0).each(function (ctrl) {
        ctrl.focus();
      });
    };
    var createform = function (name, spec) {
      var form = global$b.create(global$4.extend({
        type: 'form',
        layout: 'flex',
        direction: 'row',
        padding: 5,
        name: name,
        spacing: 3
      }, spec));
      form.on('show', function () {
        focusfirsttextbox(form);
      });
      return form;
    };
    var togglevisibility = function (ctrl, state) {
      return state ? ctrl.show() : ctrl.hide();
    };
    var askaboutprefix = function (editor, href) {
      return new global$c(function (resolve) {
        editor.windowmanager.confirm('the url you entered seems to be an external link. do you want to add the required http:// prefix?', function (result) {
          var output = result === true ? 'http://' + href : href;
          resolve(output);
        });
      });
    };
    var convertlinktoabsolute = function (editor, href) {
      return !urltype.isabsolute(href) && urltype.isdomainlike(href) ? askaboutprefix(editor, href) : global$c.resolve(href);
    };
    var createquicklinkform = function (editor, hide) {
      var attachstate = {};
      var unlink = function () {
        editor.focus();
        actions.unlink(editor);
        hide();
      };
      var onchangehandler = function (e) {
        var meta = e.meta;
        if (meta && meta.attach) {
          attachstate = {
            href: this.value(),
            attach: meta.attach
          };
        }
      };
      var onshowhandler = function (e) {
        if (e.control === this) {
          var elm = void 0, linkurl = '';
          elm = editor.dom.getparent(editor.selection.getstart(), 'a[href]');
          if (elm) {
            linkurl = editor.dom.getattrib(elm, 'href');
          }
          this.fromjson({ linkurl: linkurl });
          togglevisibility(this.find('#unlink'), elm);
          this.find('#linkurl')[0].focus();
        }
      };
      return createform('quicklink', {
        items: [
          {
            type: 'button',
            name: 'unlink',
            icon: 'unlink',
            onclick: unlink,
            tooltip: 'remove link'
          },
          {
            type: 'filepicker',
            name: 'linkurl',
            placeholder: 'paste or type a link',
            filetype: 'file',
            onchange: onchangehandler
          },
          {
            type: 'button',
            icon: 'checkmark',
            subtype: 'primary',
            tooltip: 'ok',
            onclick: 'submit'
          }
        ],
        onshow: onshowhandler,
        onsubmit: function (e) {
          convertlinktoabsolute(editor, e.data.linkurl).then(function (url) {
            editor.undomanager.transact(function () {
              if (url === attachstate.href) {
                attachstate.attach();
                attachstate = {};
              }
              actions.createlink(editor, url);
            });
            hide();
          });
        }
      });
    };
    var forms = { createquicklinkform: createquicklinkform };

    var getselectorstateresult = function (itemname, item) {
      var result = function (selector, handler) {
        return {
          selector: selector,
          handler: handler
        };
      };
      var activehandler = function (state) {
        item.active(state);
      };
      var disabledhandler = function (state) {
        item.disabled(state);
      };
      if (item.settings.stateselector) {
        return result(item.settings.stateselector, activehandler);
      }
      if (item.settings.disabledstateselector) {
        return result(item.settings.disabledstateselector, disabledhandler);
      }
      return null;
    };
    var bindselectorchanged = function (editor, itemname, item) {
      return function () {
        var result = getselectorstateresult(itemname, item);
        if (result !== null) {
          editor.selection.selectorchanged(result.selector, result.handler);
        }
      };
    };
    var itemstoarray$1 = function (items) {
      if (type.isarray(items)) {
        return items;
      } else if (type.isstring(items)) {
        return items.split(/[ ,]/);
      }
      return [];
    };
    var create$2 = function (editor, name, items) {
      var toolbaritems = [];
      var buttongroup;
      if (!items) {
        return;
      }
      global$4.each(itemstoarray$1(items), function (item) {
        if (item === '|') {
          buttongroup = null;
        } else {
          if (editor.buttons[item]) {
            if (!buttongroup) {
              buttongroup = {
                type: 'buttongroup',
                items: []
              };
              toolbaritems.push(buttongroup);
            }
            var button = editor.buttons[item];
            if (type.isfunction(button)) {
              button = button();
            }
            button.type = button.type || 'button';
            button = global$b.create(button);
            button.on('postrender', bindselectorchanged(editor, item, button));
            buttongroup.items.push(button);
          }
        }
      });
      return global$b.create({
        type: 'toolbar',
        layout: 'flow',
        name: name,
        items: toolbaritems
      });
    };
    var toolbar = { create: create$2 };

    var create$3 = function () {
      var panel, currentrect;
      var createtoolbars = function (editor, toolbars) {
        return global$4.map(toolbars, function (toolbar) {
          return toolbar.create(editor, toolbar.id, toolbar.items);
        });
      };
      var hastoolbaritems = function (toolbar) {
        return toolbar.items().length > 0;
      };
      var create = function (editor, toolbars) {
        var items = createtoolbars(editor, toolbars).concat([
          toolbar.create(editor, 'text', settings.gettextselectiontoolbaritems(editor)),
          toolbar.create(editor, 'insert', settings.getinserttoolbaritems(editor)),
          forms.createquicklinkform(editor, hide)
        ]);
        return global$b.create({
          type: 'floatpanel',
          role: 'dialog',
          classes: 'tinymce tinymce-inline arrow',
          arialabel: 'inline toolbar',
          layout: 'flex',
          direction: 'column',
          align: 'stretch',
          autohide: false,
          autofix: true,
          fixed: true,
          border: 1,
          items: global$4.grep(items, hastoolbaritems),
          oncancel: function () {
            editor.focus();
          }
        });
      };
      var showpanel = function (panel) {
        if (panel) {
          panel.show();
        }
      };
      var movepanelto = function (panel, pos) {
        panel.moveto(pos.x, pos.y);
      };
      var togglepositionclass = function (panel, relpos) {
        relpos = relpos ? relpos.substr(0, 2) : '';
        global$4.each({
          t: 'down',
          b: 'up',
          c: 'center'
        }, function (cls, pos) {
          panel.classes.toggle('arrow-' + cls, pos === relpos.substr(0, 1));
        });
        if (relpos === 'cr') {
          panel.classes.toggle('arrow-left', true);
          panel.classes.toggle('arrow-right', false);
        } else if (relpos === 'cl') {
          panel.classes.toggle('arrow-left', false);
          panel.classes.toggle('arrow-right', true);
        } else {
          global$4.each({
            l: 'left',
            r: 'right'
          }, function (cls, pos) {
            panel.classes.toggle('arrow-' + cls, pos === relpos.substr(1, 1));
          });
        }
      };
      var showtoolbar = function (panel, id) {
        var toolbars = panel.items().filter('#' + id);
        if (toolbars.length > 0) {
          toolbars[0].show();
          panel.reflow();
          return true;
        }
        return false;
      };
      var repositionpanelat = function (panel, id, editor, targetrect) {
        var contentarearect, panelrect, result, userconstainhandler;
        userconstainhandler = settings.getpositionhandler(editor);
        contentarearect = measure.getcontentarearect(editor);
        panelrect = global$2.dom.getrect(panel.getel());
        if (id === 'insert') {
          result = layout.calcinsert(targetrect, contentarearect, panelrect);
        } else {
          result = layout.calc(targetrect, contentarearect, panelrect);
        }
        if (result) {
          var delta = uicontainer$1.getuicontainerdelta().getor({
            x: 0,
            y: 0
          });
          var transposedpanelrect = {
            x: result.rect.x - delta.x,
            y: result.rect.y - delta.y,
            w: result.rect.w,
            h: result.rect.h
          };
          currentrect = targetrect;
          movepanelto(panel, layout.userconstrain(userconstainhandler, targetrect, contentarearect, transposedpanelrect));
          togglepositionclass(panel, result.position);
          return true;
        } else {
          return false;
        }
      };
      var showpanelat = function (panel, id, editor, targetrect) {
        showpanel(panel);
        panel.items().hide();
        if (!showtoolbar(panel, id)) {
          hide();
          return;
        }
        if (repositionpanelat(panel, id, editor, targetrect) === false) {
          hide();
        }
      };
      var hasformvisible = function () {
        return panel.items().filter('form:visible').length > 0;
      };
      var showform = function (editor, id) {
        if (panel) {
          panel.items().hide();
          if (!showtoolbar(panel, id)) {
            hide();
            return;
          }
          var contentarearect = void 0, panelrect = void 0, result = void 0, userconstainhandler = void 0;
          showpanel(panel);
          panel.items().hide();
          showtoolbar(panel, id);
          userconstainhandler = settings.getpositionhandler(editor);
          contentarearect = measure.getcontentarearect(editor);
          panelrect = global$2.dom.getrect(panel.getel());
          result = layout.calc(currentrect, contentarearect, panelrect);
          if (result) {
            panelrect = result.rect;
            movepanelto(panel, layout.userconstrain(userconstainhandler, currentrect, contentarearect, panelrect));
            togglepositionclass(panel, result.position);
          }
        }
      };
      var show = function (editor, id, targetrect, toolbars) {
        if (!panel) {
          events.firebeforerenderui(editor);
          panel = create(editor, toolbars);
          panel.renderto().reflow().moveto(targetrect.x, targetrect.y);
          editor.nodechanged();
        }
        showpanelat(panel, id, editor, targetrect);
      };
      var reposition = function (editor, id, targetrect) {
        if (panel) {
          repositionpanelat(panel, id, editor, targetrect);
        }
      };
      var hide = function () {
        if (panel) {
          panel.hide();
        }
      };
      var focus = function () {
        if (panel) {
          panel.find('toolbar:visible').eq(0).each(function (item) {
            item.focus(true);
          });
        }
      };
      var remove = function () {
        if (panel) {
          panel.remove();
          panel = null;
        }
      };
      var inform = function () {
        return panel && panel.visible() && hasformvisible();
      };
      return {
        show: show,
        showform: showform,
        reposition: reposition,
        inform: inform,
        hide: hide,
        focus: focus,
        remove: remove
      };
    };

    var layout$1 = global$8.extend({
      defaults: {
        firstcontrolclass: 'first',
        lastcontrolclass: 'last'
      },
      init: function (settings) {
        this.settings = global$4.extend({}, this.defaults, settings);
      },
      prerender: function (container) {
        container.bodyclasses.add(this.settings.containerclass);
      },
      applyclasses: function (items) {
        var self = this;
        var settings = self.settings;
        var firstclass, lastclass, firstitem, lastitem;
        firstclass = settings.firstcontrolclass;
        lastclass = settings.lastcontrolclass;
        items.each(function (item) {
          item.classes.remove(firstclass).remove(lastclass).add(settings.controlclass);
          if (item.visible()) {
            if (!firstitem) {
              firstitem = item;
            }
            lastitem = item;
          }
        });
        if (firstitem) {
          firstitem.classes.add(firstclass);
        }
        if (lastitem) {
          lastitem.classes.add(lastclass);
        }
      },
      renderhtml: function (container) {
        var self = this;
        var html = '';
        self.applyclasses(container.items());
        container.items().each(function (item) {
          html += item.renderhtml();
        });
        return html;
      },
      recalc: function () {
      },
      postrender: function () {
      },
      isnative: function () {
        return false;
      }
    });

    var absolutelayout = layout$1.extend({
      defaults: {
        containerclass: 'abs-layout',
        controlclass: 'abs-layout-item'
      },
      recalc: function (container) {
        container.items().filter(':visible').each(function (ctrl) {
          var settings = ctrl.settings;
          ctrl.layoutrect({
            x: settings.x,
            y: settings.y,
            w: settings.w,
            h: settings.h
          });
          if (ctrl.recalc) {
            ctrl.recalc();
          }
        });
      },
      renderhtml: function (container) {
        return '<div id="' + container._id + '-absend" class="' + container.classprefix + 'abs-end"></div>' + this._super(container);
      }
    });

    var button = widget.extend({
      defaults: {
        classes: 'widget btn',
        role: 'button'
      },
      init: function (settings) {
        var self = this;
        var size;
        self._super(settings);
        settings = self.settings;
        size = self.settings.size;
        self.on('click mousedown', function (e) {
          e.preventdefault();
        });
        self.on('touchstart', function (e) {
          self.fire('click', e);
          e.preventdefault();
        });
        if (settings.subtype) {
          self.classes.add(settings.subtype);
        }
        if (size) {
          self.classes.add('btn-' + size);
        }
        if (settings.icon) {
          self.icon(settings.icon);
        }
      },
      icon: function (icon) {
        if (!arguments.length) {
          return this.state.get('icon');
        }
        this.state.set('icon', icon);
        return this;
      },
      repaint: function () {
        var btnelm = this.getel().firstchild;
        var btnstyle;
        if (btnelm) {
          btnstyle = btnelm.style;
          btnstyle.width = btnstyle.height = '100%';
        }
        this._super();
      },
      renderhtml: function () {
        var self = this, id = self._id, prefix = self.classprefix;
        var icon = self.state.get('icon'), image;
        var text = self.state.get('text');
        var texthtml = '';
        var ariapressed;
        var settings = self.settings;
        image = settings.image;
        if (image) {
          icon = 'none';
          if (typeof image !== 'string') {
            image = domglobals.window.getselection ? image[0] : image[1];
          }
          image = ' style="background-image: url(\'' + image + '\')"';
        } else {
          image = '';
        }
        if (text) {
          self.classes.add('btn-has-text');
          texthtml = '<span class="' + prefix + 'txt">' + self.encode(text) + '</span>';
        }
        icon = icon ? prefix + 'ico ' + prefix + 'i-' + icon : '';
        ariapressed = typeof settings.active === 'boolean' ? ' aria-pressed="' + settings.active + '"' : '';
        return '<div id="' + id + '" class="' + self.classes + '" tabindex="-1"' + ariapressed + '>' + '<button id="' + id + '-button" role="presentation" type="button" tabindex="-1">' + (icon ? '<i class="' + icon + '"' + image + '></i>' : '') + texthtml + '</button>' + '</div>';
      },
      bindstates: function () {
        var self = this, $ = self.$, textcls = self.classprefix + 'txt';
        function setbuttontext(text) {
          var $span = $('span.' + textcls, self.getel());
          if (text) {
            if (!$span[0]) {
              $('button:first', self.getel()).append('<span class="' + textcls + '"></span>');
              $span = $('span.' + textcls, self.getel());
            }
            $span.html(self.encode(text));
          } else {
            $span.remove();
          }
          self.classes.toggle('btn-has-text', !!text);
        }
        self.state.on('change:text', function (e) {
          setbuttontext(e.value);
        });
        self.state.on('change:icon', function (e) {
          var icon = e.value;
          var prefix = self.classprefix;
          self.settings.icon = icon;
          icon = icon ? prefix + 'ico ' + prefix + 'i-' + self.settings.icon : '';
          var btnelm = self.getel().firstchild;
          var iconelm = btnelm.getelementsbytagname('i')[0];
          if (icon) {
            if (!iconelm || iconelm !== btnelm.firstchild) {
              iconelm = domglobals.document.createelement('i');
              btnelm.insertbefore(iconelm, btnelm.firstchild);
            }
            iconelm.classname = icon;
          } else if (iconelm) {
            btnelm.removechild(iconelm);
          }
          setbuttontext(self.state.get('text'));
        });
        return self._super();
      }
    });

    var browsebutton = button.extend({
      init: function (settings) {
        var self = this;
        settings = global$4.extend({
          text: 'browse...',
          multiple: false,
          accept: null
        }, settings);
        self._super(settings);
        self.classes.add('browsebutton');
        if (settings.multiple) {
          self.classes.add('multiple');
        }
      },
      postrender: function () {
        var self = this;
        var input = funcs.create('input', {
          type: 'file',
          id: self._id + '-browse',
          accept: self.settings.accept
        });
        self._super();
        global$7(input).on('change', function (e) {
          var files = e.target.files;
          self.value = function () {
            if (!files.length) {
              return null;
            } else if (self.settings.multiple) {
              return files;
            } else {
              return files[0];
            }
          };
          e.preventdefault();
          if (files.length) {
            self.fire('change', e);
          }
        });
        global$7(input).on('click', function (e) {
          e.stoppropagation();
        });
        global$7(self.getel('button')).on('click touchstart', function (e) {
          e.stoppropagation();
          input.click();
          e.preventdefault();
        });
        self.getel().appendchild(input);
      },
      remove: function () {
        global$7(this.getel('button')).off();
        global$7(this.getel('input')).off();
        this._super();
      }
    });

    var buttongroup = container.extend({
      defaults: {
        defaulttype: 'button',
        role: 'group'
      },
      renderhtml: function () {
        var self = this, layout = self._layout;
        self.classes.add('btn-group');
        self.prerender();
        layout.prerender(self);
        return '<div id="' + self._id + '" class="' + self.classes + '">' + '<div id="' + self._id + '-body">' + (self.settings.html || '') + layout.renderhtml(self) + '</div>' + '</div>';
      }
    });

    var checkbox = widget.extend({
      defaults: {
        classes: 'checkbox',
        role: 'checkbox',
        checked: false
      },
      init: function (settings) {
        var self = this;
        self._super(settings);
        self.on('click mousedown', function (e) {
          e.preventdefault();
        });
        self.on('click', function (e) {
          e.preventdefault();
          if (!self.disabled()) {
            self.checked(!self.checked());
          }
        });
        self.checked(self.settings.checked);
      },
      checked: function (state) {
        if (!arguments.length) {
          return this.state.get('checked');
        }
        this.state.set('checked', state);
        return this;
      },
      value: function (state) {
        if (!arguments.length) {
          return this.checked();
        }
        return this.checked(state);
      },
      renderhtml: function () {
        var self = this, id = self._id, prefix = self.classprefix;
        return '<div id="' + id + '" class="' + self.classes + '" unselectable="on" aria-labelledby="' + id + '-al" tabindex="-1">' + '<i class="' + prefix + 'ico ' + prefix + 'i-checkbox"></i>' + '<span id="' + id + '-al" class="' + prefix + 'label">' + self.encode(self.state.get('text')) + '</span>' + '</div>';
      },
      bindstates: function () {
        var self = this;
        function checked(state) {
          self.classes.toggle('checked', state);
          self.aria('checked', state);
        }
        self.state.on('change:text', function (e) {
          self.getel('al').firstchild.data = self.translate(e.value);
        });
        self.state.on('change:checked change:value', function (e) {
          self.fire('change');
          checked(e.value);
        });
        self.state.on('change:icon', function (e) {
          var icon = e.value;
          var prefix = self.classprefix;
          if (typeof icon === 'undefined') {
            return self.settings.icon;
          }
          self.settings.icon = icon;
          icon = icon ? prefix + 'ico ' + prefix + 'i-' + self.settings.icon : '';
          var btnelm = self.getel().firstchild;
          var iconelm = btnelm.getelementsbytagname('i')[0];
          if (icon) {
            if (!iconelm || iconelm !== btnelm.firstchild) {
              iconelm = domglobals.document.createelement('i');
              btnelm.insertbefore(iconelm, btnelm.firstchild);
            }
            iconelm.classname = icon;
          } else if (iconelm) {
            btnelm.removechild(iconelm);
          }
        });
        if (self.state.get('checked')) {
          checked(true);
        }
        return self._super();
      }
    });

    var global$f = tinymce.util.tools.resolve('tinymce.util.vk');

    var combobox = widget.extend({
      init: function (settings) {
        var self = this;
        self._super(settings);
        settings = self.settings;
        self.classes.add('combobox');
        self.subinput = true;
        self.ariatarget = 'inp';
        settings.menu = settings.menu || settings.values;
        if (settings.menu) {
          settings.icon = 'caret';
        }
        self.on('click', function (e) {
          var elm = e.target;
          var root = self.getel();
          if (!global$7.contains(root, elm) && elm !== root) {
            return;
          }
          while (elm && elm !== root) {
            if (elm.id && elm.id.indexof('-open') !== -1) {
              self.fire('action');
              if (settings.menu) {
                self.showmenu();
                if (e.aria) {
                  self.menu.items()[0].focus();
                }
              }
            }
            elm = elm.parentnode;
          }
        });
        self.on('keydown', function (e) {
          var rootcontrol;
          if (e.keycode === 13 && e.target.nodename === 'input') {
            e.preventdefault();
            self.parents().reverse().each(function (ctrl) {
              if (ctrl.tojson) {
                rootcontrol = ctrl;
                return false;
              }
            });
            self.fire('submit', { data: rootcontrol.tojson() });
          }
        });
        self.on('keyup', function (e) {
          if (e.target.nodename === 'input') {
            var oldvalue = self.state.get('value');
            var newvalue = e.target.value;
            if (newvalue !== oldvalue) {
              self.state.set('value', newvalue);
              self.fire('autocomplete', e);
            }
          }
        });
        self.on('mouseover', function (e) {
          var tooltip = self.tooltip().moveto(-65535);
          if (self.statuslevel() && e.target.classname.indexof(self.classprefix + 'status') !== -1) {
            var statusmessage = self.statusmessage() || 'ok';
            var rel = tooltip.text(statusmessage).show().testmoverel(e.target, [
              'bc-tc',
              'bc-tl',
              'bc-tr'
            ]);
            tooltip.classes.toggle('tooltip-n', rel === 'bc-tc');
            tooltip.classes.toggle('tooltip-nw', rel === 'bc-tl');
            tooltip.classes.toggle('tooltip-ne', rel === 'bc-tr');
            tooltip.moverel(e.target, rel);
          }
        });
      },
      statuslevel: function (value) {
        if (arguments.length > 0) {
          this.state.set('statuslevel', value);
        }
        return this.state.get('statuslevel');
      },
      statusmessage: function (value) {
        if (arguments.length > 0) {
          this.state.set('statusmessage', value);
        }
        return this.state.get('statusmessage');
      },
      showmenu: function () {
        var self = this;
        var settings = self.settings;
        var menu;
        if (!self.menu) {
          menu = settings.menu || [];
          if (menu.length) {
            menu = {
              type: 'menu',
              items: menu
            };
          } else {
            menu.type = menu.type || 'menu';
          }
          self.menu = global$b.create(menu).parent(self).renderto(self.getcontainerelm());
          self.fire('createmenu');
          self.menu.reflow();
          self.menu.on('cancel', function (e) {
            if (e.control === self.menu) {
              self.focus();
            }
          });
          self.menu.on('show hide', function (e) {
            e.control.items().each(function (ctrl) {
              ctrl.active(ctrl.value() === self.value());
            });
          }).fire('show');
          self.menu.on('select', function (e) {
            self.value(e.control.value());
          });
          self.on('focusin', function (e) {
            if (e.target.tagname.touppercase() === 'input') {
              self.menu.hide();
            }
          });
          self.aria('expanded', true);
        }
        self.menu.show();
        self.menu.layoutrect({ w: self.layoutrect().w });
        self.menu.moverel(self.getel(), self.isrtl() ? [
          'br-tr',
          'tr-br'
        ] : [
          'bl-tl',
          'tl-bl'
        ]);
      },
      focus: function () {
        this.getel('inp').focus();
      },
      repaint: function () {
        var self = this, elm = self.getel(), openelm = self.getel('open'), rect = self.layoutrect();
        var width, lineheight, innerpadding = 0;
        var inputelm = elm.firstchild;
        if (self.statuslevel() && self.statuslevel() !== 'none') {
          innerpadding = parseint(funcs.getruntimestyle(inputelm, 'padding-right'), 10) - parseint(funcs.getruntimestyle(inputelm, 'padding-left'), 10);
        }
        if (openelm) {
          width = rect.w - funcs.getsize(openelm).width - 10;
        } else {
          width = rect.w - 10;
        }
        var doc = domglobals.document;
        if (doc.all && (!doc.documentmode || doc.documentmode <= 8)) {
          lineheight = self.layoutrect().h - 2 + 'px';
        }
        global$7(inputelm).css({
          width: width - innerpadding,
          lineheight: lineheight
        });
        self._super();
        return self;
      },
      postrender: function () {
        var self = this;
        global$7(this.getel('inp')).on('change', function (e) {
          self.state.set('value', e.target.value);
          self.fire('change', e);
        });
        return self._super();
      },
      renderhtml: function () {
        var self = this, id = self._id, settings = self.settings, prefix = self.classprefix;
        var value = self.state.get('value') || '';
        var icon, text, openbtnhtml = '', extraattrs = '', statushtml = '';
        if ('spellcheck' in settings) {
          extraattrs += ' spellcheck="' + settings.spellcheck + '"';
        }
        if (settings.maxlength) {
          extraattrs += ' maxlength="' + settings.maxlength + '"';
        }
        if (settings.size) {
          extraattrs += ' size="' + settings.size + '"';
        }
        if (settings.subtype) {
          extraattrs += ' type="' + settings.subtype + '"';
        }
        statushtml = '<i id="' + id + '-status" class="mce-status mce-ico" style="display: none"></i>';
        if (self.disabled()) {
          extraattrs += ' disabled="disabled"';
        }
        icon = settings.icon;
        if (icon && icon !== 'caret') {
          icon = prefix + 'ico ' + prefix + 'i-' + settings.icon;
        }
        text = self.state.get('text');
        if (icon || text) {
          openbtnhtml = '<div id="' + id + '-open" class="' + prefix + 'btn ' + prefix + 'open" tabindex="-1" role="button">' + '<button id="' + id + '-action" type="button" hidefocus="1" tabindex="-1">' + (icon !== 'caret' ? '<i class="' + icon + '"></i>' : '<i class="' + prefix + 'caret"></i>') + (text ? (icon ? ' ' : '') + text : '') + '</button>' + '</div>';
          self.classes.add('has-open');
        }
        return '<div id="' + id + '" class="' + self.classes + '">' + '<input id="' + id + '-inp" class="' + prefix + 'textbox" value="' + self.encode(value, false) + '" hidefocus="1"' + extraattrs + ' placeholder="' + self.encode(settings.placeholder) + '" />' + statushtml + openbtnhtml + '</div>';
      },
      value: function (value) {
        if (arguments.length) {
          this.state.set('value', value);
          return this;
        }
        if (this.state.get('rendered')) {
          this.state.set('value', this.getel('inp').value);
        }
        return this.state.get('value');
      },
      showautocomplete: function (items, term) {
        var self = this;
        if (items.length === 0) {
          self.hidemenu();
          return;
        }
        var insert = function (value, title) {
          return function () {
            self.fire('selectitem', {
              title: title,
              value: value
            });
          };
        };
        if (self.menu) {
          self.menu.items().remove();
        } else {
          self.menu = global$b.create({
            type: 'menu',
            classes: 'combobox-menu',
            layout: 'flow'
          }).parent(self).renderto();
        }
        global$4.each(items, function (item) {
          self.menu.add({
            text: item.title,
            url: item.previewurl,
            match: term,
            classes: 'menu-item-ellipsis',
            onclick: insert(item.value, item.title)
          });
        });
        self.menu.rendernew();
        self.hidemenu();
        self.menu.on('cancel', function (e) {
          if (e.control.parent() === self.menu) {
            e.stoppropagation();
            self.focus();
            self.hidemenu();
          }
        });
        self.menu.on('select', function () {
          self.focus();
        });
        var maxw = self.layoutrect().w;
        self.menu.layoutrect({
          w: maxw,
          minw: 0,
          maxw: maxw
        });
        self.menu.repaint();
        self.menu.reflow();
        self.menu.show();
        self.menu.moverel(self.getel(), self.isrtl() ? [
          'br-tr',
          'tr-br'
        ] : [
          'bl-tl',
          'tl-bl'
        ]);
      },
      hidemenu: function () {
        if (this.menu) {
          this.menu.hide();
        }
      },
      bindstates: function () {
        var self = this;
        self.state.on('change:value', function (e) {
          if (self.getel('inp').value !== e.value) {
            self.getel('inp').value = e.value;
          }
        });
        self.state.on('change:disabled', function (e) {
          self.getel('inp').disabled = e.value;
        });
        self.state.on('change:statuslevel', function (e) {
          var statusiconelm = self.getel('status');
          var prefix = self.classprefix, value = e.value;
          funcs.css(statusiconelm, 'display', value === 'none' ? 'none' : '');
          funcs.toggleclass(statusiconelm, prefix + 'i-checkmark', value === 'ok');
          funcs.toggleclass(statusiconelm, prefix + 'i-warning', value === 'warn');
          funcs.toggleclass(statusiconelm, prefix + 'i-error', value === 'error');
          self.classes.toggle('has-status', value !== 'none');
          self.repaint();
        });
        funcs.on(self.getel('status'), 'mouseleave', function () {
          self.tooltip().hide();
        });
        self.on('cancel', function (e) {
          if (self.menu && self.menu.visible()) {
            e.stoppropagation();
            self.hidemenu();
          }
        });
        var focusidx = function (idx, menu) {
          if (menu && menu.items().length > 0) {
            menu.items().eq(idx)[0].focus();
          }
        };
        self.on('keydown', function (e) {
          var keycode = e.keycode;
          if (e.target.nodename === 'input') {
            if (keycode === global$f.down) {
              e.preventdefault();
              self.fire('autocomplete');
              focusidx(0, self.menu);
            } else if (keycode === global$f.up) {
              e.preventdefault();
              focusidx(-1, self.menu);
            }
          }
        });
        return self._super();
      },
      remove: function () {
        global$7(this.getel('inp')).off();
        if (this.menu) {
          this.menu.remove();
        }
        this._super();
      }
    });

    var colorbox = combobox.extend({
      init: function (settings) {
        var self = this;
        settings.spellcheck = false;
        if (settings.onaction) {
          settings.icon = 'none';
        }
        self._super(settings);
        self.classes.add('colorbox');
        self.on('change keyup postrender', function () {
          self.repaintcolor(self.value());
        });
      },
      repaintcolor: function (value) {
        var openelm = this.getel('open');
        var elm = openelm ? openelm.getelementsbytagname('i')[0] : null;
        if (elm) {
          try {
            elm.style.background = value;
          } catch (ex) {
          }
        }
      },
      bindstates: function () {
        var self = this;
        self.state.on('change:value', function (e) {
          if (self.state.get('rendered')) {
            self.repaintcolor(e.value);
          }
        });
        return self._super();
      }
    });

    var panelbutton = button.extend({
      showpanel: function () {
        var self = this, settings = self.settings;
        self.classes.add('opened');
        if (!self.panel) {
          var panelsettings = settings.panel;
          if (panelsettings.type) {
            panelsettings = {
              layout: 'grid',
              items: panelsettings
            };
          }
          panelsettings.role = panelsettings.role || 'dialog';
          panelsettings.popover = true;
          panelsettings.autohide = true;
          panelsettings.ariaroot = true;
          self.panel = new floatpanel(panelsettings).on('hide', function () {
            self.classes.remove('opened');
          }).on('cancel', function (e) {
            e.stoppropagation();
            self.focus();
            self.hidepanel();
          }).parent(self).renderto(self.getcontainerelm());
          self.panel.fire('show');
          self.panel.reflow();
        } else {
          self.panel.show();
        }
        var rtlrels = [
          'bc-tc',
          'bc-tl',
          'bc-tr'
        ];
        var ltrrels = [
          'bc-tc',
          'bc-tr',
          'bc-tl',
          'tc-bc',
          'tc-br',
          'tc-bl'
        ];
        var rel = self.panel.testmoverel(self.getel(), settings.popoveralign || (self.isrtl() ? rtlrels : ltrrels));
        self.panel.classes.toggle('start', rel.substr(-1) === 'l');
        self.panel.classes.toggle('end', rel.substr(-1) === 'r');
        var istop = rel.substr(0, 1) === 't';
        self.panel.classes.toggle('bottom', !istop);
        self.panel.classes.toggle('top', istop);
        self.panel.moverel(self.getel(), rel);
      },
      hidepanel: function () {
        var self = this;
        if (self.panel) {
          self.panel.hide();
        }
      },
      postrender: function () {
        var self = this;
        self.aria('haspopup', true);
        self.on('click', function (e) {
          if (e.control === self) {
            if (self.panel && self.panel.visible()) {
              self.hidepanel();
            } else {
              self.showpanel();
              self.panel.focus(!!e.aria);
            }
          }
        });
        return self._super();
      },
      remove: function () {
        if (this.panel) {
          this.panel.remove();
          this.panel = null;
        }
        return this._super();
      }
    });

    var dom = global$2.dom;
    var colorbutton = panelbutton.extend({
      init: function (settings) {
        this._super(settings);
        this.classes.add('splitbtn');
        this.classes.add('colorbutton');
      },
      color: function (color) {
        if (color) {
          this._color = color;
          this.getel('preview').style.backgroundcolor = color;
          return this;
        }
        return this._color;
      },
      resetcolor: function () {
        this._color = null;
        this.getel('preview').style.backgroundcolor = null;
        return this;
      },
      renderhtml: function () {
        var self = this, id = self._id, prefix = self.classprefix, text = self.state.get('text');
        var icon = self.settings.icon ? prefix + 'ico ' + prefix + 'i-' + self.settings.icon : '';
        var image = self.settings.image ? ' style="background-image: url(\'' + self.settings.image + '\')"' : '';
        var texthtml = '';
        if (text) {
          self.classes.add('btn-has-text');
          texthtml = '<span class="' + prefix + 'txt">' + self.encode(text) + '</span>';
        }
        return '<div id="' + id + '" class="' + self.classes + '" role="button" tabindex="-1" aria-haspopup="true">' + '<button role="presentation" hidefocus="1" type="button" tabindex="-1">' + (icon ? '<i class="' + icon + '"' + image + '></i>' : '') + '<span id="' + id + '-preview" class="' + prefix + 'preview"></span>' + texthtml + '</button>' + '<button type="button" class="' + prefix + 'open" hidefocus="1" tabindex="-1">' + ' <i class="' + prefix + 'caret"></i>' + '</button>' + '</div>';
      },
      postrender: function () {
        var self = this, onclickhandler = self.settings.onclick;
        self.on('click', function (e) {
          if (e.aria && e.aria.key === 'down') {
            return;
          }
          if (e.control === self && !dom.getparent(e.target, '.' + self.classprefix + 'open')) {
            e.stopimmediatepropagation();
            onclickhandler.call(self, e);
          }
        });
        delete self.settings.onclick;
        return self._super();
      }
    });

    var global$g = tinymce.util.tools.resolve('tinymce.util.color');

    var colorpicker = widget.extend({
      defaults: { classes: 'widget colorpicker' },
      init: function (settings) {
        this._super(settings);
      },
      postrender: function () {
        var self = this;
        var color = self.color();
        var hsv, huerootelm, huepointelm, svrootelm, svpointelm;
        huerootelm = self.getel('h');
        huepointelm = self.getel('hp');
        svrootelm = self.getel('sv');
        svpointelm = self.getel('svp');
        function getpos(elm, event) {
          var pos = funcs.getpos(elm);
          var x, y;
          x = event.pagex - pos.x;
          y = event.pagey - pos.y;
          x = math.max(0, math.min(x / elm.clientwidth, 1));
          y = math.max(0, math.min(y / elm.clientheight, 1));
          return {
            x: x,
            y: y
          };
        }
        function updatecolor(hsv, hueupdate) {
          var hue = (360 - hsv.h) / 360;
          funcs.css(huepointelm, { top: hue * 100 + '%' });
          if (!hueupdate) {
            funcs.css(svpointelm, {
              left: hsv.s + '%',
              top: 100 - hsv.v + '%'
            });
          }
          svrootelm.style.background = global$g({
            s: 100,
            v: 100,
            h: hsv.h
          }).tohex();
          self.color().parse({
            s: hsv.s,
            v: hsv.v,
            h: hsv.h
          });
        }
        function updatesaturationandvalue(e) {
          var pos;
          pos = getpos(svrootelm, e);
          hsv.s = pos.x * 100;
          hsv.v = (1 - pos.y) * 100;
          updatecolor(hsv);
          self.fire('change');
        }
        function updatehue(e) {
          var pos;
          pos = getpos(huerootelm, e);
          hsv = color.tohsv();
          hsv.h = (1 - pos.y) * 360;
          updatecolor(hsv, true);
          self.fire('change');
        }
        self._repaint = function () {
          hsv = color.tohsv();
          updatecolor(hsv);
        };
        self._super();
        self._svdraghelper = new draghelper(self._id + '-sv', {
          start: updatesaturationandvalue,
          drag: updatesaturationandvalue
        });
        self._hdraghelper = new draghelper(self._id + '-h', {
          start: updatehue,
          drag: updatehue
        });
        self._repaint();
      },
      rgb: function () {
        return this.color().torgb();
      },
      value: function (value) {
        var self = this;
        if (arguments.length) {
          self.color().parse(value);
          if (self._rendered) {
            self._repaint();
          }
        } else {
          return self.color().tohex();
        }
      },
      color: function () {
        if (!this._color) {
          this._color = global$g();
        }
        return this._color;
      },
      renderhtml: function () {
        var self = this;
        var id = self._id;
        var prefix = self.classprefix;
        var huehtml;
        var stops = '#ff0000,#ff0080,#ff00ff,#8000ff,#0000ff,#0080ff,#00ffff,#00ff80,#00ff00,#80ff00,#ffff00,#ff8000,#ff0000';
        function getoldiefallbackhtml() {
          var i, l, html = '', gradientprefix, stopslist;
          gradientprefix = 'filter:progid:dximagetransform.microsoft.gradient(gradienttype=0,startcolorstr=';
          stopslist = stops.split(',');
          for (i = 0, l = stopslist.length - 1; i < l; i++) {
            html += '<div class="' + prefix + 'colorpicker-h-chunk" style="' + 'height:' + 100 / l + '%;' + gradientprefix + stopslist[i] + ',endcolorstr=' + stopslist[i + 1] + ');' + '-ms-' + gradientprefix + stopslist[i] + ',endcolorstr=' + stopslist[i + 1] + ')' + '"></div>';
          }
          return html;
        }
        var gradientcsstext = 'background: -ms-linear-gradient(top,' + stops + ');' + 'background: linear-gradient(to bottom,' + stops + ');';
        huehtml = '<div id="' + id + '-h" class="' + prefix + 'colorpicker-h" style="' + gradientcsstext + '">' + getoldiefallbackhtml() + '<div id="' + id + '-hp" class="' + prefix + 'colorpicker-h-marker"></div>' + '</div>';
        return '<div id="' + id + '" class="' + self.classes + '">' + '<div id="' + id + '-sv" class="' + prefix + 'colorpicker-sv">' + '<div class="' + prefix + 'colorpicker-overlay1">' + '<div class="' + prefix + 'colorpicker-overlay2">' + '<div id="' + id + '-svp" class="' + prefix + 'colorpicker-selector1">' + '<div class="' + prefix + 'colorpicker-selector2"></div>' + '</div>' + '</div>' + '</div>' + '</div>' + huehtml + '</div>';
      }
    });

    var dropzone = widget.extend({
      init: function (settings) {
        var self = this;
        settings = global$4.extend({
          height: 100,
          text: 'drop an image here',
          multiple: false,
          accept: null
        }, settings);
        self._super(settings);
        self.classes.add('dropzone');
        if (settings.multiple) {
          self.classes.add('multiple');
        }
      },
      renderhtml: function () {
        var self = this;
        var attrs, elm;
        var cfg = self.settings;
        attrs = {
          id: self._id,
          hidefocus: '1'
        };
        elm = funcs.create('div', attrs, '<span>' + this.translate(cfg.text) + '</span>');
        if (cfg.height) {
          funcs.css(elm, 'height', cfg.height + 'px');
        }
        if (cfg.width) {
          funcs.css(elm, 'width', cfg.width + 'px');
        }
        elm.classname = self.classes;
        return elm.outerhtml;
      },
      postrender: function () {
        var self = this;
        var toggledragclass = function (e) {
          e.preventdefault();
          self.classes.toggle('dragenter');
          self.getel().classname = self.classes;
        };
        var filter = function (files) {
          var accept = self.settings.accept;
          if (typeof accept !== 'string') {
            return files;
          }
          var re = new regexp('(' + accept.split(/\s*,\s*/).join('|') + ')$', 'i');
          return global$4.grep(files, function (file) {
            return re.test(file.name);
          });
        };
        self._super();
        self.$el.on('dragover', function (e) {
          e.preventdefault();
        });
        self.$el.on('dragenter', toggledragclass);
        self.$el.on('dragleave', toggledragclass);
        self.$el.on('drop', function (e) {
          e.preventdefault();
          if (self.state.get('disabled')) {
            return;
          }
          var files = filter(e.datatransfer.files);
          self.value = function () {
            if (!files.length) {
              return null;
            } else if (self.settings.multiple) {
              return files;
            } else {
              return files[0];
            }
          };
          if (files.length) {
            self.fire('change', e);
          }
        });
      },
      remove: function () {
        this.$el.off();
        this._super();
      }
    });

    var path = widget.extend({
      init: function (settings) {
        var self = this;
        if (!settings.delimiter) {
          settings.delimiter = '\xbb';
        }
        self._super(settings);
        self.classes.add('path');
        self.canfocus = true;
        self.on('click', function (e) {
          var index;
          var target = e.target;
          if (index = target.getattribute('data-index')) {
            self.fire('select', {
              value: self.row()[index],
              index: index
            });
          }
        });
        self.row(self.settings.row);
      },
      focus: function () {
        var self = this;
        self.getel().firstchild.focus();
        return self;
      },
      row: function (row) {
        if (!arguments.length) {
          return this.state.get('row');
        }
        this.state.set('row', row);
        return this;
      },
      renderhtml: function () {
        var self = this;
        return '<div id="' + self._id + '" class="' + self.classes + '">' + self._getdatapathhtml(self.state.get('row')) + '</div>';
      },
      bindstates: function () {
        var self = this;
        self.state.on('change:row', function (e) {
          self.innerhtml(self._getdatapathhtml(e.value));
        });
        return self._super();
      },
      _getdatapathhtml: function (data) {
        var self = this;
        var parts = data || [];
        var i, l, html = '';
        var prefix = self.classprefix;
        for (i = 0, l = parts.length; i < l; i++) {
          html += (i > 0 ? '<div class="' + prefix + 'divider" aria-hidden="true"> ' + self.settings.delimiter + ' </div>' : '') + '<div role="button" class="' + prefix + 'path-item' + (i === l - 1 ? ' ' + prefix + 'last' : '') + '" data-index="' + i + '" tabindex="-1" id="' + self._id + '-' + i + '" aria-level="' + (i + 1) + '">' + parts[i].name + '</div>';
        }
        if (!html) {
          html = '<div class="' + prefix + 'path-item">\xa0</div>';
        }
        return html;
      }
    });

    var elementpath = path.extend({
      postrender: function () {
        var self = this, editor = self.settings.editor;
        function ishidden(elm) {
          if (elm.nodetype === 1) {
            if (elm.nodename === 'br' || !!elm.getattribute('data-mce-bogus')) {
              return true;
            }
            if (elm.getattribute('data-mce-type') === 'bookmark') {
              return true;
            }
          }
          return false;
        }
        if (editor.settings.elementpath !== false) {
          self.on('select', function (e) {
            editor.focus();
            editor.selection.select(this.row()[e.index].element);
            editor.nodechanged();
          });
          editor.on('nodechange', function (e) {
            var outparents = [];
            var parents = e.parents;
            var i = parents.length;
            while (i--) {
              if (parents[i].nodetype === 1 && !ishidden(parents[i])) {
                var args = editor.fire('resolvename', {
                  name: parents[i].nodename.tolowercase(),
                  target: parents[i]
                });
                if (!args.isdefaultprevented()) {
                  outparents.push({
                    name: args.name,
                    element: parents[i]
                  });
                }
                if (args.ispropagationstopped()) {
                  break;
                }
              }
            }
            self.row(outparents);
          });
        }
        return self._super();
      }
    });

    var formitem = container.extend({
      defaults: {
        layout: 'flex',
        align: 'center',
        defaults: { flex: 1 }
      },
      renderhtml: function () {
        var self = this, layout = self._layout, prefix = self.classprefix;
        self.classes.add('formitem');
        layout.prerender(self);
        return '<div id="' + self._id + '" class="' + self.classes + '" hidefocus="1" tabindex="-1">' + (self.settings.title ? '<div id="' + self._id + '-title" class="' + prefix + 'title">' + self.settings.title + '</div>' : '') + '<div id="' + self._id + '-body" class="' + self.bodyclasses + '">' + (self.settings.html || '') + layout.renderhtml(self) + '</div>' + '</div>';
      }
    });

    var form = container.extend({
      defaults: {
        containercls: 'form',
        layout: 'flex',
        direction: 'column',
        align: 'stretch',
        flex: 1,
        padding: 15,
        labelgap: 30,
        spacing: 10,
        callbacks: {
          submit: function () {
            this.submit();
          }
        }
      },
      prerender: function () {
        var self = this, items = self.items();
        if (!self.settings.formitemdefaults) {
          self.settings.formitemdefaults = {
            layout: 'flex',
            autoresize: 'overflow',
            defaults: { flex: 1 }
          };
        }
        items.each(function (ctrl) {
          var formitem;
          var label = ctrl.settings.label;
          if (label) {
            formitem = new formitem(global$4.extend({
              items: {
                type: 'label',
                id: ctrl._id + '-l',
                text: label,
                flex: 0,
                forid: ctrl._id,
                disabled: ctrl.disabled()
              }
            }, self.settings.formitemdefaults));
            formitem.type = 'formitem';
            ctrl.aria('labelledby', ctrl._id + '-l');
            if (typeof ctrl.settings.flex === 'undefined') {
              ctrl.settings.flex = 1;
            }
            self.replace(ctrl, formitem);
            formitem.add(ctrl);
          }
        });
      },
      submit: function () {
        return this.fire('submit', { data: this.tojson() });
      },
      postrender: function () {
        var self = this;
        self._super();
        self.fromjson(self.settings.data);
      },
      bindstates: function () {
        var self = this;
        self._super();
        function recalclabels() {
          var maxlabelwidth = 0;
          var labels = [];
          var i, labelgap, items;
          if (self.settings.labelgapcalc === false) {
            return;
          }
          if (self.settings.labelgapcalc === 'children') {
            items = self.find('formitem');
          } else {
            items = self.items();
          }
          items.filter('formitem').each(function (item) {
            var labelctrl = item.items()[0], labelwidth = labelctrl.getel().clientwidth;
            maxlabelwidth = labelwidth > maxlabelwidth ? labelwidth : maxlabelwidth;
            labels.push(labelctrl);
          });
          labelgap = self.settings.labelgap || 0;
          i = labels.length;
          while (i--) {
            labels[i].settings.minwidth = maxlabelwidth + labelgap;
          }
        }
        self.on('show', recalclabels);
        recalclabels();
      }
    });

    var fieldset = form.extend({
      defaults: {
        containercls: 'fieldset',
        layout: 'flex',
        direction: 'column',
        align: 'stretch',
        flex: 1,
        padding: '25 15 5 15',
        labelgap: 30,
        spacing: 10,
        border: 1
      },
      renderhtml: function () {
        var self = this, layout = self._layout, prefix = self.classprefix;
        self.prerender();
        layout.prerender(self);
        return '<fieldset id="' + self._id + '" class="' + self.classes + '" hidefocus="1" tabindex="-1">' + (self.settings.title ? '<legend id="' + self._id + '-title" class="' + prefix + 'fieldset-title">' + self.settings.title + '</legend>' : '') + '<div id="' + self._id + '-body" class="' + self.bodyclasses + '">' + (self.settings.html || '') + layout.renderhtml(self) + '</div>' + '</fieldset>';
      }
    });

    var unique$1 = 0;
    var generate = function (prefix) {
      var date = new date();
      var time = date.gettime();
      var random = math.floor(math.random() * 1000000000);
      unique$1++;
      return prefix + '_' + random + unique$1 + string(time);
    };

    var fromhtml = function (html, scope) {
      var doc = scope || domglobals.document;
      var div = doc.createelement('div');
      div.innerhtml = html;
      if (!div.haschildnodes() || div.childnodes.length > 1) {
        domglobals.console.error('html does not have a single root node', html);
        throw new error('html must have a single root node');
      }
      return fromdom(div.childnodes[0]);
    };
    var fromtag = function (tag, scope) {
      var doc = scope || domglobals.document;
      var node = doc.createelement(tag);
      return fromdom(node);
    };
    var fromtext = function (text, scope) {
      var doc = scope || domglobals.document;
      var node = doc.createtextnode(text);
      return fromdom(node);
    };
    var fromdom = function (node) {
      if (node === null || node === undefined) {
        throw new error('node cannot be null or undefined');
      }
      return { dom: constant(node) };
    };
    var frompoint = function (docelm, x, y) {
      var doc = docelm.dom();
      return option.from(doc.elementfrompoint(x, y)).map(fromdom);
    };
    var element = {
      fromhtml: fromhtml,
      fromtag: fromtag,
      fromtext: fromtext,
      fromdom: fromdom,
      frompoint: frompoint
    };

    var cached = function (f) {
      var called = false;
      var r;
      return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (!called) {
          called = true;
          r = f.apply(null, args);
        }
        return r;
      };
    };

    var attribute = domglobals.node.attribute_node;
    var cdata_section = domglobals.node.cdata_section_node;
    var comment = domglobals.node.comment_node;
    var document = domglobals.node.document_node;
    var document_type = domglobals.node.document_type_node;
    var document_fragment = domglobals.node.document_fragment_node;
    var element = domglobals.node.element_node;
    var text = domglobals.node.text_node;
    var processing_instruction = domglobals.node.processing_instruction_node;
    var entity_reference = domglobals.node.entity_reference_node;
    var entity = domglobals.node.entity_node;
    var notation = domglobals.node.notation_node;

    var immutable = function () {
      var fields = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        fields[_i] = arguments[_i];
      }
      return function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          values[_i] = arguments[_i];
        }
        if (fields.length !== values.length) {
          throw new error('wrong number of arguments to struct. expected "[' + fields.length + ']", got ' + values.length + ' arguments');
        }
        var struct = {};
        each(fields, function (name, i) {
          struct[name] = constant(values[i]);
        });
        return struct;
      };
    };

    var node = function () {
      var f = global$1.getordie('node');
      return f;
    };
    var comparedocumentposition = function (a, b, match) {
      return (a.comparedocumentposition(b) & match) !== 0;
    };
    var documentpositionpreceding = function (a, b) {
      return comparedocumentposition(a, b, node().document_position_preceding);
    };
    var documentpositioncontainedby = function (a, b) {
      return comparedocumentposition(a, b, node().document_position_contained_by);
    };
    var node = {
      documentpositionpreceding: documentpositionpreceding,
      documentpositioncontainedby: documentpositioncontainedby
    };

    var firstmatch = function (regexes, s) {
      for (var i = 0; i < regexes.length; i++) {
        var x = regexes[i];
        if (x.test(s)) {
          return x;
        }
      }
      return undefined;
    };
    var find$1 = function (regexes, agent) {
      var r = firstmatch(regexes, agent);
      if (!r) {
        return {
          major: 0,
          minor: 0
        };
      }
      var group = function (i) {
        return number(agent.replace(r, '$' + i));
      };
      return nu(group(1), group(2));
    };
    var detect = function (versionregexes, agent) {
      var cleanedagent = string(agent).tolowercase();
      if (versionregexes.length === 0) {
        return unknown();
      }
      return find$1(versionregexes, cleanedagent);
    };
    var unknown = function () {
      return nu(0, 0);
    };
    var nu = function (major, minor) {
      return {
        major: major,
        minor: minor
      };
    };
    var version = {
      nu: nu,
      detect: detect,
      unknown: unknown
    };

    var edge = 'edge';
    var chrome = 'chrome';
    var ie = 'ie';
    var opera = 'opera';
    var firefox = 'firefox';
    var safari = 'safari';
    var isbrowser = function (name, current) {
      return function () {
        return current === name;
      };
    };
    var unknown$1 = function () {
      return nu$1({
        current: undefined,
        version: version.unknown()
      });
    };
    var nu$1 = function (info) {
      var current = info.current;
      var version = info.version;
      return {
        current: current,
        version: version,
        isedge: isbrowser(edge, current),
        ischrome: isbrowser(chrome, current),
        isie: isbrowser(ie, current),
        isopera: isbrowser(opera, current),
        isfirefox: isbrowser(firefox, current),
        issafari: isbrowser(safari, current)
      };
    };
    var browser = {
      unknown: unknown$1,
      nu: nu$1,
      edge: constant(edge),
      chrome: constant(chrome),
      ie: constant(ie),
      opera: constant(opera),
      firefox: constant(firefox),
      safari: constant(safari)
    };

    var windows$1 = 'windows';
    var ios = 'ios';
    var android = 'android';
    var linux = 'linux';
    var osx = 'osx';
    var solaris = 'solaris';
    var freebsd = 'freebsd';
    var isos = function (name, current) {
      return function () {
        return current === name;
      };
    };
    var unknown$2 = function () {
      return nu$2({
        current: undefined,
        version: version.unknown()
      });
    };
    var nu$2 = function (info) {
      var current = info.current;
      var version = info.version;
      return {
        current: current,
        version: version,
        iswindows: isos(windows$1, current),
        isios: isos(ios, current),
        isandroid: isos(android, current),
        isosx: isos(osx, current),
        islinux: isos(linux, current),
        issolaris: isos(solaris, current),
        isfreebsd: isos(freebsd, current)
      };
    };
    var operatingsystem = {
      unknown: unknown$2,
      nu: nu$2,
      windows: constant(windows$1),
      ios: constant(ios),
      android: constant(android),
      linux: constant(linux),
      osx: constant(osx),
      solaris: constant(solaris),
      freebsd: constant(freebsd)
    };

    var devicetype = function (os, browser, useragent) {
      var isipad = os.isios() && /ipad/i.test(useragent) === true;
      var isiphone = os.isios() && !isipad;
      var isandroid3 = os.isandroid() && os.version.major === 3;
      var isandroid4 = os.isandroid() && os.version.major === 4;
      var istablet = isipad || isandroid3 || isandroid4 && /mobile/i.test(useragent) === true;
      var istouch = os.isios() || os.isandroid();
      var isphone = istouch && !istablet;
      var ioswebview = browser.issafari() && os.isios() && /safari/i.test(useragent) === false;
      return {
        isipad: constant(isipad),
        isiphone: constant(isiphone),
        istablet: constant(istablet),
        isphone: constant(isphone),
        istouch: constant(istouch),
        isandroid: os.isandroid,
        isios: os.isios,
        iswebview: constant(ioswebview)
      };
    };

    var detect$1 = function (candidates, useragent) {
      var agent = string(useragent).tolowercase();
      return find(candidates, function (candidate) {
        return candidate.search(agent);
      });
    };
    var detectbrowser = function (browsers, useragent) {
      return detect$1(browsers, useragent).map(function (browser) {
        var version = version.detect(browser.versionregexes, useragent);
        return {
          current: browser.name,
          version: version
        };
      });
    };
    var detectos = function (oses, useragent) {
      return detect$1(oses, useragent).map(function (os) {
        var version = version.detect(os.versionregexes, useragent);
        return {
          current: os.name,
          version: version
        };
      });
    };
    var uastring = {
      detectbrowser: detectbrowser,
      detectos: detectos
    };

    var contains = function (str, substr) {
      return str.indexof(substr) !== -1;
    };

    var normalversionregex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;
    var checkcontains = function (target) {
      return function (uastring) {
        return contains(uastring, target);
      };
    };
    var browsers = [
      {
        name: 'edge',
        versionregexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
        search: function (uastring) {
          return contains(uastring, 'edge/') && contains(uastring, 'chrome') && contains(uastring, 'safari') && contains(uastring, 'applewebkit');
        }
      },
      {
        name: 'chrome',
        versionregexes: [
          /.*?chrome\/([0-9]+)\.([0-9]+).*/,
          normalversionregex
        ],
        search: function (uastring) {
          return contains(uastring, 'chrome') && !contains(uastring, 'chromeframe');
        }
      },
      {
        name: 'ie',
        versionregexes: [
          /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
          /.*?rv:([0-9]+)\.([0-9]+).*/
        ],
        search: function (uastring) {
          return contains(uastring, 'msie') || contains(uastring, 'trident');
        }
      },
      {
        name: 'opera',
        versionregexes: [
          normalversionregex,
          /.*?opera\/([0-9]+)\.([0-9]+).*/
        ],
        search: checkcontains('opera')
      },
      {
        name: 'firefox',
        versionregexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
        search: checkcontains('firefox')
      },
      {
        name: 'safari',
        versionregexes: [
          normalversionregex,
          /.*?cpu os ([0-9]+)_([0-9]+).*/
        ],
        search: function (uastring) {
          return (contains(uastring, 'safari') || contains(uastring, 'mobile/')) && contains(uastring, 'applewebkit');
        }
      }
    ];
    var oses = [
      {
        name: 'windows',
        search: checkcontains('win'),
        versionregexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
      },
      {
        name: 'ios',
        search: function (uastring) {
          return contains(uastring, 'iphone') || contains(uastring, 'ipad');
        },
        versionregexes: [
          /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
          /.*cpu os ([0-9]+)_([0-9]+).*/,
          /.*cpu iphone os ([0-9]+)_([0-9]+).*/
        ]
      },
      {
        name: 'android',
        search: checkcontains('android'),
        versionregexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
      },
      {
        name: 'osx',
        search: checkcontains('os x'),
        versionregexes: [/.*?os\ x\ ?([0-9]+)_([0-9]+).*/]
      },
      {
        name: 'linux',
        search: checkcontains('linux'),
        versionregexes: []
      },
      {
        name: 'solaris',
        search: checkcontains('sunos'),
        versionregexes: []
      },
      {
        name: 'freebsd',
        search: checkcontains('freebsd'),
        versionregexes: []
      }
    ];
    var platforminfo = {
      browsers: constant(browsers),
      oses: constant(oses)
    };

    var detect$2 = function (useragent) {
      var browsers = platforminfo.browsers();
      var oses = platforminfo.oses();
      var browser = uastring.detectbrowser(browsers, useragent).fold(browser.unknown, browser.nu);
      var os = uastring.detectos(oses, useragent).fold(operatingsystem.unknown, operatingsystem.nu);
      var devicetype = devicetype(os, browser, useragent);
      return {
        browser: browser,
        os: os,
        devicetype: devicetype
      };
    };
    var platformdetection = { detect: detect$2 };

    var detect$3 = cached(function () {
      var useragent = domglobals.navigator.useragent;
      return platformdetection.detect(useragent);
    });
    var platformdetection$1 = { detect: detect$3 };

    var element$1 = element;
    var document$1 = document;
    var bypassselector = function (dom) {
      return dom.nodetype !== element$1 && dom.nodetype !== document$1 || dom.childelementcount === 0;
    };
    var all = function (selector, scope) {
      var base = scope === undefined ? domglobals.document : scope.dom();
      return bypassselector(base) ? [] : map(base.queryselectorall(selector), element.fromdom);
    };
    var one = function (selector, scope) {
      var base = scope === undefined ? domglobals.document : scope.dom();
      return bypassselector(base) ? option.none() : option.from(base.queryselector(selector)).map(element.fromdom);
    };

    var regularcontains = function (e1, e2) {
      var d1 = e1.dom();
      var d2 = e2.dom();
      return d1 === d2 ? false : d1.contains(d2);
    };
    var iecontains = function (e1, e2) {
      return node.documentpositioncontainedby(e1.dom(), e2.dom());
    };
    var browser = platformdetection$1.detect().browser;
    var contains$1 = browser.isie() ? iecontains : regularcontains;

    var spot = immutable('element', 'offset');

    var descendants = function (scope, selector) {
      return all(selector, scope);
    };

    var trim = global$4.trim;
    var hascontenteditablestate = function (value) {
      return function (node) {
        if (node && node.nodetype === 1) {
          if (node.contenteditable === value) {
            return true;
          }
          if (node.getattribute('data-mce-contenteditable') === value) {
            return true;
          }
        }
        return false;
      };
    };
    var iscontenteditabletrue = hascontenteditablestate('true');
    var iscontenteditablefalse = hascontenteditablestate('false');
    var create$4 = function (type, title, url, level, attach) {
      return {
        type: type,
        title: title,
        url: url,
        level: level,
        attach: attach
      };
    };
    var ischildofcontenteditabletrue = function (node) {
      while (node = node.parentnode) {
        var value = node.contenteditable;
        if (value && value !== 'inherit') {
          return iscontenteditabletrue(node);
        }
      }
      return false;
    };
    var select = function (selector, root) {
      return map(descendants(element.fromdom(root), selector), function (element) {
        return element.dom();
      });
    };
    var getelementtext = function (elm) {
      return elm.innertext || elm.textcontent;
    };
    var getorgenerateid = function (elm) {
      return elm.id ? elm.id : generate('h');
    };
    var isanchor = function (elm) {
      return elm && elm.nodename === 'a' && (elm.id || elm.name);
    };
    var isvalidanchor = function (elm) {
      return isanchor(elm) && iseditable(elm);
    };
    var isheader = function (elm) {
      return elm && /^(h[1-6])$/.test(elm.nodename);
    };
    var iseditable = function (elm) {
      return ischildofcontenteditabletrue(elm) && !iscontenteditablefalse(elm);
    };
    var isvalidheader = function (elm) {
      return isheader(elm) && iseditable(elm);
    };
    var getlevel = function (elm) {
      return isheader(elm) ? parseint(elm.nodename.substr(1), 10) : 0;
    };
    var headertarget = function (elm) {
      var headerid = getorgenerateid(elm);
      var attach = function () {
        elm.id = headerid;
      };
      return create$4('header', getelementtext(elm), '#' + headerid, getlevel(elm), attach);
    };
    var anchortarget = function (elm) {
      var anchorid = elm.id || elm.name;
      var anchortext = getelementtext(elm);
      return create$4('anchor', anchortext ? anchortext : '#' + anchorid, '#' + anchorid, 0, noop);
    };
    var getheadertargets = function (elms) {
      return map(filter(elms, isvalidheader), headertarget);
    };
    var getanchortargets = function (elms) {
      return map(filter(elms, isvalidanchor), anchortarget);
    };
    var gettargetelements = function (elm) {
      var elms = select('h1,h2,h3,h4,h5,h6,a:not([href])', elm);
      return elms;
    };
    var hastitle = function (target) {
      return trim(target.title).length > 0;
    };
    var find$2 = function (elm) {
      var elms = gettargetelements(elm);
      return filter(getheadertargets(elms).concat(getanchortargets(elms)), hastitle);
    };
    var linktargets = { find: find$2 };

    var getactiveeditor = function () {
      return window.tinymce ? window.tinymce.activeeditor : global$5.activeeditor;
    };
    var history = {};
    var history_length = 5;
    var clearhistory = function () {
      history = {};
    };
    var tomenuitem = function (target) {
      return {
        title: target.title,
        value: {
          title: { raw: target.title },
          url: target.url,
          attach: target.attach
        }
      };
    };
    var tomenuitems = function (targets) {
      return global$4.map(targets, tomenuitem);
    };
    var staticmenuitem = function (title, url) {
      return {
        title: title,
        value: {
          title: title,
          url: url,
          attach: noop
        }
      };
    };
    var isuniqueurl = function (url, targets) {
      var foundtarget = exists(targets, function (target) {
        return target.url === url;
      });
      return !foundtarget;
    };
    var getsetting = function (editorsettings, name, defaultvalue) {
      var value = name in editorsettings ? editorsettings[name] : defaultvalue;
      return value === false ? null : value;
    };
    var createmenuitems = function (term, targets, filetype, editorsettings) {
      var separator = { title: '-' };
      var fromhistorymenuitems = function (history) {
        var historyitems = history.hasownproperty(filetype) ? history[filetype] : [];
        var uniquehistory = filter(historyitems, function (url) {
          return isuniqueurl(url, targets);
        });
        return global$4.map(uniquehistory, function (url) {
          return {
            title: url,
            value: {
              title: url,
              url: url,
              attach: noop
            }
          };
        });
      };
      var frommenuitems = function (type) {
        var filteredtargets = filter(targets, function (target) {
          return target.type === type;
        });
        return tomenuitems(filteredtargets);
      };
      var anchormenuitems = function () {
        var anchormenuitems = frommenuitems('anchor');
        var topanchor = getsetting(editorsettings, 'anchor_top', '#top');
        var bottomachor = getsetting(editorsettings, 'anchor_bottom', '#bottom');
        if (topanchor !== null) {
          anchormenuitems.unshift(staticmenuitem('<top>', topanchor));
        }
        if (bottomachor !== null) {
          anchormenuitems.push(staticmenuitem('<bottom>', bottomachor));
        }
        return anchormenuitems;
      };
      var join = function (items) {
        return foldl(items, function (a, b) {
          var bothempty = a.length === 0 || b.length === 0;
          return bothempty ? a.concat(b) : a.concat(separator, b);
        }, []);
      };
      if (editorsettings.typeahead_urls === false) {
        return [];
      }
      return filetype === 'file' ? join([
        filterbyquery(term, fromhistorymenuitems(history)),
        filterbyquery(term, frommenuitems('header')),
        filterbyquery(term, anchormenuitems())
      ]) : filterbyquery(term, fromhistorymenuitems(history));
    };
    var addtohistory = function (url, filetype) {
      var items = history[filetype];
      if (!/^https?/.test(url)) {
        return;
      }
      if (items) {
        if (indexof(items, url).isnone()) {
          history[filetype] = items.slice(0, history_length).concat(url);
        }
      } else {
        history[filetype] = [url];
      }
    };
    var filterbyquery = function (term, menuitems) {
      var lowercaseterm = term.tolowercase();
      var result = global$4.grep(menuitems, function (item) {
        return item.title.tolowercase().indexof(lowercaseterm) !== -1;
      });
      return result.length === 1 && result[0].title === term ? [] : result;
    };
    var gettitle = function (linkdetails) {
      var title = linkdetails.title;
      return title.raw ? title.raw : title;
    };
    var setupautocompletehandler = function (ctrl, editorsettings, bodyelm, filetype) {
      var autocomplete = function (term) {
        var linktargets = linktargets.find(bodyelm);
        var menuitems = createmenuitems(term, linktargets, filetype, editorsettings);
        ctrl.showautocomplete(menuitems, term);
      };
      ctrl.on('autocomplete', function () {
        autocomplete(ctrl.value());
      });
      ctrl.on('selectitem', function (e) {
        var linkdetails = e.value;
        ctrl.value(linkdetails.url);
        var title = gettitle(linkdetails);
        if (filetype === 'image') {
          ctrl.fire('change', {
            meta: {
              alt: title,
              attach: linkdetails.attach
            }
          });
        } else {
          ctrl.fire('change', {
            meta: {
              text: title,
              attach: linkdetails.attach
            }
          });
        }
        ctrl.focus();
      });
      ctrl.on('click', function (e) {
        if (ctrl.value().length === 0 && e.target.nodename === 'input') {
          autocomplete('');
        }
      });
      ctrl.on('postrender', function () {
        ctrl.getroot().on('submit', function (e) {
          if (!e.isdefaultprevented()) {
            addtohistory(ctrl.value(), filetype);
          }
        });
      });
    };
    var statustouistate = function (result) {
      var status = result.status, message = result.message;
      if (status === 'valid') {
        return {
          status: 'ok',
          message: message
        };
      } else if (status === 'unknown') {
        return {
          status: 'warn',
          message: message
        };
      } else if (status === 'invalid') {
        return {
          status: 'warn',
          message: message
        };
      } else {
        return {
          status: 'none',
          message: ''
        };
      }
    };
    var setuplinkvalidatorhandler = function (ctrl, editorsettings, filetype) {
      var validatorhandler = editorsettings.filepicker_validator_handler;
      if (validatorhandler) {
        var validateurl_1 = function (url) {
          if (url.length === 0) {
            ctrl.statuslevel('none');
            return;
          }
          validatorhandler({
            url: url,
            type: filetype
          }, function (result) {
            var uistate = statustouistate(result);
            ctrl.statusmessage(uistate.message);
            ctrl.statuslevel(uistate.status);
          });
        };
        ctrl.state.on('change:value', function (e) {
          validateurl_1(e.value);
        });
      }
    };
    var filepicker = combobox.extend({
      statics: { clearhistory: clearhistory },
      init: function (settings) {
        var self = this, editor = getactiveeditor(), editorsettings = editor.settings;
        var actioncallback, filebrowsercallback, filebrowsercallbacktypes;
        var filetype = settings.filetype;
        settings.spellcheck = false;
        filebrowsercallbacktypes = editorsettings.file_picker_types || editorsettings.file_browser_callback_types;
        if (filebrowsercallbacktypes) {
          filebrowsercallbacktypes = global$4.makemap(filebrowsercallbacktypes, /[, ]/);
        }
        if (!filebrowsercallbacktypes || filebrowsercallbacktypes[filetype]) {
          filebrowsercallback = editorsettings.file_picker_callback;
          if (filebrowsercallback && (!filebrowsercallbacktypes || filebrowsercallbacktypes[filetype])) {
            actioncallback = function () {
              var meta = self.fire('beforecall').meta;
              meta = global$4.extend({ filetype: filetype }, meta);
              filebrowsercallback.call(editor, function (value, meta) {
                self.value(value).fire('change', { meta: meta });
              }, self.value(), meta);
            };
          } else {
            filebrowsercallback = editorsettings.file_browser_callback;
            if (filebrowsercallback && (!filebrowsercallbacktypes || filebrowsercallbacktypes[filetype])) {
              actioncallback = function () {
                filebrowsercallback(self.getel('inp').id, self.value(), filetype, window);
              };
            }
          }
        }
        if (actioncallback) {
          settings.icon = 'browse';
          settings.onaction = actioncallback;
        }
        self._super(settings);
        self.classes.add('filepicker');
        setupautocompletehandler(self, editorsettings, editor.getbody(), filetype);
        setuplinkvalidatorhandler(self, editorsettings, filetype);
      }
    });

    var fitlayout = absolutelayout.extend({
      recalc: function (container) {
        var contlayoutrect = container.layoutrect(), paddingbox = container.paddingbox;
        container.items().filter(':visible').each(function (ctrl) {
          ctrl.layoutrect({
            x: paddingbox.left,
            y: paddingbox.top,
            w: contlayoutrect.innerw - paddingbox.right - paddingbox.left,
            h: contlayoutrect.innerh - paddingbox.top - paddingbox.bottom
          });
          if (ctrl.recalc) {
            ctrl.recalc();
          }
        });
      }
    });

    var flexlayout = absolutelayout.extend({
      recalc: function (container) {
        var i, l, items, contlayoutrect, contpaddingbox, contsettings, align, pack, spacing, totalflex, availablespace, direction;
        var ctrl, ctrllayoutrect, ctrlsettings, flex;
        var maxsizeitems = [];
        var size, maxsize, ratio, rect, pos, maxalignendpos;
        var sizename, minsizename, posname, maxsizename, beforename, innersizename, deltasizename, contentsizename;
        var alignaxisname, aligninnersizename, alignsizename, alignminsizename, alignbeforename, alignaftername;
        var aligndeltasizename, aligncontentsizename;
        var max = math.max, min = math.min;
        items = container.items().filter(':visible');
        contlayoutrect = container.layoutrect();
        contpaddingbox = container.paddingbox;
        contsettings = container.settings;
        direction = container.isrtl() ? contsettings.direction || 'row-reversed' : contsettings.direction;
        align = contsettings.align;
        pack = container.isrtl() ? contsettings.pack || 'end' : contsettings.pack;
        spacing = contsettings.spacing || 0;
        if (direction === 'row-reversed' || direction === 'column-reverse') {
          items = items.set(items.toarray().reverse());
          direction = direction.split('-')[0];
        }
        if (direction === 'column') {
          posname = 'y';
          sizename = 'h';
          minsizename = 'minh';
          maxsizename = 'maxh';
          innersizename = 'innerh';
          beforename = 'top';
          deltasizename = 'deltah';
          contentsizename = 'contenth';
          alignbeforename = 'left';
          alignsizename = 'w';
          alignaxisname = 'x';
          aligninnersizename = 'innerw';
          alignminsizename = 'minw';
          alignaftername = 'right';
          aligndeltasizename = 'deltaw';
          aligncontentsizename = 'contentw';
        } else {
          posname = 'x';
          sizename = 'w';
          minsizename = 'minw';
          maxsizename = 'maxw';
          innersizename = 'innerw';
          beforename = 'left';
          deltasizename = 'deltaw';
          contentsizename = 'contentw';
          alignbeforename = 'top';
          alignsizename = 'h';
          alignaxisname = 'y';
          aligninnersizename = 'innerh';
          alignminsizename = 'minh';
          alignaftername = 'bottom';
          aligndeltasizename = 'deltah';
          aligncontentsizename = 'contenth';
        }
        availablespace = contlayoutrect[innersizename] - contpaddingbox[beforename] - contpaddingbox[beforename];
        maxalignendpos = totalflex = 0;
        for (i = 0, l = items.length; i < l; i++) {
          ctrl = items[i];
          ctrllayoutrect = ctrl.layoutrect();
          ctrlsettings = ctrl.settings;
          flex = ctrlsettings.flex;
          availablespace -= i < l - 1 ? spacing : 0;
          if (flex > 0) {
            totalflex += flex;
            if (ctrllayoutrect[maxsizename]) {
              maxsizeitems.push(ctrl);
            }
            ctrllayoutrect.flex = flex;
          }
          availablespace -= ctrllayoutrect[minsizename];
          size = contpaddingbox[alignbeforename] + ctrllayoutrect[alignminsizename] + contpaddingbox[alignaftername];
          if (size > maxalignendpos) {
            maxalignendpos = size;
          }
        }
        rect = {};
        if (availablespace < 0) {
          rect[minsizename] = contlayoutrect[minsizename] - availablespace + contlayoutrect[deltasizename];
        } else {
          rect[minsizename] = contlayoutrect[innersizename] - availablespace + contlayoutrect[deltasizename];
        }
        rect[alignminsizename] = maxalignendpos + contlayoutrect[aligndeltasizename];
        rect[contentsizename] = contlayoutrect[innersizename] - availablespace;
        rect[aligncontentsizename] = maxalignendpos;
        rect.minw = min(rect.minw, contlayoutrect.maxw);
        rect.minh = min(rect.minh, contlayoutrect.maxh);
        rect.minw = max(rect.minw, contlayoutrect.startminwidth);
        rect.minh = max(rect.minh, contlayoutrect.startminheight);
        if (contlayoutrect.autoresize && (rect.minw !== contlayoutrect.minw || rect.minh !== contlayoutrect.minh)) {
          rect.w = rect.minw;
          rect.h = rect.minh;
          container.layoutrect(rect);
          this.recalc(container);
          if (container._lastrect === null) {
            var parentctrl = container.parent();
            if (parentctrl) {
              parentctrl._lastrect = null;
              parentctrl.recalc();
            }
          }
          return;
        }
        ratio = availablespace / totalflex;
        for (i = 0, l = maxsizeitems.length; i < l; i++) {
          ctrl = maxsizeitems[i];
          ctrllayoutrect = ctrl.layoutrect();
          maxsize = ctrllayoutrect[maxsizename];
          size = ctrllayoutrect[minsizename] + ctrllayoutrect.flex * ratio;
          if (size > maxsize) {
            availablespace -= ctrllayoutrect[maxsizename] - ctrllayoutrect[minsizename];
            totalflex -= ctrllayoutrect.flex;
            ctrllayoutrect.flex = 0;
            ctrllayoutrect.maxflexsize = maxsize;
          } else {
            ctrllayoutrect.maxflexsize = 0;
          }
        }
        ratio = availablespace / totalflex;
        pos = contpaddingbox[beforename];
        rect = {};
        if (totalflex === 0) {
          if (pack === 'end') {
            pos = availablespace + contpaddingbox[beforename];
          } else if (pack === 'center') {
            pos = math.round(contlayoutrect[innersizename] / 2 - (contlayoutrect[innersizename] - availablespace) / 2) + contpaddingbox[beforename];
            if (pos < 0) {
              pos = contpaddingbox[beforename];
            }
          } else if (pack === 'justify') {
            pos = contpaddingbox[beforename];
            spacing = math.floor(availablespace / (items.length - 1));
          }
        }
        rect[alignaxisname] = contpaddingbox[alignbeforename];
        for (i = 0, l = items.length; i < l; i++) {
          ctrl = items[i];
          ctrllayoutrect = ctrl.layoutrect();
          size = ctrllayoutrect.maxflexsize || ctrllayoutrect[minsizename];
          if (align === 'center') {
            rect[alignaxisname] = math.round(contlayoutrect[aligninnersizename] / 2 - ctrllayoutrect[alignsizename] / 2);
          } else if (align === 'stretch') {
            rect[alignsizename] = max(ctrllayoutrect[alignminsizename] || 0, contlayoutrect[aligninnersizename] - contpaddingbox[alignbeforename] - contpaddingbox[alignaftername]);
            rect[alignaxisname] = contpaddingbox[alignbeforename];
          } else if (align === 'end') {
            rect[alignaxisname] = contlayoutrect[aligninnersizename] - ctrllayoutrect[alignsizename] - contpaddingbox.top;
          }
          if (ctrllayoutrect.flex > 0) {
            size += ctrllayoutrect.flex * ratio;
          }
          rect[sizename] = size;
          rect[posname] = pos;
          ctrl.layoutrect(rect);
          if (ctrl.recalc) {
            ctrl.recalc();
          }
          pos += size + spacing;
        }
      }
    });

    var flowlayout = layout$1.extend({
      defaults: {
        containerclass: 'flow-layout',
        controlclass: 'flow-layout-item',
        endclass: 'break'
      },
      recalc: function (container) {
        container.items().filter(':visible').each(function (ctrl) {
          if (ctrl.recalc) {
            ctrl.recalc();
          }
        });
      },
      isnative: function () {
        return true;
      }
    });

    var descendant = function (scope, selector) {
      return one(selector, scope);
    };

    var toggleformat = function (editor, fmt) {
      return function () {
        editor.execcommand('mcetoggleformat', false, fmt);
      };
    };
    var addformatchangedlistener = function (editor, name, changed) {
      var handler = function (state) {
        changed(state, name);
      };
      if (editor.formatter) {
        editor.formatter.formatchanged(name, handler);
      } else {
        editor.on('init', function () {
          editor.formatter.formatchanged(name, handler);
        });
      }
    };
    var postrenderformattoggle = function (editor, name) {
      return function (e) {
        addformatchangedlistener(editor, name, function (state) {
          e.control.active(state);
        });
      };
    };

    var register = function (editor) {
      var alignformats = [
        'alignleft',
        'aligncenter',
        'alignright',
        'alignjustify'
      ];
      var defaultalign = 'alignleft';
      var alignmenuitems = [
        {
          text: 'left',
          icon: 'alignleft',
          onclick: toggleformat(editor, 'alignleft')
        },
        {
          text: 'center',
          icon: 'aligncenter',
          onclick: toggleformat(editor, 'aligncenter')
        },
        {
          text: 'right',
          icon: 'alignright',
          onclick: toggleformat(editor, 'alignright')
        },
        {
          text: 'justify',
          icon: 'alignjustify',
          onclick: toggleformat(editor, 'alignjustify')
        }
      ];
      editor.addmenuitem('align', {
        text: 'align',
        menu: alignmenuitems
      });
      editor.addbutton('align', {
        type: 'menubutton',
        icon: defaultalign,
        menu: alignmenuitems,
        onshowmenu: function (e) {
          var menu = e.control.menu;
          global$4.each(alignformats, function (formatname, idx) {
            menu.items().eq(idx).each(function (item) {
              return item.active(editor.formatter.match(formatname));
            });
          });
        },
        onpostrender: function (e) {
          var ctrl = e.control;
          global$4.each(alignformats, function (formatname, idx) {
            addformatchangedlistener(editor, formatname, function (state) {
              ctrl.icon(defaultalign);
              if (state) {
                ctrl.icon(formatname);
              }
            });
          });
        }
      });
      global$4.each({
        alignleft: [
          'align left',
          'justifyleft'
        ],
        aligncenter: [
          'align center',
          'justifycenter'
        ],
        alignright: [
          'align right',
          'justifyright'
        ],
        alignjustify: [
          'justify',
          'justifyfull'
        ],
        alignnone: [
          'no alignment',
          'justifynone'
        ]
      }, function (item, name) {
        editor.addbutton(name, {
          active: false,
          tooltip: item[0],
          cmd: item[1],
          onpostrender: postrenderformattoggle(editor, name)
        });
      });
    };
    var align = { register: register };

    var getfirstfont = function (fontfamily) {
      return fontfamily ? fontfamily.split(',')[0] : '';
    };
    var findmatchingvalue = function (items, fontfamily) {
      var font = fontfamily ? fontfamily.tolowercase() : '';
      var value;
      global$4.each(items, function (item) {
        if (item.value.tolowercase() === font) {
          value = item.value;
        }
      });
      global$4.each(items, function (item) {
        if (!value && getfirstfont(item.value).tolowercase() === getfirstfont(font).tolowercase()) {
          value = item.value;
        }
      });
      return value;
    };
    var createfontnamelistboxchangehandler = function (editor, items) {
      return function () {
        var self = this;
        self.state.set('value', null);
        editor.on('init nodechange', function (e) {
          var fontfamily = editor.querycommandvalue('fontname');
          var match = findmatchingvalue(items, fontfamily);
          self.value(match ? match : null);
          if (!match && fontfamily) {
            self.text(getfirstfont(fontfamily));
          }
        });
      };
    };
    var createformats = function (formats) {
      formats = formats.replace(/;$/, '').split(';');
      var i = formats.length;
      while (i--) {
        formats[i] = formats[i].split('=');
      }
      return formats;
    };
    var getfontitems = function (editor) {
      var defaultfontsformats = 'andale mono=andale mono,monospace;' + 'arial=arial,helvetica,sans-serif;' + 'arial black=arial black,sans-serif;' + 'book antiqua=book antiqua,palatino,serif;' + 'comic sans ms=comic sans ms,sans-serif;' + 'courier new=courier new,courier,monospace;' + 'georgia=georgia,palatino,serif;' + 'helvetica=helvetica,arial,sans-serif;' + 'impact=impact,sans-serif;' + 'symbol=symbol;' + 'tahoma=tahoma,arial,helvetica,sans-serif;' + 'terminal=terminal,monaco,monospace;' + 'times new roman=times new roman,times,serif;' + 'trebuchet ms=trebuchet ms,geneva,sans-serif;' + 'verdana=verdana,geneva,sans-serif;' + 'webdings=webdings;' + 'wingdings=wingdings,zapf dingbats';
      var fonts = createformats(editor.settings.font_formats || defaultfontsformats);
      return global$4.map(fonts, function (font) {
        return {
          text: { raw: font[0] },
          value: font[1],
          textstyle: font[1].indexof('dings') === -1 ? 'font-family:' + font[1] : ''
        };
      });
    };
    var registerbuttons = function (editor) {
      editor.addbutton('fontselect', function () {
        var items = getfontitems(editor);
        return {
          type: 'listbox',
          text: 'font family',
          tooltip: 'font family',
          values: items,
          fixedwidth: true,
          onpostrender: createfontnamelistboxchangehandler(editor, items),
          onselect: function (e) {
            if (e.control.settings.value) {
              editor.execcommand('fontname', false, e.control.settings.value);
            }
          }
        };
      });
    };
    var register$1 = function (editor) {
      registerbuttons(editor);
    };
    var fontselect = { register: register$1 };

    var round = function (number, precision) {
      var factor = math.pow(10, precision);
      return math.round(number * factor) / factor;
    };
    var topt = function (fontsize, precision) {
      if (/[0-9.]+px$/.test(fontsize)) {
        return round(parseint(fontsize, 10) * 72 / 96, precision || 0) + 'pt';
      }
      return fontsize;
    };
    var findmatchingvalue$1 = function (items, pt, px) {
      var value;
      global$4.each(items, function (item) {
        if (item.value === px) {
          value = px;
        } else if (item.value === pt) {
          value = pt;
        }
      });
      return value;
    };
    var createfontsizelistboxchangehandler = function (editor, items) {
      return function () {
        var self = this;
        editor.on('init nodechange', function (e) {
          var px, pt, precision, match;
          px = editor.querycommandvalue('fontsize');
          if (px) {
            for (precision = 3; !match && precision >= 0; precision--) {
              pt = topt(px, precision);
              match = findmatchingvalue$1(items, pt, px);
            }
          }
          self.value(match ? match : null);
          if (!match) {
            self.text(pt);
          }
        });
      };
    };
    var getfontsizeitems = function (editor) {
      var defaultfontsizeformats = '8pt 10pt 12pt 14pt 18pt 24pt 36pt';
      var fontsizeformats = editor.settings.fontsize_formats || defaultfontsizeformats;
      return global$4.map(fontsizeformats.split(' '), function (item) {
        var text = item, value = item;
        var values = item.split('=');
        if (values.length > 1) {
          text = values[0];
          value = values[1];
        }
        return {
          text: text,
          value: value
        };
      });
    };
    var registerbuttons$1 = function (editor) {
      editor.addbutton('fontsizeselect', function () {
        var items = getfontsizeitems(editor);
        return {
          type: 'listbox',
          text: 'font sizes',
          tooltip: 'font sizes',
          values: items,
          fixedwidth: true,
          onpostrender: createfontsizelistboxchangehandler(editor, items),
          onclick: function (e) {
            if (e.control.settings.value) {
              editor.execcommand('fontsize', false, e.control.settings.value);
            }
          }
        };
      });
    };
    var register$2 = function (editor) {
      registerbuttons$1(editor);
    };
    var fontsizeselect = { register: register$2 };

    var hidemenuobjects = function (editor, menu) {
      var count = menu.length;
      global$4.each(menu, function (item) {
        if (item.menu) {
          item.hidden = hidemenuobjects(editor, item.menu) === 0;
        }
        var formatname = item.format;
        if (formatname) {
          item.hidden = !editor.formatter.canapply(formatname);
        }
        if (item.hidden) {
          count--;
        }
      });
      return count;
    };
    var hideformatmenuitems = function (editor, menu) {
      var count = menu.items().length;
      menu.items().each(function (item) {
        if (item.menu) {
          item.visible(hideformatmenuitems(editor, item.menu) > 0);
        }
        if (!item.menu && item.settings.menu) {
          item.visible(hidemenuobjects(editor, item.settings.menu) > 0);
        }
        var formatname = item.settings.format;
        if (formatname) {
          item.visible(editor.formatter.canapply(formatname));
        }
        if (!item.visible()) {
          count--;
        }
      });
      return count;
    };
    var createformatmenu = function (editor) {
      var count = 0;
      var newformats = [];
      var defaultstyleformats = [
        {
          title: 'headings',
          items: [
            {
              title: 'heading 1',
              format: 'h1'
            },
            {
              title: 'heading 2',
              format: 'h2'
            },
            {
              title: 'heading 3',
              format: 'h3'
            },
            {
              title: 'heading 4',
              format: 'h4'
            },
            {
              title: 'heading 5',
              format: 'h5'
            },
            {
              title: 'heading 6',
              format: 'h6'
            }
          ]
        },
        {
          title: 'inline',
          items: [
            {
              title: 'bold',
              icon: 'bold',
              format: 'bold'
            },
            {
              title: 'italic',
              icon: 'italic',
              format: 'italic'
            },
            {
              title: 'underline',
              icon: 'underline',
              format: 'underline'
            },
            {
              title: 'strikethrough',
              icon: 'strikethrough',
              format: 'strikethrough'
            },
            {
              title: 'superscript',
              icon: 'superscript',
              format: 'superscript'
            },
            {
              title: 'subscript',
              icon: 'subscript',
              format: 'subscript'
            },
            {
              title: 'code',
              icon: 'code',
              format: 'code'
            }
          ]
        },
        {
          title: 'blocks',
          items: [
            {
              title: 'paragraph',
              format: 'p'
            },
            {
              title: 'blockquote',
              format: 'blockquote'
            },
            {
              title: 'div',
              format: 'div'
            },
            {
              title: 'pre',
              format: 'pre'
            }
          ]
        },
        {
          title: 'alignment',
          items: [
            {
              title: 'left',
              icon: 'alignleft',
              format: 'alignleft'
            },
            {
              title: 'center',
              icon: 'aligncenter',
              format: 'aligncenter'
            },
            {
              title: 'right',
              icon: 'alignright',
              format: 'alignright'
            },
            {
              title: 'justify',
              icon: 'alignjustify',
              format: 'alignjustify'
            }
          ]
        }
      ];
      var createmenu = function (formats) {
        var menu = [];
        if (!formats) {
          return;
        }
        global$4.each(formats, function (format) {
          var menuitem = {
            text: format.title,
            icon: format.icon
          };
          if (format.items) {
            menuitem.menu = createmenu(format.items);
          } else {
            var formatname = format.format || 'custom' + count++;
            if (!format.format) {
              format.name = formatname;
              newformats.push(format);
            }
            menuitem.format = formatname;
            menuitem.cmd = format.cmd;
          }
          menu.push(menuitem);
        });
        return menu;
      };
      var createstylesmenu = function () {
        var menu;
        if (editor.settings.style_formats_merge) {
          if (editor.settings.style_formats) {
            menu = createmenu(defaultstyleformats.concat(editor.settings.style_formats));
          } else {
            menu = createmenu(defaultstyleformats);
          }
        } else {
          menu = createmenu(editor.settings.style_formats || defaultstyleformats);
        }
        return menu;
      };
      editor.on('init', function () {
        global$4.each(newformats, function (format) {
          editor.formatter.register(format.name, format);
        });
      });
      return {
        type: 'menu',
        items: createstylesmenu(),
        onpostrender: function (e) {
          editor.fire('renderformatsmenu', { control: e.control });
        },
        itemdefaults: {
          preview: true,
          textstyle: function () {
            if (this.settings.format) {
              return editor.formatter.getcsstext(this.settings.format);
            }
          },
          onpostrender: function () {
            var self = this;
            self.parent().on('show', function () {
              var formatname, command;
              formatname = self.settings.format;
              if (formatname) {
                self.disabled(!editor.formatter.canapply(formatname));
                self.active(editor.formatter.match(formatname));
              }
              command = self.settings.cmd;
              if (command) {
                self.active(editor.querycommandstate(command));
              }
            });
          },
          onclick: function () {
            if (this.settings.format) {
              toggleformat(editor, this.settings.format)();
            }
            if (this.settings.cmd) {
              editor.execcommand(this.settings.cmd);
            }
          }
        }
      };
    };
    var registermenuitems = function (editor, formatmenu) {
      editor.addmenuitem('formats', {
        text: 'formats',
        menu: formatmenu
      });
    };
    var registerbuttons$2 = function (editor, formatmenu) {
      editor.addbutton('styleselect', {
        type: 'menubutton',
        text: 'formats',
        menu: formatmenu,
        onshowmenu: function () {
          if (editor.settings.style_formats_autohide) {
            hideformatmenuitems(editor, this.menu);
          }
        }
      });
    };
    var register$3 = function (editor) {
      var formatmenu = createformatmenu(editor);
      registermenuitems(editor, formatmenu);
      registerbuttons$2(editor, formatmenu);
    };
    var formats = { register: register$3 };

    var defaultblocks = 'paragraph=p;' + 'heading 1=h1;' + 'heading 2=h2;' + 'heading 3=h3;' + 'heading 4=h4;' + 'heading 5=h5;' + 'heading 6=h6;' + 'preformatted=pre';
    var createformats$1 = function (formats) {
      formats = formats.replace(/;$/, '').split(';');
      var i = formats.length;
      while (i--) {
        formats[i] = formats[i].split('=');
      }
      return formats;
    };
    var createlistboxchangehandler = function (editor, items, formatname) {
      return function () {
        var self = this;
        editor.on('nodechange', function (e) {
          var formatter = editor.formatter;
          var value = null;
          global$4.each(e.parents, function (node) {
            global$4.each(items, function (item) {
              if (formatname) {
                if (formatter.matchnode(node, formatname, { value: item.value })) {
                  value = item.value;
                }
              } else {
                if (formatter.matchnode(node, item.value)) {
                  value = item.value;
                }
              }
              if (value) {
                return false;
              }
            });
            if (value) {
              return false;
            }
          });
          self.value(value);
        });
      };
    };
    var lazyformatselectboxitems = function (editor, blocks) {
      return function () {
        var items = [];
        global$4.each(blocks, function (block) {
          items.push({
            text: block[0],
            value: block[1],
            textstyle: function () {
              return editor.formatter.getcsstext(block[1]);
            }
          });
        });
        return {
          type: 'listbox',
          text: blocks[0][0],
          values: items,
          fixedwidth: true,
          onselect: function (e) {
            if (e.control) {
              var fmt = e.control.value();
              toggleformat(editor, fmt)();
            }
          },
          onpostrender: createlistboxchangehandler(editor, items)
        };
      };
    };
    var buildmenuitems = function (editor, blocks) {
      return global$4.map(blocks, function (block) {
        return {
          text: block[0],
          onclick: toggleformat(editor, block[1]),
          textstyle: function () {
            return editor.formatter.getcsstext(block[1]);
          }
        };
      });
    };
    var register$4 = function (editor) {
      var blocks = createformats$1(editor.settings.block_formats || defaultblocks);
      editor.addmenuitem('blockformats', {
        text: 'blocks',
        menu: buildmenuitems(editor, blocks)
      });
      editor.addbutton('formatselect', lazyformatselectboxitems(editor, blocks));
    };
    var formatselect = { register: register$4 };

    var createcustommenuitems = function (editor, names) {
      var items, namelist;
      if (typeof names === 'string') {
        namelist = names.split(' ');
      } else if (global$4.isarray(names)) {
        return flatten$1(global$4.map(names, function (names) {
          return createcustommenuitems(editor, names);
        }));
      }
      items = global$4.grep(namelist, function (name) {
        return name === '|' || name in editor.menuitems;
      });
      return global$4.map(items, function (name) {
        return name === '|' ? { text: '-' } : editor.menuitems[name];
      });
    };
    var isseparator = function (menuitem) {
      return menuitem && menuitem.text === '-';
    };
    var trimmenuitems = function (menuitems) {
      var menuitems2 = filter(menuitems, function (menuitem, i) {
        return !isseparator(menuitem) || !isseparator(menuitems[i - 1]);
      });
      return filter(menuitems2, function (menuitem, i) {
        return !isseparator(menuitem) || i > 0 && i < menuitems2.length - 1;
      });
    };
    var createcontextmenuitems = function (editor, context) {
      var outputmenuitems = [{ text: '-' }];
      var menuitems = global$4.grep(editor.menuitems, function (menuitem) {
        return menuitem.context === context;
      });
      global$4.each(menuitems, function (menuitem) {
        if (menuitem.separator === 'before') {
          outputmenuitems.push({ text: '|' });
        }
        if (menuitem.prependtocontext) {
          outputmenuitems.unshift(menuitem);
        } else {
          outputmenuitems.push(menuitem);
        }
        if (menuitem.separator === 'after') {
          outputmenuitems.push({ text: '|' });
        }
      });
      return outputmenuitems;
    };
    var createinsertmenu = function (editor) {
      var insertbuttonitems = editor.settings.insert_button_items;
      if (insertbuttonitems) {
        return trimmenuitems(createcustommenuitems(editor, insertbuttonitems));
      } else {
        return trimmenuitems(createcontextmenuitems(editor, 'insert'));
      }
    };
    var registerbuttons$3 = function (editor) {
      editor.addbutton('insert', {
        type: 'menubutton',
        icon: 'insert',
        menu: [],
        oncreatemenu: function () {
          this.menu.add(createinsertmenu(editor));
          this.menu.rendernew();
        }
      });
    };
    var register$5 = function (editor) {
      registerbuttons$3(editor);
    };
    var insertbutton = { register: register$5 };

    var registerformatbuttons = function (editor) {
      global$4.each({
        bold: 'bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'strikethrough',
        subscript: 'subscript',
        superscript: 'superscript'
      }, function (text, name) {
        editor.addbutton(name, {
          active: false,
          tooltip: text,
          onpostrender: postrenderformattoggle(editor, name),
          onclick: toggleformat(editor, name)
        });
      });
    };
    var registercommandbuttons = function (editor) {
      global$4.each({
        outdent: [
          'decrease indent',
          'outdent'
        ],
        indent: [
          'increase indent',
          'indent'
        ],
        cut: [
          'cut',
          'cut'
        ],
        copy: [
          'copy',
          'copy'
        ],
        paste: [
          'paste',
          'paste'
        ],
        help: [
          'help',
          'mcehelp'
        ],
        selectall: [
          'select all',
          'selectall'
        ],
        visualaid: [
          'visual aids',
          'mcetogglevisualaid'
        ],
        newdocument: [
          'new document',
          'mcenewdocument'
        ],
        removeformat: [
          'clear formatting',
          'removeformat'
        ],
        remove: [
          'remove',
          'delete'
        ]
      }, function (item, name) {
        editor.addbutton(name, {
          tooltip: item[0],
          cmd: item[1]
        });
      });
    };
    var registercommandtogglebuttons = function (editor) {
      global$4.each({
        blockquote: [
          'blockquote',
          'mceblockquote'
        ],
        subscript: [
          'subscript',
          'subscript'
        ],
        superscript: [
          'superscript',
          'superscript'
        ]
      }, function (item, name) {
        editor.addbutton(name, {
          active: false,
          tooltip: item[0],
          cmd: item[1],
          onpostrender: postrenderformattoggle(editor, name)
        });
      });
    };
    var registerbuttons$4 = function (editor) {
      registerformatbuttons(editor);
      registercommandbuttons(editor);
      registercommandtogglebuttons(editor);
    };
    var registermenuitems$1 = function (editor) {
      global$4.each({
        bold: [
          'bold',
          'bold',
          'meta+b'
        ],
        italic: [
          'italic',
          'italic',
          'meta+i'
        ],
        underline: [
          'underline',
          'underline',
          'meta+u'
        ],
        strikethrough: [
          'strikethrough',
          'strikethrough'
        ],
        subscript: [
          'subscript',
          'subscript'
        ],
        superscript: [
          'superscript',
          'superscript'
        ],
        removeformat: [
          'clear formatting',
          'removeformat'
        ],
        newdocument: [
          'new document',
          'mcenewdocument'
        ],
        cut: [
          'cut',
          'cut',
          'meta+x'
        ],
        copy: [
          'copy',
          'copy',
          'meta+c'
        ],
        paste: [
          'paste',
          'paste',
          'meta+v'
        ],
        selectall: [
          'select all',
          'selectall',
          'meta+a'
        ]
      }, function (item, name) {
        editor.addmenuitem(name, {
          text: item[0],
          icon: name,
          shortcut: item[2],
          cmd: item[1]
        });
      });
      editor.addmenuitem('codeformat', {
        text: 'code',
        icon: 'code',
        onclick: toggleformat(editor, 'code')
      });
    };
    var register$6 = function (editor) {
      registerbuttons$4(editor);
      registermenuitems$1(editor);
    };
    var simplecontrols = { register: register$6 };

    var toggleundoredostate = function (editor, type) {
      return function () {
        var self = this;
        var checkstate = function () {
          var typefn = type === 'redo' ? 'hasredo' : 'hasundo';
          return editor.undomanager ? editor.undomanager[typefn]() : false;
        };
        self.disabled(!checkstate());
        editor.on('undo redo addundo typingundo clearundos switchmode', function () {
          self.disabled(editor.readonly || !checkstate());
        });
      };
    };
    var registermenuitems$2 = function (editor) {
      editor.addmenuitem('undo', {
        text: 'undo',
        icon: 'undo',
        shortcut: 'meta+z',
        onpostrender: toggleundoredostate(editor, 'undo'),
        cmd: 'undo'
      });
      editor.addmenuitem('redo', {
        text: 'redo',
        icon: 'redo',
        shortcut: 'meta+y',
        onpostrender: toggleundoredostate(editor, 'redo'),
        cmd: 'redo'
      });
    };
    var registerbuttons$5 = function (editor) {
      editor.addbutton('undo', {
        tooltip: 'undo',
        onpostrender: toggleundoredostate(editor, 'undo'),
        cmd: 'undo'
      });
      editor.addbutton('redo', {
        tooltip: 'redo',
        onpostrender: toggleundoredostate(editor, 'redo'),
        cmd: 'redo'
      });
    };
    var register$7 = function (editor) {
      registermenuitems$2(editor);
      registerbuttons$5(editor);
    };
    var undoredo = { register: register$7 };

    var togglevisualaidstate = function (editor) {
      return function () {
        var self = this;
        editor.on('visualaid', function (e) {
          self.active(e.hasvisual);
        });
        self.active(editor.hasvisual);
      };
    };
    var registermenuitems$3 = function (editor) {
      editor.addmenuitem('visualaid', {
        text: 'visual aids',
        selectable: true,
        onpostrender: togglevisualaidstate(editor),
        cmd: 'mcetogglevisualaid'
      });
    };
    var register$8 = function (editor) {
      registermenuitems$3(editor);
    };
    var visualaid = { register: register$8 };

    var setupenvironment = function () {
      widget.tooltips = !global$1.ios;
      control$1.translate = function (text) {
        return global$5.translate(text);
      };
    };
    var setupuicontainer = function (editor) {
      if (editor.settings.ui_container) {
        global$1.container = descendant(element.fromdom(domglobals.document.body), editor.settings.ui_container).fold(constant(null), function (elm) {
          return elm.dom();
        });
      }
    };
    var setuprtlmode = function (editor) {
      if (editor.rtl) {
        control$1.rtl = true;
      }
    };
    var setuphidefloatpanels = function (editor) {
      editor.on('mousedown progressstate', function () {
        floatpanel.hideall();
      });
    };
    var setup = function (editor) {
      setuprtlmode(editor);
      setuphidefloatpanels(editor);
      setupuicontainer(editor);
      setupenvironment();
      formatselect.register(editor);
      align.register(editor);
      simplecontrols.register(editor);
      undoredo.register(editor);
      fontsizeselect.register(editor);
      fontselect.register(editor);
      formats.register(editor);
      visualaid.register(editor);
      insertbutton.register(editor);
    };
    var formatcontrols = { setup: setup };

    var gridlayout = absolutelayout.extend({
      recalc: function (container) {
        var settings, rows, cols, items, contlayoutrect, width, height, rect, ctrllayoutrect, ctrl, x, y, posx, posy, ctrlsettings, contpaddingbox, align, spacingh, spacingv, alignh, alignv, maxx, maxy;
        var colwidths = [];
        var rowheights = [];
        var ctrlminwidth, ctrlminheight, availablewidth, availableheight, reverserows, idx;
        settings = container.settings;
        items = container.items().filter(':visible');
        contlayoutrect = container.layoutrect();
        cols = settings.columns || math.ceil(math.sqrt(items.length));
        rows = math.ceil(items.length / cols);
        spacingh = settings.spacingh || settings.spacing || 0;
        spacingv = settings.spacingv || settings.spacing || 0;
        alignh = settings.alignh || settings.align;
        alignv = settings.alignv || settings.align;
        contpaddingbox = container.paddingbox;
        reverserows = 'reverserows' in settings ? settings.reverserows : container.isrtl();
        if (alignh && typeof alignh === 'string') {
          alignh = [alignh];
        }
        if (alignv && typeof alignv === 'string') {
          alignv = [alignv];
        }
        for (x = 0; x < cols; x++) {
          colwidths.push(0);
        }
        for (y = 0; y < rows; y++) {
          rowheights.push(0);
        }
        for (y = 0; y < rows; y++) {
          for (x = 0; x < cols; x++) {
            ctrl = items[y * cols + x];
            if (!ctrl) {
              break;
            }
            ctrllayoutrect = ctrl.layoutrect();
            ctrlminwidth = ctrllayoutrect.minw;
            ctrlminheight = ctrllayoutrect.minh;
            colwidths[x] = ctrlminwidth > colwidths[x] ? ctrlminwidth : colwidths[x];
            rowheights[y] = ctrlminheight > rowheights[y] ? ctrlminheight : rowheights[y];
          }
        }
        availablewidth = contlayoutrect.innerw - contpaddingbox.left - contpaddingbox.right;
        for (maxx = 0, x = 0; x < cols; x++) {
          maxx += colwidths[x] + (x > 0 ? spacingh : 0);
          availablewidth -= (x > 0 ? spacingh : 0) + colwidths[x];
        }
        availableheight = contlayoutrect.innerh - contpaddingbox.top - contpaddingbox.bottom;
        for (maxy = 0, y = 0; y < rows; y++) {
          maxy += rowheights[y] + (y > 0 ? spacingv : 0);
          availableheight -= (y > 0 ? spacingv : 0) + rowheights[y];
        }
        maxx += contpaddingbox.left + contpaddingbox.right;
        maxy += contpaddingbox.top + contpaddingbox.bottom;
        rect = {};
        rect.minw = maxx + (contlayoutrect.w - contlayoutrect.innerw);
        rect.minh = maxy + (contlayoutrect.h - contlayoutrect.innerh);
        rect.contentw = rect.minw - contlayoutrect.deltaw;
        rect.contenth = rect.minh - contlayoutrect.deltah;
        rect.minw = math.min(rect.minw, contlayoutrect.maxw);
        rect.minh = math.min(rect.minh, contlayoutrect.maxh);
        rect.minw = math.max(rect.minw, contlayoutrect.startminwidth);
        rect.minh = math.max(rect.minh, contlayoutrect.startminheight);
        if (contlayoutrect.autoresize && (rect.minw !== contlayoutrect.minw || rect.minh !== contlayoutrect.minh)) {
          rect.w = rect.minw;
          rect.h = rect.minh;
          container.layoutrect(rect);
          this.recalc(container);
          if (container._lastrect === null) {
            var parentctrl = container.parent();
            if (parentctrl) {
              parentctrl._lastrect = null;
              parentctrl.recalc();
            }
          }
          return;
        }
        if (contlayoutrect.autoresize) {
          rect = container.layoutrect(rect);
          rect.contentw = rect.minw - contlayoutrect.deltaw;
          rect.contenth = rect.minh - contlayoutrect.deltah;
        }
        var flexv;
        if (settings.packv === 'start') {
          flexv = 0;
        } else {
          flexv = availableheight > 0 ? math.floor(availableheight / rows) : 0;
        }
        var totalflex = 0;
        var flexwidths = settings.flexwidths;
        if (flexwidths) {
          for (x = 0; x < flexwidths.length; x++) {
            totalflex += flexwidths[x];
          }
        } else {
          totalflex = cols;
        }
        var ratio = availablewidth / totalflex;
        for (x = 0; x < cols; x++) {
          colwidths[x] += flexwidths ? flexwidths[x] * ratio : ratio;
        }
        posy = contpaddingbox.top;
        for (y = 0; y < rows; y++) {
          posx = contpaddingbox.left;
          height = rowheights[y] + flexv;
          for (x = 0; x < cols; x++) {
            if (reverserows) {
              idx = y * cols + cols - 1 - x;
            } else {
              idx = y * cols + x;
            }
            ctrl = items[idx];
            if (!ctrl) {
              break;
            }
            ctrlsettings = ctrl.settings;
            ctrllayoutrect = ctrl.layoutrect();
            width = math.max(colwidths[x], ctrllayoutrect.startminwidth);
            ctrllayoutrect.x = posx;
            ctrllayoutrect.y = posy;
            align = ctrlsettings.alignh || (alignh ? alignh[x] || alignh[0] : null);
            if (align === 'center') {
              ctrllayoutrect.x = posx + width / 2 - ctrllayoutrect.w / 2;
            } else if (align === 'right') {
              ctrllayoutrect.x = posx + width - ctrllayoutrect.w;
            } else if (align === 'stretch') {
              ctrllayoutrect.w = width;
            }
            align = ctrlsettings.alignv || (alignv ? alignv[x] || alignv[0] : null);
            if (align === 'center') {
              ctrllayoutrect.y = posy + height / 2 - ctrllayoutrect.h / 2;
            } else if (align === 'bottom') {
              ctrllayoutrect.y = posy + height - ctrllayoutrect.h;
            } else if (align === 'stretch') {
              ctrllayoutrect.h = height;
            }
            ctrl.layoutrect(ctrllayoutrect);
            posx += width + spacingh;
            if (ctrl.recalc) {
              ctrl.recalc();
            }
          }
          posy += height + spacingv;
        }
      }
    });

    var iframe = widget.extend({
      renderhtml: function () {
        var self = this;
        self.classes.add('iframe');
        self.canfocus = false;
        return '<iframe id="' + self._id + '" class="' + self.classes + '" tabindex="-1" src="' + (self.settings.url || 'javascript:\'\'') + '" frameborder="0"></iframe>';
      },
      src: function (src) {
        this.getel().src = src;
      },
      html: function (html, callback) {
        var self = this, body = this.getel().contentwindow.document.body;
        if (!body) {
          global$3.settimeout(function () {
            self.html(html);
          });
        } else {
          body.innerhtml = html;
          if (callback) {
            callback();
          }
        }
        return this;
      }
    });

    var infobox = widget.extend({
      init: function (settings) {
        var self = this;
        self._super(settings);
        self.classes.add('widget').add('infobox');
        self.canfocus = false;
      },
      severity: function (level) {
        this.classes.remove('error');
        this.classes.remove('warning');
        this.classes.remove('success');
        this.classes.add(level);
      },
      help: function (state) {
        this.state.set('help', state);
      },
      renderhtml: function () {
        var self = this, prefix = self.classprefix;
        return '<div id="' + self._id + '" class="' + self.classes + '">' + '<div id="' + self._id + '-body">' + self.encode(self.state.get('text')) + '<button role="button" tabindex="-1">' + '<i class="' + prefix + 'ico ' + prefix + 'i-help"></i>' + '</button>' + '</div>' + '</div>';
      },
      bindstates: function () {
        var self = this;
        self.state.on('change:text', function (e) {
          self.getel('body').firstchild.data = self.encode(e.value);
          if (self.state.get('rendered')) {
            self.updatelayoutrect();
          }
        });
        self.state.on('change:help', function (e) {
          self.classes.toggle('has-help', e.value);
          if (self.state.get('rendered')) {
            self.updatelayoutrect();
          }
        });
        return self._super();
      }
    });

    var label = widget.extend({
      init: function (settings) {
        var self = this;
        self._super(settings);
        self.classes.add('widget').add('label');
        self.canfocus = false;
        if (settings.multiline) {
          self.classes.add('autoscroll');
        }
        if (settings.strong) {
          self.classes.add('strong');
        }
      },
      initlayoutrect: function () {
        var self = this, layoutrect = self._super();
        if (self.settings.multiline) {
          var size = funcs.getsize(self.getel());
          if (size.width > layoutrect.maxw) {
            layoutrect.minw = layoutrect.maxw;
            self.classes.add('multiline');
          }
          self.getel().style.width = layoutrect.minw + 'px';
          layoutrect.startminh = layoutrect.h = layoutrect.minh = math.min(layoutrect.maxh, funcs.getsize(self.getel()).height);
        }
        return layoutrect;
      },
      repaint: function () {
        var self = this;
        if (!self.settings.multiline) {
          self.getel().style.lineheight = self.layoutrect().h + 'px';
        }
        return self._super();
      },
      severity: function (level) {
        this.classes.remove('error');
        this.classes.remove('warning');
        this.classes.remove('success');
        this.classes.add(level);
      },
      renderhtml: function () {
        var self = this;
        var targetctrl, forname, forid = self.settings.forid;
        var text = self.settings.html ? self.settings.html : self.encode(self.state.get('text'));
        if (!forid && (forname = self.settings.forname)) {
          targetctrl = self.getroot().find('#' + forname)[0];
          if (targetctrl) {
            forid = targetctrl._id;
          }
        }
        if (forid) {
          return '<label id="' + self._id + '" class="' + self.classes + '"' + (forid ? ' for="' + forid + '"' : '') + '>' + text + '</label>';
        }
        return '<span id="' + self._id + '" class="' + self.classes + '">' + text + '</span>';
      },
      bindstates: function () {
        var self = this;
        self.state.on('change:text', function (e) {
          self.innerhtml(self.encode(e.value));
          if (self.state.get('rendered')) {
            self.updatelayoutrect();
          }
        });
        return self._super();
      }
    });

    var toolbar$1 = container.extend({
      defaults: {
        role: 'toolbar',
        layout: 'flow'
      },
      init: function (settings) {
        var self = this;
        self._super(settings);
        self.classes.add('toolbar');
      },
      postrender: function () {
        var self = this;
        self.items().each(function (ctrl) {
          ctrl.classes.add('toolbar-item');
        });
        return self._super();
      }
    });

    var menubar = toolbar$1.extend({
      defaults: {
        role: 'menubar',
        containercls: 'menubar',
        ariaroot: true,
        defaults: { type: 'menubutton' }
      }
    });

    function ischildof$1(node, parent) {
      while (node) {
        if (parent === node) {
          return true;
        }
        node = node.parentnode;
      }
      return false;
    }
    var menubutton = button.extend({
      init: function (settings) {
        var self = this;
        self._renderopen = true;
        self._super(settings);
        settings = self.settings;
        self.classes.add('menubtn');
        if (settings.fixedwidth) {
          self.classes.add('fixed-width');
        }
        self.aria('haspopup', true);
        self.state.set('menu', settings.menu || self.render());
      },
      showmenu: function (toggle) {
        var self = this;
        var menu;
        if (self.menu && self.menu.visible() && toggle !== false) {
          return self.hidemenu();
        }
        if (!self.menu) {
          menu = self.state.get('menu') || [];
          self.classes.add('opened');
          if (menu.length) {
            menu = {
              type: 'menu',
              animate: true,
              items: menu
            };
          } else {
            menu.type = menu.type || 'menu';
            menu.animate = true;
          }
          if (!menu.renderto) {
            self.menu = global$b.create(menu).parent(self).renderto();
          } else {
            self.menu = menu.parent(self).show().renderto();
          }
          self.fire('createmenu');
          self.menu.reflow();
          self.menu.on('cancel', function (e) {
            if (e.control.parent() === self.menu) {
              e.stoppropagation();
              self.focus();
              self.hidemenu();
            }
          });
          self.menu.on('select', function () {
            self.focus();
          });
          self.menu.on('show hide', function (e) {
            if (e.type === 'hide' && e.control.parent() === self) {
              self.classes.remove('opened-under');
            }
            if (e.control === self.menu) {
              self.activemenu(e.type === 'show');
              self.classes.toggle('opened', e.type === 'show');
            }
            self.aria('expanded', e.type === 'show');
          }).fire('show');
        }
        self.menu.show();
        self.menu.layoutrect({ w: self.layoutrect().w });
        self.menu.repaint();
        self.menu.moverel(self.getel(), self.isrtl() ? [
          'br-tr',
          'tr-br'
        ] : [
          'bl-tl',
          'tl-bl'
        ]);
        var menulayoutrect = self.menu.layoutrect();
        var selfbottom = self.$el.offset().top + self.layoutrect().h;
        if (selfbottom > menulayoutrect.y && selfbottom < menulayoutrect.y + menulayoutrect.h) {
          self.classes.add('opened-under');
        }
        self.fire('showmenu');
      },
      hidemenu: function () {
        var self = this;
        if (self.menu) {
          self.menu.items().each(function (item) {
            if (item.hidemenu) {
              item.hidemenu();
            }
          });
          self.menu.hide();
        }
      },
      activemenu: function (state) {
        this.classes.toggle('active', state);
      },
      renderhtml: function () {
        var self = this, id = self._id, prefix = self.classprefix;
        var icon = self.settings.icon, image;
        var text = self.state.get('text');
        var texthtml = '';
        image = self.settings.image;
        if (image) {
          icon = 'none';
          if (typeof image !== 'string') {
            image = domglobals.window.getselection ? image[0] : image[1];
          }
          image = ' style="background-image: url(\'' + image + '\')"';
        } else {
          image = '';
        }
        if (text) {
          self.classes.add('btn-has-text');
          texthtml = '<span class="' + prefix + 'txt">' + self.encode(text) + '</span>';
        }
        icon = self.settings.icon ? prefix + 'ico ' + prefix + 'i-' + icon : '';
        self.aria('role', self.parent() instanceof menubar ? 'menuitem' : 'button');
        return '<div id="' + id + '" class="' + self.classes + '" tabindex="-1" aria-labelledby="' + id + '">' + '<button id="' + id + '-open" role="presentation" type="button" tabindex="-1">' + (icon ? '<i class="' + icon + '"' + image + '></i>' : '') + texthtml + ' <i class="' + prefix + 'caret"></i>' + '</button>' + '</div>';
      },
      postrender: function () {
        var self = this;
        self.on('click', function (e) {
          if (e.control === self && ischildof$1(e.target, self.getel())) {
            self.focus();
            self.showmenu(!e.aria);
            if (e.aria) {
              self.menu.items().filter(':visible')[0].focus();
            }
          }
        });
        self.on('mouseenter', function (e) {
          var overctrl = e.control;
          var parent = self.parent();
          var hasvisiblesiblingmenu;
          if (overctrl && parent && overctrl instanceof menubutton && overctrl.parent() === parent) {
            parent.items().filter('menubutton').each(function (ctrl) {
              if (ctrl.hidemenu && ctrl !== overctrl) {
                if (ctrl.menu && ctrl.menu.visible()) {
                  hasvisiblesiblingmenu = true;
                }
                ctrl.hidemenu();
              }
            });
            if (hasvisiblesiblingmenu) {
              overctrl.focus();
              overctrl.showmenu();
            }
          }
        });
        return self._super();
      },
      bindstates: function () {
        var self = this;
        self.state.on('change:menu', function () {
          if (self.menu) {
            self.menu.remove();
          }
          self.menu = null;
        });
        return self._super();
      },
      remove: function () {
        this._super();
        if (this.menu) {
          this.menu.remove();
        }
      }
    });

    function throbber (elm, inline) {
      var self = this;
      var state;
      var classprefix = control$1.classprefix;
      var timer;
      self.show = function (time, callback) {
        function render() {
          if (state) {
            global$7(elm).append('<div class="' + classprefix + 'throbber' + (inline ? ' ' + classprefix + 'throbber-inline' : '') + '"></div>');
            if (callback) {
              callback();
            }
          }
        }
        self.hide();
        state = true;
        if (time) {
          timer = global$3.settimeout(render, time);
        } else {
          render();
        }
        return self;
      };
      self.hide = function () {
        var child = elm.lastchild;
        global$3.cleartimeout(timer);
        if (child && child.classname.indexof('throbber') !== -1) {
          child.parentnode.removechild(child);
        }
        state = false;
        return self;
      };
    }

    var menu = floatpanel.extend({
      defaults: {
        defaulttype: 'menuitem',
        border: 1,
        layout: 'stack',
        role: 'application',
        bodyrole: 'menu',
        ariaroot: true
      },
      init: function (settings) {
        var self = this;
        settings.autohide = true;
        settings.constraintoviewport = true;
        if (typeof settings.items === 'function') {
          settings.itemsfactory = settings.items;
          settings.items = [];
        }
        if (settings.itemdefaults) {
          var items = settings.items;
          var i = items.length;
          while (i--) {
            items[i] = global$4.extend({}, settings.itemdefaults, items[i]);
          }
        }
        self._super(settings);
        self.classes.add('menu');
        if (settings.animate && global$1.ie !== 11) {
          self.classes.add('animate');
        }
      },
      repaint: function () {
        this.classes.toggle('menu-align', true);
        this._super();
        this.getel().style.height = '';
        this.getel('body').style.height = '';
        return this;
      },
      cancel: function () {
        var self = this;
        self.hideall();
        self.fire('select');
      },
      load: function () {
        var self = this;
        var time, factory;
        function hidethrobber() {
          if (self.throbber) {
            self.throbber.hide();
            self.throbber = null;
          }
        }
        factory = self.settings.itemsfactory;
        if (!factory) {
          return;
        }
        if (!self.throbber) {
          self.throbber = new throbber(self.getel('body'), true);
          if (self.items().length === 0) {
            self.throbber.show();
            self.fire('loading');
          } else {
            self.throbber.show(100, function () {
              self.items().remove();
              self.fire('loading');
            });
          }
          self.on('hide close', hidethrobber);
        }
        self.requesttime = time = new date().gettime();
        self.settings.itemsfactory(function (items) {
          if (items.length === 0) {
            self.hide();
            return;
          }
          if (self.requesttime !== time) {
            return;
          }
          self.getel().style.width = '';
          self.getel('body').style.width = '';
          hidethrobber();
          self.items().remove();
          self.getel('body').innerhtml = '';
          self.add(items);
          self.rendernew();
          self.fire('loaded');
        });
      },
      hideall: function () {
        var self = this;
        this.find('menuitem').exec('hidemenu');
        return self._super();
      },
      prerender: function () {
        var self = this;
        self.items().each(function (ctrl) {
          var settings = ctrl.settings;
          if (settings.icon || settings.image || settings.selectable) {
            self._hasicons = true;
            return false;
          }
        });
        if (self.settings.itemsfactory) {
          self.on('postrender', function () {
            if (self.settings.itemsfactory) {
              self.load();
            }
          });
        }
        self.on('show hide', function (e) {
          if (e.control === self) {
            if (e.type === 'show') {
              global$3.settimeout(function () {
                self.classes.add('in');
              }, 0);
            } else {
              self.classes.remove('in');
            }
          }
        });
        return self._super();
      }
    });

    var listbox = menubutton.extend({
      init: function (settings) {
        var self = this;
        var values, selected, selectedtext, lastitemctrl;
        function setselected(menuvalues) {
          for (var i = 0; i < menuvalues.length; i++) {
            selected = menuvalues[i].selected || settings.value === menuvalues[i].value;
            if (selected) {
              selectedtext = selectedtext || menuvalues[i].text;
              self.state.set('value', menuvalues[i].value);
              return true;
            }
            if (menuvalues[i].menu) {
              if (setselected(menuvalues[i].menu)) {
                return true;
              }
            }
          }
        }
        self._super(settings);
        settings = self.settings;
        self._values = values = settings.values;
        if (values) {
          if (typeof settings.value !== 'undefined') {
            setselected(values);
          }
          if (!selected && values.length > 0) {
            selectedtext = values[0].text;
            self.state.set('value', values[0].value);
          }
          self.state.set('menu', values);
        }
        self.state.set('text', settings.text || selectedtext);
        self.classes.add('listbox');
        self.on('select', function (e) {
          var ctrl = e.control;
          if (lastitemctrl) {
            e.lastcontrol = lastitemctrl;
          }
          if (settings.multiple) {
            ctrl.active(!ctrl.active());
          } else {
            self.value(e.control.value());
          }
          lastitemctrl = ctrl;
        });
      },
      value: function (value) {
        if (arguments.length === 0) {
          return this.state.get('value');
        }
        if (typeof value === 'undefined') {
          return this;
        }
        function valueexists(values) {
          return exists(values, function (a) {
            return a.menu ? valueexists(a.menu) : a.value === value;
          });
        }
        if (this.settings.values) {
          if (valueexists(this.settings.values)) {
            this.state.set('value', value);
          } else if (value === null) {
            this.state.set('value', null);
          }
        } else {
          this.state.set('value', value);
        }
        return this;
      },
      bindstates: function () {
        var self = this;
        function activatemenuitemsbyvalue(menu, value) {
          if (menu instanceof menu) {
            menu.items().each(function (ctrl) {
              if (!ctrl.hasmenus()) {
                ctrl.active(ctrl.value() === value);
              }
            });
          }
        }
        function getselecteditem(menuvalues, value) {
          var selecteditem;
          if (!menuvalues) {
            return;
          }
          for (var i = 0; i < menuvalues.length; i++) {
            if (menuvalues[i].value === value) {
              return menuvalues[i];
            }
            if (menuvalues[i].menu) {
              selecteditem = getselecteditem(menuvalues[i].menu, value);
              if (selecteditem) {
                return selecteditem;
              }
            }
          }
        }
        self.on('show', function (e) {
          activatemenuitemsbyvalue(e.control, self.value());
        });
        self.state.on('change:value', function (e) {
          var selecteditem = getselecteditem(self.state.get('menu'), e.value);
          if (selecteditem) {
            self.text(selecteditem.text);
          } else {
            self.text(self.settings.text);
          }
        });
        return self._super();
      }
    });

    var toggletextstyle = function (ctrl, state) {
      var textstyle = ctrl._textstyle;
      if (textstyle) {
        var textelm = ctrl.getel('text');
        textelm.setattribute('style', textstyle);
        if (state) {
          textelm.style.color = '';
          textelm.style.backgroundcolor = '';
        }
      }
    };
    var menuitem = widget.extend({
      defaults: {
        border: 0,
        role: 'menuitem'
      },
      init: function (settings) {
        var self = this;
        var text;
        self._super(settings);
        settings = self.settings;
        self.classes.add('menu-item');
        if (settings.menu) {
          self.classes.add('menu-item-expand');
        }
        if (settings.preview) {
          self.classes.add('menu-item-preview');
        }
        text = self.state.get('text');
        if (text === '-' || text === '|') {
          self.classes.add('menu-item-sep');
          self.aria('role', 'separator');
          self.state.set('text', '-');
        }
        if (settings.selectable) {
          self.aria('role', 'menuitemcheckbox');
          self.classes.add('menu-item-checkbox');
          settings.icon = 'selected';
        }
        if (!settings.preview && !settings.selectable) {
          self.classes.add('menu-item-normal');
        }
        self.on('mousedown', function (e) {
          e.preventdefault();
        });
        if (settings.menu && !settings.ariahidemenu) {
          self.aria('haspopup', true);
        }
      },
      hasmenus: function () {
        return !!this.settings.menu;
      },
      showmenu: function () {
        var self = this;
        var settings = self.settings;
        var menu;
        var parent = self.parent();
        parent.items().each(function (ctrl) {
          if (ctrl !== self) {
            ctrl.hidemenu();
          }
        });
        if (settings.menu) {
          menu = self.menu;
          if (!menu) {
            menu = settings.menu;
            if (menu.length) {
              menu = {
                type: 'menu',
                items: menu
              };
            } else {
              menu.type = menu.type || 'menu';
            }
            if (parent.settings.itemdefaults) {
              menu.itemdefaults = parent.settings.itemdefaults;
            }
            menu = self.menu = global$b.create(menu).parent(self).renderto();
            menu.reflow();
            menu.on('cancel', function (e) {
              e.stoppropagation();
              self.focus();
              menu.hide();
            });
            menu.on('show hide', function (e) {
              if (e.control.items) {
                e.control.items().each(function (ctrl) {
                  ctrl.active(ctrl.settings.selected);
                });
              }
            }).fire('show');
            menu.on('hide', function (e) {
              if (e.control === menu) {
                self.classes.remove('selected');
              }
            });
            menu.submenu = true;
          } else {
            menu.show();
          }
          menu._parentmenu = parent;
          menu.classes.add('menu-sub');
          var rel = menu.testmoverel(self.getel(), self.isrtl() ? [
            'tl-tr',
            'bl-br',
            'tr-tl',
            'br-bl'
          ] : [
            'tr-tl',
            'br-bl',
            'tl-tr',
            'bl-br'
          ]);
          menu.moverel(self.getel(), rel);
          menu.rel = rel;
          rel = 'menu-sub-' + rel;
          menu.classes.remove(menu._lastrel).add(rel);
          menu._lastrel = rel;
          self.classes.add('selected');
          self.aria('expanded', true);
        }
      },
      hidemenu: function () {
        var self = this;
        if (self.menu) {
          self.menu.items().each(function (item) {
            if (item.hidemenu) {
              item.hidemenu();
            }
          });
          self.menu.hide();
          self.aria('expanded', false);
        }
        return self;
      },
      renderhtml: function () {
        var self = this;
        var id = self._id;
        var settings = self.settings;
        var prefix = self.classprefix;
        var text = self.state.get('text');
        var icon = self.settings.icon, image = '', shortcut = settings.shortcut;
        var url = self.encode(settings.url), iconhtml = '';
        function convertshortcut(shortcut) {
          var i, value, replace = {};
          if (global$1.mac) {
            replace = {
              alt: '&#x2325;',
              ctrl: '&#x2318;',
              shift: '&#x21e7;',
              meta: '&#x2318;'
            };
          } else {
            replace = { meta: 'ctrl' };
          }
          shortcut = shortcut.split('+');
          for (i = 0; i < shortcut.length; i++) {
            value = replace[shortcut[i].tolowercase()];
            if (value) {
              shortcut[i] = value;
            }
          }
          return shortcut.join('+');
        }
        function escaperegexp(str) {
          return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
        function markmatches(text) {
          var match = settings.match || '';
          return match ? text.replace(new regexp(escaperegexp(match), 'gi'), function (match) {
            return '!mce~match[' + match + ']mce~match!';
          }) : text;
        }
        function boldmatches(text) {
          return text.replace(new regexp(escaperegexp('!mce~match['), 'g'), '<b>').replace(new regexp(escaperegexp(']mce~match!'), 'g'), '</b>');
        }
        if (icon) {
          self.parent().classes.add('menu-has-icons');
        }
        if (settings.image) {
          image = ' style="background-image: url(\'' + settings.image + '\')"';
        }
        if (shortcut) {
          shortcut = convertshortcut(shortcut);
        }
        icon = prefix + 'ico ' + prefix + 'i-' + (self.settings.icon || 'none');
        iconhtml = text !== '-' ? '<i class="' + icon + '"' + image + '></i>\xa0' : '';
        text = boldmatches(self.encode(markmatches(text)));
        url = boldmatches(self.encode(markmatches(url)));
        return '<div id="' + id + '" class="' + self.classes + '" tabindex="-1">' + iconhtml + (text !== '-' ? '<span id="' + id + '-text" class="' + prefix + 'text">' + text + '</span>' : '') + (shortcut ? '<div id="' + id + '-shortcut" class="' + prefix + 'menu-shortcut">' + shortcut + '</div>' : '') + (settings.menu ? '<div class="' + prefix + 'caret"></div>' : '') + (url ? '<div class="' + prefix + 'menu-item-link">' + url + '</div>' : '') + '</div>';
      },
      postrender: function () {
        var self = this, settings = self.settings;
        var textstyle = settings.textstyle;
        if (typeof textstyle === 'function') {
          textstyle = textstyle.call(this);
        }
        if (textstyle) {
          var textelm = self.getel('text');
          if (textelm) {
            textelm.setattribute('style', textstyle);
            self._textstyle = textstyle;
          }
        }
        self.on('mouseenter click', function (e) {
          if (e.control === self) {
            if (!settings.menu && e.type === 'click') {
              self.fire('select');
              global$3.requestanimationframe(function () {
                self.parent().hideall();
              });
            } else {
              self.showmenu();
              if (e.aria) {
                self.menu.focus(true);
              }
            }
          }
        });
        self._super();
        return self;
      },
      hover: function () {
        var self = this;
        self.parent().items().each(function (ctrl) {
          ctrl.classes.remove('selected');
        });
        self.classes.toggle('selected', true);
        return self;
      },
      active: function (state) {
        toggletextstyle(this, state);
        if (typeof state !== 'undefined') {
          this.aria('checked', state);
        }
        return this._super(state);
      },
      remove: function () {
        this._super();
        if (this.menu) {
          this.menu.remove();
        }
      }
    });

    var radio = checkbox.extend({
      defaults: {
        classes: 'radio',
        role: 'radio'
      }
    });

    var resizehandle = widget.extend({
      renderhtml: function () {
        var self = this, prefix = self.classprefix;
        self.classes.add('resizehandle');
        if (self.settings.direction === 'both') {
          self.classes.add('resizehandle-both');
        }
        self.canfocus = false;
        return '<div id="' + self._id + '" class="' + self.classes + '">' + '<i class="' + prefix + 'ico ' + prefix + 'i-resize"></i>' + '</div>';
      },
      postrender: function () {
        var self = this;
        self._super();
        self.resizedraghelper = new draghelper(this._id, {
          start: function () {
            self.fire('resizestart');
          },
          drag: function (e) {
            if (self.settings.direction !== 'both') {
              e.deltax = 0;
            }
            self.fire('resize', e);
          },
          stop: function () {
            self.fire('resizeend');
          }
        });
      },
      remove: function () {
        if (this.resizedraghelper) {
          this.resizedraghelper.destroy();
        }
        return this._super();
      }
    });

    function createoptions(options) {
      var stroptions = '';
      if (options) {
        for (var i = 0; i < options.length; i++) {
          stroptions += '<option value="' + options[i] + '">' + options[i] + '</option>';
        }
      }
      return stroptions;
    }
    var selectbox = widget.extend({
      defaults: {
        classes: 'selectbox',
        role: 'selectbox',
        options: []
      },
      init: function (settings) {
        var self = this;
        self._super(settings);
        if (self.settings.size) {
          self.size = self.settings.size;
        }
        if (self.settings.options) {
          self._options = self.settings.options;
        }
        self.on('keydown', function (e) {
          var rootcontrol;
          if (e.keycode === 13) {
            e.preventdefault();
            self.parents().reverse().each(function (ctrl) {
              if (ctrl.tojson) {
                rootcontrol = ctrl;
                return false;
              }
            });
            self.fire('submit', { data: rootcontrol.tojson() });
          }
        });
      },
      options: function (state) {
        if (!arguments.length) {
          return this.state.get('options');
        }
        this.state.set('options', state);
        return this;
      },
      renderhtml: function () {
        var self = this;
        var options, size = '';
        options = createoptions(self._options);
        if (self.size) {
          size = ' size = "' + self.size + '"';
        }
        return '<select id="' + self._id + '" class="' + self.classes + '"' + size + '>' + options + '</select>';
      },
      bindstates: function () {
        var self = this;
        self.state.on('change:options', function (e) {
          self.getel().innerhtml = createoptions(e.value);
        });
        return self._super();
      }
    });

    function constrain(value, minval, maxval) {
      if (value < minval) {
        value = minval;
      }
      if (value > maxval) {
        value = maxval;
      }
      return value;
    }
    function setariaprop(el, name, value) {
      el.setattribute('aria-' + name, value);
    }
    function updatesliderhandle(ctrl, value) {
      var maxhandlepos, shortsizename, sizename, styleposname, stylevalue, handleel;
      if (ctrl.settings.orientation === 'v') {
        styleposname = 'top';
        sizename = 'height';
        shortsizename = 'h';
      } else {
        styleposname = 'left';
        sizename = 'width';
        shortsizename = 'w';
      }
      handleel = ctrl.getel('handle');
      maxhandlepos = (ctrl.layoutrect()[shortsizename] || 100) - funcs.getsize(handleel)[sizename];
      stylevalue = maxhandlepos * ((value - ctrl._minvalue) / (ctrl._maxvalue - ctrl._minvalue)) + 'px';
      handleel.style[styleposname] = stylevalue;
      handleel.style.height = ctrl.layoutrect().h + 'px';
      setariaprop(handleel, 'valuenow', value);
      setariaprop(handleel, 'valuetext', '' + ctrl.settings.previewfilter(value));
      setariaprop(handleel, 'valuemin', ctrl._minvalue);
      setariaprop(handleel, 'valuemax', ctrl._maxvalue);
    }
    var slider = widget.extend({
      init: function (settings) {
        var self = this;
        if (!settings.previewfilter) {
          settings.previewfilter = function (value) {
            return math.round(value * 100) / 100;
          };
        }
        self._super(settings);
        self.classes.add('slider');
        if (settings.orientation === 'v') {
          self.classes.add('vertical');
        }
        self._minvalue = isnumber$1(settings.minvalue) ? settings.minvalue : 0;
        self._maxvalue = isnumber$1(settings.maxvalue) ? settings.maxvalue : 100;
        self._initvalue = self.state.get('value');
      },
      renderhtml: function () {
        var self = this, id = self._id, prefix = self.classprefix;
        return '<div id="' + id + '" class="' + self.classes + '">' + '<div id="' + id + '-handle" class="' + prefix + 'slider-handle" role="slider" tabindex="-1"></div>' + '</div>';
      },
      reset: function () {
        this.value(this._initvalue).repaint();
      },
      postrender: function () {
        var self = this;
        var minvalue, maxvalue, screencordname, styleposname, sizename, shortsizename;
        function tofraction(min, max, val) {
          return (val + min) / (max - min);
        }
        function fromfraction(min, max, val) {
          return val * (max - min) - min;
        }
        function handlekeyboard(minvalue, maxvalue) {
          function alter(delta) {
            var value;
            value = self.value();
            value = fromfraction(minvalue, maxvalue, tofraction(minvalue, maxvalue, value) + delta * 0.05);
            value = constrain(value, minvalue, maxvalue);
            self.value(value);
            self.fire('dragstart', { value: value });
            self.fire('drag', { value: value });
            self.fire('dragend', { value: value });
          }
          self.on('keydown', function (e) {
            switch (e.keycode) {
            case 37:
            case 38:
              alter(-1);
              break;
            case 39:
            case 40:
              alter(1);
              break;
            }
          });
        }
        function handledrag(minvalue, maxvalue, handleel) {
          var startpos, starthandlepos, maxhandlepos, handlepos, value;
          self._draghelper = new draghelper(self._id, {
            handle: self._id + '-handle',
            start: function (e) {
              startpos = e[screencordname];
              starthandlepos = parseint(self.getel('handle').style[styleposname], 10);
              maxhandlepos = (self.layoutrect()[shortsizename] || 100) - funcs.getsize(handleel)[sizename];
              self.fire('dragstart', { value: value });
            },
            drag: function (e) {
              var delta = e[screencordname] - startpos;
              handlepos = constrain(starthandlepos + delta, 0, maxhandlepos);
              handleel.style[styleposname] = handlepos + 'px';
              value = minvalue + handlepos / maxhandlepos * (maxvalue - minvalue);
              self.value(value);
              self.tooltip().text('' + self.settings.previewfilter(value)).show().moverel(handleel, 'bc tc');
              self.fire('drag', { value: value });
            },
            stop: function () {
              self.tooltip().hide();
              self.fire('dragend', { value: value });
            }
          });
        }
        minvalue = self._minvalue;
        maxvalue = self._maxvalue;
        if (self.settings.orientation === 'v') {
          screencordname = 'screeny';
          styleposname = 'top';
          sizename = 'height';
          shortsizename = 'h';
        } else {
          screencordname = 'screenx';
          styleposname = 'left';
          sizename = 'width';
          shortsizename = 'w';
        }
        self._super();
        handlekeyboard(minvalue, maxvalue);
        handledrag(minvalue, maxvalue, self.getel('handle'));
      },
      repaint: function () {
        this._super();
        updatesliderhandle(this, this.value());
      },
      bindstates: function () {
        var self = this;
        self.state.on('change:value', function (e) {
          updatesliderhandle(self, e.value);
        });
        return self._super();
      }
    });

    var spacer = widget.extend({
      renderhtml: function () {
        var self = this;
        self.classes.add('spacer');
        self.canfocus = false;
        return '<div id="' + self._id + '" class="' + self.classes + '"></div>';
      }
    });

    var splitbutton = menubutton.extend({
      defaults: {
        classes: 'widget btn splitbtn',
        role: 'button'
      },
      repaint: function () {
        var self = this;
        var elm = self.getel();
        var rect = self.layoutrect();
        var mainbuttonelm, menubuttonelm;
        self._super();
        mainbuttonelm = elm.firstchild;
        menubuttonelm = elm.lastchild;
        global$7(mainbuttonelm).css({
          width: rect.w - funcs.getsize(menubuttonelm).width,
          height: rect.h - 2
        });
        global$7(menubuttonelm).css({ height: rect.h - 2 });
        return self;
      },
      activemenu: function (state) {
        var self = this;
        global$7(self.getel().lastchild).toggleclass(self.classprefix + 'active', state);
      },
      renderhtml: function () {
        var self = this;
        var id = self._id;
        var prefix = self.classprefix;
        var image;
        var icon = self.state.get('icon');
        var text = self.state.get('text');
        var settings = self.settings;
        var texthtml = '', ariapressed;
        image = settings.image;
        if (image) {
          icon = 'none';
          if (typeof image !== 'string') {
            image = domglobals.window.getselection ? image[0] : image[1];
          }
          image = ' style="background-image: url(\'' + image + '\')"';
        } else {
          image = '';
        }
        icon = settings.icon ? prefix + 'ico ' + prefix + 'i-' + icon : '';
        if (text) {
          self.classes.add('btn-has-text');
          texthtml = '<span class="' + prefix + 'txt">' + self.encode(text) + '</span>';
        }
        ariapressed = typeof settings.active === 'boolean' ? ' aria-pressed="' + settings.active + '"' : '';
        return '<div id="' + id + '" class="' + self.classes + '" role="button"' + ariapressed + ' tabindex="-1">' + '<button type="button" hidefocus="1" tabindex="-1">' + (icon ? '<i class="' + icon + '"' + image + '></i>' : '') + texthtml + '</button>' + '<button type="button" class="' + prefix + 'open" hidefocus="1" tabindex="-1">' + (self._menubtntext ? (icon ? '\xa0' : '') + self._menubtntext : '') + ' <i class="' + prefix + 'caret"></i>' + '</button>' + '</div>';
      },
      postrender: function () {
        var self = this, onclickhandler = self.settings.onclick;
        self.on('click', function (e) {
          var node = e.target;
          if (e.control === this) {
            while (node) {
              if (e.aria && e.aria.key !== 'down' || node.nodename === 'button' && node.classname.indexof('open') === -1) {
                e.stopimmediatepropagation();
                if (onclickhandler) {
                  onclickhandler.call(this, e);
                }
                return;
              }
              node = node.parentnode;
            }
          }
        });
        delete self.settings.onclick;
        return self._super();
      }
    });

    var stacklayout = flowlayout.extend({
      defaults: {
        containerclass: 'stack-layout',
        controlclass: 'stack-layout-item',
        endclass: 'break'
      },
      isnative: function () {
        return true;
      }
    });

    var tabpanel = panel.extend({
      defaults: {
        layout: 'absolute',
        defaults: { type: 'panel' }
      },
      activatetab: function (idx) {
        var activetabelm;
        if (this.activetabid) {
          activetabelm = this.getel(this.activetabid);
          global$7(activetabelm).removeclass(this.classprefix + 'active');
          activetabelm.setattribute('aria-selected', 'false');
        }
        this.activetabid = 't' + idx;
        activetabelm = this.getel('t' + idx);
        activetabelm.setattribute('aria-selected', 'true');
        global$7(activetabelm).addclass(this.classprefix + 'active');
        this.items()[idx].show().fire('showtab');
        this.reflow();
        this.items().each(function (item, i) {
          if (idx !== i) {
            item.hide();
          }
        });
      },
      renderhtml: function () {
        var self = this;
        var layout = self._layout;
        var tabshtml = '';
        var prefix = self.classprefix;
        self.prerender();
        layout.prerender(self);
        self.items().each(function (ctrl, i) {
          var id = self._id + '-t' + i;
          ctrl.aria('role', 'tabpanel');
          ctrl.aria('labelledby', id);
          tabshtml += '<div id="' + id + '" class="' + prefix + 'tab" ' + 'unselectable="on" role="tab" aria-controls="' + ctrl._id + '" aria-selected="false" tabindex="-1">' + self.encode(ctrl.settings.title) + '</div>';
        });
        return '<div id="' + self._id + '" class="' + self.classes + '" hidefocus="1" tabindex="-1">' + '<div id="' + self._id + '-head" class="' + prefix + 'tabs" role="tablist">' + tabshtml + '</div>' + '<div id="' + self._id + '-body" class="' + self.bodyclasses + '">' + layout.renderhtml(self) + '</div>' + '</div>';
      },
      postrender: function () {
        var self = this;
        self._super();
        self.settings.activetab = self.settings.activetab || 0;
        self.activatetab(self.settings.activetab);
        this.on('click', function (e) {
          var targetparent = e.target.parentnode;
          if (targetparent && targetparent.id === self._id + '-head') {
            var i = targetparent.childnodes.length;
            while (i--) {
              if (targetparent.childnodes[i] === e.target) {
                self.activatetab(i);
              }
            }
          }
        });
      },
      initlayoutrect: function () {
        var self = this;
        var rect, minw, minh;
        minw = funcs.getsize(self.getel('head')).width;
        minw = minw < 0 ? 0 : minw;
        minh = 0;
        self.items().each(function (item) {
          minw = math.max(minw, item.layoutrect().minw);
          minh = math.max(minh, item.layoutrect().minh);
        });
        self.items().each(function (ctrl) {
          ctrl.settings.x = 0;
          ctrl.settings.y = 0;
          ctrl.settings.w = minw;
          ctrl.settings.h = minh;
          ctrl.layoutrect({
            x: 0,
            y: 0,
            w: minw,
            h: minh
          });
        });
        var headh = funcs.getsize(self.getel('head')).height;
        self.settings.minwidth = minw;
        self.settings.minheight = minh + headh;
        rect = self._super();
        rect.deltah += headh;
        rect.innerh = rect.h - rect.deltah;
        return rect;
      }
    });

    var textbox = widget.extend({
      init: function (settings) {
        var self = this;
        self._super(settings);
        self.classes.add('textbox');
        if (settings.multiline) {
          self.classes.add('multiline');
        } else {
          self.on('keydown', function (e) {
            var rootcontrol;
            if (e.keycode === 13) {
              e.preventdefault();
              self.parents().reverse().each(function (ctrl) {
                if (ctrl.tojson) {
                  rootcontrol = ctrl;
                  return false;
                }
              });
              self.fire('submit', { data: rootcontrol.tojson() });
            }
          });
          self.on('keyup', function (e) {
            self.state.set('value', e.target.value);
          });
        }
      },
      repaint: function () {
        var self = this;
        var style, rect, borderbox, borderw, borderh = 0, lastrepaintrect;
        style = self.getel().style;
        rect = self._layoutrect;
        lastrepaintrect = self._lastrepaintrect || {};
        var doc = domglobals.document;
        if (!self.settings.multiline && doc.all && (!doc.documentmode || doc.documentmode <= 8)) {
          style.lineheight = rect.h - borderh + 'px';
        }
        borderbox = self.borderbox;
        borderw = borderbox.left + borderbox.right + 8;
        borderh = borderbox.top + borderbox.bottom + (self.settings.multiline ? 8 : 0);
        if (rect.x !== lastrepaintrect.x) {
          style.left = rect.x + 'px';
          lastrepaintrect.x = rect.x;
        }
        if (rect.y !== lastrepaintrect.y) {
          style.top = rect.y + 'px';
          lastrepaintrect.y = rect.y;
        }
        if (rect.w !== lastrepaintrect.w) {
          style.width = rect.w - borderw + 'px';
          lastrepaintrect.w = rect.w;
        }
        if (rect.h !== lastrepaintrect.h) {
          style.height = rect.h - borderh + 'px';
          lastrepaintrect.h = rect.h;
        }
        self._lastrepaintrect = lastrepaintrect;
        self.fire('repaint', {}, false);
        return self;
      },
      renderhtml: function () {
        var self = this;
        var settings = self.settings;
        var attrs, elm;
        attrs = {
          id: self._id,
          hidefocus: '1'
        };
        global$4.each([
          'rows',
          'spellcheck',
          'maxlength',
          'size',
          'readonly',
          'min',
          'max',
          'step',
          'list',
          'pattern',
          'placeholder',
          'required',
          'multiple'
        ], function (name) {
          attrs[name] = settings[name];
        });
        if (self.disabled()) {
          attrs.disabled = 'disabled';
        }
        if (settings.subtype) {
          attrs.type = settings.subtype;
        }
        elm = funcs.create(settings.multiline ? 'textarea' : 'input', attrs);
        elm.value = self.state.get('value');
        elm.classname = self.classes.tostring();
        return elm.outerhtml;
      },
      value: function (value) {
        if (arguments.length) {
          this.state.set('value', value);
          return this;
        }
        if (this.state.get('rendered')) {
          this.state.set('value', this.getel().value);
        }
        return this.state.get('value');
      },
      postrender: function () {
        var self = this;
        self.getel().value = self.state.get('value');
        self._super();
        self.$el.on('change', function (e) {
          self.state.set('value', e.target.value);
          self.fire('change', e);
        });
      },
      bindstates: function () {
        var self = this;
        self.state.on('change:value', function (e) {
          if (self.getel().value !== e.value) {
            self.getel().value = e.value;
          }
        });
        self.state.on('change:disabled', function (e) {
          self.getel().disabled = e.value;
        });
        return self._super();
      },
      remove: function () {
        this.$el.off();
        this._super();
      }
    });

    var getapi = function () {
      return {
        selector: selector,
        collection: collection$2,
        reflowqueue: reflowqueue,
        control: control$1,
        factory: global$b,
        keyboardnavigation: keyboardnavigation,
        container: container,
        draghelper: draghelper,
        scrollable: scrollable,
        panel: panel,
        movable: movable,
        resizable: resizable,
        floatpanel: floatpanel,
        window: window,
        messagebox: messagebox,
        tooltip: tooltip,
        widget: widget,
        progress: progress,
        notification: notification,
        layout: layout$1,
        absolutelayout: absolutelayout,
        button: button,
        buttongroup: buttongroup,
        checkbox: checkbox,
        combobox: combobox,
        colorbox: colorbox,
        panelbutton: panelbutton,
        colorbutton: colorbutton,
        colorpicker: colorpicker,
        path: path,
        elementpath: elementpath,
        formitem: formitem,
        form: form,
        fieldset: fieldset,
        filepicker: filepicker,
        fitlayout: fitlayout,
        flexlayout: flexlayout,
        flowlayout: flowlayout,
        formatcontrols: formatcontrols,
        gridlayout: gridlayout,
        iframe: iframe,
        infobox: infobox,
        label: label,
        toolbar: toolbar$1,
        menubar: menubar,
        menubutton: menubutton,
        menuitem: menuitem,
        throbber: throbber,
        menu: menu,
        listbox: listbox,
        radio: radio,
        resizehandle: resizehandle,
        selectbox: selectbox,
        slider: slider,
        spacer: spacer,
        splitbutton: splitbutton,
        stacklayout: stacklayout,
        tabpanel: tabpanel,
        textbox: textbox,
        dropzone: dropzone,
        browsebutton: browsebutton
      };
    };
    var appendto = function (target) {
      if (target.ui) {
        global$4.each(getapi(), function (ref, key) {
          target.ui[key] = ref;
        });
      } else {
        target.ui = getapi();
      }
    };
    var registertofactory = function () {
      global$4.each(getapi(), function (ref, key) {
        global$b.add(key, ref);
      });
    };
    var api = {
      appendto: appendto,
      registertofactory: registertofactory
    };

    api.registertofactory();
    api.appendto(window.tinymce ? window.tinymce : {});
    global.add('inlite', function (editor) {
      var panel = create$3();
      formatcontrols.setup(editor);
      buttons.addtoeditor(editor, panel);
      return themeapi.get(editor, panel);
    });
    function theme () {
    }

    return theme;

}(window));
})();





