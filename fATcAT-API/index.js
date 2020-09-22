const dotenv = require('dotenv');
const database = require('./dummy_database2.js');
const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketio = require("socket.io");

const get_objects = require('./controllers/get_objects.js');
const device_data = require('./controllers/device_data.js');
const verify_bowl = require('./controllers/verify_bowl.js');
const add_new_object = require('./controllers/add_new_object.js');
const check_weight = require('./controllers/check_weight.js');
const gods_intervention = require('./controllers/gods_intervention.js');
const tin_can = require('./controllers/tin_can.js');
const logs_request = require('./controllers/logs_request.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config({path: './config.env'});
const server = http.createServer(app);
const io = socketio(server);

// socket io configurations
let interval;
const currentConnectedClients = {};

io.on('connection', socket => {
  console.log("New client connected");
  // console.log("Socket = ", socket);
  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    delete currentConnectedClients[socket.id];
  });

  socket.on('storeClientInfo', function (data) {
  		currentConnectedClients[socket.id] = 
  		{
  			customId : data.customId,
  			timeout : null,
  		}

  		console.log("-D- socket on : ",socket.id);
  		console.log(currentConnectedClients[socket.id]);
	});
});

////////////////////////////////
const DB = process.env.DATABASE.replace( 
	'<PASSWORD>', 
	process.env.DATABASE_PASSWORD
	);

mongoose.connect(DB, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
}).then(() =>console.log("DB connected successfully!"));


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

const change_method = (bowlID, deviceID) => {
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

app.get('/', (req, res) =>{res.send(database)})
app.get('/cats', get_objects.handleGetAllCats());
app.get('/bowls', get_objects.handleGetAllBowls());
app.post('/device_data', device_data.handleDeviceData(database,getAllDeviceData));
app.post('/verify_bowl', verify_bowl.handleVerifyBowl(database));
app.post('/add_new_object/bowl', add_new_object.handleNewBowl(database,getAllDeviceData));
app.post('/add_new_object/cat', add_new_object.handleNewCat(database,getAllDeviceData));
app.post('/check_weight', check_weight.handleCheckWeight(database));
app.post('/gods_intervention', gods_intervention.handleGodsIntervention(database,change_method));
app.post('/tin_can', tin_can.handleTinCan(database));
app.post('/logs', logs_request.handleLogs(database));

const port = process.env.PORT || 3000;
server.listen(port, ()=> {
	console.log(`app is running on ${port}`);
})
