const dotenv = require('dotenv');
const database = require('./dummy_database2.js');
const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');


const device_data = require('./controllers/device_data.js');
const verify_bowl = require('./controllers/verify_bowl.js');
const add_new_object = require('./controllers/add_new_object.js');
const check_weight = require('./controllers/check_weight.js');
const gods_intervention = require('./controllers/gods_intervention.js');

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

const getAllDeviceData = (id) => {
	let res = {};
	database.devices.forEach( device => {
		if (device.id === id ) {
			let bowlsIndList = [];
			let bowlsList = device.bowls.map( bowl => {
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

app.get('/', (req, res) =>{res.send(database)})
app.get('/cats', (req,res) => {	res.send(database.cats)})
app.get('/bowls', (req,res) => { res.send(database.bowls)});
app.post('/device_data', device_data.handleDeviceData(database,getAllDeviceData));
app.post('/verify_bowl', verify_bowl.handleVerifyBowl(database));
app.post('/add_new_object/bowl', add_new_object.handleNewBowl(database,getAllDeviceData));
app.post('/add_new_object/cat', add_new_object.handleNewCat(database,getAllDeviceData));
app.post('/check_weight', check_weight.handleCheckWeight(database));
app.post('/gods_intervention', gods_intervention.handleGodsIntervention(database));

const port = process.env.PORT || 3000;
app.listen(port, ()=> {
	console.log(`app is running on ${port}`);
})

/*
/devices --> get all devices
/cats --> gel all cats
/bowls --> get all bowls
/cats/:catID
*/