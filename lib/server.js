/* global process */
/* global __dirname */
var path = require('path');
var nokit = require('nokitjs');
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
var InspectorImportScript = require('./inspector/import-script');

var root = path.resolve(__dirname, "./");

function Server(options) {
    var self = this;
    options = options || {};
    options.port = options.port || 8080;
    options.folder = options.folder || process.cwd();
    self.options = options;
    var webServer = self.webServer = new nokit.Server({
        "port": options.port,
        "root": root,
        "folders": {
            "public": options.folder
        },
        "log": {
            "enabled": false
        },
        "session": {
            "enabled": false
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
    var reloadWatcher = self.reloadWatcher = new ReloadWatcher(webServer, self.options.folder);
    //inspector
    webServer.filter(InspectorFilter.exp, new InspectorFilter(webServer));
    webServer.handler(InspectorClientHandler.exp, new InspectorClientHandler(webServer));
    webServer.handler(InspectorTargetHandler.exp, new InspectorTargetHandler(webServer));
    InspectorImportScript.exec(socketServer);
};

Server.prototype.start = function (callback) {
    var self = this;
    self.webServer.start(function (err, info) {
        if (callback) callback(err, info);
    });
};

module.exports = Server;
/*end*/