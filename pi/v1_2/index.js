const express        = require('express');
const MongoClient    = require('mongodb').MongoClient, assert = require('assert');
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const jsonfile		 = require('jsonfile');
const prefLoc 		 = "./config/prefs.json";
const roomLoc 		 = "./config/rooms.json";
const ioHost 		 = "http://192.168.1.102";
const iPort 		 = 9996;
const io 			 = require("socket.io-client"), ioClient = io.connect(ioHost + ":" + iPort);
const app            = express();
global.socketHandler = null;

const port 			 = 9899;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true, limit: 20971520, type: 'application/json' }));

MongoClient.connect(db.url, { useNewUrlParser: true }, (err, database) => {
 	if (err) return console.log(err);
    assert.equal(null, err);
    if (database == null) return console.log("database is null");

	global.prefExtern = {
		object : null
	};
	global.rooms = {
		rooms : []
	}

	database = database.db("pulsate");

	jsonfile.readFile(prefLoc, (err, obj) => {
		if(err){
			console.log(err);
		} else {
			global.prefExtern.object = obj;
			if(!Object.keys(obj).length){
				const intitializer	 = require('./config/init');
				intitializer.initialize(database, global.prefExtern);
			}
			require('./app/localsystem')(app,db);
			const appfunctions = require("./app/functions");
			appfunctions.dbinterval(database);
			global.socketHandler = require('./app/socket')(ioClient, database);
			require('./app/routes/')(app, database);
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
		console.log('We are live on ' + port);
	});
})