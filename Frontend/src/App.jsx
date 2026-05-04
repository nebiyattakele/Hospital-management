import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminDoctorFormPage from "./pages/admin/AdminDoctorFormPage";
import AdminDoctorsPage from "./pages/admin/AdminDoctorsPage";
import DoctorAppointmentsPage from "./pages/doctor/DoctorAppointmentsPage";
import DoctorDashboardPage from "./pages/doctor/DoctorDashboardPage";
import DoctorSettingsPage from "./pages/doctor/DoctorSettingsPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import PatientAppointmentBookingPage from "./pages/patient/PatientAppointmentBookingPage";
import PatientAppointmentsPage from "./pages/patient/PatientAppointmentsPage";
import PatientDashboardPage from "./pages/patient/PatientDashboardPage";
import PatientDoctorDetailsPage from "./pages/patient/PatientDoctorDetailsPage";
import PatientDoctorsPage from "./pages/patient/PatientDoctorsPage";
import PatientNotificationsPage from "./pages/patient/PatientNotificationsPage";
import PatientSettingsPage from "./pages/patient/PatientSettingsPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/doctors"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientDoctorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/doctors/:doctorId"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientDoctorDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientAppointmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments/new"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientAppointmentBookingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/settings"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/notifications"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientNotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorAppointmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDoctorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors/new"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDoctorFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors/:doctorId/edit"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDoctorFormPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
