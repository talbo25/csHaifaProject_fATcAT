const utils = require('./../services/utils.js');

const handleGetCurrentBowlWeight = () => async (req,res) => {
	const {bowlID, deviceID} = req.body;
	if (bowlID === undefined || deviceID === undefined) {
		return res.status(400).json("bowlID and deviceID are mandatory!");
	}
	let weight = false;
	console.log("-D- bowlID = ",bowlID);
	console.log("-D- deviceID = ",deviceID);	

	try {
		weight = await utils.get_weight(bowlID,deviceID);
		console.log("-I- weight is ",weight);
		res.status(200).json(weight);
	} catch (err) {
		console.warn("-E- error with get_weight : ",err);
		return res.status(400).json("Couldn't get weight for bowl - "+bowlID);
	}	
}

module.exports = {
	handleGetCurrentBowlWeight : handleGetCurrentBowlWeight,
};