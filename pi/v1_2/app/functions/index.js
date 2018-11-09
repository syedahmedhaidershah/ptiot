const jsonFile = require("jsonfile");
const ObjectId = require("mongodb").ObjectID;
const devicesLoc = "./config/devices.json";
const sensorsLoc = "./config/sensors.json";
var shift = 0, enternow = true, totalCollections = 2;

module.exports = {
	retreiveIdsFromObjArray: function(arr){
		var newArray = [];
		arr.forEach(function(k){
			newArray.push(k._id);
		});
		return newArray;
	},
	dbinterval : function(){
        
		setInterval(function(){
			if(enternow){
				switch(shift){
					case 0:
						// enternow = false;
						module.exports.syncCollection("devices", devicesLoc);
						break;
					case 1:
						// enternow = false;
						module.exports.syncCollection("sensors", sensorsLoc);
						break;
					default:
						break;
				}
			}
		}, 1000);
	},
	syncCollection: function(collection, loc){
		Object.keys(global.rooms).forEach(function(o){
			if(global.rooms[o].hasOwnProperty("_id")){
				global.database.collection(collection).find({parent: ObjectId(global.rooms[o]._id)} ).toArray().then(function(arr){
					arr.forEach(function(doc){
						if(!global.devices.devices.hasOwnProperty(global.rooms[o]._id)){
							global.devices.devices[global.rooms[o]._id] = {};
							global.devices.devices[global.rooms[o]._id][doc._id] = doc;
							jsonFile.readFile(devicesLoc, (err,obj) => {
								if(err){
									console.log(err);
								} else {
									obj.devices[global.rooms[o]._id] = {};
									obj.devices[global.rooms[o]._id][doc._id] = doc;
									jsonFile.writeFile(devicesLoc, obj, (err, obj) => {
										if(err){
											console.log(err);
										} else {
											enternow = true;
											// shift != shift;
										}
									});
								}
							});
						} else if(global.devices.devices[global.rooms[o]._id].hasOwnProperty(doc._id)){
							if(global.devices.devices[global.rooms[o]._id][doc._id].hasOwnProperty("state")){
								if(global.devices.devices[global.rooms[o]._id][doc._id].state != doc.state){
									global.devices.devices[global.rooms[o]._id][doc._id] = doc;
									jsonFile.readFile(devicesLoc, (err,obj) => {
										if(err){
											console.log(err);
										} else {
											obj.devices[global.rooms[o]._id][doc._id] = doc;
											jsonFile.writeFile(devicesLoc, obj, (err, obj) => {
												if(err){
													console.log(err);
												} else {
													enternow = true;
													// shift != shift;
												}
											});
										}
									});
								}
								if(global.devices.devices[global.rooms[o]._id][doc._id].attr.hasOwnProperty("current")){
									if(global.devices.devices[global.rooms[o]._id][doc._id].attr.current != doc.attr.current){
										global.devices.devices[global.rooms[o]._id][doc._id].attr.current = doc.attr.current;
										jsonFile.readFile(devicesLoc, (err,obj) => {
											if(err){
												console.log(err);
											} else {
												obj.devices[doc._id].attr.current = doc.attr.current;
												jsonFile.writeFile(devicesLoc, obj, (err, obj) => {
													if(err){
														console.log(err);
													} else {
														enternow = true;
														// shift != shift;
													}
												});
											}
										});
									}
								}
							}
						} else if(!global.devices.devices[global.rooms[o]._id].hasOwnProperty(doc._id)){
							global.devices.devices[global.rooms[o]._id][doc._id] = doc;
							if(global.devices.devices[global.rooms[o]._id][doc._id].state != doc.state){
								global.devices.devices[global.rooms[o]._id][doc._id] = doc;
								jsonFile.readFile(devicesLoc, (err,obj) => {
									if(err){
										console.log(err);
									} else {
										obj.devices[global.rooms[o]._id][doc._id] = doc;
										jsonFile.writeFile(devicesLoc, obj, (err, obj) => {
											if(err){
												console.log(err);
											} else {
												enternow = true;
												// shift != shift;
											}
										});
									}
								});
							}
						}
					});
				});
			}
		})
	}
};