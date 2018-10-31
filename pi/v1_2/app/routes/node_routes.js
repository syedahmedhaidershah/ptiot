var ObjectID = require("mongodb").ObjectID;
var md5 = require("md5");
var jsonfile = require("jsonfile");
const roomLoc = "config/rooms.json";
const socketsCount = 6;
const dimmable = socketsCount - 2;

module.exports = function(app, db) {
	
	app.post("/arduinoRegister", (req, res) => {
		var arKey = req.body.key;
		if(arKey){
			// var rooms = 
			db.collection("arduinos").findOne({_id : new ObjectID(arKey)}, (err, item) => {
				if(err){
					res.send({
						error : true,
						message : err
					});
				} else {
					if(item && !item.relative){
						var globalPrefs = global.prefExtern.object;
						if(globalPrefs.network){
							var extRooms = db.collection("rooms").find({parent : new ObjectID(globalPrefs.network)});
							extRooms.count().then(function(c){
								var newRoom = {
									_id : new ObjectID(),
									room : "Room "+(c+1),
									parent : new ObjectID(globalPrefs.network)
								};
								db.collection("rooms").insertOne(newRoom, (err, roomItem) => {
									if(err){
										res.send({
											error : true,
											message : err
										});
									} else {
										db.collection("arduinos").updateOne({ _id : new ObjectID(arKey) } , { $set : { relative : new ObjectID(roomItem.insertedId) } } , (err, doneIns) => {
											if(err) {
												console.log(err);
											} else {
												jsonfile.readFile(roomLoc, (err, obj) => {
													if(err){
														console.log(err);
													} else {
														obj.rooms[arKey] = newRoom;
														jsonfile.writeFile(roomLoc, obj, (err, res) => {
															if(err){
																console.log(err);
															}
															var tempSensor = {
																_id : new ObjectID(),
																name : "temperature",
																value : 25,
																parent: new ObjectID(arKey)
															};
															var newDevices = [];
															db.collection("sensors").insertOne(tempSensor, (err, done) => {
																if(err){
																	console.log(err);
																}
															});
															for(var dit = 0; dit < socketsCount; dit++){
																if(dit < dimmable){	
																	newDevices.push({
																		_id : new ObjectID(),
																		name : "Device "+dit,
																		type: "binary",
																		state: false,
																		attr: {},
																		parent: newRoom._id
																	});
																} else {
																	newDevices.push({
																		_id : new ObjectID(),
																		name : "Device "+dit,
																		type: "dimmable",
																		state: false,
																		attr: {
																			max : 5,
																			current : 0
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
	
	app.post("/reviveArduino", (req, res) => {
		var arduinoIp = req.connection.remoteAddress.split("::ffff:")[1];
		var arKey = req.body.key;
		jsonfile.readFile(roomLoc, (err, obj) => {
			if(err){
				res.sendStatus(500);
				console.log(err);
			} else {
				if(obj.rooms.hasOwnProperty(arKey)){
					if(obj.rooms[arKey].ip != arduinoIp){
						obj.rooms[arKey].ip = arduinoIp;
						jsonfile.writeFile(roomLoc, obj, (err, res) => {
							if(err){
								res.sendStatus(500);
								console.log(err);
							} else {
								if(res){
									res.sendStatus(200);
								}
							}
						});
					}	
				}
			}
		});
	});

	app.post("/resetPi", (req, res) => {
		var prefloc = "config/prefs.json";
		jsonfile.writeFile(prefloc, {} , (err, res) => {
			if(err){
				res.send({
					error: true,
					message: err
				});
			} else {
				jsonfile.writeFile(roomLoc, {"rooms" : {}} , (err, res) => {
					if(err){
						res.send({
							error: true,
							message: err
						});
					} else {
						if(res){
							res.send({
								error: false,
								message: "Pi has been reset"
							});
						}
					}
				});
			}
		});
	});

	app.post("/getstates", (req, res) => {
		if(req.body.type == "controller"){
			const key = req.body.key;
			db.collection("arduinos").findOne({_id: ObjectID(key)}, (err, obj) => {
				if(err){
					res.sendStatus(404);
				} else {
					db.collection("devices").find({ parent: obj.relative, type: "dimmable"}).toArray().then(function(o){
						if(o.length > 0){
							let response = {};
							let iterator = 0;
							o.forEach(function(thisobj){
								response[iterator.toString()] = parseInt(thisobj.name.split(" ")[1]);
								iterator++;
								response[iterator.toString()] = parseInt(thisobj.attr.current);
								iterator++;
							});
							res.send(response);
						} else {
							res.sendStatus(404);
						}
					});
				}
			});
		}
	});

	app.post("/test", (req,res) => {
		res.sendStatus(200);
	});

	app.post("/", (req, res) => {
		res.send({
			error : false,
			message : "systemok. 200"
		});
	});

	app.get("/", (req, res) => {
		res.send({
			error : false,
			message : "systemok. 200"
		});
	});

	app.get("*", (req, res) => {
		res.send({
			error : false,
			message : "systemok. 200"
		});
	});
	
	app.post("*", (req, res) => {
		res.send({
			error : false,
			message : "systemok. 200"
		});
	});
};