/*
Written by hitapia(sbang)
Role : main index js
*/
var app = app || {};
(function($){
	app.projectlistitem = Element.View.extend({
		tagName : "a",
		className : "list-group-item",
		template : _.template($("#tpl_projectlistitem").html()),
		render : function(){
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		}
	});
})(jQuery);
