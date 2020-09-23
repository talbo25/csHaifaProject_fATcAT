const Cat = require('./../models/catModel.js');
const Bowl = require('./../models/bowlModel.js');
const Device = require('./../models/deviceModel.js');

exports.getAllDeviceData = async (id) => {
	let res = {};
	let bowlsIndList = [];
	let bowlsList=[];

	console.log("id is ",id);
	const targetDevice = await Device.findOne({ deviceID: id});
	console.log("targetDevice is ",targetDevice);

	const findBowlByID = (id) => {
		console.log("findBowlByID id = ",id);
		return Bowl.findOne({bowlID:id});
	};

	let promises = targetDevice['bowls'].map( bowl => {
		return findBowlByID(bowl["bowlID"])
		.then(fb => {
			const fbB = JSON.parse(JSON.stringify(fb));
			const curBowl = JSON.parse(JSON.stringify(bowl));
			console.log("fb is ",fb);
			console.log("fbB is ",fbB);
			// curBowl["cats"] = fb["cats"];
			Object.keys(fbB).forEach(key => {
				console.log("key = ",key);
				if (key !== "_id" && key !== "bowlID") {
					console.log("to curBowl");
					curBowl[key] = fb[key];
				}
				
			})
			bowlsIndList = bowlsIndList.concat(fb["bowlID"]);
			console.log("curBowl is ",curBowl);
			return curBowl;
		})
	})
	// Wait for all Promises to complete
	return Promise.all(promises)
	  .then(async results => {
	  	console.log("TADA results = ",results);
	    bowlsList = results;

		console.log("bowlsIndList is ",bowlsIndList);
		console.log("bowlsList is ",bowlsList);

		let catsList = await Cat.find({bowlID: { $in: bowlsIndList}});
		let resultDict = {
			"cats" : catsList,
			"bowls" : bowlsList,
		};
		res = resultDict;
		console.log("res = ", res);
		return res;
	  })
	  .catch(e => {
	    console.error(e);
	  })


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