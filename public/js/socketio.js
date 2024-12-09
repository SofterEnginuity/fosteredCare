// // const { Server } = require("socket.io.min");
    // import {io} from 'socket.io.min.js' 

    const socket = io()
    // console.log(io)
    console.log(socket)
    socket.emit('connection')

document.querySelector('button#sendMsg').addEventListener('click', sendMsg)
    function sendMsg(event){
        event.preventDefault()
        const inputElement = document.querySelector('#msg')
        const message =  inputElement.value
        const dataMsg = {
            // from: 
            to: inputElement.dataset.id,
            content: message,
            date: Date.now()
        }
        socket.emit('chat message', dataMsg)
    }


