/**
 * copyright (c) 2006, david spurr (http://www.defusion.org.uk/)
 * all rights reserved.
 *
 * redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 *     * redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *     * redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *     * neither the name of the david spurr nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * this software is provided by the copyright holders and contributors "as is" and any express or implied warranties, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose are disclaimed. in no event shall the copyright owner or contributors be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this software, even if advised of the possibility of such damage.
 *
 * http://www.opensource.org/licenses/bsd-license.php
 *
 * see scriptaculous.js for full scriptaculous licence
 */

var cropdraggable=class.create();
object.extend(object.extend(cropdraggable.prototype,draggable.prototype),{initialize:function(_1){
this.options=object.extend({drawmethod:function(){
}},arguments[1]||{});
this.element=$(_1);
this.handle=this.element;
this.delta=this.currentdelta();
this.dragging=false;
this.eventmousedown=this.initdrag.bindaseventlistener(this);
event.observe(this.handle,"mousedown",this.eventmousedown);
draggables.register(this);
},draw:function(_2){
var _3=position.cumulativeoffset(this.element);
var d=this.currentdelta();
_3[0]-=d[0];
_3[1]-=d[1];
var p=[0,1].map(function(i){
return (_2[i]-_3[i]-this.offset[i]);
}.bind(this));
this.options.drawmethod(p);
}});
var cropper={};
cropper.img=class.create();
cropper.img.prototype={initialize:function(_7,_8){
this.options=object.extend({ratiodim:{x:0,y:0},minwidth:0,minheight:0,displayoninit:false,onendcrop:prototype.emptyfunction,capturekeys:true},_8||{});
if(this.options.minwidth>0&&this.options.minheight>0){
this.options.ratiodim.x=this.options.minwidth;
this.options.ratiodim.y=this.options.minheight;
}
this.img=$(_7);
this.clickcoords={x:0,y:0};
this.dragging=false;
this.resizing=false;
this.iswebkit=/konqueror|safari|khtml/.test(navigator.useragent);
this.isie=/msie/.test(navigator.useragent);
this.isopera8=/opera\s[1-8]/.test(navigator.useragent);
this.ratiox=0;
this.ratioy=0;
this.attached=false;
$a(document.getelementsbytagname("script")).each(function(s){
if(s.src.match(/cropper\.js/)){
var _a=s.src.replace(/cropper\.js(.*)?/,"");
var _b=document.createelement("link");
_b.rel="stylesheet";
_b.type="text/css";
_b.href=_a+"cropper.css";
_b.media="screen";
document.getelementsbytagname("head")[0].appendchild(_b);
}
});
if(this.options.ratiodim.x>0&&this.options.ratiodim.y>0){
var _c=this.getgcd(this.options.ratiodim.x,this.options.ratiodim.y);
this.ratiox=this.options.ratiodim.x/_c;
this.ratioy=this.options.ratiodim.y/_c;
}
this.subinitialize();
if(this.img.complete||this.iswebkit){
this.onload();
}else{
event.observe(this.img,"load",this.onload.bindaseventlistener(this));
}
},getgcd:function(a,b){return 1;
if(b==0){
return a;
}
return this.getgcd(b,a%b);
},onload:function(){
var _f="imgcrop_";
var _10=this.img.parentnode;
var _11="";
if(this.isopera8){
_11=" opera8";
}
this.imgwrap=builder.node("div",{"class":_f+"wrap"+_11});
if(this.isie){
this.north=builder.node("div",{"class":_f+"overlay "+_f+"north"},[builder.node("span")]);
this.east=builder.node("div",{"class":_f+"overlay "+_f+"east"},[builder.node("span")]);
this.south=builder.node("div",{"class":_f+"overlay "+_f+"south"},[builder.node("span")]);
this.west=builder.node("div",{"class":_f+"overlay "+_f+"west"},[builder.node("span")]);
var _12=[this.north,this.east,this.south,this.west];
}else{
this.overlay=builder.node("div",{"class":_f+"overlay"});
var _12=[this.overlay];
}
this.dragarea=builder.node("div",{"class":_f+"dragarea"},_12);
this.handlen=builder.node("div",{"class":_f+"handle "+_f+"handlen"});
this.handlene=builder.node("div",{"class":_f+"handle "+_f+"handlene"});
this.handlee=builder.node("div",{"class":_f+"handle "+_f+"handlee"});
this.handlese=builder.node("div",{"class":_f+"handle "+_f+"handlese"});
this.handles=builder.node("div",{"class":_f+"handle "+_f+"handles"});
this.handlesw=builder.node("div",{"class":_f+"handle "+_f+"handlesw"});
this.handlew=builder.node("div",{"class":_f+"handle "+_f+"handlew"});
this.handlenw=builder.node("div",{"class":_f+"handle "+_f+"handlenw"});
this.selarea=builder.node("div",{"class":_f+"selarea"},[builder.node("div",{"class":_f+"marqueehoriz "+_f+"marqueenorth"},[builder.node("span")]),builder.node("div",{"class":_f+"marqueevert "+_f+"marqueeeast"},[builder.node("span")]),builder.node("div",{"class":_f+"marqueehoriz "+_f+"marqueesouth"},[builder.node("span")]),builder.node("div",{"class":_f+"marqueevert "+_f+"marqueewest"},[builder.node("span")]),this.handlen,this.handlene,this.handlee,this.handlese,this.handles,this.handlesw,this.handlew,this.handlenw,builder.node("div",{"class":_f+"clickarea"})]);
element.setstyle($(this.selarea),{backgroundcolor:"transparent",backgroundrepeat:"no-repeat",backgroundposition:"0 0"});
this.imgwrap.appendchild(this.img);
this.imgwrap.appendchild(this.dragarea);
this.dragarea.appendchild(this.selarea);
this.dragarea.appendchild(builder.node("div",{"class":_f+"clickarea"}));
_10.appendchild(this.imgwrap);
event.observe(this.dragarea,"mousedown",this.startdrag.bindaseventlistener(this));
event.observe(document,"mousemove",this.ondrag.bindaseventlistener(this));
event.observe(document,"mouseup",this.endcrop.bindaseventlistener(this));
var _13=[this.handlen,this.handlene,this.handlee,this.handlese,this.handles,this.handlesw,this.handlew,this.handlenw];
for(var i=0;i<_13.length;i++){
event.observe(_13[i],"mousedown",this.startresize.bindaseventlistener(this));
}
if(this.options.capturekeys){
event.observe(document,"keydown",this.handlekeys.bindaseventlistener(this));
}
new cropdraggable(this.selarea,{drawmethod:this.movearea.bindaseventlistener(this)});
this.setparams();
},setparams:function(){
this.imgw=this.img.width;
this.imgh=this.img.height;
if(!this.isie){
element.setstyle($(this.overlay),{width:this.imgw+"px",height:this.imgh+"px"});
element.hide($(this.overlay));
element.setstyle($(this.selarea),{backgroundimage:"url("+this.img.src+")"});
}else{
element.setstyle($(this.north),{height:0});
element.setstyle($(this.east),{width:0,height:0});
element.setstyle($(this.south),{height:0});
element.setstyle($(this.west),{width:0,height:0});
}
element.setstyle($(this.imgwrap),{"width":this.imgw+"px","height":this.imgh+"px"});
element.hide($(this.selarea));
var _15=position.positionedoffset(this.imgwrap);
this.wrapoffsets={"top":_15[1],"left":_15[0]};
var _16={x1:0,y1:0,x2:0,y2:0};
this.setareacoords(_16);
if(this.options.ratiodim.x>0&&this.options.ratiodim.y>0&&this.options.displayoninit){
_16.x1=math.ceil((this.imgw-this.options.ratiodim.x)/2);
_16.y1=math.ceil((this.imgh-this.options.ratiodim.y)/2);
_16.x2=_16.x1+this.options.ratiodim.x;
_16.y2=_16.y1+this.options.ratiodim.y;
element.show(this.selarea);
this.drawarea();
this.endcrop();
}
this.attached=true;
},remove:function(){
this.attached=false;
this.imgwrap.parentnode.insertbefore(this.img,this.imgwrap);
this.imgwrap.parentnode.removechild(this.imgwrap);
event.stopobserving(this.dragarea,"mousedown",this.startdrag.bindaseventlistener(this));
event.stopobserving(document,"mousemove",this.ondrag.bindaseventlistener(this));
event.stopobserving(document,"mouseup",this.endcrop.bindaseventlistener(this));
var _17=[this.handlen,this.handlene,this.handlee,this.handlese,this.handles,this.handlesw,this.handlew,this.handlenw];
for(var i=0;i<_17.length;i++){
event.stopobserving(_17[i],"mousedown",this.startresize.bindaseventlistener(this));
}
if(this.options.capturekeys){
event.stopobserving(document,"keydown",this.handlekeys.bindaseventlistener(this));
}
},reset:function(){
if(!this.attached){
this.onload();
}else{
this.setparams();
}
this.endcrop();
},handlekeys:function(e){
var dir={x:0,y:0};
if(!this.dragging){
switch(e.keycode){
case (37):
dir.x=-1;
break;
case (38):
dir.y=-1;
break;
case (39):
dir.x=1;
break;
case (40):
dir.y=1;
break;
}
if(dir.x!=0||dir.y!=0){
if(e.shiftkey){
dir.x*=10;
dir.y*=10;
}
this.movearea([this.areacoords.x1+dir.x,this.areacoords.y1+dir.y]);
event.stop(e);
}
}
},calcw:function(){
return (this.areacoords.x2-this.areacoords.x1);
},calch:function(){
return (this.areacoords.y2-this.areacoords.y1);
},movearea:function(_1b){
this.setareacoords({x1:_1b[0],y1:_1b[1],x2:_1b[0]+this.calcw(),y2:_1b[1]+this.calch()},true);
this.drawarea();
},clonecoords:function(_1c){
return {x1:_1c.x1,y1:_1c.y1,x2:_1c.x2,y2:_1c.y2};
},setareacoords:function(_1d,_1e,_1f,_20,_21){
var _22=typeof _1e!="undefined"?_1e:false;
var _23=typeof _1f!="undefined"?_1f:false;
if(_1e){
var _24=_1d.x2-_1d.x1;
var _25=_1d.y2-_1d.y1;
if(_1d.x1<0){
_1d.x1=0;
_1d.x2=_24;
}
if(_1d.y1<0){
_1d.y1=0;
_1d.y2=_25;
}
if(_1d.x2>this.imgw){
_1d.x2=this.imgw;
_1d.x1=this.imgw-_24;
}
if(_1d.y2>this.imgh){
_1d.y2=this.imgh;
_1d.y1=this.imgh-_25;
}
}else{
if(_1d.x1<0){
_1d.x1=0;
}
if(_1d.y1<0){
_1d.y1=0;
}
if(_1d.x2>this.imgw){
_1d.x2=this.imgw;
}
if(_1d.y2>this.imgh){
_1d.y2=this.imgh;
}
if(typeof (_20)!="undefined"){
if(this.ratiox>0){
this.applyratio(_1d,{x:this.ratiox,y:this.ratioy},_20,_21);
}else{
if(_23){
this.applyratio(_1d,{x:1,y:1},_20,_21);
}
}
var _26={a1:_1d.x1,a2:_1d.x2};
var _27={a1:_1d.y1,a2:_1d.y2};
var _28=this.options.minwidth;
var _29=this.options.minheight;
if((_28==0||_29==0)&&_23){
if(_28>0){
_29=_28;
}else{
if(_29>0){
_28=_29;
}
}
}
this.applymindimension(_26,_28,_20.x,{min:0,max:this.imgw});
this.applymindimension(_27,_29,_20.y,{min:0,max:this.imgh});
_1d={x1:_26.a1,y1:_27.a1,x2:_26.a2,y2:_27.a2};
}
}
this.areacoords=_1d;
},applymindimension:function(_2a,_2b,_2c,_2d){
if((_2a.a2-_2a.a1)<_2b){
if(_2c==1){
_2a.a2=_2a.a1+_2b;
}else{
_2a.a1=_2a.a2-_2b;
}
if(_2a.a1<_2d.min){
_2a.a1=_2d.min;
_2a.a2=_2b;
}else{
if(_2a.a2>_2d.max){
_2a.a1=_2d.max-_2b;
_2a.a2=_2d.max;
}
}
}
},applyratio:function(_2e,_2f,_30,_31){
var _32;
if(_31=="n"||_31=="s"){
_32=this.applyratiotoaxis({a1:_2e.y1,b1:_2e.x1,a2:_2e.y2,b2:_2e.x2},{a:_2f.y,b:_2f.x},{a:_30.y,b:_30.x},{min:0,max:this.imgw});
_2e.x1=_32.b1;
_2e.y1=_32.a1;
_2e.x2=_32.b2;
_2e.y2=_32.a2;
}else{
_32=this.applyratiotoaxis({a1:_2e.x1,b1:_2e.y1,a2:_2e.x2,b2:_2e.y2},{a:_2f.x,b:_2f.y},{a:_30.x,b:_30.y},{min:0,max:this.imgh});
_2e.x1=_32.a1;
_2e.y1=_32.b1;
_2e.x2=_32.a2;
_2e.y2=_32.b2;
}
},applyratiotoaxis:function(_33,_34,_35,_36){
var _37=object.extend(_33,{});
var _38=_37.a2-_37.a1;
var _3a=math.floor(_38*_34.b/_34.a);
var _3b;
var _3c;
var _3d=null;
if(_35.b==1){
_3b=_37.b1+_3a;
if(_3b>_36.max){
_3b=_36.max;
_3d=_3b-_37.b1;
}
_37.b2=_3b;
}else{
_3b=_37.b2-_3a;
if(_3b<_36.min){
_3b=_36.min;
_3d=_3b+_37.b2;
}
_37.b1=_3b;
}
if(_3d!=null){
_3c=math.floor(_3d*_34.a/_34.b);
if(_35.a==1){
_37.a2=_37.a1+_3c;
}else{
_37.a1=_37.a1=_37.a2-_3c;
}
}
return _37;
},drawarea:function(){
if(!this.isie){
element.show($(this.overlay));
}
var _3e=this.calcw();
var _3f=this.calch();
var _40=this.areacoords.x2;
var _41=this.areacoords.y2;
var _42=this.selarea.style;
_42.left=this.areacoords.x1+"px";
_42.top=this.areacoords.y1+"px";
_42.width=_3e+"px";
_42.height=_3f+"px";
var _43=math.ceil((_3e-6)/2)+"px";
var _44=math.ceil((_3f-6)/2)+"px";
this.handlen.style.left=_43;
this.handlee.style.top=_44;
this.handles.style.left=_43;
this.handlew.style.top=_44;
if(this.isie){
this.north.style.height=this.areacoords.y1+"px";
var _45=this.east.style;
_45.top=this.areacoords.y1+"px";
_45.height=_3f+"px";
_45.left=_40+"px";
_45.width=(this.img.width-_40)+"px";
var _46=this.south.style;
_46.top=_41+"px";
_46.height=(this.img.height-_41)+"px";
var _47=this.west.style;
_47.top=this.areacoords.y1+"px";
_47.height=_3f+"px";
_47.width=this.areacoords.x1+"px";
}else{
_42.backgroundposition="-"+this.areacoords.x1+"px "+"-"+this.areacoords.y1+"px";
}
this.subdrawarea();
this.forcererender();
},forcererender:function(){
if(this.isie||this.iswebkit){
var n=document.createtextnode(" ");
var d,el,fixel,i;
if(this.isie){
fixel=this.selarea;
}else{
if(this.iswebkit){
fixel=document.getelementsbyclassname("imgcrop_marqueesouth",this.imgwrap)[0];
d=builder.node("div","");
d.style.visibility="hidden";
var _4a=["se","s","sw"];
for(i=0;i<_4a.length;i++){
el=document.getelementsbyclassname("imgcrop_handle"+_4a[i],this.selarea)[0];
if(el.childnodes.length){
el.removechild(el.childnodes[0]);
}
el.appendchild(d);
}
}
}
fixel.appendchild(n);
fixel.removechild(n);
}
},startresize:function(e){
this.startcoords=this.clonecoords(this.areacoords);
this.resizing=true;
this.resizehandle=element.classnames(event.element(e)).tostring().replace(/([^n|ne|e|se|s|sw|w|nw])+/,"");
event.stop(e);
},startdrag:function(e){
element.show(this.selarea);
this.clickcoords=this.getcurpos(e);
this.setareacoords({x1:this.clickcoords.x,y1:this.clickcoords.y,x2:this.clickcoords.x,y2:this.clickcoords.y});
this.dragging=true;
this.ondrag(e);
event.stop(e);
},getcurpos:function(e){
return curpos={x:event.pointerx(e)-this.wrapoffsets.left,y:event.pointery(e)-this.wrapoffsets.top};
},ondrag:function(e){
var _4f=null;
if(this.dragging||this.resizing){
var _50=this.getcurpos(e);
var _51=this.clonecoords(this.areacoords);
var _52={x:1,y:1};
}
if(this.dragging){
if(_50.x<this.clickcoords.x){
_52.x=-1;
}
if(_50.y<this.clickcoords.y){
_52.y=-1;
}
this.transformcoords(_50.x,this.clickcoords.x,_51,"x");
this.transformcoords(_50.y,this.clickcoords.y,_51,"y");
}else{
if(this.resizing){
_4f=this.resizehandle;
if(_4f.match(/e/)){
this.transformcoords(_50.x,this.startcoords.x1,_51,"x");
if(_50.x<this.startcoords.x1){
_52.x=-1;
}
}else{
if(_4f.match(/w/)){
this.transformcoords(_50.x,this.startcoords.x2,_51,"x");
if(_50.x<this.startcoords.x2){
_52.x=-1;
}
}
}
if(_4f.match(/n/)){
this.transformcoords(_50.y,this.startcoords.y2,_51,"y");
if(_50.y<this.startcoords.y2){
_52.y=-1;
}
}else{
if(_4f.match(/s/)){
this.transformcoords(_50.y,this.startcoords.y1,_51,"y");
if(_50.y<this.startcoords.y1){
_52.y=-1;
}
}
}
}
}
if(this.dragging||this.resizing){
this.setareacoords(_51,false,e.shiftkey,_52,_4f);
this.drawarea();
event.stop(e);
}
},transformcoords:function(_53,_54,_55,_56){
var _57=new array();
if(_53<_54){
_57[0]=_53;
_57[1]=_54;
}else{
_57[0]=_54;
_57[1]=_53;
}
if(_56=="x"){
_55.x1=_57[0];
_55.x2=_57[1];
}else{
_55.y1=_57[0];
_55.y2=_57[1];
}
},endcrop:function(){
this.dragging=false;
this.resizing=false;
this.options.onendcrop(this.areacoords,{width:this.calcw(),height:this.calch()});
},subinitialize:function(){
},subdrawarea:function(){
}};
cropper.imgwithpreview=class.create();
object.extend(object.extend(cropper.imgwithpreview.prototype,cropper.img.prototype),{subinitialize:function(){
this.haspreviewimg=false;
if(typeof (this.options.previewwrap)!="undefined"&&this.options.minwidth>0&&this.options.minheight>0){
this.previewwrap=$(this.options.previewwrap);
this.previewimg=this.img.clonenode(false);
this.options.displayoninit=true;
this.haspreviewimg=true;
element.addclassname(this.previewwrap,"imgcrop_previewwrap");
element.setstyle(this.previewwrap,{width:this.options.minwidth+"px",height:this.options.minheight+"px"});
this.previewwrap.appendchild(this.previewimg);
}
},subdrawarea:function(){
if(this.haspreviewimg){
var _58=this.calcw();
var _59=this.calch();
var _5a={x:this.imgw/_58,y:this.imgh/_59};
var _5b={x:_58/this.options.minwidth,y:_59/this.options.minheight};
var _5c={w:math.ceil(this.options.minwidth*_5a.x)+"px",h:math.ceil(this.options.minheight*_5a.y)+"px",x:"-"+math.ceil(this.areacoords.x1/_5b.x)+"px",y:"-"+math.ceil(this.areacoords.y1/_5b.y)+"px"};
var _5d=this.previewimg.style;
_5d.width=_5c.w;
_5d.height=_5c.h;
_5d.left=_5c.x;
_5d.top=_5c.y;
}
}});







