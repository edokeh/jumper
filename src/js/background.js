// 初始化数据
(function () {
    var migrate = parseInt(localStorage.getItem('migrate')) || 0;
    if (migrate < 1) {
        var websites = new WebsiteList();
        websites.create({
            title : '百卓',
            loginUrl : 'http://www.abiz.com/session/new',
            usernameSelector : '[name="username"]',
            passwordSelector : '[name="password"]',
            cookieKey : '_abiz_session',
            cookieHost : 'http://www.abiz.com'
        });
        websites.create({
            title : '中文版',
            loginUrl : 'http://membercenter.cn.made-in-china.com/login/',
            usernameSelector : '#micForm [name="logonUserName"]',
            passwordSelector : '#micForm [name="logonPassword"]',
            cookieKey : 'cid',
            cookieHost : 'http://membercenter.cn.made-in-china.com'
        });
        localStorage.setItem('migrate', '1');
    }
})();

function login(options) {
    var website = options.website;
    var account = options.account;

    logout(website);
    createTab(website.get('loginUrl'), function (tab) {
        //sendLogin(tab, account, website);
    });
}

// 退出登录
function logout(website) {
    var a = document.createElement('a');
    a.href = website.get('loginUrl');
    var host = a.protocol + '//' + a.hostname;

    chrome.cookies.remove({
        url : website.get('cookieHost'),
        name : website.get('cookieKey')
    }, function (c) {
        console.log(c);
    });

    chrome.tabs.query({
        url : website.get('cookieHost') + '/*'
    }, function (tabs) {
        chrome.tabs.remove(tabs.map(function (tab) {
            return tab.id;
        }));
    })
}

// 创建 TAB
function createTab(url, callback) {
    chrome.tabs.create({
        url : url
    }, function (tab) {
        injectScript(tab, ['js/libs/jquery-1.8.3.min.js', 'js/content-script.js'], callback);
    });
}

// 向页面插入脚本
function injectScript(tab, scriptUrls, callback) {
    var url = scriptUrls.shift();
    chrome.tabs.executeScript(tab.id, {
        file : url
    }, function () {
        if (scriptUrls.length === 0) {
            callback(tab);
        } else {
            injectScript(tab, scriptUrls, callback);
        }
    });
}

// 向页面发送登录信令
function sendLogin(tab, account, website) {
    chrome.tabs.sendMessage(tab.id, {
        username : account.get('username'),
        password : account.get('password'),
        usernameSelector : website.get('usernameSelector'),
        passwordSelector : website.get('passwordSelector')
    });
}