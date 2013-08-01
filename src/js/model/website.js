var Website = Backbone.Model.extend({
    defaults: {
        loginUrl: '',
        usernameSelector: '',
        passwordSelector: '',
        submitSelector: '',
        closeTabUrl: '',
        logoutWay: 'clearCookie',
        cookieKey: '',
        cookieHost: '',
        logoutUrl: ''
    }
});

var WebsiteList = Backbone.Collection.extend({
    model: Website,
    localStorage: new Backbone.LocalStorage('website')
});