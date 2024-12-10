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

document.getElementById('open-sidebar')?.addEventListener('click', function () {
  document.getElementById('message-sidebar').classList.add('open');
});

document.getElementById('close-sidebar')?.addEventListener('click', function () {
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
const sendMessageButton = document.getElementById("showPopUp");

const cancelButton = document.getElementById("cancel-button");
const messageForm = document.getElementById("message-form");
const subjectInput = document.getElementById("subject");
const messageTextarea = document.getElementById("popup-message");

// Open the popup when clicking "Send Msg"
sendMessageButton.addEventListener("click", (e) => {
  // const userId = e.target.previousElementSibling.dataset.id; // Get user ID from data-id attribute
  // popupContainer.dataset.userId = userId; 
  popupContainer.classList.remove("popup-hidden"); // Show the popup
});

// Close the popup when clicking "Cancel"
cancelButton.addEventListener("click", () => {
  popupContainer.classList.add("popup-hidden"); // Hide the popup
});


