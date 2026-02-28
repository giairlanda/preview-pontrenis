;var mxi_debug = false;
/**
 * moxie - multi-runtime file api & xmlhttprequest l2 polyfill
 * v1.3.5.1
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 *
 * date: 2016-05-15
 */
/**
 * compiled inline version. (library mode)
 */

/**
 * modified for wordpress.
 * - silverlight and flash runtimes support was removed. see https://core.trac.wordpress.org/ticket/41755.
 * - a stray unicode character has been removed. see https://core.trac.wordpress.org/ticket/59329.
 *
 * this is a de-facto fork of the moxie library that will be maintained by wordpress due to upstream license changes
 * that are incompatible with the gpl.
 */

/*jshint smarttabs:true, undef:true, latedef:true, curly:true, bitwise:true, camelcase:true */
/*globals $code */

(function(exports, undefined) {
	"use strict";

	var modules = {};

	function require(ids, callback) {
		var module, defs = [];

		for (var i = 0; i < ids.length; ++i) {
			module = modules[ids[i]] || resolve(ids[i]);
			if (!module) {
				throw 'module definition dependecy not found: ' + ids[i];
			}

			defs.push(module);
		}

		callback.apply(null, defs);
	}

	function define(id, dependencies, definition) {
		if (typeof id !== 'string') {
			throw 'invalid module definition, module id must be defined and be a string';
		}

		if (dependencies === undefined) {
			throw 'invalid module definition, dependencies must be specified';
		}

		if (definition === undefined) {
			throw 'invalid module definition, definition function must be specified';
		}

		require(dependencies, function() {
			modules[id] = definition.apply(null, arguments);
		});
	}

	function defined(id) {
		return !!modules[id];
	}

	function resolve(id) {
		var target = exports;
		var fragments = id.split(/[.\/]/);

		for (var fi = 0; fi < fragments.length; ++fi) {
			if (!target[fragments[fi]]) {
				return;
			}

			target = target[fragments[fi]];
		}

		return target;
	}

	function expose(ids) {
		for (var i = 0; i < ids.length; i++) {
			var target = exports;
			var id = ids[i];
			var fragments = id.split(/[.\/]/);

			for (var fi = 0; fi < fragments.length - 1; ++fi) {
				if (target[fragments[fi]] === undefined) {
					target[fragments[fi]] = {};
				}

				target = target[fragments[fi]];
			}

			target[fragments[fragments.length - 1]] = modules[id];
		}
	}

// included from: src/javascript/core/utils/basic.js

/**
 * basic.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/core/utils/basic', [], function() {
	/**
	gets the true type of the built-in object (better version of typeof).
	@author angus croll (http://javascriptweblog.wordpress.com/)

	@method typeof
	@for utils
	@static
	@param {object} o object to check.
	@return {string} object [[class]]
	*/
	var typeof = function(o) {
		var undef;

		if (o === undef) {
			return 'undefined';
		} else if (o === null) {
			return 'null';
		} else if (o.nodetype) {
			return 'node';
		}

		// the snippet below is awesome, however it fails to detect null, undefined and arguments types in ie lte 8
		return ({}).tostring.call(o).match(/\s([a-z|a-z]+)/)[1].tolowercase();
	};
		
	/**
	extends the specified object with another object.

	@method extend
	@static
	@param {object} target object to extend.
	@param {object} [obj]* multiple objects to extend with.
	@return {object} same as target, the extended object.
	*/
	var extend = function(target) {
		var undef;

		each(arguments, function(arg, i) {
			if (i > 0) {
				each(arg, function(value, key) {
					if (value !== undef) {
						if (typeof(target[key]) === typeof(value) && !!~inarray(typeof(value), ['array', 'object'])) {
							extend(target[key], value);
						} else {
							target[key] = value;
						}
					}
				});
			}
		});
		return target;
	};
		
	/**
	executes the callback function for each item in array/object. if you return false in the
	callback it will break the loop.

	@method each
	@static
	@param {object} obj object to iterate.
	@param {function} callback callback function to execute for each item.
	*/
	var each = function(obj, callback) {
		var length, key, i, undef;

		if (obj) {
			if (typeof(obj.length) === 'number') { // it might be array, filelist or even arguments object
				// loop array items
				for (i = 0, length = obj.length; i < length; i++) {
					if (callback(obj[i], i) === false) {
						return;
					}
				}
			} else if (typeof(obj) === 'object') {
				// loop object items
				for (key in obj) {
					if (obj.hasownproperty(key)) {
						if (callback(obj[key], key) === false) {
							return;
						}
					}
				}
			}
		}
	};

	/**
	checks if object is empty.
	
	@method isemptyobj
	@static
	@param {object} o object to check.
	@return {boolean}
	*/
	var isemptyobj = function(obj) {
		var prop;

		if (!obj || typeof(obj) !== 'object') {
			return true;
		}

		for (prop in obj) {
			return false;
		}

		return true;
	};

	/**
	recieve an array of functions (usually async) to call in sequence, each  function
	receives a callback as first argument that it should call, when it completes. finally,
	after everything is complete, main callback is called. passing truthy value to the
	callback as a first argument will interrupt the sequence and invoke main callback
	immediately.

	@method inseries
	@static
	@param {array} queue array of functions to call in sequence
	@param {function} cb main callback that is called in the end, or in case of error
	*/
	var inseries = function(queue, cb) {
		var i = 0, length = queue.length;

		if (typeof(cb) !== 'function') {
			cb = function() {};
		}

		if (!queue || !queue.length) {
			cb();
		}

		function callnext(i) {
			if (typeof(queue[i]) === 'function') {
				queue[i](function(error) {
					/*jshint expr:true */
					++i < length && !error ? callnext(i) : cb(error);
				});
			}
		}
		callnext(i);
	};


	/**
	recieve an array of functions (usually async) to call in parallel, each  function
	receives a callback as first argument that it should call, when it completes. after 
	everything is complete, main callback is called. passing truthy value to the
	callback as a first argument will interrupt the process and invoke main callback
	immediately.

	@method inparallel
	@static
	@param {array} queue array of functions to call in sequence
	@param {function} cb main callback that is called in the end, or in case of error
	*/
	var inparallel = function(queue, cb) {
		var count = 0, num = queue.length, cbargs = new array(num);

		each(queue, function(fn, i) {
			fn(function(error) {
				if (error) {
					return cb(error);
				}
				
				var args = [].slice.call(arguments);
				args.shift(); // strip error - undefined or not

				cbargs[i] = args;
				count++;

				if (count === num) {
					cbargs.unshift(null);
					cb.apply(this, cbargs);
				} 
			});
		});
	};
	
	
	/**
	find an element in array and return it's index if present, otherwise return -1.
	
	@method inarray
	@static
	@param {mixed} needle element to find
	@param {array} array
	@return {int} index of the element, or -1 if not found
	*/
	var inarray = function(needle, array) {
		if (array) {
			if (array.prototype.indexof) {
				return array.prototype.indexof.call(array, needle);
			}
		
			for (var i = 0, length = array.length; i < length; i++) {
				if (array[i] === needle) {
					return i;
				}
			}
		}
		return -1;
	};


	/**
	returns elements of first array if they are not present in second. and false - otherwise.

	@private
	@method arraydiff
	@param {array} needles
	@param {array} array
	@return {array|boolean}
	*/
	var arraydiff = function(needles, array) {
		var diff = [];

		if (typeof(needles) !== 'array') {
			needles = [needles];
		}

		if (typeof(array) !== 'array') {
			array = [array];
		}

		for (var i in needles) {
			if (inarray(needles[i], array) === -1) {
				diff.push(needles[i]);
			}	
		}
		return diff.length ? diff : false;
	};


	/**
	find intersection of two arrays.

	@private
	@method arrayintersect
	@param {array} array1
	@param {array} array2
	@return {array} intersection of two arrays or null if there is none
	*/
	var arrayintersect = function(array1, array2) {
		var result = [];
		each(array1, function(item) {
			if (inarray(item, array2) !== -1) {
				result.push(item);
			}
		});
		return result.length ? result : null;
	};
	
	
	/**
	forces anything into an array.
	
	@method toarray
	@static
	@param {object} obj object with length field.
	@return {array} array object containing all items.
	*/
	var toarray = function(obj) {
		var i, arr = [];

		for (i = 0; i < obj.length; i++) {
			arr[i] = obj[i];
		}

		return arr;
	};
	
			
	/**
	generates an unique id. the only way a user would be able to get the same id is if the two persons
	at the same exact millisecond manage to get the same 5 random numbers between 0-65535; it also uses 
	a counter so each id is guaranteed to be unique for the given page. it is more probable for the earth 
	to be hit with an asteroid.
	
	@method guid
	@static
	@param {string} prefix to prepend (by default 'o' will be prepended).
	@method guid
	@return {string} virtually unique id.
	*/
	var guid = (function() {
		var counter = 0;
		
		return function(prefix) {
			var guid = new date().gettime().tostring(32), i;

			for (i = 0; i < 5; i++) {
				guid += math.floor(math.random() * 65535).tostring(32);
			}
			
			return (prefix || 'o_') + guid + (counter++).tostring(32);
		};
	}());
	

	/**
	trims white spaces around the string
	
	@method trim
	@static
	@param {string} str
	@return {string}
	*/
	var trim = function(str) {
		if (!str) {
			return str;
		}
		return string.prototype.trim ? string.prototype.trim.call(str) : str.tostring().replace(/^\s*/, '').replace(/\s*$/, '');
	};


	/**
	parses the specified size string into a byte value. for example 10kb becomes 10240.
	
	@method parsesizestr
	@static
	@param {string/number} size string to parse or number to just pass through.
	@return {number} size in bytes.
	*/
	var parsesizestr = function(size) {
		if (typeof(size) !== 'string') {
			return size;
		}
		
		var muls = {
				t: 1099511627776,
				g: 1073741824,
				m: 1048576,
				k: 1024
			},
			mul;


		size = /^([0-9\.]+)([tmgk]?)$/.exec(size.tolowercase().replace(/[^0-9\.tmkg]/g, ''));
		mul = size[2];
		size = +size[1];
		
		if (muls.hasownproperty(mul)) {
			size *= muls[mul];
		}
		return math.floor(size);
	};


	/**
	 * pseudo sprintf implementation - simple way to replace tokens with specified values.
	 *
	 * @param {string} str string with tokens
	 * @return {string} string with replaced tokens
	 */
	var sprintf = function(str) {
		var args = [].slice.call(arguments, 1);

		return str.replace(/%[a-z]/g, function() {
			var value = args.shift();
			return typeof(value) !== 'undefined' ? value : '';
		});
	};
	

	return {
		guid: guid,
		typeof: typeof,
		extend: extend,
		each: each,
		isemptyobj: isemptyobj,
		inseries: inseries,
		inparallel: inparallel,
		inarray: inarray,
		arraydiff: arraydiff,
		arrayintersect: arrayintersect,
		toarray: toarray,
		trim: trim,
		sprintf: sprintf,
		parsesizestr: parsesizestr
	};
});

// included from: src/javascript/core/utils/env.js

/**
 * env.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define("moxie/core/utils/env", [
	"moxie/core/utils/basic"
], function(basic) {
	
	/**
	 * uaparser.js v0.7.7
	 * lightweight javascript-based user-agent string parser
	 * https://github.com/faisalman/ua-parser-js
	 *
	 * copyright â© 2012-2015 faisal salman <fyzlman@gmail.com>
	 * dual licensed under gplv2 & mit
	 */
	var uaparser = (function (undefined) {

	    //////////////
	    // constants
	    /////////////


	    var empty       = '',
	        unknown     = '?',
	        func_type   = 'function',
	        undef_type  = 'undefined',
	        obj_type    = 'object',
	        major       = 'major',
	        model       = 'model',
	        name        = 'name',
	        type        = 'type',
	        vendor      = 'vendor',
	        version     = 'version',
	        architecture= 'architecture',
	        console     = 'console',
	        mobile      = 'mobile',
	        tablet      = 'tablet';


	    ///////////
	    // helper
	    //////////


	    var util = {
	        has : function (str1, str2) {
	            return str2.tolowercase().indexof(str1.tolowercase()) !== -1;
	        },
	        lowerize : function (str) {
	            return str.tolowercase();
	        }
	    };


	    ///////////////
	    // map helper
	    //////////////


	    var mapper = {

	        rgx : function () {

	            // loop through all regexes maps
	            for (var result, i = 0, j, k, p, q, matches, match, args = arguments; i < args.length; i += 2) {

	                var regex = args[i],       // even sequence (0,2,4,..)
	                    props = args[i + 1];   // odd sequence (1,3,5,..)

	                // construct object barebones
	                if (typeof(result) === undef_type) {
	                    result = {};
	                    for (p in props) {
	                        q = props[p];
	                        if (typeof(q) === obj_type) {
	                            result[q[0]] = undefined;
	                        } else {
	                            result[q] = undefined;
	                        }
	                    }
	                }

	                // try matching uastring with regexes
	                for (j = k = 0; j < regex.length; j++) {
	                    matches = regex[j].exec(this.getua());
	                    if (!!matches) {
	                        for (p = 0; p < props.length; p++) {
	                            match = matches[++k];
	                            q = props[p];
	                            // check if given property is actually array
	                            if (typeof(q) === obj_type && q.length > 0) {
	                                if (q.length == 2) {
	                                    if (typeof(q[1]) == func_type) {
	                                        // assign modified match
	                                        result[q[0]] = q[1].call(this, match);
	                                    } else {
	                                        // assign given value, ignore regex match
	                                        result[q[0]] = q[1];
	                                    }
	                                } else if (q.length == 3) {
	                                    // check whether function or regex
	                                    if (typeof(q[1]) === func_type && !(q[1].exec && q[1].test)) {
	                                        // call function (usually string mapper)
	                                        result[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
	                                    } else {
	                                        // sanitize match using given regex
	                                        result[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
	                                    }
	                                } else if (q.length == 4) {
	                                        result[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
	                                }
	                            } else {
	                                result[q] = match ? match : undefined;
	                            }
	                        }
	                        break;
	                    }
	                }

	                if(!!matches) break; // break the loop immediately if match found
	            }
	            return result;
	        },

	        str : function (str, map) {

	            for (var i in map) {
	                // check if array
	                if (typeof(map[i]) === obj_type && map[i].length > 0) {
	                    for (var j = 0; j < map[i].length; j++) {
	                        if (util.has(map[i][j], str)) {
	                            return (i === unknown) ? undefined : i;
	                        }
	                    }
	                } else if (util.has(map[i], str)) {
	                    return (i === unknown) ? undefined : i;
	                }
	            }
	            return str;
	        }
	    };


	    ///////////////
	    // string map
	    //////////////


	    var maps = {

	        browser : {
	            oldsafari : {
	                major : {
	                    '1' : ['/8', '/1', '/3'],
	                    '2' : '/4',
	                    '?' : '/'
	                },
	                version : {
	                    '1.0'   : '/8',
	                    '1.2'   : '/1',
	                    '1.3'   : '/3',
	                    '2.0'   : '/412',
	                    '2.0.2' : '/416',
	                    '2.0.3' : '/417',
	                    '2.0.4' : '/419',
	                    '?'     : '/'
	                }
	            }
	        },

	        device : {
	            sprint : {
	                model : {
	                    'evo shift 4g' : '7373kt'
	                },
	                vendor : {
	                    'htc'       : 'apa',
	                    'sprint'    : 'sprint'
	                }
	            }
	        },

	        os : {
	            windows : {
	                version : {
	                    'me'        : '4.90',
	                    'nt 3.11'   : 'nt3.51',
	                    'nt 4.0'    : 'nt4.0',
	                    '2000'      : 'nt 5.0',
	                    'xp'        : ['nt 5.1', 'nt 5.2'],
	                    'vista'     : 'nt 6.0',
	                    '7'         : 'nt 6.1',
	                    '8'         : 'nt 6.2',
	                    '8.1'       : 'nt 6.3',
	                    'rt'        : 'arm'
	                }
	            }
	        }
	    };


	    //////////////
	    // regex map
	    /////////////


	    var regexes = {

	        browser : [[
	        
	            // presto based
	            /(opera\smini)\/([\w\.-]+)/i,                                       // opera mini
	            /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,                      // opera mobi/tablet
	            /(opera).+version\/([\w\.]+)/i,                                     // opera > 9.80
	            /(opera)[\/\s]+([\w\.]+)/i                                          // opera < 9.80

	            ], [name, version], [

	            /\s(opr)\/([\w\.]+)/i                                               // opera webkit
	            ], [[name, 'opera'], version], [

	            // mixed
	            /(kindle)\/([\w\.]+)/i,                                             // kindle
	            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,
	                                                                                // lunascape/maxthon/netfront/jasmine/blazer

	            // trident based
	            /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
	                                                                                // avant/iemobile/slimbrowser/baidu
	            /(?:ms|\()(ie)\s([\w\.]+)/i,                                        // internet explorer

	            // webkit/khtml based
	            /(rekonq)\/([\w\.]+)*/i,                                            // rekonq
	            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi)\/([\w\.-]+)/i
	                                                                                // chromium/flock/rockmelt/midori/epiphany/silk/skyfire/bolt/iron
	            ], [name, version], [

	            /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i                         // ie11
	            ], [[name, 'ie'], version], [

	            /(edge)\/((\d+)?[\w\.]+)/i                                          // microsoft edge
	            ], [name, version], [

	            /(yabrowser)\/([\w\.]+)/i                                           // yandex
	            ], [[name, 'yandex'], version], [

	            /(comodo_dragon)\/([\w\.]+)/i                                       // comodo dragon
	            ], [[name, /_/g, ' '], version], [

	            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,
	                                                                                // chrome/omniweb/arora/tizen/nokia
	            /(uc\s?browser|qqbrowser)[\/\s]?([\w\.]+)/i
	                                                                                // ucbrowser/qqbrowser
	            ], [name, version], [

	            /(dolfin)\/([\w\.]+)/i                                              // dolphin
	            ], [[name, 'dolphin'], version], [

	            /((?:android.+)crmo|crios)\/([\w\.]+)/i                             // chrome for android/ios
	            ], [[name, 'chrome'], version], [

	            /xiaomi\/miuibrowser\/([\w\.]+)/i                                   // miui browser
	            ], [version, [name, 'miui browser']], [

	            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i         // android browser
	            ], [version, [name, 'android browser']], [

	            /fbav\/([\w\.]+);/i                                                 // facebook app for ios
	            ], [version, [name, 'facebook']], [

	            /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i                       // mobile safari
	            ], [version, [name, 'mobile safari']], [

	            /version\/([\w\.]+).+?(mobile\s?safari|safari)/i                    // safari & safari mobile
	            ], [version, name], [

	            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i                     // safari < 3.0
	            ], [name, [version, mapper.str, maps.browser.oldsafari.version]], [

	            /(konqueror)\/([\w\.]+)/i,                                          // konqueror
	            /(webkit|khtml)\/([\w\.]+)/i
	            ], [name, version], [

	            // gecko based
	            /(navigator|netscape)\/([\w\.-]+)/i                                 // netscape
	            ], [[name, 'netscape'], version], [
	            /(swiftfox)/i,                                                      // swiftfox
	            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
	                                                                                // icedragon/iceweasel/camino/chimera/fennec/maemo/minimo/conkeror
	            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,
	                                                                                // firefox/seamonkey/k-meleon/icecat/iceape/firebird/phoenix
	            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,                          // mozilla

	            // other
	            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf)[\/\s]?([\w\.]+)/i,
	                                                                                // polaris/lynx/dillo/icab/doris/amaya/w3m/netsurf
	            /(links)\s\(([\w\.]+)/i,                                            // links
	            /(gobrowser)\/?([\w\.]+)*/i,                                        // gobrowser
	            /(ice\s?browser)\/v?([\w\._]+)/i,                                   // ice browser
	            /(mosaic)[\/\s]([\w\.]+)/i                                          // mosaic
	            ], [name, version]
	        ],

	        engine : [[

	            /windows.+\sedge\/([\w\.]+)/i                                       // edgehtml
	            ], [version, [name, 'edgehtml']], [

	            /(presto)\/([\w\.]+)/i,                                             // presto
	            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,     // webkit/trident/netfront/netsurf/amaya/lynx/w3m
	            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,                          // khtml/tasman/links
	            /(icab)[\/\s]([23]\.[\d\.]+)/i                                      // icab
	            ], [name, version], [

	            /rv\:([\w\.]+).*(gecko)/i                                           // gecko
	            ], [version, name]
	        ],

	        os : [[

	            // windows based
	            /microsoft\s(windows)\s(vista|xp)/i                                 // windows (itunes)
	            ], [name, version], [
	            /(windows)\snt\s6\.2;\s(arm)/i,                                     // windows rt
	            /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
	            ], [name, [version, mapper.str, maps.os.windows.version]], [
	            /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
	            ], [[name, 'windows'], [version, mapper.str, maps.os.windows.version]], [

	            // mobile/embedded os
	            /\((bb)(10);/i                                                      // blackberry 10
	            ], [[name, 'blackberry'], version], [
	            /(blackberry)\w*\/?([\w\.]+)*/i,                                    // blackberry
	            /(tizen)[\/\s]([\w\.]+)/i,                                          // tizen
	            /(android|webos|palm\os|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,
	                                                                                // android/webos/palm/qnx/bada/rim/meego/contiki
	            /linux;.+(sailfish);/i                                              // sailfish os
	            ], [name, version], [
	            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i                 // symbian
	            ], [[name, 'symbian'], version], [
	            /\((series40);/i                                                    // series 40
	            ], [name], [
	            /mozilla.+\(mobile;.+gecko.+firefox/i                               // firefox os
	            ], [[name, 'firefox os'], version], [

	            // console
	            /(nintendo|playstation)\s([wids3portablevu]+)/i,                    // nintendo/playstation

	            // gnu/linux based
	            /(mint)[\/\s\(]?(\w+)*/i,                                           // mint
	            /(mageia|vectorlinux)[;\s]/i,                                       // mageia/vectorlinux
	            /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i,
	                                                                                // joli/ubuntu/debian/suse/gentoo/arch/slackware
	                                                                                // fedora/mandriva/centos/pclinuxos/redhat/zenwalk/linpus
	            /(hurd|linux)\s?([\w\.]+)*/i,                                       // hurd/linux
	            /(gnu)\s?([\w\.]+)*/i                                               // gnu
	            ], [name, version], [

	            /(cros)\s[\w]+\s([\w\.]+\w)/i                                       // chromium os
	            ], [[name, 'chromium os'], version],[

	            // solaris
	            /(sunos)\s?([\w\.]+\d)*/i                                           // solaris
	            ], [[name, 'solaris'], version], [

	            // bsd based
	            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i                   // freebsd/netbsd/openbsd/pc-bsd/dragonfly
	            ], [name, version],[

	            /(ip[honead]+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i             // ios
	            ], [[name, 'ios'], [version, /_/g, '.']], [

	            /(mac\sos\sx)\s?([\w\s\.]+\w)*/i,
	            /(macintosh|mac(?=_powerpc)\s)/i                                    // mac os
	            ], [[name, 'mac os'], [version, /_/g, '.']], [

	            // other
	            /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,                            // solaris
	            /(haiku)\s(\w+)/i,                                                  // haiku
	            /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,                               // aix
	            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
	                                                                                // plan9/minix/beos/os2/amigaos/morphos/riscos/openvms
	            /(unix)\s?([\w\.]+)*/i                                              // unix
	            ], [name, version]
	        ]
	    };


	    /////////////////
	    // constructor
	    ////////////////


	    var uaparser = function (uastring) {

	        var ua = uastring || ((window && window.navigator && window.navigator.useragent) ? window.navigator.useragent : empty);

	        this.getbrowser = function () {
	            return mapper.rgx.apply(this, regexes.browser);
	        };
	        this.getengine = function () {
	            return mapper.rgx.apply(this, regexes.engine);
	        };
	        this.getos = function () {
	            return mapper.rgx.apply(this, regexes.os);
	        };
	        this.getresult = function() {
	            return {
	                ua      : this.getua(),
	                browser : this.getbrowser(),
	                engine  : this.getengine(),
	                os      : this.getos()
	            };
	        };
	        this.getua = function () {
	            return ua;
	        };
	        this.setua = function (uastring) {
	            ua = uastring;
	            return this;
	        };
	        this.setua(ua);
	    };

	    return uaparser;
	})();


	function version_compare(v1, v2, operator) {
	  // from: http://phpjs.org/functions
	  // +      original by: philippe jausions (http://pear.php.net/user/jausions)
	  // +      original by: aidan lister (http://aidanlister.com/)
	  // + reimplemented by: kankrelune (http://www.webfaktory.info/)
	  // +      improved by: brett zamir (http://brett-zamir.me)
	  // +      improved by: scott baker
	  // +      improved by: theriault
	  // *        example 1: version_compare('8.2.5rc', '8.2.5a');
	  // *        returns 1: 1
	  // *        example 2: version_compare('8.2.50', '8.2.52', '<');
	  // *        returns 2: true
	  // *        example 3: version_compare('5.3.0-dev', '5.3.0');
	  // *        returns 3: -1
	  // *        example 4: version_compare('4.1.0.52','4.01.0.51');
	  // *        returns 4: 1

	  // important: compare must be initialized at 0.
	  var i = 0,
	    x = 0,
	    compare = 0,
	    // vm maps textual php versions to negatives so they're less than 0.
	    // php currently defines these as case-sensitive. it is important to
	    // leave these as negatives so that they can come before numerical versions
	    // and as if no letters were there to begin with.
	    // (1alpha is < 1 and < 1.1 but > 1dev1)
	    // if a non-numerical value can't be mapped to this table, it receives
	    // -7 as its value.
	    vm = {
	      'dev': -6,
	      'alpha': -5,
	      'a': -5,
	      'beta': -4,
	      'b': -4,
	      'rc': -3,
	      'rc': -3,
	      '#': -2,
	      'p': 1,
	      'pl': 1
	    },
	    // this function will be called to prepare each version argument.
	    // it replaces every _, -, and + with a dot.
	    // it surrounds any nonsequence of numbers/dots with dots.
	    // it replaces sequences of dots with a single dot.
	    //    version_compare('4..0', '4.0') == 0
	    // important: a string of 0 length needs to be converted into a value
	    // even less than an unexisting value in vm (-7), hence [-8].
	    // it's also important to not strip spaces because of this.
	    //   version_compare('', ' ') == 1
	    prepversion = function (v) {
	      v = ('' + v).replace(/[_\-+]/g, '.');
	      v = v.replace(/([^.\d]+)/g, '.$1.').replace(/\.{2,}/g, '.');
	      return (!v.length ? [-8] : v.split('.'));
	    },
	    // this converts a version component to a number.
	    // empty component becomes 0.
	    // non-numerical component becomes a negative number.
	    // numerical component becomes itself as an integer.
	    numversion = function (v) {
	      return !v ? 0 : (isnan(v) ? vm[v] || -7 : parseint(v, 10));
	    };

	  v1 = prepversion(v1);
	  v2 = prepversion(v2);
	  x = math.max(v1.length, v2.length);
	  for (i = 0; i < x; i++) {
	    if (v1[i] == v2[i]) {
	      continue;
	    }
	    v1[i] = numversion(v1[i]);
	    v2[i] = numversion(v2[i]);
	    if (v1[i] < v2[i]) {
	      compare = -1;
	      break;
	    } else if (v1[i] > v2[i]) {
	      compare = 1;
	      break;
	    }
	  }
	  if (!operator) {
	    return compare;
	  }

	  // important: operator is case-sensitive.
	  // "no operator" seems to be treated as "<."
	  // any other values seem to make the function return null.
	  switch (operator) {
	  case '>':
	  case 'gt':
	    return (compare > 0);
	  case '>=':
	  case 'ge':
	    return (compare >= 0);
	  case '<=':
	  case 'le':
	    return (compare <= 0);
	  case '==':
	  case '=':
	  case 'eq':
	    return (compare === 0);
	  case '<>':
	  case '!=':
	  case 'ne':
	    return (compare !== 0);
	  case '':
	  case '<':
	  case 'lt':
	    return (compare < 0);
	  default:
	    return null;
	  }
	}


	var can = (function() {
		var caps = {
				define_property: (function() {
					/* // currently too much extra code required, not exactly worth it
					try { // as of ie8, getters/setters are supported only on dom elements
						var obj = {};
						if (object.defineproperty) {
							object.defineproperty(obj, 'prop', {
								enumerable: true,
								configurable: true
							});
							return true;
						}
					} catch(ex) {}

					if (object.prototype.__definegetter__ && object.prototype.__definesetter__) {
						return true;
					}*/
					return false;
				}()),

				create_canvas: (function() {
					// on the s60 and bb storm, getcontext exists, but always returns undefined
					// so we actually have to call getcontext() to verify
					// github.com/modernizr/modernizr/issues/issue/97/
					var el = document.createelement('canvas');
					return !!(el.getcontext && el.getcontext('2d'));
				}()),

				return_response_type: function(responsetype) {
					try {
						if (basic.inarray(responsetype, ['', 'text', 'document']) !== -1) {
							return true;
						} else if (window.xmlhttprequest) {
							var xhr = new xmlhttprequest();
							xhr.open('get', '/'); // otherwise gecko throws an exception
							if ('responsetype' in xhr) {
								xhr.responsetype = responsetype;
								// as of 23.0.1271.64, chrome switched from throwing exception to merely logging it to the console (why? o why?)
								if (xhr.responsetype !== responsetype) {
									return false;
								}
								return true;
							}
						}
					} catch (ex) {}
					return false;
				},

				// ideas for this heavily come from modernizr (http://modernizr.com/)
				use_data_uri: (function() {
					var du = new image();

					du.onload = function() {
						caps.use_data_uri = (du.width === 1 && du.height === 1);
					};
					
					settimeout(function() {
						du.src = "data:image/gif;base64,r0lgodlhaqabaiaaap8aaaaaach5baaaaaaalaaaaaabaaeaaaicraeaow==";
					}, 1);
					return false;
				}()),

				use_data_uri_over32kb: function() { // ie8
					return caps.use_data_uri && (env.browser !== 'ie' || env.version >= 9);
				},

				use_data_uri_of: function(bytes) {
					return (caps.use_data_uri && bytes < 33000 || caps.use_data_uri_over32kb());
				},

				use_fileinput: function() {
					if (navigator.useragent.match(/(android (1.0|1.1|1.5|1.6|2.0|2.1))|(windows phone (os 7|8.0))|(xblwp)|(zunewp)|(w(eb)?osbrowser)|(webos)|(kindle\/(1.0|2.0|2.5|3.0))/)) {
						return false;
					}

					var el = document.createelement('input');
					el.setattribute('type', 'file');
					return !el.disabled;
				}
			};

		return function(cap) {
			var args = [].slice.call(arguments);
			args.shift(); // shift of cap
			return basic.typeof(caps[cap]) === 'function' ? caps[cap].apply(this, args) : !!caps[cap];
		};
	}());


	var uaresult = new uaparser().getresult();


	var env = {
		can: can,

		uaparser: uaparser,
		
		browser: uaresult.browser.name,
		version: uaresult.browser.version,
		os: uaresult.os.name, // everybody intuitively types it in a lowercase for some reason
		osversion: uaresult.os.version,

		vercomp: version_compare,

		global_event_dispatcher: "moxie.core.eventtarget.instance.dispatchevent"
	};

	// for backward compatibility
	// @deprecated use `env.os` instead
	env.os = env.os;

	if (mxi_debug) {
		env.debug = {
			runtime: true,
			events: false
		};

		env.log = function() {
			
			function logobj(data) {
				// todo: this should recursively print out the object in a pretty way
				console.appendchild(document.createtextnode(data + "\n"));
			}

			var data = arguments[0];

			if (basic.typeof(data) === 'string') {
				data = basic.sprintf.apply(this, arguments);
			}

			if (window && window.console && window.console.log) {
				window.console.log(data);
			} else if (document) {
				var console = document.getelementbyid('moxie-console');
				if (!console) {
					console = document.createelement('pre');
					console.id = 'moxie-console';
					//console.style.display = 'none';
					document.body.appendchild(console);
				}

				if (basic.inarray(basic.typeof(data), ['object', 'array']) !== -1) {
					logobj(data);
				} else {
					console.appendchild(document.createtextnode(data + "\n"));
				}
			}
		};
	}

	return env;
});

// included from: src/javascript/core/i18n.js

/**
 * i18n.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define("moxie/core/i18n", [
	"moxie/core/utils/basic"
], function(basic) {
	var i18n = {};

	return {
		/**
		 * extends the language pack object with new items.
		 *
		 * @param {object} pack language pack items to add.
		 * @return {object} extended language pack object.
		 */
		addi18n: function(pack) {
			return basic.extend(i18n, pack);
		},

		/**
		 * translates the specified string by checking for the english string in the language pack lookup.
		 *
		 * @param {string} str string to look for.
		 * @return {string} translated string or the input string if it wasn't found.
		 */
		translate: function(str) {
			return i18n[str] || str;
		},

		/**
		 * shortcut for translate function
		 *
		 * @param {string} str string to look for.
		 * @return {string} translated string or the input string if it wasn't found.
		 */
		_: function(str) {
			return this.translate(str);
		},

		/**
		 * pseudo sprintf implementation - simple way to replace tokens with specified values.
		 *
		 * @param {string} str string with tokens
		 * @return {string} string with replaced tokens
		 */
		sprintf: function(str) {
			var args = [].slice.call(arguments, 1);

			return str.replace(/%[a-z]/g, function() {
				var value = args.shift();
				return basic.typeof(value) !== 'undefined' ? value : '';
			});
		}
	};
});

// included from: src/javascript/core/utils/mime.js

/**
 * mime.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define("moxie/core/utils/mime", [
	"moxie/core/utils/basic",
	"moxie/core/i18n"
], function(basic, i18n) {
	
	var mimedata = "" +
		"application/msword,doc dot," +
		"application/pdf,pdf," +
		"application/pgp-signature,pgp," +
		"application/postscript,ps ai eps," +
		"application/rtf,rtf," +
		"application/vnd.ms-excel,xls xlb," +
		"application/vnd.ms-powerpoint,ppt pps pot," +
		"application/zip,zip," +
		"application/x-shockwave-flash,swf swfl," +
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx," +
		"application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx," +
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx," +
		"application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx," +
		"application/vnd.openxmlformats-officedocument.presentationml.template,potx," +
		"application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx," +
		"application/x-javascript,js," +
		"application/json,json," +
		"audio/mpeg,mp3 mpga mpega mp2," +
		"audio/x-wav,wav," +
		"audio/x-m4a,m4a," +
		"audio/ogg,oga ogg," +
		"audio/aiff,aiff aif," +
		"audio/flac,flac," +
		"audio/aac,aac," +
		"audio/ac3,ac3," +
		"audio/x-ms-wma,wma," +
		"image/bmp,bmp," +
		"image/gif,gif," +
		"image/jpeg,jpg jpeg jpe," +
		"image/photoshop,psd," +
		"image/png,png," +
		"image/svg+xml,svg svgz," +
		"image/tiff,tiff tif," +
		"text/plain,asc txt text diff log," +
		"text/html,htm html xhtml," +
		"text/css,css," +
		"text/csv,csv," +
		"text/rtf,rtf," +
		"video/mpeg,mpeg mpg mpe m2v," +
		"video/quicktime,qt mov," +
		"video/mp4,mp4," +
		"video/x-m4v,m4v," +
		"video/x-flv,flv," +
		"video/x-ms-wmv,wmv," +
		"video/avi,avi," +
		"video/webm,webm," +
		"video/3gpp,3gpp 3gp," +
		"video/3gpp2,3g2," +
		"video/vnd.rn-realvideo,rv," +
		"video/ogg,ogv," + 
		"video/x-matroska,mkv," +
		"application/vnd.oasis.opendocument.formula-template,otf," +
		"application/octet-stream,exe";
	
	
	var mime = {

		mimes: {},

		extensions: {},

		// parses the default mime types string into a mimes and extensions lookup maps
		addmimetype: function (mimedata) {
			var items = mimedata.split(/,/), i, ii, ext;
			
			for (i = 0; i < items.length; i += 2) {
				ext = items[i + 1].split(/ /);

				// extension to mime lookup
				for (ii = 0; ii < ext.length; ii++) {
					this.mimes[ext[ii]] = items[i];
				}
				// mime to extension lookup
				this.extensions[items[i]] = ext;
			}
		},


		extlist2mimes: function (filters, addmissingextensions) {
			var self = this, ext, i, ii, type, mimes = [];
			
			// convert extensions to mime types list
			for (i = 0; i < filters.length; i++) {
				ext = filters[i].extensions.split(/\s*,\s*/);

				for (ii = 0; ii < ext.length; ii++) {
					
					// if there's an asterisk in the list, then accept attribute is not required
					if (ext[ii] === '*') {
						return [];
					}

					type = self.mimes[ext[ii]];
					if (type && basic.inarray(type, mimes) === -1) {
						mimes.push(type);
					}

					// future browsers should filter by extension, finally
					if (addmissingextensions && /^\w+$/.test(ext[ii])) {
						mimes.push('.' + ext[ii]);
					} else if (!type) {
						// if we have no type in our map, then accept all
						return [];
					}
				}
			}
			return mimes;
		},


		mimes2exts: function(mimes) {
			var self = this, exts = [];
			
			basic.each(mimes, function(mime) {
				if (mime === '*') {
					exts = [];
					return false;
				}

				// check if this thing looks like mime type
				var m = mime.match(/^(\w+)\/(\*|\w+)$/);
				if (m) {
					if (m[2] === '*') { 
						// wildcard mime type detected
						basic.each(self.extensions, function(arr, mime) {
							if ((new regexp('^' + m[1] + '/')).test(mime)) {
								[].push.apply(exts, self.extensions[mime]);
							}
						});
					} else if (self.extensions[mime]) {
						[].push.apply(exts, self.extensions[mime]);
					}
				}
			});
			return exts;
		},


		mimes2extlist: function(mimes) {
			var accept = [], exts = [];

			if (basic.typeof(mimes) === 'string') {
				mimes = basic.trim(mimes).split(/\s*,\s*/);
			}

			exts = this.mimes2exts(mimes);
			
			accept.push({
				title: i18n.translate('files'),
				extensions: exts.length ? exts.join(',') : '*'
			});
			
			// save original mimes string
			accept.mimes = mimes;

			return accept;
		},


		getfileextension: function(filename) {
			var matches = filename && filename.match(/\.([^.]+)$/);
			if (matches) {
				return matches[1].tolowercase();
			}
			return '';
		},

		getfilemime: function(filename) {
			return this.mimes[this.getfileextension(filename)] || '';
		}
	};

	mime.addmimetype(mimedata);

	return mime;
});

// included from: src/javascript/core/utils/dom.js

/**
 * dom.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/core/utils/dom', ['moxie/core/utils/env'], function(env) {

	/**
	get dom element by it's id.

	@method get
	@for utils
	@param {string} id identifier of the dom element
	@return {domelement}
	*/
	var get = function(id) {
		if (typeof id !== 'string') {
			return id;
		}
		return document.getelementbyid(id);
	};

	/**
	checks if specified dom element has specified class.

	@method hasclass
	@static
	@param {object} obj dom element like object to add handler to.
	@param {string} name class name
	*/
	var hasclass = function(obj, name) {
		if (!obj.classname) {
			return false;
		}

		var regexp = new regexp("(^|\\s+)"+name+"(\\s+|$)");
		return regexp.test(obj.classname);
	};

	/**
	adds specified classname to specified dom element.

	@method addclass
	@static
	@param {object} obj dom element like object to add handler to.
	@param {string} name class name
	*/
	var addclass = function(obj, name) {
		if (!hasclass(obj, name)) {
			obj.classname = !obj.classname ? name : obj.classname.replace(/\s+$/, '') + ' ' + name;
		}
	};

	/**
	removes specified classname from specified dom element.

	@method removeclass
	@static
	@param {object} obj dom element like object to add handler to.
	@param {string} name class name
	*/
	var removeclass = function(obj, name) {
		if (obj.classname) {
			var regexp = new regexp("(^|\\s+)"+name+"(\\s+|$)");
			obj.classname = obj.classname.replace(regexp, function($0, $1, $2) {
				return $1 === ' ' && $2 === ' ' ? ' ' : '';
			});
		}
	};

	/**
	returns a given computed style of a dom element.

	@method getstyle
	@static
	@param {object} obj dom element like object.
	@param {string} name style you want to get from the dom element
	*/
	var getstyle = function(obj, name) {
		if (obj.currentstyle) {
			return obj.currentstyle[name];
		} else if (window.getcomputedstyle) {
			return window.getcomputedstyle(obj, null)[name];
		}
	};


	/**
	returns the absolute x, y position of an element. the position will be returned in a object with x, y fields.

	@method getpos
	@static
	@param {element} node html element or element id to get x, y position from.
	@param {element} root optional root element to stop calculations at.
	@return {object} absolute position of the specified element object with x, y fields.
	*/
	var getpos = function(node, root) {
		var x = 0, y = 0, parent, doc = document, noderect, rootrect;

		node = node;
		root = root || doc.body;

		// returns the x, y cordinate for an element on ie 6 and ie 7
		function getiepos(node) {
			var bodyelm, rect, x = 0, y = 0;

			if (node) {
				rect = node.getboundingclientrect();
				bodyelm = doc.compatmode === "css1compat" ? doc.documentelement : doc.body;
				x = rect.left + bodyelm.scrollleft;
				y = rect.top + bodyelm.scrolltop;
			}

			return {
				x : x,
				y : y
			};
		}

		// use getboundingclientrect on ie 6 and ie 7 but not on ie 8 in standards mode
		if (node && node.getboundingclientrect && env.browser === 'ie' && (!doc.documentmode || doc.documentmode < 8)) {
			noderect = getiepos(node);
			rootrect = getiepos(root);

			return {
				x : noderect.x - rootrect.x,
				y : noderect.y - rootrect.y
			};
		}

		parent = node;
		while (parent && parent != root && parent.nodetype) {
			x += parent.offsetleft || 0;
			y += parent.offsettop || 0;
			parent = parent.offsetparent;
		}

		parent = node.parentnode;
		while (parent && parent != root && parent.nodetype) {
			x -= parent.scrollleft || 0;
			y -= parent.scrolltop || 0;
			parent = parent.parentnode;
		}

		return {
			x : x,
			y : y
		};
	};

	/**
	returns the size of the specified node in pixels.

	@method getsize
	@static
	@param {node} node node to get the size of.
	@return {object} object with a w and h property.
	*/
	var getsize = function(node) {
		return {
			w : node.offsetwidth || node.clientwidth,
			h : node.offsetheight || node.clientheight
		};
	};

	return {
		get: get,
		hasclass: hasclass,
		addclass: addclass,
		removeclass: removeclass,
		getstyle: getstyle,
		getpos: getpos,
		getsize: getsize
	};
});

// included from: src/javascript/core/exceptions.js

/**
 * exceptions.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/core/exceptions', [
	'moxie/core/utils/basic'
], function(basic) {
	function _findkey(obj, value) {
		var key;
		for (key in obj) {
			if (obj[key] === value) {
				return key;
			}
		}
		return null;
	}

	return {
		runtimeerror: (function() {
			var namecodes = {
				not_init_err: 1,
				not_supported_err: 9,
				js_err: 4
			};

			function runtimeerror(code) {
				this.code = code;
				this.name = _findkey(namecodes, code);
				this.message = this.name + ": runtimeerror " + this.code;
			}
			
			basic.extend(runtimeerror, namecodes);
			runtimeerror.prototype = error.prototype;
			return runtimeerror;
		}()),
		
		operationnotallowedexception: (function() {
			
			function operationnotallowedexception(code) {
				this.code = code;
				this.name = 'operationnotallowedexception';
			}
			
			basic.extend(operationnotallowedexception, {
				not_allowed_err: 1
			});
			
			operationnotallowedexception.prototype = error.prototype;
			
			return operationnotallowedexception;
		}()),

		imageerror: (function() {
			var namecodes = {
				wrong_format: 1,
				max_resolution_err: 2,
				invalid_meta_err: 3
			};

			function imageerror(code) {
				this.code = code;
				this.name = _findkey(namecodes, code);
				this.message = this.name + ": imageerror " + this.code;
			}
			
			basic.extend(imageerror, namecodes);
			imageerror.prototype = error.prototype;

			return imageerror;
		}()),

		fileexception: (function() {
			var namecodes = {
				not_found_err: 1,
				security_err: 2,
				abort_err: 3,
				not_readable_err: 4,
				encoding_err: 5,
				no_modification_allowed_err: 6,
				invalid_state_err: 7,
				syntax_err: 8
			};

			function fileexception(code) {
				this.code = code;
				this.name = _findkey(namecodes, code);
				this.message = this.name + ": fileexception " + this.code;
			}
			
			basic.extend(fileexception, namecodes);
			fileexception.prototype = error.prototype;
			return fileexception;
		}()),
		
		domexception: (function() {
			var namecodes = {
				index_size_err: 1,
				domstring_size_err: 2,
				hierarchy_request_err: 3,
				wrong_document_err: 4,
				invalid_character_err: 5,
				no_data_allowed_err: 6,
				no_modification_allowed_err: 7,
				not_found_err: 8,
				not_supported_err: 9,
				inuse_attribute_err: 10,
				invalid_state_err: 11,
				syntax_err: 12,
				invalid_modification_err: 13,
				namespace_err: 14,
				invalid_access_err: 15,
				validation_err: 16,
				type_mismatch_err: 17,
				security_err: 18,
				network_err: 19,
				abort_err: 20,
				url_mismatch_err: 21,
				quota_exceeded_err: 22,
				timeout_err: 23,
				invalid_node_type_err: 24,
				data_clone_err: 25
			};

			function domexception(code) {
				this.code = code;
				this.name = _findkey(namecodes, code);
				this.message = this.name + ": domexception " + this.code;
			}
			
			basic.extend(domexception, namecodes);
			domexception.prototype = error.prototype;
			return domexception;
		}()),
		
		eventexception: (function() {
			function eventexception(code) {
				this.code = code;
				this.name = 'eventexception';
			}
			
			basic.extend(eventexception, {
				unspecified_event_type_err: 0
			});
			
			eventexception.prototype = error.prototype;
			
			return eventexception;
		}())
	};
});

// included from: src/javascript/core/eventtarget.js

/**
 * eventtarget.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/core/eventtarget', [
	'moxie/core/utils/env',
	'moxie/core/exceptions',
	'moxie/core/utils/basic'
], function(env, x, basic) {
	/**
	parent object for all event dispatching components and objects

	@class eventtarget
	@constructor eventtarget
	*/
	function eventtarget() {
		// hash of event listeners by object uid
		var eventpool = {};
				
		basic.extend(this, {
			
			/**
			unique id of the event dispatcher, usually overriden by children

			@property uid
			@type string
			*/
			uid: null,
			
			/**
			can be called from within a child  in order to acquire uniqie id in automated manner

			@method init
			*/
			init: function() {
				if (!this.uid) {
					this.uid = basic.guid('uid_');
				}
			},

			/**
			register a handler to a specific event dispatched by the object

			@method addeventlistener
			@param {string} type type or basically a name of the event to subscribe to
			@param {function} fn callback function that will be called when event happens
			@param {number} [priority=0] priority of the event handler - handlers with higher priorities will be called first
			@param {object} [scope=this] a scope to invoke event handler in
			*/
			addeventlistener: function(type, fn, priority, scope) {
				var self = this, list;

				// without uid no event handlers can be added, so make sure we got one
				if (!this.hasownproperty('uid')) {
					this.uid = basic.guid('uid_');
				}
				
				type = basic.trim(type);
				
				if (/\s/.test(type)) {
					// multiple event types were passed for one handler
					basic.each(type.split(/\s+/), function(type) {
						self.addeventlistener(type, fn, priority, scope);
					});
					return;
				}
				
				type = type.tolowercase();
				priority = parseint(priority, 10) || 0;
				
				list = eventpool[this.uid] && eventpool[this.uid][type] || [];
				list.push({fn : fn, priority : priority, scope : scope || this});
				
				if (!eventpool[this.uid]) {
					eventpool[this.uid] = {};
				}
				eventpool[this.uid][type] = list;
			},
			
			/**
			check if any handlers were registered to the specified event

			@method haseventlistener
			@param {string} type type or basically a name of the event to check
			@return {mixed} returns a handler if it was found and false, if - not
			*/
			haseventlistener: function(type) {
				var list = type ? eventpool[this.uid] && eventpool[this.uid][type] : eventpool[this.uid];
				return list ? list : false;
			},
			
			/**
			unregister the handler from the event, or if former was not specified - unregister all handlers

			@method removeeventlistener
			@param {string} type type or basically a name of the event
			@param {function} [fn] handler to unregister
			*/
			removeeventlistener: function(type, fn) {
				type = type.tolowercase();
	
				var list = eventpool[this.uid] && eventpool[this.uid][type], i;
	
				if (list) {
					if (fn) {
						for (i = list.length - 1; i >= 0; i--) {
							if (list[i].fn === fn) {
								list.splice(i, 1);
								break;
							}
						}
					} else {
						list = [];
					}
	
					// delete event list if it has become empty
					if (!list.length) {
						delete eventpool[this.uid][type];
						
						// and object specific entry in a hash if it has no more listeners attached
						if (basic.isemptyobj(eventpool[this.uid])) {
							delete eventpool[this.uid];
						}
					}
				}
			},
			
			/**
			remove all event handlers from the object

			@method removealleventlisteners
			*/
			removealleventlisteners: function() {
				if (eventpool[this.uid]) {
					delete eventpool[this.uid];
				}
			},
			
			/**
			dispatch the event

			@method dispatchevent
			@param {string/object} type of event or event object to dispatch
			@param {mixed} [...] variable number of arguments to be passed to a handlers
			@return {boolean} true by default and false if any handler returned false
			*/
			dispatchevent: function(type) {
				var uid, list, args, tmpevt, evt = {}, result = true, undef;
				
				if (basic.typeof(type) !== 'string') {
					// we can't use original object directly (because of silverlight)
					tmpevt = type;

					if (basic.typeof(tmpevt.type) === 'string') {
						type = tmpevt.type;

						if (tmpevt.total !== undef && tmpevt.loaded !== undef) { // progress event
							evt.total = tmpevt.total;
							evt.loaded = tmpevt.loaded;
						}
						evt.async = tmpevt.async || false;
					} else {
						throw new x.eventexception(x.eventexception.unspecified_event_type_err);
					}
				}
				
				// check if event is meant to be dispatched on an object having specific uid
				if (type.indexof('::') !== -1) {
					(function(arr) {
						uid = arr[0];
						type = arr[1];
					}(type.split('::')));
				} else {
					uid = this.uid;
				}
				
				type = type.tolowercase();
								
				list = eventpool[uid] && eventpool[uid][type];

				if (list) {
					// sort event list by prority
					list.sort(function(a, b) { return b.priority - a.priority; });
					
					args = [].slice.call(arguments);
					
					// first argument will be pseudo-event object
					args.shift();
					evt.type = type;
					args.unshift(evt);

					if (mxi_debug && env.debug.events) {
						env.log("event '%s' fired on %u", evt.type, uid);	
					}

					// dispatch event to all listeners
					var queue = [];
					basic.each(list, function(handler) {
						// explicitly set the target, otherwise events fired from shims do not get it
						args[0].target = handler.scope;
						// if event is marked as async, detach the handler
						if (evt.async) {
							queue.push(function(cb) {
								settimeout(function() {
									cb(handler.fn.apply(handler.scope, args) === false);
								}, 1);
							});
						} else {
							queue.push(function(cb) {
								cb(handler.fn.apply(handler.scope, args) === false); // if handler returns false stop propagation
							});
						}
					});
					if (queue.length) {
						basic.inseries(queue, function(err) {
							result = !err;
						});
					}
				}
				return result;
			},
			
			/**
			alias for addeventlistener

			@method bind
			@protected
			*/
			bind: function() {
				this.addeventlistener.apply(this, arguments);
			},
			
			/**
			alias for removeeventlistener

			@method unbind
			@protected
			*/
			unbind: function() {
				this.removeeventlistener.apply(this, arguments);
			},
			
			/**
			alias for removealleventlisteners

			@method unbindall
			@protected
			*/
			unbindall: function() {
				this.removealleventlisteners.apply(this, arguments);
			},
			
			/**
			alias for dispatchevent

			@method trigger
			@protected
			*/
			trigger: function() {
				return this.dispatchevent.apply(this, arguments);
			},
			

			/**
			handle properties of on[event] type.

			@method handleeventprops
			@private
			*/
			handleeventprops: function(dispatches) {
				var self = this;

				this.bind(dispatches.join(' '), function(e) {
					var prop = 'on' + e.type.tolowercase();
					if (basic.typeof(this[prop]) === 'function') {
						this[prop].apply(this, arguments);
					}
				});

				// object must have defined event properties, even if it doesn't make use of them
				basic.each(dispatches, function(prop) {
					prop = 'on' + prop.tolowercase(prop);
					if (basic.typeof(self[prop]) === 'undefined') {
						self[prop] = null; 
					}
				});
			}
			
		});
	}

	eventtarget.instance = new eventtarget(); 

	return eventtarget;
});

// included from: src/javascript/runtime/runtime.js

/**
 * runtime.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/runtime/runtime', [
	"moxie/core/utils/env",
	"moxie/core/utils/basic",
	"moxie/core/utils/dom",
	"moxie/core/eventtarget"
], function(env, basic, dom, eventtarget) {
	var runtimeconstructors = {}, runtimes = {};

	/**
	common set of methods and properties for every runtime instance

	@class runtime

	@param {object} options
	@param {string} type sanitized name of the runtime
	@param {object} [caps] set of capabilities that differentiate specified runtime
	@param {object} [modecaps] set of capabilities that do require specific operational mode
	@param {string} [preferredmode='browser'] preferred operational mode to choose if no required capabilities were requested
	*/
	function runtime(options, type, caps, modecaps, preferredmode) {
		/**
		dispatched when runtime is initialized and ready.
		results in runtimeinit on a connected component.

		@event init
		*/

		/**
		dispatched when runtime fails to initialize.
		results in runtimeerror on a connected component.

		@event error
		*/

		var self = this
		, _shim
		, _uid = basic.guid(type + '_')
		, defaultmode = preferredmode || 'browser'
		;

		options = options || {};

		// register runtime in private hash
		runtimes[_uid] = this;

		/**
		default set of capabilities, which can be redifined later by specific runtime

		@private
		@property caps
		@type object
		*/
		caps = basic.extend({
			// runtime can: 
			// provide access to raw binary data of the file
			access_binary: false,
			// provide access to raw binary data of the image (image extension is optional) 
			access_image_binary: false,
			// display binary data as thumbs for example
			display_media: false,
			// make cross-domain requests
			do_cors: false,
			// accept files dragged and dropped from the desktop
			drag_and_drop: false,
			// filter files in selection dialog by their extensions
			filter_by_extension: true,
			// resize image (and manipulate it raw data of any file in general)
			resize_image: false,
			// periodically report how many bytes of total in the file were uploaded (loaded)
			report_upload_progress: false,
			// provide access to the headers of http response 
			return_response_headers: false,
			// support response of specific type, which should be passed as an argument
			// e.g. runtime.can('return_response_type', 'blob')
			return_response_type: false,
			// return http status code of the response
			return_status_code: true,
			// send custom http header with the request
			send_custom_headers: false,
			// pick up the files from a dialog
			select_file: false,
			// select whole folder in file browse dialog
			select_folder: false,
			// select multiple files at once in file browse dialog
			select_multiple: true,
			// send raw binary data, that is generated after image resizing or manipulation of other kind
			send_binary_string: false,
			// send cookies with http request and therefore retain session
			send_browser_cookies: true,
			// send data formatted as multipart/form-data
			send_multipart: true,
			// slice the file or blob to smaller parts
			slice_blob: false,
			// upload file without preloading it to memory, stream it out directly from disk
			stream_upload: false,
			// programmatically trigger file browse dialog
			summon_file_dialog: false,
			// upload file of specific size, size should be passed as argument
			// e.g. runtime.can('upload_filesize', '500mb')
			upload_filesize: true,
			// initiate http request with specific http method, method should be passed as argument
			// e.g. runtime.can('use_http_method', 'put')
			use_http_method: true
		}, caps);
			
	
		// default to the mode that is compatible with preferred caps
		if (options.preferred_caps) {
			defaultmode = runtime.getmode(modecaps, options.preferred_caps, defaultmode);
		}

		if (mxi_debug && env.debug.runtime) {
			env.log("\tdefault mode: %s", defaultmode);	
		}
		
		// small extension factory here (is meant to be extended with actual extensions constructors)
		_shim = (function() {
			var objpool = {};
			return {
				exec: function(uid, comp, fn, args) {
					if (_shim[comp]) {
						if (!objpool[uid]) {
							objpool[uid] = {
								context: this,
								instance: new _shim[comp]()
							};
						}
						if (objpool[uid].instance[fn]) {
							return objpool[uid].instance[fn].apply(this, args);
						}
					}
				},

				removeinstance: function(uid) {
					delete objpool[uid];
				},

				removeallinstances: function() {
					var self = this;
					basic.each(objpool, function(obj, uid) {
						if (basic.typeof(obj.instance.destroy) === 'function') {
							obj.instance.destroy.call(obj.context);
						}
						self.removeinstance(uid);
					});
				}
			};
		}());


		// public methods
		basic.extend(this, {
			/**
			specifies whether runtime instance was initialized or not

			@property initialized
			@type {boolean}
			@default false
			*/
			initialized: false, // shims require this flag to stop initialization retries

			/**
			unique id of the runtime

			@property uid
			@type {string}
			*/
			uid: _uid,

			/**
			runtime type (e.g. flash, html5, etc)

			@property type
			@type {string}
			*/
			type: type,

			/**
			runtime (not native one) may operate in browser or client mode.

			@property mode
			@private
			@type {string|boolean} current mode or false, if none possible
			*/
			mode: runtime.getmode(modecaps, (options.required_caps), defaultmode),

			/**
			id of the dom container for the runtime (if available)

			@property shimid
			@type {string}
			*/
			shimid: _uid + '_container',

			/**
			number of connected clients. if equal to zero, runtime can be destroyed

			@property clients
			@type {number}
			*/
			clients: 0,

			/**
			runtime initialization options

			@property options
			@type {object}
			*/
			options: options,

			/**
			checks if the runtime has specific capability

			@method can
			@param {string} cap name of capability to check
			@param {mixed} [value] if passed, capability should somehow correlate to the value
			@param {object} [refcaps] set of capabilities to check the specified cap against (defaults to internal set)
			@return {boolean} true if runtime has such capability and false, if - not
			*/
			can: function(cap, value) {
				var refcaps = arguments[2] || caps;

				// if cap var is a comma-separated list of caps, convert it to object (key/value)
				if (basic.typeof(cap) === 'string' && basic.typeof(value) === 'undefined') {
					cap = runtime.parsecaps(cap);
				}

				if (basic.typeof(cap) === 'object') {
					for (var key in cap) {
						if (!this.can(key, cap[key], refcaps)) {
							return false;
						}
					}
					return true;
				}

				// check the individual cap
				if (basic.typeof(refcaps[cap]) === 'function') {
					return refcaps[cap].call(this, value);
				} else {
					return (value === refcaps[cap]);
				}
			},

			/**
			returns container for the runtime as dom element

			@method getshimcontainer
			@return {domelement}
			*/
			getshimcontainer: function() {
				var container, shimcontainer = dom.get(this.shimid);

				// if no container for shim, create one
				if (!shimcontainer) {
					container = this.options.container ? dom.get(this.options.container) : document.body;

					// create shim container and insert it at an absolute position into the outer container
					shimcontainer = document.createelement('div');
					shimcontainer.id = this.shimid;
					shimcontainer.classname = 'moxie-shim moxie-shim-' + this.type;

					basic.extend(shimcontainer.style, {
						position: 'absolute',
						top: '0px',
						left: '0px',
						width: '1px',
						height: '1px',
						overflow: 'hidden'
					});

					container.appendchild(shimcontainer);
					container = null;
				}

				return shimcontainer;
			},

			/**
			returns runtime as dom element (if appropriate)

			@method getshim
			@return {domelement}
			*/
			getshim: function() {
				return _shim;
			},

			/**
			invokes a method within the runtime itself (might differ across the runtimes)

			@method shimexec
			@param {mixed} []
			@protected
			@return {mixed} depends on the action and component
			*/
			shimexec: function(component, action) {
				var args = [].slice.call(arguments, 2);
				return self.getshim().exec.call(this, this.uid, component, action, args);
			},

			/**
			operaional interface that is used by components to invoke specific actions on the runtime
			(is invoked in the scope of component)

			@method exec
			@param {mixed} []*
			@protected
			@return {mixed} depends on the action and component
			*/
			exec: function(component, action) { // this is called in the context of component, not runtime
				var args = [].slice.call(arguments, 2);

				if (self[component] && self[component][action]) {
					return self[component][action].apply(this, args);
				}
				return self.shimexec.apply(this, arguments);
			},

			/**
			destroys the runtime (removes all events and deletes dom structures)

			@method destroy
			*/
			destroy: function() {
				if (!self) {
					return; // obviously already destroyed
				}

				var shimcontainer = dom.get(this.shimid);
				if (shimcontainer) {
					shimcontainer.parentnode.removechild(shimcontainer);
				}

				if (_shim) {
					_shim.removeallinstances();
				}

				this.unbindall();
				delete runtimes[this.uid];
				this.uid = null; // mark this runtime as destroyed
				_uid = self = _shim = shimcontainer = null;
			}
		});

		// once we got the mode, test against all caps
		if (this.mode && options.required_caps && !this.can(options.required_caps)) {
			this.mode = false;
		}	
	}


	/**
	default order to try different runtime types

	@property order
	@type string
	@static
	*/
	runtime.order = 'html5,html4';


	/**
	retrieves runtime from private hash by it's uid

	@method getruntime
	@private
	@static
	@param {string} uid unique identifier of the runtime
	@return {runtime|boolean} returns runtime, if it exists and false, if - not
	*/
	runtime.getruntime = function(uid) {
		return runtimes[uid] ? runtimes[uid] : false;
	};


	/**
	register constructor for the runtime of new (or perhaps modified) type

	@method addconstructor
	@static
	@param {string} type runtime type (e.g. flash, html5, etc)
	@param {function} construct constructor for the runtime type
	*/
	runtime.addconstructor = function(type, constructor) {
		constructor.prototype = eventtarget.instance;
		runtimeconstructors[type] = constructor;
	};


	/**
	get the constructor for the specified type.

	method getconstructor
	@static
	@param {string} type runtime type (e.g. flash, html5, etc)
	@return {function} constructor for the runtime type
	*/
	runtime.getconstructor = function(type) {
		return runtimeconstructors[type] || null;
	};


	/**
	get info about the runtime (uid, type, capabilities)

	@method getinfo
	@static
	@param {string} uid unique identifier of the runtime
	@return {mixed} info object or null if runtime doesn't exist
	*/
	runtime.getinfo = function(uid) {
		var runtime = runtime.getruntime(uid);

		if (runtime) {
			return {
				uid: runtime.uid,
				type: runtime.type,
				mode: runtime.mode,
				can: function() {
					return runtime.can.apply(runtime, arguments);
				}
			};
		}
		return null;
	};


	/**
	convert caps represented by a comma-separated string to the object representation.

	@method parsecaps
	@static
	@param {string} capstr comma-separated list of capabilities
	@return {object}
	*/
	runtime.parsecaps = function(capstr) {
		var capobj = {};

		if (basic.typeof(capstr) !== 'string') {
			return capstr || {};
		}

		basic.each(capstr.split(','), function(key) {
			capobj[key] = true; // we assume it to be - true
		});

		return capobj;
	};

	/**
	test the specified runtime for specific capabilities.

	@method can
	@static
	@param {string} type runtime type (e.g. flash, html5, etc)
	@param {string|object} caps set of capabilities to check
	@return {boolean} result of the test
	*/
	runtime.can = function(type, caps) {
		var runtime
		, constructor = runtime.getconstructor(type)
		, mode
		;
		if (constructor) {
			runtime = new constructor({
				required_caps: caps
			});
			mode = runtime.mode;
			runtime.destroy();
			return !!mode;
		}
		return false;
	};


	/**
	figure out a runtime that supports specified capabilities.

	@method thatcan
	@static
	@param {string|object} caps set of capabilities to check
	@param {string} [runtimeorder] comma-separated list of runtimes to check against
	@return {string} usable runtime identifier or null
	*/
	runtime.thatcan = function(caps, runtimeorder) {
		var types = (runtimeorder || runtime.order).split(/\s*,\s*/);
		for (var i in types) {
			if (runtime.can(types[i], caps)) {
				return types[i];
			}
		}
		return null;
	};


	/**
	figure out an operational mode for the specified set of capabilities.

	@method getmode
	@static
	@param {object} modecaps set of capabilities that depend on particular runtime mode
	@param {object} [requiredcaps] supplied set of capabilities to find operational mode for
	@param {string|boolean} [defaultmode='browser'] default mode to use 
	@return {string|boolean} compatible operational mode
	*/
	runtime.getmode = function(modecaps, requiredcaps, defaultmode) {
		var mode = null;

		if (basic.typeof(defaultmode) === 'undefined') { // only if not specified
			defaultmode = 'browser';
		}

		if (requiredcaps && !basic.isemptyobj(modecaps)) {
			// loop over required caps and check if they do require the same mode
			basic.each(requiredcaps, function(value, cap) {
				if (modecaps.hasownproperty(cap)) {
					var capmode = modecaps[cap](value);

					// make sure we always have an array
					if (typeof(capmode) === 'string') {
						capmode = [capmode];
					}
					
					if (!mode) {
						mode = capmode;						
					} else if (!(mode = basic.arrayintersect(mode, capmode))) {
						// if cap requires conflicting mode - runtime cannot fulfill required caps

						if (mxi_debug && env.debug.runtime) {
							env.log("\t\t%c: %v (conflicting mode requested: %s)", cap, value, capmode);	
						}

						return (mode = false);
					}					
				}

				if (mxi_debug && env.debug.runtime) {
					env.log("\t\t%c: %v (compatible modes: %s)", cap, value, mode);	
				}
			});

			if (mode) {
				return basic.inarray(defaultmode, mode) !== -1 ? defaultmode : mode[0];
			} else if (mode === false) {
				return false;
			}
		}
		return defaultmode; 
	};


	/**
	capability check that always returns true

	@private
	@static
	@return {true}
	*/
	runtime.captrue = function() {
		return true;
	};

	/**
	capability check that always returns false

	@private
	@static
	@return {false}
	*/
	runtime.capfalse = function() {
		return false;
	};

	/**
	evaluate the expression to boolean value and create a function that always returns it.

	@private
	@static
	@param {mixed} expr expression to evaluate
	@return {function} function returning the result of evaluation
	*/
	runtime.captest = function(expr) {
		return function() {
			return !!expr;
		};
	};

	return runtime;
});

// included from: src/javascript/runtime/runtimeclient.js

/**
 * runtimeclient.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/runtime/runtimeclient', [
	'moxie/core/utils/env',
	'moxie/core/exceptions',
	'moxie/core/utils/basic',
	'moxie/runtime/runtime'
], function(env, x, basic, runtime) {
	/**
	set of methods and properties, required by a component to acquire ability to connect to a runtime

	@class runtimeclient
	*/
	return function runtimeclient() {
		var runtime;

		basic.extend(this, {
			/**
			connects to the runtime specified by the options. will either connect to existing runtime or create a new one.
			increments number of clients connected to the specified runtime.

			@private
			@method connectruntime
			@param {mixed} options can be a runtme uid or a set of key-value pairs defining requirements and pre-requisites
			*/
			connectruntime: function(options) {
				var comp = this, ruid;

				function initialize(items) {
					var type, constructor;

					// if we ran out of runtimes
					if (!items.length) {
						comp.trigger('runtimeerror', new x.runtimeerror(x.runtimeerror.not_init_err));
						runtime = null;
						return;
					}

					type = items.shift().tolowercase();
					constructor = runtime.getconstructor(type);
					if (!constructor) {
						initialize(items);
						return;
					}

					if (mxi_debug && env.debug.runtime) {
						env.log("trying runtime: %s", type);
						env.log(options);
					}

					// try initializing the runtime
					runtime = new constructor(options);

					runtime.bind('init', function() {
						// mark runtime as initialized
						runtime.initialized = true;

						if (mxi_debug && env.debug.runtime) {
							env.log("runtime '%s' initialized", runtime.type);
						}

						// jailbreak ...
						settimeout(function() {
							runtime.clients++;
							// this will be triggered on component
							comp.trigger('runtimeinit', runtime);
						}, 1);
					});

					runtime.bind('error', function() {
						if (mxi_debug && env.debug.runtime) {
							env.log("runtime '%s' failed to initialize", runtime.type);
						}

						runtime.destroy(); // runtime cannot destroy itself from inside at a right moment, thus we do it here
						initialize(items);
					});

					/*runtime.bind('exception', function() { });*/

					if (mxi_debug && env.debug.runtime) {
						env.log("\tselected mode: %s", runtime.mode);	
					}

					// check if runtime managed to pick-up operational mode
					if (!runtime.mode) {
						runtime.trigger('error');
						return;
					}

					runtime.init();
				}

				// check if a particular runtime was requested
				if (basic.typeof(options) === 'string') {
					ruid = options;
				} else if (basic.typeof(options.ruid) === 'string') {
					ruid = options.ruid;
				}

				if (ruid) {
					runtime = runtime.getruntime(ruid);
					if (runtime) {
						runtime.clients++;
						return runtime;
					} else {
						// there should be a runtime and there's none - weird case
						throw new x.runtimeerror(x.runtimeerror.not_init_err);
					}
				}

				// initialize a fresh one, that fits runtime list and required features best
				initialize((options.runtime_order || runtime.order).split(/\s*,\s*/));
			},


			/**
			disconnects from the runtime. decrements number of clients connected to the specified runtime.

			@private
			@method disconnectruntime
			*/
			disconnectruntime: function() {
				if (runtime && --runtime.clients <= 0) {
					runtime.destroy();
				}

				// once the component is disconnected, it shouldn't have access to the runtime
				runtime = null;
			},


			/**
			returns the runtime to which the client is currently connected.

			@method getruntime
			@return {runtime} runtime or null if client is not connected
			*/
			getruntime: function() {
				if (runtime && runtime.uid) {
					return runtime;
				}
				return runtime = null; // make sure we do not leave zombies rambling around
			},


			/**
			handy shortcut to safely invoke runtime extension methods.
			
			@private
			@method exec
			@return {mixed} whatever runtime extension method returns
			*/
			exec: function() {
				if (runtime) {
					return runtime.exec.apply(this, arguments);
				}
				return null;
			}

		});
	};


});

// included from: src/javascript/file/fileinput.js

/**
 * fileinput.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/file/fileinput', [
	'moxie/core/utils/basic',
	'moxie/core/utils/env',
	'moxie/core/utils/mime',
	'moxie/core/utils/dom',
	'moxie/core/exceptions',
	'moxie/core/eventtarget',
	'moxie/core/i18n',
	'moxie/runtime/runtime',
	'moxie/runtime/runtimeclient'
], function(basic, env, mime, dom, x, eventtarget, i18n, runtime, runtimeclient) {
	/**
	provides a convenient way to create cross-browser file-picker. generates file selection dialog on click,
	converts selected files to _file_ objects, to be used in conjunction with _image_, preloaded in memory
	with _filereader_ or uploaded to a server through _xmlhttprequest_.

	@class fileinput
	@constructor
	@extends eventtarget
	@uses runtimeclient
	@param {object|string|domelement} options if options is string or node, argument is considered as _browse\_button_.
		@param {string|domelement} options.browse_button dom element to turn into file picker.
		@param {array} [options.accept] array of mime types to accept. by default accepts all.
		@param {string} [options.file='file'] name of the file field (not the filename).
		@param {boolean} [options.multiple=false] enable selection of multiple files.
		@param {boolean} [options.directory=false] turn file input into the folder input (cannot be both at the same time).
		@param {string|domelement} [options.container] dom element to use as a container for file-picker. defaults to parentnode 
		for _browse\_button_.
		@param {object|string} [options.required_caps] set of required capabilities, that chosen runtime must support.

	@example
		<div id="container">
			<a id="file-picker" href="javascript:;">browse...</a>
		</div>

		<script>
			var fileinput = new moxie.fileinput({
				browse_button: 'file-picker', // or document.getelementbyid('file-picker')
				container: 'container',
				accept: [
					{title: "image files", extensions: "jpg,gif,png"} // accept only images
				],
				multiple: true // allow multiple file selection
			});

			fileinput.onchange = function(e) {
				// do something to files array
				console.info(e.target.files); // or this.files or fileinput.files
			};

			fileinput.init(); // initialize
		</script>
	*/
	var dispatches = [
		/**
		dispatched when runtime is connected and file-picker is ready to be used.

		@event ready
		@param {object} event
		*/
		'ready',

		/**
		dispatched right after [ready](#event_ready) event, and whenever [refresh()](#method_refresh) is invoked. 
		check [corresponding documentation entry](#method_refresh) for more info.

		@event refresh
		@param {object} event
		*/

		/**
		dispatched when selection of files in the dialog is complete.

		@event change
		@param {object} event
		*/
		'change',

		'cancel', // todo: might be useful

		/**
		dispatched when mouse cursor enters file-picker area. can be used to style element
		accordingly.

		@event mouseenter
		@param {object} event
		*/
		'mouseenter',

		/**
		dispatched when mouse cursor leaves file-picker area. can be used to style element
		accordingly.

		@event mouseleave
		@param {object} event
		*/
		'mouseleave',

		/**
		dispatched when functional mouse button is pressed on top of file-picker area.

		@event mousedown
		@param {object} event
		*/
		'mousedown',

		/**
		dispatched when functional mouse button is released on top of file-picker area.

		@event mouseup
		@param {object} event
		*/
		'mouseup'
	];

	function fileinput(options) {
		if (mxi_debug) {
			env.log("instantiating fileinput...");	
		}

		var self = this,
			container, browsebutton, defaults;

		// if flat argument passed it should be browse_button id
		if (basic.inarray(basic.typeof(options), ['string', 'node']) !== -1) {
			options = { browse_button : options };
		}

		// this will help us to find proper default container
		browsebutton = dom.get(options.browse_button);
		if (!browsebutton) {
			// browse button is required
			throw new x.domexception(x.domexception.not_found_err);
		}

		// figure out the options
		defaults = {
			accept: [{
				title: i18n.translate('all files'),
				extensions: '*'
			}],
			name: 'file',
			multiple: false,
			required_caps: false,
			container: browsebutton.parentnode || document.body
		};
		
		options = basic.extend({}, defaults, options);

		// convert to object representation
		if (typeof(options.required_caps) === 'string') {
			options.required_caps = runtime.parsecaps(options.required_caps);
		}
					
		// normalize accept option (could be list of mime types or array of title/extensions pairs)
		if (typeof(options.accept) === 'string') {
			options.accept = mime.mimes2extlist(options.accept);
		}

		container = dom.get(options.container);
		// make sure we have container
		if (!container) {
			container = document.body;
		}

		// make container relative, if it's not
		if (dom.getstyle(container, 'position') === 'static') {
			container.style.position = 'relative';
		}

		container = browsebutton = null; // ie
						
		runtimeclient.call(self);
		
		basic.extend(self, {
			/**
			unique id of the component

			@property uid
			@protected
			@readonly
			@type {string}
			@default uid
			*/
			uid: basic.guid('uid_'),
			
			/**
			unique id of the connected runtime, if any.

			@property ruid
			@protected
			@type {string}
			*/
			ruid: null,

			/**
			unique id of the runtime container. useful to get hold of it for various manipulations.

			@property shimid
			@protected
			@type {string}
			*/
			shimid: null,
			
			/**
			array of selected moxie.file objects

			@property files
			@type {array}
			@default null
			*/
			files: null,

			/**
			initializes the file-picker, connects it to runtime and dispatches event ready when done.

			@method init
			*/
			init: function() {
				self.bind('runtimeinit', function(e, runtime) {
					self.ruid = runtime.uid;
					self.shimid = runtime.shimid;

					self.bind("ready", function() {
						self.trigger("refresh");
					}, 999);

					// re-position and resize shim container
					self.bind('refresh', function() {
						var pos, size, browsebutton, shimcontainer;
						
						browsebutton = dom.get(options.browse_button);
						shimcontainer = dom.get(runtime.shimid); // do not use runtime.getshimcontainer(), since it will create container if it doesn't exist

						if (browsebutton) {
							pos = dom.getpos(browsebutton, dom.get(options.container));
							size = dom.getsize(browsebutton);

							if (shimcontainer) {
								basic.extend(shimcontainer.style, {
									top     : pos.y + 'px',
									left    : pos.x + 'px',
									width   : size.w + 'px',
									height  : size.h + 'px'
								});
							}
						}
						shimcontainer = browsebutton = null;
					});
					
					runtime.exec.call(self, 'fileinput', 'init', options);
				});

				// runtime needs: options.required_features, options.runtime_order and options.container
				self.connectruntime(basic.extend({}, options, {
					required_caps: {
						select_file: true
					}
				}));
			},

			/**
			disables file-picker element, so that it doesn't react to mouse clicks.

			@method disable
			@param {boolean} [state=true] disable component if - true, enable if - false
			*/
			disable: function(state) {
				var runtime = this.getruntime();
				if (runtime) {
					runtime.exec.call(this, 'fileinput', 'disable', basic.typeof(state) === 'undefined' ? true : state);
				}
			},


			/**
			reposition and resize dialog trigger to match the position and size of browse_button element.

			@method refresh
			*/
			refresh: function() {
				self.trigger("refresh");
			},


			/**
			destroy component.

			@method destroy
			*/
			destroy: function() {
				var runtime = this.getruntime();
				if (runtime) {
					runtime.exec.call(this, 'fileinput', 'destroy');
					this.disconnectruntime();
				}

				if (basic.typeof(this.files) === 'array') {
					// no sense in leaving associated files behind
					basic.each(this.files, function(file) {
						file.destroy();
					});
				} 
				this.files = null;

				this.unbindall();
			}
		});

		this.handleeventprops(dispatches);
	}

	fileinput.prototype = eventtarget.instance;

	return fileinput;
});

// included from: src/javascript/core/utils/encode.js

/**
 * encode.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/core/utils/encode', [], function() {

	/**
	encode string with utf-8

	@method utf8_encode
	@for utils
	@static
	@param {string} str string to encode
	@return {string} utf-8 encoded string
	*/
	var utf8_encode = function(str) {
		return unescape(encodeuricomponent(str));
	};
	
	/**
	decode utf-8 encoded string

	@method utf8_decode
	@static
	@param {string} str string to decode
	@return {string} decoded string
	*/
	var utf8_decode = function(str_data) {
		return decodeuricomponent(escape(str_data));
	};
	
	/**
	decode base64 encoded string (uses browser's default method if available),
	from: https://raw.github.com/kvz/phpjs/master/functions/url/base64_decode.js

	@method atob
	@static
	@param {string} data string to decode
	@return {string} decoded string
	*/
	var atob = function(data, utf8) {
		if (typeof(window.atob) === 'function') {
			return utf8 ? utf8_decode(window.atob(data)) : window.atob(data);
		}

		// http://kevin.vanzonneveld.net
		// +   original by: tyler akins (http://rumkin.com)
		// +   improved by: thunder.m
		// +      input by: aman gupta
		// +   improved by: kevin van zonneveld (http://kevin.vanzonneveld.net)
		// +   bugfixed by: onno marsman
		// +   bugfixed by: pellentesque malesuada
		// +   improved by: kevin van zonneveld (http://kevin.vanzonneveld.net)
		// +      input by: brett zamir (http://brett-zamir.me)
		// +   bugfixed by: kevin van zonneveld (http://kevin.vanzonneveld.net)
		// *     example 1: base64_decode('s2v2aw4gdmfuifpvbm5ldmvsza==');
		// *     returns 1: 'kevin van zonneveld'
		// mozilla has this native
		// - but breaks in 2.0.0.12!
		//if (typeof this.window.atob == 'function') {
		//    return atob(data);
		//}
		var b64 = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
			ac = 0,
			dec = "",
			tmp_arr = [];

		if (!data) {
			return data;
		}

		data += '';

		do { // unpack four hexets into three octets using index points in b64
			h1 = b64.indexof(data.charat(i++));
			h2 = b64.indexof(data.charat(i++));
			h3 = b64.indexof(data.charat(i++));
			h4 = b64.indexof(data.charat(i++));

			bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

			o1 = bits >> 16 & 0xff;
			o2 = bits >> 8 & 0xff;
			o3 = bits & 0xff;

			if (h3 == 64) {
				tmp_arr[ac++] = string.fromcharcode(o1);
			} else if (h4 == 64) {
				tmp_arr[ac++] = string.fromcharcode(o1, o2);
			} else {
				tmp_arr[ac++] = string.fromcharcode(o1, o2, o3);
			}
		} while (i < data.length);

		dec = tmp_arr.join('');

		return utf8 ? utf8_decode(dec) : dec;
	};
	
	/**
	base64 encode string (uses browser's default method if available),
	from: https://raw.github.com/kvz/phpjs/master/functions/url/base64_encode.js

	@method btoa
	@static
	@param {string} data string to encode
	@return {string} base64 encoded string
	*/
	var btoa = function(data, utf8) {
		if (utf8) {
			data = utf8_encode(data);
		}

		if (typeof(window.btoa) === 'function') {
			return window.btoa(data);
		}

		// http://kevin.vanzonneveld.net
		// +   original by: tyler akins (http://rumkin.com)
		// +   improved by: bayron guevara
		// +   improved by: thunder.m
		// +   improved by: kevin van zonneveld (http://kevin.vanzonneveld.net)
		// +   bugfixed by: pellentesque malesuada
		// +   improved by: kevin van zonneveld (http://kevin.vanzonneveld.net)
		// +   improved by: rafaå‚ kukawski (http://kukawski.pl)
		// *     example 1: base64_encode('kevin van zonneveld');
		// *     returns 1: 's2v2aw4gdmfuifpvbm5ldmvsza=='
		// mozilla has this native
		// - but breaks in 2.0.0.12!
		var b64 = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
			ac = 0,
			enc = "",
			tmp_arr = [];

		if (!data) {
			return data;
		}

		do { // pack three octets into four hexets
			o1 = data.charcodeat(i++);
			o2 = data.charcodeat(i++);
			o3 = data.charcodeat(i++);

			bits = o1 << 16 | o2 << 8 | o3;

			h1 = bits >> 18 & 0x3f;
			h2 = bits >> 12 & 0x3f;
			h3 = bits >> 6 & 0x3f;
			h4 = bits & 0x3f;

			// use hexets to index into b64, and append result to encoded string
			tmp_arr[ac++] = b64.charat(h1) + b64.charat(h2) + b64.charat(h3) + b64.charat(h4);
		} while (i < data.length);

		enc = tmp_arr.join('');

		var r = data.length % 3;

		return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
	};


	return {
		utf8_encode: utf8_encode,
		utf8_decode: utf8_decode,
		atob: atob,
		btoa: btoa
	};
});

// included from: src/javascript/file/blob.js

/**
 * blob.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/file/blob', [
	'moxie/core/utils/basic',
	'moxie/core/utils/encode',
	'moxie/runtime/runtimeclient'
], function(basic, encode, runtimeclient) {
	
	var blobpool = {};

	/**
	@class blob
	@constructor
	@param {string} ruid unique id of the runtime, to which this blob belongs to
	@param {object} blob object "native" blob object, as it is represented in the runtime
	*/
	function blob(ruid, blob) {

		function _slicedetached(start, end, type) {
			var blob, data = blobpool[this.uid];

			if (basic.typeof(data) !== 'string' || !data.length) {
				return null; // or throw exception
			}

			blob = new blob(null, {
				type: type,
				size: end - start
			});
			blob.detach(data.substr(start, blob.size));

			return blob;
		}

		runtimeclient.call(this);

		if (ruid) {	
			this.connectruntime(ruid);
		}

		if (!blob) {
			blob = {};
		} else if (basic.typeof(blob) === 'string') { // dataurl or binary string
			blob = { data: blob };
		}

		basic.extend(this, {
			
			/**
			unique id of the component

			@property uid
			@type {string}
			*/
			uid: blob.uid || basic.guid('uid_'),
			
			/**
			unique id of the connected runtime, if falsy, then runtime will have to be initialized 
			before this blob can be used, modified or sent

			@property ruid
			@type {string}
			*/
			ruid: ruid,
	
			/**
			size of blob

			@property size
			@type {number}
			@default 0
			*/
			size: blob.size || 0,
			
			/**
			mime type of blob

			@property type
			@type {string}
			@default ''
			*/
			type: blob.type || '',
			
			/**
			@method slice
			@param {number} [start=0]
			*/
			slice: function(start, end, type) {		
				if (this.isdetached()) {
					return _slicedetached.apply(this, arguments);
				}
				return this.getruntime().exec.call(this, 'blob', 'slice', this.getsource(), start, end, type);
			},

			/**
			returns "native" blob object (as it is represented in connected runtime) or null if not found

			@method getsource
			@return {blob} returns "native" blob object or null if not found
			*/
			getsource: function() {
				if (!blobpool[this.uid]) {
					return null;	
				}
				return blobpool[this.uid];
			},

			/** 
			detaches blob from any runtime that it depends on and initialize with standalone value

			@method detach
			@protected
			@param {domstring} [data=''] standalone value
			*/
			detach: function(data) {
				if (this.ruid) {
					this.getruntime().exec.call(this, 'blob', 'destroy');
					this.disconnectruntime();
					this.ruid = null;
				}

				data = data || '';

				// if dataurl, convert to binary string
				if (data.substr(0, 5) == 'data:') {
					var base64offset = data.indexof(';base64,');
					this.type = data.substring(5, base64offset);
					data = encode.atob(data.substring(base64offset + 8));
				}

				this.size = data.length;

				blobpool[this.uid] = data;
			},

			/**
			checks if blob is standalone (detached of any runtime)
			
			@method isdetached
			@protected
			@return {boolean}
			*/
			isdetached: function() {
				return !this.ruid && basic.typeof(blobpool[this.uid]) === 'string';
			},
			
			/** 
			destroy blob and free any resources it was using

			@method destroy
			*/
			destroy: function() {
				this.detach();
				delete blobpool[this.uid];
			}
		});

		
		if (blob.data) {
			this.detach(blob.data); // auto-detach if payload has been passed
		} else {
			blobpool[this.uid] = blob;	
		}
	}
	
	return blob;
});

// included from: src/javascript/file/file.js

/**
 * file.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/file/file', [
	'moxie/core/utils/basic',
	'moxie/core/utils/mime',
	'moxie/file/blob'
], function(basic, mime, blob) {
	/**
	@class file
	@extends blob
	@constructor
	@param {string} ruid unique id of the runtime, to which this blob belongs to
	@param {object} file object "native" file object, as it is represented in the runtime
	*/
	function file(ruid, file) {
		if (!file) { // avoid extra errors in case we overlooked something
			file = {};
		}

		blob.apply(this, arguments);

		if (!this.type) {
			this.type = mime.getfilemime(file.name);
		}

		// sanitize file name or generate new one
		var name;
		if (file.name) {
			name = file.name.replace(/\\/g, '/');
			name = name.substr(name.lastindexof('/') + 1);
		} else if (this.type) {
			var prefix = this.type.split('/')[0];
			name = basic.guid((prefix !== '' ? prefix : 'file') + '_');
			
			if (mime.extensions[this.type]) {
				name += '.' + mime.extensions[this.type][0]; // append proper extension if possible
			}
		}
		
		
		basic.extend(this, {
			/**
			file name

			@property name
			@type {string}
			@default uid
			*/
			name: name || basic.guid('file_'),

			/**
			relative path to the file inside a directory

			@property relativepath
			@type {string}
			@default ''
			*/
			relativepath: '',
			
			/**
			date of last modification

			@property lastmodifieddate
			@type {string}
			@default now
			*/
			lastmodifieddate: file.lastmodifieddate || (new date()).tolocalestring() // thu aug 23 2012 19:40:00 gmt+0400 (get)
		});
	}

	file.prototype = blob.prototype;

	return file;
});

// included from: src/javascript/file/filedrop.js

/**
 * filedrop.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/file/filedrop', [
	'moxie/core/i18n',
	'moxie/core/utils/dom',
	'moxie/core/exceptions',
	'moxie/core/utils/basic',
	'moxie/core/utils/env',
	'moxie/file/file',
	'moxie/runtime/runtimeclient',
	'moxie/core/eventtarget',
	'moxie/core/utils/mime'
], function(i18n, dom, x, basic, env, file, runtimeclient, eventtarget, mime) {
	/**
	turn arbitrary dom element to a drop zone accepting files. converts selected files to _file_ objects, to be used 
	in conjunction with _image_, preloaded in memory with _filereader_ or uploaded to a server through 
	_xmlhttprequest_.

	@example
		<div id="drop_zone">
			drop files here
		</div>
		<br />
		<div id="filelist"></div>

		<script type="text/javascript">
			var filedrop = new moxie.filedrop('drop_zone'), filelist = moxie.get('filelist');

			filedrop.ondrop = function() {
				moxie.each(this.files, function(file) {
					filelist.innerhtml += '<div>' + file.name + '</div>';
				});
			};

			filedrop.init();
		</script>

	@class filedrop
	@constructor
	@extends eventtarget
	@uses runtimeclient
	@param {object|string} options if options has typeof string, argument is considered as options.drop_zone
		@param {string|domelement} options.drop_zone dom element to turn into a drop zone
		@param {array} [options.accept] array of mime types to accept. by default accepts all
		@param {object|string} [options.required_caps] set of required capabilities, that chosen runtime must support
	*/
	var dispatches = [
		/**
		dispatched when runtime is connected and drop zone is ready to accept files.

		@event ready
		@param {object} event
		*/
		'ready', 

		/**
		dispatched when dragging cursor enters the drop zone.

		@event dragenter
		@param {object} event
		*/
		'dragenter',

		/**
		dispatched when dragging cursor leaves the drop zone.

		@event dragleave
		@param {object} event
		*/
		'dragleave', 

		/**
		dispatched when file is dropped onto the drop zone.

		@event drop
		@param {object} event
		*/
		'drop', 

		/**
		dispatched if error occurs.

		@event error
		@param {object} event
		*/
		'error'
	];

	function filedrop(options) {
		if (mxi_debug) {
			env.log("instantiating filedrop...");	
		}

		var self = this, defaults;

		// if flat argument passed it should be drop_zone id
		if (typeof(options) === 'string') {
			options = { drop_zone : options };
		}

		// figure out the options
		defaults = {
			accept: [{
				title: i18n.translate('all files'),
				extensions: '*'
			}],
			required_caps: {
				drag_and_drop: true
			}
		};
		
		options = typeof(options) === 'object' ? basic.extend({}, defaults, options) : defaults;

		// this will help us to find proper default container
		options.container = dom.get(options.drop_zone) || document.body;

		// make container relative, if it is not
		if (dom.getstyle(options.container, 'position') === 'static') {
			options.container.style.position = 'relative';
		}
					
		// normalize accept option (could be list of mime types or array of title/extensions pairs)
		if (typeof(options.accept) === 'string') {
			options.accept = mime.mimes2extlist(options.accept);
		}

		runtimeclient.call(self);

		basic.extend(self, {
			uid: basic.guid('uid_'),

			ruid: null,

			files: null,

			init: function() {		
				self.bind('runtimeinit', function(e, runtime) {
					self.ruid = runtime.uid;
					runtime.exec.call(self, 'filedrop', 'init', options);
					self.dispatchevent('ready');
				});
							
				// runtime needs: options.required_features, options.runtime_order and options.container
				self.connectruntime(options); // throws runtimeerror
			},

			destroy: function() {
				var runtime = this.getruntime();
				if (runtime) {
					runtime.exec.call(this, 'filedrop', 'destroy');
					this.disconnectruntime();
				}
				this.files = null;
				
				this.unbindall();
			}
		});

		this.handleeventprops(dispatches);
	}

	filedrop.prototype = eventtarget.instance;

	return filedrop;
});

// included from: src/javascript/file/filereader.js

/**
 * filereader.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/file/filereader', [
	'moxie/core/utils/basic',
	'moxie/core/utils/encode',
	'moxie/core/exceptions',
	'moxie/core/eventtarget',
	'moxie/file/blob',
	'moxie/runtime/runtimeclient'
], function(basic, encode, x, eventtarget, blob, runtimeclient) {
	/**
	utility for preloading o.blob/o.file objects in memory. by design closely follows [w3c filereader](http://www.w3.org/tr/fileapi/#dfn-filereader)
	interface. where possible uses native filereader, where - not falls back to shims.

	@class filereader
	@constructor filereader
	@extends eventtarget
	@uses runtimeclient
	*/
	var dispatches = [

		/** 
		dispatched when the read starts.

		@event loadstart
		@param {object} event
		*/
		'loadstart', 

		/** 
		dispatched while reading (and decoding) blob, and reporting partial blob data (progess.loaded/progress.total).

		@event progress
		@param {object} event
		*/
		'progress', 

		/** 
		dispatched when the read has successfully completed.

		@event load
		@param {object} event
		*/
		'load', 

		/** 
		dispatched when the read has been aborted. for instance, by invoking the abort() method.

		@event abort
		@param {object} event
		*/
		'abort', 

		/** 
		dispatched when the read has failed.

		@event error
		@param {object} event
		*/
		'error', 

		/** 
		dispatched when the request has completed (either in success or failure).

		@event loadend
		@param {object} event
		*/
		'loadend'
	];
	
	function filereader() {

		runtimeclient.call(this);

		basic.extend(this, {
			/**
			uid of the component instance.

			@property uid
			@type {string}
			*/
			uid: basic.guid('uid_'),

			/**
			contains current state of filereader object. can take values of filereader.empty, filereader.loading
			and filereader.done.

			@property readystate
			@type {number}
			@default filereader.empty
			*/
			readystate: filereader.empty,
			
			/**
			result of the successful read operation.

			@property result
			@type {string}
			*/
			result: null,
			
			/**
			stores the error of failed asynchronous read operation.

			@property error
			@type {domerror}
			*/
			error: null,
			
			/**
			initiates reading of file/blob object contents to binary string.

			@method readasbinarystring
			@param {blob|file} blob object to preload
			*/
			readasbinarystring: function(blob) {
				_read.call(this, 'readasbinarystring', blob);
			},
			
			/**
			initiates reading of file/blob object contents to dataurl string.

			@method readasdataurl
			@param {blob|file} blob object to preload
			*/
			readasdataurl: function(blob) {
				_read.call(this, 'readasdataurl', blob);
			},
			
			/**
			initiates reading of file/blob object contents to string.

			@method readastext
			@param {blob|file} blob object to preload
			*/
			readastext: function(blob) {
				_read.call(this, 'readastext', blob);
			},
			
			/**
			aborts preloading process.

			@method abort
			*/
			abort: function() {
				this.result = null;
				
				if (basic.inarray(this.readystate, [filereader.empty, filereader.done]) !== -1) {
					return;
				} else if (this.readystate === filereader.loading) {
					this.readystate = filereader.done;
				}

				this.exec('filereader', 'abort');
				
				this.trigger('abort');
				this.trigger('loadend');
			},

			/**
			destroy component and release resources.

			@method destroy
			*/
			destroy: function() {
				this.abort();
				this.exec('filereader', 'destroy');
				this.disconnectruntime();
				this.unbindall();
			}
		});

		// uid must already be assigned
		this.handleeventprops(dispatches);

		this.bind('error', function(e, err) {
			this.readystate = filereader.done;
			this.error = err;
		}, 999);
		
		this.bind('load', function(e) {
			this.readystate = filereader.done;
		}, 999);

		
		function _read(op, blob) {
			var self = this;			

			this.trigger('loadstart');

			if (this.readystate === filereader.loading) {
				this.trigger('error', new x.domexception(x.domexception.invalid_state_err));
				this.trigger('loadend');
				return;
			}

			// if source is not o.blob/o.file
			if (!(blob instanceof blob)) {
				this.trigger('error', new x.domexception(x.domexception.not_found_err));
				this.trigger('loadend');
				return;
			}

			this.result = null;
			this.readystate = filereader.loading;
			
			if (blob.isdetached()) {
				var src = blob.getsource();
				switch (op) {
					case 'readastext':
					case 'readasbinarystring':
						this.result = src;
						break;
					case 'readasdataurl':
						this.result = 'data:' + blob.type + ';base64,' + encode.btoa(src);
						break;
				}
				this.readystate = filereader.done;
				this.trigger('load');
				this.trigger('loadend');
			} else {
				this.connectruntime(blob.ruid);
				this.exec('filereader', 'read', op, blob);
			}
		}
	}
	
	/**
	initial filereader state

	@property empty
	@type {number}
	@final
	@static
	@default 0
	*/
	filereader.empty = 0;

	/**
	filereader switches to this state when it is preloading the source

	@property loading
	@type {number}
	@final
	@static
	@default 1
	*/
	filereader.loading = 1;

	/**
	preloading is complete, this is a final state

	@property done
	@type {number}
	@final
	@static
	@default 2
	*/
	filereader.done = 2;

	filereader.prototype = eventtarget.instance;

	return filereader;
});

// included from: src/javascript/core/utils/url.js

/**
 * url.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/core/utils/url', [], function() {
	/**
	parse url into separate components and fill in absent parts with parts from current url,
	based on https://raw.github.com/kvz/phpjs/master/functions/url/parse_url.js

	@method parseurl
	@for utils
	@static
	@param {string} url url to parse (defaults to empty string if undefined)
	@return {object} hash containing extracted uri components
	*/
	var parseurl = function(url, currenturl) {
		var key = ['source', 'scheme', 'authority', 'userinfo', 'user', 'pass', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment']
		, i = key.length
		, ports = {
			http: 80,
			https: 443
		}
		, uri = {}
		, regex = /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)/
		, m = regex.exec(url || '')
		;
					
		while (i--) {
			if (m[i]) {
				uri[key[i]] = m[i];
			}
		}

		// when url is relative, we set the origin and the path ourselves
		if (!uri.scheme) {
			// come up with defaults
			if (!currenturl || typeof(currenturl) === 'string') {
				currenturl = parseurl(currenturl || document.location.href);
			}

			uri.scheme = currenturl.scheme;
			uri.host = currenturl.host;
			uri.port = currenturl.port;

			var path = '';
			// for urls without trailing slash we need to figure out the path
			if (/^[^\/]/.test(uri.path)) {
				path = currenturl.path;
				// if path ends with a filename, strip it
				if (/\/[^\/]*\.[^\/]*$/.test(path)) {
					path = path.replace(/\/[^\/]+$/, '/');
				} else {
					// avoid double slash at the end (see #127)
					path = path.replace(/\/?$/, '/');
				}
			}
			uri.path = path + (uri.path || ''); // site may reside at domain.com or domain.com/subdir
		}

		if (!uri.port) {
			uri.port = ports[uri.scheme] || 80;
		} 
		
		uri.port = parseint(uri.port, 10);

		if (!uri.path) {
			uri.path = "/";
		}

		delete uri.source;

		return uri;
	};

	/**
	resolve url - among other things will turn relative url to absolute

	@method resolveurl
	@static
	@param {string|object} url either absolute or relative, or a result of parseurl call
	@return {string} resolved, absolute url
	*/
	var resolveurl = function(url) {
		var ports = { // we ignore default ports
			http: 80,
			https: 443
		}
		, urlp = typeof(url) === 'object' ? url : parseurl(url);
		;

		return urlp.scheme + '://' + urlp.host + (urlp.port !== ports[urlp.scheme] ? ':' + urlp.port : '') + urlp.path + (urlp.query ? urlp.query : '');
	};

	/**
	check if specified url has the same origin as the current document

	@method hassameorigin
	@param {string|object} url
	@return {boolean}
	*/
	var hassameorigin = function(url) {
		function origin(url) {
			return [url.scheme, url.host, url.port].join('/');
		}
			
		if (typeof url === 'string') {
			url = parseurl(url);
		}	
		
		return origin(parseurl()) === origin(url);
	};

	return {
		parseurl: parseurl,
		resolveurl: resolveurl,
		hassameorigin: hassameorigin
	};
});

// included from: src/javascript/runtime/runtimetarget.js

/**
 * runtimetarget.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/runtime/runtimetarget', [
	'moxie/core/utils/basic',
	'moxie/runtime/runtimeclient',
	"moxie/core/eventtarget"
], function(basic, runtimeclient, eventtarget) {
	/**
	instance of this class can be used as a target for the events dispatched by shims,
	when allowing them onto components is for either reason inappropriate

	@class runtimetarget
	@constructor
	@protected
	@extends eventtarget
	*/
	function runtimetarget() {
		this.uid = basic.guid('uid_');
		
		runtimeclient.call(this);

		this.destroy = function() {
			this.disconnectruntime();
			this.unbindall();
		};
	}

	runtimetarget.prototype = eventtarget.instance;

	return runtimetarget;
});

// included from: src/javascript/file/filereadersync.js

/**
 * filereadersync.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/file/filereadersync', [
	'moxie/core/utils/basic',
	'moxie/runtime/runtimeclient',
	'moxie/core/utils/encode'
], function(basic, runtimeclient, encode) {
	/**
	synchronous filereader implementation. something like this is available in webworkers environment, here
	it can be used to read only preloaded blobs/files and only below certain size (not yet sure what that'd be,
	but probably < 1mb). not meant to be used directly by user.

	@class filereadersync
	@private
	@constructor
	*/
	return function() {
		runtimeclient.call(this);

		basic.extend(this, {
			uid: basic.guid('uid_'),

			readasbinarystring: function(blob) {
				return _read.call(this, 'readasbinarystring', blob);
			},
			
			readasdataurl: function(blob) {
				return _read.call(this, 'readasdataurl', blob);
			},
			
			/*readasarraybuffer: function(blob) {
				return _read.call(this, 'readasarraybuffer', blob);
			},*/
			
			readastext: function(blob) {
				return _read.call(this, 'readastext', blob);
			}
		});

		function _read(op, blob) {
			if (blob.isdetached()) {
				var src = blob.getsource();
				switch (op) {
					case 'readasbinarystring':
						return src;
					case 'readasdataurl':
						return 'data:' + blob.type + ';base64,' + encode.btoa(src);
					case 'readastext':
						var txt = '';
						for (var i = 0, length = src.length; i < length; i++) {
							txt += string.fromcharcode(src[i]);
						}
						return txt;
				}
			} else {
				var result = this.connectruntime(blob.ruid).exec.call(this, 'filereadersync', 'read', op, blob);
				this.disconnectruntime();
				return result;
			}
		}
	};
});

// included from: src/javascript/xhr/formdata.js

/**
 * formdata.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define("moxie/xhr/formdata", [
	"moxie/core/exceptions",
	"moxie/core/utils/basic",
	"moxie/file/blob"
], function(x, basic, blob) {
	/**
	formdata

	@class formdata
	@constructor
	*/
	function formdata() {
		var _blob, _fields = [];

		basic.extend(this, {
			/**
			append another key-value pair to the formdata object

			@method append
			@param {string} name name for the new field
			@param {string|blob|array|object} value value for the field
			*/
			append: function(name, value) {
				var self = this, valuetype = basic.typeof(value);

				// according to specs value might be either blob or string
				if (value instanceof blob) {
					_blob = {
						name: name,
						value: value // unfortunately we can only send single blob in one formdata
					};
				} else if ('array' === valuetype) {
					name += '[]';

					basic.each(value, function(value) {
						self.append(name, value);
					});
				} else if ('object' === valuetype) {
					basic.each(value, function(value, key) {
						self.append(name + '[' + key + ']', value);
					});
				} else if ('null' === valuetype || 'undefined' === valuetype || 'number' === valuetype && isnan(value)) {
					self.append(name, "false");
				} else {
					_fields.push({
						name: name,
						value: value.tostring()
					});
				}
			},

			/**
			checks if formdata contains blob.

			@method hasblob
			@return {boolean}
			*/
			hasblob: function() {
				return !!this.getblob();
			},

			/**
			retrieves blob.

			@method getblob
			@return {object} either blob if found or null
			*/
			getblob: function() {
				return _blob && _blob.value || null;
			},

			/**
			retrieves blob field name.

			@method getblobname
			@return {string} either blob field name or null
			*/
			getblobname: function() {
				return _blob && _blob.name || null;
			},

			/**
			loop over the fields in formdata and invoke the callback for each of them.

			@method each
			@param {function} cb callback to call for each field
			*/
			each: function(cb) {
				basic.each(_fields, function(field) {
					cb(field.value, field.name);
				});

				if (_blob) {
					cb(_blob.value, _blob.name);
				}
			},

			destroy: function() {
				_blob = null;
				_fields = [];
			}
		});
	}

	return formdata;
});

// included from: src/javascript/xhr/xmlhttprequest.js

/**
 * xmlhttprequest.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define("moxie/xhr/xmlhttprequest", [
	"moxie/core/utils/basic",
	"moxie/core/exceptions",
	"moxie/core/eventtarget",
	"moxie/core/utils/encode",
	"moxie/core/utils/url",
	"moxie/runtime/runtime",
	"moxie/runtime/runtimetarget",
	"moxie/file/blob",
	"moxie/file/filereadersync",
	"moxie/xhr/formdata",
	"moxie/core/utils/env",
	"moxie/core/utils/mime"
], function(basic, x, eventtarget, encode, url, runtime, runtimetarget, blob, filereadersync, formdata, env, mime) {

	var httpcode = {
		100: 'continue',
		101: 'switching protocols',
		102: 'processing',

		200: 'ok',
		201: 'created',
		202: 'accepted',
		203: 'non-authoritative information',
		204: 'no content',
		205: 'reset content',
		206: 'partial content',
		207: 'multi-status',
		226: 'im used',

		300: 'multiple choices',
		301: 'moved permanently',
		302: 'found',
		303: 'see other',
		304: 'not modified',
		305: 'use proxy',
		306: 'reserved',
		307: 'temporary redirect',

		400: 'bad request',
		401: 'unauthorized',
		402: 'payment required',
		403: 'forbidden',
		404: 'not found',
		405: 'method not allowed',
		406: 'not acceptable',
		407: 'proxy authentication required',
		408: 'request timeout',
		409: 'conflict',
		410: 'gone',
		411: 'length required',
		412: 'precondition failed',
		413: 'request entity too large',
		414: 'request-uri too long',
		415: 'unsupported media type',
		416: 'requested range not satisfiable',
		417: 'expectation failed',
		422: 'unprocessable entity',
		423: 'locked',
		424: 'failed dependency',
		426: 'upgrade required',

		500: 'internal server error',
		501: 'not implemented',
		502: 'bad gateway',
		503: 'service unavailable',
		504: 'gateway timeout',
		505: 'http version not supported',
		506: 'variant also negotiates',
		507: 'insufficient storage',
		510: 'not extended'
	};

	function xmlhttprequestupload() {
		this.uid = basic.guid('uid_');
	}
	
	xmlhttprequestupload.prototype = eventtarget.instance;

	/**
	implementation of xmlhttprequest

	@class xmlhttprequest
	@constructor
	@uses runtimeclient
	@extends eventtarget
	*/
	var dispatches = [
		'loadstart',

		'progress',

		'abort',

		'error',

		'load',

		'timeout',

		'loadend'

		// readystatechange (for historical reasons)
	]; 
	
	var native = 1, runtime = 2;
					
	function xmlhttprequest() {
		var self = this,
			// this (together with _p() @see below) is here to gracefully upgrade to setter/getter syntax where possible
			props = {
				/**
				the amount of milliseconds a request can take before being terminated. initially zero. zero means there is no timeout.

				@property timeout
				@type number
				@default 0
				*/
				timeout: 0,

				/**
				current state, can take following values:
				unsent (numeric value 0)
				the object has been constructed.

				opened (numeric value 1)
				the open() method has been successfully invoked. during this state request headers can be set using setrequestheader() and the request can be made using the send() method.

				headers_received (numeric value 2)
				all redirects (if any) have been followed and all http headers of the final response have been received. several response members of the object are now available.

				loading (numeric value 3)
				the response entity body is being received.

				done (numeric value 4)

				@property readystate
				@type number
				@default 0 (unsent)
				*/
				readystate: xmlhttprequest.unsent,

				/**
				true when user credentials are to be included in a cross-origin request. false when they are to be excluded
				in a cross-origin request and when cookies are to be ignored in its response. initially false.

				@property withcredentials
				@type boolean
				@default false
				*/
				withcredentials: false,

				/**
				returns the http status code.

				@property status
				@type number
				@default 0
				*/
				status: 0,

				/**
				returns the http status text.

				@property statustext
				@type string
				*/
				statustext: "",

				/**
				returns the response type. can be set to change the response type. values are:
				the empty string (default), "arraybuffer", "blob", "document", "json", and "text".
				
				@property responsetype
				@type string
				*/
				responsetype: "",

				/**
				returns the document response entity body.
				
				throws an "invalidstateerror" exception if responsetype is not the empty string or "document".

				@property responsexml
				@type document
				*/
				responsexml: null,

				/**
				returns the text response entity body.
				
				throws an "invalidstateerror" exception if responsetype is not the empty string or "text".

				@property responsetext
				@type string
				*/
				responsetext: null,

				/**
				returns the response entity body (http://www.w3.org/tr/xmlhttprequest/#response-entity-body).
				can become: arraybuffer, blob, document, json, text
				
				@property response
				@type mixed
				*/
				response: null
			},

			_async = true,
			_url,
			_method,
			_headers = {},
			_user,
			_password,
			_encoding = null,
			_mimetype = null,

			// flags
			_sync_flag = false,
			_send_flag = false,
			_upload_events_flag = false,
			_upload_complete_flag = false,
			_error_flag = false,
			_same_origin_flag = false,

			// times
			_start_time,
			_timeoutset_time,

			_finalmime = null,
			_finalcharset = null,

			_options = {},
			_xhr,
			_responseheaders = '',
			_responseheadersbag
			;

		
		basic.extend(this, props, {
			/**
			unique id of the component

			@property uid
			@type string
			*/
			uid: basic.guid('uid_'),
			
			/**
			target for upload events

			@property upload
			@type xmlhttprequestupload
			*/
			upload: new xmlhttprequestupload(),
			

			/**
			sets the request method, request url, synchronous flag, request username, and request password.

			throws a "syntaxerror" exception if one of the following is true:

			method is not a valid http method.
			url cannot be resolved.
			url contains the "user:password" format in the userinfo production.
			throws a "securityerror" exception if method is a case-insensitive match for connect, trace or track.

			throws an "invalidaccesserror" exception if one of the following is true:

			either user or password is passed as argument and the origin of url does not match the xmlhttprequest origin.
			there is an associated xmlhttprequest document and either the timeout attribute is not zero,
			the withcredentials attribute is true, or the responsetype attribute is not the empty string.


			@method open
			@param {string} method http method to use on request
			@param {string} url url to request
			@param {boolean} [async=true] if false request will be done in synchronous manner. asynchronous by default.
			@param {string} [user] username to use in http authentication process on server-side
			@param {string} [password] password to use in http authentication process on server-side
			*/
			open: function(method, url, async, user, password) {
				var urlp;
				
				// first two arguments are required
				if (!method || !url) {
					throw new x.domexception(x.domexception.syntax_err);
				}
				
				// 2 - check if any code point in method is higher than u+00ff or after deflating method it does not match the method
				if (/[\u0100-\uffff]/.test(method) || encode.utf8_encode(method) !== method) {
					throw new x.domexception(x.domexception.syntax_err);
				}

				// 3
				if (!!~basic.inarray(method.touppercase(), ['connect', 'delete', 'get', 'head', 'options', 'post', 'put', 'trace', 'track'])) {
					_method = method.touppercase();
				}
				
				
				// 4 - allowing these methods poses a security risk
				if (!!~basic.inarray(_method, ['connect', 'trace', 'track'])) {
					throw new x.domexception(x.domexception.security_err);
				}

				// 5
				url = encode.utf8_encode(url);
				
				// 6 - resolve url relative to the xmlhttprequest base url. if the algorithm returns an error, throw a "syntaxerror".
				urlp = url.parseurl(url);

				_same_origin_flag = url.hassameorigin(urlp);
																
				// 7 - manually build up absolute url
				_url = url.resolveurl(url);
		
				// 9-10, 12-13
				if ((user || password) && !_same_origin_flag) {
					throw new x.domexception(x.domexception.invalid_access_err);
				}

				_user = user || urlp.user;
				_password = password || urlp.pass;
				
				// 11
				_async = async || true;
				
				if (_async === false && (_p('timeout') || _p('withcredentials') || _p('responsetype') !== "")) {
					throw new x.domexception(x.domexception.invalid_access_err);
				}
				
				// 14 - terminate abort()
				
				// 15 - terminate send()

				// 18
				_sync_flag = !_async;
				_send_flag = false;
				_headers = {};
				_reset.call(this);

				// 19
				_p('readystate', xmlhttprequest.opened);
				
				// 20
				this.dispatchevent('readystatechange');
			},
			
			/**
			appends an header to the list of author request headers, or if header is already
			in the list of author request headers, combines its value with value.

			throws an "invalidstateerror" exception if the state is not opened or if the send() flag is set.
			throws a "syntaxerror" exception if header is not a valid http header field name or if value
			is not a valid http header field value.
			
			@method setrequestheader
			@param {string} header
			@param {string|number} value
			*/
			setrequestheader: function(header, value) {
				var uaheaders = [ // these headers are controlled by the user agent
						"accept-charset",
						"accept-encoding",
						"access-control-request-headers",
						"access-control-request-method",
						"connection",
						"content-length",
						"cookie",
						"cookie2",
						"content-transfer-encoding",
						"date",
						"expect",
						"host",
						"keep-alive",
						"origin",
						"referer",
						"te",
						"trailer",
						"transfer-encoding",
						"upgrade",
						"user-agent",
						"via"
					];
				
				// 1-2
				if (_p('readystate') !== xmlhttprequest.opened || _send_flag) {
					throw new x.domexception(x.domexception.invalid_state_err);
				}

				// 3
				if (/[\u0100-\uffff]/.test(header) || encode.utf8_encode(header) !== header) {
					throw new x.domexception(x.domexception.syntax_err);
				}

				// 4
				/* this step is seemingly bypassed in browsers, probably to allow various unicode characters in header values
				if (/[\u0100-\uffff]/.test(value) || encode.utf8_encode(value) !== value) {
					throw new x.domexception(x.domexception.syntax_err);
				}*/

				header = basic.trim(header).tolowercase();
				
				// setting of proxy-* and sec-* headers is prohibited by spec
				if (!!~basic.inarray(header, uaheaders) || /^(proxy\-|sec\-)/.test(header)) {
					return false;
				}

				// camelize
				// browsers lowercase header names (at least for custom ones)
				// header = header.replace(/\b\w/g, function($1) { return $1.touppercase(); });
				
				if (!_headers[header]) {
					_headers[header] = value;
				} else {
					// http://tools.ietf.org/html/rfc2616#section-4.2 (last paragraph)
					_headers[header] += ', ' + value;
				}
				return true;
			},

			/**
			returns all headers from the response, with the exception of those whose field name is set-cookie or set-cookie2.

			@method getallresponseheaders
			@return {string} reponse headers or empty string
			*/
			getallresponseheaders: function() {
				return _responseheaders || '';
			},

			/**
			returns the header field value from the response of which the field name matches header, 
			unless the field name is set-cookie or set-cookie2.

			@method getresponseheader
			@param {string} header
			@return {string} value(s) for the specified header or null
			*/
			getresponseheader: function(header) {
				header = header.tolowercase();

				if (_error_flag || !!~basic.inarray(header, ['set-cookie', 'set-cookie2'])) {
					return null;
				}

				if (_responseheaders && _responseheaders !== '') {
					// if we didn't parse response headers until now, do it and keep for later
					if (!_responseheadersbag) {
						_responseheadersbag = {};
						basic.each(_responseheaders.split(/\r\n/), function(line) {
							var pair = line.split(/:\s+/);
							if (pair.length === 2) { // last line might be empty, omit
								pair[0] = basic.trim(pair[0]); // just in case
								_responseheadersbag[pair[0].tolowercase()] = { // simply to retain header name in original form
									header: pair[0],
									value: basic.trim(pair[1])
								};
							}
						});
					}
					if (_responseheadersbag.hasownproperty(header)) {
						return _responseheadersbag[header].header + ': ' + _responseheadersbag[header].value;
					}
				}
				return null;
			},
			
			/**
			sets the content-type header for the response to mime.
			throws an "invalidstateerror" exception if the state is loading or done.
			throws a "syntaxerror" exception if mime is not a valid media type.

			@method overridemimetype
			@param string mime mime type to set
			*/
			overridemimetype: function(mime) {
				var matches, charset;
			
				// 1
				if (!!~basic.inarray(_p('readystate'), [xmlhttprequest.loading, xmlhttprequest.done])) {
					throw new x.domexception(x.domexception.invalid_state_err);
				}

				// 2
				mime = basic.trim(mime.tolowercase());

				if (/;/.test(mime) && (matches = mime.match(/^([^;]+)(?:;\scharset\=)?(.*)$/))) {
					mime = matches[1];
					if (matches[2]) {
						charset = matches[2];
					}
				}

				if (!mime.mimes[mime]) {
					throw new x.domexception(x.domexception.syntax_err);
				}

				// 3-4
				_finalmime = mime;
				_finalcharset = charset;
			},
			
			/**
			initiates the request. the optional argument provides the request entity body.
			the argument is ignored if request method is get or head.

			throws an "invalidstateerror" exception if the state is not opened or if the send() flag is set.

			@method send
			@param {blob|document|string|formdata} [data] request entity body
			@param {object} [options] set of requirements and pre-requisities for runtime initialization
			*/
			send: function(data, options) {					
				if (basic.typeof(options) === 'string') {
					_options = { ruid: options };
				} else if (!options) {
					_options = {};
				} else {
					_options = options;
				}
															
				// 1-2
				if (this.readystate !== xmlhttprequest.opened || _send_flag) {
					throw new x.domexception(x.domexception.invalid_state_err);
				}
				
				// 3					
				// sending blob
				if (data instanceof blob) {
					_options.ruid = data.ruid;
					_mimetype = data.type || 'application/octet-stream';
				}
				
				// formdata
				else if (data instanceof formdata) {
					if (data.hasblob()) {
						var blob = data.getblob();
						_options.ruid = blob.ruid;
						_mimetype = blob.type || 'application/octet-stream';
					}
				}
				
				// domstring
				else if (typeof data === 'string') {
					_encoding = 'utf-8';
					_mimetype = 'text/plain;charset=utf-8';
					
					// data should be converted to unicode and encoded as utf-8
					data = encode.utf8_encode(data);
				}

				// if withcredentials not set, but requested, set it automatically
				if (!this.withcredentials) {
					this.withcredentials = (_options.required_caps && _options.required_caps.send_browser_cookies) && !_same_origin_flag;
				}

				// 4 - storage mutex
				// 5
				_upload_events_flag = (!_sync_flag && this.upload.haseventlistener()); // dsap
				// 6
				_error_flag = false;
				// 7
				_upload_complete_flag = !data;
				// 8 - asynchronous steps
				if (!_sync_flag) {
					// 8.1
					_send_flag = true;
					// 8.2
					// this.dispatchevent('loadstart'); // will be dispatched either by native or runtime xhr
					// 8.3
					//if (!_upload_complete_flag) {
						// this.upload.dispatchevent('loadstart');	// will be dispatched either by native or runtime xhr
					//}
				}
				// 8.5 - return the send() method call, but continue running the steps in this algorithm.
				_doxhr.call(this, data);
			},
			
			/**
			cancels any network activity.
			
			@method abort
			*/
			abort: function() {
				_error_flag = true;
				_sync_flag = false;

				if (!~basic.inarray(_p('readystate'), [xmlhttprequest.unsent, xmlhttprequest.opened, xmlhttprequest.done])) {
					_p('readystate', xmlhttprequest.done);
					_send_flag = false;

					if (_xhr) {
						_xhr.getruntime().exec.call(_xhr, 'xmlhttprequest', 'abort', _upload_complete_flag);
					} else {
						throw new x.domexception(x.domexception.invalid_state_err);
					}

					_upload_complete_flag = true;
				} else {
					_p('readystate', xmlhttprequest.unsent);
				}
			},

			destroy: function() {
				if (_xhr) {
					if (basic.typeof(_xhr.destroy) === 'function') {
						_xhr.destroy();
					}
					_xhr = null;
				}

				this.unbindall();

				if (this.upload) {
					this.upload.unbindall();
					this.upload = null;
				}
			}
		});

		this.handleeventprops(dispatches.concat(['readystatechange'])); // for historical reasons
		this.upload.handleeventprops(dispatches);

		/* this is nice, but maybe too lengthy

		// if supported by js version, set getters/setters for specific properties
		o.defineproperty(this, 'readystate', {
			configurable: false,

			get: function() {
				return _p('readystate');
			}
		});

		o.defineproperty(this, 'timeout', {
			configurable: false,

			get: function() {
				return _p('timeout');
			},

			set: function(value) {

				if (_sync_flag) {
					throw new x.domexception(x.domexception.invalid_access_err);
				}

				// timeout still should be measured relative to the start time of request
				_timeoutset_time = (new date).gettime();

				_p('timeout', value);
			}
		});

		// the withcredentials attribute has no effect when fetching same-origin resources
		o.defineproperty(this, 'withcredentials', {
			configurable: false,

			get: function() {
				return _p('withcredentials');
			},

			set: function(value) {
				// 1-2
				if (!~o.inarray(_p('readystate'), [xmlhttprequest.unsent, xmlhttprequest.opened]) || _send_flag) {
					throw new x.domexception(x.domexception.invalid_state_err);
				}

				// 3-4
				if (_anonymous_flag || _sync_flag) {
					throw new x.domexception(x.domexception.invalid_access_err);
				}

				// 5
				_p('withcredentials', value);
			}
		});

		o.defineproperty(this, 'status', {
			configurable: false,

			get: function() {
				return _p('status');
			}
		});

		o.defineproperty(this, 'statustext', {
			configurable: false,

			get: function() {
				return _p('statustext');
			}
		});

		o.defineproperty(this, 'responsetype', {
			configurable: false,

			get: function() {
				return _p('responsetype');
			},

			set: function(value) {
				// 1
				if (!!~o.inarray(_p('readystate'), [xmlhttprequest.loading, xmlhttprequest.done])) {
					throw new x.domexception(x.domexception.invalid_state_err);
				}

				// 2
				if (_sync_flag) {
					throw new x.domexception(x.domexception.invalid_access_err);
				}

				// 3
				_p('responsetype', value.tolowercase());
			}
		});

		o.defineproperty(this, 'responsetext', {
			configurable: false,

			get: function() {
				// 1
				if (!~o.inarray(_p('responsetype'), ['', 'text'])) {
					throw new x.domexception(x.domexception.invalid_state_err);
				}

				// 2-3
				if (_p('readystate') !== xmlhttprequest.done && _p('readystate') !== xmlhttprequest.loading || _error_flag) {
					throw new x.domexception(x.domexception.invalid_state_err);
				}

				return _p('responsetext');
			}
		});

		o.defineproperty(this, 'responsexml', {
			configurable: false,

			get: function() {
				// 1
				if (!~o.inarray(_p('responsetype'), ['', 'document'])) {
					throw new x.domexception(x.domexception.invalid_state_err);
				}

				// 2-3
				if (_p('readystate') !== xmlhttprequest.done || _error_flag) {
					throw new x.domexception(x.domexception.invalid_state_err);
				}

				return _p('responsexml');
			}
		});

		o.defineproperty(this, 'response', {
			configurable: false,

			get: function() {
				if (!!~o.inarray(_p('responsetype'), ['', 'text'])) {
					if (_p('readystate') !== xmlhttprequest.done && _p('readystate') !== xmlhttprequest.loading || _error_flag) {
						return '';
					}
				}

				if (_p('readystate') !== xmlhttprequest.done || _error_flag) {
					return null;
				}

				return _p('response');
			}
		});

		*/

		function _p(prop, value) {
			if (!props.hasownproperty(prop)) {
				return;
			}
			if (arguments.length === 1) { // get
				return env.can('define_property') ? props[prop] : self[prop];
			} else { // set
				if (env.can('define_property')) {
					props[prop] = value;
				} else {
					self[prop] = value;
				}
			}
		}
		
		/*
		function _toascii(str, allowunassigned, usestd3asciirules) {
			// todo: http://tools.ietf.org/html/rfc3490#section-4.1
			return str.tolowercase();
		}
		*/
		
		
		function _doxhr(data) {
			var self = this;
			
			_start_time = new date().gettime();

			_xhr = new runtimetarget();

			function loadend() {
				if (_xhr) { // it could have been destroyed by now
					_xhr.destroy();
					_xhr = null;
				}
				self.dispatchevent('loadend');
				self = null;
			}

			function exec(runtime) {
				_xhr.bind('loadstart', function(e) {
					_p('readystate', xmlhttprequest.loading);
					self.dispatchevent('readystatechange');

					self.dispatchevent(e);
					
					if (_upload_events_flag) {
						self.upload.dispatchevent(e);
					}
				});
				
				_xhr.bind('progress', function(e) {
					if (_p('readystate') !== xmlhttprequest.loading) {
						_p('readystate', xmlhttprequest.loading); // loadstart unreliable (in flash for example)
						self.dispatchevent('readystatechange');
					}
					self.dispatchevent(e);
				});
				
				_xhr.bind('uploadprogress', function(e) {
					if (_upload_events_flag) {
						self.upload.dispatchevent({
							type: 'progress',
							lengthcomputable: false,
							total: e.total,
							loaded: e.loaded
						});
					}
				});
				
				_xhr.bind('load', function(e) {
					_p('readystate', xmlhttprequest.done);
					_p('status', number(runtime.exec.call(_xhr, 'xmlhttprequest', 'getstatus') || 0));
					_p('statustext', httpcode[_p('status')] || "");
					
					_p('response', runtime.exec.call(_xhr, 'xmlhttprequest', 'getresponse', _p('responsetype')));

					if (!!~basic.inarray(_p('responsetype'), ['text', ''])) {
						_p('responsetext', _p('response'));
					} else if (_p('responsetype') === 'document') {
						_p('responsexml', _p('response'));
					}

					_responseheaders = runtime.exec.call(_xhr, 'xmlhttprequest', 'getallresponseheaders');

					self.dispatchevent('readystatechange');
					
					if (_p('status') > 0) { // status 0 usually means that server is unreachable
						if (_upload_events_flag) {
							self.upload.dispatchevent(e);
						}
						self.dispatchevent(e);
					} else {
						_error_flag = true;
						self.dispatchevent('error');
					}
					loadend();
				});

				_xhr.bind('abort', function(e) {
					self.dispatchevent(e);
					loadend();
				});
				
				_xhr.bind('error', function(e) {
					_error_flag = true;
					_p('readystate', xmlhttprequest.done);
					self.dispatchevent('readystatechange');
					_upload_complete_flag = true;
					self.dispatchevent(e);
					loadend();
				});

				runtime.exec.call(_xhr, 'xmlhttprequest', 'send', {
					url: _url,
					method: _method,
					async: _async,
					user: _user,
					password: _password,
					headers: _headers,
					mimetype: _mimetype,
					encoding: _encoding,
					responsetype: self.responsetype,
					withcredentials: self.withcredentials,
					options: _options
				}, data);
			}

			// clarify our requirements
			if (typeof(_options.required_caps) === 'string') {
				_options.required_caps = runtime.parsecaps(_options.required_caps);
			}

			_options.required_caps = basic.extend({}, _options.required_caps, {
				return_response_type: self.responsetype
			});

			if (data instanceof formdata) {
				_options.required_caps.send_multipart = true;
			}

			if (!basic.isemptyobj(_headers)) {
				_options.required_caps.send_custom_headers = true;
			}

			if (!_same_origin_flag) {
				_options.required_caps.do_cors = true;
			}
			

			if (_options.ruid) { // we do not need to wait if we can connect directly
				exec(_xhr.connectruntime(_options));
			} else {
				_xhr.bind('runtimeinit', function(e, runtime) {
					exec(runtime);
				});
				_xhr.bind('runtimeerror', function(e, err) {
					self.dispatchevent('runtimeerror', err);
				});
				_xhr.connectruntime(_options);
			}
		}
	
		
		function _reset() {
			_p('responsetext', "");
			_p('responsexml', null);
			_p('response', null);
			_p('status', 0);
			_p('statustext', "");
			_start_time = _timeoutset_time = null;
		}
	}

	xmlhttprequest.unsent = 0;
	xmlhttprequest.opened = 1;
	xmlhttprequest.headers_received = 2;
	xmlhttprequest.loading = 3;
	xmlhttprequest.done = 4;
	
	xmlhttprequest.prototype = eventtarget.instance;

	return xmlhttprequest;
});

// included from: src/javascript/runtime/transporter.js

/**
 * transporter.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define("moxie/runtime/transporter", [
	"moxie/core/utils/basic",
	"moxie/core/utils/encode",
	"moxie/runtime/runtimeclient",
	"moxie/core/eventtarget"
], function(basic, encode, runtimeclient, eventtarget) {
	function transporter() {
		var mod, _runtime, _data, _size, _pos, _chunk_size;

		runtimeclient.call(this);

		basic.extend(this, {
			uid: basic.guid('uid_'),

			state: transporter.idle,

			result: null,

			transport: function(data, type, options) {
				var self = this;

				options = basic.extend({
					chunk_size: 204798
				}, options);

				// should divide by three, base64 requires this
				if ((mod = options.chunk_size % 3)) {
					options.chunk_size += 3 - mod;
				}

				_chunk_size = options.chunk_size;

				_reset.call(this);
				_data = data;
				_size = data.length;

				if (basic.typeof(options) === 'string' || options.ruid) {
					_run.call(self, type, this.connectruntime(options));
				} else {
					// we require this to run only once
					var cb = function(e, runtime) {
						self.unbind("runtimeinit", cb);
						_run.call(self, type, runtime);
					};
					this.bind("runtimeinit", cb);
					this.connectruntime(options);
				}
			},

			abort: function() {
				var self = this;

				self.state = transporter.idle;
				if (_runtime) {
					_runtime.exec.call(self, 'transporter', 'clear');
					self.trigger("transportingaborted");
				}

				_reset.call(self);
			},


			destroy: function() {
				this.unbindall();
				_runtime = null;
				this.disconnectruntime();
				_reset.call(this);
			}
		});

		function _reset() {
			_size = _pos = 0;
			_data = this.result = null;
		}

		function _run(type, runtime) {
			var self = this;

			_runtime = runtime;

			//self.unbind("runtimeinit");

			self.bind("transportingprogress", function(e) {
				_pos = e.loaded;

				if (_pos < _size && basic.inarray(self.state, [transporter.idle, transporter.done]) === -1) {
					_transport.call(self);
				}
			}, 999);

			self.bind("transportingcomplete", function() {
				_pos = _size;
				self.state = transporter.done;
				_data = null; // clean a bit
				self.result = _runtime.exec.call(self, 'transporter', 'getasblob', type || '');
			}, 999);

			self.state = transporter.busy;
			self.trigger("transportingstarted");
			_transport.call(self);
		}

		function _transport() {
			var self = this,
				chunk,
				bytesleft = _size - _pos;

			if (_chunk_size > bytesleft) {
				_chunk_size = bytesleft;
			}

			chunk = encode.btoa(_data.substr(_pos, _chunk_size));
			_runtime.exec.call(self, 'transporter', 'receive', chunk, _size);
		}
	}

	transporter.idle = 0;
	transporter.busy = 1;
	transporter.done = 2;

	transporter.prototype = eventtarget.instance;

	return transporter;
});

// included from: src/javascript/image/image.js

/**
 * image.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define("moxie/image/image", [
	"moxie/core/utils/basic",
	"moxie/core/utils/dom",
	"moxie/core/exceptions",
	"moxie/file/filereadersync",
	"moxie/xhr/xmlhttprequest",
	"moxie/runtime/runtime",
	"moxie/runtime/runtimeclient",
	"moxie/runtime/transporter",
	"moxie/core/utils/env",
	"moxie/core/eventtarget",
	"moxie/file/blob",
	"moxie/file/file",
	"moxie/core/utils/encode"
], function(basic, dom, x, filereadersync, xmlhttprequest, runtime, runtimeclient, transporter, env, eventtarget, blob, file, encode) {
	/**
	image preloading and manipulation utility. additionally it provides access to image meta info (exif, gps) and raw binary data.

	@class image
	@constructor
	@extends eventtarget
	*/
	var dispatches = [
		'progress',

		/**
		dispatched when loading is complete.

		@event load
		@param {object} event
		*/
		'load',

		'error',

		/**
		dispatched when resize operation is complete.
		
		@event resize
		@param {object} event
		*/
		'resize',

		/**
		dispatched when visual representation of the image is successfully embedded
		into the corresponsing container.

		@event embedded
		@param {object} event
		*/
		'embedded'
	];

	function image() {

		runtimeclient.call(this);

		basic.extend(this, {
			/**
			unique id of the component

			@property uid
			@type {string}
			*/
			uid: basic.guid('uid_'),

			/**
			unique id of the connected runtime, if any.

			@property ruid
			@type {string}
			*/
			ruid: null,

			/**
			name of the file, that was used to create an image, if available. if not equals to empty string.

			@property name
			@type {string}
			@default ""
			*/
			name: "",

			/**
			size of the image in bytes. actual value is set only after image is preloaded.

			@property size
			@type {number}
			@default 0
			*/
			size: 0,

			/**
			width of the image. actual value is set only after image is preloaded.

			@property width
			@type {number}
			@default 0
			*/
			width: 0,

			/**
			height of the image. actual value is set only after image is preloaded.

			@property height
			@type {number}
			@default 0
			*/
			height: 0,

			/**
			mime type of the image. currently only image/jpeg and image/png are supported. actual value is set only after image is preloaded.

			@property type
			@type {string}
			@default ""
			*/
			type: "",

			/**
			holds meta info (exif, gps). is populated only for image/jpeg. actual value is set only after image is preloaded.

			@property meta
			@type {object}
			@default {}
			*/
			meta: {},

			/**
			alias for load method, that takes another moxie.image object as a source (see load).

			@method clone
			@param {image} src source for the image
			@param {boolean} [exact=false] whether to activate in-depth clone mode
			*/
			clone: function() {
				this.load.apply(this, arguments);
			},

			/**
			loads image from various sources. currently the source for new image can be: moxie.image, moxie.blob/moxie.file, 
			native blob/file, dataurl or url. depending on the type of the source, arguments - differ. when source is url, 
			image will be downloaded from remote destination and loaded in memory.

			@example
				var img = new moxie.image();
				img.onload = function() {
					var blob = img.getasblob();
					
					var formdata = new moxie.formdata();
					formdata.append('file', blob);

					var xhr = new moxie.xmlhttprequest();
					xhr.onload = function() {
						// upload complete
					};
					xhr.open('post', 'upload.php');
					xhr.send(formdata);
				};
				img.load("http://www.moxiecode.com/images/mox-logo.jpg"); // notice file extension (.jpg)
			

			@method load
			@param {image|blob|file|string} src source for the image
			@param {boolean|object} [mixed]
			*/
			load: function() {
				_load.apply(this, arguments);
			},

			/**
			downsizes the image to fit the specified width/height. if crop is supplied, image will be cropped to exact dimensions.

			@method downsize
			@param {object} opts
				@param {number} opts.width resulting width
				@param {number} [opts.height=width] resulting height (optional, if not supplied will default to width)
				@param {boolean} [opts.crop=false] whether to crop the image to exact dimensions
				@param {boolean} [opts.preserveheaders=true] whether to preserve meta headers (on jpegs after resize)
				@param {string} [opts.resample=false] resampling algorithm to use for resizing
			*/
			downsize: function(opts) {
				var defaults = {
					width: this.width,
					height: this.height,
					type: this.type || 'image/jpeg',
					quality: 90,
					crop: false,
					preserveheaders: true,
					resample: false
				};

				if (typeof(opts) === 'object') {
					opts = basic.extend(defaults, opts);
				} else {
					// for backward compatibility
					opts = basic.extend(defaults, {
						width: arguments[0],
						height: arguments[1],
						crop: arguments[2],
						preserveheaders: arguments[3]
					});
				}

				try {
					if (!this.size) { // only preloaded image objects can be used as source
						throw new x.domexception(x.domexception.invalid_state_err);
					}

					// no way to reliably intercept the crash due to high resolution, so we simply avoid it
					if (this.width > image.max_resize_width || this.height > image.max_resize_height) {
						throw new x.imageerror(x.imageerror.max_resolution_err);
					}

					this.exec('image', 'downsize', opts.width, opts.height, opts.crop, opts.preserveheaders);
				} catch(ex) {
					// for now simply trigger error event
					this.trigger('error', ex.code);
				}
			},

			/**
			alias for downsize(width, height, true). (see downsize)
			
			@method crop
			@param {number} width resulting width
			@param {number} [height=width] resulting height (optional, if not supplied will default to width)
			@param {boolean} [preserveheaders=true] whether to preserve meta headers (on jpegs after resize)
			*/
			crop: function(width, height, preserveheaders) {
				this.downsize(width, height, true, preserveheaders);
			},

			getascanvas: function() {
				if (!env.can('create_canvas')) {
					throw new x.runtimeerror(x.runtimeerror.not_supported_err);
				}

				var runtime = this.connectruntime(this.ruid);
				return runtime.exec.call(this, 'image', 'getascanvas');
			},

			/**
			retrieves image in it's current state as moxie.blob object. cannot be run on empty or image in progress (throws
			domexception.invalid_state_err).

			@method getasblob
			@param {string} [type="image/jpeg"] mime type of resulting blob. can either be image/jpeg or image/png
			@param {number} [quality=90] applicable only together with mime type image/jpeg
			@return {blob} image as blob
			*/
			getasblob: function(type, quality) {
				if (!this.size) {
					throw new x.domexception(x.domexception.invalid_state_err);
				}
				return this.exec('image', 'getasblob', type || 'image/jpeg', quality || 90);
			},

			/**
			retrieves image in it's current state as dataurl string. cannot be run on empty or image in progress (throws
			domexception.invalid_state_err).

			@method getasdataurl
			@param {string} [type="image/jpeg"] mime type of resulting blob. can either be image/jpeg or image/png
			@param {number} [quality=90] applicable only together with mime type image/jpeg
			@return {string} image as dataurl string
			*/
			getasdataurl: function(type, quality) {
				if (!this.size) {
					throw new x.domexception(x.domexception.invalid_state_err);
				}
				return this.exec('image', 'getasdataurl', type || 'image/jpeg', quality || 90);
			},

			/**
			retrieves image in it's current state as binary string. cannot be run on empty or image in progress (throws
			domexception.invalid_state_err).

			@method getasbinarystring
			@param {string} [type="image/jpeg"] mime type of resulting blob. can either be image/jpeg or image/png
			@param {number} [quality=90] applicable only together with mime type image/jpeg
			@return {string} image as binary string
			*/
			getasbinarystring: function(type, quality) {
				var dataurl = this.getasdataurl(type, quality);
				return encode.atob(dataurl.substring(dataurl.indexof('base64,') + 7));
			},

			/**
			embeds a visual representation of the image into the specified node. depending on the runtime, 
			it might be a canvas, an img node or a thrid party shim object (flash or silverlight - very rare, 
			can be used in legacy browsers that do not have canvas or proper datauri support).

			@method embed
			@param {domelement} el dom element to insert the image object into
			@param {object} [opts]
				@param {number} [opts.width] the width of an embed (defaults to the image width)
				@param {number} [opts.height] the height of an embed (defaults to the image height)
				@param {string} [type="image/jpeg"] mime type
				@param {number} [quality=90] quality of an embed, if mime type is image/jpeg
				@param {boolean} [crop=false] whether to crop an embed to the specified dimensions
			*/
			embed: function(el, opts) {
				var self = this
				, runtime // this has to be outside of all the closures to contain proper runtime
				;

				opts = basic.extend({
					width: this.width,
					height: this.height,
					type: this.type || 'image/jpeg',
					quality: 90
				}, opts || {});
				

				function render(type, quality) {
					var img = this;

					// if possible, embed a canvas element directly
					if (env.can('create_canvas')) {
						var canvas = img.getascanvas();
						if (canvas) {
							el.appendchild(canvas);
							canvas = null;
							img.destroy();
							self.trigger('embedded');
							return;
						}
					}

					var dataurl = img.getasdataurl(type, quality);
					if (!dataurl) {
						throw new x.imageerror(x.imageerror.wrong_format);
					}

					if (env.can('use_data_uri_of', dataurl.length)) {
						el.innerhtml = '<img src="' + dataurl + '" width="' + img.width + '" height="' + img.height + '" />';
						img.destroy();
						self.trigger('embedded');
					} else {
						var tr = new transporter();

						tr.bind("transportingcomplete", function() {
							runtime = self.connectruntime(this.result.ruid);

							self.bind("embedded", function() {
								// position and size properly
								basic.extend(runtime.getshimcontainer().style, {
									//position: 'relative',
									top: '0px',
									left: '0px',
									width: img.width + 'px',
									height: img.height + 'px'
								});

								// some shims (flash/silverlight) reinitialize, if parent element is hidden, reordered or it's
								// position type changes (in gecko), but since we basically need this only in ies 6/7 and
								// sometimes 8 and they do not have this problem, we can comment this for now
								/*tr.bind("runtimeinit", function(e, runtime) {
									tr.destroy();
									runtime.destroy();
									onresize.call(self); // re-feed our image data
								});*/

								runtime = null; // release
							}, 999);

							runtime.exec.call(self, "imageview", "display", this.result.uid, width, height);
							img.destroy();
						});

						tr.transport(encode.atob(dataurl.substring(dataurl.indexof('base64,') + 7)), type, {
							required_caps: {
								display_media: true
							},
							runtime_order: 'flash,silverlight',
							container: el
						});
					}
				}

				try {
					if (!(el = dom.get(el))) {
						throw new x.domexception(x.domexception.invalid_node_type_err);
					}

					if (!this.size) { // only preloaded image objects can be used as source
						throw new x.domexception(x.domexception.invalid_state_err);
					}
					
					// high-resolution images cannot be consistently handled across the runtimes
					if (this.width > image.max_resize_width || this.height > image.max_resize_height) {
						//throw new x.imageerror(x.imageerror.max_resolution_err);
					}

					var imgcopy = new image();

					imgcopy.bind("resize", function() {
						render.call(this, opts.type, opts.quality);
					});

					imgcopy.bind("load", function() {
						imgcopy.downsize(opts);
					});

					// if embedded thumb data is available and dimensions are big enough, use it
					if (this.meta.thumb && this.meta.thumb.width >= opts.width && this.meta.thumb.height >= opts.height) {
						imgcopy.load(this.meta.thumb.data);
					} else {
						imgcopy.clone(this, false);
					}

					return imgcopy;
				} catch(ex) {
					// for now simply trigger error event
					this.trigger('error', ex.code);
				}
			},

			/**
			properly destroys the image and frees resources in use. if any. recommended way to dispose moxie.image object.

			@method destroy
			*/
			destroy: function() {
				if (this.ruid) {
					this.getruntime().exec.call(this, 'image', 'destroy');
					this.disconnectruntime();
				}
				this.unbindall();
			}
		});


		// this is here, because in order to bind properly, we need uid, which is created above
		this.handleeventprops(dispatches);

		this.bind('load resize', function() {
			_updateinfo.call(this);
		}, 999);


		function _updateinfo(info) {
			if (!info) {
				info = this.exec('image', 'getinfo');
			}

			this.size = info.size;
			this.width = info.width;
			this.height = info.height;
			this.type = info.type;
			this.meta = info.meta;

			// update file name, only if empty
			if (this.name === '') {
				this.name = info.name;
			}
		}
		

		function _load(src) {
			var srctype = basic.typeof(src);

			try {
				// if source is image
				if (src instanceof image) {
					if (!src.size) { // only preloaded image objects can be used as source
						throw new x.domexception(x.domexception.invalid_state_err);
					}
					_loadfromimage.apply(this, arguments);
				}
				// if source is o.blob/o.file
				else if (src instanceof blob) {
					if (!~basic.inarray(src.type, ['image/jpeg', 'image/png'])) {
						throw new x.imageerror(x.imageerror.wrong_format);
					}
					_loadfromblob.apply(this, arguments);
				}
				// if native blob/file
				else if (basic.inarray(srctype, ['blob', 'file']) !== -1) {
					_load.call(this, new file(null, src), arguments[1]);
				}
				// if string
				else if (srctype === 'string') {
					// if dataurl string
					if (src.substr(0, 5) === 'data:') {
						_load.call(this, new blob(null, { data: src }), arguments[1]);
					}
					// else assume url, either relative or absolute
					else {
						_loadfromurl.apply(this, arguments);
					}
				}
				// if source seems to be an img node
				else if (srctype === 'node' && src.nodename.tolowercase() === 'img') {
					_load.call(this, src.src, arguments[1]);
				}
				else {
					throw new x.domexception(x.domexception.type_mismatch_err);
				}
			} catch(ex) {
				// for now simply trigger error event
				this.trigger('error', ex.code);
			}
		}


		function _loadfromimage(img, exact) {
			var runtime = this.connectruntime(img.ruid);
			this.ruid = runtime.uid;
			runtime.exec.call(this, 'image', 'loadfromimage', img, (basic.typeof(exact) === 'undefined' ? true : exact));
		}


		function _loadfromblob(blob, options) {
			var self = this;

			self.name = blob.name || '';

			function exec(runtime) {
				self.ruid = runtime.uid;
				runtime.exec.call(self, 'image', 'loadfromblob', blob);
			}

			if (blob.isdetached()) {
				this.bind('runtimeinit', function(e, runtime) {
					exec(runtime);
				});

				// convert to object representation
				if (options && typeof(options.required_caps) === 'string') {
					options.required_caps = runtime.parsecaps(options.required_caps);
				}

				this.connectruntime(basic.extend({
					required_caps: {
						access_image_binary: true,
						resize_image: true
					}
				}, options));
			} else {
				exec(this.connectruntime(blob.ruid));
			}
		}


		function _loadfromurl(url, options) {
			var self = this, xhr;

			xhr = new xmlhttprequest();

			xhr.open('get', url);
			xhr.responsetype = 'blob';

			xhr.onprogress = function(e) {
				self.trigger(e);
			};

			xhr.onload = function() {
				_loadfromblob.call(self, xhr.response, true);
			};

			xhr.onerror = function(e) {
				self.trigger(e);
			};

			xhr.onloadend = function() {
				xhr.destroy();
			};

			xhr.bind('runtimeerror', function(e, err) {
				self.trigger('runtimeerror', err);
			});

			xhr.send(null, options);
		}
	}

	// virtual world will crash on you if image has a resolution higher than this:
	image.max_resize_width = 8192;
	image.max_resize_height = 8192; 

	image.prototype = eventtarget.instance;

	return image;
});

// included from: src/javascript/runtime/html5/runtime.js

/**
 * runtime.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/*global file:true */

/**
defines constructor for html5 runtime.

@class moxie/runtime/html5/runtime
@private
*/
define("moxie/runtime/html5/runtime", [
	"moxie/core/utils/basic",
	"moxie/core/exceptions",
	"moxie/runtime/runtime",
	"moxie/core/utils/env"
], function(basic, x, runtime, env) {
	
	var type = "html5", extensions = {};
	
	function html5runtime(options) {
		var i = this
		, test = runtime.captest
		, true = runtime.captrue
		;

		var caps = basic.extend({
				access_binary: test(window.filereader || window.file && window.file.getasdataurl),
				access_image_binary: function() {
					return i.can('access_binary') && !!extensions.image;
				},
				display_media: test(env.can('create_canvas') || env.can('use_data_uri_over32kb')),
				do_cors: test(window.xmlhttprequest && 'withcredentials' in new xmlhttprequest()),
				drag_and_drop: test(function() {
					// this comes directly from modernizr: http://www.modernizr.com/
					var div = document.createelement('div');
					// ie has support for drag and drop since version 5, but doesn't support dropping files from desktop
					return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 
						(env.browser !== 'ie' || env.vercomp(env.version, 9, '>'));
				}()),
				filter_by_extension: test(function() { // if you know how to feature-detect this, please suggest
					return (env.browser === 'chrome' && env.vercomp(env.version, 28, '>=')) || 
						(env.browser === 'ie' && env.vercomp(env.version, 10, '>=')) || 
						(env.browser === 'safari' && env.vercomp(env.version, 7, '>='));
				}()),
				return_response_headers: true,
				return_response_type: function(responsetype) {
					if (responsetype === 'json' && !!window.json) { // we can fake this one even if it's not supported
						return true;
					} 
					return env.can('return_response_type', responsetype);
				},
				return_status_code: true,
				report_upload_progress: test(window.xmlhttprequest && new xmlhttprequest().upload),
				resize_image: function() {
					return i.can('access_binary') && env.can('create_canvas');
				},
				select_file: function() {
					return env.can('use_fileinput') && window.file;
				},
				select_folder: function() {
					return i.can('select_file') && env.browser === 'chrome' && env.vercomp(env.version, 21, '>=');
				},
				select_multiple: function() {
					// it is buggy on safari windows and ios
					return i.can('select_file') &&
						!(env.browser === 'safari' && env.os === 'windows') &&
						!(env.os === 'ios' && env.vercomp(env.osversion, "7.0.0", '>') && env.vercomp(env.osversion, "8.0.0", '<'));
				},
				send_binary_string: test(window.xmlhttprequest && (new xmlhttprequest().sendasbinary || (window.uint8array && window.arraybuffer))),
				send_custom_headers: test(window.xmlhttprequest),
				send_multipart: function() {
					return !!(window.xmlhttprequest && new xmlhttprequest().upload && window.formdata) || i.can('send_binary_string');
				},
				slice_blob: test(window.file && (file.prototype.mozslice || file.prototype.webkitslice || file.prototype.slice)),
				stream_upload: function(){
					return i.can('slice_blob') && i.can('send_multipart');
				},
				summon_file_dialog: function() { // yeah... some dirty sniffing here...
					return i.can('select_file') && (
						(env.browser === 'firefox' && env.vercomp(env.version, 4, '>=')) ||
						(env.browser === 'opera' && env.vercomp(env.version, 12, '>=')) ||
						(env.browser === 'ie' && env.vercomp(env.version, 10, '>=')) ||
						!!~basic.inarray(env.browser, ['chrome', 'safari'])
					);
				},
				upload_filesize: true
			}, 
			arguments[2]
		);

		runtime.call(this, options, (arguments[1] || type), caps);


		basic.extend(this, {

			init : function() {
				this.trigger("init");
			},

			destroy: (function(destroy) { // extend default destroy method
				return function() {
					destroy.call(i);
					destroy = i = null;
				};
			}(this.destroy))
		});

		basic.extend(this.getshim(), extensions);
	}

	runtime.addconstructor(type, html5runtime);

	return extensions;
});

// included from: src/javascript/core/utils/events.js

/**
 * events.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

define('moxie/core/utils/events', [
	'moxie/core/utils/basic'
], function(basic) {
	var eventhash = {}, uid = 'moxie_' + basic.guid();
	
	// ie w3c like event funcs
	function preventdefault() {
		this.returnvalue = false;
	}

	function stoppropagation() {
		this.cancelbubble = true;
	}

	/**
	adds an event handler to the specified object and store reference to the handler
	in objects internal plupload registry (@see removeevent).
	
	@method addevent
	@for utils
	@static
	@param {object} obj dom element like object to add handler to.
	@param {string} name name to add event listener to.
	@param {function} callback function to call when event occurs.
	@param {string} [key] that might be used to add specifity to the event record.
	*/
	var addevent = function(obj, name, callback, key) {
		var func, events;
					
		name = name.tolowercase();

		// add event listener
		if (obj.addeventlistener) {
			func = callback;
			
			obj.addeventlistener(name, func, false);
		} else if (obj.attachevent) {
			func = function() {
				var evt = window.event;

				if (!evt.target) {
					evt.target = evt.srcelement;
				}

				evt.preventdefault = preventdefault;
				evt.stoppropagation = stoppropagation;

				callback(evt);
			};

			obj.attachevent('on' + name, func);
		}
		
		// log event handler to objects internal moxie registry
		if (!obj[uid]) {
			obj[uid] = basic.guid();
		}
		
		if (!eventhash.hasownproperty(obj[uid])) {
			eventhash[obj[uid]] = {};
		}
		
		events = eventhash[obj[uid]];
		
		if (!events.hasownproperty(name)) {
			events[name] = [];
		}
				
		events[name].push({
			func: func,
			orig: callback, // store original callback for ie
			key: key
		});
	};
	
	
	/**
	remove event handler from the specified object. if third argument (callback)
	is not specified remove all events with the specified name.
	
	@method removeevent
	@static
	@param {object} obj dom element to remove event listener(s) from.
	@param {string} name name of event listener to remove.
	@param {function|string} [callback] might be a callback or unique key to match.
	*/
	var removeevent = function(obj, name, callback) {
		var type, undef;
		
		name = name.tolowercase();
		
		if (obj[uid] && eventhash[obj[uid]] && eventhash[obj[uid]][name]) {
			type = eventhash[obj[uid]][name];
		} else {
			return;
		}
			
		for (var i = type.length - 1; i >= 0; i--) {
			// undefined or not, key should match
			if (type[i].orig === callback || type[i].key === callback) {
				if (obj.removeeventlistener) {
					obj.removeeventlistener(name, type[i].func, false);
				} else if (obj.detachevent) {
					obj.detachevent('on'+name, type[i].func);
				}
				
				type[i].orig = null;
				type[i].func = null;
				type.splice(i, 1);
				
				// if callback was passed we are done here, otherwise proceed
				if (callback !== undef) {
					break;
				}
			}
		}
		
		// if event array got empty, remove it
		if (!type.length) {
			delete eventhash[obj[uid]][name];
		}
		
		// if moxie registry has become empty, remove it
		if (basic.isemptyobj(eventhash[obj[uid]])) {
			delete eventhash[obj[uid]];
			
			// ie doesn't let you remove dom object property with - delete
			try {
				delete obj[uid];
			} catch(e) {
				obj[uid] = undef;
			}
		}
	};
	
	
	/**
	remove all kind of events from the specified object
	
	@method removeallevents
	@static
	@param {object} obj dom element to remove event listeners from.
	@param {string} [key] unique key to match, when removing events.
	*/
	var removeallevents = function(obj, key) {		
		if (!obj || !obj[uid]) {
			return;
		}
		
		basic.each(eventhash[obj[uid]], function(events, name) {
			removeevent(obj, name, key);
		});
	};

	return {
		addevent: addevent,
		removeevent: removeevent,
		removeallevents: removeallevents
	};
});

// included from: src/javascript/runtime/html5/file/fileinput.js

/**
 * fileinput.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/html5/file/fileinput
@private
*/
define("moxie/runtime/html5/file/fileinput", [
	"moxie/runtime/html5/runtime",
	"moxie/file/file",
	"moxie/core/utils/basic",
	"moxie/core/utils/dom",
	"moxie/core/utils/events",
	"moxie/core/utils/mime",
	"moxie/core/utils/env"
], function(extensions, file, basic, dom, events, mime, env) {
	
	function fileinput() {
		var _options;

		basic.extend(this, {
			init: function(options) {
				var comp = this, i = comp.getruntime(), input, shimcontainer, mimes, browsebutton, zindex, top;

				_options = options;

				// figure out accept string
				mimes = _options.accept.mimes || mime.extlist2mimes(_options.accept, i.can('filter_by_extension'));

				shimcontainer = i.getshimcontainer();

				shimcontainer.innerhtml = '<input id="' + i.uid +'" type="file" style="font-size:999px;opacity:0;"' +
					(_options.multiple && i.can('select_multiple') ? 'multiple' : '') + 
					(_options.directory && i.can('select_folder') ? 'webkitdirectory directory' : '') + // chrome 11+
					(mimes ? ' accept="' + mimes.join(',') + '"' : '') + ' />';

				input = dom.get(i.uid);

				// prepare file input to be placed underneath the browse_button element
				basic.extend(input.style, {
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%'
				});


				browsebutton = dom.get(_options.browse_button);

				// route click event to the input[type=file] element for browsers that support such behavior
				if (i.can('summon_file_dialog')) {
					if (dom.getstyle(browsebutton, 'position') === 'static') {
						browsebutton.style.position = 'relative';
					}

					zindex = parseint(dom.getstyle(browsebutton, 'z-index'), 10) || 1;

					browsebutton.style.zindex = zindex;
					shimcontainer.style.zindex = zindex - 1;

					events.addevent(browsebutton, 'click', function(e) {
						var input = dom.get(i.uid);
						if (input && !input.disabled) { // for some reason ff (up to 8.0.1 so far) lets to click disabled input[type=file]
							input.click();
						}
						e.preventdefault();
					}, comp.uid);
				}

				/* since we have to place input[type=file] on top of the browse_button for some browsers,
				browse_button loses interactivity, so we restore it here */
				top = i.can('summon_file_dialog') ? browsebutton : shimcontainer;

				events.addevent(top, 'mouseover', function() {
					comp.trigger('mouseenter');
				}, comp.uid);

				events.addevent(top, 'mouseout', function() {
					comp.trigger('mouseleave');
				}, comp.uid);

				events.addevent(top, 'mousedown', function() {
					comp.trigger('mousedown');
				}, comp.uid);

				events.addevent(dom.get(_options.container), 'mouseup', function() {
					comp.trigger('mouseup');
				}, comp.uid);


				input.onchange = function onchange(e) { // there should be only one handler for this
					comp.files = [];

					basic.each(this.files, function(file) {
						var relativepath = '';

						if (_options.directory) {
							// folders are represented by dots, filter them out (chrome 11+)
							if (file.name == ".") {
								// if it looks like a folder...
								return true;
							}
						}

						if (file.webkitrelativepath) {
							relativepath = '/' + file.webkitrelativepath.replace(/^\//, '');
						}
						
						file = new file(i.uid, file);
						file.relativepath = relativepath;

						comp.files.push(file);
					});

					// clearing the value enables the user to select the same file again if they want to
					if (env.browser !== 'ie' && env.browser !== 'iemobile') {
						this.value = '';
					} else {
						// in ie input[type="file"] is read-only so the only way to reset it is to re-insert it
						var clone = this.clonenode(true);
						this.parentnode.replacechild(clone, this);
						clone.onchange = onchange;
					}

					if (comp.files.length) {
						comp.trigger('change');
					}
				};

				// ready event is perfectly asynchronous
				comp.trigger({
					type: 'ready',
					async: true
				});

				shimcontainer = null;
			},


			disable: function(state) {
				var i = this.getruntime(), input;

				if ((input = dom.get(i.uid))) {
					input.disabled = !!state;
				}
			},

			destroy: function() {
				var i = this.getruntime()
				, shim = i.getshim()
				, shimcontainer = i.getshimcontainer()
				;
				
				events.removeallevents(shimcontainer, this.uid);
				events.removeallevents(_options && dom.get(_options.container), this.uid);
				events.removeallevents(_options && dom.get(_options.browse_button), this.uid);
				
				if (shimcontainer) {
					shimcontainer.innerhtml = '';
				}

				shim.removeinstance(this.uid);

				_options = shimcontainer = shim = null;
			}
		});
	}

	return (extensions.fileinput = fileinput);
});

// included from: src/javascript/runtime/html5/file/blob.js

/**
 * blob.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/html5/file/blob
@private
*/
define("moxie/runtime/html5/file/blob", [
	"moxie/runtime/html5/runtime",
	"moxie/file/blob"
], function(extensions, blob) {

	function html5blob() {
		function w3cblobslice(blob, start, end) {
			var blobslice;

			if (window.file.prototype.slice) {
				try {
					blob.slice();	// depricated version will throw wrong_arguments_err exception
					return blob.slice(start, end);
				} catch (e) {
					// depricated slice method
					return blob.slice(start, end - start);
				}
			// slice method got prefixed: https://bugzilla.mozilla.org/show_bug.cgi?id=649672
			} else if ((blobslice = window.file.prototype.webkitslice || window.file.prototype.mozslice)) {
				return blobslice.call(blob, start, end);
			} else {
				return null; // or throw some exception
			}
		}

		this.slice = function() {
			return new blob(this.getruntime().uid, w3cblobslice.apply(this, arguments));
		};
	}

	return (extensions.blob = html5blob);
});

// included from: src/javascript/runtime/html5/file/filedrop.js

/**
 * filedrop.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/html5/file/filedrop
@private
*/
define("moxie/runtime/html5/file/filedrop", [
	"moxie/runtime/html5/runtime",
	'moxie/file/file',
	"moxie/core/utils/basic",
	"moxie/core/utils/dom",
	"moxie/core/utils/events",
	"moxie/core/utils/mime"
], function(extensions, file, basic, dom, events, mime) {
	
	function filedrop() {
		var _files = [], _allowedexts = [], _options, _ruid;

		basic.extend(this, {
			init: function(options) {
				var comp = this, dropzone;

				_options = options;
				_ruid = comp.ruid; // every dropped-in file should have a reference to the runtime
				_allowedexts = _extractexts(_options.accept);
				dropzone = _options.container;

				events.addevent(dropzone, 'dragover', function(e) {
					if (!_hasfiles(e)) {
						return;
					}
					e.preventdefault();
					e.datatransfer.dropeffect = 'copy';
				}, comp.uid);

				events.addevent(dropzone, 'drop', function(e) {
					if (!_hasfiles(e)) {
						return;
					}
					e.preventdefault();

					_files = [];

					// chrome 21+ accepts folders via drag'n'drop
					if (e.datatransfer.items && e.datatransfer.items[0].webkitgetasentry) {
						_readitems(e.datatransfer.items, function() {
							comp.files = _files;
							comp.trigger("drop");
						});
					} else {
						basic.each(e.datatransfer.files, function(file) {
							_addfile(file);
						});
						comp.files = _files;
						comp.trigger("drop");
					}
				}, comp.uid);

				events.addevent(dropzone, 'dragenter', function(e) {
					comp.trigger("dragenter");
				}, comp.uid);

				events.addevent(dropzone, 'dragleave', function(e) {
					comp.trigger("dragleave");
				}, comp.uid);
			},

			destroy: function() {
				events.removeallevents(_options && dom.get(_options.container), this.uid);
				_ruid = _files = _allowedexts = _options = null;
			}
		});


		function _hasfiles(e) {
			if (!e.datatransfer || !e.datatransfer.types) { // e.datatransfer.files is not available in gecko during dragover
				return false;
			}

			var types = basic.toarray(e.datatransfer.types || []);

			return basic.inarray("files", types) !== -1 ||
				basic.inarray("public.file-url", types) !== -1 || // safari < 5
				basic.inarray("application/x-moz-file", types) !== -1 // gecko < 1.9.2 (< firefox 3.6)
				;
		}


		function _addfile(file, relativepath) {
			if (_isacceptable(file)) {
				var fileobj = new file(_ruid, file);
				fileobj.relativepath = relativepath || '';
				_files.push(fileobj);
			}
		}

		
		function _extractexts(accept) {
			var exts = [];
			for (var i = 0; i < accept.length; i++) {
				[].push.apply(exts, accept[i].extensions.split(/\s*,\s*/));
			}
			return basic.inarray('*', exts) === -1 ? exts : [];
		}


		function _isacceptable(file) {
			if (!_allowedexts.length) {
				return true;
			}
			var ext = mime.getfileextension(file.name);
			return !ext || basic.inarray(ext, _allowedexts) !== -1;
		}


		function _readitems(items, cb) {
			var entries = [];
			basic.each(items, function(item) {
				var entry = item.webkitgetasentry();
				// address #998 (https://code.google.com/p/chromium/issues/detail?id=332579)
				if (entry) {
					// file() fails on osx when the filename contains a special character (e.g. umlaut): see #61
					if (entry.isfile) {
						_addfile(item.getasfile(), entry.fullpath);
					} else {
						entries.push(entry);
					}
				}
			});

			if (entries.length) {
				_readentries(entries, cb);
			} else {
				cb();
			}
		}


		function _readentries(entries, cb) {
			var queue = [];
			basic.each(entries, function(entry) {
				queue.push(function(cbcb) {
					_readentry(entry, cbcb);
				});
			});
			basic.inseries(queue, function() {
				cb();
			});
		}


		function _readentry(entry, cb) {
			if (entry.isfile) {
				entry.file(function(file) {
					_addfile(file, entry.fullpath);
					cb();
				}, function() {
					// fire an error event maybe
					cb();
				});
			} else if (entry.isdirectory) {
				_readdirentry(entry, cb);
			} else {
				cb(); // not file, not directory? what then?..
			}
		}


		function _readdirentry(direntry, cb) {
			var entries = [], dirreader = direntry.createreader();

			// keep quering recursively till no more entries
			function getentries(cbcb) {
				dirreader.readentries(function(moreentries) {
					if (moreentries.length) {
						[].push.apply(entries, moreentries);
						getentries(cbcb);
					} else {
						cbcb();
					}
				}, cbcb);
			}

			// ...and you thought filereader was crazy...
			getentries(function() {
				_readentries(entries, cb);
			}); 
		}
	}

	return (extensions.filedrop = filedrop);
});

// included from: src/javascript/runtime/html5/file/filereader.js

/**
 * filereader.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/html5/file/filereader
@private
*/
define("moxie/runtime/html5/file/filereader", [
	"moxie/runtime/html5/runtime",
	"moxie/core/utils/encode",
	"moxie/core/utils/basic"
], function(extensions, encode, basic) {
	
	function filereader() {
		var _fr, _converttobinary = false;

		basic.extend(this, {

			read: function(op, blob) {
				var comp = this;

				comp.result = '';

				_fr = new window.filereader();

				_fr.addeventlistener('progress', function(e) {
					comp.trigger(e);
				});

				_fr.addeventlistener('load', function(e) {
					comp.result = _converttobinary ? _tobinary(_fr.result) : _fr.result;
					comp.trigger(e);
				});

				_fr.addeventlistener('error', function(e) {
					comp.trigger(e, _fr.error);
				});

				_fr.addeventlistener('loadend', function(e) {
					_fr = null;
					comp.trigger(e);
				});

				if (basic.typeof(_fr[op]) === 'function') {
					_converttobinary = false;
					_fr[op](blob.getsource());
				} else if (op === 'readasbinarystring') { // readasbinarystring is depricated in general and never existed in ie10+
					_converttobinary = true;
					_fr.readasdataurl(blob.getsource());
				}
			},

			abort: function() {
				if (_fr) {
					_fr.abort();
				}
			},

			destroy: function() {
				_fr = null;
			}
		});

		function _tobinary(str) {
			return encode.atob(str.substring(str.indexof('base64,') + 7));
		}
	}

	return (extensions.filereader = filereader);
});

// included from: src/javascript/runtime/html5/xhr/xmlhttprequest.js

/**
 * xmlhttprequest.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/*global activexobject:true */

/**
@class moxie/runtime/html5/xhr/xmlhttprequest
@private
*/
define("moxie/runtime/html5/xhr/xmlhttprequest", [
	"moxie/runtime/html5/runtime",
	"moxie/core/utils/basic",
	"moxie/core/utils/mime",
	"moxie/core/utils/url",
	"moxie/file/file",
	"moxie/file/blob",
	"moxie/xhr/formdata",
	"moxie/core/exceptions",
	"moxie/core/utils/env"
], function(extensions, basic, mime, url, file, blob, formdata, x, env) {
	
	function xmlhttprequest() {
		var self = this
		, _xhr
		, _filename
		;

		basic.extend(this, {
			send: function(meta, data) {
				var target = this
				, isgecko2_5_6 = (env.browser === 'mozilla' && env.vercomp(env.version, 4, '>=') && env.vercomp(env.version, 7, '<'))
				, isandroidbrowser = env.browser === 'android browser'
				, mustsendasbinary = false
				;

				// extract file name
				_filename = meta.url.replace(/^.+?\/([\w\-\.]+)$/, '$1').tolowercase();

				_xhr = _getnativexhr();
				_xhr.open(meta.method, meta.url, meta.async, meta.user, meta.password);


				// prepare data to be sent
				if (data instanceof blob) {
					if (data.isdetached()) {
						mustsendasbinary = true;
					}
					data = data.getsource();
				} else if (data instanceof formdata) {

					if (data.hasblob()) {
						if (data.getblob().isdetached()) {
							data = _preparemultipart.call(target, data); // _xhr must be instantiated and be in opened state
							mustsendasbinary = true;
						} else if ((isgecko2_5_6 || isandroidbrowser) && basic.typeof(data.getblob().getsource()) === 'blob' && window.filereader) {
							// gecko 2/5/6 can't send blob in formdata: https://bugzilla.mozilla.org/show_bug.cgi?id=649150
							// android browsers (default one and dolphin) seem to have the same issue, see: #613
							_preloadandsend.call(target, meta, data);
							return; // _preloadandsend will reinvoke send() with transmutated formdata =%d
						}	
					}

					// transfer fields to real formdata
					if (data instanceof formdata) { // if still a formdata, e.g. not mangled by _preparemultipart()
						var fd = new window.formdata();
						data.each(function(value, name) {
							if (value instanceof blob) {
								fd.append(name, value.getsource());
							} else {
								fd.append(name, value);
							}
						});
						data = fd;
					}
				}


				// if xhr l2
				if (_xhr.upload) {
					if (meta.withcredentials) {
						_xhr.withcredentials = true;
					}

					_xhr.addeventlistener('load', function(e) {
						target.trigger(e);
					});

					_xhr.addeventlistener('error', function(e) {
						target.trigger(e);
					});

					// additionally listen to progress events
					_xhr.addeventlistener('progress', function(e) {
						target.trigger(e);
					});

					_xhr.upload.addeventlistener('progress', function(e) {
						target.trigger({
							type: 'uploadprogress',
							loaded: e.loaded,
							total: e.total
						});
					});
				// ... otherwise simulate xhr l2
				} else {
					_xhr.onreadystatechange = function onreadystatechange() {
						
						// fake level 2 events
						switch (_xhr.readystate) {
							
							case 1: // xmlhttprequest.opened
								// readystatechanged is fired twice for opened state (in ie and mozilla) - neu
								break;
							
							// looks like headers_received (state 2) is not reported in opera (or it's old versions) - neu
							case 2: // xmlhttprequest.headers_received
								break;
								
							case 3: // xmlhttprequest.loading 
								// try to fire progress event for not xhr l2
								var total, loaded;
								
								try {
									if (url.hassameorigin(meta.url)) { // content-length not accessible for cross-domain on some browsers
										total = _xhr.getresponseheader('content-length') || 0; // old safari throws an exception here
									}

									if (_xhr.responsetext) { // responsetext was introduced in ie7
										loaded = _xhr.responsetext.length;
									}
								} catch(ex) {
									total = loaded = 0;
								}

								target.trigger({
									type: 'progress',
									lengthcomputable: !!total,
									total: parseint(total, 10),
									loaded: loaded
								});
								break;
								
							case 4: // xmlhttprequest.done
								// release readystatechange handler (mostly for ie)
								_xhr.onreadystatechange = function() {};

								// usually status 0 is returned when server is unreachable, but ff also fails to status 0 for 408 timeout
								if (_xhr.status === 0) {
									target.trigger('error');
								} else {
									target.trigger('load');
								}							
								break;
						}
					};
				}
				

				// set request headers
				if (!basic.isemptyobj(meta.headers)) {
					basic.each(meta.headers, function(value, header) {
						_xhr.setrequestheader(header, value);
					});
				}

				// request response type
				if ("" !== meta.responsetype && 'responsetype' in _xhr) {
					if ('json' === meta.responsetype && !env.can('return_response_type', 'json')) { // we can fake this one
						_xhr.responsetype = 'text';
					} else {
						_xhr.responsetype = meta.responsetype;
					}
				}

				// send ...
				if (!mustsendasbinary) {
					_xhr.send(data);
				} else {
					if (_xhr.sendasbinary) { // gecko
						_xhr.sendasbinary(data);
					} else { // other browsers having support for typed arrays
						(function() {
							// mimic gecko's sendasbinary
							var ui8a = new uint8array(data.length);
							for (var i = 0; i < data.length; i++) {
								ui8a[i] = (data.charcodeat(i) & 0xff);
							}
							_xhr.send(ui8a.buffer);
						}());
					}
				}

				target.trigger('loadstart');
			},

			getstatus: function() {
				// according to w3c spec it should return 0 for readystate < 3, but instead it throws an exception
				try {
					if (_xhr) {
						return _xhr.status;
					}
				} catch(ex) {}
				return 0;
			},

			getresponse: function(responsetype) {
				var i = this.getruntime();

				try {
					switch (responsetype) {
						case 'blob':
							var file = new file(i.uid, _xhr.response);
							
							// try to extract file name from content-disposition if possible (might be - not, if cors for example)	
							var disposition = _xhr.getresponseheader('content-disposition');
							if (disposition) {
								// extract filename from response header if available
								var match = disposition.match(/filename=([\'\"'])([^\1]+)\1/);
								if (match) {
									_filename = match[2];
								}
							}
							file.name = _filename;

							// pre-webkit opera doesn't set type property on the blob response
							if (!file.type) {
								file.type = mime.getfilemime(_filename);
							}
							return file;

						case 'json':
							if (!env.can('return_response_type', 'json')) {
								return _xhr.status === 200 && !!window.json ? json.parse(_xhr.responsetext) : null;
							}
							return _xhr.response;

						case 'document':
							return _getdocument(_xhr);

						default:
							return _xhr.responsetext !== '' ? _xhr.responsetext : null; // against the specs, but for consistency across the runtimes
					}
				} catch(ex) {
					return null;
				}				
			},

			getallresponseheaders: function() {
				try {
					return _xhr.getallresponseheaders();
				} catch(ex) {}
				return '';
			},

			abort: function() {
				if (_xhr) {
					_xhr.abort();
				}
			},

			destroy: function() {
				self = _filename = null;
			}
		});


		// here we go... ugly fix for ugly bug
		function _preloadandsend(meta, data) {
			var target = this, blob, fr;
				
			// get original blob
			blob = data.getblob().getsource();
			
			// preload blob in memory to be sent as binary string
			fr = new window.filereader();
			fr.onload = function() {
				// overwrite original blob
				data.append(data.getblobname(), new blob(null, {
					type: blob.type,
					data: fr.result
				}));
				// invoke send operation again
				self.send.call(target, meta, data);
			};
			fr.readasbinarystring(blob);
		}

		
		function _getnativexhr() {
			if (window.xmlhttprequest && !(env.browser === 'ie' && env.vercomp(env.version, 8, '<'))) { // ie7 has native xhr but it's buggy
				return new window.xmlhttprequest();
			} else {
				return (function() {
					var progids = ['msxml2.xmlhttp.6.0', 'microsoft.xmlhttp']; // if 6.0 available, use it, otherwise failback to default 3.0
					for (var i = 0; i < progids.length; i++) {
						try {
							return new activexobject(progids[i]);
						} catch (ex) {}
					}
				})();
			}
		}
		
		// @credits sergey ilinsky	(http://www.ilinsky.com/)
		function _getdocument(xhr) {
			var rxml = xhr.responsexml;
			var rtext = xhr.responsetext;
			
			// try parsing responsetext (@see: http://www.ilinsky.com/articles/xmlhttprequest/#bugs-ie-responsexml-content-type)
			if (env.browser === 'ie' && rtext && rxml && !rxml.documentelement && /[^\/]+\/[^\+]+\+xml/.test(xhr.getresponseheader("content-type"))) {
				rxml = new window.activexobject("microsoft.xmldom");
				rxml.async = false;
				rxml.validateonparse = false;
				rxml.loadxml(rtext);
			}
	
			// check if there is no error in document
			if (rxml) {
				if ((env.browser === 'ie' && rxml.parseerror !== 0) || !rxml.documentelement || rxml.documentelement.tagname === "parsererror") {
					return null;
				}
			}
			return rxml;
		}


		function _preparemultipart(fd) {
			var boundary = '----moxieboundary' + new date().gettime()
			, dashdash = '--'
			, crlf = '\r\n'
			, multipart = ''
			, i = this.getruntime()
			;

			if (!i.can('send_binary_string')) {
				throw new x.runtimeerror(x.runtimeerror.not_supported_err);
			}

			_xhr.setrequestheader('content-type', 'multipart/form-data; boundary=' + boundary);

			// append multipart parameters
			fd.each(function(value, name) {
				// firefox 3.6 failed to convert multibyte characters to utf-8 in sendasbinary(), 
				// so we try it here ourselves with: unescape(encodeuricomponent(value))
				if (value instanceof blob) {
					// build rfc2388 blob
					multipart += dashdash + boundary + crlf +
						'content-disposition: form-data; name="' + name + '"; filename="' + unescape(encodeuricomponent(value.name || 'blob')) + '"' + crlf +
						'content-type: ' + (value.type || 'application/octet-stream') + crlf + crlf +
						value.getsource() + crlf;
				} else {
					multipart += dashdash + boundary + crlf +
						'content-disposition: form-data; name="' + name + '"' + crlf + crlf +
						unescape(encodeuricomponent(value)) + crlf;
				}
			});

			multipart += dashdash + boundary + dashdash + crlf;

			return multipart;
		}
	}

	return (extensions.xmlhttprequest = xmlhttprequest);
});

// included from: src/javascript/runtime/html5/utils/binaryreader.js

/**
 * binaryreader.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/html5/utils/binaryreader
@private
*/
define("moxie/runtime/html5/utils/binaryreader", [
	"moxie/core/utils/basic"
], function(basic) {

	
	function binaryreader(data) {
		if (data instanceof arraybuffer) {
			arraybufferreader.apply(this, arguments);
		} else {
			utf16stringreader.apply(this, arguments);
		}
	}

	basic.extend(binaryreader.prototype, {
		
		littleendian: false,


		read: function(idx, size) {
			var sum, mv, i;

			if (idx + size > this.length()) {
				throw new error("you are trying to read outside the source boundaries.");
			}
			
			mv = this.littleendian 
				? 0 
				: -8 * (size - 1)
			;

			for (i = 0, sum = 0; i < size; i++) {
				sum |= (this.readbyteat(idx + i) << math.abs(mv + i*8));
			}
			return sum;
		},


		write: function(idx, num, size) {
			var mv, i, str = '';

			if (idx > this.length()) {
				throw new error("you are trying to write outside the source boundaries.");
			}

			mv = this.littleendian 
				? 0 
				: -8 * (size - 1)
			;

			for (i = 0; i < size; i++) {
				this.writebyteat(idx + i, (num >> math.abs(mv + i*8)) & 255);
			}
		},


		byte: function(idx) {
			return this.read(idx, 1);
		},


		short: function(idx) {
			return this.read(idx, 2);
		},


		long: function(idx) {
			return this.read(idx, 4);
		},


		slong: function(idx) { // 2's complement notation
			var num = this.read(idx, 4);
			return (num > 2147483647 ? num - 4294967296 : num);
		},


		char: function(idx) {
			return string.fromcharcode(this.read(idx, 1));
		},


		string: function(idx, count) {
			return this.asarray('char', idx, count).join('');
		},


		asarray: function(type, idx, count) {
			var values = [];

			for (var i = 0; i < count; i++) {
				values[i] = this[type](idx + i);
			}
			return values;
		}
	});


	function arraybufferreader(data) {
		var _dv = new dataview(data);

		basic.extend(this, {
			
			readbyteat: function(idx) {
				return _dv.getuint8(idx);
			},


			writebyteat: function(idx, value) {
				_dv.setuint8(idx, value);
			},
			

			segment: function(idx, size, value) {
				switch (arguments.length) {
					case 2:
						return data.slice(idx, idx + size);

					case 1:
						return data.slice(idx);

					case 3:
						if (value === null) {
							value = new arraybuffer();
						}

						if (value instanceof arraybuffer) {					
							var arr = new uint8array(this.length() - size + value.bytelength);
							if (idx > 0) {
								arr.set(new uint8array(data.slice(0, idx)), 0);
							}
							arr.set(new uint8array(value), idx);
							arr.set(new uint8array(data.slice(idx + size)), idx + value.bytelength);

							this.clear();
							data = arr.buffer;
							_dv = new dataview(data);
							break;
						}

					default: return data;
				}
			},


			length: function() {
				return data ? data.bytelength : 0;
			},


			clear: function() {
				_dv = data = null;
			}
		});
	}


	function utf16stringreader(data) {
		basic.extend(this, {
			
			readbyteat: function(idx) {
				return data.charcodeat(idx);
			},


			writebyteat: function(idx, value) {
				putstr(string.fromcharcode(value), idx, 1);
			},


			segment: function(idx, length, segment) {
				switch (arguments.length) {
					case 1:
						return data.substr(idx);
					case 2:
						return data.substr(idx, length);
					case 3:
						putstr(segment !== null ? segment : '', idx, length);
						break;
					default: return data;
				}
			},


			length: function() {
				return data ? data.length : 0;
			}, 

			clear: function() {
				data = null;
			}
		});


		function putstr(segment, idx, length) {
			length = arguments.length === 3 ? length : data.length - idx - 1;
			data = data.substr(0, idx) + segment + data.substr(length + idx);
		}
	}


	return binaryreader;
});

// included from: src/javascript/runtime/html5/image/jpegheaders.js

/**
 * jpegheaders.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */
 
/**
@class moxie/runtime/html5/image/jpegheaders
@private
*/
define("moxie/runtime/html5/image/jpegheaders", [
	"moxie/runtime/html5/utils/binaryreader",
	"moxie/core/exceptions"
], function(binaryreader, x) {
	
	return function jpegheaders(data) {
		var headers = [], _br, idx, marker, length = 0;

		_br = new binaryreader(data);

		// check if data is jpeg
		if (_br.short(0) !== 0xffd8) {
			_br.clear();
			throw new x.imageerror(x.imageerror.wrong_format);
		}

		idx = 2;

		while (idx <= _br.length()) {
			marker = _br.short(idx);

			// omit rst (restart) markers
			if (marker >= 0xffd0 && marker <= 0xffd7) {
				idx += 2;
				continue;
			}

			// no headers allowed after sos marker
			if (marker === 0xffda || marker === 0xffd9) {
				break;
			}

			length = _br.short(idx + 2) + 2;

			// appn marker detected
			if (marker >= 0xffe1 && marker <= 0xffef) {
				headers.push({
					hex: marker,
					name: 'app' + (marker & 0x000f),
					start: idx,
					length: length,
					segment: _br.segment(idx, length)
				});
			}

			idx += length;
		}

		_br.clear();

		return {
			headers: headers,

			restore: function(data) {
				var max, i, br;

				br = new binaryreader(data);

				idx = br.short(2) == 0xffe0 ? 4 + br.short(4) : 2;

				for (i = 0, max = headers.length; i < max; i++) {
					br.segment(idx, 0, headers[i].segment);
					idx += headers[i].length;
				}

				data = br.segment();
				br.clear();
				return data;
			},

			strip: function(data) {
				var br, headers, jpegheaders, i;

				jpegheaders = new jpegheaders(data);
				headers = jpegheaders.headers;
				jpegheaders.purge();

				br = new binaryreader(data);

				i = headers.length;
				while (i--) {
					br.segment(headers[i].start, headers[i].length, '');
				}
				
				data = br.segment();
				br.clear();
				return data;
			},

			get: function(name) {
				var array = [];

				for (var i = 0, max = headers.length; i < max; i++) {
					if (headers[i].name === name.touppercase()) {
						array.push(headers[i].segment);
					}
				}
				return array;
			},

			set: function(name, segment) {
				var array = [], i, ii, max;

				if (typeof(segment) === 'string') {
					array.push(segment);
				} else {
					array = segment;
				}

				for (i = ii = 0, max = headers.length; i < max; i++) {
					if (headers[i].name === name.touppercase()) {
						headers[i].segment = array[ii];
						headers[i].length = array[ii].length;
						ii++;
					}
					if (ii >= array.length) {
						break;
					}
				}
			},

			purge: function() {
				this.headers = headers = [];
			}
		};
	};
});

// included from: src/javascript/runtime/html5/image/exifparser.js

/**
 * exifparser.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/html5/image/exifparser
@private
*/
define("moxie/runtime/html5/image/exifparser", [
	"moxie/core/utils/basic",
	"moxie/runtime/html5/utils/binaryreader",
	"moxie/core/exceptions"
], function(basic, binaryreader, x) {
	
	function exifparser(data) {
		var __super__, tags, tagdescs, offsets, idx, tiff;
		
		binaryreader.call(this, data);

		tags = {
			tiff: {
				/*
				the image orientation viewed in terms of rows and columns.

				1 = the 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.
				2 = the 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.
				3 = the 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.
				4 = the 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.
				5 = the 0th row is the visual left-hand side of the image, and the 0th column is the visual top.
				6 = the 0th row is the visual right-hand side of the image, and the 0th column is the visual top.
				7 = the 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.
				8 = the 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.
				*/
				0x0112: 'orientation',
				0x010e: 'imagedescription',
				0x010f: 'make',
				0x0110: 'model',
				0x0131: 'software',
				0x8769: 'exififdpointer',
				0x8825:	'gpsinfoifdpointer'
			},
			exif: {
				0x9000: 'exifversion',
				0xa001: 'colorspace',
				0xa002: 'pixelxdimension',
				0xa003: 'pixelydimension',
				0x9003: 'datetimeoriginal',
				0x829a: 'exposuretime',
				0x829d: 'fnumber',
				0x8827: 'isospeedratings',
				0x9201: 'shutterspeedvalue',
				0x9202: 'aperturevalue'	,
				0x9207: 'meteringmode',
				0x9208: 'lightsource',
				0x9209: 'flash',
				0x920a: 'focallength',
				0xa402: 'exposuremode',
				0xa403: 'whitebalance',
				0xa406: 'scenecapturetype',
				0xa404: 'digitalzoomratio',
				0xa408: 'contrast',
				0xa409: 'saturation',
				0xa40a: 'sharpness'
			},
			gps: {
				0x0000: 'gpsversionid',
				0x0001: 'gpslatituderef',
				0x0002: 'gpslatitude',
				0x0003: 'gpslongituderef',
				0x0004: 'gpslongitude'
			},

			thumb: {
				0x0201: 'jpeginterchangeformat',
				0x0202: 'jpeginterchangeformatlength'
			}
		};

		tagdescs = {
			'colorspace': {
				1: 'srgb',
				0: 'uncalibrated'
			},

			'meteringmode': {
				0: 'unknown',
				1: 'average',
				2: 'centerweightedaverage',
				3: 'spot',
				4: 'multispot',
				5: 'pattern',
				6: 'partial',
				255: 'other'
			},

			'lightsource': {
				1: 'daylight',
				2: 'fliorescent',
				3: 'tungsten',
				4: 'flash',
				9: 'fine weather',
				10: 'cloudy weather',
				11: 'shade',
				12: 'daylight fluorescent (d 5700 - 7100k)',
				13: 'day white fluorescent (n 4600 -5400k)',
				14: 'cool white fluorescent (w 3900 - 4500k)',
				15: 'white fluorescent (ww 3200 - 3700k)',
				17: 'standard light a',
				18: 'standard light b',
				19: 'standard light c',
				20: 'd55',
				21: 'd65',
				22: 'd75',
				23: 'd50',
				24: 'iso studio tungsten',
				255: 'other'
			},

			'flash': {
				0x0000: 'flash did not fire',
				0x0001: 'flash fired',
				0x0005: 'strobe return light not detected',
				0x0007: 'strobe return light detected',
				0x0009: 'flash fired, compulsory flash mode',
				0x000d: 'flash fired, compulsory flash mode, return light not detected',
				0x000f: 'flash fired, compulsory flash mode, return light detected',
				0x0010: 'flash did not fire, compulsory flash mode',
				0x0018: 'flash did not fire, auto mode',
				0x0019: 'flash fired, auto mode',
				0x001d: 'flash fired, auto mode, return light not detected',
				0x001f: 'flash fired, auto mode, return light detected',
				0x0020: 'no flash function',
				0x0041: 'flash fired, red-eye reduction mode',
				0x0045: 'flash fired, red-eye reduction mode, return light not detected',
				0x0047: 'flash fired, red-eye reduction mode, return light detected',
				0x0049: 'flash fired, compulsory flash mode, red-eye reduction mode',
				0x004d: 'flash fired, compulsory flash mode, red-eye reduction mode, return light not detected',
				0x004f: 'flash fired, compulsory flash mode, red-eye reduction mode, return light detected',
				0x0059: 'flash fired, auto mode, red-eye reduction mode',
				0x005d: 'flash fired, auto mode, return light not detected, red-eye reduction mode',
				0x005f: 'flash fired, auto mode, return light detected, red-eye reduction mode'
			},

			'exposuremode': {
				0: 'auto exposure',
				1: 'manual exposure',
				2: 'auto bracket'
			},

			'whitebalance': {
				0: 'auto white balance',
				1: 'manual white balance'
			},

			'scenecapturetype': {
				0: 'standard',
				1: 'landscape',
				2: 'portrait',
				3: 'night scene'
			},

			'contrast': {
				0: 'normal',
				1: 'soft',
				2: 'hard'
			},

			'saturation': {
				0: 'normal',
				1: 'low saturation',
				2: 'high saturation'
			},

			'sharpness': {
				0: 'normal',
				1: 'soft',
				2: 'hard'
			},

			// gps related
			'gpslatituderef': {
				n: 'north latitude',
				s: 'south latitude'
			},

			'gpslongituderef': {
				e: 'east longitude',
				w: 'west longitude'
			}
		};

		offsets = {
			tiffheader: 10
		};
		
		idx = offsets.tiffheader;

		__super__ = {
			clear: this.clear
		};

		// public functions
		basic.extend(this, {
			
			read: function() {
				try {
					return exifparser.prototype.read.apply(this, arguments);
				} catch (ex) {
					throw new x.imageerror(x.imageerror.invalid_meta_err);
				}
			},


			write: function() {
				try {
					return exifparser.prototype.write.apply(this, arguments);
				} catch (ex) {
					throw new x.imageerror(x.imageerror.invalid_meta_err);
				}
			},


			undefined: function() {
				return this.byte.apply(this, arguments);
			},


			rational: function(idx) {
				return this.long(idx) / this.long(idx + 4)
			},


			srational: function(idx) {
				return this.slong(idx) / this.slong(idx + 4)
			},

			ascii: function(idx) {
				return this.char(idx);
			},

			tiff: function() {
				return tiff || null;
			},


			exif: function() {
				var exif = null;

				if (offsets.exififd) {
					try {
						exif = extracttags.call(this, offsets.exififd, tags.exif);
					} catch(ex) {
						return null;
					}

					// fix formatting of some tags
					if (exif.exifversion && basic.typeof(exif.exifversion) === 'array') {
						for (var i = 0, exifversion = ''; i < exif.exifversion.length; i++) {
							exifversion += string.fromcharcode(exif.exifversion[i]);
						}
						exif.exifversion = exifversion;
					}
				}

				return exif;
			},


			gps: function() {
				var gps = null;

				if (offsets.gpsifd) {
					try {
						gps = extracttags.call(this, offsets.gpsifd, tags.gps);
					} catch (ex) {
						return null;
					}

					// ios devices (and probably some others) do not put in gpsversionid tag (why?..)
					if (gps.gpsversionid && basic.typeof(gps.gpsversionid) === 'array') {
						gps.gpsversionid = gps.gpsversionid.join('.');
					}
				}

				return gps;
			},


			thumb: function() {
				if (offsets.ifd1) {
					try {
						var ifd1tags = extracttags.call(this, offsets.ifd1, tags.thumb);
						
						if ('jpeginterchangeformat' in ifd1tags) {
							return this.segment(offsets.tiffheader + ifd1tags.jpeginterchangeformat, ifd1tags.jpeginterchangeformatlength);
						}
					} catch (ex) {}
				}
				return null;
			},


			setexif: function(tag, value) {
				// right now only setting of width/height is possible
				if (tag !== 'pixelxdimension' && tag !== 'pixelydimension') { return false; }

				return settag.call(this, 'exif', tag, value);
			},


			clear: function() {
				__super__.clear();
				data = tags = tagdescs = tiff = offsets = __super__ = null;
			}
		});


		// check if that's app1 and that it has exif
		if (this.short(0) !== 0xffe1 || this.string(4, 5).touppercase() !== "exif\0") {
			throw new x.imageerror(x.imageerror.invalid_meta_err);
		}

		// set read order of multi-byte data
		this.littleendian = (this.short(idx) == 0x4949);

		// check if always present bytes are indeed present
		if (this.short(idx+=2) !== 0x002a) {
			throw new x.imageerror(x.imageerror.invalid_meta_err);
		}

		offsets.ifd0 = offsets.tiffheader + this.long(idx += 2);
		tiff = extracttags.call(this, offsets.ifd0, tags.tiff);

		if ('exififdpointer' in tiff) {
			offsets.exififd = offsets.tiffheader + tiff.exififdpointer;
			delete tiff.exififdpointer;
		}

		if ('gpsinfoifdpointer' in tiff) {
			offsets.gpsifd = offsets.tiffheader + tiff.gpsinfoifdpointer;
			delete tiff.gpsinfoifdpointer;
		}

		if (basic.isemptyobj(tiff)) {
			tiff = null;
		}

		// check if we have a thumb as well
		var ifd1offset = this.long(offsets.ifd0 + this.short(offsets.ifd0) * 12 + 2);
		if (ifd1offset) {
			offsets.ifd1 = offsets.tiffheader + ifd1offset;
		}


		function extracttags(ifd_offset, tags2extract) {
			var data = this;
			var length, i, tag, type, count, size, offset, value, values = [], hash = {};
			
			var types = {
				1 : 'byte',
				7 : 'undefined',
				2 : 'ascii',
				3 : 'short',
				4 : 'long',
				5 : 'rational',
				9 : 'slong',
				10: 'srational'
			};

			var sizes = {
				'byte' 		: 1,
				'undefined'	: 1,
				'ascii'		: 1,
				'short'		: 2,
				'long' 		: 4,
				'rational' 	: 8,
				'slong'		: 4,
				'srational'	: 8
			};

			length = data.short(ifd_offset);

			// the size of app1 including all these elements shall not exceed the 64 kbytes specified in the jpeg standard.

			for (i = 0; i < length; i++) {
				values = [];

				// set binary reader pointer to beginning of the next tag
				offset = ifd_offset + 2 + i*12;

				tag = tags2extract[data.short(offset)];

				if (tag === undefined) {
					continue; // not the tag we requested
				}

				type = types[data.short(offset+=2)];
				count = data.long(offset+=2);
				size = sizes[type];

				if (!size) {
					throw new x.imageerror(x.imageerror.invalid_meta_err);
				}

				offset += 4;

				// tag can only fit 4 bytes of data, if data is larger we should look outside
				if (size * count > 4) {
					// instead of data tag contains an offset of the data
					offset = data.long(offset) + offsets.tiffheader;
				}

				// in case we left the boundaries of data throw an early exception
				if (offset + size * count >= this.length()) {
					throw new x.imageerror(x.imageerror.invalid_meta_err);
				} 

				// special care for the string
				if (type === 'ascii') {
					hash[tag] = basic.trim(data.string(offset, count).replace(/\0$/, '')); // strip trailing null
					continue;
				} else {
					values = data.asarray(type, offset, count);
					value = (count == 1 ? values[0] : values);

					if (tagdescs.hasownproperty(tag) && typeof value != 'object') {
						hash[tag] = tagdescs[tag][value];
					} else {
						hash[tag] = value;
					}
				}
			}

			return hash;
		}

		// at the moment only setting of simple (long) values, that do not require offset recalculation, is supported
		function settag(ifd, tag, value) {
			var offset, length, tagoffset, valueoffset = 0;

			// if tag name passed translate into hex key
			if (typeof(tag) === 'string') {
				var tmptags = tags[ifd.tolowercase()];
				for (var hex in tmptags) {
					if (tmptags[hex] === tag) {
						tag = hex;
						break;
					}
				}
			}
			offset = offsets[ifd.tolowercase() + 'ifd'];
			length = this.short(offset);

			for (var i = 0; i < length; i++) {
				tagoffset = offset + 12 * i + 2;

				if (this.short(tagoffset) == tag) {
					valueoffset = tagoffset + 8;
					break;
				}
			}

			if (!valueoffset) {
				return false;
			}

			try {
				this.write(valueoffset, value, 4);
			} catch(ex) {
				return false;
			}

			return true;
		}
	}

	exifparser.prototype = binaryreader.prototype;

	return exifparser;
});

// included from: src/javascript/runtime/html5/image/jpeg.js

/**
 * jpeg.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/html5/image/jpeg
@private
*/
define("moxie/runtime/html5/image/jpeg", [
	"moxie/core/utils/basic",
	"moxie/core/exceptions",
	"moxie/runtime/html5/image/jpegheaders",
	"moxie/runtime/html5/utils/binaryreader",
	"moxie/runtime/html5/image/exifparser"
], function(basic, x, jpegheaders, binaryreader, exifparser) {
	
	function jpeg(data) {
		var _br, _hm, _ep, _info;

		_br = new binaryreader(data);

		// check if it is jpeg
		if (_br.short(0) !== 0xffd8) {
			throw new x.imageerror(x.imageerror.wrong_format);
		}

		// backup headers
		_hm = new jpegheaders(data);

		// extract exif info
		try {
			_ep = new exifparser(_hm.get('app1')[0]);
		} catch(ex) {}

		// get dimensions
		_info = _getdimensions.call(this);

		basic.extend(this, {
			type: 'image/jpeg',

			size: _br.length(),

			width: _info && _info.width || 0,

			height: _info && _info.height || 0,

			setexif: function(tag, value) {
				if (!_ep) {
					return false; // or throw an exception
				}

				if (basic.typeof(tag) === 'object') {
					basic.each(tag, function(value, tag) {
						_ep.setexif(tag, value);
					});
				} else {
					_ep.setexif(tag, value);
				}

				// update internal headers
				_hm.set('app1', _ep.segment());
			},

			writeheaders: function() {
				if (!arguments.length) {
					// if no arguments passed, update headers internally
					return _hm.restore(data);
				}
				return _hm.restore(arguments[0]);
			},

			stripheaders: function(data) {
				return _hm.strip(data);
			},

			purge: function() {
				_purge.call(this);
			}
		});

		if (_ep) {
			this.meta = {
				tiff: _ep.tiff(),
				exif: _ep.exif(),
				gps: _ep.gps(),
				thumb: _getthumb()
			};
		}


		function _getdimensions(br) {
			var idx = 0
			, marker
			, length
			;

			if (!br) {
				br = _br;
			}

			// examine all through the end, since some images might have very large app segments
			while (idx <= br.length()) {
				marker = br.short(idx += 2);

				if (marker >= 0xffc0 && marker <= 0xffc3) { // sofn
					idx += 5; // marker (2 bytes) + length (2 bytes) + sample precision (1 byte)
					return {
						height: br.short(idx),
						width: br.short(idx += 2)
					};
				}
				length = br.short(idx += 2);
				idx += length - 2;
			}
			return null;
		}


		function _getthumb() {
			var data =  _ep.thumb()
			, br
			, info
			;

			if (data) {
				br = new binaryreader(data);
				info = _getdimensions(br);
				br.clear();

				if (info) {
					info.data = data;
					return info;
				}
			}
			return null;
		}


		function _purge() {
			if (!_ep || !_hm || !_br) { 
				return; // ignore any repeating purge requests
			}
			_ep.clear();
			_hm.purge();
			_br.clear();
			_info = _hm = _ep = _br = null;
		}
	}

	return jpeg;
});

// included from: src/javascript/runtime/html5/image/png.js

/**
 * png.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/html5/image/png
@private
*/
define("moxie/runtime/html5/image/png", [
	"moxie/core/exceptions",
	"moxie/core/utils/basic",
	"moxie/runtime/html5/utils/binaryreader"
], function(x, basic, binaryreader) {
	
	function png(data) {
		var _br, _hm, _ep, _info;

		_br = new binaryreader(data);

		// check if it's png
		(function() {
			var idx = 0, i = 0
			, signature = [0x8950, 0x4e47, 0x0d0a, 0x1a0a]
			;

			for (i = 0; i < signature.length; i++, idx += 2) {
				if (signature[i] != _br.short(idx)) {
					throw new x.imageerror(x.imageerror.wrong_format);
				}
			}
		}());

		function _getdimensions() {
			var chunk, idx;

			chunk = _getchunkat.call(this, 8);

			if (chunk.type == 'ihdr') {
				idx = chunk.start;
				return {
					width: _br.long(idx),
					height: _br.long(idx += 4)
				};
			}
			return null;
		}

		function _purge() {
			if (!_br) {
				return; // ignore any repeating purge requests
			}
			_br.clear();
			data = _info = _hm = _ep = _br = null;
		}

		_info = _getdimensions.call(this);

		basic.extend(this, {
			type: 'image/png',

			size: _br.length(),

			width: _info.width,

			height: _info.height,

			purge: function() {
				_purge.call(this);
			}
		});

		// for png we can safely trigger purge automatically, as we do not keep any data for later
		_purge.call(this);

		function _getchunkat(idx) {
			var length, type, start, crc;

			length = _br.long(idx);
			type = _br.string(idx += 4, 4);
			start = idx += 4;
			crc = _br.long(idx + length);

			return {
				length: length,
				type: type,
				start: start,
				crc: crc
			};
		}
	}

	return png;
});

// included from: src/javascript/runtime/html5/image/imageinfo.js

/**
 * imageinfo.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/html5/image/imageinfo
@private
*/
define("moxie/runtime/html5/image/imageinfo", [
	"moxie/core/utils/basic",
	"moxie/core/exceptions",
	"moxie/runtime/html5/image/jpeg",
	"moxie/runtime/html5/image/png"
], function(basic, x, jpeg, png) {
	/**
	optional image investigation tool for html5 runtime. provides the following features:
	- ability to distinguish image type (jpeg or png) by signature
	- ability to extract image width/height directly from it's internals, without preloading in memory (fast)
	- ability to extract app headers from jpegs (exif, gps, etc)
	- ability to replace width/height tags in extracted jpeg headers
	- ability to restore app headers, that were for example stripped during image manipulation

	@class imageinfo
	@constructor
	@param {string} data image source as binary string
	*/
	return function(data) {
		var _cs = [jpeg, png], _img;

		// figure out the format, throw: imageerror.wrong_format if not supported
		_img = (function() {
			for (var i = 0; i < _cs.length; i++) {
				try {
					return new _cs[i](data);
				} catch (ex) {
					// console.info(ex);
				}
			}
			throw new x.imageerror(x.imageerror.wrong_format);
		}());

		basic.extend(this, {
			/**
			image mime type extracted from it's depths

			@property type
			@type {string}
			@default ''
			*/
			type: '',

			/**
			image size in bytes

			@property size
			@type {number}
			@default 0
			*/
			size: 0,

			/**
			image width extracted from image source

			@property width
			@type {number}
			@default 0
			*/
			width: 0,

			/**
			image height extracted from image source

			@property height
			@type {number}
			@default 0
			*/
			height: 0,

			/**
			sets exif tag. currently applicable only for width and height tags. obviously works only with jpegs.

			@method setexif
			@param {string} tag tag to set
			@param {mixed} value value to assign to the tag
			*/
			setexif: function() {},

			/**
			restores headers to the source.

			@method writeheaders
			@param {string} data image source as binary string
			@return {string} updated binary string
			*/
			writeheaders: function(data) {
				return data;
			},

			/**
			strip all headers from the source.

			@method stripheaders
			@param {string} data image source as binary string
			@return {string} updated binary string
			*/
			stripheaders: function(data) {
				return data;
			},

			/**
			dispose resources.

			@method purge
			*/
			purge: function() {
				data = null;
			}
		});

		basic.extend(this, _img);

		this.purge = function() {
			_img.purge();
			_img = null;
		};
	};
});

// included from: src/javascript/runtime/html5/image/megapixel.js

/**
(the mit license)

copyright (c) 2012 shinichi tomita <shinichi.tomita@gmail.com>;

permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'software'), to deal in the software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the software, and to
permit persons to whom the software is furnished to do so, subject to
the following conditions:

the above copyright notice and this permission notice shall be
included in all copies or substantial portions of the software.

the software is provided 'as is', without warranty of any kind,
express or implied, including but not limited to the warranties of
merchantability, fitness for a particular purpose and noninfringement.
in no event shall the authors or copyright holders be liable for any
claim, damages or other liability, whether in an action of contract,
tort or otherwise, arising from, out of or in connection with the
software or the use or other dealings in the software.
*/

/**
 * mega pixel image rendering library for ios6 safari
 *
 * fixes ios6 safari's image file rendering issue for large size image (over mega-pixel),
 * which causes unexpected subsampling when drawing it in canvas.
 * by using this library, you can safely render the image with proper stretching.
 *
 * copyright (c) 2012 shinichi tomita <shinichi.tomita@gmail.com>
 * released under the mit license
 */

/**
@class moxie/runtime/html5/image/megapixel
@private
*/
define("moxie/runtime/html5/image/megapixel", [], function() {

	/**
	 * rendering image element (with resizing) into the canvas element
	 */
	function renderimagetocanvas(img, canvas, options) {
		var iw = img.naturalwidth, ih = img.naturalheight;
		var width = options.width, height = options.height;
		var x = options.x || 0, y = options.y || 0;
		var ctx = canvas.getcontext('2d');
		if (detectsubsampling(img)) {
			iw /= 2;
			ih /= 2;
		}
		var d = 1024; // size of tiling canvas
		var tmpcanvas = document.createelement('canvas');
		tmpcanvas.width = tmpcanvas.height = d;
		var tmpctx = tmpcanvas.getcontext('2d');
		var vertsquashratio = detectverticalsquash(img, iw, ih);
		var sy = 0;
		while (sy < ih) {
			var sh = sy + d > ih ? ih - sy : d;
			var sx = 0;
			while (sx < iw) {
				var sw = sx + d > iw ? iw - sx : d;
				tmpctx.clearrect(0, 0, d, d);
				tmpctx.drawimage(img, -sx, -sy);
				var dx = (sx * width / iw + x) << 0;
				var dw = math.ceil(sw * width / iw);
				var dy = (sy * height / ih / vertsquashratio + y) << 0;
				var dh = math.ceil(sh * height / ih / vertsquashratio);
				ctx.drawimage(tmpcanvas, 0, 0, sw, sh, dx, dy, dw, dh);
				sx += d;
			}
			sy += d;
		}
		tmpcanvas = tmpctx = null;
	}

	/**
	 * detect subsampling in loaded image.
	 * in ios, larger images than 2m pixels may be subsampled in rendering.
	 */
	function detectsubsampling(img) {
		var iw = img.naturalwidth, ih = img.naturalheight;
		if (iw * ih > 1024 * 1024) { // subsampling may happen over megapixel image
			var canvas = document.createelement('canvas');
			canvas.width = canvas.height = 1;
			var ctx = canvas.getcontext('2d');
			ctx.drawimage(img, -iw + 1, 0);
			// subsampled image becomes half smaller in rendering size.
			// check alpha channel value to confirm image is covering edge pixel or not.
			// if alpha value is 0 image is not covering, hence subsampled.
			return ctx.getimagedata(0, 0, 1, 1).data[3] === 0;
		} else {
			return false;
		}
	}


	/**
	 * detecting vertical squash in loaded image.
	 * fixes a bug which squash image vertically while drawing into canvas for some images.
	 */
	function detectverticalsquash(img, iw, ih) {
		var canvas = document.createelement('canvas');
		canvas.width = 1;
		canvas.height = ih;
		var ctx = canvas.getcontext('2d');
		ctx.drawimage(img, 0, 0);
		var data = ctx.getimagedata(0, 0, 1, ih).data;
		// search image edge pixel position in case it is squashed vertically.
		var sy = 0;
		var ey = ih;
		var py = ih;
		while (py > sy) {
			var alpha = data[(py - 1) * 4 + 3];
			if (alpha === 0) {
				ey = py;
			} else {
			sy = py;
			}
			py = (ey + sy) >> 1;
		}
		canvas = null;
		var ratio = (py / ih);
		return (ratio === 0) ? 1 : ratio;
	}

	return {
		issubsampled: detectsubsampling,
		renderto: renderimagetocanvas
	};
});

// included from: src/javascript/runtime/html5/image/image.js

/**
 * image.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/html5/image/image
@private
*/
define("moxie/runtime/html5/image/image", [
	"moxie/runtime/html5/runtime",
	"moxie/core/utils/basic",
	"moxie/core/exceptions",
	"moxie/core/utils/encode",
	"moxie/file/blob",
	"moxie/file/file",
	"moxie/runtime/html5/image/imageinfo",
	"moxie/runtime/html5/image/megapixel",
	"moxie/core/utils/mime",
	"moxie/core/utils/env"
], function(extensions, basic, x, encode, blob, file, imageinfo, megapixel, mime, env) {
	
	function html5image() {
		var me = this
		, _img, _imginfo, _canvas, _binstr, _blob
		, _modified = false // is set true whenever image is modified
		, _preserveheaders = true
		;

		basic.extend(this, {
			loadfromblob: function(blob) {
				var comp = this, i = comp.getruntime()
				, asbinary = arguments.length > 1 ? arguments[1] : true
				;

				if (!i.can('access_binary')) {
					throw new x.runtimeerror(x.runtimeerror.not_supported_err);
				}

				_blob = blob;

				if (blob.isdetached()) {
					_binstr = blob.getsource();
					_preload.call(this, _binstr);
					return;
				} else {
					_readasdataurl.call(this, blob.getsource(), function(dataurl) {
						if (asbinary) {
							_binstr = _tobinary(dataurl);
						}
						_preload.call(comp, dataurl);
					});
				}
			},

			loadfromimage: function(img, exact) {
				this.meta = img.meta;

				_blob = new file(null, {
					name: img.name,
					size: img.size,
					type: img.type
				});

				_preload.call(this, exact ? (_binstr = img.getasbinarystring()) : img.getasdataurl());
			},

			getinfo: function() {
				var i = this.getruntime(), info;

				if (!_imginfo && _binstr && i.can('access_image_binary')) {
					_imginfo = new imageinfo(_binstr);
				}

				info = {
					width: _getimg().width || 0,
					height: _getimg().height || 0,
					type: _blob.type || mime.getfilemime(_blob.name),
					size: _binstr && _binstr.length || _blob.size || 0,
					name: _blob.name || '',
					meta: _imginfo && _imginfo.meta || this.meta || {}
				};

				// store thumbnail data as blob
				if (info.meta && info.meta.thumb && !(info.meta.thumb.data instanceof blob)) {
					info.meta.thumb.data = new blob(null, {
						type: 'image/jpeg',
						data: info.meta.thumb.data
					});
				}

				return info;
			},

			downsize: function() {
				_downsize.apply(this, arguments);
			},

			getascanvas: function() {
				if (_canvas) {
					_canvas.id = this.uid + '_canvas';
				}
				return _canvas;
			},

			getasblob: function(type, quality) {
				if (type !== this.type) {
					// if different mime type requested prepare image for conversion
					_downsize.call(this, this.width, this.height, false);
				}
				return new file(null, {
					name: _blob.name || '',
					type: type,
					data: me.getasbinarystring.call(this, type, quality)
				});
			},

			getasdataurl: function(type) {
				var quality = arguments[1] || 90;

				// if image has not been modified, return the source right away
				if (!_modified) {
					return _img.src;
				}

				if ('image/jpeg' !== type) {
					return _canvas.todataurl('image/png');
				} else {
					try {
						// older geckos used to result in an exception on quality argument
						return _canvas.todataurl('image/jpeg', quality/100);
					} catch (ex) {
						return _canvas.todataurl('image/jpeg');
					}
				}
			},

			getasbinarystring: function(type, quality) {
				// if image has not been modified, return the source right away
				if (!_modified) {
					// if image was not loaded from binary string
					if (!_binstr) {
						_binstr = _tobinary(me.getasdataurl(type, quality));
					}
					return _binstr;
				}

				if ('image/jpeg' !== type) {
					_binstr = _tobinary(me.getasdataurl(type, quality));
				} else {
					var dataurl;

					// if jpeg
					if (!quality) {
						quality = 90;
					}

					try {
						// older geckos used to result in an exception on quality argument
						dataurl = _canvas.todataurl('image/jpeg', quality/100);
					} catch (ex) {
						dataurl = _canvas.todataurl('image/jpeg');
					}

					_binstr = _tobinary(dataurl);

					if (_imginfo) {
						_binstr = _imginfo.stripheaders(_binstr);

						if (_preserveheaders) {
							// update dimensions info in exif
							if (_imginfo.meta && _imginfo.meta.exif) {
								_imginfo.setexif({
									pixelxdimension: this.width,
									pixelydimension: this.height
								});
							}

							// re-inject the headers
							_binstr = _imginfo.writeheaders(_binstr);
						}

						// will be re-created from fresh on next getinfo call
						_imginfo.purge();
						_imginfo = null;
					}
				}

				_modified = false;

				return _binstr;
			},

			destroy: function() {
				me = null;
				_purge.call(this);
				this.getruntime().getshim().removeinstance(this.uid);
			}
		});


		function _getimg() {
			if (!_canvas && !_img) {
				throw new x.imageerror(x.domexception.invalid_state_err);
			}
			return _canvas || _img;
		}


		function _tobinary(str) {
			return encode.atob(str.substring(str.indexof('base64,') + 7));
		}


		function _todataurl(str, type) {
			return 'data:' + (type || '') + ';base64,' + encode.btoa(str);
		}


		function _preload(str) {
			var comp = this;

			_img = new image();
			_img.onerror = function() {
				_purge.call(this);
				comp.trigger('error', x.imageerror.wrong_format);
			};
			_img.onload = function() {
				comp.trigger('load');
			};

			_img.src = str.substr(0, 5) == 'data:' ? str : _todataurl(str, _blob.type);
		}


		function _readasdataurl(file, callback) {
			var comp = this, fr;

			// use filereader if it's available
			if (window.filereader) {
				fr = new filereader();
				fr.onload = function() {
					callback(this.result);
				};
				fr.onerror = function() {
					comp.trigger('error', x.imageerror.wrong_format);
				};
				fr.readasdataurl(file);
			} else {
				return callback(file.getasdataurl());
			}
		}

		function _downsize(width, height, crop, preserveheaders) {
			var self = this
			, scale
			, mathfn
			, x = 0
			, y = 0
			, img
			, destwidth
			, destheight
			, orientation
			;

			_preserveheaders = preserveheaders; // we will need to check this on export (see getasbinarystring())

			// take into account orientation tag
			orientation = (this.meta && this.meta.tiff && this.meta.tiff.orientation) || 1;

			if (basic.inarray(orientation, [5,6,7,8]) !== -1) { // values that require 90 degree rotation
				// swap dimensions
				var tmp = width;
				width = height;
				height = tmp;
			}

			img = _getimg();

			// unify dimensions
			if (!crop) {
				scale = math.min(width/img.width, height/img.height);
			} else {
				// one of the dimensions may exceed the actual image dimensions - we need to take the smallest value
				width = math.min(width, img.width);
				height = math.min(height, img.height);

				scale = math.max(width/img.width, height/img.height);
			}
		
			// we only downsize here
			if (scale > 1 && !crop && preserveheaders) {
				this.trigger('resize');
				return;
			}

			// prepare canvas if necessary
			if (!_canvas) {
				_canvas = document.createelement("canvas");
			}

			// calculate dimensions of proportionally resized image
			destwidth = math.round(img.width * scale);	
			destheight = math.round(img.height * scale);

			// scale image and canvas
			if (crop) {
				_canvas.width = width;
				_canvas.height = height;

				// if dimensions of the resulting image still larger than canvas, center it
				if (destwidth > width) {
					x = math.round((destwidth - width) / 2);
				}

				if (destheight > height) {
					y = math.round((destheight - height) / 2);
				}
			} else {
				_canvas.width = destwidth;
				_canvas.height = destheight;
			}

			// rotate if required, according to orientation tag
			if (!_preserveheaders) {
				_rotatetoorientaion(_canvas.width, _canvas.height, orientation);
			}

			_drawtocanvas.call(this, img, _canvas, -x, -y, destwidth, destheight);

			this.width = _canvas.width;
			this.height = _canvas.height;

			_modified = true;
			self.trigger('resize');
		}


		function _drawtocanvas(img, canvas, x, y, w, h) {
			if (env.os === 'ios') { 
				// avoid squish bug in ios6
				megapixel.renderto(img, canvas, { width: w, height: h, x: x, y: y });
			} else {
				var ctx = canvas.getcontext('2d');
				ctx.drawimage(img, x, y, w, h);
			}
		}


		/**
		* transform canvas coordination according to specified frame size and orientation
		* orientation value is from exif tag
		* @author shinichi tomita <shinichi.tomita@gmail.com>
		*/
		function _rotatetoorientaion(width, height, orientation) {
			switch (orientation) {
				case 5:
				case 6:
				case 7:
				case 8:
					_canvas.width = height;
					_canvas.height = width;
					break;
				default:
					_canvas.width = width;
					_canvas.height = height;
			}

			/**
			1 = the 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.
			2 = the 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.
			3 = the 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.
			4 = the 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.
			5 = the 0th row is the visual left-hand side of the image, and the 0th column is the visual top.
			6 = the 0th row is the visual right-hand side of the image, and the 0th column is the visual top.
			7 = the 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.
			8 = the 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.
			*/

			var ctx = _canvas.getcontext('2d');
			switch (orientation) {
				case 2:
					// horizontal flip
					ctx.translate(width, 0);
					ctx.scale(-1, 1);
					break;
				case 3:
					// 180 rotate left
					ctx.translate(width, height);
					ctx.rotate(math.pi);
					break;
				case 4:
					// vertical flip
					ctx.translate(0, height);
					ctx.scale(1, -1);
					break;
				case 5:
					// vertical flip + 90 rotate right
					ctx.rotate(0.5 * math.pi);
					ctx.scale(1, -1);
					break;
				case 6:
					// 90 rotate right
					ctx.rotate(0.5 * math.pi);
					ctx.translate(0, -height);
					break;
				case 7:
					// horizontal flip + 90 rotate right
					ctx.rotate(0.5 * math.pi);
					ctx.translate(width, -height);
					ctx.scale(-1, 1);
					break;
				case 8:
					// 90 rotate left
					ctx.rotate(-0.5 * math.pi);
					ctx.translate(-width, 0);
					break;
			}
		}


		function _purge() {
			if (_imginfo) {
				_imginfo.purge();
				_imginfo = null;
			}
			_binstr = _img = _canvas = _blob = null;
			_modified = false;
		}
	}

	return (extensions.image = html5image);
});

/**
 * stub for moxie/runtime/flash/runtime
 * @private
 */
define("moxie/runtime/flash/runtime", [
], function() {
	return {};
});

/**
 * stub for moxie/runtime/silverlight/runtime
 * @private
 */
define("moxie/runtime/silverlight/runtime", [
], function() {
	return {};
});

// included from: src/javascript/runtime/html4/runtime.js

/**
 * runtime.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/*global file:true */

/**
defines constructor for html4 runtime.

@class moxie/runtime/html4/runtime
@private
*/
define("moxie/runtime/html4/runtime", [
	"moxie/core/utils/basic",
	"moxie/core/exceptions",
	"moxie/runtime/runtime",
	"moxie/core/utils/env"
], function(basic, x, runtime, env) {
	
	var type = 'html4', extensions = {};

	function html4runtime(options) {
		var i = this
		, test = runtime.captest
		, true = runtime.captrue
		;

		runtime.call(this, options, type, {
			access_binary: test(window.filereader || window.file && file.getasdataurl),
			access_image_binary: false,
			display_media: test(extensions.image && (env.can('create_canvas') || env.can('use_data_uri_over32kb'))),
			do_cors: false,
			drag_and_drop: false,
			filter_by_extension: test(function() { // if you know how to feature-detect this, please suggest
				return (env.browser === 'chrome' && env.vercomp(env.version, 28, '>=')) || 
					(env.browser === 'ie' && env.vercomp(env.version, 10, '>=')) || 
					(env.browser === 'safari' && env.vercomp(env.version, 7, '>='));
			}()),
			resize_image: function() {
				return extensions.image && i.can('access_binary') && env.can('create_canvas');
			},
			report_upload_progress: false,
			return_response_headers: false,
			return_response_type: function(responsetype) {
				if (responsetype === 'json' && !!window.json) {
					return true;
				} 
				return !!~basic.inarray(responsetype, ['text', 'document', '']);
			},
			return_status_code: function(code) {
				return !basic.arraydiff(code, [200, 404]);
			},
			select_file: function() {
				return env.can('use_fileinput');
			},
			select_multiple: false,
			send_binary_string: false,
			send_custom_headers: false,
			send_multipart: true,
			slice_blob: false,
			stream_upload: function() {
				return i.can('select_file');
			},
			summon_file_dialog: function() { // yeah... some dirty sniffing here...
				return i.can('select_file') && (
					(env.browser === 'firefox' && env.vercomp(env.version, 4, '>=')) ||
					(env.browser === 'opera' && env.vercomp(env.version, 12, '>=')) ||
					(env.browser === 'ie' && env.vercomp(env.version, 10, '>=')) ||
					!!~basic.inarray(env.browser, ['chrome', 'safari'])
				);
			},
			upload_filesize: true,
			use_http_method: function(methods) {
				return !basic.arraydiff(methods, ['get', 'post']);
			}
		});


		basic.extend(this, {
			init : function() {
				this.trigger("init");
			},

			destroy: (function(destroy) { // extend default destroy method
				return function() {
					destroy.call(i);
					destroy = i = null;
				};
			}(this.destroy))
		});

		basic.extend(this.getshim(), extensions);
	}

	runtime.addconstructor(type, html4runtime);

	return extensions;
});

// included from: src/javascript/runtime/html4/file/fileinput.js

/**
 * fileinput.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/html4/file/fileinput
@private
*/
define("moxie/runtime/html4/file/fileinput", [
	"moxie/runtime/html4/runtime",
	"moxie/file/file",
	"moxie/core/utils/basic",
	"moxie/core/utils/dom",
	"moxie/core/utils/events",
	"moxie/core/utils/mime",
	"moxie/core/utils/env"
], function(extensions, file, basic, dom, events, mime, env) {
	
	function fileinput() {
		var _uid, _mimes = [], _options;

		function addinput() {
			var comp = this, i = comp.getruntime(), shimcontainer, browsebutton, currform, form, input, uid;

			uid = basic.guid('uid_');

			shimcontainer = i.getshimcontainer(); // we get new ref everytime to avoid memory leaks in ie

			if (_uid) { // move previous form out of the view
				currform = dom.get(_uid + '_form');
				if (currform) {
					basic.extend(currform.style, { top: '100%' });
				}
			}

			// build form in dom, since innerhtml version not able to submit file for some reason
			form = document.createelement('form');
			form.setattribute('id', uid + '_form');
			form.setattribute('method', 'post');
			form.setattribute('enctype', 'multipart/form-data');
			form.setattribute('encoding', 'multipart/form-data');

			basic.extend(form.style, {
				overflow: 'hidden',
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%'
			});

			input = document.createelement('input');
			input.setattribute('id', uid);
			input.setattribute('type', 'file');
			input.setattribute('name', _options.name || 'filedata');
			input.setattribute('accept', _mimes.join(','));

			basic.extend(input.style, {
				fontsize: '999px',
				opacity: 0
			});

			form.appendchild(input);
			shimcontainer.appendchild(form);

			// prepare file input to be placed underneath the browse_button element
			basic.extend(input.style, {
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%'
			});

			if (env.browser === 'ie' && env.vercomp(env.version, 10, '<')) {
				basic.extend(input.style, {
					filter : "progid:dximagetransform.microsoft.alpha(opacity=0)"
				});
			}

			input.onchange = function() { // there should be only one handler for this
				var file;

				if (!this.value) {
					return;
				}

				if (this.files) { // check if browser is fresh enough
					file = this.files[0];

					// ignore empty files (ie10 for example hangs if you try to send them via xhr)
					if (file.size === 0) {
						form.parentnode.removechild(form);
						return;
					}
				} else {
					file = {
						name: this.value
					};
				}

				file = new file(i.uid, file);

				// clear event handler
				this.onchange = function() {}; 
				addinput.call(comp); 

				comp.files = [file];

				// substitute all ids with file uids (consider file.uid read-only - we cannot do it the other way around)
				input.setattribute('id', file.uid);
				form.setattribute('id', file.uid + '_form');
				
				comp.trigger('change');

				input = form = null;
			};


			// route click event to the input
			if (i.can('summon_file_dialog')) {
				browsebutton = dom.get(_options.browse_button);
				events.removeevent(browsebutton, 'click', comp.uid);
				events.addevent(browsebutton, 'click', function(e) {
					if (input && !input.disabled) { // for some reason ff (up to 8.0.1 so far) lets to click disabled input[type=file]
						input.click();
					}
					e.preventdefault();
				}, comp.uid);
			}

			_uid = uid;

			shimcontainer = currform = browsebutton = null;
		}

		basic.extend(this, {
			init: function(options) {
				var comp = this, i = comp.getruntime(), shimcontainer;

				// figure out accept string
				_options = options;
				_mimes = options.accept.mimes || mime.extlist2mimes(options.accept, i.can('filter_by_extension'));

				shimcontainer = i.getshimcontainer();

				(function() {
					var browsebutton, zindex, top;

					browsebutton = dom.get(options.browse_button);

					// route click event to the input[type=file] element for browsers that support such behavior
					if (i.can('summon_file_dialog')) {
						if (dom.getstyle(browsebutton, 'position') === 'static') {
							browsebutton.style.position = 'relative';
						}

						zindex = parseint(dom.getstyle(browsebutton, 'z-index'), 10) || 1;

						browsebutton.style.zindex = zindex;
						shimcontainer.style.zindex = zindex - 1;
					}

					/* since we have to place input[type=file] on top of the browse_button for some browsers,
					browse_button loses interactivity, so we restore it here */
					top = i.can('summon_file_dialog') ? browsebutton : shimcontainer;

					events.addevent(top, 'mouseover', function() {
						comp.trigger('mouseenter');
					}, comp.uid);

					events.addevent(top, 'mouseout', function() {
						comp.trigger('mouseleave');
					}, comp.uid);

					events.addevent(top, 'mousedown', function() {
						comp.trigger('mousedown');
					}, comp.uid);

					events.addevent(dom.get(options.container), 'mouseup', function() {
						comp.trigger('mouseup');
					}, comp.uid);

					browsebutton = null;
				}());

				addinput.call(this);

				shimcontainer = null;

				// trigger ready event asynchronously
				comp.trigger({
					type: 'ready',
					async: true
				});
			},


			disable: function(state) {
				var input;

				if ((input = dom.get(_uid))) {
					input.disabled = !!state;
				}
			},

			destroy: function() {
				var i = this.getruntime()
				, shim = i.getshim()
				, shimcontainer = i.getshimcontainer()
				;
				
				events.removeallevents(shimcontainer, this.uid);
				events.removeallevents(_options && dom.get(_options.container), this.uid);
				events.removeallevents(_options && dom.get(_options.browse_button), this.uid);
				
				if (shimcontainer) {
					shimcontainer.innerhtml = '';
				}

				shim.removeinstance(this.uid);

				_uid = _mimes = _options = shimcontainer = shim = null;
			}
		});
	}

	return (extensions.fileinput = fileinput);
});

// included from: src/javascript/runtime/html4/file/filereader.js

/**
 * filereader.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/html4/file/filereader
@private
*/
define("moxie/runtime/html4/file/filereader", [
	"moxie/runtime/html4/runtime",
	"moxie/runtime/html5/file/filereader"
], function(extensions, filereader) {
	return (extensions.filereader = filereader);
});

// included from: src/javascript/runtime/html4/xhr/xmlhttprequest.js

/**
 * xmlhttprequest.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/html4/xhr/xmlhttprequest
@private
*/
define("moxie/runtime/html4/xhr/xmlhttprequest", [
	"moxie/runtime/html4/runtime",
	"moxie/core/utils/basic",
	"moxie/core/utils/dom",
	"moxie/core/utils/url",
	"moxie/core/exceptions",
	"moxie/core/utils/events",
	"moxie/file/blob",
	"moxie/xhr/formdata"
], function(extensions, basic, dom, url, x, events, blob, formdata) {
	
	function xmlhttprequest() {
		var _status, _response, _iframe;

		function cleanup(cb) {
			var target = this, uid, form, inputs, i, hasfile = false;

			if (!_iframe) {
				return;
			}

			uid = _iframe.id.replace(/_iframe$/, '');

			form = dom.get(uid + '_form');
			if (form) {
				inputs = form.getelementsbytagname('input');
				i = inputs.length;

				while (i--) {
					switch (inputs[i].getattribute('type')) {
						case 'hidden':
							inputs[i].parentnode.removechild(inputs[i]);
							break;
						case 'file':
							hasfile = true; // flag the case for later
							break;
					}
				}
				inputs = [];

				if (!hasfile) { // we need to keep the form for sake of possible retries
					form.parentnode.removechild(form);
				}
				form = null;
			}

			// without timeout, request is marked as canceled (in console)
			settimeout(function() {
				events.removeevent(_iframe, 'load', target.uid);
				if (_iframe.parentnode) { // #382
					_iframe.parentnode.removechild(_iframe);
				}

				// check if shim container has any other children, if - not, remove it as well
				var shimcontainer = target.getruntime().getshimcontainer();
				if (!shimcontainer.children.length) {
					shimcontainer.parentnode.removechild(shimcontainer);
				}

				shimcontainer = _iframe = null;
				cb();
			}, 1);
		}

		basic.extend(this, {
			send: function(meta, data) {
				var target = this, i = target.getruntime(), uid, form, input, blob;

				_status = _response = null;

				function createiframe() {
					var container = i.getshimcontainer() || document.body
					, temp = document.createelement('div')
					;

					// ie 6 won't be able to set the name using setattribute or iframe.name
					temp.innerhtml = '<iframe id="' + uid + '_iframe" name="' + uid + '_iframe" src="javascript:&quot;&quot;" style="display:none"></iframe>';
					_iframe = temp.firstchild;
					container.appendchild(_iframe);

					/* _iframe.onreadystatechange = function() {
						console.info(_iframe.readystate);
					};*/

					events.addevent(_iframe, 'load', function() { // _iframe.onload doesn't work in ie lte 8
						var el;

						try {
							el = _iframe.contentwindow.document || _iframe.contentdocument || window.frames[_iframe.id].document;

							// try to detect some standard error pages
							if (/^4(0[0-9]|1[0-7]|2[2346])\s/.test(el.title)) { // test if title starts with 4xx http error
								_status = el.title.replace(/^(\d+).*$/, '$1');
							} else {
								_status = 200;
								// get result
								_response = basic.trim(el.body.innerhtml);

								// we need to fire these at least once
								target.trigger({
									type: 'progress',
									loaded: _response.length,
									total: _response.length
								});

								if (blob) { // if we were uploading a file
									target.trigger({
										type: 'uploadprogress',
										loaded: blob.size || 1025,
										total: blob.size || 1025
									});
								}
							}
						} catch (ex) {
							if (url.hassameorigin(meta.url)) {
								// if response is sent with error code, iframe in ie gets redirected to res://ieframe.dll/http_x.htm
								// which obviously results to cross domain error (wtf?)
								_status = 404;
							} else {
								cleanup.call(target, function() {
									target.trigger('error');
								});
								return;
							}
						}	
					
						cleanup.call(target, function() {
							target.trigger('load');
						});
					}, target.uid);
				} // end createiframe

				// prepare data to be sent and convert if required
				if (data instanceof formdata && data.hasblob()) {
					blob = data.getblob();
					uid = blob.uid;
					input = dom.get(uid);
					form = dom.get(uid + '_form');
					if (!form) {
						throw new x.domexception(x.domexception.not_found_err);
					}
				} else {
					uid = basic.guid('uid_');

					form = document.createelement('form');
					form.setattribute('id', uid + '_form');
					form.setattribute('method', meta.method);
					form.setattribute('enctype', 'multipart/form-data');
					form.setattribute('encoding', 'multipart/form-data');

					i.getshimcontainer().appendchild(form);
				}

				// set upload target
				form.setattribute('target', uid + '_iframe');

				if (data instanceof formdata) {
					data.each(function(value, name) {
						if (value instanceof blob) {
							if (input) {
								input.setattribute('name', name);
							}
						} else {
							var hidden = document.createelement('input');

							basic.extend(hidden, {
								type : 'hidden',
								name : name,
								value : value
							});

							// make sure that input[type="file"], if it's there, comes last
							if (input) {
								form.insertbefore(hidden, input);
							} else {
								form.appendchild(hidden);
							}
						}
					});
				}

				// set destination url
				form.setattribute("action", meta.url);

				createiframe();
				form.submit();
				target.trigger('loadstart');
			},

			getstatus: function() {
				return _status;
			},

			getresponse: function(responsetype) {
				if ('json' === responsetype) {
					// strip off <pre>..</pre> tags that might be enclosing the response
					if (basic.typeof(_response) === 'string' && !!window.json) {
						try {
							return json.parse(_response.replace(/^\s*<pre[^>]*>/, '').replace(/<\/pre>\s*$/, ''));
						} catch (ex) {
							return null;
						}
					} 
				} else if ('document' === responsetype) {

				}
				return _response;
			},

			abort: function() {
				var target = this;

				if (_iframe && _iframe.contentwindow) {
					if (_iframe.contentwindow.stop) { // firefox/safari/chrome
						_iframe.contentwindow.stop();
					} else if (_iframe.contentwindow.document.execcommand) { // ie
						_iframe.contentwindow.document.execcommand('stop');
					} else {
						_iframe.src = "about:blank";
					}
				}

				cleanup.call(this, function() {
					// target.dispatchevent('readystatechange');
					target.dispatchevent('abort');
				});
			}
		});
	}

	return (extensions.xmlhttprequest = xmlhttprequest);
});

// included from: src/javascript/runtime/html4/image/image.js

/**
 * image.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/**
@class moxie/runtime/html4/image/image
@private
*/
define("moxie/runtime/html4/image/image", [
	"moxie/runtime/html4/runtime",
	"moxie/runtime/html5/image/image"
], function(extensions, image) {
	return (extensions.image = image);
});

expose(["moxie/core/utils/basic","moxie/core/utils/env","moxie/core/i18n","moxie/core/utils/mime","moxie/core/utils/dom","moxie/core/exceptions","moxie/core/eventtarget","moxie/runtime/runtime","moxie/runtime/runtimeclient","moxie/file/fileinput","moxie/core/utils/encode","moxie/file/blob","moxie/file/file","moxie/file/filedrop","moxie/file/filereader","moxie/core/utils/url","moxie/runtime/runtimetarget","moxie/file/filereadersync","moxie/xhr/formdata","moxie/xhr/xmlhttprequest","moxie/runtime/transporter","moxie/image/image","moxie/core/utils/events"]);
})(this);
/**
 * o.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/*global moxie:true */

/**
globally exposed namespace with the most frequently used public classes and handy methods.

@class o
@static
@private
*/
(function(exports) {
	"use strict";

	var o = {}, inarray = exports.moxie.core.utils.basic.inarray;

	// directly add some public classes
	// (we do it dynamically here, since for custom builds we cannot know beforehand what modules were included)
	(function addalias(ns) {
		var name, itemtype;
		for (name in ns) {
			itemtype = typeof(ns[name]);
			if (itemtype === 'object' && !~inarray(name, ['exceptions', 'env', 'mime'])) {
				addalias(ns[name]);
			} else if (itemtype === 'function') {
				o[name] = ns[name];
			}
		}
	})(exports.moxie);

	// add some manually
	o.env = exports.moxie.core.utils.env;
	o.mime = exports.moxie.core.utils.mime;
	o.exceptions = exports.moxie.core.exceptions;

	// expose globally
	exports.moxie = o;
	if (!exports.o) {
		exports.o = o;
	}
	return o;
})(this);








