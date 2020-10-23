const {get_currentConnectedClients ,get_weightRequestsMailbox} = require('./../services/sockets.js');

const handleCurrentConnectedClients = () => async (req,res) => {
	console.log("-I- handleCurrentConnectedClients")
	try {
		// Give normal and readable variables names, it's very important
		const CCC = get_currentConnectedClients();
		res.json(CCC);
	} catch (err) {
		console.warn("-E- ",err);
		res.status(400).json("-E- problem with get_currentConnectedClients method");
	}
}

const handleWeightRequestsMailbox = () => async (req,res) => {
	console.log("-I- handleWeightRequestsMailbox")
	try {
		const WRM = get_weightRequestsMailbox();
		res.json(WRM);
	} catch (err) {
		console.warn("-E- ",err);
		res.status(400).json("-E- problem with get_weightRequestsMailbox method");
	}
}

module.exports = {
	handleCurrentConnectedClients : handleCurrentConnectedClients,
	handleWeightRequestsMailbox: handleWeightRequestsMailbox,
};