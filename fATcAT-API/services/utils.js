const Cat = require('./../models/catModel.js');
const Bowl = require('./../models/bowlModel.js');
const Device = require('./../models/deviceModel.js');

exports.getAllDeviceData = async (id) => {
	let res = {};
	let bowlsIndList = [];

	console.log("id is ",id);
	const targetDevice = await Device.findOne({ id: id});
	console.log("targetDevice is ",targetDevice);

	let bowlsList = targetDevice['bowls'].map( bowl => {
		const curBowl = JSON.parse(JSON.stringify(bowl));
		const fb =  Bowl.findOne({id:bowl["id"]});
		console.log("fb is ",fb);
		curBowl["cats"] = fb["cats"];
		curBowl["activeHours"] = fb["activeHours"];
		curBowl["method"] = fb["method"];
		bowlsIndList = bowlsIndList.concat(fb["id"]);
		return curBowl;

	})
	console.log(bowlsIndList);
	console.log("bowlsList is ",bowlsList);

	let catsList = Cat.find({bowlID: { $in: bowlsIndList}});
	let resultDict = {
		"cats" : catsList,
		"bowls" : bowlsList,
	};
	res = resultDict;
	return res;
}
exports.get_socketid_by_customid = (deviceID) =>{
	let found = false;
	Object.keys(currentConnectedClients).forEach(clientID => {
		if(currentConnectedClients[clientID].customId === deviceID){
			found = clientID;
			return;
		}
	});
	return found;
}

exports.change_method = (bowlID, deviceID) => {
	database.bowls.forEach( bowl => {
		if ( bowl["id"] === bowlID ) {
			const socketID = get_socketid_by_customid(deviceID);
			if (bowl["method"] === "automatically") {
				bowl["method"] = "manually";
				if (!socketID) {
					return false;
				}
				currentConnectedClients[socketID].timeout = setTimeout( () => {
					console.log("setTimeout for ", socketID);
					bowl["method"] = "automatically";
					io.to(socketID).emit("bowl_to_auto", 
						{
							bowlID: bowlID,
							message: `Bowl is back to automatically method`
						});
				},5000);
			} else {
				bowl["method"] = "automatically";
				clearTimeout(currentConnectedClients[socketID].timeout);
			}
			return bowl;
		}
	})
}