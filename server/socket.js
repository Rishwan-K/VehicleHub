const { Server } = require("socket.io");

let io;

const initSocket = (httpServer, corsOptions) => {
  io = new Server(httpServer, { cors: corsOptions });

  io.on("connection", (socket) => {
    // A user opens a specific chat thread
    socket.on("join-conversation", ({ conversationId }) => {
      if (!conversationId) return;
      socket.join(`chat:${conversationId}`);
    });

    socket.on("leave-conversation", ({ conversationId }) => {
      if (!conversationId) return;
      socket.leave(`chat:${conversationId}`);
    });

    // Lightweight "someone is typing" indicator — purely cosmetic, not persisted
    socket.on("typing", ({ conversationId, userName }) => {
      if (!conversationId) return;
      socket.to(`chat:${conversationId}`).emit("typing", { conversationId, userName });
    });
  });

  return io;
};

// Controllers call this after saving a message to broadcast it in real time.
const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized yet");
  return io;
};

module.exports = { initSocket, getIO };
