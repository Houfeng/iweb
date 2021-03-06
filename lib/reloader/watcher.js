var path = require('path');
var chokidar = require('chokidar');
var utils = require('real-utils');

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
    self.socketServer.on('start', function(client) {
        self.monit();
    });
};

Watcher.prototype.monit = function() {
    var self = this;
    chokidar.watch(self.root, {
        ignoreInitial: true
    }).on('all', function(event, changedFile) {
        console.log(event, changedFile);
        self._fileChanged(changedFile);
    });
};

Watcher.prototype.pathToUrl = function(changedFile) {
    var self = this;
    var url = changedFile.replace(self.root, '');
    url = path.normalize(url);
    while (url.indexOf('\\') > -1 || url.indexOf('//') > -1) {
        url = url.replace('\\', '/').replace('//', '/');
    }
    return url;
};

Watcher.prototype._fileChanged = function(changedFile) {
    var self = this;
    for (var id in self.socketServer.clients) {
        var client = self.socketServer.clients[id];
        if (client && client.execCommand) {
            self._handleByClient(client, changedFile);
        }
    };
};

Watcher.prototype._handleByClient = function(client, changedFile) {
    var self = this;
    if (!client || !client.pageInfo) {
        return;
    }
    var fileUrl = self.pathToUrl(changedFile);
    //向客户端传送命令
    var extname = path.extname(changedFile);
    switch (extname) {
        case '.sass':
        case '.less':
        case '.css':
            client.execCommand({
                name: "refreshStyle",
                args: [fileUrl]
            });
            break;
        case '.png':
        case '.jpg':
        case '.jpeg':
        case '.bmp':
        case '.gif':
            client.execCommand({
                name: "refreshImage",
                args: [fileUrl]
            });
            break;
        default:
            client.execCommand({
                name: "refreshPage",
                args: [fileUrl]
            });
            break;
    }
};