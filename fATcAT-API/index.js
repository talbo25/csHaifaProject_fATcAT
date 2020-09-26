
const dotenv = require('dotenv');
// const database = require('./dummy_database2.js');
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
const tin_can = require('./controllers/tin_can.js');
const logs_request = require('./controllers/logs_request.js');
const remove_object = require('./controllers/remove_object.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config({path: './config.env'});
const server = http.createServer(app);
const io = require('./services/sockets.js').listen(server);
// const io = socketio(server);

// // socket io configurations
// const currentConnectedClients = {};

// io.on('connection', socket => {
//   console.log("New client connected");
//   // console.log("Socket = ", socket);
  
//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//     delete currentConnectedClients[socket.id];
//   });

//   socket.on('storeClientInfo', function (data) {
//   		currentConnectedClients[socket.id] = 
//   		{
//   			customId : data.customId,
//   			timeout : null,
//   		}

//   		console.log("-D- socket on : ",socket.id);
//   		console.log(currentConnectedClients[socket.id]);
// 	});
// });

const DB = process.env.DATABASE.replace( 
	'<PASSWORD>', 
	process.env.DATABASE_PASSWORD
	);

mongoose.connect(DB, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
}).then(() =>console.log("DB connected successfully!"));

app.get('/currentConnectedClients', (req, res) =>{res.send(currentConnectedClients)})
app.get('/cats', get_objects.handleGetAllCats());
app.get('/bowls', get_objects.handleGetAllBowls());
app.post('/device_data', device_data.handleDeviceData());
app.post('/verify_bowl', verify_bowl.handleVerifyBowl());
app.post('/add_new_object/bowl', add_new_object.handleNewBowl());
app.post('/add_new_object/cat', add_new_object.handleNewCat());
app.post('/check_weight', check_weight.handleCheckWeight());
app.post('/change_method', change_method.handleChangeMethod());
app.post('/tin_can', tin_can.handleTinCan());
app.post('/logs', logs_request.handleLogs());
app.post('/remove_object/bowl', remove_object.handleRemoveBowl());
app.post('/remove_object/cat', remove_object.handleRemoveCat());

const port = process.env.PORT || 3000;
server.listen(port, ()=> {
	console.log(`app is running on ${port}`);
})

// module.exports = {io:io, currentConnectedClients:currentConnectedClients};
