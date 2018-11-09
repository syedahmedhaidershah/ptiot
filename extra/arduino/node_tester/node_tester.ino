#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char *ssid = "C05F4F2"; //AP Name (Server Name)
const char *password = "7307563B";          //Set wifi password
HTTPClient http;

const int s11 = D0;
const int s12 = D1;
const int s13 = D2;
const int s21 = D3;
const int s22 = D4;
const int s23 = D5;

//String arduino = "5bddb58491749e5fc007c2d2";
String arduino = "5bddb58491749e5fc007c2d3";

int iterator = 0;
int port = 9897;
String httpIp = "192.168.1.102";

// temperature
const int max6675_sck = D6;
const int max6675_cs = D7;
const int max6675_so = D8;
int temperature = 0;
double highest = 25;

void setup()
{
  pinMode(s11, OUTPUT);
  pinMode(s12, OUTPUT);
  pinMode(s13, OUTPUT);
  pinMode(s21, OUTPUT);
  pinMode(s22, OUTPUT);
  pinMode(s23, OUTPUT);
  pinMode(max6675_cs, OUTPUT);
  pinMode(max6675_so, INPUT);
  pinMode(max6675_sck, OUTPUT);
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }
  digitalWrite(max6675_cs, HIGH);
  digitalWrite(max6675_sck, LOW);
  digitalWrite(s11, HIGH);
  digitalWrite(s12, HIGH);
  digitalWrite(s13, HIGH);
  digitalWrite(s21, HIGH);
  digitalWrite(s22, HIGH);
  digitalWrite(s23, HIGH);
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
      double temperature = readThermocouple();
      if (temperature < 1000 && temperature != 0) {
        //        if(abs(temperature - highest) < 10){
        highest = temperature;
        //        }
      }
      String msg = "{\"key\": \"" + arduino + "\", \"type\":\"controller\", \"temperature\":\"" + String(highest) + "\"}";
      http.begin(httpIp, port, "/getstates");
      http.addHeader("Content-Type", "application/json");
      int code = http.POST(msg);
      String response = http.getString();
      http.end();
      if(code == 200){
        StaticJsonBuffer<100> jsonBuffer;
        char res[100];
        response.toCharArray(res, 100);
        JsonObject& root = jsonBuffer.parseObject(res);
        switch ((int)root["0"]) {
            case 0:
            digitalWrite(s11, HIGH);
            digitalWrite(s12, HIGH);
            digitalWrite(s13, HIGH);
            break;
            case 1:
            digitalWrite(s11, LOW);
            digitalWrite(s12, HIGH);
            digitalWrite(s13, HIGH);
            break;
            case 2:
            digitalWrite(s11, HIGH);
            digitalWrite(s12, LOW);
            digitalWrite(s13, HIGH);
            break;
            case 3:
            digitalWrite(s11, HIGH);
            digitalWrite(s12, HIGH);
            digitalWrite(s13, LOW);
            break;
            default:
            break;
        }
        switch ((int)root["1"]) {
            case 0:
            digitalWrite(s21, HIGH);
            digitalWrite(s22, HIGH);
            digitalWrite(s23, HIGH);
            break;
            case 1:
            digitalWrite(s22, HIGH);
            digitalWrite(s23, HIGH);
            digitalWrite(s21, LOW);
            break;
            case 2:
            digitalWrite(s21, HIGH);
            digitalWrite(s23, HIGH);
            digitalWrite(s22, LOW);
            break;
            case 3:
            digitalWrite(s21, HIGH);
            digitalWrite(s22, HIGH);
            digitalWrite(s23, LOW);
            break;
            default:
            break;
        }
      }
      delay(100);
    }
    iterator++;
  }
  delay(10);
}

double readThermocouple()
{

  uint16_t v;

  digitalWrite(max6675_cs, LOW);
  delay(2);

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
    return 1000;
  }

  // The lower three bits (0,1,2) are discarded status bits
  v >>= 3;

  // The remaining bits are the number of 0.25 degree (C) counts
  return v * 0.25;
}
