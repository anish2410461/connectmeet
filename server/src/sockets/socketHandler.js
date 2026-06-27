const users = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join-room", ({ roomId, userName }) => {
      socket.join(roomId);
      
      const isHost = (io.sockets.adapter.rooms.get(roomId)?.size === 1);
      const name = userName || "Guest";
      
      users.set(socket.id, { roomId, userName: name, isHost });
      
      const participants = Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(id => ({
        socketId: id,
        userName: users.get(id)?.userName || "Guest",
        isHost: users.get(id)?.isHost || false
      }));

      io.to(roomId).emit("participants-update", { participants, count: participants.length });

      socket.to(roomId).emit("user-joined", {
        socketId: socket.id,
        userName: name
      });
      console.log(`${socket.id} (${name}) joined ${roomId}`);
    });

    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      users.delete(socket.id);
      
      const participants = Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(id => ({
        socketId: id,
        userName: users.get(id)?.userName || "Guest",
        isHost: users.get(id)?.isHost || false
      }));
      
      io.to(roomId).emit("participants-update", { participants, count: participants.length });

      socket.to(roomId).emit("user-left", {
        socketId: socket.id
      });
    });

    socket.on("chat-message", ({ roomId, message, senderName }) => {
      socket.to(roomId).emit("receive-message", {
        sender: senderName || users.get(socket.id)?.userName || socket.id,
        message
      });
    });

    socket.on("offer", ({ roomId, offer }) => {
      console.log("Offer forwarded");
      socket.to(roomId).emit("offer", offer);
    });

    socket.on("answer", ({ roomId, answer }) => {
      console.log("Answer forwarded");
      socket.to(roomId).emit("answer", answer);
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
      console.log("ICE forwarded");
      socket.to(roomId).emit("ice-candidate", candidate);
    });

    socket.on("end-call", (roomId) => {
      console.log(`Call ended by host in room ${roomId}`);
      socket.to(roomId).emit("call-ended");
    });

    socket.on("disconnecting", () => {
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          const participants = Array.from(io.sockets.adapter.rooms.get(room) || [])
            .filter(id => id !== socket.id)
            .map(id => ({
              socketId: id,
              userName: users.get(id)?.userName || "Guest",
              isHost: users.get(id)?.isHost || false
            }));
            
          io.to(room).emit("participants-update", { participants, count: participants.length });
          socket.to(room).emit("user-left", { socketId: socket.id });
        }
      });
      users.delete(socket.id);
      console.log(`User Disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
