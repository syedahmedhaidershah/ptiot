#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
 
const char* ssid     = "Pulsate Technologies"; //AP Name (Server Name)
const char* password = "pulsatemay24";  //Set wifi password
const char* host = "http://192.168.4.1";  //Default IP of ESP8266
String stateVal="0";
 
int val1;
const int inVal1 = 5; // Pin Push Button
 
HTTPClient http;
void setup() {
  Serial.begin(115200);
  delay(10);
  Serial.print("CONNECTED TO AP: ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA); 
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
  delay(500);
  Serial.print(".......");
  delay(500);
  }
  Serial.println("CONNECTED...");  
}
void loop(){
 val1=digitalRead(inVal1); 
  if (val1 == 1){  //Turn val1 to HIGH state
    stateVal="1";}
   else{
    stateVal="0"; 
  }
 
if(WiFi.status() != WL_CONNECTED){
  WiFi.begin(ssid, password);
  delay(500);
}else{
  http.begin("192.168.4.1", 80, "/led/"+stateVal);
  int httpCode1 = http.GET(); //get value 
  delay(100);   
 }
}
