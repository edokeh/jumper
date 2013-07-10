$(function () {
    var websiteList = new WebsiteList();
    var accountList = new AccountList({
        websites : websiteList
    });
    websiteList.fetch();
    accountList.fetch();

    var popView = new PopupView({
        collection : accountList
    });

    accountList.on('login', function (account) {
        var bgPage = chrome.extension.getBackgroundPage();
        bgPage.login({
            account : account,
            website : account.getWebsite()
        });
    });

    $('#options').click(function () {
        chrome.tabs.create({
            url : 'options.html#account/' + localStorage.getItem('popupWebsite')
        });
    });
});