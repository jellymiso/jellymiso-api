//===============
//Modules Import
//===============
var server = require("./server");
var router = require("./router");
var requestHandler = require("./requestHandlers");
//
var handle = {};

handle["/"] = requestHandler.appStart;
handle["/api/employees"] = requestHandler.getEmployeeList;
handle["/api/employees/"] = requestHandler.getEmployeeData;
//
server.startServer(router.route, handle);
