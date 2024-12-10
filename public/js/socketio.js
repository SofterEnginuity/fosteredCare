// // const { Server } = require("socket.io.min");
    // import {io} from 'socket.io.min.js' 

    const socket = io()
    // console.log(io)
    console.log(socket)
    socket.emit('connection')

document.querySelector('button#sendMsg').addEventListener('click', sendMsg)
    function sendMsg(event){
        event.preventDefault()
        
        const inputElement = document.querySelector('textarea#popup-message')
        const message =  inputElement.value

        if (message) {
            const dataMsg = {
                // from: 
                to: inputElement.dataset.id,
                content: message,
                date: Date.now()
            }
            socket.emit('chat message', dataMsg)
        const popupContainer = document.getElementById("popup-container");
         popupContainer.classList.add("popup-hidden"); // Hide the popup
         inputElement.value = ""
              
        } else {
          alert("Please fill out the message field.");
        }
    
    }



    

