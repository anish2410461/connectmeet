import { useEffect, useRef } from "react";

function LocalVideo({ stream, camOn = true }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // React JSX `muted` prop is broken — must set imperatively
    video.muted = true;

    if (stream) {
      video.srcObject = stream;
      video.play().catch(() => {});
    }
  }, [stream]);

  if (!camOn) {
    return (
      <div className="video-placeholder" style={{ width: "100%", height: "100%" }}>
        <div className="video-placeholder-avatar">🚫</div>
        <p className="video-placeholder-text">Camera is off</p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      onLoadedMetadata={() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      }}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        backgroundColor: "#0a0a14"
      }}
    />
  );
}

export default LocalVideo;
