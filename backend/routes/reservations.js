// backend/routes/reservations.js
const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Room = require('../models/Room');

// Create a new reservation
router.post('/create', async (req, res) => {
    const { guestName, guestContact, roomId, checkInDate, checkOutDate } = req.body;

    if (!guestName || !guestContact || !roomId || !checkInDate || !checkOutDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        if (room.status !== 'Available') {
            return res.status(400).json({ message: 'Room is not available for reservation' });
        }

        // Create a reservation
        const newReservation = new Reservation({
            guestName,
            guestContact,
            roomId,
            checkInDate,
            checkOutDate,
        });

        await newReservation.save();

        // Mark room as reserved
        room.status = 'Reserved';
        await room.save();

        res.status(200).json({ message: 'Reservation created successfully', reservation: newReservation });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create reservation', error });
    }
});

// Get all reservations
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.find().populate('roomId');
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch reservations', error });
    }
});

// Cancel a reservation
router.patch('/cancel/:id', async (req, res) => {
    const reservationId = req.params.id;

    try {
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

        if (reservation.status === 'cancelled') {
            return res.status(400).json({ message: 'Reservation already cancelled' });
        }

        reservation.status = 'cancelled';
        await reservation.save();

        // Mark room as available
        const room = await Room.findById(reservation.roomId);
        if (room) {
            room.status = 'Available';
            await room.save();
        }

        res.status(200).json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to cancel reservation', error });
    }
});

module.exports = router;
