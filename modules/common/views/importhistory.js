/*
Written by hitapia(sbang)
Role : import history
*/
var app = app || {};
(function($){
	app.importhistory = Element.View.extend({
		pages : [],
		initialize : function(){
			var self = this;
			self.pages = self.options.pages;
		},
		render : function(){
			var self = this;
			app.TemplateManager.get(app.config.path + "/modules/common/tpl/tpl_importhistory.html", function(template){
				$(self.el).html($(template));
				L(Element.Tools.GetCookie("nav"));
				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ Id : "gotoback", Name : "Go to Previous Page" },
						{ class : "warning", Id : "Delete", Name : "Delete" }
					]
				}).render().el);

				$(self.el).find("#list").html(new app.component.Tablelist({
					list : app.config.path + "/modules/common/tpl/tpl_importhistory_list.html",
					listitem : app.config.path + "/modules/common/tpl/tpl_importhistory_listitem.html",
					coll : "new app.modelimporthistorys()",
					query : self.options.query,
					kind : self.options.kind
				}).render().el);
				$(".title_wrap > h2").html("Import History");

				$(self.el).find("#gotoback").on("click", function(e){
					e.preventDefault();
					window.history.back();
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
                                models.push(new app.modelimporthistory({ 
                                    ImportHistoryId : Number($(this).val()),
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
									self.render();
									app.component.Confirm.close();
								},
								e : function(m, e){
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
		link : function(key){
			var vl = key.split("|");
			var exports = arguments[1];
			if(exports == "export"){
			    window.location = app.config.docPath.template + app.loggeduser.CompanyName + "/" + app.loggeduser.CurrentProjectId + "/exportfiles/" + vl[0] + ".xlsx";
			}else{
				app.component.Modal.show(new app.importerror({ 
					importid : vl[0], filename : vl[1], date : vl[3], failcount : vl[2]
				}), 900);
			}
		}
	});
	app.importlist = Element.View.extend({
		render : function(){
			var self = this;
			app.TemplateManager.get(app.config.path + "/modules/common/tpl/tpl_importlist.html", function(template){
				var msg = "";
				switch(self.options.kind){
					case "HR" :
						msg = "employee";
						break;
					case "ClientCostCode" :
						msg = "client cost code";
						break;
					case "ProjectCostCode" :
						msg = "project cost code";
						break;
					case "MTO" :
						msg = "Material Take Off";
						break;
					case "ConsumableLibrary" :
						msg = "Consumable Library";
						break;
				    case "MeterialLibrary":
				        msg = "Meterial Library";
				        break;
				    case "EquipmentLibrary":
				        msg = "Equipment Library";
				        break;
				    case "CostCode":
				        msg = "Cost Code";
				        break;
					default :
						msg = self.options.kind;
						break;
				}
				$(self.el).html(_.template(template, 
					{ COMMENT : msg, IMPORTFILEDOWNLOAD : self.options.downloadpath }
				));

				$(self.el).find(".btnSaveUp").on("click", function(e){
					e.preventDefault();
					var fd = new FormData();
					fd.append('file',  $(self.el).find(".importfile")[0].files[0]);
					fd.append('name',  "ImportList");
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
						}
					});
				});
				$(self.el).find(".btnCancelUp").on("click", function(e){
					e.preventDefault();
					app.component.Modal.close();
				});
			});
            return this;
		},
		showResult : function(data){
			var self = this;
			app.TemplateManager.get(app.config.path + "/modules/common/tpl/tpl_importresult.html", function(template){
				$(self.el).html(_.template(template, data));
				$(self.el).find("#btnClose").on("click", function(e){
					e.preventDefault();
					app.component.Modal.close();
					ThisViewPage.render();
					if(self.options.s != null)
						self.options.s(data);
				});
			});
		},
		sendSvc : function(path){
			var self = this;
			app.component.Call("/Common/Common.svc/rest/ImportFile?filetype="+self.options.kind+"&filepath="+path,
				"GET", "", function(d){
					if(d.IsSuccessful) { 
						self.showResult(JSON.parse(d.JsonDataSet)[0]);
					}
				}, null, "up");
		}
	});
	app.importerror = Element.View.extend({
		render : function(){
			var self = this;
			app.TemplateManager.getnocache(app.config.path + "/modules/common/tpl/tpl_importerrorlog.html", function(template){
				$(self.el).html(_.template(template));
                $.get(
                    app.config.docPath.template + app.loggeduser.CompanyName + "/" + app.loggeduser.CurrentProjectId + "/exportfiles/" + self.options.importid + ".csv", function (data) {
					var list = data.split("\n");
					$(self.el).find("table").append("<thead />");
					var line = 0;
					_.each(list, function(item){
						var cols = item.split("|||");
						var tr = "";
						if(line > 0)
							tr += "<" + ((line == 0) ? "th" : "tr") + ">";

						_.each(cols, function(col){
							tr += "<" + ((line == 0) ? "th" : "td") + ">"+col+"</" + ((line == 0) ? "th" : "td") + ">";
						});

						if(line > 0)
							tr += "</" + ((line == 0) ? "th" : "tr") + ">";
						if(line == 0){
							$(self.el).find("table > thead").append(tr);
							$(self.el).find("table").append("<tbody />");
						}else{
							$(self.el).find("table > tbody:last").append(tr);
						}
						line++;
					});
				});
				$(self.el).find("table").addClass("table").addClass("table-bordered");
				$(self.el).find("h2").html(self.options.filename + "&nbsp("+self.options.date+")");
				$(self.el).find(".failcomment").html("Fail : "+self.options.failcount);
				$(self.el).find(".export").on("click", function(e){
					e.preventDefault();
					
					window.location = app.config.docPath.template + app.loggeduser.CompanyName + "/" + app.loggeduser.CurrentProjectId + "/exportfiles/" + self.options.importid + ".xlsx";

				});
				$(self.el).find(".btnClose").on("click", function(e){
					e.preventDefault();
					app.component.Modal.close();
				});
			});
            return this;
		}
	});
	app.importmulti = Element.View.extend({
		selectedFiles : null,
		iscancel : false,
		isuploading : false,
		setname : "",
		nowfile : "",
		totalSize : 0,
		uploadedcount : 0,
		totalcount : 0,
		sumuploadedsize : 0,
		filedisplaylist : 0,
		totalprogress : 0,
		uploadingmsg : "",
		importedId : 0,
		cnt : { total : 0, success : 0, fail : 0 },
		render : function(){
			this.iscancel = false;
			this.isuploading = false;
			this.cnt.total = 0;
			this.cnt.success = 0;
			this.cnt.fail = 0;
			this.selectedFiles = null;
			var self = this;
			app.TemplateManager.get(app.config.path + "/modules/common/tpl/tpl_importmulti.html", function(template){
				$(self.el).html(_.template(template));
				
            	if (!Modernizr.draganddrop) {
                	alert("This browser doesn't support File API and Drag & Drop features of HTML5!");
                	return;
            	}
				var box = $(self.el).find("#dragbox");

				$(self.el).find("#dragbox").on("dragenter", function(e){
          			e.stopPropagation();
          			e.preventDefault();
				});
				$(self.el).find("#dragbox").on("dragover", function(e){
          			e.stopPropagation();
          			e.preventDefault();
				});
				$(self.el).find("#btnClose").on("click", function(e){
          			e.preventDefault();
					app.component.Modal.close();
					ThisViewPage.render();
				});
				$(self.el).find("#dragbox").on("drop", function(e){
          			e.stopPropagation();
          			e.preventDefault();
          			self.selectedFiles = e.originalEvent.dataTransfer.files;
          			$(self.el).find("#dragbox").html(self.selectedFiles.length + " file(s) selected for uploading!");
				});
				
            	$(self.el).find("#btnSave").click(function (e) {
          			e.preventDefault();
					$(this).hide();
					$(self.el).find("#btnCancel").text("Cancel Upload & Processing");
					$(self.el).find("#btnCancel").removeClass("btn-default").addClass("btn-warning");
					$(self.el).find(".progress").show();
					self.uploadingmsg = "<strong>Uploading "+self.selectedFiles.length+" file(s), please wait...</strong>";
					$(self.el).find("#uploading").html(self.uploadingmsg + "<p>Prepare to Upload</p>").show();
					$(self.el).find("#dragbox").hide();
					$(self.el).find(".progress").removeClass("active");
					self.totalcount = self.selectedFiles.length;

					self.isuploading = true;
					self.upload();
					/*
                    app.component.Call("/Common/Common.svc/rest/", "GET", "",
                        function(response){
							$(self.el).find(".pop-btn-control > btn").attr("disabled", false);
							if(response.IsSuccessful){
								self.setname = JSON.parse(response.JsonDataSet)[0];
								self.upload();
							}else{
								self.error();
							}
                        }, null
                    );
					*/
                	if (typeof self.selectedFiles == "undefined") {
                    	return;
                	}
            	});
				$(self.el).find("#btnCancel").on("click", function(e){
					e.preventDefault();
					if(self.isuploading){
						self.iscancel = true;
						$(self.el).find("#uploading").html(self.uploadingmsg + "<p>Cancel to upload and process</p>").show();
						$(this).text("Canceling...");
						$(this).attr("disabled", false);
					}else{
						app.component.Modal.close();
					}
				});
			});
            return this;
		},
		upload : function(){
			var self = this;
			var data = new FormData();
			var formdata = new FormData();
			formdata.append('file', self.selectedFiles[self.uploadedcount]);
			formdata.append('name', "DrawingImage");
			//formdata.append('setname', self.setname);
			$(self.el).find("#progressBar").css("width", "0%");
			$(self.el).find("#progressBar").text("0%");
			$(self.el).find("#progressBarTotal")
				.css("width", Math.round(self.uploadedcount * 100 / self.totalcount)+ "%");
			$(self.el).find("#progressBarTotal").text(self.uploadedcount + " / " +self.totalcount);
			self.nowfile = self.selectedFiles[self.uploadedcount].name;
			$(self.el).find("#uploading").html(self.uploadingmsg + "<p>"+self.nowfile+" : Uploading...</p>");
			setTimeout(function(){
				self.sendFileToServer(formdata, status);
				self.uploadedcount++;
			}, 500);
		},
		showresult : function(){
			var self = this;
			$(self.el).find("#progressBarTotal").css("width", "100%");
			$(self.el).find("#progressBarTotal").text(self.uploadedcount + " / " +self.totalcount);
			$(self.el).find(".title").html("Update Result");
			$(self.el).find("#cnt_total").html(self.cnt.total);
			$(self.el).find("#cnt_success").html(self.cnt.success);
			$(self.el).find("#cnt_fail").html(self.cnt.fail);
			$(self.el).find("#done").show();
			$(self.el).find("#donecontrol").show();
			$(self.el).find("#doing").hide();
			$(self.el).find("#doingcontrol").hide();
		},
		upnext : function(){
			var self = this;
			if(self.uploadedcount == self.selectedFiles.length){
				self.showresult();
			}else{
				if(self.iscancel){
					self.showresult();
				}else{
					setTimeout(function(){
						$(self.el).find("#progressBar").css("width", "100%");
						$(self.el).find("#progressBar").text("100%");
						self.upload();
					}, 500);
				}
			}
		},
		sendFileToServer : function(formData, status){
			var self = this;
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress",  function(evt){
				L(evt);
				if (evt.lengthComputable) {
					$(self.el).find("#progressBar").css("width", Math.round(evt.loaded * 100 / evt.total) + "%");
					$(self.el).find("#progressBar").text(Math.round(evt.loaded * 100 / evt.total) + "%");
				}else{
					$(self.el).find("#progressBarTotal").css("width", "100%");
					$(self.el).find('#progressBarTotal').innerHTML = 'unable to compute';
				}
			});
            xhr.addEventListener("load", function(evt){
				var path = evt.target.response;
				$(self.el).find("#uploading").html(self.uploadingmsg + "<p>"+self.nowfile+" : Processing...</p>");
				app.component.Call("/Common/Common.svc/rest/ImportFile?filetype=DrawingImage&ImportedId="+self.importedId+"&filepath="+path, "GET", "",
					function(response){
						self.cnt.total++;
						//self.importedId = JSON.parse(response.JsonDataSet)[0];
						if(response.IsSuccessful){
							self.cnt.success++;
						}else{
							self.cnt.fail++;
						}
						self.upnext();
					}, 
					function(){
						self.cnt.total++;
						self.cnt.fail++;
						self.upnext();
					}, true, { autoclosewhenerror : false }
				);
			});
            xhr.addEventListener("error", function(evt){
				L("There was an error attempting to upload the file.");
			});
            xhr.addEventListener("abort", function(evt){
          		L("The upload has been canceled by the user or the browser dropped the connection.");
			});
            xhr.open("POST", app.config.uploadpath);
            xhr.send(formData);
		}
	});
})(jQuery)
