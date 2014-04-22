/*
Written by hitapia(sbang)
Role : project create
*/
var app = app || {};
(function($){
	app.projectcreate = Element.View.extend({
		company : [],
		subc : [],
		pages : ["New Project"],
		render : function(){
			var self = this;
			self.subc = [];
			self.company = [];
			app.TemplateManager.get("../../modules/project/tpl/tpl_projectcreate.html", function(template){
				
				$(self.el).html(_.template(template,self.model.toJSON()));
				$(self.el).find("#btnCancel").on("click", function(e){
					e.preventDefault();
					window.history.back();
				});
				self.renderscreen();
				self.setevent();
						
			});
            return this;
		},
		renderscreen : function(){
			var self = this;

				$(self.el).find(".img-thumbnail").hide();

				$(self.el).find("#cboDiscipline").append(new app.component.Checkbox({
					url : new app.disciplines().url,
					inline : true
				}).render().el);

				app.component.Call("/Common/Common.svc/rest/SigmaUserForProjectCombo", "GET", "", function(d){
					var list = JSON.parse(d.JsonDataSet);
					$(self.el).find("#slUser")
						.append("<option value=''>Select User</option>");
					_.each(list, function(item){
						$(self.el).find("#slUser")
							.append("<option value='"+item.Code+"'>"+item.CodeName+"</option>");
					});
				}, null);

				app.component.Call("/Common/Common.svc/rest/CountryCombo", "GET", "", function(d){
					var list = JSON.parse(d.JsonDataSet);
					$(self.el).find("#slCountry")
						.append("<option value=''>Select Country</option>");
					_.each(list, function(item){
						$(self.el).find("#slCountry")
							.append("<option value='"+item.Country+"'>"+item.Country+"</option>");
					});
				}, null);

				$(self.el).find("#slCounty").append("<option value=''>Select State</option>");
				$(self.el).find("#slCountry").on("change", function(){
					$(self.el).find("#txtCity").val("");
					$(self.el).find("#slCounty").children().remove();
					$(self.el).find("#slCounty")
						.append("<option value=''>Select State</option>");
					if($(this).val() != ""){
						app.component.Call("/Common/Common.svc/rest/CountyCombo/"+$(this).val(), "GET", "", 
							function(d){
								var list = JSON.parse(d.JsonDataSet);
								_.each(list, function(item){
									$(self.el).find("#slCounty")
										.append("<option value='"+item.County+"'>"+item.County+"</option>");
								});
							},null);
					}
				});
				$(self.el).find("#slCounty").on("change", function(){
					$(self.el).find("#txtCity").val("");
				});
				app.component.Call("/Common/Common.svc/rest/CompanyCombo", "GET", "", function(d){
					self.company = JSON.parse(d.JsonDataSet);
					$(self.el).find("#cboClient").append("<option value=''>Select Client</option>");
					_.each(self.company, function(item){
						$(self.el).find("#cboClient").append("<option value='"+item.Code+"'>"+item.CodeName+"</option>");
					});
				},null);

				app.component.Call("/Common/Common.svc/rest/CompanyByCompanyTypeCodeCombo/COMPANY_TYPE_SUBCONTRACTOR", "GET", "", function(d){
					self.company = JSON.parse(d.JsonDataSet);
					$(self.el).find("#cboContractor").append("<option value=''>Select Subcontractor</option>");
					_.each(self.company, function(item){
						$(self.el).find("#cboContractor").append("<option value='"+item.Code+"'>"+item.CodeName+"</option>");
					});
				},null);

		},
		
		setevent : function(){
			var self = this;

				$(self.el).find(".btnContAdd").on("click", function(e){
					e.preventDefault();
					var cid = $(self.el).find("#cboContractor option:selected").val();
					var ctext = $(self.el).find("#cboContractor option:selected").text();
					if(cid != ""){
						if(_.contains(self.subc, cid))
							return;

						var newline = $("<li>").addClass("list-group-item");
						newline.append("<input type='hidden' value="+cid+">"+ctext+"<button class='btn btn-warning btn-xs pull-right'>Del</button>");
						newline.find("button").on("click", function(e){
							e.preventDefault();
							var delcid = $(this).parent().find("input[type=hidden]").val();
							$(this).parent().remove();							
							self.subc = _.without(self.subc, delcid);
							
						});
					
						$(self.el).find("#subc").append(newline);
						self.subc.push(cid);
					}
				});

				$(self.el).find("#file").change(function(){
					if ($(this)[0].files && $(this)[0].files[0]) {
						var reader = new FileReader();
						reader.onload = function (e) {
							L(e);
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

		},
		sendsvc : function(path){
			var self = this;
			var data = {
				SigmaOperation: "C",
				ProjectId : 0,
				ProjectName : $(self.el).find("#txtprojectname").val(),
				ProjectNumber : $(self.el).find("#txtprojectid").val(),
				ProjectDescription : $(self.el).find("#txtdesc").val(),
				CompanyId : 1,
				CountryName : $(self.el).find("#slCountry").val(),
				CountyName : $(self.el).find("#slCounty").val(),
				CityName : $(self.el).find("#txtCity").val(),
				LogoFilePath : path,
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
						DisciplineCode: $(item).val()
					});
				}
			});
			_.each(self.subc, function(item){
				data.ProjectSubcontractor.push({
					SigmaOperation : "C",
					CompanyId : item
				});
			});
			app.component.Call(
				"/ProjectSettings/SigmaProjectSettings.svc/rest/Projects", "POST",
				JSON.stringify( { paramObj : data } ),
				function(d){
					if(d.IsSuccessful){
						app.component.Call("/Common/Common.svc/rest/ProjectCombo", "GET", "",
							function(d){
								app.loggeduser.ProjectList = JSON.parse(d.JsonDataSet);
								Element.Tools.SetCookie("logininfo", JSON.stringify(app.loggeduser));
								window.location = "/ui/";
							},null
						);
					}
				}, null
			);
		}
	});
})(jQuery);
