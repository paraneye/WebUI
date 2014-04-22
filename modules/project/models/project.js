/*
 * Wirtten by hitapia(sbang)
 */
var app = app || {};
(function($){
	app.project = Element.Model.extend({
		url : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/Projects",
		defaults : {
			SigmaOperation : "",
			ProjectId : 0,
			ProjectName : "",
			ProjectNumber : "",
			ProjectDescription : "",
			CompanyId : 0,
			CountryName: "",
			CountyName: "",
			CityName: "",
			LogoFilePath: "",
			ClientCompanyId:0,
			ClientProjectId:"",
			ClientProjectName:"",
			IsActive:"",
			CreatedBy:"",
			UpdatedBy:"",
			ProjectManagerId:"",
			ProjectDiscipline:[{}],
			ProjectSubcontractor:[{}]

		},
		initialize : function(){
		}
	});
	app.projectdetail = Element.Model.extend({
		url : "",
		defaults : {
			Id : "", 
			Discipline : "", 
			ProjectName : "",
			ProjectID:"",
			Country:"",
			County:"",
			City:"",
			Logo:"",
			Description:"",
			Client:"",
			CProjectName:"",
			CProjectID:"",
			Subcontractors:""
		},
		initialize : function(){
			if(app.config.debug)
				this.url = "/modules/project/data/projectdetail.js";
		}
	});
	app.projects = Element.Collection.extend({
		model : app.project,
		url : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/Projects",
		initialize : function(){
		}
	});
	app.projectschedule = Element.Model.extend({
		url : "",
		defaults : {
			Id : "",
			Name : "",
			Value : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.url = "/modules/project/data/projectschedule.js";
		}
	});
	app.hr = Element.Model.extend({
		urlRoot : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/Personnels",
		defaults : {
			SigmaOperation : "", // CRUD
			PersonnelId : 0,
			Name : "",
			FirstName : "",
			LastName : "",
			CompanyId : 0,
			PersonnelTypeCode : "",
			CompanyName : "",
			RoleName : "",
			PhotoUrl : "",
			EmployeeId : "",
			PhoneNumber : "",
        	EmailAddress : "",
			NfcCardId : "",
			PinCode : "",
			CreatedBy : "",
			UpdatedBy : ""
		},
		initialize : function(){
		}
	});
	app.hrs = Element.Collection.extend({
		url : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/Personnels",
		model : app.hr,
		initialize : function(){
			if(app.config.debug)
				this.url = app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/Personnels";
		}
	});
	app.member_dis = Element.Model.extend({
		defaults: {
			SigmaOperation:"",
			ProjectId:0,
			SigmaUserId:"",
			DisciplineCode:""
		}
	});
	app.member_role = Element.Model.extend({
		defaults: {
			SigmaOperation:"",
			SigmaRoleId:0,
			SigmaUserId:"",
			ReportTo:"",
			ReportToRole:0,
			IsDefault:"",
			ProjectId:0,
			CreatedBy:"",
			UpdatedBy:""
		}
	});
	app.member = Element.Model.extend({
		url : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/Member",
		defaults : {
			typeProjectUserDiscipline : [
				{
					SigmaOperation : "",
					ProjectId : 0,
					SigmaUserId : "",
					DisciplineCode : "",
					UserName : ""
				}],
			typeSigmaUserSigmaRole : [
				{
					SigmaOperation : "",
					SigmaRoleId : 0,
					SigmaUserId : "",
					ReportTo : "",
					ReportToRole : 0,
					IsDefault : "",
					ProjectId : 0,
					CreatedBy : "",
					UpdatedBy : ""
				}]
		},
		initialize : function(){
		}
	});
	app.members = Element.Collection.extend({
		model : app.member,
		url : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/Member",
		initialize : function(){
			
		}
	});

	app.projectcostcode = Element.Model.extend({
		urlRoot : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/ProjectCostCodes",
		defaults : {			
			SigmaOperation : "", // CRUD
        	ProjectCostCodeId : 0,
        	CostCodeId : 0,
        	CostCode : "",
        	Description : "",
        	ProjectId : 0,
        	UomCode : "",
        	UomName : "",
        	EstimatedQty : 0,
        	EstimatedManhour : 0,
        	CreatedBy : "",
        	UpdatedBy : ""
		},
		initialize : function(){
			//if(app.config.debug)
				//this.url = "/modules/project/data/costcode.js";
		}
	});
	app.projectcostcodes = Element.Collection.extend({
		url : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/ProjectCostCodes",
		model : app.projectcostcode,
		initialize : function(){
			//if(app.config.debug)
				//this.url = "/modules/project/data/costcodes.js";
		}
	});
	app.costcodemap = Element.Model.extend({
		url : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/CostCodeMaps",
		defaults : {			
			CostCodeMapId : 0,			
			ClientCostCodeId : 0,
			ClientCostCode : "",
			ClientCostCodeName : "",
			ProjectCostCode : "",
			ProjectCostCodeName : ""
		},
		initialize : function(){
		
		}
	});
	app.costcodemaplist = Element.Collection.extend({
		url : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/CostCodeMaps",
		model : app.costcodemap,
		initialize : function(){
		
		}
	});
	app.cwacwp = Element.Model.extend({
		urlRoot : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/CWAs",
		defaults : {			
			SigmaOperation : "",
			CwaId : 0,
			ProjectId : 0,
			Name : "",
			Area : "",
			Description : "",
			CreatedBy : "",
			UpdatedBy : "",
			CWP : [{}]
		},
		initialize : function(){
		}
	});
	app.cwacwplist = Element.Collection.extend({
		url : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/CWAs",
		model : app.cwacwp,
		initialize : function(){
		}
	});
	app.cwp = Element.Model.extend({
		urlRoot : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/CWPs",
		defaults : {			
			SigmaOperation : "",
			CwpId : 0,
			CwaId : 0,
			CwpName : "",
			DisciplineCode : "",
			Description : "",
			CreatedBy : "",
			UpdatedBy : ""
		},
		initialize : function(){
		}
	});
	app.document = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/FileStores",
		defaults : {			
			SigmaOperation : "",
			ProjectId : 0,
			FileStoreId : 0,
			FileTitle : "",
			FileDescription : "",
			FileCategory : "",
			FileTypeCode : "",
			CreatedBy : "",
			UpdatedBy : "",
			UploadedFileInfo : {}
		},
		initialize : function(){
		}
	});
	app.documentlist = Element.Collection.extend({
		url : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/FileStores",
		model : app.document,
		initialize : function(){
		}
	});
	app.documenttype = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/FileType/File_Type",
		defaults : {			
			SigmaOperation : "",
			ProjectId : 0,
			FileStoreId : 0,
			FileTitle : "",
			FileDescription : "",
			FileCategory : "",
			FileTypeCode : "",
			CreatedBy : "",
			UpdatedBy : "",
			UploadedFileInfo : {}
		},
		initialize : function(){
		}
	});
	app.documenttypelist = Element.Collection.extend({
		url : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/FileType/File_Type",
		model : app.documenttype,
		initialize : function(){
		}
	});
	app.dochistory = Element.Model.extend({
		url : app.config.domain + "GlobalSettings/SigmaGlobalSettings.svc/rest/UploadedFileInfos",
		defaults : {			
			Id : "",
			Index : "",
			ClientCodeCodeId : "",
			ClientCodeCodeDesc : "",
			ProjectCodeCodeId : "",
			ProjectCodeCodeDesc : ""
		},
		initialize : function(){
		
		}
	});
	app.dochistorylist = Element.Collection.extend({
		url : app.config.domain + "GlobalSettings/SigmaGlobalSettings.svc/rest/UploadedFileInfos",
		model : app.dochistory,
		initialize : function(){
		
		}
	});
	app.formlibrary = Element.Model.extend({
		url : "",
		defaults : {			
			Id : "",
			Index : "",
			ClientCodeCodeId : "",
			ClientCodeCodeDesc : "",
			ProjectCodeCodeId : "",
			ProjectCodeCodeDesc : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.url = "/modules/project/data/costcodemaplist.js";
		}
	});
	app.formlibrarylist = Element.Collection.extend({
		url : "",
		model : app.formlibrary,
		initialize : function(){
			if(app.config.debug)
				this.url = "/modules/project/data/costcodemaplist.js";
		}
	});
	app.report = Element.Model.extend({
		url : "",
		defaults : {			
			Id : "",
			Index : "",
			ClientCodeCodeId : "",
			ClientCodeCodeDesc : "",
			ProjectCodeCodeId : "",
			ProjectCodeCodeDesc : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.url = "/modules/project/data/costcodemaplist.js";
		}
	});
	app.reportlist = Element.Collection.extend({
		url : "",
		model : app.report,
		initialize : function(){
			if(app.config.debug)
				this.url = "/modules/project/data/costcodemaplist.js";
		}
	});
	
})(jQuery);
