#include <ArduinoJson.h>
#include <Wire.h>

//buffers
StaticJsonBuffer<200> jsonBuffer;
char json[] = "{}";
int wit = 0;

// automation
const int relay1 = 22;
const int relay2 = 23;
const int relay3 = 24;

// energy management
const int voltIn = A1;
const int ampIn = A0;
int mVperAmp = 66; // use 100 for 20A Module and 66 for 30A Module
int RawValue = 0;
double sensorValue = 0;
int ACSoffset = 2500;
double Voltage = 0;
double Amps = 0;
double VeffD = 0, Veff;
double iHighest = 0, vHighest = 0;
int iterator = 0, sample = 0;
double vTemp = 0, iTemp = 0;

// PIR management
int calibrationTime = 15000;       
long unsigned int lowIn;
long unsigned int pause = 2500; 
int readPause = 5000;
 
int pirPin1 = 5; // out
int pirPin2 = 6; // in

char buffer[48];
 
void onState(){
  Serial.println("Someone entered the room");
}

void offState(){
  Serial.println("Someone left the room");
}

// function that executes whenever data is received from master
void receiveEvent(int howMany) {
 while (0 <Wire.available()) {
    char c = Wire.read();      /* receive byte as a character */
    json[wit++] = c;
 }
 wit = 0;
 JsonObject& root = jsonBuffer.parseObject(json);
 Serial.println(json);
}

// function that executes whenever data is requested from master
void requestEvent() {
 String message = "{\"amps\":"+String(iHighest)+ ",\"volts\":"+String(vHighest)+"}";
 message.toCharArray(buffer, 32);
 Wire.write(buffer);  /*send string on request */
}

void setup() {
  Wire.begin(8);                /* join i2c bus with address 8 */
  Wire.onReceive(receiveEvent); /* register receive event */
  Wire.onRequest(requestEvent); /* register request event */
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
}

void loop() {
  if(digitalRead(pirPin1) || digitalRead(pirPin2)){
    if(digitalRead(pirPin1)){ 
      for(;digitalRead(pirPin1);){
        onState();
        if(digitalRead(pirPin2)){
          delay(readPause);
        }
      }
    }
   else if(digitalRead(pirPin2)){
    for(;digitalRead(pirPin2);){
      if(digitalRead(pirPin1)){
        onState();
        delay(readPause);
      }
    }
   }
   else {
    offState();
   }
 }
  RawValue = analogRead(voltIn);
  sensorValue = analogRead(ampIn);

  Voltage = (RawValue / 1024.0) * 5000; // Gets you mV
  Amps = ((Voltage - ACSoffset) / mVperAmp);
  if (Amps > iHighest) {
    iHighest = Amps;
  }

  //  VeffD = sensorValue / sqrt(2);
  //  Veff = (((VeffD-440.76)/-105.24)*-200.2)+210.2;

  Veff = int(sensorValue - 511) * 2 - 7;
  if (Veff <= 7 || Veff < 0) {
    Veff = 0;
  }
  if (Veff > vHighest) {
    vHighest = Veff;
  }

  if (iterator > 0 && iterator % 50 == 0) {
    if (sample > 0 && sample % 40 == 0) {
      iHighest = iTemp / 40;
      vHighest = vTemp / 40;
      //
      vHighest = 0;
      iHighest = 0;
      iterator = 0;
      vTemp = 0;
      iTemp = 0;
      sample = 0;
    } else {
      vTemp += vHighest;
      iTemp += iHighest;
      sample++;
    }
  }

  iterator++;
  delay(1);
}
