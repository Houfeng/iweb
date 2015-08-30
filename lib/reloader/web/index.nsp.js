var Index = module.exports = function() {};

Index.prototype.load = function() {
    var self = this;
    self.render();
};

Index.prototype.refrestPage = function(id) {
    var self = this;
    if (self.server.socketServer) {
        var client = self.server.socketServer.clients[id];
        if (client) {
            client.execCommand({
                name: "refreshPage"
            });
        };
    }
    setTimeout(function() {
        self.render();
    }, 1000);
};