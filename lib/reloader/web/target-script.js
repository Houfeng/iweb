(function(owner, window, document, undefined) {

    owner.commands.refreshPage = function(url) {
        if (owner.urlInPage(url)) {
            location.reload(true);
        }
    };

    owner.commands.refreshImage = function(url) {
        var fullUrl = owner.baseUrl + url;
        var image = owner.getImages().filter(function(image) {
            return image.src == fullUrl || image._url == fullUrl;
        })[0];
        if (image) {
            image._url = fullUrl;
            image.src = '';
            image.src = owner.wrapUrl(fullUrl);
        }
    };

    owner.commands.refreshStyle = function(url) {
        var fullUrl = owner.baseUrl + url;
        var style = owner.getStyles().filter(function(style) {
            return style.href == fullUrl || style._url == fullUrl;;
        })[0];
        if (style) {
            style._url = fullUrl;
            style.href = '';
            style.href = owner.wrapUrl(fullUrl);
        }
    };

})(window.iweb = window.iweb || {}, window, document, undefined);