/**
 * 网站设置页面
 */
var WebsiteView = Backbone.View.extend({
    el : '#website',

    events : {
        'click #addWebsite' : 'addWebsite'
    },

    initialize : function () {
        _.bindAll(this);

        this.childViews = [];
        this.collection.on('add', this.renderItem);
        this.collection.on('select', this.selectItem);
        this.collection.on('destroy', this.selectFirst);
        this.render();
    },

    render : function () {
        this.collection.each(this.renderItem);
        this.form = new WebsiteFormView();
        this.selectFirst();
    },

    // 渲染每个网站
    renderItem : function (website) {
        var view = new WebsiteItemView({
            model : website
        });
        this.$('#websiteList').show().append(view.$el);
        this.childViews.push(view);
    },

    // 选中某个网站
    selectItem : function (website) {
        _(this.childViews).each(function (v) {
            v.$el.removeClass('info');
        });
        var view = _(this.childViews).find(function (view) {
            return view.model === website;
        });
        view.$el.addClass('info');
        this.form.setModel(website);
    },

    // 选中第一个网站
    selectFirst : function () {
        if (this.collection.length > 0) {
            this.collection.first().select();
        } else {
            // 如果没有网站
            this.form.clearModel();
            this.$('#websiteList').hide();
        }
    },

    // 新建网站
    addWebsite : function () {
        var website = new Website({
            title : '新的网站'
        });
        this.collection.add(website);
        website.select();
        return false;
    }
});

var WebsiteItemView = Backbone.View.extend({
    template : _.template($('#websiteTemp').html()),
    tagName : 'tr',

    events : {
        'click .delete' : 'delete',
        'click' : 'handleSelect'
    },

    initialize : function () {
        _.bindAll(this);

        this.model.on('change', this.render);
        this.model.on('destroy', this.remove);
        this.render();
    },

    render : function () {
        this.$el.html($(this.template(this.model.toJSON())));
    },

    delete : function (e) {
        e.stopImmediatePropagation();
        if (this.model.isNew()) {
            this.model.destroy();
        } else {
            if (confirm('确定删除“' + this.model.get('title') + '”？')) {
                this.model.destroy();
            }
        }
    },

    handleSelect : function () {
        this.model.select();
    }
});

/**
 * 表单
 */
var WebsiteFormView = Backbone.View.extend({
    el : '#websiteForm',

    events : {
        'submit' : 'handleSubmit'
    },

    initialize : function () {
        _.bindAll(this);
    },

    setModel : function (website) {
        this.el.reset();
        // 填充表单值
        _(website.attributes).each(function (value, key) {
            this.$('[name="' + key + '"]').val(value);
        }, this);
        this.model = website;

        this.$el.find('input,button').prop('disabled', false);
        this.$el.find('input:first').focus();
    },

    // 清除当前表单所对应的 model
    clearModel : function () {
        this.el.reset();
        this.$el.find('input,button').prop('disabled', true);
    },

    handleSubmit : function () {
        var attrs = this.$el.serializeObject();
        this.model.set(attrs).save();
        successTip.show('保存成功');

        return false;
    }
});