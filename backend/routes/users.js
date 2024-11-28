//backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users - Fetch all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude the password field
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, role } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { first_name, last_name, email, role },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
