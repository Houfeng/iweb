var path = require('path');
var nokit = require('nokit-runtime');
//common
var ScriptInjectionFilter = require('./common/script-injection-filter');
var SocketServer = require('./common/socket-server');
var CommonFilter = require('./common/filter');
//tools
var DevToolsFilter = require('./devtools/filter');
//reloader
var ReloaderFilter = require('./reloader/filter');
var ReloadWatcher = require('./reloader/watcher');
//inspector
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
    //common
    var socketServer = self.socketServer = new SocketServer(webServer);
    webServer.filter(ScriptInjectionFilter.exp, new ScriptInjectionFilter(webServer));
    webServer.filter(CommonFilter.exp, new CommonFilter(webServer));
    //tools
    webServer.filter(DevToolsFilter.exp, new DevToolsFilter(webServer));
    //reload
    webServer.filter(ReloaderFilter.exp, new ReloaderFilter(webServer));
    var reloadWatcher = self.reloadWatcher = new ReloadWatcher(webServer, staticFolder);
    //inspector
    webServer.filter(InspectorFilter.exp, new InspectorFilter(webServer));
    webServer.handler(InspectorClientHandler.exp, new InspectorClientHandler(webServer));
    webServer.handler(InspectorTargetHandler.exp, new InspectorTargetHandler(webServer));
};

Server.prototype.start = function(callback) {
    var self = this;
    self.webServer.start(function(err, info) {
        if (!err) {
            self.socketServer.start();
            self.reloadWatcher.monit();
        }
        if (callback) callback(err, info);
    });
};

module.exports = Server;
/*end*/