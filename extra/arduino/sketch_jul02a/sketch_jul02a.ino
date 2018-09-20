const int analogIn = A1;
int mVperAmp = 66; // use 100 for 20A Module and 66 for 30A Module
int RawValue = 0;
int ACSoffset = 2500;
double Voltage = 0;
double Amps = 0;
double highest = 0;
int iterator = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  RawValue = analogRead(analogIn);
  Voltage = (RawValue / 1024.0) * 5000; // Gets you mV
  Amps = ((Voltage - ACSoffset) / mVperAmp);
  if(Amps > highest){
    highest = Amps;
  }

  if(iterator > 0 && iterator%50 == 0){
    if(highest < 1){
      Serial.print(highest*1000);
      Serial.println(" mA");
    } else {
      Serial.print(highest);
      Serial.println(" A");
    }
    highest = 0;
    iterator = 0;
  }

  iterator++;
  delay(20);
}
