import { io } from "socket.io-client";

export const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("connected:", socket.id);
  socket.emit("ping");
});

socket.on("pong", () => {
  console.log("pong from server");
});
