
var app = app || {};
(function($){
	app.rolelistview = Element.View.extend({
		pages : ["Global Settings", "Roles and Permissions"],		
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/global/tpl/tpl_rolelistview.html", function(template){
				$(self.el).html($(template));

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class : "primary", Id : "btnAdd", Name : "Add New" },
						{ Id : "btnPermReport", Name : "Permission Report" },
						{ class : "warning", Id : "btnDelete", Name : "Delete" }
					]
				}).render().el);

				$(self.el).find("#list").html(new app.component.Tablelist({
					list : "../../modules/global/tpl/tpl_rolelist.html",
					listitem : "../../modules/global/tpl/tpl_rolelistitem.html",
					coll : "new app.roleinfolist()"
				}).render().el);
				
				$(self.el).find("#btnAdd").on("click",function(e) {
					e.preventDefault();
					app.router.navigate("rolecreate", { trigger : true })
				});

				$(self.el).find("#btnPermReport").on("click",function(e) {
					e.preventDefault();
					app.router.navigate("rolereport", { trigger : true })
				});

				$(self.el).find("#btnDelete").on("click",function(e) {
					e.preventDefault();
					if(!Element.Tools.ValidateCheck($(self.el).find("#list")))
						return;
					app.component.Confirm.show(
						{ COMMENT : "Are you sure you want to delete the selected item(s)?", POS : "OK", NAG : "Cancel" },
						function(){
							var models = [];
                            $(self.el).find("input[name=key]:checked").each(function() {
                                models.push({ 
									SigmaOperation : "D", // CRUD
									SigmaRoleId : $(this).val()
                                }); 
							});
							if(models.length == 0){
								app.component.Confirm.close();
								return false;
							}
							Element.Tools.Multi(
								"/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaRoles/Multi",
								models,
								$(self.el), {
								s : function(m, r){
									self.render();
									app.component.Confirm.close();
								},
								e : function(m, e){
									app.component.Confirm.close();
								}
							});
						},null
					);
				});

			});
            return this;
		}
	});
	app.rolecreate = Element.View.extend({
		pages : ["Global Settings", "Roles and Permissions", "Add New"],		
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/global/tpl/tpl_roleadd.html", function(template){
				$(self.el).html(_.template(template, self.model.toJSON()));
				self.renderscreen();
				if(self.model.get("SigmaRoleId")){
					app.component.Call(
						"/GlobalSettings/SigmaGlobalSettings.svc/rest/Permissions/"+self.model.get("SigmaRoleId"),
						"GET","",
						function(data){
							_.each(JSON.parse(data.JsonDataSet), function(item){
								self.createoption(item);
							});
							self.getroleinfo();
						}, null
					);
				}else{
					self.setoptions();
				}
			});
            return this;
		},
		getroleinfo : function(){
			var self = this;
			if(self.model.get("SigmaRoleId")){
				app.component.Call(
					"/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaRoles/"+self.model.get("SigmaRoleId"),
					"GET","",
					function(data){
						var d = JSON.parse(data.JsonDataSet)[0];
						$(self.el).find("#txtRoleName").val(d.Name);
						$(self.el).find("#txtDescription").val(d.RoleDescription);
						if(d.IsBuiltin == "Y"){
							$(self.el).find("#txtRoleName").addClass("disable");
							$(self.el).find("#txtRoleName").attr("disabled", true);
						}
					}, null
				);
			}
		},
		renderscreen : function(){
			var self = this;
				app.component.Call(
					"/Common/Common.svc/rest/SigmaRoleCombo",
					"GET","",
					function(data){
						var one = "";
						_.each(JSON.parse(data.JsonDataSet), function(item){

							$(self.el).find("#copyfrom").append("<option value='"+item.Code+"'>"+item.CodeName+"</option>");
							one = item.Code;
						});
					}, null
				);
				$(self.el).find("#copyfrom").on("change", function(){
					$(self.el).find("#rolebox input[type=checkbox]").prop("checked",false);
					if($(this).val() == "")
						return;
					app.component.Call(
						"/GlobalSettings/SigmaGlobalSettings.svc/rest/Permissions/"+$(this).val(),
						"GET","",
						function(data){
							_.each(JSON.parse(data.JsonDataSet), function(item){
								if(item.IsChecked == "Y"){
									$(self.el).find("#rolebox").find("input[value='"+item.SigmaJobId+"']")
									.prop("checked",true);									
								}else{
										$(self.el).find("#rolebox").find("input[value='"+item.SigmaJobId+"']")
									.prop("checked",false);	
								}

							});
						}, null
					);
				});
				
				$(self.el).find("#btnSave").on("click",function(e) {
					e.preventDefault();
					if(!Element.Tools.Validate($(self.el).find("form")))
						return;
					var models = [];
					var m = {
						SigmaOperation : self.model.get("SigmaRoleId") ? "U" : "C", // CRUD
						Name : $(self.el).find("#txtRoleName").val(),
						RoleDescription : $(self.el).find("#txtDescription").val(),
						SigmaRoleId : Number(self.model.get("SigmaRoleId")) || 0,
						typeSigmaRoleSigmaJob : [{}]
					}
					var mp = [];
					_.each($(self.el).find("#rolebox").find("input"), function(item){
						if($(item).is(':checked')){
							mp.push({
								SigmaOperation : "C", // CRUD
								SigmaJobId: Number($(item).val())
							});
						}
					});
					m.typeSigmaRoleSigmaJob = mp;
					app.component.Call(
						"/GlobalSettings/SigmaGlobalSettings.svc/rest/RolesNPermissions/Multi",
						"PUT", JSON.stringify({ listObj : m }),
						function(data){
							app.router.navigate("rolelist", { trigger : true })
						}, null
					);
				});
				$(self.el).find("#btnCancel").on("click",function(e) {
					e.preventDefault();
					history.back();
				});
		},
		setoptions : function(){
			var self = this;
			app.component.Call(
				"/GlobalSettings/SigmaGlobalSettings.svc/rest/Permissions",
				"GET","",
				function(data){
					_.each(JSON.parse(data.JsonDataSet), function(item){
						self.createoption(item);
					});
				}, null
			);
		},
		createoption : function(item){
			var self = this;
			var box = $(self.el).find("#rolebox").find("#" + item.JobCategoryName.replace(" ",""));
			if(box.length == 0){
				var t = "<div class='panel panel-default' id='"+item.JobCategoryName.replace(" ","")+"'>";
				t += "<div class='panel-heading'>"+ item.JobCategoryName +"</div>";
				t += "<div class='panel-body'></div>";
				t += "</div>";
				box = $(t);
				$(self.el).find("#rolebox").append(box);
			}
			var opt = "<div class='col-sm-3 checkbox'><label><input type='checkbox' name='"+item.SigmaJobName+"' value="+item.SigmaJobId+" "+((item.IsChecked == "Y") ? " checked " : "")+">"+item.SigmaJobName+"</label></div>";
			box.find('.panel-body').append(opt);
		}
	});
	app.rolereport = Element.View.extend({
		pages : ["Global Settings", "Permissions Report"],
		render : function(){
			var self = this;
			self.cols = [];
			self.rows = [];
			app.TemplateManager.get("../../modules/global/tpl/tpl_rolereport.html", function(template){
				$(self.el).html(template);
				app.component.Call(
					"/GlobalSettings/SigmaGlobalSettings.svc/rest/PermissionReport",
					"GET","",
					function(data){
						var d = JSON.parse(data.JsonDataSet);
						_.each(d, function(item){
							self.rendercols(item);
						});
						_.each(d, function(item){
							self.renderrows(item);
						});
						_.each(d, function(item){
							if(item.IsChecked == "Y")
								$(self.el).find("input[value='"+item.SigmaRoleId+"_"+item.SigmaJobId+"']")
									.attr("checked", true);

						});
					}, null
				);
				$(self.el).find("#btnSave").on("click",function(e) {
					e.preventDefault();
					var mp = [];
					_.each($(self.el).find(".roleandjob"), function(item){
						if($(item).is(':checked')){
							var t = $(item).val().split("_");
							mp.push({
								SigmaOperation : "C", // CRUD
								SigmaRoleId : t[0],
								SigmaJobId : t[1]
							});
						}
					});
					app.component.Call(
						"/GlobalSettings/SigmaGlobalSettings.svc/rest/PermissionReport/Multi",
						"PUT", JSON.stringify({ listObj : mp }),
						function(data){
							if(data.IsSuccessful){
								app.router.navigate("rolelist", { trigger : true })
							}else{
								L(data);
							}
						}, null
					);
				});
				$(self.el).find("#btnCancel").on("click",function(e) {
					e.preventDefault();
					app.router.navigate("rolelist", { trigger : true })
				});
			});
            return this;
		},
		cols : [],
		rows : [],
		rendercols : function(item){
			var self = this;
			if($(self.el).find("table > thead > tr").length == 0){
				$(self.el).find("table > thead").append("<tr>");
				$(self.el).find("table > thead > tr").append("<th></th>");
			}

			var box = $(self.el).find("table > thead").find("#role_" + item.SigmaRoleId);
			if(box.length == 0){
				$(self.el).find("table > thead > tr")
					.append("<th id='role_"+item.SigmaRoleId+"'>"+item.SigmaRoleName+"</th>");
				self.cols.push(item.SigmaRoleId);
			}
		},
		renderrows : function(item){
			var self = this;
			var box = $(self.el).find("table > tbody").find("#job_" + item.SigmaJobId);
			if(box.length == 0){
				var newline = $("<tr id='job_"+item.SigmaJobId+"'></tr>");
				newline.append("<td>"+item.SigmaJobName+"</td>");
				_.each(self.cols, function(c){
					newline.append("<td style='text-align:center;'><input type='checkbox' class='roleandjob' value='"+c+"_"+item.SigmaJobId+"'></td>");
				});
				$(self.el).find("table > tbody").append(newline);
				self.rows.push(item.SigmaJobId);
			}
		}
	});
})(jQuery);
