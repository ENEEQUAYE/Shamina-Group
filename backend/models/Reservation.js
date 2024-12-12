// backend/models/Reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    guestName: { type: String, required: true },
    guestContact: { type: String, required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['reserved', 'canceled', 'checked-in', 'checked-out'], 
        default: 'reserved' 
    },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
