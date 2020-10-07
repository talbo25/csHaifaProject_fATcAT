const Cat = require('./../models/catModel.js');
const Bowl = require('./../models/bowlModel.js');
const Device = require('./../models/deviceModel.js');
// const io = require('./../index.js').io;
// const currentConnectedClients = require('./../index.js').currentConnectedClients;
const {send_message_to_device, get_socketid_by_customid,set_method_timer,clear_timeout,refresh_logs,get_current_bowl_weight,change_devices_method} = require('./sockets.js');

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

const get_sting_timestamp = () => {
	const date_ob = new Date();
	const date = ("0" + date_ob.getDate()).slice(-2);
	const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	const year = date_ob.getFullYear();
	const hours = date_ob.getHours();
	const minutes = date_ob.getMinutes();
	const seconds = date_ob.getSeconds();
	return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
} 

exports.add_logs_to_device = async (bowlID, newLogInfo) => {
	console.log("-I- add_logs_to_device -- start");
	// const newLogDate = get_sting_timestamp();
	const myDevices = await Device.find({"bowls.bowlID":bowlID});
	// console.log("-D- myDevices = ",myDevices);

	if(myDevices.ok === 0) {
		throw("-W- No devices connect to bowl ",bowlID);
	}

	const get_bowl_nickname = (bowls, targetID) => {
		let bowlName = "Unknown";
		bowls.forEach(bowl => {
			if (bowl.bowlID === targetID) {
				bowlName= bowl.name;
			}
		})
		return bowlName;
	}

	myDevices.forEach(async device => {
		const bowlNickname = await get_bowl_nickname(device.bowls,bowlID);
		console.log("-I- bowlNickname = ",bowlNickname);
		const newLog = {
			date : newLogInfo["date"] + " " + newLogInfo["time"],
			info : bowlNickname + " - " + newLogInfo["msg"],
		}
		console.log("-I- newLog = ",newLog);
		// if 20 logs - remoe oldest
		if (device.logs.length >=50){
			await Device.findByIdAndUpdate( device["_id"], { $pop: {logs: -1 } } )
		}
		const updateDevicesStatus = await Device.findByIdAndUpdate(device["_id"],{ $addToSet: { logs: newLog}},{new:true});
	})
	// refresh_logs(myDevices)
}

exports.change_method = async (bowlID, deviceID) => {
	console.log("-I- change_method -- start");
	console.log("bowlID = ",bowlID);
	console.log("deviceID = ",deviceID);
	// let socketID;

	// try{
	// 	socketID = get_socketid_by_customid(deviceID);
	// 	if (!socketID) {
	// 		return false;
	// 	}
	// } catch (err) {
	// 	console.warn(err);
	// 	throw("-E- problem with socket");
	// }	
	// change bowl's method
	try{
		let bowl =await  Bowl.findOneAndUpdate({bowlID:bowlID, method: "automatically"},{method: "manually"},{new:true});

		if (!bowl){
			console.log("-D- bowl null method = manually")
			//manual
			bowl = await  Bowl.findOneAndUpdate({bowlID:bowlID, method: "manually"},{method: "automatically"},{new:true});
			if (!bowl) {
				 throw("-ERROR- Couldn't find bowl");
			}
			change_devices_method(bowlID,"automatically");
			// clear_timeout(socketID);
			return bowl;
		} 
		change_devices_method(bowlID,"manually");
		// set_method_timer(socketID,bowlID);
		return bowl;
	} catch (err) {
		console.warn(err);
		return false;
	}
	
}
// const delay = async (ms) =>{
//   return await new Promise(resolve => setTimeout(resolve,ms));
// }

// exports.get_weight = async (bowlID, deviceID) => {
// 	console.log("-I- get_weight -- start");
// 	console.log("bowlID = ",bowlID);
// 	console.log("deviceID = ",deviceID);
// 	let socketID =1;

// 	// get bowl current weight
// 	// send request to bowl
// 	// get value from bowl
// 	let myWeight = false;
// 	let chances = 3;

// 	while (chances > 0 && !myWeight) {
// 		console.log("-D- chances = ", chances);
// 		console.log("-D- myWeight = ", myWeight);
// 		myWeight = get_current_bowl_weight(socketID);
// 		// myWeight = 3.3;
// 		await delay(3*1000);
// 		--chances;
// 	}
// 	return myWeight;
// }