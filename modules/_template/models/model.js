/*
 * Wirtten by hitapia(sbang)
 */
var app = app || {};
(function($){
	app.project = Element.Model.extend({
		url : "",
		defaults : {
			Id : "",
			Name : "",
			Value : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.url = "/modules/project/data/data.js";
		}
	});
	app.projects = Element.Collection.extend({
		model : app.project,
		url : "",
		initialize : function(){
			if(app.config.debug)
				this.url = "/modules/project/data/datas.js";
		}
	});
})(jQuery);
