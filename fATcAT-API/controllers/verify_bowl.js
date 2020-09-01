const handleVerifyBowl = (database) => (req,res) => {
	const BreakException= {};
	const { id, key} = req.body;
	console.log("-D- verify_bowl");
	console.log("-D- id = ",id);
	console.log("-D- key = ",key);
	// console.log(database);
	let found = false;
	let tempBowl = { "id" : id};
	database.bowls.forEach((bowl) => { 
		if ((id === bowl["id"]) && (key === bowl["key"])) {
			console.log("FOUND!");
			found = true;
			if (Object.keys(bowl).includes("cats")) {
				tempBowl["cats"] = bowl["cats"];
			}
			if (Object.keys(bowl).includes("activeHours")) {
				tempBowl["activeHours"] = bowl["activeHours"];
			}

			// try {
			// 	database.bowls.forEach((bowl) => {
			// 		if (bowl["id"] === id) {
			// 			Object.keys(bowl).forEach((key) => {
			// 				tempBowl[key] = bowl[key];
			// 			})
			// 			throw BreakException;
			// 		}
				
			// 	})	
			// } catch (e) {
			// 	if (e !== BreakException) throw e;
			// }
			res.json(tempBowl);
		}
	});
	if (!found){
		res.status(400).json("Couldn't find bowl");
	}
}

module.exports = {
	handleVerifyBowl : handleVerifyBowl,
};