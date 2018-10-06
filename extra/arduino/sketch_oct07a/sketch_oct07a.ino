#include <SocketIOClientSecure.h>

#include "C:/Users/Lenovo/Documents/Arduino/libraries/SocketIoClient/SocketIoClient.h"

#define SOFTAP_MODE

#ifdef SOFTAP_MODE
const char* password = "myMinion";
#else
const char* ssid = "Pulsate Technologies Node";
const char* password = "pulsateMay24";
#endif

const char HexLookup[17] = "0123456789ABCDEF";

String host = "192.168.1.102";
int port = 9991;

SocketIOClient socket;

void setupNetwork() {
  #ifdef SOFTAP_MODE
    WiFi.disconnect();
    byte mac[6];
    WiFi.macAddress(mac);
    char ssid[14] = "Minion-000000";
    ssid[7] = HexLookup[(mac[3] & 0xf0) >> 4];
    ssid[8] = HexLookup[(mac[3] & 0x0f)];
    ssid[9] = HexLookup[(mac[4] & 0xf0) >> 4];
    ssid[10] = HexLookup[(mac[4] & 0x0f)];
    ssid[11] = HexLookup[(mac[5] & 0xf0) >> 4];
    ssid[12] = HexLookup[(mac[5] & 0x0f)];
    ssid[13] = 0;
    WiFi.softAP(ssid, password);
  #else
    WiFi.begin(ssid, password);
    uint8_t i = 0;
    while (WiFi.status() != WL_CONNECTED && i++ < 20) delay(500);
    if(i == 21){
      while(1) delay(500);
    }
  #endif

}

void response(String msg) {
  Serial.println(msg);
}

void setup() {
  Serial.begin(115200);
  setupNetwork();
  socket.on("response", response);
  socket.connect(host, port);
}

void loop() {
  socket.monitor();
  delay(1000);
  socket.emit("test","teststr");
  delay(1000);
}


