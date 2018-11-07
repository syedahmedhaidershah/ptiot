#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>

String arduino = "5bddb58491749e5fc007c2d2";

const char* ssid     = "C05F4F2"; //AP Name (Server Name)
const char* password = "7307563B";  //Set wifi password
HTTPClient http;
ESP8266WebServer server;

// automation
const int relay1 = D0;
const int relay2 = D1;
const int relay3 = D2;
const int relay4 = D3;
const int relay5 = D4;
const int relay6 = D5;

int port = 9899;
String httpIp = "192.168.1.100";
bool initializer = false;
int iterator = 0;

String message = "";

bool states[] = {HIGH, HIGH, HIGH, HIGH, HIGH, HIGH};

void setup() {
  //  Serial.begin(115200); /* begin serial for debug */
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  server.on("/", []() {
    server.send(200, "application/json", "{\"msg\" : \"systemok.\", \"key\":\"" + arduino + "\", \"type\":\"arduino\"}");
  });
  server.on("/update", HTTP_POST, []() {
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& root = jsonBuffer.parseObject(server.arg("plain"));
    int switcher = (int) root["device"];
    bool state = !(bool)((int) root["switch"]);
    switch (switcher) {
      case 0:
        if (states[4] != state) {
          states[0] = state;
          digitalWrite(relay1, states[0]);
        }
        break;
      case 1:
        if (states[4] != state) {
          states[1] = state;
          digitalWrite(relay2, states[1]);
        }
        break;
      case 2:
        if (states[4] != state) {
          states[2] = state;
          digitalWrite(relay3, states[2]);
        }
        break;
      case 3:
        if (states[4] != state) {
          states[3] = state;
          digitalWrite(relay4, states[3]);
        }
        break;
      case 4:
        if (states[4] != state) {
          states[4] = state;
          digitalWrite(relay5, states[4]);
        }
        break;
      case 5:
        if (states[4] != state) {
          states[5] = state;
          digitalWrite(relay6, states[5]);
        }
        break;
      default:
        break;
    }
    server.send(200, "text/plain", "system ok.");
  });
  server.begin();
  pinMode(relay1, OUTPUT);
  pinMode(relay2, OUTPUT);
  pinMode(relay3, OUTPUT);
  pinMode(relay4, OUTPUT);
  pinMode(relay5, OUTPUT);
  pinMode(relay6, OUTPUT);
  digitalWrite(relay1, HIGH);
  digitalWrite(relay2, HIGH);
  digitalWrite(relay3, HIGH);
  digitalWrite(relay4, HIGH);
  digitalWrite(relay5, HIGH);
  digitalWrite(relay6, HIGH);
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
    //    if (iterator % 10 == 0) {
    if (iterator%100 == 0) {
      String msg = "{\"key\": \"" + arduino + "\", \"type\":\"arduino\"}";
      http.begin(httpIp, port, "/reviveArduino");
      http.addHeader("Content-Type", "application/json");
      http.POST(msg);
      StaticJsonBuffer<200> jsonBuffer;
      JsonObject& root = jsonBuffer.parseObject(http.getString());
      if (states[0] == (bool)((int) root["0"])) {
        states[0] = !(bool)((int) root["0"]);
        digitalWrite(relay1, states[0]);
      }
      if (states[1] == (bool)((int) root["1"])) {
        states[1] = !(bool)((int) root["1"]);
        digitalWrite(relay2, states[1]);
      }
      if (states[2] == (bool)((int) root["2"])) {
        states[2] = !(bool)((int) root["2"]);
        digitalWrite(relay3, states[2]);
      }
      if (states[3] == (bool)((int) root["3"])) {
        states[3] = !(bool)((int) root["3"]);
        digitalWrite(relay4, states[3]);
      }
      if (states[4] == (bool)((int) root["4"])) {
        states[4] = !(bool)((int) root["4"]);
        digitalWrite(relay5, states[4]);
      }
      if (states[5] == (bool)((int) root["5"])) {
        states[5] = !(bool)((int) root["5"]);
        digitalWrite(relay6, states[5]);
      }
      delay(100);
    }
    iterator++;
  }
  delay(10);
}
