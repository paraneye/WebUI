
var app = app || {};
(function($){
	app.projectinformation = Element.View.extend({
		company : [],
		subc : [],
		pages : ["PROJECT", "Settings", "Information"],
		render : function(){
			var self = this;
			self.subc = [];
			self.company = [];
			app.TemplateManager.get("../../modules/project/tpl/tpl_projectcreate.html", function(template){
		
				self.model.set({ ProjectId : app.loggeduser.CurrentProjectId });
				self.model.fetch({
						url : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/Projects/" + app.loggeduser.CurrentProjectId,	
					success : function(){
						$(self.el).html(_.template(template,self.model.toJSON()));
						self.renderscreen();
						self.setevent();					
						
					},
					error : function(m, e){
						Element.Tools.Error(e);
					}
				});
				
				
			});
            return this;
		},
 		userdis	: "",
		disRender : function(){
			var self = this;
		
			app.component.Call(app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/ProjectDisciplines/"+self.model.get("ProjectId"), "GET", "",
					function(d){
						self.userdis = JSON.parse(d.JsonDataSet);
					
						_.each(self.userdis, function(item){							
							$(self.el).find("#cboDiscipline input[value="+item.DisciplineCode+"]").attr("checked","checked");

						});
					}, null);


		},
		resetCountry : function(){
			var self = this;

			app.component.Call("/Common/Common.svc/rest/CountryCombo", "GET", "", function(d){
				var list = JSON.parse(d.JsonDataSet);
				$(self.el).find("#slCountry")
					.append("<option value=''>Select Country</option>");
				_.each(list, function(item){
					var selected = "";
					if(item.Country == self.model.get("CountryName"))
						selected = "selected";

					$(self.el).find("#slCountry")
						.append("<option value='"+item.Country+"' "+selected+">"+item.Country+"</option>");
				});

				$(self.el).find("#slCountry").on("change",function(){
					var v_Country = $(this).val();
					self.resetCounty(v_Country);
				});

				var v_Country = $(self.el).find("#slCountry option:selected").val();
				self.resetCounty(v_Country);
			}, null);
		},	
		resetCounty : function(selCountry){
			var self = this;			
			$(self.el).find("#slCounty").children().remove();
			$(self.el).find("#slCounty")
				.append("<option value=''>Select County</option>");

			if(selCountry != "" || selCountry != undefined){
				app.component.Call("/Common/Common.svc/rest/CountyCombo/"+selCountry, "GET", "", 
					function(d){
						var list = JSON.parse(d.JsonDataSet);
						_.each(list, function(item){
						var selected = "";
						if(item.County == self.model.get("CountyName"))
							selected = "selected";

							$(self.el).find("#slCounty")
								.append("<option value='"+item.County+"' "+selected+">"+item.County+"</option>");
						});
					},null);
			}

			
			$(self.el).find("#slCounty").on("change", function(){
				$(self.el).find("#txtCity").val("");
			});
			
		},
		renderscreen : function(){
			var self = this;
			if(self.model.get("LogoFilePath")==""){	
				$(self.el).find("#imgLogo").hide();
			}else{
				$(self.el).find("#imgLogo").show();
				$(self.el).find("#imgLogo").attr("src",app.config.docPath.images + self.model.get("LogoFilePath"));
			}

			app.component.Call(app.config.domain + "/Common/Common.svc/rest/DisciplinesCombo", "GET", "",
				function(d){
					_.each(JSON.parse(d.JsonDataSet), function(item){
						$(self.el).find("#cboDiscipline").
							append("<label class='checkbox-inline'><input type='checkbox' value='"+item.Code+"' >"+item.CodeName+"</label>");
					});
					if(self.model.get("ProjectId"))
						self.disRender();
				}, null);

			app.component.Call("/Common/Common.svc/rest/SigmaUserForProjectCombo", "GET", "", function(d){
				var list = JSON.parse(d.JsonDataSet);
				$(self.el).find("#slUser")
					.append("<option value=''>Select User</option>");
				_.each(list, function(item){
					var selected ="";
					if(item.Code == self.model.get("ProjectManagerId")){
						selected = "selected";
					}
					$(self.el).find("#slUser")
						.append("<option value='"+item.Code+"' "+selected+">"+item.CodeName+"</option>");
				});
			}, null);

			self.resetCountry();

			app.component.Call("/Common/Common.svc/rest/CompanyCombo", "GET", "", function(d){
				self.company = JSON.parse(d.JsonDataSet);
				$(self.el).find("#cboClient").append("<option value=''>Select Client</option>");
				_.each(self.company, function(item){
					var selected ="";
					if(item.Code == self.model.get("ClientCompanyId") )
						selected = "selected";

					$(self.el).find("#cboClient").append("<option value='"+item.Code+"' "+selected+">"+item.CodeName+"</option>");
				});
			},null);

			app.component.Call("/Common/Common.svc/rest/CompanyByCompanyTypeCodeCombo/COMPANY_TYPE_SUBCONTRACTOR", "GET", "", function(d){
				self.company = JSON.parse(d.JsonDataSet);
				$(self.el).find("#cboContractor").append("<option value=''>Select Subcontractor</option>");
				_.each(self.company, function(item){
					$(self.el).find("#cboContractor").append("<option value='"+item.Code+"'>"+item.CodeName+"</option>");
				});
			},null);

			//sub contractors
			app.component.Call("/ProjectSettings/SigmaProjectSettings.svc/rest/ProjectSubcontractors/" + self.model.get("ProjectId"), "GET", "", function(d){
				var subcont = JSON.parse(d.JsonDataSet);					
				_.each(subcont, function(item){						
					self.SubContratorRender(item.CompanyId,item.Name);
				
				});
			},null);
		},
		SubContratorRender : function(cid, ctext){
			var self = this;
			
			var newline = $("<li>").addClass("list-group-item");
			newline.append("<input type='hidden' value="+cid+" name='txtsubcont'>"+ctext+"<button class='btn btn-warning btn-xs pull-right'>X</button>");
			newline.find("button").on("click", function(e){
				e.preventDefault();
				var delcid = $(this).parent().find("input[type=hidden]").val();
				$(this).parent().remove();		
			});
			$(self.el).find("#subc").append(newline);

		},
		
		setevent : function(){
			var self = this;

				$(self.el).find(".btnContAdd").on("click", function(e){
					e.preventDefault();
					var cid = $(self.el).find("#cboContractor option:selected").val();
					var ctext = $(self.el).find("#cboContractor option:selected").text();
					if(cid != ""){
						var rtn = true;
						_.each($(self.el).find("#subc li"), function(item){				
							var v_subc = $(item).find("input").attr("value");				
							if(v_subc == cid)
								rtn =false;
						});
						if(rtn == true)
							self.SubContratorRender(cid, ctext);
						
					}
				});

				$(self.el).find("#fileLogo").change(function(){
					if ($(this)[0].files && $(this)[0].files[0]) {
							L("dfsda");
						var reader = new FileReader();
						reader.onload = function (e) {
							$(self.el).find('#imgLogo').attr('src', e.target.result);
							$(self.el).find('#imgLogo').show();
						}
						reader.readAsDataURL($(this)[0].files[0]);
					}else{
						$(self.el).find('#imgLogo').hide();
					}
				});

				$(self.el).find("#btnSave").on("click", function(e){
					e.preventDefault();
					if($(self.el).find("#cboDiscipline input[type='checkbox']:checked").length == 0){
						$(self.el).find("#cboDiscipline").parent().parent().addClass("has-error");
						return;
					}
					if(!Element.Tools.Validate($(self.el).find("form")))
						return;
				
					var fd = new FormData();
					if($(self.el).find("#fileLogo")[0].files.length > 0){
						fd.append('file',  $(self.el).find("#fileLogo")[0].files[0]);
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
									self.sendsvc(data);
								}
							},
							error : function(error){
								Element.Tools.Error(error);
							}
						});
					}else{
						self.sendsvc("");
					}

				});
				$(self.el).find("#btnCancel").on("click", function(e){
					e.preventDefault();
					window.history.back();
				});

		},
		sendsvc : function(path){
			var self = this;
			var data = {
				SigmaOperation: (self.model.get("ProjectId") != "") ? "U" : "C",
				ProjectId : self.model.get("ProjectId"),
				ProjectName : $(self.el).find("#txtprojectname").val(),
				ProjectNumber : $(self.el).find("#txtprojectid").val(),
				ProjectDescription : $(self.el).find("#txtdesc").val(),
				CompanyId : app.loggeduser.CompanyId,
				CountryName : $(self.el).find("#slCountry").val(),
				CountyName : $(self.el).find("#slCounty").val(),
				CityName : $(self.el).find("#txtCity").val(),
				LogoFilePath : (path=="") ? self.model.get("LogoFilePath") : path,
				IsActive : "Y",
				ProjectManagerId : $(self.el).find("#slUser").val(),
				ClientCompanyId : Number($(self.el).find("#cboClient").val()),
				ClientProjectId : $(self.el).find("#txtcprjname").val(),
				ClientProjectName : $(self.el).find("#txtcprjid").val(),
				ProjectDiscipline : [],
				ProjectSubcontractor: []
			};
			_.each($(self.el).find("#cboDiscipline input[type='checkbox']"), function(item){
				if($(item).is(":checked")){
					data.ProjectDiscipline.push({
						SigmaOperation : "C",
						ProjectId : (self.model.get("ProjectId")=="")?0:self.model.get("ProjectId"),
						DisciplineCode: $(item).val()
					});
				}
			});
		
			_.each($(self.el).find("#subc li"), function(item){
				
				var v_subc = $(item).find("input").attr("value");				
				data.ProjectSubcontractor.push({
					SigmaOperation : "C",					
					ProjectId : (self.model.get("ProjectId")=="")?0:self.model.get("ProjectId"),
					CompanyId : Number(v_subc)
				});
			});
			
			app.component.Call(
				"/ProjectSettings/SigmaProjectSettings.svc/rest/Projects", "PUT",
				JSON.stringify( { paramObj : data } ),
				function(d){
					if(d.IsSuccessful)
						app.router.navigate("project", { trigger : true });

				}, null
			);
		}
	});
})(jQuery);
