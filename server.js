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
//
function startServer(route, handle) {
	function onRequest(request, response) {
		// Website you wish to allow to connect
		response.setHeader('Access-Control-Allow-Origin', '*');

		// Request methods you wish to allow
		//request.setHeader('Access-Control-Allow-Methods', '*');

		// Request headers you wish to allow
		//request.setHeader('Access-Control-Allow-Headers', 'content-type');

		// Set to true if you need the website to include cookies in the requests sent
		// to the API (e.g. in case you use sessions)
		//request.setHeader('Access-Control-Allow-Credentials', false);

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
