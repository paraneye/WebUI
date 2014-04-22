
var app = app || {};
(function($){
    app.importedscheduleselectproject = Element.View.extend({
        render: function () {
            
            var self = this;			
            app.TemplateManager.get("../../modules/project/tpl/tpl_ImportedScheduleprojectselect.html", function (template) {

                if(self.model.get("")){
                    // var url = self.model.urlRoot + "/" + ;
                    self.model.url = url;
                    self.model.fetch({
                        success : function(){
                            $(self.el).html(_.template(template, self.model.toJSON()));
                            $(self.el).find("h2").html("Edit ImportedSchedule");
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

            this.comboDic();

            return this;
        },

        setproject: function () {
            alert('ok selected');
        },
        

        setevent : function(){
            var self = this;

            $(this.el).find("#btnOk").on("click", function (e) {
                e.preventDefault();
                self.setproject("");
                app.component.Modal.close();
            });
					
            $(this.el).find("#btnClose").on("click", function (e) {

                e.preventDefault();
                app.component.Modal.close();
            });
        },



        comboDic: function () {
            var self = this;
            
            app.component.Call("/ProjectData/SigmaProjectData.svc/rest/GetP6ProjectCombo/admin/admin", "GET", "",
            function (d) {
                _.each(JSON.parse(d.JsonDataSet), function (item) {
                    
                    var address = Element.Tools.GetPageName() + "?projectId=" + item.ProjectObjectID;
                    $(self.el).find("#divDiscipline").
                    append("<a href='javascript:app.router.navigate(\"" + address + "\", {trigger:true});app.component.Modal.close();' " + " class='list-group-item' value='" + item.ProjectObjectID + "'>" + item.P6ProjectName + "</a>");
                    

                });
            }, null);

        }
    });
})(jQuery);
