
var app = app || {};
(function($){
	app.cwacwpcreate = Element.View.extend({
		customs : "",
		cwplist	: "",	
		render : function(){
			var self = this;
			self.getcomponentcustom();
			app.TemplateManager.get("../../modules/project/tpl/tpl_cwacwpcreate.html", function(template){
						
			if(self.model.get("CwaId")){
					var url = "/ProjectSettings/SigmaProjectSettings.svc/rest/CWAs/" + self.model.get("CwaId");
					self.model.url = url;
					self.model.fetch({
							success : function(){
							$(self.el).html(_.template(template, self.model.toJSON()));
                            $(self.el).find("h2").html("Edit CWA");
							self.renderscreen();
							self.setevent();
							self.cwplistRender();
						},
						error : function(model, error){
						}
					});
				}else{
					$(self.el).html(_.template(template, self.model.toJSON()));
					self.renderscreen();
					self.setevent();
				}
			});
            return this;
		},
		cwplistRender : function() {
			var self = this;
			app.component.Call("/ProjectSettings/SigmaProjectSettings.svc/rest/CWPByCWAId/"+self.model.get("CwaId"),
				"GET","", function(r){
					self.cwplist = JSON.parse(r.JsonDataSet);
					var i =0;
					var tb = $(self.el).find("#sublist");
					if(self.cwplist.length > 0){
						tb.find("table > tbody > tr").remove();
					}
					_.each(self.cwplist, function(item){
						var newline = $(self.newcustom(self.customs,item));			
						tb.find("table > tbody:last").append(newline);
					});
				}
			);
		},
		getcomponentcustom : function(){
			var self = this;
			app.component.Call("/Common/Common.svc/rest/DisciplinesComboByProjectId/"+app.loggeduser.CurrentProjectId, "GET", "",
				function(d){
					self.customs = JSON.parse(d.JsonDataSet);
			}, null);
		},
		renderscreen : function(){	
			var self = this;	
		},
		delcustom : [],
		setevent : function(){
			var self = this;

			$(self.el).find("#subbuttons").html(new app.component.ButtonGroup({
				buttons : [
					{ class : "primary", Id : "btnCwpAdd", Name : "Add CWP" },
					{ class : "warning", Id : "btnDelete", Name : "Delete" }
				]
			}).render().el);
			$(self.el).find("#subbuttons button").addClass("btn-sm");

			$(self.el).find("#btnCancel").on("click", function(e){
				e.preventDefault();
				app.component.Modal.close();
			});
	
			$(this.el).find("#btnCwpAdd").on("click", function(e){	
				e.preventDefault(); 
                var tb = $(self.el).find("#sublist");
				var newline = $(self.newcustom(self.customs,null));
			   
				$(self.el).find("table > tbody").find(".norec").remove();
				tb.find("table > tbody:last").append(newline);
			});
			$(this.el).find("#btnDelete").on("click", function(e){	
				e.preventDefault();	
				$(self.el).find("#sublist input[name=chkKey]:checked").each(function() {
					if($(this).val()!="" && $(this).val() != undefined){
						self.delcustom.push($(this).val());							
					}
					$(this).parent().parent().remove();
				});
				if($(self.el).find("table > tbody tr").length == 0){
					$(self.el).find("table > tbody")
						.append("<tr style='height:34px;' class='norec'><td colspan='4' style='text-align:center;'>No Record</td></tr>");
				}
			});

			$(this.el).find("#btnSave").on("click",function(e){
				e.preventDefault();
				$(self.el).find("#sublist .has-error").each(function() {
					$(this).removeClass("has-error");
				});
				if(!Element.Tools.Validate($(self.el).find("form")))
					return;

				var valid = true;
				$(self.el).find("#sublist tr").each(function() {
					if($(this).find("input[name=txtCwpName]").val() == ""){
						$(this).find("input[name=txtCwpName]").parent().addClass("has-error");
						valid = false;
					}
					if($(this).find("select[name=selrole] option:selected").val() == ""){
						$(this).find("select").parent().addClass("has-error");
						valid = false;
					}
					if($(this).find("input[name=txtCwpDesc]").val() == ""){
						$(this).find("input[name=txtCwpDesc]").parent().addClass("has-error");
						valid = false;
					}
				});
				if(!valid)
					return;

					var models_sub = [];
					$(self.el).find("#sublist tr").each(function() {
						var cwpname = $(this).find("input[name=txtCwpName]").val();
						var chkKey = $(this).find("input[name=chkKey]").val();
						if(cwpname !=undefined && cwpname != ""){
							models_sub.push(new app.cwp({
								SigmaOperation : (chkKey != "" && chkKey != undefined) ? "U" : "C",
								CwpId : (chkKey=="" || chkKey==undefined) ? 0 : Number(chkKey),
								CwpName : $(this).find("input[name=txtCwpName]").val(),
								DisciplineCode : $(this).find("select[name=selrole] option:selected").val(),
								Description : $(this).find("input[name=txtCwpDesc]").val(),
								CwaId : (self.model.get("CwaId") != "") ? self.model.get("CwaId") : 0
							}).toJSON());
						}
					});
					_.each(self.delcustom, function(item){
						models_sub.push(new app.cwp({
						SigmaOperation : "D",
						CwpId : item
						}).toJSON());
					})
					
					self.model.set({
						SigmaOperation : (self.model.get("CwaId") != "") ? "U" : "C",
						CwaId: (self.model.get("CwaId") != "") ? Number(self.model.get("CwaId")) : 0,
						ProjectId: 1, //DEBUG
						Name : $(self.el).find("#txtCwaName").val(),
						Area : $(self.el).find("#txtArea").val(),
						Description : $(self.el).find("#txtDescription").val(),
						CWP : models_sub
					});

					self.model.apply($(self.el),
						(self.model.get("CwaId") != "") ? "PUT" : "POST", {
						s : function(m, r){
							ThisViewPage.render();
							app.component.Modal.close();
						},
						e : function(m, e){
							app.component.Modal.close();
						}
					});

			});


		},
		newcustom : function(list,item){
			var tr = "<tr>";
			var selObj = "<select class='form-control input-sm' name='selrole'>";
			selObj += "<option value=''>Select Discipline</option>";
			var selected ="";
			_.each(list, function(data){
				selected ="";
				if(item != null && item.DisciplineCode == data.Code){
					selected=" selected ";
				}
				selObj += "<option value='"+data.Code+"' "+selected+">"+data.CodeName+"</option>";
			});
			selObj += "</select>";

			if(item != null && item != undefined){
				tr += "<td><input type='checkbox' name='chkKey' value="+item.CwpId+" /></td>";
				tr += "<td><input type='text' class='form-control input-sm' name='txtCwpName' maxlength='50' value='"+item.CwpName+"' /></td>";
				tr += "<td>"+selObj+"</td>";
				tr += "<td><input type='text' class='form-control input-sm' name='txtCwpDesc' maxlength='50' value='"+item.Description+"' /></td>";					
				tr += "</tr>";

				
		}else{
				tr += "<td><input type='checkbox' name='chkKey' value='' /></td>";
				tr += "<td><input type='text' class='form-control input-sm' name='txtCwpName' maxlength='50' /></td>";
				tr += "<td>"+selObj+"</td>";
				tr += "<td><input type='text' class='form-control input-sm' name='txtCwpDesc' maxlength='50' /></td>";
		}
		tr += "</tr>";

		return tr;
	}
	
	
});

app.cwpedit = Element.View.extend({        
	render : function(){
		var self = this;			
		app.TemplateManager.get("../../modules/project/tpl/tpl_cwpedit.html", function(template){
			
				if(self.model.get("CwpId")){
					var url = "/ProjectSettings/SigmaProjectSettings.svc/rest/CWPs/" + self.model.get("CwpId");
					self.model.url = url;
					self.model.fetch({
							success : function(){
							$(self.el).html(_.template(template, self.model.toJSON()));
                            $(self.el).find("h2").html("Edit CWP");
							self.renderscreen();
							self.setevent();
													
							
						},
						error : function(model, error){
						}
					});
				}else{
					$(self.el).html(_.template(template, self.model.toJSON()));
					self.renderscreen();
					self.setevent();
				}
				
				
			});
            return this;;
			
		},
		renderscreen : function(){	
			var self = this;	
			$(self.el).find("#divDiscipline").append("<option value=''>Select Discipline</option>");
			app.component.Call("/Common/Common.svc/rest/DisciplinesComboByProjectId/"+app.loggeduser.CurrentProjectId, "GET", "",
				function(d){
					_.each(JSON.parse(d.JsonDataSet), function(item){
						var sel = (self.model.get("DisciplineCode") == item.Code) ? " selected " : "";
						$(self.el).find("#divDiscipline")
							.append("<option value='"+item.Code+"' "+sel+">"+item.CodeName+"</option>");
					});
			}, null);
		},
		setevent : function(){
			var self = this;
			$(self.el).find("#btnCancel").on("click", function(e){
				e.preventDefault();
				app.component.Modal.close();
			});

			$(self.el).find("#btnSave").on("click",function(e){
				e.preventDefault();
				if(!Element.Tools.Validate($(self.el).find("form")))
					return;
					self.model.set({
						SigmaOperation : (self.model.get("CwpId") != "") ? "U" : "C",
						CwpId: (self.model.get("CwpId") != "") ? self.model.get("CwpId") :0,
						CwpName : $(self.el).find("#txtCwpName").val(),
						DisciplineCode : $(self.el).find("#divDiscipline option:selected").val(),
						Description : $(self.el).find("#txtCwpDesc").val()
					});

					self.model.apply($(self.el),
						(self.model.get("CwpId") != "") ? "PUT" : "POST", {
						s : function(m, r){
							ThisViewPage.render();
							app.component.Modal.close();
						},
						e : function(m, e){
							ThisViewPage.render();
							app.component.Modal.close();
						}
					});

			});


		}
		
		
	});
})(jQuery);
