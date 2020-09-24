const socketio = require("socket.io");
const server = require("./../index.js");
const io = socketio(server);

exports.currentConnectedClients = {};

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