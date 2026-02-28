/**
 * mctabs.js
 *
 * released under lgpl license.
 * copyright (c) 1999-2017 ephox corp. all rights reserved
 *
 * license: http://www.tinymce.com/license
 * contributing: http://www.tinymce.com/contributing
 */

/*jshint globals: tinymcepopup */

function mctabs() {
  this.settings = [];
  this.onchange = tinymcepopup.editor.windowmanager.createinstance('tinymce.util.dispatcher');
}

mctabs.prototype.init = function (settings) {
  this.settings = settings;
};

mctabs.prototype.getparam = function (name, default_value) {
  var value = null;

  value = (typeof (this.settings[name]) == "undefined") ? default_value : this.settings[name];

  // fix bool values
  if (value == "true" || value == "false") {
    return (value == "true");
  }

  return value;
};

mctabs.prototype.showtab = function (tab) {
  tab.classname = 'current';
  tab.setattribute("aria-selected", true);
  tab.setattribute("aria-expanded", true);
  tab.tabindex = 0;
};

mctabs.prototype.hidetab = function (tab) {
  var t = this;

  tab.classname = '';
  tab.setattribute("aria-selected", false);
  tab.setattribute("aria-expanded", false);
  tab.tabindex = -1;
};

mctabs.prototype.showpanel = function (panel) {
  panel.classname = 'current';
  panel.setattribute("aria-hidden", false);
};

mctabs.prototype.hidepanel = function (panel) {
  panel.classname = 'panel';
  panel.setattribute("aria-hidden", true);
};

mctabs.prototype.getpanelfortab = function (tabelm) {
  return tinymcepopup.dom.getattrib(tabelm, "aria-controls");
};

mctabs.prototype.displaytab = function (tab_id, panel_id, avoid_focus) {
  var panelelm, panelcontainerelm, tabelm, tabcontainerelm, selectionclass, nodes, i, t = this;

  tabelm = document.getelementbyid(tab_id);

  if (panel_id === undefined) {
    panel_id = t.getpanelfortab(tabelm);
  }

  panelelm = document.getelementbyid(panel_id);
  panelcontainerelm = panelelm ? panelelm.parentnode : null;
  tabcontainerelm = tabelm ? tabelm.parentnode : null;
  selectionclass = t.getparam('selection_class', 'current');

  if (tabelm && tabcontainerelm) {
    nodes = tabcontainerelm.childnodes;

    // hide all other tabs
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i].nodename == "li") {
        t.hidetab(nodes[i]);
      }
    }

    // show selected tab
    t.showtab(tabelm);
  }

  if (panelelm && panelcontainerelm) {
    nodes = panelcontainerelm.childnodes;

    // hide all other panels
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i].nodename == "div") {
        t.hidepanel(nodes[i]);
      }
    }

    if (!avoid_focus) {
      tabelm.focus();
    }

    // show selected panel
    t.showpanel(panelelm);
  }
};

mctabs.prototype.getanchor = function () {
  var pos, url = document.location.href;

  if ((pos = url.lastindexof('#')) != -1) {
    return url.substring(pos + 1);
  }

  return "";
};


//global instance
var mctabs = new mctabs();

tinymcepopup.oninit.add(function () {
  var tinymce = tinymcepopup.getwin().tinymce, dom = tinymcepopup.dom, each = tinymce.each;

  each(dom.select('div.tabs'), function (tabcontainerelm) {
    //var keynav;

    dom.setattrib(tabcontainerelm, "role", "tablist");

    var items = tinymcepopup.dom.select('li', tabcontainerelm);
    var action = function (id) {
      mctabs.displaytab(id, mctabs.getpanelfortab(id));
      mctabs.onchange.dispatch(id);
    };

    each(items, function (item) {
      dom.setattrib(item, 'role', 'tab');
      dom.bind(item, 'click', function (evt) {
        action(item.id);
      });
    });

    dom.bind(dom.getroot(), 'keydown', function (evt) {
      if (evt.keycode === 9 && evt.ctrlkey && !evt.altkey) { // tab
        //keynav.movefocus(evt.shiftkey ? -1 : 1);
        tinymce.dom.event.cancel(evt);
      }
    });

    each(dom.select('a', tabcontainerelm), function (a) {
      dom.setattrib(a, 'tabindex', '-1');
    });

    /*keynav = tinymcepopup.editor.windowmanager.createinstance('tinymce.ui.keyboardnavigation', {
      root: tabcontainerelm,
      items: items,
      onaction: action,
      actonfocus: true,
      enableleftright: true,
      enableupdown: true
    }, tinymcepopup.dom);*/
  }
);
});





