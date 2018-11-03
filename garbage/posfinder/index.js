const express = require('express');
const MongoClient = require('mongodb').MongoClient, f = require('util').format, assert = require('assert');
const bodyParser = require('body-parser');
const app = express();
const db = require('../../config/db');

const port = 9992;

var jsonParser = bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' });
var urlencodedParser = bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoding' });
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, { useNewUrlParser: true }, (err, database) => {

    if (err) return console.log(err);
    assert.equal(null, err);

    if (database == null) return console.log("database is null");

    database = database.db("pulsate");
    
    database.collection("rooms").find({}, (err, arr) => {
        var it = 0;
        arr.forEach(function (k) {
            if (k._id == "5b97af5907cdde04c8fc56cf") {
                console.log(it); return;
            }
            it++;
        })
    });

    app.listen(port, () => {
        console.log('We are live on ' + port);

    });
})