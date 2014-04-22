
var app = app || {};
(function($){
	app.formlistview = Element.View.extend({		
		pages : ["PROJECT", "Document Control", "Form Library"],
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/project/tpl/tpl_formlistview.html", function(template){
				$(self.el).html($(template));

				self.options.query.FileCategory = "FILE_CATEGORY_FORM";
				self.options.query.FileTypeCode = self.options.query.FileTypeCode || "";

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class : "primary", Id : "btnAdd", Name : "Add New" },
						{ class : "warning", Id : "btnDelete", Name : "Delete" }
					//	{ Id : "btnEdit", Name : "Edit" }//확인용
					]
				}).render().el);

				$(self.el).find("#controls").append(new app.component.SearchControl({
					options : [
						{ Value : "Title", Name : "Title" },
						{ Value : "Description", Name : "Description" },
						{ Value : "UploadedBy", Name : "Modified by" }
					],
					query : self.options.query      
				}).render().el);

				$(self.el).find("#list").html(new app.component.Tablelist({
					list : "../../modules/project/tpl/tpl_formlist.html",
					listitem : "../../modules/project/tpl/tpl_documentlistitem.html",
					coll : "new app.documentlist()",
					query : self.options.query      
				}).render().el);
				self.renderscreen();
				self.setevent();

			});
            return this;
		},
		renderlist : function(){
			var self = this;
			var type =$(self.el).find("#cboType option:selected").val();

			self.options.query.FileCategory = "FILE_CATEGORY_FORM";
			self.options.query.FileTypeCode = type || "";
			var q = Element.Tools.QueryGen(self.options.query, "page", 1);
			window.location = "#formlist"+q;
		},
		renderscreen : function(){
			var self = this;

			$(self.el).find("#cboType option").remove();
			$(self.el).find("#cboType").append("<option value=''>ALL</option>");
			app.component.Call("/GlobalSettings/SigmaGlobalSettings.svc/rest/FileType/FORM_TYPE","GET","",
				function(d){
					_.each(JSON.parse(d.JsonDataSet), function(item){
						var sl = (self.options.query.FileTypeCode == item.Code) ? " selected " : "";
						$(self.el).find("#cboType")
							.append("<option value='"+item.Code+"' "+sl+">"+item.CodeName+"</option>");
					});
					$(self.el).find("#controls select").css("margin-right","30px");
					$(self.el).find("#controls form").prepend($(self.el).find("#searchcontrol"));
					$(self.el).find("#controls form").addClass("form-horizontal");
					$(self.el).find("#controls form").css("margin-right","15px");
					$(self.el).find("#searchcontrol").attr("style","display:'';margin-right:17px;");
				},null
			);
			$(self.el).find("#cboType").on("change", function(){
				self.renderlist();
			});
		},
		link : function(num){
			app.component.Modal.show(
				new app.formedit({ model : new app.document( {FileStoreId : num}) }), 600);

		},
		setevent : function(){
			var self = this;

				$(self.el).find("#btnAdd").on("click",function(e){	
					e.preventDefault();
					app.component.Modal.show(new app.formcreate({ model : new app.document() }), 600);
					
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
								
                                models.push(new app.document({ 
                                    FileStoreId : Number($(this).val()),
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
									window.location = "#formlist"+q;
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
var formlistview = app.formlistview;

