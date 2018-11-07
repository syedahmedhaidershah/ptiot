const { RtspClient, H264Transport } = require("./lib");
const fs = require("fs");

const url = "rtsp://192.168.1.108";
const filename = "./raw/test.h264";
const temp= "./raw/temp.avi";
const username = "admin";
const password = "pulsatemay24";

const client = new RtspClient();

// details is a plain Object that includes...
//   format - string
//   mediaSource - media portion of the SDP
//   transport RTP and RTCP channels
//   connection - Stream Video via 'udp' or a 'tcp' from the RTSP server
client.connect(url, { keepAlive: true, connection: "tcp" }).then(details => {
	console.log("Connected. Video format is", details.format);
	// Open the output file
	if (details.isH264) {
    name = (new Date()).getTime()
    const h264 = new H264Transport(client, fs.createWriteStream(`./raw/test/${name}`), details);
	}

	client.play();
  
}).catch(e => console.log(e));

// data == packet.payload, just a small convenient thing
// data is for RTP packets
client.on("data", (channel, data, packet) => {
	console.log("RTP Packet", "ID=" + packet.id, "TS=" + packet.timestamp, "M=" + packet.marker);
});

// control data is for RTCP packets
client.on("controlData", (channel, rtcpPacket) => {
	console.log("RTCP Control Packet", "TS=" + rtcpPacket.timestamp, "PT=" + rtcpPacket.packetType);
});

// allows you to optionally allow for RTSP logging
// also allows for you to hook this into your own logging system easily
client.on("log", (data, prefix) => {
	console.log(prefix + ": " + data);
});