const database = require('./dummy_database.js');

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const device_data = require('./controllers/device_data.js');
const verify_bowl = require('./controllers/verify_bowl.js');
const add_new_object = require('./controllers/add_new_object.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const getAllData = (id) => {
	let res = {};
	database.devices.forEach( device => {
		if (device.id === id ) {
			let catsList = database.cats.filter( (cat) => device.cats.includes(cat.id));
			let bowlsList = database.bowls.filter( (bowl) => device.bowls.includes(bowl.id));
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
app.post('/device_data', device_data.handleDeviceData(database,getAllData));
app.post('/verify_bowl', verify_bowl.handleVerifyBowl(database));
app.post('/add_new_object/bowl', add_new_object.handleNewBowl(database,getAllData));
app.post('/add_new_object/cat', add_new_object.handleNewCat(database,getAllData));

app.listen(3000, ()=> {
	console.log('app is running on 3000');
})

/*
/devices --> get all devices
/cats --> gel all cats
/bowls --> get all bowls
/cats/:catID
*/