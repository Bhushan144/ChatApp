import { io } from "socket.io-client";

let socket;

function connectWebsocket() {
  if (!socket) {
    // Use environment variable if available, otherwise fallback to localhost
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4600";
    socket = io(backendUrl);
  }
  return socket;
}

export { connectWebsocket };
