/**
 * 网站设置页面
 */
var WebsiteItemView = Backbone.Marionette.ItemView.extend({
    template: '#websiteItemTemp',
    tagName: 'tr',

    events: {
        'click .delete': 'delete',
        'click': 'handleSelect'
    },

    modelEvents: {
        'change': 'render'
    },

    delete: function (e) {
        e.stopImmediatePropagation();
        if (this.model.isNew() || confirm('确定删除“' + this.model.get('title') + '”？')) {
            this.model.destroy();
        }
    },

    handleSelect: function () {
        this.trigger('selectWebsite');
    },

    highlight: function (boolean) {
        this.$el.toggleClass('info', boolean);
    }
});

var WebsiteListView = Backbone.Marionette.CompositeView.extend({
    tagName: 'table',
    className: 'table table-hover table-bordered',
    template: '#websiteListTemp',
    itemView: WebsiteItemView,

    collectionEvents: {
        'destroy': 'selectFirst'
    },

    initialize: function () {
        this.on('itemview:selectWebsite', this.selectWebsite);
    },

    selectWebsite: function (childView) {
        this.children.invoke('highlight', false);
        childView.highlight(true);
        this.trigger('selectWebsite', childView.model);
    },

    // 选中第一个网站
    selectFirst: function () {
        if (this.collection.length === 0) {
            this.trigger('emptyWebsite');
        } else {
            this.selectWebsite(this.children.first());
        }
    },

    addWebsite: function () {
        this.collection.add({
            title: '新的网站'
        });
        this.selectWebsite(this.children.last());
    }
});

var WebsiteFormView = Backbone.Marionette.ItemView.extend({
    template: '#websiteFormTemp',
    tagName: 'form',
    className: 'form-horizontal well',

    events: {
        'submit': 'handleSubmit',
        'change [name="logoutWay"]': 'changeWay'
    },

    onRender: function () {
        this.changeWay();
    },

    changeWay: function () {
        var way = this.$('[name="logoutWay"]').val();
        this.$('[data-way]').hide().find('input').prop('disabled', true);
        this.$('[data-way="' + way + '"]').show().find('input').prop('disabled', false);
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var attrs = this.$el.serializeObject();
        this.model.save(attrs);
        successTip.show('保存成功');
    }
});

var WebsiteLayout = Backbone.Marionette.Layout.extend({
    template: '#websiteTemp',
    className: 'row-fluid',

    regions: {
        list: "#websiteTable",
        form: '#websiteForm'
    },

    events: {
        'click #addWebsite': 'addWebsite'
    },

    ui: {
        'addForm': '#accountAddForm'
    },

    initialize: function (options) {
        this.listView = new WebsiteListView(options);

        this.listenTo(this.listView, 'selectWebsite', this.showForm);
        this.listenTo(this.listView, 'emptyWebsite', this.hideForm);
    },

    onRender: function () {
        this.list.show(this.listView);
        this.listView.selectFirst();
    },

    // 新建网站
    addWebsite: function () {
        this.listView.addWebsite();
    },

    // 选中某个网站时显示表单
    showForm: function (website) {
        this.form.show(new WebsiteFormView({model: website}));
    },

    hideForm: function () {
        this.form.close();
    }
});

var WebsiteModule = function (module, app) {

    this.addInitializer(function () {
        var websiteLayout = new WebsiteLayout({
            collection: app.websiteList
        });
        app.websites.show(websiteLayout);

        var Router = Backbone.Router.extend({
            routes: {
                'website': 'websites'
            },

            websites: function () {
                $('a[href="#website"]').tab('show');
            }
        });
        new Router();
    });
};