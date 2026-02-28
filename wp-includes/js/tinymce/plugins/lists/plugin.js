(function () {
var lists = (function (domglobals) {
    'use strict';

    var global = tinymce.util.tools.resolve('tinymce.pluginmanager');

    var global$1 = tinymce.util.tools.resolve('tinymce.dom.rangeutils');

    var global$2 = tinymce.util.tools.resolve('tinymce.dom.treewalker');

    var global$3 = tinymce.util.tools.resolve('tinymce.util.vk');

    var global$4 = tinymce.util.tools.resolve('tinymce.dom.bookmarkmanager');

    var global$5 = tinymce.util.tools.resolve('tinymce.util.tools');

    var global$6 = tinymce.util.tools.resolve('tinymce.dom.domutils');

    var istextnode = function (node) {
      return node && node.nodetype === 3;
    };
    var islistnode = function (node) {
      return node && /^(ol|ul|dl)$/.test(node.nodename);
    };
    var isolulnode = function (node) {
      return node && /^(ol|ul)$/.test(node.nodename);
    };
    var islistitemnode = function (node) {
      return node && /^(li|dt|dd)$/.test(node.nodename);
    };
    var isdlitemnode = function (node) {
      return node && /^(dt|dd)$/.test(node.nodename);
    };
    var istablecellnode = function (node) {
      return node && /^(th|td)$/.test(node.nodename);
    };
    var isbr = function (node) {
      return node && node.nodename === 'br';
    };
    var isfirstchild = function (node) {
      return node.parentnode.firstchild === node;
    };
    var islastchild = function (node) {
      return node.parentnode.lastchild === node;
    };
    var istextblock = function (editor, node) {
      return node && !!editor.schema.gettextblockelements()[node.nodename];
    };
    var isblock = function (node, blockelements) {
      return node && node.nodename in blockelements;
    };
    var isbogusbr = function (dom, node) {
      if (!isbr(node)) {
        return false;
      }
      if (dom.isblock(node.nextsibling) && !isbr(node.previoussibling)) {
        return true;
      }
      return false;
    };
    var isempty = function (dom, elm, keepbookmarks) {
      var empty = dom.isempty(elm);
      if (keepbookmarks && dom.select('span[data-mce-type=bookmark]', elm).length > 0) {
        return false;
      }
      return empty;
    };
    var ischildofbody = function (dom, elm) {
      return dom.ischildof(elm, dom.getroot());
    };
    var nodetype = {
      istextnode: istextnode,
      islistnode: islistnode,
      isolulnode: isolulnode,
      isdlitemnode: isdlitemnode,
      islistitemnode: islistitemnode,
      istablecellnode: istablecellnode,
      isbr: isbr,
      isfirstchild: isfirstchild,
      islastchild: islastchild,
      istextblock: istextblock,
      isblock: isblock,
      isbogusbr: isbogusbr,
      isempty: isempty,
      ischildofbody: ischildofbody
    };

    var getnormalizedpoint = function (container, offset) {
      if (nodetype.istextnode(container)) {
        return {
          container: container,
          offset: offset
        };
      }
      var node = global$1.getnode(container, offset);
      if (nodetype.istextnode(node)) {
        return {
          container: node,
          offset: offset >= container.childnodes.length ? node.data.length : 0
        };
      } else if (node.previoussibling && nodetype.istextnode(node.previoussibling)) {
        return {
          container: node.previoussibling,
          offset: node.previoussibling.data.length
        };
      } else if (node.nextsibling && nodetype.istextnode(node.nextsibling)) {
        return {
          container: node.nextsibling,
          offset: 0
        };
      }
      return {
        container: container,
        offset: offset
      };
    };
    var normalizerange = function (rng) {
      var outrng = rng.clonerange();
      var rangestart = getnormalizedpoint(rng.startcontainer, rng.startoffset);
      outrng.setstart(rangestart.container, rangestart.offset);
      var rangeend = getnormalizedpoint(rng.endcontainer, rng.endoffset);
      outrng.setend(rangeend.container, rangeend.offset);
      return outrng;
    };
    var range = {
      getnormalizedpoint: getnormalizedpoint,
      normalizerange: normalizerange
    };

    var dom = global$6.dom;
    var createbookmark = function (rng) {
      var bookmark = {};
      var setupendpoint = function (start) {
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
      };
      setupendpoint(true);
      if (!rng.collapsed) {
        setupendpoint();
      }
      return bookmark;
    };
    var resolvebookmark = function (bookmark) {
      function restoreendpoint(start) {
        var container, offset, node;
        var nodeindex = function (container) {
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
        };
        container = node = bookmark[start ? 'startcontainer' : 'endcontainer'];
        offset = bookmark[start ? 'startoffset' : 'endoffset'];
        if (!container) {
          return;
        }
        if (container.nodetype === 1) {
          offset = nodeindex(container);
          container = container.parentnode;
          dom.remove(node);
          if (!container.haschildnodes() && dom.isblock(container)) {
            container.appendchild(dom.create('br'));
          }
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
      return range.normalizerange(rng);
    };
    var bookmark = {
      createbookmark: createbookmark,
      resolvebookmark: resolvebookmark
    };

    var noop = function () {
    };
    var constant = function (value) {
      return function () {
        return value;
      };
    };
    var not = function (f) {
      return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return !f.apply(null, args);
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
    var istype = function (type) {
      return function (value) {
        return typeof(value) === type;
      };
    };
    var isstring = istype('string');
    var isarray = istype('array');
    var isboolean = istype('boolean');
    var isfunction = istype('function');
    var isnumber = istype('number');

    var nativeslice = array.prototype.slice;
    var nativepush = array.prototype.push;
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
    var groupby = function (xs, f) {
      if (xs.length === 0) {
        return [];
      } else {
        var wastype = f(xs[0]);
        var r = [];
        var group = [];
        for (var i = 0, len = xs.length; i < len; i++) {
          var x = xs[i];
          var type = f(x);
          if (type !== wastype) {
            r.push(group);
            group = [];
          }
          wastype = type;
          group.push(x);
        }
        if (group.length !== 0) {
          r.push(group);
        }
        return r;
      }
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
    var flatten = function (xs) {
      var r = [];
      for (var i = 0, len = xs.length; i < len; ++i) {
        if (!isarray(xs[i])) {
          throw new error('arr.flatten item ' + i + ' was not an array, input: ' + xs);
        }
        nativepush.apply(r, xs[i]);
      }
      return r;
    };
    var bind = function (xs, f) {
      var output = map(xs, f);
      return flatten(output);
    };
    var reverse = function (xs) {
      var r = nativeslice.call(xs, 0);
      r.reverse();
      return r;
    };
    var head = function (xs) {
      return xs.length === 0 ? option.none() : option.some(xs[0]);
    };
    var last = function (xs) {
      return xs.length === 0 ? option.none() : option.some(xs[xs.length - 1]);
    };
    var from$1 = isfunction(array.from) ? array.from : function (x) {
      return nativeslice.call(x);
    };

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

    var htmlelement = function (scope) {
      return global$1.getordie('htmlelement', scope);
    };
    var isprototypeof = function (x) {
      var scope = resolve('ownerdocument.defaultview', x);
      return htmlelement(scope).prototype.isprototypeof(x);
    };
    var htmlelement = { isprototypeof: isprototypeof };

    var global$7 = tinymce.util.tools.resolve('tinymce.dom.domquery');

    var getparentlist = function (editor) {
      var selectionstart = editor.selection.getstart(true);
      return editor.dom.getparent(selectionstart, 'ol,ul,dl', getclosestlistrootelm(editor, selectionstart));
    };
    var isparentlistselected = function (parentlist, selectedblocks) {
      return parentlist && selectedblocks.length === 1 && selectedblocks[0] === parentlist;
    };
    var findsublists = function (parentlist) {
      return global$5.grep(parentlist.queryselectorall('ol,ul,dl'), function (elm) {
        return nodetype.islistnode(elm);
      });
    };
    var getselectedsublists = function (editor) {
      var parentlist = getparentlist(editor);
      var selectedblocks = editor.selection.getselectedblocks();
      if (isparentlistselected(parentlist, selectedblocks)) {
        return findsublists(parentlist);
      } else {
        return global$5.grep(selectedblocks, function (elm) {
          return nodetype.islistnode(elm) && parentlist !== elm;
        });
      }
    };
    var findparentlistitemsnodes = function (editor, elms) {
      var listitemselms = global$5.map(elms, function (elm) {
        var parentli = editor.dom.getparent(elm, 'li,dd,dt', getclosestlistrootelm(editor, elm));
        return parentli ? parentli : elm;
      });
      return global$7.unique(listitemselms);
    };
    var getselectedlistitems = function (editor) {
      var selectedblocks = editor.selection.getselectedblocks();
      return global$5.grep(findparentlistitemsnodes(editor, selectedblocks), function (block) {
        return nodetype.islistitemnode(block);
      });
    };
    var getselecteddlitems = function (editor) {
      return filter(getselectedlistitems(editor), nodetype.isdlitemnode);
    };
    var getclosestlistrootelm = function (editor, elm) {
      var parenttablecell = editor.dom.getparents(elm, 'td,th');
      var root = parenttablecell.length > 0 ? parenttablecell[0] : editor.getbody();
      return root;
    };
    var findlastparentlistnode = function (editor, elm) {
      var parentlists = editor.dom.getparents(elm, 'ol,ul', getclosestlistrootelm(editor, elm));
      return last(parentlists);
    };
    var getselectedlists = function (editor) {
      var firstlist = findlastparentlistnode(editor, editor.selection.getstart());
      var subsequentlists = filter(editor.selection.getselectedblocks(), nodetype.isolulnode);
      return firstlist.toarray().concat(subsequentlists);
    };
    var getselectedlistroots = function (editor) {
      var selectedlists = getselectedlists(editor);
      return getuniquelistroots(editor, selectedlists);
    };
    var getuniquelistroots = function (editor, lists) {
      var listroots = map(lists, function (list) {
        return findlastparentlistnode(editor, list).getor(list);
      });
      return global$7.unique(listroots);
    };
    var islist = function (editor) {
      var list = getparentlist(editor);
      return htmlelement.isprototypeof(list);
    };
    var selection = {
      islist: islist,
      getparentlist: getparentlist,
      getselectedsublists: getselectedsublists,
      getselectedlistitems: getselectedlistitems,
      getclosestlistrootelm: getclosestlistrootelm,
      getselecteddlitems: getselecteddlitems,
      getselectedlistroots: getselectedlistroots
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

    var lift2 = function (oa, ob, f) {
      return oa.issome() && ob.issome() ? option.some(f(oa.getordie(), ob.getordie())) : option.none();
    };

    var fromelements = function (elements, scope) {
      var doc = scope || domglobals.document;
      var fragment = doc.createdocumentfragment();
      each(elements, function (element) {
        fragment.appendchild(element.dom());
      });
      return element.fromdom(fragment);
    };

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

    var keys = object.keys;
    var each$1 = function (obj, f) {
      var props = keys(obj);
      for (var k = 0, len = props.length; k < len; k++) {
        var i = props[k];
        var x = obj[i];
        f(x, i);
      }
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

    var windows = 'windows';
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
        iswindows: isos(windows, current),
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
      windows: constant(windows),
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

    var element$1 = element;
    var is = function (element, selector) {
      var dom = element.dom();
      if (dom.nodetype !== element$1) {
        return false;
      } else {
        var elem = dom;
        if (elem.matches !== undefined) {
          return elem.matches(selector);
        } else if (elem.msmatchesselector !== undefined) {
          return elem.msmatchesselector(selector);
        } else if (elem.webkitmatchesselector !== undefined) {
          return elem.webkitmatchesselector(selector);
        } else if (elem.mozmatchesselector !== undefined) {
          return elem.mozmatchesselector(selector);
        } else {
          throw new error('browser lacks native selectors');
        }
      }
    };

    var eq = function (e1, e2) {
      return e1.dom() === e2.dom();
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
    var is$1 = is;

    var parent = function (element) {
      return option.from(element.dom().parentnode).map(element.fromdom);
    };
    var children = function (element) {
      return map(element.dom().childnodes, element.fromdom);
    };
    var child = function (element, index) {
      var cs = element.dom().childnodes;
      return option.from(cs[index]).map(element.fromdom);
    };
    var firstchild = function (element) {
      return child(element, 0);
    };
    var lastchild = function (element) {
      return child(element, element.dom().childnodes.length - 1);
    };
    var spot = immutable('element', 'offset');

    var before = function (marker, element) {
      var parent$1 = parent(marker);
      parent$1.each(function (v) {
        v.dom().insertbefore(element.dom(), marker.dom());
      });
    };
    var append = function (parent, element) {
      parent.dom().appendchild(element.dom());
    };

    var before$1 = function (marker, elements) {
      each(elements, function (x) {
        before(marker, x);
      });
    };
    var append$1 = function (parent, elements) {
      each(elements, function (x) {
        append(parent, x);
      });
    };

    var remove = function (element) {
      var dom = element.dom();
      if (dom.parentnode !== null) {
        dom.parentnode.removechild(dom);
      }
    };

    var name = function (element) {
      var r = element.dom().nodename;
      return r.tolowercase();
    };
    var type = function (element) {
      return element.dom().nodetype;
    };
    var istype$1 = function (t) {
      return function (element) {
        return type(element) === t;
      };
    };
    var iselement = istype$1(element);

    var rawset = function (dom, key, value) {
      if (isstring(value) || isboolean(value) || isnumber(value)) {
        dom.setattribute(key, value + '');
      } else {
        domglobals.console.error('invalid call to attr.set. key ', key, ':: value ', value, ':: element ', dom);
        throw new error('attribute value was not simple');
      }
    };
    var setall = function (element, attrs) {
      var dom = element.dom();
      each$1(attrs, function (v, k) {
        rawset(dom, k, v);
      });
    };
    var clone = function (element) {
      return foldl(element.dom().attributes, function (acc, attr) {
        acc[attr.name] = attr.value;
        return acc;
      }, {});
    };

    var issupported = function (dom) {
      return dom.style !== undefined && isfunction(dom.style.getpropertyvalue);
    };

    var internalset = function (dom, property, value) {
      if (!isstring(value)) {
        domglobals.console.error('invalid call to css.set. property ', property, ':: value ', value, ':: element ', dom);
        throw new error('css value must be a string: ' + value);
      }
      if (issupported(dom)) {
        dom.style.setproperty(property, value);
      }
    };
    var set = function (element, property, value) {
      var dom = element.dom();
      internalset(dom, property, value);
    };

    var clone$1 = function (original, isdeep) {
      return element.fromdom(original.dom().clonenode(isdeep));
    };
    var deep = function (original) {
      return clone$1(original, true);
    };
    var shallowas = function (original, tag) {
      var nu = element.fromtag(tag);
      var attributes = clone(original);
      setall(nu, attributes);
      return nu;
    };
    var mutate = function (original, tag) {
      var nu = shallowas(original, tag);
      before(original, nu);
      var children$1 = children(original);
      append$1(nu, children$1);
      remove(original);
      return nu;
    };

    var joinsegment = function (parent, child) {
      append(parent.item, child.list);
    };
    var joinsegments = function (segments) {
      for (var i = 1; i < segments.length; i++) {
        joinsegment(segments[i - 1], segments[i]);
      }
    };
    var appendsegments = function (head$1, tail) {
      lift2(last(head$1), head(tail), joinsegment);
    };
    var createsegment = function (scope, listtype) {
      var segment = {
        list: element.fromtag(listtype, scope),
        item: element.fromtag('li', scope)
      };
      append(segment.list, segment.item);
      return segment;
    };
    var createsegments = function (scope, entry, size) {
      var segments = [];
      for (var i = 0; i < size; i++) {
        segments.push(createsegment(scope, entry.listtype));
      }
      return segments;
    };
    var populatesegments = function (segments, entry) {
      for (var i = 0; i < segments.length - 1; i++) {
        set(segments[i].item, 'list-style-type', 'none');
      }
      last(segments).each(function (segment) {
        setall(segment.list, entry.listattributes);
        setall(segment.item, entry.itemattributes);
        append$1(segment.item, entry.content);
      });
    };
    var normalizesegment = function (segment, entry) {
      if (name(segment.list) !== entry.listtype) {
        segment.list = mutate(segment.list, entry.listtype);
      }
      setall(segment.list, entry.listattributes);
    };
    var createitem = function (scope, attr, content) {
      var item = element.fromtag('li', scope);
      setall(item, attr);
      append$1(item, content);
      return item;
    };
    var appenditem = function (segment, item) {
      append(segment.list, item);
      segment.item = item;
    };
    var writeshallow = function (scope, cast, entry) {
      var newcast = cast.slice(0, entry.depth);
      last(newcast).each(function (segment) {
        var item = createitem(scope, entry.itemattributes, entry.content);
        appenditem(segment, item);
        normalizesegment(segment, entry);
      });
      return newcast;
    };
    var writedeep = function (scope, cast, entry) {
      var segments = createsegments(scope, entry, entry.depth - cast.length);
      joinsegments(segments);
      populatesegments(segments, entry);
      appendsegments(cast, segments);
      return cast.concat(segments);
    };
    var composelist = function (scope, entries) {
      var cast = foldl(entries, function (cast, entry) {
        return entry.depth > cast.length ? writedeep(scope, cast, entry) : writeshallow(scope, cast, entry);
      }, []);
      return head(cast).map(function (segment) {
        return segment.list;
      });
    };

    var islist$1 = function (el) {
      return is$1(el, 'ol,ul');
    };
    var hasfirstchildlist = function (el) {
      return firstchild(el).map(islist$1).getor(false);
    };
    var haslastchildlist = function (el) {
      return lastchild(el).map(islist$1).getor(false);
    };

    var isindented = function (entry) {
      return entry.depth > 0;
    };
    var isselected = function (entry) {
      return entry.isselected;
    };
    var cloneitemcontent = function (li) {
      var children$1 = children(li);
      var content = haslastchildlist(li) ? children$1.slice(0, -1) : children$1;
      return map(content, deep);
    };
    var createentry = function (li, depth, isselected) {
      return parent(li).filter(iselement).map(function (list) {
        return {
          depth: depth,
          isselected: isselected,
          content: cloneitemcontent(li),
          itemattributes: clone(li),
          listattributes: clone(list),
          listtype: name(list)
        };
      });
    };

    var indententry = function (indentation, entry) {
      switch (indentation) {
      case 'indent':
        entry.depth++;
        break;
      case 'outdent':
        entry.depth--;
        break;
      case 'flatten':
        entry.depth = 0;
      }
    };

    var hasownproperty = object.prototype.hasownproperty;
    var shallow = function (old, nu) {
      return nu;
    };
    var basemerge = function (merger) {
      return function () {
        var objects = new array(arguments.length);
        for (var i = 0; i < objects.length; i++) {
          objects[i] = arguments[i];
        }
        if (objects.length === 0) {
          throw new error('can\'t merge zero objects');
        }
        var ret = {};
        for (var j = 0; j < objects.length; j++) {
          var curobject = objects[j];
          for (var key in curobject) {
            if (hasownproperty.call(curobject, key)) {
              ret[key] = merger(ret[key], curobject[key]);
            }
          }
        }
        return ret;
      };
    };
    var merge = basemerge(shallow);

    var clonelistproperties = function (target, source) {
      target.listtype = source.listtype;
      target.listattributes = merge({}, source.listattributes);
    };
    var previoussiblingentry = function (entries, start) {
      var depth = entries[start].depth;
      for (var i = start - 1; i >= 0; i--) {
        if (entries[i].depth === depth) {
          return option.some(entries[i]);
        }
        if (entries[i].depth < depth) {
          break;
        }
      }
      return option.none();
    };
    var normalizeentries = function (entries) {
      each(entries, function (entry, i) {
        previoussiblingentry(entries, i).each(function (matchingentry) {
          clonelistproperties(entry, matchingentry);
        });
      });
    };

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

    var parseitem = function (depth, itemselection, selectionstate, item) {
      return firstchild(item).filter(islist$1).fold(function () {
        itemselection.each(function (selection) {
          if (eq(selection.start, item)) {
            selectionstate.set(true);
          }
        });
        var currentitementry = createentry(item, depth, selectionstate.get());
        itemselection.each(function (selection) {
          if (eq(selection.end, item)) {
            selectionstate.set(false);
          }
        });
        var childlistentries = lastchild(item).filter(islist$1).map(function (list) {
          return parselist(depth, itemselection, selectionstate, list);
        }).getor([]);
        return currentitementry.toarray().concat(childlistentries);
      }, function (list) {
        return parselist(depth, itemselection, selectionstate, list);
      });
    };
    var parselist = function (depth, itemselection, selectionstate, list) {
      return bind(children(list), function (element) {
        var parser = islist$1(element) ? parselist : parseitem;
        var newdepth = depth + 1;
        return parser(newdepth, itemselection, selectionstate, element);
      });
    };
    var parselists = function (lists, itemselection) {
      var selectionstate = cell(false);
      var initialdepth = 0;
      return map(lists, function (list) {
        return {
          sourcelist: list,
          entries: parselist(initialdepth, itemselection, selectionstate, list)
        };
      });
    };

    var global$8 = tinymce.util.tools.resolve('tinymce.env');

    var createtextblock = function (editor, contentnode) {
      var dom = editor.dom;
      var blockelements = editor.schema.getblockelements();
      var fragment = dom.createfragment();
      var node, textblock, blockname, hascontentnode;
      if (editor.settings.forced_root_block) {
        blockname = editor.settings.forced_root_block;
      }
      if (blockname) {
        textblock = dom.create(blockname);
        if (textblock.tagname === editor.settings.forced_root_block) {
          dom.setattribs(textblock, editor.settings.forced_root_block_attrs);
        }
        if (!nodetype.isblock(contentnode.firstchild, blockelements)) {
          fragment.appendchild(textblock);
        }
      }
      if (contentnode) {
        while (node = contentnode.firstchild) {
          var nodename = node.nodename;
          if (!hascontentnode && (nodename !== 'span' || node.getattribute('data-mce-type') !== 'bookmark')) {
            hascontentnode = true;
          }
          if (nodetype.isblock(node, blockelements)) {
            fragment.appendchild(node);
            textblock = null;
          } else {
            if (blockname) {
              if (!textblock) {
                textblock = dom.create(blockname);
                fragment.appendchild(textblock);
              }
              textblock.appendchild(node);
            } else {
              fragment.appendchild(node);
            }
          }
        }
      }
      if (!editor.settings.forced_root_block) {
        fragment.appendchild(dom.create('br'));
      } else {
        if (!hascontentnode && (!global$8.ie || global$8.ie > 10)) {
          textblock.appendchild(dom.create('br', { 'data-mce-bogus': '1' }));
        }
      }
      return fragment;
    };

    var outdentedcomposer = function (editor, entries) {
      return map(entries, function (entry) {
        var content = fromelements(entry.content);
        return element.fromdom(createtextblock(editor, content.dom()));
      });
    };
    var indentedcomposer = function (editor, entries) {
      normalizeentries(entries);
      return composelist(editor.contentdocument, entries).toarray();
    };
    var composeentries = function (editor, entries) {
      return bind(groupby(entries, isindented), function (entries) {
        var groupisindented = head(entries).map(isindented).getor(false);
        return groupisindented ? indentedcomposer(editor, entries) : outdentedcomposer(editor, entries);
      });
    };
    var indentselectedentries = function (entries, indentation) {
      each(filter(entries, isselected), function (entry) {
        return indententry(indentation, entry);
      });
    };
    var getitemselection = function (editor) {
      var selectedlistitems = map(selection.getselectedlistitems(editor), element.fromdom);
      return lift2(find(selectedlistitems, not(hasfirstchildlist)), find(reverse(selectedlistitems), not(hasfirstchildlist)), function (start, end) {
        return {
          start: start,
          end: end
        };
      });
    };
    var listsindentation = function (editor, lists, indentation) {
      var entrysets = parselists(lists, getitemselection(editor));
      each(entrysets, function (entryset) {
        indentselectedentries(entryset.entries, indentation);
        before$1(entryset.sourcelist, composeentries(editor, entryset.entries));
        remove(entryset.sourcelist);
      });
    };

    var dom$1 = global$6.dom;
    var splitlist = function (editor, ul, li) {
      var tmprng, fragment, bookmarks, node, newblock;
      var removeandkeepbookmarks = function (targetnode) {
        global$5.each(bookmarks, function (node) {
          targetnode.parentnode.insertbefore(node, li.parentnode);
        });
        dom$1.remove(targetnode);
      };
      bookmarks = dom$1.select('span[data-mce-type="bookmark"]', ul);
      newblock = createtextblock(editor, li);
      tmprng = dom$1.createrng();
      tmprng.setstartafter(li);
      tmprng.setendafter(ul);
      fragment = tmprng.extractcontents();
      for (node = fragment.firstchild; node; node = node.firstchild) {
        if (node.nodename === 'li' && editor.dom.isempty(node)) {
          dom$1.remove(node);
          break;
        }
      }
      if (!editor.dom.isempty(fragment)) {
        dom$1.insertafter(fragment, ul);
      }
      dom$1.insertafter(newblock, ul);
      if (nodetype.isempty(editor.dom, li.parentnode)) {
        removeandkeepbookmarks(li.parentnode);
      }
      dom$1.remove(li);
      if (nodetype.isempty(editor.dom, ul)) {
        dom$1.remove(ul);
      }
    };
    var splitlist = { splitlist: splitlist };

    var outdentdlitem = function (editor, item) {
      if (is$1(item, 'dd')) {
        mutate(item, 'dt');
      } else if (is$1(item, 'dt')) {
        parent(item).each(function (dl) {
          return splitlist.splitlist(editor, dl.dom(), item.dom());
        });
      }
    };
    var indentdlitem = function (item) {
      if (is$1(item, 'dt')) {
        mutate(item, 'dd');
      }
    };
    var dlindentation = function (editor, indentation, dlitems) {
      if (indentation === 'indent') {
        each(dlitems, indentdlitem);
      } else {
        each(dlitems, function (item) {
          return outdentdlitem(editor, item);
        });
      }
    };

    var selectionindentation = function (editor, indentation) {
      var lists = map(selection.getselectedlistroots(editor), element.fromdom);
      var dlitems = map(selection.getselecteddlitems(editor), element.fromdom);
      var ishandled = false;
      if (lists.length || dlitems.length) {
        var bookmark = editor.selection.getbookmark();
        listsindentation(editor, lists, indentation);
        dlindentation(editor, indentation, dlitems);
        editor.selection.movetobookmark(bookmark);
        editor.selection.setrng(range.normalizerange(editor.selection.getrng()));
        editor.nodechanged();
        ishandled = true;
      }
      return ishandled;
    };
    var indentlistselection = function (editor) {
      return selectionindentation(editor, 'indent');
    };
    var outdentlistselection = function (editor) {
      return selectionindentation(editor, 'outdent');
    };
    var flattenlistselection = function (editor) {
      return selectionindentation(editor, 'flatten');
    };

    var updateliststyle = function (dom, el, detail) {
      var type = detail['list-style-type'] ? detail['list-style-type'] : null;
      dom.setstyle(el, 'list-style-type', type);
    };
    var setattribs = function (elm, attrs) {
      global$5.each(attrs, function (value, key) {
        elm.setattribute(key, value);
      });
    };
    var updatelistattrs = function (dom, el, detail) {
      setattribs(el, detail['list-attributes']);
      global$5.each(dom.select('li', el), function (li) {
        setattribs(li, detail['list-item-attributes']);
      });
    };
    var updatelistwithdetails = function (dom, el, detail) {
      updateliststyle(dom, el, detail);
      updatelistattrs(dom, el, detail);
    };
    var removestyles = function (dom, element, styles) {
      global$5.each(styles, function (style) {
        var _a;
        return dom.setstyle(element, (_a = {}, _a[style] = '', _a));
      });
    };
    var getendpointnode = function (editor, rng, start, root) {
      var container, offset;
      container = rng[start ? 'startcontainer' : 'endcontainer'];
      offset = rng[start ? 'startoffset' : 'endoffset'];
      if (container.nodetype === 1) {
        container = container.childnodes[math.min(offset, container.childnodes.length - 1)] || container;
      }
      if (!start && nodetype.isbr(container.nextsibling)) {
        container = container.nextsibling;
      }
      while (container.parentnode !== root) {
        if (nodetype.istextblock(editor, container)) {
          return container;
        }
        if (/^(td|th)$/.test(container.parentnode.nodename)) {
          return container;
        }
        container = container.parentnode;
      }
      return container;
    };
    var getselectedtextblocks = function (editor, rng, root) {
      var textblocks = [], dom = editor.dom;
      var startnode = getendpointnode(editor, rng, true, root);
      var endnode = getendpointnode(editor, rng, false, root);
      var block;
      var siblings = [];
      for (var node = startnode; node; node = node.nextsibling) {
        siblings.push(node);
        if (node === endnode) {
          break;
        }
      }
      global$5.each(siblings, function (node) {
        if (nodetype.istextblock(editor, node)) {
          textblocks.push(node);
          block = null;
          return;
        }
        if (dom.isblock(node) || nodetype.isbr(node)) {
          if (nodetype.isbr(node)) {
            dom.remove(node);
          }
          block = null;
          return;
        }
        var nextsibling = node.nextsibling;
        if (global$4.isbookmarknode(node)) {
          if (nodetype.istextblock(editor, nextsibling) || !nextsibling && node.parentnode === root) {
            block = null;
            return;
          }
        }
        if (!block) {
          block = dom.create('p');
          node.parentnode.insertbefore(block, node);
          textblocks.push(block);
        }
        block.appendchild(node);
      });
      return textblocks;
    };
    var hascompatiblestyle = function (dom, sib, detail) {
      var sibstyle = dom.getstyle(sib, 'list-style-type');
      var detailstyle = detail ? detail['list-style-type'] : '';
      detailstyle = detailstyle === null ? '' : detailstyle;
      return sibstyle === detailstyle;
    };
    var applylist = function (editor, listname, detail) {
      if (detail === void 0) {
        detail = {};
      }
      var rng = editor.selection.getrng(true);
      var bookmark;
      var listitemname = 'li';
      var root = selection.getclosestlistrootelm(editor, editor.selection.getstart(true));
      var dom = editor.dom;
      if (dom.getcontenteditable(editor.selection.getnode()) === 'false') {
        return;
      }
      listname = listname.touppercase();
      if (listname === 'dl') {
        listitemname = 'dt';
      }
      bookmark = bookmark.createbookmark(rng);
      global$5.each(getselectedtextblocks(editor, rng, root), function (block) {
        var listblock, sibling;
        sibling = block.previoussibling;
        if (sibling && nodetype.islistnode(sibling) && sibling.nodename === listname && hascompatiblestyle(dom, sibling, detail)) {
          listblock = sibling;
          block = dom.rename(block, listitemname);
          sibling.appendchild(block);
        } else {
          listblock = dom.create(listname);
          block.parentnode.insertbefore(listblock, block);
          listblock.appendchild(block);
          block = dom.rename(block, listitemname);
        }
        removestyles(dom, block, [
          'margin',
          'margin-right',
          'margin-bottom',
          'margin-left',
          'margin-top',
          'padding',
          'padding-right',
          'padding-bottom',
          'padding-left',
          'padding-top'
        ]);
        updatelistwithdetails(dom, listblock, detail);
        mergewithadjacentlists(editor.dom, listblock);
      });
      editor.selection.setrng(bookmark.resolvebookmark(bookmark));
    };
    var isvalidlists = function (list1, list2) {
      return list1 && list2 && nodetype.islistnode(list1) && list1.nodename === list2.nodename;
    };
    var hassameliststyle = function (dom, list1, list2) {
      var targetstyle = dom.getstyle(list1, 'list-style-type', true);
      var style = dom.getstyle(list2, 'list-style-type', true);
      return targetstyle === style;
    };
    var hassameclasses = function (elm1, elm2) {
      return elm1.classname === elm2.classname;
    };
    var shouldmerge = function (dom, list1, list2) {
      return isvalidlists(list1, list2) && hassameliststyle(dom, list1, list2) && hassameclasses(list1, list2);
    };
    var mergewithadjacentlists = function (dom, listblock) {
      var sibling, node;
      sibling = listblock.nextsibling;
      if (shouldmerge(dom, listblock, sibling)) {
        while (node = sibling.firstchild) {
          listblock.appendchild(node);
        }
        dom.remove(sibling);
      }
      sibling = listblock.previoussibling;
      if (shouldmerge(dom, listblock, sibling)) {
        while (node = sibling.lastchild) {
          listblock.insertbefore(node, listblock.firstchild);
        }
        dom.remove(sibling);
      }
    };
    var updatelist = function (dom, list, listname, detail) {
      if (list.nodename !== listname) {
        var newlist = dom.rename(list, listname);
        updatelistwithdetails(dom, newlist, detail);
      } else {
        updatelistwithdetails(dom, list, detail);
      }
    };
    var togglemultiplelists = function (editor, parentlist, lists, listname, detail) {
      if (parentlist.nodename === listname && !hasliststyledetail(detail)) {
        flattenlistselection(editor);
      } else {
        var bookmark = bookmark.createbookmark(editor.selection.getrng(true));
        global$5.each([parentlist].concat(lists), function (elm) {
          updatelist(editor.dom, elm, listname, detail);
        });
        editor.selection.setrng(bookmark.resolvebookmark(bookmark));
      }
    };
    var hasliststyledetail = function (detail) {
      return 'list-style-type' in detail;
    };
    var togglesinglelist = function (editor, parentlist, listname, detail) {
      if (parentlist === editor.getbody()) {
        return;
      }
      if (parentlist) {
        if (parentlist.nodename === listname && !hasliststyledetail(detail)) {
          flattenlistselection(editor);
        } else {
          var bookmark = bookmark.createbookmark(editor.selection.getrng(true));
          updatelistwithdetails(editor.dom, parentlist, detail);
          mergewithadjacentlists(editor.dom, editor.dom.rename(parentlist, listname));
          editor.selection.setrng(bookmark.resolvebookmark(bookmark));
        }
      } else {
        applylist(editor, listname, detail);
      }
    };
    var togglelist = function (editor, listname, detail) {
      var parentlist = selection.getparentlist(editor);
      var selectedsublists = selection.getselectedsublists(editor);
      detail = detail ? detail : {};
      if (parentlist && selectedsublists.length > 0) {
        togglemultiplelists(editor, parentlist, selectedsublists, listname, detail);
      } else {
        togglesinglelist(editor, parentlist, listname, detail);
      }
    };
    var togglelist = {
      togglelist: togglelist,
      mergewithadjacentlists: mergewithadjacentlists
    };

    var dom$2 = global$6.dom;
    var normalizelist = function (dom, ul) {
      var sibling;
      var parentnode = ul.parentnode;
      if (parentnode.nodename === 'li' && parentnode.firstchild === ul) {
        sibling = parentnode.previoussibling;
        if (sibling && sibling.nodename === 'li') {
          sibling.appendchild(ul);
          if (nodetype.isempty(dom, parentnode)) {
            dom$2.remove(parentnode);
          }
        } else {
          dom$2.setstyle(parentnode, 'liststyletype', 'none');
        }
      }
      if (nodetype.islistnode(parentnode)) {
        sibling = parentnode.previoussibling;
        if (sibling && sibling.nodename === 'li') {
          sibling.appendchild(ul);
        }
      }
    };
    var normalizelists = function (dom, element) {
      global$5.each(global$5.grep(dom.select('ol,ul', element)), function (ul) {
        normalizelist(dom, ul);
      });
    };
    var normalizelists = {
      normalizelist: normalizelist,
      normalizelists: normalizelists
    };

    var findnextcaretcontainer = function (editor, rng, isforward, root) {
      var node = rng.startcontainer;
      var offset = rng.startoffset;
      var nonemptyblocks, walker;
      if (node.nodetype === 3 && (isforward ? offset < node.data.length : offset > 0)) {
        return node;
      }
      nonemptyblocks = editor.schema.getnonemptyelements();
      if (node.nodetype === 1) {
        node = global$1.getnode(node, offset);
      }
      walker = new global$2(node, root);
      if (isforward) {
        if (nodetype.isbogusbr(editor.dom, node)) {
          walker.next();
        }
      }
      while (node = walker[isforward ? 'next' : 'prev2']()) {
        if (node.nodename === 'li' && !node.haschildnodes()) {
          return node;
        }
        if (nonemptyblocks[node.nodename]) {
          return node;
        }
        if (node.nodetype === 3 && node.data.length > 0) {
          return node;
        }
      }
    };
    var hasonlyoneblockchild = function (dom, elm) {
      var childnodes = elm.childnodes;
      return childnodes.length === 1 && !nodetype.islistnode(childnodes[0]) && dom.isblock(childnodes[0]);
    };
    var unwrapsingleblockchild = function (dom, elm) {
      if (hasonlyoneblockchild(dom, elm)) {
        dom.remove(elm.firstchild, true);
      }
    };
    var movechildren = function (dom, fromelm, toelm) {
      var node, targetelm;
      targetelm = hasonlyoneblockchild(dom, toelm) ? toelm.firstchild : toelm;
      unwrapsingleblockchild(dom, fromelm);
      if (!nodetype.isempty(dom, fromelm, true)) {
        while (node = fromelm.firstchild) {
          targetelm.appendchild(node);
        }
      }
    };
    var mergelielements = function (dom, fromelm, toelm) {
      var node, listnode;
      var ul = fromelm.parentnode;
      if (!nodetype.ischildofbody(dom, fromelm) || !nodetype.ischildofbody(dom, toelm)) {
        return;
      }
      if (nodetype.islistnode(toelm.lastchild)) {
        listnode = toelm.lastchild;
      }
      if (ul === toelm.lastchild) {
        if (nodetype.isbr(ul.previoussibling)) {
          dom.remove(ul.previoussibling);
        }
      }
      node = toelm.lastchild;
      if (node && nodetype.isbr(node) && fromelm.haschildnodes()) {
        dom.remove(node);
      }
      if (nodetype.isempty(dom, toelm, true)) {
        dom.$(toelm).empty();
      }
      movechildren(dom, fromelm, toelm);
      if (listnode) {
        toelm.appendchild(listnode);
      }
      var contains = contains$1(element.fromdom(toelm), element.fromdom(fromelm));
      var nestedlists = contains ? dom.getparents(fromelm, nodetype.islistnode, toelm) : [];
      dom.remove(fromelm);
      each(nestedlists, function (list) {
        if (nodetype.isempty(dom, list) && list !== dom.getroot()) {
          dom.remove(list);
        }
      });
    };
    var mergeintoemptyli = function (editor, fromli, toli) {
      editor.dom.$(toli).empty();
      mergelielements(editor.dom, fromli, toli);
      editor.selection.setcursorlocation(toli);
    };
    var mergeforward = function (editor, rng, fromli, toli) {
      var dom = editor.dom;
      if (dom.isempty(toli)) {
        mergeintoemptyli(editor, fromli, toli);
      } else {
        var bookmark = bookmark.createbookmark(rng);
        mergelielements(dom, fromli, toli);
        editor.selection.setrng(bookmark.resolvebookmark(bookmark));
      }
    };
    var mergebackward = function (editor, rng, fromli, toli) {
      var bookmark = bookmark.createbookmark(rng);
      mergelielements(editor.dom, fromli, toli);
      var resolvedbookmark = bookmark.resolvebookmark(bookmark);
      editor.selection.setrng(resolvedbookmark);
    };
    var backspacedeletefromlisttolistcaret = function (editor, isforward) {
      var dom = editor.dom, selection = editor.selection;
      var selectionstartelm = selection.getstart();
      var root = selection.getclosestlistrootelm(editor, selectionstartelm);
      var li = dom.getparent(selection.getstart(), 'li', root);
      var ul, rng, otherli;
      if (li) {
        ul = li.parentnode;
        if (ul === editor.getbody() && nodetype.isempty(dom, ul)) {
          return true;
        }
        rng = range.normalizerange(selection.getrng(true));
        otherli = dom.getparent(findnextcaretcontainer(editor, rng, isforward, root), 'li', root);
        if (otherli && otherli !== li) {
          if (isforward) {
            mergeforward(editor, rng, otherli, li);
          } else {
            mergebackward(editor, rng, li, otherli);
          }
          return true;
        } else if (!otherli) {
          if (!isforward) {
            flattenlistselection(editor);
            return true;
          }
        }
      }
      return false;
    };
    var removeblock = function (dom, block, root) {
      var parentblock = dom.getparent(block.parentnode, dom.isblock, root);
      dom.remove(block);
      if (parentblock && dom.isempty(parentblock)) {
        dom.remove(parentblock);
      }
    };
    var backspacedeleteintolistcaret = function (editor, isforward) {
      var dom = editor.dom;
      var selectionstartelm = editor.selection.getstart();
      var root = selection.getclosestlistrootelm(editor, selectionstartelm);
      var block = dom.getparent(selectionstartelm, dom.isblock, root);
      if (block && dom.isempty(block)) {
        var rng = range.normalizerange(editor.selection.getrng(true));
        var otherli_1 = dom.getparent(findnextcaretcontainer(editor, rng, isforward, root), 'li', root);
        if (otherli_1) {
          editor.undomanager.transact(function () {
            removeblock(dom, block, root);
            togglelist.mergewithadjacentlists(dom, otherli_1.parentnode);
            editor.selection.select(otherli_1, true);
            editor.selection.collapse(isforward);
          });
          return true;
        }
      }
      return false;
    };
    var backspacedeletecaret = function (editor, isforward) {
      return backspacedeletefromlisttolistcaret(editor, isforward) || backspacedeleteintolistcaret(editor, isforward);
    };
    var backspacedeleterange = function (editor) {
      var selectionstartelm = editor.selection.getstart();
      var root = selection.getclosestlistrootelm(editor, selectionstartelm);
      var startlistparent = editor.dom.getparent(selectionstartelm, 'li,dt,dd', root);
      if (startlistparent || selection.getselectedlistitems(editor).length > 0) {
        editor.undomanager.transact(function () {
          editor.execcommand('delete');
          normalizelists.normalizelists(editor.dom, editor.getbody());
        });
        return true;
      }
      return false;
    };
    var backspacedelete = function (editor, isforward) {
      return editor.selection.iscollapsed() ? backspacedeletecaret(editor, isforward) : backspacedeleterange(editor);
    };
    var setup = function (editor) {
      editor.on('keydown', function (e) {
        if (e.keycode === global$3.backspace) {
          if (backspacedelete(editor, false)) {
            e.preventdefault();
          }
        } else if (e.keycode === global$3.delete) {
          if (backspacedelete(editor, true)) {
            e.preventdefault();
          }
        }
      });
    };
    var delete = {
      setup: setup,
      backspacedelete: backspacedelete
    };

    var get = function (editor) {
      return {
        backspacedelete: function (isforward) {
          delete.backspacedelete(editor, isforward);
        }
      };
    };
    var api = { get: get };

    var querylistcommandstate = function (editor, listname) {
      return function () {
        var parentlist = editor.dom.getparent(editor.selection.getstart(), 'ul,ol,dl');
        return parentlist && parentlist.nodename === listname;
      };
    };
    var register = function (editor) {
      editor.on('beforeexeccommand', function (e) {
        var cmd = e.command.tolowercase();
        if (cmd === 'indent') {
          indentlistselection(editor);
        } else if (cmd === 'outdent') {
          outdentlistselection(editor);
        }
      });
      editor.addcommand('insertunorderedlist', function (ui, detail) {
        togglelist.togglelist(editor, 'ul', detail);
      });
      editor.addcommand('insertorderedlist', function (ui, detail) {
        togglelist.togglelist(editor, 'ol', detail);
      });
      editor.addcommand('insertdefinitionlist', function (ui, detail) {
        togglelist.togglelist(editor, 'dl', detail);
      });
      editor.addcommand('removelist', function () {
        flattenlistselection(editor);
      });
      editor.addquerystatehandler('insertunorderedlist', querylistcommandstate(editor, 'ul'));
      editor.addquerystatehandler('insertorderedlist', querylistcommandstate(editor, 'ol'));
      editor.addquerystatehandler('insertdefinitionlist', querylistcommandstate(editor, 'dl'));
    };
    var commands = { register: register };

    var shouldindentontab = function (editor) {
      return editor.getparam('lists_indent_on_tab', true);
    };
    var settings = { shouldindentontab: shouldindentontab };

    var setuptabkey = function (editor) {
      editor.on('keydown', function (e) {
        if (e.keycode !== global$3.tab || global$3.metakeypressed(e)) {
          return;
        }
        editor.undomanager.transact(function () {
          if (e.shiftkey ? outdentlistselection(editor) : indentlistselection(editor)) {
            e.preventdefault();
          }
        });
      });
    };
    var setup$1 = function (editor) {
      if (settings.shouldindentontab(editor)) {
        setuptabkey(editor);
      }
      delete.setup(editor);
    };
    var keyboard = { setup: setup$1 };

    var findindex = function (list, predicate) {
      for (var index = 0; index < list.length; index++) {
        var element = list[index];
        if (predicate(element)) {
          return index;
        }
      }
      return -1;
    };
    var liststate = function (editor, listname) {
      return function (e) {
        var ctrl = e.control;
        editor.on('nodechange', function (e) {
          var tablecellindex = findindex(e.parents, nodetype.istablecellnode);
          var parents = tablecellindex !== -1 ? e.parents.slice(0, tablecellindex) : e.parents;
          var lists = global$5.grep(parents, nodetype.islistnode);
          ctrl.active(lists.length > 0 && lists[0].nodename === listname);
        });
      };
    };
    var register$1 = function (editor) {
      var hasplugin = function (editor, plugin) {
        var plugins = editor.settings.plugins ? editor.settings.plugins : '';
        return global$5.inarray(plugins.split(/[ ,]/), plugin) !== -1;
      };
      if (!hasplugin(editor, 'advlist')) {
        editor.addbutton('numlist', {
          active: false,
          title: 'numbered list',
          cmd: 'insertorderedlist',
          onpostrender: liststate(editor, 'ol')
        });
        editor.addbutton('bullist', {
          active: false,
          title: 'bullet list',
          cmd: 'insertunorderedlist',
          onpostrender: liststate(editor, 'ul')
        });
      }
      editor.addbutton('indent', {
        icon: 'indent',
        title: 'increase indent',
        cmd: 'indent'
      });
    };
    var buttons = { register: register$1 };

    global.add('lists', function (editor) {
      keyboard.setup(editor);
      buttons.register(editor);
      commands.register(editor);
      return api.get(editor);
    });
    function plugin () {
    }

    return plugin;

}(window));
})();



