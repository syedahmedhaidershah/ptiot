* http://www.nyebarilmu.com * /
 
const int input_sensor = A0; // another name of A0 ie input_sensor
const int output_pwm = 2; // another name of 2 is output_pwm
 
// default value of data variable
int results_sensor = 00;
int value_pwm = 00;
voltageOut = 00;
 
void setup () {
   // set bolt communication at speed 9600
   Serial.begin (9600);
}
 
void loop () {
   result_sensor = analogRead (input_sensor); // Analog reading procedure pins
   // mapping sensor resolution readings
   value_pwm = map (results_sensor, 00, 1023, 00, 255);
   // change the value of analog out
   analogWrite (output_pwm, value_pwm);
  voltageOut = (sensor_Value / 1023) * 5;
 
   // Prints the result to the serial monitor
   Serial.print ("sensor value =");
   Serial.print (result_sensor);
   Serial.print ("output =");
   Serial.println (value_pwm);
   Serial.print ("Voltage =");
   Serial.println (voltageOut);
 
delay (2); // pause 2ms
}