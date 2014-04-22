
var app = app || {};
(function($) {
	var mainrouter = Element.Router.extend({
		routes: {
			'' : 'globalhome',
			'drawings' : 'drawingviewer',
			'drawings?*condition' : 'drawingviewer',
			'materiallist' : 'materiallist',
			'materiallist?*condition' : 'materiallist',
			'materialcreate' : 'materialcreate',
			'materialimportlist?*condition' : 'materialimportlist',
			'materialimportlist': 'materialimportlist',
			'consumablemateriallist': 'consumablemateriallist',
			'consumablemateriallist?*condition': 'consumablemateriallist',
			'consumablematerialcreate': 'consumablematerialcreate',
			'consumablematerialimportlist?*condition': 'consumablematerialimportlist',
			'consumablematerialimportlist': 'consumablematerialimportlist',
			'taskcategory' : 'taskcategory',
			'equipmentcreate' : 'equipmentcreate',
			'equipmentlist' : 'equipmentlist',
			'equipmentlist?*condition' : 'equipmentlist',
			'equipmentimportlist?*condition' : 'equipmentimportlist',
			'equipmentimportlist' : 'equipmentimportlist',
			'progresstypecreate' : 'progresstypecreate',
			'progresstypelist' : 'progresstypelist',
			'progresstypelist?*condition' : 'progresstypelist',
			'drawingtypecreate' : 'drawingtypecreate',
			'drawingtypelist' : 'drawingtypelist',
			'drawingtypelist?*condition' : 'drawingtypelist',
			'drawingtypeimportlist?*condition' : 'drawingtypeimportlist',
			'drawingtypeimportlist' : 'drawingtypeimportlist',
			'assigncostcodecreate' : 'assigncostcodecreate',
			'assigncostcodelist' : 'assigncostcodelist',
			'assigncostcodelist?*condition' : 'assigncostcodelist',
			'importmtolist' : 'importmtolist',
			'importmtolist?*condition' : 'importmtolist',
			'mtoimportlist?*condition' : 'mtoimportlist',
			'mtoimportlist' : 'mtoimportlist',
			'managedrawinglist' : 'managedrawinglist',
			'managedrawinglist?*condition' : 'managedrawinglist',
			'managedrawingimportlist' : 'managedrawingimportlist',
			'managedrawingimportlist?*condition' : 'managedrawingimportlist',
			'mtoview?*condition' : 'mtoview',
			'mtoview' : 'mtoview',
			'iwpviewerlist' : 'iwpviewerlist',
			'iwpviewerlist?*condition' : 'iwpviewerlist'
		},
		drawingviewer : function(condition){
			this.switchview(new app.drawingviewer({ query : this.options(condition) }));
		},	
		taskcategory : function(){
			this.switchview(new app.taskcategorytree());
		},		
		materialcreate : function(){
			this.switchview(new app.materialcreate({ model : new app.material() }));
		},		
		materiallist : function(condition){
			this.switchview(new app.materiallistview({ query : this.options(condition) }));
		},	
		materialimportlist : function(condition){
			this.switchview(new app.importhistory({ 
				kind : "MaterialLibrary", 
				pages : ["Global Settings", "Library", "Materials", "Import History"],		
				query : this.options(condition) 
			}));
		},
		consumablematerialcreate: function () {
		    this.switchview(new app.consumablematerialcreate({ model: new app.material() }));
		},
		consumablemateriallist: function (condition) {
		    this.switchview(new app.consumablemateriallistview({ query: this.options(condition) }));
		},
		consumablematerialimportlist: function (condition) {
		    this.switchview(new app.importhistory({ 
				kind: "ConsumableLibrary", 
				pages : ["Global Settings", "Library", "Consumables", "Import History"],		
				query: this.options(condition) 
			}));
		},
		equipmentcreate : function(){
			this.switchview(new app.equipmentcreate({ model : new app.equipment() }));
		},		
		equipmentlist : function(condition){
			this.switchview(new app.equipmentlistview({ query : this.options(condition) }));
		},	
		equipmentimportlist : function(condition){
			this.switchview(new app.importhistory({ 
				kind : "EquipmentLibrary", 
				pages : ["Global Settings", "Library", "Equipment", "Import History"],		
				query : this.options(condition) 
			}));
		},	
		progresstypecreate : function(){
			this.switchview(new app.progresstypecreate({ model : new app.progresstype() }));
		},		
		progresstypelist : function(condition){
			this.switchview(new app.progresstypelistview({ query : this.options(condition) }));
		},	
		drawingtypecreate : function(){
			this.switchview(new app.drawingtypecreate({ model : new app.drawingtype() }));
		},		
		drawingtypelist : function(condition){
			this.switchview(new app.drawingtypelistview({ query : this.options(condition) }));
		},	
		drawingtypeimportlist : function(condition){
			this.switchview(new app.importhistory({ kind : "drawingtype", query : this.options(condition) }));
		},
		assigncostcodecreate : function(){
			this.switchview(new app.assigncostcodecreate({ model : new app.assigncostcode() }));
		},		
		assigncostcodelist : function(condition){
			this.switchview(new app.assigncostcodelistview({ query : this.options(condition) }));
		},
		importmtolist : function(condition){
			this.switchview(new app.importmtolistview({ query : this.options(condition) }));
		},		
		mtoimportlist : function(condition){
			this.switchview(new app.importhistory({ 
				kind : "mto", 
				pages : ["PROJECT", "Data", "Import MTO", "Import History"],
				query : this.options(condition) 
			}));
		},
		managedrawinglist : function(condition){
			this.switchview(new app.managedrawinglistview({ query : this.options(condition) }));
		},
		managedrawingimportlist : function(condition){
			this.switchview(new app.importhistory({ 
				kind : "drawing", 
				pages : ["PROJECT", "Data", "Drawings", "Import History"],
				query : this.options(condition) 
			}));
		},
		mtoview : function(condition){
			this.switchview(new app.mtoview({ model : new app.mto(), query : this.options(condition) }));
		},
		baserender : function(){
		},
		iwpviewerlist : function(condition){
			this.switchview(new app.iwpviewerlistview({ query : this.options(condition) }));
		}

	});

	app.router = new mainrouter();
	Backbone.history.start();
})(jQuery);
