const Appointment = require('../domain/Appointment');
const User = require('../domain/User');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private
const bookAppointment = async (req, res) => {
  const { doctorId, date, time } = req.body;

  try {
    // Prevent past date booking
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({ message: 'Cannot book past dates' });
    }

    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'Doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Prevent double booking
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $ne: 'Cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      time
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'Doctor') {
      query.doctorId = req.user._id;
    }

    if (req.query.filter === 'upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.date = { $gte: today };
    } else if (req.query.filter === 'past') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.date = { $lt: today };
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialty');
      
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify patient owns the appointment
    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'Cancelled';
    const updatedAppointment = await appointment.save();

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status & add notes
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor)
const updateAppointment = async (req, res) => {
  const { status, notes } = req.body;

  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctorId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this appointment' });
    }

    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;

    const updatedAppointment = await appointment.save();

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  updateAppointment
};
