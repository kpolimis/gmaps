
define(["backbone"], function(Backbone) {

	var register_widget_view = function(widget_view) {
	} ;


	var DOMWidgetView = Backbone.View.extend({

		initialize : function($el, model) {
			this.$el = $el ;
			this.model = model ;

			console.log("view initialized") ;
		}

	}) ;

    IPython.DOMWidgetView = DOMWidgetView ;

	return { register_widget_view : register_widget_view } ;
}
) ;
