    //Route for setting a device type
    app.post("/devices/typechange", (req, res) => {
        jsonFile.readFile(devTypes, (err, obj) => {
            if (err) {
                console.log(err);
            } else {
                var id = req.body._id;
                var type = req.body.type;
                if (obj.types.includes(type)) {
                    var myquery = { _id: new ObjectId(id) };
                    var updateQuery = {
                        $set: {}
                    };
                    switch (type) {
                        case 'light':
                            updateQuery.$set = {
                                name: "Light",
                                type: "light"
                            }
                            break;
                        case "fan":
                            updateQuery.$set = {
                                name: "Fan",
                                type: "fan",
                                attr: {
                                    max: 5,
                                    current: 0
                                }
                            }
                            break;
                        case "dimmable_device":
                            updateQuery.$set = {
                                name: "Fan",
                                type: "fan",
                                attr: {
                                    max: 5,
                                    current: 0
                                }
                            }
                            break;
                        default:
                            break;
                    }
                    db.collection("devices").updateOne(myquery, updateQuery, (err, item) => {
                        if (err) {
                            res.send({
                                error: true,
                                message: err
                            })
                        } else {
                            res.send({
                                error: false,
                                message: "Updated successfully."
                            })
                        }
                    });
                } else {
                    res.send({
                        error: true,
                        message: "AN error occured. Inform the administrator"
                    })
                }
            }
        });
    });