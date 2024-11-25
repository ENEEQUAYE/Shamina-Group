const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    consultancy_type: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
