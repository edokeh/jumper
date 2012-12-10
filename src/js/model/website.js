var Website = Backbone.Model.extend({
    select : function () {
        this.trigger('select', this);
    }
});

var WebsiteList = Backbone.Collection.extend({
    model : Website,
    localStorage : new Store('website')
});