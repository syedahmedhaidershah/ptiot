const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const rtsp = require("rtsp-ffmpeg");
const fs = require("fs");
const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient();
var request = require('request');
server.listen(6147);

var writing = false;
var pc = 0;
var numFaces = 0;

function reset() {
	let now = new Date().getTime();
	fs.writeFile("./reset/" + now + ".txt", (err) => { reset(); });
}

function writingAllow(err, numFaces){
	if (numFaces == 0){
		try{
			request.get("http://localhost:5000",function(error, response, body){
				console.log(body);
				let second = 0;
				let j = null;
				let exitnow = false;
				try{
					j = JSON.parse(body);
				} catch(ex){
					exitnow = true;
					writing = false;
				}
				if(exitnow){
					console.log(body);
					return false;
				}
				Object.keys(j).forEach(function(k){
					if(j[k] > 0){
						second += j[k];
					}
				});
				if(second < 3){
					console.log("closing devices | local objects ="+second);
					request.post("http://192.168.1.100:9899/closedevices", function (error, response, body) {
						writing = false;
					});
				} else {
					try {
						console.log("turning devices on");
						request.post("http://192.168.1.100:9899/peopleinroom", function (error, response, body) {
							writing = false;
						});
					} catch (ex) {
						writing = false;
						console.log("error caught");
					}
				}
			});
		} catch (ex) {
			writing = false;
			console.log("error caught");
		}
	} else {
		try{
			console.log("turning devices on");
			request.post("http://192.168.1.100:9899/peopleinroom",function(error, response, body){
				writing = false;
			});
		} catch (ex) {
			writing = false;
			console.log("error caught");
		}
	}
}

function detectFaces(inputFile, callback) {
	// Make a call to the Vision API to detect the faces
	const request = { image: { source: { filename: inputFile } } };
	client
	.faceDetection(request)
	.then(results => {
		const faces = results[0].faceAnnotations;
		numFaces = faces.length;
		console.log(`faces: ${numFaces}`);
		callback(null, numFaces);
	})
	.catch(err => {
		console.error('ERROR:', err);
		callback(true, numFaces);
	});
}

var uri = "rtsp://admin:pulsatemay24@192.168.1.108/cam/realmonitor?channel=1&subtype=0";
var stream = new rtsp.FFMpeg({ input: uri });
io.on("connection", function (socket) {
	var pipeStream = function (data) {
		if (pc > 200) {
			pc = 0;
			stream = null;
			stream = new rtsp.FFMpeg({ input: uri });
			stream.on("data", pipeStream);
		}
		socket.emit("data", data.toString("base64"));
		let writable = data;
		try {
			// let path = new Date().getTime();
			if (!writing) {
				writing = true;
				console.log("written packet :" + pc); pc += 1;
				fs.writeFile("./raw/1.jpg", writable, (err) => {
					if (err) {
						reset();
						console.log(err);
					} else {
						detectFaces("./raw/1.jpg", writingAllow);
					}
				});
			}
		} catch (ex) {
			console.log("file is opened, cant be written to");
		}
	};
	stream.on("data", pipeStream);
	socket.on("disconnect", function () {
		stream.removeListener("data", pipeStream);
	});
});