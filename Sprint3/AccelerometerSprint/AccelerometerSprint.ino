#include "Arduino_SensorKit.h"
float smX;
float smY;
float x;
float y;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  while(!Serial);
  
  Accelerometer.begin();
}

void loop() {
  // put your main code here, to run repeatedly:
  x= Accelerometer.readX();
  y= Accelerometer.readY();
  smX= (x - smX)*.05 + smX;
  smY= (y - smY)*.05 + smY;
  Serial.print(smX); 
  Serial.print(",");
  Serial.println(smY);        

 
  delay(50);
}
