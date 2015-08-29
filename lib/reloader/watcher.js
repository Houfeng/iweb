var watch = require("watch");

var Watcher = module.exports = function(webServer, root) {
    var self = this;
    self.root = root;
    self.webServer = webServer;
    self.socketServer = webServer.socketServer;
    self.socketServer.on('connection', function(client) {
        client.execCommand({
            name: 'importScript',
            args: ["/-dev/reloader/target-script.js"]
        });
    });
};

Watcher.prototype.monit = function() {
    var self = this;
    var _fileChanged = function(changedFile) {
        var filePath = changedFile.replace(self.root, '');
        for (var id in self.socketServer.clients) {
            var client = self.socketServer.clients[id];
            if (client && client.execCommand) {
                client.execCommand({
                    name: "refreshPage"
                });
            }
        };
    };
    watch.createMonitor(self.root, {
        ignoreDotFiles: true
    }, function(monitor) {
        monitor.on("created", _fileChanged);
        monitor.on("changed", _fileChanged);
        monitor.on("removed", _fileChanged);
    });
};