import { useEffect, useState } from "react";

const useMediaStream = () => {
  const [stream, setStream] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let localStream;

    const startMedia = async () => {
      console.log("useMediaStream mounted");
      console.log("Requesting camera...");
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        console.log("Media granted");
        setStream(localStream);
      } catch (error) {
        console.error("Media Error:", error.name, error.message);
      } finally {
        setIsReady(true);
      }
    };

    startMedia();

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };

  }, []);

  return { stream, isReady };
};

export default useMediaStream;
