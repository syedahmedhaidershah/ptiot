#include <SoftwareSerial.h>

SoftwareSerial nodeSerial(3, 2);

const int voltsIn = A0;
const int ampsIn = A1;
const int interrupt = 7;
double volts = 0, amps = 0;
String sendParams = "";

const int analogIn = A1;
int mVperAmp = 66; // use 100 for 20A Module and 66 for 30A Module
int RawValue = 0;
double sensorValue = 0;
int ACSoffset = 2500;
double VeffD = 0, Veff;
double Voltage = 0;
double Amps = 0;
double iHighest = 0, vHighest = 0;
int iterator = 0, sample = 0;
double vTemp = 0, iTemp = 0;

void setup() {
  Serial.begin(9600);
  nodeSerial.begin(4800);
  pinMode(voltsIn, INPUT);
  pinMode(ampsIn, INPUT);
  pinMode(interrupt, INPUT);
}

void loop() {
  if (!digitalRead(interrupt)) {
    sendParams = String(volts) + "&" + String(amps);
    nodeSerial.print(sendParams);
  }
  else {
    RawValue = analogRead(analogIn);
    sensorValue = analogRead(A0);

    Voltage = (RawValue / 1024.0) * 5000; // Gets you mV
    Amps = ((Voltage - ACSoffset) / mVperAmp);
    if (Amps > iHighest) {
      iHighest = Amps;
    }

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
        volts = vHighest;
        amps = iHighest;
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
  }
}
