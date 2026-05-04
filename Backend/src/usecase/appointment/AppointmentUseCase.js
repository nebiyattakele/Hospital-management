const appointmentRepository = require('../../repository/AppointmentRepository');

class AppointmentUseCase {
  async bookAppointment(appointmentData) {
    // Check if slot is already taken
    const existing = await appointmentRepository.findOne({
      doctorId: appointmentData.doctorId,
      date: appointmentData.date,
      time: appointmentData.time,
      status: 'Booked'
    });

    if (existing) {
      throw new Error('This slot is already booked');
    }

    return await appointmentRepository.create(appointmentData);
  }

  async getPatientAppointments(patientId) {
    return await appointmentRepository.findByPatientId(patientId);
  }

  async getDoctorAppointments(doctorId) {
    return await appointmentRepository.findByDoctorId(doctorId);
  }

  async cancelAppointment(appointmentId, userId) {
    const appointment = await appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Only patient or doctor can cancel
    const userIdStr = userId.toString();
    if (appointment.patientId._id.toString() !== userIdStr && appointment.doctorId._id.toString() !== userIdStr) {
      throw new Error('Not authorized to cancel this appointment');
    }


    appointment.status = 'Cancelled';
    return await appointment.save();
  }

  async rescheduleAppointment(appointmentId, userId, newDate, newTime) {

    const appointment = await appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.patientId._id.toString() !== userId.toString()) {
      throw new Error('Not authorized to reschedule this appointment');
    }

    // Prevent past date booking
    const bookingDate = new Date(newDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      throw new Error('Cannot book past dates');
    }

    // Prevent double booking
    const existing = await appointmentRepository.findOne({
      doctorId: appointment.doctorId._id,
      date: newDate,
      time: newTime,
      status: { $ne: 'Cancelled' },
      _id: { $ne: appointment._id }
    });

    if (existing) {
      throw new Error('Time slot already booked');
    }

    appointment.date = newDate;
    appointment.time = newTime;
    appointment.status = 'Booked';

    return await appointment.save();
  }
}

module.exports = new AppointmentUseCase();

