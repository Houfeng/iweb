(function(owner, window, document, undefined) {

    owner.commands.refreshPage = function() {
        location.href = location.href;
    };

    owner.commands.refreshImage = function(url) {
        var fullUrl = owner.baseUrl + url;
        var img = images.filter(function(img) {
            return img.src == fullUrl || img._url == fullUrl;
        })[0];
        if (img) {
            img._url = fullUrl;
            img.src = owner.wrapUrl(fullUrl);
        }
    };

    owner.commands.refreshStyle = function(url) {
        var fullUrl = owner.baseUrl + url;
        var style = styles.filter(function(style) {
            return style.href == fullUrl || style._url == fullUrl;;
        })[0];
        if (style) {
            style._url = fullUrl;
            style.href = owner.wrapUrl(fullUrl);
        }
    };

})(window.iweb = window.iweb || {}, window, document, undefined);