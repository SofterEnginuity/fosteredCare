var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var trash = document.getElementsByClassName("fa-trash-o");



document.querySelector('label#email')?.addEventListener('click', function(event){
 document.querySelector('input#email').value = 'amanda.hoover@families.com'
 document.querySelector('input#password').value = 'families'
})

document.querySelector('label#password')?.addEventListener('click', function(event){
  document.querySelector('input#email').value = 'rebecca.adams@providers.com'
  document.querySelector('input#password').value = 'providers'
})

document.getElementById('open-sidebar').addEventListener('click', function () {
  document.getElementById('message-sidebar').classList.add('open');
});

document.getElementById('close-sidebar').addEventListener('click', function () {
  document.getElementById('message-sidebar').classList.remove('open');
});


 
function goBack() {
  history.back(); // Navigate to the previous page
}




// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Add click event listeners to all edit icons
  document.querySelectorAll('.edit-icon').forEach(icon => {
    icon.addEventListener('click', function() {
      const id = this.dataset.id;
      const field = this.dataset.field;
      const span = document.querySelector(`.editable[data-id="${id}"][data-field="${field}"]`);

      // Toggle edit mode by replacing span content with an input
      if (!span.querySelector('input')) {
        const currentValue = span.innerText;
        const icon = span.querySelector('i')
        span.innerHTML = `<input type="text" value="${currentValue}" />`;
        const input = span.querySelector('input');

        // Focus on the input and handle saving changes
        input.focus();
        input.addEventListener('blur', () => {
          const newValue = input.value;
          span.innerHTML = newValue; // Update UI
          // span.appendChild(icon)
          span.insertBefore(icon, span.childNodes[0] )
          // Send PUT request to update the field in the database
          fetch('/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: id, [field]: newValue })
          })
          .then(response => response.json())
          .then(data => console.log('Updated:', data))
          .catch(error => console.error('Error:', error));
        });
      }
    });
  });
});


document.querySelector('.delete')?.addEventListener('click', function() {
    fetch('/profile', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
      if (response.ok) {
        console.log(response.body)
      } else {
        console.error('Failed to delete the item.');
      }
    });
  });




Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});




// Elements
const popupContainer = document.getElementById("popup-container");
const sendMessageButton = document.getElementById("sendMsg");
const cancelButton = document.getElementById("cancel-button");
const messageForm = document.getElementById("message-form");
const subjectInput = document.getElementById("subject");
const messageTextarea = document.getElementById("popup-message");

// Open the popup when clicking "Send Msg"
sendMessageButton.addEventListener("click", (e) => {
  const userId = e.target.previousElementSibling.dataset.id; // Get user ID from data-id attribute
  popupContainer.dataset.userId = userId; // Store user ID in the popup container
  popupContainer.classList.remove("popup-hidden"); // Show the popup
});

// Close the popup when clicking "Cancel"
cancelButton.addEventListener("click", () => {
  popupContainer.classList.add("popup-hidden"); // Hide the popup
});

// Handle form submission when the "Send" button is clicked
messageForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent the form from submitting normally

  const userId = popupContainer.dataset.userId; // Get the user ID from the popup data
  const subject = subjectInput.value.trim(); // Get the subject
  const message = messageTextarea.value.trim(); // Get the message

  if (subject && message) {
    // Simulate sending to backend (you can customize this part)
    fetch('/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, subject, message }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Message sent successfully!");
          popupContainer.classList.add("popup-hidden"); // Hide the popup
          messageForm.reset(); // Reset the form fields
        } else {
          alert("Failed to send message.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  } else {
    alert("Please fill out both the subject and message fields.");
  }
});

 



// console.log(day)
// fetch goes inside the function so it doesnt run right away!
// fetch(url,
//  {method: 'GET',
//  headers: { 'X-Api-Key': api},
//   contentType: 'application/json' })//reassign the link to something else for ease of access
// .then(res => res.json())//response comes from the fetch above to make it more readable
// .then(data =>{
//     // document.querySelector('p').innerHTML = ""// this line resets the code so that it doesnt stack when you change it!!
    
//     data.forEach(histEvent => {// forEach data array, loop through each historical event 
// // document.querySelector('p').innerHTML += `<h2>${histEvent.year <0 ? -histEvent.year + " BC" : histEvent.year }</h2>${histEvent.event}<br>`//
//     })
//   console.log (data)//data come from the response abve

// })
// .catch(err => {
// console.log(`error ${err}`)  
// });