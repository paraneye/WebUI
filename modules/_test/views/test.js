/*
Written by hitapia(sbang)
Role : project list
*/
var app = app || {};
(function($){
	app.test = Element.View.extend({
		el : $("#container"),
        events : {
            "click #send" : "send"
        },
		render : function(){
			var self = this;
            file = new app.component.FileUpload();
			file.IdName = "fileup";
			file.description = "Please Select a File";
			file.url = "/modules/_test/fileup";
            $(this.el).append(file.render().el);
            return this;
		},
        send : function(){
			file.upload(function(data){
				alert(data);
			});
        }
	});
})(jQuery);

