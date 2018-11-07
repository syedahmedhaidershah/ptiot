var ObjectID = require('mongodb').ObjectID;
var md5 = require('md5');

module.exports = function (app, db) {
    app.post("/generate", (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);

        var newArduino = (new ObjectID());
        db.collection("arduinos").insertOne({ _id: newArduino, relative: null}, (err, inserted) => {
            if (err) {
                res.send({
                    error: true,
                    message: err
                });
            } else {
            	let newDooruino = (new ObjectID());
                db.collection('dooruinos').insertOne({_id : newDooruino, relative : newArduino}, (err, inserted) => {
                	if (err) {
                		res.send({
                			error: true,
                			message: err
                		});
                	} else {
                		res.send({
		                    error: false,
		                    message: {
		                    	arduino: newArduino.toString(),
		                    	dooruino: newDooruino.toString()
		                    } 
		                });
                	}
                })
            }
        });
    });

    app.post("/generatewifi", (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);

        var wifiObj = (new ObjectID());
        var newWiFi = {
        	_id: wifiObj,
        	ssid: null,
	        password: null
	    }
        let usedate = md5(new Date().getTime() + wifiObj.toString());
	    newWiFi.ssid = usedate.substr(0,7).toUpperCase();
        newWiFi.password = usedate.substr(-8).toUpperCase();
        db.collection("wifis").insertOne(newWiFi, (err, inserted) => {
            if (err) {
                res.send({
                    error: true,
                    message: err
                });
            } else {
            	res.send({
            		error : false,
            		message: newWiFi
            	})
            }
        });
    });

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