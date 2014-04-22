
app.SigmaCode = Element.Model.extend({
    urlRoot: app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaCodes",
    defaults: {
        Code: "", CodeCategory: "", CodeName: "", CodeShortName: "", RefChar: "", RefNo: "", Description: "", IsActive: "", SortOrder: "", CreatedBy: "", CreatedDate: "", UpdatedBy: "", UpdatedDate: ""
    },
    initialize: function () {
        if (app.config.debug) {
            this.urlRoot = app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaCodes";
        }
    }
});

app.SigmaCodelist = Element.Collection.extend({
    url: app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaCodes",
    model: app.SigmaCode,
    initialize: function () {
        if (app.config.debug) {
            this.url = app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaCodes"
        }
    }
});