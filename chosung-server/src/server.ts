import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite 기준
  },
});

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("server alive");
});

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);

  socket.on("ping", () => {
    socket.emit("pong");
  });

  socket.on("disconnect", () => {
    console.log("client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
