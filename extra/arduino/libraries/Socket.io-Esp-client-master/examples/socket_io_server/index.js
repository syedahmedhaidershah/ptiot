#! /usr/bin/env node
 //////////
//
//	index.js: WebSocket server 
//
//	MIT License
//  Copyright (c) [2016] [Dolapo Toki]
//
//
var fs = require('fs');
var opt = require('optimist');
var url = require('url');
var argv = opt.usage('Usage: $0 [flags]')
	.alias('p', 'port')
	.describe('p', 'TCP port for the http server (3000)')
	.alias('d', 'debug')
	.describe('d', 'Enable debug output')
	.alias('l', 'log')
	.describe('l', 'Log arduino output to file')
	.argv;

if (argv.help) {
	opt.showHelp();
	process.exit();
}

var port = argv.port || 3000;
var log_file = "datalog.txt";

console.log('WebSocket Commander here!', argv);

//Load https certificates
var privateKey = fs.readFileSync('keys/key.pem', 'utf8');
var certificate = fs.readFileSync('keys/cert.pem', 'utf8');
var credentials = {
	key: privateKey,
	cert: certificate,
	passphrase: 'socketio'
};

//////////
//
//	Configure HTTP server
//
var express = require('express');
var app = express();
var https = require('https');
var server = https.Server(credentials, app);
var io = require('socket.io')(server);
io.set('log level', argv.debug ? 3 : 1);



app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

server.listen(port);
console.log('Listening on port:', port);

//////////
//
//	Socket.io startup
//
var output_socket;
var fs = require('fs');
var tty = io
	.of('/tty')
	.on('connection', function (socket) {
		console.log('Browser connected.');
		socket.emit('message', 'Connected to server at ' + new Date().toString() + '\n');
		socket.on('message', function (data) {
			console.log('from client: ', data);
			if (output_socket) output_socket.emit(data);
		});
		var sendPingToBrowser=setInterval(function () {
			console.log("Pinging Browser...");
			socket.emit('message','Ping from server...'+'\n');
		},30000);
	});
//Not working
tty.on('disconnect',function(data){
	console.log("Browser disconnect");
});
io.on('connection', function (socket) {
	socket.on('device status', function (data) {
		//If device begins to communicate 
		if (data.status == "200") {
			console.log("device ready to recieve data");
			//Send ping to client ever 1000ms
			sendPing = setInterval(function () {
				console.log("emittng message...");
				io.emit('server status', {
					status: '100'
				});
			}, 1000);
		} else if (data.status == "100") {
			console.log("Recieved ping from client", data)
			io.emit('server status', {
				status: '100'
			});
		} else {
			console.log("device not ready");
			console.log(data);
		}
	});
	//On getting a message form the server
	socket.on('message', function (data) {
		console.log("Recieved Message");
		console.log(data);
		tty.emit('message', data);
	});

	output_socket = socket; // save global ugh
	//On disconnect stop emitting
	socket.on('disconnect', function () {
		io.emit('Esp disconnected');
	});
});


//////////
//
//	Keyboard handling
//
var cmd = '';
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (key) {
	if ((key === '\u0003') || (key == 'q')) process.exit();
	else if ((key === '\r') || (key == '\n')) {
		process.stdout.write('\r\n');
		output_socket.emit(cmd);
		cmd = '';
	} else {
		process.stdout.write(key);
		cmd = cmd + key;
	}
});