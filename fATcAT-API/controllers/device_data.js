const handleDeviceData = (database,getAllDeviceData) => (req,res) => {
	const { id } = req.body;
	let found = getAllDeviceData(id);
	// console.log("handleDeviceData found = ",found);
	if (Object.keys(found).length === 0) {
		// new device 
		// console.log("new device id = ",id);
		database.devices.push({"id":id})
		res.json({"cats":[], "bowls":[]});
	} else {
		return res.json(found);
	}
}

module.exports = {
	handleDeviceData : handleDeviceData,
};