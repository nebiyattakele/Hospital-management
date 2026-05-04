import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function PatientPortalLayout({
  title,
  subtitle,
  children,
  error,
  message,
  isLoading,
  notificationCount = 0,
}) {
  const { currentUser, logout } = useAuth();

  return (
    <main className="patient-dashboard">
      <aside className="patient-sidebar">
        <div className="sidebar-brand">
          <h2>MEDIPORTAL</h2>
          <p>PATIENT CENTER</p>
        </div>
        <nav className="patient-nav">
          <NavLink className="nav-item" end to="/patient">
            Dashboard
          </NavLink>
          <NavLink className="nav-item" to="/patient/doctors">
            Doctors
          </NavLink>
          <NavLink className="nav-item" to="/patient/appointments">
            Appointments
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="profile-chip">
            <strong>{currentUser?.name || "Patient"}</strong>
            <span>Patient Portal</span>
          </div>
          <NavLink className="nav-item" to="/patient/settings">
            Settings
          </NavLink>
          <button className="nav-item" onClick={logout} type="button">
            Logout
          </button>
        </div>
      </aside>

      <div className="patient-content">
        <div className="patient-header-actions">
          <NavLink className="patient-notification-link" to="/patient/notifications">
            <span aria-hidden="true" className="patient-notification-icon">
              🔔
            </span>
            {notificationCount > 0 ? (
              <span className="patient-notification-badge">{notificationCount}</span>
            ) : null}
          </NavLink>
        </div>
        <section className="welcome-section">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </section>

        {error ? <p className="error-text">{error}</p> : null}
        {message ? <p className="success-text">{message}</p> : null}
        {isLoading ? <p className="subtle-text">Loading patient data...</p> : null}

        {children}
      </div>
    </main>
  );
}

export default PatientPortalLayout;
