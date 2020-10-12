const double avgSize = 10.0;
double currScale = 0;
const int errRate = 20;


double getCurrWeight(){
  double avgWeight;
  do{
    avgWeight = 0;
    for(int i=0; i<avgSize; i++){
      delay(10);
      currScale = scaleSensor.getData();
      avgWeight += currScale;
    }
    avgWeight/=avgSize;
  }while(abs(avgWeight - currScale) > errRate);
  currScale = 0;
  return avgWeight;
}
