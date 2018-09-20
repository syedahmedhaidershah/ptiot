var ObjectID = require('mongodb').ObjectID;
var md5 = require('md5');

module.exports = function(app) {
	app.post('/', (req, res) => {
		console.log(req.connection.remoteAddress.split("::ffff:")[1] + " >> " + req.body.msg);
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