/*
Written by hitapia(sbang)
Role : main index js
*/
var app = app || {};
(function($){
	app.projectlist = Element.View.extend({
		el : $("#container"),
		list : $("#projectlist"),
		render : function(){
			var self = this;
			this.collection = new app.projects();
			this.collection.fetch({
				success : _.bind(function(collection){
					this.collection = collection;
					_(this.collection.models).each( function(item){
						self.addItem(item);
					}, this);
				})
			});
		},
		addItem : function(model){
			$(this.list)
				.append(new app.projectlistitem( { model : model }).render().el); 
		}
	});
})(jQuery);
