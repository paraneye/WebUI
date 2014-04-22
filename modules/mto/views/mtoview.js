
var app = app || {};
(function($){
	app.mtoview = Element.View.extend({		
		nowDic : "",
		nowCat : "",
		nowType : "",
		customs : "",
		costcodes : "",
		pages : ["PROJECT", "Data", "MTO"],
		canvas : null, image : "", element : "", zoomDelta : "", currentScale : 1, currentAngle : 0,
		startX : false, startY : false, isDown : false,
		nowrow : null,
		queryformtolist : "",
		inititalize : function(){
		},
		render : function(){
			this.queryformtolist = this.options.query;
			this.getcomponentcustom();
			var self = this;
			app.TemplateManager.get("../../modules/mto/tpl/tpl_mtoview.html", function(template){
				$(self.el).html($(template));
				$(self.el).find("#sldrawing").append("<option value=''>Select CWP First</option>");
					$(self.el).find("#btnMTOCancel").on("click", function(e){
						e.preventDefault();
						self.initmtocreate();
					});
					$(self.el).find("#btnAdd").on("click", function(e){
						e.preventDefault();
						var form = $(self.el).find("#mtocreate form");
						var newline = $(self.newcustom());
						newline.find(".btn-warning").on("click",function(e){
							e.preventDefault();
							$(this).parent().parent().parent().parent().remove();
						});
						newline.find("select").on("change",function(e){
							e.preventDefault();
							var pr = $(this).parent().parent();
							if($(this).find("option:selected").val() == "_NEW_"){
								pr.find("input[name='newcustom']").show();
								pr.find("select").hide();
								pr.find("input[name='newcustom']").focus();
							}
						});
						form.append(newline);
					});
					$(self.el).find("#txtQuantity").on("keydown", function(e){
						if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
							(e.keyCode == 65 && e.ctrlKey === true) || 
							(e.keyCode >= 35 && e.keyCode <= 39)) {
								 return;
						}
						if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
							e.preventDefault();
						}
					});
					$(self.el).find("#txtQuantity").on("keyup", function(e){
						var mnh = $(self.nowrow).find("td[name='manhour']").text();
						if(mnh != ""){
							$(self.el).find("#mtocreate").find("#txtManHour")
								.html(mnh * $(self.el).find("#txtQuantity").val());
						}else{
							$(self.el).find("#mtocreate").find("#txtManHour").html(0);
						}
					});
				$(self.el).find("#mto_buttons").html(new app.component.ButtonGroup({
					buttons : [
						{ class : "warning", Id : "btnDelete", Name : "Delete" }
					]
				}).render().el);
				$(self.el).find("#mto_controls").html("<b>Total Man Hour: 0</b>");
				$(self.el).find("#btnSearch").on("click",function(e){
					e.preventDefault();
					self.renderlist();
				});
				$(self.el).find("#btnSave").on("click",function(e){				
					e.preventDefault();
					var list = [];
					_.each($(self.el).find("#mtocreate .userdefine"), function(tr){
						var tmp = $(tr).find("select[name='ufield']").val();
						var visible = $(tr).find("input[name='visible']").is(":checked");
						var j = new app.componentcustom({
							SigmaOperation : "C",
							ComponentId : 0,
							CustomFieldId : tmp,
							Value : $(tr).find("input[name='value']").val(),
							IsDisplayable : (visible) ? "Y" : "N"
						});
						list.push(j.toJSON());
					});
					list.push({
						SigmaOperation : "C",
						ComponentId : 0,
						CustomFieldId : 0,
						FieldName : "StructureNumber",
						Value : $(self.el).find("#txtFoundationNum").val(),
						IsDisplayable : "Y"
					});
					var cwpdata = $(self.el).find("#slcwp").val().split("|");
					var param = new app.typecomponent({
						Qty : Number($(self.el).find("#txtQuantity").val()),
						Description : $(self.el).find("#lblDescription").text(),
						EngTagNumber : $(self.el).find("#txtEngTag").val(),
						ComCustomField : list,
						MaterialId : Number($(self.nowrow).find("input[name='mid']").val()),
						CwpId : Number(cwpdata[0]),
						DrawingId : Number($(self.el).find("#sldrawing").val())
					});
					var param1 = new app.material();
					param1.fetch({
						url : "/GlobalSettings/SigmaGlobalSettings.svc/rest/Materials/" +  $(self.nowrow).find("input[name='mid']").val(),
						success: function () {
							if(param1.get("CostCodeId") != ""){
								param1.setByName("CostCodeId", Number(param1.get("CostCodeId")));
							}else{
								param1.setByName("CostCodeId", 0);
							}
							param1.setByName("DisciplineCode", cwpdata[1]);
							$.ajax({
								contentType : 'application/json',
								data : JSON.stringify({ paramObj : param.toJSON(), paramObj2 : param1.toJSON() }),
								url : "/ProjectData/SigmaProjectData.svc/rest/SaveMTOs",
								type : "POST",
								success : function(data){
									self.initBox();
									self.resetmtolist();
								},
								error : function(data){
									L(data);
								}
							});
						}
					});
				});
				$(self.el).find("#sldrawing").on("change", function(e){
					self.drawingnumber = $(this).val();
					self.resetmtolist();
					self.calldrawing();
					self.initmtocreate();
				});
				app.component.Call(
					"/Common/Common.svc/rest/CwpCombo", "GET", "",
					function(d){
						_.each(JSON.parse(d.JsonDataSet), function(item){
							$(self.el).find("#slcwp").append("<option value='"+item.Code+"|"+item.ExtraCode+"'>"+item.CodeName+"</option>");
						});
					},null
				);
				$(self.el).find("#slcwp").on("change", function(e){
					self.drawingnumber = null;
					$(self.el).find(".leftlist").hide();
					$(self.el).find("#focal").hide();
					$(self.el).find(".mtlist").hide();
					$(self.el).find("#top_controls").removeClass("col-sm-7").addClass("col-sm-12");
					$(self.el).find("#sldrawing option").remove();
					$(self.el).find("#sldrawing").append("<option value=''>Select</option>");
					var cwp = $(self.el).find("#slcwp option:selected").text();
					var cwpdata = $(self.el).find("#slcwp option:selected").val();
					if(cwp == "")
						return;
					var tarr = cwpdata.split("|");
					app.component.Call(
						"/Common/Common.svc/rest/DrawingNumberCombo/"+tarr[0], 
						"GET", "",
						function(d){
							_.each(JSON.parse(d.JsonDataSet), function(item){
								$(self.el).find("#sldrawing").append("<option value='"+item.DrawingId+"'>"+item.Name+"</option>");
							});
						},null
					);
					self.nowDic = tarr[1];
					self.resetCat();
				});
				$(self.el).find("#btnDelete").on("click", function(e){
					e.preventDefault();
					if(!Element.Tools.ValidateCheck($(self.el).find("#mtolist")))  
        			return;

					app.component.Confirm.show(
						{ COMMENT : "Are you sure you want to delete the selected item(s)?", POS : "OK", NAG : "Cancel" },
						function(){
							var models = [];
                            $(self.el).find("#mtolist").find("input[name=key]:checked").each(function() {
                                models.push({ 
                                    ComponentId : Number($(this).val()),
                                    SigmaOperation : "D",
                                }); 
							});
							if(models.length == 0){
								app.component.Confirm.close();
								return false;
							}
							Element.Tools.Multi(
								"/GlobalSettings/SigmaGlobalSettings.svc/rest/Components/Multi",
								models,
								$(self.el), {
								s : function(m, r){
									self.resetmtolist();
									app.component.Confirm.close();
								},
								e : function(m, e){
									self.resetmtolist();
									app.component.Confirm.close();
								}
							});
						},
						function(){ }
					);
				});

				self.resetCat();
				self.resetType();
				self.resetmateriallist();
				self.resetmtolist();
			});
            return this;
		},
		calldrawing : function(){
			var self = this;
			var cwp = $(self.el).find("#slcwp option:selected").text();
			var drawing = $(self.el).find("#sldrawing option:selected").text();
			if(cwp == "" || drawing == ""){
				$(self.el).find("#dsrc").attr("src", "");
				$(self.el).find("#focal").hide();
				return;
			}else{
				$(self.el).find("#focal").show();
			}
			app.component.Call(
				"/ProjectData/SigmaProjectData.svc/rest/DrawingViewer", "POST", 
				JSON.stringify({ CWPName : cwp, DrawingName: drawing }),
				function(d){
						$(self.el).find("#mainimg").attr("src", app.config.docPath.docs+(JSON.parse(d.JsonDataSet)[0]).FilePath.replace(/\\/g, "/"));
						var panzoom = $(".panzoom").panzoom();

						panzoom.parent().on('mousewheel.focal', function( e ) {
							e.preventDefault();
							var delta = e.delta || e.originalEvent.wheelDelta;
							var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
							panzoom.panzoom('zoom', zoomOut, {
								increment: 0.1,
								focal: e
							});
						});

				},null
			);
		},
		initmtocreate : function(){
			var self = this;
			self.nowrow = null;
			$(self.el).find(".materiallist table > tbody > tr").show();
			$(self.el).find("#msearchcontrol").show();
			$(self.el).find(".rightlist").hide();
			$(self.el).find("#top_controls").removeClass("col-sm-12").addClass("col-sm-7");
			$(self.el).find(".leftlist").show();
			self.initBox();
		},
		getMousePos : function(canvas, evt){
			var self = this;
			var rect = self.canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			}
		},
		newcustom : function(){
			var tr = "<div class='form-group userdefine'>";
			tr += "<div class='col-sm-4'><select class='form-control' name='ufield'>";
			tr += "<option value=''>Select Custom Field</option>";
			tr += "<option value='_NEW_'>&lt;&lt;ADD NEW&gt;&gt;</option>";
			_.each(this.customs, function(item){
				tr += "<option value='"+item.CustomFieldId+"'>"+item.FieldName+"</option>";
			});
			tr += "</select><input type='text' class='form-control' name='newcustom' style='display:none;'></div><div class='col-sm-8'>";
			tr += "<div class='input-group'>"
			tr += "<input type='text' class='form-control' name='value'>";
			tr += "<span class='input-group-addon'><input type='checkbox' name='visible'>&nbsp;Visible</span>";
			tr += "<span class='input-group-btn'>";
			tr += "<button class='btn btn-warning' type='button'>Delete</button>";
		  	tr += "</span>";
			tr += "</div>";
			tr += "</div>";
			tr += "</div>";
			return tr;
		},
		rendermtolist : function(){
			var self = this;
			$(self.el).find("#mtolist").html(new app.component.Tablelist({
				list : "../../modules/mto/tpl/tpl_componentlist.html",
				listitem : "../../modules/mto/tpl/tpl_componentlistitem.html",
				coll : "new app.mtolist()",
				base : "#mtolist"
			}).render().el);
		},
		renderlist : function(){
			var self = this;

			$(self.el).find(".rightlist").css("display", "none");
			self.nowrow = null;
			
			var cwpdata = $(self.el).find("#slcwp").val().split("|");
			this.options.query.option="direct";
			var v_discipline= cwpdata[1];
			var v_taskcategory=$(this.el).find("#cboTask option:selected").val();
			var v_tasktype=$(this.el).find("#cboTaskType option:selected").val();
			var v_desc=$(this.el).find("txtDescription").val();
			var param ="";

			if(v_discipline!=undefined && v_discipline !="")
				param += "&DisciplineCode="+v_discipline;
			if(v_taskcategory!=undefined && v_taskcategory !="")
				param += "&TaskCategoryId="+v_taskcategory;
			if(v_tasktype!=undefined && v_tasktype !="")
				param +=  "&TaskTypeId=" + v_tasktype;
			if(v_desc!=undefined && v_desc !="")
				param +=  "&Description=" + v_desc;
			
			this.options.query.directparam = param;
			$(this.el).find(".materiallist").html(new app.component.Tablelist({
				list : "../../modules/mto/tpl/tpl_materiallistformto.html",
				listitem : "../../modules/mto/tpl/tpl_materiallistitemformto.html",
				coll : "new app.materiallist()",
				query : this.options.query,
				all : "Y",
				base : ".materiallist",
				callback : function(){
					$(self.el).find(".materiallist table tr").css("cursor", "pointer");
					$(self.el).find(".materiallist table tr").on("click", function(e){
						if(self.nowrow != this){
							self.nowrow = this;
							$(self.el).find(".materiallist table > tbody >tr").not(this).hide("active");
							$(self.el).find("#msearchcontrol").hide();
							e.preventDefault();
							$(self.el).find(".rightlist").css("display", "");
							self.initBox();
						}
					});
				}
			}).render().el);
		},
		getcomponentcustom : function(){
			var self = this;
			$.ajax({
				type : "GET",
				url : app.config.domain + "/Common/Common.svc/rest/CustomFieldCombo",
				success : function(r){
					self.customs = JSON.parse(r.JsonDataSet);
				}
			});
		},
		initBox : function(){
			var self = this;
			var selectedrow = $(self.nowrow);
			$(self.el).find("#mto_sublist").find("table > tbody > tr").remove();
			$(self.el).find("#mtocreate input").val("");
			$(self.el).find("#mtocreate .userdefine").remove();
			$(self.el).find("#mtocreate span").html("");
			$(self.el).find("#mtocreate #txtManHour").text("0");
			$(self.el).find("#mtocreate #lblDescription").text(selectedrow.find("td[name='desc']").text());
			$(self.el).find("#mtocreate select").val("");
			$(self.el).find("#mtocreate").find("#uomCode").html(selectedrow.find("td[name='uom']").html());
		},
		resetCat : function(){
			var self = this;	
			var cboCat = "";
			if(self.nowDic == ""){
				cboCat = "<select class='form-control'><option value=''>ALL</option></select>";
				self.nowCat="";
				self.resetType();
			}else{
					cboCat = new app.component.Combo({
						url : new app.taskcategorylist().url + self.nowDic,
						inline : true
					}).render().el;
					$(cboCat).on("change", function(){
						self.nowCat = $(this).val();
						self.resetType();
					});
			}
			
			$(this.el).find("#cboTask").html(cboCat);
		},
		resetType : function(){
			var self = this;	
			var cboType = "";
			if(self.nowCat == ""){
				cboType = "<select class='form-control'><option value=''>ALL</option></select>";
			}else{
					cboType = new app.component.Combo({
						url : new app.tasktypelist().url + self.nowCat,
						inline : true
					}).render().el;
					$(cboType).on("change", function(){
						self.nowType = $(this).val();
					});
			}
			$(this.el).find("#cboTaskType").html(cboType);
		},
		resetmateriallist : function(){
		},
		showdrawing : function(){
			var self = this;
			if(self.drawingnumber == null){
				$(self.el).find("#focal").hide();
				return;
			}else{
				$(self.el).find("#focal").show();
			}
		},
		totalmanhour : 0,
		makelistitem : function(item){
			var self = this;
			app.TemplateManager.get("../../modules/mto/tpl/tpl_componentlistitem.html", function(template){
				var li = $("<tr>").append(_.template(template, item.toJSON()));
				if(item.get("FieldInfo") != "" && item.get("FieldInfo") != null){
					var arr = item.get("FieldInfo").split(",");
					var custtext = [];
					_.each(arr, function(cust){
						var arrcust = cust.split("|");
						var col = $(li).find("td[fieldname='"+arrcust[2]+"']");
						if($(col).length > 0){
							$(col).text(arrcust[1]);
						}else{
							custtext.push(arrcust[2]+ " : "+arrcust[1]);
						}
					});
					$(li).find(".customs").text(custtext.join(", "));
					$(li).css("cursor", "pointer");
					$(li).on("click", function(e){
						var $target = $(event.target);
						if(!$target.is('td:first') && !$target.is('input:checkbox') && !$target.is('a')){
							var componentid = $(this).find("input[name=key]").val();
							app.component.Modal.show(new app.componentedit({
								ComponentId : componentid, upload : false
							}), 600);
						}
					});
				}
				self.totalmanhour += parseFloat(item.get("Manhours"));
				$(self.el).find("#mtolist").find("table > tbody:last").append(li);
				$(self.el).find("#mto_controls").html("<b>Total Man Hours: "+self.totalmanhour.toFixed(3)+"</b>");
			});
		},
		link : function(num, tname){
			app.component.Modal.show(new app.componentprogresslist({ 
				componentId : num,
				tagnumber : tname 
			}), 800);
		},
		resetmtolist : function(){
			var self = this;
			if(self.drawingnumber == null){
				$(self.el).find(".mtlist").hide();
				return;
			}else{
				$(self.el).find(".mtlist").show();
				$(self.el).find("#mtolist").html(new app.component.Tablelist({
					list : "../../modules/mto/tpl/tpl_componentlist.html",
					listitem : "../../modules/mto/tpl/tpl_componentlistitem.html",
					coll : "new app.componentlist()",
					base : "#mtolist",
					manual : true,
					keyvalue : self.drawingnumber,
					callback : function(c){
						var m = 0;
						self.totalmanhour = 0;
						_.each(c.models, function(item){
							self.makelistitem(item);
						});
					}
				}).render().el);
			}
		},
		paging : function(num){
			var self = this;
			self.queryformtolist.page = num;
			self.resetmtolist();
		}
	});
	app.componentprogresslist = Element.View.extend({		
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/mto/tpl/tpl_componentprogresslistview.html", function(template){
				$(self.el).html($(template));
				$(self.el).find("#mtolist").find("table > tbody > tr").remove();
				app.component.Call(
					"/GlobalSettings/SigmaGlobalSettings.svc/rest/ComponentProgressStep?ComponentId="+self.options.componentId
					, "GET", "",
					function(d){
						var c = JSON.parse(d.JsonDataSet);
						_.each(c, function(json){
							var li = $("<tr>");
							li.append("<td>"+json.ProgressStep+"</td>");
							li.append("<td class='text-right'>"+json.Weight+"</td>");
							li.append("<td class='text-right'>"+json.Manhours+"</td>");
							li.append("<td>"+(json.CostCode || "")+" "+(json.CostCodeDescription || "")+"</td>");
							$(self.el).find("#mtolist").find("table > tbody:last").append(li);
						});
					}, null);
				$(self.el).find("#tagnumber").html("<strong>Tag Number : " +self.options.tagnumber +"</strong>");
				$(self.el).find("#btnClose").on("click", function(e){
					e.preventDefault();
					app.component.Modal.close();
				});
			});
			return this;
		}
	});
	app.componentedit = Element.View.extend({		
		customs : [],
		com : {},
		mat : {},
		inititalize : function(){ },
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/mto/tpl/tpl_componentedit.html", function(template){
				$(self.el).html($(template));

				$(self.el).find("#btnAdd").on("click", function(e){
					e.preventDefault();
					var form = $(self.el).find("form");
					var newline = $(self.newcustom(""));
					newline.find(".btn-warning").on("click",function(e){
						e.preventDefault();
						$(this).parent().parent().parent().parent().remove();
					});
					newline.find("select").on("change",function(e){
						e.preventDefault();
						var pr = $(this).parent().parent();
						if($(this).find("option:selected").val() == "_NEW_"){
							pr.find("input[name='newcustom']").show();
							pr.find("select").hide();
							pr.find("input[name='newcustom']").focus();
						}
					});
					form.append(newline);
				});

				app.component.Call(
					"/ProjectData/SigmaProjectData.svc/rest/MTOs/"+self.options.ComponentId, "GET", "",
					function(d){
						var data = JSON.parse(d.JsonDataSet)[0];
						self.com = data.paramObj;
						self.mat = data.paramObj2;
						self.getUOMName();

						app.component.Call(
							"/Common/Common.svc/rest/CustomFieldCombo", "GET", "",
							function(c){
								self.customs = JSON.parse(c.JsonDataSet);
								self.setCustom();
						}, null);

						$(self.el).find("#txtQuantity").val(self.com.Qty);
						$(self.el).find("#lblDescription").text(self.mat.Description);
						$(self.el).find("#txtManHour").text(self.com.EstimatedManhour);
						$(self.el).find("#txtEngTag").val(self.com.EngTagNumber);
						$(self.el).find("#lblDescription").text(self.mat.Description);
					}, null
				);

				$(self.el).find("#txtQuantity").on("keydown", function(e){
					if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
						(e.keyCode == 65 && e.ctrlKey === true) || 
						(e.keyCode >= 35 && e.keyCode <= 39)) {
							 return;
					}
					if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
						e.preventDefault();
					}
				});

				$(self.el).find("#txtQuantity").on("keyup", function(e){
					var mnh = self.mat.Manhours;
					if(mnh != ""){
						$(self.el).find("form").find("#txtManHour")
							.html(mnh * $(self.el).find("#txtQuantity").val());
					}else{
						$(self.el).find("form").find("#txtManHour").html(0);
					}
				});

				$(self.el).find("#btnMTOCancel").on("click",function(e){				
					app.component.Modal.close();
				});

				$(self.el).find("#btnSave").on("click",function(e){				
					e.preventDefault();
					var list = [];
					_.each($(self.el).find("form .userdefine"), function(tr){
						var tmp = $(tr).find("select[name='ufield']").val();
						var visible = $(tr).find("input[name='visible']").is(":checked");
						var j = new app.componentcustom({
							SigmaOperation : "C",
							ComponentId : self.com.ComponentId,
							CustomFieldId : Number(tmp),
							Value : $(tr).find("input[name='value']").val(),
							IsDisplayable : (visible) ? "Y" : "N"
						});
						list.push(j.toJSON());
					});
					list.push({
						SigmaOperation : "C",
						ComponentId : self.com.ComponentId,
						CustomFieldId : 0,
						FieldName : "StructureNumber",
						Value : $(self.el).find("#txtFoundationNum").val(),
						IsDisplayable : "Y"
					});
					self.com.Qty = Number($(self.el).find("#txtQuantity").val());
					self.com.Description = $(self.el).find("#lblDescription").text();
					self.com.EngTagNumber = $(self.el).find("#txtEngTag").val();
					self.com.ComCustomField = list;
					$.ajax({
						contentType : 'application/json',
						data : JSON.stringify({ paramObj : self.com, paramObj2 : self.mat }),
						url : "/ProjectData/SigmaProjectData.svc/rest/SaveMTOs",
						type : "PUT",
						success : function(data){
							ThisViewPage.resetmtolist();
							app.component.Modal.close();
						},
						error : function(data){
							Element.Tools.Error(data.ErrorMessage);
							app.component.Modal.close();
						}
					});
				});
			});

			return this;
		},
		setCustom : function(){
			var self = this;
			_.each(self.com.ComCustomField, function(item){
				var name = item.FieldName.replace(/ /g, "");
				var dom = $(self.el).find("."+name);
				if(dom.length > 0){
					L(item.Value);
					$(dom[0]).find("input").val(item.Value);
				}else{
					L(item);
					var form = $(self.el).find("form");
					var newline = $(self.newcustom(item));
					newline.find(".btn-warning").on("click",function(e){
						e.preventDefault();
						$(this).parent().parent().parent().parent().remove();
					});
					newline.find("select").on("change",function(e){
						e.preventDefault();
						var pr = $(this).parent().parent();
						if($(this).find("option:selected").val() == "_NEW_"){
							pr.find("input[name='newcustom']").show();
							pr.find("select").hide();
							pr.find("input[name='newcustom']").focus();
						}
					});
					form.append(newline);
				}
			});
		},
		getUOMName : function(){
			var self = this;
			app.component.Call(
				"/Common/Common.svc/rest/UomCombo", "GET", "",
				function(d){
					_.each(JSON.parse(d.JsonDataSet), function(item){
						if(item.Code == self.mat.UomCode){
							$(self.el).find("#uomCode").text(item.CodeShortName);
						}
					});
				},null
			);
		},
		newcustom : function(saved){
			var tr = "<div class='form-group userdefine'>";
			tr += "<div class='col-sm-4'><select class='form-control' name='ufield'>";
			tr += "<option value=''>Select Custom Field</option>";
			tr += "<option value='_NEW_'>&lt;&lt;ADD NEW&gt;&gt;</option>";
			_.each(this.customs, function(item){
				if(saved != ""){
					if(saved.CustomFieldId == item.CustomFieldId){
						tr += "<option value='"+item.CustomFieldId+"' selected>"+item.FieldName+"</option>";
					}else{
						tr += "<option value='"+item.CustomFieldId+"'>"+item.FieldName+"</option>";
					}
				}else{
					tr += "<option value='"+item.CustomFieldId+"'>"+item.FieldName+"</option>";
				}
			});
			tr += "</select><input type='text' class='form-control' name='newcustom' style='display:none;'></div><div class='col-sm-8'>";
			tr += "<div class='input-group'>"
			if(saved != ""){
				tr += "<input type='text' class='form-control' name='value' value='"+saved.Value+"'>";
				tr += "<span class='input-group-addon'><input type='checkbox' name='visible' "+((saved.IsDisplayable == "Y") ? " checked " : "")+">&nbsp;Visible</span>";
			}else{
				tr += "<input type='text' class='form-control' name='value'>";
				tr += "<span class='input-group-addon'><input type='checkbox' name='visible'>&nbsp;Visible</span>";
			}
			tr += "<span class='input-group-btn'>";
			tr += "<button class='btn btn-warning' type='button'>Delete</button>";
		  	tr += "</span>";
			tr += "</div>";
			tr += "</div>";
			tr += "</div>";
			return tr;
		},
	});
})(jQuery);
