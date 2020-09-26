const Bowl = require('./../models/bowlModel.js');

const socketio = require("socket.io");
let io=socketio();
const currentConnectedClients = {};

module.exports.listen = (server) => {
  io = socketio(server);
  io.on('connection', socket => {
  console.log("New client connected");
  
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
  return io;
}




module.exports.send_message_to_device = (header,targetSocket,targetNick,message)  =>{
  io.to(targetSocket).emit(header, 
      {
        target: targetNick,
        message: message
      });
}  


module.exports.get_socketid_by_customid = (deviceID) =>{
  console.log("-I- get_socketid_by_customid -- start")
  let found = false;
  if (!currentConnectedClients) {
    throw("-E- no currentConnectedClients variable");
  }
  console.log("currentConnectedClients:",currentConnectedClients);
  Object.keys(currentConnectedClients).forEach(clientID => {
    console.log("-D- currentConnectedClients[clientID].customId = ",currentConnectedClients[clientID].customId);
    if(currentConnectedClients[clientID].customId === deviceID){
      found = clientID;
      return ;
    }
  });
  console.log("-I- get_so cketid_by_customid -- end ", found );
  return found;
}

module.exports.set_method_timer =  (socketID,bowlID) => {
    currentConnectedClients[socketID].timeout = setTimeout( async () => {
    console.log("setTimeout for ", socketID);
    await  Bowl.findOneAndUpdate({bowlID:bowlID},{method: "automatically"});
    module.exports.send_message_to_device("bowl_to_auto",socketID,bowlID,`Bowl is back to automatically method`)
    },5000);
  }

  module.exports.clear_timeout = (socketID) => {
    clearTimeout(currentConnectedClients[socketID].timeout)
  }


module.exports.refresh_logs = (deviceIDlogs) => {
  let socketID;
  deviceIDlogs.forEach( device => {
    socketID = module.exports.get_socketid_by_customid(device.deviceID);
    module.exports.send_message_to_device("refresh_logs",socketID,device.deviceID,device.logs) ;
  })

}
