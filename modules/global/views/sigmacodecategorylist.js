var app = app || {};
(function ($) {
    app.SigmaCodeCategorylistview = Element.View.extend({
		pages : ["Global Settings", "Common Codes", "CodeCategory"],
        render: function () {
            var self = this;
            app.TemplateManager.get("../../modules/global/tpl/tpl_SigmaCodeCategorylistview.html", function (template) {
                $(self.el).html($(template));

                $(self.el).find("#buttons").html(new app.component.ButtonGroup({
                    buttons: [
						{ class: "primary", Id: "btnAdd", Name: "Add New" },
						{ Id: "btnImportList", Name: "Import File" },
						{ Id: "btnImportHistory", Name: "Import History" }
                    ]
                }).render().el);

                $(self.el).find("#controls").html(new app.component.SearchControl({
                    options: [
						{ Value: "FirstName", Name: "First Name" },
						{ Value: "LastName", Name: "Last Name" },
						{ Value: "Company", Name: "Company" }
                    ],
                    query: self.options.query
                }).render().el);

                $(self.el).find("#list").html(new app.component.Tablelist({
                    list: "../../modules/global/tpl/tpl_SigmaCodeCategorylist.html",
                    listitem: "../../modules/global/tpl/tpl_SigmaCodeCategorylistitem.html",
                    coll: "new app.SigmaCodeCategorylist()",
                    query: self.options.query
                }).render().el);

                $(self.el).find("#btnImportList").on("click", function (e) {
                    e.preventDefault();
                    app.component.Modal.show(new app.importlist(
						{ kind: "User", downloadpath: "" }
					), 600);
                });

                $(self.el).find("#btnAdd").on("click", function () {
                    app.component.Modal.show(new app.SigmaCodeCategorycreate({ model: new app.SigmaCodeCategory() }), 600);
                });

                $(self.el).find("#btnImportHistory").on("click", function () {
                    app.router.navigate("SigmaCodeCategoryimportlist", { trigger: true })
                });

            });
            return this;
        },
        link: function (key) {
            app.component.Modal.show(new app.SigmaCodeCategorycreate({ model: new app.SigmaCodeCategory({ CodeCategory: key }) }), 600);
        }

    });
})(jQuery);

