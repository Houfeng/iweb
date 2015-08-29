var pkg = require('../../package.json');

var Filter = module.exports = function() {};

Filter.prototype.onRequestEnd = function(context, next) {
    var html_mime = context.server.mime('.html');
    if (context.response.mime == html_mime &&
        context.response.contentStream &&
        context.stopInjection != true) {
        var buffer = '';
        context.response.contentStream.on('data', function(chunk) {
            buffer += chunk;
        });
        context.response.contentStream.on('end', function() {
            buffer = buffer.toString();
            var insertText = [];
            insertText.push('<!--' + pkg.name + '-->');
            insertText.push('<script id="iweb-target-script" src="/-dev/common/target-script-min.js#' + pkg.name + '"></script>');
            //insertText.push('<script src="/-dev/inspector/target/target-script-min.js#' + pkg.name + '"></script>');
            insertText.push('<!--/' + pkg.name + '-->');
            insertText.push('</body>');
            buffer = buffer.replace('</body>', insertText.join('\n'));
            context.content(buffer, html_mime);
        });
    } else {
        next();
    }
};

Filter.exp = '^\/';