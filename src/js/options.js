$(function () {
    var OptionRouter = Backbone.Router.extend({
        routes : {
            '' : 'redirect',
            'account' : 'accounts',
            'account/:website' : 'accounts',
            'website' : 'websites'
        },

        redirect : function () {
            this.navigate('account', {trigger: true});
        },

        accounts : function (website) {
            $('a[href="#account"]').tab('show');
            accountListView.renderForWebsite(website);
        },

        websites : function () {
            $('a[href="#website"]').tab('show');
        }
    });
    var optionRouter = new OptionRouter();

    var websiteList = new WebsiteList();
    var accountList = new AccountList({
        websites : websiteList
    });
    websiteList.fetch();
    accountList.fetch();

    var websiteView = new WebsiteView({
        collection : websiteList
    });
    var accountListView = new AccountView({
        collection : accountList,
        router : optionRouter
    });

    Backbone.history.start();
});