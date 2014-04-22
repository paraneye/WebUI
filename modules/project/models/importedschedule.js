
app.ImportedSchedule = Element.Model.extend({
    urlRoot: app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/ImportedSchedules",
    defaults: {
        ScheduledWorkItemId: "",
        Wbs: "",
        ScheduleLineItem: "",
        P6StartDate: "",
        P6FinishDate: "",
        P6Duration: "",
        SigmaStartDate: "",
        SigmaFinishDate: "",
        SigmaDuration: "",
        EstimatedManhours: "",
        AssignedCrew: "",
        DisciplineCode: "",
        CwpId: "",
        AssignedTo: "",
        CreatedBy: "",
        CreatedDate: "",
        UpdatedBy: "",
        UpdatedDate: ""
    },
    initialize: function () {
        if (app.config.debug) {
            this.urlRoot = app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/ImportedSchedules";
        }
    }
});

app.ImportedSchedulelist = Element.Collection.extend({
    url: app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/ImportedSchedules",
    model: app.ImportedSchedule,
    initialize: function () {
        if (app.config.debug) {
            this.url = app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/ImportedSchedules"
        }
    }
});
