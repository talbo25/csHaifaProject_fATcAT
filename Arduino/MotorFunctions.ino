void open_bowl(struct BowlData *bowl){
  // step one half-revolution in one direction:
  if(!bowl->isOpen){
    Serial.println("open bowl");
    stepper.step(stepsPerRevolution/4);
    delay(1);
    stepper.step(stepsPerRevolution/4);
    delay(1);
    bowl->isOpen = true;
  }
}

void close_bowl(struct BowlData *bowl){
  // step one half-revolution in the other direction:
  if(bowl->isOpen){
    Serial.println("close bowl");
    stepper.step(-stepsPerRevolution/4);
    delay(1);
    stepper.step(-stepsPerRevolution/4);
    delay(1);
    bowl->isOpen = false;
  }
}
