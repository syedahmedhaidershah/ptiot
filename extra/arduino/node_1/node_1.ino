#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>

String arduino = "5bd8f81615e2e94948dfa01b";

const char* ssid     = "Pulsate Technologies Node"; //AP Name (Server Name)
const char* password = "pulsatemay24";  //Set wifi password
HTTPClient http;
ESP8266WebServer server;

// automation
const int relay1 = 22;
const int relay2 = 23;
const int relay3 = 24;
const int relay4 = 25;
const int relay5 = 26;
const int relay6 = 27;

int port = 9899;
String httpIp = "192.168.1.102";
bool initializer = false;
int iterator = 0;

String message = "";

bool states[] = {HIGH, HIGH, HIGH, HIGH, HIGH, HIGH};

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
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& root = jsonBuffer.parseObject(server.arg("plain"));
    int switcher = root["device"]<int>;
    state[switcher] = !state[switcher];
    digitalWrite(relay, state[switcher]);
    server.send(200, "text/plain", "system ok.");
  });
  server.begin();
  digitalRead(relay1, HIGH);
  digitalRead(relay2, HIGH);
  digitalRead(relay3, HIGH);
  digitalRead(relay4, HIGH);
  digitalRead(relay5, HIGH);
  digitalRead(relay6, HIGH);
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
