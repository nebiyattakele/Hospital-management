import { apiClient } from "./httpClient";

function getDoctorDashboardStats() {
  return apiClient.get("/dashboard/doctor");
}

function getDoctorAppointments() {
  return apiClient.get("/appointments");
}

function updateAppointmentStatus(appointmentId, payload) {
  return apiClient.put(`/appointments/${appointmentId}/status`, payload);
}

function getDoctorNotifications() {
  return apiClient.get("/notifications");
}

function getDoctorProfile() {
  return apiClient.get("/auth/profile");
}

function updateDoctorProfile(payload) {
  return apiClient.put("/auth/profile", payload);
}

export {
  getDoctorAppointments,
  getDoctorDashboardStats,
  getDoctorNotifications,
  getDoctorProfile,
  updateAppointmentStatus,
  updateDoctorProfile,
};
