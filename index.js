var Server = require('./lib/server');
var server = new Server();
server.start(function(err, info) {
    if (err) {
        console.error(err);
    } else {
        console.log(info);
    }
});