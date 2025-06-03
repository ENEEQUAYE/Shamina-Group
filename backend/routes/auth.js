//backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const user = new User({
            first_name,
            last_name,
            email: email.trim().toLowerCase(),
            password,
        });
        await user.save();
        res.status(201).json({ message: 'Signup successful!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.trim().toLowerCase() });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            'mYv3ry$ecure!SeCr3tKeY1234567890',
            { expiresIn: '1h' }
        );

        // Respond with all required fields
        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                position: user.position,
                role: user.role,
                profilePic: user.profilePic,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Add User Route (Admin Functionality)
// Add User Route (Admin Only)
router.post('/adduser', async (req, res) => {
    try {
        // Validate the request is coming from an admin
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(403).json({ error: "Unauthorized access" });

        const decoded = jwt.verify(token, 'mYv3ry$ecure!SeCr3tKeY1234567890');
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        const { first_name, last_name, email, password, role, position, phone } = req.body;

        // Validate required fields
        if (!first_name || !last_name || !email || !password || !role || !position || !phone) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Ensure role is valid
        if (!['admin', 'staff'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be "admin" or "staff"' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Create and save the new user
        const newUser = new User({
            first_name,
            last_name,
            email: email.trim().toLowerCase(),
            password,
            role,
            position,
            phone,
        });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully!', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
