void setup(){
  Serial.begin(9600);
}

void loop(){
  Serial.println( String(analogRead(A1)) + " @ " + String(analogRead(A0)) );
  delay(100);
}

