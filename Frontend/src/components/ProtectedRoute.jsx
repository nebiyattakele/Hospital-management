import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, isAuthLoading } = useAuth();
  const role = String(currentUser?.role || "").toLowerCase();

  const resolveDashboardPath = (rawRole) => {
    if (rawRole.includes("admin")) return "/admin";
    if (rawRole.includes("doctor")) return "/doctor";
    if (rawRole.includes("patient")) return "/patient";
    return "/";
  };

  if (isAuthLoading) {
    return <p>Checking your session...</p>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={resolveDashboardPath(role)} replace />;
  }

  return children;
}

export default ProtectedRoute;
