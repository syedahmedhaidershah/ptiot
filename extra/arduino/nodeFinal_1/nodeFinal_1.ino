#include <Wire.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>

String arduino = "5bb8dd74bb4028195cff03e2";

const char* ssid     = "Pulsate Technologies Node"; //AP Name (Server Name)
const char* password = "pulsatemay24";  //Set wifi password
HTTPClient http;
ESP8266WebServer server;

<<<<<<< HEAD
int port = 9899;
String httpIp = "192.168.1.102";
=======

uint16_t port = 9891;
String httpIp = "http://192.168.1.103";
>>>>>>> eb983c037ca1596a3018f90be68ded5c69f6ded1
bool initializer = false;
int iterator = 0;

String message = "";

void setup() {
  Serial.begin(9600); /* begin serial for debug */
  Wire.begin(D1, D2); /* join i2c bus with SDA=D1 and SCL=D2 of NodeMCU */
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  server.on("/", []() {
    server.send(200, "application/json", "{\"msg\" : \"systemok.\", \"key\":\"" + arduino + "\"}");
  });
  server.on("/update", []() {
    for (int i = 0; i < server.args(); i++) {
      Serial.println(server.argName(i));
      Serial.println(server.arg(i));
    }
  });
  server.begin();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, password);
    delay(500);
  } else {
    if (!initializer) {
      String msg = "{\"key\": \"" + arduino + "\"}";
      http.begin(httpIp, port, "/arduinoRegister");
      http.addHeader("Content-Type", "text/plain");
      http.POST(msg);
      initializer = true;
<<<<<<< HEAD
      delay(1000);
=======
      delay(100);
>>>>>>> eb983c037ca1596a3018f90be68ded5c69f6ded1
    }
    if (iterator % 10 == 0) {
      String msg = "{\"key\": \"" + arduino + "\"}"; 
      http.begin(httpIp, port, "/reviveArduino");
      http.addHeader("Content-Type", "text/plain");
<<<<<<< HEAD
      http.POST(msg);
      
=======
      int state = http.POST(msg);
>>>>>>> eb983c037ca1596a3018f90be68ded5c69f6ded1
      delay(100);
      Serial.println(state);
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
//      http.begin(httpIp, port, "/test/" + message);
//      int httpCode1 = http.POST(); //get value
//      delay(100);
    }
  }
  message = "";
  delay(10);
}
