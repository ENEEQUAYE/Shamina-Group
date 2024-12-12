// backend/models/Guest.js
const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    guestName: { type: String, required: true },
    guestContact: { type: String, required: true },
    guestID: { type: String, required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date }, // Optional, for check-out logic later
    status: { type: String, default: 'checked-in' }, // e.g., 'checked-in', 'checked-out'
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);
