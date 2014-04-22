/*
Written by hitapia(sbang)
Role : member list
*/
var app = app || {};
(function($){
	app.memberlist = Element.View.extend({		
		pages : ["PROJECT", "Settings", "Members"],
		render : function(){		
			var self = this;
			app.TemplateManager.get("../../modules/project/tpl/tpl_memberlistview.html", function(template){
				$(self.el).html($(template));

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class : "primary", Id : "btnAdd", Name : "Add New" },
						//{ class : "success", Id : "btnRoleHierachy", Name : "Role Hierachy" },
						{ class : "warning", Id : "btnDelete", Name : "Delete" }
					]
				}).render().el);

				$(self.el).find("#controls").html(new app.component.SearchControl({
					options : [
						{ Value : "Name", Name : "Name" },
						{ Value : "RoleName", Name : "Role" },
						{ Value : "DisciplineName", Name : "Discipline" }
					],
					query : self.options.query
				}).render().el);

				$(self.el).find("#list").html(new app.component.Tablelist({
					list : "../../modules/project/tpl/tpl_memberlist.html",
					listitem : "../../modules/project/tpl/tpl_memberlistitem.html",
					coll : "new app.members()",
					query : self.options.query
				}).render().el);

				$(self.el).find("#btnRoleHierachy").on("click", function(e){
					e.preventDefault();
					app.router.navigate("#rolehierarchy", { trigger : true });
                });

				$(self.el).find("#btnAdd").on("click", function(e){
					e.preventDefault();
					app.component.Modal.show(new app.memberadd({ model : new app.member() }), 600);
                });

				$(self.el).find("#btnDelete").on("click",function(e){	
				    e.preventDefault();
				    if (!Element.Tools.ValidateCheck($(self.el).find("#list"))) 
				        return;
					app.component.Confirm.show(
						{ COMMENT : "Are you sure you want to delete the selected item(s)?", POS : "OK", NAG : "Cancel" },
						function(){
						    var models_dis_value = [];
							var models_role_value =[];
							var models =[];
                            $(self.el).find("input[name=key]:checked").each(function() {
								
                                models_dis_value.push(new app.member_dis({ 
                                    SigmaOperation : "D",
                                    SigmaUserId : $(this).val()											
                                }).toJSON());
								
								models_role_value.push(new app.member_role({
										SigmaOperation:"D",
										SigmaUserId: $(this).val()		
								}).toJSON());

							});
							if(models_dis_value.length == 0){
								app.component.Confirm.close();
								return false;
							}
																			

							Element.Tools.Multi(
								"/ProjectSettings/SigmaProjectSettings.svc/rest/Member/Multi",
								{
									typeProjectUserDiscipline : models_dis_value,
									typeSigmaUserSigmaRole : models_role_value
								},
								$(self.el), {
								s : function(m, r){
									var q = Element.Tools.QueryGen(self.options.query, "page", 1);
									window.location = "#members"+q;
									app.component.Confirm.close();
								},
								e : function(m, e){
									app.component.Confirm.close();
								}
							});



						},
						function(){ }
					);
				});



			});
            return this;
		},
		link : function(key){
			app.component.Modal.show(new app.memberadd({ model : new app.member( { typeProjectUserDiscipline : [ {SigmaUserId : arguments[0], UserName : arguments[1] } ]} ) }), 600);

		}

	});
	app.memberadd = Element.View.extend({
		customs : "",
		userroles : "",
		render : function(){
			this.getcomponentcustom();
			var self = this;
			app.TemplateManager.get("../../modules/project/tpl/tpl_addmember.html", function(template){
				$(self.el).html($(template));
				self.renderscreen();
				if(self.model.get("typeProjectUserDiscipline")[0].SigmaUserId != ""){
					$(self.el).find("h2").html("Edit Member");
					self.roleRender();
				}else{
					$(self.el).html(_.template(template, self.model.toJSON()));
				}
				self.setevent();
			});
            return this;
		},
		renderscreen : function(){
			var self = this;
			if(self.model.get("typeProjectUserDiscipline")[0].SigmaUserId != ""){
				$(self.el).find(".divName").html(self.model.get("typeProjectUserDiscipline")[0].UserName).addClass("control-label").attr("style","text-align: left");
			}else{
				this.comboUser();
			}
			this.comboDic();
		},
		
		newcustom : function(list,selvalue){
			var tr = "<li class='list-group-item nopad'><div class='input-group'>";
			tr += "<select class='form-control input-sm' name='selrole'>";
			tr += "<option value=''>Select Role</option>";
			var selected ="";
			_.each(list, function(item){
				selected ="";
				if(selvalue == item.Code){
					selected=" selected ";
				}
				tr += "<option value='"+item.Code+"' "+selected+">"+item.CodeName+"</option>";
			});
			tr += "</select><span class='input-group-btn'>";
			tr += "<button class='btn btn-warning btn-sm'><span classs='glyphicon glyphicon-remove'>Remove</button>";
			tr += "</span></li>";
			return tr;
		},
		getcomponentcustom : function(){
			var self = this;
			$.ajax({
				type : "GET",
				url : app.config.domain + "/Common/Common.svc/rest/SigmaRoleCombo",
				success : function(r){
					self.customs = JSON.parse(r.JsonDataSet);
				}
			});
		},
		comboUser : function(){
			var self = this;	
			var cboUser = $("<select>").addClass("form-control");
			cboUser.append("<option value='' >Select User</option>");
			app.component.Call("/Common/Common.svc/rest/SigmaUserCombo", "GET", "",
			function(d){
				_.each(JSON.parse(d.JsonDataSet), function(item){
					cboUser.
						append("<option value='"+item.Code+"' >"+item.CodeName+"</option>");
				});
				$(self.el).find(".divName").html(cboUser);
			}, null);
		},
		comboDic : function(){
			var self = this;	
			app.component.Call("/Common/Common.svc/rest/DisciplinesComboByProjectId/"+app.loggeduser.CurrentProjectId, "GET", "",
			function(d){
				_.each(JSON.parse(d.JsonDataSet), function(item){
					$(self.el).find("#divDiscipline").
						append("<label class='checkbox-inline'><input type='checkbox' value='"+item.Code+"' >"+item.CodeName+"</label>");
				});
				if(self.model.get("typeProjectUserDiscipline")[0].SigmaUserId)
					self.disRender();
			}, null);
		},	
		disRender : function(){
			var self = this;
			$.ajax({
				type : "GET",
				url : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/ProjectUserDisciplines/"+self.model.get("typeProjectUserDiscipline")[0].SigmaUserId,
				success : function(r){
					self.userdis = JSON.parse(r.JsonDataSet);
					
					_.each(self.userdis, function(item){							
						$(self.el).find("#divDiscipline input[value="+item.DisciplineCode+"]").attr("checked","checked");

					});
				}
			});

		},	
		roleRender : function(){					
			var self = this;
			$.ajax({
				type : "GET",
				url : app.config.domain + "/ProjectSettings/SigmaProjectSettings.svc/rest/SigmaUserSigmaRoles/"+self.model.get("typeProjectUserDiscipline")[0].SigmaUserId,
				success : function(r){
					self.userroles = JSON.parse(r.JsonDataSet);
					var i =0;
					var tb = $(self.el).find("#role_sublist");
					_.each(self.userroles, function(item){
						var newline = $(self.newcustom(self.customs ,item.SigmaRoleId));			
						tb.find(".list-group").append(newline);
						$(newline).find("button").on("click",function(e){
							e.preventDefault();					
							$(this).parent().parent().parent().remove();
						});
					});
				}
			});

		},
		setevent : function(){
			var self = this;
			$(this.el).find("#btnSave").on("click", function (e) {
			    e.preventDefault();
				$(self.el).find(".has-error").removeClass("has-error");

			    if ($(".divName option:selected").val() == "") {
			        $(self.el).find(".divName").parent().parent().removeClass("has-error").addClass("has-error");
			        return false;
			    } else {
			        $(self.el).find(".divName").removeClass("has-error");
			    }

				var models_dis_value = [];
				var models_role_value =[];
				var models =[];
				//discipline select
                $(self.el).find("#divDiscipline input[type='checkbox']:checked").each(function() {
					L("name selected:"+ $(".divName option:selected").val());
                    models_dis_value.push(new app.member_dis({ 
                        SigmaOperation : "C",
                        SigmaUserId : (self.model.get("typeProjectUserDiscipline")[0].SigmaUserId != "")?self.model.get("typeProjectUserDiscipline")[0].SigmaUserId : $(".divName option:selected").val(),
						DisciplineCode :$(this).val()	
                    }).toJSON()); 
				});
				//role select
				var roles = [];
				$(self.el).find("#role_sublist option:selected").each(function() {
					if($(this).val() != ""){
						if(!_.contains(roles, $(this).val())){
							models_role_value.push(new app.member_role({
								SigmaOperation:"C",
								SigmaRoleId:Number($(this).val()),
								SigmaUserId: (self.model.get("typeProjectUserDiscipline")[0].SigmaUserId != "")?self.model.get("typeProjectUserDiscipline")[0].SigmaUserId : $(".divName option:selected").val()	
							}).toJSON());
							roles.push($(this).val());
						}
					}
				});
				if(models_dis_value.length == 0){
			        $(self.el).find("#divDiscipline").parent().removeClass("has-error").addClass("has-error");
					return false;
				}
				if(roles.length == 0){
			        $(self.el).find("#role_sublist").parent().removeClass("has-error").addClass("has-error");
					return false;
				}

				Element.Tools.Multi(
					"/ProjectSettings/SigmaProjectSettings.svc/rest/Member/Multi",
					{
						typeProjectUserDiscipline : models_dis_value,
						typeSigmaUserSigmaRole : models_role_value
					},
					$(self.el), {
					s : function(m, r){
						ThisViewPage.render();
						app.component.Confirm.close();
					},
					e : function(m, e){
						
						ThisViewPage.render();
						app.component.Confirm.close();
					}
				});

			});
	
			$(this.el).find("#btnCancel").on("click",function(e){
				e.preventDefault();
				app.component.Modal.close();
			});
			
			$(self.el).find("#btnRoleAdd").on("click",function(e){				
				e.preventDefault();
				var tb = $(self.el).find("#role_sublist");
				var newline = $(self.newcustom(self.customs,null));
				newline.find("button").on("click",function(e){
					e.preventDefault();					
					$(this).parent().parent().parent().remove();
				});
				tb.find(".list-group").append(newline);
			});
		}
	});
})(jQuery);

