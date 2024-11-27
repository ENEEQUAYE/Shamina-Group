// routes/dashboard.js
const express = require('express');
const RoomBooking = require('../models/RoomBooking');
const Content = require('../models/Content');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Get all bookings (Admin & Staff)
router.get('/bookings', roleMiddleware(['admin', 'staff']), async (req, res) => {
    try {
        const bookings = await RoomBooking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Update content (Admin only)
router.post('/content', roleMiddleware(['admin']), async (req, res) => {
    const { section, content } = req.body;
    try {
        let contentEntry = await Content.findOne({ section });
        if (contentEntry) {
            contentEntry.content = content;
        } else {
            contentEntry = new Content({ section, content });
        }
        await contentEntry.save();
        res.status(200).json({ message: 'Content updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update content' });
    }
});

module.exports = router;
