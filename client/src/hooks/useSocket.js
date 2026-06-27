import { useEffect } from "react";
import socket from "../services/socket";

const useSocket = (roomId, userName, shouldConnect = true) => {

  useEffect(() => {
    if (!shouldConnect) return;

    // Connect and wait for the connection before joining
    socket.connect();

    socket.on("connect", () => {
      socket.emit("join-room", { roomId, userName });
    });

    // If already connected (e.g. hot reload), join immediately
    if (socket.connected) {
      socket.emit("join-room", { roomId, userName });
    }

    return () => {
      socket.emit("leave-room", roomId);
      socket.off("connect");
      socket.disconnect();
    };

  }, [roomId, userName, shouldConnect]);

  return socket;
};

export default useSocket;
