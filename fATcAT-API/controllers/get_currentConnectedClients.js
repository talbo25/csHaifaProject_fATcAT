const {get_currentConnectedClients} = require('./../services/sockets.js');

const handleCurrentConnectedClients = () => async (req,res) => {
	console.log("-I- handleCurrentConnectedClients")
	try {
		const CCC = get_currentConnectedClients();
		res.json(CCC);
	} catch (err) {
		console.warn("-E- ",err);
		res.status(400).json("-E- problem with get_currentConnectedClients method");
	}
}

module.exports = {
	handleCurrentConnectedClients : handleCurrentConnectedClients,
};