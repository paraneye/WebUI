/*
Written by hitapia(sbang)
Role : Permission
*/
var app = app || {};
(function($){
    app.pages = [],
    app.perms = [],

    app.page= {
        page : "",
        pages : []      //child pages
    },
    app.perm = {
        page : "",      //related page
        C : true,
        R : true,
        U : true,
        D : true
    },
    set : function(data){
        app.perm = JSON.parse(data);
    },
    valid : function(page, action){
        //validate for ONLY Logged User

        if(app.config.debug)    //for debuger
            return true;

        _.each(app.perms, function(perm){
            if(perm.page == page && eval("perm."+action) == true)
                return true;
            return false;
        }
    }
})(jQuery);
