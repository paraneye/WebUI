
var app = app || {};
(function ($) {
    app.SigmaJobcreate = Element.View.extend({
        render: function () {
            var self = this;
            app.TemplateManager.get("../../modules/global/tpl/tpl_SigmaJobcreate.html", function (template) {
                if (self.model.get("SigmaJobId")) {
                    var url = self.model.urlRoot + "/" + self.model.get("SigmaJobId");
                    self.model.url = url;
                    self.model.fetch({
                        success: function () {
                            $(self.el).html(_.template(template, self.model.toJSON()));
                            $(self.el).find("h2").html("Edit SigmaJob");
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

        setsave: function (data) {
            var self = this;

            self.model.set({
                SigmaJobId: $(self.el).find("#txtSigmaJobId").val()
				, SigmaJobName: $(self.el).find("#txtSigmaJobName").val()
				, JobCategoryCode: $(self.el).find("#txtJobCategoryCode").val()
				, CreatedBy: $(self.el).find("#txtCreatedBy").val()
				, CreatedDate: $(self.el).find("#txtCreatedDate").val()
				, UpdatedBy: $(self.el).find("#txtUpdatedBy").val()
				, UpdatedDate: $(self.el).find("#txtUpdatedDate").val()
            });

            self.model.apply($(self.el),
				(self.model.get("SigmaJobId") != "") ? "PUT" : "POST", {
				    s: function (m, r) {
				        ThisViewPage.render();
				        app.component.Modal.close();
				    },
				    e: function (m, e) {
				        app.component.Modal.close();
				    }
				});

        },

        setevent: function () {
            var self = this;

            $(this.el).find("#btnSave").on("click", function (e) {
                e.preventDefault();
                self.setsave("");
                app.component.Modal.close();
            });

            $(this.el).find("#btnCancel").on("click", function (e) {
                e.preventDefault();
                app.component.Modal.close();

            });
        }

    });
})(jQuery);
