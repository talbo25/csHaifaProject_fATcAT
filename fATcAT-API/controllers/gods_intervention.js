const handleGodsIntervention = (database, change_method) => (req,res) => {
	const {bowlID} = req.body;
	let found = false;
	database.bowls.forEach((bowl) => {
		if (bowl["id"] === bowlID) {
			console.log("open sesomi! or close...");
			change_method(bowlID);
			found = bowl;
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