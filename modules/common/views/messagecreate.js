
var app = app || {};
(function($){	
	app.messagecreate = Element.View.extend({	
		render : function(){
			var self = this;			
			app.TemplateManager.get("../../modules/global/tpl/tpl_messagecreate.html", function(template){
				if(self.model.get("MsgSeq")){
					var url = self.model.urlRoot + "/" + self.model.get("MsgTypeCode") + "/" +self.model.get("MsgSeq");
					self.model.url = url;
					self.model.fetch({
						success : function(data){
							$(self.el).html(_.template(template, self.model.toJSON()));							
							self.setevent();
							
							$(self.el).find(".subtitle").html(self.model.get("MsgTitle"));
							$(self.el).find("#divMsgContext").html(self.model.get("MsgContext"));
						},
						error : function(model, error){
							Element.Tools.Error(error);
						}
					});

					
				}else{
				    $(self.el).html(_.template(template, self.model.toJSON()));				   
					self.setevent();

				}
			});
            return this;
		},
		
		setevent : function(){
			var self = this;
		
			$(this.el).find("#btnCancel").on("click",function(e){
				e.preventDefault();
				app.component.Modal.close();
			});
		}
	
	});

})(jQuery);


