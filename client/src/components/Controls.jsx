import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Controls({ socket, localStream, peerRef, roomId, micOn, camOn, isScreenSharing, onToggleMic, onToggleCam, onToggleScreenShare, onToggleChat, chatOpen }) {
  const navigate = useNavigate();

  const handleLeave = () => {
    if (socket) {
      socket.emit("end-call", roomId);
    }
    localStream?.getTracks().forEach(track => track.stop());
    peerRef?.current?.close();
    navigate("/dashboard");
  };

  return (
    <div className="controls-bar">

      {/* Mic */}
      <button
        id="ctrl-mic"
        className={`ctrl-btn ${micOn ? "ctrl-btn-default" : "ctrl-btn-muted"}`}
        onClick={onToggleMic}
        title={micOn ? "Mute microphone" : "Unmute microphone"}
      >
        {micOn ? "🎤" : "🔇"}
      </button>

      {/* Camera */}
      <button
        id="ctrl-cam"
        className={`ctrl-btn ${camOn ? "ctrl-btn-default" : "ctrl-btn-muted"}`}
        onClick={onToggleCam}
        title={camOn ? "Turn off camera" : "Turn on camera"}
      >
        {camOn ? "📹" : "🚫"}
      </button>

      {/* Screen Share */}
      <button
        id="ctrl-screen"
        className={`ctrl-btn ${isScreenSharing ? "ctrl-btn-active" : "ctrl-btn-default"}`}
        onClick={onToggleScreenShare}
        title={isScreenSharing ? "Stop sharing screen" : "Share screen"}
      >
        🖥️
      </button>

      <div className="ctrl-divider" />

      {/* Chat toggle */}
      <button
        id="ctrl-chat"
        className={`ctrl-btn ${chatOpen ? "ctrl-btn-active" : "ctrl-btn-default"}`}
        onClick={onToggleChat}
        title="Toggle chat"
      >
        💬
      </button>

      <div className="ctrl-divider" />

      {/* Leave */}
      <button
        id="ctrl-leave"
        className="ctrl-btn ctrl-btn-danger"
        onClick={handleLeave}
        title="Leave meeting"
      >
        📞
      </button>

    </div>
  );
}

export default Controls;
