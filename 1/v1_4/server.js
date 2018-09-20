const express = require('express');
const MongoClient = require('mongodb').MongoClient, f = require('util').format, assert = require('assert');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').createServer(app);
const db = require('./config/db');
const io = require("socket.io")(http), ioServer = io.listen(9997);

const port = 9999;

const socket = require('./socket')(io);

var jsonParser = bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' });
var urlencodedParser = bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoding' });
app.use(jsonParser);
app.use(urlencodedParser);

MongoClient.connect(db.url, { useNewUrlParser: true }, (err, database) => {

    if (err) return console.log(err);
    assert.equal(null, err);

    if (database == null) return console.log("database is null");

    database = database.db("pulsate");

    //const devices = 
    require('./routes/GeneralRouter')(app, database);
    
    app.listen(port, () => {
        console.log('We are live on ' + port);
    });
});