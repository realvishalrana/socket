const express = require("express");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const cors = require("cors");

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = new Set();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send current room list to newly connected user
  socket.emit("all-rooms", Array.from(rooms));

  socket.on("create-room", ({ room }) => {
    if (!rooms.has(room)) {
      rooms.add(room);
      io.emit("all-rooms", Array.from(rooms));
    }
  });

  socket.on("join-room", ({ room }) => {
    socket.join(room);
    socket.emit("joined-room", room);
  });

  socket.on("send-message", ({ msg, room }) => {
    io.to(room).emit("room-message", { sender: socket.id, text: msg });
  });

  // Typing event
  socket.on("typing", ({ room, isTyping }) => {
    socket.to(room).emit("typing", { sender: socket.id, isTyping });
  });

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

app.use(cors());

server.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT || 3000}`);
});
