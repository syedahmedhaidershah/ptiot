#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>

String dooruino = "5bcb0a5a3b78253d44e2bbb9";

const char *ssid = "Pulsate Technologies Node"; //AP Name (Server Name)
const char *password = "pulsatemay24";          //Set wifi password
HTTPClient http;
ESP8266WebServer server;

int port = 9899;
String httpIp = "192.168.1.102";

//buffers
StaticJsonBuffer<200> jsonBuffer;
char json[] = "{}";
int wit = 0;

void setup() {
  Serial.begin(9600);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }
  server.on("/", []() {
    server.send(200, "application/json", "{\"msg\" : \"systemok.\", \"key\":\"" + dooruino + "\"}");
  });
  server.begin();
}

void loop() {
  server.handleClient();
  if (WiFi.status() != WL_CONNECTED)
  {
    WiFi.begin(ssid, password);
    delay(500);
  }
  else
  {
    String msg = "{\"key\": \"" + dooruino + "\", \"type\":\"dooruino\"}";
    http.begin(httpIp, port, "/test");
    http.addHeader("Content-Type", "application/json");
    http.POST(msg);
    delay(100);
  }
  delay(10);
}
