const handleGodsIntervention = (database, change_method) => (req,res) => {
	const {bowlID, deviceID} = req.body;
	let found = false;
	database.bowls.forEach((bowl) => {
		if (bowl["id"] === bowlID) {
			console.log("open sesomi! or close...");
			try {
				change_method(bowlID,deviceID);
				found = bowl;
			} catch (err) {
				console.warn("change_method : ",err);
			}
			
		}
	});

	if (!found) {
		return res.status(400).json("Couldn't find bowl by id - "+bowlID);
	}
	res.json(found);
}

module.exports = {
	handleGodsIntervention : handleGodsIntervention,
};