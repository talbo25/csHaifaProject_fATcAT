String getDate(){
  long epochTime = timeClient.getEpochTime();
  struct tm *ptm = gmtime((time_t*)&epochTime);
  return (String(ptm->tm_mday) + "/" + String(ptm->tm_mon+1) + "/" + String(ptm->tm_year+1900));
}

String getTime(){
  return timeClient.getFormattedTime().substring(0,5);
}
