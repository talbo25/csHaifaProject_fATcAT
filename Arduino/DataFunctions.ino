// Save the bowl data locally
void getJsonData(const JsonObject root, struct BowlData *data){
  String hours = root["bowlHours"];
  data->startTime = hours.substring(1,6);
  data->endTime = hours.substring(7);
  data->isAuto = (root["method"] == "automatically");
  data->arrSize = 0;

  data->sendWeight = root["scale"];
  if(data->sendWeight){
    Serial.println("need to send weight!");
  }
  
  struct Cat tempKitty;  
  for(int i=0; i< root["catsWeights"].size(); i++){
    tempKitty.catName = root["catsNames"][i].as<String>();
    tempKitty.weight = root["catsWeights"][i];
    tempKitty.startTime = root["catsHours"][i].as<String>().substring(1,6);
    tempKitty.endTime = root["catsHours"][i].as<String>().substring(7);
    if(tempKitty.endTime == ""){
      tempKitty.endTime = "23:59";
    }
    data->cats[i] = tempKitty;
    data->arrSize += 1;
  }
}

//Returns true if the currTime is valid
bool checkTime(String currTime, String startTime, String endTime){
  return ((currTime >= startTime && currTime <= endTime));
}

// returns a struct Cat pointer to the cat which weighs about the same as weight. If no such cat exists, return nullptr
struct Cat* getCatByWeight(struct BowlData *bowl, double weight){
  for(int i=0; i<bowl->arrSize; i++){
    if(abs(weight - bowl->cats[i].weight*1000) < 300){ // current weight is
      return &(bowl->cats[i]);
    }
  }
  return nullptr;
}

// Reset saved eating cat
void resetCatBowl(struct BowlData *bowl){
  bowl->eatingCat.catName = "MysteryCat";
  bowl->eatingCat.weight = 0;
}

// Returns the cat's name. If the cat doesn't exist, return general text describing it.
String getCatName(struct Cat *cat, double weight){
  if(cat){
    return cat->catName;
  }
  return "An unknown cat weighing " + String(currWeight/1000.0);
}

//Debug function - print cat data
void printCat(struct Cat *cat){
  Serial.println("Cat name: " + cat->catName);
  Serial.println("Cat weight: " + String(cat->weight));
  Serial.println("Start time: " + cat->startTime);
  Serial.println("End time: " + cat->endTime);
}

// Debug function - print the local data
void printData(struct BowlData bowl){
  
  Serial.print("Starting bowl time: ");
  Serial.println(bowl.startTime);
  Serial.print("Ending bowl time: ");
  Serial.println(bowl.endTime);
  Serial.println("Cats: ");
  
  for(int i=0; i<bowl.arrSize; i++){
    printCat(&(bowl.cats[i]));
  }
}
