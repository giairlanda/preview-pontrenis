/**
 * tinymce 3.x language strings
 *
 * loaded only when external plugins are added to tinymce.
 */
( function() {
	var main = {}, lang = 'en';

	if ( typeof tinymcepreinit !== 'undefined' && tinymcepreinit.ref.language !== 'en' ) {
		lang = tinymcepreinit.ref.language;
	}

	main[lang] = {
		common: {
			edit_confirm: "do you want to use the wysiwyg mode for this textarea?",
			apply: "apply",
			insert: "insert",
			update: "update",
			cancel: "cancel",
			close: "close",
			browse: "browse",
			class_name: "class",
			not_set: "-- not set --",
			clipboard_msg: "copy/cut/paste is not available in mozilla and firefox.",
			clipboard_no_support: "currently not supported by your browser, use keyboard shortcuts instead.",
			popup_blocked: "sorry, but we have noticed that your popup-blocker has disabled a window that provides application functionality. you will need to disable popup blocking on this site in order to fully utilize this tool.",
			invalid_data: "error: invalid values entered, these are marked in red.",
			invalid_data_number: "{#field} must be a number",
			invalid_data_min: "{#field} must be a number greater than {#min}",
			invalid_data_size: "{#field} must be a number or percentage",
			more_colors: "more colors"
		},
		colors: {
			"000000": "black",
			"993300": "burnt orange",
			"333300": "dark olive",
			"003300": "dark green",
			"003366": "dark azure",
			"000080": "navy blue",
			"333399": "indigo",
			"333333": "very dark gray",
			"800000": "maroon",
			"ff6600": "orange",
			"808000": "olive",
			"008000": "green",
			"008080": "teal",
			"0000ff": "blue",
			"666699": "grayish blue",
			"808080": "gray",
			"ff0000": "red",
			"ff9900": "amber",
			"99cc00": "yellow green",
			"339966": "sea green",
			"33cccc": "turquoise",
			"3366ff": "royal blue",
			"800080": "purple",
			"999999": "medium gray",
			"ff00ff": "magenta",
			"ffcc00": "gold",
			"ffff00": "yellow",
			"00ff00": "lime",
			"00ffff": "aqua",
			"00ccff": "sky blue",
			"993366": "brown",
			"c0c0c0": "silver",
			"ff99cc": "pink",
			"ffcc99": "peach",
			"ffff99": "light yellow",
			"ccffcc": "pale green",
			"ccffff": "pale cyan",
			"99ccff": "light sky blue",
			"cc99ff": "plum",
			"ffffff": "white"
		},
		contextmenu: {
			align: "alignment",
			left: "left",
			center: "center",
			right: "right",
			full: "full"
		},
		insertdatetime: {
			date_fmt: "%y-%m-%d",
			time_fmt: "%h:%m:%s",
			insertdate_desc: "insert date",
			inserttime_desc: "insert time",
			months_long: "january,february,march,april,may,june,july,august,september,october,november,december",
			months_short: "jan_january_abbreviation,feb_february_abbreviation,mar_march_abbreviation,apr_april_abbreviation,may_may_abbreviation,jun_june_abbreviation,jul_july_abbreviation,aug_august_abbreviation,sep_september_abbreviation,oct_october_abbreviation,nov_november_abbreviation,dec_december_abbreviation",
			day_long: "sunday,monday,tuesday,wednesday,thursday,friday,saturday",
			day_short: "sun,mon,tue,wed,thu,fri,sat"
		},
		print: {
			print_desc: "print"
		},
		preview: {
			preview_desc: "preview"
		},
		directionality: {
			ltr_desc: "direction left to right",
			rtl_desc: "direction right to left"
		},
		layer: {
			insertlayer_desc: "insert new layer",
			forward_desc: "move forward",
			backward_desc: "move backward",
			absolute_desc: "toggle absolute positioning",
			content: "new layer..."
		},
		save: {
			save_desc: "save",
			cancel_desc: "cancel all changes"
		},
		nonbreaking: {
			nonbreaking_desc: "insert non-breaking space character"
		},
		iespell: {
			iespell_desc: "run spell checking",
			download: "iespell not detected. do you want to install it now?"
		},
		advhr: {
			advhr_desc: "horizontal rule"
		},
		emotions: {
			emotions_desc: "emotions"
		},
		searchreplace: {
			search_desc: "find",
			replace_desc: "find/replace"
		},
		advimage: {
			image_desc: "insert/edit image"
		},
		advlink: {
			link_desc: "insert/edit link"
		},
		xhtmlxtras: {
			cite_desc: "citation",
			abbr_desc: "abbreviation",
			acronym_desc: "acronym",
			del_desc: "deletion",
			ins_desc: "insertion",
			attribs_desc: "insert/edit attributes"
		},
		style: {
			desc: "edit css style"
		},
		paste: {
			paste_text_desc: "paste as plain text",
			paste_word_desc: "paste from word",
			selectall_desc: "select all",
			plaintext_mode_sticky: "paste is now in plain text mode. click again to toggle back to regular paste mode. after you paste something you will be returned to regular paste mode.",
			plaintext_mode: "paste is now in plain text mode. click again to toggle back to regular paste mode."
		},
		paste_dlg: {
			text_title: "use ctrl + v on your keyboard to paste the text into the window.",
			text_linebreaks: "keep linebreaks",
			word_title: "use ctrl + v on your keyboard to paste the text into the window."
		},
		table: {
			desc: "inserts a new table",
			row_before_desc: "insert row before",
			row_after_desc: "insert row after",
			delete_row_desc: "delete row",
			col_before_desc: "insert column before",
			col_after_desc: "insert column after",
			delete_col_desc: "remove column",
			split_cells_desc: "split merged table cells",
			merge_cells_desc: "merge table cells",
			row_desc: "table row properties",
			cell_desc: "table cell properties",
			props_desc: "table properties",
			paste_row_before_desc: "paste table row before",
			paste_row_after_desc: "paste table row after",
			cut_row_desc: "cut table row",
			copy_row_desc: "copy table row",
			del: "delete table",
			row: "row",
			col: "column",
			cell: "cell"
		},
		autosave: {
			unload_msg: "the changes you made will be lost if you navigate away from this page."
		},
		fullscreen: {
			desc: "toggle fullscreen mode (alt + shift + g)"
		},
		media: {
			desc: "insert / edit embedded media",
			edit: "edit embedded media"
		},
		fullpage: {
			desc: "document properties"
		},
		template: {
			desc: "insert predefined template content"
		},
		visualchars: {
			desc: "visual control characters on/off."
		},
		spellchecker: {
			desc: "toggle spellchecker (alt + shift + n)",
			menu: "spellchecker settings",
			ignore_word: "ignore word",
			ignore_words: "ignore all",
			langs: "languages",
			wait: "please wait...",
			sug: "suggestions",
			no_sug: "no suggestions",
			no_mpell: "no misspellings found.",
			learn_word: "learn word"
		},
		pagebreak: {
			desc: "insert page break"
		},
		advlist:{
			types: "types",
			def: "default",
			lower_alpha: "lower alpha",
			lower_greek: "lower greek",
			lower_roman: "lower roman",
			upper_alpha: "upper alpha",
			upper_roman: "upper roman",
			circle: "circle",
			disc: "disc",
			square: "square"
		},
		aria: {
			rich_text_area: "rich text area"
		},
		wordcount:{
			words: "words: "
		}
	};

	tinymce.addi18n( main );

	tinymce.addi18n( lang + ".advanced", {
		style_select: "styles",
		font_size: "font size",
		fontdefault: "font family",
		block: "format",
		paragraph: "paragraph",
		div: "div",
		address: "address",
		pre: "preformatted",
		h1: "heading 1",
		h2: "heading 2",
		h3: "heading 3",
		h4: "heading 4",
		h5: "heading 5",
		h6: "heading 6",
		blockquote: "blockquote",
		code: "code",
		samp: "code sample",
		dt: "definition term ",
		dd: "definition description",
		bold_desc: "bold (ctrl + b)",
		italic_desc: "italic (ctrl + i)",
		underline_desc: "underline",
		striketrough_desc: "strikethrough (alt + shift + d)",
		justifyleft_desc: "align left (alt + shift + l)",
		justifycenter_desc: "align center (alt + shift + c)",
		justifyright_desc: "align right (alt + shift + r)",
		justifyfull_desc: "align full (alt + shift + j)",
		bullist_desc: "unordered list (alt + shift + u)",
		numlist_desc: "ordered list (alt + shift + o)",
		outdent_desc: "outdent",
		indent_desc: "indent",
		undo_desc: "undo (ctrl + z)",
		redo_desc: "redo (ctrl + y)",
		link_desc: "insert/edit link (alt + shift + a)",
		unlink_desc: "unlink (alt + shift + s)",
		image_desc: "insert/edit image (alt + shift + m)",
		cleanup_desc: "cleanup messy code",
		code_desc: "edit html source",
		sub_desc: "subscript",
		sup_desc: "superscript",
		hr_desc: "insert horizontal ruler",
		removeformat_desc: "remove formatting",
		forecolor_desc: "select text color",
		backcolor_desc: "select background color",
		charmap_desc: "insert custom character",
		visualaid_desc: "toggle guidelines/invisible elements",
		anchor_desc: "insert/edit anchor",
		cut_desc: "cut",
		copy_desc: "copy",
		paste_desc: "paste",
		image_props_desc: "image properties",
		newdocument_desc: "new document",
		help_desc: "help",
		blockquote_desc: "blockquote (alt + shift + q)",
		clipboard_msg: "copy/cut/paste is not available in mozilla and firefox.",
		path: "path",
		newdocument: "are you sure you want to clear all contents?",
		toolbar_focus: "jump to tool buttons - alt+q, jump to editor - alt-z, jump to element path - alt-x",
		more_colors: "more colors",
		shortcuts_desc: "accessibility help",
		help_shortcut: " press alt f10 for toolbar. press alt 0 for help.",
		rich_text_area: "rich text area",
		toolbar: "toolbar"
	});

	tinymce.addi18n( lang + ".advanced_dlg", {
		about_title: "about tinymce",
		about_general: "about",
		about_help: "help",
		about_license: "license",
		about_plugins: "plugins",
		about_plugin: "plugin",
		about_author: "author",
		about_version: "version",
		about_loaded: "loaded plugins",
		anchor_title: "insert/edit anchor",
		anchor_name: "anchor name",
		code_title: "html source editor",
		code_wordwrap: "word wrap",
		colorpicker_title: "select a color",
		colorpicker_picker_tab: "picker",
		colorpicker_picker_title: "color picker",
		colorpicker_palette_tab: "palette",
		colorpicker_palette_title: "palette colors",
		colorpicker_named_tab: "named",
		colorpicker_named_title: "named colors",
		colorpicker_color: "color: ",
		colorpicker_name: "name: ",
		charmap_title: "select custom character",
		charmap_usage: "use left and right arrows to navigate.",
		image_title: "insert/edit image",
		image_src: "image url",
		image_alt: "image description",
		image_list: "image list",
		image_border: "border",
		image_dimensions: "dimensions",
		image_vspace: "vertical space",
		image_hspace: "horizontal space",
		image_align: "alignment",
		image_align_baseline: "baseline",
		image_align_top: "top",
		image_align_middle: "middle",
		image_align_bottom: "bottom",
		image_align_texttop: "text top",
		image_align_textbottom: "text bottom",
		image_align_left: "left",
		image_align_right: "right",
		link_title: "insert/edit link",
		link_url: "link url",
		link_target: "target",
		link_target_same: "open link in the same window",
		link_target_blank: "open link in a new window",
		link_titlefield: "title",
		link_is_email: "the url you entered seems to be an email address, do you want to add the required mailto: prefix?",
		link_is_external: "the url you entered seems to be an external link, do you want to add the required http:// prefix?",
		link_list: "link list",
		accessibility_help: "accessibility help",
		accessibility_usage_title: "general usage"
	});

	tinymce.addi18n( lang + ".media_dlg", {
		title: "insert / edit embedded media",
		general: "general",
		advanced: "advanced",
		file: "file/url",
		list: "list",
		size: "dimensions",
		preview: "preview",
		constrain_proportions: "constrain proportions",
		type: "type",
		id: "id",
		name: "name",
		class_name: "class",
		vspace: "v-space",
		hspace: "h-space",
		play: "auto play",
		loop: "loop",
		menu: "show menu",
		quality: "quality",
		scale: "scale",
		align: "align",
		salign: "salign",
		wmode: "wmode",
		bgcolor: "background",
		base: "base",
		flashvars: "flashvars",
		liveconnect: "swliveconnect",
		autohref: "autohref",
		cache: "cache",
		hidden: "hidden",
		controller: "controller",
		kioskmode: "kiosk mode",
		playeveryframe: "play every frame",
		targetcache: "target cache",
		correction: "no correction",
		enablejavascript: "enable javascript",
		starttime: "start time",
		endtime: "end time",
		href: "href",
		qtsrcchokespeed: "choke speed",
		target: "target",
		volume: "volume",
		autostart: "auto start",
		enabled: "enabled",
		fullscreen: "fullscreen",
		invokeurls: "invoke urls",
		mute: "mute",
		stretchtofit: "stretch to fit",
		windowlessvideo: "windowless video",
		balance: "balance",
		baseurl: "base url",
		captioningid: "captioning id",
		currentmarker: "current marker",
		currentposition: "current position",
		defaultframe: "default frame",
		playcount: "play count",
		rate: "rate",
		uimode: "ui mode",
		flash_options: "flash options",
		qt_options: "quicktime options",
		wmp_options: "windows media player options",
		rmp_options: "real media player options",
		shockwave_options: "shockwave options",
		autogotourl: "auto goto url",
		center: "center",
		imagestatus: "image status",
		maintainaspect: "maintain aspect",
		nojava: "no java",
		prefetch: "prefetch",
		shuffle: "shuffle",
		console: "console",
		numloop: "num loops",
		controls: "controls",
		scriptcallbacks: "script callbacks",
		swstretchstyle: "stretch style",
		swstretchhalign: "stretch h-align",
		swstretchvalign: "stretch v-align",
		sound: "sound",
		progress: "progress",
		qtsrc: "qt src",
		qt_stream_warn: "streamed rtsp resources should be added to the qt src field under the advanced tab.",
		align_top: "top",
		align_right: "right",
		align_bottom: "bottom",
		align_left: "left",
		align_center: "center",
		align_top_left: "top left",
		align_top_right: "top right",
		align_bottom_left: "bottom left",
		align_bottom_right: "bottom right",
		flv_options: "flash video options",
		flv_scalemode: "scale mode",
		flv_buffer: "buffer",
		flv_startimage: "start image",
		flv_starttime: "start time",
		flv_defaultvolume: "default volume",
		flv_hiddengui: "hidden gui",
		flv_autostart: "auto start",
		flv_loop: "loop",
		flv_showscalemodes: "show scale modes",
		flv_smoothvideo: "smooth video",
		flv_jscallback: "js callback",
		html5_video_options: "html5 video options",
		altsource1: "alternative source 1",
		altsource2: "alternative source 2",
		preload: "preload",
		poster: "poster",
		source: "source"
	});

	tinymce.addi18n( lang + ".wordpress", {
		wp_adv_desc: "show/hide kitchen sink (alt + shift + z)",
		wp_more_desc: "insert more tag (alt + shift + t)",
		wp_page_desc: "insert page break (alt + shift + p)",
		wp_help_desc: "help (alt + shift + h)",
		wp_more_alt: "more...",
		wp_page_alt: "next page...",
		add_media: "add media",
		add_image: "add an image",
		add_video: "add video",
		add_audio: "add audio",
		editgallery: "edit gallery",
		delgallery: "delete gallery",
		wp_fullscreen_desc: "distraction-free writing mode (alt + shift + w)"
	});

	tinymce.addi18n( lang + ".wpeditimage", {
		edit_img: "edit image",
		del_img: "delete image",
		adv_settings: "advanced settings",
		none: "none",
		size: "size",
		thumbnail: "thumbnail",
		medium: "medium",
		full_size: "full size",
		current_link: "current link",
		link_to_img: "link to image",
		link_help: "enter a link url or click above for presets.",
		adv_img_settings: "advanced image settings",
		source: "source",
		width: "width",
		height: "height",
		orig_size: "original size",
		css: "css class",
		adv_link_settings: "advanced link settings",
		link_rel: "link rel",
		s60: "60%",
		s70: "70%",
		s80: "80%",
		s90: "90%",
		s100: "100%",
		s110: "110%",
		s120: "120%",
		s130: "130%",
		img_title: "title",
		caption: "caption",
		alt: "alternative text"
	});
}());






