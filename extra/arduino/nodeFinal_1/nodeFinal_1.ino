#include <Wire.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>

String arduino = "5bb8ce7b94d9bc10a085b633";

const char* ssid     = "Pulsate Technologies Node"; //AP Name (Server Name)
const char* password = "pulsatemay24";  //Set wifi password
HTTPClient http;
ESP8266WebServer server;

int port = 9899;
String httpIp = "192.168.1.102";
bool initializer = false;
int iterator = 0;

String message = "";

void setup() {
  Serial.begin(115200); /* begin serial for debug */
  Wire.begin(D1, D2); /* join i2c bus with SDA=D1 and SCL=D2 of NodeMCU */
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  server.on("/", []() {
    server.send(200, "application/json", "{\"msg\" : \"systemok.\", \"key\":\"" + arduino + "\"}");
  });
  server.on("/update", HTTP_POST, []() {
    for (int i = 0; i < server.args(); i++) {
      Serial.println(server.argName(i));
      Serial.println(server.arg(i));
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
      String msg = "{\"key\": \"" + arduino + "\"}";
      http.begin(httpIp, port, "/arduinoRegister");
      http.addHeader("Content-Type", "application/json");
      http.POST(msg);
      initializer = true;
      delay(1000);
    }
    if (iterator % 10 == 0) {
      String msg = "{\"key\": \"" + arduino + "\"}"; 
      http.begin(httpIp, port, "/reviveArduino");
      http.addHeader("Content-Type", "application/json");
      http.POST(msg);
      
      delay(100);
    }
    iterator++;
  }
  
  Wire.beginTransmission(8);
  Wire.write("\0");
  Wire.endTransmission();

  Wire.requestFrom(8, 13); /* request & read data of size 13 from slave */
  while (Wire.available()) {
    char c = Wire.read();
    Serial.print(c);
    message += c;
    if (WiFi.status() != WL_CONNECTED) {
      WiFi.begin(ssid, password);
      delay(500);
    } else {
      http.begin(httpIp, port, "/test/" + message);
      int httpCode1 = http.GET(); //get value
      delay(100);
    }
  }
  message = "";
  delay(10);
}
