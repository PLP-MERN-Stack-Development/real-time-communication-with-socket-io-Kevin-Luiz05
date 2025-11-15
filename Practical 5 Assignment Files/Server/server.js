import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for dev
  },
});

app.use(cors());
app.use(express.json());

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Add new user
  socket.on("join", (username) => {
    onlineUsers.push({ id: socket.id, username });
    io.emit("onlineUsers", onlineUsers);
  });

  // Listen for chat messages
  socket.on("sendMessage", (message) => {
    socket.broadcast.emit("receiveMessage", message);
  });

  // Typing indicator
  socket.on("typing", (username) => {
    socket.broadcast.emit("typing", username);
  });

  // Disconnect
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((u) => u.id !== socket.id);
    io.emit("onlineUsers", onlineUsers);
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
