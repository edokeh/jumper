/**
 * 帐号设置页面
 */
var AccountView = Backbone.View.extend({
    el : '#account',

    events : {
        'click .cancel-modify' : 'cancelModify',
        'submit #accountAddForm' : 'createAccount',
        'submit #accountModifyForm' : 'modifyAccount'
    },

    initialize : function () {
        _.bindAll(this);

        this.childViews = {};
        this.tmpModifyView = null; // 修改时，原有的view临时保存
        this.modifyForm = this.$('#accountModifyForm');  // 修改的表单
        this.addForm = this.$('#accountAddForm');

        this.collection.on('add', this.renderItem);
        this.collection.on('startModify', this.renderModifyForm);
        this.collection.websites.on('select', this.changeWebsite);
        this.collection.websites.on('clear', this.clearWebsite);
        this.render();
    },

    render : function () {
        this.websiteSelectView = new WebsiteSelectView({
            collection : this.collection.websites
        });
    },

    // 切换网站
    changeWebsite : function (website) {
        this.clearList();

        this.collection.chain().filter(function (a) {
            return a.get('websiteId') === website.id;
        }).each(this.renderItem);

        this.addForm.find('[name="websiteId"]').val(website.id);
        this.addForm.find('input,button').prop('disabled', false);
    },

    clearWebsite : function () {
        this.clearList();
        this.addForm.find('input,button').prop('disabled', true);
    },

    // 清空列表
    clearList : function () {
        this.cancelModify();
        _(this.childViews).invoke('detach');
        this.$('#accountEmptyRow').show();
    },

    // 渲染表单修改界面
    renderModifyForm : function (website) {
        this.cancelModify();
        this.tmpModifyView = this.childViews[website.id];
        this.tmpModifyView.$el.after(this.modifyForm.show()).hide();
        this.modifyForm.find('[name="username"]').focus();

        // 填充值
        _(website.attributes).each(function (value, key) {
            this.modifyForm.find('[name="' + key + '"]').val(value);
        }, this);
    },

    // 取消修改
    cancelModify : function () {
        if (this.tmpModifyView) {
            this.modifyForm.hide().appendTo(this.$('tfoot'));
            this.tmpModifyView.$el.show();
            this.tmpModifyView = null;
        }
    },

    // 渲染帐号
    renderItem : function (website) {
        this.$('#accountEmptyRow').hide();
        var view = this.childViews[website.id];
        if (!view) {
            view = new AccountItemView({
                model : website
            });
            this.childViews[website.id] = view;
        }
        this.$('tbody').append(view.$el);
    },

    // 提交创建
    createAccount : function (e) {
        this.collection.create(this.addForm.serializeObject());
        this.addForm[0].reset();
        this.addForm.find('[name="username"]').focus();
        successTip.show('添加成功');
        return false;
    },

    // 提交修改
    modifyAccount : function () {
        var attrs = this.modifyForm.find('form').serializeObject();
        this.tmpModifyView.model.set(attrs).save();
        this.cancelModify();
        successTip.show('修改成功');
        return false;
    }
});

/**
 * 网站下拉列表
 */
var WebsiteSelectView = Backbone.View.extend({
    el : '#websiteSelect',

    events : {
        'change' : 'selectWebsite'
    },

    initialize : function () {
        _.bindAll(this);

        this.collection.on('destroy add change', this.render);
        this.render();
    },

    render : function () {
        this.$el.empty();
        this.collection.each(function (website) {
            if (website.isNew()) {
                return;
            }
            this.$el.append('<option value="' + website.id + '">' + website.get('title') + '</option>')
        }, this);
        this.selectWebsite();
    },

    selectWebsite : function () {
        var website = this.collection.get(this.$el.val());
        if (website) {
            this.collection.trigger('select', website);
        } else {
            this.collection.trigger('clear');
        }
    }
});

var AccountItemView = Backbone.View.extend({
    template : _.template($('#accountTemp').html()),
    tagName : 'tr',

    events : {
        'click .delete' : 'delete',
        'click .modify' : 'modify',
        'dblclick td' : 'modify'
    },

    initialize : function () {
        _.bindAll(this);

        this.model.on('change', this.render);
        this.model.on('destroy', this.remove);
        this.render();
    },

    render : function () {
        this.$el.html($(this.template(this.model)));
    },

    delete : function () {
        if (confirm('确定删除“' + this.model.get('username') + '”？')) {
            this.model.destroy();
        }
    },

    modify : function () {
        this.model.startModify();
    },

    detach : function () {
        this.$el.detach();
        return this;
    }
});