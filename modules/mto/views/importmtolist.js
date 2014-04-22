
var app = app || {};
(function($){
	app.importmtolistview = Element.View.extend({		
	    pages: ["PROJECT", "Data", "Import MTO"],
	    makelistitem: function (item) {
	        var self = this;
	        app.TemplateManager.get("../../modules/mto/tpl/tpl_importmtolistitem.html", function (template) {
	            var li = $("<tr>").append(_.template(template, item.toJSON()));
	            if (item.get("FieldInfo") != "") {
	                var arr = item.get("FieldInfo").split(",");
	                var custtext = [];
	                _.each(arr, function (cust) {
	                    var arrcust = cust.split("|");
	                    var col = $(li).find("td[fieldname='" + arrcust[2] + "']");
	                    if ($(col).length > 0) {
	                        $(col).text(arrcust[1]);
	                    } else {
	                        custtext.push(arrcust[2] + " : " + arrcust[1]);
	                    }
	                });
	            }
	            $(self.el).find("#list").find("table > tbody:first").append(li);
	        });
	    },
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/mto/tpl/tpl_importmtolistview.html", function(template){
				$(self.el).html($(template));

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ Id : "btnImportList", Name : "Import File" },
						{ Id : "btnImportHistory", Name : "Import History" },
						{ class: "warning", Id: "btnDelete", Name: "Delete" }
					]
				}).render().el);

				$(self.el).find("#btnImportList").on("click",function(e){	
					e.preventDefault();
					app.component.Modal.show(new app.importlist(
						{ kind : "MTO", downloadpath : app.config.docPath.template + app.config.downloads.mtotemplate, s : function(data){
								if(data.Id != ""){
								    $(self.el).find("#init").hide();
									$(self.el).find("#list").html(new app.component.Tablelist({
										list : "../../modules/mto/tpl/tpl_importmtolist.html",
										listitem : "../../modules/mto/tpl/tpl_importmtolistitem.html",
										coll: "new app.mtohistlist()",
										kind: data.Id,
										callback: function (c) {
										    var m = 0;
										    self.totalmanhour = 0;
										    $(self.el).find("#list").find("tbody > tr").remove();                                               
										    _.each(c.models, function (item) {
										        self.makelistitem(item);
										    });
										}
									}).render().el);
								}
					 		}
						 }
					), 600);
				});


				$(self.el).find("#btnImportHistory").on("click",function(e){	
					e.preventDefault();
					app.router.navigate("mtoimportlist", { trigger : true })
				});

				$(self.el).find("#btnDelete").on("click",function(e){	
					e.preventDefault();
					app.component.Confirm.show(
						{ COMMENT : "Are you sure you want to delete the selected item(s)?", POS : "OK", NAG : "Cancel" },
						function(){
							var models = [];
                            $(self.el).find("input[name=key]:checked").each(function() {
								var tmp = $(this).val().split("_");
                                models.push(new app.mto({ 
									ComponentId : Number(tmp[0]),
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
				
				self.renderscreen();

			});
            return this;
		},
		renderscreen : function(){	
			var self = this;	
		}
	});
})(jQuery);
