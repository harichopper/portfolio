const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3019;
const path = require('path');

// Enable CORS for deployed frontend
app.use(cors({
    origin: 'https://portfolio-wybb.onrender.com', // Replace with your deployed frontend URL
    methods: ['GET', 'POST']
}));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection string
const uri = "mongodb+srv://haricdonh:hari5678@haricluster.0tsnw.mongodb.net/";
const client = new MongoClient(uri);
const dbName = "portfolio_website";
const collectionName = "messages";

app.post('/contact', async (req, res) => {
    const { Name, email, message } = req.body;

    // Check if all required fields are provided
    if (!Name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    try {
        // Connect to MongoDB
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Insert the form data into the database
        const result = await collection.insertOne({
            name: Name,
            email: email,
            message: message,
            created_at: new Date()
        });

        // Respond with success
        res.status(200).json({ success: 'Message saved successfully!', id: result.insertedId });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error in /contact route:', error);

        // Respond with a detailed error message
        res.status(500).json({
            error: 'Failed to save the message.',
            details: error.message // Send the error details back in the response
        });
    } finally {
        // Always close the connection to MongoDB
        await client.close();
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
