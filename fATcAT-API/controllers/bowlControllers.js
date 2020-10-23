// Keep the file name convention and the import export convention
const Cat = require('./../models/catModel.js');
const Bowl = require('./../models/bowlModel.js');
const Device = require('./../models/deviceModel.js');
const utils = require('./../services/utils.js');
const {check_mailbox,send_current_weight_to_devices} = require('./../services/sockets.js');


const handleUpdateData = () => async (req,res) => {
	if (!("passport" in req.body)) {
		// use any normal data validator (like joi) and never fix/handle security/sensitive issues by your own.
		// and the code status should be 422, and why did you return a simple string as json?
		return res.status(400).json("-E- WHO ARE YOU?");
	}
	const { passport } = req.body;

	try {
		const bowlData = await Bowl.findOne(
			{
				// prefer to use dot 'passport.id' 
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
				name:1,
				weight: 1,
				feedingHours: 1,
			}
		);

		console.log("-I- catsData = ", catsData);

		if (!bowlData) {
			throw("-E- null at bowlData request");
		}
		if (!catsData) {
			throw("-E- null at catsData request");
		}

		res.json(
		{
			// It's not a Json file but js, you can simply { bowlHours : bowlData.activeHours} instead of { "bowlHours" : bowlData["activeHours"] }
			"bowlHours" : bowlData["activeHours"],
			"catsWeights": catsData.map(cat => cat.weight),
			"catsHours": catsData.map(cat => cat.feedingHours),
			"catsNames":catsData.map(cat => cat.name),
			"method": bowlData["method"],
			"scale": check_mailbox(passport["id"]),
		});

	} catch (err) {
		console.warn(err);
		// *NEVER* give to the client the original DB, it contained sensitive info as your stack-trace. DB version etc.
		// also 400 error it's part of access not allows, you should return 500/501  
		return res.status(400).json(err);
	}
}

//check passport
const check_passport = async (id,key) => {
	const notFakeBowl = await Bowl.findOne({bowlID : id, key: key});
	if (!notFakeBowl || notFakeBowl.ok === 0) {
		// Throw Error object, = new Error('-E- UHHH you are a bad bowl)
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

		// The bracket is unnecessary
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
	return res.status(200).json(`New log recieved by server`);
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