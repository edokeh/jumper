chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

    (function login() {
        var usernameField = $(request.usernameSelector);
        var passwordField = $(request.passwordSelector);

        if (usernameField.length === 0 || passwordField.length === 0) {
            setTimeout(arguments.callee, 1000);
        }

        usernameField.val(request.username);
        passwordField.val(request.password);

        var div = $('<div>登录中，马上就好...</div>').css({
            height : '50px',
            width : '150px',
            position : 'absolute',
            background : 'black',
            color : 'white',
            opacity : 0.7,
            top : usernameField.offset().top + usernameField.height(),
            left : usernameField.offset().left,
            zIndex : 99999,
            borderRadius : '5px',
            textAlign : 'center',
            lineHeight : '50px'
        }).appendTo('body');

        if (request.submitSelector) {
            $(request.submitSelector)[0].click();
        } else {
            usernameField.closest('form').submit();
        }
    })();

});
