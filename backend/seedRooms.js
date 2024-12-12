// backend/seedRooms.js
const mongoose = require('mongoose');
const Room = require('./models/Room'); // Adjust path if necessary
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000 // Timeout after 30 seconds
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if connection fails
});

// Rooms data
const roomsData = [
    ...Array(15).fill(null).map((_, i) => ({
        roomNumber: i + 1,
        roomType: 'Deluxe',
        status: 'Available',
    })),
    ...Array(15).fill(null).map((_, i) => ({
        roomNumber: i + 16,
        roomType: 'Suite',
        status: 'Available',
    })),
    ...Array(15).fill(null).map((_, i) => ({
        roomNumber: i + 31,
        roomType: 'Standard',
        status: 'Available',
    })),
];

// Seed rooms
const seedRooms = async () => {
    try {
        console.log('Seeding rooms...');
        
        // Clear existing data to prevent duplicates
        await Room.deleteMany({});
        console.log('Existing rooms cleared.');

        // Insert new rooms
        const insertedRooms = await Room.insertMany(roomsData);
        console.log(`${insertedRooms.length} rooms seeded successfully.`);

        process.exit(0); // Exit after successful seeding
    } catch (error) {
        console.error('Error seeding rooms:', error);
        process.exit(1); // Exit with failure
    }
};

// Run seeding function
seedRooms();
