import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_SOCKET_URL || `http://${window.location.hostname}:5000`,
  {
    autoConnect: false,
    transports: ["websocket"]
  }
);

export default socket;
