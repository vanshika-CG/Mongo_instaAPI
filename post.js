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
        posts = db.collection("posts");

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

// GET: List all users
app.get('/posts', async (req, res) => {
    try {
        const allposts = await posts.find().toArray();
        res.status(200).json(allposts);
    } catch (err) {
        res.status(500).send("Error fetching students: " + err.message);
    }
});

// GET: List all users using id

app.get('/posts/:postId', async (req, res) => {
    try {
        const allpostId = await posts.find().toArray();
        res.status(200).json(allpostId);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});

// POST: Add a new users
app.post('/posts', async (req, res) => {
    try {
        const newposts = req.body;
        const result = await posts.insertOne(newposts);
        res.status(201).send(`posts added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding posts: " + err.message);
    }
});


// PATCH: Partially update a student
app.patch('/posts/:postId/caption', async (req, res) => {
    try {
        const postId = req.params.postId; 
        const newCaption = req.body.caption; 

        const result = await posts.updateOne(
            { postId: postId },
            { $set: { caption: newCaption } } 
        );

        if (result.matchedCount === 0) {
            return res.status(404).send("Post not found");
        }

        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating post: " + err.message);
    }
});


// DELETE: Remove a student
app.delete('/posts/:postId', async (req, res) => {
    try {
        const postId = (req.params.postId);
        const result = await posts.deleteOne({ postId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting student: " + err.message);
    }
});






