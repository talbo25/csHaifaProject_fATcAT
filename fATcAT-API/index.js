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
// const server = http.createServer(app);//create a server
// const s = new WebSocket.Server({ server });

// // WebSocket("ws://192.168.56.1:3000");
// require('dns').lookup(require('os').hostname(), function (err, add, fam) {
//   console.log('addr: '+add);
// });

// s.on('connection',function(ws,req){
// 	ws.on('message',function(message){
// 		console.log("Received: "+message);
// 		// s.clients.forEach(function(client){ //broadcast incoming message to all clients (s.clients)
// 		// 	if(client!=ws && client.readyState ){ //except to the same client (ws) that sent this message
// 		// 		client.send("broadcast: " +message);
// 		// 	}
// 		// });
// 		ws.send("From Server only to sender: "+ message); //send to client where message is from
// 	});
// 	ws.on('close', function(){
// 		console.log("lost one client");
// 	});
// 	ws.send("HI KIDO");
// 	console.log("new client connected");
// });



// var arduinoSerialPort = new SerialPort("COM6", {  
//  baudRate: 9600
// });

// arduinoSerialPort.on('open',function() {
//   console.log('Serial Port COM6 is opened.');
// });


// app.get('/:action', function (req, res) {
    
//    var action = req.params.action || req.param('action');
    
//     if(action == 'led'){
//         arduinoSerialPort.write("w");
//         return res.send('Led light is on!');
//     } 
//     if(action == 'off') {
//         arduinoSerialPort.write("t");
//         return res.send("Led light is off!");
//     }
    
//     return res.send('Action: ' + action);
 
// });

// const DB = process.env.DATABASE.replace( 
// 	'<PASSWORD>', 
// 	process.env.DATABASE_PASSWORD
// 	);

// mongoose.connect(DB, {
// 	useNewUrlParser: true,
// 	useCreateIndex: true,
// 	useFindAndModify: false,
// }).then(() =>console.log("DB connected successfully!"));


const getAllDeviceData = (id) => {
	let res = {};
	database.devices.forEach( device => {
		if (device.id === id ) {
			let bowlsIndList = [];
			let bowlsList = device['bowls'].map( bowl => {
				const curBowl = JSON.parse(JSON.stringify(bowl));
				const fb = database.bowls.filter (factoryBowl => {
					if (factoryBowl["id"] === curBowl["id"]) {
						curBowl["cats"] = factoryBowl["cats"];
						curBowl["activeHours"] = factoryBowl["activeHours"];
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
app.get('/arduino_test', (req, res) =>{res.send('Got the temp data, thanks..!!');     console.log(JSON.stringify(req.body));})

app.get('/', (req, res) =>{res.send(database)})
app.get('/cats', (req,res) => {	res.send(database.cats)})
app.get('/bowls', (req,res) => { res.send(database.bowls)});
app.post('/device_data', device_data.handleDeviceData(database,getAllDeviceData));
app.post('/verify_bowl', verify_bowl.handleVerifyBowl(database));
app.post('/add_new_object/bowl', add_new_object.handleNewBowl(database,getAllDeviceData));
app.post('/add_new_object/cat', add_new_object.handleNewCat(database,getAllDeviceData));
app.post('/check_weight', check_weight.handleCheckWeight(database));
app.post('/gods_intervention', gods_intervention.handleGodsIntervention(database));
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

	database["bowls"].forEach((bowl) => {
		if (bowl["id"] === Major_Tom["id"] && bowl["key"] === Major_Tom["key"]){
			bowlHours = bowl["activeHours"];
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
			"command": "sesomi",
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
