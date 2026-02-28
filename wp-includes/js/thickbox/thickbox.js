/*
 * thickbox 3.1 - one box to rule them all.
 * by cody lindley (http://www.codylindley.com)
 * copyright (c) 2007 cody lindley
 * licensed under the mit license: http://www.opensource.org/licenses/mit-license.php
*/

if ( typeof tb_pathtoimage != 'string' ) {
	var tb_pathtoimage = thickboxl10n.loadinganimation;
}

/*!!!!!!!!!!!!!!!!! edit below this line at your own risk !!!!!!!!!!!!!!!!!!!!!!!*/

//on page load call tb_init
jquery(document).ready(function(){
	tb_init('a.thickbox, area.thickbox, input.thickbox');//pass where to apply thickbox
	imgloader = new image();// preload image
	imgloader.src = tb_pathtoimage;
});

/*
 * add thickbox to href & area elements that have a class of .thickbox.
 * remove the loading indicator when content in an iframe has loaded.
 */
function tb_init(domchunk){
	jquery( 'body' )
		.on( 'click', domchunk, tb_click )
		.on( 'thickbox:iframe:loaded', function() {
			jquery( '#tb_window' ).removeclass( 'thickbox-loading' );
		});
}

function tb_click(){
	var t = this.title || this.name || null;
	var a = this.href || this.alt;
	var g = this.rel || false;
	tb_show(t,a,g);
	this.blur();
	return false;
}

function tb_show(caption, url, imagegroup) {//function called when the user clicks on a thickbox link

	var $closebtn;

	try {
		if (typeof document.body.style.maxheight === "undefined") {//if ie 6
			jquery("body","html").css({height: "100%", width: "100%"});
			jquery("html").css("overflow","hidden");
			if (document.getelementbyid("tb_hideselect") === null) {//iframe to hide select elements in ie6
				jquery("body").append("<iframe id='tb_hideselect'>"+thickboxl10n.noiframes+"</iframe><div id='tb_overlay'></div><div id='tb_window' class='thickbox-loading'></div>");
				jquery("#tb_overlay").on( 'click', tb_remove );
			}
		}else{//all others
			if(document.getelementbyid("tb_overlay") === null){
				jquery("body").append("<div id='tb_overlay'></div><div id='tb_window' class='thickbox-loading'></div>");
				jquery("#tb_overlay").on( 'click', tb_remove );
				jquery( 'body' ).addclass( 'modal-open' );
			}
		}

		if(tb_detectmacxff()){
			jquery("#tb_overlay").addclass("tb_overlaymacffbghack");//use png overlay so hide flash
		}else{
			jquery("#tb_overlay").addclass("tb_overlaybg");//use background and opacity
		}

		if(caption===null){caption="";}
		jquery("body").append("<div id='tb_load'><img src='"+imgloader.src+"' width='208' /></div>");//add loader to the page
		jquery('#tb_load').show();//show loader

		var baseurl;
	   if(url.indexof("?")!==-1){ //ff there is a query string involved
			baseurl = url.substr(0, url.indexof("?"));
	   }else{
	   		baseurl = url;
	   }

	   var urlstring = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$|\.webp$|\.avif$/;
	   var urltype = baseurl.tolowercase().match(urlstring);

		if(urltype == '.jpg' ||
			urltype == '.jpeg' ||
			urltype == '.png' ||
			urltype == '.gif' ||
			urltype == '.bmp' ||
			urltype == '.webp' ||
			urltype == '.avif'
		){//code to show images

			tb_prevcaption = "";
			tb_prevurl = "";
			tb_prevhtml = "";
			tb_nextcaption = "";
			tb_nexturl = "";
			tb_nexthtml = "";
			tb_imagecount = "";
			tb_foundurl = false;
			if(imagegroup){
				tb_temparray = jquery("a[rel="+imagegroup+"]").get();
				for (tb_counter = 0; ((tb_counter < tb_temparray.length) && (tb_nexthtml === "")); tb_counter++) {
					var urltypetemp = tb_temparray[tb_counter].href.tolowercase().match(urlstring);
						if (!(tb_temparray[tb_counter].href == url)) {
							if (tb_foundurl) {
								tb_nextcaption = tb_temparray[tb_counter].title;
								tb_nexturl = tb_temparray[tb_counter].href;
								tb_nexthtml = "<span id='tb_next'>&nbsp;&nbsp;<a href='#'>"+thickboxl10n.next+"</a></span>";
							} else {
								tb_prevcaption = tb_temparray[tb_counter].title;
								tb_prevurl = tb_temparray[tb_counter].href;
								tb_prevhtml = "<span id='tb_prev'>&nbsp;&nbsp;<a href='#'>"+thickboxl10n.prev+"</a></span>";
							}
						} else {
							tb_foundurl = true;
							tb_imagecount = thickboxl10n.image + ' ' + (tb_counter + 1) + ' ' + thickboxl10n.of + ' ' + (tb_temparray.length);
						}
				}
			}

			imgpreloader = new image();
			imgpreloader.onload = function(){
			imgpreloader.onload = null;

			// resizing large images - original by christian montoya edited by me.
			var pagesize = tb_getpagesize();
			var x = pagesize[0] - 150;
			var y = pagesize[1] - 150;
			var imagewidth = imgpreloader.width;
			var imageheight = imgpreloader.height;
			if (imagewidth > x) {
				imageheight = imageheight * (x / imagewidth);
				imagewidth = x;
				if (imageheight > y) {
					imagewidth = imagewidth * (y / imageheight);
					imageheight = y;
				}
			} else if (imageheight > y) {
				imagewidth = imagewidth * (y / imageheight);
				imageheight = y;
				if (imagewidth > x) {
					imageheight = imageheight * (x / imagewidth);
					imagewidth = x;
				}
			}
			// end resizing

			tb_width = imagewidth + 30;
			tb_height = imageheight + 60;
			jquery("#tb_window").append("<a href='' id='tb_imageoff'><span class='screen-reader-text'>"+thickboxl10n.close+"</span><img id='tb_image' src='"+url+"' width='"+imagewidth+"' height='"+imageheight+"' alt='"+caption+"'/></a>" + "<div id='tb_caption'>"+caption+"<div id='tb_secondline'>" + tb_imagecount + tb_prevhtml + tb_nexthtml + "</div></div><div id='tb_closewindow'><button type='button' id='tb_closewindowbutton'><span class='screen-reader-text'>"+thickboxl10n.close+"</span><span class='tb-close-icon' aria-hidden='true'></span></button></div>");

			jquery("#tb_closewindowbutton").on( 'click', tb_remove );

			if (!(tb_prevhtml === "")) {
				function goprev(){
					if(jquery(document).off("click",goprev)){jquery(document).off("click",goprev);}
					jquery("#tb_window").remove();
					jquery("body").append("<div id='tb_window'></div>");
					tb_show(tb_prevcaption, tb_prevurl, imagegroup);
					return false;
				}
				jquery("#tb_prev").on( 'click', goprev );
			}

			if (!(tb_nexthtml === "")) {
				function gonext(){
					jquery("#tb_window").remove();
					jquery("body").append("<div id='tb_window'></div>");
					tb_show(tb_nextcaption, tb_nexturl, imagegroup);
					return false;
				}
				jquery("#tb_next").on( 'click', gonext );

			}

			jquery(document).on('keydown.thickbox', function(e){
				if ( e.which == 27 ){ // close
					tb_remove();

				} else if ( e.which == 190 ){ // display previous image
					if(!(tb_nexthtml == "")){
						jquery(document).off('thickbox');
						gonext();
					}
				} else if ( e.which == 188 ){ // display next image
					if(!(tb_prevhtml == "")){
						jquery(document).off('thickbox');
						goprev();
					}
				}
				return false;
			});

			tb_position();
			jquery("#tb_load").remove();
			jquery("#tb_imageoff").on( 'click', tb_remove );
			jquery("#tb_window").css({'visibility':'visible'}); //for safari using css instead of show
			};

			imgpreloader.src = url;
		}else{//code to show html

			var querystring = url.replace(/^[^\?]+\??/,'');
			var params = tb_parsequery( querystring );

			tb_width = (params['width']*1) + 30 || 630; //defaults to 630 if no parameters were added to url
			tb_height = (params['height']*1) + 40 || 440; //defaults to 440 if no parameters were added to url
			ajaxcontentw = tb_width - 30;
			ajaxcontenth = tb_height - 45;

			if(url.indexof('tb_iframe') != -1){// either iframe or ajax window
					urlnoquery = url.split('tb_');
					jquery("#tb_iframecontent").remove();
					if(params['modal'] != "true"){//iframe no modal
						jquery("#tb_window").append("<div id='tb_title'><div id='tb_ajaxwindowtitle'>"+caption+"</div><div id='tb_closeajaxwindow'><button type='button' id='tb_closewindowbutton'><span class='screen-reader-text'>"+thickboxl10n.close+"</span><span class='tb-close-icon' aria-hidden='true'></span></button></div></div><iframe frameborder='0' hspace='0' allowtransparency='true' src='"+urlnoquery[0]+"' id='tb_iframecontent' name='tb_iframecontent"+math.round(math.random()*1000)+"' onload='tb_showiframe()' style='width:"+(ajaxcontentw + 29)+"px;height:"+(ajaxcontenth + 17)+"px;' >"+thickboxl10n.noiframes+"</iframe>");
					}else{//iframe modal
					jquery("#tb_overlay").off();
						jquery("#tb_window").append("<iframe frameborder='0' hspace='0' allowtransparency='true' src='"+urlnoquery[0]+"' id='tb_iframecontent' name='tb_iframecontent"+math.round(math.random()*1000)+"' onload='tb_showiframe()' style='width:"+(ajaxcontentw + 29)+"px;height:"+(ajaxcontenth + 17)+"px;'>"+thickboxl10n.noiframes+"</iframe>");
					}
			}else{// not an iframe, ajax
					if(jquery("#tb_window").css("visibility") != "visible"){
						if(params['modal'] != "true"){//ajax no modal
						jquery("#tb_window").append("<div id='tb_title'><div id='tb_ajaxwindowtitle'>"+caption+"</div><div id='tb_closeajaxwindow'><button type='button' id='tb_closewindowbutton'><span class='screen-reader-text'>"+thickboxl10n.close+"</span><span class='tb-close-icon' aria-hidden='true'></span></button></div></div><div id='tb_ajaxcontent' style='width:"+ajaxcontentw+"px;height:"+ajaxcontenth+"px'></div>");
						}else{//ajax modal
						jquery("#tb_overlay").off();
						jquery("#tb_window").append("<div id='tb_ajaxcontent' class='tb_modal' style='width:"+ajaxcontentw+"px;height:"+ajaxcontenth+"px;'></div>");
						}
					}else{//this means the window is already up, we are just loading new content via ajax
						jquery("#tb_ajaxcontent")[0].style.width = ajaxcontentw +"px";
						jquery("#tb_ajaxcontent")[0].style.height = ajaxcontenth +"px";
						jquery("#tb_ajaxcontent")[0].scrolltop = 0;
						jquery("#tb_ajaxwindowtitle").html(caption);
					}
			}

			jquery("#tb_closewindowbutton").on( 'click', tb_remove );

				if(url.indexof('tb_inline') != -1){
					jquery("#tb_ajaxcontent").append(jquery('#' + params['inlineid']).children());
					jquery("#tb_window").on('tb_unload', function () {
						jquery('#' + params['inlineid']).append( jquery("#tb_ajaxcontent").children() ); // move elements back when you're finished
					});
					tb_position();
					jquery("#tb_load").remove();
					jquery("#tb_window").css({'visibility':'visible'});
				}else if(url.indexof('tb_iframe') != -1){
					tb_position();
					jquery("#tb_load").remove();
					jquery("#tb_window").css({'visibility':'visible'});
				}else{
					var load_url = url;
					load_url += -1 === url.indexof('?') ? '?' : '&';
					jquery("#tb_ajaxcontent").load(load_url += "random=" + (new date().gettime()),function(){//to do a post change this load method
						tb_position();
						jquery("#tb_load").remove();
						tb_init("#tb_ajaxcontent a.thickbox");
						jquery("#tb_window").css({'visibility':'visible'});
					});
				}

		}

		if(!params['modal']){
			jquery(document).on('keydown.thickbox', function(e){
				if ( e.which == 27 ){ // close
					tb_remove();
					return false;
				}
			});
		}

		$closebtn = jquery( '#tb_closewindowbutton' );
		/*
		 * if the native close button icon is visible, move focus on the button
		 * (e.g. in the network admin themes screen).
		 * in other admin screens is hidden and replaced by a different icon.
		 */
		if ( $closebtn.find( '.tb-close-icon' ).is( ':visible' ) ) {
			$closebtn.trigger( 'focus' );
		}

	} catch(e) {
		//nothing here
	}
}

//helper functions below
function tb_showiframe(){
	jquery("#tb_load").remove();
	jquery("#tb_window").css({'visibility':'visible'}).trigger( 'thickbox:iframe:loaded' );
}

function tb_remove() {
 	jquery("#tb_imageoff").off("click");
	jquery("#tb_closewindowbutton").off("click");
	jquery( '#tb_window' ).fadeout( 'fast', function() {
		jquery( '#tb_window, #tb_overlay, #tb_hideselect' ).trigger( 'tb_unload' ).off().remove();
		jquery( 'body' ).trigger( 'thickbox:removed' );
	});
	jquery( 'body' ).removeclass( 'modal-open' );
	jquery("#tb_load").remove();
	if (typeof document.body.style.maxheight == "undefined") {//if ie 6
		jquery("body","html").css({height: "auto", width: "auto"});
		jquery("html").css("overflow","");
	}
	jquery(document).off('.thickbox');
	return false;
}

function tb_position() {
var isie6 = typeof document.body.style.maxheight === "undefined";
jquery("#tb_window").css({marginleft: '-' + parseint((tb_width / 2),10) + 'px', width: tb_width + 'px'});
	if ( ! isie6 ) { // take away ie6
		jquery("#tb_window").css({margintop: '-' + parseint((tb_height / 2),10) + 'px'});
	}
}

function tb_parsequery ( query ) {
   var params = {};
   if ( ! query ) {return params;}// return empty object
   var pairs = query.split(/[;&]/);
   for ( var i = 0; i < pairs.length; i++ ) {
      var keyval = pairs[i].split('=');
      if ( ! keyval || keyval.length != 2 ) {continue;}
      var key = unescape( keyval[0] );
      var val = unescape( keyval[1] );
      val = val.replace(/\+/g, ' ');
      params[key] = val;
   }
   return params;
}

function tb_getpagesize(){
	var de = document.documentelement;
	var w = window.innerwidth || self.innerwidth || (de&&de.clientwidth) || document.body.clientwidth;
	var h = window.innerheight || self.innerheight || (de&&de.clientheight) || document.body.clientheight;
	arraypagesize = [w,h];
	return arraypagesize;
}

function tb_detectmacxff() {
  var useragent = navigator.useragent.tolowercase();
  if (useragent.indexof('mac') != -1 && useragent.indexof('firefox')!=-1) {
    return true;
  }
}


