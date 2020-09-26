const Cat = require('./../models/catModel.js');
const Device = require('./../models/deviceModel.js');
const utils = require('./../services/utils.js');

const handleRemoveBowl = () => async (req,res) => {
	const { deviceID, objectID} = req.body;
	try {
		await Device.findOneAndUpdate({deviceID:deviceID},{ $pull : {bowls:{bowlID: objectID}}});

		res.json(await utils.getAllDeviceData(deviceID));
	} catch (err) {
		console.warn(err);
		res.status(400).json("-E- Couldn't remove bowl");
	}	
}

const handleRemoveCat = () => async (req,res) => {
	const { objectID,deviceID} = req.body;
	try {
		await Cat.findOneAndDelete({_id: objectID});	
	} catch (err) {
		console.warn(err);
		res.status(400).json("-E- Couldn't remove Cat");
	}

	res.json(await utils.getAllDeviceData(deviceID));
}

module.exports = {
	handleRemoveBowl : handleRemoveBowl,
	handleRemoveCat : handleRemoveCat,
};