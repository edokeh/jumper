var Account = Backbone.Model.extend({
    defaults : function () {
        return {
            id : new Date().getTime() + ''
        };
    },

    startModify : function () {
        this.trigger('startModify', this);
    },

    getWebsite : function () {
        return this.collection.websites.get(this.get('websiteId'));
    }
});

var AccountList = Backbone.Collection.extend({
    model : Account,
    localStorage : new Backbone.LocalStorage('account'),

    initialize : function (options) {
        _.bindAll(this);

        this.websites = options.websites;
        this.websites.on('destroy', this.deleteByWebsite);
    },

    deleteByWebsite : function (website) {
        this.chain().filter(function (account) {
            return account.get('websiteId') === website.id
        }).invoke('destroy');
    }
});