import { Link } from "react-router-dom";
import AdminPortalLayout from "../../features/admin/AdminPortalLayout";
import useAdminPortal, { getDoctorRecordId } from "../../features/admin/useAdminPortal";

function AdminDashboardPage() {
  const { error, isLoading, message, overview, totalDoctorsCount } = useAdminPortal();

  return (
    <AdminPortalLayout
      error={error}
      isLoading={isLoading}
      message={message}
      title="Admin Dashboard"
    >
      <section className="doctor-kpis">
        <article className="white-panel kpi-card">
          <small>Total Doctors</small>
          <strong>{totalDoctorsCount}</strong>
        </article>
        <article className="white-panel kpi-card">
          <small>Total Patients</small>
          <strong>{overview.totalPatients || 0}</strong>
        </article>
        <article className="white-panel kpi-card">
          <small>Total Appointments</small>
          <strong>{overview.totalAppointments || 0}</strong>
        </article>
      </section>

      <article className="white-panel admin-table-panel">
        <div className="admin-table-head">
          <h2>Recent Doctor Registrations</h2>
          <Link className="btn-primary" to="/admin/doctors">
            Manage Doctors
          </Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {overview.recentDoctors.map((doctor) => (
              <tr key={getDoctorRecordId(doctor) || doctor.email}>
                <td>{doctor.name || "-"}</td>
                <td>{doctor.specialty || "-"}</td>
                <td>{doctor.email || "-"}</td>
              </tr>
            ))}
            {!overview.recentDoctors.length ? (
              <tr>
                <td colSpan="3">No recent doctors found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </article>
    </AdminPortalLayout>
  );
}

export default AdminDashboardPage;
