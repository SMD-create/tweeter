const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();
const PORT = 4000; // Choose your desired port
const mongoURI = 'mongodb://0.0.0.0:27017/social_media_app'; // MongoDB connection URI

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for user data
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to handle login requests
app.post('/login', async (req, res) => {
  try {
    // Extract data from request body
    const { username, password } = req.body;

    // Check if user exists in the database
    const user = await User.findOne({ username, password });

    if (user) {
      // User found, send success response
      res.status(200).json({ message: 'Login successful' });
    } else {
      // User not found, send error response
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to handle signup form submission
app.post('/signup', async (req, res) => {
  try {
    // Extract data from request body
    const { username, email, password } = req.body;

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password, // Remember to hash the password before saving it
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: 'User signed up successfully' });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Load data from JSON file
const data = JSON.parse(fs.readFileSync('data.json'));

// POST route to add a new tweet
app.post('/tweets', (req, res) => {
  const newTweet = req.body;
  data.tweets.push(newTweet);
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  res.json(newTweet);
});

// GET route to fetch all tweets
app.get('/tweets', (req, res) => {
  res.json(data.tweets);
});
