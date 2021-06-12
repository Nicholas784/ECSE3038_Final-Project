#include <MPU6050.h>
#include <Wire.h>

#define tempPin A0
#define RX 10
#define TX 11

MPU6050 mpu;

boolean DEBUG = true;
String patient_id;
String Position;
int sensorVal;
float volts;
float temp;
int16_t gx, gy, gz;

String sendData(String command, const int timeout, boolean debug)
{
  String response = "";
  Serial1.print(command);

  long int time = millis(); 

  while((time+timeout) > millis())
  {
    while(Serial1.available())
    {
      char c = Serial1.read();
      response += c;
    }
  }

  if(debug)
  {
    Serial.print(response);
  }

  return response;
}
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial1.begin(115200);


//   Initialize MPU6050
  Serial.println("Initializing MPU6050..");
  mpu.initialize();
  while(!mpu.testConnection())
  {
    Serial.println("Connection Unsuccessful");
  }

  Serial.println("MPU6050 Connection Successful");

  sendData("AT+RST\r\n", 5000, DEBUG);
  sendData("AT+CWJAP=\"DE REEF\",\"plumrose\"\r\n", 10000, DEBUG);
  String response = sendData("AT+CIPSTAMAC?\r\n",10000,DEBUG);
  patient_id = response.substring(28,45);
}

void loop() {

  float temperature = Temperature();
  String Position = getPosition();

  String jsonBody = "{\"patient_id\": \""+(patient_id)+"\", \"temperature\": "+String(temperature)+", \"position\": \""+(Position)+"\"}\r\n\r\n";
  Serial.println(jsonBody);
  

  int bodyLength = jsonBody.length();

  sendData("AT+CIPSTART=\"TCP\",\"192.168.1.5\",5000\r\n",10000,DEBUG);

  String post = "POST /api/record HTTP/1.1\r\nHost: 192.168.1.5:5000\r\nContent-Type: application/json\r\nContent-Length: "+String(bodyLength)+"\r\n\r\n"+jsonBody;

  int postLength = post.length();

  sendData("AT+CIPSEND="+String(postLength)+"\r\n", 3000, DEBUG);

  sendData(post, 5000, DEBUG);

}

float Temperature()
{
  sensorVal = analogRead(tempPin);
  volts = sensorVal * (5.0/1023.0);
  temp = volts * 100;

  return temp;
}

String getPosition()
{
  mpu.getRotation(&gx, &gy, &gz);
    
  if (gy > 1.0){
    Position = "Upright";
  }
  else{
    Position="Resting";
  }
  
  return Position;
}
