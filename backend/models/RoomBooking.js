const mongoose = require('mongoose');

const RoomBookingSchema = new mongoose.Schema(
    {
        checkinDate: { type: Date, required: true },
        checkoutDate: { type: Date, required: true },
        roomType: { type: String, required: true },
        numberOfGuests: { type: Number, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        specialRequests: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('RoomBooking', RoomBookingSchema);
