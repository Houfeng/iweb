var path = require('path');
var Filter = module.exports = function() {};

var staticWebDir = path.resolve(__dirname, './web/');

Filter.prototype.onRequestBegin = function(context, next) {
    context.stopInjection = true;
    if (context.request.url == '/-dev/reloader') {
        return context.redirect('/-dev/reloader/');
    }
    //临时更改 public 目录
    context.request.publicPath = staticWebDir;
    //更改资源 url
    context.request.setUrl(context.request.url.replace('/-dev/reloader', ''));
    //向下传递请求流
    next();
};

Filter.exp = '^\/-dev/reloader';