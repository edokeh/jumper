var successTip = {
    init : function () {
        _.bindAll(this);
        this.$el = $('#successTip');
    },

    show : function (text) {
        this.$el.stop().css('left', ($(window).width() - this.$el.width()) / 2).animate({
            top : '-3px'
        }, 'fast');
        this.$el.find('strong').text(text);

        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
        }
        this.hideTimer = setTimeout(this.hide, 1500);
    },

    hide : function () {
        this.$el.animate({
            top : '-40px'
        }, 'fast');
    }
};

successTip.init();