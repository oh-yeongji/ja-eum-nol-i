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
        
         방 상태, 플레이어 설정

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

const createRoom = (roomId: string): Room => {
  const room: Room = {
    status: "WAIT",
    players: new Map(),
  };
  rooms.set(roomId, room);
  return room;
};

io.on("connection", (socket: Socket) => {
  console.log("connected:", socket.id);

  socket.on("join-room", () => {
    console.log("들어왔다.");
  });
});

httpServer.listen(3000, () => {
  console.log("제대로 접속");
});
