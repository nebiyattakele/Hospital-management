import { Link } from "react-router-dom";
import PatientPortalLayout from "../../features/patient/PatientPortalLayout";
import usePatientPortal from "../../features/patient/usePatientPortal";

function PatientDoctorsPage() {
  const {
    doctorFilter,
    error,
    filteredDoctors,
    formatAvailability,
    getDoctorId,
    isLoading,
    message,
    notifications,
    setDoctorFilter,
  } = usePatientPortal();

  return (
    <PatientPortalLayout
      error={error}
      isLoading={isLoading}
      message={message}
      notificationCount={notifications.length}
      subtitle="Find and review available specialists."
      title="Find a Specialist"
    >
      <section className="doctors-page-content">
        <article className="white-panel doctor-search-panel">
          <div className="doctor-filters">
            <label>
              Specialty
              <select
                onChange={(event) => setDoctorFilter(event.target.value)}
                value={doctorFilter}
              >
                <option value="">All Specialties</option>
                <option value="cardiology">Cardiology</option>
                <option value="neurology">Neurology</option>
                <option value="pediatrics">Pediatrics</option>
              </select>
            </label>
          </div>
        </article>

        <div className="doctor-card-grid">
          {filteredDoctors.map((doctor) => (
            <article className="white-panel doctor-card" key={getDoctorId(doctor) || doctor.email}>
              <div className="doctor-top">
                <div className="doctor-avatar" />
                <div>
                  <h3>{doctor.name}</h3>
                  <p className="doctor-specialty">{doctor.specialty || "Specialist"}</p>
                  <p>{doctor.contactNumber || doctor.role || "-"}</p>
                </div>
              </div>
              <p className="doctor-availability">{formatAvailability(doctor.availability)}</p>
              <Link className="btn-primary wide" to={`/patient/doctors/${getDoctorId(doctor)}`}>
                View Profile
              </Link>
            </article>
          ))}
          {!filteredDoctors.length ? (
            <article className="white-panel doctor-card">
              <h3>No doctors found</h3>
              <p className="subtle-text">No doctors match the selected specialty filter.</p>
            </article>
          ) : null}
        </div>
      </section>
    </PatientPortalLayout>
  );
}

export default PatientDoctorsPage;
