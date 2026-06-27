import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import useSocket from "../hooks/useSocket";
import useMediaStream from "../hooks/useMediaStream";
import useWebRTC from "../hooks/useWebRTC";
import useMediaControls from "../hooks/useMediaControls";
import { useAuth } from "../context/AuthContext";

import VideoGrid from "../components/VideoGrid";
import Chat from "../components/Chat";
import Controls from "../components/Controls";

function MeetingRoom() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const userName = user?.name || "Guest";

  const { stream: localStream, isReady } = useMediaStream();
  const socket = useSocket(roomId, userName, isReady);
  
  const { peerRef, remoteStream } = useWebRTC(socket, roomId, localStream);
  const { 
    micOn, 
    camOn, 
    isScreenSharing, 
    localDisplayStream, 
    toggleMic, 
    toggleCam, 
    shareScreen 
  } = useMediaControls(localStream, peerRef);

  const [chatOpen, setChatOpen] = useState(true);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (data) => {
      setParticipants(data.participants || []);
    };
    
    const handleCallEnded = () => {
      alert("The host has ended the call.");
      localStream?.getTracks().forEach(track => track.stop());
      peerRef?.current?.close();
      window.location.href = "/dashboard";
    };

    socket.on("participants-update", handleUpdate);
    socket.on("call-ended", handleCallEnded);
    
    return () => {
      socket.off("participants-update", handleUpdate);
      socket.off("call-ended", handleCallEnded);
    };
  }, [socket, localStream, peerRef]);

  // Meeting timer
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="meeting-room">

      {/* Header */}
      <div className="meeting-header">
        <div className="meeting-header-left" style={{ flex: 1 }}>
          <div className="nav-logo" style={{ fontSize: "0.95rem" }}>
            <div className="nav-logo-icon" style={{ width: 28, height: 28, fontSize: 14 }}>📡</div>
            <span>ConnectMeet</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 2, justifyContent: "center" }}>
          <div className="meeting-room-id" style={{ fontSize: "0.95rem", padding: "6px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
            🏠 {roomId}
          </div>
          <button 
            className="btn btn-ghost" 
            style={{ padding: "6px 10px", fontSize: "0.8rem" }} 
            onClick={() => navigator.clipboard.writeText(roomId)}
            title="Copy Code"
          >
            📋 Copy Code
          </button>
          <button 
            className="btn btn-ghost" 
            style={{ padding: "6px 10px", fontSize: "0.8rem" }} 
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`)}
            title="Copy Invite Link"
          >
            🔗 Copy Link
          </button>
          
          <div style={{ position: "relative" }}>
            <button 
              className="btn btn-ghost"
              style={{ padding: "6px 10px", fontSize: "0.85rem", color: "var(--text-secondary)" }}
              onClick={() => setParticipantsOpen(!participantsOpen)}
            >
              👥 {participants.length || 1}
            </button>
            
            {participantsOpen && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: "8px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "12px",
                width: "200px",
                zIndex: 100,
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
              }}>
                <div style={{ fontSize: "0.85rem", fontWeight: "bold", marginBottom: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "4px" }}>
                  Participants
                </div>
                {participants.length > 0 ? participants.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0", fontSize: "0.85rem" }}>
                    <span>👤</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.userName} {p.isHost && <span style={{ color: "var(--primary)" }}>(Host)</span>}
                    </span>
                  </div>
                )) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0", fontSize: "0.85rem" }}>
                    <span>👤</span>
                    <span>{userName} (You)</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, justifyContent: "flex-end" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Local: {localStream ? "YES" : "NO"}
          </span>
          <span className="meeting-timer">⏱ {formatTime(elapsed)}</span>
          <div className="connection-badge">
            <div className="connection-dot" />
            Connected
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="meeting-body">

        {/* Video + Controls */}
        <div className="video-area">

          <VideoGrid
            localStream={localDisplayStream}
            remoteStream={remoteStream}
            camOn={camOn}
          />

          {/* Controls floating bar */}
          <Controls
            socket={socket}
            localStream={localStream}
            peerRef={peerRef}
            roomId={roomId}
            micOn={micOn}
            camOn={camOn}
            isScreenSharing={isScreenSharing}
            onToggleMic={toggleMic}
            onToggleCam={toggleCam}
            onToggleScreenShare={shareScreen}
            onToggleChat={() => setChatOpen(o => !o)}
            chatOpen={chatOpen}
          />

        </div>

        {/* Chat Sidebar */}
        <div className={`chat-sidebar ${chatOpen ? "" : "hidden"}`}>
          <Chat socket={socket} roomId={roomId} />
        </div>

      </div>

    </div>
  );
}

export default MeetingRoom;
