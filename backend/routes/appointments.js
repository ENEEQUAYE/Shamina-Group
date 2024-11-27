const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const nodemailer = require('nodemailer');

// POST: Book an Appointment
router.post('/', async (req, res) => {
    const { consultancy_type, first_name, last_name, email, phone, date, time, message } = req.body;

    try {
        // Save appointment to the database
        const appointment = new Appointment({
            consultancy_type,
            first_name,
            last_name,
            email,
            phone,
            date,
            time,
            message,
        });
        await appointment.save();

        // Configure email transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // Your email password
            },
        });

        // User email
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Appointment Confirmation',
            html: `
                <h1>Appointment Confirmation</h1>
                <p>Dear ${first_name} ${last_name},</p>
                <p>Thank you for booking an appointment with us. Here are your appointment details:</p>
                <ul>
                    <li><strong>Consultancy Type:</strong> ${consultancy_type}</li>
                    <li><strong>Date:</strong> ${date}</li>
                    <li><strong>Time:</strong> ${time}</li>
                    <li><strong>Message:</strong> ${message}</li>
                </ul>
                <p>We will reach out to you shortly.</p>
            `,
        };

        // Admin email
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Appointment Booking',
            html: `
                <h1>New Appointment Notification</h1>
                <p>A new appointment has been booked. Here are the details:</p>
                <ul>
                    <li><strong>Consultancy Type:</strong> ${consultancy_type}</li>
                    <li><strong>First Name:</strong> ${first_name}</li>
                    <li><strong>Last Name:</strong> ${last_name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Phone:</strong> ${phone}</li>
                    <li><strong>Date:</strong> ${date}</li>
                    <li><strong>Time:</strong> ${time}</li>
                    <li><strong>Message:</strong> ${message}</li>
                </ul>
            `,
        };

        // Send both emails
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);

        res.status(201).json({ message: 'Appointment booked successfully, confirmation emails sent.' });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ error: 'Failed to book appointment. Please try again.' });
    }
});


// GET all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Cancel an appointment
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Appointment.findByIdAndDelete(id);
        res.status(200).json({ message: 'Appointment canceled successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
