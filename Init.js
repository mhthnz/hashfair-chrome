// Object for send ajax request
var ajax = {};
ajax.x = function () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];

    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }
    return xhr;
};
ajax.send = function (url, callback, method, data, async) {
    if (async === undefined) {
        async = true;
    }
    var x = ajax.x();
    x.open(method, url, async);
    x.onreadystatechange = function () {
        if (x.readyState == 4) {
            callback(x.responseText)
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data)
};
ajax.get = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};

// Autoload classes and components
chrome.tabs.onUpdated.addListener(function (tabId, info) {
    chrome.tabs.get(tabId, function(tab) {
        if (info.status === 'complete' && tab !== undefined && /^https:\/\/hashflare\.io\/panel([?#].*|\/[?#]*\s*$|$)/i.test(tab.url)) {
            new Options(function(options) {
                chrome.tabs.executeScript(tabId, {code: 'const OPTIONS = JSON.parse(\'' + JSON.stringify(options) +'\');'});

                ajax.get(chrome.extension.getURL('Autoload.js'), [], function(data) {
                    var autoload = eval(data);
                    for (var i = 0; i < autoload.length; i++) {
                        chrome.tabs.executeScript(tabId, {file: autoload[i]});
                        console.log('Load file: ' + autoload[i]);
                    }
                });
            });
        }
    });
});