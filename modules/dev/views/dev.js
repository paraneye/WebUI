var app = app || {};
(function($){
	app.devview = Element.View.extend({
        events : { "click #deptodev" : "deptodev" },
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/dev/tpl/tpl_devhome.html", function(tpl){
				$(self.el).html($(tpl));
			});
            return this;
		},
        deptodev : function(){
            var self = this;
            $(self.el).find("#deptodev").attr("disabled", true);
            app.component.Call("/Common/Common.svc/rest/DEV_DEPTODEV", "POST", "",
                function(d){
                    $(self.el).find("#deptodev").attr("disabled", false);
                }, null
            );
        }
	});
})(jQuery);
