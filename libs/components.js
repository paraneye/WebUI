/*
Written by hitapia(sbang).
Role : Components
*/
var app = app || {};
(function($){
    app.component = {
		Tablelist : Element.View.extend({
            render : function(){
				var self = this;
				app.TemplateManager.get(this.options.list, function(tpl){
					$(self.el).html(tpl);
					var cols = $(tpl).find("th").length;
					
					self.collection = eval(self.options.coll);
					var geturl = self.collection.url;
					var objname = "#list";
					var all = false;
					var manual = false;
					var keyvalue = "";
					var ajaxpaging = false;
					if(self.options.hasOwnProperty("kind"))
						self.collection.url = geturl + "/" + self.options.kind;

					if(self.options.hasOwnProperty("manual"))
						manual = self.options.manual;
				
					if(self.options.hasOwnProperty("keyvalue"))
						self.collection.url += "/" + self.options.keyvalue;

					if(self.options.hasOwnProperty("ajaxpaging"))
						ajaxpaging = true;

					if(self.options.hasOwnProperty("base"))
						objname = self.options.base;
					
					app.config.paging.itemperpage = 10;
					if(self.options.hasOwnProperty("all")){
						if(self.options.all == "Y"){
							all = true;
							app.config.paging.itemperpage = 1000000;
						}
					}
					
					if (self.options.hasOwnProperty("query")) {
						if(self.options.query.o_val == "" && self.options.query.o_val == ""){
							//default
							_.each($(self.el).find(".orders"), function(th){
								if($(th).hasClass("asc") || $(th).hasClass("desc")){
									self.options.query.o_val = ($(th).hasClass("desc")) ? "desc" : "asc";
									self.options.query.o_opt = $(th).attr("order");
									$(th).addClass("ordered");
								}
							});
						} else {
							$(self.el).find(".orders").removeClass("desc").removeClass("asc");
							$(self.el).find("th[order='"+self.options.query.o_opt+"']").
								addClass(self.options.query.o_val).
								addClass("ordered");
						}
						if(self.options.query){
							geturl = self.collection.url;
							self.collection.url = geturl + Element.Tools.RESTGet(self.options.query);
						}
					}
					$(objname).find("table > tbody:last").append("<tr class='loadingline' style='height:200px;text-align:center;'><td colspan='"+cols+"' style='vertical-align:middle;'>Loading...</td></tr>");

					var updown = $(self.el).find(".ordered").hasClass("desc") ? "down" : "up";
					$(self.el).find(".ordered")
						.append("<span class='glyphicon glyphicon-chevron-"+updown+" pull-right'></span>");

					app.component.LoadingData(true);
					self.collection.fetch({
						success : _.bind(function(collection, data){
		                    var totalitem = data.ScalarValue;
							self.collection = collection;
							$(objname).find(".loadingline").remove();
							if(self.collection.models.length > 0){
								if(!manual){
									_(self.collection.models).each(function(item){
										$(objname).find("table > tbody:last").append(
											new app.component.Tablelistitem( { 
												model : item, listitem : self.options.listitem
											}).render().el
										);
									});
								}
								if($(objname).find("thead .t_check").html() == ""){
									$(objname).find("thead .t_check").html("<input type='checkbox' name='allchk'>");
									$(objname).find("thead .t_check input[name=allchk]").on("click", function(e){
										L($(this).is(":checked"));
										$(objname).find("tbody > tr > td:first-child > input[type=checkbox]:not(:disabled)").prop("checked", $(this).is(":checked"));

									});
								}
							}else{
								$(objname).find("table > tbody:last").append("<tr class='loadingline' style='height:200px;text-align:center;'><td colspan='"+cols+"' style='vertical-align:middle;'>No Records</td></tr>");
								L($(objname).find("table > tbody:last"));
							}
							if(self.options.query && !all){
								$(self.el).append("<div id='paging'/>");
								app.component.Paging.render($(ThisViewPage.el).find("#paging"), totalitem, self.options.query, ajaxpaging);
								$(self.el).find("#paging ul").prepend("<li><a class='onlyinfo'>Total : " + totalitem + "</a></li>");
							}
							if(self.options.hasOwnProperty("callback")){
								self.options.callback(self.collection);
							}
							$(self.el).find(".orders").on("click", function(e){
								e.preventDefault();
								if($(this).hasClass("desc") || $(this).hasClass("asc")){
									if($(this).hasClass("desc")){
										$(this).removeClass("desc").addClass("asc");
									}else{
										$(this).removeClass("asc").addClass("desc");
									}
								}else{
									$(self.el).find(".orders").removeClass("desc").removeClass("asc");
									$(this).addClass("desc");
								}
								self.options.query.o_val = ($(this).hasClass("desc")) ? "desc" : "asc";
								self.options.query.o_opt = $(this).attr("order");
								window.location =  Element.Tools.GetPageName() + Element.Tools.QueryGen(self.options.query, "page", self.options.query.page); 
							});
							if(!self.options.hasOwnProperty("nostriped"))
								$(objname).find("table").addClass("table-striped");
							app.component.LoadingData(false);
						},self),
						error : function(collection, response, options){
							app.component.LoadingData(false);
							$(objname).find(".loadingline").remove();
						}
					});
				});
            	return this;
            }
        }),
		Tablelistitem : Element.View.extend({
			tagName : "tr",
			render : function(){
				var self = this;
				app.TemplateManager.get(this.options.listitem, function(template){
					$(self.el).html(_.template(template, self.model.toJSON()));
				});
            	return this;
			}
		}),
        Paging : {
            render : function(control, totalitem, options, ajax) {
				var nowpage = options.page;
        		control.bootstrapPaginator({
            		currentPage: options.page,
            		totalPages: Math.ceil(totalitem / app.config.paging.itemperpage),
            		pageUrl: function(type, page, current){ 
						if(ajax){
							return "javascript:Element.Tools.Paging("+page+")"; 
						}else{
							return Element.Tools.GetPageName() + Element.Tools.QueryGen(options, "page", page);
						}
					}
				});
				options.page = nowpage;
				control.removeClass("pagination");
				control.find("ul").addClass("pagination");
				control.find(".pagination .active a").removeAttr("href");
				control.find(".pagination .active a").unbind();
            }
        },
		SearchControl : Element.View.extend({
			render : function(){
				var self = this;
				app.TemplateManager.get(app.config.path + "/common/tpl/tpl_searchcontrol.html", function(tpl){
					$(self.el).html(tpl).addClass("pull-right");
					for(i = 0; i < self.options.options.length; i++){
						var opt = "<option value='"+self.options.options[i].Value+"' ";
						if(self.options.query.s_opt == self.options.options[i].Value)
							opt += " selected ";
						opt += ">" + self.options.options[i].Name + "</option>";
						$(self.el).find("#s_opt").append(opt);
					}
					$(self.el).find("input[name='s_val']").val(self.options.query.s_val);
					$(self.el).find("#btnsearch").click(function(e){
						e.preventDefault();
						self.search();
					});
				});
            	return this;
			},
			search : function(){
				var self = this;
				self.options.query.page = 1;
				app.router.navigate(Element.Tools.GetPageName() + Element.Tools.QueryGens(
					self.options.query, "s_opt", $(self.el).find("#s_opt").val(), 
					"s_val", $(self.el).find("#s_val").val()
				), { trigger : true });
			}
		}),
        InlineList : Element.View.extend({
            tagName : "ul",
            className : "list-group",
            render : function(){
                var self = this;
                this.collection = new app.keyvalues();
                this.collection.url = this.options.url;
                this.collection.fetch({
                    success : _.bind(function(collection){
                        this.collection = collection;
                        _(this.collection.models).each( function(item){
                            $(self.el)
                                .append("<a href='"+self.options.linkName+item.get("Value")+"' class='list-group-item'>"+item.get("Name")+"</a>");
                        }, this);
                    })
                });
                return this;
            }
        }),
        Combo : Element.View.extend({
            tagName : "select",
            className : "form-control",
            render : function(){
				app.component.LoadingData(true);
                var self = this;
                this.collection = new app.keyvalues();
                this.collection.url = this.options.url;
                this.collection.fetch({
                    success : _.bind(function(collection){
                        this.collection = collection;
						if(self.options.hasOwnProperty("selname")){
						$(self.el).append("<option value=''>"+((self.options.selname != "") ? self.options.selname : "ALL")+"</option>");
						}else{
							$(self.el).append("<option value=''>ALL</option>");
						}
								
                        _(this.collection.models).each( function(item){
							var id = "";
							var name = "";
							var selected = "";
							for (var prop in item.attributes) { name = prop; }
							for (var prop in item.attributes) { if( name == prop) continue; id = prop; }
							if(self.options.hasOwnProperty("selected")){
								if(self.options.selected != ""){
									if(self.options.selected == item.get(id))
										selected = " selected " ;
								}
							}
							$(self.el)
								.append("<option value='"+item.get(id)+"' "+selected+">"+item.get(name)+"</option>");
                        }, this);
						app.component.LoadingData(false);
                    })
                });
                return this;
            }
        }),
        Checkbox : Element.View.extend({
            render : function(){
                var self = this;
                this.collection = new app.keyvalues();
                this.collection.url = this.options.url;
                this.collection.fetch({
                    success : _.bind(function(collection){
                        this.collection = collection;
                        _(this.collection.models).each( function(item){
							var id = "";
							var name = "";
							var selected = "";
							for (var prop in item.attributes) { name = prop; }
							for (var prop in item.attributes) { if( name == prop) continue; id = prop; }
							if(self.options.hasOwnProperty("selected")){
								if(self.options.selected != ""){
									_.each(self.options.selected, function(c){
										if(c == item.get(id)){
											selected = " selected ";
										}
									});
								}
							}

                            var className = (self.options.inline) ? "checkbox-inline" : "checkbox";
                            $(self.el)
                                .append("<label class='"+className+"'><input type='checkbox' value='"+item.get(id)+"' "+selected+">"+item.get(name)+"</label>");


                        }, this);
                    })
                });
                return this;
            }
        }),
        Radio : Element.View.extend({
            render : function(){
                var self = this;
                this.collection = new app.keyvalues();
                this.collection.url = this.options.url;
                this.collection.fetch({
                    success : _.bind(function(collection){
                        this.collection = collection;
                        _(this.collection.models).each( function(item){
                            var className = (self.options.inline) ? "radio-inline" : "radio";
                            $(self.el)
                                .append("<label class='"+className+"'><input type='radio' name='"+self.options.name+"' value='"+item.get("Value")+"'>"+item.get("Name")+"</label>");
                        }, this);
                    })
                });
                return this;
            }
        }),
        Confirm : {
			options : { COMMENT : "Are you sure you want to delete the selected item(s)?", POS : "Delete", NAG : "Cancel" },
			succesCallback : null,
			errorCallback : null,
            template : "/common/tpl/tpl_poplayer.html",
            show: function(options, success, error){
                var self = this;
                app.TemplateManager.get(app.config.path + this.template, function(template){
					var popwidth = 520; 
                    $("body").append(template);
                    $('.layer').show();
					$("#poplayer").append("<div style='padding:0px;'></div>");
                    $("#poplayer").css('margin-top', '-250px');
                    $("#poplayer").css('margin-left', '-'+popwidth/2+'px');
                    $("#poplayer").css('width', popwidth+'px');
					$("#poplayer").css("position", "absolute");
					$("#poplayer").css("border", "2px solid #d9534f");
					//$("#poplayer").draggable({ handle: "h2" });					
					self.render(options, success, error);
                });
            },
			render : function(options, success, error){
				var self = this;
				app.TemplateManager.get(app.config.path + "/common/tpl/tpl_confirm.html", function(template){
					if(options.POS == "OK")
						options.POS = "Delete";
					$("#poplayer > div").html(_.template(template, options));
					$("#poplayer > div").find("#btnOk").on("click", function(e){
						e.preventDefault();
						success();
					});
					$("#poplayer > div").find("#btnCancel").on("click", function(e){
						e.preventDefault();						
						self.close();
					});
				});
			},
            close : function(){
                $('.layer').hide();
                $('.layer').remove();
            }
        },
		Alert : {
			options : { COMMENT : "", POS : "Submit", NAG : "Cancel" },
			succesCallback : null,
			errorCallback : null,
            template : "/common/tpl/tpl_poplayer.html",
            show: function(options, success, error){
                var self = this;
                app.TemplateManager.get(app.config.path + this.template, function(template){
					var popwidth = 520; 
                    $("body").append(template);
                    $('.layer').show();
					$("#poplayer").append("<div style='padding:0px;'></div>");
                    $("#poplayer").css('margin-top', '-150px');
                    $("#poplayer").css('margin-left', '-'+popwidth/2+'px');
                    $("#poplayer").css('width', popwidth+'px');
					$("#poplayer").css("position", "absolute");
					$("#poplayer").css("border", "2px solid #333");
					//$("#poplayer").draggable({ handle: "h2" });					
					self.render(options, success, error);
                });
            },
			render : function(options, success, error){
				var self = this;
				app.TemplateManager.get(app.config.path + "/common/tpl/tpl_alter.html", function(template){
					if(options.POS == "OK")
						options.POS = "Submit";
					$("#poplayer div").html(_.template(template, options));					
					$("#poplayer > div").find("#btnOk").on("click", function(e){
						e.preventDefault();
						success();
					});
					$("#poplayer > div").find("#btnCancel").on("click", function(e){
						e.preventDefault();						
						self.close();
					});
				});
			},
            close : function(){
                $('.layer').hide();
                $('.layer').remove();
            }
        },
        Modal : {
            template : "/common/tpl/tpl_poplayer.html",
			showhtml : function(source, popwidth){
                app.TemplateManager.get(app.config.path + this.template, function(template){
                    $("body").append($(template));
                    $('.layer').show();
                    $("#poplayer").html(source);
                    $("#poplayer").addClass("help-wrap layer_area");
                    $("#poplayer").css('top', '50px');
                    $("#poplayer").css('margin-left', '-'+popwidth/2+'px');
                    $("#poplayer").css('width', popwidth+'px');
					$("#poplayer").draggable({ handle: ".title" });
					$("#poplayer").find(".help-pop-close").on("click", function(e){
						e.preventDefault();
						$('.layer').hide();
						$('.layer').remove();
					});
                });
			},
            show: function(view, popwith) {
				ThisPopViewPage = view;
                app.TemplateManager.get(app.config.path + this.template, function(template){
                    $("body").append($(template));
                    $('.layer').show();
                    $("#poplayer").html(view.render().el);
                    $("#poplayer").css('top', '50px');
                    $("#poplayer").css('margin-left', '-'+popwith/2+'px');
                    $("#poplayer").css('width', popwith+'px');
                    $("#poplayer").css('border', "1px solid #285e8e");
					$("#poplayer").draggable({ handle: "h2" });
                });
            },
            close : function(){
				ThisPopViewPage.remove();
				ThisPopViewPage = null;
                $('.layer').hide();
                $('.layer').remove();
            }
        },
        ButtonGroup : Element.View.extend({
			className : "btn-group",
			render : function(){
				var self = this;
				_(this.options.buttons).each(function(btn){
					btn.class = btn.class || "default";
					if(btn.hasOwnProperty("buttons")){
						var div = $("<div>").addClass("btn-group");
						var newbtn = $("<button class='btn btn-"+btn.class+"' id='"+btn.Id+"'>"+btn.Name+" <span class='caret'></span></button>")
							.addClass("dropdown-toggle").attr("data-toggle", "dropdown");
						div.append(newbtn);

						var ul = $("<ul>").addClass("dropdown-menu").attr("role", "menu");
						_.each(btn.buttons, function(subbtn){
							var li = $("<li id='"+subbtn.Id+"'><a>"+subbtn.Name+"</a></li>");
							ul.append(li);
							if(subbtn.hasOwnProperty("link"))
								li.find("a").attr("href", subbtn.link);
						});
						div.append(ul);
						$(self.el).append(div);
						div.on("click", function(e){
							$(self.el).find("div").not(this).removeClass("open"); 
							
							if(div.hasClass("open") > 0){ 
								div.removeClass("open"); 
							}else{ 
								div.addClass("open"); 
							}

							
						});
					}else{
						$(self.el).append("<button class='btn btn-"+btn.class+"' id='"+btn.Id+"'>"+btn.Name+"</button>");
					}
				});
				if(this.options.isright)
					$(this.el).addClass("pull-right");

				return this;
			}
        }),
		LoadingData : function(bl, kind){
			var updown = (kind) ? "cloud-upload" : "cloud-download";
			if(bl){
				app.caller++;
				if(ThisPopViewPage != null){
					$(ThisPopViewPage.el).find("form input").not(".disable").attr("disabled", true);
					$(ThisPopViewPage.el).find("form textarea").not(".disable").attr("disabled", true);
					$(ThisPopViewPage.el).find("button").not('.async').attr("disabled", true);
					$(ThisPopViewPage.el).find("form select").not(".disable").attr("disabled", true);
					if($(ThisPopViewPage.el).find("h2 > span").length == 0){
						$(ThisPopViewPage.el).find("h2")
							.append("<span class='glyphicon glyphicon-"+updown+" pull-right'></span>");
						setInterval(function(){
							 $("#poplayer h2 > span").fadeIn(1000).fadeOut(1000);
						},0);
					}
				}else{
					$(ThisViewPage.el).find("form input").not(".disable").attr("disabled", true);
					$(ThisViewPage.el).find("form textarea").not(".disable").attr("disabled", true);
					$(ThisViewPage.el).find("button").not(".disable").attr("disabled", true);
					$(ThisViewPage.el).find("form select").not(".disable").attr("disabled", true);
					if($(".title_wrap h2 span").length == 0)
						$(".title_wrap h2").append("<span style='margin-left:10px;line-height:0' class='glyphicon glyphicon-"+updown+"'></span>");
						setInterval(function(){
							 $(".title_wrap h2 > span").fadeIn(1000).fadeOut(1000);
						},0);
				}
				return;
			}else{
				app.caller--;
				if(app.caller == 0){
					if(ThisPopViewPage != null){
						if($(ThisPopViewPage.el).find("#poplayer h2 > span").length == 0){
							$(ThisPopViewPage.el).find("#poplayer h2 > span").remove();
						}
					}
					$("#poplayer h2 > span").remove();
					$("body form input").not(".disable").attr("disabled", false);
					$("body form textarea").not(".disable").attr("disabled", false);
					$("body button").not(".disable").attr("disabled", false);
					$("body form select").not(".disable").attr("disabled", false);
					$(".title_wrap h2 span").remove();
					$("body form input[autofocus], body form select[autofocus]").focus();
					if(ThisPopViewPage != null){
						$(ThisPopViewPage.el).find("form input").not(".disable").attr("disabled", false);
						$(ThisPopViewPage.el).find("form textarea").not(".disable").attr("disabled", false);
						$(ThisPopViewPage.el).find("button").not(".disable").attr("disabled", false);
						$(ThisPopViewPage.el).find("form select").not(".disable").attr("disabled", false);
					}
				}
			}
		},
        Call :function(url, method, data, s_callback, e_callback, kind, options) {
			app.component.LoadingData(true, kind);
			var self = this;
			var autoclose = true;
			if(options){
				if(options.hasOwnProperty("autoclosewhenerror"))
					this.autoclose = options.autoclosewhenerror;
			}
            $.ajax({
                url : url,
				contentType : 'application/json',
                type : method,
				cache: false,
                data : data,
                success : function(data){
					if(!data.IsSuccessful && self.autoclose)
						Element.Tools.Error(data.ErrorMessage);

					app.component.LoadingData(false, kind);
                    s_callback(data);
                },
                error : function(data){
					app.component.LoadingData(false, kind);
					if(self.autoclose)
						Element.Tools.Error(data.ErrorMessage);
                    e_callback(data);
                }
            });
        },
        FileUpload : Element.View.extend({
			className : "",
			render : function(){
				$(this.el).append("<input class='form-control' type='file' id='"+this.options.IdName+"'>"+this.options.description);
				return this;
			},
            upload : function(callback) {
				var fd = new FormData();
				fd.append('file',  $("#"+this.options.IdName));
				app.component.LoadingData(true);
				$.ajax({
					url : this.options.url,
					type : "POST",
					processData: false,
					contentType: false,
					data : fd,
					success : function(data){
						app.component.LoadingData(false);
						callback(data);
					},
					error : function(data){
						app.component.LoadingData(false);
						Element.Tools.Error(data);
					}
				});
            }
        })
    }
})(jQuery);
