var ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {
    app.post("/generate", (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);

        var newArduino = (new ObjectID);
        db.collection("arduinos").insert({ _id: newArduino, relative: null}, (err, inserted) => {
            if (err) {
                res.send({
                    error: true,
                    message: err
                });
            } else {
                res.send({
                    error: false,
                    message: newArduino.toString() 
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