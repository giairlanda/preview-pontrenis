/**
 * @output wp-includes/js/customize-views.js
 */

(function( $, wp, _ ) {

	if ( ! wp || ! wp.customize ) { return; }
	var api = wp.customize;

	/**
	 * wp.customize.headertool.currentview
	 *
	 * displays the currently selected header image, or a placeholder in lack
	 * thereof.
	 *
	 * instantiate with model wp.customize.headertool.currentheader.
	 *
	 * @memberof wp.customize.headertool
	 * @alias wp.customize.headertool.currentview
	 *
	 * @constructor
	 * @augments wp.backbone.view
	 */
	api.headertool.currentview = wp.backbone.view.extend(/** @lends wp.customize.headertool.currentview.prototype */{
		template: wp.template('header-current'),

		initialize: function() {
			this.listento(this.model, 'change', this.render);
			this.render();
		},

		render: function() {
			this.$el.html(this.template(this.model.tojson()));
			this.setbuttons();
			return this;
		},

		setbuttons: function() {
			var elements = $('#customize-control-header_image .actions .remove');
			var addbutton = $('#customize-control-header_image .actions .new');

			if (this.model.get('choice')) {
				elements.show();
				addbutton.removeclass('upload-button');
			} else {
				elements.hide();
				addbutton.addclass('upload-button');
			}
		}
	});


	/**
	 * wp.customize.headertool.choiceview
	 *
	 * represents a choosable header image, be it user-uploaded,
	 * theme-suggested or a special randomize choice.
	 *
	 * takes a wp.customize.headertool.imagemodel.
	 *
	 * manually changes model wp.customize.headertool.currentheader via the
	 * `select` method.
	 *
	 * @memberof wp.customize.headertool
	 * @alias wp.customize.headertool.choiceview
	 *
	 * @constructor
	 * @augments wp.backbone.view
	 */
	api.headertool.choiceview = wp.backbone.view.extend(/** @lends wp.customize.headertool.choiceview.prototype */{
		template: wp.template('header-choice'),

		classname: 'header-view',

		events: {
			'click .choice,.random': 'select',
			'click .close': 'removeimage'
		},

		initialize: function() {
			var properties = [
				this.model.get('header').url,
				this.model.get('choice')
			];

			this.listento(this.model, 'change:selected', this.toggleselected);

			if (_.contains(properties, api.get().header_image)) {
				api.headertool.currentheader.set(this.extendedmodel());
			}
		},

		render: function() {
			this.$el.html(this.template(this.extendedmodel()));

			this.toggleselected();
			return this;
		},

		toggleselected: function() {
			this.$el.toggleclass('selected', this.model.get('selected'));
		},

		extendedmodel: function() {
			var c = this.model.get('collection');
			return _.extend(this.model.tojson(), {
				type: c.type
			});
		},

		select: function() {
			this.preventjump();
			this.model.save();
			api.headertool.currentheader.set(this.extendedmodel());
		},

		preventjump: function() {
			var container = $('.wp-full-overlay-sidebar-content'),
				scroll = container.scrolltop();

			_.defer(function() {
				container.scrolltop(scroll);
			});
		},

		removeimage: function(e) {
			e.stoppropagation();
			this.model.destroy();
			this.remove();
		}
	});


	/**
	 * wp.customize.headertool.choicelistview
	 *
	 * a container for choiceviews. these choices should be of one same type:
	 * user-uploaded headers or theme-defined ones.
	 *
	 * takes a wp.customize.headertool.choicelist.
	 *
	 * @memberof wp.customize.headertool
	 * @alias wp.customize.headertool.choicelistview
	 *
	 * @constructor
	 * @augments wp.backbone.view
	 */
	api.headertool.choicelistview = wp.backbone.view.extend(/** @lends wp.customize.headertool.choicelistview.prototype */{
		initialize: function() {
			this.listento(this.collection, 'add', this.addone);
			this.listento(this.collection, 'remove', this.render);
			this.listento(this.collection, 'sort', this.render);
			this.listento(this.collection, 'change', this.togglelist);
			this.render();
		},

		render: function() {
			this.$el.empty();
			this.collection.each(this.addone, this);
			this.togglelist();
		},

		addone: function(choice) {
			var view;
			choice.set({ collection: this.collection });
			view = new api.headertool.choiceview({ model: choice });
			this.$el.append(view.render().el);
		},

		togglelist: function() {
			var title = this.$el.parents().prev('.customize-control-title'),
				randombutton = this.$el.find('.random').parent();
			if (this.collection.shouldhidetitle()) {
				title.add(randombutton).hide();
			} else {
				title.add(randombutton).show();
			}
		}
	});


	/**
	 * wp.customize.headertool.combinedlist
	 *
	 * aggregates wp.customize.headertool.choicelist collections (or any
	 * backbone object, really) and acts as a bus to feed them events.
	 *
	 * @memberof wp.customize.headertool
	 * @alias wp.customize.headertool.combinedlist
	 *
	 * @constructor
	 * @augments wp.backbone.view
	 */
	api.headertool.combinedlist = wp.backbone.view.extend(/** @lends wp.customize.headertool.combinedlist.prototype */{
		initialize: function(collections) {
			this.collections = collections;
			this.on('all', this.propagate, this);
		},
		propagate: function(event, arg) {
			_.each(this.collections, function(collection) {
				collection.trigger(event, arg);
			});
		}
	});

})( jquery, window.wp, _ );








