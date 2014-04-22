
var app = app || {};
(function($){
	app.equipmentlistview = Element.View.extend({		
		pages : ["Global Settings", "Library", "Equipment"],	
		nowMainCate : "",
		nowSubCate : "",
		nowThirdLvl : "",
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/mto/tpl/tpl_equipmentlistview.html", function(template){
				$(self.el).html($(template));

				self.nowMainCate = self.options.query.EquipmentCodeMain || "";
				self.nowSubCate = self.options.query.EquipmentCodeSub || "";
				self.nowThirdLvl = self.options.query.ThirdLevel || "";

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class : "primary", Id : "btnAdd", Name : "Add New" },
						{ Id : "btnImportList", Name : "Import File" },
						{ Id : "btnImportHistory", Name : "Import History" },
						{ class : "warning", Id : "btnDelete", Name : "Delete" }
					]
				}).render().el);
				
				$(self.el).find("#list").html(new app.component.Tablelist({
					list : "../../modules/mto/tpl/tpl_equipmentlist.html",
					listitem : "../../modules/mto/tpl/tpl_equipmentlistitem.html",
					coll : "new app.equipmentlist()",
					query : self.options.query 
				}).render().el);
				
				
				//버튼이벤트
				$(self.el).find("#btnAdd").on("click",function(){				
					app.component.Modal.show(new app.equipmentcreate({ model : new app.equipment() }), 1000);
					//app.router.navigate("equipmentcreate", { trigger : true, model : new app.equipment() })
				});
				
				$(self.el).find("#btnImportList").on("click",function(e){	
					e.preventDefault();
					app.component.Modal.show(new app.importlist(
						{ 
							kind : "EquipmentLibrary", 
							downloadpath: app.config.docPath.template + app.config.downloads.equipmentlibrarytemplate
							, s: function (data) {  }
						}
					), 600);
				});

				$(self.el).find("#btnImportHistory").on("click",function(e){	
					e.preventDefault();
					app.router.navigate("equipmentimportlist", { trigger : true })
				});

				$(self.el).find("#btnSearch").on("click",function(e){
					self.renderlist();	
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
								
                                models.push(new app.equipment({ 
                                    EquipmentId : $(this).val(),
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
									window.location = "#equipmentlist"+q;
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
		link : function(num){
			app.component.Modal.show(
				new app.equipmentcreate({ model : new app.equipment( {EquipmentId : num}) }), 1000);

		},
		renderlist : function(){
			var self = this;
			var v_MainCategory=$(this.el).find(".divMainCategory option:selected").val();
			var v_SubCategory=$(this.el).find(".divSubCategory option:selected").val();
			var v_ThirdLevel=$(this.el).find(".divThirdLevel option:selected").val();

			self.options.query.EquipmentCodeMain=v_MainCategory || "";
			self.options.query.EquipmentCodeSub=v_SubCategory || "";
			self.options.query.ThirdLevel=v_ThirdLevel || "";

			var q = Element.Tools.QueryGen(self.options.query, "page", 1);
			window.location = "#equipmentlist"+q;
		},

		resetMainCate : function(){
			var self = this;	
			var combo = new app.component.Combo({
				url : new app.maincategorylist().url+"EQUIPMENT_CATEGORY",
				inline : true,
				selected : self.nowMainCate
			}).render().el;
			$(combo).on("change", function(){
				self.nowMainCate = $(this).val();
				self.resetSubCate();
				self.nowThirdLvl="";
				self.resetThirdLvl();

				self.renderlist();
			});
			$(this.el).find(".divMainCategory").html(combo);

		

		},

		resetSubCate : function(){
			var self = this;	
			var combo = "";
			if(self.nowMainCate == ""){
				combo = "<select class='form-control'><option value=''>ALL</option></select>";
				self.nowThirdLvl="";
				self.resetThirdLvl();
				
			}else{
					combo = new app.component.Combo({
						url : new app.subcategorylist().url + self.nowMainCate,
						inline : true,
						selected : self.nowSubCate
					}).render().el;
					$(combo).on("change", function(){
						self.nowSubCate = $(this).val();
						self.resetThirdLvl();
						self.renderlist();
					});
			}
			
			$(this.el).find(".divSubCategory").html(combo);
		},

		resetThirdLvl : function(){
			var self = this;	
			var combo = "";
			
			if(self.nowSubCate == ""){
				combo = "<select class='form-control'><option value=''>ALL</option></select>";
				
			}else{
					combo = new app.component.Combo({
						url : new app.thirdlevellist().url + self.nowSubCate,
						inline : true,
						selected : self.nowThirdLvl
					}).render().el;
					$(combo).on("change", function(){
						self.nowThirdLvl = $(this).val();
						self.renderlist();
					});
			}

			$(this.el).find(".divThirdLevel").html(combo);
		},

		renderscreen : function(){
			this.resetMainCate();
			this.resetSubCate();
			this.resetThirdLvl();
		}
	
		
	});
})(jQuery);
