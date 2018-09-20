const int in1 = A0;
const int in2 = A1;

bool r1, r2;
int pc = 0;

void setup() {
	pinMode(in1, INPUT);
	pinMode(in2, INPUT);
	Serial.begin(9600);
}

int getReading(const int pin){
	int ret = analogRead(pin);
	if((ret - 45) > 0){
		return 1;
	} else {
		return 0;
	}
}

void loop() {
	r1 = getReading(in1);
	r2 = getReading(in2);
	if(!r1){
		for(;pc<200;pc++){
			delay(5);
			r2 = getReading(in2);
			if(!r2){
				Serial.println("Coming in");
				pc = 0;
				return 0;
			}
		}
	} else if(!r2){
		for(;pc<200;pc++){
			delay(5);
			r1 = getReading(in1);
			if(!r1){
				Serial.println("Going out");
				pc = 0;
				return 0;
			}
		}
	}
}
