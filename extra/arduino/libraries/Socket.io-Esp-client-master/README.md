# SocketIO Esp8266 Client 
#### an esp client for connecting and messaging with Socket.io servers over https.

This implementation is derived from [Bill Roy][1] and [washo4evr][2] Work you should check out there libraries. the major difference is that this library is implemented using HTTPS instead of HTTP because it's 2016 :stuck_out_tongue: 

***

## There are 2 examples included in this repository
* esp_client  _travis build script in the works_ :simple_smile:
* socket_io_server  [![Build Status](https://travis-ci.org/Capdt/socket.io-esp-client.svg?branch=master)](https://travis-ci.org/Capdt/socket.io-esp-client)

### Note

This library is not yet complete But it's features currently supports 2 way communication between the client and server.

### Installation Instructions

Clone this repository into your Ardunio Sketchbook directory under libraries, then restart the Ardunio IDE so that it notices the new library.  Now, under File\Examples you should see SocketIOClientSecure.
You can run the esp_client with the node server running to test out the implementation.
The server server a page to your local host that displays the messages being received form the Esp8266 you can view the page by going to the local host and the port you selected when running the server

```bash
cd .../.../socket_io_server
npm install         \\Install the dependencies
node index -p 3000  \\Serve application on port 3000 or any other port you like 
```
_Note if you change the port number you have to change the port on the esp\_client if you plan to run the sketch._


## How To Use This Library

### Sending data to the server
To send a message to the server you can use any of this methods, the RID specifies the identifier of the event the socket server listens too, 
Rname is the key and Rcontent is the value of the json object that will be sent.

```c++
//Sending data to the server
void send(String RID, String Rname, String Rcontent);
void sendJSON(String RID, String JSON);
```

In this case the ```RID='device status'``` and the ```{Rname: "Rcontent"}``` will be the ```data``` that is received.

```javascript
io.on('connection', function (socket) {
	socket.on('device status', function (data) {
		...
		...
	}
}

```
### Reading data from the server

This variables are shared across the Sketch. when data is sent from the server the the monitor and parser method in the libiary capture the following information
- RID: the the id of the event, 
- Rname and Rcontent the key and value pair of the data sent. 

```c++
extern String RID;
extern String Rname;
extern String Rcontent;
```

## Node snippet, Sends a status ping to the esp 
```javascript
...
...
sendPing = setInterval(function () {
	console.log("emitting message...");
	io.emit('server status', {
		status: '100'
	});
}, 1000);
...
...

```

## Sample Sketch, Prints the RID, Rname and Rcontent sent from the server.
_This also send a ping to the server every 10 seconds_
```c++

void loop(){ 
	...
	...
	if (socketIOClient.monitor())
	{
		Serial.print("RID: ");
		Serial.print(RID);
		Serial.print(", Rname: ");
		Serial.print(Rname);
		Serial.print(", Rcontent: ");
		Serial.println(Rcontent+" .");
		//Send ping to server
		if ((millis() - now) > 10000UL) {
			now = millis();
			Serial.println("Sending ping to server...");
			socketIOClient.send("device status", "status", "100");
		}
		socketIOClient.send("message", "Power", "off");
	}
	else if(!socketIOClient.connected()) {
		
		socketIOClient.connect(server, httpPort);
	}
}

```
## Sample Output
```
RID: server status, Rname: status, Rcontent: 100 .
```

[1]: https://github.com/billroy/socket.io-arduino-client
[2]: https://github.com/washo4evr/Socket.io-v1.x-Library

Made with :heart:
