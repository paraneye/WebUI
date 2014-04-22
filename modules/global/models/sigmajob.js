
app.SigmaJob = Element.Model.extend({
    urlRoot: app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaJobs",
    defaults: {
        SigmaJobId: "", SigmaJobName: "", JobCategoryCode: "", CreatedBy: "", CreatedDate: "", UpdatedBy: "", UpdatedDate: ""
    },
    initialize: function () {
        if (app.config.debug) {
            this.urlRoot = app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaJobs";
        }
    }
});

app.SigmaJoblist = Element.Collection.extend({
    url: app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaJobs",
    model: app.SigmaJob,
    initialize: function () {
        if (app.config.debug) {
            this.url = app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaJobs"
        }
    }
});