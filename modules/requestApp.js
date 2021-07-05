//===============
//Modules Import
//===============
const fs = require("fs");
const path = require("path");

//get and response initial html
function appStart(response, request) {
    //server logging
    console.log("Website Started...");
    //
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end();
    //function logic
    //readHTML("./html/index.htm", response);
}

//route static assets
function appStaticFiles(response, request) {
    //server logging
    console.log("Handling static assets route...");
    var pathParts = request.url.split("/");
    if (pathParts[pathParts.length - 1].split(".")[1] != null) {
        var requestPathPart = pathParts[1];
        switch (requestPathPart) {
            case "css":
                console.log("--Static Asset => " + requestPathPart);

                try {
                    if (fs.existsSync(process.cwd() + request.url)) {
                        //file exists
                        response.writeHead(200, { "Content-Type": "text/css" });
                        response.write(fs.readFileSync(process.cwd() + request.url, "utf8"));
                    }
                } catch (err) {
                    response.writeHead(404, { "Content-Type": "text/plain" });
                    response.write("Resource not found!");
                }


                break;
            case "js":
                console.log("--Static Asset => " + requestPathPart);

                try {
                    if (fs.existsSync(process.cwd() + request.url)) {
                        //file exists
                        response.writeHead(200, { "Content-Type": "text/javascript" });
                        response.write(fs.readFileSync(process.cwd() + request.url, "utf8"));
                    }
                } catch (err) {
                    response.writeHead(404, { "Content-Type": "text/plain" });
                    response.write("Resource not found!");
                }
                break;
            case "images":
                console.log("--Static Asset => " + requestPathPart);

                var pathext = path.extname(request.url);
                if (pathext == ".jpg") {
                    console.log("--Asset Type => " + pathext);
                    try {
                        if (fs.existsSync(process.cwd() + request.url)) {
                            //file exists
                            response.writeHead(200, { "Content-Type": "image/jpeg" });
                            response.write(fs.readFileSync(process.cwd() + request.url));
                        }
                    } catch (err) {
                        response.writeHead(404, { "Content-Type": "text/plain" });
                        response.write("Resource not found!");
                    }
                }
                else if (pathext == ".png") {
                    console.log("--Asset Type => " + pathext);
                    try {
                        if (fs.existsSync(process.cwd() + request.url)) {
                            //file exists
                            response.writeHead(200, { "Content-Type": "image/png" });
                            response.write(fs.readFileSync(process.cwd() + request.url));
                        }
                    } catch (err) {
                        response.writeHead(404, { "Content-Type": "text/plain" });
                        response.write("Resource not found!");
                    }
                }
                else {
                    console.log("--Asset Type => " + pathext + " (ERROR: Not Supported!)");
                    response.writeHead(404, { "Content-Type": "text/plain" });
                    response.write("Resource not found!");
                }

                break;
            default:
                console.log("--No Static Asset Found");

                response.writeHead(404, { "Content-Type": "text/plain" });
                response.write("Resource not found!");
                break;
        }
        response.end();
    }
    else {
        response.writeHead(403, { 'Content-Type': 'text/plain' });
        response.write("Requested resource is fobidden!");
        response.end();
    }


}

//get html and response
function readHTML(path, response) {
    fs.readFile(path, function (error, pageData) {
        if (error) {
            console.log("--RESPONSE ERROR:" + error.message);
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.write(error.message);
            response.end();

        } else {
            console.log("--Response Data ==> " + pageData);
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(pageData);
        }
    });
}

//exports
exports.appStart = appStart;
//exports.appStaticFiles = appStaticFiles;