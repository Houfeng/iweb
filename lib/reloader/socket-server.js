var SocketIO = require('socket.io');

var SocketServer = module.exports = function(webServer) {
    var self = this;
    self.webServer = webServer;
    self.httpServer = webServer.httpServer;
    self.clients = {};
};

SocketServer.prototype.start = function() {
    var self = this;
    var io = SocketIO(self.httpServer);
    io.on('connection', function(socket) {
        console.log("connection:" + socket.id);
        self.clients[socket.id] = socket;
        socket.on('data', function(data) {
            console.log(data);
        });
        socket.emit('data', [{
            "url": "",
            "type": 1
        }]);
        socket.on('disconnect', function() {
            console.log("disconnect:" + socket.id);
            self.clients[socket.id] = null;
            delete self.clients[socket.id];
        });
        console.log("目前共有" + Object.getOwnPropertyNames(self.clients).length + '个连接');
    });
};