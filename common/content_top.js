/*
Written by hitapia(sbang)
Role : main index js
*/
var app = app || {};
(function($){
	app.content_top = Element.View.extend({
		className : "title_wrap",
		template : app.config.tpl.contenttop,
		render : function(){
			var self = this;
			app.TemplateManager.get(this.template, function(template){
				$(self.el).html($(template));
				var title = app.config.title;
				if(ThisViewPage.pages != undefined){
					var i = 0;
					if(ThisViewPage.pages.length > 1){
						_.each(ThisViewPage.pages, function(p){
							var nav = "";
							i++;
							if(p == "PROJECT"){
								nav = "<li>"+app.loggeduser.CurrentProjectName+"<em></em></li>";
							}else{
								nav = "<li>"+p+((i < ThisViewPage.pages.length) ? "<em></em>" : "") + "</li>";
							}
							$("#navtop").append(nav);
						});
					}
					title = ThisViewPage.pages[ThisViewPage.pages.length - 1];
				}else{
					$("#navtop li").remove();
				}
				$(".title_wrap h2").html(title);
				document.title = title + " - " + app.config.title;
			});
			return this;
		}
	});
})(jQuery);
