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
