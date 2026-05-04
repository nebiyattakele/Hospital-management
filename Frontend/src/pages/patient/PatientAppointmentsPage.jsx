import { Link } from "react-router-dom";
import PatientPortalLayout from "../../features/patient/PatientPortalLayout";
import usePatientPortal from "../../features/patient/usePatientPortal";

function PatientAppointmentsPage() {
  const {
    appointments,
    appointmentFilter,
    error,
    formatDateDisplay,
    formatTimeDisplay,
    getAppointmentId,
    isLoading,
    message,
    notifications,
    openRescheduleModal,
    rescheduleForm,
    setAppointmentFilter,
    setRescheduleForm,
    setShowRescheduleModal,
    showRescheduleModal,
    handleCancelAppointment,
    handleRescheduleAppointment,
  } = usePatientPortal();

  return (
    <PatientPortalLayout
      error={error}
      isLoading={isLoading}
      message={message}
      notificationCount={notifications.length}
      subtitle="Track and manage your appointment schedule."
      title="Appointments"
    >
      <section className="appointments-page-content">
        <div className="appointments-head-row">
          <div className="appointments-tabs">
            <button
              className={`tab-btn ${appointmentFilter === "all" ? "active" : ""}`}
              onClick={() => setAppointmentFilter("all")}
              type="button"
            >
              All
            </button>
            <button
              className={`tab-btn ${appointmentFilter === "upcoming" ? "active" : ""}`}
              onClick={() => setAppointmentFilter("upcoming")}
              type="button"
            >
              Upcoming
            </button>
            <button
              className={`tab-btn ${appointmentFilter === "past" ? "active" : ""}`}
              onClick={() => setAppointmentFilter("past")}
              type="button"
            >
              Past
            </button>
            <button
              className={`tab-btn ${appointmentFilter === "today" ? "active" : ""}`}
              onClick={() => setAppointmentFilter("today")}
              type="button"
            >
              Today
            </button>
          </div>
          <Link className="btn-primary" to="/patient/appointments/new">
            + New Appointment
          </Link>
        </div>

        <article className="white-panel appointments-table-panel">
          <table>
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Specialty</th>
                <th>Date &amp; Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={getAppointmentId(item) || `${item.date}-${item.time}`}>
                  <td>
                    <strong>{item.doctorId?.name || item.doctor || item.doctorName || "-"}</strong>
                  </td>
                  <td>
                    <p className="cell-subtext">
                      {item.doctorId?.specialty || item.specialty || "-"}
                    </p>
                  </td>
                  <td>
                    <strong>{formatDateDisplay(item.date)}</strong>
                    <p className="cell-subtext">
                      <strong>{formatTimeDisplay(item.time)}</strong>
                    </p>
                  </td>
                  <td>
                    <span className={`status-pill ${String(item.status || "").toLowerCase()}`}>
                      {item.status || "Unknown"}
                    </span>
                  </td>
                  <td>
                    {["rejected", "cancelled"].includes(String(item.status || "").toLowerCase()) ? null : (
                      <div className="action-buttons">
                        <button
                          className="action-outline"
                          onClick={() => openRescheduleModal(item)}
                          type="button"
                        >
                          Reschedule
                        </button>
                        <button
                          className="action-danger"
                          onClick={() => handleCancelAppointment(getAppointmentId(item))}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!appointments.length ? (
                <tr>
                  <td colSpan="5">No appointments for this filter.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </article>

        {showRescheduleModal ? (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <article className="modal-card">
              <h3>Reschedule Appointment</h3>
              <p className="subtle-text">Choose a new date and time.</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleRescheduleAppointment();
                }}
              >
                <label>
                  New Date
                  <input
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(event) =>
                      setRescheduleForm((prev) => ({ ...prev, date: event.target.value }))
                    }
                    required
                    type="date"
                    value={rescheduleForm.date}
                  />
                </label>
                <label>
                  New Time
                  <input
                    onChange={(event) =>
                      setRescheduleForm((prev) => ({ ...prev, time: event.target.value }))
                    }
                    required
                    type="time"
                    value={rescheduleForm.time}
                  />
                </label>
                <div className="button-row">
                  <button className="btn-secondary" onClick={() => setShowRescheduleModal(false)} type="button">
                    Cancel
                  </button>
                  <button className="btn-primary" type="submit">
                    Save Changes
                  </button>
                </div>
              </form>
            </article>
          </div>
        ) : null}
      </section>
    </PatientPortalLayout>
  );
}

export default PatientAppointmentsPage;
