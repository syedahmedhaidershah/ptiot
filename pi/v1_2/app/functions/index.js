const jsonFile = require('jsonfile');
const ObjectId = require('mongodb').ObjectID;
const devicesLoc = './config/devices.json';
const sensorsLoc = './config/sensors.json';
var shift = 0, enternow = true, totalCollections = 2;

module.exports = {
    db: null,
    retreiveIdsFromObjArray: function(arr){
        var newArray = [];
        arr.forEach(function(k){
            newArray.push(k._id);
        })
        return newArray;
    },
    dbinterval : function(db){
        module.exports.db = db;
        const query1 = { parent : ObjectId(global.prefExtern.object.instance) };
        
        setInterval(function(){
            if(enternow){
                switch(shift){
                    case 0:
                        enternow = false;
                        module.exports.syncCollection("devices", devicesLoc, query1);
                        break;
                    case 1:
                        enternow = false;
                        module.exports.syncCollection("sensors", sensorsLoc, query1);
                    default:
                        break;
                }
            }
        }, 1000);
    },
    syncCollection: function(collection, jsonLoc, useQuery){
        var collectionIns = module.exports.db.collection(collection).find(useQuery);
        collectionIns.count().then(function(c){
            if(c != 0){
                collectionIns.toArray().then(function(k){
                    var n = module.exports.retreiveIdsFromObjArray(k);
                    jsonFile.readFile(jsonLoc, (err, obj) => {
                        if(err){
                            console.log(err);
                        } else {
                            var insIds = module.exports.retreiveIdsFromObjArray(obj[collection]);
                            n.forEach(function(o){
                                if(insIds.indexOf(o) == -1){
                                    var writeJson = {};
                                    writeJson[collection] = k;
                                    jsonFile.writeFile(jsonLoc, writeJson, (err, res) => {
                                        if(err){
                                            console.log(err);
                                        } else {
                                            enternow = true;
                                            if(shift < totalCollections - 1 ){
                                                shift ++;
                                            } else {
                                                shift = 0;
                                            }
                                        }
                                    });
                                } else {
                                    enternow = true;
                                    if(shift < totalCollections - 1 ){
                                        shift ++;
                                    } else {
                                        shift = 0;
                                    }
                                }
                            })
                        }
                    });
                });
            } else {
                var writeJson = {};
                writeJson[collection] = [];
                jsonFile.writeFile(jsonLoc, writeJson, (err, res) => {
                    if(err){
                        console.log(err);
                        enternow = true;
                        if(shift < totalCollections - 1 ){
                            shift ++;
                        } else {
                            shift = 0;
                        }
                    } else {
                        enternow = true;
                        if(shift < totalCollections - 1 ){
                            shift ++;
                        } else {
                            shift = 0;
                        }
                    }
                });
            }
        });
    }
}