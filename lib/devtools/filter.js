var path = require('path');
var pkg = require('../../package.json');
var Filter = module.exports = function() {};

var staticWebDir = path.resolve(__dirname, './web/');
Filter.exp = '^\/-dev/tools';

Filter.prototype.onRequestBegin = function(context, next) {
    context.stopInjection = true;
    if (context.request.url == '/-dev/tools') {
        return context.redirect('/-dev/tools/');
    }
    //临时更改 public 目录
    context.request.publicPath = staticWebDir;
    //更改资源 url
    context.request.setUrl(context.request.url.replace('/-dev/tools', '/'));
    //向下传递请求流
    next();
};