const Bowl = require('./../models/bowlModel.js');

const socketio = require("socket.io");
let io=socketio();
const currentConnectedClients = {};
const weightRequestsMailbox = {};

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
  console.log("-I- send_message_to_device -- start");
  console.log("-I- targetSocket = ",targetSocket);
  console.log("-I- message = ",message);

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
    },10*60*1000);
  }

  module.exports.clear_timeout = (socketID) => {
    clearTimeout(currentConnectedClients[socketID].timeout)
  }


module.exports.refresh_logs = (devices) => {
  console.log("-I- refresh_logs -- start");
  let socketID;
  devices.forEach( device => {
    socketID = module.exports.get_socketid_by_customid(device.deviceID);
    module.exports.send_message_to_device("refresh_logs",socketID,device.deviceID,device.logs[-1]) ;
  })

}

module.exports.get_currentConnectedClients = () => {
  console.log("-I- get_currentConnectedClients");
  return currentConnectedClients;
}

module.exports.get_weightRequestsMailbox = () => {
  console.log("-I- get_weightRequestsMailbox");
  return weightRequestsMailbox;
}

// module.exports.get_current_bowl_weight = (socketID) => {
//   if (!(socketID in currentConnectedClients) || !(currentWeight in currentConnectedClients[socketID]) || currentConnectedClients[socketID].currentWeight === null) {
//     return false;
//   }
//   const w = currentConnectedClients[socketID].currentWeight;
//   currentConnectedClients[socketID].currentWeight = null;
//   return w;
// }

//device request immidiate scale
module.exports.add_weight_request_to_pipe = (deviceID, bowlID) => {
  if (!(bowlID in weightRequestsMailbox)) {
    weightRequestsMailbox[bowlID] = [];
  }

  const deviceSocketID = module.exports.get_socketid_by_customid(deviceID);

  // if already in dictionary don't add 
  if (weightRequestsMailbox[bowlID].includes(deviceSocketID)) {
    return false
  }

  const newLen = weightRequestsMailbox[bowlID].unshift(deviceSocketID);

  return true;
}

// check if there are pending requests for immidiate scale
module.exports.check_mailbox = (bowlID) => {
  if (!(bowlID in weightRequestsMailbox)) {
    return false
  }
  if (!weightRequestsMailbox[bowlID] || weightRequestsMailbox[bowlID].length ===0) {
    return false;
  }

  // at least one device is waiting for scale
  return true
}

// bowl respond to immidiate scale requesr
module.exports.send_current_weight_to_devices = (bowlID,weight) => {
  console.log("-I- send_current_weight_to_devices");
  if (!weightRequestsMailbox[bowlID]) {
    throw("-E- Couldn't reach bowl's mailbox");
  }
  const p = new Promise ((resolve,reject) => {
    weightRequestsMailbox[bowlID].forEach(socketID => {
    module.exports.send_message_to_device("current_weight_response",socketID,"man devai",weight) ;
  })
    resolve()
  })
  return p.then(() => {
    delete weightRequestsMailbox[bowlID];
    return "Sent response";
  });
}