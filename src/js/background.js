// 初始化数据
(function () {
    var migrate = parseInt(localStorage.getItem('migrate')) || 0;

    // store format changed,sorry
    if (migrate === 1) {
        localStorage.removeItem('website');
        localStorage.removeItem('account');
        localStorage.removeItem('popupWebsite');
        migrate = 0;
    }

    if (migrate < 1) {
        var websites = new WebsiteList();
        websites.create({
            title : '百卓',
            loginUrl : 'http://www.abiz.com/session/new',
            usernameSelector : '[name="username"]',
            passwordSelector : '[name="password"]',
            cookieKey : '_abiz_session',
            cookieHost : 'http://www.abiz.com',
            closeTabUrl : 'http://*.abiz.com/*'
        });
        websites.create({
            title : 'MIC 中文版',
            loginUrl : 'http://membercenter.cn.made-in-china.com/login/',
            usernameSelector : '#micForm [name="logonUserName"]',
            passwordSelector : '#micForm [name="logonPassword"]',
            cookieKey : 'cid',
            cookieHost : 'http://membercenter.cn.made-in-china.com',
            closeTabUrl : 'http://*.cn.made-in-china.com/*'
        });
        websites.create({
            title : 'MIC 国际站',
            loginUrl : 'https://login.made-in-china.com/sign-in/',
            usernameSelector : '[name="logonInfo.logUserName"]',
            passwordSelector : '[name="logonInfo.logPassword"]',
            cookieKey : 'cid',
            cookieHost : 'http://www.made-in-china.com',
            closeTabUrl : 'http://*.made-in-china.com/*'
        });
        localStorage.setItem('migrate', '1');
    }
    if (migrate < 2) {
        websites.create({
            title : '新浪微博',
            loginUrl : 'http://weibo.com',
            usernameSelector : '[name="username"]',
            passwordSelector : '[name="password"]',
            submitSelector : '[node-type="submitBtn"]',
            logoutWay : 'requestURL',
            logoutUrl : 'http://weibo.com/logout.php',
            closeTabUrl : 'http://*.weibo.com/*'
        });
        localStorage.setItem('migrate', '2');
    }
})();

function login(options) {
    var website = options.website;
    var account = options.account;

    logout(website, function () {
        closeTab(website, function () {
            createTab(website.get('loginUrl'), function (tab) {
                sendLogin(tab, account, website);
            });
        });
    });
}

// 退出登录
function logout(website, callback) {
    if (website.get('logoutWay') === 'clearCookie') {
        chrome.cookies.remove({
            url : website.get('cookieHost'),
            name : website.get('cookieKey')
        });
        callback();
    } else if (website.get('logoutWay') === 'requestURL') {
        createTab(website.get('logoutUrl'), function (tab) {
            setTimeout(function () {
                chrome.tabs.remove(tab.id);
                setTimeout(callback, 200);
            }, 800);
        });
    }
}

function closeTab(website, callback) {
    chrome.tabs.query({
        url : website.get('closeTabUrl')
    }, function (tabs) {
        chrome.tabs.remove(tabs.map(function (tab) {
            return tab.id;
        }));
        setTimeout(callback, 500);
    });
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
        passwordSelector : website.get('passwordSelector'),
        submitSelector : website.get('submitSelector')
    });
}