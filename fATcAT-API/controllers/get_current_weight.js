const {add_weight_request_to_pipe} = require('./../services/sockets.js');

const handleGetCurrentBowlWeight = () => async (req,res) => {
	const {bowlID, deviceID} = req.body;
	// And waht if the valuie is null? or emply string? USE VALIDATOR LIB and don't try to invent the wheel
	if (bowlID === undefined || deviceID === undefined) {
		return res.status(400).json("bowlID and deviceID are mandatory!");
	}

	// This for what?  
	let weight = false;
	console.log("-D- bowlID = ",bowlID);
	console.log("-D- deviceID = ",deviceID);	

	try {
		add_weight_request_to_pipe(deviceID,bowlID)
		res.status(200).json("Request sent");
	} catch (err) {
		console.warn("-E- error with get_weight : ",err);
		return res.status(400).json("Couldn't send IS request for bowl - "+bowlID);
	}	
}

module.exports = {
	handleGetCurrentBowlWeight : handleGetCurrentBowlWeight,
};