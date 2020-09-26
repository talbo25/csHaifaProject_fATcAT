const Cat = require('./../models/catModel.js');
const Bowl = require('./../models/bowlModel.js');
const Device = require('./../models/deviceModel.js');

const handleTinCan = () => async (req,res) => {

	if (!("Major_Tom" in req.body)) {

		return res.status(400).json("-E- WHO ARE YOU?");
	}
	const { Major_Tom } = req.body;

	try {
		if ("logs" in Major_Tom){
			utils.add_logs_to_device(Major_Tom["id"],Major_Tom["logs"]);
		}
	} catch (err) {
		console.warn(err);
	}
	try {
		const bowlData = await Bowl.findOne(
			{
				bowlID: Major_Tom["id"],
				key: Major_Tom["key"],
			},
			{
				activeHours: 1,
				method: 1,
			}
		);
		const catsData = await Cat.find(
			{
				bowlID: Major_Tom["id"],
			},
			{
				weight: 1,
				feedingHours: 1,
			}
		);
		// console.log("#############################");
		// console.log("bowlData = ", bowlData);
		// console.log("#############################");
		// console.log("catsData = ", catsData);
		// console.log("#############################");

		if (!bowlData) {
			throw("-E- null at bowlData request");
		}
		if (!catsData) {
			throw("-E- null at catsData request");
		}

		res.json(
		{
			"bowlHours" : bowlData["activeHours"],
			"catsWeights": catsData.map(cat => cat.weight),
			"catsHours": catsData.map(cat => cat.feedingHours),
			"method": bowlData["method"],
		});

	} catch (err) {
		console.warn(err);
		return res.status(400).json(err);
	}
}

module.exports = {
	handleTinCan : handleTinCan,
};