/***
	arduino_client.ino: Hello World Socket.IO Client for Esp8266

	MIT License
	Copyright (c) [2016] [Dolapo Toki]

	This sketch listens for commands sent over the socket after the handshake is complete
	and prints the messages send to the serial console
	
	For testing, you will find a companion socket.io server in the file 
	index.js under the socket_io_server directory.

	Run the server ("node index.js"), then boot up the Esp with this sketch on it.	
	After a socket connection is established the server sends "Esps are amazing" every 3000ms, 
	this output is displayed to the console.

	You will need to adjust the Ipaddress and port below to match your network.
	By default the server runs on port 3000.
***/

#include <SPI.h>
#include <SocketIOClientSecure.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>

extern String RID;
extern String Rname;
extern String Rcontent;


String ssid;
String password;
//Behaviour diffrent based on if you are working on a dev board or a production-dev-board
const char* boardMode="dev-board";
const int httpPort = 3000;
//Host server address
IPAddress server(192, 168, 1, 74);
SocketIOClientSecure socketIOClient;

unsigned long now;
void setup()
{
	Serial.begin(115200);
	delay(100);
	//On-boarding for dev-board mode 
	if (boardMode == "dev-board") {
		//Setup ssid
		Serial.println("Setting up......");

		Serial.println("Enter your ssid: ");
		//Wait for user input
		while (Serial.available() == 0) {

		}
		ssid = Serial.readStringUntil('\n');

		//Setup password
		Serial.println("Enter your password: ");
		//Wait for user input
		while (Serial.available() == 0) {

		}
		password = Serial.readStringUntil('\n');

		Serial.println("Connecting with this details...");
		
	}
	//Tempoary values for ssid and password
	char ssid_char_temp[100];
	char ssid_password_temp[100];
	for (int i = 0; i <= ssid.length(); i++) {
		ssid_char_temp[i] = ssid.charAt(i);
	}
	for (int k = 0; k<= password.length(); k++) {
		ssid_password_temp[k] = password.charAt(k);
	}

	//Output values to the screen
	
	Serial.println("Ssid: " + String(ssid_char_temp) + " Password: " + String(password));
	
	//Connect to Wifi
	connectToWifi(ssid_char_temp, ssid_password_temp);

	//Create server object using ip insted of dns
	if (!socketIOClient.connect(server, httpPort)) Serial.println(F("Not connected."));
	if (socketIOClient.connected())
	{
		Serial.println("Conection susseful..");
		socketIOClient.send("device status", "status", "200");
	}
	else
	{
		Serial.println("Connection Error");
		while (1);
	}
	now=0000UL;
	delay(500);
}

void loop()
{

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
	delay(500);

}
//Method to connect wifi acess point
void connectToWifi(const char* ssid, const char* password) {
	Serial.print("Connecting to ");
	Serial.println(ssid);
	//Wifi.begin bug, the connection is reestabliched with the old details even when new ones are passed bug #2186 https://github.com/esp8266/Arduino/issues/2186
	//Persistence has to be false for now because of that
	WiFi.persistent(false);
	WiFi.mode(WIFI_OFF);   // this is a temporary line, to be removed after SDK update to 1.5.4
	//Set wifi mode to ap_sta
	WiFi.mode(WIFI_AP_STA);
	if (WiFi.status() != WL_CONNECTED) {
		WiFi.begin(ssid, password);
	}
	while (WiFi.status() != WL_CONNECTED) {
		delay(500);
		Serial.print(".");
	}
	
	Serial.println("");
	Serial.println("WiFi connected");
	Serial.println("IP address: ");
	Serial.println(WiFi.localIP());
	delay(1000);
}

