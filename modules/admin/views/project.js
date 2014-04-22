/*
Written by hitapia(sbang)
Role : project list
*/
var app = app || {};
(function($){
	app.projectlist = Element.View.extend({
        events : {
            "click #create" : "create"
        },
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/project/tpl/tpl_projectlist.html", function(tpl){
				$(self.el).html($(tpl));

            	var inlinelist = new app.component.InlineList({url : new app.projects().url, linkName:"#"}); 
            	$(self.el).find("#projectlist").html(inlinelist.render().el);
			});

            return this;
		},
        create : function(){
            //app.component.Modal.show(new app.projectcreate());
			app.router.navigate("projectcreate", { trigger : true })

        }
	});
	app.projecthome = Element.View.extend({
		pages : ["PROJECT", "Overview"],
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/project/tpl/tpl_projecthome.html", function(tpl){
				var curPId = app.loggeduser.CurrentProjectId;
				$(self.el).html($(tpl));
				app.component.Call("/ProjectSettings/SigmaProjectSettings.svc/rest/Projects/"+curPId, "GET", "",
					function(d){
						var pinfo = JSON.parse(d.JsonDataSet)[0];
						var address = (pinfo.CountryName != null) ? pinfo.CountryName : "";
						address += " " + ((pinfo.CountyName != null) ? pinfo.CountyName : ""); 
						address += " " + ((pinfo.CityName != null) ? pinfo.CityName : ""); 
						$(self.el).find("#sppname").text(pinfo.ProjectName);
						$(self.el).find("#sppid").text(pinfo.ProjectNumber);
						$(self.el).find("#sploc").text(address);
						$(self.el).find("#spcpname").text(pinfo.ClientProjectName);
						$(self.el).find("#spcpid").text(pinfo.ClientProjectId);
					}, null
				);
				app.component.Call("/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaRolesByProjectId/"+curPId, "GET", "",
					function(d){
						$(self.el).find("#teamlist li").remove();
						_.each(JSON.parse(d.JsonDataSet), function(item){
							var mom = $(self.el).find("#teamlist li[name='"+item.Name+"']");
							if(mom.length > 0){
								var isnew = (mom.find("span").length) ? ", &nbsp;" : " &nbsp; - &nbsp; ";
								mom.append(isnew + "<span>"+item.FullName+"</span>");
							}else{
								$(self.el).find("#teamlist")
									.append("<li class='list-group-item' name='"+item.Name+"'><strong>"+item.Name+"</strong> &nbsp; - &nbsp; <span>"+item.FullName+"</span></li>");
							}
						});
						_.each($(self.el).find("#teamlist li"), function(item){
							if($(item).find("span").length == 0)
								$(item).remove();
						});
					}, null
				);
				
				//messages
				app.component.Call("/Common/Common.svc/rest/MessageBoxBySigmaUserId", "GET", "",
					function(d){
						if(JSON.parse(d.JsonDataSet).length == 0){
							$(self.el).find("#projectmessagelistpart").append("<div class='panel-body'>");
							$(self.el).find("#projectmessagelistpart .panel-body").addClass("text-center");
							$(self.el).find("#projectmessagelistpart .panel-body").html("No Message");
							$(self.el).find("#projectmessagelistpart .panel-footer").remove();
						}else{
							$(self.el).find("#projectmessagelistpart .panel-body").remove();
							_.each(JSON.parse(d.JsonDataSet), function(item){
								var readcss = "";
								if(item.IsRead=="Y")
									readcss = "glyphicon glyphicon-ok";
							
								$(self.el).find("#projectmessagelist")
									.append("<li class='list-group-item'><a href='javascript:Element.Tools.LinkClick(\"msg\",\""+item.MsgTypeCode+"\",\""+item.MsgSeq+"\");'>"+item.MsgTitle+"</a><div class='btn-group pull-right'><button class='btn btn-primary btn-xs' cid="+item.MsgSeq+" typecode='"+item.MsgTypeCode +"' name='btnRead'><span class='"+readcss+"'></span> Read</button><button class='btn btn-danger btn-xs' cid="+item.MsgSeq+" typecode='"+item.MsgTypeCode +"' name='btnDelete'>Delete</button></div></li>");
							});
						}
						$(self.el).find("#projectmessagelistpart button[name=btnDelete]").on("click", function(e){
							e.preventDefault();
							var li = $(this).parent().parent();
							var selid = $(this).attr("cid");
							var seltypecode = $(this).attr("typecode");
							var models = [];
							var m = "";
							app.component.Confirm.show(
							{ 
								COMMENT : "Are you sure you want to delete the selected item?", 
								POS : "OK", 
								NAG : "Cancel" 
							},
							function(){															
								var m = {
									SigmaOperation:"D",
									MsgTypeCode : seltypecode,
									MsgSeq:Number(selid),
									IsDelete : "Y"
								};	
								app.component.Call("/Common/Common.svc/rest/MessageBoxs", "DELETE", JSON.stringify({ paramObj : m }), function(d){
									if(d.IsSuccessful){
										app.component.Confirm.close();
										$(li).remove();
									}
								});
							});
						});
					},null
				);
			});
            return this;
		},
		link : function(typecode, msgseq){

		app.component.Modal.show(
				new app.messagecreate({ model : new app.messagemodel( {MsgTypeCode : typecode, MsgSeq : msgseq}) }), 600);	

		}


	});
})(jQuery);
