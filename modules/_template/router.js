/*
 * Wirtten by hitapia(sbang)
 * Role : Project Router
 */
var app = app || {};
(function($) {
	var mainrouter = Element.Router.extend({
		routes: {
		},
		projectlist : function(){
		}
	});

	app.router = new mainrouter();
	Backbone.history.start();
})(jQuery);
