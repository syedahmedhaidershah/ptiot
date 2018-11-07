var ObjectId = require("mongodb").ObjectID;
// var jsonFile = require("jsonfile");
// var devTypes = "config/devicetypes.json";
var md5 = require("md5");

module.exports = function (app, db) {
	// route for logging in a user
	app.post("/login/", (req, res) => {
		const username = req.body.username;
		const password = req.body.password;
		const uIns = { "username": username, "password": password};
		db.collection("creds").findOne(uIns, (err, item) => {
			if (item != null) {
				if (err) {
					res.send({
						"error": true,
						"message": 0x00000001
					});
				} else {
					var useDate = new Date();
					var itemId = item._id;
					var loggedIn = {
						"_id": new ObjectId(),
						"creator": itemId,
						"value": md5(itemId + useDate),
						"creation": useDate
					};
					db.collection("tokens").insertOne(loggedIn, (err, loggedInIns) => {
						if (err) {
							res.send({
								"error": true,
								"message": 625,
								"instance": 1
							});
						} else if (loggedInIns.insertedCount > 0) {
							loggedIn.msg = "success";
							res.send({
								error: false,
								message: loggedIn
							});
						}
					});
				}
			} else {
				res.send({
					"error": true,
					"message": 625,
					"instance": 1
				});
			}
		});
	});

	// route for searching for a specific sensor
	app.post("/sensors/search", (req, res) => {
		var sensId = req.body._id;
		db.collection("sensors").findOne({ _id: ObjectId(sensId) }, (err, item) => {
			if (err) {
				res.send({
					error: true,
					message: err
				});
			} else {
				res.send({
					error: false,
					message: item
				});
			}
		});
	});

	// route for updating a sensor's values
	app.post("/sensors/update", (req, res) => {
		var id = req.body._id;
		var rvalue = req.body.value;
		var myquery = { _id: ObjectId(id) };
		var newvalues = { $set: { value: rvalue } };
		db.collection("sensors").updateOne(myquery, newvalues, (err, item) => {
			if (err) {
				res.send({
					error: true,
					message: err
				});
			} else {
				res.send({
					error: false,
					message: "Updated Successfully"
				});
			}
		});
	});

	//route for adding a sensor
	app.post("/sensors/add", (req, res) => {
		db.collection("sensors").insertOne(req.body, (err, item) => {
			if (err) {
				res.send({
					error: true,
					message: err
				});
			} else {
				res.send({
					error: false,
					message: "Added Successfully",
					object : item
				});
			}
		});
	});

	app.post("/devices/get/byid", (req, res) => {
		var id = req.body._id;
		db.collection("devices").findOne({ _id: new ObjectId(id) }, (err, obj) => {
			if (err) {
				res.send({
					error: true,
					message: err
				});
			} else {
				res.send({
					error: false,
					message: obj
				});
			}
		});
	});

	app.post("/devices/get/byparent", (req, res) => {
		var id = req.body._id;
		const data = db.collection("devices").find({ parent: new ObjectId(id) });
		response = [];
		data.toArray().then(function (o) {
			const allow = ["0", "1", "2", "4"];
			o.forEach(function (t) {
				response.push(t);
			});
			res.send({
				error: false,
				message: response
			});
		});
	});

	app.post("/devices/get/byuser", (req, res) => {
		const username = req.body.username;
		const password = req.body.password;
		const creds = { username: username, password: password };
		db.collection("creds").findOne(creds, (err, obj) => {
			if (err) {
				res.send({
					error: true,
					message: err
				});
			} else if (obj) {
				db.collection("instances").aggregate([
					{
						$lookup: {
							from: "networks",
							localField: "relative",
							foreignField: "_id",
							as: "net_field"
						}
					},
					{
						$match: {
							"_id": obj.relative
						}
					}
				]).toArray().then(function (o) {
					if (o.length > 0) {
						var rooms = [];
						db.collection("rooms").find({ parent: o[0].net_field[0]._id }).toArray().then(function (arr) {
							let iterator = 0;
							const len = arr.length;
							arr.forEach(function (r) {
								db.collection("devices").find({ parent: r._id }).toArray().then(function (d) {
									const pushjson = {};
									pushjson[r._id] = d;
									rooms.push(pushjson);
									iterator++;
									if (iterator >= len) {
										res.send({
											error: false,
											message: rooms
										});
									}
								});
							});
						});
					}
				});
			} else {
				res.send("no such user");
			}
		});
	});


    app.post("/devices/dim", (req, res) => {
        let id = req.body._id;
        let current = parseInt(req.body.current);
        let myquery = { _id: new ObjectId(id) };
        let pushquery = { $set: { "attr.current": current } };
        if (current == 0) {
            pushquery.$set.state = false;
        } else {
            pushquery.$set.state = true;
        }
        db.collection("devices").updateOne(myquery, pushquery, (err, obj) => {
            if (err) {
                res.send({
                    err: true,
                    message: err
                });
            } else {
                //db.collection("devices").findOne(myquery, (err, devitem) => {
                //    if (err) {
                //        console.log(err); return false;
                //    } else if (!devitem) {
                //        console.log('item is null'); return false;
                //    } else {
                        res.send({
                            error: false,
                            message: current
                        });
                        //db.collection("rooms").aggregate([
                        //    {
                        //        $lookup: {
                        //            from: "devices",
                        //            localField: "_id",
                        //            foreignField: "parent",
                        //            as: "dev_item"
                        //        }
                        //    },
                        //    {
                        //        $match: {
                        //            "dev_item._id": myquery._id
                        //        }
                        //    }
                        //]).toArray().then(function (c) {
                        //    if (c.length > 0) {
                        //        db.collection("instances").aggregate([
                        //            {
                        //                $lookup: {
                        //                    from: "rooms",
                        //                    localField: "relative",
                        //                    foreignField: "parent",
                        //                    as: "room_field"
                        //                }
                        //            },
                        //            {
                        //                $match: {
                        //                    "room_field.parent": c[0].parent
                        //                }
                        //            }
                        //        ]).toArray().then(function (o) {
                        //            if (o.length > 0) {
                        //                global.msgsocket.emit('forward', {
                        //                    id: o[0]._id,
                        //                    data: {
                        //                        forwarded: 'devicedimmed',
                        //                        error: false,
                        //                        device: id,
                        //                        current: current,
                        //                        switch: devitem.name.split(" ")[1],
                        //                        msg: devitem.state,
                        //                        room: c[0]._id
                        //                    }
                        //                });
                        //            }
                        //        });
                        //    }
                        //});
                    //}
                //});
            }
        });
    });

	// route for toggling a device
	app.post("/devices/toggle", (req, res) => {
		var id = req.body._id;
		var myquery = { _id: ObjectId(id) };
		db.collection("devices").findOne(myquery, (err, devitem) => {
			if (err) {
				console.log(err); return false;
			} else if (!devitem) {
				console.log("item is null"); return false;
			}
			var newvalues = { $set: { state: !devitem.state } };
			var currState = !devitem.state;
			db.collection("devices").updateOne(myquery, newvalues, (err, item) => {
				if (err) {
					res.send({
						error: true,
						message: err
					});
				} else {
					res.send({
						error: false,
						message: "Updated Successfully"
					});
					db.collection("rooms").aggregate([
						{
							$lookup: {
								from: "devices",
								localField: "_id",
								foreignField: "parent",
								as: "dev_item"
							}
						},
						{
							$match: {
								"dev_item._id": myquery._id
							}
						}
					]).toArray().then(function (c) {
						if (c.length > 0) {
							db.collection("instances").aggregate([
								{
									$lookup: {
										from: "rooms",
										localField: "relative",
										foreignField: "parent",
										as: "room_field"
									}
								},
								{
									$match: {
										"room_field.parent": c[0].parent
									}
								}
							]).toArray().then(function (o) {
								if (o.length > 0) {
									global.msgsocket.emit("forward", {
										id: o[0]._id,
										data: {
											forwarded: "devicetoggled",
											error: false,
											device: id,
                                            switch: devitem.name.split(" ")[1],
                                            msg: currState,
											room: c[0]._id
										}
									});
								}
							});
						}
					});
				}
			});
		});
	});

	//Route #10
	app.post("/devices/rename", (req, res) => {
		var id = req.body._id;
		var name = req.body.name;
		var myquery = { _id: ObjectId(id) };
		var newvalues = { $set: { name: name } };
		db.collection("devices").updateOne(myquery, newvalues, (err, item) => {
			if (err) {
				res.send({
					error: true,
					message: err
				});
			} else {
				res.send({
					error: false,
					message: "Updated Successfully"
				});
				db.collection("rooms").aggregate([
					{
						$lookup: {
							from: "devices",
							localField: "_id",
							foreignField: "parent",
							as: "dev_item"
						}
					},
					{
						$match: {
							"dev_item._id": myquery._id
						}
					}
				]).toArray().then(function (c) {
					if (c.length > 0) {
						db.collection("instances").aggregate([
							{
								$lookup: {
									from: "rooms",
									localField: "relative",
									foreignField: "parent",
									as: "room_field"
								}
							},
							{
								$match: {
									"room_field.parent": c[0].parent
								}
							}
						]).toArray().then(function (o) {
							if (o.length > 0) {
								global.msgsocket.emit("forward", {
									id: o[0]._id,
									data: {
										forwarded: "devicerenamed",
										error: false,
										device: id,
										msg: name
									}
								});
							}
						});
					}
				});
			}
		});
	});
	//Route #05
	app.post("/rooms/rename", (req, res) => {
		var id = req.body._id;
		var name = req.body.name;
		var myquery = { _id: ObjectId(id) };
		var newvalues = { $set: { name: name } };
		db.collection("rooms").updateOne(myquery, newvalues, (err, item) => {
			if (err) {
				res.send({
					error: true,
					message: err
				});
			} else {
				res.send({
					error: false,
					message: "Updated Successfully"
				});
				db.collection("instances").aggregate([
					{
						$lookup: {
							from: "rooms",
							localField: "relative",
							foreignField: "parent",
							as: "room_field"
						}
					},
					{
						$match: {
							"room_field.parent": id
						}
					}
				]).toArray().then(function (o) {
					if (o.length > 0) {
						global.msgsocket.emit("forward", {
							id: o[0]._id,
							data: {
								forwarded: "roomrenamed",
								error: false,
								device: id,
								msg: name
							}
						});
					}
				});
			}
		});
	});
	//Route #06
	app.post("/rooms/devices", (req, res) => {
		var pid = req.body.parent;
		var query = { parent: ObjectId(pid) };
		db.collection("devices").find(query).toArray(function (err, result) {
			if (err) {
				res.send({
					error: true,
					message: err
				});
			} else {
				res.send({
					error: false,
					message: result
				});
			}
		});
	});
	//Route #07
	app.post("/rooms/sensors", (req, res) => {
		var pid = req.body._id;
		var query = { parent: ObjectId(pid) };
		db.collection("sensors").find(query).toArray(function (err, result) {
			if (err) {
				res.send({
					error: true,
					message: err
				});
			} else {
				res.send({
					error: false,
					message: result
				});
			}
		});
	});
	//Route # 11
	app.post("/control/ac/temperature", (req, res) => {
		var id = req.body._id;
		var temp = req.body.temperature;
		var myquery = { _id: ObjectId(id) };
		var newvalues = { $set: { temperature: temp } };
		db.collection("devices").updateOne(myquery, newvalues, (err, item) => {
			if (err) {
				res.send({
					error: true,
					message: err
				});
			} else {
				res.send({
					error: false,
					message: "Updated Successfully"
				});
			}
		});
	});
	//Route # 12
	app.post("/control/ac/swing/vertical_lower", (req, res) => {
		var id = req.body._id;
		var vertical_lower = req.body.vertical_lower;
		var myquery = { _id: ObjectId(id) };
		var newvalues;
		if (vertical_lower == "up") {
			newvalues = { $inc: { vertical_lower: 10 } };
		}
		else {
			newvalues = { $inc: { vertical_lower: -10 } };
		}
		db.collection("devices").updateOne(myquery, newvalues, (err, item) => {
			if (err) {
				res.send({
					error: true,
					message: err
				});
			} else {
				res.send({
					error: false,
					message: "Updated Successfully"
				});
			}
		});
	});

	app.post("/control/ac/swing/horizontal_lower", (req, res) => {
		var id = req.body._id;
		var horizontal_lower = req.body.horizontal_lower;
		var myquery = { _id: ObjectId(id) };
		var newvalues;
		if (horizontal_lower == "right") {
			newvalues = { $inc: { horizontal_lower: 10 } };
		}
		else {
			newvalues = { $inc: { horizontal_lower: -10 } };
		}
		db.collection("devices").updateOne(myquery, newvalues, (err, item) => {
			if (err) {
				res.send({
					error: true,
					message: err
				});
			} else {
				res.send({
					error: false,
					message: "Updated Successfully"
				});
			}
		});
	});

	app.post("/", (req, res) => {
		res.send({
			error: true,
			message : "systemok. 200"
		});
	});

	app.get("/", (req, res) => {
		res.send({
			error: true,
			message : "systemok. 200"
		});
	});

	app.get("*", (req, res) => {
		res.send({
			error: true,
			message : "systemok. 200"
		});
	});

	app.post("*", (req, res) => {
		res.send({
			error: true,
			message : "systemok. 200"
		});
	});
};