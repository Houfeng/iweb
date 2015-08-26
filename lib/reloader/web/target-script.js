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

    var type = owner.type = {
        HTML: 0,
        STYLE: 1,
        SCRIPT: 2,
        IMG: 3
    };

    var scripts = owner.scripts = (function() {
        return [].slice.call(document.getElementsByTagName('script'));
    })();

    var styles = owner.styles = (function() {
        return [].slice.call(document.querySelectorAll('link[rel="stylesheet"]'));
    })();

    var images = owner.images = (function() {
        return [].slice.call(document.getElementsByTagName('img'));
    })();

    var refresh = owner.refresh = function(url, _type) {
        var fullUrl = baseUrl + url;
        switch (_type) {
            case type.STYLE:
                var style = styles.filter(function(style) {
                    return style.href == fullUrl || style._url == fullUrl;;
                })[0];
                if (style) {
                    style._url = fullUrl;
                    style.href = wrapUrl(fullUrl);
                }
                break;
            case type.IMG:
                var img = images.filter(function(img) {
                    return img.src == fullUrl || img._url == fullUrl;
                })[0];
                if (img) {
                    img._url = fullUrl;
                    img.src = wrapUrl(fullUrl);
                }
                break;
            case type.HTML:
                if (fullUrl == location.href.split('?')[0].split('#')[0]) {
                    location.href = location.href;
                }
                break;
            case type.SCRIPT:
                if (images.some(function(script) {
                    return script.src == fullUrl || script._url == fullUrl;
                })) {
                    location.href = location.href;
                }
                break;
            default:
                location.href = location.href;
                break;
        };
    };

    var socket = owner.socket = io.connect(baseUrl);
    socket.on('data', function(list) {
        if (!list) return;
        list.forEach(function(item) {
            refresh(item.url, item.type);
        });
    });

})((this.iweb = this.iweb || {}), window, document, undefined);