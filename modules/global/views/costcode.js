/*
Written by hitapia
Role : costcode list
*/
var app = app || {};
(function($){
	app.costcodelistview = Element.View.extend({		
		pages : ["Global Settings", "Common Codes", "Cost Codes"],
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
						{ Value : "CostCode", Name : "CostCode" },
						{ Value : "Description", Name : "Description" }
					],
					query : self.options.query      
				}).render().el);
				
				self.renderlist();
				
				$(self.el).find("#btnAdd").on("click",function(e){	
					e.preventDefault();
					app.component.Modal.show(new app.costcodecreate({ model : new app.costcode() }), 600);
				});

				$(self.el).find("#btnImportList").on("click",function(e){	
					e.preventDefault();
					app.component.Modal.show(new app.importlist(
						{
						    kind: "CostCode",
						    downloadpath: app.config.docPath.template + app.config.downloads.costcodetemplate
                            , s: function (data) {  }
						}
					), 600);
				});

				$(self.el).find("#btnImportHistory").on("click",function(e){	
					e.preventDefault();
					app.router.navigate("costcodeimportlist", { trigger : true });
				});

				$(self.el).find("#btnDelete").on("click",function(e){	
				    e.preventDefault();
				    if (!Element.Tools.ValidateCheck($(self.el).find("#list")))
				        return;
					app.component.Confirm.show(
						{ COMMENT : "Are you sure you want to delete the selected item(s)?", POS : "OK", NAG : "Cancel" },
						function(){
							var models = [];
                            $(self.el).find("input[name=key]:checked").each(function() {
                                models.push(new app.costcode({ 
                                    CostCodeId : $(this).val(),
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
									window.location = "#costcodelist"+q;
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

			});
            return this;
		},
		link : function(key){
			app.component.Modal.show(new app.costcodecreate({ model : new app.costcode( { CostCodeId : key} ) }), 600);
		},
		renderlist : function(){
			L(this.options.query);
			$(this.el).find("#list").html(new app.component.Tablelist({
				list : "../../modules/global/tpl/tpl_costcodelist.html",
				listitem : "../../modules/global/tpl/tpl_costcodelistitem.html",
				coll : "new app.costcodes()",
				query : this.options.query      
			}).render().el);
		}
	});
	app.costcodecreate = Element.View.extend({		
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/global/tpl/tpl_costcodeadd.html", function(template){
				if(self.model.get("CostCodeId")){
					var url = self.model.urlRoot + "/" + self.model.get("CostCodeId");
					self.model.url = url;
					self.model.fetch({
						success : function(){
							$(self.el).html(_.template(template, self.model.toJSON()));
                            $(self.el).find("h2").html("Edit Cost Code");
							self.setevent();
						},
						error : function(model, error){
							L(error);
						}
					});
				}else{
					$(self.el).html(_.template(template, self.model.toJSON()));
					self.setevent();
				}
			});
            return this;
		},
		setevent : function(){
			var self = this;
			$(this.el).find("#btnSave").on("click",function(e){
			    e.preventDefault();
			    if (!Element.Tools.Validate($(self.el).find("form")))
			        return;
				self.model.set({
					CostCode : $(self.el).find("#txtCostCode").val(),
					Description : $(self.el).find("#txtDescription").val(),
					CostCodeType : ($(self.el).find("#chkdirect").is(":checked")) ? "Y" : "N"
				});
				self.model.apply($(self.el),
					(self.model.get("CostCodeId") != "") ? "PUT" : "POST", {
					s : function(m, r){
						ThisViewPage.render();
						app.component.Modal.close();
					},
					e : function(m, e){
						ThisViewPage.render();
					}
				});
			});
	
			$(this.el).find("#btnCancel").on("click",function(e){
				app.component.Modal.close();
			});
		}
	});
})(jQuery);
