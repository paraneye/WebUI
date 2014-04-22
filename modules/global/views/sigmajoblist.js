var app = app || {};
(function ($) {
    app.SigmaJoblistview = Element.View.extend({
		pages : ["Global Settings", "Common Codes", "SigmaJob"],
        render: function () {
            var self = this;
            app.TemplateManager.get("../../modules/global/tpl/tpl_SigmaJoblistview.html", function (template) {
                $(self.el).html($(template));

                $(self.el).find("#buttons").html(new app.component.ButtonGroup({
                    buttons: [
						{ class: "primary", Id: "btnAdd", Name: "Add New" },
						{ class: "warning", Id: "btnDelete", Name: "Delete" }
                    ]
                }).render().el);

                $(self.el).find("#controls").html(new app.component.SearchControl({
                    options: [
						{ Value: "SigmaJobName", Name: "SigmaJobName" }

                    ],
                    query: self.options.query
                }).render().el);

                $(self.el).find("#list").html(new app.component.Tablelist({
                    list: "../../modules/global/tpl/tpl_SigmaJoblist.html",
                    listitem: "../../modules/global/tpl/tpl_SigmaJoblistitem.html",
                    coll: "new app.SigmaJoblist()",
                    query: self.options.query
                }).render().el);

                $(self.el).find("#btnImportList").on("click", function (e) {
                    e.preventDefault();
                    app.component.Modal.show(new app.importlist(
						{ kind: "User", downloadpath: "" }
					), 600);
                });

                $(self.el).find("#btnAdd").on("click", function () {
                    app.component.Modal.show(new app.SigmaJobcreate({ model: new app.SigmaJob() }), 600);
                });


                $(self.el).find("#btnDelete").on("click", function (e) {
                    e.preventDefault();
                    app.component.Confirm.show(
						{ COMMENT: "Are you sure you want to delete the selected item(s)?", POS: "OK", NAG: "Cancel" },
						function () {
						    var models = [];
						    $(self.el).find("input[name=key]:checked").each(function () {
						        var args = $(this).val().split('||');
						        models.push(new app.SigmaJob({
						            SigmaJobId: args[0],
						            SigmaOperation: "D"
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
								        self.render();
								        app.component.Confirm.close();
								    },
								    e: function (m, e) {
								        app.component.Confirm.close();
								    }
								});
						},
						function () { }
					);
                });

                $(self.el).find("#btnImportHistory").on("click", function () {
                    app.router.navigate("SigmaJobimportlist", { trigger: true })
                });

            });
            return this;
        },
        link: function (key) {
            app.component.Modal.show(new app.SigmaJobcreate({ model: new app.SigmaJob({ SigmaJobId: arguments[0] }) }), 600);
        }

    });
})(jQuery);
