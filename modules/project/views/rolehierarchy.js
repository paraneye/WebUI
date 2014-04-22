var app = app || {};
(function($){
	app.rolehierarchytree = Element.View.extend({		
		list : {},
		setcount : 0,
		disc : [],
		selected : null,
		pages : ["PROJECT", "Settings", "Members", "Role Hierarchy"],
		render : function(){
			var self = this;
			self.disc = [];
			self.category = [];
			self.selected = null;
			app.TemplateManager.get("../../modules/project/tpl/tpl_rolehierarchy.html", function(template){
				$(self.el).html($(template));
				
				app.component.Call(
					"/ProjectSettings/SigmaProjectSettings.svc/rest/RoleHierarchy", "GET", "",
					function(d){
						self.list = JSON.parse(d.JsonDataSet);

						self.showitem();

						$(self.el).find("#treeviewmain li").draggable({
							helper : "clone",
							appendTo: "body"
						});
						$(self.el).find("#treeviewmain li").css("cursor", "pointer");

						$(self.el).find("#treeviewmain li").droppable({
							activeClass: "",
							hoverClass: "active",
							drop: function( event, ui ) {
								$(this).find("ul:first").append(ui.draggable);
								//$(this).find("table").append(newline);
								//$(ui.draggable).remove();
							}
						});

						$(self.el).find("#loading").hide();
						$(self.el).find("#viewer").show();

						$(self.el).find("#treeviewmain").treeview();
						$(self.el).find("#treeviewmain li > div").on("click", function(e){
						});
					}, null
				);

				$(self.el).find("#btnApply").on("click", function(e){
				});
				$(self.el).find("#btnAppCancel").on("click", function(e){
					app.router.navigate("members", { trigger : true });
				});
			});
            return this;
		},
		showitem : function(){
			var self = this;
			_.each(self.list, function(item){
				if(item.set == undefined){
					var li = $("<li parentrole='"+item.SigmaRoleId+"_"+item.SigmaUserId+"'>");
					li.append("<div style='margin-top:-3px;margin-left:3px;cursor:pointer;'>"+item.RoleName+" <span class='label label-primary'>"+item.UserName+"</span></div><ul />");
					if(item.ReportToRole > 0 && item.ReportTo != ""){
						var p = $(self.el).find("li[parentrole='"+item.ReportToRole+"_"+item.ReportTo+"'] > ul");
						if(p.length > 0){
							item.set = true;
							self.setcount++;
							p.append(li);
						}
					}else{
						$(self.el).find("#treeviewmain").append(li);
						item.set = true;
						self.setcount++;
					}
				}
			});
			if(self.setcount < self.list.length){
				self.showitem();
			}
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
			$(self.el).find(".control_sub li").remove();
			$(self.el).find(".control_sub tr").remove();
			$(self.el).find(".controlbox button").removeClass("disabled");
			$(self.el).find(".panel-heading").html($(self.selected).find(".cname").html());
			switch(kind){
				case "disc":
					$(self.el).find("#btnRename").addClass("disabled");
					$(self.el).find("#btnDelete").addClass("disabled");
					$(self.el).find("#btnAssign").addClass("disabled");
					break;
				case "task":
					$(self.el).find("#btnAdd").addClass("disabled");
					$(self.el).find("#btnAssign").addClass("disabled");
					break;
			}
		}
	});
})(jQuery);
