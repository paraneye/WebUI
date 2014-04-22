/*
Written by hitapia(sbang)
Role : project list
*/
var app = app || {};
(function($){
	app.hrlistview = Element.View.extend({
		pages : ["PROJECT", "Settings", "Human Resources"],
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/project/tpl/tpl_hrlistview.html", function(template){
				$(self.el).html($(template));

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class : "primary", Id : "Add", Name : "Add New" },
						{ Id : "ImportList", Name : "Import File" },
						{ Id : "ImportHistory", Name : "Import History" },
						{ class : "warning", Id : "Delete", Name : "Delete"}
					]
				}).render().el);

				$(self.el).find("#list").html(new app.component.Tablelist({
					list : "../../modules/project/tpl/tpl_hrlist.html",
					listitem : "../../modules/project/tpl/tpl_hrlistitem.html",
					coll : "new app.hrs()",
                    query : self.options.query
				}).render().el);

				$(self.el).find("#controls").html(new app.component.SearchControl({
					options : [
						{ Value : "FirstName", Name : "First Name" },
						{ Value : "LastName", Name : "Last Name" },
						{ Value : "Company", Name : "Company" }
					],
					query : self.options.query      
				}).render().el);

				$(self.el).find("#Add").on("click", function(e){
					app.component.Modal.show(
						new app.hrcreate({ model : new app.hr() }), 
						600
					);
                });
				$(self.el).find("#ImportList").on("click", function(e){
                    app.component.Modal.show(new app.importlist(
                        {
                            kind: "HR",
                            downloadpath: app.config.docPath.template + app.config.downloads.personnelstemplate
                        }
                    ), 600);
                });
				$(self.el).find("#ImportHistory").on("click", function(e){
                    app.router.navigate("hr/importhistorylist", { trigger : true });
                });
				$(self.el).find("#Delete").on("click", function(e){
					e.preventDefault();
					if(!Element.Tools.ValidateCheck($(self.el).find("#list")))
						return;
					app.component.Confirm.show(
						{ COMMENT : "Are you sure you want to delete the selected item(s)?", POS : "OK", NAG : "Cancel" },
						function(){
							var models = [];
                            $(self.el).find("input[name=key]:checked").each(function() {
                                models.push(new app.hr({ 
                                    PersonnelId : Number($(this).val()),
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
									window.location = "#hrlist"+q;
									
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
			});
            return this;
		},
		link : function(num){
			app.component.Modal.show(
				new app.hrcreate({ model : new app.hr( { PersonnelId : num} ) }), 
				600
			);
		}
	});
	app.hrcreate = Element.View.extend({
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/project/tpl/tpl_hrcreate.html", function(template){
			
				if(self.model.get("PersonnelId")){
					var url = self.model.urlRoot + "/" + self.model.get("PersonnelId");
					self.model.url = url;
					self.model.fetch({
						success : function(){
							$(self.el).html(_.template(template, self.model.toJSON()));
                            $(self.el).find("h2").html("Edit Resource");
                            if (self.model.get("PhotoUrl") == "" || self.model.get("PhotoUrl") == undefined) {
                                $(self.el).find("#imgPhotoUrl").hide();
                            } else {
                                $(self.el).find("#imgPhotoUrl").show();
                                $(self.el).find("#imgPhotoUrl").attr("src", app.config.docPath.images + self.model.get("PhotoUrl"));

                            }
							self.setevent();
						},
						error : function(model, error){
						}
					});
				}else{
					$(self.el).html(_.template(template, self.model.toJSON()));
					$(self.el).find("#imgPhotoUrl").hide();
					self.setevent();
				}
            });
            return this;
		},
		setevent : function(){
			var self = this;
			$(self.el).find('form *:input[type!=hidden]:first').focus();

			var roles = $(self.el).find("#roles");
			roles.append("<option value=''>Select Role</option>");
			app.component.Call("/Common/Common.svc/rest/PersonnelTypeCombo", "GET", "",
			function(d){
					_.each(JSON.parse(d.JsonDataSet), function(item){
						var sl = (self.model.get("PersonnelTypeCode") == item.Code) ? " selected " : "";
						roles.append("<option value='"+item.Code+"' "+sl+">"+item.CodeName+"</option>");
					});
					$(self.el).find("#roles").trigger("change");
			}, null);
			roles.on("change", function(e){				
				
					if($(this).val() == "PERSONNEL_TYPE_CREW"){
						$(self.el).find(".gcardinfo").attr("style","display:");
						$(self.el).find(".gcardinfo input").removeClass("required").addClass("required");

					}else{
						$(self.el).find(".gcardinfo").attr("style","display:none");
						$(self.el).find(".gcardinfo input").removeClass("required");

					}
			});

			var company = $(self.el).find("#company");
			company.append("<option value=''>Select Company</option>");
			app.component.Call("/Common/Common.svc/rest/CompanyAllCombo", "GET", "",
				function(d){
					_.each(JSON.parse(d.JsonDataSet), function(item){
						var sl = (self.model.get("CompanyId") == item.Code) ? " selected " : "";
						company.append("<option value='"+item.Code+"' "+sl+">"+item.CodeName+"</option>");
					});
			}, null);

			$(self.el).find("#btnSave").on("click",function(e){
				e.preventDefault();
				if(!Element.Tools.Validate($(self.el).find("form"))) 
					return;
				

				var v_PhotoUrl = "";
				var fd = new FormData();
				if ($(self.el).find(".filePhoto")[0].files.length > 0) {

				    fd.append('file', $(self.el).find(".filePhoto")[0].files[0]);
				    fd.append('name', "HrPhoto");
				    $.ajax({
				        url: app.config.uploadpath,
				        type: "POST",
				        processData: false,
				        contentType: false,
				        data: fd,
				        success: function (data) {   //data is Uploaded Path
				            if (data != "") {
				                v_PhotoUrl = data;
				                self.setsave(data);
				            }
				        },
				        error: function (error) {
				            Element.Tools.Error(error);
				        }
				    });
				} else {
				    self.setsave("");
				}
				
			});
	
			$(this.el).find("#btnCancel").on("click",function(e){
				e.preventDefault();
				app.component.Modal.close();
			});
		},
        setsave: function (url) {
            var self = this;
			var selrole = $(self.el).find("#roles option:selected").val();

            self.model.set({
				SigmaOperation : (self.model.get("PersonnelId") != "") ? "U" : "C", 	 						
                FirstName: $(self.el).find("#txtFirstName").val(),
                LastName: $(self.el).find("#txtLastName").val(),
				CompanyId: $(self.el).find("#company").val(),
				PersonnelTypeCode: $(self.el).find("#roles").val(),
				PhotoUrl: (url == "" || url == undefined) ? self.model.get("PhotoUrl") : url,
				EmployeeId: $(self.el).find("#txtEmployeeId").val(),
                PhoneNumber: $(self.el).find("#txtPhoneNumber").val(),
                EmailAddress: $(self.el).find("#txtEmailAddress").val(),
                NfcCardId : (selrole == "PERSONNEL_TYPE_CREW")? $(self.el).find("#txtNfcCardId").val() : "",
				PinCode : (selrole == "PERSONNEL_TYPE_CREW")? $(self.el).find("#txtPinCode").val() : ""              
                
            });
            self.model.apply($(self.el),
                (self.model.get("PersonnelId") != "") ? "PUT" : "POST", {
                    s: function (m, r) {
                        ThisViewPage.render();
                        app.component.Modal.close();
                    },
                    e: function (m, e) {
                        ThisViewPage.render();
                    }
                });

        }

        
	});
})(jQuery);
