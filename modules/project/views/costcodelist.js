
var app = app || {};
(function($){
	app.costcodelistview = Element.View.extend({		
		pages : ["PROJECT", "Settings", "Cost Codes Estimates"],
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/project/tpl/tpl_costcodelistview.html", function(template){
				$(self.el).html($(template));

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ Id : "btnImportList", Name : "Import File" },
						{ Id : "btnImportHistory", Name : "Import History" }
					]
				}).render().el);

				$(self.el).find("#controls").html(new app.component.SearchControl({
					options : [
						{ Value : "CostCode", Name : "Cost Code" },
						{ Value : "Description", Name : "Description" }
					],
					query : self.options.query      
				}).render().el);

				self.renderlist();
								
				$(self.el).find("#btnImportList").on("click",function(e){	
                    e.preventDefault();
                    app.component.Modal.show(new app.importlist(
                        { 
							kind : "ProjectCostCode", 
							downloadpath: app.config.docPath.template + app.config.downloads.projectcostcodetemplate
						}
                    ), 600);
				});
								
				$(self.el).find("#btnImportHistory").on("click",function(e){	
					e.preventDefault();
                    app.router.navigate("costcodelist/importhistorylist", { trigger : true });
				});

			});
            return this;
		},
		link: function (num) {
		    L(num);
			app.component.Modal.show(new app.costcodecreate({ 
				model : new app.projectcostcode({ CostCode : num }) 
			}), 600);
		},
		renderlist: function () {
		    var self = this;
	        $(self.el).find("#list").html(new app.component.Tablelist({
	            list: "../../modules/project/tpl/tpl_costcodelist.html",
	            listitem: "../../modules/project/tpl/tpl_costcodelistitem.html",
	            coll: "new app.projectcostcodes()",
	            query: self.options.query
	        }).render().el);
	    }
	});
})(jQuery);
