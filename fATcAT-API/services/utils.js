const Cat = require('./../models/catModel.js');
const Bowl = require('./../models/bowlModel.js');
const Device = require('./../models/deviceModel.js');
const {io,currentConnectedClients} = require('./../index.js');

exports.getAllDeviceData = async (id) => {
	let res = {};
	let bowlsIndList = [];
	let bowlsList=[];

	console.log("getAllDeviceData - id is ",id);
	const targetDevice = await Device.findOne({ deviceID: id});
	if (!targetDevice) return false;
	// console.log("targetDevice is ",targetDevice);

	const findBowlByID = (id) => {
		console.log("findBowlByID id = ",id);
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
		console.log("getAllDeviceData - res = ", res);
		return res;
	  })
	  .catch(e => {
	    console.error(e);
	  })


}
const get_socketid_by_customid = (deviceID) =>{
	let found = false;
	Object.keys(currentConnectedClients).forEach(clientID => {
		if(currentConnectedClients[clientID].customId === deviceID){
			found = clientID;
			return;
		}
	});
	return found;
}

exports.change_method = async (bowlID, deviceID) => {
	console.log("change_method");
	console.log("bowlID = ",bowlID);
	console.log("deviceID = ",deviceID);

	// const socketID = get_socketid_by_customid(deviceID);
	// if (!socketID) {
	// 	return false;
	// }
	try{
		let bowl =await  Bowl.findOneAndUpdate({bowlID:bowlID, method: "automatically"},{method: "manually"});
		console.log("bowl = ",bowl);

		if (!bowl){
			console.log("method = manually")
			//manual
			bowl = await  Bowl.findOneAndUpdate({bowlID:bowlID, method: "manually"},{method: "automatically"});
			if (!bowl) {
				 throw("-ERROR- Couldn't find bowl");
			}
			// clearTimeout(currentConnectedClients[socketID].timeout);
			return bowl;
		} 
		console.log("method = automatically")
		// currentConnectedClients[socketID].timeout = setTimeout( () => {
		// console.log("setTimeout for ", socketID);
		// bowl["method"] = "automatically";
		// io.to(socketID).emit("bowl_to_auto", 
		// 	{
		// 		bowlID: bowlID,
		// 		message: `Bowl is back to automatically method`
		// 	});
		// },5000);
	} catch (err) {
		console.log(err);
		return false;
	}
	
}