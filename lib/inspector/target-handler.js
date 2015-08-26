var path = require('path');
var weinre = require('./weinre-common');
var Handler = module.exports = function() {};

Handler.exp = "^\/ws\/target(.*)";
Handler.prototype.handle = function(context) {
    var uri = path.normalize(context.request.url.replace('/ws/target', '/'));
    return weinre.targetHandler.handle(context, uri);
};