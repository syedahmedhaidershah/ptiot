const jsonfile = require('jsonfile');
const readline = require('readline');
var ObjectID = require('mongodb').ObjectID;
var md5 = require('md5');
const networkInterfaces = require('os').networkInterfaces();

module.exports = {
    prefJson: {},
    db : null,
    preferences : "./config/prefs.json",
    initialize : function(database, prefExtern){
        this.getMacAddr(this.prefJson);
        this.db = database;
        jsonfile.readFile(this.preferences, (err, obj) => {
            if(err){
                console.log(err);
            } else {
                this.processType(obj, this.prefJson, prefExtern);
            }
        });
    },
    rl : readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }),
    getMacAddr: function(jsonObj){
        if(networkInterfaces.hasOwnProperty("eth0")){
            piMacAddr = networkInterfaces.eth0[0].mac;
        } else if(networkInterfaces.hasOwnProperty("wlan0")){
            piMacAddr = networkInterfaces.wlan0[0].mac;        
        } else if(networkInterfaces.hasOwnProperty("wlan1")){
            piMacAddr = networkInterfaces.wlan1[0].mac;        
        } else {
            piMacAddr = "00:00:00:00:00:00";        
        }
        jsonObj.mac = piMacAddr;
    },
    processType : function(obj, jsonObj, prefExtern){
        if(!obj.hasOwnProperty("type")){
            this.rl.question('Define a type : ', (answer) => {
                jsonObj.type = answer
                this.processZone(obj, jsonObj, prefExtern);
            });        
        } else {
            this.processZone(obj, jsonObj, prefExtern);
        }
    },
    processZone : function(obj, jsonObj, prefExtern){
        if(!obj.hasOwnProperty("zone")){
            this.rl.question('Define a zone : ', (answer) => {
                jsonObj.zone = answer;
                this.processEntity(obj, jsonObj, prefExtern);
            });         
        } else {
            this.processEntity(obj, jsonObj, prefExtern);
        }
    },
    processEntity : function(obj, jsonObj, prefExtern){
        if(!obj.hasOwnProperty("entity")){
            this.rl.question('Define an entity : ', (answer) => {
                if(answer != ""){
                    jsonObj.entity = answer;
                    this.createInstance(obj, jsonObj, prefExtern);
                } else {
                    jsonObj.entity = md5(this.mac + new Date());
                    var entity = {
                        _id : new ObjectID(),
                        tag : jsonObj.entity,
                        type : jsonObj.type,
                        parent : jsonObj.zone
                    }
                    this.db.collection("entities").insertOne(entity, (err, insertedEntity) => {
                        if(err){
                            console.log(err);
                        } else {        
                            this.createInstance(obj, jsonObj, prefExtern);
                        }                
                    });
                }
            });         
        } else {
            this.createInstance(obj, jsonObj, prefExtern);
        }
    },
    createInstance: function(obj, jsonObj, prefExtern){
        var network = {
            _id : new ObjectID()
        };
        var instance = {
            _id : new ObjectID(),
            mac : jsonObj.mac,
            relative : null
        }
        var sublevel = {
            _id : new ObjectID()
        }
        if(jsonObj.type == "a"){
            sublevel.type = "a";
            sublevel.parent = jsonObj.entity;
            this.rl.question("Which sublevel is this network located on: ", (answer) => {
                this.db.collection("sublevels").insertOne(sublevel, (err, subItem) => {
                    network.type = "a";
                    network.parent = subItem.insertedId;
                    this.db.collection("networks").insertOne(network, (err, netInserted) => {
                        if(err){
                            console.log(err);
                        } else if(netInserted.insertedCount > 0){
                            instance.relative = netInserted.insertedId;
                            this.db.collection("instances").insertOne(instance, (err, insInserted) => {
                                if(err){
                                    console.log(err);
                                } else if (insInserted.insertedCount > 0) {
                                    jsonObj.instance = insInserted.insertedId;
                                    jsonObj.network = insInserted.ops[0].relative;
                                    this.createUser(obj, jsonObj, prefExtern);
                                }
                            });
                        }
                    });
                })
            });         
        } else if(jsonObj.type == "h"){
            network.type = "h";
            network.parent = jsonObj.entity;
            this.db.collection("networks").insertOne(network, (err, netInserted) => {
                if(err){
                    console.log(err);
                } else if(netInserted.insertedCount > 0){
                    instance.relative = netInserted.insertedId;
                    this.db.collection("instances").insertOne(instance, (err, insInserted) => {
                        if(err){
                            console.log(err);
                        } else if (insInserted.insertedCount > 0) {
                            jsonObj.instance = insInserted.insertedId;
                            jsonObj.network = insInserted.ops[0].relative;
                            this.createUser(obj, jsonObj, prefExtern);
                        }
                    });
                }
            });
        }
    },
    createUser: function(obj, jsonObj){
        var newUser = {
            username : md5(new Date()).substr(0,6),
            password : md5(jsonObj.mac + new Date()).substr(0,6),
            relative : jsonObj.instance
        }
        jsonObj.auth = newUser.username + newUser.password;
        this.db.collection("creds").insertOne(newUser, (err, userInserted) => {
            if(err){
                console.log(err);
            } else if(userInserted.insertedCount > 0){
                jsonfile.writeFile(this.preferences, jsonObj, (err, res) => {
                    if(err){
                        console.log(err);
                    } else {
                        console.log("initialized");
                        console.log(jsonObj);
                        prefeExtern = jsonObj;
                        return;
                    }
                });
            }
        });
    }
}