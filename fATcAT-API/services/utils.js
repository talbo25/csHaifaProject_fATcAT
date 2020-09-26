const Cat = require('./../models/catModel.js');
const Bowl = require('./../models/bowlModel.js');
const Device = require('./../models/deviceModel.js');
// const io = require('./../index.js').io;
// const currentConnectedClients = require('./../index.js').currentConnectedClients;
const {send_message_to_device, get_socketid_by_customid,set_method_timer,clear_timeout,refresh_logs} = require('./sockets.js');

exports.getAllDeviceData = async (id) => {
	let res = {};
	let bowlsIndList = [];
	let bowlsList=[];

	console.log("getAllDeviceData - id is ",id);
	const targetDevice = await Device.findOne({ deviceID: id});
	if (!targetDevice) return false;
	// console.log("targetDevice is ",targetDevice);

	const findBowlByID = (id) => {
		// console.log("findBowlByID id = ",id);
		return Bowl.findOne({bowlID:id});
	};

	let promises = targetDevice['bowls'].map( bowl => {
		return findBowlByID(bowl["bowlID"])
		.then(fb => {
			const fbB = JSON.parse(JSON.stringify(fb));
			const curBowl = JSON.parse(JSON.stringify(bowl));
			Object.keys(fbB).forEach(key => {
				if (key !== "_id" && key !== "bowlID") {
					curBowl[key] = fb[key];
				}
				
			})
			bowlsIndList = bowlsIndList.concat(fb["bowlID"]);
			return curBowl;
		})
	})
	// Wait for all Promises to complete
	return Promise.all(promises)
	  .then(async results => {
	    bowlsList = results;

		let catsList = await Cat.find({bowlID: { $in: bowlsIndList}});
		let resultDict = {
			"cats" : catsList,
			"bowls" : bowlsList,
		};
		res = resultDict;
		// console.log("getAllDeviceData - res = ", res);
		return res;
	  })
	  .catch(e => {
	    console.error(e);
	  })


}

exports.add_logs_to_device = async (bowlID, newLogs) => {
	const myDevices = Device.update({"bowls.bowlID":bowlID},{ $addToSet: { logs: newLogs}},{new:true});

	refresh_logs(myDevices)
}

exports.change_method = async (bowlID, deviceID) => {
	console.log("-I- change_method -- start");
	console.log("bowlID = ",bowlID);
	console.log("deviceID = ",deviceID);
	let socketID;

	// try{
	// 	socketID = get_socketid_by_customid(deviceID);
	// 	if (!socketID) {
	// 		return false;
	// 	}
	// } catch (err) {
	// 	console.warn(err);
	// 	throw("-E- problem with socket");
	// }
	console.log("-I- got socket id");
	try{
		let bowl =await  Bowl.findOneAndUpdate({bowlID:bowlID, method: "automatically"},{method: "manually"},{new:true});
		console.log("-D- 11111 bowl = ",bowl);

		if (!bowl){
			console.log("-D- bowl null method = manually")
			//manual
			bowl = await  Bowl.findOneAndUpdate({bowlID:bowlID, method: "manually"},{method: "automatically"},{new:true});
			if (!bowl) {
				 throw("-ERROR- Couldn't find bowl");
			}
			// clear_timeout(socketID);
			return bowl;
		} 
		console.log("-D- changed to man method = automatically")
		// set_method_timer(socketID,bowlID);
		// currentConnectedClients[socketID].timeout = setTimeout( () => {
		// console.log("setTimeout for ", socketID);
		// bowl["method"] = "automatically";
		// send_message_to_device("bowl_to_auto",socketID,bowlID,`Bowl is back to automatically method`)
		// // io.to(socketID).emit("bowl_to_auto", 
		// // 	{
		// // 		bowlID: bowlID,
		// // 		message: `Bowl is back to automatically method`
		// // 	});
		// },5000);
		return bowl;
	} catch (err) {
		console.log(err);
		return false;
	}
	
}