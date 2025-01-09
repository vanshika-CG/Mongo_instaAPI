const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "test";

// Middleware
app.use(express.json());

let db, posts;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
      
        followers = db.collection("followers");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes

// GET: Fetch all comments for a specific post
app.get('/users/:userId/followers', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Query the followers collection for all records where the userId matches the followingId
        const userFollowers = await followers.find({ followingId: userId }).toArray();

        if (userFollowers.length === 0) {
            return res.status(404).send("No followers found for this user");
        }

        // Extract followerId from the query result and return it
        const followerIds = userFollowers.map(follower => follower.followerId);

        res.status(200).json(followerIds); // Return the list of followerIds
    } catch (err) {
        res.status(500).send("Error fetching followers: " + err.message);
    }
});



// POST: Add a new users
app.post('/followers', async (req, res) => {
    try {
        const newfollowers = req.body;
        const result = await followers.insertOne(newfollowers);
        res.status(201).send(`posts added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding posts: " + err.message);
    }
});




// DELETE: Remove a student
app.delete('/followers/:followerId', async (req, res) => {
    try {
        const followerId = (req.params.followerId);
        const result = await followers.deleteOne({ followerId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting student: " + err.message);
    }
});






