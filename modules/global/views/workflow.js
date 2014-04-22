/*
Written by hitapia(sbang)
Role : member list
*/
var app = app || {};
(function($){
	app.workflowview = Element.View.extend({		
		pages : ["Global Settings", "Workflows"],
		render : function(){		
			var self = this;
			app.TemplateManager.get("../../modules/global/tpl/tpl_workflow.html", function(template){
				$(self.el).html($(template));

				/*
				$(self.el).find("#btnAdd").on("click", function(e){
					e.preventDefault();
					app.component.Modal.show(new app.memberadd({ model : new app.member() }), 600);
                });
				*/

			});
            return this;
		},
		link : function(key){
		}
	});
})(jQuery);
