const Cat = require('./../models/catModel.js');
const Bowl = require('./../models/bowlModel.js');
const Device = require('./../models/deviceModel.js');

const handleVerifyBowl = () => async (req,res) => {
	console.log("handleVerifyBowl -- start");
	const BreakException= {};
	const { bowlID, key} = req.body;
	const result = {};

	try {
		const myBowl = await Bowl.findOne({
			bowlID: bowlID,
			key : key
		});

		// const numBowlCats = await Cat.find({
		// 	bowlID: bowlID,
		// }).then(res => res.length);

		// const numBowlDEevices = await Device.find({
		// 	"bowls.bowlID": bowlID,
		// }).then(res => res.length);

		// console.log("myBowl = ",myBowl);
		// console.log("numBowlCats = ",numBowlCats);
		// console.log("numBowlDEevices = ",numBowlDEevices);

		if (!myBowl) {
			throw("-E- null at myBowl request");
		} 
		res.json(myBowl);
		// result["bowlHours"] = myBowl["activeHours"];
		// result["method"] = myBowl["method"];

		// if (numBowlCats) {
		// 	// throw("-E- null at numBowlCats request");

		// }

		// if (!numBowlDEevices) {
		// 	throw("-E- null at numBowlDEevices request");
		// }

		// res.json(
		// {
		// 	"bowlHours" : myBowl["activeHours"],
		// 	"#cats": numBowlCats,
		// 	"#devices": numBowlDEevices.length,
		// 	"method": myBowl["method"],
		// });
	} catch (err) {
		console.warn(err);
		return res.status(400).json(err);
	}
}

module.exports = {
	handleVerifyBowl : handleVerifyBowl,
};