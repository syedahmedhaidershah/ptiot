#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char *ssid = "Pulsate Technologies Node"; //AP Name (Server Name)
const char *password = "pulsatemay24";          //Set wifi password
HTTPClient http;
ESP8266WebServer server;

String arduino = "5bc0ae373850912e247c9644";

int iterator = 0;

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
            String msg = http.POST(msg);
            Serial.println(msg);
            delay(100);
        }
        iterator++;
    }
    delay(10);
}
