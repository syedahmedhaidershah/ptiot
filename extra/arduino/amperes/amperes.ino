const int analogIn = A1;
int mVperAmp = 66; // use 100 for 20A Module and 66 for 30A Module
int RawValue = 0, sensorValue = 0;
int ACSoffset = 2500;
double Voltage = 0;
double Amps = 0;
double VeffD = 0, Veff;
double iHighest = 0, vHighest = 0;
int iterator = 0, sample = 0;
double vTemp = 0, iTemp = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  RawValue = analogRead(analogIn);
  sensorValue = analogRead(A0);

  Voltage = (RawValue / 1024.0) * 5000; // Gets you mV
  Amps = ((Voltage - ACSoffset) / mVperAmp);
  if (Amps > iHighest) {
    iHighest = Amps;
  }

  VeffD = sensorValue / sqrt(2);
  Veff = (((VeffD-440.76)/-105.24)*-200.2)+210.2;
  if (Veff > vHighest) {
    vHighest = Veff;
  }

  if (iterator > 0 && iterator % 50 == 0) {
    if (sample > 0 && sample % 40 == 0) {
      iHighest = iTemp/40;
      vHighest = vTemp/40;
      Serial.print(iHighest);
      Serial.print("A @ ");
      Serial.print(vHighest);
      Serial.print("V");
      Serial.println("  ( "+String(vHighest*iHighest)+"kWh )");
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
