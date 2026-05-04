const appointmentUseCase = require('../usecase/appointment/AppointmentUseCase');
const appointmentRepository = require('../repository/AppointmentRepository');
const notificationRepository = require('../repository/NotificationRepository');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private
// @desc    Get available time slots for a doctor on a calendar date
// @route   GET /api/appointments/slots (alias: /api/appointments/available-slots)
// @access  Private / Patient
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date, excludeAppointmentId } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ message: 'doctorId and date query parameters are required' });
    }

    const slots = await appointmentUseCase.getAvailableSlotsForDoctor(doctorId, date, {
      excludeAppointmentId: excludeAppointmentId || undefined
    });
    res.json(slots);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      patientId: req.user._id
    };
    const appointment = await appointmentUseCase.bookAppointment(appointmentData);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

    // Filter logic... (kept simplified for brevity or can be moved to usecase)
    const appointments = await appointmentRepository.find(query, {
      populate: [
        { path: 'patientId', select: 'name email' },
        { path: 'doctorId', select: 'name specialty' }
      ]
    });
      
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
    const updatedAppointment = await appointmentUseCase.cancelAppointment(req.params.id, req.user._id);
    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update appointment status & add notes
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor)
const updateAppointment = async (req, res) => {
  const { status, notes } = req.body;

  try {
    const appointment = await appointmentRepository.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctorId._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this appointment' });
    }

    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;

    const updatedAppointment = await appointment.save();

    // Create notification if status changed
    if (status === 'Rejected' || status === 'Accepted') {
      await notificationRepository.create({
        recipientId: appointment.patientId,
        message: `Your appointment on ${new Date(appointment.date).toDateString()} at ${appointment.time} has been ${status.toLowerCase()}.`,
        type: `Appointment${status}`,
        relatedId: appointment._id
      });
    }

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private
const rescheduleAppointment = async (req, res) => {
  const { date, time } = req.body;
  try {
    const updated = await appointmentUseCase.rescheduleAppointment(
      req.params.id, 
      req.user._id, 
      date, 
      time
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
  getAvailableSlots,
  bookAppointment,
  getAppointments,
  cancelAppointment,
  updateAppointment,
  rescheduleAppointment
};

