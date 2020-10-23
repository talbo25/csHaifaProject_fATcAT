const utils = require('./../services/utils.js');
const Device = require('./../models/deviceModel.js');

const handleDeviceData = () => async (req,res) => {
	console.log("-I- handleDeviceData -- start");
	const { deviceID } = req.body;
	let found = await utils.getAllDeviceData(deviceID);
	if (!found) {
		// new device 
		console.log("new device id = ",deviceID);
		const newDevice = new Device({deviceID:deviceID});
		newDevice.save()
		.then( doc => {
			console.log(doc);
		})
		.catch(err => {
			console.log("ERROR... ",err)
		});		
		res.json({"cats":[], "bowls":[]});
	} else {
		return res.json(found);
	}
}

// This is an ugly export way :)
module.exports = {
	handleDeviceData : handleDeviceData,
};