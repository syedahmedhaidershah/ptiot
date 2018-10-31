const reader = 13;
int printer = 0;

void setup(){
    pinMode(reader, INPUT);
}

void loop(){
  bool state = digitalRead(reader);
  Serial.println(state);
  delay(1000);
}

