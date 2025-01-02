const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/employee", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const User = mongoose.model("User", userSchema);

// API Route: Signup
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: "User already exists with this email" });
    }

    try {
        // Create a new user instance (no password hashing)
        const newUser = new User({
            username: username,
            email: email,
            password: password, // Store password in plain text
        });

        // Save the user to the database
        await newUser.save();

        // Send success response
        res.status(201).json({ message: 'Signup successful' });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// API Route: Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email, password }); // Simple check (no hashing)
        if (user) {
            res.status(200).json({ message: "Login successful!", user });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Start Server
app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});
