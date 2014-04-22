
var app = app || {};
(function($){
	app.materiallistview = Element.View.extend({
		pages : ["Global Settings", "Library", "Materials"],		
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/mto/tpl/tpl_materiallistview.html", function(template){
				$(self.el).html($(template));

				self.nowDic = self.options.query.DisciplineCode || "";
				self.nowCat = self.options.query.TaskCategoryId || "";
				self.nowType = self.options.query.TaskTypeId || "";

				$(self.el).find("#list").html(new app.component.Tablelist({
					list : "../../modules/mto/tpl/tpl_materiallist.html",
					listitem : "../../modules/mto/tpl/tpl_materiallistitem.html",
					coll : "new app.materiallist()",
					query : self.options.query 
				}).render().el);

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class : "primary", Id : "btnAdd", Name : "Add New" },						
						{ Id : "btnImportList", Name : "Import File" },
						{ Id : "btnImportHistory", Name : "Import History" },
						{  class : "warning", Id : "btnDelete", Name : "Delete" }
						
					]
				}).render().el);
				
				self.setevent();				
				self.renderscreen();

			});
            return this;
		},
		setevent : function(){
			var self = this;

				$(self.el).find("#btnAdd").on("click",function(e){
					e.preventDefault();				
					app.component.Modal.show(new app.materialcreate({ model : new app.material() }), 1000);
				});
				
				$(self.el).find("#btnImportList").on("click",function(e){	
					e.preventDefault();
					app.component.Modal.show(new app.importlist(
						{ 
							kind : "MeterialLibrary", 
							downloadpath: app.config.docPath.template + app.config.downloads.meteriallibrarytemplate
							, s: function (data) {  } 
						}
					), 600);
				});

				$(self.el).find("#btnImportHistory").on("click",function(e){	
					e.preventDefault();
					app.router.navigate("materialimportlist", { trigger : true })
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
                                models.push(new app.material({ 
                                    MaterialId : Number($(this).val()),
                                    SigmaOperation : "D",
									CostCodeId : 0
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
									window.location = "#materiallist"+q;
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

		},
		link : function(num){
			app.component.Modal.show(
				new app.materialcreate({ model : new app.material( {MaterialId : num}), componentcount : arguments[1] }), 1000);

		},
		renderlist : function(){
			var self = this;
			var v_discipline=$(this.el).find(".divDiscipline option:selected").val();
			var v_taskcategory=$(this.el).find(".divTaskCategory option:selected").val();
			var v_tasktype=$(this.el).find(".divTaskType option:selected").val();
			var param ="";
			
			self.options.query.IsConsumable = "N";
			self.options.query.DisciplineCode = v_discipline || "";
			self.options.query.TaskCategoryId = v_taskcategory || "";
			self.options.query.TaskTypeId = v_tasktype || "";
			
			var q = Element.Tools.QueryGen(self.options.query, "page", 1);
			window.location = "#materiallist"+q;
		},

		nowDic : "",
		nowCat : "",
		nowType : "",

		resetDic : function(){
			var self = this;	
			var cboDisc = new app.component.Combo({
				url : new app.disciplines().url,
				inline : true,
				selected : self.nowDic
			}).render().el;
			$(cboDisc).on("change", function(){
				self.nowDic = $(this).val();
				self.resetCat();
				self.nowCat="";
				self.resetType();

				self.renderlist();
			});
			$(this.el).find(".divDiscipline").html(cboDisc);
		},

		resetCat : function(){
			var self = this;	
			var cboCat = "";
			if(self.nowDic == ""){
				cboCat = "<select class='form-control'><option value=''>ALL</option></select>";
				self.nowCat="";
				self.resetType();
				
			}else{
					cboCat = new app.component.Combo({
						url : new app.taskcategorylist().url + self.nowDic,
						inline : true,
						selected : self.nowCat
					}).render().el;
					$(cboCat).on("change", function(){
						self.nowCat = $(this).val();
						self.resetType();
							
						self.renderlist();
					});
			}
			
			$(this.el).find(".divTaskCategory").html(cboCat);
		},

		resetType : function(){
			var self = this;	
			var cboType = "";
			
			if(self.nowCat == ""){
				cboType = "<select class='form-control'><option value=''>ALL</option></select>";
				
			}else{
					
					cboType = new app.component.Combo({
						url : new app.tasktypelist().url + self.nowCat,
						inline : true,
						selected : self.nowType
					}).render().el;
					$(cboType).on("change", function(){
						self.nowType = $(this).val();
						self.renderlist();
					});
			}
			$(this.el).find(".divTaskType").html(cboType);
		},
		renderscreen : function(){
			this.resetDic();
			this.resetCat();
			this.resetType();
		},
	});
})(jQuery);
