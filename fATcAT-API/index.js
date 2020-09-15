const dotenv = require('dotenv');
const database = require('./dummy_database2.js');
const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
// const SerialPort = require("serialport");
const http = require('http');
const WebSocket = require('ws');

// const readSerial = require("./services/readSerial.js")
const device_data = require('./controllers/device_data.js');
const verify_bowl = require('./controllers/verify_bowl.js');
const add_new_object = require('./controllers/add_new_object.js');
const check_weight = require('./controllers/check_weight.js');
const gods_intervention = require('./controllers/gods_intervention.js');
// const blink_blink = require('./controllers/blink_bowl.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config({path: './config.env'});


// const DB = process.env.DATABASE.replace( 
// 	'<PASSWORD>', 
// 	process.env.DATABASE_PASSWORD
// 	);

// mongoose.connect(DB, {
// 	useNewUrlParser: true,
// 	useCreateIndex: true,
// 	useFindAndModify: false,
// }).then(() =>console.log("DB connected successfully!"));

////////////////////////////////
// const bowlschema = new mongoose.Schema({
// 	key:{
// 		type: String,
// 		require: [true, 'Bowl must has a key'],
// 		unique: true
// 	},
// 	activeHours: String,
// });

// const bowl = mongoose.model('Bowl', bowlschema);

// const testBowl = new bowl( {
// 	key: "CCC"
// });

// testBowl.save()
// .then( doc => {
// 	console.log(doc);
// })
// .catch(err => {
// 	console.log("ERROR... ",err)
// });
//////////////////////////

const getAllDeviceData = (id) => {
	let res = {};
	console.log("id is ",id);
	database.devices.forEach( device => {
		if (device.id === id ) {
			let bowlsIndList = [];
			let bowlsList = device['bowls'].map( bowl => {
				const curBowl = JSON.parse(JSON.stringify(bowl));
				const fb = database.bowls.filter (factoryBowl => {
					if (factoryBowl["id"] === curBowl["id"]) {
						curBowl["cats"] = factoryBowl["cats"];
						curBowl["activeHours"] = factoryBowl["activeHours"];
						curBowl["method"] = factoryBowl["method"];
						bowlsIndList = bowlsIndList.concat(factoryBowl["id"]);
					}
				})
				// console.log(bowlsIndList);
				return curBowl;
			})
			let catsList = database.cats.filter( (cat) => bowlsIndList.includes(cat.bowlID));
			let resultDict = {
				"cats" : catsList,
				"bowls" : bowlsList,
			};
			res = resultDict;
		}
	});
	return res;
}

const change_method = (id) => {
	database.bowls.forEach( bowl => {
		if ( bowl["id"] === id ) {
			if (bowl["method"] === "automatically") {
				bowl["method"] = "manually";
			} else {
				bowl["method"] = "automatically";
			}
			return bowl;
		}
	})
}
app.get('/arduino_test', (req, res) =>{res.send('Got the temp data, thanks..!!');     console.log(JSON.stringify(req.body));})

app.get('/', (req, res) =>{res.send(database)})
app.get('/cats', (req,res) => {	res.send(database.cats)})
app.get('/bowls', (req,res) => { res.send(database.bowls)});
app.post('/device_data', device_data.handleDeviceData(database,getAllDeviceData));
app.post('/verify_bowl', verify_bowl.handleVerifyBowl(database));
app.post('/add_new_object/bowl', add_new_object.handleNewBowl(database,getAllDeviceData));
app.post('/add_new_object/cat', add_new_object.handleNewCat(database,getAllDeviceData));
app.post('/check_weight', check_weight.handleCheckWeight(database));
app.post('/gods_intervention', gods_intervention.handleGodsIntervention(database,change_method));
// app.post('/blink_blink',blink_blink.handleBlink_blink(database));
app.post('/tin_can', (req,res) => {

	if (!("Major_Tom" in req.body)) {

		return res.status(400).json("-E- WHO ARE YOU?");
	}
	const { Major_Tom } = req.body;

	let bowlHours = "";
	let catsWeights = [];
	let catsHours = [];
	let found = false;
	let method = "";

	database["bowls"].forEach((bowl) => {
		if (bowl["id"] === Major_Tom["id"] && bowl["key"] === Major_Tom["key"]){
			bowlHours = bowl["activeHours"];
			method = bowl["method"];
			found = true;
		}
	})
	database["cats"].forEach((cat) => {
		if (cat["bowlID"] === Major_Tom["id"]) {
			catsWeights.push(cat["weight"]);
			catsHours.push(cat["feedingHours"]);
		}
	})

	res.json(
	{
		"Ground_Control": 
		{
			"bowlHours" : bowlHours,
			"catsWeights": catsWeights,
			"catsHours": catsHours,
			"method": method,
		},
	})
	if (!found) {
		return res.status(400).json("-E- Couldn't find bowl");
	}
})
const port = process.env.PORT || 3000;
app.listen(port, ()=> {
	console.log(`app is running on ${port}`);
})
