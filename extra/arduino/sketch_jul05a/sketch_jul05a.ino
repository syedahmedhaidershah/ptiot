#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

SoftwareSerial espSerial(D2, D3);

const char* ssid     = "Pulsate Technologies"; //AP Name (Server Name)
const char* password = "pulsatemay24";  //Set wifi password
const int interrupt = D0;
//const char* password = "" //Open no password
String message = "";
int statusCode = -1;

HTTPClient http;

int sendRequest(String ip, int port, String route) {
  http.begin(ip , port, route);
  return http.GET(); //get value
}

void setup() {
  Serial.begin(9600);
  espSerial.begin(4800);
  pinMode(interrupt, OUTPUT);
  digitalWrite(interrupt, HIGH);
  Serial.print("CONNECTING TO AP: ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
  }
  Serial.println("CONNECTED...");
}

void loop() {
  //  ESP.wdtDisable();
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, password);
    delay(100);
  } else {
    if (!espSerial.available()) {
      digitalWrite(interrupt, LOW);
    } else {
      digitalWrite(interrupt, HIGH);
      message = espSerial.readString();
      statusCode = sendRequest("192.168.0.103" , 9999, "/data/"+message);
//      delay(20);
      if(statusCode != 200){
        statusCode = sendRequest("192.168.0.103" , 9999, "/data/"+message);
      } else {
//        espSerial.flush();
//        delay(20);
        digitalWrite(interrupt, LOW); 
      }
      message = "";
    }
//    delay(20);
  }
}
