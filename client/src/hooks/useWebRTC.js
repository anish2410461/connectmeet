import { useEffect, useRef, useState } from "react";

const useWebRTC = (socket, roomId, stream) => {
  const peerRef = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const pendingCandidates = useRef([]);

  // 1. Initialize PeerConnection and Signaling (Runs once per socket/roomId)
  useEffect(() => {
    if (!socket) return;

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    peerRef.current = peer;

    peer.ontrack = (event) => {
      console.log("REMOTE TRACK RECEIVED", event.track.kind);
      // Generate a new MediaStream to force React re-render
      setRemoteStream(prev => {
        const newStream = prev ? new MediaStream(prev.getTracks()) : new MediaStream();
        newStream.addTrack(event.track);
        return newStream;
      });
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          roomId,
          candidate: event.candidate
        });
      }
    };

    peer.onnegotiationneeded = async () => {
      try {
        console.log("NEGOTIATION NEEDED");
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
      } catch (err) {
        console.error("Error during negotiation:", err);
      }
    };

    const handleUserJoined = async () => {
      try {
        console.log("USER JOINED");
        console.log("CREATING OFFER");
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
      } catch (err) {
        console.error("Error creating offer:", err);
      }
    };

    const handleOffer = async (offer) => {
      try {
        console.log("RECEIVED OFFER");
        await peer.setRemoteDescription(offer);
        console.log("CREATING ANSWER");
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer });
        
        // Process queued candidates
        while (pendingCandidates.current.length) {
          const candidate = pendingCandidates.current.shift();
          await peer.addIceCandidate(candidate).catch(e => console.error(e));
        }
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    };

    const handleAnswer = async (answer) => {
      try {
        console.log("RECEIVED ANSWER");
        await peer.setRemoteDescription(answer);
        
        // Process queued candidates
        while (pendingCandidates.current.length) {
          const candidate = pendingCandidates.current.shift();
          await peer.addIceCandidate(candidate).catch(e => console.error(e));
        }
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    };

    const handleIceCandidate = async (candidate) => {
      try {
        console.log("RECEIVED ICE");
        if (peer.remoteDescription) {
          await peer.addIceCandidate(candidate);
        } else {
          pendingCandidates.current.push(candidate);
        }
      } catch (err) {
        console.error("Error adding ice candidate:", err);
      }
    };

    socket.on("user-joined", handleUserJoined);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      peer.close();
    };
  }, [socket, roomId]);

  // 2. Add tracks when local stream becomes available
  useEffect(() => {
    if (stream && peerRef.current) {
      const peer = peerRef.current;
      const existingSenders = peer.getSenders();
      
      stream.getTracks().forEach(track => {
        const isAlreadyAdded = existingSenders.some(sender => sender.track === track);
        if (!isAlreadyAdded) {
          peer.addTrack(track, stream);
        }
      });
    }
  }, [stream]);

  return { peerRef, remoteStream };
};

export default useWebRTC;
