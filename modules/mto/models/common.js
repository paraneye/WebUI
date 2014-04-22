/*
 * Wirtten by hitapia(sbang)
 */
var app = app || {};
(function($){	
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
	app.project = Element.Model.extend({
		url : "",
		defaults : {
			Id : "",
			Name : "",
			Value : ""
		},
		initialize : function(){
		}
	});
	app.projects = Element.Collection.extend({
		model : app.project,
		url : "",
		initialize : function(){
		}
	});
	app.taskcategory = Element.Model.extend({
		url : app.config.domain + "/Common/Common.svc/rest/TaskCategoryCombo/",
		defaults : {
			TaskCategoryId : "",
			TaskCategoryName : ""
		},
		initialize : function(){
		}
	});
	app.taskcategorylist = Element.Collection.extend({
		model : app.taskcategory,
		url : app.config.domain + "/Common/Common.svc/rest/TaskCategoryCombo/",
		initialize : function(){
		}
	});
	app.tasktype = Element.Model.extend({
		url : app.config.domain + "/Common/Common.svc/rest/TaskTypeCombo/",
		defaults : {
			TaskTypeId : "",
			TaskTypeName : ""
		},
		initialize : function(){
		}
	});
	app.tasktypelist = Element.Collection.extend({
		model : app.tasktype,
		url : app.config.domain + "/Common/Common.svc/rest/TaskTypeCombo/",
		initialize : function(){
		}
	});
	app.maincategory = Element.Model.extend({
		url : app.config.domain + "/Common/Common.svc/rest/EquipmentCodeMainCombo/",
		defaults : {
			CodeCategory : "",
			CategoryName : ""
		},
		initialize : function(){
		}
	});
	app.maincategorylist = Element.Collection.extend({
		model : app.maincategory,
		url : app.config.domain + "/Common/Common.svc/rest/EquipmentCodeMainCombo/",
		initialize : function(){
		}
	});
	app.thirdlevel = Element.Model.extend({
		url : app.config.domain + "/Common/Common.svc/rest/EquipmentThirdLevelCombo/",
		defaults : {
			Code : "",
			CodeName : ""
		},
		initialize : function(){
		}
	});
	app.thirdlevellist = Element.Collection.extend({
		model : app.thirdlevel,
		url : app.config.domain + "/Common/Common.svc/rest/EquipmentThirdLevelCombo/",
		initialize : function(){
		}
	});
	app.subcategory = Element.Model.extend({
		url : app.config.domain + "/Common/Common.svc/rest/EquipmentCodeSubCombo/",
		defaults : {
			Code : "",
			CodeName : ""
		},
		initialize : function(){
		}
	});
	app.subcategorylist = Element.Collection.extend({
		model : app.subcategory,
		url : app.config.domain + "/Common/Common.svc/rest/EquipmentCodeSubCombo/",
		initialize : function(){
		}
	});

})(jQuery);
