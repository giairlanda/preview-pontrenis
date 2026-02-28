/**
 * editable_selects.js
 *
 * released under lgpl license.
 * copyright (c) 1999-2017 ephox corp. all rights reserved
 *
 * license: http://www.tinymce.com/license
 * contributing: http://www.tinymce.com/contributing
 */

var tinymce_editableselects = {
  editselectelm : null,

  init : function () {
    var nl = document.getelementsbytagname("select"), i, d = document, o;

    for (i = 0; i < nl.length; i++) {
      if (nl[i].classname.indexof('mceeditableselect') != -1) {
        o = new option(tinymcepopup.editor.translate('value'), '__mce_add_custom__');

        o.classname = 'mceaddselectvalue';

        nl[i].options[nl[i].options.length] = o;
        nl[i].onchange = tinymce_editableselects.onchangeeditableselect;
      }
    }
  },

  onchangeeditableselect : function (e) {
    var d = document, ne, se = window.event ? window.event.srcelement : e.target;

    if (se.options[se.selectedindex].value == '__mce_add_custom__') {
      ne = d.createelement("input");
      ne.id = se.id + "_custom";
      ne.name = se.name + "_custom";
      ne.type = "text";

      ne.style.width = se.offsetwidth + 'px';
      se.parentnode.insertbefore(ne, se);
      se.style.display = 'none';
      ne.focus();
      ne.onblur = tinymce_editableselects.onblureditableselectinput;
      ne.onkeydown = tinymce_editableselects.onkeydown;
      tinymce_editableselects.editselectelm = se;
    }
  },

  onblureditableselectinput : function () {
    var se = tinymce_editableselects.editselectelm;

    if (se) {
      if (se.previoussibling.value != '') {
        addselectvalue(document.forms[0], se.id, se.previoussibling.value, se.previoussibling.value);
        selectbyvalue(document.forms[0], se.id, se.previoussibling.value);
      } else {
        selectbyvalue(document.forms[0], se.id, '');
      }

      se.style.display = 'inline';
      se.parentnode.removechild(se.previoussibling);
      tinymce_editableselects.editselectelm = null;
    }
  },

  onkeydown : function (e) {
    e = e || window.event;

    if (e.keycode == 13) {
      tinymce_editableselects.onblureditableselectinput();
    }
  }
};


