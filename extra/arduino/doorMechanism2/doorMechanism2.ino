const int in1 = A0;
const int in2 = A1;

void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println(analogRead(in1) - 150);
  Serial.println(analogRead(in2) - 150);
}
