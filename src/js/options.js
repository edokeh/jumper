$(function () {

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
        collection : accountList
    });

    $('#tab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

});