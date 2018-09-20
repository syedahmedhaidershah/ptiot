
app.put('/entity/:id&:entity&:sublevel&:network&:room&:devtype&:device&:command', (req, res) =>{
	const id = req.params.id;
	const entity = req.params.entity;
	const sublevel = req.params.sublevel;
	const network = req.params.network;
	const room = req.params.room;
	const devtype = req.params.devtype;
	const device = req.params.device;
	const command = JSON.parse(req.params.command);
	const eid = { '_id': new ObjectID(id) };
	if(devtype === "device" ){
		db.collection('sublevels').findOne(eid, (err, item) => {
			const deviceIns = item[entity].sublevels[sublevel].networks[network].rooms[room].devices[device];
			var devFunction = {};
			if( command.command == "toggle" ){
				if( deviceIns.type == "binary" ){
					devFunction = {
						"name": deviceIns.name,
						"type": deviceIns.type,
						"state": !deviceIns.state
					};
				} else if( deviceIns.type == "control" ){
					devFunction = {
						"name": deviceIns.name,
						"type": deviceIns.type,
						"max": deviceIns.max,
						"current": deviceIns.current,
						"state": !deviceIns.state
					};
				}
				item[entity].sublevels[sublevel].networks[network].rooms[room].devices[device] = devFunction;
				db.collection('sublevels').update(eid, item, (err, item) => {
					if (err) {
						res.send({
							'error': true,
							'message': err
						});
					} else {
						res.send({
							'error': false,
							'message': devFunction
						});
					} 
				});
			} else if( command.command == 'feed' ){
				if( deviceIns.type == "control" ){
					const current = command.current;
					if( current > deviceIns.max || current < 0){
						res.send({
							'error': true,
							'message': 628,
							'instance': 1
						});	
					}
					else{
						const devFunction = {
							"name": deviceIns.name,
							"type": deviceIns.type,
							"max": deviceIns.max,
							"current": current,
							"state": deviceIns.state
						};
						item[entity].sublevels[sublevel].networks[network].rooms[room].devices[device] = devFunction;
						db.collection('sublevels').update(eid, item, (err, item) => {
							if (err) {
								res.send({
									'error': true,
									'message': err
								});
							} else {
								res.send({
									'error': false,
									'message': devFunction
								});
							} 
						});
					}
				} else {
					res.send({
						'error': true,
						'message': 627,
						'instance': 1
					});
				}
			} else {
				res.send({
					'error': true,
					'message': 626,
					'instance': 0
				});
			}
		});
	}

});
