//backend/models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: { type: Number, required: true },
    roomType: { type: String, required: true }, // e.g., "Deluxe", "Suite", "Standard"
    status: { type: String, default: 'available' } // e.g., "available", "occupied"
});

module.exports = mongoose.model('Room', roomSchema);
