// // const { Server } = require("socket.io.min");
// import {io} from 'js/socket.io.min.js'
// const io = new Server({
//   serveClient: false
// });

const socket = io()
console.log(io)
console.log(socket)
socket.emit('connection')