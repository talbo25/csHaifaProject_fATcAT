const Cat = require('./../models/catModel.js');
const Bowl = require('./../models/bowlModel.js');
const Device = require('./../models/deviceModel.js');
const utils = require('./../services/utils.js');
const {check_mailbox,send_current_weight_to_devices} = require('./../services/sockets.js');


const handleUpdateData = () => async (req,res) => {
	if (!("passport" in req.body)) {

		return res.status(400).json("-E- WHO ARE YOU?");
	}
	const { passport } = req.body;

	try {
		const bowlData = await Bowl.findOne(
			{
				bowlID: passport["id"],
				key: passport["key"],
			},
			{
				activeHours: 1,
				method: 1,
			}
		);
		const catsData = await Cat.find(
			{
				bowlID: passport["id"],
			},
			{
				weight: 1,
				feedingHours: 1,
			}
		);

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
			"scale": check_mailbox(bowlID),
		});

	} catch (err) {
		console.warn(err);
		return res.status(400).json(err);
	}
}

//check passport
const check_passport = async (id,key) => {
	const notFakeBowl = await Bowl.findOne({bowlID : id, key: key});
	if (!notFakeBowl || notFakeBowl.ok === 0) {
		throw("-E- UHHH you are a bad bowl")
	}
	console.log("-I- Good bowl!");
}

const handleNewLog = () => async (req,res) => {
		const { passport,log } = req.body;
	try{
		if (!(passport)) {
			throw("You must travel with passport");
		}
		await check_passport(passport["id"],passport["key"]);

		if (!(log)) {
			throw("No log  - No service")
		}
	} catch (err) {
		console.warn(err);
		return res.status(400).json("-E- Bad request : "+err);
	}

	try {
		utils.add_logs_to_device(passport["id"],log);
	} catch (err) {
		console.warn(err);
		return res.status(400).json(err);
	}
	return res.status(200).json(`-I- blabla`);
}

const handlCurrentWeight = () => async (req,res) => {
	const { passport,weight } = req.body;
	try{
		if (!("passport")) {
			throw("You must travel with passport");
		}

		await check_passport(passport["id"],passport["key"]);

		if (!("weight")) {
			throw("No weight  - No service")
		}
	} catch (err) {
		console.warn(err);
		return res.status(400).json("-E- Bad request : "+err);
	}

	try {
		const funcRes = await send_current_weight_to_devices(passport["id"],weight);
		// console.log("-D- funcRes = ",funcRes);
		res.status(200).json(funcRes);
	} catch (err) {
		console.warn(err);
		return res.status(200).json(err);
	}

	
}

module.exports = {
	handleUpdateData : handleUpdateData,
	handleNewLog:handleNewLog,
	handlCurrentWeight: handlCurrentWeight,
};