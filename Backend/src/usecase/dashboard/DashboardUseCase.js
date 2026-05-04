const appointmentRepository = require('../../repository/AppointmentRepository');
const userRepository = require('../../repository/UserRepository');

class DashboardUseCase {
  async getPatientDashboardData(patientId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const latestAppointment = await appointmentRepository.findOne({
      patientId,
      date: { $gte: today },
      status: 'Booked'
    }, {
      sort: { date: 1, time: 1 },
      populate: { path: 'doctorId', select: 'name specialty profilePicture' }
    });

    const recentAppointments = await appointmentRepository.find({
      patientId
    }, {
      sort: { createdAt: -1 },
      limit: 5,
      populate: { path: 'doctorId', select: 'name specialty' }
    });

    const topSpecialists = await userRepository.find({
      role: 'Doctor'
    }, {
      sort: { rating: -1 },
      limit: 5,
      select: 'name specialty profilePicture rating'
    });

    return {
      latestAppointment,
      recentAppointments,
      topSpecialists
    };
  }

  async getAdminDashboardData() {
    const recentDoctors = await userRepository.find({ role: 'Doctor' }, {
      sort: { createdAt: -1 },
      limit: 5,
      select: 'name email specialty createdAt'
    });

    const totalDoctors = await userRepository.countDocuments({ role: 'Doctor' });
    const totalPatients = await userRepository.countDocuments({ role: 'Patient' });
    const totalAppointments = await appointmentRepository.countDocuments({});

    return {
      recentDoctors,
      totalDoctors,
      totalPatients,
      totalAppointments
    };
  }

  async getDoctorDashboardData(doctorId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalAppointments = await appointmentRepository.countDocuments({ doctorId });
    
    const upcomingAppointmentsCount = await appointmentRepository.countDocuments({
      doctorId,
      date: { $gte: today },
      status: { $in: ['Booked', 'Accepted'] }
    });

    const recentAppointments = await appointmentRepository.find({ doctorId }, {
      sort: { createdAt: -1 },
      limit: 5,
      populate: { path: 'patientId', select: 'name email profilePicture' }
    });

    return {
      totalAppointments,
      upcomingAppointmentsCount,
      recentAppointments
    };
  }
}

module.exports = new DashboardUseCase();
