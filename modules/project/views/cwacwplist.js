
var app = app || {};
(function($){
	app.cwacwplistview = Element.View.extend({		
		pages : ["PROJECT", "Settings", "CWA/CWP"],
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/project/tpl/tpl_cwacwplistview.html", function(template){
				$(self.el).html($(template));
				$(self.el).find("#buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class : "primary", Id : "btnAdd", Name : "Add New" },
						{ class : "warning", Id : "btnDelete", Name : "Delete" }
					]
				}).render().el);
				self.renderlist();
				self.setevent();
			});
            return this;
		},
		renderlist : function(){
			var self = this;
			var base = $(self.el).find("#list table > tbody");
			app.component.Call(
				"/ProjectSettings/SigmaProjectSettings.svc/rest/CWAs", "GET", "",
				function(d){
					var list = JSON.parse(d.JsonDataSet);
					if(list.length == 0){
						base.append("<tr class='loadingline' style='height:200px;text-align:center;'><td colspan='3' style='vertical-align:middle;'>No Records</td></tr>");
						return;
					}
					_.each(list, function(item){
						var cwa = base.find("input[name='cwa_"+item.CwaId+"']");
						if(cwa.length == 0) {
							var tr = $("<tr />");
							tr.append("<td class='t_check'><input type='checkbox' class='cwa' name='cwa_"+item.CwaId+"'></td>");
							tr.append("<td><a href=\"javascript:Element.Tools.LinkClick('cwa_"+item.CwaId+"');\">"+item.Name+"</a></td>");
							tr.append("<td class='pos_cwp'>"+((item.CWADescription == null) ? "" : item.CWADescription)+"</td>");
							base.append(tr);
						}
					});
					_.each(list, function(item){
						if(item.CwpId != null) {
							var cwa = base.find("input[name='cwa_"+item.CwaId+"']").parent().parent();
							var tr = $("<tr />");
							tr.append("<td style='text-align:right;'><input type='checkbox' class='cwp cwa_"+item.CwaId+"' name='cwp_"+item.CwpId+"'></td>");
							tr.append("<td><a href=\"javascript:Element.Tools.LinkClick('cwp_"+item.CwpId+"');\">"+item.CwpName+"</a></td>");
							tr.append("<td>"+item.CodeName+"</td>");
							tr.append("<td>"+((item.CWPDescription == null) ? "" : item.CWPDescription) +"</td>");
							if(cwa.next().find("table").length == 0){
								cwa.find("td:first").attr("rowspan", 2);
								cwa.after("<tr><td colspan='2' class='cwps' style='padding:0px'></td></tr>");
								var cwps = cwa.next();
								cwps.find(".cwps").append("<table>");
								cwps.find(".cwps table").css("margin","0px");
								cwps.find(".cwps table").addClass("table");
								cwps.find(".cwps table").addClass("table-condensed");
								cwps.find(".cwps table").append("<thead>");
								cwps.find(".cwps table > thead").addClass("smallhead");
								cwps.find(".cwps table > thead").append("<tr>");
								cwps.find(".cwps table").append("<tbody>");
								cwps.find(".cwps table > thead > tr")
									.append("<th class='t_check'></th>")
									.append("<th style='width:240px'>CWP</th>")
									.append("<th style='width:20%'>Discipline</th>")
									.append("<th>Description</th>");
								cwps.find(".cwps table").addClass("table");
							}
							cwa.next().find(".cwps table > tbody").append(tr);
						}
					});

					$(self.el).find("#list input").on("click", function(e){
						if($(this).hasClass("cwa")){
							$(self.el).find("#list ."+$(this).attr("name"))
								.attr("checked", $(this).is(":checked"));
						}else{
							if(!$(this).is(":checked")){
								$(self.el).find("input[name='" + $(this).attr("class")+"']")
									.attr("checked", false);
							}
						}
					});
					
				}, null
			);
		},
		link : function(num){
			var tmp = num.split("_");
			var kind = tmp[0];
			var num = tmp[1];
			if(kind == "cwa"){
					app.component.Modal.show(new app.cwacwpcreate({ model : new app.cwacwp( {CwaId : num}) }), 600);
			}else if(kind == "cwp"){
					app.component.Modal.show(new app.cwpedit({ model : new app.cwp( {CwpId : num}) }), 600);
			}
		
		},	
		setevent : function(){
			var self = this;
			$(self.el).find("#btnAdd").on("click",function(e){	
				e.preventDefault();
				app.component.Modal.show(new app.cwacwpcreate({ model : new app.cwacwp() }), 700);
			});
			
			$(self.el).find("#btnDelete").on("click",function(e){	
				e.preventDefault();
				if(!Element.Tools.ValidateCheck($(self.el).find("#list")))
					return;
				app.component.Confirm.show(
					{ COMMENT : "Are you sure you want to delete the selected item(s)?", POS : "OK", NAG : "Cancel" },
					function(){
						var tmp = "";
						var num = ""
						var	cwadellist = [];
						var cwpdellist = [];
						$(self.el).find("#list table .cwa:checked").each(function() {
							var cwa = $(this).attr("name");
							tmp = cwa.split("_");
							num = tmp[1];
							cwadellist.push(new app.cwacwp({
								SigmaOperation : "D",
								CwaId : Number(num)
							}));
						});
						$(self.el).find("#list table .cwp:checked").each(function() {
							var cwp = $(this).attr("name");
							tmp = cwp.split("_");
							num = tmp[1];
							cwpdellist.push(new app.cwp({
								SigmaOperation : "D",
								CwpId : Number(num)
							}));
						});
						if(cwadellist.length > 0){
								Element.Tools.Multi(
									"/ProjectSettings/SigmaProjectSettings.svc/rest/CWAs/Multi",
									cwadellist,
									$(self.el), {
									s : function(m, r){
										//self.render();
										//app.component.Confirm.close();
									},
									e : function(m, e){
										app.component.Confirm.close();
									}
								});
						}
						if(cwpdellist.length > 0){
								Element.Tools.Multi(
									"/ProjectSettings/SigmaProjectSettings.svc/rest/CWPs/Multi",
									cwpdellist,
									$(self.el), {
									s : function(m, r){
										//self.render();
										//app.component.Confirm.close();
									},
									e : function(m, e){
										app.component.Confirm.close();
									}
								});
						}
						self.render();
						app.component.Confirm.close();


					},
					function(){ }
				);
			});
		
		}
	});
})(jQuery);
