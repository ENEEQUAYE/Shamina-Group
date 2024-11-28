const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const nodemailer = require('nodemailer');

router.post('/book', async (req, res) => {
    const { activityDate, activityType, numberOfGuests, name, email, phone, specialRequests } = req.body;

    try {
        // Save booking to the database
        const activity = new Activity({ activityDate, activityType, numberOfGuests, name, email, phone, specialRequests });
        await activity.save();

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
            subject: 'Activity Booking Confirmation',
            html: `
                <h1>Booking Confirmation</h1>
                <p>Dear ${name},</p>
                <p>Your activity booking has been received:</p>
                <ul>
                    <li><strong>Date:</strong> ${activityDate}</li>
                    <li><strong>Activities:</strong> ${activityType.join(', ')}</li>
                    <li><strong>Guests:</strong> ${numberOfGuests}</li>
                    <li><strong>Special Requests:</strong> ${specialRequests || 'None'}</li>
                </ul>
                <br>
                <p>Our representative will reach out to you for further details and payment method</p>
                <p>Thank you for choosing our hotel!</p>
                <br>
                <p>Best Regards,<br>Hotel Management</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Activity booking confirmed, confirmation email sent.' });
    } catch (error) {
        console.error('Error booking activity:', error);
        res.status(500).json({ error: 'Failed to book activity. Please try again.' });
    }
});

// Get all activity bookings
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Activity.find().sort({ createdAt: -1 }); // Fetch bookings sorted by creation date
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching activity bookings:', error);
        res.status(500).json({ error: 'Failed to fetch activity bookings. Please try again.' });
    }
});

// Delete an activity booking
router.delete('/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Activity.findByIdAndDelete(id);
        res.status(200).json({ message: 'Booking deleted successfully!' });
    } catch (error) {
        console.error('Error deleting activity booking:', error);
        res.status(500).json({ error: 'Failed to delete booking. Please try again.' });
    }
});



module.exports = router;
