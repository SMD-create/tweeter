// Function to update trending topics
function updateTrendingTopics() {
    var allPosts = document.querySelectorAll(".post");
    var hashtagsMap = new Map(); // Map to store hashtags and their frequencies
  
    // Iterate over all posts to extract hashtags and update frequencies
    allPosts.forEach(function(post) {
      var postContent = post.querySelector("p").textContent;
      var hashtags = postContent.match(/#[^\s#]+/g); // Extract hashtags using regular expression
      if (hashtags) {
        hashtags.forEach(function(hashtag) {
          var count = hashtagsMap.has(hashtag) ? hashtagsMap.get(hashtag) : 0;
          hashtagsMap.set(hashtag, count + 1);
        });
      }
    });
  
    // Sort the hashtags by frequency in descending order
    var sortedHashtags = [...hashtagsMap.entries()].sort((a, b) => b[1] - a[1]);
  
    var topicsList = document.getElementById("trending-topics-list");
    topicsList.innerHTML = ""; // Clear the existing list
  
    // Display the top 5 trending topics
    for (var i = 0; i < Math.min(5, sortedHashtags.length); i++) {
      var li = document.createElement("li");
      li.textContent = sortedHashtags[i][0] + " (" + sortedHashtags[i][1] + ")";
      topicsList.appendChild(li);
    }
  }
  
  // Function to handle file input change
  function handleFileInputChange(event) {
    const file = event.target.files[0];
    // Handle the selected file here
    console.log("Selected file:", file);
  }
  
  // Function to add a new post
  function addPost() {
    var postContent = document.getElementById("post-content").value;
    if (postContent.trim() === "") {
      alert("Please write something before posting.");
      return;
    }
  
    var post = document.createElement("div");
    post.className = "post";
    post.innerHTML = `
      <p>${postContent}</p>
      <p class="timestamp">Just now</p>
    `;
  
    document.getElementById("posts").appendChild(post);
  
    document.getElementById("post-content").value = "";
  
    // Update trending topics after adding a new post
    updateTrendingTopics();
  }
  
  // Initialize trending topics when the page loads
  updateTrendingTopics();
  
  // Update trending topics every 10 seconds
  setInterval(updateTrendingTopics, 10000);
  
  // Function to open GIF search and display GIFs
function openGifSearch() {
    var searchTerm = prompt("Enter a search term for GIFs:");
    if (searchTerm) {
        // Make a request to Giphy API
        var apiKey = "h7bP6PsEcitZkrEx3y0LcSpDk8WRPjfB"; // Replace "YOUR_API_KEY" with your actual Giphy API key
        var url = `https://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${apiKey}&limit=5`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayGIFs(data.data);
            })
            .catch(error => {
                console.error("Error fetching GIFs:", error);
            });
    }
}

// Function to display GIFs
function displayGIFs(gifs) {
    var gifDisplay = document.getElementById("gif-display");
    gifDisplay.innerHTML = ""; // Clear existing GIFs
    
    gifs.forEach(function(gif) {
        var gifImage = document.createElement("img");
        gifImage.src = gif.images.fixed_height.url;
        gifImage.alt = gif.title;
        gifImage.onclick = function() {
            addGIFToPost(gif.images.fixed_height.url);
        };
        gifDisplay.appendChild(gifImage);
    });
}

// Function to add selected GIF to post
function addGIFToPost(gifURL) {
    var postContent = document.getElementById("post-content");
    postContent.value += `<img src="${gifURL}" alt="GIF">`;
}

  // app.js (or index.js)

const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Require the path module

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/social_media_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a user schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Middleware for parsing JSON bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Sign-up endpoint
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign-in endpoint
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Sign-in successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// signin.js

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Example of sending a POST request to the server to handle authentication
  fetch('/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => {
    if (response.ok) {
      console.log('Sign-in successful');
      // Redirect to another page or do something else upon successful login
    } else {
      console.error('Sign-in failed');
      // Handle failed login, such as displaying an error message
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// signin.js

function signup() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Example of sending a POST request to the server to handle sign-up
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
      // Redirect to another page or do something else upon successful sign-up
    } else {
      console.error('Sign-up failed');
      // Handle failed sign-up, such as displaying an error message
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
