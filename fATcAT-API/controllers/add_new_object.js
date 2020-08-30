const handleNewBowl = (database,getAllData) => (req,res) => {
	const BreakException= {};
	const { objectValues, currentDeviceID} = req.body;
	let found = false;
	// edit exist bowl
	try {
		database.bowls.forEach((bowl) => {
			if (bowl["id"] === objectValues["id"]) {
				found = true;
				Object.keys(bowl).forEach((key) => {
					bowl[key] = objectValues[key];
				})
				throw BreakException;
			}
		
		})	
	} catch (e) {
		if (e !== BreakException) throw e;
	}

	if (!found) {
		//new bowl
		//add bowl to dummy database
		database.bowls.push(objectValues);
		//change bowl to cat
		database.cats.forEach((cat) => {
			if (cat["id"] in objectValues["cats"]) {
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

	let newData = getAllData(currentDeviceID);
	if (newData === {}) {
		return res.status(400).json("-E- Couldn't find user");
	} else {
		return res.json(newData);
	}
}

const handleNewCat = (database,getAllData) => (req,res) => {
	console.log("-D-add_new_object cat")
	const BreakException= {};
	const { objectValues, currentDeviceID} = req.body;
	if (objectValues["id"] === "-1") {
		//new cat
		// generate index for dummy database
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
		try{
			database.cats.forEach((cat) => {
				if (cat["id"] === objectValues["id"]) {
					Object.keys(cat).forEach((key) => {
						cat[key] = objectValues[key];
					})
					throw BreakException;
				}
			})
		}	catch (e) {
			if (e !== BreakException) throw e;
		}	
	}
	let found = getAllData(currentDeviceID);
	if (found === {}) {
		return res.status(400).json("-E- Couldn't find user");
	} else {
		return res.json(found);
	}
}

module.exports = {
	handleNewBowl : handleNewBowl,
	handleNewCat : handleNewCat,
};