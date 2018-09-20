var ObjectID = require('mongodb').ObjectID;
var md5 = require('md5');

module.exports = function(app, db) {
	// route for logging in a user
	app.post('/login/:username&:password', (req, res) => {
		const username = req.params.username;
		const password = req.params.password;
		const uIns = { 'username': username };
		db.collection('creds').findOne(uIns, (err, item) => {
			if(item != null){
				if (err) {
					res.send({
						'error': true,
						'message': err
					});
				} else {
					var useDate = new Date();
					var itemId = item._id;
					var loggedIn = {
						'_id' : new ObjectID(),
						'creator' : itemId,
						'value' : md5( itemId+useDate ),
						'creation' : useDate
					}
					db.collection('tokens').insert(loggedIn, (err, loggedInIns) => {
						if(err){
							res.send({
								'error': true,
								'message': 625,
								'instance': 1
							});
						} else if(loggedInIns.insertedCount > 0){
							loggedIn.msg = "success";
							res.send({
								error: false,
								message: loggedIn
							})
						}
					});
				}
			} else{
				res.send({
					'error': true,
					'message': 625,
					'instance': 1
				});
			}
		});
	});

	// route for getting information on an entity
	// app.get('/entity/:identifier&:value', (req, res) => {
	// 	var subArray = [];
	// 	var identifier = req.params.identifier;
	// // route for logging in a user via mobile app and active internet
	// 	var value = req.params.value;
	// 	var jsonIns = {};
	// 	if(identifier == '_id'){
	// 		jsonIns._id = new ObjectID(value);
	// 	}
	// 	else{
	// 		jsonIns[identifier] = value;
	// 	}
	// 	db.collection('entity').find(jsonIns, (err, cursor) => {
	// 		if(err){
	// 			res.send({
	// 				'error': true,
	// 				'message': err
	// 			});
	// 		} else {
	// 			var iterator = 0;
	// 			cursor.count().then(function(c){
	// 				if(c > 0){
	// 					cursor.forEach(function(i){
	// 						var pushIns = {
	// 							_id : i._id,
	// 							count : i.count,
	// 							sublevels : i.sublevels
	// 						}
	// 						subArray.push(pushIns);
	// 						++iterator;
	// 						if(iterator >= c){
	// 							res.send({
	// 								error: false,
	// 								message: subArray
	// 							});
	// 						}
	// 					});
	// 				} else {
	// 					res.send({
	// 						error: false,
	// 						message: []
	// 					});
	// 				}
	// 			})
	// 		}
	// 	});
	// });

	// // route for a standardized getter
	// app.get('/getter/:route/:identifier', (req, res) => {
	// 	var subArray = [];
	// 	var route = req.params.route;
	// 	var identifier = req.params.identifier;
	// 	db.collection(route).find({'_id' : new ObjectID(identifier)}, (err, cursor) => {
	// 		if(err){
	// 			res.send({
	// 				'error': true,
	// 				'message': err
	// 			});
	// 		} else {
	// 			var iterator = 0;
	// 			cursor.count().then(function(c){
	// 				if(c > 0){
	// 					cursor.forEach(function(i){
	// 						subArray.push(i);
	// 						++iterator;
	// 						if(iterator >= c){
	// 							res.send({
	// 								error: false,
	// 								message: subArray
	// 							});
	// 						}
	// 					});
	// 				} else {
	// 					res.send({
	// 						error: false,
	// 						message: []
	// 					});
	// 				}
	// 			})
	// 		}
	// 	});
	// });

	// // get information of devices in a network
	// app.get('/appliances/:network/:devins', (req, res) => {
	// 	var devins = req.params.devins;
	// 	var network = req.params.network;
	// 	db.collection('networks').findOne({'_id' : new ObjectID(network)}, (err, item) => {
	// 		if(err){
	// 			res.send({
	// 				'error': true,
	// 				'message': err
	// 			});
	// 		} else {
	// 			item.rooms.forEach(function(roomIns){
	// 				var r = roomIns.id;
	// 				db.collection('rooms').findOne({'_id' : new ObjectID(r)}, (err, roomItem) => {
	// 					if(err){
	// 						res.send({
	// 							'error': true,
	// 							'message': err
	// 						});
	// 					} else {
	// 						var ri = null;
	// 						roomItem.devices.forEach(function(rIns){
	// 							if(rIns.type == devins){
	// 								ri = rIns;
	// 							}
	// 						})
	// 						if(ri == null){
	// 							res.send({
	// 								error: false,
	// 								message: []
	// 							});
	// 						} else {
	// 							db.collection(devins).findOne({'_id' : new ObjectID(ri.id)}, (err, devItem) => {
	// 								if(err){
	// 									res.send({
	// 										'error': true,
	// 										'message': err
	// 									});
	// 								} else {
	// 									res.send({
	// 										error: false,
	// 										message: devItem
	// 									});
	// 								}
	// 							});
	// 						} 
	// 					}
	// 				});
	// 			})
	// 		}
	// 	});
	// });

	// // toggle a specific device on or off
	// app.put('/toggle/:network/:room/:devins', (req, res) => {
	// 	var network = req.params.network;
	// 	var room = req.params.room;
	// 	var device = req.params.devins;
	// 	db.collection('networks').findOne({'_id' : new ObjectID(network)}, (err, netItem) => {
	// 		if(err){
	// 			res.send({
	// 				'error': true,
	// 				'message': err
	// 			});
	// 		} else {
	// 			var roomIns = netItem.rooms.find(function(e){
	// 				return e.id == room;
	// 			});
	// 			if(roomIns != undefined){
	// 				db.collection('rooms').findOne({'_id' : new ObjectID(roomIns.id)}, (err, roomItem) => {
	// 					if(err){
	// 						res.send({
	// 							'error': true,
	// 							'message': err
	// 						});
	// 					} else {
	// 						var devIns = roomItem.devices.find(function(e){
	// 							return e.type == 'devices';
	// 						});
	// 						if(devIns != undefined){
	// 							db.collection('devices').findOne({'_id' : new ObjectID(devIns.id)}, (err, devItem) =>{
	// 								if(err){
	// 									res.send({
	// 										'error': true,
	// 										'message': err
	// 									});
	// 								} else {
	// 									var devFound = devItem.devices.find(function(e){
	// 										return e.id == device;
	// 									});
	// 									if(devFound != undefined){
	// 										devFound.state = !devFound.state;
	// 										devItem.devices.forEach((element, index) => {
	// 											if(element.id == device){
	// 												devItem.devices[index] = devFound;
	// 											}
	// 										});
	// 										db.collection('devices').update({'_id' : new ObjectID(devIns.id)}, devItem, (err, item) => {
	// 											if(err){
	// 												res.send({
	// 													'error': true,
	// 													'message': err
	// 												});		
	// 											} else {
	// 												res.send({
	// 													error: false,
	// 													message: devItem
	// 												})
	// 											}
	// 										})
	// 									} else {
	// 										res.send({
	// 											'error': true,
	// 											'message': 627,
	// 											'instance' : 0
	// 										});		
	// 									}
	// 								}
	// 							});
	// 						} else {
	// 							res.send({
	// 								'error': true,
	// 								'message': 627,
	// 								'instance' : 1
	// 							});
	// 						}
	// 					}
	// 				});
	// 			}
	// 			else {
	// 				res.send({
	// 					'error': true,
	// 					'message': 627,
	// 					'instance' : 2
	// 				});
	// 			}
	// 		}
	// 	});
	// });

	// // control the power or state of a device in a network
	// app.put('/control/:network/:room/:devins/:value', (req, res) => {
	// 	var network = req.params.network;
	// 	var room = req.params.room;
	// 	var value = parseInt(req.params.value);
	// 	var device = req.params.devins;
	// 	db.collection('networks').findOne({'_id' : new ObjectID(network)}, (err, netItem) => {
	// 		if(err){
	// 			res.send({
	// 				'error': true,
	// 				'message': err
	// 			});
	// 		} else {
	// 			var roomIns = netItem.rooms.find(function(e){
	// 				return e.id == room;
	// 			});
	// 			if(roomIns != undefined){
	// 				db.collection('rooms').findOne({'_id' : new ObjectID(roomIns.id)}, (err, roomItem) => {
	// 					if(err){
	// 						res.send({
	// 							'error': true,
	// 							'message': err
	// 						});
	// 					} else {
	// 						var devIns = roomItem.devices.find(function(e){
	// 							return e.type == 'devices';
	// 						});
	// 						if(devIns != undefined){
	// 							db.collection('devices').update({'_id' : new ObjectID(devIns.id), "devices.id" : device, "devices.max" : {$gt : value}}, 
	// 								{$set : {"devices.$.current" : value}}, (err,item) => {
	// 									if(err){
	// 										res.send({
	// 											'error': true,
	// 											'message': err
	// 										});			
	// 									} else {
	// 										res.send({
	// 											error: false,
	// 											message: item
	// 										});
	// 									}
	// 								}
	// 							);
	// 						} else {
	// 							res.send({
	// 								'error': true,
	// 								'message': 627,
	// 								'instance' : 1
	// 							});
	// 						}
	// 					}
	// 				});
	// 			}
	// 			else {
	// 				res.send({
	// 					'error': true,
	// 					'message': 627,
	// 					'instance' : 2
	// 				});
	// 			}
	// 		}
	// 	});
	// });

	// // updates a sensor's value
	// app.put('/feed/:sensor/:value', (req, res) => {
	// 	var sensor = req.params.sensor;
	// 	var value = req.params.value;
	// 	db.collection('sensors').update({'_id' : new ObjectID(sensor)}, {$set : {reading : value}}, (err, item) =>{
	// 		if(err){
	// 			res.send({
	// 				error : true,
	// 				message : err
	// 			});
	// 		} else {
	// 			res.send({
	// 				error : false,
	// 				message : item
	// 			})
	// 		}
	// 	});
	// });

	app.post('/', (req, res) => {
		res.send('systemok. 200');
	});

	app.get('/', (req, res) => {
		res.send('systemok. 200');
	});

	app.get('*', (req, res) => {
		res.send({
			'error': true,
			'message': 624,
			'instance': 0
		});
	});
	
	app.post('*', (req, res) => {
		res.send({
			'error': true,
			'message': 624,
			'instance': 1
		});
	});
}