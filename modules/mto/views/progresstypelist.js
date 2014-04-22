var app = app || {};
(function($){
	app.progresstypelistview = Element.View.extend({		
		pages : ["Global Settings", "Common Codes", "Progress Types"],	
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/mto/tpl/tpl_progresstypelistview.html", function(template){
				$(self.el).html($(template));

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class : "primary", Id : "btnAdd", Name : "Add New" },
						{ class : "warning", Id : "btnDelete", Name : "Delete" }
					]
				}).render().el);
				
				self.renderlist();				
				self.setevent();	
				self.renderscreen();

			});
            return this;
		},
		link : function(num){
			app.component.Modal.show(
				new app.progresstypecreate({ model : new app.progresstype( {ProgressTypeId : num}) }), 600);

		},
		renderlist : function(){
			var self = this;
			$(self.el).find("#list").html(new app.component.Tablelist({
					list : "../../modules/mto/tpl/tpl_progresstypelist.html",
					listitem : "../../modules/mto/tpl/tpl_progresstypelistitem.html",
					coll : "new app.progresstypelist()",
					query : self.options.query 
					
				}).render().el);

		},
		renderscreen : function(){	
			
		},
		setevent : function(){
			var self = this;

				$(self.el).find("#btnAdd").on("click",function(e){
					e.preventDefault();				
					app.component.Modal.show(new app.progresstypecreate({ model : new app.progresstype() }), 600);
					//app.router.navigate("progresstypecreate", { trigger : true, model : new app.progresstype() })
				});
				
				$(self.el).find("#btnImportList").on("click",function(e){	
					e.preventDefault();
					app.component.Modal.show(new app.importlist(
						{ kind : "progresstype", downloadpath : "" }
					), 600);
				});

				$(self.el).find("#btnImportHistory").on("click",function(e){	
					e.preventDefault();
					app.router.navigate("progresstypeimportlist", { trigger : true })
				});

			
				$(self.el).find("#btnDelete").on("click",function(e){	
					e.preventDefault();
					if(!Element.Tools.ValidateCheck($(self.el).find("#list")))  
        			return;

					app.component.Confirm.show(
						{ COMMENT : "Are you sure you want to delete the selected item(s)?", POS : "OK", NAG : "Cancel" },
						function(){
							var models = [];
                            $(self.el).find("input[name=key]:checked").each(function() {
						
                                models.push(new app.progresstype({ 
                                    ProgressTypeId : $(this).val(),
                                    SigmaOperation : "D"
                                })); 
							});
							if(models.length == 0){
								app.component.Confirm.close();
								return false;
							}
							Element.Tools.Multi(
								models[0].urlRoot + "/Multi",
								models,
								$(self.el), {
								s : function(m, r){								
									var q = Element.Tools.QueryGen(self.options.query, "page", 1);
									window.location = "#progresstypelist"+q;
									app.component.Confirm.close();
								},
								e : function(m, e){
								
									self.render();
									app.component.Confirm.close();
								}
							});
						},
						function(){ }
					);
				});

		}
		
	});
})(jQuery);
