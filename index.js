//===============
//Modules Import
//===============
var server = require("./server");
var router = require("./router");
var requestApp = require("./modules/requestApp");
var requestMail = require("./modules/requestMail");
var requestMisc = require("./modules/requestMisc");
//
var handle = {};

handle["/"] = requestApp.appStart;
// handle["/css"] = requestApp.appStaticFiles;
// handle["/js"] = requestApp.appStaticFiles;
// handle["/images"] = requestApp.appStaticFiles;
handle["/mail"] = requestMail.apiMail;
handle["/misc"] = requestMisc.apiMisc;
//
server.startServer(router.route, handle);