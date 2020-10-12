#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiUdp.h>
#include <WiFiManager.h>
#include <NTPClient.h>
#include <HX711_ADC.h>
#include <Stepper.h>

// NTP set up
const long utcOffsetInSeconds = 3*60*60;
const long daylightSavingTime = 60000;
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds, daylightSavingTime);

//Stepper Motor set up
#define motor_in1 D5
#define motor_in2 D6
#define motor_in3 D7
#define motor_in4 D8
int stepsPerRevolution = 2038;
int stepperSpeed = 10;

//Stepper Motor constructor:
Stepper stepper(stepsPerRevolution, motor_in1, motor_in3, motor_in2, motor_in4);

// Weight Sensor set up
#define HX711_dout D3 //mcu > HX711 dout pin
#define HX711_sck D4 //mcu > HX711 sck pin
//HX711 constructor:
double calibrationValue = -22.85;
HX711_ADC scaleSensor(HX711_dout, HX711_sck);

enum State {NORMAL, EATING, BOTHERING, FATCAT, LATECAT, MANUALOPEN};
const String states[] = {"NORMAL", "EATING", "BOTHERING", "FATCAT", "LATECAT", "MANUALOPEN"};

// Data Structures:
struct Cat{
  String catName = "Mystery Cat";
  double weight = 0;
  String startTime = "00:00";
  String endTime = "00:00";
};

struct BowlData {
  String id = "1";
  String key = "AAA";
  String startTime;
  String endTime;
  struct Cat cats[10];
  int arrSize = 0;
  bool isAuto = true;
  bool isOpen = false;
  bool sendWeight = false;
  struct Cat eatingCat;
  State state = NORMAL;
};

// Timer setup
unsigned long timerDelay = 5000;
unsigned long printWeightDelay = 2000;
unsigned long printMessageDelay = 4000;
unsigned long stateDelay = 60000;
unsigned long lastUpdate = 0;
unsigned long lastWeightCheck = 0;
unsigned long lastMessage = 0;
unsigned long lastStateChange = 0;

unsigned long debugPrintDelay = 4000;
unsigned long lastDebug = 0;

String sensorReadings;
BowlData bowl;
double currWeight = 0;

void setup() {
  // Setup Serial communication
  Serial.begin(115200);

  // Setup Scale
  scaleSensor.begin();
  long stabilizingtime = 5000; // tare preciscion can be improved by adding a few seconds of stabilizing time
  boolean _tare = true; 

  scaleSensor.start(stabilizingtime, _tare);
  if (scaleSensor.getTareTimeoutFlag()) {
    Serial.println("I can't find the scale sensors! Please contact customer service.");
  }else {
    scaleSensor.setCalFactor(calibrationValue); // set calibration factor (float)
    Serial.println("Startup is complete");
  }
  while (!scaleSensor.update());

  //HX711 Scale debug messages
  Serial.print("Calibration value: ");
  Serial.println(scaleSensor.getCalFactor());
  Serial.print("HX711 measured conversion time ms: ");
  Serial.println(scaleSensor.getConversionTime());
  Serial.print("HX711 measured sampling rate HZ: ");
  Serial.println(scaleSensor.getSPS());
  Serial.print("HX711 measured settlingtime ms: ");
  Serial.println(scaleSensor.getSettlingTime());
  if (scaleSensor.getSPS() < 7) {
    Serial.println("!!Sampling rate is lower than specification, check MCU>HX711 wiring and pin designations");
  }
  else if (scaleSensor.getSPS() > 100) {
    Serial.println("!!Sampling rate is higher than specification, check MCU>HX711 wiring and pin designations");
  }

  // Setup Stepper Motor speed
  stepper.setSpeed(stepperSpeed);

  //Open Bowl (in case no Wifi, function as normal food bowl)
  open_bowl(&bowl);
  
  // Connect to WiFi
  WiFiManager wifiManager;
  wifiManager.autoConnect("FatCatAccessPoint");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
  timeClient.begin();

  //Close Bowl (Wifi works, function as fancy food bowl)
  close_bowl(&bowl);

  // Log to server, going online
  timeClient.update();
  postLog(&bowl, "I'm online! HELLO!");
}

void loop() {
  //If no WiFi - open bowl, wait 10 seconds and try again
  if(WiFi.status() != WL_CONNECTED){
    open_bowl(&bowl);
    delay(10000);
    return;
  }
  
  static boolean newDataReady = 0;
  timeClient.update();
  //Send an HTTP POST request every <timerDelay> seconds
  if ((millis() - lastUpdate) > timerDelay) {
    requestUpdate(&bowl);
    lastUpdate = millis();
  }

 if(scaleSensor.update()){
   newDataReady = true;
 }
 
 if (newDataReady) {
   if (millis() > lastWeightCheck + printWeightDelay ) {
     currWeight = getCurrWeight();
     newDataReady = 0;
     lastWeightCheck = millis();
     if(bowl.sendWeight){
       postWeight(&bowl, currWeight);
     }
   }
  }

  // Debugging print
  if(millis() > lastDebug + debugPrintDelay){
    lastDebug = millis();
    Serial.print("Load_cell output val: " + String(currWeight));
    Serial.println(". Current state: " + states[bowl.state]);
  }
  

 if(!bowl.isAuto){ // bowl is on manaul mode
   if(bowl.state != MANUALOPEN){
     Serial.println("Manaul open");
     bowl.state = MANUALOPEN;
     postLog(&bowl, "The bowl has been opened manually.");
     open_bowl(&bowl);
   }
   return;
 }else if(bowl.state == MANUALOPEN){
   Serial.println("Manaul close");
   bowl.state = NORMAL;
   lastStateChange = millis();
   postLog(&bowl, "The bowl has been closed manually.");
   close_bowl(&bowl);
 }

  String currTime = getTime();
  struct Cat* tempCat = getCatByWeight(&bowl, currWeight);
  
  // check if bowl is currently running
  if(checkTime(currTime, bowl.startTime, bowl.endTime)){ // inside working hours
    // State check
    if(bowl.state == EATING){ // Cat eating
      if((currWeight - bowl.eatingCat.weight*1000) > 1000){
        //too many cats
        bowl.state = BOTHERING;
        close_bowl(&bowl);
        lastStateChange = millis();
        postLog(&bowl, "Too many cats are trying to eat!");
      }else if(currWeight < 100){
        bowl.state = NORMAL;
        lastStateChange = millis();
        postLog(&bowl, bowl.eatingCat.catName + " has finished eating.");
        close_bowl(&bowl);
        resetCatBowl(&bowl);
      }
    }else if(bowl.state == BOTHERING){ // Cat being bothered
      if(tempCat && tempCat->weight == bowl.eatingCat.weight){
        bowl.state = EATING;
        postLog(&bowl, bowl.eatingCat.catName + " is no longer being bothered.");
        open_bowl(&bowl);
      }else if(currWeight < 100){ // all cats are gone
        bowl.state = NORMAL;
        postLog(&bowl, "Both cats are gone :(");
      }
    }else{
      if(tempCat && checkTime(currTime, tempCat->startTime, tempCat->endTime)){
        Serial.println("cat started eating");
        bowl.eatingCat = *tempCat; 
        bowl.state = EATING;
        postLog(&bowl, bowl.eatingCat.catName + " has opened the bowl.");
        open_bowl(&bowl);
      }else if (abs(currWeight) > 1000 && bowl.state != FATCAT){
        Serial.println("fat cat");
        bowl.state = FATCAT;
        lastStateChange = millis();
        
        postLog(&bowl, getCatName(tempCat, currWeight) + " has tried (and failed) to open the bowl.");
        close_bowl(&bowl);
      }
    }
  }else{ //outside working hours
    if(currWeight > 1000 && bowl.state != LATECAT){
      bowl.state = LATECAT;
      lastStateChange = millis();
      
      postLog(&bowl, getCatName(tempCat, currWeight) + " tried opening the bowl outside of working hours.");
    }
  }

  if(bowl.state > BOTHERING && (abs(currWeight) <100 || millis() > lastStateChange + stateDelay)){
    Serial.println("Resetting state");
    lastStateChange = millis() - stateDelay;
    bowl.state = NORMAL;
    resetCatBowl(&bowl);
  }
}
