//
// Copyright 2015 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

// FirebaseRoom_ESP8266 is a sample that demo using multiple sensors
// and actuactor with the FirebaseArduino library.

#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

// Set these to run example.
#define FIREBASE_HOST "murtazaiot.firebaseio.com"
#define FIREBASE_AUTH "v2wOlwzlBjvgFEAQttjzyft5ZOS29PWkHuLCayHA"
#define WIFI_SSID "wifi"
#define WIFI_PASSWORD "taimoor11"

int before = 0;
int after = 0;

void setup() {
  Serial.begin(9600);

  // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}


void loop() {
  if(!digitalRead(D1)){
     before = random(0,1);
     after = random (0,500);
     Firebase.setString("voltage", String(before) + "." + String(after));
     float power = (before + (after/1000)) * 1.16;
     Firebase.setString("power", String(power));
  } else {
     before = random(12,15);
     after = random (0,500);
     Firebase.setString("voltage", String(before) + "." + String(after));
     float power = (before + (after/1000)) * 1.16;
     Firebase.setString("power", String(power));
  }
  delay(200);
}
