import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";

function VideoGrid({ localStream, remoteStream, camOn }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#000" }}>

      {/* Primary video — fills entire area */}
      {remoteStream ? (
        <>
          {/* Remote is primary (full screen) */}
          <div style={{ width: "100%", height: "100%" }}>
            <RemoteVideo stream={remoteStream} />
          </div>

          {/* Local is PiP (top right) */}
          <div className="video-pip">
            <LocalVideo stream={localStream} camOn={camOn} />
          </div>
          <div className="video-name-tag" style={{ bottom: 80 }}>Remote User</div>
        </>
      ) : (
        <>
          {/* Only local — fills full screen */}
          <div style={{ width: "100%", height: "100%" }}>
            <LocalVideo stream={localStream} camOn={camOn} />
          </div>

          {/* Waiting overlay */}
          <div className="waiting-overlay">
            <div className="waiting-spinner" />
            <p className="waiting-text">Waiting for others to join…</p>
          </div>
        </>
      )}

      {/* Local name tag */}
      <div className="video-name-tag">
        You {!camOn && "· Camera off"}
      </div>

    </div>
  );
}

export default VideoGrid;
