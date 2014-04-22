
var app = app || {};
(function($){
	app.componentcustom = Element.Model.extend({
		defaults : {
            SigmaOperation : "", // CRUD
            ComponentId : 0,
            CustomFieldId : 0,
            Value : "",
            CreatedBy : "",
            UpdatedBy : ""
		}
	});
	app.typecomponent = Element.Model.extend({
		defaults : {
			SigmaOperation : "", // CRUD
			ComponentId : 0,
			MaterialId : 0,
			CwpId : 0,
			DrawingId : 0,
			ScheduledWorkItemId : 0,
			TagNumber : "",
			ComponentProgressRatio : 0,
			CompletedPercent : 0,
			Qty : 0,
			Description : "",
			IsoLineNo : 0,
			EngTagNumber : "",
        	ImportHistoryId : 0,
			CreatedBy : "",
			UpdatedBy : "",
        	ComCustomField : [{}]
		}
	});
	app.material = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/Materials",
		defaults : {
			SigmaOperation: "",
			MaterialId : 0,
			DisciplineCode : "",
			TaskCategoryId : 0,
			TaskTypeId : 0,	
			Manhours : 0,
			UomCode : "",
			Vendor : "",
			PartNumber : "",
			IsConsumable :"",
			Description : "",
			CostCodeId : 0,
			CreatedBy : "",
			UpdatedBy : "",
 			CustomField : [{}]
		},
		initialize : function(){
			if(app.config.debug)
				this.url = app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/Materials";
		}
	});
	app.materialcreate = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/Materials",
		defaults : {
		},
		initialize : function(){
			if(app.config.debug)
				this.url = app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/Materials";
		}
	});
	app.materiallist = Element.Collection.extend({
		url : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/Materials",
		model : app.material,
		initialize : function(){
			if(app.config.debug)
				this.url =app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/Materials";
		}
	});
	app.material_field = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/EquipmentCustomFieldsWithCustomField/",
		defaults : {
			SigmaOperation : "",
			CustomFieldId : 0,
			FieldType : "",
			FieldName : "",
			IsDisplayable :"",
			CreatedBy :"",
			UpdatedBy:"",
			DisciplineCode:"",
			Parentid:0,
			Value:""
		},
		initialize : function(){
		}
	});
	app.material_fieldlist = Element.Collection.extend({
		url : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/EquipmentCustomFieldsWithCustomField/",
		model : app.material_field,
		initialize : function(){
		}
	});
	
	app.equipment = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/Equipments",
		defaults : {
			SigmaOperation : "",
			EquipmentId : 0,
			EquipmentCodeMain : "",
			EquipmentCodeSub : "",
			ThirdLevel : "",
			Spec : "",
			EquipmentType : "",
			ModelNumber : "",
			Description : "",
			CreatedBy : "",
			UpdatedBy: "",
			CustomField : [{}]
		},
		initialize : function(){
		}
	});
	app.equipmentlist = Element.Collection.extend({
		url :  app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/Equipments",
		model : app.equipment,
		initialize : function(){
		}
	});
	app.equipment_field = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/EquipmentCustomFieldsWithCustomField/",
		defaults : {
			SigmaOperation : "",
			CustomFieldId : 0,
			FieldType : "",
			FieldName : "",
			IsDisplayable :"",
			CreatedBy :"",
			UpdatedBy:"",
			DisciplineCode:"",
			Parentid:0,
			Value:""
		},
		initialize : function(){
		}
	});
	app.equipment_fieldlist = Element.Collection.extend({
		url : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/EquipmentCustomFieldsWithCustomField/",
		model : app.equipment_field,
		initialize : function(){
		}
	});
	
	app.progresstype = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/ProgressTypes",
		defaults : {
			SigmaOperation : "",
			ProgressTypeId : 0,
			DisciplineCode : "",
			TaskCategoryId : 0,
			TaskTypeId :0,
			Name : "",
			Description : "",
			CreatedBy : "",
			UpdatedBy : "",
			ProgressStep :[{}]
		},
		initialize : function(){

		}
	});
	app.progresstypelist = Element.Collection.extend({
		url : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/ProgressTypes",
		model : app.progresstype,
		initialize : function(){

		}
	});
	app.progresstype_step = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/ProgressStepByProgessTypeId",
		defaults : {
			SigmaOperation : "",
			ProgressStepId : 0,
			ProgressTypeId : 0,
			Name : "",
			IsMultipliable : "",
			Weight :0,
			CreatedBy :"",
			UpdatedBy :""
		},
		initialize : function(){
		}
	});
	app.progresstype_steplist = Element.Collection.extend({
		url : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/ProgressStepByProgessTypeId",
		model : app.progresstype_step,
		initialize : function(){
		}
	});
	app.drawingcreate = Element.Model.extend({
		urlRoot : "/ProjectData/SigmaProjectData.svc/rest/Drawings",
		defaults : {
			DrawingId : 0,
			CwpId : 0,
			CwpName : "",
			DrawingNum : "",
			Revision : "",
			FileName : "",
			Title : "",
			Type : "",
			Description : "",
			ReferenceDrawing : "",
			DetailedDrawing : "",
			Image : "",
			CreatedBy : "",
			CreatedDate : ""
		},
		initialize : function(){
		}
	});
app.drawingtype = Element.Model.extend({
		urlRoot : "/ProjectData/SigmaProjectData.svc/rest/Drawings",
		defaults : {
			SigmaOperation : "", // CRUD
			DrawingId : "",
        	CWP : "",
        	Name : "",
        	FileName : "",
        	Revision : "",
        	Title : "",
        	DrawingType : "",
        	Description : "",
        	ReferenceDrawings : "",
        	DetailedDrawings : "",
        	IsBinded : "",
        	UploadedFileInfoId : "",
        	ImportedSourceFileInfoID : "",
        	CreatedBy : "",
        	UpdatedBy : ""
		},
		initialize : function(){
		}
	});
	app.drawingtypelist = Element.Collection.extend({
		url : "/ProjectData/SigmaProjectData.svc/rest/Drawings",
		model : app.drawingtype,
		initialize : function(){
		}
	});	
	app.assigncostcode = Element.Model.extend({
		urlRoot : "",
		defaults : {
			ComponentProgressId : 0,
			CwpName : "",
			TaskCategoryName : "",
			TaskTypeName : "",
			Description : "",
			TagNumber : "",
			UOM : "",
			Manhour : 0,
			CostCode : "",
			CwpId : 0,
			TaskCategoryId : 0,
			TaskTypeId : 0,
			ProgressTypeId : 0,
			Progress : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.url = "/modules/global/data/rolelist.js";
		}
	});
	app.assigncostcodelist = Element.Collection.extend({
		url : "/ProjectData/SigmaProjectData.svc/rest/AssignmentComponentProgress",
		model : app.assigncostcode,
		initialize : function(){
		}
	});
	app.costcode = Element.Model.extend({
		urlRoot : "",
		defaults : {
		    CostCodeId: 0,
		    CostCode: "",
            Description: ""
		},
		initialize : function(){
			if(app.config.debug)
				this.url = "/modules/global/data/rolelist.js";
		}
	});
	app.costcodelist = Element.Collection.extend({
	    url: "/GlobalSettings/SigmaGlobalSettings.svc/rest/CostCodes",
		model : app.costcode,
		initialize : function(){
		}
	});
	app.managedrawing = Element.Model.extend({
		urlRoot : app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/Drawings",
		defaults : {
			TotalCount : 0,
			DrawingId : 0,
			CwpName : "",
			DrawingNum : "",
			Revision : "",
			FileName : "",
			Title : "",
			Type : "",
			Description : "",
			ReferenceDrawing : "",
			Image : "",
			CreatedBy : "",
			CreatedDate : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.urlRoot = app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/Drawings";
		}
	});
	app.managedrawinglist = Element.Collection.extend({
		url : app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/Drawings",
		model : app.managedrawing,
		initialize : function(){
			if(app.config.debug)
				this.url = app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/Drawings";
		}
	});
	app.mto = Element.Model.extend({
		urlRoot : app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/CivilMTOs",
		defaults : {
			SigmaOperation : "",
			ComponentId : 0,	//D
			CwpName : "",
			DrawingId : 0,	//D
			Name : "",
			TaskCategoryId : 0,	//D
			TaskCategoryName : "",
			MaterialId : 0,
			MaterialName : "",
			TaskTypeId : 0,	//D
			TaskTypeName : "",
			STRUCTURE : "",
			Qty : 0,
			UomCode : "",
			PartNumber : "",
			Vendor : "",
			CreatedBy : "",
			CreatedDate : ""
		},
		initialize : function(){
			if(app.config.debug)
				this.urlRoot = app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/CivilMTOs";
		}
	});
	app.componentlist = Element.Collection.extend({
		url : app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/ComponentsByDrawingId",
		model : app.mto,
		initialize : function(){
		}
	});
	app.materiallistformto = Element.Collection.extend({
		url : app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/ImportMTOs",
		model : app.mto,
		initialize : function(){
		}
	});
	app.mtolist = Element.Collection.extend({
		url : app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/CivilMTOs",
		model : app.mto,
		initialize : function(){
			if(app.config.debug)
				this.url = app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/CivilMTOs";
		}
	});

	app.mtohistlist = Element.Collection.extend({
	    url: app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/ComponentsByImportHistory",
	    model: app.mto,
	    initialize: function () {
	        if (app.config.debug)
	            this.url = app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/ComponentsByImportHistory";
	    }
	});

	app.drawingtypemst = Element.Model.extend({
		urlRoot : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaCodes",
		defaults : {
			SigmaOperation : "", // CRUD
			Code : "",
        	CodeCategory : "",
        	CodeName : "",
        	CodeShortName : "",
        	RefChar : "",
        	RefNo : "",
        	Description : "",
        	IsActive : "",
        	SortOrder : "",
        	CreatedBy : "",
        	UpdatedBy : ""
		},
		initialize : function(){
		}
	});
	app.drawingtypemstlist = Element.Collection.extend({
		url : app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/SigmaCodes",
		model : app.drawingtypemst,
		initialize : function(){
		}
	});
	app.iwpviewer = Element.Model.extend({
		urlRoot : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/IwpViewer",
		defaults : {
		},
		initialize : function(){
		}
	});
	app.iwpviewerlist = Element.Collection.extend({
		url : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/IwpViewer",
		model : app.drawingtypemst,
		initialize : function(){
		}
	});
	
})(jQuery);
