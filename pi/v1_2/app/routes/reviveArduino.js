/* eslint-disable no-empty */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
var jsonfile = require("jsonfile");
const roomLoc = "config/rooms.json";
const dimmableDevices = ["6", "7"];

module.exports = function(app){
	app.post("/reviveArduino", (req, res) => {
		var arduinoIp = req.connection.remoteAddress.split("::ffff:")[1];
		let statusSent = false;
		var arKey = req.body.key;
		jsonfile.readFile(roomLoc, (err, obj) => {
			if (err) {
				res.sendStatus(500);
				console.log(err);
			} else {
				if (obj.rooms.hasOwnProperty(arKey)) {
					if (obj.rooms[arKey].ip != arduinoIp) {
						obj.rooms[arKey].ip = arduinoIp;
						jsonfile.writeFile(roomLoc, obj, (err, obj) => {
							if (err && !statusSent) {
								statusSent != statusSent;
								res.sendStatus(500);
								console.log(err);
							}
						});
					} else {
						try {
							let response = {};
							let thesedevices = global.devices.devices[obj.rooms[arKey]._id];
							Object.keys(thesedevices).forEach(function (device) {
								if (thesedevices[device].type == "binary") {
									let useKey = thesedevices[device].name.split(" ")[1];
									if (!dimmableDevices.includes(useKey)) {
										if (thesedevices[device].state) {
											response[useKey] = "1";
										} else {
											response[useKey] = "0";
										}
									}
								}
							});
							let send = JSON.stringify(response);
							res.send(send);
						} catch (ex) { }
					}
				}
			}
		});
	});
};