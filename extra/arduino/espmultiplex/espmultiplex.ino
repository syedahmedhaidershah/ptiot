const int d0 = D2;
const int d1 = D3;
const int d2 = D4;

void setup() {
  pinMode(d0,OUTPUT);
  pinMode(d1,OUTPUT);
  pinMode(d2,OUTPUT);
}

void loop() {
  digitalWrite(d2,HIGH);
  digitalWrite(d1,HIGH);
  digitalWrite(d0,HIGH);
  delay(100);
  digitalWrite(d2,HIGH);
  digitalWrite(d1,HIGH);
  digitalWrite(d0,LOW);
  delay(100);
  digitalWrite(d2,HIGH);
  digitalWrite(d1,LOW);
  digitalWrite(d0,HIGH);
  delay(100);
  digitalWrite(d2,HIGH);
  digitalWrite(d1,LOW);
  digitalWrite(d0,LOW);
  delay(100);
  digitalWrite(d2,LOW);
  digitalWrite(d1,HIGH);
  digitalWrite(d0,HIGH);
  delay(100);
  digitalWrite(d2,LOW);
  digitalWrite(d1,HIGH);
  digitalWrite(d0,LOW);
  delay(100);
  digitalWrite(d2,LOW);
  digitalWrite(d1,LOW);
  digitalWrite(d0,LOW);
  delay(100);
}
