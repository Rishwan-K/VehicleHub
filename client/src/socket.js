import { io } from "socket.io-client";

let socket;

// One shared socket connection for the whole app session.
export const getSocket = () => {
  if (!socket) {
    // Same base as REACT_APP_API_URL but without the trailing /api
    const base = (process.env.REACT_APP_API_URL || "").replace(/\/api\/?$/, "");
    socket = io(base, { transports: ["websocket"], autoConnect: true });
  }
  return socket;
};
