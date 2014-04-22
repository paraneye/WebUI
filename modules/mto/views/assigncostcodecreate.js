
var app = app || {};
(function($){
	app.assigncostcodecreate = Element.View.extend({	
		render : function(){
			var self = this;			
			app.TemplateManager.get("../../modules/mto/tpl/tpl_assigncostcodecreate.html", function (template) {
				$(self.el).html(_.template(template));
				self.searchlist();
				self.renderscreen();
				$(self.el).find("#btnSearch").on("click", function (e) {
					e.preventDefault();
					self.searchlist();
				});

				$(self.el).find('#txtCostCode').keydown(function (e){
					if(e.keyCode == 13){
						self.searchlist();
					}
				});
			});
            return this;
		},
		searchlist : function(){
		    var self = this;

		    self.options.query.o_val = "asc";
		    self.options.query.o_opt = "CostCode";

			self.options.query.CostCode = $(self.el).find("#txtCostCode").val() || "";
			$(self.el).find("#sublist").html(new app.component.Tablelist({
				list : "../../modules/mto/tpl/tpl_assigncostcodecreate_sublistheader.html",
				listitem : "../../modules/mto/tpl/tpl_assigncostcodecreate_sublistitem.html",
				coll: "new app.costcodelist()",
				query : self.options.query,
				all : "Y",
				base: "#sublist",
				callback: function (d) {
				    $(self.el).find("#sublist table tr").css("cursor", "pointer");
				    $(self.el).find("#sublist table tr").on("click", function (tr) {
				        $(self.el).find("#noselerror").text("");
				        $(self.el).find("#sublist .active td:first-child").html("");
				        $(self.el).find("#sublist .active").removeClass("active");
				        L($(this).find("td[costcodeid]").attr("costcodeid"));
				        $(this).addClass("active");
				        $(self.el).find("#sublist .active td:first-child").html("<span class='glyphicon glyphicon-ok'></span>");
				    });
					$(self.el).find("#txtCostCode").focus();
				}
			}).render().el);
		},
		renderscreen : function(){
			var self = this;

			$(self.el).find("#btnSave").on("click", function (e) {
			    e.preventDefault();
			    var models = [];
			    if ($(self.el).find("#sublist .active").length > 0) {
			        if (self.options.models == undefined) {
			            models.push({
			                SigmaOperation: "",
			                ComponentProgressId: 0,
			                CostCodeId: Number($($(self.el).find("#sublist .active")[0]).find("td[costcodeid]").attr("costcodeid"))
			            });
			            var v_cwp = self.options.selcwp;
			            var v_taskcategory = self.options.seltaskcategory;
			            var v_tasktype = self.options.seltasktype;
			            var v_prog = self.options.selprog;

			            var param = "";

			            if (v_cwp != undefined)
			                param += "&cwp=" + v_cwp;
			            if (v_taskcategory != undefined)
			                param += "&taskcategory=" + v_taskcategory;
			            if (v_tasktype != undefined)
			                param += "&tasktype=" + v_tasktype;
			            if (v_prog != undefined)
			                param += "&progress=" + v_prog;

			            Element.Tools.Multi(
						   "/ProjectData/SigmaProjectData.svc/rest/AssignmentComponentProgressAll?" + param,
						   models,
						   $(self.el), {
							   s: function (m, r) {
								   ThisViewPage.render();
								   app.component.Modal.close();
							   },
							   e: function (m, e) {
								   ThisViewPage.render();
							   }
						   });
			        } else {
			            _.each(self.options.models,
                          function (item) {
                              models.push(
								  {
									SigmaOperation: "",
									ComponentProgressId: Number(item.attributes.ComponentProgressId),
									CostCodeId: Number($($(self.el).find("#sublist .active")[0]).find("td[costcodeid]").attr("costcodeid"))
								  }
							  )
                          });

			            Element.Tools.Multi(
                                    "/ProjectData/SigmaProjectData.svc/rest/AssignmentComponentProgress",
                                    models,
                                    $(self.el), {
                                        s: function (m, r) {
                                            ThisViewPage.render();
                                            app.component.Modal.close();
                                        },
                                        e: function (m, e) {
                                            ThisViewPage.render();
                                        }
                                    });
			        }

			    } else {
			        $(self.el).find("#noselerror").text("Please select a CostCode");
			    }
			});
			$(self.el).find("#btnCancel").on("click", function (e) {
			    e.preventDefault();
			    app.component.Modal.close();
			});
		}
	});
})(jQuery);
