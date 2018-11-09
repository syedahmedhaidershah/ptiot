/* eslint-disable indent */
/* eslint-disable no-unused-vars */
var ObjectId = require("mongodb").ObjectID;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(ioClient, database){
	ioClient.on( global.prefExtern.object.instance , function (d) {
		switch(d.forwarded){
			case "devicetoggled":
				Object.keys(global.rooms).forEach(function(a){
					if(global.rooms[a]._id == d.room){
						var jsonString = JSON.stringify({"command":"toggled", "device" : d.switch, "switch": d.msg});
						var xhr = new XMLHttpRequest();
						xhr.open("POST", "http://"+ global.rooms[a].ip + "/update", true);
						xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
						xhr.send(jsonString);
					}
				});
				break;
			case "devicedimmed":
				// Object.keys(global.rooms).forEach(function(a){
				// 	// revise this section : set for mpitch	/////////////////////////////////////////////////////////////
				// 	if(global.rooms[a]._id == d.room){
				// 		let current = d.current;
				// 		let switcher = d.switch;
				// 		var jsonString = JSON.stringify({"command":"toggled"});
				// 		var xhr = new XMLHttpRequest();
				// 		switch(switcher){
				// 			case "4":
				// 				jsonString.dim = d.current;
				// 				break;
				// 			case 4:
				// 				jsonString.dim = d.current;
				// 				break;
				// 			default:
				// 				break;
				// 		}
				// 		xhr.open("POST", "http://"+ global.rooms[a].ip + "/dim", true);
				// 		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				// 		xhr.send(jsonString);
				// 	}
				// 	//////////////////////////////////////////////////////////////////////////////////////////////////////
				// });
				break;
			default:
				break;
		}
	});
};