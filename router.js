/*
 * Wirtten by hitapia(sbang)
 * Role : Main Folder Router
 */
var app = app || {};
(function($) {
	var mainrouter = Element.Router.extend({
		routes: {
			'' : 'index',
			'login' : 'login',
			'logout' : 'logout',
			'forgotpassword' : 'forgotpassword',
			'updatepassword' : 'updatepassword',
			'dev' : 'dev'
		},
		updatepassword : function(){
			this.switchview(new app.updatepassword());
		},
		forgotpassword : function(){
			this.switchview(new app.forgotpassword());
		},
		login : function(){
			this.switchview(new app.login());
		},
		dev : function(){
			this.switchview(new app.indexdev());
		},
		index : function(){
			if(app.loggeduser.Id){
				Element.Tools.GoLink("Global Setting", app.config.path + "/modules/global/");
			}else{
				this.login();
			}
		},
		baserender : function(){
		}
	});

	app.router = new mainrouter();
	Backbone.history.start();
})(jQuery);
