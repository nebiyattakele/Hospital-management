import PatientPortalLayout from "../../features/patient/PatientPortalLayout";
import usePatientPortal from "../../features/patient/usePatientPortal";

function PatientDashboardPage() {
  const {
    error,
    formatDateDisplay,
    formatTimeDisplay,
    getDoctorNameFromAppointment,
    getDoctorSpecialtyFromAppointment,
    isLoading,
    latestAppointment,
    message,
    notifications,
    records,
    specialists,
  } = usePatientPortal();

  return (
    <PatientPortalLayout
      error={error}
      isLoading={isLoading}
      message={message}
      notificationCount={notifications.length}
      subtitle="Stay on top of your recent activity and next visit."
      title="Welcome back"
    >
      <section className="next-appointment">
        <h2>Next Appointment</h2>
        <div className="appointment-doctor">
          <div className="avatar-box">+</div>
          <div>
            <h3>{getDoctorNameFromAppointment(latestAppointment)}</h3>
            <p>{getDoctorSpecialtyFromAppointment(latestAppointment)}</p>
          </div>
        </div>
        <ul>
          <li>{formatDateDisplay(latestAppointment?.date)}</li>
          <li>{formatTimeDisplay(latestAppointment?.time)}</li>
          {/* <li>{latestAppointment?.location || "Clinic location will be shared soon"}</li> */}
        </ul>
      </section>

      <section className="dashboard-grid">
        <article className="white-panel">
          <div className="panel-head">
            <h2>Recent Appointments</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Specialty</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id || record.id}>
                  <td>{getDoctorNameFromAppointment(record)}</td>
                  <td>{getDoctorSpecialtyFromAppointment(record)}</td>
                  <td>{formatDateDisplay(record.date)}</td>
                  <td>
                    <strong>{formatTimeDisplay(record.time)}</strong>
                  </td>
                  <td className="action-link">{record.status || "-"}</td>
                </tr>
              ))}
              {!records.length ? (
                <tr>
                  <td colSpan="5">No recent appointments available.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </article>

        <article className="white-panel specialists-panel">
          <div className="panel-head">
            <h2>Top Specialists</h2>
          </div>
          <div className="specialists-list">
            {specialists.map((specialist) => (
              <div className="specialist-item" key={specialist.id || specialist._id}>
                <div className="specialist-avatar" />
                <div>
                  <h3>{specialist.name || "Doctor"}</h3>
                  <p>{specialist.field || specialist.specialty || "-"}</p>
                </div>
                <span>{specialist.rating || "-"}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </PatientPortalLayout>
  );
}

export default PatientDashboardPage;
