/*
Written by hitapia(sbang)
Role : base model, collection, view
*/
var app = app || {};
Backbone.Model.prototype.setByName = function(key, value, options) { 
    var setter = {}; 
    setter[key] = value; 
    this.set(setter, options); 
};
Element.View = Backbone.View.extend({
    page : {
        title : "" 
    },
    url : "",
    dev : false,
	render : function(){ }
});
Element.Model = Backbone.Model.extend({
	idAttribute : "",
	test : "",
	apply : function(dom, type, options){
		app.component.LoadingData(true);
		$.ajax({ 
			url : this.urlRoot,
			data : JSON.stringify({ paramObj : this.toJSON() }),
			dataType : "json",
			contentType : 'application/json',
			type : type,
			success : function(response){
				app.component.LoadingData(false);
				if(response.IsSuccessful) {
					options.s(null, response);
				}else{
					Element.Tools.Error(response.ErrorMessage);
					options.e(null, response.ErrorMessage);
				}
			},
			error : function(xhr, errorText, errorCode){
				app.component.LoadingData(false);
				Element.Tools.Error(errorText);
				options.e(xhr, errorText);
			}	
		});
	},
	parse : function(data){
		if(app.config.debug)
			app.Debug("Model Parse", JSON.stringify(data));

		if(data.IsSuccessful){
			return JSON.parse(data.JsonDataSet)[0];
		}else{
			Element.Tools.Error(data.ErrorMessage);
			return null;
		}
	},
	render : function(){ }
});
Element.Collection = Backbone.Collection.extend({
	parse : function(data){
		if(app.config.debug)
			app.Debug("Collection Fetch & Parse ( " +this.url+ " ) ", JSON.stringify(data));

		if(data.IsSuccessful){
			return JSON.parse(data.JsonDataSet);
		}else{
			return null;
		}
	},
	render : function(){ }
});
var ThisViewPage = null;
var ThisPopViewPage = null;
Element.Router = Backbone.Router.extend({
	header : null,
	unsignedheader : null,
	subheader : null,
	contenttop : null,
	dir : "",
	initialize : function(){
		app.GetLoginInfo();
	},
	setbasefordev : function(){
		var self = this;
		$("#header").remove();
		$("#subheader").remove();
		$(".sga_container").remove();
		$("#contenttop").html("<div class='title_wrap'><h2>Dev Site</h2></div>");
	},
	setbase : function(){
		var self = this;
		if(Element.Tools.GetCookie("logininfo")){
			//signed page
			self.header = self.header || new app.header();
			self.subheader = self.subheader || new app.subheader();
			self.contenttop = self.contenttop || new app.content_top();
		
			$("#header").html(self.header.render().el);
			$("#contenttop").html(self.contenttop.render().el);
			if(app.loggeduser.ProjectList != null){
				$("#subheader").html(self.subheader.render().el);
				$(".sga_container").css("margin-top", "0px;");
			}else{
				$(".sga_container").css("margin-top", "-30px;");
				$("#subheader").hide();
			}
		}else{
			//un-signed page
			self.unsignedheader = self.unsignedheader || new app.unsignedheader();
			$(".sga_header").html(self.unsignedheader.render().el);
			$("body").css("background", "#093a60");
		}

		app.Nav();
	},
	switchview : function(view, isdev){
		app.caller = 0;
		if(!view.options.anony){
			if(!app.CheckLogged()){
				app.Logout();
			}
		}

		if(ThisViewPage){
			ThisViewPage.remove();
		}
	
		ThisViewPage = view;
		if(isdev){
			this.setbasefordev();
		}else{
			this.setbase();
		}
		this.baserender();
		$("#container").html(view.render().el);
	
		if(app.loggeduser.Id != ""){
			app.GetLoginInfo();
		}
	},
	options : function(params){
		var value = { page : 1, s_opt : "", s_val : "", o_opt : "", o_val : "" };
		if(params == null)
			return value;
		var conditions = params.split('&');
		_(conditions).each(function(condition) {
			condition = condition.split('=');
			switch(condition[0]){
				case "page" : 
					value.page = condition[1];
					break;
				case "s_opt" :
				   	value.s_opt = condition[1];
					break;
				case "s_val" :
				   	value.s_val = condition[1];
					break;
				case "o_opt" :
				   	value.o_opt = condition[1];
					break;
				case "o_val" :
				   	value.o_val = condition[1];
				   	break;
                default:
                    value[condition[0]] = condition[1];
                    break;
			}
		});
		return value;
	}
});

Element.Tools = {
	Paging : function(key){
		ThisViewPage.paging(key);
	},
	LinkClick: function (key) {
	    // ThisViewPage.link(key);
	    ThisViewPage.link.apply(this, arguments); // modified by bk to accept multiple keys from LinkClick.
	},
	GetPageName : function(){
		var tmp = location.href.split("#");
		var linknameinfo = ("#" + tmp[1]).split("?");
		var linkname = linknameinfo[0];
		return linkname;
	},
	MakeNav : function(obj, el){
		var per = (obj.length == 5) ? "20" : "32";
		$(el).find("li").remove();
		_.each(obj, function(menu){
			var m = $("<li>").css("width", per+"%");
			if(menu.menus.length > 0){
				m.append("<a href\"javascript:Element.Tools.GoLink('', 'NOLINK');\"><i class='menu-title'>"+menu.Name+"</a>");
				m.append("<i class='fa fa-plus'></i><em></em>");
				m.append("<ul>");
				_.each(menu.menus, function(submenu){
					if(submenu.Icon != ""){
						m.find("ul").append("<li><a href=\"javascript:Element.Tools.GoLink('"+submenu.Name+"', '"+submenu.Link+"');\"><i class='"+submenu.Icon+"'></i><span>"+submenu.Name+"</span></a></li>");
					}else{
						m.find("ul").append("<li><a href=\"javascript:Element.Tools.GoLink('"+submenu.Name+"', '"+submenu.Link+"');\"><span>"+submenu.Name+"</span></a></li>");
					}
				});
			}else{
				if(menu.Link  != "" ){
					m.append("<a href=\"javascript:Element.Tools.GoLink('"+menu.Name+"', '"+menu.Link+"');\"><i class='menu-title'>"+menu.Name+"</a>");
					m.append("<i class='fa fa-minus'></i><em></em>");
				}else{
					m.append("<a href\"javascript:Element.Tools.GoLink('', 'NOLINK');\"><i class='menu-title'>"+menu.Name+"</a>");
					m.append("<i class='fa fa-minus'></i><em></em>");
				}
			}
			el.append(m);
		});
	},
	GoLink : function(name, link){
		switch(link){
			case "UNDER" :
				Element.Tools.Error("This page is under construction", "info");
				break;
			case "NOLINK" :
				break;
			default : 
				Element.Tools.SetCookie("pagename", name);
				window.location.href = link;
		}
	},
	QueryGens : function(query, opt1 , val1, opt2, val2){
		var v = [];
		if(query.page) v.push("page="+query.page);
		switch(opt1){
			case "page" : query.page = val1; break;
			case "s_opt" : query.s_opt = val1; break;
			case "s_val" : query.s_val = val1; break;
			case "o_opt" : query.o_opt = val1; break;
			case "o_val" : query.o_val = val1; break;
		}
		switch(opt2){
			case "page" : query.page = val2; break;
			case "s_opt" : query.s_opt = val2; break;
			case "s_val" : query.s_val = val2; break;
			case "o_opt" : query.o_opt = val2; break;
			case "o_val" : query.o_val = val2; break;
		}
		if(query.s_val){ v.push("s_opt="+query.s_opt); v.push("s_val="+query.s_val); }
		if(query.o_val){ v.push("o_opt="+query.o_opt); v.push("o_val="+query.o_val); }
		for (k in query) {
			if(k != "page" && k != "s_opt" && k != "s_val" && k != "o_opt" && k != "o_val" && k != "offset" && k != "max"){
				v.push(k+"="+query[k]);
			}
		}
		L(v);
		return (v.length > 0) ? "?" + v.join("&") : "";
	},
	QueryGen : function(query, opt , val){
		var v = [];
		for (k in query) {
			if(k != "page" && k != "s_opt" && k != "s_val" && k != "o_opt" && k != "o_val" && k != "offset" && k != "max"){
				v.push(k+"="+query[k]);
			}
		}
		switch(opt){
			case "page" : query.page = val; break;
			case "s_opt" : query.s_opt = val; break;
			case "s_val" : query.s_val = val; break;
			case "o_opt" : query.o_opt = val; break;
			case "o_val" : query.o_val = val; break;
		}
		if(query.page) v.push("page="+query.page);
		if(query.s_val){
			v.push("s_opt="+query.s_opt);
			v.push("s_val="+query.s_val);
		}
		if(query.o_val){
			v.push("o_opt="+query.o_opt);
			v.push("o_val="+query.o_val);
		}
		return (v.length > 0) ? "?" + v.join("&") : "";
	},
	Validate : function(form){
		var s = true;
		_.each($(form).find(".required"), function(item){
			$(item).parent().parent().removeClass("has-error");
			$(item).parent().parent().find(".text-danger").remove();
			
		});
		_.each($(form).find(".d_file"), function(item){
			$(item).parent().find(".error_cmd").remove();
			$(item).parent().parent().removeClass("has-error");
		});
		
		_.each($(form).find(".required"), function(item){
			if($(item).val() == "" && s){
				$(item).parent().parent().addClass("has-error");
				$(item).focus();
				s = false;
			}
		});
		_.each($(form).find(".d_file"), function(item){
		
			if($(item)[0].value != ""){
			var msg="";
			var file = $(item)[0].value;

					if(!$(item).hasOwnProperty("regexp")){
						var v_regexp = $(item).attr("regexp");
						
						if(file.match(eval(v_regexp))==null){	
							s = false;								
							if(!$(item).hasOwnProperty("msg")){
								msg = $(item).attr("msg");
							}

						}
					}
					if(!$(item).hasOwnProperty("size")){
						var v_size = $(item).attr("size");
						var v_current_size = $(item)[0].files[0].size;
						var v_size_kb= Math.round(v_current_size/1024);
						if(v_size_kb > v_size){						
							s = false;
							msg = "Current File Size : "+ v_size_kb + "(KB) ";	
						}
					}
					if(msg.length > 0){					
						$(item).parent().parent().addClass("has-error");
						$(item).focus();						
						$(item).after("<div class='text-danger error_cmd'>"+msg+"</div>");
						
					}
			}
			
		});
		_.each($(form).find(".d_number"), function(item){			
			if($(item).val() != "" && $(item).val().match(/^[-]?\d+(?:[.]\d+)?$/)==null){
				$(item).parent().parent().addClass("has-error");
				$(item).focus();
				s = false;
			}
		});
		_.each($(form).find(".d_email"), function(item){			
			if($(item).val() != "" && $(item).val().match(/^[\w]{4,}@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)==null){
				$(item).parent().parent().addClass("has-error");
				$(item).focus();
				s = false;
			}
		});
		_.each($(form).find(".d_phone"), function(item){			
			if($(item).val() != "" && $(item).val().match(/^[0-9|-]*$/)==null){
				$(item).parent().parent().addClass("has-error");
				$(item).focus();
				s = false;
			}
		});
		_.each($(form).find(".d_code"), function(item){		
			if($(item).val() != "" && $(item).val().match(/^[A-Za-z0-9]*$/)==null){
				$(item).parent().parent().addClass("has-error");
				$(item).after("<div id='divcmd' class='text-danger'>Character, numeric can be input. ex) a-z, A-Z, 0-9 </div>");
				$(item).focus();
				s = false;
			}
		});
		return s;
	},
	ValidateCheck : function(form, msg){
	    var sel = $(form).find("input[type='checkbox']:checked").length;
		if(sel == 0)
			Element.Tools.Error(msg || "Please select at least one item to delete", "info");
		return (sel > 0) ? true : false;
	},
	Error : function(msg){
		if($("#errormsg").length > 0){
			$("#errormsg").text(msg);
			return;
		}
		var cl = (arguments[1]) ? arguments[1] : "danger";
		var cn = (cl == "danger") ? "Error" : "";
		var error = $("<div/>").
			addClass("alert-dismissable").addClass("alert-"+cl).addClass("alert").
			css("width", "600px").
			css("left", "0").
			css("right", "0").
			css("margin-left", "auto").
			css("margin-right", "auto").
			css("position", "absolute");
		var msg = "<strong>"+cn+"</strong>&nbsp;&nbsp;"+msg;

		error.append(msg);
		error.css('top', '90px');
		$("body").append(error);
		if($("body").find(".layer_area").length > 0){
			$('.layer').fadeOut();
			$('.layer').remove();
		}
		error.delay(5000).fadeOut();
	},
	RESTGet : function(query){
		var v = "?";
		if(!query.hasOwnProperty("max")){
			if(app.config.paging.itemperpage == 1000000){
				v += "max="+app.config.paging.itemperpage+"&offset=0";
			}else{
				v += "max="+app.config.paging.itemperpage+"&offset="+(query.page-1)*app.config.paging.itemperpage;
			}
		}
		if(!query.hasOwnProperty(query.s_opt)){
			if(query.s_val)
				v += "&"+query.s_opt+"="+query.s_val;
		}
		if(!query.hasOwnProperty(query.o_val)){
			if(query.o_val)
				v += "&o_option="+query.o_opt+"&o_desc="+query.o_val;
		}

		for (k in query) {
			if(k != "page" && k != "s_opt" && k != "s_val" && k != "o_opt" && k != "o_val" && query[k] != ""){
				v += "&"+k+"="+query[k];
			}
		}

		
		return v;
	},
	SetCookie : function(cname, cvalue){
		var d = new Date();
		d.setTime(d.getTime()+(app.config.cookieexpirehour * 60 * 60 * 1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
	},
	GetCookie : function(cname){
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++){
			var c = ca[i].trim();
			if (c.indexOf(name)==0) return c.substring(name.length,c.length);
		}
		return "";
	},
	DeleteCookie : function(cname){
		var expireDate = new Date();
		expireDate.setDate(expireDate.getDate() - 1);
		document.cookie = cname + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
	},
	Multi : function(url, data, dom, options){
		dom.find("button").attr("disabled", "disabled");
		if(app.config.debug)
			app.Debug("Model Request ( "+ url + ") ", JSON.stringify(data));

		app.component.LoadingData(true);
		$.ajax({ 
			url : url,
			data : JSON.stringify({ listObj : data }),
			dataType : "json",
			cache: false,
			contentType : 'application/json',
			type : "PUT",
			success : function(response){
				app.component.LoadingData(false);
				if(!response.IsSuccessful){
					Element.Tools.Error(response.ErrorMessage);
				}

				return (response.IsSuccessful) ? 
					options.s(null, response) : 
					options.e(null, response.ErrorMessage);
			},
			error : function(xhr, errorText, errorCode){
				app.component.LoadingData(false);
				options.e(xhr, errorText);
			}	
		});
	},
	jsonSort : function(objArray, prop, direction){
		if (arguments.length<2) throw new Error("sortJsonArrayByProp requires 2 arguments");
		var direct = arguments.length>2 ? arguments[2] : 1;

		if (objArray && objArray.constructor===Array){
			var propPath = (prop.constructor===Array) ? prop : prop.split(".");
			objArray.sort(function(a,b){
				for (var p in propPath){
					if (a[propPath[p]] && b[propPath[p]]){
						a = a[propPath[p]];
						b = b[propPath[p]];
					}
				}
				a = a.match(/^\d+$/) ? +a : a;
				b = b.match(/^\d+$/) ? +b : b;
				return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
			});
		}
	}
}
