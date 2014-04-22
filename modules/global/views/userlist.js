/*
Create by kpark
Description : user list
*/
var app = app || {};
(function($){
	app.userlistview = Element.View.extend({		
		pages : ["Global Settings", "Users"],
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/global/tpl/tpl_userlistview.html", function(template){
				$(self.el).html($(template));

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class : "primary", Id : "btnAdd", Name : "Add New" },
						{ Id : "btnImportList", Name : "Import File" },
						{ Id : "btnImportHistory", Name : "Import History" }
					]
				}).render().el);

				$(self.el).find("#controls").html(new app.component.SearchControl({
					options : [
						{ Value : "FirstName", Name : "First Name" },
						{ Value : "LastName", Name : "Last Name" },
						{ Value : "SigmaUserId", Name : "Login ID" }
					],
					query : self.options.query      
				}).render().el);

				$(self.el).find("#list").html(new app.component.Tablelist({
					list : "../../modules/global/tpl/tpl_userlist.html",
					listitem : "../../modules/global/tpl/tpl_userlistitem.html",
					coll : "new app.userlist()",
					query : self.options.query,
					callback : function(){
						app.component.Call("/Auth/SigmaAuth.svc/rest/License","GET","",
							function(d){
								var licinfo = JSON.parse(d.JsonDataSet)[0];
								var t = $(self.el).find("#paging .onlyinfo").text();
								$(self.el).find("#licinfo").html("Total <strong>"+licinfo.UsedCount+"</strong> users (<strong>"+licinfo.AvailableCount+"</strong> of <strong>"+licinfo.TotalCount+"</strong> user licenses available)");
								$(self.el).find("#paging .onlyinfo").text(t + " / " + licinfo.TotalCount);
							}, null
						);
					}
				}).render().el);
				
				$(self.el).find("#btnImportList").on("click",function(e){	
					e.preventDefault();
					app.component.Modal.show(new app.importlist(
						{
						    kind: "User",
						    downloadpath: app.config.docPath.template + app.config.downloads.userstemplate
						    , s: function (data) {  }
						}
					), 600);
				});

				$(self.el).find("#btnAdd").on("click",function() {				
				//	app.router.navigate("usercreate", { trigger : true, model : new app.user() });
					app.component.Modal.show(new app.usercreate({ model : new app.user() }), 600);
				});

				$(self.el).find("#btnImportHistory").on("click",function() {				
					app.router.navigate("userimportlist", { trigger : true })
				});

			});
            return this;
		},
		link : function(key){
			app.component.Modal.show(new app.usercreate({ model : new app.user( { SigmaUserId : key , SigmaOperation : "U" } ) }), 600);
		},
	    renderlist: function () {
	    var self = this;
	    $(self.el).find("#list").html(new app.component.Tablelist({
	        list: "../../modules/global/tpl/tpl_userlist.html",
	        listitem: "../../modules/global/tpl/tpl_userlistitem.html",
	        coll: "new app.userlist()",
	        query: self.options.query
	    }).render().el);
	}
			   
	});
})(jQuery);
