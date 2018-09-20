#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
//#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>

String arduino = "5b587facae5d0f2600e2cd8b";

const char* ssid     = "Pulsate Technologies"; //AP Name (Server Name)
const char* password = "pulsatemay24";  //Set wifi password

//int iterator = 0;

//HTTPClient http;
ESP8266WebServer server;

void setup() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
  }
  server.on("/", []() { server.send(200, "application/json", "{\"msg\" : \"systemok.\", \"key\":\""+arduino+"\"}"); });
  server.begin();
}

void loop() {
  server.handleClient();
//  if (iterator % 1000 == 0) {
//    http.begin("192.168.0.103", 9999, "/");
//    http.addHeader("Content-Type", "application/json");
//    http.POST("{\"msg\" : \"just checking\", \"key\":\""+arduino+"\"}");
//  }
//  iterator++;
}
