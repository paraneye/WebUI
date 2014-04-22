
var app = app || {};
(function($){
	app.userprofile = Element.View.extend({		
		render : function(){	
			var self = this;			
			app.TemplateManager.get("../../modules/global/tpl/tpl_userprofile.html", function(template){
				L("app.loggeduser.Id:"+app.loggeduser.Id);
				if(app.loggeduser.Id != ""){
					var url = "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaUsers/" + app.loggeduser.Id;
					self.model.url = url;
					self.model.fetch({
							success : function(){
							$(self.el).html(_.template(template, self.model.toJSON()));                            
							self.renderscreen();
							self.setevent();
							
							self.userRoleRender();

						},
						error : function(model, error){
								Element.Tools.Error(error);
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
		rolelist: "",
		userRoleRender : function(){
			var self = this;
			$.ajax({
				type : "GET",
				url : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaUserSigmaRoles/"+app.loggeduser.Id,
				success : function(r){
					self.rolelist = JSON.parse(r.JsonDataSet);
					var i =0;
					var tb = $(self.el).find("#field_sublist");
					_.each(self.rolelist, function(item){
						var newline = $(self.newcustom(item));			
						tb.find("table > tbody:last").append(newline);
				
					
					});
				}
			});

		},
		
		renderscreen : function(){
			var self = this;

			if(self.model.get("PhotoUrl") == "" || self.model.get("PhotoUrl") == null){
				$(self.el).find(".img-thumbnail").hide();
			}else{
				$(self.el).find(".img-thumbnail").show();
			}
		},
		setevent : function(){
			var self = this;

		

			$(self.el).find("#btnCancel").on("click", function(e){
				e.preventDefault();
				app.component.Modal.close();
			});

			$(this.el).find("#btnSave").on("click",function(e){
				e.preventDefault();
							
					var models_sub =[];				
					$(self.el).find("#field_sublist tr").each(function() {
					
						var title = $(this).find("input[name=txtTitle]").val();
						var chkKey = $(this).find("input[name=chkKey]").val();
						if(title !=undefined && title != ""){
							
							models_sub.push(new app.material_field({
								SigmaOperation : (chkKey != "" && chkKey != undefined) ? "U" : "C",
								CustomFieldId : (chkKey=="" || chkKey==undefined) ? 0 : chkKey,
								FieldName : $(this).find("input[name=txtTitle]").val(),
								Value : $(this).find("input[name=txtValue]").val(),
								IsDisplayable : ($(this).find("input[name=chkVisible]")[0].checked==true) ? "Y" : "N",
								Parentid : (self.model.get("MaterialId") != "") ? self.model.get("MaterialId") : 0
							}).toJSON());
						}
					});
					_.each(self.delcustom, function(item){
						models_sub.push(new app.material_field({
						SigmaOperation : "D",
						CustomFieldId : item
						}).toJSON());
					})

					
					self.model.set({
						SigmaOperation : (self.model.get("MaterialId") != "") ? "U" : "C",
						DisciplineCode: $(self.el).find(".divDiscipline option:selected").val(),
						TaskCategoryId : Number($(self.el).find(".divTaskCategory option:selected").val()),
						TaskTypeId : Number($(self.el).find(".divTaskType option:selected").val()),
						IsConsumable : ($(self.el).find("#chkConsumable").checked==true) ? "Y" : "N",
						Description : $(self.el).find("#txtDescription").val(),
 					    Vendor : $(self.el).find("#txtVendor").val(),
						PartNumber : $(self.el).find("#txtPartnumber").val(),
						UomCode : $(self.el).find("#txtOUM").val(),
						Manhours : Number($(self.el).find("#txtManHour").val()),
						CostCode : $(self.el).find("#txtCostCode").val(),
						CustomField : models_sub
					});

					self.model.apply($(self.el),
						(self.model.get("MaterialId") != "") ? "PUT" : "POST", {
						s : function(m, r){
							ThisViewPage.render();
							app.component.Modal.close();
						},
						e : function(m, e){
							app.component.Modal.close();
						}
					});

			});
				
		
			


		},
		newcustom : function(item){
			var tr = "";

			if(item != null && item != undefined){
						tr += "<tr>";
					tr += "<td><label>"+item.ProjectId+"</label></td>";
					tr += "<td><label>"+item.SigmaRoleId+"</label></td>";				
					tr += "</tr>";

					
			}

			return tr;
		}

		
	});
})(jQuery);

