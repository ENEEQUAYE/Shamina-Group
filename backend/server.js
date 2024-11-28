const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const roomsRoutes = require('./routes/rooms');
const activityRoutes = require('./routes/activity');
const userRoute = require('./routes/users');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, '..'))); // Serve static files

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/users', userRoute);

// // Custom route for Admin Dashboard
// app.get('/admin-dashboard', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'Admin-dashboard.html'));
// });

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
