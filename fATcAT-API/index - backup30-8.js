const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

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
    cats: "0,2,3",
    activeHours: "s02:00e20:00",
  },
  {
    id: "1",
    name: "kitchen",
    cats: "1",
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
}};

app.get('/', (req, res) =>{
	res.send('this is working')
})

app.get('/cats', (req,res) => {
	res.send(database.cats)
})

app.get('/bowls', (req,res) => {
	res.send(database.bowls)
});

const getAllData = (id) => {
	let res = {};
	database.devices.forEach( device => {
		if (device.id === id ) {
			// console.log("-D- device.id = ",device.id);
			// console.log("-D- id = ",id);
			let catsList = database.cats.filter( (cat) => device.cats.includes(cat.id));
			let bowlsList = database.bowls.filter( (bowl) => device.bowls.includes(bowl.id));
			let resultDict = {
				"cats" : catsList,
				"bowls" : bowlsList,
			};
			// console.log("resultDict= ",resultDict);
			res = resultDict;
		}
	});
	return res;
}

app.post('/device_data', (req,res) => {
	const { id } = req.body;
	let found = getAllData(id);
	// console.log("-D- found ",found);
	// database.devices.forEach( device => {
	// 	if (device.id === id ) {
	// 		found = true;
	// 		let catsList = database.cats.filter( (cat) => device.cats.includes(cat.id));
	// 		let bowlsList = database.bowls.filter( (bowl) => device.bowls.includes(bowl.id));
	// 		let resultDict = {
	// 			"cats" : catsList,
	// 			"bowls" : bowlsList,
	// 		};
	// 		return res.json(resultDict);
	// 	}
	// });

	if (found === {}) {
		res.status(400).json("-E- Couldn't find user");
	} else {
		return res.json(found);
	}
});

app.post('/add_new_object/bowl', (req,res) => {
	const BreakException= {};
	const { objectValues, currentDeviceID} = req.body;
	if (objectValues["id"] === "-1") {
		//new bowl
		// generate index for dummy database
		objectValues["id"] = database.index["bowls"];
		database.index["bowls"] +=1;	
		//add bowl to dummy database
		database.bowls.push(objectValues);
		//change bowl to cat
		database.cats.forEach((cat) => {
			if (cat["id"] in objectValues["cats"].split(',')) {
				cat["bowl"] = objectValues["name"];
			}
		})
		//add bowl to device
		try {
			database.devices.forEach((device) => {
				if (device["id"] === currentDeviceID) {
					device.bowls.push(objectValues["id"]);
					throw BreakException;
				}
			})
		} catch (e) {
			if (e !== BreakException) throw e;
		}
	}
	else {
		// edit exist bowl
		try {
			database.bowls.forEach((bowl) => {
				if (bowl["id"] === objectValues["id"]) {
					Object.keys(bowl).forEach((key) => {
						bowl[key] = objectValues[key];
					})
					throw BreakException;
				}
			
			})	
		} catch (e) {
			if (e !== BreakException) throw e;
		}
	}
	let found = getAllData(currentDeviceID);
	if (found === {}) {
		return res.status(400).json("-E- Couldn't find user");
	} else {
		return res.json(found);
	}
});

app.post('/add_new_object/cat', (req,res) => {
	console.log("-D-add_new_object cat")
	const BreakException= {};
	const { objectValues, currentDeviceID} = req.body;
	// console.log("-D- objectValues = ",objectValues);
	if (objectValues["id"] === "-1") {
		//new cat
		// generate index for dummy database
		// console.log("-D- 1");
		objectValues["id"] = database.index["cats"];
		database.index["cats"] +=1;	
		//add cat to dummy database
		database.cats.push(objectValues);
		//add cat to bowl
		try{
			database.bowls.forEach((bowl) => {
				if (bowl["name"] === objectValues["bowl"]) {
					bowl.cats+=","+objectValues["id"];
					throw BreakException;
				}
			})
		} catch(e){
			if ( e !== BreakException) throw e;
		}
		//add cat to device
		// console.log("-D- 2");			
		try{
			database.devices.forEach((device) => {
				if (device["id"] === currentDeviceID) {
					device.cats.push(objectValues["id"]);
					throw BreakException;
				}
			})
		} catch(e){
		if ( e !== BreakException) throw e;
		}
	}
	else {
		// edit exist cat
		// console.log("-D- 3");
		try{
			database.cats.forEach((cat) => {
				if (cat["id"] === objectValues["id"]) {
					Object.keys(cat).forEach((key) => {
						// console.log("-D- 555 key ", key);
						cat[key] = objectValues[key];
					})
					throw BreakException;
				}
			})
		}	catch (e) {
			if (e !== BreakException) throw e;
		}	
		// console.log("-D- 4");
	}
	let found = getAllData(currentDeviceID);
	if (found === {}) {
		return res.status(400).json("-E- Couldn't find user");
	} else {
		return res.json(found);
	}
});

app.listen(3000, ()=> {
	console.log('app is running on 3000');
})

/*
/devices --> get all devices
/cats --> gel all cats
/bowls --> get all bowls
/cats/:catID
*/