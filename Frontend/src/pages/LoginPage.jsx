import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthLoading } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolveDashboardPath = (role) => {
    const normalized = String(role || "").toLowerCase();
    if (normalized.includes("admin")) return "/admin";
    if (normalized.includes("doctor")) return "/doctor";
    return "/patient";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const result = await login(form);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate(resolveDashboardPath(result.role));
  };

  return (
    <main className="auth-page login-page">
      <section className="login-wrapper">
        <div className="brand-header centered">
          <h1>MediCare Pro</h1>
          <p>Clinical Excellence &amp; Patient Care</p>
        </div>

        <article className="form-card">
          <h2>Login to Portal</h2>
          <p className="subtle-text">Enter your credentials and continue.</p>
          <form onSubmit={handleSubmit}>
            <label>
              Email Address
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. user@medicarepro.com"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="********"
              />
            </label>

            {error ? <p className="error-text">{error}</p> : null}

            <div className="auth-actions-row">
              <button
                className="btn-primary wide"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
              <a href="#0" className="tiny-link" onClick={(e) => e.preventDefault()}>
                Forgot Password?
              </a>
            </div>
          </form>

          <div className="divider-text">OR</div>
          <Link className="btn-secondary wide" to="/register">
            Register as Patient
          </Link>
          {isAuthLoading ? <p className="subtle-text">Restoring session...</p> : null}
        </article>
      </section>
    </main>
  );
}

export default LoginPage;
