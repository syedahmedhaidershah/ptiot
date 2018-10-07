#include <ArduinoJson.h>
#include <Wire.h>
#include <SPI.h>

// temperature
#define MAX6675_CS   10
#define MAX6675_SO   12
#define MAX6675_SCK  13
int temperature = 0;

//buffers
StaticJsonBuffer<200> jsonBuffer;
char json[] = "{}";
int wit = 0;

// automation
const int relay1 = 22;
const int relay2 = 23;
const int relay3 = 24;

// PIR management
int calibrationTime = 15000;       
long unsigned int lowIn;
long unsigned int pause = 2500; 
int readPause = 5000;
 
int pirPin1 = 5; // out
int pirPin2 = 6; // in

char buffer[48];
 
void onState(){
  Serial.println("Someone entered the room");
}

void offState(){
  Serial.println("Someone left the room");
}

// function that executes whenever data is received from master
void receiveEvent(int howMany) {
 while (0 <Wire.available()) {
    char c = Wire.read();      /* receive byte as a character */
    json[wit++] = c;
 }
 wit = 0;
 JsonObject& root = jsonBuffer.parseObject(json);
 Serial.println(json);
}

// function that executes whenever data is requested from master
void requestEvent() {
  temperature = readThermocouple();
  String message = "{\"temperature\":"+String(temperature)+"}";
  message.toCharArray(buffer, 32);
  Wire.write(buffer);  /*send string on request */
}

void setup() {
  Wire.begin(21);                /* join i2c bus with address 8 */
  Wire.onReceive(receiveEvent); /* register receive event */
  Wire.onRequest(requestEvent); /* register request event */
  Serial.begin(9600);
  pinMode(pirPin1, INPUT);
  pinMode(pirPin2, INPUT);
  digitalWrite(pirPin1, LOW);
 
  //give the sensor some time to calibrate
  Serial.print("calibrating sensor ");
  delay(calibrationTime);
  Serial.println(" done");
  Serial.println("SENSORS ACTIVE");
  delay(50);
}

void loop() {
  if(digitalRead(pirPin1) || digitalRead(pirPin2)){
    if(digitalRead(pirPin1)){ 
      for(;digitalRead(pirPin1);){
        onState();
        if(digitalRead(pirPin2)){
          delay(readPause);
        }
      }
    }
   else if(digitalRead(pirPin2)){
    for(;digitalRead(pirPin2);){
      if(digitalRead(pirPin1)){
        onState();
        delay(readPause);
      }
    }
   }
   else {
    offState();
   }
 }
}

double readThermocouple() {

  uint16_t v;
  pinMode(MAX6675_CS, OUTPUT);
  pinMode(MAX6675_SO, INPUT);
  pinMode(MAX6675_SCK, OUTPUT);
  
  digitalWrite(MAX6675_CS, LOW);
  delay(1);

  // Read in 16 bits,
  //  15    = 0 always
  //  14..2 = 0.25 degree counts MSB First
  //  2     = 1 if thermocouple is open circuit  
  //  1..0  = uninteresting status
  
  v = shiftIn(MAX6675_SO, MAX6675_SCK, MSBFIRST);
  v <<= 8;
  v |= shiftIn(MAX6675_SO, MAX6675_SCK, MSBFIRST);
  
  digitalWrite(MAX6675_CS, HIGH);
  if (v & 0x4) 
  {    
    // Bit 2 indicates if the thermocouple is disconnected
    return NAN;     
  }

  // The lower three bits (0,1,2) are discarded status bits
  v >>= 3;

  // The remaining bits are the number of 0.25 degree (C) counts
  return v*0.25;
}
