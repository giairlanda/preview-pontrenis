(function () {
var image = (function (domglobals) {
    'use strict';

    var global = tinymce.util.tools.resolve('tinymce.pluginmanager');

    var hasdimensions = function (editor) {
      return editor.settings.image_dimensions === false ? false : true;
    };
    var hasadvtab = function (editor) {
      return editor.settings.image_advtab === true ? true : false;
    };
    var getprependurl = function (editor) {
      return editor.getparam('image_prepend_url', '');
    };
    var getclasslist = function (editor) {
      return editor.getparam('image_class_list');
    };
    var hasdescription = function (editor) {
      return editor.settings.image_description === false ? false : true;
    };
    var hasimagetitle = function (editor) {
      return editor.settings.image_title === true ? true : false;
    };
    var hasimagecaption = function (editor) {
      return editor.settings.image_caption === true ? true : false;
    };
    var getimagelist = function (editor) {
      return editor.getparam('image_list', false);
    };
    var hasuploadurl = function (editor) {
      return editor.getparam('images_upload_url', false);
    };
    var hasuploadhandler = function (editor) {
      return editor.getparam('images_upload_handler', false);
    };
    var getuploadurl = function (editor) {
      return editor.getparam('images_upload_url');
    };
    var getuploadhandler = function (editor) {
      return editor.getparam('images_upload_handler');
    };
    var getuploadbasepath = function (editor) {
      return editor.getparam('images_upload_base_path');
    };
    var getuploadcredentials = function (editor) {
      return editor.getparam('images_upload_credentials');
    };
    var settings = {
      hasdimensions: hasdimensions,
      hasadvtab: hasadvtab,
      getprependurl: getprependurl,
      getclasslist: getclasslist,
      hasdescription: hasdescription,
      hasimagetitle: hasimagetitle,
      hasimagecaption: hasimagecaption,
      getimagelist: getimagelist,
      hasuploadurl: hasuploadurl,
      hasuploadhandler: hasuploadhandler,
      getuploadurl: getuploadurl,
      getuploadhandler: getuploadhandler,
      getuploadbasepath: getuploadbasepath,
      getuploadcredentials: getuploadcredentials
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

    function filereader () {
      var f = global$1.getordie('filereader');
      return new f();
    }

    var global$1 = tinymce.util.tools.resolve('tinymce.util.promise');

    var global$2 = tinymce.util.tools.resolve('tinymce.util.tools');

    var global$3 = tinymce.util.tools.resolve('tinymce.util.xhr');

    var parseintandgetmax = function (val1, val2) {
      return math.max(parseint(val1, 10), parseint(val2, 10));
    };
    var getimagesize = function (url, callback) {
      var img = domglobals.document.createelement('img');
      function done(width, height) {
        if (img.parentnode) {
          img.parentnode.removechild(img);
        }
        callback({
          width: width,
          height: height
        });
      }
      img.onload = function () {
        var width = parseintandgetmax(img.width, img.clientwidth);
        var height = parseintandgetmax(img.height, img.clientheight);
        done(width, height);
      };
      img.onerror = function () {
        done(0, 0);
      };
      var style = img.style;
      style.visibility = 'hidden';
      style.position = 'fixed';
      style.bottom = style.left = '0px';
      style.width = style.height = 'auto';
      domglobals.document.body.appendchild(img);
      img.src = url;
    };
    var buildlistitems = function (inputlist, itemcallback, startitems) {
      function appenditems(values, output) {
        output = output || [];
        global$2.each(values, function (item) {
          var menuitem = { text: item.text || item.title };
          if (item.menu) {
            menuitem.menu = appenditems(item.menu);
          } else {
            menuitem.value = item.value;
            itemcallback(menuitem);
          }
          output.push(menuitem);
        });
        return output;
      }
      return appenditems(inputlist, startitems || []);
    };
    var removepixelsuffix = function (value) {
      if (value) {
        value = value.replace(/px$/, '');
      }
      return value;
    };
    var addpixelsuffix = function (value) {
      if (value.length > 0 && /^[0-9]+$/.test(value)) {
        value += 'px';
      }
      return value;
    };
    var mergemargins = function (css) {
      if (css.margin) {
        var splitmargin = css.margin.split(' ');
        switch (splitmargin.length) {
        case 1:
          css['margin-top'] = css['margin-top'] || splitmargin[0];
          css['margin-right'] = css['margin-right'] || splitmargin[0];
          css['margin-bottom'] = css['margin-bottom'] || splitmargin[0];
          css['margin-left'] = css['margin-left'] || splitmargin[0];
          break;
        case 2:
          css['margin-top'] = css['margin-top'] || splitmargin[0];
          css['margin-right'] = css['margin-right'] || splitmargin[1];
          css['margin-bottom'] = css['margin-bottom'] || splitmargin[0];
          css['margin-left'] = css['margin-left'] || splitmargin[1];
          break;
        case 3:
          css['margin-top'] = css['margin-top'] || splitmargin[0];
          css['margin-right'] = css['margin-right'] || splitmargin[1];
          css['margin-bottom'] = css['margin-bottom'] || splitmargin[2];
          css['margin-left'] = css['margin-left'] || splitmargin[1];
          break;
        case 4:
          css['margin-top'] = css['margin-top'] || splitmargin[0];
          css['margin-right'] = css['margin-right'] || splitmargin[1];
          css['margin-bottom'] = css['margin-bottom'] || splitmargin[2];
          css['margin-left'] = css['margin-left'] || splitmargin[3];
        }
        delete css.margin;
      }
      return css;
    };
    var createimagelist = function (editor, callback) {
      var imagelist = settings.getimagelist(editor);
      if (typeof imagelist === 'string') {
        global$3.send({
          url: imagelist,
          success: function (text) {
            callback(json.parse(text));
          }
        });
      } else if (typeof imagelist === 'function') {
        imagelist(callback);
      } else {
        callback(imagelist);
      }
    };
    var waitloadimage = function (editor, data, imgelm) {
      function selectimage() {
        imgelm.onload = imgelm.onerror = null;
        if (editor.selection) {
          editor.selection.select(imgelm);
          editor.nodechanged();
        }
      }
      imgelm.onload = function () {
        if (!data.width && !data.height && settings.hasdimensions(editor)) {
          editor.dom.setattribs(imgelm, {
            width: imgelm.clientwidth,
            height: imgelm.clientheight
          });
        }
        selectimage();
      };
      imgelm.onerror = selectimage;
    };
    var blobtodatauri = function (blob) {
      return new global$1(function (resolve, reject) {
        var reader = filereader();
        reader.onload = function () {
          resolve(reader.result);
        };
        reader.onerror = function () {
          reject(reader.error.message);
        };
        reader.readasdataurl(blob);
      });
    };
    var utils = {
      getimagesize: getimagesize,
      buildlistitems: buildlistitems,
      removepixelsuffix: removepixelsuffix,
      addpixelsuffix: addpixelsuffix,
      mergemargins: mergemargins,
      createimagelist: createimagelist,
      waitloadimage: waitloadimage,
      blobtodatauri: blobtodatauri
    };

    var global$4 = tinymce.util.tools.resolve('tinymce.dom.domutils');

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

    var dom = global$4.dom;
    var gethspace = function (image) {
      if (image.style.marginleft && image.style.marginright && image.style.marginleft === image.style.marginright) {
        return utils.removepixelsuffix(image.style.marginleft);
      } else {
        return '';
      }
    };
    var getvspace = function (image) {
      if (image.style.margintop && image.style.marginbottom && image.style.margintop === image.style.marginbottom) {
        return utils.removepixelsuffix(image.style.margintop);
      } else {
        return '';
      }
    };
    var getborder = function (image) {
      if (image.style.borderwidth) {
        return utils.removepixelsuffix(image.style.borderwidth);
      } else {
        return '';
      }
    };
    var getattrib = function (image, name) {
      if (image.hasattribute(name)) {
        return image.getattribute(name);
      } else {
        return '';
      }
    };
    var getstyle = function (image, name) {
      return image.style[name] ? image.style[name] : '';
    };
    var hascaption = function (image) {
      return image.parentnode !== null && image.parentnode.nodename === 'figure';
    };
    var setattrib = function (image, name, value) {
      image.setattribute(name, value);
    };
    var wrapinfigure = function (image) {
      var figureelm = dom.create('figure', { class: 'image' });
      dom.insertafter(figureelm, image);
      figureelm.appendchild(image);
      figureelm.appendchild(dom.create('figcaption', { contenteditable: true }, 'caption'));
      figureelm.contenteditable = 'false';
    };
    var removefigure = function (image) {
      var figureelm = image.parentnode;
      dom.insertafter(image, figureelm);
      dom.remove(figureelm);
    };
    var togglecaption = function (image) {
      if (hascaption(image)) {
        removefigure(image);
      } else {
        wrapinfigure(image);
      }
    };
    var normalizestyle = function (image, normalizecss) {
      var attrvalue = image.getattribute('style');
      var value = normalizecss(attrvalue !== null ? attrvalue : '');
      if (value.length > 0) {
        image.setattribute('style', value);
        image.setattribute('data-mce-style', value);
      } else {
        image.removeattribute('style');
      }
    };
    var setsize = function (name, normalizecss) {
      return function (image, name, value) {
        if (image.style[name]) {
          image.style[name] = utils.addpixelsuffix(value);
          normalizestyle(image, normalizecss);
        } else {
          setattrib(image, name, value);
        }
      };
    };
    var getsize = function (image, name) {
      if (image.style[name]) {
        return utils.removepixelsuffix(image.style[name]);
      } else {
        return getattrib(image, name);
      }
    };
    var sethspace = function (image, value) {
      var pxvalue = utils.addpixelsuffix(value);
      image.style.marginleft = pxvalue;
      image.style.marginright = pxvalue;
    };
    var setvspace = function (image, value) {
      var pxvalue = utils.addpixelsuffix(value);
      image.style.margintop = pxvalue;
      image.style.marginbottom = pxvalue;
    };
    var setborder = function (image, value) {
      var pxvalue = utils.addpixelsuffix(value);
      image.style.borderwidth = pxvalue;
    };
    var setborderstyle = function (image, value) {
      image.style.borderstyle = value;
    };
    var getborderstyle = function (image) {
      return getstyle(image, 'borderstyle');
    };
    var isfigure = function (elm) {
      return elm.nodename === 'figure';
    };
    var defaultdata = function () {
      return {
        src: '',
        alt: '',
        title: '',
        width: '',
        height: '',
        class: '',
        style: '',
        caption: false,
        hspace: '',
        vspace: '',
        border: '',
        borderstyle: ''
      };
    };
    var getstylevalue = function (normalizecss, data) {
      var image = domglobals.document.createelement('img');
      setattrib(image, 'style', data.style);
      if (gethspace(image) || data.hspace !== '') {
        sethspace(image, data.hspace);
      }
      if (getvspace(image) || data.vspace !== '') {
        setvspace(image, data.vspace);
      }
      if (getborder(image) || data.border !== '') {
        setborder(image, data.border);
      }
      if (getborderstyle(image) || data.borderstyle !== '') {
        setborderstyle(image, data.borderstyle);
      }
      return normalizecss(image.getattribute('style'));
    };
    var create = function (normalizecss, data) {
      var image = domglobals.document.createelement('img');
      write(normalizecss, merge(data, { caption: false }), image);
      setattrib(image, 'alt', data.alt);
      if (data.caption) {
        var figure = dom.create('figure', { class: 'image' });
        figure.appendchild(image);
        figure.appendchild(dom.create('figcaption', { contenteditable: true }, 'caption'));
        figure.contenteditable = 'false';
        return figure;
      } else {
        return image;
      }
    };
    var read = function (normalizecss, image) {
      return {
        src: getattrib(image, 'src'),
        alt: getattrib(image, 'alt'),
        title: getattrib(image, 'title'),
        width: getsize(image, 'width'),
        height: getsize(image, 'height'),
        class: getattrib(image, 'class'),
        style: normalizecss(getattrib(image, 'style')),
        caption: hascaption(image),
        hspace: gethspace(image),
        vspace: getvspace(image),
        border: getborder(image),
        borderstyle: getstyle(image, 'borderstyle')
      };
    };
    var updateprop = function (image, olddata, newdata, name, set) {
      if (newdata[name] !== olddata[name]) {
        set(image, name, newdata[name]);
      }
    };
    var normalized = function (set, normalizecss) {
      return function (image, name, value) {
        set(image, value);
        normalizestyle(image, normalizecss);
      };
    };
    var write = function (normalizecss, newdata, image) {
      var olddata = read(normalizecss, image);
      updateprop(image, olddata, newdata, 'caption', function (image, _name, _value) {
        return togglecaption(image);
      });
      updateprop(image, olddata, newdata, 'src', setattrib);
      updateprop(image, olddata, newdata, 'alt', setattrib);
      updateprop(image, olddata, newdata, 'title', setattrib);
      updateprop(image, olddata, newdata, 'width', setsize('width', normalizecss));
      updateprop(image, olddata, newdata, 'height', setsize('height', normalizecss));
      updateprop(image, olddata, newdata, 'class', setattrib);
      updateprop(image, olddata, newdata, 'style', normalized(function (image, value) {
        return setattrib(image, 'style', value);
      }, normalizecss));
      updateprop(image, olddata, newdata, 'hspace', normalized(sethspace, normalizecss));
      updateprop(image, olddata, newdata, 'vspace', normalized(setvspace, normalizecss));
      updateprop(image, olddata, newdata, 'border', normalized(setborder, normalizecss));
      updateprop(image, olddata, newdata, 'borderstyle', normalized(setborderstyle, normalizecss));
    };

    var normalizecss = function (editor, csstext) {
      var css = editor.dom.styles.parse(csstext);
      var mergedcss = utils.mergemargins(css);
      var compressed = editor.dom.styles.parse(editor.dom.styles.serialize(mergedcss));
      return editor.dom.styles.serialize(compressed);
    };
    var getselectedimage = function (editor) {
      var imgelm = editor.selection.getnode();
      var figureelm = editor.dom.getparent(imgelm, 'figure.image');
      if (figureelm) {
        return editor.dom.select('img', figureelm)[0];
      }
      if (imgelm && (imgelm.nodename !== 'img' || imgelm.getattribute('data-mce-object') || imgelm.getattribute('data-mce-placeholder'))) {
        return null;
      }
      return imgelm;
    };
    var splittextblock = function (editor, figure) {
      var dom = editor.dom;
      var textblock = dom.getparent(figure.parentnode, function (node) {
        return editor.schema.gettextblockelements()[node.nodename];
      }, editor.getbody());
      if (textblock) {
        return dom.split(textblock, figure);
      } else {
        return figure;
      }
    };
    var readimagedatafromselection = function (editor) {
      var image = getselectedimage(editor);
      return image ? read(function (css) {
        return normalizecss(editor, css);
      }, image) : defaultdata();
    };
    var insertimageatcaret = function (editor, data) {
      var elm = create(function (css) {
        return normalizecss(editor, css);
      }, data);
      editor.dom.setattrib(elm, 'data-mce-id', '__mcenew');
      editor.focus();
      editor.selection.setcontent(elm.outerhtml);
      var insertedelm = editor.dom.select('*[data-mce-id="__mcenew"]')[0];
      editor.dom.setattrib(insertedelm, 'data-mce-id', null);
      if (isfigure(insertedelm)) {
        var figure = splittextblock(editor, insertedelm);
        editor.selection.select(figure);
      } else {
        editor.selection.select(insertedelm);
      }
    };
    var syncsrcattr = function (editor, image) {
      editor.dom.setattrib(image, 'src', image.getattribute('src'));
    };
    var deleteimage = function (editor, image) {
      if (image) {
        var elm = editor.dom.is(image.parentnode, 'figure.image') ? image.parentnode : image;
        editor.dom.remove(elm);
        editor.focus();
        editor.nodechanged();
        if (editor.dom.isempty(editor.getbody())) {
          editor.setcontent('');
          editor.selection.setcursorlocation();
        }
      }
    };
    var writeimagedatatoselection = function (editor, data) {
      var image = getselectedimage(editor);
      write(function (css) {
        return normalizecss(editor, css);
      }, data, image);
      syncsrcattr(editor, image);
      if (isfigure(image.parentnode)) {
        var figure = image.parentnode;
        splittextblock(editor, figure);
        editor.selection.select(image.parentnode);
      } else {
        editor.selection.select(image);
        utils.waitloadimage(editor, data, image);
      }
    };
    var insertorupdateimage = function (editor, data) {
      var image = getselectedimage(editor);
      if (image) {
        if (data.src) {
          writeimagedatatoselection(editor, data);
        } else {
          deleteimage(editor, image);
        }
      } else if (data.src) {
        insertimageatcaret(editor, data);
      }
    };

    var updatevspacehspaceborder = function (editor) {
      return function (evt) {
        var dom = editor.dom;
        var rootcontrol = evt.control.rootcontrol;
        if (!settings.hasadvtab(editor)) {
          return;
        }
        var data = rootcontrol.tojson();
        var css = dom.parsestyle(data.style);
        rootcontrol.find('#vspace').value('');
        rootcontrol.find('#hspace').value('');
        css = utils.mergemargins(css);
        if (css['margin-top'] && css['margin-bottom'] || css['margin-right'] && css['margin-left']) {
          if (css['margin-top'] === css['margin-bottom']) {
            rootcontrol.find('#vspace').value(utils.removepixelsuffix(css['margin-top']));
          } else {
            rootcontrol.find('#vspace').value('');
          }
          if (css['margin-right'] === css['margin-left']) {
            rootcontrol.find('#hspace').value(utils.removepixelsuffix(css['margin-right']));
          } else {
            rootcontrol.find('#hspace').value('');
          }
        }
        if (css['border-width']) {
          rootcontrol.find('#border').value(utils.removepixelsuffix(css['border-width']));
        } else {
          rootcontrol.find('#border').value('');
        }
        if (css['border-style']) {
          rootcontrol.find('#borderstyle').value(css['border-style']);
        } else {
          rootcontrol.find('#borderstyle').value('');
        }
        rootcontrol.find('#style').value(dom.serializestyle(dom.parsestyle(dom.serializestyle(css))));
      };
    };
    var updatestyle = function (editor, win) {
      win.find('#style').each(function (ctrl) {
        var value = getstylevalue(function (css) {
          return normalizecss(editor, css);
        }, merge(defaultdata(), win.tojson()));
        ctrl.value(value);
      });
    };
    var maketab = function (editor) {
      return {
        title: 'advanced',
        type: 'form',
        pack: 'start',
        items: [
          {
            label: 'style',
            name: 'style',
            type: 'textbox',
            onchange: updatevspacehspaceborder(editor)
          },
          {
            type: 'form',
            layout: 'grid',
            packv: 'start',
            columns: 2,
            padding: 0,
            defaults: {
              type: 'textbox',
              maxwidth: 50,
              onchange: function (evt) {
                updatestyle(editor, evt.control.rootcontrol);
              }
            },
            items: [
              {
                label: 'vertical space',
                name: 'vspace'
              },
              {
                label: 'border width',
                name: 'border'
              },
              {
                label: 'horizontal space',
                name: 'hspace'
              },
              {
                label: 'border style',
                type: 'listbox',
                name: 'borderstyle',
                width: 90,
                maxwidth: 90,
                onselect: function (evt) {
                  updatestyle(editor, evt.control.rootcontrol);
                },
                values: [
                  {
                    text: 'select...',
                    value: ''
                  },
                  {
                    text: 'solid',
                    value: 'solid'
                  },
                  {
                    text: 'dotted',
                    value: 'dotted'
                  },
                  {
                    text: 'dashed',
                    value: 'dashed'
                  },
                  {
                    text: 'double',
                    value: 'double'
                  },
                  {
                    text: 'groove',
                    value: 'groove'
                  },
                  {
                    text: 'ridge',
                    value: 'ridge'
                  },
                  {
                    text: 'inset',
                    value: 'inset'
                  },
                  {
                    text: 'outset',
                    value: 'outset'
                  },
                  {
                    text: 'none',
                    value: 'none'
                  },
                  {
                    text: 'hidden',
                    value: 'hidden'
                  }
                ]
              }
            ]
          }
        ]
      };
    };
    var advtab = { maketab: maketab };

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
    var createui = function () {
      var recalcsize = function (evt) {
        updatesize(evt.control.rootcontrol);
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

    var onsrcchange = function (evt, editor) {
      var srcurl, prependurl, absoluteurlpattern;
      var meta = evt.meta || {};
      var control = evt.control;
      var rootcontrol = control.rootcontrol;
      var imagelistctrl = rootcontrol.find('#image-list')[0];
      if (imagelistctrl) {
        imagelistctrl.value(editor.converturl(control.value(), 'src'));
      }
      global$2.each(meta, function (value, key) {
        rootcontrol.find('#' + key).value(value);
      });
      if (!meta.width && !meta.height) {
        srcurl = editor.converturl(control.value(), 'src');
        prependurl = settings.getprependurl(editor);
        absoluteurlpattern = new regexp('^(?:[a-z]+:)?//', 'i');
        if (prependurl && !absoluteurlpattern.test(srcurl) && srcurl.substring(0, prependurl.length) !== prependurl) {
          srcurl = prependurl + srcurl;
        }
        control.value(srcurl);
        utils.getimagesize(editor.documentbaseuri.toabsolute(control.value()), function (data) {
          if (data.width && data.height && settings.hasdimensions(editor)) {
            rootcontrol.find('#width').value(data.width);
            rootcontrol.find('#height').value(data.height);
            sizemanager.syncsize(rootcontrol);
          }
        });
      }
    };
    var onbeforecall = function (evt) {
      evt.meta = evt.control.rootcontrol.tojson();
    };
    var getgeneralitems = function (editor, imagelistctrl) {
      var generalformitems = [
        {
          name: 'src',
          type: 'filepicker',
          filetype: 'image',
          label: 'source',
          autofocus: true,
          onchange: function (evt) {
            onsrcchange(evt, editor);
          },
          onbeforecall: onbeforecall
        },
        imagelistctrl
      ];
      if (settings.hasdescription(editor)) {
        generalformitems.push({
          name: 'alt',
          type: 'textbox',
          label: 'image description'
        });
      }
      if (settings.hasimagetitle(editor)) {
        generalformitems.push({
          name: 'title',
          type: 'textbox',
          label: 'image title'
        });
      }
      if (settings.hasdimensions(editor)) {
        generalformitems.push(sizemanager.createui());
      }
      if (settings.getclasslist(editor)) {
        generalformitems.push({
          name: 'class',
          type: 'listbox',
          label: 'class',
          values: utils.buildlistitems(settings.getclasslist(editor), function (item) {
            if (item.value) {
              item.textstyle = function () {
                return editor.formatter.getcsstext({
                  inline: 'img',
                  classes: [item.value]
                });
              };
            }
          })
        });
      }
      if (settings.hasimagecaption(editor)) {
        generalformitems.push({
          name: 'caption',
          type: 'checkbox',
          label: 'caption'
        });
      }
      return generalformitems;
    };
    var maketab$1 = function (editor, imagelistctrl) {
      return {
        title: 'general',
        type: 'form',
        items: getgeneralitems(editor, imagelistctrl)
      };
    };
    var maintab = {
      maketab: maketab$1,
      getgeneralitems: getgeneralitems
    };

    var url = function () {
      return global$1.getordie('url');
    };
    var createobjecturl = function (blob) {
      return url().createobjecturl(blob);
    };
    var revokeobjecturl = function (u) {
      url().revokeobjecturl(u);
    };
    var url = {
      createobjecturl: createobjecturl,
      revokeobjecturl: revokeobjecturl
    };

    var global$5 = tinymce.util.tools.resolve('tinymce.ui.factory');

    function xmlhttprequest () {
      var f = global$1.getordie('xmlhttprequest');
      return new f();
    }

    var noop = function () {
    };
    var pathjoin = function (path1, path2) {
      if (path1) {
        return path1.replace(/\/$/, '') + '/' + path2.replace(/^\//, '');
      }
      return path2;
    };
    function uploader (settings) {
      var defaulthandler = function (blobinfo, success, failure, progress) {
        var xhr, formdata;
        xhr = xmlhttprequest();
        xhr.open('post', settings.url);
        xhr.withcredentials = settings.credentials;
        xhr.upload.onprogress = function (e) {
          progress(e.loaded / e.total * 100);
        };
        xhr.onerror = function () {
          failure('image upload failed due to a xhr transport error. code: ' + xhr.status);
        };
        xhr.onload = function () {
          var json;
          if (xhr.status < 200 || xhr.status >= 300) {
            failure('http error: ' + xhr.status);
            return;
          }
          json = json.parse(xhr.responsetext);
          if (!json || typeof json.location !== 'string') {
            failure('invalid json: ' + xhr.responsetext);
            return;
          }
          success(pathjoin(settings.basepath, json.location));
        };
        formdata = new domglobals.formdata();
        formdata.append('file', blobinfo.blob(), blobinfo.filename());
        xhr.send(formdata);
      };
      var uploadblob = function (blobinfo, handler) {
        return new global$1(function (resolve, reject) {
          try {
            handler(blobinfo, resolve, reject, noop);
          } catch (ex) {
            reject(ex.message);
          }
        });
      };
      var isdefaulthandler = function (handler) {
        return handler === defaulthandler;
      };
      var upload = function (blobinfo) {
        return !settings.url && isdefaulthandler(settings.handler) ? global$1.reject('upload url missing from the settings.') : uploadblob(blobinfo, settings.handler);
      };
      settings = global$2.extend({
        credentials: false,
        handler: defaulthandler
      }, settings);
      return { upload: upload };
    }

    var onfileinput = function (editor) {
      return function (evt) {
        var throbber = global$5.get('throbber');
        var rootcontrol = evt.control.rootcontrol;
        var throbber = new throbber(rootcontrol.getel());
        var file = evt.control.value();
        var bloburi = url.createobjecturl(file);
        var uploader = uploader({
          url: settings.getuploadurl(editor),
          basepath: settings.getuploadbasepath(editor),
          credentials: settings.getuploadcredentials(editor),
          handler: settings.getuploadhandler(editor)
        });
        var finalize = function () {
          throbber.hide();
          url.revokeobjecturl(bloburi);
        };
        throbber.show();
        return utils.blobtodatauri(file).then(function (dataurl) {
          var blobinfo = editor.editorupload.blobcache.create({
            blob: file,
            bloburi: bloburi,
            name: file.name ? file.name.replace(/\.[^\.]+$/, '') : null,
            base64: dataurl.split(',')[1]
          });
          return uploader.upload(blobinfo).then(function (url) {
            var src = rootcontrol.find('#src');
            src.value(url);
            rootcontrol.find('tabpanel')[0].activatetab(0);
            src.fire('change');
            finalize();
            return url;
          });
        }).catch(function (err) {
          editor.windowmanager.alert(err);
          finalize();
        });
      };
    };
    var acceptexts = '.jpg,.jpeg,.png,.gif';
    var maketab$2 = function (editor) {
      return {
        title: 'upload',
        type: 'form',
        layout: 'flex',
        direction: 'column',
        align: 'stretch',
        padding: '20 20 20 20',
        items: [
          {
            type: 'container',
            layout: 'flex',
            direction: 'column',
            align: 'center',
            spacing: 10,
            items: [
              {
                text: 'browse for an image',
                type: 'browsebutton',
                accept: acceptexts,
                onchange: onfileinput(editor)
              },
              {
                text: 'or',
                type: 'label'
              }
            ]
          },
          {
            text: 'drop an image here',
            type: 'dropzone',
            accept: acceptexts,
            height: 100,
            onchange: onfileinput(editor)
          }
        ]
      };
    };
    var uploadtab = { maketab: maketab$2 };

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

    var submitform = function (editor, evt) {
      var win = evt.control.getroot();
      sizemanager.updatesize(win);
      editor.undomanager.transact(function () {
        var data = merge(readimagedatafromselection(editor), win.tojson());
        insertorupdateimage(editor, data);
      });
      editor.editorupload.uploadimagesauto();
    };
    function dialog (editor) {
      function showdialog(imagelist) {
        var data = readimagedatafromselection(editor);
        var win, imagelistctrl;
        if (imagelist) {
          imagelistctrl = {
            type: 'listbox',
            label: 'image list',
            name: 'image-list',
            values: utils.buildlistitems(imagelist, function (item) {
              item.value = editor.converturl(item.value || item.url, 'src');
            }, [{
                text: 'none',
                value: ''
              }]),
            value: data.src && editor.converturl(data.src, 'src'),
            onselect: function (e) {
              var altctrl = win.find('#alt');
              if (!altctrl.value() || e.lastcontrol && altctrl.value() === e.lastcontrol.text()) {
                altctrl.value(e.control.text());
              }
              win.find('#src').value(e.control.value()).fire('change');
            },
            onpostrender: function () {
              imagelistctrl = this;
            }
          };
        }
        if (settings.hasadvtab(editor) || settings.hasuploadurl(editor) || settings.hasuploadhandler(editor)) {
          var body = [maintab.maketab(editor, imagelistctrl)];
          if (settings.hasadvtab(editor)) {
            body.push(advtab.maketab(editor));
          }
          if (settings.hasuploadurl(editor) || settings.hasuploadhandler(editor)) {
            body.push(uploadtab.maketab(editor));
          }
          win = editor.windowmanager.open({
            title: 'insert/edit image',
            data: data,
            bodytype: 'tabpanel',
            body: body,
            onsubmit: curry(submitform, editor)
          });
        } else {
          win = editor.windowmanager.open({
            title: 'insert/edit image',
            data: data,
            body: maintab.getgeneralitems(editor, imagelistctrl),
            onsubmit: curry(submitform, editor)
          });
        }
        sizemanager.syncsize(win);
      }
      function open() {
        utils.createimagelist(editor, showdialog);
      }
      return { open: open };
    }

    var register = function (editor) {
      editor.addcommand('mceimage', dialog(editor).open);
    };
    var commands = { register: register };

    var hasimageclass = function (node) {
      var classname = node.attr('class');
      return classname && /\bimage\b/.test(classname);
    };
    var togglecontenteditablestate = function (state) {
      return function (nodes) {
        var i = nodes.length, node;
        var togglecontenteditable = function (node) {
          node.attr('contenteditable', state ? 'true' : null);
        };
        while (i--) {
          node = nodes[i];
          if (hasimageclass(node)) {
            node.attr('contenteditable', state ? 'false' : null);
            global$2.each(node.getall('figcaption'), togglecontenteditable);
          }
        }
      };
    };
    var setup = function (editor) {
      editor.on('preinit', function () {
        editor.parser.addnodefilter('figure', togglecontenteditablestate(true));
        editor.serializer.addnodefilter('figure', togglecontenteditablestate(false));
      });
    };
    var filtercontent = { setup: setup };

    var register$1 = function (editor) {
      editor.addbutton('image', {
        icon: 'image',
        tooltip: 'insert/edit image',
        onclick: dialog(editor).open,
        stateselector: 'img:not([data-mce-object],[data-mce-placeholder]),figure.image'
      });
      editor.addmenuitem('image', {
        icon: 'image',
        text: 'image',
        onclick: dialog(editor).open,
        context: 'insert',
        prependtocontext: true
      });
    };
    var buttons = { register: register$1 };

    global.add('image', function (editor) {
      filtercontent.setup(editor);
      buttons.register(editor);
      commands.register(editor);
    });
    function plugin () {
    }

    return plugin;

}(window));
})();







