import { apiClient } from "./httpClient";

function getAdminDashboardOverview() {
  return apiClient.get("/dashboard/admin");
}

function getAllDoctors() {
  return apiClient.get("/doctors");
}

function getDoctorById(doctorId) {
  return apiClient.get(`/doctors/${doctorId}`);
}

function createDoctor(payload) {
  return apiClient.post("/doctors", payload);
}

function updateDoctor(doctorId, payload) {
  return apiClient.put(`/doctors/${doctorId}`, payload);
}

function deleteDoctor(doctorId) {
  return apiClient.delete(`/doctors/${doctorId}`);
}

export {
  createDoctor,
  deleteDoctor,
  getAdminDashboardOverview,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
};
