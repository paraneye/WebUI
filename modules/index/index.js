/*
Written by hitapia(sbang)
Role : main index js
*/
var app = app || {};
(function($){
	app.indexmain = Element.View.extend({
		render : function(){
			$(this.el).html("test");
			return this;
		}
	});
})(jQuery);
