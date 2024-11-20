const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = 30019;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection string
const uri = "mongodb+srv://haricdonh:hari5678@haricluster.0tsnw.mongodb.net/";
const client = new MongoClient(uri);

// Database and Collection
const dbName = "portfolio_website";
const collectionName = "messages";

// Serve the HTML file on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/contact', async (req, res) => {
    const { Name, email, message } = req.body;

    if (!Name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const result = await collection.insertOne({
            name: Name,
            email: email,
            message: message,
            created_at: new Date()
        });

        res.status(200).json({ success: 'Message saved successfully!', id: result.insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save the message.' });
    } finally {
        await client.close();
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
