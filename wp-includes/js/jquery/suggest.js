/*
 *	jquery.suggest 1.1b - 2007-08-06
 * patched by mark jaquith with alexander dick's "multiple items" patch to allow for auto-suggesting of more than one tag before submitting
 * see: http://www.vulgarisoip.com/2007/06/29/jquerysuggest-an-alternative-jquery-based-autocomplete-library/#comment-7228
 *
 *	uses code and techniques from following libraries:
 *	1. http://www.dyve.net/jquery/?autocomplete
 *	2. http://dev.jquery.com/browser/trunk/plugins/interface/iautocompleter.js
 *
 *	all the new stuff written by peter vulgaris (www.vulgarisoip.com)
 *	feel free to do whatever you want with this file
 *
 */

(function($) {

	$.suggest = function(input, options) {
		var $input, $results, timeout, prevlength, cache, cachesize;

		$input = $(input).attr("autocomplete", "off");
		$results = $("<ul/>");

		timeout = false;		// hold timeout id for suggestion results to appear
		prevlength = 0;			// last recorded length of $input.val()
		cache = [];				// cache mru list
		cachesize = 0;			// size of cache in chars (bytes?)

		$results.addclass(options.resultsclass).appendto('body');


		resetposition();
		$(window)
			.on( 'load', resetposition ) // just in case user is changing size of page while loading
			.on( 'resize', resetposition );

		$input.blur(function() {
			settimeout(function() { $results.hide() }, 200);
		});

		$input.keydown(processkey);

		function resetposition() {
			// requires jquery.dimension plugin
			var offset = $input.offset();
			$results.css({
				top: (offset.top + input.offsetheight) + 'px',
				left: offset.left + 'px'
			});
		}


		function processkey(e) {

			// handling up/down/escape requires results to be visible
			// handling enter/tab requires that and a result to be selected
			if ((/27$|38$|40$/.test(e.keycode) && $results.is(':visible')) ||
				(/^13$|^9$/.test(e.keycode) && getcurrentresult())) {

				if (e.preventdefault)
					e.preventdefault();
				if (e.stoppropagation)
					e.stoppropagation();

				e.cancelbubble = true;
				e.returnvalue = false;

				switch(e.keycode) {

					case 38: // up
						prevresult();
						break;

					case 40: // down
						nextresult();
						break;

					case 9:  // tab
					case 13: // return
						selectcurrentresult();
						break;

					case 27: //	escape
						$results.hide();
						break;

				}

			} else if ($input.val().length != prevlength) {

				if (timeout)
					cleartimeout(timeout);
				timeout = settimeout(suggest, options.delay);
				prevlength = $input.val().length;

			}


		}


		function suggest() {

			var q = $.trim($input.val()), multipleseppos, items;

			if ( options.multiple ) {
				multipleseppos = q.lastindexof(options.multiplesep);
				if ( multipleseppos != -1 ) {
					q = $.trim(q.substr(multipleseppos + options.multiplesep.length));
				}
			}
			if (q.length >= options.minchars) {

				cached = checkcache(q);

				if (cached) {

					displayitems(cached['items']);

				} else {

					$.get(options.source, {q: q}, function(txt) {

						$results.hide();

						items = parsetxt(txt, q);

						displayitems(items);
						addtocache(q, items, txt.length);

					});

				}

			} else {

				$results.hide();

			}

		}


		function checkcache(q) {
			var i;
			for (i = 0; i < cache.length; i++)
				if (cache[i]['q'] == q) {
					cache.unshift(cache.splice(i, 1)[0]);
					return cache[0];
				}

			return false;

		}

		function addtocache(q, items, size) {
			var cached;
			while (cache.length && (cachesize + size > options.maxcachesize)) {
				cached = cache.pop();
				cachesize -= cached['size'];
			}

			cache.push({
				q: q,
				size: size,
				items: items
				});

			cachesize += size;

		}

		function displayitems(items) {
			var html = '', i;
			if (!items)
				return;

			if (!items.length) {
				$results.hide();
				return;
			}

			resetposition(); // when the form moves after the page has loaded

			for (i = 0; i < items.length; i++)
				html += '<li>' + items[i] + '</li>';

			$results.html(html).show();

			$results
				.children('li')
				.mouseover(function() {
					$results.children('li').removeclass(options.selectclass);
					$(this).addclass(options.selectclass);
				})
				.click(function(e) {
					e.preventdefault();
					e.stoppropagation();
					selectcurrentresult();
				});

		}

		function parsetxt(txt, q) {

			var items = [], tokens = txt.split(options.delimiter), i, token;

			// parse returned data for non-empty items
			for (i = 0; i < tokens.length; i++) {
				token = $.trim(tokens[i]);
				if (token) {
					token = token.replace(
						new regexp(q, 'ig'),
						function(q) { return '<span class="' + options.matchclass + '">' + q + '</span>' }
						);
					items[items.length] = token;
				}
			}

			return items;
		}

		function getcurrentresult() {
			var $currentresult;
			if (!$results.is(':visible'))
				return false;

			$currentresult = $results.children('li.' + options.selectclass);

			if (!$currentresult.length)
				$currentresult = false;

			return $currentresult;

		}

		function selectcurrentresult() {

			$currentresult = getcurrentresult();

			if ($currentresult) {
				if ( options.multiple ) {
					if ( $input.val().indexof(options.multiplesep) != -1 ) {
						$currentval = $input.val().substr( 0, ( $input.val().lastindexof(options.multiplesep) + options.multiplesep.length ) ) + ' ';
					} else {
						$currentval = "";
					}
					$input.val( $currentval + $currentresult.text() + options.multiplesep + ' ' );
					$input.focus();
				} else {
					$input.val($currentresult.text());
				}
				$results.hide();
				$input.trigger('change');

				if (options.onselect)
					options.onselect.apply($input[0]);

			}

		}

		function nextresult() {

			$currentresult = getcurrentresult();

			if ($currentresult)
				$currentresult
					.removeclass(options.selectclass)
					.next()
						.addclass(options.selectclass);
			else
				$results.children('li:first-child').addclass(options.selectclass);

		}

		function prevresult() {
			var $currentresult = getcurrentresult();

			if ($currentresult)
				$currentresult
					.removeclass(options.selectclass)
					.prev()
						.addclass(options.selectclass);
			else
				$results.children('li:last-child').addclass(options.selectclass);

		}
	}

	$.fn.suggest = function(source, options) {

		if (!source)
			return;

		options = options || {};
		options.multiple = options.multiple || false;
		options.multiplesep = options.multiplesep || ",";
		options.source = source;
		options.delay = options.delay || 100;
		options.resultsclass = options.resultsclass || 'ac_results';
		options.selectclass = options.selectclass || 'ac_over';
		options.matchclass = options.matchclass || 'ac_match';
		options.minchars = options.minchars || 2;
		options.delimiter = options.delimiter || '\n';
		options.onselect = options.onselect || false;
		options.maxcachesize = options.maxcachesize || 65536;

		this.each(function() {
			new $.suggest(this, options);
		});

		return this;

	};

})(jquery);





