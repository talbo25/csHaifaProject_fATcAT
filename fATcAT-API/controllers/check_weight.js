const Cat = require('./../models/catModel.js');
const Bowl = require('./../models/bowlModel.js');
const Device = require('./../models/deviceModel.js');

const handleCheckWeight = () => async (req,res) => {
	const BreakException= {};
	let found = false;
	const { weight, bowlID } = req.body;
	const currentHour = (new Date()).getHours();
	// let message = "No Bowl with ID "+ bowlID;

	const check_time =  (checkHours) => {
		let inTime =false;
		// It's way way better to build your data structure to not need this tricky regexp
		// like a numbers array of feeding hours, it;s easy to maintain and easy to validate 
		const m = cat["feedingHours"].match(/^s?(\d\d):\d\d?e?(\d\d):\d\d?$/);
		if (m) {
			if (m[1] < m[3]) {
				//regular range min-max
				inTime = hours >= m[1] && hours < m[3]; 
			} else {
				//over the 00:00 point
				inTime = hours >= m[1] || hours < m[3];
			}
		}
		return inTime;
	}

	const check_weight = (weight) => {
		// don't put "magic" numbers in your code
		let minW =cat["weight"]-0.2;
		let maxW = parseFloat(cat["weight"])+0.2;
		if (weight >= minW && weight <= maxW) {
			return true;
		}
		return false;
	}

	try {
			const myBowl = await Bowl.findOne({bowlID:bowlID});
			if (!myBowl) {
				throw("-E- Couldn't find bowl with id ", bowlID)
			}

			const inTime = check_time(myBowl.activeHours);
			if (!inTime) {
				console.log("-I- not in active hours");
				return res.json(false);
			}

			// in active hours
			// check cats
			const myCats = await Cat.find({bowlID:bowlID},{feedingHours:1,weight:1})
			.then(res =>{
				if (!res) {
					//no cats -> depand only in bowl's active hours
					return true;
				}

				res.reduce((acc,val) =>{
					acc || (check_time(val.feedingHours) && check_weight(val.weight));
				},false);
			});


		// 	// bowl has cats
		// 	myCats.forEach((cat) => {
		// 	if (cat["bowlID"] === bowlID) {
		// 		message = "No cats for bowl";
		// 		//check if cat fit to the conditions
		// 		const minW =cat["weight"]-0.2;
		// 		const maxW = parseFloat(cat["weight"])+0.2;
		// 		if (weight >= minW && weight <= maxW) {
		// 			// cat fit to weight check
		// 			if (cat["feedingHours"] === "00:00") {
		// 				//can eat anytime
		// 				found = true;
		// 				throw BreakException;
		// 			}
		// 			const m = cat["feedingHours"].match(/^s?(\d\d):\d\d?e?(\d\d):\d\d?$/);
		// 			if (m) {
		// 				const date_ob = new Date();
		// 				const hours = date_ob.getHours();
		// 				if (m[1] < m[3]) {
		// 					//regular range min-max
		// 					found = hours >= m[1] && hours < m[3]; 
		// 				} else {
		// 					//over the 00:00 point
		// 					found = hours >= m[1] || hours < m[3];
		// 				}
		// 				if (!found) {
		// 					message = "Failed because hour";
		// 				}
		// 				throw BreakException;
		// 			} 
		// 		} else {
		// 			message = "Failed because weight ";
		// 		}
		// 	}
		// })
	} catch (err) {
		console.warn(err)
		return res.status(400).json(err);
	}
	if (!found){
		return res.status(400).json(message);
	}
	res.json(found);
}

module.exports = {
	handleCheckWeight : handleCheckWeight,
};