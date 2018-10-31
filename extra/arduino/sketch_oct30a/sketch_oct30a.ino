#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char *ssid = "Pulsate Technologies Node"; //AP Name (Server Name)
const char *password = "pulsatemay24";          //Set wifi password
HTTPClient http;

const int s11 = D0;
const int s12 = D1;
const int s13 = D3;
const int s21 = D4;
const int s22 = D5;
const int s23 = D6;

String arduino = "5bc0ae373850912e247c9644";

int iterator = 0;
int port = 9899;
String httpIp = "192.168.1.102";

void setup()
{
    Serial.begin(115200);
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
    }
}

void loop()
{
    if (WiFi.status() != WL_CONNECTED)
    {
        WiFi.begin(ssid, password);
        delay(500);
    }
    else
    {
        if (iterator % 10 == 0)
        {
            String msg = "{\"key\": \"" + arduino + "\", \"type\":\"controller\"}";
            http.begin(httpIp, port, "/getstates");
            http.addHeader("Content-Type", "application/json");
            http.POST(msg);
            String response = http.getString();
            StaticJsonBuffer<100> jsonBuffer;
            char res[100];
            response.toCharArray(res, 1000);
            JsonObject& root = jsonBuffer.parseObject(res);
            if(root["0"].asString() == "6"){
              switch(root["1"].as<int>()){
                case 0:
                  digitalWrite(s11,LOW);
                  digitalWrite(s12,LOW);
                  digitalWrite(s13,LOW);
                  break;
                case 1:
                  digitalWrite(s11,HIGH);
                  digitalWrite(s12,LOW);
                  digitalWrite(s13,LOW);
                  break;
                case 2:
                  digitalWrite(s11,LOW);
                  digitalWrite(s12,HIGH);
                  digitalWrite(s13,LOW);
                  break;
                case 3:
                  digitalWrite(s11,LOW);
                  digitalWrite(s12,LOW);
                  digitalWrite(s13,HIGH);
                  break;
                default:
                  break;
              }
            }
            if(root["2"].asString() == "7"){
              switch(root["3"].as<int>()){
                case 0:
                  digitalWrite(s21,LOW);
                  digitalWrite(s22,LOW);
                  digitalWrite(s23,LOW);
                  break;
                case 1:
                  digitalWrite(s21,HIGH);
                  digitalWrite(s22,LOW);
                  digitalWrite(s23,LOW);
                  break;
                case 2:
                  digitalWrite(s21,LOW);
                  digitalWrite(s22,HIGH);
                  digitalWrite(s23,LOW);
                  break;
                case 3:
                  digitalWrite(s21,LOW);
                  digitalWrite(s22,LOW);
                  digitalWrite(s23,HIGH);
                  break;
                default:
                  break;
              }
            }
            Serial.println(root["0"].asString());
            Serial.println(root["1"].asString());
            Serial.println(root["2"].asString());
            Serial.println(root["3"].asString());
            delay(100);
        }
        iterator++;
    }
    delay(10);
}

