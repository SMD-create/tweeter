// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection URI
const MONGODB_URI = 'mongodb://0.0.0.0:27017/social_media_app';

// Connect to MongoDB using MongoClient
const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("MongoDB database connection established successfully");

    // Define a user schema
    const userSchema = new mongoose.Schema({
      username: String,
      email: String,
      password: String,
    });

    // Create a User model
    const User = mongoose.model('User', userSchema);

    // Middleware to parse JSON request bodies
    app.use(express.json());

    // Route for signing up a new user
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Call the function to connect to MongoDB
connectToMongoDB();
