$(function () {
    var OptionApp = new Backbone.Marionette.Application();
    OptionApp.addRegions({
        'accounts': '#account',
        'websites': '#website'
    });

    OptionApp.addInitializer(function (options) {
        this.accountList = new AccountList();
        this.websiteList = new WebsiteList();
        this.websiteList.on('remove', function (website) {
            this.accountList.chain().filter(function (account) {
                return account.get('websiteId') === website.id
            }).invoke('destroy');
        }, this);

        this.accountList.fetch();
        this.websiteList.fetch();
    });

    OptionApp.module('AccountModule', AccountModule);
    OptionApp.module('WebsiteModule', WebsiteModule);

    OptionApp.addInitializer(function (options) {
        Backbone.history.start();
    });

    OptionApp.start();
});