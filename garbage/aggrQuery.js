db.sensors.insertOne(req.body, function (err, item) {
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