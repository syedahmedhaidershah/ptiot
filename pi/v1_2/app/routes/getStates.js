/* eslint-disable prefer-const */
var ObjectID = require("mongodb").ObjectID;
module.exports = function(app,db){
	app.post("/getstates", (req, res) => {
		if (req.body.type == "controller") {
			let key = req.body.key;
			if (!global.rooms.hasOwnProperty("key")){
				res.sendStatus(403);
				return false;
			}
			let room = global.rooms[key]._id;
			let response = {};
			let iterator = 0;
			if (global.devices.devices.hasOwnProperty(room)) {
				let thisobj = global.devices.devices[room];
				Object.keys(thisobj).forEach(function (r) {
					if (thisobj[r].type == "dimmable") {
						response[iterator.toString()] = parseInt(thisobj[r].name.split(" ")[1]);
						if (thisobj[r].state) {
							response[iterator.toString()] = thisobj[r].attr.current.toString();
						} else {
							response[iterator.toString()] = "0";
						}
						iterator++;
					}
				});
			}
			response = JSON.stringify(response);
			res.send(response);
			db.collection("sensors").updateOne({ parent: new ObjectID(room) }, { $set: { value: req.body.temperature } });
		}
	});
};