#include <Wire.h>

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
 
int pirPin1 = 3;
int pirPin2 = 9;
int ledPin = 13;

 
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
    Serial.print(c);           /* print the character */
  }
 Serial.println();             /* to newline */
}

// function that executes whenever data is requested from master
void requestEvent() {
 String message = "{/"amps/":"+String(iHighest)+ ",/"volts/":"+vHighest+"}";
 Wire.write(message);  /*send string on request */
}

void setup() {
  Wire.begin(8);                /* join i2c bus with address 8 */
  Wire.onReceive(receiveEvent); /* register receive event */
  Wire.onRequest(requestEvent); /* register request event */
  Serial.begin(9600);
  pinMode(pirPin1, INPUT);
  pinMode(pirPin2, INPUT);
  pinMode(ledPin, OUTPUT);
  digitalWrite(pirPin1, LOW);
 
  //give the sensor some time to calibrate
  Serial.print("calibrating sensor ");
  delay(calibrationTime);
  Serial.println(" done");
  Serial.println("SENSORS ACTIVE");
  delay(50);
}

void loop() {
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
