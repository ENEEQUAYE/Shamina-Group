// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Import route files
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const roomBookingRoutes = require('./routes/roomBookings');
const activityRoutes = require('./routes/activity');
const userRoute = require('./routes/users');
const roomsRoute = require('./routes/rooms');
const guestsRoutes = require('./routes/guests');
const reservationRoutes = require('./routes/reservations');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

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
    process.exit(1); // Exit process with failure
  });

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
