#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>

String dooruino = "5bcb0a5a3b78253d44e2bbb9";

const char *ssid = "Pulsate Technologies Node"; //AP Name (Server Name)
const char *password = "pulsatemay24";          //Set wifi password
HTTPClient http;
ESP8266WebServer server;

int port = 9899;
String httpIp = "192.168.1.102";

// temperature
#define MAX6675_CS 10
#define MAX6675_SO 12
#define MAX6675_SCK 13
int temperature = 0;
long int iterator = 0;

//buffers
StaticJsonBuffer<200> jsonBuffer;
char json[] = "{}";
int wit = 0;

// PIR management
int calibrationTime = 15000;
long unsigned int lowIn;
long unsigned int pause = 2500;
int readPause = 5000;

int pirPin1 = 5; // out
int pirPin2 = 6; // in

char buffer[48];

void onState()
{
  Serial.println("Someone entered the room");
}

void offState()
{
  Serial.println("Someone left the room");
}

void setup()
{
  Serial.begin(9600);
  pinMode(pirPin1, INPUT);
  pinMode(pirPin2, INPUT);
  digitalWrite(pirPin1, LOW);

  //give the sensor some time to calibrate
  Serial.print("calibrating sensor ");
  delay(calibrationTime);
  Serial.println(" done");
  Serial.println("SENSORS ACTIVE");
  delay(50);

  Serial.begin(115200); /* begin serial for debug */
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }
  server.on("/", []() {
    server.send(200, "application/json", "{\"msg\" : \"systemok.\", \"key\":\"" + dooruino + "\"}");
  });
  server.begin();
}

void loop()
{
  server.handleClient();
  if (digitalRead(pirPin1) || digitalRead(pirPin2))
  {
    if (digitalRead(pirPin1))
    {
      for (; digitalRead(pirPin1);)
      {
        onState();
        if (digitalRead(pirPin2))
        {
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
          onState();
          delay(readPause);
        }
      }
    }
    else
    {
      offState();
    }
  }
  if (WiFi.status() != WL_CONNECTED)
  {
    WiFi.begin(ssid, password);
    delay(500);
  }
  else
  {
    if (iterator % 10 == 0)
    {
      String msg = "{\"key\": \"" + dooruino + "\", \"type\":\"dooruino\"}";
      http.begin(httpIp, port, "/test");
      http.addHeader("Content-Type", "application/json");
      http.POST(msg);

      delay(100);
    }
    iterator++;
  }
  delay(10);
}

double readThermocouple()
{

  uint16_t v;
  pinMode(MAX6675_CS, OUTPUT);
  pinMode(MAX6675_SO, INPUT);
  pinMode(MAX6675_SCK, OUTPUT);

  digitalWrite(MAX6675_CS, LOW);
  delay(1);

  // Read in 16 bits,
  //  15    = 0 always
  //  14..2 = 0.25 degree counts MSB First
  //  2     = 1 if thermocouple is open circuit
  //  1..0  = uninteresting status

  v = shiftIn(MAX6675_SO, MAX6675_SCK, MSBFIRST);
  v <<= 8;
  v |= shiftIn(MAX6675_SO, MAX6675_SCK, MSBFIRST);

  digitalWrite(MAX6675_CS, HIGH);
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
