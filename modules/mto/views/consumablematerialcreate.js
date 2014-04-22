
var app = app || {};
(function ($) {
    app.consumablematerialcreate = Element.View.extend({       
        render: function () {            
            var self = this;
            app.TemplateManager.get("../../modules/mto/tpl/tpl_consumablematerialcreate.html", function (template) {

                if (self.model.get("MaterialId")) {
                    var url = "/GlobalSettings/SigmaGlobalSettings.svc/rest/Materials/" + self.model.get("MaterialId");
                    self.model.url = url;
                    self.model.fetch({
                        success: function () {
                            $(self.el).html(_.template(template, self.model.toJSON()));
                            $(self.el).find("h2").html("Edit Consumable");
                            self.renderscreen();
                            self.setevent();

                            if (self.model.get("DisciplineCode") != "") {
                                self.nowDic = self.model.get("DisciplineCode");
                                self.resetCat();
                            }
                            if (self.model.get("TaskCategoryId") != "") {
                                self.nowCat = self.model.get("TaskCategoryId");
                                self.resetType();
                            }

                            self.userFieldRender();

                        },
                        error: function (model, error) {
                        }
                    });
                } else {
                    $(self.el).html(_.template(template, self.model.toJSON()));
                    self.renderscreen();
                    self.setevent();
                }



            });
            return this;
        },
        nowDic: "",
        nowCat: "",
        nowType: "",
        userFieldRender: function () {
            var self = this;
            

			app.component.Call(
					app.config.domain + "/GlobalSettings/SigmaGlobalSettings.svc/rest/MaterialCustomFieldsWithCustomField/" + self.model.get("MaterialId"),  
					"GET",                                      
					"",                                         
					function(data){                             
						   	self.userFieldList = JSON.parse(data.JsonDataSet);
                    	var i = 0;
                    	var tb = $(self.el).find("#field_sublist");
                    	_.each(self.userFieldList, function (item) {
                    	    var newline = $(self.newcustom(item));
                    	    tb.find("table > tbody:last").append(newline);


                   		});

					}, 
					null                                        
				);

        },
        resetDic: function () {
            var self = this;
            var cboDisc = new app.component.Combo({
                url: new app.disciplines().url,
                inline: true,
                selname: "Select Discipline",
                selected: self.model.get("DisciplineCode")
            }).render().el;
            $(cboDisc).on("change", function () {
                self.nowDic = $(this).val();
                self.resetCat();
            });
            $(self.el).find(".divDiscipline").html(cboDisc);
        },
        resetCat: function () {
            var self = this;
            var cboCat = "";
            if (self.nowDic == "") {
                cboCat = "<select class='form-control'><option value=''>Select Task Category</option></select>";
                self.nowCat = "";
                self.resetType();

            } else {
                cboCat = new app.component.Combo({
                    url: new app.taskcategorylist().url + self.nowDic,
                    inline: true,
                    selname: "Select Task Category",
                    selected: self.model.get("TaskCategoryId")
                }).render().el;
                $(cboCat).on("change", function () {
                    self.nowCat = $(this).val();
                    self.resetType();
                });
            }

            $(self.el).find(".divTaskCategory").html(cboCat);
        },

        resetType: function () {
            var self = this;
            var cboType = "";
            if (self.nowCat == "") {
                cboType = "<select class='form-control'><option value=''>Select Task Type</option></select>";
            } else {
                cboType = new app.component.Combo({
                    url: new app.tasktypelist().url + self.nowCat,
                    inline: true,
                    selname: "Select Task Type",
                    selected: self.model.get("TaskTypeId")
                }).render().el;
                $(cboType).on("change", function () {
                    self.nowType = $(this).val();

                });
            }

            $(self.el).find(".divTaskType").html(cboType);
        },
		resetUOM : function(){
			var self = this;	
			var cboUOM="";
			
			cboUOM = new app.component.Combo({
				url : new app.uomCode().url,
				inline : true,
				selname : "Select UOM",
				selected : self.model.get("UomCode")
			}).render().el;	

			$(self.el).find(".divUOM").html(cboUOM);
			$(self.el).find(".divUOM select").addClass("required");

		},
        renderscreen: function () {
            var self = this;

            self.resetDic();
            self.resetCat();
            self.resetType();

			self.resetUOM();	

        },
		validationcheck : function(){
			var self = this;			
			var ret = true;
					
			$(self.el).find("#field_sublist tr").each(function() {
					
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
        delcustom: [],
        setevent: function () {
            var self = this;

            $(self.el).find("#field_subbuttons").html(new app.component.ButtonGroup({
                buttons: [
					{ Id: "btnFieldAdd", Name: "Add User Defined Field" },
					{ class : "warning" , Id: "btnFieldDelete", Name: "Delete" }
                ]
            }).render().el);

            $(self.el).find("#btnCancel").on("click", function (e) {
                e.preventDefault();
                app.component.Modal.close();
            });

            $(this.el).find("#btnSave").on("click", function (e) {
                e.preventDefault();
				if(!Element.Tools.Validate($(self.el).find("form"))) 
        			return;
				if(!self.validationcheck())
					return;

                var models_sub = [];
                $(self.el).find("#field_sublist tr").each(function () {

                    var title = $(this).find("input[name=txtTitle]").val();
                    var chkKey = $(this).find("input[name=chkKey]").val();
                    if (title != undefined && title != "") {

                        models_sub.push(new app.material_field({
                            SigmaOperation: (chkKey != "" && chkKey != undefined) ? "U" : "C",
                            CustomFieldId: (chkKey == "" || chkKey == undefined) ? 0 : chkKey,
                            FieldName: $(this).find("input[name=txtTitle]").val(),
                            Value: $(this).find("input[name=txtValue]").val(),
                            IsDisplayable: "Y", 
                            Parentid: (self.model.get("MaterialId") != "") ? self.model.get("MaterialId") : 0
                        }).toJSON());
                    }
                });
                _.each(self.delcustom, function (item) {
                    models_sub.push(new app.material_field({
                        SigmaOperation: "D",
                        CustomFieldId: item
                    }).toJSON());
                })


                self.model.set({
                    SigmaOperation: (self.model.get("MaterialId") != "") ? "U" : "C",
                    IsConsumable: "Y",
                    Description: $(self.el).find("#txtDescription").val(),
                    Vendor: $(self.el).find("#txtVendor").val(),
                    PartNumber: $(self.el).find("#txtPartnumber").val(),
                    UomCode: $(self.el).find(".divUOM option:selected").val(),
                    CustomField: models_sub
                });

                self.model.apply($(self.el),
                    (self.model.get("MaterialId") != "") ? "PUT" : "POST", {
                        s: function (m, r) {
                            ThisViewPage.render();
                            app.component.Modal.close();
                        },
                        e: function (m, e) {
                            app.component.Modal.close();
                        }
                    });

            });



            $(this.el).find("#btnFieldAdd").on("click", function (e) {
                e.preventDefault();
                var tb = $(self.el).find("#field_sublist");
                var newline = $(self.newcustom(null));
				
				if(!self.validationcheck())
					return;

                tb.find("table > tbody:last").append(newline);

            });
            $(this.el).find("#btnFieldDelete").on("click", function (e) {
                e.preventDefault();
                $(self.el).find("#field_sublist input[name=chkKey]:checked").each(function () {
                    if ($(this).val() != "" && $(this).val() != undefined) {
                        self.delcustom.push($(this).val());
                    }
                    $(this).parent().parent().remove();
                });

            });


        },
        newcustom: function (item) {
            var tr = "<tr>";

            if (item != null && item != undefined) {
                tr += "<tr>";
                tr += "<td class='t_check'><input type='checkbox' name='chkKey' value=" + item.CustomFieldId + " /></td>";
                tr += "<td><input type='text' class='form-control' name='txtTitle' maxlength='50' value='" + item.FieldName + "' /></td>";
                tr += "<td><input type='text' class='form-control' name='txtValue' maxlength='50' value='" + item.Value + "' /></td>";
                
                tr += "</tr>";


            } else {
                tr += "<tr>";
                tr += "<td class='t_check'><input type='checkbox' name='chkKey' value='' /></td>";
                tr += "<td><input type='text' class='form-control' name='txtTitle' maxlength='50' /></td>";
                tr += "<td><input type='text' class='form-control' name='txtValue' maxlength='50' /></td>";
                tr += "</tr>";
            }

            return tr;
        }

       

    });
})(jQuery);
