const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile-pics/'); // Store files in 'profile-pics' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
            return cb(new Error('Only .jpg, .jpeg, and .png files are allowed'));
        }
        cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 } // Limit file size to 2MB
});

// PUT /api/users/update-profile-pic - Update user profile picture
router.put('/update-profile-pic', upload.single('profilePic'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user.id; // Assuming you are using JWT authentication
    const profilePicUrl = `/uploads/profile-pics/${req.file.filename}`;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { profilePic: profilePicUrl },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ profilePic: profilePicUrl }); // Return the URL of the uploaded image
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


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

// PUT /api/users/:id - Update user details
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, role, position, phone } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { first_name, last_name, email, role, position, phone },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/users/:id - Delete user
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
