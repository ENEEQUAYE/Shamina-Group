const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
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

        res.status(200).json({ 
            message: 'Login successful!', 
            token, 
            role: user.role, 
            first_name: user.first_name // Include first_name in the response
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Add User Route (Admin Functionality)
router.post('/adduser', async (req, res) => {
    try {
        const { first_name, last_name, email, password, role, position } = req.body;

        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists!' });
        }

        const user = new User({
            first_name,
            last_name,
            email: email.trim().toLowerCase(),
            password,
            role,
            position,
        });
        await user.save();
        res.status(201).json({ message: 'User added successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
