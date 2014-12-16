

define(["backbone"], function(Backbone) {

	var DOMWidgetView = Backbone.View.extend({

		initialize : function($el, model) {
			this.$el = $el ;
			this.model = model ;

			console.log("view initialized") ;
		}

	}) ;

	var version = "2.3.0" ;

	return { DOMWidgetView : DOMWidgetView , version : version } ;

});