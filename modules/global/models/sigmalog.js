
app.SigmaLog = Element.Model.extend({
    urlRoot: app.config.domain + "/Common/Common.svc/rest/SigmaLogs",
    defaults: {
        Id: "", Date: "", Thread: "", Level: "", Logger: "", Message: "", Exception: ""
    },
    initialize: function () {
        if (app.config.debug) {
            this.urlRoot = app.config.domain + "/Common/Common.svc/rest/SigmaLogs";
        }
    }
});

app.SigmaLoglist = Element.Collection.extend({
    url: app.config.domain + "/Common/Common.svc/rest/SigmaLogs",
    model: app.SigmaLog,
    initialize: function () {
        if (app.config.debug) {
            this.url = app.config.domain + "/Common/Common.svc/rest/SigmaLogs"
        }
    }
});

