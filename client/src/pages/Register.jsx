import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="auth-logo-icon">📡</div>
          <span className="auth-logo-text">ConnectMeet</span>
        </div>

        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Join ConnectMeet and start collaborating</p>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              id="register-username"
              className="form-input"
              name="username"
              type="text"
              placeholder="yourname"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              id="register-email"
              className="form-input"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="register-password"
              className="form-input"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p style={{ color: "var(--accent-red)", fontSize: "0.85rem", marginTop: "-4px" }}>
              ⚠ {error}
            </p>
          )}

          <button
            id="register-submit"
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create Account →"}
          </button>

        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
