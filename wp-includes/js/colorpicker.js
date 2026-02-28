// ===================================================================
// author: matt kruse <matt@mattkruse.com>
// www: http://www.mattkruse.com/
//
// notice: you may use this code for any purpose, commercial or
// private, without any further permission from the author. you may
// remove this notice from your final code if you wish, however it is
// appreciated by the author if at least my web site address is kept.
//
// you may *not* re-distribute this code in any way except through its
// use. that means, you can include it in your product, or your web
// site, or any other form where the code is actually being used. you
// may not put the plain javascript up on your site for download or
// include it in your javascript libraries for download.
// if you wish to share this code with others, please just point them
// to the url instead.
// please do not link directly to my .js files from your site. copy
// the files to your server and use them there. thank you.
// ===================================================================


/* source file: anchorposition.js */

/*
anchorposition.js
author: matt kruse
last modified: 10/11/02

description: these functions find the position of an <a> tag in a document,
so other elements can be positioned relative to it.

compatability: netscape 4.x,6.x,mozilla, ie 5.x,6.x on windows. some small
positioning errors - usually with window positioning - occur on the
macintosh platform.

functions:
getanchorposition(anchorname)
  returns an object() having .x and .y properties of the pixel coordinates
  of the upper-left corner of the anchor. position is relative to the page.

getanchorwindowposition(anchorname)
  returns an object() having .x and .y properties of the pixel coordinates
  of the upper-left corner of the anchor, relative to the whole screen.

notes:

1) for popping up separate browser windows, use getanchorwindowposition.
   otherwise, use getanchorposition

2) your anchor tag must contain both name and id attributes which are the
   same. for example:
   <a name="test" id="test"> </a>

3) there must be at least a space between <a> </a> for ie5.5 to see the
   anchor tag correctly. do not do <a></a> with no space.
*/

// getanchorposition(anchorname)
//   this function returns an object having .x and .y properties which are the coordinates
//   of the named anchor, relative to the page.
function getanchorposition(anchorname) {
	// this function will return an object with x and y properties
	var usewindow=false;
	var coordinates=new object();
	var x=0,y=0;
	// browser capability sniffing
	var use_gebi=false, use_css=false, use_layers=false;
	if (document.getelementbyid) { use_gebi=true; }
	else if (document.all) { use_css=true; }
	else if (document.layers) { use_layers=true; }
	// logic to find position
 	if (use_gebi && document.all) {
		x=anchorposition_getpageoffsetleft(document.all[anchorname]);
		y=anchorposition_getpageoffsettop(document.all[anchorname]);
		}
	else if (use_gebi) {
		var o=document.getelementbyid(anchorname);
		x=anchorposition_getpageoffsetleft(o);
		y=anchorposition_getpageoffsettop(o);
		}
 	else if (use_css) {
		x=anchorposition_getpageoffsetleft(document.all[anchorname]);
		y=anchorposition_getpageoffsettop(document.all[anchorname]);
		}
	else if (use_layers) {
		var found=0;
		for (var i=0; i<document.anchors.length; i++) {
			if (document.anchors[i].name==anchorname) { found=1; break; }
			}
		if (found==0) {
			coordinates.x=0; coordinates.y=0; return coordinates;
			}
		x=document.anchors[i].x;
		y=document.anchors[i].y;
		}
	else {
		coordinates.x=0; coordinates.y=0; return coordinates;
		}
	coordinates.x=x;
	coordinates.y=y;
	return coordinates;
	}

// getanchorwindowposition(anchorname)
//   this function returns an object having .x and .y properties which are the coordinates
//   of the named anchor, relative to the window
function getanchorwindowposition(anchorname) {
	var coordinates=getanchorposition(anchorname);
	var x=0;
	var y=0;
	if (document.getelementbyid) {
		if (isnan(window.screenx)) {
			x=coordinates.x-document.body.scrollleft+window.screenleft;
			y=coordinates.y-document.body.scrolltop+window.screentop;
			}
		else {
			x=coordinates.x+window.screenx+(window.outerwidth-window.innerwidth)-window.pagexoffset;
			y=coordinates.y+window.screeny+(window.outerheight-24-window.innerheight)-window.pageyoffset;
			}
		}
	else if (document.all) {
		x=coordinates.x-document.body.scrollleft+window.screenleft;
		y=coordinates.y-document.body.scrolltop+window.screentop;
		}
	else if (document.layers) {
		x=coordinates.x+window.screenx+(window.outerwidth-window.innerwidth)-window.pagexoffset;
		y=coordinates.y+window.screeny+(window.outerheight-24-window.innerheight)-window.pageyoffset;
		}
	coordinates.x=x;
	coordinates.y=y;
	return coordinates;
	}

// functions for ie to get position of an object
function anchorposition_getpageoffsetleft (el) {
	var ol=el.offsetleft;
	while ((el=el.offsetparent) != null) { ol += el.offsetleft; }
	return ol;
	}
function anchorposition_getwindowoffsetleft (el) {
	return anchorposition_getpageoffsetleft(el)-document.body.scrollleft;
	}
function anchorposition_getpageoffsettop (el) {
	var ot=el.offsettop;
	while((el=el.offsetparent) != null) { ot += el.offsettop; }
	return ot;
	}
function anchorposition_getwindowoffsettop (el) {
	return anchorposition_getpageoffsettop(el)-document.body.scrolltop;
	}

/* source file: popupwindow.js */

/*
popupwindow.js
author: matt kruse
last modified: 02/16/04

description: this object allows you to easily and quickly popup a window
in a certain place. the window can either be a div or a separate browser
window.

compatability: works with netscape 4.x, 6.x, ie 5.x on windows. some small
positioning errors - usually with window positioning - occur on the
macintosh platform. due to bugs in netscape 4.x, populating the popup
window with <style> tags may cause errors.

usage:
// create an object for a window popup
var win = new popupwindow();

// create an object for a div window using the div named 'mydiv'
var win = new popupwindow('mydiv');

// set the window to automatically hide itself when the user clicks
// anywhere else on the page except the popup
win.autohide();

// show the window relative to the anchor name passed in
win.showpopup(anchorname);

// hide the popup
win.hidepopup();

// set the size of the popup window (only applies to window popups
win.setsize(width,height);

// populate the contents of the popup window that will be shown. if you
// change the contents while it is displayed, you will need to refresh()
win.populate(string);

// set the url of the window, rather than populating its contents
// manually
win.seturl("http://www.site.com/");

// refresh the contents of the popup
win.refresh();

// specify how many pixels to the right of the anchor the popup will appear
win.offsetx = 50;

// specify how many pixels below the anchor the popup will appear
win.offsety = 100;

notes:
1) requires the functions in anchorposition.js

2) your anchor tag must contain both name and id attributes which are the
   same. for example:
   <a name="test" id="test"> </a>

3) there must be at least a space between <a> </a> for ie5.5 to see the
   anchor tag correctly. do not do <a></a> with no space.

4) when a popupwindow object is created, a handler for 'onmouseup' is
   attached to any event handler you may have already defined. do not define
   an event handler for 'onmouseup' after you define a popupwindow object or
   the autohide() will not work correctly.
*/

// set the position of the popup window based on the anchor
function popupwindow_getxyposition(anchorname) {
	var coordinates;
	if (this.type == "window") {
		coordinates = getanchorwindowposition(anchorname);
		}
	else {
		coordinates = getanchorposition(anchorname);
		}
	this.x = coordinates.x;
	this.y = coordinates.y;
	}
// set width/height of div/popup window
function popupwindow_setsize(width,height) {
	this.width = width;
	this.height = height;
	}
// fill the window with contents
function popupwindow_populate(contents) {
	this.contents = contents;
	this.populated = false;
	}
// set the url to go to
function popupwindow_seturl(url) {
	this.url = url;
	}
// set the window popup properties
function popupwindow_setwindowproperties(props) {
	this.windowproperties = props;
	}
// refresh the displayed contents of the popup
function popupwindow_refresh() {
	if (this.divname != null) {
		// refresh the div object
		if (this.use_gebi) {
			document.getelementbyid(this.divname).innerhtml = this.contents;
			}
		else if (this.use_css) {
			document.all[this.divname].innerhtml = this.contents;
			}
		else if (this.use_layers) {
			var d = document.layers[this.divname];
			d.document.open();
			d.document.writeln(this.contents);
			d.document.close();
			}
		}
	else {
		if (this.popupwindow != null && !this.popupwindow.closed) {
			if (this.url!="") {
				this.popupwindow.location.href=this.url;
				}
			else {
				this.popupwindow.document.open();
				this.popupwindow.document.writeln(this.contents);
				this.popupwindow.document.close();
			}
			this.popupwindow.focus();
			}
		}
	}
// position and show the popup, relative to an anchor object
function popupwindow_showpopup(anchorname) {
	this.getxyposition(anchorname);
	this.x += this.offsetx;
	this.y += this.offsety;
	if (!this.populated && (this.contents != "")) {
		this.populated = true;
		this.refresh();
		}
	if (this.divname != null) {
		// show the div object
		if (this.use_gebi) {
			document.getelementbyid(this.divname).style.left = this.x + "px";
			document.getelementbyid(this.divname).style.top = this.y;
			document.getelementbyid(this.divname).style.visibility = "visible";
			}
		else if (this.use_css) {
			document.all[this.divname].style.left = this.x;
			document.all[this.divname].style.top = this.y;
			document.all[this.divname].style.visibility = "visible";
			}
		else if (this.use_layers) {
			document.layers[this.divname].left = this.x;
			document.layers[this.divname].top = this.y;
			document.layers[this.divname].visibility = "visible";
			}
		}
	else {
		if (this.popupwindow == null || this.popupwindow.closed) {
			// if the popup window will go off-screen, move it so it doesn't
			if (this.x<0) { this.x=0; }
			if (this.y<0) { this.y=0; }
			if (screen && screen.availheight) {
				if ((this.y + this.height) > screen.availheight) {
					this.y = screen.availheight - this.height;
					}
				}
			if (screen && screen.availwidth) {
				if ((this.x + this.width) > screen.availwidth) {
					this.x = screen.availwidth - this.width;
					}
				}
			var avoidaboutblank = window.opera || ( document.layers && !navigator.mimetypes['*'] ) || navigator.vendor == 'kde' || ( document.childnodes && !document.all && !navigator.taintenabled );
			this.popupwindow = window.open(avoidaboutblank?"":"about:blank","window_"+anchorname,this.windowproperties+",width="+this.width+",height="+this.height+",screenx="+this.x+",left="+this.x+",screeny="+this.y+",top="+this.y+"");
			}
		this.refresh();
		}
	}
// hide the popup
function popupwindow_hidepopup() {
	if (this.divname != null) {
		if (this.use_gebi) {
			document.getelementbyid(this.divname).style.visibility = "hidden";
			}
		else if (this.use_css) {
			document.all[this.divname].style.visibility = "hidden";
			}
		else if (this.use_layers) {
			document.layers[this.divname].visibility = "hidden";
			}
		}
	else {
		if (this.popupwindow && !this.popupwindow.closed) {
			this.popupwindow.close();
			this.popupwindow = null;
			}
		}
	}
// pass an event and return whether or not it was the popup div that was clicked
function popupwindow_isclicked(e) {
	if (this.divname != null) {
		if (this.use_layers) {
			var clickx = e.pagex;
			var clicky = e.pagey;
			var t = document.layers[this.divname];
			if ((clickx > t.left) && (clickx < t.left+t.clip.width) && (clicky > t.top) && (clicky < t.top+t.clip.height)) {
				return true;
				}
			else { return false; }
			}
		else if (document.all) { // need to hard-code this to trap ie for error-handling
			var t = window.event.srcelement;
			while (t.parentelement != null) {
				if (t.id==this.divname) {
					return true;
					}
				t = t.parentelement;
				}
			return false;
			}
		else if (this.use_gebi && e) {
			var t = e.originaltarget;
			while (t.parentnode != null) {
				if (t.id==this.divname) {
					return true;
					}
				t = t.parentnode;
				}
			return false;
			}
		return false;
		}
	return false;
	}

// check an onmousedown event to see if we should hide
function popupwindow_hideifnotclicked(e) {
	if (this.autohideenabled && !this.isclicked(e)) {
		this.hidepopup();
		}
	}
// call this to make the div disable automatically when mouse is clicked outside it
function popupwindow_autohide() {
	this.autohideenabled = true;
	}
// this global function checks all popupwindow objects onmouseup to see if they should be hidden
function popupwindow_hidepopupwindows(e) {
	for (var i=0; i<popupwindowobjects.length; i++) {
		if (popupwindowobjects[i] != null) {
			var p = popupwindowobjects[i];
			p.hideifnotclicked(e);
			}
		}
	}
// run this immediately to attach the event listener
function popupwindow_attachlistener() {
	if (document.layers) {
		document.captureevents(event.mouseup);
		}
	window.popupwindowoldeventlistener = document.onmouseup;
	if (window.popupwindowoldeventlistener != null) {
		document.onmouseup = new function("window.popupwindowoldeventlistener(); popupwindow_hidepopupwindows();");
		}
	else {
		document.onmouseup = popupwindow_hidepopupwindows;
		}
	}
// constructor for the popupwindow object
// pass it a div name to use a dhtml popup, otherwise will default to window popup
function popupwindow() {
	if (!window.popupwindowindex) { window.popupwindowindex = 0; }
	if (!window.popupwindowobjects) { window.popupwindowobjects = new array(); }
	if (!window.listenerattached) {
		window.listenerattached = true;
		popupwindow_attachlistener();
		}
	this.index = popupwindowindex++;
	popupwindowobjects[this.index] = this;
	this.divname = null;
	this.popupwindow = null;
	this.width=0;
	this.height=0;
	this.populated = false;
	this.visible = false;
	this.autohideenabled = false;

	this.contents = "";
	this.url="";
	this.windowproperties="toolbar=no,location=no,status=no,menubar=no,scrollbars=auto,resizable,alwaysraised,dependent,titlebar=no";
	if (arguments.length>0) {
		this.type="div";
		this.divname = arguments[0];
		}
	else {
		this.type="window";
		}
	this.use_gebi = false;
	this.use_css = false;
	this.use_layers = false;
	if (document.getelementbyid) { this.use_gebi = true; }
	else if (document.all) { this.use_css = true; }
	else if (document.layers) { this.use_layers = true; }
	else { this.type = "window"; }
	this.offsetx = 0;
	this.offsety = 0;
	// method mappings
	this.getxyposition = popupwindow_getxyposition;
	this.populate = popupwindow_populate;
	this.seturl = popupwindow_seturl;
	this.setwindowproperties = popupwindow_setwindowproperties;
	this.refresh = popupwindow_refresh;
	this.showpopup = popupwindow_showpopup;
	this.hidepopup = popupwindow_hidepopup;
	this.setsize = popupwindow_setsize;
	this.isclicked = popupwindow_isclicked;
	this.autohide = popupwindow_autohide;
	this.hideifnotclicked = popupwindow_hideifnotclicked;
	}

/* source file: colorpicker2.js */

/*
last modified: 02/24/2003

description: this widget is used to select a color, in hexadecimal #rrggbb
form. it uses a color "swatch" to display the standard 216-color web-safe
palette. the user can then click on a color to select it.

compatability: see notes in anchorposition.js and popupwindow.js.
only the latest dhtml-capable browsers will show the color and hex values
at the bottom as your mouse goes over them.

usage:
// create a new colorpicker object using dhtml popup
var cp = new colorpicker();

// create a new colorpicker object using window popup
var cp = new colorpicker('window');

// add a link in your page to trigger the popup. for example:
<a href="#" onclick="cp.show('pick');return false;" name="pick" id="pick">pick</a>

// or use the built-in "select" function to do the dirty work for you:
<a href="#" onclick="cp.select(document.forms[0].color,'pick');return false;" name="pick" id="pick">pick</a>

// if using dhtml popup, write out the required div tag near the bottom
// of your page.
<script language="javascript">cp.writediv()</script>

// write the 'pickcolor' function that will be called when the user clicks
// a color and do something with the value. this is only required if you
// want to do something other than simply populate a form field, which is
// what the 'select' function will give you.
function pickcolor(color) {
	field.value = color;
	}

notes:
1) requires the functions in anchorposition.js and popupwindow.js

2) your anchor tag must contain both name and id attributes which are the
   same. for example:
   <a name="test" id="test"> </a>

3) there must be at least a space between <a> </a> for ie5.5 to see the
   anchor tag correctly. do not do <a></a> with no space.

4) when a colorpicker object is created, a handler for 'onmouseup' is
   attached to any event handler you may have already defined. do not define
   an event handler for 'onmouseup' after you define a colorpicker object or
   the color picker will not hide itself correctly.
*/
colorpicker_targetinput = null;
function colorpicker_writediv() {
	document.writeln("<div id=\"colorpickerdiv\" style=\"position:absolute;visibility:hidden;\"> </div>");
	}

function colorpicker_show(anchorname) {
	this.showpopup(anchorname);
	}

function colorpicker_pickcolor(color,obj) {
	obj.hidepopup();
	pickcolor(color);
	}

// a default "pickcolor" function to accept the color passed back from popup.
// user can over-ride this with their own function.
function pickcolor(color) {
	if (colorpicker_targetinput==null) {
		alert("target input is null, which means you either didn't use the 'select' function or you have no defined your own 'pickcolor' function to handle the picked color!");
		return;
		}
	colorpicker_targetinput.value = color;
	}

// this function is the easiest way to popup the window, select a color, and
// have the value populate a form field, which is what most people want to do.
function colorpicker_select(inputobj,linkname) {
	if (inputobj.type!="text" && inputobj.type!="hidden" && inputobj.type!="textarea") {
		alert("colorpicker.select: input object passed is not a valid form input object");
		window.colorpicker_targetinput=null;
		return;
		}
	window.colorpicker_targetinput = inputobj;
	this.show(linkname);
	}

// this function runs when you move your mouse over a color block, if you have a newer browser
function colorpicker_highlightcolor(c) {
	var thedoc = (arguments.length>1)?arguments[1]:window.document;
	var d = thedoc.getelementbyid("colorpickerselectedcolor");
	d.style.backgroundcolor = c;
	d = thedoc.getelementbyid("colorpickerselectedcolorvalue");
	d.innerhtml = c;
	}

function colorpicker() {
	var windowmode = false;
	// create a new popupwindow object
	if (arguments.length==0) {
		var divname = "colorpickerdiv";
		}
	else if (arguments[0] == "window") {
		var divname = '';
		windowmode = true;
		}
	else {
		var divname = arguments[0];
		}

	if (divname != "") {
		var cp = new popupwindow(divname);
		}
	else {
		var cp = new popupwindow();
		cp.setsize(225,250);
		}

	// object variables
	cp.currentvalue = "#ffffff";

	// method mappings
	cp.writediv = colorpicker_writediv;
	cp.highlightcolor = colorpicker_highlightcolor;
	cp.show = colorpicker_show;
	cp.select = colorpicker_select;

	// code to populate color picker window
	var colors = new array(	"#4180b6","#69aee7","#000000","#000033","#000066","#000099","#0000cc","#0000ff","#330000","#330033","#330066","#330099",
							"#3300cc","#3300ff","#660000","#660033","#660066","#660099","#6600cc","#6600ff","#990000","#990033","#990066","#990099",
							"#9900cc","#9900ff","#cc0000","#cc0033","#cc0066","#cc0099","#cc00cc","#cc00ff","#ff0000","#ff0033","#ff0066","#ff0099",
							"#ff00cc","#ff00ff","#7fffff","#7fffff","#7ff7f7","#7fefef","#7fe7e7","#7fdfdf","#7fd7d7","#7fcfcf","#7fc7c7","#7fbfbf",
							"#7fb7b7","#7fafaf","#7fa7a7","#7f9f9f","#7f9797","#7f8f8f","#7f8787","#7f7f7f","#7f7777","#7f6f6f","#7f6767","#7f5f5f",
							"#7f5757","#7f4f4f","#7f4747","#7f3f3f","#7f3737","#7f2f2f","#7f2727","#7f1f1f","#7f1717","#7f0f0f","#7f0707","#7f0000",

							"#4180b6","#69aee7","#003300","#003333","#003366","#003399","#0033cc","#0033ff","#333300","#333333","#333366","#333399",
							"#3333cc","#3333ff","#663300","#663333","#663366","#663399","#6633cc","#6633ff","#993300","#993333","#993366","#993399",
							"#9933cc","#9933ff","#cc3300","#cc3333","#cc3366","#cc3399","#cc33cc","#cc33ff","#ff3300","#ff3333","#ff3366","#ff3399",
							"#ff33cc","#ff33ff","#ff7fff","#ff7fff","#f77ff7","#ef7fef","#e77fe7","#df7fdf","#d77fd7","#cf7fcf","#c77fc7","#bf7fbf",
							"#b77fb7","#af7faf","#a77fa7","#9f7f9f","#977f97","#8f7f8f","#877f87","#7f7f7f","#777f77","#6f7f6f","#677f67","#5f7f5f",
							"#577f57","#4f7f4f","#477f47","#3f7f3f","#377f37","#2f7f2f","#277f27","#1f7f1f","#177f17","#0f7f0f","#077f07","#007f00",

							"#4180b6","#69aee7","#006600","#006633","#006666","#006699","#0066cc","#0066ff","#336600","#336633","#336666","#336699",
							"#3366cc","#3366ff","#666600","#666633","#666666","#666699","#6666cc","#6666ff","#996600","#996633","#996666","#996699",
							"#9966cc","#9966ff","#cc6600","#cc6633","#cc6666","#cc6699","#cc66cc","#cc66ff","#ff6600","#ff6633","#ff6666","#ff6699",
							"#ff66cc","#ff66ff","#ffff7f","#ffff7f","#f7f77f","#efef7f","#e7e77f","#dfdf7f","#d7d77f","#cfcf7f","#c7c77f","#bfbf7f",
							"#b7b77f","#afaf7f","#a7a77f","#9f9f7f","#97977f","#8f8f7f","#87877f","#7f7f7f","#77777f","#6f6f7f","#67677f","#5f5f7f",
							"#57577f","#4f4f7f","#47477f","#3f3f7f","#37377f","#2f2f7f","#27277f","#1f1f7f","#17177f","#0f0f7f","#07077f","#00007f",

							"#4180b6","#69aee7","#009900","#009933","#009966","#009999","#0099cc","#0099ff","#339900","#339933","#339966","#339999",
							"#3399cc","#3399ff","#669900","#669933","#669966","#669999","#6699cc","#6699ff","#999900","#999933","#999966","#999999",
							"#9999cc","#9999ff","#cc9900","#cc9933","#cc9966","#cc9999","#cc99cc","#cc99ff","#ff9900","#ff9933","#ff9966","#ff9999",
							"#ff99cc","#ff99ff","#3fffff","#3fffff","#3ff7f7","#3fefef","#3fe7e7","#3fdfdf","#3fd7d7","#3fcfcf","#3fc7c7","#3fbfbf",
							"#3fb7b7","#3fafaf","#3fa7a7","#3f9f9f","#3f9797","#3f8f8f","#3f8787","#3f7f7f","#3f7777","#3f6f6f","#3f6767","#3f5f5f",
							"#3f5757","#3f4f4f","#3f4747","#3f3f3f","#3f3737","#3f2f2f","#3f2727","#3f1f1f","#3f1717","#3f0f0f","#3f0707","#3f0000",

							"#4180b6","#69aee7","#00cc00","#00cc33","#00cc66","#00cc99","#00cccc","#00ccff","#33cc00","#33cc33","#33cc66","#33cc99",
							"#33cccc","#33ccff","#66cc00","#66cc33","#66cc66","#66cc99","#66cccc","#66ccff","#99cc00","#99cc33","#99cc66","#99cc99",
							"#99cccc","#99ccff","#cccc00","#cccc33","#cccc66","#cccc99","#cccccc","#ccccff","#ffcc00","#ffcc33","#ffcc66","#ffcc99",
							"#ffcccc","#ffccff","#ff3fff","#ff3fff","#f73ff7","#ef3fef","#e73fe7","#df3fdf","#d73fd7","#cf3fcf","#c73fc7","#bf3fbf",
							"#b73fb7","#af3faf","#a73fa7","#9f3f9f","#973f97","#8f3f8f","#873f87","#7f3f7f","#773f77","#6f3f6f","#673f67","#5f3f5f",
							"#573f57","#4f3f4f","#473f47","#3f3f3f","#373f37","#2f3f2f","#273f27","#1f3f1f","#173f17","#0f3f0f","#073f07","#003f00",

							"#4180b6","#69aee7","#00ff00","#00ff33","#00ff66","#00ff99","#00ffcc","#00ffff","#33ff00","#33ff33","#33ff66","#33ff99",
							"#33ffcc","#33ffff","#66ff00","#66ff33","#66ff66","#66ff99","#66ffcc","#66ffff","#99ff00","#99ff33","#99ff66","#99ff99",
							"#99ffcc","#99ffff","#ccff00","#ccff33","#ccff66","#ccff99","#ccffcc","#ccffff","#ffff00","#ffff33","#ffff66","#ffff99",
							"#ffffcc","#ffffff","#ffff3f","#ffff3f","#f7f73f","#efef3f","#e7e73f","#dfdf3f","#d7d73f","#cfcf3f","#c7c73f","#bfbf3f",
							"#b7b73f","#afaf3f","#a7a73f","#9f9f3f","#97973f","#8f8f3f","#87873f","#7f7f3f","#77773f","#6f6f3f","#67673f","#5f5f3f",
							"#57573f","#4f4f3f","#47473f","#3f3f3f","#37373f","#2f2f3f","#27273f","#1f1f3f","#17173f","#0f0f3f","#07073f","#00003f",

							"#4180b6","#69aee7","#ffffff","#ffeeee","#ffdddd","#ffcccc","#ffbbbb","#ffaaaa","#ff9999","#ff8888","#ff7777","#ff6666",
							"#ff5555","#ff4444","#ff3333","#ff2222","#ff1111","#ff0000","#ff0000","#ff0000","#ff0000","#ee0000","#dd0000","#cc0000",
							"#bb0000","#aa0000","#990000","#880000","#770000","#660000","#550000","#440000","#330000","#220000","#110000","#000000",
							"#000000","#000000","#000000","#001111","#002222","#003333","#004444","#005555","#006666","#007777","#008888","#009999",
							"#00aaaa","#00bbbb","#00cccc","#00dddd","#00eeee","#00ffff","#00ffff","#00ffff","#00ffff","#11ffff","#22ffff","#33ffff",
							"#44ffff","#55ffff","#66ffff","#77ffff","#88ffff","#99ffff","#aaffff","#bbffff","#ccffff","#ddffff","#eeffff","#ffffff",

							"#4180b6","#69aee7","#ffffff","#eeffee","#ddffdd","#ccffcc","#bbffbb","#aaffaa","#99ff99","#88ff88","#77ff77","#66ff66",
							"#55ff55","#44ff44","#33ff33","#22ff22","#11ff11","#00ff00","#00ff00","#00ff00","#00ff00","#00ee00","#00dd00","#00cc00",
							"#00bb00","#00aa00","#009900","#008800","#007700","#006600","#005500","#004400","#003300","#002200","#001100","#000000",
							"#000000","#000000","#000000","#110011","#220022","#330033","#440044","#550055","#660066","#770077","#880088","#990099",
							"#aa00aa","#bb00bb","#cc00cc","#dd00dd","#ee00ee","#ff00ff","#ff00ff","#ff00ff","#ff00ff","#ff11ff","#ff22ff","#ff33ff",
							"#ff44ff","#ff55ff","#ff66ff","#ff77ff","#ff88ff","#ff99ff","#ffaaff","#ffbbff","#ffccff","#ffddff","#ffeeff","#ffffff",

							"#4180b6","#69aee7","#ffffff","#eeeeff","#ddddff","#ccccff","#bbbbff","#aaaaff","#9999ff","#8888ff","#7777ff","#6666ff",
							"#5555ff","#4444ff","#3333ff","#2222ff","#1111ff","#0000ff","#0000ff","#0000ff","#0000ff","#0000ee","#0000dd","#0000cc",
							"#0000bb","#0000aa","#000099","#000088","#000077","#000066","#000055","#000044","#000033","#000022","#000011","#000000",
							"#000000","#000000","#000000","#111100","#222200","#333300","#444400","#555500","#666600","#777700","#888800","#999900",
							"#aaaa00","#bbbb00","#cccc00","#dddd00","#eeee00","#ffff00","#ffff00","#ffff00","#ffff00","#ffff11","#ffff22","#ffff33",
							"#ffff44","#ffff55","#ffff66","#ffff77","#ffff88","#ffff99","#ffffaa","#ffffbb","#ffffcc","#ffffdd","#ffffee","#ffffff",

							"#4180b6","#69aee7","#ffffff","#ffffff","#fbfbfb","#f7f7f7","#f3f3f3","#efefef","#ebebeb","#e7e7e7","#e3e3e3","#dfdfdf",
							"#dbdbdb","#d7d7d7","#d3d3d3","#cfcfcf","#cbcbcb","#c7c7c7","#c3c3c3","#bfbfbf","#bbbbbb","#b7b7b7","#b3b3b3","#afafaf",
							"#ababab","#a7a7a7","#a3a3a3","#9f9f9f","#9b9b9b","#979797","#939393","#8f8f8f","#8b8b8b","#878787","#838383","#7f7f7f",
							"#7b7b7b","#777777","#737373","#6f6f6f","#6b6b6b","#676767","#636363","#5f5f5f","#5b5b5b","#575757","#535353","#4f4f4f",
							"#4b4b4b","#474747","#434343","#3f3f3f","#3b3b3b","#373737","#333333","#2f2f2f","#2b2b2b","#272727","#232323","#1f1f1f",
							"#1b1b1b","#171717","#131313","#0f0f0f","#0b0b0b","#070707","#030303","#000000","#000000","#000000","#000000","#000000");
	var total = colors.length;
	var width = 72;
	var cp_contents = "";
	var windowref = (windowmode)?"window.opener.":"";
	if (windowmode) {
		cp_contents += "<html><head><title>select color</title></head>";
		cp_contents += "<body marginwidth=0 marginheight=0 leftmargin=0 topmargin=0><span style='text-align: center;'>";
		}
	cp_contents += "<table style='border: none;' cellspacing=0 cellpadding=0>";
	var use_highlight = (document.getelementbyid || document.all)?true:false;
	for (var i=0; i<total; i++) {
		if ((i % width) == 0) { cp_contents += "<tr>"; }
		if (use_highlight) { var mo = 'onmouseover="'+windowref+'colorpicker_highlightcolor(\''+colors[i]+'\',window.document)"'; }
		else { mo = ""; }
		cp_contents += '<td style="background-color: '+colors[i]+';"><a href="javascript:void()" onclick="'+windowref+'colorpicker_pickcolor(\''+colors[i]+'\','+windowref+'window.popupwindowobjects['+cp.index+']);return false;" '+mo+'>&nbsp;</a></td>';
		if ( ((i+1)>=total) || (((i+1) % width) == 0)) {
			cp_contents += "</tr>";
			}
		}
	// if the browser supports dynamically changing td cells, add the fancy stuff
	if (document.getelementbyid) {
		var width1 = math.floor(width/2);
		var width2 = width = width1;
		cp_contents += "<tr><td colspan='"+width1+"' style='background-color: #fff;' id='colorpickerselectedcolor'>&nbsp;</td><td colspan='"+width2+"' style='text-align: center;' id='colorpickerselectedcolorvalue'>#ffffff</td></tr>";
		}
	cp_contents += "</table>";
	if (windowmode) {
		cp_contents += "</span></body></html>";
		}
	// end populate code

	// write the contents to the popup object
	cp.populate(cp_contents+"\n");
	// move the table down a bit so you can see it
	cp.offsety = 25;
	cp.autohide();
	return cp;
	}




