/*
 * Wirtten by hitapia(sbang)
 */
var app = app || {};
(function($){
	app.test = Element.Model.extend({
		url : "",
		defaults : { Id : "", Name : "", Value : "" },
		initialize : function(){
			if(app.config.debug)
				this.url = "/modules/_test/data/test.js";
		}
	});
	app.tests = Element.Collection.extend({
		model : app.test,
		url : "",
		initialize : function(){
			if(app.config.debug)
				this.url = "/modules/_test/data/tests.js";
		}
	});
})(jQuery);

