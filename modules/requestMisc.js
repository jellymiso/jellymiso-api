//===============
//Modules Import
//===============
const fs = require("fs");
const http = require("http");
const path = require("path");
const qs = require('querystring');
const employees = require('../data/employees');
const funcHelper = require('../funcHelper');


// var requestPathPart = pathname;
// if (requestPathPart.includes("/api/employees/") && pathname.replace("/api/employees/", "").length) {
//     requestPathPart = "/api/employees/";
//     request.ReqEmployee = pathname.replace(requestPathPart, "")
// }
// else if (requestPathPart.includes("/api/employees/")) {
//     requestPathPart = "/api/employees";
// }


//url format: /[api-module]/[api-name]/[params]
//example: /misc/getEmployeeData/John%20Smith

function apiMisc(response, request) {
    console.log("---===###| api MISC module fired! |###===---");
    var reqURL = decodeURIComponent(request.url).toLowerCase();
    var apiModule = "/misc";
    var apiParams = "";
    if ((reqURL.match(/\//g) || []).length > 3
        || ((reqURL.match(/\//g) || []).length === 3 && reqURL.slice(-1) !== "/")
    ) {
        var thirdSlashCharPos = funcHelper.indexOfNth(reqURL, "/", 3);
        apiParams = reqURL.substring(thirdSlashCharPos, reqURL.length).replace(/\//g, '');
    }
    var apiName = reqURL.replace(apiModule, "").replace(apiParams, "").replace(/\//g, '');

    console.log("~==> api module name: ", apiName);
    if (apiParams !== "") {
        console.log("~==> api params: ", apiParams)
    }

    switch (apiName) {
        
        case "employees":
            console.log("~==> Executing module...")
            var employeeNameList = Object.keys(employees);
            //
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(employeeNameList));
            //
            console.log("~==> Execution Completed!")
            //
            break;
            
        case "employee":
            console.log("~==> Executing module...")

            var employeeNameList = Object.keys(employees);
            var directSubordinates, reqEmployeeData = [];
            var reqEmployee = apiParams;
            var isExistingEmployee = false;
            //
            for (var i = 0; i < employeeNameList.length; i++) {
                if (employeeNameList[i].toLowerCase() === reqEmployee) {
                    isExistingEmployee = true;

                    //console.log("found data for " + reqEmployee + ":", employees[employeeNameList[i]])
                    reqEmployeeData.push(employees[employeeNameList[i]].Role);
                    if (employees[employeeNameList[i]]["Direct Subordinates"] !== undefined) {
                        directSubordinates = employees[employeeNameList[i]]["Direct Subordinates"];
                        reqEmployeeData.push({ "Direct Subordinates": [] });
                    }
                    break;
                }
            }
            //
            if (directSubordinates !== undefined && directSubordinates !== null) {
                for (var i = 0; i < directSubordinates.length; i++) {
                    for (var employee in employees) {
                        if (employees.hasOwnProperty(employee)) {
                            var employeeData = employees[employee];
                            if (employeeData.ID === directSubordinates[i]) {
                                reqEmployeeData[1]["Direct Subordinates"].push(employee)
                            }
                        }
                    }
                }
            }
            //
            if (isExistingEmployee){
                response.writeHead(200, { "Content-Type": "application/json" });
                response.end(JSON.stringify(reqEmployeeData));
            }
            else{
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.write("The resource you have requested is not available.");
                response.end();
            }
            //
            console.log("~==> Execution Completed!")
            //
            break;
           
        default:
            console.log("~==> Module not found!")

            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.write("The resource you have requested is not available.");
            response.end();
            break;
    }
}


//exports
exports.apiMisc = apiMisc;