
var app = app || {};
(function($){
	app.documentcreate = Element.View.extend({
		render : function(){
			var self = this;			
			app.TemplateManager.get("../../modules/project/tpl/tpl_documentcreate.html", function(template){
				$(self.el).html(_.template(template,self.model.toJSON()));
				self.renderscreen();
			});
            return this;
		},
		renderscreen : function(){
			var self = this;
			$(self.el).find("#btnSave").on("click", function(e){
				e.preventDefault();
				if(!Element.Tools.Validate($(self.el).find("form"))) 
        			return;
				if(!self.validationcheck())
					return false;

				if($(self.el).find("#file")[0].files[0] == undefined){
					$(self.el).find("#file")[0].focus();
					return false;
				}
				if($(self.el).find("#title").val() == ""){
					$(self.el).find("#title").focus();
					return false;
				}
				var fd = new FormData();
				fd.append('file',  $(self.el).find("#file")[0].files[0]);
				fd.append('name',  "Document");
				$.ajax({
					url : app.config.uploadpath,
					type : "POST",
					processData: false,
					contentType: false,
					data : fd,
					success : function(data){
						L(data);
						if(data != ""){
							self.sendSvc(data);
						}
					},
					error : function(m){
							Element.Tools.Error("file upload fail.");
					}	
				});
			});
			$(self.el).find("#btnCancel").on("click", function(e){
				e.preventDefault();
				app.component.Modal.close();
			});

			$(self.el).find(".selDocumentType").append("<option value=''>Select Document Type</option>");
			app.component.Call("/GlobalSettings/SigmaGlobalSettings.svc/rest/FileType/DOC_TYPE", "GET", "",
				function(d){
					_.each(JSON.parse(d.JsonDataSet), function(item){
						var sl = (self.model.get("FileTypeCode") == item.Code) ? " selected " : "";
						$(self.el).find(".selDocumentType")
							.append("<option value='"+item.Code+"' "+sl+">"+item.CodeName+"</option>");
					});
				}, null
			);
			$(self.el).find(".selDocumentType").on("change", function(e){
				var type = $(this).find("option:selected").val();
				if(type=="DOC_TYPE_COVER"){
					$(self.el).find("#file").attr("accept","image/png,image/bmp,image/jpgp,image/gif,image/tif");
				}else{
					$(self.el).find("#file").attr("accept","application/pdf");
				}

			});
			
		},
		sendSvc : function(data){
			var self = this;
			var fileinfo = {};
			
			var sendfilename = self.model.get("FileTitle");
			if(data != ""){
				sendfilename = $(self.el).find("#file")[0].files[0].name;
				fileinfo = {
					SigmaOperation : "",
					UploadedFileInfoId : 0,
					FileStoreId : 0,
					Name : sendfilename,
					Size : 0,
					Path : data,
					UploadedBy : "",
					UploadedDate : "",
					FileExtension : "",
					Revision : "",
					CreatedBy : "",
					UpdatedBy : ""
				}
			}
			self.model = new app.document({
					SigmaOperation : "C",
				FileTitle : $(self.el).find("#title").val(),
				FileDescription : $(self.el).find("#desc").val(),
				FileCategory : "FILE_CATEGORY_DOCUMENT",
				FileTypeCode : $(self.el).find(".selDocumentType option:selected").val(),//combo
				UploadedFileInfo : fileinfo
			});
			
			self.model.apply($(self.el), "POST", {
				s : function(r){
					ThisViewPage.render();
					app.component.Modal.close();
				},
				e : function(x, e, c){
					Element.Tools.Error(e);
				}
			});
		},
		validationcheck : function(){
			var self = this;
			var file = $(self.el).find("#file")[0].value;
			var ret = true;
			$(self.el).find("#file").parent().parent().removeClass("has-error");
			$(self.el).find("#divcmd").remove();

			if(file == ""){
				$(self.el).find("#file").parent().parent().removeClass("has-error").addClass("has-error");
				ret = false;
			}
		
			var type = $(self.el).find(".selDocumentType").find("option:selected").val();
			if(type == "DOC_TYPE_COVER"){
					if(file.match(/\.(gif|jpg|jpeg|png|tif|bmp)$/i)==null){
					$(self.el).find("#file").parent().parent().removeClass("has-error").addClass("has-error");
					$(self.el).find("#file").after("<div id='divcmd' class='text-danger'>select file (ex:*.jpg,*.gif,*.tif,*.bmp,*.png)</div>");
					ret = false;
					}
					
			}else if(file.match(/\.(pdf)$/i) == null){				
					$(self.el).find("#file").parent().parent().removeClass("has-error").addClass("has-error");
					$(self.el).find("#file").after("<div id='divcmd' class='text-danger'>select file (ex:*.pdf)</div>");
					ret = false;
					
			}

			return ret;

		}
	});
	
	app.documentedit = Element.View.extend({ 
		render : function(){
			var self = this;			
			app.TemplateManager.get("../../modules/project/tpl/tpl_documentedit.html", function(template){
				self.model.fetch({
					url : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/FileStores/" + self.model.get("FileStoreId"),	
					success : function(){
						$(self.el).html(_.template(template,self.model.toJSON()));
						$(self.el).find(".title").html("Edit Document");
						//$(self.el).find(".title").html(self.model.get("FileTitle"));
						self.renderscreen();
						self.setevent();

						self.historyRender();	

					},
					error : function(m, e){
						Element.Tools.Error(e);
					}
				});
				
			});
            return this;
		},
		renderscreen : function(){	
			var self = this;
			var v_date = self.model.get("LastModified");				
			var v_updatedate = eval(v_date.replace(/\/Date\((\d+)\)\//gi, "new Date($1)"));
			var v_updateby = " by "+ self.model.get("ModifiedBy");
			if(v_updateby == undefined)
					v_updateby="";
		
			$(self.el).find("#lbllastmodified").html(v_updatedate.toUTCString()+""+v_updateby);
								
			if(self.model.get("FileTypeCode")=="DOC_TYPE_COVER"){
				$(self.el).find("#file").attr("accept","image/png,image/bmp,image/jpgp,image/gif,image/tif");
			}else{
				$(self.el).find("#file").attr("accept","application/pdf");
			}

			if(self.model.get("FileStoreId") != ""){			
				$(self.el).find("#title").attr("readonly","readonly");
				$(self.el).find("#file").removeClass("required");
			}else{
				$(self.el).find("#title").attr("readonly","");
				$(self.el).find("#file").addClass("required");
			}
			
		},
		validationcheck : function(){
			var self = this;
			var file = $(self.el).find("#file")[0].value;
			var ret = true;
					
			if(self.model.get("FileStoreId") == "" || self.model.get("FileStoreId") == 0){
			//new
				if(file == ""){
					$(self.el).find("#file").parent().parent().removeClass("has-error").addClass("has-error");
					ret = false;
				}else{
					$(self.el).find("#file").parent().parent().removeClass("has-error");
				
				}

				
			}
			if(file != "" && file != undefined){
				var type = self.model.get("FileTypeCode");
				$(self.el).find("#file").parent().parent().removeClass("has-error");
				$(self.el).find("#divcmd").remove();

				if(type == "DOC_TYPE_COVER"){
					if(file.match(/\.(gif|jpg|jpeg|png|tif|bmp)$/i)==null){
						$(self.el).find("#file").parent().parent().removeClass("has-error").addClass("has-error");
												
						$(self.el).find("#file").after("<div id='divcmd' class='text-danger'>select file (ex:*.jpg,*.gif,*.tif,*.bmp,*.png)</div>");
						ret = false;
					}
					
				}else{
					if(file.match(/\.(pdf)$/i) == null){				
						$(self.el).find("#file").parent().parent().removeClass("has-error").addClass("has-error");
										
						$(self.el).find("#file").after("<div id='divcmd' class='text-danger'>select file (ex:*.pdf)</div>");
						ret = false;
					}
				}
			}

			return ret;

		},
		setevent : function(){			
			var self = this;	
									
			$(self.el).find("#btnSave").on("click", function(e){
				e.preventDefault();
				if(!Element.Tools.Validate($(self.el).find("form"))) 
        			return;
				if(!self.validationcheck())
					return ;

				if($(self.el).find("#file")[0].value != ""){
					var fd = new FormData();
					fd.append('file',  $(self.el).find("#file")[0].files[0]);
					fd.append('name',  "Document");					
					
					$.ajax({
						url : app.config.uploadpath,
						type : "POST",
						processData: false,
						contentType: false,
						data : fd,
						success : function(data){
							if(data != ""){
								self.sendSvc(data);
							}
						},
						error : function(e){
							Element.Tools.Error(e);
						}
					});

				}else{
					self.sendSvc("");
				}
			});
			$(self.el).find("#btnCancel").on("click", function(e){
				e.preventDefault();
				app.component.Modal.close();
			});

		},
		hrlist : "",
		historyRender : function(){	
			var self = this;

				app.component.Call(
					app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/UploadedFileInfos?s_option=FileStoreId&s_key="+self.model.get("FileStoreId"),  
					"GET",                                      
					"",                                         
					function(data){                             
						self.hrlist = JSON.parse(data.JsonDataSet);
						var i =0;
						var tb = $(self.el).find("#sublist");
						L(self.hrlist.length);
						if(self.hrlist.length ==0){
							var newline ="<tr><td colspan='4' style='text-align:center;'>No Record</td></tr>";
							tb.find("table > tbody:last").append(newline);
						}
						_.each(self.hrlist, function(item){
							var newline = $(self.newcustom(item));			
							tb.find("table > tbody:last").append(newline);
				
					
						});
					}, 
					null                                        
				);

			
		},	
		newcustom : function(item){
			var tr = "";

			if(item != null && item != undefined){
					var v_uploaddate="";
					if(item.UploadedDate!=""){						
						v_uploaddate = eval(item.UploadedDate.replace(/\/Date\((\d+)\)\//gi, "new Date($1)"));
					}
					tr += "<tr>";
					tr += "<td style='text-align:center;'>"+item.Revision+"</td>";
					tr += "<td><a href='"+app.config.docPath.docs + item.Path+"' target='blank'>"+item.Name+"</a></td>";
					tr += "<td>"+v_uploaddate.toUTCString()   +"</td>";		
					tr += "<td>"+item.UploadedBy+"</td>";
					tr += "</tr>";
					
			}

			return tr;
		},
		sendSvc : function(data){
			var self = this;
			var fileinfo = {};
			var sendfilename = self.model.get("FileTitle");
			if(data != ""){
				sendfilename = $(self.el).find("#file")[0].files[0].name;
				fileinfo = {
					SigmaOperation : "C",
					UploadedFileInfoId : 0,
					FileStoreId : (self.model.get("FileStoreId")=="")? 0 : self.model.get("FileStoreId"),
					Name : sendfilename,
					Size : 0,
					Path : data,
					UploadedBy : "",
					UploadedDate : "",
					FileExtension : "",
					Revision : "",
					CreatedBy : "",
					UpdatedBy : ""
				}
			}
			self.model = new app.document({
				FileStoreId : (self.model.get("FileStoreId")=="")? 0 : self.model.get("FileStoreId"),
				FileTitle : $(self.el).find("#title").val(),
				FileDescription : $(self.el).find("#desc").val(),
				FileCategory : "FILE_CATEGORY_DOCUMENT",
				FileTypeCode : self.model.get("FileTypeCode"),
				UploadedFileInfo : fileinfo
			});
			
			self.model.apply($(self.el), "PUT", {
				s : function(r){
					ThisViewPage.render();
					app.component.Modal.close();
				},
				e : function(x, e, c){
					Element.Tools.Error(e);
					app.component.Modal.close();
				}
			});
		}


	});
})(jQuery);
