import PatientPortalLayout from "../../features/patient/PatientPortalLayout";
import usePatientPortal from "../../features/patient/usePatientPortal";
import { useNavigate, useParams } from "react-router-dom";

function PatientDoctorDetailsPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const {
    bookingForm,
    error,
    formatAvailability,
    isLoading,
    message,
    notifications,
    selectedDoctor,
    setBookingForm,
    setShowBookingModal,
    showBookingModal,
    handleBookAppointment,
  } = usePatientPortal({ doctorId });

  const onSubmitBooking = async (event) => {
    event.preventDefault();
    const ok = await handleBookAppointment();
    if (ok) {
      navigate("/patient/appointments");
    }
  };

  return (
    <PatientPortalLayout
      error={error}
      isLoading={isLoading}
      message={message}
      notificationCount={notifications.length}
      subtitle="Doctor profile and booking details."
      title="Doctor Profile"
    >
      <section className="doctor-detail-page">
        <article className="white-panel doctor-detail-header">
          <div className="doctor-detail-main">
            <div className="doctor-detail-avatar" />
            <div>
              <h2>{selectedDoctor?.name || "Doctor"}</h2>
              <p>{selectedDoctor?.specialty || "Specialty unavailable"}</p>
            </div>
          </div>
          <button className="btn-primary" onClick={() => setShowBookingModal(true)} type="button">
            Book Appointment
          </button>
          <div className="doctor-meta-row">
            <span>Name: {selectedDoctor?.name || "-"}</span>
            <span>Email: {selectedDoctor?.email || "-"}</span>
            <span>Contact: {selectedDoctor?.contactNumber || "-"}</span>
            <span>Specialty: {selectedDoctor?.specialty || "-"}</span>
            <span>Rating: {selectedDoctor?.rating ?? 0}</span>
            <span>Availability: {formatAvailability(selectedDoctor?.availability)}</span>
          </div>
        </article>

        {showBookingModal ? (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <article className="modal-card">
              <h3>Book Appointment</h3>
              <p className="subtle-text">
                {selectedDoctor?.name || "Selected doctor"} -{" "}
                {selectedDoctor?.specialty || "Specialty"}
              </p>
              <form onSubmit={onSubmitBooking}>
                <label>
                  Date
                  <input
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(event) =>
                      setBookingForm((prev) => ({ ...prev, date: event.target.value }))
                    }
                    required
                    type="date"
                    value={bookingForm.date}
                  />
                </label>
                <label>
                  Time
                  <input
                    onChange={(event) =>
                      setBookingForm((prev) => ({ ...prev, time: event.target.value }))
                    }
                    required
                    type="time"
                    value={bookingForm.time}
                  />
                </label>
                <div className="button-row">
                  <button
                    className="btn-secondary"
                    onClick={() => setShowBookingModal(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button className="btn-primary" type="submit">
                    Confirm Booking
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

export default PatientDoctorDetailsPage;
