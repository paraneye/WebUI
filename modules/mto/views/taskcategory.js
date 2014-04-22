var app = app || {};
(function($){
	app.taskcategorytree = Element.View.extend({		
		pages : ["Global Settings", "Common Codes", "Task Categories and Types"],	
		isEdit : false,
		disc : [],
		category : [],
		selected : null,
		render : function(){
			var self = this;
			self.disc = [];
			self.category = [];
			self.selected = null;
			app.TemplateManager.get("../../modules/mto/tpl/tpl_taskcategory.html", function(template){
				$(self.el).html($(template));
				
				app.component.Call(
					"/GlobalSettings/SigmaGlobalSettings.svc/rest/TaskCategoryWithTaskType", "GET", "",
					function(d){
						var list = JSON.parse(d.JsonDataSet);
						//Disc
						_.each(list, function(item){
							var base = $(self.el).find("#treeviewmain");
							if(!_.contains(self.disc, item.DisciplineCode)){
								if(item.DisciplineCode != null && item.DisciplineCode != ""){
										var li = $("<li class='disc d_"+item.DisciplineCode+ "'>");
										li.append("<div class='cname' style='margin-top:-3px;margin-left:3px;cursor:pointer;'><input type='hidden' value='"+item.DisciplineCode+"'><span class='label label-default '>&nbsp;"+item.CodeName+"&nbsp;</span></div><ul />");
										base.append(li);
										self.disc.push(item.DisciplineCode);
								}
							}
						});

						//Category
						_.each(list, function(item){
							if(item.TaskCategoryId != null && item.TaskCategoryId != ""){
									if(!_.contains(self.category, item.TaskCategoryId)){
									    var li = $("<li class='cate c_" + item.TaskCategoryId + "'>");
									    li.append("<div class='cname' style='margin-top:-3px;margin-left:3px;cursor:pointer;'><input type='hidden' value='" + item.DisciplineCode + "|" + item.TaskCategoryId + "|" + item.TaskTypeId + "'><span class='label label-success'>&nbsp;" + item.TaskCategoryName + "&nbsp;</span></div><ul />");
										$(self.el).find(".d_"+item.DisciplineCode+" > ul").append(li);
										self.category.push(item.TaskCategoryId);
									}
							}
						});
					
						//Type
						_.each(list, function(item){
							if(item.TaskTypeId != null && item.TaskTypeId != ""){									
							var li = $("<li class='task'>");
							var parents = $(self.el).find(".c_"+item.TaskCategoryId+" > div > input").val();
							li.append("<div style='margin-top:-3px;margin-left:3px;cursor:pointer;' class='"+item.TaskTypeId+" cname'><input type='hidden' value='"+parents+"|"+item.TaskTypeId+"'><span class='label label-danger'>&nbsp;"+item.TaskTypeName+"&nbsp;</span></div>");
							$(self.el).find(".c_"+item.TaskCategoryId+" > ul").append(li);

							}
						});

						$(self.el).find("#loading").hide();
						$(self.el).find("#viewer").show();

						$(self.el).find("#treeviewmain").treeview();
						$(self.el).find("#treeviewmain li > div").on("click", function(e){
							$(self.el).find("#treeviewmain li > div").css("font-weight", "normal");
							$(this).css("font-weight", "bold");
							e.preventDefault();
							self.selected = $(this).parent();
							if($(this).parent().hasClass("disc")){
								self.showbox("disc");
								return;
							}
							if ($(this).parent().hasClass("cate")) {
							    L($(this).parent().hasClass("cate"));
								self.showbox("cate");
								return;
							}
							if($(this).parent().hasClass("task")){
								self.showbox("task");
								return;
							}

							self.showbox("");
							self.selected = null;
						});
					}, null
				);

				$(self.el).find("#btnAdd").on("click", function(e){
					$(self.el).find(".control_sub > div").hide();
					$(self.el).find(".control_sub input").val("");
					$(self.el).find(".ctl_addnew h4").text("Add New");
					self.isEdit = false;
					$(self.el).find(".ctl_addnew").show();
				});
				$(self.el).find("#btnRename").on("click", function(e){
					$(self.el).find(".control_sub > div").hide();
					$(self.el).find(".control_sub input").val("");
					$(self.el).find(".ctl_addnew").show();
					$(self.el).find(".ctl_addnew h4").text("Rename");
					self.isEdit = true;
					$(self.el).find("#newname").val($(self.el).find(".panel-heading").text());
				});
				$(self.el).find("#btnDelete").on("click", function(e){
					$(self.el).find(".control_sub > div").hide();
				});
				$(self.el).find("#btnAssign").on("click", function(e){
					$(self.el).find(".control_sub > div").hide();
					$(self.el).find(".control_sub input").val("");
					self.getprogress();
					$(self.el).find(".ctl_assign").show();
				});
				$(self.el).find("#btnDelete").on("click", function(e){
					e.preventDefault();
					self.del();
				});
				$(self.el).find("#btnSave").on("click", function(e){
					e.preventDefault();
					if($(self.selected).hasClass("disc")){
						self.addCategory();
					}
					if($(self.selected).hasClass("cate")){
						if(self.isEdit){
							self.renameCategory();
						}else{
							self.addType();
						}
					}
					if($(self.selected).hasClass("task")){
						self.renameType();
					}
				});
				$(self.el).find("#btnAppCancel").on("click", function(e){
					e.preventDefault();
					$(self.el).find(".ctl_assign").hide();
				});
				$(self.el).find("#btnApply").on("click", function(e){
					
					var t = self.selected.find("input").val().split("|");
					var v_operation = "C";
					var v_webmethod = "POST";
					var v_mapid = "";
					var v_tc = null;
					var v_tt = 0;
					if(t[1] != undefined && t[1] != ""){
						v_tc = Number(t[1]);
					}
					if(t[2] != undefined && t[2] != ""){
						v_tt = Number(t[2]);
					}
					app.component.Call(
						app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/ProgressTypeMapByDisciplineCode/"+t[1]+"/"+t[0],
						"GET", "",
						function(data){									
							var datatype = JSON.parse(data.JsonDataSet);
							if(datatype.length > 0){
								v_operation = "U";
								v_webmethod = "PUT";
								v_mapid = datatype[0].ProgressTypeMapId;
							}
							var v_progresstype = $(self.el).find("input[name=rdopro]:checked").val();				
							app.component.Call("/GlobalSettings/SigmaGlobalSettings.svc/rest/ProgressTypeMaps", v_webmethod, 
								JSON.stringify({ paramObj : {
									SigmaOperation: v_operation,
									ProgressTypeMapId: (v_mapid == "") ? 0 : Number(v_mapid),
									DisciplineCode : t[0],
									TaskCategoryId : v_tc,
									TaskTypeId: v_tt,
									ProgressTypeId: Number(v_progresstype),
									CreatedBy : "",
									UpdatedBy : ""
								
								}}),
								function(d){
									if(d.IsSuccessful){
										L("save ok");
										self.render();
									}
								},null
							);
						}
					);
				});
			});
            return this;
		},
		taskcategorylist:"",
		getprogress : function(){
			var self = this;
			var t = self.selected.find("input").val().split("|");

			if(t[1] != undefined && t[1] != ""){
				app.component.Call(
					app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/ProgressTypeByTaskCateogry/"+t[1]+"/0",  
					"GET",                                      
					"",                                         
					function(data){ 
						$(self.el).find("#progresslist tbody").find("tr").remove();

						self.taskcategorylist = JSON.parse(data.JsonDataSet);
						var i =0;						
						var tb = $(self.el).find("#progresslist");						
						if(self.taskcategorylist.length ==0){
							var newline ="<tr><td colspan='3' style='text-align:center;'>No Record</td></tr>";
							tb.find("tbody:last").append(newline);
						}
						_.each(self.taskcategorylist, function(item){
							var newline = $(self.newcustom(item));	
							tb.find("tbody:last").append(newline);
				
					
						});

						app.component.Call(
							app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/ProgressTypeMapByDisciplineCode/"+t[1]+"/"+t[0],
							"GET",
							"",
							function(data){
									
								_.each(JSON.parse(data.JsonDataSet), function(item){								
									$(self.el).find("input[value="+item.ProgressTypeId+"]").attr("checked","checked");
							
								});

							}

						);
					}, 
					null                                        
				);
			}

		},
		newcustom : function(item){
			var tr = "";
			if(item != null && item != undefined){
					tr += "<tr>";
					tr += "<td><input type='radio' name='rdopro' value='"+ item.ProgressTypeId +"' /></td>";
					tr += "<td>"+ item.Name +"</td>";
					tr += "<td>"+ item.Description + "</td>";
					tr += "</tr>";
			}
			
			return tr;
		},
		renameType : function(){
			var self = this;
			var t = self.selected.find("input").val().split("|");
			app.component.Call(
				"/GlobalSettings/SigmaGlobalSettings.svc/rest/TaskTypes", "PUT", 
				JSON.stringify({ paramObj : {
					SigmaOperation: "U",
					TaskTypeId: t[2],
					TaskCategoryId : t[1],
					TaskTypeShortName : $(self.el).find("#newname").val(),
					TaskTypeName : $(self.el).find("#newname").val(),
					DisciplineCode : t[0]
				}}),
				function(d){
					if(d.IsSuccessful)
						self.render();
				},null
			);
		},
		addType : function(){
			var self = this;
			var t = self.selected.find("input").val().split("|");
			app.component.Call(
				"/GlobalSettings/SigmaGlobalSettings.svc/rest/TaskTypes", "POST", 
				JSON.stringify({ paramObj : {
					SigmaOperation: "C",
					TaskTypeId: 0,
					TaskCategoryId : t[1],
					TaskTypeCode : "",
					TaskTypeShortName : $(self.el).find("#newname").val(),
					TaskTypeName : $(self.el).find("#newname").val(),
					DisciplineCode : t[0]
				}}),
				function(d){
					if(d.IsSuccessful)
						self.render();
				},null
			);
		},
		renameCategory : function(){
			var self = this;
			var t = self.selected.find("input").val().split("|");
			app.component.Call(
				"/GlobalSettings/SigmaGlobalSettings.svc/rest/TaskCategorys", "PUT", 
				JSON.stringify({ paramObj : {
					SigmaOperation: "U",
					TaskCategoryId: t[1],
					DisciplineCode: t[0],
					TaskCategoryName: $(self.el).find("#newname").val()
				}}),
				function(d){
					if(d.IsSuccessful)
						self.render();
				},null
			);
		},
		addCategory : function(){
			var self = this;
			var disc_val = $(self.selected).find("input").val();
			app.component.Call(
				"/GlobalSettings/SigmaGlobalSettings.svc/rest/TaskCategorys", "POST", 
				JSON.stringify({ paramObj : {
					SigmaOperation: "C",
					TaskCategoryId: 0,
					DisciplineCode: disc_val,
					TaskCategoryCode: "",
					TaskCategoryName: $(self.el).find("#newname").val()
				}}),
				function(d){
					if(d.IsSuccessful)
						self.render();
				},null
			);
		},
		del : function(){
			var self = this;
			app.component.Confirm.show(
				{ COMMENT : "Are you sure you want to delete the selected item(s)?", POS : "OK", NAG : "Cancel" },
				function(){
					var m = null; url = "";
					if($(self.selected).hasClass("cate")){
						//Category Del
						var d = $(self.selected).find("input").val().split("|");
						url = "/GlobalSettings/SigmaGlobalSettings.svc/rest/TaskCategorys";
						m = {
							SigmaOperation : "D",
							TaskCategoryId : Number(d[1]),
							DisciplineCode : d[0]
						};
					}else{
						//Type Del
						var d = $(self.selected).find("input").val().split("|");
						url = "/GlobalSettings/SigmaGlobalSettings.svc/rest/TaskTypes";
						m = {
							SigmaOperation : "D",
							TaskTypeId : d[2],
							TaskCategoryId : d[1],
							DisciplineCode : d[0]
						};
					}
					app.component.Call(
						url, "DELETE",
						JSON.stringify( { paramObj : m } ),
						function(d){
							app.component.Confirm.close();
							if(d.IsSuccessful)
								self.render();
						}, null
					);
				},null
			);
		},
		showbox : function(kind){
		    var self = this;

			if(kind == ""){
				$(self.el).find(".controlbox").hide();
				return;
			}
			$(self.el).find(".controlbox").show();
			$(self.el).find(".control_sub > div").hide();
			$(self.el).find(".control_sub input").val("");
			//$(self.el).find(".control_sub li").remove();			
			$(self.el).find(".controlbox button").removeClass("disabled");
			$(self.el).find(".panel-heading").html($(self.selected).find(".cname").html());
			
			switch(kind){
				case "disc":
					$(self.el).find("#btnRename").addClass("disabled");
					$(self.el).find("#btnDelete").addClass("disabled");
					$(self.el).find("#btnAssign").addClass("disabled");
					break;
			    case "cate":
			        var t = self.selected.find("input").val().split("|");
			        if (t[2] > 0)
			            $(self.el).find("#btnDelete").addClass("disabled");
			        break;
				case "task":
					$(self.el).find("#btnAdd").addClass("disabled");
					break;
			}
		}
	});
})(jQuery);
