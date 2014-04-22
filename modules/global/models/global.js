/*
 * Wirtten by hitapia(sbang)
 */
var app = app || {};
(function($){
	app.costcode = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/CostCodes",
		defaults : {
			CostCodeId : "",
			CostCode : "",
			Description : "",
			CompanyId : "",
			CodeRegisterCompanyId : "",
			CostCodeType : "",
			UomCode : "",
			CreatedBy : "",
			UpdatedBy : "",
			SigmaOperation : ""
		},
		initialize : function(){
			if(app.config.debug){
				//this.url = "/modules/global/data/costcode.js";
			}
		}
	});
	app.costcodes = Element.Collection.extend({
		url : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/CostCodes",
		model : app.costcode,
		initialize : function(){
		}
	});
	app.company = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/Companys",
		defaults : {
			SigmaOperation : "",
			CompanyId : "",
			Name : "",
			IsClient : "",
			Address : "",
			ContactName : "",
			ContactPhone : "",
			ContactFax : "",
			ContactEmail : "",
			ContractTypeCode : "",
			CompanyTypeCode: "",
			CompanyTypeName: "",
			LogoFilePath : "",
			CreatedBy : "",
			UpdatedBy: ""
		},
		initialize : function(){
			if(app.config.debug){
				this.urlRoot = app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/Companys";
			}
		}
	});
	app.companylist = Element.Collection.extend({
		url : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/Companys",
		model : app.company,
		initialize : function(){
			if(app.config.debug){
				this.url = app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/Companys"
			}
		}
	});
	app.companytype = Element.Model.extend({
		urlRoot : app.config.domain + "/Common/Common.svc/rest/CompanyTypeCombo",
		defaults : {
			Code : "",
			Name : ""
		},
		initialize : function(){
		}
	});
	app.companytypelist = Element.Collection.extend({
		url : app.config.domain + "/Common/Common.svc/rest/CompanyTypeCombo",
		model : app.companytype,
		initialize : function(){
		}
	});
	
})(jQuery);
