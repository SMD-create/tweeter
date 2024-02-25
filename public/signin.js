// signup.js
function signup() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  })
  .then(response => {
    if (response.ok) {
      console.log('Sign-up successful');
      window.location.href = './login.html';
    } else {
      console.error('Sign-up failed');
      // Handle failed sign-up, such as displaying an error message
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// signin.js

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => {
    if (response.ok) {
      // Response is OK, parse JSON data
      return response.json();
    } else {
      // Response is not OK, handle error
      throw new Error('Login failed');
    }
  })
  .then(data => {
    // Check if the response contains a message indicating successful login
    if (data.message === "Login successful") {
      // Redirect to index.html
      window.location.href = 'http://127.0.0.1:5500/public/home.html';
    } else {
      // Handle unexpected response
      throw new Error('Unexpected response');
    }
  })
  .catch(error => {
    // Handle errors
    console.error('Error:', error);
    // Display error message to the user
    // You can update the DOM to show an error message here
  });
}

