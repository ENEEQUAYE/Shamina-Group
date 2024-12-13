// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('../backend/routes/auth');
const appointmentRoutes = require('../backend/routes/appointments');
const roomBookingRoutes = require('../backend/routes/roomBookings');
const activityRoutes = require('../backend/routes/activity');
const userRoute = require('../backend/routes/users');
const roomsRoute = require('../backend/routes/rooms');
const guestsRoutes = require('../backend/routes/guests')
const reservationRoutes = require('../backend/routes/reservations');


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


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => {
      console.error('Error connecting to MongoDB Atlas:', err.message);
      process.exit(1);
  });

// Export the serverless function
module.exports = serverless(app);
