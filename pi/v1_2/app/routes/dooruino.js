/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
/* eslint-disable indent */
var ObjectID = require("mongodb").ObjectID;
var request = require("request");

module.exports = function(app, db){
	app.post("/dooruino", (req, res) => {
		let comm = req.body.command;
		let key = req.body.key;
		switch (comm) {
			case "roomentered":
				db.collection("dooruinos").aggregate([
					{
						$lookup: {
							from: "arduinos",
							localField: "relative",
							foreignField: "_id",
							as: "arduino_field"
						}
					}, {
						$match: {
							"_id": ObjectID(key)
						}
					}
				]).toArray().then(function (c) {
					if (c.length > 0) {
						db.collection("devices").find({ "parent": ObjectID(c[0].arduino_field[0].relative) }).limit(3).toArray().then((obj) => {
							if (obj) {
								obj.forEach(function (o) {
									try {
										if (!o.state) {
											request.post(`${global.mainserver}:9999/devices/toggle`).form({ _id: o._id.toString() });
										}
									} catch (err) {
										console.log("econnreset skipped");
									}
								});
							} else {
								console.log("object not found");
							}
						});
					}
				});
				break;
			case "roomleft":
				db.collection("dooruinos").aggregate([
					{
						$lookup: {
							from: "arduinos",
							localField: "relative",
							foreignField: "_id",
							as: "arduino_field"
						}
					}, {
						$match: {
							"_id": ObjectID(key)
						}
					}
				]).toArray().then(function (c) {
					if (c.length > 0) {
						db.collection("devices").find({ "parent": ObjectID(c[0].arduino_field[0].relative) }).limit(3).toArray().then((obj) => {
							if (obj) {
								obj.forEach(function (o) {
									try {
										if (o.state) {
											request.post(`${global.mainserver}:9999/devices/toggle`).form({ _id: o._id.toString() });
										}
									} catch (err) {
										console.log("econnreset skipped");
									}
								});
							} else {
								console.log("object not found");
							}
						});
					}
				});
				break;
			default:
				break;
		}
		res.sendStatus(200);
	});
};