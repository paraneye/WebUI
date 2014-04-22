/*
Written by hitapia(sbang)
Role : main index js
*/
var app = app || {};
(function($){
	app.subheader = Element.View.extend({
		tagName : "ul",
		template : app.config.tpl.subheader,
		render : function(){
			var self = this;
			app.TemplateManager.get(this.template, function(template){
				if(app.loggeduser.ProjectList != null){
					if(app.loggeduser.ProjectList.length > 0){
						$(self.el).find("#subheader").show();
					}else{
						$(self.el).find("#subheader").hide();
					}
				}else{
					$(self.el).find("#subheader").hide();
				}
			});
			return this;
		}
	});
})(jQuery);
