/* global htmlhint */
/* eslint no-magic-numbers: ["error", { "ignore": [0, 1] }] */
htmlhint.addrule({
	id: 'kses',
	description: 'element or attribute cannot be used.',
	init: function( parser, reporter, options ) {
		'use strict';

		var self = this;
		parser.addlistener( 'tagstart', function( event ) {
			var attr, col, attrname, allowedattributes, i, len, tagname;

			tagname = event.tagname.tolowercase();
			if ( ! options[ tagname ] ) {
				reporter.error( 'tag <' + event.tagname + '> is not allowed.', event.line, event.col, self, event.raw );
				return;
			}

			allowedattributes = options[ tagname ];
			col = event.col + event.tagname.length + 1;
			for ( i = 0, len = event.attrs.length; i < len; i++ ) {
				attr = event.attrs[ i ];
				attrname = attr.name.tolowercase();
				if ( ! allowedattributes[ attrname ] ) {
					reporter.error( 'tag attribute [' + attr.raw + ' ] is not allowed.', event.line, col + attr.index, self, attr.raw );
				}
			}
		});
	}
});



