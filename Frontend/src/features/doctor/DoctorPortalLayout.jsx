import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function DoctorPortalLayout({ profileName, profileSpecialty, children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="doctor-dashboard">
      <aside className="doctor-sidebar">
        <div>
          <h2>MedAdmin</h2>
          <p>CLINICAL PORTAL</p>
        </div>
        <nav className="doctor-nav">
          <NavLink className="doctor-nav-item" end to="/doctor">
            Dashboard
          </NavLink>
          <NavLink className="doctor-nav-item" to="/doctor/appointments">
            Appointments
          </NavLink>
        </nav>
        <div className="doctor-profile-mini">
          <div className="mini-avatar" />
          <div>
            <strong>{profileName || "Doctor"}</strong>
            <span>{profileSpecialty || "Specialist"}</span>
          </div>
          <NavLink className="doctor-nav-item" to="/doctor/profile">
            Settings
          </NavLink>
          <button className="admin-logout-btn" onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      </aside>

      <div className="doctor-content">
        {/* <header className="doctor-topbar">
          <span>{profileName || "Doctor"}</span>
        </header> */}

        {children}
      </div>
    </main>
  );
}

export default DoctorPortalLayout;
