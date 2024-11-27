const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const roomsRoutes = require('./routes/rooms');
const activityRoutes = require('./routes/activity')
const userRoute = require('./routes/users');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/users', userRoute);

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
