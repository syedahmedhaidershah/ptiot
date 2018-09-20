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
            db.collection("rooms").aggregate([
                {
                    $lookup: {
                        from: "sensors",
                        localField: "_id",
                        foreignField: "parent",
                        as: "sens_item"
                    }
                },
                {
                    $match: {
                        "sens_item._id": myquery._id
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
                            /* You could retreive the pi's id to emit to by "o._id"  */
                        }
                    });
                }
            });
        }
    });
});