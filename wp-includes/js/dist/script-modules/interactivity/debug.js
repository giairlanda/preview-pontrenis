/******/ var __webpack_modules__ = ({

/***/ 434:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// exports
__webpack_require__.d(__webpack_exports__, {
  zj: () => (/* reexport */ getconfig),
  sd: () => (/* reexport */ getcontext),
  v6: () => (/* reexport */ getelement),
  $k: () => (/* reexport */ getservercontext),
  vt: () => (/* reexport */ getserverstate),
  jb: () => (/* binding */ privateapis),
  yt: () => (/* reexport */ splittask),
  m_: () => (/* reexport */ store),
  hb: () => (/* reexport */ usecallback),
  vj: () => (/* reexport */ useeffect),
  ip: () => (/* reexport */ useinit),
  nf: () => (/* reexport */ uselayouteffect),
  kr: () => (/* reexport */ usememo),
  li: () => (/* reexport */ a),
  j0: () => (/* reexport */ d),
  fh: () => (/* reexport */ usewatch),
  v4: () => (/* reexport */ withscope),
  mh: () => (/* reexport */ withsyncevent)
});

// external module: ./node_modules/preact/dist/preact.module.js
var preact_module = __webpack_require__(622);
;// ./node_modules/preact/hooks/dist/hooks.module.js
var hooks_module_t,r,hooks_module_u,i,hooks_module_o=0,hooks_module_f=[],hooks_module_c=preact_module/* options */.ff,e=hooks_module_c.__b,a=hooks_module_c.__r,v=hooks_module_c.diffed,l=hooks_module_c.__c,m=hooks_module_c.unmount,s=hooks_module_c.__;function p(n,t){hooks_module_c.__h&&hooks_module_c.__h(r,n,hooks_module_o||t),hooks_module_o=0;var u=r.__h||(r.__h={__:[],__h:[]});return n>=u.__.length&&u.__.push({}),u.__[n]}function d(n){return hooks_module_o=1,h(d,n)}function h(n,u,i){var o=p(hooks_module_t++,2);if(o.t=n,!o.__c&&(o.__=[i?i(u):d(void 0,u),function(n){var t=o.__n?o.__n[0]:o.__[0],r=o.t(t,n);t!==r&&(o.__n=[r,o.__[1]],o.__c.setstate({}))}],o.__c=r,!r.__f)){var f=function(n,t,r){if(!o.__c.__h)return!0;var u=o.__c.__h.__.filter(function(n){return!!n.__c});if(u.every(function(n){return!n.__n}))return!c||c.call(this,n,t,r);var i=o.__c.props!==n;return u.foreach(function(n){if(n.__n){var t=n.__[0];n.__=n.__n,n.__n=void 0,t!==n.__[0]&&(i=!0)}}),c&&c.call(this,n,t,r)||i};r.__f=!0;var c=r.shouldcomponentupdate,e=r.componentwillupdate;r.componentwillupdate=function(n,t,r){if(this.__e){var u=c;c=void 0,f(n,t,r),c=u}e&&e.call(this,n,t,r)},r.shouldcomponentupdate=f}return o.__n||o.__}function y(n,u){var i=p(hooks_module_t++,3);!hooks_module_c.__s&&c(i.__h,u)&&(i.__=n,i.u=u,r.__h.__h.push(i))}function _(n,u){var i=p(hooks_module_t++,4);!hooks_module_c.__s&&c(i.__h,u)&&(i.__=n,i.u=u,r.__h.push(i))}function a(n){return hooks_module_o=5,t(function(){return{current:n}},[])}function f(n,t,r){hooks_module_o=6,_(function(){if("function"==typeof n){var r=n(t());return function(){n(null),r&&"function"==typeof r&&r()}}if(n)return n.current=t(),function(){return n.current=null}},null==r?r:r.concat(n))}function t(n,r){var u=p(hooks_module_t++,7);return c(u.__h,r)&&(u.__=n(),u.__h=r,u.__h=n),u.__}function q(n,t){return hooks_module_o=8,t(function(){return n},t)}function x(n){var u=r.context[n.__c],i=p(hooks_module_t++,9);return i.c=n,u?(null==i.__&&(i.__=!0,u.sub(r)),u.props.value):n.__}function p(n,t){hooks_module_c.usedebugvalue&&hooks_module_c.usedebugvalue(t?t(n):n)}function b(n){var u=p(hooks_module_t++,10),i=d();return u.__=n,r.componentdidcatch||(r.componentdidcatch=function(n,t){u.__&&u.__(n,t),i[1](n)}),[i[0],function(){i[1](void 0)}]}function g(){var n=p(hooks_module_t++,11);if(!n.__){for(var u=r.__v;null!==u&&!u.__m&&null!==u.__;)u=u.__;var i=u.__m||(u.__m=[0,0]);n.__="p"+i[0]+"-"+i[1]++}return n.__}function j(){for(var n;n=hooks_module_f.shift();)if(n.__p&&n.__h)try{n.__h.__h.foreach(z),n.__h.__h.foreach(b),n.__h.__h=[]}catch(t){n.__h.__h=[],hooks_module_c.__e(t,n.__v)}}hooks_module_c.__b=function(n){r=null,e&&e(n)},hooks_module_c.__=function(n,t){n&&t.__k&&t.__k.__m&&(n.__m=t.__k.__m),s&&s(n,t)},hooks_module_c.__r=function(n){a&&a(n),hooks_module_t=0;var i=(r=n.__c).__h;i&&(hooks_module_u===r?(i.__h=[],r.__h=[],i.__.foreach(function(n){n.__n&&(n.__=n.__n),n.u=n.__n=void 0})):(i.__h.foreach(z),i.__h.foreach(b),i.__h=[],hooks_module_t=0)),hooks_module_u=r},hooks_module_c.diffed=function(n){v&&v(n);var t=n.__c;t&&t.__h&&(t.__h.__h.length&&(1!==hooks_module_f.push(t)&&i===hooks_module_c.requestanimationframe||((i=hooks_module_c.requestanimationframe)||w)(j)),t.__h.__.foreach(function(n){n.u&&(n.__h=n.u),n.u=void 0})),hooks_module_u=r=null},hooks_module_c.__c=function(n,t){t.some(function(n){try{n.__h.foreach(z),n.__h=n.__h.filter(function(n){return!n.__||b(n)})}catch(r){t.some(function(n){n.__h&&(n.__h=[])}),t=[],hooks_module_c.__e(r,n.__v)}}),l&&l(n,t)},hooks_module_c.unmount=function(n){m&&m(n);var t,r=n.__c;r&&r.__h&&(r.__h.__.foreach(function(n){try{z(n)}catch(n){t=n}}),r.__h=void 0,t&&hooks_module_c.__e(t,r.__v))};var k="function"==typeof requestanimationframe;function w(n){var t,r=function(){cleartimeout(u),k&&cancelanimationframe(t),settimeout(n)},u=settimeout(r,35);k&&(t=requestanimationframe(r))}function z(n){var t=r,u=n.__c;"function"==typeof u&&(n.__c=void 0,u()),r=t}function b(n){var t=r;n.__c=n.__(),r=t}function c(n,t){return!n||n.length!==t.length||t.some(function(t,r){return t!==n[r]})}function d(n,t){return"function"==typeof t?t(n):t}

;// ./node_modules/@preact/signals-core/dist/signals-core.module.js
var signals_core_module_i=symbol.for("preact-signals");function signals_core_module_t(){if(!(signals_core_module_s>1)){var i,t=!1;while(void 0!==signals_core_module_h){var r=signals_core_module_h;signals_core_module_h=void 0;signals_core_module_f++;while(void 0!==r){var o=r.o;r.o=void 0;r.f&=-3;if(!(8&r.f)&&signals_core_module_c(r))try{r.c()}catch(r){if(!t){i=r;t=!0}}r=o}}signals_core_module_f=0;signals_core_module_s--;if(t)throw i}else signals_core_module_s--}function signals_core_module_r(i){if(signals_core_module_s>0)return i();signals_core_module_s++;try{return i()}finally{signals_core_module_t()}}var signals_core_module_o=void 0;function n(i){var t=signals_core_module_o;signals_core_module_o=void 0;try{return i()}finally{signals_core_module_o=t}}var signals_core_module_h=void 0,signals_core_module_s=0,signals_core_module_f=0,signals_core_module_v=0;function signals_core_module_e(i){if(void 0!==signals_core_module_o){var t=i.n;if(void 0===t||t.t!==signals_core_module_o){t={i:0,s:i,p:signals_core_module_o.s,n:void 0,t:signals_core_module_o,e:void 0,x:void 0,r:t};if(void 0!==signals_core_module_o.s)signals_core_module_o.s.n=t;signals_core_module_o.s=t;i.n=t;if(32&signals_core_module_o.f)i.s(t);return t}else if(-1===t.i){t.i=0;if(void 0!==t.n){t.n.p=t.p;if(void 0!==t.p)t.p.n=t.n;t.p=signals_core_module_o.s;t.n=void 0;signals_core_module_o.s.n=t;signals_core_module_o.s=t}return t}}}function signals_core_module_u(i,t){this.v=i;this.i=0;this.n=void 0;this.t=void 0;this.w=null==t?void 0:t.watched;this.z=null==t?void 0:t.unwatched;this.name=null==t?void 0:t.name}signals_core_module_u.prototype.brand=signals_core_module_i;signals_core_module_u.prototype.h=function(){return!0};signals_core_module_u.prototype.s=function(i){var t=this,r=this.t;if(r!==i&&void 0===i.e){i.x=r;this.t=i;if(void 0!==r)r.e=i;else n(function(){var i;null==(i=t.w)||i.call(t)})}};signals_core_module_u.prototype.u=function(i){var t=this;if(void 0!==this.t){var r=i.e,o=i.x;if(void 0!==r){r.x=o;i.e=void 0}if(void 0!==o){o.e=r;i.x=void 0}if(i===this.t){this.t=o;if(void 0===o)n(function(){var i;null==(i=t.z)||i.call(t)})}}};signals_core_module_u.prototype.subscribe=function(i){var t=this;return e(function(){var r=t.value,n=signals_core_module_o;signals_core_module_o=void 0;try{i(r)}finally{signals_core_module_o=n}},{name:"sub"})};signals_core_module_u.prototype.valueof=function(){return this.value};signals_core_module_u.prototype.tostring=function(){return this.value+""};signals_core_module_u.prototype.tojson=function(){return this.value};signals_core_module_u.prototype.peek=function(){var i=signals_core_module_o;signals_core_module_o=void 0;try{return this.value}finally{signals_core_module_o=i}};object.defineproperty(signals_core_module_u.prototype,"value",{get:function(){var i=signals_core_module_e(this);if(void 0!==i)i.i=this.i;return this.v},set:function(i){if(i!==this.v){if(signals_core_module_f>100)throw new error("cycle detected");this.v=i;this.i++;signals_core_module_v++;signals_core_module_s++;try{for(var r=this.t;void 0!==r;r=r.x)r.t.n()}finally{signals_core_module_t()}}}});function signals_core_module_d(i,t){return new signals_core_module_u(i,t)}function signals_core_module_c(i){for(var t=i.s;void 0!==t;t=t.n)if(t.s.i!==t.i||!t.s.h()||t.s.i!==t.i)return!0;return!1}function signals_core_module_a(i){for(var t=i.s;void 0!==t;t=t.n){var r=t.s.n;if(void 0!==r)t.r=r;t.s.n=t;t.i=-1;if(void 0===t.n){i.s=t;break}}}function signals_core_module_l(i){var t=i.s,r=void 0;while(void 0!==t){var o=t.p;if(-1===t.i){t.s.u(t);if(void 0!==o)o.n=t.n;if(void 0!==t.n)t.n.p=o}else r=t;t.s.n=t.r;if(void 0!==t.r)t.r=void 0;t=o}i.s=r}function signals_core_module_y(i,t){signals_core_module_u.call(this,void 0);this.x=i;this.s=void 0;this.g=signals_core_module_v-1;this.f=4;this.w=null==t?void 0:t.watched;this.z=null==t?void 0:t.unwatched;this.name=null==t?void 0:t.name}signals_core_module_y.prototype=new signals_core_module_u;signals_core_module_y.prototype.h=function(){this.f&=-3;if(1&this.f)return!1;if(32==(36&this.f))return!0;this.f&=-5;if(this.g===signals_core_module_v)return!0;this.g=signals_core_module_v;this.f|=1;if(this.i>0&&!signals_core_module_c(this)){this.f&=-2;return!0}var i=signals_core_module_o;try{signals_core_module_a(this);signals_core_module_o=this;var t=this.x();if(16&this.f||this.v!==t||0===this.i){this.v=t;this.f&=-17;this.i++}}catch(i){this.v=i;this.f|=16;this.i++}signals_core_module_o=i;signals_core_module_l(this);this.f&=-2;return!0};signals_core_module_y.prototype.s=function(i){if(void 0===this.t){this.f|=36;for(var t=this.s;void 0!==t;t=t.n)t.s.s(t)}signals_core_module_u.prototype.s.call(this,i)};signals_core_module_y.prototype.u=function(i){if(void 0!==this.t){signals_core_module_u.prototype.u.call(this,i);if(void 0===this.t){this.f&=-33;for(var t=this.s;void 0!==t;t=t.n)t.s.u(t)}}};signals_core_module_y.prototype.n=function(){if(!(2&this.f)){this.f|=6;for(var i=this.t;void 0!==i;i=i.x)i.t.n()}};object.defineproperty(signals_core_module_y.prototype,"value",{get:function(){if(1&this.f)throw new error("cycle detected");var i=signals_core_module_e(this);this.h();if(void 0!==i)i.i=this.i;if(16&this.f)throw this.v;return this.v}});function signals_core_module_w(i,t){return new signals_core_module_y(i,t)}function signals_core_module_(i){var r=i.u;i.u=void 0;if("function"==typeof r){signals_core_module_s++;var n=signals_core_module_o;signals_core_module_o=void 0;try{r()}catch(t){i.f&=-2;i.f|=8;signals_core_module_b(i);throw t}finally{signals_core_module_o=n;signals_core_module_t()}}}function signals_core_module_b(i){for(var t=i.s;void 0!==t;t=t.n)t.s.u(t);i.x=void 0;i.s=void 0;signals_core_module_(i)}function signals_core_module_g(i){if(signals_core_module_o!==this)throw new error("out-of-order effect");signals_core_module_l(this);signals_core_module_o=i;this.f&=-2;if(8&this.f)signals_core_module_b(this);signals_core_module_t()}function signals_core_module_p(i,t){this.x=i;this.u=void 0;this.s=void 0;this.o=void 0;this.f=32;this.name=null==t?void 0:t.name}signals_core_module_p.prototype.c=function(){var i=this.s();try{if(8&this.f)return;if(void 0===this.x)return;var t=this.x();if("function"==typeof t)this.u=t}finally{i()}};signals_core_module_p.prototype.s=function(){if(1&this.f)throw new error("cycle detected");this.f|=1;this.f&=-9;signals_core_module_(this);signals_core_module_a(this);signals_core_module_s++;var i=signals_core_module_o;signals_core_module_o=this;return signals_core_module_g.bind(this,i)};signals_core_module_p.prototype.n=function(){if(!(2&this.f)){this.f|=2;this.o=signals_core_module_h;signals_core_module_h=this}};signals_core_module_p.prototype.d=function(){this.f|=8;if(!(1&this.f))signals_core_module_b(this)};signals_core_module_p.prototype.dispose=function(){this.d()};function e(i,t){var r=new signals_core_module_p(i,t);try{r.c()}catch(i){r.d();throw i}var o=r.d.bind(r);o[symbol.dispose]=o;return o}
;// ./node_modules/@preact/signals/dist/signals.module.js
var signals_module_v,signals_module_s;function signals_module_l(i,n){preact_module/* options */.ff[i]=n.bind(null,preact_module/* options */.ff[i]||function(){})}function signals_module_d(i){if(signals_module_s)signals_module_s();signals_module_s=i&&i.s()}function signals_module_h(i){var r=this,f=i.data,o=usesignal(f);o.value=f;var e=t(function(){var i=r.__v;while(i=i.__)if(i.__c){i.__c.__$f|=4;break}r.__$u.c=function(){var i,t=r.__$u.s(),f=e.value;t();if((0,preact_module/* isvalidelement */.zo)(f)||3!==(null==(i=r.base)?void 0:i.nodetype)){r.__$f|=1;r.setstate({})}else r.base.data=f};return signals_core_module_w(function(){var i=o.value.value;return 0===i?0:!0===i?"":i||""})},[]);return e.value}signals_module_h.displayname="_st";object.defineproperties(signals_core_module_u.prototype,{constructor:{configurable:!0,value:void 0},type:{configurable:!0,value:signals_module_h},props:{configurable:!0,get:function(){return{data:this}}},__b:{configurable:!0,value:1}});signals_module_l("__b",function(i,r){if("string"==typeof r.type){var n,t=r.props;for(var f in t)if("children"!==f){var o=t[f];if(o instanceof signals_core_module_u){if(!n)r.__np=n={};n[f]=o;t[f]=o.peek()}}}i(r)});signals_module_l("__r",function(i,r){signals_module_d();var n,t=r.__c;if(t){t.__$f&=-2;if(void 0===(n=t.__$u))t.__$u=n=function(i){var r;e(function(){r=this});r.c=function(){t.__$f|=1;t.setstate({})};return r}()}signals_module_v=t;signals_module_d(n);i(r)});signals_module_l("__e",function(i,r,n,t){signals_module_d();signals_module_v=void 0;i(r,n,t)});signals_module_l("diffed",function(i,r){signals_module_d();signals_module_v=void 0;var n;if("string"==typeof r.type&&(n=r.__e)){var t=r.__np,f=r.props;if(t){var o=n.u;if(o)for(var e in o){var u=o[e];if(void 0!==u&&!(e in t)){u.d();o[e]=void 0}}else n.u=o={};for(var a in t){var c=o[a],s=t[a];if(void 0===c){c=signals_module_p(n,a,s,f);o[a]=c}else c.o(s,f)}}}i(r)});function signals_module_p(i,r,n,t){var f=r in i&&void 0===i.ownersvgelement,o=signals_core_module_d(n);return{o:function(i,r){o.value=i;t=r},d:e(function(){var n=o.value.value;if(t[r]!==n){t[r]=n;if(f)i[r]=n;else if(n)i.setattribute(r,n);else i.removeattribute(r)}})}}signals_module_l("unmount",function(i,r){if("string"==typeof r.type){var n=r.__e;if(n){var t=n.u;if(t){n.u=void 0;for(var f in t){var o=t[f];if(o)o.d()}}}}else{var e=r.__c;if(e){var u=e.__$u;if(u){e.__$u=void 0;u.d()}}}i(r)});signals_module_l("__h",function(i,r,n,t){if(t<3||9===t)r.__$f|=2;i(r,n,t)});preact_module/* component */.ua.prototype.shouldcomponentupdate=function(i,r){if(this.__r)return!0;var n=this.__$u,t=n&&void 0!==n.s;for(var f in r)return!0;if(this.__f||"boolean"==typeof this.u&&!0===this.u){if(!(t||2&this.__$f||4&this.__$f))return!0;if(1&this.__$f)return!0}else{if(!(t||4&this.__$f))return!0;if(3&this.__$f)return!0}for(var o in i)if("__source"!==o&&i[o]!==this.props[o])return!0;for(var e in this.props)if(!(e in i))return!0;return!1};function usesignal(i){return t(function(){return signals_core_module_d(i)},[])}function usecomputed(i){var r=f(i);r.current=i;signals_module_v.__$f|=4;return t(function(){return u(function(){return r.current()})},[])}function usesignaleffect(i){var r=f(i);r.current=i;o(function(){return c(function(){return r.current()})},[])}
;// ./node_modules/@wordpress/interactivity/build-module/namespaces.js
const namespacestack = [];
const getnamespace = () => namespacestack.slice(-1)[0];
const setnamespace = (namespace) => {
  namespacestack.push(namespace);
};
const resetnamespace = () => {
  namespacestack.pop();
};


;// ./node_modules/@wordpress/interactivity/build-module/scopes.js



const scopestack = [];
const getscope = () => scopestack.slice(-1)[0];
const setscope = (scope) => {
  scopestack.push(scope);
};
const resetscope = () => {
  scopestack.pop();
};
const thrownotinscope = (method) => {
  throw error(
    `cannot call \`${method}()\` when there is no scope. if you are using an async function, please consider using a generator instead. if you are using some sort of async callbacks, like \`settimeout\`, please wrap the callback with \`withscope(callback)\`.`
  );
};
const getcontext = (namespace) => {
  const scope = getscope();
  if (true) {
    if (!scope) {
      thrownotinscope("getcontext");
    }
  }
  return scope.context[namespace || getnamespace()];
};
const getelement = () => {
  const scope = getscope();
  let deepreadonlyoptions = {};
  if (true) {
    if (!scope) {
      thrownotinscope("getelement");
    }
    deepreadonlyoptions = {
      errormessage: "don't mutate the attributes from `getelement`, use `data-wp-bind` to modify the attributes of an element instead."
    };
  }
  const { ref, attributes } = scope;
  return object.freeze({
    ref: ref.current,
    attributes: deepreadonly(attributes, deepreadonlyoptions)
  });
};
const navigationcontextsignal = signals_core_module_d(0);
function getservercontext(namespace) {
  const scope = getscope();
  if (true) {
    if (!scope) {
      thrownotinscope("getservercontext");
    }
  }
  getservercontext.subscribe = navigationcontextsignal.value;
  return deepclone(scope.servercontext[namespace || getnamespace()]);
}
getservercontext.subscribe = 0;


;// ./node_modules/@wordpress/interactivity/build-module/utils.js




const afternextframe = (callback) => {
  return new promise((resolve) => {
    const done = () => {
      cleartimeout(timeout);
      window.cancelanimationframe(raf);
      settimeout(() => {
        callback();
        resolve();
      });
    };
    const timeout = settimeout(done, 100);
    const raf = window.requestanimationframe(done);
  });
};
const splittask = typeof window.scheduler?.yield === "function" ? window.scheduler.yield.bind(window.scheduler) : () => {
  return new promise((resolve) => {
    settimeout(resolve, 0);
  });
};
const ondomready = (callback) => {
  const [navigation] = performance.getentriesbytype("navigation");
  if (navigation.domcontentloadedeventstart > 0) {
    callback();
  } else {
    document.addeventlistener("domcontentloaded", callback);
  }
};
function createflusher(compute, notify) {
  let flush = () => void 0;
  const dispose = e(function() {
    flush = this.c.bind(this);
    this.x = compute;
    this.c = notify;
    return compute();
  });
  return { flush, dispose };
}
function utils_usesignaleffect(callback) {
  y(() => {
    let eff = null;
    let isexecuting = false;
    const notify = async () => {
      if (eff && !isexecuting) {
        isexecuting = true;
        await afternextframe(eff.flush);
        isexecuting = false;
      }
    };
    eff = createflusher(callback, notify);
    return eff.dispose;
  }, []);
}
function withscope(func) {
  const scope = getscope();
  const ns = getnamespace();
  let wrapped;
  if (func?.constructor?.name === "generatorfunction") {
    wrapped = async (...args) => {
      const gen = func(...args);
      let value;
      let it;
      let error;
      while (true) {
        setnamespace(ns);
        setscope(scope);
        try {
          it = error ? gen.throw(error) : gen.next(value);
          error = void 0;
        } catch (e) {
          throw e;
        } finally {
          resetscope();
          resetnamespace();
        }
        try {
          value = await it.value;
        } catch (e) {
          error = e;
        }
        if (it.done) {
          if (error) {
            throw error;
          } else {
            break;
          }
        }
      }
      return value;
    };
  } else {
    wrapped = (...args) => {
      setnamespace(ns);
      setscope(scope);
      try {
        return func(...args);
      } finally {
        resetnamespace();
        resetscope();
      }
    };
  }
  const syncaware = func;
  if (syncaware.sync) {
    const syncawarewrapped = wrapped;
    syncawarewrapped.sync = true;
    return syncawarewrapped;
  }
  return wrapped;
}
function usewatch(callback) {
  utils_usesignaleffect(withscope(callback));
}
function useinit(callback) {
  y(withscope(callback), []);
}
function useeffect(callback, inputs) {
  y(withscope(callback), inputs);
}
function uselayouteffect(callback, inputs) {
  _(withscope(callback), inputs);
}
function usecallback(callback, inputs) {
  return q(withscope(callback), inputs);
}
function usememo(factory, inputs) {
  return t(withscope(factory), inputs);
}
const createrootfragment = (parent, replacenode) => {
  replacenode = [].concat(replacenode);
  const sibling = replacenode[replacenode.length - 1].nextsibling;
  function insert(child, root) {
    parent.insertbefore(child, root || sibling);
  }
  return parent.__k = {
    nodetype: 1,
    parentnode: parent,
    firstchild: replacenode[0],
    childnodes: replacenode,
    insertbefore: insert,
    appendchild: insert,
    removechild(c) {
      parent.removechild(c);
    },
    contains(c) {
      parent.contains(c);
    }
  };
};
function kebabtocamelcase(str) {
  return str.replace(/^-+|-+$/g, "").tolowercase().replace(/-([a-z])/g, function(_match, group1) {
    return group1.touppercase();
  });
}
const logged = /* @__pure__ */ new set();
const warn = (message) => {
  if (true) {
    if (logged.has(message)) {
      return;
    }
    console.warn(message);
    try {
      throw error(message);
    } catch (e) {
    }
    logged.add(message);
  }
};
const isplainobject = (candidate) => boolean(
  candidate && typeof candidate === "object" && candidate.constructor === object
);
function withsyncevent(callback) {
  const syncaware = callback;
  syncaware.sync = true;
  return syncaware;
}
const readonlymap = /* @__pure__ */ new weakmap();
const createdeepreadonlyhandlers = (errormessage) => {
  const handleerror = () => {
    if (true) {
      warn(errormessage);
    }
    return false;
  };
  return {
    get(target, prop) {
      const value = target[prop];
      if (value && typeof value === "object") {
        return deepreadonly(value, { errormessage });
      }
      return value;
    },
    set: handleerror,
    deleteproperty: handleerror,
    defineproperty: handleerror
  };
};
function deepreadonly(obj, options) {
  const errormessage = options?.errormessage ?? "cannot modify read-only object";
  if (!readonlymap.has(obj)) {
    const handlers = createdeepreadonlyhandlers(errormessage);
    readonlymap.set(obj, new proxy(obj, handlers));
  }
  return readonlymap.get(obj);
}
const navigationsignal = signals_core_module_d(0);
function deepclone(source) {
  if (isplainobject(source)) {
    return object.fromentries(
      object.entries(source).map(([key, value]) => [
        key,
        deepclone(value)
      ])
    );
  }
  if (array.isarray(source)) {
    return source.map((i) => deepclone(i));
  }
  return source;
}


;// ./node_modules/@wordpress/interactivity/build-module/proxies/registry.js
const objtoproxy = /* @__pure__ */ new weakmap();
const proxytoobj = /* @__pure__ */ new weakmap();
const proxytons = /* @__pure__ */ new weakmap();
const supported = /* @__pure__ */ new set([object, array]);
const createproxy = (namespace, obj, handlers) => {
  if (!shouldproxy(obj)) {
    throw error("this object cannot be proxified.");
  }
  if (!objtoproxy.has(obj)) {
    const proxy = new proxy(obj, handlers);
    objtoproxy.set(obj, proxy);
    proxytoobj.set(proxy, obj);
    proxytons.set(proxy, namespace);
  }
  return objtoproxy.get(obj);
};
const getproxyfromobject = (obj) => objtoproxy.get(obj);
const getnamespacefromproxy = (proxy) => proxytons.get(proxy);
const shouldproxy = (candidate) => {
  if (typeof candidate !== "object" || candidate === null) {
    return false;
  }
  return !proxytons.has(candidate) && supported.has(candidate.constructor);
};
const getobjectfromproxy = (proxy) => proxytoobj.get(proxy);


;// ./node_modules/@wordpress/interactivity/build-module/proxies/signals.js





const no_scope = {};
class propsignal {
  /**
   * proxy that holds the property this propsignal is associated with.
   */
  owner;
  /**
   * relation of computeds by scope. these computeds are read-only signals
   * that depend on whether the property is a value or a getter and,
   * therefore, can return different values depending on the scope in which
   * the getter is accessed.
   */
  computedsbyscope;
  /**
   * signal with the value assigned to the related property.
   */
  valuesignal;
  /**
   * signal with the getter assigned to the related property.
   */
  gettersignal;
  /**
   * pending getter to be consolidated.
   */
  pendinggetter;
  /**
   * structure that manages reactivity for a property in a state object, using
   * signals to keep track of property value or getter modifications.
   *
   * @param owner proxy that holds the property this instance is associated
   *              with.
   */
  constructor(owner) {
    this.owner = owner;
    this.computedsbyscope = /* @__pure__ */ new weakmap();
  }
  /**
   * changes the internal value. if a getter was set before, it is set to
   * `undefined`.
   *
   * @param value new value.
   */
  setvalue(value) {
    this.update({ value });
  }
  /**
   * changes the internal getter. if a value was set before, it is set to
   * `undefined`.
   *
   * @param getter new getter.
   */
  setgetter(getter) {
    this.update({ get: getter });
  }
  /**
   * changes the internal getter asynchronously.
   *
   * the update is made in a microtask, which prevents issues with getters
   * accessing the state, and ensures the update occurs before any render.
   *
   * @param getter new getter.
   */
  setpendinggetter(getter) {
    this.pendinggetter = getter;
    queuemicrotask(() => this.consolidategetter());
  }
  /**
   * consolidate the pending value of the getter.
   */
  consolidategetter() {
    const getter = this.pendinggetter;
    if (getter) {
      this.pendinggetter = void 0;
      this.update({ get: getter });
    }
  }
  /**
   * returns the computed that holds the result of evaluating the prop in the
   * current scope.
   *
   * these computeds are read-only signals that depend on whether the property
   * is a value or a getter and, therefore, can return different values
   * depending on the scope in which the getter is accessed.
   *
   * @return computed that depends on the scope.
   */
  getcomputed() {
    const scope = getscope() || no_scope;
    if (!this.valuesignal && !this.gettersignal) {
      this.update({});
    }
    if (this.pendinggetter) {
      this.consolidategetter();
    }
    if (!this.computedsbyscope.has(scope)) {
      const callback = () => {
        const getter = this.gettersignal?.value;
        return getter ? getter.call(this.owner) : this.valuesignal?.value;
      };
      setnamespace(getnamespacefromproxy(this.owner));
      this.computedsbyscope.set(
        scope,
        signals_core_module_w(withscope(callback))
      );
      resetnamespace();
    }
    return this.computedsbyscope.get(scope);
  }
  /**
   *  updates the internal signals for the value and the getter of the
   *  corresponding prop.
   *
   * @param param0
   * @param param0.get   new getter.
   * @param param0.value new value.
   */
  update({ get, value }) {
    if (!this.valuesignal) {
      this.valuesignal = signals_core_module_d(value);
      this.gettersignal = signals_core_module_d(get);
    } else if (value !== this.valuesignal.peek() || get !== this.gettersignal.peek()) {
      signals_core_module_r(() => {
        this.valuesignal.value = value;
        this.gettersignal.value = get;
      });
    }
  }
}


;// ./node_modules/@wordpress/interactivity/build-module/proxies/state.js





const wellknownsymbols = new set(
  object.getownpropertynames(symbol).map((key) => symbol[key]).filter((value) => typeof value === "symbol")
);
const proxytoprops = /* @__pure__ */ new weakmap();
const haspropsignal = (proxy, key) => proxytoprops.has(proxy) && proxytoprops.get(proxy).has(key);
const getpropsignal = (proxy, key, initial) => {
  if (!proxytoprops.has(proxy)) {
    proxytoprops.set(proxy, /* @__pure__ */ new map());
  }
  key = typeof key === "number" ? `${key}` : key;
  const props = proxytoprops.get(proxy);
  if (!props.has(key)) {
    const ns = getnamespacefromproxy(proxy);
    const prop = new propsignal(proxy);
    props.set(key, prop);
    if (initial) {
      const { get, value } = initial;
      if (get) {
        prop.setgetter(get);
      } else {
        prop.setvalue(
          shouldproxy(value) ? proxifystate(ns, value) : value
        );
      }
    }
  }
  return props.get(key);
};
const objtoiterable = /* @__pure__ */ new weakmap();
let peeking = false;
const pending_getter = symbol("pending_getter");
const statehandlers = {
  get(target, key, receiver) {
    if (peeking || !target.hasownproperty(key) && key in target || typeof key === "symbol" && wellknownsymbols.has(key)) {
      return reflect.get(target, key, receiver);
    }
    const desc = object.getownpropertydescriptor(target, key);
    const prop = getpropsignal(receiver, key, desc);
    const result = prop.getcomputed().value;
    if (result === pending_getter) {
      throw pending_getter;
    }
    if (typeof result === "function") {
      const ns = getnamespacefromproxy(receiver);
      return (...args) => {
        setnamespace(ns);
        try {
          return result.call(receiver, ...args);
        } finally {
          resetnamespace();
        }
      };
    }
    return result;
  },
  set(target, key, value, receiver) {
    setnamespace(getnamespacefromproxy(receiver));
    try {
      return reflect.set(target, key, value, receiver);
    } finally {
      resetnamespace();
    }
  },
  defineproperty(target, key, desc) {
    const isnew = !(key in target);
    const result = reflect.defineproperty(target, key, desc);
    if (result) {
      const receiver = getproxyfromobject(target);
      const prop = getpropsignal(receiver, key);
      const { get, value } = desc;
      if (get) {
        prop.setgetter(get);
      } else {
        const ns = getnamespacefromproxy(receiver);
        prop.setvalue(
          shouldproxy(value) ? proxifystate(ns, value) : value
        );
      }
      if (isnew && objtoiterable.has(target)) {
        objtoiterable.get(target).value++;
      }
      if (array.isarray(target) && proxytoprops.get(receiver)?.has("length")) {
        const length = getpropsignal(receiver, "length");
        length.setvalue(target.length);
      }
    }
    return result;
  },
  deleteproperty(target, key) {
    const result = reflect.deleteproperty(target, key);
    if (result) {
      const prop = getpropsignal(getproxyfromobject(target), key);
      prop.setvalue(void 0);
      if (objtoiterable.has(target)) {
        objtoiterable.get(target).value++;
      }
    }
    return result;
  },
  ownkeys(target) {
    if (!objtoiterable.has(target)) {
      objtoiterable.set(target, signals_core_module_d(0));
    }
    objtoiterable._ = objtoiterable.get(target).value;
    return reflect.ownkeys(target);
  }
};
const proxifystate = (namespace, obj) => {
  return createproxy(namespace, obj, statehandlers);
};
const peek = (obj, key) => {
  peeking = true;
  try {
    return obj[key];
  } finally {
    peeking = false;
  }
};
const deepmergerecursive = (target, source, override = true) => {
  if (!(isplainobject(target) && isplainobject(source))) {
    return;
  }
  let hasnewkeys = false;
  for (const key in source) {
    const isnew = !(key in target);
    hasnewkeys = hasnewkeys || isnew;
    const desc = object.getownpropertydescriptor(source, key);
    const proxy = getproxyfromobject(target);
    const propsignal = !!proxy && haspropsignal(proxy, key) && getpropsignal(proxy, key);
    if (typeof desc.get === "function" || typeof desc.set === "function") {
      if (override || isnew) {
        object.defineproperty(target, key, {
          ...desc,
          configurable: true,
          enumerable: true
        });
        if (desc.get && propsignal) {
          propsignal.setpendinggetter(desc.get);
        }
      }
    } else if (isplainobject(source[key])) {
      const targetvalue = object.getownpropertydescriptor(target, key)?.value;
      if (isnew || override && !isplainobject(targetvalue)) {
        target[key] = {};
        if (propsignal) {
          const ns = getnamespacefromproxy(proxy);
          propsignal.setvalue(
            proxifystate(ns, target[key])
          );
        }
        deepmergerecursive(target[key], source[key], override);
      } else if (isplainobject(targetvalue)) {
        deepmergerecursive(target[key], source[key], override);
      }
    } else if (override || isnew) {
      object.defineproperty(target, key, desc);
      if (propsignal) {
        const { value } = desc;
        const ns = getnamespacefromproxy(proxy);
        propsignal.setvalue(
          shouldproxy(value) ? proxifystate(ns, value) : value
        );
      }
    }
  }
  if (hasnewkeys && objtoiterable.has(target)) {
    objtoiterable.get(target).value++;
  }
};
const deepmerge = (target, source, override = true) => signals_core_module_r(
  () => deepmergerecursive(
    getobjectfromproxy(target) || target,
    source,
    override
  )
);


;// ./node_modules/@wordpress/interactivity/build-module/proxies/store.js



const storeroots = /* @__pure__ */ new weakset();
const storehandlers = {
  get: (target, key, receiver) => {
    const result = reflect.get(target, key);
    const ns = getnamespacefromproxy(receiver);
    if (typeof result === "undefined" && storeroots.has(receiver)) {
      const obj = {};
      reflect.set(target, key, obj);
      return proxifystore(ns, obj, false);
    }
    if (typeof result === "function") {
      setnamespace(ns);
      const scoped = withscope(result);
      resetnamespace();
      return scoped;
    }
    if (isplainobject(result) && shouldproxy(result)) {
      return proxifystore(ns, result, false);
    }
    return result;
  }
};
const proxifystore = (namespace, obj, isroot = true) => {
  const proxy = createproxy(namespace, obj, storehandlers);
  if (proxy && isroot) {
    storeroots.add(proxy);
  }
  return proxy;
};


;// ./node_modules/@wordpress/interactivity/build-module/proxies/context.js
const contextobjecttoproxy = /* @__pure__ */ new weakmap();
const contextobjecttofallback = /* @__pure__ */ new weakmap();
const contextproxies = /* @__pure__ */ new weakset();
const descriptor = reflect.getownpropertydescriptor;
const contexthandlers = {
  get: (target, key) => {
    const fallback = contextobjecttofallback.get(target);
    const currentprop = target[key];
    return key in target ? currentprop : fallback[key];
  },
  set: (target, key, value) => {
    const fallback = contextobjecttofallback.get(target);
    const obj = key in target || !(key in fallback) ? target : fallback;
    obj[key] = value;
    return true;
  },
  ownkeys: (target) => [
    .../* @__pure__ */ new set([
      ...object.keys(contextobjecttofallback.get(target)),
      ...object.keys(target)
    ])
  ],
  getownpropertydescriptor: (target, key) => descriptor(target, key) || descriptor(contextobjecttofallback.get(target), key),
  has: (target, key) => reflect.has(target, key) || reflect.has(contextobjecttofallback.get(target), key)
};
const proxifycontext = (current, inherited = {}) => {
  if (contextproxies.has(current)) {
    throw error("this object cannot be proxified.");
  }
  contextobjecttofallback.set(current, inherited);
  if (!contextobjecttoproxy.has(current)) {
    const proxy = new proxy(current, contexthandlers);
    contextobjecttoproxy.set(current, proxy);
    contextproxies.add(proxy);
  }
  return contextobjecttoproxy.get(current);
};


;// ./node_modules/@wordpress/interactivity/build-module/proxies/index.js





;// ./node_modules/@wordpress/interactivity/build-module/store.js




const stores = /* @__pure__ */ new map();
const rawstores = /* @__pure__ */ new map();
const storelocks = /* @__pure__ */ new map();
const storeconfigs = /* @__pure__ */ new map();
const serverstates = /* @__pure__ */ new map();
const getconfig = (namespace) => storeconfigs.get(namespace || getnamespace()) || {};
function getserverstate(namespace) {
  const ns = namespace || getnamespace();
  if (!serverstates.has(ns)) {
    serverstates.set(ns, {});
  }
  getserverstate.subscribe = navigationsignal.value;
  return deepclone(serverstates.get(ns));
}
getserverstate.subscribe = 0;
const universalunlock = "i acknowledge that using a private store means my plugin will inevitably break on the next store release.";
function store(namespace, { state = {}, ...block } = {}, { lock = false } = {}) {
  if (!stores.has(namespace)) {
    if (lock !== universalunlock) {
      storelocks.set(namespace, lock);
    }
    const rawstore = {
      state: proxifystate(
        namespace,
        isplainobject(state) ? state : {}
      ),
      ...block
    };
    const proxifiedstore = proxifystore(namespace, rawstore);
    rawstores.set(namespace, rawstore);
    stores.set(namespace, proxifiedstore);
  } else {
    if (lock !== universalunlock && !storelocks.has(namespace)) {
      storelocks.set(namespace, lock);
    } else {
      const storelock = storelocks.get(namespace);
      const islockvalid = lock === universalunlock || lock !== true && lock === storelock;
      if (!islockvalid) {
        if (!storelock) {
          throw error("cannot lock a public store");
        } else {
          throw error(
            "cannot unlock a private store with an invalid lock code"
          );
        }
      }
    }
    const target = rawstores.get(namespace);
    deepmerge(target, block);
    deepmerge(target.state, state);
  }
  return stores.get(namespace);
}
const parseserverdata = (dom = document) => {
  const jsondatascripttag = (
    // preferred script module data passing form
    dom.getelementbyid(
      "wp-script-module-data-@wordpress/interactivity"
    ) ?? // legacy form
    dom.getelementbyid("wp-interactivity-data")
  );
  if (jsondatascripttag?.textcontent) {
    try {
      return json.parse(jsondatascripttag.textcontent);
    } catch {
    }
  }
  return {};
};
const populateserverdata = (data) => {
  serverstates.clear();
  storeconfigs.clear();
  if (isplainobject(data?.state)) {
    object.entries(data.state).foreach(([namespace, state]) => {
      const st = store(namespace, {}, { lock: universalunlock });
      deepmerge(st.state, state, false);
      serverstates.set(namespace, state);
    });
  }
  if (isplainobject(data?.config)) {
    object.entries(data.config).foreach(([namespace, config]) => {
      storeconfigs.set(namespace, config);
    });
  }
  if (isplainobject(data?.derivedstateclosures)) {
    object.entries(data.derivedstateclosures).foreach(
      ([namespace, paths]) => {
        const st = store(
          namespace,
          {},
          { lock: universalunlock }
        );
        paths.foreach((path) => {
          const pathparts = path.split(".");
          const prop = pathparts.splice(-1, 1)[0];
          const parent = pathparts.reduce(
            (prev, key) => peek(prev, key),
            st
          );
          const desc = object.getownpropertydescriptor(
            parent,
            prop
          );
          if (isplainobject(desc?.value)) {
            parent[prop] = pending_getter;
          }
        });
      }
    );
  }
};


;// ./node_modules/@wordpress/interactivity/build-module/hooks.js






function isnondefaultdirectivesuffix(entry) {
  return entry.suffix !== null;
}
function isdefaultdirectivesuffix(entry) {
  return entry.suffix === null;
}
const context = (0,preact_module/* createcontext */.q6)({ client: {}, server: {} });
const directivecallbacks = {};
const directivepriorities = {};
const directive = (name, callback, { priority = 10 } = {}) => {
  directivecallbacks[name] = callback;
  directivepriorities[name] = priority;
};
const resolve = (path, namespace) => {
  if (!namespace) {
    warn(
      `namespace missing for "${path}". the value for that path won't be resolved.`
    );
    return;
  }
  let resolvedstore = stores.get(namespace);
  if (typeof resolvedstore === "undefined") {
    resolvedstore = store(
      namespace,
      {},
      {
        lock: universalunlock
      }
    );
  }
  const current = {
    ...resolvedstore,
    context: getscope().context[namespace]
  };
  try {
    const pathparts = path.split(".");
    return pathparts.reduce((acc, key) => acc[key], current);
  } catch (e) {
    if (e === pending_getter) {
      return pending_getter;
    }
  }
};
const getevaluate = ({ scope }) => (
  // todo: when removing the temporarily remaining `value( ...args )` call below, remove the `...args` parameter too.
  (entry, ...args) => {
    let { value: path, namespace } = entry;
    if (typeof path !== "string") {
      throw new error("the `value` prop should be a string path");
    }
    const hasnegationoperator = path[0] === "!" && !!(path = path.slice(1));
    setscope(scope);
    const value = resolve(path, namespace);
    if (typeof value === "function") {
      if (hasnegationoperator) {
        warn(
          "using a function with a negation operator is deprecated and will stop working in wordpress 6.9. please use derived state instead."
        );
        const functionresult = !value(...args);
        resetscope();
        return functionresult;
      }
      resetscope();
      const wrappedfunction = (...functionargs) => {
        setscope(scope);
        const functionresult = value(...functionargs);
        resetscope();
        return functionresult;
      };
      if (value.sync) {
        const syncawarefunction = wrappedfunction;
        syncawarefunction.sync = true;
      }
      return wrappedfunction;
    }
    const result = value;
    resetscope();
    return hasnegationoperator && value !== pending_getter ? !result : result;
  }
);
const getprioritylevels = (directives) => {
  const bypriority = object.keys(directives).reduce((obj, name) => {
    if (directivecallbacks[name]) {
      const priority = directivepriorities[name];
      (obj[priority] = obj[priority] || []).push(name);
    }
    return obj;
  }, {});
  return object.entries(bypriority).sort(([p1], [p2]) => parseint(p1) - parseint(p2)).map(([, arr]) => arr);
};
const directives = ({
  directives,
  prioritylevels: [currentprioritylevel, ...nextprioritylevels],
  element,
  originalprops,
  previousscope
}) => {
  const scope = a({}).current;
  scope.evaluate = q(getevaluate({ scope }), []);
  const { client, server } = x(context);
  scope.context = client;
  scope.servercontext = server;
  scope.ref = previousscope?.ref || a(null);
  element = (0,preact_module/* cloneelement */.ob)(element, { ref: scope.ref });
  scope.attributes = element.props;
  const children = nextprioritylevels.length > 0 ? (0,preact_module.h)(directives, {
    directives,
    prioritylevels: nextprioritylevels,
    element,
    originalprops,
    previousscope: scope
  }) : element;
  const props = { ...originalprops, children };
  const directiveargs = {
    directives,
    props,
    element,
    context,
    evaluate: scope.evaluate
  };
  setscope(scope);
  for (const directivename of currentprioritylevel) {
    const wrapper = directivecallbacks[directivename]?.(directiveargs);
    if (wrapper !== void 0) {
      props.children = wrapper;
    }
  }
  resetscope();
  return props.children;
};
const old = preact_module/* options */.ff.vnode;
preact_module/* options */.ff.vnode = (vnode) => {
  if (vnode.props.__directives) {
    const props = vnode.props;
    const directives = props.__directives;
    if (directives.key) {
      vnode.key = directives.key.find(isdefaultdirectivesuffix).value;
    }
    delete props.__directives;
    const prioritylevels = getprioritylevels(directives);
    if (prioritylevels.length > 0) {
      vnode.props = {
        directives,
        prioritylevels,
        originalprops: props,
        type: vnode.type,
        element: (0,preact_module.h)(vnode.type, props),
        top: true
      };
      vnode.type = directives;
    }
  }
  if (old) {
    old(vnode);
  }
};


;// ./node_modules/@wordpress/interactivity/build-module/directives.js








const warnuniqueidwithtwohyphens = (prefix, suffix, uniqueid) => {
  if (true) {
    warn(
      `the usage of data-wp-${prefix}--${suffix}${uniqueid ? `--${uniqueid}` : ""} (two hyphens for unique id) is deprecated and will stop working in wordpress 7.1. please use data-wp-${prefix}${uniqueid ? `--${suffix}---${uniqueid}` : `---${suffix}`} (three hyphens for unique id) from now on.`
    );
  }
};
const warnuniqueidnotsupported = (prefix, uniqueid) => {
  if (true) {
    warn(
      `unique ids are not supported for the data-wp-${prefix} directive. ignoring the directive with unique id "${uniqueid}".`
    );
  }
};
const warnwithsyncevent = (wrongprefix, rightprefix) => {
  if (true) {
    warn(
      `the usage of data-wp-${wrongprefix} is deprecated and will stop working in wordpress 7.0. please, use data-wp-${rightprefix} with the withsyncevent() helper from now on.`
    );
  }
};
function wrapeventasync(event) {
  const handler = {
    get(target, prop, receiver) {
      const value = target[prop];
      switch (prop) {
        case "currenttarget":
          if (true) {
            warn(
              `accessing the synchronous event.${prop} property in a store action without wrapping it in withsyncevent() is deprecated and will stop working in wordpress 7.0. please wrap the store action in withsyncevent().`
            );
          }
          break;
        case "preventdefault":
        case "stopimmediatepropagation":
        case "stoppropagation":
          if (true) {
            warn(
              `using the synchronous event.${prop}() function in a store action without wrapping it in withsyncevent() is deprecated and will stop working in wordpress 7.0. please wrap the store action in withsyncevent().`
            );
          }
          break;
      }
      if (value instanceof function) {
        return function(...args) {
          return value.apply(
            this === receiver ? target : this,
            args
          );
        };
      }
      return value;
    }
  };
  return new proxy(event, handler);
}
const newrule = /(?:([\u0080-\uffff\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g;
const ruleclean = /\/\*[^]*?\*\/|  +/g;
const rulenewline = /\n+/g;
const empty = " ";
const cssstringtoobject = (val) => {
  const tree = [{}];
  let block, left;
  while (block = newrule.exec(val.replace(ruleclean, ""))) {
    if (block[4]) {
      tree.shift();
    } else if (block[3]) {
      left = block[3].replace(rulenewline, empty).trim();
      tree.unshift(tree[0][left] = tree[0][left] || {});
    } else {
      tree[0][block[1]] = block[2].replace(rulenewline, empty).trim();
    }
  }
  return tree[0];
};
const getglobaleventdirective = (type) => {
  return ({ directives, evaluate }) => {
    directives[`on-${type}`].filter(isnondefaultdirectivesuffix).foreach((entry) => {
      const suffixparts = entry.suffix.split("--", 2);
      const eventname = suffixparts[0];
      if (true) {
        if (suffixparts[1]) {
          warnuniqueidwithtwohyphens(
            `on-${type}`,
            suffixparts[0],
            suffixparts[1]
          );
        }
      }
      useinit(() => {
        const cb = (event) => {
          const result = evaluate(entry);
          if (typeof result === "function") {
            if (!result?.sync) {
              event = wrapeventasync(event);
            }
            result(event);
          }
        };
        const globalvar = type === "window" ? window : document;
        globalvar.addeventlistener(eventname, cb);
        return () => globalvar.removeeventlistener(eventname, cb);
      });
    });
  };
};
const evaluateitemkey = (inheritedvalue, namespace, item, itemprop, eachkey) => {
  const clientcontextwithitem = {
    ...inheritedvalue.client,
    [namespace]: {
      ...inheritedvalue.client[namespace],
      [itemprop]: item
    }
  };
  const scope = {
    ...getscope(),
    context: clientcontextwithitem,
    servercontext: inheritedvalue.server
  };
  return eachkey ? getevaluate({ scope })(eachkey) : item;
};
const useitemcontexts = function* (inheritedvalue, namespace, items, itemprop, eachkey) {
  const { current: itemcontexts } = a(/* @__pure__ */ new map());
  for (const item of items) {
    const key = evaluateitemkey(
      inheritedvalue,
      namespace,
      item,
      itemprop,
      eachkey
    );
    if (!itemcontexts.has(key)) {
      itemcontexts.set(
        key,
        proxifycontext(
          proxifystate(namespace, {
            // inits the item prop in the context to shadow it in case
            // it was inherited from the parent context. the actual
            // value is set in the `wp-each` directive later on.
            [itemprop]: void 0
          }),
          inheritedvalue.client[namespace]
        )
      );
    }
    yield [item, itemcontexts.get(key), key];
  }
};
const getglobalasynceventdirective = (type) => {
  return ({ directives, evaluate }) => {
    directives[`on-async-${type}`].filter(isnondefaultdirectivesuffix).foreach((entry) => {
      if (true) {
        warnwithsyncevent(`on-async-${type}`, `on-${type}`);
      }
      const eventname = entry.suffix.split("--", 1)[0];
      useinit(() => {
        const cb = async (event) => {
          await splittask();
          const result = evaluate(entry);
          if (typeof result === "function") {
            result(event);
          }
        };
        const globalvar = type === "window" ? window : document;
        globalvar.addeventlistener(eventname, cb, {
          passive: true
        });
        return () => globalvar.removeeventlistener(eventname, cb);
      });
    });
  };
};
const routerregions = /* @__pure__ */ new map();
var directives_default = () => {
  directive(
    "context",
    ({
      directives: { context },
      props: { children },
      context: inheritedcontext
    }) => {
      const entries = context.filter(isdefaultdirectivesuffix).reverse();
      if (!entries.length) {
        if (true) {
          warn(
            "the usage of data-wp-context--unique-id (two hyphens) is not supported. to add a unique id to the directive, please use data-wp-context---unique-id (three hyphens) instead."
          );
        }
        return;
      }
      const { provider } = inheritedcontext;
      const { client: inheritedclient, server: inheritedserver } = x(inheritedcontext);
      const client = a({});
      const server = {};
      const result = {
        client: { ...inheritedclient },
        server: { ...inheritedserver }
      };
      const namespaces = /* @__pure__ */ new set();
      entries.foreach(({ value, namespace, uniqueid }) => {
        if (!isplainobject(value)) {
          if (true) {
            warn(
              `the value of data-wp-context${uniqueid ? `---${uniqueid}` : ""} on the ${namespace} namespace must be a valid stringified json object.`
            );
          }
          return;
        }
        if (!client.current[namespace]) {
          client.current[namespace] = proxifystate(namespace, {});
        }
        deepmerge(
          client.current[namespace],
          deepclone(value),
          false
        );
        server[namespace] = value;
        namespaces.add(namespace);
      });
      namespaces.foreach((namespace) => {
        result.client[namespace] = proxifycontext(
          client.current[namespace],
          inheritedclient[namespace]
        );
        result.server[namespace] = proxifycontext(
          server[namespace],
          inheritedserver[namespace]
        );
      });
      return (0,preact_module.h)(provider, { value: result }, children);
    },
    { priority: 5 }
  );
  directive("watch", ({ directives: { watch }, evaluate }) => {
    watch.foreach((entry) => {
      if (true) {
        if (entry.suffix) {
          warnuniqueidwithtwohyphens("watch", entry.suffix);
        }
      }
      usewatch(() => {
        let start;
        if (false) {}
        let result = evaluate(entry);
        if (typeof result === "function") {
          result = result();
        }
        if (false) {}
        return result;
      });
    });
  });
  directive("init", ({ directives: { init }, evaluate }) => {
    init.foreach((entry) => {
      if (true) {
        if (entry.suffix) {
          warnuniqueidwithtwohyphens("init", entry.suffix);
        }
      }
      useinit(() => {
        let start;
        if (false) {}
        let result = evaluate(entry);
        if (typeof result === "function") {
          result = result();
        }
        if (false) {}
        return result;
      });
    });
  });
  directive("on", ({ directives: { on }, element, evaluate }) => {
    const events = /* @__pure__ */ new map();
    on.filter(isnondefaultdirectivesuffix).foreach((entry) => {
      const suffixparts = entry.suffix.split("--", 2);
      if (true) {
        if (suffixparts[1]) {
          warnuniqueidwithtwohyphens(
            "on",
            suffixparts[0],
            suffixparts[1]
          );
        }
      }
      if (!events.has(suffixparts[0])) {
        events.set(suffixparts[0], /* @__pure__ */ new set());
      }
      events.get(suffixparts[0]).add(entry);
    });
    events.foreach((entries, eventtype) => {
      const existinghandler = element.props[`on${eventtype}`];
      element.props[`on${eventtype}`] = (event) => {
        if (existinghandler) {
          existinghandler(event);
        }
        entries.foreach((entry) => {
          let start;
          if (false) {}
          const result = evaluate(entry);
          if (typeof result === "function") {
            if (!result?.sync) {
              event = wrapeventasync(event);
            }
            result(event);
          }
          if (false) {}
        });
      };
    });
  });
  directive(
    "on-async",
    ({ directives: { "on-async": onasync }, element, evaluate }) => {
      if (true) {
        warnwithsyncevent("on-async", "on");
      }
      const events = /* @__pure__ */ new map();
      onasync.filter(isnondefaultdirectivesuffix).foreach((entry) => {
        const event = entry.suffix.split("--", 1)[0];
        if (!events.has(event)) {
          events.set(event, /* @__pure__ */ new set());
        }
        events.get(event).add(entry);
      });
      events.foreach((entries, eventtype) => {
        const existinghandler = element.props[`on${eventtype}`];
        element.props[`on${eventtype}`] = (event) => {
          if (existinghandler) {
            existinghandler(event);
          }
          entries.foreach(async (entry) => {
            await splittask();
            const result = evaluate(entry);
            if (typeof result === "function") {
              result(event);
            }
          });
        };
      });
    }
  );
  directive("on-window", getglobaleventdirective("window"));
  directive("on-document", getglobaleventdirective("document"));
  directive("on-async-window", getglobalasynceventdirective("window"));
  directive(
    "on-async-document",
    getglobalasynceventdirective("document")
  );
  directive(
    "class",
    ({ directives: { class: classnames }, element, evaluate }) => {
      classnames.filter(isnondefaultdirectivesuffix).foreach((entry) => {
        const classname = entry.uniqueid ? `${entry.suffix}---${entry.uniqueid}` : entry.suffix;
        let result = evaluate(entry);
        if (result === pending_getter) {
          return;
        }
        if (typeof result === "function") {
          result = result();
        }
        const currentclass = element.props.class || "";
        const classfinder = new regexp(
          `(^|\\s)${classname}(\\s|$)`,
          "g"
        );
        if (!result) {
          element.props.class = currentclass.replace(classfinder, " ").trim();
        } else if (!classfinder.test(currentclass)) {
          element.props.class = currentclass ? `${currentclass} ${classname}` : classname;
        }
        useinit(() => {
          if (!result) {
            element.ref.current.classlist.remove(classname);
          } else {
            element.ref.current.classlist.add(classname);
          }
        });
      });
    }
  );
  directive("style", ({ directives: { style }, element, evaluate }) => {
    style.filter(isnondefaultdirectivesuffix).foreach((entry) => {
      if (entry.uniqueid) {
        if (true) {
          warnuniqueidnotsupported("style", entry.uniqueid);
        }
        return;
      }
      const styleprop = entry.suffix;
      let result = evaluate(entry);
      if (result === pending_getter) {
        return;
      }
      if (typeof result === "function") {
        result = result();
      }
      element.props.style = element.props.style || {};
      if (typeof element.props.style === "string") {
        element.props.style = cssstringtoobject(element.props.style);
      }
      if (!result) {
        delete element.props.style[styleprop];
      } else {
        element.props.style[styleprop] = result;
      }
      useinit(() => {
        if (!result) {
          element.ref.current.style.removeproperty(styleprop);
        } else {
          element.ref.current.style.setproperty(styleprop, result);
        }
      });
    });
  });
  directive("bind", ({ directives: { bind }, element, evaluate }) => {
    bind.filter(isnondefaultdirectivesuffix).foreach((entry) => {
      if (entry.uniqueid) {
        if (true) {
          warnuniqueidnotsupported("bind", entry.uniqueid);
        }
        return;
      }
      const attribute = entry.suffix;
      let result = evaluate(entry);
      if (result === pending_getter) {
        return;
      }
      if (typeof result === "function") {
        result = result();
      }
      element.props[attribute] = result;
      useinit(() => {
        const el = element.ref.current;
        if (attribute === "style") {
          if (typeof result === "string") {
            el.style.csstext = result;
          }
          return;
        } else if (attribute !== "width" && attribute !== "height" && attribute !== "href" && attribute !== "list" && attribute !== "form" && /*
         * the value for `tabindex` follows the parsing rules for an
         * integer. if that fails, or if the attribute isn't present, then
         * the browsers should "follow platform conventions to determine if
         * the element should be considered as a focusable area",
         * practically meaning that most elements get a default of `-1` (not
         * focusable), but several also get a default of `0` (focusable in
         * order after all elements with a positive `tabindex` value).
         *
         * @see https://html.spec.whatwg.org/#tabindex-value
         */
        attribute !== "tabindex" && attribute !== "download" && attribute !== "rowspan" && attribute !== "colspan" && attribute !== "role" && attribute in el) {
          try {
            el[attribute] = result === null || result === void 0 ? "" : result;
            return;
          } catch (err) {
          }
        }
        if (result !== null && result !== void 0 && (result !== false || attribute[4] === "-")) {
          el.setattribute(attribute, result);
        } else {
          el.removeattribute(attribute);
        }
      });
    });
  });
  directive(
    "ignore",
    ({
      element: {
        type: type,
        props: { innerhtml, ...rest }
      }
    }) => {
      if (true) {
        warn(
          "the data-wp-ignore directive is deprecated and will be removed in version 7.0."
        );
      }
      const cached = t(() => innerhtml, []);
      return (0,preact_module.h)(type, {
        dangerouslysetinnerhtml: { __html: cached },
        ...rest
      });
    }
  );
  directive("text", ({ directives: { text }, element, evaluate }) => {
    const entries = text.filter(isdefaultdirectivesuffix);
    if (!entries.length) {
      if (true) {
        warn(
          "the usage of data-wp-text--suffix is not supported. please use data-wp-text instead."
        );
      }
      return;
    }
    entries.foreach((entry) => {
      if (entry.uniqueid) {
        if (true) {
          warnuniqueidnotsupported("text", entry.uniqueid);
        }
        return;
      }
      try {
        let result = evaluate(entry);
        if (result === pending_getter) {
          return;
        }
        if (typeof result === "function") {
          result = result();
        }
        element.props.children = typeof result === "object" ? null : result.tostring();
      } catch (e) {
        element.props.children = null;
      }
    });
  });
  directive("run", ({ directives: { run }, evaluate }) => {
    run.foreach((entry) => {
      if (true) {
        if (entry.suffix) {
          warnuniqueidwithtwohyphens("run", entry.suffix);
        }
      }
      let result = evaluate(entry);
      if (typeof result === "function") {
        result = result();
      }
      return result;
    });
  });
  directive(
    "each",
    ({
      directives: { each, "each-key": eachkey },
      context: inheritedcontext,
      element,
      evaluate
    }) => {
      if (element.type !== "template") {
        if (true) {
          warn(
            "the data-wp-each directive can only be used on <template> elements."
          );
        }
        return;
      }
      const { provider } = inheritedcontext;
      const inheritedvalue = x(inheritedcontext);
      const [entry] = each;
      const { namespace, suffix, uniqueid } = entry;
      if (each.length > 1) {
        if (true) {
          warn(
            "the usage of multiple data-wp-each directives on the same element is not supported. please pick only one."
          );
        }
        return;
      }
      if (uniqueid) {
        if (true) {
          warnuniqueidnotsupported("each", uniqueid);
        }
        return;
      }
      let iterable = evaluate(entry);
      if (iterable === pending_getter) {
        return;
      }
      if (typeof iterable === "function") {
        iterable = iterable();
      }
      if (typeof iterable?.[symbol.iterator] !== "function") {
        return;
      }
      const itemprop = suffix ? kebabtocamelcase(suffix) : "item";
      const result = [];
      const itemcontexts = useitemcontexts(
        inheritedvalue,
        namespace,
        iterable,
        itemprop,
        eachkey?.[0]
      );
      for (const [item, itemcontext, key] of itemcontexts) {
        const mergedcontext = {
          client: {
            ...inheritedvalue.client,
            [namespace]: itemcontext
          },
          server: { ...inheritedvalue.server }
        };
        mergedcontext.client[namespace][itemprop] = item;
        result.push(
          (0,preact_module.h)(
            provider,
            { value: mergedcontext, key },
            element.props.content
          )
        );
      }
      return result;
    },
    { priority: 20 }
  );
  directive(
    "each-child",
    ({ directives: { "each-child": eachchild }, element, evaluate }) => {
      const entry = eachchild.find(isdefaultdirectivesuffix);
      if (!entry) {
        return;
      }
      const iterable = evaluate(entry);
      return iterable === pending_getter ? element : null;
    },
    { priority: 1 }
  );
  directive(
    "router-region",
    ({ directives: { "router-region": routerregion } }) => {
      const entry = routerregion.find(isdefaultdirectivesuffix);
      if (!entry) {
        return;
      }
      if (entry.suffix) {
        if (true) {
          warn(
            `suffixes for the data-wp-router-region directive are not supported. ignoring the directive with suffix "${entry.suffix}".`
          );
        }
        return;
      }
      if (entry.uniqueid) {
        if (true) {
          warnuniqueidnotsupported("router-region", entry.uniqueid);
        }
        return;
      }
      const regionid = typeof entry.value === "string" ? entry.value : entry.value.id;
      if (!routerregions.has(regionid)) {
        routerregions.set(regionid, signals_core_module_d());
      }
      const vdom = routerregions.get(regionid).value;
      _(() => {
        if (vdom && typeof vdom.type !== "string") {
          navigationcontextsignal.value = navigationcontextsignal.peek() + 1;
        }
      }, [vdom]);
      if (vdom && typeof vdom.type !== "string") {
        const previousscope = getscope();
        return (0,preact_module/* cloneelement */.ob)(vdom, { previousscope });
      }
      return vdom;
    },
    { priority: 1 }
  );
};


;// ./node_modules/@wordpress/interactivity/build-module/vdom.js


const directiveprefix = `data-wp-`;
const namespaces = [];
const currentnamespace = () => namespaces[namespaces.length - 1] ?? null;
const isobject = (item) => boolean(item && typeof item === "object" && item.constructor === object);
const invalidcharsregex = /[^a-z0-9-_]/i;
function parsedirectivename(directivename) {
  const name = directivename.substring(8);
  if (invalidcharsregex.test(name)) {
    return null;
  }
  const suffixindex = name.indexof("--");
  if (suffixindex === -1) {
    return { prefix: name, suffix: null, uniqueid: null };
  }
  const prefix = name.substring(0, suffixindex);
  const remaining = name.substring(suffixindex);
  if (remaining.startswith("---") && remaining[3] !== "-") {
    return {
      prefix,
      suffix: null,
      uniqueid: remaining.substring(3) || null
    };
  }
  let suffix = remaining.substring(2);
  const uniqueidindex = suffix.indexof("---");
  if (uniqueidindex !== -1 && suffix.substring(uniqueidindex)[3] !== "-") {
    const uniqueid = suffix.substring(uniqueidindex + 3) || null;
    suffix = suffix.substring(0, uniqueidindex) || null;
    return { prefix, suffix, uniqueid };
  }
  return { prefix, suffix: suffix || null, uniqueid: null };
}
const nspathregexp = /^([\w_\/-]+)::(.+)$/;
const hydratedislands = /* @__pure__ */ new weakset();
function tovdom(root) {
  const nodestoremove = /* @__pure__ */ new set();
  const nodestoreplace = /* @__pure__ */ new set();
  const treewalker = document.createtreewalker(
    root,
    205
    // text + cdata_section + comment + processing_instruction + element
  );
  function walk(node) {
    const { nodetype } = node;
    if (nodetype === 3) {
      return node.data;
    }
    if (nodetype === 4) {
      nodestoreplace.add(node);
      return node.nodevalue;
    }
    if (nodetype === 8 || nodetype === 7) {
      nodestoremove.add(node);
      return null;
    }
    const elementnode = node;
    const { attributes } = elementnode;
    const localname = elementnode.localname;
    const props = {};
    const children = [];
    const directives = [];
    let ignore = false;
    let island = false;
    for (let i = 0; i < attributes.length; i++) {
      const attributename = attributes[i].name;
      const attributevalue = attributes[i].value;
      if (attributename[directiveprefix.length] && attributename.slice(0, directiveprefix.length) === directiveprefix) {
        if (attributename === "data-wp-ignore") {
          ignore = true;
        } else {
          const regexresult = nspathregexp.exec(attributevalue);
          const namespace = regexresult?.[1] ?? null;
          let value = regexresult?.[2] ?? attributevalue;
          try {
            const parsedvalue = json.parse(value);
            value = isobject(parsedvalue) ? parsedvalue : value;
          } catch {
          }
          if (attributename === "data-wp-interactive") {
            island = true;
            const islandnamespace = (
              // eslint-disable-next-line no-nested-ternary
              typeof value === "string" ? value : typeof value?.namespace === "string" ? value.namespace : null
            );
            namespaces.push(islandnamespace);
          } else {
            directives.push([attributename, namespace, value]);
          }
        }
      } else if (attributename === "ref") {
        continue;
      }
      props[attributename] = attributevalue;
    }
    if (ignore && !island) {
      return [
        (0,preact_module.h)(localname, {
          ...props,
          innerhtml: elementnode.innerhtml,
          __directives: { ignore: true }
        })
      ];
    }
    if (island) {
      hydratedislands.add(elementnode);
    }
    if (directives.length) {
      props.__directives = directives.reduce((obj, [name, ns, value]) => {
        const directiveparsed = parsedirectivename(name);
        if (directiveparsed === null) {
          if (true) {
            warn(`found malformed directive name: ${name}.`);
          }
          return obj;
        }
        const { prefix, suffix, uniqueid } = directiveparsed;
        obj[prefix] = obj[prefix] || [];
        obj[prefix].push({
          namespace: ns ?? currentnamespace(),
          value,
          suffix,
          uniqueid
        });
        return obj;
      }, {});
      for (const prefix in props.__directives) {
        props.__directives[prefix].sort(
          (a, b) => {
            const asuffix = a.suffix ?? "";
            const bsuffix = b.suffix ?? "";
            if (asuffix !== bsuffix) {
              return asuffix < bsuffix ? -1 : 1;
            }
            const aid = a.uniqueid ?? "";
            const bid = b.uniqueid ?? "";
            return +(aid > bid) - +(aid < bid);
          }
        );
      }
    }
    if (props.__directives?.["each-child"]) {
      props.dangerouslysetinnerhtml = {
        __html: elementnode.innerhtml
      };
    } else if (localname === "template") {
      props.content = [
        ...elementnode.content.childnodes
      ].map((childnode) => tovdom(childnode));
    } else {
      let child = treewalker.firstchild();
      if (child) {
        while (child) {
          const vnode = walk(child);
          if (vnode) {
            children.push(vnode);
          }
          child = treewalker.nextsibling();
        }
        treewalker.parentnode();
      }
    }
    if (island) {
      namespaces.pop();
    }
    return (0,preact_module.h)(localname, props, children);
  }
  const vdom = walk(treewalker.currentnode);
  nodestoremove.foreach(
    (node) => node.remove()
  );
  nodestoreplace.foreach(
    (node) => node.replacewith(
      new window.text(node.nodevalue ?? "")
    )
  );
  return vdom;
}


;// ./node_modules/@wordpress/interactivity/build-module/hydration.js



const regionrootfragments = /* @__pure__ */ new weakmap();
const getregionrootfragment = (regions) => {
  const region = array.isarray(regions) ? regions[0] : regions;
  if (!region.parentelement) {
    throw error("the passed region should be an element with a parent.");
  }
  if (!regionrootfragments.has(region)) {
    regionrootfragments.set(
      region,
      createrootfragment(region.parentelement, regions)
    );
  }
  return regionrootfragments.get(region);
};
const initialvdom = /* @__pure__ */ new weakmap();
const hydrateregions = async () => {
  const nodes = document.queryselectorall(`[data-wp-interactive]`);
  for (const node of nodes) {
    if (!hydratedislands.has(node)) {
      await splittask();
      const fragment = getregionrootfragment(node);
      const vdom = tovdom(node);
      initialvdom.set(node, vdom);
      await splittask();
      (0,preact_module/* hydrate */.qv)(vdom, fragment);
    }
  }
};


;// ./node_modules/@wordpress/interactivity/build-module/index.js














const requiredconsent = "i acknowledge that using private apis means my theme or plugin will inevitably break in the next version of wordpress.";
const privateapis = (lock) => {
  if (lock === requiredconsent) {
    return {
      getregionrootfragment: getregionrootfragment,
      initialvdom: initialvdom,
      tovdom: tovdom,
      directive: directive,
      getnamespace: getnamespace,
      h: preact_module.h,
      cloneelement: preact_module/* cloneelement */.ob,
      render: preact_module/* render */.xx,
      proxifystate: proxifystate,
      parseserverdata: parseserverdata,
      populateserverdata: populateserverdata,
      batch: signals_core_module_r,
      routerregions: routerregions,
      deepreadonly: deepreadonly,
      navigationsignal: navigationsignal
    };
  }
  throw new error("forbidden access.");
};
populateserverdata(parseserverdata());
directives_default();
ondomready(hydrateregions);



/***/ }),

/***/ 622:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fk: () => (/* binding */ k),
/* harmony export */   ob: () => (/* binding */ k),
/* harmony export */   qv: () => (/* binding */ j),
/* harmony export */   xx: () => (/* binding */ g),
/* harmony export */   ff: () => (/* binding */ l),
/* harmony export */   h: () => (/* binding */ _),
/* harmony export */   q6: () => (/* binding */ q),
/* harmony export */   ua: () => (/* binding */ x),
/* harmony export */   zo: () => (/* binding */ t)
/* harmony export */ });
/* unused harmony exports createelement, createref, tochildarray */
var n,l,u,t,i,o,r,e,f,c,s,a,h,p={},v=[],y=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,d=array.isarray;function w(n,l){for(var u in l)n[u]=l[u];return n}function g(n){n&&n.parentnode&&n.parentnode.removechild(n)}function _(l,u,t){var i,o,r,e={};for(r in u)"key"==r?i=u[r]:"ref"==r?o=u[r]:e[r]=u[r];if(arguments.length>2&&(e.children=arguments.length>3?n.call(arguments,2):t),"function"==typeof l&&null!=l.defaultprops)for(r in l.defaultprops)void 0===e[r]&&(e[r]=l.defaultprops[r]);return m(l,e,i,o,null)}function m(n,t,i,o,r){var e={type:n,props:t,key:i,ref:o,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:null==r?++u:r,__i:-1,__u:0};return null==r&&null!=l.vnode&&l.vnode(e),e}function b(){return{current:null}}function k(n){return n.children}function x(n,l){this.props=n,this.context=l}function s(n,l){if(null==l)return n.__?s(n.__,n.__i+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?s(n):null}function c(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return c(n)}}function m(n){(!n.__d&&(n.__d=!0)&&i.push(n)&&!$.__r++||o!=l.debouncerendering)&&((o=l.debouncerendering)||r)($)}function $(){for(var n,u,t,o,r,f,c,s=1;i.length;)i.length>s&&i.sort(e),n=i.shift(),s=i.length,n.__d&&(t=void 0,o=void 0,r=(o=(u=n).__v).__e,f=[],c=[],u.__p&&((t=w({},o)).__v=o.__v+1,l.vnode&&l.vnode(t),o(u.__p,t,o,u.__n,u.__p.namespaceuri,32&o.__u?[r]:null,f,null==r?s(o):r,!!(32&o.__u),c),t.__v=o.__v,t.__.__k[t.__i]=t,n(f,t,c),o.__e=o.__=null,t.__e!=r&&c(t)));$.__r=0}function i(n,l,u,t,i,o,r,e,f,c,s){var a,h,y,d,w,g,_,m=t&&t.__k||v,b=l.length;for(f=p(u,l,m,f,b),a=0;a<b;a++)null!=(y=u.__k[a])&&(h=-1==y.__i?p:m[y.__i]||p,y.__i=a,g=o(n,y,h,i,o,r,e,f,c,s),d=y.__e,y.ref&&h.ref!=y.ref&&(h.ref&&b(h.ref,null,y),s.push(y.ref,y.__c||d,y)),null==w&&null!=d&&(w=d),(_=!!(4&y.__u))||h.__k===y.__k?f=a(y,f,n,_):"function"==typeof y.type&&void 0!==g?f=g:d&&(f=d.nextsibling),y.__u&=-7);return u.__e=w,f}function p(n,l,u,t,i){var o,r,e,f,c,s=u.length,a=s,h=0;for(n.__k=new array(i),o=0;o<i;o++)null!=(r=l[o])&&"boolean"!=typeof r&&"function"!=typeof r?("string"==typeof r||"number"==typeof r||"bigint"==typeof r||r.constructor==string?r=n.__k[o]=m(null,r,null,null,null):d(r)?r=n.__k[o]=m(k,{children:r},null,null,null):void 0===r.constructor&&r.__b>0?r=n.__k[o]=m(r.type,r.props,r.key,r.ref?r.ref:null,r.__v):n.__k[o]=r,f=o+h,r.__=n,r.__b=n.__b+1,e=null,-1!=(c=r.__i=l(r,u,f,a))&&(a--,(e=u[c])&&(e.__u|=2)),null==e||null==e.__v?(-1==c&&(i>s?h--:i<s&&h++),"function"!=typeof r.type&&(r.__u|=4)):c!=f&&(c==f-1?h--:c==f+1?h++:(c>f?h--:h++,r.__u|=4))):n.__k[o]=null;if(a)for(o=0;o<s;o++)null!=(e=u[o])&&0==(2&e.__u)&&(e.__e==t&&(t=s(e)),d(e,e));return t}function a(n,l,u,t){var i,o;if("function"==typeof n.type){for(i=n.__k,o=0;i&&o<i.length;o++)i[o]&&(i[o].__=n,l=a(i[o],l,u,t));return l}n.__e!=l&&(t&&(l&&n.type&&!l.parentnode&&(l=s(n)),u.insertbefore(n.__e,l||null)),l=n.__e);do{l=l&&l.nextsibling}while(null!=l&&8==l.nodetype);return l}function h(n,l){return l=l||[],null==n||"boolean"==typeof n||(d(n)?n.some(function(n){h(n,l)}):l.push(n)),l}function l(n,l,u,t){var i,o,r,e=n.key,f=n.type,c=l[u],s=null!=c&&0==(2&c.__u);if(null===c&&null==e||s&&e==c.key&&f==c.type)return u;if(t>(s?1:0))for(i=u-1,o=u+1;i>=0||o<l.length;)if(null!=(c=l[r=i>=0?i--:o++])&&0==(2&c.__u)&&e==c.key&&f==c.type)return r;return-1}function t(n,l,u){"-"==l[0]?n.setproperty(l,null==u?"":u):n[l]=null==u?"":"number"!=typeof u||y.test(l)?u:u+"px"}function j(n,l,u,t,i){var o,r;n:if("style"==l)if("string"==typeof u)n.style.csstext=u;else{if("string"==typeof t&&(n.style.csstext=t=""),t)for(l in t)u&&l in u||t(n.style,l,"");if(u)for(l in u)t&&u[l]==t[l]||t(n.style,l,u[l])}else if("o"==l[0]&&"n"==l[1])o=l!=(l=l.replace(f,"$1")),r=l.tolowercase(),l=r in n||"onfocusout"==l||"onfocusin"==l?r.slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?t?u.u=t.u:(u.u=c,n.addeventlistener(l,o?a:s,o)):n.removeeventlistener(l,o?a:s,o);else{if("http://www.w3.org/2000/svg"==i)l=l.replace(/xlink(h|:h)/,"h").replace(/sname$/,"s");else if("width"!=l&&"height"!=l&&"href"!=l&&"list"!=l&&"form"!=l&&"tabindex"!=l&&"download"!=l&&"rowspan"!=l&&"colspan"!=l&&"role"!=l&&"popover"!=l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null==u||!1===u&&"-"!=l[4]?n.removeattribute(l):n.setattribute(l,"popover"==l&&1==u?"":u))}}function f(n){return function(u){if(this.l){var t=this.l[u.type+n];if(null==u.t)u.t=c++;else if(u.t<t.u)return;return t(l.event?l.event(u):u)}}}function o(n,u,t,i,o,r,e,f,c,s){var a,h,p,v,y,_,m,b,s,c,m,$,p,a,h,l,t,j=u.type;if(void 0!==u.constructor)return null;128&t.__u&&(c=!!(32&t.__u),r=[f=u.__e=t.__e]),(a=l.__b)&&a(u);n:if("function"==typeof j)try{if(b=u.props,s="prototype"in j&&j.prototype.render,c=(a=j.contexttype)&&i[a.__c],m=a?c?c.props.value:a.__:i,t.__c?m=(h=u.__c=t.__c).__=h.__e:(s?u.__c=h=new j(b,m):(u.__c=h=new x(b,m),h.constructor=j,h.render=e),c&&c.sub(h),h.state||(h.state={}),h.__n=i,p=h.__d=!0,h.__h=[],h._sb=[]),s&&null==h.__s&&(h.__s=h.state),s&&null!=j.getderivedstatefromprops&&(h.__s==h.state&&(h.__s=w({},h.__s)),w(h.__s,j.getderivedstatefromprops(b,h.__s))),v=h.props,y=h.state,h.__v=u,p)s&&null==j.getderivedstatefromprops&&null!=h.componentwillmount&&h.componentwillmount(),s&&null!=h.componentdidmount&&h.__h.push(h.componentdidmount);else{if(s&&null==j.getderivedstatefromprops&&b!==v&&null!=h.componentwillreceiveprops&&h.componentwillreceiveprops(b,m),u.__v==t.__v||!h.__e&&null!=h.shouldcomponentupdate&&!1===h.shouldcomponentupdate(b,h.__s,m)){for(u.__v!=t.__v&&(h.props=b,h.state=h.__s,h.__d=!1),u.__e=t.__e,u.__k=t.__k,u.__k.some(function(n){n&&(n.__=u)}),$=0;$<h._sb.length;$++)h.__h.push(h._sb[$]);h._sb=[],h.__h.length&&e.push(h);break n}null!=h.componentwillupdate&&h.componentwillupdate(b,h.__s,m),s&&null!=h.componentdidupdate&&h.__h.push(function(){h.componentdidupdate(v,y,_)})}if(h.context=m,h.props=b,h.__p=n,h.__e=!1,p=l.__r,a=0,s){for(h.state=h.__s,h.__d=!1,p&&p(u),a=h.render(h.props,h.state,h.context),h=0;h<h._sb.length;h++)h.__h.push(h._sb[h]);h._sb=[]}else do{h.__d=!1,p&&p(u),a=h.render(h.props,h.state,h.context),h.state=h.__s}while(h.__d&&++a<25);h.state=h.__s,null!=h.getchildcontext&&(i=w(w({},i),h.getchildcontext())),s&&!p&&null!=h.getsnapshotbeforeupdate&&(_=h.getsnapshotbeforeupdate(v,y)),l=a,null!=a&&a.type===k&&null==a.key&&(l=v(a.props.children)),f=i(n,d(l)?l:[l],u,t,i,o,r,e,f,c,s),h.base=u.__e,u.__u&=-161,h.__h.length&&e.push(h),m&&(h.__e=h.__=null)}catch(n){if(u.__v=null,c||null!=r)if(n.then){for(u.__u|=c?160:128;f&&8==f.nodetype&&f.nextsibling;)f=f.nextsibling;r[r.indexof(f)]=null,u.__e=f}else{for(t=r.length;t--;)g(r[t]);z(u)}else u.__e=t.__e,u.__k=t.__k,n.then||z(u);l.__e(n,u,t)}else null==r&&u.__v==t.__v?(u.__k=t.__k,u.__e=t.__e):f=u.__e=q(t.__e,u,t,i,o,r,e,c,s);return(a=l.diffed)&&a(u),128&u.__u?void 0:f}function z(n){n&&n.__c&&(n.__c.__e=!0),n&&n.__k&&n.__k.foreach(z)}function n(n,u,t){for(var i=0;i<t.length;i++)b(t[i],t[++i],t[++i]);l.__c&&l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u)})}catch(n){l.__e(n,u.__v)}})}function v(n){return"object"!=typeof n||null==n||n.__b&&n.__b>0?n:d(n)?n.map(v):w({},n)}function q(u,t,i,o,r,e,f,c,s){var a,h,v,y,w,_,m,b=i.props||p,k=t.props,x=t.type;if("svg"==x?r="http://www.w3.org/2000/svg":"math"==x?r="http://www.w3.org/1998/math/mathml":r||(r="http://www.w3.org/1999/xhtml"),null!=e)for(a=0;a<e.length;a++)if((w=e[a])&&"setattribute"in w==!!x&&(x?w.localname==x:3==w.nodetype)){u=w,e[a]=null;break}if(null==u){if(null==x)return document.createtextnode(k);u=document.createelementns(r,x,k.is&&k),c&&(l.__m&&l.__m(t,e),c=!1),e=null}if(null==x)b===k||c&&u.data==k||(u.data=k);else{if(e=e&&n.call(u.childnodes),!c&&null!=e)for(b={},a=0;a<u.attributes.length;a++)b[(w=u.attributes[a]).name]=w.value;for(a in b)if(w=b[a],"children"==a);else if("dangerouslysetinnerhtml"==a)v=w;else if(!(a in k)){if("value"==a&&"defaultvalue"in k||"checked"==a&&"defaultchecked"in k)continue;j(u,a,null,w,r)}for(a in k)w=k[a],"children"==a?y=w:"dangerouslysetinnerhtml"==a?h=w:"value"==a?_=w:"checked"==a?m=w:c&&"function"!=typeof w||b[a]===w||j(u,a,w,b[a],r);if(h)c||v&&(h.__html==v.__html||h.__html==u.innerhtml)||(u.innerhtml=h.__html),t.__k=[];else if(v&&(u.innerhtml=""),i("template"==t.type?u.content:u,d(y)?y:[y],t,i,o,"foreignobject"==x?"http://www.w3.org/1999/xhtml":r,e,f,e?e[0]:i.__k&&s(i,0),c,s),null!=e)for(a=e.length;a--;)g(e[a]);c||(a="value","progress"==x&&null==_?u.removeattribute("value"):null!=_&&(_!==u[a]||"progress"==x&&!_||"option"==x&&_!=b[a])&&j(u,a,_,b[a],r),a="checked",null!=m&&m!=u[a]&&j(u,a,m,b[a],r))}return u}function b(n,u,t){try{if("function"==typeof n){var i="function"==typeof n.__u;i&&n.__u(),i&&null==u||(n.__u=n(u))}else n.current=u}catch(n){l.__e(n,t)}}function d(n,u,t){var i,o;if(l.unmount&&l.unmount(n),(i=n.ref)&&(i.current&&i.current!=n.__e||b(i,null,u)),null!=(i=n.__c)){if(i.componentwillunmount)try{i.componentwillunmount()}catch(n){l.__e(n,u)}i.base=i.__p=null}if(i=n.__k)for(o=0;o<i.length;o++)i[o]&&d(i[o],u,t||"function"!=typeof n.type);t||g(n.__e),n.__c=n.__=n.__e=void 0}function e(n,l,u){return this.constructor(n,u)}function g(u,t,i){var o,r,e,f;t==document&&(t=document.documentelement),l.__&&l.__(u,t),r=(o="function"==typeof i)?null:i&&i.__k||t.__k,e=[],f=[],o(t,u=(!o&&i||t).__k=_(k,null,[u]),r||p,p,t.namespaceuri,!o&&i?[i]:r?null:t.firstchild?n.call(t.childnodes):null,e,!o&&i?i:r?r.__e:t.firstchild,o,f),n(e,u,f)}function j(n,l){g(n,l,j)}function k(l,u,t){var i,o,r,e,f=w({},l.props);for(r in l.type&&l.type.defaultprops&&(e=l.type.defaultprops),u)"key"==r?i=u[r]:"ref"==r?o=u[r]:f[r]=void 0===u[r]&&null!=e?e[r]:u[r];return arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):t),m(l.type,f,i||l.key,o||l.ref,null)}function q(n){function l(n){var u,t;return this.getchildcontext||(u=new set,(t={})[l.__c]=this,this.getchildcontext=function(){return t},this.componentwillunmount=function(){u=null},this.shouldcomponentupdate=function(n){this.props.value!=n.value&&u.foreach(function(n){n.__e=!0,m(n)})},this.sub=function(n){u.add(n);var l=n.componentwillunmount;n.componentwillunmount=function(){u&&u.delete(n),l&&l.call(n)}}),n.children}return l.__c="__cc"+h++,l.__=n,l.provider=l.__l=(l.consumer=function(n,l){return n.children(l)}).contexttype=l,l}n=v.slice,l={__e:function(n,l,u,t){for(var i,o,r;l=l.__;)if((i=l.__c)&&!i.__)try{if((o=i.constructor)&&null!=o.getderivedstatefromerror&&(i.setstate(o.getderivedstatefromerror(n)),r=i.__d),null!=i.componentdidcatch&&(i.componentdidcatch(n,t||{}),r=i.__d),r)return i.__e=i}catch(l){n=l}throw n}},u=0,t=function(n){return null!=n&&void 0===n.constructor},x.prototype.setstate=function(n,l){var u;u=null!=this.__s&&this.__s!=this.state?this.__s:this.__s=w({},this.state),"function"==typeof n&&(n=n(w({},u),this.props)),n&&w(u,n),null!=n&&this.__v&&(l&&this._sb.push(l),m(this))},x.prototype.forceupdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),m(this))},x.prototype.render=k,i=[],r="function"==typeof promise?promise.prototype.then.bind(promise.resolve()):settimeout,e=function(n,l){return n.__v.__b-l.__v.__b},$.__r=0,f=/(pointercapture)$|capture$/i,c=0,s=f(!1),a=f(!0),h=0;


/***/ })

/******/ });
/************************************************************************/
/******/ // the module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // the require function
/******/ function __webpack_require__(moduleid) {
/******/ 	// check if module is in cache
/******/ 	var cachedmodule = __webpack_module_cache__[moduleid];
/******/ 	if (cachedmodule !== undefined) {
/******/ 		return cachedmodule.exports;
/******/ 	}
/******/ 	// create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleid] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// execute the module function
/******/ 	__webpack_modules__[moduleid](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				object.defineproperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasownproperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (object.prototype.hasownproperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// exports
__webpack_require__.d(__webpack_exports__, {
  zj: () => (/* reexport */ debug_build_module/* getconfig */.zj),
  sd: () => (/* reexport */ debug_build_module/* getcontext */.sd),
  v6: () => (/* reexport */ debug_build_module/* getelement */.v6),
  $k: () => (/* reexport */ debug_build_module/* getservercontext */.$k),
  vt: () => (/* reexport */ debug_build_module/* getserverstate */.vt),
  jb: () => (/* reexport */ debug_build_module/* privateapis */.jb),
  yt: () => (/* reexport */ debug_build_module/* splittask */.yt),
  m_: () => (/* reexport */ debug_build_module/* store */.m_),
  hb: () => (/* reexport */ debug_build_module/* usecallback */.hb),
  vj: () => (/* reexport */ debug_build_module/* useeffect */.vj),
  ip: () => (/* reexport */ debug_build_module/* useinit */.ip),
  nf: () => (/* reexport */ debug_build_module/* uselayouteffect */.nf),
  kr: () => (/* reexport */ debug_build_module/* usememo */.kr),
  li: () => (/* reexport */ debug_build_module/* useref */.li),
  j0: () => (/* reexport */ debug_build_module/* usestate */.j0),
  fh: () => (/* reexport */ debug_build_module/* usewatch */.fh),
  v4: () => (/* reexport */ debug_build_module/* withscope */.v4),
  mh: () => (/* reexport */ debug_build_module/* withsyncevent */.mh)
});

// external module: ./node_modules/preact/dist/preact.module.js
var debug_preact_module = __webpack_require__(622);
;// ./node_modules/preact/devtools/dist/devtools.module.js
var debug_i;function debug_t(o,e){return n.__a&&n.__a(e),o}null!=(debug_i="undefined"!=typeof globalthis?globalthis:"undefined"!=typeof window?window:void 0)&&debug_i.__preact_devtools__&&debug_i.__preact_devtools__.attachpreact("10.28.2",debug_preact_module/* options */.ff,{fragment:debug_preact_module/* fragment */.fk,component:debug_preact_module/* component */.ua});

;// ./node_modules/preact/debug/dist/debug.module.js
var debug_debug_module_t={};function debug_r(){debug_debug_module_t={}}function debug_a(e){return e.type===debug_preact_module/* fragment */.fk?"fragment":"function"==typeof e.type?e.type.displayname||e.type.name:"string"==typeof e.type?e.type:"#text"}var debug_debug_module_i=[],debug_s=[];function debug_c(){return debug_debug_module_i.length>0?debug_debug_module_i[debug_debug_module_i.length-1]:null}var debug_l=!0;function debug_u(e){return"function"==typeof e.type&&e.type!=debug_preact_module/* fragment */.fk}function debug_f(n){for(var e=[n],o=n;null!=o.__o;)e.push(o.__o),o=o.__o;return e.reduce(function(n,e){n+="  in "+debug_a(e);var o=e.__source;return o?n+=" (at "+o.filename+":"+o.linenumber+")":debug_l&&console.warn("add @babel/plugin-transform-react-jsx-source to get a more detailed component stack. note that you should not add it to production builds of your app for bundle size reasons."),debug_l=!1,n+"\n"},"")}var debug_d="function"==typeof weakmap;function debug_p(n){var e=[];return n.__k?(n.__k.foreach(function(n){n&&"function"==typeof n.type?e.push.apply(e,debug_p(n)):n&&"string"==typeof n.type&&e.push(n.type)}),e):e}function debug_h(n){return n?"function"==typeof n.type?null==n.__?null!=n.__e&&null!=n.__e.parentnode?n.__e.parentnode.localname:"":debug_h(n.__):n.type:""}var debug_v=debug_preact_module/* component */.ua.prototype.setstate;function debug_y(n){return"table"===n||"tfoot"===n||"tbody"===n||"thead"===n||"td"===n||"tr"===n||"th"===n}debug_preact_module/* component */.ua.prototype.setstate=function(n,e){return null==this.__v&&null==this.state&&console.warn('calling "this.setstate" inside the constructor of a component is a no-op and might be a bug in your application. instead, set "this.state = {}" directly.\n\n'+debug_f(debug_c())),debug_v.call(this,n,e)};var debug_m=/^(address|article|aside|blockquote|details|div|dl|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hgroup|hr|main|menu|nav|ol|p|pre|search|section|table|ul)$/,debug_b=debug_preact_module/* component */.ua.prototype.forceupdate;function debug_w(n){var e=n.props,o=debug_a(n),t="";for(var r in e)if(e.hasownproperty(r)&&"children"!==r){var i=e[r];"function"==typeof i&&(i="function "+(i.displayname||i.name)+"() {}"),i=object(i)!==i||i.tostring?i+"":object.prototype.tostring.call(i),t+=" "+r+"="+json.stringify(i)}var s=e.children;return"<"+o+t+(s&&s.length?">..</"+o+">":" />")}debug_preact_module/* component */.ua.prototype.forceupdate=function(n){return null==this.__v?console.warn('calling "this.forceupdate" inside the constructor of a component is a no-op and might be a bug in your application.\n\n'+debug_f(debug_c())):null==this.__p&&console.warn('can\'t call "this.forceupdate" on an unmounted component. this is a no-op, but it indicates a memory leak in your application. to fix, cancel all subscriptions and asynchronous tasks in the componentwillunmount method.\n\n'+debug_f(this.__v)),debug_b.call(this,n)},debug_preact_module/* options */.ff.__m=function(n,e){var o=n.type,t=e.map(function(n){return n&&n.localname}).filter(boolean);console.error('expected a dom node of type "'+o+'" but found "'+t.join(", ")+"\" as available dom-node(s), this is caused by the ssr'd html containing different dom-nodes compared to the hydrated one.\n\n"+debug_f(n))},function(){!function(){var n=debug_preact_module/* options */.ff.__b,o=debug_preact_module/* options */.ff.diffed,t=debug_preact_module/* options */.ff.__,r=debug_preact_module/* options */.ff.vnode,a=debug_preact_module/* options */.ff.__r;debug_preact_module/* options */.ff.diffed=function(n){debug_u(n)&&debug_s.pop(),debug_debug_module_i.pop(),o&&o(n)},debug_preact_module/* options */.ff.__b=function(e){debug_u(e)&&debug_debug_module_i.push(e),n&&n(e)},debug_preact_module/* options */.ff.__=function(n,e){debug_s=[],t&&t(n,e)},debug_preact_module/* options */.ff.vnode=function(n){n.__o=debug_s.length>0?debug_s[debug_s.length-1]:null,r&&r(n)},debug_preact_module/* options */.ff.__r=function(n){debug_u(n)&&debug_s.push(n),a&&a(n)}}();var n=!1,o=debug_preact_module/* options */.ff.__b,r=debug_preact_module/* options */.ff.diffed,c=debug_preact_module/* options */.ff.vnode,l=debug_preact_module/* options */.ff.__r,v=debug_preact_module/* options */.ff.__e,b=debug_preact_module/* options */.ff.__,g=debug_preact_module/* options */.ff.__h,e=debug_d?{useeffect:new weakmap,uselayouteffect:new weakmap,lazyproptypes:new weakmap}:null,k=[];debug_preact_module/* options */.ff.__e=function(n,e,o,t){if(e&&e.__c&&"function"==typeof n.then){var r=n;n=new error("missing suspense. the throwing component was: "+debug_a(e));for(var i=e;i;i=i.__)if(i.__c&&i.__c.__c){n=r;break}if(n instanceof error)throw n}try{(t=t||{}).componentstack=debug_f(e),v(n,e,o,t),"function"!=typeof n.then&&settimeout(function(){throw n})}catch(n){throw n}},debug_preact_module/* options */.ff.__=function(n,e){if(!e)throw new error("undefined parent passed to render(), this is the second argument.\ncheck if the element is available in the dom/has the correct id.");var o;switch(e.nodetype){case 1:case 11:case 9:o=!0;break;default:o=!1}if(!o){var t=debug_a(n);throw new error("expected a valid html node as a second argument to render.\treceived "+e+" instead: render(<"+t+" />, "+e+");")}b&&b(n,e)},debug_preact_module/* options */.ff.__b=function(e){var r=e.type;if(n=!0,void 0===r)throw new error("undefined component passed to createelement()\n\nyou likely forgot to export your component or might have mixed up default and named imports"+debug_w(e)+"\n\n"+debug_f(e));if(null!=r&&"object"==typeof r){if(void 0!==r.__k&&void 0!==r.__e)throw new error("invalid type passed to createelement(): "+r+"\n\ndid you accidentally pass a jsx literal as jsx twice?\n\n  let my"+debug_a(e)+" = "+debug_w(r)+";\n  let vnode = <my"+debug_a(e)+" />;\n\nthis usually happens when you export a jsx literal and not the component.\n\n"+debug_f(e));throw new error("invalid type passed to createelement(): "+(array.isarray(r)?"array":r))}if(void 0!==e.ref&&"function"!=typeof e.ref&&"object"!=typeof e.ref&&!("$$typeof"in e))throw new error('component\'s "ref" property should be a function, or an object created by createref(), but got ['+typeof e.ref+"] instead\n"+debug_w(e)+"\n\n"+debug_f(e));if("string"==typeof e.type)for(var i in e.props)if("o"===i[0]&&"n"===i[1]&&"function"!=typeof e.props[i]&&null!=e.props[i])throw new error("component's \""+i+'" property should be a function, but got ['+typeof e.props[i]+"] instead\n"+debug_w(e)+"\n\n"+debug_f(e));if("function"==typeof e.type&&e.type.proptypes){if("lazy"===e.type.displayname&&e&&!e.lazyproptypes.has(e.type)){var s="proptypes are not supported on lazy(). use proptypes on the wrapped component itself. ";try{var c=e.type();e.lazyproptypes.set(e.type,!0),console.warn(s+"component wrapped in lazy() is "+debug_a(c))}catch(n){console.warn(s+"we will log the wrapped component's name once it is loaded.")}}var l=e.props;e.type.__f&&delete(l=function(n,e){for(var o in e)n[o]=e[o];return n}({},l)).ref,function(n,e,o,r,a){object.keys(n).foreach(function(o){var i;try{i=n[o](e,o,r,"prop",null,"secret_do_not_pass_this_or_you_will_be_fired")}catch(n){i=n}i&&!(i.message in debug_debug_module_t)&&(debug_debug_module_t[i.message]=!0,console.error("failed prop type: "+i.message+(a&&"\n"+a()||"")))})}(e.type.proptypes,l,0,debug_a(e),function(){return debug_f(e)})}o&&o(e)};var t,_=0;debug_preact_module/* options */.ff.__r=function(e){l&&l(e),n=!0;var o=e.__c;if(o===t?_++:_=1,_>=25)throw new error("too many re-renders. this is limited to prevent an infinite loop which may lock up your browser. the component causing this is: "+debug_a(e));t=o},debug_preact_module/* options */.ff.__h=function(e,o,t){if(!e||!n)throw new error("hook can only be invoked from render methods.");g&&g(e,o,t)};var o=function(n,e){return{get:function(){var o="get"+n+e;k&&k.indexof(o)<0&&(k.push(o),console.warn("getting vnode."+n+" is deprecated, "+e))},set:function(){var o="set"+n+e;k&&k.indexof(o)<0&&(k.push(o),console.warn("setting vnode."+n+" is not allowed, "+e))}}},i={nodename:o("nodename","use vnode.type"),attributes:o("attributes","use vnode.props"),children:o("children","use vnode.props.children")},m=object.create({},i);debug_preact_module/* options */.ff.vnode=function(n){var e=n.props;if(null!==n.type&&null!=e&&("__source"in e||"__self"in e)){var o=n.props={};for(var t in e){var r=e[t];"__source"===t?n.__source=r:"__self"===t?n.__self=r:o[t]=r}}n.__proto__=m,c&&c(n)},debug_preact_module/* options */.ff.diffed=function(e){var o,t=e.type,i=e.__;if(e.__k&&e.__k.foreach(function(n){if("object"==typeof n&&n&&void 0===n.type){var o=object.keys(n).join(",");throw new error("objects are not valid as a child. encountered an object with the keys {"+o+"}.\n\n"+debug_f(e))}}),e.__c===t&&(_=0),"string"==typeof t&&(debug_y(t)||"p"===t||"a"===t||"button"===t)){var s=debug_h(i);if(""!==s&&debug_y(t))"table"===t&&"td"!==s&&debug_y(s)?console.error("improper nesting of table. your <table> should not have a table-node parent."+debug_w(e)+"\n\n"+debug_f(e)):"thead"!==t&&"tfoot"!==t&&"tbody"!==t||"table"===s?"tr"===t&&"thead"!==s&&"tfoot"!==s&&"tbody"!==s?console.error("improper nesting of table. your <tr> should have a <thead/tbody/tfoot> parent."+debug_w(e)+"\n\n"+debug_f(e)):"td"===t&&"tr"!==s?console.error("improper nesting of table. your <td> should have a <tr> parent."+debug_w(e)+"\n\n"+debug_f(e)):"th"===t&&"tr"!==s&&console.error("improper nesting of table. your <th> should have a <tr>."+debug_w(e)+"\n\n"+debug_f(e)):console.error("improper nesting of table. your <thead/tbody/tfoot> should have a <table> parent."+debug_w(e)+"\n\n"+debug_f(e));else if("p"===t){var c=debug_p(e).filter(function(n){return debug_m.test(n)});c.length&&console.error("improper nesting of paragraph. your <p> should not have "+c.join(", ")+" as child-elements."+debug_w(e)+"\n\n"+debug_f(e))}else"a"!==t&&"button"!==t||-1!==debug_p(e).indexof(t)&&console.error("improper nesting of interactive content. your <"+t+"> should not have other "+("a"===t?"anchor":"button")+" tags as child-elements."+debug_w(e)+"\n\n"+debug_f(e))}if(n=!1,r&&r(e),null!=e.__k)for(var l=[],u=0;u<e.__k.length;u++){var d=e.__k[u];if(d&&null!=d.key){var v=d.key;if(-1!==l.indexof(v)){console.error('following component has two or more children with the same key attribute: "'+v+'". this may cause glitches and misbehavior in rendering process. component: \n\n'+debug_w(e)+"\n\n"+debug_f(e));break}l.push(v)}}if(null!=e.__c&&null!=e.__c.__h){var b=e.__c.__h.__;if(b)for(var g=0;g<b.length;g+=1){var e=b[g];if(e.__h)for(var k=0;k<e.__h.length;k++)if((o=e.__h[k])!=o){var o=debug_a(e);console.warn("invalid argument passed to hook. hooks should not be called with nan in the dependency array. hook index "+g+" in component "+o+" was called with nan.")}}}}}();

// external module: ./node_modules/@wordpress/interactivity/build-module/index.js + 17 modules
var debug_build_module = __webpack_require__(434);
;// ./node_modules/@wordpress/interactivity/build-module/debug.js



var __webpack_exports__getconfig = __webpack_exports__.zj;
var __webpack_exports__getcontext = __webpack_exports__.sd;
var __webpack_exports__getelement = __webpack_exports__.v6;
var __webpack_exports__getservercontext = __webpack_exports__.$k;
var __webpack_exports__getserverstate = __webpack_exports__.vt;
var __webpack_exports__privateapis = __webpack_exports__.jb;
var __webpack_exports__splittask = __webpack_exports__.yt;
var __webpack_exports__store = __webpack_exports__.m_;
var __webpack_exports__usecallback = __webpack_exports__.hb;
var __webpack_exports__useeffect = __webpack_exports__.vj;
var __webpack_exports__useinit = __webpack_exports__.ip;
var __webpack_exports__uselayouteffect = __webpack_exports__.nf;
var __webpack_exports__usememo = __webpack_exports__.kr;
var __webpack_exports__useref = __webpack_exports__.li;
var __webpack_exports__usestate = __webpack_exports__.j0;
var __webpack_exports__usewatch = __webpack_exports__.fh;
var __webpack_exports__withscope = __webpack_exports__.v4;
var __webpack_exports__withsyncevent = __webpack_exports__.mh;
export { __webpack_exports__getconfig as getconfig, __webpack_exports__getcontext as getcontext, __webpack_exports__getelement as getelement, __webpack_exports__getservercontext as getservercontext, __webpack_exports__getserverstate as getserverstate, __webpack_exports__privateapis as privateapis, __webpack_exports__splittask as splittask, __webpack_exports__store as store, __webpack_exports__usecallback as usecallback, __webpack_exports__useeffect as useeffect, __webpack_exports__useinit as useinit, __webpack_exports__uselayouteffect as uselayouteffect, __webpack_exports__usememo as usememo, __webpack_exports__useref as useref, __webpack_exports__usestate as usestate, __webpack_exports__usewatch as usewatch, __webpack_exports__withscope as withscope, __webpack_exports__withsyncevent as withsyncevent };






