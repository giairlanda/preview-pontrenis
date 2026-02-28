/**
 * form_utils.js
 *
 * released under lgpl license.
 * copyright (c) 1999-2017 ephox corp. all rights reserved
 *
 * license: http://www.tinymce.com/license
 * contributing: http://www.tinymce.com/contributing
 */

var themebaseurl = tinymcepopup.editor.baseuri.toabsolute('themes/' + tinymcepopup.getparam("theme"));

function getcolorpickerhtml(id, target_form_element) {
  var h = "", dom = tinymcepopup.dom;

  if (label = dom.select('label[for=' + target_form_element + ']')[0]) {
    label.id = label.id || dom.uniqueid();
  }

  h += '<a role="button" aria-labelledby="' + id + '_label" id="' + id + '_link" href="javascript:;" onclick="tinymcepopup.pickcolor(event,\'' + target_form_element + '\');" onmousedown="return false;" class="pickcolor">';
  h += '<span id="' + id + '" title="' + tinymcepopup.getlang('browse') + '">&nbsp;<span id="' + id + '_label" class="mcevoicelabel mceicononly" style="display:none;">' + tinymcepopup.getlang('browse') + '</span></span></a>';

  return h;
}

function updatecolor(img_id, form_element_id) {
  document.getelementbyid(img_id).style.backgroundcolor = document.forms[0].elements[form_element_id].value;
}

function setbrowserdisabled(id, state) {
  var img = document.getelementbyid(id);
  var lnk = document.getelementbyid(id + "_link");

  if (lnk) {
    if (state) {
      lnk.setattribute("realhref", lnk.getattribute("href"));
      lnk.removeattribute("href");
      tinymcepopup.dom.addclass(img, 'disabled');
    } else {
      if (lnk.getattribute("realhref")) {
        lnk.setattribute("href", lnk.getattribute("realhref"));
      }

      tinymcepopup.dom.removeclass(img, 'disabled');
    }
  }
}

function getbrowserhtml(id, target_form_element, type, prefix) {
  var option = prefix + "_" + type + "_browser_callback", cb, html;

  cb = tinymcepopup.getparam(option, tinymcepopup.getparam("file_browser_callback"));

  if (!cb) {
    return "";
  }

  html = "";
  html += '<a id="' + id + '_link" href="javascript:openbrowser(\'' + id + '\',\'' + target_form_element + '\', \'' + type + '\',\'' + option + '\');" onmousedown="return false;" class="browse">';
  html += '<span id="' + id + '" title="' + tinymcepopup.getlang('browse') + '">&nbsp;</span></a>';

  return html;
}

function openbrowser(img_id, target_form_element, type, option) {
  var img = document.getelementbyid(img_id);

  if (img.classname != "mcebuttondisabled") {
    tinymcepopup.openbrowser(target_form_element, type, option);
  }
}

function selectbyvalue(form_obj, field_name, value, add_custom, ignore_case) {
  if (!form_obj || !form_obj.elements[field_name]) {
    return;
  }

  if (!value) {
    value = "";
  }

  var sel = form_obj.elements[field_name];

  var found = false;
  for (var i = 0; i < sel.options.length; i++) {
    var option = sel.options[i];

    if (option.value == value || (ignore_case && option.value.tolowercase() == value.tolowercase())) {
      option.selected = true;
      found = true;
    } else {
      option.selected = false;
    }
  }

  if (!found && add_custom && value != '') {
    var option = new option(value, value);
    option.selected = true;
    sel.options[sel.options.length] = option;
    sel.selectedindex = sel.options.length - 1;
  }

  return found;
}

function getselectvalue(form_obj, field_name) {
  var elm = form_obj.elements[field_name];

  if (elm == null || elm.options == null || elm.selectedindex === -1) {
    return "";
  }

  return elm.options[elm.selectedindex].value;
}

function addselectvalue(form_obj, field_name, name, value) {
  var s = form_obj.elements[field_name];
  var o = new option(name, value);
  s.options[s.options.length] = o;
}

function addclassestolist(list_id, specific_option) {
  // setup class droplist
  var styleselectelm = document.getelementbyid(list_id);
  var styles = tinymcepopup.getparam('theme_advanced_styles', false);
  styles = tinymcepopup.getparam(specific_option, styles);

  if (styles) {
    var stylesar = styles.split(';');

    for (var i = 0; i < stylesar.length; i++) {
      if (stylesar != "") {
        var key, value;

        key = stylesar[i].split('=')[0];
        value = stylesar[i].split('=')[1];

        styleselectelm.options[styleselectelm.length] = new option(key, value);
      }
    }
  } else {
    /*tinymce.each(tinymcepopup.editor.dom.getclasses(), function(o) {
    styleselectelm.options[styleselectelm.length] = new option(o.title || o['class'], o['class']);
    });*/
  }
}

function isvisible(element_id) {
  var elm = document.getelementbyid(element_id);

  return elm && elm.style.display != "none";
}

function convertrgbtohex(col) {
  var re = new regexp("rgb\\s*\\(\\s*([0-9]+).*,\\s*([0-9]+).*,\\s*([0-9]+).*\\)", "gi");

  var rgb = col.replace(re, "$1,$2,$3").split(',');
  if (rgb.length == 3) {
    r = parseint(rgb[0]).tostring(16);
    g = parseint(rgb[1]).tostring(16);
    b = parseint(rgb[2]).tostring(16);

    r = r.length == 1 ? '0' + r : r;
    g = g.length == 1 ? '0' + g : g;
    b = b.length == 1 ? '0' + b : b;

    return "#" + r + g + b;
  }

  return col;
}

function converthextorgb(col) {
  if (col.indexof('#') != -1) {
    col = col.replace(new regexp('[^0-9a-f]', 'gi'), '');

    r = parseint(col.substring(0, 2), 16);
    g = parseint(col.substring(2, 4), 16);
    b = parseint(col.substring(4, 6), 16);

    return "rgb(" + r + "," + g + "," + b + ")";
  }

  return col;
}

function trimsize(size) {
  return size.replace(/([0-9\.]+)(px|%|in|cm|mm|em|ex|pt|pc)/i, '$1$2');
}

function getcsssize(size) {
  size = trimsize(size);

  if (size == "") {
    return "";
  }

  // add px
  if (/^[0-9]+$/.test(size)) {
    size += 'px';
  }
  // confidence check, ie doesn't like broken values
  else if (!(/^[0-9\.]+(px|%|in|cm|mm|em|ex|pt|pc)$/i.test(size))) {
    return "";
  }

  return size;
}

function getstyle(elm, attrib, style) {
  var val = tinymcepopup.dom.getattrib(elm, attrib);

  if (val != '') {
    return '' + val;
  }

  if (typeof (style) == 'undefined') {
    style = attrib;
  }

  return tinymcepopup.dom.getstyle(elm, style);
}






