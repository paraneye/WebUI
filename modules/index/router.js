/*
 * Wirtten by hitapia(sbang)
 * Role : Project Router
 */
var app = app || {};
(function($) {
	var mainrouter = Element.Router.extend({
		routes: {
			'' : 'projectlist',
			'create' : 'projectcreate',
			'modify/:projectid' : 'projectcreate',
			'hrlist/:projectid' : 'hrlist',
			'hrlist/:projectid?*conditions' : 'hrlist',
			'member/:projectid' : 'memberlist',
			'member/:projectid?*conditions' : 'memberlist',
			'hrimporthistory/:projectid' : 'hrimporthistory',
			'hrimporthistory/:projectid?*condition' : 'hrimporthistory',
			'schedit/:projectId' : 'schedit'
		},
		memberlist : function(param){
			this.switchview(new app.memberlist({ 
				model : new app.members(), 
				query : this.options(condition),
				Id : param 
			}));
		},
		hrimporthistory : function(param, condition){
			this.switchview(new app.importhistory({ 
				model : new app.importhistory(), 
				query : this.options(condition),
				Id : param 
			}));
		},
		projectcreate : function(param){
			this.switchview(new app.projectcreate( { model : new app.projectdetail(),Id : param } ));
		},
		hrlist : function(param, condition){
			this.switchview(new app.hrlistview({ 
				query : this.options(condition),
				Id : param 
			}));
		},
		projectlist : function(){
			this.switchview(new app.projectlist());
		},
		schedit : function(param){
			this.switchview(new app.schedit({ 
				model : new app.projectschedule({ Id : param }) 
			}));
		},
		baserender : function(){
		}
	});

	app.router = new mainrouter();
	Backbone.history.start();
})(jQuery);
