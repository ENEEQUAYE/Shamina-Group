// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const roomBookingRoutes = require('./routes/roomBookings');
const activityRoutes = require('./routes/activity');
const userRoute = require('./routes/users');
const roomsRoute = require('./routes/rooms');
const guestsRoutes = require('./routes/guests')
const reservationRoutes = require('./routes/reservations');


require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/roomBooking', roomBookingRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/users', userRoute);
app.use('/api/rooms', roomsRoute);
app.use('/api/guests', guestsRoutes);
app.use('/api/reservations', reservationRoutes);


// MongoDB connection and server startup
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB Atlas');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error.message);
        process.exit(1);
    }
};

startServer();
