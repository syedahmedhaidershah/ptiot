var ObjectId = require("mongodb").ObjectID;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(ioClient, database){
	ioClient.on( global.prefExtern.object.instance , function (d) {
		switch(d.forwarded){
		case "devicetoggled":
			Object.keys(global.rooms).forEach(function(a){
				if(global.rooms[a]._id == d.room){
					var jsonString = JSON.stringify({"command":"toggled", "device" : d.switch});
					var xhr = new XMLHttpRequest();
					xhr.open("POST", "http://"+ global.rooms[a].ip + "/update", true);
					xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
					xhr.send(jsonString);
				}
			});
			break;
		default:
			break;
		}
	});
}