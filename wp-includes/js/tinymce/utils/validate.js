/**
 * validate.js
 *
 * released under lgpl license.
 * copyright (c) 1999-2017 ephox corp. all rights reserved
 *
 * license: http://www.tinymce.com/license
 * contributing: http://www.tinymce.com/contributing
 */

/**
  // string validation:

  if (!validator.isemail('myemail'))
    alert('invalid email.');

  // form validation:

  var f = document.forms['myform'];

  if (!validator.isemail(f.myemail))
    alert('invalid email.');
*/

var validator = {
  isemail : function (s) {
    return this.test(s, '^[-!#$%&\'*+\\./0-9=?a-z^_`a-z{|}~]+@[-!#$%&\'*+\\/0-9=?a-z^_`a-z{|}~]+\.[-!#$%&\'*+\\./0-9=?a-z^_`a-z{|}~]+$');
  },

  isabsurl : function (s) {
    return this.test(s, '^(news|telnet|nttp|file|http|ftp|https)://[-a-za-z0-9\\.]+\\/?.*$');
  },

  issize : function (s) {
    return this.test(s, '^[0-9.]+(%|in|cm|mm|em|ex|pt|pc|px)?$');
  },

  isid : function (s) {
    return this.test(s, '^[a-za-z_]([a-za-z0-9_])*$');
  },

  isempty : function (s) {
    var nl, i;

    if (s.nodename == 'select' && s.selectedindex < 1) {
      return true;
    }

    if (s.type == 'checkbox' && !s.checked) {
      return true;
    }

    if (s.type == 'radio') {
      for (i = 0, nl = s.form.elements; i < nl.length; i++) {
        if (nl[i].type == "radio" && nl[i].name == s.name && nl[i].checked) {
          return false;
        }
      }

      return true;
    }

    return new regexp('^\\s*$').test(s.nodetype == 1 ? s.value : s);
  },

  isnumber : function (s, d) {
    return !isnan(s.nodetype == 1 ? s.value : s) && (!d || !this.test(s, '^-?[0-9]*\\.[0-9]*$'));
  },

  test : function (s, p) {
    s = s.nodetype == 1 ? s.value : s;

    return s == '' || new regexp(p).test(s);
  }
};

var autovalidator = {
  settings : {
    id_cls : 'id',
    int_cls : 'int',
    url_cls : 'url',
    number_cls : 'number',
    email_cls : 'email',
    size_cls : 'size',
    required_cls : 'required',
    invalid_cls : 'invalid',
    min_cls : 'min',
    max_cls : 'max'
  },

  init : function (s) {
    var n;

    for (n in s) {
      this.settings[n] = s[n];
    }
  },

  validate : function (f) {
    var i, nl, s = this.settings, c = 0;

    nl = this.tags(f, 'label');
    for (i = 0; i < nl.length; i++) {
      this.removeclass(nl[i], s.invalid_cls);
      nl[i].setattribute('aria-invalid', false);
    }

    c += this.validateelms(f, 'input');
    c += this.validateelms(f, 'select');
    c += this.validateelms(f, 'textarea');

    return c == 3;
  },

  invalidate : function (n) {
    this.mark(n.form, n);
  },

  geterrormessages : function (f) {
    var nl, i, s = this.settings, field, msg, values, messages = [], ed = tinymcepopup.editor;
    nl = this.tags(f, "label");
    for (i = 0; i < nl.length; i++) {
      if (this.hasclass(nl[i], s.invalid_cls)) {
        field = document.getelementbyid(nl[i].getattribute("for"));
        values = { field: nl[i].textcontent };
        if (this.hasclass(field, s.min_cls, true)) {
          message = ed.getlang('invalid_data_min');
          values.min = this.getnum(field, s.min_cls);
        } else if (this.hasclass(field, s.number_cls)) {
          message = ed.getlang('invalid_data_number');
        } else if (this.hasclass(field, s.size_cls)) {
          message = ed.getlang('invalid_data_size');
        } else {
          message = ed.getlang('invalid_data');
        }

        message = message.replace(/{\#([^}]+)\}/g, function (a, b) {
          return values[b] || '{#' + b + '}';
        });
        messages.push(message);
      }
    }
    return messages;
  },

  reset : function (e) {
    var t = ['label', 'input', 'select', 'textarea'];
    var i, j, nl, s = this.settings;

    if (e == null) {
      return;
    }

    for (i = 0; i < t.length; i++) {
      nl = this.tags(e.form ? e.form : e, t[i]);
      for (j = 0; j < nl.length; j++) {
        this.removeclass(nl[j], s.invalid_cls);
        nl[j].setattribute('aria-invalid', false);
      }
    }
  },

  validateelms : function (f, e) {
    var nl, i, n, s = this.settings, st = true, va = validator, v;

    nl = this.tags(f, e);
    for (i = 0; i < nl.length; i++) {
      n = nl[i];

      this.removeclass(n, s.invalid_cls);

      if (this.hasclass(n, s.required_cls) && va.isempty(n)) {
        st = this.mark(f, n);
      }

      if (this.hasclass(n, s.number_cls) && !va.isnumber(n)) {
        st = this.mark(f, n);
      }

      if (this.hasclass(n, s.int_cls) && !va.isnumber(n, true)) {
        st = this.mark(f, n);
      }

      if (this.hasclass(n, s.url_cls) && !va.isabsurl(n)) {
        st = this.mark(f, n);
      }

      if (this.hasclass(n, s.email_cls) && !va.isemail(n)) {
        st = this.mark(f, n);
      }

      if (this.hasclass(n, s.size_cls) && !va.issize(n)) {
        st = this.mark(f, n);
      }

      if (this.hasclass(n, s.id_cls) && !va.isid(n)) {
        st = this.mark(f, n);
      }

      if (this.hasclass(n, s.min_cls, true)) {
        v = this.getnum(n, s.min_cls);

        if (isnan(v) || parseint(n.value) < parseint(v)) {
          st = this.mark(f, n);
        }
      }

      if (this.hasclass(n, s.max_cls, true)) {
        v = this.getnum(n, s.max_cls);

        if (isnan(v) || parseint(n.value) > parseint(v)) {
          st = this.mark(f, n);
        }
      }
    }

    return st;
  },

  hasclass : function (n, c, d) {
    return new regexp('\\b' + c + (d ? '[0-9]+' : '') + '\\b', 'g').test(n.classname);
  },

  getnum : function (n, c) {
    c = n.classname.match(new regexp('\\b' + c + '([0-9]+)\\b', 'g'))[0];
    c = c.replace(/[^0-9]/g, '');

    return c;
  },

  addclass : function (n, c, b) {
    var o = this.removeclass(n, c);
    n.classname = b ? c + (o !== '' ? (' ' + o) : '') : (o !== '' ? (o + ' ') : '') + c;
  },

  removeclass : function (n, c) {
    c = n.classname.replace(new regexp("(^|\\s+)" + c + "(\\s+|$)"), ' ');
    return n.classname = c !== ' ' ? c : '';
  },

  tags : function (f, s) {
    return f.getelementsbytagname(s);
  },

  mark : function (f, n) {
    var s = this.settings;

    this.addclass(n, s.invalid_cls);
    n.setattribute('aria-invalid', 'true');
    this.marklabels(f, n, s.invalid_cls);

    return false;
  },

  marklabels : function (f, n, ic) {
    var nl, i;

    nl = this.tags(f, "label");
    for (i = 0; i < nl.length; i++) {
      if (nl[i].getattribute("for") == n.id || nl[i].htmlfor == n.id) {
        this.addclass(nl[i], ic);
      }
    }

    return null;
  }
};



