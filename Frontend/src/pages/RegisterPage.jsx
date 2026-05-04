import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }

    if (!agreed) {
      setError("Please agree to terms and privacy policy.");
      return;
    }

    setIsSubmitting(true);
    const result = await register(form);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate(`/${result.role}`);
  };

  return (
    <main className="auth-page register-page">
      <section className="register-layout">
        <aside className="promo-panel">
          <div>
            <h1>MediCare Pro</h1>
            <h2>Advanced Care at Your Fingertips.</h2>
            <p>
              Join our clinical network to manage your appointments, view medical
              records, and connect with healthcare professionals in a secure
              environment.
            </p>
            <ul>
              <li>HIPAA Compliant Data Storage</li>
              <li>24/7 Professional Support</li>
            </ul>
          </div>
        </aside>

        <article className="register-form-panel">
          <h2>Patient Registration</h2>
          <p className="subtle-text">
            Create your clinical account to access our healthcare services.
          </p>

          <form onSubmit={handleSubmit}>
            <label>
              Full Name
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </label>
            <label>
              Email Address
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
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
            <label>
              Confirm Password
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                placeholder="********"
              />
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>I agree to the Terms of Service and Privacy Policy.</span>
            </label>

            {error ? <p className="error-text">{error}</p> : null}

            <button
              className="btn-primary wide"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="foot-note">
            Already have a medical account? <Link to="/login">Login to your account</Link>
          </p>
        </article>
      </section>
    </main>
  );
}

export default RegisterPage;
