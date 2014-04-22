
var app = app || {};
(function($){
	app.mtoedit = Element.View.extend({		
		events : { 
			"click #btnSave" : "save",
			"click #btnCancel" : "cancel"
		},
		render : function(){
			var self = this;			
			app.TemplateManager.get("../../modules/mto/tpl/tpl_mtoview_mtoedit.html", function(template){
			
				//서비스연결시 적용
				/*if(self.model.get("Id")){

					if(app.config.jsonp)
						self.model.urlRoot = self.model.urlRoot.replace("/rest/", "/jsonp/");

					self.model.fetch({
						url : self.model.urlRoot + "/" + self.model.get("Id"),
						dataType : "jsonp",
						jsonp : "callback",
						success : function(){
							$(self.el).html(_.template(template,self.model.toJSON()));
							$(self.el).find(".title").html(self.model.get("CompanyName"));
							self.renderscreen();
						}						
					});
				}else{
					$(self.el).html(_.template(template, self.model.toJSON()));
					self.renderscreen();
				}*/
				
				$(self.el).html(_.template(template, self.model.toJSON()));
				self.renderscreen();
					
			});
            return this;
		},
		renderscreen : function(){
			var self = this;
			$(this.el).find("#cboCostCode").append(new app.component.Combo({
				url : new app.disciplines().url,
				inline : true
			}).render().el);
					
			
			$(self.el).find("#buttons").html(new app.component.ButtonGroup({
				buttons : [
					{ Id : "btnAdd", Name : "Add New" },
					{ Id : "btnDelete", Name : "Delete" }
				]
			}).render().el);
				
			$(self.el).find("#list").html(new app.component.Tablelist({
				list : "../../modules/mto/tpl/tpl_mtoedit_list.html",
				listitem : "../../modules/mto/tpl/tpl_mtoedit_listitem.html",
				coll : "new app.mtolist()"
			}).render().el);
			
			$(this.el).find("#btnCancel").on("click", function(e){	
				e.preventDefault();
				app.component.Modal.close();
			});
		},
		save : function(){	
			e.preventDefault();
			
				/*self.model.Name = $("txtComName").val();
				self.model.Address = $("txtComAddress").val();
				self.model.IdAttribute = "CompanyId";
				self.model.save({
					success : function(m, r){
						L(m);
						L(r);
					}
				});*/
		},
		cancel : function(){		
			app.router.navigate("equipmentlist", { trigger : true })
			//e.preventDefault();
			//app.component.Modal.close();
		}
		
	});
})(jQuery);
