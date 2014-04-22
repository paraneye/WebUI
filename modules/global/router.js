/*
 * Wirtten by hitapia(sbang)
 * Role : User Router
 */
var app = app || {};
(function($) {
	var mainrouter = Element.Router.extend({
		routes: {
			'' : 'globalhome',
			'workflows' : 'workflows',
			'userlist' : 'userlist',
			'userlist?*condition' : 'userlist',
			'userimportlist?*condition' : 'userimportlist',
			'userimportlist' : 'userimportlist',
			'costcodelist' : 'costcodelist',
			'costcodeedit/:id' : 'costcodeedit',
			'costcodelist?*condition' : 'costcodelist',
			'costcodeimportlist?*condition' : 'costcodeimportlist',
			'costcodeimportlist' : 'costcodeimportlist',
			'costcodeimportfile' : 'costcodeimportfile',
			'usercreate' : 'usercreate',
			'userprofile/:id' : 'userprofile',
			'home' : 'globalhome',
			'rolereport' : 'rolereport',
			'rolelist' : 'rolelist',
			'rolelist?*condition' : 'rolelist',
			'rolecreate' : 'rolecreate',			
			'roleedit/:id' : 'roleedit',			
			'companylist' : 'companylist',
			'companylist?*condition' : 'companylist',
			'companycreate' : 'companycreate',
			'companycreate/:id': 'companycreate',
			'sigmaloglist': 'sigmaloglist',
			'sigmaloglist?*condition': 'sigmaloglist',
			'sigmacodecategorylist': 'sigmacodecategorylist',
			'sigmacodecategorylist?*condition': 'sigmacodecategorylist',
            'sigmacodelist': 'sigmacodelist',
            'sigmacodelist?*condition': 'sigmacodelist',
            'sigmajoblist': 'sigmajoblist',
            'sigmajoblist?*condition': 'sigmajoblist'
		},
		workflows : function(){
		    this.switchview(new app.workflowview());
		},
		usercreate : function(){
			this.switchview(new app.usercreate({ model : new app.user() }));
		},
		userimportlist : function(condition){
			this.switchview(new app.importhistory({ 
				kind : "user", 
				pages : ["Global Settings", "Users", "Import History"],
				query : this.options(condition) }
			));
		},
		costcodeedit : function(param){
			app.component.Modal.show(new app.costcodecreate({ model : new app.costcode( { CostCodeId : param } ) }), 600);
		},
		costcodelist : function(condition){
			this.switchview(new app.costcodelistview({ query : this.options(condition) }));
		},
		costcodeimportlist : function(condition){
			this.switchview(new app.importhistory({ 
				kind : "costcode", 
				pages : ["Global Settings", "Common Codes", "Cost Codes", "Import History"],
				query : this.options(condition) 
			}));
		},
		costcodeimportfile : function(param){
		},
		userlist : function(condition){
			this.switchview(new app.userlistview({ query : this.options(condition) }));
		},
		userprofile : function(param){
			this.switchview(new app.userprofile({ model : new app.user({Id : param}) }));
		},
		globalhome : function(param){
			this.switchview(new app.globalhomeview());
		},
		rolelist : function(condition){
			this.switchview(new app.rolelistview({ query : this.options(condition) }));
		},
		rolecreate : function(){
			this.switchview(new app.rolecreate({ model : new app.roleinfo() }));
		},
		roleedit : function(param){
			L(param);
			this.switchview(new app.rolecreate({ model : new app.roleinfo({ SigmaRoleId : param }) }));
		},
		rolereport : function(param){
			this.switchview(new app.rolereport());
		},
		companylist : function(condition){
			this.switchview(new app.companylistview({ query : this.options(condition) }));
		},
		companycreate : function(param){
			app.component.Modal.show(new app.companycreate({ model : new app.company({Id : param}) }), 600);
		},
		baserender : function(){
		},
		sigmaloglist: function (condition) {
		    this.switchview(new app.SigmaLoglistview({ query: this.options(condition) }));
		},
		sigmacodecategorylist: function (condition) {
		    this.switchview(new app.SigmaCodeCategorylistview({ query: this.options(condition) }));
		},
		sigmacodelist: function (condition) {
		    this.switchview(new app.SigmaCodelistview({ query: this.options(condition) }));
		},
		sigmajoblist: function (condition) {
		    this.switchview(new app.SigmaJoblistview({ query: this.options(condition) }));
		}
	});

	app.router = new mainrouter();
	Backbone.history.start();
})(jQuery);
