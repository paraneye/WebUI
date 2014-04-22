
var app = app || {};
(function($){
	app.companycreate = Element.View.extend({	
		render : function(){
			var self = this;			
			app.TemplateManager.get("../../modules/global/tpl/tpl_companycreate.html", function(template){
				if(self.model.get("CompanyId")){
					var url = self.model.urlRoot + "/" + self.model.get("CompanyId");
					self.model.url = url;
					self.model.fetch({
						success : function(){
							$(self.el).html(_.template(template, self.model.toJSON()));
							$(self.el).find("h2").html("Edit Company");

							var logopath = self.model.get("LogoFilePath");
							if (logopath != "") {
								$(self.el).find(".img-thumbnail").attr("src","/SigmaStorage/"+logopath);
							    $(self.el).find(".img-thumbnail").show();
							} else {
							    $(self.el).find(".img-thumbnail").hide();
							}
							self.setevent();
						},
						error : function(model, error){
							Element.Tools.Error(error);
						}
					});

					
				}else{
				    $(self.el).html(_.template(template, self.model.toJSON()));
				    $(self.el).find(".img-thumbnail").hide();
					self.setevent();
				}
			});
            return this;
		},
		setsave : function(data){
			var self = this;

			self.model.set({
				SigmaOperation : (self.model.get("CompanyId") == "") ? "C" : "U",
				Name : $(self.el).find("#txtComName").val(),
				Address : $(self.el).find("#txtComAddress").val(),
				CompanyTypeCode : 	$(self.el).find("#cboType option:selected").val(),
				LogoFilePath : data
			});
			self.model.apply($(self.el),
				(self.model.get("CompanyId") != "") ? "PUT" : "POST", {
				s : function(m, r){
					ThisViewPage.render();
					app.component.Modal.close();
				},
				e : function(m, e){
					Element.Tools.Error(e);
					app.component.Modal.close();
				}
			});
		},
		/*getvalidationcheck : function(){
			var self =this;
			var file = $(self.el).find("#file")[0].value;
			var ret = true;
								
				if(file != "" && file != undefined){
					$(self.el).find("#file").parent().parent().removeClass("has-error");
					$(self.el).find("#divcmd").remove();	

					if(file.match(/\.(gif|jpg|jpeg|png|tif|bmp)$/i)==null){
						$(self.el).find("#file").parent().parent().removeClass("has-error").addClass("has-error");
												
						$(self.el).find("#file").after("<div id='divcmd' class='text-danger'>select file (ex:*.jpg,*.gif,*.tif,*.bmp,*.png)</div>");
						ret = false;
					}

				}
			return ret;

		},*/
		setevent : function(){
			var self = this;
			$(self.el).find("#cboType").append("<option value=''>Select Type</option>");
			app.component.Call("/Common/Common.svc/rest/CompanyTypeCombo", "GET", "",
				function(d){
					_.each(JSON.parse(d.JsonDataSet), function(item){
						var sel = (self.model.get("CompanyTypeCode") == item.Code) ? " selected " : "";
						$(self.el).find("#cboType")
							.append("<option value='"+item.Code+"' "+sel+">"+item.CodeName+"</option>");
					});
				}, null);
		
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

			$(self.el).find("#btnSave").on("click",function(e){
			    e.preventDefault();
				if(!Element.Tools.Validate($(self.el).find("form"))){
					return;
				}
				//if(!self.getvalidationcheck()){
				//return ;
				//}
			    
			    var v_PhotoUrl = $(self.el).find(".filePhoto").val();

			    if (v_PhotoUrl == "") {
			        self.setsave("");
			        app.component.Modal.close();
			    } else {			        
			        if (v_PhotoUrl != "" && v_PhotoUrl != undefined) {
			            var fd = new FormData();
			            fd.append('file', $(self.el).find(".filePhoto")[0].files[0]);
			            fd.append('name', "Photo");
			            $.ajax({
			                url: app.config.uploadpath,
			                type: "POST",
			                processData: false,
			                contentType: false,
			                data: fd,
			                success: function (data) {   //data is Uploaded Path
			                    if (data != "") {
			                        self.setsave(data);
			                    }
			                },
			                error: function (error) {
			                    Element.Tools.Error(error);
			                }
			            });
			        }
			    }
			});
			$(this.el).find("#btnCancel").on("click",function(e){
				e.preventDefault();
				app.component.Modal.close();
			});
		}
	
	});
})(jQuery);
