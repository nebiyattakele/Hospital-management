import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <section className="center-card">
      <h1>Hospital Appointment System</h1>
      <p>
        Starter app is ready with login, registration, and role-based dashboards
        for patient, doctor, and admin.
      </p>
      <div className="button-row">
        <Link className="btn-primary" to="/login">
          Login
        </Link>
        <Link className="btn-secondary" to="/register">
          Register
        </Link>
      </div>
    </section>
  );
}

export default LandingPage;
