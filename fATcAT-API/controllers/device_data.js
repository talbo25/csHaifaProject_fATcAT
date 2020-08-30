const handleDeviceData = (database,getAllData) => (req,res) => {
	const { id } = req.body;
	let found = getAllData(id);

	if (found === {}) {
		res.status(400).json("-E- Couldn't find user");
	} else {
		return res.json(found);
	}
}

module.exports = {
	handleDeviceData : handleDeviceData,
};