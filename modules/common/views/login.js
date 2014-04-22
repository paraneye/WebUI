/*
Written by hitapia(sbang)
Role : Login Page
*/
var app = app || {};
(function($){
	app.login = Element.View.extend({
		foranonymous : true,
		options : { anony : true },
		render : function(){
		    var self = this;		    
			app.TemplateManager.get(app.config.path + "/modules/common/tpl/tpl_login.html", function(template){
				$(self.el).html($(template));
				if(Element.Tools.GetCookie("saveusername") != ""){
					$(self.el).find("#chksave").attr("checked", true);
					$(self.el).find("#txtname").val(Element.Tools.GetCookie("saveusername"));
					$(self.el).find("#txtpassword").focus();
				}else{
					$(self.el).find("#chksave").attr("checked", false);
				}
				$(self.el).find('#fgpass').click(function (e){
					e.preventDefault();
					app.router.navigate("forgotpassword", { trigger : true });
				});
				$(self.el).find('#txtpassword').keydown(function (e){
					if(e.keyCode == 13){
						self.dologin();
					}
				})
				$(self.el).find("#btnLogin").on("click", function(e){
					e.preventDefault();
					self.dologin();
				});
			});
            return this;
		},
		dologin: function () {
			var self = this;
			$(self.el).find("#loginresult").hide();
			if(!Element.Tools.Validate($(self.el).find("form")))
				return;
			var name = $(self.el).find("#txtname").val();
			var password = $(self.el).find("#txtpassword").val();

			app.component.Call(
				"/Auth/SigmaAuth.svc/rest/Login",
				"POST",
				JSON.stringify({ userId : name , passwd :hex_md5(password) }),
				function(data){
					if(data.IsSuccessful){
						var d = JSON.parse(data.JsonDataSet)[0];
						//For Develop - Start
						app.loggeduser = d;
						app.loggeduser.Id = d.SigmaUserId;
						app.loggeduser.Name = d.SigmaUserId;
						app.loggeduser.ProjectId = d.CurrentProjectId;
						app.loggeduser.CompanyId = d.CompanyId;
						app.loggeduser.CompanyName = d.CompanyName;
						app.loggeduser.LoginDate = new Date();
						app.loggeduser.ProjectList = [];
						//For Develop - End
						if($(self.el).find("#chksave").is(":checked")){
							Element.Tools.SetCookie("saveusername", d.SigmaUserId);
						}else{
							Element.Tools.DeleteCookie("saveusername");
						}
						if(d.IsActivated == "N"){
							Element.Tools.SetCookie("temploginuser", d.SigmaUserId);
							window.location = "/ui/#updatepassword";
							return;
						}
						Element.Tools.SetCookie("logininfo", JSON.stringify(app.loggeduser));
						app.Login();
					}else{
						$(self.el).find("#loginresult").show();
						$(self.el).find("#loginresult bg-danger").text(data.ErrorMessage);
					}
				}, null
			);
		}
	});
	app.forgotpassword = Element.View.extend({
		foranonymous : true,
		options : { anony : true },
		render : function(){
			var self = this;
			app.TemplateManager.getnocache("/ui/modules/common/tpl/tpl_forgotpassword.html", function(template){
				$(self.el).html($(template));
				$(self.el).find("#txtname").focus();
				$(self.el).find("#btnSubmit").on("click", function(e){
					e.preventDefault();
					if(!Element.Tools.Validate($(self.el).find("form")))
						return;
					var loginid = $(self.el).find("#txtname").val();
					var email = $(self.el).find("#txtemail").val();
					L(loginid);
					app.component.Call("/Auth/SigmaAuth.svc/rest/ForgotPassword", "POST",
						JSON.stringify({ userId : loginid, email : email }),
						function(d){
							if(d.IsSuccessful){
								
								app.component.Alert.show(
								{ COMMENT : "We have sent a password reset email to you. Please find a temporary password in the email and set a new password with it.", POS : "Return to Login Page", NAG : "Cancel" },
								function(){									
									window.location = "/ui/#login";
									app.component.Alert.close();
								},
								function(){ }
								);

							}else{
								$(self.el).find("#loginresult").show();
								$(self.el).find("#loginresult").text(d.ErrorMessage);
							}
						}, null
					);
				});
			});
            return this;
		}
	});
	app.updatepassword = Element.View.extend({
		foranonymous : true,
		options : { anony : true },
		render : function(){
			var self = this;
			app.TemplateManager.getnocache(app.config.path + "/modules/common/tpl/tpl_updatepassword.html", function(template){
				$(self.el).html($(template));
				var tmpusername = Element.Tools.GetCookie("temploginuser");
				$(self.el).find("#loginid").html("<strong>"+tmpusername+"</strong>");
				$(self.el).find("#btnSubmit").on("click", function(e){
					e.preventDefault();
					if(!Element.Tools.Validate($(self.el).find("form")))
						return;
					var old = $(self.el).find("#oldpass").val();
					var newpass = $(self.el).find("#newpass").val();
					var newpass2 = $(self.el).find("#newpass2").val();
					if(newpass != newpass2){
						$(self.el).find("#loginresult").show();
						$(self.el).find("#loginresult bg-danger").text("Check new password");
						return;
					}
					app.component.Call("/GlobalSettings/SigmaGlobalSettings.svc/rest/Password", "PUT",
						JSON.stringify({ paramObj : {
							SigmaUserId : tmpusername,
							OldPassword : hex_md5(old),
							NewPassword : hex_md5(newpass),
							ConfirmNewPassword : hex_md5(newpass2)
					   	}}),
						function(d){
							if(d.IsSuccessful){
								Element.Tools.DeleteCookie("temploginuser");
								window.location = "/ui/#login";

								
							}else{
								$(self.el).find("#loginresult").show();
								$(self.el).find("#loginresult bg-danger").text(d.ErrorMessage);
							}
						}, null
					);
				});
			});
            return this;
		}
	});
})(jQuery)
