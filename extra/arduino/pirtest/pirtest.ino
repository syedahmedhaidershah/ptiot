void setup() {
 Serial.begin(9600);

}

void loop() {
  Serial.print(analogRead(A0));
  Serial.print(" ____  ");
  Serial.println(analogRead(A5));
}
