// // rtsp://admin:pulsatemay24@192.168.1.108/cam/realmonitor?channel=1&subtype=0
// Stream = require("node-rtsp-stream");
// stream = new Stream({
// 	name: "name",
// 	streamUrl: "rtsp://admin:pulsatemay24@192.168.1.108/cam/realmonitor?channel=1&subtype=0",
// 	wsPort: 9498
// });
///////////////////////////////////////////////////////////////////////////////////////////////////
// const ffmpeg = require("ffmpeg");

// try {
// 	var process = new ffmpeg("rtsp://admin:pulsatemay24@192.168.1.108/cam/realmonitor?channel=1&subtype=0");
// 	process.then(function (video) {
// 		// Callback mode
// 		video.fnExtractFrameToJPG("./raw", function (error, file) {
// 			if (!error)
// 				console.log("Audio file: " + file);
// 		});
// 	}, function (err) {
// 		console.log("Error: " + err);
// 	});
// } catch (e) {
// 	console.log(e.code);
// 	console.log(e.msg);
// }
///////////////////////////////////////////////////////////////////////////////////////////////////
