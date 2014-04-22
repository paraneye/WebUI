/*
Written by hitapia(sbang)
Role : unsignedheader js
*/
var app = app || {};
(function($){
	app.unsignedheader = Element.View.extend({
		className : "gnb_wrap",
		template : app.config.tpl.unsignedheader,
		render : function(){
			var self = this;
			L(this.template);
			app.TemplateManager.get(this.template, function(template){
				$(self.el).html(template);
			});
			return this;
		}
	});
})(jQuery);
