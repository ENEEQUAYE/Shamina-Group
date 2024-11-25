const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    activityDate: { type: Date, required: true },
    activityType: { type: [String], required: true }, // Array for multiple activities
    numberOfGuests: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    specialRequests: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);
