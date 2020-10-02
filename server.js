'use strict';

//===============
//Modules Import
//===============
var http = require('http');
var url = require("url");
//
//--- Global ---
var port = process.env.PORT || 1337;

//
//
function startServer(route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;

		//server logging
		console.log("Request for " + pathname + " received.");

		route(pathname, handle, response, request);

	}
	http.createServer(onRequest).listen(port);
	console.log("Server has started.");
	console.log('Process ID:', process.pid);
}

// export the function
exports.startServer = startServer;
