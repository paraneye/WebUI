var app = app || {};
(function($){
	app.drawingtypelistview = Element.View.extend({		
		pages : ["Global Settings", "Common Codes", "Drawing Types"],	
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/mto/tpl/tpl_drawingtypelistview.html", function(template){
				$(self.el).html($(template));

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class : "primary", Id : "btnAdd", Name : "Add New" },
						{ class : "warning", Id : "btnDelete", Name : "Delete" }
					]
				}).render().el);
		
				self.options.query.s_option = "CodeCategory";
				self.options.query.s_key = "DRAWING_TYPE";

				$(self.el).find("#list").html(new app.component.Tablelist({
					list : "../../modules/mto/tpl/tpl_drawingtypelist.html",
					listitem : "../../modules/mto/tpl/tpl_drawingtypelistitem.html",
					coll : "new app.drawingtypemstlist()",
					query : self.options.query 
				}).render().el);

				$(self.el).find("#btnAdd").on("click",function(e){				
					
					e.preventDefault();
					app.component.Modal.show(new app.drawingtypecreate({ model: new app.drawingtypemst() }),600);
				});
				$(self.el).find("#btnImportList").on("click",function(e){	
					e.preventDefault();
					app.component.Modal.show(new app.importlist(
						{ kind : "DrawingType", downloadpath : "" }
					), 600);
				});

				$(self.el).find("#btnImportHistory").on("click",function(e){	
					e.preventDefault();
					app.router.navigate("drawingtypeimportlist", { trigger : true })
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
                                models.push(new app.drawingtypemst({ 
									Code : $(this).val(),
                                    SigmaOperation : "D",
									CodeCategory : "DRAWING_TYPE"
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
									window.location = "#drawingtypelist"+q;
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
				self.renderscreen();
			});
            return this;
		},
		renderscreen : function(){	
			
		},
		link : function(num){
			var arr = Array();
			arr = num.split("|");
			var v_code = arr[0];
			var v_codecategory = arr[1];
			
			app.component.Modal.show(
				new app.drawingtypecreate({ model : new app.drawingtypemst( {Code : v_code, CodeCategory: v_codecategory }) }), 600);

		},
		renderlist : function(){
			var self = this;

		}

	});
})(jQuery);
