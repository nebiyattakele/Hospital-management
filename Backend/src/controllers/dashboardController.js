const Appointment = require('../domain/Appointment');
const User = require('../domain/User');

// @desc    Get patient dashboard data
// @route   GET /api/dashboard/patient
// @access  Private (Patient)
const getPatientDashboardData = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Fetch latest appointment (nearest upcoming)
    const latestAppointment = await Appointment.findOne({
      patientId: req.user._id,
      date: { $gte: today },
      status: 'Booked'
    })
    .sort({ date: 1, time: 1 })
    .populate('doctorId', 'name specialty profilePicture');

    // 2. Fetch recent appointments (last 5, excluding the latest one if possible, or just the most recent ones)
    const recentAppointments = await Appointment.find({
      patientId: req.user._id
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('doctorId', 'name specialty');

    // 3. Fetch top specialists (doctors with highest ratings)
    const topSpecialists = await User.find({
      role: 'Doctor'
    })
    .sort({ rating: -1 })
    .limit(5)
    .select('name specialty profilePicture rating');

    res.json({
      latestAppointment,
      recentAppointments,
      topSpecialists
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin dashboard data
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
const getAdminDashboardData = async (req, res) => {
  try {
    // 1. Fetch recent doctors (last 5 added)
    const recentDoctors = await User.find({ role: 'Doctor' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email specialty createdAt');

    // 2. Fetch total number of doctors
    const totalDoctors = await User.countDocuments({ role: 'Doctor' });

    // 3. Fetch total number of patients
    const totalPatients = await User.countDocuments({ role: 'Patient' });

    // 4. Fetch total appointments
    const totalAppointments = await Appointment.countDocuments();

    res.json({
      recentDoctors,
      totalDoctors,
      totalPatients,
      totalAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor dashboard data
// @route   GET /api/dashboard/doctor
// @access  Private (Doctor)
const getDoctorDashboardData = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Total appointments for this doctor
    const totalAppointments = await Appointment.countDocuments({ doctorId: req.user._id });

    // 2. Total upcoming appointments
    const upcomingAppointmentsCount = await Appointment.countDocuments({
      doctorId: req.user._id,
      date: { $gte: today },
      status: 'Booked'
    });

    // 3. Recent appointments (last 5)
    const recentAppointments = await Appointment.find({ doctorId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('patientId', 'name email profilePicture');

    res.json({
      totalAppointments,
      upcomingAppointmentsCount,
      recentAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPatientDashboardData, getAdminDashboardData, getDoctorDashboardData };
