#define RELAY1  22                        
#define RELAY2  23                        
#define RELAY3  24                       
#define RELAY4  25
#define RELAY5  26
#define RELAY6  27
#define RELAY7  28
#define RELAY8  29
 
void setup()

{    

// Initialise the Arduino data pins for OUTPUT

  pinMode(RELAY1, OUTPUT);       

  pinMode(RELAY2, OUTPUT);

  pinMode(RELAY3, OUTPUT);

  pinMode(RELAY4, OUTPUT);

  pinMode(RELAY5, OUTPUT);

  pinMode(RELAY6, OUTPUT);

  pinMode(RELAY7, OUTPUT);

  pinMode(RELAY8, OUTPUT);

}

 

 void loop()

{

   digitalWrite(RELAY1,LOW);           // Turns ON Relays 1

   delay(500);                                      // Wait 2 seconds

   digitalWrite(RELAY1,HIGH);          // Turns Relay Off

 

   digitalWrite(RELAY2,LOW);           // Turns ON Relays 2

   delay(500);                                      // Wait 2 seconds

   digitalWrite(RELAY2,HIGH);          // Turns Relay Off

 

   digitalWrite(RELAY3,LOW);           // Turns ON Relays 3

   delay(500);                                      // Wait 2 seconds

   digitalWrite(RELAY3,HIGH);          // Turns Relay Off

 

   digitalWrite(RELAY4,LOW);           // Turns ON Relays 4

   delay(500);                                      // Wait 2 seconds

   digitalWrite(RELAY4,HIGH);          // Turns Relay Off      


   
   digitalWrite(RELAY5,LOW);           // Turns ON Relays 4

   delay(500);                                      // Wait 2 seconds

   digitalWrite(RELAY5,HIGH);          // Turns Relay Off      


   
   digitalWrite(RELAY6,LOW);           // Turns ON Relays 4

   delay(500);                                      // Wait 2 seconds

   digitalWrite(RELAY6,HIGH);          // Turns Relay Off      


   
   digitalWrite(RELAY7,LOW);           // Turns ON Relays 4

   delay(500);                                      // Wait 2 seconds

   digitalWrite(RELAY7,HIGH);          // Turns Relay Off      


 
   digitalWrite(RELAY8,LOW);           // Turns ON Relays 4

   delay(500);                                      // Wait 2 seconds

   digitalWrite(RELAY8,HIGH);          // Turns Relay Off      
 }

