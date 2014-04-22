/*
 * Wirtten by hitapia(sbang)
 */
var app = app || {};
(function($){	
	app.discipline = Element.Model.extend({
		url : "",
		defaults : {
			Id : "",
			Name : "",
			Value : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.url = "/modules/project/data/disciplines.js";
		}
	});
	app.disciplines = Element.Collection.extend({
		model : app.discipline,
		url : "",
		initialize : function(){
			this.url = "/modules/project/data/disciplines.js";
			if(app.config.debug)
				this.url = "/modules/project/data/disciplines.js";
		}
	});
	app.project = Element.Model.extend({
		url : "",
		defaults : {
			Id : "",
			Name : "",
			Value : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.url = "/modules/project/data/projects.js";
		}
	});
	app.projects = Element.Collection.extend({
		model : app.project,
		url : "",
		initialize : function(){
			if(app.config.debug)
				this.url = "/modules/project/data/projects.js";
		}
	});
	
})(jQuery);
