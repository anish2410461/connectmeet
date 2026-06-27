import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../services/roomService";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [joinId, setJoinId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const room = await createRoom();
      navigate(`/room/${room.roomId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create room. Make sure you're logged in.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (joinId.trim()) navigate(`/room/${joinId.trim()}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      {/* Navbar */}
      <nav className="dashboard-nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">📡</div>
          <span>ConnectMeet</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user && (
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              👋 {user.username}
            </span>
          )}
          <button
            id="logout-btn"
            className="btn btn-ghost"
            style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="dashboard-body">
        <div className="dashboard-hero">

          <h1>Start or Join a Meeting</h1>
          <p>
            High-quality video calls with real-time chat, screen sharing,
            and collaborative whiteboard — right in your browser.
          </p>

          {/* Action Cards */}
          <div className="dashboard-actions">
            <div
              className="action-card"
              id="create-meeting-btn"
              onClick={handleCreate}
              style={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? "none" : "auto" }}
            >
              <div className="action-card-icon">🎥</div>
              <span className="action-card-label">
                {loading ? "Creating…" : "New Meeting"}
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Start instantly
              </span>
            </div>
          </div>

          {/* Join by ID */}
          <form
            onSubmit={handleJoin}
            style={{
              marginTop: "28px",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap"
            }}
          >
            <input
              id="join-room-input"
              className="form-input"
              style={{ maxWidth: "280px" }}
              placeholder="Enter meeting code…"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
            />
            <button
              id="join-room-btn"
              className="btn btn-ghost"
              type="submit"
            >
              Join Meeting
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;
