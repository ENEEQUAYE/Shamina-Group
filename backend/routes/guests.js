// backend/routes/guests.js
const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');
const Room = require('../models/Room');

// Get all checked-in guests
router.get('/checked-in', async (req, res) => {
    try {
        const guests = await Guest.find({ status: 'checked-in' }).populate('roomId');
        res.status(200).json(guests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch checked-in guests', error });
    }
});

// Check-out a guest
router.patch('/check-out/:id', async (req, res) => {
    const guestId = req.params.id;
    console.log(`Check-out request received for guest ID: ${guestId}`);

    try {
        const guest = await Guest.findById(guestId);
        if (!guest) {
            console.error(`Guest with ID ${guestId} not found.`);
            return res.status(404).json({ message: 'Guest not found' });
        }

        if (guest.status === 'checked-out') {
            console.error(`Guest with ID ${guestId} is already checked out.`);
            return res.status(400).json({ message: 'Guest is already checked out' });
        }

        guest.status = 'checked-out';
        guest.checkOutDate = new Date();
        await guest.save();
        console.log(`Guest ${guestId} checked out successfully.`);

        const room = await Room.findById(guest.roomId);
        if (room) {
            room.status = 'Available';
            await room.save();
            console.log(`Room ${room._id} marked as available.`);
        }

        res.status(200).json({ message: 'Guest checked out successfully' });
    } catch (error) {
        console.error('Error during check-out:', error);
        res.status(500).json({ message: 'Failed to check out guest', error });
    }
});

// Get all guests for history (checked-in and checked-out)
router.get('/history', async (req, res) => {
    try {
        const guests = await Guest.find().populate('roomId');
        res.status(200).json(guests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch guest history', error });
    }
});


module.exports = router;
