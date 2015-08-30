var SocketIO = require('socket.io');
var util = require("util");
var events = require("events"); //EventEmitter通过events模块来访问  

var SocketServer = module.exports = function(webServer) {
    var self = this;
    events.EventEmitter.call(self);
    self.webServer = webServer;
    self.httpServer = webServer.httpServer;
    self.clients = {};
    webServer.socketServer = self;
    webServer.on('start', function() {
        self.start();
    });
};

util.inherits(SocketServer, events.EventEmitter); //使这个类继承EventEmitter 

SocketServer.prototype.start = function() {
    var self = this;
    var io = SocketIO(self.httpServer);
    io.on('connection', function(socket) {
        socket.execCommand = function(cmd) {
            self.execCommand(socket, cmd);
        };
        self.clients[socket.id] = socket;
        self.emit('connection', socket);
        socket.on('disconnect', function() {
            self.clients[socket.id] = null;
            delete self.clients[socket.id];
        });
        socket.on('pageInfo', function(pageInfo) {
            socket.pageInfo = pageInfo;
            self.emit('pageInfo', socket);
        });
    });
    self.emit('start', self);
};

SocketServer.prototype.execCommand = function(client, cmd) {
    var self = this;
    if (!client) return;
    client.emit('command', cmd);
};