var ObjectId = require('mongodb').ObjectID;
module.exports = function (app, db) {
    app.post('/sensors/search', (req, res) => {
        var name = req.body.name;
        db.collection("sensors").findOne({ "name": name }, (err, item) => {
            if (err) {
                res.send({
                    error: true,
                    message: err
                });
            } else {
                res.send({
                    error: false,
                    message: item
                })
            }
        })
    })
    //Route #01
    app.post('/sensors/update', (req, res) => {
        var id = req.body._id;
        var rvalue = req.body.value;
        console.log(req.body);
        var myquery = { _id: ObjectId(id) };
        var newvalues = { $set: { value: rvalue } };
        db.collection("sensors").updateOne(myquery, newvalues, function (err, item) {
            if (err) {
                res.send({
                    error: true,
                    message: err
                });
            } else {
                res.send({
                    error: false,
                    message: "Updated Successfully"
                })
            }
        });
    })
    app.post('/sensors/add', (req, res) => {
        db.collection("sensors").insertOne(req.body, function (err, item) {
            if (err) {
                res.send({
                    error: true,
                    message: err
                });
            } else {
                res.send({
                    error: false,
                    message: "Added Successfully"
                })
            }
        });
    })
    //Route #03/12/14
    app.post('/devices/toggle', (req, res) => {
        var id = req.body._id;
        var myquery = { _id: ObjectId(id) };
        var doc = db.collection("devices").findOne(myquery, function (err, item) {
            var newvalues = { $set: { state: !item.state } };
            db.collection("devices").updateOne(myquery, newvalues, function (err, item) {
                if (err) {
                    res.send({
                        error: true,
                        message: err
                    });
                } else {
                    res.send({
                        error: false,
                        message: "Updated Successfully"
                    })
                }
            });
        });
    })
    //Route #10
    app.post('/devices/rename', (req, res) => {
        var id = req.body._id;
        var name = req.body.name;
        var myquery = { _id: ObjectId(id) };
        var newvalues = { $set: { name: name } };
        db.collection("devices").updateOne(myquery, newvalues, function (err, item) {
            if (err) {
                res.send({
                    error: true,
                    message: err
                });
            } else {
                res.send({
                    error: false,
                    message: "Updated Successfully"
                })
            }
        });
    })
    //Route #05
    app.post('/rooms/rename', (req, res) => {
        var id = req.body._id;
        var name = req.body.name;
        var myquery = { _id: ObjectId(id) };
        var newvalues = { $set: { name: name } };
        db.collection("rooms").updateOne(myquery, newvalues, function (err, item) {
            if (err) {
                res.send({
                    error: true,
                    message: err
                });
            } else {
                res.send({
                    error: false,
                    message: "Updated Successfully"
                })
            }
        });
    })
    //Route #06
    app.post('/rooms/devices', (req, res) => {
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
                })
            }
        });
    })
    //Route #07
    app.post('/rooms/sensors', (req, res) => {
        var pid = req.body.parent;
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
                })
            }
        });
    })
    //Route # 11
    app.post('/control/ac/temperature', (req, res) => {
        var id = req.body._id;
        var temp = req.body.temperature;
        var myquery = { _id: ObjectId(id) };
        var newvalues = { $set: { temperature: temp } };
        db.collection("devices").updateOne(myquery, newvalues, function (err, item) {
            if (err) {
                res.send({
                    error: true,
                    message: err
                });
            } else {
                res.send({
                    error: false,
                    message: "Updated Successfully"
                })
            }
        });
    })
    //Route # 12
    app.post('/control/ac/swing/vertical_louver', (req, res) => {
        var id = req.body._id;
        var vertical_louver = req.body.vertical_louver;
        var myquery = { _id: ObjectId(id) };
        var newvalues;
        if (vertical_louver == "up") {
            newvalues = { $inc: { vertical_louver: 10 } };
        }
        else {
            newvalues = { $inc: { vertical_louver: -10 } };
        }
        db.collection("devices").updateOne(myquery, newvalues, function (err, item) {
            if (err) {
                res.send({
                    error: true,
                    message: err
                });
            } else {
                res.send({
                    error: false,
                    message: "Updated Successfully"
                })
            }
        });
    })
    app.post('/control/ac/swing/horizontal_louver', (req, res) => {
        var id = req.body._id;
        var horizontal_louver = req.body.horizontal_louver;
        var myquery = { _id: ObjectId(id) };
        var newvalues;
        if (horizontal_louver == "right") {
            newvalues = { $inc: { horizontal_louver: 10 } };
        }
        else {
            newvalues = { $inc: { horizontal_louver: -10 } };
        }
        db.collection("devices").updateOne(myquery, newvalues, function (err, item) {
            if (err) {
                res.send({
                    error: true,
                    message: err
                });
            } else {
                res.send({
                    error: false,
                    message: "Updated Successfully"
                })
            }
        });
    })

}