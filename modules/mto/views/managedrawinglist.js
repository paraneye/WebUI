var app = app || {};
(function($){
	app.managedrawinglistview = Element.View.extend({		
		pages : ["PROJECT", "Data", "Drawings"],
		seltr : null,
		sendfilename : "",
		sendfilepath : "",
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/mto/tpl/tpl_managedrawinglistview.html", function(template){
				$(self.el).html($(template));

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class : "primary", Id : "btnAdd", Name : "Add New" },
						{ class : "primary", Id : "btnImportDrawing", Name : "Upload Drawing" },
						{ Id : "btnImportList", Name : "Import File" },
						{ Id : "btnImportHistory", Name : "Import History" },
						{ Id : "menuListViewOption", Name : "List View Option", buttons : [	
								{ Id : "btnListView_All", Name : " ALL" },
								{ Id : "btnListView_Normal", Name : " Normal" },
								{ Id : "btnListView_OrphanDrawings", Name : " Orphan Drawings" },
								{ Id : "btnListView_Unbound", Name : " Unbound Drawing Info." }
						] },
						{ class : "warning", Id : "btnDelete", Name : "Delete" }
					]
				}).render().el);

				$(self.el).find("#controls").html(new app.component.SearchControl({
				    options: [
						{ Value: "DrawingName", Name: "Drawing Num." },
						{ Value: "FileName", Name: "File Name" },
						{ Value: "DrawingType", Name: "Drawing Type" }
				    ],
				    query: self.options.query
				}).render().el);

				$(self.el).find(".dropdown-menu .glyphicon").remove();
				if(self.options.query.hasOwnProperty("ViewOption")){
					if(self.options.query.ViewOption == "N"){
						$(self.el).find("#menuListViewOption").html("List View Option - Normal <span class='caret'></span>");
						$(self.el).find("#btnListView_Normal a").prepend("<span class='glyphicon glyphicon-ok'></span>&nbsp;");
					}else if(self.options.query.ViewOption == "U"){
						$(self.el).find("#menuListViewOption").html("List View Option - Unbound Drawing Info. <span class='caret'></span>&nbsp;");
						$(self.el).find("#btnListView_Unbound a").prepend("<span class='glyphicon glyphicon-ok'></span>");
					}else if(self.options.query.ViewOption == "O"){
						$(self.el).find("#menuListViewOption").html("List View Option - Orphan Drawings <span class='caret'></span>&nbsp;");
						$(self.el).find("#btnListView_OrphanDrawings a").prepend("<span class='glyphicon glyphicon-ok'></span>");
					}else{
						$(self.el).find("#menuListViewOption").html("List View Option - ALL <span class='caret'></span>&nbsp;");
						$(self.el).find("#btnListView_All a").prepend("<span class='glyphicon glyphicon-ok'></span>");
					}
				}else{
					$(self.el).find("#menuListViewOption").html("List View Option - ALL <span class='caret'></span>");
					$(self.el).find("#btnListView_All a").prepend("<span class='glyphicon glyphicon-ok'></span>");
				}
				
				$(self.el).find("#directfileup").hide();
				$(self.el).find("#directfileup").on("change", function(e){
					if($(self.el).find("#directfileup")[0].files[0] != null){
						self.sendfilename = $(self.el).find("#directfileup")[0].files[0].name;
						self.uploadImage();
					}
				});
				$(self.el).find("#btnAdd").on("click",function(){				
					app.component.Modal.show(new app.managedrawingcreate({ model : new app.drawingtype() }), 800);
				});

				$(self.el).find("#btnBindDrawings").on("click",function(e){	
					app.component.Call(
						"/ProjectData/SigmaProjectData.svc/rest/DrawingBinding", "PUT",
						JSON.stringify( { paramObj : new app.drawingtype().toJSON() } ),
						function(d){
							self.renderlist();
						}, null
					);
				});

				$(self.el).find("#btnImportDrawing").on("click",function(e){	
					app.component.Modal.show(new app.importmulti(
						{ kind : "DrawingImage", downloadpath : "" }
					), 600);
				});
				
				$(self.el).find("#btnImportList").on("click",function(e){	
					e.preventDefault();
					app.component.Modal.show(new app.importlist(
						{ kind : "Drawing", downloadpath : app.config.docPath.template + app.config.downloads.drawingtemplate }
					), 600);
				});
				app.component.Call(
					"/ProjectData/SigmaProjectData.svc/rest/DrawingBinding", "PUT",
					JSON.stringify( { paramObj : new app.drawingtype().toJSON() } ),
					function(d){
						self.renderlist();
					}, null
				);

				$(self.el).find("#btnDelete").on("click",function(e){	
					e.preventDefault();
					if(!Element.Tools.ValidateCheck($(self.el).find("#list")))
					return;
					app.component.Confirm.show(
						{ COMMENT : "Are you sure you want to delete the selected item(s)?", POS : "OK", NAG : "Cancel" },
						function(){
							var models = [];
							var filemodels = [];
                            $(self.el).find("input[name=key]:checked").each(function() {
								if($(this).val() == 0){
									filemodels.push(new app.drawingtype({ 
										FileStoreId : Number($(this).parent().find("input[name='fskey']").val()),
										SigmaOperation : "D"
									})); 
								}else{
									models.push(new app.drawingtype({ 
										DrawingId : Number($(this).val()),
										SigmaOperation : "D"
									})); 
								}
							});
							if(models.length == 0 && filemodels.length == 0){
								app.component.Confirm.close();
								return false;
							}
							if(filemodels.length > 0){
								Element.Tools.Multi(
									"/GlobalSettings/SigmaGlobalSettings.svc/rest/FileStores/Multi",
									filemodels,
									$(self.el), {
									s : function(m, r){
										if(models.length > 0){
											self.drawingdel(models);
										}else{
											self.render();
											app.component.Confirm.close();
										}
									},
									e : function(m, e){
										app.component.Confirm.close();
									}
								});
							}else{
								self.drawingdel(models);
							}
						},
						function(){ }
					);
				});

				$(self.el).find("#btnImportHistory").on("click",function(e){	
					e.preventDefault();
					app.router.navigate("managedrawingimportlist", { trigger : true })
				});

				$(self.el).find("#btnListView_All").on("click",function(e){	
					e.preventDefault();
					window.location = "#managedrawinglist?ViewOption=";
				});
				$(self.el).find("#btnListView_Normal").on("click",function(e){	
					e.preventDefault();
					window.location = "#managedrawinglist?ViewOption=N";
				});
				$(self.el).find("#btnListView_Unbound").on("click",function(e){	
					e.preventDefault();
					window.location = "#managedrawinglist?ViewOption=U";
				});
				$(self.el).find("#btnListView_OrphanDrawings").on("click",function(e){	
					e.preventDefault();
					window.location = "#managedrawinglist?ViewOption=O";
				});
				$(self.el).find("#btnRefDetailDrawings").on("click",function(e){	
					L("Ref Detail Drawings");
				});
				
				self.renderscreen();

			});
            return this;
		},
		drawingdel : function(models){
			var self = this;
			Element.Tools.Multi(
				"/ProjectData/SigmaProjectData.svc/rest/Drawings/Multi",
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
		link : function(num){
			var self = ThisViewPage;
			var tmp = arguments[1];
			if(tmp == "showimage"){
				if(arguments[3] == ""){
					app.component.Modal.show(new app.managedrawingcreate({ 
						model : new app.drawingcreate({ DrawingId : arguments[2] }) , upload : false
					}), 800);
				}else{
					app.component.Modal.show(new app.drawingimageviewer( { img : app.config.docPath.docs + arguments[3], dname : arguments[2] } ), 900);
				}
			}else if(tmp == "showpdf"){
				app.component.Modal.show(new app.pdfviewer( { pdf : arguments[3].replace("jpg", "pdf"), dname : arguments[2] } ), 900);
			}else{
			}
		},
		uploadImage : function(){
			var self = ThisViewPage;
			var fd = new FormData();
			self.sendfilename = $(self.el).find("#directfileup")[0].files[0].name;
			fd.append('file',  $(self.el).find("#directfileup")[0].files[0]);
			fd.append('name',  "DrawingImage");
			app.component.LoadingData(true, "up");
			$(self.el).find("#list input").attr("disabled", true);
			$(self.el).find("#list a").attr("disabled", "disabled");
			$.ajax({
				url : app.config.uploadpath,
				type : "POST",
				processData: false,
				contentType: false,
				data : fd,
				success : function(data){
					var upmodel = new app.drawingcreate( { DrawingId : $(self.el).find("#fileupdid").val() } );
					var url = upmodel.urlRoot + "/" + $(self.el).find("#fileupdid").val();
					upmodel.url = url;
					upmodel.fetch({
						success : function(){
							var model = {
								SigmaOperation : "U",
								DrawingId : upmodel.get("DrawingId"),
								CWP : upmodel.get("CwpName"),
								Name : upmodel.get("DrawingNum"),
								Revision :upmodel.get("Revision"),
								FileName : self.sendfilename,
								FilePath : data,
								Title  :upmodel.get("Title"),
								DrawingType  :upmodel.get("Type"),
								Description : upmodel.get("Description"),
								ReferenceDrawings : upmodel.get("ReferenceDrawing"),
								DetailedDrawings : upmodel.get("DetailedDrawing")
							};
							app.component.Call("/ProjectData/SigmaProjectData.svc/rest/Drawings", "PUT",
								JSON.stringify( { paramObj : model } ),
								function(d){
									app.component.LoadingData(false);
									$(self.el).find("#list input").attr("disabled", false);
									$(self.el).find("#list a").removeAttr("disabled");
									if(d.IsSuccessful){
										ThisViewPage.render();
										//$(self.el).find("td:last").html("<a href=\"javascript:Element.Tools.LinkClick('"+self.sendfilename+"', 'showimage', '"+upmodel.get("DrawingId")+"');\">"++"</a>");
									}
								},
								function(d){
									app.component.LoadingData(false);
									$(self.el).find("#list input").attr("disabled", false);
									$(self.el).find("#list a").removeAttr("disabled");
								}
							);
						},
						error : function(model, error){
							app.component.LoadingData(false);
							Element.Tools.Error(error);
						}
					});
				},
				error : function(data, text){
					app.component.LoadingData(false);
					Element.Tools.Error(text);
				}
			});
		},
		renderlist : function(){
			var self = this;
			$(self.el).find("#list").html(new app.component.Tablelist({
				list : "../../modules/mto/tpl/tpl_managedrawinglist.html",
				listitem : "../../modules/mto/tpl/tpl_managedrawinglistitem.html",
				coll : "new app.managedrawinglist()",
				nostriped : true,
				query : self.options.query,
				callback : function(){
					$(self.el).find("#list tr").css("cursor", "pointer");
					$(self.el).find("#list tr").on("click", function(e){
						var $target = $(event.target);
						if(!$target.is('td:first') && !$target.is('input:checkbox') && !$target.is('a')){
							var did = $(this).find("input[name='key']").val();
							var fname = $(this).find("input[name='fname']").val();
							var fid = $(this).find("input[name='fskey']").val();
							if(did  > 0){
								app.component.Modal.show(new app.managedrawingcreate({ 
									model : new app.drawingcreate({ DrawingId : did }) , upload : false
								}), 800);
							}else if(fid != ""){
								app.component.Modal.show(
									new app.managedrawingcreate({ 
										model : new app.drawingcreate(),
										filename : fname,
										filestoreid : fid
									}), 800
								);
							}
						}
					});
				}
			}).render().el);
		},
		renderscreen : function(){	
			var self = this;	
		}
	});
})(jQuery);
