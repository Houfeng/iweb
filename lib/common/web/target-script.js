(function(owner, window, document, undefined) {

    var uuid = owner.uuid = 0;

    var baseUrl = owner.baseUrl = (function() {
        var parts = location.href.split('/');
        return parts.slice(0, 3).join('/');
    })();

    var wrapUrl = owner.wrapUrl = function(url) {
        url = url || '';
        var urlParts = url.split('#');
        var url = urlParts[0];
        var hash = urlParts[1];
        url = url + (url.indexOf('?') > -1 ? '&' : '?') + '_t_=' + (uuid++);
        if (hash !== null && hash !== undefined) {
            url = url + '#' + hash;
        }
        return url;
    };

    var trimFilePath = owner.trimFilePath = function(url) {
        url = url || '';
        return url.replace(baseUrl, '').split('?')[0].split('#')[0];
    };

    var getScripts = owner.getScripts = function() {
        return [].slice.call(document.getElementsByTagName('script'));
    };

    var getStyles = owner.getStyles = function() {
        return [].slice.call(document.querySelectorAll('link[rel="stylesheet"]'));
    };

    var getImages = owner.getImages = function() {
        return [].slice.call(document.getElementsByTagName('img'));
    };

    (function() {
        var style = document.createElement('link');
        var xhrUrlMap = owner.xhrUrlMap = {};
        XMLHttpRequest.prototype.__open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            var url = arguments[1];
            url = (url || '').toString();
            if (url.indexOf('/ws/target') < 0 &&
                url.indexOf('/socket.io') < 0 &&
                url.indexOf('/-dev') < 0) {
                style.href = url;
                url = trimFilePath(style.href);
                xhrUrlMap[url] = xhrUrlMap[url] || 0;
                xhrUrlMap[url] += 1;
            }
            return this.__open.apply(this, arguments);
        };
    })();
    var getXhrUrls = owner.getXhrUrls = function() {
        return Object.getOwnPropertyNames(owner.xhrUrlMap);
    };

    var getPageInfo = owner.getPageInfo = function() {
        var pageInfo = {};
        pageInfo.url = trimFilePath(location.href);
        pageInfo.files = [];
        var scripts = getScripts();
        pageInfo.files.push.apply(pageInfo.files, scripts.map(function(item) {
            return trimFilePath(item.src);
        }));
        var iamges = getImages();
        pageInfo.files.push.apply(pageInfo.files, iamges.map(function(item) {
            return trimFilePath(item.src);
        }));
        var styles = getStyles();
        pageInfo.files.push.apply(pageInfo.files, styles.map(function(item) {
            return trimFilePath(item.href);
        }));
        var xhrUrls = getXhrUrls();
        pageInfo.files.push.apply(pageInfo.files, xhrUrls.map(function(item) {
            return trimFilePath(item);
        }));
        return pageInfo;
    };

    var urlInPage = owner.urlInPage = function(url) {
        var pageInfo = getPageInfo();
        return (pageInfo.url == url) || pageInfo.files.some(function(item) {
            return item == url;
        });
    };

    owner.commands = {};

    var socket = owner.socket = io.connect(baseUrl);
    socket.emit('pageInfo', getPageInfo());
    socket.on('command', function(cmd) {
        if (!cmd) return;
        if (owner.commands[cmd.name]) {
            owner.commands[cmd.name].apply(owner.commands, cmd.args);
        };
    });

    owner.commands.importScript = function(url) {
        var scriptElement = document.createElement('script');
        scriptElement.addEventListener('load', function(event) {
            setTimeout(function() {
                document.body.removeChild(scriptElement);
            }, 0);
        });
        scriptElement.src = url;
        document.body.appendChild(scriptElement);
    };

})((this.iweb = this.iweb || {}), window, document, undefined);