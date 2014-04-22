
var app = app || {};
(function($){
	app.drawingtypecreate = Element.View.extend({			
		render : function(){
			var self = this;			
			app.TemplateManager.get("../../modules/mto/tpl/tpl_drawingtypecreate.html", function(template){
							
				if(self.model.get("Code")){
					var url = "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaCodes/" + self.model.get("Code") + "/"+ self.model.get("CodeCategory");
					self.model.url = url;
					self.model.fetch({
							success : function(){
							$(self.el).html(_.template(template, self.model.toJSON()));
                            $(self.el).find("h2").html("Edit Drawing Type");
							self.renderscreen();
							self.setevent();
												
							
						},
						error : function(model, error){
						}
					});
				}else{
					$(self.el).html(_.template(template, self.model.toJSON()));
					self.renderscreen();
					self.setevent();
				}


					
			});
            return this;
		},
		renderscreen : function(){
							
			
		},
		setevent : function(){
			var self = this;

			$(self.el).find("#btnCancel").on("click", function(e){
				e.preventDefault();
				app.component.Modal.close();
			});

			$(this.el).find("#btnSave").on("click",function(e){
				e.preventDefault();
				if(!Element.Tools.Validate($(self.el).find("form"))) 
        			return;		
				
					self.model.set({
						SigmaOperation : (self.model.get("Code") != "") ? "U" : "C",
						Code: self.model.get("Code"),
						CodeCategory : "DRAWING_TYPE",
						CodeName : $(self.el).find("#txtDrawingType").val(),
						Description : $(self.el).find("#txtDrawingDesc").val(),
						IsActive : "Y"
					});
			
					self.model.apply($(self.el),
						(self.model.get("Code") != "") ? "PUT" : "POST", {
						s : function(m, r){
							ThisViewPage.render();
							app.component.Modal.close();
						},
						e : function(m, e){
							app.component.Modal.close();
						}
					});

			});


		}
		
	});
})(jQuery);
