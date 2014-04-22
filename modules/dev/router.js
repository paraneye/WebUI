/*
 * Wirtten by hitapia(sbang)
 * Role : Project Router
 */
var app = app || {};
(function($) {
	var mainrouter = Element.Router.extend({
		routes: {
			'' : 'devtool'
		},
		devtool: function (condition) {
		    this.switchview(new app.devview(), true);
		},
		baserender : function(){
		}
	});

	app.router = new mainrouter();
	Backbone.history.start();
})(jQuery);
