/*
Create by kpark
Description : costcode map to Client Code list
*/
var app = app || {};
(function($){
	app.costcodemaplistview = Element.View.extend({		
		clientcostcode : null,
		projectcostcode : null,
		pages : ["PROJECT", "Settings", "Map Client Cost Codes"],
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/project/tpl/tpl_costcodemaplistview.html", function(template){
				$(self.el).html($(template));
				
				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class: "primary", Id : "btnMap", Name : "Map Cost Code" },
						{ Id : "btnImportList", Name : "Import File" },
						{ Id : "btnImportHistory", Name : "Import History" }
					]
				}).render().el);

				$(self.el).find("#controls").html(new app.component.SearchControl({
					options : [
						{ Value : "ClientCostCode", Name : "Client Cost Code" },
						{ Value : "ClientCostCodeName", Name : "Client Description" }
					],
					query : self.options.query      
				}).render().el);
				
				self.renderlist();
				$(self.el).find("#btnMap").on("click", function(e){
					e.preventDefault();
					app.router.navigate("costcodemap", { trigger : true });
				});

				$(self.el).find("#btnImportHistory").on("click", function(e){
					e.preventDefault();
					window.location = "#clientcostcodeimporthistory";
				});

				$(self.el).find("#btnImportList").on("click", function(e){
					e.preventDefault();
					app.component.Modal.show(new app.importlist(
						{
							kind: "ClientCostCode",
							downloadpath: app.config.docPath.template + app.config.downloads.clientcostcodetemplate
							, s: function (data) {  }
						}
					), 600);
				});
			});
            return this;
		},
		prepare : function(obj, b){
			if(b){
				obj.append("<tr class='loading' style='height:200px;'><td colspan='2'>Loading...</td></tr>");
			}else{
				obj.find(".loading").remove();
			}
		},
		resetevent : function(){
			var self = this;
			$(self.el).find("#projectcostcode tbody tr").draggable({
				helper : "clone",
				appendTo: "body"
			});
			$(self.el).find("#projectcostcode tbody tr").css("cursor", "pointer");
		},
		renderlist : function(){
			var self = this;
			var ccode = $(self.el).find("#clientcostcode tbody:last");
			var pcode = $(self.el).find("#projectcostcode tbody:last");
			$(self.el).find("#clientcostcode tbody tr").remove();
			$(self.el).find("#projectcostcode tbody tr").remove();
			self.prepare(ccode, true);
			self.prepare(pcode, true);

			//client cost list 
			app.component.Call(
				"/ProjectSettings/SigmaProjectSettings.svc/rest/CostCodeMaps",
				"GET", "",
				function(data){
					self.clientcostcode = JSON.parse(data.JsonDataSet);
					self.prepare(ccode, false);
					_.each(self.clientcostcode, function(item){
						self.renderpitem(item);
					});
					$(self.el).find(".mom").droppable({
					  	activeClass: "",
					  	hoverClass: "active",
						drop: function( event, ui ) {
							var newline = $("<tr>" + ui.draggable.html()+"</tr>");
							newline.find("button").on("click", function(e){
								e.preventDefault();
								newline.find("button").parent().remove();
								$(self.el).find("#projectcostcode tbody:last").append(newline);
								self.resetevent();
							});
							$(this).find("table").append(newline);
							$(ui.draggable).remove();
						}
					});
				},
				function(data){
					ccode.append("<tr><td colspan='2'>"+data+"</td></tr>");
				}
			);
			//project cost list 
			app.component.Call(
				"/ProjectSettings/SigmaProjectSettings.svc/rest/ProjectCostCodeForMap",
				"GET", "",
				function(data){
					self.projectcostcode = JSON.parse(data.JsonDataSet);
					self.prepare(pcode, false);
					_.each(self.projectcostcode, function(item){
						pcode.append(self.rendercitem(item));
					});
					self.resetevent();
				},
				function(data){
					pcode.append("<tr><td colspan='2'>"+data+"</td></tr>");
				}
			);
		},
		save : function(){
			var self = this;
		},
		renderpitem : function(item){
			var self = this;
			var ccode = $(self.el).find("#clientcostcode .ccmap");
			var tr = "";
			if(item.CostCodeMapId == null){
				tr = "<tr class='cid_"+item.ClientCostCodeId+"'>";
				tr += "<td style='width:250px;'><input class='cc' type='hidden' value="+item.ClientCostCodeId+">"+item.ClientCostCode+"</td>";
				tr += "<td class='mom'>"+item.ClientCostCodeName+"<table class='table' style='margin-bottom:0px;margin-top:0px;' /></td>";
				tr += "</tr>";
				ccode.append(tr);
			}else{
				var momtr = ccode.find(".cid_"+item.ClientCostCodeId);
				if(momtr.length == 0){
					trmom = "<tr class='cid_"+item.ClientCostCodeId+"'>";
					trmom += "<td style='width:250px;'><input class='cc' type='hidden' value="+item.ClientCostCodeId+">"+item.ClientCostCode+"</td>";
					trmom += "<td class='mom'>"+item.ClientCostCodeName+"<table class='table table-bordered' style='margin-bottom:0px;margin-top:20px;' ><tr><th>Project Cost Code</th><th>Description</th></tr></table></td>";
					trmom += "</tr>";
					momtr = $(trmom);
				}

				tr = "<tr>";
				tr += "<td style='width:250px;'><input type='hidden' value="+item.ProjectCostCodeId+">"+item.ProjectCostCode+"</td>";
				tr += "<td>"+item.ProjectCostCodeName+"</td>";
				tr += "</tr>";
				var newline = $(tr);
				momtr.find(".mom > table").append(newline);
				newline.find("button").on("click", function(e){
					e.preventDefault();
					newline.find("button").parent().remove();
					$(self.el).find("#projectcostcode tbody:last").append(newline);
					self.resetevent();
				});
				ccode.append(momtr);
			}
		},
		rendercitem : function(item){
			var tr = "<tr>";
			tr += "<td><input type='hidden' value="+item.ProjectCostCodeId+">"+item.CostCode+"</td>";
			tr += "<td>"+item.Description+"</td>";
			tr += "</tr>";
			return tr;
		}
	});

	app.costcodemap = Element.View.extend({		
		clientcostcode : null,
		projectcostcode : null,
		pages : ["PROJECT", "Settings", "Map Client Cost Codes", "Map Cost Code"],
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/project/tpl/tpl_costcodemap.html", function(template){
				$(self.el).html($(template));
				
				self.renderlist();
				$(self.el).find(".btnSave").on("click", function(e){
					e.preventDefault();
					var models = [];
					var ccode = $(self.el).find("#clientcostcode > tbody > tr");
					_.each(ccode, function(item){
						if($(item).find("table tr").length > 0){
							var cc = $(item).find(".cc").val();
							_.each($(item).find("table tr"), function(p){
								var pc = $(p).find("input[type=hidden]").val();
								models.push({
									SigmaOperation : "C", // CRUD
									CostCodeMapId : "",
									ClientCostCodeId : cc,
									ProjectCostCodeId : pc,
									ClientCostCode : "",
									ClientCostCodeName : "",
									ProjectCostCode : "",
									ProjectCostCodeName : ""
								});
							});
						}
					});
					app.component.Call(
						"/ProjectSettings/SigmaProjectSettings.svc/rest/CostCodeMaps/Multi",
						"PUT",
						JSON.stringify({listObj : models}),
						function(d){
							if(d.IsSuccessful){
							    window.history.back();
							}
						},
						function(d){
							L(d);
						}
					);
				});
				$(self.el).find(".btnCancel").on("click", function(e){
					e.preventDefault();
					window.history.back();
				});
			});
            return this;
		},
		prepare : function(obj, b){
			if(b){
				obj.append("<tr class='loading' style='height:200px;'><td colspan='2'>Loading...</td></tr>");
			}else{
				obj.find(".loading").remove();
			}
		},
		resetevent : function(){
			var self = this;
			$(self.el).find("#projectcostcode tbody tr").draggable({
				helper : "clone",
				appendTo: "body"
			});
			$(self.el).find("#projectcostcode tbody tr").css("cursor", "pointer");
		},
		renderlist : function(){
			var self = this;
			var ccode = $(self.el).find("#clientcostcode tbody:last");
			var pcode = $(self.el).find("#projectcostcode tbody:last");
			$(self.el).find("#clientcostcode tbody tr").remove();
			$(self.el).find("#projectcostcode tbody tr").remove();
			self.prepare(ccode, true);
			self.prepare(pcode, true);

			//client cost list 
			app.component.Call(
				"/ProjectSettings/SigmaProjectSettings.svc/rest/CostCodeMaps",
				"GET", "",
				function(data){
					self.clientcostcode = JSON.parse(data.JsonDataSet);
					self.prepare(ccode, false);
					_.each(self.clientcostcode, function(item){
						self.renderpitem(item);
					});
					$(self.el).find(".mom").droppable({
					  	activeClass: "",
					  	hoverClass: "active",
						drop: function( event, ui ) {
							var newline = $("<tr>" + ui.draggable.html() + "<td align='right'><button class='unmap btn btn-warning btn-xs' style='padding:0 10px 0 10px;'> -  </button></td></tr>");
							newline.find("button").on("click", function(e){
								e.preventDefault();
								newline.find("button").parent().remove();
								$(self.el).find("#projectcostcode tbody:last").append(newline);
								self.resetevent();
							});
							$(this).find("table").append(newline);
							$(ui.draggable).remove();
						}
					});
				},
				function(data){
					ccode.append("<tr><td colspan='2'>"+data+"</td></tr>");
				}
			);
			//project cost list 
			app.component.Call(
				"/ProjectSettings/SigmaProjectSettings.svc/rest/ProjectCostCodeForMap",
				"GET", "",
				function(data){
					self.projectcostcode = JSON.parse(data.JsonDataSet);
					self.prepare(pcode, false);
					_.each(self.projectcostcode, function(item){
						pcode.append(self.rendercitem(item));
					});
					self.resetevent();
				},
				function(data){
					pcode.append("<tr><td colspan='2'>"+data+"</td></tr>");
				}
			);
		},
		save : function(){
			var self = this;
		},
		renderpitem : function(item){
			var self = this;
			var ccode = $(self.el).find("#clientcostcode .ccmap");
			var tr = "";
			if(item.CostCodeMapId == null){
				tr = "<tr class='cid_"+item.ClientCostCodeId+"'>";
				tr += "<td><input class='cc' type='hidden' value="+item.ClientCostCodeId+">"+item.ClientCostCode+"</td>";
				tr += "<td class='mom'>"+item.ClientCostCodeName+"<table class='table' style='margin-bottom:0px;margin-top:20px;' /></td>";
				tr += "</tr>";
				ccode.append(tr);
			}else{
				var momtr = ccode.find(".cid_"+item.ClientCostCodeId);
				if(momtr.length == 0){
					trmom = "<tr class='cid_"+item.ClientCostCodeId+"'>";
					trmom += "<td><input class='cc' type='hidden' value="+item.ClientCostCodeId+">"+item.ClientCostCode+"</td>";
					trmom += "<td class='mom'>"+item.ClientCostCodeName+"<table class='table' style='margin-bottom:0px;margin-top:20px;' /></td>";
					trmom += "</tr>";
					momtr = $(trmom);
				}

				tr = "<tr>";
				tr += "<td><input type='hidden' value="+item.ProjectCostCodeId+">"+item.ProjectCostCode+"</td>";
				tr += "<td>"+item.ProjectCostCodeName+"</td>";
				tr += "<td align='right'><button class='unmap btn btn-warning btn-xs' style='padding:0 10px 0 10px;'> -  </button></td>";
				tr += "</tr>";
				var newline = $(tr);
				momtr.find(".mom > table").append(newline);
				newline.find("button").on("click", function(e){
					e.preventDefault();
					newline.find("button").parent().remove();
					$(self.el).find("#projectcostcode tbody:last").append(newline);
					self.resetevent();
				});
				ccode.append(momtr);
			}
		},
		rendercitem : function(item){
			var tr = "<tr>";
			tr += "<td><input type='hidden' value="+item.ProjectCostCodeId+">"+item.CostCode+"</td>";
			tr += "<td>"+item.Description+"</td>";
			tr += "</tr>";
			return tr;
		}
	});
})(jQuery);
