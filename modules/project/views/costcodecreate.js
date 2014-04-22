/*
Written by kpark
Role : costcode estimate modify
*/
var app = app || {};
(function($){
	app.costcodecreate = Element.View.extend({
        events : { 
			"click #btnSave" : "save",
			"click #btnCancel" : "cancel"
		},
		render : function(){
			var self = this;			
			app.TemplateManager.get("../../modules/project/tpl/tpl_costcodecreate.html", function (template) {
			    L(self.model.urlRoot + "/" + self.model.get("CostCode"));
				if(self.model.get("CostCode")){
					self.model.fetch({
					    url: self.model.urlRoot + "/" + self.model.get("CostCode"),
						success : function(){
							$(self.el).html(_.template(template,self.model.toJSON()));
														
							$(self.el).find(".title").html("Edit Cost Code");
							self.renderscreen();
						},
						error : function(m, e){
							L(e);
						}
						
					});
				}else{
					$(self.el).html(_.template(template,self.model.toJSON()));
					self.renderscreen();
				}
				$(self.el).html(_.template(template,self.model.toJSON()));
				self.renderscreen();
				
			});
            return this;
		},
		renderscreen : function(){	
			var self = this;	
			$(self.el).find("#cboUOM").append(new app.component.Combo({
			    url: new app.uomCode().url,
			    inline: true,
			    selname: "Select UOM",
			    selected: self.model.get("UomCode")
			}).render().el);
		},
		save: function (e) {
			var self = this;
			e.preventDefault();
			if ($("#cboUOM option:selected").val() == "") {
			    $(self.el).find("#cboUOM").parent().removeClass("has-error").addClass("has-error");
			    return false;
			} else {
			    $(self.el).find("#cboUOM").parent().removeClass("has-error");
			}

			if (!Element.Tools.Validate($(self.el).find("form")))
			    return;

			if(self.model.get("ProjectCostCodeId") == null){
			    self.model.set({
			        ProjectCostCodeId: 0,
			        ProjectId: 0,
			    });
			}

			L($(self.el).find("#cboUOM option:selected").val());
			self.model.set({
			    CostCodeId: self.model.get("CostCodeId"),
			    UomCode : $(self.el).find("#cboUOM option:selected").val(), 
				EstimatedQty : Number($(self.el).find("#estqty").val()),
				EstimatedManhour : Number($(self.el).find("#esthour").val())
				
			});

			self.model.apply($(self.el),
				(self.model.get("ProjectCostCodeId") != 0) ? "PUT" : "POST", {
				s : function(m, r){
					ThisViewPage.render();
					app.component.Modal.close();
				},
				e : function(m, e){
					ThisViewPage.render();
				}
			});
		},
		cancel : function(e){		
			//app.router.navigate("costcodelist", { trigger : true })
			
			e.preventDefault();
			app.component.Modal.close();
		}
		
	});
})(jQuery);
