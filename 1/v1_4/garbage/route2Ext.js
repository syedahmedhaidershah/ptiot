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
                global.msgsocket.emit('forward', {
                    id: o[0]._id,
                    data: {
                        forwarded: 'sensorupdated',
                        roomid: c[0]._id,
                        error: false,
                        sensor: id,
                        msg: rvalue
                    }
                });
            }
        });
    }
});