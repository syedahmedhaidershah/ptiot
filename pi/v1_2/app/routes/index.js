/* eslint-disable indent */
/* eslint-disable no-empty */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
var ObjectID = require("mongodb").ObjectID;
var md5 = require("md5");
var jsonfile = require("jsonfile");
const roomLoc = "config/rooms.json";
const socketsCount = 8;
const dimmable = socketsCount - 2;
const request = require("request");
const dimmableDevices = ["6", "7"];

module.exports = function (app, db) {
	// route for arduino to self register and generate respective keys
	require("./arduinoRegister")(app, db);

	// route for arduino to revive itself and sync data in response (arduino)
	require("./reviveArduino")(app);

	// route for getting device states for dimmable fan devices (dooruino)
	require("./getStates.js")(app,db);

	// route for door switching in dooruino
	require("./dooruino.js")(app,db);

	app.post("/resetPi", (req, res) => {
		var prefloc = "config/prefs.json";
		jsonfile.writeFile(prefloc, {}, (err, res) => {
			if (err) {
				res.send({
					error: true,
					message: err
				});
			} else {
				jsonfile.writeFile(roomLoc, { "rooms": {} }, (err, res) => {
					if (err) {
						res.send({
							error: true,
							message: err
						});
					} else {
						if (res) {
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

	app.post("/getid", (req, res) => {
		res.send({
			error: false,
			message: {
				instance: global.prefExtern.object.instance,
				network: global.prefExtern.object.network
			}
		});
	});

	//THIS SECTION CONTROLS ALL DEVICES!
	// Image processing using Google Vision API is currently implemented in it
	// Credit remaingin: $290
	// days remaining: 363
	// date: Nov 8, 2018
	// Update it to control room-specific devices

	app.post("/closedevices", (req, res) => {
		db.collection("networks").aggregate([
			{
				$lookup: {
					from: "rooms",
					localField: "_id",
					foreignField: "parent",
					as: "room_field"
				}
			},
			{
				$match: {
					"room_field.parent": ObjectID(global.prefExtern.object.network)
				}
			}
		]).toArray().then(function (arr) {
			res.send({
				error: false,
				message: "closed all devices"
			});
			arr[0].room_field.forEach(function (r) {
				db.collection("devices").updateMany({ "parent": r._id }, { $set: { state: false } }, (err, obj) => {

				});
			});
		});
	});

	app.post("/peopleinroom", (req, res) => {
		db.collection("networks").aggregate([
			{
				$lookup: {
					from: "rooms",
					localField: "_id",
					foreignField: "parent",
					as: "room_field"
				}
			},
			{
				$match: {
					"room_field.parent": ObjectID(global.prefExtern.object.network)
				}
			}
		]).toArray().then(function (arr) {
			res.send({
				error: false,
				message: "closed all devices"
			});
			arr[0].room_field.forEach(function (r) {
				db.collection("devices").updateOne({ "parent": r._id, "name": "Device 0" }, { $set: { state: true } }, (err, obj) => { });
			});
		});
	});
	//////////////////////////////////////////////
	app.post("/", (req, res) => {
		res.send({
			error: false,
			message: "systemok. 200"
		});
	});

	app.get("/", (req, res) => {
		res.send({
			error: false,
			message: "systemok. 200"
		});
	});

	app.get("*", (req, res) => {
		res.send({
			error: false,
			message: "systemok. 200"
		});
	});

	app.post("*", (req, res) => {
		res.send({
			error: false,
			message: "systemok. 200"
		});
	});
};