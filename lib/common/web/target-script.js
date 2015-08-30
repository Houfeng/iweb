(function(owner, window, document, undefined) {

    var uuid = owner.uuid = 0;

    var baseUrl = owner.baseUrl = (function() {
        var parts = location.href.split('/');
        return parts.slice(0, 3).join('/');
    })();

    var wrapUrl = owner.wrapUrl = function(url) {
        var urlParts = url.split('#');
        var url = urlParts[0];
        var hash = urlParts[1];
        url = url + (url.indexOf('?') > -1 ? '&' : '?') + '_t_=' + (uuid++);
        if (hash !== null && hash !== undefined) {
            url = url + '#' + hash;
        }
        return url;
    };

    var getFilePath = owner.getFilePath = function(url) {
        if (!url) return null;
        return url.replace(baseUrl, '');
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

    var getPageInfo = owner.getPageInfo = function() {
        var pageInfo = {};
        pageInfo.url = getFilePath(location.href);
        pageInfo.files = [];
        var scripts = getScripts();
        pageInfo.files.push.apply(pageInfo.files, scripts.map(function(item) {
            return getFilePath(item.src);
        }));
        var iamges = getImages();
        pageInfo.files.push.apply(pageInfo.files, iamges.map(function(item) {
            return getFilePath(item.src);
        }));
        var styles = getStyles();
        pageInfo.files.push.apply(pageInfo.files, styles.map(function(item) {
            return getFilePath(item.href);
        }));
        return pageInfo;
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