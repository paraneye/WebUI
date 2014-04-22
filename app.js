/*
 * Wirtten by hitapia(sban)
 * Role : Starter & Common Value Setup
 * 현재 이 폴더 앱에서 사용할 부분에 대한 정의를 한다.
 */

var app = app || {};
app = {
	config : {
		title : "Element Sigma",
		debug : false,
		jsonp : false,
		cookieexpirehour : 87600,
		project : null,
		plink : [],
        path : "/ui",
		domain : "",
		uploadpath : "/Common/FileHandler.ashx",
		docPath : {
			docs :  "/SigmaStorage/",
			template :  "/SigmaStorage/Template/",
			temp :  "/SigmaStorage/Temporary/",
			images : "/SigmaStorage/"
		},
		filebase : "/SigmaStorage/",
		paging : {
			itemperpage : 10
		},
		downloads : {
		    costcodetemplate: "costcode_template.xlsx",
		    projectcostcodetemplate: "projectcostcode_template.xlsx",
		    clientcostcodetemplate: "clientcostcode_template.xlsx",
		    personnelstemplate: "personnels_template.xlsx",
		    userstemplate: "users_template.xlsx",
			drawingtemplate: "Import-DrawingList-Template.xlsx",
			meteriallibrarytemplate: "Import-MaterialLibrary-Template.xlsx",
			equipmentlibrarytemplate: "Import-EquipmentLibrary-Template.xlsx",
			consumablelibrarytemplate: "Import-ConsumableLibrary-Template.xlsx",
			mtotemplate: "Import-MTO-Template.xlsx"
		},
		tpl : {
			header : "/ui/common/tpl/tpl_header.html",
			subheader : "/ui/common/tpl/tpl_subheader.html",
			contenttop : "/ui/common/tpl/tpl_content_top.html",
			unsignedheader : "/ui/common/tpl/tpl_unsigned.html",
			footer : "/ui/common/tpl/tpl_footer.html"
		}
	},
	userprojectlist : null,
	caller : 0,
	loggeduser : {
		Id : "",
		Name : "",
		ProjectId: "",
		CompanyId: "",
        CompanyName: "",
		ModuleId : "",
		LoginDate : null,
        Perms : null
	},
	TemplateManager : {
		templates: {},
		getnocache: function(id, callback){
			$.get(id, function(template){ callback(template); });
		},
		get: function(id, callback){
			var self = this;
			var template = self.templates[id];
			if (template){
				callback(template);
			}else{
				$.get(id, function(template){
					self.templates[id] = template;
					callback(template);
				});
			}
		}
	},
	SetTitle : function(pages){
	},
	Logout : function(){
		app.userprojectlist = null;
		Element.Tools.DeleteCookie("logininfo");
		window.location = "/ui/#login";
	},
	Login : function(){
		Element.Tools.SetCookie("logininfo", JSON.stringify(app.loggeduser));
		L(app.loggeduser.CurrentProjectId);
		if(app.loggeduser.CurrentProjectId != ""){
			window.location = "/ui/modules/project/#project?p="+app.loggeduser.CurrentProjectId;
		}else{
			window.location = "/ui/";
		}
	},
	CheckLogged : function(){
		var logged = Element.Tools.GetCookie("logininfo");
		return (logged != undefined && logged != "") ? true : false;
	},
	GetLoginInfo : function(){
		var logged = Element.Tools.GetCookie("logininfo");
		if(logged != undefined && logged != ""){
			app.loggeduser = JSON.parse(logged);
			if(app.loggeduser.IsActivated == "N"){
				window.location = "/ui/#updatepassword";
				return;
			}
			Element.Tools.SetCookie("logininfo", JSON.stringify(app.loggeduser));
		}
	},
	Start : function(){ 		//Start App
		L(app.config.debug);
		if(app.config.debug){
			$(".navbar").show();
			$.getJSON("/ui/resources/version.js", function(data){
				if(data != ""){
					var info = "This is developer version - ";
					info += data.version;
					info += " (" +data.update+")&nbsp;-&nbsp;";
					info += "<a href='"+data.link+"' target='_blank'>Patch Note</a>";
					$(".navbar div").html(info);
				}
			});
		}
	},
	Nav : function(){
		Element.Tools.MakeNav(ElementMenu.Project, $("#subheader ul"));
	},
	Debug : function(l, s){
	}
};

$.ajaxSetup({ cache: false });
//For Develop or Debugger - Start
function L(msg){
	console.log(msg);
}
//For Develop or Debugger - End
app.GetLoginInfo();

//basic model
(function($){
	app.page = Element.Model.extend({ defaults : { Id : "", Title : "" } });
	app.keyvalue = Element.Model.extend({ defaults : { Id : "", Name : "", Value : "" } });
	app.exception = Element.Model.extend({ defaults : { Id : "", Code : "", Message : "" } });

	app.pages = Element.Collection.extend({ model : app.page });
	app.keyvalues = Element.Collection.extend({ model : app.keyvalue });
	app.exceptions = Element.Collection.extend({ model : app.exception });
})(jQuery);

//for dev. and test
app.config.debug = true;
app.Start();
