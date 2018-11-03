const usersconnected = 0;
const mongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const dbconfig = require("../../injects/db");
const fs = require("fs");
var db = null;
var process = require("process");
const errMsg = "An error occured, contact your administrator";

module.exports = function (io) {
	mongoClient.connect(dbconfig.url, { useNewUrlParser: true }, (err, database) => {
		if (err) {
			// io.broadcast.emit('error', `${errMsg}. Code: 10001Socket`);
			console.log("Database is inaccessible. Check your network or DB - Instance.\nIf everything is correct, type \"rs\" and press ENTER");
			process.exit();
			return false;
		} else {
			db = database.db(dbconfig.name);
		}
	});

	io.on("connection", function (socket) {
	});
};