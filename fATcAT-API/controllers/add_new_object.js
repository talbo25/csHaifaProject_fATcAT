	const Cat = require('./../models/catModel.js');
	const Bowl = require('./../models/bowlModel.js');
	const Device = require('./../models/deviceModel.js');
	const utils = require('./../services/utils.js');

	const handleNewBowl = () => async (req,res) => {
	console.log("handleNewBowl");
	const BreakException= {};
	const { objectValues, currentDeviceID} = req.body;

	let found = false;
	try {
		// factory bowls
		await Bowl.updateOne({bowlID: objectValues["id"]},{activeHours:objectValues["activeHours"]});

		// update if bowl in device
		const dev = await Device.updateOne({ deviceID:currentDeviceID, "bowls.bowlID": objectValues["id"] }, {
		    $set: {
		        "bowls.$.name": objectValues["name"],
		    }
		});
		// console.log("dev = ",dev);

		//add if not exist
		const dev2 = await Device.updateOne(
		{
				deviceID:currentDeviceID, 
				bowls: {
					"$not": {
						"$elemMatch": {
							bowlID : objectValues["id"]
						}					
					}
				}
		}, {
				$addToSet: {
					bowls:
					{
						"bowlID":objectValues["id"],
						"name": objectValues["name"]
					}
				}
			}	
		);
		// console.log("dev2 = ",dev2);
	} catch (e) {
		if (e !== BreakException) throw e;
	}
	const newData = await utils.getAllDeviceData(currentDeviceID);
	if (!newData) {
		return res.status(400).json("-E- Couldn't edit/add bowl");
	} else {
		return res.json(newData);
	}
}

const handleNewCat = () => async (req,res) => {
	console.log("-D-add_new_object cat")
	const BreakException= {};
	const { objectValues, currentDeviceID} = req.body;
	if (!("id" in objectValues)) {
		//new cat
		console.log("-I- new cat");
		//add cat to database
		const newCat = new Cat(objectValues);
		newCat.save()
		.then( doc => {
			console.log(doc);
		})
		.catch(err => {
			console.log("ERROR... ",err)
		});		
	}
	else {
		// edit exist cat
		console.log("-I- edit cat id = ",objectValues["id"])
		try{
			const cat = await Cat.findByIdAndUpdate({_id: objectValues["id"]},objectValues);
			console.log("cat = ",cat);
			if (cat.ok === 0){
				return res.status(400).json("-E- Couldn't edit cat");
			}
		}	catch (e) {
			console.warn(e);
		}	
	}
	let found = await utils.getAllDeviceData(currentDeviceID);
	if (!found) {
		return res.status(400).json("-E- Couldn't edit/add cat");
	} else {
		return res.json(found);
	}
}

module.exports = {
	handleNewBowl : handleNewBowl,
	handleNewCat : handleNewCat,
};