/*
 * Wirtten by hitapia(sbang)
 * Role : Project Router
 */
var app = app || {};
(function($) {
	var mainrouter = Element.Router.extend({
		routes: {
			'' : 'projectlist',
			'projectlist' : 'projectlist', 
			'projectcreate' : 'projectcreate',
			'project' : 'projecthome',
			'project?*condition' : 'projecthome',
			'infomation' : 'infomation',
			'hrlist' : 'hrlist',
			'hrlist?*conditions' : 'hrlist',
			'hr/importhistorylist?*condition' : 'hrimportlist',
			'hr/importhistorylist' : 'hrimportlist',
			'hrimportfile' : 'hrimportfile',
			'hr/hrcreate' : 'hrcreate',
			'members' : 'memberlist',
			'members?*conditions' : 'memberlist',
			'hrimporthistory' : 'hrimporthistory',
			'hrimporthistory?*condition' : 'hrimporthistory',
			'schedit' : 'schedit',
			'costcodelist' : 'costcodelist',
			'costcodelist?*condition' : 'costcodelist',
			'costcodelist/importhistorylist?*condition' : 'costcodeimportlist',
			'costcodelist/importhistorylist': 'costcodeimportlist',
			'clientcostcodeimporthistory?*condition': 'clientcostcodeimportlist',
			'clientcostcodeimporthistory': 'clientcostcodeimportlist',
			'costcodemap' : 'costcodemap',
			'costcodemaplist' : 'costcodemaplist',
			'costcodemaplist?*condition' : 'costcodemaplist',
			'cwacwplist' : 'cwacwplist',
			'cwacwplist?*condition' : 'cwacwplist',
			'documentlist' : 'documentlist',
			'documentlist?*condition' : 'documentlist',
			'documentcreate' : 'documentcreate',
			'formlist' : 'formlist',
			'formlist?*condition' : 'formlist',
			'reportlist' : 'reportlist',
			'reportlist?*condition': 'reportlist',
			'importedschedulelist': 'importedschedulelist',
			'importedschedulelist?*condition': 'importedschedulelist',
			'rolehierarchy': 'rolehierarchy'
		},
		costcodemap : function(){
			this.switchview(new app.costcodemap());
		},
		costcodeimportlist : function(condition){
			this.switchview(new app.importhistory({ 
                kind : "projectcostcode", 
				pages : ["PROJECT", "Settings", "Cost Codes Estimates", "Import History"],
                query : this.options(condition) 
            }));
		},
		clientcostcodeimportlist: function (condition) {
		    this.switchview(new app.importhistory({
		        kind: "clientcostcode",
		        query: this.options(condition)
		    }));
		},
		hrimportlist : function(param, condition){
			this.switchview(new app.importhistory({ 
                kind : "HR", 
				pages : ["PROJECT", "Settings", "Human Resources", "Import History"],
                query : this.options(condition) 
            }));
		},
		hrimportfile : function(param){
		},
		memberlist: function (condition) {
			this.switchview(new app.memberlist({ 
				model : new app.members(), 
				query : this.options(condition)
			}));
		},
		hrimporthistory : function(param, condition){
			this.switchview(new app.importhistory({ 
				model : new app.importhistory(), 
				pages : ["PROJECT", "Settings", "Human Resources", "Import History"],
				query : this.options(condition)
			}));
		},
		projecthome : function(){
			this.switchview(new app.projecthome());
		},
		hrcreate : function(param){
			this.switchview(new app.hrcreate( { model : new app.hr() } ));
		},
		projectcreate : function(param){
			this.switchview(new app.projectcreate( { model : new app.project() } ));
		},
		infomation : function(param){			
			this.switchview(new app.projectinformation( { model : new app.project() }));
		},
		hrlist : function(condition){
			this.switchview(new app.hrlistview({ 
				query : this.options(condition)
			}));
		},
		projectlist : function(){
			this.switchview(new app.projectlist());
		},
		schedit : function(param){
			this.switchview(new app.schedit({ 
				model : new app.projectschedule() 
			}));
		},
		costcodelist : function(condition){
			this.switchview(new app.costcodelistview({ query : this.options(condition) }));
		},
		costcodeedit : function(param){
			this.switchview(new app.costcodecreate( { model : new app.costcode({CostCodeId : param}) } ));
		},
		costcodemaplist : function(condition){
			this.switchview(new app.costcodemaplistview({ query : this.options(condition) }));
		},
		cwacwplist : function(condition){
			this.switchview(new app.cwacwplistview({ query : this.options(condition) }));
		},
		documentlist : function(condition){
			this.switchview(new app.documentlistview({ query : this.options(condition) }));
		},
		documentcreate : function(param){
			this.switchview(new app.documentcreate( { model : new app.document() } ));
		},
		formlist : function(condition){
			this.switchview(new app.formlistview({ query : this.options(condition) }));
		},
		reportlist : function(condition){
			this.switchview(new app.reportlistview({ query : this.options(condition) }));
		},
        
		importedschedulelist: function (condition) {
		    this.switchview(new app.ImportedSchedulelistview({ query: this.options(condition) }));
		},

		rolehierarchy: function (condition) {
		    this.switchview(new app.rolehierarchytree());
		},


		baserender : function(){
		}
	});

	app.router = new mainrouter();
	Backbone.history.start();
})(jQuery);
