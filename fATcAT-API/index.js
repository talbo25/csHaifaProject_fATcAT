// the cody style here is very old, I recommend you to migrate to the TypeScript world,
// but even if you want to remain in pure js, you can update the code style with better import/export
// you can read about the 'import { myFun } from 'my-lib' and 'export function myFun()'    
const dotenv = require('dotenv');
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
const change_method = require('./controllers/change_method.js');
const bowl = require('./controllers/bowlControllers.js');
const logs_request = require('./controllers/logs_request.js');
const remove_object = require('./controllers/remove_object.js');
const sockets_status = require('./controllers/get_currentConnectedClients.js');
const current_weight = require('./controllers/get_current_weight.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// First of all I recommend you read carefully this article https://medium.com/@nodepractices/were-under-attack-23-node-js-security-best-practices-e33c146cb87d
// currently I have access to your DB as admin and I can manipulate you data and login as any bowl I want, so read this article carefully and replace your DB certificates
// and to the details:
// it's better to use the default name '.env', also *never* add the .env file in your repository!!!
// it's will causes you to expose secrets by mistake.
// the vast conversion is to add the .env file to the gitignore, and create a 'example.env' with the keys example.
// also make sure that the file is exists before loading it, since in production you probably will not able to edit the file but to pass the variables values
// using the app host administration management
dotenv.config({path: './config.env'});

const server = http.createServer(app);

// Put all the imports in the top of the file
// and there is not point to hold unused var.
const io = require('./services/sockets.js').listen(server);

// If you will use my suggestion above in the .env you will not need this hack, and also you will not need to tell everybody
// what is your database user-name and URL
// remember, never tell info for free to the bad-guys about your systems.
// also, the name is not DB but DB_URL  
const DB = process.env.DATABASE.replace( 
	'<PASSWORD>', 
	process.env.DATABASE_PASSWORD
	);

mongoose.connect(DB, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
}).then(() =>console.log("DB connected successfully!"));

// To avid malicious payload you need to validate to use payload, using framrowd that do it build-in for your (like TSOA) 
// or by schema validator (like joi) 
app.get('/currentConnectedClients', sockets_status.handleCurrentConnectedClients());
app.get('/weightRequestsMailbox', sockets_status.handleWeightRequestsMailbox());
app.get('/cats', get_objects.handleGetAllCats());
app.get('/bowls', get_objects.handleGetAllBowls());
app.post('/device_data', device_data.handleDeviceData());
app.post('/verify_bowl', verify_bowl.handleVerifyBowl());
app.post('/add_new_object/bowl', add_new_object.handleNewBowl());
app.post('/add_new_object/cat', add_new_object.handleNewCat());
app.post('/check_weight', check_weight.handleCheckWeight());
app.post('/change_method', change_method.handleChangeMethod());
app.post('/bowl/update_data', bowl.handleUpdateData()); 
app.post('/bowl/new_log', bowl.handleNewLog()); 
app.post('/bowl/current_weight', bowl.handlCurrentWeight()); 
app.post('/logs', logs_request.handleLogs());
app.post('/remove_object/bowl', remove_object.handleRemoveBowl());
app.post('/remove_object/cat', remove_object.handleRemoveCat());
app.post('/current_weight', current_weight.handleGetCurrentBowlWeight());

// Add an errors catcher, to not exposes inner error and stack-traces to the client/bad-guy 
const port = process.env.PORT || 3000;
server.listen(port, ()=> {
	console.log(`app is running on ${port}`);
})
