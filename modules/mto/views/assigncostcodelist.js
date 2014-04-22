var app = app || {};
(function($){
	app.assigncostcodelistview = Element.View.extend({		
		nowcwp : "", nowtc : "", nowtt : "", nowprog : "",
		nowcwp_name : "", nowtc_name : "", nowtt_name : "", nowprog_name : "",
		pages : ["PROJECT", "Data", "Cost Code Assignment"],
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/mto/tpl/tpl_assigncostcodelistview.html", function(template){
				$(self.el).html($(template));

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
				    buttons: [
                        { class: "warning", Id: "btnAssignCostCodeToAll", Name: "Assign Cost Code to All" },
						{ class : "primary", Id : "btnAssignCostCode", Name : "Assign Cost Code" }
					]
				}).render().el);

				self.nowcwp = self.options.query.cwp || "";
				self.nowtc = self.options.query.taskcategory || "";
				self.nowtt = self.options.query.tasktype || "";
				self.nowprog = self.options.query.progress || "";

				$(self.el).find("#list").html(new app.component.Tablelist({
					list : "../../modules/mto/tpl/tpl_assigncostcodelist.html",
					listitem : "../../modules/mto/tpl/tpl_assigncostcodelistitem.html",
					coll : "new app.assigncostcodelist()",
					query : self.options.query 
				}).render().el);
				
				$(self.el).find("#btnAssignCostCode").on("click", function () {
				    if (!Element.Tools.ValidateCheck($(self.el).find("#list"), "Please select at least one item to assign"))
				        return;
				    var models = [];
				    $(self.el).find("input[name=key]:checked").each(function () {
				        models.push(new app.assigncostcode({
				            ComponentProgressId: $(this).val()
				        }));
				    });
				    app.component.Modal.show(new app.assigncostcodecreate({ models: models, query : {} }), 800);
				});

				$(self.el).find("#btnAssignCostCodeToAll").on("click", function () {
				    app.component.Modal.show(new app.assigncostcodecreate({
				        selcwp: $(self.el).find(".divCWP option:selected").val(),
				        seltaskcategory: $(self.el).find(".divTaskCategory option:selected").val(),
				        seltasktype: $(self.el).find(".divTaskType option:selected").val(),
				        selprog: $(self.el).find(".divProgress option:selected").val(),
						query : {}
				        }), 800);
				});

				self.renderscreen();

			});
            return this;
		},
		renderlist : function(){
			var self = this;
			var v_cwp=$(self.el).find(".divCWP option:selected").val();
			var v_taskcategory=$(self.el).find(".divTaskCategory option:selected").val();
			var v_tasktype=$(self.el).find(".divTaskType option:selected").val();
			var v_prog=$(self.el).find(".divProgress option:selected").val();

			self.options.query.cwp = v_cwp || "";
			self.options.query.taskcategory = v_taskcategory || "";
			self.options.query.tasktype = v_tasktype || "";
			self.options.query.progress = v_prog || "";

			var q = Element.Tools.QueryGen(self.options.query, "page", 1);
			window.location = "#assigncostcodelist"+q;	
		},
		selcwp : function(){
			var self = this;	
			$(self.el).find(".divCWP option").remove();
			$(self.el).find(".divCWP").append("<option value=''>All</option>");
			app.component.Call(
				"/Common/Common.svc/rest/CwpCombo", "GET", "",
				function(d){
					_.each(JSON.parse(d.JsonDataSet), function(item){
						var sl = (self.options.query.cwp == item.Code) ? " selected " : "";
						$(self.el).find(".divCWP").append("<option value='"+item.Code+"' "+sl+">"+item.CodeName+"</option>");
					});
				}, null
			);
			$(self.el).find(".divCWP").unbind("change");
			$(self.el).find(".divCWP").on("change", function(){
				self.nowcwp = $(self.el).find(".divCWP option:selected").val();
				self.nowtc = ""; self.nowtt = ""; self.prog = "";
				self.renderlist();
			});
		},
		seltc : function(){
			var self = this;	
			$(self.el).find(".divTaskCategory option").remove();
			$(self.el).find(".divTaskCategory").append("<option value=''>All</option>");
			if(self.nowcwp == "")
				return;
			app.component.Call(
				"/Common/Common.svc/rest/TaskCategoryByCwpId/" + self.nowcwp, "GET", "",
				function(d){
					_.each(JSON.parse(d.JsonDataSet), function(item){
						var sl = (self.options.query.taskcategory == item.Code) ? " selected " : "";
						$(self.el).find(".divTaskCategory").append("<option value='"+item.Code+"' "+sl+">"+item.CodeName+"</option>");
					});
				}, null
			);
			$(self.el).find(".divTaskCategory").unbind("change");
			$(self.el).find(".divTaskCategory").on("change", function(){
				self.nowtc = $(".divTaskCategory option:selected").val();
				self.nowtt = "";
				self.renderlist();
			});
		},
		seltt : function(){
			var self = this;	
			$(self.el).find(".divTaskType option").remove();
			$(self.el).find(".divTaskType").append("<option value=''>All</option>");
			if(self.nowtc == "")
				return;
			app.component.Call(
				"/Common/Common.svc/rest/TaskTypeCombo/" + self.nowtc, "GET", "",
				function(d){
					_.each(JSON.parse(d.JsonDataSet), function(item){
						var sl = (self.options.query.tasktype == item.Code) ? " selected " : "";
						$(self.el).find(".divTaskType").append("<option value='"+item.TaskTypeId+"' "+sl+">"+item.TaskTypeName+"</option>");
					});
				}, null
			);
			$(self.el).find(".divTaskType").unbind("change");
			$(self.el).find(".divTaskType").on("change", function(){
			    self.nowtt = $(".divTaskType option:selected").val();
				self.renderlist();
			});
		},
		selprog : function(){
			var self = this;	
			$(self.el).find(".divProgress option").remove();
			$(self.el).find(".divProgress").append("<option value=''>All</option>");
			if(self.nowcwp == "")
			    return;

			var v_cwp = $(self.el).find(".divCWP option:selected").val();
			var v_taskcategory = $(self.el).find(".divTaskCategory option:selected").val();
			var v_tasktype = $(self.el).find(".divTaskType option:selected").val();

			var param = "";
			L(self.nowcwp);
			param += "&cwpid=" + self.nowcwp || "";
			if(self.nowtc)
				param += "&taskcategoryid=" + self.nowtc || "";
			if(self.nowtt)
				param += "&tasktypeid=" + self.nowtt || "";

			app.component.Call(
				"/Common/Common.svc/rest/ProgressStepCombo?" + param, "GET", "",
				function(d){
					_.each(JSON.parse(d.JsonDataSet), function(item){
						var sl = (self.options.query.progress == item.Code) ? " selected " : "";
						$(self.el).find(".divProgress").append("<option value='"+item.Code+"' "+sl+">"+item.CodeName+"</option>");
					});
				}, null
			);
			$(self.el).find(".divProgress").unbind("change");
			$(self.el).find(".divProgress").on("change", function(){
				self.nowtt = $(".divProgress option:selected").val();
				self.renderlist();
			});
		},
		renderscreen : function(){	
			var self = this;	
			self.selcwp();
			self.seltc();
			self.seltt();
			self.selprog();
		}
	});
})(jQuery);
