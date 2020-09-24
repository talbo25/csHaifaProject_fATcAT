const utils = require('./../services/utils.js');

const handleGodsIntervention = () => async (req,res) => {
	const {bowlID, deviceID} = req.body;
	if (bowlID === undefined || deviceID === undefined) {
		return res.status(400).json("bowlID and deviceID are mandatory!");
	}
	let found = false;

	console.log("open sesomi! or close...");
	try {
		found = utils.change_method(bowlID,deviceID);
	} catch (err) {
		console.warn("change_method : ",err);
	}
			
	if (!found) {
		return res.status(400).json("Couldn't find bowl by id - "+bowlID);
	}
	res.json(found);
}

module.exports = {
	handleGodsIntervention : handleGodsIntervention,
};