const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  updateAppointment,
  rescheduleAppointment
} = require('../controllers/appointmentController');
const { protect, doctor, patient } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, patient, bookAppointment)
  .get(protect, getAppointments);

router.put('/:id/cancel', protect, patient, cancelAppointment);
router.put('/:id/reschedule', protect, patient, rescheduleAppointment);
router.put('/:id/status', protect, doctor, updateAppointment);

module.exports = router;
