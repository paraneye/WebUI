/*
Written by hitapia
Role : costcode list
*/
var app = app || {};
(function($){
	app.costcodeimportlist = Element.View.extend({		
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/global/tpl/tpl_costcodelistview.html", function(template){
				$(self.el).html($(template));

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class : "primary", Id : "btnAdd", Name : "Add New" },
						{ Id : "btnImportList", Name : "Import File" },
						{ Id : "btnImportHistory", Name : "Import History" },
						{ class : "warning", Id : "btnDelete", Name : "Delete" }
					]
				}).render().el);

				$(self.el).find("#controls").html(new app.component.SearchControl({
					options : [
						{ Value : "CostCodeID", Name : "CostCodeId" },
						{ Value : "Description", Name : "Description" }
					],
					query : self.options.query      
				}).render().el);
				
				self.renderlist();
				
				$(self.el).find("#btnAdd").on("click",function(e){	
					e.preventDefault();
					app.component.Modal.show(new app.costcodecreate({ model : new app.costcode() }), 600);
				});

			});
            return this;
		},
		renderlist : function(){
			$(this.el).find("#list").html(new app.component.Tablelist({
				list : "../../modules/global/tpl/tpl_costcodelist.html",
				listitem : "../../modules/global/tpl/tpl_costcodelistitem.html",
				coll : "new app.costcodes()",
				query : this.options.query      
			}).render().el);
		}
	});
})(jQuery);
