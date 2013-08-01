var Account = Backbone.Model.extend({
    defaults : function () {
        return {
            id : new Date().getTime() + ''
        };
    },

    getWebsite : function () {
        return this.collection.websites.get(this.get('websiteId'));
    }
});

var AccountList = Backbone.Collection.extend({
    model : Account,
    localStorage : new Backbone.LocalStorage('account')
});