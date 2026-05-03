const Appointment = require('../domain/Appointment');

class AppointmentRepository {
  async findById(id) {
    return await Appointment.findById(id).populate('patientId doctorId');
  }

  async findByPatientId(patientId) {
    return await Appointment.find({ patientId }).populate('doctorId', 'name specialty');
  }

  async findByDoctorId(doctorId) {
    return await Appointment.find({ doctorId }).populate('patientId', 'name email profilePicture');
  }

  async create(appointmentData) {
    return await Appointment.create(appointmentData);
  }

  async update(id, updateData) {
    return await Appointment.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Appointment.findByIdAndDelete(id);
  }

  async countDocuments(query) {
    return await Appointment.countDocuments(query);
  }

  async findOne(query, options = {}) {
    let q = Appointment.findOne(query);
    if (options.sort) q = q.sort(options.sort);
    if (options.populate) q = q.populate(options.populate);
    return await q;
  }


  async find(query, options = {}) {
    let q = Appointment.find(query);
    if (options.sort) q = q.sort(options.sort);
    if (options.limit) q = q.limit(options.limit);
    if (options.populate) q = q.populate(options.populate);
    return await q;
  }
}

module.exports = new AppointmentRepository();
