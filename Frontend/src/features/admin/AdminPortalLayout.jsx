import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminPortalLayout({ title, subtitle, error, message, isLoading, children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <div>
          <h2>MedAdmin</h2>
          <p>CLINICAL EXCELLENCE</p>
        </div>
        {/* <small>Main Menu</small> */}
        <nav className="admin-nav">
          <NavLink className="admin-nav-item" end to="/admin">
            Dashboard
          </NavLink>
          <NavLink className="admin-nav-item" to="/admin/doctors">
            Doctors
          </NavLink>
        </nav>
        <div className="admin-profile-mini">
          <div className="mini-avatar" />
          <div>
            <strong>Hospital Admin</strong>
            <span>System Administrator</span>
          </div>
          <button className="admin-logout-btn" onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-content">
        {/* <header className="admin-topbar">
          <span>Hospital Management</span>
        </header> */}

        <section className="admin-welcome">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </section>

        {error ? <p className="error-text">{error}</p> : null}
        {message ? <p className="success-text">{message}</p> : null}
        {isLoading ? <p className="subtle-text">Loading admin data...</p> : null}

        {children}
      </div>
    </main>
  );
}

export default AdminPortalLayout;
