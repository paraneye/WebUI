
var app = app || {};
(function($){
	app.managedrawingcreate = Element.View.extend({
		filestoreid : "",
		filename : "",
		sendfilename : '',
		initialize : function(options){
			this.filestoreid = options.filestoreid;
			this.filename = options.filename;
		},
		render : function(){
			var self = this;			
			app.TemplateManager.get("../../modules/mto/tpl/tpl_managedrawingcreate.html", function(template){
				$(self.el).html(_.template(template, self.model.toJSON()));
				if(self.model.get("DrawingId")){
					var url = self.model.urlRoot + "/" + self.model.get("DrawingId");
					self.model.url = url;
					self.model.fetch({
						success : function(){
                            $(self.el).find("#txtDrawingNumber").val(self.model.get("DrawingNum"));
                            $(self.el).find("#txtRevision").val(self.model.get("Revision"));
                            $(self.el).find("#txtTitle").val(self.model.get("Title"));
                            $(self.el).find("#txtDescription").val(self.model.get("Description"));
                            $(self.el).find("#txtRefDrawings").val(self.model.get("ReferenceDrawing"));
                            $(self.el).find("#txtDetailDrawings").val(self.model.get("DetailedDrawing"));
							if(self.model.get("FileName")){
								$(self.el).find("#imagelink").show();
								$(self.el).find("#file").hide();
								$(self.el).find("#savedimage").text(self.model.get("DrawingNum"));
							}else{
								$(self.el).find("#imagelink").hide();
								$(self.el).find("#file").show();
							}
							self.sendfilename = self.model.get("FileName");
                            $(self.el).find("h2").html("Edit Drawing");
							self.renderscreen();
						},
						error : function(model, error){
							Element.Tools.Error(error);
						}
					});
				}else{
					if(self.filestoreid != undefined){
						$(self.el).find("h2").html("Edit Orphan Drawing");
						self.renderscreen();
						$(self.el).find("#savedimage").text(self.filename);
						$(self.el).find("#imagelink").show();
						$(self.el).find("#file").hide();
					}else{
						$(self.el).find("#imagelink").hide();
						$(self.el).find("#file").show();
						self.renderscreen();
					}
				}
			});
            return this;
		},
		renderscreen : function(){
			var self = this;
			$(self.el).find("#cboCwp").append("<option value=''>Select a CWP</option>");
			app.component.Call("/Common/Common.svc/rest/CwpCombo", "GET", "",
				function(d){
					_.each(JSON.parse(d.JsonDataSet), function(item){
						var sel = (self.model.get("CwpId") == item.Code) ? " selected " : "";
						$(self.el).find("#cboCwp")
							.append("<option value='"+item.CodeName+"' "+sel+">"+item.CodeName+"</option>");
					});
			}, null);

			$(self.el).find("#cboType").append("<option value=''>Select a Drawing Type</option>");
			app.component.Call("/Common/Common.svc/rest/DrawingType", "GET", "",
				function(d){
					_.each(JSON.parse(d.JsonDataSet), function(item){
						var sel = (self.model.get("Type") == item.CodeName) ? " selected " : "";
						$(self.el).find("#cboType")
							.append("<option value='"+item.Code+"' "+sel+">"+item.CodeName+"</option>");
					});
			}, null);

			$(self.el).find("#btnSave").on("click", function(e){
				e.preventDefault();
				if(!Element.Tools.Validate($(self.el).find("form")))
					return;
				if($(self.el).find("#file")[0].files[0]){
					var fd = new FormData();
					self.sendfilename = $(self.el).find("#file")[0].files[0].name;
					fd.append('file',  $(self.el).find("#file")[0].files[0]);
					fd.append('name',  "DrawingImage");
					app.component.LoadingData(true);
					$.ajax({
						url : app.config.uploadpath,
						type : "POST",
						processData: false,
						contentType: false,
						data : fd,
						success : function(data){
							app.component.LoadingData(false);
							if(data != ""){
								self.sendSvc(data);
							}
						},
						error : function(data, text){
							app.component.LoadingData(false);
							Element.Tools.Error(text);
						}
					});
				}else{
					if(self.model.get("DraiwngId") != "")
						self.sendSvc("");
				}
			});
			$(self.el).find("#btnCancel").on("click", function(e){
				e.preventDefault();
				app.component.Modal.close();
			});
		},
		sendSvc : function(path){
			var self = this;
			var model = new app.drawingtype({
				SigmaOperation : self.model.get("DrawingId") ? "U" : "C",
				DrawingId : self.model.get("DrawingId"),
				CWP : $(self.el).find("#cboCwp").val(),
				Name : $(self.el).find("#txtDrawingNumber").val(),
				Revision : $(self.el).find("#txtRevision").val(),
				FileName : (self.filestoreid == undefined) ? self.sendfilename : self.filename,
				FilePath : path,
				Title : $(self.el).find("#txtTitle").val(),
				DrawingType : $(self.el).find("#cboType").val(),
				Description : $(self.el).find("#txtDescription").val(),
				ReferenceDrawings : $(self.el).find("#txtRefDrawings").val(),
				DetailedDrawings : $(self.el).find("#txtDetailDrawings").val(),
				FileStoreId : self.filestoreid || "" 
			});
			model.apply($(self.el),
				(self.model.get("DrawingId") != "" && self.filestoreid == undefined) ? "PUT" : "POST", {
				s : function(m, r){
					ThisViewPage.render();
					app.component.Modal.close();
				},
				e : function(m, e){
					ThisViewPage.render();
				}
			});
		}
	});
})(jQuery);
