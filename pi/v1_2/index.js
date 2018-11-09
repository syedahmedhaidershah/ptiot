const express        = require("express");
const MongoClient    = require("mongodb").MongoClient, assert = require("assert");
const bodyParser     = require("body-parser");
const db             = require("./config/db");
const jsonfile		 = require("jsonfile");
const prefLoc 		 = "./config/prefs.json";
const roomLoc 		 = "./config/rooms.json";
const deviceLoc 		 = "./config/devices.json";
const ioHost 		 = "http://192.168.1.102";
const iPort 		 = 9996;
const io 			 = require("socket.io-client"), ioClient = io.connect(ioHost + ":" + iPort);
const app            = express();
global.socketHandler = null;
global.mainserver = ioHost;

const port 			 = 9897;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true, limit: 20971520, type: "application/json" }));

global.mode = true;
// true for online
// false for local

MongoClient.connect(db.url, { useNewUrlParser: true }, (err, database) => {
	
	if (err) return console.log(err);
	assert.equal(null, err);
	if (database == null) return console.log("database is null");

	global.prefExtern = {
		object : null
	};
	global.rooms = {
		rooms : []
	};
	global.devices = {
		"devices" : {}
	};

	global.database = database.db("pulsate");

	jsonfile.readFile(prefLoc, (err, obj) => {
		if(err){
			console.log(err);
		} else {
			global.prefExtern.object = obj;
			if(!Object.keys(obj).length){
				const intitializer	 = require("./config/init");
				intitializer.initialize(database, global.prefExtern);
			}
			require("./app/localsystem")(app,db);
			jsonfile.readFile(deviceLoc, (err, obj) => {
				global.devices = obj;
				const appfunctions = require("./app/functions");
				appfunctions.dbinterval();
				global.socketHandler = require("./app/socket")(ioClient, database);
				require("./app/routes/")(app, database);
			});
		}
	});

	
	jsonfile.readFile(roomLoc, (err, obj) => {
		if(err){
			console.log(err);
		} else {
			global.rooms = obj.rooms;
		}
	});

	app.listen(port, () => {
		console.log("We are live on " + port);
	});
})