import DoctorPortalLayout from "../../features/doctor/DoctorPortalLayout";
import useDoctorPortal, {
  STATUS_TO_STYLE,
  getAppointmentItemId,
  getPatientEmail,
  getPatientName,
} from "../../features/doctor/useDoctorPortal";

function DoctorDashboardPage() {
  const {
    dashboardStats,
    dataError,
    isLoading,
    notifications,
    profileForm,
    recentAppointments,
  } = useDoctorPortal();

  return (
    <DoctorPortalLayout
      profileName={profileForm.name}
      profileSpecialty={profileForm.specialty}
    >
      <>
        <article className="doctor-briefing">
          <div>
            <h3>Daily Clinical Briefing</h3>
            <p>Live dashboard data from backend API</p>
          </div>
          <div className="briefing-meta">
            <span>Status: {isLoading ? "Refreshing..." : "Synced"}</span>
          </div>
        </article>

        {dataError ? <p className="error-text">{dataError}</p> : null}

        <section className="doctor-kpis">
          <article className="white-panel kpi-card">
            <small>Total Appointments Today</small>
            <strong>{dashboardStats.totalAppointments}</strong>
          </article>
          <article className="white-panel kpi-card">
            <small>Total Upcoming Appointments</small>
            <strong>{dashboardStats.upcomingAppointmentsCount}</strong>
          </article>
          <article className="white-panel kpi-card">
            <small>Recent Appointments</small>
            <strong>{recentAppointments.length}</strong>
          </article>
        </section>

        <section className="doctor-main-grid">
          <article className="white-panel">
            <div className="doctor-panel-head">
              <h3>Recent Appointments</h3>
              <button type="button">View all schedule</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((item) => (
                  <tr key={getAppointmentItemId(item) || `${item.date}-${item.time}`}>
                    <td>{item.date || "-"}</td>
                    <td>{getPatientName(item)}</td>
                    <td>{getPatientEmail(item)}</td>
                    <td>
                      <span
                        className={`status-pill ${STATUS_TO_STYLE[String(item.status || "").toLowerCase()] || "booked"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-outline" type="button">
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
                {!recentAppointments.length ? (
                  <tr>
                    <td colSpan="5">No recent appointments found.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </article>

          <div className="doctor-side-stack">
            <article className="white-panel">
              <h3>System Alerts</h3>
              {notifications.slice(0, 3).map((item, index) => (
                <div className={index === 0 ? "lab-alert" : "lab-item"} key={item.id || index}>
                  <strong>{item.title || "Notification"}</strong>
                  <p>{item.message || item.text || "No details provided."}</p>
                </div>
              ))}
              {!notifications.length ? (
                <p className="subtle-text">No alerts available.</p>
              ) : null}
            </article>

            <article className="doctor-research-card">
              <h3>New Research Protocol</h3>
              <p>Department update for Q4 surgery guidelines.</p>
            </article>
          </div>
        </section>
      </>
    </DoctorPortalLayout>
  );
}

export default DoctorDashboardPage;
