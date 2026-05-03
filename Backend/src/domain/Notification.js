const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['AppointmentRejected', 'AppointmentAccepted', 'General'], default: 'General' },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // e.g., Appointment ID
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
