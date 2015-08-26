var path = require('path');
var weinre = require('./weinre-common');
var Handler = module.exports = function() {};

Handler.exp = "^\/ws\/client(.*)";
Handler.prototype.handle = function(context) {
    var uri = path.normalize(context.request.url.replace('/ws/client', '/'));
    return weinre.clientHandler.handle(context, uri);
};