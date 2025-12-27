import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { randomUUID } from "crypto";

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
type RoomStatus = "WAIT" | "READY" | "COUNTDOWN" | "PLAY" | "RESULT";

interface Player {
  socketId: string;
  userId: string;
  nickname: string;
}

interface Room {
  status: RoomStatus;
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
  socket.on("join-room", ({ userId, nickname }) => {
    // 1. 들어갈 방(WAIT상태의 방) 있는지 확인
    //키 값 한 쌍 => entry
    let entry = [...rooms.entries()].find(
      ([_, room]) => room.status === "WAIT" && room.players.size < 2
    );

    let roomId: string;
    let waitingRoom: Room;

    // 2. 들어갈방 없으면 새방 생성
    if (!entry) {
      roomId = randomUUID();
      waitingRoom = createRoom(roomId);
    } else {
      // 3. entry 구조분해
      [roomId, waitingRoom] = entry;
    }

    // 4. 플레이어 추가
    waitingRoom.players.set(socket.id, {
      socketId: socket.id,
      userId,
      nickname,
    });
    socket.join(roomId);
    console.log(
      `roomId=${roomId},players=${waitingRoom.players.size},status=${waitingRoom.status}`
    );
    // 5. 인원 다 찰으면 READY
    if (waitingRoom.players.size === 2) {
      waitingRoom.status = "READY";
      io.to(roomId).emit("room-ready");
    }
  });
  socket.on("disconnect", () => {
    console.log("disconnet:", socket.id);
  });
});

httpServer.listen(3000, () => {
  console.log("제대로 접속");
});
