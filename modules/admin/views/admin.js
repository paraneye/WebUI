/*
Written by hitapia(sbang)
Role : project list
*/
var app = app || {};
(function($){
	app.adminview = Element.View.extend({
        events : { "click #create" : "create" },
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/project/tpl/tpl_adminhome.html", function(tpl){
				$(self.el).html($(tpl));

			});

            return this;
		},
        create : function(){
            //app.component.Modal.show(new app.projectcreate());
			app.router.navigate("projectcreate", { trigger : true })

        }
	});
})(jQuery);
