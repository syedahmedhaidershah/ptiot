int LED = 53; // Use the onboard Uno LED
int isObstaclePin = 30; // This is our input pin
int isObstaclePin2 = 31; // This is our input pin
int isObstacle = HIGH; // HIGH MEANS NO OBSTACLE
int isObstacle2 = HIGH; // HIGH MEANS NO OBSTACLE

long int timer = 0;
int state = -1;

void setup() {
    pinMode(LED, OUTPUT);
    pinMode(isObstaclePin, INPUT);
    pinMode(isObstaclePin2, INPUT);
    Serial.begin(9600);
}


void loop() {
    isObstacle = digitalRead(isObstaclePin);
    isObstacle2 = digitalRead(isObstaclePin2);
    if (isObstacle == LOW && timer  == 0) {
      timer = micros();
    } else if (timer > 0){
      Serial.println("Leaving");
      timer = 0;
      delay(500);
    }
    if( isObstacle2 == LOW && timer != 0){
      Serial.println("Entering");
      timer = 0;
      delay(500);
    } else if(timer == 0){
        timer = micros();
    }
    delay(200);
}
