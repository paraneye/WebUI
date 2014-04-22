
var app = app || {};
(function ($) {
    app.SigmaCodecreate = Element.View.extend({
        render: function () {
            var self = this;
            app.TemplateManager.get("../../modules/global/tpl/tpl_SigmaCodecreate.html", function (template) {
                if (self.model.get("CodeCategory")) {
                    var url = self.model.urlRoot + "/" + self.model.get("Code") + "/" + self.model.get("CodeCategory");
                    self.model.url = url;
                    self.model.fetch({
                        success: function () {
                            $(self.el).html(_.template(template, self.model.toJSON()));
                            $(self.el).find("h2").html("Edit SigmaCode");
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
            var httpMethod = self.model.get("CodeCategory") != "" ? "PUT" : "POST";
            self.model.set({
                Code: $(self.el).find("#txtCode").val()
				, CodeCategory: $(self.el).find("#txtCodeCategory").val()
				, CodeName: $(self.el).find("#txtCodeName").val()
				, CodeShortName: $(self.el).find("#txtCodeShortName").val()
				, RefChar: $(self.el).find("#txtRefChar").val()
				, RefNo: $(self.el).find("#txtRefNo").val()
				, Description: $(self.el).find("#txtDescription").val()
				, IsActive: $(self.el).find("#txtIsActive").val()
				, SortOrder: $(self.el).find("#txtSortOrder").val()
				, CreatedBy: $(self.el).find("#txtCreatedBy").val()
				, CreatedDate: $(self.el).find("#txtCreatedDate").val()
				, UpdatedBy: $(self.el).find("#txtUpdatedBy").val()
				, UpdatedDate: $(self.el).find("#txtUpdatedDate").val()
            });
            
            self.model.apply($(self.el), httpMethod, {
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

