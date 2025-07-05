import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      transports: ["websocket"],
      autoConnect: true,
    });

    // Connection event handlers
    socket.on("connect", () => {
      console.log("Connected to chat server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// These functions are not used by the backend
// The backend handles room joining through startChat event

export const startChat = (user1Id, user2Id) => {
  const socket = getSocket();
  socket.emit("startChat", { user1Id, user2Id });
};

export const sendMessage = (roomId, senderId, text) => {
  const socket = getSocket();
  socket.emit("sendMessage", { roomId, senderId, text });
};
