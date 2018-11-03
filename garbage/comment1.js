
app.post("/devices/dim", (req, res) => {
    let id = req.body._id;
    let current = parseInt(req.body.current);
    let myquery = { _id: new ObjectId(id) };
    let pushquery = { $set: { attr: { current: current } } };
    console.log(current);
    if (current == 0) {
        console.log(false);
        pushquery.$set.state = false;
    } else {
        console.log(true);
        pushquery.$set.state = true;
    }
    db.collection("devices").updateOne(myquery, pushquery, (err, obj) => {
        if (err) {
            res.send({
                err: true,
                message: err
            });
        } else {
            db.collection("devices").findOne(myquery, (err, devitem) => {
                if (err) {
                    console.log(err); return false;
                } else if (!devitem) {
                    console.log('item is null'); return false;
                } else {
                    res.send({
                        error: false,
                        message: current
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
                                            forwarded: 'devicedimmed',
                                            error: false,
                                            device: id,
                                            current: current,
                                            switch: devitem.name.split(" ")[1],
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
        }
    });
});