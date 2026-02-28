/**
 * cookie functions.
 *
 * @output wp-includes/js/utils.js
 */

/* global usersettings, getallusersettings, wpcookies, setusersetting */
/* exported getusersetting, setusersetting, deleteusersetting */

window.wpcookies = {
// the following functions are from cookie.js class in tinymce 3, moxiecode, used under lgpl.

	each: function( obj, cb, scope ) {
		var n, l;

		if ( ! obj ) {
			return 0;
		}

		scope = scope || obj;

		if ( typeof( obj.length ) !== 'undefined' ) {
			for ( n = 0, l = obj.length; n < l; n++ ) {
				if ( cb.call( scope, obj[n], n, obj ) === false ) {
					return 0;
				}
			}
		} else {
			for ( n in obj ) {
				if ( obj.hasownproperty(n) ) {
					if ( cb.call( scope, obj[n], n, obj ) === false ) {
						return 0;
					}
				}
			}
		}
		return 1;
	},

	/**
	 * get a multi-values cookie.
	 * returns a js object with the name: 'value' pairs.
	 */
	gethash: function( name ) {
		var cookie = this.get( name ), values;

		if ( cookie ) {
			this.each( cookie.split('&'), function( pair ) {
				pair = pair.split('=');
				values = values || {};
				values[pair[0]] = pair[1];
			});
		}

		return values;
	},

	/**
	 * set a multi-values cookie.
	 *
	 * 'values_obj' is the js object that is stored. it is encoded as uri in wpcookies.set().
	 */
	sethash: function( name, values_obj, expires, path, domain, secure ) {
		var str = '';

		this.each( values_obj, function( val, key ) {
			str += ( ! str ? '' : '&' ) + key + '=' + val;
		});

		this.set( name, str, expires, path, domain, secure );
	},

	/**
	 * get a cookie.
	 */
	get: function( name ) {
		var e, b,
			cookie = document.cookie,
			p = name + '=';

		if ( ! cookie ) {
			return;
		}

		b = cookie.indexof( '; ' + p );

		if ( b === -1 ) {
			b = cookie.indexof(p);

			if ( b !== 0 ) {
				return null;
			}
		} else {
			b += 2;
		}

		e = cookie.indexof( ';', b );

		if ( e === -1 ) {
			e = cookie.length;
		}

		return decodeuricomponent( cookie.substring( b + p.length, e ) );
	},

	/**
	 * set a cookie.
	 *
	 * the 'expires' arg can be either a js date() object set to the expiration date (back-compat)
	 * or the number of seconds until expiration
	 */
	set: function( name, value, expires, path, domain, secure ) {
		var d = new date();

		if ( typeof( expires ) === 'object' && expires.togmtstring ) {
			expires = expires.togmtstring();
		} else if ( parseint( expires, 10 ) ) {
			d.settime( d.gettime() + ( parseint( expires, 10 ) * 1000 ) ); // time must be in milliseconds.
			expires = d.togmtstring();
		} else {
			expires = '';
		}

		document.cookie = name + '=' + encodeuricomponent( value ) +
			( expires ? '; expires=' + expires : '' ) +
			( path    ? '; path=' + path       : '' ) +
			( domain  ? '; domain=' + domain   : '' ) +
			( secure  ? '; secure'             : '' );
	},

	/**
	 * remove a cookie.
	 *
	 * this is done by setting it to an empty value and setting the expiration time in the past.
	 */
	remove: function( name, path, domain, secure ) {
		this.set( name, '', -1000, path, domain, secure );
	}
};

// returns the value as string. second arg or empty string is returned when value is not set.
window.getusersetting = function( name, def ) {
	var settings = getallusersettings();

	if ( settings.hasownproperty( name ) ) {
		return settings[name];
	}

	if ( typeof def !== 'undefined' ) {
		return def;
	}

	return '';
};

/*
 * both name and value must be only ascii letters, numbers or underscore
 * and the shorter, the better (cookies can store maximum 4kb). not suitable to store text.
 * the value is converted and stored as string.
 */
window.setusersetting = function( name, value, _del ) {
	if ( 'object' !== typeof usersettings ) {
		return false;
	}

	var uid = usersettings.uid,
		settings = wpcookies.gethash( 'wp-settings-' + uid ),
		path = usersettings.url,
		secure = !! usersettings.secure;

	name = name.tostring().replace( /[^a-za-z0-9_-]/g, '' );

	if ( typeof value === 'number' ) {
		value = parseint( value, 10 );
	} else {
		value = value.tostring().replace( /[^a-za-z0-9_-]/g, '' );
	}

	settings = settings || {};

	if ( _del ) {
		delete settings[name];
	} else {
		settings[name] = value;
	}

	wpcookies.sethash( 'wp-settings-' + uid, settings, 31536000, path, '', secure );
	wpcookies.set( 'wp-settings-time-' + uid, usersettings.time, 31536000, path, '', secure );

	return name;
};

window.deleteusersetting = function( name ) {
	return setusersetting( name, '', 1 );
};

// returns all settings as js object.
window.getallusersettings = function() {
	if ( 'object' !== typeof usersettings ) {
		return {};
	}

	return wpcookies.gethash( 'wp-settings-' + usersettings.uid ) || {};
};


