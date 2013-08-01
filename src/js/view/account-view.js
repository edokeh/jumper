/**
 * 帐号设置页面
 */
// 网站下拉列表选择
var WebsiteSelectView = Backbone.Marionette.ItemView.extend({
    tagName: 'select',
    template: '#websiteSelectTemp',

    events: {
        'change': 'handleChange'
    },

    collectionEvents: {
        'change': 'render',
        'destroy': 'render'
    },

    onRender: function () {
        this.selectWebsite();
    },

    handleChange: function () {
        Backbone.history.navigate('account/' + this.$el.val());
        this.selectWebsite();
    },

    selectWebsite: function () {
        this.trigger('selectWebsite', this.$el.val());
    }
});

// 帐号项
var AccountItemView = Backbone.Marionette.ItemView.extend({
    template: '#accountItemTemp',
    tagName: 'tr',

    events: {
        'click .delete': 'delete',
        'click .modify': 'modify',
        'dblclick td': 'modify'
    },

    modelEvents: {
        'change': 'render'
    },

    templateHelpers: {
        protectedPass: function () {
            return _(this.password.length).times(function () {
                return '*';
            }).join('');
        }
    },

    delete: function () {
        if (confirm('确定删除“' + this.model.get('username') + '”？')) {
            this.model.destroy();
        }
    },

    modify: function () {
        this.trigger('startModify');
    }
});

// 无账号的 view
var AccountEmptyView = Backbone.Marionette.ItemView.extend({
    template: '#accountEmptyTemp',
    tagName: 'tr',
    className: 'warning'
});

// 帐号列表
var AccountListView = Backbone.Marionette.CompositeView.extend({
    tagName: 'table',
    className: 'table table-striped table-bordered',
    template: '#accountListTemp',
    itemView: AccountItemView,
    emptyView: AccountEmptyView
});

// 帐号修改表单
var AccountEditView = Backbone.Marionette.ItemView.extend({
    template: '#accountEditTemp',
    tagName: 'tr',

    events: {
        'click .cancel-modify': 'close',
        'submit #accountModifyForm': 'updateAccount'
    },

    // 显示在某个 itemView 之后
    renderAfter: function (view) {
        this.render();
        this.$el.insertAfter(view.$el);
        view.$el.hide();
    },

    // 删除前显示相应的 view
    onClose: function () {
        this.$el.prev().show();
    },

    // 提交修改
    updateAccount: function (e) {
        e.preventDefault();
        var attrs = this.$('form').serializeObject();
        this.model.save(attrs);
        this.close();
        successTip.show('修改成功');
    }
});

// 整个帐号 view
var AccountLayout = Backbone.Marionette.Layout.extend({
    template: '#accountTemp',

    regions: {
        list: "#accountTable",
        websiteSelect: '#websiteSelect'
    },

    events: {
        'submit #accountAddForm': 'createAccount'
    },

    ui: {
        'addForm': '#accountAddForm'
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
        this.listenTo(this.listView, 'itemview:startModify', this.renderEditForm);
    },

    onRender: function () {
        this.websiteSelect.show(this.websiteSelectView);
        this.list.show(this.listView);
    },

    // 渲染表单修改界面
    renderEditForm: function (childView) {
        this.cancelModify();
        this.editView = new AccountEditView({model: childView.model});
        this.editView.renderAfter(childView);
    },

    // 取消修改
    cancelModify: function () {
        if (this.editView) {
            this.editView.close();
            this.editView = null;
        }
    },

    handleWebsiteChange: function (websiteId) {
        if (this.currWebsiteId === websiteId) {
            return;
        }
        this.cancelModify();
        this.changeAccounts(websiteId);
        this.resetAddForm(websiteId);
        this.currWebsiteId = websiteId;
    },

    // 根据网站时切换数据显示
    changeAccounts: function (websiteId) {
        var accounts = this.accounts.filter(function (a) {
            return a.get('websiteId') === websiteId;
        });
        this.listView.collection.reset(accounts);
    },

    // 提交创建
    createAccount: function (e) {
        e.preventDefault();

        var account = this.accounts.create(this.ui.addForm.serializeObject());
        this.listView.collection.add(account);
        this.resetAddForm(account.get('websiteId'));

        successTip.show('添加成功');
    },

    resetAddForm: function (websiteId) {
        var form = this.ui.addForm;
        form[0].reset();
        form.find('input,button').prop('disabled', !websiteId);
        form.find('[name="websiteId"]').val(websiteId);
        form.find('[name="username"]').focus();
    }
});

var AccountModule = function (module, app) {

    this.addInitializer(function () {
        var accountLayout = new AccountLayout({
            accounts: app.accountList,
            websites: app.websiteList
        });
        app.accounts.show(accountLayout);

        var Router = Backbone.Router.extend({
            routes: {
                '': 'redirect',
                'account': 'defaultAccounts',
                'account/:website': 'accounts'
            },

            redirect: function () {
                this.navigate('account', {trigger: true});
            },

            defaultAccounts: function () {
                if (app.websiteList.length > 0) {
                    this.navigate('account/' + app.websiteList.first().id, {trigger: true});
                } else {
                    $('a[href="#account"]').tab('show');
                }
            },

            accounts: function (websiteId) {
                accountLayout.handleWebsiteChange(websiteId);
                $('a[href="#account"]').tab('show');
            }
        });
        new Router();
    });
};