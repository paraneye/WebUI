var app = app || {};
(function($){
	app.drawingviewer = Element.View.extend({		
		pages : ["PROJECT", "Tools", "Drawing Viewer"],
		render : function(){
			var self = this;
			app.TemplateManager.get("../../modules/mto/tpl/tpl_drawings.html", function(template){
				$(self.el).html($(template));

				$(self.el).find("#slcwp").append("<option value=''>ALL</option>");
				app.component.Call("/Common/Common.svc/rest/CwpCombo", "GET", "",
					function(d){
						_.each(JSON.parse(d.JsonDataSet), function(item){
							$(self.el).find("#slcwp").append("<option value='"+item.CodeName+"'>"+item.CodeName+"</option>");
						});
					}, null
				);
				
				$(self.el).find("#btnsearch").on("click", function(e){
					e.preventDefault();
					self.getdrawings();
				});
				$(self.el).find("#slcwp").on("change", function(){
					$(self.el).find("#DrawingNum").val("");
					self.getdrawings();
				});
				self.getdrawings();
			});
            return this;
		},
		getdrawings : function(){
			var self = this;
			var m = {};
			if($(self.el).find("#DrawingNum").val() != ""){
				m = {
					CWPName : $(self.el).find("#slcwp").val(), 
					DrawingName : $(self.el).find("#DrawingNum").val()
				};
			}else{
				m = { CWPName : $(self.el).find("#slcwp").val() };
			}

		    app.component.Call("/ProjectData/SigmaProjectData.svc/rest/DrawingViewer", "POST",
				JSON.stringify(m),
				function(d){
					$(self.el).find("#list").html("");
					if(JSON.parse(d.JsonDataSet).length > 0){
						$(self.el).find("#nolist").hide();
						_.each(JSON.parse(d.JsonDataSet), function(item){
							$(self.el).find("#list").append("<div class='photo'><div class='bg-primary' style='display:none;position:absolute;width:200px;text-overflow-mode:ellipsis-word;overflow:hidden;white-space : nowrap;padding:5px;'>"+item.DrawingNum+"</div><a href=\"javascript:Element.Tools.LinkClick('"+app.config.docPath.docs + item.FilePath.replace(/\\/g, "/")+"', '"+item.DrawingNum+"')\" rel='facebox'><img src='"+app.config.docPath.docs + item.ThumbnailFilePath+"' alt='"+item.FileName+"' /></a></div>");
						});
						self.renderimages();
						$(self.el).find("#list .photo").on("mouseout", function(){
							$(this).find("div").slideUp("slow", function(){});
						});
						$(self.el).find("#list .photo").on("mouseover", function(){
							$(this).find("div").slideDown("slow", function(){});
						});
					}else{
						$(self.el).find("#nolist").show();
					}
				}, null
			);
		},
		link : function(img, name){
			app.component.Modal.show(new app.drawingimageviewer( { img : img, dname : name } ), 900);
		},
		renderimages : function(){
			var self = this;
			var container = $(self.el).find('#list');
			container.imagesLoaded( function(){
				container.isotope({
					itemSelector : '.photo',
					layoutMode : 'fitRows'
				});
			});
     
			var optionSets = $(self.el).find('#options .option-set'),
				optionLinks = optionSets.find('a');
			optionLinks.click(function(){
				var $this = $(this);
				if ( $this.hasClass('selected') ) {
					return false;
				}
				var $optionSet = $this.parents('.option-set');
				$optionSet.find('.selected').removeClass('selected');
				$this.addClass('selected');

				// make option object dynamically, i.e. { filter: '.my-filter-class' }
				var options = {},
					key = $optionSet.attr('data-option-key'),
					value = $this.attr('data-option-value');

				// parse 'false' as false boolean
				value = value === 'false' ? false : value;
				options[ key ] = value;

				if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
					// changes in layout modes need extra logic
					changeLayoutMode( $this, options )
				} else {
					// otherwise, apply new options
					$container.isotope( options );
				}
				return false;
			});

		  var $sizeSets = $(self.el).find('#options .size-set'),
			  $sizeLinks = $sizeSets.find('a');

			$sizeLinks.click(function(){
				var $this = $(this);
				var value = $this.attr('data-option-value');

				if (value == 'bigger') {
					var newWidth = Math.floor(parseInt($(self.el).find('.photos .photo').css('width')) * 1.2) + 'px';
				} else {
					var newWidth = Math.floor(parseInt($(self.el).find('.photos .photo').css('width')) * 0.8) + 'px';
				}

				$(self.el).find('.photos .photo').css('width', newWidth);
				$container.isotope();
				return false;
			})   
		}
	});
	app.drawingimageviewer = Element.View.extend({
		render : function(){
			var self = this;
			app.TemplateManager.getnocache("../../modules/mto/tpl/tpl_drawingviewer.html", function(template){
				$(self.el).html($(template));
				$(self.el).find("#mainimg").attr("src", self.options.img);
				$(self.el).find("h2").text(self.options.dname);
				$(self.el).find("h2").css("height", "50px");
				$(self.el).find(".title").css("padding", "8px 8px 8px 16px");
				$(self.el).find(".pop-formm").css("padding", "0px 10px 0px 10px");

				var section = $(self.el).find('#focal');
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

				$(self.el).find("#btnCancel").on("click", function(e){
					e.preventDefault();
					panzoom.panzoom("destroy");
					app.component.Modal.close();
				});
			});
            return this;
		}
	});
	app.pdfviewer = Element.View.extend({
		render : function(){
			var self = this;
			app.TemplateManager.getnocache("../../modules/mto/tpl/tpl_pdfviewer.html", function(template){
				$(self.el).html($(template));
				$(self.el).find("#pdfbase .media").attr("href", app.config.docPath.docs + self.options.pdf);
				$(self.el).find("#pdfbase .media").media({width:800, height:500});
				$(self.el).find("h2").text(self.options.dname);
				$(self.el).find("h2").css("height", "50px");
				$(self.el).find(".pop-form").css("max-height", "600px");
				$(self.el).find(".title").css("padding", "8px 8px 8px 16px");
				$(self.el).find(".pop-formm").css("padding", "0px 10px 0px 10px");

				$(self.el).find("#btnCancel").on("click", function(e){
					e.preventDefault();
					app.component.Modal.close();
				});
			});
            return this;
		}
	});
})(jQuery);
