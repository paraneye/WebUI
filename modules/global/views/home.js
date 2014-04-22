
var app = app || {};
(function($){
	app.globalhomeview = Element.View.extend({
		pages : ["Home"],
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/global/tpl/tpl_home.html", function(tpl){
				$(self.el).html($(tpl));			

				app.component.Call("/GlobalSettings/SigmaGlobalSettings.svc/rest/Companys/"+app.loggeduser.CompanyId, "GET", "",
					function(d){
						var lname = JSON.parse(d.JsonDataSet)[0].LogoFilePath;
						if(lname != null){
							$(self.el).find("#imgLogo").attr("src", app.config.docPath.images + JSON.parse(d.JsonDataSet)[0].LogoFilePath);
							$(self.el).find("#imgLogo").css("width", "200px");
						}else{
							$(self.el).find("#logobox").remove();
						}
					},null
				);
				//project
				app.component.Call("/Common/Common.svc/rest/ProjectCombo", "GET", "",
					function(d){
						if(JSON.parse(d.JsonDataSet).length == 0){
							$(self.el).find("#projectlistpart .panel-body").html("No Project");
							$(self.el).find("#projectlistpart .panel-footer").remove();
						}else{
							$(self.el).find("#projectlistpart .panel-body").remove();
							_.each(JSON.parse(d.JsonDataSet), function(item){
							    $(self.el).find("#projectlist")
									.append("<li class='list-group-item'><a href='javascript:Element.Tools.LinkClick(\"prj\"," + item.Code + ", \"" + item.CodeName + "\");'>" + item.CodeName + "</a><button id=" + item.Code + " class='btn btn-danger pull-right btn-xs' cid=" + item.Code + ">Close</button></li>");
							    
							    if (app.loggeduser.IsAdmin != "Y") {
							        $(self.el).find("#" + item.Code).hide();
							    }
							});
						}
						if (app.loggeduser.IsAdmin == "Y")
					        $(self.el).find("#btnnewproject").show();

						$(self.el).find("#projectlistpart button").on("click", function(e){
							e.preventDefault();
							var selid = $(this).attr("cid");
							var m = {
								ProjectId: selid,
								IsActive: "N",
								ProjectDiscipline: [],
								ProjectSubcontractor: []
							};
							app.component.Confirm.show(
								{ 
									COMMENT : "Are you sure you want to close the project and make it invisible from the project list?", 
									POS : "OK", 
									NAG : "Cancel" 
								},
								function(){
									app.component.Call("/ProjectSettings/SigmaProjectSettings.svc/rest/CloseOpenProject", "PUT", JSON.stringify({ paramObj : m }), function(d){
											if(d.IsSuccessful){
												app.loggeduser.ProjectList = JSON.parse(d.JsonDataSet);
												Element.Tools.SetCookie("logininfo", JSON.stringify(app.loggeduser));
												window.location = "/ui/";
											}
										});
								});
						});
					},null
				);
				//messages
				app.component.Call("/Common/Common.svc/rest/MessageBoxBySigmaUserId", "GET", "",
					function(d){
						if(JSON.parse(d.JsonDataSet).length == 0){
							$(self.el).find("#messagelistpart .panel-body").html("No Message");
							$(self.el).find("#messagelistpart .panel-footer").remove();
						}else{
							$(self.el).find("#messagelistpart .panel-body").remove();
							_.each(JSON.parse(d.JsonDataSet), function(item){
								var readcss = "";
								if(item.IsRead=="Y")
									readcss = "glyphicon glyphicon-ok";
							
								$(self.el).find("#messagelist")
									.append("<li class='list-group-item'><a href='javascript:Element.Tools.LinkClick(\"msg\",\""+item.MsgTypeCode+"\",\""+item.MsgSeq+"\");'>"+item.MsgTitle+"</a><div class='btn-group pull-right'><button class='btn btn-primary btn-xs' cid="+item.MsgSeq+" typecode='"+item.MsgTypeCode +"' name='btnRead'><span class='"+readcss+"'></span> Read</button><button class='btn btn-danger btn-xs' cid="+item.MsgSeq+" typecode='"+item.MsgTypeCode +"' name='btnDelete'>Delete</button></div></li>");
							});
						}
						
						$(self.el).find("#messagelistpart button[name=btnDelete]").on("click", function(e){
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
				
				$(".title_wrap h2").html("Home");
			});
            return this;
		},
		link : function(kind, d1, d2){

			if(kind == "msg"){
				app.component.Modal.show(
						new app.messagecreate({ model : new app.messagemodel( {MsgTypeCode : d1, MsgSeq : d2}) }), 600);	
			}else{
				app.loggeduser.CurrentProjectId = d1;
				app.loggeduser.CurrentProjectName = d2;
				Element.Tools.SetCookie("logininfo", JSON.stringify(app.loggeduser));
				Element.Tools.SetCookie("pagename", "Overview");
				window.location = "/ui/modules/project/#project?p="+d1;

			}

		}

	});


})(jQuery);


