/*!
 * jquery ui touch punch 0.2.2
 *
 * copyright 2011, dave furfero
 * dual licensed under the mit or gpl version 2 licenses.
 *
 * depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function(b){b.support.touch="ontouchend" in document;if(!b.support.touch){return}var c=b.ui.mouse.prototype,e=c._mouseinit,a;function d(g,h){if(g.originalevent.touches.length>1){return}g.preventdefault();var i=g.originalevent.changedtouches[0],f=document.createevent("mouseevents");f.initmouseevent(h,true,true,window,1,i.screenx,i.screeny,i.clientx,i.clienty,false,false,false,false,0,null);g.target.dispatchevent(f)}c._touchstart=function(g){var f=this;if(a||!f._mousecapture(g.originalevent.changedtouches[0])){return}a=true;f._touchmoved=false;d(g,"mouseover");d(g,"mousemove");d(g,"mousedown")};c._touchmove=function(f){if(!a){return}this._touchmoved=true;d(f,"mousemove")};c._touchend=function(f){if(!a){return}d(f,"mouseup");d(f,"mouseout");if(!this._touchmoved){d(f,"click")}a=false};c._mouseinit=function(){var f=this;f.element.bind("touchstart",b.proxy(f,"_touchstart")).bind("touchmove",b.proxy(f,"_touchmove")).bind("touchend",b.proxy(f,"_touchend"));e.call(f)}})(jquery);

