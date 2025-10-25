const express = require("express");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const { join } = require("node:path");
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

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  // socket.emit("forward", "Hello world");

  // socket.broadcast.emit("remoteUser", `${socket.id} joined the server`); // broadcast to other users not selt

  socket.on("send-message", (message) => {
    io.emit("receive-message", message); // send to everyone including sender
  });
});

app.use(cors());

server.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
