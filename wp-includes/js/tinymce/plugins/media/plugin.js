(function () {
var media = (function () {
    'use strict';

    var global = tinymce.util.tools.resolve('tinymce.pluginmanager');

    var global$1 = tinymce.util.tools.resolve('tinymce.env');

    var global$2 = tinymce.util.tools.resolve('tinymce.util.tools');

    var getscripts = function (editor) {
      return editor.getparam('media_scripts');
    };
    var getaudiotemplatecallback = function (editor) {
      return editor.getparam('audio_template_callback');
    };
    var getvideotemplatecallback = function (editor) {
      return editor.getparam('video_template_callback');
    };
    var hasliveembeds = function (editor) {
      return editor.getparam('media_live_embeds', true);
    };
    var shouldfilterhtml = function (editor) {
      return editor.getparam('media_filter_html', true);
    };
    var geturlresolver = function (editor) {
      return editor.getparam('media_url_resolver');
    };
    var hasaltsource = function (editor) {
      return editor.getparam('media_alt_source', true);
    };
    var hasposter = function (editor) {
      return editor.getparam('media_poster', true);
    };
    var hasdimensions = function (editor) {
      return editor.getparam('media_dimensions', true);
    };
    var settings = {
      getscripts: getscripts,
      getaudiotemplatecallback: getaudiotemplatecallback,
      getvideotemplatecallback: getvideotemplatecallback,
      hasliveembeds: hasliveembeds,
      shouldfilterhtml: shouldfilterhtml,
      geturlresolver: geturlresolver,
      hasaltsource: hasaltsource,
      hasposter: hasposter,
      hasdimensions: hasdimensions
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

    var hasownproperty = object.hasownproperty;
    var get = function (obj, key) {
      return has(obj, key) ? option.from(obj[key]) : option.none();
    };
    var has = function (obj, key) {
      return hasownproperty.call(obj, key);
    };

    var global$3 = tinymce.util.tools.resolve('tinymce.dom.domutils');

    var global$4 = tinymce.util.tools.resolve('tinymce.html.saxparser');

    var getvideoscriptmatch = function (prefixes, src) {
      if (prefixes) {
        for (var i = 0; i < prefixes.length; i++) {
          if (src.indexof(prefixes[i].filter) !== -1) {
            return prefixes[i];
          }
        }
      }
    };
    var videoscript = { getvideoscriptmatch: getvideoscriptmatch };

    var dom = global$3.dom;
    var trimpx = function (value) {
      return value.replace(/px$/, '');
    };
    var getephoxembeddata = function (attrs) {
      var style = attrs.map.style;
      var styles = style ? dom.parsestyle(style) : {};
      return {
        type: 'ephox-embed-iri',
        source1: attrs.map['data-ephox-embed-iri'],
        source2: '',
        poster: '',
        width: get(styles, 'max-width').map(trimpx).getor(''),
        height: get(styles, 'max-height').map(trimpx).getor('')
      };
    };
    var htmltodata = function (prefixes, html) {
      var isephoxembed = cell(false);
      var data = {};
      global$4({
        validate: false,
        allow_conditional_comments: true,
        special: 'script,noscript',
        start: function (name, attrs) {
          if (isephoxembed.get()) ; else if (has(attrs.map, 'data-ephox-embed-iri')) {
            isephoxembed.set(true);
            data = getephoxembeddata(attrs);
          } else {
            if (!data.source1 && name === 'param') {
              data.source1 = attrs.map.movie;
            }
            if (name === 'iframe' || name === 'object' || name === 'embed' || name === 'video' || name === 'audio') {
              if (!data.type) {
                data.type = name;
              }
              data = global$2.extend(attrs.map, data);
            }
            if (name === 'script') {
              var videoscript = videoscript.getvideoscriptmatch(prefixes, attrs.map.src);
              if (!videoscript) {
                return;
              }
              data = {
                type: 'script',
                source1: attrs.map.src,
                width: videoscript.width,
                height: videoscript.height
              };
            }
            if (name === 'source') {
              if (!data.source1) {
                data.source1 = attrs.map.src;
              } else if (!data.source2) {
                data.source2 = attrs.map.src;
              }
            }
            if (name === 'img' && !data.poster) {
              data.poster = attrs.map.src;
            }
          }
        }
      }).parse(html);
      data.source1 = data.source1 || data.src || data.data;
      data.source2 = data.source2 || '';
      data.poster = data.poster || '';
      return data;
    };
    var htmltodata = { htmltodata: htmltodata };

    var global$5 = tinymce.util.tools.resolve('tinymce.util.promise');

    var guess = function (url) {
      var mimes = {
        mp3: 'audio/mpeg',
        wav: 'audio/wav',
        mp4: 'video/mp4',
        webm: 'video/webm',
        ogg: 'video/ogg',
        swf: 'application/x-shockwave-flash'
      };
      var fileend = url.tolowercase().split('.').pop();
      var mime = mimes[fileend];
      return mime ? mime : '';
    };
    var mime = { guess: guess };

    var global$6 = tinymce.util.tools.resolve('tinymce.html.schema');

    var global$7 = tinymce.util.tools.resolve('tinymce.html.writer');

    var dom$1 = global$3.dom;
    var addpx = function (value) {
      return /^[0-9.]+$/.test(value) ? value + 'px' : value;
    };
    var setattributes = function (attrs, updatedattrs) {
      for (var name in updatedattrs) {
        var value = '' + updatedattrs[name];
        if (attrs.map[name]) {
          var i = attrs.length;
          while (i--) {
            var attr = attrs[i];
            if (attr.name === name) {
              if (value) {
                attrs.map[name] = value;
                attr.value = value;
              } else {
                delete attrs.map[name];
                attrs.splice(i, 1);
              }
            }
          }
        } else if (value) {
          attrs.push({
            name: name,
            value: value
          });
          attrs.map[name] = value;
        }
      }
    };
    var updateephoxembed = function (data, attrs) {
      var style = attrs.map.style;
      var stylemap = style ? dom$1.parsestyle(style) : {};
      stylemap['max-width'] = addpx(data.width);
      stylemap['max-height'] = addpx(data.height);
      setattributes(attrs, { style: dom$1.serializestyle(stylemap) });
    };
    var updatehtml = function (html, data, updateall) {
      var writer = global$7();
      var isephoxembed = cell(false);
      var sourcecount = 0;
      var hasimage;
      global$4({
        validate: false,
        allow_conditional_comments: true,
        special: 'script,noscript',
        comment: function (text) {
          writer.comment(text);
        },
        cdata: function (text) {
          writer.cdata(text);
        },
        text: function (text, raw) {
          writer.text(text, raw);
        },
        start: function (name, attrs, empty) {
          if (isephoxembed.get()) ; else if (has(attrs.map, 'data-ephox-embed-iri')) {
            isephoxembed.set(true);
            updateephoxembed(data, attrs);
          } else {
            switch (name) {
            case 'video':
            case 'object':
            case 'embed':
            case 'img':
            case 'iframe':
              if (data.height !== undefined && data.width !== undefined) {
                setattributes(attrs, {
                  width: data.width,
                  height: data.height
                });
              }
              break;
            }
            if (updateall) {
              switch (name) {
              case 'video':
                setattributes(attrs, {
                  poster: data.poster,
                  src: ''
                });
                if (data.source2) {
                  setattributes(attrs, { src: '' });
                }
                break;
              case 'iframe':
                setattributes(attrs, { src: data.source1 });
                break;
              case 'source':
                sourcecount++;
                if (sourcecount <= 2) {
                  setattributes(attrs, {
                    src: data['source' + sourcecount],
                    type: data['source' + sourcecount + 'mime']
                  });
                  if (!data['source' + sourcecount]) {
                    return;
                  }
                }
                break;
              case 'img':
                if (!data.poster) {
                  return;
                }
                hasimage = true;
                break;
              }
            }
          }
          writer.start(name, attrs, empty);
        },
        end: function (name) {
          if (!isephoxembed.get()) {
            if (name === 'video' && updateall) {
              for (var index = 1; index <= 2; index++) {
                if (data['source' + index]) {
                  var attrs = [];
                  attrs.map = {};
                  if (sourcecount < index) {
                    setattributes(attrs, {
                      src: data['source' + index],
                      type: data['source' + index + 'mime']
                    });
                    writer.start('source', attrs, true);
                  }
                }
              }
            }
            if (data.poster && name === 'object' && updateall && !hasimage) {
              var imgattrs = [];
              imgattrs.map = {};
              setattributes(imgattrs, {
                src: data.poster,
                width: data.width,
                height: data.height
              });
              writer.start('img', imgattrs, true);
            }
          }
          writer.end(name);
        }
      }, global$6({})).parse(html);
      return writer.getcontent();
    };
    var updatehtml = { updatehtml: updatehtml };

    var urlpatterns = [
      {
        regex: /youtu\.be\/([\w\-_\?&=.]+)/i,
        type: 'iframe',
        w: 560,
        h: 314,
        url: '//www.youtube.com/embed/$1',
        allowfullscreen: true
      },
      {
        regex: /youtube\.com(.+)v=([^&]+)(&([a-z0-9&=\-_]+))?/i,
        type: 'iframe',
        w: 560,
        h: 314,
        url: '//www.youtube.com/embed/$2?$4',
        allowfullscreen: true
      },
      {
        regex: /youtube.com\/embed\/([a-z0-9\?&=\-_]+)/i,
        type: 'iframe',
        w: 560,
        h: 314,
        url: '//www.youtube.com/embed/$1',
        allowfullscreen: true
      },
      {
        regex: /vimeo\.com\/([0-9]+)/,
        type: 'iframe',
        w: 425,
        h: 350,
        url: '//player.vimeo.com/video/$1?title=0&byline=0&portrait=0&color=8dc7dc',
        allowfullscreen: true
      },
      {
        regex: /vimeo\.com\/(.*)\/([0-9]+)/,
        type: 'iframe',
        w: 425,
        h: 350,
        url: '//player.vimeo.com/video/$2?title=0&amp;byline=0',
        allowfullscreen: true
      },
      {
        regex: /maps\.google\.([a-z]{2,3})\/maps\/(.+)msid=(.+)/,
        type: 'iframe',
        w: 425,
        h: 350,
        url: '//maps.google.com/maps/ms?msid=$2&output=embed"',
        allowfullscreen: false
      },
      {
        regex: /dailymotion\.com\/video\/([^_]+)/,
        type: 'iframe',
        w: 480,
        h: 270,
        url: '//www.dailymotion.com/embed/video/$1',
        allowfullscreen: true
      },
      {
        regex: /dai\.ly\/([^_]+)/,
        type: 'iframe',
        w: 480,
        h: 270,
        url: '//www.dailymotion.com/embed/video/$1',
        allowfullscreen: true
      }
    ];
    var geturl = function (pattern, url) {
      var match = pattern.regex.exec(url);
      var newurl = pattern.url;
      var _loop_1 = function (i) {
        newurl = newurl.replace('$' + i, function () {
          return match[i] ? match[i] : '';
        });
      };
      for (var i = 0; i < match.length; i++) {
        _loop_1(i);
      }
      return newurl.replace(/\?$/, '');
    };
    var matchpattern = function (url) {
      var pattern = urlpatterns.filter(function (pattern) {
        return pattern.regex.test(url);
      });
      if (pattern.length > 0) {
        return global$2.extend({}, pattern[0], { url: geturl(pattern[0], url) });
      } else {
        return null;
      }
    };

    var getiframehtml = function (data) {
      var allowfullscreen = data.allowfullscreen ? ' allowfullscreen="1"' : '';
      return '<iframe src="' + data.source1 + '" width="' + data.width + '" height="' + data.height + '"' + allowfullscreen + '></iframe>';
    };
    var getflashhtml = function (data) {
      var html = '<object data="' + data.source1 + '" width="' + data.width + '" height="' + data.height + '" type="application/x-shockwave-flash">';
      if (data.poster) {
        html += '<img src="' + data.poster + '" width="' + data.width + '" height="' + data.height + '" />';
      }
      html += '</object>';
      return html;
    };
    var getaudiohtml = function (data, audiotemplatecallback) {
      if (audiotemplatecallback) {
        return audiotemplatecallback(data);
      } else {
        return '<audio controls="controls" src="' + data.source1 + '">' + (data.source2 ? '\n<source src="' + data.source2 + '"' + (data.source2mime ? ' type="' + data.source2mime + '"' : '') + ' />\n' : '') + '</audio>';
      }
    };
    var getvideohtml = function (data, videotemplatecallback) {
      if (videotemplatecallback) {
        return videotemplatecallback(data);
      } else {
        return '<video width="' + data.width + '" height="' + data.height + '"' + (data.poster ? ' poster="' + data.poster + '"' : '') + ' controls="controls">\n' + '<source src="' + data.source1 + '"' + (data.source1mime ? ' type="' + data.source1mime + '"' : '') + ' />\n' + (data.source2 ? '<source src="' + data.source2 + '"' + (data.source2mime ? ' type="' + data.source2mime + '"' : '') + ' />\n' : '') + '</video>';
      }
    };
    var getscripthtml = function (data) {
      return '<script src="' + data.source1 + '"></script>';
    };
    var datatohtml = function (editor, datain) {
      var data = global$2.extend({}, datain);
      if (!data.source1) {
        global$2.extend(data, htmltodata.htmltodata(settings.getscripts(editor), data.embed));
        if (!data.source1) {
          return '';
        }
      }
      if (!data.source2) {
        data.source2 = '';
      }
      if (!data.poster) {
        data.poster = '';
      }
      data.source1 = editor.converturl(data.source1, 'source');
      data.source2 = editor.converturl(data.source2, 'source');
      data.source1mime = mime.guess(data.source1);
      data.source2mime = mime.guess(data.source2);
      data.poster = editor.converturl(data.poster, 'poster');
      var pattern = matchpattern(data.source1);
      if (pattern) {
        data.source1 = pattern.url;
        data.type = pattern.type;
        data.allowfullscreen = pattern.allowfullscreen;
        data.width = data.width || pattern.w;
        data.height = data.height || pattern.h;
      }
      if (data.embed) {
        return updatehtml.updatehtml(data.embed, data, true);
      } else {
        var videoscript = videoscript.getvideoscriptmatch(settings.getscripts(editor), data.source1);
        if (videoscript) {
          data.type = 'script';
          data.width = videoscript.width;
          data.height = videoscript.height;
        }
        var audiotemplatecallback = settings.getaudiotemplatecallback(editor);
        var videotemplatecallback = settings.getvideotemplatecallback(editor);
        data.width = data.width || 300;
        data.height = data.height || 150;
        global$2.each(data, function (value, key) {
          data[key] = editor.dom.encode(value);
        });
        if (data.type === 'iframe') {
          return getiframehtml(data);
        } else if (data.source1mime === 'application/x-shockwave-flash') {
          return getflashhtml(data);
        } else if (data.source1mime.indexof('audio') !== -1) {
          return getaudiohtml(data, audiotemplatecallback);
        } else if (data.type === 'script') {
          return getscripthtml(data);
        } else {
          return getvideohtml(data, videotemplatecallback);
        }
      }
    };
    var datatohtml = { datatohtml: datatohtml };

    var cache = {};
    var embedpromise = function (data, datatohtml, handler) {
      return new global$5(function (res, rej) {
        var wrappedresolve = function (response) {
          if (response.html) {
            cache[data.source1] = response;
          }
          return res({
            url: data.source1,
            html: response.html ? response.html : datatohtml(data)
          });
        };
        if (cache[data.source1]) {
          wrappedresolve(cache[data.source1]);
        } else {
          handler({ url: data.source1 }, wrappedresolve, rej);
        }
      });
    };
    var defaultpromise = function (data, datatohtml) {
      return new global$5(function (res) {
        res({
          html: datatohtml(data),
          url: data.source1
        });
      });
    };
    var loadeddata = function (editor) {
      return function (data) {
        return datatohtml.datatohtml(editor, data);
      };
    };
    var getembedhtml = function (editor, data) {
      var embedhandler = settings.geturlresolver(editor);
      return embedhandler ? embedpromise(data, loadeddata(editor), embedhandler) : defaultpromise(data, loadeddata(editor));
    };
    var iscached = function (url) {
      return cache.hasownproperty(url);
    };
    var service = {
      getembedhtml: getembedhtml,
      iscached: iscached
    };

    var trimpx$1 = function (value) {
      return value.replace(/px$/, '');
    };
    var addpx$1 = function (value) {
      return /^[0-9.]+$/.test(value) ? value + 'px' : value;
    };
    var getsize = function (name) {
      return function (elm) {
        return elm ? trimpx$1(elm.style[name]) : '';
      };
    };
    var setsize = function (name) {
      return function (elm, value) {
        if (elm) {
          elm.style[name] = addpx$1(value);
        }
      };
    };
    var size = {
      getmaxwidth: getsize('maxwidth'),
      getmaxheight: getsize('maxheight'),
      setmaxwidth: setsize('maxwidth'),
      setmaxheight: setsize('maxheight')
    };

    var dosyncsize = function (widthctrl, heightctrl) {
      widthctrl.state.set('oldval', widthctrl.value());
      heightctrl.state.set('oldval', heightctrl.value());
    };
    var dosizecontrols = function (win, f) {
      var widthctrl = win.find('#width')[0];
      var heightctrl = win.find('#height')[0];
      var constrained = win.find('#constrain')[0];
      if (widthctrl && heightctrl && constrained) {
        f(widthctrl, heightctrl, constrained.checked());
      }
    };
    var doupdatesize = function (widthctrl, heightctrl, iscontrained) {
      var oldwidth = widthctrl.state.get('oldval');
      var oldheight = heightctrl.state.get('oldval');
      var newwidth = widthctrl.value();
      var newheight = heightctrl.value();
      if (iscontrained && oldwidth && oldheight && newwidth && newheight) {
        if (newwidth !== oldwidth) {
          newheight = math.round(newwidth / oldwidth * newheight);
          if (!isnan(newheight)) {
            heightctrl.value(newheight);
          }
        } else {
          newwidth = math.round(newheight / oldheight * newwidth);
          if (!isnan(newwidth)) {
            widthctrl.value(newwidth);
          }
        }
      }
      dosyncsize(widthctrl, heightctrl);
    };
    var syncsize = function (win) {
      dosizecontrols(win, dosyncsize);
    };
    var updatesize = function (win) {
      dosizecontrols(win, doupdatesize);
    };
    var createui = function (onchange) {
      var recalcsize = function () {
        onchange(function (win) {
          updatesize(win);
        });
      };
      return {
        type: 'container',
        label: 'dimensions',
        layout: 'flex',
        align: 'center',
        spacing: 5,
        items: [
          {
            name: 'width',
            type: 'textbox',
            maxlength: 5,
            size: 5,
            onchange: recalcsize,
            arialabel: 'width'
          },
          {
            type: 'label',
            text: 'x'
          },
          {
            name: 'height',
            type: 'textbox',
            maxlength: 5,
            size: 5,
            onchange: recalcsize,
            arialabel: 'height'
          },
          {
            name: 'constrain',
            type: 'checkbox',
            checked: true,
            text: 'constrain proportions'
          }
        ]
      };
    };
    var sizemanager = {
      createui: createui,
      syncsize: syncsize,
      updatesize: updatesize
    };

    var embedchange = global$1.ie && global$1.ie <= 8 ? 'onchange' : 'oninput';
    var handleerror = function (editor) {
      return function (error) {
        var errormessage = error && error.msg ? 'media embed handler error: ' + error.msg : 'media embed handler threw unknown error.';
        editor.notificationmanager.open({
          type: 'error',
          text: errormessage
        });
      };
    };
    var getdata = function (editor) {
      var element = editor.selection.getnode();
      var dataembed = element.getattribute('data-ephox-embed-iri');
      if (dataembed) {
        return {
          'source1': dataembed,
          'data-ephox-embed-iri': dataembed,
          'width': size.getmaxwidth(element),
          'height': size.getmaxheight(element)
        };
      }
      return element.getattribute('data-mce-object') ? htmltodata.htmltodata(settings.getscripts(editor), editor.serializer.serialize(element, { selection: true })) : {};
    };
    var getsource = function (editor) {
      var elm = editor.selection.getnode();
      if (elm.getattribute('data-mce-object') || elm.getattribute('data-ephox-embed-iri')) {
        return editor.selection.getcontent();
      }
    };
    var addembedhtml = function (win, editor) {
      return function (response) {
        var html = response.html;
        var embed = win.find('#embed')[0];
        var data = global$2.extend(htmltodata.htmltodata(settings.getscripts(editor), html), { source1: response.url });
        win.fromjson(data);
        if (embed) {
          embed.value(html);
          sizemanager.updatesize(win);
        }
      };
    };
    var selectplaceholder = function (editor, beforeobjects) {
      var i;
      var y;
      var afterobjects = editor.dom.select('img[data-mce-object]');
      for (i = 0; i < beforeobjects.length; i++) {
        for (y = afterobjects.length - 1; y >= 0; y--) {
          if (beforeobjects[i] === afterobjects[y]) {
            afterobjects.splice(y, 1);
          }
        }
      }
      editor.selection.select(afterobjects[0]);
    };
    var handleinsert = function (editor, html) {
      var beforeobjects = editor.dom.select('img[data-mce-object]');
      editor.insertcontent(html);
      selectplaceholder(editor, beforeobjects);
      editor.nodechanged();
    };
    var submitform = function (win, editor) {
      var data = win.tojson();
      data.embed = updatehtml.updatehtml(data.embed, data);
      if (data.embed && service.iscached(data.source1)) {
        handleinsert(editor, data.embed);
      } else {
        service.getembedhtml(editor, data).then(function (response) {
          handleinsert(editor, response.html);
        }).catch(handleerror(editor));
      }
    };
    var populatemeta = function (win, meta) {
      global$2.each(meta, function (value, key) {
        win.find('#' + key).value(value);
      });
    };
    var showdialog = function (editor) {
      var win;
      var data;
      var generalformitems = [{
          name: 'source1',
          type: 'filepicker',
          filetype: 'media',
          size: 40,
          autofocus: true,
          label: 'source',
          onpaste: function () {
            settimeout(function () {
              service.getembedhtml(editor, win.tojson()).then(addembedhtml(win, editor)).catch(handleerror(editor));
            }, 1);
          },
          onchange: function (e) {
            service.getembedhtml(editor, win.tojson()).then(addembedhtml(win, editor)).catch(handleerror(editor));
            populatemeta(win, e.meta);
          },
          onbeforecall: function (e) {
            e.meta = win.tojson();
          }
        }];
      var advancedformitems = [];
      var reserialise = function (update) {
        update(win);
        data = win.tojson();
        win.find('#embed').value(updatehtml.updatehtml(data.embed, data));
      };
      if (settings.hasaltsource(editor)) {
        advancedformitems.push({
          name: 'source2',
          type: 'filepicker',
          filetype: 'media',
          size: 40,
          label: 'alternative source'
        });
      }
      if (settings.hasposter(editor)) {
        advancedformitems.push({
          name: 'poster',
          type: 'filepicker',
          filetype: 'image',
          size: 40,
          label: 'poster'
        });
      }
      if (settings.hasdimensions(editor)) {
        var control = sizemanager.createui(reserialise);
        generalformitems.push(control);
      }
      data = getdata(editor);
      var embedtextbox = {
        id: 'mcemediasource',
        type: 'textbox',
        flex: 1,
        name: 'embed',
        value: getsource(editor),
        multiline: true,
        rows: 5,
        label: 'source'
      };
      var updatevalueonchange = function () {
        data = global$2.extend({}, htmltodata.htmltodata(settings.getscripts(editor), this.value()));
        this.parent().parent().fromjson(data);
      };
      embedtextbox[embedchange] = updatevalueonchange;
      var body = [
        {
          title: 'general',
          type: 'form',
          items: generalformitems
        },
        {
          title: 'embed',
          type: 'container',
          layout: 'flex',
          direction: 'column',
          align: 'stretch',
          padding: 10,
          spacing: 10,
          items: [
            {
              type: 'label',
              text: 'paste your embed code below:',
              forid: 'mcemediasource'
            },
            embedtextbox
          ]
        }
      ];
      if (advancedformitems.length > 0) {
        body.push({
          title: 'advanced',
          type: 'form',
          items: advancedformitems
        });
      }
      win = editor.windowmanager.open({
        title: 'insert/edit media',
        data: data,
        bodytype: 'tabpanel',
        body: body,
        onsubmit: function () {
          sizemanager.updatesize(win);
          submitform(win, editor);
        }
      });
      sizemanager.syncsize(win);
    };
    var dialog = { showdialog: showdialog };

    var get$1 = function (editor) {
      var showdialog = function () {
        dialog.showdialog(editor);
      };
      return { showdialog: showdialog };
    };
    var api = { get: get$1 };

    var register = function (editor) {
      var showdialog = function () {
        dialog.showdialog(editor);
      };
      editor.addcommand('mcemedia', showdialog);
    };
    var commands = { register: register };

    var global$8 = tinymce.util.tools.resolve('tinymce.html.node');

    var sanitize = function (editor, html) {
      if (settings.shouldfilterhtml(editor) === false) {
        return html;
      }
      var writer = global$7();
      var blocked;
      global$4({
        validate: false,
        allow_conditional_comments: false,
        special: 'script,noscript',
        comment: function (text) {
          writer.comment(text);
        },
        cdata: function (text) {
          writer.cdata(text);
        },
        text: function (text, raw) {
          writer.text(text, raw);
        },
        start: function (name, attrs, empty) {
          blocked = true;
          if (name === 'script' || name === 'noscript' || name === 'svg') {
            return;
          }
          for (var i = attrs.length - 1; i >= 0; i--) {
            var attrname = attrs[i].name;
            if (attrname.indexof('on') === 0) {
              delete attrs.map[attrname];
              attrs.splice(i, 1);
            }
            if (attrname === 'style') {
              attrs[i].value = editor.dom.serializestyle(editor.dom.parsestyle(attrs[i].value), name);
            }
          }
          writer.start(name, attrs, empty);
          blocked = false;
        },
        end: function (name) {
          if (blocked) {
            return;
          }
          writer.end(name);
        }
      }, global$6({})).parse(html);
      return writer.getcontent();
    };
    var sanitize = { sanitize: sanitize };

    var createplaceholdernode = function (editor, node) {
      var placeholder;
      var name = node.name;
      placeholder = new global$8('img', 1);
      placeholder.shortended = true;
      retainattributesandinnerhtml(editor, node, placeholder);
      placeholder.attr({
        'width': node.attr('width') || '300',
        'height': node.attr('height') || (name === 'audio' ? '30' : '150'),
        'style': node.attr('style'),
        'src': global$1.transparentsrc,
        'data-mce-object': name,
        'class': 'mce-object mce-object-' + name
      });
      return placeholder;
    };
    var createpreviewiframenode = function (editor, node) {
      var previewwrapper;
      var previewnode;
      var shimnode;
      var name = node.name;
      previewwrapper = new global$8('span', 1);
      previewwrapper.attr({
        'contenteditable': 'false',
        'style': node.attr('style'),
        'data-mce-object': name,
        'class': 'mce-preview-object mce-object-' + name
      });
      retainattributesandinnerhtml(editor, node, previewwrapper);
      previewnode = new global$8(name, 1);
      previewnode.attr({
        src: node.attr('src'),
        allowfullscreen: node.attr('allowfullscreen'),
        style: node.attr('style'),
        class: node.attr('class'),
        width: node.attr('width'),
        height: node.attr('height'),
        frameborder: '0'
      });
      shimnode = new global$8('span', 1);
      shimnode.attr('class', 'mce-shim');
      previewwrapper.append(previewnode);
      previewwrapper.append(shimnode);
      return previewwrapper;
    };
    var retainattributesandinnerhtml = function (editor, sourcenode, targetnode) {
      var attrname;
      var attrvalue;
      var attribs;
      var ai;
      var innerhtml;
      attribs = sourcenode.attributes;
      ai = attribs.length;
      while (ai--) {
        attrname = attribs[ai].name;
        attrvalue = attribs[ai].value;
        if (attrname !== 'width' && attrname !== 'height' && attrname !== 'style') {
          if (attrname === 'data' || attrname === 'src') {
            attrvalue = editor.converturl(attrvalue, attrname);
          }
          targetnode.attr('data-mce-p-' + attrname, attrvalue);
        }
      }
      innerhtml = sourcenode.firstchild && sourcenode.firstchild.value;
      if (innerhtml) {
        targetnode.attr('data-mce-html', escape(sanitize.sanitize(editor, innerhtml)));
        targetnode.firstchild = null;
      }
    };
    var iswithinephoxembed = function (node) {
      while (node = node.parent) {
        if (node.attr('data-ephox-embed-iri')) {
          return true;
        }
      }
      return false;
    };
    var placeholderconverter = function (editor) {
      return function (nodes) {
        var i = nodes.length;
        var node;
        var videoscript;
        while (i--) {
          node = nodes[i];
          if (!node.parent) {
            continue;
          }
          if (node.parent.attr('data-mce-object')) {
            continue;
          }
          if (node.name === 'script') {
            videoscript = videoscript.getvideoscriptmatch(settings.getscripts(editor), node.attr('src'));
            if (!videoscript) {
              continue;
            }
          }
          if (videoscript) {
            if (videoscript.width) {
              node.attr('width', videoscript.width.tostring());
            }
            if (videoscript.height) {
              node.attr('height', videoscript.height.tostring());
            }
          }
          if (node.name === 'iframe' && settings.hasliveembeds(editor) && global$1.cefalse) {
            if (!iswithinephoxembed(node)) {
              node.replace(createpreviewiframenode(editor, node));
            }
          } else {
            if (!iswithinephoxembed(node)) {
              node.replace(createplaceholdernode(editor, node));
            }
          }
        }
      };
    };
    var nodes = {
      createpreviewiframenode: createpreviewiframenode,
      createplaceholdernode: createplaceholdernode,
      placeholderconverter: placeholderconverter
    };

    var setup = function (editor) {
      editor.on('preinit', function () {
        var specialelements = editor.schema.getspecialelements();
        global$2.each('video audio iframe object'.split(' '), function (name) {
          specialelements[name] = new regexp('</' + name + '[^>]*>', 'gi');
        });
        var boolattrs = editor.schema.getboolattrs();
        global$2.each('webkitallowfullscreen mozallowfullscreen allowfullscreen'.split(' '), function (name) {
          boolattrs[name] = {};
        });
        editor.parser.addnodefilter('iframe,video,audio,object,embed,script', nodes.placeholderconverter(editor));
        editor.serializer.addattributefilter('data-mce-object', function (nodes, name) {
          var i = nodes.length;
          var node;
          var realelm;
          var ai;
          var attribs;
          var innerhtml;
          var innernode;
          var realelmname;
          var classname;
          while (i--) {
            node = nodes[i];
            if (!node.parent) {
              continue;
            }
            realelmname = node.attr(name);
            realelm = new global$8(realelmname, 1);
            if (realelmname !== 'audio' && realelmname !== 'script') {
              classname = node.attr('class');
              if (classname && classname.indexof('mce-preview-object') !== -1) {
                realelm.attr({
                  width: node.firstchild.attr('width'),
                  height: node.firstchild.attr('height')
                });
              } else {
                realelm.attr({
                  width: node.attr('width'),
                  height: node.attr('height')
                });
              }
            }
            realelm.attr({ style: node.attr('style') });
            attribs = node.attributes;
            ai = attribs.length;
            while (ai--) {
              var attrname = attribs[ai].name;
              if (attrname.indexof('data-mce-p-') === 0) {
                realelm.attr(attrname.substr(11), attribs[ai].value);
              }
            }
            if (realelmname === 'script') {
              realelm.attr('type', 'text/javascript');
            }
            innerhtml = node.attr('data-mce-html');
            if (innerhtml) {
              innernode = new global$8('#text', 3);
              innernode.raw = true;
              innernode.value = sanitize.sanitize(editor, unescape(innerhtml));
              realelm.append(innernode);
            }
            node.replace(realelm);
          }
        });
      });
      editor.on('setcontent', function () {
        editor.$('span.mce-preview-object').each(function (index, elm) {
          var $elm = editor.$(elm);
          if ($elm.find('span.mce-shim', elm).length === 0) {
            $elm.append('<span class="mce-shim"></span>');
          }
        });
      });
    };
    var filtercontent = { setup: setup };

    var setup$1 = function (editor) {
      editor.on('resolvename', function (e) {
        var name;
        if (e.target.nodetype === 1 && (name = e.target.getattribute('data-mce-object'))) {
          e.name = name;
        }
      });
    };
    var resolvename = { setup: setup$1 };

    var setup$2 = function (editor) {
      editor.on('click keyup', function () {
        var selectednode = editor.selection.getnode();
        if (selectednode && editor.dom.hasclass(selectednode, 'mce-preview-object')) {
          if (editor.dom.getattrib(selectednode, 'data-mce-selected')) {
            selectednode.setattribute('data-mce-selected', '2');
          }
        }
      });
      editor.on('objectselected', function (e) {
        var objecttype = e.target.getattribute('data-mce-object');
        if (objecttype === 'audio' || objecttype === 'script') {
          e.preventdefault();
        }
      });
      editor.on('objectresized', function (e) {
        var target = e.target;
        var html;
        if (target.getattribute('data-mce-object')) {
          html = target.getattribute('data-mce-html');
          if (html) {
            html = unescape(html);
            target.setattribute('data-mce-html', escape(updatehtml.updatehtml(html, {
              width: e.width,
              height: e.height
            })));
          }
        }
      });
    };
    var selection = { setup: setup$2 };

    var register$1 = function (editor) {
      editor.addbutton('media', {
        tooltip: 'insert/edit media',
        cmd: 'mcemedia',
        stateselector: [
          'img[data-mce-object]',
          'span[data-mce-object]',
          'div[data-ephox-embed-iri]'
        ]
      });
      editor.addmenuitem('media', {
        icon: 'media',
        text: 'media',
        cmd: 'mcemedia',
        context: 'insert',
        prependtocontext: true
      });
    };
    var buttons = { register: register$1 };

    global.add('media', function (editor) {
      commands.register(editor);
      buttons.register(editor);
      resolvename.setup(editor);
      filtercontent.setup(editor);
      selection.setup(editor);
      return api.get(editor);
    });
    function plugin () {
    }

    return plugin;

}());
})();



