const handleLogs = (database) => (req,res) => {
	let logs = [];
	const { deviceID } = req.body;
	database["devices"].forEach((device) => {
		if (device["id"] === deviceID && "logs" in device){
			logs = device["logs"];
		}
	})
	res.send({size:logs.length, logs: logs});
}

module.exports = {
	handleLogs : handleLogs,
};