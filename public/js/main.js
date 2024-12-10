

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




// Elements
// const popupContainer = document.getElementById("popup-container");



// const messageForm = document.getElementById("message-form");
// const messageTextarea = document.getElementById("popup-message");

// Open the popup when clicking "Send Msg"
Array.from(document.getElementsByClassName("showPopUp")).forEach(button=>button.addEventListener("click", (e) => {
  // const userId = e.target.previousElementSibling.dataset.id; // Get user ID from data-id attribute
  // popupContainer.dataset.userId = userId; 
  button.parentElement.querySelector('#popup-container').classList.remove("popup-hidden"); // Show the popup
}));


// Close the popup when clicking "Cancel"
Array.from(document.getElementsByClassName("cancel-button")).forEach(button=>button.addEventListener("click", () => {
  button.closest('#popup-container').classList.add("popup-hidden"); // Hide the popup
}));


