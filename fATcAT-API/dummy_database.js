 const database = {
 	cats : [
  {
    id: "0",
    sex: "female",
    name: "saga",
    weight: "2.33",
    bowl: "living room",
    feedingHours: "s08:00e21:00",
  },
  {
    id: "1",
    sex: "male",
    name: "soren",
    weight: "3.14",
    bowl: "kitchen",
    feedingHours: "s10:00e20:00",
  },
  {
    id: "2",
    sex: "male",
    name: "garfield",
    weight: "4.20",
    bowl: "living room",
    feedingHours: "s05:00e16:00",
  },
  {
    id: "3",
    sex: "male",
    name: "Schrödinger",
    weight: "3.65",
    bowl: "living room",
    feedingHours: "s20:00e02:30",
  },
],
bowls : [
  {
    id: "0",
    name: "living room",
    cats: ["0","3"],
    activeHours: "s02:00e20:00",
  },
  {
    id: "1",
    name: "kitchen",
    cats: ["1"],
    activeHours: "s08:00e19:00",
  },
],
 devices : [
{
	"id": "44614646f2e8ebcc",
	"cats": ["0","1","3"],
	"bowls": ["0","1"],
},
],
index : {
	cats: 4,
	bowls:2,
	devices:1,
},
factoryBowls : [
{
	"id": "000",
	"key": "ZZZ",
},
{
	"id": "001",
	"key": "AAA",
},
{
	"id": "002",
	"key": "BBB",
}]};

module.exports = database;