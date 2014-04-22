
var app = app || {};
(function($){
	app.companylistview = Element.View.extend({	
		pages : ["Global Settings", "Companies"],	
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/global/tpl/tpl_companylistview.html", function(template){
				$(self.el).html($(template));

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class : "primary", Id : "btnAdd", Name : "Add New" },
						{ class : "warning", Id : "btnDelete", Name : "Delete" }
					]
				}).render().el);
				
				$(self.el).find("#controls").html(new app.component.SearchControl({
					options : [
						{ Value : "Name", Name : "Company Name" },
						//{ Value : "Type", Name : "Type" },
						{ Value : "Address", Name : "Address" }
					],
					query : self.options.query      
				}).render().el);

				$(self.el).find("#list").html(new app.component.Tablelist({
					list : "../../modules/global/tpl/tpl_companylist.html",
					listitem : "../../modules/global/tpl/tpl_companylistitem.html",
					coll : "new app.companylist()",
					query : self.options.query,
					manual : true,
					callback : function(d){
						var template = $.ajax({
							url: "../../modules/global/tpl/tpl_companylistitem.html",
							cache: false, async: false
						}).responseText;
						_(d.models).each(function(item){
							var tr = $("<tr>").append(_.template(template, item.toJSON()));
							$(self.el).find("#list").find("table > tbody:last")
								.append(tr);
							if(tr.find("input[name='key']").val() == app.loggeduser.CompanyId){
								tr.find("input[name='key']").attr("disabled", "disabled");
							}
						});
					
					}
				}).render().el);
				
				$(self.el).find("#btnAdd").on("click",function(){				
					app.component.Modal.show(new app.companycreate({ model : new app.company() }), 600);
				});

				$(self.el).find("#btnDelete").on("click",function(e){	
					e.preventDefault();
					if(!Element.Tools.ValidateCheck($(self.el).find("#list")))
						return;
					
					app.component.Confirm.show(
						{ COMMENT : "Are you sure you want to delete the selected item(s)?", POS : "OK", NAG : "Cancel" },
						function () {
							var models = [];
                            $(self.el).find("input[name=key]:checked").each(function() {
								
                                models.push(new app.company({ 
                                    CompanyId : $(this).val(),
                                    SigmaOperation : "D"
                                })); 
                            });

                            if (models.length == 0) {
								app.component.Confirm.close();
								return false;
							}
							Element.Tools.Multi(
								models[0].urlRoot + "/Multi",
								models,
								$(self.el), {
								    s: function (m, r) {
									var q = Element.Tools.QueryGen(self.options.query, "page", 1);
									window.location = "#companylist"+q;
									app.component.Confirm.close();
								},
								    e: function (m, e) {
									Element.Tools.Error(e);
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
			app.component.Modal.show(new app.companycreate({ model : new app.company( { CompanyId : key} ) }), 600);
		}

	});
})(jQuery);
