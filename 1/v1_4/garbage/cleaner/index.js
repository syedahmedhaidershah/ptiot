const express = require('express');
const MongoClient = require('mongodb').MongoClient, f = require('util').format, assert = require('assert');
const bodyParser = require('body-parser');
const app = express();
const db = require('../../config/db');
const readline = require('readline');
var ObjectId = require('mongodb').ObjectID;

const port = 9992;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptUser(rl, database) {
    rl.question('\nenter an id : ', (answer) => {

        if (answer != null && answer != "") {
            database.collection("arduinos").find({ _id: ObjectId(answer) }).count().then(function (c) {
                
                if (parseInt(c) > 0) {
                    database.collection("arduinos").deleteMany({ _id: { $ne: ObjectId(answer) } }, (err, obj) => {
                        if (err) {
                            console.log(`\n${err}\n`);
                        } else {
                            database.collection("instances").deleteMany({}, (err, obj) => {
                                if (err) {
                                    console.log(`\n${err}\n`);
                                } else {
                                    database.collection("rooms").deleteMany({}, (err, obj) => {
                                        if (err) {
                                            console.log(`\n${err}\n`);
                                        } else {
                                            database.collection("devices").deleteMany({}, (err, obj) => {
                                                if (err) {
                                                    console.log(`\n${err}\n`);
                                                } else {
                                                    database.collection("sensors").deleteMany({}, (err, obj) => {
                                                        if (err) {
                                                            console.log(`\n${err}\n`);
                                                        } else {
                                                            database.collection("creds").deleteMany({}, (err, obj) => {
                                                                if (err) {
                                                                    console.log(`\n${err}\n`);
                                                                } else {
                                                                    database.collection("networks").deleteMany({}, (err, obj) => {
                                                                        if (err) {
                                                                            console.log(`\n${err}\n`);
                                                                        } else {
                                                                            database.collection("arduinos").updateOne({ _id: ObjectId(answer) }, { $set: { relative: null } });
                                                                            console.log("Done");
                                                                            return false;
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    console.log("\nno such _id exists\n");
                    promptUser(rl, database);
                }
            });
        } else {
            console.log("\ninvalid _id provided\n");
            promptUser(rl, database);
        }
        rl.close();
    });
}

var jsonParser = bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' });
var urlencodedParser = bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoding' });
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, { useNewUrlParser: true }, (err, database) => {

    if (err) return console.log(err);
    assert.equal(null, err);

    if (database == null) return console.log("database is null");

    database = database.db("pulsate");

    app.listen(port, () => {
        console.log('We are live on ' + port);
        promptUser(rl, database);
    });
    
})