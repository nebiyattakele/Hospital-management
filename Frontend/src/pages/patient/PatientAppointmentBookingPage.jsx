import { Link } from "react-router-dom";
import PatientPortalLayout from "../../features/patient/PatientPortalLayout";
import usePatientPortal from "../../features/patient/usePatientPortal";

function PatientAppointmentBookingPage() {
  const { notifications } = usePatientPortal();

  return (
    <PatientPortalLayout
      notificationCount={notifications.length}
      subtitle="Select a doctor and choose your preferred schedule."
      title="Book Appointment"
    >
      <section className="book-page-content">
        <article className="white-panel">
          <h3>Quick Book</h3>
          <p>Select a doctor from Doctors page, then use book action from profile.</p>
          <Link className="btn-primary" to="/patient/doctors">
            Browse Doctors
          </Link>
        </article>
      </section>
    </PatientPortalLayout>
  );
}

export default PatientAppointmentBookingPage;
