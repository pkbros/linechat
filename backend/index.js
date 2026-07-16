const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
app.use(cors());
const server = http.createServer(app);

function genCode() {
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

function genRoomCode() {
  let rmcode;
  do {
    rmcode = genCode();
  } while (io.sockets.adapter.rooms.get(rmcode));
  return rmcode;
}

const io = new Server(server, {
  cors: {
    // Allow connections from any origin
    // Later you should replace "*" with your frontend URL
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);
  io.emit("online-users", io.engine.clientsCount);
  socket.on("join-room", ({ roomId, username }) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) {
      socket.emit("room-not-found");
      return;
    }
    socket.join(roomId);
    io.to(roomId).emit("system-message", {
      message: `${username} joined.`,
    });
    console.log(`${socket.id} joined room ${roomId}`);
    socket.emit("joined-room", roomId);
  });

  socket.on("create-room", () => {
    const roomId = genRoomCode();
    socket.join(roomId);
    console.log("Room created", roomId);
    socket.emit("room-created", roomId);
  });

  socket.on("leave-room", ({ roomId, username }) => {
    socket.leave(roomId);
    io.to(roomId).emit("system-message", {
      message: `${username} left.`,
    });
    console.log(`${socket.id} left room ${roomId}`);
    socket.emit("left-room", roomId);
  });
  socket.on("send-message", ({ roomId, username, message }) => {
    const room = io.sockets.adapter.rooms.get(roomId);

    if (!room) return;
    // send to everyone including sender
    io.to(roomId).emit("receive-message", {
      username,
      message,
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    io.emit("online-users", io.engine.clientsCount);
  });
});
server.listen(3000, () => console.log("Server started"));
