#!/usr/bin/env node

var iweb = require('../');
var CmdLine = require('cmdline');
var pkg = require('../package.json');

var cml = new CmdLine();

if (cml.options.has('-v')) {
    console.log(pkg.version);
} else {
    var server = new iweb.Server({
        port: cml.args[0],
        folder: cml.args[1]
    });

    server.start(function(err, info) {
        if (err) {
            console.error(err);
        } else {
            console.log(info);
        }
    });
}