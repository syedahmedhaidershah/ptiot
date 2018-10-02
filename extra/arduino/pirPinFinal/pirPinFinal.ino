//the time we give the sensor to calibrate (10-60 secs according to the datasheet)
int calibrationTime = 15000;       
 
//the time when the sensor outputs a low impulse
long unsigned int lowIn;        
 
//the amount of milliseconds the sensor has to be low
//before we assume all motion has stopped
long unsigned int pause = 2500; 
int readPause = 5000;
 
int pirPin1 = 3;
int pirPin2 = 9;
int ledPin = 13;

 
void onState(){
  
}

void offState(){
  
}

/////////////////////////////
//SETUP
void setup(){
  Serial.begin(9600);
  pinMode(pirPin1, INPUT);
  pinMode(pirPin2, INPUT);
  pinMode(ledPin, OUTPUT);
  digitalWrite(pirPin1, LOW);
 
  //give the sensor some time to calibrate
  Serial.print("calibrating sensor ");
  delay(calibrationTime);
  Serial.println(" done");
  Serial.println("SENSORS ACTIVE");
  delay(50);
}
 
////////////////////////////
//LOOP
void loop(){
 if(digitalRead(pirPin1) || digitalRead(pirPin2)){
    if(digitalRead(pirPin1)){ 
      for(;digitalRead(pirPin1);){
        onState();
        if(digitalRead(pirPin2)){
          Serial.println("coming in");
          delay(readPause);
        }
      }
    }
   else if(digitalRead(pirPin2)){
    for(;digitalRead(pirPin2);){
      if(digitalRead(pirPin1)){
        onState();
        Serial.println("going out");
        delay(readPause);
      }
    }
   }
   else {
    offState();
   }
 }
}
