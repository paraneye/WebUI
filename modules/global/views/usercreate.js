var app = app || {};
(function($){
	app.usercreate = Element.View.extend({
		test : "",
		render : function(){
			var self = this;
			self.getcomponentcustom();

			app.TemplateManager.get("../../modules/global/tpl/tpl_usercreate.html", function(template){
				$(self.el).html(_.template(template, self.model.toJSON()));
				if(self.model.get("SigmaUserId")){
					var url = self.model.urlRoot + "/" + self.model.get("SigmaUserId");
					self.model.url = url;
					self.model.fetch({
						success : function(){
							$(self.el).html(_.template(template, self.model.toJSON()));
							$(self.el).find("h2").html("Edit User");
							$(self.el).find("#btnDelete").show();
							self.setevent();
							self.renderscreen();
							self.roleRender();
						},
						error : function(model, error){
								Element.Tools.Error(error);
						}
					});
				}else{
				    $(self.el).html(_.template(template, self.model.toJSON()));
				    $(self.el).find("#btnDelete").hide();
				    self.setevent();
					$(self.el).find("#imgPhotoUrl").hide();
				}

			});
            return this;
		},
		renderscreen : function(){
				var self = this;
				$(self.el).find("#imgPhotoUrl").hide();
				
				if(self.model.get("PhotoUrl") == "" || self.model.get("PhotoUrl") == undefined){
						$(self.el).find("#imgPhotoUrl").hide();
				}else{
						$(self.el).find("#imgPhotoUrl").show();
						$(self.el).find("#imgPhotoUrl").attr("src",app.config.docPath.images + self.model.get("PhotoUrl") );
						
				}

				if(self.model.get("SigmaUserId") != ""){
					$(self.el).find("#txtSigmaUserId").attr("readonly","readonly");
					$(self.el).find("#txtEmployeeId").trigger("click");
				}else{
					$(self.el).find("#txtSigmaUserId").attr("readonly","");
					
				}

				if(app.loggeduser.SigmaUserId == self.model.get("SigmaUserId")){
						$(self.el).find("#btnDelete").hide();
				}else{
						$(self.el).find("#btnDelete").show();
				}

				/*$(self.el).find("#file").on("change",function(e){
					$(self.el).find("#file").parent().parent().removeClass("has-error");
					$(self.el).find("#divcmd").remove();

					var v_size_byte = $(self.el).find("#file")[0].files[0].size;
					var v_size_kb = Math.round(v_size_byte/1024);
					var v_class = "";
					if(v_size_kb > 200){						
						v_class = "text-danger";
					}else{
						v_class = "help-block";
					}
					$(this).after("<div id='divcmd' class='"+v_class+"'>Current File Size : "+ v_size_kb + "(KB) </div>");

				});*/

			
		},
		newcustom : function(projectvalue,rolevalue){
		
			var tr = "<tr>";
			//project
			tr += "<td><select class='form-control' name='selproject'>";
			tr += "<option value=''>Select Project</option>";
			var selected ="";			
			_.each(self.customprojects, function(item){
				selected ="";
				if(projectvalue == item.Code){
					selected=" selected ";
				}
				tr += "<option value='"+item.Code+"' "+selected+">"+item.CodeName+"</option>";
			});
			tr += "</select></td>";
			//role
			tr += "<td><select class='form-control' name='selrole'>";
			tr += "<option value=''>Select Role</option>";
			var selected ="";
			_.each(self.customroles, function(item){
				selected ="";
				if(rolevalue == item.Code){
					selected=" selected ";
				}
				tr += "<option value='"+item.Code+"' "+selected+">"+item.CodeName+"</option>";
			});
			tr += "</select></td>";
			tr += "<td><button class='btn btn-warning'>X</button></td>";
			tr += "</tr>";
			return tr;
		},
		customroles : "",
		customprojects : "",
		userroles : "",
		getcomponentcustom : function(){
			
			app.component.Call(
					app.config.domain + "/Common/Common.svc/rest/SigmaRoleCombo",  
					"GET",                                      
					"",                                         
					function(data){                             
						self.customroles = JSON.parse(data.JsonDataSet);
					}, 
					null                                        
				);
			app.component.Call(
					app.config.domain + "/Common/Common.svc/rest/ProjectCombo",  
					"GET",                                      
					"",                                         
					function(data){                             
						self.customprojects = JSON.parse(data.JsonDataSet);
					}, 
					null                                        
				);

		},
		roleRender : function(){					
			var self = this;
			
			app.component.Call(
					app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaUserSigmaRoles/"+self.model.get("SigmaUserId"),
					"GET",                                      
					"",
					function(data){  
							self.userroles = JSON.parse(data.JsonDataSet);
							var i =0;
							var tb = $(self.el).find("#role_sublist");
							
							_.each(self.userroles, function(item){
								var newline = $(self.newcustom(item.ProjectId, item.SigmaRoleId));			
								tb.find("table > tbody:last").append(newline);
							});
							tb.find("button").on("click",function(e){
								e.preventDefault();					
								$(this).parent().parent().remove();
							});
					}, 
					null                                        
				);


		},
		setsave : function(url){
			var self = this;
			var models_role_value =[];
				$(self.el).find("#role_sublist tbody tr").each(function() {
					var selproject = $(this).find("select[name=selproject] option:selected").val();
					var selrole = $(this).find("select[name=selrole] option:selected").val();

					models_role_value.push(new app.usersigmarole({
						SigmaOperation:"C",
						SigmaRoleId: Number(selrole),
						SigmaUserId: (self.model.get("SigmaOperation")=="U") ? (self.model.get("SigmaUserId")) : ($(self.el).find("#txtSigmaUserId").val()),
						ProjectId: Number(selproject)
					}).toJSON());
				});

			self.model.set({
					SigmaOperation: (self.model.get("SigmaOperation")=="U") ? "U" : "C", // CRUD
				    SigmaUserId : (self.model.get("SigmaOperation")=="U") ? (self.model.get("SigmaUserId")) : ($(self.el).find("#txtSigmaUserId").val()),
					CompanyId : ($(self.el).find("#cboCompany option:selected").val()=="") ? 0 : Number($(self.el).find("#cboCompany option:selected").val()),
					EmployeeId : $(self.el).find("#txtEmployeeId").val(),
					FirstName : $(self.el).find("#txtFirstName").val(),
					LastName : $(self.el).find("#txtLastName").val(),
					PhoneNo : $(self.el).find("#txtPhoneNo").val(),
					Email : $(self.el).find("#txtEmail").val(),
					PhotoUrl : (url=="" || url==undefined) ? self.model.get("PhotoUrl") : url,
					SigmaUserSigmaRoles : models_role_value,
					DefaultProjectId : 0
					
				});
				
				self.model.apply($(self.el),"PUT", {
					s : function(m, r){
						ThisViewPage.render();
						app.component.Modal.close();
					},
					e : function(m, e){
						ThisViewPage.render();
					}
				});

		},
		filecheck : function(){
			var self = this;
			var ret = true;


		},
		getvalidationcheck : function(){
			var self =this;
			var file = $(self.el).find("#file")[0].value;
			var ret = true;
				$(self.el).find("#role_sublist tbody tr").each(function() {
					var selrole = $(this).find("select[name=selproject] option:selected").val();
					var selproject = $(this).find("select[name=selrole] option:selected").val();

					if(selrole == undefined || selproject == undefined || selrole == "" ||  selproject == ""){
							//alert("selet project and role");
							$(this).removeClass("has-error").addClass("has-error");
							ret = false;
					}

				});
			
			return ret;

		},
		setevent : function(){
			var self = this;
		
			$(self.el).find("#cboCompany").prepend(new app.component.Combo({
			    url: new app.companyallcombos().url,
				inline : true,
				selname : "Select Company",
				selected : self.model.get("CompanyId")
			}).render().el);

			$(self.el).find("#file").change(function(){
				if ($(this)[0].files && $(this)[0].files[0]) {
					var reader = new FileReader();
					reader.onload = function (e) {
						L(e);
						$(self.el).find('#imgPhotoUrl').attr('src', e.target.result);
						$(self.el).find('#imgPhotoUrl').show();
					}
					reader.readAsDataURL($(this)[0].files[0]);
				}else{
					$(self.el).find('#imgPhotoUrl').hide();
				}
			});

			$(self.el).find("#btnSave").on("click",function(e){
				e.preventDefault();
				if(!Element.Tools.Validate($(self.el).find("form"))) 
        			return;
				if(!self.getvalidationcheck()){
					return ;
				}
				
				var v_PhotoUrl="";				
				var fd = new FormData();
				if($(self.el).find(".filePhoto")[0].files.length > 0){

					fd.append('file',  $(self.el).find(".filePhoto")[0].files[0]);
					fd.append('name',  "Photo");
					$.ajax({
						url : app.config.uploadpath,
						type : "POST",
						processData: false,
						contentType: false,
						data : fd,
						success : function(data){   //data is Uploaded Path
							if(data != ""){
								v_PhotoUrl = data;
								self.setsave(data);
							}
						},
						error : function(error){
							Element.Tools.Error(error);
						}
					});
				}else{
					self.setsave("");
				}

					
			});

			$(self.el).find("#btnDelete").on("click", function (e) {
			    e.preventDefault();
			    if ($(self.el).find("#btnDelete").text() == "Are you sure?") {
			        self.model.set({
			            SigmaOperation: "D",// CRUD
						SigmaUserId: self.model.get("SigmaUserId"),
						CompanyId : (self.model.get("CompnayId") == null) ? 0 : Number(self.model.get("CompnayId")),
						DefaultProjectId:0
			        });
			        self.model.apply($(self.el), "DELETE", {
			            s: function (m, r) {
			                ThisViewPage.render();
			                app.component.Modal.close();
			            },
			            e: function (m, e) {
			                ThisViewPage.render();
			            }
			        });
			    } else {
			        $(self.el).find("#btndeletecancel").show();
			        $(self.el).find("#btnDelete").text("Are you sure?");
			        $(self.el).find("#btnSave").hide();
			        $(self.el).find("#btnCancel").hide();
			        $(self.el).find("#btndeletecancel").on("click", function (e) {
			            e.preventDefault();
			            $(self.el).find("#btnSave").show();
			            $(self.el).find("#btnCancel").show();
			            $(self.el).find("#btnDelete").text("Delete");
			            $(this).hide();
			        });
			    }
			});
	
			$(self.el).find("#btnCancel").on("click",function(e){
				app.component.Modal.close();
				return false;
			});

			$(self.el).find("#role_subbuttons").html(new app.component.ButtonGroup({
				buttons : [
					{ Id : "btnRoleAdd", Name : "Add New" }					
				]
			}).render().el);

			$(self.el).find("#btnRoleAdd").on("click",function(e){				
				e.preventDefault();

				var tb = $(self.el).find("#role_sublist");
				var newline = $(self.newcustom(null,null));
				newline.find("button").on("click",function(e){
					e.preventDefault();					
					$(this).parent().parent().remove();
				});
				tb.find("table > tbody:last").append(newline);
			
			});


		}
	});
})(jQuery);
