import io from "socket.io-client";
const { SERVER_ADDRESS } = require("./../constants");

// socket io configurations
export const socket = io(SERVER_ADDRESS);
