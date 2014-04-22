/*
 * Wirtten by hitapia(sbang)
 * Role : Project Router
 */
var app = app || {};
(function($) {
	var mainrouter = Element.Router.extend({
		routes: {
			'' : 'admintool'
		},

		admintool: function (condition) {
		    this.switchview(new app.adminview());
		},

		baserender : function(){
		}
	});

	app.router = new mainrouter();
	Backbone.history.start();
})(jQuery);
