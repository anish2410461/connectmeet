import { useEffect, useRef } from "react";

function RemoteVideo({ stream }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // React JSX `muted` prop is broken — must set imperatively
    video.muted = false;

    if (stream) {
      video.srcObject = stream;
      video.play().catch(() => {
        // Autoplay was prevented — browser will retry on user gesture
      });
    }

  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      onLoadedMetadata={() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "8px",
        display: "block",
        backgroundColor: "#0f0f1a"
      }}
    />
  );
}

export default RemoteVideo;
