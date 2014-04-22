/*
 * Wirtten by hitapia(sbang)
 */
var app = app || {};
(function($){
	app.modelimporthistory = Element.Model.extend({
		urlRoot : app.config.domain + "/Common/Common.svc/rest/ImportHistorys",
		defaults : {
        	SigmaOperation : "",
        	ImportHistoryId : 0,
        	ImportdFileName : "",
        	ImportedDate : "",
        	TotalCount : 0,
        	SuccessCount : 0,
        	FailCount : 0,
        	CreatedBy : "",
        	UpdatedBy : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.url= app.config.domain + "/Common/Common.svc/rest/ImportHistorys";
				//this.url = "/modules/common/data/importhistory.js";
		}
	});
	app.modelimporthistorys = Element.Collection.extend({
		url : app.config.domain + "/Common/Common.svc/rest/ImportHistorys",
		model : app.modelimporthistory,
		initialize : function(){
			if(app.config.debug)
				this.url = app.config.domain + "/Common/Common.svc/rest/ImportHistorys";
		}
	});
	app.user = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaUsers",
		defaults : {
			SigmaOperation : "",
			SigmaUserId : "",
			CompanyId : 0,
			CompanyName : "",
			EmployeeId : "",
			FirstName : "",
			LastName : "",
			PhoneNo : "",
			Email : "",
			PhotoUrl : "",
			StartDate : "",
			EndDate : "",
			Password : "",
			OldPassword : "",
			NewPassword : "",
			ConfirmNewPassword : "",
			IsActive : "",
			CreatedBy : "",
			UpdatedBy : "",
			SigmaUserGuid : "",
			SigmaUserSigmaRoles :[{}],			
			DefaultProjectId : 0
		},
		initialize : function(){
		
		}
	});
	app.userlist = Element.Collection.extend({
		url : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaUsers",
		model : app.user,
		initialize : function(){
			
		}
	});
	app.userprofilemodel = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/UserProfile",
		defaults : {
			SigmaOperation : "",
			SigmaUserId : "",
			CompanyId : 0,
			CompanyName : "",
			EmployeeId : "",
			FirstName : "",
			LastName : "",
			PhoneNo : "",
			Email : "",
			PhotoUrl : "",
			StartDate : "",
			EndDate : "",
			Password : "",
			OldPassword : "",
			NewPassword : "",
			ConfirmNewPassword : "",
			IsActive : "",
			CreatedBy : "",
			UpdatedBy : "",
			SigmaUserGuid : "",
			SigmaUserSigmaRoles :[{}],			
			DefaultProjectId : 0
		},
		initialize : function(){
		
		}
	});
	app.usersigmarole = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaUsers",
		defaults : {
			SigmaOperation : "",
			SigmaRoleId : 0,
			SigmaUserId : "",
			ReportTo : "",
			ReportToRole : 0,
			IsDefault : "",
			ProjectId : 0,
			CreatedBy : "",
			UpdatedBy : ""
			
		},
		initialize : function(){
		
		}
	});
	app.usercombo = Element.Model.extend({
		urlRoot : app.config.domain + "/Common/Common.svc/rest/SigmaUserCombo",
		defaults : {
			Project : "",
			Role : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.urlRoot = app.config.domain + "/Common/Common.svc/rest/SigmaUserCombo";
		}
	});
	app.usercombos = Element.Collection.extend({
		url : app.config.domain + "/Common/Common.svc/rest/SigmaUserCombo",
		model : app.usercombo,
		initialize : function(){
			if(app.config.debug)
				this.url = app.config.domain + "/Common/Common.svc/rest/SigmaUserCombo";
		}
	});
	app.companycombo = Element.Model.extend({
		urlRoot : app.config.domain + "/Common/Common.svc/rest/CompanyCombo",
		defaults : {
			Project : "",
			Role : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.urlRoot = app.config.domain + "/Common/Common.svc/rest/CompanyCombo";
		}
	});
	app.companycombos = Element.Collection.extend({
		url : app.config.domain + "/Common/Common.svc/rest/CompanyCombo",
		model : app.companycombo,
		initialize : function(){
			if(app.config.debug)
				this.url = app.config.domain + "/Common/Common.svc/rest/CompanyCombo";
		}
	});
	app.companyallcombos = Element.Collection.extend({
	    url: app.config.domain + "/Common/Common.svc/rest/CompanyAllCombo",
	    model: app.companycombo,
	    initialize: function () {
	        if (app.config.debug)
	            this.url = app.config.domain + "/Common/Common.svc/rest/CompanyAllCombo";
	    }
	});
	app.cwp = Element.Model.extend({
		urlRoot : app.config.domain + "/Common/Common.svc/rest/CwpCombo",
		defaults : {
			Project : "",
			Role : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.urlRoot = app.config.domain + "/Common/Common.svc/rest/CwpCombo";
		}
	});
	app.cwps = Element.Model.extend({
		url : app.config.domain + "/Common/Common.svc/rest/CwpCombo",
		model : app.cwp,
		initialize : function(){
			if(app.config.debug)
				this.url = app.config.domain + "/Common/Common.svc/rest/CwpCombo";
		}
	});
	app.iwpmodel = Element.Model.extend({
		urlRoot : app.config.domain + "/Common/Common.svc/rest/IwpCombo",
		defaults : {
			Project : "",
			Role : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.urlRoot = app.config.domain + "/Common/Common.svc/rest/IwpCombo";
		}
	});
	app.iwps = Element.Model.extend({
		url : app.config.domain + "/Common/Common.svc/rest/IwpCombo",
		model : app.iwpmodel,
		initialize : function(){
			if(app.config.debug)
				this.url = app.config.domain + "/Common/Common.svc/rest/IwpCombo";
		}
	});

	app.user_role = Element.Model.extend({
		urlRoot : app.config.domain + "/Common/Common.svc/rest/PersonnelTypeCombo",
		defaults : {
			Project : "",
			Role : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.urlRoot = app.config.domain + "/Common/Common.svc/rest/PersonnelTypeCombo";
		}
	});
	app.user_roles = Element.Collection.extend({
		url : app.config.domain + "/Common/Common.svc/rest/PersonnelTypeCombo",
		model : app.user_role,
		initialize : function(){
			if(app.config.debug)
				this.url = app.config.domain + "/Common/Common.svc/rest/PersonnelTypeCombo";
		}
	});
	app.customfields = Element.Collection.extend({
		url : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/ComponentCustomFields",
		model : app.user_role,
		initialize : function(){
			if(app.config.debug)
				this.url = app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/ComponentCustomFields";
		}
	});
	app.uomCode = Element.Collection.extend({
		url : app.config.domain + "/Common/Common.svc/rest/UomCombo",
		model : app.user_role,
		initialize : function(){
			if(app.config.debug)
				this.url = app.config.domain + "/Common/Common.svc/rest/UomCombo";
		}
	});
	app.costcodecombo = Element.Collection.extend({
		urlRoot : app.config.domain + "/Common/Common.svc/rest/CostCodeCombo",
		defaults : {
			Code : "",
			CodeName : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.urlRoot = app.config.domain + "/Common/Common.svc/rest/CostCodeCombo";
		}
	});
	app.costcodecombos = Element.Collection.extend({
		url : app.config.domain + "/Common/Common.svc/rest/CostCodeCombo",
		model : app.costcodecombo,
		initialize : function(){
			if(app.config.debug)
				this.url = app.config.domain + "/Common/Common.svc/rest/CostCodeCombo";
		}
	});
	app.roleinfo = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaRoles",
		defaults : {
			SigmaRoleId : 0,
			Name : "",
			RoleDescription : ""
		},
		initialize : function(){
		}
	});
	app.roleinfolist = Element.Collection.extend({
		url : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaRoles",
		model : app.roleinfo,
		initialize : function(){
		}
	});
	app.role = Element.Model.extend({
		urlRoot : app.config.domain + "/Common/Common.svc/rest/SigmaRoleCombo",
		defaults : {
			"Code" : "",
			"CodeName" : ""
		},
		initialize : function(){
		}
	});
	app.rolelist = Element.Collection.extend({
		url : app.config.domain + "/Common/Common.svc/rest/SigmaRoleCombo",
		model : app.role,
		initialize : function(){
		}
	});
	app.discipline = Element.Model.extend({
		url : app.config.domain + "/Common/Common.svc/rest/DisciplinesCombo",
		defaults : {
			Code : "",
			CodeName : ""
		},
		initialize : function(){
		}
	});
	app.disciplines = Element.Collection.extend({
		model : app.discipline,
		url : app.config.domain + "/Common/Common.svc/rest/DisciplinesCombo",
		initialize : function(){
		}
	});
	
	app.sigmarole = Element.Model.extend({
		url : app.config.domain + "/Common/Common.svc/rest/SigmaRoleCombo",
		defaults : {
			Code : "",
			CodeName : ""
		},
		initialize : function(){
		}
	});
	app.sigmarolelist = Element.Collection.extend({
		model : app.sigmarole,
		url : app.config.domain + "/Common/Common.svc/rest/SigmaRoleCombo",
		initialize : function(){
		}
	});

	app.messagemodel = Element.Model.extend({
		urlRoot : app.config.domain + "/Common/Common.svc/rest/MessageBoxs",
		defaults : {
			SigmaOperation : "",
			MsgTypeCode : "",
			MsgSeq : 0,
			MsgTitle : "",
			MsgTo : "",
			IsRead : "",
			IsDelete : "",
			CreatedBy : "",
			UpdatedBy : "",
			ContextSeq : 0
		},
		initialize : function(){
			if(app.config.debug)
				this.urlRoot = app.config.domain + "/Common/Common.svc/rest/MessageBoxs";
		}
	});
	app.messagelist = Element.Collection.extend({
		url : app.config.domain + "/Common/Common.svc/rest/MessageBoxBySigmaUserId",
		model : app.messagemodel,
		initialize : function(){
			if(app.config.debug)
				this.url = app.config.domain + "/Common/Common.svc/rest/MessageBoxBySigmaUserId";
		}
	});
	
})(jQuery);
