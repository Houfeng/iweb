var fs = require('fs');
var net = require('net');
var dns = require('dns');
var path = require('path');
var nokit = require('nokit-runtime');
var utils = require('weinre/lib/utils');
var dumpingHandler = require('weinre/lib/dumpingHandler');
var channelManager = require('weinre/lib/channelManager');
var serviceManager = require('weinre/lib/serviceManager');
var HttpChannelHandler = require('./inspector/handler');
var pkg = require('../package.json');

var root = path.resolve(__dirname, "./");

//静态目录
var staticFolder = path.resolve(__dirname, '../test');
var port = 8010;

//设定 inspector 一些参数
utils.setOptions({
    readTimeout: 5
});
utils.options.staticWebDir = path.resolve(__dirname, '../node_modules/weinre/web');


//reloader 一些参数
var reloaderStaticWebDir = path.resolve(__dirname, './reloader/web/');

function Server() {
    var self = this;
    self.webServer = new nokit.Server({
        "port": port,
        "root": root,
        "folders": {
            "public": staticFolder
        }
    });

};

Server.prototype.start = function() {
    var self = this;

    serviceManager.registerProxyClass('WeinreClientEvents');
    serviceManager.registerProxyClass('WeinreTargetEvents');
    serviceManager.registerLocalClass('WeinreClientCommands');
    serviceManager.registerLocalClass('WeinreTargetCommands');

    var clientHandler = new HttpChannelHandler('/ws/client');
    var targetHandler = new HttpChannelHandler('/ws/target');
    channelManager.initialize();

    //注入脚本开始
    self.webServer.filter('^\/', {
        "onRequestEnd": function(context, next) {
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
                    insertText.push('<head>');
                    insertText.push('<!--' + pkg.name + '-->');
                    insertText.push('<script src="/-r/target.js#' + pkg.name + '"></script>');
                    insertText.push('<script src="/-i/target/target-script-min.js#' + pkg.name + '"></script>');
                    insertText.push('<!--/' + pkg.name + '-->');
                    buffer = buffer.replace('<head>', insertText.join('\n'));
                    context.content(buffer, html_mime);
                });
            } else {
                next();
            }
        }
    });
    //注入脚本结束

    //处理所有 inspector 请求开始
    self.webServer.filter('^\/-i', {
        "onRequestBegin": function(context, next) {
            context.stopInjection = true;
            if (context.request.url == '/-i' || context.request.url == '/-i/') {
                return context.redirect('/-i/client/#' + pkg.name);
            }
            //临时更改 public 目录
            context.request.publicPath = utils.options.staticWebDir;
            //更改资源 url
            context.request.setUrl(context.request.url.replace('/-i', '/'));
            //向下传递请求流
            next();
        }
    });
    self.webServer.handler("^\/ws\/client(.*)", {
        handle: function(context) {
            //console.log("old uri:"+context.request.url)
            var uri = path.normalize(context.request.url.replace('/ws/client', '/'));
            //console.log("new uri:" + uri);
            return clientHandler.handle(context, uri);
        }
    });
    self.webServer.handler("^\/ws\/target(.*)", {
        handle: function(context) {
            var uri = path.normalize(context.request.url.replace('/ws/target', '/'));
            return targetHandler.handle(context, uri);
        }
    });
    //处理所有 inspector 请求结束

    //处理所有 reloader 请求开始
    self.webServer.filter('^\/-r', {
        "onRequestBegin": function(context, next) {
            context.stopInjection = true;
            if (context.request.url == '/-r') {
                return context.redirect('/-r/');
            }
            //临时更改 public 目录
            context.request.publicPath = reloaderStaticWebDir;
            //更改资源 url
            context.request.setUrl(context.request.url.replace('/-r/', '/'));
            //向下传递请求流
            next();
        }
    });
    //处理所有 reloader 请求结束

    //启动 server
    self.webServer.start.apply(self.webServer, arguments);
};

module.exports = Server;
/*end*/