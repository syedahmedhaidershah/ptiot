const int d0 = 22;
const int d1 = 23;
const int d2 = 24;
const int t1 = 26;
const int t2 = 28;
const int t3 = 30;
const int t4 = 32;
const int t5 = 34;
const int t6 = 36;
bool state = false;
bool ds1, ds2, ds3;

void setup() {
  Serial.begin(9600);
  pinMode(d0,INPUT);
  pinMode(d1,INPUT);
  pinMode(d2,INPUT);
  pinMode(t1,OUTPUT);
  pinMode(t2,OUTPUT);
  pinMode(t3,OUTPUT);
  pinMode(t4,OUTPUT);
  pinMode(t5,OUTPUT);
  pinMode(t6,OUTPUT);
  digitalWrite(t1,HIGH);
  digitalWrite(t2,HIGH);
  digitalWrite(t3,HIGH);
  digitalWrite(t4,HIGH);
  digitalWrite(t5,HIGH);
  digitalWrite(t6,HIGH);
}

void loop() {
  ds1 = digitalRead(d2);
  ds2 = digitalRead(d1);
  ds3 = digitalRead(d0);
  
  if(ds1 && ds2 && ds3){ //111
    state = !state;
    digitalWrite(t1,state);
    delay(20);
  } else if(ds1 && ds2 && !ds3){  //110
    state = !state;
    digitalWrite(t2,state);
    delay(20);
  } else if(ds1 && !ds2 && ds3){
    state = !state;
    digitalWrite(t3,state);
    delay(20);
  } else if(ds1 && !ds2 && !ds3){
    state = !state;
    digitalWrite(t4,state);
    delay(20);
  } else if(!ds1 && ds2 && ds3){
    state = !state;
    digitalWrite(t5,state);
    delay(20);
  } else if(!ds1 && ds2 && !ds3){
    state = !state;
    digitalWrite(t6,state);
    delay(20);
  }
  delay(5);
}
