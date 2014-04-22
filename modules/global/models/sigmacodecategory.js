
app.SigmaCodeCategory = Element.Model.extend({
    urlRoot: app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaCodeCategorys",
    defaults: {
        CodeCategory: "",
        CategoryName: "",
        CategoryDescription: "",
        ParentCodeCategory: "",
        SortOrder: "",
        CreatedBy: "",
        CreatedDate: "",
        UpdatedBy: "",
        UpdatedDate: ""
    },
    initialize: function () {
        if (app.config.debug) {
            this.urlRoot = app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaCodeCategorys";
        }
    }
});

app.SigmaCodeCategorylist = Element.Collection.extend({
    url: app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaCodeCategorys",
    model: app.SigmaCodeCategory,
    initialize: function () {
        if (app.config.debug) {
            this.url = app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaCodeCategorys"
        }
    }
});