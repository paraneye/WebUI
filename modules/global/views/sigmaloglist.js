
/*

views/list.js

Create by WireGenerator
Description : SigmaLogListView
*/
var app = app || {};
(function ($) {
    app.SigmaLoglistview = Element.View.extend({
		pages : ["Global Settings", "Common Codes", "ExceptionLog"],
        render: function () {
            var self = this;
            app.TemplateManager.get("../../modules/global/tpl/tpl_SigmaLoglistview.html", function (template) {
                $(self.el).html($(template));

                $(self.el).find("#list").html(new app.component.Tablelist({
                    list: "../../modules/global/tpl/tpl_SigmaLoglist.html",
                    listitem: "../../modules/global/tpl/tpl_SigmaLoglistitem.html",
                    coll: "new app.SigmaLoglist()",
                    query: self.options.query
                }).render().el);

                $(self.el).find("#btnImportList").on("click", function (e) {
                    e.preventDefault();
                    app.component.Modal.show(new app.importlist(
						{ kind: "User", downloadpath: "" }
					), 600);
                });

                $(self.el).find("#btnAdd").on("click", function () {
                    //	app.router.navigate("SigmaLogcreate", { trigger : true, model : new app.SigmaLog() });
                    app.component.Modal.show(new app.SigmaLogcreate({ model: new app.SigmaLog() }), 600);
                });

                $(self.el).find("#btnImportHistory").on("click", function () {
                    app.router.navigate("SigmaLogimportlist", { trigger: true })
                });

            });
            return this;
        },
        link: function (key) {
            app.component.Modal.show(new app.SigmaLogcreate({ model: new app.SigmaLog({ Id: key }) }), 600);
        }

    });


})(jQuery);


var app = app || {};
(function ($) {
    app.SigmaLogcreate = Element.View.extend({
        render: function () {
            var self = this;
            app.TemplateManager.get("../../modules/global/tpl/tpl_SigmaLogcreate.html", function (template) {
                if (self.model.get("Id")) {
                    var url = self.model.urlRoot + "/" + self.model.get("Id");
                    self.model.url = url;
                    self.model.fetch({
                        success: function () {
                            $(self.el).html(_.template(template, self.model.toJSON()));
                            $(self.el).find("h2").html("Edit SigmaLog");
                            self.setevent();
                        },
                        error: function (model, error) {
                            L(error);
                        }
                    });
                } else {
                    $(self.el).html(_.template(template, self.model.toJSON()));
                    self.setevent();
                }
            });
            return this;
        },

        setevent: function () {
            var self = this;

            $(this.el).find("#btnCancel").on("click", function (e) {
                e.preventDefault();
                app.component.Modal.close();

            });
        }

    });
})(jQuery);

