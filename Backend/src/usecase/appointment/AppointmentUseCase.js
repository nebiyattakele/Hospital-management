const mongoose = require('mongoose');
const appointmentRepository = require('../../repository/AppointmentRepository');
const userRepository = require('../../repository/UserRepository');

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

function normalizeSlotTime(value) {
  const m = /^(\d{1,2}):(\d{2})/.exec(String(value || '').trim());
  if (!m) return null;
  const hour = Math.min(23, Math.max(0, parseInt(m[1], 10)));
  const minute = Math.min(59, Math.max(0, parseInt(m[2], 10)));
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function normalizeDayName(value) {
  const s = String(value || '').trim().toLowerCase();
  if (!s) return '';
  for (const name of WEEKDAY_NAMES) {
    const nl = name.toLowerCase();
    if (nl === s || nl.startsWith(s) || s.startsWith(nl.slice(0, 3))) {
      return nl;
    }
  }
  return s;
}

function weekdayKeyFromYYYYMMDD(isoDateOnly) {
  const match = isoDateOnly && String(isoDateOnly).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const y = Number(match[1]);
  const mo = Number(match[2]);
  const d = Number(match[3]);
  const local = new Date(y, mo - 1, d);
  const idx = local.getDay();
  return WEEKDAY_NAMES[idx].toLowerCase();
}

function utcExclusiveDayBounds(isoDateOnly) {
  const start = new Date(`${isoDateOnly}T00:00:00.000Z`);
  const endExclusive = new Date(start);
  endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);
  return { start, endExclusive };
}

function getLocalYYYYMMDD(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isSlotInPastForLocalCalendar(isoDateOnly, slotTime, now = new Date()) {
  if (isoDateOnly !== getLocalYYYYMMDD(now)) return false;
  const normalizedTime = normalizeSlotTime(slotTime);
  if (!normalizedTime) return true;
  const [y, m, d] = isoDateOnly.split('-').map(Number);
  const [hour, minute] = normalizedTime.split(':').map(Number);
  const slotDate = new Date(y, m - 1, d, hour, minute, 0, 0);
  return slotDate < now;
}

/** Step between bookable start times when doctor configures availability as ranges. */
const BOOKING_SLOT_STEP_MINUTES = 30;

function minutesFromNormalizedTime(normalizedHHMM) {
  if (!normalizedHHMM) return null;
  const [h, min] = normalizedHHMM.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(min)) return null;
  return h * 60 + min;
}

function expandRangesToSlots(ranges, stepMinutes = BOOKING_SLOT_STEP_MINUTES) {
  const out = new Set();
  for (const r of ranges || []) {
    const start = minutesFromNormalizedTime(normalizeSlotTime(r?.start));
    const end = minutesFromNormalizedTime(normalizeSlotTime(r?.end));
    if (start == null || end == null || end <= start) {
      continue;
    }
    for (let t = start; t < end; t += stepMinutes) {
      const h = Math.floor(t / 60);
      const m = t % 60;
      out.add(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return [...out].sort();
}

class AppointmentUseCase {
  async getAvailableSlotsForDoctor(doctorId, dateStr, options = {}) {
    const iso = String(dateStr || '').trim();
    if (!iso.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new Error('Invalid date; use YYYY-MM-DD format');
    }

    const doctor = await userRepository.findById(doctorId);
    if (!doctor || doctor.role !== 'Doctor') {
      throw new Error('Doctor not found');
    }

    const dowKey = weekdayKeyFromYYYYMMDD(iso);
    if (!dowKey) {
      throw new Error('Invalid date');
    }

    const availability = doctor.availability || [];
    const dayBlock = availability.find((entry) => normalizeDayName(entry.day) === dowKey);
    const fromRanges = expandRangesToSlots(dayBlock?.ranges || []);
    const fromLegacySlots = (Array.isArray(dayBlock?.slots) ? dayBlock.slots : [])
      .map(normalizeSlotTime)
      .filter(Boolean);

    const normalizedConfigured = [...new Set([...fromRanges, ...fromLegacySlots])].sort();

    const dayDisplay = WEEKDAY_NAMES.find((n) => n.toLowerCase() === dowKey) || dowKey;

    if (!normalizedConfigured.length) {
      return {
        date: iso,
        dayOfWeek: dayDisplay,
        slots: [],
        configuredForDay: false
      };
    }

    const { start, endExclusive } = utcExclusiveDayBounds(iso);

    const busyQuery = {
      doctorId,
      date: { $gte: start, $lt: endExclusive },
      status: { $in: ['Booked', 'Accepted'] }
    };

    const excludeId = options.excludeAppointmentId;
    if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
      busyQuery._id = { $ne: excludeId };
    }

    const busyAppointments = await appointmentRepository.find(busyQuery);
    const busyTimes = new Set(
      busyAppointments.map((a) => normalizeSlotTime(a.time)).filter(Boolean)
    );

    let availableSlots = normalizedConfigured.filter((t) => !busyTimes.has(t));
    availableSlots = availableSlots.filter((t) => !isSlotInPastForLocalCalendar(iso, t));

    return {
      date: iso,
      dayOfWeek: dayDisplay,
      slots: availableSlots,
      configuredForDay: true
    };
  }

  async bookAppointment(appointmentData) {
    const normalizedTime = normalizeSlotTime(appointmentData.time);
    if (!normalizedTime) {
      throw new Error('Invalid time format');
    }
    appointmentData.time = normalizedTime;

    const { slots } = await this.getAvailableSlotsForDoctor(
      appointmentData.doctorId,
      appointmentData.date
    );

    if (!slots.length || !slots.includes(normalizedTime)) {
      throw new Error('Selected time is not available for this doctor and date');
    }

    const existing = await appointmentRepository.findOne({
      doctorId: appointmentData.doctorId,
      date: appointmentData.date,
      time: normalizedTime,
      status: { $in: ['Booked', 'Accepted'] }
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
    const normalizedNewTime = normalizeSlotTime(newTime);
    if (!normalizedNewTime) {
      throw new Error('Invalid time format');
    }

    const { slots } = await this.getAvailableSlotsForDoctor(appointment.doctorId._id, newDate, {
      excludeAppointmentId: appointment._id
    });

    if (!slots.length || !slots.includes(normalizedNewTime)) {
      throw new Error('Selected time is not available for this doctor and date');
    }

    const existing = await appointmentRepository.findOne({
      doctorId: appointment.doctorId._id,
      date: newDate,
      time: normalizedNewTime,
      status: { $in: ['Booked', 'Accepted'] },
      _id: { $ne: appointment._id }
    });

    if (existing) {
      throw new Error('Time slot already booked');
    }

    appointment.date = newDate;
    appointment.time = normalizedNewTime;
    appointment.status = 'Booked';

    return await appointment.save();
  }
}

module.exports = new AppointmentUseCase();

