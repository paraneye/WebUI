
var app = app || {};
(function($){
	app.iwpviewerlistview = Element.View.extend({
		pages : ["Global Settings", "Tools", "IWP Viewer"],	
		nowCwp : "",
		nowIwp : "",	
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/mto/tpl/tpl_iwpviewerlistview.html", function(template){
				$(self.el).html($(template));

				self.nowCwp = self.options.query.CwpId || "";
				self.nowIwp = self.options.query.IwpId || "";

				$(self.el).find("#list").html(new app.component.Tablelist({
					list : "../../modules/mto/tpl/tpl_iwpviewerlist.html",
					listitem : "../../modules/mto/tpl/tpl_iwpviewerlistitem.html",
					coll : "new app.iwpviewerlist()"
					//query : self.options.query 
				}).render().el);

				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class : "default", Id : "btnPrintIwp", Name : "Print IWP" }
						
					]
				}).render().el);
				
				self.setevent();				
				self.renderscreen();

			});
            return this;
		},
		setevent : function(){
			var self = this;

				$(self.el).find("#btnPrintIwp").on("click",function(e){
					e.preventDefault();				

				});
							
				

		},	
		renderlist : function(){
			var self = this;
			var v_Cwp = $(self.el).find(".divCwp option:selected").val();
			var v_Iwp = $(self.el).find(".divIwp option:selected").val();
			var param ="";
			
			self.options.query.CwpId = v_Cwp || "";	
			self.options.query.IwpId = v_Iwp || "";
			
			var q = Element.Tools.QueryGen(self.options.query, "page", 1);
			window.location = "#iwpviewerlist"+q;
		},

		comboCwp : function(){
			var self = this;	
			var cboCwp = $("<select>").addClass("form-control");
			cboCwp.append("<option value='' >Select CWP</option>");
			app.component.Call("/Common/Common.svc/rest/CwpCombo", "GET", "",
			function(d){
				_.each(JSON.parse(d.JsonDataSet), function(item){
					var selected = "";
					if(item.Code == self.nowCwp)
						selected = "selected";

					cboCwp.
						append("<option value='"+item.Code+"' "+selected+">"+item.CodeName+"</option>");
				});
				
			}, null)
			$(self.el).find(".divCwp").html(cboCwp);
			cboCwp.on("change", function(){
				
				self.nowCwp = $(this).val();
				self.comboIwp();
			});

		},

		comboIwp : function(){
			var self = this;		
		
			var cboIwp = $("<select>").addClass("form-control");
			cboIwp.append("<option value='' >Select IWP</option>");
			if(self.nowCwp != ""){
					app.component.Call("/Common/Common.svc/rest/IwpCombo/"+ self.nowCwp, "GET", "",
					function(d){
						_.each(JSON.parse(d.JsonDataSet), function(item){
							var selected = "";
							if(item.Code == self.nowIwp)
								selected = "selected";

							cboIwp.
								append("<option value='"+item.Code+"' "+selected+">"+item.CodeName+"</option>");
						});
						
					}, null);
			}
			$(self.el).find(".divIwp").html(cboIwp);
			cboIwp.on("change", function(){
				L($(this).val());	
				self.nowIwp = $(this).val();
				self.renderlist();
			});

		},
		renderscreen : function(){
			this.comboCwp();
			this.comboIwp();
		}

	});
})(jQuery);
