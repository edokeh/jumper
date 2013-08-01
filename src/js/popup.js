$(function () {
    var PopApp = new Backbone.Marionette.Application();

    PopApp.addRegions({
        'main': '#main'
    })

    PopApp.addInitializer(function () {
        this.websiteList = new WebsiteList();
        this.accountList = new AccountList();
        this.websiteList.fetch();
        this.accountList.fetch();
    });

    PopApp.addInitializer(function () {
        var popView = new PopupView({
            websites: this.websiteList,
            accounts: this.accountList
        });

        this.main.show(popView);


        popView.on('login', function (account) {
            var website = this.websiteList.get(account.get('websiteId'));

            var bgPage = chrome.extension.getBackgroundPage();
            bgPage.login({
                account: account,
                website: website
            });
        }, this);
    });

    PopApp.start();

    $('#options').click(function () {
        chrome.tabs.create({
            url: 'options.html#account/' + localStorage.getItem('popupWebsite')
        });
    });
});