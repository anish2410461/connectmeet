import { useState, useEffect } from "react";

const useMediaControls = (localStream, peerRef) => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localDisplayStream, setLocalDisplayStream] = useState(localStream);

  useEffect(() => {
    if (!isScreenSharing) {
      setLocalDisplayStream(localStream);
    }
  }, [localStream, isScreenSharing]);

  const toggleMic = () => {
    if (!localStream) return;
    const track = localStream.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  };

  const toggleCam = () => {
    if (!localStream) return;
    const track = localStream.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
    }
  };

  const shareScreen = async () => {
    if (!peerRef?.current) return;
    
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        
        const screenTrack = screenStream.getVideoTracks()[0];
        const sender = peerRef.current.getSenders().find(s => s.track && s.track.kind === "video");
        
        if (sender) {
          sender.replaceTrack(screenTrack);
        }

        // Handle when user clicks "Stop sharing" from browser UI
        screenTrack.onended = () => {
          stopScreenShare();
        };

        setLocalDisplayStream(screenStream);
        setIsScreenSharing(true);
      } else {
        stopScreenShare();
      }
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };

  const stopScreenShare = () => {
    if (!peerRef?.current || !localStream) return;
    
    const videoTrack = localStream.getVideoTracks()[0];
    const sender = peerRef.current.getSenders().find(s => s.track && s.track.kind === "video");
    
    if (sender && videoTrack) {
      sender.replaceTrack(videoTrack);
    }
    
    setLocalDisplayStream(localStream);
    setIsScreenSharing(false);
  };

  return {
    micOn,
    camOn,
    isScreenSharing,
    localDisplayStream,
    toggleMic,
    toggleCam,
    shareScreen
  };
};

export default useMediaControls;
