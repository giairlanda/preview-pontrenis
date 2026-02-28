!function(e){var t=e.element.prototype;"function"!=typeof t.matches&&(t.matches=t.msmatchesselector||t.mozmatchesselector||t.webkitmatchesselector||function(e){for(var t=(this.document||this.ownerdocument).queryselectorall(e),o=0;t[o]&&t[o]!==this;)++o;return boolean(t[o])}),"function"!=typeof t.closest&&(t.closest=function(e){for(var t=this;t&&1===t.nodetype;){if(t.matches(e))return t;t=t.parentnode}return null})}(window);








