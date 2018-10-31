db.collection("devices").aggregate([
    {
        $lookup: {
            from: "arduinos",
            localField: "parent",
            foreignField: "relative",
            as: "device_field"
        }
    }, { 
        $match: {
            "parent": ObjectId(key)
        }
    } 
]);