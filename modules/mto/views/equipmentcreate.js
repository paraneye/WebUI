
var app = app || {};
(function($){
	app.equipmentcreate = Element.View.extend({		
		render : function(){
			var self = this;			
			app.TemplateManager.get("../../modules/mto/tpl/tpl_equipmentcreate.html", function(template){
			
				//서비스연결시 적용
				if(self.model.get("EquipmentId")){
					var url = "/GlobalSettings/SigmaGlobalSettings.svc/rest/Equipments/" + self.model.get("EquipmentId");
					self.model.url = url;
					self.model.fetch({
							success : function(){
							$(self.el).html(_.template(template, self.model.toJSON()));
                            $(self.el).find("h2").html("Edit Equipment");
							self.renderscreen();
							self.setevent();
							
							if(self.model.get("EquipmentCodeMain") != "")	{
								self.nowMainCate = self.model.get("EquipmentCodeMain");
								self.resetSubCate();
							}
							if(self.model.get("EquipmentCodeSub") != "")	{
								self.nowSubCate = self.model.get("EquipmentCodeSub");
								self.resetThirdLvl();
							}

							self.userFieldRender();
							
						},
						error : function(model, error){
						}
					});
				}else{
					$(self.el).html(_.template(template, self.model.toJSON()));
					self.renderscreen();
					self.setevent();
				}
					
			});
            return this;
		},
		nowMainCate : "",
		nowSubCate : "",
		nowThirdLvl : "",
		userFieldList:"",
		userFieldRender : function(){
			var self = this;
		
			app.component.Call(
					app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/EquipmentCustomFieldsWithCustomField/"+self.model.get("EquipmentId"), 
					"GET",                                      
					"",                                         
					function(data){                             
						   	self.userFieldList = JSON.parse(data.JsonDataSet);
							var i =0;
							var tb = $(self.el).find("#field_sublist");
							_.each(self.userFieldList, function(item){
								var newline = $(self.newcustom(item));			
								tb.find("table > tbody:last").append(newline);
						
							
							});
					}, 
					null                                        
				);

		},
		resetMainCate : function(){
			var self = this;	
			var combo = new app.component.Combo({
				url : new app.maincategorylist().url+"EQUIPMENT_CATEGORY",
				inline : true,
				selname : "Select Category1",
				selected : self.model.get("EquipmentCodeMain")
			}).render().el;
			$(combo).on("change", function(){
				self.nowMainCate = $(this).val();
				self.resetSubCate();
				self.nowThirdLvl="";
				self.resetThirdLvl();


			});		
			
			$(self.el).find(".divMainCategory").html(combo);
  			$(self.el).find(".divMainCategory select").addClass("required");
			$(self.el).find(".divMainCategory select").attr("autofocus","true"); 
			

		},

		resetSubCate : function(){
			var self = this;	
			var combo = "";
			if(self.nowMainCate == ""){
				combo = "<select class='form-control'><option value=''>Select Category2</option></select>";
				self.nowThirdLvl="";
				self.resetThirdLvl();
				
			}else{
					
					combo = new app.component.Combo({
						url : new app.subcategorylist().url + self.nowMainCate,
						inline : true,
						selected : self.model.get("EquipmentCodeSub")
					}).render().el;
					$(combo).on("change", function(){
						self.nowSubCate = $(this).val();
						self.resetThirdLvl();
						
					});
			}
			
			$(self.el).find(".divSubCategory").html(combo);
			$(self.el).find(".divSubCategory select").addClass("required");
		},

		resetThirdLvl : function(){
			var self = this;	
			var combo = "";
			
			if(self.nowSubCate == ""){
				combo = "<select class='form-control'><option value=''>Select Category3</option></select>";
				
			}else{
					
					combo = new app.component.Combo({
						url : new app.thirdlevellist().url + self.nowSubCate,
						inline : true,
					 	selected : self.model.get("ThirdLevel")
					}).render().el;
					$(combo).on("change", function(){
						self.nowThirdLvl = $(this).val();
						

					});
			}

			$(self.el).find(".divThirdLevel").html(combo);
			
		},
		validationcheck : function(){
			var self = this;			
			var ret = true;
								
			
			$(self.el).find("#field_sublist tr").each(function() {
				
				$(this).find("input[type=text]").each(function(){
				
					if($(this).val() == ""){
						$(this).parent().removeClass("has-error").addClass("has-error");
						ret = false;
					}else{
						$(this).parent().removeClass("has-error");
					}
				});			

			});

			return ret;

		},
		delcustom : [],
		setevent : function(){
			var self = this;
			$(self.el).find("#field_subbuttons").html(new app.component.ButtonGroup({
				buttons : [
					{ Id : "btnFieldAdd", Name : "Add User Defined Field" },
					{ class : "warning" , Id : "btnFieldDelete", Name : "Delete" }
				]
			}).render().el);
				
			
			$(this.el).find("#btnFieldAdd").on("click", function(e){
                e.preventDefault(); 
                var tb = $(self.el).find("#field_sublist");
				var newline = $(self.newcustom(null));
			  
			   if(!self.validationcheck())
					return;

				tb.find("table > tbody:last").append(newline);
				
			});
			$(this.el).find("#btnFieldDelete").on("click", function(e){	
				e.preventDefault();	
				$(self.el).find("#field_sublist input[name=chkKey]:checked").each(function() {
					if($(this).val()!="" && $(this).val() != undefined){
						self.delcustom.push($(this).val());					
					}
					$(this).parent().parent().remove();
				});
				

			});
			$(this.el).find("#btnSave").on("click",function(e){
				e.preventDefault();
						
				if(!Element.Tools.Validate($(self.el).find("form"))) 
        			return;
				if(!self.validationcheck())
					return;

					var models_sub =[];				
					$(self.el).find("#field_sublist tr").each(function() {
					
						var title = $(this).find("input[name=txtTitle]").val();
						var chkKey = $(this).find("input[name=chkKey]").val();
						if(title !=undefined && title != ""){
							
							models_sub.push(new app.equipment_field({
								SigmaOperation : (chkKey != "" && chkKey != undefined) ? "U" : "C",
								CustomFieldId : (chkKey == "" || chkKey == undefined) ? 0 : Number(chkKey),
								FieldName : $(this).find("input[name=txtTitle]").val(),
								Value : $(this).find("input[name=txtValue]").val(),
								IsDisplayable : "Y",//($(this).find("input[name=chkVisible]")[0].checked==true) ? "Y" : "N",
								Parentid : (self.model.get("EquipmentId") != "") ? self.model.get("EquipmentId") : 0
							}).toJSON());
						}
					});
					_.each(self.delcustom, function(item){
						models_sub.push(new app.equipment_field({
						SigmaOperation : "D",
						CustomFieldId : item
						}).toJSON());
					})

					
					self.model.set({
						SigmaOperation : (self.model.get("EquipmentId") != "") ? "U" : "C",
						EquipmentCodeMain: $(self.el).find(".divMainCategory option:selected").val(),
						EquipmentCodeSub : $(self.el).find(".divSubCategory option:selected").val(),
						ThirdLevel : $(self.el).find(".divThirdLevel option:selected").val(),
						Spec : $(self.el).find("#txtDescription").val(),
						EquipmentType : $(self.el).find("#txtType").val(),
						ModelNumber : $(self.el).find("#txtModelNumber").val(),
						Description :  $(self.el).find("#txtDescription").val(),
						CustomField : models_sub
					});

					self.model.apply($(self.el),
						(self.model.get("EquipmentId") != "") ? "PUT" : "POST", {
						s : function(m, r){
							ThisViewPage.render();
							app.component.Modal.close();
						},
						e : function(m, e){
							app.component.Modal.close();
						}
					});

			});
	
			$(this.el).find("#btnCancel").on("click",function(e){
				e.preventDefault();
				app.component.Modal.close();
				//app.router.navigate("equipmentlist", { trigger : true });

			});

		},
		renderscreen : function(){
			var self = this;
			self.resetMainCate();
			self.resetSubCate();
			self.resetThirdLvl();
		},
		newcustom : function(item){
			var tr = "<tr>";

			if(item != null && item != undefined){
						tr += "<tr>";
					tr += "<td class='t_check'><input type='checkbox' name='chkKey' value="+item.CustomFieldId+" /></td>";
					tr += "<td><input type='text' class='form-control' name='txtTitle' maxlength='50' value='"+item.FieldName+"' /></td>";
					tr += "<td><input type='text' class='form-control' name='txtValue' maxlength='50' value='"+item.Value+"' /></td>";
					
					tr += "</tr>";

					
			}else{
					tr += "<tr>";
					tr += "<td class='t_check'><input type='checkbox' name='chkKey' value='' /></td>";
					tr += "<td><input type='text' class='form-control' name='txtTitle' maxlength='50' /></td>";
					tr += "<td><input type='text' class='form-control' name='txtValue' maxlength='50' /></td>";	
					tr += "</tr>";
			}
			return tr;
		}
		
		
	});
})(jQuery);

