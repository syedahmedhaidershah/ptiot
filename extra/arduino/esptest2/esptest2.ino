#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>

String arduino = "5b97af2437ae2329d879fa0e";

const char* ssid     = "Pulsate Technologies"; //AP Name (Server Name)
const char* password = "pulsatemay24";  //Set wifi password

bool initializer= false;
int iterator = 0;

HTTPClient http;
ESP8266WebServer server;

void handleRequest(){
  if(server.args() > 0){
    Serial.println(server.arg(0));
  }
  server.send(200, "application/json", "{\"msg\" : \"received.\"}");
}

void setup() {
  Serial.begin(9600);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
  }
  server.on("/", []() { server.send(200, "application/json", "{\"msg\" : \"systemok.\", \"key\":\""+arduino+"\"}"); });
  server.on("/update", handleRequest);
  server.begin();
}

void loop() {
  server.handleClient();
  if (!initializer) {
    http.begin("192.168.0.100", 9999, "/arduinoRegister");
    http.addHeader("Content-Type", "application/json");
    http.POST("{\"key\":\""+arduino+"\"}");
    initializer = true;
  }
  if(iterator%5000 == 0){
    http.begin("192.168.0.100", 9999, "/reviveArduino");
    http.addHeader("Content-Type", "application/json");
    http.POST("{\"key\":\""+arduino+"\"}");
  }
  iterator++;
}
