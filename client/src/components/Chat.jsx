import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

function Chat({ socket, roomId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const senderName = user?.name || user?.username || "Guest";
    socket.emit("chat-message", { roomId, message, senderName });
    // Add own message optimistically
    setMessages(prev => [...prev, { sender: "You", message, own: true }]);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-sidebar">

      {/* Tabs */}
      <div className="chat-tabs">
        <button
          className={`chat-tab ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </button>
        <button
          className={`chat-tab ${activeTab === "participants" ? "active" : ""}`}
          onClick={() => setActiveTab("participants")}
        >
          People
        </button>
      </div>

      {activeTab === "chat" ? (
        <>
          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                paddingTop: "40px"
              }}>
                <span style={{ fontSize: "2rem" }}>💬</span>
                <p style={{ fontSize: "0.85rem", textAlign: "center", color: "var(--text-muted)" }}>
                  No messages yet.<br />Say hello!
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${msg.own ? "own" : ""}`}
                >
                  {!msg.own && (
                    <span className="chat-message-sender">
                      {msg.sender?.slice(0, 8)}…
                    </span>
                  )}
                  <span className="chat-message-text">{msg.message}</span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input
              id="chat-input"
              className="chat-input"
              placeholder="Message…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              id="chat-send-btn"
              className="chat-send-btn"
              onClick={sendMessage}
            >
              ➤
            </button>
          </div>
        </>
      ) : (
        <div className="participants-list">
          <div className="participant-item">
            <div className="participant-avatar">Y</div>
            <div>
              <div className="participant-name">{user?.name || user?.username || "You"}</div>
              <div className="participant-role">Host</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Chat;
