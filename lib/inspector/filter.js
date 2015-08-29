var pkg = require('../../package.json');
var weinre = require('./weinre-common');
var Filter = module.exports = function() {};

Filter.exp = '^\/-dev/inspector';

Filter.prototype.onRequestBegin = function(context, next) {
    context.stopInjection = true;
    if (context.request.url == '/-dev/inspector' || context.request.url == '/-dev/inspector/') {
        return context.redirect('/-dev/inspector/client/index.html#' + pkg.name);
    }
    //临时更改 public 目录
    context.request.publicPath = weinre.utils.options.staticWebDir;
    //更改资源 url
    context.request.setUrl(context.request.url.replace('/-dev/inspector', '/'));
    //向下传递请求流
    next();
};