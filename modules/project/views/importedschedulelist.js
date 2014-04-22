var app = app || {};
(function ($) {
    app.ImportedSchedulelistview = Element.View.extend({
		pages : ["PROJECT", "Data", "Schedule"],
        render: function () {
            var self = this;
            app.TemplateManager.get("../../modules/project/tpl/tpl_ImportedSchedulelistview.html", function (template) {
                $(self.el).html($(template));

                $(self.el).find("#buttons").html(new app.component.ButtonGroup({
                    buttons: [
						{ class: "primary", Id: "btnImportSchedule", Name: "Import Schedule" }
                    ]
                }).render().el);

                $(self.el).find("#buttons2").html(new app.component.ButtonGroup({
                    buttons: [
						{ class: "warning", Id: "btnDelete", Name: "Delete Schedule" }
                    ]
                }).render().el);
				
                $(self.el).find("#list").html(new app.component.Tablelist({
                    list: "../../modules/project/tpl/tpl_ImportedSchedulelist.html",
                    listitem: "../../modules/project/tpl/tpl_ImportedSchedulelistitem.html",
                    coll: "new app.ImportedSchedulelist()",
					query : self.options.query,
					all : "Y"
                }).render().el);

                $(self.el).find("#btnImportList").on("click", function (e) {
                    e.preventDefault();
                    app.component.Modal.show(new app.importlist(
						{ kind: "User", downloadpath: "" }
					), 600);
                });

                $(self.el).find("#btnImportSchedule").on("click", function () {
                     var myDialog = new app.importedscheduleselectproject({ model: new app.ImportedSchedule() });
                     myDialog.doRefresh = function (projectId) {
                         app.router.navigate(Element.Tools.GetPageName() + "?projectId=" + projectId, { trigger: true });
                         app.router.navigate(Element.Tools.GetPageName(), { trigger: true });
                     };
                     app.component.Modal.show(myDialog, 600);
                });


                $(self.el).find("#btnAdd").on("click", function () {
                    app.component.Modal.show(new app.ImportedSchedulecreate({ model: new app.ImportedSchedule() }), 600);
                });


                $(self.el).find("#btnDelete").on("click", function (e) {
                    e.preventDefault();
                    app.component.Confirm.show(
                        { COMMENT: "Are you sure you want to delete the selected item(s)?", POS: "OK", NAG: "Cancel" },
                        function () {
                            var models = [];

                            Element.Tools.Multi(
                                "/ProjectData/SigmaProjectData.svc/rest/MultiImportedSchedule",
                                models,
                                $(self.el), {
                                    s: function (m, r) {
                                        ThisViewPage.options.query.projectId = null;
                                        self.render();
                                        app.component.Confirm.close();
                                    },
                                    e: function (m, e) {
                                        app.component.Confirm.close();
                                    }
                                });
                        }, function () {
                            
                        }
                    );
                });

                $(self.el).find("#btnImportHistory").on("click", function () {
                    app.router.navigate("ImportedScheduleimportlist", { trigger: true })
                });


                

            });
            return this;
        },

        link: function (key) {
            var self = this;
			
            app.component.Modal.show(
                new app.ImportedSchedulecreate({
					title : arguments[4],
                    model: new app.ImportedSchedule({ 
                        ScheduledWorkItemId: arguments[0],
                        DisciplineCode: arguments[1],
                        CwpId: arguments[2],
                        AssignedTo: arguments[3]
                    })
                }), 600);
        },

        search: function () {
            alert(Element.Tools.GetPageName() + Element.Tools.QueryGens(self.options.query, "projectId", "5752"));
            // var self = this;
            self.options.query.page = 1;
            app.router.navigate(Element.Tools.GetPageName() + Element.Tools.QueryGens(self.options.query, "projectId", "5752"), { trigger: true });
        }


    });
})(jQuery);
