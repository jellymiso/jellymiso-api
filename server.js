//===============
//Modules Import
//===============
var http = require("http");
var url = require("url");
//
//--- Global ---
var port = process.env.PORT || 1337; //For Heroku
//var port = 41130; //For Development
//
function startServer(route, handle) {
    function onRequest(request, response) {

        /***************
         *   HEADERS   *
         ***************/
        // Website you wish to allow to connect
        response.setHeader('Access-Control-Allow-Origin', '*');
        // Request methods you wish to allow for Preflight
        response.setHeader('Access-Control-Request-Method', '*');
        // Request methods you wish to allow
        response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
        // Request headers you wish to allow
        response.setHeader('Access-Control-Allow-Headers', '*');
        // Set to true if you need the website to include cookies in the requests sent
		// to the API (e.g. in case you use sessions)
		//request.setHeader('Access-Control-Allow-Credentials', false);
        if (request.method === 'OPTIONS') {
            response.writeHead(200);
            response.end();
            return;
        }
        var pathname = url.parse(request.url).pathname;

        //server logging
        console.log("Request for " + pathname + " received.");
        //request.setEncoding('utf8');

        route(pathname, handle, response, request);

    }
    http.createServer(onRequest).listen(port);
    console.log("Server has started.");
    console.log('Process ID:', process.pid);
}

//startServer(router, handle);
// export the function
exports.startServer = startServer;
