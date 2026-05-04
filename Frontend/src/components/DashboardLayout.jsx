import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardLayout({ title, subtitle, children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="topbar-actions">
          <span>{currentUser?.name}</span>
          <Link className="ghost-link" to="/">
            Home
          </Link>
          <button className="btn-secondary" onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default DashboardLayout;
