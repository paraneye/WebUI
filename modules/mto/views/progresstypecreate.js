
var app = app || {};
(function($){
	app.progresstypecreate = Element.View.extend({			
		render : function(){
			var self = this;			
			app.TemplateManager.get("../../modules/mto/tpl/tpl_progresstypecreate.html", function(template){
			
				if(self.model.get("ProgressTypeId")){
					var url = "/GlobalSettings/SigmaGlobalSettings.svc/rest/ProgressTypes/" + self.model.get("ProgressTypeId");
					self.model.url = url;
					self.model.fetch({
							success : function(){
							$(self.el).html(_.template(template, self.model.toJSON()));
                            $(self.el).find("h2").html("Edit Progress Type");
							self.renderscreen();
							self.setevent();
							
							if(self.model.get("DisciplineCode") != "")	{
								self.nowDic = self.model.get("DisciplineCode");
								self.resetCat();
							}
							if(self.model.get("TaskCategoryId") != "")	{
								self.nowCat = self.model.get("TaskCategoryId");
								self.resetType();
							}

							self.progressStepRender();	
							
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
 	    nowDic : "",
		nowCat : "",
		nowType : "",
		steplist : "",
		progressStepRender : function(){
			var self = this;		

			app.component.Call(app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/ProgressStepByProgessTypeId/"+self.model.get("ProgressTypeId"), "GET", "",
				function(d){
					self.steplist = JSON.parse(d.JsonDataSet);
					var i =0;
					var tb = $(self.el).find("#sublist");
					var total = 0;

					_.each(self.steplist, function(item){
						var newline = $(self.newcustom(item));			
						newline.find("input[name='txtWeight']").on("blur", function(){
							self.stepsum();

						});				

						tb.find("table > tbody:last").append(newline);
						total += Number(item.Weight);
					
					});
					
					$(self.el).find(".tdtotal").html(String(total));

				}, null
			);

		},
		resetDic : function(){
			var self = this;	
			var cboDisc = new app.component.Combo({
				url : new app.disciplines().url,
				inline : true,
				selname : "Select Discipline",
				selected : self.model.get("DisciplineCode")
			}).render().el;
			$(cboDisc).on("change", function(){
				self.nowDic = $(this).val();
				self.resetCat();
			});
			$(this.el).find(".divDiscipline").html(cboDisc);
		},
		resetCat : function(){
			var self = this;	
			var cboCat = "";
			if(self.nowDic == ""){
				cboCat = "<select class='form-control'><option value=''>Select TaskCategory</option></select>";
				self.nowCat = "";
				self.resetType();
				
			}else{
					cboCat = new app.component.Combo({
						url : new app.taskcategorylist().url + self.nowDic,
						inline : true,
						selected : self.model.get("TaskCategoryId")
					}).render().el;
					$(cboCat).on("change", function(){
						self.nowCat = $(this).val();
						self.resetType();
					});
			}
			
			$(this.el).find(".divTaskCategory").html(cboCat);
		},

		resetType : function(){
			var self = this;	
			var cboType = "";
			if(self.nowCat == ""){
				cboType = "<select class='form-control'><option value=''>Select TaskType</option></select>";
			}else{
					cboType = new app.component.Combo({
						url : new app.tasktypelist().url + self.nowCat,
						inline : true,
						selected : self.model.get("TaskTypeId")
					}).render().el;
					$(cboType).on("change", function(){
						self.nowType = $(this).val();
						
					});
			}

			$(this.el).find(".divTaskType").html(cboType);
		},
		renderscreen : function(){
		var self = this;

			
		},
		validationcheck : function(){
			var self = this;			
			var ret = true;
			$(self.el).find("#divcmd").remove();				
					
			$(self.el).find("#sublist tr").each(function() {
				
				$(this).find("input[type=text]").each(function(){
					if($(this).val() == ""){
						$(this).parent().removeClass("has-error").addClass("has-error");
						ret = false;
					}else{
						$(this).parent().removeClass("has-error");
					}
				});			

			});
				

			return ret;

		},
		stepsum : function(){
			var self = this;

			var total = 0;
			_.each($(self.el).find("#sublist input[name=txtWeight]"), function(item){												total += ($(item).val()=="")? 0 : Number($(item).val());				
			});
			$(self.el).find(".tdtotal").html(total.toLocaleString());
			if(total > 100 || total < 100){
					$(self.el).find(".tdtotal").removeClass("number-denger").addClass("number-denger");
			}else{
					$(self.el).find(".tdtotal").removeClass("number-denger");
			}

		},
		delcustom : [],
		setevent : function(){
			var self = this;
			
			
			$(self.el).find("#subbuttons").html(new app.component.ButtonGroup({
				buttons : [
					{ Id : "btnStepAdd", Name : "Add Progress Step" },
					{ class : "warning" , Id : "btnStepDelete", Name : "Delete" }
				]
			}).render().el);
				
						
			$(this.el).find("#btnStepAdd").on("click", function(e){	  
	  			e.preventDefault();
				var tb = $(self.el).find("#sublist");
				var newline = $(self.newcustom(null));
			  
		 	    if(!self.validationcheck())
					return;

				newline.find("input[name='txtWeight']").on("blur", function(){
					self.stepsum();
				});	

				tb.find("table > tbody:last").append(newline);				

				$(self.el).find("#divcmd").remove();
				$(self.el).find("#sublist").removeClass("has-error");
                
			});
			$(this.el).find("#btnStepDelete").on("click", function(e){	
				e.preventDefault();
				$(self.el).find("#sublist input[name=chkKey]:checked").each(function() {
					if($(this).val()!="" && $(this).val() != undefined){
							self.delcustom.push($(this).val());						
					}
					$(this).parents("tr").remove();
				});
				self.stepsum();

			});
			$(this.el).find("#btnSave").on("click", function(e){	
				e.preventDefault();
				if(!Element.Tools.Validate($(self.el).find("form"))) 
        			return;
				if(!self.validationcheck())
					return;
				
				if($(self.el).find("#sublist td").length<1 ){				
					$(self.el).find("#sublist").removeClass("has-error").addClass("has-error");
					$(self.el).find("#sublist").after("<div id='divcmd' class='text-danger'>Add Progress Step !</div>");
					return;
				}
				var total = $(self.el).find(".tdtotal").html();
				total = (total.replace("/,$/","") =="")? 0 : Number(total.replace("/,$/",""));
						
				if(total > 100 || total < 100){
					$(self.el).find(".tdcmd").removeClass("number-denger").addClass("number-denger");
					return;
				}else{
					$(self.el).find(".tdcmd").removeClass("number-denger");
				}

					var models_sub =[];				
					$(self.el).find("#sublist tr").each(function() {
					
						var v_progressStep = $(this).find("input[name=txtProgressStep]").val();
						var v_chkKey = $(this).find("input[name=chkKey]").val();
						if(v_progressStep !=undefined && v_progressStep != ""){
							
							models_sub.push(new app.progresstype_step({
								SigmaOperation : (v_chkKey != "" && v_chkKey != undefined) ? "U" : "C",
								ProgressStepId : Number((v_chkKey=="" || v_chkKey==undefined) ? 0 : v_chkKey),
								Name : $(this).find("input[name=txtProgressStep]").val(),
								Weight : Number($(this).find("input[name=txtWeight]").val()),
								IsMultipliable : ($(this).find("input[name=chkMultiplied]")[0].checked==true) ? "Y" : "N",
								ProgressTypeId : self.model.get("ProgressTypeId")
							}).toJSON());
						}
					});
					_.each(self.delcustom, function(item){
						models_sub.push(new app.progresstype_step({
						SigmaOperation : "D",
						ProgressStepId : item
						}).toJSON());
					})

					
					self.model.set({
						SigmaOperation : (self.model.get("ProgressTypeId") != "") ? "U" : "C",
						ProgressTypeId: (self.model.get("ProgressTypeId") != "") ? self.model.get("ProgressTypeId") : 0,					
						Name : $(self.el).find("#txtProgressType").val(),
 					    Description : $(self.el).find("#txtProgressDesc").val(),
						ProgressStep : models_sub
					});

					self.model.apply($(self.el),
						(self.model.get("ProgressTypeId") != "") ? "PUT" : "POST", {
						s : function(m, r){
							ThisViewPage.render();
							app.component.Modal.close();
						},
						e : function(m, e){
							Element.Tools.Error(e);
							app.component.Modal.close();
						}
					});


			});
			$(this.el).find("#btnCancel").on("click", function(e){	
				e.preventDefault();
				app.component.Modal.close();

			});

		},
		newcustom : function(item){
			var tr = "<tr>";

			if(item != null && item != undefined){
					tr += "<tr>";
					tr += "<td class='t_check'><input type='checkbox' name='chkKey' value="+item.ProgressStepId+" /></td>";
					tr += "<td><input type='text' class='form-control' name='txtProgressStep' maxlength='50' value='"+item.Name+"' /></td>";
					tr += "<td><input type='number' class='form-control d_number' name='txtWeight' maxlength='50' value='"+item.Weight+"' /></td>";
					var checked = "false";
					if(item.IsMultipliable=="Y")
							checked = "checked";
					else
							checked = "";

					tr += "<td style='text-align:center;'><input type='checkbox' name='chkMultiplied' "+checked+" /></td>";
					tr += "</tr>";

					
			}else{
					tr += "<tr>";
					tr += "<td class='t_check'><input type='checkbox' name='chkKey' value='' /></td>";
					tr += "<td><input type='text' class='form-control' name='txtProgressStep' maxlength='50' /></td>";
					tr += "<td><input type='number' class='form-control d_number' name='txtWeight' maxlength='50' /></td>";
					tr += "<td style='text-align:center;'><input type='checkbox' name='chkMultiplied' /></td>";
					tr += "</tr>";
			}

			return tr;
		}
	
		
	});
})(jQuery);
