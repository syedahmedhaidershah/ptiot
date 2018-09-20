// current sensing code
// module used: ACS712 - 30A
// Timestamp: 6:58:00 06-09-2018

float current = 0;
const int currentPin = A0;
const unsigned long sampleTime = 100000UL;                           // sample over 100ms, it is an exact number of cycles for both 50Hz and 60Hz mains
const unsigned long numSamples = 250UL;                               // choose the number of samples to divide sampleTime exactly, but low enough for the ADC to keep up
const unsigned long sampleInterval = sampleTime / numSamples; // the sampling interval, must be longer than then ADC conversion time
int adc_zero = 0;                                                  // relative digital zero of the arudino input from ACS712 (could make this a variable and auto-adjust it)

void setup()
{
  Serial.begin(9600);
  senseMode(1);
}

void loop()
{

  CurrentSense();
  Serial.println(current);
  delay(1000);

}

void CurrentSense()
{
  unsigned long currentAcc = 0;
  unsigned int count = 0;
  unsigned long prevMicros = micros() - sampleInterval ;
  while (count < numSamples)
  {
    if (micros() - prevMicros >= sampleInterval)
    {
      int adc_raw = analogRead(currentPin) - adc_zero;
      currentAcc += (unsigned long)(adc_raw * adc_raw);
      ++count;
      prevMicros += sampleInterval;
    }
  }

  float rms = sqrt((float)currentAcc / (float)numSamples) * (50 / 1024.0);
  rms = rms - 0.10;
  if (rms < 0.20)
  {
    rms = 0;
  }

  current = rms;
}

void senseMode(int mode){
  if (mode == 1) {
    adc_zero = 0;
  }
  else if (mode == 0) {
    adc_zero = 510;
  }
}

