import DoctorPortalLayout from "../../features/doctor/DoctorPortalLayout";
import useDoctorPortal, {
  FILTERS,
  STATUS_TO_STYLE,
  getAppointmentItemId,
  getPatientName,
} from "../../features/doctor/useDoctorPortal";

function DoctorAppointmentsPage() {
  const {
    activeFilter,
    appointments,
    currentPage,
    dashboardStats,
    fetchedAppointments,
    paginatedAppointments,
    profileForm,
    setActiveFilter,
    handleStatusUpdate,
    goToNextPage,
    goToPreviousPage,
    totalPages,
  } = useDoctorPortal();

  return (
    <DoctorPortalLayout
      profileName={profileForm.name}
      profileSpecialty={profileForm.specialty}
    >
      <section className="doctor-appointments-page">
        <h1>Appointments Schedule</h1>
        <p>Manage and track your upcoming patient consultations.</p>

        <div className="doctor-appt-kpis">
          <article className="white-panel appt-stat-card">
            <small>Total Today</small>
            <strong>{dashboardStats.totalAppointments}</strong>
            <span>From doctor dashboard API</span>
          </article>
          <article className="white-panel appt-stat-card">
            <small>Upcoming</small>
            <strong>{dashboardStats.upcomingAppointmentsCount}</strong>
          </article>
          <article className="white-panel appt-stat-card">
            <small>Loaded Items</small>
            <strong>{fetchedAppointments.length}</strong>
          </article>
        </div>

        <article className="white-panel doctor-appt-table-panel">
          <div className="doctor-panel-head">
            <div className="appointments-tabs">
              {FILTERS.map((filterKey) => (
                <button
                  className={`tab-btn ${activeFilter === filterKey ? "active" : ""}`}
                  key={filterKey}
                  onClick={() => setActiveFilter(filterKey)}
                  type="button"
                >
                  {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAppointments.map((item) => (
                <tr key={getAppointmentItemId(item) || `${item.date}-${item.time}`}>
                  <td>
                    <strong>{getPatientName(item)}</strong>
                    <p className="cell-subtext">
                      ID: {item?.patientId?._id || item?.patientId || item?.patient?.id || "-"}
                    </p>
                  </td>
                  <td>{item.date || "-"}</td>
                  <td>{item.time || "-"}</td>
                  <td>
                    <span
                      className={`status-pill ${STATUS_TO_STYLE[String(item.status || "").toLowerCase()] || "booked"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="accept-btn"
                        onClick={() => handleStatusUpdate(getAppointmentItemId(item), "Accepted")}
                        type="button"
                      >
                        Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleStatusUpdate(getAppointmentItemId(item), "Rejected")}
                        type="button"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!appointments.length ? (
                <tr>
                  <td colSpan="5">No appointments found for this filter.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
          <div className="directory-footer">
            <small>
              Page {currentPage} of {totalPages} - {appointments.length} appointment(s)
            </small>
            <div className="pagination">
              <button
                disabled={currentPage <= 1}
                onClick={goToPreviousPage}
                type="button"
              >
                Previous
              </button>
              <button className="active" type="button">
                {currentPage}
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={goToNextPage}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </article>

        <article className="doctor-reminder-card">
          <h3>Reminder: Patient Data Policy</h3>
          <p>
            Ensure all patient information is handled according to clinic privacy standards. Completed
            appointments should have notes finalized within 24 hours.
          </p>
        </article>
      </section>
    </DoctorPortalLayout>
  );
}

export default DoctorAppointmentsPage;
