#include <Wire.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid     = "Pulsate Technologies"; //AP Name (Server Name)
const char* password = "pulsatemay24";  //Set wifi password
HTTPClient http;

String message = "";


void setup() {
  Serial.begin(9600); /* begin serial for debug */
  Wire.begin(D1, D2); /* join i2c bus with SDA=D1 and SCL=D2 of NodeMCU */
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void loop() {
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
      http.begin("192.168.0.102", 9899, "/test/" + message);
      int httpCode1 = http.GET(); //get value
      delay(100);
    }
  }
  message = "";
  delay(10);
}
