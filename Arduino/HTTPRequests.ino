const char* serverName = "http://evening-woodland-16568.herokuapp.com/";

// Creates post message
String makePOSTMessage(const String id, const String key, const String logMsg = "", const double catWeight= -1) {
  String msg = "{\"passport\":{\"id\":" + id + ",\"key\":\"" + key + "\"}";
  if(logMsg != ""){
    msg += ",\"log\":{\"msg\":\"" + logMsg + "\",\"date\":\"" + getDate() + "\",\"time\":\"" + getTime() + "\"}";
  }
  if(catWeight != -1){
    msg += ",\"weight\":\"" + String(catWeight/1000.0) + "\"";
  }
  msg += "}";
  return msg;
}

String makePOSTMessage(String id, String key, double catWeight){
  return makePOSTMessage(id, key, "", catWeight);
}

// POST request to server
String httpPOSTRequest (const char* subDomain, String message) {
  // Create htto request
  HTTPClient http;
  char new_url [100];
  strcpy(new_url,serverName);
  strcat(new_url,subDomain);
  http.begin(new_url);
  http.addHeader("Content-Type", "application/json");
  
  // Send HTTP POST request
  int httpResponseCode = http.POST(message);
  
  String payload = "{}"; 
  
  if (httpResponseCode>0) {
    payload = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  // Free resources
  http.end();

  return payload;  
}

void requestUpdate(struct BowlData *bowl){
  if(WiFi.status()== WL_CONNECTED){
      String message = makePOSTMessage(bowl->id, bowl->key);
      sensorReadings = httpPOSTRequest("bowl/update_data", message);
      DynamicJsonDocument doc(1024);
      DeserializationError err;
      
      err = deserializeJson(doc, sensorReadings);
      if(err){
        Serial.print("Error: ");
        Serial.println(err.c_str());
        return;
      }
      JsonObject root = doc.as<JsonObject>();
      getJsonData(root, bowl);
      doc.clear();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
}

void postLog(struct BowlData *bowl, String logMsg){
  if(WiFi.status()== WL_CONNECTED){
      String message = makePOSTMessage(bowl->id, bowl->key, logMsg);
      sensorReadings = httpPOSTRequest("bowl/new_log", message);
      Serial.print("Returned from log request: ");
      Serial.println(sensorReadings);
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    Serial.print("Posting log: ");
    Serial.println(logMsg);
}

void postWeight(struct BowlData *bowl, double currWeight){
  if(WiFi.status()== WL_CONNECTED){
      if(abs(currWeight) < 10){
        currWeight = 0;
      }
      String message = makePOSTMessage(bowl->id, bowl->key, currWeight);
      sensorReadings = httpPOSTRequest("bowl/current_weight", message);
      Serial.print("Returned from postWeight request: ");
      Serial.println(sensorReadings);
    }
    else {
      Serial.println("WiFi Disconnected");
    }
}
