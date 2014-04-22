/*
Written by hitapia(sbang)
Role : project list
*/
var app = app || {};
(function($){
	app.schedit = Element.View.extend({
        events : { 
			"click #importp6sch" : "importp6sch",
			"click #deletesch" : "deletesch"
		},
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/project/tpl/tpl_schedit.html", function(template){
				$(self.el).html($(template));
				btns = new app.component.ButtonGroup({
					buttons : [
						{ class : "default", Id : "importp6sch", Name : "Import P6 Schedule" },
						{ class : "warning", Id : "deletesch", Name : "Delete Schedule" }
					]
				});
				$("#buttons").html(btns.render().el);
				$("#list").html(new app.schelist().render().el);
			});
            return this;
		},
        importp6sch : function(){
        },
        deletesch : function(){
        }
	});
	app.schelist = Element.View.extend({
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/project/tpl/tpl_schlist.html", function(tpl){
				$(self.el).html($(tpl));
			});
            return this;
		}
	});
	app.schelistitem = Element.View.extend({
		render : function(){
			app.TemplateManager.get("../../modules/project/tpl/tpl_schlistitem.html", function(template){
				
			});
            return this;
		}
	});
})(jQuery);
