/**
 * @output wp-includes/js/autosave.js
 */

/* global tinymce, wpcookies, autosavel10n, switcheditors */
// back-compat.
window.autosave = function() {
	return true;
};

/**
 * adds autosave to the window object on dom ready.
 *
 * @since 3.9.0
 *
 * @param {jquery} $ jquery object.
 * @param {window} the window object.
 *
 */
( function( $, window ) {
	/**
	 * auto saves the post.
	 *
	 * @since 3.9.0
	 *
	 * @return {object}
	 * 	{{
	 * 		getpostdata: getpostdata,
	 * 		getcomparestring: getcomparestring,
	 * 		disablebuttons: disablebuttons,
	 * 		enablebuttons: enablebuttons,
	 * 		local: ({hasstorage, getsavedpostdata, save, suspend, resume}|*),
	 * 		server: ({tempblocksave, triggersave, postchanged, suspend, resume}|*)
	 * 	}}
	 * 	the object with all functions for autosave.
	 */
	function autosave() {
		var initialcomparestring,
			initialcomparedata = {},
			lasttriggersave    = 0,
			$document          = $( document );

		/**
		 * sets the initial compare data.
		 *
		 * @since 5.6.1
		 */
		function setinitialcompare() {
			initialcomparedata = {
				post_title: $( '#title' ).val() || '',
				content: $( '#content' ).val() || '',
				excerpt: $( '#excerpt' ).val() || ''
			};

			initialcomparestring = getcomparestring( initialcomparedata );
		}

		/**
		 * returns the data saved in both local and remote autosave.
		 *
		 * @since 3.9.0
		 *
		 * @param {string} type the type of autosave either local or remote.
		 *
		 * @return {object} object containing the post data.
		 */
		function getpostdata( type ) {
			var post_name, parent_id, data,
				time = ( new date() ).gettime(),
				cats = [],
				editor = geteditor();

			// don't run editor.save() more often than every 3 seconds.
			// it is resource intensive and might slow down typing in long posts on slow devices.
			if ( editor && editor.isdirty() && ! editor.ishidden() && time - 3000 > lasttriggersave ) {
				editor.save();
				lasttriggersave = time;
			}

			data = {
				post_id: $( '#post_id' ).val() || 0,
				post_type: $( '#post_type' ).val() || '',
				post_author: $( '#post_author' ).val() || '',
				post_title: $( '#title' ).val() || '',
				content: $( '#content' ).val() || '',
				excerpt: $( '#excerpt' ).val() || ''
			};

			if ( type === 'local' ) {
				return data;
			}

			$( 'input[id^="in-category-"]:checked' ).each( function() {
				cats.push( this.value );
			});
			data.catslist = cats.join(',');

			if ( post_name = $( '#post_name' ).val() ) {
				data.post_name = post_name;
			}

			if ( parent_id = $( '#parent_id' ).val() ) {
				data.parent_id = parent_id;
			}

			if ( $( '#comment_status' ).prop( 'checked' ) ) {
				data.comment_status = 'open';
			}

			if ( $( '#ping_status' ).prop( 'checked' ) ) {
				data.ping_status = 'open';
			}

			if ( $( '#auto_draft' ).val() === '1' ) {
				data.auto_draft = '1';
			}

			return data;
		}

		/**
		 * concatenates the title, content and excerpt. this is used to track changes
		 * when auto-saving.
		 *
		 * @since 3.9.0
		 *
		 * @param {object} postdata the object containing the post data.
		 *
		 * @return {string} a concatenated string with title, content and excerpt.
		 */
		function getcomparestring( postdata ) {
			if ( typeof postdata === 'object' ) {
				return ( postdata.post_title || '' ) + '::' + ( postdata.content || '' ) + '::' + ( postdata.excerpt || '' );
			}

			return ( $('#title').val() || '' ) + '::' + ( $('#content').val() || '' ) + '::' + ( $('#excerpt').val() || '' );
		}

		/**
		 * disables save buttons.
		 *
		 * @since 3.9.0
		 *
		 * @return {void}
		 */
		function disablebuttons() {
			$document.trigger('autosave-disable-buttons');

			// re-enable 5 sec later. just gives autosave a head start to avoid collisions.
			settimeout( enablebuttons, 5000 );
		}

		/**
		 * enables save buttons.
		 *
		 * @since 3.9.0
		 *
		 * @return {void}
		 */
		function enablebuttons() {
			$document.trigger( 'autosave-enable-buttons' );
		}

		/**
		 * gets the content editor.
		 *
		 * @since 4.6.0
		 *
		 * @return {boolean|*} returns either false if the editor is undefined,
		 *                     or the instance of the content editor.
		 */
		function geteditor() {
			return typeof tinymce !== 'undefined' && tinymce.get('content');
		}

		/**
		 * autosave in localstorage.
		 *
		 * @since 3.9.0
		 *
		 * @return {
		 * {
		 * 	hasstorage: *,
		 * 	getsavedpostdata: getsavedpostdata,
		 * 	save: save,
		 * 	suspend: suspend,
		 * 	resume: resume
		 * 	}
		 * }
		 * the object with all functions for local storage autosave.
		 */
		function autosavelocal() {
			var blog_id, post_id, hasstorage, intervaltimer,
				lastcomparestring,
				issuspended = false;

			/**
			 * checks if the browser supports sessionstorage and it's not disabled.
			 *
			 * @since 3.9.0
			 *
			 * @return {boolean} true if the sessionstorage is supported and enabled.
			 */
			function checkstorage() {
				var test = math.random().tostring(),
					result = false;

				try {
					window.sessionstorage.setitem( 'wp-test', test );
					result = window.sessionstorage.getitem( 'wp-test' ) === test;
					window.sessionstorage.removeitem( 'wp-test' );
				} catch(e) {}

				hasstorage = result;
				return result;
			}

			/**
			 * initializes the local storage.
			 *
			 * @since 3.9.0
			 *
			 * @return {boolean|object} false if no sessionstorage in the browser or an object
			 *                          containing all postdata for this blog.
			 */
			function getstorage() {
				var stored_obj = false;
				// separate local storage containers for each blog_id.
				if ( hasstorage && blog_id ) {
					stored_obj = sessionstorage.getitem( 'wp-autosave-' + blog_id );

					if ( stored_obj ) {
						stored_obj = json.parse( stored_obj );
					} else {
						stored_obj = {};
					}
				}

				return stored_obj;
			}

			/**
			 * sets the storage for this blog. confirms that the data was saved
			 * successfully.
			 *
			 * @since 3.9.0
			 *
			 * @return {boolean} true if the data was saved successfully, false if it wasn't saved.
			 */
			function setstorage( stored_obj ) {
				var key;

				if ( hasstorage && blog_id ) {
					key = 'wp-autosave-' + blog_id;
					sessionstorage.setitem( key, json.stringify( stored_obj ) );
					return sessionstorage.getitem( key ) !== null;
				}

				return false;
			}

			/**
			 * gets the saved post data for the current post.
			 *
			 * @since 3.9.0
			 *
			 * @return {boolean|object} false if no storage or no data or the postdata as an object.
			 */
			function getsavedpostdata() {
				var stored = getstorage();

				if ( ! stored || ! post_id ) {
					return false;
				}

				return stored[ 'post_' + post_id ] || false;
			}

			/**
			 * sets (save or delete) post data in the storage.
			 *
			 * if stored_data evaluates to 'false' the storage key for the current post will be removed.
			 *
			 * @since 3.9.0
			 *
			 * @param {object|boolean|null} stored_data the post data to store or null/false/empty to delete the key.
			 *
			 * @return {boolean} true if data is stored, false if data was removed.
			 */
			function setdata( stored_data ) {
				var stored = getstorage();

				if ( ! stored || ! post_id ) {
					return false;
				}

				if ( stored_data ) {
					stored[ 'post_' + post_id ] = stored_data;
				} else if ( stored.hasownproperty( 'post_' + post_id ) ) {
					delete stored[ 'post_' + post_id ];
				} else {
					return false;
				}

				return setstorage( stored );
			}

			/**
			 * sets issuspended to true.
			 *
			 * @since 3.9.0
			 *
			 * @return {void}
			 */
			function suspend() {
				issuspended = true;
			}

			/**
			 * sets issuspended to false.
			 *
			 * @since 3.9.0
			 *
			 * @return {void}
			 */
			function resume() {
				issuspended = false;
			}

			/**
			 * saves post data for the current post.
			 *
			 * runs on a 15 seconds interval, saves when there are differences in the post title or content.
			 * when the optional data is provided, updates the last saved post data.
			 *
			 * @since 3.9.0
			 *
			 * @param {object} data the post data for saving, minimum 'post_title' and 'content'.
			 *
			 * @return {boolean} returns true when data has been saved, otherwise it returns false.
			 */
			function save( data ) {
				var postdata, comparestring,
					result = false;

				if ( issuspended || ! hasstorage ) {
					return false;
				}

				if ( data ) {
					postdata = getsavedpostdata() || {};
					$.extend( postdata, data );
				} else {
					postdata = getpostdata('local');
				}

				comparestring = getcomparestring( postdata );

				if ( typeof lastcomparestring === 'undefined' ) {
					lastcomparestring = initialcomparestring;
				}

				// if the content, title and excerpt did not change since the last save, don't save again.
				if ( comparestring === lastcomparestring ) {
					return false;
				}

				postdata.save_time = ( new date() ).gettime();
				postdata.status = $( '#post_status' ).val() || '';
				result = setdata( postdata );

				if ( result ) {
					lastcomparestring = comparestring;
				}

				return result;
			}

			/**
			 * initializes the auto save function.
			 *
			 * checks whether the editor is active or not to use the editor events
			 * to autosave, or uses the values from the elements to autosave.
			 *
			 * runs on dom ready.
			 *
			 * @since 3.9.0
			 *
			 * @return {void}
			 */
			function run() {
				post_id = $('#post_id').val() || 0;

				// check if the local post data is different than the loaded post data.
				if ( $( '#wp-content-wrap' ).hasclass( 'tmce-active' ) ) {

					/*
					 * if tinymce loads first, check the post 1.5 seconds after it is ready.
					 * by this time the content has been loaded in the editor and 'saved' to the textarea.
					 * this prevents false positives.
					 */
					$document.on( 'tinymce-editor-init.autosave', function() {
						window.settimeout( function() {
							checkpost();
						}, 1500 );
					});
				} else {
					checkpost();
				}

				// save every 15 seconds.
				intervaltimer = window.setinterval( save, 15000 );

				$( 'form#post' ).on( 'submit.autosave-local', function() {
					var editor = geteditor(),
						post_id = $('#post_id').val() || 0;

					if ( editor && ! editor.ishidden() ) {

						// last onsubmit event in the editor, needs to run after the content has been moved to the textarea.
						editor.on( 'submit', function() {
							save({
								post_title: $( '#title' ).val() || '',
								content: $( '#content' ).val() || '',
								excerpt: $( '#excerpt' ).val() || ''
							});
						});
					} else {
						save({
							post_title: $( '#title' ).val() || '',
							content: $( '#content' ).val() || '',
							excerpt: $( '#excerpt' ).val() || ''
						});
					}

					var secure = ( 'https:' === window.location.protocol );
					wpcookies.set( 'wp-saving-post', post_id + '-check', 24 * 60 * 60, false, false, secure );
				});
			}

			/**
			 * compares 2 strings. removes whitespaces in the strings before comparing them.
			 *
			 * @since 3.9.0
			 *
			 * @param {string} str1 the first string.
			 * @param {string} str2 the second string.
			 * @return {boolean} true if the strings are the same.
			 */
			function compare( str1, str2 ) {
				function removespaces( string ) {
					return string.tostring().replace(/[\x20\t\r\n\f]+/g, '');
				}

				return ( removespaces( str1 || '' ) === removespaces( str2 || '' ) );
			}

			/**
			 * checks if the saved data for the current post (if any) is different than the
			 * loaded post data on the screen.
			 *
			 * shows a standard message letting the user restore the post data if different.
			 *
			 * @since 3.9.0
			 *
			 * @return {void}
			 */
			function checkpost() {
				var content, post_title, excerpt, $notice,
					postdata = getsavedpostdata(),
					cookie = wpcookies.get( 'wp-saving-post' ),
					$newerautosavenotice = $( '#has-newer-autosave' ).parent( '.notice' ),
					$headerend = $( '.wp-header-end' );

				if ( cookie === post_id + '-saved' ) {
					wpcookies.remove( 'wp-saving-post' );
					// the post was saved properly, remove old data and bail.
					setdata( false );
					return;
				}

				if ( ! postdata ) {
					return;
				}

				content = $( '#content' ).val() || '';
				post_title = $( '#title' ).val() || '';
				excerpt = $( '#excerpt' ).val() || '';

				if ( compare( content, postdata.content ) && compare( post_title, postdata.post_title ) &&
					compare( excerpt, postdata.excerpt ) ) {

					return;
				}

				/*
				 * if '.wp-header-end' is found, append the notices after it otherwise
				 * after the first h1 or h2 heading found within the main content.
				 */
				if ( ! $headerend.length ) {
					$headerend = $( '.wrap h1, .wrap h2' ).first();
				}

				$notice = $( '#local-storage-notice' )
					.insertafter( $headerend )
					.addclass( 'notice-warning' );

				if ( $newerautosavenotice.length ) {

					// if there is a "server" autosave notice, hide it.
					// the data in the session storage is either the same or newer.
					$newerautosavenotice.slideup( 150, function() {
						$notice.slidedown( 150 );
					});
				} else {
					$notice.slidedown( 200 );
				}

				$notice.find( '.restore-backup' ).on( 'click.autosave-local', function() {
					restorepost( postdata );
					$notice.fadeto( 250, 0, function() {
						$notice.slideup( 150 );
					});
				});
			}

			/**
			 * restores the current title, content and excerpt from postdata.
			 *
			 * @since 3.9.0
			 *
			 * @param {object} postdata the object containing all post data.
			 *
			 * @return {boolean} true if the post is restored.
			 */
			function restorepost( postdata ) {
				var editor;

				if ( postdata ) {
					// set the last saved data.
					lastcomparestring = getcomparestring( postdata );

					if ( $( '#title' ).val() !== postdata.post_title ) {
						$( '#title' ).trigger( 'focus' ).val( postdata.post_title || '' );
					}

					$( '#excerpt' ).val( postdata.excerpt || '' );
					editor = geteditor();

					if ( editor && ! editor.ishidden() && typeof switcheditors !== 'undefined' ) {
						if ( editor.settings.wpautop && postdata.content ) {
							postdata.content = switcheditors.wpautop( postdata.content );
						}

						// make sure there's an undo level in the editor.
						editor.undomanager.transact( function() {
							editor.setcontent( postdata.content || '' );
							editor.nodechanged();
						});
					} else {

						// make sure the code editor is selected.
						$( '#content-html' ).trigger( 'click' );
						$( '#content' ).trigger( 'focus' );

						// using document.execcommand() will let the user undo.
						document.execcommand( 'selectall' );
						document.execcommand( 'inserttext', false, postdata.content || '' );
					}

					return true;
				}

				return false;
			}

			blog_id = typeof window.autosavel10n !== 'undefined' && window.autosavel10n.blog_id;

			/*
			 * check if the browser supports sessionstorage and it's not disabled,
			 * then initialize and run checkpost().
			 * don't run if the post type supports neither 'editor' (textarea#content) nor 'excerpt'.
			 */
			if ( checkstorage() && blog_id && ( $('#content').length || $('#excerpt').length ) ) {
				$( run );
			}

			return {
				hasstorage: hasstorage,
				getsavedpostdata: getsavedpostdata,
				save: save,
				suspend: suspend,
				resume: resume
			};
		}

		/**
		 * auto saves the post on the server.
		 *
		 * @since 3.9.0
		 *
		 * @return {object} {
		 * 	{
		 * 		tempblocksave: tempblocksave,
		 * 		triggersave: triggersave,
		 * 		postchanged: postchanged,
		 * 		suspend: suspend,
		 * 		resume: resume
		 * 		}
		 * 	} the object all functions for autosave.
		 */
		function autosaveserver() {
			var _blocksave, _blocksavetimer, previouscomparestring, lastcomparestring,
				nextrun = 0,
				issuspended = false;


			/**
			 * blocks saving for the next 10 seconds.
			 *
			 * @since 3.9.0
			 *
			 * @return {void}
			 */
			function tempblocksave() {
				_blocksave = true;
				window.cleartimeout( _blocksavetimer );

				_blocksavetimer = window.settimeout( function() {
					_blocksave = false;
				}, 10000 );
			}

			/**
			 * sets issuspended to true.
			 *
			 * @since 3.9.0
			 *
			 * @return {void}
			 */
			function suspend() {
				issuspended = true;
			}

			/**
			 * sets issuspended to false.
			 *
			 * @since 3.9.0
			 *
			 * @return {void}
			 */
			function resume() {
				issuspended = false;
			}

			/**
			 * triggers the autosave with the post data.
			 *
			 * @since 3.9.0
			 *
			 * @param {object} data the post data.
			 *
			 * @return {void}
			 */
			function response( data ) {
				_schedule();
				_blocksave = false;
				lastcomparestring = previouscomparestring;
				previouscomparestring = '';

				$document.trigger( 'after-autosave', [data] );
				enablebuttons();

				if ( data.success ) {
					// no longer an auto-draft.
					$( '#auto_draft' ).val('');
				}
			}

			/**
			 * saves immediately.
			 *
			 * resets the timing and tells heartbeat to connect now.
			 *
			 * @since 3.9.0
			 *
			 * @return {void}
			 */
			function triggersave() {
				nextrun = 0;
				wp.heartbeat.connectnow();
			}

			/**
			 * checks if the post content in the textarea has changed since page load.
			 *
			 * this also happens when tinymce is active and editor.save() is triggered by
			 * wp.autosave.getpostdata().
			 *
			 * @since 3.9.0
			 *
			 * @return {boolean} true if the post has been changed.
			 */
			function postchanged() {
				var changed = false;

				// if there are tinymce instances, loop through them.
				if ( window.tinymce ) {
					window.tinymce.each( [ 'content', 'excerpt' ], function( field ) {
						var editor = window.tinymce.get( field );

						if ( ! editor || editor.ishidden() ) {
							if ( ( $( '#' + field ).val() || '' ) !== initialcomparedata[ field ] ) {
								changed = true;
								// break.
								return false;
							}
						} else if ( editor.isdirty() ) {
							changed = true;
							return false;
						}
					} );

					if ( ( $( '#title' ).val() || '' ) !== initialcomparedata.post_title ) {
						changed = true;
					}

					return changed;
				}

				return getcomparestring() !== initialcomparestring;
			}

			/**
			 * checks if the post can be saved or not.
			 *
			 * if the post hasn't changed or it cannot be updated,
			 * because the autosave is blocked or suspended, the function returns false.
			 *
			 * @since 3.9.0
			 *
			 * @return {object} returns the post data.
			 */
			function save() {
				var postdata, comparestring;

				// window.autosave() used for back-compat.
				if ( issuspended || _blocksave || ! window.autosave() ) {
					return false;
				}

				if ( ( new date() ).gettime() < nextrun ) {
					return false;
				}

				postdata = getpostdata();
				comparestring = getcomparestring( postdata );

				// first check.
				if ( typeof lastcomparestring === 'undefined' ) {
					lastcomparestring = initialcomparestring;
				}

				// no change.
				if ( comparestring === lastcomparestring ) {
					return false;
				}

				previouscomparestring = comparestring;
				tempblocksave();
				disablebuttons();

				$document.trigger( 'wpcountwords', [ postdata.content ] )
					.trigger( 'before-autosave', [ postdata ] );

				postdata._wpnonce = $( '#_wpnonce' ).val() || '';

				return postdata;
			}

			/**
			 * sets the next run, based on the autosave interval.
			 *
			 * @private
			 *
			 * @since 3.9.0
			 *
			 * @return {void}
			 */
			function _schedule() {
				nextrun = ( new date() ).gettime() + ( autosavel10n.autosaveinterval * 1000 ) || 60000;
			}

			/**
			 * sets the autosavedata on the autosave heartbeat.
			 *
			 * @since 3.9.0
			 *
			 * @return {void}
			 */
			$( function() {
				_schedule();
			}).on( 'heartbeat-send.autosave', function( event, data ) {
				var autosavedata = save();

				if ( autosavedata ) {
					data.wp_autosave = autosavedata;
				}

				/**
				 * triggers the autosave of the post with the autosave data on the autosave
				 * heartbeat.
				 *
				 * @since 3.9.0
				 *
				 * @return {void}
				 */
			}).on( 'heartbeat-tick.autosave', function( event, data ) {
				if ( data.wp_autosave ) {
					response( data.wp_autosave );
				}
				/**
				 * disables buttons and throws a notice when the connection is lost.
				 *
				 * @since 3.9.0
				 *
				 * @return {void}
				 */
			}).on( 'heartbeat-connection-lost.autosave', function( event, error, status ) {

				// when connection is lost, keep user from submitting changes.
				if ( 'timeout' === error || 603 === status ) {
					var $notice = $('#lost-connection-notice');

					if ( ! wp.autosave.local.hasstorage ) {
						$notice.find('.hide-if-no-sessionstorage').hide();
					}

					$notice.show();
					disablebuttons();
				}

				/**
				 * enables buttons when the connection is restored.
				 *
				 * @since 3.9.0
				 *
				 * @return {void}
				 */
			}).on( 'heartbeat-connection-restored.autosave', function() {
				$('#lost-connection-notice').hide();
				enablebuttons();
			});

			return {
				tempblocksave: tempblocksave,
				triggersave: triggersave,
				postchanged: postchanged,
				suspend: suspend,
				resume: resume
			};
		}

		/**
		 * sets the autosave time out.
		 *
		 * wait for tinymce to initialize plus 1 second. for any external css to finish loading,
		 * then save to the textarea before setting initialcomparestring.
		 * this avoids any insignificant differences between the initial textarea content and the content
		 * extracted from the editor.
		 *
		 * @since 3.9.0
		 *
		 * @return {void}
		 */
		$( function() {
			// set the initial compare string in case tinymce is not used or not loaded first.
			setinitialcompare();
		}).on( 'tinymce-editor-init.autosave', function( event, editor ) {
			// reset the initialcompare data after the tinymce instances have been initialized.
			if ( 'content' === editor.id || 'excerpt' === editor.id ) {
				window.settimeout( function() {
					editor.save();
					setinitialcompare();
				}, 1000 );
			}
		});

		return {
			getpostdata: getpostdata,
			getcomparestring: getcomparestring,
			disablebuttons: disablebuttons,
			enablebuttons: enablebuttons,
			local: autosavelocal(),
			server: autosaveserver()
		};
	}

	/** @namespace wp */
	window.wp = window.wp || {};
	window.wp.autosave = autosave();

}( jquery, window ));




