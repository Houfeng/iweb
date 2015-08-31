var path = require('path');
var chokidar = require('chokidar');

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
        ignoreInitial: true,
        ignored: /[\/\\]\./
    }).on('all', function(event, path) {
        console.log(event, path);
        self._fileChanged(path);
    });
};

Watcher.prototype._fileChanged = function(changedFile) {
    var self = this;
    var filePath = changedFile.replace(self.root, '');
    for (var id in self.socketServer.clients) {
        var client = self.socketServer.clients[id];
        if (client && client.execCommand) {
            self._handleByClient(client, filePath);
        }
    };
};

Watcher.prototype._handleByClient = function(client, filePath) {
    var self = this;
    if (!client || !client.pageInfo) {
        return;
    }
    //向客户端传送命令
    var extname = path.extname(filePath);
    switch (extname) {
        case '.sass':
        case '.less':
        case '.css':
            client.execCommand({
                name: "refreshStyle",
                args: [filePath]
            });
            break;
        case '.png':
        case '.jpg':
        case '.jpeg':
        case '.bmp':
        case '.gif':
            client.execCommand({
                name: "refreshImage",
                args: [filePath]
            });
            break;
        default:
            client.execCommand({
                name: "refreshPage",
                args: [filePath]
            });
            break;
    }
};