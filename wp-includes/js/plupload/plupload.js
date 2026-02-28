/**
 * plupload - multi-runtime file uploader
 * v2.1.9
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
 * plupload.js
 *
 * copyright 2013, moxiecode systems ab
 * released under gpl license.
 *
 * license: http://www.plupload.com/license
 * contributing: http://www.plupload.com/contributing
 */

/**
 * modified for wordpress, silverlight and flash runtimes support was removed.
 * see https://core.trac.wordpress.org/ticket/41755.
 */

/*global moxie:true */

;(function(window, o, undef) {

var delay = window.settimeout
, filefilters = {}
;

// convert plupload features to caps acceptable by moxie
function normalizecaps(settings) {		
	var features = settings.required_features, caps = {};

	function resolve(feature, value, strict) {
		// feature notation is deprecated, use caps (this thing here is required for backward compatibility)
		var map = { 
			chunks: 'slice_blob',
			jpgresize: 'send_binary_string',
			pngresize: 'send_binary_string',
			progress: 'report_upload_progress',
			multi_selection: 'select_multiple',
			dragdrop: 'drag_and_drop',
			drop_element: 'drag_and_drop',
			headers: 'send_custom_headers',
			urlstream_upload: 'send_binary_string',
			cansendbinary: 'send_binary',
			triggerdialog: 'summon_file_dialog'
		};

		if (map[feature]) {
			caps[map[feature]] = value;
		} else if (!strict) {
			caps[feature] = value;
		}
	}

	if (typeof(features) === 'string') {
		plupload.each(features.split(/\s*,\s*/), function(feature) {
			resolve(feature, true);
		});
	} else if (typeof(features) === 'object') {
		plupload.each(features, function(value, feature) {
			resolve(feature, value);
		});
	} else if (features === true) {
		// check settings for required features
		if (settings.chunk_size > 0) {
			caps.slice_blob = true;
		}

		if (settings.resize.enabled || !settings.multipart) {
			caps.send_binary_string = true;
		}
		
		plupload.each(settings, function(value, feature) {
			resolve(feature, !!value, true); // strict check
		});
	}

	// wp: only html runtimes.
	settings.runtimes = 'html5,html4';

	return caps;
}

/** 
 * @module plupload	
 * @static
 */
var plupload = {
	/**
	 * plupload version will be replaced on build.
	 *
	 * @property version
	 * @for plupload
	 * @static
	 * @final
	 */
	version : '2.1.9',

	/**
	 * the state of the queue before it has started and after it has finished
	 *
	 * @property stopped
	 * @static
	 * @final
	 */
	stopped : 1,

	/**
	 * upload process is running
	 *
	 * @property started
	 * @static
	 * @final
	 */
	started : 2,

	/**
	 * file is queued for upload
	 *
	 * @property queued
	 * @static
	 * @final
	 */
	queued : 1,

	/**
	 * file is being uploaded
	 *
	 * @property uploading
	 * @static
	 * @final
	 */
	uploading : 2,

	/**
	 * file has failed to be uploaded
	 *
	 * @property failed
	 * @static
	 * @final
	 */
	failed : 4,

	/**
	 * file has been uploaded successfully
	 *
	 * @property done
	 * @static
	 * @final
	 */
	done : 5,

	// error constants used by the error event

	/**
	 * generic error for example if an exception is thrown inside silverlight.
	 *
	 * @property generic_error
	 * @static
	 * @final
	 */
	generic_error : -100,

	/**
	 * http transport error. for example if the server produces a http status other than 200.
	 *
	 * @property http_error
	 * @static
	 * @final
	 */
	http_error : -200,

	/**
	 * generic i/o error. for example if it wasn't possible to open the file stream on local machine.
	 *
	 * @property io_error
	 * @static
	 * @final
	 */
	io_error : -300,

	/**
	 * @property security_error
	 * @static
	 * @final
	 */
	security_error : -400,

	/**
	 * initialization error. will be triggered if no runtime was initialized.
	 *
	 * @property init_error
	 * @static
	 * @final
	 */
	init_error : -500,

	/**
	 * file size error. if the user selects a file that is too large it will be blocked and an error of this type will be triggered.
	 *
	 * @property file_size_error
	 * @static
	 * @final
	 */
	file_size_error : -600,

	/**
	 * file extension error. if the user selects a file that isn't valid according to the filters setting.
	 *
	 * @property file_extension_error
	 * @static
	 * @final
	 */
	file_extension_error : -601,

	/**
	 * duplicate file error. if prevent_duplicates is set to true and user selects the same file again.
	 *
	 * @property file_duplicate_error
	 * @static
	 * @final
	 */
	file_duplicate_error : -602,

	/**
	 * runtime will try to detect if image is proper one. otherwise will throw this error.
	 *
	 * @property image_format_error
	 * @static
	 * @final
	 */
	image_format_error : -700,

	/**
	 * while working on files runtime may run out of memory and will throw this error.
	 *
	 * @since 2.1.2
	 * @property memory_error
	 * @static
	 * @final
	 */
	memory_error : -701,

	/**
	 * each runtime has an upper limit on a dimension of the image it can handle. if bigger, will throw this error.
	 *
	 * @property image_dimensions_error
	 * @static
	 * @final
	 */
	image_dimensions_error : -702,

	/**
	 * mime type lookup table.
	 *
	 * @property mimetypes
	 * @type object
	 * @final
	 */
	mimetypes : o.mimes,

	/**
	 * in some cases sniffing is the only way around :(
	 */
	ua: o.ua,

	/**
	 * gets the true type of the built-in object (better version of typeof).
	 * @credits angus croll (http://javascriptweblog.wordpress.com/)
	 *
	 * @method typeof
	 * @static
	 * @param {object} o object to check.
	 * @return {string} object [[class]]
	 */
	typeof: o.typeof,

	/**
	 * extends the specified object with another object.
	 *
	 * @method extend
	 * @static
	 * @param {object} target object to extend.
	 * @param {object..} obj multiple objects to extend with.
	 * @return {object} same as target, the extended object.
	 */
	extend : o.extend,

	/**
	 * generates an unique id. this is 99.99% unique since it takes the current time and 5 random numbers.
	 * the only way a user would be able to get the same id is if the two persons at the same exact millisecond manages
	 * to get 5 the same random numbers between 0-65535 it also uses a counter so each call will be guaranteed to be page unique.
	 * it's more probable for the earth to be hit with an asteriod. you can also if you want to be 100% sure set the plupload.guidprefix property
	 * to an user unique key.
	 *
	 * @method guid
	 * @static
	 * @return {string} virtually unique id.
	 */
	guid : o.guid,

	/**
	 * get array of dom elements by their ids.
	 * 
	 * @method get
	 * @param {string} id identifier of the dom element
	 * @return {array}
	*/
	getall : function get(ids) {
		var els = [], el;

		if (plupload.typeof(ids) !== 'array') {
			ids = [ids];
		}

		var i = ids.length;
		while (i--) {
			el = plupload.get(ids[i]);
			if (el) {
				els.push(el);
			}
		}

		return els.length ? els : null;
	},

	/**
	get dom element by id

	@method get
	@param {string} id identifier of the dom element
	@return {node}
	*/
	get: o.get,

	/**
	 * executes the callback function for each item in array/object. if you return false in the
	 * callback it will break the loop.
	 *
	 * @method each
	 * @static
	 * @param {object} obj object to iterate.
	 * @param {function} callback callback function to execute for each item.
	 */
	each : o.each,

	/**
	 * returns the absolute x, y position of an element. the position will be returned in a object with x, y fields.
	 *
	 * @method getpos
	 * @static
	 * @param {element} node html element or element id to get x, y position from.
	 * @param {element} root optional root element to stop calculations at.
	 * @return {object} absolute position of the specified element object with x, y fields.
	 */
	getpos : o.getpos,

	/**
	 * returns the size of the specified node in pixels.
	 *
	 * @method getsize
	 * @static
	 * @param {node} node node to get the size of.
	 * @return {object} object with a w and h property.
	 */
	getsize : o.getsize,

	/**
	 * encodes the specified string.
	 *
	 * @method xmlencode
	 * @static
	 * @param {string} s string to encode.
	 * @return {string} encoded string.
	 */
	xmlencode : function(str) {
		var xmlencodechars = {'<' : 'lt', '>' : 'gt', '&' : 'amp', '"' : 'quot', '\'' : '#39'}, xmlencoderegexp = /[<>&\"\']/g;

		return str ? ('' + str).replace(xmlencoderegexp, function(chr) {
			return xmlencodechars[chr] ? '&' + xmlencodechars[chr] + ';' : chr;
		}) : str;
	},

	/**
	 * forces anything into an array.
	 *
	 * @method toarray
	 * @static
	 * @param {object} obj object with length field.
	 * @return {array} array object containing all items.
	 */
	toarray : o.toarray,

	/**
	 * find an element in array and return its index if present, otherwise return -1.
	 *
	 * @method inarray
	 * @static
	 * @param {mixed} needle element to find
	 * @param {array} array
	 * @return {int} index of the element, or -1 if not found
	 */
	inarray : o.inarray,

	/**
	 * extends the language pack object with new items.
	 *
	 * @method addi18n
	 * @static
	 * @param {object} pack language pack items to add.
	 * @return {object} extended language pack object.
	 */
	addi18n : o.addi18n,

	/**
	 * translates the specified string by checking for the english string in the language pack lookup.
	 *
	 * @method translate
	 * @static
	 * @param {string} str string to look for.
	 * @return {string} translated string or the input string if it wasn't found.
	 */
	translate : o.translate,

	/**
	 * checks if object is empty.
	 *
	 * @method isemptyobj
	 * @static
	 * @param {object} obj object to check.
	 * @return {boolean}
	 */
	isemptyobj : o.isemptyobj,

	/**
	 * checks if specified dom element has specified class.
	 *
	 * @method hasclass
	 * @static
	 * @param {object} obj dom element like object to add handler to.
	 * @param {string} name class name
	 */
	hasclass : o.hasclass,

	/**
	 * adds specified classname to specified dom element.
	 *
	 * @method addclass
	 * @static
	 * @param {object} obj dom element like object to add handler to.
	 * @param {string} name class name
	 */
	addclass : o.addclass,

	/**
	 * removes specified classname from specified dom element.
	 *
	 * @method removeclass
	 * @static
	 * @param {object} obj dom element like object to add handler to.
	 * @param {string} name class name
	 */
	removeclass : o.removeclass,

	/**
	 * returns a given computed style of a dom element.
	 *
	 * @method getstyle
	 * @static
	 * @param {object} obj dom element like object.
	 * @param {string} name style you want to get from the dom element
	 */
	getstyle : o.getstyle,

	/**
	 * adds an event handler to the specified object and store reference to the handler
	 * in objects internal plupload registry (@see removeevent).
	 *
	 * @method addevent
	 * @static
	 * @param {object} obj dom element like object to add handler to.
	 * @param {string} name name to add event listener to.
	 * @param {function} callback function to call when event occurs.
	 * @param {string} (optional) key that might be used to add specifity to the event record.
	 */
	addevent : o.addevent,

	/**
	 * remove event handler from the specified object. if third argument (callback)
	 * is not specified remove all events with the specified name.
	 *
	 * @method removeevent
	 * @static
	 * @param {object} obj dom element to remove event listener(s) from.
	 * @param {string} name name of event listener to remove.
	 * @param {function|string} (optional) might be a callback or unique key to match.
	 */
	removeevent: o.removeevent,

	/**
	 * remove all kind of events from the specified object
	 *
	 * @method removeallevents
	 * @static
	 * @param {object} obj dom element to remove event listeners from.
	 * @param {string} (optional) unique key to match, when removing events.
	 */
	removeallevents: o.removeallevents,

	/**
	 * cleans the specified name from national characters (diacritics). the result will be a name with only a-z, 0-9 and _.
	 *
	 * @method cleanname
	 * @static
	 * @param {string} s string to clean up.
	 * @return {string} cleaned string.
	 */
	cleanname : function(name) {
		var i, lookup;

		// replace diacritics
		lookup = [
			/[\300-\306]/g, 'a', /[\340-\346]/g, 'a',
			/\307/g, 'c', /\347/g, 'c',
			/[\310-\313]/g, 'e', /[\350-\353]/g, 'e',
			/[\314-\317]/g, 'i', /[\354-\357]/g, 'i',
			/\321/g, 'n', /\361/g, 'n',
			/[\322-\330]/g, 'o', /[\362-\370]/g, 'o',
			/[\331-\334]/g, 'u', /[\371-\374]/g, 'u'
		];

		for (i = 0; i < lookup.length; i += 2) {
			name = name.replace(lookup[i], lookup[i + 1]);
		}

		// replace whitespace
		name = name.replace(/\s+/g, '_');

		// remove anything else
		name = name.replace(/[^a-z0-9_\-\.]+/gi, '');

		return name;
	},

	/**
	 * builds a full url out of a base url and an object with items to append as query string items.
	 *
	 * @method buildurl
	 * @static
	 * @param {string} url base url to append query string items to.
	 * @param {object} items name/value object to serialize as a querystring.
	 * @return {string} string with url + serialized query string items.
	 */
	buildurl : function(url, items) {
		var query = '';

		plupload.each(items, function(value, name) {
			query += (query ? '&' : '') + encodeuricomponent(name) + '=' + encodeuricomponent(value);
		});

		if (query) {
			url += (url.indexof('?') > 0 ? '&' : '?') + query;
		}

		return url;
	},

	/**
	 * formats the specified number as a size string for example 1024 becomes 1 kb.
	 *
	 * @method formatsize
	 * @static
	 * @param {number} size size to format as string.
	 * @return {string} formatted size string.
	 */
	formatsize : function(size) {

		if (size === undef || /\d/.test(size)) {
			return plupload.translate('n/a');
		}

		function round(num, precision) {
			return math.round(num * math.pow(10, precision)) / math.pow(10, precision);
		}

		var boundary = math.pow(1024, 4);

		// tb
		if (size > boundary) {
			return round(size / boundary, 1) + " " + plupload.translate('tb');
		}

		// gb
		if (size > (boundary/=1024)) {
			return round(size / boundary, 1) + " " + plupload.translate('gb');
		}

		// mb
		if (size > (boundary/=1024)) {
			return round(size / boundary, 1) + " " + plupload.translate('mb');
		}

		// kb
		if (size > 1024) {
			return math.round(size / 1024) + " " + plupload.translate('kb');
		}

		return size + " " + plupload.translate('b');
	},


	/**
	 * parses the specified size string into a byte value. for example 10kb becomes 10240.
	 *
	 * @method parsesize
	 * @static
	 * @param {string|number} size string to parse or number to just pass through.
	 * @return {number} size in bytes.
	 */
	parsesize : o.parsesizestr,


	/**
	 * a way to predict what runtime will be choosen in the current environment with the
	 * specified settings.
	 *
	 * @method predictruntime
	 * @static
	 * @param {object|string} config plupload settings to check
	 * @param {string} [runtimes] comma-separated list of runtimes to check against
	 * @return {string} type of compatible runtime
	 */
	predictruntime : function(config, runtimes) {
		var up, runtime;

		up = new plupload.uploader(config);
		runtime = o.runtime.thatcan(up.getoption().required_features, runtimes || config.runtimes);
		up.destroy();
		return runtime;
	},

	/**
	 * registers a filter that will be executed for each file added to the queue.
	 * if callback returns false, file will not be added.
	 *
	 * callback receives two arguments: a value for the filter as it was specified in settings.filters
	 * and a file to be filtered. callback is executed in the context of uploader instance.
	 *
	 * @method addfilefilter
	 * @static
	 * @param {string} name name of the filter by which it can be referenced in settings.filters
	 * @param {string} cb callback - the actual routine that every added file must pass
	 */
	addfilefilter: function(name, cb) {
		filefilters[name] = cb;
	}
};


plupload.addfilefilter('mime_types', function(filters, file, cb) {
	if (filters.length && !filters.regexp.test(file.name)) {
		this.trigger('error', {
			code : plupload.file_extension_error,
			message : plupload.translate('file extension error.'),
			file : file
		});
		cb(false);
	} else {
		cb(true);
	}
});


plupload.addfilefilter('max_file_size', function(maxsize, file, cb) {
	var undef;

	maxsize = plupload.parsesize(maxsize);

	// invalid file size
	if (file.size !== undef && maxsize && file.size > maxsize) {
		this.trigger('error', {
			code : plupload.file_size_error,
			message : plupload.translate('file size error.'),
			file : file
		});
		cb(false);
	} else {
		cb(true);
	}
});


plupload.addfilefilter('prevent_duplicates', function(value, file, cb) {
	if (value) {
		var ii = this.files.length;
		while (ii--) {
			// compare by name and size (size might be 0 or undefined, but still equivalent for both)
			if (file.name === this.files[ii].name && file.size === this.files[ii].size) {
				this.trigger('error', {
					code : plupload.file_duplicate_error,
					message : plupload.translate('duplicate file error.'),
					file : file
				});
				cb(false);
				return;
			}
		}
	}
	cb(true);
});


/**
@class uploader
@constructor

@param {object} settings for detailed information about each option check documentation.
	@param {string|domelement} settings.browse_button id of the dom element or dom element itself to use as file dialog trigger.
	@param {string} settings.url url of the server-side upload handler.
	@param {number|string} [settings.chunk_size=0] chunk size in bytes to slice the file into. shorcuts with b, kb, mb, gb, tb suffixes also supported. `e.g. 204800 or "204800b" or "200kb"`. by default - disabled.
	@param {boolean} [settings.send_chunk_number=true] whether to send chunks and chunk numbers, or total and offset bytes.
	@param {string|domelement} [settings.container] id of the dom element or dom element itself that will be used to wrap uploader structures. defaults to immediate parent of the `browse_button` element.
	@param {string|domelement} [settings.drop_element] id of the dom element or dom element itself to use as a drop zone for drag-n-drop.
	@param {string} [settings.file_data_name="file"] name for the file field in multipart formated message.
	@param {object} [settings.filters={}] set of file type filters.
		@param {array} [settings.filters.mime_types=[]] list of file types to accept, each one defined by title and list of extensions. `e.g. {title : "image files", extensions : "jpg,jpeg,gif,png"}`. dispatches `plupload.file_extension_error`
		@param {string|number} [settings.filters.max_file_size=0] maximum file size that the user can pick, in bytes. optionally supports b, kb, mb, gb, tb suffixes. `e.g. "10mb" or "1gb"`. by default - not set. dispatches `plupload.file_size_error`.
		@param {boolean} [settings.filters.prevent_duplicates=false] do not let duplicates into the queue. dispatches `plupload.file_duplicate_error`.
	@param {string} [settings.flash_swf_url] url of the flash swf. (not used in wordpress)
	@param {object} [settings.headers] custom headers to send with the upload. hash of name/value pairs.
	@param {number} [settings.max_retries=0] how many times to retry the chunk or file, before triggering error event.
	@param {boolean} [settings.multipart=true] whether to send file and additional parameters as multipart formated message.
	@param {object} [settings.multipart_params] hash of key/value pairs to send with every file upload.
	@param {boolean} [settings.multi_selection=true] enable ability to select multiple files at once in file dialog.
	@param {string|object} [settings.required_features] either comma-separated list or hash of required features that chosen runtime should absolutely possess.
	@param {object} [settings.resize] enable resizng of images on client-side. applies to `image/jpeg` and `image/png` only. `e.g. {width : 200, height : 200, quality : 90, crop: true}`
		@param {number} [settings.resize.width] if image is bigger, it will be resized.
		@param {number} [settings.resize.height] if image is bigger, it will be resized.
		@param {number} [settings.resize.quality=90] compression quality for jpegs (1-100).
		@param {boolean} [settings.resize.crop=false] whether to crop images to exact dimensions. by default they will be resized proportionally.
	@param {string} [settings.runtimes="html5,html4"] comma separated list of runtimes, that plupload will try in turn, moving to the next if previous fails.
	@param {string} [settings.silverlight_xap_url] url of the silverlight xap. (not used in wordpress)
	@param {boolean} [settings.unique_names=false] if true will generate unique filenames for uploaded files.
	@param {boolean} [settings.send_file_name=true] whether to send file name as additional argument - 'name' (required for chunked uploads and some other cases where file name cannot be sent via normal ways).
*/
plupload.uploader = function(options) {
	/**
	fires when the current runtime has been initialized.
	
	@event init
	@param {plupload.uploader} uploader uploader instance sending the event.
	 */

	/**
	fires after the init event incase you need to perform actions there.
	
	@event postinit
	@param {plupload.uploader} uploader uploader instance sending the event.
	 */

	/**
	fires when the option is changed in via uploader.setoption().
	
	@event optionchanged
	@since 2.1
	@param {plupload.uploader} uploader uploader instance sending the event.
	@param {string} name name of the option that was changed
	@param {mixed} value new value for the specified option
	@param {mixed} oldvalue previous value of the option
	 */

	/**
	fires when the silverlight/flash or other shim needs to move.
	
	@event refresh
	@param {plupload.uploader} uploader uploader instance sending the event.
	 */

	/**
	fires when the overall state is being changed for the upload queue.
	
	@event statechanged
	@param {plupload.uploader} uploader uploader instance sending the event.
	 */

	/**
	fires when browse_button is clicked and browse dialog shows.
	
	@event browse
	@since 2.1.2
	@param {plupload.uploader} uploader uploader instance sending the event.
	 */	

	/**
	fires for every filtered file before it is added to the queue.
	
	@event filefiltered
	@since 2.1
	@param {plupload.uploader} uploader uploader instance sending the event.
	@param {plupload.file} file another file that has to be added to the queue.
	 */

	/**
	fires when the file queue is changed. in other words when files are added/removed to the files array of the uploader instance.
	
	@event queuechanged
	@param {plupload.uploader} uploader uploader instance sending the event.
	 */ 

	/**
	fires after files were filtered and added to the queue.
	
	@event filesadded
	@param {plupload.uploader} uploader uploader instance sending the event.
	@param {array} files array of file objects that were added to queue by the user.
	 */

	/**
	fires when file is removed from the queue.
	
	@event filesremoved
	@param {plupload.uploader} uploader uploader instance sending the event.
	@param {array} files array of files that got removed.
	 */

	/**
	fires just before a file is uploaded. can be used to cancel the upload for the specified file
	by returning false from the handler.
	
	@event beforeupload
	@param {plupload.uploader} uploader uploader instance sending the event.
	@param {plupload.file} file file to be uploaded.
	 */

	/**
	fires when a file is to be uploaded by the runtime.
	
	@event uploadfile
	@param {plupload.uploader} uploader uploader instance sending the event.
	@param {plupload.file} file file to be uploaded.
	 */

	/**
	fires while a file is being uploaded. use this event to update the current file upload progress.
	
	@event uploadprogress
	@param {plupload.uploader} uploader uploader instance sending the event.
	@param {plupload.file} file file that is currently being uploaded.
	 */	

	/**
	fires when file chunk is uploaded.
	
	@event chunkuploaded
	@param {plupload.uploader} uploader uploader instance sending the event.
	@param {plupload.file} file file that the chunk was uploaded for.
	@param {object} result object with response properties.
		@param {number} result.offset the amount of bytes the server has received so far, including this chunk.
		@param {number} result.total the size of the file.
		@param {string} result.response the response body sent by the server.
		@param {number} result.status the http status code sent by the server.
		@param {string} result.responseheaders all the response headers as a single string.
	 */

	/**
	fires when a file is successfully uploaded.
	
	@event fileuploaded
	@param {plupload.uploader} uploader uploader instance sending the event.
	@param {plupload.file} file file that was uploaded.
	@param {object} result object with response properties.
		@param {string} result.response the response body sent by the server.
		@param {number} result.status the http status code sent by the server.
		@param {string} result.responseheaders all the response headers as a single string.
	 */

	/**
	fires when all files in a queue are uploaded.
	
	@event uploadcomplete
	@param {plupload.uploader} uploader uploader instance sending the event.
	@param {array} files array of file objects that was added to queue/selected by the user.
	 */

	/**
	fires when a error occurs.
	
	@event error
	@param {plupload.uploader} uploader uploader instance sending the event.
	@param {object} error contains code, message and sometimes file and other details.
		@param {number} error.code the plupload error code.
		@param {string} error.message description of the error (uses i18n).
	 */

	/**
	fires when destroy method is called.
	
	@event destroy
	@param {plupload.uploader} uploader uploader instance sending the event.
	 */
	var uid = plupload.guid()
	, settings
	, files = []
	, preferred_caps = {}
	, fileinputs = []
	, filedrops = []
	, starttime
	, total
	, disabled = false
	, xhr
	;


	// private methods
	function uploadnext() {
		var file, count = 0, i;

		if (this.state == plupload.started) {
			// find first queued file
			for (i = 0; i < files.length; i++) {
				if (!file && files[i].status == plupload.queued) {
					file = files[i];
					if (this.trigger("beforeupload", file)) {
						file.status = plupload.uploading;
						this.trigger("uploadfile", file);
					}
				} else {
					count++;
				}
			}

			// all files are done or failed
			if (count == files.length) {
				if (this.state !== plupload.stopped) {
					this.state = plupload.stopped;
					this.trigger("statechanged");
				}
				this.trigger("uploadcomplete", files);
			}
		}
	}


	function calcfile(file) {
		file.percent = file.size > 0 ? math.ceil(file.loaded / file.size * 100) : 100;
		calc();
	}


	function calc() {
		var i, file;

		// reset stats
		total.reset();

		// check status, size, loaded etc on all files
		for (i = 0; i < files.length; i++) {
			file = files[i];

			if (file.size !== undef) {
				// we calculate totals based on original file size
				total.size += file.origsize;

				// since we cannot predict file size after resize, we do opposite and
				// interpolate loaded amount to match magnitude of total
				total.loaded += file.loaded * file.origsize / file.size;
			} else {
				total.size = undef;
			}

			if (file.status == plupload.done) {
				total.uploaded++;
			} else if (file.status == plupload.failed) {
				total.failed++;
			} else {
				total.queued++;
			}
		}

		// if we couldn't calculate a total file size then use the number of files to calc percent
		if (total.size === undef) {
			total.percent = files.length > 0 ? math.ceil(total.uploaded / files.length * 100) : 0;
		} else {
			total.bytespersec = math.ceil(total.loaded / ((+new date() - starttime || 1) / 1000.0));
			total.percent = total.size > 0 ? math.ceil(total.loaded / total.size * 100) : 0;
		}
	}


	function getruid() {
		var ctrl = fileinputs[0] || filedrops[0];
		if (ctrl) {
			return ctrl.getruntime().uid;
		}
		return false;
	}


	function runtimecan(file, cap) {
		if (file.ruid) {
			var info = o.runtime.getinfo(file.ruid);
			if (info) {
				return info.can(cap);
			}
		}
		return false;
	}


	function bindeventlisteners() {
		this.bind('filesadded filesremoved', function(up) {
			up.trigger('queuechanged');
			up.refresh();
		});

		this.bind('cancelupload', oncancelupload);
		
		this.bind('beforeupload', onbeforeupload);

		this.bind('uploadfile', onuploadfile);

		this.bind('uploadprogress', onuploadprogress);

		this.bind('statechanged', onstatechanged);

		this.bind('queuechanged', calc);

		this.bind('error', onerror);

		this.bind('fileuploaded', onfileuploaded);

		this.bind('destroy', ondestroy);
	}


	function initcontrols(settings, cb) {
		var self = this, inited = 0, queue = [];

		// common settings
		var options = {
			runtime_order: settings.runtimes,
			required_caps: settings.required_features,
			preferred_caps: preferred_caps
		};

		// add runtime specific options if any
		plupload.each(settings.runtimes.split(/\s*,\s*/), function(runtime) {
			if (settings[runtime]) {
				options[runtime] = settings[runtime];
			}
		});

		// initialize file pickers - there can be many
		if (settings.browse_button) {
			plupload.each(settings.browse_button, function(el) {
				queue.push(function(cb) {
					var fileinput = new o.fileinput(plupload.extend({}, options, {
						accept: settings.filters.mime_types,
						name: settings.file_data_name,
						multiple: settings.multi_selection,
						container: settings.container,
						browse_button: el
					}));

					fileinput.onready = function() {
						var info = o.runtime.getinfo(this.ruid);

						// for backward compatibility
						o.extend(self.features, {
							chunks: info.can('slice_blob'),
							multipart: info.can('send_multipart'),
							multi_selection: info.can('select_multiple')
						});

						inited++;
						fileinputs.push(this);
						cb();
					};

					fileinput.onchange = function() {
						self.addfile(this.files);
					};

					fileinput.bind('mouseenter mouseleave mousedown mouseup', function(e) {
						if (!disabled) {
							if (settings.browse_button_hover) {
								if ('mouseenter' === e.type) {
									o.addclass(el, settings.browse_button_hover);
								} else if ('mouseleave' === e.type) {
									o.removeclass(el, settings.browse_button_hover);
								}
							}

							if (settings.browse_button_active) {
								if ('mousedown' === e.type) {
									o.addclass(el, settings.browse_button_active);
								} else if ('mouseup' === e.type) {
									o.removeclass(el, settings.browse_button_active);
								}
							}
						}
					});

					fileinput.bind('mousedown', function() {
						self.trigger('browse');
					});

					fileinput.bind('error runtimeerror', function() {
						fileinput = null;
						cb();
					});

					fileinput.init();
				});
			});
		}

		// initialize drop zones
		if (settings.drop_element) {
			plupload.each(settings.drop_element, function(el) {
				queue.push(function(cb) {
					var filedrop = new o.filedrop(plupload.extend({}, options, {
						drop_zone: el
					}));

					filedrop.onready = function() {
						var info = o.runtime.getinfo(this.ruid);

						// for backward compatibility
						o.extend(self.features, {
							chunks: info.can('slice_blob'),
							multipart: info.can('send_multipart'),
							dragdrop: info.can('drag_and_drop')
						});

						inited++;
						filedrops.push(this);
						cb();
					};

					filedrop.ondrop = function() {
						self.addfile(this.files);
					};

					filedrop.bind('error runtimeerror', function() {
						filedrop = null;
						cb();
					});

					filedrop.init();
				});
			});
		}


		o.inseries(queue, function() {
			if (typeof(cb) === 'function') {
				cb(inited);
			}
		});
	}


	function resizeimage(blob, params, cb) {
		var img = new o.image();

		try {
			img.onload = function() {
				// no manipulation required if...
				if (params.width > this.width &&
					params.height > this.height &&
					params.quality === undef &&
					params.preserve_headers &&
					!params.crop
				) {
					this.destroy();
					return cb(blob);
				}
				// otherwise downsize
				img.downsize(params.width, params.height, params.crop, params.preserve_headers);
			};

			img.onresize = function() {
				cb(this.getasblob(blob.type, params.quality));
				this.destroy();
			};

			img.onerror = function() {
				cb(blob);
			};

			img.load(blob);
		} catch(ex) {
			cb(blob);
		}
	}


	function setoption(option, value, init) {
		var self = this, reinitrequired = false;

		function _setoption(option, value, init) {
			var oldvalue = settings[option];

			switch (option) {
				case 'max_file_size':
					if (option === 'max_file_size') {
						settings.max_file_size = settings.filters.max_file_size = value;
					}
					break;

				case 'chunk_size':
					if (value = plupload.parsesize(value)) {
						settings[option] = value;
						settings.send_file_name = true;
					}
					break;

				case 'multipart':
					settings[option] = value;
					if (!value) {
						settings.send_file_name = true;
					}
					break;

				case 'unique_names':
					settings[option] = value;
					if (value) {
						settings.send_file_name = true;
					}
					break;

				case 'filters':
					// for sake of backward compatibility
					if (plupload.typeof(value) === 'array') {
						value = {
							mime_types: value
						};
					}

					if (init) {
						plupload.extend(settings.filters, value);
					} else {
						settings.filters = value;
					}

					// if file format filters are being updated, regenerate the matching expressions
					if (value.mime_types) {
						settings.filters.mime_types.regexp = (function(filters) {
							var extensionsregexp = [];

							plupload.each(filters, function(filter) {
								plupload.each(filter.extensions.split(/,/), function(ext) {
									if (/^\s*\*\s*$/.test(ext)) {
										extensionsregexp.push('\\.*');
									} else {
										extensionsregexp.push('\\.' + ext.replace(new regexp('[' + ('/^$.*+?|()[]{}\\'.replace(/./g, '\\$&')) + ']', 'g'), '\\$&'));
									}
								});
							});

							return new regexp('(' + extensionsregexp.join('|') + ')$', 'i');
						}(settings.filters.mime_types));
					}
					break;
	
				case 'resize':
					if (init) {
						plupload.extend(settings.resize, value, {
							enabled: true
						});
					} else {
						settings.resize = value;
					}
					break;

				case 'prevent_duplicates':
					settings.prevent_duplicates = settings.filters.prevent_duplicates = !!value;
					break;

				// options that require reinitialisation
				case 'container':
				case 'browse_button':
				case 'drop_element':
						value = 'container' === option
							? plupload.get(value)
							: plupload.getall(value)
							; 
				
				case 'runtimes':
				case 'multi_selection':
					settings[option] = value;
					if (!init) {
						reinitrequired = true;
					}
					break;

				default:
					settings[option] = value;
			}

			if (!init) {
				self.trigger('optionchanged', option, value, oldvalue);
			}
		}

		if (typeof(option) === 'object') {
			plupload.each(option, function(value, option) {
				_setoption(option, value, init);
			});
		} else {
			_setoption(option, value, init);
		}

		if (init) {
			// normalize the list of required capabilities
			settings.required_features = normalizecaps(plupload.extend({}, settings));

			// come up with the list of capabilities that can affect default mode in a multi-mode runtimes
			preferred_caps = normalizecaps(plupload.extend({}, settings, {
				required_features: true
			}));
		} else if (reinitrequired) {
			self.trigger('destroy');
			
			initcontrols.call(self, settings, function(inited) {
				if (inited) {
					self.runtime = o.runtime.getinfo(getruid()).type;
					self.trigger('init', { runtime: self.runtime });
					self.trigger('postinit');
				} else {
					self.trigger('error', {
						code : plupload.init_error,
						message : plupload.translate('init error.')
					});
				}
			});
		}
	}


	// internal event handlers
	function onbeforeupload(up, file) {
		// generate unique target filenames
		if (up.settings.unique_names) {
			var matches = file.name.match(/\.([^.]+)$/), ext = "part";
			if (matches) {
				ext = matches[1];
			}
			file.target_name = file.id + '.' + ext;
		}
	}


	function onuploadfile(up, file) {
		var url = up.settings.url
		, chunksize = up.settings.chunk_size
		, retries = up.settings.max_retries
		, features = up.features
		, offset = 0
		, blob
		;

		// make sure we start at a predictable offset
		if (file.loaded) {
			offset = file.loaded = chunksize ? chunksize * math.floor(file.loaded / chunksize) : 0;
		}

		function handleerror() {
			if (retries-- > 0) {
				delay(uploadnextchunk, 1000);
			} else {
				file.loaded = offset; // reset all progress

				up.trigger('error', {
					code : plupload.http_error,
					message : plupload.translate('http error.'),
					file : file,
					response : xhr.responsetext,
					status : xhr.status,
					responseheaders: xhr.getallresponseheaders()
				});
			}
		}

		function uploadnextchunk() {
			var chunkblob, formdata, args = {}, curchunksize;

			// make sure that file wasn't cancelled and upload is not stopped in general
			if (file.status !== plupload.uploading || up.state === plupload.stopped) {
				return;
			}

			// send additional 'name' parameter only if required
			if (up.settings.send_file_name) {
				args.name = file.target_name || file.name;
			}

			if (chunksize && features.chunks && blob.size > chunksize) { // blob will be of type string if it was loaded in memory 
				curchunksize = math.min(chunksize, blob.size - offset);
				chunkblob = blob.slice(offset, offset + curchunksize);
			} else {
				curchunksize = blob.size;
				chunkblob = blob;
			}

			// if chunking is enabled add corresponding args, no matter if file is bigger than chunk or smaller
			if (chunksize && features.chunks) {
				// setup query string arguments
				if (up.settings.send_chunk_number) {
					args.chunk = math.ceil(offset / chunksize);
					args.chunks = math.ceil(blob.size / chunksize);
				} else { // keep support for experimental chunk format, just in case
					args.offset = offset;
					args.total = blob.size;
				}
			}

			xhr = new o.xmlhttprequest();

			// do we have upload progress support
			if (xhr.upload) {
				xhr.upload.onprogress = function(e) {
					file.loaded = math.min(file.size, offset + e.loaded);
					up.trigger('uploadprogress', file);
				};
			}

			xhr.onload = function() {
				// check if upload made itself through
				if (xhr.status >= 400) {
					handleerror();
					return;
				}

				retries = up.settings.max_retries; // reset the counter

				// handle chunk response
				if (curchunksize < blob.size) {
					chunkblob.destroy();

					offset += curchunksize;
					file.loaded = math.min(offset, blob.size);

					up.trigger('chunkuploaded', file, {
						offset : file.loaded,
						total : blob.size,
						response : xhr.responsetext,
						status : xhr.status,
						responseheaders: xhr.getallresponseheaders()
					});

					// stock android browser doesn't fire upload progress events, but in chunking mode we can fake them
					if (o.env.browser === 'android browser') {
						// doesn't harm in general, but is not required anywhere else
						up.trigger('uploadprogress', file);
					} 
				} else {
					file.loaded = file.size;
				}

				chunkblob = formdata = null; // free memory

				// check if file is uploaded
				if (!offset || offset >= blob.size) {
					// if file was modified, destory the copy
					if (file.size != file.origsize) {
						blob.destroy();
						blob = null;
					}

					up.trigger('uploadprogress', file);

					file.status = plupload.done;

					up.trigger('fileuploaded', file, {
						response : xhr.responsetext,
						status : xhr.status,
						responseheaders: xhr.getallresponseheaders()
					});
				} else {
					// still chunks left
					delay(uploadnextchunk, 1); // run detached, otherwise event handlers interfere
				}
			};

			xhr.onerror = function() {
				handleerror();
			};

			xhr.onloadend = function() {
				this.destroy();
				xhr = null;
			};

			// build multipart request
			if (up.settings.multipart && features.multipart) {
				xhr.open("post", url, true);

				// set custom headers
				plupload.each(up.settings.headers, function(value, name) {
					xhr.setrequestheader(name, value);
				});

				formdata = new o.formdata();

				// add multipart params
				plupload.each(plupload.extend(args, up.settings.multipart_params), function(value, name) {
					formdata.append(name, value);
				});

				// add file and send it
				formdata.append(up.settings.file_data_name, chunkblob);
				xhr.send(formdata, {
					runtime_order: up.settings.runtimes,
					required_caps: up.settings.required_features,
					preferred_caps: preferred_caps
				});
			} else {
				// if no multipart, send as binary stream
				url = plupload.buildurl(up.settings.url, plupload.extend(args, up.settings.multipart_params));

				xhr.open("post", url, true);

				xhr.setrequestheader('content-type', 'application/octet-stream'); // binary stream header

				// set custom headers
				plupload.each(up.settings.headers, function(value, name) {
					xhr.setrequestheader(name, value);
				});

				xhr.send(chunkblob, {
					runtime_order: up.settings.runtimes,
					required_caps: up.settings.required_features,
					preferred_caps: preferred_caps
				});
			}
		}

		blob = file.getsource();

		// start uploading chunks
		if (up.settings.resize.enabled && runtimecan(blob, 'send_binary_string') && !!~o.inarray(blob.type, ['image/jpeg', 'image/png'])) {
			// resize if required
			resizeimage.call(this, blob, up.settings.resize, function(resizedblob) {
				blob = resizedblob;
				file.size = resizedblob.size;
				uploadnextchunk();
			});
		} else {
			uploadnextchunk();
		}
	}


	function onuploadprogress(up, file) {
		calcfile(file);
	}


	function onstatechanged(up) {
		if (up.state == plupload.started) {
			// get start time to calculate bps
			starttime = (+new date());
		} else if (up.state == plupload.stopped) {
			// reset currently uploading files
			for (var i = up.files.length - 1; i >= 0; i--) {
				if (up.files[i].status == plupload.uploading) {
					up.files[i].status = plupload.queued;
					calc();
				}
			}
		}
	}


	function oncancelupload() {
		if (xhr) {
			xhr.abort();
		}
	}


	function onfileuploaded(up) {
		calc();

		// upload next file but detach it from the error event
		// since other custom listeners might want to stop the queue
		delay(function() {
			uploadnext.call(up);
		}, 1);
	}


	function onerror(up, err) {
		if (err.code === plupload.init_error) {
			up.destroy();
		}
		// set failed status if an error occured on a file
		else if (err.code === plupload.http_error) {
			err.file.status = plupload.failed;
			calcfile(err.file);

			// upload next file but detach it from the error event
			// since other custom listeners might want to stop the queue
			if (up.state == plupload.started) { // upload in progress
				up.trigger('cancelupload');
				delay(function() {
					uploadnext.call(up);
				}, 1);
			}
		}
	}


	function ondestroy(up) {
		up.stop();

		// purge the queue
		plupload.each(files, function(file) {
			file.destroy();
		});
		files = [];

		if (fileinputs.length) {
			plupload.each(fileinputs, function(fileinput) {
				fileinput.destroy();
			});
			fileinputs = [];
		}

		if (filedrops.length) {
			plupload.each(filedrops, function(filedrop) {
				filedrop.destroy();
			});
			filedrops = [];
		}

		preferred_caps = {};
		disabled = false;
		starttime = xhr = null;
		total.reset();
	}


	// default settings
	settings = {
		runtimes: o.runtime.order,
		max_retries: 0,
		chunk_size: 0,
		multipart: true,
		multi_selection: true,
		file_data_name: 'file',
		filters: {
			mime_types: [],
			prevent_duplicates: false,
			max_file_size: 0
		},
		resize: {
			enabled: false,
			preserve_headers: true,
			crop: false
		},
		send_file_name: true,
		send_chunk_number: true
	};

	
	setoption.call(this, options, null, true);

	// inital total state
	total = new plupload.queueprogress(); 

	// add public methods
	plupload.extend(this, {

		/**
		 * unique id for the uploader instance.
		 *
		 * @property id
		 * @type string
		 */
		id : uid,
		uid : uid, // moxie uses this to differentiate between event targets

		/**
		 * current state of the total uploading progress. this one can either be plupload.started or plupload.stopped.
		 * these states are controlled by the stop/start methods. the default value is stopped.
		 *
		 * @property state
		 * @type number
		 */
		state : plupload.stopped,

		/**
		 * map of features that are available for the uploader runtime. features will be filled
		 * before the init event is called, these features can then be used to alter the ui for the end user.
		 * some of the current features that might be in this map is: dragdrop, chunks, jpgresize, pngresize.
		 *
		 * @property features
		 * @type object
		 */
		features : {},

		/**
		 * current runtime name.
		 *
		 * @property runtime
		 * @type string
		 */
		runtime : null,

		/**
		 * current upload queue, an array of file instances.
		 *
		 * @property files
		 * @type array
		 * @see plupload.file
		 */
		files : files,

		/**
		 * object with name/value settings.
		 *
		 * @property settings
		 * @type object
		 */
		settings : settings,

		/**
		 * total progess information. how many files has been uploaded, total percent etc.
		 *
		 * @property total
		 * @type plupload.queueprogress
		 */
		total : total,


		/**
		 * initializes the uploader instance and adds internal event listeners.
		 *
		 * @method init
		 */
		init : function() {
			var self = this, opt, preinitopt, err;
			
			preinitopt = self.getoption('preinit');
			if (typeof(preinitopt) == "function") {
				preinitopt(self);
			} else {
				plupload.each(preinitopt, function(func, name) {
					self.bind(name, func);
				});
			}

			bindeventlisteners.call(self);

			// check for required options
			plupload.each(['container', 'browse_button', 'drop_element'], function(el) {
				if (self.getoption(el) === null) {
					err = {
						code : plupload.init_error,
						message : plupload.translate("'%' specified, but cannot be found.")
					}
					return false;
				}
			});

			if (err) {
				return self.trigger('error', err);
			}


			if (!settings.browse_button && !settings.drop_element) {
				return self.trigger('error', {
					code : plupload.init_error,
					message : plupload.translate("you must specify either 'browse_button' or 'drop_element'.")
				});
			}


			initcontrols.call(self, settings, function(inited) {
				var initopt = self.getoption('init');
				if (typeof(initopt) == "function") {
					initopt(self);
				} else {
					plupload.each(initopt, function(func, name) {
						self.bind(name, func);
					});
				}

				if (inited) {
					self.runtime = o.runtime.getinfo(getruid()).type;
					self.trigger('init', { runtime: self.runtime });
					self.trigger('postinit');
				} else {
					self.trigger('error', {
						code : plupload.init_error,
						message : plupload.translate('init error.')
					});
				}
			});
		},

		/**
		 * set the value for the specified option(s).
		 *
		 * @method setoption
		 * @since 2.1
		 * @param {string|object} option name of the option to change or the set of key/value pairs
		 * @param {mixed} [value] value for the option (is ignored, if first argument is object)
		 */
		setoption: function(option, value) {
			setoption.call(this, option, value, !this.runtime); // until runtime not set we do not need to reinitialize
		},

		/**
		 * get the value for the specified option or the whole configuration, if not specified.
		 * 
		 * @method getoption
		 * @since 2.1
		 * @param {string} [option] name of the option to get
		 * @return {mixed} value for the option or the whole set
		 */
		getoption: function(option) {
			if (!option) {
				return settings;
			}
			return settings[option];
		},

		/**
		 * refreshes the upload instance by dispatching out a refresh event to all runtimes.
		 * this would for example reposition flash/silverlight shims on the page.
		 *
		 * @method refresh
		 */
		refresh : function() {
			if (fileinputs.length) {
				plupload.each(fileinputs, function(fileinput) {
					fileinput.trigger('refresh');
				});
			}
			this.trigger('refresh');
		},

		/**
		 * starts uploading the queued files.
		 *
		 * @method start
		 */
		start : function() {
			if (this.state != plupload.started) {
				this.state = plupload.started;
				this.trigger('statechanged');

				uploadnext.call(this);
			}
		},

		/**
		 * stops the upload of the queued files.
		 *
		 * @method stop
		 */
		stop : function() {
			if (this.state != plupload.stopped) {
				this.state = plupload.stopped;
				this.trigger('statechanged');
				this.trigger('cancelupload');
			}
		},


		/**
		 * disables/enables browse button on request.
		 *
		 * @method disablebrowse
		 * @param {boolean} disable whether to disable or enable (default: true)
		 */
		disablebrowse : function() {
			disabled = arguments[0] !== undef ? arguments[0] : true;

			if (fileinputs.length) {
				plupload.each(fileinputs, function(fileinput) {
					fileinput.disable(disabled);
				});
			}

			this.trigger('disablebrowse', disabled);
		},

		/**
		 * returns the specified file object by id.
		 *
		 * @method getfile
		 * @param {string} id file id to look for.
		 * @return {plupload.file} file object or undefined if it wasn't found;
		 */
		getfile : function(id) {
			var i;
			for (i = files.length - 1; i >= 0; i--) {
				if (files[i].id === id) {
					return files[i];
				}
			}
		},

		/**
		 * adds file to the queue programmatically. can be native file, instance of plupload.file,
		 * instance of moxie.file, input[type="file"] element, or array of these. fires filesadded, 
		 * if any files were added to the queue. otherwise nothing happens.
		 *
		 * @method addfile
		 * @since 2.0
		 * @param {plupload.file|moxie.file|file|node|array} file file or files to add to the queue.
		 * @param {string} [filename] if specified, will be used as a name for the file
		 */
		addfile : function(file, filename) {
			var self = this
			, queue = [] 
			, filesadded = []
			, ruid
			;

			function filterfile(file, cb) {
				var queue = [];
				o.each(self.settings.filters, function(rule, name) {
					if (filefilters[name]) {
						queue.push(function(cb) {
							filefilters[name].call(self, rule, file, function(res) {
								cb(!res);
							});
						});
					}
				});
				o.inseries(queue, cb);
			}

			/**
			 * @method resolvefile
			 * @private
			 * @param {o.file|o.blob|plupload.file|file|blob|input[type="file"]} file
			 */
			function resolvefile(file) {
				var type = o.typeof(file);

				// o.file
				if (file instanceof o.file) { 
					if (!file.ruid && !file.isdetached()) {
						if (!ruid) { // weird case
							return false;
						}
						file.ruid = ruid;
						file.connectruntime(ruid);
					}
					resolvefile(new plupload.file(file));
				}
				// o.blob 
				else if (file instanceof o.blob) {
					resolvefile(file.getsource());
					file.destroy();
				} 
				// plupload.file - final step for other branches
				else if (file instanceof plupload.file) {
					if (filename) {
						file.name = filename;
					}
					
					queue.push(function(cb) {
						// run through the internal and user-defined filters, if any
						filterfile(file, function(err) {
							if (!err) {
								// make files available for the filters by updating the main queue directly
								files.push(file);
								// collect the files that will be passed to filesadded event
								filesadded.push(file); 

								self.trigger("filefiltered", file);
							}
							delay(cb, 1); // do not build up recursions or eventually we might hit the limits
						});
					});
				} 
				// native file or blob
				else if (o.inarray(type, ['file', 'blob']) !== -1) {
					resolvefile(new o.file(null, file));
				} 
				// input[type="file"]
				else if (type === 'node' && o.typeof(file.files) === 'filelist') {
					// if we are dealing with input[type="file"]
					o.each(file.files, resolvefile);
				} 
				// mixed array of any supported types (see above)
				else if (type === 'array') {
					filename = null; // should never happen, but unset anyway to avoid funny situations
					o.each(file, resolvefile);
				}
			}

			ruid = getruid();
			
			resolvefile(file);

			if (queue.length) {
				o.inseries(queue, function() {
					// if any files left after filtration, trigger filesadded
					if (filesadded.length) {
						self.trigger("filesadded", filesadded);
					}
				});
			}
		},

		/**
		 * removes a specific file.
		 *
		 * @method removefile
		 * @param {plupload.file|string} file file to remove from queue.
		 */
		removefile : function(file) {
			var id = typeof(file) === 'string' ? file : file.id;

			for (var i = files.length - 1; i >= 0; i--) {
				if (files[i].id === id) {
					return this.splice(i, 1)[0];
				}
			}
		},

		/**
		 * removes part of the queue and returns the files removed. this will also trigger the filesremoved and queuechanged events.
		 *
		 * @method splice
		 * @param {number} start (optional) start index to remove from.
		 * @param {number} length (optional) lengh of items to remove.
		 * @return {array} array of files that was removed.
		 */
		splice : function(start, length) {
			// splice and trigger events
			var removed = files.splice(start === undef ? 0 : start, length === undef ? files.length : length);

			// if upload is in progress we need to stop it and restart after files are removed
			var restartrequired = false;
			if (this.state == plupload.started) { // upload in progress
				plupload.each(removed, function(file) {
					if (file.status === plupload.uploading) {
						restartrequired = true; // do not restart, unless file that is being removed is uploading
						return false;
					}
				});
				
				if (restartrequired) {
					this.stop();
				}
			}

			this.trigger("filesremoved", removed);

			// dispose any resources allocated by those files
			plupload.each(removed, function(file) {
				file.destroy();
			});
			
			if (restartrequired) {
				this.start();
			}

			return removed;
		},

		/**
		dispatches the specified event name and its arguments to all listeners.

		@method trigger
		@param {string} name event name to fire.
		@param {object..} multiple arguments to pass along to the listener functions.
		*/

		// override the parent method to match plupload-like event logic
		dispatchevent: function(type) {
			var list, args, result;
						
			type = type.tolowercase();
							
			list = this.haseventlistener(type);

			if (list) {
				// sort event list by priority
				list.sort(function(a, b) { return b.priority - a.priority; });
				
				// first argument should be current plupload.uploader instance
				args = [].slice.call(arguments);
				args.shift();
				args.unshift(this);

				for (var i = 0; i < list.length; i++) {
					// fire event, break chain if false is returned
					if (list[i].fn.apply(list[i].scope, args) === false) {
						return false;
					}
				}
			}
			return true;
		},

		/**
		check whether uploader has any listeners to the specified event.

		@method haseventlistener
		@param {string} name event name to check for.
		*/


		/**
		adds an event listener by name.

		@method bind
		@param {string} name event name to listen for.
		@param {function} fn function to call ones the event gets fired.
		@param {object} [scope] optional scope to execute the specified function in.
		@param {number} [priority=0] priority of the event handler - handlers with higher priorities will be called first
		*/
		bind: function(name, fn, scope, priority) {
			// adapt moxie eventtarget style to plupload-like
			plupload.uploader.prototype.bind.call(this, name, fn, priority, scope);
		},

		/**
		removes the specified event listener.

		@method unbind
		@param {string} name name of event to remove.
		@param {function} fn function to remove from listener.
		*/

		/**
		removes all event listeners.

		@method unbindall
		*/


		/**
		 * destroys plupload instance and cleans after itself.
		 *
		 * @method destroy
		 */
		destroy : function() {
			this.trigger('destroy');
			settings = total = null; // purge these exclusively
			this.unbindall();
		}
	});
};

plupload.uploader.prototype = o.eventtarget.instance;

/**
 * constructs a new file instance.
 *
 * @class file
 * @constructor
 * 
 * @param {object} file object containing file properties
 * @param {string} file.name name of the file.
 * @param {number} file.size file size.
 */
plupload.file = (function() {
	var filepool = {};

	function pluploadfile(file) {

		plupload.extend(this, {

			/**
			 * file id this is a globally unique id for the specific file.
			 *
			 * @property id
			 * @type string
			 */
			id: plupload.guid(),

			/**
			 * file name for example "myfile.gif".
			 *
			 * @property name
			 * @type string
			 */
			name: file.name || file.filename,

			/**
			 * file type, `e.g image/jpeg`
			 *
			 * @property type
			 * @type string
			 */
			type: file.type || '',

			/**
			 * file size in bytes (may change after client-side manupilation).
			 *
			 * @property size
			 * @type number
			 */
			size: file.size || file.filesize,

			/**
			 * original file size in bytes.
			 *
			 * @property origsize
			 * @type number
			 */
			origsize: file.size || file.filesize,

			/**
			 * number of bytes uploaded of the files total size.
			 *
			 * @property loaded
			 * @type number
			 */
			loaded: 0,

			/**
			 * number of percentage uploaded of the file.
			 *
			 * @property percent
			 * @type number
			 */
			percent: 0,

			/**
			 * status constant matching the plupload states queued, uploading, failed, done.
			 *
			 * @property status
			 * @type number
			 * @see plupload
			 */
			status: plupload.queued,

			/**
			 * date of last modification.
			 *
			 * @property lastmodifieddate
			 * @type {string}
			 */
			lastmodifieddate: file.lastmodifieddate || (new date()).tolocalestring(), // thu aug 23 2012 19:40:00 gmt+0400 (get)

			/**
			 * returns native window.file object, when it's available.
			 *
			 * @method getnative
			 * @return {window.file} or null, if plupload.file is of different origin
			 */
			getnative: function() {
				var file = this.getsource().getsource();
				return o.inarray(o.typeof(file), ['blob', 'file']) !== -1 ? file : null;
			},

			/**
			 * returns moxie.file - unified wrapper object that can be used across runtimes.
			 *
			 * @method getsource
			 * @return {moxie.file} or null
			 */
			getsource: function() {
				if (!filepool[this.id]) {
					return null;
				}
				return filepool[this.id];
			},

			/**
			 * destroys plupload.file object.
			 *
			 * @method destroy
			 */
			destroy: function() {
				var src = this.getsource();
				if (src) {
					src.destroy();
					delete filepool[this.id];
				}
			}
		});

		filepool[this.id] = file;
	}

	return pluploadfile;
}());


/**
 * constructs a queue progress.
 *
 * @class queueprogress
 * @constructor
 */
 plupload.queueprogress = function() {
	var self = this; // setup alias for self to reduce code size when it's compressed

	/**
	 * total queue file size.
	 *
	 * @property size
	 * @type number
	 */
	self.size = 0;

	/**
	 * total bytes uploaded.
	 *
	 * @property loaded
	 * @type number
	 */
	self.loaded = 0;

	/**
	 * number of files uploaded.
	 *
	 * @property uploaded
	 * @type number
	 */
	self.uploaded = 0;

	/**
	 * number of files failed to upload.
	 *
	 * @property failed
	 * @type number
	 */
	self.failed = 0;

	/**
	 * number of files yet to be uploaded.
	 *
	 * @property queued
	 * @type number
	 */
	self.queued = 0;

	/**
	 * total percent of the uploaded bytes.
	 *
	 * @property percent
	 * @type number
	 */
	self.percent = 0;

	/**
	 * bytes uploaded per second.
	 *
	 * @property bytespersec
	 * @type number
	 */
	self.bytespersec = 0;

	/**
	 * resets the progress to its initial values.
	 *
	 * @method reset
	 */
	self.reset = function() {
		self.size = self.loaded = self.uploaded = self.failed = self.queued = self.percent = self.bytespersec = 0;
	};
};

window.plupload = plupload;

}(window, moxie));







