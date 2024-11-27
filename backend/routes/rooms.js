//routes/rooms.js
const express = require('express');
const router = express.Router();
const RoomBooking = require('../models/RoomBooking');
const nodemailer = require('nodemailer');

router.post('/book', async (req, res) => {
    const { checkinDate, checkoutDate, roomType, numberOfGuests, name, email, phone, specialRequests } = req.body;

    try {
        // Save booking to the database
        const booking = new RoomBooking({
            checkinDate,
            checkoutDate,
            roomType,
            numberOfGuests,
            name,
            email,
            phone,
            specialRequests,
        });
        await booking.save();

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Room Booking Confirmation',
            html: `
                <h1>Booking Confirmation</h1>
                <p>Dear ${name},</p>
                <p>Your room booking has been confirmed:</p>
                <ul>
                    <li><strong>Check-in Date:</strong> ${checkinDate}</li>
                    <li><strong>Check-out Date:</strong> ${checkoutDate}</li>
                    <li><strong>Room Type:</strong> ${roomType}</li>
                    <li><strong>Guests:</strong> ${numberOfGuests}</li>
                    <li><strong>Special Requests:</strong> ${specialRequests || 'None'}</li>
                </ul>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Room booking confirmed, confirmation email sent.' });
    } catch (error) {
        console.error('Error booking room:', error);
        res.status(500).json({ error: 'Failed to book room. Please try again.' });
    }
});

// GET all room bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await RoomBooking.find();
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
