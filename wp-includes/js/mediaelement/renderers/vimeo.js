/*!
 * mediaelement.js
 * http://www.mediaelementjs.com/
 *
 * wrapper that mimics native html5 mediaelement (audio and video)
 * using a variety of technologies (pure javascript, flash, iframe)
 *
 * copyright 2010-2017, john dyer (http://j.hn/)
 * license: mit
 *
 */(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new error("cannot find module '"+o+"'");throw f.code="module_not_found",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(_dereq_,module,exports){
'use strict';

var vimeoapi = {

	promise: null,

	load: function load(settings) {

		if (typeof vimeo !== 'undefined') {
			vimeoapi._createplayer(settings);
		} else {
			vimeoapi.promise = vimeoapi.promise || mejs.utils.loadscript('https://player.vimeo.com/api/player.js');
			vimeoapi.promise.then(function () {
				vimeoapi._createplayer(settings);
			});
		}
	},

	_createplayer: function _createplayer(settings) {
		var player = new vimeo.player(settings.iframe);
		window['__ready__' + settings.id](player);
	},

	getvimeoid: function getvimeoid(url) {
		if (url == null) {
			return null;
		}

		var parts = url.split('?');
		url = parts[0];

		var playerlinkmatch = url.match(/https:\/\/player.vimeo.com\/video\/(\d+)$/);
		if (playerlinkmatch) {
			return parseint(playerlinkmatch[1], 10);
		}

		var vimeolinkmatch = url.match(/https:\/\/vimeo.com\/(\d+)$/);
		if (vimeolinkmatch) {
			return parseint(vimeolinkmatch[1], 10);
		}

		var privatevimeolinkmatch = url.match(/https:\/\/vimeo.com\/(\d+)\/\w+$/);
		if (privatevimeolinkmatch) {
			return parseint(privatevimeolinkmatch[1], 10);
		}

		return nan;
	}
};

var vimeoiframerenderer = {

	name: 'vimeo_iframe',
	options: {
		prefix: 'vimeo_iframe'
	},

	canplaytype: function canplaytype(type) {
		return ~['video/vimeo', 'video/x-vimeo'].indexof(type.tolowercase());
	},

	create: function create(mediaelement, options, mediafiles) {
		var apistack = [],
		    vimeo = {},
		    readystate = 4;

		var paused = true,
		    volume = 1,
		    oldvolume = volume,
		    currenttime = 0,
		    bufferedtime = 0,
		    ended = false,
		    duration = 0,
		    vimeoplayer = null,
		    url = '';

		vimeo.options = options;
		vimeo.id = mediaelement.id + '_' + options.prefix;
		vimeo.mediaelement = mediaelement;

		var errorhandler = function errorhandler(error) {
			mediaelement.generateerror('code ' + error.name + ': ' + error.message, mediafiles);
		};

		var props = mejs.html5media.properties,
		    assigngetterssetters = function assigngetterssetters(propname) {

			var capname = '' + propname.substring(0, 1).touppercase() + propname.substring(1);

			vimeo['get' + capname] = function () {
				if (vimeoplayer !== null) {
					var value = null;

					switch (propname) {
						case 'currenttime':
							return currenttime;
						case 'duration':
							return duration;
						case 'volume':
							return volume;
						case 'muted':
							return volume === 0;
						case 'paused':
							return paused;
						case 'ended':
							return ended;
						case 'src':
							vimeoplayer.getvideourl().then(function (_url) {
								url = _url;
							}).catch(function (error) {
								return errorhandler(error);
							});
							return url;
						case 'buffered':
							return {
								start: function start() {
									return 0;
								},
								end: function end() {
									return bufferedtime * duration;
								},
								length: 1
							};
						case 'readystate':
							return readystate;
					}
					return value;
				} else {
					return null;
				}
			};

			vimeo['set' + capname] = function (value) {
				if (vimeoplayer !== null) {
					switch (propname) {
						case 'src':
							var _url2 = typeof value === 'string' ? value : value[0].src,
							    videoid = vimeoapi.getvimeoid(_url2);

							vimeoplayer.loadvideo(videoid).then(function () {
								if (mediaelement.originalnode.autoplay) {
									vimeoplayer.play();
								}
							}).catch(function (error) {
								return errorhandler(error);
							});
							break;
						case 'currenttime':
							vimeoplayer.setcurrenttime(value).then(function () {
								currenttime = value;
								settimeout(function () {
									var event = mejs.utils.createevent('timeupdate', vimeo);
									mediaelement.dispatchevent(event);
								}, 50);
							}).catch(function (error) {
								return errorhandler(error);
							});
							break;
						case 'volume':
							vimeoplayer.setvolume(value).then(function () {
								volume = value;
								oldvolume = volume;
								settimeout(function () {
									var event = mejs.utils.createevent('volumechange', vimeo);
									mediaelement.dispatchevent(event);
								}, 50);
							}).catch(function (error) {
								return errorhandler(error);
							});
							break;
						case 'loop':
							vimeoplayer.setloop(value).catch(function (error) {
								return errorhandler(error);
							});
							break;
						case 'muted':
							if (value) {
								vimeoplayer.setvolume(0).then(function () {
									volume = 0;
									settimeout(function () {
										var event = mejs.utils.createevent('volumechange', vimeo);
										mediaelement.dispatchevent(event);
									}, 50);
								}).catch(function (error) {
									return errorhandler(error);
								});
							} else {
								vimeoplayer.setvolume(oldvolume).then(function () {
									volume = oldvolume;
									settimeout(function () {
										var event = mejs.utils.createevent('volumechange', vimeo);
										mediaelement.dispatchevent(event);
									}, 50);
								}).catch(function (error) {
									return errorhandler(error);
								});
							}
							break;
						case 'readystate':
							var event = mejs.utils.createevent('canplay', vimeo);
							mediaelement.dispatchevent(event);
							break;
						default:
							
							break;
					}
				} else {
					apistack.push({ type: 'set', propname: propname, value: value });
				}
			};
		};

		for (var i = 0, total = props.length; i < total; i++) {
			assigngetterssetters(props[i]);
		}

		var methods = mejs.html5media.methods,
		    assignmethods = function assignmethods(methodname) {
			vimeo[methodname] = function () {
				if (vimeoplayer !== null) {
					switch (methodname) {
						case 'play':
							paused = false;
							return vimeoplayer.play();
						case 'pause':
							paused = true;
							return vimeoplayer.pause();
						case 'load':
							return null;
					}
				} else {
					apistack.push({ type: 'call', methodname: methodname });
				}
			};
		};

		for (var _i = 0, _total = methods.length; _i < _total; _i++) {
			assignmethods(methods[_i]);
		}

		window['__ready__' + vimeo.id] = function (_vimeoplayer) {

			mediaelement.vimeoplayer = vimeoplayer = _vimeoplayer;

			if (apistack.length) {
				for (var _i2 = 0, _total2 = apistack.length; _i2 < _total2; _i2++) {
					var stackitem = apistack[_i2];

					if (stackitem.type === 'set') {
						var propname = stackitem.propname,
						    capname = '' + propname.substring(0, 1).touppercase() + propname.substring(1);

						vimeo['set' + capname](stackitem.value);
					} else if (stackitem.type === 'call') {
						vimeo[stackitem.methodname]();
					}
				}
			}

			if (mediaelement.originalnode.muted) {
				vimeoplayer.setvolume(0);
				volume = 0;
			}

			var vimeoiframe = document.getelementbyid(vimeo.id);
			var events = void 0;

			events = ['mouseover', 'mouseout'];

			var assignevents = function assignevents(e) {
				var event = mejs.utils.createevent(e.type, vimeo);
				mediaelement.dispatchevent(event);
			};

			for (var _i3 = 0, _total3 = events.length; _i3 < _total3; _i3++) {
				vimeoiframe.addeventlistener(events[_i3], assignevents, false);
			}

			vimeoplayer.on('loaded', function () {
				vimeoplayer.getduration().then(function (loadprogress) {
					duration = loadprogress;
					if (duration > 0) {
						bufferedtime = duration * loadprogress;
						if (mediaelement.originalnode.autoplay) {
							paused = false;
							ended = false;
							var event = mejs.utils.createevent('play', vimeo);
							mediaelement.dispatchevent(event);
						}
					}
				}).catch(function (error) {
					errorhandler(error, vimeo);
				});
			});
			vimeoplayer.on('progress', function () {
				vimeoplayer.getduration().then(function (loadprogress) {
					duration = loadprogress;

					if (duration > 0) {
						bufferedtime = duration * loadprogress;
						if (mediaelement.originalnode.autoplay) {
							var initevent = mejs.utils.createevent('play', vimeo);
							mediaelement.dispatchevent(initevent);

							var playingevent = mejs.utils.createevent('playing', vimeo);
							mediaelement.dispatchevent(playingevent);
						}
					}

					var event = mejs.utils.createevent('progress', vimeo);
					mediaelement.dispatchevent(event);
				}).catch(function (error) {
					return errorhandler(error);
				});
			});
			vimeoplayer.on('timeupdate', function () {
				vimeoplayer.getcurrenttime().then(function (seconds) {
					currenttime = seconds;
					var event = mejs.utils.createevent('timeupdate', vimeo);
					mediaelement.dispatchevent(event);
				}).catch(function (error) {
					return errorhandler(error);
				});
			});
			vimeoplayer.on('play', function () {
				paused = false;
				ended = false;
				var event = mejs.utils.createevent('play', vimeo);
				mediaelement.dispatchevent(event);

				var playingevent = mejs.utils.createevent('playing', vimeo);
				mediaelement.dispatchevent(playingevent);
			});
			vimeoplayer.on('pause', function () {
				paused = true;
				ended = false;

				var event = mejs.utils.createevent('pause', vimeo);
				mediaelement.dispatchevent(event);
			});
			vimeoplayer.on('ended', function () {
				paused = false;
				ended = true;

				var event = mejs.utils.createevent('ended', vimeo);
				mediaelement.dispatchevent(event);
			});

			events = ['rendererready', 'loadedmetadata', 'loadeddata', 'canplay'];

			for (var _i4 = 0, _total4 = events.length; _i4 < _total4; _i4++) {
				var event = mejs.utils.createevent(events[_i4], vimeo);
				mediaelement.dispatchevent(event);
			}
		};

		var height = mediaelement.originalnode.height,
		    width = mediaelement.originalnode.width,
		    vimeocontainer = document.createelement('iframe'),
		    standardurl = 'https://player.vimeo.com/video/' + vimeoapi.getvimeoid(mediafiles[0].src);

		var queryargs = ~mediafiles[0].src.indexof('?') ? '?' + mediafiles[0].src.slice(mediafiles[0].src.indexof('?') + 1) : '';
		var args = [];

		if (mediaelement.originalnode.autoplay && queryargs.indexof('autoplay') === -1) {
			args.push('autoplay=1');
		}
		if (mediaelement.originalnode.loop && queryargs.indexof('loop') === -1) {
			args.push('loop=1');
		}

		queryargs = '' + queryargs + (queryargs ? '&' : '?') + args.join('&');

		vimeocontainer.setattribute('id', vimeo.id);
		vimeocontainer.setattribute('width', width);
		vimeocontainer.setattribute('height', height);
		vimeocontainer.setattribute('frameborder', '0');
		vimeocontainer.setattribute('src', '' + standardurl + queryargs);
		vimeocontainer.setattribute('webkitallowfullscreen', 'true');
		vimeocontainer.setattribute('mozallowfullscreen', 'true');
		vimeocontainer.setattribute('allowfullscreen', 'true');
		vimeocontainer.setattribute('allow', 'autoplay');

		mediaelement.originalnode.parentnode.insertbefore(vimeocontainer, mediaelement.originalnode);
		mediaelement.originalnode.style.display = 'none';

		vimeoapi.load({
			iframe: vimeocontainer,
			id: vimeo.id
		});

		vimeo.hide = function () {
			vimeo.pause();
			if (vimeoplayer) {
				vimeocontainer.style.display = 'none';
			}
		};
		vimeo.setsize = function (width, height) {
			vimeocontainer.setattribute('width', width);
			vimeocontainer.setattribute('height', height);
		};
		vimeo.show = function () {
			if (vimeoplayer) {
				vimeocontainer.style.display = '';
			}
		};

		vimeo.destroy = function () {};

		return vimeo;
	}
};

mejs.utils.typechecks.push(function (url) {
	return (/(\/\/player\.vimeo|vimeo\.com)/i.test(url) ? 'video/x-vimeo' : null
	);
});

mejs.renderers.add(vimeoiframerenderer);

},{}]},{},[1]);


