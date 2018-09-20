const schemaGen 	 = require("mongo-schema-gen");
const MongoClient    = require('mongodb').MongoClient;
const db			 = require('./db');
const jsonfile		 = require('jsonfile');
const collections	 = [
							"creds",
							"devices",
							"entities",
							"instances",
							"networks",
							"sensors",
							"sublevels",
							"tokens"
							// "zones"
						];

const schemas		 = {};

schemaGen.connect(db.url, function(db) {
	var cLast = collections.length - 1; 
	var it = 0;
	collections.forEach(function(key){
		schemaGen.getSchema(key, (schema) => {
			// schemas[key] = schema;
			console.log(schema);
			// it ++;
			// if(it >= cLast) console.log(schemas);
		});
	})
	// jsonfile.writeFile(this.preferences, jsonObj, (err, res) => {
 //        if(err){
 //            console.log(err);
 //        } else {
 //            console.log("initialized");
 //            console.log(jsonObj);
 //            return;
 //        }
 //    });
})