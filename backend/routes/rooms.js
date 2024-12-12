// backend/routes/rooms.js
const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Guest = require('../models/Guest');

// Get all rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch rooms', error });
    }
});

// Get room by ID
router.get('/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
            }
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch room', error });
    }
});


// Check-in a guest with validations
router.post('/check-in', async (req, res) => {
    const { guestName, guestContact, guestID, roomId, checkInDate } = req.body;

    if (!guestName || !guestContact || !guestID || !roomId || !checkInDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        if (room.status !== 'Available') {
            return res.status(400).json({ message: 'Room is not available for check-in' });
        }

        // Update room status
        room.status = 'Occupied';
        await room.save();

        // Save guest details
        const newGuest = new Guest({ guestName, guestContact, guestID, roomId, checkInDate });
        await newGuest.save();

        res.status(200).json({ message: 'Guest checked in successfully', guest: newGuest });
    } catch (error) {
        res.status(500).json({ message: 'Check-in failed', error });
    }
});

module.exports = router;
