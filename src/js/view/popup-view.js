/**
 * 帐号设置页面
 */
var PopupView = Backbone.View.extend({
    el : 'body',

    events : {
        'change select' : 'changeWebsite'
    },

    initialize : function () {
        _.bindAll(this);

        this.websiteSelect = this.$('#websiteSelect');
        this.childViews = [];

        this.render();
    },

    render : function () {
        this.collection.websites.each(function (website) {
            this.websiteSelect.append('<option value="' + website.id + '" >' + website.get('title') + '</option>');
        }, this);
        this.websiteSelect.val(localStorage.getItem('popupWebsite'));
        this.changeWebsite();
    },

    // 改变选择的网站
    changeWebsite : function () {
        if (!this.websiteSelect.val()) {
            return;
        }
        this.clearList();
        this.collection.chain().filter(function (a) {
            return a.get('websiteId') === this.websiteSelect.val();
        }, this).each(this.renderItem);

        localStorage.setItem('popupWebsite', this.websiteSelect.val());
    },

    clearList : function () {
        _(this.childViews).invoke('detach');
        this.$('#accountEmptyRow').show();
    },

    // 渲染帐号
    renderItem : function (account) {
        this.$('#accountEmptyRow').hide();
        var view = _(this.childViews).find(function (v) {
            return v.model === account;
        });
        if (!view) {
            view = new PopupAccountItemView({
                model : account
            });
            this.childViews.push(view);
        }
        this.$('#accountEmptyRow').before(view.$el);
    }

});

var PopupAccountItemView = Backbone.View.extend({
    template : _.template($('#accountTemp').html()),
    el : null,

    events : {
        'click button' : 'login'
    },

    initialize : function () {
        _.bindAll(this);
        this.render();
        this.delegateEvents();
    },

    render : function () {
        this.$el = $(this.template(this.model.toJSON()));
    },

    login : function () {
        this.model.trigger('login', this.model);
    },

    detach : function () {
        this.$el.detach();
        return this;
    }
});