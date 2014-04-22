
var app = app || {};
(function ($) {
    app.consumablemateriallistview = Element.View.extend({
		pages : ["Global Settings", "Library", "Consumables"],		
        render: function () {
            var self = this;
            app.TemplateManager.get("../../modules/mto/tpl/tpl_consumablemateriallistview.html", function (template) {
                $(self.el).html($(template));
				
				$(self.el).find("#list").html(new app.component.Tablelist({
           		    list: "../../modules/mto/tpl/tpl_consumablemateriallist.html",
            	    listitem: "../../modules/mto/tpl/tpl_consumablemateriallistitem.html",
         	    	coll: "new app.materiallist()",
                	query: self.options.query

	            }).render().el);

                $(self.el).find("#buttons").html(new app.component.ButtonGroup({
                    buttons: [
						{ class: "primary", Id: "btnAdd", Name: "Add New" },
						{ Id: "btnImportList", Name: "Import File" },
						{ Id: "btnImportHistory", Name: "Import History" },
						{ class: "warning", Id: "btnDelete", Name: "Delete" }
						
                    ]
                }).render().el);

                
                self.setevent();
                self.renderscreen();

            });
            return this;
        },
        setevent: function () {
            var self = this;

            $(self.el).find("#btnAdd").on("click", function (e) {
                e.preventDefault();
                app.component.Modal.show(new app.consumablematerialcreate({ model: new app.material() }), 600);
            });

            $(self.el).find("#btnImportList").on("click", function (e) {
                e.preventDefault();
                app.component.Modal.show(new app.importlist(
                    { 
						kind: "ConsumableLibrary", 
						downloadpath: app.config.docPath.template + app.config.downloads.consumablelibrarytemplate
							, s: function (data) { }
					}
                ), 600);
            });

            $(self.el).find("#btnImportHistory").on("click", function (e) {
                e.preventDefault();
                app.router.navigate("consumablematerialimportlist", { trigger: true })
            });

            $(self.el).find("#btnSearch").on("click", function (e) {
                self.renderlist();
            });

            $(self.el).find("#btnDelete").on("click", function (e) {
                e.preventDefault();
				if(!Element.Tools.ValidateCheck($(self.el).find("#list")))  
        		return;

                app.component.Confirm.show(
                    { COMMENT: "Are you sure you want to delete the selected item(s)?", POS: "OK", NAG: "Cancel" },
                    function () {
                        var models = [];
                        $(self.el).find("input[name=key]:checked").each(function () {

                            models.push(new app.material({
                                MaterialId: Number($(this).val()),
                                SigmaOperation: "D",
								CostCodeId : 0
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
									window.location = "#consumablemateriallist"+q;
                                    app.component.Confirm.close();
                                },
                                e: function (m, e) {
									
                                    self.render();
                                    app.component.Confirm.close();
                                }
                            });
                    },
                    function () { }
                );
            });

        },
        link: function (num) {
            app.component.Modal.show(
				new app.consumablematerialcreate({ model: new app.material({ MaterialId: num }) }), 600);

        },
        setparam: function () {
            var self = this;
            var param = "";
			         
			var q = Element.Tools.QueryGen(self.options.query, "page", 1);
			window.location = "#consumablemateriallist"+q;

            

        },

        renderscreen: function () {
           
        },
    });
})(jQuery);
