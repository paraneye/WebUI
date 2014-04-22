
var app = app || {};
(function($){
    app.ImportedSchedulecreate = Element.View.extend({	
        render : function(){
            var self = this;			
            app.TemplateManager.get("../../modules/project/tpl/tpl_ImportedSchedulecreate.html", function (template) {
			                
			
				if (self.model.get("ScheduledWorkItemId") != undefined) {
                    var url = app.config.domain + "/ProjectData/SigmaProjectData.svc/rest/ImportedSchedules/" + self.model.get("ScheduledWorkItemId");

                    self.model.url = url;
                    self.model.fetch({
                        success : function(){
                            $(self.el).html(_.template(template, self.model.toJSON()));
							$(self.el).find("h2").text(self.options.title);
                			self.setevent();
                        },
                        error : function(model, error){
                            L(error);
                        }
                    });
                }else{
                    $(self.el).html(_.template(template, self.model.toJSON()));
                    self.setevent();
                }
				             
                

            });
           

            return this;
        },

        setsave: function (data) {
            var self = this;
            if (!confirm("This change might have an effect on project data. Are you sure?")) return;

            
            self.model.set({
                ScheduledWorkItemId: self.model.get( "ScheduledWorkItemId" ),
                DisciplineCode: $(self.el).find("#selDiscipline option:selected").val(),
                CwpId: $(self.el).find("#selCwp option:selected").val(),
                AssignedTo: $(self.el).find("#selGeneralForeman option:selected").val(),
                P6Duration: "0.0",
                SigmaDuration: "0.0",
                EstimatedManhours: "0.0",
                AssignedCrew: "0.0"
            });

            
            ThisViewPage.options.query.projectId = null;

            self.model.apply($(self.el),
				(self.model.get("ScheduledWorkItemId") != "") ? "PUT" : "POST", {
				    s: function (m, r) {
				        
				        ThisViewPage.render();
				        //app.component.Modal.close();
				    },
				    e : function(m, e){
				        app.component.Modal.close();
				    }
				});



        },

        setevent : function(){
            var self = this;

            $(self.el).find("#btnSave").on("click",function(e){
                e.preventDefault();
                if (!Element.Tools.Validate($(self.el).find("form")))
                    return;
                self.setsave("");
                app.component.Modal.close();
            });
					
            $(self.el).find("#btnCancel").on("click",function(e){
                e.preventDefault();
                app.component.Modal.close();
            });

			self.comboDiscipline();
	        self.comboCwp();
    	    self.comboGf();

        },

        comboDiscipline: function () {
            
            var self = this;           
			var cboDisc =$(self.el).find("#selDiscipline");
            cboDisc.append("<option value=''>Select Discipline</option>");
            app.component.Call("/Common/Common.svc/rest/DisciplinesComboByProjectId/"+app.loggeduser.CurrentProjectId, "GET", "",
			function (d) {
			    _.each(JSON.parse(d.JsonDataSet), function (item) {
			        var sl = (self.model.get("DisciplineCode") == item.Code) ? " selected " : "";
			        cboDisc.append("<option value='" + item.Code + "' " + sl + " >" + item.CodeName + "</option>");
			        
			    });
			  
			}, null);
        },

        comboCwp: function () {
            var self = this;            
			var cboCwp =$(self.el).find("#selCwp");
            cboCwp.append("<option value=''>Select CWP</option>");
            app.component.Call("/Common/Common.svc/rest/CwpCombo", "GET", "",
                function (d) {
                    _.each(JSON.parse(d.JsonDataSet), function (item) {
                         var sl = (self.model.get("CwpId") == item.Code) ? " selected " : "";
                        cboCwp.append("<option value='" + item.Code + "' "+sl+">" + item.CodeName + "</option>");
                        
                    });
                    
                }, null);
        },

        comboGf: function () {

            var self = this;            
			var cboGf =$(self.el).find("#selGeneralForeman");
            cboGf.append("<option value=''>Select General Foreman</option>");
            app.component.Call("/ProjectData/SigmaProjectData.svc/rest/GetGeneralForeManCombo", "GET", "",
                function (d) {
                    _.each(JSON.parse(d.JsonDataSet), function (item) {
						var sl = (self.model.get("AssignedTo") == item.SigmaUserId) ? " selected " : "";
                        cboGf.append("<option value='" + item.SigmaUserId + "'" +sl+">" + item.FirstName + " " + item.LastName + "</option>");
                                               
                    });
                }, null);


        }
	
    });
})(jQuery);
