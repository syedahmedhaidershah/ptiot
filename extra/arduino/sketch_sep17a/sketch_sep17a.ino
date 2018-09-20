const int inpin = A0;
int reading = 0;

void setup() {
  Serial.begin(9600);
  pinMode(inpin, INPUT);
}

void loop() {
  reading = analogRead(inpin);
  reading = reading - 45;
  if(reading > 0){
    Serial.println("Show");
  } else {
    Serial.println("Bnd");
  }
}
