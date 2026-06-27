import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const data = await loginUser(formData);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
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

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              id="login-email"
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
              id="login-password"
              className="form-input"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p style={{ color: "var(--accent-red)", fontSize: "0.85rem", marginTop: "-4px" }}>
              ⚠ {error}
            </p>
          )}

          <button
            id="login-submit"
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
