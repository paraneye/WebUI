/*
Written by hitapia(sbang)
Role : main index js
*/
var app = app || {};
(function($){
	app.header = Element.View.extend({
		className : "sga_gnb",
		template : app.config.tpl.header,
		render : function(){
			var self = this;
			app.TemplateManager.getnocache(this.template, function(template){
				$(self.el).html($(template));
				$(self.el).find("li[name='username']").append(app.loggeduser.Name);
				$(self.el).find("li[name='username']").on("click", function(e){
					e.preventDefault();
					app.component.Modal.show(new app.userprofile({ model: new app.userprofilemodel() }), 600);
				});
				$(self.el).find("#btnLogout").on("click", function(e){
					e.preventDefault();
					app.Logout();
				});
				$(self.el).find("#g_home").on("click", function(e){
					e.preventDefault();
					Element.Tools.SetCookie("pagename", "Overview");
					window.location = "/ui/";
				});
				$(self.el).find(".g_setting").on("click", function(e){
					e.preventDefault();
					Element.Tools.GoLink("Project List", app.config.path + "/modules/project/");
				});
				$(self.el).find(".g_project").on("click", function(e){
					e.preventDefault();
					Element.Tools.GoLink("Project List", app.config.path + "/modules/project/");
				});
				$(self.el).find("#g_help").on("click", function(e){
					if(ThisViewPage.pages){
						var name = ThisViewPage.pages[ThisViewPage.pages.length - 1];
						name = name.replace(/ /gi, "");
						name = name.replace(/\//gi, "");
						app.TemplateManager.getnocache("../../resources/help_"+name+".html", function(template){
							app.component.Modal.showhtml(template, 580);
						});
					}
				});

				//if(app.loggeduser.ProjectList == null){
				self.getprojectlist();
				//}else{
				//	self.showprojectlist();
				//}

				$(self.el).find("#cboprojectlist").on("change", function(e){
					e.preventDefault();
					if($(this).val() == "__NEW__"){
						Element.Tools.SetCookie("pagename", "New Project");
						window.location = "/ui/modules/project/#projectcreate";
					}else if($(this).val() != ""){
						app.loggeduser.CurrentProjectId = $(this).val();
						app.loggeduser.CurrentProjectName = $("#cboprojectlist option:selected").text();
						Element.Tools.SetCookie("logininfo", JSON.stringify(app.loggeduser));
						Element.Tools.SetCookie("pagename", "Overview");
						window.location = "/ui/modules/project/#project?p="+$(this).val();
					}
				});
			});
			return this;
		},
		showprojectlist : function(){
			var self = this;
			$(self.el).find("#cboprojectlist").append("<option value=''>Select Project</option>");
			_.each(app.loggeduser.ProjectList, function(item){
				var sl = (app.loggeduser.CurrentProjectId == item.Code) ? " selected " : "";
				$(self.el).find("#cboprojectlist")
					.append("<option value='"+item.Code+"' "+sl+">"+item.CodeName+"</option>");
			});
			if (app.loggeduser.IsAdmin == "Y") {
			    $(self.el).find("#cboprojectlist").append("<option value='__NEW__'>Add New Project</option>");
			}
		},
		getprojectlist : function(){
			var self = this;
			app.component.Call("/Common/Common.svc/rest/ProjectCombo", "GET", "",
				function(d){
					app.loggeduser.ProjectList = JSON.parse(d.JsonDataSet);
					Element.Tools.SetCookie("logininfo", JSON.stringify(app.loggeduser));
					self.showprojectlist();
				},null
			);
		}
	});
	app.userprofile = Element.View.extend({		
		render : function(){	
			var self = this;						
			app.TemplateManager.get("../../modules/global/tpl/tpl_userprofile.html", function(template){			
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

				app.component.Call(
					app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaUserSigmaRoles/"+app.loggeduser.Id,
					"GET",                                      
					"",
					function(data){  
 					// Success Callback							
							self.rolelist = JSON.parse(data.JsonDataSet);
							var i =0;					
							var tb = $(self.el).find("#userprofile_sublist");					
							if(self.rolelist.length == 0){
									tb.find("table > tbody:last").append("<tr><td colspan='2' style='text-align:center;'>No Record</td></tr>");
							}else{
									_.each(self.rolelist, function(item){
										var newline = $(self.newcustom(item));			
										tb.find("table > tbody:last").append(newline);
								
									
									});
							}
					}, 
					null                                        
				);
			

		},
		
		renderscreen : function(){
			var self = this;

			if(self.model.get("PhotoUrl") == "" || self.model.get("PhotoUrl") == null){
				$(self.el).find("#divPhoto").hide();
			}else{
				$(self.el).find("#divPhoto").show();
			}
			self.comboProject();
			
		},
		comboProject : function(){
				var self = this;

				$(self.el).find("#seldefaultproject").html('');
				app.component.Call("/Common/Common.svc/rest/ProjectCombo","GET","",
				function(d){
						_.each(JSON.parse(d.JsonDataSet), function(item){
							var selected = "";
							if(item.Code == self.model.get("DefaultProjectId"))
								selected = "selected";

							$(self.el).find("#seldefaultproject").
								append("<option value='"+item.Code+"' "+selected+">"+ item.CodeName +"</option>");
						});
				},null);
		},
		getvalidationcheck : function(){
			var self =this;
			var ret = true;
			
			var newpwd = $(self.el).find("#txtNewPwd").val();
			var confirmpwd = $(self.el).find("#txtConfirmNewPwd").val();
			$(self.el).find(".text-danger").remove();

			if(newpwd != confirmpwd ){
					 $(self.el).find("#txtConfirmNewPwd").parent().parent().removeClass("has-error").addClass("has-error");
					 
					 $(self.el).find("#txtConfirmNewPwd").after("<div class='text-danger'>Passwords do not match.</div>");
					ret = false;		
			}

			return ret;

		},
		setevent : function(){
			var self = this;
	
			$(self.el).find("#btnPwdChange").on("click", function(e){
				e.preventDefault();
				var obj = $(self.el).find("#divpwdchange");				
				if(obj.is(".active")){						
						obj.removeClass("active");
						obj.find("input").removeClass("required");
						obj.hide();
						$(self.el).find("#btnPwdChange").html("Password Change Show");
				}else{						
						obj.removeClass("active").addClass("active");
						obj.find("input").removeClass("required").addClass("required");
						obj.show();
						$(self.el).find("#txtOldPwd").focus();
						$(self.el).find("#btnPwdChange").html("Password Change Close");

				}
			});
			$(self.el).find("#btnCancel").on("click", function(e){
				e.preventDefault();
				app.component.Modal.close();
			});

			$(self.el).find("#btnSave").on("click",function(e){
				e.preventDefault();				
				if(!Element.Tools.Validate($(self.el).find("form"))) 
        			return;
				if(!self.getvalidationcheck())
					return;
					
					var v_oldpwd = $(self.el).find("#txtOldPwd").val();
					var v_newpwd = $(self.el).find("#txtNewPwd").val();
					var v_confirmpwd = $(self.el).find("#txtConfirmNewPwd").val();

					if(v_oldpwd !="" && v_newpwd !="" && v_confirmpwd != ""){
						self.model.set({
							SiVgmaOperation : (self.model.get("SigmaUserId") != "") ? "U" : "C",
							DefaultProjectId : Number($(self.el).find("#seldefaultproject option:selected").val()),
 							OldPassword : hex_md5($(self.el).find("#txtOldPwd").val()),
							NewPassword : hex_md5($(self.el).find("#txtNewPwd").val()),
							ConfirmNewPassword : hex_md5($(self.el).find("#txtConfirmNewPwd").val())
						});
					}else{
						self.model.set({
							SigmaOperation : (self.model.get("SigmaUserId") != "") ? "U" : "C",						
							DefaultProjectId : Number($(self.el).find("#seldefaultproject option:selected").val())
						});
					}
				
					

					self.model.apply($(self.el),
						(self.model.get("SigmaUserId") != "") ? "PUT" : "POST", {
						s : function(m, r){
							ThisViewPage.render();
							app.component.Modal.close();
						},
						e : function(m, e){
							Element.Tools.Error(e);
							
						}
					});

			});
		
		},
		newcustom : function(item){
			var tr = "";
			if(item != null && item != undefined){
					tr += "<tr>";
					tr += "<td style='width:50%;text-align:center;'>"+item.ProjectName+"</td>";
					tr += "<td style='width:50%;text-align:center;'>"+item.SigmaRoleName+"</td>";				
					tr += "</tr>";					
			}

			return tr;
		}

		
	});


})(jQuery);
