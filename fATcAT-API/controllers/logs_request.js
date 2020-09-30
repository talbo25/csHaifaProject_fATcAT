const Device = require('./../models/deviceModel.js');

const handleLogs = () => async (req,res) => {
	const { deviceID } = req.body;
	try{
		const reqLogs = await Device.findOne({deviceID:deviceID},{logs:1});
		if (!reqLogs){
			throw("-ERROR- Couldn't get logs");
		}

		res.send({
			size:reqLogs["logs"].length, 
			logs: reqLogs.logs.reverse()
		});

	} catch (err) {
		console.warn(err);
		return res.status(400).json(err);
	}
}

module.exports = {
	handleLogs : handleLogs,
};