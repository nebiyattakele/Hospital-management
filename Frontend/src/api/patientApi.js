import { apiClient } from "./httpClient";

function getPatientDashboardData() {
  return apiClient.get("/dashboard/patient");
}

function getPatientProfile() {
  return apiClient.get("/auth/profile");
}

function updatePatientProfile(payload) {
  return apiClient.put("/auth/profile", payload);
}

function getDoctors(specialty = "") {
  const query = specialty ? `?specialty=${encodeURIComponent(specialty)}` : "";
  return apiClient.get(`/doctors${query}`);
}

function getDoctorDetails(doctorId) {
  return apiClient.get(`/doctors/${doctorId}`);
}

function bookAppointment(payload) {
  return apiClient.post("/appointments", payload);
}

function getAppointmentAvailableSlots(doctorId, date, excludeAppointmentId) {
  const params = new URLSearchParams({
    doctorId,
    date,
  });
  if (excludeAppointmentId) {
    params.set("excludeAppointmentId", excludeAppointmentId);
  }
  return apiClient.get(`/appointments/slots?${params.toString()}`);
}

function getMyAppointments() {
  return apiClient.get("/appointments");
}

function rescheduleAppointment(appointmentId, payload) {
  return apiClient.put(`/appointments/${appointmentId}/reschedule`, payload);
}

function cancelAppointment(appointmentId) {
  return apiClient.put(`/appointments/${appointmentId}/cancel`, {});
}

function getPatientNotifications() {
  return apiClient.get("/notifications");
}

function markNotificationAsRead(notificationId) {
  return apiClient.put(`/notifications/${notificationId}/read`, {});
}

function forgotPassword(email) {
  return apiClient.post("/auth/forgot-password", { email });
}

function resetPassword(email, newPassword) {
  return apiClient.post("/auth/reset-password", { email, newPassword });
}

export {
  bookAppointment,
  getAppointmentAvailableSlots,
  cancelAppointment,
  forgotPassword,
  getDoctorDetails,
  getDoctors,
  getMyAppointments,
  getPatientDashboardData,
  getPatientNotifications,
  getPatientProfile,
  markNotificationAsRead,
  rescheduleAppointment,
  resetPassword,
  updatePatientProfile,
};
