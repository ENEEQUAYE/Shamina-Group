// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    position: { type: String, default: 'N/A' },
    role: { type: String, enum: ['admin', 'staff', 'customer'], default: 'customer' },
    phone: { type: String, default: null },
    profilePic: { type: String, default: 'img/user.jpg' },
}, { timestamps: true });


// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);
