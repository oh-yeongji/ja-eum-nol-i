import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

/*========================
        
         방 상태 설정

==========================*/
type RoomStaus = "WAIT" | "READY" | "COUNTDOWN" | "PLAY" | "RESULT";

interface Player {
  socketId: string;
  userId: string;
  nickname: string;
}

interface Room {
  status: RoomStaus;
  players: Map<string, Player>;
  countdownTimer?: NodeJS.Timeout; 
}

const rooms = new Map<string, Room>();

httpServer.listen(5173, () => {
  console.log("제대로 접속");
});
