const handleNewBowl = (database,getAllData) => (req,res) => {
	console.log("handleNewBowl");
	const BreakException= {};
	const { objectValues, currentDeviceID} = req.body;
	let found = false;
	try {
		// factory bowls
		database.bowls.forEach((factory_bowl) => {
			if (factory_bowl["id"] === objectValues["id"]) {
				factory_bowl["activeHours"] = objectValues["activeHours"];
				// devices
				database.devices.forEach((device) => {
					if (device["id"] === currentDeviceID) {
						// handle first bowl to device
						if (!("bowls" in device)) {
							// console.log("gulu");
							device["bowls"] = [];
						}
						device.bowls.forEach((bowl) => {
							// edit exist bowl
							if (bowl["id"] === objectValues["id"]) {
								bowl["name"] = objectValues["name"];
								throw BreakException;
							}
						})
						//new bowl
						//add bowl to dummy database
						device.bowls.push(
							{
								"id": objectValues["id"],
								"name": objectValues["name"],
							}
						);
					}
				
				})		
			}
		})
	} catch (e) {
		if (e !== BreakException) throw e;
	}
	let newData = getAllData(currentDeviceID);
	if (Object.keys(newData).length ===0) {
		return res.status(400).json("-E- Couldn't edit/add bowl");
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
		objectValues["id"] = "111";
		//add cat to dummy database
		database.cats.push(objectValues);
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
		return res.status(400).json("-E- Couldn't edit/add cat");
	} else {
		return res.json(found);
	}
}

module.exports = {
	handleNewBowl : handleNewBowl,
	handleNewCat : handleNewCat,
};