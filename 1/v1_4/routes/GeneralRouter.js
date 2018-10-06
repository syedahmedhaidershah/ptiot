var ObjectId = require('mongodb').ObjectID;
// var jsonFile = require("jsonfile");
// var devTypes = "config/devicetypes.json";

module.exports = function (app, db) {
    // route for searching for a specific sensor
    app.post('/sensors/search', (req, res) => {
        var sensId = req.body._id;
        db.collection("sensors").findOne({ _id: ObjectId(sensId) }, (err, item) => {
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
    });

    // route for updating a sensor's values
    app.post('/sensors/update', (req, res) => {
        var id = req.body._id;
        var rvalue = req.body.value;
        var myquery = { _id: ObjectId(id) };
        var newvalues = { $set: { value: rvalue } };
        db.collection("sensors").updateOne(myquery, newvalues, (err, item) => {
            if (err) {
                res.send({
                    error: true,
                    message: err
                });
            } else {
                res.send({
                    error: false,
                    message: "Updated Successfully"
                });
            }
        });
    });

    //route for adding a sensor
    app.post('/sensors/add', (req, res) => {
        db.collection("sensors").insertOne(req.body, (err, item) => {
            if (err) {
                res.send({
                    error: true,
                    message: err
                });
            } else {
                res.send({
                    error: false,
                    message: "Added Successfully",
                    object : item
                })
            }
        });
    });
    
    // route for toggling a device
    app.post('/devices/toggle', (req, res) => {
        var id = req.body._id;
        var myquery = { _id: ObjectId(id) };
        db.collection("devices").findOne(myquery, (err, devitem) => {
            if (err) {
                console.log(err); return false;
            } else if (!devitem) {
                console.log('item is null'); return false;
            }
            var newvalues = { $set: { state: !devitem.state } };
            var currState = !devitem.state;
            db.collection("devices").updateOne(myquery, newvalues, (err, item) => {
                if (err) {
                    res.send({
                        error: true,
                        message: err
                    });
                } else {
                    res.send({
                        error: false,
                        message: "Updated Successfully"
                    });
                    db.collection("rooms").aggregate([
                        {
                            $lookup: {
                                from: "devices",
                                localField: "_id",
                                foreignField: "parent",
                                as: "dev_item"
                            }
                        },
                        {
                            $match: {
                                "dev_item._id": myquery._id
                            }
                        }
                    ]).toArray().then(function (c) {
                        if (c.length > 0) {
                            db.collection("instances").aggregate([
                                {
                                    $lookup: {
                                        from: "rooms",
                                        localField: "relative",
                                        foreignField: "parent",
                                        as: "room_field"
                                    }
                                },
                                {
                                    $match: {
                                        "room_field.parent": c[0].parent
                                    }
                                }
                            ]).toArray().then(function (o) {
                                if (o.length > 0) {
                                    global.msgsocket.emit('forward', {
                                        id: o[0]._id,
                                        data: {
                                            forwarded: 'devicetoggled',
                                            error: false,
                                            device: id,
                                            msg: devitem.state,
                                            room: c[0]._id
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    });

    //Route #10
    app.post('/devices/rename', (req, res) => {
        var id = req.body._id;
        var name = req.body.name;
        var myquery = { _id: ObjectId(id) };
        var newvalues = { $set: { name: name } };
        db.collection("devices").updateOne(myquery, newvalues, (err, item) => {
            if (err) {
                res.send({
                    error: true,
                    message: err
                });
            } else {
                res.send({
                    error: false,
                    message: "Updated Successfully"
                });
                db.collection("rooms").aggregate([
                    {
                        $lookup: {
                            from: "devices",
                            localField: "_id",
                            foreignField: "parent",
                            as: "dev_item"
                        }
                    },
                    {
                        $match: {
                            "dev_item._id": myquery._id
                        }
                    }
                ]).toArray().then(function (c) {
                    if (c.length > 0) {
                        db.collection("instances").aggregate([
                            {
                                $lookup: {
                                    from: "rooms",
                                    localField: "relative",
                                    foreignField: "parent",
                                    as: "room_field"
                                }
                            },
                            {
                                $match: {
                                    "room_field.parent": c[0].parent
                                }
                            }
                        ]).toArray().then(function (o) {
                            if (o.length > 0) {
                                global.msgsocket.emit('forward', {
                                    id: o[0]._id,
                                    data: {
                                        forwarded: 'devicerenamed',
                                        error: false,
                                        device: id,
                                        msg: name
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    })
    //Route #05
    app.post('/rooms/rename', (req, res) => {
        var id = req.body._id;
        var name = req.body.name;
        var myquery = { _id: ObjectId(id) };
        var newvalues = { $set: { name: name } };
        db.collection("rooms").updateOne(myquery, newvalues, (err, item) => {
            if (err) {
                res.send({
                    error: true,
                    message: err
                });
            } else {
                res.send({
                    error: false,
                    message: "Updated Successfully"
                });
                db.collection("instances").aggregate([
                    {
                        $lookup: {
                            from: "rooms",
                            localField: "relative",
                            foreignField: "parent",
                            as: "room_field"
                        }
                    },
                    {
                        $match: {
                            "room_field.parent": id
                        }
                    }
                ]).toArray().then(function (o) {
                    if (o.length > 0) {
                        global.msgsocket.emit('forward', {
                            id: o[0]._id,
                            data: {
                                forwarded: 'roomrenamed',
                                error: false,
                                device: id,
                                msg: name
                            }
                        });
                    }
                });
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
        db.collection("devices").updateOne(myquery, newvalues, (err, item) => {
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
    app.post('/control/ac/swing/vertical_lower', (req, res) => {
        var id = req.body._id;
        var vertical_lower = req.body.vertical_lower;
        var myquery = { _id: ObjectId(id) };
        var newvalues;
        if (vertical_lower == "up") {
            newvalues = { $inc: { vertical_lower: 10 } };
        }
        else {
            newvalues = { $inc: { vertical_lower: -10 } };
        }
        db.collection("devices").updateOne(myquery, newvalues, (err, item) => {
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
    app.post('/control/ac/swing/horizontal_lower', (req, res) => {
        var id = req.body._id;
        var horizontal_lower = req.body.horizontal_lower;
        var myquery = { _id: ObjectId(id) };
        var newvalues;
        if (horizontal_lower == "right") {
            newvalues = { $inc: { horizontal_lower: 10 } };
        }
        else {
            newvalues = { $inc: { horizontal_lower: -10 } };
        }
        db.collection("devices").updateOne(myquery, newvalues, (err, item) => {
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
    app.post('/', (req, res) => {
        res.send({
            error: true,
            message : 'systemok. 200'
        });
    });

    app.get('/', (req, res) => {
        res.send({
            error: true,
            message : 'systemok. 200'
        });
    });

    app.get('*', (req, res) => {
        res.send({
            error: true,
            message : 'systemok. 200'
        });
    });

    app.post('*', (req, res) => {
        res.send({
            error: true,
            message : 'systemok. 200'
        });
    });
}