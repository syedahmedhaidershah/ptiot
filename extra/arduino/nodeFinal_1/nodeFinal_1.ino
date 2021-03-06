#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>

String arduino = "5bc0ae373850912e247c9644";

const char* ssid     = "Pulsate Technologies Node"; //AP Name (Server Name)
const char* password = "pulsatemay24";  //Set wifi password
HTTPClient http;
ESP8266WebServer server;

// automation
const int relay1 = 22;
const int relay2 = 23;
const int relay3 = 24;

int port = 9899;
String httpIp = "192.168.1.102";
bool initializer = false;
int iterator = 0;

String message = "";

void setup() {
  Serial.begin(115200); /* begin serial for debug */
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  server.on("/", []() {
    server.send(200, "application/json", "{\"msg\" : \"systemok.\", \"key\":\"" + arduino + "\", \"type\":\"arduino\"}");
  });
  server.on("/update", HTTP_POST, []() {
    for (int i = 0; i < server.args(); i++) {
      String paramMessage = "{\""+server.argName(i) + "\" : \""+server.arg(i)+"\"}";
      Serial.println(paramMessage);
    }
    server.send(200, "text/plain", "system ok.");
  });
  server.begin();
}

void loop() {
  server.handleClient();  
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, password);
    delay(500);
  } else {
    if (!initializer) {
      String msg = "{\"key\": \"" + arduino + "\", \"type\":\"arduino\"}";
      http.begin(httpIp, port, "/arduinoRegister");
      http.addHeader("Content-Type", "application/json");
      http.POST(msg);
      initializer = true;
      delay(1000);
    }
    if (iterator % 10 == 0) {
      String msg = "{\"key\": \"" + arduino + "\", \"type\":\"arduino\"}"; 
      http.begin(httpIp, port, "/reviveArduino");
      http.addHeader("Content-Type", "application/json");
      http.POST(msg);
      
      delay(100);
    }
    iterator++;
  }
  delay(10);
}
