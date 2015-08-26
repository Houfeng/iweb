var path = require('path');
var self = module.exports;

self.utils = require('weinre/lib/utils');
self.dumpingHandler = require('weinre/lib/dumpingHandler');
self.channelManager = require('weinre/lib/channelManager');
self.serviceManager = require('weinre/lib/serviceManager');
self.HttpChannelHandler = require('./weinre-handler');

self.utils.setOptions({
    readTimeout: 5
});
self.utils.options.staticWebDir = path.resolve(__dirname, '../../node_modules/weinre/web');

self.serviceManager.registerProxyClass('WeinreClientEvents');
self.serviceManager.registerProxyClass('WeinreTargetEvents');
self.serviceManager.registerLocalClass('WeinreClientCommands');
self.serviceManager.registerLocalClass('WeinreTargetCommands');

self.clientHandler = new self.HttpChannelHandler('/ws/client');
self.targetHandler = new self.HttpChannelHandler('/ws/target');
self.channelManager.initialize();