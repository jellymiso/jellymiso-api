
var employeeList = {
	"Samuel Frost": {
		"ID": 1,
		"Role": "CEO",
		"Hierarchy": 1,
		"Direct Subordinates": [2]
	},
	"Melanie Dalton": {
		"ID": 2,
		"Role": "CTO",
		"Hierarchy": 2,
		"Direct Subordinates": [3, 4]
	},
	"Niam Witt": {
		"ID": 3,
		"Role": "Tech Lead",
		"Hierarchy": 3,
		"Direct Subordinates": [4, 5, 6, 7]
	},
	"Abdul Nasar": {
		"ID": 4,
		"Role": "Solution Architect",
		"Hierarchy": 3,
		"Direct Subordinates": [5, 6, 8]
	},
	"Alice Homes": {
		"ID": 5,
		"Role": "Senior Software Developer",
		"Hierarchy": 4,
		"Direct Subordinates": [8]
	},
	"Taylor Ballard": {
		"ID": 6,
		"Role": "Senior Software Developer",
		"Hierarchy": 4,
		"Direct Subordinates": [8]
	},
	"Lin Xue": {
		"ID": 7,
		"Role": "Senior Software Tester",
		"Hierarchy": 4,
		"Direct Subordinates": [9,10]
	},
	"Zheng Li Qin": {
		"ID": 8,
		"Role": "Software Developer",
		"Hierarchy": 5
	},
	"Fong Yuen Kay Hannah": {
		"ID": 9,
		"Role": "Software Tester",
		"Hierarchy": 5
	},
	"Daniella Shanmugam": {
		"ID": 10,
		"Role": "Software Tester",
		"Hierarchy": 5
	},
}

var employeeNameList = Object.keys(employeeList);


function getEmployeeList(response, request) {
	//server logging
	console.log("Getting Employee List...");
	//
	response.setHeader('Content-Type', 'application/json');
	response.end(JSON.stringify(employeeNameList));
	//
}


function getEmployeeData(response, request) {
	//server logging
	console.log("Getting Employee Data...");
	//
	var directSubordinates, reqEmployeeData = [];
	var reqEmployee = decodeURIComponent(request.ReqEmployee).toLowerCase();
	//
	for (var i = 0; i < employeeNameList.length; i++) {
		if (employeeNameList[i].toLowerCase() === reqEmployee) {
			//console.log("found data for " + reqEmployee + ":", employeeList[employeeNameList[i]])
			reqEmployeeData.push(employeeList[employeeNameList[i]].Role);
			if (employeeList[employeeNameList[i]]["Direct Subordinates"] !== undefined) {
				directSubordinates = employeeList[employeeNameList[i]]["Direct Subordinates"];
				reqEmployeeData.push({ "Direct Subordinates": [] });
			}
			break;
		}
	}
	//
	if (directSubordinates !== undefined && directSubordinates !== null) {
		for (var i = 0; i < directSubordinates.length; i++) {
			for (var employee in employeeList) {
				if (employeeList.hasOwnProperty(employee)) {
					var employeeData = employeeList[employee];
					if (employeeData.ID === directSubordinates[i]) {
						reqEmployeeData[1]["Direct Subordinates"].push(employee)
					}
				}
			}
		}
	}
	response.writeHead((reqEmployeeData.length ? 200 : 404), { "Content-Type": 'application/json' });
	response.end(JSON.stringify(reqEmployeeData));
	//
}

exports.getEmployeeList = getEmployeeList;
exports.getEmployeeData = getEmployeeData;
