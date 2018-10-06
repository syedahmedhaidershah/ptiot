var ObjectId = require('mongodb').ObjectID;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(ioClient, database){
    ioClient.on( global.prefExtern.object.instance , function (d) {
       switch(d.forwarded){
            case "devicetoggled":
                console.log(d);
                database.collection("rooms").aggregate([
                    {
                        $lookup: {
                            from: "instances",
                            localField: "parent",
                            foreignField: "relative",
                            as: "r_field"
                        }
                    },
                    {
                        $match: {
                            "r_field._id" : ObjectId(d.id)
                        }
                    }
                ]).toArray().then(function (o) {
                    database.collection("arduinos").aggregate([
                        {
                            $lookup: {
                                from: "rooms",
                                localField: "relative",
                                foreignField: "_id",
                                as: "a_field"
                            }
                        },
                        {
                            $match: {
                                "a_field._id" : ObjectId(d.roomid)
                            }
                        }
                    ]).toArray().then(function (o) {
                        var thisRoom = null;
                        console.log(o[0]);
                        return false;
                        if(global.rooms.hasOwnProperty(o[0]._id)){
                            var jsonString = "command=updatesensor";
                            var xhr = new XMLHttpRequest();
                            
                            thisRoom = global.rooms[o[0]._id];
                            xhr.open('POST', "http://"+thisRoom.ip + "/update", true);
                            xhr.send(jsonString);
                        }
                    });
                });
                
                break;
            default:
                break;
        }
    });
}