var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var trash = document.getElementsByClassName("fa-trash-o");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});


Array.from(thumbDown).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('messages2', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbUp':thumbUp
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});



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
        span.innerHTML = `<input type="text" value="${currentValue}" />`;
        const input = span.querySelector('input');

        // Focus on the input and handle saving changes
        input.focus();
        input.addEventListener('blur', () => {
          const newValue = input.value;
          span.innerHTML = newValue; // Update UI

          // Send PUT request to update the field in the database
          fetch('/messages', {
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


document.querySelectorAll('.delete-icon').forEach(element => {
  element.addEventListener('click', function() {
    const itemId = this.dataset.id;

    fetch('/messages', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ _id: itemId })
    })
    .then(response => {
      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Failed to delete the item.');
      }
    });
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