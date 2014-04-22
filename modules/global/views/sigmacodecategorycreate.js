
var app = app || {};
(function ($) {
    app.SigmaCodeCategorycreate = Element.View.extend({
        render: function () {
            var self = this;
            app.TemplateManager.get("../../modules/global/tpl/tpl_SigmaCodeCategorycreate.html", function (template) {
                if (self.model.get("CodeCategory")) {
                    var url = self.model.urlRoot + "/" + self.model.get("CodeCategory");
                    self.model.url = url;
                    self.model.fetch({
                        success: function () {
                            $(self.el).html(_.template(template, self.model.toJSON()));
                            $(self.el).find("h2").html("Edit SigmaCodeCategory");
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