/*!
 * jquery form plugin
 * version: 4.3.0
 * requires jquery v1.7.2 or later
 * project repository: https://github.com/jquery-form/form

 * copyright 2017 kevin morris
 * copyright 2006 m. alsup

 * dual licensed under the lgpl-2.1+ or mit licenses
 * https://github.com/jquery-form/form#license

 * this library is free software; you can redistribute it and/or
 * modify it under the terms of the gnu lesser general public
 * license as published by the free software foundation; either
 * version 2.1 of the license, or (at your option) any later version.
 * this library is distributed in the hope that it will be useful,
 * but without any warranty; without even the implied warranty of
 * merchantability or fitness for a particular purpose.  see the gnu
 * lesser general public license for more details.
 */
/* global activexobject */

/* eslint-disable */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// amd. register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// node/commonjs
		module.exports = function( root, jquery ) {
			if (typeof jquery === 'undefined') {
				// require('jquery') returns a factory that requires window to build a jquery instance, we normalize how we use modules
				// that require this pattern but the window provided is a noop if it's defined (how jquery works)
				if (typeof window !== 'undefined') {
					jquery = require('jquery');
				}
				else {
					jquery = require('jquery')(root);
				}
			}
			factory(jquery);
			return jquery;
		};
	} else {
		// browser globals
		factory(jquery);
	}

}(function ($) {
/* eslint-enable */
	'use strict';

	/*
		usage note:
		-----------
		do not use both ajaxsubmit and ajaxform on the same form. these
		functions are mutually exclusive. use ajaxsubmit if you want
		to bind your own submit handler to the form. for example,

		$(document).ready(function() {
			$('#myform').on('submit', function(e) {
				e.preventdefault(); // <-- important
				$(this).ajaxsubmit({
					target: '#output'
				});
			});
		});

		use ajaxform when you want the plugin to manage all the event binding
		for you. for example,

		$(document).ready(function() {
			$('#myform').ajaxform({
				target: '#output'
			});
		});

		you can also use ajaxform with delegation (requires jquery v1.7+), so the
		form does not have to exist when you invoke ajaxform:

		$('#myform').ajaxform({
			delegation: true,
			target: '#output'
		});

		when using ajaxform, the ajaxsubmit function will be invoked for you
		at the appropriate time.
	*/

	var rcrlf = /\r?\n/g;

	/**
	 * feature detection
	 */
	var feature = {};

	feature.fileapi = $('<input type="file">').get(0).files !== undefined;
	feature.formdata = (typeof window.formdata !== 'undefined');

	var hasprop = !!$.fn.prop;

	// attr2 uses prop when it can but checks the return type for
	// an expected string. this accounts for the case where a form
	// contains inputs with names like "action" or "method"; in those
	// cases "prop" returns the element
	$.fn.attr2 = function() {
		if (!hasprop) {
			return this.attr.apply(this, arguments);
		}

		var val = this.prop.apply(this, arguments);

		if ((val && val.jquery) || typeof val === 'string') {
			return val;
		}

		return this.attr.apply(this, arguments);
	};

	/**
	 * ajaxsubmit() provides a mechanism for immediately submitting
	 * an html form using ajax.
	 *
	 * @param	{object|string}	options		jquery.form.js parameters or custom url for submission
	 * @param	{object}		data		extradata
	 * @param	{string}		datatype	ajax datatype
	 * @param	{function}		onsuccess	ajax success callback function
	 */
	$.fn.ajaxsubmit = function(options, data, datatype, onsuccess) {
		// fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
		if (!this.length) {
			log('ajaxsubmit: skipping submit process - no element selected');

			return this;
		}

		/* eslint consistent-this: ["error", "$form"] */
		var method, action, url, ismsie, iframesrc, $form = this;

		if (typeof options === 'function') {
			options = {success: options};

		} else if (typeof options === 'string' || (options === false && arguments.length > 0)) {
			options = {
				'url'      : options,
				'data'     : data,
				'datatype' : datatype
			};

			if (typeof onsuccess === 'function') {
				options.success = onsuccess;
			}

		} else if (typeof options === 'undefined') {
			options = {};
		}

		method = options.method || options.type || this.attr2('method');
		action = options.url || this.attr2('action');

		url = (typeof action === 'string') ? $.trim(action) : '';
		url = url || window.location.href || '';
		if (url) {
			// clean url (don't include hash vaue)
			url = (url.match(/^([^#]+)/) || [])[1];
		}
		// ie requires javascript:false in https, but this breaks chrome >83 and goes against spec.
		// instead of using javascript:false always, let's only apply it for ie.
		ismsie = /(msie|trident)/.test(navigator.useragent || '');
		iframesrc = (ismsie && /^https/i.test(window.location.href || '')) ? 'javascript:false' : 'about:blank'; // eslint-disable-line no-script-url

		options = $.extend(true, {
			url       : url,
			success   : $.ajaxsettings.success,
			type      : method || $.ajaxsettings.type,
			iframesrc : iframesrc
		}, options);

		// hook for manipulating the form data before it is extracted;
		// convenient for use with rich editors like tinymce or fckeditor
		var veto = {};

		this.trigger('form-pre-serialize', [this, options, veto]);

		if (veto.veto) {
			log('ajaxsubmit: submit vetoed via form-pre-serialize trigger');

			return this;
		}

		// provide opportunity to alter form data before it is serialized
		if (options.beforeserialize && options.beforeserialize(this, options) === false) {
			log('ajaxsubmit: submit aborted via beforeserialize callback');

			return this;
		}

		var traditional = options.traditional;

		if (typeof traditional === 'undefined') {
			traditional = $.ajaxsettings.traditional;
		}

		var elements = [];
		var qx, a = this.formtoarray(options.semantic, elements, options.filtering);

		if (options.data) {
			var optionsdata = $.isfunction(options.data) ? options.data(a) : options.data;

			options.extradata = optionsdata;
			qx = $.param(optionsdata, traditional);
		}

		// give pre-submit callback an opportunity to abort the submit
		if (options.beforesubmit && options.beforesubmit(a, this, options) === false) {
			log('ajaxsubmit: submit aborted via beforesubmit callback');

			return this;
		}

		// fire vetoable 'validate' event
		this.trigger('form-submit-validate', [a, this, options, veto]);
		if (veto.veto) {
			log('ajaxsubmit: submit vetoed via form-submit-validate trigger');

			return this;
		}

		var q = $.param(a, traditional);

		if (qx) {
			q = (q ? (q + '&' + qx) : qx);
		}

		if (options.type.touppercase() === 'get') {
			options.url += (options.url.indexof('?') >= 0 ? '&' : '?') + q;
			options.data = null;	// data is null for 'get'
		} else {
			options.data = q;		// data is the query string for 'post'
		}

		var callbacks = [];

		if (options.resetform) {
			callbacks.push(function() {
				$form.resetform();
			});
		}

		if (options.clearform) {
			callbacks.push(function() {
				$form.clearform(options.includehidden);
			});
		}

		// perform a load on the target only if datatype is not provided
		if (!options.datatype && options.target) {
			var oldsuccess = options.success || function(){};

			callbacks.push(function(data, textstatus, jqxhr) {
				var successarguments = arguments,
					fn = options.replacetarget ? 'replacewith' : 'html';

				$(options.target)[fn](data).each(function(){
					oldsuccess.apply(this, successarguments);
				});
			});

		} else if (options.success) {
			if ($.isarray(options.success)) {
				$.merge(callbacks, options.success);
			} else {
				callbacks.push(options.success);
			}
		}

		options.success = function(data, status, xhr) { // jquery 1.4+ passes xhr as 3rd arg
			var context = options.context || this;		// jquery 1.4+ supports scope context

			for (var i = 0, max = callbacks.length; i < max; i++) {
				callbacks[i].apply(context, [data, status, xhr || $form, $form]);
			}
		};

		if (options.error) {
			var olderror = options.error;

			options.error = function(xhr, status, error) {
				var context = options.context || this;

				olderror.apply(context, [xhr, status, error, $form]);
			};
		}

		if (options.complete) {
			var oldcomplete = options.complete;

			options.complete = function(xhr, status) {
				var context = options.context || this;

				oldcomplete.apply(context, [xhr, status, $form]);
			};
		}

		// are there files to upload?

		// [value] (issue #113), also see comment:
		// https://github.com/malsup/form/commit/588306aedba1de01388032d5f42a60159eea9228#commitcomment-2180219
		var fileinputs = $('input[type=file]:enabled', this).filter(function() {
			return $(this).val() !== '';
		});
		var hasfileinputs = fileinputs.length > 0;
		var mp = 'multipart/form-data';
		var multipart = ($form.attr('enctype') === mp || $form.attr('encoding') === mp);
		var fileapi = feature.fileapi && feature.formdata;

		log('fileapi :' + fileapi);

		var shoulduseframe = (hasfileinputs || multipart) && !fileapi;
		var jqxhr;

		// options.iframe allows user to force iframe mode
		// 06-nov-09: now defaulting to iframe mode if file input is detected
		if (options.iframe !== false && (options.iframe || shoulduseframe)) {
			// hack to fix safari hang (thanks to tim molendijk for this)
			// see: http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
			if (options.closekeepalive) {
				$.get(options.closekeepalive, function() {
					jqxhr = fileuploadiframe(a);
				});

			} else {
				jqxhr = fileuploadiframe(a);
			}

		} else if ((hasfileinputs || multipart) && fileapi) {
			jqxhr = fileuploadxhr(a);

		} else {
			jqxhr = $.ajax(options);
		}

		$form.removedata('jqxhr').data('jqxhr', jqxhr);

		// clear element array
		for (var k = 0; k < elements.length; k++) {
			elements[k] = null;
		}

		// fire 'notify' event
		this.trigger('form-submit-notify', [this, options]);

		return this;

		// utility fn for deep serialization
		function deepserialize(extradata) {
			var serialized = $.param(extradata, options.traditional).split('&');
			var len = serialized.length;
			var result = [];
			var i, part;

			for (i = 0; i < len; i++) {
				// #252; undo param space replacement
				serialized[i] = serialized[i].replace(/\+/g, ' ');
				part = serialized[i].split('=');
				// #278; use array instead of object storage, favoring array serializations
				result.push([decodeuricomponent(part[0]), decodeuricomponent(part[1])]);
			}

			return result;
		}

		// xmlhttprequest level 2 file uploads (big hat tip to francois2metz)
		function fileuploadxhr(a) {
			var formdata = new formdata();

			for (var i = 0; i < a.length; i++) {
				formdata.append(a[i].name, a[i].value);
			}

			if (options.extradata) {
				var serializeddata = deepserialize(options.extradata);

				for (i = 0; i < serializeddata.length; i++) {
					if (serializeddata[i]) {
						formdata.append(serializeddata[i][0], serializeddata[i][1]);
					}
				}
			}

			options.data = null;

			var s = $.extend(true, {}, $.ajaxsettings, options, {
				contenttype : false,
				processdata : false,
				cache       : false,
				type        : method || 'post'
			});

			if (options.uploadprogress) {
				// workaround because jqxhr does not expose upload property
				s.xhr = function() {
					var xhr = $.ajaxsettings.xhr();

					if (xhr.upload) {
						xhr.upload.addeventlistener('progress', function(event) {
							var percent = 0;
							var position = event.loaded || event.position;			/* event.position is deprecated */
							var total = event.total;

							if (event.lengthcomputable) {
								percent = math.ceil(position / total * 100);
							}

							options.uploadprogress(event, position, total, percent);
						}, false);
					}

					return xhr;
				};
			}

			s.data = null;

			var beforesend = s.beforesend;

			s.beforesend = function(xhr, o) {
				// send formdata() provided by user
				if (options.formdata) {
					o.data = options.formdata;
				} else {
					o.data = formdata;
				}

				if (beforesend) {
					beforesend.call(this, xhr, o);
				}
			};

			return $.ajax(s);
		}

		// private function for handling file uploads (hat tip to yahoo!)
		function fileuploadiframe(a) {
			var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedout, timeouthandle;
			var deferred = $.deferred();

			// #341
			deferred.abort = function(status) {
				xhr.abort(status);
			};

			if (a) {
				// ensure that every serialized input is still enabled
				for (i = 0; i < elements.length; i++) {
					el = $(elements[i]);
					if (hasprop) {
						el.prop('disabled', false);
					} else {
						el.removeattr('disabled');
					}
				}
			}

			s = $.extend(true, {}, $.ajaxsettings, options);
			s.context = s.context || s;
			id = 'jqformio' + new date().gettime();
			var ownerdocument = form.ownerdocument;
			var $body = $form.closest('body');

			if (s.iframetarget) {
				$io = $(s.iframetarget, ownerdocument);
				n = $io.attr2('name');
				if (!n) {
					$io.attr2('name', id);
				} else {
					id = n;
				}

			} else {
				$io = $('<iframe name="' + id + '" src="' + s.iframesrc + '" />', ownerdocument);
				$io.css({position: 'absolute', top: '-1000px', left: '-1000px'});
			}
			io = $io[0];


			xhr = { // mock object
				aborted               : 0,
				responsetext          : null,
				responsexml           : null,
				status                : 0,
				statustext            : 'n/a',
				getallresponseheaders : function() {},
				getresponseheader     : function() {},
				setrequestheader      : function() {},
				abort                 : function(status) {
					var e = (status === 'timeout' ? 'timeout' : 'aborted');

					log('aborting upload... ' + e);
					this.aborted = 1;

					try { // #214, #257
						if (io.contentwindow.document.execcommand) {
							io.contentwindow.document.execcommand('stop');
						}
					} catch (ignore) {}

					$io.attr('src', s.iframesrc); // abort op in progress
					xhr.error = e;
					if (s.error) {
						s.error.call(s.context, xhr, e, status);
					}

					if (g) {
						$.event.trigger('ajaxerror', [xhr, s, e]);
					}

					if (s.complete) {
						s.complete.call(s.context, xhr, e);
					}
				}
			};

			g = s.global;
			// trigger ajax global events so that activity/block indicators work like normal
			if (g && $.active++ === 0) {
				$.event.trigger('ajaxstart');
			}
			if (g) {
				$.event.trigger('ajaxsend', [xhr, s]);
			}

			if (s.beforesend && s.beforesend.call(s.context, xhr, s) === false) {
				if (s.global) {
					$.active--;
				}
				deferred.reject();

				return deferred;
			}

			if (xhr.aborted) {
				deferred.reject();

				return deferred;
			}

			// add submitting element to data if we know it
			sub = form.clk;
			if (sub) {
				n = sub.name;
				if (n && !sub.disabled) {
					s.extradata = s.extradata || {};
					s.extradata[n] = sub.value;
					if (sub.type === 'image') {
						s.extradata[n + '.x'] = form.clk_x;
						s.extradata[n + '.y'] = form.clk_y;
					}
				}
			}

			var client_timeout_abort = 1;
			var server_abort = 2;

			function getdoc(frame) {
				/* it looks like contentwindow or contentdocument do not
				 * carry the protocol property in ie8, when running under ssl
				 * frame.document is the only valid response document, since
				 * the protocol is know but not on the other two objects. strange?
				 * "same origin policy" http://en.wikipedia.org/wiki/same_origin_policy
				 */

				var doc = null;

				// ie8 cascading access check
				try {
					if (frame.contentwindow) {
						doc = frame.contentwindow.document;
					}
				} catch (err) {
					// ie8 access denied under ssl & missing protocol
					log('cannot get iframe.contentwindow document: ' + err);
				}

				if (doc) { // successful getting content
					return doc;
				}

				try { // simply checking may throw in ie8 under ssl or mismatched protocol
					doc = frame.contentdocument ? frame.contentdocument : frame.document;
				} catch (err) {
					// last attempt
					log('cannot get iframe.contentdocument: ' + err);
					doc = frame.document;
				}

				return doc;
			}

			// rails csrf hack (thanks to yvan barthelemy)
			var csrf_token = $('meta[name=csrf-token]').attr('content');
			var csrf_param = $('meta[name=csrf-param]').attr('content');

			if (csrf_param && csrf_token) {
				s.extradata = s.extradata || {};
				s.extradata[csrf_param] = csrf_token;
			}

			// take a breath so that pending repaints get some cpu time before the upload starts
			function dosubmit() {
				// make sure form attrs are set
				var t = $form.attr2('target'),
					a = $form.attr2('action'),
					mp = 'multipart/form-data',
					et = $form.attr('enctype') || $form.attr('encoding') || mp;

				// update form attrs in ie friendly way
				form.setattribute('target', id);
				if (!method || /post/i.test(method)) {
					form.setattribute('method', 'post');
				}
				if (a !== s.url) {
					form.setattribute('action', s.url);
				}

				// ie borks in some cases when setting encoding
				if (!s.skipencodingoverride && (!method || /post/i.test(method))) {
					$form.attr({
						encoding : 'multipart/form-data',
						enctype  : 'multipart/form-data'
					});
				}

				// support timout
				if (s.timeout) {
					timeouthandle = settimeout(function() {
						timedout = true; cb(client_timeout_abort);
					}, s.timeout);
				}

				// look for server aborts
				function checkstate() {
					try {
						var state = getdoc(io).readystate;

						log('state = ' + state);
						if (state && state.tolowercase() === 'uninitialized') {
							settimeout(checkstate, 50);
						}

					} catch (e) {
						log('server abort: ', e, ' (', e.name, ')');
						cb(server_abort);				// eslint-disable-line callback-return
						if (timeouthandle) {
							cleartimeout(timeouthandle);
						}
						timeouthandle = undefined;
					}
				}

				// add "extra" data to form if provided in options
				var extrainputs = [];

				try {
					if (s.extradata) {
						for (var n in s.extradata) {
							if (s.extradata.hasownproperty(n)) {
								// if using the $.param format that allows for multiple values with the same name
								if ($.isplainobject(s.extradata[n]) && s.extradata[n].hasownproperty('name') && s.extradata[n].hasownproperty('value')) {
									extrainputs.push(
										$('<input type="hidden" name="' + s.extradata[n].name + '">', ownerdocument).val(s.extradata[n].value)
											.appendto(form)[0]);
								} else {
									extrainputs.push(
										$('<input type="hidden" name="' + n + '">', ownerdocument).val(s.extradata[n])
											.appendto(form)[0]);
								}
							}
						}
					}

					if (!s.iframetarget) {
						// add iframe to doc and submit the form
						$io.appendto($body);
					}

					if (io.attachevent) {
						io.attachevent('onload', cb);
					} else {
						io.addeventlistener('load', cb, false);
					}

					settimeout(checkstate, 15);

					try {
						form.submit();

					} catch (err) {
						// just in case form has element with name/id of 'submit'
						var submitfn = document.createelement('form').submit;

						submitfn.apply(form);
					}

				} finally {
					// reset attrs and remove "extra" input elements
					form.setattribute('action', a);
					form.setattribute('enctype', et); // #380
					if (t) {
						form.setattribute('target', t);
					} else {
						$form.removeattr('target');
					}
					$(extrainputs).remove();
				}
			}

			if (s.forcesync) {
				dosubmit();
			} else {
				settimeout(dosubmit, 10); // this lets dom updates render
			}

			var data, doc, domcheckcount = 50, callbackprocessed;

			function cb(e) {
				if (xhr.aborted || callbackprocessed) {
					return;
				}

				doc = getdoc(io);
				if (!doc) {
					log('cannot access response document');
					e = server_abort;
				}
				if (e === client_timeout_abort && xhr) {
					xhr.abort('timeout');
					deferred.reject(xhr, 'timeout');

					return;

				}
				if (e === server_abort && xhr) {
					xhr.abort('server abort');
					deferred.reject(xhr, 'error', 'server abort');

					return;
				}

				if (!doc || doc.location.href === s.iframesrc) {
					// response not received yet
					if (!timedout) {
						return;
					}
				}

				if (io.detachevent) {
					io.detachevent('onload', cb);
				} else {
					io.removeeventlistener('load', cb, false);
				}

				var status = 'success', errmsg;

				try {
					if (timedout) {
						throw 'timeout';
					}

					var isxml = s.datatype === 'xml' || doc.xmldocument || $.isxmldoc(doc);

					log('isxml=' + isxml);

					if (!isxml && window.opera && (doc.body === null || !doc.body.innerhtml)) {
						if (--domcheckcount) {
							// in some browsers (opera) the iframe dom is not always traversable when
							// the onload callback fires, so we loop a bit to accommodate
							log('requeing onload callback, dom not available');
							settimeout(cb, 250);

							return;
						}
						// let this fall through because server response could be an empty document
						// log('could not access iframe dom after mutiple tries.');
						// throw 'domexception: not available';
					}

					// log('response detected');
					var docroot = doc.body ? doc.body : doc.documentelement;

					xhr.responsetext = docroot ? docroot.innerhtml : null;
					xhr.responsexml = doc.xmldocument ? doc.xmldocument : doc;
					if (isxml) {
						s.datatype = 'xml';
					}
					xhr.getresponseheader = function(header){
						var headers = {'content-type': s.datatype};

						return headers[header.tolowercase()];
					};
					// support for xhr 'status' & 'statustext' emulation :
					if (docroot) {
						xhr.status = number(docroot.getattribute('status')) || xhr.status;
						xhr.statustext = docroot.getattribute('statustext') || xhr.statustext;
					}

					var dt = (s.datatype || '').tolowercase();
					var scr = /(json|script|text)/.test(dt);

					if (scr || s.textarea) {
						// see if user embedded response in textarea
						var ta = doc.getelementsbytagname('textarea')[0];

						if (ta) {
							xhr.responsetext = ta.value;
							// support for xhr 'status' & 'statustext' emulation :
							xhr.status = number(ta.getattribute('status')) || xhr.status;
							xhr.statustext = ta.getattribute('statustext') || xhr.statustext;

						} else if (scr) {
							// account for browsers injecting pre around json response
							var pre = doc.getelementsbytagname('pre')[0];
							var b = doc.getelementsbytagname('body')[0];

							if (pre) {
								xhr.responsetext = pre.textcontent ? pre.textcontent : pre.innertext;
							} else if (b) {
								xhr.responsetext = b.textcontent ? b.textcontent : b.innertext;
							}
						}

					} else if (dt === 'xml' && !xhr.responsexml && xhr.responsetext) {
						xhr.responsexml = toxml(xhr.responsetext);			// eslint-disable-line no-use-before-define
					}

					try {
						data = httpdata(xhr, dt, s);						// eslint-disable-line no-use-before-define

					} catch (err) {
						status = 'parsererror';
						xhr.error = errmsg = (err || status);
					}

				} catch (err) {
					log('error caught: ', err);
					status = 'error';
					xhr.error = errmsg = (err || status);
				}

				if (xhr.aborted) {
					log('upload aborted');
					status = null;
				}

				if (xhr.status) { // we've set xhr.status
					status = ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) ? 'success' : 'error';
				}

				// ordering of these callbacks/triggers is odd, but that's how $.ajax does it
				if (status === 'success') {
					if (s.success) {
						s.success.call(s.context, data, 'success', xhr);
					}

					deferred.resolve(xhr.responsetext, 'success', xhr);

					if (g) {
						$.event.trigger('ajaxsuccess', [xhr, s]);
					}

				} else if (status) {
					if (typeof errmsg === 'undefined') {
						errmsg = xhr.statustext;
					}
					if (s.error) {
						s.error.call(s.context, xhr, status, errmsg);
					}
					deferred.reject(xhr, 'error', errmsg);
					if (g) {
						$.event.trigger('ajaxerror', [xhr, s, errmsg]);
					}
				}

				if (g) {
					$.event.trigger('ajaxcomplete', [xhr, s]);
				}

				if (g && !--$.active) {
					$.event.trigger('ajaxstop');
				}

				if (s.complete) {
					s.complete.call(s.context, xhr, status);
				}

				callbackprocessed = true;
				if (s.timeout) {
					cleartimeout(timeouthandle);
				}

				// clean up
				settimeout(function() {
					if (!s.iframetarget) {
						$io.remove();
					} else { // adding else to clean up existing iframe response.
						$io.attr('src', s.iframesrc);
					}
					xhr.responsexml = null;
				}, 100);
			}

			var toxml = $.parsexml || function(s, doc) { // use parsexml if available (jquery 1.5+)
				if (window.activexobject) {
					doc = new activexobject('microsoft.xmldom');
					doc.async = 'false';
					doc.loadxml(s);

				} else {
					doc = (new domparser()).parsefromstring(s, 'text/xml');
				}

				return (doc && doc.documentelement && doc.documentelement.nodename !== 'parsererror') ? doc : null;
			};
			var parsejson = $.parsejson || function(s) {
				/* jslint evil:true */
				return window['eval']('(' + s + ')');			// eslint-disable-line dot-notation
			};

			var httpdata = function(xhr, type, s) { // mostly lifted from jq1.4.4

				var ct = xhr.getresponseheader('content-type') || '',
					xml = ((type === 'xml' || !type) && ct.indexof('xml') >= 0),
					data = xml ? xhr.responsexml : xhr.responsetext;

				if (xml && data.documentelement.nodename === 'parsererror') {
					if ($.error) {
						$.error('parsererror');
					}
				}
				if (s && s.datafilter) {
					data = s.datafilter(data, type);
				}
				if (typeof data === 'string') {
					if ((type === 'json' || !type) && ct.indexof('json') >= 0) {
						data = parsejson(data);
					} else if ((type === 'script' || !type) && ct.indexof('javascript') >= 0) {
						$.globaleval(data);
					}
				}

				return data;
			};

			return deferred;
		}
	};

	/**
	 * ajaxform() provides a mechanism for fully automating form submission.
	 *
	 * the advantages of using this method instead of ajaxsubmit() are:
	 *
	 * 1: this method will include coordinates for <input type="image"> elements (if the element
	 *	is used to submit the form).
	 * 2. this method will include the submit element's name/value data (for the element that was
	 *	used to submit the form).
	 * 3. this method binds the submit() method to the form for you.
	 *
	 * the options argument for ajaxform works exactly as it does for ajaxsubmit. ajaxform merely
	 * passes the options argument along after properly binding events for submit elements and
	 * the form itself.
	 */
	$.fn.ajaxform = function(options, data, datatype, onsuccess) {
		if (typeof options === 'string' || (options === false && arguments.length > 0)) {
			options = {
				'url'      : options,
				'data'     : data,
				'datatype' : datatype
			};

			if (typeof onsuccess === 'function') {
				options.success = onsuccess;
			}
		}

		options = options || {};
		options.delegation = options.delegation && $.isfunction($.fn.on);

		// in jquery 1.3+ we can fix mistakes with the ready state
		if (!options.delegation && this.length === 0) {
			var o = {s: this.selector, c: this.context};

			if (!$.isready && o.s) {
				log('dom not ready, queuing ajaxform');
				$(function() {
					$(o.s, o.c).ajaxform(options);
				});

				return this;
			}

			// is your dom ready?  http://docs.jquery.com/tutorials:introducing_$(document).ready()
			log('terminating; zero elements found by selector' + ($.isready ? '' : ' (dom not ready)'));

			return this;
		}

		if (options.delegation) {
			$(document)
				.off('submit.form-plugin', this.selector, doajaxsubmit)
				.off('click.form-plugin', this.selector, capturesubmittingelement)
				.on('submit.form-plugin', this.selector, options, doajaxsubmit)
				.on('click.form-plugin', this.selector, options, capturesubmittingelement);

			return this;
		}

		if (options.beforeformunbind) {
			options.beforeformunbind(this, options);
		}

		return this.ajaxformunbind()
			.on('submit.form-plugin', options, doajaxsubmit)
			.on('click.form-plugin', options, capturesubmittingelement);
	};

	// private event handlers
	function doajaxsubmit(e) {
		/* jshint validthis:true */
		var options = e.data;

		if (!e.isdefaultprevented()) { // if event has been canceled, don't proceed
			e.preventdefault();
			$(e.target).closest('form').ajaxsubmit(options); // #365
		}
	}

	function capturesubmittingelement(e) {
		/* jshint validthis:true */
		var target = e.target;
		var $el = $(target);

		if (!$el.is('[type=submit],[type=image]')) {
			// is this a child element of the submit el?  (ex: a span within a button)
			var t = $el.closest('[type=submit]');

			if (t.length === 0) {
				return;
			}
			target = t[0];
		}

		var form = target.form;

		form.clk = target;

		if (target.type === 'image') {
			if (typeof e.offsetx !== 'undefined') {
				form.clk_x = e.offsetx;
				form.clk_y = e.offsety;

			} else if (typeof $.fn.offset === 'function') {
				var offset = $el.offset();

				form.clk_x = e.pagex - offset.left;
				form.clk_y = e.pagey - offset.top;

			} else {
				form.clk_x = e.pagex - target.offsetleft;
				form.clk_y = e.pagey - target.offsettop;
			}
		}
		// clear form vars
		settimeout(function() {
			form.clk = form.clk_x = form.clk_y = null;
		}, 100);
	}


	// ajaxformunbind unbinds the event handlers that were bound by ajaxform
	$.fn.ajaxformunbind = function() {
		return this.off('submit.form-plugin click.form-plugin');
	};

	/**
	 * formtoarray() gathers form element data into an array of objects that can
	 * be passed to any of the following ajax functions: $.get, $.post, or load.
	 * each object in the array has both a 'name' and 'value' property. an example of
	 * an array for a simple login form might be:
	 *
	 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
	 *
	 * it is this array that is passed to pre-submit callback functions provided to the
	 * ajaxsubmit() and ajaxform() methods.
	 */
	$.fn.formtoarray = function(semantic, elements, filtering) {
		var a = [];

		if (this.length === 0) {
			return a;
		}

		var form = this[0];
		var formid = this.attr('id');
		var els = (semantic || typeof form.elements === 'undefined') ? form.getelementsbytagname('*') : form.elements;
		var els2;

		if (els) {
			els = $.makearray(els); // convert to standard array
		}

		// #386; account for inputs outside the form which use the 'form' attribute
		// finesserus: in non-ie browsers outside fields are already included in form.elements.
		if (formid && (semantic || /(edge|trident)\//.test(navigator.useragent))) {
			els2 = $(':input[form="' + formid + '"]').get(); // hat tip @thet
			if (els2.length) {
				els = (els || []).concat(els2);
			}
		}

		if (!els || !els.length) {
			return a;
		}

		if ($.isfunction(filtering)) {
			els = $.map(els, filtering);
		}

		var i, j, n, v, el, max, jmax;

		for (i = 0, max = els.length; i < max; i++) {
			el = els[i];
			n = el.name;
			if (!n || el.disabled) {
				continue;
			}

			if (semantic && form.clk && el.type === 'image') {
				// handle image inputs on the fly when semantic == true
				if (form.clk === el) {
					a.push({name: n, value: $(el).val(), type: el.type});
					a.push({name: n + '.x', value: form.clk_x}, {name: n + '.y', value: form.clk_y});
				}
				continue;
			}

			v = $.fieldvalue(el, true);
			if (v && v.constructor === array) {
				if (elements) {
					elements.push(el);
				}
				for (j = 0, jmax = v.length; j < jmax; j++) {
					a.push({name: n, value: v[j]});
				}

			} else if (feature.fileapi && el.type === 'file') {
				if (elements) {
					elements.push(el);
				}

				var files = el.files;

				if (files.length) {
					for (j = 0; j < files.length; j++) {
						a.push({name: n, value: files[j], type: el.type});
					}
				} else {
					// #180
					a.push({name: n, value: '', type: el.type});
				}

			} else if (v !== null && typeof v !== 'undefined') {
				if (elements) {
					elements.push(el);
				}
				a.push({name: n, value: v, type: el.type, required: el.required});
			}
		}

		if (!semantic && form.clk) {
			// input type=='image' are not found in elements array! handle it here
			var $input = $(form.clk), input = $input[0];

			n = input.name;

			if (n && !input.disabled && input.type === 'image') {
				a.push({name: n, value: $input.val()});
				a.push({name: n + '.x', value: form.clk_x}, {name: n + '.y', value: form.clk_y});
			}
		}

		return a;
	};

	/**
	 * serializes form data into a 'submittable' string. this method will return a string
	 * in the format: name1=value1&amp;name2=value2
	 */
	$.fn.formserialize = function(semantic) {
		// hand off to jquery.param for proper encoding
		return $.param(this.formtoarray(semantic));
	};

	/**
	 * serializes all field elements in the jquery object into a query string.
	 * this method will return a string in the format: name1=value1&amp;name2=value2
	 */
	$.fn.fieldserialize = function(successful) {
		var a = [];

		this.each(function() {
			var n = this.name;

			if (!n) {
				return;
			}

			var v = $.fieldvalue(this, successful);

			if (v && v.constructor === array) {
				for (var i = 0, max = v.length; i < max; i++) {
					a.push({name: n, value: v[i]});
				}

			} else if (v !== null && typeof v !== 'undefined') {
				a.push({name: this.name, value: v});
			}
		});

		// hand off to jquery.param for proper encoding
		return $.param(a);
	};

	/**
	 * returns the value(s) of the element in the matched set. for example, consider the following form:
	 *
	 *	<form><fieldset>
	 *		<input name="a" type="text">
	 *		<input name="a" type="text">
	 *		<input name="b" type="checkbox" value="b1">
	 *		<input name="b" type="checkbox" value="b2">
	 *		<input name="c" type="radio" value="c1">
	 *		<input name="c" type="radio" value="c2">
	 *	</fieldset></form>
	 *
	 *	var v = $('input[type=text]').fieldvalue();
	 *	// if no values are entered into the text inputs
	 *	v === ['','']
	 *	// if values entered into the text inputs are 'foo' and 'bar'
	 *	v === ['foo','bar']
	 *
	 *	var v = $('input[type=checkbox]').fieldvalue();
	 *	// if neither checkbox is checked
	 *	v === undefined
	 *	// if both checkboxes are checked
	 *	v === ['b1', 'b2']
	 *
	 *	var v = $('input[type=radio]').fieldvalue();
	 *	// if neither radio is checked
	 *	v === undefined
	 *	// if first radio is checked
	 *	v === ['c1']
	 *
	 * the successful argument controls whether or not the field element must be 'successful'
	 * (per http://www.w3.org/tr/html4/interact/forms.html#successful-controls).
	 * the default value of the successful argument is true. if this value is false the value(s)
	 * for each element is returned.
	 *
	 * note: this method *always* returns an array. if no valid value can be determined the
	 *	array will be empty, otherwise it will contain one or more values.
	 */
	$.fn.fieldvalue = function(successful) {
		for (var val = [], i = 0, max = this.length; i < max; i++) {
			var el = this[i];
			var v = $.fieldvalue(el, successful);

			if (v === null || typeof v === 'undefined' || (v.constructor === array && !v.length)) {
				continue;
			}

			if (v.constructor === array) {
				$.merge(val, v);
			} else {
				val.push(v);
			}
		}

		return val;
	};

	/**
	 * returns the value of the field element.
	 */
	$.fieldvalue = function(el, successful) {
		var n = el.name, t = el.type, tag = el.tagname.tolowercase();

		if (typeof successful === 'undefined') {
			successful = true;
		}

		/* eslint-disable no-mixed-operators */
		if (successful && (!n || el.disabled || t === 'reset' || t === 'button' ||
			(t === 'checkbox' || t === 'radio') && !el.checked ||
			(t === 'submit' || t === 'image') && el.form && el.form.clk !== el ||
			tag === 'select' && el.selectedindex === -1)) {
		/* eslint-enable no-mixed-operators */
			return null;
		}

		if (tag === 'select') {
			var index = el.selectedindex;

			if (index < 0) {
				return null;
			}

			var a = [], ops = el.options;
			var one = (t === 'select-one');
			var max = (one ? index + 1 : ops.length);

			for (var i = (one ? index : 0); i < max; i++) {
				var op = ops[i];

				if (op.selected && !op.disabled) {
					var v = op.value;

					if (!v) { // extra pain for ie...
						v = (op.attributes && op.attributes.value && !(op.attributes.value.specified)) ? op.text : op.value;
					}

					if (one) {
						return v;
					}

					a.push(v);
				}
			}

			return a;
		}

		return $(el).val().replace(rcrlf, '\r\n');
	};

	/**
	 * clears the form data. takes the following actions on the form's input fields:
	 *  - input text fields will have their 'value' property set to the empty string
	 *  - select elements will have their 'selectedindex' property set to -1
	 *  - checkbox and radio inputs will have their 'checked' property set to false
	 *  - inputs of type submit, button, reset, and hidden will *not* be effected
	 *  - button elements will *not* be effected
	 */
	$.fn.clearform = function(includehidden) {
		return this.each(function() {
			$('input,select,textarea', this).clearfields(includehidden);
		});
	};

	/**
	 * clears the selected form elements.
	 */
	$.fn.clearfields = $.fn.clearinputs = function(includehidden) {
		var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list

		return this.each(function() {
			var t = this.type, tag = this.tagname.tolowercase();

			if (re.test(t) || tag === 'textarea') {
				this.value = '';

			} else if (t === 'checkbox' || t === 'radio') {
				this.checked = false;

			} else if (tag === 'select') {
				this.selectedindex = -1;

			} else if (t === 'file') {
				if (/msie/.test(navigator.useragent)) {
					$(this).replacewith($(this).clone(true));
				} else {
					$(this).val('');
				}

			} else if (includehidden) {
				// includehidden can be the value true, or it can be a selector string
				// indicating a special test; for example:
				// $('#myform').clearform('.special:hidden')
				// the above would clean hidden inputs that have the class of 'special'
				if ((includehidden === true && /hidden/.test(t)) ||
					(typeof includehidden === 'string' && $(this).is(includehidden))) {
					this.value = '';
				}
			}
		});
	};


	/**
	 * resets the form data or individual elements. takes the following actions
	 * on the selected tags:
	 * - all fields within form elements will be reset to their original value
	 * - input / textarea / select fields will be reset to their original value
	 * - option / optgroup fields (for multi-selects) will defaulted individually
	 * - non-multiple options will find the right select to default
	 * - label elements will be searched against its 'for' attribute
	 * - all others will be searched for appropriate children to default
	 */
	$.fn.resetform = function() {
		return this.each(function() {
			var el = $(this);
			var tag = this.tagname.tolowercase();

			switch (tag) {
			case 'input':
				this.checked = this.defaultchecked;
				// fall through

			case 'textarea':
				this.value = this.defaultvalue;

				return true;

			case 'option':
			case 'optgroup':
				var select = el.parents('select');

				if (select.length && select[0].multiple) {
					if (tag === 'option') {
						this.selected = this.defaultselected;
					} else {
						el.find('option').resetform();
					}
				} else {
					select.resetform();
				}

				return true;

			case 'select':
				el.find('option').each(function(i) {				// eslint-disable-line consistent-return
					this.selected = this.defaultselected;
					if (this.defaultselected && !el[0].multiple) {
						el[0].selectedindex = i;

						return false;
					}
				});

				return true;

			case 'label':
				var forel = $(el.attr('for'));
				var list = el.find('input,select,textarea');

				if (forel[0]) {
					list.unshift(forel[0]);
				}

				list.resetform();

				return true;

			case 'form':
				// guard against an input with the name of 'reset'
				// note that ie reports the reset function as an 'object'
				if (typeof this.reset === 'function' || (typeof this.reset === 'object' && !this.reset.nodetype)) {
					this.reset();
				}

				return true;

			default:
				el.find('form,input,label,select,textarea').resetform();

				return true;
			}
		});
	};

	/**
	 * enables or disables any matching elements.
	 */
	$.fn.enable = function(b) {
		if (typeof b === 'undefined') {
			b = true;
		}

		return this.each(function() {
			this.disabled = !b;
		});
	};

	/**
	 * checks/unchecks any matching checkboxes or radio buttons and
	 * selects/deselects and matching option elements.
	 */
	$.fn.selected = function(select) {
		if (typeof select === 'undefined') {
			select = true;
		}

		return this.each(function() {
			var t = this.type;

			if (t === 'checkbox' || t === 'radio') {
				this.checked = select;

			} else if (this.tagname.tolowercase() === 'option') {
				var $sel = $(this).parent('select');

				if (select && $sel[0] && $sel[0].type === 'select-one') {
					// deselect all other options
					$sel.find('option').selected(false);
				}

				this.selected = select;
			}
		});
	};

	// expose debug var
	$.fn.ajaxsubmit.debug = false;

	// helper fn for console logging
	function log() {
		if (!$.fn.ajaxsubmit.debug) {
			return;
		}

		var msg = '[jquery.form] ' + array.prototype.join.call(arguments, '');

		if (window.console && window.console.log) {
			window.console.log(msg);

		} else if (window.opera && window.opera.posterror) {
			window.opera.posterror(msg);
		}
	}
}));





