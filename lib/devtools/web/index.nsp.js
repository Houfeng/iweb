var os = require('os');
var networkInterfaces = os.getNetworkInterfaces();

var Index = module.exports = function() {};

Index.prototype.init = function() {
    var self = this;
    self.port = self.server.configs.port;
    self.ready();
};

Index.prototype.load = function() {
    var self = this;
    self.localIpArray = self.getLocalIpArray();
    self.render();
};

Index.prototype.getLocalIpArray = function() {
    var self = this;
    var buffer = [];
    for (var name in networkInterfaces) {
        var nif = networkInterfaces[name];
        nif.forEach(function(item) {
            buffer.push(item.address);
        });
    }
    return buffer;
};

Index.prototype.switchLocalIp = function() {
    var self = this;
    self.render();
};