var Website = Backbone.Model.extend({
    defaults : {
        logoutWay : 'clearCookie'
    },

    select : function () {
        this.trigger('select', this);
    }
});

var WebsiteList = Backbone.Collection.extend({
    model : Website,
    localStorage : new Backbone.LocalStorage('website')
});