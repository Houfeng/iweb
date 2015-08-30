var pkg = require('../../package.json');
module.exports.exec = function(socketServer) {
    socketServer.on('connection', function(client) {
        client.execCommand({
            name: 'importScript',
            args: ['/-dev/inspector/target/target-script-min.js#' + pkg.name]
        });
    });
};