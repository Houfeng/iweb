var path = require('path');
var nokit = require('nokit-runtime');
var DevToolsFilter = require('./devtools/filter');
var ReloaderFilter = require('./reloader/filter');
var ReloaderSocketServer = require('./reloader/socket-server');
var ClientScriptFilter = require('./clientscript/filter');
var InspectorFilter = require('./inspector/filter');
var InspectorClientHandler = require('./inspector/client-handler');
var InspectorTargetHandler = require('./inspector/target-handler');

var root = path.resolve(__dirname, "./");

var port = 8010;
var staticFolder = path.resolve(__dirname, '../test');

function Server() {
    var self = this;
    var webServer = self.webServer = new nokit.Server({
        "port": port,
        "root": root,
        "folders": {
            "public": staticFolder
        }
    });
    var socketServer = self.socketServer = new ReloaderSocketServer(webServer);
    webServer.filter(InspectorFilter.exp, new InspectorFilter(webServer));
    webServer.filter(ReloaderFilter.exp, new ReloaderFilter(webServer));
    webServer.filter(ClientScriptFilter.exp, new ClientScriptFilter(webServer));
    webServer.filter(DevToolsFilter.exp, new DevToolsFilter(webServer));
    webServer.handler(InspectorClientHandler.exp, new InspectorClientHandler(webServer));
    webServer.handler(InspectorTargetHandler.exp, new InspectorTargetHandler(webServer));
};

Server.prototype.start = function(callback) {
    var self = this;
    self.webServer.start(function(err, info) {
        if (!err) {
            self.socketServer.start();
        }
        if (callback) callback(err, info);
    });
};

module.exports = Server;
/*end*/