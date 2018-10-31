const int d1 = D0;
const int d2 = D1;
const int d3 = D2;
const int d4 = D3;
const int d5 = D4;
const int d6 = D5;
const int d7 = D6;
const int d8 = D7;
const int d9 = D8;

void setup(){
  pinMode(d1,OUTPUT);
  digitalWrite(d1,LOW);
  pinMode(d2,OUTPUT);
  digitalWrite(d2,LOW);
  pinMode(d3,OUTPUT);
  digitalWrite(d3,LOW);
  pinMode(d4,OUTPUT);
  digitalWrite(d4,LOW);
  pinMode(d5,OUTPUT);
  digitalWrite(d5,LOW);
  pinMode(d6,OUTPUT);
  digitalWrite(d6,LOW);
  pinMode(d7,OUTPUT);
  digitalWrite(d8,LOW);
  pinMode(d9,OUTPUT);
  digitalWrite(d9,LOW);
}

void loop(){
  digitalWrite(d1,HIGH);
  digitalWrite(d2,HIGH);
  digitalWrite(d3,HIGH);
  digitalWrite(d4,HIGH);
  digitalWrite(d5,HIGH);
  digitalWrite(d6,HIGH);
  digitalWrite(d7,HIGH);
  digitalWrite(d8,HIGH);
}

