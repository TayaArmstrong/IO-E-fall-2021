#include "Arduino_SensorKit.h"
float smX;
float smY;
float smZ;
float smT;
float x;
float y;
float z;
float aTotal;
float shake;

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
  z= Accelerometer.readZ();
  aTotal= sqrt(x*x + y*y + z*z);
  smX= (x - smX)*.05 + smX;
  smY= (y - smY)*.05 + smY;
  smZ= (z- smZ)*.01 + smZ;
  if (millis()< 1000){
    smT= (aTotal - smT)*.7 + smT;
  }
  else{
    smT= (aTotal - smT)*0.01 + smT;
  }
  //smT= (aTotal - smT)*0.01 + smT;
  Serial.print(smX); 
  Serial.print(",");
  Serial.print(smY);
  Serial.print(",");
  //Serial.println(aTotal - smT);        
  shake= abs(aTotal - smT);
  if (shake > .7){
    shake= 1;
  }
 else {
  shake= 0;
 }
 Serial.println(shake);
  delay(25);
}
