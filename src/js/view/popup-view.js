/**
 * 弹出菜单
 */
// 网站下拉列表选择
var WebsiteSelectView = Backbone.Marionette.ItemView.extend({
    tagName: 'select',
    className: 'input-medium',
    template: '#websiteSelectTemp',

    events: {
        'change': 'selectWebsite'
    },

    onRender: function () {
        this.$el.val(localStorage.getItem('popupWebsite'));
        this.selectWebsite();
    },

    selectWebsite: function () {
        this.trigger('selectWebsite', this.$el.val());
    }
});

var AccountItemView = Backbone.Marionette.ItemView.extend({
    template: '#accountTemp',
    tagName: 'tr',

    events: {
        'click': 'login'
    },

    login: function () {
        this.trigger('login');
    }
});

var AccountEmptyView = Backbone.Marionette.ItemView.extend({
    template: '#accountEmptyTemp',
    tagName: 'tr',
    className: 'warning'
});

var AccountListView = Backbone.Marionette.CompositeView.extend({
    itemView: AccountItemView,
    emptyView: AccountEmptyView,
    template: '#accountListTemp',
    tagName: 'table',
    className: 'table table-hover table-condensed'
});

var PopupView = Backbone.Marionette.Layout.extend({
    template: '#popupTemp',

    regions: {
        'list': '#accountList',
        'websiteSelect': '#websiteSelect'
    },

    initialize: function (options) {
        this.accounts = options.accounts;
        this.websiteSelectView = new WebsiteSelectView({
            collection: options.websites
        });
        this.listView = new AccountListView({
            collection: new AccountList()
        });

        this.listenTo(this.websiteSelectView, 'selectWebsite', this.handleWebsiteChange);
        this.listenTo(this.listView, 'itemview:login', this.triggerLogin);
    },

    onRender: function () {
        this.websiteSelect.show(this.websiteSelectView);
        this.list.show(this.listView);
    },

    // 改变选择的网站
    handleWebsiteChange: function (websiteId) {
        var accounts = this.accounts.filter(function (a) {
            return a.get('websiteId') === websiteId;
        });
        this.listView.collection.reset(accounts);
        localStorage.setItem('popupWebsite', websiteId);
    },

    triggerLogin: function (childView) {
        this.trigger('login', childView.model);
    }
});