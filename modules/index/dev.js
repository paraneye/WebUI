/*
Written by hitapia(sbang)
Role : main index js
*/
var app = app || {};
(function($){
	app.indexdev = Element.View.extend({
		dev : true,
		ing : [
			{ linkname : "Project List", link : "/modules/project/" },
			{ linkname : "Schedule Edit", link : "/modules/project/#schedit/1" },
			{ linkname : "Project Overview", link : "/modules/project/#project" },
			{ linkname : "Project Member", link : "/modules/project/#members/1" },
			{ linkname : "Human Reources List", link : "/modules/project/#hrlist/1" },
			{ linkname : "Human Reources - Import History", link : "/modules/project/#hr/1/importhistorylist" },
			{ linkname : "Project Member List", link : "/modules/project/#members/1" },
			{ linkname : "User List", link : "/modules/global/#userlist" },
			{ linkname : "User Profile", link : "/modules/global/#userprofile/1" },
			{ linkname : "Global Setting Home", link : "/modules/global/#home" },
			{ linkname : "Global Setting CostCode List", link : "/modules/global/#costcodelist" },			
			{ linkname : "Global Setting>CostCode Import File", link : "/modules/global/#costcodeimportlist" },
			{ linkname : "Global Setting>Roles", link : "/modules/global/#rolelist" },
			{ linkname : "Global Setting>New Role", link : "/modules/global/#rolecreate/1" },
			{ linkname : "Global Setting>Companies", link : "/modules/global/#companylist" },
			{ linkname : "Project Setting>CostCode Estimates", link : "/modules/project/#costcodelist/1" },
			{ linkname : "Project Setting>CostCode Import History", link : "/modules/project/#costcodelist/1/importhistorylist" },
			{ linkname : "Project Setting>CostCode map to Client CostCode - List", link : "/modules/project/#costcodemaplist" },
			{ linkname : "Project Setting>CWA,CWP List", link : "/modules/project/#cwacwplist" },
			{ linkname : "Project Setting>Document Library", link : "/modules/project/#documentlist" },
			{ linkname : "Project Setting>Form Library", link : "/modules/project/#formlist" },
			{ linkname : "Project Setting>Reports and Records", link : "/modules/project/#reportlist" },
			{ linkname : "MTO>Material Library", link : "/modules/mto/#materiallist" },
			{ linkname : "MTO>Equipment Library", link : "/modules/mto/#equipmentlist" },
			{ linkname : "MTO>Progress Type Management", link : "/modules/mto/#progresstypelist" },
			{ linkname : "MTO>Drawing Type Management", link : "/modules/mto/#drawingtypelist" },
			{ linkname : "MTO>Assign Cost Code", link : "/modules/mto/#assigncostcodelist" },
			{ linkname : "MTO>Import MTO", link : "/modules/mto/#importmtolist" },
			{ linkname : "MTO>Manage Drawing", link : "/modules/mto/#managedrawinglist" },
			{ linkname : "MTO>Initial Screen - Lower", link : "/modules/mto/#mtoview" }
			
		],
		done : [
			{ linkname : "test", link : "/modules/_test" }
		],
		render : function(){
			var self = this;
			app.TemplateManager.get("/common/tpl/tpl_dev.html", function(template){
				$("body").html($(template));
				$(".sga_wrapper").hide();
				_(self.ing).each(function(item){
					$("#ing").append("<a href='"+item.link+"' class='list-group-item'>"+item.linkname+"</a>");
				});
				_(self.done).each(function(item){
					$("#done").append("<a href='"+item.link+"' class='list-group-item'>"+item.linkname+"</a>");
				});
			});
			return this;
		}
	});
})(jQuery)
