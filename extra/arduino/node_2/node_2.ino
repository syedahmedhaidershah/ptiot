#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

String dooruino = "5bddb58491749e5fc007c2d3";

const char *ssid = "C05F4F2"; //AP Name (Server Name)
const char *password = "7307563B";          //Set wifi password
HTTPClient http;
int port = 9899;
String httpIp = "192.168.1.100";

// temperature
const int max6675_cs = D0;
const int max6675_so = D1;
const int max6675_sck = D2;
int temperature = 0;
int iterator = 0;

// PIR management
int calibrationTime = 1000;
int lowIn;
int pause = 2500;
int readPause = 5000;

int pirPin1 = D3; // out
int pirPin2 = D4; // in

void setup()
{
  Serial.begin(115200);
  pinMode(pirPin1, INPUT);
  pinMode(pirPin2, INPUT);

  delay(calibrationTime);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }
  delay(100);
}

void sendRequest(String msg) {
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("here1");
    WiFi.begin(ssid, password);
    delay(500);
  }
  else
  {
    http.begin(httpIp, port, "/dooruino");
    http.addHeader("Content-Type", "application/json");
    http.POST(msg);
    delay(100);
    iterator++;
  }
  delay(10);
}

void loop()
{
  if (digitalRead(pirPin1) || digitalRead(pirPin2))
  {
    delay(100);
    if (digitalRead(pirPin1))
    {
      for (; digitalRead(pirPin1);)
      {
        if (digitalRead(pirPin2))
        {
          String msg = "{\"key\": \"" + dooruino + "\", \"type\":\"dooruino\", \"command\":\"roomentered\"}";
          sendRequest(msg);
          delay(readPause);
        }
      }
    }
    else if (digitalRead(pirPin2))
    {
      for (; digitalRead(pirPin2);)
      {
        if (digitalRead(pirPin1))
        {
          String msg = "{\"key\": \"" + dooruino + "\", \"type\":\"dooruino\", \"command\":\"roomleft\"}";
          sendRequest(msg);
          delay(readPause);
        }
      }
    }
    else
    { 
      String msg = "{\"key\": \"" + dooruino + "\", \"type\":\"dooruino\", \"command\":\"none\"}";
      sendRequest(msg);
    }
  }
}

double readThermocouple()
{

  uint16_t v;
  pinMode(max6675_cs, OUTPUT);
  pinMode(max6675_so, INPUT);
  pinMode(max6675_sck, OUTPUT);

  digitalWrite(max6675_cs, LOW);
  delay(1);

  // Read in 16 bits,
  //  15    = 0 always
  //  14..2 = 0.25 degree counts MSB First
  //  2     = 1 if thermocouple is open circuit
  //  1..0  = uninteresting status

  v = shiftIn(max6675_so, max6675_sck, MSBFIRST);
  v <<= 8;
  v |= shiftIn(max6675_so, max6675_sck, MSBFIRST);

  digitalWrite(max6675_cs, HIGH);
  if (v & 0x4)
  {
    // Bit 2 indicates if the thermocouple is disconnected
    return NAN;
  }

  // The lower three bits (0,1,2) are discarded status bits
  v >>= 3;

  // The remaining bits are the number of 0.25 degree (C) counts
  return v * 0.25;
}
