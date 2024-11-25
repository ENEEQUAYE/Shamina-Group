const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ first_name, last_name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id, first_name: user.first_name }, 'mYv3ry$ecure!SeCr3tKeY1234567890', { expiresIn: '1h' });
        res.status(200).json({ token, first_name: user.first_name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
