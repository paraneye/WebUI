
var app = app || {};
(function($){
	app.reportlistview = Element.View.extend({		
		pages : ["PROJECT", "Document Control", "Reports and Records"],
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/project/tpl/tpl_reportlistview.html", function(template){
				$(self.el).html($(template));

				self.options.query.FileCategory = "FILE_CATEGORY_REPORT";
				self.options.query.FileTypeCode = self.options.query.FileTypeCode || "";

				$(self.el).find("#controls").append(new app.component.SearchControl({
					options : [
						{ Value : "Title", Name : "Title" },
						{ Value : "UploadedBy", Name : "Modified by" }
					],
					query : self.options.query      
				}).render().el);

				$(self.el).find("#list").html(new app.component.Tablelist({
					list : "../../modules/project/tpl/tpl_reportlist.html",
					listitem : "../../modules/project/tpl/tpl_reportlistitem.html",
					coll : "new app.documentlist()",
					query : self.options.query      
				}).render().el);

				self.renderscreen();

			});
            return this;
		},
		renderlist : function(){
			var self = this;
			var param="&FileCategory=FILE_CATEGORY_REPORT";
			var type =$(self.el).find("#cboType option:selected").val();

			self.options.query.FileCategory = "FILE_CATEGORY_REPORT";
			self.options.query.FileTypeCode = type || "";
			var q = Element.Tools.QueryGen(self.options.query, "page", 1);
			window.location = "#reportlist"+q;
		},
		renderscreen : function(){
			var self = this;

			$(self.el).find("#cboType option").remove();
			$(self.el).find("#cboType").append("<option value=''>ALL</option>");
			app.component.Call("/GlobalSettings/SigmaGlobalSettings.svc/rest/FileType/REPORT_TYPE","GET","",
				function(d){
					_.each(JSON.parse(d.JsonDataSet), function(item){
						var sl = (self.options.query.FileTypeCode == item.Code) ? " selected " : "";
						$(self.el).find("#cboType")
							.append("<option value='"+item.Code+"' "+sl+">"+item.CodeName+"</option>");
					});
					$(self.el).find("#controls select").css("margin-right","30px");
					$(self.el).find("#controls form").prepend($(self.el).find("#searchcontrol"));
					$(self.el).find("#controls form").addClass("form-horizontal");
					$(self.el).find("#controls form").css("margin-right","15px");
					$(self.el).find("#searchcontrol").attr("style","display:'';margin-right:17px;");
				},null
			);
			$(self.el).find("#cboType").on("change", function(){
				self.renderlist();
			});
		}

	});
	
})(jQuery);

