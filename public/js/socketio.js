// // const { Server } = require("socket.io.min");
    // import {io} from 'socket.io.min.js' 

    const socket = io()
    // console.log(io)
    console.log(socket)
    socket.emit('connection')

    Array.from(document.querySelectorAll("button.sendMsg")).forEach(button=>button.addEventListener("click", () => {
        
        button.closest('div.popup-container').classList.add("popup-hidden"); // Hide the popup
  
       
        // event.preventDefault()
        const inputElement =  button.closest('div.popup-container').querySelector('textarea.popup-message')
        const message =  inputElement.value
        
        if (message) {
            const dataMsg = {
                // from: 
                to: inputElement.dataset.id,
                content: message,
                date: Date.now()
            }
            socket.emit('chat message', dataMsg)
           setTimeout(()=>{window.location.reload()},500)
            console.log('send message',inputElement.dataset.id, message)
            const popupContainer =  button.closest('div.popup-container');
        //  popupContainer.classList.add("popup-hidden");
         inputElement.value = ""
              
        } else {
          alert("Please fill out the message field.");
        }
    
    }));



    

