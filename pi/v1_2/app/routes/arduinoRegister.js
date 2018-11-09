/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
var ObjectID = require("mongodb").ObjectID;
var jsonfile = require("jsonfile");
const roomLoc = "config/rooms.json";
const socketsCount = 8;
const dimmable = socketsCount - 2;

module.exports = function (app, db) {
	app.post("/arduinoRegister", (req, res) => {
		var arKey = req.body.key;
		if (arKey) {
			console.log(arKey);
			res.sendStatus(200);
			return false;
			// var rooms = 
			db.collection("arduinos").findOne({ _id: new ObjectID(arKey) }, (err, item) => {
				if (err) {
					res.send({
						error: true,
						message: err
					});
				} else {
					if (item && !item.relative) {
						var globalPrefs = global.prefExtern.object;
						if (globalPrefs.network) {
							var extRooms = db.collection("rooms").find({ parent: new ObjectID(globalPrefs.network) });
							extRooms.count().then(function (c) {
								var newRoom = {
									_id: new ObjectID(),
									room: "Room " + (c + 1),
									parent: new ObjectID(globalPrefs.network)
								};
								db.collection("rooms").insertOne(newRoom, (err, roomItem) => {
									if (err) {
										res.send({
											error: true,
											message: err
										});
									} else {
										db.collection("arduinos").updateOne({ _id: new ObjectID(arKey) }, { $set: { relative: new ObjectID(roomItem.insertedId) } }, (err, doneIns) => {
											if (err) {
												console.log(err);
											} else {
												jsonfile.readFile(roomLoc, (err, obj) => {
													if (err) {
														console.log(err);
													} else {
														obj.rooms[arKey] = newRoom;
														jsonfile.writeFile(roomLoc, obj, (err, res) => {
															if (err) {
																console.log(err);
															}
															var tempSensor = {
																_id: new ObjectID(),
																name: "temperature",
																value: 25,
																parent: new ObjectID(newRoom._id)
															};
															db.collection("sensors").insertOne(tempSensor, (err, done) => {
																if (err) {
																	console.log(err);
																}
															});
															var newDevices = [];
															for (var dit = 0; dit < socketsCount; dit++) {
																if (dit < dimmable) {
																	newDevices.push({
																		_id: new ObjectID(),
																		name: "Device " + dit,
																		type: "binary",
																		state: false,
																		attr: {},
																		parent: newRoom._id
																	});
																} else {
																	newDevices.push({
																		_id: new ObjectID(),
																		name: "Device " + dit,
																		type: "dimmable",
																		state: false,
																		attr: {
																			max: 5,
																			current: 0
																		},
																		parent: newRoom._id
																	});
																}
															}
															db.collection("devices").insertMany(newDevices);
														});
													}
												});
											}
										});
									}
								});
							});
						}
					}
				}
			});
		}
		res.sendStatus(200);
	});
};