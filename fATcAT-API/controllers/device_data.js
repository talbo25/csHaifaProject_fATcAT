const utils = require('./../services/utils.js');
const Device = require('./../models/deviceModel.js');

const handleDeviceData = () => async (req,res) => {
	const { id } = req.body;
	let found = await utils.getAllDeviceData(id);
	if (!found) {
		// new device 
		console.log("new device id = ",id);
		const newDevice = new Device({deviceID:id});
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

module.exports = {
	handleDeviceData : handleDeviceData,
};