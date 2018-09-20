module.exports = function(app,db){
    app.post('/', (req, res) => {
		res.send({
			error : false,
			message : 'systemok. 200'
		});
	});

	app.get('/', (req, res) => {
		res.send({
			error : false,
			message : 'systemok. 200'
		});
	});

	app.get('*', (req, res) => {
		res.send({
			'error': true,
			message : 'systemok. 200'
		});
	});
	
	app.post('*', (req, res) => {
		res.send({
			'error': true,
			message : 'systemok. 200'
		});
	});
}